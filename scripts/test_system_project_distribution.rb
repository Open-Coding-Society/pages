require "minitest/autorun"
require "tmpdir"
require "fileutils"
require "json"
require "open3"
require "rbconfig"
require_relative "publish_project"

class SystemProjectDistributionTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  TEMPLATE = File.join(ROOT, "_projects/_template/Makefile")
  LEGACY = {
    "topics" => [
      ["pages/search.md", "navigation/search.md"],
      ["pages/topics.md", "navigation/topics.md"],
      ["_includes", "_includes"],
      ["plugins", "_plugins"],
      ["data", "_data"],
      ["js", "assets/js/topics"],
      ["sass/main.scss", "_sass/projects/topics/main.scss"]
    ],
    "capstone" => [
      ["pages/capstone.md", "navigation/capstone.md"],
      ["_includes/capstone-browser.html", "_includes/projects/capstone/capstone-browser.html"],
      ["plugins/capstone.rb", "_plugins/capstone.rb"],
      ["js", "assets/js/capstone-directory"],
      ["sass/main.scss", "_sass/projects/capstone/main.scss"]
    ]
  }.freeze

  def in_workspace
    Dir.mktmpdir("system-project-distribution-") do |workspace|
      FileUtils.cp(File.join(ROOT, ".gitignore"), workspace)
      FileUtils.mkdir_p(File.join(workspace, "scripts"))
      FileUtils.cp(File.join(ROOT, "scripts/publish_project.rb"), File.join(workspace, "scripts"))
      command("git", "-C", workspace, "init", "-q")
      yield workspace
    end
  end

  def command(*arguments)
    stdout, stderr, status = Open3.capture3(*arguments)
    assert status.success?, "#{arguments.join(' ')}\n#{stdout}\n#{stderr}"
    stdout
  end

  def project_copy(workspace, name)
    source = File.join(ROOT, "_projects/systems", name)
    project = File.join(workspace, "_projects/systems", name)
    FileUtils.mkdir_p(project)
    manifest = File.read(File.join(source, "distribution.json"))
    JSON.parse(manifest).fetch("files").map { |entry| entry.fetch("source") }.uniq.each do |relative|
      FileUtils.mkdir_p(File.dirname(File.join(project, relative)))
      FileUtils.cp_r(File.join(source, relative), File.join(project, relative))
    end
    File.write(File.join(project, "distribution.json"), manifest)
    project
  end

  def test_topics_and_capstone_migrate_clean_and_republish_only_ignored_outputs
    LEGACY.each do |name, entries|
      in_workspace do |workspace|
        project = project_copy(workspace, name)
        manifest_path = File.join(project, "distribution.json")
        current = File.read(manifest_path)
        legacy = entries.map { |source, destination| { "source" => source, "destination" => destination } }
        File.write(manifest_path, JSON.generate("files" => legacy))
        ProjectPublisher.run("publish", project, workspace)
        old_paths = ProjectPublisher.files(project, workspace).map(&:last)

        File.write(manifest_path, current)
        command("make", "-f", TEMPLATE, "-C", project, "assets", "WORKSPACE_ROOT=#{workspace}")
        mappings = ProjectPublisher.files(project, workspace)
        new_paths = mappings.map(&:last)
        (old_paths - new_paths).each { |path| refute File.exist?(path), path }
        mappings.each { |source, destination| assert_equal File.binread(source), File.binread(destination) }

        relative = new_paths.map { |path| path.delete_prefix("#{workspace}/") }
        ignored = command("git", "-C", workspace, "check-ignore", "--", *relative).lines.map(&:strip)
        assert_equal relative.sort, ignored.sort, "Every #{name} output uses a generic ignored project root"
        assert relative.all? { |path| path.match?(%r{\A(?:navigation|_includes|_plugins|_data|_sass|assets/js)/projects/#{name}/}) }

        command("make", "-f", TEMPLATE, "-C", project, "clean", "WORKSPACE_ROOT=#{workspace}")
        new_paths.each { |path| refute File.exist?(path), path }
        assert File.file?(File.join(project, "distribution.json"))
        command("make", "-f", TEMPLATE, "-C", project, "assets", "WORKSPACE_ROOT=#{workspace}")
        new_paths.each { |path| assert File.file?(path), path }
      end
    end
  end

  def test_new_roots_are_cleaned_even_without_a_distribution_cache
    in_workspace do |workspace|
      project = project_copy(workspace, "topics")
      paths = %w[navigation _data _plugins _layouts].map do |root|
        path = File.join(workspace, root, "projects/topics/orphan")
        FileUtils.mkdir_p(File.dirname(path))
        File.write(path, "old output")
        path
      end
      command("make", "-f", TEMPLATE, "-C", project, "clean", "WORKSPACE_ROOT=#{workspace}")
      paths.each { |path| refute File.exist?(path), path }
    end
  end

  def test_jekyll_loads_nested_plugins_data_and_pages_without_adding_posts
    in_workspace do |workspace|
      %w[topics capstone].each do |name|
        ProjectPublisher.run("publish", project_copy(workspace, name), workspace)
      end
      FileUtils.cp(File.join(ROOT, "_includes/capstone-games.html"), File.join(workspace, "_includes"))
      FileUtils.mkdir_p(File.join(workspace, "_layouts"))
      File.write(File.join(workspace, "_layouts/opencs.html"), "<main>{{ content }}</main>")
      FileUtils.mkdir_p(File.join(workspace, "_posts"))
      File.write(File.join(workspace, "_posts/2026-01-01-example.md"), <<~POST)
        ---
        title: Example
        categories: [Java]
        permalink: /example/
        capstone_project: {course: CSA, school_year: "2026-2027"}
        ---
        Example lesson.
      POST
      code = <<~RUBY
        require "jekyll"
        site = Jekyll::Site.new(Jekyll.configuration(
          "source" => ARGV.fetch(0), "destination" => File.join(ARGV.fetch(0), "_site"),
          "layouts_dir" => File.join(ARGV.fetch(0), "_layouts"),
          "config" => [], "quiet" => true,
          "baseurl" => "/preview", "future" => true
        ))
        site.process
        abort "Landing pages became posts" unless site.posts.docs.size == 1
      RUBY
      command(RbConfig.ruby, "-e", code, workspace)
      site = File.join(workspace, "_site")
      %w[topics/index.html search/index.html capstone/index.html topics/view/example/index.html].each do |path|
        assert File.file?(File.join(site, path)), path
      end
      index = JSON.parse(File.read(File.join(site, "assets/js/projects/topics/data.json")))
      assert_equal ["/example/"], index.map { |entry| entry.fetch("url") }
      browser = File.read(File.join(site, "topics/index.html"))
      assert_includes browser, "/preview/assets/js/projects/topics/browser.js"
      assert_includes browser, "&quot;python&quot;", "Unit names are read from namespaced YAML"
      capstone = File.read(File.join(site, "capstone/index.html"))
      assert_includes capstone, "/preview/assets/js/projects/capstone/browser.js"
      assert_includes capstone, 'data-year="2026-2027"'
    end
  end
end
