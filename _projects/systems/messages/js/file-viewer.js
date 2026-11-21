// Shows one shared file over the page without saving it: an image, a video, a sound, a PDF
// in the browser's own viewer, or the start of a text or code file. An ocs__modal built on
// first use inside the page's `.dm` root, so /dm's dialog skin applies. Escape, the backdrop
// and Close shut it; focus goes back to what opened it, and the file's blob URL is let go.
import { SharedFiles } from './files-model.js';

const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);

/**
 * The file viewer.
 */
export class FileViewer {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    close: 'Close',
    download: 'Download',
    noPreview: 'There’s no preview for this kind of file. Download it to open it.',
    textCut: 'Showing the first {size}. Download the file to see all of it.',
  });

  /** Text past this many bytes is cut: a preview is for a look, and a huge file would stall the page. */
  static TEXT_PREVIEW_BYTES = 512 * 1024;

  #root;
  #text;
  #modal = null;
  // Each viewer's title has its own id: several embeds can share one page.
  static #count = 0;
  #title = null;
  #body = null;
  #downloadButton = null;
  #onDownload = null;
  #url = null;
  #returnFocus = null;

  /**
   * @param {object} options
   * @param {HTMLElement} options.root where the modal goes, the page's .dm
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ root, texts = {} }) {
    this.#root = root;
    this.#text = { ...FileViewer.TEXTS, ...texts };
  }

  /**
   * Shows a file.
   * @param {object} file
   * @param {string} file.name its path or name
   * @param {Blob} file.blob
   * @param {string|null} file.preview 'image' for a picture from the chat, whose name gives no kind
   * @param {Function} file.onDownload onDownload(control) saves it; without it there's no Download button
   * @param {HTMLElement} opener gets focus back on close
   */
  async show({ name, blob, preview = null, onDownload: download }, opener) {
    if (!this.#modal) this.#build();
    this.#returnFocus = opener || document.activeElement;
    this.#onDownload = download || null;
    // The shared .hidden class, not the attribute: ocs__btn sets its own display.
    this.#downloadButton.classList.toggle('hidden', !this.#onDownload);
    this.#title.textContent = nameOf(name);
    this.#title.title = name;
    this.#body.replaceChildren(...await this.#content(name, blob, preview));
    this.#modal.classList.remove('hidden');
    document.addEventListener('keydown', this.#onKeydown, true);
    this.#downloadButton.focus?.();
  }

  /** Closes the viewer, lets go of the file and gives focus back. */
  close() {
    if (!this.#modal || this.#modal.classList.contains('hidden')) return;
    this.#modal.classList.add('hidden');
    document.removeEventListener('keydown', this.#onKeydown, true);
    this.#body.replaceChildren();
    this.#release();
    this.#returnFocus?.focus?.();
    this.#returnFocus = null;
  }

  /** @returns {boolean} whether a file is showing */
  isOpen() {
    return Boolean(this.#modal) && !this.#modal.classList.contains('hidden');
  }

  /** Closes the viewer and takes it off the page. */
  destroy() {
    this.close();
    this.#modal?.remove();
    this.#modal = null;
  }

  // Listened for in the capture phase and stopped there: the viewer can sit over the Files
  // dialog, whose own Escape would otherwise close it too. One Escape closes one layer.
  #onKeydown = event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.close();
  };

  #build() {
    const text = this.#text;
    const modal = document.createElement('div');
    modal.className = 'ocs__modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    FileViewer.#count += 1;
    const titleId = `messagesFileViewerTitle-${FileViewer.#count}`;
    modal.setAttribute('aria-labelledby', titleId);
    const card = document.createElement('div');
    card.className = 'ocs__modal-card ocs__modal-card--wide ocs__stack';
    const header = document.createElement('div');
    header.className = 'ocs__modal-header';
    const title = document.createElement('h3');
    title.className = 'ocs__modal-title ocs__truncate';
    title.id = titleId;
    const actions = document.createElement('div');
    actions.className = 'ocs__links';
    const downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.className = 'ocs__btn small ocs__btn--icon';
    const glyph = document.createElement('i');
    glyph.className = 'fas fa-download';
    glyph.setAttribute('aria-hidden', 'true');
    downloadButton.append(glyph, text.download);
    downloadButton.addEventListener('click', () => this.#onDownload?.(downloadButton));
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'ocs__btn small';
    closeButton.setAttribute('aria-label', text.close);
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => this.close());
    actions.append(downloadButton, closeButton);
    header.append(title, actions);
    const body = document.createElement('div');
    body.className = 'dm__viewer-body';
    card.append(header, body);
    modal.appendChild(card);
    modal.addEventListener('click', event => {
      if (event.target === modal) this.close();
    });
    this.#root.appendChild(modal);
    this.#modal = modal;
    this.#title = title;
    this.#body = body;
    this.#downloadButton = downloadButton;
  }

  #release() {
    if (this.#url) URL.revokeObjectURL(this.#url);
    this.#url = null;
  }

  // asked: 'image' for a picture sent in the chat, whose name ("Image from Grace") gives no
  // kind. Only an image can be asked for: an <img> runs nothing, whatever the blob holds.
  async #content(name, blob, asked) {
    const preview = asked === 'image' ? 'image' : SharedFiles.fileKind(name).preview;
    if (preview === 'text') {
      const pre = document.createElement('pre');
      pre.className = 'ocs__file-preview';
      pre.textContent = await blob.slice(0, FileViewer.TEXT_PREVIEW_BYTES).text();
      if (blob.size <= FileViewer.TEXT_PREVIEW_BYTES) return [pre];
      const note = document.createElement('em');
      note.className = 'dm__viewer-note';
      note.textContent = this.#text.textCut.replace('{size}', SharedFiles.formatBytes(FileViewer.TEXT_PREVIEW_BYTES));
      return [pre, note];
    }
    if (!preview) {
      const note = document.createElement('p');
      note.className = 'ocs__text';
      note.textContent = this.#text.noPreview;
      return [note];
    }
    this.#release();
    // The type comes from the name, so a file can't pass for another kind; a picture from
    // the chat, whose name has no type, keeps its own image type.
    const named = SharedFiles.mimeFor(name);
    const type = preview === 'image' && !named.startsWith('image/') && blob.type?.startsWith('image/') ? blob.type : named;
    this.#url = URL.createObjectURL(new Blob([blob], { type }));
    const media = document.createElement({ image: 'img', video: 'video', audio: 'audio', pdf: 'iframe' }[preview]);
    media.className = 'ocs__file-preview';
    media.src = this.#url;
    if (preview === 'image') media.alt = name;
    if (preview === 'video' || preview === 'audio') media.controls = true;
    if (preview === 'pdf') media.title = name;
    return [media];
  }
}
