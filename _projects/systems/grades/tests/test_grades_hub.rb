# Checks the Grades hub (/grades/): every link in data/grades_hub.yml opens a
# page that has a source, every #name opens a section that page really has, and the
# top nav lists the hub; every section the Grades sidebar lists exists too. Run: bundle exec ruby scripts/test_grades_hub.rb
require "minitest/autorun"
require "yaml"
require "jekyll"
require "nokogiri"
require "tmpdir"
require "fileutils"

class GradesHubTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  SYSTEM = File.expand_path("..", __dir__)
  SECTIONS = YAML.load_file(File.join(SYSTEM, "data/grades_hub.yml"))
  LINKS = SECTIONS.flat_map { |section| section.fetch("links") }
  SIDEBAR_ITEMS = YAML.load_file(File.join(SYSTEM, "data/grades_sidebar.yml")).flat_map { |section| section.fetch("items") }
  SIDEBAR_TEMPLATE = File.read(File.join(ROOT, "_includes/aesthetihawk/sidebar-list.html"))

  # Front matter of page sources (committed or new), keyed by permalink without a trailing slash.
  def pages_by_permalink
    @pages_by_permalink ||= `git -C #{ROOT} ls-files --cached --others --exclude-standard '*.md' '*.html'`.split("\n").each_with_object({}) do |path, pages|
      next unless File.file?(File.join(ROOT, path))
      text = File.read(File.join(ROOT, path))
      front = text[/\A---\s*\n(.*?)\n---/m, 1] or next
      permalink = front[/^permalink:\s*(\S+)/, 1] or next
      pages[permalink.chomp("/")] = { text: text, layout: front[/^layout:\s*(\S+)/, 1] }
    end
  end

  # The page's own markup, its layout's, and the includes the layout uses, where the
  # sections are defined. The grading layouts and includes live in this system;
  # _layouts and _includes hold the others.
  def page_markup(page)
    layout = page[:layout] && first_existing(%w[layouts _layouts], "#{page[:layout]}.html")
    markup = page[:text] + (layout ? File.read(layout) : "")
    includes = markup.scan(/\{%-?\s*include\s+(\S+)/).flatten.filter_map { |name| first_existing(%w[_includes], name) }
    markup + includes.map { |path| File.read(path) }.join
  end

  def first_existing(dirs, name)
    name = name.delete_prefix("projects/grades/")
    dirs.flat_map { |dir| [File.join(SYSTEM, dir), File.join(ROOT, dir)] }
        .map { |dir| File.join(dir, name) }.find { |path| File.exist?(path) }
  end

  def test_sections_follow_the_issue_layout
    assert_equal %w[Grade Reflect Submissions], SECTIONS.map { |section| section["title"] }
    LINKS.each do |link|
      %w[title description].each { |key| refute_empty link[key].to_s.strip, "#{link['title']} needs a #{key}" }
      assert(link["url"] || link["spring_path"], "#{link['title']} needs a url or spring_path")
    end
  end

  # A #name link opens the element marked data-section="name" (see js/page-sections.js).
  def assert_opens_section(label, url)
    path, section = url.split("#", 2)
    page = pages_by_permalink[path.chomp("/")]
    refute_nil page, "#{label}: no page source has permalink #{path}"
    return unless section

    assert page_markup(page).include?(%(data-section="#{section}")), "#{label}: #{path} has no section named #{section}"
  end

  def test_every_link_opens_an_existing_page_and_section
    LINKS.select { |link| link["url"] }.each { |link| assert_opens_section(link["title"], link["url"]) }
  end

  def test_sidebar_sections_open_sections_of_their_page
    with_sections = SIDEBAR_ITEMS.select { |item| item["children"] }
    assert_equal %w[analytics retrospective submissions], with_sections.map { |item| item["id"] }
    with_sections.each do |item|
      item["children"].each do |child|
        refute_empty child["title"].to_s.strip, "#{item['title']}: every section needs a title"
        assert_opens_section("#{item['title']} > #{child['title']}", "#{item['url']}##{child['section']}")
      end
    end
  end

  def test_sidebar_renders_child_sections_as_links
    assert_includes SIDEBAR_TEMPLATE, "{% if item.children %}"
    assert_includes SIDEBAR_TEMPLATE, 'class="ocs__tree ml-7 mr-4 my-1"'
    assert_includes SIDEBAR_TEMPLATE, 'data-sidebar-section="{{ child.section }}"'
    assert_includes SIDEBAR_TEMPLATE, 'href="{{ site.baseurl }}{{ item.url }}#{{ child.section }}"'
    assert_includes SIDEBAR_TEMPLATE, "{{ child.title }}"
  end

  def test_spring_links_are_paths_on_the_spring_backend
    LINKS.select { |link| link["spring_path"] }.each do |link|
      assert_match %r{\A/[\w/-]+\z}, link["spring_path"], "#{link['title']} spring_path"
    end
  end

  def test_top_nav_lists_the_hub
    nav = YAML.load_file(File.join(ROOT, "_config.yml")).dig("minima", "nav_pages")
    assert_includes nav, "navigation/projects/grades/index.md"
    refute_nil pages_by_permalink["/grades"], "Grades index serves /grades/"
  end

  def test_page_html_and_scripts_survive_markdown
    converter = Jekyll::Converters::Markdown.new(Jekyll.configuration("config" => [], "quiet" => true))
    %w[analytics-dashboard retrospective submissions].each do |name|
      page = File.read(File.join(SYSTEM, "pages/#{name}.md"))
      assert_match(/^layout: opencsplus$/, page, "#{name} uses the shared layout")
      body = page[/\{::nomarkdown\}\n(.*?)\n\{:\/\}/m, 1]
      refute_nil body, "#{name} HTML must be protected from Markdown conversion"
      markdown = page.sub(/\A---\s*\n.*?\n---\s*\n/m, "")
      assert_includes converter.convert(markdown), body
    end
  end

  def test_hub_layout_has_no_project_nudge_or_empty_title_row
    Dir.mktmpdir("grades-layout-") do |source|
      FileUtils.mkdir_p(File.join(source, "_layouts"))
      FileUtils.mkdir_p(File.join(source, "_includes/aesthetihawk"))
      FileUtils.mkdir_p(File.join(source, "_includes/themes/minima"))
      FileUtils.mkdir_p(File.join(source, "_includes/projects/grades/submissions"))
      FileUtils.mkdir_p(File.join(source, "_data/projects/grades"))
      FileUtils.cp(File.join(SYSTEM, "data/grades_sidebar.yml"), File.join(source, "_data/projects/grades"))
      FileUtils.cp(File.join(ROOT, "_layouts/opencsplus.html"), File.join(source, "_layouts"))
      FileUtils.cp(File.join(ROOT, "_layouts/opencs.html"), File.join(source, "_layouts"))
      FileUtils.cp(File.join(ROOT, "_layouts/aesthetihawk.html"), File.join(source, "_layouts"))
      FileUtils.cp(File.join(ROOT, "_includes/themes/minima/base.html"), File.join(source, "_includes/themes/minima"))
      FileUtils.cp(File.join(ROOT, "_includes/head-custom.html"), File.join(source, "_includes"))
      %w[header-shared.html sidebar.html sidebar-list.html].each do |name|
        FileUtils.cp(File.join(ROOT, "_includes/aesthetihawk", name), File.join(source, "_includes/aesthetihawk"))
      end
      File.write(File.join(source, "_includes/head.html"), "<head>{% include head-custom.html %}</head>")
      File.write(File.join(source, "_includes/themes/minima/header.html"), "<header>Header</header>")
      File.write(File.join(source, "_includes/themes/minima/footer.html"), "<footer>Footer</footer>")
      File.write(File.join(source, "_includes/mermaid.html"), "")
      File.write(File.join(source, "_layouts/profile.html"), "---\nlayout: opencsplus\n---\n<p>Profile layout</p>{{ content }}")
      File.write(File.join(source, "grades.html"), "---\nlayout: opencsplus\ntitle: Grades\nsidebar: grades_sidebar\nsidebar_project: grades\n---\n<p>Grades content</p>\n")
      File.write(File.join(source, "profile.html"), "---\nlayout: profile\ntitle: Profile\nopencsplus: true\n---\n<p>Profile content</p>\n")
      File.write(File.join(source, "legacy.html"), "---\nlayout: aesthetihawk\ntitle: Legacy\n---\n<p>Legacy content</p>\n")
      FileUtils.cp(File.join(ROOT, "navigation/toolkit/bathroom_pass.md"), File.join(source, "bathroom_pass.md"))
      FileUtils.cp(File.join(ROOT, "navigation/toolkit/bathroom_queue.md"), File.join(source, "bathroom_queue.md"))
      %w[retrospective submissions].each do |name|
        FileUtils.cp(File.join(SYSTEM, "pages/#{name}.md"), File.join(source, "#{name}.md"))
      end
      FileUtils.cp(File.join(SYSTEM, "_includes/submissions/creator-dashboard.html"), File.join(source, "_includes/projects/grades/submissions"))
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"),
        "layouts_dir" => File.join(source, "_layouts"), "includes_dir" => File.join(source, "_includes"),
        "config" => [], "plugins_dir" => [], "quiet" => true
      ))
      site.process
      grades = File.read(File.join(source, "_site/grades.html"))
      profile = File.read(File.join(source, "_site/profile.html"))
      legacy = File.read(File.join(source, "_site/legacy.html"))
      bathroom = site.pages.find { |page| page.name == "bathroom_pass.md" }.output
      bathroom_queue = site.pages.find { |page| page.name == "bathroom_queue.md" }.output
      retrospective = site.pages.find { |page| page.name == "retrospective.md" }.output
      submissions = site.pages.find { |page| page.name == "submissions.md" }.output
      %w[sprint growth forecast].each { |section| assert_includes retrospective, %(data-section="#{section}") }
      %w[my-submissions created-assignments all-submissions].each { |section| assert_includes submissions, %(data-section="#{section}") }
      assert_includes submissions, 'id="creator-dashboard-summary"'
      assert_includes submissions, "document.addEventListener('DOMContentLoaded', init);"
      document = Nokogiri::HTML(submissions)
      assert document.at_css("#submission-edit-modal.ocs__modal.edit-modal.hidden[aria-hidden='true'] .ocs__modal-card[role='dialog']")
      assert document.at_css("#created-assignments-loading .ocs__spinner[aria-hidden='true']")
      [grades, profile, legacy, bathroom, bathroom_queue].each { |page| refute_includes page, "Got thoughts on a project?" }
      assert_includes grades, '<h1 class="ocs__hub-viewer-title">Grades</h1>'
      assert_includes grades, 'data-sidebar-role="default"'
      assert_includes grades, "View Grades"
      assert_includes grades, '<footer>Footer</footer>'
      assert_includes grades, "opencsplus-page"
      assert_includes profile, "<p>Profile layout</p>"
      assert_equal 1, grades.scan("<html").size
      assert_equal 1, grades.scan("<head>").size
      assert_equal 1, grades.scan("<body>").size
      assert_equal 1, grades.scan("https://cdn.tailwindcss.com").size
      assert_equal 0, grades.scan("toastify.min.css").size
      assert_equal 1, profile.scan("<head>").size
      assert_equal 1, profile.scan("https://cdn.tailwindcss.com").size
      assert_equal 1, legacy.scan("<html").size
      assert_equal 1, legacy.scan("<head>").size
      assert_equal 1, legacy.scan("<body>").size
      assert_includes legacy, "opencsplus-page"
      assert_includes legacy, "<p>Legacy content</p>"
      assert_equal 1, legacy.scan("toastify.min.css").size
      assert_includes bathroom, '<h2 class="ocs__bathroompass-v2-title">'
      assert_equal 1, bathroom.scan("<head>").size
      assert_equal 1, bathroom.scan("toastify.min.css").size
      assert_equal 1, bathroom.scan("face-api.js").size
      assert_equal 1, bathroom_queue.scan("<head>").size
      assert_equal 1, bathroom_queue.scan("toastify.min.css").size
      assert_equal 0, bathroom_queue.scan("face-api.js").size
      refute_includes grades, "mt-[53px]"
      refute_includes grades, "justify-between items-center mb-8"
    end
  end
end
