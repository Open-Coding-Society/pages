import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canPublish, createSession, errorKeyOf, fieldsOf, isRetryable, publicStateOf, publishStateOf, saveStateOf } from '../js/editor-session.js';
import { ApiError, ConflictError, NotFoundError, OfflineError } from '../js/page-store.js';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
// Promise callbacks only: works while the test mocks setTimeout.
const settle = async (rounds = 10) => { for (let n = 0; n < rounds; n += 1) await new Promise((resolve) => setImmediate(resolve)); };

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
  assert.equal(saveStateOf({ state: 'error', error: { name: 'OfflineError' } }).key, 'save_retry');
  assert.equal(saveStateOf({ state: 'error', error: { name: 'ApiError', status: 502, error: 'server' } }).key, 'save_retry', 'Spring down behind its proxy is not "offline"');
  assert.equal(saveStateOf({ state: 'error', error: { name: 'ApiError', status: 409, error: 'busy' } }).key, 'save_retry');
  assert.equal(saveStateOf({ state: 'error', error: { name: 'ApiError', status: 400, error: 'invalid_spec' } }).key, 'save_error');
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

test('a page counts as public only while its approval covers the live version', () => {
  const now = 1_000_000;
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicUntil: null, publicPending: false }, now), 'public');
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicUntil: now + 1 }, now), 'public');
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicUntil: now }, now), 'ended', 'Spring still says PUBLIC once the date has passed');
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicPending: true }, now), 'newer', 'published again since the approval');
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicUntil: now - 1, publicPending: true }, now), 'ended', 'ran out: visitors get nothing at all');
  // Spring's own publicExpired wins over the date when it sends it; an older answer has only the date.
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicExpired: true, publicUntil: now + 100000 }, now), 'ended', 'Spring says it ran out, whatever the date looks like');
  assert.equal(publicStateOf({ visibility: 'PUBLIC', publicExpired: false, publicUntil: now - 100000 }, now), 'public', 'Spring says it is still live');
  assert.equal(publicStateOf({ visibility: 'SIGNED_IN', publicRequested: true }, now), 'members');
  assert.equal(publicStateOf(null, now), 'members');
});

test('store errors are worded by the registry, never by their own message or code', () => {
  assert.equal(errorKeyOf(new OfflineError()).key, 'store.offline');
  assert.equal(errorKeyOf(new ApiError({ error: 'storage_full' })).key, 'store.storage_full');
  assert.equal(errorKeyOf(new NotFoundError()).key, 'store.not_found');
  assert.equal(errorKeyOf(new ApiError({ status: 401, error: 'Unauthorized' })).key, 'store.unauthorized', "Spring Boot's own 401 body");
  assert.equal(errorKeyOf(new ApiError({ status: 403, error: 'origin_rejected' })).key, 'store.origin_rejected');
  assert.equal(errorKeyOf(new ApiError({ status: 400, error: 'invalid_group' })).key, 'errors.group_not_allowed');
  assert.deepEqual(errorKeyOf(new ApiError({ status: 502, error: 'server' })), { key: 'store.server', vars: { status: 502 } });
  assert.equal(errorKeyOf(new ConflictError({ current: { base: 4, savedByName: 'Ada', savedAt: 1 } })).key, 'store.conflict');
  assert.deepEqual(errorKeyOf(new ApiError({ status: 409, error: 'published_changed' })), { key: 'editor.approve_changed', vars: {} }, 'a teacher approved a copy that a newer publish replaced');
  assert.deepEqual(errorKeyOf(new ApiError({ status: 409, error: 'not_published' })), { key: 'editor.approve_unpublished', vars: {} }, 'a teacher approved a page unpublished since, which "Publish the page first" would not explain');
  assert.deepEqual(errorKeyOf(new Error('boom')), { key: 'store.unknown', vars: {} });
  for (const error of [new ApiError({ status: 400, error: 'invalid_group' }), new ApiError({ status: 502, error: 'server' }), new Error('boom')]) {
    assert.doesNotMatch(JSON.stringify(errorKeyOf(error)), /boom|UI Builder store/, 'no developer text');
  }
});

