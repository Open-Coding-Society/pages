require_relative "test_support/curriculum_report"

%w[cs112 cs113].each do |group|
  sections = JSON.parse(File.read(File.join(ROOT, "_data/#{group}_topics.json")))
  references = java_reference_sources(sections)
  lessons = curriculum_sources(group)
  html = render_report(sections, lessons, group, references)
  sections.flat_map { |section| section["topics"] }.each do |topic|
    topic_html = html.split("id=\"#{group}-#{topic['id']}\"", 2)[1].split(/<h[23]|<\/section>/, 2)[0]
    topic.fetch("supporting_lessons", []).each do |route|
      assert(topic_html.include?("href=\"#{route}\""), "Place #{route} under #{group}/#{topic['id']}")
      assert(topic_html.match?(/href="#{Regexp.escape(route)}"[^<]*>.*?<\/a>\s*&mdash; supporting Java reference/m),
             "Label #{route} as a supporting Java reference")
    end
  end
  assert(html.include?('href="/navigation/java-reference/"'), "Java Reference navigation link")
  assert(!html.include?("Awaiting #{group.upcase} topic mapping"), "Only owned lessons appear in unmapped checks")
  assert(html.include?("supporting Java reference"), "Supporting labels are visible")
  reference = references.first
  changed = Marshal.load(Marshal.dump(references))
  changed.first["title"] = "Updated <Java> Reference"
  changed.first["courses"] = { "csa" => { "week" => 18 } }
  changed << { "title" => "Unselected Java", "permalink" => "/java/unselected/", "lesson_language" => "Java" }
  html = render_report(sections, lessons, group, changed)
  assert(html.include?("Updated &lt;Java&gt; Reference"), "Read current supporting titles")
  assert(html.match?(/Updated &lt;Java&gt; Reference<\/a>\s*&mdash; supporting Java reference\s*&mdash; CSA week 18/),
         "Read existing week metadata without adding assignments")
  assert(!html.include?('href="/java/unselected/"'), "Do not append the entire Java library to each report")
  html = render_report(sections, lessons, group, references.reject { |item| item == reference })
  assert(!html.include?("href=\"#{reference['permalink']}\""), "Deleted Java sources do not render dead links")
  puts "PASS: #{group} maps #{references.size} Java references, retains identity and weeks, and handles renames/deletions"
end
