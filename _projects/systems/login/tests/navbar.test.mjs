import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { inspect } from 'node:util';
import vm from 'node:vm';
import { FlaskSession, SpringSession } from '../js/session.js';
import { fakeBackend, refuse, unreachable } from './fake-backend.mjs';

// The header passes the dashboard's FormatConverter, which turns Spring's saved preferences into the
// theme engine's shape (null when no colors are saved). Its module reads window as it loads.
globalThis.window ??= {};
const { FormatConverter } = await import('../../../../assets/js/pages/dashboard/preferences.js');

// navbar-login.js imports nothing, so it runs in a vm whose globals are a fake page. A module is
// strict, so the vm runs it in strict mode too: a write to an undeclared variable throws, as in the
// browser (Node's vm still lets one through when the value is a function).
const source = `'use strict';\n${readFileSync(new URL('../js/navbar-login.js', import.meta.url), 'utf8').replace(/^export /gm, '')}`;
const ada = { uid: 'adalovelace', name: 'Ada Lovelace', roles: [{ name: 'Student' }] };

// The parts of the site header the navbar touches: #loginArea (whose account menu button shows
// the name, as the browser would parse it), the .trigger nav and its course link.
function fakePage() {
  const listeners = {};
  const button = { textContent: '', title: '', addEventListener() {}, contains: () => false };
  const menu = { added: [], prepend(link) { this.added.push(link); }, classList: { toggle() {}, add() {} }, contains: () => false };
  let html = '';
  const loginArea = {
    style: {},
    get innerHTML() { return html; },
    set innerHTML(value) {
      html = value;
      button.textContent = (value.match(/<button[^>]*>([^<]*)<\/button>/) || [])[1] ?? '';
    },
    querySelector: (selector) => (html.includes('dropdown') ? { '.dropbtn': button, '.dropdown-content': menu }[selector] : null) ?? null,
  };
  const courseLink = { dataset: { defaultCourse: 'csse' }, href: '', textContent: '' };
  const document = {
    addEventListener: (type, listener) => { (listeners[type] ||= []).push(listener); },
    querySelector: (selector) => ({ '#loginArea': loginArea, '.trigger': { querySelectorAll: () => [courseLink] } })[selector] ?? null,
    querySelectorAll: () => [courseLink],
    createElement: () => ({ href: '', textContent: '' }),
  };
  return { document, listeners, loginArea, button, menu };
}

// Starts the navbar the way the site header does, loads the page, and waits for it to settle.
// `preferences` is Spring's answer to the theme request (without it, a 404), `saved` is what this
// browser's localStorage already holds, and `classes` is Flask's list of the student's classes.
// Everything printed to the console while the navbar starts is kept in `printed`: the navbar's
// own logs, and those of the session it was given, which runs outside the vm.
async function startNavbar({ session, spring = null, preferences, saved = {}, classes = [] }) {
  const page = fakePage();
  const theme = { applied: [], resets: 0, applyPreferences(prefs) { this.applied.push(prefs); }, resetPreferences() { this.resets += 1; } };
  const window = { location: { href: 'https://site.test/preview/' }, SitePreferences: theme };
  const fetched = [];
  const storage = new Map(Object.entries(saved));
  const returns = [];
  const printed = [];
  const print = (...args) => printed.push(args.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null }))).join(' '));
  const context = vm.createContext({
    document: page.document, window, console: { log: print, info: print, debug: print, warn: print, error: print }, setTimeout,
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    fetch: async (url, options) => {
      fetched.push({ url, options });
      if (url.endsWith('/api/user/class')) return { ok: true, json: async () => ({ class: classes }) };
      if (url.endsWith('/api/user/preferences') && preferences) return { ok: true, json: async () => preferences };
      return { ok: false, status: 404 };
    },
  });
  const realConsole = { log: console.log, info: console.info, debug: console.debug, warn: console.warn, error: console.error };
  Object.assign(console, { log: print, info: print, debug: print, warn: print, error: print });
  try {
    vm.runInContext(source, context);
    context.startNavbarLogin({
      session, spring, baseurl: '/preview', pythonURI: 'http://flask.test', fetchOptions: {},
      addLoginReturn: (...args) => returns.push(args), FormatConverter,
      courseEntry: { savedCourse: () => null, selectEntryCourse: (classes, saved, fallback) => fallback, courseEntryUrl: (base, course) => `${base}/navigation/courses/${course}/` },
    });
    for (const listener of page.listeners.DOMContentLoaded) listener();
    await new Promise((resolve) => setTimeout(resolve));
  } finally {
    Object.assign(console, realConsole);
  }
  return { ...page, window, fetched, storage, returns, printed };
}

