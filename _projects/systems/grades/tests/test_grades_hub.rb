# Checks the Grades hub (/grades/): every link in data/grades_hub.yml opens a
# page that has a source, every #name opens a tab that page really has, and the
# top nav lists the hub. Run: bundle exec ruby scripts/test_grades_hub.rb
require "minitest/autorun"
require "yaml"

class GradesHubTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  SYSTEM = File.expand_path("..", __dir__)
  SECTIONS = YAML.load_file(File.join(SYSTEM, "data/grades_hub.yml"))
  LINKS = SECTIONS.flat_map { |section| section.fetch("links") }

  # Front matter of page sources (committed or new), keyed by permalink without a trailing slash.
  def pages_by_permalink
    @pages_by_permalink ||= `git -C #{ROOT} ls-files --cached --others --exclude-standard '*.md' '*.html'`.split("\n").each_with_object({}) do |path, pages|
      text = File.read(File.join(ROOT, path))
      front = text[/\A---\s*\n(.*?)\n---/m, 1] or next
      permalink = front[/^permalink:\s*(\S+)/, 1] or next
      pages[permalink.chomp("/")] = { text: text, layout: front[/^layout:\s*(\S+)/, 1] }
    end
  end

  # The page's own markup plus its layout's, where the tabs are defined. The
  # grading layouts live in this system; _layouts holds the others.
  def page_markup(page)
    layout = page[:layout] && [File.join(SYSTEM, "layouts"), File.join(ROOT, "_layouts")]
      .map { |dir| File.join(dir, "#{page[:layout]}.html") }.find { |path| File.exist?(path) }
    page[:text] + (layout ? File.read(layout) : "")
  end

  def test_sections_follow_the_issue_layout
    assert_equal %w[Grade Reflect Submissions], SECTIONS.map { |section| section["title"] }
    LINKS.each do |link|
      %w[title description].each { |key| refute_empty link[key].to_s.strip, "#{link['title']} needs a #{key}" }
      assert(link["url"] || link["spring_path"], "#{link['title']} needs a url or spring_path")
    end
  end

  def test_every_link_opens_an_existing_page_and_tab
    LINKS.select { |link| link["url"] }.each do |link|
      path, tab = link["url"].split("#", 2)
      page = pages_by_permalink[path.chomp("/")]
      refute_nil page, "#{link['title']}: no page source has permalink #{path}"
      next unless tab

      markup = page_markup(page)
      assert(markup.include?(%(id="tab-#{tab}")) || markup.include?(%(data-panel="#{tab}")),
             "#{link['title']}: #{path} has no tab named #{tab}")
    end
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
