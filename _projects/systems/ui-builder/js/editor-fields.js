// Inspector widgets, one per registry field type (DESIGN §6, §10). A widget is
// {element, setValue(value), setIssues(issues), focus(), destroy()}. It reports edits through
// ctx.onChange(value, {coalesce, path}): coalesce marks typing (the history merges it per field),
// path is the part of the value that changed ("links.0.url"). setValue never fires onChange and
// leaves a field alone while it already shows that value, so typing keeps its caret.
// Issues carry paths relative to the widget's own field ('' for itself, '0.url' inside a list).
import { hostOf, safeImage } from './url-rules.js';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const listOf = (value) => (Array.isArray(value) ? value : []);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// el(doc, 'button', {class, type, onclick, text}, ...children): internal markup only, never
// author data as attribute names.
export function el(doc, tag, attrs = {}, ...children) {
  const node = doc.createElement(tag);
  for (const [name, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (name === 'class') node.className = value;
    else if (name === 'text') node.textContent = value;
    else if (name.startsWith('on') && typeof value === 'function') node.addEventListener(name.slice(2), value);
    else node.setAttribute(name, value === true ? '' : String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child !== null && child !== undefined && child !== false) node.append(typeof child === 'string' ? doc.createTextNode(child) : child);
  }
  return node;
}

export function icon(doc, name) {
  return el(doc, 'i', { class: `fa-solid ${/^fa-[a-z0-9-]+$/.test(name) ? name : 'fa-square'}`, 'aria-hidden': 'true' });
}

// An icon button: the label is its accessible name and tooltip; no text in a <span>.
export function iconButton(doc, { name, label, onclick, disabled = false, extra = '' }) {
  return el(doc, 'button', { type: 'button', class: `ocs__btn ocs__btn--icon small ${extra}`.trim(), 'aria-label': label, title: label, onclick, disabled }, icon(doc, name));
}

// Issues for the field `id`, with paths made relative to it.
export function relativeIssues(issues, id) {
  const out = [];
  for (const issue of listOf(issues)) {
    const path = typeof issue.field === 'string' ? issue.field : '';
    if (path === id) out.push({ ...issue, field: '' });
    else if (path.startsWith(`${id}.`)) out.push({ ...issue, field: path.slice(id.length + 1) });
  }
  return out;
}

export function parseWholeNumber(text) {
  const raw = String(text).trim();
  return /^-?\d{1,15}$/.test(raw) ? Number(raw) : null;
}

// github.com/<owner>/<repo>/blob/<branch>/<file> is GitHub's page for a file; the picture itself is
// on raw.githubusercontent.com.
export function githubRawUrl(value) {
  let url;
  try {
    url = new URL(String(value).trim());
  } catch (_) {
    return null;
  }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') return null;
  const match = url.pathname.match(/^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/blob\/(.+)$/);
  return match ? `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}` : null;
}

export function isDriveShareLink(value) {
  const host = hostOf(value);
  return host === 'drive.google.com' || host === 'docs.google.com';
}

// Label, control, help and the issue line, wired with ids for screen readers.
function shell(ctx, field, control, { labelFor = true, labelText = field.label } = {}) {
  const { doc } = ctx;
  const id = control.id || ctx.nextId();
  control.id = id;
  const helpId = `${id}-help`;
  const issueId = `${id}-issue`;
  const label = labelText ? el(doc, 'label', { class: 'ocs__label', for: labelFor ? id : null, id: `${id}-label` }, labelText,
    // The mark is for sight; the control says aria-required itself.
    field.required ? [' ', el(doc, 'abbr', { class: 'ui-builder-required', title: ctx.say('required'), 'aria-hidden': 'true' }, '*')] : null) : null;
  const help = field.help ? el(doc, 'small', { id: helpId }, field.help) : null;
  const issue = el(doc, 'strong', { class: 'ui-builder-issue', id: issueId, hidden: true });
  const element = el(doc, 'div', { class: 'ocs__field', 'data-ui-field': field.id }, label, control, help, issue);
  const described = [help ? helpId : null, issueId].filter(Boolean).join(' ');
  return {
    element,
    labelId: `${id}-label`,
    describe(target = control) {
      target.setAttribute('aria-describedby', described);
      if (field.required) target.setAttribute('aria-required', 'true');
    },
    showIssues(issues, target = control) {
      const own = listOf(issues).filter((item) => !item.field);
      issue.textContent = own.map((item) => item.message).join(' ');
      issue.hidden = !own.length;
      if (own.length) target.setAttribute('aria-invalid', 'true');
      else target.removeAttribute('aria-invalid');
    },
  };
}

function inputWidget(field, ctx, { tag = 'input', type = 'text', extra = {} } = {}) {
  const { doc } = ctx;
  const control = el(doc, tag, { class: 'ocs__input', type: tag === 'input' ? type : null, placeholder: field.placeholder || null, disabled: ctx.readOnly, ...extra });
  const box = shell(ctx, field, control);
  box.describe();
  const write = (value) => {
    const text = value === null || value === undefined ? '' : String(value);
    if (control.value !== text) control.value = text;
  };
  write(ctx.value);
  control.addEventListener('input', () => {
    if (type === 'number') {
      const number = parseWholeNumber(control.value);
      if (number !== null) ctx.onChange(number, { coalesce: true, path: '' });
      return;
    }
    ctx.onChange(control.value, { coalesce: true, path: '' });
  });
  return { element: box.element, setValue: write, setIssues: (issues) => box.showIssues(issues), focus: () => control.focus(), destroy() {} };
}

function selectWidget(field, ctx, options) {
  const { doc } = ctx;
  const control = el(doc, 'select', { class: 'ocs__input', disabled: ctx.readOnly },
    options.map((option) => el(doc, 'option', { value: option.value }, option.label)));
  const box = shell(ctx, field, control);
  box.describe();
  const write = (value) => { control.value = value === null || value === undefined ? '' : String(value); };
  write(ctx.value);
  control.addEventListener('change', () => ctx.onChange(control.value, { coalesce: false, path: '' }));
  return { element: box.element, setValue: write, setIssues: (issues) => box.showIssues(issues), focus: () => control.focus(), destroy() {} };
}

function toggleWidget(field, ctx) {
  const { doc } = ctx;
  const input = el(doc, 'input', { class: 'ocs__toggle-input', type: 'checkbox', id: ctx.nextId(), disabled: ctx.readOnly });
  const toggle = el(doc, 'label', { class: 'ocs__toggle' }, input, el(doc, 'span', { class: 'ocs__toggle-track', 'aria-hidden': 'true' }), el(doc, 'span', { class: 'ocs__toggle-label' }, field.label));
  const box = shell(ctx, field, toggle, { labelText: '' });
  box.describe(input);
  const write = (value) => { input.checked = value === true; };
  write(ctx.value);
  input.addEventListener('change', () => ctx.onChange(input.checked, { coalesce: false, path: '' }));
  return { element: box.element, setValue: write, setIssues: (issues) => box.showIssues(issues, input), focus: () => input.focus(), destroy() {} };
}

// A pool of rich-text composers keyed by field: the inspector reuses one across selections
// (setHTML) and destroys those no shown field took. A composer's onInput goes to whichever
// widget holds it now.
export function createRichPool(richText) {
  const entries = new Map();
  return {
    take(key, options) {
      let entry = entries.get(key);
      if (!entry) {
        entry = { listener: null, used: false };
        entry.composer = richText.createRichComposer({ ...options, enterKey: 'newline', onInput: () => { if (entry.listener) entry.listener(); } });
        entries.set(key, entry);
      }
      entry.used = true;
      return entry;
    },
    begin() { for (const entry of entries.values()) entry.used = false; },
    end() {
      for (const [key, entry] of entries) {
        if (entry.used) continue;
        entry.composer.destroy();
        entry.composer.element.remove();
        entries.delete(key);
      }
    },
    clear() {
      this.begin();
      this.end();
    },
  };
}

function richWidget(field, ctx) {
  const { doc } = ctx;
  const options = { placeholder: field.placeholder || field.label, maxLength: field.max || 4000 };
  const pool = ctx.richPool || createRichPool(ctx.richText);
  const entry = pool.take(`${field.id}:${options.maxLength}`, options);
  const { composer } = entry;
  let applying = false;
  let emit = () => {};
  entry.listener = () => { if (!applying) emit(); };
  const holder = el(doc, 'div', { class: 'ui-builder-rich', id: ctx.nextId() }, composer.element);
  const box = shell(ctx, field, holder, { labelFor: false });
  composer.editor.setAttribute('aria-labelledby', box.labelId);
  box.describe(composer.editor);
  box.element.querySelector('label').addEventListener('click', () => composer.focus());
  let current = typeof ctx.value === 'string' ? ctx.value : '';
  const write = (value) => {
    const html = typeof value === 'string' ? value : '';
    if (html === current) return; // our own edit coming back: keep the caret where it is
    current = html;
    applying = true;
    try {
      composer.setHTML(html);
    } finally {
      applying = false;
    }
  };
  applying = true;
  composer.setHTML(current);
  applying = false;
  emit = () => {
    const html = composer.getHTML();
    if (html === current) return;
    current = html;
    ctx.onChange(html, { coalesce: true, path: '' });
  };
  composer.setEnabled(!ctx.readOnly);
  return {
    element: box.element, composer, setValue: write, setIssues: (issues) => box.showIssues(issues, composer.editor),
    focus: () => composer.focus(), destroy() { emit = () => {}; },
  };
}

// Loads the image the way the page will (no referrer; cookie-free on OCS hosts) and explains the
// two links students paste most: GitHub's file page and Google Drive share links.
export function testImage(src, { doc, ocsHost = false, timeoutMs = 10000 }) {
  return new Promise((resolve) => {
    const image = new doc.defaultView.Image();
    const timer = setTimeout(() => resolve({ ok: false }), timeoutMs);
    image.referrerPolicy = 'no-referrer';
    if (ocsHost) image.crossOrigin = 'anonymous';
    image.onload = () => { clearTimeout(timer); resolve({ ok: true, width: image.naturalWidth, height: image.naturalHeight }); };
    image.onerror = () => { clearTimeout(timer); resolve({ ok: false }); };
    image.src = src;
  });
}

function imageWidget(field, ctx) {
  const { doc, say } = ctx;
  const base = inputWidget(field, ctx, { type: 'url', extra: { inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: field.placeholder || 'https://' } });
  const control = base.element.querySelector('input');
  const result = el(doc, 'output', { class: 'ui-builder-note', 'aria-live': 'polite' });
  const tip = el(doc, 'div', { class: 'ui-builder-tip', hidden: true });
  let run = 0;
  async function check() {
    const mine = ++run;
    tip.replaceChildren();
    tip.hidden = true;
    const value = control.value.trim();
    if (!value) { result.textContent = ''; return; }
    const raw = githubRawUrl(value);
    const tips = [];
    if (raw) {
      tips.push(el(doc, 'p', null, say('image_github')),
        el(doc, 'button', { type: 'button', class: 'ocs__btn small', disabled: ctx.readOnly, onclick: () => { control.value = raw; ctx.onChange(raw, { coalesce: false, path: '' }); check(); } }, say('image_use_raw')));
    } else if (isDriveShareLink(value)) {
      tips.push(el(doc, 'p', null, say('image_drive')));
    }
    if (tips.length) { tip.append(...tips); tip.hidden = false; }
    const picture = safeImage(value, { baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin, cookieDomain: ctx.cookieDomain });
    if (!picture || raw) { result.textContent = ''; return; }
    result.textContent = say('image_checking');
    const found = await testImage(picture.src, { doc, ocsHost: picture.ocsHost });
    if (mine === run) result.textContent = found.ok ? say('image_ok', { width: found.width, height: found.height }) : say('image_failed');
  }
  const button = el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: check }, say('image_check'));
  control.addEventListener('change', check);
  base.element.insertBefore(el(doc, 'div', { class: 'ocs__links' }, button, result), control.nextSibling);
  base.element.appendChild(tip);
  return base;
}

