import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CallsApi, CallsApiError } from '../js/calls-api.js';
import { CONFIG, answer, scriptedFetch } from './helpers.mjs';

const ROOM = { id: 7, state: 'IDLE', title: 'Team Turing', contextType: 'GROUP', contextKey: '12', purpose: 'meeting', participantCount: 0 };

function apiWith(route) {
  const scripted = scriptedFetch(CONFIG.javaURI, route);
  return { api: new CallsApi({ javaURI: CONFIG.javaURI, fetchOptions: CONFIG.fetchOptions, fetch: scripted.fetch }), calls: scripted.calls };
}

test('opening a room posts the place with the sign-in cookie and the X-Origin header', async () => {
  const { api, calls } = apiWith(() => answer(200, ROOM));
  const room = await api.open({ contextType: 'GROUP', contextKey: '12', purpose: 'standup' });
  assert.deepEqual(room, ROOM);
  const [call] = calls;
  assert.equal(call.url, 'http://localhost:8585/api/calls');
  assert.equal(call.method, 'POST');
  assert.deepEqual(call.body, { contextType: 'GROUP', contextKey: '12', purpose: 'standup' });
  assert.equal(call.init.credentials, 'include');
  assert.equal(call.init.headers['X-Origin'], 'client');
  assert.equal(call.init.headers['Content-Type'], 'application/json');
});

test('a link without a purpose leaves it to Spring', async () => {
  const { api, calls } = apiWith(() => answer(200, ROOM));
  await api.open({ contextType: 'DM', contextKey: '34', purpose: null });
  assert.deepEqual(calls[0].body, { contextType: 'DM', contextKey: '34' });
});

test('reading a room and asking for a token use its id', async () => {
  const { api, calls } = apiWith((method, path) => (path.endsWith('/token')
    ? answer(200, { url: 'ws://localhost:7880', token: 'jwt', expiresIn: 600, canModerate: true })
    : answer(200, ROOM)));
  await api.get(7);
  const token = await api.token(7);
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), ['GET /api/calls/7', 'POST /api/calls/7/token']);
  assert.equal(calls[0].init.body, undefined);
  assert.deepEqual(token, { url: 'ws://localhost:7880', token: 'jwt', expiresIn: 600, canModerate: true });
});

test('a refusal keeps Spring\'s reason and status', async () => {
  const { api } = apiWith(() => answer(403, { reason: 'WAITING_FOR_SUPERVISOR' }));
  await assert.rejects(api.token(7), (error) => error instanceof CallsApiError
    && error.status === 403 && error.reason === 'WAITING_FOR_SUPERVISOR' && error.retryAfter === null);
});

test('a 503 keeps how many seconds Spring says to wait', async () => {
  const { api } = apiWith(() => answer(503, { reason: 'MEDIA_UNAVAILABLE' }, { 'Retry-After': '30' }));
  await assert.rejects(api.token(7), (error) => error.status === 503 && error.reason === 'MEDIA_UNAVAILABLE' && error.retryAfter === 30);
});

test('an answer that is not JSON still fails with its status', async () => {
  const { api } = apiWith(() => answer(502, '<html>Bad gateway</html>'));
  await assert.rejects(api.get(7), (error) => error.status === 502 && error.reason === null);
});

test('no answer at all is status 0', async () => {
  const { api } = apiWith(() => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(api.get(7), (error) => error instanceof CallsApiError && error.status === 0 && error.reason === 'NETWORK');
});

test('moderation posts to the participant\'s route and resolves on 204', async () => {
  const { api, calls } = apiWith(() => answer(204));
  assert.equal(await api.pause(7, 'Ab_-9'), undefined);
  await api.resume(7, 'Ab_-9');
  await api.remove(7, 'Ab_-9');
  await api.end(7);
  assert.deepEqual(calls.map((c) => `${c.method} ${c.path}`), [
    'POST /api/calls/7/participants/Ab_-9/pause',
    'POST /api/calls/7/participants/Ab_-9/resume',
    'POST /api/calls/7/participants/Ab_-9/remove',
    'POST /api/calls/7/end',
  ]);
});

test('an identity outside Spring\'s pattern never reaches the network', async () => {
  const { api, calls } = apiWith(() => answer(204));
  for (const identity of ['../end', 'a/b', '', 'x'.repeat(65), 'a b']) {
    assert.throws(() => api.pause(7, identity), TypeError, identity);
  }
  assert.equal(calls.length, 0);
});

test('ids must be positive whole numbers', async () => {
  const { api, calls } = apiWith(() => answer(200, ROOM));
  for (const id of ['7', 0, -1, 1.5, NaN, null]) assert.throws(() => api.get(id), TypeError, String(id));
  assert.equal(calls.length, 0);
});

test('the live list asks about one course', async () => {
  const { api, calls } = apiWith(() => answer(200, [{ id: 7, title: 'CSA', contextType: 'COURSE', count: 2, oneOnOne: false }]));
  const live = await api.live('csa');
  assert.equal(calls[0].path, '/api/calls/live?course=csa');
  assert.equal(live[0].count, 2);
});

test('the request options are copied, never changed', async () => {
  const options = structuredClone(CONFIG.fetchOptions);
  const scripted = scriptedFetch(CONFIG.javaURI, () => answer(200, ROOM));
  const api = new CallsApi({ javaURI: CONFIG.javaURI, fetchOptions: options, fetch: scripted.fetch });
  await api.open({ contextType: 'GROUP', contextKey: '12' });
  assert.deepEqual(options, CONFIG.fetchOptions);
});
