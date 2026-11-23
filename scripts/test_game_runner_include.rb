require "minitest/autorun"
require "jekyll"
require "nokogiri"

class GameRunnerIncludeTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)

  def render(options)
    site = Jekyll::Site.new(Jekyll.configuration(
      "source" => ROOT, "destination" => File.join(ROOT, "_site"),
      "config" => [], "plugins_dir" => [], "quiet" => true, "baseurl" => "/preview"
    ))
    page = { "permalink" => "/test/" }
    payload = site.site_payload
    payload["page"] = page
    markup = %({% include runners/game.html runner_id="test" code="" #{options} %})
    html = Liquid::Template.parse(markup, error_mode: :strict)
      .render!(payload, registers: { site: site, page: page })
    Nokogiri::HTML.fragment(html)
  end

  def test_level_selector_can_be_omitted_in_both_runner_modes
    ["", 'hide_edit="true"'].each do |mode|
      assert_equal 1, render(mode).css(".levelSelect").size
      runner = render(%(#{mode} hide_level_select="true"))
      assert_empty runner.css(".levelSelect")
      %w[run pause stop fullscreen].each do |control|
        assert_equal 1, runner.css(%([data-hook="#{control}"])).size
      end
      assert_equal 1, render(%(#{mode} hide_engine_select="true")).css(".engineVersionSelect[hidden]").size
    end
  end
end
