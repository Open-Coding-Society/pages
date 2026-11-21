require "minitest/autorun"
require "fileutils"
require "jekyll"
require "nokogiri"
require "tmpdir"

# The calendar ticker include, from its Courses source, rendered by Jekyll's own include tag with
# strict Liquid: the empty bar CalendarTicker fills (js/announcement-calendar/calendar-ticker.js),
# with the look-ahead from calendar_ticker in _config.yml, nothing at all on a Flask-only site, its
# script and school weeks once per page, and the Calendar system's linked-doc and alert readers
# only when that system is built. The course home puts it above the announcements.
class CalendarTickerIncludeTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)
  DATA = { "school_calendar" => SafeYAML.load_file(File.join(ROOT, "_data/school_calendar.yml")) }.freeze
  TICKER_SCRIPT = "/preview/assets/js/chat/calendar/calendar-ticker.js".freeze
  DOC_LINKS = "/preview/assets/js/projects/calendar/CalendarDocLinks.js".freeze
  ALERTS = "/preview/assets/js/projects/calendar/CalendarAlerts.js".freeze
  INCLUDES = %w[
    ocs_calendar_ticker.html ocs_calendar_card.html ocs_calendar_card_data.html announcement_chat.html player-pages/home.html
  ].freeze

  def includes
    INCLUDES.to_h { |name| [name, File.read(File.join(PROJECT, "_includes", name))] }
  end

  # A page's Liquid rendered the way Jekyll renders a page. `spring` and `ticker` are _config.yml's
  # spring and calendar_ticker settings; `calendar_built` puts the Calendar system's published
  # CalendarDocLinks.js and CalendarAlerts.js on the site.
  def render(markup, page = {}, spring: nil, ticker: nil, calendar_built: true)
    Dir.mktmpdir("calendar-ticker-") do |source|
      includes.each do |name, text|
        path = File.join(source, "_includes", name)
        FileUtils.mkdir_p(File.dirname(path))
        File.write(path, text)
      end
      config = {
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "quiet" => true, "baseurl" => "/preview", "liquid" => { "error_mode" => "strict" }
      }
      config["spring"] = spring unless spring.nil?
      config["calendar_ticker"] = ticker unless ticker.nil?
      site = Jekyll::Site.new(Jekyll.configuration(config))
      site.data = DATA
      if calendar_built
        FileUtils.mkdir_p(File.join(source, "assets/js/projects/calendar"))
        %w[CalendarDocLinks.js CalendarAlerts.js].each do |name|
          File.write(File.join(source, "assets/js/projects/calendar", name), "")
          site.static_files << Jekyll::StaticFile.new(site, source, "/assets/js/projects/calendar", name)
        end
      end
      payload = site.site_payload
      payload["page"] = page
      Liquid::Template.parse(markup, error_mode: :strict).render!(payload, registers: { site: site, page: page })
    end
  end

  def count(html, text)
    html.scan(text).size
  end

  def test_the_bar_is_the_tickers_empty_shell_for_the_pages_course
    html = render("{% include ocs_calendar_ticker.html %}", { "course" => "csp" })
    wrapper = Nokogiri::HTML.fragment(html).at_css("div[data-ocs-calendar-ticker]")
    assert wrapper, "the wrapper CalendarTicker looks for"
    assert_equal "csp", wrapper["data-course"]
    assert_equal "/preview/student/calendar", wrapper["data-calendar-url"]
    assert wrapper.key?("hidden"), "hidden until there is something to show"

    section = wrapper.at_css("section.ocs__ticker")
    label = section.at_css("p.ocs__ticker-label")
    assert_equal "ocs-calendar-ticker-csp", label["id"]
    assert_equal label["id"], section["aria-labelledby"]
    assert_equal "Coming up", label.text
    switch = section.at_css("label.ocs__toggle.ocs__ticker-switch")
    assert switch.at_css('input.ocs__toggle-input[type="checkbox"]'), "the Pause switch"
    assert_equal "Pause", switch.at_css(".ocs__toggle-label").text
    track = section.at_css(".ocs__ticker-viewport > .ocs__ticker-track[data-hook=\"track\"]")
    assert track, "the track CalendarTicker fills"
    assert_empty track.children
    assert_nil section["class"][/ocs__ticker--moving/], "it starts still"
  end

  def look_ahead(html)
    wrapper = Nokogiri::HTML.fragment(html).at_css("[data-ocs-calendar-ticker]")
    %w[data-school-days-ahead data-days-ahead data-alert-limit-days].map { |name| wrapper[name] }
  end

  def test_the_look_ahead_comes_from_calendar_ticker_in_the_config
    ticker = { "school_days_ahead" => 3, "days_ahead" => 10, "alert_limit_days" => 14 }
    assert_equal %w[3 10 14], look_ahead(render("{% include ocs_calendar_ticker.html %}", {}, ticker: ticker))
  end

  def test_a_site_without_calendar_ticker_gets_the_documented_defaults
    assert_equal %w[5 7 30], look_ahead(render("{% include ocs_calendar_ticker.html %}"))
  end

  def test_zero_is_a_setting_not_a_missing_one
    ticker = { "school_days_ahead" => 0, "days_ahead" => 0, "alert_limit_days" => 0 }
    assert_equal %w[0 0 0], look_ahead(render("{% include ocs_calendar_ticker.html %}", {}, ticker: ticker))
  end

  def test_a_page_without_a_course_shows_every_course
    html = render("{% include ocs_calendar_ticker.html %}")
    assert_equal "all", Nokogiri::HTML.fragment(html).at_css("[data-ocs-calendar-ticker]")["data-course"]
  end

  def test_course_and_title_options_are_text
    html = render(%({% include ocs_calendar_ticker.html course='csa" onclick="alert(1)' title='Due <b>soon</b>' %}))
    wrapper = Nokogiri::HTML.fragment(html).at_css("[data-ocs-calendar-ticker]")
    assert_equal 'csa" onclick="alert(1)', wrapper["data-course"]
    assert_nil wrapper["onclick"]
    label = wrapper.at_css("p.ocs__ticker-label")
    assert_equal "Due <b>soon</b>", label.text
    assert_nil label.at_css("b")
    assert_match(/\Aocs-calendar-ticker-[a-z0-9-]+\z/, label["id"], "the id is a slug")
    assert_equal label["id"], wrapper.at_css("section")["aria-labelledby"]
  end

  def test_a_flask_only_site_gets_no_bar_and_no_script
    html = render("{% include ocs_calendar_ticker.html %}", { "course" => "csa" }, spring: false)
    assert_equal "", html.strip
  end

  def test_a_site_that_doesnt_set_spring_gets_the_bar
    html = render("{% include ocs_calendar_ticker.html %}", { "course" => "csa" }, spring: true)
    assert_equal 1, count(html, "data-ocs-calendar-ticker")
  end

  def test_the_script_and_school_weeks_go_on_the_page_once
    html = render(%({% include ocs_calendar_ticker.html course="csa" %}{% include ocs_calendar_ticker.html course="csp" %}{% include ocs_calendar_card.html course="csa" %}))
    assert_equal 2, count(html, "data-ocs-calendar-ticker ")
    assert_equal 1, count(html, TICKER_SCRIPT)
    assert_equal 1, count(html, 'id="ocsSchoolCalendarData"')
    assert_equal 1, count(html, "CalendarTicker.mountAll(document")
  end

  def test_the_linked_doc_reader_is_imported_only_when_the_calendar_system_is_built
    built = render("{% include ocs_calendar_ticker.html %}")
    assert_equal 1, count(built, DOC_LINKS)
    assert_match(/splitLinkedDoc: splitLinkedDoc\b/, built)

    dev = render("{% include ocs_calendar_ticker.html %}", {}, calendar_built: false)
    assert_equal 0, count(dev, "CalendarDocLinks")
    assert_match(/splitLinkedDoc: null\b/, dev)
  end

  def test_the_alert_reader_is_imported_only_when_the_calendar_system_is_built
    built = render("{% include ocs_calendar_ticker.html %}")
    assert_equal 1, count(built, ALERTS)
    assert_match(/calendarAlerts: CalendarAlerts\b/, built)

    dev = render("{% include ocs_calendar_ticker.html %}", {}, calendar_built: false)
    assert_equal 0, count(dev, "CalendarAlerts.js")
    assert_match(/calendarAlerts: null\b/, dev)
  end

  def test_the_course_home_puts_the_ticker_above_the_announcements
    html = render("{% include player-pages/home.html %}", { "course" => "csa" })
    home = Nokogiri::HTML.fragment(html).at_css(".course-home")
    ticker = home.at_css("[data-ocs-calendar-ticker]")
    chat = home.at_css("#announcementChat")
    assert ticker, "the course home has the ticker"
    assert_equal "csa", ticker["data-course"]
    assert chat, "and the announcements"
    order = home.css("[data-ocs-calendar-ticker], #announcementChat").map { |node| node.name }
    assert_equal %w[div section], order, "the ticker comes first"
  end
end
