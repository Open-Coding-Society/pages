// /signup and /guestlogin send the typed password to Flask and Spring. These tests run each
// page's own script against a fake page and fake backends, and check that neither the password
// nor an account record the backends send back is ever printed to the browser console.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';

const root = new URL('../', import.meta.url);
const PASSWORD = 'Secret!Pass42';
// Only the fake account records carry this id, so seeing it in the console means a record was printed.
const RECORD_ID = 'record-only-7731';

const moduleUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;

// Stand-ins for the shared modules the pages import. login() follows config.js's success path.
const sharedModules = {
  config: moduleUrl(`
    export const pythonURI = 'https://flask.test';
    export const javaURI = 'https://spring.test';
    export const fetchOptions = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
    export function login(options) {
      return fetch(options.URL, { ...fetchOptions, method: options.method, body: JSON.stringify(options.body) })
        .then((response) => response.json())
        .then((body) => options.callback(body));
    }`),
  passwordRules: moduleUrl(`
    export const SPRING_PASSWORD_RULES = 'Password rules';
    export const meetsSpringPasswordRules = () => true;
    export const attachPasswordChecklist = () => {};`),
};

// Finds the page by its permalink rather than its path, so the test keeps working if the file moves.
function pageScript(permalink) {
  const grep = spawnSync('git', ['grep', '-l', '-E', `^permalink: *${permalink} *$`, '--', '*.md'], { cwd: fileURLToPath(root), encoding: 'utf8' });
  if (grep.error) throw grep.error;
  const found = grep.stdout.split('\n').filter(Boolean);
  assert.equal(found.length, 1, `expected one page with permalink ${permalink}, found ${found.length}`);
  const scripts = readFileSync(new URL(found[0], root), 'utf8').split('<script type="module">').slice(1);
  assert.equal(scripts.length, 1, `${found[0]} should have one inline module script`);
  const script = scripts[0].slice(0, scripts[0].indexOf('</script>'))
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, '') // _config.yml's baseurl is ""
    .replace(/'\/assets\/js\/api\/(config|passwordRules)\.js'/g, (_, name) => `'${sharedModules[name]}'`);
  assert.doesNotMatch(script, /\{\{|\{%/, 'the script should have no other Liquid');
  assert.doesNotMatch(script, /from\s+['"]\//, 'every import should point at a stand-in');
  return script;
}

let runs = 0;
async function runPage(permalink) {
  // The comment makes each import a new module, so the page's script runs again.
  await import(moduleUrl(`${pageScript(permalink)}\n// run ${runs++}`));
}

// The fakes answer at once, so one turn of the event loop lets every promise chain finish.
const settle = () => new Promise((resolve) => setImmediate(resolve));

function fakeElement(value) {
  const classes = new Set();
  return {
    value,
    textContent: '',
    innerText: '',
    disabled: false,
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
    },
    querySelector: () => fakeElement(''),
    checkValidity: () => true,
    reportValidity() {},
    focus() {},
    addEventListener() {},
  };
}

function backendResponse(url) {
  const record = { id: RECORD_ID, uid: 'ada', name: 'Ada', email: 'ada@example.test' };
  switch (new URL(url).pathname) {
    case '/api/user': // Flask sign-up sends back the new user
    case '/api/user/guest': // Flask guest sign-up sends back the new user
    case '/api/id': // Flask's signed-in user
    case '/api/person/get': // Spring's signed-in person
      return { status: 200, body: record };
    case '/api/authenticate':
      return { status: 200, body: { message: 'Authentication for ada successful' } };
    case '/authenticate': // Spring puts the token in a cookie, not the body
      return { status: 200, body: 'ada was authenticated successfully' };
    case '/api/person/create':
      return { status: 200, body: { response: 'ada@example.test is created successfully' } };
    default:
      return { status: 404, body: { message: 'Not found' } };
  }
}

function reply({ status, body }) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return { ok: status < 400, status, text: async () => text, json: async () => JSON.parse(text), clone: () => reply({ status, body }) };
}

// Puts a fake page on globalThis, which stands in for window as it does in a browser, so the
// page's bare calls like signup() find what it set on window.
function installFakeBrowser(t, fieldValues) {
  const elements = new Map();
  const element = (key) => {
    if (!elements.has(key)) elements.set(key, fakeElement(fieldValues[key] ?? ''));
    return elements.get(key);
  };
  const requests = [];
  const printed = [];
  for (const method of ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table', 'trace']) {
    t.mock.method(console, method, (...args) => {
      printed.push(args.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null }))).join(' '));
    });
  }
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    requests.push({ url, body: options.body });
    return reply(backendResponse(url));
  });
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const before = new Set(Reflect.ownKeys(globalThis));
  Object.assign(globalThis, {
    window: globalThis,
    document: { getElementById: element, querySelector: element },
    location: { href: '' },
    alert() {},
    addEventListener() {},
  });
  t.after(() => {
    for (const key of Reflect.ownKeys(globalThis)) if (!before.has(key)) delete globalThis[key];
  });
  return { requests, printed };
}

function assertPrintsNoSecrets(printed) {
  const password = printed.find((line) => line.includes(PASSWORD));
  assert.equal(password, undefined, `the console showed the password: ${password}`);
  const record = printed.find((line) => line.includes(RECORD_ID));
  assert.equal(record, undefined, `the console showed an account record: ${record}`);
}

const sentPassword = (requests, path) => requests.some(({ url, body }) => new URL(url).pathname === path && body?.includes(PASSWORD));

test('/signup sends the password to Flask and Spring but never prints it or the new account', async (t) => {
  const browser = installFakeBrowser(t, { name: 'Ada', signupUid: 'ada', sid: '1', email: 'ada@example.test', signupPassword: PASSWORD });
  await runPage('/signup');
  await globalThis.signup();
  await settle();
  assert.ok(sentPassword(browser.requests, '/api/user'), 'Flask sign-up should get the password');
  assert.ok(sentPassword(browser.requests, '/api/person/create'), 'Spring sign-up should get the password');
  assertPrintsNoSecrets(browser.printed);
});

test('/guestlogin sign-up never prints the password or the new account', async (t) => {
  const browser = installFakeBrowser(t, { signupUsername: 'ada', signupPassword: PASSWORD, confirmPassword: PASSWORD });
  await runPage('/guestlogin');
  globalThis.handleSignupSubmit({ preventDefault() {} });
  await settle();
  t.mock.timers.runAll(); // the page shows the overall status a moment after Flask answers
  assert.ok(sentPassword(browser.requests, '/api/user/guest'), 'Flask guest sign-up should get the password');
  assertPrintsNoSecrets(browser.printed);
});

test('/guestlogin login never prints the password or the signed-in account', async (t) => {
  const browser = installFakeBrowser(t, { uid: 'ada', password: PASSWORD });
  await runPage('/guestlogin');
  globalThis.loginBoth();
  await settle();
  assert.ok(sentPassword(browser.requests, '/api/authenticate'), 'Flask login should get the password');
  assert.ok(sentPassword(browser.requests, '/authenticate'), 'Spring login should get the password');
  const paths = browser.requests.map(({ url }) => new URL(url).pathname);
  assert.ok(paths.includes('/api/id') && paths.includes('/api/person/get'), 'both backends should send back the account');
  assertPrintsNoSecrets(browser.printed);
});
