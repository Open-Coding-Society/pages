# Theme organization

## Current theme contract

`user-preferences.scss` defines the current user-selectable theme contract:

- `--pref-bg-color`
- `--pref-text-color`
- `--pref-font-family`
- `--pref-font-size`
- `--pref-accent-color`

New reusable OCS elements should use these tokens and derived UI variables such as `--panel`, `--ui-bg`, and `--ui-border`.

## Legacy compatibility

`legacy/user-colors.scss` is the editable Sass palette used by older components.
`legacy/root-color-map.scss` is generated compatibility infrastructure. Run the color-map generator instead of editing the generated file directly.

The old paths `_sass/user-colors.scss`, `_sass/root-color-map.scss`, and `_sass/open-coding/user-preferences.scss` remain compatibility wrappers for older imports.
