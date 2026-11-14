# Courses Composition System

This project owns course entry, the course-player adapter, sprint/week
navigation, completion controls, and course chat/calendar interfaces. It composes
the reusable [Blogs system](../blogs/README.md), which owns shared document
layouts, the catalog and reader. See [architecture](docs/ARCHITECTURE.md).
Its sources
live here; the registered project build publishes them to the existing Jekyll
and browser paths. Do not edit those generated copies.

## Source map

| Source here | Responsibility | Published destination |
| --- | --- | --- |
| `navigation/{csse,csp,csa,csh}.md` | Course home entry pages | Dated posts in `_posts/projects/courses/` |
| `pages/course.md`, `pages/blog.md` | Legacy course chooser and global Blogs catalog | `navigation/course.md`, `navigation/blog.md` |
| `_includes/course-document-player.html` | Course branch used by the Blogs-owned post layout | `_includes/course-document-player.html` |
| `layouts/sprint.html`, `layouts/courses.html` | Legacy sprint view and course wrapper | `_layouts/` |
| `_includes/course-*.html` | Course pills and selected course title | `_includes/` |
| `_includes/lesson-{sidebar-nav,topbar,modals}.html` | Desktop/mobile player controls | `_includes/` |
| `_includes/player-pages/` | Home, sprint, week, and Blogs page bodies | `_includes/player-pages/` |
| `_includes/sprint-*.html` | Sprint cards, week cards, and progression modal | `_includes/` |
| `_includes/{announcement_chat,lesson_chat}.html` | Course and document chat | `_includes/` |
| `_includes/{calendar,ocs_calendar_card,announcement_calendar_demo}.html` | Calendar integration and preview interfaces | `_includes/` |
| `plugins/lesson_player_pages.rb` | Generates course player pages from schedule data | `_plugins/lesson_player_pages.rb` |
| `data/{cs,csa,csp,csse,csh}.yml` | Shared sprint definitions and course schedules | `_data/` |
| `js/player/` | Direct course entry and navigation state | Existing `assets/js/` filenames |
| `js/announcement-calendar/` | Calendar cards, commands, data, feeds, and composer | `assets/js/chat/calendar/` |
| `js/courses.js` | Legacy sprint progression and certificates | `assets/js/projects/courses/courses.js` |
| `sass/main.scss` | Registered project's legacy sprint styling | `_sass/projects/courses/main.scss` |
| `sass/viewing/` | Timeline and announcement-calendar styling | Existing `_sass/open-coding/` filenames |
| `tests/` | Entry, state, completion, rendering, and publication regressions | Not published; root test files delegate here |

The exact file mappings are in [distribution.json](distribution.json). Directory
mappings include all their files recursively. New shared-path resources must be
added there and their generated paths ignored in the root `.gitignore`.

Blogs owns `layouts/post.html`. Document pages use the shared reader, while
course home/sprint/week/Blogs pages keep the Courses-owned player adapter. Courses'
Blogs page delegates to Blogs' reusable reader with `course=` and `search=true`,
so it lists posts whose `courses` includes that course, including shared lessons,
under a search bar. Both systems preserve the
existing runtime paths and are always-on `:dev` projects.

## Build and development

Both viewer toolbars start with the Home icon and course/context selector above
the two panes. Course titles live in the scrolling navigation pane; course home
pages omit the duplicate body heading. The document reader labels its navigation
with the course title, not the current lesson week. Lesson titles and identities
remain unchanged.

Course overview pages switch courses through the OCS dropdown in the breadcrumb
bar. It opens the selected course's home, preserving `site.baseurl`; the desktop
sidebar and mobile navigation panel retain their close controls, title and
lesson navigation without duplicate course pills. The standalone sprint layout
still uses its existing course menu.

### Canonical document reader

No lesson front matter changes or separate document list are required.
`reader/reader.rb` discovers published `post`/`notebook` documents with categories
or course placements and adds navigation metadata. Categorized `opencs` reference
pages get the same shell through `reader/reference.html`; bespoke application
layouts are not replaced. The original title, permalink, content and assignment
fields remain unchanged.

The original URL accepts `?context=course&course=csp` or `?context=topics`.
Plain links retain the old course-priority default (CSP, CSA, CSSE, CSH); references
without course placement default to Topics. Only courses actually declared in
the document are offered. The sidebar draws existing sprint/week cadence from
course YAML, or category-filtered titles/descriptions using Topics' shared filter
rules. Full-text search remains in `/topics/`. Context changes leave the article,
runner editors, unsaved form fields and submission listeners mounted.

