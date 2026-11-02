// The ocs__ restyles (v2) are the main pages: each main address serves the restyled page, each /v2
// address sends visitors there (like /profile/v2), and every v2 page partial reaches the stylesheet.
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
  ['navigation/authentication/analytics-dashboard.md', 'navigation/authentication/analytics-dashboard-v2.md', '/analytics-dashboard', { layout: 'analytics-dashboard-v2' }],
  ['navigation/authentication/submissions.md', 'navigation/authentication/submissions-v2.md', '/submissions', { layout: 'submissions-v2' }],
  ['navigation/toolkit/bathroom_pass.md', 'navigation/toolkit/bathroom_pass-v2.md', '/student/bathroom_pass', { wrapper: 'ocs__bathroompass-v2-page' }],
  ['_projects/systems/calendar/index.md', '_projects/systems/calendar/navigation/calendar-v2.md', '/student/calendar', { wrapper: 'ocs__calendar-v2-page' }],
  ['_posts/student_toolkit/assignments/2025-01-21-gradeviewer.md', '_posts/student_toolkit/assignments/2025-01-21-gradeviewer-v2.md', '/student/view-grades', { wrapper: 'ocs__view-grades-v2-page' }],
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

test('each /v2 address sends visitors to the main page', () => {
  for (const [, v2, address] of PAGES) {
    const text = read(v2);
    assert.equal(frontMatter(text).permalink, `${address}/v2`, v2);
    assert.ok(text.includes(`http-equiv="refresh" content="0; url={{ '${address}' | relative_url }}"`), `${v2} refreshes to ${address}`);
    assert.ok(text.includes(`window.location.replace({{ '${address}' | relative_url | jsonify }})`), `${v2} replaces itself with ${address}`);
  }
});

// The calendar's navigation/ pages are copied into _posts, and view grades is a post, so their
// stubs would show up as duplicate cards in the Blogs catalog.
test('the /v2 stubs that are posts stay out of the Blogs catalog', () => {
  for (const stub of ['_projects/systems/calendar/navigation/calendar-v2.md', '_posts/student_toolkit/assignments/2025-01-21-gradeviewer-v2.md']) {
    assert.equal(frontMatter(read(stub)).hide, 'true', stub);
  }
});

// The old dashboard's only tab had the admin tab's id, so clicking it hid Preferences (#1924).
test('the dashboard has no tab that can hide Preferences', () => {
  assert.ok(!read('_layouts/dashboard-v2.html').includes('class="tab-btn'), 'no tab buttons on the dashboard');
});

// Merges can drop an @import without any build error; the page then renders unstyled.
test('every v2 page partial is imported into the site stylesheet', () => {
  const main = read('_sass/open-coding/_main.scss');
  const partials = readdirSync(new URL('../_sass/open-coding/', import.meta.url))
    .filter((name) => /-v2\.scss$/.test(name))
    .map((name) => name.replace(/^_/, '').replace(/\.scss$/, ''));
  assert.ok(partials.length > 0, 'found the v2 partials');
  for (const partial of partials) {
    assert.ok(main.includes(`@import "${partial}";`), `_main.scss imports ${partial}`);
  }
});
