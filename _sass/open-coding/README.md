# Open Coding Sass Guide

This directory contains reusable Sass grammar for the Open Coding Society site.
Use these elements for new reusable UI before creating a project-specific style.

## Start with OCS grammar

OCS grammar is intended to help you build interesting pages with zero custom
CSS. Start with the existing classes and composition patterns. Add project CSS
only for an exceptional visual or interaction that the shared grammar cannot
express yet.

The examples are demonstrated in [`buttons.md`](../../_projects/lessons/sass/navigation/buttons.md) for buttons,
[`grids.md`](../../_projects/lessons/sass/navigation/grids.md) for grids, and
[`containers.md`](../../_projects/lessons/sass/navigation/containers.md) for container composition.

## Composition relationship

Think of the grammar as a page composition hierarchy:

```text
ocs__container
├── ocs__capstone-nav or ocs__links
├── ocs__badge
├── h1 page heading
├── ocs__description
├── ocs__card
│   ├── ocs__description, ocs__callout, or ocs__entity-list
│   ├── ocs__grid
│   │   └── ocs__grid-cell
│   │       ├── ocs__image-frame or image content
│   │       ├── text and status pills
│   │       └── ocs__btn actions
│   └── ocs__table-wrap
│       └── ocs__table
└── ocs__pager or footer content
```

A table is usually a content sibling of a grid inside a card, not a child of
the grid. Images belong inside the card or grid cell that explains them. Buttons
belong beside the content they act on, while navigation buttons belong in an
`ocs__links` group or a capstone navigation wrapper.

Example composition, also demonstrated live in [`containers.md`](../../_projects/lessons/sass/navigation/containers.md).
This is the sensible default for a project or nonprofit hub; use a different
composition only when the content requires it:

```html
<div class="ocs__container">
  <h2 class="ocs__section-title">Project Hardware</h2>
  <div class="ocs__card">
    <div class="ocs__grid ocs__grid--card">
      <div class="ocs__grid-cell">
        <img class="ocs__image-frame" src="/images/example.png" alt="Example hardware">
        <h3>Camera</h3>
        <a class="ocs__btn accent fill" href="/details">Details</a>
      </div>
    </div>
    <div class="ocs__table-wrap">
      <table class="ocs__table">
        <thead><tr><th>Item</th><th>Status</th></tr></thead>
        <tbody><tr><td>Camera</td><td>Current</td></tr></tbody>
      </table>
    </div>
  </div>
</div>
```

## Color and preferences

The user-preference system controls the page background, text, font, and accent.
New reusable OCS elements should use the preference tokens and derived UI
variables instead of choosing a fixed color palette:

- `--pref-bg-color`: page and primary surface background
- `--pref-text-color`: readable foreground text
- `--pref-font-family`, `--pref-font-size`: typography preferences
- `--pref-accent-color`: links, active states, borders, and emphasis
- `--panel`, `--ui-bg`, `--ui-border`, `--text-muted`: derived surfaces and secondary UI

Do not add literal values such as `#2563eb`, `rgb(...)`, `rgba(...)`, `white`,
or `black` to new reusable OCS or capstone styles. We do not design to one
fixed color theme; the same page must remain readable when preferences change.

### Color composition

Compose color in layers instead of assigning unrelated colors to every element:

```text
page background:       --pref-bg-color
└── container surface:  --panel
    ├── card surface:   --panel or color-mix(..., --panel)
    ├── border:         --ui-border
    ├── muted content:   --text-muted
    └── active layer:   color-mix(--pref-accent-color, --panel)
```

Example:

```scss
.example-card {
  background: var(--panel);
  border: 1px solid var(--ui-border);
  color: var(--pref-text-color);
}

.example-card--active {
  background: color-mix(in srgb, var(--pref-accent-color) 12%, var(--panel));
  border-color: var(--pref-accent-color);
  color: var(--pref-accent-color);
}
```

