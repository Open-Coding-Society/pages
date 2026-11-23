// Keyboard shortcuts and the /help dialog that lists them.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom } from './fake-dom.mjs';

const { document } = installFakeDom();
const { Shortcuts } = await import('../js/shortcuts.js');
const { HelpDialog } = await import('../js/help-dialog.js');
const { SlashCommands } = await import('../js/slash-commands.js');

const press = (key, extra = {}, target = document.body) => {
  const event = fakeEvent('keydown', { key, target, ...extra });
  document.dispatchEvent(event);
  return event;
};

function setup(activeItem = { kind: 'group', id: 7 }) {
  const calls = [];
  let active = activeItem;
  const shortcuts = new Shortcuts({
    order: () => [{ kind: 'group', id: 7 }, { kind: 'group', id: 12 }, { kind: 'dm', id: 4 }],
    active: () => active,
    open: (kind, id) => { calls.push(['open', kind, id]); active = { kind, id }; return true; },
    findConversation: () => calls.push(['find']),
    showCommands: () => calls.push(['commands']),
    canSwitchFrom: target => target.dataset.empty === 'yes',
  });
  return { calls, shortcuts };
}

test('Ctrl or Cmd+K finds a conversation, and Ctrl or Cmd+/ shows the commands', () => {
  const { calls, shortcuts } = setup();
  assert.equal(press('k', { metaKey: true }).defaultPrevented, true);
  press('K', { ctrlKey: true });
  press('/', { ctrlKey: true });
  assert.deepEqual(calls, [['find'], ['find'], ['commands']]);
  shortcuts.destroy();
});

test('Alt+↑ and Alt+↓ step through the conversations in the sidebar’s order, wrapping around', () => {
  const { calls, shortcuts } = setup();
  press('ArrowDown', { altKey: true });
  press('ArrowDown', { altKey: true });
  press('ArrowDown', { altKey: true });
  press('ArrowUp', { altKey: true });
  assert.deepEqual(calls.map(call => `${call[1]}:${call[2]}`), ['group:12', 'dm:4', 'group:7', 'dm:4']);
  shortcuts.destroy();
});

test('Alt+arrows are left to a field being typed in, unless it is the empty message box', () => {
  const { calls, shortcuts } = setup();
  const field = document.createElement('input');
  document.body.appendChild(field);
  const typing = press('ArrowDown', { altKey: true }, field);
  assert.equal(typing.defaultPrevented, false);
  const editor = document.createElement('div');
  editor.setAttribute('contenteditable', 'true');
  editor.dataset.empty = 'yes';
  document.body.appendChild(editor);
  press('ArrowDown', { altKey: true }, editor);
  assert.deepEqual(calls, [['open', 'group', 12]]);
  shortcuts.destroy();
  press('k', { metaKey: true });
  assert.equal(calls.length, 1, 'destroy() takes the listener back');
});

test('/help lists every shortcut and every command, with ⌘ on a Mac', () => {
  const dialog = document.createElement('div');
  dialog.className = 'ocs__modal hidden';
  const body = document.createElement('div');
  document.body.append(dialog, body);
  const help = new HelpDialog({ elements: { dialog, body }, isMac: true });
  help.open(null);
  assert.equal(help.isOpen(), true);
  const text = body.textContent;
  Shortcuts.ALL.forEach(shortcut => assert.ok(text.includes(shortcut.does), shortcut.does));
  SlashCommands.ALL.forEach(command => assert.ok(text.includes(`/${command.name}`), command.name));
  assert.match(text, /⌘/);
  assert.match(text, /only in group chats/);
});
