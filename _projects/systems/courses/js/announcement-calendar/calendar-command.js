// Slash command for the announcement composer (Slack/Discord style).
// Typing "/" opens a menu of commands (/event, /due, ...); picking one turns
// the area above the composer into fill-in-the-blank slots: title, when,
// type, priority, periods and details. Enter posts, Esc cancels.
// Built from existing OCS elements (ocs__callout, ocs__keypoints, ocs__links,
// ocs__btn, ocs__input, ocs__status-pill) and plain HTML, with no CSS of its
// own. A highlighted command or a chosen period gets the OCS accent fill.

import {
  CLASS_PERIODS, DEFAULT_PRIORITY, EVENT_TYPES, escapeHtml, formatShortDate, matchSlashCommands,
  parseDateWord, parseSlashInput, PRIORITIES,
} from './calendar-model.js';

const WHEN_SUGGESTIONS = ['today', 'tomorrow', 'mon', 'tue', 'wed', 'thu', 'fri', 'next mon', 'next fri'];

// On/off for an OCS button: accent fill while it is on.
function setFilled(button, on) {
  button.classList.toggle('accent', on);
  button.classList.toggle('fill', on);
}

function editorText(composer) {
  return composer.editor.textContent.replace(/​/g, '').trim();
}

// container: element directly above the composer that hosts the menu and slots.
// onSubmit: called when the teacher presses Enter in a slot (same as Send).
export function attachSlashCommand({ composer, container, schoolYear, periods = [], onSubmit }) {
  let enabled = false;
  let active = null;      // { command, panel } while the slots are open
  let menu = null;        // { el, items, index } while the menu is open

  /* ── menu ─────────────────────────────────────────────────────────── */

  function closeMenu() {
    menu?.el.remove();
    menu = null;
  }

  // A row of command buttons, with the highlighted command's hint under it.
  function renderMenu(commands) {
    closeMenu();
    const el = document.createElement('div');
    el.className = 'ocs__callout ocs__keypoints';
    const list = document.createElement('div');
    list.className = 'ocs__links';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Slash commands');
    commands.forEach((command, i) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'ocs__btn small';
      item.setAttribute('role', 'option');
      item.title = command.hint;
      item.textContent = `/${command.name}`;
      item.addEventListener('mousedown', (e) => { e.preventDefault(); open(command, ''); });
      item.addEventListener('mouseenter', () => highlight(i));
      list.appendChild(item);
    });
    const hint = document.createElement('div');
    el.append(list, hint);
    container.prepend(el);
    menu = { el, items: [...list.children], commands, hint, index: 0 };
    highlight(0);
  }

  function highlight(index) {
    if (!menu) return;
    menu.index = (index + menu.items.length) % menu.items.length;
    menu.items.forEach((item, i) => {
      item.setAttribute('aria-selected', String(i === menu.index));
      setFilled(item, i === menu.index);
    });
    menu.hint.textContent = menu.commands[menu.index].hint;
  }

  function onComposerInput() {
    if (!enabled || active) return;
    const commands = matchSlashCommands(editorText(composer));
    if (commands && commands.length) renderMenu(commands); else closeMenu();
  }

  /* ── slots ────────────────────────────────────────────────────────── */

  function open(command, rest) {
    closeMenu();
    reset();
    composer.clear();
    // Each slot is a <label> (name, line break, field) in an ocs__links row,
    // which wraps on narrow screens. Field widths come from the size attribute.
    const panel = document.createElement('div');
    panel.className = 'ocs__callout ocs__keypoints';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', `/${command.name}: calendar event`);
    const listId = `ocs-command-when-${Math.random().toString(36).slice(2, 8)}`;
    panel.innerHTML = `
      <div class="ocs__links">
        <span class="ocs__status-pill ocs__status-pill--good">/${command.name}</span>
        <span>Fill in the blanks. Enter posts it with your message, Esc cancels.</span>
        <button type="button" class="ocs__btn small pill" data-hook="cancel" aria-label="Cancel command">&times;</button>
      </div>
      <div class="ocs__links">
        <label>title<br>
          <input class="ocs__input" name="title" size="28" maxlength="120" placeholder="e.g. Unit 3 Quiz" value="${escapeHtml(rest)}">
        </label>
        <label>when<br>
          <input class="ocs__input" name="when" size="12" list="${listId}" placeholder="fri, tomorrow, 10/9">
          <small data-hook="when-preview">pick a day</small>
          <datalist id="${listId}">${WHEN_SUGGESTIONS.map((w) => `<option value="${w}">`).join('')}</datalist>
        </label>
        <label>type<br>
          <select class="ocs__input" name="type">${EVENT_TYPES.map((t) => `<option value="${t.value}"${t.value === command.type ? ' selected' : ''}>${t.label}</option>`).join('')}</select>
        </label>
        <label>priority<br>
          <select class="ocs__input" name="priority">${PRIORITIES.map((p) => `<option value="${p.value}"${p.value === DEFAULT_PRIORITY ? ' selected' : ''}>${p.label}</option>`).join('')}</select>
        </label>
      </div>
      <div class="ocs__links" role="group" aria-label="Class periods">
        <span>periods</span>
        ${CLASS_PERIODS.map((p) => `<button type="button" class="ocs__btn small${periods.includes(p) ? ' accent fill' : ''}" data-period="${p}" aria-pressed="${periods.includes(p)}">${p}</button>`).join('')}
      </div>
      <label>details<br>
        <input class="ocs__input" name="details" size="48" maxlength="300" placeholder="optional">
      </label>
      <div role="alert" data-hook="error" hidden></div>`;
    container.appendChild(panel);
    active = { command, panel };

    const when = panel.querySelector('[name="when"]');
    const preview = panel.querySelector('[data-hook="when-preview"]');
    when.addEventListener('input', () => {
      const iso = parseDateWord(when.value, { schoolYear });
      preview.textContent = iso ? formatShortDate(iso) : (when.value ? 'try fri, tomorrow or 10/9' : 'pick a day');
    });
    panel.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(on));
      setFilled(button, on);
    }));
    panel.querySelector('[data-hook="cancel"]').addEventListener('click', () => { reset(); composer.focus(); });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); reset(); composer.focus(); }
      if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); onSubmit(); }
    });
    panel.querySelector(rest ? '[name="when"]' : '[name="title"]').focus();
  }

  function showError(text) {
    const error = active?.panel.querySelector('[data-hook="error"]');
    if (!error) return;
    error.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ';
    error.appendChild(document.createElement('strong')).textContent = text;
    error.hidden = false;
  }

  // The filled-in event, { error } if a required slot is missing, or null when no command is open.
  function pending() {
    if (!active) return null;
    const field = (name) => active.panel.querySelector(`[name="${name}"]`).value.trim();
    const title = field('title');
    if (!title) return { error: 'Give the event a title.' };
    const date = parseDateWord(field('when'), { schoolYear });
    if (!date) return { error: 'Say when: fri, tomorrow, next mon or a date like 10/9.' };
    return {
      title,
      date,
      type: field('type'),
      priority: field('priority'),
      periods: [...active.panel.querySelectorAll('[data-period][aria-pressed="true"]')].map((b) => b.dataset.period),
      description: field('details'),
    };
  }

  function reset() {
    active?.panel.remove();
    active = null;
  }

  /* ── keyboard: runs before the composer's own Enter-to-send ───────── */

  composer.element.addEventListener('keydown', (e) => {
    if (!enabled || active) return;
    if (menu && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'ArrowDown') highlight(menu.index + 1);
      else if (e.key === 'ArrowUp') highlight(menu.index - 1);
      else if (e.key === 'Escape') closeMenu();
      else open(menu.commands[menu.index], '');
      return;
    }
    // "/due Unit 3 FRQ" + Enter: open the slots with the title filled in instead of sending.
    const typed = e.key === 'Enter' && !e.shiftKey && parseSlashInput(editorText(composer));
    if (typed) {
      e.preventDefault();
      e.stopPropagation();
      open(typed.command, typed.rest);
    }
  }, true);
  composer.editor.addEventListener('input', onComposerInput);

  return {
    pending,
    showError,
    reset,
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) { closeMenu(); reset(); }
    },
  };
}
