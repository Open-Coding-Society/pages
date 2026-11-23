// The slash-command menu, commands run by the pane, and code blocks in the log.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();
globalThis.localStorage = (() => {
  const store = new Map();
  return { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)) };
})();
const opened = [];
globalThis.window.open = (url, target, features) => opened.push([url, target, features]);
globalThis.window.location = { href: 'https://pages.example/dm?group=12' };

const { CommandMenu } = await import('../js/command-menu.js');
const { createThread } = await import('../js/thread.js');
const { createMessageLog } = await import('../js/message-log.js');
const { CodeBlocks } = await import('../js/code-model.js');

// A composer whose editor text follows what's set in it, as the real one's does.
function stubComposer() {
  const element = document.createElement('div');
  const editor = document.createElement('div');
  element.appendChild(editor);
  let html = '';
  const sync = () => { editor.textContent = html.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''); };
  return {
    element, editor,
    focus() {}, clear() { html = ''; sync(); },
    setHTML(value) { html = value; sync(); },
    getHTML: () => html.replace(/&nbsp;/g, ' ').trim(),
    isEmpty: () => html.trim() === '', isOverLimit: () => false, setEnabled() {}, destroy() {},
    // What a person types is text: "<hi>" stays the four characters, as in the real editor.
    type(text) {
      html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      editor.textContent = text;
      editor.dispatchEvent(fakeEvent('input'));
    },
  };
}

const key = (target, name, extra = {}) => {
  const event = fakeEvent('keydown', { key: name, stopPropagation() { this.stopped = true; }, ...extra });
  target.dispatchEvent(event);
  return event;
};

function menuFor(kind = 'group') {
  const composer = stubComposer();
  const host = document.createElement('div');
  const ran = [];
  const menu = new CommandMenu({ composer, host, kindOf: () => kind, onRun: (command, args) => ran.push([command.name, args]) });
  return { composer, host, ran, menu };
}

test('"/" opens the grouped menu; typing narrows it; Escape closes it', () => {
  const { composer, host, menu } = menuFor();
  composer.type('/');
  assert.equal(menu.isOpen(), true);
  const headings = host.querySelectorAll('.ocs__menu-heading').map(heading => heading.textContent);
  assert.deepEqual(headings, ['Share', 'GitHub', 'This chat', 'Message']);
  assert.equal(composer.editor.getAttribute('aria-expanded'), 'true');
  composer.type('/gi');
  assert.deepEqual(host.querySelectorAll('.ocs__menu-name').map(name => name.textContent), ['/gist [file name]']);
  const escape = key(composer.element, 'Escape');
  assert.equal(escape.defaultPrevented, true);
  assert.equal(menu.isOpen(), false);
});

test('the arrow keys move the highlight, and Enter runs a command that needs nothing more', () => {
  const { composer, host, ran } = menuFor();
  composer.type('/li');
  const selected = () => host.querySelectorAll('[aria-selected="true"]').map(item => item.id);
  assert.match(selected()[0], /-links$/);
  composer.type('/m');
  key(composer.element, 'ArrowDown');
  assert.match(selected()[0], /-members$/);
  const enter = key(composer.element, 'Enter');
  assert.equal(enter.stopped, true, 'the composer never sees it, so nothing is sent');
  assert.deepEqual(ran, [['members', '']]);
  assert.equal(composer.getHTML(), '');
});

test('a command that needs words is filled in, and Enter runs it with them', () => {
  const { composer, ran } = menuFor();
  composer.type('/iss');
  key(composer.element, 'Tab');
  assert.equal(composer.getHTML(), '/issue');
  assert.deepEqual(ran, []);
  composer.type('/issue Open-Coding-Society/pages#2031');
  key(composer.element, 'Enter');
  assert.deepEqual(ran, [['issue', 'Open-Coding-Society/pages#2031']]);
});

test('a direct message’s menu leaves out a group’s commands', () => {
  const { composer, host } = menuFor('dm');
  composer.type('/f');
  // "find" is /search's keyword; /file, /folder and /files are a group's.
  assert.deepEqual(host.querySelectorAll('.ocs__menu-name').map(name => name.textContent), ['/search']);
});

