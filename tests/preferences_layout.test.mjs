import assert from 'node:assert/strict';
import test from 'node:test';

// preferences.js reads window while it loads, so it's imported after this stub.
globalThis.window = {};
const { initPreferencesLayout } = await import('../assets/js/pages/dashboard/preferences-layout.js');
const { FormatConverter } = await import('../assets/js/pages/dashboard/preferences.js');

function element(value = '') {
  const painted = {}, listeners = {};
  return {
    value, painted, dataset: {}, textContent: '',
    style: { setProperty: (name, val, priority) => { painted[name] = { val, priority }; } },
    addEventListener(name, callback) { listeners[name] = callback; },
    setAttribute() {},
    click() { this.clicks = (this.clicks || 0) + 1; listeners.click?.(); },
  };
}

/** The Preferences tab: inputs by id, the preview's parts by selector */
function page() {
  const inputs = {
    'pref-bg-color': element('#f4ecd8'), 'pref-text-color': element('#3b2f2f'), 'pref-accent-color': element('#b45309'),
    'pref-selection-color': element('#b45309'), 'pref-font-family': element('Georgia'), 'pref-font-size': element('15'),
    'pref-button-style': element('pill'), 'save-preferences': element(),
  };
  const heading = element(), paragraph = element(), saveAll = element();
  const preview = element();
  const parts = {
    '#prefs-preview': preview, '[data-save-all]': saveAll, '#prefs-check-text': element(), '#prefs-check-accent': element(),
    '.ocs__prefs-preview-bar': element(), '.ocs__prefs-preview-body': { ...element(), querySelectorAll: () => [heading, paragraph] }, '[data-preview="selection"]': element(),
    '[data-preview="link"]': element(), '[data-preview="button"]': element(), '[data-preview="ghost"]': element(),
  };
  const root = { dataset: {}, querySelector: selector => parts[selector] ?? null, querySelectorAll: () => [] };
  globalThis.document = {
    getElementById: id => (id === 'tab-content-preferences' ? root : inputs[id] ?? null),
    listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; },
  };
  return { inputs, parts, heading, paragraph, saveAll };
}

test("the live preview's colors beat the site theme's !important text colors", () => {
  const { parts, heading, paragraph } = page();
  initPreferencesLayout();
  for (const el of [heading, paragraph]) assert.deepEqual(el.painted.color, { val: '#3b2f2f', priority: 'important' });
  assert.deepEqual(parts['[data-preview="link"]'].painted.color, { val: '#b45309', priority: 'important' });
  assert.deepEqual(parts['[data-preview="button"]'].painted['background-color'], { val: '#b45309', priority: 'important' });
  assert.deepEqual(parts['[data-preview="ghost"]'].painted.color, { val: '#3b2f2f', priority: 'important' });
});

test('the preview redraws once the saved preferences are in the form', () => {
  const { inputs, heading } = page();
  initPreferencesLayout();
  inputs['pref-text-color'].value = '#112233';
  document.listeners['prefs:loaded']();
  assert.equal(heading.painted.color.val, '#112233');
});

test('a voice volume of 0 survives saving and loading', () => {
  assert.equal(FormatConverter.toBackend({ ttsVolume: 0 }).ttsVolume, 0);
  assert.equal(FormatConverter.toFrontend({ backgroundColor: '#000000', ttsVolume: 0 }).ttsVolume, 0);
});

test('Button style falls back to Default, not Rounded', () => {
  assert.equal(FormatConverter.toBackend({}).buttonStyle, 'default');
  assert.equal(FormatConverter.toFrontend({ backgroundColor: '#000000' }).buttonStyle, 'default');
});

test('the Language & voice Save presses the one Save', () => {
  const { inputs, saveAll } = page();
  initPreferencesLayout();
  saveAll.click();
  assert.equal(inputs['save-preferences'].clicks, 1);
});
