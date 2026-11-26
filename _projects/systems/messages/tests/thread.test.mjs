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
  socket.handler({ context: 'sendFileServer', sender: 'Grace', filename: 'plan.pdf', size: 12 });
  socket.handler(groupFrame('m9', 'Grace Hopper', 'new here'));
  // The message that shares a file lists it; the socket's file frame adds no line of its own.
  assert.doesNotMatch(elements.messages.textContent, /plan\.pdf/);
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

const dmRow = (id, body) => ({ id, senderUid: 'grace', senderName: 'Grace', body, sentAt: '2026-10-20T10:00:00Z' });

test('showMessage on a conversation that is still loading marks the message once it arrives', async () => {
  const api = stubApi({ dmMessages: [dmRow(1, 'first'), dmRow(2, 'second')] });
  const { thread, elements } = makeThread({ api });
  thread.open('dm', 5, { title: 'Grace', subtitle: 'Direct message' });
  thread.showMessage('2');
  assert.equal(elements.messages.querySelector('.is-found'), null);
  await settle();

  const found = elements.messages.querySelector('.is-found');
  assert.equal(found.dataset.key, '2');
  assert.deepEqual(found.scrolledIntoView, { block: 'center' });
});

test('showMessage on a loaded conversation marks the message straight away', async () => {
  const api = stubApi({ dmMessages: [dmRow(1, 'first'), dmRow(2, 'second')] });
  const { thread, elements } = makeThread({ api });
  thread.open('dm', 5, { title: 'Grace', subtitle: 'Direct message' });
  await settle();

  thread.showMessage('1');
  assert.equal(elements.messages.querySelector('.is-found').dataset.key, '1');
  // The same conversation again: nothing reloads, and the new find replaces the old.
  assert.equal(thread.open('dm', 5, { title: 'Grace', subtitle: 'Direct message' }), true);
  thread.showMessage('2');
  assert.deepEqual(elements.messages.querySelectorAll('.is-found').map(row => row.dataset.key), ['2']);
  assert.equal(api.calls.filter(([name]) => name === 'dmMessages').length, 1);
});

test('showMessage with no conversation open does nothing', () => {
  const { thread, elements } = makeThread();
  thread.showMessage('1');
  assert.equal(elements.messages.querySelector('.is-found'), null);
});

test('a GitHub link in a DM shows its card under the message', async () => {
  const api = stubApi({ dmMessages: [{ id: 1, senderUid: 'grace', senderName: 'Grace', body: 'my PR https://github.com/Open-Coding-Society/pages/pull/2066', sentAt: '2026-10-20T10:00:00Z' }] });
  const asked = [];
  const linkCards = html => {
    asked.push(html);
    const box = document.createElement('div');
    box.appendChild(document.createElement('a'));
    return box;
  };
  const { thread, elements } = makeThread({ api, linkCards });

  thread.open('dm', 5, { title: 'Grace', subtitle: 'Direct message' });
  await settle();

  assert.equal(elements.messages.querySelectorAll('.chat-cards').length, 1);
  assert.match(asked[0], /pages\/pull\/2066/);
});

// ── Reactions ───────────────────────────────────────────────────────────────────────────
// The stub API with the four reaction calls. `reactions` is what a GET answers (a map of
// message id → list), or a function (kind, id) that gives it or a Promise of it; each PUT
// or DELETE answers with `answer(messageId, reaction, on)`, or fails when `fail` is (or returns) true.
function withReactions(api, { reactions = {}, answer = () => ({ reactions: [] }), fail = false } = {}) {
  const read = (kind, id) => Promise.resolve(typeof reactions === 'function' ? reactions(kind, id) : reactions);
  const write = name => async (id, messageId, reaction, on) => {
    api.calls.push([name, id, messageId, reaction, on]);
    if (typeof fail === 'function' ? fail() : fail) throw new Error('the reaction did not save');
    return answer(messageId, reaction, on);
  };
  return Object.assign(api, {
    groupReactions: id => { api.calls.push(['groupReactions', id]); return read('group', id); },
    dmReactions: id => { api.calls.push(['dmReactions', id]); return read('dm', id); },
    setGroupReaction: write('setGroupReaction'),
    setDmReaction: write('setDmReaction'),
  });
}

