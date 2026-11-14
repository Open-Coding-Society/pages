require "minitest/autorun"
require "jekyll"
require "tmpdir"
require "fileutils"
require "nokogiri"
require "open3"
require "sass"
require_relative "publish_project"
require_relative "../_projects/systems/courses/reader/reader"
require_relative "../_projects/systems/topics/plugins/topics"
require_relative "../_projects/systems/courses/plugins/lesson_player_pages"

class DocumentReaderTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)

  def test_wrapped_navigation_links_override_fixed_small_button_height
    stylesheet = File.read(File.join(ROOT, "_projects/systems/courses/sass/_document-reader.scss"))
    css = Sass::Engine.new(stylesheet, syntax: :scss).render
    # More specific than .ocs__btn.small, which can load later in the bundle.
    rule = css[/\.document-reader__navigation \.document-reader__lesson\.ocs__btn \{([^}]+)\}/, 1]
    refute_nil rule
    assert_match(/height: auto;/, rule)
    assert_match(/white-space: normal;/, rule)
    assert_match(/box-sizing: border-box;/, rule)
    assert_match(/grid-template-columns: auto minmax\(0, 1fr\) auto;/, rule)
    assert_match(/\.document-reader__navigation \.document-reader__check \{\s*font-size: 0\.75rem;/, css)
  end

  def test_real_shared_javascript_keeps_one_document_and_submission_identity
    ["", "/preview"].each do |base|
      Dir.mktmpdir("document-reader-") do |source|
        %w[courses blogs topics].each do |project|
          ProjectPublisher.run("publish", File.join(ROOT, "_projects/systems", project), source)
        end
        File.write(File.join(source, "_layouts/opencs.html"), "<main>{{ content }}</main>")
        FileUtils.mkdir_p(File.join(source, "_includes/runners"))
        File.write(File.join(source, "_includes/runners/code.html"), <<~HTML)
          <div class="code-runner-container" data-storage-key="{{ page.permalink | replace: '/', '_' }}_{{ include.runner_id }}">
            <textarea>{{ include.code | escape }}</textarea>
          </div>
        HTML
        FileUtils.cp(File.join(ROOT, "_includes/reading_time.html"), File.join(source, "_includes"))
        FileUtils.mkdir_p(File.join(source, "_posts"))
        input = File.join(ROOT, "_posts/Foundation/2026-07-22-Introduction-to-JavaScript_IPYNB_2_.md")
        raise "Convert the Foundation Intro to JavaScript notebook before this test" unless File.file?(input)
        body = File.read(input)
        File.write(File.join(source, "_posts/2026-07-22-javascript.md"), body)
        reference = "---\nlayout: opencs\ntitle: Reference\npermalink: /reference/\ncategories: [JavaScript]\n---\nReference body\n"
        File.write(File.join(source, "reference.md"), reference)
        # Course-placed navigation pages stay out of Topics but belong to their week.
        File.write(File.join(source, "mcq.md"), "---\nlayout: post\ntitle: MCQ Lessons\npermalink: /csp/mcq\n" \
          "courses: {csp: {week: 1}}\nsearch_exclude: true\n---\nMCQ units\n")
        File.write(File.join(source, "language.md"), "---\nlayout: opencs\ntitle: Language Reference\n" \
          "permalink: /language-reference/\ncourses: {csse: {week: 1}}\nsearch_exclude: true\n---\nLanguage body\n")
        # A previous build may have both sorts of generated course copies.
        %w[wrapper converted-notebook].each do |name|
          File.write(File.join(source, "_posts/2026-07-22-#{name}.md"), <<~POST)
            ---
            layout: post
            title: Old shared copy
            permalink: /javascript/intro/csp/
            courses: {csp: {week: 0}}
            assignment: true
            categories: [JavaScript]
            ---
            DUPLICATED LESSON BODY
          POST
        end
        site = Jekyll::Site.new(Jekyll.configuration(
          "source" => source, "destination" => File.join(source, "_site"),
          "layouts_dir" => File.join(source, "_layouts"), "includes_dir" => File.join(source, "_includes"),
          "config" => [], "plugins_dir" => [], "quiet" => true, "future" => true,
          "incremental" => false, "baseurl" => base, "disqus" => {}, "default_course" => "csse"
        ))
        site.reset
        site.read
        %w[csa csp csse csh].each do |course|
          site.data[course] = {
            "course" => { "code" => course.upcase, "title" => course.upcase },
            "Sprint1" => { "title" => "Getting started", "start" => 0, "end" => 2,
                           0 => { "theme" => "Introduction" }, 1 => { "theme" => "JavaScript" } }
          }
        end
        original = site.posts.docs.find { |document| document.url == "/javascript/intro" }
        identity = original.data.slice("title", "permalink", "courses", "assignment", "assignment_submission_type")
        content = original.content.dup
        site.generate
        assert_equal identity, original.data.slice(*identity.keys)
        assert_equal content, original.content
        assert_equal %w[csp csse], original.data["document_reader"]["courses"].keys.sort
        assert_equal "csp", original.data["document_reader"]["default_course"]
        site.render
        site.write
        assert_equal body, File.read(File.join(source, "_posts/2026-07-22-javascript.md"))
        html = File.read(original.destination(site.dest))
        document = Nokogiri::HTML(html)
        assert_equal 1, document.css("[data-document-reader]").size
        assert_equal 1, document.css("article").size
        assert_equal 1, document.css("[data-reader-navigation] > summary [data-reader-heading]").size
        assert_equal 0, document.css("[data-reader-navigation] > nav h2[data-reader-heading]").size
        home = document.at_css("[data-reader-home]")
        assert_equal home, document.at_css(".document-reader__toolbar").element_children.first
        assert_equal 1, home.css(".fa-home[aria-hidden='true']").size
        assert_equal "Topics catalog", home["aria-label"]
        toolbar = document.at_css(".document-reader__toolbar")
        %w[previous next].each do |direction|
          button = toolbar.at_css("[data-reader-toolbar-#{direction}]")
          refute_nil button, "toolbar has a #{direction} document button"
          assert button.key?("hidden"), "#{direction} button waits for the reader order"
          assert_equal 1, button.css(".fa-chevron-#{direction == 'previous' ? 'left' : 'right'}[aria-hidden='true']").size
          assert_match(/document/, button["aria-label"])
        end
        assert_equal 0, toolbar.css("[data-reader-complete]").size
        assert_equal 0, document.css(".post-header [data-reader-complete], [data-reader-pager] [data-reader-complete]").size
        sidebar = document.at_css(".document-reader__sidebar")
        assert_equal %w[details p], sidebar.element_children.map(&:name)
        current = sidebar.at_css(".document-reader__current")
        circle = current.at_css("button[data-reader-complete]")
        assert circle.key?("hidden")
        assert_equal "Reviewed: #{original.data['title']}", circle["aria-label"]
        assert_equal 1, circle.css(".fa-circle[aria-hidden='true']").size
        assert_equal original.data["title"], current.at_css("span").text
        assert_equal %w[a a], document.at_css("[data-reader-pager]").element_children.map(&:name)
        assert_equal 1, document.css("#code-form-blog").size
        assert_equal 3, document.css(".code-runner-container").size
        assert_equal %w[csp csse topics].sort, document.css("[data-reader-context] option").map { |option| option["value"] }.sort
        assert_includes html, 'CURRENT_LESSON_ID_BLOG = "/javascript/intro"'
        assert_includes html, 'contentUrl: CURRENT_LESSON_ID_BLOG.replace'
        assert_includes html, "#{base}/assets/js/projects/courses/reader/browser.js"
        assert document.css("[data-storage-key]").all? { |runner| runner["data-storage-key"].start_with?("_javascript_intro_") }
        assert_includes html, "Intro to JavaScript"
        refute_includes html, "DUPLICATED LESSON BODY"
        index = JSON.parse(File.read(File.join(site.dest, "assets/js/projects/courses/reader/data.json")))
        assert_equal ["/javascript/intro", "/reference/"],
          index["documents"].reject { |entry| entry["topics"] == false }.map { |entry| entry["url"] }
        placed = index["documents"].select { |entry| entry["topics"] == false }
        assert_equal({ "/csp/mcq" => { "csp" => { "week" => 1 } }, "/language-reference/" => { "csse" => { "week" => 1 } } },
          placed.to_h { |entry| [entry["url"], entry["courses"]] })
        language = Nokogiri::HTML(File.read(File.join(site.dest, "language-reference/index.html")))
        assert_equal ["csse"], language.css("[data-reader-context] option").map { |option| option["value"] } - ["topics"]
        assert_includes language.at_css("[data-reader-main] article").text, "Language body"
        csp_week = Nokogiri::HTML(File.read(File.join(site.dest, "csp/week-1/index.html")))
        assert_includes csp_week.css("a").map { |link| link["href"] }, "#{base}/csp/mcq?context=course&course=csp",
          "the week overview and reader navigation list the same page"
        assert_equal({ "csse" => { "week" => 1 }, "csp" => { "week" => 0 } }, index["documents"].first["courses"])
        topics = JSON.parse(File.read(File.join(site.dest, "assets/js/projects/topics/data.json")))
        assert_equal ["/javascript/intro", "/reference/"], topics.map { |entry| entry["url"] }
        assert_equal "/javascript/intro?context=topics", topics.first["viewUrl"]
        reference_html = Nokogiri::HTML(File.read(File.join(site.dest, "reference/index.html")))
        assert_equal 1, reference_html.css("[data-document-reader]").size
        assert_equal 1, reference_html.css("article").size
        assert_equal ["topics"], reference_html.css("[data-reader-context] option").map { |option| option["value"] }
        assert_includes reference_html.at_css("article").text, "Reference body"
        assert_equal reference, File.read(File.join(source, "reference.md"))
        %w[topics/view/javascript/intro/index.html topics/view/javascript/intro/csp/index.html javascript/intro/csp/index.html].each do |path|
          redirect = File.read(File.join(site.dest, path))
          assert_includes redirect, "#{base}/javascript/intro?context="
          assert_includes redirect, "location.replace(target.href)"
          assert_includes redirect, "target.hash = location.hash"
          refute_includes redirect, "code-runner-container"
          refute_includes redirect, "Submit Assignment"
          destination = Nokogiri::HTML(redirect).at_css("#reader-destination")["href"]
          redirect_script = Nokogiri::HTML(redirect).at_css("script").content
          _, error, result = Open3.capture3("node", "--input-type=module", "-e", <<~JS)
            import vm from 'node:vm';
            import assert from 'node:assert/strict';
            const link = { href: new URL(#{destination.to_json}, 'https://pages.invalid').href };
            let redirected;
            vm.runInNewContext(#{redirect_script.to_json}, {
              URL, URLSearchParams,
              document: { getElementById: () => link },
              location: {
                search: '?q=JavaScript&category=javascript&context=invalid&course=invalid',
                hash: '#code-example', replace: value => { redirected = new URL(value); }
              }
            });
            assert.equal(redirected.pathname, #{(base + "/javascript/intro").to_json});
            assert.equal(redirected.searchParams.get('context'), #{(path.start_with?("topics/") ? "topics" : "course").to_json});
            assert.equal(redirected.searchParams.get('q'), 'JavaScript');
            assert.equal(redirected.searchParams.get('category'), 'javascript');
            assert.equal(redirected.searchParams.get('course'), #{(path.start_with?("topics/") ? nil : "csp").to_json});
            assert.equal(redirected.hash, '#code-example');
          JS
          assert result.success?, error
        end
        assert_equal 1, site.posts.docs.count { |entry| entry.url == "/javascript/intro/csp/" }
        { "csp" => 0, "csse" => 1 }.each do |course, week|
          overview = File.read(File.join(site.dest, "#{course}/week-#{week}/index.html"))
          assert_includes overview, "#{base}/javascript/intro?context=course&amp;course=#{course}"
          shell = Nokogiri::HTML(overview).at_css("[data-document-reader]")
          refute_nil shell, "#{course} week #{week} overview uses the document reader shell"
          assert_equal "week", shell["data-overview"]
          assert_equal week.to_s, shell["data-overview-week"]
          assert_equal({ course => { "week" => week } }, JSON.parse(shell["data-membership"]))
          refute_nil shell.at_css('[data-reader-main] article[data-player-page="week"]')
          article = shell.at_css('[data-reader-main] article[data-player-page="week"]')
          assert_equal "Week #{week}: #{site.data.dig(course, "Sprint1", week, "theme")}", article.at_css("h2").text
          sprint_link = article.at_css(".lesson-body p a")
          refute_nil sprint_link
          assert_equal "#{base}/#{course}/sprint-1/", sprint_link["href"]
          assert_equal "Getting started", sprint_link.text
          refute_match(/Week #{week} of/, article.text)
          refute_match(/Sprint 1:/, article.text)
          refute_includes overview, 'class="lesson-player"'
        end
        script = document.css("script:not([src])").map(&:content).find { |text| text.include?("CURRENT_LESSON_ID_BLOG") }
        _, error, result = Open3.capture3("node", "--check", stdin_data: script)
        assert result.success?, error
        verification = <<~JS
          import vm from 'node:vm';
          import assert from 'node:assert/strict';
          import { readFileSync } from 'node:fs';
          const script = readFileSync(0, 'utf8');
          for (const search of ['?context=course&course=csp', '?context=course&course=csse', '?context=topics']) {
            const requests = [];
            const context = {
              location: { pathname: '/javascript/intro', search },
              URLSearchParams,
              console: { log() {}, warn() {}, error(message) { throw Error(message); } },
              javaURI: 'https://backend.invalid', fetchOptions: {},
              document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {} },
              fetch: async (url, options) => {
                requests.push({ url, options });
                return { ok: true, status: 200, json: async () => ({ id: 42, name: 'Intro to JavaScript' }) };
              },
            };
            context.window = context;
            vm.createContext(context);
            vm.runInContext(script, context);
            assert.equal(await context.ensureAssignmentIdBlog(), 42);
            assert.equal(requests.length, 1);
            assert.equal(requests[0].options.body.get('contentUrl'), 'javascript/intro');
            assert.equal(requests[0].options.body.get('name'), 'Intro to JavaScript');
            assert.equal(context.ASSIGNMENT_ID, 42);
          }
        JS
        _, error, result = Open3.capture3("node", "--input-type=module", "-e", verification, stdin_data: script)
        assert result.success?, "Submission identity across both course contexts and Topics: #{error}"
      end
    end
  end
end
