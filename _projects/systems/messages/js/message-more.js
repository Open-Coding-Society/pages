// A message's More menu: a small ocs__menu under its "…" button with Copy text, Add to
// calendar and New GitHub issue. One is open at a time, and it closes on a pick, Escape (focus
// back on the button) or a click anywhere else. onMore(action, message) does Copy and the issue
// (thread.js); onSchedule(message, opener) opens Add to calendar, with the "…" button as the
// opener that gets focus back. Either can be null, which leaves its items out. makeButton(icon,
// label, onClick) is the log's own action button, so it looks like Reply.

export function createMoreMenu({ text, onMore = null, onSchedule = null, makeButton }) {
  let open = null; // { button, menu, row } while a menu is open

  function close() {
    if (!open) return;
    open.menu.remove();
    open.button.setAttribute('aria-expanded', 'false');
    open.row?.classList.remove('is-menu-open');
    document.removeEventListener('click', onOutside, true);
    document.removeEventListener('keydown', onKey);
    open = null;
  }

  function onOutside(event) {
    if (open && !open.menu.contains(event.target) && !open.button.contains(event.target)) close();
  }

  function onKey(event) {
    if (event.key !== 'Escape' || !open) return;
    const { button } = open;
    close();
    button.focus?.();
  }

  function item(icon, label, run) {
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = 'ocs__menu-item';
    choice.setAttribute('role', 'menuitem');
    const glyph = document.createElement('i');
    glyph.className = `fas ${icon} ocs__menu-icon`;
    glyph.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong');
    name.className = 'ocs__menu-name';
    name.textContent = label;
    choice.append(glyph, name);
    choice.addEventListener('click', () => {
      close();
      run();
    });
    return choice;
  }

  // The "…" button for one message; its menu opens inside `actions` (the message's bar).
  function button(actions, messageOf) {
    const control = makeButton('fa-ellipsis', text.moreActions, () => {
      if (open?.button === control) {
        close();
        return;
      }
      close();
      const menu = document.createElement('div');
      menu.className = 'ocs__menu chat-more-menu';
      menu.setAttribute('role', 'menu');
      if (onMore) menu.append(item('fa-copy', text.copyText, () => onMore('copy', messageOf())));
      if (onSchedule) menu.append(item('fa-calendar-plus', text.addToCalendar, () => onSchedule(messageOf(), control)));
      if (onMore) menu.append(item('fa-circle-dot', text.newIssue, () => onMore('issue', messageOf())));
      actions.appendChild(menu);
      control.setAttribute('aria-expanded', 'true');
      // Each message row is its own stacking context (its fade-in animation), so the menu's
      // z-index can't lift it over the messages after it: the row itself is raised meanwhile.
      const row = actions.closest('.chat-msg');
      row?.classList.add('is-menu-open');
      open = { button: control, menu, row };
      document.addEventListener('click', onOutside, true);
      document.addEventListener('keydown', onKey);
      menu.querySelector('button')?.focus?.();
    });
    control.setAttribute('aria-haspopup', 'menu');
    control.setAttribute('aria-expanded', 'false');
    return control;
  }

  return { button, close };
}
