require "minitest/autorun"
require "fileutils"
require "jekyll"
require "json"
require "nokogiri"
require "sass"
require "tmpdir"
require_relative "../../../../scripts/publish_project"

# The viewer (/ui-builder/view/) and gallery (/ui-builder/gallery/) pages and the data include,
# built by Jekyll from their sources the way distribution.json publishes them, with spring on
# and off and under a baseurl: the page data is JSON that parses and can't close its script, the
# pages carry no style attributes and no "../" imports, ask search engines not to index them,
# and import only modules that exist. Also checks that distribution.json publishes every folder.
class UiBuilderPagesTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)
  COURSES = File.join(ROOT, "_projects/systems/courses")
  MESSAGES = File.join(ROOT, "_projects/systems/messages")
  JSON_SCRIPTS = %w[ui-builder-registry ui-builder-school ui-builder-courses].freeze
  INCLUDES = { "default" => "", "editor" => " editor=true", "widgets" => " widgets=true" }.freeze
  BACKSLASH = 92.chr

  # Where each published address the pages import comes from.
  SOURCES = {
    %r{\A/assets/js/projects/ui-builder/(.+)\z} => ->(name) { File.join(PROJECT, "js", name) },
    %r{\A/assets/js/projects/messages/(.+)\z} => ->(name) { File.join(MESSAGES, "js", name) },
    %r{\A/assets/js/chat/calendar/(.+)\z} => ->(name) { File.join(COURSES, "js/announcement-calendar", name) },
    %r{\A/assets/js/(.+)\z} => ->(name) { File.join(ROOT, "assets/js", name) },
  }.freeze

  def copy(from, to)
    FileUtils.mkdir_p(File.dirname(to))
    FileUtils.cp(from, to)
  end

  # Builds a site holding only what these pages use and yields its rendered files.
  def build(spring:, baseurl: "/preview")
    Dir.mktmpdir("ui-builder-pages-") do |source|
      %w[view gallery].each { |name| copy(File.join(PROJECT, "pages/#{name}.md"), File.join(source, "navigation/ui-builder/#{name}.md")) }
      copy(File.join(PROJECT, "_includes/ui_builder_data.html"), File.join(source, "_includes/projects/ui-builder/ui_builder_data.html"))
      Dir.glob(File.join(PROJECT, "data/*.yml")).each { |file| copy(file, File.join(source, "_data", File.basename(file))) }
      %w[ocs_kanban_board.html ocs_kanban_board_data.html].each { |name| copy(File.join(ROOT, "_includes", name), File.join(source, "_includes", name)) }
      %w[ocs_calendar_card.html ocs_calendar_card_data.html].each { |name| copy(File.join(COURSES, "_includes", name), File.join(source, "_includes", name)) }
      %w[kanban school_calendar].each { |name| copy(File.join(ROOT, "_data/#{name}.yml"), File.join(source, "_data/#{name}.yml")) }
      %w[csse csp csa csh].each { |code| copy(File.join(COURSES, "data/#{code}.yml"), File.join(source, "_data/#{code}.yml")) }
      copy(File.join(ROOT, "assets/js/api/config.js"), File.join(source, "assets/js/api/config.js"))
      FileUtils.mkdir_p(File.join(source, "_layouts"))
      File.write(File.join(source, "_layouts/opencs.html"), "<main>{{ content }}</main>")
      # The include on its own, the way each kind of page asks for it.
      INCLUDES.each do |name, params|
        File.write(File.join(source, "include-#{name}.html"), "---\n---\n{% include projects/ui-builder/ui_builder_data.html#{params} %}\n")
      end
      # Absolute folders: run from the repository, Jekyll would otherwise read its real _layouts.
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"), "config" => [], "plugins_dir" => [],
        "layouts_dir" => File.join(source, "_layouts"), "includes_dir" => File.join(source, "_includes"),
        "data_dir" => File.join(source, "_data"), "quiet" => true, "incremental" => false, "baseurl" => baseurl,
        "spring" => spring, "liquid" => { "error_mode" => "strict" }
      ))
      site.process
      read = ->(path) { File.read(File.join(source, "_site", path)) }
      yield({ "view" => read.call("ui-builder/view/index.html"), "gallery" => read.call("ui-builder/gallery/index.html"),
              "config" => read.call("assets/js/api/config.js") }.merge(INCLUDES.keys.to_h { |name| ["include-#{name}", read.call("include-#{name}.html")] }))
    end
  end

  def scripts(html)
    Nokogiri::HTML(html).css("script")
  end

  def module_urls(html)
    scripts(html).select { |script| script["type"] == "module" }.flat_map do |script|
      script.text.scan(/(?:from\s+|import\s*\(\s*|:\s*)'([^']+\.js)'/).flatten
    end
  end

  def test_the_page_data_parses_and_never_closes_its_script
    [true, false].each do |spring|
      build(spring: spring) do |pages|
        pages.values_at("view", "gallery").each do |html|
          JSON_SCRIPTS.each do |id|
            script = Nokogiri::HTML(html).at_css("script##{id}")
            assert script, "#{id} is on the page"
            assert_equal "application/json", script["type"]
            refute_includes script.inner_html, "<", "#{id} escapes every <"
            JSON.parse(script.text)
          end
          registry = JSON.parse(Nokogiri::HTML(html).at_css("script#ui-builder-registry").text)
          assert_includes Nokogiri::HTML(html).at_css("script#ui-builder-registry").inner_html, "#{BACKSLASH}u003cb>", "template text kept its <b>"
          %w[view gallery live store chat].each { |key| assert_kind_of Hash, registry.dig("text", key), "text.#{key}" }
          courses = JSON.parse(Nokogiri::HTML(html).at_css("script#ui-builder-courses").text)
          assert_equal %w[csse csp csa csh], courses.map { |course| course["code"] }
          assert courses.all? { |course| course["title"].is_a?(String) && !course["title"].empty? }
        end
      end
    end
  end

  def test_the_viewer_has_the_live_blocks_data_and_templates_and_the_gallery_does_not
    build(spring: true) do |pages|
      viewer = Nokogiri::HTML(pages["view"])
      assert_equal 1, viewer.css("script#ocs-kanban-defaults").size
      JSON.parse(viewer.at_css("script#ocs-kanban-defaults").text)
      refute_includes viewer.at_css("script#ocs-kanban-defaults").inner_html, "<"
      assert_equal 1, viewer.css("script#ocsSchoolCalendarData").size
      assert_kind_of Hash, JSON.parse(viewer.at_css("script#ocsSchoolCalendarData").text)["weeks"]
      assert_equal 1, viewer.css('template[data-ocs-template="kanban"]').size
      assert_equal 1, viewer.css('template[data-ocs-template="calendar-card"]').size
      # Template mode adds no scripts: the viewer loads kanban-board.js and calendar-card.js itself.
      assert_empty scripts(pages["view"]).select { |script| script["src"] }
      gallery = Nokogiri::HTML(pages["gallery"])
      assert_empty gallery.css("template, #ocs-kanban-defaults, #ocsSchoolCalendarData")
    end
  end

  def test_the_include_adds_editor_text_or_widgets_only_when_asked
    build(spring: true) do |pages|
      ids = ->(html) { Nokogiri::HTML(html).css("script[id], template").map { |node| node["id"] || node["data-ocs-template"] } }
      assert_equal JSON_SCRIPTS, ids.call(pages["include-default"]), "today's output: the three data scripts"
      assert_equal JSON_SCRIPTS + ["ui-builder-editor-text"], ids.call(pages["include-editor"])
      editor = Nokogiri::HTML(pages["include-editor"]).at_css("script#ui-builder-editor-text")
      refute_includes editor.inner_html, "<"
      JSON.parse(editor.text)
      assert_equal JSON_SCRIPTS + %w[ocs-kanban-defaults kanban ocsSchoolCalendarData calendar-card], ids.call(pages["include-widgets"])
      assert_equal pages["include-default"].strip, pages["include-widgets"][0, pages["include-default"].strip.size], "widgets only add to today's output"
    end
  end

  def test_pages_ask_not_to_be_indexed_and_use_no_style_attributes
    [true, false].each do |spring|
      build(spring: spring) do |pages|
        pages.values_at("view", "gallery").each do |html|
          document = Nokogiri::HTML(html)
          assert_equal 1, document.css('meta[name="robots"][content="noindex"]').size
          assert_empty document.css("[style], style")
          refute_includes html, "spring.opencodingsociety.com", "Spring's address comes from config.js at run time"
        end
        assert_includes pages["view"], 'id="ui-builder-viewer"'
        assert_includes pages["gallery"], 'id="ui-builder-gallery"'
        # The one place spring is read: config.js, which picks the store.
        assert_includes pages["config"], %(export const springEnabled = "#{spring}" !== "false";)
      end
    end
  end

  def test_scripts_import_existing_modules_by_baseurl_and_never_by_parent_path
    ["/preview", ""].each do |baseurl|
      build(spring: true, baseurl: baseurl) do |pages|
        { "view" => %w[api/config.js chat/rich-text.js projects/messages/messages-model.js projects/ui-builder/viewer.js
                       projects/messages/conversation-embed.js kanban-board.js chat/calendar/calendar-card.js
                       chat/calendar/calendar-model.js api/microblog.js],
          "gallery" => %w[api/config.js projects/ui-builder/gallery.js] }.each do |name, expected|
          urls = module_urls(pages[name])
          expected.each { |path| assert_includes urls, "#{baseurl}/assets/js/#{path}", "#{name} uses #{path}" }
          urls.each do |url|
            refute_includes url, "../", url
            path = url.delete_prefix(baseurl)
            pattern, source = SOURCES.find { |candidate, _| path.match?(candidate) }
            assert pattern, "#{url} is an asset this test knows"
            assert File.file?(source.call(path[pattern, 1])), "#{url} has a source file"
          end
        end
      end
    end
    Dir.glob(File.join(PROJECT, "js/*.js")).each do |file|
      refute_match(/(?:from\s+|import\s*\(\s*)['"]\.\.\//, File.read(file), "#{File.basename(file)} imports with ./ only")
    end
  end

  def test_front_matter_keeps_the_pages_out_of_menus_and_search
    { "view" => "/ui-builder/view/", "gallery" => "/ui-builder/gallery/" }.each do |name, permalink|
      front = SafeYAML.load(File.read(File.join(PROJECT, "pages/#{name}.md"))[/\A---\n(.*?)\n---\n/m, 1])
      assert_equal "opencs", front["layout"]
      assert_equal permalink, front["permalink"]
      %w[full_width search_exclude hide regenerate].each { |key| assert_equal true, front[key], "#{name}: #{key}" }
    end
  end

  # The calendar system's sass hides every h1 on the site (an unscoped h1 rule). The builder shows
  # its pages' titles again, and the gallery's: gallery.js draws it as an h1 under [data-ui-gallery].
  def test_page_and_gallery_titles_show_despite_the_site_wide_h1_rule
    sass = File.join(PROJECT, "sass")
    css = Sass::Engine.new(File.read(File.join(sass, "main.scss")), syntax: :scss, load_paths: [sass]).render
    %w[[data-ui-page] [data-ui-gallery]].each do |root|
      rule = css.scan(/([^{}]+)\{([^{}]*)\}/).find { |selectors, _| selectors.split(",").map(&:strip).include?("#{root} h1") }
      assert rule, "#{root} h1 has a rule"
      assert_match(/display:\s*block/, rule[1], "#{root} h1 is shown")
    end
    build(spring: true) { |pages| assert Nokogiri::HTML(pages["gallery"]).at_css("#ui-builder-gallery[data-ui-gallery]") }
  end

  def test_the_loading_line_is_registry_text_escaped
    build(spring: false) do |pages|
      registry = SafeYAML.load_file(File.join(PROJECT, "data/ui_builder.yml"))
      viewer = Nokogiri::HTML(pages["view"]).at_css("#ui-builder-viewer [role=status]")
      assert_equal registry.dig("text", "view", "loading"), viewer.text
      gallery = Nokogiri::HTML(pages["gallery"]).at_css("#ui-builder-gallery [role=status]")
      assert_equal registry.dig("text", "gallery", "loading"), gallery.text
    end
  end

  def test_distribution_publishes_every_source_folder
    entries = JSON.parse(File.read(File.join(PROJECT, "distribution.json"))).fetch("files")
    sources = entries.map { |entry| entry.fetch("source") }
    # tests stay in the project; docs/*.md are published as posts by the project Makefile's docs target.
    folders = Dir.children(PROJECT).select { |name| File.directory?(File.join(PROJECT, name)) } - %w[tests docs]
    folders.each do |folder|
      files = Dir.glob(File.join(PROJECT, folder, "**", "*")).select { |file| File.file?(file) }
      next if files.empty?

      files.each do |file|
        relative = file.delete_prefix("#{PROJECT}/")
        assert sources.any? { |source| relative == source || relative.start_with?("#{source}/") }, "#{relative} is published"
      end
    end
    Dir.mktmpdir("ui-builder-publish-") do |workspace|
      published = ProjectPublisher.files(PROJECT, workspace).to_h { |from, to| [from.delete_prefix("#{PROJECT}/"), to.delete_prefix("#{workspace}/")] }
      assert_equal "navigation/ui-builder/view.md", published["pages/view.md"]
      assert_equal "navigation/ui-builder/gallery.md", published["pages/gallery.md"]
      assert_equal "_includes/projects/ui-builder/ui_builder_data.html", published["_includes/ui_builder_data.html"]
      assert_equal "_data/ui_builder.yml", published["data/ui_builder.yml"]
      %w[viewer gallery blocks-live blocks-project page-store spring-page-store draft-store].each do |name|
        assert_equal "assets/js/projects/ui-builder/#{name}.js", published["js/#{name}.js"]
      end
    end
  end
end