RFID uses scoped aliases that map back to preferences in
[`presence.scss`](../capstone/presence.scss).
Jarvis uses the same pattern in [`jarvis.scss`](../capstone/jarvis.scss):

```scss
.ocs__container {
  --jv-bg: var(--pref-bg-color);
  --jv-text: var(--pref-text-color);
  --jv-accent: var(--pref-accent-color);
  --jv-surface: color-mix(in srgb, var(--pref-text-color) 6%, var(--pref-bg-color));
}
```

Literal color is acceptable only when it is content itself, required by a
third-party diagram syntax, or isolated to a custom visualization. Document
that exception instead of making it the default styling pattern.

## Grammar reference

### Buttons and links

```html
<div class="ocs__links ocs__links--wide">
  <a class="ocs__btn" href="/example">Default</a>
  <a class="ocs__btn pill accent fill" href="/example">Selected</a>
  <a class="ocs__btn alert-green fill" href="/example">Semantic state</a>
</div>
```

Common button classes:

- `ocs__btn`: base button/link treatment
- `ocs__links`, `ocs__links--wide`: button groups
- `pill`: rounded pill shape
- `accent`: preference accent color
- `fill`: filled state
- `alert-green`, `alert-yellow`, `alert-red`: semantic tones
- `small`, `medium`, `large`: button-scoped sizes
- `ocs__btn--icon`, `ocs__btn-icon`: icon buttons

See [`elements/buttons`](elements/buttons) and [`buttons.md`](../../_projects/lessons/sass/navigation/buttons.md).

### Layout and containers

```html
<div class="ocs__container">
  <div class="ocs__card">Reusable document panel</div>
</div>

<div class="ocs__grid ocs__grid--standard cols-2">
  <div class="ocs__grid-cell">Content</div>
  <div class="ocs__grid-cell ocs__grid-cell--accent">Accent content</div>
</div>
```

Common layout classes:

- `ocs__container`: reusable page-width container; `ocs__container--fill` drops
  its 900px cap and padding for a page inside a layout that already pads its
  content, like the sidebar layout's Profile page.
- `ocs__card`: framed content panel
- `ocs__grid`: grid root
- `ocs__grid--standard`, `ocs__grid--card`, `ocs__grid--gallery`: grid variants
- `cols-2`, `cols-3`, `cols-4`: standard-grid column counts
- `ocs__grid-cell--header`, `--accent`, `--muted`, `--wide`: cell modifiers
- `ocs__stack`: a vertical stack with a 1rem gap between its children, so they
  need no margins; `ocs__stack--wide` uses the 1.5rem gap between cards.
  Children stretch to the full width, so put buttons in an `ocs__links` row.
- `ocs__split`: two equal columns; `ocs__split ocs__split--aside` makes the first
  a narrow list (14 to 18rem) beside a wide pane. Both become one column at 768px
  and below. Messages (`/dm`) puts its conversation list beside the open chat this way.

See [`elements/containers`](elements/containers), [`elements/grids`](elements/grids),
and [`grids.md`](../../_projects/lessons/sass/navigation/grids.md).

### Form fields

```html
<div class="ocs__grid--col2">
  <div class="ocs__field">
    <label class="ocs__label" for="email">Email</label>
    <input class="ocs__input" id="email" type="email" aria-describedby="email-help">
    <small id="email-help">We send grades here.</small>
  </div>
  <div class="ocs__field">
    <label class="ocs__label" for="effort">Effort: <output for="effort">3</output> of 5</label>
    <input id="effort" type="range" min="1" max="5" value="3">
  </div>
</div>
```

- `ocs__field`: a label, its control at the full width of the field, and
  optional help text in a plain `<small>`, evenly spaced.
- A range slider in a field fills it and takes the accent color.

See [`elements/forms/fields`](elements/forms/fields). The Profile page
(`/profile`) lays out its account form and skill check-in this way.

### Avatars

```html
<abbr class="ocs__avatar" title="Ada Lovelace">AL</abbr>
```

