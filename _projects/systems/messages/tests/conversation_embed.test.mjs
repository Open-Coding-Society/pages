// conversation-embed.js: one group chat or DM inside another page. These run the real
// module against a fake DOM, a fake Spring (fetch) and a fake STOMP server, so they can
// check what a host relies on: the states it shows, its wording, read-only, formatBody,
// and that destroy() leaves nothing behind, with two embeds on one page kept apart.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document, window } = installFakeDom();

const embed = await import('../js/conversation-embed.js');
const { embedTexts, mountConversation, mountGroupChat, personErrorState, readId, signInHref } = embed;

const ADA = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null, roles: [] };
const config = {
  baseurl: '/pages',
  javaURI: 'http://localhost:8585',
  javaWebSocketURI: 'http://localhost:8589',
  pythonURI: 'http://localhost:8587',
  fetchOptions: { mode: 'cors', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' } },
  springEnabled: true,
};

// ── Fakes ──────────────────────────────────────────────────────────────────────

const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === undefined || body === null ? '' : JSON.stringify(body)),
});

// Spring, as far as the embed talks to it. A route answers { status, body } or { error }.
function fakeSpring(routes = {}) {
  const calls = [];
  const table = {
    'GET /api/person/get': { status: 200, body: ADA },
    ...routes,
  };
  globalThis.fetch = async (url, options = {}) => {
    const { pathname } = new URL(url);
    const method = options.method || 'GET';
    calls.push({ method, path: pathname, body: options.body ? JSON.parse(options.body) : undefined, options });
    const answer = table[`${method} ${pathname}`] ?? { status: 404 };
    if (answer.error) throw answer.error;
    return reply(answer.status ?? 200, answer.body);
  };
  return calls;
}

// SockJS and stomp.js as chat-socket.js uses them. connect() is accepted on the next
// microtask unless the test holds it back to look at a connection still being made.
function fakeStomp({ holdConnect = false } = {}) {
  const server = { transports: [], clients: [] };
  window.SockJS = class {
    constructor(url) {
      this.url = url;
      this.closed = false;
      this.onclose = null;
      server.transports.push(this);
    }

    close() {
      if (this.closed) return;
      this.closed = true;
      this.onclose?.();
    }
  };
  window.Stomp = {
    over(transport) {
      const client = {
        transport,
        connected: false,
        subscriptions: [],
        connect(headers, onConnected, onError) {
          client.onConnected = onConnected;
          // stomp.js reports a lost connection from the transport's onclose.
          transport.onclose = () => onError(`Whoops! Lost connection to ${transport.url}`);
          if (!holdConnect) queueMicrotask(() => client.accept());
        },
        accept() {
          if (transport.closed) return;
          client.connected = true;
          client.onConnected();
        },
        subscribe(topic, callback) {
          const subscription = { topic, callback, active: true, unsubscribe() { subscription.active = false; } };
          client.subscriptions.push(subscription);
          return subscription;
        },
        disconnect() {
          client.connected = false;
          transport.onclose = null;
          transport.close();
        },
      };
      server.clients.push(client);
      return client;
    },
  };
  server.publish = (topic, event) => server.clients.forEach(client => client.subscriptions
    .filter(subscription => subscription.active && subscription.topic === topic)
    .forEach(subscription => subscription.callback({ body: JSON.stringify(event) })));
  server.topics = () => server.clients.flatMap(client => client.subscriptions.filter(s => s.active).map(s => s.topic));
  return server;
}

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

