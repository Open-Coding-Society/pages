# Checks _plugins/lesson_player_pages.rb, which builds the lesson player's
# sprint, week, chat, and blogs pages from the course data in _data/.
#
#   bundle exec ruby scripts/test_player_pages.rb
require "jekyll"

ROOT = File.expand_path("..", __dir__)
require File.join(ROOT, "_plugins/lesson_player_pages")

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

# Runs the generator over made-up data files and lessons instead of the real
# ones, so the test does not change when a course does. Each lesson is the
# `courses:` front matter the sidebar reads.
def generate(data, lessons = [])
  site = Jekyll::Site.new(Jekyll.configuration("source" => ROOT, "plugins" => [], "quiet" => true))
  site.data = data
  lessons.each_with_index do |courses, i|
    lesson = Jekyll::PageWithoutAFile.new(site, site.source, "/lesson-#{i}/", "index.html")
    lesson.data["courses"] = courses
    site.pages << lesson
  end
  LessonPlayerPages::Generator.new.generate(site)
  site.pages.select { |page| page.data["player_page"] }
end

shared = { "Onboarding" => { "title" => "Setting Up Tools", "description" => "From the shared file." } }
course = {
  "course" => { "code" => "CSX" },
  "Sprint1" => { "shared" => "Onboarding", "start" => 0, "end" => 1, 0 => { "theme" => "Tools", "goals" => ["Setup"] } },
  "Sprint2" => { "title" => "Projects ", "start" => 2, "end" => 2 },
  "Sprint3" => { "start" => 3, "end" => 3 }
}
infographic = { "Sprint1" => { "title" => "Not a course", "start" => 0, "end" => 0 } }
lessons = [
  { "csx" => { "week" => 0 } },
  { "csx" => { "week" => 0 } },
  { "csx" => { "week" => "2" } },                        # the week as text, as some notebooks write it
  { "csx" => { "week" => 3 }, "csy" => { "week" => 3 } } # in two courses, so in neither sidebar
]

pages = generate({ "cs" => shared, "csx" => course, "infograph" => infographic }, lessons)
by_url = pages.to_h { |page| [page.url, page] }

expected = %w[
  /csx/sprint-1/ /csx/week-0/ /csx/week-0/chat/
  /csx/sprint-2/ /csx/week-2/ /csx/week-2/chat/
  /csx/sprint-3/ /csx/blogs/
]
assert(by_url.keys.sort == expected.sort,
       "Each sprint and the course's blogs get a page, and so does each week with lessons, the weeks " \
       "the sidebar lists, with its chat; data without a course block gets none; got #{by_url.keys.inspect}")

titles = by_url.transform_values { |page| page.data["title"] }
assert(titles["/csx/sprint-1/"] == "Sprint 1: Setting Up Tools", "A shared sprint takes its title from _data/cs.yml; got #{titles["/csx/sprint-1/"].inspect}")
assert(titles["/csx/sprint-2/"] == "Sprint 2: Projects", "Sprint titles are trimmed; got #{titles["/csx/sprint-2/"].inspect}")
assert(titles["/csx/sprint-3/"] == "Sprint 3", "A sprint without a title is just its number; got #{titles["/csx/sprint-3/"].inspect}")
assert(titles["/csx/week-0/"] == "Week 0: Tools", "A week with a theme names it; got #{titles["/csx/week-0/"].inspect}")
assert(titles["/csx/week-2/"] == "Week 2", "A week without a theme is just its number; got #{titles["/csx/week-2/"].inspect}")
assert(titles["/csx/week-0/chat/"] == "Week 0 Chat", "Chat pages are named for their week; got #{titles["/csx/week-0/chat/"].inspect}")
assert(titles["/csx/blogs/"] == "Blogs", "The blogs page is called Blogs; got #{titles["/csx/blogs/"].inspect}")

expected_player_pages = {
  "/csx/sprint-1/" => { "course" => "csx", "kind" => "sprint", "sprint" => 1, "week" => nil },
  "/csx/week-0/" => { "course" => "csx", "kind" => "week", "sprint" => 1, "week" => 0 },
  "/csx/week-2/chat/" => { "course" => "csx", "kind" => "chat", "sprint" => 2, "week" => 2 },
  "/csx/blogs/" => { "course" => "csx", "kind" => "blogs", "sprint" => nil, "week" => nil }
}
expected_player_pages.each do |url, player_page|
  assert(by_url[url].data["player_page"] == player_page,
         "#{url} tells the layout its course, kind, sprint, and week; got #{by_url[url].data["player_page"].inspect}")
end

pages.each do |page|
  assert(page.data["layout"] == "post", "#{page.url} is drawn by the lesson player in _layouts/post.html")
  assert(page.data["show_reading_time"] == false, "#{page.url} has no reading time")
  assert(page.data["search_exclude"] == true, "#{page.url} stays out of site search")
end

broken = { "course" => { "code" => "CSY" }, "Sprint3" => { "title" => "No weeks" } }
error = begin
  generate("csy" => broken)
  nil
rescue StandardError => e
  e
end
assert(error&.message&.include?("_data/csy.yml") && error.message.include?("Sprint3"),
       "A sprint without start and end weeks fails the build and names the file and sprint; got #{error.inspect}")

puts "PASS: sprint and blogs pages, week and chat pages for weeks with lessons, their titles and front matter, and the missing-weeks error"
