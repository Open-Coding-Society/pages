import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiBlocksOf, canvasAllowed, contextKey, keyPartOf, nodeHashes, readNonce, realDataView } from '../js/canvas.js';
import { codeSnippet, listIn } from '../js/api-data.js';
import { contentRenderers } from '../js/blocks-content.js';
import { mountApiData } from '../js/blocks-project.js';
import { textOf } from '../js/registry.js';
import { toDOM } from '../js/vnode.js';
import { createPage, updateSettings, moveNode } from '../js/page-model.js';
import { createDocument, text } from './fixtures/live/dom.mjs';
import { ORIGIN, blocksOf, cardOf, drawPage, fetchRouter, json, mountOf, pageOf } from './fixtures/live/pages.mjs';
import { runSnippet } from './fixtures/snippet.mjs';
import { counterIds, loadRegistry, needsRuby } from './helpers.mjs';

test('the canvas reads only a well-formed nonce from its address', () => {
  assert.equal(readNonce('?nonce=0123456789abcdef0123456789abcdef'), '0123456789abcdef0123456789abcdef');
  assert.equal(readNonce('?nonce=short'), null);
  assert.equal(readNonce('?nonce=0123456789ABCDEF0123'), null, 'upper case is not what makeNonce writes');
  assert.equal(readNonce('?nonce=0123456789abcdef%3Cscript'), null);
  assert.equal(readNonce(''), null);
});

test('the canvas runs only under a parent window of its own origin', () => {
  const origin = 'https://pages.opencodingsociety.com';
  const top = { location: { origin } };
  top.parent = top;
  assert.equal(canvasAllowed(top), false, 'not framed at all');
  assert.equal(canvasAllowed({ parent: { location: { origin } }, location: { origin } }), true);
  assert.equal(canvasAllowed({ parent: { location: { origin: 'https://evil.example' } }, location: { origin } }), false);
  const crossOrigin = { get location() { throw new Error('SecurityError'); } };
  assert.equal(canvasAllowed({ parent: crossOrigin, location: { origin } }), false, 'a cross-origin parent throws, which means no');
  assert.equal(canvasAllowed(null), false);
});

test('editing a block changes only that block\'s hash; a move changes its sections\' hashes', needsRuby, () => {
  const registry = loadRegistry();
  const page = createPage(registry, { template: 'about_me', ids: counterIds() });
  const before = nodeHashes(page);
  const [, columns] = page.sections;
  const card = columns.cells[1].blocks[0];
  const edited = updateSettings(page, registry, card.id, { title: 'Find us' });
  const after = nodeHashes(edited);
  const changed = [...before.keys()].filter((id) => before.get(id) !== after.get(id));
  assert.deepEqual(changed, [card.id], 'neighbours and sections keep their DOM');
  const moved = moveNode(edited, card.id, -1);
  const afterMove = nodeHashes(moved);
  assert.notEqual(afterMove.get(columns.id), after.get(columns.id), 'the section that lost or gained a block redraws');
  assert.equal(afterMove.get(card.id), after.get(card.id), 'the moved block itself keeps its DOM');
  assert.equal(contextKey(page, false), contextKey(edited, false), 'block edits keep the page context');
  assert.notEqual(contextKey(page, false), contextKey(page, true), 'Real data while editing redraws everything');
});

test('hashes ignore repeated ids and hostile shapes instead of throwing', () => {
  const hostile = { sections: [{ id: 's-aaaaaa', cells: [{ blocks: [{ id: 'b-aaaaaa' }, { id: 'b-aaaaaa', x: 1 }] }] }, null, 'x', { id: 's-aaaaaa' }] };
  const hashes = nodeHashes(hostile);
  assert.deepEqual([...hashes.keys()], ['s-aaaaaa', 'b-aaaaaa']);
  assert.equal(hashes.get('b-aaaaaa'), JSON.stringify({ id: 'b-aaaaaa' }), 'the first use of an id wins');
  assert.deepEqual([...nodeHashes(null).keys()], []);
  assert.deepEqual(apiBlocksOf({ sections: [{ cells: [{ blocks: [{ id: 'b-1', type: 'api_data' }, { id: 7, type: 'api_data' }, { type: 'text', id: 'b-2' }] }] }] }).map((block) => block.id), ['b-1']);
});

