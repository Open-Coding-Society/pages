require "jekyll"

ROOT = File.expand_path("../../../..", __dir__)
PROJECT = File.expand_path("..", __dir__)

# Renders {% include name.html key=value %} from _includes/, as Jekyll does: the
# layout includes blog-catalog.html, which includes post_list_image_card.html.
# A value is a quoted string, true, false, or a variable, the forms used here.
class CatalogInclude < Liquid::Tag
  def initialize(tag_name, markup, tokens)
    super
    @file, *pairs = markup.strip.split(/\s+/)
    @params = pairs.map { |pair| pair.split("=", 2) }
  end

  def render(context)
    params = @params.to_h do |key, value|
      [key, case value
            when /\A["'](.*)["']\z/ then Regexp.last_match(1)
            when "true" then true
            when "false" then false
            else context[value]
            end]
    end
    context.stack do
      context["include"] = params
      Liquid::Template.parse(File.read(File.join(PROJECT, "_includes", @file))).render!(context)
    end
  end
end

Liquid::Template.register_tag("include", CatalogInclude)
Liquid::Template.register_filter(Jekyll::Filters)

site = Jekyll::Site.new(Jekyll.configuration(
  "source" => ROOT,
  "baseurl" => "/preview",
  "plugins" => [],
  "quiet" => true
))
layout = File.read(File.join(PROJECT, "layouts/blogs.html")).sub(/\A---\n.*?\n---\n/m, "")
template = Liquid::Template.parse(layout)

def post(id, date, fields = {})
  {
    "id" => id,
    "url" => "/#{id}/",
    "title" => id,
    "description" => "Description for #{id}",
    "date" => Time.parse(date)
  }.merge(fields)
end

posts = [
  post("older-doc", "2026-02-16", "game_docs" => true),
  post("newer-doc", "2026-02-17", "game_docs" => true),
  post("sticky-doc", "2026-02-15", "game_docs" => true, "sticky_rank" => 1),
  post("hidden-doc", "2026-02-18", "game_docs" => true, "hide" => true),
  post("unrelated", "2026-02-19"),
  post("false-flag", "2026-02-20", "game_docs" => false),
  post("string-flag", "2026-02-21", "game_docs" => "true"),
  post("course-a", "2026-02-14", "game_docs" => true, "canonical_id" => "shared"),
  post("course-b", "2026-02-13", "game_docs" => true, "canonical_id" => "shared"),
  post("lesson_content", "2026-02-12", "game_docs" => true)
]

render = lambda do |page, entries|
  template.render!(
    { "site" => { "posts" => entries }, "page" => page, "content" => "Catalog introduction" },
    registers: { site: site }
  )
end

def assert(condition, message)
  abort("FAIL: #{message}") unless condition
end

filtered = render.call({ "post_filter" => "game_docs" }, posts)
links = filtered.scan(/class="post-link" href="([^"]+)"/).flatten
assert(links == %w[/preview/sticky-doc/ /preview/newer-doc/ /preview/older-doc/ /preview/course-a/],
       "Catalog must filter boolean flags, honor hide, deduplicate, preserve ordering and baseurl; got #{links.inspect}")
assert(filtered.include?("Description for newer-doc"), "Cards must include descriptions")
assert(filtered.include?("Feb 17, 2026"), "Cards must include formatted dates")
assert(filtered.include?("Catalog introduction"), "Catalog must retain its page content")

unfiltered = render.call({}, posts)
assert(unfiltered.include?('/preview/unrelated/'), "Ordinary blogs must remain unfiltered")
assert(!unfiltered.include?('/preview/hidden-doc/'), "Ordinary blogs must still exclude hidden posts")
assert(unfiltered.scan('class="post-link"').size == 7, "Ordinary blogs must retain distinct posts")

empty = render.call({ "post_filter" => "game_docs" }, [post("unrelated", "2026-02-19")])
assert(empty.include?("No documentation is available yet."), "Empty filtered catalog must explain its state")
assert(!empty.include?('class="post-link"'), "Empty filtered catalog must not show unrelated posts")

# post_search: true adds a search bar over the same cards, built from OCS components.
assert(!filtered.include?("post-search") && !unfiltered.include?("post-search"),
       "Catalogs without post_search must not change")
assert(filtered.scan("<li>").size == 4, "Cards without post_search must stay plain list items")

search_page = { "post_filter" => "game_docs", "post_search" => true, "title" => "GameBuilder Docs" }
quoted = post("quoted-doc", "2026-02-10", "game_docs" => true,
              "title" => %(Say "hi"), "description" => "<em>Sprites</em> & sounds")
searchable = render.call(search_page, posts + [quoted])
bar = searchable[%r{<p [^>]*data-post-search>.*?</p>}m]
assert(bar, "post_search must draw a search bar")
assert(bar.include?('<p class="ocs__split" role="search" aria-label="Search GameBuilder Docs"'),
       "The bar must be an OCS split and a labelled search landmark")
