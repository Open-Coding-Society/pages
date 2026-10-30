import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalPageStore } from '../js/page-store.js';
import { SpringPageStore } from '../js/spring-page-store.js';
import { createStorage } from './fixtures/live/dom.mjs';

const JAVA = 'https://spring.opencodingsociety.com';
// config.js fetchOptions, as the page passes it.
const FETCH_OPTIONS = Object.freeze({
  method: 'GET', mode: 'cors', cache: 'default', credentials: 'include',
  headers: Object.freeze({ 'Content-Type': 'application/json', 'X-Origin': 'client' }),
});
const SPEC = { schemaVersion: 1, kind: 'ocs-ui-page', page: { title: 'Flood Watch', description: 'Maps', byline: 'Beasts', course: 'csp', image: '' }, sections: [] };

const summary = (extra = {}) => ({
  id: 12, slug: null, title: 'Flood Watch', description: 'Maps', byline: 'Beasts', course: 'csp', image: '', status: 'DRAFT',
  visibility: 'SIGNED_IN', publicRequested: false, publicUntil: null, publicPending: false, groupId: 7, groupName: 'Beasts',
  ownerName: 'Ada', isOwner: true, version: 3, updatedAt: 1700, updatedByName: 'Ada', publishedAt: null, publishedVersion: null,
  hasUnpublishedChanges: false, lease: null, ...extra,
});
const detail = (extra = {}) => ({ ...summary(extra), spec: SPEC });

// A reply the way fetch gives one: a status and a body read with text().
const reply = (status, body) => ({ status, text: async () => (body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body)) });

function server(...answers) {
  const calls = [];
  // A plain function: window.fetch refuses to be called with any `this`, so the store must call it unbound.
  function fetchImpl(url, init) {
    calls.push({ url, init, self: this });
    const answer = answers.length > 1 ? answers.shift() : answers[0];
    return typeof answer === 'function' ? answer(url, init) : Promise.resolve(answer);
  }
  return { calls, fetchImpl };
}

// The slug rule is the registry's (data/ui_builder.yml limits.slug_pattern), as the pages pass it.
const SLUG_PATTERN = '^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$';
const REGISTRY = Object.freeze({ limits: { slug_pattern: SLUG_PATTERN }, text: {} });

const storeWith = (fetchImpl, extra = {}) => new SpringPageStore({ javaURI: `${JAVA}/`, fetchOptions: FETCH_OPTIONS, fetchImpl, storage: createStorage(), registry: REGISTRY, ...extra });

test('every request carries the site headers and cookies, unbound and uncached', async () => {
  const { calls, fetchImpl } = server(reply(200, [summary()]));
  const pages = await storeWith(fetchImpl).list();
  assert.equal(calls.length, 1);
  const [{ url, init, self }] = calls;
  assert.equal(url, `${JAVA}/api/ui-builder/pages?scope=mine`);
  assert.equal(self, undefined);
  assert.equal(init.method, 'GET');
  assert.equal(init.credentials, 'include');
  assert.equal(init.mode, 'cors');
  assert.equal(init.cache, 'no-store');
  assert.deepEqual(init.headers, { 'Content-Type': 'application/json', 'X-Origin': 'client' });
  assert.ok(init.signal, 'requests time out');
  assert.equal(FETCH_OPTIONS.method, 'GET', 'config.js fetchOptions is never changed');
  assert.deepEqual(pages[0].ref, { kind: 'spring', id: 12 });
  assert.equal(pages[0].base, 3);
  assert.equal(pages[0].title, 'Flood Watch');
  assert.equal(pages[0].groupName, 'Beasts');
  assert.equal('spec' in pages[0], false);
});

test('a summary passes Spring\'s publicExpired and publicVersion through; older answers omit them', async () => {
  const fresh = server(reply(200, [summary({ visibility: 'PUBLIC', publicUntil: 10, publicPending: true, publicExpired: true, publicVersion: 6 })]));
  const [page] = await storeWith(fresh.fetchImpl).list();
  assert.equal(page.publicExpired, true);
  assert.equal(page.publicVersion, 6);
  const older = server(reply(200, [summary({ visibility: 'PUBLIC', publicUntil: 10 })]));
  const [old] = await storeWith(older.fetchImpl).list();
  assert.equal(old.publicExpired, undefined, 'no publicExpired from an older server: the publicUntil fallback decides');
  assert.equal(old.publicVersion, null);
});

