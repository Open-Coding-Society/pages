// /help: the keyboard shortcuts and every slash command, in an ocs__modal. Drawn from the same
// lists the page runs on (shortcuts.js and slash-commands.js), so it can't fall out of date.
import { createDialog } from './dialogs.js';
import { COMMAND_GROUPS, COMMANDS } from './slash-commands.js';
import { SHORTCUTS } from './shortcuts.js';

export const HELP_TEXTS = Object.freeze({
  keys: 'Keys',
  commands: 'Slash commands',
  key: 'Keys',
  does: 'What it does',
  command: 'Command',
  groupOnly: 'group chats',
  dmOnly: 'direct messages',
  only: 'only in {where}',
});

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

// elements: dialog, body. isMac picks ⌘ and ⌥ over Ctrl and Alt.
export function initHelp({ elements, isMac = false, texts = {} }) {
  const text = { ...HELP_TEXTS, ...texts };
  const dialog = createDialog(elements.dialog);

  function render() {
    const keys = SHORTCUTS.map(shortcut => [
      (isMac ? shortcut.mac : shortcut.keys).flatMap((key, at) => (at ? [' + ', el('kbd', '', key)] : [el('kbd', '', key)])),
      shortcut.does,
    ]);
    const sections = [el('h4', 'ocs__section-title', text.keys), table([text.key, text.does], keys)];
    COMMAND_GROUPS.forEach(group => {
      const rows = COMMANDS.filter(command => command.group === group.id).map(command => {
        const name = el('b', '', `/${command.name}${command.args ? ` ${command.args}` : ''}`);
        const where = command.scope ? ` (${text.only.replace('{where}', command.scope === 'group' ? text.groupOnly : text.dmOnly)})` : '';
        return [name, `${command.hint}${where}`];
      });
      sections.push(el('h4', 'ocs__section-title', `${text.commands}: ${group.label}`), table([text.command, text.does], rows));
    });
    elements.body.replaceChildren(...sections);
  }

  return {
    open(opener) {
      render();
      dialog.open(opener);
    },
    isOpen: () => dialog.isOpen(),
  };
}
