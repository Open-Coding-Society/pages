# Mentor Capstone Actions — API Contract

## What this is

On `/capstone/` ([navigation/capstone.md](navigation/capstone.md)), a logged-in mentor (`ROLE_MENTOR`)
hovering over a project card gets **Apply / Interested / Skip** buttons plus a
**💬 comment** button. Interested/Skipped picks show in a "Mentor Picks" widget
top-right. All of this is implemented client-side in
[assets/js/mentor-capstone.js](assets/js/mentor-capstone.js) and
[_sass/open-coding/elements/capstone/mentor-actions.scss](_sass/open-coding/elements/capstone/mentor-actions.scss).

The Spring backend for this lives in an external repo
(`Open-Coding-Society/spring`, `javaURI` in [assets/js/api/config.js](assets/js/api/config.js)),
not in this repo — so the endpoints below are a **contract for that repo to implement**,
not something built here. Until they exist, the frontend degrades gracefully: it
caches picks in `localStorage` per mentor and logs (not silently swallows) the
fetch failure, so the UI is fully testable ahead of the backend.

## Role check (already documented as live elsewhere)

`ROLE_MENTOR` was added to Spring Security between `ROLE_TEACHER` and `ROLE_ADMIN`
per the Assignment Resources Platform capstone
(`_includes/assignment-tracker-infograph.html`). The frontend checks it via the
existing `GET {javaURI}/api/person/get` call (same pattern as
[_includes/nav/homejava.html](_includes/nav/homejava.html)), looking for
`roles.some(r => r.name === 'ROLE_MENTOR')`. No new auth endpoint needed — reuse
this if it is already wired up; flag to the mentor-dashboard team
("Backend Boyz"/"Los Chuds") if a `/api/authenticate/mentor` /
`/api/person/mentor/projects` overlap needs coordinating so we don't build two
parallel systems.

## New endpoints needed

### `GET {javaURI}/api/capstone/mentor/status`

Returns every status the **currently authenticated mentor** (session/cookie,
same as `/api/person/get`) has saved.

```json
[
  { "projectId": "sfi-foundation-2026-27", "projectTitle": "SFI Foundation 2026–27", "projectUrl": "/capstone/sfi-foundation/", "status": "INTERESTED", "updatedAt": "2026-09-20T18:00:00Z" }
]
```

- `status` is one of `APPLIED`, `INTERESTED`, `SKIPPED`.
- Auth required (`ROLE_MENTOR`); 401/403 if not a mentor.
- Scoped to the requesting mentor only — never return another mentor's picks.

### `PUT {javaURI}/api/capstone/mentor/status`

Upserts one record per `(mentor, projectId)`.

Request body:

```json
{ "projectId": "sfi-foundation-2026-27", "projectTitle": "SFI Foundation 2026–27", "projectUrl": "/capstone/sfi-foundation/", "status": "INTERESTED" }
```

Response: the saved record (same shape as the GET list items).

### `projectId` scheme

Capstone cards on the current page have no stable id in the markup — the
frontend derives one by slugifying the project title (lowercase, non-alphanumerics
collapsed to `-`; see `slugify()` in `mentor-capstone.js`). This is a known
fragility: **renaming a project's `<h3>` title changes its id**, which orphans
any previously saved mentor status for that project. If/when the ~90 cards in
`navigation/capstone.md` get an explicit `data-project-id`, switch the frontend
to read that instead (see `collectProjects()` in `mentor-capstone.js`) and this
endpoint's `projectId` should switch with it — no server-side change needed
either way, since it's an opaque string to the backend.

### CORS

Per the project's cross-origin rule, these endpoints must explicitly allow
credentialed cross-origin requests from `pages.opencodingsociety.com` (same as
the existing `/api/groups`, `/api/person/*` endpoints).

## Comments — no backend change needed

Per-project comments reuse the existing Flask microblog API
([assets/js/api/microblog.js](assets/js/api/microblog.js),
`{pythonURI}/api/microblog`) already used by
[_includes/microblog_foundation.html](_includes/microblog_foundation.html)
elsewhere on the site. Each project's comment thread is keyed by
`topicPath = "capstone:<projectId>"` (see `commentTopicPath()` in
`mentor-capstone.js`) instead of the page-wide `topicPath` the shared panel
normally uses. This is intentionally a separate, lightweight popover rather
than reusing the full slide-out microblog panel UI, to avoid touching the
shared include (which several other pages depend on).
