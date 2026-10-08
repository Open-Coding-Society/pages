require "jekyll"

ROOT = File.expand_path("..", __dir__)

# Renders {% include name.html %} from _includes/, as Jekyll does: the layout
# includes blog-catalog.html, which includes post_list_image_card.html.
class CatalogInclude < Liquid::Tag
  def initialize(tag_name, markup, tokens)
    super
    @file = markup.strip
  end

  def render(context)
    Liquid::Template.parse(File.read(File.join(ROOT, "_includes", @file)))
      .render!(context)
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
layout = File.read(File.join(ROOT, "_layouts/blogs.html")).sub(/\A---\n.*?\n---\n/m, "")
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

puts "PASS: blog catalog filtering, ordering, cards, deduplication, baseurl and empty state"
