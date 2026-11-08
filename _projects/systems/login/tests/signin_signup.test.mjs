import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { FlaskSession, SpringSession } from '../js/session.js';
import { SPRING_PASSWORD_RULES, meetsSpringPasswordRules } from '../js/password-rules.js';
import { reverifyNeeded, staffMustVerify } from '../js/reverify.js';
import { loginReturnPath } from '../../../../assets/js/api/login-return.js';
import { fakeBackend, refuse, unreachable } from './fake-backend.mjs';

// /login as a visitor uses it: login-page.js imports nothing, so it runs in a vm whose globals are
// a fake page, and the real session classes talk to fake backends. A module is strict, so the vm
// runs it in strict mode too (Node's vm still lets an undeclared write through when the value is a
// function).
const source = `'use strict';\n${readFileSync(new URL('../js/login-page.js', import.meta.url), 'utf8').replace(/^export /gm, '')}`;
const quiet = { log() {}, warn() {}, error() {} };
const LOGIN_URL = 'https://site.test/preview/login';

// An element with what the page reads and writes. Text set through textContent or innerHTML
// replaces appended children, as in the browser.
function fakeElement() {
  let text = '';
  const classes = new Set();
  const listeners = {};
  const parts = {};
  return {
    value: '', hidden: false, disabled: false, required: false, placeholder: '', className: '', style: {}, children: [],
    get textContent() { return this.children.length ? this.children.map((node) => (typeof node === 'string' ? node : node.textContent)).join('') : text; },
    set textContent(value) { text = value; this.children = []; },
    get innerHTML() { return text; },
    set innerHTML(value) { text = value; this.children = []; },
    classList: { add: (...names) => names.forEach((name) => classes.add(name)), remove: (...names) => names.forEach((name) => classes.delete(name)), contains: (name) => classes.has(name) },
    addEventListener: (type, listener) => { (listeners[type] ||= []).push(listener); },
    dispatch(type) { for (const listener of listeners[type] || []) listener.call(this, {}); },
    append(...nodes) { this.children.push(...nodes); },
    querySelector(selector) { return (parts[selector] ||= fakeElement()); },
    closest: () => ({ style: {} }),
    focus() {}, checkValidity: () => true, reportValidity() {},
  };
}

function startPage({ session, referrer = '' }) {
  const elements = new Map();
  const element = (id) => elements.get(id) ?? elements.set(id, fakeElement()).get(id);
  const link = () => ({ href: '', textContent: '', listeners: {}, addEventListener(type, listener) { this.listeners[type] = listener; } });
  // The page gets a window object of its own, apart from the vm's global, and the tests call the
  // functions the markup calls on it: a page that dropped `window.` from one would fail here.
  const window = { location: { href: LOGIN_URL }, addEventListener() {} };
  const context = vm.createContext({
    document: { referrer, getElementById: element, querySelector: () => element('signup-button'), createElement: link },
    window, console: quiet, atob,
    alert: (text) => { throw new Error(`The page alerted: ${text}`); },
    setTimeout: (callback) => { callback(); return 0; }, clearTimeout() {},
    fetch: async () => ({ ok: false, status: 404 }), // no Guest Window is open
  });
  vm.runInContext(source, context);
  context.startLoginPage({
    session, pythonURI: 'http://flask.test', javaURI: 'http://spring.test', fetchOptions: {}, GOOGLE_CLIENT_ID: 'client-id',
    loginReturnPath, reverifyNeeded, staffMustVerify, reverify: async () => ({ ok: true, message: '' }),
    SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist() {},
    baseurl: '/preview',
  });
  const settle = () => new Promise((resolve) => setImmediate(resolve));
  return {
    element, window, settle,
    async signIn() {
      element('uid').value = 'adalovelace';
      element('password').value = 'secret-Password-1';
      window.loginBoth();
      await settle();
    },
    async signUp(role) {
      const fields = { name: 'Ada Lovelace', signupUid: 'adalovelace', signupSid: '1234567', signupSchool: 'Del Norte', signupEmail: 'ada@example.com', signupPassword: 'Secret-Password-1!', confirmPassword: 'Secret-Password-1!', signupRole: role };
      for (const [id, value] of Object.entries(fields)) element(id).value = value;
      element('signupRole').dispatch('change');
      window.handleSignupSubmit({ preventDefault() {} });
      await settle();
    },
  };
}

