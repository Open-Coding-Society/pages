# Open Coding Sass Guide

This directory contains reusable Sass grammar for the Open Coding Society site.
Use these elements for new reusable UI before creating a project-specific style.

## Start with OCS grammar

OCS grammar is intended to help you build interesting pages with zero custom
CSS. Start with the existing classes and composition patterns. Add project CSS
only for an exceptional visual or interaction that the shared grammar cannot
express yet.

The examples are demonstrated in [`index2.md`](../../index2.md) for buttons,
[`index4.md`](../../index4.md) for grids, and [`index5.md`](../../index5.md) for
container composition.

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

Example composition, also demonstrated live in [`index5.md`](../../index5.md).
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
[`rfid-presence-common-style.html`](../../../_includes/rfid-presence-common-style.html).
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

See [`elements/buttons`](elements/buttons) and [`index2.md`](../../index2.md).

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

- `ocs__container`: reusable page-width container
- `ocs__card`: framed content panel
- `ocs__grid`: grid root
- `ocs__grid--standard`, `ocs__grid--card`, `ocs__grid--gallery`: grid variants
- `cols-2`, `cols-3`, `cols-4`: standard-grid column counts
- `ocs__grid-cell--header`, `--accent`, `--muted`, `--wide`: cell modifiers

See [`elements/containers`](elements/containers), [`elements/grids`](elements/grids),
and [`index4.md`](../../index4.md).

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
