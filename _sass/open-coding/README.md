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

Every preset in `assets/js/user-preferences.js` keeps its text and its accent at
4.5:1 (the WCAG AA minimum) on the page and on `--panel`, and keeps page-colored
text on an accent fill at 4.5:1. The engine derives `--text-muted` at 4.5:1 on
every surface and field outlines (`--field-border`) at 3:1, and
`tests/theme_contrast.test.mjs` checks every preset. So a reusable style reads
in every theme when its text is `--pref-text-color`, `--text-muted`, or the
accent on the page or a panel. Text on an accent tint stays in the text color:
the accent on its own tint falls under 4.5:1 in most themes, so the accent goes
on the ring and the tint.

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
  color: var(--pref-text-color);
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

### Shared pieces

Elements are built from a few shared pieces, so each one adds only what is its own:

- `surface` (`mixins/_panel.scss`): the 1px ring, rounded corners, panel and text color
  that cards, rows, menus and previews are drawn on
- `overlay-panel`: a stronger theme-aware ring and shadow for a panel above page content;
  its positioning, visibility and any backdrop remain the caller's responsibility
- `viewer-toolbar`: the shared layout and themed surface for viewer controls
- `accent-tint`: the accent ring and tint of a hovered, active or chosen item
- `kicker`: small capitals over a title or a group
- `.ocs__truncate`, which other parts `@extend` for one line that ends in "…"
- `$radius-pill` (`mixins/_variables.scss`): fully round ends

| Element | Reuses |
| --- | --- |
| `ocs__card`, `ocs__pager-link` | `surface` |
| `ocs__hub-card` | `surface`; `accent-tint` when hovered or chosen |
| `ocs__nav-card` | `surface`; `accent-tint` when hovered or `is-active`; `kicker` for its kicker and call to action |
| `ocs__nav-card--compact` | the whole nav card, tighter, with an accent edge |
| `ocs__grid-cell` in a card, calculator or gallery grid | `surface`, through `grid-card-cell`, `grid-key-cell` and `gallery-cell` |
| `ocs__section-title`, `ocs__stat-label` | `kicker` |
| `ocs__file`, `ocs__file-preview` | `surface`; `accent-tint` on a row that opens something; `.ocs__truncate` for the name and details |
| `ocs__menu` | `surface` with a stronger ring; `kicker` for headings; `accent-tint` without a ring on the highlighted item; `.ocs__truncate` for names and hints |
| `ocs__badge`, `ocs__status`, `ocs__progress` | `$radius-pill` |

Start a new element from these. See [`mixins/README.md`](mixins/README.md).

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
- `fill`: filled state; `accent fill` is a solid accent with page-colored text
- `alert-green`, `alert-yellow`, `alert-red`: semantic tones
- `small`, `medium`, `large`: button-scoped sizes
- `ocs__btn--icon`, `ocs__btn-icon`: icon buttons

Keyboard focus shows a 2px accent ring on every `ocs__btn`; a mouse click
doesn't. A student's button-shape preference reaches `ocs__btn` only when they
pick square or pill; the default keeps the grammar's own shapes.

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
  a narrow list (14 to 18rem) beside a wide pane, and `ocs__split ocs__split--aside-end`
  makes the second one narrow instead, a sidebar on the right. Each becomes one
  column at 768px and below, in markup order, so a right-hand sidebar moves under
  the main content. Write that sidebar as a `div`, not an `<aside>`: a saved
  preference theme paints every `aside` with the page background. Messages (`/dm`)
  puts its conversation list beside the open chat with `--aside`; the UI Builder's
  "Narrow column on the right" layout uses `--aside-end`.

See [`elements/containers`](elements/containers), [`elements/grids`](elements/grids),
and [`grids.md`](../../_projects/lessons/sass/navigation/grids.md).

### Embeds

```html
<iframe class="ocs__embed ocs__embed--tall" src="https://example.github.io/app/"
        title="Flood Watch app" loading="lazy"></iframe>
<iframe class="ocs__embed ocs__embed--video" src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
        title="Flood Watch demo video" allow="fullscreen; picture-in-picture; encrypted-media"></iframe>
```

- `ocs__embed`: a frame for another page, on the `<iframe>` itself. It fills its
  container's width at a fixed height, 480px unless a size says otherwise, with
  the theme border and a soft panel background that shows while the page loads.
- `ocs__embed--short`, `--medium`, `--tall`: 320, 480 or 720px tall, so the page
  around the frame keeps its place while it loads and the embedded app knows how
  much room it has.
- `ocs__embed--video`: a 16:9 player that scales with the width, for YouTube or a
  Google Drive video. It wins over a size class set beside it.

Give each iframe a `title` that says what it shows: screen readers announce it.
See [`elements/embeds`](elements/embeds). The UI Builder's Embed your app and
Video blocks load their pages in this frame.

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
headers, borders, alternating rows, and hover states. Add `ocs__table--list` for
a compact, unstriped list with separators and quiet uppercase headers.

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
week's lessons and chat this way, and the sidebar layout's sidebar
(`_includes/aesthetihawk/sidebar.html`) lists a page's sections under it.

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

