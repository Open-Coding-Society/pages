import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { Backend, BackendError, createBackends } from '../js/backend.js';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

// A fake fetch that answers every request with one status and body text, and records the request.
function answer(status, text = '') {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: status >= 200 && status < 300, status, text: async () => text };
  };
  return calls;
}

// The site's fetch options as config.js exports them, with GET as the default every request overrides.
const siteFetchOptions = {
  method: 'GET', mode: 'cors', cache: 'default', credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
};

test('request sends credentials and JSON to the base URL', async () => {
  const calls = answer(200, '{"ok":true}');
  const flask = new Backend('http://f', siteFetchOptions);
  assert.deepEqual(await flask.request('/api/user', { method: 'PUT', body: { email: 'a@b.c' } }), { ok: true });
  assert.equal(calls[0].url, 'http://f/api/user');
  assert.equal(calls[0].options.credentials, 'include');
  assert.deepEqual(calls[0].options.headers, siteFetchOptions.headers);
  assert.equal(calls[0].options.method, 'PUT');
  assert.equal(calls[0].options.body, '{"email":"a@b.c"}');
});

test('a request with no body sends none, and keeps its own method', async () => {
  const calls = answer(200, '{}');
  const flask = new Backend('http://f', siteFetchOptions);
  await flask.request('/api/id');
  await flask.request('/api/authenticate', { method: 'DELETE' });
  assert.deepEqual(calls.map((call) => call.options.method), ['GET', 'DELETE']);
  assert.equal(calls.some((call) => 'body' in call.options), false);
});

test('an error answer throws BackendError with the status, request and parsed body', async () => {
  answer(409, '{"error":"uid taken"}');
  await assert.rejects(new Backend('http://s', {}).request('/api/person/create', { method: 'POST', body: {} }), (error) => {
    assert.ok(error instanceof BackendError);
    assert.equal(error.status, 409);
    assert.equal(error.method, 'POST');
    assert.equal(error.path, '/api/person/create');
    assert.deepEqual(error.body, { error: 'uid taken' });
    return true;
  });
});

test('an empty body resolves null and a text body resolves its text', async () => {
  answer(200, '');
  assert.equal(await new Backend('http://f', {}).request('/api/authenticate', { method: 'DELETE' }), null);
  answer(200, 'Authenticated');
  assert.equal(await new Backend('http://s', {}).request('/authenticate', { method: 'POST', body: {} }), 'Authenticated');
});

test('an unreachable server throws status 0 and keeps the network error', async () => {
  const offline = new TypeError('Failed to fetch');
  globalThis.fetch = async () => { throw offline; };
  await assert.rejects(new Backend('http://f', {}).request('/api/id'), (error) => {
    assert.ok(error instanceof BackendError);
    assert.equal(error.status, 0);
    assert.equal(error.cause, offline);
    return true;
  });
});

test('a connection that drops while the answer is read throws status 0 and keeps the error', async () => {
  for (const status of [200, 401]) {
    const dropped = new TypeError('network error');
    globalThis.fetch = async () => ({ ok: status < 300, status, text: async () => { throw dropped; } });
    await assert.rejects(new Backend('http://f', {}).request('/api/authenticate', { method: 'POST', body: {} }), (error) => {
      assert.ok(error instanceof BackendError, `HTTP ${status}: ${error}`);
      assert.equal(error.status, 0);
      assert.equal(error.cause, dropped);
      return true;
    });
  }
});

test('createBackends leaves spring null when Spring is off', () => {
  const off = createBackends({ pythonURI: 'http://f', javaURI: 'http://s', fetchOptions: {}, springEnabled: false });
  assert.ok(off.flask instanceof Backend);
  assert.equal(off.flask.baseUrl, 'http://f');
  assert.equal(off.spring, null);
  const on = createBackends({ pythonURI: 'http://f', javaURI: 'http://s', fetchOptions: {}, springEnabled: true });
  assert.equal(on.flask.baseUrl, 'http://f');
  assert.equal(on.spring.baseUrl, 'http://s');
});
