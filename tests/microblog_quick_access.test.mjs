// The microblog panel's Guest & Mentor quick access, in a stubbed browser.
// NOSPRING=1 renders config.js as a Flask-only site (spring: false).
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import os from 'os';
// Run from anywhere: node tests/microblog_quick_access.test.mjs. The repo is the folder above this one and the
// scratch folder is made fresh (and removed at the end); both can still be given as arguments.
const repo = process.argv[2] || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const work = process.argv[3] || fs.mkdtempSync(path.join(os.tmpdir(), 'quick-access-'));
let failed = 0;
const print = console.log.bind(console);
const check = (label, cond, detail = '') => { print((cond ? 'PASS  ' : 'FAIL  ') + label + (!cond && detail ? `   [${detail}]` : '')); if (!cond) failed++; };
const noSpring = process.env.NOSPRING === '1';
const render = s => s.replace(/\{\{\s*site\.baseurl\s*\|\s*jsonify\s*\}\}/g, '""').replace(/\{\{\s*site\.spring\s*\}\}/g, noSpring ? 'false' : 'true').replace(/^---\n[\s\S]*?\n---\n/, '').replace(/\{\{\s*site\.baseurl\s*\}\}/g, '.').replace(/\{\{[^}]*\}\}/g, 'X');

fs.mkdirSync(path.join(work, 'assets/js/api'), { recursive: true });
for (const f of fs.readdirSync(path.join(repo, 'assets/js/api')).filter(f => f.endsWith('.js')))
  fs.writeFileSync(path.join(work, 'assets/js/api', f.replace(/\.js$/, '.mjs')), render(fs.readFileSync(path.join(repo, 'assets/js/api', f), 'utf8')).replace(/\.js'/g, ".mjs'"));
fs.mkdirSync(path.join(work, 'assets/js/projects/microblog'), { recursive: true });
for (const f of fs.readdirSync(path.join(repo, '_projects/systems/microblog/js')).filter(f => f.endsWith('.js')))
  fs.writeFileSync(path.join(work, 'assets/js/projects/microblog', f.replace(/\.js$/, '.mjs')), render(fs.readFileSync(path.join(repo, '_projects/systems/microblog/js', f), 'utf8')).replace(/\.js'/g, ".mjs'"));
// passwordRules.js is published into assets/js/api from the login project (its distribution.json), and is not in git
if (!fs.existsSync(path.join(work, 'assets/js/api/passwordRules.mjs')))
  fs.writeFileSync(path.join(work, 'assets/js/api/passwordRules.mjs'), fs.readFileSync(path.join(repo, '_projects/systems/login/js/password-rules.js'), 'utf8'));

class El {
  constructor(id) { this.id = id; this.style = {}; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.disabled = false; this.hidden = false; this.className = ''; this.placeholder = ''; this.listeners = {}; this.attrs = {}; this.children = [];
    this.classList = { add: (...c) => { this.className = [...new Set([...this.className.split(' ').filter(Boolean), ...c])].join(' '); }, remove: (...c) => { this.className = this.className.split(' ').filter(x => x && !c.includes(x)).join(' '); }, toggle: () => {}, contains: c => this.className.split(' ').includes(c) }; }
  addEventListener(t, f) { this.listeners[t] = f; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k]; }
  replaceChildren(...k) { this.children = k; }
  focus() {}
}
let els = {};
const el = id => els[id] ??= new El(id);
globalThis.window = globalThis;
globalThis.location = { hostname: 'localhost', href: '' };
globalThis.document = { referrer: '', getElementById: el, createElement: () => new El('x'), querySelector: () => new El('q'), querySelectorAll: () => [], addEventListener() {} };
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } };
const events = [];
globalThis.dispatchEvent = e => { events.push(e.type); return true; };
globalThis.addEventListener = () => {};

const calls = [];
let replies = {};
const resp = (code, text) => ({ ok: code >= 200 && code < 300, status: code, text: async () => text, json: async () => JSON.parse(text), clone() { return this; } });
const json = (code, obj) => resp(code, JSON.stringify(obj));
globalThis.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  const body = opts.body ? JSON.parse(opts.body) : null;
  calls.push({ url, method, body });
  const key = Object.keys(replies).find(k => url.endsWith(k.split(' ')[1]) && method === k.split(' ')[0]);
  if (!key) throw new Error('unexpected ' + method + ' ' + url);
  const reply = replies[key];
  if (reply === 'down') throw new TypeError('Failed to fetch');
  return typeof reply === 'function' ? reply(body) : reply;
};
const realConsole = globalThis.console; globalThis.console = { ...realConsole, log() {}, warn() {}, error() {} };
const settle = () => new Promise(r => setTimeout(r, 30));
const mod = await import(pathToFileURL(path.join(work, 'assets/js/projects/microblog/quick-access.mjs')).href);
const { quickLogin, quickSignup, guestWindowOpen, initQuickAccess, QUICK_TYPES } = mod;
const type = id => QUICK_TYPES.find(t => t.id === id);
const WEAK = 'weak', STRONG = 'Aa1!StrongPass';
// Spring's login is /authenticate; Flask's is /api/authenticate, which also ends the same way
const to = u => calls.filter(c => c.url.endsWith(u) && !(u === '/authenticate' && c.url.endsWith('/api/authenticate')));
const reset = () => { calls.length = 0; events.length = 0; };
const ACTIVE = { message: 'ok', user: { uid: 'u', role: 'User', active: true, limited: false } };
const flaskOk = () => ({ 'POST /api/user': json(200, {}), 'POST /api/person/create': resp(200, '{}'), 'POST /api/authenticate': json(200, ACTIVE), 'POST /authenticate': resp(200, 'tok'), 'GET /api/guest/window': json(200, { open: true, closes_at: new Date(Date.now() + 3600e3).toISOString().replace('Z', '') }) });

