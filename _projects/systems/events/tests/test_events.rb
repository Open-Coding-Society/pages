# Checks the Events system (_projects/systems/events):
# - plugins/events.rb, the generator that checks every `layout: event` document against the
#   registry (data/event_registry.yml) and the site's `events:` settings, stops the build naming
#   the file when a value is wrong, and prepares what the templates read;
# - the pages it builds, in a temporary Jekyll site made from this system's published files (the
#   real distribution.json), with the labelled sample from _posts/events/ and the test fixture.
#
#   bundle exec ruby scripts/test_events.rb
require "minitest/autorun"
require "jekyll"
require "json"
require "open3"
require "pathname"
require "nokogiri"
require "tmpdir"
require "fileutils"
require "yaml"
require_relative "../../../../scripts/publish_project"
require_relative "../plugins/events"
require_relative "../../topics/plugins/topics"

module EventsTestSupport
  ROOT = File.expand_path("../../../..", __dir__)
  SYSTEM = File.expand_path("..", __dir__)
  REGISTRY = YAML.load_file(File.join(SYSTEM, "data/event_registry.yml")).freeze
  FIXTURE = File.join(SYSTEM, "tests/fixtures/2027-03-15-community-technology-workshop.md")
  SAMPLE = File.join(ROOT, "_posts/events/2027-03-15-community-technology-workshop.md")
  SETTINGS = {
    "timezone" => "America/Los_Angeles", "join_url" => "/signup", "page_size" => 6,
    "features" => { "microblog" => true, "registration" => false, "attendance" => false, "gallery" => false }
  }.freeze
  EMPTY_SOURCE = Dir.mktmpdir("events-source")
  Minitest.after_run { FileUtils.rm_rf(EMPTY_SOURCE) }

  # Stand-ins for Jekyll's documents and site, as Capstone's tests use.
  Document = Struct.new(:data, :url, :relative_path, :content, keyword_init: true)
  Posts = Struct.new(:docs)
  Site = Struct.new(:posts, :pages, :data, :config, :source, keyword_init: true)

  # The front matter (read with Jekyll's own YAML) and body of a Markdown file.
  def self.read_markdown(path)
    front, body = File.read(path).match(/\A---\s*\n(.*?)\n---\s*\n(.*)\z/m).captures
    [SafeYAML.load(front), body]
  end

  # Mort's example from the fixture, with changes; a change to nil removes that key.
  def event(changes = {}, name: "community-technology-workshop", body: nil)
    data, fixture_body = EventsTestSupport.read_markdown(FIXTURE)
    data = data.merge("permalink" => "/events/#{name}/").merge(changes).compact
    Document.new(data: data, url: data["permalink"].to_s, relative_path: "_posts/events/2027-03-15-#{name}.md",
                 content: body || fixture_body)
  end

  def site(documents, config: {}, pages: [], source: EMPTY_SOURCE)
    registry = Marshal.load(Marshal.dump(REGISTRY))
    Site.new(posts: Posts.new(documents), pages: pages, source: source,
             data: { "projects" => { "events" => { "event_registry" => registry } } },
             config: { "future" => true, "events" => Marshal.load(Marshal.dump(SETTINGS)) }.merge(config))
  end

  def generate(site)
    Events::Generator.new.generate(site)
    site
  end

  def assert_build_fails(site, *parts)
    error = assert_raises(Jekyll::Errors::FatalException) { generate(site) }
    parts.each { |part| assert_includes error.message, part }
    error
  end
end

