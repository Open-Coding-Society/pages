import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { FlaskSession, SpringSession } from '../js/session.js';
import { fakeBackend, refuse } from './fake-backend.mjs';

// navbar-login.js imports nothing, so it runs in a vm whose globals are a fake page.
const source = readFileSync(new URL('../js/navbar-login.js', import.meta.url), 'utf8').replace(/^export /gm, '');
const ada = { uid: 'adalovelace', name: 'Ada Lovelace', roles: [{ name: 'Student' }] };
const quiet = { log() {}, warn() {}, error() {} };

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
async function startNavbar({ session, spring = null }) {
  const page = fakePage();
  const window = { location: { href: 'https://site.test/preview/' } };
  const fetched = [];
  const storage = new Map();
  const context = vm.createContext({
    document: page.document, window, console: quiet, setTimeout,
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    fetch: async (url) => {
      fetched.push(url);
      return url.endsWith('/api/user/class') ? { ok: true, json: async () => ({ class: [] }) } : { ok: false, status: 404 };
    },
  });
  vm.runInContext(source, context);
  context.startNavbarLogin({
    session, spring, baseurl: '/preview', pythonURI: 'http://flask.test', fetchOptions: {},
    addLoginReturn() {}, FormatConverter: { toFrontend: (data) => data },
    courseEntry: { savedCourse: () => null, selectEntryCourse: (classes, saved, fallback) => fallback, courseEntryUrl: (base, course) => `${base}/navigation/courses/${course}/` },
  });
  for (const listener of page.listeners.DOMContentLoaded) listener();
  await new Promise((resolve) => setTimeout(resolve));
  return { ...page, window, fetched };
}

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
  assert.deepEqual(fetched, ['http://flask.test/api/user/class']);
});

test('the navbar warns in the account menu when Spring has not signed this browser in', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const spring = fakeBackend({ 'GET /api/person/get': refuse(401, null, 'GET', '/api/person/get') });
  const { button, menu } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: { baseUrl: 'http://spring.test', fetchOptions: {} } });
  assert.equal(button.textContent, '⚠️ Ada Lovelace');
  assert.equal(button.title, 'Not signed in to Spring: DMs, calendar and announcements will not load');
  assert.deepEqual(menu.added, [{ href: '/preview/login', textContent: '⚠️ Spring sign-in failed. Log in again' }]);
});

test('the navbar adds no warning when Spring has signed this browser in', async () => {
  const flask = fakeBackend({ 'GET /api/id': ada });
  const spring = fakeBackend({ 'GET /api/person/get': { id: 42 } });
  const { button, menu } = await startNavbar({ session: new SpringSession({ flask, spring }), spring: { baseUrl: 'http://spring.test', fetchOptions: {} } });
  assert.equal(button.textContent, 'Ada Lovelace');
  assert.deepEqual(menu.added, []);
  assert.deepEqual(spring.calls, ['GET /api/person/get']);
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
