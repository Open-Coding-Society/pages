// One group's shared files: the list (Spring's index, without bytes), one file's bytes, a
// folder's files for a ZIP, and uploads. The composer's share, the files under a message and
// the Files panel all go through one of these per group, so the list is fetched once and
// refreshed when someone shares something.
import { filesUnder } from './files-model.js';

// How a file goes up: base64 inside JSON, as Spring's POST /files takes it. FileReader in a
// browser; Node (the tests) has no FileReader, so there the bytes are encoded by hand.
export async function readFileAsBase64(file) {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(reader.error || new Error(`Could not read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let at = 0; at < bytes.length; at += 0x8000) binary += String.fromCharCode(...bytes.subarray(at, at + 0x8000));
  return btoa(binary);
}

const isAbort = error => error?.name === 'AbortError';

export class GroupFiles {
  constructor({ api, groupId, concurrency = 3 }) {
    this.api = api;
    this.groupId = groupId;
    this.concurrency = concurrency;
    this.cached = null;
  }

  // [{ path, size, uploadedBy, uploadedAt }], asked for once until refresh().
  index() {
    if (!this.cached) {
      this.cached = this.api.groupFileIndex(this.groupId).then(list => list || []);
      // A failed list isn't kept, so the next look asks again.
      this.cached.catch(() => { this.cached = null; });
    }
    return this.cached;
  }

  refresh() {
    this.cached = null;
  }

  blob(path) {
    return this.api.groupFileContent(this.groupId, path);
  }

  // Every file under a folder with its bytes, for zipStore. onProgress(done, total) after each.
  // A folder over maxBytes throws a RangeError carrying its size: first by the group's list,
  // before any file is fetched (not the size a message gives), then by the bytes that arrive,
  // since a list kept from earlier can be out of date.
  async folderEntries(folderPath, { maxBytes = Infinity, onProgress = () => {} } = {}) {
    const tooBig = size => Object.assign(new RangeError(`${folderPath} holds ${size} bytes, over ${maxBytes}`), { size });
    const inside = filesUnder(await this.index(), folderPath);
    const listed = inside.reduce((total, file) => total + (Number(file.size) || 0), 0);
    if (listed > maxBytes) throw tooBig(listed);
    const entries = [];
    let received = 0;
    for (const file of inside) {
      const blob = await this.blob(file.path);
      received += blob.size;
      if (received > maxBytes) throw tooBig(received);
      entries.push({ path: file.path, bytes: new Uint8Array(await blob.arrayBuffer()) });
      onProgress(entries.length, inside.length);
    }
    return entries;
  }

  // Uploads [{ file, path }] a few at a time. onFile(path, 'uploading' | 'done' | 'failed',
  // error) as each one moves on, onProgress(fraction) for the whole share by bytes sent. Resolves
  // { done: [path], failed: [{ path, error }], cancelled } and never rejects: one file that
  // fails doesn't stop the others. Aborting `signal` starts nothing new and cancels the rest.
  async upload(uploads, { onFile = () => {}, onProgress = () => {}, signal = null } = {}) {
    const total = uploads.reduce((sum, upload) => sum + (upload.file.size || 0), 0) || 1;
    const sent = new Map();
    const report = () => onProgress(Math.min(1, [...sent.values()].reduce((sum, bytes) => sum + bytes, 0) / total));
    const result = { done: [], failed: [], cancelled: false };
    const queue = [...uploads];

    const next = async () => {
      while (queue.length && !signal?.aborted) {
        const { file, path } = queue.shift();
        onFile(path, 'uploading');
        try {
          const base64 = await readFileAsBase64(file);
          await this.api.uploadGroupFileWithProgress(this.groupId, path, base64, {
            signal,
            // Progress counts the base64 body, which is a third bigger than the file.
            onProgress: (loaded, bodySize) => {
              sent.set(path, Math.round((file.size || 0) * (bodySize ? loaded / bodySize : 0)));
              report();
            },
          });
          sent.set(path, file.size || 0);
          report();
          result.done.push(path);
          onFile(path, 'done');
        } catch (error) {
          if (isAbort(error) || signal?.aborted) {
            result.cancelled = true;
            continue;
          }
          // A taken name (409) isn't a fault: the composer shares that file under the next name.
          if (error?.status !== 409) console.warn(`Messages: could not share ${path}`, error);
          // Finished, if not shared: the bar measures how far through the share it is.
          sent.set(path, file.size || 0);
          report();
          result.failed.push({ path, error });
          onFile(path, 'failed', error);
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(this.concurrency, uploads.length) }, next));
    if (signal?.aborted) result.cancelled = true;
    // Sort into the order the files were given, which a few workers mix up.
    const order = new Map(uploads.map((upload, index) => [upload.path, index]));
    result.done.sort((a, b) => order.get(a) - order.get(b));
    this.refresh();
    return result;
  }
}