See [`elements/tabs`](elements/tabs). The Dashboard uses this for its tab bar.

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
- `ocs__modal-card--wide`: a 48rem card for a modal that holds a list or a
  browser rather than a short form, like the Files dialog in Messages (`/dm`)

See [`elements/modals`](elements/modals).
Dashboard and Analytics Dashboard use the plain card+close shape; Calendar
and Profile's face scanner use the full header/actions shape.

### Files

```html
<ul class="ocs__file-list">
  <li class="ocs__file">
    <i class="fas fa-file-pdf ocs__file-icon" aria-hidden="true"></i>
    <div class="ocs__file-text">
      <b class="ocs__file-name" title="Design review.pdf">Design review.pdf</b>
      <em class="ocs__file-meta">2.4 MB · Ada Lovelace</em>
    </div>
    <div class="ocs__file-actions">
      <button class="ocs__btn small" type="button">Download</button>
    </div>
  </li>
  <li><button class="ocs__file" type="button">
    <i class="fas fa-folder ocs__file-icon" aria-hidden="true"></i>
    <div class="ocs__file-text">
      <b class="ocs__file-name">project</b>
      <em class="ocs__file-meta">42 files · 3.1 MB</em>
    </div>
  </button></li>
</ul>
```

- `ocs__file-list`: rows of files with a small gap
- `ocs__file`: one file or folder: icon, name and details, actions. Make it a
  `<button>` or `<a>` when the whole row opens something, like a folder
- `ocs__file-icon`: the type icon, in the accent
- `ocs__file-text`, `ocs__file-name`, `ocs__file-meta`: the name on one line (cut
  with "…") over muted details. Write the name as `<b>` and the details as `<em>`:
  preset themes recolor span, small and div
- `ocs__file-actions`: buttons at the end of the row
- `ocs__file-preview`: an image, video, PDF frame or `<pre>` of text shown with a file

See [`elements/files`](elements/files). Messages (`/dm`) shows shared files, the upload
tray and the files under a message this way.

### Progress

```html
<progress class="ocs__progress" max="100" value="40">40%</progress>
```

`ocs__progress`: a thin bar on a native `<progress>`, the accent on a track mixed
from the text color, in every theme. Leave `value` off while the amount is unknown.
See [`elements/progress`](elements/progress).

### Menus

```html
<div class="ocs__menu" role="listbox" aria-label="Commands">
  <div class="ocs__menu-group" role="group" aria-labelledby="share-heading">
    <b class="ocs__menu-heading" id="share-heading">Share</b>
    <button class="ocs__menu-item" type="button" role="option" aria-selected="true">
      <i class="fas fa-paperclip ocs__menu-icon" aria-hidden="true"></i>
      <strong class="ocs__menu-name">/file</strong>
      <em class="ocs__menu-hint">Attach files from your computer</em>
      <kbd>Enter</kbd>
    </button>
  </div>
  <em class="ocs__menu-foot">↑ ↓ to move · Enter to pick · Esc to close</em>
</div>
```

- `ocs__menu`: the panel; where it opens is the page's job
- `ocs__menu-group`, `ocs__menu-heading`: groups, divided by a line
- `ocs__menu-item`: a `<button>`, `<a>` or a `<label>` for a hidden file input.
  `aria-selected="true"` (or hover) gives it the accent tint with the text color on it
- `ocs__menu-icon`, `ocs__menu-name`, `ocs__menu-hint`, `kbd` or `ocs__menu-key`:
  the item's icon, name, muted hint and key
- `ocs__menu-foot`: a muted line of keyboard help

Write headings, names and hints as `<b>`, `<strong>` and `<em>`, not spans. See
[`elements/menus`](elements/menus). Messages uses it for the Attach menu; it fits a
slash-command picker or a message's More actions too.

### Nav cards

```html
<div class="ocs__stack">
  <a class="ocs__nav-card" href="/csh/week-4/">
    <span class="ocs__nav-card-kicker">Week 4</span>
    <span class="ocs__nav-card-title">Retrospective and Assessment</span>
    <span class="ocs__text">Reflect on the sprint and set goals</span>
  </a>
  <a class="ocs__nav-card ocs__nav-card--compact" href="https://github.com/Open-Coding-Society/pages/pull/2031">
    <span class="ocs__nav-card-kicker"><i class="fas fa-code-pull-request" aria-hidden="true"></i> Open-Coding-Society/pages #2031 <b class="ocs__status-pill ocs__status-pill--good">Open</b></span>
    <span class="ocs__nav-card-title">Messages page redesign</span>
    <span class="ocs__text">syowns opened 2 days ago · 9 files +1,200 −300</span>
  </a>
</div>
```

- `ocs__nav-card`: a card that is a link: a kicker, a title and an optional line of
  text. Add `is-active` for the current one; `ocs__nav-card-cta` goes at the end
