// Sharing files and folders in a group chat: the rows a share's message shows, the tray of
// files waiting to go, walking a dropped folder, and Send uploading before the message.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { createMessageLog } = await import('../js/message-log.js');
const { createAttachments, entriesFromDrop } = await import('../js/attachments.js');
const { createThread } = await import('../js/thread.js');
const { GroupFiles } = await import('../js/group-files.js');
const { addFilesMarker, MAX_LOOSE_FILES } = await import('../js/files-model.js');

const me = { id: 1, uid: 'ada', name: 'Ada Lovelace', pfp: null };
const richText = {
  renderRichMessage(container, raw) { container.appendChild(document.createTextNode(String(raw ?? ''))); },
};
const buttonsIn = node => node.querySelectorAll('button');

test('a share’s message lists its files and folders with their buttons, not the marker', () => {
  const host = document.createElement('div');
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onFile() {} });
  const items = [
    { type: 'file', path: 'Design review.pdf', size: 2048 },
    { type: 'folder', path: 'project', count: 3, size: 3 * 1024 * 1024 },
    { type: 'file', path: 'build.log', size: 10 },
  ];
  log.append({ id: 'm1', key: 'm1', senderKey: 'Grace', senderName: 'Grace', body: addFilesMarker('here you go', items), sentAt: '2026-11-18T10:00:00Z' }, false);
  const rows = host.querySelectorAll('.ocs__file');
  assert.equal(rows.length, 3);
  const [pdf, folder, logFile] = rows;
  assert.match(pdf.textContent, /Design review\.pdf/);
  assert.match(pdf.textContent, /2 KB/);
  assert.deepEqual(buttonsIn(pdf).map(b => b.getAttribute('aria-label')), ['Preview Design review.pdf', 'Download Design review.pdf']);
  assert.match(folder.textContent, /project/);
  assert.match(folder.textContent, /3 files · 3 MB/);
  assert.deepEqual(buttonsIn(folder).map(b => b.getAttribute('aria-label')), ['Open project in Files', 'Download project as a .zip']);
  assert.deepEqual(buttonsIn(logFile).map(b => b.getAttribute('aria-label')), ['Preview build.log', 'Download build.log']);
  assert.match(host.textContent, /here you go/);
  assert.doesNotMatch(host.textContent, /\[\[files:/);
});

test('a file row’s buttons hand the item and the button to onFile', () => {
  const seen = [];
  const host = document.createElement('div');
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onFile: (action, item, control) => seen.push([action, item.path, control.tagName]) });
  const body = addFilesMarker('', [{ type: 'file', path: 'a.png', size: 5 }, { type: 'folder', path: 'src', count: 1, size: 1 }]);
  log.append({ id: 'm2', key: 'm2', senderKey: 'Ada Lovelace', senderName: 'Ada Lovelace', body, sentAt: null }, true);
  host.querySelectorAll('.ocs__file').flatMap(row => row.querySelectorAll('button'))
    .forEach(control => control.dispatchEvent(fakeEvent('click')));
  assert.deepEqual(seen, [['preview', 'a.png', 'BUTTON'], ['download', 'a.png', 'BUTTON'], ['folder', 'src', 'BUTTON'], ['zip', 'src', 'BUTTON']]);
});

test('up to four shared images show previews; five list as files', async () => {
  const asked = [];
  const host = document.createElement('div');
  const log = createMessageLog(host, {
    richText, me, onEdit() {}, onDelete() {}, onFile() {},
    thumbnail: async item => { asked.push(item.path); return `blob:${item.path}`; },
  });
  const images = n => Array.from({ length: n }, (_, i) => ({ type: 'file', path: `shot${i}.png`, size: 9 }));
  log.append({ id: 'a', key: 'a', senderKey: 'x', senderName: 'Grace', body: addFilesMarker('', images(4)), sentAt: null }, false);
  await settle();
  assert.equal(asked.length, 4);
  assert.equal(host.querySelectorAll('img.chat-file-thumb')[0].src, 'blob:shot0.png');
  log.append({ id: 'b', key: 'b', senderKey: 'x', senderName: 'Grace', body: addFilesMarker('', images(5)), sentAt: null }, false);
  await settle();
  assert.equal(asked.length, 4);
});