`ocs__avatar`: a round avatar with a person's initials in the accent color.
Write it as an `<abbr>` with the full name in `title`, not a `<span>` or
`<div>`: preset themes recolor every span and div to the text color. See
[`elements/avatars`](elements/avatars).

### Tables

```html
<div class="ocs__table-wrap">
  <table class="ocs__table">
    <thead><tr><th>Decision</th><th>Detail</th></tr></thead>
    <tbody><tr><td>Example</td><td>Preference-aware row treatment.</td></tr></tbody>
  </table>
</div>
```

Use `ocs__table-wrap` for horizontal scrolling and `ocs__table` for theme-aware
headers, borders, alternating rows, and hover states.

See [`elements/tables`](elements/tables).

### Trees

```html
<div class="ocs__tree-item">Week 1</div>
<div class="ocs__tree">
  <div class="ocs__tree-item"><a href="/example/lesson-1">Lesson 1</a></div>
  <div class="ocs__tree-item"><a href="/example/lesson-2">Lesson 2</a></div>
  <div class="ocs__tree">
    <div class="ocs__tree-item"><a href="/example/lesson-2/part-a">Part A</a></div>
  </div>
</div>
```

Common tree classes:

- `ocs__tree`: indents its children one level and draws an accent guide line
  down the left, under the row above. Put one inside another for each deeper level.
- `ocs__tree-item`: spaces a plain child (text, a link, or an `ocs__links`
  group) off the guide line. Rows that already have padding, like the course
  sidebar's `lesson-item` rows, go straight inside `ocs__tree`.

See [`elements/trees`](elements/trees). The course sidebar
(`_projects/systems/courses/_includes/lesson-sidebar-nav.html`) nests each
week's lessons and chat this way.

### One-line text

```html
<a class="ocs__keypoint" href="/example/lesson" title="Agile Methodologies Practitioner">
  <i class="fas fa-code"></i>
  <span class="ocs__truncate ocs__truncate--hover">Agile Methodologies Practitioner</span>
</a>
```

- `ocs__truncate`: keeps text on one line and ends it with "…" when it doesn't
  fit. Put the full text in a `title` attribute on it or on its link, so
  hovering shows it. Use it on a block element or a flex item, like the text
  beside an icon.
- `ocs__truncate--hover`: cuts the text only on devices that can hover (a
  mouse or trackpad). A phone or tablet can't show the title, so there the
  text wraps instead and stays readable.

See [`elements/typography`](elements/typography). The course sidebar's lesson
rows and the phone menu use both classes. The sidebar's week titles use
`ocs__truncate` alone: their space is too narrow to wrap without breaking words.

### Tabs

```html
<div class="ocs__tabs">
  <ul class="ocs__tabs-list">
    <li><a class="ocs__tabs-btn active" href="#">Overview</a></li>
    <li><a class="ocs__tabs-btn" href="#">Details</a></li>
  </ul>
</div>
<div class="ocs__tabs-panels">
  <div class="ocs__tabs-panel">Overview content</div>
</div>
```

- `ocs__tabs`, `ocs__tabs-list`: the tab bar and its bottom border
- `ocs__tabs-btn`: an individual tab; add `active` for the selected one
- `ocs__tabs-underline`: optional sliding indicator under the active tab
- `ocs__tabs-panels`, `ocs__tabs-panel`: the swapped content area

See [`elements/tabs`](elements/tabs). Dashboard, Analytics Dashboard, and
Submissions all use this for their tab bars.

### Modals

```html
<div class="ocs__modal">
  <div class="ocs__modal-card">
    <div class="ocs__modal-header">
      <h3 class="ocs__modal-title">Title</h3>
      <button class="ocs__btn ocs__btn--icon small ocs__modal-close">&times;</button>
    </div>
    <p>Modal content.</p>
    <div class="ocs__modal-actions">
      <button class="ocs__btn accent fill medium">Confirm</button>
    </div>
  </div>
</div>
```

