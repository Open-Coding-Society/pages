# Courses and Document Viewing Kit

This project owns the course entry, Blogs catalog, lesson player, sprint/week
navigation, reading completion, and course chat/calendar interfaces. Its sources
live here; the registered project build publishes them to the existing Jekyll
and browser paths. Do not edit those generated copies.

## Source map

| Source here | Responsibility | Published destination |
| --- | --- | --- |
| `navigation/{csse,csp,csa,csh}.md` | Course home entry pages | Dated posts in `_posts/projects/courses/` |
| `pages/course.md`, `pages/blog.md` | Legacy course chooser and global Blogs catalog | `navigation/course.md`, `navigation/blog.md` |
| `layouts/post.html` | Course document player and conventional post rendering | `_layouts/post.html` |
| `layouts/sprint.html`, `layouts/courses.html`, `layouts/blogs.html` | Legacy sprint view and catalog wrappers | `_layouts/` |
| `layouts/lessonbase*.html`, `layouts/notebook.html` | Legacy study/flashcard/capture viewers and notebook wrapper | `_layouts/` |
| `_includes/course-*.html` | Course pills and selected course title | `_includes/` |
| `_includes/lesson-{sidebar-nav,topbar,modals}.html` | Desktop/mobile player controls | `_includes/` |
| `_includes/player-pages/` | Home, sprint, week, chat, and Blogs page bodies | `_includes/player-pages/` |
| `_includes/sprint-*.html` | Sprint cards, week cards, and progression modal | `_includes/` |
| `_includes/{blog-catalog,post_list_image_card}.html` | Blog filtering and document cards | `_includes/` |
| `_includes/{announcement_chat,week_chat,lesson_chat}.html` | Course, week, and document chat | `_includes/` |
| `_includes/lesson-submission-form.html` | Player assignment submission UI | `_includes/` |
| `_includes/{calendar,ocs_calendar_card,announcement_calendar_demo}.html` | Calendar integration and preview interfaces | `_includes/` |
| `plugins/lesson_player_pages.rb` | Generates course player pages from schedule data | `_plugins/lesson_player_pages.rb` |
| `data/{cs,csa,csp,csse,csh}.yml` | Shared sprint definitions and course schedules | `_data/` |
| `js/player/` | Direct course entry, navigation state, legacy completion helpers | Existing `assets/js/` filenames |
| `js/announcement-calendar/` | Calendar cards, commands, data, feeds, and composer | `assets/js/chat/calendar/` |
| `js/courses.js` | Legacy sprint progression and certificates | `assets/js/projects/courses/courses.js` |
| `sass/main.scss` | Registered project's legacy sprint styling | `_sass/projects/courses/main.scss` |
| `sass/viewing/` | Player, Blogs, timeline, announcement-calendar styling | Existing `_sass/open-coding/` filenames |
| `tests/` | Entry, state, completion, rendering, and publication regressions | Not published; root test files delegate here |

The exact file mappings are in [distribution.json](distribution.json). Directory
mappings include all their files recursively. New shared-path resources must be
added there and their generated paths ignored in the root `.gitignore`.

`layouts/post.html` intentionally retains both the player and conventional post
branches. Moving the layout intact preserves assignment/export/chat behavior on
non-course documents; this kit supplies the shared document-viewing layout.

## Build and development

Like [calendar](../calendar/README.md), this project uses the generated
[shared Makefile](../../_template/Makefile), not a versioned local override.
It is already registered as `systems/courses:dev` in
[_projects/.makeprojects](../../.makeprojects), so the site's `dev` build always
publishes it before Jekyll starts.

```sh
make generate-makefiles
make -C _projects/systems/courses assets
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
  existing completion-helper URLs are supplied by this kit. Legacy study/capture
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
  Blogs remains available through its icon and shows Home > course > Blogs.
  Course breadcrumbs use the short pill name (CSSE/CSP/CSA/CSH), while the
  navigation panel retains the full course title.
  New guests default to CSSE through
  `_config.yml`'s `default_course`. Returning guests use `ocs-selected-course`;
  signed-in users prefer their saved enrolled course, otherwise their first
  enrolled course in CSSE/CSP/CSA/CSH order.
- Course homes remain `/navigation/courses/<course>/` and reuse the player with
  announcements/calendar. Legacy chooser/catalog routes remain available.
- The generator creates sprint and Blogs pages, and week/chat pages only for
  weeks with lessons. Sidebar links and generated URLs must stay aligned.
- Desktop and mobile panels put course buttons first, X at upper-right, and the
  selected title below. Hamburger controls open navigation; closing returns focus.
- Blogs, Previous/Next, and reading completion are icon-only with accessible
  labels. Arrows appear on lessons and sprint/week introductions. Completion
  appears only on lessons. Week chat remains in navigation, not the top bar.
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
