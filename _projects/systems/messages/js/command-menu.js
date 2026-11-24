// The slash-command menu. Typing "/" at the start of the composer opens a grouped menu of the
// commands this conversation has (ocs__menu), narrowed as you type. ↑ ↓ move, Enter or Tab
// picks, Escape closes, and a click picks too. A command that needs words after it (/issue
// owner/repo#12) is put in the composer for you to finish; Enter then runs it instead of
// sending. One whose words are optional (/code [language]) runs when picked.
import { SlashCommands } from './slash-commands.js';

const plain = composer => composer.editor.textContent.replace(/[​﻿]/g, '').replace(/ /g, ' ');

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

/**
 * The composer's slash-command menu.
 */
export class CommandMenu {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    label: 'Commands',
    foot: '↑ ↓ to move · Enter or Tab to pick · Esc to close',
    empty: 'No command starts with that. Try /help.',
  });

  static #count = 0;

  #composer;
  #editor;
  #kindOf;
  #onRun;
  #text;
  #id;
  #menu;
  #items = []; // [{ command, element }]
  #index = 0;

  /**
   * Builds the menu, closed, and listens to the composer.
   * @param {object} options
   * @param {object} options.composer the rich composer (element, editor, setHTML, focus, clear)
   * @param {HTMLElement} options.host where the menu goes
   * @param {Function} options.kindOf gives the open conversation's kind ('group' or 'dm'),
   *   or null while commands can't run
   * @param {Function} options.onRun onRun(command, args) does the work (thread.js)
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ composer, host, kindOf, onRun, texts = {} }) {
    this.#composer = composer;
    this.#kindOf = kindOf;
    this.#onRun = onRun;
    this.#text = { ...CommandMenu.TEXTS, ...texts };
    CommandMenu.#count += 1;
    this.#id = `messagesCommands${CommandMenu.#count}`;
    const menu = document.createElement('div');
    menu.className = 'ocs__menu dm__commands';
    menu.id = this.#id;
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', this.#text.label);
    menu.hidden = true;
    host.appendChild(menu);
    this.#menu = menu;
    const editor = composer.editor;
    this.#editor = editor;
    editor.setAttribute('aria-autocomplete', 'list');
    editor.setAttribute('aria-controls', this.#id);
    editor.setAttribute('aria-expanded', 'false');

    // Capture, so this runs before the composer's own Enter-to-send.
    composer.element.addEventListener('keydown', this.#onKeydown, true);
    editor.addEventListener('input', this.#update);
    editor.addEventListener('blur', this.#onBlur);
  }

  /**
   * Puts "/" in an empty composer and opens the menu on every command. A draft is never
   * replaced: with words in the box, or no conversation open, nothing changes.
   * @returns {boolean} whether the menu opened
   */
  open() {
    if (!this.#kindOf()) return false; // no conversation open: no commands to show
    const draft = plain(this.#composer).trim();
    if (draft && draft !== '/') return false;
    this.#composer.setHTML('/');
    this.#composer.focus();
    caretToEnd(this.#editor);
    this.#update();
    return true;
  }

  /** Closes the menu. */
  close() {
    if (!this.isOpen()) return;
    this.#menu.hidden = true;
    this.#menu.replaceChildren();
    this.#items = [];
    this.#editor.setAttribute('aria-expanded', 'false');
    this.#editor.removeAttribute('aria-activedescendant');
  }

  /** @returns {boolean} whether the menu is open */
  isOpen() {
    return !this.#menu.hidden;
  }

  /**
   * A finished command in the composer, if there is one: what Enter or Send runs.
   * @returns {{command: object, args: string}|null}
   */
  typedCommand() {
    const kind = this.#kindOf();
    return kind ? SlashCommands.parse(plain(this.#composer).trim(), { kind }) : null;
  }

  /**
   * Every command, whatever is typed: what /help lists.
   * @returns {ReadonlyArray}
   */
  all() {
    return SlashCommands.ALL;
  }

  /** Closes the menu, stops listening and takes it off the page. */
  destroy() {
    this.close();
    this.#composer.element.removeEventListener('keydown', this.#onKeydown, true);
    this.#editor.removeEventListener('input', this.#update);
    this.#editor.removeEventListener('blur', this.#onBlur);
    this.#menu.remove();
  }

  #highlight(next) {
    if (!this.#items.length) return;
    this.#index = (next + this.#items.length) % this.#items.length;
    this.#items.forEach((item, at) => item.element.setAttribute('aria-selected', String(at === this.#index)));
    const current = this.#items[this.#index].element;
    this.#editor.setAttribute('aria-activedescendant', current.id);
    current.scrollIntoView?.({ block: 'nearest' });
  }

  #option(command) {
    const element = document.createElement('div');
    element.className = 'ocs__menu-item';
    element.id = `${this.#id}-${command.name}`;
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
      this.#pick(command);
    });
    element.addEventListener('mousemove', () => {
      const at = this.#items.findIndex(item => item.command === command);
      if (at !== this.#index) this.#highlight(at);
    });
    return element;
  }

  #render(groups) {
    this.#items = [];
    const nodes = groups.map(group => {
      const section = document.createElement('div');
      section.className = 'ocs__menu-group';
      section.setAttribute('role', 'group');
      const heading = document.createElement('b');
      heading.className = 'ocs__menu-heading';
      heading.id = `${this.#id}-${group.id}`;
      heading.textContent = group.label;
      section.setAttribute('aria-labelledby', heading.id);
      section.appendChild(heading);
      group.commands.forEach(command => {
        const element = this.#option(command);
        this.#items.push({ command, element });
        section.appendChild(element);
      });
      return section;
    });
    const foot = document.createElement('em');
    foot.className = 'ocs__menu-foot';
    foot.textContent = this.#items.length ? this.#text.foot : this.#text.empty;
    this.#menu.replaceChildren(...nodes, foot);
    this.#menu.hidden = false;
    this.#editor.setAttribute('aria-expanded', 'true');
    this.#highlight(0);
  }

  #update = () => {
    const kind = this.#kindOf();
    const groups = kind ? SlashCommands.match(plain(this.#composer), { kind }) : null;
    if (!groups) {
      this.close();
      return;
    }
    this.#render(groups);
  };

  #onBlur = () => this.close();

  #pick(command) {
    this.close();
    // Words a command needs ("owner/repo#number") are typed after its name; one whose words
    // are optional ("[language]") runs straight away.
    if (command.args && !command.args.startsWith('[')) {
      // Fill in the name and let the words after it be typed; Enter then runs it.
      this.#composer.setHTML(`/${command.name}&nbsp;`);
      this.#composer.focus();
      caretToEnd(this.#editor);
      return;
    }
    this.#composer.clear();
    this.#onRun(command, '');
  }

  #onKeydown = event => {
    if (event.isComposing) return;
    if (this.isOpen() && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(event.key)) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.close();
        return;
      }
      if (!this.#items.length) {
        if (event.key === 'Enter' || event.key === 'Tab') this.close();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'ArrowDown') this.#highlight(this.#index + 1);
      else if (event.key === 'ArrowUp') this.#highlight(this.#index - 1);
      else this.#pick(this.#items[this.#index].command);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const typed = this.typedCommand();
      if (!typed) return;
      event.preventDefault();
      event.stopPropagation();
      this.#composer.clear();
      this.#onRun(typed.command, typed.args);
    }
  };
}
