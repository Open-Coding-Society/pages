# OCS Design System

The component foundation for Open Coding Society. Dark-first, token-driven,
contrast-verified.

**Status:** draft, uncommitted. Nothing in this directory has been committed or
pushed. It is additive — no existing file was modified.

---

## Why this exists

The current styling in `Open-Coding-Society/pages` and
`Open-Coding-Society/spring` has four structural problems. Each one is
measured, not asserted.

| Problem | Evidence |
|---|---|
| **Generated files outlived their generators.** `_sass/root-color-map.scss` says "DO NOT EDIT MANUALLY — run `scripts/update_color_map.py`". That script does not exist. Neither does `apply_user_colors.py`, nor the `make update-colors` target that `user-colors.scss:3` tells you to run. The Makefile calls the missing script at three places, each guarded by `\|\| echo "continuing"`, so it fails silently. | `Makefile:133,143,153`; `scripts/` listing |
| **Generic class names collide.** 15 classes ship at brace-depth 0 with unprefixed single-word names, including `.row`, `.column` and `.button` from `elements/buttons/variant-calculator.scss` — which directly collide with Bootstrap's grid, and the Spring app loads Bootstrap 5.0.2 from a CDN. | `variant-calculator.scss`, `_states.scss`, `variant-filled.scss`, `toggles.scss` |
| **`@import` is on a deprecation clock.** Every file uses it. Dart Sass has deprecated `@import` and will remove it. `_config.yml` already carries a commented-out `silence_deprecations: [import]`, so the warnings have already been hit. | `_config.yml`, `_sass/**` |
| **No accessibility primitives.** No `:focus-visible` styles, no `prefers-reduced-motion` handling, no screen-reader-only utility — while the docs claim WCAG 2.1 AA. | grep across `_sass/` |

In the Spring repo the same pattern is worse: `bathroom-style.css` is a
**421 KB byte-for-byte copy** of `style.css` differing in one value
(`--bs-table-bg`). There was no way to override a single token, so the whole
stylesheet was duplicated.

---

## Colour: how the values were derived

Nothing here was eyeballed.

**Brand anchor.** `#E06665`, sampled from `assets/images/ocs-logo.png` — it is
55.2% of the opaque pixels, the coral "CS" monogram. The logo is coral, not
green and not blue.

**Ramps.** Generated in CIELAB with even perceptual lightness steps
(L\* 96 → 20). Each anchor is pinned at its *natural* lightness step rather than
forced to 500, because forcing it breaks monotonicity — `#34C759` has L\* 71,
so pinning it at 500 (target L\* 56) would have made step 500 lighter than
step 400.

**The contrast contract.** Every foreground token is solved against
`#2C2C2E`, the *hardest* surface in the system. That means a token is never
unsafe depending on where it lands.

| Guarantee | Threshold |
|---|---|
| `*-fg` on base, raised **and** elevated | ≥ 4.5:1 (AA normal text) |
| `*-border` on raised surface | ≥ 3:1 (AA UI component) |
| `*-fg` on its own `*-bg` tint | ≥ 4.5:1 |
| `*-bg` tint vs raised surface | ≥ 1.18:1 (the tint is visible) |

**Values that had to move to pass.**

| Token | Was | Measured | Now | Now measures |
|---|---|---|---|---|
| muted text | `#8E8E93` | 4.27:1 | `#949498` | 4.61:1 |
| interactive blue | `#007AFF` | 3.47:1 | `#5293FF` | 4.63:1 |
| brand text | `#E06665` | 4.15:1 | `#EA706E` | 4.67:1 |
| danger text | `#FF453A` | 4.09:1 | `#FF5E4D` | 4.62:1 |
| light-mode muted | neutral-600 | 3.98:1 | neutral-700 | 5.55:1 |

The originals are kept as `*-border`, where the 3:1 UI threshold applies and
they pass.

Re-run `tools/contrast.py` after changing any colour.

---

## Runtime theming — the bridge

`_sass/open-coding/user-preferences.scss:3-22` defines a live theme contract on
`:root`, and a JS preferences panel rewrites it. `--pref-accent-color` is the
single most-consumed variable in the codebase (**177 usages** across `_sass`),
and `.user-theme-active` applies its rules with `!important`.

Any system that ignored that contract would be overridden on every themed page.
So:

