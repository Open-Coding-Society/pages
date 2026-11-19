// A message's More menu: a small ocs__menu under its "…" button with Copy text and New
// GitHub issue. One is open at a time, and it closes on a pick, Escape (focus back on the
// button) or a click anywhere else. onMore(action, message) does the work (thread.js);
// makeButton(icon, label, onClick) is the log's own action button, so it looks like Reply.

export function createMoreMenu({ text, onMore, makeButton }) {
  let open = null; // { button, menu } while a menu is open

  function close() {
    if (!open) return;
    open.menu.remove();
    open.button.setAttribute('aria-expanded', 'false');
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

  function item(action, icon, label, messageOf) {
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
      onMore(action, messageOf());
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
      menu.append(
        item('copy', 'fa-copy', text.copyText, messageOf),
        item('issue', 'fa-circle-dot', text.newIssue, messageOf),
      );
      actions.appendChild(menu);
      control.setAttribute('aria-expanded', 'true');
      open = { button: control, menu };
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