test('the guard\'s two headers are always sent, never twice', async () => {
  const { calls, fetchImpl } = server(reply(200, []));
  await storeWith(fetchImpl, { fetchOptions: { credentials: 'include' } }).list();
  await storeWith(fetchImpl, { fetchOptions: { headers: { 'content-type': 'application/json', 'x-origin': 'client' } } }).list();
  assert.deepEqual(calls[0].init.headers, { 'Content-Type': 'application/json', 'X-Origin': 'client' });
  assert.deepEqual(calls[1].init.headers, { 'content-type': 'application/json', 'x-origin': 'client' });
});

test('capabilities are the cloud ones; teacher turns on once whoami sees a teacher role', async () => {
  const { fetchImpl } = server(reply(200, { id: 5, uid: 'ada', name: 'Ada', email: 'ada@x', roles: [{ name: 'ROLE_STUDENT' }, { name: 'ROLE_TEACHER' }] }));
  const store = storeWith(fetchImpl);
  assert.deepEqual(store.capabilities, { cloud: true, publish: true, visibility: true, revisions: true, leases: true, teams: true, gallery: true, teacher: false });
  assert.deepEqual(await store.whoami(), { personId: 5, name: 'Ada', roles: ['ROLE_STUDENT', 'ROLE_TEACHER'], isTeacher: true });
  assert.equal(store.capabilities.teacher, true);
});

test('whoami is null when nobody is signed in, and offline when Spring is unreachable', async () => {
  for (const status of [401, 403, 404]) {
    assert.equal(await storeWith(server(reply(status, status === 404 ? undefined : { error: 'unauthorized' })).fetchImpl).whoami(), null);
  }
  const { calls, fetchImpl } = server(() => Promise.reject(new TypeError('Failed to fetch')));
  await assert.rejects(storeWith(fetchImpl).whoami(), { name: 'OfflineError', reason: 'network' });
  assert.equal(calls[0].url, `${JAVA}/api/person/get`);
});

test('create and save send the page fields; groupId only when the editor names it', async () => {
  const { calls, fetchImpl } = server(reply(201, detail({ version: 0 })), reply(200, detail({ version: 4 })), reply(200, detail({ version: 5, groupId: null })));
  const store = storeWith(fetchImpl);
  const created = await store.create(SPEC);
  assert.deepEqual(created.ref, { kind: 'spring', id: 12 });
  assert.equal(created.base, 0);
  assert.deepEqual(created.page, SPEC);
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), { title: 'Flood Watch', description: 'Maps', byline: 'Beasts', course: 'csp', image: '', spec: SPEC });

  const saved = await store.save(created.ref, SPEC, { base: 3, fields: { title: 'Renamed' } });
  assert.equal(saved.base, 4);
  assert.equal(calls[1].url, `${JAVA}/api/ui-builder/pages/12`);
  assert.equal(calls[1].init.method, 'PUT');
  const body = JSON.parse(calls[1].init.body);
  assert.equal(body.version, 3);
  assert.equal(body.title, 'Renamed');
  assert.equal('groupId' in body, false, 'no groupId keeps the group');

  await store.save(created.ref, SPEC, { base: 4, fields: { groupId: null } });
  assert.equal(JSON.parse(calls[2].init.body).groupId, null, 'groupId: null removes it');
});

test('page fields go to Spring whole: one too long for its column is refused there, not cut here', async () => {
  const image = `https://lh3.googleusercontent.com/${'a'.repeat(600)}`;
  const spec = { ...SPEC, page: { ...SPEC.page, image } };
  const { calls, fetchImpl } = server(reply(201, detail()), reply(400, { error: 'invalid_spec', details: [{ nodeId: 'page', field: 'image', key: 'too_long' }] }));
  const store = storeWith(fetchImpl);
  await store.create(spec);
  assert.equal(JSON.parse(calls[0].init.body).image, image);
  await assert.rejects(store.save({ kind: 'spring', id: 12 }, spec, { base: 3 }), (error) => {
    assert.deepEqual(error.details, [{ nodeId: 'page', field: 'image', key: 'too_long' }]);
    return true;
  });
  assert.equal(JSON.parse(calls[1].init.body).image, image);
});

