#!/usr/bin/env python3
"""Generate design-system.md from the real token file and component sources.

Hand-written docs drift. The token table here is read out of _tokens.scss on
every build, so a token that is renamed or removed cannot quietly survive in
the documentation. Run from the repo root:  python3 _sass/ocs/tools/build-docs.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[3]
CSS  = ROOT / 'assets/css/ocs.css'
OUT  = ROOT / 'design-system.md'

if not CSS.exists():
    sys.exit('assets/css/ocs.css missing - run _sass/ocs/tools/build.sh first')

css = CSS.read_text()
root_block = re.search(r':root\s*\{(.*?)\n\}', css, re.S)
tokens = re.findall(r'(--ocs-[a-z0-9-]+)\s*:\s*([^;]+);', root_block.group(1))

GROUPS = [
    ('Semantic colour', lambda k: any(k.startswith('--ocs-' + r) for r in
        ('brand', 'accent', 'info', 'success', 'warning', 'danger'))),
    ('Text',    lambda k: k.startswith('--ocs-text')),
    ('Surface', lambda k: k.startswith('--ocs-surface')),
    ('Border',  lambda k: k.startswith('--ocs-border')),
    ('Spacing', lambda k: k.startswith('--ocs-space')),
    ('Radius',  lambda k: k.startswith('--ocs-radius')),
    ('Motion',  lambda k: k.startswith(('--ocs-duration', '--ocs-ease'))),
]

def token_tables():
    out, seen = [], set()
    for name, test in GROUPS:
        rows = [(k, v.strip()) for k, v in tokens if k not in seen and test(k)]
        seen.update(k for k, _ in rows)
        if not rows:
            continue
        out.append(f'\n**{name}**\n')
        out.append('| Token | Value |')
        out.append('|---|---|')
        out += [f'| `{k}` | `{v[:44]}` |' for k, v in rows]
    return '\n'.join(out)

def demo(title, note, html):
    return f"""
### {title}

{note}

<div class="ds-demo">{html}</div>

```html
{html.strip()}
```
"""

COMPONENTS = [
 ('Button', 'Four variants, three sizes. `disabled` is styled from the attribute, not a class.',
  '<button class="ocs-btn ocs-btn--primary">Primary</button>\n'
  '<button class="ocs-btn ocs-btn--secondary">Secondary</button>\n'
  '<button class="ocs-btn ocs-btn--ghost">Ghost</button>\n'
  '<button class="ocs-btn ocs-btn--danger">Danger</button>\n'
  '<button class="ocs-btn ocs-btn--primary" disabled>Disabled</button>'),
 ('Badge', 'Use the semantic set so the meaning is not carried by hue alone.',
  '<span class="ocs-badge ocs-badge--success">passing</span>\n'
  '<span class="ocs-badge ocs-badge--warning">flaky</span>\n'
  '<span class="ocs-badge ocs-badge--danger">failing</span>\n'
  '<span class="ocs-badge ocs-badge--info">queued</span>'),
 ('Form field', 'The label is a real `<label for>`, and help text sits under the control.',
  '<label class="ocs-label" for="ds-name">Project name</label>\n'
  '<input class="ocs-input" id="ds-name" value="unit-3-lesson">\n'
  '<p class="ocs-help">Lowercase letters, numbers and hyphens.</p>'),
 ('Alert', 'A coloured left border carries the meaning alongside the hue.',
  '<div class="ocs-alert ocs-alert--warning"><div class="ocs-alert__content">\n'
  '  <p class="ocs-alert__title">Heads up</p>\n'
  '  <p>Your last submission had no tests.</p>\n'
  '</div></div>'),
 ('Card', 'A header and a body. Nothing else is required.',
  '<div class="ocs-card">\n'
  '  <div class="ocs-card__header"><h3 class="ocs-card__title">Unit 3</h3></div>\n'
  '  <div class="ocs-card__body">Four assignments, two graded.</div>\n'
  '</div>'),
 ('Table', 'Wrap it so wide tables scroll inside their own box rather than the page.',
  '<div class="ocs-table-wrap" role="region" aria-label="Students" tabindex="0">\n'
  '  <table class="ocs-table ocs-table--compact">\n'
  '    <thead><tr><th scope="col">Student</th><th scope="col">Status</th></tr></thead>\n'
  '    <tbody><tr><td>A. Rivera</td><td><span class="ocs-badge ocs-badge--success">on track</span></td></tr></tbody>\n'
  '  </table>\n</div>'),
 ('Progress', 'Set the width from your own data.',
  '<div class="ocs-progress"><div class="ocs-progress__bar" style="width:68%"></div></div>'),
]

page = f"""---
layout: page
title: Design System
permalink: /design-system
search_exclude: false
---

<link rel="stylesheet" href="{{{{ '/assets/css/ocs.css' | relative_url }}}}">
<style>
.ds-demo {{ display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-start;
  padding:1.25rem; margin:.75rem 0; border:1px solid var(--ocs-border);
  border-radius:12px; background:var(--ocs-surface-base); }}
.ds-demo > * {{ max-width:100%; }}
</style>

A component set for OCS Pages. Every colour here comes from a named token, and
every background token is defined next to the text colour meant to sit on it, so
a readable pair is the thing you reach for.

## Using it

Add the stylesheet to your layout, then use the classes:

```html
<link rel="stylesheet" href="{{{{ '/assets/css/ocs.css' | relative_url }}}}">
<script src="{{{{ '/assets/js/ocs.js' | relative_url }}}}" defer></script>
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
{token_tables()}

## Components
{''.join(demo(t, n, h) for t, n, h in COMPONENTS)}
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
"""

OUT.write_text(page)
print(f'wrote {OUT.relative_to(ROOT)} ({len(page):,} bytes, {len(tokens)} tokens documented)')
