---
layout: post
title: Topics Architecture
description: Category-driven reference discovery, scoped search, and interactive document viewing.
permalink: /systems/topics/architecture/
show_reading_time: false
---

## Topics: reference discovery

Topics organizes published learning material by subject rather than by teaching
time. It provides category selection, filtered browsing, full-text search and
context-preserving document navigation.

[Blogs](../../blogs/docs/ARCHITECTURE.md) supplies the document publishing and
interactive viewing foundation. [Courses](../../courses/docs/ARCHITECTURE.md)
organizes documents into curriculum, sprints and weeks. Topics supplies another
entry into the same authored material, independent of schedules, announcements
and course chat.

A document can participate in both a course and a reference collection. Its
categories determine its Topics membership; its course/week metadata determines
its curriculum placement. Neither viewing context takes ownership of the
authored content.

## System picture

```text
Authoritative Markdown / IPYNB / DOCX sources
    |
    v
Conversion and Jekyll posts/pages
    |
    +---- categories ----> Topics
    |                      ├── Reference browser
    |                      │   ├── Topic Filter - prominent categories
    |                      │   ├── Categories Filter - remaining categories
    |                      │   ├── Cards / List browsing
    |                      │   └── Scoped full-text Search
    |                      │       ├── Title matches - highlighted cards
    |                      │       └── Text matches - file name, excerpt and category cards
    |                      └── Topics document view
    |                          ├── Full authored content
    |                          ├── Runners and Submissions
    |                          └── Return and related-document navigation
    |
    +---- course/week ---> Courses
                           └── Curriculum and course document view

Blogs supplies shared document layouts and interactive integrations.
```

The diagram describes capabilities and relationships, not separate copies of
authored lessons. Topics document routes are generated presentation views of
the underlying documents.

## Categories and primary topics

The content model uses existing frontmatter:

```yaml
categories: [Java, Algorithms]
```

Categories are independent facets, not an ordered parent/child path. Both filter
groups support multiple selections. Checked boxes in the same group are
alternatives: Java and Python finds every document in either collection. The two
groups narrow each other: Java (Topic Filter) and Algorithms (Categories Filter)
finds documents in both. In set terms, each group is a union and the groups are
intersected.

The Topic Filter has OR and AND buttons. OR, the default, is the rule above. AND
requires every checked Topic Filter box: Java and Spring finds only documents in
both collections. Categories Filter boxes remain alternatives in both modes, and
the two groups still narrow each other. In set terms, AND makes the Topic group an
intersection instead of a union.

The [primary topics configuration](../data/topics_primary.yml) orders prominent
categories: SASS, Python, Java, JavaScript, Flask, Spring, CS111, CS112 and CS113.
This YAML controls visibility and order, not membership. Primary categories
remain selectable even when their collection is empty. Remaining discovered
categories appear in the secondary group.

No separate `topics:` attribute is required. Membership is not inferred from
filenames, week numbers, lesson language or lesson grouping. CS112 and CS113
reference their existing outline documents through explicit categories; links
from an outline do not automatically assign those categories to linked lessons.

## Build-time discovery

The [Topics generator](../plugins/topics.rb) discovers categorized Jekyll posts
and pages. It omits hidden documents, drafts, search-excluded content and
generated course player pages. Documents are deduplicated by original URL and
sorted by title for ordinary browsing.

The generator creates:

- A catalog with title, description, category keys and display labels, source
  path (and the original `.docx` name of a converted Word document), original
  URL, Topics view URL, searchable content and optional course/week display
  metadata.
- Primary and secondary category collections for the browser.
- A JSON search catalog at `/assets/js/topics/data.json`.
- Full-document routes under `/topics/view/`.

Category keys are lowercase for comparison; display labels retain authored
names. Invalid category values or an invalid primary-topic configuration fail
the build rather than silently changing discovery.

Search text is derived from source content with script/style blocks, Liquid
tokens and HTML tags removed. It is not a crawl of rendered pages; content
loaded through relative includes is not expanded into the search text.

## Browser and search

