require "minitest/autorun"
require "jekyll"
require "sass"
require_relative "../plugins/capstone"

class CapstoneTest < Minitest::Test
  Document = Struct.new(:data, :url, :relative_path, :content, keyword_init: true)
  Posts = Struct.new(:docs)
  Site = Struct.new(:posts, :pages, :data, keyword_init: true)

  def test_catalog_discovers_frontmatter_projects_and_sorts_by_year_then_title
    projects = [
      document("Older", "/older/", { "course" => "csp", "school_year" => "2025-2026" }),
      document("Zulu", "/zulu/", { "course" => "CSA", "school_year" => "2026-2027" }),
      document("Alpha", "/alpha/", { "course" => "CSH", "school_year" => "2026-2027" }),
      document("Draft", "/draft/", { "course" => "CSA" }, "lesson_status" => "draft"),
      document("Hidden", "/hidden/", { "course" => "CSA" }, "hide" => true)
    ]
    site = Site.new(posts: Posts.new(projects), pages: [], data: {})

    Capstone::Generator.new.generate(site)

    assert_equal %w[/alpha/ /zulu/ /older/], site.data["capstone_catalog"].map { |project| project["url"] }
    assert_equal %w[2026-2027 2025-2026], site.data["capstone_years"]
  end

  def test_catalog_uses_document_metadata_and_frontmatter_overrides
    project = document("Source title", "/source/", {
      "course" => "CSP",
      "school_year" => "2026-2027",
      "title" => "Display title",
      "team" => ["Ari", "Rin"],
      "links" => { "frontend" => "https://github.com/example/frontend" }
    }, "description" => "Source description")
    site = Site.new(posts: Posts.new([project]), pages: [], data: {})

    result = Capstone.catalog(site).first

    assert_equal "Display title", result["title"]
    assert_equal "Source description", result["description"]
    assert_equal %w[Ari Rin], result["team"]
    assert_equal [{ "label" => "Frontend repository", "url" => "https://github.com/example/frontend" }], result["links"]
  end

  def test_invalid_project_metadata_fails_with_source_context
    project = document("Bad", "/bad/", { "course" => "XYZ" })
    site = Site.new(posts: Posts.new([project]), pages: [], data: {})

    error = assert_raises(Jekyll::Errors::FatalException) { Capstone.catalog(site) }

    assert_includes error.message, "_posts/capstone/bad.md"
    assert_includes error.message, "capstone_project.course"
  end

  def test_team_group_must_be_a_group_name
    named = document("Named", "/named/", { "course" => "CSP", "team_group" => "OCS Communication Systems" })
    assert_equal ["/named/"], Capstone.catalog(Site.new(posts: Posts.new([named]), pages: [], data: {})).map { |p| p["url"] }

    [["Team A", "Team B"], "   ", 42, "CSP", " csa "].each do |value|
      bad = document("Bad", "/bad/", { "course" => "CSP", "team_group" => value })
      error = assert_raises(Jekyll::Errors::FatalException) do
        Capstone.catalog(Site.new(posts: Posts.new([bad]), pages: [], data: {}))
      end
      assert_includes error.message, "capstone_project.team_group"
    end
  end

  # Spring's members routes refuse with these reasons (MentorRules); the panel needs words for each.
  def test_team_chat_texts_cover_every_reason_the_members_routes_send
    texts = YAML.load_file(File.expand_path("../data/team_chat.yml", __dir__))
    %w[mentor_team_too_small team_manages_mentors mentor_class_group mentor_cannot_manage failed].each do |reason|
      assert texts.dig("mentors", "reasons", reason).to_s.strip != "", "team_chat.yml mentors.reasons.#{reason}"
    end
    %w[title lead loading signIn unavailable notMember mentorWaiting notFound openInMessages].each do |key|
      assert texts[key].to_s.strip != "", "team_chat.yml #{key}"
    end
  end

  def test_duplicate_urls_are_rejected
    projects = [
      document("First", "/same/", { "course" => "CSA" }),
      document("Second", "/same/", { "course" => "CSP" })
    ]
    site = Site.new(posts: Posts.new(projects), pages: [], data: {})

    error = assert_raises(Jekyll::Errors::FatalException) { Capstone.catalog(site) }

    assert_includes error.message, "unique URLs"
  end

  def test_viewer_styles_apply_outside_the_directory
    source = File.read(File.expand_path("../../../../_sass/open-coding/elements/_viewer.scss", __dir__))
    css = Sass::Engine.new(source, syntax: :scss, load_paths: [File.expand_path("../../../../_sass", __dir__)]).render

    assert_match(/(?:^|\n)\.ocs__viewer \{[^}]*display: flex;/m, css)
    assert_match(/\.ocs__viewer\[hidden\] \{\s*display: none;/, css)
  end

  def test_viewer_is_opted_in_for_catalog_projects_their_descendants_and_games
    project = document("Presence", "/capstone/presence/", { "course" => "CSH" })
    child = document("Phase", "/capstone/presence/phases/", nil)
    unrelated = document("Other", "/capstone/presence-other/", nil)
    game = document("Game", "/games/game/", nil, "game_directory" => true)
    game_child = document("Guide", "/games/game/guide/", nil)
    excluded = document("Excluded", "/games/excluded/", nil, "game_directory" => true, "exclude_from_games" => true)
    site = Site.new(posts: Posts.new([project, child, unrelated, game, game_child, excluded]), pages: [], data: {})

    Capstone::Generator.new.generate(site)

    [project, child, game, game_child].each do |entry|
      assert_equal "/assets/js/projects/capstone/viewer.js", entry.data.dig("page_viewer", "script")
    end
    [unrelated, excluded].each { |entry| refute entry.data.key?("page_viewer") }
  end

  def test_viewer_does_not_replace_another_applications_viewer
    project = document("Presence", "/capstone/presence/", { "course" => "CSH" }, "page_viewer" => { "label" => "Other" })
    site = Site.new(posts: Posts.new([project]), pages: [], data: {})

    error = assert_raises(Jekyll::Errors::FatalException) { Capstone::Generator.new.generate(site) }
    assert_includes error.message, "page_viewer is already assigned"
  end

  private

  def document(title, url, project, additional = {})
    Document.new(
      data: { "title" => title, "description" => additional["description"], "capstone_project" => project }
        .merge(additional),
      url: url,
      relative_path: "_posts/capstone/#{title.downcase}.md",
      content: ""
    )
  end
end
