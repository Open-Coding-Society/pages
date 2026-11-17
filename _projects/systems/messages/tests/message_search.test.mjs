// The search box in a direct message's header, with a stub API: when it shows, what it
// asks Spring, what it lists for the answer, and that an answer to an older query never
// replaces a newer one.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { initMessageSearch } = await import('../js/message-search.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace' };
const hit = (id, extra = {}) => ({
  id, conversationId: 5, senderUid: 'grace', senderName: 'Grace Hopper',
  sentAt: '2026-10-20T10:00:00Z', excerpt: 'the Sprint review is on Friday', ...extra,
});

function makeSearch({ searchDms }) {
  const make = tag => document.createElement(tag);
  const elements = {
    form: make('form'), input: make('input'), panel: make('div'), status: make('p'), results: make('div'),
  };
  elements.input.disabled = true;
  elements.form.hidden = true;
  elements.panel.hidden = true;
  const asked = [];
  const picked = [];
  const search = initMessageSearch({
    elements,
    me,
    api: { searchDms: (query, conversationId) => { asked.push({ query, conversationId }); return searchDms(query); } },
    onPick: found => picked.push(found),
    debounceMs: 0,
  });
  const type = value => {
    elements.input.value = value;
    elements.input.dispatchEvent(fakeEvent('input'));
  };
  return { elements, asked, picked, type, search };
}

const names = elements => elements.results.children.map(row => row.querySelector('.ocs__nav-card-title').textContent);

test('the box shows only while a direct message is open, and is enabled once set up', () => {
  const { elements, search } = makeSearch({ searchDms: async () => [] });
  assert.equal(elements.input.disabled, false);
  assert.equal(elements.form.hidden, true);

  search.setConversation(5, 'Grace Hopper');
  assert.equal(elements.form.hidden, false);
  assert.equal(elements.input.getAttribute('aria-label'), 'Search messages with Grace Hopper');

  search.setConversation(null, ''); // a group, or nothing
  assert.equal(elements.form.hidden, true);
});

test('a query asks Spring for the open chat and lists who wrote each match', async () => {
  const { elements, asked, type, search } = makeSearch({
    searchDms: async () => [hit(9), hit(8, { senderUid: 'ada', senderName: 'Ada Lovelace' })],
  });
  search.setConversation(5, 'Grace Hopper');
  type('  sprint ');
  assert.equal(elements.panel.hidden, false);
  assert.equal(elements.status.textContent, 'Searching…');
  await settle();
  await settle();

  assert.deepEqual(asked, [{ query: 'sprint', conversationId: 5 }]);
  assert.equal(elements.status.textContent, '2 messages');
  assert.deepEqual(names(elements), ['Grace Hopper', 'You']);
  const row = elements.results.children[0];
  assert.equal(row.querySelector('.dm__hit-text').textContent, 'the Sprint review is on Friday');
  assert.equal(row.querySelector('mark').textContent, 'Sprint');
});

test('a query that is too short asks for more and does not ask Spring', async () => {
  const { elements, asked, type, search } = makeSearch({ searchDms: async () => [hit(9)] });
  search.setConversation(5, 'Grace Hopper');
  type('s');
  await settle();

  assert.deepEqual(asked, []);
  assert.equal(elements.status.textContent, 'Type at least 2 characters.');
  assert.equal(elements.results.children.length, 0);
});

test('clearing the box, or pressing Escape, closes the panel', async () => {
  const { elements, type, search } = makeSearch({ searchDms: async () => [hit(9)] });
  search.setConversation(5, 'Grace Hopper');
  type('sprint');
  await settle();
  await settle();
  type('');
  assert.equal(elements.panel.hidden, true);
  assert.equal(elements.results.children.length, 0);

  type('sprint');
  await settle();
  await settle();
  elements.input.dispatchEvent(fakeEvent('keydown', { key: 'Escape' }));
  assert.equal(elements.input.value, '');
  assert.equal(elements.panel.hidden, true);
});

test('no matches, a full page of matches and a failure each say so', async t => {
  t.mock.method(console, 'warn', () => {});
  const none = makeSearch({ searchDms: async () => [] });
  none.search.setConversation(5, 'Grace Hopper');
  none.type('zebra');
  await settle();
  await settle();
  assert.equal(none.elements.status.textContent, 'No messages in this chat match “zebra”.');

  const full = makeSearch({ searchDms: async () => Array.from({ length: 50 }, (_, index) => hit(index + 1)) });
  full.search.setConversation(5, 'Grace Hopper');
  full.type('sprint');
  await settle();
  await settle();
  assert.equal(full.elements.status.textContent, 'Showing the 50 newest matches.');
  assert.equal(full.elements.results.children.length, 50);

  const broken = makeSearch({ searchDms: async () => { throw new Error('offline'); } });
  broken.search.setConversation(5, 'Grace Hopper');
  broken.type('sprint');
  await settle();
  await settle();
  assert.equal(broken.elements.status.textContent, 'Search is not working right now. Try again.');
  assert.equal(broken.elements.results.children.length, 0);
});

test('an answer to an older query never replaces a newer one', async () => {
  const waiting = [];
  const { elements, type, search } = makeSearch({
    searchDms: query => new Promise(resolve => { waiting.push({ query, resolve }); }),
  });
  search.setConversation(5, 'Grace Hopper');
  elements.form.dispatchEvent(fakeEvent('submit')); // nothing typed: nothing asked
  type('sprint');
  await settle();
  type('retro');
  await settle();
  assert.deepEqual(waiting.map(call => call.query), ['sprint', 'retro']);

  waiting[1].resolve([hit(2, { excerpt: 'retro notes' })]);
  await settle();
  waiting[0].resolve([hit(1), hit(3)]);
  await settle();

  assert.equal(elements.results.children.length, 1);
  assert.equal(elements.results.children[0].querySelector('.dm__hit-text').textContent, 'retro notes');
});

test('opening another chat starts with an empty box, and an answer still loading is dropped', async () => {
  const waiting = [];
  const { elements, type, search } = makeSearch({
    searchDms: query => new Promise(resolve => { waiting.push({ query, resolve }); }),
  });
  search.setConversation(5, 'Grace Hopper');
  type('sprint');
  await settle();

  search.setConversation(6, 'Alan Turing');
  assert.equal(elements.input.value, '');
  assert.equal(elements.panel.hidden, true);
  waiting[0].resolve([hit(1)]);
  await settle();
  assert.equal(elements.results.children.length, 0);

  search.setConversation(6, 'Alan Turing'); // the same chat again changes nothing
  type('retro');
  search.setConversation(6, 'Alan Turing');
  assert.equal(elements.input.value, 'retro');
});

test('Enter searches without waiting, and picking a match hands it to the page and closes the panel', async () => {
  const { elements, asked, picked, search } = makeSearch({ searchDms: async () => [hit(9)] });
  search.setConversation(5, 'Grace Hopper');
  elements.input.value = 'sprint';
  const submit = fakeEvent('submit');
  elements.form.dispatchEvent(submit);
  assert.equal(submit.defaultPrevented, true);
  await settle();
  await settle();
  assert.deepEqual(asked.map(call => call.query), ['sprint']);

  elements.results.children[0].dispatchEvent(fakeEvent('click', { button: 0 }));
  assert.deepEqual(picked.map(found => found.id), [9]);
  assert.equal(elements.panel.hidden, true);
});
