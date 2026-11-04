# Blogs and Document Viewing System

See [Blogs architecture](docs/ARCHITECTURE.md) for the publishing foundation,
IPYNB authoring, interactive capabilities and system relationships.

Blogs is reusable inside or outside a course. It owns shared document layouts,
the post catalog/cards, embedded reader, legacy study/completion scripts, and
document/submission UI styles. Courses supplies curriculum navigation through a
conditional adapter rather than owning generic document layouts.

## Sources and publication

| Source | Published destination |
| --- | --- |
| `layouts/` | `_layouts/` (post, blogs, notebook, study/capture, blog-reader) |
| `_includes/` | `_includes/` (catalog, card, reader, submission UI) |
| `js/` | Existing `assets/js/lesson-*.js` and `assets/js/lessonbase*.js` paths; `assets/js/blogs/post-search.js` |
| `sass/` | Existing `_sass/open-coding/{blogs,lesson-player}.scss` paths |
| `tests/` | Source-based tests, not published |

[distribution.json](distribution.json) is the publication contract. This project
uses the shared generated Makefile and is registered as `systems/blogs:dev`.
It has no local npm manifest or custom Makefile.

## Using Blogs

- `layout: post`: full document, with existing Submission/Runner integrations.
- `layout: blogs`: catalog with ordinary full-page links; preserves existing behavior.
  `post_filter: <flag>` lists only the posts whose front matter sets that flag to
  `true`. `post_search: true` adds a search bar built from OCS components: typing
  hides the cards whose title and description don't have every query word, marks
  each word with `<mark>` where it appears in a card's title or description, keeps
  the catalog's order, and keeps the query in `?q=` so it can be shared.
- `layout: blog-reader`: optional standalone catalog with embedded reading.
- `{% include blog-reader.html %}`: the same reader hosted by a course page.
  `course=<course>` lists only posts whose `courses` names that course alone,
  and `search=true` adds the search bar; a course's Blogs page passes both.
- `layout: notebook`, `lessonbase`, `lessonbasecapture`: existing viewer variants.

The reader preserves `?post=` history, list/reader switching, relative links and
images, and error feedback. It strips scripts, forms and runners from embedded
content and links to the full document for interactive work. It uses the course
content scroller when hosted there and the document scroller otherwise.

## Dependencies

Blogs uses the site shell/theme, reading-time/TOC/comment includes, API/auth
configuration, Gist/runner I/O, Submission and Grading helpers. These are shared
dependencies, not relocated backend services. Subject-specific content and
layouts remain in their own projects.

Conventional documents do not require Courses. Documents with course metadata or
`player_page` use the Courses-owned `course-document-player.html` extension.
Optional document chat still uses the existing chat include and backend; Chat
is not independently packaged yet.

The shared player stylesheet retains its course selectors to preserve cascade
and layout behavior during extraction. Future Submission, Runners, Grading and
Chat system extractions can refine these boundaries without moving their APIs.
See [Courses architecture](../courses/docs/ARCHITECTURE.md).

## Build and validation

```sh
make generate-makefiles
make -C _projects/systems/blogs assets
make -C _projects/systems/blogs build
bundle exec ruby scripts/test_blogs_system.rb
bundle exec ruby scripts/test_blog_catalog.rb
node --test tests/post_search.test.mjs
bundle exec ruby scripts/test_course_landing_pages.rb
```

On checkouts carrying the old Courses publication cache, first run
`make -C _projects/systems/courses assets` to release transferred outputs, then
publish Blogs. Do not clean a live site. Normal registered builds subsequently
publish both always-on systems; restart existing watchers after this extraction.
