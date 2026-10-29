# UI Builder

The UI Builder lets a student build a page on this site from parts instead of HTML: page
headers, cards, numbers, tables and link cards from the shared `ocs__` grammar, live
communication blocks (group chat, announcements, message us, team members, class calendar,
kanban board, visitor feedback) and project blocks (data from your own API, your app). A CSP
team can put its project, its board, its chat and its live Flask data on one page, publish it
for the class, and have a teacher approve it for everyone on showcase night.

See [UI Builder architecture](docs/ARCHITECTURE.md) for how it fits together, the safety rules,
the backend routes and the tests.

## Flask only or Flask + Spring

`spring` in `_config.yml` decides, as for Profile and login:

- `spring: false` (OCS for Business): pages save in the browser and are shared as a page file
  or JSON. Blocks that need Spring (chat, members, message us, announcements, calendar) are
  turned off in the block menu.
- `spring: true` (OCS for Education, this site): pages save to Spring's `mvc/uibuilder`, team
  members edit together, and published pages show at `/ui-builder/view/?page=<address>` and in
  `/ui-builder/gallery/`.

## Try it

1. Run Spring (`./mvnw spring-boot:run`, ports 8585 and 8589) with the local cookie settings in
   its `.env` (`jwt.cookie.secure=false`, `jwt.cookie.same-site=Lax`).
2. Build this site and open it on `http://localhost:4500` (or 4600): `localhost`, not
   `127.0.0.1`, because the local login cookie is for the host name.
3. Sign in, open `/ui-builder/`, pick a template (try **Flask API starter**), press
   **Test connection** in "Data from your API", then **Publish**.

## Files

| Source | Published to | What it is |
|---|---|---|
| `data/ui_builder.yml` | `_data/ui_builder.yml` | the registry: blocks, fields, limits, templates, every string |
| `data/ui_builder_school.yml` | `_data/ui_builder_school.yml` | the school pack: courses, announcements and calendar blocks, CSP templates |
| `data/ui_builder_editor.yml` | `_data/ui_builder_editor.yml` | the editor's strings |
| `pages/*.md` | `navigation/ui-builder/` | the editor, canvas, viewer and gallery pages |
| `layouts/ui-builder-canvas.html` | `_layouts/` | the canvas frame: the site head and theme, no navbar |
| `_includes/ui_builder_data.html` | `_includes/projects/ui-builder/` | the registry and widget data as JSON scripts |
| `js/*.js` | `assets/js/projects/ui-builder/` | the modules (pure ones are tested with Node) |
| `sass/` | `_sass/projects/ui-builder/` | the editor and canvas chrome only, scoped under `.ocs__uibuilder` |
| `docs/ARCHITECTURE.md` | `/systems/ui-builder/architecture/` | how it works |

Edit the sources here, never the published copies. The modules import each other only with
`./`; each page imports `config.js`, `rich-text.js` and the other systems' modules with
`{{ site.baseurl }}` and passes them in.

## Other systems it uses

| System | What the UI Builder calls |
|---|---|
| Messages | `conversation-embed.js` `mountGroupChat` / `mountConversation` |
| Courses | `calendar-card.js` `createCalendarCardSection` / `mountCalendarCard`, `ocs_calendar_card.html template=true`, `ocs_calendar_card_data.html` |
| Kanban (root) | `kanban-board.js` `createKanbanSection` / `mountKanbanBoard` / `parseBoardUrl`, `ocs_kanban_board.html template=true`, `ocs_kanban_board_data.html` |
| Chat rich text | `rich-text.js` `createRichComposer({enterKey: 'newline'})`, `renderRichMessage` |
| Grammar | `ocs__split--aside-end` and `ocs__embed` (added for this system) |

## A page presents a project; it isn't the project

A builder page shows a team's work. It is not their CPT program: the College Board doesn't
count builder output as a student-developed procedure. "Show code" in "Data from your API"
gives the equivalent `fetch` code with a comment saying the UI Builder generated it, so a
student who reuses it can say so.

## Tests

```bash
node --test _projects/systems/ui-builder/tests/*.test.mjs
bundle exec ruby scripts/test_ui_builder.rb
```
