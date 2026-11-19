// The slash-command menu. Typing "/" at the start of the composer opens a grouped menu of the
// commands this conversation has (ocs__menu), narrowed as you type. ↑ ↓ move, Enter or Tab
// picks, Escape closes, and a click picks too. A command that needs words after it (/issue
// owner/repo#12) is put in the composer for you to finish; Enter then runs it instead of
// sending. One whose words are optional (/code [language]) runs when picked. onRun(command,
// args) does the work (thread.js).
import { COMMANDS, matchCommands, parseCommand } from './slash-commands.js';

export const MENU_TEXTS = Object.freeze({
  label: 'Commands',
  foot: '↑ ↓ to move · Enter or Tab to pick · Esc to close',
  empty: 'No command starts with that. Try /help.',
});

let menuCount = 0;
const plain = composer => composer.editor.textContent.replace(/[\u200b\ufeff]/g, '').replace(/\u00a0/g, ' ');

// Puts the caret at the end of the editor, after a command's name is filled in.
function caretToEnd(editor) {
  if (typeof document.createRange !== 'function') return;
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function createCommandMenu({ composer, host, kindOf, onRun, texts = {} }) {
  const text = { ...MENU_TEXTS, ...texts };
  const id = `messagesCommands${++menuCount}`;
  const menu = document.createElement('div');
  menu.className = 'ocs__menu dm__commands';
  menu.id = id;
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-label', text.label);
  menu.hidden = true;
  host.appendChild(menu);
  const editor = composer.editor;
  editor.setAttribute('aria-autocomplete', 'list');
  editor.setAttribute('aria-controls', id);
  editor.setAttribute('aria-expanded', 'false');

  let items = []; // [{ command, element }]
  let index = 0;

  const isOpen = () => !menu.hidden;

  function close() {
    if (!isOpen()) return;
    menu.hidden = true;
    menu.replaceChildren();
    items = [];
    editor.setAttribute('aria-expanded', 'false');
    editor.removeAttribute('aria-activedescendant');
  }

  function highlight(next) {
    if (!items.length) return;
    index = (next + items.length) % items.length;
    items.forEach((item, at) => item.element.setAttribute('aria-selected', String(at === index)));
    const current = items[index].element;
    editor.setAttribute('aria-activedescendant', current.id);
    current.scrollIntoView?.({ block: 'nearest' });
  }

  function option(command) {
    const element = document.createElement('div');
    element.className = 'ocs__menu-item';
    element.id = `${id}-${command.name}`;
    element.setAttribute('role', 'option');
    element.setAttribute('aria-selected', 'false');
    const glyph = document.createElement('i');
    glyph.className = `fas ${command.icon} ocs__menu-icon`;
    glyph.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong');
    name.className = 'ocs__menu-name';
    name.textContent = `/${command.name}${command.args ? ` ${command.args}` : ''}`;
    const hint = document.createElement('em');
    hint.className = 'ocs__menu-hint';
    hint.textContent = command.hint;
    element.append(glyph, name, hint);
    // mousedown, not click: picking mustn't take focus from the composer first.
    element.addEventListener('mousedown', event => {
      event.preventDefault();
      pick(command);
    });
    element.addEventListener('mousemove', () => {
      const at = items.findIndex(item => item.command === command);
      if (at !== index) highlight(at);
    });
    return element;
  }

  function render(groups) {
    items = [];
    const nodes = groups.map(group => {
      const section = document.createElement('div');
      section.className = 'ocs__menu-group';
      section.setAttribute('role', 'group');
      const heading = document.createElement('b');
      heading.className = 'ocs__menu-heading';
      heading.id = `${id}-${group.id}`;
      heading.textContent = group.label;
      section.setAttribute('aria-labelledby', heading.id);
      section.appendChild(heading);
      group.commands.forEach(command => {
        const element = option(command);
        items.push({ command, element });
        section.appendChild(element);
      });
      return section;
    });
    const foot = document.createElement('em');
    foot.className = 'ocs__menu-foot';
    foot.textContent = items.length ? text.foot : text.empty;
    menu.replaceChildren(...nodes, foot);
    menu.hidden = false;
    editor.setAttribute('aria-expanded', 'true');
    highlight(0);
  }

  function update() {
    const kind = kindOf();
    const groups = kind ? matchCommands(plain(composer), { kind }) : null;
    if (!groups) {
      close();
      return;
    }
    render(groups);
  }

  function pick(command) {
    close();
    // Words a command needs ("owner/repo#number") are typed after its name; one whose words
    // are optional ("[language]") runs straight away.
    if (command.args && !command.args.startsWith('[')) {
      // Fill in the name and let the words after it be typed; Enter then runs it.
      composer.setHTML(`/${command.name}&nbsp;`);
      composer.focus();
      caretToEnd(editor);
      return;
    }
    composer.clear();
    onRun(command, '');
  }

  // A finished command in the composer, if there is one: what Enter or Send runs.
  function typedCommand() {
    const kind = kindOf();
    return kind ? parseCommand(plain(composer).trim(), { kind }) : null;
  }

  function onKeydown(event) {
    if (event.isComposing) return;
    if (isOpen() && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(event.key)) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (!items.length) {
        if (event.key === 'Enter' || event.key === 'Tab') close();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowDown') highlight(index + 1);
      else if (event.key === 'ArrowUp') highlight(index - 1);
      else pick(items[index].command);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const typed = typedCommand();
      if (!typed) return;
      event.preventDefault();
      event.stopPropagation();
      composer.clear();
      onRun(typed.command, typed.args);
    }
  }

  // Capture, so this runs before the composer's own Enter-to-send.
  composer.element.addEventListener('keydown', onKeydown, true);
  editor.addEventListener('input', update);
  editor.addEventListener('blur', close);

  return {
    open: () => {
      composer.setHTML('/');
      composer.focus();
      caretToEnd(editor);
      update();
    },
    close,
    isOpen,
    typedCommand,
    // For /help: every command, grouped, whatever is typed.
    all: () => COMMANDS,
    destroy() {
      close();
      composer.element.removeEventListener('keydown', onKeydown, true);
      editor.removeEventListener('input', update);
      editor.removeEventListener('blur', close);
      menu.remove();
    },
  };
}
