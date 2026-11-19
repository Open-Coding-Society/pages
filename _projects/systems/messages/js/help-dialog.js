// /help: the keyboard shortcuts and every slash command, in an ocs__modal. Drawn from the same
// lists the page runs on (shortcuts.js and slash-commands.js), so it can't fall out of date.
import { createDialog } from './dialogs.js';
import { Shortcuts } from './shortcuts.js';
import { SlashCommands } from './slash-commands.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function table(headings, rows) {
  const wrap = el('div', 'ocs__table-wrap');
  const grid = el('table', 'ocs__table');
  const head = el('thead');
  const headRow = el('tr');
  headings.forEach(heading => headRow.appendChild(el('th', '', heading)));
  head.appendChild(headRow);
  const body = el('tbody');
  rows.forEach(cells => {
    const row = el('tr');
    cells.forEach(cell => {
      const td = el('td');
      td.append(...(Array.isArray(cell) ? cell : [cell]));
      row.appendChild(td);
    });
    body.appendChild(row);
  });
  grid.append(head, body);
  wrap.appendChild(grid);
  return wrap;
}

/**
 * The /help dialog.
 */
export class HelpDialog {
  /** Its wording; the page can pass its own over these. */
  static TEXTS = Object.freeze({
    keys: 'Keys',
    commands: 'Slash commands',
    key: 'Keys',
    does: 'What it does',
    command: 'Command',
    groupOnly: 'group chats',
    dmOnly: 'direct messages',
    only: 'only in {where}',
  });

  #elements;
  #isMac;
  #text;
  #dialog;

  /**
   * @param {object} options
   * @param {{dialog: HTMLElement, body: HTMLElement}} options.elements the ocs__modal and
   *   where its tables go
   * @param {boolean} options.isMac shows ⌘ and ⌥ instead of Ctrl and Alt
   * @param {object} options.texts wording over TEXTS
   */
  constructor({ elements, isMac = false, texts = {} }) {
    this.#elements = elements;
    this.#isMac = isMac;
    this.#text = { ...HelpDialog.TEXTS, ...texts };
    this.#dialog = createDialog(elements.dialog);
  }

  /**
   * Draws the tables and opens the dialog.
   * @param {HTMLElement} opener gets focus back when it closes
   */
  open(opener) {
    this.#render();
    this.#dialog.open(opener);
  }

  /** @returns {boolean} whether the dialog is open */
  isOpen() {
    return this.#dialog.isOpen();
  }

  #render() {
    const text = this.#text;
    const keys = Shortcuts.ALL.map(shortcut => [
      (this.#isMac ? shortcut.mac : shortcut.keys).flatMap((key, at) => (at ? [' + ', el('kbd', '', key)] : [el('kbd', '', key)])),
      shortcut.does,
    ]);
    const sections = [el('h4', 'ocs__section-title', text.keys), table([text.key, text.does], keys)];
    SlashCommands.GROUPS.forEach(group => {
      const rows = SlashCommands.ALL.filter(command => command.group === group.id).map(command => {
        const name = el('b', '', `/${command.name}${command.args ? ` ${command.args}` : ''}`);
        const where = command.scope ? ` (${text.only.replace('{where}', command.scope === 'group' ? text.groupOnly : text.dmOnly)})` : '';
        return [name, `${command.hint}${where}`];
      });
      sections.push(el('h4', 'ocs__section-title', `${text.commands}: ${group.label}`), table([text.command, text.does], rows));
    });
    this.#elements.body.replaceChildren(...sections);
  }
}