test('a key from the canvas names the block or section that has the keyboard', () => {
  const doc = createDocument();
  const section = doc.createElement('section');
  section.setAttribute('data-ui-node', 's-aaaaaa');
  const block = doc.createElement('div');
  block.setAttribute('data-ui-node', 'b-bbbbbb');
  const link = doc.createElement('a');
  const add = doc.createElement('button');
  add.setAttribute('data-ui-add', '');
  block.appendChild(link);
  section.append(block, add);
  doc.body.appendChild(section);
  assert.equal(keyPartOf(link), 'b-bbbbbb', 'a link inside a block: that block');
  assert.equal(keyPartOf(block), 'b-bbbbbb');
  assert.equal(keyPartOf(add), '', 'an add button: no part to act on, not its section');
  assert.equal(keyPartOf(doc.body), null, 'nothing in the page has focus');
  assert.equal(keyPartOf(null), null);
});

// The review's case: the Flask API starter pointed at an API that answers an object holding a list,
// with list_path still "". The editor's preview, the inspector's field list and the published page
// must all show the same items.
test('Real data while editing shows what the published page shows, in every view', needsRuby, async () => {
  const registry = loadRegistry();
  const url = 'https://team.example/api/users';
  const reply = { users: [{ name: 'Ada', role: 'Lead' }, { name: 'Alan', role: '' }] };
  assert.deepEqual(listIn(reply, '').map((user) => user.name), ['Ada', 'Alan'], 'what the inspector lists fields from');
  const canvasCtx = { registry, mode: 'canvas', baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers };
  for (const view of ['cards', 'list', 'table', 'stats']) {
    const source = { url, list_path: '', title_path: 'name', text_path: 'role', image_path: '', link_path: '', value_path: '', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false } };
    const page = pageOf([[['api_data', { title: 'Users', view, limit: 12, source }]]]);
    const [block] = blocksOf(page);
    const doc = createDocument();
    const root = drawPage(doc, page, registry);
    const router = fetchRouter({ [url]: json(reply) });
    await mountApiData(cardOf(root, block.id), block, { registry, baseurl: '', pageOrigin: ORIGIN, pageProtocol: 'https:', fetchImpl: router.fetchImpl, storage: null });
    const published = mountOf(root, block.id);
    assert.ok(text(published).includes('Alan'), view);

    const preview = realDataView({ ok: true, json: reply, url }, block, canvasCtx);
    assert.equal(preview.status, '', view);
    assert.equal(toDOM(preview.view, { doc }).outerHTML, published.innerHTML, `${view}: the preview is the published markup`);
  }
});

// "The whole reply" (list_path ".") on a reply that also holds a list: the published page, the
// preview and Show code's code show the reply as one item, where "" (not picked yet) shows the
// list inside it. The code is made from the block alone, as before any Test in the editor.
test('the whole reply shows as one item on the published page, in the preview and in Show code', needsRuby, async () => {
  const registry = loadRegistry();
  const url = 'https://team.example/api/team';
  const reply = { team: 'Flood Watch', users: [{ team: 'Ada' }, { team: 'Alan' }] };
  const canvasCtx = { registry, mode: 'canvas', baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers };
  for (const [listPath, shown] of [['.', ['Flood Watch']], ['', ['Ada', 'Alan']]]) {
    const source = { url, list_path: listPath, title_path: 'team', text_path: '', image_path: '', link_path: '', value_path: '', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false } };
    const page = pageOf([[['api_data', { title: 'Team', view: 'list', limit: 12, source }]]]);
    const [block] = blocksOf(page);
    const doc = createDocument();
    const root = drawPage(doc, page, registry);
    await mountApiData(cardOf(root, block.id), block, { registry, baseurl: '', pageOrigin: ORIGIN, pageProtocol: 'https:', fetchImpl: fetchRouter({ [url]: json(reply) }).fetchImpl, storage: null });
    const published = mountOf(root, block.id);
    assert.deepEqual(published.querySelectorAll('li').map(text), shown, `list_path "${listPath}"`);
    const preview = realDataView({ ok: true, json: reply, url }, block, canvasCtx);
    assert.equal(toDOM(preview.view, { doc }).outerHTML, published.innerHTML, `list_path "${listPath}": the preview is the published markup`);
    assert.deepEqual(await runSnippet(codeSnippet(source), reply), shown, `list_path "${listPath}": Show code draws the same items`);
  }
});

