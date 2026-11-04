require "jekyll"
require "tmpdir"
require "fileutils"
require "nokogiri"

PROJECT = File.expand_path("..", __dir__)
require File.expand_path("../../../scripts/publish_project", PROJECT)

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

def render_sprint(sprint, with_lessons: true, course: "csse")
  Dir.mktmpdir("sprint-intro-") do |source|
    ProjectPublisher.run("publish", PROJECT, source)
    assert(!File.exist?(File.join(source, "_includes/sprint-direction/csse-sprint-3.html")),
           "Publication does not retain the old authored HTML")
    assert(!File.exist?(File.join(source, "_includes/sprint-intro/csse-sprint-3.md")),
           "Publication does not create an unnamespaced sprint intro")
    published = File.join(source, "_includes/projects/courses/sprint-intro/csse-sprint-3.md")
    assert(File.read(published) == File.read(File.join(PROJECT, "data/sprint-intro/csse-sprint-3.md")),
           "Publication includes the Markdown beside the course YAML")
    timestamp = File.mtime(published)
    ProjectPublisher.run("publish", PROJECT, source)
    assert(File.mtime(published) == timestamp, "Unchanged Markdown is not rewritten")
    File.write(File.join(source, "index.html"), <<~PAGE)
      ---
      title: Sprint 3
      player_page:
        sprint: 3
      ---
       {% assign current_course = "#{course}" %}
      {% assign lessonsByWeek = site.data.lesson_groups %}
      {% include player-pages/sprint.html %}
    PAGE
    site = Jekyll::Site.new(Jekyll.configuration(
      "source" => source, "destination" => File.join(source, "_site"),
      "includes_dir" => File.join(source, "_includes"), "layouts_dir" => File.join(source, "_layouts"),
      "config" => [], "plugins" => [], "plugins_dir" => [], "quiet" => true,
      "incremental" => false, "baseurl" => "/preview"
    ))
    site.read
    site.data = {
       course => { "Sprint3" => sprint },
      "cs" => { "Shared" => { "description" => "Shared description" } },
      "lesson_groups" => with_lessons ? [{ "name" => 9, "size" => 1, "items" => [] }] : []
    }
    site.generate
    site.render
    site.pages.find { |page| page.name == "index.html" }.output
  end
end

schedule = YAML.safe_load(File.read(File.join(PROJECT, "data/csse.yml")))
sprint = schedule.fetch("Sprint3")
assert(sprint.fetch("direction_include") == "projects/courses/sprint-intro/csse-sprint-3.md",
       "CSSE Sprint 3 selects its own directions")
html = render_sprint(sprint)
document = Nokogiri::HTML.fragment(html)
rubric = document.at_css("section[aria-label='Sprint directions']")
assert(rubric, "Configured directions render")
assert(rubric.previous_element.at_css(".ocs__stats"),
       "Directions follow the complete Weeks card, not its description or week cards")
assert(document.at_css("a[data-player-start]")["href"] == "/preview/csse/week-9/",
       "Existing week navigation is preserved")
assert(!rubric.at_css("a[href*='/csse/sprint3/objectives']"),
       "Directions do not link to the removed objectives notebook")
tables = rubric.css("table")
assert(tables.size == 1, "The phase-based assignment rubric renders")
tables.each do |table|
  rows = table.css("tbody tr")
  bonus_rows, regular_rows = rows.partition { |row| row.css("td")[1].text.include?("Bonus") }
  assert(regular_rows.sum { |row| Integer(row.css("td")[1].text.strip) } == 13,
         "Rubric preserves 13 regular points")
  assert(bonus_rows.size == 1 && bonus_rows.first.css("td")[1].text.strip.match?(/\A1\s+Bonus\z/),
         "Rubric keeps the one-point bonus separate")
  assert(rows.map { |row| row.css("td")[2].text.strip }.tally ==
         { "Phase 1" => 3, "Phase 2" => 2, "Phase 3" => 3, "Phase 4" => 2 },
         "Assignments retain their phase deadlines")
  assert(table["class"] == "ocs__table" && table.parent["class"] == "ocs__table-wrap",
         "Markdown tables use shared OCS styles and responsive wrappers")
  assert(table.css("thead th").map { |cell| cell.text.strip } == %w[Assignment Points Due],
         "Rubric retains assignment, points and due columns")
end
assert(rubric.at_css("h2.ocs__section-title#final-evaluation") &&
       rubric.at_css("h3.ocs__section-title") && rubric.at_css("p.ocs__text") &&
       rubric.at_css("ul.ocs__text"), "Markdown retains OCS heading, paragraph and list styles")
assert(!render_sprint(sprint.reject { |key, _| key == "direction_include" }).include?('aria-label="Sprint directions"'),
       "Sprints without directions keep their existing output")
shared = render_sprint(sprint.merge("shared" => "Shared"))
assert(shared.include?("Shared description") && shared.include?('aria-label="Sprint directions"'),
       "Course-specific directions work alongside shared descriptions")
assert(render_sprint(sprint, with_lessons: false).include?('aria-label="Sprint directions"'),
       "Directions remain visible before lessons are scheduled")
