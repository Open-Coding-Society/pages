import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiBlocksOf, apiItemsView, canvasAllowed, contextKey, listIn, nodeHashes, readNonce } from '../js/canvas.js';
import { toHTML } from '../js/vnode.js';
import { createPage, updateSettings, moveNode } from '../js/page-model.js';
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

test('listIn follows the mapped list, else finds the list itself', () => {
  const reply = { data: { items: [{ a: 1 }, { a: 2 }] }, meta: { tags: ['x'] } };
  assert.equal(listIn(reply, 'data.items').length, 2);
  assert.equal(listIn(reply, '').length, 2, 'an empty path on an object reply falls back to the best list');
  assert.equal(listIn([1, 2, 3], '').length, 3);
  assert.deepEqual(listIn({ a: 1 }, ''), []);
  assert.deepEqual(listIn(reply, 'data.items[0]'), [{ a: 1 }, { a: 2 }], 'a path to a non-list falls back too');
});

test('API items draw as cards, a list, a table or numbers, as text only', () => {
  const items = [{ title: '<b>Joke</b>', text: 'Why?', image: 'https://img.example/a.png', link: 'https://example.com/j/1', value: '3', label: 'votes' }];
  const cards = toHTML(apiItemsView(items, 'cards', {}), { strict: true });
  assert.match(cards, /^<div class="ocs__grid ocs__grid--card"><div class="ocs__grid-cell"><img class="ocs__image-frame" src="https:\/\/img.example\/a.png" alt="" loading="lazy" referrerpolicy="no-referrer">/);
  assert.match(cards, /<h3>&lt;b&gt;Joke&lt;\/b&gt;<\/h3>/, 'API text is never markup');
  assert.match(cards, /target="_blank" rel="noopener noreferrer nofollow"/);
  assert.match(toHTML(apiItemsView(items, 'list', {}), { strict: true }), /^<ul class="ocs__entity-list"><li><strong>/);
  assert.match(toHTML(apiItemsView(items, 'stats', {}), { strict: true }), /<strong class="ocs__stat-value">3<\/strong><span class="ocs__stat-label">votes<\/span>/);
  const table = toHTML(apiItemsView(items, 'table', { source: { title_path: 'joke', value_path: 'haha' } }), { strict: true });
  assert.match(table, /<th scope="col">joke<\/th><th scope="col">haha<\/th>/);
  assert.match(table, /<td>&lt;b&gt;Joke&lt;\/b&gt;<\/td><td>3<\/td>/);
  const ocs = toHTML(apiItemsView([{ image: 'https://team.opencodingsociety.com/x.png' }], 'cards', { cookieDomain: 'opencodingsociety.com' }), { strict: true });
  assert.match(ocs, /crossorigin="anonymous"/, 'images on cookie hosts load without cookies');
  const unsafe = toHTML(apiItemsView([{ title: 'x', image: 'javascript:alert(1)', link: 'javascript:alert(1)' }], 'cards', {}), { strict: true });
  assert.equal(unsafe, '<div class="ocs__grid ocs__grid--card"><div class="ocs__grid-cell"><h3>x</h3></div></div>', 'unsafe links and images are dropped');
});
