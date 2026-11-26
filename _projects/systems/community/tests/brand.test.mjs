// The demo organization's colors go through the OCS theme engine and stay readable: the same
// 4.5:1 (WCAG AA) that tests/theme_contrast.test.mjs asks of every preset.
// Run: node --test _projects/systems/community/tests/brand.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { Brand } from '../js/brand.js';
import { loadSetup, readRepoFile } from './fixtures.mjs';

// The engine in a page with nothing on it, as tests/theme_contrast.test.mjs loads it.
function loadEngine() {
  const props = new Map();
  const elements = new Map();
  const documentElement = {
    style: { setProperty: (name, value) => props.set(name, value), removeProperty: name => props.delete(name) },
    classList: { add() {}, remove() {}, contains: () => false },
    dataset: {},
    getAttribute: () => null,
    setAttribute() {},
  };
  const document = {
    readyState: 'loading', documentElement, cookie: '', addEventListener() {}, querySelector: () => null,
    getElementById: id => elements.get(id) || null, createElement: () => ({ style: {} }),
    head: { appendChild: element => elements.set(element.id, element) }, body: { appendChild() {} },
  };
  const localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  const window = { document, localStorage, location: { hostname: 'localhost', reload() {} } };
  vm.runInContext(readRepoFile('assets/js/user-preferences.js'), vm.createContext({ window, document, localStorage, console }));
  return { api: window.SitePreferences, token: name => props.get(name) };
}

const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const luminance = hex => channels(hex)
  .map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

test('the brand is a theme the engine takes', () => {
  const theme = Brand.theme(loadSetup());
  assert.deepEqual(Object.keys(theme), ['bg', 'text', 'accent', 'font', 'size']);
  assert.throws(() => Brand.theme({ brand: { ...theme, accent: 'blue' } }), TypeError);
  assert.equal(Brand.apply(undefined, theme), false);
});

test('the demo organization\'s colors keep 4.5:1 for text and the accent, on the page and on panels', () => {
  const engine = loadEngine();
  const theme = Brand.theme(loadSetup());
  assert.equal(Brand.apply(engine.api, theme), true);
  const page = engine.token('--pref-bg-color');
  const panel = engine.token('--panel');
  assert.equal(page, theme.bg);
  assert.equal(engine.token('--pref-accent-color'), theme.accent);
  for (const [name, color] of [['text', theme.text], ['accent', theme.accent], ['muted', engine.token('--text-muted')]]) {
    assert.ok(contrast(color, page) >= 4.5, `${name} on the page: ${contrast(color, page).toFixed(2)}`);
    assert.ok(contrast(color, panel) >= 4.5, `${name} on panels: ${contrast(color, panel).toFixed(2)}`);
  }
  assert.ok(contrast(page, theme.accent) >= 4.5, 'page-colored text on an accent fill');
});

test('preset returns a copy of one of the engine\'s presets', () => {
  const engine = loadEngine();
  assert.equal(Brand.preset(engine.api, 'Sepia').bg, engine.api.PRESETS.Sepia.bg);
  assert.equal(Brand.preset(engine.api, 'Nope'), null);
});