// ---- the types
check('the panel offers two types to create: a guest and a mentor', QUICK_TYPES.map(t => t.id).join() === 'guest,mentor', QUICK_TYPES.map(t => t.id).join());

// ---- quick login
replies = flaskOk(); reset();
let r = await quickLogin({ uid: 'someone', password: STRONG });
check('a quick login posts the username and password to Flask\'s login', to('/api/authenticate').length === 1 && JSON.stringify(to('/api/authenticate')[0].body) === JSON.stringify({ uid: 'someone', password: STRONG }), JSON.stringify(to('/api/authenticate')));
check('and, logged in, says so', r.ok === true && /logged in/i.test(r.message), JSON.stringify(r));
if (!noSpring) check('a normal account is also logged in to Spring, so the rest of the site works', to('/authenticate').length === 1 && JSON.stringify(to('/authenticate')[0].body) === JSON.stringify({ uid: 'someone', password: STRONG }), JSON.stringify(calls.map(c => c.url)));
else check('on a Flask-only site there is no Spring login', to('/authenticate').length === 0);
replies = { ...flaskOk(), 'POST /api/authenticate': json(200, { user: { uid: 'g', role: 'Guest', active: true, limited: true } }) }; reset();
await quickLogin({ uid: 'g', password: STRONG });
check('a guest is never logged in to Spring: it has no account there', to('/authenticate').length === 0, JSON.stringify(calls.map(c => c.url)));
if (!noSpring) { replies = { ...flaskOk(), 'POST /authenticate': 'down' }; reset(); r = await quickLogin({ uid: 'u', password: STRONG }); check('a Spring that cannot be reached does not fail the login', r.ok === true, JSON.stringify(r)); }
replies = { ...flaskOk(), 'POST /api/authenticate': json(403, { message: 'This account has expired, and the Guest Window is closed. Ask a teacher to open it.' }) }; reset();
r = await quickLogin({ uid: 'g', password: STRONG });
check('a refused login shows Flask\'s reason', r.ok === false && /Guest Window is closed/.test(r.message), JSON.stringify(r));
check('and logs in nowhere else', to('/authenticate').length === 0);
replies = { ...flaskOk(), 'POST /api/authenticate': json(401, { message: 'Invalid user id or password' }) }; reset();
r = await quickLogin({ uid: 'g', password: 'nope' });
check('a wrong password says so', r.ok === false && /Invalid user id or password/.test(r.message), JSON.stringify(r));
replies = { ...flaskOk(), 'POST /api/authenticate': resp(502, '<html>Bad gateway</html>') }; reset();
r = await quickLogin({ uid: 'g', password: STRONG });
check('an answer that is not JSON is a failure that shows none of the page', r.ok === false && !/html|gateway/i.test(r.message), JSON.stringify(r));
replies = { ...flaskOk(), 'POST /api/authenticate': 'down' };
r = await quickLogin({ uid: 'g', password: STRONG });
check('a Flask that cannot be reached says so', r.ok === false && /Could not reach the server/.test(r.message), JSON.stringify(r));
replies = { ...flaskOk(), 'POST /api/authenticate': json(200, { user: { uid: 'm', role: 'Mentor', active: false, limited: false } }) };
r = await quickLogin({ uid: 'm', password: STRONG });
check('an account that is waiting for verification is told so, and that a Teacher or Admin does it', r.ok === true && r.pending === true && /Teacher or Admin/.test(r.message), JSON.stringify(r));
check('a missing username or password is refused before anything is sent', (reset(), (await quickLogin({ uid: '', password: STRONG })).ok === false && (await quickLogin({ uid: 'x', password: '' })).ok === false) && calls.length === 0);