- `ocs__modal`: the fixed, centered backdrop
- `ocs__modal-card`: the content card
- `ocs__modal-close`: positions a close control in the card's corner; pair
  it with `ocs__btn ocs__btn--icon` for the icon button treatment, or put
  it inside `ocs__modal-header` instead for a modal with a title bar
- `ocs__modal-header`, `ocs__modal-title`, `ocs__modal-actions`: optional
  header row and action-button row for a fuller modal

How a page shows/hides the modal (a `hidden`/`open` class, an
`aria-hidden` attribute) is up to the page — this only styles the chrome.
See [`elements/modals`](elements/modals).
Dashboard and Analytics Dashboard use the plain card+close shape; Calendar
and Profile's face scanner use the full header/actions shape.

### Card headers

```html
<div class="ocs__card">
  <div class="ocs__card-header">
    <h2 class="ocs__section-title">Title</h2>
    <button class="ocs__btn accent fill medium">Action</button>
  </div>
</div>
```

`ocs__card-header`: a title/action row inside a card (flex,
space-between, aligned). An `ocs__section-title` in the row drops its bottom
margin, so it sits level with the action. See [`elements/capstone`](elements/capstone).

### Picker cards

```html
<div class="ocs__hub-grid" role="group" aria-label="Student archetype">
  <button type="button" class="ocs__hub-card ocs__hub-card--selected" aria-pressed="true">
    <strong class="ocs__hub-card-title">Technologist</strong>
  </button>
  <button type="button" class="ocs__hub-card" aria-pressed="false">
    <strong class="ocs__hub-card-title">Scrummer</strong>
  </button>
</div>
```

An `ocs__hub-card` can also be one choice in a picker: a `<button>` fills its
grid cell with its content at the top. Mark the current choice with
`ocs__hub-card--selected` and `aria-pressed="true"`. Profile's persona groups
use this.

### Loading spinner

```html
<div class="ocs__loading">
  <div class="ocs__spinner"></div>
</div>
```

`ocs__loading`/`ocs__spinner`: an inline, theme-aware loading state for a
tab panel or card. See [`elements/loaders`](elements/loaders). (`.spinner`/
`.loading-container` in the same directory are an older, non-`ocs__`
full-page overlay variant with hardcoded colors — use the `ocs__` pair for
anything new.)

### Capstone document elements

These shared classes are used by the RFID and Jarvis capstone documents:

- `ocs__section-title`, `ocs__badge`, `ocs__description`
- `ocs__callout`, `ocs__status`, `ocs__team`, `ocs__team-label`, `ocs__team-name`
- `ocs__diagram`, `ocs__entity-list`
- `ocs__hub-grid`, `ocs__hub-card`, `ocs__hub-card-title`
- `ocs__pager`, `ocs__pager-link`
- `ocs__checklist`, `ocs__checklist-box`
- `ocs__status-pill`, `ocs__status-pill--good`, `--warn`, `--bad`, `--neutral`

See [`elements/capstone`](elements/capstone).

### Kanban board

A smart card that shows a team's GitHub project board, live, on any page. Give
it the board's link and it builds itself from that board:

```liquid
{% include ocs_kanban_board.html url="https://github.com/orgs/UGRC-CSA/projects/1" filter="Team" %}
```

- `url` (required): a public board owned by an organization
  (`github.com/orgs/...`). The page reads it from GitHub's REST API without
  signing in; GitHub keeps a personal board's cards for signed-in users. A team
  without an organization can give its repository's issues instead
  (`github.com/<owner>/<repo>/issues`): an issue with a label named for a stage
  goes to that column, and the rest go by the `issues` settings (closed issues
  Done, assigned ones In progress, the others To do).
- `filter` (optional): a single-select field, such as `Team`. Each option that
  has cards becomes a filter button. An option named Everyone or All is for
  shared cards, which show under every button. For a repository's issues,
  `filter="Assignee"` filters by person.
