---
layout: page
title: Design System
permalink: /design-system
search_exclude: false
---

<link rel="stylesheet" href="{{ '/assets/css/ocs.css' | relative_url }}">
<style>
.ds-demo { display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-start;
  padding:1.25rem; margin:.75rem 0; border:1px solid var(--ocs-border);
  border-radius:12px; background:var(--ocs-surface-base); }
.ds-demo > * { max-width:100%; }
</style>

A component set for OCS Pages. Every colour here comes from a named token, and
every background token is defined next to the text colour meant to sit on it, so
a readable pair is the thing you reach for.

## Using it

Add the stylesheet to your layout, then use the classes:

```html
<link rel="stylesheet" href="{{ '/assets/css/ocs.css' | relative_url }}">
<script src="{{ '/assets/js/ocs.js' | relative_url }}" defer></script>
```

The JavaScript is only needed for tabs, menus and modals. Everything else is CSS.

## Copying a component into another OCS repo

Each component is one self-contained file under `_sass/ocs/components/`. To take
just the button into another project:

1. Copy `_sass/ocs/core/` and the component file you want.
2. Add it to your own `_index.scss`:
   ```scss
   @forward "core/tokens";
   @use "core/css-vars";
   @use "components/button";
   ```
3. Run `_sass/ocs/tools/build.sh` to regenerate the CSS.

You own the copy. Edit it freely - there is no package to fight with.

## Tokens

**Semantic colour**

| Token | Value |
|---|---|
| `--ocs-brand` | `#EA706E` |
| `--ocs-brand-border` | `#E06665` |
| `--ocs-brand-bg` | `#3B2827` |
| `--ocs-brand` | `#EA706E` |
| `--ocs-brand-border` | `#E06665` |
| `--ocs-brand-bg` | `#3B2827` |
| `--ocs-info` | `#5293FF` |
| `--ocs-info-border` | `#007AFF` |
| `--ocs-info-bg` | `#272B3F` |
| `--ocs-success` | `#34C759` |
| `--ocs-success-border` | `#34C759` |
| `--ocs-success-bg` | `#283929` |
| `--ocs-warning` | `#FF9F0A` |
| `--ocs-warning-border` | `#FF9F0A` |
| `--ocs-warning-bg` | `#423220` |
| `--ocs-danger` | `#FF5E4D` |
| `--ocs-danger-border` | `#FF453A` |
| `--ocs-danger-bg` | `#412520` |
| `--ocs-accent` | `var(--ocs-brand)` |
| `--ocs-accent-border` | `var(--ocs-brand-border)` |
| `--ocs-accent-bg` | `var(--ocs-brand-bg)` |
| `--ocs-accent-contrast` | `#121212` |

**Text**

| Token | Value |
|---|---|
| `--ocs-text` | `#FFFFFF` |
| `--ocs-text-secondary` | `#E1E1E6` |
| `--ocs-text-muted` | `#949498` |
| `--ocs-text-inverse` | `#121212` |

**Surface**

| Token | Value |
|---|---|
| `--ocs-surface-base` | `#121212` |
| `--ocs-surface-raised` | `#1C1C1E` |
| `--ocs-surface-elevated` | `#2C2C2E` |
| `--ocs-surface-overlay` | `rgba(0, 0, 0, 0.72)` |

**Border**

| Token | Value |
|---|---|
| `--ocs-border` | `#444448` |
| `--ocs-border-strong` | `#59595D` |
| `--ocs-border-subtle` | `#303033` |

**Spacing**

| Token | Value |
|---|---|
| `--ocs-space-0` | `0` |
| `--ocs-space-1` | `0.25rem` |
| `--ocs-space-2` | `0.5rem` |
| `--ocs-space-3` | `0.75rem` |
| `--ocs-space-4` | `1rem` |
| `--ocs-space-5` | `1.25rem` |
| `--ocs-space-6` | `1.5rem` |
| `--ocs-space-8` | `2rem` |
| `--ocs-space-10` | `2.5rem` |
| `--ocs-space-12` | `3rem` |
| `--ocs-space-16` | `4rem` |

**Radius**

| Token | Value |
|---|---|
| `--ocs-radius-none` | `0` |
| `--ocs-radius-sm` | `4px` |
| `--ocs-radius-md` | `6px` |
| `--ocs-radius-lg` | `10px` |
| `--ocs-radius-xl` | `14px` |
| `--ocs-radius-full` | `999px` |

**Motion**

| Token | Value |
|---|---|
| `--ocs-duration-fast` | `120ms` |
| `--ocs-duration-base` | `180ms` |
| `--ocs-duration-slow` | `280ms` |
| `--ocs-ease` | `cubic-bezier(0.2, 0, 0, 1)` |

## Components

### Button

Four variants, three sizes. `disabled` is styled from the attribute, not a class.

