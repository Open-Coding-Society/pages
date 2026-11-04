require_relative "test_support/curriculum_report"

sections = JSON.parse(File.read(File.join(ROOT, "_data/cs112_topics.json")))
expected_titles = [
  "I. Object-oriented programming (OOP): design and analysis",
  "II. Software engineering design: techniques and strategies",
  "III. Advanced language elements", "IV. Advanced data structures",
  "V. Graphics", "Lab Outline"
]
assert(sections.map { |section| section["title"] } == expected_titles, "Original CS112 section order")
topics = sections.flat_map { |section| section["topics"] }
assert(topics.size == 14, "All thirteen instructional subtopics and the lab outline")
ids = (sections + topics).map { |item| item["id"] }
assert(ids.uniq.size == ids.size, "Section and topic anchors must be unique")
topics.each do |topic|
  %w[coverage gap pbl].each do |key|
    assert(!topic.fetch(key).strip.empty?, "#{topic['id']} needs #{key} evidence")
  end
  assert(topic["lessons"].uniq == topic["lessons"], "No duplicate links within #{topic['id']}")
end

lessons = curriculum_sources("cs112")
routes = lessons.map { |lesson| lesson.fetch("permalink") }
mapped = topics.flat_map { |topic| topic["lessons"] }.uniq
assert(routes.sort == mapped.sort, "Map every remaining CS112 source, with no deleted-source entries")

html = render_report(sections, lessons)
expected_titles.each { |title| assert(html.include?(CGI.escapeHTML(title)), "Rendered heading: #{title}") }
topics.each do |topic|
  section_html = html.split("id=\"cs112-#{topic['id']}\"", 2)[1].split(/<h[23]|<\/section>/, 2)[0]
  topic["lessons"].each do |route|
    url = route.start_with?("/") ? route : "/#{route}"
    assert(section_html.include?("href=\"#{url}\""), "Correct topic placement for #{route}")
  end
end
assert(!html.include?("Awaiting CS112 topic mapping"), "All existing lessons are mapped")
assert(!html.include?("AP + CS112 topic groups"), "AP categories are not report sections")
assert(html.include?("FRQs are taught in CSA2 and beyond"), "Articulation does not change the FRQ teaching stage")
assert(html.include?("POJO, JPA, and APIs are introduced in CSA1 week 4"), "Early Web foundations retain their teaching stage")
assert(html.include?("prior Python Web and API work in APCSP"), "Explain the prerequisite experience behind early Web instruction")
assert(html.include?("supplemental AP + CS112 runner practice"), "Supplemental labels retained")
assert(html.include?("reference, not currently scheduled"), "Reference status retained")
assert(html.include?("unfinished authoring draft, planned week 19"), "Draft status and authoring target")
assert(html.include?("CSA week 22"), "Existing week assignments retained")
puts "PASS: original outline, all #{routes.size} current sources, topic placement, gaps, weeks, and drafts"

changed = Marshal.load(Marshal.dump(lessons))
removed = changed.find { |lesson| lesson["permalink"] == "/csa/frqs/2015/1" }
changed.delete(removed)
renamed = changed.find { |lesson| lesson["permalink"] == "/csa/frqs/2014/1" }
renamed["title"] = "Renamed <Array> Practice"
changed << { "title" => "New reference", "permalink" => "/csa/new-reference/", "lesson_group" => "cs112" }
changed << { "title" => "Hidden reference", "permalink" => "/csa/hidden/", "lesson_group" => "cs112", "hide" => true }
changed << { "title" => "New draft", "permalink" => "/csa/new-draft/", "lesson_group" => "cs112",
             "hide" => true, "lesson_status" => "draft", "planned_week" => 19 }
html = render_report(sections, changed)
assert(!html.include?('href="/csa/frqs/2015/1"'), "Deleted sources must not render dead links")
assert(html.include?("Renamed &lt;Array&gt; Practice"), "Read and escape current titles")
assert(html.include?('href="/csa/new-reference/"'), "New unmapped sources must remain visible")
assert(html.include?('href="/csa/new-draft/"'), "New unmapped drafts must remain visible")
assert(!html.include?('href="/csa/hidden/"'), "Hidden non-draft sources stay excluded")
assert(html.include?("Awaiting CS112 topic mapping"), "Unmapped-source notice")
puts "PASS: renames, deletion, escaping, new sources, hidden references, and unmapped drafts"

html = render_report(sections, [
  { "title" => "CSA2 reference", "permalink" => "/csa2/reference/", "lesson_group" => "csa2" },
  { "title" => "CSA2 draft", "permalink" => "/csa2/draft/", "lesson_group" => "csa2",
    "lesson_status" => "draft", "hide" => true, "planned_week" => 26 }
], "csa2")
assert(html.include?("Lessons and project references"), "Other collections retain their existing view")
assert(html.include?("Authoring drafts"), "Other collections retain draft listing")
assert(!html.include?("CS112 Instruction / Examples"), "CSA2 retains its collection view")
puts "PASS: other curriculum collection behavior is unchanged"
