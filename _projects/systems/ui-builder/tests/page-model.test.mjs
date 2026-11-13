import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textOf } from '../js/registry.js';
import {
  addBlock, addSection, countLive, createPage, duplicateNode, findNode, importPageJSON, moveNode, moveNodeTo, normalizePage,
  outlineOf, removeNode, setHidden, stripHidden, updatePageSettings, updateSettings, validatePage,
} from '../js/page-model.js';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

const ID = /^[sb]-[a-z0-9]{6,12}$/;
const ALL_BLOCKS = new URL('./fixtures/specs/valid/all-blocks.json', import.meta.url);

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) deepFreeze(value[key]);
  }
  return value;
}

// "s-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]": sections, cells, blocks.
const shape = (page) => page.sections.map((s) => `${s.id}[${s.cells.map((c) => c.blocks.map((b) => b.id).join(',')).join('|')}]`).join(' ');
const idsOf = (page) => page.sections.flatMap((s) => [s.id, ...s.cells.flatMap((c) => c.blocks.map((b) => b.id))]);
const block = (id, type = 'divider', settings = {}) => ({ id, type, settings });

function sample(registry) {
  return deepFreeze(normalizePage({
    schemaVersion: 1, kind: 'ocs-ui-page', page: { title: 'Sample' },
    sections: [
      { id: 's-aaaaaa', type: 'stack', cells: [{ blocks: [block('b-aaaaaa'), block('b-bbbbbb')] }] },
      { id: 's-bbbbbb', type: 'columns', settings: { layout: 'halves' }, cells: [{ blocks: [block('b-cccccc')] }, { blocks: [block('b-dddddd'), block('b-eeeeee')] }] },
    ],
  }, registry, { ids: counterIds() }));
}
const START = 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]';

test('every template becomes a page with fresh ids and only its intentional blanks', needsRuby, () => {
  const registry = loadRegistry();
  // Templates leave these required fields for the student to fill in.
  const BLANKS = {
    blank: [], project_showcase: ['video.url:required'], flask_api_starter: [], about_me: [],
    team_project: ['kanban.url:required', 'chat.group:required'], natm_booth: ['video.url:required', 'api_data.source:bad_api'], nonprofit_project: [],
  };
  assert.deepEqual(registry.templates.map((t) => t.key).sort(), Object.keys(BLANKS).sort());
  for (const template of registry.templates) {
    const page = createPage(registry, { template: template.key, ids: counterIds() });
    const ids = idsOf(page);
    assert.ok(ids.every((id) => ID.test(id)) && new Set(ids).size === ids.length, template.key);
    assert.equal(page.page.title, template.page.page.title);
    const issues = validatePage(page, registry, { pageOrigin: 'https://pages.opencodingsociety.com' });
    assert.deepEqual(issues.map((i) => `${findNode(page, i.nodeId).node.type}.${i.field}:${i.key}`), BLANKS[template.key], template.key);
  }
  assert.equal(createPage(registry, { ids: counterIds() }).sections[0].cells[0].blocks[0].type, 'hero', 'blank is the default');
  const fromObject = createPage(registry, { template: registry.templates[1], ids: counterIds() });
  assert.equal(fromObject.page.title, registry.templates[1].page.page.title);
  assert.throws(() => createPage(registry, { template: 'nope', ids: counterIds() }), /unknown template nope/);
  assert.throws(() => createPage(registry, { template: 'blank' }), /pass ids\(kind\)/);
  const bare = createPage({ ...registry, templates: [] }, { ids: counterIds() });
  assert.deepEqual([bare.page.title, bare.sections.length], [textOf(registry, 'blocks.untitled'), 0]);
});

test('normalizePage turns anything into an editable page and never throws', needsRuby, () => {
  const registry = loadRegistry();
  for (const raw of [null, undefined, 'page', 42, [], { sections: 'x' }, { sections: [null, 7, { type: 'nope' }] }, { page: [] }]) {
    const page = normalizePage(raw, registry, { ids: counterIds() });
    assert.deepEqual(page.sections, []);
    assert.deepEqual(validatePage(page, registry).map((i) => i.key), ['required'], 'only the empty title is left');
  }
  assert.throws(() => normalizePage({}, registry, {}), /pass ids\(kind\)/);
});

