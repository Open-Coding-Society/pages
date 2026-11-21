// The composer's Attach menu and file sharing. In a group chat you can attach an image, any
// files, or a whole folder, from the menu or by dropping them anywhere on the conversation;
// they wait in the tray, and Send uploads them (a few at a time, with progress) before the
// message goes, so the message lists what was shared. In a direct message only an image can
// be attached: Spring stores shared files for groups only. thread.js owns the image itself.
import { Attachments } from './attachments.js';
import { SharedFiles } from './files-model.js';
import { PopupMenu } from './popup-menu.js';

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (slot, key) => (key in values ? String(values[key]) : slot));
const isImage = file => Boolean(file?.type?.startsWith('image/'));
// Spring refuses (409) to write over a file shared under the same name a moment ago. A file
// on its own then goes up again under the next free name; one in a folder is left off, since
// renaming it alone would split its folder.
const refusedLoose = (path, error) => error?.status === 409 && !path.includes('/');
// Only drags that carry files: dragging text or a link inside the page isn't a share.
const carriesFiles = event => [...(event.dataTransfer?.types || [])].includes('Files');

/**
 * The composer's Attach menu, its drop zone, and sharing what the tray holds.
 */
export class ComposerFiles {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    attach: 'Attach',
    image: 'Image or screenshot',
    imageHint: 'Shows in the chat',
    files: 'Files',
    filesHint: 'Up to 35 MB each',
    folder: 'Folder',
    folderHint: 'Keeps its folders',
    dropFiles: 'Drop files or folders to share them',
    dropImage: 'Drop an image to send it',
    filesOnlyInGroups: 'Files and folders can be shared in a group chat. Here you can send an image.',
    notWhileEditing: 'Files can’t be added while you edit a message.',
    shareFailed: 'Could not share the files. Check your connection and try again.',
    shareCancelled: 'Stopped sharing. Your files are still in the tray.',
    partlyShared: '{count} could not be shared: {names}.',
    nothingShared: 'None of the files could be shared. Try again.',
    waitForShare: 'Wait for these files to finish sharing, then add more.',
  });

  #elements;
  #groupFiles;
  #onImage;
  #showMessage;
  #text;
  #context = { kind: null, id: null, loaded: false, editing: false };
  // Goes up when the conversation changes or the composer goes, so a dropped folder that is
  // still being read lands only in the tray of the conversation it was dropped on.
  #generation = 0;
  #dragDepth = 0;
  #attachments;
  #menu;

  /**
   * Builds the Attach menu and the tray, and listens for drops.
   * @param {object} options
   * @param {object} options.elements attachButton, menuHost, imageInput, filesInput,
   *   folderInput, tray, dropZone, dropHint
   * @param {Function} options.groupFiles groupFiles(groupId) gives that group's GroupFiles
   * @param {Function} options.onImage onImage(file) sends one image as a picture in the chat
   * @param {Function} options.showMessage showMessage(text) shows a status line
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ elements, groupFiles, onImage, showMessage, texts = {} }) {
    const text = { ...ComposerFiles.TEXTS, ...texts };
    this.#elements = elements;
    this.#groupFiles = groupFiles;
    this.#onImage = onImage;
    this.#showMessage = showMessage;
    this.#text = text;
    this.#attachments = new Attachments({ tray: elements.tray, onChange: () => {} });

    const pick = input => input?.click();
    this.#menu = new PopupMenu({
      button: elements.attachButton,
      container: elements.menuHost,
      label: text.attach,
      items: () => [
        { icon: 'fa-image', label: text.image, hint: text.imageHint, onPick: () => pick(elements.imageInput) },
        ...(this.#inGroup() ? [
          { icon: 'fa-file-arrow-up', label: text.files, hint: text.filesHint, onPick: () => pick(elements.filesInput) },
          { icon: 'fa-folder-plus', label: text.folder, hint: text.folderHint, onPick: () => pick(elements.folderInput) },
        ] : []),
      ],
    });

    elements.filesInput?.addEventListener('change', () => this.#addFromInput(elements.filesInput));
    elements.folderInput?.addEventListener('change', () => this.#addFromInput(elements.folderInput));
    const zone = elements.dropZone;
    zone.addEventListener('dragenter', this.#onDragEnter);
    zone.addEventListener('dragover', this.#onDragOver);
    zone.addEventListener('dragleave', this.#onDragLeave);
    zone.addEventListener('drop', this.#onDrop);
  }

  /**
   * The conversation changed, or loaded, or an edit started or ended.
   * @param {{kind?: string|null, id?: number|null, loaded?: boolean, editing?: boolean}} next
   */
  setContext(next) {
    const context = this.#context;
    const moved = next.kind !== context.kind || next.id !== context.id;
    if (moved) this.#generation += 1;
    this.#context = { ...context, ...next };
    if (moved && !this.#attachments.isUploading()) this.#attachments.clear();
    // Only a group keeps a tray: a DM can't share files.
    if (!this.#inGroup()) this.#attachments.clear();
    this.#refreshAttach();
  }

  /**
   * Uploads the tray to the open group.
   * @returns {Promise<{items: Array}|null>} the items for the message's marker, or null when
   *   the message shouldn't go (cancelled, or nothing could be shared; the reason is shown)
   */
  async share() {
    const text = this.#text;
    const attachments = this.#attachments;
    const files = this.#groupFiles(this.#context.id);
    let taken;
    try {
      // The names in use right now: a list cached while another chat was open misses what
      // teammates shared meanwhile, and an upload under one of their names would replace it.
      files.refresh();
      taken = SharedFiles.topNames(await files.index());
    } catch (error) {
      console.warn('Messages: could not list the group’s files before sharing', error);
      this.#showMessage(text.shareFailed);
      return null;
    }
    const plan = SharedFiles.planShare(attachments.entries(), taken);
    if (plan.problem) return null; // the tray already says why
    const controller = new AbortController();
    const progress = attachments.beginUpload(plan, { onCancel: () => controller.abort() });
    this.#refreshAttach();
    // A refused file's row waits for its second try before it says how the file went.
    const first = await files.upload(plan.uploads, {
      onProgress: progress.onProgress,
      onFile: (path, state, error) => { if (state !== 'failed' || !refusedLoose(path, error)) progress.onFile(path, state); },
      signal: controller.signal,
    });
    const result = first.cancelled ? first : await this.#shareRefusedAgain(files, plan, first, progress, controller.signal);
    if (result.cancelled) {
      attachments.endUpload({ keep: true });
      this.#refreshAttach();
      this.#showMessage(text.shareCancelled);
      return null;
    }
    const { items } = result;
    // When nothing went up, the files stay in the tray, so the next Send tries them again.
    attachments.endUpload({ keep: !items.length });
    this.#refreshAttach();
    if (!items.length) {
      this.#showMessage(text.nothingShared);
      return null;
    }
    if (result.failed.length) {
      const names = result.failed.map(failure => failure.path);
      this.#showMessage(fill(text.partlyShared, { count: names.length, names: names.slice(0, 3).join(', ') + (names.length > 3 ? '…' : '') }));
    }
    return { items };
  }

  /** @returns {boolean} whether the tray holds files */
  hasFiles() {
    return !this.#attachments.isEmpty();
  }

  /** @returns {boolean} whether a share is uploading */
  isUploading() {
    return this.#attachments.isUploading();
  }

  /** @returns {string|null} what's wrong with the tray, if anything */
  problem() {
    return this.#attachments.problem();
  }

  /** Takes the menu away and stops listening for drops. */
  destroy() {
    this.#generation += 1;
    this.#menu.destroy();
    const zone = this.#elements.dropZone;
    zone.removeEventListener('dragenter', this.#onDragEnter);
    zone.removeEventListener('dragover', this.#onDragOver);
    zone.removeEventListener('dragleave', this.#onDragLeave);
    zone.removeEventListener('drop', this.#onDrop);
  }

  #inGroup() {
    return this.#context.kind === 'group';
  }

  #canAttach() {
    return this.#context.loaded && !this.#context.editing && !this.#attachments.isUploading();
  }

  // Attach is off where the conversation can't take files now, and while a share uploads,
  // since the tray takes nothing new until the upload ends.
  #refreshAttach() {
    this.#elements.attachButton.disabled = !this.#canAttach();
    if (!this.#canAttach()) this.#menu.close({ refocus: false });
  }

  #addFromInput(input) {
    const found = Attachments.fromInput(input.files);
    input.value = '';
    if (!found.length) return;
    if (this.#attachments.isUploading()) {
      this.#showMessage(this.#text.waitForShare);
      return;
    }
    this.#attachments.add({ entries: found });
  }

  // ── Dropping on the conversation ───────────────────────────────────────────────
  #setDragging(active) {
    const { dropZone, dropHint } = this.#elements;
    dropZone.classList.toggle('is-dragging', active);
    if (dropHint) {
      dropHint.textContent = this.#inGroup() ? this.#text.dropFiles : this.#text.dropImage;
      dropHint.setAttribute('aria-hidden', String(!active));
    }
  }

  // A drop is taken, and the hint shown, once a conversation is open and no share uploads.
  #takesDrops() {
    return this.#context.loaded && !this.#attachments.isUploading();
  }

  // Every file drag is cancelled, even before a conversation is open: a file let go of on
  // the page would otherwise open in the tab and leave /dm.
  #onDragEnter = event => {
    if (!carriesFiles(event)) return;
    event.preventDefault();
    if (!this.#takesDrops()) return;
    this.#dragDepth += 1;
    this.#setDragging(true);
  };

  #onDragOver = event => {
    if (!carriesFiles(event)) return;
    event.preventDefault();
    if (this.#takesDrops() && event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };

  #onDragLeave = event => {
    if (!carriesFiles(event)) return;
    this.#dragDepth = Math.max(0, this.#dragDepth - 1);
    if (this.#dragDepth === 0) this.#setDragging(false);
  };

  #onDrop = async event => {
    if (!carriesFiles(event)) return;
    event.preventDefault();
    this.#dragDepth = 0;
    this.#setDragging(false);
    if (!this.#context.loaded) return;
    if (this.#context.editing) {
      this.#showMessage(this.#text.notWhileEditing);
      return;
    }
    if (this.#attachments.isUploading()) {
      this.#showMessage(this.#text.waitForShare);
      return;
    }
    const files = [...(event.dataTransfer?.files || [])];
    const items = [...(event.dataTransfer?.items || [])];
    const hasFolder = items.some(item => item.webkitGetAsEntry?.()?.isDirectory);
    // One image on its own is sent as a picture in the chat, as before; anything else is a share.
    if (files.length === 1 && !hasFolder && isImage(files[0]) && this.#attachments.isEmpty()) {
      this.#onImage(files[0]);
      return;
    }
    if (!this.#inGroup()) {
      this.#showMessage(this.#text.filesOnlyInGroups);
      return;
    }
    const dropped = this.#generation;
    const found = await Attachments.fromDrop(event.dataTransfer);
    if (dropped === this.#generation) this.#attachments.add(found);
  };

  // The loose files Spring refused in `first` go up once more, named against the group's list
  // as it is now; their rows in the tray report this try. Resolves { items, failed,
  // cancelled } for the whole share.
  async #shareRefusedAgain(files, plan, first, progress, signal) {
    const refused = first.failed.filter(failure => refusedLoose(failure.path, failure.error));
    const failed = first.failed.filter(failure => !refused.includes(failure));
    const items = SharedFiles.sharedItems(plan, first.done);
    if (!refused.length) return { items, failed, cancelled: false };
    let taken;
    try {
      files.refresh();
      taken = SharedFiles.topNames(await files.index());
    } catch (error) {
      refused.forEach(failure => progress.onFile(failure.path, 'failed'));
      return { items, failed: first.failed, cancelled: false };
    }
    const entries = refused.map(failure => plan.uploads.find(upload => upload.path === failure.path));
    const again = SharedFiles.planShare(entries, taken);
    const firstPathOf = new Map(again.uploads.map(upload => [upload.path, entries.find(entry => entry.file === upload.file).path]));
    const second = await files.upload(again.uploads, {
      onFile: (path, state) => progress.onFile(firstPathOf.get(path), state),
      signal,
    });
    return {
      items: [...items, ...SharedFiles.sharedItems(again, second.done)],
      failed: [...failed, ...second.failed],
      cancelled: second.cancelled,
    };
  }
}
