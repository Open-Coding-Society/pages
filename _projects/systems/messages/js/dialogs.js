// Opens and closes one ocs__modal. The shared .hidden rule hides it; Escape, the
// backdrop and any [data-close] control close it; focus goes back to whatever opened it.
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
