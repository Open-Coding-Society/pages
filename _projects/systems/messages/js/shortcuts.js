// /dm's keyboard shortcuts, in one place so /help can list exactly what works:
//   Ctrl or Cmd+K      find a conversation
//   Alt+↑ / Alt+↓      the conversation above or below the open one, as the lists show them
//   Ctrl or Cmd+/      the command menu
// Alt+↑/↓ are left alone while typing in a field (they move the caret there), except where
// canSwitchFrom(target) says switching is fine: the empty message box, the conversation search.

const isTyping = target => Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));

/**
 * The page's keyboard shortcuts, listened for on the document.
 */
export class Shortcuts {
  /** Every shortcut, as /help lists it: keys, the Mac's keys, and what it does. */
  static ALL = Object.freeze([
    { keys: ['Ctrl', 'K'], mac: ['⌘', 'K'], does: 'Find a conversation (type, then Enter opens the first match)' },
    { keys: ['Alt', '↑'], mac: ['⌥', '↑'], does: 'Open the conversation above' },
    { keys: ['Alt', '↓'], mac: ['⌥', '↓'], does: 'Open the conversation below' },
    { keys: ['Ctrl', '/'], mac: ['⌘', '/'], does: 'Show every slash command' },
    { keys: ['/'], mac: ['/'], does: 'At the start of a message: open the command menu' },
    { keys: ['Enter'], mac: ['Enter'], does: 'Send' },
    { keys: ['Shift', 'Enter'], mac: ['Shift', 'Enter'], does: 'A new line (in a list, the next item)' },
    { keys: ['Ctrl', 'Enter'], mac: ['⌘', 'Enter'], does: 'Send from the code box' },
    { keys: ['Esc'], mac: ['Esc'], does: 'Close a menu, a reply or an edit' },
  ]);

  #order;
  #active;
  #open;
  #findConversation;
  #showCommands;
  #canSwitchFrom;

  /**
   * Starts listening.
   * @param {object} options
   * @param {Function} options.order gives the conversations as the sidebar lists them, [{ kind, id }]
   * @param {Function} options.active gives the open one, or null
   * @param {Function} options.open open(kind, id) opens one
   * @param {Function} options.findConversation focuses the conversation search
   * @param {Function} options.showCommands opens the command menu
   * @param {Function} options.canSwitchFrom canSwitchFrom(target) says whether Alt+↑/↓ may
   *   switch conversations while that field has focus
   */
  constructor({ order, active, open, findConversation, showCommands, canSwitchFrom = () => false }) {
    this.#order = order;
    this.#active = active;
    this.#open = open;
    this.#findConversation = findConversation;
    this.#showCommands = showCommands;
    this.#canSwitchFrom = canSwitchFrom;
    document.addEventListener('keydown', this.#onKeydown);
  }

  /**
   * Opens the conversation `direction` places away from the open one, wrapping around.
   * @param {number} direction -1 for the one above, 1 for the one below
   * @returns {*} what open() returned, or false when there are no conversations
   */
  step(direction) {
    const list = this.#order();
    if (!list.length) return false;
    const current = this.#active();
    const at = current ? list.findIndex(item => item.kind === current.kind && item.id === current.id) : -1;
    const next = list[(at + direction + list.length) % list.length];
    if (at === -1 && direction < 0) return this.#open(list[list.length - 1].kind, list[list.length - 1].id);
    return this.#open(next.kind, next.id);
  }

  /** Stops listening. */
  destroy() {
    document.removeEventListener('keydown', this.#onKeydown);
  }

  #onKeydown = event => {
    if (event.defaultPrevented || event.isComposing) return;
    const command = event.metaKey || event.ctrlKey;
    if (command && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.#findConversation();
      return;
    }
    if (command && !event.altKey && event.key === '/') {
      event.preventDefault();
      this.#showCommands();
      return;
    }
    if (event.altKey && !command && !event.shiftKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      if (isTyping(event.target) && !this.#canSwitchFrom(event.target)) return;
      event.preventDefault();
      this.step(event.key === 'ArrowUp' ? -1 : 1);
    }
  };
}
