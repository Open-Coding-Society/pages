// The dashboard's live theme preview shows the theme being previewed, not the page's own theme.
// The site's h1-h4 and p rules, and a saved theme's !important text color, would repaint the
// preview's words in the page's colors, so the preview sets each of its text colors as important.
// Run: node --test tests/dashboard_theme_preview.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

// preferences.js reads window.SitePreferences when it loads.
globalThis.window = {};
const { initPreferencesLayout } = await import('../assets/js/pages/dashboard/preferences-layout.js');

// One element of the page: it keeps each style the preview sets and whether it was important.
function fakeElement(children = {}) {
  const style = {
    important: {},
    setProperty(name, value, priority = '') {
      this[name] = value;
      this.important[name] = priority === 'important';
    },
  };
  return {
    style,
    dataset: {},
    textContent: '',
    setAttribute() {},
    addEventListener() {},
    querySelector: (selector) => children[selector] || null,
    querySelectorAll: (selector) => [].concat(children[selector] || []),
  };
}

// The preferences tab with its preview card, and the form filled with these colors.
function openPreview(colors) {
  const parts = {
    heading: fakeElement(),
    sentence: fakeElement(),
    link: fakeElement(),
    button: fakeElement(),
    ghost: fakeElement(),
    selection: fakeElement(),
  };
  const root = fakeElement({
    '#prefs-preview': fakeElement(),
    '.ocs__prefs-preview-bar': fakeElement(),
    '.ocs__prefs-preview-body': fakeElement({ 'h4, p': [parts.heading, parts.sentence] }),
    '[data-preview="link"]': parts.link,
    '[data-preview="button"]': parts.button,
    '[data-preview="ghost"]': parts.ghost,
    '[data-preview="selection"]': parts.selection,
  });
  const values = {
    'pref-bg-color': colors.bg,
    'pref-text-color': colors.text,
    'pref-accent-color': colors.accent,
  };
  globalThis.document = {
    getElementById: (id) => {
      if (id === 'tab-content-preferences') return root;
      return id in values ? { ...fakeElement(), value: values[id] } : null;
    },
    addEventListener() {},
  };
  initPreferencesLayout();
  return parts;
}

test('the preview card writes its words in the previewed theme colors, set as important', () => {
  const sepia = { bg: '#f4ecd8', text: '#8b1e1e', accent: '#924307' };
  const preview = openPreview(sepia);

  for (const [part, color] of [
    ['heading', sepia.text],
    ['sentence', sepia.text],
    ['link', sepia.accent],
    ['ghost', sepia.text],
  ]) {
    assert.equal(preview[part].style.color, color, `${part} color`);
    assert.ok(preview[part].style.important.color, `${part} color is important`);
  }

  // Labels on the accent and selection fills are white or near-black, whichever reads on the fill.
  assert.equal(preview.button.style.color, '#ffffff');
  for (const part of ['button', 'selection']) {
    assert.ok(preview[part].style.important.color, `${part} color is important`);
  }
});
