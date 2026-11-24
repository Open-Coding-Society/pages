// Everything shared with a group, as folders: the Shared panel's Files tab
// (conversation-panel.js). It lists the folder you're in with breadcrumbs back up, filters every file by
// name as you type, and previews, downloads or zips. Sharing starts from the composer, so whatever goes up is
// announced in the chat.
import { SharedFiles } from './files-model.js';

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
    // ocs__btn--icon spaces the icon from the words: a flex button drops a leading space.
    control.classList.add('ocs__btn--icon');
    control.append(label);
  }
  control.addEventListener('click', () => onClick(control));
  return control;
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

/**
 * A group's shared files, as folders.
 */
export class FilesTab {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
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

  #host;
  #notify;
  #groupFilesFor;
  #actions;
  #onShare;
  #onClose;
  #text;
  #group = null;
  #path = '';
  #query = '';
  #index = [];
  #loadCount = 0;

  /**
   * @param {object} options
   * @param {HTMLElement} options.host the tab's element
   * @param {Function} options.notify notify(text) says something in the dialog's status line
   * @param {Function} options.groupFilesFor groupFilesFor(groupId) gives that group's GroupFiles
   * @param {object} options.actions the FileActions that do a file's buttons
   * @param {Function|null} options.onShare opens the composer's Attach; without it there's
   *   no Share files button
   * @param {Function} options.onClose closes the dialog before onShare runs
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ host, notify, groupFilesFor, actions, onShare = null, onClose = () => {}, texts = {} }) {
    this.#host = host;
    this.#notify = notify;
    this.#groupFilesFor = groupFilesFor;
    this.#actions = actions;
    this.#onShare = onShare;
    this.#onClose = onClose;
    this.#text = { ...FilesTab.TEXTS, ...texts };
  }

  /**
   * Shows a group's files.
   * @param {{id: number, name: string}} current the group
   * @param {{folderPath?: string}} options folderPath opens straight into a shared folder
   *   (a message's Open button)
   */
  show(current, { folderPath = '' } = {}) {
    this.#group = current;
    this.#path = folderPath;
    this.#query = '';
    this.#index = [];
    // Asked for afresh each time the tab opens: the page only hears about shares in the
    // conversation that is open, so a cached list can miss what was shared elsewhere.
    this.#groupFilesFor(current.id).refresh();
    this.#load();
  }

  /** The dialog closed: a load still on its way is dropped. */
  hide() {
    this.#loadCount += 1;
    this.#group = null;
  }

