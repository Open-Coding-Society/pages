import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canPublish, createSession, errorKeyOf, fieldsOf, publishStateOf, saveStateOf } from '../js/editor-session.js';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function fakeWindow() {
  const listeners = {};
  return { addEventListener: (type, fn) => { listeners[type] = fn; }, removeEventListener: (type) => { delete listeners[type]; }, fire: (type) => listeners[type] && listeners[type](), listeners };
}

function fakeDrafts() {
  const records = new Map();
  return {
    records,
    keyFor: (ref) => (ref ? `${ref.kind}-${ref.id}` : 'new'),
    read: (key) => records.get(key) || null,
    write: (key, record) => records.set(key, { ...record, savedAt: 1 }),
    clear: (key) => records.delete(key),
  };
}

function conflict(base) {
  return Object.assign(new Error('conflict'), { name: 'ConflictError', current: { base, savedByName: 'Grace', savedAt: 5 } });
}

test('the save indicator words', () => {
  const time = (ms) => `t${ms}`;
  assert.equal(saveStateOf({ state: 'saving' }).key, 'save_saving');
  assert.equal(saveStateOf({ state: 'conflict' }).key, 'save_conflict');
  assert.equal(saveStateOf({ state: 'error', error: { name: 'OfflineError' } }).key, 'save_offline');
  assert.equal(saveStateOf({ state: 'error', error: { name: 'ApiError' } }).key, 'save_error');
  assert.equal(saveStateOf({ state: 'idle' }, { created: false }).key, 'save_new');
  assert.equal(saveStateOf({ state: 'dirty' }).key, 'save_dirty');
  assert.equal(saveStateOf({ state: 'idle' }, { cloud: false }).key, 'save_local');
  assert.deepEqual(saveStateOf({ state: 'idle', savedAt: 9 }, { cloud: true, formatTime: time }), { key: 'save_saved', vars: { time: 't9' } });
  assert.equal(saveStateOf({ state: 'saving' }, { readOnly: true }).key, 'save_readonly');
});

test('publish state and the Publish button follow the published copy', () => {
  assert.equal(publishStateOf({ status: 'PUBLISHED' }, { publish: false }), null, 'nothing publishes from this browser');
  assert.equal(publishStateOf(null, { publish: true }), 'pub_none');
  assert.equal(publishStateOf({ status: 'DRAFT' }, { publish: true }), 'pub_none');
  assert.equal(publishStateOf({ status: 'PUBLISHED', hasUnpublishedChanges: false }, { publish: true }), 'pub_live');
  assert.equal(publishStateOf({ status: 'PUBLISHED', hasUnpublishedChanges: true }, { publish: true }), 'pub_changes');
  assert.equal(publishStateOf({ status: 'PUBLISHED' }, { publish: true, dirty: true }), 'pub_changes', 'unsaved typing is a change too');
  assert.equal(canPublish({ status: 'PUBLISHED', hasUnpublishedChanges: false }, { publish: true }), false, 'disabled when nothing changed');
  assert.equal(canPublish({ status: 'PUBLISHED', hasUnpublishedChanges: true }, { publish: true }), true);
  assert.equal(canPublish({ status: 'DRAFT' }, { publish: true }), true);
  assert.equal(canPublish({ status: 'DRAFT' }, { publish: true, readOnly: true }), false);
  assert.equal(canPublish({ status: 'DRAFT' }, { publish: false }), false);
});

test('store errors become one message key each', () => {
  assert.equal(errorKeyOf({ name: 'OfflineError' }).key, 'err_offline');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 0, error: 'storage_full' }).key, 'err_storage_full');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 0, error: 'storage_blocked' }).key, 'err_storage_blocked');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 0, error: 'corrupt' }).key, 'err_corrupt');
  assert.equal(errorKeyOf({ name: 'NotFoundError' }).key, 'not_found');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 401 }).key, 'err_signed_out');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 403, error: 'origin_rejected' }).key, 'err_origin');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 403, error: 'forbidden' }).key, 'err_forbidden');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 413, error: 'too_large' }).key, 'err_too_large');
  assert.equal(errorKeyOf({ name: 'ApiError', status: 409, error: 'busy' }).key, 'err_busy');
  assert.deepEqual(errorKeyOf({ name: 'ApiError', status: 400, error: 'invalid_spec' }), { key: 'err_invalid', vars: { message: 'invalid_spec' } });
  assert.deepEqual(errorKeyOf(new Error('boom')), { key: 'err_generic', vars: { message: 'boom' } });
});

test('fieldsOf sends the page settings Spring keeps as columns, strings only', () => {
  assert.deepEqual(fieldsOf({ page: { title: 'Flood Watch', description: 'x', byline: 7, course: 'csp', image: '/a.png', width: 'wide' } }),
    { title: 'Flood Watch', description: 'x', byline: '', course: 'csp', image: '/a.png' });
  assert.deepEqual(fieldsOf(null), { title: '', description: '', byline: '', course: '', image: '' });
});