test('deleting a share’s message takes its files off it', () => {
  const host = document.createElement('div');
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onFile() {} });
  log.append({ id: 'c', key: 'c', senderKey: 'Ada Lovelace', senderName: 'Ada Lovelace', body: addFilesMarker('x', [{ type: 'file', path: 'a.txt', size: 1 }]), sentAt: null }, true);
  log.markDeleted('c');
  assert.equal(host.querySelectorAll('.ocs__file').length, 0);
});

const file = (name, size = 4, type = '') => new File(['x'.repeat(size)], name, { type });

test('the tray lists what waits by file and folder, and Remove takes one out', () => {
  const tray = document.createElement('div');
  const attachments = createAttachments({ tray });
  assert.equal(tray.hidden, true);
  attachments.add({ entries: [{ file: file('a.pdf', 2048), path: 'a.pdf' }, { file: file('x.js'), path: 'proj/x.js' }, { file: file('y.js'), path: 'proj/lib/y.js' }] });
  assert.equal(tray.hidden, false);
  assert.match(tray.textContent, /Ready to share · 3 files · 2 KB/);
  const rows = tray.querySelectorAll('.ocs__file');
  assert.equal(rows.length, 2);
  assert.match(rows[1].textContent, /2 files · 8 B/);
  rows[1].querySelector('button').dispatchEvent(fakeEvent('click'));
  assert.equal(attachments.entries().length, 1);
  assert.equal(tray.querySelectorAll('.ocs__file').length, 1);
});

test('the tray says what it left out and refuses a share it can’t send', () => {
  const tray = document.createElement('div');
  const attachments = createAttachments({ tray });
  attachments.add({ entries: [{ file: file('a.txt'), path: 'site/a.txt' }], skippedFolders: ['site/node_modules', 'site/.git'] });
  assert.match(tray.textContent, /Left out site\/node_modules, site\/\.git/);
  assert.equal(attachments.problem(), null);
  attachments.clear();
  attachments.add({ entries: Array.from({ length: MAX_LOOSE_FILES + 1 }, (_, i) => ({ file: file(`f${i}`), path: `f${i}.txt` })) });
  assert.equal(attachments.problem(), 'tooManyLoose');
  assert.match(tray.textContent, /Put them in a folder/);
});

test('while a share uploads the tray shows each row’s progress and a Cancel', () => {
  const tray = document.createElement('div');
  let cancelled = false;
  const attachments = createAttachments({ tray });
  const entries = [{ file: file('x.js'), path: 'proj/x.js' }, { file: file('y.js'), path: 'proj/y.js' }];
  attachments.add({ entries });
  const progress = attachments.beginUpload({ uploads: entries, items: [{ type: 'folder', path: 'proj', count: 2, size: 8 }], skipped: 0, tooBig: [], invalid: [], problem: null }, { onCancel: () => { cancelled = true; } });
  assert.match(tray.textContent, /Sharing 0 of 2…/);
  progress.onFile('proj/x.js', 'uploading');
  progress.onFile('proj/x.js', 'done');
  assert.match(tray.textContent, /1 \/ 2/);
  const cancel = [...tray.querySelectorAll('button')].find(b => b.textContent === 'Cancel');
  cancel.dispatchEvent(fakeEvent('click'));
  assert.equal(cancelled, true);
  attachments.endUpload({ keep: true });
  assert.equal(attachments.entries().length, 2);
  assert.match(tray.textContent, /Ready to share/);
});

// A dropped folder in the File and Directory Entries API's shape.
function fakeEntry(name, children = null) {
  if (!children) return { name, isFile: true, isDirectory: false, file: (ok) => ok(file(name)) };
  return {
    name,
    isFile: false,
    isDirectory: true,
    createReader() {
      const batches = [children.slice(0, 2), children.slice(2)].filter(batch => batch.length);
      return { readEntries: ok => ok(batches.shift() || []) };
    },
  };
}

