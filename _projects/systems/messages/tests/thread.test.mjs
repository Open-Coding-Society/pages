// The conversation pane on its own, with a stub API and socket: what /dm relies on stays
// as it was, and what an embed adds (no callbacks, read-only, its own wording, destroy)
// works without /dm around it.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { createThread } = await import('../js/thread.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };

function stubRichText() {
  const composers = [];
  return {
    composers,
    renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
    createRichComposer(options) {
      let html = '';
      const composer = {
        options,
        element: document.createElement('div'),
        destroyed: false,
        focus() {},
        clear() { html = ''; },
        setHTML(value) { html = value; },
        getHTML: () => html,
        isEmpty: () => html === '',
        isOverLimit: () => false,
        setEnabled() {},
        destroy() { composer.destroyed = true; },
      };
      composers.push(composer);
      return composer;
    },
  };
}

function stubSocket() {
  const socket = {
    followed: null,
    handler: null,
    follow(topic, handler) { socket.followed = topic; socket.handler = handler; },
    unfollow() { socket.followed = null; socket.handler = null; },
    isConnected: () => true,
  };
  return socket;
}

// Each list call resolves when the test says, so a test can hold a history back.
function stubApi({ groupMessages = [], dmMessages = [] } = {}) {
  const calls = [];
  return {
    calls,
    groupMessages: async id => { calls.push(['groupMessages', id]); return groupMessages; },
    dmMessages: async id => { calls.push(['dmMessages', id]); return dmMessages; },
    sendGroupMessage: async (id, html) => { calls.push(['sendGroupMessage', id, html]); },
    markDmRead: async id => { calls.push(['markDmRead', id]); },
    groupFiles: async () => [],
  };
}

function paneElements({ readOnly = false } = {}) {
  const make = tag => document.createElement(tag);
  const elements = { title: make('h2'), subtitle: make('small'), messages: make('div'), formStatus: make('p') };
  if (!readOnly) {
    elements.form = make('form');
    elements.cancelEdit = make('button');
    elements.send = make('button');
    elements.form.append(elements.cancelEdit, elements.send);
  }
  return elements;
}

function makeThread(options = {}) {
  const elements = paneElements(options);
  const richText = stubRichText();
  const socket = stubSocket();
  const api = options.api || stubApi();
  const thread = createThread({ elements, api, socket, richText, me, ...options });
  return { thread, elements, richText, socket, api };
}

const groupFrame = (messageId, sender, message) => ({ context: 'sendMessageServer', messageId, sender, message, date: '2026-10-20T10:00:00Z' });

test('a pane made without texts says what /dm says', async () => {
  const { thread, elements } = makeThread();
  assert.equal(elements.title.textContent, 'Pick a conversation');
  assert.match(elements.messages.textContent, /Or start a new chat, or find a group to join\./);
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  assert.match(elements.messages.textContent, /Loading messages…/);
  await settle();
  assert.match(elements.messages.textContent, /No messages yet/);
  assert.match(elements.messages.textContent, /Say hi to your group\./);
  assert.match(elements.send.textContent, /Send/);
});

test('a pane needs no onDmRead, onGroupRead or onFileShared', async () => {
  const api = stubApi({ dmMessages: [{ id: 1, senderUid: 'grace', senderName: 'Grace', body: 'hi', sentAt: '2026-10-20T10:00:00Z' }] });
  const { thread, socket, elements } = makeThread({ api });
  thread.open('dm', 5, { title: 'Grace', subtitle: 'Direct message' });
  await settle();
  assert.deepEqual(api.calls.at(-1), ['markDmRead', 5]);

  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  socket.handler({ context: 'sendFileServer', sender: 'Grace', filename: 'plan.pdf' });
  socket.handler(groupFrame('m9', 'Grace Hopper', 'new here'));
  assert.match(elements.messages.textContent, /Grace shared a file:/);
  assert.match(elements.messages.textContent, /new here/);
});

