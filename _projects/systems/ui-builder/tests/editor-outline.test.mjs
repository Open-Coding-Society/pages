import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dropTargetOf, treeRows } from '../js/editor-outline.js';
import { addBlock, addSection, createPage, moveNodeTo, outlineOf } from '../js/page-model.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

function page() {
  const registry = loadRegistry();
  const ids = counterIds();
  let built = createPage(registry, { template: 'blank', ids });
  built = addSection(built, registry, { type: 'columns', layout: 'halves', ids });
  const columns = built.sections[1].id;
  built = addBlock(built, registry, { type: 'text', sectionId: columns, cellIndex: 0, ids });
  built = addBlock(built, registry, { type: 'card', sectionId: columns, cellIndex: 0, ids });
  return { registry, page: built };
}

test('every cell ends with an Add block row, and siblings count it', needsRuby, () => {
  const { registry, page: built } = page();
  const rows = treeRows(outlineOf(built, registry));
  assert.deepEqual(rows.map((row) => `${row.kind}:${row.depth}`), [
    'section:0', 'block:1', 'add:1',
    'section:0', 'cell:1', 'block:2', 'block:2', 'add:2', 'cell:1', 'add:2',
  ]);
  const cellBlocks = rows.filter((row) => row.kind === 'block' && row.depth === 2);
  assert.deepEqual(cellBlocks.map((row) => [row.position, row.setSize]), [[1, 3], [2, 3]]);
  const adds = rows.filter((row) => row.kind === 'add');
  assert.deepEqual(adds.map((row) => [row.cellIndex, row.position, row.setSize]), [[0, 2, 2], [0, 3, 3], [1, 1, 1]]);
  assert.equal(rows[0].hasChildren, true);
  assert.equal(rows[1].hasChildren, false);
  assert.equal(rows.every((row) => row.visible), true);
});

test('a collapsed row hides everything under it and nothing else', needsRuby, () => {
  const { registry, page: built } = page();
  const columns = built.sections[1].id;
  const rows = treeRows(outlineOf(built, registry), { collapsed: new Set([`${columns}:cell-0`]) });
  const hidden = rows.filter((row) => !row.visible).map((row) => row.kind);
  assert.deepEqual(hidden, ['block', 'block', 'add']);
  assert.equal(rows.find((row) => row.key === `${columns}:cell-0`).expanded, false);
  const closedSection = treeRows(outlineOf(built, registry), { collapsed: new Set([columns]) });
  assert.equal(closedSection.filter((row) => !row.visible).length, 6, 'both cells and their rows');
  assert.equal(closedSection.find((row) => row.key === columns).visible, true);
});

test('drops become moveNodeTo targets that land where the row says', needsRuby, () => {
  const { registry, page: built } = page();
  const rows = treeRows(outlineOf(built, registry));
  const [hero, text, card] = rows.filter((row) => row.kind === 'block');
  const sections = rows.filter((row) => row.kind === 'section');
  const addSecond = rows.filter((row) => row.kind === 'add')[2];
  assert.deepEqual(dropTargetOf(card, text, 'before'), { sectionId: text.sectionId, cellIndex: 0, index: 0 });
  assert.equal(dropTargetOf(text, card, 'before'), null, 'already there');
  assert.deepEqual(dropTargetOf(text, card, 'after'), { sectionId: text.sectionId, cellIndex: 0, index: 1 });
  assert.deepEqual(dropTargetOf(hero, addSecond, 'after'), { sectionId: addSecond.sectionId, cellIndex: 1 });
  assert.deepEqual(dropTargetOf(sections[1], sections[0], 'before'), { index: 0 });
  assert.equal(dropTargetOf(sections[0], sections[0], 'after'), null);
  assert.equal(dropTargetOf(sections[0], hero, 'after'), null, 'sections drop only on sections');
  const moved = moveNodeTo(built, card.id, dropTargetOf(card, text, 'before'));
  assert.deepEqual(moved.sections[1].cells[0].blocks.map((block) => block.type), ['card', 'text']);
  const across = moveNodeTo(built, hero.id, dropTargetOf(hero, addSecond, 'after'));
  assert.deepEqual(across.sections[1].cells[1].blocks.map((block) => block.type), ['hero']);
});
