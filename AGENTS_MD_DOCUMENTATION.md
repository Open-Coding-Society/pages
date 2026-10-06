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
* Conversion behavior is defined in [scripts/convert_notebooks.py](scripts/convert_notebooks.py) and [scripts/convert_docx.py](scripts/convert_docx.py).
* GameBuilder lesson notebooks are authored in [_projects/systems/gamebuilder/notebooks/](_projects/systems/gamebuilder/notebooks/); `_notebooks/projects/gamebuilder/` contains build copies. Project Makefiles are generated from [_projects/_template/Makefile](_projects/_template/Makefile), so persistent build/watch fixes belong in the template. Use a subshell for `cd` inside conversion loops so processing several notebooks does not change the loop's working directory.

### Project Registry & Styling

* New projects must follow [_projects/REGISTRATION.md](_projects/REGISTRATION.md); architecture reference in [_projects/ARCHITECTURE.md](_projects/ARCHITECTURE.md).
* Use SCSS-first styling; theme and styling conventions are in [README.md](README.md).

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

## Mentor Feature & the Capstone Page

* **Role source:** `ROLE_MENTOR` is defined on the Spring side (external repo `Open-Coding-Society/spring`), not in this repo; Flask's role model is a single string column (no `ROLE_MENTOR`). The frontend always checks mentor status via `GET {javaURI}/api/person/get` and `roles.some(r => r.name === 'ROLE_MENTOR')` (same pattern as `getCredentialsJava()` in `_includes/nav/homejava.html`) — don't build a parallel role check on the Flask side.
* **Student/Mentor view is derived, not chosen:** there is no login-time Student/Mentor toggle — a prior version had one (`ocsLoginRole` in `localStorage`) and it was removed as redundant with the signup form's own role selector. Use `viewFor(roles)` from `assets/js/api/role-view.js` to decide the view — it's purely `roles.includes('ROLE_MENTOR')`, since Spring's real role is the only source of truth. The mentor sidebar is the student sidebar minus `bathroom_pass` (via the `exclude` param of `_includes/aesthetihawk/sidebar-list.html`) plus `_data/aesthetihawk_sidebar_mentor.yml`; Bathroom Pass UI (sidebar, toolkit button, profile facial registration) must stay hidden in the mentor view. The sidebar choice is still cached client-side in `localStorage` (`ocsMentorSidebar`, cleared on logout via `clearMentorSidebarCache()`) purely to avoid a flash of the wrong sidebar before the async role check resolves — that's a rendering optimization, not a second source of truth.
* **The mentor verification backend lives in `~/spring-admin` (CSA-Admin-OCS/spring), not `~/spring`:** mentor signup is `POST /api/person/create` with `accountType: "mentor"` and a required `businessEmail` → `ROLE_PENDING` + a `MentorTicket`; an admin approves it under "Mentor Approval Requests" on `/mvc/person/read` → `ROLE_MENTOR`. At login, `ROLE_PENDING` plus a pending `GET /api/person/mentor/ticket/status` → `/login` shows "Verification Pending" and logs out of Spring. Real access control is Spring's `SecurityConfig` (`ROLE_PENDING` can only reach `/api/person/get`, the ticket-status endpoint and logout). The Student/Mentor selector at the top of `/login` (two `ocs__btn pill` buttons with `data-account-role`; the selected one gets `accent fill`; styles live in `_sass/open-coding/elements/forms/login-role.scss`, built on the OCS `info-panel` mixin and theme variables, with no inline styles on the page. Gotchas: the theme forces `color: ... !important` on every `<p>`, so text needing its own color must be a `<div>`; a global `.error { padding: 20px }` leaks onto `.validation-message.error`) only switches the signup form: mentors skip student ID, school and the Google step and sign up straight to Spring via `signupMentor()` (Flask has no mentor accounts); the student flow is unchanged; the navbar login state (`assets/js/api/login.js`) checks Flask `/api/id` first and falls back to Spring `/api/person/get`, so Spring-only mentors show their name; the mentor banner (`status-indicators/mentor-badge.scss`) sits in normal page flow right under the header; and a student who exists only in Flask (no Spring row) still logs in to `/profile` on a Flask success.
* **Mentors only get project access after approval:** Apply on `/capstone` only creates a pending `CapstoneApplication` (the button shows Pending approval / Approved ✓ / Not approved, from `GET /api/capstones/mine` and `/applications/mine`). Once an admin approves it on Spring's `/mvc/capstone/read`, the mentor is attached to the project (Approved ✓ on the card, card Chat) and, if the admin linked the project to a student group in that page's "Student Group" column (`PUT /api/capstones/{id}/group`), also becomes that group's mentor, which is what lets them message the students from the card's Chat button. Removing the mentor or unlinking the group revokes that group access (`CapstoneGroupLinkService`).
* **Mentor project chat (dashboard Messages tab + capstone card Chat):** both use `assets/js/chat/groupChatPanel.js`, which looks exactly like the course announcement/weekly chat (same `.announcement-chat` markup, styled by `forms/course-chat.scss`, copied verbatim from the lessons branch's courses Sass -- delete that partial once lessons is merged; the rich-text composer `assets/js/chat/rich-text.js` is also copied from lessons). The dashboard Messages tab (`assets/js/aesthetihawk/dashboard/mentorCapstoneChat.js`) shows only in the mentor view and only when the mentor has at least one approved project (`GET /api/capstones/mine`); each project opens its linked student group's chat, or a notice if no group is linked yet. The card's "Mentors (n)" / "💬 Chat" buttons are in `assets/js/capstone/cardTools.js`. Sending uses REST `POST /api/groups/chat/{id}/messages` (checks member-or-mentor); live updates use SockJS/STOMP `/topic/group/{id}`. Note the STOMP `/app/groups.chat` route itself does no membership check (the weekly chats rely on that). Group messages are stored in S3, so without AWS config locally they are delivered live but not kept.
* **Mentor accounts can switch to the student view:** the mentor banner (`_layouts/aesthetihawk.html`) and the navbar name dropdown (`assets/js/api/login.js`) both have a "Switch to student view / Switch to mentor view" button that calls `switchView(roles)` in `role-view.js`, which stores the choice in `localStorage` (`ocsViewAs`) and reloads. `viewFor(roles)` is 'mentor' only for a `ROLE_MENTOR` account that hasn't chosen the student view. In the student view: the normal student sidebar, no capstone Apply/Skip/Interested, no My Projects or mentor Messages. It's presentation only (Spring still decides permissions), and `clearRoleViewCache()` resets it to the account's own view at login and logout.
* **Mentor Apply/Skip/Interested actions live inline in `navigation/capstone.md`:** the always-visible action row at the bottom of each project card (Apply Now / Interested / Skip), gated on a live `ROLE_MENTOR` check (buttons are `ocs__btn`; layout and card states, plus the "Links" menu every visitor sees, live in `_sass/open-coding/elements/grids/capstone-cards.scss`), are an inline `<script type="module">` at the top of that file (not a separate `assets/js/*.js` file). A project's identity is its normalized page URL (`cardUrl()`), matched against `capstone/projects.json` (a generated, machine-readable project list synced to the Spring backend by `scripts/sync_capstones.py`) to resolve the numeric id `POST {javaURI}/api/capstones/{id}/apply` needs. Interested/Skip have no backend endpoint — they're tracked per-browser in `localStorage` (`ocsMentorInterested` / `ocsMentorSkipped`).
* **The capstone page's "create/edit capstone" flow has no real backend persistence yet:** the inline "create/edit capstone" flow in `assets/js/new-capstone.js` and `navigation/capstone.md` only writes to `sessionStorage`. Before adding any "save to account" feature, check whether the Spring endpoint actually exists; if not, follow the mentor-actions pattern above — `localStorage` cache plus a best-effort remote sync, with failures logged via `console.error`/`console.warn` (never swallowed silently) — and document the needed endpoint contract.
* **Reuse the microblog for comments:** for any "add comments to an entity" feature, prefer the existing `assets/js/api/microblog.js` (Flask `/api/microblog`) with a custom `topicPath` (e.g. `capstone:<slug>`) to scope it, rather than building a new comment backend. If you want the full slide-out panel UI, note `_includes/microblog_foundation.html` is shared by several pages — prefer a small dedicated component calling the same API over editing that include directly.

## Anti-Patterns

### God Functions

* Avoid functions that do too many things. Stick to SRP.

### Hidden Side Effects

* Ensure predictability by keeping side effects explicit and well-documented.

### Over-engineering

* **YAGNI (You Aren’t Gonna Need It):** Don’t build features unless required now. Avoid speculative generalization.
* Optimize only after correctness is guaranteed (Profile before optimizing).