// ── The pane runs commands ─────────────────────────────────────────────────────────
function commandThread(kind = 'group', extra = {}) {
  const make = tag => document.createElement(tag);
  const elements = {
    title: make('h2'), subtitle: make('small'), messages: make('div'), formStatus: make('p'),
    form: make('form'), cancelEdit: make('button'), send: make('button'), commandHost: make('div'), codeHost: make('div'),
  };
  elements.form.append(elements.cancelEdit, elements.send);
  const composer = stubComposer();
  const sent = [];
  const gists = [];
  const api = {
    groupMessages: async () => [],
    dmMessages: async () => [],
    markDmRead: async () => {},
    sendGroupMessage: async (id, body) => { sent.push(body); return []; },
    sendDm: async (id, body) => { sent.push(body); return null; },
    createGist: async (files, description) => { gists.push({ files, description }); return { success: true, url: 'https://gist.github.com/ada/abc123' }; },
  };
  const commands = [];
  const thread = createThread({
    elements, api, me: { id: 1, uid: 'ada', name: 'Ada Lovelace' },
    socket: { follow() {}, unfollow() {}, isConnected: () => true },
    richText: { renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw))); }, createRichComposer: () => composer },
    onCommand: name => commands.push(name),
    ...extra,
  });
  return { thread, elements, composer, sent, gists, commands, kind, api };
}

test('GitHub commands post the link, and remember the repository for next time', async () => {
  const { thread, composer, sent, elements } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/pr Open-Coding-Society/pages#2031');
  key(composer.element, 'Enter');
  await settle();
  assert.deepEqual(sent, ['https://github.com/Open-Coding-Society/pages/pull/2031']);
  composer.type('/issue 7');
  key(composer.element, 'Enter');
  await settle();
  assert.equal(sent[1], 'https://github.com/Open-Coding-Society/pages/issues/7');
  composer.type('/repo not a repo');
  key(composer.element, 'Enter');
  assert.match(elements.formStatus.textContent, /owner\/repo#12/);
});

test('/newissue opens GitHub’s filled-in form; /me and /shrug send formatted text; the rest go to the page', async () => {
  const { thread, composer, sent, commands } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/newissue a/b Scoreboard breaks on reset');
  key(composer.element, 'Enter');
  const url = new URL(opened.at(-1)[0]);
  assert.equal(url.pathname, '/a/b/issues/new');
  assert.equal(url.searchParams.get('title'), 'Scoreboard breaks on reset');
  assert.match(url.searchParams.get('body'), /Team Turing/);
  composer.type('/me waves <hi>');
  key(composer.element, 'Enter');
  await settle();
  assert.equal(sent.at(-1), '<i>waves &#60;hi&#62;</i>');
  composer.type('/shrug ok');
  key(composer.element, 'Enter');
  await settle();
  assert.equal(sent.at(-1), 'ok ¯\\_(ツ)_/¯');
  composer.type('/members');
  key(composer.element, 'Enter');
  assert.deepEqual(commands, ['members']);
});

test('Ctrl+/ on an empty box opens the menu; on a draft it keeps the draft and shows /help', async () => {
  const { thread, composer, commands, elements } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  thread.showCommands();
  assert.equal(composer.getHTML(), '/');
  assert.ok(elements.commandHost.querySelectorAll('.ocs__menu-heading').length > 0, 'the menu lists the commands');
  key(composer.element, 'Escape');
  composer.type('half a thought');
  thread.showCommands();
  assert.equal(composer.getHTML(), 'half a thought');
  assert.deepEqual(commands, ['help']);
});

test('/code posts a code block with the message as its caption; /gist saves it and posts the link', async () => {
  const { thread, composer, sent, gists, elements } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/code java');
  key(composer.element, 'Enter');
  const area = elements.codeHost.querySelector('textarea');
  area.value = 'class Main {}';
  composer.setHTML('try this');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.equal(sent.at(-1), CodeBlocks.addMarker('try this', 'java', 'class Main {}'));
  assert.equal(elements.codeHost.querySelector('.dm__code-box').hidden, true, 'the box closes once sent');

  composer.type('/gist hello.py');
  key(composer.element, 'Enter');
  elements.codeHost.querySelector('textarea').value = 'print(1)';
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.deepEqual(Object.keys(gists[0].files), ['hello.py']);
  assert.equal(gists[0].files['hello.py'].content, 'print(1)');
  assert.equal(elements.codeHost.querySelector('select').value, 'python', 'the file name set the language');
  assert.equal(sent.at(-1), 'https://gist.github.com/ada/abc123');
});

test('a code block too long for a direct message says to use a gist and sends nothing', async () => {
  const { thread, composer, sent, elements } = commandThread();
  thread.open('dm', 4, { title: 'Grace', subtitle: '' });
  await settle();
  composer.type('/code');
  key(composer.element, 'Enter');
  // 1,800 characters fit the box, but 100 of them grow to %3C in the message: over 2,000.
  elements.codeHost.querySelector('textarea').value = 'x'.repeat(1700) + '<'.repeat(100);
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(sent, []);
  assert.match(elements.formStatus.textContent, /too long for a direct message/);
});

test('/gist in a direct message takes code longer than a message there holds: only its link is sent', async () => {
  const { thread, composer, sent, gists, elements } = commandThread();
  thread.open('dm', 4, { title: 'Grace', subtitle: '' });
  await settle();
  composer.type('/gist long.py');
  key(composer.element, 'Enter');
  const code = 'x = 1\n'.repeat(500); // 3,000 characters, over a direct message's 2,000
  elements.codeHost.querySelector('textarea').value = code;
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.equal(gists.length, 1);
  assert.equal(gists[0].files['long.py'].content, code.trimEnd());
  assert.deepEqual(sent, ['https://gist.github.com/ada/abc123']);
});

test('a code block still being written stays with its conversation: opening another closes it', async () => {
  const { thread, composer, sent, elements } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/code python');
  key(composer.element, 'Enter');
  elements.codeHost.querySelector('textarea').value = 'secret = 42';
  thread.open('group', 13, { title: 'Team Babbage', subtitle: '' });
  await settle();
  assert.equal(elements.codeHost.querySelector('.dm__code-box').hidden, true);
  composer.setHTML('hello');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(sent, ['hello']);
});

// ── Code blocks in the log ──────────────────────────────────────────────────────────
test('a code block draws its code as text, with Copy, and Run for a language the runners take', async () => {
  const host = document.createElement('div');
  const runs = [];
  const log = createMessageLog(host, {
    richText: { renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw))); } },
    me: { name: 'Ada' }, onEdit() {}, onDelete() {},
    runCode: async (language, code) => { runs.push([language, code]); return 'Hello'; },
  });
  log.append({ id: 'c1', key: 'c1', senderKey: 'g', senderName: 'Grace', body: CodeBlocks.addMarker('caption', 'python', 'print("<b>Hello</b>")'), sentAt: null }, false);
  log.append({ id: 'c2', key: 'c2', senderKey: 'g', senderName: 'Grace', body: CodeBlocks.addMarker('', 'html', '<h1>x</h1>'), sentAt: null }, false);
  const [python, html] = host.querySelectorAll('.chat-code');
  assert.equal(python.querySelector('code').textContent, 'print("<b>Hello</b>")');
  assert.deepEqual(python.querySelectorAll('button').map(button => button.textContent), ['Copy', 'Run']);
  assert.deepEqual(html.querySelectorAll('button').map(button => button.textContent), ['Copy']);
  python.querySelectorAll('button')[1].dispatchEvent(fakeEvent('click'));
  await settle();
  assert.deepEqual(runs, [['python', 'print("<b>Hello</b>")']]);
  const output = python.querySelector('.chat-code-output');
  assert.equal(output.hidden, false);
  assert.equal(output.textContent, 'Hello');
  assert.match(host.textContent, /caption/);
});