test('a dropped folder is walked into paths, skipping tool folders without opening them', async () => {
  const opened = [];
  const nodeModules = fakeEntry('node_modules', []);
  nodeModules.createReader = () => { opened.push('node_modules'); return { readEntries: ok => ok([]) }; };
  const site = fakeEntry('site', [fakeEntry('index.html'), fakeEntry('css', [fakeEntry('main.css')]), nodeModules, fakeEntry('.DS_Store')]);
  const found = await entriesFromDrop({ items: [{ kind: 'file', webkitGetAsEntry: () => site }, { kind: 'file', webkitGetAsEntry: () => fakeEntry('notes.md') }] });
  assert.deepEqual(found.entries.map(entry => entry.path), ['site/index.html', 'site/css/main.css', 'notes.md']);
  assert.deepEqual(found.skippedFolders, ['site/node_modules']);
  assert.deepEqual(opened, []);
  const capped = await entriesFromDrop({ items: [{ kind: 'file', webkitGetAsEntry: () => site }] }, { limit: 1 });
  assert.equal(capped.entries.length, 1);
  assert.equal(capped.truncated, true);
});

// ── Send shares first ─────────────────────────────────────────────────────────────
function fakeFilesApi({ failPaths = [] } = {}) {
  const calls = { uploads: [], index: 0 };
  return {
    calls,
    groupFileIndex: async () => { calls.index += 1; return [{ path: 'notes.txt', size: 1 }]; },
    groupFileContent: async () => new Blob(['x']),
    uploadGroupFileWithProgress: async (groupId, path) => {
      calls.uploads.push(path);
      if (failPaths.includes(path)) throw Object.assign(new Error('nope'), { status: 500 });
      return {};
    },
  };
}

function shareThread({ filesApi = fakeFilesApi(), sendFails = 0 } = {}) {
  const make = tag => document.createElement(tag);
  const elements = {
    title: make('h2'), subtitle: make('small'), messages: make('div'), formStatus: make('p'),
    form: make('form'), cancelEdit: make('button'), send: make('button'),
    attachButton: make('button'), attachMenuHost: make('div'), imageInput: make('input'),
    filesInput: make('input'), folderInput: make('input'), tray: make('div'), dropZone: make('section'), dropHint: make('p'),
  };
  elements.form.append(elements.cancelEdit, elements.send);
  let html = '';
  const composer = {
    element: make('div'), focus() {}, clear() { html = ''; }, setHTML(value) { html = value; }, getHTML: () => html,
    isEmpty: () => html === '', isOverLimit: () => false, setEnabled() {}, destroy() {},
  };
  const sent = [];
  let failuresLeft = sendFails;
  const api = {
    groupMessages: async () => [],
    dmMessages: async () => [],
    markDmRead: async () => {},
    sendGroupMessage: async (id, body) => {
      if (failuresLeft > 0) {
        failuresLeft -= 1;
        throw new Error('offline');
      }
      sent.push(body);
      return [];
    },
  };
  const socket = { follow() {}, unfollow() {}, isConnected: () => true };
  const files = new GroupFiles({ api: filesApi, groupId: 7 });
  const thread = createThread({
    elements, api, socket, me, groupFiles: () => files,
    richText: { ...richText, createRichComposer: () => composer },
  });
  return { thread, elements, composer, sent, filesApi, files };
}

function pickFiles(input, list) {
  input.files = list;
  input.dispatchEvent(fakeEvent('change'));
}

test('Send uploads what waits, then sends one message that lists it', async () => {
  const { thread, elements, composer, sent, filesApi } = shareThread();
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  assert.equal(elements.attachButton.disabled, false);
  pickFiles(elements.filesInput, [file('notes.txt', 3), file('plan.pdf', 5)]);
  assert.match(elements.tray.textContent, /Ready to share · 2 files/);
  composer.setHTML('for tomorrow');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  // notes.txt was already shared, so this one is notes (2).txt.
  assert.deepEqual(filesApi.calls.uploads, ['notes (2).txt', 'plan.pdf']);
  assert.equal(sent.length, 1);
  assert.equal(sent[0], '[[files:f~notes (2).txt~3;f~plan.pdf~5]] for tomorrow');
  assert.equal(elements.tray.hidden, true);
});