class EventsGeneratorTest < Minitest::Test
  include EventsTestSupport

  # Plan test 1.
  def test_morts_example_gives_a_published_entry
    workshop = event({ "permalink" => "/events/community-technology-workshop/" })
    built = generate(site([workshop]))
    entry = workshop.data["event_entry"]
    assert_equal "published", entry["status"]
    assert_equal "published", entry["stage"]
    assert_equal({ "label" => "Published", "tone" => "good" }, entry["pill"])
    assert_equal "March 15, 2027 · 10:00 AM – 1:00 PM", entry["when"]
    assert_equal "March 15", entry["card_date"]
    assert_equal "2027-03-15T10:00", entry["datetime"]
    assert_equal "Community Center, Poway, California", entry["place"]
    assert_equal %w[description schedule presenters], entry["sections"].map { |section| section["key"] }, "no gallery card yet"
    assert_equal [{ "name" => "Open Coding Society", "role" => "Organizer", "initials" => "OC" }], entry["presenters"]
    assert_equal %w[community technology workshop], entry["category_keys"]
    assert_equal "Workshop", entry["event_type_label"]
    assert_equal true, workshop.data["hide"]
    assert_equal true, workshop.data["full_width"]
    assert_equal true, workshop.data["microblog"]
    assert_equal "events_view", workshop.data.dig("page_viewer", "activation_param")
    assert_equal({ "label" => "Events", "item" => "event", "home" => "/events/", "activation_param" => "events_view",
                   "script" => "/assets/js/projects/events/viewer.js" }, workshop.data["page_viewer"])
    assert_equal "/images/OCS-Kit-Capstone.png", entry["image"]
    assert_equal "The Open Coding Society logo", entry["image_alt"]
    assert_equal({ "name" => "Open Coding Society", "url" => "/" }, entry["image_credit"])
    assert_equal ["/events/community-technology-workshop/"], built.data["events_catalog"].map { |listed| listed["url"] }
  end

  # Plan test 2. Jekyll's YAML reads an unquoted 10:00 as the number 600.
  def test_an_unquoted_time_fails_with_a_hint_to_quote_it
    [600, 600.0].each do |number|
      assert_build_fails(site([event({ "start_time" => number })]),
                         "_posts/events/2027-03-15-community-technology-workshop.md", "start_time", "quote")
    end
  end

  # Plan test 3.
  def test_an_end_before_the_start_or_without_a_start_fails
    assert_build_fails(site([event({ "end_time" => "09:00" })]), "end_time must be after start_time")
    assert_build_fails(site([event({ "end_time" => "10:00" })]), "end_time must be after start_time")
    assert_build_fails(site([event({ "start_time" => nil })]), "end_time needs a start_time")
  end

  # Plan test 4.
  def test_unknown_values_fail
    attachments = ->(*list) { list.map { |type, id| { "type" => type, "id" => id } } }
    {
      { "status" => "live" } => "status must be one of draft, published, registration, active, completed, archived",
      { "event_type" => "party" } => "event_type must be one of workshop, showcase, fundraiser, outreach, meeting",
      { "features" => { "chat" => true } } => "features.chat isn't one of microblog, registration, attendance, gallery",
      { "features" => { "microblog" => "yes" } } => "features.microblog must be true or false",
      { "attachments" => attachments.call(%w[video clip]) } => "attachments type must be one of gallery, document",
      { "attachments" => attachments.call(%w[gallery photos], %w[document photos]) } => "attachments id photos is used twice",
      { "attachments" => attachments.call(["gallery", "Workshop Gallery"]) } => "attachments id must be a lowercase slug"
    }.each do |change, message|
      assert_build_fails(site([event(change)]), "2027-03-15-community-technology-workshop.md", message)
    end
  end

  # Plan test 5.
  def test_a_capacity_must_be_a_whole_number_of_one_or_more
    [0, "50", 2.5, -3, true].each do |capacity|
      assert_build_fails(site([event({ "registration" => { "enabled" => true, "capacity" => capacity } })]),
                         "registration.capacity must be a whole number of 1 or more")
    end
    assert_build_fails(site([event({ "registration" => { "enabled" => "yes" } })]), "registration.enabled must be true or false")
  end

  # Plan test 6.
  def test_addresses_must_be_safe_and_where_they_belong
    {
      { "permalink" => nil } => "permalink is needed",
      { "permalink" => "/blog/workshop/" } => "permalink must look like /events/<slug>/",
      { "permalink" => "/events/Workshop_2027/" } => "permalink must look like /events/<slug>/",
      { "image" => "images/x.png" } => "image must be a site path starting with / or an http(s) link",
      { "image" => "//evil.test/x.png" } => "image must be a site path starting with / or an http(s) link",
      { "image_alt" => nil } => "image_alt is needed with image",
      { "presentation" => "javascript:alert(1)" } => "presentation must be a site path or an https link",
      { "location" => { "name" => "Community Center", "url" => "javascript:alert(1)" } } => "location.url must be an https link",
      { "image_credit" => { "name" => "Open Coding Society", "url" => "http://x.test" } } => "image_credit.url must be a site path or an https link"
    }.each do |change, message|
      document = event(change)
      document.url = "/2027/03/15/workshop.html" if change.key?("permalink") && change["permalink"].nil?
      assert_build_fails(site([document]), document.relative_path, message)
    end
  end

  # Plan test 7. A draft never belongs in the public repo; this is only a safety net.
  def test_a_draft_is_removed_unless_the_build_uses_unpublished
    draft = event({ "status" => "draft" })
    page_draft = event({ "status" => "draft" }, name: "page-draft")
    built = generate(site([draft], pages: [page_draft]))
    assert_empty built.posts.docs
    assert_empty built.pages
    assert_empty built.data["events_catalog"]

    preview = event({ "status" => "draft" })
    shown = generate(site([preview], config: { "unpublished" => true }))
    assert_equal [preview], shown.posts.docs
    assert_equal "draft", preview.data.dig("event_entry", "stage")
    assert_empty shown.data["events_catalog"], "a draft is never listed"
    assert_nil preview.data["page_viewer"]
    assert_nil preview.data.dig("event_entry", "json_ld"), "a draft tells search engines nothing"
  end

  # Plan test 8.
  def test_an_archived_event_is_built_but_not_listed
    archived = event({ "status" => "archived" })
    built = generate(site([archived]))
    assert_equal [archived], built.posts.docs
    assert_empty built.data["events_catalog"]
    assert_nil archived.data["page_viewer"]
    assert_equal true, archived.data["hide"]
  end

  # Plan test 9.
  def test_the_catalog_sorts_by_day_then_start_then_title_and_categories_share_lowercase_keys
    later_day = event({ "date" => Date.new(2027, 3, 16), "title" => "Alpha", "categories" => ["workshop"] }, name: "later-day")
    late_start = event({ "start_time" => "14:00", "end_time" => "15:00", "title" => "Alpha" }, name: "late-start")
    zulu = event({ "title" => "Zulu" }, name: "zulu")
    bravo = event({ "title" => "bravo" }, name: "bravo")
    all_day = event({ "start_time" => nil, "end_time" => nil, "title" => "Zz all day" }, name: "all-day")
    built = generate(site([later_day, late_start, zulu, bravo, all_day]))
    assert_equal %w[all-day bravo zulu late-start later-day], built.data["events_catalog"].map { |entry| entry["url"].split("/").last }
    assert_equal({ "community" => "Community", "technology" => "Technology", "workshop" => "Workshop" }, built.data["events_categories"])
    assert_equal "March 15, 2027", all_day.data.dig("event_entry", "when")
    assert_equal "2027-03-15", all_day.data.dig("event_entry", "datetime")
  end

  # Plan test 10.
  def test_a_sample_gets_no_json_ld
    sample = event({ "sample" => true })
    real = event({}, name: "real-event")
    generate(site([sample, real]))
    assert_nil sample.data.dig("event_entry", "json_ld")
    data = JSON.parse(real.data.dig("event_entry", "json_ld"))
    assert_equal "Event", data["@type"]
    assert_equal "Community Technology Workshop", data["name"]
    assert_equal "2027-03-15T10:00", data["startDate"]
    assert_equal "2027-03-15T13:00", data["endDate"]
    assert_equal "https://schema.org/EventScheduled", data["eventStatus"]
    assert_equal "https://schema.org/OfflineEventAttendanceMode", data["eventAttendanceMode"]
    assert_equal({ "@type" => "Place", "name" => "Community Center", "address" => "Poway, California" }, data["location"])
    assert_equal({ "@type" => "Organization", "name" => "Open Coding Society" }, data["organizer"])
    assert_equal ["/images/OCS-Kit-Capstone.png"], data["image"]
    assert_equal "/events/real-event/", data["url"]
  end

  # Plan test 11 (the texts JSON half is in the build test below).
  def test_a_description_cannot_close_the_json_ld_script
    robots = event({ "description" => "Bring </script><!--<script>alert(1)</script> & more" })
    generate(site([robots]))
    json = robots.data.dig("event_entry", "json_ld")
    refute_includes json, "</"
    refute_includes json, "<!--"
    assert_includes json, "<\\/script>"
    assert_equal "Bring </script><!--<script>alert(1)</script> & more", JSON.parse(json)["description"]
  end

  # Plan test 12.
  def test_the_registry_keeps_morts_six_states_in_order
    assert_equal %w[draft published registration active completed archived], REGISTRY["lifecycle"].map { |stage| stage["key"] }
    REGISTRY["lifecycle"].each { |stage| refute_empty stage["description"].to_s, stage["key"] }
    swapped = site([event])
    swapped.data["projects"]["events"]["event_registry"]["lifecycle"].reverse!
    assert_build_fails(swapped, "_data/projects/events/event_registry.yml", "lifecycle must list draft, published, registration, active, completed, archived")
    toned = site([event])
    toned.data["projects"]["events"]["event_registry"]["lifecycle"][1]["tone"] = "green"
    assert_build_fails(toned, "_data/projects/events/event_registry.yml", "tone must be one of good, warn, bad, neutral")
  end

  # Plan test 13.
  def test_settings_come_from_events_and_a_missing_timezone_fails_only_when_events_exist
    workshop = event
    built = generate(site([workshop]))
    assert_equal({ "timezone" => "America/Los_Angeles", "join_url" => "/signup", "page_size" => 6,
                   "features" => SETTINGS["features"] }, built.data["events_settings"])
    assert_equal "America/Los_Angeles", workshop.data.dig("event_entry", "timezone")
    own_zone = event({ "timezone" => "America/New_York" })
    generate(site([own_zone]))
    assert_equal "America/New_York", own_zone.data.dig("event_entry", "timezone")

    no_zone = { "events" => SETTINGS.reject { |key, _| key == "timezone" } }
    assert_build_fails(site([event], config: no_zone), "_config.yml", "events.timezone")
    empty = generate(site([], config: { "events" => nil }))
    assert_empty empty.data["events_catalog"]
    assert_build_fails(site([event({ "timezone" => "Pacific" })]), "timezone must be an Area/City name")
    assert_build_fails(site([], config: { "events" => SETTINGS.merge("join_url" => "javascript:alert(1)") }), "_config.yml", "events.join_url")
  end

  # Plan test 14. Jekyll silently skips future-dated posts when future is off.
  def test_future_false_fails_only_when_there_are_event_files
    Dir.mktmpdir("events-future") do |source|
      assert generate(site([], config: { "future" => false }, source: source))
      FileUtils.mkdir_p(File.join(source, "_posts/events"))
      File.write(File.join(source, "_posts/events/2027-03-15-community-technology-workshop.md"), "---\nlayout: event\n---\n")
      error = assert_raises(Jekyll::Errors::FatalException) { generate(site([], config: { "future" => false }, source: source)) }
      assert_equal "Events needs future: true in _config.yml", error.message
    end
  end

  # Plan test 15.
  def test_organizer_uids_become_authors_only_with_the_microblog_and_never_replace_authors
    organizer = { "name" => "Open Coding Society", "uids" => %w[mort ada] }
    with_microblog = event({ "organizer" => organizer })
    without = event({ "organizer" => organizer, "features" => { "microblog" => false } }, name: "quiet")
    own_authors = event({ "organizer" => organizer, "authors" => ["grace"] }, name: "own")
    generate(site([with_microblog, without, own_authors]))
    assert_equal %w[mort ada], with_microblog.data["authors"]
    assert_nil without.data["authors"]
    assert_equal ["grace"], own_authors.data["authors"]
    assert_build_fails(site([event({ "organizer" => { "name" => "OCS", "uids" => "mort" } })]), "organizer.uids must be a list of login uids")
  end

  # Plan test 16.
  def test_an_event_with_another_page_viewer_fails
    claimed = event({ "page_viewer" => { "label" => "Capstone" } })
    assert_build_fails(site([claimed]), claimed.relative_path, "page_viewer is already assigned")
  end

  # Plan test 17: the real Topics generator, after Events, leaves events out of topics_catalog.
  def test_topics_leaves_events_out_of_its_catalog
    Dir.mktmpdir("events-topics") do |source|
      ProjectPublisher.run("publish", File.join(ROOT, "_projects/systems/topics"), source)
      ProjectPublisher.run("publish", SYSTEM, source)
      real = Jekyll::Site.new(Jekyll.configuration("source" => source, "destination" => File.join(source, "_site"),
                                                   "config" => [], "plugins_dir" => [], "quiet" => true, "future" => true,
                                                   "events" => SETTINGS))
      real.read
      data, body = EventsTestSupport.read_markdown(FIXTURE)
      workshop = Jekyll::PageWithoutAFile.new(real, source, "events", "workshop.md")
      workshop.data.merge!(data)
      workshop.content = body
      lesson = Jekyll::PageWithoutAFile.new(real, source, "lessons", "java.md")
      lesson.data.merge!("title" => "Java Loops", "categories" => ["Java", "Workshop"], "permalink" => "/java/loops/")
      lesson.content = "Loops."
      real.pages.push(workshop, lesson)
      # In Jekyll's own order: by priority, Events (:high) runs before the reader (:normal) and Topics (:lowest).
      assert_equal :high, Events::Generator.priority
      generators = [Topics::Generator.new, Events::Generator.new].sort
      assert_instance_of Events::Generator, generators.first
      generators.each { |generator| generator.generate(real) }
      urls = real.data["topics_catalog"].map { |entry| entry["url"] }
      assert_includes urls, "/java/loops/"
      refute_includes urls, workshop.url
      assert_equal "/events/community-technology-workshop-fixture/", workshop.url
    end
  end

  # Plan test 19.
  def test_features_take_the_sites_defaults_and_an_events_own_keys_win
    no_block = event({ "features" => nil }, name: "no-block")
    microblog_off = event({ "features" => { "microblog" => false } }, name: "microblog-off")
    generate(site([no_block, microblog_off]))
    assert_equal({ "microblog" => true, "registration" => false, "attendance" => false, "gallery" => false },
                 no_block.data.dig("event_entry", "features"))
    assert_equal false, microblog_off.data.dig("event_entry", "features", "microblog")
    assert_equal false, microblog_off.data["microblog"]

    bad_site = { "events" => SETTINGS.merge("features" => { "chat" => true }) }
    assert_build_fails(site([event], config: bad_site), "_config.yml", "events.features.chat")
    no_defaults = event({ "features" => { "registration" => true } }, name: "no-defaults")
    generate(site([no_defaults], config: { "events" => SETTINGS.reject { |key, _| key == "features" } }))
    assert_equal({ "microblog" => false, "registration" => true, "attendance" => false, "gallery" => false },
                 no_defaults.data.dig("event_entry", "features"))
    assert_equal false, no_defaults.data["microblog"]
  end

  # Plan test 20 (the built page is checked below).
  def test_microblog_off_leaves_no_discussion_flag_or_authors
    quiet = event({ "features" => { "microblog" => false }, "microblog" => true, "organizer" => { "name" => "OCS", "uids" => ["mort"] } })
    generate(site([quiet]))
    assert_equal false, quiet.data["microblog"], "the switch wins over a stray top-level flag"
    assert_nil quiet.data["authors"]
    assert_equal false, quiet.data.dig("event_entry", "features", "microblog")
  end

  # Plan test 21 (the value written on the catalog is checked below).
  def test_page_size_must_be_a_whole_number_from_1_to_48
    [0, 49, "6", 2.5].each do |size|
      assert_build_fails(site([event], config: { "events" => SETTINGS.merge("page_size" => size) }),
                         "_config.yml", "events.page_size must be a whole number from 1 to 48")
    end
    assert_equal 48, generate(site([event], config: { "events" => SETTINGS.merge("page_size" => 48) })).data.dig("events_settings", "page_size")
  end

  # Plan test 22 (the built page is checked below).
  def test_labels_rename_a_section_or_page_text_on_that_event_only
    speakers = event({ "labels" => { "presenters" => "Speakers", "discussion_title" => "Ask us" } }, name: "speakers")
    plain = event({}, name: "plain")
    generate(site([speakers, plain]))
    assert_equal "Speakers", speakers.data.dig("event_entry", "sections").find { |section| section["key"] == "presenters" }["label"]
    assert_equal "Ask us", speakers.data.dig("event_entry", "words", "discussion_title")
    assert_equal "Presenters", plain.data.dig("event_entry", "sections").find { |section| section["key"] == "presenters" }["label"]
    assert_build_fails(site([event({ "labels" => { "chat" => "X" } })]), "2027-03-15-community-technology-workshop.md", "labels.chat")
    assert_build_fails(site([event({ "labels" => { "presenters" => "" } })]), "2027-03-15-community-technology-workshop.md", "labels.presenters")
  end

  def test_presenters_schedule_and_presentation
    rich = event({
      "presenters" => [{ "name" => "Ada Lovelace", "role" => "Instructor" }, { "name" => "Grace" }],
      "schedule" => [{ "time" => "10:00", "title" => "Welcome" }, { "time" => "13:30", "title" => "Demos", "detail" => "Bring a laptop" }],
      "presentation" => "/ui-builder/view/?page=workshop",
      "location" => { "name" => "Community Center", "address" => "Poway, California", "url" => "https://maps.example.org/poway" }
    })
    generate(site([rich]))
    entry = rich.data["event_entry"]
    assert_equal [["Open Coding Society", "OC"], ["Ada Lovelace", "AL"], %w[Grace G]], entry["presenters"].map { |person| person.values_at("name", "initials") }
    assert_equal [["10:00", "10:00 AM", "Welcome", nil], ["13:30", "1:30 PM", "Demos", "Bring a laptop"]],
                 entry["schedule"].map { |row| row.values_at("time", "time_label", "title", "detail") }
    assert_equal "/ui-builder/view/?page=workshop", entry["presentation"]
    assert_equal "https://maps.example.org/poway", entry["place_url"]
    assert_build_fails(site([event({ "schedule" => [{ "time" => 9, "title" => "Doors" }] })]), "schedule time must be a quoted 24-hour")
    assert_build_fails(site([event({ "presenters" => [{ "role" => "Host" }] })]), "presenters need a name")
  end

  def test_duplicate_urls_and_a_blank_title_or_a_bad_date_fail
    assert_build_fails(site([event, event]), "Events must have unique URLs: /events/community-technology-workshop/")
    assert_build_fails(site([event({ "title" => "  " })]), "title must be text that isn't blank")
    assert_build_fails(site([event({ "date" => "March 15" })]), "date must be a YYYY-MM-DD day")
    assert_build_fails(site([event({ "date" => "2027-02-30" })]), "date must be a YYYY-MM-DD day")
    assert_build_fails(site([event({ "date" => Time.new(2027, 3, 15, 10, 0, 0) })]), "date must be a YYYY-MM-DD day")
    assert_equal "March 15", generate(site([event({ "date" => "2027-03-15" })])).data["events_catalog"].first["card_date"]
  end
