/**
 * @module game-templates-tests
 * @description Contracts for the game type list and template starter settings.
 * @data Reads the real `game-templates.json` and a small asset catalog.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createAssetCatalog } from '../js/asset-catalog.mjs';
import { createListItem, createTemplateOptions, validateGameTemplates } from '../js/game-templates.mjs';

const templateData = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const readManifest = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const catalog = createAssetCatalog(readManifest('../images/bg/index.json'), readManifest('../images/sprites/index.json'));

test('the game type list offers RPG, Racing, Platform and Clicker in that order', () => {
  const templates = validateGameTemplates(templateData);
  assert.deepEqual(templates.map((template) => template.name), ['RPG', 'Racing', 'Platform', 'Clicker']);
  assert.equal(templates[0].panel, 'rpg');
  assert.deepEqual(templates.filter((template) => template.codeReady).map((template) => template.id), ['rpg']);
});

test('starter settings use defaults from the data file and the catalog', () => {
  const byId = new Map(templateData.map((template) => [template.id, template]));
  const clicker = createTemplateOptions(byId.get('clicker'), catalog);
  assert.equal(clicker.targetSpriteKey, 'cookie');
  assert.equal(clicker.goalScore, 100);
  assert.deepEqual(clicker.powerUps, []);

  const racing = createTemplateOptions(byId.get('racing'), catalog);
  assert.equal(racing.laps, 3);
  assert.equal(racing.secondPlayer, false);
  assert.equal(racing.backgroundKey, catalog.backgrounds.keys().next().value);
});

test('a missing default asset falls back to the first catalog entry', () => {
  const template = {
    id: 'demo', name: 'Demo', description: '', codeReady: false,
    sections: [{ legend: 'A', fields: [{ id: 'spriteKey', label: 'Sprite', type: 'sprite', default: 'gone' }] }]
  };
  validateGameTemplates([{ id: 'rpg', name: 'RPG', description: '', codeReady: true, panel: 'rpg' }, template]);
  assert.equal(createTemplateOptions(template, catalog).spriteKey, catalog.sprites.keys().next().value);
});

test('new list items get unique ids even after removals', () => {
  const list = templateData.find((template) => template.id === 'platform')
    .sections.find((section) => section.list?.id === 'platforms').list;
  const first = createListItem(list, [], catalog);
  assert.equal(first.id, 'platforms-1');
  assert.equal(first.visible, true);
  const afterRemoval = createListItem(list, [{ id: 'platforms-2' }], catalog);
  assert.equal(afterRemoval.id, 'platforms-3');
});

test('malformed template data is rejected before any panel is drawn', () => {
  const rpg = { id: 'rpg', name: 'RPG', description: '', codeReady: true, panel: 'rpg' };
  const withField = (field) => [rpg, { id: 'x', name: 'X', description: '', codeReady: false, sections: [{ legend: 'A', fields: [field] }] }];
  for (const data of [
    [],
    [{ ...rpg, panel: undefined, sections: [] }],
    [rpg, rpg],
    withField({ id: 'n', label: 'N', type: 'number', min: 1, max: 5, step: 1, default: 9 }),
    withField({ id: 'c', label: 'C', type: 'choice', default: 'z', choices: [{ value: 'a', label: 'A' }] }),
    withField({ id: 'f', label: 'F', type: 'colour', default: 'red' }),
    [rpg, { id: 'x', name: 'X', description: '', codeReady: false, sections: [{ legend: 'A' }] }]
  ]) {
    assert.throws(() => validateGameTemplates(data), /Invalid game templates/);
  }
});
