<!-- 
NOTE: This file serves as the English documentation and explanation for `AGENTS.md` (which is maintained in Chinese to maximize token efficiency and context retention). Any updates or new rules added to `AGENTS.md` must also be translated and updated in this file.
-->

# Agent Programming Guidelines

## Core Principles

### Single Responsibility Principle (SRP)

* Every function, class, and module should have one clear reason to change.
* Avoid "god functions" that handle multiple concerns.
* If you describe a function with "and", it likely violates SRP.
* Prefer composition over large multi-purpose units.

### Simplicity over Cleverness

* Prefer readable code over "clever" abstractions.
* Avoid premature optimization.
* If a junior engineer can’t understand it in 30 seconds → simplify.

### Explicit Over Implicit

* Make dependencies visible.
* Avoid hidden state changes.
* Avoid "magic behavior" (implicit globals, side effects).
* Isolate I/O, network, and filesystem operations where possible.

## Architecture Rules

### Separation of Concerns

Split logic into clear layers:

* UI / interface layer
* Business logic layer
* Data / persistence layer
* Utility/helpers (pure functions)
**Agent rule:** Never mix data access with business logic unless explicitly justified.

### Feature-based Modularity

* Prefer modular files over large monoliths.
* Keep file sizes reasonable (soft rule: <300–500 lines).
* Group by feature, not by type (often better for scaling systems).
* Prefer modular monolith over microservices unless scale demands it.

## System-Specific Rules

### Ecosystem & Tooling Defaults

* **Prioritize SASS:** Use SASS (`.scss`) for styling instead of standard CSS or inline styles.
* **SASS compatibility:** The current Jekyll build uses Ruby Sass. Use `rgba(0, 0, 0, 0.15)` for transparent colors, not unsupported `rgb(0 0 0 / 15%)` syntax. Validate through the Makefile's Jekyll build.
* **Use `_projects`:** Leverage the modular project auto-registration system in the `_projects/` directory for new projects.
* **System Expansion:** Work within the existing systems and expand them if needed, rather than creating completely new parallel architectures.
* **Calendar pages:** Keep layout and modal styling out of `navigation/calendar.md`; use semantic classes and SCSS instead of utility-heavy inline markup.
* **Calendar event edits:** Spring's `PUT /api/calendar/edit/{id}` rejects an empty `period` or `description`; send `Personal` for events with no course. Linked docs live on the description's last line (`Linked doc: <url>`, see `_projects/systems/calendar/js/CalendarDocLinks.js`); test with `node --test tests/calendar_doc_links.test.mjs`.
* **Cross-origin APIs:** Spring endpoints consumed from `pages.opencodingsociety.com` should explicitly allow credentialed cross-origin requests.
* **Documentation:** Create detailed documentation for difficult or complex implementations as necessary.
* **Commenting:** Add comments for non-trivial logic, but keep them minimal and focused on *why* rather than *what*.
* **Ask Questions:** If system-level constraints, requirements, or patterns are unclear, pause and ask the user questions before proceeding.

### Project Workflow

* Treat [Makefile](Makefile) as the single source of truth; common targets are `make`/`make serve-current`, `make dev`, `make stop`, `make convert`, and `make convert-single` (details in [README.md](README.md)).
* Order matters: stop → build projects → convert notebooks/docx → split courses → jekyll serve (follow [Makefile](Makefile)).
* Project builds must run the [SASS import generator](scripts/generate_sass_imports.py) to create `_sass/projects/_all.scss`; `build-registered-projects` owns this dependency so Jekyll can resolve `projects/all`.
* Deleted projects: old checkouts keep a deleted project's git-ignored outputs, and `clean-registered-projects` reaches only projects listed in `.makeprojects`. So `build-registered-projects`, `build-dev-projects` and `make clean` run `clean-removed-projects` ([scripts/clean_removed_projects.rb](scripts/clean_removed_projects.rb)). When git lists no file (tracked or new) in a project's `_projects/<category>/<name>/` folder, it removes the outputs named after it: `_posts/projects/<name>/` and its index post, the other `projects/<name>/` copies such as `assets/js/projects/<name>/`, the generated `Makefile`, and `.project-distribution-cache/<name>.json` with the files it records. Jupyter's `.ipynb_checkpoints` do not count as source. It never removes tracked files or a current project's outputs. A PR that deletes a project can therefore also delete files only its outputs used. Test: `bundle exec ruby scripts/test_clean_removed_projects.rb`.
* Use template-generated project Makefiles. Do not add local npm manifests, `.gitignore` files or Makefile overrides for shared browser libraries. Keep shared runtime libraries in `assets/js/vendor/` with licenses and version documentation; ordinary builds need no npm installation.