test('editing a message with a code block edits only its words: the block stays as it was', async () => {
  const { thread, composer, api, elements } = commandThread();
  const edits = [];
  const block = CodeBlocks.addMarker('see this', 'python', 'print("hi")');
  api.groupMessages = async () => [{ id: 'm1', author: 'Ada Lovelace', author_uid: 'ada', message: block, date: '2026-11-22T10:00:00Z' }];
  api.editGroupMessage = async (id, messageId, body) => { edits.push(body); };
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();

  const edit = elements.messages.querySelectorAll('button').find(button => button.getAttribute('aria-label') === 'Edit message');
  edit.dispatchEvent(fakeEvent('click'));
  assert.equal(composer.getHTML(), 'see this', 'the editor shows the words, not the block’s marker');
  composer.setHTML('see this one');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();

  assert.deepEqual(edits, [CodeBlocks.addMarker('see this one', 'python', 'print("hi")')]);
});

test('code over the limit stops the send, so the words never go without it', async () => {
  const { thread, composer, sent, elements } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/code python');
  key(composer.element, 'Enter');
  elements.codeHost.querySelector('textarea').value = 'x'.repeat(CodeBlocks.MAX_LENGTH + 1);
  composer.setHTML('see this');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(sent, []);
  assert.equal(composer.getHTML(), 'see this', 'the words wait with the code');
  assert.equal(elements.codeHost.querySelector('.dm__code-box').hidden, false);
});

test('/me and /shrug send their words as they are, even words that look like a command', async () => {
  const { thread, composer, sent, commands } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/me /help');
  key(composer.element, 'Enter');
  await settle();
  assert.equal(sent.at(-1), '<i>/help</i>');
  composer.type('/shrug /file');
  key(composer.element, 'Enter');
  await settle();
  assert.equal(sent.at(-1), '/file ¯\\_(ツ)_/¯');
  assert.deepEqual(commands, []);
});

