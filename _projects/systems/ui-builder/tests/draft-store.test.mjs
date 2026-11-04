import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DraftStore } from '../js/draft-store.js';
import { createStorage } from './fixtures/live/dom.mjs';

const PREFIX = 'ocs:ui-builder:v1:draft:';
const page = (title = 'Flood Watch') => ({ schemaVersion: 1, kind: 'ocs-ui-page', page: { title }, sections: [] });
const clock = (start = 1000) => {
  let time = start;
  return { now: () => time, advance: (ms) => { time += ms; } };
};

test('keyFor names one draft per page and refuses refs the editor could never make', () => {
  const drafts = new DraftStore({ storage: createStorage() });
  assert.equal(drafts.keyFor(null), 'new');
  assert.equal(drafts.keyFor(undefined), 'new');
  assert.equal(drafts.keyFor({ kind: 'spring', id: 12 }), 'spring-12');
  assert.equal(drafts.keyFor({ kind: 'spring', id: '12' }), 'spring-12');
  assert.equal(drafts.keyFor({ kind: 'local', id: 'abc123def456' }), 'local-abc123def456');
  for (const ref of [{ kind: 'spring', id: 0 }, { kind: 'spring', id: -3 }, { kind: 'spring', id: 1.5 }, { kind: 'spring', id: 'x' },
    { kind: 'local', id: '../x' }, { kind: 'local', id: 'ABC' }, { kind: 'other', id: 1 }, 'spring-1', 7]) {
    assert.throws(() => drafts.keyFor(ref), TypeError, JSON.stringify(ref));
  }
});

test('the new-page draft is kept per signed-in person, and shared only when none is known', () => {
  const storage = createStorage();
  const drafts = new DraftStore({ storage, now: () => 1 });
  assert.equal(drafts.keyFor(null), 'new', 'signed out or Flask-only: the shared slot');
  drafts.setPerson(42);
  assert.equal(drafts.keyFor(null), 'new:42');
  assert.equal(drafts.write(drafts.keyFor(null), { page: page() }), true);
  assert.ok(drafts.read('new:42'), 'stored under the person-scoped key');
  // The next student on a shared computer is offered their own slot, never the first student's.
  drafts.setPerson(43);
  assert.equal(drafts.keyFor(null), 'new:43');
  assert.equal(drafts.read(drafts.keyFor(null)), null);
  // A ref still names its own key, and a bad or missing person id falls back to the shared slot.
  assert.equal(drafts.keyFor({ kind: 'spring', id: 7 }), 'spring-7');
  for (const bad of [0, -1, 1.5, '42', null]) {
    drafts.setPerson(bad);
    assert.equal(drafts.keyFor(null), 'new', String(bad));
  }
});

test('a draft round-trips with the time it was written', () => {
  const storage = createStorage();
  const time = clock(5000);
  const drafts = new DraftStore({ storage, now: time.now });
  assert.equal(drafts.write('spring-12', { baseVersion: 3, dirty: true, page: page() }), true);
  assert.deepEqual(drafts.read('spring-12'), { baseVersion: 3, dirty: true, savedAt: 5000, page: page() });
  assert.ok(storage.items.has(`${PREFIX}spring-12`));
  time.advance(10);
  assert.equal(drafts.write('new', { page: page('New') }), true);
  assert.deepEqual(drafts.read('new'), { baseVersion: null, dirty: true, savedAt: 5010, page: page('New') });
  assert.equal(drafts.clear('spring-12'), true);
  assert.equal(drafts.read('spring-12'), null);
});

test('read returns null for anything that is not a usable draft', () => {
  const storage = createStorage();
  const drafts = new DraftStore({ storage });
  storage.setItem(`${PREFIX}local-abcdef`, '{not json');
  storage.setItem(`${PREFIX}spring-1`, JSON.stringify({ baseVersion: 'x', dirty: true, savedAt: 1, page: page() }));
  storage.setItem(`${PREFIX}spring-2`, JSON.stringify({ baseVersion: 1, dirty: 'yes', savedAt: 1, page: page() }));
  storage.setItem(`${PREFIX}spring-3`, JSON.stringify({ baseVersion: 1, dirty: true, savedAt: 1, page: { kind: 'nope' } }));
  for (const key of ['local-abcdef', 'spring-1', 'spring-2', 'spring-3', 'spring-4', '../x', '', 7, null]) {
    assert.equal(drafts.read(key), null, String(key));
  }
  assert.equal(drafts.write('bad key', { page: page() }), false);
  assert.equal(drafts.write('new', { page: { title: 'not a page' } }), false);
  assert.equal(drafts.clear('../../x'), false);
});

test('blocked or broken storage never throws: writes say false, reads say null', () => {
  for (const storage of [null, createStorage({ broken: true })]) {
    const drafts = new DraftStore({ storage });
    assert.equal(drafts.write('new', { page: page() }), false);
    assert.equal(drafts.read('new'), null);
    assert.equal(drafts.clear('new'), false);
  }
  const cyclic = page();
  cyclic.self = cyclic;
  assert.equal(new DraftStore({ storage: createStorage() }).write('new', { page: cyclic }), false);
});

test('a full quota drops saved drafts oldest first, never unsaved ones', () => {
  const storage = createStorage({ cap: 900 });
  const time = clock();
  const drafts = new DraftStore({ storage, now: time.now });
  assert.equal(drafts.write('spring-1', { baseVersion: 1, dirty: false, page: page('one') }), true);
  time.advance(1);
  assert.equal(drafts.write('spring-2', { baseVersion: 1, dirty: true, page: page('two') }), true);
  time.advance(1);
  assert.equal(drafts.write('spring-3', { baseVersion: 1, dirty: false, page: page('three') }), true);
  const big = page('x'.repeat(250));
  assert.equal(drafts.write('spring-4', { baseVersion: 1, dirty: true, page: big }), true);
  assert.equal(drafts.read('spring-1'), null, 'the oldest saved draft made room');
  assert.equal(drafts.read('spring-3'), null);
  assert.equal(drafts.read('spring-2').page.page.title, 'two', 'unsaved work stays');
  assert.equal(drafts.read('spring-4').page.page.title, big.page.title);
  // Nothing saved is left to drop: the write fails and the unsaved draft is untouched.
  assert.equal(drafts.write('spring-5', { dirty: true, page: page('y'.repeat(700)) }), false);
  assert.equal(drafts.read('spring-2').dirty, true);
});
