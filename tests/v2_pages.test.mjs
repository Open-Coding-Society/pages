// The ocs__ restyles (v2) are the main pages. Remaining /v2 addresses send visitors
// there, and every v2 page partial reaches the stylesheet.
// Run: node --test tests/v2_pages.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function frontMatter(text) {
  const block = /^---\n([\s\S]*?)\n---/.exec(text);
  const fields = (block ? block[1] : '').split('\n').map((line) => /^([\w-]+):\s*(.*)$/.exec(line)).filter(Boolean);
  return Object.fromEntries(fields.map(([, key, value]) => [key, value.trim()]));
}

// [main page source, /v2 page source, main address, what makes it the restyled page]
const PAGES = [
  ['navigation/authentication/analytics.md', 'navigation/authentication/dashboard-v2.md', '/dashboard', { layout: 'dashboard-v2' }],
  ['_projects/systems/grades/pages/analytics-dashboard.md', null, '/analytics-dashboard', { layout: 'opencsplus', wrapper: 'ocs__analytics-page' }],
  ['_projects/systems/grades/pages/submissions.md', null, '/submissions', { layout: 'opencsplus', wrapper: 'ocs__submissions-page' }],
  ['navigation/toolkit/bathroom_pass.md', 'navigation/toolkit/bathroom_pass-v2.md', '/student/bathroom_pass', { wrapper: 'ocs__bathroompass-v2-page' }],
  ['_projects/systems/calendar/index.md', '_projects/systems/calendar/navigation/calendar-v2.md', '/student/calendar', { wrapper: 'ocs__calendar-v2-page' }],
  ['_projects/systems/grades/pages/view-grades.md', null, '/student/view-grades', { wrapper: 'ocs__view-grades-page' }],
];

test('each main address serves the restyled page', () => {
  for (const [main, , address, restyled] of PAGES) {
    const text = read(main);
    const fields = frontMatter(text);
    assert.equal(fields.permalink, address, main);
    if (restyled.layout) assert.equal(fields.layout, restyled.layout, `${main} layout`);
    if (restyled.wrapper) assert.ok(text.includes(`class="${restyled.wrapper}`), `${main} wraps the page in ${restyled.wrapper}`);
  }
});

test('remaining /v2 addresses send visitors to the main page', () => {
  for (const [, v2, address] of PAGES) {
    if (!v2) continue;
    const text = read(v2);
    assert.equal(frontMatter(text).permalink, `${address}/v2`, v2);
    assert.ok(text.includes(`http-equiv="refresh" content="0; url={{ '${address}' | relative_url }}"`), `${v2} refreshes to ${address}`);
    assert.ok(text.includes(`window.location.replace({{ '${address}' | relative_url | jsonify }})`), `${v2} replaces itself with ${address}`);
  }
});

// Calendar's navigation/ pages are copied into _posts and otherwise appear in Blogs.
test('the calendar /v2 stub stays out of the Blogs catalog', () => {
  const stub = '_projects/systems/calendar/navigation/calendar-v2.md';
  assert.equal(frontMatter(read(stub)).hide, 'true', stub);
});

// The old dashboard's only tab had the admin tab's id, so clicking it hid Preferences (#1924).
test('the dashboard has no tab that can hide Preferences', () => {
  const layout = read('_layouts/dashboard-v2.html');
  assert.ok(!layout.includes('id="tab-admin-evaluation"'), 'no tab has the admin id');
  const tabs = [...layout.matchAll(/id="tab-(appearance|voice|tracking)"/g)].map((match) => match[1]);
  assert.deepEqual(tabs, ['appearance', 'voice', 'tracking'], 'one tab per Preferences panel');
  for (const tab of tabs) assert.ok(layout.includes(`id="tab-content-${tab}"`), `${tab} has its own panel`);
});

// Merges can drop an @import without any build error; the page then renders unstyled.
test('every v2 page partial is imported into the site stylesheet', () => {
  const main = read('_sass/open-coding/_main.scss');
  // Ignore stale Grades outputs on old checkouts; their new sources have no v2 suffix.
  const retiredGrades = new Set(['analytics-dashboard-v2.scss', 'submissions-v2.scss', 'view-grades-v2.scss']);
  const partials = readdirSync(new URL('../_sass/open-coding/', import.meta.url))
    .filter((name) => /-v2\.scss$/.test(name) && !retiredGrades.has(name))
    .map((name) => name.replace(/^_/, '').replace(/\.scss$/, ''));
  assert.ok(partials.length > 0, 'found the v2 partials');
  for (const partial of partials) {
    assert.ok(main.includes(`@import "${partial}";`), `_main.scss imports ${partial}`);
  }
});

test('every Grades stylesheet is imported into the site stylesheet', () => {
  const main = read('_sass/open-coding/_main.scss');
  const partials = readdirSync(new URL('../_projects/systems/grades/sass/', import.meta.url))
    .filter((name) => name.endsWith('.scss'))
    .map((name) => name.replace(/^_/, '').replace(/\.scss$/, ''));
  assert.ok(partials.length > 0, 'found Grades stylesheets');
  for (const partial of partials) {
    assert.ok(main.includes(`@import "projects/grades/${partial}";`), `_main.scss imports ${partial}`);
  }
});