### Sources vs Generated Files

* Courses owns curriculum composition in [_projects/systems/courses/](_projects/systems/courses/); [Blogs](_projects/systems/blogs/README.md) owns shared document layouts, catalog/reader, completion helpers and viewer styles. See [architecture](_projects/systems/courses/docs/ARCHITECTURE.md). Both are `:dev` projects using the shared generated Makefile and disjoint distribution manifests. Edit sources, not root generated copies. The Blogs post layout delegates course rendering to Courses' `course-document-player.html`; standalone documents must render without Courses. Submission/Runners remain shared dependencies; Grading derives from Submission. On old checkouts publish Courses before Blogs to release cached ownership; never delete caches indiscriminately. Tests: `bundle exec ruby scripts/test_blogs_system.rb`, `bundle exec ruby scripts/test_course_distribution.rb`. Restart watchers after boundary/template changes.
* The Blogs catalog ([_projects/systems/blogs/_includes/blog-catalog.html](_projects/systems/blogs/_includes/blog-catalog.html)) reads page front matter: `post_filter: <flag>` keeps the posts whose flag is `true`, and `post_search: true` adds a search bar that filters the cards by title and description ([_projects/systems/blogs/js/post-search.js](_projects/systems/blogs/js/post-search.js); `?q=` keeps the query, as in Topics; matches are highlighted with a native `<mark>` built from text nodes in each card's title link and description, which `post_list_image_card.html` marks `data-post-search-field` while the search is on). Through `blog-reader.html` a host passes `course=<course>` (only posts whose `courses` names that course alone, the course player's rule) and `search=true`; each course's Blogs page passes both. The bar is OCS components only; `ocs__split` sets the field's width because an input's `size` renders far wider in Safari than in Chrome and overflows a 320px phone; the count sits on its own line so the split never stretches the field. Tests: `bundle exec ruby scripts/test_blog_catalog.rb`, `node --test tests/post_search.test.mjs`.
* [Topics](_projects/systems/topics/README.md) uses `categories` as independent reference filters, combined by the rule in the Topics prominence bullet, never weeks or `lesson_topic`/`lesson_language`. `/topics/` replaces the Search menu; `/search/` redirects. Its generated `/topics/view/` documents keep interactive content and original submission identity but suppress course rendering/chat. Do not change original course routes. Card and Lunr results share one filtered collection. Use `topics-browser.html course_context=true` for course-hosted cards with week labels/original links. Test: `bundle exec ruby scripts/test_topics.rb` and `node --test tests/topics.test.mjs`.
* Topics prominence comes from [_projects/systems/topics/data/topics_primary.yml](_projects/systems/topics/data/topics_primary.yml), not a `topics:` document field. Both selection boxes filter `categories`: boxes checked in the same box are alternatives (Java or Python), and the two boxes narrow each other (Java and Algorithms). The Topic Filter's OR/AND buttons (`ocs__btn` with `aria-pressed`, OR by default, `?match=and`) switch its own boxes to all-required (Java and Spring); Categories boxes stay alternatives in both modes. Search shows highlighted title cards followed by body/description excerpt matches, with no duplicate title results and no filter escape. Render highlights with plain-text nodes and Lunr positions.

* Course home sources are [_projects/systems/courses/navigation/](_projects/systems/courses/navigation/). Preserve `/navigation/courses/<course>/`; use `layout: post` and `player_page: {course: <course>, kind: home}` to share the sidebar and existing announcement/calendar UI. Course pills must resolve `current_course` on lessons, not only `page.course`. Encode Liquid values in JavaScript with `jsonify`, especially quoted titles. Validate with `bundle exec ruby scripts/test_course_landing_pages.rb` and a mobile navigation check.
* Course navigation state is owned by [_projects/systems/courses/js/player/course-navigation-state.js](_projects/systems/courses/js/player/course-navigation-state.js): preserve sections, scroll, and last document per course/panel. Blogs stays in the main pane while the last document is highlighted for resuming; do not redirect or change completion. Expand selected ancestors idempotently, never by toggling. Do not rebuild mobile navigation on resize. Test: `node --test tests/course_navigation_state.test.mjs`.
* Top-menu course entry uses [_projects/systems/courses/js/player/course-entry.js](_projects/systems/courses/js/player/course-entry.js) and `[data-course-entry]` to link directly to `/navigation/courses/<course>/` (Home/Announcements), not Blogs or the legacy chooser/catalog. Keep the last document highlighted in the navigation panel without redirecting to it. Blogs breadcrumbs show Home > selected course > Blogs. Persist `ocs-selected-course` on course visits; use enrolled selections for signed-in users and `_config.yml`'s `default_course` for new visitors. Test: `node --test tests/course_entry.test.mjs`.

