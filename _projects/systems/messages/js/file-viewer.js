// Shows one shared file over the page without saving it: an image, a video, a sound, a PDF
// in the browser's own viewer, or the start of a text or code file. An ocs__modal built on
// first use inside the page's `.dm` root, so /dm's dialog skin applies. Escape, the backdrop
// and Close shut it; focus goes back to what opened it, and the file's blob URL is let go.
import { fileKind, formatBytes, mimeFor } from './files-model.js';

export const VIEWER_TEXTS = Object.freeze({
  close: 'Close',
  download: 'Download',
  noPreview: 'There’s no preview for this kind of file. Download it to open it.',
  textCut: 'Showing the first {size}. Download the file to see all of it.',
});

// Text past this is cut: a preview is for a look, and a huge file would stall the page.
export const TEXT_PREVIEW_BYTES = 512 * 1024;

const nameOf = path => String(path).slice(String(path).lastIndexOf('/') + 1);

export function createFileViewer({ root, texts = {} }) {
  const text = { ...VIEWER_TEXTS, ...texts };
  let modal = null;
  let title = null;
  let body = null;
  let downloadButton = null;
  let onDownload = null;
  let url = null;
  let returnFocus = null;

  // Listened for in the capture phase and stopped there: the viewer sits over the Shared
  // panel, whose own Escape would otherwise close it too. One Escape closes one layer.
  function onKeydown(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    close();
  }

  function build() {
    modal = document.createElement('div');
    modal.className = 'ocs__modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'messagesFileViewerTitle');
    const card = document.createElement('div');
    card.className = 'ocs__modal-card ocs__modal-card--wide ocs__stack';
    const header = document.createElement('div');
    header.className = 'ocs__modal-header';
    title = document.createElement('h3');
    title.className = 'ocs__modal-title ocs__truncate';
    title.id = 'messagesFileViewerTitle';
    const actions = document.createElement('div');
    actions.className = 'ocs__links';
    downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.className = 'ocs__btn small ocs__btn--icon';
    const glyph = document.createElement('i');
    glyph.className = 'fas fa-download';
    glyph.setAttribute('aria-hidden', 'true');
    downloadButton.append(glyph, text.download);
    downloadButton.addEventListener('click', () => onDownload?.(downloadButton));
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'ocs__btn small';
    closeButton.setAttribute('aria-label', text.close);
    closeButton.textContent = '×';
    closeButton.addEventListener('click', close);
    actions.append(downloadButton, closeButton);
    header.append(title, actions);
    body = document.createElement('div');
    body.className = 'dm__viewer-body';
    card.append(header, body);
    modal.appendChild(card);
    modal.addEventListener('click', event => {
      if (event.target === modal) close();
    });
    root.appendChild(modal);
  }

  function release() {
    if (url) URL.revokeObjectURL(url);
    url = null;
  }

  // asked: 'image' for a picture sent in the chat, whose name ("Image from Grace") gives no
  // kind. Only an image can be asked for: an <img> runs nothing, whatever the blob holds.
  async function content(name, blob, asked) {
    const preview = asked === 'image' ? 'image' : fileKind(name).preview;
    if (preview === 'text') {
      const pre = document.createElement('pre');
      pre.className = 'ocs__file-preview';
      pre.textContent = await blob.slice(0, TEXT_PREVIEW_BYTES).text();
      if (blob.size <= TEXT_PREVIEW_BYTES) return [pre];
      const note = document.createElement('em');
      note.className = 'dm__viewer-note';
      note.textContent = text.textCut.replace('{size}', formatBytes(TEXT_PREVIEW_BYTES));
      return [pre, note];
    }
    if (!preview) {
      const note = document.createElement('p');
      note.className = 'ocs__text';
      note.textContent = text.noPreview;
      return [note];
    }
    release();
    // The type comes from the name, so a file can't pass for another kind; a picture from
    // the chat, whose name has no type, keeps its own image type.
    const named = mimeFor(name);
    const type = preview === 'image' && !named.startsWith('image/') && blob.type?.startsWith('image/') ? blob.type : named;
    url = URL.createObjectURL(new Blob([blob], { type }));
    const media = document.createElement({ image: 'img', video: 'video', audio: 'audio', pdf: 'iframe' }[preview]);
    media.className = 'ocs__file-preview';
    media.src = url;
    if (preview === 'image') media.alt = name;
    if (preview === 'video' || preview === 'audio') media.controls = true;
    if (preview === 'pdf') media.title = name;
    return [media];
  }

  // file: { name, blob, preview, onDownload(control) }, preview being 'image' when the name
  // doesn't say so. opener gets focus back on close.
  async function show({ name, blob, preview = null, onDownload: download }, opener) {
    if (!modal) build();
    returnFocus = opener || document.activeElement;
    onDownload = download || null;
    // The shared .hidden class, not the attribute: ocs__btn sets its own display.
    downloadButton.classList.toggle('hidden', !onDownload);
    title.textContent = nameOf(name);
    title.title = name;
    body.replaceChildren(...await content(name, blob, preview));
    modal.classList.remove('hidden');
    document.addEventListener('keydown', onKeydown, true);
    downloadButton.focus?.();
  }

  function close() {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.removeEventListener('keydown', onKeydown, true);
    body.replaceChildren();
    release();
    returnFocus?.focus?.();
    returnFocus = null;
  }

  return {
    show,
    close,
    isOpen: () => Boolean(modal) && !modal.classList.contains('hidden'),
    destroy() {
      close();
      modal?.remove();
      modal = null;
    },
  };
}