test('only the save that resolves a conflict asks for a revision of its own', async () => {
  const { calls, fetchImpl } = server(reply(200, detail({ version: 10 })));
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  await store.save(ref, SPEC, { base: 9, newRevision: true });
  await store.save(ref, SPEC, { base: 10 });
  await store.save(ref, SPEC, { base: 10, newRevision: 'yes' });
  const bodies = calls.map(({ init }) => JSON.parse(init.body));
  assert.equal(bodies[0].newRevision, true);
  assert.equal('newRevision' in bodies[1], false);
  assert.equal('newRevision' in bodies[2], false, 'true only, never a truthy value');
});

test('open returns the draft and its version; local refs stay in this browser', async () => {
  const { calls, fetchImpl } = server(reply(200, detail()));
  const store = storeWith(fetchImpl, { makeId: () => 'aaaaaa111111' });
  const opened = await store.open({ kind: 'spring', id: '12' });
  assert.deepEqual(opened.page, SPEC);
  assert.equal(opened.base, 3);
  assert.equal(opened.meta.isOwner, true);
  // create always goes to Spring; a page made on a Flask-only build reaches the local half this way.
  const local = await LocalPageStore.prototype.create.call(store, SPEC);
  assert.deepEqual((await store.open(local.ref)).page, SPEC);
  await store.save(local.ref, SPEC, { base: local.base });
  await store.remove(local.ref);
  assert.equal(calls.length, 1, 'no Spring request for a page saved in this browser');
});

test('409s are mapped by their error code', async () => {
  const conflict = { error: 'version_conflict', currentVersion: 9, savedByName: 'Grace', savedAt: 1800 };
  const { fetchImpl } = server(reply(409, conflict), reply(409, { error: 'slug_taken' }), reply(409, { error: 'slug_locked' }), reply(409, { error: 'busy' }));
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  await assert.rejects(store.save(ref, SPEC, { base: 3 }), (error) => {
    assert.equal(error.name, 'ConflictError');
    assert.deepEqual(error.ref, ref);
    assert.equal(error.base, 3);
    assert.deepEqual(error.current, { base: 9, savedByName: 'Grace', savedAt: 1800 });
    return true;
  });
  await assert.rejects(store.publish(ref, { base: 3, slug: 'flood-watch' }), { name: 'SlugTakenError', error: 'slug_taken' });
  await assert.rejects(store.publish(ref, { base: 3, slug: 'other' }), { name: 'SlugTakenError', error: 'slug_locked' });
  await assert.rejects(store.publish(ref, { base: 3 }), { name: 'ApiError', error: 'busy', status: 409 });
});

test('other refusals keep their status, code and spec problems', async () => {
  const details = [{ nodeId: 'b-000001', field: 'url', key: 'bad_url', extra: 'x' }, 'junk'];
  const { fetchImpl } = server(reply(400, { error: 'invalid_spec', details }), reply(404, { error: 'not_found' }),
    reply(502, '<html>Bad gateway</html>'), reply(403, { error: 'origin_rejected' }), reply(200, '<html>'), reply(200, { id: 'x' }));
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  await assert.rejects(store.save(ref, SPEC, { base: 1 }), (error) => {
    assert.equal(error.name, 'ApiError');
    assert.equal(error.status, 400);
    assert.equal(error.error, 'invalid_spec');
    assert.deepEqual(error.details, [{ nodeId: 'b-000001', field: 'url', key: 'bad_url' }]);
    return true;
  });
  await assert.rejects(store.open(ref), { name: 'NotFoundError', status: 404 });
  await assert.rejects(store.open(ref), { name: 'ApiError', status: 502, error: 'server', body: null });
  await assert.rejects(store.list(), { name: 'ApiError', status: 403, error: 'origin_rejected' });
  await assert.rejects(store.list(), { name: 'ApiError', error: 'bad_response' });
  await assert.rejects(store.open(ref), { name: 'ApiError', error: 'bad_response' });
});