test('busy and failing servers are retried like no answer; other refusals wait for the student', () => {
  assert.equal(isRetryable(new OfflineError()), true);
  assert.equal(isRetryable(new ApiError({ status: 503, error: 'server' })), true);
  assert.equal(isRetryable(new ApiError({ status: 409, error: 'busy' })), true);
  assert.equal(isRetryable(new ApiError({ status: 400, error: 'invalid_spec' })), false);
  assert.equal(isRetryable(new ConflictError()), false);
  assert.equal(isRetryable(null), false);
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
  const sent = [];
  let fail = true;
  const conflicts = [];
  const store = {
    capabilities: { cloud: true },
    save: async (ref, page, { base, newRevision }) => {
      sent.push([base, newRevision]);
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
  assert.deepEqual(sent, [[2, false]], 'paused: no save until the student chooses');
  session.keepMine(10);
  await wait(5);
  assert.deepEqual(sent, [[2, false], [10, true]], 'one save over theirs, as a revision of its own');
  assert.equal(session.base, 11);
  session.change();
  await session.flush();
  assert.deepEqual(sent[2], [11, false], 'later saves update the newest revision as usual');
  session.dispose();
});

test('Keep mine after a conflict from Publish saves the page on screen once, with nothing waiting', async () => {
  const sent = [];
  const store = {
    capabilities: { cloud: true },
    save: async (ref, page, { base, newRevision }) => { sent.push({ base, newRevision, title: page.title }); return { base: base + 1, meta: {} }; },
  };
  const session = createSession({ store, draftStore: fakeDrafts(), ref: { kind: 'spring', id: '5' }, base: 5, getPage: () => ({ title: 'Mine' }), win: fakeWindow(), delayMs: 0, draftDelayMs: 0 });
  assert.equal(session.status().pending, false, 'Publish flushed everything before it asked Spring');
  session.keepMine(6);
  await session.flush();
  assert.deepEqual(sent, [{ base: 6, newRevision: true, title: 'Mine' }], 'one PUT over their version 6');
  assert.equal(session.base, 7, 'so the next Publish publishes this page, not theirs');
  await wait(5);
  assert.equal(sent.length, 1, 'and no second save from the debounce');
  session.dispose();
});

test('Reload theirs forgets a Keep mine that never got saved', async () => {
  const sent = [];
  let offline = true;
  const store = {
    capabilities: { cloud: true },
    save: async (ref, page, { base, newRevision }) => {
      sent.push([base, newRevision]);
      if (offline) throw new OfflineError();
      return { base: base + 1, meta: {} };
    },
  };
  const session = createSession({ store, draftStore: fakeDrafts(), ref: { kind: 'spring', id: '6' }, base: 1, getPage: () => ({}), win: fakeWindow(), delayMs: 0, draftDelayMs: 0 });
  session.keepMine(4);
  await wait(5);
  assert.deepEqual(sent, [[4, true]]);
  offline = false;
  session.reset({ base: 9 });
  session.change();
  await session.flush();
  assert.deepEqual(sent[1], [9, false]);
  session.dispose();
});

test('a busy or failing server is tried again on its own; a refused page waits for the student', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const answers = [new ApiError({ status: 502, error: 'server' }), new ApiError({ status: 409, error: 'busy' }), null, new ApiError({ status: 400, error: 'invalid_spec' })];
  let calls = 0;
  const store = {
    capabilities: { cloud: true },
    save: async (ref, page, { base }) => {
      const answer = answers[calls];
      calls += 1;
      if (answer) throw answer;
      return { base: base + 1, meta: {} };
    },
  };
  const session = createSession({ store, draftStore: fakeDrafts(), ref: { kind: 'spring', id: '4' }, base: 1, getPage: () => ({}), win: fakeWindow(), delayMs: 0, draftDelayMs: 0 });
  const run = async (ms) => {
    t.mock.timers.tick(ms);
    t.mock.timers.tick(0); // the save the retry scheduled
    await settle();
  };
  session.change();
  await run(0);
  assert.equal(calls, 1);
  assert.equal(session.status().state, 'error');
  await run(4999);
  assert.equal(calls, 1, 'not yet');
  await run(1);
  assert.equal(calls, 2, 'a 502 is sent again after 5 s');
  await run(10000);
  assert.equal(calls, 3, 'busy is sent again after 10 s');
  assert.equal(session.status().state, 'idle');
  session.change();
  await run(0);
  assert.equal(calls, 4);
  await run(60000);
  assert.equal(calls, 4, 'a refused page is sent again only after the student changes it');
  session.dispose();
});

test('the crash copy stays until the newest changes are saved too', async () => {
  const drafts = fakeDrafts();
  const requests = [];
  const store = {
    capabilities: { cloud: true },
    save: (ref, page, { base }) => new Promise((resolve, reject) => requests.push({ resolve: () => resolve({ base: base + 1, meta: {} }), reject })),
  };
  let page = { title: 'A' };
  const session = createSession({ store, draftStore: drafts, ref: { kind: 'spring', id: '8' }, base: 1, getPage: () => page, win: fakeWindow(), delayMs: 0, draftDelayMs: 0 });
  session.change();
  await wait(5);
  assert.equal(requests.length, 1, 'A is on its way');
  page = { title: 'B' };
  session.change();
  await wait(5);
  const publishing = session.flush(); // Publish waits on it
  requests[0].resolve();
  await wait(5);
  assert.equal(requests.length, 2, 'B went out as soon as A was saved, for the flush');
  assert.equal(drafts.read('spring-8').page.title, 'B', 'B exists only in that request, so its crash copy stays');
  requests[1].reject(new ApiError({ status: 400, error: 'invalid_spec' }));
  await assert.rejects(publishing);
  assert.equal(drafts.read('spring-8').page.title, 'B', 'and is still there once Spring refused it');
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
