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

`spring` in `_config.yml` decides, as for Profile and login. Each page reads it once, as
`config.js` `springEnabled`, and picks where pages are kept:

- `spring: false` (OCS for Business): pages save in the browser and are shared as a page file
  or JSON. Blocks that need Spring are turned off in the block menu: group chat, team members,
  message us, class announcements, class calendar and visitor feedback. Feedback posts go to
  Flask, but they are filed under the page's published address, and only Spring publishes.
- `spring: true` (OCS for Education, this site): pages save to Spring's `mvc/uibuilder`, team
  members edit together, and published pages show at `/ui-builder/view/?page=<address>` and in
  `/ui-builder/gallery/`.

## Try it

1. Run Spring (`./mvnw spring-boot:run`, ports 8585 and 8589) with the local cookie settings in
   its `.env` (`jwt.cookie.secure=false`, `jwt.cookie.same-site=Lax`).
2. Build this site with a full `make` and open it on `http://localhost:4500` (or 4600):
   `localhost`, not `127.0.0.1`, because the local login cookie is for the host name. The
   UI Builder is registered without `:dev` (it has many files), so `make dev` leaves it out.
3. Sign in, open `/ui-builder/`, pick a template (try **Flask API starter**), press
   **Test connection** in "Data from your API", then **Publish**.
4. Press **Code** in the editor's bar to see the page's HTML, block by block, and **Preview** to
   go back.

## Files

| Source | Published to | What it is |
|---|---|---|
| `data/ui_builder.yml` | `_data/ui_builder.yml` | the registry: blocks, fields, limits, templates, every string |
| `data/ui_builder_school.yml` | `_data/ui_builder_school.yml` | the school pack: courses, announcements and calendar blocks, CSP templates |
| `data/ui_builder_editor.yml` | `_data/ui_builder_editor.yml` | the editor's strings |
| `pages/*.md` | `navigation/ui-builder/` | the editor, canvas, viewer and gallery pages |
| `layouts/ui-builder-canvas.html` | `_layouts/` | the canvas frame: the site's styles and theme, nothing else from the site head |
| `_includes/ui_builder_data.html` | `_includes/projects/ui-builder/` | the registry and widget data as JSON scripts |
| `js/*.js` | `assets/js/projects/ui-builder/` | the modules (the next table) |
| `sass/` | `_sass/projects/ui-builder/` | the editor and canvas chrome, scoped under `.ui-builder` and `.ui-builder-canvas`, plus two rules for published pages and the gallery: one keeps their titles visible, one fits the grammar's badge into the viewer's bar |
| `docs/ARCHITECTURE.md` | `/systems/ui-builder/architecture/` | how it works |

The modules, by job:

| Modules | Job |
|---|---|
| `editor-*.js` | the editor at `/ui-builder/`. `editor-app.js` starts it and opens the start screen or a page; the others are the start screen, the editing shell, the outline, the inspector and its fields, the block menu, the dialogs, the shortcuts and saving |
| `canvas.js`, `canvas-bridge.js` | the preview inside the editor: the page drawn in its iframe, and the editor's side of the connection |
| `editor-code.js`, `pretty-html.js` | the code view in the preview's place: the page-file HTML block by block, indented and colored like lesson code, with what each block's markup does and the `ocs__` classes it uses |
| `page-store.js`, `spring-page-store.js`, `draft-store.js` | the stores: pages kept in this browser or in Spring, and the crash copy of the page being edited |
| `render.js`, `vnode.js`, `rich-content.js` | turning a page into `ocs__` markup through an allowlist (a fixed list of allowed tags and attributes) |
| `blocks-content.js`, `blocks-live.js`, `blocks-project.js` | each block's markup, the live blocks, and Data from your API with the click-to-load video and app cards |
| `viewer.js` | one page at `/ui-builder/view/` |
| `gallery.js` | the published pages at `/ui-builder/gallery/` |
| the rest | pure helpers, tested with Node: the registry, the page model and its rules, reading rich text as Spring's jsoup does, the address rules, undo history, autosave, reading API data and the page-file export |

Edit the sources here, never the published copies. The modules import each other only with
`./`; each page imports `config.js`, `rich-text.js` and the other systems' modules with
`{{ site.baseurl }}` and passes them in.

## Other systems it uses

| System | What the UI Builder calls |
|---|---|
| Messages | `conversation-embed.js` `mountGroupChat` (group chat, and class announcements read-only); `messages-model.js` `isClassGroup` / `isCourseChannel` |
| Courses | `calendar-card.js` `createCalendarCardSection` / `mountCalendarCard`, `ocs_calendar_card.html template=true`, `ocs_calendar_card_data.html`; `calendar-model.js` `extractEventMarkers` (events in announcements) |
| Kanban (root) | `kanban-board.js` `createKanbanSection` / `mountKanbanBoard` / `parseBoardUrl`, `ocs_kanban_board.html template=true`, `ocs_kanban_board_data.html` |
| Flask microblog | `microblog.js` `createPost` to post feedback; Flask's public `GET /api/microblog/page/<key>` to read it |
| Chat rich text | `rich-text.js` `createRichComposer({enterKey: 'newline'})`, `renderRichMessage` |
| Grammar | `ocs__split--aside-end` and `ocs__embed` (added for this system) |

## A page presents a project; it isn't the project

A builder page shows a team's work. It is not their CPT program: the College Board doesn't
count builder output as a student-developed procedure. "Show code" in "Data from your API"
gives `fetch` code that reads the same items the block reads, with a comment saying the UI
Builder generated it, so a student who reuses it can say so. When no list is picked, the code
finds the list the way the block does, so it works before Test connection too.

## Tests

```bash
node --test _projects/systems/ui-builder/tests/*.test.mjs
bundle exec ruby scripts/test_ui_builder.rb
node --test tests/ui_builder.test.mjs
```

The last one runs the same Node tests from the site's `tests/` folder. It imports the test
files one by one, so a new test file is added there too.
