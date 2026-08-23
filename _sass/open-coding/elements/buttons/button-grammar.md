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
Legacy aliases still compile:
- `ocs__btn--alert-red`
- `ocs__btn--alert-yellow`
- `ocs__btn--alert-green`
- `ocs__btn--alert-fill`

New code should prefer utility grammar above.