function rowTools(ctx, index, count, onMove, onRemove) {
  const { doc, say } = ctx;
  return el(doc, 'div', { class: 'ocs__links ui-builder-item-tools' },
    iconButton(doc, { name: 'fa-arrow-up', label: say('move_up'), disabled: ctx.readOnly || index === 0, onclick: () => onMove(index, -1) }),
    iconButton(doc, { name: 'fa-arrow-down', label: say('move_down'), disabled: ctx.readOnly || index === count - 1, onclick: () => onMove(index, 1) }),
    iconButton(doc, { name: 'fa-trash-can', label: say('remove'), disabled: ctx.readOnly, onclick: () => onRemove(index) }));
}

// Links and items: repeatable rows with add, remove and move. Each row's sub-fields are ordinary
// widgets; a row count change rebuilds the rows, and focus returns to the same control.
function listWidget(field, ctx) {
  const { doc, say } = ctx;
  const isLinks = field.type === 'links';
  const subFields = isLinks
    ? [{ id: 'label', type: 'text', label: say('links_label'), required: true }, { id: 'url', type: 'url', label: say('links_url'), required: true }]
    : listOf(field.item_fields);
  const max = Number.isInteger(field.max_items) ? field.max_items : ctx.listMax;
  let value = listOf(ctx.value).map((item) => (isObject(item) ? item : {}));
  let rows = [];
  let issues = [];
  const list = el(doc, 'ol', { class: 'ui-builder-rows' });
  const add = el(doc, 'button', { type: 'button', class: 'ocs__btn ocs__btn--icon small', onclick: () => {
    const blank = Object.fromEntries(subFields.map((sub) => [sub.id, sub.type === 'toggle' ? false : '']));
    commit([...value, blank], { focusRow: value.length });
  } }, icon(doc, 'fa-plus'), isLinks ? say('links_add') : say('items_add'));
  const group = el(doc, 'fieldset', { class: 'ui-builder-list', id: ctx.nextId() }, el(doc, 'legend', { class: 'ocs__label' }, field.label), list, add);
  const box = shell(ctx, { ...field, label: '' }, group, { labelText: '' });

  function commit(next, { focusRow = null } = {}) {
    value = next;
    ctx.onChange(next, { coalesce: false, path: '' });
    build(focusRow);
  }
  const move = (index, delta) => {
    const to = index + delta;
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    [next[index], next[to]] = [next[to], next[index]];
    commit(next, { focusRow: to });
  };
  const remove = (index) => commit(value.filter((_, at) => at !== index), { focusRow: Math.min(index, value.length - 2) });

  function build(focusRow = null) {
    rows.forEach((row) => row.widgets.forEach((widget) => widget.destroy()));
    rows = value.map((item, index) => {
      const widgets = subFields.map((sub) => createFieldWidget(sub, {
        ...ctx, value: item[sub.id], richPool: null,
        onChange: (next, meta) => {
          value = value.map((row, at) => (at === index ? { ...row, [sub.id]: next } : row));
          ctx.onChange(value, { coalesce: meta.coalesce, path: `${index}.${sub.id}` });
        },
      }));
      const legend = say('item_n', { label: field.label, n: index + 1 });
      const element = el(doc, 'li', { class: 'ui-builder-item' },
        el(doc, 'fieldset', { class: 'ocs__stack' }, el(doc, 'legend', { class: 'ocs__label' }, legend), widgets.map((widget) => widget.element)),
        rowTools(ctx, index, value.length, move, remove));
      return { element, widgets };
    });
    list.replaceChildren(...rows.map((row) => row.element));
    add.disabled = ctx.readOnly || value.length >= max;
    applyIssues();
    if (focusRow !== null && rows[focusRow]) rows[focusRow].widgets[0].focus();
    else if (focusRow !== null) add.focus();
  }
  function applyIssues() {
    box.showIssues(issues.filter((item) => !item.field), group);
    rows.forEach((row, index) => {
      const mine = relativeIssues(issues, String(index));
      row.widgets.forEach((widget, at) => widget.setIssues(relativeIssues(mine, subFields[at].id)));
    });
  }
  build();
  return {
    element: box.element,
    setValue(next) {
      const incoming = listOf(next).map((item) => (isObject(item) ? item : {}));
      if (same(incoming, value)) return;
      const rebuild = incoming.length !== value.length;
      value = incoming;
      if (rebuild) build();
      else rows.forEach((row, index) => row.widgets.forEach((widget, at) => widget.setValue(value[index][subFields[at].id])));
    },
    setIssues(next) { issues = listOf(next); applyIssues(); },
    focus: () => (rows[0] ? rows[0].widgets[0].focus() : add.focus()),
    destroy() { rows.forEach((row) => row.widgets.forEach((widget) => widget.destroy())); },
  };
}

