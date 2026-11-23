// The conversation panel: what a chat has collected, in tabs. Files (a group's shared files,
// files-panel.js), Media (pictures and videos), Links (GitHub first) and Pinned. Opened from
// the header's Shared button, a folder's Open, or a slash command. Media, Links and Pinned
// come from the messages the conversation loaded (its whole history); Media downloads each
// shared image for its thumbnail.
import { createDialog } from './dialogs.js';
import { Conversation } from './conversation-model.js';
import { FilesMarker } from './files-model.js';
import { FilesTab } from './files-panel.js';

const TABS = ['files', 'media', 'links', 'pinned'];
const TAB_ICONS = { files: 'fa-folder-open', media: 'fa-photo-film', links: 'fa-link', pinned: 'fa-thumbtack' };

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name, extra = '') {
  const glyph = el('i', `${name.startsWith('fa-brands') ? '' : 'fas '}${name}${extra ? ` ${extra}` : ''}`);
  glyph.setAttribute('aria-hidden', 'true');
  return glyph;
}

function iconButton(glyph, label, onClick) {
  const control = el('button', 'ocs__btn small');
  control.type = 'button';
  control.setAttribute('aria-label', label);
  control.title = label;
  control.appendChild(icon(glyph));
  control.addEventListener('click', () => onClick(control));
  return control;
}

const shortDate = sentAt => {
  const when = sentAt ? new Date(sentAt) : null;
  return when && !Number.isNaN(when.getTime()) ? when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
};

/**
 * The Shared panel: a conversation's Files, Media, Links and Pinned, in tabs.
 */
