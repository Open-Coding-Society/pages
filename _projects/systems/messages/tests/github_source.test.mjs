// GitHubSource: GitHub's public API read from the browser, with a 10-minute copy, the
// network's hourly limit, and gists read through Spring.
import assert from 'node:assert/strict';
import test from 'node:test';

const { GitHubSource } = await import('../js/github-source.js');

function memoryStorage() {
  const store = new Map();
  return {
    store,
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key),
    key: index => [...store.keys()][index] ?? null,
    get length() { return store.size; },
  };
}

const NOW = Date.parse('2026-11-22T19:11:00Z');
const ok = body => ({ status: 200, body, headers: {} });

function makeSource(answers, { storage = memoryStorage(), clock = { now: NOW }, readGist = null } = {}) {
  const asked = [];
  const source = new GitHubSource({
    fetchJson: async path => {
      asked.push(path);
      const answer = answers[path];
      if (answer instanceof Error) throw answer;
      return answer || { status: 404, body: { message: 'Not Found' }, headers: {} };
    },
    readGist,
    storage,
    now: () => clock.now,
  });
  return { source, asked };
}

test('an item is asked for once, then read from this page and from storage for ten minutes', async () => {
  const storage = memoryStorage();
  const answers = { '/repos/a/b': ok({ full_name: 'a/b' }) };
  const first = makeSource(answers, { storage });

  assert.deepEqual(await first.source.load('/repos/a/b'), { status: 200, body: { full_name: 'a/b' } });
  await first.source.load('/repos/a/b');
  assert.equal(first.asked.length, 1);

  const nextPage = makeSource(answers, { storage });
  assert.deepEqual(await nextPage.source.load('/repos/a/b'), { status: 200, body: { full_name: 'a/b' } });
  assert.equal(nextPage.asked.length, 0, 'read from storage');
});

test('after ten minutes an item is asked for again', async () => {
  const storage = memoryStorage();
  const clock = { now: NOW };
  const answers = { '/repos/a/b': ok({ full_name: 'a/b' }) };
  await makeSource(answers, { storage, clock }).source.load('/repos/a/b');

  clock.now = NOW + 11 * 60000;
  const later = makeSource(answers, { storage, clock });
  await later.source.load('/repos/a/b');

  assert.equal(later.asked.length, 1);
});

test("after GitHub's hourly limit, nothing more is asked until its reset time", async () => {
  const reset = (NOW + 30 * 60000) / 1000;
  const limited = { status: 403, body: { message: 'API rate limit exceeded' }, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } };
  const clock = { now: NOW };
  const { source, asked } = makeSource({ '/repos/a/b/issues/1': limited, '/repos/a/b/issues/2': ok({ title: 'x' }) }, { clock });

  assert.deepEqual(await source.load('/repos/a/b/issues/1'), { status: 'limited' });
  assert.deepEqual(await source.load('/repos/a/b/issues/2'), { status: 'limited' });
  assert.equal(asked.length, 1);
  assert.equal(source.limitedUntil(), reset * 1000);

  clock.now = reset * 1000 + 1;
  assert.equal((await source.load('/repos/a/b/issues/2')).status, 200);
});

test('a 429, or a 403 whose message says rate limit, counts as the limit', async () => {
  const tooMany = makeSource({ '/a': { status: 429, body: null, headers: {} } });
  const byMessage = makeSource({ '/b': { status: 403, body: { message: 'API rate limit exceeded for 1.2.3.4.' }, headers: {} } });

  assert.deepEqual(await tooMany.source.load('/a'), { status: 'limited' });
  assert.deepEqual(await byMessage.source.load('/b'), { status: 'limited' });
});

test('a 404 is kept as missing, and a request that failed is asked for again', async () => {
  const { source, asked } = makeSource({ '/repos/a/private': { status: 404, body: { message: 'Not Found' }, headers: {} }, '/repos/a/down': new Error('offline') });

  assert.equal((await source.load('/repos/a/private')).status, 404);
  assert.deepEqual(await source.load('/repos/a/down'), { status: 'failed' });
  await source.load('/repos/a/down');

  assert.equal(asked.filter(path => path === '/repos/a/down').length, 2);
});

