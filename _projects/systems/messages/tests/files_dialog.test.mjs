// The Files dialog (group-dialogs.js initFiles): a group's shared files from spring#280's
// index, as folders, with Download and Preview for one file and a .zip for a folder.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom, settle } from './fake-dom.mjs';

const { document } = installFakeDom();
const { initFiles } = await import('../js/group-dialogs.js');
const { GroupFiles } = await import('../js/group-files.js');
const { FileActions } = await import('../js/file-actions.js');

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
    groupFiles: async groupId => {
      calls.push(['list with bytes', groupId]);
      return [];
    },
    uploadGroupFile: async () => null,
  };
}

function dialogElements() {
  const make = (tag, id) => {
    const node = document.createElement(tag);
    if (id) node.id = id;
    document.body.appendChild(node);
    return node;
  };
  const dialog = make('div', 'filesDialog');
  dialog.className = 'ocs__modal hidden';
  return {
    dialog, title: make('h3'), body: make('div', 'filesBody'), status: make('p'),
    form: make('form'), input: make('input'), upload: make('button'),
  };
}

function openDialog(files, { viewer = { show: async () => {} } } = {}) {
  const api = fakeApi(files);
  const byGroup = new Map();
  const groupFilesFor = id => {
    if (!byGroup.has(id)) byGroup.set(id, new GroupFiles({ api, groupId: id }));
    return byGroup.get(id);
  };
  const elements = dialogElements();
  const dialog = initFiles({
    elements, api, groupFilesFor,
    makeFileActions: ({ filesFor, notify }) => new FileActions({ filesFor, viewer, notify }),
  });
  dialog.open({ id: 7, name: 'Team Seven' }, null);
  return { api, elements, dialog };
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

test('the dialog lists a group\'s index, including a file shared before any files message', async () => {
  const { api, elements } = openDialog([{ path: 'old-notes.txt', size: 12, uploadedBy: 'Grace', text: 'hello there!' }]);
  await settleAll();
  assert.match(elements.title.textContent, /Files in Team Seven/);
  assert.deepEqual(namesIn(elements.body), ['old-notes.txt']);
  assert.match(elements.body.textContent, /Grace/);
  assert.deepEqual(api.calls, [['index', 7]]);
});

test('Download fetches that one file from /files/content, not the whole list', async () => {
  const downloads = catchDownloads();
  try {
    const { api, elements } = openDialog([
      { path: 'a.txt', size: 1, text: 'A' },
      { path: 'b.txt', size: 1, text: 'B' },
    ]);
    await settleAll();
    labelled(elements.body, 'Download b.txt').dispatchEvent(fakeEvent('click'));
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
  const { elements } = openDialog([{ path: 'notes.md', size: 4, text: '# Hi' }], {
    viewer: { show: async details => { shown.push(details); } },
  });
  await settleAll();
  labelled(elements.body, 'Preview notes.md').dispatchEvent(fakeEvent('click'));
  await settleAll();
  assert.equal(shown.length, 1);
  assert.equal(shown[0].name, 'notes.md');
  assert.equal(await shown[0].blob.text(), '# Hi');
});

test('a folder opens as a tree and its .zip holds the files under it', async () => {
  const downloads = catchDownloads();
  try {
    const { api, elements } = openDialog([
      { path: 'site/index.html', size: 4, text: '<h1>' },
      { path: 'site/css/main.css', size: 6, text: 'body{}' },
      { path: 'readme.md', size: 2, text: 'hi' },
    ]);
    await settleAll();
    assert.deepEqual(namesIn(elements.body), ['site', 'readme.md']);
    elements.body.querySelector('.ocs__file--folder').dispatchEvent(fakeEvent('click'));
    assert.deepEqual(namesIn(elements.body), ['css', 'index.html']);

    const zip = elements.body.querySelectorAll('button').find(button => button.textContent.includes('Download as .zip'));
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
