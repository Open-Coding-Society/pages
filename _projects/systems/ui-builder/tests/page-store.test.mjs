import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ApiError, ConflictError, LocalPageStore, NotFoundError, OfflineError, SlugTakenError, pageFields, storeErrorText,
} from '../js/page-store.js';
import { textOf } from '../js/registry.js';
import { createStorage } from './fixtures/live/dom.mjs';
import { loadRegistry, needsRuby } from './helpers.mjs';

const PREFIX = 'ocs:ui-builder:v1:page:';
const page = (title = 'Flood Watch', extra = {}) => ({
  schemaVersion: 1, kind: 'ocs-ui-page', page: { title, description: 'We map floods.', byline: 'Binary Beasts', course: 'csp', image: '', ...extra }, sections: [],
});

function storeOf({ storage = createStorage(), start = 1000, ids = ['aaaaaa111111', 'bbbbbb222222', 'cccccc333333'], registry = null } = {}) {
  let time = start;
  const queue = [...ids];
  const store = new LocalPageStore({ storage, now: () => time, registry, makeId: () => queue.shift() });
  return { store, storage, advance: (ms) => { time += ms; } };
}

test('a local store says it has no cloud features', () => {
  assert.deepEqual(new LocalPageStore({ storage: createStorage() }).capabilities, {
    cloud: false, publish: false, visibility: false, revisions: false, leases: false, teams: false, gallery: false, teacher: false,
  });
});

test('create, open, save and list keep pages in this browser with a revision as base', async () => {
  const { store, storage, advance } = storeOf();
  const created = await store.create(page());
  assert.deepEqual(created.ref, { kind: 'local', id: 'aaaaaa111111' });
  assert.equal(created.base, 1);
  assert.equal(created.meta.title, 'Flood Watch');
  assert.equal(created.meta.byline, 'Binary Beasts');
  assert.equal(created.meta.status, 'LOCAL');
  assert.equal(created.meta.publishedAt, null);
  assert.equal(created.meta.hasUnpublishedChanges, false);
  assert.ok(storage.items.has(`${PREFIX}aaaaaa111111`));

  const opened = await store.open(created.ref);
  assert.deepEqual(opened.page, page());
  assert.equal(opened.base, 1);

  advance(50);
  const saved = await store.save(created.ref, page('Flood Watch 2'), { base: 1 });
  assert.equal(saved.base, 2);
  assert.equal(saved.meta.title, 'Flood Watch 2');
  assert.equal(saved.meta.updatedAt, 1050);
  assert.equal(saved.meta.createdAt, 1000);

  advance(50);
  const second = await store.create(page('Second'), { fields: { title: 'Named by the editor' } });
  const list = await store.list();
  assert.deepEqual(list.map((row) => row.title), ['Named by the editor', 'Flood Watch 2'], 'newest first');
  assert.deepEqual(list[0].ref, second.ref);
  assert.deepEqual(Object.keys(list[1]).sort(), ['base', 'byline', 'course', 'createdAt', 'description', 'hasUnpublishedChanges',
    'image', 'publishedAt', 'ref', 'status', 'title', 'updatedAt']);
  assert.deepEqual(await store.list({ scope: 'class' }), [], 'only Spring has class pages');
});

test('saving over a newer revision is a ConflictError, as another tab would cause', async () => {
  const { store, advance } = storeOf();
  const { ref } = await store.create(page());
  advance(10);
  await store.save(ref, page('From tab two'), { base: 1 });
  await assert.rejects(store.save(ref, page('From tab one'), { base: 1 }), (error) => {
    assert.equal(error.name, 'ConflictError');
    assert.ok(error instanceof ConflictError && error instanceof ApiError);
    assert.deepEqual(error.ref, ref);
    assert.equal(error.base, 1);
    assert.deepEqual(error.current, { base: 2, savedByName: null, savedAt: 1010 });
    assert.equal(error.status, 409);
    assert.equal(error.error, 'version_conflict');
    return true;
  });
  // "Keep mine": saving with the current base works.
  assert.equal((await store.save(ref, page('Kept'), { base: 2 })).base, 3);
  // A save without a base (an import, say) doesn't check.
  assert.equal((await store.save(ref, page('Any'))).base, 4);
});

test('remove deletes the page; missing pages are NotFoundError', async () => {
  const { store } = storeOf();
  const { ref } = await store.create(page());
  await store.remove(ref);
  await assert.rejects(store.open(ref), { name: 'NotFoundError' });
  await assert.rejects(store.remove(ref), { name: 'NotFoundError' });
  await assert.rejects(store.save(ref, page()), { name: 'NotFoundError' });
});

test('hand-typed ids are never looked up; refs of the wrong kind are a caller bug', async () => {
  const storage = createStorage();
  const calls = [];
  const spy = { ...storage, getItem: (key) => { calls.push(key); return storage.getItem(key); } };
  const store = new LocalPageStore({ storage: spy });
  for (const id of ['../x', 'ABC', '', 'a', 7, null, '__proto__']) {
    await assert.rejects(store.open({ kind: 'local', id }), { name: 'NotFoundError' }, String(id));
  }
  assert.deepEqual(calls, []);
  await assert.rejects(store.open({ kind: 'spring', id: 1 }), TypeError);
  await assert.rejects(store.open(null), TypeError);
  await assert.rejects(store.create({ title: 'not a page' }), TypeError);
});

test('ids from makeId that are invalid or taken are skipped', async () => {
  const { store } = storeOf({ ids: ['bad id', 'aaaaaa111111', 'aaaaaa111111', 'dddddd444444'] });
  assert.equal((await store.create(page())).ref.id, 'aaaaaa111111');
  assert.equal((await store.create(page())).ref.id, 'dddddd444444');
});

