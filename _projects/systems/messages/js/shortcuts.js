// /dm's keyboard shortcuts, in one place so /help can list exactly what works:
//   Ctrl or Cmd+K      find a conversation
//   Alt+↑ / Alt+↓      the conversation above or below the open one, as the lists show them
//   Ctrl or Cmd+/      the command menu
// Alt+↑/↓ are left alone while typing in a field (they move the caret there), except in an
// empty message box.

export const SHORTCUTS = Object.freeze([
  { keys: ['Ctrl', 'K'], mac: ['⌘', 'K'], does: 'Find a conversation' },
  { keys: ['Alt', '↑'], mac: ['⌥', '↑'], does: 'Open the conversation above' },
  { keys: ['Alt', '↓'], mac: ['⌥', '↓'], does: 'Open the conversation below' },
  { keys: ['Ctrl', '/'], mac: ['⌘', '/'], does: 'Show every slash command' },
  { keys: ['/'], mac: ['/'], does: 'At the start of a message: open the command menu' },
  { keys: ['Enter'], mac: ['Enter'], does: 'Send (in a list, the next item)' },
  { keys: ['Shift', 'Enter'], mac: ['Shift', 'Enter'], does: 'A new line' },
  { keys: ['Ctrl', 'Enter'], mac: ['⌘', 'Enter'], does: 'Send, even from a list or the code box' },
  { keys: ['Esc'], mac: ['Esc'], does: 'Close a menu, a reply or an edit' },
]);

const isTyping = target => Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));

// order(): the conversations as the sidebar lists them, [{ kind, id }]; active(): the open
// one or null; open(kind, id) opens one; findConversation() focuses the search box;
// showCommands() opens the command menu; isEmptyComposer(target) says whether a target is
// the message box with nothing in it.
export function initShortcuts({ order, active, open, findConversation, showCommands, isEmptyComposer = () => false }) {
  function step(direction) {
    const list = order();
    if (!list.length) return false;
    const current = active();
    const at = current ? list.findIndex(item => item.kind === current.kind && item.id === current.id) : -1;
    const next = list[(at + direction + list.length) % list.length];
    if (at === -1 && direction < 0) return open(list[list.length - 1].kind, list[list.length - 1].id);
    return open(next.kind, next.id);
  }

  function onKeydown(event) {
    if (event.defaultPrevented || event.isComposing) return;
    const command = event.metaKey || event.ctrlKey;
    if (command && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      findConversation();
      return;
    }
    if (command && !event.altKey && event.key === '/') {
      event.preventDefault();
      showCommands();
      return;
    }
    if (event.altKey && !command && !event.shiftKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      if (isTyping(event.target) && !isEmptyComposer(event.target)) return;
      event.preventDefault();
      step(event.key === 'ArrowUp' ? -1 : 1);
    }
  }

  document.addEventListener('keydown', onKeydown);
  return { destroy: () => document.removeEventListener('keydown', onKeydown), step };
}
