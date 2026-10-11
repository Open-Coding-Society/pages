require "minitest/autorun"
require "tmpdir"
require "json"
require "fileutils"
require "open3"
require_relative "../../../../scripts/publish_project"

class ProjectDistributionTest < Minitest::Test
  def setup
    @workspace = Dir.mktmpdir("course-distribution-")
    @project = File.join(@workspace, "_projects/systems/courses")
    FileUtils.mkdir_p(File.join(@project, "_includes"))
    File.write(File.join(@project, "_includes/test.html"), "first")
    manifest([{ "source" => "_includes", "destination" => "_includes" }])
  end

  def teardown
    FileUtils.remove_entry(@workspace)
  end

  def manifest(entries)
    File.write(File.join(@project, "distribution.json"), JSON.generate("files" => entries))
  end

  def run_publisher(action)
    ProjectPublisher.run(action, @project, @workspace)
  end

  def output
    File.join(@workspace, "_includes/test.html")
  end

  def test_publish_is_content_stable_and_updates_changed_sources
    run_publisher("publish")
    assert_equal "first", File.read(output)
    File.utime(Time.at(1), Time.at(1), output)
    run_publisher("publish")
    assert_equal Time.at(1), File.mtime(output)
    File.write(File.join(@project, "_includes/test.html"), "second")
    run_publisher("publish")
    assert_equal "second", File.read(output)
  end

  def test_source_deletion_removes_only_owned_outputs
    run_publisher("publish")
    unrelated = File.join(@workspace, "_includes/shared.html")
    File.write(unrelated, "shared")
    FileUtils.rm(File.join(@project, "_includes/test.html"))
    run_publisher("publish")
    refute File.exist?(output)
    assert_equal "shared", File.read(unrelated)
  end

  def test_fingerprint_changes_for_edits_additions_and_deletions
    before = capture_io { run_publisher("fingerprint") }.first
    File.write(File.join(@project, "_includes/test.html"), "edited")
    edited = capture_io { run_publisher("fingerprint") }.first
    File.write(File.join(@project, "_includes/added.html"), "added")
    added = capture_io { run_publisher("fingerprint") }.first
    FileUtils.rm(File.join(@project, "_includes/added.html"))
    deleted = capture_io { run_publisher("fingerprint") }.first
    refute_equal before, edited
    refute_equal edited, added
    assert_equal edited, deleted
    assert_equal deleted, capture_io { run_publisher("fingerprint") }.first
  end

  def test_manifest_changes_remove_obsolete_destinations
    run_publisher("publish")
    manifest([{ "source" => "_includes/test.html", "destination" => "_includes/renamed.html" }])
    run_publisher("publish")
    refute File.exist?(output)
    assert_equal "first", File.read(File.join(@workspace, "_includes/renamed.html"))
  end

  def test_clean_works_after_manifest_and_sources_are_removed
    run_publisher("publish")
    FileUtils.rm(File.join(@project, "distribution.json"))
    FileUtils.rm(File.join(@project, "_includes/test.html"))
    run_publisher("clean")
    refute File.exist?(output)
    assert File.directory?(@project)
  end

  def test_clean_refuses_to_delete_modified_outputs
    run_publisher("publish")
    File.write(output, "human changes")
    assert_raises(RuntimeError) { run_publisher("clean") }
    assert_equal "human changes", File.read(output)
  end

  def test_rejects_traversal_and_unsupported_destinations
    ["../outside", "_includes/../../outside", "README.md"].each do |path|
      manifest([{ "source" => "_includes/test.html", "destination" => path }])
      assert_raises(RuntimeError) { run_publisher("publish") }
    end
  end

  def test_rejects_missing_source_and_duplicate_outputs
    manifest([{ "source" => "missing", "destination" => "_includes/missing.html" }])
    assert_raises(RuntimeError) { run_publisher("publish") }
    manifest(Array.new(2) { { "source" => "_includes/test.html", "destination" => "_includes/test.html" } })
    assert_raises(RuntimeError) { run_publisher("publish") }
  end

  def test_rejects_symlink_destinations_even_when_content_matches
    run_publisher("publish")
    target = File.join(@workspace, "target.html")
    File.write(target, "first")
    FileUtils.rm(output)
    File.symlink(target, output)
    assert_raises(RuntimeError) { run_publisher("publish") }
    assert_raises(RuntimeError) { run_publisher("clean") }
    assert_equal "first", File.read(target)
  end

  def test_two_projects_cannot_claim_the_same_output
    run_publisher("publish")
    other = File.join(@workspace, "_projects/systems/other")
    FileUtils.mkdir_p(other)
    File.write(File.join(other, "source.html"), "other")
    File.write(File.join(other, "distribution.json"), JSON.generate(
      "files" => [{ "source" => "source.html", "destination" => "_includes/test.html" }]
    ))
    assert_raises(RuntimeError) { ProjectPublisher.run("publish", other, @workspace) }
    assert_equal "first", File.read(output)
  end

  def test_actual_course_kit_publishes_all_manifest_resources
    project = File.expand_path("..", __dir__)
    ProjectPublisher.run("publish", project, @workspace)
    ProjectPublisher.files(project, @workspace).each do |source, destination|
      assert_equal File.binread(source), File.binread(destination), destination
    end
    template = File.read(File.expand_path("../../../_template/Makefile", __dir__))
    assert_includes template, 'scripts/publish_project.rb" publish'
    assert_includes template, 'scripts/publish_project.rb" fingerprint'
    assert_includes File.read(File.expand_path("../../../.makeprojects", __dir__)), "systems/courses:dev"
    ProjectPublisher.run("clean", project, @workspace)
    assert File.file?(File.join(project, "layouts/post.html"))
    refute File.exist?(File.join(@workspace, "_layouts/post.html"))
  end

  def test_shared_makefile_publishes_the_kit_and_keeps_calendar_conventions
    template = File.expand_path("../../../_template/Makefile", __dir__)
    project = File.expand_path("..", __dir__)
    FileUtils.mkdir_p(File.join(@workspace, "scripts"))
    FileUtils.cp(File.expand_path("../../../../scripts/publish_project.rb", __dir__), File.join(@workspace, "scripts"))
    stdout, stderr, status = Open3.capture3("make", "-f", template, "-C", project,
                                          "assets", "WORKSPACE_ROOT=#{@workspace}")
    assert status.success?, "#{stdout}\n#{stderr}"
    assert_equal File.read(File.join(project, "layouts/post.html")), File.read(File.join(@workspace, "_layouts/post.html"))
    assert_includes File.read(File.join(@workspace, "assets/css/projects/courses/main.scss")), '@import "projects/courses/main";'
    refute File.exist?(File.join(@workspace, "assets/js/projects/courses/announcement-calendar"))
    css_entry = File.join(@workspace, "assets/css/projects/courses/main.scss")
    File.utime(Time.at(1), Time.at(1), css_entry)
    stdout, stderr, status = Open3.capture3("make", "-f", template, "-C", project,
                                          "assets", "WORKSPACE_ROOT=#{@workspace}")
    assert status.success?, "#{stdout}\n#{stderr}"
    assert_equal Time.at(1), File.mtime(css_entry)

    calendar = File.join(@workspace, "_projects/systems/calendar")
    FileUtils.mkdir_p(File.join(calendar, "js"))
    FileUtils.mkdir_p(File.join(calendar, "sass"))
    File.write(File.join(calendar, "js/calendar.js"), "calendar")
    File.write(File.join(calendar, "sass/main.scss"), ".calendar {}")
    stdout, stderr, status = Open3.capture3("make", "-f", template, "-C", calendar,
                                          "assets", "WORKSPACE_ROOT=#{@workspace}")
    assert status.success?, "#{stdout}\n#{stderr}"
    assert_equal "calendar", File.read(File.join(@workspace, "assets/js/projects/calendar/calendar.js"))
    assert_equal ".calendar {}", File.read(File.join(@workspace, "_sass/projects/calendar/main.scss"))
  end
end