test('no answer in time is an OfflineError, and the request is aborted', async () => {
  let aborted = false;
  const { fetchImpl } = server((url, init) => new Promise((resolve, reject) => {
    init.signal.addEventListener('abort', () => {
      aborted = true;
      reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    });
  }));
  await assert.rejects(storeWith(fetchImpl, { timeoutMs: 20 }).list(), { name: 'OfflineError', reason: 'timeout' });
  assert.equal(aborted, true);
});

test('the lease is released with keepalive on pagehide', async () => {
  const lease = { holderName: 'Ada', expiresAt: 9000, mine: true };
  const { calls, fetchImpl } = server(reply(200, lease), reply(200, { ...lease, mine: false, holderName: 'Grace' }), reply(204));
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  assert.deepEqual(await store.lease(ref), lease);
  assert.deepEqual(await store.takeLease(ref), { holderName: 'Grace', expiresAt: 9000, mine: false });
  await store.releaseLease(ref, { keepalive: true });
  assert.equal(calls[0].url, `${JAVA}/api/ui-builder/pages/12/lease`);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.body, '{}', 'POSTs say they are JSON and carry JSON');
  assert.equal(calls[1].url, `${JAVA}/api/ui-builder/pages/12/lease/take`);
  assert.equal(calls[2].init.method, 'DELETE');
  assert.equal(calls[2].init.keepalive, true);
  assert.equal(calls[2].init.signal, undefined, 'a keepalive request is not cut short');
  assert.equal(calls[2].init.headers['X-Origin'], 'client');
});

test('publishing, visibility, revisions and editors go to their routes', async () => {
  const { calls, fetchImpl } = server((url) => {
    if (url.endsWith('/revisions')) return Promise.resolve(reply(200, [{ revisionId: 31, pageVersion: 3, kind: 'PUBLISH', savedByName: 'Ada', savedAt: 5, extra: 1 }, { nope: 1 }]));
    if (url.endsWith('/revisions/31')) return Promise.resolve(reply(200, { revisionId: 31, pageVersion: 3, kind: 'SAVE', savedByName: 'Ada', savedAt: 5, spec: SPEC }));
    if (url.endsWith('/visibility/bulk')) return Promise.resolve(reply(200, { updated: 4 }));
    return Promise.resolve(reply(200, detail({ slug: 'flood-watch', status: 'PUBLISHED' })));
  });
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  const published = await store.publish(ref, { base: 3, slug: 'flood-watch' });
  assert.equal(published.meta.slug, 'flood-watch');
  await store.publish(ref, { base: 3 });
  await store.unpublish(ref);
  await store.setVisibility(ref, { visibility: 'PUBLIC', until: 99 });
  assert.deepEqual(await store.bulkPublic({ course: 'csp', until: 99 }), { updated: 4 });
  assert.deepEqual(await store.revisions(ref), [{ revisionId: 31, pageVersion: 3, kind: 'PUBLISH', savedByName: 'Ada', savedAt: 5 }]);
  const revision = await store.revision(ref, 31);
  assert.deepEqual(revision.page, SPEC);
  assert.equal(revision.spec, revision.page);
  const restored = await store.restore(ref, 31, { base: 3 });
  assert.deepEqual(restored.page, SPEC);
  await store.refreshEditors(ref);
  const sent = calls.map(({ url, init }) => [init.method, url.slice(JAVA.length), init.body && JSON.parse(init.body)]);
  assert.deepEqual(sent, [
    ['POST', '/api/ui-builder/pages/12/publish', { version: 3, slug: 'flood-watch' }],
    ['POST', '/api/ui-builder/pages/12/publish', { version: 3 }],
    ['POST', '/api/ui-builder/pages/12/unpublish', {}],
    ['POST', '/api/ui-builder/pages/12/visibility', { visibility: 'PUBLIC', until: 99 }],
    ['POST', '/api/ui-builder/pages/visibility/bulk', { course: 'csp', until: 99 }],
    ['GET', '/api/ui-builder/pages/12/revisions', undefined],
    ['GET', '/api/ui-builder/pages/12/revisions/31', undefined],
    ['POST', '/api/ui-builder/pages/12/revisions/31/restore', { version: 3 }],
    ['POST', '/api/ui-builder/pages/12/editors/refresh', {}],
  ]);
  await assert.rejects(store.revision(ref, 'x'), { name: 'NotFoundError' });
  await assert.rejects(store.publish({ kind: 'local', id: 'aaaaaa111111' }, { base: 1 }), TypeError);
});

