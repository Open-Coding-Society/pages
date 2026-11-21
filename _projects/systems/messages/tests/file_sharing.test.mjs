// Sharing files and folders in a group chat: the rows a share's message shows, the tray of
// files waiting to go, walking a dropped folder, and Send uploading before the message.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();

const { createMessageLog } = await import('../js/message-log.js');
const { Attachments } = await import('../js/attachments.js');
const { createThread } = await import('../js/thread.js');
const { GroupFiles } = await import('../js/group-files.js');
const { FilesMarker, SharedFiles } = await import('../js/files-model.js');
const { FileActions } = await import('../js/file-actions.js');

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
  log.append({ id: 'm1', key: 'm1', senderKey: 'Grace', senderName: 'Grace', body: FilesMarker.add('here you go', items), sentAt: '2026-11-18T10:00:00Z' }, false);
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
  const body = FilesMarker.add('', [{ type: 'file', path: 'a.png', size: 5 }, { type: 'folder', path: 'src', count: 1, size: 1 }]);
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
  log.append({ id: 'a', key: 'a', senderKey: 'x', senderName: 'Grace', body: FilesMarker.add('', images(4)), sentAt: null }, false);
  await settle();
  assert.equal(asked.length, 4);
  assert.equal(host.querySelectorAll('img.chat-file-thumb')[0].src, 'blob:shot0.png');
  log.append({ id: 'b', key: 'b', senderKey: 'x', senderName: 'Grace', body: FilesMarker.add('', images(5)), sentAt: null }, false);
  await settle();
  assert.equal(asked.length, 4);
});

test('deleting a share’s message takes its files off it', () => {
  const host = document.createElement('div');
  const log = createMessageLog(host, { richText, me, onEdit() {}, onDelete() {}, onFile() {} });
  log.append({ id: 'c', key: 'c', senderKey: 'Ada Lovelace', senderName: 'Ada Lovelace', body: FilesMarker.add('x', [{ type: 'file', path: 'a.txt', size: 1 }]), sentAt: null }, true);
  log.markDeleted('c');
  assert.equal(host.querySelectorAll('.ocs__file').length, 0);
});

const file = (name, size = 4, type = '') => new File(['x'.repeat(size)], name, { type });

test('a folder’s .zip is refused by the size of its files, whatever its message says', async () => {
  const big = 600 * 1024 * 1024;
  let fetched = 0;
  const files = new GroupFiles({
    api: {
      groupFileIndex: async () => [{ path: 'videos/a.mp4', size: big }, { path: 'videos/b.mp4', size: big }],
      groupFileContent: async () => { fetched += 1; return new Blob(['x']); },
    },
    groupId: 7,
  });
  const said = [];
  const actions = new FileActions({ filesFor: () => files, viewer: null, notify: message => said.push(message) });
  // Anyone can type a marker: this one says the folder holds nothing.
  await actions.handle('zip', { type: 'folder', path: 'videos', count: 2, size: 0 });
  assert.equal(fetched, 0);
  assert.match(said.at(-1), /videos is too big to download as one \.zip \(1\.2 GB\)/);
});

test('the tray lists what waits by file and folder, and Remove takes one out', () => {
  const tray = document.createElement('div');
  const attachments = new Attachments({ tray });
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
  const attachments = new Attachments({ tray });
  attachments.add({ entries: [{ file: file('a.txt'), path: 'site/a.txt' }], skippedFolders: ['site/node_modules', 'site/.git'] });
  assert.match(tray.textContent, /Left out site\/node_modules, site\/\.git/);
  assert.equal(attachments.problem(), null);
  attachments.clear();
  attachments.add({ entries: Array.from({ length: SharedFiles.MAX_LOOSE_FILES + 1 }, (_, i) => ({ file: file(`f${i}`), path: `f${i}.txt` })) });
  assert.equal(attachments.problem(), 'tooManyLoose');
  assert.match(tray.textContent, /Put them in a folder/);
});

test('while a share uploads the tray shows each row’s progress and a Cancel', () => {
  const tray = document.createElement('div');
  let cancelled = false;
  const attachments = new Attachments({ tray });
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
  const found = await Attachments.fromDrop({ items: [{ kind: 'file', webkitGetAsEntry: () => site }, { kind: 'file', webkitGetAsEntry: () => fakeEntry('notes.md') }] });
  assert.deepEqual(found.entries.map(entry => entry.path), ['site/index.html', 'site/css/main.css', 'notes.md']);
  assert.deepEqual(found.skippedFolders, ['site/node_modules']);
  assert.deepEqual(opened, []);
  const capped = await Attachments.fromDrop({ items: [{ kind: 'file', webkitGetAsEntry: () => site }] }, { limit: 1 });
  assert.equal(capped.entries.length, 1);
  assert.equal(capped.truncated, true);
});