// The Flask starter (joke and haha, no list picked) on a reply whose only list is empty or holds
// plain values: one joke, as published pages showed it before lists were guessed, and the preview
// agrees. A list of objects is guessed by both.
test('a reply without a list of objects stays one item on the published page and in the preview', needsRuby, async () => {
  const registry = loadRegistry();
  const url = 'https://flask.example/api/joke';
  const canvasCtx = { registry, mode: 'canvas', baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers };
  const cases = [
    [{ joke: 'Why?', haha: 3, comments: [] }, ['Why?|3']],
    [{ joke: 'Why?', haha: 3, tags: ['pun'] }, ['Why?|3']],
    [{ count: 2, results: [{ joke: 'A', haha: 1 }, { joke: 'B', haha: 2 }] }, ['A|1', 'B|2']],
  ];
  // A stat's label (the title when no label is mapped) and its number.
  const statOf = (stat) => `${text(stat.querySelector('.ocs__stat-label'))}|${text(stat.querySelector('.ocs__stat-value'))}`;
  for (const [reply, shown] of cases) {
    const source = { url, list_path: '', title_path: 'joke', text_path: '', image_path: '', link_path: '', value_path: 'haha', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false } };
    const page = pageOf([[['api_data', { title: 'Jokes', view: 'stats', limit: 12, source }]]]);
    const [block] = blocksOf(page);
    const doc = createDocument();
    const root = drawPage(doc, page, registry);
    await mountApiData(cardOf(root, block.id), block, { registry, baseurl: '', pageOrigin: ORIGIN, pageProtocol: 'https:', fetchImpl: fetchRouter({ [url]: json(reply) }).fetchImpl, storage: null });
    const published = mountOf(root, block.id);
    assert.deepEqual(published.querySelectorAll('.ocs__stat').map(statOf), shown, JSON.stringify(reply));
    const preview = realDataView({ ok: true, json: reply, url }, block, canvasCtx);
    assert.equal(toDOM(preview.view, { doc }).outerHTML, published.innerHTML, `${JSON.stringify(reply)}: the preview is the published markup`);
  }
});

test('a failed read in the preview shows the saved copy and the doctor\'s advice', needsRuby, () => {
  const registry = loadRegistry();
  const canvasCtx = { registry, mode: 'canvas', baseurl: '', pageOrigin: ORIGIN, renderers: contentRenderers };
  const snapshot = { items: [{ title: 'Saved joke', text: '', image: '', link: '', value: '', label: '' }], fetched_at: 1, from_loopback: false };
  const block = { id: 'b-000002', type: 'api_data', settings: { view: 'list', limit: 5, source: { url: 'https://x.example/api', title_path: 'joke', snapshot } } };
  const failed = realDataView({ ok: false, error: 'not_found', host: 'x.example', url: 'https://x.example/api' }, block, canvasCtx);
  assert.equal(text(toDOM(failed.view, { doc: createDocument() })), 'Saved joke');
  assert.equal(failed.status, textOf(registry, 'doctor.not_found', { host: 'x.example' }));
  const empty = realDataView({ ok: true, json: { jokes: [] }, url: 'https://x.example/api' }, block, canvasCtx);
  assert.deepEqual(empty, { view: null, status: textOf(registry, 'blocks.api_empty') });
});