test('changes save with the newest base, write a crash copy first and clear it once saved', async () => {
  const drafts = fakeDrafts();
  const saves = [];
  const store = {
    capabilities: { cloud: true, leases: false },
    save: async (ref, page, { base, fields }) => { saves.push({ base, title: page.title, fields }); return { base: base + 1, meta: { version: base + 1 } }; },
  };
  let page = { title: 'A' };
  const session = createSession({ store, draftStore: drafts, ref: { kind: 'spring', id: '7' }, base: 3, getPage: () => page, getFields: () => ({ title: page.title }), win: fakeWindow(), delayMs: 0, draftDelayMs: 0 });
  page = { title: 'B' };
  session.change();
  await wait(5);
  assert.deepEqual(saves, [{ base: 3, title: 'B', fields: { title: 'B' } }]);
  assert.equal(session.base, 4, 'the response replaces the base');
  assert.equal(drafts.read('spring-7'), null, 'nothing left to recover once saved');
  page = { title: 'C' };
  session.change();
  await session.flush();
  assert.equal(saves[1].base, 4);
  session.dispose();
});

test('a conflict pauses saving until Keep mine saves over theirs with their version', async () => {
  const drafts = fakeDrafts();
  const bases = [];
  let fail = true;
  const conflicts = [];
  const store = {
    capabilities: { cloud: true },
    save: async (ref, page, { base }) => {
      bases.push(base);
      if (fail) { fail = false; throw conflict(10); }
      return { base: base + 1, meta: {} };
    },
  };
  const session = createSession({ store, draftStore: drafts, ref: { kind: 'spring', id: '1' }, base: 2, getPage: () => ({}), win: fakeWindow(), delayMs: 0, draftDelayMs: 0, onConflict: (error) => conflicts.push(error.current.base) });
  session.change();
  await wait(5);
  assert.deepEqual(conflicts, [10]);
  assert.equal(session.status().state, 'conflict');
  session.change();
  await wait(5);
  assert.deepEqual(bases, [2], 'paused: no save until the student chooses');
  session.keepMine(10);
  await wait(5);
  assert.deepEqual(bases, [2, 10]);
  assert.equal(session.base, 11);
  session.dispose();
});

test('a page that isn\'t in the store yet is created by its first save', async () => {
  const drafts = fakeDrafts();
  const created = [];
  const store = {
    capabilities: { cloud: false },
    create: async (page, { fields }) => ({ ref: { kind: 'local', id: 'abc' }, base: 1, meta: { title: fields.title } }),
    save: async () => { throw new Error('save before create'); },
  };
  drafts.write('new', { baseVersion: null, dirty: true, page: {} });
  const session = createSession({ store, draftStore: drafts, getPage: () => ({ page: { title: 'Mine' } }), win: fakeWindow(), delayMs: 0, draftDelayMs: 0, onCreated: (result) => created.push(result.ref.id) });
  session.change();
  await wait(5);
  assert.deepEqual(created, ['abc']);
  assert.deepEqual(session.ref, { kind: 'local', id: 'abc' });
  assert.equal(drafts.read('new'), null);
  session.dispose();
});

test('offline saves retry by themselves, and pagehide keeps a copy and frees the lease', async () => {
  const drafts = fakeDrafts();
  const win = fakeWindow();
  const released = [];
  let calls = 0;
  const store = {
    capabilities: { cloud: true, leases: true },
    save: async () => { calls += 1; throw Object.assign(new Error('offline'), { name: 'OfflineError' }); },
    lease: async () => ({ holderName: 'Ada', mine: true, expiresAt: 1 }),
    releaseLease: async (ref, options) => { released.push(options.keepalive); },
  };
  const leases = [];
  const session = createSession({ store, draftStore: drafts, ref: { kind: 'spring', id: '3' }, base: 1, getPage: () => ({ x: 1 }), win, delayMs: 0, draftDelayMs: 1000, onLease: (lease) => leases.push(lease.mine) });
  await session.startLease();
  assert.deepEqual(leases, [true]);
  session.change();
  await wait(5);
  assert.equal(calls, 1);
  assert.equal(session.status().state, 'error');
  win.fire('online');
  await wait(5);
  assert.equal(calls, 2, 'back online: try again at once');
  win.fire('pagehide');
  assert.equal(drafts.read('spring-3').dirty, true, 'the unsaved page is kept in this browser');
  assert.deepEqual(released, [true], 'released with keepalive so it survives the unload');
  session.dispose({ release: false });
  assert.equal(win.listeners.pagehide, undefined);
});
