// Every string the editor and canvas show comes from data/ui_builder_editor.yml (text.editor) or
// the registry; a missing key would show up on screen as its own name. This reads the modules'
// say('key') and text('path') calls and checks them against the real YAML.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { textOf } from '../js/registry.js';
import { loadRegistry, needsRuby, readYaml } from './helpers.mjs';

const dir = (name) => fileURLToPath(new URL(`../${name}/`, import.meta.url));
const editorSources = readdirSync(dir('js')).filter((file) => /^(editor-|canvas)/.test(file)).map((file) => readFileSync(`${dir('js')}${file}`, 'utf8'));
const allSources = [
  ...readdirSync(dir('js')).map((file) => readFileSync(`${dir('js')}${file}`, 'utf8')),
  ...readdirSync(dir('pages')).map((file) => readFileSync(`${dir('pages')}${file}`, 'utf8')),
];

// Keys built at run time, listed by hand from the code that builds them.
const DYNAMIC = [
  'status_DRAFT', 'status_PUBLISHED', 'status_LOCAL', 'status_DELETED', 'rev_SAVE', 'rev_PUBLISH', 'rev_RESTORE',
  'slot_title', 'slot_text', 'slot_image', 'slot_link', 'slot_value', 'slot_label',
  'export_page', 'export_json', 'show_html', 'revisions', 'page_settings', 'pub_none', 'pub_live', 'pub_changes',
];

function matches(pattern) {
  const found = new Set();
  for (const source of editorSources) for (const match of source.matchAll(pattern)) found.add(match[1]);
  return [...found];
}

test('every editor string the modules ask for is in ui_builder_editor.yml', needsRuby, () => {
  const strings = readYaml('ui_builder_editor.yml');
  const used = [
    ...matches(/\bsay\(\s*'([a-z0-9_]+)'/g),
    ...matches(/key: '((?:save|err)_[a-z_]+|not_found)'/g),
    ...DYNAMIC,
  ];
  assert.ok(used.length > 150, `found ${used.length} keys`);
  const missing = used.filter((key) => typeof strings[key] !== 'string');
  assert.deepEqual(missing, []);
});

test('registry paths the editor reads exist in the merged registry', needsRuby, () => {
  const registry = loadRegistry();
  const paths = matches(/\btext\(\s*'([a-z_]+\.[a-z0-9_.]+)'/g);
  assert.ok(paths.includes('teacher.approve_public'));
  const missing = paths.filter((path) => textOf(registry, path) === path);
  assert.deepEqual(missing, []);
});

test('no editor string is left unused', needsRuby, () => {
  const strings = readYaml('ui_builder_editor.yml');
  const haystack = allSources.join('\n');
  const unused = Object.keys(strings).filter((key) => !DYNAMIC.includes(key) && !new RegExp(`['.\`]${key}['\`\\s]`).test(haystack) && !haystack.includes(`editor.${key}`) && !haystack.includes(`ui_builder_editor.${key}`));
  assert.deepEqual(unused, []);
});

test('no editor string breaks a placeholder', needsRuby, () => {
  for (const [key, value] of Object.entries(readYaml('ui_builder_editor.yml'))) {
    assert.equal((value.match(/\{/g) || []).length, (value.match(/\}/g) || []).length, key);
    assert.doesNotMatch(value, /\{[^a-z}]/, `${key}: placeholders are {lower_case}`);
  }
});
