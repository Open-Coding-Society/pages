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

test('login page module has no Liquid, since published scripts are not rendered', () => {
  assert.doesNotMatch(read('js/login-page.js'), /\{\{|\{%/);
});
