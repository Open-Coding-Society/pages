// Editor dialogs (DESIGN §10), all ocs__modal: publish (page address and slug check), the
// conflict choice, delete behind a type-the-title confirm, revisions with restore, text to copy
// or download (page file, JSON, HTML, code) and a date for "public until". Each returns a
// Promise of the choice. Focus moves into the dialog, stays there (Tab wraps) and returns to
// whatever opened it; Escape and the backdrop dismiss all but the conflict choice.
import { el, icon } from './editor-fields.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

// "2:41 PM" today, "Oct 28, 2:41 PM" this year, with the year before that.
export function formatWhen(ms, { now = Date.now(), locale } = {}) {
  if (!Number.isFinite(ms) || ms <= 0) return '';
  const date = new Date(ms);
  const today = new Date(now);
  const time = { hour: 'numeric', minute: '2-digit' };
  if (date.toDateString() === today.toDateString()) return date.toLocaleTimeString(locale, time);
  const day = date.getFullYear() === today.getFullYear() ? { month: 'short', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleString(locale, { ...day, ...time });
}

// A page shows a run of spaces as one, so a title typed as it looks still matches.
export function confirmsTitle(typed, title) {
  const squash = (text) => String(text || '').trim().replace(/\s+/g, ' ');
  return squash(title) !== '' && squash(typed) === squash(title);
}

// "2026-11-14" → the end of that local day in ms, if it is after now; null for empty; NaN when bad.
export function untilOf(value, now = Date.now()) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return Number.NaN;
  const end = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59, 999).getTime();
  return end > now ? end : Number.NaN;
}

export function downloadText(doc, filename, text, mime = 'text/plain') {
  const view = doc.defaultView;
  const url = view.URL.createObjectURL(new view.Blob([text], { type: `${mime};charset=utf-8` }));
  const link = el(doc, 'a', { href: url, download: filename, hidden: true });
  doc.body.appendChild(link);
  link.click();
  link.remove();
  view.setTimeout(() => view.URL.revokeObjectURL(url), 0);
}

