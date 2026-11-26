import assert from 'node:assert/strict';
import test from 'node:test';

// A refusal from Spring carries a reason (MentorRules answers 403 with {error, reason}). The API passes it
// on with the status, so the page can say why instead of "try again".
const { createMessagesApi } = await import('../js/messages-api.js');

function answering(status, body) {
  globalThis.fetch = async () => ({ ok: status >= 200 && status < 300, status, text: async () => body });
  return createMessagesApi({ javaURI: 'http://spring', pythonURI: 'http://flask', fetchOptions: {} });
}

test('a refusal carries the reason Spring gave', async () => {
  const api = answering(403, JSON.stringify({ error: 'Mentors cannot use direct messages', reason: 'mentor_no_direct_messages' }));
  await assert.rejects(api.sendDm(4, 'hi'), error => error.status === 403 && error.reason === 'mentor_no_direct_messages');
});

test('a failure without a readable reason still carries its status', async () => {
  const api = answering(500, 'Internal Server Error');
  await assert.rejects(api.sendDm(4, 'hi'), error => error.status === 500 && error.reason === '');
});

test('an upload Spring refuses carries its reason too', async () => {
  const xhr = {
    upload: {}, open() {}, setRequestHeader() {},
    send() {
      this.status = 403;
      this.responseText = JSON.stringify({ error: 'Not in this group', reason: 'mentor_not_in_group' });
      this.onload();
    },
  };
  const api = createMessagesApi({ javaURI: 'http://spring', pythonURI: 'http://flask', fetchOptions: {}, createRequest: () => xhr });
  await assert.rejects(api.uploadGroupFileWithProgress(7, 'notes.txt', 'aGk='),
    error => error.status === 403 && error.reason === 'mentor_not_in_group');
});

test('a failure whose body can\'t be read still carries its status', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 502, text: async () => { throw new Error('the body stream broke'); } });
  const api = createMessagesApi({ javaURI: 'http://spring', pythonURI: 'http://flask', fetchOptions: {} });
  await assert.rejects(api.sendDm(4, 'hi'), error => error.status === 502 && error.reason === '');
});
