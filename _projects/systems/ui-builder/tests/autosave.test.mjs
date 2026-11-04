import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AUTOSAVE_STATES, createAutosave } from '../js/autosave.js';

const settle = () => new Promise((resolve) => setImmediate(resolve));

// A fake clock and timers, and saves the test answers by hand: h.calls[i].resolve({base}).
function harness(options = {}) {
  let time = 0;
  let seq = 0;
  const timers = new Map();
  const h = { calls: [], states: [], saved: [], conflicts: [], errors: [], inFlight: 0, maxInFlight: 0 };
  h.autosave = createAutosave({
    save: ({ base }) => new Promise((resolve, reject) => {
      h.inFlight += 1;
      h.maxInFlight = Math.max(h.maxInFlight, h.inFlight);
      const done = (fn) => (value) => { h.inFlight -= 1; fn(value); };
      h.calls.push({ base, resolve: done(resolve), reject: done(reject) });
    }),
    now: () => time,
    setTimer: (fn, ms) => {
      seq += 1;
      timers.set(seq, { fn, at: time + ms });
      return seq;
    },
    clearTimer: (id) => timers.delete(id),
    delayMs: 2000,
    base: 1,
    onState: (status) => h.states.push(status.state),
    onSaved: ({ base }) => h.saved.push(base),
    onConflict: (error) => h.conflicts.push(error),
    onError: (error) => h.errors.push(error),
    ...options,
  });
  h.timers = timers;
  h.now = () => time;
  h.advance = async (ms) => {
    time += ms;
    for (;;) {
      const due = [...timers].filter(([, timer]) => timer.at <= time).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]);
      due[1].fn();
      await settle();
    }
    await settle();
  };
  h.answer = async (index, base) => {
    h.calls[index].resolve({ base });
    await settle();
  };
  return h;
}

const conflictError = () => Object.assign(new Error('version_conflict'), { name: 'ConflictError', current: { base: 7 } });

test('saves delayMs after the last change, with the base the store gave last', async () => {
  const h = harness();
  assert.equal(h.autosave.state, 'idle');
  h.autosave.change();
  await h.advance(1999);
  h.autosave.change();
  await h.advance(1999);
  assert.equal(h.calls.length, 0, 'each change restarts the wait');
  await h.advance(1);
  assert.deepEqual(h.calls.map((c) => c.base), [1]);
  assert.equal(h.autosave.state, 'saving');
  await h.answer(0, 2);
  assert.equal(h.autosave.state, 'idle');
  assert.deepEqual(h.autosave.status(), { state: 'idle', pending: false, saving: false, paused: false, base: 2, savedAt: 3999, error: null });
  assert.deepEqual(h.saved, [2]);
  assert.deepEqual(h.states, ['dirty', 'saving', 'idle']);
  assert.deepEqual(AUTOSAVE_STATES, ['idle', 'dirty', 'saving', 'conflict', 'error']);
});

test('one request at a time: changes made while saving go next, with the new base', async () => {
  const h = harness();
  h.autosave.change();
  await h.advance(2000);
  await h.advance(100);
  h.autosave.change();
  await h.advance(5000);
  assert.equal(h.calls.length, 1, 'never a second request in flight');
  await h.answer(0, 2);
  assert.equal(h.autosave.state, 'dirty');
  await h.advance(0);
  assert.deepEqual(h.calls.map((c) => c.base), [1, 2], 'the last change was long ago, so it goes now');
  // A change just before the reply still waits out its own delay.
  h.autosave.change();
  await h.advance(100);
  await h.answer(1, 3);
  await h.advance(1899);
  assert.equal(h.calls.length, 2);
  await h.advance(1);
  assert.deepEqual(h.calls.map((c) => c.base), [1, 2, 3]);
  await h.answer(2, 4);
  assert.equal(h.maxInFlight, 1);
});

test('flush sends now and resolves once everything, including later changes, is saved', async () => {
  const h = harness();
  assert.equal((await h.autosave.flush()).state, 'idle', 'nothing to save');
  h.autosave.change();
  let flushed = null;
  h.autosave.flush().then((status) => { flushed = status; });
  await settle();
  assert.equal(h.calls.length, 1, 'no waiting for the delay');
  h.autosave.change();
  await h.answer(0, 2);
  assert.equal(flushed, null, 'a change made during the save still has to go');
  assert.deepEqual(h.calls.map((c) => c.base), [1, 2]);
  await h.answer(1, 3);
  assert.equal(flushed.state, 'idle');
  assert.equal(flushed.base, 3);
  assert.equal(h.timers.size, 0);
});

