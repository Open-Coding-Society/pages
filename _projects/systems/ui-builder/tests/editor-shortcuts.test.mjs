import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createShortcuts, isMacPlatform, isTypingTarget, keyEventOf, shortcutOf } from '../js/editor-shortcuts.js';

const key = (k, extra = {}) => ({ key: k, code: extra.code || '', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...extra });

test('the keymap uses Cmd on a Mac and Ctrl elsewhere', () => {
  assert.equal(shortcutOf(key('z', { metaKey: true }), { mac: true }), 'undo');
  assert.equal(shortcutOf(key('z', { ctrlKey: true }), { mac: false }), 'undo');
  assert.equal(shortcutOf(key('z', { ctrlKey: true }), { mac: true }), null, 'Ctrl+Z is not undo on a Mac');
  assert.equal(shortcutOf(key('Z', { metaKey: true, shiftKey: true }), { mac: true }), 'redo');
  assert.equal(shortcutOf(key('z', { ctrlKey: true, shiftKey: true })), 'redo');
  assert.equal(shortcutOf(key('y', { ctrlKey: true }), { mac: true }), 'redo', 'Ctrl+Y redoes everywhere');
  assert.equal(shortcutOf(key('d', { metaKey: true }), { mac: true }), 'duplicate');
  assert.equal(shortcutOf(key('d', { ctrlKey: true, shiftKey: true })), null);
});

test('moves, delete, the palette, escape and the regions key', () => {
  assert.equal(shortcutOf(key('ArrowUp', { altKey: true, shiftKey: true })), 'move_up');
  assert.equal(shortcutOf(key('ArrowDown', { altKey: true, shiftKey: true })), 'move_down');
  assert.equal(shortcutOf(key('ArrowDown', { altKey: true })), null, 'Alt alone is not a move');
  assert.equal(shortcutOf(key('Delete')), 'remove');
  assert.equal(shortcutOf(key('Backspace')), 'remove');
  assert.equal(shortcutOf(key('Backspace', { metaKey: true })), null);
  assert.equal(shortcutOf(key('/')), 'palette');
  assert.equal(shortcutOf(key('/', { shiftKey: true })), 'palette', 'layouts where / needs Shift still open it');
  assert.equal(shortcutOf(key('/', { ctrlKey: true })), null);
  assert.equal(shortcutOf(key('Escape')), 'escape');
  assert.equal(shortcutOf(key('`', { ctrlKey: true, code: 'Backquote' }), { mac: true }), 'regions', 'Ctrl on every platform');
  assert.equal(shortcutOf(key('Dead', { ctrlKey: true, code: 'Backquote' })), 'regions', 'by key position on other layouts');
  assert.equal(shortcutOf(key('a')), null);
  assert.equal(shortcutOf(null), null);
  assert.equal(shortcutOf({ key: 7 }), null);
});

test('typing targets follow keyboard-shortcuts.js isInEditMode', () => {
  assert.equal(isTypingTarget({ tagName: 'INPUT' }), true);
  assert.equal(isTypingTarget({ tagName: 'textarea' }), true);
  assert.equal(isTypingTarget({ tagName: 'DIV', isContentEditable: true }), true);
  assert.equal(isTypingTarget({ tagName: 'DIV', closest: (selector) => (selector === '.CodeMirror' ? {} : null) }), true);
  assert.equal(isTypingTarget({ tagName: 'BUTTON', closest: () => null }), false);
  assert.equal(isTypingTarget(null), false);
});

test('the forwarded key is a plain object with exactly the six fields', () => {
  const event = { key: 'z', code: 'KeyZ', ctrlKey: true, metaKey: 0, shiftKey: 'yes', altKey: true, target: {}, preventDefault() {} };
  assert.deepEqual(keyEventOf(event), { key: 'z', code: 'KeyZ', ctrlKey: true, metaKey: false, shiftKey: false, altKey: true });
});

test('isMacPlatform reads userAgentData first, then platform', () => {
  assert.equal(isMacPlatform({ userAgentData: { platform: 'macOS' } }), true);
  assert.equal(isMacPlatform({ platform: 'MacIntel' }), true);
  assert.equal(isMacPlatform({ platform: 'Win32' }), false);
  assert.equal(isMacPlatform(null), false);
});

test('createShortcuts skips typing, honours isBlocked and takes forwarded canvas keys', () => {
  const actions = [];
  const listeners = {};
  const target = { addEventListener: (type, fn) => { listeners[type] = fn; }, removeEventListener: (type) => { delete listeners[type]; } };
  let blocked = false;
  const shortcuts = createShortcuts({ target, mac: false, onAction: (action, info) => actions.push([action, info.fromCanvas]), isBlocked: () => blocked });
  let prevented = 0;
  const event = (k, extra = {}) => ({ ...key(k, extra), target: { tagName: 'BODY' }, preventDefault: () => { prevented += 1; } });
  listeners.keydown(event('z', { ctrlKey: true }));
  listeners.keydown({ ...event('Delete'), target: { tagName: 'INPUT' } });
  assert.deepEqual(actions, [['undo', false]], 'Delete in an input is the input\'s');
  assert.equal(shortcuts.handle({ key: 'Delete', code: 'Delete', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }, { fromCanvas: true }), 'remove');
  blocked = true;
  assert.equal(shortcuts.handle(event('/')), null);
  assert.equal(prevented, 1, 'only the handled browser event is prevented');
  shortcuts.destroy();
  assert.equal(listeners.keydown, undefined);
  assert.throws(() => createShortcuts({ target }), /onAction/);
});
