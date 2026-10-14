require_relative "test_support/curriculum_report"

sections = JSON.parse(File.read(File.join(ROOT, "_data/cs113_topics.json")))
expected_titles = [
  "I. Object-oriented programming (OOP) design and algorithmic analysis",
  "II. Data structures and collections",
  "III. Graphs, hash tables, sets, and maps",
  "IV. Recursion",
  "V. Analysis and efficiency of sort and search methods",
  "Lab Outline"
]
assert(sections.map { |section| section["title"] } == expected_titles, "Original CS113 section order")
topics = sections.flat_map { |section| section["topics"] }
assert(sections.map { |section| section["topics"].size } == [7, 3, 3, 2, 3, 1],
       "Every CS113 subtopic, including all three testing subtopics")
ids = (sections + topics).map { |item| item["id"] }
assert(ids.uniq.size == ids.size, "Unique section and topic anchors")
topics.each do |topic|
  %w[coverage gap pbl].each do |key|
    assert(!topic.fetch(key).strip.empty?, "#{topic['id']} needs #{key} evidence")
  end
  assert(topic["lessons"].uniq == topic["lessons"], "No duplicate links within #{topic['id']}")
end

lessons = curriculum_sources("cs113")
routes = lessons.map { |lesson| lesson.fetch("permalink") }
mapped = topics.flat_map { |topic| topic["lessons"] }.uniq
assert(routes.sort == mapped.sort, "Map all current CS113 sources with no deleted-source entries")

html = render_report(sections, lessons, "cs113")
positions = expected_titles.map { |title| html.index("<h2 id=" + "\"cs113-#{sections.find { |s| s['title'] == title }['id']}\"") }
assert(positions.all? && positions == positions.sort, "Render the original outline in order")
expected_titles.each { |title| assert(html.include?(CGI.escapeHTML(title)), "Rendered heading: #{title}") }
topics.each do |topic|
  topic_html = html.split("id=\"cs113-#{topic['id']}\"", 2)[1].split(/<h[23]|<\/section>/, 2)[0]
  %w[Available Strengthening PBL].each do |label|
    assert(topic_html.include?(label), "Render #{label} for #{topic['id']}")
  end
  topic["lessons"].each do |route|
    url = route.start_with?("/") ? route : "/#{route}"
    assert(topic_html.include?("href=\"#{url}\""), "Correct topic placement for #{route}")
  end
end
assert(!html.include?("Awaiting CS113 topic mapping"), "All current sources are mapped")
assert(!html.include?("CS112 Instruction / Examples"), "Keep report introductions separate")
assert(!html.include?('id="cs112-'), "Keep anchors scoped to CS113")
assert(html.include?("CSA week 14") && html.include?("CSA week 15"), "Retain early search/sort scheduling")
assert(html.include?("reference, not currently scheduled"), "Preserve unscheduled reference labels")
assert(html.include?("unfinished authoring draft, planned week 34"), "Drafts are not live assignments")
assert(html.include?("Not every student is expected to complete every layer"), "Preserve differentiated depth")
assert(html.include?("DS2 ML/AI remains an alternative pathway"), "Preserve the alternative pathway")
assert(html.include?("No completed dedicated lesson is available"), "Keep dynamic-programming gap explicit")
assert(html.include?("2-3-4 tree and skip-list lessons are still needed"), "Do not claim missing tree coverage")
puts "PASS: CS113 original outline, 19 subtopics, all #{routes.size} sources, gaps, schedules, and differentiation"

changed = Marshal.load(Marshal.dump(lessons))
changed.reject! { |lesson| lesson["permalink"] == "/csa/sorting/common" }
renamed = changed.find { |lesson| lesson["permalink"] == "/graphs/java" }
renamed["title"] = "Renamed <Graph> Lesson"
renamed["courses"] = { "csa" => { "week" => 26 } }
changed << { "title" => "Unmapped reference", "permalink" => "/cs113/new/", "lesson_group" => "cs113" }
changed << { "title" => "Unmapped draft", "permalink" => "/cs113/draft/", "lesson_group" => "cs113",
             "hide" => true, "lesson_status" => "draft", "planned_week" => 35 }
changed << { "title" => "Hidden reference", "permalink" => "/cs113/hidden/", "lesson_group" => "cs113", "hide" => true }
changed << { "title" => "Other course", "permalink" => "/cs112/other/", "lesson_group" => "cs112" }
html = render_report(sections, changed, "cs113")
assert(!html.include?('href="/csa/sorting/common"'), "Deleted sources must not create dead links")
assert(html.include?("Renamed &lt;Graph&gt; Lesson"), "Render and escape current titles")
assert(html.match?(/Renamed &lt;Graph&gt; Lesson<\/a>\s*&mdash; CSA week 26/), "Read current week metadata")
assert(html.include?("Awaiting CS113 topic mapping"), "Show unmapped sources explicitly")
assert(html.include?('href="/cs113/new/"') && html.include?('href="/cs113/draft/"'),
       "New references and drafts remain visible")
assert(!html.include?('href="/cs113/hidden/"'), "Hidden non-drafts remain excluded")
assert(!html.include?('href="/cs112/other/"'), "Other lesson groups are excluded")
assert(html.include?("No published lesson or authoring draft") == false, "Other mapped examples remain after deletion")
puts "PASS: CS113 renames, deletions, updated weeks, hidden sources, unmapped drafts, and collection isolation"

empty_html = render_report(sections, [], "cs113")
assert(empty_html.scan("No published lesson or authoring draft").size == topics.size,
       "Empty topics stay visible with an explicit coverage notice")
puts "PASS: empty outline topics remain visible rather than disappearing"