  /**
   * Someone shared a file while the list shows a group's files.
   * @param {number} groupId
   */
  refreshIfShowing(groupId) {
    if (this.#group?.id === groupId) this.#load();
  }

  #crumbs(tree) {
    const text = this.#text;
    const nav = el('nav', 'ocs__links dm__crumbs');
    nav.setAttribute('aria-label', 'Folder');
    const parts = this.#path ? this.#path.split('/') : [];
    const levels = [{ name: text.root, at: '' }, ...parts.map((name, i) => ({ name, at: parts.slice(0, i + 1).join('/') }))];
    levels.forEach((level, i) => {
      const last = i === levels.length - 1;
      const crumb = el('button', `ocs__btn small${last ? ' accent' : ''}${i === 0 ? ' ocs__btn--icon' : ''}`);
      crumb.type = 'button';
      if (i === 0) crumb.append(icon('fa-folder-tree'), level.name);
      else crumb.textContent = level.name;
      if (last) crumb.setAttribute('aria-current', 'location');
      crumb.addEventListener('click', () => this.#go(level.at));
      nav.appendChild(crumb);
    });
    const summary = el('em', 'ocs__file-meta dm__crumbs-summary', fill(text.summary, { files: SharedFiles.countFiles(tree.count), size: SharedFiles.formatBytes(tree.size) }));
    nav.appendChild(summary);
    return nav;
  }

  #folderRow(folder) {
    const item = el('li');
    const row = el('button', 'ocs__file ocs__file--folder');
    row.type = 'button';
    const body = el('div', 'ocs__file-text');
    body.append(el('b', 'ocs__file-name', folder.name), el('em', 'ocs__file-meta', fill(this.#text.folderMeta, { files: SharedFiles.countFiles(folder.count), size: SharedFiles.formatBytes(folder.size) })));
    row.append(icon('fa-folder', 'ocs__file-icon'), body, icon('fa-chevron-right'));
    row.addEventListener('click', () => this.#go(folder.path));
    item.appendChild(row);
    return item;
  }

  #fileRow(file, { showPath = false } = {}) {
    const text = this.#text;
    const name = nameOf(file.path);
    const kind = SharedFiles.fileKind(file.path);
    const row = el('li', 'ocs__file');
    const body = el('div', 'ocs__file-text');
    const title = el('b', 'ocs__file-name', showPath ? file.path : name);
    title.title = file.path;
    const when = file.uploadedAt ? new Date(file.uploadedAt) : null;
    const meta = fill(text.fileMeta, { size: SharedFiles.formatBytes(file.size), who: file.uploadedBy || text.someone })
      + (when && !Number.isNaN(when.getTime()) ? ` · ${when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : '');
    body.append(title, el('em', 'ocs__file-meta', meta));
    const tools = el('div', 'ocs__file-actions');
    const item = { type: 'file', path: file.path, size: file.size };
    if (kind.preview) tools.appendChild(button('ocs__btn small', 'fa-eye', fill(text.preview, { name }), control => this.#actions.handle('preview', item, control), { iconOnly: true }));
    tools.appendChild(button('ocs__btn small', 'fa-download', fill(text.download, { name }), control => this.#actions.handle('download', item, control), { iconOnly: true }));
    row.append(icon(kind.icon, 'ocs__file-icon'), body, tools);
    return row;
  }

  #render() {
    const text = this.#text;
    const tree = SharedFiles.buildTree(this.#index);
    const holder = [];
    const bar = el('div', 'dm__files-bar');
    const filter = el('input', 'ocs__input dm__files-filter');
    filter.type = 'search';
    filter.placeholder = text.filter;
    filter.setAttribute('aria-label', text.filter);
    filter.value = this.#query;
    bar.appendChild(filter);
    if (this.#onShare) bar.appendChild(button('ocs__btn small', 'fa-paperclip', text.share, () => { this.#onClose(); this.#onShare(); }));
    holder.push(bar);
    const listHost = el('div', 'dm__files-list');
    holder.push(listHost);
    this.#host.replaceChildren(...holder);

    const renderList = () => {
      const index = this.#index;
      listHost.replaceChildren();
      if (!index.length) {
        listHost.appendChild(el('p', 'ocs__text', text.empty));
        return;
      }
      if (this.#query) {
        const needle = this.#query.toLowerCase();
        const found = index.filter(file => file.path.toLowerCase().includes(needle));
        listHost.appendChild(el('em', 'ocs__file-meta', found.length
          ? fill(text.matches, { count: found.length, plural: found.length === 1 ? '' : 'es' })
          : fill(text.noMatches, { query: this.#query })));
        const list = el('ul', 'ocs__file-list');
        found.slice(0, 200).forEach(file => list.appendChild(this.#fileRow(file, { showPath: true })));
        listHost.appendChild(list);
        return;
      }
      const folder = folderAt(tree, this.#path) || tree;
      listHost.appendChild(this.#crumbs(tree));
      if (folder.path) {
        const zip = button('ocs__btn small', 'fa-file-zipper', text.zipFolder, control => this.#actions.handle('zip', { type: 'folder', path: folder.path, count: folder.count, size: folder.size }, control));
        const tools = el('div', 'ocs__links');
        tools.appendChild(zip);
        listHost.appendChild(tools);
      }
      const list = el('ul', 'ocs__file-list');
      folder.folders.forEach(child => list.appendChild(this.#folderRow(child)));
      folder.files.forEach(file => list.appendChild(this.#fileRow(file)));
      if (!folder.folders.length && !folder.files.length) listHost.appendChild(el('p', 'ocs__text', text.emptyFolder));
      listHost.appendChild(list);
    };
    filter.addEventListener('input', () => {
      this.#query = filter.value.trim();
      renderList();
    });
    renderList();
  }

  #go(at) {
    this.#path = at;
    this.#query = '';
    this.#render();
    this.#host.querySelector('[aria-current="location"]')?.focus?.();
  }

  async #load() {
    this.#loadCount += 1;
    const ticket = this.#loadCount;
    const files = this.#groupFilesFor(this.#group.id);
    this.#notify('');
    if (!this.#index.length) {
      const spinner = el('div', 'ocs__loading');
      spinner.appendChild(el('div', 'ocs__spinner'));
      this.#host.replaceChildren(spinner, el('p', 'ocs__text', this.#text.loading));
    }
    try {
      // A list for a load the tab has moved on from (another group, or closed) is dropped
      // before it is kept: kept, the next filter or folder would draw that group's files.
      const index = await files.index();
      if (ticket !== this.#loadCount) return;
      this.#index = index;
      this.#render();
    } catch (error) {
      if (ticket !== this.#loadCount) return;
      console.warn('Messages: could not load the shared files', error);
      this.#host.replaceChildren(el('p', 'ocs__text', this.#text.loadFailed));
    }
  }
}
