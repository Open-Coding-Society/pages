require "minitest/autorun"
require "jekyll"
require "json"
require "nokogiri"
require "open3"
require "tmpdir"

# The /calls/ page from its source, rendered by Jekyll's Liquid in strict mode for each way
# _config.yml can set it. The scripts load only when the site runs Spring and calls.enabled is
# true; otherwise the page says calls are off and loads nothing. The strings handed to
# CallPage are data/calls.yml, unchanged.
class CallsPageTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)
  PAGE = File.join(PROJECT, "pages/calls.md")
  DM = "_projects/systems/messages/navigation/dm.md".freeze
  # /dm just before calls' hook was merged in: the merge of #2081 in the combined Messages and calls branch.
  BEFORE = "e78b2063234a397352a20a88ab9d1e038c710ddc".freeze
  STRINGS = SafeYAML.load_file(File.join(PROJECT, "data/calls.yml"))
  SCRIPTS = %w[
    /preview/assets/js/api/config.js
    /preview/assets/js/chat/rich-text.js
    /preview/assets/js/projects/messages/conversation-embed.js
    /preview/assets/js/projects/calls/call-page.js
  ].freeze

  def body(text = File.read(PAGE))
    text.split(/^---\s*$/, 3).last
  end

  def front_matter(text = File.read(PAGE))
    SafeYAML.load(text.split(/^---\s*$/, 3)[1])
  end

  def render(config, text = File.read(PAGE))
    Dir.mktmpdir("calls-page-") do |source|
      site = Jekyll::Site.new(Jekyll.configuration({
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "quiet" => true, "baseurl" => "/preview", "liquid" => { "error_mode" => "strict" }
      }.merge(config)))
      site.data = { "projects" => { "calls" => { "calls" => STRINGS } } }
      payload = site.site_payload
      payload["page"] = front_matter(text)
      Liquid::Template.parse(body(text), error_mode: :strict).render!(payload, registers: { site: site, page: front_matter(text) })
    end
  end

  def scripts(html)
    Nokogiri::HTML.fragment(html).css("script")
  end

  def test_the_page_keeps_its_address_and_stays_out_of_search
    assert_equal "/calls/", front_matter["permalink"]
    assert_equal true, front_matter["search_exclude"]
    assert_equal true, front_matter["full_width"]
  end

  def test_calls_on_with_spring_loads_the_page_scripts_once
    [{ "calls" => { "enabled" => true } }, { "calls" => { "enabled" => true }, "spring" => true }].each do |config|
      html = render(config)
      script = scripts(html)
      assert_equal 1, script.size, config.inspect
      assert_equal "module", script.first["type"]
      SCRIPTS.each { |path| assert_includes script.first.text, "'#{path}'", "#{config.inspect}: #{path}" }
      assert_includes script.first.text, "CallPage.start("
      fragment = Nokogiri::HTML.fragment(html)
      assert_equal STRINGS["text"]["loading"], fragment.at_css("#callPage .ocs__callout").text
    end
  end

  def test_the_strings_reach_the_page_unchanged
    script = scripts(render("calls" => { "enabled" => true })).first.text
    json = script[/strings: (\{.*\}),\n/, 1]
    refute_nil json, "the strings line is in the script"
    assert_equal STRINGS, JSON.parse(json)
  end

  def test_calls_off_or_flask_only_says_so_and_loads_nothing
    [
      {},
      { "calls" => { "enabled" => false } },
      { "calls" => {} },
      { "calls" => { "enabled" => "true" } },
      { "calls" => { "enabled" => true }, "spring" => false },
      { "spring" => false },
    ].each do |config|
      html = render(config)
      assert_empty scripts(html), config.inspect
      callouts = Nokogiri::HTML.fragment(html).css("#callPage .ocs__callout").map(&:text)
      assert_equal [STRINGS["text"]["turned_off"]], callouts, config.inspect
    end
  end

  def dm_before
    text, _, status = Open3.capture3("git", "-C", ROOT, "show", "#{BEFORE}:#{DM}")
    skip "#{BEFORE[0, 9]} isn't in this clone, so there is no earlier /dm to compare with" unless status.success?
    text
  end

  def test_dm_with_calls_off_is_byte_for_byte_what_it_was
    dm = File.read(File.join(ROOT, DM))
    [{}, { "calls" => { "enabled" => false } }, { "calls" => { "enabled" => true }, "spring" => false }].each do |config|
      assert_equal render(config, dm_before), render(config, dm), config.inspect
    end
  end

  def test_dm_with_calls_on_hands_call_entry_the_calls_strings
    html = render({ "calls" => { "enabled" => true } }, File.read(File.join(ROOT, DM)))
    fragment = Nokogiri::HTML.fragment(html)
    assert fragment.at_css("a#messagesCall.dm__action.hidden")
    assert fragment.at_css("p#messagesCallNotice.dm__notice")
    script = fragment.css("script[type=module]").last.text
    assert_includes script, "import { CallEntry } from '/preview/assets/js/projects/calls/call-entry.js';"
    call = script[/calls: new CallEntry\(\{ javaURI, fetchOptions, baseurl: "\/preview", text: (\{.*\}) \}\) \}\);/, 1]
    refute_nil call, "startMessagesPage gets a CallEntry"
    assert_equal STRINGS["text"], JSON.parse(call)
  end
end