// ---- quick sign-up: a guest
replies = flaskOk(); reset();
r = await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG });
const created = to('/api/user')[0];
check('a guest is created through Flask\'s sign-up as a guest, with the username as the name and nothing else', created && created.method === 'POST' && JSON.stringify(created.body) === JSON.stringify({ name: 'newguest', uid: 'newguest', password: STRONG, accountType: 'guest' }), JSON.stringify(created && created.body));
check('and then logged in, so there is no second step', to('/api/authenticate').length === 1 && r.ok === true, JSON.stringify(r));
check('a guest is never created in Spring', to('/api/person/create').length === 0);
reset(); await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG, email: 'g@example.com' });
check('an email a guest gave is sent', to('/api/user')[0].body.email === 'g@example.com', JSON.stringify(to('/api/user')[0].body));
reset(); await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG, email: '   ' });
check('a blank email is not sent', !('email' in to('/api/user')[0].body), JSON.stringify(to('/api/user')[0].body));

// ---- quick sign-up: refusals
for (const [label, args] of [['a weak password', { uid: 'newguest', password: WEAK }], ['a username that is too short', { uid: 'x', password: STRONG }]]) {
  replies = flaskOk(); reset(); r = await quickSignup({ type: type('guest'), ...args });
  check(`${label} is refused before anything is sent`, r.ok === false && calls.length === 0, JSON.stringify(r));
}
replies = flaskOk(); reset(); r = await quickSignup({ type: type('guest'), uid: 'newguest', password: WEAK });
check('and the password rule is shown', /8\+ characters/.test(r.message), r.message);
replies = { ...flaskOk(), 'POST /api/user': json(403, { message: 'Guest sign-up is closed right now. Ask a teacher to open the Guest Window.' }) }; reset();
r = await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG });
check('a guest sign-up Flask refuses (the window closed) shows Flask\'s reason and does not try to log in', r.ok === false && /Guest sign-up is closed/.test(r.message) && to('/api/authenticate').length === 0, JSON.stringify(r));
replies = { ...flaskOk(), 'POST /api/user': json(409, { message: 'User ID newguest already exists. Log in with it to come back.' }) }; reset();
r = await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG });
check('a username that is taken says to log in with it', r.ok === false && /Log in with it/.test(r.message), JSON.stringify(r));
replies = { ...flaskOk(), 'POST /api/user': 'down' }; r = await quickSignup({ type: type('guest'), uid: 'newguest', password: STRONG });
check('a Flask that cannot be reached says so', r.ok === false && /Could not reach the server/.test(r.message), JSON.stringify(r));

