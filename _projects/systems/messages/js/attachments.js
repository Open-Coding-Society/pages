// The files waiting to go with the next message in a group chat, shown in a tray above the
// composer, and the ways in: the Attach menu's Files and Folder pickers, and dropping files
// or whole folders anywhere on the conversation. While a share uploads, the tray shows each
// file or folder's progress and a Cancel.
import {
  FILE_LIMIT_BYTES, MAX_LOOSE_FILES, MAX_SHARE_FILES, SKIPPED_NAMES, countFiles, fileKind, formatBytes, planShare, shareSummary,
} from './files-model.js';

export const ATTACH_TEXTS = Object.freeze({
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

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const listNames = names => (names.length > 3 ? `${names.slice(0, 3).join(', ')} and ${names.length - 3} more` : names.join(', '));
const topOf = path => String(path).split('/')[0];

// From a file input: a folder picker (webkitdirectory) gives each file's path inside the
// folder, a files picker just the names.
export function entriesFromInput(fileList) {
  return [...(fileList || [])].map(file => ({ file, path: file.webkitRelativePath || file.name }));
}

// From a drop. Folders are walked with the File and Directory Entries API; a skipped folder
// (node_modules, .git…) isn't opened at all and is named in skippedFolders. Stops reading
// after `limit` files, so dropping a huge folder can't freeze the page. The entries have to
// be taken from the DataTransfer before the drop event ends, which is why that happens before
// this function's first await.
export async function entriesFromDrop(dataTransfer, { limit = MAX_SHARE_FILES + 1 } = {}) {
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
      if (!SKIPPED_NAMES.includes(entry.name)) result.entries.push({ file: await fileOf(entry), path });
      return;
    }
    if (SKIPPED_NAMES.includes(entry.name)) {
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

// tray: the element above the composer that shows what waits. onChange() after any change.
export function createAttachments({ tray, texts = {}, onChange = () => {} }) {
  const text = { ...ATTACH_TEXTS, ...texts };
  let entries = [];
  let skippedFolders = [];
  let upload = null; // { rows: Map(top → { progress, meta, total, done }), overall, status } while sharing

  const plan = () => planShare(entries, new Set());

  function notes(current) {
    const lines = [];
    if (skippedFolders.length) lines.push(fill(text.skippedFolders, { names: listNames(skippedFolders) }));
    if (current.skipped) lines.push(fill(text.skippedFiles, { files: countFiles(current.skipped) }));
    if (current.tooBig.length) {
      lines.push(fill(text.tooBig, { files: countFiles(current.tooBig.length), limit: formatBytes(FILE_LIMIT_BYTES), names: listNames(current.tooBig) }));
    }
    if (current.invalid.length) lines.push(fill(text.invalid, { files: countFiles(current.invalid.length), names: listNames(current.invalid) }));
    if (current.problem && entries.length) {
      lines.push(fill(text[current.problem], { max: current.problem === 'tooManyLoose' ? MAX_LOOSE_FILES : MAX_SHARE_FILES }));
    }
    return lines;
  }

  function row(item) {
    const isFolder = item.type === 'folder';
    const line = element('li', `ocs__file${isFolder ? ' ocs__file--folder' : ''}`);
    line.dataset.top = topOf(item.path);
    const icon = element('i', `fas ${isFolder ? 'fa-folder' : fileKind(item.path).icon} ocs__file-icon`);
    icon.setAttribute('aria-hidden', 'true');
    const body = element('div', 'ocs__file-text');
    const name = element('b', 'ocs__file-name', item.path);
    name.title = item.path;
    const meta = element('em', 'ocs__file-meta', isFolder
      ? fill(text.folderMeta, { files: countFiles(item.count), size: formatBytes(item.size) })
      : formatBytes(item.size));
    body.append(name, meta);
    const actions = element('div', 'ocs__file-actions');
    if (!upload) {
      actions.appendChild(iconButton('fa-xmark', fill(text.remove, { name: item.path }), () => remove(topOf(item.path))));
    }
    line.append(icon, body, actions);
    return { line, meta, body };
  }

  function render() {
    tray.replaceChildren();
    tray.hidden = entries.length === 0 && skippedFolders.length === 0;
    if (tray.hidden) return;
    const current = upload ? upload.share : plan();
    const head = element('div', 'dm__tray-head');
    const title = element('b', 'dm__tray-title');
    head.appendChild(title);
    if (upload) {
      title.textContent = fill(text.sharing, { done: upload.finished, total: upload.total });
      head.appendChild(upload.cancelButton);
    } else {
      title.textContent = current.items.length ? `${text.ready} · ${shareSummary(current.items)}` : text.ready;
      const clearButton = element('button', 'ocs__btn small', text.clear);
      clearButton.type = 'button';
      clearButton.addEventListener('click', clear);
      head.appendChild(clearButton);
    }
    tray.appendChild(head);
    if (upload) tray.appendChild(upload.overall);
    const list = element('ul', 'ocs__file-list');
    current.items.forEach(item => {
      const { line, meta, body } = row(item);
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
    notes(current).forEach(line => tray.appendChild(element('em', 'dm__tray-note', line)));
  }

  function changed() {
    render();
    onChange();
  }

  function add(found) {
    if (upload) return;
    const byPath = new Map(entries.map(entry => [entry.path, entry]));
    (found.entries || []).forEach(entry => byPath.set(entry.path, entry));
    entries = [...byPath.values()];
    skippedFolders = [...new Set([...skippedFolders, ...(found.skippedFolders || [])])];
    changed();
  }

  function remove(top) {
    if (upload) return;
    entries = entries.filter(entry => topOf(entry.path) !== top);
    skippedFolders = skippedFolders.filter(path => topOf(path) !== top);
    changed();
  }

  function clear() {
    if (upload) return;
    entries = [];
    skippedFolders = [];
    changed();
  }

  // Switches the tray to progress for `share`, the planShare result being uploaded: the tray
  // now lists it as it goes up, with any "(2)" renames. onCancel runs when Cancel is pressed.
  // Returns the callbacks GroupFiles.upload reports to.
  function beginUpload(share, { onCancel }) {
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
    upload = { share, rows, overall, cancelButton, total: share.uploads.length, finished: 0 };
    render();
    onChange();
    return {
      onFile(path, state) {
        const progress = rows.get(topOf(path));
        if (!progress) return;
        if (state === 'done' || state === 'failed') {
          progress.finished += 1;
          upload.finished += 1;
          if (state === 'failed') progress.failed += 1;
          progress.bar.value = progress.finished / progress.total;
          if (progress.finished < progress.total) progress.label = `${progress.finished} / ${progress.total}`;
          else progress.label = progress.failed ? text.failed : text.done;
        } else if (progress.label === text.waiting) {
          progress.label = progress.total > 1 ? `0 / ${progress.total}` : '…';
        }
        render();
      },
      onProgress(fraction) {
        overall.value = fraction;
      },
    };
  }

  // Back to an empty tray once a share is done (or to the same entries if it was cancelled).
  function endUpload({ keep = false } = {}) {
    upload = null;
    if (!keep) {
      entries = [];
      skippedFolders = [];
    }
    changed();
  }

  render();

  return {
    add,
    remove,
    clear,
    beginUpload,
    endUpload,
    entries: () => [...entries],
    isEmpty: () => entries.length === 0,
    isUploading: () => Boolean(upload),
    // What's wrong with the tray as it stands, if anything: a planShare problem.
    problem: () => (entries.length ? plan().problem : null),
  };
}
