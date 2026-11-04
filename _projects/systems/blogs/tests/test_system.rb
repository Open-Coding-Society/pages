require "minitest/autorun"
require "jekyll"
require "tmpdir"
require "fileutils"
require "json"
require "open3"
require_relative "../../../../scripts/publish_project"

class BlogsSystemTest < Minitest::Test
  BLOGS = File.expand_path("..", __dir__)
  COURSES = File.expand_path("../../courses", __dir__)
  ROOT = File.expand_path("../../../..", __dir__)

  def test_blogs_and_courses_have_disjoint_outputs
    blog_outputs = ProjectPublisher.files(BLOGS, ROOT).map(&:last)
    course_outputs = ProjectPublisher.files(COURSES, ROOT).map(&:last)
    assert_empty blog_outputs & course_outputs
    assert_includes blog_outputs, File.join(ROOT, "_layouts/post.html")
    refute_includes course_outputs, File.join(ROOT, "_layouts/post.html")
    assert_includes course_outputs, File.join(ROOT, "_includes/course-document-player.html")
    assert_includes File.read(File.join(ROOT, "_projects/.makeprojects")), "systems/blogs:dev"
  end

  def test_publication_handoff_and_course_clean_preserve_blogs
    Dir.mktmpdir("blogs-handoff-") do |workspace|
      old_courses = File.join(workspace, "_projects/systems/courses")
      FileUtils.mkdir_p(old_courses)
      FileUtils.cp(File.join(BLOGS, "layouts/post.html"), File.join(old_courses, "post.html"))
      File.write(File.join(old_courses, "distribution.json"), JSON.generate(
        "files" => [{ "source" => "post.html", "destination" => "_layouts/post.html" }]
      ))
      ProjectPublisher.run("publish", old_courses, workspace)
      assert_raises(RuntimeError) { ProjectPublisher.run("publish", BLOGS, workspace) }
      ProjectPublisher.run("publish", COURSES, workspace)
      ProjectPublisher.run("publish", BLOGS, workspace)
      ProjectPublisher.run("clean", COURSES, workspace)
      assert_equal File.read(File.join(BLOGS, "layouts/post.html")),
                   File.read(File.join(workspace, "_layouts/post.html"))
      refute File.exist?(File.join(workspace, "_includes/course-document-player.html"))
      ProjectPublisher.run("clean", BLOGS, workspace)
      refute File.exist?(File.join(workspace, "_layouts/post.html"))
      assert File.file?(File.join(BLOGS, "layouts/post.html"))
    end
  end

  def test_standalone_document_and_reader_render_without_courses
    Dir.mktmpdir("blogs-render-") do |source|
      ProjectPublisher.run("publish", BLOGS, source)
      File.write(File.join(source, "_layouts/opencs.html"), "<main>{{ content }}</main>")
      %w[reading_time.html].each do |name|
        FileUtils.cp(File.join(ROOT, "_includes", name), File.join(source, "_includes"))
      end
      File.write(File.join(source, "document.md"), <<~DOC)
        ---
        layout: post
        title: Standalone document
        permalink: /standalone/
        show_reading_time: false
        assignment: true
        assignment_submission_type: code
        ---
        Document evidence.
        <div class="code-runner-container">Runner fixture</div>
      DOC
      File.write(File.join(source, "reader.md"), <<~DOC)
        ---
        layout: blog-reader
        title: Standalone reader
        permalink: /reader/
        ---
      DOC
      FileUtils.mkdir_p(File.join(source, "_posts"))
      File.write(File.join(source, "_posts/2026-10-10-example.md"), <<~DOC)
        ---
        layout: post
        title: Catalog example
        show_reading_time: false
        ---
        Example content.
      DOC
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"),
        "layouts_dir" => File.join(source, "_layouts"),
        "includes_dir" => File.join(source, "_includes"),
        "config" => [], "plugins_dir" => [], "quiet" => true,
        "baseurl" => "/preview", "incremental" => false, "disqus" => {}
      ))
      site.process
      html = File.read(File.join(source, "_site/standalone/index.html"))
      assert_includes html, "Document evidence."
      assert_includes html, "Runner fixture"
      assert_includes html, "SUBMISSION_TYPE_BLOG = \"code\""
      refute_includes html, 'id="lesson-sidebar"'
      refute File.exist?(File.join(source, "_includes/course-document-player.html"))
      reader = File.read(File.join(source, "_site/reader/index.html"))
      assert_includes reader, "Catalog example"
      assert_includes reader, "Posts from across the site: pinned posts first, then the newest."
      refute_includes reader, "data-post-search"
      assert_includes reader, 'data-blog-reader hidden'
      assert_includes reader, "/preview/2026/10/10/example.html"
      assert_includes reader, "document.scrollingElement"
      assert_includes reader, "history.pushState"
      [html, reader].each do |rendered|
        rendered.scan(%r{<script type="module">(.*?)</script>}m).each do |script|
          _, error, status = Open3.capture3("node", "--input-type=module", "--check", stdin_data: script.first)
          assert status.success?, "Standalone module does not parse: #{error}"
        end
      end
    end
  end
end
