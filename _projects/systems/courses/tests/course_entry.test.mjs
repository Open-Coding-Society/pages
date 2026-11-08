import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { courseEntryUrl, normalizeCourse, rememberCourse, savedCourse, selectEntryCourse } from '../js/player/course-entry.js';

test('first-time visitors enter CSSE Home Announcements directly', () => {
  assert.equal(selectEntryCourse([], null), 'csse');
  assert.equal(courseEntryUrl('/preview', 'csse'), '/preview/navigation/courses/csse/');
});

test('returning visitors enter their saved course without an account', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  rememberCourse('CSA', storage);
  assert.equal(savedCourse(storage), 'csa');
  assert.equal(selectEntryCourse([], savedCourse(storage)), 'csa');
  assert.equal(courseEntryUrl('', savedCourse(storage)), '/navigation/courses/csa/');
});

test('enrollment resolves directly and honors a saved enrolled course', () => {
  assert.equal(selectEntryCourse('APCSA', 'csse'), 'csa');
  assert.equal(selectEntryCourse(['CSA', 'APCSP'], 'csa'), 'csa');
  assert.equal(selectEntryCourse(['CSA', 'APCSP'], 'csh'), 'csp');
  assert.equal(selectEntryCourse([], 'csh'), 'csh');
});

test('course aliases normalize and invalid selections cannot form a URL', () => {
  assert.equal(normalizeCourse(' apcsp '), 'csp');
  assert.equal(selectEntryCourse(['unknown'], 'invalid', 'csh'), 'csh');
  assert.throws(() => courseEntryUrl('', '../login'));
  assert.throws(() => rememberCourse('invalid'));
});

test('header routes guests and enrolled users directly without rewriting unrelated links', async () => {
  const source = readFileSync(new URL('../../login/js/navbar-login.js', import.meta.url), 'utf8');
  // The header starts the navbar, which sets the course link as soon as it loads; the session never
  // answers here, so only that load-time update runs.
  const routing = `${source.replace(/^export /gm, '')}
    const courseEntry = { savedCourse, selectEntryCourse, courseEntryUrl };
    startNavbarLogin({ session: { currentUser: () => new Promise(() => {}) }, spring: null, baseurl, pythonURI, fetchOptions, addLoginReturn() {}, courseEntry });
    const { updateNavigation } = courseNavigation({ baseurl, pythonURI, fetchOptions, courseEntry });`;
  const courseLink = { dataset: { defaultCourse: 'csse' }, href: '', textContent: '' };
  const trigger = { querySelectorAll: selector => {
    assert.equal(selector, '[data-course-entry]');
    return [courseLink];
  } };
  let selected = null;
  let classes = ['CSA'];
  const context = vm.createContext({
    document: {
      addEventListener() {},
      querySelector: () => trigger,
      querySelectorAll: () => [courseLink],
    },
    savedCourse: () => selected,
    selectEntryCourse, courseEntryUrl, baseurl: '/preview',
    pythonURI: 'https://api.example.test', fetchOptions: {},
    fetch: async () => ({ ok: true, json: async () => ({ class: classes }) }),
    console: { log() {}, warn() {}, error() {} },
  });
  vm.runInContext(routing, context);
  assert.equal(courseLink.href, '/preview/navigation/courses/csse/');
  selected = 'csp';
  await vm.runInContext('updateNavigation(false)', context);
  assert.equal(courseLink.href, '/preview/navigation/courses/csp/');
  await vm.runInContext('updateNavigation(true)', context);
  assert.equal(courseLink.href, '/preview/navigation/courses/csa/');
  assert.equal(courseLink.textContent, 'APCSA');
  classes = ['CSP', 'CSA'];
  selected = 'csa';
  await vm.runInContext('updateNavigation(true)', context);
  assert.equal(courseLink.href, '/preview/navigation/courses/csa/');
});
