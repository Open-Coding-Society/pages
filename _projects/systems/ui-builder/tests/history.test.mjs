import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHistory } from '../js/history.js';

// Pages are any objects to the history; {v} keeps the tests short.
const page = (v) => ({ v });
function clock(start = 1000) {
  let time = start;
  return { now: () => time, advance: (ms) => { time += ms; } };
}
const value = (history) => history.present.page.v;

test('push records steps that undo and redo walk through, with their selection', () => {
  const history = createHistory(page(0), { selectedId: 'b-000001' });
  assert.deepEqual(history.present, { page: { v: 0 }, selectedId: 'b-000001' });
  assert.equal(history.canUndo(), false);
  assert.equal(history.undo(), null);
  assert.equal(history.push(page(1), { selectedId: 'b-000002' }), true);
  history.push(page(2));
  assert.deepEqual(history.undo(), { page: { v: 1 }, selectedId: 'b-000002' });
  assert.deepEqual(history.undo(), { page: { v: 0 }, selectedId: 'b-000001' });
  assert.equal(history.undo(), null);
  assert.equal(history.canRedo(), true);
  assert.deepEqual(history.redo(), { page: { v: 1 }, selectedId: 'b-000002' });
  assert.deepEqual(history.redo(), { page: { v: 2 }, selectedId: null });
  assert.equal(history.redo(), null);
  assert.equal(history.canRedo(), false);
});

test('a push equal to the present is ignored, even as a new object', () => {
  const history = createHistory(page(0));
  assert.equal(history.push({ v: 0 }, { selectedId: 'b-000001' }), false);
  assert.equal(history.canUndo(), false);
  assert.equal(history.present.selectedId, null, 'an ignored push changes nothing');
});

test('typing in one field merges while pushes keep coming within 800 ms (sliding)', () => {
  const time = clock();
  const history = createHistory(page(''), { now: time.now });
  const key = 'b-000001:title';
  for (const [text, gap] of [['F', 0], ['Fl', 700], ['Flo', 800], ['Floo', 650], ['Flood', 790]]) {
    time.advance(gap);
    history.push(page(text), { coalesceKey: key, selectedId: 'b-000001' });
  }
  assert.equal(value(history), 'Flood');
  time.advance(801);
  history.push(page('Flood W'), { coalesceKey: key });
  assert.equal(history.undo().page.v, 'Flood', 'a pause over 800 ms starts a new step');
  assert.equal(history.undo().page.v, '', 'the merged step keeps its original before');
  assert.equal(history.canUndo(), false);
});

test('merging needs the same non-empty key and no undo or redo in between', () => {
  const time = clock();
  const history = createHistory(page(0), { now: time.now });
  history.push(page(1), { coalesceKey: 'a' });
  history.push(page(2), { coalesceKey: 'b' });
  history.push(page(3), { coalesceKey: null });
  history.push(page(4), { coalesceKey: null });
  history.push(page(5), { coalesceKey: '' });
  history.push(page(6), { coalesceKey: '' });
  const steps = [];
  while (history.canUndo()) steps.push(history.undo().page.v);
  assert.deepEqual(steps, [5, 4, 3, 2, 1, 0]);
  const again = createHistory(page(0), { now: time.now });
  again.push(page(1), { coalesceKey: 'a' });
  again.undo();
  again.redo();
  again.push(page(2), { coalesceKey: 'a' });
  assert.equal(again.undo().page.v, 1, 'after undo/redo a push starts a new step');
  const first = createHistory(page(0), { now: time.now });
  first.push(page(1), { coalesceKey: 'a' });
  first.push(page(2), { coalesceKey: 'a' });
  assert.equal(first.undo().page.v, 0, 'the first push never merges into the starting page');
});

test('typing and then deleting back to the start leaves no empty step', () => {
  const time = clock();
  const history = createHistory(page('Hi'), { now: time.now });
  history.push(page('Hi!'), { coalesceKey: 'k' });
  time.advance(100);
  history.push(page('Hi'), { coalesceKey: 'k' });
  assert.equal(history.canUndo(), false);
  assert.equal(value(history), 'Hi');
  time.advance(100);
  history.push(page('Hi?'), { coalesceKey: 'k' });
  assert.equal(history.undo().page.v, 'Hi');
});

test('any push clears redo, and the oldest steps fall off past the limit', () => {
  const history = createHistory(page(0), { limit: 3 });
  for (const v of [1, 2, 3, 4, 5]) history.push(page(v));
  const steps = [];
  while (history.canUndo()) steps.push(history.undo().page.v);
  assert.deepEqual(steps, [4, 3, 2]);
  history.push(page(9));
  assert.equal(history.canRedo(), false);
  assert.equal(history.redo(), null);
});

test('reset starts over from a page that came from elsewhere', () => {
  const time = clock();
  const history = createHistory(page(0), { now: time.now });
  history.push(page(1), { coalesceKey: 'k' });
  history.push(page(2));
  history.undo();
  assert.deepEqual(history.reset(page('theirs'), { selectedId: 'b-000009' }), { page: { v: 'theirs' }, selectedId: 'b-000009' });
  assert.deepEqual([history.canUndo(), history.canRedo()], [false, false]);
  history.push(page('next'), { coalesceKey: 'k' });
  history.push(page('next!'), { coalesceKey: 'k' });
  assert.equal(history.undo().page.v, 'theirs', 'no merging across a reset, and no undo past it');
});

test('present is a copy, and bad arguments fail fast', () => {
  const history = createHistory(page(0));
  history.present.page = page(99);
  history.present.selectedId = 'b-zzzzzz';
  assert.deepEqual(history.present, { page: { v: 0 }, selectedId: null });
  assert.equal(createHistory(page(0), { selectedId: 42 }).present.selectedId, null);
  assert.throws(() => history.push(null), /a page must be an object/);
  assert.throws(() => history.push('page'), /a page must be an object/);
  assert.throws(() => history.reset(undefined), /a page must be an object/);
  assert.throws(() => createHistory(null), /a page must be an object/);
  for (const limit of [0, -1, 1.5, '100', Infinity]) assert.throws(() => createHistory(page(0), { limit }), /limit/, String(limit));
  assert.throws(() => createHistory(page(0), { now: 5 }), /now must be a function/);
});