end

# Registration: built in `make dev` too (event posts need the layout and the generator there), with
# every published copy ignored by git, so only the sources here are edited.
class EventsRegistrationTest < Minitest::Test
  include EventsTestSupport

  def test_events_is_registered_for_make_dev_and_its_published_copies_are_ignored
    assert_includes File.readlines(File.join(ROOT, "_projects/.makeprojects"), chomp: true), "systems/events:dev"
    published = ProjectPublisher.files(SYSTEM, ROOT).map { |_, destination| Pathname.new(destination).relative_path_from(Pathname.new(ROOT)).to_s }
    assert_includes published, "_layouts/event.html"
    assert_includes published, "_plugins/projects/events/events.rb"
    assert_includes published, "navigation/projects/events/index.md"
    assert published.none? { |path| path.include?("/tests/") || path.end_with?("README.md") }, "tests and docs aren't published as files"
    ignored, status = Open3.capture2("git", "-C", ROOT, "check-ignore", "--", *published)
    assert status.success?, "git check-ignore found nothing ignored"
    assert_equal published.sort, ignored.lines.map(&:strip).sort
  end

  def test_the_site_settings_are_valid
    config = YAML.load_file(File.join(ROOT, "_config.yml"))
    assert_equal true, config["future"], "Jekyll skips future-dated posts without it"
    built = generate(site([event], config: { "events" => config["events"] }))
    assert_equal "/signup", built.data.dig("events_settings", "join_url")
    assert_equal({ "microblog" => true, "registration" => false, "attendance" => false, "gallery" => false }, config.dig("events", "features"))
  end
