// What a shared file's buttons do, wherever it's listed (under a message, in the Files
// panel): download it, preview it, open a folder in the Files panel, or download a folder as
// a .zip. `filesFor()` is the open group's GroupFiles, or null where files can't be opened.
import { saveBlob } from './dialogs.js';
import { formatBytes } from './files-model.js';
import { zipStore } from './zip-store.js';

export const FILE_ACTION_TEXTS = Object.freeze({
  fileGone: '{filename} is no longer shared with this group.',
  fileFailed: 'Could not download {filename}. Try again.',
  notHere: 'Files can be opened in the group they were shared in.',
  zipping: 'Packing {filename}: {done} of {total} files…',
  zipTooBig: '{filename} is too big to download as one .zip ({size}). Open it and download the files you need.',
});

// A folder over this is downloaded file by file instead: a .zip is built in memory.
export const MAX_ZIP_BYTES = 1024 * 1024 * 1024;

const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);
const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

export function createFileActions({ filesFor, viewer, notify, onOpenFolder = null, texts = {} }) {
  const text = { ...FILE_ACTION_TEXTS, ...texts };
  const thumbnails = new Map(); // path → Promise of a blob URL, for inline image previews

  async function download(files, item) {
    saveBlob(await files.blob(item.path), nameOf(item.path));
  }

  async function preview(files, item, control) {
    const blob = await files.blob(item.path);
    await viewer.show({ name: item.path, blob, onDownload: () => saveBlob(blob, nameOf(item.path)) }, control);
  }

  // The folder's size comes from the group's list of files, not the message: anyone can type
  // a marker, and one that understated a folder would load all of it into memory.
  async function zip(files, item) {
    let entries;
    try {
      entries = await files.folderEntries(item.path, {
        maxBytes: MAX_ZIP_BYTES,
        onProgress: (done, total) => notify(fill(text.zipping, { filename: nameOf(item.path), done, total })),
      });
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      notify(fill(text.zipTooBig, { filename: nameOf(item.path), size: formatBytes(error.size) }));
      return;
    }
    saveBlob(new Blob([zipStore(entries)], { type: 'application/zip' }), `${nameOf(item.path)}.zip`);
    notify('');
  }

  // action: 'download' | 'preview' | 'folder' | 'zip'. The control is disabled meanwhile.
  async function handle(action, item, control = null) {
    const files = filesFor();
    if (!files) {
      notify(text.notHere);
      return;
    }
    if (action === 'folder' && onOpenFolder) {
      onOpenFolder(item.path);
      return;
    }
    if (control) control.disabled = true;
    try {
      if (action === 'download') await download(files, item);
      else if (action === 'preview') await preview(files, item, control);
      else if (action === 'zip' || action === 'folder') await zip(files, item);
    } catch (error) {
      console.warn(`Messages: could not open ${item.path}`, error);
      notify(fill(error?.status === 404 ? text.fileGone : text.fileFailed, { filename: nameOf(item.path) }));
    } finally {
      if (control) control.disabled = false;
    }
  }

  // A blob URL for a shared image, fetched once per path: the inline previews under a message.
  function thumbnail(item) {
    const files = filesFor();
    if (!files) return Promise.reject(new Error('No files here'));
    if (!thumbnails.has(item.path)) {
      const made = files.blob(item.path).then(blob => URL.createObjectURL(blob));
      made.catch(() => thumbnails.delete(item.path));
      thumbnails.set(item.path, made);
    }
    return thumbnails.get(item.path);
  }

  // Lets go of every preview's URL: when the conversation changes or the pane goes.
  function clear() {
    thumbnails.forEach(made => made.then(url => URL.revokeObjectURL(url), () => {}));
    thumbnails.clear();
  }

  return { handle, thumbnail, clear };
}
