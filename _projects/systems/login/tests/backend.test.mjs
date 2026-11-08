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

test('request sends credentials and JSON to the base URL', async () => {
  const calls = answer(200, '{"ok":true}');
  const flask = new Backend('http://f', { credentials: 'include', headers: { 'Content-Type': 'application/json' } });
  assert.deepEqual(await flask.request('/api/user', { method: 'PUT', body: { email: 'a@b.c' } }), { ok: true });
  assert.equal(calls[0].url, 'http://f/api/user');
  assert.equal(calls[0].options.credentials, 'include');
  assert.equal(calls[0].options.method, 'PUT');
  assert.equal(calls[0].options.body, '{"email":"a@b.c"}');
});

test('a GET sends no body', async () => {
  const calls = answer(200, '{}');
  await new Backend('http://f', {}).request('/api/id');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal('body' in calls[0].options, false);
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

test('createBackends leaves spring null when Spring is off', () => {
  const off = createBackends({ pythonURI: 'http://f', javaURI: 'http://s', fetchOptions: {}, springEnabled: false });
  assert.ok(off.flask instanceof Backend);
  assert.equal(off.spring, null);
  const on = createBackends({ pythonURI: 'http://f', javaURI: 'http://s', fetchOptions: {}, springEnabled: true });
  assert.equal(on.spring.baseUrl, 'http://s');
});