test('Ctrl+/ with no conversation open shows /help and leaves the box alone', () => {
  const { thread, composer, commands } = commandThread();
  thread.showCommands();
  assert.equal(composer.getHTML(), '');
  assert.deepEqual(commands, ['help']);
});

test('an edit can take out all of a code message’s words: the code saves on its own', async () => {
  const { thread, composer, api, elements } = commandThread();
  const edits = [];
  api.groupMessages = async () => [{ id: 'm1', author: 'Ada Lovelace', author_uid: 'ada', message: CodeBlocks.addMarker('see this', 'python', 'print("hi")'), date: '2026-11-22T10:00:00Z' }];
  api.editGroupMessage = async (id, messageId, body) => { edits.push(body); };
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  elements.messages.querySelectorAll('button').find(button => button.getAttribute('aria-label') === 'Edit message').dispatchEvent(fakeEvent('click'));
  composer.setHTML('');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(edits, [CodeBlocks.addMarker('', 'python', 'print("hi")')]);
});

test('code changed while its message sends stays in the box for the next message', async () => {
  const { thread, composer, sent, api, elements } = commandThread();
  let finish = null;
  api.sendGroupMessage = (id, body) => new Promise(resolve => { finish = () => { sent.push(body); resolve([]); }; });
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  composer.type('/code python');
  key(composer.element, 'Enter');
  const area = elements.codeHost.querySelector('textarea');
  area.value = 'print(1)';
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  area.value = 'print(2)';
  finish();
  await settle();
  assert.equal(sent.length, 1);
  assert.equal(elements.codeHost.querySelector('.dm__code-box').hidden, false, 'the box keeps the newer code');
  assert.equal(area.value, 'print(2)');
});

test('Pin on a message sends a pin message, and on a pinned one an unpin; the pane lists what it loaded', async () => {
  const { thread, api, elements, sent } = commandThread();
  api.groupMessages = async () => [
    { id: 'm1', author: 'Grace Hopper', author_uid: 'grace', message: 'Demo Friday', date: '2026-11-22T10:00:00Z' },
    { id: 'm2', author: 'Alan Turing', author_uid: 'alan', message: 'Bring the slides', date: '2026-11-22T10:05:00Z' },
    { id: 'p1', author: 'Alan Turing', author_uid: 'alan', message: '[[pin:m2]]', date: '2026-11-22T10:06:00Z' },
  ];
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  const pinOf = key => elements.messages.querySelector(`[data-key="${key}"]`).querySelector('[data-action="pin"]');
  pinOf('m1').dispatchEvent(fakeEvent('click'));
  await settle();
  pinOf('m2').dispatchEvent(fakeEvent('click'));
  await settle();
  assert.deepEqual(sent, ['[[pin:m1]]', '[[unpin:m2]]']);
  assert.deepEqual(thread.messages().map(message => message.id), ['m1', 'm2', 'p1']);
  assert.equal(thread.isPinned('m2'), true);
});

test('/media, /links and /pinned go to the page, which opens that tab of the Shared panel', async () => {
  const { thread, composer, commands } = commandThread();
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  for (const name of ['media', 'links', 'pinned']) {
    composer.type(`/${name}`);
    key(composer.element, 'Enter');
  }
  assert.deepEqual(commands, ['media', 'links', 'pinned']);
});

test('the pane tells the page once per burst when its conversation’s messages change', async () => {
  const changes = [];
  const { thread, composer, api, elements } = commandThread('group', { onChanged: (kind, id) => changes.push([kind, id]) });
  const history = [
    { id: 'm1', author: 'Grace Hopper', author_uid: 'grace', message: 'one', date: '2026-11-22T10:00:00Z' },
    { id: 'm2', author: 'Grace Hopper', author_uid: 'grace', message: 'two', date: '2026-11-22T10:01:00Z' },
    { id: 'm3', author: 'Grace Hopper', author_uid: 'grace', message: 'three', date: '2026-11-22T10:02:00Z' },
  ];
  api.groupMessages = async () => history;
  api.sendGroupMessage = async (id, body) => [...history, { id: 'm4', author: 'Ada Lovelace', author_uid: 'ada', message: body, date: '2026-11-22T10:03:00Z' }];
  thread.open('group', 12, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.deepEqual(changes, [['group', 12]], 'three messages loading are one change');
  composer.setHTML('hello');
  elements.form.dispatchEvent(fakeEvent('submit')); // the stub composer has no Enter-to-send
  await settle();
  await settle();
  assert.deepEqual(changes, [['group', 12], ['group', 12]]);
});
