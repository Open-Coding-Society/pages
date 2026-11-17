// Replies, pasted images and the conversation search on /dm: a message's Reply button
// arms the composer with a quote, the reply goes out with a [[reply:...]] marker and
// shows that quote, an edit keeps it, an image pasted into the composer waits for Send,
// and "Find a conversation" narrows the sidebar.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const replyHelpers = await import('../../../../assets/js/chat/chat-reply.js');
const { createThread } = await import('../js/thread.js');
const { createMessageLog } = await import('../js/message-log.js');
const { matchesConversationSearch } = await import('../js/messages-model.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };

// The real reply helpers, with a composer and renderer that keep things as text.
function richTextWithReplies() {
  const composers = [];
  return {
    ...replyHelpers,
    composers,
    renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
    createRichComposer(options) {
      let html = '';
      const composer = {
        options,
        element: document.createElement('div'),
        focus() {},
        clear() { html = ''; },
        setHTML(value) { html = value; },
        type(value) { html = value; },
        getHTML: () => html,
        isEmpty: () => html === '',
        isOverLimit: () => false,
        setEnabled() {},
        destroy() {},
      };
      composers.push(composer);
      return composer;
    },
  };
}

function stubApi(dmMessages) {
  const calls = [];
  return {
    calls,
    dmMessages: async () => dmMessages,
    sendDm: async (id, body, image) => { calls.push(['sendDm', id, body, image]); return null; },
    editDm: async (id, messageId, body) => { calls.push(['editDm', id, messageId, body]); },
    markDmRead: async () => {},
  };
}

function makePane(dmMessages, { withImageInput = false } = {}) {
  const make = tag => document.createElement(tag);
  const pane = make('section');
  const elements = {
    title: make('h2'), subtitle: make('small'), messages: make('div'), formStatus: make('p'),
    form: make('form'), cancelEdit: make('button'), send: make('button'),
  };
  if (withImageInput) elements.imageInput = make('input');
  elements.form.append(elements.cancelEdit, elements.send);
  pane.append(elements.messages, elements.form);
  const richText = richTextWithReplies();
  const api = stubApi(dmMessages);
  const socket = { follow() {}, unfollow() {}, isConnected: () => true };
  const thread = createThread({ elements, api, socket, richText, me });
  return { thread, elements, richText, api, pane, composer: richText.composers[0] };
}

const dm = (id, senderUid, senderName, body) => ({ id, senderUid, senderName, body, sentAt: '2026-11-16T10:00:00Z' });
const row = (elements, key) => elements.messages.querySelector(`[data-key="${key}"]`);
const replyButton = (elements, key) => row(elements, key).querySelector('[aria-label="Reply"]');

test('every saved message has Reply; only your own have edit and delete', async () => {
  const { thread, elements } = makePane([dm(10, 'grace', 'Grace Hopper', 'hi'), dm(11, 'ada', 'Ada Lovelace', 'hello')]);
  thread.open('dm', 5, { title: 'Grace', subtitle: '' });
  await settle();
  assert.ok(replyButton(elements, '10'));
  assert.equal(row(elements, '10').querySelector('[aria-label="Edit message"]'), null);
  assert.ok(replyButton(elements, '11'));
  assert.ok(row(elements, '11').querySelector('[aria-label="Edit message"]'));
});

test('a reply is sent with its marker, shows a quote, and the next message starts clean', async () => {
  const { thread, elements, api, pane, composer } = makePane([dm(10, 'grace', 'Grace Hopper', '<b>Friday</b> works')]);
  thread.open('dm', 5, { title: 'Grace', subtitle: '' });
  await settle();

  replyButton(elements, '10').dispatchEvent(fakeEvent('click'));
  const bar = pane.querySelector('.chat-reply-bar');
  assert.equal(bar.hidden, false);
  assert.match(bar.textContent, /Replying to Grace Hopper/);
  assert.match(bar.textContent, /Friday works/);

  composer.type('See you then');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  const [, , body] = api.calls.find(call => call[0] === 'sendDm');
  assert.deepEqual(replyHelpers.extractReplyMarker(body), {
    reply: { id: '10', sender: 'Grace Hopper', excerpt: 'Friday works' },
    html: 'See you then',
  });
  assert.equal(bar.hidden, true, 'the reply went with that message');

  // The saved reply, as the socket or a reload would bring it back.
  thread.close();
  const reopened = makePane([dm(10, 'grace', 'Grace Hopper', 'Friday works'), dm(12, 'ada', 'Ada Lovelace', body)]);
  reopened.thread.open('dm', 5, { title: 'Grace', subtitle: '' });
  await settle();
  const quote = row(reopened.elements, '12').querySelector('.chat-reply-quote');
  assert.match(quote.textContent, /Grace Hopper/);
  assert.equal(row(reopened.elements, '12').querySelector('.chat-msg-body').textContent, 'See you then');
});

test('editing a reply edits only its text and keeps the quote', async () => {
  const marker = replyHelpers.encodeReplyMarker({ id: '10', sender: 'Grace Hopper', excerpt: 'Friday works' });
  const { thread, elements, api, composer } = makePane([dm(12, 'ada', 'Ada Lovelace', `${marker} See you`)]);
  thread.open('dm', 5, { title: 'Grace', subtitle: '' });
  await settle();
  row(elements, '12').querySelector('[aria-label="Edit message"]').dispatchEvent(fakeEvent('click'));
  assert.equal(composer.getHTML(), 'See you', 'the marker is not in the editor');
  composer.type('See you there');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  const [, , , body] = api.calls.find(call => call[0] === 'editDm');
  assert.equal(body, `${marker} See you there`);
  assert.ok(row(elements, '12').querySelector('.chat-reply-quote'), 'the quote is still shown');
});

test('a pasted image is handed to the composer only where images can be attached', () => {
  assert.equal(makePane([]).composer.options.onPasteImage, null);
  assert.equal(typeof makePane([], { withImageInput: true }).composer.options.onPasteImage, 'function');
});

test('a log whose richText has no reply helpers still shows bodies as stored, without Reply', () => {
  const element = document.createElement('div');
  const plain = { renderRichMessage(container, raw) { container.appendChild(document.createTextNode(raw)); } };
  const log = createMessageLog(element, { richText: plain, me, onEdit() {}, onDelete() {} });
  log.append({ id: 'm1', key: 'm1', senderName: 'Grace', body: '[[reply:1|a|b]] hi', image: null }, false);
  assert.equal(element.querySelector('[aria-label="Reply"]'), null);
  assert.match(element.textContent, /\[\[reply:1\|a\|b\]\] hi/);
});

test('"Find a conversation" matches group names, classes, periods and people', () => {
  const group = { name: 'Team Turing', course: 'CSA', period: 3, members: [{ name: 'Grace Hopper', uid: 'grace' }] };
  const conversation = { participants: [{ name: 'Ada Lovelace', uid: 'ada' }, { name: 'Alan Kay', uid: 'akay' }] };
  assert.equal(matchesConversationSearch('group', group, ''), true);
  assert.equal(matchesConversationSearch('group', group, 'turing csa'), true);
  assert.equal(matchesConversationSearch('group', group, 'period 3'), true);
  assert.equal(matchesConversationSearch('group', group, 'hopper'), true);
  assert.equal(matchesConversationSearch('group', group, 'csp'), false);
  assert.equal(matchesConversationSearch('dm', conversation, 'AKAY'), true);
  assert.equal(matchesConversationSearch('dm', conversation, 'ada kay'), true);
  assert.equal(matchesConversationSearch('dm', conversation, 'grace'), false);
});