// group: one of the student's own groups (Spring's /my-groups, without class groups and course
// channels). A group that isn't theirs (a teammate picked it) stays selectable as it is.
function groupWidget(field, ctx) {
  const { doc, say } = ctx;
  const groups = ctx.services && ctx.services.groups;
  const control = el(doc, 'select', { class: 'ocs__input', disabled: true }, el(doc, 'option', { value: '' }, say('group_loading')));
  const box = shell(ctx, field, control);
  box.describe();
  const status = el(doc, 'small', { class: 'ui-builder-note' });
  box.element.appendChild(status);
  let value = isObject(ctx.value) ? ctx.value : null;
  let known = [];
  function fill() {
    const options = [{ value: '', label: say('group_none') }, ...known.map((group) => ({ value: String(group.id), label: group.name }))];
    if (value && !known.some((group) => group.id === value.id)) options.push({ value: String(value.id), label: say('group_not_yours', { name: value.name || value.id }) });
    control.replaceChildren(...options.map((option) => el(doc, 'option', { value: option.value }, option.label)));
    control.value = value ? String(value.id) : '';
  }
  function load() {
    if (!groups || !groups.available) {
      status.textContent = say('group_needs_spring');
      fill();
      return;
    }
    status.textContent = '';
    groups.list().then((list) => {
      known = listOf(list);
      control.disabled = Boolean(ctx.readOnly);
      fill();
    }, (error) => {
      fill();
      // The store's words for the failure, never the error's own message (page-store.js wording).
      const services = ctx.services || {};
      const message = typeof services.errorText === 'function' ? services.errorText(error) : ((error && error.message) || '');
      status.replaceChildren(say('group_failed', { message }), ' ',
        el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: load }, say('group_retry')));
    });
  }
  control.addEventListener('change', () => {
    const picked = control.value ? (known.find((group) => String(group.id) === control.value) || value) : null;
    value = picked ? { id: picked.id, name: picked.name } : null;
    ctx.onChange(value, { coalesce: false, path: '' });
  });
  load();
  return {
    element: box.element,
    setValue(next) { value = isObject(next) ? next : null; fill(); },
    setIssues: (issues) => box.showIssues(issues), focus: () => control.focus(), destroy() {},
  };
}

