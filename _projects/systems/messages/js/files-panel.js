// The Files panel: everything shared with a group, as folders. Opened from the conversation
// header (or a shared folder's Open button), it lists the folder you're in with breadcrumbs
// back up, filters every file by name as you type, and previews, downloads or zips. Sharing
// starts from the composer, so whatever goes up is announced in the chat.
import { createDialog } from './dialogs.js';
import { buildTree, countFiles, fileKind, formatBytes } from './files-model.js';

export const FILES_PANEL_TEXTS = Object.freeze({
  title: 'Files in {group}',
  root: 'All files',
  filter: 'Filter files by name',
  loading: 'Loading files…',
  loadFailed: 'Could not load the files. Try again.',
  empty: 'No files shared yet. Drop files or a folder on the conversation, or use Attach.',
  emptyFolder: 'This folder is empty.',
  noMatches: 'No file names have “{query}” in them.',
  matches: '{count} match{plural}',
  folderMeta: '{files} · {size}',
  fileMeta: '{size} · {who}',
  someone: 'someone',
  zipFolder: 'Download as .zip',
  share: 'Share files',
  preview: 'Preview {name}',
  download: 'Download {name}',
  summary: '{files} · {size}',
});

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name, extra = '') {
  const glyph = el('i', `fas ${name}${extra ? ` ${extra}` : ''}`);
  glyph.setAttribute('aria-hidden', 'true');
  return glyph;
}

// A labelled icon button in the grammar: the icon and text go straight in the button.
function button(className, glyph, label, onClick, { iconOnly = false } = {}) {
  const control = el('button', className);
  control.type = 'button';
  control.appendChild(icon(glyph));
  if (iconOnly) {
    control.setAttribute('aria-label', label);
    control.title = label;
  } else {
    control.append(` ${label}`);
  }
  control.addEventListener('click', () => onClick(control));
  return control;
}