error = begin
  render_sprint(sprint.merge("direction_include" => "projects/courses/sprint-intro/missing.md"))
  nil
rescue IOError => e
  e
end
assert(error && error.message.include?("projects/courses/sprint-intro/missing.md"),
       "A missing configured include fails explicitly and identifies the path")

csp_sprint = YAML.safe_load(File.read(File.join(PROJECT, "data/csp.yml")), aliases: true).fetch("Sprint3")
csp_page = Nokogiri::HTML.fragment(render_sprint(csp_sprint, course: "csp"))
csp_intro = csp_page.at_css("section[aria-label='Sprint directions']")
assert(csp_intro, "CSP sprint renders its authored intro")
points_heading = csp_intro.css("h3").find { |heading| heading.text == "Points" }
points_wrap = points_heading&.next_element
assert(points_wrap && points_wrap.at_css("table"), "CSP scoring is a responsive table")
cpt_heading = points_wrap.next_element
assert(cpt_heading&.name == "h2" && cpt_heading.text == "Create Performance Task Requirements",
       "CPT requirements immediately follow the scoring table")
cpt_table = cpt_heading.at_xpath("following-sibling::div[contains(@class, 'ocs__table-wrap')][1]").at_css("table")
expected_requirements = ["Program with Purpose", "Input", "Output", "List or Other Collection",
                         "Student-Developed Procedure", "Sequencing", "Selection", "Iteration",
                         "Calling Procedures", "Testing and Errors"]
assert(cpt_table.css("tbody tr td:first-child").map(&:text) == expected_requirements,
       "CSP includes the complete CPT programming and testing checklist")
assert(csp_intro.css("ul, ol").empty?, "CSP intro uses headings and tables instead of nested outlines")
big_ideas = csp_intro.css("h3").select { |heading| heading.text.start_with?("Big Idea 1.", "Big Idea 2:", "Big Idea 4:") }
assert(big_ideas.size == 5 && big_ideas.all? { |heading| heading.next_element.at_css("table") },
       "All five Big Idea sections use a heading followed by a table")
csp_intro.css("table").each do |table|
  assert(table["class"] == "ocs__table" && table.parent["class"] == "ocs__table-wrap",
         "All CSP tables use existing OCS styling and scrolling wrappers")
end
point_rows = points_wrap.css("tbody tr")
bonus, regular = point_rows.partition { |row| row.css("td")[1].text.include?("Bonus") }
assert(point_rows.size == 10 && bonus.size == 1 &&
       regular.sum { |row| Integer(row.css("td")[1].text.strip) } == 13,
       "CSP retains ten assignments, thirteen regular points, and a separate bonus")
assert(csp_intro.text.include?("Personalized Project Reference") && csp_intro.text.match?(/\bon the AP exam\b/i),
       "CSP includes submission and exam-response guidance")
assert(!csp_intro.text.match?(/Postman/i) && csp_intro.text.include?("REST Client"),
       "CSP debugging guidance uses REST Client")

csa_sprint = YAML.safe_load(File.read(File.join(PROJECT, "data/csa.yml")), aliases: true).fetch("Sprint3")
assert(csa_sprint.fetch("direction_include") == "projects/courses/sprint-intro/csa-sprint-3.md",
       "CSA Sprint 3 selects its migrated capstone intro")
csa_page = Nokogiri::HTML.fragment(render_sprint(csa_sprint, course: "csa"))
csa_intro = csa_page.at_css("section[aria-label='Sprint directions']")
assert(csa_intro, "CSA Sprint 3 renders the migrated planning content")
assert(csa_intro.text.include?("Formal CS112/CS113 curriculum alignment begins in Sprint 4"),
       "CSA intro explains when formal CS112/CS113 alignment begins")
assert(csa_intro.text.include?("Not every student is expected to complete every advanced CS113 layer"),
       "CSA alignment does not imply every advanced layer is required")
{ "Assignments" => [5, 10], "Skills" => [4, 5] }.each do |label, (count, total)|
  heading = csa_intro.css("h3").find { |element| element.text == label }
  table = heading&.next_element&.at_css("table")
  assert(table, "CSA #{label} scoring is a table")
  rows = table.css("tbody tr").reject { |row| row.css("td").first.text == "Total" }
  assert(rows.size == count && rows.sum { |row| Integer(row.css("td")[1].text.strip) } == total,
         "CSA preserves its #{label.downcase} categories and #{total}-point total")
end
assert(csa_intro.css("ul, ol").empty?, "CSA uses heading/table sections like CSP")
csa_intro.css("table").each do |table|
  assert(table["class"] == "ocs__table" && table.parent["class"] == "ocs__table-wrap",
         "CSA tables use shared styling and responsive wrappers")
end
%w[/capstone/toolchain-trail/ /capstone/ocs-admin-security/ /capstone/submissions/
   /csa/csa2/ /csa/cs112/ /csa/cs113/ /navigation/java-reference/].each do |route|
  assert(csa_intro.at_css("a[href='/preview#{route}']"), "CSA preserves the capstone/curriculum link: #{route}")
end

puts "PASS: optional sprint directions, placement, rubric points, navigation, shared descriptions, and missing-file failure"
