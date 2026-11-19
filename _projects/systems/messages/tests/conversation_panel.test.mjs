// Pins in the log and the conversation panel's tabs (Files for groups, Media, Links, Pinned).
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { createMessageLog } = await import('../js/message-log.js');
const { createConversationPanel } = await import('../js/conversation-panel.js');
const { GroupFiles } = await import('../js/group-files.js');
const { createFileViewer } = await import('../js/file-viewer.js');
const { createDialog } = await import('../js/dialogs.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };
const richText = {
  renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
};
const row = (id, senderName, body, extra = {}) => ({ id, key: id, senderKey: senderName, senderName, body, sentAt: '2026-11-18T10:00:00Z', ...extra });
const labelsIn = node => node.querySelectorAll('button').map(button => button.getAttribute('aria-label'));

test('a pin message shows as a note that names who pinned what, and the message gets marked', () => {
  const host = document.createElement('div');
  const pinned = [];
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onPin: (message, isPinned) => pinned.push([message.id, isPinned]) });
  log.append(row('m1', 'Grace', 'Demo is Friday at 3'), false);
  log.append(row('m2', 'Ada Lovelace', '[[pin:m1]]'), true);
  const note = host.querySelector('.chat-pin-note');
  assert.match(note.textContent, /You pinned a message:/);
  assert.match(note.textContent, /Demo is Friday at 3/);
  const message = host.querySelector('[data-key="m1"]');
  assert.equal(message.classList.contains('is-pinned'), true);
  assert.match(message.textContent, /Pinned/);
  const pinButton = message.querySelector('[data-action="pin"]');
  assert.equal(pinButton.getAttribute('aria-label'), 'Unpin');
  assert.equal(pinButton.getAttribute('aria-pressed'), 'true');
  pinButton.dispatchEvent(fakeEvent('click'));
  assert.deepEqual(pinned, [['m1', true]]);
  assert.equal(log.isPinned('m1'), true);
});

test('an unpin, or deleting the pin message, takes the pin away', () => {
  const host = document.createElement('div');
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onPin() {} });
  log.append(row('m1', 'Grace', 'hello'), false);
  log.append(row('p1', 'Grace', '[[pin:m1]]'), false);
  assert.equal(log.isPinned('m1'), true);
  log.markDeleted('p1');
  assert.equal(log.isPinned('m1'), false);
  assert.equal(host.querySelector('.chat-pin-note'), null);
  log.append(row('p2', 'Alan', '[[pin:m1]]'), false);
  log.append(row('p3', 'Alan', '[[unpin:m1]]'), false);
  assert.equal(log.isPinned('m1'), false);
  assert.match(host.textContent, /Alan unpinned a message:/);
  assert.equal(host.querySelector('[data-key="m1"]').classList.contains('is-pinned'), false);
});

function panelElements() {
  const make = (tag, id) => {
    const node = document.createElement(tag);
    if (id) node.id = id;
    document.body.appendChild(node);
    return node;
  };
  const dialog = make('div', 'conversationPanel');
  dialog.className = 'ocs__modal hidden';
  return {
    dialog,
    title: make('h3'),
    tabList: make('ul'),
    status: make('p'),
    panels: {
      files: make('div', 'pFiles'), media: make('div', 'pMedia'), links: make('div', 'pLinks'), pinned: make('div', 'pPinned'),
    },
  };
}

function makePanel(messages, { files = [], groupFiles = null, viewer = { show() {} } } = {}) {
  const elements = panelElements();
  const shown = [];
  const unpinned = [];
  const thread = {
    messages: () => messages,
    showMessage: key => shown.push(key),
    togglePin: async (message, pinned) => { unpinned.push([message.id, pinned]); return true; },
  };
  const filesOfGroup = groupFiles || new GroupFiles({ api: { groupFileIndex: async () => files }, groupId: 12 });
  const panel = createConversationPanel({
    elements, thread, groupFilesFor: () => filesOfGroup, viewer,
    makeFileActions: () => ({ handle() {}, thumbnail: async () => 'blob:thumb', clear() {} }),
  });
  return { panel, elements, shown, unpinned };
}

const tabsOf = elements => elements.tabList.querySelectorAll('li').filter(item => !item.hidden).map(item => item.textContent.replace(/\s+/g, ' ').trim());

test('a direct message’s panel has no Files tab and opens on Media', () => {
  const { panel, elements } = makePanel([row('m1', 'Grace', 'pic', { image: 'data:image/png;base64,AA' })]);
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null);
  assert.deepEqual(tabsOf(elements), ['Media 1', 'Links', 'Pinned']);
  assert.equal(elements.title.textContent, 'Shared in Grace');
  assert.equal(elements.panels.media.classList.contains('hidden'), false);
  assert.equal(elements.panels.files.classList.contains('hidden'), true);
  assert.equal(elements.panels.media.querySelectorAll('img').length, 1);
});

