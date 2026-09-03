#!/usr/bin/env python3
"""Build a live contrast harness that tests components in ALL theme contexts.

tools/contrast.py checks the TOKENS. This checks what actually PAINTS, which is
a different question -- a token can be correct while a cascade conflict means a
different declaration wins. That is exactly how the .ocs-btn 1.00:1 bug hid.

Three contexts, because each has a different failure mode:
  1. default dark
  2. .ocs-light          (opt-in light surfaces)
  3. .user-theme-active  (the legacy runtime theme, WITH its real stylesheet)
"""
import pathlib

JJ = pathlib.Path(__file__).resolve().parent.parent.parent.parent
OCS = (JJ / "assets/css/ocs.css").read_text()
# The real legacy theme sheet, compiled on demand so the harness always tests
# against what the site actually ships.
import subprocess, tempfile, shutil, sys
def _find_dart_sass():
    """A bare `sass` on PATH is often the rbenv Ruby Sass shim, which cannot
    compile this project. Probe each candidate and keep the first real one."""
    cands = [str(pathlib.Path.home() / "ocs-design-system/dart-sass/sass"),
             shutil.which("sass"), "npx sass"]
    for c in cands:
        if not c:
            continue
        try:
            r = subprocess.run(c.split() + ["--version"], capture_output=True,
                               text=True, timeout=60)
            if r.returncode == 0 and "Ruby Sass" not in r.stdout:
                return c.split()
        except Exception:
            continue
    sys.exit("Dart Sass not found. Install: npm i -g sass  (or brew install sass/sass/sass)")

_sass = _find_dart_sass()
_entry = tempfile.NamedTemporaryFile("w", suffix=".scss", delete=False)
_entry.write('@import "open-coding/user-preferences";\n'); _entry.close()
_out = tempfile.NamedTemporaryFile(suffix=".css", delete=False); _out.close()
try:
    subprocess.run(_sass + [f"--load-path={JJ/'_sass'}", "--no-source-map", "--quiet",
                    _entry.name, _out.name], check=True)
    LEGACY = pathlib.Path(_out.name).read_text()
except Exception as e:
    sys.exit(f"could not compile the legacy theme sheet: {e}")

# One specimen per component that renders text on a surface.
SPECIMENS = """
  <button class="ocs-btn ocs-btn--primary">Primary</button>
  <button class="ocs-btn ocs-btn--secondary">Secondary</button>
  <button class="ocs-btn ocs-btn--ghost">Ghost</button>
  <button class="ocs-btn ocs-btn--danger">Danger</button>
  <input class="ocs-input" value="Input text">
  <select class="ocs-select"><option>Select</option></select>
  <textarea class="ocs-textarea">Textarea</textarea>
  <span class="ocs-badge ocs-badge--brand">brand</span>
  <span class="ocs-badge ocs-badge--info">info</span>
  <span class="ocs-badge ocs-badge--success">success</span>
  <span class="ocs-badge ocs-badge--warning">warning</span>
  <span class="ocs-badge ocs-badge--danger">danger</span>
  <span class="ocs-badge ocs-badge--neutral">neutral</span>
  <div class="ocs-alert ocs-alert--info"><div class="ocs-alert__content">
    <p class="ocs-alert__title">Info title</p><p>Info body copy</p></div></div>
  <div class="ocs-alert ocs-alert--success"><div class="ocs-alert__content">
    <p class="ocs-alert__title">Success title</p><p>Success body copy</p></div></div>
  <div class="ocs-alert ocs-alert--warning"><div class="ocs-alert__content">
    <p class="ocs-alert__title">Warning title</p><p>Warning body copy</p></div></div>
  <div class="ocs-alert ocs-alert--danger"><div class="ocs-alert__content">
    <p class="ocs-alert__title">Danger title</p><p>Danger body copy</p></div></div>
  <div class="ocs-card"><div class="ocs-card__header">
    <h3 class="ocs-card__title">Card title</h3></div>
    <div class="ocs-card__body">Card body copy</div></div>
  <nav><a class="ocs-sidenav__link" aria-current="page" href="#">Current nav item</a></nav>
  <nav><a class="ocs-sidenav__link" href="#">Plain nav item</a></nav>
  <a class="ocs-topbar__link" aria-current="page" href="#">Current topbar</a>
  <p class="ocs-help">Helper text</p>
  <p class="ocs-error">Error text</p>
  <code class="ocs-code-inline">inline code</code>
  <kbd class="ocs-kbd">Ctrl</kbd>
  <table class="ocs-table"><thead><tr><th scope="col">Header cell</th></tr></thead>
    <tbody><tr><td>Body cell</td></tr></tbody></table>
"""