const springBackend = { baseUrl: 'http://spring.test', fetchOptions: { credentials: 'include' } };

test('a Flask-only navbar shows the account menu and never asks Spring', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const { loginArea, button, menu, window, fetched } = await startNavbar({ session: new FlaskSession({ flask }) });
  assert.equal(window.user, ada);
  assert.equal(button.textContent, 'Ada Lovelace');
  assert.match(loginArea.innerHTML, /Roles: Student/);
  assert.match(loginArea.innerHTML, /href="\/preview\/profile">Profile</);
  assert.match(loginArea.innerHTML, /href="\/preview\/logout">Logout</);
  assert.equal(loginArea.style.opacity, '1');
  assert.deepEqual(menu.added, []);
  assert.deepEqual(flask.calls, ['GET /api/id']);
  assert.deepEqual(fetched.map(({ url }) => url), ['http://flask.test/api/user/class']);
});

// The navbar runs on every page, so anything it prints shows in the console of every page a student
// opens while signed in.
test("the navbar never prints the student's account or classes to the console", async () => {
  const account = { ...ada, email: 'ada@school.test', sid: '9100100' };
  const flask = () => fakeBackend({ 'GET /api/id': account });
  const sites = [
    { session: new FlaskSession({ flask: flask() }), spring: null },
    { session: new SpringSession({ flask: flask(), spring: fakeBackend({ 'GET /api/person/get': { id: 42, email: 'ada@school.test' } }) }), spring: springBackend },
  ];
  for (const { session, spring } of sites) {
    const { printed, window } = await startNavbar({ session, spring, classes: ['csa-period-3'] });
    assert.equal(window.user?.uid, 'adalovelace', 'the navbar should have signed in, or this test proves nothing');
    for (const detail of ['adalovelace', 'Ada Lovelace', 'ada@school.test', '9100100', 'csa-period-3']) {
      assert.equal(printed.some((line) => line.includes(detail)), false, `the console shows ${detail}:\n${printed.join('\n')}`);
    }
  }
});

test('the navbar warns in the account menu when Spring has not signed this browser in', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const spring = fakeBackend({ 'GET /api/person/get': refuse(401, null, 'GET', '/api/person/get') });
  const { button, menu } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: springBackend });
  assert.equal(button.textContent, '⚠️ Ada Lovelace');
  assert.equal(button.title, 'Not signed in to Spring: DMs, calendar and announcements will not load');
  assert.deepEqual(menu.added, [{ href: '/preview/login', textContent: '⚠️ Spring sign-in failed. Log in again' }]);
});

test('the navbar adds no warning when Spring has signed this browser in', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const spring = fakeBackend({ 'GET /api/person/get': { id: 42 } });
  const { button, menu } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: springBackend });
  assert.equal(button.textContent, 'Ada Lovelace');
  assert.deepEqual(menu.added, []);
  assert.deepEqual(spring.calls, ['GET /api/person/get']);
});

test('the navbar adds no warning when Spring cannot be reached, since nothing is known', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const spring = fakeBackend({ 'GET /api/person/get': unreachable() });
  const { button, menu } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: springBackend });
  assert.equal(button.textContent, 'Ada Lovelace');
  assert.deepEqual(menu.added, []);
});