function newRoot() {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

const saved = (id, author, message) => ({ id, author, message, date: '2026-10-20T10:00:00Z' });
const sentFrame = (messageId, sender, message) => ({ context: 'sendMessageServer', messageId, sender, message, date: '2026-10-20T10:05:00Z' });
const logOf = root => root.querySelector('.dm__log');

// ── Pure helpers ───────────────────────────────────────────────────────────────

test('embedTexts lays a host\'s wording over English defaults, with an empty state for each kind', () => {
  assert.equal(embedTexts('group').emptyHint, 'Say hi to your group.');
  assert.equal(embedTexts('dm').emptyHint, 'Say hi.');
  const texts = embedTexts('group', { signIn: 'Melde dich an.', send: 'Senden', unknownKey: 'x', you: 7 });
  assert.equal(texts.signIn, 'Melde dich an.');
  assert.equal(texts.send, 'Senden');
  assert.equal(texts.you, 'You');
  assert.equal('unknownKey' in texts, false);
  // /dm tells you to pick the conversation again; an embed has nothing to pick.
  assert.equal(texts.loadFailedHint, 'Check your connection, then reload the page.');
  assert.throws(() => embedTexts('channel'), TypeError);
});

test('readId takes a Spring id as a number or a string of digits, and nothing else', () => {
  assert.equal(readId(12), 12);
  assert.equal(readId('12'), 12);
  for (const bad of [0, -3, 1.5, '12a', ' 12', '', null, undefined, {}, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(readId(bad), null, `${String(bad)} is not an id`);
  }
});

test('personErrorState reads a 401, 403 or 404 as signed out and anything else as unavailable', () => {
  for (const status of [401, 403, 404]) assert.equal(personErrorState({ status }), 'signed-out');
  for (const error of [{ status: 500 }, { status: 502 }, new TypeError('Failed to fetch'), null]) {
    assert.equal(personErrorState(error), 'unavailable');
  }
});

test('signInHref puts /login under the site\'s baseurl', () => {
  assert.equal(signInHref(''), '/login');
  assert.equal(signInHref('/pages'), '/pages/login');
  assert.equal(signInHref('/pages/'), '/pages/login');
  assert.equal(signInHref(undefined), '/login');
});

// ── The module's contract ──────────────────────────────────────────────────────

test('the embed exports the two mounters and its helpers, and they always answer with a promise', async () => {
  for (const name of ['mountGroupChat', 'mountConversation', 'embedTexts', 'readId', 'personErrorState', 'signInHref']) {
    assert.equal(typeof embed[name], 'function', `${name} is exported`);
  }
  for (const mount of [mountGroupChat, mountConversation]) {
    const pending = mount(undefined, undefined);
    assert.equal(typeof pending.then, 'function');
    await assert.rejects(pending, TypeError);
  }
});

test('the Messages modules import each other with ./ paths only', async () => {
  const folder = new URL('../js/', import.meta.url);
  for (const file of (await readdir(folder)).filter(name => name.endsWith('.js'))) {
    const source = await readFile(new URL(file, folder), 'utf8');
    const imports = [...source.matchAll(/^\s*import\s[^'"]*['"]([^'"]+)['"]/gm)].map(match => match[1]);
    imports.forEach(path => assert.match(path, /^\.\/[\w-]+\.js$/, `${file} imports ${path}`));
  }
});

test('a wrong call is refused with a TypeError that names the problem, and mounts nothing', async () => {
  const calls = fakeSpring();
  const root = newRoot();
  const richText = stubRichText();
  const cases = [
    [mountGroupChat, root, { config, richText }, /groupId/],
    [mountGroupChat, root, { groupId: 'seven', config, richText }, /groupId/],
    [mountGroupChat, null, { groupId: 7, config, richText }, /root/],
    [mountGroupChat, root, { groupId: 7, config: { javaURI: 'x' }, richText }, /config/],
    [mountGroupChat, root, { groupId: 7, config, richText: {} }, /richText/],
    [mountGroupChat, root, { groupId: 7, config, richText, formatBody: 'upper' }, /formatBody/],
    [mountGroupChat, root, { groupId: 7, config, richText, texts: null }, /texts/],
    [mountGroupChat, root, { groupId: 7, config, richText, readOnly: 'yes' }, /readOnly/],
    [mountConversation, root, { config, richText }, /conversationId/],
  ];
  for (const [mount, target, options, problem] of cases) {
    await assert.rejects(mount(target, options), error => error instanceof TypeError && problem.test(error.message));
  }
  assert.equal(root.childNodes.length, 0);
  assert.equal(calls.length, 0);
});

// ── Mounting ───────────────────────────────────────────────────────────────────

test('a member sees the group\'s chat with /dm\'s classes, and new messages as they arrive', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [saved('m1', 'Grace Hopper', 'hello team')] } });
  const server = fakeStomp();
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  assert.equal(chat.state, 'ready');
  const frame = root.firstChild;
  assert.ok(frame.classList.contains('dm') && frame.classList.contains('dm--embed'));
  for (const selector of ['.dm__thread', '.dm__thread-head', '.dm__log', '.dm__composer', '.dm__send', '.dm-cancel-edit', '.dm__form-status']) {
    assert.ok(root.querySelector(selector), `${selector} is built`);
  }
  // With no heading the host's card shows the title.
  assert.equal(root.querySelector('.dm__thread-head').hidden, true);

  await settle();
  assert.match(logOf(root).textContent, /hello team/);
  assert.deepEqual(server.topics(), ['/topic/group/7']);
  server.publish('/topic/group/7', sentFrame('m2', 'Grace Hopper', 'second message'));
  assert.match(logOf(root).textContent, /second message/);
  chat.destroy();
});