- `ocs__nav-card--compact`: a link previewed inside a stream, tighter and with an accent
  edge. Its kicker says where the link points and can hold status pills

See [`elements/capstone`](elements/capstone). The UI Builder's Link cards block and the
course sprint and week pages use nav cards. The compact one is for a link previewed
in a chat, like a GitHub issue or pull request.

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
margin, so it sits level with the action. The row wraps when the title and the
action don't fit, so on a phone the action drops under the title. See
[`elements/capstone`](elements/capstone).

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

`ocs__badge`, `ocs__status` and the status pills keep their words in the text
color; the ring and the tint show the state: the accent for `--good`, the
theme's yellow (`--priority-p2`) for `--warn` and its red (`--priority-p0`) for
`--bad`.

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

### Section bands

A band is a padded, rounded surface behind a whole section, the way a site builder gives each
section its own look. Add it to an element that already lays out its children (`ocs__stack`,
`ocs__split`, `ocs__facts`); it only paints and pads.

```html
<section class="ocs__stack ocs__band ocs__band--tint">
  <h2 class="ocs__section-title">Roadmap</h2>
  ...
</section>
```

- `ocs__band`: the padding, radius and text color.
- `ocs__band--card`: a framed panel.
- `ocs__band--tint`: a light wash of the accent (12% over the page background, not the panel,
  so links keep their contrast).
- `ocs__band--outline`: the panel framed in the accent.

The colors are `color-mix()` over the theme variables, so a saved preset still recolors them.
In every preset, text on every look stays above 6:1 and links above 4.5:1 (lowest: a link on
Light's card, 4.6:1, the same as on any panel). The UI Builder's Section style writes these
classes. See [`elements/bands`](elements/bands).

### Ticker

One bar of short announcements, each a link to its details. It is still unless it has
`ocs__ticker--moving`, and then it slides sideways in a loop. It never moves on a touch screen, in
a window 768px wide or narrower, or when the visitor's system asks for reduced motion; the links
wrap instead. Anyone can stop it (WCAG 2.2.2): the Pause switch holds it still, a mouse hover
pauses it, and keyboard focus on a link shows the whole list still and wrapped.

```html
<section class="ocs__ticker ocs__ticker--moving" aria-labelledby="news-title">
  <p class="ocs__ticker-label" id="news-title">Announcements</p>
  <label class="ocs__toggle ocs__ticker-switch">
    <input class="ocs__toggle-input" type="checkbox">
    <span class="ocs__toggle-track"></span>
    <span class="ocs__toggle-label">Pause</span>
  </label>
  <div class="ocs__ticker-viewport">
    <div class="ocs__ticker-track">
      <ul class="ocs__ticker-items">
        <li><a href="/events/night-at-the-museum/">Night at the Museum: Thursday at 6 PM</a></li>
        <li><a href="/events/hour-of-code/">Hour of Code sign-ups close Friday</a></li>
      </ul>
      <ul class="ocs__ticker-items" aria-hidden="true">
        <li><a href="/events/night-at-the-museum/" tabindex="-1">Night at the Museum: Thursday at 6 PM</a></li>
        <li><a href="/events/hour-of-code/" tabindex="-1">Hour of Code sign-ups close Friday</a></li>
      </ul>
    </div>
  </div>
</section>
```

- `ocs__ticker`: the bar, a `<section>` named by its label. Its surface and edge are the band's
  tint look, so text and links keep their contrast in every preset.
- `ocs__ticker-label`: the bar's visible name. Use a `<p>`, not a heading, so a page layout's
  heading styles don't restyle it.
- `ocs__ticker-switch`: the Pause switch, an `ocs__toggle`. A CSS rule pauses the bar while it is
  on, so it needs no JavaScript. It comes before the moving text, so it is the first thing the
  keyboard reaches. A still bar, a touch screen, a narrow window and reduced motion hide it.
- `ocs__ticker-viewport`, `ocs__ticker-track`, `ocs__ticker-items`: the window, what slides, and
  the list of links.
- `ocs__ticker--moving`: slide the list. The track holds it twice, the second copy
  `aria-hidden="true"` with its links at `tabindex="-1"`, so a screen reader reads each
  announcement once. Each copy is at least as wide as the bar and the track slides by half its
  width, so even a short list loops with no gap. A still bar needs only the first list.
- `--ocs-ticker-duration`: how long one loop takes (40s unless the page sets it).

Don't give the bar `role="alert"` or `aria-live`: an alert is for news that appears while
someone is reading, and this bar is there when the page loads. Mark an urgent announcement with
an `ocs__status-pill ocs__status-pill--bad` pill at the start of its link instead. See
[`elements/ticker`](elements/ticker).

Course homes fill one from the calendar with `{% include ocs_calendar_ticker.html %}`: Courses'
`calendar-ticker.js` builds both lists and moves the bar only when its links don't fit on one row.

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