- **By default** OCS renders in its own contrast-verified coral palette.
- **Under `.user-theme-active`** it re-points `--ocs-accent` and the surfaces at
  the user's `--pref-*` values.
- **Brand marks keep the fixed coral** so identity survives a theme swap.

> **Caveat:** inside `.user-theme-active` the AA guarantees above no longer
> hold, because the user can choose any accent. That is inherent to
> user-chosen theming, not a defect in the tokens.

---

## Class grammar

```
.ocs-<block>[__<element>][--<modifier>]
```

Every class is prefixed `ocs-`. Modifiers are scoped to their block —
`.ocs-btn--sm`, never a bare `.sm`. Nothing generic is emitted.

```html
<button class="ocs-btn ocs-btn--primary ocs-btn--lg">Save</button>
<button class="ocs-btn ocs-btn--ghost ocs-btn--icon" aria-label="Edit">…</button>
```

Order modifiers **variant → size → shape**.

### State comes from ARIA, not classes

Styling keys off the accessibility tree, so visual state and announced state
cannot drift apart:

| State | Selector |
|---|---|
| current nav item | `[aria-current]` |
| selected tab | `[aria-selected="true"]` |
| invalid field | `[aria-invalid="true"]` |
| busy button | `[aria-busy="true"]` |
| disabled | `:disabled`, `[aria-disabled="true"]` |

There is no `.active` class to forget to update.

---

## Layout

```
_sass/ocs/
  _index.scss            public entry — @use "ocs"
  core/
    _tokens.scss         every value, with derivation comments
    _functions.scss      typed accessors; a bad key fails the BUILD
    _css-vars.scss       emits --ocs-*, bridges to --pref-*
    _a11y.scss           focus, sr-only, reduced-motion, forced-colors
  components/            button field card alert badge table modal nav toast
                         progress menu avatar skeleton code tooltip
  utilities/_layout.scss small layout set — NOT a utility-first framework
  compat/_legacy.scss    keeps .ocs__btn grammar alive; delete when unused
  tools/contrast.py      the verifier

assets/js/ocs.js         behaviour layer (optional, ~11 KB, zero dependencies)
```

### The behaviour layer

`assets/js/ocs.js` is optional — every component is styled and usable without
it. It adds what CSS cannot express:

| | |
|---|---|
| Tabs | Full WAI-ARIA pattern: roving tabindex, Arrow/Home/End, panel sync |
| Menus | Arrow keys, wrap, skips disabled items, Home/End, type-ahead, Tab-to-close |
| Modals | `data-ocs-open` / `data-ocs-close`, backdrop-click dismiss |
| Toasts | `OCS.toast({variant, title, message, duration})` |
| Switch | Keeps `aria-checked` in step with `role="switch"` |
| Table regions | Adds `tabindex="0"` **only** when actually scrollable |

Toast copy is written with `textContent`, never `innerHTML`, so a message
carrying user data cannot inject markup.

**WCAG 2.2.1.** A toast timer pauses on hover and on focus, and resumes on
leave. If the budget is already spent when it resumes, it dismisses
immediately — returning early there stranded the toast on screen permanently
whenever a background tab throttled timers past the nominal duration.

Built on platform primitives rather than reimplementations: `<dialog>` for the
focus trap and top layer, the popover API for menus, `:focus-visible` for focus
rings, `anchor-name` for menu positioning behind an `@supports` guard.

Built entirely on `@use` / `@forward`. Zero `@import`.

### Token access

```scss
@use "ocs/core/functions" as fn;

.thing {
  padding: fn.space(3) fn.space(4);
  color: fn.semantic(danger, fg);
  font-size: fn.typo(h2, size);
}
```

`fn.space(99)` fails the build with a list of valid keys. Reaching into the raw
maps would silently emit `null`.

---

## Using it

### In Jekyll

```scss
// _sass/open-coding/_main.scss
@use "../ocs";              // MUST be the first rule in the file
@import 'root-color-map.scss';
@import "mixins/variables";
// … the rest of the existing imports, unchanged
```

`@use` **must** come before every `@import`, or Dart Sass errors with
*"@use rules must be written before any other rules."* This is a hard language
rule, not a preference.

**Verified against the real codebase.** Compiling `open-coding/_main.scss`
together with this module:

| | |
|---|---|
| legacy alone | 495 KB (21,569 lines, 949 classes) |
| ocs alone | 42 KB (149 classes) |
| both together | 541 KB — compiles clean, no errors |
| class-name overlap | **4 of 949** |