test('a heading is shown and names the chat for screen readers', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  fakeStomp();
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText(), heading: 'Team chat' });
  const title = root.querySelector('.dm__thread-title');
  assert.equal(title.textContent, 'Team chat');
  assert.equal(root.querySelector('.dm__thread-head').hidden, false);
  assert.equal(root.querySelector('.dm__thread').getAttribute('aria-labelledby'), title.id);
  chat.destroy();
});

test('sending posts the message to the group over REST; it shows when it comes back on the socket', async () => {
  const calls = fakeSpring({
    'GET /api/groups/chat/7/messages': { body: [] },
    'POST /api/groups/chat/7/messages': { body: [] },
  });
  const server = fakeStomp();
  const root = newRoot();
  const richText = stubRichText();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText });
  await settle();
  richText.composers[0].setHTML('<b>hi</b> team');
  root.querySelector('.dm__composer').dispatchEvent(fakeEvent('submit'));
  await settle();
  const post = calls.find(call => call.method === 'POST');
  assert.deepEqual(post.body, { message: '<b>hi</b> team', image: null });
  assert.equal(post.options.credentials, 'include');
  server.publish('/topic/group/7', sentFrame('m3', 'Ada Lovelace', '<b>hi</b> team'));
  const mine = logOf(root).querySelector('[data-key="m3"]');
  assert.equal(mine.querySelector('.chat-msg-sender').textContent, 'You');
  chat.destroy();
});

test('a visitor who isn\'t signed in gets a sign-in link, and no socket is opened', async () => {
  for (const status of [401, 403]) {
    const calls = fakeSpring({ 'GET /api/person/get': { status } });
    const server = fakeStomp();
    const root = newRoot();
    const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText(), texts: { signIn: 'Sign in to chat with the team.' } });
    assert.equal(chat.state, 'signed-out');
    const link = root.querySelector('a');
    assert.equal(link.textContent, 'Sign in to chat with the team.');
    assert.equal(link.href, '/pages/login');
    assert.equal(server.transports.length, 0);
    assert.deepEqual(calls.map(call => call.path), ['/api/person/get']);
    chat.destroy();
    assert.equal(root.childNodes.length, 0);
  }
});

test('when Spring doesn\'t answer, the embed says chat is unavailable', async t => {
  const warn = t.mock.method(console, 'warn', () => {});
  fakeSpring({ 'GET /api/person/get': { error: new TypeError('Failed to fetch') } });
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  assert.equal(chat.state, 'unavailable');
  assert.match(root.textContent, /This chat isn’t available right now\./);
  assert.equal(warn.mock.callCount(), 1);
  chat.destroy();
});

