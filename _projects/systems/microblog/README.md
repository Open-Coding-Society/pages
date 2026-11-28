# Microblog

Microblog provides page-scoped posts, replies, surveys, search, notifications,
guest access and phone reviews. It is registered as `systems/microblog:dev` so
the panel, styles and API modules are available in both `make` and `make dev`.
Edit the sources here, not the generated copies in the project directories.

## Boundaries

- `navigation/microblog_foundation.html` publishes to `_includes/projects/microblog/`.
  The site shell includes it for `microblog: true` and for team-taught assignments.
  The Courses reader puts its toggle in the toolbar; other pages use the floating
  toggle. Lesson Feedback supplies the Ratings tab for team-taught assignments.
- `js/` publishes to `assets/js/projects/microblog/`, including the
  Jekyll-generated notification index. The modules use the shared API
  configuration and Login's published password helpers.
- `js/microblog-topic.js` (`MicroblogTopic`, no imports) is the one copy of
  Flask's page key (`Topic._generate_page_key`) and reads a page topic's newest
  posts from Flask's public `GET /api/microblog/page/<key>` (`latest`), where a
  404 means nobody has posted yet and a read gives up after 15 seconds. It also
  holds the rules for showing a post on a public page: `firstName` (first names
  only), `timeOf` (Flask writes UTC without a zone) and `timeLabel`. The UI
  Builder's feedback block and the Events pages use it, so they read the topic
  the panel posts to and show its posts the same way.
- `sass/` publishes to `_sass/projects/microblog/`; the site stylesheet imports
  both files. `pages/review.md` publishes under `navigation/projects/microblog/`
  and keeps its `/review` permalink and QR guest flow.
- Flask owns the microblog API and stored posts. The shared QR library, site shell,
  Capstone cards and Login are dependencies, not Microblog sources.

The panel and review page use shared `ocs__` controls and theme tokens. Their SCSS
keeps Microblog-specific layout and survey styling; the QR code stays on white
for scanning. The floating panel uses the shared `overlay-panel` mixin; it has
no backdrop, so the document remains usable. Its header uses `ocs__card-header`
and its title uses `ocs__truncate`. Posts use `ocs__table--list`, replies use
`ocs__tree`, resolved labels use `ocs__status-pill`, and unread counts share
the notification badge with the message bell. Survey vote bars remain custom.

## Verification

Run `bundle exec ruby scripts/test_system_project_distribution.rb` for publication,
cleanup and republication. Run `node --test tests/microblog_*.test.mjs` for panel,
API, notifications, surveys, guest access and review behavior. Reader integration
is covered by `bundle exec ruby scripts/test_document_reader.rb`.
Restart project watchers after changing the shared Makefile template.