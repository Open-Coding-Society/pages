import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterPalette, sectionChoices } from '../js/editor-palette.js';
import { paletteOf, textOf } from '../js/registry.js';
import { loadRegistry, needsRuby } from './helpers.mjs';

test('search matches every word in a block\'s name or help, ignoring case and accents', needsRuby, () => {
  const groups = paletteOf(loadRegistry(), { capabilities: { spring: true, flask: true } });
  const types = (query) => filterPalette(groups, query).flatMap((group) => group.items.map((item) => item.type));
  assert.ok(types('chat').includes('chat'));
  assert.deepEqual(types('API data'), ['api_data']);
  assert.ok(types('KANBAN').includes('kanban'));
  assert.deepEqual(types('zzz'), []);
  assert.equal(filterPalette(groups, '   '), groups, 'an empty query keeps every group');
  assert.ok(types('K\u00e1nban').includes('kanban'), 'accents in the query are folded');
});

test('blocks this site can\'t run stay listed with the reason', needsRuby, () => {
  const registry = loadRegistry();
  const flaskOnly = paletteOf(registry, { capabilities: { spring: false, flask: true } }).flatMap((group) => group.items);
  const chat = flaskOnly.find((item) => item.type === 'chat');
  assert.equal(chat.disabled, true);
  assert.equal(textOf(registry, chat.reasonKey), registry.text.blocks.live_needs_spring);
  const full = paletteOf(registry, { capabilities: { spring: true, flask: true }, liveCount: registry.limits.live_blocks }).flatMap((group) => group.items);
  assert.equal(full.find((item) => item.type === 'kanban').reasonKey, 'errors.too_many_live');
  assert.equal(full.find((item) => item.type === 'hero').disabled, false);
});

test('the section picker offers One column and every Columns layout', needsRuby, () => {
  const registry = loadRegistry();
  const choices = sectionChoices(registry, (key, vars) => textOf({ text: { editor: { section_columns: 'Columns: {layout}' } } }, `editor.${key}`, vars));
  assert.deepEqual(choices.map((choice) => [choice.type, choice.layout]), [
    ['stack', undefined], ['columns', 'halves'], ['columns', 'thirds'], ['columns', 'sidebar_left'], ['columns', 'sidebar_right'],
  ]);
  assert.equal(choices[1].label, 'Columns: Two equal columns');
});
