// The Shared panel (conversation-panel.js): a group's Files, and any conversation's Media,
// Links and Pinned, in the grammar's tabs. Pins in the log are in message_log.test.mjs.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { ConversationPanel } = await import('../js/conversation-panel.js');
const { GroupFiles } = await import('../js/group-files.js');
const { FileViewer } = await import('../js/file-viewer.js');
const { createDialog } = await import('../js/dialogs.js');
const { FileActions } = await import('../js/file-actions.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };
const richText = {
  renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
};
const row = (id, senderName, body, extra = {}) => ({ id, key: id, senderKey: senderName, senderName, body, sentAt: '2026-11-18T10:00:00Z', ...extra });
const labelsIn = node => node.querySelectorAll('button').map(button => button.getAttribute('aria-label'));

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

function makePanel(messages, { files = [], groupFiles = null, viewer = { show() {} }, afterToggle = () => {} } = {}) {
  const elements = panelElements();
  const shown = [];
  const unpinned = [];
  const thread = {
    messages: () => messages,
    showMessage: key => shown.push(key),
    togglePin: async (message, pinned) => {
      unpinned.push([message.id, pinned]);
      afterToggle(message, pinned);
      return true;
    },
  };
  const filesOfGroup = groupFiles || new GroupFiles({ api: { groupFileIndex: async () => files }, groupId: 12 });
  const panel = new ConversationPanel({
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
  const viewer = new FileViewer({ root });
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
  const viewer = new FileViewer({ root });
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

// ── The Files tab (it was the Files dialog) ────────────────────────────────────────────
// A stand-in for messages-api.js that serves one group's files and records every call.
function fakeApi(files) {
  const calls = [];
  return {
    calls,
    groupFileIndex: async groupId => {
      calls.push(['index', groupId]);
      return files.map(({ path, size, uploadedBy }) => ({ path, size, uploadedBy }));
    },
    groupFileContent: async (groupId, path) => {
      calls.push(['content', groupId, path]);
      return new Blob([files.find(file => file.path === path).text]);
    },
  };
}

// A download is a blob URL on a clicked link. This keeps each blob, and stops the
// minute-long timer that lets the URL go from holding the test run open.
function catchDownloads() {
  const saved = [];
  const real = { create: URL.createObjectURL, revoke: URL.revokeObjectURL, timeout: globalThis.setTimeout };
  URL.createObjectURL = blob => {
    saved.push(blob);
    return `blob:test/${saved.length}`;
  };
  URL.revokeObjectURL = () => {};
  globalThis.setTimeout = (callback, ms, ...args) => (ms >= 1000 ? 0 : real.timeout(callback, ms, ...args));
  return {
    saved,
    restore() {
      URL.createObjectURL = real.create;
      URL.revokeObjectURL = real.revoke;
      globalThis.setTimeout = real.timeout;
    },
  };
}

const namesIn = host => host.querySelectorAll('.ocs__file-name').map(node => node.textContent);
const labelled = (host, label) => host.querySelectorAll('button').find(button => button.getAttribute('aria-label') === label);
const settleAll = async (times = 5) => {
  for (let i = 0; i < times; i += 1) await settle();
};

// The panel on a group's Files tab, with real GroupFiles and FileActions over a fake API.
function openFilesTab(files, { viewer = { show: async () => {} } } = {}) {
  const api = fakeApi(files);
  const byGroup = new Map();
  const groupFilesFor = id => {
    if (!byGroup.has(id)) byGroup.set(id, new GroupFiles({ api, groupId: id }));
    return byGroup.get(id);
  };
  const elements = panelElements();
  const panel = new ConversationPanel({
    elements, thread: { messages: () => [], showMessage() {}, togglePin: async () => true }, groupFilesFor, viewer,
    makeFileActions: ({ filesFor, notify }) => new FileActions({ filesFor, viewer, notify }),
  });
  panel.open({ kind: 'group', id: 7, name: 'Team Seven' }, null);
  return { api, elements, panel };
}

test('the Files tab lists a group\'s index, including a file shared before any files message', async () => {
  const { api, elements } = openFilesTab([{ path: 'old-notes.txt', size: 12, uploadedBy: 'Grace', text: 'hello there!' }]);
  await settleAll();
  assert.match(elements.title.textContent, /Shared in Team Seven/);
  assert.deepEqual(namesIn(elements.panels.files), ['old-notes.txt']);
  assert.match(elements.panels.files.textContent, /Grace/);
  assert.deepEqual(api.calls, [['index', 7]]);
});

test('Download fetches that one file from /files/content, not the whole list', async () => {
  const downloads = catchDownloads();
  try {
    const { api, elements } = openFilesTab([
      { path: 'a.txt', size: 1, text: 'A' },
      { path: 'b.txt', size: 1, text: 'B' },
    ]);
    await settleAll();
    labelled(elements.panels.files, 'Download b.txt').dispatchEvent(fakeEvent('click'));
    await settleAll();
    assert.deepEqual(api.calls, [['index', 7], ['content', 7, 'b.txt']]);
    assert.equal(downloads.saved.length, 1);
    assert.equal(await downloads.saved[0].text(), 'B');
    assert.equal(elements.status.textContent, '');
  } finally {
    downloads.restore();
  }
});

test('Preview opens the viewer on the file\'s blob', async () => {
  const shown = [];
  const { elements } = openFilesTab([{ path: 'notes.md', size: 4, text: '# Hi' }], {
    viewer: { show: async details => { shown.push(details); } },
  });
  await settleAll();
  labelled(elements.panels.files, 'Preview notes.md').dispatchEvent(fakeEvent('click'));
  await settleAll();
  assert.equal(shown.length, 1);
  assert.equal(shown[0].name, 'notes.md');
  assert.equal(await shown[0].blob.text(), '# Hi');
});

test('a folder opens as a tree and its .zip holds the files under it', async () => {
  const downloads = catchDownloads();
  try {
    const { api, elements } = openFilesTab([
      { path: 'site/index.html', size: 4, text: '<h1>' },
      { path: 'site/css/main.css', size: 6, text: 'body{}' },
      { path: 'readme.md', size: 2, text: 'hi' },
    ]);
    await settleAll();
    assert.deepEqual(namesIn(elements.panels.files), ['site', 'readme.md']);
    elements.panels.files.querySelector('.ocs__file--folder').dispatchEvent(fakeEvent('click'));
    assert.deepEqual(namesIn(elements.panels.files), ['css', 'index.html']);

    const zip = elements.panels.files.querySelectorAll('button').find(button => button.textContent.includes('Download as .zip'));
    zip.dispatchEvent(fakeEvent('click'));
    await settleAll(10);
    const fetched = api.calls.filter(call => call[0] === 'content').map(call => call[2]).sort();
    assert.deepEqual(fetched, ['site/css/main.css', 'site/index.html']);
    assert.equal(downloads.saved.length, 1);
    const bytes = new TextDecoder().decode(new Uint8Array(await downloads.saved[0].arrayBuffer()));
    assert.match(bytes, /index\.html/);
    assert.match(bytes, /css\/main\.css/);
    assert.doesNotMatch(bytes, /readme\.md/);
  } finally {
    downloads.restore();
  }
});

test('an open panel redraws Media, Links and Pinned when its conversation changes, and only that one', () => {
  const messages = [row('m1', 'Grace', 'Demo Friday')];
  const { panel, elements } = makePanel(messages);
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null, { tab: 'pinned' });
  assert.match(elements.panels.pinned.textContent, /Nothing pinned yet/);
  messages.push(row('p1', 'Alan', '[[pin:m1]]'));
  panel.refreshMessages('dm', 5);
  assert.match(elements.panels.pinned.textContent, /Nothing pinned yet/, 'another conversation leaves it alone');
  panel.refreshMessages('dm', 4);
  assert.match(elements.panels.pinned.textContent, /Demo Friday/);
  assert.deepEqual(tabsOf(elements), ['Media', 'Links', 'Pinned 1']);
});

test('Unpin in the Pinned tab draws the tab again: the count drops and the empty text shows', async () => {
  const messages = [row('m1', 'Grace', 'Demo Friday'), row('p1', 'Alan', '[[pin:m1]]')];
  const { panel, elements } = makePanel(messages, { afterToggle: () => messages.push(row('p2', 'Ada', '[[unpin:m1]]')) });
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null, { tab: 'pinned' });
  labelsIn(elements.panels.pinned);
  elements.panels.pinned.querySelectorAll('button')[1].dispatchEvent(fakeEvent('click'));
  await settle();
  assert.match(elements.panels.pinned.textContent, /Nothing pinned yet/);
  assert.deepEqual(tabsOf(elements), ['Media', 'Links', 'Pinned']);
});

test('a picture whose panel closed while it was being read does not open', async () => {
  const opened = [];
  const { panel, elements } = makePanel([row('m1', 'Grace', 'pic', { image: 'data:image/png;base64,iVBORw0KGgo=' })], {
    viewer: { show: file => opened.push(file) },
  });
  panel.open({ kind: 'dm', id: 4, name: 'Grace' }, null);
  const cell = elements.panels.media.querySelector('button');
  cell.dispatchEvent(fakeEvent('click'));
  document.dispatchEvent(fakeEvent('keydown', { key: 'Escape' }));
  await settle();
  await settle();
  assert.equal(panel.isOpen(), false);
  assert.deepEqual(opened, []);
});
