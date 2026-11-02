// Replying to a message (the [[reply:...]] marker in assets/js/chat/chat-reply.js), images
// pasted into the composer, and the two /dm searches: conversations in the sidebar, and
// messages in the open conversation.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const chatReply = await import('../../../../assets/js/chat/chat-reply.js');
const { createRichComposer, imageFromClipboard } = await import('../../../../assets/js/chat/rich-text.js');
const { createThread } = await import('../js/thread.js');
const { createMessageLog } = await import('../js/message-log.js');
const { createSidebar } = await import('../js/sidebar.js');
const { matchesConversationSearch } = await import('../js/messages-model.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };

test('a reply marker round-trips its id, sender and excerpt, even with characters that would close it', () => {
  const reply = { id: 'm1', sender: 'Grace | Hopper', excerpt: 'See [[this]] & that' };
  const html = chatReply.addReplyMarker('<b>Yes</b>', reply);
  assert.match(html, /^\[\[reply:m1\|Grace%20%7C%20Hopper\|/);
  assert.deepEqual(chatReply.extractReplyMarker(html), { reply, html: '<b>Yes</b>' });
});

test('a body without a marker comes back as it was, and a marker needs an id', () => {
  assert.deepEqual(chatReply.extractReplyMarker('plain [[reply:m1|a|b]] later'), { reply: null, html: 'plain [[reply:m1|a|b]] later' });
  assert.deepEqual(chatReply.extractReplyMarker(null), { reply: null, html: '' });
  assert.equal(chatReply.addReplyMarker('<b>hi</b>', null), '<b>hi</b>');
  assert.throws(() => chatReply.encodeReplyMarker({ id: '', sender: 'Grace' }), TypeError);
  assert.throws(() => chatReply.encodeReplyMarker({ id: 'a|b', sender: 'Grace' }), TypeError);
});

test('an excerpt is one line of plain text, without tags, markers or entities, cut to length', () => {
  const html = '[[reply:m0|x|y]] <b>Lunch</b> at noon?<br>Bring&nbsp;snacks &amp; drinks [[event:e1|2026-11-02|P2|event|Lunch]]';
  assert.equal(chatReply.replyExcerpt(html), 'Lunch at noon? Bring snacks & drinks');
  assert.equal(chatReply.replyExcerpt('a'.repeat(200), 10), `${'a'.repeat(9)}…`);
  assert.equal(chatReply.replyExcerpt(''), '');
});

test('a pasted image is found among the clipboard items, or its files', () => {
  const image = { type: 'image/png', name: 'shot.png' };
  const fromItems = { items: [{ kind: 'string', type: 'text/html' }, { kind: 'file', type: 'image/png', getAsFile: () => image }] };
  assert.equal(imageFromClipboard(fromItems), image);
  assert.equal(imageFromClipboard({ items: [], files: [{ type: 'text/plain' }, image] }), image);
  assert.equal(imageFromClipboard({ items: [{ kind: 'string', type: 'text/plain' }], files: [] }), null);
  assert.equal(imageFromClipboard(null), null);
});

test('the composer hands a pasted image to onPasteImage, and pastes text as before without it', () => {
  const pasted = [];
  const image = { type: 'image/png' };
  const clipboardData = { items: [{ kind: 'file', type: 'image/png', getAsFile: () => image }], getData: () => 'caption' };
  const composer = createRichComposer({ onPasteImage: file => pasted.push(file) });
  const paste = fakeEvent('paste', { clipboardData });
  composer.editor.dispatchEvent(paste);
  assert.deepEqual(pasted, [image]);
  assert.equal(paste.defaultPrevented, true);
  assert.equal(composer.editor.textContent, '', 'the image is not pasted as text');

  const plain = createRichComposer();
  plain.editor.dispatchEvent(fakeEvent('paste', { clipboardData: { ...clipboardData, getData: () => 'just text' } }));
  assert.deepEqual(pasted, [image], 'no onPasteImage, no image handling');
});

// A thread whose richText is a stub composer plus the real reply helpers.
function makeThread(groupMessages) {
  const composers = [];
  const richText = {
    ...chatReply,
    renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
    createRichComposer(options) {
      let html = '';
      const composer = {
        options, element: document.createElement('div'),
        focus() {}, clear() { html = ''; }, setHTML(value) { html = value; }, getHTML: () => html,
        isEmpty: () => html === '', isOverLimit: () => false, setEnabled() {}, destroy() {},
      };
      composers.push(composer);
      return composer;
    },
  };
  const calls = [];
  const api = {
    groupMessages: async () => groupMessages,
    sendGroupMessage: async (id, html, image) => { calls.push(['send', id, html, image]); },
    editGroupMessage: async (id, messageId, html) => { calls.push(['edit', id, messageId, html]); },
    groupFiles: async () => [],
  };
  const socket = { follow(topic, handler) { socket.handler = handler; }, unfollow() {}, isConnected: () => true };
  const make = tag => document.createElement(tag);
  const elements = {
    title: make('h2'), subtitle: make('small'), messages: make('div'), formStatus: make('p'),
    form: make('form'), cancelEdit: make('button'), send: make('button'),
    searchBox: make('div'), search: make('input'),
  };
  elements.form.append(elements.cancelEdit, elements.send);
  const section = make('section');
  section.append(elements.messages, elements.form);
  const thread = createThread({ elements, api, socket, richText, me });
  return { thread, elements, composer: composers[0], calls, socket, section };
}

const rowOf = (elements, key) => elements.messages.querySelector(`[data-key="${key}"]`);
const buttonLabelled = (row, label) => row.querySelectorAll('.chat-msg-action').find(button => button.getAttribute('aria-label') === label);

test('Reply quotes the message, sends the marker with what was typed, then clears the reply', async () => {
  const { thread, elements, composer, calls, section } = makeThread([
    { id: 'm1', author: 'Grace Hopper', message: 'Lunch at <b>noon</b>?', date: '2026-10-20T10:00:00Z' },
  ]);
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  buttonLabelled(rowOf(elements, 'm1'), 'Reply').dispatchEvent(fakeEvent('click'));
  const bar = section.querySelector('.chat-reply-bar');
  assert.equal(bar.hidden, false);
  assert.match(bar.textContent, /Replying to Grace Hopper/);
  assert.match(bar.textContent, /Lunch at noon\?/);

  composer.setHTML('Yes!');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(calls, [['send', 7, '[[reply:m1|Grace%20Hopper|Lunch%20at%20noon%3F]] Yes!', null]]);
  assert.equal(bar.hidden, true);
});

test('a reply shows a quote instead of its marker, and editing it keeps the quote', async () => {
  const { thread, elements, composer, calls } = makeThread([
    { id: 'm1', author: 'Grace Hopper', message: 'Lunch at noon?', date: '2026-10-20T10:00:00Z' },
    { id: 'm2', author: 'Ada Lovelace', message: '[[reply:m1|Grace%20Hopper|Lunch%20at%20noon%3F]] Yes!', date: '2026-10-20T10:01:00Z' },
  ]);
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  const reply = rowOf(elements, 'm2');
  assert.match(reply.querySelector('.chat-reply-quote').textContent, /Grace Hopper.*Lunch at noon\?/);
  assert.equal(reply.querySelector('.chat-msg-body').textContent, 'Yes!');

  buttonLabelled(reply, 'Edit message').dispatchEvent(fakeEvent('click'));
  assert.equal(composer.getHTML(), 'Yes!', 'the marker is not in the editable text');
  composer.setHTML('Yes, see you');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(calls.at(-1), ['edit', 7, 'm2', '[[reply:m1|Grace%20Hopper|Lunch%20at%20noon%3F]] Yes, see you']);
  assert.equal(reply.querySelector('.chat-msg-body').textContent, 'Yes, see you');
  assert.ok(reply.querySelector('.chat-reply-quote'), 'the quote stays after the edit');
});

test('the conversation search shows only matching messages, says when none match, and resets on open', async () => {
  const { thread, elements } = makeThread([
    { id: 'm1', author: 'Grace Hopper', message: 'Lunch at noon?', date: '2026-10-20T10:00:00Z' },
    { id: 'm2', author: 'Ada Lovelace', message: 'Deploy is done', date: '2026-10-20T10:01:00Z' },
  ]);
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.equal(elements.searchBox.classList.contains('hidden'), false);

  elements.search.value = 'LUNCH';
  elements.search.dispatchEvent(fakeEvent('input'));
  assert.equal(rowOf(elements, 'm1').hidden, false);
  assert.equal(rowOf(elements, 'm2').hidden, true);
  assert.equal(elements.messages.querySelector('.chat-day').hidden, true);

  elements.search.value = 'grace lunch';
  elements.search.dispatchEvent(fakeEvent('input'));
  assert.equal(rowOf(elements, 'm1').hidden, false, 'sender and text both count');

  elements.search.value = 'pizza';
  elements.search.dispatchEvent(fakeEvent('input'));
  assert.match(elements.messages.querySelector('[data-search-empty]').textContent, /No messages match “pizza”/);

  thread.open('group', 8, { title: 'Other', subtitle: '' });
  assert.equal(elements.search.value, '');
  thread.close();
  assert.equal(elements.searchBox.classList.contains('hidden'), true);
});

test('a message arriving during a search is shown only if it matches', () => {
  const element = document.createElement('div');
  const log = createMessageLog(element, { richText: { renderRichMessage(c, raw) { c.appendChild(document.createTextNode(raw)); } }, me, onEdit() {}, onDelete() {} });
  const message = (id, body) => ({ id, key: id, senderKey: 'g', senderName: 'Grace', body, sentAt: null, edited: false, deleted: false, image: null });
  log.append(message('a', 'first'), false);
  assert.equal(log.setFilter('second'), 0);
  log.append(message('b', 'the second one'), false);
  assert.equal(element.querySelector('[data-key="b"]').hidden, false);
  assert.equal(element.querySelector('[data-search-empty]'), null, 'the no-match line goes once something matches');
  log.append(message('c', 'third'), false);
  assert.equal(element.querySelector('[data-key="c"]').hidden, true);
});

test('conversation search matches group names, courses, periods and people, and DM participants', () => {
  const group = { name: 'Team Turing', course: 'CSA', period: '3', members: [{ name: 'Grace Hopper', uid: 'ghopper' }] };
  const dm = { participants: [{ name: 'Alan Kay', uid: 'akay' }] };
  assert.equal(matchesConversationSearch('group', group, ''), true);
  assert.equal(matchesConversationSearch('group', group, 'turing'), true);
  assert.equal(matchesConversationSearch('group', group, 'csa period 3'), true);
  assert.equal(matchesConversationSearch('group', group, 'ghopper'), true);
  assert.equal(matchesConversationSearch('group', group, 'turing csp'), false, 'every word must match');
  assert.equal(matchesConversationSearch('dm', dm, 'KAY'), true);
  assert.equal(matchesConversationSearch('dm', dm, 'turing'), false);
});

test('the sidebar lists only matching conversations, and says when a list has no match', () => {
  const groupList = document.createElement('div');
  const dmList = document.createElement('div');
  const sidebar = createSidebar({ groupList, dmList, onOpen() {} });
  const state = {
    groups: [{ id: 1, name: 'Team Turing', members: [] }, { id: 2, name: 'Team Hopper', members: [] }],
    conversations: [{ id: 5, participants: [{ name: 'Alan Kay', uid: 'akay' }] }],
    active: null,
  };
  sidebar.render({ ...state, query: 'turing' });
  assert.deepEqual(groupList.querySelectorAll('a').map(link => link.dataset.id), ['1']);
  assert.match(dmList.textContent, /No direct messages match your search\./);
  sidebar.render({ ...state, query: '' });
  assert.equal(groupList.querySelectorAll('a').length, 2);
  assert.equal(dmList.querySelectorAll('a').length, 1);
});
