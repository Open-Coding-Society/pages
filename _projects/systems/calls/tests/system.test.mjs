// How the calls system is put together: where its files publish, that its modules only import
// each other, that every string they show is in data/calls.yml (and nothing there is unused),
// and that LiveKit loads from one pinned, integrity-checked address.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { readStrings } from './helpers.mjs';

const system = new URL('../', import.meta.url);
const root = new URL('../../../../', import.meta.url);
const read = (relative) => readFileSync(new URL(relative, system), 'utf8');
const modules = readdirSync(new URL('js/', system)).filter((name) => name.endsWith('.js'));
const sources = Object.fromEntries(modules.map((name) => [name, read(`js/${name}`)]));
// The code without its comments, which name config.js and LivekitClient to explain them.
const code = (name) => sources[name].replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('the system publishes its page, data and scripts to the generic project roots', () => {
  const { files } = JSON.parse(read('distribution.json'));
  assert.deepEqual(files, [
    { source: 'pages', destination: 'navigation/projects/calls' },
    { source: 'data', destination: '_data/projects/calls' },
    { source: 'js', destination: 'assets/js/projects/calls' },
  ]);
  files.forEach(({ source }) => assert.ok(existsSync(new URL(source, system)), `missing ${source}`));
});

// An export of the tree (git archive) has no .git to ask.
const inGitCheckout = (() => {
  try {
    execFileSync('git', ['-C', fileURLToPath(root), 'rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

test('every published copy is git-ignored, so copies are never committed', { skip: inGitCheckout ? false : 'not in a git checkout' }, () => {
  const paths = ['navigation/projects/calls/calls.md', '_data/projects/calls/calls.yml', 'assets/js/projects/calls/call-page.js'];
  const ignored = execFileSync('git', ['-C', fileURLToPath(root), 'check-ignore', ...paths], { encoding: 'utf8' }).trim().split('\n');
  assert.deepEqual(ignored, paths);
});

test('the system is registered, built in make dev because /dm loads call-link.js', () => {
  const lines = readFileSync(new URL('_projects/.makeprojects', root), 'utf8').split('\n').map((line) => line.trim());
  assert.ok(lines.includes('systems/calls:dev'));
});

test('modules import only ./ files that publish beside them', () => {
  for (const [name, code] of Object.entries(sources)) {
    const specifiers = [...code.matchAll(/\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
    for (const specifier of specifiers) {
      assert.ok(specifier.startsWith('./') && !specifier.includes('/', 2), `${name} imports ${specifier}`);
      assert.ok(modules.includes(specifier.slice(2)), `${name} imports ${specifier}, which isn't in js/`);
    }
  }
});

test('no module writes its own visible text or imports config.js', () => {
  for (const name of modules) {
    assert.doesNotMatch(code(name), /\b(?:from|import)\s*\(?\s*['"][^'"]*config\.js['"]/, `${name} imports config.js`);
    assert.doesNotMatch(code(name), /\.textContent\s*=\s*['"`][A-Za-z]/, `${name} sets literal text`);
    assert.doesNotMatch(code(name), /innerHTML/, `${name} writes HTML`);
  }
});

// Keys read through a variable, listed by hand from the code that builds them.
const DYNAMIC = [
  // CallPage's ENDINGS
  'left', 'disconnected', 'removed', 'ended',
  // CallPeople's Pause or Resume
  'pause', 'resume',
  // CallModel's REASON_KEYS and its fallback
  'waiting_supervisor', 'waiting_second_adult', 'not_a_member', 'not_found', 'unavailable', 'not_a_moderator', 'participant_gone', 'refused',
];

test('every string the modules ask for is in data/calls.yml, and every one there is used', () => {
  const { text } = readStrings();
  const used = new Set(DYNAMIC);
  Object.values(sources).forEach((code) => {
    for (const match of code.matchAll(/\b(?:this\.)?t\.([a-z_]+)\b/g)) used.add(match[1]);
    for (const match of code.matchAll(/strings\.text\.([a-z_]+)/g)) used.add(match[1]);
  });
  read('pages/calls.md').replace(/calls_strings\.text\.([a-z_]+)/g, (_, key) => used.add(key));
  const missing = [...used].filter((key) => !Object.hasOwn(text, key));
  assert.deepEqual(missing, [], 'used but not in data/calls.yml');
  const unused = Object.keys(text).filter((key) => !used.has(key));
  assert.deepEqual(unused, [], 'in data/calls.yml but never used');
  Object.entries(text).forEach(([key, value]) => assert.equal(typeof value, 'string', `${key} is not a string`));
});

test('the purposes in data/calls.yml are the ones Spring allows by default', () => {
  const { purposes } = readStrings();
  assert.deepEqual(Object.keys(purposes), ['meeting', 'standup']);
});

test('LiveKit loads from one pinned cdnjs address with its integrity hash, only in livekit-script.js', () => {
  const loader = sources['livekit-script.js'];
  assert.match(loader, /static VERSION = '2\.23\.0';/);
  assert.match(loader, /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/livekit-client\/\$\{LiveKitScript\.VERSION\}\/livekit-client\.umd\.min\.js/);
  assert.match(loader, /static INTEGRITY = 'sha512-[A-Za-z0-9+/]{86}==';/);
  assert.match(loader, /script\.crossOrigin = 'anonymous'/);
  modules.filter((name) => name !== 'livekit-script.js')
    .forEach((name) => assert.doesNotMatch(code(name), /cdnjs|LivekitClient/, `${name} loads LiveKit itself`));
});
