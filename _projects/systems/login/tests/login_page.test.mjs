import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const system = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, system), 'utf8');

test('login page starts from one module', () => {
  const page = read('pages/login.md');
  const starters = page.split('<script type="module">').length - 1;
  assert.equal(starters, 1, 'the page should have exactly one inline module script');
  const starter = page.slice(page.indexOf('<script type="module">'), page.indexOf('</script>', page.indexOf('<script type="module">')));
  assert.match(starter, /from '\{\{ ?site\.baseurl ?\}\}\/assets\/js\/login\/login-page\.js'/);
  assert.match(starter, /startLoginPage\(/);
  assert.doesNotMatch(page, /\bfunction\b/, 'the page should keep no functions of its own');
});

// `{{ site.baseurl | jsonify }}` renders null on a site whose _config.yml has no baseurl, and the
// page's redirects then go to /null/profile; config.js's baseurl is "" there, as the header uses.
test("login page takes baseurl from config.js, like the header's starter", () => {
  const page = read('pages/login.md');
  assert.match(page, /import \{[^}]*\bbaseurl\b[^}]*\} from '\{\{ ?site\.baseurl ?\}\}\/assets\/js\/api\/config\.js'/);
  assert.doesNotMatch(page, /jsonify/);
});

test('login page module has no Liquid, since published scripts are not rendered', () => {
  assert.doesNotMatch(read('js/login-page.js'), /\{\{|\{%/);
});

test('the login page never checks springEnabled', () => {
  assert.doesNotMatch(read('js/login-page.js'), /springEnabled/);
});

test('the login page signs up, in and out only through the session', () => {
  assert.doesNotMatch(read('js/login-page.js'), /\/api\/authenticate|\/api\/person\/|\/authenticate`|\/api\/user`/);
});