test('normalizePage keeps known keys, fills defaults and fixes types without losing content', needsRuby, () => {
  const registry = loadRegistry();
  const raw = {
    schemaVersion: 7, kind: 'x', extra: 1, page: { title: 'T'.repeat(130), course: 'nope', width: 'huge', junk: 1 },
    sections: [{ id: 's-keep01', type: 'stack', settings: { junk: 1 }, hidden: 'yes', cells: [{ blocks: [
      { id: 'b-keep01', type: 'heading', settings: { text: 42, level: 3, subtitle: { x: 1 }, extra: 'x' }, hidden: true },
      { id: 'b-keep02', type: 'marquee', settings: {} },
      { id: 'b-keep03', type: 'buttons', settings: { links: [{ label: 'Go', url: 'javascript:x', target: '_top' }, 'x', null] } },
      { id: 'b-keep04', type: 'api_data', settings: { limit: ' 7 ', view: 'pie', source: { url: 'https://x.example/api', title_path: 'a b', snapshot: { items: [{ title: 'A', link: 'javascript:x', image: 'https://x.example/a.png', email: 'e', value: 3 }, 'x'], fetched_at: -5 } } } },
      { id: 'b-keep05', type: 'chat', settings: { group: { id: '42', name: 'Team', secret: 1 } } },
      { id: 'b-keep06', type: 'members', settings: { group: { id: -1, name: 'x' } } },
      { id: 'b-keep07', type: 'checklist', settings: { items: [{ text: 'A', done: 'yes', extra: 1 }, 7] } },
      { id: 'b-keep08', type: 'announcements', settings: { course: 'CSP', limit: 3.5 } },
    ] }] }],
  };
  const page = normalizePage(raw, registry, { ids: counterIds() });
  assert.deepEqual(Object.keys(page), ['schemaVersion', 'kind', 'page', 'sections']);
  assert.deepEqual([page.schemaVersion, page.kind], [1, 'ocs-ui-page']);
  assert.deepEqual(page.page, { title: 'T'.repeat(130), description: '', byline: '', image: '', width: 'contained', course: '' }, 'content kept, choices fixed');
  const [section] = page.sections;
  assert.deepEqual([section.settings, section.hidden], [{}, false]);
  const blocks = section.cells[0].blocks;
  assert.deepEqual(blocks.map((b) => b.type), ['heading', 'buttons', 'api_data', 'chat', 'members', 'checklist', 'announcements'], 'unknown types dropped');
  assert.deepEqual(blocks[0], { id: 'b-keep01', type: 'heading', settings: { text: '42', level: '3', subtitle: '' }, hidden: true });
  assert.deepEqual(blocks[1].settings, { links: [{ label: 'Go', url: 'javascript:x' }], emphasize_first: true }, 'bad links stay for the validator');
  assert.deepEqual(blocks[2].settings.limit, 7);
  assert.equal(blocks[2].settings.view, 'cards');
  assert.equal(blocks[2].settings.source.title_path, 'a b');
  assert.deepEqual(blocks[2].settings.source.snapshot, { items: [{ title: 'A', text: '', image: 'https://x.example/a.png', link: '', value: '3', label: '' }], fetched_at: 0, from_loopback: false }, 'saved copies are sanitized');
  assert.deepEqual(blocks[3].settings.group, { id: 42, name: 'Team' });
  assert.equal(blocks[4].settings.group, null);
  assert.deepEqual(blocks[5].settings.items, [{ text: 'A', done: false }]);
  assert.deepEqual([blocks[6].settings.course, blocks[6].settings.limit], ['', 3.5], 'unknown course codes are cleared; numbers stay for the validator');
});

test('normalizePage fits cells to the layout and replaces bad, wrong-kind and repeated ids', needsRuby, () => {
  const registry = loadRegistry();
  const page = normalizePage({ sections: [
    { id: 's-one111', type: 'stack', cells: [{ blocks: [block('b-000001')] }, { blocks: [block('x')] }, 'junk'] },
    { id: 'b-000002', type: 'columns', settings: { layout: 'thirds' }, cells: [{ blocks: [block('s-000003')] }] },
    { id: 's-one111', type: 'columns', settings: { layout: 'halves' }, cells: [{ blocks: [] }, { blocks: [block('b-000001')] }, { blocks: [block('b-aaaaaa'), block('b-bbbbbb')] }, { blocks: [block('b-cccccc')] }] },
  ] }, registry, { ids: counterIds() });
  // The first valid use of an id is kept; new ids skip every id the file already uses.
  assert.equal(shape(page), 's-one111[b-000001,b-000002] s-000003[b-000004||] s-000005[|b-000006,b-aaaaaa,b-bbbbbb,b-cccccc]');
  assert.throws(() => normalizePage({ sections: [{ type: 'stack' }] }, registry, { ids: () => 'nope' }), /keeps returning invalid or used ids/);
});