test('files that fail are left off the message, which says so', async () => {
  const { thread, elements, composer, sent } = shareThread({ filesApi: fakeFilesApi({ failPaths: ['plan.pdf'] }) });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.filesInput, [file('a.txt', 3), file('plan.pdf', 5)]);
  composer.setHTML('');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.equal(sent[0], '[[files:f~a.txt~3]]');
  assert.match(elements.formStatus.textContent, /1 could not be shared: plan\.pdf/);
});

test('when the message fails after the files are up, the next Send doesn’t upload them again', async () => {
  const { thread, elements, composer, sent, filesApi } = shareThread({ sendFails: 1 });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.folderInput, [Object.assign(file('x.js'), { webkitRelativePath: 'proj/x.js' })]);
  composer.setHTML('code');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.match(elements.formStatus.textContent, /Your files are shared, but the message didn’t send/);
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(filesApi.calls.uploads, ['proj/x.js']);
  assert.equal(sent[0], '[[files:d~proj~1~4]] code');
});

test('Send names the files against the group’s files as they are now, so a teammate’s file isn’t replaced', async () => {
  const filesApi = fakeFilesApi();
  let listed = [];
  filesApi.groupFileIndex = async () => { filesApi.calls.index += 1; return listed; };
  const { thread, elements, composer, sent, files } = shareThread({ filesApi });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  await files.index(); // the Files tab listed the group earlier
  // A teammate shares plan.pdf while another chat is open, so no frame reaches this page.
  listed = [{ path: 'plan.pdf', size: 9 }];
  pickFiles(elements.filesInput, [file('plan.pdf', 5)]);
  composer.setHTML('');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.deepEqual(filesApi.calls.uploads, ['plan (2).pdf']);
  assert.equal(sent[0], '[[files:f~plan (2).pdf~5]]');
});

test('a folder still being read when the chat changes stays out of the next chat’s tray', async () => {
  const { thread, elements } = shareThread();
  thread.open('group', 7, { title: 'Team Turing', subtitle: '' });
  await settle();
  let finishReading = null;
  let read = false;
  const slowFolder = {
    name: 'site',
    isFile: false,
    isDirectory: true,
    createReader: () => ({
      readEntries: ok => {
        if (read) return ok([]);
        read = true;
        finishReading = () => ok([fakeEntry('index.html')]);
        return undefined;
      },
    }),
  };
  const drop = fakeEvent('drop', { dataTransfer: { types: ['Files'], files: [], items: [{ kind: 'file', webkitGetAsEntry: () => slowFolder }] } });
  elements.dropZone.dispatchEvent(drop);
  await settle();
  thread.open('group', 8, { title: 'Team Babbage', subtitle: '' });
  await settle();
  finishReading();
  await settle();
  await settle();
  assert.equal(elements.tray.hidden, true, 'Team Turing’s folder doesn’t wait in Team Babbage');
});

test('in a direct message, dropped files say where they can go, and the menu offers only an image', async () => {
  const { thread, elements } = shareThread();
  thread.open('dm', 4, { title: 'Grace', subtitle: 'Direct message' });
  await settle();
  const drop = fakeEvent('drop', { dataTransfer: { types: ['Files'], files: [file('a.zip')], items: [{ kind: 'file', webkitGetAsEntry: () => fakeEntry('a.zip') }] } });
  elements.dropZone.dispatchEvent(drop);
  await settle();
  assert.match(elements.formStatus.textContent, /can be shared in a group chat/);
  elements.attachButton.dispatchEvent(fakeEvent('click'));
  const choices = elements.attachMenuHost.querySelectorAll('.ocs__menu-item').map(item => item.textContent);
  assert.deepEqual(choices, ['Image or screenshotShows in the chat']);
});
