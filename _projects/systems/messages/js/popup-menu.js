// A menu a button opens: the composer's Attach menu, a message's More actions. Drawn with
// the ocs__menu grammar; this only does the behaviour: open and close, the arrow keys,
// Home and End, Escape (focus back on the button), and closing on a click elsewhere.
// Items are { icon, label, hint, onPick, disabled }; `items` may be a function, so a menu
// can offer different things in different conversations.

let menuCount = 0;

export function createPopupMenu({ button, container, label, items }) {
  const id = `ocs-menu-${++menuCount}`;
  const menu = document.createElement('div');
  menu.className = 'ocs__menu';
  menu.id = id;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', label);
  menu.hidden = true;
  container.appendChild(menu);
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);

  let open = false;
  let buttons = [];

  const focusItem = index => {
    const enabled = buttons.filter(item => !item.disabled);
    if (!enabled.length) return;
    enabled[(index + enabled.length) % enabled.length].focus();
  };

  function onDocumentClick(event) {
    if (!menu.contains(event.target) && !button.contains(event.target)) close();
  }

  function build() {
    const list = typeof items === 'function' ? items() : items;
    buttons = list.map(item => {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'ocs__menu-item';
      choice.setAttribute('role', 'menuitem');
      choice.disabled = Boolean(item.disabled);
      const icon = document.createElement('i');
      icon.className = `fas ${item.icon} ocs__menu-icon`;
      icon.setAttribute('aria-hidden', 'true');
      const name = document.createElement('strong');
      name.className = 'ocs__menu-name';
      name.textContent = item.label;
      choice.append(icon, name);
      if (item.hint) {
        const hint = document.createElement('em');
        hint.className = 'ocs__menu-hint';
        hint.textContent = item.hint;
        choice.appendChild(hint);
      }
      choice.addEventListener('click', () => {
        close({ refocus: false });
        item.onPick(button);
      });
      return choice;
    });
    menu.replaceChildren(...buttons);
  }

  function show() {
    build();
    open = true;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocumentClick, true);
    focusItem(0);
  }

  function close({ refocus = true } = {}) {
    if (!open) return;
    open = false;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocumentClick, true);
    if (refocus) button.focus();
  }

  button.addEventListener('click', () => (open ? close() : show()));
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      show();
      if (event.key === 'ArrowUp') focusItem(-1);
    }
  });
  menu.addEventListener('keydown', event => {
    const at = buttons.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') focusItem(at + 1);
    else if (event.key === 'ArrowUp') focusItem(at - 1);
    else if (event.key === 'Home') focusItem(0);
    else if (event.key === 'End') focusItem(-1);
    else if (event.key === 'Escape') close();
    else if (event.key === 'Tab') close({ refocus: false });
    else return;
    if (event.key !== 'Tab') event.preventDefault();
  });

  return {
    element: menu,
    isOpen: () => open,
    close,
    destroy() {
      close({ refocus: false });
      menu.remove();
    },
  };
}