export class ConversationPanel {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    title: 'Shared in {name}',
    files: 'Files',
    media: 'Media',
    links: 'Links',
    pinned: 'Pinned',
    noMedia: 'No pictures or videos yet. Images you send or share show up here.',
    noLinks: 'No links yet. Links in messages show up here, GitHub ones first.',
    noPins: 'Nothing pinned yet. Use a message’s Pin button to keep it here for everyone.',
    openLink: 'Open {url}',
    showInChat: 'Show in the chat',
    unpin: 'Unpin',
    pinnedBy: 'pinned by {name}',
    imageFrom: 'Image from {name}',
    video: 'Video {name}',
    someone: 'someone',
    image: 'Image',
    pictureFailed: 'Could not open that picture.',
  });

  #elements;
  #thread;
  #viewer;
  #text;
  #conversation = null; // { kind, id, name }
  #tab = 'files';
  #dialog;
  #actions;
  #filesTab;
  #groupFilesFor;
  #tabButtons = new Map();

  /**
   * Builds the tab bar and the Files tab; the panel stays closed.
   * @param {object} options
   * @param {object} options.elements dialog, title, tabList (an ul.ocs__tabs-list), panels
   *   { files, media, links, pinned }, status
   * @param {object} options.thread the page's pane: messages(), showMessage(key),
   *   togglePin(message, pinned)
   * @param {Function} options.groupFilesFor groupFilesFor(groupId) gives that group's GroupFiles
   * @param {Function} options.makeFileActions makeFileActions({ filesFor, notify }) gives the
   *   panel's FileActions
   * @param {object} options.viewer the FileViewer a picture from the chat opens in
   * @param {Function|null} options.onShare opens the composer's Attach (the Files tab's Share files)
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ elements, thread, groupFilesFor, makeFileActions, viewer, onShare = null, texts = {} }) {
    const text = { ...ConversationPanel.TEXTS, ...texts };
    this.#elements = elements;
    this.#thread = thread;
    this.#viewer = viewer;
    this.#text = text;
    this.#groupFilesFor = groupFilesFor;
    this.#dialog = createDialog(elements.dialog, {
      onClose: () => {
        this.#filesTab.hide();
        this.#actions.clear(); // the thumbnails' blob URLs
        this.#conversation = null;
      },
    });
    this.#actions = makeFileActions({
      filesFor: () => (this.#conversation?.kind === 'group' ? groupFilesFor(this.#conversation.id) : null),
      notify: this.#notify,
    });
    this.#filesTab = new FilesTab({
      host: elements.panels.files, notify: this.#notify, groupFilesFor, actions: this.#actions, onShare, onClose: () => this.#dialog.close(),
    });

    // The tab bar, in the grammar's tabs (elements/tabs): `active` with the two tokens the
    // grammar colours, and role="tab" with aria-selected for assistive technology.
    TABS.forEach(name => {
      const item = el('li');
      const control = el('button', 'ocs__tabs-btn');
      control.type = 'button';
      control.setAttribute('role', 'tab');
      control.id = `messagesPanelTab-${name}`;
      control.setAttribute('aria-controls', elements.panels[name].id);
      control.append(icon(TAB_ICONS[name]), ` ${text[name]}`);
      control.addEventListener('click', () => this.#select(name));
      control.addEventListener('keydown', event => {
        const visible = TABS.filter(other => !this.#tabButtons.get(other).item.hidden);
        const at = visible.indexOf(name);
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        const next = visible[(at + step + visible.length) % visible.length];
        this.#select(next);
        this.#tabButtons.get(next).control.focus();
      });
      item.appendChild(control);
      elements.tabList.appendChild(item);
      this.#tabButtons.set(name, { item, control });
      elements.panels[name].setAttribute('role', 'tabpanel');
      elements.panels[name].setAttribute('aria-labelledby', control.id);
    });
    elements.tabList.setAttribute('role', 'tablist');
  }

  /**
   * Opens the panel on a conversation.
   * @param {{kind: string, id: number, name: string}} current
   * @param {HTMLElement} opener gets focus back when it closes
   * @param {{tab?: string|null, folderPath?: string}} options tab picks the tab; folderPath
   *   opens Files in that folder
   */
  open(current, opener, { tab: wanted = null, folderPath = '' } = {}) {
    this.#conversation = current;
    const isGroup = current.kind === 'group';
    this.#tabButtons.get('files').item.hidden = !isGroup;
    this.#elements.title.textContent = fill(this.#text.title, { name: current.name });
    this.#render();
    if (isGroup) this.#filesTab.show({ id: current.id, name: current.name }, { folderPath });
    this.#select(wanted && (wanted !== 'files' || isGroup) ? wanted : (isGroup ? 'files' : 'media'));
    this.#dialog.open(opener);
  }

  /**
   * Redraws Media, Links and Pinned if the panel shows this conversation and its messages
   * changed (a new message, an edit, a pin). They read the loaded messages, so it costs no
   * request; the Files tab waits for refreshIfShowing.
   * @param {string} kind
   * @param {number} id
   */
  refreshMessages(kind, id) {
    if (!this.#dialog.isOpen() || this.#conversation?.kind !== kind || this.#conversation?.id !== id) return;
    this.#render();
  }

  /**
   * Redraws the panel, its Files tab too, if it shows this conversation: a shared file.
   * @param {string} kind
   * @param {number} id
   */
  refreshIfShowing(kind, id) {
    if (!this.#dialog.isOpen() || this.#conversation?.kind !== kind || this.#conversation?.id !== id) return;
    this.#render();
    if (kind !== 'group') return;
    // Only the open conversation's shares reach this page, so the list is asked for again.
    this.#groupFilesFor(id).refresh();
    this.#filesTab.refreshIfShowing(id);
  }

  /** @returns {boolean} whether the panel is open */
  isOpen() {
    return this.#dialog.isOpen();
  }

  /** @returns {string} the selected tab */
  current() {
    return this.#tab;
  }

  #notify = message => { this.#elements.status.textContent = message; };

  #counted(name, count) {
    const { control } = this.#tabButtons.get(name);
    control.replaceChildren(icon(TAB_ICONS[name]), ` ${this.#text[name]}`);
    if (count) control.append(' ', el('b', 'dm__tab-count', String(count)));
  }

  #showInChat(key) {
    this.#dialog.close();
    this.#thread.showMessage(key);
  }

  #renderMedia(messages) {
    const text = this.#text;
    const host = this.#elements.panels.media;
    const media = Conversation.mediaIn(messages);
    this.#counted('media', media.length);
    if (!media.length) {
      host.replaceChildren(el('p', 'ocs__text', text.noMedia));
      return;
    }
    const grid = el('div', 'ocs__grid ocs__grid--gallery');
    media.forEach(entry => {
      const cell = el('button', 'ocs__grid-cell dm__media-cell');
      cell.type = 'button';
      const label = entry.file
        ? (entry.kind === 'video' ? fill(text.video, { name: nameOf(entry.file.path) }) : `${nameOf(entry.file.path)} · ${entry.sender || text.someone}`)
        : fill(text.imageFrom, { name: entry.sender || text.someone });
      cell.setAttribute('aria-label', `${label}, ${shortDate(entry.sentAt)}`);
      cell.title = label;
      if (entry.kind === 'video') {
        cell.append(icon('fa-file-video', 'dm__media-icon'));
      } else {
        const image = el('img', 'dm__media-image');
        image.alt = '';
        image.loading = 'lazy';
        if (entry.src) image.src = entry.src;
        else this.#actions.thumbnail(entry.file).then(url => { image.src = url; }, () => image.replaceWith(icon('fa-file-image', 'dm__media-icon')));
        cell.append(image);
      }
      cell.addEventListener('click', async () => {
        if (entry.file) {
          this.#actions.handle('preview', entry.file, cell);
          return;
        }
        // A picture sent in a message is a data URL, read back into a blob for the viewer.
        let blob;
        try {
          blob = await (await fetch(entry.src)).blob();
        } catch (error) {
          console.warn('Messages: could not read the picture', error);
          this.#notify(text.pictureFailed);
          return;
        }
        if (!this.#dialog.isOpen()) return; // closed while the picture was read
        this.#viewer.show({ name: fill(text.imageFrom, { name: entry.sender || text.someone }), blob, preview: 'image' }, cell);
      });
      grid.appendChild(cell);
    });
    host.replaceChildren(grid);
  }

  #renderLinks(messages) {
    const text = this.#text;
    const host = this.#elements.panels.links;
    const links = Conversation.linksIn(messages);
    this.#counted('links', links.length);
    if (!links.length) {
      host.replaceChildren(el('p', 'ocs__text', text.noLinks));
      return;
    }
    const list = el('ul', 'ocs__file-list');
    links.forEach(link => {
      const row = el('li', 'ocs__file');
      const body = el('div', 'ocs__file-text');
      const name = el('b', 'ocs__file-name', link.url.replace(/^https?:\/\//, ''));
      name.title = link.url;
      body.append(name, el('em', 'ocs__file-meta', [link.sender, shortDate(link.sentAt)].filter(Boolean).join(' · ')));
      const tools = el('div', 'ocs__file-actions');
      const open = el('a', 'ocs__btn small');
      open.href = link.url;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.setAttribute('aria-label', fill(text.openLink, { url: link.url }));
      open.title = fill(text.openLink, { url: link.url });
      open.appendChild(icon('fa-arrow-up-right-from-square'));
      tools.append(open, iconButton('fa-comment', text.showInChat, () => this.#showInChat(link.messageKey)));
      row.append(icon(link.github ? 'fa-brands fa-github' : 'fa-link', 'ocs__file-icon'), body, tools);
      list.appendChild(row);
    });
    host.replaceChildren(list);
  }

  // What a pinned message says in one line: its text, or that it is an image or files.
  #summary(message) {
    const words = Conversation.plainText(message.body);
    if (words) return words;
    if (message.image) return this.#text.image;
    return FilesMarker.extract(message.body.replace(/^\s*\[\[reply:[^\]]*\]\]\s*/, '')).items.length ? this.#text.files : '…';
  }

  #renderPinned(messages) {
    const text = this.#text;
    const host = this.#elements.panels.pinned;
    const pins = Conversation.currentPins(messages);
    this.#counted('pinned', pins.length);
    if (!pins.length) {
      host.replaceChildren(el('p', 'ocs__text', text.noPins));
      return;
    }
    const list = el('ul', 'ocs__file-list');
    pins.forEach(pin => {
      const row = el('li', 'ocs__file');
      const body = el('div', 'ocs__file-text');
      const name = el('b', 'ocs__file-name', this.#summary(pin.message));
      name.title = name.textContent;
      const meta = [pin.message.senderName, shortDate(pin.message.sentAt), fill(text.pinnedBy, { name: pin.pinnedBy || text.someone })];
      body.append(name, el('em', 'ocs__file-meta', meta.filter(Boolean).join(' · ')));
      const tools = el('div', 'ocs__file-actions');
      tools.append(
        iconButton('fa-comment', text.showInChat, () => this.#showInChat(pin.message.key)),
        iconButton('fa-thumbtack-slash', text.unpin, async control => {
          control.disabled = true;
          // Drawn again rather than the row taken out, so the count and the empty text follow.
          if (await this.#thread.togglePin(pin.message, true)) this.#render();
          else control.disabled = false;
        }),
      );
      row.append(icon('fa-thumbtack', 'ocs__file-icon'), body, tools);
      list.appendChild(row);
    });
    host.replaceChildren(list);
  }

  #select(name) {
    this.#tab = name;
    this.#tabButtons.forEach(({ control }, other) => {
      const on = other === name;
      control.classList.toggle('active', on);
      control.classList.toggle('text-blue-500', on);
      control.classList.toggle('border-blue-500', on);
      control.setAttribute('aria-selected', String(on));
      control.tabIndex = on ? 0 : -1;
      this.#elements.panels[other].classList.toggle('hidden', !on);
    });
    this.#notify('');
  }

  #render() {
    const messages = this.#thread.messages();
    this.#renderMedia(messages);
    this.#renderLinks(messages);
    this.#renderPinned(messages);
  }
}