test('normalizePage copies: the input is never changed or shared, and __proto__ never travels', needsRuby, () => {
  const registry = loadRegistry();
  const text = readFileSync(ALL_BLOCKS, 'utf8');
  const raw = deepFreeze(JSON.parse(text));
  const page = normalizePage(raw, registry, { ids: counterIds() });
  assert.deepEqual(page, JSON.parse(text), 'a valid page comes back unchanged');
  page.sections[0].cells[0].blocks[0].settings.links.push({ label: 'x', url: '/x' });
  assert.equal(raw.sections[0].cells[0].blocks[0].settings.links.length, 3);
  const hostile = JSON.parse('{"__proto__":{"polluted":1},"page":{"title":"x","__proto__":{"polluted":2}},"sections":[{"type":"stack","constructor":{"prototype":{"polluted":3}},"cells":[{"blocks":[{"type":"buttons","settings":{"__proto__":{"polluted":4},"links":[{"label":"a","url":"/a","__proto__":{"polluted":5}}]}}]}]}]}');
  const clean = normalizePage(hostile, registry, { ids: counterIds() });
  assert.equal({}.polluted, undefined);
  assert.equal(Object.prototype.polluted, undefined);
  assert.ok(!JSON.stringify(clean).includes('polluted'));
  assert.equal(Object.getPrototypeOf(clean.sections[0].cells[0].blocks[0].settings), Object.prototype);
});

test('addSection and addBlock insert defaults where asked and leave the input alone', needsRuby, () => {
  const registry = loadRegistry();
  const page = sample(registry);
  const ids = counterIds();
  const one = addSection(page, registry, { ids });
  assert.equal(shape(one), `${START} s-000001[]`);
  assert.deepEqual(one.sections[2], { id: 's-000001', type: 'stack', settings: {}, hidden: false, cells: [{ blocks: [] }] });
  assert.equal(one.sections[0], page.sections[0], 'unchanged sections are shared');
  const thirds = addSection(page, registry, { type: 'columns', layout: 'thirds', index: 0, newId: 's-mine01' });
  assert.equal(shape(thirds).split(' ')[0], 's-mine01[||]');
  assert.equal(addSection(page, registry, { type: 'columns', layout: '__proto__', ids }).sections[2].settings.layout, 'halves');
  assert.throws(() => addSection(page, registry, { newId: 's-aaaaaa' }), /not a free s- id/);
  assert.throws(() => addSection(page, registry, { newId: 'b-zzzzzz' }), /not a free s- id/);
  assert.throws(() => addSection(page, registry, { type: 'grid', ids }), /unknown section type grid/);
  const added = addBlock(page, registry, { type: 'buttons', sectionId: 's-bbbbbb', cellIndex: 1, index: 1, settings: { links: [{ label: 'Go', url: '/go' }], junk: 1 }, newId: 'b-new001' });
  assert.equal(shape(added), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-new001,b-eeeeee]');
  assert.deepEqual(findNode(added, 'b-new001').node, { id: 'b-new001', type: 'buttons', settings: { links: [{ label: 'Go', url: '/go' }], emphasize_first: true }, hidden: false });
  assert.equal(shape(addBlock(page, registry, { type: 'text', sectionId: 's-aaaaaa', ids: counterIds() })), 's-aaaaaa[b-aaaaaa,b-bbbbbb,b-000001] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]');
  for (const target of [{ sectionId: 'b-aaaaaa' }, { sectionId: 's-nope00' }, { sectionId: 's-bbbbbb', cellIndex: 2 }, { sectionId: 's-bbbbbb', cellIndex: -1 }]) {
    assert.equal(addBlock(page, registry, { type: 'text', ids, ...target }), page, JSON.stringify(target));
  }
  assert.throws(() => addBlock(page, registry, { type: 'marquee', sectionId: 's-aaaaaa', ids }), /unknown block type marquee/);
  assert.equal(shape(page), START);
});