end

# Plan tests 18, 20, 21 and 22 on built pages, and 11's texts JSON: a temporary Jekyll site made from
# this system's published files (ProjectPublisher, as make does), the real labelled sample, the
# fixture and a few more events, with a small site shell that adds the Microblog panel the way
# base.html:14 does and the shared page viewer the way base.html:10 does.
class EventsBuildTest < Minitest::Test
  include EventsTestSupport

  EXTRA = {
    "2027-05-01-robots.md" => <<~MD,
      ---
      layout: event
      title: "Robots & <script>alert(1)</script> <!--"
      description: "Bring </script> & more"
      date: 2027-05-01
      status: published
      permalink: /events/robots/
      labels:
        description: "About </script> <!--"
      ---
      Robots.
    MD
    "2027-04-01-quiet-meeting.md" => <<~MD,
      ---
      layout: event
      title: Quiet meeting
      date: 2027-04-01
      start_time: "18:00"
      status: published
      permalink: /events/quiet-meeting/
      categories: [workshop]
      features:
        microblog: false
      ---
    MD
    "2027-04-02-speakers-night.md" => <<~MD,
      ---
      layout: event
      title: Speakers night
      date: 2027-04-02
      status: published
      permalink: /events/speakers-night/
      presenters:
        - name: Ada Lovelace
          role: Host
      labels:
        presenters: Speakers
      ---
    MD
    "2025-01-10-long-gone.md" => "---\nlayout: event\ntitle: Long gone\ndate: 2025-01-10\nstatus: archived\npermalink: /events/long-gone/\n---\n",
    "2027-01-10-not-ready.md" => "---\nlayout: event\ntitle: Not ready\ndate: 2027-01-10\nstatus: draft\npermalink: /events/not-ready/\n---\n"
  }.freeze

  def self.build
    @build ||= begin
      # The real path: macOS temp folders sit behind a symlink, and Jekyll compares the two.
      dir = File.realpath(Dir.mktmpdir("events-site"))
      Minitest.after_run { FileUtils.rm_rf(dir) }
      ProjectPublisher.run("publish", SYSTEM, dir)
      FileUtils.mkdir_p(File.join(dir, "_posts/events"))
      FileUtils.cp(SAMPLE, File.join(dir, "_posts/events"))
      FileUtils.cp(FIXTURE, File.join(dir, "_posts/events/2027-03-15-community-technology-workshop-fixture.md"))
      EXTRA.each { |name, text| File.write(File.join(dir, "_posts/events", name), text) }
      FileUtils.cp(File.join(ROOT, "_includes/page-viewer.html"), File.join(dir, "_includes"))
      File.write(File.join(dir, "_layouts/opencs.html"), <<~LIQUID)
        {% if page.page_viewer %}{% include page-viewer.html viewer=page.page_viewer %}{% endif %}
        {% if page.microblog %}<button id="microblog-toggle-btn">Microblog</button><aside id="microblog-panel"></aside>{% endif %}
        <main>{{ content }}</main>
      LIQUID
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => dir, "destination" => File.join(dir, "_site"), "config" => [], "plugins_dir" => [],
        "layouts_dir" => File.join(dir, "_layouts"), "includes_dir" => File.join(dir, "_includes"),
        "quiet" => true, "future" => true, "baseurl" => "/preview", "events" => SETTINGS
      ))
      # Only this system's generator: the Topics one is loaded for its own test above.
      site.generators.select! { |generator| generator.is_a?(Events::Generator) }
      # Jekyll 3 reads _layouts from the current folder when it has one, so build from inside.
      Dir.chdir(dir) { site.process }
      { dir: dir, site: File.join(dir, "_site") }
    end
  end

  def page(path) = File.read(File.join(self.class.build[:site], path, "index.html"))
  def html(path) = Nokogiri::HTML(page(path))
  def json_ld(path) = html(path).css('script[type="application/ld+json"]').map { |script| JSON.parse(script.text) }

  # Plan test 18.
  def test_the_catalog_lists_events_in_card_grid_with_the_page_size
    catalog = html("events")
    links = catalog.css(".ocs__grid--card article[data-event-card] h3 > a").map { |link| link["href"] }
    assert_includes links, "/preview/events/community-technology-workshop/"
    assert_equal "6", catalog.at_css("section[data-event-catalog]")["data-page-size"]
    refute_includes links, "/preview/events/long-gone/", "archived events aren't listed"
    refute_includes links, "/preview/events/not-ready/"
    refute File.exist?(File.join(self.class.build[:site], "events/not-ready/index.html")), "a draft is never built"
    assert File.exist?(File.join(self.class.build[:site], "events/long-gone/index.html")), "an archived event is still built"
    sample_card = catalog.css("article[data-event-card]").find { |card| card["data-event-url"] == "/preview/events/community-technology-workshop/" }
    assert_equal %w[Published Sample], sample_card.css("b.ocs__status-pill").map(&:text)
    assert_equal "March 15", sample_card.at_css("time.ocs__badge").text
    assert_equal '["community","technology","workshop"]', sample_card["data-event-categories"]
    join = catalog.at_css("div.ocs__links > a.ocs__btn.pill.accent.fill.large")
    assert_equal "/preview/signup", join["href"]
    assert_equal "Join Us", join.text.strip
    assert_equal %w[community technology workshop], catalog.css("button[data-event-category]").map { |button| button["data-event-category"] }.reject(&:empty?)
    assert_includes page("events"), "/preview/assets/js/projects/events/event-catalog.js"
  end

  # Plan test 18.
  def test_the_sample_page_follows_img2_from_the_include
    sample = html("events/community-technology-workshop")
    pill = sample.at_css("b.ocs__status-pill.ocs__status-pill--good[data-event-pill]")
    assert_equal "Published", pill.text
    assert_equal "Sample", sample.at_css("b.ocs__status-pill.ocs__status-pill--neutral").text
    assert_equal REGISTRY.dig("texts", "page", "sample_note"), sample.at_css("article[data-event-page] > div.ocs__callout").text.strip
    assert_equal 3, sample.css("nav.ocs__nav-grid.ocs__nav-grid--in-card > a.ocs__nav-card").size
    assert_equal "Community Technology Workshop", sample.at_css("article[data-event-page] > h2").text
    assert_equal "March 15, 2027 · 10:00 AM – 1:00 PM", sample.at_css("article[data-event-page] > p > time.ocs__text").text
    assert_equal "Community Center, Poway, California", sample.at_css(".ocs__keypoints .ocs__keypoint").text.strip
    assert_equal "OC", sample.at_css("#event-presenters abbr.ocs__avatar").text
    assert_includes sample.at_css("#event-description").text, "An introduction to practical AI, programming, and community technology projects."
    assert_nil sample.at_css("figure"), "the sample has no photo"
    assert_includes page("events/community-technology-workshop"), "/preview/assets/js/projects/events/event-page.js"
    assert_includes page("events/community-technology-workshop"), "/preview/assets/js/projects/microblog/microblog-topic.js"
    bar = sample.at_css('nav[data-page-viewer][data-viewer-param="events_view"]')
    assert_equal "/preview/events/", bar["data-home-url"]
    assert_includes page("events/community-technology-workshop"), "/preview/assets/js/projects/events/viewer.js"
  end

  # Plan test 18.
  def test_the_fixture_has_the_hero_with_its_credit
    fixture = html("events/community-technology-workshop-fixture")
    image = fixture.at_css("figure > img.ocs__image-frame.ocs__image-frame--cover")
    assert_equal "/preview/images/OCS-Kit-Capstone.png", image["src"]
    assert_equal "The Open Coding Society logo", image["alt"]
    credit = fixture.at_css("figure > figcaption > a.ocs__status")
    assert_equal "Open Coding Society", credit.text
    assert_equal "/preview/", credit["href"]
  end

  # Plan test 18.
  def test_the_layout_holds_only_the_include
    layout = File.read(File.join(self.class.build[:dir], "_layouts/event.html"))
    assert_equal "{% include projects/events/event-body.html %}", layout.sub(/\A---\n.*?\n---\n/m, "").strip
    assert_includes File.read(File.join(self.class.build[:dir], "_includes/projects/events/event-body.html")), "data-event-page"
  end

  # Plan test 18 and 10.
  def test_json_ld_only_for_events_that_are_not_samples
    assert_empty json_ld("events/community-technology-workshop")
    fixture = json_ld("events/community-technology-workshop-fixture")
    assert_equal 1, fixture.size
    assert_equal "Event", fixture.first["@type"]
    assert_equal "/preview/events/community-technology-workshop-fixture/", fixture.first["url"]
    assert_equal ["/preview/images/OCS-Kit-Capstone.png"], fixture.first["image"]
  end

  # Plan test 18.
  def test_no_events_output_has_inline_styles_or_spans_in_buttons
    %w[events events/community-technology-workshop events/community-technology-workshop-fixture events/quiet-meeting
       events/speakers-night events/robots].each do |path|
      refute_match(/\sstyle\s*=/i, page(path), path)
      assert_empty html(path).css(".ocs__btn span"), path
    end
  end

  # Plan test 11. Inside a script element only "</" can end it, and "<!--" can stop its real end tag
  # from ending it, so neither appears in the JSON blocks; in the page's HTML every value is escaped.
  def test_event_text_cannot_close_a_script_element
    robots = page("events/robots")
    refute_includes robots[%r{<article.*?</article>}m], "<script>alert(1)"
    assert_equal "Robots & <script>alert(1)</script> <!--", html("events/robots").at_css("article[data-event-page] > h2").text
    texts = robots[%r{<script type="application/json" data-event-texts>(.*?)</script>}m, 1]
    assert_includes texts, "About <\\/script>"
    assert_equal "About </script> <!--", JSON.parse(texts).dig("page", "description")
    script = robots[%r{<script type="application/ld\+json">(.*?)</script>}m, 1]
    [texts, script].each do |json|
      refute_includes json, "</"
      refute_includes json, "<!--"
    end
    assert_equal "Bring </script> & more", JSON.parse(script)["description"]
    assert_equal "Robots & <script>alert(1)</script> <!--", JSON.parse(script)["name"]
    types = html("events/robots").css("script").map { |script| script["type"] }
    assert_equal %w[module application/ld+json application/json module], types, "the viewer's, then the page's own: nothing from the event's text"
  end

  # Plan test 20.
  def test_microblog_off_leaves_nothing_behind
    quiet = page("events/quiet-meeting")
    refute_includes quiet, 'id="event-discussion"'
    refute_includes quiet, REGISTRY.dig("texts", "page", "discussion_title")
    refute_includes quiet, "microblog-panel"
    refute_includes quiet, "data-event-discussion-list"
    sample = page("events/community-technology-workshop")
    assert_includes sample, 'id="event-discussion"'
    assert_includes sample, 'id="microblog-panel"'
    assert_equal "/events/community-technology-workshop/", html("events/community-technology-workshop").at_css("[data-event-discussion-list]")["data-event-topic"]
  end

  # Plan test 22.
  def test_labels_rename_the_card_and_heading_on_that_event_only
    speakers = html("events/speakers-night")
    assert_includes speakers.css("a.ocs__nav-card .ocs__nav-card-title").map(&:text), "Speakers"
    assert_equal "Speakers", speakers.at_css("#event-presenters > h2.ocs__section-title").text
    assert_equal "Presenters", html("events/community-technology-workshop").at_css("#event-presenters > h2.ocs__section-title").text
  end
end
