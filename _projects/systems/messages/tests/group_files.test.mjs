// GroupFiles: a group's shared files through Spring's index and one-file routes, uploads
// with progress and a few at a time, and the API calls under it (fetch and XHR stubbed).
import assert from 'node:assert/strict';
import test from 'node:test';

import { createMessagesApi } from '../js/messages-api.js';
import { GroupFiles } from '../js/group-files.js';

const config = { javaURI: 'http://spring', pythonURI: 'http://flask', fetchOptions: { credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' } } };

// An XMLHttpRequest stand-in: records what was sent and lets a test answer it.
function fakeRequests() {
  const made = [];
  const create = () => {
    const request = {
      headers: {},
      upload: {},
      open(method, url) { Object.assign(request, { method, url }); },
      setRequestHeader(name, value) { request.headers[name] = value; },
      send(body) { request.body = body; made.push(request); },
      abort() { request.aborted = true; request.onabort?.(); },
      answer(status, text = '') {
        request.upload.onprogress?.({ lengthComputable: true, loaded: request.body.length, total: request.body.length });
        Object.assign(request, { status, responseText: text });
        request.onload?.();
      },
    };
    return request;
  };
  return { made, create };
}

test('uploadGroupFileWithProgress posts the file like fetch would, with credentials, and reports progress', async () => {
  const requests = fakeRequests();
  const api = createMessagesApi({ ...config, createRequest: requests.create });
  const progress = [];
  const done = api.uploadGroupFileWithProgress(7, 'project/a.txt', 'aGk=', { onProgress: (loaded, total) => progress.push([loaded, total]) });
  const [request] = requests.made;
  assert.equal(request.method, 'POST');
  assert.equal(request.url, 'http://spring/api/groups/chat/7/files');
  assert.equal(request.withCredentials, true);
  assert.equal(request.headers['X-Origin'], 'client');
  assert.deepEqual(JSON.parse(request.body), { filename: 'project/a.txt', base64Data: 'aGk=' });
  request.answer(200, '{"filename":"project/a.txt"}');
  assert.deepEqual(await done, { filename: 'project/a.txt' });
  assert.equal(progress.length, 1);
});

test('a failed upload rejects with the status, and an aborted one says so', async () => {
  const requests = fakeRequests();
  const api = createMessagesApi({ ...config, createRequest: requests.create });
  const failed = api.uploadGroupFileWithProgress(7, 'a.txt', 'aGk=');
  requests.made[0].answer(413);
  await assert.rejects(failed, error => error.status === 413);
  const controller = new AbortController();
  const aborted = api.uploadGroupFileWithProgress(7, 'b.txt', 'aGk=', { signal: controller.signal });
  controller.abort();
  await assert.rejects(aborted, error => error.name === 'AbortError');
});

test('the index and one file come from their own routes, the path encoded', async t => {
  const seen = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    seen.push([url, options.method]);
    if (url.endsWith('/files/index')) return new Response('[{"path":"a b.txt","size":3}]');
    return new Response(new Uint8Array([104, 105]));
  });
  const api = createMessagesApi(config);
  assert.deepEqual(await api.groupFileIndex(7), [{ path: 'a b.txt', size: 3 }]);
  const blob = await api.groupFileContent(7, 'proj/a b.txt');
  assert.equal(await blob.text(), 'hi');
  assert.deepEqual(seen, [
    ['http://spring/api/groups/chat/7/files/index', 'GET'],
    ['http://spring/api/groups/chat/7/files/content?path=proj%2Fa%20b.txt', 'GET'],
  ]);
});

function fakeApi({ index = [] } = {}) {
  const calls = { index: 0, uploads: [] };
  return {
    calls,
    groupFileIndex: async () => { calls.index += 1; return index; },
    groupFileContent: async (groupId, path) => new Blob([`bytes of ${path}`]),
    uploadGroupFileWithProgress: (groupId, path, base64, { onProgress } = {}) => new Promise((resolve, reject) => {
      calls.uploads.push({ groupId, path, base64, resolve, reject, onProgress });
    }),
  };
}

const file = (text, name = 'f') => new File([text], name);

test('index is asked for once until refresh()', async () => {
  const api = fakeApi({ index: [{ path: 'a.txt', size: 1 }] });
  const files = new GroupFiles({ api, groupId: 7 });
  await files.index();
  await files.index();
  assert.equal(api.calls.index, 1);
  files.refresh();
  await files.index();
  assert.equal(api.calls.index, 2);
});