export async function copyText(doc, text, fallbackField = null) {
  const nav = doc.defaultView.navigator;
  try {
    if (nav.clipboard && typeof nav.clipboard.writeText === 'function') {
      await nav.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    // permission refused or not a secure context: try the selection below
  }
  if (!fallbackField) return false;
  fallbackField.focus();
  fallbackField.select();
  try {
    return doc.execCommand('copy');
  } catch (_) {
    return false;
  }
}

// errorText(error) words a store error from the registry (a dialog never shows an error's own message).
export function createDialogs({ root, doc = globalThis.document, say, text, shell = null, errorText = () => text('store.unknown') }) {
  const stack = [];
  let counter = 0;

  function onKey(event) {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (event.key === 'Escape' && top.dismissible) {
      event.preventDefault();
      event.stopPropagation();
      top.finish(null);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = [...top.card.querySelectorAll(FOCUSABLE)].filter((item) => !item.closest('[hidden]'));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', onKey, true);

  // The core: a titled card, a body, a row of buttons. finish(value) closes it and resolves.
  // describedBy: ids of the body paragraphs read out with the title when the dialog opens, so a
  // choice is never made without them (focus starts on a button or a field, past the words).
  function open({ title, body = [], buttons = [], dismissible = true, alert = false, focus = null, describedBy = '' }) {
    counter += 1;
    const titleId = `ui-dialog-${counter}-title`;
    const opener = doc.activeElement;
    let resolve;
    const result = new Promise((done) => { resolve = done; });
    const close = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', 'aria-label': say('close'), title: say('close'), hidden: !dismissible }, icon(doc, 'fa-xmark'));
    const actions = el(doc, 'div', { class: 'ocs__modal-actions' });
    const card = el(doc, 'div', { class: 'ocs__modal-card ocs__stack', role: alert ? 'alertdialog' : 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, 'aria-describedby': describedBy || null },
      el(doc, 'div', { class: 'ocs__modal-header' }, el(doc, 'h2', { class: 'ocs__modal-title', id: titleId }, title), close),
      body, actions);
    const backdrop = el(doc, 'div', { class: 'ocs__modal' }, card);
    const host = el(doc, 'div', { class: 'ui-builder-dialog' }, backdrop);
    const entry = {
      card, dismissible,
      finish(value) {
        const at = stack.indexOf(entry);
        if (at === -1) return;
        stack.splice(at, 1);
        host.remove();
        if (!stack.length && shell) shell.inert = false;
        if (opener && typeof opener.focus === 'function' && doc.contains(opener)) opener.focus();
        resolve(value);
      },
    };
    const controls = buttons.map((button) => el(doc, 'button', {
      type: 'button', class: button.primary ? 'ocs__btn accent fill' : 'ocs__btn', disabled: button.disabled,
      onclick: () => (typeof button.onClick === 'function' ? button.onClick(entry.finish) : entry.finish(button.value)),
    }, button.label));
    actions.append(...controls);
    actions.hidden = !controls.length;
    close.addEventListener('click', () => entry.finish(null));
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop && dismissible) entry.finish(null); });
    stack.push(entry);
    root.appendChild(host);
    if (shell) shell.inert = true;
    const target = (focus && focus()) || card.querySelector('input, textarea, select') || controls.find((control) => !control.disabled) || close;
    if (target) target.focus();
    return { result, finish: entry.finish, card, buttons: controls };
  }

  const para = (message, id = null) => el(doc, 'p', { class: 'ocs__text', id }, message);
  // An id for a paragraph of the dialog open() makes next.
  const bodyId = (name) => `ui-dialog-${counter + 1}-${name}`;

  function confirm({ title, body, confirmLabel, cancelLabel = say('cancel') }) {
    const id = bodyId('body');
    return open({ title, body: [para(body, id)], describedBy: id, buttons: [{ label: cancelLabel, value: false }, { label: confirmLabel, value: true, primary: true }] })
      .result.then((value) => value === true);
  }

  function textExport({ title, help = '', content, filename, mime = 'text/plain' }) {
    const id = `ui-dialog-text-${counter + 1}`;
    const area = el(doc, 'textarea', { class: 'ocs__input ui-builder-mono', id, rows: 14, readonly: true, spellcheck: 'false' });
    area.value = content;
    const status = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
    const buttons = [
      { label: say('copy'), onClick: async () => { status.textContent = (await copyText(doc, content, area)) ? say('copied') : say('copy_failed'); } },
      filename ? { label: say('download'), primary: true, onClick: () => downloadText(doc, filename, content, mime) } : null,
      { label: say('close'), value: null },
    ].filter(Boolean);
    const body = [help ? para(help) : null, el(doc, 'label', { class: 'ocs__label', for: id }, title), area, status];
    return open({ title, body, buttons, focus: () => area }).result;
  }

  // First publish: pick the address (checked as you type). Later publishes only confirm it.
  function publish({ address, slug = '', slugLocked = false, checkSlug = null, issueOf = () => null, error = '' }) {
    if (slugLocked) {
      const what = bodyId('body');
      return open({ title: say('publish_title'), body: [para(say('publish_changes_body', { address: address(slug) }), what)], describedBy: what, buttons: [{ label: say('cancel'), value: null }, { label: say('publish_confirm'), value: slug, primary: true }] }).result;
    }
    const id = `ui-dialog-slug-${counter + 1}`;
    const input = el(doc, 'input', { class: 'ocs__input', id, type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-describedby': `${id}-help ${id}-status` });
    input.value = slug;
    const where = para('', bodyId('body'));
    const status = el(doc, 'output', { class: 'ui-builder-note', id: `${id}-status`, 'aria-live': 'polite' });
    let check = 0;
    let timer = null;
    let dialog = null;
    function refresh() {
      const value = input.value.trim();
      where.textContent = say('publish_body', { address: address(value || '…') });
      const problem = issueOf(value);
      const confirm = dialog && dialog.buttons[1];
      clearTimeout(timer);
      check += 1;
      if (problem) {
        status.textContent = text(`errors.${problem}`);
        if (confirm) confirm.disabled = true;
        return;
      }
      if (confirm) confirm.disabled = false;
      if (typeof checkSlug !== 'function') { status.textContent = ''; return; }
      const mine = check;
      status.textContent = say('slug_checking');
      timer = setTimeout(() => {
        Promise.resolve(checkSlug(value)).then((answer) => {
          if (mine !== check) return;
          const free = !answer || answer.available !== false;
          status.textContent = say(free ? 'slug_free' : 'slug_taken');
          if (confirm) confirm.disabled = !free;
        }, () => { if (mine === check) status.textContent = say('slug_unknown'); });
      }, 400);
    }
    input.addEventListener('input', refresh);
    const body = [where, el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: id }, say('publish_slug')), input,
      el(doc, 'small', { id: `${id}-help` }, say('publish_slug_help')), status)];
    dialog = open({
      title: say('publish_title'), body, focus: () => input, describedBy: where.id,
      buttons: [{ label: say('cancel'), value: null }, { label: say('publish_confirm'), primary: true, onClick: (finish) => { if (!issueOf(input.value.trim())) finish(input.value.trim()); } }],
    });
    refresh();
    if (error) status.textContent = error;
    return dialog.result;
  }

  // Focus starts on Reload theirs: who saved and what Keep mine does are read before either.
  function conflict({ name = '', time = '', local = false }) {
    const what = bodyId('body');
    const keep = bodyId('note');
    const body = [
      para(name ? say('conflict_body', { name, time }) : say('conflict_body_unknown'), what),
      para(say(local ? 'conflict_keep_note_local' : 'conflict_keep_note'), keep),
    ];
    return open({ title: say('conflict_title'), body, dismissible: false, alert: true, describedBy: `${what} ${keep}`,
      buttons: [{ label: say('conflict_reload'), value: 'reload' }, { label: say('conflict_keep'), value: 'keep', primary: true }] }).result;
  }

  // The field is described by the sentence with the title to type, since focus starts there.
  function deletePage({ title }) {
    const id = `ui-dialog-delete-${counter + 1}`;
    const what = bodyId('body');
    const input = el(doc, 'input', { class: 'ocs__input', id, type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-describedby': what });
    const dialog = open({
      title: say('delete_title'), focus: () => input, describedBy: what,
      body: [para(say('delete_body', { title }), what), el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: id }, say('delete_label')), input)],
      buttons: [{ label: say('cancel'), value: false }, { label: say('delete_confirm'), disabled: true, onClick: (finish) => { if (confirmsTitle(input.value, title)) finish(true); } }],
    });
    input.addEventListener('input', () => { dialog.buttons[1].disabled = !confirmsTitle(input.value, title); });
    return dialog.result.then((value) => value === true);
  }

  // load() → [{revisionId, kind, savedByName, savedAt}]; restore(revision) → Promise. unsaved: the
  // newest changes couldn't be saved, so they are in no revision and a restore loses them.
  function revisions({ load, restore, readOnly = false, unsaved = false }) {
    const list = el(doc, 'ul', { class: 'ui-builder-revisions' });
    const status = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' }, say('revisions_loading'));
    const dialog = open({ title: say('revisions_title'), body: [status, list], buttons: [{ label: say('close'), value: null }] });
    Promise.resolve().then(load).then((rows) => {
      const items = Array.isArray(rows) ? rows : [];
      status.textContent = items.length ? '' : say('revisions_empty');
      list.replaceChildren(...items.map((revision) => {
        const time = formatWhen(revision.savedAt);
        const kind = say(`rev_${['SAVE', 'PUBLISH', 'RESTORE'].includes(revision.kind) ? revision.kind : 'SAVE'}`);
        const restoreButton = el(doc, 'button', { type: 'button', class: 'ocs__btn small', disabled: readOnly, onclick: async () => {
          const body = unsaved ? say('revision_restore_body_unsaved', { time }) : say('revision_restore_body', { time });
          const sure = await confirm({ title: say('revision_restore_title'), body, confirmLabel: say('revision_restore') });
          if (!sure) return;
          restoreButton.disabled = true;
          try {
            await restore(revision);
            dialog.finish(revision);
          } catch (error) {
            restoreButton.disabled = false;
            status.textContent = errorText(error);
          }
        } }, say('revision_restore'));
        return el(doc, 'li', null, el(doc, 'strong', null, say('revision_row', { kind, name: revision.savedByName || '?', time })), ' ', restoreButton);
      }));
    }, (error) => { status.textContent = say('revisions_failed', { message: errorText(error) }); });
    return dialog.result;
  }

  function askUntil({ title = say('date_title') } = {}) {
    const id = `ui-dialog-date-${counter + 1}`;
    const input = el(doc, 'input', { class: 'ocs__input', id, type: 'date', 'aria-describedby': `${id}-help` });
    const status = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
    return open({
      title, focus: () => input,
      body: [el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: id }, say('date_label')), input, el(doc, 'small', { id: `${id}-help` }, say('date_help')), status)],
      buttons: [{ label: say('cancel'), value: null }, { label: say('date_confirm'), primary: true, onClick: (finish) => {
        const until = untilOf(input.value);
        if (Number.isNaN(until)) status.textContent = say('bad_date');
        else finish({ until });
      } }],
    }).result;
  }

  return {
    open, confirm, textExport, publish, conflict, deletePage, revisions, askUntil,
    isOpen: () => stack.length > 0,
    destroy() {
      doc.removeEventListener('keydown', onKey, true);
      while (stack.length) stack[stack.length - 1].finish(null);
    },
  };
}

// "{name} is editing · Take over": shown while another editor holds the lease.
export function createLeaseBanner(container, { doc = globalThis.document, say, onTakeOver }) {
  const message = el(doc, 'strong', null, '');
  const take = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent', onclick: () => onTakeOver() }, say('lease_take'));
  const box = el(doc, 'div', { class: 'ui-builder-banner', hidden: true }, el(doc, 'div', { class: 'ocs__callout' }, icon(doc, 'fa-user-lock'), ' ', message, ' ', take));
  container.appendChild(box);
  return {
    show(name) {
      message.textContent = say('lease_banner', { name: name || say('someone') });
      box.hidden = false;
    },
    hide() { box.hidden = true; },
    get shown() { return !box.hidden; },
  };
}
