# Topics

Topics is a category-driven reference browser, independent of Courses' weekly
schedule, announcements and chat. Its landing page is `/topics/`; `/search/`
is a compatibility redirect. The site's top menu links to Topics.

See [Topics architecture](docs/ARCHITECTURE.md) for the system model,
document-viewing contracts and integration boundaries.

## Content model

Use existing frontmatter:

```yaml
categories: [Java, Algorithms]
```

Categories are independent facets, not ordered parent/child declarations.
Boxes in the same filter add to each other: Java plus Python shows every Java
document and every Python document. In the Topic Filter, the AND button makes
every checked topic required instead: Java AND Spring shows only documents tagged
with both, and OR, the default, adds them again. Categories Filter boxes always
add to each other. The Topic Filter and Categories Filter narrow each other: Java
plus Algorithms shows only documents tagged with both. No new topic attribute or
YAML topic inventory is required.
Document membership is discovered at build time from posts/pages.
Hidden, draft and search-excluded documents are omitted.

[Primary topics YAML](data/topics_primary.yml) orders SASS, Python, Java,
JavaScript, Flask, Spring, CS111, CS112 and CS113.

### Page layout

`/topics/` sets `full_width: true` (the base layout's existing full-width rule)
and lays out with `ocs__split ocs__split--aside`, one column on phones:

- **Sidebar:** Search; a Browse list (`ocs__tree`) of All topics and each primary
  topic with published documents, each with an `ocs__status` count; More
  categories, shortcut buttons for the twelve largest remaining categories; and a
  collapsed Advanced filters disclosure.
- **Landing (nothing chosen):** one `ocs__hub-card` tile per topic in an
  `ocs__grid--card`, showing its lesson count and unit range.
- **A chosen topic or category:** an `ocs__grid--col2` of unit cards. A lesson's
  unit comes from its title ("1.01 …", "Unit 2 Quiz"); lessons without one go to
  More lessons. [Unit names](data/topics_units.yml) are optional per topic. Each
  lesson is a `<details>` dropdown: number and title, then the full description
  and an Open lesson link. Quizzes, MCQs and FRQ practice become buttons in the
  unit's Practice row. Several topics (Advanced filters) get one heading each,
  and a document appears once, under its first topic in YAML order.
- **Search:** title-match cards, then text matches, both within the filters.

Advanced filters keeps the original controls. Topic Filter, expanded inside it,
holds the primary topics with the OR/AND buttons; Categories Filter, collapsed,
holds every remaining category. Both are multi-select with document counts.
Clear Filters clears only topic/category selections, not the OR/AND choice;
Clear Search clears only the query. Each clear button is dimmed and disabled when
its corresponding selection is empty. The View selector (Compact list, the
default, or Cards; `?view=cards`) picks lesson dropdowns or cards inside units.
Both boxes filter `categories`; YAML controls prominence,
not document membership. Primary topics remain visible even when they have no
published documents. No `topics:` attribute is required.

JavaScript, Python, Java, SASS, Flask, Spring, CS111, CS112 and CS113 are ordinary
categories when declared by content. CS112 and CS113 include their existing
`/csa/cs112/` and `/csa/cs113/` outline pages. Category membership is explicit:
Topics does not infer a language or college course from `lesson_language`,
`lesson_topic`, `lesson_group`, filenames, or weeks.

## Viewing and search

One filtered collection powers browsing and Lunr full-text search. Without a
query, documents appear as cards or a list. With a query, highlighted title
matches appear as primary cards, followed by Text matches as `ocs__nav-card` links:
the source file name, the document title, a highlighted body/description excerpt
and its categories as `ocs__status` chips (primary topics first; course-hosted
browsers add the document's weeks). Converted
notebooks and Word documents show their original `.ipynb`/`.docx` name. Long
words (URLs, file names) get `<wbr>` break points so a card never outgrows a
phone screen; `ocs__status` wraps where `ocs__status-pill` cannot. A title
match is not duplicated in the text list. Both sections respect all selected categories; no global search
overlay replaces the collection. Highlights use Lunr match positions and plain
text DOM nodes rather than inserting document HTML.
Category combinations, the AND choice (`match=and`), query and browsing view are
shareable through URL parameters.

Topics document routes under `/topics/view/` retain full interactive content,
Runners and Submissions without activating the course player. Assignment identity
uses the original document URL. Original document routes retain their course
behavior. A Topics return link restores the selected filters/query/view; links
to other indexed documents retain Topics context. An explicit original-context
link is available.

Topics' browser include can also be hosted in a course page. It shows document
week metadata there, but never uses weeks to define topic membership. Existing
language-reference pages host the same browser with their category selected.

Use `{% include topics-browser.html course_context=true %}` within a course
document to show weeks and link to original course views. The ordinary include
uses Topics views even when a reference page also carries course/week metadata.
The shared language-reference include selects course context when the page has
course metadata. Course reference sources use `layout: post` to retain the
course player; `layout: opencs` bypasses that adapter.

## Resource map

| Source | Published destination |
| --- | --- |
| `pages/` | Top-menu Topics landing and Search compatibility entry |
| `plugins/topics.rb` | `_plugins/topics.rb`; builds category index and document views |
| `data/topics_primary.yml` | `_data/topics_primary.yml`; ordered primary category names |
| `data/topics_units.yml` | `_data/topics_units.yml`; optional unit names per topic |
| `_includes/` | Shared Topics browser and document navigation |
| `js/` | `assets/js/topics/`; search, filters, view and link context |
| `sass/main.scss` | Registered project style import |
| `tests/` | Category, search, rendering and submission-identity regressions |

The project is registered as `systems/topics:dev` and uses the shared generated
Makefile and [distribution manifest](distribution.json). Generated runtime
copies are not authoring sources. No local npm setup is needed: Lunr is the
existing shared vendor library.

## Validation

```sh
bundle exec ruby scripts/test_topics.rb
node --test tests/topics.test.mjs
```

Registered project builds publish resources and regenerate Sass imports before
Jekyll processes the site.
