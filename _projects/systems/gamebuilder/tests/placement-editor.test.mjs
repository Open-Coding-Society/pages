/**
 * @module placement-editor-tests
 * @description Contracts for drawing list items on the preview.
 * @data Uses the real `game-templates.json` lists that can be drawn.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { boxBetween } from '../js/placement-editor.mjs';
import { validateGameTemplates } from '../js/game-templates.mjs';

const templateData = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const drawable = (id) => templateData.find((template) => template.id === id).sections
  .filter((section) => section.list?.draw).map((section) => `${section.list.id}:${section.list.draw}`);

test('Platform platforms are drawn as boxes and Racing obstacles as points', () => {
  assert.deepEqual(drawable('platform'), ['platforms:box']);
  assert.deepEqual(drawable('racing'), ['obstacles:point']);
});

test('a dragged box is the same whichever corner the drag starts from', () => {
  const expected = { x: 0.2, y: 0.6, width: 0.3, height: 0.05 };
  assert.deepEqual(boxBetween({ x: 0.2, y: 0.6 }, { x: 0.5, y: 0.65 }), expected);
  assert.deepEqual(boxBetween({ x: 0.5, y: 0.65 }, { x: 0.2, y: 0.6 }), expected);
  assert.deepEqual(boxBetween({ x: 0.2034, y: 0.6 }, { x: 0.4961, y: 0.6512 }), { x: 0.2, y: 0.6, width: 0.29, height: 0.05 },
    'values round to the panel step of 0.01');
});

test('a click or a sliver is not a box', () => {
  assert.equal(boxBetween({ x: 0.3, y: 0.3 }, { x: 0.3, y: 0.3 }), null);
  assert.equal(boxBetween({ x: 0.3, y: 0.3 }, { x: 0.6, y: 0.302 }), null);
});

test('a drawable list must have the number fields its drawing sets', () => {
  const rpg = { id: 'rpg', name: 'RPG', description: '', codeReady: true, panel: 'rpg' };
  const listWith = (draw, fieldIds) => [rpg, {
    id: 'x', name: 'X', description: '', codeReady: false, assets: { pics: [{ name: 'A', src: '/a.png' }] },
    sections: [{ legend: 'L', list: { id: 'things', itemName: 'Thing', draw, fields: fieldIds.map((id) => (
      { id, label: id, type: 'number', min: 0, max: 1, step: 0.01, default: 0.5 })) } }]
  }];
  assert.doesNotThrow(() => validateGameTemplates(listWith('point', ['x', 'y'])));
  assert.throws(() => validateGameTemplates(listWith('box', ['x', 'y'])), /Invalid game templates/);
  assert.throws(() => validateGameTemplates(listWith('circle', ['x', 'y'])), /Invalid game templates/);
});