<div class="ds-demo"><button class="ocs-btn ocs-btn--primary">Primary</button>
<button class="ocs-btn ocs-btn--secondary">Secondary</button>
<button class="ocs-btn ocs-btn--ghost">Ghost</button>
<button class="ocs-btn ocs-btn--danger">Danger</button>
<button class="ocs-btn ocs-btn--primary" disabled>Disabled</button></div>

```html
<button class="ocs-btn ocs-btn--primary">Primary</button>
<button class="ocs-btn ocs-btn--secondary">Secondary</button>
<button class="ocs-btn ocs-btn--ghost">Ghost</button>
<button class="ocs-btn ocs-btn--danger">Danger</button>
<button class="ocs-btn ocs-btn--primary" disabled>Disabled</button>
```

### Badge

Use the semantic set so the meaning is not carried by hue alone.

<div class="ds-demo"><span class="ocs-badge ocs-badge--success">passing</span>
<span class="ocs-badge ocs-badge--warning">flaky</span>
<span class="ocs-badge ocs-badge--danger">failing</span>
<span class="ocs-badge ocs-badge--info">queued</span></div>

```html
<span class="ocs-badge ocs-badge--success">passing</span>
<span class="ocs-badge ocs-badge--warning">flaky</span>
<span class="ocs-badge ocs-badge--danger">failing</span>
<span class="ocs-badge ocs-badge--info">queued</span>
```

### Form field

The label is a real `<label for>`, and help text sits under the control.

<div class="ds-demo"><label class="ocs-label" for="ds-name">Project name</label>
<input class="ocs-input" id="ds-name" value="unit-3-lesson">
<p class="ocs-help">Lowercase letters, numbers and hyphens.</p></div>

```html
<label class="ocs-label" for="ds-name">Project name</label>
<input class="ocs-input" id="ds-name" value="unit-3-lesson">
<p class="ocs-help">Lowercase letters, numbers and hyphens.</p>
```

### Alert

A coloured left border carries the meaning alongside the hue.

<div class="ds-demo"><div class="ocs-alert ocs-alert--warning"><div class="ocs-alert__content">
  <p class="ocs-alert__title">Heads up</p>
  <p>Your last submission had no tests.</p>
</div></div></div>

```html
<div class="ocs-alert ocs-alert--warning"><div class="ocs-alert__content">
  <p class="ocs-alert__title">Heads up</p>
  <p>Your last submission had no tests.</p>
</div></div>
```

### Card

A header and a body. Nothing else is required.

<div class="ds-demo"><div class="ocs-card">
  <div class="ocs-card__header"><h3 class="ocs-card__title">Unit 3</h3></div>
  <div class="ocs-card__body">Four assignments, two graded.</div>
</div></div>

```html
<div class="ocs-card">
  <div class="ocs-card__header"><h3 class="ocs-card__title">Unit 3</h3></div>
  <div class="ocs-card__body">Four assignments, two graded.</div>
</div>
```

### Table

Wrap it so wide tables scroll inside their own box rather than the page.

<div class="ds-demo"><div class="ocs-table-wrap" role="region" aria-label="Students" tabindex="0">
  <table class="ocs-table ocs-table--compact">
    <thead><tr><th scope="col">Student</th><th scope="col">Status</th></tr></thead>
    <tbody><tr><td>A. Rivera</td><td><span class="ocs-badge ocs-badge--success">on track</span></td></tr></tbody>
  </table>
</div></div>

```html
<div class="ocs-table-wrap" role="region" aria-label="Students" tabindex="0">
  <table class="ocs-table ocs-table--compact">
    <thead><tr><th scope="col">Student</th><th scope="col">Status</th></tr></thead>
    <tbody><tr><td>A. Rivera</td><td><span class="ocs-badge ocs-badge--success">on track</span></td></tr></tbody>
  </table>
</div>
```

### Progress

Set the width from your own data.

<div class="ds-demo"><div class="ocs-progress"><div class="ocs-progress__bar" style="width:68%"></div></div></div>

```html
<div class="ocs-progress"><div class="ocs-progress__bar" style="width:68%"></div></div>
```

## Checks

Two scripts guard the colours:

- `python3 _sass/ocs/tools/contrast.py` reads the token file and exits non-zero
  if any pair falls under WCAG AA.
- `python3 _sass/ocs/tools/build-contrast-harness.py` renders every component in
  three theme contexts and measures what actually paints. Values being right does
  not prove the right rule won.

`_sass/ocs/tools/build.sh --check` fails if the committed CSS has drifted from
the source.

<p style="margin-top:2rem;font-size:.9rem;opacity:.7">
This page is generated by <code>_sass/ocs/tools/build-docs.py</code> from the real
token file, so the table above cannot drift from the code.
</p>
