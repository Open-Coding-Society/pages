require "minitest/autorun"
require "jekyll"
require "tmpdir"
require "fileutils"
require_relative "../../../../scripts/publish_project"
require_relative "../plugins/topics"

class TopicsTest < Minitest::Test
  ROOT = File.expand_path("../../../..", __dir__)
  PROJECT = File.expand_path("..", __dir__)

  def test_topic_urls_are_servable_for_all_permalink_forms
    assert_equal "/topics/view/example/", Topics.view_url("/example")
    assert_equal "/topics/view/example/", Topics.view_url("/example/")
    assert_equal "/topics/view/example.html", Topics.view_url("/example.html")
  end

  def test_topic_pages_and_original_course_documents_have_separate_contexts
    Dir.mktmpdir("topics-") do |source|
      ProjectPublisher.run("publish", PROJECT, source)
      ProjectPublisher.run("publish", File.join(ROOT, "_projects/systems/blogs"), source)
      File.write(File.join(source, "_layouts/opencs.html"), "<main>{{ content }}</main>")
      File.write(File.join(source, "_includes/course-document-player.html"), '<div id="course-player">{{ content }}</div>')
      FileUtils.cp(File.join(ROOT, "_includes/reading_time.html"), File.join(source, "_includes"))
      File.write(File.join(source, "lesson.md"), <<~DOC)
        ---
        layout: post
        title: Java Algorithms
        categories: [Java, Algorithms]
        permalink: /java/algorithms/
        courses: {csa: {week: 14}}
        assignment: true
        assignment_submission_type: code
        show_reading_time: false
        chat: true
        ---
        ## Algorithm heading
        Algorithm evidence.
        {% include_relative evidence.md %}
        <div class="code-runner-container">Interactive runner</div>
      DOC
      File.write(File.join(source, "evidence.md"), "**Relative evidence**")
      File.write(File.join(source, "outline.md"), <<~DOC)
        ---
        layout: opencs
        title: CS112 Outline
        categories: [Java, CS112]
        permalink: /csa/cs112/
        ---
        <a href="/preview/java/algorithms/">Supporting lesson</a>
      DOC
      File.write(File.join(source, "converted.md"), <<~DOC)
        ---
        layout: opencs
        title: Converted Quest
        categories: [Java]
        permalink: /converted-quest/
        ---
        <!-- Converted from: Quest-Outline.docx -->
        Quest outline.
      DOC
      File.write(File.join(source, "course-browser.md"), <<~DOC)
        ---
        layout: opencs
        permalink: /course-browser/
        ---
        {% include topics-browser.html course_context=true %}
      DOC
      reference_includes = File.join(source, "_includes/projects/lessons")
      FileUtils.mkdir_p(reference_includes)
      FileUtils.cp(File.join(ROOT, "_projects/lessons/_includes/language-reference.html"), reference_includes)
      FileUtils.cp(File.join(ROOT, "_projects/lessons/javascript/index.md"), File.join(source, "javascript-reference.md"))
      %w[hidden draft excluded].each do |kind|
        flag = { "hidden" => "hide: true", "draft" => "lesson_status: draft", "excluded" => "search_exclude: true" }.fetch(kind)
        File.write(File.join(source, "#{kind}.md"), "---\nlayout: post\ncategories: [Java]\n#{flag}\n---\nExcluded\n")
      end
      site = Jekyll::Site.new(Jekyll.configuration(
        "source" => source, "destination" => File.join(source, "_site"),
        "layouts_dir" => File.join(source, "_layouts"), "includes_dir" => File.join(source, "_includes"),
        "config" => [], "plugins_dir" => [], "quiet" => true, "incremental" => false,
        "baseurl" => "/preview", "disqus" => {}
      ))
      site.process
      index = JSON.parse(File.read(File.join(source, "_site/assets/js/topics/data.json")))
      assert_equal 3, index.size
      lesson = index.find { |entry| entry["url"] == "/java/algorithms/" }
      assert_equal %w[java algorithms], lesson["categories"]
      assert_equal %w[Java Algorithms], lesson["labels"]
      assert_equal "lesson.md", lesson["path"]
      refute lesson.key?("source")
      converted = index.find { |entry| entry["url"] == "/converted-quest/" }
      assert_equal "Quest-Outline.docx", converted["source"]
      assert_equal ["CSA week 14"], lesson["weeks"]
      assert_includes lesson["content"], "Algorithm evidence."
      original = File.read(File.join(source, "_site/java/algorithms/index.html"))
      assert_includes original, 'id="course-player"'
      topic = File.read(File.join(source, "_site/topics/view/java/algorithms/index.html"))
      refute_includes topic, 'id="course-player"'
      assert_includes topic, "Interactive runner"
      assert_includes topic, "<strong>Relative evidence</strong>"
      assert_includes topic, 'id="algorithm-heading"'
      assert_includes topic, "CURRENT_LESSON_ID_BLOG = \"/java/algorithms/\""
      assert_includes topic, "/preview/topics/?category=java"
      assert_includes topic, "/preview/assets/js/topics/document.js"
      outline = File.read(File.join(source, "_site/topics/view/csa/cs112/index.html"))
      assert_includes outline, "Topics document navigation"
      browser = File.read(File.join(source, "_site/topics/index.html"))
      assert_includes browser, "Java Algorithms"
      assert_includes browser, "/preview/topics/view/java/algorithms/"
      assert_includes browser, '<h2>Topics</h2>'
      assert_includes browser, '<summary><h3>Topic Filter</h3></summary>'
      assert_includes browser, '<summary><h3>Categories Filter</h3></summary>'
      primary = browser.split('<legend class="topics-browser__accessible-label">Topic Filter</legend>', 2).last.split('</fieldset>', 2).first
      secondary = browser.split('<legend class="topics-browser__accessible-label">Categories Filter</legend>', 2).last.split('</fieldset>', 2).first
      assert_match(/<details[^>]*data-topics-primary[^>]*\bopen\b/, browser)
      assert_match(/<details[^>]*data-topics-secondary/, browser)
      refute_match(/<details[^>]*data-topics-secondary[^>]*\bopen\b/, browser)
      match = browser.split('data-topics-match', 2).last.split('</p>', 2).first
      assert_match(/<button[^>]*class="ocs__btn small accent fill"[^>]*value="or"[^>]*aria-pressed="true"[^>]*disabled/, match)
      assert_match(/<button[^>]*class="ocs__btn small accent"[^>]*value="and"[^>]*aria-pressed="false"[^>]*disabled/, match)
      assert_operator browser.index('data-topics-primary'), :<, browser.index('data-topics-match')
      assert_operator browser.index('data-topics-match'), :<, browser.index('<legend class="topics-browser__accessible-label">Topic Filter</legend>')
      refute_includes primary, 'data-topics-match'
      refute_includes browser, "Explore reference material by category."
      assert_includes browser, '<label class="topics-browser__accessible-label" for="topics-query">Search</label>'
      assert_includes browser, '<select class="ocs__input" id="topics-view">'
      filter_box = browser.split('id="topics-filters"', 2).last.split('</div>', 2).first
      assert_includes filter_box, 'data-topics-clear'
      assert_match(/<button[^>]*data-topics-clear[^>]*\bdisabled\b/, filter_box)
      assert_includes browser, '<label for="topics-view">View</label>'
      assert_operator browser.index('id="topics-query"'), :<, browser.index('id="topics-view"')
      assert_operator browser.index('data-topics-clear'), :<, browser.index('data-topics-results')
      assert_includes browser, 'aria-controls="topics-filters"'
      assert_includes browser, 'data-topics-search-clear'
      assert_includes browser, 'data-topics-title-count'
      assert_includes browser, 'data-topics-body-count'
      %w[sass python java javascript flask spring cs111 cs112 cs113].each do |category|
        assert_includes primary, "value=\"#{category}\""
        refute_includes secondary, "value=\"#{category}\""
      end
      assert_includes secondary, 'value="algorithms"'
      assert_includes browser, 'data-topics-body-results'
      refute_includes browser, "js-search-results"
      refute_includes browser, "CSA week 14"
      course_browser = File.read(File.join(source, "_site/course-browser/index.html"))
      assert_includes course_browser, "CSA week 14"
      assert_includes course_browser, 'href="/preview/java/algorithms/"'
      reference = File.read(File.join(source, "_site/navigation/js-reference/index.html"))
      assert_includes reference, 'id="course-player"'
      assert_includes reference, 'data-course-context="true"'
      assert_includes reference, 'data-initial-category="javascript"'
      assert_includes reference, 'data-topics-match'
      assert_includes reference, 'href="/preview/java/algorithms/"'
      refute_includes reference, 'href="/preview/topics/view/java/algorithms/"'
    end

  end

  def test_primary_category_configuration_rejects_duplicates
    Dir.mktmpdir("topics-invalid-") do |source|
      FileUtils.mkdir_p(File.join(source, "_data"))
      File.write(File.join(source, "_data/topics_primary.yml"), "- Java\n- java\n")
      site = Jekyll::Site.new(Jekyll.configuration("source" => source, "config" => [], "quiet" => true))
      site.read
      assert_raises(Jekyll::Errors::FatalException) { Topics::Generator.new.generate(site) }
    end
  end
end