test('moveNode steps through cells and sections; edges and bad deltas change nothing', needsRuby, () => {
  const registry = loadRegistry();
  const page = sample(registry);
  const moved = (id, delta) => shape(moveNode(page, id, delta));
  assert.equal(moved('b-bbbbbb', -1), 's-aaaaaa[b-bbbbbb,b-aaaaaa] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]');
  assert.equal(moved('b-dddddd', -1), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc,b-dddddd|b-eeeeee]', 'into the end of the cell before');
  assert.equal(moved('b-cccccc', -1), 's-aaaaaa[b-aaaaaa,b-bbbbbb,b-cccccc] s-bbbbbb[|b-dddddd,b-eeeeee]', 'into the end of the section before');
  assert.equal(moved('b-bbbbbb', 1), 's-aaaaaa[b-aaaaaa] s-bbbbbb[b-bbbbbb,b-cccccc|b-dddddd,b-eeeeee]', 'into the start of the next section');
  assert.equal(moved('b-cccccc', 1), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[|b-cccccc,b-dddddd,b-eeeeee]');
  assert.equal(moved('b-aaaaaa', 3), 's-aaaaaa[b-bbbbbb] s-bbbbbb[b-cccccc,b-aaaaaa|b-dddddd,b-eeeeee]');
  assert.equal(moved('b-eeeeee', -1e9), 's-aaaaaa[b-eeeeee,b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd]', 'huge deltas stop at the top');
  assert.equal(moved('s-bbbbbb', -1), 's-bbbbbb[b-cccccc|b-dddddd,b-eeeeee] s-aaaaaa[b-aaaaaa,b-bbbbbb]');
  for (const [id, delta] of [['b-aaaaaa', -1], ['b-eeeeee', 1], ['s-aaaaaa', -1], ['s-bbbbbb', 1], ['b-aaaaaa', 0], ['b-aaaaaa', 0.5], ['b-aaaaaa', '1'], ['b-nope00', 1], [null, 1]]) {
    assert.equal(moveNode(page, id, delta), page, `${id} ${delta}`);
  }
});

test('moveNodeTo places a block at its index after the move, or a section in the list', needsRuby, () => {
  const registry = loadRegistry();
  const page = sample(registry);
  const to = (id, target) => shape(moveNodeTo(page, id, target));
  assert.equal(to('b-aaaaaa', { sectionId: 's-bbbbbb', cellIndex: 1, index: 1 }), 's-aaaaaa[b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-aaaaaa,b-eeeeee]');
  assert.equal(to('b-dddddd', { sectionId: 's-bbbbbb', cellIndex: 1, index: 1 }), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-eeeeee,b-dddddd]', 'same cell: the index after removal');
  assert.equal(to('b-aaaaaa', { sectionId: 's-bbbbbb' }), 's-aaaaaa[b-bbbbbb] s-bbbbbb[b-cccccc,b-aaaaaa|b-dddddd,b-eeeeee]', 'default: the end of cell 0');
  assert.equal(to('b-aaaaaa', { sectionId: 's-bbbbbb', cellIndex: 1, index: 99 }), 's-aaaaaa[b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee,b-aaaaaa]');
  assert.equal(to('s-aaaaaa', { index: 5 }), 's-bbbbbb[b-cccccc|b-dddddd,b-eeeeee] s-aaaaaa[b-aaaaaa,b-bbbbbb]');
  const same = [['b-bbbbbb', { sectionId: 's-aaaaaa', index: 1 }], ['b-bbbbbb', { sectionId: 's-aaaaaa', index: 9 }], ['s-aaaaaa', { index: -3 }],
    ['b-aaaaaa', { sectionId: 'b-cccccc' }], ['b-aaaaaa', { sectionId: 's-bbbbbb', cellIndex: 2 }], ['b-aaaaaa', null], ['s-aaaaaa', { index: '1' }], ['b-zzzzzz', { sectionId: 's-aaaaaa' }]];
  for (const [id, target] of same) assert.equal(moveNodeTo(page, id, target), page, `${id} ${JSON.stringify(target)}`);
});

test('removeNode, duplicateNode and setHidden', needsRuby, () => {
  const registry = loadRegistry();
  const page = sample(registry);
  assert.equal(shape(removeNode(page, 'b-dddddd')), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-eeeeee]');
  assert.equal(shape(removeNode(page, 's-aaaaaa')), 's-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]');
  assert.equal(removeNode(page, 'b-zzzzzz'), page);
  const copy = duplicateNode(page, 'b-aaaaaa', { ids: counterIds() });
  assert.equal(shape(copy), 's-aaaaaa[b-aaaaaa,b-000001,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee]');
  assert.notEqual(findNode(copy, 'b-000001').node.settings, page.sections[0].cells[0].blocks[0].settings, 'a deep copy');
  assert.equal(shape(duplicateNode(page, 's-bbbbbb', { ids: counterIds(), newId: 's-copy01' })), `${START} s-copy01[b-000001|b-000002,b-000003]`);
  assert.equal(duplicateNode(page, 'b-zzzzzz', { ids: counterIds() }), page);
  assert.throws(() => duplicateNode(page, 'b-aaaaaa', {}), /pass ids\(kind\)/);
  const hidden = setHidden(page, 'b-cccccc', true);
  assert.equal(findNode(hidden, 'b-cccccc').node.hidden, true);
  assert.equal(setHidden(hidden, 'b-cccccc', true), hidden, 'no change, same page');
  assert.equal(findNode(setHidden(hidden, 'b-cccccc', 'yes'), 'b-cccccc').node.hidden, false, 'only true hides');
  assert.equal(setHidden(page, 'b-zzzzzz', true), page);
  assert.equal(findNode(setHidden(page, 's-aaaaaa', true), 's-aaaaaa').node.hidden, true);
});

test('updateSettings normalizes patches, ignores other keys and refits Columns cells', needsRuby, () => {
  const registry = loadRegistry();
  const page = sample(registry);
  const thirds = updateSettings(page, registry, 's-bbbbbb', { layout: 'thirds' });
  assert.equal(shape(thirds), 's-aaaaaa[b-aaaaaa,b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee|]');
  const back = updateSettings(updateSettings(thirds, registry, 'b-aaaaaa', {}), registry, 's-bbbbbb', { layout: 'halves' });
  assert.equal(shape(back), START);
  const moved = moveNodeTo(thirds, 'b-aaaaaa', { sectionId: 's-bbbbbb', cellIndex: 2 });
  assert.equal(shape(updateSettings(moved, registry, 's-bbbbbb', { layout: 'sidebar_left' })), 's-aaaaaa[b-bbbbbb] s-bbbbbb[b-cccccc|b-dddddd,b-eeeeee,b-aaaaaa]', 'blocks of removed cells join the last cell kept');
  assert.equal(updateSettings(page, registry, 's-bbbbbb', { layout: 'nope' }), page, 'an invalid layout becomes the default, which it already is');
  let text = addBlock(page, registry, { type: 'heading', sectionId: 's-aaaaaa', newId: 'b-head01' });
  text = updateSettings(text, registry, 'b-head01', { text: 'Hi', level: 3, nope: 1 });
  assert.deepEqual(findNode(text, 'b-head01').node.settings, { text: 'Hi', level: '3', subtitle: '' });
  assert.equal(updateSettings(text, registry, 'b-head01', { text: 'Hi' }), text, 'equal values change nothing');
  for (const patch of [null, 'x', [], undefined]) assert.equal(updateSettings(text, registry, 'b-head01', patch), text);
  assert.equal(updateSettings(text, registry, 'b-zzzzzz', { text: 'x' }), text);
  const polluted = updateSettings(text, registry, 'b-head01', JSON.parse('{"__proto__":{"polluted":1},"constructor":{"prototype":{"polluted":2}},"text":"Yo"}'));
  assert.equal({}.polluted, undefined);
  assert.deepEqual(Object.keys(findNode(polluted, 'b-head01').node.settings), ['text', 'level', 'subtitle']);
  const settings = updatePageSettings(page, registry, { title: 'New', width: 'wide', course: 'csa', junk: 1 });
  assert.deepEqual([settings.page.title, settings.page.width, settings.page.course, settings.page.junk], ['New', 'wide', 'csa', undefined]);
  assert.equal(updatePageSettings(page, registry, { title: 'Sample' }), page);
  assert.equal(updatePageSettings(page, registry, null), page);
  assert.equal(settings.sections, page.sections, 'sections are shared');
});

test('countLive counts hidden live blocks; stripHidden drops hidden nodes from a copy', needsRuby, () => {
  const registry = loadRegistry();
  let page = sample(registry);
  page = addBlock(page, registry, { type: 'chat', sectionId: 's-aaaaaa', newId: 'b-chat01' });
  page = addBlock(page, registry, { type: 'api_data', sectionId: 's-bbbbbb', cellIndex: 1, newId: 'b-apid01' });
  page = deepFreeze(setHidden(setHidden(page, 'b-chat01', true), 's-bbbbbb', false));
  assert.equal(countLive(page, registry), 2);
  const stripped = stripHidden(setHidden(page, 's-bbbbbb', true));
  assert.equal(shape(stripped), 's-aaaaaa[b-aaaaaa,b-bbbbbb]');
  assert.equal(countLive(stripped, registry), 0);
  assert.equal(countLive({ sections: [{ cells: [{ blocks: [null, { type: 'chat' }] }] }] }, registry), 1);
  assert.deepEqual(stripHidden({ sections: [{ hidden: false, cells: ['x', { blocks: [{ hidden: true }, 7] }] }, null] }).sections, [{ hidden: false, cells: [{ blocks: [] }, { blocks: [] }] }]);
});

test('findNode reports where a node is and tolerates broken pages', needsRuby, () => {
  const page = sample(loadRegistry());
  const found = findNode(page, 'b-dddddd');
  assert.deepEqual({ ...found, node: found.node.id, section: found.section.id }, { kind: 'block', node: 'b-dddddd', section: 's-bbbbbb', sectionIndex: 1, cellIndex: 1, index: 0 });
  assert.deepEqual(findNode(page, 's-bbbbbb').index, 1);
  for (const id of [null, '', 42, 'b-zzzzzz']) assert.equal(findNode(page, id), null);
  assert.equal(findNode({ sections: [null, { cells: 'x' }, { id: 's-aaaaaa' }] }, 's-aaaaaa').sectionIndex, 2);
  assert.equal(findNode(null, 's-aaaaaa'), null);
});

test('outlineOf gives tree rows with labels, previews, hidden flags and issue counts', needsRuby, () => {
  const registry = loadRegistry();
  let page = sample(registry);
  page = addBlock(page, registry, { type: 'hero', sectionId: 's-aaaaaa', index: 0, newId: 'b-hero01', settings: { badge: 'Badge', title: '  Flood\n Watch  ' } }); // the line break is an issue
  page = addBlock(page, registry, { type: 'text', sectionId: 's-bbbbbb', cellIndex: 0, newId: 'b-text01', settings: { body: '<p>Hello &amp; <b>welcome</b></p>' } });
  page = addBlock(page, registry, { type: 'stats', sectionId: 's-bbbbbb', cellIndex: 1, newId: 'b-stat01', settings: { items: [{ value: '12', label: 'Tests' }] } });
  page = addBlock(page, registry, { type: 'chat', sectionId: 's-bbbbbb', cellIndex: 1, newId: 'b-chat01', settings: { group: { id: 3, name: 'Beasts' } } });
  page = addBlock(page, registry, { type: 'video', sectionId: 's-aaaaaa', newId: 'b-vide01', settings: { title: 'x'.repeat(80) } });
  page = setHidden(setHidden(page, 's-bbbbbb', true), 'b-vide01', true);
  const rows = outlineOf(page, registry);
  const brief = rows.map((r) => [r.kind, r.depth, r.label, r.preview, r.position, r.setSize, r.issues, r.childIssues, r.hidden, r.hiddenByParent].join(' / '));
  const long = `${'x'.repeat(47)}${String.fromCharCode(0x2026)}`;
  assert.deepEqual(brief, [
    'section / 0 / One column /  / 1 / 2 / 0 / 2 / false / false',
    'block / 1 / Page header / Flood Watch / 1 / 4 / 1 / 0 / false / false',
    'block / 1 / Divider /  / 2 / 4 / 0 / 0 / false / false',
    'block / 1 / Divider /  / 3 / 4 / 0 / 0 / false / false',
    `block / 1 / Video / ${long} / 4 / 4 / 1 / 0 / true / false`,
    'section / 0 / Columns / Two equal columns / 2 / 2 / 0 / 0 / true / false',
    'cell / 1 / Columns 1 /  / 1 / 2 / 0 / 0 / false / true',
    'block / 2 / Divider /  / 1 / 2 / 0 / 0 / false / true',
    'block / 2 / Text / Hello & welcome / 2 / 2 / 0 / 0 / false / true',
    'cell / 1 / Columns 2 /  / 2 / 2 / 0 / 0 / false / true',
    'block / 2 / Divider /  / 1 / 4 / 0 / 0 / false / true',
    'block / 2 / Divider /  / 2 / 4 / 0 / 0 / false / true',
    'block / 2 / Numbers / Tests / 3 / 4 / 0 / 0 / false / true',
    'block / 2 / Group chat / Beasts / 4 / 4 / 0 / 0 / false / true',
  ]);
  assert.deepEqual(rows.map((r) => r.key).filter((key) => key.includes(':')), ['s-bbbbbb:cell-0', 's-bbbbbb:cell-1']);
  assert.deepEqual(rows.find((r) => r.id === 'b-chat01'), { ...rows.find((r) => r.id === 'b-chat01'), sectionId: 's-bbbbbb', cellIndex: 1, index: 3, type: 'chat' });
  const given = outlineOf(page, registry, { issues: [{ nodeId: 'b-chat01' }, { nodeId: 'b-chat01' }, { nodeId: null }] });
  assert.deepEqual([given.find((r) => r.id === 'b-chat01').issues, given.find((r) => r.key === 's-bbbbbb:cell-1').childIssues, given[5].childIssues], [2, 2, 2]);
  const named = outlineOf(page, { ...registry, text: { ...registry.text, editor: { outline_column: 'Column {n}' } } });
  assert.equal(named.find((r) => r.kind === 'cell').label, 'Column 1');
  assert.deepEqual(outlineOf({ sections: [null, { id: 's-x', type: 'grid', cells: [{ blocks: [{ id: 'b-x', type: 'marquee' }, 7] }] }] }, registry).map((r) => r.label), ['grid', 'marquee']);
});

test('importPageJSON refuses non-pages and normalizes and validates the rest', needsRuby, () => {
  const registry = loadRegistry();
  const keyOf = (result) => [result.page, result.errors.map((e) => e.key)];
  assert.deepEqual(keyOf(importPageJSON(42, registry, { ids: counterIds() })), [null, ['bad_json']]);
  assert.deepEqual(keyOf(importPageJSON('{nope', registry, { ids: counterIds() })), [null, ['bad_json']]);
  assert.deepEqual(keyOf(importPageJSON(`${'['.repeat(200000)}${']'.repeat(200000)}`, registry, { ids: counterIds() })).length, 2);
  assert.deepEqual(keyOf(importPageJSON(' '.repeat(registry.limits.import_max_chars + 1), registry, { ids: counterIds() })), [null, ['import_too_big']]);
  for (const text of ['[]', '"page"', '{"schemaVersion":1,"kind":"ocs-ui-page","page":{}}', '{"schemaVersion":2,"kind":"ocs-ui-page","page":{},"sections":[]}', '{"schemaVersion":1,"kind":"x","page":{},"sections":[]}', '{"schemaVersion":1,"kind":"ocs-ui-page","page":[],"sections":[]}']) {
    assert.deepEqual(keyOf(importPageJSON(text, registry, { ids: counterIds() })), [null, ['bad_page']], text);
  }
  assert.equal(importPageJSON('x', registry, { ids: counterIds() }).errors[0].message, textOf(registry, 'errors.bad_json'));
  const text = readFileSync(ALL_BLOCKS, 'utf8');
  const result = importPageJSON(`${String.fromCharCode(0xfeff)}${text}`, registry, { ids: counterIds(), pageOrigin: 'https://pages.opencodingsociety.com' });
  assert.deepEqual(result, { page: JSON.parse(text), errors: [] });
  const odd = JSON.stringify({ schemaVersion: 1, kind: 'ocs-ui-page', page: { title: '' }, sections: [{ type: 'stack', cells: [{ blocks: [{ type: 'marquee' }, { type: 'marquee' }, { id: 'nope', type: 'text', settings: { body: '<script>x</script>' } }] }] }, { type: 'grid' }] });
  const imported = importPageJSON(odd, registry, { ids: counterIds() });
  assert.equal(shape(imported.page), 's-000001[b-000002]');
  assert.deepEqual(imported.errors.map((e) => `${e.nodeId}.${e.field}:${e.key}`), ['null.type:unknown_type', 'null.type:unknown_type', 'null.title:required', 'b-000002.body:bad_body']);
  assert.equal(imported.errors[0].message, textOf(registry, 'errors.unknown_type', { type: 'marquee' }));
  assert.throws(() => importPageJSON('{}', registry, {}), /pass ids\(kind\)/);
});
