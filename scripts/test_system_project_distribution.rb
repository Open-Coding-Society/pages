require "minitest/autorun"
require "tmpdir"
require "fileutils"
require "json"
require "jekyll"
require "nokogiri"
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
    unless File.file?(File.join(source, "distribution.json"))
      %w[navigation pages js sass].each do |directory|
        FileUtils.cp_r(File.join(source, directory), project) if File.directory?(File.join(source, directory))
      end

      def test_class_management_and_grades_publish_moved_posts_with_original_routes
        expected = {
          "class_manage" => {
            "2025-08-01-ClassroomManagement.md" => "/student/classrooms",
            "2025-04-04-TeamTeachToolkit_Signup.md" => "/student/TeamTeachToolkit/signup"
          },
          "grades" => {
            "2024-10-29-submissions.md" => "/student/submissions",
            "2025-01-21-grader_view.md" => "/student/assign-grades"
          }
        }
        registry = File.readlines(File.join(ROOT, "_projects/.makeprojects"), chomp: true)
        assert_includes registry, "systems/class_manage:dev"

        in_workspace do |workspace|
          expected.each do |name, pages|
            project = project_copy(workspace, name)
            ProjectPublisher.run("publish", project, workspace)
            pages.each do |filename, permalink|
              source = File.join(project, "pages", filename)
              published = File.join(workspace, "_posts/projects", name, filename)
              assert_equal File.binread(source), File.binread(published)
              frontmatter = File.read(published)[/\A---\s*\n(.*?)\n---/m, 1]
              assert_equal permalink, YAML.safe_load(frontmatter).fetch("permalink")
              command("git", "-C", workspace, "check-ignore", "-q", "--", published)
            end

            def test_class_management_notebooks_keep_their_routes
              expected = {
                "2024-10-31-bathroom" => "/hallpass_queue",
                "2024-10-31-reporting_issues" => "/bathroom/issues",
                "2024-12-17-statistics" => "/bathroom/statistics",
                "2024-12-18-hallpass" => "/hallpass_queue/hallpass",
                "2025-01-25-request_pass" => "/hallpass/requestpass"
              }
              expected.each do |name, permalink|
                source = File.join(ROOT, "_projects/systems/class_manage/notebooks", "#{name}.ipynb")
                first_cell = JSON.parse(File.read(source)).fetch("cells").first.fetch("source").join
                frontmatter = first_cell[/\A---\s*\n(.*?)\n---/m, 1]
                assert_equal permalink, YAML.safe_load(frontmatter).fetch("permalink")
                refute File.exist?(File.join(ROOT, "_notebooks/student_toolkit/BathroomPass", "#{name}.ipynb"))
              end
            end
          end
        end
      end
      return project
    end
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

  def test_microblog_migrates_to_project_paths_and_republishes_after_clean
    in_workspace do |workspace|
      project = project_copy(workspace, "microblog")
      manifest = File.join(project, "distribution.json")
      legacy = [
        { "source" => "js/microblog.js", "destination" => "assets/js/api/microblog.js" },
        { "source" => "pages/review.md", "destination" => "navigation/review.md" }
      ]
      File.write(manifest, JSON.generate("files" => legacy))
      ProjectPublisher.run("publish", project, workspace)
      FileUtils.rm(manifest)
      command("make", "-f", TEMPLATE, "-C", project, "assets", "WORKSPACE_ROOT=#{workspace}")
      legacy.each { |entry| refute File.exist?(File.join(workspace, entry.fetch("destination"))) }
      mappings = {
        "navigation/microblog_foundation.html" => "_includes/projects/microblog/microblog_foundation.html",
        "pages/review.md" => "navigation/projects/microblog/review.md"
      }
      %w[microblog.scss microblog-review.scss].each do |name|
        mappings["sass/#{name}"] = "_sass/projects/microblog/#{name}"
      end
      %w[microblog.js microblog-rate-limit.js microblog-notifications.js microblog-review.js
         quick-access.js capstone-microblog-badges.js microblog-authors.json].each do |name|
        mappings["js/#{name}"] = "assets/js/projects/microblog/#{name}"
      end
      paths = mappings.values
      mappings.each { |source, destination| assert_equal File.binread(File.join(project, source)), File.binread(File.join(workspace, destination)) }
      ignored = command("git", "-C", workspace, "check-ignore", "--", *paths).lines.map(&:strip)
      assert_equal paths.sort, ignored.sort
      command("make", "-f", TEMPLATE, "-C", project, "clean", "WORKSPACE_ROOT=#{workspace}")
      paths.each { |path| refute File.exist?(File.join(workspace, path)), path }
      command("make", "-f", TEMPLATE, "-C", project, "assets", "WORKSPACE_ROOT=#{workspace}")
      mappings.each { |source, destination| assert_equal File.binread(File.join(project, source)), File.binread(File.join(workspace, destination)) }
    end
  end

  def test_microblog_published_files_render_in_jekyll
    in_workspace do |workspace|
      project = project_copy(workspace, "microblog")
      command("make", "-f", TEMPLATE, "-C", project, "assets", "WORKSPACE_ROOT=#{workspace}")
      reader = File.join(workspace, "_includes/projects/courses/reader/start.html")
      FileUtils.mkdir_p(File.dirname(reader))
      FileUtils.cp(File.join(ROOT, "_projects/systems/courses/reader/start.html"), reader)
      ratings = File.join(workspace, "_includes/projects/lesson-feedback/lesson-feedback-ratings.html")
      FileUtils.mkdir_p(File.dirname(ratings))
      File.write(ratings, "Ratings form")
      FileUtils.mkdir_p(File.join(workspace, "_layouts"))
      File.write(File.join(workspace, "_layouts/page.html"), <<~LIQUID)
        {% if page.microblog or page.team_teach and page.assignment %}{% include projects/microblog/microblog_foundation.html %}{% endif %}
        {% if page.document_reader %}{% include projects/courses/reader/start.html %}</div></div></div>{% endif %}
        {{ content }}
      LIQUID
      {
        "ordinary" => "microblog: true\nauthors: [author1]",
        "reader" => "microblog: true\ndocument_reader: {courses: {}, default_course: csp}",
        "team" => "team_teach: true\nassignment: true\ndocument_reader: {courses: {}, default_course: csp}",
        "disabled" => "microblog: false\ndocument_reader: {courses: {}, default_course: csp}"
      }.each do |name, frontmatter|
        File.write(File.join(workspace, "#{name}.md"), "---\nlayout: page\n#{frontmatter}\n---\n#{name}\n")
      end
      FileUtils.mkdir_p(File.join(workspace, "assets/css"))
      %w[mixins/_variables.scss mixins/_panel.scss mixins/_forms.scss elements/tables/_main.scss dm-bell.scss].each do |path|
        destination = File.join(workspace, "_sass/open-coding", path)
        FileUtils.mkdir_p(File.dirname(destination))
        FileUtils.cp(File.join(ROOT, "_sass/open-coding", path), destination)
      end
      File.write(File.join(workspace, "assets/css/microblog.scss"), "---\n---\n$red: #e53e3e;\n@import 'open-coding/mixins/variables';\n@import 'open-coding/mixins/panel';\n@import 'open-coding/mixins/forms';\n@import 'projects/microblog/microblog';\n@import 'projects/microblog/microblog-review';\n@import 'open-coding/elements/tables/main';\n@import 'open-coding/dm-bell';\n")
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => workspace, "destination" => File.join(workspace, "_site"),
        "layouts_dir" => File.join(workspace, "_layouts"), "includes_dir" => File.join(workspace, "_includes"),
        "config" => [], "plugins_dir" => [], "quiet" => true, "baseurl" => "/preview"
      ))
      site.process
      %w[ordinary reader team disabled].each do |name|
        document = Nokogiri::HTML(File.read(File.join(site.dest, "#{name}.html")))
        enabled = name != "disabled"
        assert_equal enabled ? 1 : 0, document.css("#microblog-toggle-btn").size, name
        assert_equal enabled ? 1 : 0, document.css("#microblog-panel").size
        assert_equal %w[reader team].include?(name) ? 1 : 0, document.css(".document-reader__toolbar #microblog-toggle-btn").size
        assert_equal name == "team" ? 1 : 0, document.css("#microblog-ratings-panel").size
      end
      assert File.file?(File.join(site.dest, "review.html"))
      ordinary = File.read(File.join(site.dest, "ordinary.html"))
      assert_includes ordinary, "/preview/assets/js/projects/microblog/microblog.js"
      assert_includes ordinary, "/preview/assets/js/projects/microblog/quick-access.js"
      assert_includes ordinary, 'class="ocs__table ocs__table--list microblog-table"'
      assert_includes File.read(File.join(site.dest, "review.html")), "/preview/assets/js/projects/microblog/microblog-review.js"
      document = Nokogiri::HTML(ordinary)
      assert_equal 1, document.css("#microblog-panel .ocs__card-header.microblog-panel-header .ocs__truncate.microblog-panel-title").size
      %w[microblog-modal microblog-qr-modal reply-modal].each do |id|
        assert_equal 1, document.css("##{id}.ocs__modal.hidden .ocs__modal-card").size
      end
      authors = JSON.parse(File.read(File.join(site.dest, "assets/js/projects/microblog/microblog-authors.json")))
      assert authors.any? { |entry| entry["authors"] == ["author1"] && entry["path"].end_with?("ordinary.html") }
      css = File.read(File.join(site.dest, "assets/css/microblog.css"))
      assert_includes css, ".microblog-panel"
      assert_includes css, ".review-page"
      assert_match(/^\s*\.ocs__table\.ocs__table--list\s*\{[^}]*background:\s*transparent/m, css)
      assert_match(/^\s*\.ocs__table\.ocs__table--list tbody tr:nth-child\(even\):hover\s*\{\s*background:\s*transparent/m, css)
      assert_match(/\.microblog-modal\.ocs__modal\.hidden\s*\{\s*display:\s*none/, css)
      assert_match(/\.microblog-panel\s*\{[^}]*border:\s*1px solid var\(--field-border, var\(--ui-border\)\);[^}]*box-shadow:/m, css)
      assert_match(/box-shadow:\s*0 0 20px 4px color-mix\(in srgb, var\(--pref-text-color\) 25%, transparent\)/, css)
      assert_match(/\.user-theme-active \.microblog-panel\s*\{\s*border-color:\s*var\(--field-border, var\(--ui-border\)\) !important/, css)
      assert_match(/\.microblog-panel:not\(\.open\)\s*\{\s*box-shadow:\s*none/, css)
      %w[microblog-filter-page microblog-filter-many microblog-icon-btn].each do |name|
        assert_match(/\.#{name}\.ocs__btn\.small[^{]*\{[^}]*padding:\s*0;/, css)
      end
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
