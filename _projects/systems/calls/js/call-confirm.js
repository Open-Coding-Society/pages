// A strong confirm for what can't be undone during a call (Remove someone, End for everyone): the
// grammar's modal, with Cancel focused first and Escape as Cancel.

/** new CallConfirm({root, strings}); await confirm.ask({title, text, confirm}) gives true or false. */
export class CallConfirm {
  constructor({ root, strings }) {
    this.root = root;
    this.t = strings.text;
    this.open = null; // the dialog on screen and how to close it
  }

  ask({ title, text, confirm }) {
    this.close(false);
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.className = 'ocs__modal';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'callConfirmTitle');
      const card = document.createElement('div');
      card.className = 'ocs__modal-card ocs__stack';
      const header = document.createElement('div');
      header.className = 'ocs__modal-header';
      const heading = document.createElement('h3');
      heading.className = 'ocs__modal-title';
      heading.id = 'callConfirmTitle';
      heading.textContent = title;
      header.appendChild(heading);
      const body = document.createElement('p');
      body.className = 'ocs__text';
      body.textContent = text;
      const actions = document.createElement('div');
      actions.className = 'ocs__modal-actions';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'ocs__btn';
      cancel.dataset.call = 'cancel';
      cancel.textContent = this.t.cancel;
      const yes = document.createElement('button');
      yes.type = 'button';
      yes.className = 'ocs__btn alert-red fill';
      yes.dataset.call = 'confirm';
      yes.textContent = confirm;
      actions.append(cancel, yes);
      card.append(header, body, actions);
      dialog.appendChild(card);

      const returnFocus = document.activeElement;
      const onCancel = () => this.close(false);
      const onYes = () => this.close(true);
      const onKey = (event) => { if (event.key === 'Escape') this.close(false); };
      cancel.addEventListener('click', onCancel);
      yes.addEventListener('click', onYes);
      dialog.addEventListener('keydown', onKey);
      this.open = {
        finish: (answer) => {
          cancel.removeEventListener('click', onCancel);
          yes.removeEventListener('click', onYes);
          dialog.removeEventListener('keydown', onKey);
          dialog.remove();
          returnFocus?.focus?.();
          resolve(answer);
        },
      };
      this.root.appendChild(dialog);
      cancel.focus();
    });
  }

  close(answer) {
    const open = this.open;
    this.open = null;
    open?.finish(answer);
  }

  destroy() {
    this.close(false);
  }
}