test('upload sends three at a time, reports each file and the total, and lists what failed', async () => {
  const api = fakeApi();
  const files = new GroupFiles({ api, groupId: 7, concurrency: 3 });
  const uploads = ['a', 'b', 'c', 'd'].map(name => ({ file: file('12345', name), path: `p/${name}.txt` }));
  const events = [];
  const done = files.upload(uploads, {
    onFile: (path, state) => events.push([path, state]),
    onProgress: fraction => events.push(['total', Math.round(fraction * 100)]),
  });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(api.calls.uploads.length, 3);
  assert.equal(api.calls.uploads[0].base64, 'MTIzNDU=');
  api.calls.uploads[0].onProgress(5, 10);
  api.calls.uploads[0].resolve({});
  api.calls.uploads[1].reject(Object.assign(new Error('nope'), { status: 500 }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(api.calls.uploads.length, 4);
  api.calls.uploads[2].resolve({});
  api.calls.uploads[3].resolve({});
  const result = await done;
  assert.deepEqual(result.done, ['p/a.txt', 'p/c.txt', 'p/d.txt']);
  assert.deepEqual(result.failed.map(failure => failure.path), ['p/b.txt']);
  assert.deepEqual(events.filter(([path]) => path === 'p/a.txt').map(([, state]) => state), ['uploading', 'done']);
  assert.deepEqual(events.find(([path]) => path === 'p/b.txt' && path).slice(1), ['uploading']);
  assert.ok(events.some(([path, state]) => path === 'p/b.txt' && state === 'failed'));
  assert.equal(events.filter(([path]) => path === 'total').at(-1)[1], 100);
});

test('a taken name (409) is reported to the caller without a console warning', async t => {
  const warned = [];
  t.mock.method(console, 'warn', (...args) => warned.push(args));
  const api = fakeApi();
  api.uploadGroupFileWithProgress = async () => { throw Object.assign(new Error('HTTP 409'), { status: 409 }); };
  const files = new GroupFiles({ api, groupId: 7 });
  const states = [];
  const result = await files.upload([{ file: file('x', 'notes.md'), path: 'notes.md' }], {
    onFile: (path, state, error) => states.push([path, state, error?.status]),
  });
  assert.deepEqual(result.failed.map(failure => [failure.path, failure.error.status]), [['notes.md', 409]]);
  assert.deepEqual(states, [['notes.md', 'uploading', undefined], ['notes.md', 'failed', 409]]);
  assert.deepEqual(warned, []);
});

test('cancel stops the uploads that have not started and aborts the rest', async () => {
  const api = fakeApi();
  const files = new GroupFiles({ api, groupId: 7, concurrency: 1 });
  const controller = new AbortController();
  const done = files.upload([{ file: file('1'), path: 'a' }, { file: file('2'), path: 'b' }], { signal: controller.signal });
  await new Promise(resolve => setTimeout(resolve, 0));
  controller.abort();
  api.calls.uploads[0].reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
  const result = await done;
  assert.equal(result.cancelled, true);
  assert.equal(api.calls.uploads.length, 1);
  assert.deepEqual(result.done, []);
});

test('folderEntries refuses a folder over maxBytes by the index’s sizes, before fetching a file', async () => {
  const api = fakeApi({ index: [{ path: 'v/a.mp4', size: 700 }, { path: 'v/b.mp4', size: 700 }, { path: 'other.mp4', size: 5000 }] });
  const fetched = [];
  api.groupFileContent = async (groupId, path) => { fetched.push(path); return new Blob(['x']); };
  const files = new GroupFiles({ api, groupId: 7 });
  await assert.rejects(files.folderEntries('v', { maxBytes: 1000 }), error => error instanceof RangeError && error.size === 1400);
  assert.deepEqual(fetched, []);
  assert.equal((await files.folderEntries('v', { maxBytes: 1400 })).length, 2);
});

test('folderEntries stops once the bytes that arrive pass maxBytes, when the list’s sizes are out of date', async () => {
  const api = fakeApi({ index: [{ path: 'v/a.bin', size: 1 }, { path: 'v/b.bin', size: 1 }, { path: 'v/c.bin', size: 1 }] });
  const fetched = [];
  api.groupFileContent = async (groupId, path) => { fetched.push(path); return new Blob(['x'.repeat(600)]); };
  const files = new GroupFiles({ api, groupId: 7 });
  await assert.rejects(files.folderEntries('v', { maxBytes: 1000 }), error => error instanceof RangeError && error.size === 1200);
  assert.deepEqual(fetched, ['v/a.bin', 'v/b.bin'], 'c.bin is never fetched');
});

test('folderEntries fetches every file under a folder for a ZIP', async () => {
  const api = fakeApi({ index: [{ path: 'p/a.txt', size: 1 }, { path: 'p/q/b.txt', size: 1 }, { path: 'other.txt', size: 1 }] });
  const files = new GroupFiles({ api, groupId: 7 });
  const steps = [];
  const entries = await files.folderEntries('p', { onProgress: (done, total) => steps.push(`${done}/${total}`) });
  assert.deepEqual(entries.map(entry => entry.path), ['p/a.txt', 'p/q/b.txt']);
  assert.equal(new TextDecoder().decode(entries[1].bytes), 'bytes of p/q/b.txt');
  assert.deepEqual(steps, ['1/2', '2/2']);
});
