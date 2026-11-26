// The reaction calls in messages-api.js: the method and path each one sends to Spring.
import assert from 'node:assert/strict';
import test from 'node:test';

const { createMessagesApi } = await import('../js/messages-api.js');

// Records each fetch, and answers the way Spring's PUT and DELETE do.
function recordFetch(t) {
  const calls = [];
  const real = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push([options.method, url, options.body]);
    return { ok: true, status: 200, text: async () => '{"messageId":"42","reactions":[]}' };
  };
  t.after(() => { globalThis.fetch = real; });
  return calls;
}

test('the reaction calls use the right method and path', async t => {
  const calls = recordFetch(t);
  const api = createMessagesApi({
    javaURI: 'http://spring.test', pythonURI: 'http://flask.test', fetchOptions: { credentials: 'include' },
  });
  const uuid = '3f2c8a8e-5b1d-4c7e-9a52-8f0e6d4b2a10';

  await api.dmReactions(7);
  const saved = await api.setDmReaction(7, 42, 'like', true);
  await api.setDmReaction(7, 42, 'like', false);
  await api.groupReactions(3);
  await api.setGroupReaction(3, uuid, 'love', true);
  await api.setGroupReaction(3, 'a b', 'love', false);

  assert.deepEqual(saved, { messageId: '42', reactions: [] });
  assert.deepEqual(calls, [
    ['GET', 'http://spring.test/api/dm/conversations/7/reactions', undefined],
    ['PUT', 'http://spring.test/api/dm/conversations/7/messages/42/reactions/like', undefined],
    ['DELETE', 'http://spring.test/api/dm/conversations/7/messages/42/reactions/like', undefined],
    ['GET', 'http://spring.test/api/groups/chat/3/reactions', undefined],
    ['PUT', `http://spring.test/api/groups/chat/3/messages/${uuid}/reactions/love`, undefined],
    ['DELETE', 'http://spring.test/api/groups/chat/3/messages/a%20b/reactions/love', undefined],
  ]);
});