HARNESS = r"""
function parseColor(str) {
  // color(srgb r g b / a) is NOT accepted by canvas fillStyle in Chrome, which
  // silently leaves the previous value -- that produced two FALSE failures
  // (1.1:1 and 1:1) on values that were actually fine. Parse it directly.
  const m = String(str).match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/);
  if (m) {
    return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255,
             a: m[4] === undefined ? 1 : +m[4] };
  }
  const c = document.createElement('canvas').getContext('2d');
  c.fillStyle = '#000';           // reset so an invalid value is detectable
  c.fillStyle = str;
  const hex = c.fillStyle;
  if (typeof hex === 'string' && hex[0] === '#') {
    const h = hex.slice(1);
    const n = h.length === 3
      ? h.split('').map(x => parseInt(x + x, 16))
      : [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    return { r: n[0], g: n[1], b: n[2], a: 1 };
  }
  const parts = String(hex).match(/[\d.]+/g) || [0, 0, 0, 1];
  return { r: +parts[0], g: +parts[1], b: +parts[2],
           a: parts[3] === undefined ? 1 : +parts[3] };
}

function lum({ r, g, b }) {
  const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function over(fg, bg) {           // alpha-composite fg onto bg
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

// Walk ancestors until an opaque background is found -- a transparent
// background does NOT mean "no background", it means "whatever is behind it".
function paintedBg(el) {
  let node = el, stack = [];
  while (node && node !== document.documentElement.parentNode) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c.a > 0) stack.push(c);
    if (c.a === 1) break;
    node = node.parentElement;
  }
  let base = { r: 255, g: 255, b: 255, a: 1 };
  for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
  return base;
}

function ratio(el) {
  const cs = getComputedStyle(el);
  const bg = paintedBg(el);
  const fg = over(parseColor(cs.color), bg);
  const A = lum(fg), B = lum(bg);
  const hi = Math.max(A, B), lo = Math.min(A, B);
  return (hi + 0.05) / (lo + 0.05);
}

function isLarge(el) {
  const cs = getComputedStyle(el);
  const px = parseFloat(cs.fontSize);
  const bold = parseInt(cs.fontWeight, 10) >= 700;
  return px >= 24 || (bold && px >= 18.66);
}

function audit() {
  const out = [];
  document.querySelectorAll('.ctx').forEach(ctx => {
    const label = ctx.dataset.label;
    ctx.querySelectorAll('button, input, select, textarea, .ocs-badge, .ocs-alert__title, .ocs-alert__content > p, .ocs-card__title, .ocs-card__body, .ocs-sidenav__link, .ocs-topbar__link, .ocs-help, .ocs-error, .ocs-code-inline, .ocs-kbd, th, td').forEach(el => {
      const text = (el.value || el.textContent || '').trim();
      if (!text) return;
      const r = ratio(el);
      const need = isLarge(el) ? 3 : 4.5;
      out.push({
        ctx: label,
        el: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ').filter(c => c.startsWith('ocs')).slice(0, 2).join('.'),
        text: text.slice(0, 22),
        ratio: +r.toFixed(2),
        need,
        pass: r >= need
      });
    });
  });
  return out;
}
window.__audit = audit;
"""


def ctx(label, cls, extra=""):
    return f'<section class="ctx {cls}" data-label="{label}"{extra}><h2>{label}</h2>{SPECIMENS}</section>'


HTML = f"""<meta charset="utf-8">
<title>Contrast harness</title>
<style>
{OCS}
</style>
<style>
/* the REAL legacy theme stylesheet, loaded after ours, exactly as in production */
{LEGACY}
</style>
<style>
  body {{ margin:0; font-family:var(--ocs-font-sans); }}
  .ctx {{ padding:1.5rem; display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-start;
         background:var(--ocs-surface-base); color:var(--ocs-text); }}
  .ctx > h2 {{ flex:1 0 100%; margin:0 0 .5rem; font-size:.8rem; letter-spacing:.08em;
              text-transform:uppercase; color:var(--ocs-text-muted); }}
  .ctx > * {{ max-width:340px; }}
</style>

{ctx("default dark", "")}
{ctx("ocs-light", "ocs-light")}
{ctx("user-theme-active", "user-theme-active")}

<script>
{HARNESS}
</script>
"""

out = JJ / "_sass/ocs/tools/contrast-harness.html"
out.write_text(HTML)
print(f"wrote {out} ({len(HTML):,} bytes)")