const signedIn = (answer = { message: 'signed in' }) => fakeBackend({ 'POST /api/authenticate': answer });
const springAccepts = () => fakeBackend({ 'POST /authenticate': 'Authenticated', 'GET /api/person/get': { id: 42 }, 'POST /api/person/create': { id: 42 } });

test('a Flask-only site hides the Spring status and signs in to /profile', async () => {
  const page = startPage({ session: new FlaskSession({ flask: signedIn() }) });
  assert.equal(page.element('springStatus').style.display, 'none');
  await page.signIn();
  assert.equal(page.window.location.href, '/preview/profile');
});

test('signing in returns to the page the visitor came from, if it is on this site', async () => {
  const page = startPage({ session: new SpringSession({ flask: signedIn(), spring: springAccepts() }), referrer: 'https://site.test/preview/topics/' });
  assert.notEqual(page.element('springStatus').style.display, 'none');
  await page.signIn();
  assert.equal(page.window.location.href, '/preview/topics/');
  // A page outside the site's baseurl is no return path, so the visitor goes to /profile.
  const elsewhere = startPage({ session: new FlaskSession({ flask: signedIn() }), referrer: 'https://site.test/other/' });
  await elsewhere.signIn();
  assert.equal(elsewhere.window.location.href, '/preview/profile');
});

test('a guest goes to the home page, since guests have no profile', async () => {
  const page = startPage({ session: new FlaskSession({ flask: signedIn({ user: { limited: true } }) }) });
  await page.signIn();
  assert.equal(page.window.location.href, '/preview/');
});

test('when only Spring refuses, the page stays and says what will not work', async () => {
  const spring = fakeBackend({ 'POST /authenticate': refuse(401) });
  const page = startPage({ session: new SpringSession({ flask: signedIn(), spring }) });
  await page.signIn();
  assert.equal(page.window.location.href, LOGIN_URL);
  const message = page.element('message');
  assert.match(message.textContent, /^Signed in to Flask, but the Spring server rejected this login, so DMs, calendar and announcements will not work\./);
  const links = message.children.filter((node) => typeof node !== 'string').map(({ href, textContent }) => [textContent, href]);
  assert.deepEqual(links, [['Reset your Spring password', 'http://spring.test/mvc/person/reset'], ['Continue anyway', '/preview/profile']]);
});

test('a refused or failed sign-in shows the same words as before', async () => {
  const cases = [
    [refuse(401), 'Login error: 401'],
    [refuse(403, { message: 'The Guest Window is closed' }), 'Login error: 403 - The Guest Window is closed'],
    [unreachable(), 'Possible CORS or service down error: TypeError: Failed to fetch'],
  ];
  for (const [answer, words] of cases) {
    const page = startPage({ session: new FlaskSession({ flask: signedIn(answer) }) });
    await page.signIn();
    assert.equal(page.element('message').textContent, words);
    assert.equal(page.window.location.href, LOGIN_URL);
  }
});

test('a student whose verification lapsed verifies with Google before going on', async () => {
  const page = startPage({ session: new FlaskSession({ flask: signedIn({ user: { verification_required: true, verified_by_google: true } }) }) });
  await page.signIn();
  assert.equal(page.element('reverify').style.display, 'block');
  assert.equal(page.window.location.href, LOGIN_URL);
  page.window.handleGoogleSignIn({ credential: 'google-id-token' });
  await page.settle();
  assert.equal(page.window.location.href, '/preview/profile');
});

test("a mentor whose verification lapsed is told to ask staff, and can continue", async () => {
  const page = startPage({ session: new FlaskSession({ flask: signedIn({ user: { verification_required: true, verified_by_google: false } }) }) });
  await page.signIn();
  const message = page.element('message');
  assert.equal(message.textContent, 'Your verification has lapsed. Ask your Teacher or Admin to verify your account. Continue');
  message.children[1].listeners.click({ preventDefault() {} });
  assert.equal(page.window.location.href, '/preview/profile');
});