test('a gist is read through Spring, never from GitHub, and without Spring it is not read', async () => {
  const read = [];
  const withSpring = makeSource({}, { readGist: async id => { read.push(id); return { description: 'helper' }; } });
  const flaskOnly = makeSource({});

  assert.equal(withSpring.source.canReadGists, true);
  assert.deepEqual(await withSpring.source.gist('aa11bb'), { description: 'helper' });
  assert.deepEqual(read, ['aa11bb']);
  assert.equal(withSpring.asked.length, 0);
  assert.equal(flaskOnly.source.canReadGists, false);
  await assert.rejects(flaskOnly.source.gist('aa11bb'));
});

test('on a page left open, an item is asked for again after ten minutes too', async () => {
  const clock = { now: NOW };
  const { source, asked } = makeSource({ '/repos/a/b': ok({ full_name: 'a/b' }) }, { clock });
  await source.load('/repos/a/b');
  clock.now = NOW + 9 * 60000;
  await source.load('/repos/a/b');
  assert.equal(asked.length, 1, 'kept for ten minutes');
  clock.now = NOW + 11 * 60000;
  await source.load('/repos/a/b');
  assert.equal(asked.length, 2);
});

test('an answer GitHub could not give (a 502) is not kept: the next card asks again', async () => {
  const storage = memoryStorage();
  const answers = { '/repos/a/b': { status: 502, body: null, headers: {} } };
  const { source, asked } = makeSource(answers, { storage });
  assert.equal((await source.load('/repos/a/b')).status, 502);
  answers['/repos/a/b'] = ok({ full_name: 'a/b' });
  assert.equal((await source.load('/repos/a/b')).status, 200);
  assert.equal(asked.length, 2);
});

test('keeping a copy removes copies older than ten minutes, and nothing else in storage', async () => {
  const storage = memoryStorage();
  storage.setItem('ocs-github:/repos/old/one', JSON.stringify({ at: NOW - 11 * 60000, status: 200, body: {} }));
  storage.setItem('ocs-github:/repos/new/one', JSON.stringify({ at: NOW - 60000, status: 200, body: {} }));
  storage.setItem('ocs-github:limited-until', String(NOW - 1000));
  storage.setItem('runner-code', 'print(1)');
  const { source } = makeSource({ '/repos/a/b': ok({}) }, { storage });
  await source.load('/repos/a/b');
  assert.deepEqual([...storage.store.keys()].sort(), ['ocs-github:/repos/a/b', 'ocs-github:/repos/new/one', 'runner-code']);
});

test("a secondary limit waits for its Retry-After, even when the hourly reset has passed", async () => {
  const clock = { now: NOW };
  const secondary = {
    status: 403, body: { message: 'You have exceeded a secondary rate limit.' },
    headers: { 'retry-after': '60', 'x-ratelimit-remaining': '12', 'x-ratelimit-reset': String((NOW - 5 * 60000) / 1000) },
  };
  const { source, asked } = makeSource({ '/a': secondary, '/b': ok({}) }, { clock });
  assert.deepEqual(await source.load('/a'), { status: 'limited' });
  assert.equal(source.limitedUntil(), NOW + 60000);
  assert.deepEqual(await source.load('/b'), { status: 'limited' });
  assert.equal(asked.length, 1);
});

test('without storage (a private window), the limit is still kept on the page', async () => {
  const reset = (NOW + 30 * 60000) / 1000;
  const limited = { status: 429, body: null, headers: { 'x-ratelimit-reset': String(reset) } };
  const { source, asked } = makeSource({ '/a': limited, '/b': ok({}) }, { storage: null });
  assert.deepEqual(await source.load('/a'), { status: 'limited' });
  assert.deepEqual(await source.load('/b'), { status: 'limited' });
  assert.equal(asked.length, 1);
});
