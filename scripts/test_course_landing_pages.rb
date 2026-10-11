require "jekyll"
require "tmpdir"
require "fileutils"
require "json"
require "open3"

ROOT = File.expand_path("..", __dir__)

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

Dir.mktmpdir("course-landing-") do |source|
  FileUtils.mkdir_p(File.join(source, "_layouts"))
  FileUtils.cp(File.join(ROOT, "_layouts/post.html"), File.join(source, "_layouts"))
  File.write(File.join(source, "_layouts/opencs.html"), "{{ content }}")
  FileUtils.mkdir_p(File.join(source, "_includes/player-pages"))
  %w[course-nav.html lesson-sidebar-nav.html lesson-topbar.html lesson-modals.html announcement_chat.html reading_time.html blog-catalog.html post_list_image_card.html].each do |name|
    FileUtils.cp(File.join(ROOT, "_includes", name), File.join(source, "_includes"))
  end
  %w[home.html sprint.html blogs.html].each do |name|
    FileUtils.cp(File.join(ROOT, "_includes/player-pages", name), File.join(source, "_includes/player-pages"))
  end
  FileUtils.mkdir_p(File.join(source, "_data"))
  %w[csse csp csa csh].each do |course|
    FileUtils.cp(File.join(ROOT, "_projects/systems/courses/navigation/#{course}.md"),
                 File.join(source, "#{course}.md"))
    File.write(File.join(source, "_data/#{course}.yml"), YAML.dump(
      "course" => { "code" => course.upcase },
      "Sprint1" => { "title" => "Onboarding", "start" => 1, "end" => 1,
                     1 => { "theme" => "Foundations" } }
    ))
    File.write(File.join(source, "#{course}-lesson.md"), YAML.dump(
      "layout" => "post", "title" => "Example lesson", "show_reading_time" => false,
      "permalink" => "/#{course}/example/", "courses" => { course => { "week" => 1 } }
    ) + "---\nExisting lesson\n")
    File.write(File.join(source, "#{course}-sprint.md"), YAML.dump(
      "layout" => "post", "title" => "Sprint 1", "course" => course,
      "permalink" => "/#{course}/sprint-1/",
      "player_page" => { "course" => course, "kind" => "sprint", "sprint" => 1 }
    ) + "---\n")
    File.write(File.join(source, "#{course}-blogs.md"), YAML.dump(
      "layout" => "post", "title" => "Blogs", "course" => course,
      "permalink" => "/#{course}/blogs/",
      "player_page" => { "course" => course, "kind" => "blogs" }
    ) + "---\n")
  end
  site = Jekyll::Site.new(Jekyll.configuration(
    "source" => source, "destination" => File.join(source, "_site"),
    "layouts_dir" => File.join(source, "_layouts"),
    "includes_dir" => File.join(source, "_includes"),
    "config" => [], "plugins" => [], "baseurl" => "/preview", "quiet" => true,
    "incremental" => false
  ))
  site.process

  %w[csse csp csa csh].each do |course|
    home = File.read(File.join(source, "_site/navigation/courses/#{course}/index.html"))
    assert(home.include?('class="lesson-player"'), "#{course} opens in the two-pane player; rendered: #{home[0, 500].inspect}")
    assert(home.include?('data-player-page="home"'), "#{course} opens on home, not Sprint 1")
    assert(home.scan('id="announcementChat"').size == 1, "#{course} has exactly one announcement chat")
    assert(home.include?("data-course=\"#{course}\"") && home.include?('data-hook="calendar"'),
           "#{course} retains its course-specific announcements and calendar")
    assert(!home.include?('class="timeline-container"'), "#{course} has no duplicate sprint timeline")
    assert(!home.include?('id="lesson-pager"'), "#{course} home has no lesson pager")
    title = site.pages.find { |p| p.name == "#{course}.md" }.data["title"]
    assert(home.include?("const PAGE_TITLE = #{JSON.generate(title)};"),
           "#{course} safely encodes quoted titles in player JavaScript")
    home.scan(%r{<script type="module">(.*?)</script>}m).each do |script|
      _, error, status = Open3.capture3("node", "--input-type=module", "--check", stdin_data: script.first)
      assert(status.success?, "#{course} rendered module parses: #{error}")
    end
    %W[navigation/courses/#{course}/index.html #{course}/sprint-1/index.html #{course}/example/index.html #{course}/blogs/index.html].each do |path|
      html = File.read(File.join(source, "_site", path))
      assert(html.scan('id="floating-menu-btn"').size == 1,
             "#{path} has exactly one mobile navigation button")
      assert(html.match?(%r{<div class="breadcrumbs">\s*<button class="mobile-course-menu"[^>]*aria-controls="timeline-modal"}),
             "#{path} places mobile course navigation at the upper left before breadcrumbs")
      breadcrumbs = html.split('class="breadcrumbs"', 2).last.split('</div>', 2).first
      assert(breadcrumbs.include?('id="lesson-sidebar-toggle"') &&
             breadcrumbs.index('id="lesson-sidebar-toggle"') < breadcrumbs.index('title="Course home"'),
             "#{path} places desktop navigation on the left before the home icon")
      assert(breadcrumbs.include?('aria-label="Close course navigation"') &&
             breadcrumbs.include?('class="fas fa-times"'),
             "#{path} gives desktop close navigation a labeled X")
      assert(html.match?(%r{<div class="timeline-modal-header">\s*<button[^>]*aria-label="Close course navigation"[^>]*>\s*<i class="fas fa-times"[^>]*></i>\s*</button>\s*<h3>}),
             "#{path} places the labeled mobile close X left of its heading")
      assert(html.match?(%r{<a class="ocs__btn[^"]*" href="/preview/#{course}/blogs/"[^>]*>\s*<i class="fas fa-blog"[^>]*></i> Blogs\s*</a>}),
             "#{path} keeps a labeled course Blogs button in the top bar")
      if path == "#{course}/blogs/index.html"
        assert(html.match?(%r{<a class="ocs__btn[^"]* fill" href="/preview/#{course}/blogs/" aria-current="page"}),
               "#{path} highlights the current Blogs page")
      end
      sidebar = html.split('id="lesson-sidebar"', 2).last.split('<script>', 2).first
      assert(sidebar.include?('aria-label="Courses"'), "#{path} has course pills in the sidebar")
      assert(sidebar.match?(%r{</a>\s*</nav>\s*<h2>}),
             "#{path} closes pill wrappers before the sidebar title")
      assert(sidebar.index('aria-label="Courses"') < sidebar.index('<h2>'),
             "#{path} places pills above the course title")
      %w[csse csp csa csh].each do |target|
        assert(sidebar.include?("href=\"/preview/navigation/courses/#{target}/\""),
               "#{path} links to #{target} respecting baseurl")
      end
      assert(sidebar.match?(%r{href="/preview/navigation/courses/#{course}/"[^>]*aria-current="page"}),
             "#{path} highlights the current course even without page.course")
      assert(sidebar.include?("href=\"/preview/#{course}/sprint-1/\""),
             "#{path} keeps the existing sprint route")
      assert(sidebar.include?('data-lesson-id="/' + course + '/example/"'),
             "#{path} preserves lesson completion identity")
      assert(html.include?('class="course-mobile-nav"'), "#{path} exposes course pills on mobile")
      assert(!sidebar.include?("href=\"/preview/#{course}/blogs/\""),
             "#{path} omits redundant sidebar Blogs")
      assert(html.match?(%r{<div class="sprint-nav">\s*<div class="sprint-section">}),
             "#{path} starts sidebar navigation directly with sprints")
      mobile = html.split('class="course-mobile-nav"', 2).last.split('id="timeline-modal-content"', 2).first
      assert(!mobile.include?('aria-label="Course home"') && !mobile.include?("/#{course}/blogs/"),
             "#{path} omits the duplicate mobile Home/Blogs row")
      assert(html.include?("href=\"/preview/navigation/courses/#{course}/\" title=\"Course home\" aria-label=\"Course home\""),
             "#{path} keeps an accessible breadcrumb home link")
    end
  end
end

puts "PASS: all four course landings, shared calendar/chat, sidebar pills, baseurl, existing lessons and mobile navigation"
