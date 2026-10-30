// Editor keyboard shortcuts (DESIGN §10). shortcutOf is a pure keymap; createShortcuts listens on
// the editor document and also takes the keys the canvas iframe forwards (canvas.js uses the same
// keymap in its own window). Shortcuts never fire while someone types: the same rule as
// assets/js/keyboard-shortcuts.js isInEditMode (inputs, textareas, contenteditable, CodeMirror).

export const ACTIONS = Object.freeze(['undo', 'redo', 'duplicate', 'move_up', 'move_down', 'remove', 'palette', 'escape', 'regions']);

const KEY_FIELDS = ['key', 'code', 'ctrlKey', 'metaKey', 'shiftKey', 'altKey'];

export function isMacPlatform(nav = globalThis.navigator) {
  const platform = String((nav && ((nav.userAgentData && nav.userAgentData.platform) || nav.platform)) || '');
  return /mac|iphone|ipad|ipod/i.test(platform);
}

// Works on elements from any window (the canvas is another realm), so it reads names, not classes.
export function isTypingTarget(element) {
  if (!element || typeof element !== 'object') return false;
  const tag = String(element.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return true;
  if (element.isContentEditable === true) return true;
  return typeof element.closest === 'function' && Boolean(element.closest('.CodeMirror'));
}

// The plain shape the canvas forwards: no event object crosses the iframe boundary.
export function keyEventOf(event) {
  const out = {};
  for (const name of KEY_FIELDS) {
    const value = event ? event[name] : undefined;
    out[name] = name === 'key' || name === 'code' ? String(value || '') : value === true;
  }
  return out;
}

// One event → an action name or null. mod is Cmd on a Mac and Ctrl elsewhere; Ctrl+Y redoes
// everywhere and Ctrl+` (the regions key) is Ctrl on every platform, like VS Code's.
export function shortcutOf(event, { mac = false } = {}) {
  if (!event || typeof event.key !== 'string') return null;
  const { key, code = '', ctrlKey = false, metaKey = false, shiftKey = false, altKey = false } = event;
  const mod = mac ? metaKey : ctrlKey;
  const other = mac ? ctrlKey : metaKey;
  const lower = key.length === 1 ? key.toLowerCase() : key;
  if (ctrlKey && !metaKey && !altKey && (code === 'Backquote' || key === '`')) return 'regions';
  if (mod && !other && !altKey) {
    if (lower === 'z') return shiftKey ? 'redo' : 'undo';
    if (lower === 'd' && !shiftKey) return 'duplicate';
  }
  if (ctrlKey && !metaKey && !altKey && !shiftKey && lower === 'y') return 'redo';
  if (altKey && shiftKey && !ctrlKey && !metaKey) {
    if (key === 'ArrowUp') return 'move_up';
    if (key === 'ArrowDown') return 'move_down';
  }
  if (ctrlKey || metaKey || altKey) return null;
  if ((key === 'Delete' || key === 'Backspace') && !shiftKey) return 'remove';
  if (key === '/') return 'palette';
  if (key === 'Escape') return 'escape';
  return null;
}

// Listens on `target` (the editor document). handle() is also called with the canvas's forwarded
// keys ({fromCanvas: true}); those already passed the typing check inside the canvas.
// isBlocked(action, event) lets the app refuse an action (a dialog is open, read-only mode).
export function createShortcuts({ target, mac = false, onAction, isBlocked = () => false } = {}) {
  if (typeof onAction !== 'function') throw new TypeError('UI Builder shortcuts: onAction must be a function');
  function handle(event, { fromCanvas = false } = {}) {
    if (!event || event.defaultPrevented) return null;
    if (!fromCanvas && isTypingTarget(event.target)) return null;
    const action = shortcutOf(event, { mac });
    if (!action || isBlocked(action, event, { fromCanvas })) return null;
    if (typeof event.preventDefault === 'function') event.preventDefault();
    onAction(action, { fromCanvas, event });
    return action;
  }
  const listener = (event) => { handle(event); };
  if (target && typeof target.addEventListener === 'function') target.addEventListener('keydown', listener);
  return {
    handle,
    destroy() {
      if (target && typeof target.removeEventListener === 'function') target.removeEventListener('keydown', listener);
    },
  };
}
