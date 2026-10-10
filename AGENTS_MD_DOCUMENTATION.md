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
* **Cross-origin APIs:** Spring endpoints consumed from `pages.opencodingsociety.com` should explicitly allow credentialed cross-origin requests.
* **Documentation:** Create detailed documentation for difficult or complex implementations as necessary.
* **Commenting:** Add comments for non-trivial logic, but keep them minimal and focused on *why* rather than *what*.
* **Ask Questions:** If system-level constraints, requirements, or patterns are unclear, pause and ask the user questions before proceeding.

### Project Workflow

* Treat [Makefile](Makefile) as the single source of truth; common targets are `make`/`make serve-current`, `make dev`, `make stop`, `make convert`, and `make convert-single` (details in [README.md](README.md)).
* Order matters: stop → build projects → convert notebooks/docx → split courses → jekyll serve (follow [Makefile](Makefile)).
* Project builds must run the [SASS import generator](scripts/generate_sass_imports.py) to create `_sass/projects/_all.scss`; `build-registered-projects` owns this dependency so Jekyll can resolve `projects/all`.
* Use template-generated project Makefiles. Do not add local npm manifests, `.gitignore` files or Makefile overrides for shared browser libraries. Keep shared runtime libraries in `assets/js/vendor/` with licenses and version documentation; ordinary builds need no npm installation.

### Sources vs Generated Files

* Sources live in [notebook sources](_notebooks/) and [docx sources](_docx/); converted Markdown is written to [generated posts](_posts/) (generated, do not hand-edit).
* Course-split outputs (`*_csp.md`/`*_csa.md`/`*_csse.md`/`*_content.md`) are generated; never edit them. See [scripts/split_multi_course_files.py](scripts/split_multi_course_files.py).
* Lesson player pages (each course's `/<course>/sprint-<n>/`, `/<course>/week-<w>/`, `/<course>/week-<w>/chat/`, and `/<course>/blogs/`) have no source files: [_plugins/lesson_player_pages.rb](_plugins/lesson_player_pages.rb) makes them at build time from `_data/<course>.yml`, with week and chat pages only for weeks that have lessons. Edit their bodies in [_includes/player-pages/](_includes/player-pages/); the links in [_includes/lesson-sidebar-nav.html](_includes/lesson-sidebar-nav.html) must use the same URLs. Test: `bundle exec ruby scripts/test_player_pages.rb`.
* Conversion behavior is defined in [scripts/convert_notebooks.py](scripts/convert_notebooks.py) and [scripts/convert_docx.py](scripts/convert_docx.py).
* Project notebooks (including GameBuilder) convert directly from `_projects/<category>/<project>/` into `_posts/projects/<project>/`. Old `_notebooks/projects/` copies are excluded from global conversion and splitting. The shared template uses one batch per project (at most four workers by default); `.notebook-conversion-cache/` invalidates on source/converter content or output changes, and identical Markdown is not rewritten. Use `CONVERT_FLAGS=--force` to force conversion. `make dev` no longer cleans or converts twice; restart watchers after pipeline changes. Generated Makefiles refresh untracked template copies but preserve tracked overrides; persistent changes belong in [_projects/_template/Makefile](_projects/_template/Makefile). Validate with `venv/bin/python -m unittest discover -s tests -p test_convert_notebooks.py`.
* CSA content belongs to registered projects under `_projects/lessons/` in ownership order `cs112 > cs113 > csa1 > csa2 > ds2`. Keep `notebooks/` and `docs/` flat, and preserve permalinks and `courses.csa.week` during migration. `articulation` records curriculum alignment, not earned credit. Drafts use `lesson_status: draft` and `planned_week` without `courses`: the timeline does not exclude lessons based on `hide`. See [_projects/REGISTRATION.md](_projects/REGISTRATION.md). Validate with `node --test tests/csa_curriculum.test.mjs`.
* CSA weeks 13-37 follow `_data/csa.yml`: at most three primary documents per instructional week. AP FRQ runners already aligned to CS112 may exceed the limit as `lesson_type: ap-practice` in matching instructional weeks. Use topic-first titles/filenames and preserve permalinks. Supplemental selections are in `tests/fixtures/csa_frq_practice.json`; primary selections are in `tests/fixtures/csa_week_schedule.json`. Other examples remain unscheduled references. Summative, AP-review, presentation, and finals weeks use checklists linking earlier lessons, not new assignments. `lesson_notes` exposes authoring gaps. After source moves, remove only confirmed orphan generated files so stale titles/weeks do not reappear.
* Keep AP FRQ category and historical question number separate: `ap_frq_category` is 1 methods/control, 2 class writing/design, 3 arrays/ArrayLists, or 4 2D arrays; `ap_exam_year`/`ap_exam_question` preserve historical identity. Use titles such as `FRQ 3 - Array or ArrayList Manipulation - 2017 Exam Q1 - CS112`. Audit actual exercise requirements, not old titles or exam ordering. Older questions can span skills; the nine-point category description does not change historical scoring guides. Frontmatter descriptions must be plain text without Liquid or `#`: cards do not recursively render variables, and the converter's unquoted YAML output truncates comments.
* The CS112/CS113 reports follow MiraCosta's original five sections and Lab Outline through `_data/cs112_topics.json` and `_data/cs113_topics.json`, sharing `curriculum-outline-report.html` and matching stable permalinks rather than filenames or AP categories. Show current titles/weeks, gaps, and PBL extensions; clearly label unfinished drafts. New unmapped lessons remain visible and deleted lessons do not create dead links. CS113 from-scratch layers are differentiated extensions; library use is not implementation mastery. Update mappings and coverage notes with source additions/removals. Validate with `bundle exec ruby scripts/test_cs112_report.rb` and `bundle exec ruby scripts/test_cs113_report.rb`.

### Project Registry & Styling
* College report topics may include Java library permalinks in `supporting_lessons`, separate from owned `lessons`. Keep Java source ownership, articulation metadata, and weeks unchanged; label supporting references and link `/navigation/java-reference/` in curriculum navigation. Audit existing Java coverage before declaring gaps. Validate with `bundle exec ruby scripts/test_java_curriculum_references.rb`.

* New projects must follow [_projects/REGISTRATION.md](_projects/REGISTRATION.md); architecture reference in [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md).
* Use SCSS-first styling; theme and styling conventions are in [README.md](README.md).
* Theme presets ([assets/js/user-preferences.js](assets/js/user-preferences.js)) set every `span`, `div`, `p`, `li`, and heading to the theme's text color with `!important`. Put a button's icon and label straight inside the `ocs__btn`, like the Submit buttons in [_layouts/post.html](_layouts/post.html), not in a `<span>`; otherwise a `fill` button's label takes the theme's text color and can become unreadable.

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