The four shared names are all benign:

- `.small` / `.medium` / `.large` — legacy emits these **bare and global**
  (10 rules each). This module only ever emits them compound-scoped as
  `.ocs__btn.small`, which is specificity (0,2,0) against legacy's (0,1,0),
  so the scoped rule wins on OCS buttons and legacy is untouched everywhere else.
- `.user-theme-active` — legacy declares 35 rules there, all ordinary properties
  with `!important`. This module declares exactly one rule there, setting only
  `--ocs-*` custom properties. Zero property overlap.

### In the Spring / Thymeleaf app

That repo has no Node build — no `package.json`, no `node_modules`, and no Sass
plugin in `pom.xml`. Its `style.scss` imports
`../../../../../node_modules/bootstrap/scss/bootstrap`, which resolves to
`src/node_modules/` (one level short of the repo root) and cannot compile from a
fresh clone.

So ship it **pre-compiled**:

```bash
sass --load-path=_sass --style=compressed --no-source-map \
     ocs-entry.scss src/main/resources/static/assets/css/ocs.css
```

Two things must also change there before it works:

1. Static assets are not permitted in Spring Security. `MvcSecurityConfig.java:112`
   is `.anyRequest().authenticated()` under `.securityMatcher("/**")` with no
   exemption, so `/assets/css/style.css` currently **302-redirects to `/login`**
   and never loads for a logged-out visitor.
2. The CDN Bootstrap 5.0.2 in `layouts/base.html:19` will fight the tokens.

---

## Compatibility

`compat/_legacy.scss` keeps the previous grammar working:

| Old | New |
|---|---|
| `.ocs__btn` | `.ocs-btn` |
| `.ocs__btn.small` / `.large` | `.ocs-btn--sm` / `--lg` |
| `.ocs__btn.alert-red` | `.ocs-btn--danger` |
| `.ocs__btn.fill` / `.pill` | solid variant / `.ocs-btn--pill` |
| `.ocs__links` | `.ocs-cluster` |

It deliberately does **not** re-emit the bare `.small`, `.large`, `.row`,
`.column`, `.button`, `.primary`, `.secondary` globals. Those are honoured only
when already scoped to a button. Delete this file once no page uses the old
grammar.

---

## Measured output

| | |
|---|---|
| Compiled size | 49.4 KB uncompressed |
| Components | 15 |
| Distinct classes | 177 |
| Bare **unprefixed** selectors | **1** — `.user-theme-active`, the documented theme bridge |
| `@import` | **0** |
| Sass deprecation warnings | **0** |
| ID selectors | **0** |
| Bare global element selectors | **0** |
| `!important` | 34 — all in `sr-only` (16), reduced-motion (4), spacing utilities (14) |
| Contrast checks | **44/44 pass** (`tools/contrast.py`, exit 0) |

The nine other unprefixed names — `.small`, `.medium`, `.large`, `.fill`,
`.pill`, `.alert-red/-yellow/-green` — come from the compat layer and are only
ever emitted **compound-scoped** to `.ocs__btn`, never standalone.

For comparison, the Spring app's `style.css` is 421 KB, of which 214 KB (51%) is
a second full copy of Bootstrap nested under `.dark-mode`.

---

## Known gaps

- **Light mode is opt-in and less tested.** `.ocs-light` re-solves the
  foregrounds for light surfaces, and those values are contrast-checked, but the
  site is dark-first and this path has not been exercised on real pages.
- **Menus need the popover API.** `_menu.scss` relies on `popover` and, for
  positioning, `anchor-name`. The `@supports` guard means older engines still
  get a usable menu, just centred rather than anchored. No JS fallback ships.
- **Not integrated.** Nothing imports `_sass/ocs` yet — the `@use` line is a
  deliberate, separate step. Compilation *alongside* the existing sass is
  verified (see the table above); rendering a real OCS page through it is not.
- **Popover `toggle` is async.** Menu focus lands on the first item shortly
  after `showPopover()` returns, not synchronously. Anything scripting a menu
  open must wait a tick before asserting on focus.
- **`--ocs-accent-contrast` is a fixed value.** Under a user theme it can fall
  below AA against a light custom accent. Fixing it properly needs either
  `color-contrast()` (not yet reliable) or a JS-computed value.