assert(bar.include?('<input class="ocs__input" type="search" size="1" placeholder="Search titles &amp; descriptions"'),
       "The field must be an OCS search input whose width comes from the split, not its size")
assert(bar.include?('aria-label="Search titles and descriptions"'), "The field must have an accessible name")
assert(bar.include?('<button class="ocs__btn medium accent" type="button"') && bar.include?("Clear Search"),
       "Clear Search must be an OCS button as tall as the field")
assert(bar.scan(" disabled").size == 2, "The field and button must stay disabled until the script runs")
assert(bar[%r{<span class="ocs__links">\s*<button [^>]*>Clear Search</button>\s*</span>}m],
       "Clear Search must sit alone in an OCS links row, so the field never stretches")
assert(searchable.match?(%r{data-post-search>.*?</p>\s*<p role="status" aria-live="polite" data-post-search-status></p>}m),
       "The announced result count must be its own line under the bar")
assert(!searchable.include?("style="), "The search bar must not add inline styles")
texts = searchable.scan(/<li data-post-search-card data-post-search-text="([^"]*)">/).flatten
assert(texts.size == 5, "Every card must carry its search text; got #{texts.size}")
assert(texts.include?("newer-doc Description for newer-doc"), "Search text must be the title and description")
assert(texts.include?("Say &quot;hi&quot; Sprites &amp; sounds"), "Search text must be plain and escaped; got #{texts.inspect}")
card = searchable[%r{<li data-post-search-card data-post-search-text="newer-doc Description for newer-doc">.*?</li>}m]
assert(card && card.include?('<a class="post-link" href="/preview/newer-doc/" data-post-search-field>') &&
       card.include?('<p class="post-meta-description" data-post-search-field>Description for newer-doc</p>'),
       "Each card's title link and description must be marked for highlighting")
assert(searchable.scan(/class="post-link" href="([^"]+)"/).flatten == links + ["/preview/quoted-doc/"],
       "Searching must keep the catalog's cards and order")
assert(searchable.include?(%(from "/preview/assets/js/blogs/post-search.js";)),
       "The search script must load under baseurl, encoded with jsonify")

empty_search = render.call(search_page, [post("unrelated", "2026-02-19")])
assert(!empty_search.include?("post-search"), "An empty catalog must not show a search bar")
assert(empty_search.include?("No documentation is available yet."), "An empty catalog keeps its message")

# course= (passed by a course's Blogs page) keeps the posts that name only that
# course, the rule the course player uses for its own lessons. A post for several
# courses is listed through its one-course copies from split_multi_course_files.py.
hosted = lambda do |markup, entries|
  Liquid::Template.parse(markup).render!(
    { "site" => { "posts" => entries }, "page" => { "title" => "Blogs" }, "current_course" => "csa" },
    registers: { site: site }
  )
end
course_posts = [
  post("csa-lesson", "2026-03-03", "courses" => { "csa" => { "week" => 2 } }),
  post("csp-lesson", "2026-03-04", "courses" => { "csp" => { "week" => 2 } }),
  post("shared-lesson", "2026-03-05", "courses" => { "csa" => { "week" => 3 }, "csp" => { "week" => 3 } }),
  post("shared-lesson-csa", "2026-03-05", "courses" => { "csa" => { "week" => 3 } }),
  post("capstone", "2026-03-06", "sticky_rank" => 1),
  post("hidden-csa", "2026-03-07", "courses" => { "csa" => { "week" => 4 } }, "hide" => true)
]
csa = hosted.call("{% include blog-catalog.html course=current_course %}", course_posts)
csa_links = csa.scan(/class="post-link" href="([^"]+)"/).flatten
assert(csa_links == %w[/preview/shared-lesson-csa/ /preview/csa-lesson/],
       "A course's catalog lists only that course's own posts, newest first; got #{csa_links.inspect}")
assert(!csa.include?("post-search"), "course= alone must not add a search bar")
none = hosted.call('{% include blog-catalog.html course="csh" %}', course_posts)
assert(none.include?("No posts for this class yet.") && !none.include?('class="post-link"'),
       "A course with no posts of its own must say so")
course_search = hosted.call("{% include blog-catalog.html course=current_course search=true %}", course_posts)
assert(course_search.include?("data-post-search>") && course_search.scan("<li data-post-search-card").size == 2,
       "search=true must put the bar over the course's own cards")
everything = hosted.call("{% include blog-catalog.html %}", course_posts)
assert(everything.scan('class="post-link"').size == 5,
       "Without course= the catalog must still list every visible post")

puts "PASS: blog catalog filtering, ordering, cards, deduplication, baseurl, empty state, search bar and course filter"
