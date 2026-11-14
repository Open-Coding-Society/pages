require "minitest/autorun"
require "jekyll"
require "nokogiri"

class CapstonePostsTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  POSTS = Dir[File.join(ROOT, "_posts/capstone/**/*.md")].to_h do |path|
    [path, File.read(path)]
  end.freeze
  INCLUDE = /\{%\s*include\s+([^\s%]+)(.*?)%\}/m

  def test_capstone_includes_are_shared_or_parameterized_components
    sources = %w[_posts/**/*.md _includes/**/*.html _layouts/**/*.html navigation/**/*.md]
      .flat_map { |pattern| Dir[File.join(ROOT, pattern)] }
    uses = sources.flat_map { |path| File.read(path).scan(INCLUDE).map(&:first) }.tally

    POSTS.each do |path, text|
      text.scan(INCLUDE).each do |name, parameters|
        assert File.file?(File.join(ROOT, "_includes", name)), "#{path}: missing #{name}"
        assert uses.fetch(name) > 1 || !parameters.strip.empty?,
          "#{path}: put single-page markup in the post, not #{name}"
      end
    end
  end

  def test_embedded_html_lint_suppression_restores_the_surrounding_rules
    embedded = POSTS.select { |_, text| text.match?(/^\s*<!-- markdownlint-capture -->\s*$/) }
    refute_empty embedded

    embedded.each do |path, text|
      assert_equal text.scan("<!-- markdownlint-capture -->").size,
        text.scan("<!-- markdownlint-restore -->").size, path
      assert_match(
        /<!-- markdownlint-capture -->\s*<!-- markdownlint-disable -->.*?<!-- markdownlint-restore -->/m,
        text, path
      )
    end
  end

  def test_educators_post_renders_html_and_yaml_backed_liquid_at_both_baseurls
    ["", "/preview"].each do |baseurl|
      site = build_site(baseurl)
      html = render(site, "_posts/capstone/2026-02-06-educators-capstone.md")
      data = site.data.fetch("educators_infograph")

      assert_equal data.fetch("Title"), html.at_css(".ed-title").text
      assert_equal data.fetch("Topics").size, html.css(".ed-card").size
      assert_equal "#{baseurl}/images/#{data.fetch("Topics").first.fetch("image")}",
        html.at_css(".ed-image")["src"]
      assert_equal "#{baseurl}#{data.fetch("Topics").first.fetch("link")}",
        html.at_css(".ed-image-link")["href"]
      assert_empty html.css("pre code")
      refute_includes html.to_html, "{%"
      refute_includes html.to_html, "{{"
    end
  end

  def test_jarvis_inline_board_preserves_shared_navigation_footer_and_card_rendering
    site = build_site("")
    html = render(site, "_posts/capstone/Jarvis3000/2026-09-01-jarvis-capstone.md")
    board = html.at_css("[data-jarvis-kanban]")
    refute_nil board
    assert_equal site.data.fetch("jarvis_board").fetch("board").fetch("cards").size,
      board.css(".ocs__kanban-item").size
    assert_equal "/capstone/jarvis/", html.at_css("nav [aria-current=page]")["href"]
    assert_includes html.at_css(".ocs__capstone-footer").text,
      site.data.fetch("jarvis_infograph").fetch("Team").join(", ")
    assert_empty html.css("pre code")
  end

  private

  def build_site(baseurl)
    site = Jekyll::Site.new(Jekyll.configuration(
      "source" => ROOT, "config" => [], "plugins_dir" => [],
      "quiet" => true, "baseurl" => baseurl,
      "liquid" => { "error_mode" => "strict" }
    ))
    site.data = Jekyll::DataReader.new(site).read("_data")
    site
  end

  def render(site, relative_path)
    document = Jekyll::Document.new(
      File.join(ROOT, relative_path), site: site, collection: site.collections["posts"]
    )
    document.read
    page = document.to_liquid
    payload = site.site_payload
    payload["page"] = page
    liquid = site.liquid_renderer.file(relative_path).parse(document.content).render!(
      payload, registers: { site: site, page: page }
    )
    Nokogiri::HTML.fragment(
      site.find_converter_instance(Jekyll::Converters::Markdown).convert(liquid)
    )
  end
end