* Sources live in [notebook sources](_notebooks/) and [docx sources](_docx/); converted Markdown is written to [generated posts](_posts/) (generated, do not hand-edit).
* Course-split outputs (`*_csp.md`/`*_csa.md`/`*_csse.md`/`*_content.md`) are generated; never edit them. See [scripts/split_multi_course_files.py](scripts/split_multi_course_files.py).
* Lesson player pages (each course's `/<course>/sprint-<n>/`, `/<course>/week-<w>/`, `/<course>/week-<w>/chat/`, and `/<course>/blogs/`) have no source files: [_projects/systems/courses/plugins/lesson_player_pages.rb](_projects/systems/courses/plugins/lesson_player_pages.rb) makes them at build time from the project's `data/<course>.yml`, with week and chat pages only for weeks that have lessons. Edit their bodies in [_projects/systems/courses/_includes/player-pages/](_projects/systems/courses/_includes/player-pages/); the links in [_projects/systems/courses/_includes/lesson-sidebar-nav.html](_projects/systems/courses/_includes/lesson-sidebar-nav.html) must use the same URLs. Test: `bundle exec ruby scripts/test_player_pages.rb`.
* Conversion behavior is defined in [scripts/convert_notebooks.py](scripts/convert_notebooks.py) and [scripts/convert_docx.py](scripts/convert_docx.py).
* Project notebooks (including GameBuilder) convert directly from `_projects/<category>/<project>/` into `_posts/projects/<project>/`. Old `_notebooks/projects/` copies are excluded from global conversion and splitting. The shared template uses one batch per project (at most four workers by default); `.notebook-conversion-cache/` invalidates on source/converter content or output changes, and identical Markdown is not rewritten. Use `CONVERT_FLAGS=--force` to force conversion. `make dev` no longer cleans or converts twice; restart watchers after pipeline changes. Generated Makefiles refresh untracked template copies but preserve tracked overrides; persistent changes belong in [_projects/_template/Makefile](_projects/_template/Makefile). Validate with `venv/bin/python -m unittest discover -s tests -p test_convert_notebooks.py`.
* CSA content belongs to registered projects under `_projects/lessons/` in ownership order `cs112 > cs113 > csa1 > csa2 > ds2`. Keep `notebooks/` and `docs/` flat, and preserve permalinks and `courses.csa.week` during migration. `articulation` records curriculum alignment, not earned credit. Drafts use `lesson_status: draft` and `planned_week` without `courses`: the timeline does not exclude lessons based on `hide`. See [_projects/REGISTRATION.md](_projects/REGISTRATION.md). Validate with `node --test tests/csa_curriculum.test.mjs`.
* CSA weeks 13-37 follow `_data/csa.yml`: at most three primary documents per instructional week. AP FRQ runners already aligned to CS112 may exceed the limit as `lesson_type: ap-practice` in matching instructional weeks. Use topic-first titles/filenames and preserve permalinks. Supplemental selections are in `tests/fixtures/csa_frq_practice.json`; primary selections are in `tests/fixtures/csa_week_schedule.json`. Other examples remain unscheduled references. Summative, AP-review, presentation, and finals weeks use checklists linking earlier lessons, not new assignments. `lesson_notes` exposes authoring gaps. After source moves, remove only confirmed orphan generated files so stale titles/weeks do not reappear.
* Keep AP FRQ category and historical question number separate: `ap_frq_category` is 1 methods/control, 2 class writing/design, 3 arrays/ArrayLists, or 4 2D arrays; `ap_exam_year`/`ap_exam_question` preserve historical identity. Use titles such as `FRQ 3 - Array or ArrayList Manipulation - 2017 Exam Q1 - CS112`. Audit actual exercise requirements, not old titles or exam ordering. Older questions can span skills; the nine-point category description does not change historical scoring guides. Frontmatter descriptions must be plain text without Liquid or `#`: cards do not recursively render variables, and the converter's unquoted YAML output truncates comments.
* The CS112/CS113 reports follow MiraCosta's original five sections and Lab Outline through `_data/cs112_topics.json` and `_data/cs113_topics.json`, sharing `curriculum-outline-report.html` and matching stable permalinks rather than filenames or AP categories. Show current titles/weeks, gaps, and PBL extensions; clearly label unfinished drafts. New unmapped lessons remain visible and deleted lessons do not create dead links. CS113 from-scratch layers are differentiated extensions; library use is not implementation mastery. Update mappings and coverage notes with source additions/removals. Validate with `bundle exec ruby scripts/test_cs112_report.rb` and `bundle exec ruby scripts/test_cs113_report.rb`.

### Project Registry & Styling
* College report topics may include Java library permalinks in `supporting_lessons`, separate from owned `lessons`. Keep Java source ownership, articulation metadata, and weeks unchanged; label supporting references and link `/navigation/java-reference/` in curriculum navigation. Audit existing Java coverage before declaring gaps. Validate with `bundle exec ruby scripts/test_java_curriculum_references.rb`.

* Flask sources belong to [_projects/lessons/flask/](_projects/lessons/flask/) with flat `notebooks/` and `docs/`. Keep `categories: [flask]` for Topics and preserve map `/python/flask/csp/`. The API hub `/python/flask/api` links only Jokes (CSP Week 9), Users (Week 10), and Microblog (Week 11); then students read Flask source for further API learning. Teach VS Code REST Client with the backend's shared `baseUrl`, prompted authentication, and `.http` files, not Postman. Trace users (`api/user.py`, `model/user.py`), jokes (`hacks/joke.py`, file-backed `hacks/jokes.py`), and microblog (`api/microblog_api.py`, `model/microblog.py`); distinguish manual checks from automated tests. Detailed model/SQL teaching belongs in a separate series. Retired API material is reviewed in the non-published `API_MATERIAL_REVIEW.md`; do not recreate duplicate API tutorials. Non-API Flask references remain. Publish docs before splitting the multi-course map. Test: `bundle exec ruby scripts/test_flask_project.rb`.
* New projects must follow [_projects/REGISTRATION.md](_projects/REGISTRATION.md); architecture reference in [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md).
* Use SCSS-first styling; theme and styling conventions are in [README.md](README.md).
* Theme presets ([assets/js/user-preferences.js](assets/js/user-preferences.js)) set every `span`, `div`, `p`, `li`, and heading to the theme's text color with `!important`. Put a button's icon and label straight inside the `ocs__btn`, like the Submit buttons in [_layouts/post.html](_layouts/post.html), not in a `<span>`; otherwise a `fill` button's label takes the theme's text color and can become unreadable.
* Profile (`/profile`) is the system kit [_projects/systems/profile/](_projects/systems/profile/README.md); edit its sources, not the published copies (`_layouts/profile.html`, `assets/js/profile/`, `navigation/authentication/profile.md`). `layouts/profile.html` is markup only (OCS grammar, no page stylesheet); its starter script imports the shared helpers (`assets/js/api/config.js`, `assets/js/api/profile.js`) with `{{ site.baseurl }}` and passes them to `initProfilePage(api)`, so the modules import each other only with `./` paths; don't add `../` imports. `/profile/v2` redirects to `/profile`. See [its architecture](_projects/systems/profile/docs/ARCHITECTURE.md). Record a form's loaded values only after the asynchronous load fills the fields: comparing against the still-empty fields made Save re-send every field, the User ID included, and show the "you will be logged out" alert. Save a field to Flask (`PUT /api/user`) and, when `springEnabled` (`spring` in `_config.yml`) is true, to Spring (`POST /api/person/update`), with the shared `putUpdate`/`postUpdate`, which resolve to true or false, and await both. A Flask-only site (`spring: false`) makes no Spring calls from Profile, sign-up, sign-in, logout or the navbar's DM bell; `config.js` and the profile page have `regenerate: true`, so incremental builds pick up a change to `spring`. Tests: `node --test tests/profile_model.test.mjs tests/test_gist_connection.mjs`.
* Messages (`/dm`) shows groups and direct messages on one page; its source is [_projects/systems/messages/](_projects/systems/messages/README.md), registered as `systems/messages:dev`, and `/student/groups/` and `/student/groups/dashboard/` redirect to it. The page is OCS grammar plus the `.announcement-chat` classes the course chats share; it has no stylesheet of its own, and its one layout class, `ocs__split--aside`, is in the grammar. Its modules import each other with `./` only; the page imports `config.js` and `rich-text.js` with `{{ site.baseurl }}` and passes them to `startMessagesPage`. It sends over REST and only receives on the socket (`/topic/dm/{id}`, `/topic/group/{id}`). A saved group message stores only the sender's display name, which Spring checks before an edit or delete, so group messages are sent with the account's name and matched by it. Course chat groups (`lessons`, `<course>-announcements`, `<course>-week-<n>`) never show in Find a group, and class groups (CSSE, CSP, CSA, CSH) have no Leave or Delete, and no Join in Find a group, because Profile classes manage them. Only site admins delete other groups, from the bottom of Members, after typing the group's name. Spring's `DELETE /api/groups/{id}` doesn't check for an admin; it also deletes the group's grades and the assignments it submitted, but leaves its chat and files in S3 under its name. Test: `node --test _projects/systems/messages/tests/*.test.mjs`.
* Do not put `var(--panel)` or color values in a Mermaid `style` line: parentheses are parsed as node syntax. [_includes/mermaid.html](_includes/mermaid.html) reads the preference variables, and the `.mermaid` rules in [user-preferences.scss](_sass/open-coding/theme/user-preferences.scss) keep diagrams in sync after a theme change.

### Backend Boundary

* The backend service lives under [node_backend/README.md](node_backend/README.md) and is separate from the site build pipeline; read it before making backend changes.

## Coding Standards

### Naming Conventions

Names should:

* Explain *intent*, not implementation.
* Avoid abbreviations unless standard.
* Be consistent across the codebase.
* Example: Use `normalizeUserTransactionData()` instead of `procData2()`.

### Error Handling

* **Fail Fast:** Validate inputs early, raise errors immediately with clear messages, and don't silently ignore failures.
* **Defensive Programming:** Assume inputs are invalid or malicious, add guards for edge cases, and never trust external data sources.
* **Discipline:** Never swallow exceptions silently. Always include context in errors and use typed/custom errors where appropriate.

### Logging Rules

* Log meaningful events, not noise.
* Logs should answer: *what happened and why?*
* Avoid logging sensitive data.

## Testing Rules

* Flask Markdown publication mirrors sources into `_posts/projects/flask/docs/` (not `_posts/flask/docs/`) so the shared project cleanup and ignore rules apply. Verify migration, cleanup, and republication with `bundle exec ruby scripts/test_course_distribution.rb`; edit sources under `_projects/lessons/flask/docs/`, never generated copies.

* **GameEnginev1.1 keyboard tests:** Scroll prevention belongs directly in [Player.js](assets/js/GameEnginev1.1/essentials/Player.js); keep game-specific input guards in subclasses. Reuse [keyboard-test-helper.mjs](assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs) for synthetic keydown/keyup tests of real Player/subclass movement, without constructors or browser globals. Use `@assets` for shared test imports, preloading [register-assets.mjs](assets/js/GameEnginev1.1/test/register-assets.mjs); do not inject replacement engine source or change aliases to source-relative paths (project builds relocate modules). Usage and limits: [test README](assets/js/GameEnginev1.1/test/README.md). Run `node --import ./assets/js/GameEnginev1.1/test/register-assets.mjs --test assets/js/GameEnginev1.1/test/*.test.mjs _projects/games/racing-game/tests/racing-player.test.mjs` (Node 22.15+); browser checks are still needed for rendering, listeners, and actual scrolling.

### Behavior-driven Tests

* Tests should describe behavior, not implementation.
* Every critical logic path should be testable.
* Prefer unit tests for logic, integration tests for flows.

### Critical Path Coverage Required

* **Agent rule:** If code changes behavior, update or add tests.
* Ensure deterministic behavior (avoid randomness unless explicitly required, fix seeds when needed).

## Agent Behavior Rules

### Plan Before Coding

* For non-trivial tasks: write a short plan before coding.
* Break into steps before implementation.

### Minimize Diffs

* Prefer minimal diffs over refactors unless required.
* Don’t rewrite working code without reason.

### Follow Existing Patterns

* Match existing codebase style and structure.
* Don’t introduce new architecture unless necessary.
* **Verify Assumptions:** If unclear, infer cautiously and flag assumptions. Never silently guess critical requirements.

### Self-Updating and Continuous Learning

* **Update this file:** As you iterate, make mistakes, and learn new system patterns or constraints, actively update `AGENTS.md` (and its optimized counterpart) with important notes so the system improves over time.

## Anti-Patterns

### God Functions

* Avoid functions that do too many things. Stick to SRP.

### Hidden Side Effects

* Ensure predictability by keeping side effects explicit and well-documented.

### Over-engineering

* **YAGNI (You Aren’t Gonna Need It):** Don’t build features unless required now. Avoid speculative generalization.
* Optimize only after correctness is guaranteed (Profile before optimizing).