test('damaged records are skipped by list, refused by open and can be saved over', async () => {
  const { store, storage } = storeOf();
  const { ref } = await store.create(page());
  storage.setItem(`${PREFIX}eeeeee555555`, '{oops');
  storage.setItem(`${PREFIX}ffffff666666`, JSON.stringify({ v: 1, revision: 1, page: { kind: 'other' } }));
  storage.setItem('ocs:ui-builder:v1:page:../escape', '{}');
  storage.setItem('unrelated', 'x');
  assert.deepEqual((await store.list()).map((row) => row.ref.id), [ref.id]);
  await assert.rejects(store.open({ kind: 'local', id: 'eeeeee555555' }), (error) => error.name === 'ApiError' && error.error === 'corrupt');
  const repaired = await store.save({ kind: 'local', id: 'eeeeee555555' }, page('Repaired'), { base: 7 });
  assert.equal(repaired.base, 1);
  assert.equal((await store.open({ kind: 'local', id: 'eeeeee555555' })).page.page.title, 'Repaired');
});

test('storage failures become ApiErrors the editor can word', async () => {
  const full = storeOf({ storage: createStorage({ cap: 10 }) });
  await assert.rejects(full.store.create(page()), (error) => error.name === 'ApiError' && error.error === 'storage_full');
  for (const storage of [null, createStorage({ broken: true })]) {
    const store = new LocalPageStore({ storage, makeId: () => 'aaaaaa111111' });
    await assert.rejects(store.list(), (error) => error.error === 'storage_blocked');
    await assert.rejects(store.create(page()), (error) => error.error === 'storage_blocked');
    await assert.rejects(store.open({ kind: 'local', id: 'aaaaaa111111' }), (error) => error.error === 'storage_blocked');
  }
});

test('page fields are kept whole, never cut to a column size', async () => {
  const image = `https://lh3.googleusercontent.com/${'a'.repeat(600)}`;
  const title = 'T'.repeat(130);
  const fields = pageFields(page(title, { image }));
  assert.equal(fields.image, image);
  assert.equal(fields.title, title);
  assert.deepEqual(pageFields(page('Flood Watch', { byline: 7 })).byline, '', 'strings only');
  const { store } = storeOf();
  const { ref } = await store.create(page(title, { image }));
  const saved = await store.save(ref, page(title, { image }), { base: 1 });
  assert.equal(saved.meta.image, image);
  assert.equal(saved.meta.title, title);
});

test('an untitled page lists with the registry word for untitled', needsRuby, async () => {
  const registry = loadRegistry();
  const { store } = storeOf({ registry });
  await store.create(page('   '));
  assert.equal((await store.list())[0].title, textOf(registry, 'blocks.untitled'));
});

test('every error has a name, and storeErrorText picks registry wording for each', needsRuby, () => {
  const registry = loadRegistry();
  const cases = [
    [new OfflineError(), 'store.offline'],
    [new OfflineError({ reason: 'timeout' }), 'store.timeout'],
    [new ConflictError({ current: { base: 4, savedByName: 'Ada', savedAt: 0 } }), 'store.conflict'],
    [new ConflictError({ current: { base: 4 } }), 'store.conflict_unknown'],
    [new NotFoundError(), 'store.not_found'],
    [new SlugTakenError(), 'store.slug_taken'],
    [new SlugTakenError({ error: 'slug_locked' }), 'store.slug_locked'],
    [new ApiError({ status: 400, error: 'invalid_slug' }), 'errors.slug_invalid'],
    [new ApiError({ status: 400, error: 'slug_reserved' }), 'errors.slug_reserved'],
    [new ApiError({ status: 400, error: 'invalid_group' }), 'errors.group_not_allowed'],
    [new ApiError({ status: 400, error: 'loopback_source' }), 'errors.loopback_url'],
    [new ApiError({ status: 403, error: 'origin_rejected' }), 'store.origin_rejected'],
    [new ApiError({ status: 409, error: 'too_many_pages', body: { error: 'too_many_pages', max: 100 } }), 'store.too_many_pages'],
    [new ApiError({ error: 'storage_full' }), 'store.storage_full'],
    [new ApiError({ status: 503, error: 'something_new' }), 'store.server'],
    [new ApiError({ status: 422, error: 'something_new' }), 'store.bad_request'],
    // Codes this page doesn't know (Spring Boot's own error bodies, a proxy) by their status.
    [new ApiError({ status: 401, error: 'Unauthorized' }), 'store.unauthorized'],
    [new ApiError({ status: 403, error: 'Forbidden' }), 'store.forbidden'],
    [new ApiError({ status: 404, error: 'Not Found' }), 'store.not_found'],
    [new ApiError({ status: 413, error: 'Payload Too Large' }), 'store.too_large'],
    [new ApiError({ status: 409, error: 'conflict' }), 'store.bad_request'],
    [new Error('plain'), 'store.unknown'],
    [null, 'store.unknown'],
  ];
  for (const [error, key] of cases) {
    const said = storeErrorText(error);
    assert.equal(said.key, key, String(error && error.error));
    const words = textOf(registry, said.key, said.vars);
    assert.notEqual(words, said.key, `${said.key} has wording`);
    assert.doesNotMatch(words, /\{\w+\}/, `${said.key} fills every placeholder`);
  }
  for (const [ErrorClass, name] of [[ApiError, 'ApiError'], [ConflictError, 'ConflictError'], [SlugTakenError, 'SlugTakenError'], [NotFoundError, 'NotFoundError'], [OfflineError, 'OfflineError']]) {
    assert.equal(new ErrorClass().name, name);
  }
});