// ── Send shares first ─────────────────────────────────────────────────────────────
// `gate`, a promise, holds every upload open until it settles; `failPaths` can be changed
// between Sends.
function fakeFilesApi({ failPaths = [], failStatus = 500, gate = null } = {}) {
  const calls = { uploads: [], index: 0, content: [] };
  const api = {
    calls,
    failPaths,
    // What Spring lists now; a test can swap it for what a teammate shared.
    index: [{ path: 'notes.txt', size: 1 }],
    groupFileIndex: async () => { calls.index += 1; return api.index; },
    groupFileContent: async (groupId, path) => {
      calls.content.push([groupId, path]);
      return new Blob(['x']);
    },
    uploadGroupFileWithProgress: async (groupId, path) => {
      calls.uploads.push(path);
      if (gate) await gate;
      if (failPaths.includes(path)) throw Object.assign(new Error('nope'), { status: failStatus });
      return {};
    },
  };
  return api;
}

function shareThread({ filesApi = fakeFilesApi(), sendFails = 0, history = [], dmHistory = [] } = {}) {
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
  const edited = [];
  let failuresLeft = sendFails;
  const api = {
    groupMessages: async () => history,
    dmMessages: async () => dmHistory,
    markDmRead: async () => {},
    editGroupMessage: async (groupId, messageId, body) => { edited.push(body); },
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
  return { thread, elements, composer, sent, edited, filesApi, files };
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

test('one file answering 503 is left out of the message and named in the notice', async () => {
  // Spring answers 503 with Retry-After when it can't check S3 for the file's path (spring#281).
  const { thread, elements, composer, sent } = shareThread({ filesApi: fakeFilesApi({ failPaths: ['big.zip'], failStatus: 503 }) });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.filesInput, [file('a.txt', 3), file('big.zip', 8)]);
  composer.setHTML('both');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.equal(sent[0], '[[files:f~a.txt~3]] both');
  assert.match(elements.formStatus.textContent, /1 could not be shared: big\.zip/);
});

test('a files marker typed in a DM renders its rows, and Download gives a notice instead of reading a group\'s files', async () => {
  // Spring keeps files only for groups, and its file routes don't check who asks, so a DM's
  // conversation id must never be used as a group id.
  const dmHistory = [{ id: 401, conversationId: 4, senderUid: 'grace', senderName: 'Grace Hopper', body: '[[files:f~plan.pdf~5]] look', sentAt: '2026-11-20T10:00:00Z' }];
  const { thread, elements, filesApi } = shareThread({ dmHistory });
  thread.open('dm', 4, { title: 'Grace', subtitle: 'Direct message' });
  await settle();
  const download = buttonsIn(elements.messages).find(button => button.getAttribute('aria-label') === 'Download plan.pdf');
  assert.ok(download, 'the row has its Download button');
  download.dispatchEvent(fakeEvent('click'));
  await settle();
  assert.match(elements.formStatus.textContent, /Files can be opened in the group they were shared in/);
  assert.deepEqual(filesApi.calls.content, []);
});

test('when every file fails, the tray keeps them and the next Send shares them', async () => {
  const filesApi = fakeFilesApi({ failPaths: ['a.txt', 'plan.pdf'], failStatus: 503 });
  const { thread, elements, composer, sent } = shareThread({ filesApi });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.filesInput, [file('a.txt', 3), file('plan.pdf', 5)]);
  composer.setHTML('here they are');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.equal(sent.length, 0);
  assert.match(elements.formStatus.textContent, /None of the files could be shared/);
  assert.equal(elements.tray.hidden, false);
  assert.match(elements.tray.textContent, /a\.txt/);
  assert.match(elements.tray.textContent, /plan\.pdf/);

  filesApi.failPaths.length = 0; // Spring is back
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  await settle();
  assert.equal(sent[0], '[[files:f~a.txt~3;f~plan.pdf~5]] here they are');
});

test('while a share uploads, Attach is off and a file picked meanwhile is turned away with a notice', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const { thread, elements, composer, sent } = shareThread({ filesApi: fakeFilesApi({ gate }) });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.filesInput, [file('a.txt', 3)]);
  composer.setHTML('one');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.equal(elements.attachButton.disabled, true, 'Attach is off while the share uploads');
  pickFiles(elements.filesInput, [file('late.txt', 4)]);
  assert.match(elements.formStatus.textContent, /finish/);
  const drop = fakeEvent('drop', { dataTransfer: { types: ['Files'], files: [file('dropped.txt', 2)], items: [{ kind: 'file', webkitGetAsEntry: () => fakeEntry('dropped.txt') }] } });
  elements.dropZone.dispatchEvent(drop);
  await settle();
  assert.equal(drop.defaultPrevented, true);
  release();
  await settle();
  await settle();
  assert.equal(sent[0], '[[files:f~a.txt~3]] one');
  assert.equal(elements.attachButton.disabled, false, 'Attach is back once the share is done');
});