The reader uses the site's live OCS theme tokens: `--panel` for navigation and
toolbar surfaces, the page background for content, and OCS accent buttons/tree
guides for lesson links. Selected links use `fill`; do not reuse the legacy
`lesson-item` class, whose preference-engine override masks selection colors.
Theme changes apply without rebuilding the sidebar or replacing the article.
Reader lesson links override the small control's fixed height so wrapped titles
stay inside their button and do not overlap neighboring rows.
Both course navigation treatments keep the sprint flag, show each week's
completed/total lesson count, and distinguish assignments from references with
their document icons. Lesson titles wrap and a small check marks completion;
the mobile course menu mirrors those indicators. Counts include all lessons,
not only assignments, and follow the existing per-course completion state.

Course home, week and sidebar links carry course context. Topics links
carry Topics/filter context. The reader toolbar's `<` and `>` buttons open the
previous and next document in the selected course or Topics order (the same
targets as the bottom pager) and hide at either end. Navigation sections, scroll and last document use
the existing per-course/per-panel storage helper; switching contexts releases
its old listeners. Completion retains `<course>-lesson-completion` and the
original document URL, with no writes when simply changing views.

`make split-courses` now emits compatibility redirects, not copied lessons.
Old `/topics/view/...` and `/<document>/<course>/` links forward to the original
permalink with context, preserving hashes and filter parameters. Old converted
notebook variants are treated as redirects too; author notebooks are not edited.
Jekyll deduplicates legacy redirect variants before building the catalogs.

The existing Blogs submission forms, runner includes, lesson feedback and grading
helpers execute on the original permalink. Query parameters never enter
`contentUrl` or runner storage keys. **Previously course-split assignments may
have separate historical IDs**: this rollout does not delete or merge their
records; new submissions through redirected URLs resolve the canonical
assignment. Review old assignment rows in the teacher dashboard if needed.

Tests: `bundle exec ruby scripts/test_document_reader.rb`,
`node --test tests/document_reader.test.mjs tests/course_navigation_state.test.mjs`,
and `venv/bin/python -m unittest discover -s tests -p test_convert_notebooks.py`.
The Ruby test renders a real shared Intro to JavaScript lesson at both baseurls
and executes its assignment-resolution script against a mocked backend.

### Optional sprint introductions

Add `direction_include` to a course's sprint in `data/<course>.yml`:

```yaml
Sprint3:
  title: Creating a game for N@tM
  direction_include: projects/courses/sprint-intro/csse-sprint-3.md
  start: 9
  end: 12
```

Author ordinary Markdown in `data/sprint-intro/`, beside the course YAML.
Use Markdown headings, lists, tables, and links; do not add frontmatter.
The distribution manifest publishes an include copy automatically under
`_includes/projects/courses/sprint-intro/`. The existing `_includes/projects/`
ignore rule covers it; no per-sprint ignore rules or Makefile changes are needed.
The publisher tracks these outputs for project cleanup and removes unchanged
outputs from previous destinations when republishing.
The sprint template explicitly uses Jekyll's built-in `markdownify` filter;
Markdown inside an include is not automatically converted just by its extension.
Jekyll renders Liquid links, converts Markdown to HTML, and the template applies the shared
OCS heading, text, table, and scrolling-table classes inside an OCS card.
There is no hand-authored or version-controlled rubric HTML.
The shared
`_includes/player-pages/sprint.html` renders it after the complete Weeks card
(including its statistics). The field is optional and course-specific, including
when a sprint uses a shared description. A configured missing include fails
the Jekyll build instead of silently hiding instructions.

CSSE Sprint 3 provides the first example, with a phase-based assignment rubric
worth 13 regular points plus 1 bonus point. Rubric edits belong in the Markdown.
The former objectives notebook has been removed; its link is no longer included.

Publish with `make -C _projects/systems/courses assets`. Test optional rendering,
placement, shared-sprint behavior, rubric totals, and missing includes with
`bundle exec ruby _projects/systems/courses/tests/test_sprint_direction.rb`.

Like [calendar](../calendar/README.md), this project uses the generated
[shared Makefile](../../_template/Makefile), not a versioned local override.
It is already registered as `systems/courses:dev` in
[_projects/.makeprojects](../../.makeprojects), so the site's `dev` build always
publishes it before Jekyll starts.

```sh
make generate-makefiles
make -C _projects/systems/courses assets
make -C _projects/systems/blogs assets
make -C _projects/systems/courses build
make -C _projects/systems/courses watch
```

Use the root [Makefile](../../../Makefile) for normal site workflows. Registered
builds generate `_sass/projects/_all.scss` after project publication. A standalone
`assets` command publishes this kit but does not build the whole site.

For projects with `distribution.json`, the manifest owns JavaScript and Sass
publication instead of the generic whole-folder copy. The template still emits
the project's CSS entry and publishes navigation/index/notebook content.
Sources are published before the index triggers a Jekyll rebuild.

Publication is content-stable: unchanged files are not rewritten. The watcher
fingerprints manifest sources, including layouts, includes, plugins, YAML,
styles, and entry pages, and requests a rebuild when they change. Removing a
file from a mapped directory or removing a mapping removes its previous output;
missing explicitly mapped sources fail with an actionable error.