test('emptyState says what an open conversation with no messages shows', async () => {
  const { thread, elements } = makeThread({ emptyState: { title: 'Nothing yet', hint: 'Start the team chat.' } });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  assert.match(elements.messages.textContent, /Nothing yet/);
  assert.match(elements.messages.textContent, /Start the team chat\./);
  assert.throws(() => makeThread({ emptyState: 'Nothing yet' }), TypeError);
});

test('texts reword the pane', async t => {
  const warn = t.mock.method(console, 'warn', () => {});
  const api = stubApi();
  api.groupMessages = async () => { throw new Error('HTTP 500'); };
  const { thread, elements, richText } = makeThread({
    api, texts: { placeholder: 'Schreib…', send: 'Senden', loadFailedTitle: 'Laden ging nicht', loadFailedHint: 'Später nochmal.' },
  });
  assert.equal(richText.composers[0].options.placeholder, 'Schreib…');
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  assert.equal(warn.mock.callCount(), 1);
  assert.match(elements.messages.textContent, /Laden ging nicht/);
  assert.match(elements.messages.textContent, /Später nochmal\./);
  assert.match(elements.send.textContent, /Senden/);
});

test('a read-only pane has no composer, and your messages have no edit or delete', async () => {
  const api = stubApi({ groupMessages: [{ id: 'm1', author: 'Ada Lovelace', message: 'mine', date: '2026-10-20T10:00:00Z' }] });
  const { thread, elements, richText } = makeThread({ api, readOnly: true });
  assert.equal(richText.composers.length, 0);
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  assert.match(elements.messages.textContent, /mine/);
  assert.ok(!elements.messages.querySelector('.chat-msg-actions'), 'no .chat-msg-actions is built');
});

test('a message sent from the pane goes to the open group over REST', async () => {
  const { thread, elements, richText, api } = makeThread();
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  richText.composers[0].setHTML('hello team');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(api.calls.at(-1), ['sendGroupMessage', 7, 'hello team']);
});

test('your message shows from the send answer when the socket misses its echo', async () => {
  const api = stubApi();
  api.sendGroupMessage = async (id, html) => {
    api.calls.push(['sendGroupMessage', id, html]);
    return [{ id: 'm9', author: 'Ada Lovelace', message: html, date: '2026-10-28T19:00:00Z' }];
  };
  const { thread, elements, richText } = makeThread({ api });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  richText.composers[0].setHTML('first hello');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.match(elements.messages.textContent, /first hello/);
  assert.equal(elements.messages.querySelectorAll('.chat-msg').length, 1);
});

test('destroy stops following, takes back the document listener and the composer, and drops a history still loading', async () => {
  let release;
  const api = stubApi();
  api.groupMessages = () => new Promise(resolve => { release = () => resolve([{ id: 'm1', author: 'Grace Hopper', message: 'late', date: null }]); });
  // Panes from earlier tests are still listening, so count from here.
  const before = document.listenerCount();
  const { thread, elements, richText, socket } = makeThread({ api });
  assert.equal(document.listenerCount(), before + 1);
  thread.open('group', 7, { title: '', subtitle: '' });
  assert.equal(socket.followed, '/topic/group/7');

  thread.destroy();
  assert.equal(socket.followed, null);
  assert.equal(document.listenerCount(), before);
  assert.equal(richText.composers[0].destroyed, true);
  assert.equal(thread.current(), null);

  release();
  await settle();
  assert.doesNotMatch(elements.messages.textContent, /late/);
});

test('a send still saving when the pane is destroyed fetches nothing afterwards', async () => {
  let release;
  const api = stubApi();
  api.sendGroupMessage = () => new Promise(resolve => { release = resolve; });
  const { thread, elements, richText, socket } = makeThread({ api });
  socket.isConnected = () => false; // offline, so a finished send would fetch the conversation
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  const loadsBefore = api.calls.filter(([name]) => name === 'groupMessages').length;
  richText.composers[0].setHTML('last words');
  elements.form.dispatchEvent(fakeEvent('submit'));
  thread.destroy();
  release();
  await settle();
  assert.equal(api.calls.filter(([name]) => name === 'groupMessages').length, loadsBefore);
});