test('a file dropped before a conversation is open is kept from opening in the tab', async () => {
  const { elements } = shareThread();
  const dataTransfer = { types: ['Files'], files: [file('a.zip')], items: [{ kind: 'file', webkitGetAsEntry: () => fakeEntry('a.zip') }] };
  const over = fakeEvent('dragover', { dataTransfer });
  const drop = fakeEvent('drop', { dataTransfer });
  elements.dropZone.dispatchEvent(over);
  elements.dropZone.dispatchEvent(drop);
  await settle();
  assert.equal(over.defaultPrevented, true);
  assert.equal(drop.defaultPrevented, true);
  assert.equal(elements.tray.hidden, true);
});

test('back in a group after another chat, a folder shared meanwhile zips with its files', async () => {
  // The page hears about shares only in the open conversation, so the list it kept for a
  // group can miss a folder a teammate shared while you were in another chat.
  const { thread, filesApi, files } = shareThread();
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  await files.index(); // the list as it was, as the Files dialog loads it
  thread.open('dm', 4, { title: 'Grace', subtitle: 'Direct message' });
  await settle();
  filesApi.index = [{ path: 'notes.txt', size: 1 }, { path: 'site/index.html', size: 1 }];
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  const entries = await files.folderEntries('site');
  assert.deepEqual(entries.map(entry => entry.path), ['site/index.html']);
});

test('editing a files message edits only its words; the files stay on it', async () => {
  const history = [{ id: 'm1', author: 'Ada Lovelace', author_uid: 'ada', message: '[[files:f~plan.pdf~5]] see this', date: '2026-11-20T10:00:00Z' }];
  const { thread, elements, composer, edited } = shareThread({ history });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  const edit = buttonsIn(elements.messages).find(button => button.getAttribute('aria-label') === 'Edit message');
  edit.dispatchEvent(fakeEvent('click'));
  assert.equal(composer.getHTML(), 'see this');
  composer.setHTML('see that');
  elements.form.dispatchEvent(fakeEvent('submit'));
  await settle();
  assert.deepEqual(edited, ['[[files:f~plan.pdf~5]] see that']);
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

test('a loose file Spring refuses, its name taken a moment ago, goes up again under the next free name', async () => {
  const filesApi = fakeFilesApi();
  let listed = [];
  filesApi.groupFileIndex = async () => { filesApi.calls.index += 1; return listed; };
  filesApi.uploadGroupFileWithProgress = async (groupId, path) => {
    filesApi.calls.uploads.push(path);
    if (path === 'notes.md') {
      // Grace's notes.md landed between this share's look at the list and its upload.
      listed = [{ path: 'notes.md', size: 9 }];
      throw Object.assign(new Error('Conflict'), { status: 409 });
    }
    return {};
  };
  const { thread, elements, composer, sent } = shareThread({ filesApi });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.filesInput, [file('notes.md', 3), file('plan.pdf', 5)]);
  composer.setHTML('');
  elements.form.dispatchEvent(fakeEvent('submit'));
  for (let i = 0; i < 6; i += 1) await settle();
  assert.deepEqual(filesApi.calls.uploads, ['notes.md', 'plan.pdf', 'notes (2).md']);
  assert.equal(sent[0], '[[files:f~plan.pdf~5;f~notes (2).md~3]]');
  assert.doesNotMatch(elements.formStatus.textContent, /could not be shared/);
});

test('a file in a folder that Spring refuses is left off the message, which says so', async () => {
  const filesApi = fakeFilesApi();
  filesApi.uploadGroupFileWithProgress = async (groupId, path) => {
    filesApi.calls.uploads.push(path);
    if (path === 'site/index.html') throw Object.assign(new Error('Conflict'), { status: 409 });
    return {};
  };
  const { thread, elements, composer, sent } = shareThread({ filesApi });
  thread.open('group', 7, { title: '', subtitle: '' });
  await settle();
  pickFiles(elements.folderInput, [
    Object.assign(file('index.html', 4), { webkitRelativePath: 'site/index.html' }),
    Object.assign(file('main.css', 2), { webkitRelativePath: 'site/main.css' }),
  ]);
  composer.setHTML('');
  elements.form.dispatchEvent(fakeEvent('submit'));
  for (let i = 0; i < 6; i += 1) await settle();
  assert.deepEqual(filesApi.calls.uploads, ['site/index.html', 'site/main.css']);
  assert.equal(sent[0], '[[files:d~site~1~2]]');
  assert.match(elements.formStatus.textContent, /1 could not be shared: site\/index\.html/);
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