const groupRow = (id, message = 'hi') => ({ id, author: 'Grace Hopper', author_uid: 'grace', message, date: '2026-10-20T10:00:00Z' });
const liked = (...uids) => [{ reaction: 'like', people: uids.map(uid => ({ uid, name: uid })) }];
const reactionsFrame = (messageId, reactions) => ({ context: 'reactionsServer', messageId, reactions });
const rowIn = (elements, key) => elements.messages.querySelector(`[data-key="${key}"]`);
const chipsIn = (elements, key) => rowIn(elements, key)?.querySelector('.chat-reactions') ?? null;
const chipText = (elements, key) => chipsIn(elements, key)?.textContent ?? '';
const answerAsAda = (messageId, reaction, on) => ({ messageId, reactions: on ? [{ reaction, people: [{ uid: 'ada', name: 'Ada Lovelace' }] }] : [] });

// Opens a message's reaction picker and picks one by its label.
function pickIn(elements, key, label) {
  rowIn(elements, key).querySelector('[data-action="react"]').dispatchEvent(fakeEvent('click'));
  rowIn(elements, key).querySelectorAll('.ocs__menu-item')
    .find(choice => choice.querySelector('.ocs__menu-name').textContent === label)
    .dispatchEvent(fakeEvent('click'));
}

test('reactions load after the history and draw on their messages', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { reactions: { m1: liked('grace') } });
  const group = makeThread({ api });
  group.thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.deepEqual(api.calls.slice(0, 2), [['groupMessages', 7], ['groupReactions', 7]]);
  assert.equal(chipText(group.elements, 'm1'), '👍 1');

  const dmApi = withReactions(stubApi({ dmMessages: [dmRow(1, 'hi')] }), { reactions: { 1: liked('grace', 'ada') } });
  const dm = makeThread({ api: dmApi });
  dm.thread.open('dm', 4, { title: 'Grace', subtitle: '' });
  await settle();
  assert.equal(chipText(dm.elements, '1'), '👍 2');
});

test('a reactions frame redraws a message’s chips', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }));
  const { thread, elements, socket } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.equal(chipsIn(elements, 'm1'), null);

  socket.handler(reactionsFrame('m1', liked('grace')));
  assert.equal(chipText(elements, 'm1'), '👍 1');
  socket.handler(reactionsFrame('m1', []));
  assert.equal(chipsIn(elements, 'm1'), null, 'the last reaction taken back takes the row with it');
});

test('a frame newer than the bulk load wins', async () => {
  let answer;
  const held = new Promise(resolve => { answer = resolve; });
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { reactions: () => held });
  const { thread, elements, socket } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  socket.handler(reactionsFrame('m1', liked('grace', 'alan')));
  answer({ m1: liked('grace') });
  await settle();
  assert.equal(chipText(elements, 'm1'), '👍 2');
});

test('a reactions answer for a chat you left is dropped', async () => {
  let answer;
  const held = new Promise(resolve => { answer = resolve; });
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { reactions: (kind, id) => (id === 7 ? held : {}) });
  const { thread, elements } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  thread.open('group', 8, { title: 'Team Hopper', subtitle: '' });
  await settle();

  answer({ m1: liked('grace') });
  await settle();
  assert.equal(chipsIn(elements, 'm1'), null, 'group 7’s reactions don’t land on group 8’s m1');
});

test('picking a reaction sends PUT, and picking it again sends DELETE', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { answer: answerAsAda });
  const { thread, elements } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  pickIn(elements, 'm1', 'Like');
  await settle();
  assert.equal(chipText(elements, 'm1'), '👍 1');
  pickIn(elements, 'm1', 'Like');
  await settle();
  assert.equal(chipsIn(elements, 'm1'), null);
  assert.deepEqual(api.calls.filter(call => call[0] === 'setGroupReaction'),
    [['setGroupReaction', 7, 'm1', 'like', true], ['setGroupReaction', 7, 'm1', 'like', false]]);
});

test('a failed reaction shows the reactFailed text', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { fail: true });
  const { thread, elements } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  const warn = console.warn;
  console.warn = () => {};
  try {
    pickIn(elements, 'm1', 'Like');
    await settle();
  } finally {
    console.warn = warn;
  }
  assert.equal(elements.formStatus.textContent, 'Could not save your reaction. Try again.');
  assert.equal(rowIn(elements, 'm1').querySelector('[data-action="react"]').disabled, false, 'you can try again');
});

