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

### Sources vs Generated Files

* Sources live in [notebook sources](_notebooks/) and [docx sources](_docx/); converted Markdown is written to [generated posts](_posts/) (generated, do not hand-edit).
* Course-split outputs (`*_csp.md`/`*_csa.md`/`*_csse.md`/`*_content.md`) are generated; never edit them. See [scripts/split_multi_course_files.py](scripts/split_multi_course_files.py).
* Conversion behavior is defined in [scripts/convert_notebooks.py](scripts/convert_notebooks.py) and [scripts/convert_docx.py](scripts/convert_docx.py).

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
* **Mentor Apply/Skip/Interested actions live inline in `navigation/capstone.md`:** the hover actions on each project card, gated on a live `ROLE_MENTOR` check, are an inline `<script type="module">` at the top of that file (not a separate `assets/js/*.js` file). A project's identity is its normalized page URL (`cardUrl()`), matched against `capstone/projects.json` (a generated, machine-readable project list synced to the Spring backend by `scripts/sync_capstones.py`) to resolve the numeric id `POST {javaURI}/api/capstones/{id}/apply` needs. Interested/Skip have no backend endpoint — they're tracked per-browser in `localStorage` (`ocsMentorInterested` / `ocsMentorSkipped`).
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