test('a teacher approves the published version they looked at, and a newer one is refused', async () => {
  const { calls, fetchImpl } = server(reply(200, detail({ status: 'PUBLISHED', visibility: 'PUBLIC', publishedVersion: 6 })),
    reply(409, { error: 'published_changed', publishedVersion: 7 }), reply(200, detail({ status: 'PUBLISHED', publishedVersion: 7 })));
  const store = storeWith(fetchImpl);
  const ref = { kind: 'spring', id: 12 };
  await store.setVisibility(ref, { visibility: 'PUBLIC', until: 99, publishedVersion: 6 });
  assert.deepEqual(JSON.parse(calls[0].init.body), { visibility: 'PUBLIC', until: 99, publishedVersion: 6 });
  await assert.rejects(store.setVisibility(ref, { visibility: 'PUBLIC', publishedVersion: 6 }), (error) => {
    assert.equal(error.name, 'ApiError', 'not a draft version conflict: no Keep mine for an approval');
    assert.equal(error.status, 409);
    assert.equal(error.error, 'published_changed');
    return true;
  });
  await store.setVisibility(ref, { visibility: 'SIGNED_IN', publishedVersion: null });
  assert.deepEqual(JSON.parse(calls[2].init.body), { visibility: 'SIGNED_IN' }, 'no version unless it is a whole number');
});

test('slugs follow the registry rule, so a widened rule reaches every published route', async () => {
  const { calls, fetchImpl } = server((url) => {
    if (url.endsWith('/published')) return Promise.resolve(reply(200, [{ slug: 'team_3', title: 'Team 3' }, { slug: '..' }]));
    if (url.endsWith('/message-owner')) return Promise.resolve(reply(200, { conversationId: 4 }));
    if (url.includes('/members/')) return Promise.resolve(reply(200, []));
    return Promise.resolve(reply(200, { slug: 'team_3', spec: SPEC }));
  });
  const wide = storeWith(fetchImpl, { registry: { limits: { slug_pattern: '^[a-z0-9._-]{2,64}$' }, text: {} } });
  assert.equal((await wide.published('team_3')).slug, 'team_3');
  await wide.messageOwner('team_3');
  await wide.members('team_3', 'b-000004');
  assert.deepEqual((await wide.gallery()).map((item) => item.slug), ['team_3'], 'a dot segment is never a slug');
  await assert.rejects(wide.published('..'), { name: 'NotFoundError' });
  const sent = calls.length;
  await assert.rejects(storeWith(fetchImpl).published('team_3'), { name: 'NotFoundError' }, 'the default rule has no _');
  await assert.rejects(storeWith(fetchImpl, { registry: null }).published('flood-watch'), { name: 'NotFoundError' }, 'no rule: nothing is sent');
  assert.equal(calls.length, sent);
});