test('a read-only thread never asks for reactions', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { reactions: { m1: liked('grace') } });
  const { thread, elements } = makeThread({ api, readOnly: true });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.equal(api.calls.some(call => call[0] === 'groupReactions'), false);
  assert.equal(elements.messages.querySelector('[data-action="react"]'), null);
});

test('a message that arrived live can be reacted to', async () => {
  const api = withReactions(stubApi({ groupMessages: [] }), { answer: answerAsAda });
  const { thread, elements, socket } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  socket.handler(groupFrame('m9', 'Grace Hopper', 'just now'));
  socket.handler(reactionsFrame('m9', liked('grace')));
  assert.equal(chipText(elements, 'm9'), '👍 1');
  pickIn(elements, 'm9', 'Love');
  await settle();
  assert.deepEqual(api.calls.filter(call => call[0] === 'setGroupReaction'), [['setGroupReaction', 7, 'm9', 'love', true]]);
});

test('after the socket reconnects, reactions are fetched again', async () => {
  const answers = [{}, { m1: liked('grace') }, {}];
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { reactions: () => answers.shift() });
  const { thread, elements } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.equal(chipsIn(elements, 'm1'), null);

  thread.resume();
  await settle();
  assert.equal(chipText(elements, 'm1'), '👍 1', 'a reaction left while offline shows up');
  thread.resume();
  await settle();
  assert.equal(chipsIn(elements, 'm1'), null, 'and one taken back while offline goes');
});

test('an older reactions load can’t undo a newer frame, across a reconnect and a switch', async () => {
  let releaseCatchUp;
  let releaseBulk;
  const catchUp = new Promise(resolve => { releaseCatchUp = resolve; });
  const bulk = new Promise(resolve => { releaseBulk = resolve; });
  const api = withReactions(stubApi(), { reactions: (kind, id) => (id === 8 ? bulk : {}) });
  let group7Loads = 0;
  api.groupMessages = async id => {
    api.calls.push(['groupMessages', id]);
    if (id === 7 && ++group7Loads === 2) return catchUp; // group 7's catch-up after the reconnect
    return [groupRow('m1')];
  };
  const { thread, elements, socket } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  thread.resume();
  await settle();
  thread.open('group', 8, { title: 'Team Hopper', subtitle: '' });
  await settle();

  socket.handler(reactionsFrame('m1', liked('grace', 'alan')));
  releaseCatchUp([groupRow('m1')]);
  await settle();
  releaseBulk({ m1: liked('grace') });
  await settle();

  assert.equal(chipText(elements, 'm1'), '👍 2', 'group 8’s older answer leaves the newer frame');
  assert.equal(api.calls.filter(call => call[0] === 'groupReactions' && call[1] === 7).length, 1,
    'group 7, left behind, asks for no more reactions');
});

test('your own reaction’s answer doesn’t undo a newer frame', async () => {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { answer: () => held });
  const { thread, elements, socket } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  pickIn(elements, 'm1', 'Like');
  socket.handler(reactionsFrame('m1', liked('ada')));
  socket.handler(reactionsFrame('m1', liked('ada', 'alan')));
  release({ messageId: 'm1', reactions: liked('ada') });
  await settle();

  assert.equal(chipText(elements, 'm1'), '👍 2');
});

test('a read-only thread ignores reactions frames', async () => {
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }));
  const { thread, elements, socket } = makeThread({ api, readOnly: true });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();

  socket.handler(reactionsFrame('m1', liked('grace')));

  assert.equal(chipsIn(elements, 'm1'), null);
});

test('saving a reaction clears only its own failure notice', async () => {
  let attempts = 0;
  const api = withReactions(stubApi({ groupMessages: [groupRow('m1')] }), { answer: answerAsAda, fail: () => ++attempts === 1 });
  const { thread, elements } = makeThread({ api });
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  const warn = console.warn;
  console.warn = () => {};
  try {
    pickIn(elements, 'm1', 'Like');
    await settle();
  } finally {
    console.warn = warn;
  }
  assert.equal(elements.formStatus.textContent, 'Could not save your reaction. Try again.');
  pickIn(elements, 'm1', 'Like');
  await settle();
  assert.equal(elements.formStatus.textContent, '', 'trying again clears it');

  elements.formStatus.textContent = 'Your files are shared, but the message didn’t send. Press Send to try again.';
  pickIn(elements, 'm1', 'Love');
  await settle();
  assert.match(elements.formStatus.textContent, /Your files are shared/, 'another notice stays');
});