The [browser include](../_includes/topics-browser.html) is a full-width page
with a sidebar (`ocs__split--aside`): Search, a Browse list of topics with counts,
More categories shortcuts, and a collapsed Advanced filters disclosure. Choosing a
topic shows its lessons as unit cards; each lesson is a dropdown with its full
description and an Open lesson link, and quizzes and FRQ practice sit in the
unit's Practice row. Units come from lesson titles; their optional names come
from [`topics_units.yml`](../data/topics_units.yml). Layout details are in the
[README](../README.md#page-layout).

Advanced filters holds the original two disclosures. Topic Filter defaults open;
Categories Filter defaults closed. Topic Filter starts with its OR/AND pair:
`ocs__btn` buttons in an `ocs__links` group, the current choice filled and
`aria-pressed`, disabled until the search index loads. Clear Filters belongs to
that box and clears only category selections. Search has its own clear control.
Each clear button is dimmed and disabled when its corresponding state is empty.

The [browser controller](../js/browser.js) builds a Lunr index in the client
from the static catalog. Title, description and content participate in search,
with title matches boosted. User input is tokenized as terms rather than
interpreted as Lunr query syntax.

Browsing and search use the same category filter:

| Mode | Output |
| --- | --- |
| No query | Topic tiles, or the chosen topic's unit cards (lesson dropdowns or cards) |
| Search query | Title-match cards, followed by text-match cards with excerpts |
| No matching documents | Explicit empty-result status |
| Index unavailable | Error status with ordinary document links still available |

Each search result appears in only one group. Title hits take precedence;
otherwise content or description supplies the excerpt. Each group preserves
search relevance ordering and displays its count beside its heading. Search
uses title cards regardless of the browsing view selection.

The [model helpers](../js/model.js) implement the category filter, URL state,
match grouping and excerpt construction. Highlights are created with text nodes
and `mark` elements, not injected document HTML. Search results remain within
the selected collection rather than replacing it with a global search overlay.

## Document viewing and navigation

The ordinary reference browser opens `/topics/view/...` routes. These routes
preserve full content and interactive capabilities while suppressing the
course player and document-scoped chat. Original document URLs retain their
normal course or standalone behavior.

Generated views retain source paths and Markdown conversion so relative
includes resolve against the authored document. The shared
[Blogs post layout](../../blogs/layouts/post.html) recognizes Topics context
and preserves the original document URL as the submission identity. A viewing
route does not create a new assignment.

The [document navigation](../_includes/topics-document-nav.html) offers a return
to Topics and an original-context link. The [document controller](../js/document.js)
restores category, query and view parameters on the return link. Links to
indexed same-site documents preserve Topics context; unrelated or external
links retain their destinations.

URL parameters carry browser state:

- Repeated `category` values identify selected facets.
- `q` carries the search text.
- `match=and` requires every checked Topic Filter box; OR is the default.
- `view=cards` shows cards inside unit cards; the compact lesson list is the default.

State is shareable and restored during browser history navigation. Clearing
filters preserves the query, view and OR/AND choice; clearing Search preserves
filters and view.

## Integration boundaries

| System or resource | Responsibility |
| --- | --- |
| Topics | Category discovery, filtered collections, scoped search and reference navigation |
| Blogs | Publishing layouts, full-document presentation and interactive integrations |
| Courses | Curriculum selection, schedules, progression and course navigation |
| Authoring and conversion | Maintain source content and convert notebooks/DOCX into publishable documents |
| Runners, Submissions and Grading | Execute exercises, persist evidence and evaluate submissions |
| Site shell and authentication | Global navigation, preferences, identity and API configuration |

The browser is reusable outside its landing page. Language-reference pages can
start with a category selected. A course can include the browser with
`course_context=true`; that adapter displays week metadata and links to
original course documents. Weeks remain display context, not topic membership.

Topics does not own Calendar or Chat views. Its reference-discovery interface
does not require an account; interactive document capabilities retain their
own authentication and backend requirements.

## Sources and publication

| Source | Responsibility |
| --- | --- |
| [Pages](../pages/) | `/topics/` landing and `/search/` compatibility redirect |
| [Includes](../_includes/) | Browser and document navigation |
| [Generator](../plugins/topics.rb) | Catalog, category collections and generated views |
| [Primary-topic YAML](../data/topics_primary.yml) | Prominent category labels and order |
| [JavaScript](../js/) | Browser state, search and document link context |
| [SCSS](../sass/main.scss) | Topics layout and component styling |
| [Tests](../tests/) | Discovery, rendering, filtering, search and identity contracts |
| [Distribution manifest](../distribution.json) | Stable Jekyll and browser publication destinations |

Topics is registered as `systems/topics:dev` in the
[project registry](../../../.makeprojects). The shared project Makefile publishes
resources through its manifest; documentation uses the shared `docs` target.
The root [Makefile](../../../../Makefile) coordinates publication, conversion
and Jekyll build/serve. Runtime copies and converted posts are generated outputs,
not authoring locations.

Lunr is a shared vendor asset. Inputs and buttons use shared OCS styling; local
SCSS handles disclosure layout and result presentation. The normal project
build does not require a separate npm installation.

## Validation

- `bundle exec ruby scripts/test_topics.rb`: catalog and primary configuration,
  original versus Topics rendering, source-relative includes, submission
  identity and browser markup.
- `node --test tests/topics.test.mjs`: category filters, scoped search,
  URL state, grouped matches and highlighted excerpts.
- Jekyll builds through the repository workflow: generated routes, Liquid
  rendering and Ruby Sass compatibility.
- Browser checks: disclosure defaults, independent clearing, URL restoration,
  result counts, document navigation and mobile layout.
