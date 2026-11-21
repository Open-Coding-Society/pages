// A menu a button opens, like the composer's Attach menu. Drawn with
// the ocs__menu grammar; this only does the behaviour: open and close, the arrow keys,
// Home and End, Escape (focus back on the button), and closing on a click elsewhere.

/**
 * One button's menu.
 */
export class PopupMenu {
  static #count = 0;

  #button;
  #items;
  #menu;
  #open = false;
  #choices = [];

  /**
   * Builds the menu, closed, and wires its button.
   * @param {object} options
   * @param {HTMLElement} options.button what opens it
   * @param {HTMLElement} options.container where the menu goes
   * @param {string} options.label its name for assistive technology
   * @param {Array|Function} options.items [{ icon, label, hint, onPick(button), disabled }],
   *   or a function that gives them as it opens, so a menu can offer different things in
   *   different conversations
   */
  constructor({ button, container, label, items }) {
    this.#button = button;
    this.#items = items;
    PopupMenu.#count += 1;
    const id = `ocs-menu-${PopupMenu.#count}`;
    const menu = document.createElement('div');
    menu.className = 'ocs__menu';
    menu.id = id;
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', label);
    menu.hidden = true;
    container.appendChild(menu);
    this.#menu = menu;
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);

    button.addEventListener('click', this.#onButtonClick);
    button.addEventListener('keydown', this.#onButtonKeydown);
    menu.addEventListener('keydown', event => {
      // Counted among the enabled items, the ones #focusItem steps through.
      const at = this.#enabled().indexOf(document.activeElement);
      if (event.key === 'ArrowDown') this.#focusItem(at + 1);
      else if (event.key === 'ArrowUp') this.#focusItem(at - 1);
      else if (event.key === 'Home') this.#focusItem(0);
      else if (event.key === 'End') this.#focusItem(-1);
      else if (event.key === 'Escape') this.close();
      else if (event.key === 'Tab') this.close({ refocus: false });
      else return;
      if (event.key !== 'Tab') event.preventDefault();
    });
  }

  /** The menu's element. */
  get element() {
    return this.#menu;
  }

  /** @returns {boolean} whether the menu is open */
  isOpen() {
    return this.#open;
  }

  /**
   * Closes the menu.
   * @param {{refocus?: boolean}} options refocus puts focus back on the button (the default)
   */
  close({ refocus = true } = {}) {
    if (!this.#open) return;
    this.#open = false;
    this.#menu.hidden = true;
    this.#button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', this.#onDocumentClick, true);
    if (refocus) this.#button.focus();
  }

  /** Closes the menu, takes it off the page and lets go of its button. */
  destroy() {
    this.close({ refocus: false });
    this.#button.removeEventListener('click', this.#onButtonClick);
    this.#button.removeEventListener('keydown', this.#onButtonKeydown);
    this.#menu.remove();
  }

  #onButtonClick = () => (this.#open ? this.close() : this.#show());

  #onButtonKeydown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.#show();
      if (event.key === 'ArrowUp') this.#focusItem(-1);
    }
  };

  #enabled() {
    return this.#choices.filter(item => !item.disabled);
  }

  #focusItem(index) {
    const enabled = this.#enabled();
    if (!enabled.length) return;
    enabled[(index + enabled.length) % enabled.length].focus();
  }

  #onDocumentClick = event => {
    if (!this.#menu.contains(event.target) && !this.#button.contains(event.target)) this.close();
  };

  #build() {
    const list = typeof this.#items === 'function' ? this.#items() : this.#items;
    this.#choices = list.map(item => {
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
        this.close({ refocus: false });
        item.onPick(this.#button);
      });
      return choice;
    });
    this.#menu.replaceChildren(...this.#choices);
  }

  #show() {
    this.#build();
    this.#open = true;
    this.#menu.hidden = false;
    this.#button.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this.#onDocumentClick, true);
    this.#focusItem(0);
  }
}