test("the navbar loads the student's theme from Spring when this browser held someone else's", async () => {
  const session = () => new SpringSession({ flask: fakeBackend({ 'GET /api/id': ada }), spring: fakeBackend({ 'GET /api/person/get': { id: 42 } }) });
  const saved = { id: 7, backgroundColor: '#111111', textColor: '#eeeeee' };
  const theme = FormatConverter.toFrontend(saved);
  const { fetched, storage, window } = await startNavbar({ session: session(), spring: springBackend, preferences: saved, saved: { sitePreferencesOwner: 'grace' } });
  const request = fetched.find(({ url }) => url === 'http://spring.test/api/user/preferences');
  assert.equal(request.options, springBackend.fetchOptions);
  assert.equal(storage.get('sitePreferencesOwner'), 'adalovelace');
  assert.equal(storage.get('sitePreferences'), JSON.stringify(theme));
  assert.deepEqual(window.SitePreferences.applied, [theme]);
  // A browser that already holds this student's theme doesn't ask again.
  const again = await startNavbar({ session: session(), spring: springBackend, preferences: saved, saved: { sitePreferencesOwner: 'adalovelace' } });
  assert.equal(again.fetched.some(({ url }) => url.endsWith('/api/user/preferences')), false);
});

test("the navbar drops the previous student's theme when the new one has none saved", async () => {
  const session = new SpringSession({ flask: fakeBackend({ 'GET /api/id': ada }), spring: fakeBackend({ 'GET /api/person/get': { id: 42 } }) });
  const before = { sitePreferencesOwner: 'grace', sitePreferences: '{"bg":"#000000"}', siteThemeDecor: 'snow' };
  const { storage, window } = await startNavbar({ session, spring: springBackend, preferences: { id: 7 }, saved: before });
  assert.equal(storage.get('sitePreferencesOwner'), 'adalovelace');
  assert.equal(storage.has('sitePreferences'), false);
  assert.equal(storage.has('siteThemeDecor'), false);
  assert.equal(window.SitePreferences.resets, 1);
});

test("the navbar keeps a theme this browser had before anyone's sign-in was synced", async () => {
  const session = new SpringSession({ flask: fakeBackend({ 'GET /api/id': ada }), spring: fakeBackend({ 'GET /api/person/get': { id: 42 } }) });
  const { storage, window } = await startNavbar({ session, spring: springBackend, preferences: { id: 7 }, saved: { sitePreferences: '{"bg":"#000000"}' } });
  assert.equal(storage.get('sitePreferencesOwner'), 'adalovelace');
  assert.equal(storage.get('sitePreferences'), '{"bg":"#000000"}');
  assert.equal(window.SitePreferences.resets, 0);
});

test('the navbar adds the return path to a login link when it is clicked', async () => {
  const { listeners, returns, window } = await startNavbar({ session: new FlaskSession({ flask: fakeBackend({ 'GET /api/id': ada }) }) });
  const link = { href: '/preview/login' };
  listeners.click[0]({ target: { closest: (selector) => (selector === 'a[href]' ? link : null) } });
  listeners.click[0]({ target: { closest: () => null } });
  assert.deepEqual(returns, [[link, window.location.href, '/preview']]);
});

test('a guest has no Spring account, so the navbar never checks Spring for one', async () => {
  const flask = fakeBackend({ 'GET /api/id': { ...ada, limited: true } });
  const spring = fakeBackend();
  const { button } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: { baseUrl: 'http://spring.test', fetchOptions: {} } });
  assert.equal(button.textContent, 'Ada Lovelace');
  assert.deepEqual(spring.calls, []);
});

test('a signed-out navbar shows the Login link', async () => {
  const flask = fakeBackend({ 'GET /api/id': refuse(401, null, 'GET', '/api/id') });
  const { loginArea, window } = await startNavbar({ session: new FlaskSession({ flask }) });
  assert.equal(window.user, null);
  assert.equal(loginArea.innerHTML, '<a href="/preview/login">Login</a>');
});
