require "json"
require "yaml"
require "date"
require "tmpdir"
require "jekyll"
require "nokogiri"
require_relative "publish_project"

ROOT = File.expand_path("..", __dir__)
PROJECT = File.join(ROOT, "_projects/lessons/flask")

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

def frontmatter(text)
  YAML.safe_load(text.split(/^---\s*$/, 3)[1], permitted_classes: [Date], aliases: true)
end

documents = Dir[File.join(PROJECT, "docs/**/*.md")].map do |path|
  [path, frontmatter(File.read(path))]
end
documents.concat(Dir[File.join(PROJECT, "notebooks/*.ipynb")].map do |path|
  notebook = JSON.parse(File.read(path))
  [path, frontmatter(notebook.fetch("cells").first.fetch("source").join)]
end)
documents.each do |path, data|
  assert(Array(data["categories"]).map(&:downcase).include?("flask") || data["courses"],
    "Flask category or course placement: #{path}")
  assert(data["permalink"], "Stable permalink: #{path}")
  source = if path.end_with?(".ipynb")
             JSON.parse(File.read(path)).fetch("cells").map { |cell| cell.fetch("source").join }.join("\n")
           else
             File.read(path)
           end
  assert(!source.match?(/postman/i), "Flask lessons consistently teach REST Client: #{path}")
end
routes = documents.map { |_, data| data.fetch("permalink").sub(%r{/$}, "") }
assert(routes.uniq.size == routes.size, "No duplicate Flask permalinks")
%w[/python/flask /python/flask/crash-course /flask/anatomy /python/flask/api /python/flask/jinja_ui /flask/overview /flask/deploy].each do |route|
  assert(routes.include?(route), "Existing route preserved: #{route}")
end
api_lessons = %w[/python/flask/api/jokes /flask/api/users /python/flask/api/microblog]
{ 9 => %w[/flask/anatomy /python/flask], 10 => %w[/python/flask/api] }.each do |week, scheduled_routes|
  scheduled = documents.select { |_, data| data.dig("courses", "csp", "week") == week }
  assert(scheduled.map { |_, data| data["permalink"] }.sort == scheduled_routes.sort,
    "Week #{week} has exactly its intended Flask pages")
end
api_routes = routes.select { |route| route.match?(%r{\A/python/flask/api(?:/|\z)}) || api_lessons.include?(route) }
assert(api_routes.sort ==
  (["/python/flask/api"] + api_lessons).sort,
  "The API collection contains only its hub and three lessons")
api_map = YAML.safe_load(File.read(File.join(ROOT, "_data/python_flask_api.yml")))
assert(api_map.fetch("Topics").map { |topic| topic.fetch("link") } == api_lessons,
  "The central API map links only Jokes, Users, and Microblog in sequence")
assert(!api_map.to_s.match?(/\bweeks?\b/i), "API map content does not repeat the course schedule")
top_level_map = YAML.safe_load(File.read(File.join(ROOT, "_data/python_flask.yml")))
assert(top_level_map.fetch("Topics").map { |topic| topic.fetch("link") } ==
      %w[/python/flask/crash-course /flask/anatomy /python/flask/api /python/flask/jinja_ui],
       "The top-level Flask map retains setup, anatomy, the API hub, and Jinja references")
curated_routes = ["/python/flask", "/flask/anatomy", "/python/flask/api"] + api_lessons
documents.select { |_, data| curated_routes.include?(data["permalink"]) }.each do |path, data|
  body = File.read(path).split(/^---\s*$/, 3).last
  visible = [data["title"], data["description"], body].join("\n")
  assert(!visible.match?(/\bweeks?\b/i), "Teaching-week labels stay in metadata, not lesson content: #{path}")
end
assert(!File.exist?(File.join(ROOT, "hacks/api-usage/jokes_flask.md")),
  "The retired standalone jokes demo cannot duplicate the Jokes permalink")
assert(File.read(File.join(ROOT, "_projects/.makeprojects")).lines.map(&:strip).include?("lessons/flask:dev"),
       "Flask is registered for development builds")
assert(Dir[File.join(ROOT, "_notebooks/CSP/flask/**/*.ipynb")].empty?, "No old notebook sources remain")
structure_path, = documents.find { |_, data| data["permalink"] == "/flask/anatomy" }
structure_source = File.read(structure_path)
structure_body = structure_source.split(/^---\s*$/, 3).last
structure_liquid = Liquid::Template.parse(structure_body).render!("site" => { "baseurl" => "/preview" })
markdown = Jekyll::Converters::Markdown.new(Jekyll.configuration("config" => [], "quiet" => true))
flask_map_path, = documents.find { |_, data| data["permalink"] == "/python/flask" }
flask_map_source = File.read(flask_map_path)
flask_map_body = flask_map_source.split(/^---\s*$/, 3).last
flask_map = Nokogiri::HTML.fragment(markdown.convert(flask_map_body))
assert(flask_map.at_css("h2#create-performance-task-priorities"), "The top-level Flask guide includes Create task priorities")
cpt_priorities = ["Program with Purpose", "Input", "Output", "List or Other Collection",
        "Student-Developed Procedure", "Sequencing", "Selection", "Iteration",
        "Calling Procedures", "Testing and Errors"]
assert(flask_map.css("tbody tr td:first-child").map(&:text) == cpt_priorities,
  "Create priorities cover purpose, input/output, abstraction, algorithm, calls, and testing")
assert(flask_map.text.include?("parameters must matter") && flask_map.text.include?("sequencing, selection, and iteration together"),
  "Create guidance distinguishes a qualifying procedure and its algorithm from scattered framework code")