export function createFieldWidget(field, ctx) {
  switch (field.type) {
    case 'text': return inputWidget(field, ctx);
    case 'textarea': return inputWidget(field, ctx, { tag: 'textarea', extra: { rows: field.id === 'code' ? 10 : 4, spellcheck: field.id === 'code' ? 'false' : null, class: field.id === 'code' ? 'ocs__input ui-builder-mono' : 'ocs__input' } });
    case 'table': return inputWidget(field, ctx, { tag: 'textarea', extra: { rows: 6, spellcheck: 'false', class: 'ocs__input ui-builder-mono' } });
    case 'url': return inputWidget(field, ctx, { type: 'url', extra: { inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: field.placeholder || 'https://' } });
    case 'number': return inputWidget(field, ctx, { type: 'number', extra: { min: field.min, max: field.max, step: 1, inputmode: 'numeric' } });
    case 'image': return imageWidget(field, ctx);
    case 'choice': return selectWidget(field, ctx, listOf(field.options));
    case 'course': {
      const empty = { value: '', label: ctx.say(field.required ? 'course_none' : 'course_page') };
      return selectWidget(field, ctx, [empty, ...listOf(ctx.courses)]);
    }
    case 'toggle': return toggleWidget(field, ctx);
    case 'richtext': return richWidget(field, ctx);
    case 'links':
    case 'items': return listWidget(field, ctx);
    case 'group': return groupWidget(field, ctx);
    case 'api':
      if (ctx.factories && typeof ctx.factories.api === 'function') return ctx.factories.api(field, ctx);
      throw new Error('UI Builder inspector: the api field needs ctx.factories.api');
    default: throw new Error(`UI Builder inspector: no widget for field type ${String(field.type)}`);
  }
}