// ---- quick sign-up: a mentor
const mentorArgs = { type: type('mentor'), uid: 'octocat', password: STRONG, name: 'Octo Cat', email: 'octo@example.com' };
replies = { ...flaskOk(), 'POST /api/user': json(200, { uid: 'octocat' }), 'POST /api/person/create': resp(200, '{}'), 'POST /api/authenticate': json(200, { user: { uid: 'octocat', role: 'Mentor', active: false, limited: false } }) }; reset();
r = await quickSignup(mentorArgs);
const m = to('/api/user')[0];
check('a mentor is created through Flask\'s sign-up as a mentor, with the name, the GitHub ID and the email, and no school', m && JSON.stringify(m.body) === JSON.stringify({ name: 'Octo Cat', uid: 'octocat', sid: '', school: '', email: 'octo@example.com', password: STRONG, accountType: 'mentor' }), JSON.stringify(m && m.body));
if (!noSpring) check('and, having a Spring account, in Spring too, with the same details', to('/api/person/create').length === 1 && JSON.stringify(to('/api/person/create')[0].body) === JSON.stringify(m.body), JSON.stringify(to('/api/person/create')));
else check('on a Flask-only site there is no Spring call', to('/api/person/create').length === 0);
check('and told that a Teacher or Admin must verify it before it can post', r.ok === true && r.pending === true && /Teacher or Admin/.test(r.message) && /verify/i.test(r.message), JSON.stringify(r));
for (const [label, args] of [['no name', { name: '' }], ['no email', { email: '' }], ['no GitHub ID', { uid: '' }]]) {
  reset(); r = await quickSignup({ ...mentorArgs, ...args });
  check(`a mentor with ${label} is refused before anything is sent`, r.ok === false && calls.length === 0, JSON.stringify(r));
}
if (!noSpring) { replies = { ...replies, 'POST /api/person/create': 'down' }; reset(); r = await quickSignup(mentorArgs); check('a Spring that cannot be reached does not fail a mentor sign-up that Flask accepted', r.ok === true, JSON.stringify(r)); }
replies = { ...flaskOk(), 'POST /api/user': json(404, { message: 'User ID octocat not a valid GitHub account' }) }; reset();
r = await quickSignup(mentorArgs);
check('a mentor whose GitHub ID is not real is told so, and nothing else is tried', r.ok === false && /not a valid GitHub account/.test(r.message) && to('/api/person/create').length === 0 && to('/api/authenticate').length === 0, JSON.stringify(r));

// ---- is the Guest Window open
replies = flaskOk(); let w = await guestWindowOpen();
check('an open window is reported open, with when it closes as a time', w.open === true && /\d{1,2}:\d{2}/.test(w.closes), JSON.stringify(w));
replies = { 'GET /api/guest/window': json(200, { open: false, closes_at: null }) }; w = await guestWindowOpen();
check('a closed window is reported closed, and that Flask answered', w.open === false && w.reachable === true, JSON.stringify(w));
for (const [label, reply] of [['Flask refuses', resp(500, '{}')], ['the answer is not JSON', resp(200, '<html>')], ['the answer has no open flag', resp(200, '{}')], ['the open flag is not true or false', json(200, { open: 'yes' })], ['Flask cannot be reached', 'down']]) {
  replies = { 'GET /api/guest/window': reply }; w = await guestWindowOpen();
  check(`when ${label} the window is reported closed, and that Flask could not tell us, so nothing is offered that would fail`, w.open === false && w.reachable === false, JSON.stringify(w));
}

// ---- the panel
const IDS = ['quick-access-toggle', 'quick-access', 'quick-tab-login', 'quick-tab-signup', 'quick-login-form', 'quick-signup-form', 'quick-login-uid', 'quick-login-password', 'quick-login-submit',
  'quick-type', 'quick-type-note', 'quick-window-note', 'quick-name-group', 'quick-email-group', 'quick-name', 'quick-email', 'quick-uid', 'quick-password', 'quick-signup-submit', 'quick-status'];
const setup = async (windowReply) => {
  els = {}; IDS.forEach(el);
  el('quick-access').style.display = 'none';
  el('quick-type').children = [];
  el('quick-type').options = [];
  const guestOption = Object.assign(new El('opt-guest'), { value: 'guest' }), mentorOption = Object.assign(new El('opt-mentor'), { value: 'mentor' });
  el('quick-type').children = [guestOption, mentorOption];
  el('quick-type').querySelector = sel => sel.includes('guest') ? guestOption : mentorOption;
  el('quick-type').value = 'guest';
  replies = { ...flaskOk(), 'GET /api/guest/window': windowReply };
  reset();
  initQuickAccess(); await settle();
  return { guestOption, mentorOption };
};
const submit = async (formId) => { el(formId).listeners.submit({ preventDefault() {} }); await settle(); await new Promise(r => setTimeout(r, 40)); };
const OPEN = () => json(200, { open: true, closes_at: new Date(Date.now() + 3600e3).toISOString().replace('Z', '') });
const CLOSED = () => json(200, { open: false, closes_at: null });