The ignored `.project-distribution-cache/` records output ownership and content
checksums. Cleanup removes only previously published manifest files, refuses to
delete modified output, and leaves sources/shared resources alone. It also
works after a manifest is removed. Do not use `clean` while the site's watcher
or server is running. Restart `make dev` after changing the shared template so
the regenerated project Makefile and watcher use the new rules.

Styles retain their existing import locations and order in
`_sass/open-coding/_main.scss`; `sass/main.scss` and
`sass/viewing/timeline.scss` are distinct legacy style layers, not interchangeable
copies. Relative mixin imports resolve at the published paths. Ruby Sass must
remain supported.

## Shared dependencies and integration boundaries

This is a reusable frontend kit, not a standalone backend or complete theme:

- **Site shell:** `_config.yml`, `_layouts/opencs.html`, and
  `_includes/themes/minima/header.html` remain site-owned. The header uses
  `[data-course-entry]` and the published course-entry helper.
- **Authentication/configuration:** `assets/js/api/login.js` and
  `assets/js/api/config.js` remain shared. Login selects a course through the
  helper rather than maintaining a second routing policy.
- **Document services:** reading time, TOC, submenu, Gist export/settings,
  runner I/O, grading/submission helpers, and Utterances remain shared. Lesson
  sources remain in their registered lesson projects, notebooks, and DOCX.
  Subject/activity-specific lesson layouts and games remain separate; their
  existing completion-helper URLs are supplied by Blogs. Legacy study/capture
  viewers still consume shared Fabric.js and `assets/js/solitaire/ai-grader.js`.
- **Chat:** shared `assets/js/chat/rich-text.js`, group-management clients,
  SockJS/STOMP libraries, and Spring `/ws-chat` remain external dependencies.
  The group dashboard and lesson chat contain parallel chat logic; synchronize
  relevant fixes rather than creating another implementation.
- **Calendar:** [calendar](../calendar/README.md) owns its API/UI runtime and
  `assets/js/projects/calendar/` modules. This kit owns the consuming interfaces.
  `_data/school_calendar.yml` stays shared. Calendar sync requires calendar to
  be built; courses being `:dev` does not itself enable calendar's whole dashboard.
- **Curriculum reporting:** college topic maps, report templates, reference
  navigation, and curriculum-specific tests remain with the curriculum system.
- **Backend contracts:** enrollment, calendar, announcements/chat, and assignment
  submission still call the existing services. Moving sources does not change
  API origins, credentials, or authorization.

## Preserved behavior

- The header opens `/navigation/courses/<course>/` (Home/Announcements) directly.
  The topbar no longer has a Blogs shortcut (Topics replaces it); the generated
  Blogs page still shows Home > course > Blogs.
  Course breadcrumbs use the short pill name (CSSE/CSP/CSA/CSH), while the
  navigation panel retains the full course title.
  New guests default to CSSE through
  `_config.yml`'s `default_course`. Returning guests use `ocs-selected-course`;
  signed-in users prefer their saved enrolled course, otherwise their first
  enrolled course in CSSE/CSP/CSA/CSH order.
- Course homes remain `/navigation/courses/<course>/` and reuse the player with
  announcements/calendar. Legacy chooser/catalog routes remain available.
- The generator creates sprint and Blogs pages, and week pages only for weeks
  with lessons. Sidebar links and generated URLs must stay aligned.
- Desktop and mobile panels put course buttons first, X at upper-right, and the
  selected title below. Hamburger controls open navigation; closing returns focus.
- Previous/Next and reading completion are icon-only with accessible
  labels. Arrows appear on lessons and sprint/week introductions. Completion
  appears only on lessons.
- `ocs-course-navigation:<course>:<panel>` stores expanded sections, scroll,
  and the last document separately for desktop/mobile. Blogs remains in the
  main pane while the last document is highlighted for resuming; no automatic
  redirect or completion occurs.
- Existing lesson completion keys/order, sprint progress, priorities, and
  certificate behavior are preserved.

## Validation

Root entry points preserve existing test commands while the test implementations
live with the kit and read source files rather than stale generated copies:

```sh
node --test tests/course_entry.test.mjs tests/course_navigation_state.test.mjs tests/lesson_completion.test.mjs
bundle exec ruby scripts/test_course_distribution.rb
bundle exec ruby scripts/test_course_landing_pages.rb
bundle exec ruby scripts/test_player_pages.rb
bundle exec ruby scripts/test_blog_catalog.rb
```

Publication tests use isolated temporary destinations, not a live site cleanup.
Also verify a registered-project build, a Jekyll/Ruby-Sass build, and desktop/mobile
course entry, document selection, Previous/Next, completion, and navigation resume.
