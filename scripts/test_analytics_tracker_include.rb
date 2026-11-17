require "minitest/autorun"
require "fileutils"
require "jekyll"
require "tmpdir"

# _includes/head-custom.html loads assets/js/ocs-analytics-tracker.js, which posts each
# page's activity to Spring's /api/ocs-analytics/save. A Flask-only site (spring: false
# in _config.yml) leaves the tracker out and keeps the rest of the head. A site with
# spring: true, or with no spring setting, still loads it.
class AnalyticsTrackerIncludeTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  TRACKER = <<~HTML.freeze
    <!-- OCS Analytics Tracking Script (loaded on every page) -->
    <script src="/preview/assets/js/ocs-analytics-tracker.js" defer></script>
  HTML

  # The head a page gets, with spring set to the given value, or left out for :unset.
  def render(spring)
    Dir.mktmpdir("head-custom-") do |source|
      FileUtils.mkdir_p(File.join(source, "_includes"))
      FileUtils.cp(File.join(ROOT, "_includes", "head-custom.html"), File.join(source, "_includes"))
      config = {
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "quiet" => true, "baseurl" => "/preview", "liquid" => { "error_mode" => "strict" }
      }
      config["spring"] = spring unless spring == :unset
      site = Jekyll::Site.new(Jekyll.configuration(config))
      page = { "url" => "/topics/" }
      payload = site.site_payload
      payload["page"] = page
      Liquid::Template.parse("{% include head-custom.html %}", error_mode: :strict).render!(payload, registers: { site: site, page: page })
    end
  end

  def test_a_site_with_spring_loads_the_tracker_once
    [true, :unset].each do |spring|
      head = render(spring)
      assert_includes head, TRACKER, "spring: #{spring.inspect}"
      assert_equal 1, head.scan("ocs-analytics-tracker.js").size, "spring: #{spring.inspect}"
    end
  end

  def test_a_flask_only_site_leaves_out_only_the_tracker
    head = render(false)
    refute_includes head, "ocs-analytics-tracker.js"
    # Everything else matches the head with Spring, window.javaURI included, which other scripts read.
    assert_equal render(true).sub(TRACKER, "\n"), head
  end
end
