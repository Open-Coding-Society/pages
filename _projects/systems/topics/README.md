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
OR, the default, shows documents matching any checked topic or category: Java
OR FRQ shows both sets, counting shared documents once. AND requires every
checked topic and category: Java AND Algorithms shows only documents tagged with
both. This rule applies across both checkbox groups. No new topic attribute or
YAML topic inventory is required.
Document membership is discovered at build time from posts/pages.
Hidden, draft and search-excluded documents are omitted.

[Primary topics YAML](data/topics_primary.yml) orders SASS, Python, Java,
JavaScript, Flask, Spring, CS111, CS112 and CS113.

### Page layout

`/topics/` sets `full_width: true` (the base layout's existing full-width rule)
and lays out with `ocs__split ocs__split--aside`, one column on phones:

- **Sidebar:** a view selector beside Topics, Search with an in-field clear
  button, the key Topic Filter with OR/AND controls, and More Categories.
- **Landing and filtered browsing:** topic sections containing an
  `ocs__grid--col2` of unit cards with scrollable lesson lists. A lesson's
  unit comes from its title ("1.01 …", "Unit 2 Quiz"); lessons without one go to
  More lessons. [Unit names](data/topics_units.yml) are optional per topic. Each
  lesson is a `<details>` dropdown: number and title, then the full description
  and an Open lesson link. Quizzes, MCQs and FRQ practice become buttons in the
  unit's Practice row. Several topics get one heading each,
  and a document appears once, under its first topic in YAML order.
- **Search:** title-match cards, then text matches, both within the filters.

While the browser loads its index, the server-rendered fallback cards stay
hidden so they do not flash before the grouped view. If loading fails, or
JavaScript is disabled, the original document links remain available.

Topic Filters keeps the original controls. Topic Filter, expanded by default,
holds the primary topics with OR, AND and CLEAR buttons; More Categories, also expanded
by default, lists remaining categories with at least five documents, ordered by
count with alphabetical ties. An already-selected category below five stays
visible so a shared or older filter link can be cleared. Both groups are
multi-select with document counts; search also indexes category names, so
documents in less common categories remain discoverable.
CLEAR clears only topic/category selections, not the OR/AND choice;
the search X clears only the query. Each clear button is dimmed and disabled when
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
the source file name, the document title, a body/description excerpt highlighted
when it contains the match,
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

Topics opens the original document permalink with `?context=topics&topics_view=1`,
not a copy of its content. The shared viewer shows Topic Filters, previous and
next, and Microblog when available. It hides the Courses reader's sidebar while
viewing Topics; bespoke layouts retain their own content. The exact displayed
result order, expanded lessons, and page and unit-list scroll positions are saved in session storage, so the return
link restores the filters and position. A shared link without that session keeps
the filter URL but reports that previous/next are unavailable. Runners,
Submissions and lesson feedback retain the original document identity. Former `/topics/view/` routes are
small compatibility redirects that retain filter parameters and fragments.
Plain document links keep their default course context when a course is declared.
The reader's ordinary Topics catalog link remains available outside this viewer.

Topics' browser include can also be hosted in a course page. It shows document
week metadata there, but never uses weeks to define topic membership. Existing
language-reference pages host the same browser with their category selected.

Use `{% include projects/topics/topics-browser.html course_context=true %}` within a course
document to show weeks and link to original course views. The ordinary include
uses Topics context even when a reference page also carries course/week metadata.
The shared language-reference include selects course context when the page has
course metadata. Course reference sources use `layout: post` to retain the
shared reader; categorized `layout: opencs` reference pages also receive that shell.

## Resource map

| Source | Published destination |
| --- | --- |
| `pages/` | `navigation/projects/topics/`; Topics landing and Search compatibility entry |
| `plugins/topics.rb` | `_plugins/projects/topics/topics.rb`; builds category index and legacy redirects |
| `data/topics_primary.yml` | `_data/projects/topics/topics_primary.yml`; ordered primary category names |
| `data/topics_units.yml` | `_data/projects/topics/topics_units.yml`; optional unit names per topic |
| `_includes/` | `_includes/projects/topics/`; shared browser and document navigation |
| `js/` | `assets/js/projects/topics/`; search, filters, view and link context |
| `sass/main.scss` | Registered project style import |
| `tests/` | Category, search, rendering and submission-identity regressions |

The project is registered as `systems/topics:dev` and uses the shared generated
Makefile and [distribution manifest](distribution.json). Generated runtime
copies are not authoring sources. No local npm setup is needed: Lunr is the
existing shared vendor library.

All outputs use the shared ignored `projects/<name>/` roots. YAML is available
at `site.data.projects.topics`; plugins load recursively from `_plugins`.
Explicit permalinks keep `/topics/` and `/search/` unchanged and keep these
pages out of blog feeds. Publishing removes the previous root-level outputs
using their distribution cache; do not delete that cache before migration.

## Validation

```sh
bundle exec ruby scripts/test_topics.rb
bundle exec ruby scripts/test_system_project_distribution.rb
node --test tests/topics.test.mjs
```

Registered project builds publish resources and regenerate Sass imports before
Jekyll processes the site.
