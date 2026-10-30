require "minitest/autorun"
require "fileutils"
require "jekyll"
require "json"
require "nokogiri"
require "open3"
require "tmpdir"

# The calendar card include and its data include, from their Courses sources,
# rendered by Jekyll's own include tag with strict Liquid. Every card a page
# shows today renders byte for byte as it did before template=true and the
# data include; titles and courses are escaped; and with template=true the
# include gives only the empty card that createCalendarCardSection
# (js/announcement-calendar/calendar-card.js) copies.
class CalendarCardIncludeTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)
  CARD = "_projects/systems/courses/_includes/ocs_calendar_card.html".freeze
  # Upstream main just before template=true and the data include.
  BEFORE = "ec788887e23801bef6ea23ec4886dd74daef18f6".freeze
  DATA = { "school_calendar" => SafeYAML.load_file(File.join(ROOT, "_data/school_calendar.yml")) }.freeze
  SCRIPT = "/preview/assets/js/chat/calendar/calendar-card.js".freeze

  # Today's cards, as the CS112 calendar smart card lesson writes them, and the
  # defaults the include documents (the page's course, else all).
  PAGES = {
    "a course" => ['{% include ocs_calendar_card.html course="csa" %}', {}],
    "two sample cards on one page" => [
      '{% include ocs_calendar_card.html course="csa" sample=true %}{% include ocs_calendar_card.html course="csp" sample=true %}', {}
    ],
    "the page's course" => ["{% include ocs_calendar_card.html %}", { "course" => "csp" }],
    "no course anywhere" => ["{% include ocs_calendar_card.html %}", {}],
    "a title of its own" => ['{% include ocs_calendar_card.html course="all" title="Sprint dates" %}', {}],
  }.freeze

  def current
    %w[ocs_calendar_card.html ocs_calendar_card_data.html].to_h { |name| [name, File.read(File.join(PROJECT, "_includes", name))] }
  end

  def before
    text, _, status = Open3.capture3("git", "-C", ROOT, "show", "#{BEFORE}:#{CARD}")
    skip "#{BEFORE[0, 9]} isn't in this clone, so there is no earlier include to compare with" unless status.success?
    { "ocs_calendar_card.html" => text }
  end

  # A page's Liquid with these includes, rendered the way Jekyll renders a page.
  def render(includes, markup, page = {})
    Dir.mktmpdir("calendar-card-") do |source|
      FileUtils.mkdir_p(File.join(source, "_includes"))
      includes.each { |name, text| File.write(File.join(source, "_includes", name), text) }
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "quiet" => true, "baseurl" => "/preview", "liquid" => { "error_mode" => "strict" }
      ))
      site.data = DATA
      payload = site.site_payload
      payload["page"] = page
      Liquid::Template.parse(markup, error_mode: :strict).render!(payload, registers: { site: site, page: page })
    end
  end

  def count(html, text)
    html.scan(text).size
  end

  def test_todays_cards_render_byte_for_byte_as_before
    old = before
    PAGES.each do |name, (markup, page)|
      html = render(current, markup, page)
      assert_equal render(old, markup, page), html, name
      assert_equal markup.scan("{% include").size, count(html, "data-ocs-calendar "), name
      assert_equal 1, count(html, 'id="ocsSchoolCalendarData"'), name
      assert_equal 1, count(html, SCRIPT), name
    end
  end

  def test_titles_and_courses_are_text
    odd = render(current, %({% include ocs_calendar_card.html course='csa" onclick="alert(1)' title='Q&A <b>"night"</b>' %}))
    card = Nokogiri::HTML.fragment(odd).at_css("section[data-ocs-calendar]")
    assert_equal 'csa" onclick="alert(1)', card["data-course"]
    assert_nil card["onclick"]
    assert_equal 'Q&A <b>"night"</b>', card["aria-label"]
    assert_equal ' Q&A <b>"night"</b>', card.at_css("strong").text
    assert_nil card.at_css("strong b")

    # The title made from a course is escaped too.
    named = Nokogiri::HTML.fragment(render(current, %({% include ocs_calendar_card.html course="<i>x" %}))).at_css("section")
    assert_equal "<I>X calendar", named["aria-label"]
    assert_equal ["fa-calendar-alt"], named.css("strong i").map { |icon| icon["class"].split.last }
  end

  def test_template_is_the_empty_card_alone_whatever_the_other_options
    [
      ["{% include ocs_calendar_card.html template=true %}", {}],
      ['{% include ocs_calendar_card.html template=true course="csa" title="Ours" sample=true %}', { "course" => "csp" }],
    ].each do |markup, page|
      html = render(current, markup, page).strip
      assert html.start_with?('<template data-ocs-template="calendar-card"><section '), markup
      assert html.end_with?("</section></template>"), markup
      fragment = Nokogiri::HTML.fragment(html)
      assert_nil fragment.at_css("script"), markup
      card = fragment.at_css("template > section[data-ocs-calendar]")
      assert_equal "", card["data-course"], markup
      assert_equal "false", card["data-sample"], markup
      assert_equal "", card["aria-label"], markup
      assert_equal "/preview/student/calendar", card["data-calendar-url"], markup
      # What createCalendarCardSection fills in.
      assert_equal " ", card.at_css("strong").text, markup
      assert card.at_css("strong > i"), markup
      %w[status mount detail].each { |hook| assert card.at_css(%([data-hook="#{hook}"])), "#{markup}: #{hook}" }
    end
  end

  def test_template_takes_neither_once_flag
    html = render(current, '{% include ocs_calendar_card.html template=true %}{% include ocs_calendar_card.html course="csa" %}')
    assert_equal 1, count(html, 'id="ocsSchoolCalendarData"')
    assert_equal 1, count(html, SCRIPT)
  end

  def test_data_include_puts_the_school_weeks_on_the_page_once
    alone = render(current, "{% include ocs_calendar_card_data.html %}{% include ocs_calendar_card_data.html %}")
    scripts = Nokogiri::HTML.fragment(alone).css("script")
    assert_equal ["ocsSchoolCalendarData"], scripts.map { |script| script["id"] }
    school = JSON.parse(scripts.first.text)
    yaml = DATA["school_calendar"]
    assert_equal yaml["school_year"], school["schoolYear"]
    assert_equal yaml["weeks"].keys.map(&:to_s), school["weeks"].keys
    yaml["weeks"].each do |index, week|
      parsed = school["weeks"].fetch(index.to_s)
      assert_equal week["monday"].to_s, parsed["monday"], index
      assert_equal week["friday"].to_s, parsed["friday"], index
      assert_equal Array(week["holidays"]), Array(parsed["holidays"]), index
      assert_equal week["skip_week"] || false, parsed["skipWeek"], index
    end

    card = '{% include ocs_calendar_card.html course="csa" %}'
    ["{% include ocs_calendar_card_data.html %}#{card}", "#{card}{% include ocs_calendar_card_data.html %}"].each do |markup|
      html = render(current, markup)
      assert_equal 1, count(html, 'id="ocsSchoolCalendarData"'), markup
      assert_equal 1, count(html, SCRIPT), markup
    end
  end

  def test_courses_publishes_the_data_include_next_to_the_card
    files = JSON.parse(File.read(File.join(PROJECT, "distribution.json"))).fetch("files")
    assert_includes files, { "source" => "_includes", "destination" => "_includes" }
    assert File.file?(File.join(PROJECT, "_includes/ocs_calendar_card_data.html"))
  end
end
