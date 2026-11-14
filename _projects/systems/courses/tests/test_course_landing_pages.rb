require "jekyll"
require "tmpdir"
require "fileutils"
require "json"
require "open3"
require "nokogiri"

ROOT = File.expand_path("../../../..", __dir__)
PROJECT = File.expand_path("..", __dir__)
BLOGS = File.expand_path("../../blogs", __dir__)

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

Dir.mktmpdir("course-landing-") do |source|
  FileUtils.mkdir_p(File.join(source, "_layouts"))
  FileUtils.cp(File.join(BLOGS, "layouts/post.html"), File.join(source, "_layouts"))
  File.write(File.join(source, "_layouts/opencs.html"), '{% include themes/minima/header.html %}{{ content }}')
  FileUtils.mkdir_p(File.join(source, "_includes/themes/minima"))
  FileUtils.cp(File.join(ROOT, "_includes/themes/minima/header.html"),
               File.join(source, "_includes/themes/minima/header.html"))
  FileUtils.mkdir_p(File.join(source, "_includes/player-pages"))
  %w[course-document-player.html course-nav.html course-title.html lesson-sidebar-nav.html lesson-topbar.html lesson-modals.html announcement_chat.html].each do |name|
    FileUtils.cp(File.join(PROJECT, "_includes", name), File.join(source, "_includes"))
  end
  %w[blog-catalog.html post_list_image_card.html blog-reader.html].each do |name|
    FileUtils.cp(File.join(BLOGS, "_includes", name), File.join(source, "_includes"))
  end
  FileUtils.cp(File.join(ROOT, "_includes/reading_time.html"), File.join(source, "_includes"))
  %w[home.html sprint.html week.html blogs.html].each do |name|
    FileUtils.cp(File.join(PROJECT, "_includes/player-pages", name), File.join(source, "_includes/player-pages"))
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
    File.write(File.join(source, "#{course}-week.md"), YAML.dump(
      "layout" => "post", "title" => "Week 1", "course" => course,
      "permalink" => "/#{course}/week-1/",
      "player_page" => { "course" => course, "kind" => "week", "sprint" => 1, "week" => 1 }
    ) + "---\n")
  end
  # Posts for the Blogs pages: one per class, a lesson shared by all four with
  # the one-class copies split_multi_course_files.py makes, and a pinned
  # site-wide capstone that names no class.
  FileUtils.mkdir_p(File.join(source, "_posts"))
  blog_post = lambda do |file, fields|
    File.write(File.join(source, "_posts", file), YAML.dump({ "layout" => nil }.merge(fields)) + "---\nPost body\n")
  end
  %w[csse csp csa csh].each do |course|
    blog_post.call("2026-10-01-only-#{course}.md", "title" => "Only #{course.upcase}",
                   "permalink" => "/only-#{course}/", "courses" => { course => { "week" => 9 } })
    blog_post.call("2026-10-02-shared-#{course}.md", "title" => "Shared lesson",
                   "permalink" => "/shared/#{course}/", "reader_redirect_url" => "/shared/")
  end
  blog_post.call("2026-10-02-shared.md", "title" => "Shared lesson", "permalink" => "/shared/",
                 "courses" => %w[csse csp csa csh].to_h { |course| [course, { "week" => 9 }] })
  blog_post.call("2026-10-03-capstone.md", "title" => "Site capstone", "permalink" => "/capstone/",
                 "sticky_rank" => 1)
  File.write(File.join(source, "assignment.md"), YAML.dump(
    "layout" => nil, "title" => "A descriptive assignment title", "permalink" => "/assignment/",
    "assignment" => true, "courses" => %w[csse csp csa csh].to_h { |course| [course, { "week" => 1 }] }
  ) + "---\nAssignment\n")
  site = Jekyll::Site.new(Jekyll.configuration(
    "source" => source, "destination" => File.join(source, "_site"),
    "layouts_dir" => File.join(source, "_layouts"),
    "includes_dir" => File.join(source, "_includes"),
    "config" => [], "plugins" => [], "baseurl" => "/preview", "quiet" => true,
    "incremental" => false, "default_course" => "csse",
    "minima" => { "nav_pages" => ["navigation/course.md"] }
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
    assert(home.scan('data-course-entry ').size == 1 &&
           home.include?('data-default-course="csse" href="/preview/navigation/courses/csse/"'),
           "#{course} has one direct course entry respecting baseurl")
    assert(home.include?('rememberCourse(COURSE);'), "#{course} remembers the selected course")
    title = site.pages.find { |p| p.name == "#{course}.md" }.data["title"]
    assert(home.include?("const PAGE_TITLE = #{JSON.generate(title)};"),
           "#{course} safely encodes quoted titles in player JavaScript")
    home.scan(%r{<script type="module">(.*?)</script>}m).each do |script|
      _, error, status = Open3.capture3("node", "--input-type=module", "--check", stdin_data: script.first)
      assert(status.success?, "#{course} rendered module parses: #{error}")
    end
    %W[navigation/courses/#{course}/index.html #{course}/sprint-1/index.html #{course}/week-1/index.html #{course}/example/index.html #{course}/blogs/index.html].each do |path|
      html = File.read(File.join(source, "_site", path))
      completion_button = html[%r{<button id="topbar-complete-btn".*?</button>}m]
      assert(!completion_button.nil? == (path == "#{course}/example/index.html"),
             "#{path} keeps reading completion on lessons only")
      if completion_button
        assert(completion_button.include?('aria-label="Mark lesson complete"') &&
               completion_button.include?('aria-pressed="false"') &&
               completion_button.match?(%r{>\s*<i class="fas fa-circle" id="complete-icon-topbar" aria-hidden="true"></i>\s*</button>}),
               "#{path} keeps the completion circle icon-only and accessible")
      end
      sequence_page = %W[#{course}/sprint-1/index.html #{course}/week-1/index.html #{course}/example/index.html].include?(path)
      %w[prev next].each do |direction|
        name = direction == "prev" ? "Previous" : "Next"
        icon = direction == "prev" ? "left" : "right"
        arrow = html[%r{<button[^>]*onclick="#{direction}Lesson\(\)"[^>]*>.*?</button>}m]
        assert(!arrow.nil? == sequence_page, "#{path} shows #{name} only for sequence pages")
        if arrow
          assert(arrow.include?("aria-label=\"#{name} lesson\"") &&
                 arrow.match?(%r{>\s*<i class="fas fa-chevron-#{icon}" aria-hidden="true"></i>\s*</button>}),
                 "#{path} has an icon-only accessible #{name} arrow")
        end
      end
      assert(html.scan('id="floating-menu-btn"').size == 1,
             "#{path} has exactly one mobile navigation button")
      assert(html.match?(%r{<div class="breadcrumbs">\s*<a[^>]*aria-label="Course home"}),
             "#{path} starts the breadcrumb with course Home")
      breadcrumbs = html.split('class="breadcrumbs"', 2).last.split('</div>', 2).first
      if path == "navigation/courses/#{course}/index.html"
        assert(breadcrumbs.include?(" selected>#{course.upcase}</option>") &&
               !breadcrumbs.include?(title),
               "#{path} uses the short course dropdown name without a duplicate title crumb")
      end
      assert(breadcrumbs.include?('id="lesson-sidebar-toggle"') &&
             breadcrumbs.index('id="lesson-sidebar-toggle"') > breadcrumbs.index('course-breadcrumb-select'),
             "#{path} keeps navigation controls after Home and Course")
      assert(breadcrumbs.include?('aria-label="Open course navigation"') &&
             !breadcrumbs.include?('fa-times'),
             "#{path} keeps only hamburger open controls beside Home")
      assert(html.match?(%r{<a class="ocs__btn[^"]*" href="/preview/#{course}/blogs/"[^>]*aria-label="Course blogs"[^>]*>\s*<i class="fas fa-blog" aria-hidden="true"></i>\s*</a>}),
             "#{path} keeps an icon-only accessible Blogs shortcut")
      topbar = html.split('class="topbar-lesson"', 2).last.split('class="lesson-content"', 2).first
      assert(!topbar.include?('fa-comments'),
             "#{path} omits the extra topbar chat shortcut")
      if path == "#{course}/blogs/index.html"
        listed = html.scan(/class="post-link" href="([^"]+)"/).flatten
        assert(listed == ["/preview/shared/?context=course&amp;course=#{course}", "/preview/only-#{course}/?context=course&amp;course=#{course}"],
               "#{path} lists only #{course}'s own posts, newest first; got #{listed.inspect}")
        assert(html.include?("#{course.upcase} posts: pinned posts first, then the newest."),
               "#{path} says whose posts it lists")
        assert(html.include?(%(like capstones, are on the <a href="/preview/navigation/blogs/">site's Blogs page</a>)),
               "#{path} links to the posts that are not for one class")
        assert(html.include?('<p class="ocs__split" role="search" aria-label="Search Blogs" data-post-search>') &&
               html.scan("<li data-post-search-card").size == 2,
               "#{path} has the search bar over its own posts")
        html.scan(%r{<script type="module">(.*?)</script>}m).each do |script|
          _, error, status = Open3.capture3("node", "--input-type=module", "--check", stdin_data: script.first)
          assert(status.success?, "#{path} module parses: #{error}")
        end
        assert(breadcrumbs.match?(%r{title="Course home".*course-breadcrumb-select.*class="current">Blogs</span>}m),
               "#{path} shows Home, selected course, and Blogs in breadcrumb order")
        assert(html.match?(%r{<a class="ocs__btn[^"]* fill" href="/preview/#{course}/blogs/" aria-current="page"}),
               "#{path} highlights the current Blogs page")
      end
      sidebar = html.split('id="lesson-sidebar"', 2).last.split('<script>', 2).first
      parsed = Nokogiri::HTML(html)
      player = parsed.at_css('.lesson-player')
      assert(player.at_css('.topbar-lesson').parent == player &&
             player.at_css('#lesson-sidebar').parent == player.at_css('.lesson-player__panes') &&
             player.at_css('.lesson-main').parent == player.at_css('.lesson-player__panes'),
             "#{path} places the toolbar above both panes")
      assert(parsed.css('.lesson-main .lesson-header').empty? == (path == "navigation/courses/#{course}/index.html"),
             "#{path} suppresses only the duplicate course home body title")
      dropdowns = parsed.css('.breadcrumbs select[aria-label="Course"]')
      assert(dropdowns.size == 1, "#{path} has one breadcrumb course dropdown")
      dropdown = dropdowns.first
      assert(dropdown["onchange"] == "window.location.assign(this.value)",
             "#{path} navigates to the selected course home")
      assert(dropdown.css('option[selected]').map(&:text) == [course.upcase],
             "#{path} selects the current course without relying on page.course")
      assert(!sidebar.include?('course-pill-nav'), "#{path} removes sidebar course pills")
      %w[csse csp csa csh].each do |target|
        assert(dropdown.css('option').any? { |option| option["value"] == "/preview/navigation/courses/#{target}/" },
               "#{path} switches to #{target} respecting baseurl")
      end
      assert(sidebar.include?("href=\"/preview/#{course}/sprint-1/\""),
             "#{path} keeps the existing sprint route")
      assert(!html.include?("/#{course}/week-1/chat/"),
             "#{path} has no week chat link; messaging is on the Messages page")
      assert(sidebar.include?('data-lesson-id="/' + course + '/example/"'),
             "#{path} preserves lesson completion identity")
      week = sidebar[%r{<details data-week-group data-week="1".*?</details>}m].to_s
      assert(sidebar.scan('<details data-week-group data-week="1"').size == 1 && week.match?(%r{<summary class="sprint-toggle" title="W1: Foundations">\s*<span class="ocs__status-pill ocs__status-pill--good">W1</span>\s*<span class="lesson-title ocs__truncate"><strong>Foundations</strong></span>\s*<span class="ocs__status-pill ocs__status-pill--neutral" data-week-count}),
             "#{path} shows a week as one row: W pill, then the title cut with an ellipsis, then the count")
      assert(week.match?(%r{</summary>\s*<div class="ocs__tree">\s*<a href="/preview/#{course}/week-1/"}),
             "#{path} puts the week's intro first in the week's tree, even with its lessons")
      nav = parsed.at_css('#lesson-sidebar')
      assert(nav.at_css("a[href='/preview/#{course}/sprint-1/'] .fa-flag"),
             "#{path} identifies the sprint intro with a flag")
      reference = nav.at_css("a[data-lesson-id='/#{course}/example/']")
      assignment = nav.at_css("a[data-lesson-id='/assignment/']")
      assert(reference.at_css('.fa-file-code') && assignment.at_css('.fa-file-alt'),
             "#{path} distinguishes reference and assignment icons")
      [reference, assignment].each do |lesson|
        title = lesson.at_css('.lesson-title')
        assert(!title['class'].include?('ocs__truncate') && lesson.element_children.last['class'].include?('lesson-status-icon'),
               "#{path} wraps lesson titles and places the smaller completion icon after them")
      end
      assert(html.include?('course-mobile-nav"'), "#{path} keeps mobile navigation")
      assert(!sidebar.include?("href=\"/preview/#{course}/blogs/\""),
             "#{path} omits redundant sidebar Blogs")
      assert(html.match?(%r{<div class="sprint-nav">\s*<div class="sprint-section">}),
             "#{path} starts sidebar navigation directly with sprints")
      mobile = html.split('class="course-panel-actions course-mobile-nav"', 2).last.split('id="timeline-modal-content"', 2).first
      assert(!mobile.include?('course-pill-nav') &&
             mobile.match?(%r{<button[^>]*id="timeline-close-btn"[^>]*>\s*<i class="fas fa-times"[^>]*></i>\s*</button>\s*</div>\s*<h3>}),
             "#{path} keeps mobile close and removes duplicate course pills")
      sidebar_title = sidebar[%r{<h2>(.*?)</h2>}m, 1]
      assert(mobile.include?("<h3>#{sidebar_title}</h3>") && !mobile.include?("Course Timeline"),
             "#{path} shows the same selected course title below both button rows")
      assert(!mobile.include?('aria-label="Course home"') && !mobile.include?("/#{course}/blogs/"),
             "#{path} omits the duplicate mobile Home/Blogs row")
      assert(html.include?("href=\"/preview/navigation/courses/#{course}/\" title=\"Course home\" aria-label=\"Course home\""),
             "#{path} keeps an accessible breadcrumb home link")
    end
  end
end

puts "PASS: all four course landings, shared calendar/chat, breadcrumb course dropdown, baseurl, existing lessons, mobile navigation and class-only Blogs with search"