test('a Flask-only site (spring: false) makes no request at all', async () => {
  const calls = fakeSpring();
  const server = fakeStomp();
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config: { ...config, springEnabled: false }, richText: stubRichText() });
  assert.equal(chat.state, 'unavailable');
  await settle();
  assert.equal(calls.length, 0);
  assert.equal(server.transports.length, 0);
  chat.destroy();
});

test('readOnly shows the chat without a composer, and your messages without edit or delete', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [saved('m1', 'Ada Lovelace', 'mine')] } });
  fakeStomp();
  const root = newRoot();
  const richText = stubRichText();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText, readOnly: true });
  await settle();
  assert.ok(!root.querySelector('form'), 'no form is built');
  assert.equal(richText.composers.length, 0);
  assert.match(logOf(root).textContent, /mine/);
  assert.ok(!root.querySelector('.chat-msg-actions'), 'no .chat-msg-actions is built');
  chat.destroy();
});

test('texts reword what the embed shows', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  fakeStomp();
  const root = newRoot();
  const richText = stubRichText();
  const pending = mountGroupChat(root, {
    groupId: 7,
    config,
    richText,
    texts: { loading: 'Laden…', emptyTitle: 'Noch nichts', emptyHint: 'Schreib dem Team.', send: 'Senden', cancel: 'Abbrechen', placeholder: 'Nachricht…' },
  });
  assert.match(root.textContent, /Laden…/);
  const chat = await pending;
  await settle();
  assert.match(logOf(root).textContent, /Noch nichts/);
  assert.match(logOf(root).textContent, /Schreib dem Team\./);
  assert.match(root.querySelector('.dm__send').textContent, /Senden/);
  assert.equal(root.querySelector('.dm-cancel-edit').textContent, 'Abbrechen');
  assert.equal(richText.composers[0].options.placeholder, 'Nachricht…');
  chat.destroy();
});

test('formatBody changes what each message shows, including live ones', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [saved('m1', 'Grace Hopper', 'first')] } });
  const server = fakeStomp();
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText(), formatBody: (body, message) => `${message.senderName} said ${body}` });
  await settle();
  server.publish('/topic/group/7', sentFrame('m2', 'Grace Hopper', 'second'));
  assert.match(logOf(root).textContent, /Grace Hopper said first/);
  assert.match(logOf(root).textContent, /Grace Hopper said second/);
  chat.destroy();
});

test('a dropped connection says live updates are off', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  const server = fakeStomp();
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  await settle();
  assert.equal(root.querySelector('.dm__notice').textContent, '');
  server.transports[0].close();
  assert.equal(root.querySelector('.dm__notice').textContent, 'Live updates are off. Reload the page to see new messages.');
  chat.destroy();
});

test('a DM embed opens the conversation, marks it read for the navbar bell and follows its topic', async () => {
  const calls = fakeSpring({
    'GET /api/dm/conversations/5/messages': { body: [{ id: 1, senderUid: 'grace', senderName: 'Grace Hopper', body: 'hi Ada', sentAt: '2026-10-20T10:00:00Z' }] },
    'POST /api/dm/conversations/5/read': { status: 200 },
  });
  const server = fakeStomp();
  let bellRefreshes = 0;
  const countRefresh = () => { bellRefreshes += 1; };
  window.addEventListener('dm:refresh-unread', countRefresh);
  const root = newRoot();
  const chat = await mountConversation(root, { conversationId: '5', config, richText: stubRichText() });
  await settle();
  assert.match(logOf(root).textContent, /hi Ada/);
  assert.ok(calls.some(call => call.method === 'POST' && call.path === '/api/dm/conversations/5/read'));
  assert.equal(bellRefreshes, 1);
  assert.deepEqual(server.topics(), ['/topic/dm/5']);
  server.publish('/topic/dm/5', { type: 'message', conversationId: 5, id: 2, senderUid: 'grace', senderName: 'Grace Hopper', body: 'are you there?', sentAt: '2026-10-20T10:01:00Z' });
  assert.match(logOf(root).textContent, /are you there\?/);
  window.removeEventListener('dm:refresh-unread', countRefresh);
  chat.destroy();
});