test('a group’s panel opens on Files and counts its media, links and pins', async () => {
  const messages = [
    row('m1', 'Grace', 'PR https://github.com/Open-Coding-Society/pages/pull/2031 and https://example.com'),
    row('m2', 'Alan', '[[files:f~shot.png~5]] screenshot'),
    row('p1', 'Alan', '[[pin:m1]]'),
  ];
  const { panel, elements } = makePanel(messages, { files: [{ path: 'shot.png', size: 5 }] });
  panel.open({ kind: 'group', id: 12, name: 'Team Turing' }, null);
  await settle();
  assert.deepEqual(tabsOf(elements), ['Files', 'Media 1', 'Links 2', 'Pinned 1']);
  const selected = elements.tabList.querySelectorAll('[aria-selected="true"]');
  assert.equal(selected.length, 1);
  assert.match(selected[0].textContent, /Files/);
  assert.equal(selected[0].classList.contains('active'), true);
  assert.match(elements.panels.files.textContent, /shot\.png/);
  const linkNames = elements.panels.links.querySelectorAll('.ocs__file-name').map(name => name.textContent);
  assert.deepEqual(linkNames, ['github.com/Open-Coding-Society/pages/pull/2031', 'example.com']);
});

test('a picture sent in the chat opens in the viewer as an image, though its name has no extension', async () => {
  const opened = [];
  const { panel, elements } = makePanel([row('m1', 'Grace', 'pic', { image: 'data:image/png;base64,iVBORw0KGgo=' })], {
    viewer: { show: file => opened.push(file) },
  });
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null);
  elements.panels.media.querySelector('button').dispatchEvent(fakeEvent('click'));
  await settle();
  await settle();
  assert.equal(opened.length, 1);
  assert.equal(opened[0].name, 'Image from Grace');
  assert.equal(opened[0].preview, 'image');
});

test('the viewer draws an image it is told is one, and says when a file has no preview', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const viewer = createFileViewer({ root });
  const png = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
  await viewer.show({ name: 'Image from Grace', blob: png, preview: 'image' }, null);
  assert.equal(root.querySelectorAll('img.ocs__file-preview').length, 1);
  await viewer.show({ name: 'Image from Grace', blob: png }, null);
  assert.equal(root.querySelectorAll('img.ocs__file-preview').length, 0);
  assert.match(root.textContent, /no preview/);
  viewer.destroy();
});

test('Escape closes the viewer on top, and the Shared panel under it stays open', async () => {
  const modal = document.createElement('div');
  modal.className = 'ocs__modal hidden';
  document.body.appendChild(modal);
  const panelDialog = createDialog(modal);
  panelDialog.open(null);
  const root = document.createElement('div');
  document.body.appendChild(root);
  const viewer = createFileViewer({ root });
  await viewer.show({ name: 'notes.md', blob: new Blob(['# notes']) }, null);
  document.dispatchEvent(fakeEvent('keydown', { key: 'Escape' }));
  assert.equal(viewer.isOpen(), false);
  assert.equal(panelDialog.isOpen(), true, 'one Escape, one layer');
  document.dispatchEvent(fakeEvent('keydown', { key: 'Escape' }));
  assert.equal(panelDialog.isOpen(), false);
  viewer.destroy();
});

test('opening the Files tab lists the group’s files as they are now, not as they were', async () => {
  let listed = [{ path: 'a.txt', size: 1 }];
  const groupFiles = new GroupFiles({ api: { groupFileIndex: async () => listed }, groupId: 12 });
  const { panel, elements } = makePanel([], { groupFiles });
  const group = { kind: 'group', id: 12, name: 'Team Turing' };
  panel.open(group, null);
  await settle();
  assert.match(elements.panels.files.textContent, /a\.txt/);
  // A teammate shares b.txt while another chat is open, so no frame reaches this page.
  listed = [...listed, { path: 'b.txt', size: 2 }];
  panel.open(group, null);
  await settle();
  assert.match(elements.panels.files.textContent, /b\.txt/);
});

test('Pinned lists each pin with Show in the chat and Unpin', async () => {
  const messages = [row('m1', 'Grace', 'Demo Friday'), row('p1', 'Alan', '[[pin:m1]]')];
  const { panel, elements, shown, unpinned } = makePanel(messages);
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null, { tab: 'pinned' });
  const pins = elements.panels.pinned;
  assert.match(pins.textContent, /Demo Friday/);
  assert.match(pins.textContent, /pinned by Alan/);
  assert.deepEqual(labelsIn(pins), ['Show in the chat', 'Unpin']);
  pins.querySelectorAll('button')[0].dispatchEvent(fakeEvent('click'));
  assert.deepEqual(shown, ['m1']);
  pins.querySelectorAll('button')[1].dispatchEvent(fakeEvent('click'));
  await settle();
  assert.deepEqual(unpinned, [['m1', true]]);
});

test('the arrow keys move between the tabs that are showing', () => {
  const { panel, elements } = makePanel([]);
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null);
  const media = elements.tabList.querySelectorAll('button').find(button => /Media/.test(button.textContent));
  media.dispatchEvent(fakeEvent('keydown', { key: 'ArrowLeft' }));
  assert.equal(panel.current(), 'pinned');
  assert.match(elements.panels.pinned.textContent, /Nothing pinned yet/);
});
