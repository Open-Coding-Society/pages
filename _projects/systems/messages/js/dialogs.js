// Opens and closes one ocs__modal. The shared .hidden rule hides it; Escape, the
// backdrop and any [data-close] control close it; focus goes back to whatever opened it.
import { downloadName } from './messages-model.js';

export function createDialog(modal, { onClose } = {}) {
  let returnFocus = null;

  // Safari doesn't focus a button when it is clicked, so callers pass the button.
  function open(opener) {
    returnFocus = opener || document.activeElement;
    modal.classList.remove('hidden');
    modal.querySelector('[data-focus]')?.focus();
  }

  function close() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    if (onClose) onClose();
    returnFocus?.focus?.();
  }

  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('[data-close]')) close();
  });
  // On the document, not the modal: removing a row can drop focus to <body>.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || modal.classList.contains('hidden')) return;
    event.preventDefault();
    close();
  });

  return { open, close, isOpen: () => !modal.classList.contains('hidden') };
}

// Turns one entry from /api/groups/chat/{id}/files into a download. Lives here rather
// than in group-dialogs.js because the Files dialog and the chat log (thread.js, where
// a shared file appears as a line you can click) both need it.
export function saveFile(file) {
  const bytes = Uint8Array.from(atob(file.base64Data || ''), character => character.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes]));
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName(file.filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Reads an image file and returns a data URL, downscaled so the long edge is at most
// MAX_IMAGE_EDGE. A group's messages are stored as one JSONL file that is read and
// rewritten on every send, so pasting a phone photo in at full size would bloat every
// later read of that conversation; 1280px is still sharp at the width the log renders.
// Re-encoded as JPEG unless the source is a PNG, which is kept so screenshots of text
// and anything transparent do not pick up compression artefacts.
const MAX_IMAGE_EDGE = 1280;

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That file is not an image.'));
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
        if (scale === 1 && reader.result.length < 600000) {
          resolve(reader.result);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        const isPng = /^data:image\/png/.test(reader.result);
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Small DOM builders shared by the dialogs.
export function cell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

export function button(label, className, onClick) {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = className;
  control.textContent = label;
  control.addEventListener('click', () => onClick(control));
  return control;
}