// ── destroy() ──────────────────────────────────────────────────────────────────

test('destroy disconnects, takes back every document and window listener, and empties root', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  const server = fakeStomp();
  const before = { document: document.listenerCount(), window: window.listenerCount() };
  const root = newRoot();
  const richText = stubRichText();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText });
  await settle();
  assert.ok(document.listenerCount() > before.document);

  chat.destroy();
  assert.equal(root.childNodes.length, 0);
  assert.equal(server.transports[0].closed, true);
  assert.deepEqual(server.topics(), []);
  assert.equal(richText.composers[0].destroyed, true);
  assert.deepEqual({ document: document.listenerCount(), window: window.listenerCount() }, before);
  chat.destroy(); // a second call does nothing
});

test('destroy while the socket is still connecting closes it without reporting a failed connection', async t => {
  const warn = t.mock.method(console, 'warn', () => {});
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  const server = fakeStomp({ holdConnect: true });
  const root = newRoot();
  const chat = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  await settle();
  assert.equal(server.transports.length, 1);
  chat.destroy();
  assert.equal(server.transports[0].closed, true);
  server.clients[0].accept(); // a CONNECTED that arrives late changes nothing
  await settle();
  assert.deepEqual(server.topics(), []);
  assert.equal(warn.mock.callCount(), 0);
});

test('an element holds one embed at a time: mount again only after destroy', async () => {
  fakeSpring({ 'GET /api/groups/chat/7/messages': { body: [] } });
  fakeStomp();
  const root = newRoot();
  const first = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  await assert.rejects(mountGroupChat(root, { groupId: 7, config, richText: stubRichText() }), /destroy\(\) it first/);
  first.destroy();
  const second = await mountGroupChat(root, { groupId: 7, config, richText: stubRichText() });
  assert.equal(second.state, 'ready');
  second.destroy();
});

test('two embeds on one page keep to their own conversations, and destroying one leaves the other working', async () => {
  fakeSpring({
    'GET /api/groups/chat/7/messages': { body: [saved('a1', 'Grace Hopper', 'team seven')] },
    'GET /api/groups/chat/8/messages': { body: [saved('b1', 'Alan Turing', 'team eight')] },
  });
  const server = fakeStomp();
  const rootA = newRoot();
  const rootB = newRoot();
  const [a, b] = await Promise.all([
    mountGroupChat(rootA, { groupId: 7, config, richText: stubRichText(), heading: 'Seven' }),
    mountGroupChat(rootB, { groupId: 8, config, richText: stubRichText(), heading: 'Eight' }),
  ]);
  await settle();
  assert.equal(server.transports.length, 2);
  assert.notEqual(rootA.querySelector('.dm__thread-title').id, rootB.querySelector('.dm__thread-title').id);
  assert.match(logOf(rootA).textContent, /team seven/);
  assert.doesNotMatch(logOf(rootA).textContent, /team eight/);

  server.publish('/topic/group/8', sentFrame('b2', 'Alan Turing', 'only for eight'));
  assert.match(logOf(rootB).textContent, /only for eight/);
  assert.doesNotMatch(logOf(rootA).textContent, /only for eight/);

  a.destroy();
  assert.equal(server.transports[0].closed, true);
  assert.equal(server.transports[1].closed, false);
  server.publish('/topic/group/8', sentFrame('b3', 'Alan Turing', 'still here'));
  assert.match(logOf(rootB).textContent, /still here/);
  b.destroy();
});
