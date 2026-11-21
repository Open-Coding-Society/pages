// The files waiting to go with the next message in a group chat, shown in a tray above the
// composer, and the ways in: the Attach menu's Files and Folder pickers, and dropping files
// or whole folders anywhere on the conversation. While a share uploads, the tray shows each
// file or folder's progress and a Cancel.
import { SharedFiles } from './files-model.js';

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const listNames = names => (names.length > 3 ? `${names.slice(0, 3).join(', ')} and ${names.length - 3} more` : names.join(', '));
const topOf = path => String(path).split('/')[0];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function iconButton(icon, label, onClick) {
  const control = element('button', 'ocs__btn small');
  control.type = 'button';
  control.setAttribute('aria-label', label);
  control.title = label;
  const glyph = element('i', `fas ${icon}`);
  glyph.setAttribute('aria-hidden', 'true');
  control.appendChild(glyph);
  control.addEventListener('click', onClick);
  return control;
}

/**
 * The tray of files waiting to be shared, and reading files from a picker or a drop.
 */
export class Attachments {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    ready: 'Ready to share',
    sharing: 'Sharing {done} of {total}…',
    clear: 'Clear',
    cancel: 'Cancel',
    remove: 'Remove {name}',
    folderMeta: '{files} · {size}',
    waiting: 'Waiting',
    done: 'Shared',
    failed: 'Not shared',
    skippedFolders: 'Left out {names}: tool and system folders aren’t shared.',
    skippedFiles: 'Left out {files} from tool and system folders.',
    tooBig: '{files} over {limit} left out: {names}.',
    invalid: '{files} with names that can’t be stored left out: {names}.',
    tooMany: 'That’s more than {max} files. Share a smaller folder, or zip it first.',
    tooManyLoose: 'That’s more than {max} separate files. Put them in a folder and share the folder.',
    empty: 'Nothing here can be shared.',
  });

  /**
   * The entries a file input picked: a folder picker (webkitdirectory) gives each file's
   * path inside the folder, a files picker just the names.
   * @param {FileList} fileList
   * @returns {Array<{file: File, path: string}>}
   */
  static fromInput(fileList) {
    return [...(fileList || [])].map(file => ({ file, path: file.webkitRelativePath || file.name }));
  }

  /**
   * The entries of a drop. Folders are walked with the File and Directory Entries API; a
   * skipped folder (node_modules, .git…) isn't opened at all and is named in
   * skippedFolders. Reading stops after `limit` files, so dropping a huge folder can't
   * freeze the page. The entries are taken from the DataTransfer before the first await,
   * while the drop event still lets them be read.
   * @param {DataTransfer} dataTransfer
   * @param {{limit?: number}} options
   * @returns {Promise<{entries: Array, skippedFolders: string[], truncated: boolean}>}
   */
  static async fromDrop(dataTransfer, { limit = SharedFiles.MAX_SHARE_FILES + 1 } = {}) {
    const result = { entries: [], skippedFolders: [], truncated: false };
    const items = [...(dataTransfer?.items || [])].filter(item => item.kind === 'file');
    const roots = items.map(item => (typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null));
    if (!roots.length || roots.some(root => !root)) {
      result.entries = [...(dataTransfer?.files || [])].map(file => ({ file, path: file.name }));
      return result;
    }
    const readBatch = reader => new Promise((resolve, reject) => reader.readEntries(resolve, reject));
    const fileOf = entry => new Promise((resolve, reject) => entry.file(resolve, reject));

    async function walk(entry, prefix) {
      if (result.entries.length >= limit) {
        result.truncated = true;
        return;
      }
      const path = `${prefix}${entry.name}`;
      if (entry.isFile) {
        if (!SharedFiles.SKIPPED_NAMES.includes(entry.name)) result.entries.push({ file: await fileOf(entry), path });
        return;
      }
      if (SharedFiles.SKIPPED_NAMES.includes(entry.name)) {
        result.skippedFolders.push(path);
        return;
      }
      const reader = entry.createReader();
      // readEntries answers in batches (100 at a time in Chrome) until it answers with none.
      for (let batch = await readBatch(reader); batch.length; batch = await readBatch(reader)) {
        for (const child of batch) await walk(child, `${path}/`);
      }
    }

    for (const root of roots) await walk(root, '');
    return result;
  }

  #tray;
  #text;
  #onChange;
  #entries = [];
  #skippedFolders = [];
  #upload = null; // { share, rows: Map(top → { bar, total, finished, failed, label }), overall, cancelButton, total, finished } while sharing

  /**
   * Shows the (empty) tray.
   * @param {object} options
   * @param {HTMLElement} options.tray the element above the composer that shows what waits
   * @param {object} options.texts wording over TEXTS
   * @param {Function} options.onChange after any change
   */
  constructor({ tray, texts = {}, onChange = () => {} }) {
    this.#tray = tray;
    this.#text = { ...Attachments.TEXTS, ...texts };
    this.#onChange = onChange;
    this.#render();
  }

  /**
   * Adds what a picker or a drop found; a path already waiting is replaced.
   * @param {{entries?: Array, skippedFolders?: string[]}} found
   */
  add(found) {
    if (this.#upload) return;
    const byPath = new Map(this.#entries.map(entry => [entry.path, entry]));
    (found.entries || []).forEach(entry => byPath.set(entry.path, entry));
    this.#entries = [...byPath.values()];
    this.#skippedFolders = [...new Set([...this.#skippedFolders, ...(found.skippedFolders || [])])];
    this.#changed();
  }

  /**
   * Takes a file or a whole folder out of the tray.
   * @param {string} top the top-level name
   */
  remove(top) {
    if (this.#upload) return;
    this.#entries = this.#entries.filter(entry => topOf(entry.path) !== top);
    this.#skippedFolders = this.#skippedFolders.filter(path => topOf(path) !== top);
    this.#changed();
  }

  /** Empties the tray. */
  clear() {
    if (this.#upload) return;
    this.#entries = [];
    this.#skippedFolders = [];
    this.#changed();
  }

  /**
   * Switches the tray to progress for a share being uploaded: it now lists the share as it
   * goes up, with any "(2)" renames.
   * @param {object} share the SharedFiles.planShare result being uploaded
   * @param {{onCancel: Function}} options onCancel runs when Cancel is pressed
   * @returns {{onFile: Function, onProgress: Function}} the callbacks GroupFiles.upload reports to
   */
  beginUpload(share, { onCancel }) {
    const text = this.#text;
    const rows = new Map();
    share.uploads.forEach(({ path }) => {
      const top = topOf(path);
      if (!rows.has(top)) {
        const bar = element('progress', 'ocs__progress');
        bar.max = 1;
        bar.value = 0;
        rows.set(top, { bar, total: 0, finished: 0, failed: 0, label: text.waiting });
      }
      rows.get(top).total += 1;
    });
    const overall = element('progress', 'ocs__progress dm__tray-progress');
    overall.max = 1;
    overall.value = 0;
    const cancelButton = element('button', 'ocs__btn small', text.cancel);
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', () => {
      cancelButton.disabled = true;
      onCancel();
    });
    this.#upload = { share, rows, overall, cancelButton, total: share.uploads.length, finished: 0 };
    this.#render();
    this.#onChange();
    return {
      onFile: (path, state) => {
        const progress = rows.get(topOf(path));
        if (!progress) return;
        if (state === 'done' || state === 'failed') {
          progress.finished += 1;
          this.#upload.finished += 1;
          if (state === 'failed') progress.failed += 1;
          progress.bar.value = progress.finished / progress.total;
          if (progress.finished < progress.total) progress.label = `${progress.finished} / ${progress.total}`;
          else progress.label = progress.failed ? text.failed : text.done;
        } else if (progress.label === text.waiting) {
          progress.label = progress.total > 1 ? `0 / ${progress.total}` : '…';
        }
        this.#render();
      },
      onProgress: fraction => {
        overall.value = fraction;
      },
    };
  }

  /**
   * Back to an empty tray once a share is done, or to the same files if it was cancelled.
   * @param {{keep?: boolean}} options keep leaves the files in the tray
   */
  endUpload({ keep = false } = {}) {
    this.#upload = null;
    if (!keep) {
      this.#entries = [];
      this.#skippedFolders = [];
    }
    this.#changed();
  }

  /** @returns {Array<{file: File, path: string}>} what waits, as a copy */
  entries() {
    return [...this.#entries];
  }

  /** @returns {boolean} whether nothing waits */
  isEmpty() {
    return this.#entries.length === 0;
  }

  /** @returns {boolean} whether a share is uploading */
  isUploading() {
    return Boolean(this.#upload);
  }

  /** @returns {string|null} what's wrong with the tray as it stands: a planShare problem, or null */
  problem() {
    return this.#entries.length ? this.#plan().problem : null;
  }

  #plan() {
    return SharedFiles.planShare(this.#entries, new Set());
  }

  #notes(current) {
    const text = this.#text;
    const lines = [];
    if (this.#skippedFolders.length) lines.push(fill(text.skippedFolders, { names: listNames(this.#skippedFolders) }));
    if (current.skipped) lines.push(fill(text.skippedFiles, { files: SharedFiles.countFiles(current.skipped) }));
    if (current.tooBig.length) {
      lines.push(fill(text.tooBig, {
        files: SharedFiles.countFiles(current.tooBig.length), limit: SharedFiles.formatBytes(SharedFiles.FILE_LIMIT_BYTES), names: listNames(current.tooBig),
      }));
    }
    if (current.invalid.length) lines.push(fill(text.invalid, { files: SharedFiles.countFiles(current.invalid.length), names: listNames(current.invalid) }));
    if (current.problem && this.#entries.length) {
      lines.push(fill(text[current.problem], { max: current.problem === 'tooManyLoose' ? SharedFiles.MAX_LOOSE_FILES : SharedFiles.MAX_SHARE_FILES }));
    }
    return lines;
  }

  #row(item) {
    const text = this.#text;
    const isFolder = item.type === 'folder';
    const line = element('li', `ocs__file${isFolder ? ' ocs__file--folder' : ''}`);
    line.dataset.top = topOf(item.path);
    const icon = element('i', `fas ${isFolder ? 'fa-folder' : SharedFiles.fileKind(item.path).icon} ocs__file-icon`);
    icon.setAttribute('aria-hidden', 'true');
    const body = element('div', 'ocs__file-text');
    const name = element('b', 'ocs__file-name', item.path);
    name.title = item.path;
    const meta = element('em', 'ocs__file-meta', isFolder
      ? fill(text.folderMeta, { files: SharedFiles.countFiles(item.count), size: SharedFiles.formatBytes(item.size) })
      : SharedFiles.formatBytes(item.size));
    body.append(name, meta);
    const actions = element('div', 'ocs__file-actions');
    if (!this.#upload) {
      actions.appendChild(iconButton('fa-xmark', fill(text.remove, { name: item.path }), () => this.remove(topOf(item.path))));
    }
    line.append(icon, body, actions);
    return { line, meta, body };
  }

  #render() {
    const text = this.#text;
    const tray = this.#tray;
    const upload = this.#upload;
    tray.replaceChildren();
    tray.hidden = this.#entries.length === 0 && this.#skippedFolders.length === 0;
    if (tray.hidden) return;
    const current = upload ? upload.share : this.#plan();
    const head = element('div', 'dm__tray-head');
    const title = element('b', 'dm__tray-title');
    head.appendChild(title);
    if (upload) {
      title.textContent = fill(text.sharing, { done: upload.finished, total: upload.total });
      head.appendChild(upload.cancelButton);
    } else {
      title.textContent = current.items.length ? `${text.ready} · ${SharedFiles.shareSummary(current.items)}` : text.ready;
      const clearButton = element('button', 'ocs__btn small', text.clear);
      clearButton.type = 'button';
      clearButton.addEventListener('click', () => this.clear());
      head.appendChild(clearButton);
    }
    tray.appendChild(head);
    if (upload) tray.appendChild(upload.overall);
    const list = element('ul', 'ocs__file-list');
    current.items.forEach(item => {
      const { line, meta, body } = this.#row(item);
      if (upload) {
        const progress = upload.rows.get(topOf(item.path));
        if (progress) {
          meta.textContent = progress.label;
          body.appendChild(progress.bar);
        }
      }
      list.appendChild(line);
    });
    tray.appendChild(list);
    this.#notes(current).forEach(line => tray.appendChild(element('em', 'dm__tray-note', line)));
  }

  #changed() {
    this.#render();
    this.#onChange();
  }
}
