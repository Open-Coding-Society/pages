// The toolkit menu (_includes/nav/homejava.html, used by /signup, /stats and /teacher) asks
// Spring who is signed in. These tests run the menu's own script against a fake page and a fake
// Spring, and check that the person record Spring sends back is never printed to the console.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { inspect } from 'node:util';

// Only the fake person carries these, so seeing one in the console means the record was printed.
const PERSON = {
  id: 'record-only-5124',
  uid: 'adalovelace',
  name: 'Ada Lovelace',
  email: 'ada@school.test',
  sid: '9100100',
  roles: [{ id: 'role-only-3391', name: 'ROLE_STUDENT' }],
};

const moduleUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const config = moduleUrl(`
  export const javaURI = 'https://spring.test';
  export const fetchOptions = { credentials: 'include' };`);

// The menu's inline module script, with the site's baseurl ("" in _config.yml) filled in and
// config.js replaced by the stand-in above.
function menuScript() {
  const html = readFileSync(new URL('../_includes/nav/homejava.html', import.meta.url), 'utf8');
  const scripts = html.split('<script type="module">').slice(1);
  assert.equal(scripts.length, 1, 'the menu should have one inline module script');
  const script = scripts[0].slice(0, scripts[0].indexOf('</script>'))
    .replace(/\{\{\s*site\.baseurl\s*\}\}/g, '')
    .replace("'/assets/js/api/config.js'", `'${config}'`);
  assert.doesNotMatch(script, /\{\{|\{%/, 'the script should have no other Liquid');
  assert.doesNotMatch(script, /from\s+['"]\//, 'every import should point at a stand-in');
  return script;
}

// Puts a fake page on globalThis, answers Spring's /api/person/get with `answer`, and records
// every console line. Then runs the menu and waits for it to settle.
let runs = 0;
async function startMenu(t, answer) {
  const elements = new Map();
  const loaded = [];
  const requests = [];
  const printed = [];
  for (const method of ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table', 'trace']) {
    t.mock.method(console, method, (...args) => {
      printed.push(args.map((arg) => (typeof arg === 'string' ? arg : inspect(arg, { depth: null }))).join(' '));
    });
  }
  t.mock.method(globalThis, 'fetch', async (url) => {
    requests.push(url);
    return answer();
  });
  globalThis.document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { innerHTML: '', style: {} });
      return elements.get(id);
    },
    addEventListener(type, listener) {
      if (type === 'DOMContentLoaded') loaded.push(listener);
    },
  };
  t.after(() => delete globalThis.document);
  // The comment makes each import a new module, so the menu's script runs again.
  await import(moduleUrl(`${menuScript()}\n// run ${runs++}`));
  assert.equal(loaded.length, 1, 'the menu should wait for DOMContentLoaded');
  loaded[0]();
  // The fakes answer at once, so one turn of the event loop lets the promise chain finish.
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(requests, ['https://spring.test/api/person/get']);
  return { link: (id) => elements.get(id), printed };
}

test("a signed-in toolkit menu shows the person's links but never prints their Spring record", async (t) => {
  const { link, printed } = await startMenu(t, async () => ({ status: 200, json: async () => structuredClone(PERSON) }));
  assert.match(link('profileLink').innerHTML, /href="\/profile"/, 'the menu should have signed in, or this test proves nothing');
  assert.match(link('logoutLink').innerHTML, /Logout of Toolkit/);
  assert.equal(link('loginLink').style.display, 'none');
  for (const detail of [PERSON.id, PERSON.uid, PERSON.name, PERSON.email, PERSON.sid, PERSON.roles[0].id]) {
    const line = printed.find((printedLine) => printedLine.includes(detail));
    assert.equal(line, undefined, `the console showed the Spring record: ${line}`);
  }
});

test('a toolkit menu that Spring has not signed in shows the Signup and Login links', async (t) => {
  const { link, printed } = await startMenu(t, async () => ({ status: 404, json: async () => null }));
  assert.match(link('signupLink').innerHTML, /Signup for Toolkit/);
  assert.match(link('loginLink').innerHTML, /Login to Toolkit/);
  assert.equal(link('profileLink').style.display, 'none');
  assert.deepEqual(printed, ['HTTP status code: 404']);
});