assert(flask_map.text.include?("Personalized Project Reference") && flask_map.text.include?("completed on the AP exam"),
  "Submission guidance distinguishes the PPR from exam-day written responses")
%w[https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam
   https://apcentral.collegeboard.org/media/pdf/ap-csp-student-task-directions.pdf
   https://apcentral.collegeboard.org/media/pdf/ap-csp-personalized-project-reference-tip-sheet.pdf].each do |url|
  assert(flask_map.at_css("a[href='#{url}']"), "Create guidance links its official source: #{url}")
end
structure = Nokogiri::HTML.fragment(markdown.convert(structure_liquid))
assert(structure.css("style, script, html, head, body, [style], [onclick]").empty?,
  "Structure guide uses shared styling and native navigation, not a nested page or inline code")
assert(structure.at_css("nav .ocs__tree .ocs__tree") && structure.at_css(".ocs__table-wrap > .ocs__table"),
  "Structure guide uses OCS tree and responsive table grammar")
structure.css('nav a[href^="#"]').each do |link|
  assert(structure.at_css(link["href"]), "Structure tree destination exists: #{link['href']}")
end
assert(structure.css("[id]").map { |element| element["id"] }.uniq.size == structure.css("[id]").size,
  "Structure guide anchor IDs are unique")
assert(structure.at_css("#db-init-py .ocs__callout").text.include?("drop and recreate"),
  "Database initialization is explicitly identified as destructive")
assert(structure.at_css("#demo-app").text.include?("5001") && structure.at_css("#init-py").text.include?("8587"),
  "The standalone demo and full backend are distinguished")
assert(structure.at_css('a[href="/preview/python/flask/api"]'),
  "The retained structure guide links to the central API hub with the site base URL")
assert(structure.at_css("#main-py").text.include?("from __init__ import app, db, login_manager"),
  "Startup example imports the existing shared app")
%w[api/user.py model/user.py hacks/joke.py hacks/jokes.py api/microblog_api.py model/microblog.py].each do |path|
  assert(structure.at_css("[data-flask-path='#{path}']"), "Structure guide includes the teaching source: #{path}")
end
lesson_documents = api_lessons.map do |route|
  path, = documents.find { |_, data| data["permalink"] == route }
  body = File.read(path).split(/^---\s*$/, 3).last
  liquid = Liquid::Template.parse(body).render!("site" => { "baseurl" => "/preview" })
  rendered = Nokogiri::HTML.fragment(markdown.convert(liquid))
  assert(rendered.at_css('a[href="/preview/python/flask/api"]'), "Each API lesson links back to its hub: #{route}")
  assert(rendered.text.include?("manual checks"), "API checks are not presented as automated tests: #{route}")
  rendered
end
requests = lesson_documents.flat_map { |document| document.css("pre code").map(&:text) }.join("\n")
[
  "GET {{baseUrl}}/api/jokes/count",
  "GET {{baseUrl}}/api/jokes",
  "GET {{baseUrl}}/api/id",
  "GET {{baseUrl}}/api/microblog?limit=5",
  "POST {{baseUrl}}/api/microblog"
].each do |request|
  assert(requests.lines.map(&:strip).include?(request), "REST Client request survives Liquid: #{request}")
end
assert(!requests.include?("@baseUrl"), "Examples inherit the selected backend REST Client environment")
assert(JSON.parse(requests.split("\n\n").last.strip) == { "content" => "" },
       "Authenticated negative microblog example validates empty content without creating a post")
assert(lesson_documents[1].text.include?("kasm_server_needed"), "User lesson warns about provisioning side effects")
assert(lesson_documents[0].text.include?("hacks/jokes.py") && lesson_documents[0].text.include?("JSON file"),
  "Jokes teaches the file-backed data boundary")
assert(lesson_documents[1].text.include?("model/user.py") && lesson_documents[2].text.include?("model/microblog.py"),
  "User and microblog lessons identify the corresponding model calls")
retired_routes = %w[/flask--api /flask-debug-walk /python/flask/api/contracts-testing /flask-api
          /flask-code-login /flask-code-sign-up /microblog /python/flask/api/microblog/reference
          /api-basics/lesson/intro-extended /api-basics/lesson/async /api-basics/lesson/hacks
          /api-basics/lesson/handling-data /python/flask/api/basics/error-handling /digital-famine/microblog/api]
assert((routes & retired_routes).empty?, "Superseded API routes are no longer published sources")
flask_checkout = File.expand_path("../flask", ROOT)
if File.directory?(flask_checkout)
  structure.css("[data-flask-path]").each do |entry|
    assert(File.exist?(File.join(flask_checkout, entry["data-flask-path"])),
      "Documented path exists in sibling Flask checkout: #{entry['data-flask-path']}")
  end
end
Dir.mktmpdir("flask-publication-") do |destination|
  ProjectPublisher.run("publish", PROJECT, destination)
  Dir[File.join(PROJECT, "docs/**/*.md")].each do |source|
    relative = Pathname.new(source).relative_path_from(Pathname.new(File.join(PROJECT, "docs"))).to_s
    output = File.join(destination, "_posts/projects/flask/docs", relative)
    assert(File.exist?(output) && File.read(output) == File.read(source),
           "Markdown is published before course splitting without duplicate output names: #{source}")
  end
  assert(!Dir.exist?(File.join(destination, "_posts/flask")),
         "Flask documentation stays inside the standard project output root")
end
puts "PASS: #{documents.size} Flask sources, API hub, three API lessons, and retained non-API references"