test('a conflict pauses saving; Keep mine resumes with their version, Reload theirs resets', async () => {
  const h = harness();
  h.autosave.change();
  const flushed = h.autosave.flush();
  h.calls[0].reject(conflictError());
  await assert.rejects(flushed, { name: 'ConflictError' });
  assert.equal(h.autosave.state, 'conflict');
  assert.equal(h.autosave.status().paused, true);
  assert.equal(h.conflicts.length, 1);
  h.autosave.change();
  await h.advance(10000);
  assert.equal(h.calls.length, 1, 'nothing is sent during a conflict');
  await assert.rejects(h.autosave.flush(), { name: 'ConflictError' });
  h.autosave.resume({ base: 7 });
  assert.deepEqual(h.calls.map((c) => c.base), [1, 7]);
  await h.answer(1, 8);
  assert.equal(h.autosave.state, 'idle');
  h.autosave.change();
  await h.advance(2000);
  h.calls[2].reject(conflictError());
  await settle();
  h.autosave.reset({ base: 9 });
  const { state, pending, paused, base, error } = h.autosave.status();
  assert.deepEqual({ state, pending, paused, base, error }, { state: 'idle', pending: false, paused: false, base: 9, error: null });
  h.autosave.change();
  await h.advance(2000);
  assert.equal(h.calls.at(-1).base, 9);
  assert.equal(h.maxInFlight, 1);
});

test('other errors keep the changes and retry on the next change or flush', async () => {
  const h = harness({ isConflict: (error) => error.status === 409 });
  h.autosave.change();
  await h.advance(2000);
  h.calls[0].reject(Object.assign(new Error('offline'), { status: 0 }));
  await settle();
  assert.equal(h.autosave.state, 'error');
  assert.equal(h.autosave.status().pending, true);
  assert.equal(h.errors[0].message, 'offline');
  await h.advance(60000);
  assert.equal(h.calls.length, 1, 'no automatic retries');
  const flushed = h.autosave.flush();
  assert.equal(h.calls.length, 2);
  await h.answer(1, 2);
  assert.equal((await flushed).state, 'idle');
  h.autosave.change();
  await h.advance(2000);
  h.calls[2].reject(Object.assign(new Error('version_conflict'), { status: 409 }));
  await settle();
  assert.equal(h.autosave.state, 'conflict', 'isConflict decides what a conflict is');
});

test('pause and resume, for example while someone else holds the edit lease', async () => {
  const h = harness();
  h.autosave.change();
  h.autosave.pause();
  await h.advance(10000);
  assert.equal(h.calls.length, 0);
  assert.deepEqual([h.autosave.state, h.autosave.status().paused], ['dirty', true]);
  await assert.rejects(h.autosave.flush(), { code: 'autosave_paused' });
  h.autosave.resume();
  assert.equal(h.calls.length, 1, 'waiting changes go as soon as saving resumes');
  await h.answer(0, 2);
  h.autosave.resume();
  assert.equal(h.calls.length, 1, 'resume with nothing waiting sends nothing');
});

test('reset and dispose make a request in flight stale', async () => {
  const h = harness();
  h.autosave.change();
  await h.advance(2000);
  const flushed = h.autosave.flush();
  h.autosave.reset({ base: 5 });
  await assert.rejects(flushed, { code: 'autosave_reset' });
  assert.equal(h.autosave.state, 'saving', 'the old request is still on the wire');
  h.autosave.change();
  await h.advance(5000);
  assert.equal(h.calls.length, 1, 'still one request at a time');
  h.calls[0].reject(conflictError());
  await settle();
  assert.equal(h.conflicts.length, 0, 'a stale outcome is ignored');
  assert.equal(h.autosave.state, 'dirty');
  await h.advance(0);
  assert.deepEqual(h.calls.map((c) => c.base), [1, 5]);
  h.autosave.dispose();
  await h.answer(1, 6);
  assert.equal(h.autosave.base, 5);
  h.autosave.change();
  await h.advance(10000);
  assert.equal(h.calls.length, 2);
  await assert.rejects(h.autosave.flush(), { code: 'autosave_disposed' });
});

test('save failures of every shape become an error state', async () => {
  const thrown = harness({ save: () => { throw new Error('bad'); } });
  thrown.autosave.change();
  await thrown.advance(2000);
  assert.equal(thrown.autosave.state, 'error');
  assert.equal(thrown.errors[0].message, 'bad');
  const empty = harness({ save: () => Promise.reject(undefined) });
  empty.autosave.change();
  await empty.advance(2000);
  assert.equal(empty.errors[0].code, 'autosave_failed');
  const plain = harness({ save: () => ({ base: 'x' }) });
  plain.autosave.change();
  await plain.advance(2000);
  assert.equal(plain.autosave.base, 'x', 'a plain value works like a resolved promise');
  plain.autosave.setBase('y');
  assert.equal(plain.autosave.base, 'y');
});

test('bad options fail fast', () => {
  assert.throws(() => createAutosave({}), /save must be a function/);
  assert.throws(() => createAutosave({ save: () => {}, delayMs: -1 }), /delayMs/);
  assert.throws(() => createAutosave({ save: () => {}, delayMs: Number.NaN }), /delayMs/);
  assert.throws(() => createAutosave({ save: () => {}, onState: 'x' }), /onState must be a function/);
});
