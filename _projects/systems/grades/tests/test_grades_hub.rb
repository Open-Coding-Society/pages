# Checks the Grades hub (/grades/): every link in data/grades_hub.yml opens a
# page that has a source, every #name opens a section that page really has, and the
# top nav lists the hub; every section the Grades sidebar lists exists too. Run: bundle exec ruby scripts/test_grades_hub.rb
require "minitest/autorun"
require "yaml"

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
    assert_includes nav, "navigation/grades.html"
    refute_nil pages_by_permalink["/grades"], "navigation/grades.html serves /grades/"
  end
end
