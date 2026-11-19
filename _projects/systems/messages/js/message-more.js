// A message's More menu: a small ocs__menu under its "…" button with Copy text, Add to
// calendar and New GitHub issue. One is open at a time, and it closes on a pick, Escape (focus
// back on the button) or a click anywhere else.

/**
 * The log's More menus, one open at a time.
 */
export class MoreMenu {
  #text;
  #onMore;
  #onSchedule;
  #makeButton;
  #open = null; // { button, menu, row } while a menu is open

  /**
   * @param {object} options
   * @param {object} options.text the log's wording (moreActions, copyText, addToCalendar, newIssue)
   * @param {Function|null} options.onMore onMore(action, message) does Copy ('copy') and the
   *   issue ('issue'), in thread.js; null leaves those items out
   * @param {Function|null} options.onSchedule onSchedule(message, opener) opens Add to
   *   calendar, with the "…" button as the opener that gets focus back; null leaves it out
   * @param {Function} options.makeButton makeButton(icon, label, onClick) is the log's own
   *   action button, so the "…" looks like Reply
   */
  constructor({ text, onMore = null, onSchedule = null, makeButton }) {
    this.#text = text;
    this.#onMore = onMore;
    this.#onSchedule = onSchedule;
    this.#makeButton = makeButton;
  }

  /**
   * The "…" button for one message. Its menu opens inside `actions`, the message's bar.
   * @param {HTMLElement} actions
   * @param {Function} messageOf gives the message when an item is picked
   * @returns {HTMLElement} the button
   */
  button(actions, messageOf) {
    const text = this.#text;
    const control = this.#makeButton('fa-ellipsis', text.moreActions, () => {
      if (this.#open?.button === control) {
        this.close();
        return;
      }
      this.close();
      const menu = document.createElement('div');
      menu.className = 'ocs__menu chat-more-menu';
      menu.setAttribute('role', 'menu');
      if (this.#onMore) menu.append(this.#item('fa-copy', text.copyText, () => this.#onMore('copy', messageOf())));
      if (this.#onSchedule) menu.append(this.#item('fa-calendar-plus', text.addToCalendar, () => this.#onSchedule(messageOf(), control)));
      if (this.#onMore) menu.append(this.#item('fa-circle-dot', text.newIssue, () => this.#onMore('issue', messageOf())));
      actions.appendChild(menu);
      control.setAttribute('aria-expanded', 'true');
      // Each message row is its own stacking context (its fade-in animation), so the menu's
      // z-index can't lift it over the messages after it: the row itself is raised meanwhile.
      const row = actions.closest('.chat-msg');
      row?.classList.add('is-menu-open');
      this.#open = { button: control, menu, row };
      document.addEventListener('click', this.#onOutside, true);
      document.addEventListener('keydown', this.#onKey);
      menu.querySelector('button')?.focus?.();
    });
    control.setAttribute('aria-haspopup', 'menu');
    control.setAttribute('aria-expanded', 'false');
    return control;
  }

  /** Closes the open menu, if there is one. */
  close() {
    if (!this.#open) return;
    this.#open.menu.remove();
    this.#open.button.setAttribute('aria-expanded', 'false');
    this.#open.row?.classList.remove('is-menu-open');
    document.removeEventListener('click', this.#onOutside, true);
    document.removeEventListener('keydown', this.#onKey);
    this.#open = null;
  }

  #onOutside = event => {
    if (this.#open && !this.#open.menu.contains(event.target) && !this.#open.button.contains(event.target)) this.close();
  };

  #onKey = event => {
    if (event.key !== 'Escape' || !this.#open) return;
    const { button } = this.#open;
    this.close();
    button.focus?.();
  };

  #item(icon, label, run) {
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = 'ocs__menu-item';
    choice.setAttribute('role', 'menuitem');
    const glyph = document.createElement('i');
    glyph.className = `fas ${icon} ocs__menu-icon`;
    glyph.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong');
    name.className = 'ocs__menu-name';
    name.textContent = label;
    choice.append(glyph, name);
    choice.addEventListener('click', () => {
      this.close();
      run();
    });
    return choice;
  }
}
