require "minitest/autorun"
require "tmpdir"
require "json"
require "digest"
require "fileutils"
require "open3"
require "stringio"
require_relative "clean_removed_projects"

ROOT = File.expand_path("..", __dir__)

# A checkout that built systems/student-management-groups before #1843 deleted its source,
# next to systems/messages, which still has one.
class RemovedProjectCleanupTest < Minitest::Test
  DELETED_PROJECT_OUTPUTS = %w[
    _posts/projects/student-management-groups/2026-04-15-student-management-groups-GROUP_DASHBOARD.html
    _posts/projects/student-management-groups/2026-04-15-student-management-groups_IPYNB_2_.md
    _posts/projects/2026-04-15-student-management-groups.md
    _includes/projects/student-management-groups/modal.html
    _notebooks/projects/student-management-groups/index.ipynb
    assets/js/projects/student-management-groups/groups.js
    assets/css/projects/student-management-groups/main.scss
    _sass/projects/student-management-groups/main.scss
    images/projects/student-management-groups/icon.png
    _projects/systems/student-management-groups/Makefile
  ].freeze

  def setup
    @workspace = Dir.mktmpdir("removed-project-cleanup-")
    FileUtils.cp(File.join(ROOT, ".gitignore"), @workspace)
    git("init", "-q")
    write("_projects/systems/messages/navigation/dm.md", "dm")
    git("add", "_projects")
  end

  def teardown
    FileUtils.remove_entry(@workspace)
  end

  def write(path, content = "generated")
    file = File.join(@workspace, path)
    FileUtils.mkdir_p(File.dirname(file))
    File.write(file, content)
  end

  def exist?(path)
    File.exist?(File.join(@workspace, path))
  end

  def git(*arguments)
    _, stderr, status = Open3.capture3("git", "-C", @workspace, *arguments)
    assert status.success?, "git #{arguments.join(' ')}: #{stderr}"
  end

  # Records outputs the way publish_project.rb does: published path => SHA-256 of its content.
  def cache(project, outputs)
    write(".project-distribution-cache/#{project}.json",
          JSON.generate(outputs.transform_values { |content| Digest::SHA256.hexdigest(content) }))
  end

  def clean
    report = StringIO.new
    RemovedProjectCleaner.run(@workspace, out: report)
    report.string
  end

  def test_removes_everything_a_deleted_project_built
    DELETED_PROJECT_OUTPUTS.each { |path| write(path) }
    clean
    DELETED_PROJECT_OUTPUTS.each { |path| refute exist?(path), path }
    refute exist?("_projects/systems/student-management-groups"), "The emptied project folder goes too"
  end

  def test_keeps_what_current_and_uncommitted_projects_built
    outputs = %w[
      _posts/projects/messages/2026-09-12-dm.md
      _posts/projects/2026-04-15-messages.md
      _posts/projects/2026-04-15-messages_csp.md
      assets/js/projects/messages/thread.js
      _includes/projects/systems/chat.html
      _projects/systems/messages/Makefile
      _posts/projects/new-game/2026-04-15-new-game_IPYNB_2_.md
      assets/js/projects/new-game/game.js
      _projects/games/new-game/Makefile
    ]
    outputs.each { |path| write(path) }
    write("_projects/games/new-game/index.ipynb", "{}")
    clean
    outputs.each { |path| assert exist?(path), path }
  end

  def test_an_index_post_belongs_to_its_whole_project_name
    write("_projects/systems/groups_v2/index.md", "index")
    git("add", "_projects/systems/groups_v2/index.md")
    %w[2026-04-15-groups.md 2026-04-15-groups_csp.md 2026-04-15-groups_v2.md].each { |post| write("_posts/projects/#{post}") }
    clean
    refute exist?("_posts/projects/2026-04-15-groups.md")
    refute exist?("_posts/projects/2026-04-15-groups_csp.md"), "Course copies of a deleted project's index go too"
    assert exist?("_posts/projects/2026-04-15-groups_v2.md")
  end

  def test_jupyter_checkpoints_are_not_a_source
    checkpoint = "_projects/systems/student-management-groups/.ipynb_checkpoints/index-checkpoint.ipynb"
    write(checkpoint, "{}")
    write(DELETED_PROJECT_OUTPUTS.first)
    clean
    refute exist?("_posts/projects/student-management-groups")
    assert exist?(checkpoint), "Only build outputs are removed"
  end

  def test_never_removes_tracked_files
    write("_posts/projects/student-management-groups/notes.md", "committed by hand")
    git("add", "-f", "_posts/projects/student-management-groups/notes.md")
    write("_includes/group_dashboard.html", "restored")
    git("add", "_includes/group_dashboard.html")
    write("_includes/group-chat.html", "chat")
    cache("student-management-groups", "_includes/group_dashboard.html" => "restored", "_includes/group-chat.html" => "chat")
    clean
    assert exist?("_posts/projects/student-management-groups/notes.md")
    assert exist?("_includes/group_dashboard.html")
    refute exist?("_includes/group-chat.html")
    refute exist?(".project-distribution-cache/student-management-groups.json")
  end

  def test_keeps_a_tracked_cache_and_the_files_it_records
    write("_includes/group-chat.html", "chat")
    cache("student-management-groups", "_includes/group-chat.html" => "chat")
    git("add", "-f", ".project-distribution-cache/student-management-groups.json")
    clean
    assert exist?(".project-distribution-cache/student-management-groups.json")
    assert exist?("_includes/group-chat.html")
  end

  def test_keeps_files_a_current_project_publishes
    write("_posts/projects/dm-docs/guide.md", "guide")
    write("assets/js/chat/socket.js", "socket")
    cache("messages", "_posts/projects/dm-docs/guide.md" => "guide", "assets/js/chat/socket.js" => "socket")
    cache("student-management-groups", "assets/js/chat/socket.js" => "socket")
    clean
    assert exist?("_posts/projects/dm-docs/guide.md")
    assert exist?("assets/js/chat/socket.js")
    assert exist?(".project-distribution-cache/messages.json")
    refute exist?(".project-distribution-cache/student-management-groups.json")
  end

  def test_refuses_to_remove_a_published_file_someone_edited
    write("_includes/group-chat.html", "edited by hand")
    cache("student-management-groups", "_includes/group-chat.html" => "chat")
    assert_raises(RuntimeError) { clean }
    assert_equal "edited by hand", File.read(File.join(@workspace, "_includes/group-chat.html"))
  end

  def test_leaves_everything_alone_outside_a_git_checkout
    FileUtils.rm_rf(File.join(@workspace, ".git"))
    write(DELETED_PROJECT_OUTPUTS.first)
    ceiling = ENV["GIT_CEILING_DIRECTORIES"]
    ENV["GIT_CEILING_DIRECTORIES"] = File.dirname(@workspace)
    refute_empty clean, "Says why nothing was cleaned"
    assert exist?(DELETED_PROJECT_OUTPUTS.first)
  ensure
    ENV["GIT_CEILING_DIRECTORIES"] = ceiling
  end

  def test_removes_nothing_when_git_lists_no_project_source
    git("rm", "-q", "-r", "--cached", "_projects")
    FileUtils.rm_rf(File.join(@workspace, "_projects"))
    write("_posts/projects/messages/2026-09-12-dm.md")
    refute_empty clean, "Says why nothing was cleaned"
    assert exist?("_posts/projects/messages/2026-09-12-dm.md")
  end

  def test_make_build_and_clean_remove_a_deleted_projects_post
    FileUtils.cp(File.join(ROOT, "Makefile"), @workspace)
    FileUtils.mkdir_p(File.join(@workspace, "scripts"))
    %w[clean_removed_projects.rb publish_project.rb generate_sass_imports.py].each do |script|
      FileUtils.cp(File.join(ROOT, "scripts", script), File.join(@workspace, "scripts"))
    end
    write("_projects/.makeprojects", "# No registered projects\n")
    # clean depends on stop, which kills Jekyll servers and watchers machine-wide; -o skips it.
    %w[build-registered-projects build-dev-projects clean].each do |target|
      write(DELETED_PROJECT_OUTPUTS.first)
      stdout, stderr, status = Open3.capture3("make", "-C", @workspace, "-o", "stop", target, "PYTHON=python3")
      assert status.success?, "make #{target}\n#{stdout}\n#{stderr}"
      refute exist?(DELETED_PROJECT_OUTPUTS.first), "make #{target}"
    end
  end
end