test('class pages, slugs, groups and the published routes', async () => {
  const view = {
    slug: 'flood-watch', title: 'Flood Watch', description: '', byline: 'Beasts', course: 'csp', image: '', publishedAt: 5,
    publishedVersion: 3, visibility: 'PUBLIC', spec: SPEC, canEdit: true, pageId: 12, uid: 'leak', email: 'leak@x',
    madeBy: { owner: 'Ada', group: 'Beasts', ownerUid: 'leak' }, groups: { 7: { name: 'Beasts', viewerIsMember: true }, x: { name: 'bad' } },
    viewer: { signedIn: true, name: 'Ada' },
  };
  const { calls, fetchImpl } = server((url) => {
    if (url.includes('/pages?')) return Promise.resolve(reply(200, [summary(), { id: 'bad' }]));
    if (url.includes('/slug-available')) return Promise.resolve(reply(200, { slug: 'flood-watch', available: false, reason: 'taken' }));
    if (url.endsWith('/my-groups')) return Promise.resolve(reply(200, [{ id: 7, name: 'Beasts' }, { id: 'x', name: 'Bad' }, { id: 8 }]));
    if (url.endsWith('/message-owner')) return Promise.resolve(reply(200, { conversationId: 44 }));
    if (url.includes('/members/')) return Promise.resolve(reply(200, [{ name: 'Ada', uid: 'leak' }, { name: '  ' }, 'x']));
    if (url.includes('/published?') || url.endsWith('/published')) return Promise.resolve(reply(200, [{ slug: 'flood-watch', title: 'Flood', extra: 1 }, { slug: 'Bad Slug' }, null]));
    return Promise.resolve(reply(200, view));
  });
  const store = storeWith(fetchImpl);
  assert.equal((await store.list({ scope: 'class', course: 'csp' })).length, 1);
  assert.equal((await store.classPages({ course: 'c s' })).length, 1);
  assert.deepEqual(await store.slugAvailable('flood-watch'), { slug: 'flood-watch', available: false, reason: 'taken' });
  assert.deepEqual(await store.myGroups(), [{ id: 7, name: 'Beasts' }]);
  assert.deepEqual(await store.messageOwner('flood-watch'), { conversationId: 44 });
  assert.deepEqual(await store.members('flood-watch', 'b-000004'), [{ name: 'Ada' }]);
  assert.deepEqual(await store.gallery({ course: 'csp' }), [{ slug: 'flood-watch', title: 'Flood', description: '', byline: '', course: '', image: '', publishedAt: null, visibility: 'SIGNED_IN' }]);
  await store.gallery();
  const published = await store.published('flood-watch');
  assert.equal(published.uid, undefined, 'only the PublishedView fields pass');
  assert.equal(published.email, undefined);
  assert.deepEqual(published.madeBy, { owner: 'Ada', group: 'Beasts' });
  assert.deepEqual(published.groups, { 7: { name: 'Beasts', viewerIsMember: true } });
  assert.equal(published.pageId, 12);
  assert.deepEqual(calls.map(({ url, init }) => [init.method, url.slice(JAVA.length)]), [
    ['GET', '/api/ui-builder/pages?scope=class&course=csp'],
    ['GET', '/api/ui-builder/pages?scope=class&course=c%20s'],
    ['GET', '/api/ui-builder/slug-available?slug=flood-watch'],
    ['GET', '/api/ui-builder/my-groups'],
    ['POST', '/api/ui-builder/published/flood-watch/message-owner'],
    ['GET', '/api/ui-builder/published/flood-watch/members/b-000004'],
    ['GET', '/api/ui-builder/published?course=csp'],
    ['GET', '/api/ui-builder/published'],
    ['GET', '/api/ui-builder/published/flood-watch'],
  ]);
  // Malformed slugs and block ids are refused before any request.
  const before = calls.length;
  for (const slug of ['../pages', 'Flood', '', 'a/b', null]) await assert.rejects(store.published(slug), { name: 'NotFoundError' });
  await assert.rejects(store.members('flood-watch', '../x'), { name: 'NotFoundError' });
  await assert.rejects(store.messageOwner('x y'), { name: 'NotFoundError' });
  await assert.rejects(store.open({ kind: 'spring', id: 0 }), { name: 'NotFoundError' });
  assert.equal(calls.length, before);
});

test('the constructor wants config.js values', () => {
  assert.throws(() => new SpringPageStore({ fetchOptions: FETCH_OPTIONS }), TypeError);
  assert.throws(() => new SpringPageStore({ javaURI: 'javascript:alert(1)', fetchOptions: FETCH_OPTIONS }), TypeError);
  assert.throws(() => new SpringPageStore({ javaURI: JAVA }), TypeError);
  assert.throws(() => new SpringPageStore({ javaURI: JAVA, fetchOptions: FETCH_OPTIONS, timeoutMs: 0 }), TypeError);
});
