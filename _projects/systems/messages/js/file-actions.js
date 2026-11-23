// What a shared file's buttons do, wherever it's listed (under a message, in the Shared
// panel's Files tab): download it, preview it, open a folder in that tab, or download a
// folder as a .zip.
import { saveBlob } from './dialogs.js';
import { SharedFiles } from './files-model.js';
import { ZipStore } from './zip-store.js';

const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);
const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));

/**
 * A shared file's buttons: Download, Preview, a folder's Open and .zip, and the inline
 * previews under a message.
 */
export class FileActions {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    fileGone: '{filename} is no longer shared with this group.',
    fileFailed: 'Could not download {filename}. Try again.',
    notHere: 'Files can be opened in the group they were shared in.',
    zipping: 'Packing {filename}: {done} of {total} files…',
    zipTooBig: '{filename} is too big to download as one .zip ({size}). Open it and download the files you need.',
  });

  /** A folder over this many bytes is downloaded file by file instead: a .zip is built in memory. */
  static MAX_ZIP_BYTES = 1024 * 1024 * 1024;

  #filesFor;
  #viewer;
  #notify;
  #onOpenFolder;
  #text;
  #thumbnails = new Map(); // path → Promise of a blob URL, for inline image previews

  /**
   * @param {object} options
   * @param {Function} options.filesFor gives the open group's GroupFiles, or null where
   *   files can't be opened
   * @param {object} options.viewer the FileViewer that previews show in
   * @param {Function} options.notify notify(text) says what happened
   * @param {Function|null} options.onOpenFolder onOpenFolder(path) opens a folder in the
   *   Shared panel's Files tab; without it, a folder's Open downloads its .zip
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ filesFor, viewer, notify, onOpenFolder = null, texts = {} }) {
    this.#filesFor = filesFor;
    this.#viewer = viewer;
    this.#notify = notify;
    this.#onOpenFolder = onOpenFolder;
    this.#text = { ...FileActions.TEXTS, ...texts };
  }

  /**
   * Does what a file's button asks. The control is disabled meanwhile.
   * @param {'download'|'preview'|'folder'|'zip'} action
   * @param {object} item a shared item ({ type, path, size })
   * @param {HTMLElement|null} control the button pressed
   */
  async handle(action, item, control = null) {
    const text = this.#text;
    const files = this.#filesFor();
    if (!files) {
      this.#notify(text.notHere);
      return;
    }
    if (action === 'folder' && this.#onOpenFolder) {
      this.#onOpenFolder(item.path);
      return;
    }
    if (control) control.disabled = true;
    try {
      if (action === 'download') await this.#download(files, item);
      else if (action === 'preview') await this.#preview(files, item, control);
      else if (action === 'zip' || action === 'folder') await this.#zip(files, item);
    } catch (error) {
      console.warn(`Messages: could not open ${item.path}`, error);
      this.#notify(fill(error?.status === 404 ? text.fileGone : text.fileFailed, { filename: nameOf(item.path) }));
    } finally {
      if (control) control.disabled = false;
    }
  }

  /**
   * A blob URL for a shared image, fetched once per path: the inline previews under a message.
   * @param {object} item
   * @returns {Promise<string>}
   */
  thumbnail(item) {
    const files = this.#filesFor();
    if (!files) return Promise.reject(new Error('No files here'));
    if (!this.#thumbnails.has(item.path)) {
      const made = files.blob(item.path).then(blob => URL.createObjectURL(blob));
      made.catch(() => this.#thumbnails.delete(item.path));
      this.#thumbnails.set(item.path, made);
    }
    return this.#thumbnails.get(item.path);
  }

  /** Lets go of every preview's URL: when the conversation changes or the pane goes. */
  clear() {
    this.#thumbnails.forEach(made => made.then(url => URL.revokeObjectURL(url), () => {}));
    this.#thumbnails.clear();
  }

  async #download(files, item) {
    saveBlob(await files.blob(item.path), nameOf(item.path));
  }

  async #preview(files, item, control) {
    const blob = await files.blob(item.path);
    await this.#viewer.show({ name: item.path, blob, onDownload: () => saveBlob(blob, nameOf(item.path)) }, control);
  }

  // The folder's size comes from the group's list of files, not the message: anyone can type
  // a marker, and one that understated a folder would load all of it into memory.
  async #zip(files, item) {
    const text = this.#text;
    let entries;
    try {
      entries = await files.folderEntries(item.path, {
        maxBytes: FileActions.MAX_ZIP_BYTES,
        onProgress: (done, total) => this.#notify(fill(text.zipping, { filename: nameOf(item.path), done, total })),
      });
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      this.#notify(fill(text.zipTooBig, { filename: nameOf(item.path), size: SharedFiles.formatBytes(error.size) }));
      return;
    }
    saveBlob(new Blob([ZipStore.build(entries)], { type: 'application/zip' }), `${nameOf(item.path)}.zip`);
    this.#notify('');
  }
}