let o = await setup(OPEN());
check('the panel starts closed, and the button opens and closes it', el('quick-access').style.display === 'none' && (el('quick-access-toggle').listeners.click(), el('quick-access').style.display !== 'none') && (el('quick-access-toggle').listeners.click(), el('quick-access').style.display === 'none'));
check('it starts on Quick login', el('quick-login-form').hidden === false && el('quick-signup-form').hidden === true && el('quick-tab-login').attrs['aria-selected'] === 'true');
el('quick-tab-signup').listeners.click();
check('the Quick sign-up tab shows the sign-up form and hides the login form', el('quick-login-form').hidden === true && el('quick-signup-form').hidden === false && el('quick-tab-signup').attrs['aria-selected'] === 'true' && el('quick-tab-login').attrs['aria-selected'] === 'false');
el('quick-tab-login').listeners.click();
check('and Quick login brings the login form back', el('quick-login-form').hidden === false && el('quick-signup-form').hidden === true);
check('with the window open, guest is offered, chosen, and labelled plainly', o.guestOption.hidden === false && o.guestOption.disabled === false && o.guestOption.textContent === 'Guest' && el('quick-type').value === 'guest' && el('quick-window-note').hidden === true, o.guestOption.textContent);
check('a guest is asked for a username and a password, not a name, and for an email only as an option', el('quick-name-group').hidden === true && el('quick-email-group').hidden === false && el('quick-email').required === false && /optional/i.test(el('quick-email').placeholder) && /Username/.test(el('quick-uid').placeholder), `${el('quick-name-group').hidden} ${el('quick-email-group').hidden} ${el('quick-email').placeholder} ${el('quick-uid').placeholder}`);
check('and told what a guest can do', /guest/i.test(el('quick-type-note').textContent) && el('quick-type-note').textContent.length > 20, el('quick-type-note').textContent);
el('quick-type').value = 'mentor'; el('quick-type').listeners.change();
check('choosing mentor asks for a name and requires an email, and says the username is the GitHub ID', el('quick-name-group').hidden === false && el('quick-email-group').hidden === false && el('quick-email').required === true && el('quick-name').required === true && /GitHub ID/.test(el('quick-uid').placeholder), `${el('quick-uid').placeholder}`);
check('and tells a mentor that a Teacher or Admin must verify the account', /Teacher or Admin/.test(el('quick-type-note').textContent), el('quick-type-note').textContent);
el('quick-type').value = 'guest'; el('quick-type').listeners.change();
check('going back to guest hides the name and makes the email optional again', el('quick-name-group').hidden === true && el('quick-email').required === false && el('quick-name').required === false);

o = await setup(CLOSED());
check('with the window closed, guest is still listed but cannot be chosen, says it is closed, and mentor is chosen', o.guestOption.hidden === false && o.guestOption.disabled === true && /closed right now/i.test(o.guestOption.textContent) && el('quick-type').value === 'mentor', `${o.guestOption.hidden} ${o.guestOption.disabled} ${o.guestOption.textContent} ${el('quick-type').value}`);
check('and the panel explains it, and that a teacher opens the window', /closed right now/i.test(el('quick-window-note').textContent) && /teacher/i.test(el('quick-window-note').textContent) && el('quick-window-note').hidden === false, el('quick-window-note').textContent);
check('and, a mentor chosen, the mentor fields show', el('quick-name-group').hidden === false);
o = await setup('down');
check('when Flask cannot be asked about the window, guest is listed but cannot be chosen, and says it could not be checked, not that it is closed', o.guestOption.hidden === false && o.guestOption.disabled === true && /unavailable/i.test(o.guestOption.textContent) && !/closed/i.test(o.guestOption.textContent) && el('quick-type').value === 'mentor' && /could not check/i.test(el('quick-window-note').textContent), `${o.guestOption.textContent} | ${el('quick-window-note').textContent}`);