- `title` (optional): a heading to use instead of the board's own name.
- `columns` (optional): the capstone's own changes to its board's columns, a
  list from its page data (below).

Everything else comes from the board, so any board works as it is. Columns
follow the board's own order: a column whose name has a stage's words shares
that stage's column ("Todo", "To Do" and "Ready" are all To do, "Blocked" is In
progress), any other column keeps its own name, and cards with no status get a
"No status" column, as on GitHub. The backlog keeps the board's own name (the
OCS issue lifecycle calls it "Parking Lot") and starts collapsed behind a
toggle, and No status goes along with it. Cards show their number, a `People`
field or the assignees, a `Priority` and `Topic` when the board has them, and
once done, a `Shipped` date or the day they closed. Under that is the evidence
for the column's exit gate: how many boxes of the card's checklist are ticked
(`☑ 3/4`), and the pull requests linked to its issue (`PR #123`, marked
merged, draft or closed). Both are in the accent once complete. The board keeps
a copy for 10 minutes, because visitors without a token share 60 GitHub
requests an hour per network, and keeps showing that copy, with a note, when
GitHub doesn't answer.

Nothing about columns or wording is in the code. The stages (their words,
names, and which start collapsed), the field names and everything the board
says are in [`_data/kanban.yml`](../../_data/kanban.yml) for the whole site. A
capstone changes its own board with a `columns` list beside the board's link,
matched to the board's statuses by name (case and emoji don't matter). Each
entry can:

- `label`: give the status a column of its own, by this name.
- `stage`: put the status in a stage's column (`backlog`, `todo`, `doing`,
  `review` or `done`).
- `collapsed`: start its column collapsed behind the toggle (`true`) or open
  (`false`).
- `hidden: true`: leave it off the board.

```yaml
Board:
  url: "https://github.com/orgs/UGRC-CSA/projects/1"
  filter: "Team"
  columns:
    - status: "Team Map"
      hidden: true
    - status: "Reflections"
      hidden: true
```

```liquid
{% include ocs_kanban_board.html url=data.Board.url filter=data.Board.filter columns=data.Board.columns %}
```

Kanban classes (`assets/js/kanban-board.js` builds them):

- `ocs__kanban-board`: the stage columns, side by side. A column is at least
  11.5rem wide (or the whole board on a phone); past that the board scrolls sideways.
- `ocs__kanban-column`: one column. Its `data-stage` colors the line across its
  top, with more accent the closer the stage is to done; a column with no stage
  (one of the board's own, or No status) gets backlog's quiet line.
- `ocs__kanban-item`: a card, with `ocs__kanban-kicker`, `ocs__kanban-name` and
  `ocs__kanban-note` for its three lines, and `ocs__kanban-evidence` for its row
  of evidence pills.

The names avoid the suffixes `_sass/capstone/infograph.scss` restyles (`-card`,
`-title` and others), so the board looks the same inside a capstone's
`*-infograph` include. The filter buttons, the toggle for collapsed columns and
the counts are `ocs__btn`, `ocs__toggle` and `ocs__status-pill`.

See [`elements/kanban`](elements/kanban) and
[`ocs_kanban_board.html`](../../_includes/ocs_kanban_board.html). The
Communication Systems capstone shows the UGRC-CSA board this way.

## Theme file reference

`user-preferences.scss` defines the current user-selectable theme contract.
New reusable OCS elements should use these tokens and derived UI variables such as `--panel`, `--ui-bg`, and `--ui-border`.

- `--pref-bg-color`
- `--pref-text-color`
- `--pref-font-family`
- `--pref-font-size`
- `--pref-accent-color`

`legacy/user-colors.scss` is the editable Sass palette used by older components.
`legacy/root-color-map.scss` is generated compatibility infrastructure.

The old paths `_sass/user-colors.scss`, `_sass/root-color-map.scss`, and
`_sass/open-coding/user-preferences.scss` remain compatibility wrappers.