test('sign-up on a Flask-only site shows Flask\'s result alone', async () => {
  const flask = fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } });
  const page = startPage({ session: new FlaskSession({ flask }) });
  await page.signUp('mentor');
  assert.equal(page.element('overallStatus').textContent, '🎉 Account created! You can now login.');
  assert.ok(page.element('flaskStatus').classList.contains('success'));
  // A mentor has no student ID or school, so what was typed there is not sent.
  // The page builds this object inside the vm, so it is copied out before the comparison.
  assert.deepEqual({ ...flask.bodies['POST /api/user'] }, { name: 'Ada Lovelace', uid: 'adalovelace', sid: '', school: '', email: 'ada@example.com', password: 'Secret-Password-1!', accountType: 'mentor' });
});

test('sign-up with Spring shows both results, or why Spring failed', async () => {
  const both = startPage({ session: new SpringSession({ flask: fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } }), spring: springAccepts() }) });
  await both.signUp('mentor');
  assert.equal(both.element('overallStatus').textContent, '🎉 Account created on both backends! You can now login.');
  const spring = fakeBackend({ 'POST /api/person/create': refuse(409, { error: 'uid taken' }) });
  const partial = startPage({ session: new SpringSession({ flask: fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } }), spring }) });
  await partial.signUp('mentor');
  assert.equal(partial.element('overallStatus').textContent, '⚠️ Flask account created, but Spring signup failed: uid taken DMs, calendar and announcements need a working Spring account. Ask your teacher to fix it before logging in.');
  assert.ok(partial.element('springStatus').classList.contains('error'));
});

test('a refused or failed sign-up says why, and never asks Spring', async () => {
  const cases = [
    [refuse(400, { message: 'User adalovelace already exists' }), '❌ Signup failed: User adalovelace already exists Please check your details and try again.'],
    [unreachable(), '❌ Signup failed: Could not reach the server. Check your connection and try again. Please check your details and try again.'],
  ];
  for (const [answer, words] of cases) {
    const spring = springAccepts();
    const page = startPage({ session: new SpringSession({ flask: fakeBackend({ 'POST /api/user': answer }), spring }) });
    await page.signUp('mentor');
    assert.equal(page.element('overallStatus').textContent, words);
    assert.deepEqual(spring.calls, []);
  }
});

test('a student signs up only after Google confirms a school email', async () => {
  const googleToken = (email) => `header.${Buffer.from(JSON.stringify({ email })).toString('base64url')}.signature`;
  const flask = fakeBackend({ 'POST /api/user': { uid: 'adalovelace' } });
  const page = startPage({ session: new FlaskSession({ flask }) });
  await page.signUp('student');
  assert.equal(page.element('oauth-verification').style.display, 'block');
  page.window.handleGoogleSignIn({ credential: googleToken('ada@gmail.com') });
  await page.settle();
  assert.match(page.element('oauth-status').innerHTML, /You must use your school email address/);
  assert.deepEqual(flask.calls, []);
  const token = googleToken('ada@stu.powayusd.com');
  page.window.handleGoogleSignIn({ credential: token });
  await page.settle();
  assert.equal(page.element('overallStatus').textContent, '🎉 Account created! You can now login.');
  assert.deepEqual({ ...flask.bodies['POST /api/user'] }, { name: 'Ada Lovelace', uid: 'adalovelace', sid: '1234567', school: 'Del Norte', email: 'ada@example.com', password: 'Secret-Password-1!', accountType: 'student', idToken: token });
});

test('a guest sign-up on a Spring site creates only the Flask account', async () => {
  const spring = springAccepts();
  const page = startPage({ session: new SpringSession({ flask: fakeBackend({ 'POST /api/user': { uid: 'guest1' } }), spring }) });
  await page.signUp('guest');
  assert.equal(page.element('springStatus').style.display, 'none');
  assert.equal(page.element('overallStatus').textContent, '🎉 Account created! You can now login.');
  assert.deepEqual(spring.calls, []);
});
