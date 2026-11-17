require "minitest/autorun"
require "jekyll"
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

  def test_duplicate_urls_are_rejected
    projects = [
      document("First", "/same/", { "course" => "CSA" }),
      document("Second", "/same/", { "course" => "CSP" })
    ]
    site = Site.new(posts: Posts.new(projects), pages: [], data: {})

    error = assert_raises(Jekyll::Errors::FatalException) { Capstone.catalog(site) }

    assert_includes error.message, "unique URLs"
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