// submitting
o = await setup(OPEN());
el('quick-login-uid').value = 'someone'; el('quick-login-password').value = STRONG;
await submit('quick-login-form');
check('submitting the login form logs in, says so in the status as a success, and tells the microblog to reload', to('/api/authenticate').length === 1 && /logged in/i.test(el('quick-status').textContent) && el('quick-status').className.includes('is-success') && events.includes('quick-access:login'), `${el('quick-status').textContent} | ${events}`);
check('and the password is cleared from the form', el('quick-login-password').value === '');
check('and the buttons are usable again', el('quick-login-submit').disabled === false);
replies = { ...replies, 'POST /api/authenticate': json(401, { message: 'Invalid user id or password' }) }; reset();
el('quick-login-password').value = 'nope'; await submit('quick-login-form');
check('a failed login shows the reason as an error and does not reload the microblog', /Invalid user id or password/.test(el('quick-status').textContent) && el('quick-status').className.includes('is-error') && !events.includes('quick-access:login'), `${el('quick-status').textContent} | ${events}`);
replies = { ...replies, 'POST /api/authenticate': json(401, { message: '<b>bold</b><img src=x onerror=alert(1)>' }) };
el('quick-login-password').value = 'nope'; await submit('quick-login-form');
check('a message is shown as text, never as markup', el('quick-status').textContent.includes('<b>bold</b>') && !el('quick-status').innerHTML, el('quick-status').innerHTML);

o = await setup(OPEN()); replies = { ...replies, 'POST /api/user': json(200, { uid: 'newguest' }) }; reset();
el('quick-type').value = 'guest'; el('quick-uid').value = 'newguest'; el('quick-password').value = STRONG;
await submit('quick-signup-form');
check('submitting the sign-up form for a guest creates it, logs it in, and tells the microblog', to('/api/user').length === 1 && to('/api/user')[0].body.accountType === 'guest' && to('/api/authenticate').length === 1 && events.includes('quick-access:login'), `${calls.map(c => c.method + ' ' + c.url)} | ${events}`);
check('and shows the result as a success, with the password cleared', el('quick-status').className.includes('is-success') && el('quick-password').value === '', el('quick-status').textContent);
o = await setup(OPEN()); replies = { ...replies, 'POST /api/user': json(200, {}), 'POST /api/person/create': resp(200, '{}'), 'POST /api/authenticate': json(200, { user: { uid: 'octocat', role: 'Mentor', active: false, limited: false } }) }; reset();
el('quick-type').value = 'mentor'; el('quick-type').listeners.change(); el('quick-name').value = 'Octo Cat'; el('quick-email').value = 'octo@example.com'; el('quick-uid').value = 'octocat'; el('quick-password').value = STRONG;
await submit('quick-signup-form');
check('submitting it for a mentor sends the mentor details and shows that a Teacher or Admin must verify it', to('/api/user')[0].body.accountType === 'mentor' && to('/api/user')[0].body.name === 'Octo Cat' && /Teacher or Admin/.test(el('quick-status').textContent), `${el('quick-status').textContent}`);
o = await setup(OPEN()); replies = { ...replies, 'POST /api/user': json(403, { message: 'Guest sign-up is closed right now. Ask a teacher to open the Guest Window.' }) }; reset();
el('quick-type').value = 'guest'; el('quick-uid').value = 'newguest'; el('quick-password').value = STRONG; await submit('quick-signup-form');
check('a sign-up that fails shows the reason as an error, re-enables the button, and does not tell the microblog', /Guest sign-up is closed/.test(el('quick-status').textContent) && el('quick-status').className.includes('is-error') && el('quick-signup-submit').disabled === false && !events.includes('quick-access:login'), `${el('quick-status').textContent} | ${events}`);
check('and switching tab clears the status', (el('quick-tab-login').listeners.click(), el('quick-status').textContent === ''));

print(failed ? `\nFAILURES: ${failed}` : '\nALL PASSED');
if (!process.argv[3]) fs.rmSync(work, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
