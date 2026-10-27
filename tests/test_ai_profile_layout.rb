require 'minitest/autorun'
require 'json'
require 'liquid'
require 'nokogiri'

# Render the real Profile sources without building unrelated course documents.
class ProfileSourceInclude < Liquid::Tag
  DIRECTORY = File.expand_path('../_projects/systems/profile/_includes', __dir__)

  def initialize(name, markup, tokens)
    super
    @filename = markup.strip
    raise 'Unexpected Profile include' unless %w[profile-gist-connection.html profile-ai-connections.html].include?(@filename)
  end

  def render(context)
    Liquid::Template.parse(File.read(File.join(DIRECTORY, @filename))).render!(context)
  end
end

Liquid::Template.register_tag('include', ProfileSourceInclude)

class AiProfileLayoutTest < Minitest::Test
  PROFILE = File.expand_path('../_projects/systems/profile', __dir__)

  def render_profile(spring)
    source = File.read(File.join(PROFILE, 'layouts/profile.html')).sub(/\A---\s*\n.*?\n---\s*\n/m, '')
    Liquid::Template.parse(source, error_mode: :strict).render!(
      'site' => { 'spring' => spring, 'baseurl' => '/preview', 'data' => {} }
    )
  end

  def test_spring_profile_has_independent_ai_forms_after_gist
    html = render_profile(true)
    document = Nokogiri::HTML.fragment(html)
    assert_equal 1, document.css('#ai-connections').size
    assert_equal 2, document.css('#ai-connections form[data-ai-form]').size
    assert_empty document.css('#profileSettingsForm [data-ai-form]')
    assert_operator html.index('id="github"'), :<, html.index('id="ai-connections"')
    %w[gemini groq].each do |provider|
      input = document.at_css("#ai-#{provider}-key")
      assert_equal 'password', input['type']
      assert_equal 'off', input['autocomplete']
      assert input.key?('disabled')
      assert document.at_css("label[for='ai-#{provider}-key']")
    end
    assert_includes html, '/preview/assets/js/profile/ai-connections.js'
    assert_includes html, '{ apiBase: javaURI }'
  end

  def test_flask_only_profile_has_no_ai_or_gist_controls_or_starter
    html = render_profile(false)
    refute_includes html, 'ai-connections'
    refute_includes html, 'initAiConnections'
    refute_includes html, 'gist-connection'
    assert_includes html, 'profileSettingsForm'
  end

  def test_missing_spring_setting_keeps_education_defaults
    assert_includes render_profile(nil), 'id="ai-connections"'
  end

  def test_shared_controls_and_direct_key_links
    document = Nokogiri::HTML.fragment(render_profile(true))
    assert document.at_css('#ai-connections.ocs__card')
    assert_equal 2, document.css('#ai-connections .ocs__status-pill[data-ai-state]').size
    assert_equal 2, document.css('#ai-connections .hidden[data-ai-disconnect]').size
    assert document.at_css('a[href="https://aistudio.google.com/api-keys"]')
    assert document.at_css('a[href="https://console.groq.com/keys"]')
    assert_empty document.css('#ai-connections style, #ai-connections [style]')
  end

  def test_existing_distribution_publishes_ai_sources_without_parent_imports
    files = JSON.parse(File.read(File.join(PROFILE, 'distribution.json'))).fetch('files')
    assert_includes files, { 'source' => '_includes', 'destination' => '_includes' }
    assert_includes files, { 'source' => 'js', 'destination' => 'assets/js/profile' }
    source = File.read(File.join(PROFILE, 'js/ai-connections.js'))
    refute_match(/import .*['"]\.\.\//, source)
  end
end