// elements: dialog, title, body (the Files tab's content), status. groupFilesFor(groupId)
// gives that group's GroupFiles; fileActions(filesFor) makes the buttons' handler for it.
export function createFilesPanel({ elements, groupFilesFor, makeFileActions, onShare = null, texts = {} }) {
  const text = { ...FILES_PANEL_TEXTS, ...texts };
  let group = null;
  let path = '';
  let query = '';
  let index = [];
  let loadCount = 0;

  const notify = message => { elements.status.textContent = message; };
  const actions = makeFileActions({ filesFor: () => (group ? groupFilesFor(group.id) : null), notify });
  const dialog = createDialog(elements.dialog, {
    onClose: () => {
      loadCount += 1;
      group = null;
    },
  });

  function crumbs(tree) {
    const nav = el('nav', 'ocs__links dm__crumbs');
    nav.setAttribute('aria-label', 'Folder');
    const parts = path ? path.split('/') : [];
    const levels = [{ name: text.root, at: '' }, ...parts.map((name, i) => ({ name, at: parts.slice(0, i + 1).join('/') }))];
    levels.forEach((level, i) => {
      const last = i === levels.length - 1;
      const crumb = el('button', `ocs__btn small${last ? ' accent' : ''}`);
      crumb.type = 'button';
      if (i === 0) crumb.append(icon('fa-folder-tree'), ` ${level.name}`);
      else crumb.textContent = level.name;
      if (last) crumb.setAttribute('aria-current', 'location');
      crumb.addEventListener('click', () => go(level.at));
      nav.appendChild(crumb);
    });
    const summary = el('em', 'ocs__file-meta dm__crumbs-summary', fill(text.summary, { files: countFiles(tree.count), size: formatBytes(tree.size) }));
    nav.appendChild(summary);
    return nav;
  }

  function folderRow(folder) {
    const item = el('li');
    const row = el('button', 'ocs__file ocs__file--folder');
    row.type = 'button';
    const body = el('div', 'ocs__file-text');
    body.append(el('b', 'ocs__file-name', folder.name), el('em', 'ocs__file-meta', fill(text.folderMeta, { files: countFiles(folder.count), size: formatBytes(folder.size) })));
    row.append(icon('fa-folder', 'ocs__file-icon'), body, icon('fa-chevron-right'));
    row.addEventListener('click', () => go(folder.path));
    item.appendChild(row);
    return item;
  }

  function fileRow(file, { showPath = false } = {}) {
    const name = nameOf(file.path);
    const kind = fileKind(file.path);
    const row = el('li', 'ocs__file');
    const body = el('div', 'ocs__file-text');
    const title = el('b', 'ocs__file-name', showPath ? file.path : name);
    title.title = file.path;
    const when = file.uploadedAt ? new Date(file.uploadedAt) : null;
    const meta = fill(text.fileMeta, { size: formatBytes(file.size), who: file.uploadedBy || text.someone })
      + (when && !Number.isNaN(when.getTime()) ? ` · ${when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : '');
    body.append(title, el('em', 'ocs__file-meta', meta));
    const tools = el('div', 'ocs__file-actions');
    const item = { type: 'file', path: file.path, size: file.size };
    if (kind.preview) tools.appendChild(button('ocs__btn small', 'fa-eye', fill(text.preview, { name }), control => actions.handle('preview', item, control), { iconOnly: true }));
    tools.appendChild(button('ocs__btn small', 'fa-download', fill(text.download, { name }), control => actions.handle('download', item, control), { iconOnly: true }));
    row.append(icon(kind.icon, 'ocs__file-icon'), body, tools);
    return row;
  }

  function render() {
    const tree = buildTree(index);
    const holder = [];
    const bar = el('div', 'dm__files-bar');
    const filter = el('input', 'ocs__input dm__files-filter');
    filter.type = 'search';
    filter.placeholder = text.filter;
    filter.setAttribute('aria-label', text.filter);
    filter.value = query;
    filter.addEventListener('input', () => {
      query = filter.value.trim();
      renderList();
    });
    bar.appendChild(filter);
    if (onShare) bar.appendChild(button('ocs__btn small', 'fa-paperclip', text.share, () => { dialog.close(); onShare(); }));
    holder.push(bar);
    const listHost = el('div', 'dm__files-list');
    holder.push(listHost);
    elements.body.replaceChildren(...holder);

    function renderList() {
      listHost.replaceChildren();
      if (!index.length) {
        listHost.appendChild(el('p', 'ocs__text', text.empty));
        return;
      }
      if (query) {
        const needle = query.toLowerCase();
        const found = index.filter(file => file.path.toLowerCase().includes(needle));
        listHost.appendChild(el('em', 'ocs__file-meta', found.length
          ? fill(text.matches, { count: found.length, plural: found.length === 1 ? '' : 'es' })
          : fill(text.noMatches, { query })));
        const list = el('ul', 'ocs__file-list');
        found.slice(0, 200).forEach(file => list.appendChild(fileRow(file, { showPath: true })));
        listHost.appendChild(list);
        return;
      }
      const folder = folderAt(tree, path) || tree;
      listHost.appendChild(crumbs(tree));
      if (folder.path) {
        const zip = button('ocs__btn small', 'fa-file-zipper', text.zipFolder, control => actions.handle('zip', { type: 'folder', path: folder.path, count: folder.count, size: folder.size }, control));
        const tools = el('div', 'ocs__links');
        tools.appendChild(zip);
        listHost.appendChild(tools);
      }
      const list = el('ul', 'ocs__file-list');
      folder.folders.forEach(child => list.appendChild(folderRow(child)));
      folder.files.forEach(file => list.appendChild(fileRow(file)));
      if (!folder.folders.length && !folder.files.length) listHost.appendChild(el('p', 'ocs__text', text.emptyFolder));
      listHost.appendChild(list);
    }
    renderList();
  }

  function go(at) {
    path = at;
    query = '';
    render();
    elements.body.querySelector('[aria-current="location"]')?.focus?.();
  }

  async function load() {
    const ticket = ++loadCount;
    const files = groupFilesFor(group.id);
    notify('');
    if (!index.length) {
      const spinner = el('div', 'ocs__loading');
      spinner.appendChild(el('div', 'ocs__spinner'));
      elements.body.replaceChildren(spinner, el('p', 'ocs__text', text.loading));
    }
    try {
      index = await files.index();
      if (ticket !== loadCount) return;
      render();
    } catch (error) {
      if (ticket !== loadCount) return;
      console.warn('Messages: could not load the shared files', error);
      elements.body.replaceChildren(el('p', 'ocs__text', text.loadFailed));
    }
  }

  return {
    // folderPath opens straight into a shared folder (a message's Open button).
    open(current, opener, { folderPath = '' } = {}) {
      group = current;
      path = folderPath;
      query = '';
      index = [];
      elements.title.textContent = fill(text.title, { group: current.name });
      dialog.open(opener);
      load();
    },
    // Someone shared a file while the panel shows this group's files.
    refreshIfShowing(groupId) {
      if (dialog.isOpen() && group?.id === groupId) load();
    },
    isOpen: () => dialog.isOpen(),
  };
}

function folderAt(tree, path) {
  if (!path) return tree;
  let folder = tree;
  for (const name of path.split('/')) {
    folder = folder.folders.find(child => child.name === name);
    if (!folder) return null;
  }
  return folder;
}
