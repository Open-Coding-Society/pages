// The site themes stay readable: every preset and holiday theme in assets/js/user-preferences.js
// keeps WCAG AA contrast for the colors the ocs__ grammar draws text in.
// Run: node --test tests/theme_contrast.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ENGINE = new URL('../assets/js/user-preferences.js', import.meta.url);

// The engine in a page with nothing on it: it sets CSS variables on <html> and writes one <style>.
function loadEngine({ stored = {} } = {}) {
  const props = new Map();
  const elements = new Map();
  const storage = new Map(Object.entries(stored));
  const documentElement = {
    style: { setProperty: (name, value) => props.set(name, value), removeProperty: (name) => props.delete(name) },
    classList: { add() {}, remove() {}, contains: () => false },
    dataset: {},
    getAttribute: () => null,
    setAttribute() {},
  };
  const document = {
    readyState: 'loading',
    documentElement,
    cookie: '',
    addEventListener() {},
    querySelector: () => null,
    getElementById: (id) => elements.get(id) || null,
    createElement: () => ({ style: {} }),
    head: { appendChild: (element) => elements.set(element.id, element) },
    body: { appendChild() {} },
  };
  const localStorage = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  };
  const window = { document, localStorage, location: { hostname: 'localhost', reload() {} } };
  vm.runInContext(readFileSync(ENGINE, 'utf8'), vm.createContext({ window, document, localStorage, console }));
  return {
    api: window.SitePreferences,
    token: (name) => props.get(name),
    sheet: () => (elements.get('user-theme-override-css') || {}).textContent || '',
    root: documentElement,
  };
}

// WCAG 2 contrast, written out here so the test does not trust the engine's own math.
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex) => channels(hex)
  .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};
const mix = (a, b, share) => '#' + channels(a)
  .map((v, i) => Math.round(v * share + channels(b)[i] * (1 - share)).toString(16).padStart(2, '0')).join('');

const { api } = loadEngine();
const THEMES = { ...api.PRESETS, ...api.SEASONAL_THEMES };

// Each theme applied on its own, with the tokens the grammar reads.
function applied(theme) {
  const engine = loadEngine();
  engine.api.applyPreferences({ bg: theme.bg, text: theme.text, accent: theme.accent });
  const t = (name) => engine.token(name).toLowerCase();
  return {
    bg: t('--pref-bg-color'), text: t('--pref-text-color'), accent: t('--pref-accent-color'),
    panel: t('--panel'), panelMid: t('--panel-mid'), uiBg: t('--ui-bg'), muted: t('--text-muted'),
    fieldBorder: t('--field-border'), sheet: engine.sheet(),
  };
}

function atLeast(ratio, floor, what) {
  assert.ok(ratio >= floor, `${what}: ${ratio.toFixed(2)}:1, needs ${floor}:1`);
}

for (const [name, theme] of Object.entries(THEMES)) {
  test(`${name}: text and accent read at 4.5:1 on the page and on panels`, () => {
    const c = applied(theme);
    atLeast(contrast(c.text, c.bg), 4.5, 'text on the page');
    atLeast(contrast(c.text, c.panel), 4.5, 'text on --panel');
    atLeast(contrast(c.text, mix(c.accent, c.panel, 0.12)), 4.5, 'text on a 12% accent tint (badges, pills, selected rows)');
    atLeast(contrast(c.accent, c.bg), 4.5, 'links and accent text on the page');
    atLeast(contrast(c.accent, c.panel), 4.5, 'links and accent text on --panel (cards)');
    atLeast(contrast(c.bg, c.accent), 4.5, 'page-colored text on an accent fill');
  });

  test(`${name}: muted text reads at 4.5:1 on every surface`, () => {
    const c = applied(theme);
    for (const [surface, color] of Object.entries({ page: c.bg, '--ui-bg': c.uiBg, '--panel': c.panel, '--panel-mid': c.panelMid })) {
      atLeast(contrast(c.muted, color), 4.5, `--text-muted on ${surface}`);
    }
  });

  test(`${name}: an empty field's frame shows at 3:1 on the page and on panels`, () => {
    const c = applied(theme);
    const frame = /textarea \{[^}]*border-color: (#[0-9a-f]{6}) !important;/.exec(c.sheet);
    assert.ok(frame, 'the theme sheet sets a field frame');
    assert.equal(c.fieldBorder, frame[1], '--field-border, which the theme Sass uses for question fields, is the same frame');
    atLeast(contrast(frame[1], c.panel), 3, 'field frame on --panel');
    atLeast(contrast(frame[1], c.bg), 3, 'field frame on the page');
  });
}

test('a theme saved with a preset\'s old colors is drawn with the preset\'s current ones', () => {
  const engine = loadEngine();
  engine.api.applyPreferences({ bg: '#ffffff', text: '#FF80AA', accent: '#2563eb' });
  assert.equal(engine.token('--pref-text-color'), api.PRESETS.Light.text);
  assert.equal(engine.token('--pref-accent-color'), api.PRESETS.Light.accent);
});

test('a custom theme is drawn with the colors it was saved with', () => {
  const engine = loadEngine();
  engine.api.applyPreferences({ bg: '#ffffff', text: '#FF80AA', accent: '#123456' });
  assert.equal(engine.token('--pref-text-color'), '#FF80AA');
  assert.equal(engine.token('--pref-accent-color'), '#123456');
});

test('a holiday theme kept with its wallpaper keeps the wallpaper after its colors change', () => {
  const old = { bg: '#0f2a1d', text: '#f8f8f8', accent: '#ff4d5e' };
  const engine = loadEngine({ stored: { siteThemeDecor: JSON.stringify({ ...old, decor: ['🎄'] }) } });
  engine.api.applyPreferences(old);
  assert.ok('themeDecor' in engine.root.dataset, 'the wallpaper is on');
  assert.equal(engine.token('--pref-accent-color'), api.SEASONAL_THEMES.christmas.accent);
});

test('the default button shape leaves ocs__btn its own shapes; a picked shape reaches ocs__btn links too', () => {
  const rounded = loadEngine();
  rounded.api.applyPreferences({ ...api.PRESETS.Midnight, buttonStyle: 'rounded' });
  assert.match(rounded.sheet(), /button:where\(:not\(\.ocs__btn\)\)/);
  assert.doesNotMatch(rounded.sheet(), /html\.user-theme-active \.ocs__btn,/);

  const square = loadEngine();
  square.api.applyPreferences({ ...api.PRESETS.Midnight, buttonStyle: 'square' });
  assert.match(square.sheet(), /html\.user-theme-active \.ocs__btn,[^{]*\{\s*border-radius: 0 !important;/);
});
