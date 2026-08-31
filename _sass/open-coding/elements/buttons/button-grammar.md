# Button Grammar

## Purpose
This file documents the student-facing class grammar for button composition in OCS.

## Core
- Base button: `ocs__btn`
- Icon layout: `ocs__btn--icon` with `ocs__btn-icon`
- Link group: `ocs__links` and `ocs__links--wide`

## Size
- `small`
- `medium`
- `large`

Use with button base, for example:
- `ocs__btn small`
- `ocs__btn large`

## Color Tone
- `alert-red`
- `alert-yellow`
- `alert-green`

Use with button base, for example:
- `ocs__btn alert-red`
- `ocs__btn alert-green`

## Style Modifiers
- `fill`: adds background fill while keeping alert border and tone
- `pill`: removes border and uses pill shape
- `iridescent`: shimmer gradient variant using the current tone

Examples:
- `ocs__btn alert-red fill`
- `ocs__btn alert-yellow iridescent`
- `ocs__btn pill alert-green fill`

## Recommended Order
Use this order for readability:
1. `ocs__btn`
2. size
3. color tone
4. style modifiers

Example:
- `ocs__btn medium alert-red fill`

## Compatibility Notes
Legacy `ocs__btn--*` modifier aliases still compile.
New code should prefer utility grammar above.

## Runner Control Grammar

Use these classes for standardized controls in CODE_RUNNER, UI_RUNNER, and GAME_RUNNER.

### Runner Structure
- `ocs__btn utility` base for square runner controls

### Semantic Actions
- `run`
- `pause`
- `stop`
- `fullscreen`
- `copy`
- `save`
- `clear`
- `reset`
- `copyOutput`

Examples:
- `ocs__btn utility run`
- `ocs__btn utility pause`
- `ocs__btn utility stop`
- `ocs__btn utility fullscreen`
- `ocs__btn utility copy`

### Behavior Hook Convention
- Prefer `data-hook` attributes for JavaScript targeting (for example `data-hook="run"`, `data-hook="copy"`, `data-hook="stop"`).
- Keep visual semantics in classes (`utility`, `run`, `copy`, etc.).

## Drag and Drop Variant

Use the drag and drop variant for activities that match a source choice to a destination. The same interaction must work by dragging or by selecting the source and destination buttons.

### Structure

- `ocs__dnd`: activity wrapper and shared color scope
- `ocs__dnd-header`: title and reset-control row
- `ocs__dnd-status`: live feedback; use `role="status"` and `aria-live="polite"`
- `ocs__dnd-progress`: optional progress or score text
- `ocs__dnd-layout`: responsive panel layout
- `ocs__dnd-panel`: source or destination group
- `ocs__dnd-panel-title`: panel heading

### Controls

- `ocs__drag-btn`: source button; add `draggable="true"` and `aria-pressed="false"`
- `ocs__drop-btn`: destination button
- `ocs__dnd-reset`: resets the activity
- `ocs__dnd-input`: optional labeled text input

### States

- `is-selected`: the source is selected and waiting for a destination
- `is-over`: a dragged source is over a destination
- `is-filled`: the destination accepted its matching source
- `disabled` attribute: the source or destination has already been completed

JavaScript must keep `aria-pressed` synchronized with `is-selected`, announce results through `ocs__dnd-status`, and provide the click-based path for keyboard and touch users.

```html
<button class="ocs__drag-btn" type="button" draggable="true" aria-pressed="false">
    CPU
</button>
<button class="ocs__drop-btn" type="button">
    CPU socket
</button>
```
