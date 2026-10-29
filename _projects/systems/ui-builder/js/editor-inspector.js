// The inspector (DESIGN §10): the selected block's or section's fields, or Page settings when
// nothing is selected. Built from the registry's field lists, with inline issues from
// validatePage. While the selection stays the same it only patches values and issues, so a field
// being typed in keeps focus; picking something else rebuilds it. The API field lives here: Test
// connection with the API doctor, "Which list", field slots per view, a saved copy for visitors
// and Show code.
import { defOf } from './registry.js';
import { findNode } from './page-model.js';
import { SLOTS, codeSnippet, doctor, fetchJson, fieldsOf, findListPath, guessMapping, isPrivateField, mapItems } from './api-data.js';
import { listIn } from './canvas.js';
import { createFieldWidget, createRichPool, el, icon, iconButton, relativeIssues } from './editor-fields.js';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const listOf = (value) => (Array.isArray(value) ? value : []);
const VIEW_SLOTS = { cards: ['title', 'text', 'image', 'link'], list: ['title', 'text'], stats: ['value', 'label'], table: ['title', 'text', 'value', 'label'] };
const LEVEL_ICONS = { ok: 'fa-circle-check', info: 'fa-circle-info', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };

// Every list in a reply, shallowest first: [{path, count}] ('' is the reply itself).
export function listPathsOf(json, { maxDepth = 3, max = 30 } = {}) {
  const out = [];
  if (Array.isArray(json)) return [{ path: '', count: json.length }];
  const queue = isObject(json) ? [{ value: json, path: '', depth: 0 }] : [];
  for (let seen = 0; queue.length && out.length < max && seen < 500; seen += 1) {
    const { value, path, depth } = queue.shift();
    for (const key of Object.keys(value)) {
      if (!/^[A-Za-z0-9_-]{1,60}$/.test(key) || ['__proto__', 'constructor', 'prototype'].includes(key)) continue;
      const child = value[key];
      const childPath = path ? `${path}.${key}` : key;
      if (Array.isArray(child)) out.push({ path: childPath, count: child.length });
      else if (isObject(child) && depth < maxDepth) queue.push({ value: child, path: childPath, depth: depth + 1 });
    }
  }
  return out.slice(0, max);
}

// The slots a view shows; a table's are its columns.
export function slotsForView(view) {
  return VIEW_SLOTS[view] || VIEW_SLOTS.cards;
}

// A copy for visitors that fits the registry caps: at most maxItems, and fewer until it fits maxChars.
export function snapshotOf(items, { maxItems, maxChars, now, fromLoopback = false }) {
  const kept = listOf(items).slice(0, maxItems);
  const total = listOf(items).length;
  const build = () => ({ items: kept, fetched_at: now, from_loopback: fromLoopback === true });
  while (kept.length && JSON.stringify(build()).length > maxChars) kept.pop();
  return { snapshot: build(), trimmed: kept.length < Math.min(total, maxItems) };
}

function apiWidget(field, ctx) {
  const { doc, say, registry } = ctx;
  const options = ctx.apiOptions || {};
  const limits = registry.limits || {};
  let source = isObject(ctx.value) ? ctx.value : {};
  let settings = isObject(ctx.settings) ? ctx.settings : {};
  let tested = null; // {url, result}
  let destroyed = false;
  const id = ctx.nextId();
  const url = el(doc, 'input', { class: 'ocs__input', type: 'url', id, inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: 'https://', disabled: ctx.readOnly });
  const issue = el(doc, 'strong', { class: 'ocs__uibuilder-issue', id: `${id}-issue`, hidden: true });
  url.setAttribute('aria-describedby', `${id}-issue`);
  const testButton = el(doc, 'button', { type: 'button', class: 'ocs__btn small accent', onclick: () => test() }, say('api_test'));
  const codeButton = el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => ctx.showCode(codeSnippet(source)) }, say('show_code'));
  const checks = el(doc, 'ul', { class: 'ocs__uibuilder-checks', 'aria-live': 'polite', 'aria-label': say('api_checks') });
  const listSelect = el(doc, 'select', { class: 'ocs__input', id: `${id}-list`, disabled: ctx.readOnly });
  const slotsBox = el(doc, 'div', { class: 'ocs__stack' });
  const slotNote = el(doc, 'small', { class: 'ocs__uibuilder-note' });
  const snapshotText = el(doc, 'small', { class: 'ocs__uibuilder-note' });
  const saveCopy = el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => saveSnapshot() }, say('api_snapshot_save'));
  const dropCopy = el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => emit({ snapshot: { items: [], fetched_at: 0, from_loopback: false } }, 'snapshot') }, say('api_snapshot_remove'));
  const element = el(doc, 'fieldset', { class: 'ocs__uibuilder-api ocs__stack', 'data-ui-field': field.id },
    el(doc, 'legend', { class: 'ocs__label' }, field.label),
    el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: id }, say('api_url')), url, issue),
    el(doc, 'div', { class: 'ocs__links' }, testButton, codeButton),
    checks,
    el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: `${id}-list` }, say('api_list')), listSelect),
    el(doc, 'div', { class: 'ocs__field' }, el(doc, 'span', { class: 'ocs__label' }, say('api_slots')), slotsBox, slotNote),
    el(doc, 'div', { class: 'ocs__field' }, el(doc, 'span', { class: 'ocs__label' }, say('api_snapshot')), snapshotText, el(doc, 'div', { class: 'ocs__links' }, saveCopy, dropCopy)));

  function emit(patch, path) {
    source = { ...source, ...patch };
    ctx.onChange(source, { coalesce: path === 'url', path });
    paint();
  }
  const currentTest = () => (tested && tested.url === String(source.url || '').trim() && tested.result.ok ? tested.result : null);
  const itemsOf = (result) => listIn(result.json, source.list_path);

  function option(value, label, disabled = false) {
    return el(doc, 'option', { value, disabled }, label);
  }
  function paintList(result) {
    const lists = result ? listPathsOf(result.json) : [];
    const current = typeof source.list_path === 'string' ? source.list_path : '';
    const choices = [option('', say('api_list_whole')), ...lists.filter((list) => list.path).map((list) => option(list.path, say('api_list_count', { path: list.path, count: list.count })))];
    if (current && !lists.some((list) => list.path === current)) choices.push(option(current, current));
    listSelect.replaceChildren(...choices);
    listSelect.value = current;
  }
  function paintSlots(result) {
    // Rebuilt on every change: put the keyboard back on the select it was on.
    const focused = slotsBox.contains(doc.activeElement) ? doc.activeElement.id : null;
    const fields = result ? fieldsOf(itemsOf(result)) : [];
    const view = typeof settings.view === 'string' ? settings.view : 'cards';
    slotsBox.replaceChildren(...slotsForView(view).map((slot, index) => {
      const key = `${slot}_path`;
      const current = typeof source[key] === 'string' ? source[key] : '';
      const choices = [option('', say('api_slot_none')),
        ...fields.map((item) => (isPrivateField(item.path) ? option(item.path, say('api_private_option', { path: item.path }), true) : option(item.path, item.path)))];
      if (current && !fields.some((item) => item.path === current)) choices.push(option(current, current));
      const selectId = `${id}-${slot}`;
      const select = el(doc, 'select', { class: 'ocs__input', id: selectId, disabled: ctx.readOnly, onchange: (event) => emit({ [key]: event.target.value }, key) }, choices);
      select.value = current;
      const label = view === 'table' ? say('slot_column', { n: index + 1 }) : say(`slot_${slot}`);
      return el(doc, 'div', { class: 'ocs__field' }, el(doc, 'label', { class: 'ocs__label', for: selectId }, label), select);
    }));
    slotNote.textContent = result ? '' : say('api_fields_need_test');
    const again = focused && doc.getElementById(focused);
    if (again) again.focus();
  }
  function paint() {
    const text = String(source.url || '');
    if (url.value !== text) url.value = text;
    const result = currentTest();
    paintList(result);
    paintSlots(result);
    const saved = listOf(source.snapshot && source.snapshot.items);
    const date = source.snapshot && source.snapshot.fetched_at ? new Date(source.snapshot.fetched_at).toLocaleString() : '';
    snapshotText.textContent = saved.length
      ? say(source.snapshot.from_loopback ? 'api_snapshot_loopback' : 'api_snapshot_saved', { count: saved.length, date })
      : say(result ? 'api_snapshot_none' : 'api_snapshot_needs_test');
    saveCopy.disabled = ctx.readOnly || !result;
    dropCopy.disabled = ctx.readOnly || !saved.length;
    testButton.disabled = !text.trim();
  }
  function paintChecks(lines) {
    checks.replaceChildren(...lines.map((line) => {
      if (line.level === 'action') {
        const target = String((line.vars && line.vars.url) || '');
        if (!/^https?:\/\//i.test(target)) return null;
        return el(doc, 'li', null, el(doc, 'a', { class: 'ocs__btn small', href: target, target: '_blank', rel: 'noopener noreferrer' }, ctx.text(`doctor.${line.key}`)));
      }
      return el(doc, 'li', { 'data-level': line.level }, icon(doc, LEVEL_ICONS[line.level] || 'fa-circle-info'), ' ', ctx.text(`doctor.${line.key}`, line.vars));
    }).filter(Boolean));
  }
  async function test() {
    const address = String(source.url || '').trim();
    if (!address) return;
    testButton.disabled = true;
    testButton.textContent = say('api_testing');
    checks.replaceChildren();
    const result = await fetchJson(address, {
      mode: 'edit', pageHost: options.pageHost, pageProtocol: options.pageProtocol, fetchImpl: options.fetchImpl,
      timeoutMs: limits.api_timeout_ms || 8000, maxChars: limits.api_max_chars || 512000,
    });
    if (destroyed) return; // the inspector moved on to another block meanwhile
    testButton.textContent = say('api_test');
    tested = { url: address, result };
    paintChecks(doctor(result, { url: address, pageOrigin: options.pageOrigin }));
    if (result.ok && !SLOTS.some((slot) => source[`${slot}_path`])) {
      // First good test: pick the list and guess the fields, private ones never.
      const listPath = findListPath(result.json);
      const guessed = guessMapping(fieldsOf(listIn(result.json, listPath || '')));
      emit({ list_path: listPath || '', ...guessed }, 'list_path');
    } else {
      paint();
    }
  }
  function saveSnapshot() {
    const result = currentTest();
    if (!result) return;
    const wanted = Number.isInteger(settings.limit) ? settings.limit : 12;
    const items = mapItems(itemsOf(result), source, {
      limit: Math.min(wanted, limits.api_snapshot_items || 50), itemChars: limits.api_item_chars || 500,
      baseurl: options.baseurl, pageOrigin: options.pageOrigin, cookieDomain: options.cookieDomain, sourceUrl: result.url,
    });
    const { snapshot, trimmed } = snapshotOf(items, { maxItems: limits.api_snapshot_items || 50, maxChars: limits.api_snapshot_chars || 64000, now: (options.now || Date.now)(), fromLoopback: result.loopback });
    emit({ snapshot }, 'snapshot');
    if (trimmed) slotNote.textContent = say('api_snapshot_trimmed', { count: snapshot.items.length });
  }
  url.addEventListener('input', () => emit({ url: url.value }, 'url'));
  listSelect.addEventListener('change', () => emit({ list_path: listSelect.value }, 'list_path'));
  paint();
  return {
    element,
    setValue(next) {
      if (JSON.stringify(next) === JSON.stringify(source)) return;
      source = isObject(next) ? next : {};
      paint();
    },
    setSettings(next) {
      const view = settings.view;
      settings = isObject(next) ? next : {};
      if (settings.view !== view) paint();
    },
    setIssues(issues) {
      const messages = listOf(issues).map((item) => item.message);
      issue.textContent = messages.join(' ');
      issue.hidden = !messages.length;
      if (messages.length) url.setAttribute('aria-invalid', 'true');
      else url.removeAttribute('aria-invalid');
    },
    focus: () => url.focus(),
    destroy() { destroyed = true; },
  };
}

const visibleIn = (field, settings) => !isObject(field.visible_if) || (isObject(settings) && settings[field.visible_if.field] === field.visible_if.equals);

// actions: changeSettings(id, patch, {coalesceKey}), changePage(patch, {coalesceKey}),
// nodeAction(name, id) for move_up/move_down/duplicate/toggle_hidden/remove/select_parent/show_html,
// and the page actions changeTeam(group|null), refreshEditors(), setVisibility(value),
// unpublish(), deletePage(). services: {groups, showCode(text), courses}.
export function createInspector({ root, doc = globalThis.document, registry, say, text, richText, services = {}, actions, apiOptions = {} }) {
  const pool = createRichPool(richText);
  let counter = 0;
  let view = null; // {signature, widgets: [{field, widget, wrapper}], settings}
  const body = el(doc, 'div', { class: 'ocs__stack' });
  root.replaceChildren(el(doc, 'h2', { class: 'ocs__section-title', id: 'ui-inspector-title' }, say('inspector')), body);

  function baseCtx(state) {
    return {
      doc, say, text, registry, richText, richPool: pool, readOnly: state.readOnly, nextId: () => `ui-f${(counter += 1)}`,
      services, courses: registry.courses || [], listMax: (registry.limits || {}).list_max || 20, apiOptions,
      baseurl: apiOptions.baseurl, pageOrigin: apiOptions.pageOrigin, cookieDomain: apiOptions.cookieDomain,
      factories: { api: apiWidget }, showCode: (code) => services.showCode(code),
    };
  }

  function widgetsFor(fields, values, ctx, onField) {
    return listOf(fields).map((field) => {
      const widget = createFieldWidget(field, {
        ...ctx, value: values[field.id], settings: values,
        onChange: (value, meta) => onField(field, value, meta),
      });
      const wrapper = el(doc, 'div', { class: 'ocs__uibuilder-slot', hidden: !visibleIn(field, values) }, widget.element);
      return { field, widget, wrapper };
    });
  }

  function toolbar(loc, def, state) {
    const id = loc.node.id;
    const label = def ? def.label : loc.node.type;
    const disabled = state.readOnly;
    const act = (name) => () => actions.nodeAction(name, id);
    const hidden = loc.node.hidden === true;
    return el(doc, 'div', { class: 'ocs__links ocs__uibuilder-toolbar', role: 'toolbar', 'aria-label': say('block_toolbar', { label }) },
      iconButton(doc, { name: 'fa-arrow-up', label: say('move_up'), disabled, onclick: act('move_up') }),
      iconButton(doc, { name: 'fa-arrow-down', label: say('move_down'), disabled, onclick: act('move_down') }),
      iconButton(doc, { name: 'fa-clone', label: say('duplicate'), disabled, onclick: act('duplicate') }),
      iconButton(doc, { name: hidden ? 'fa-eye' : 'fa-eye-slash', label: say(hidden ? 'show' : 'hide'), disabled, onclick: act('toggle_hidden') }),
      iconButton(doc, { name: 'fa-trash-can', label: say('remove'), disabled, onclick: act('remove') }),
      loc.kind === 'block' ? el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: act('select_parent') }, say('select_parent')) : null,
      loc.kind === 'block' ? el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: act('show_html') }, say('show_html')) : null);
  }

  function buildNode(loc, state) {
    const def = defOf(registry, loc.kind === 'section' ? 'frame' : 'block', loc.node.type);
    const settings = isObject(loc.node.settings) ? loc.node.settings : {};
    const id = loc.node.id;
    const widgets = widgetsFor(def ? def.fields : [], settings, baseCtx(state), (field, value, meta) => {
      const path = meta && meta.path ? `.${meta.path}` : '';
      actions.changeSettings(id, { [field.id]: value }, { coalesceKey: meta && meta.coalesce ? `${id}:${field.id}${path}` : null });
    });
    // replaceChildren takes nodes, not arrays, and turns null into text: filter and spread.
    body.replaceChildren(...[
      el(doc, 'h3', { class: 'ocs__uibuilder-node-title' }, icon(doc, def ? def.icon : 'fa-square'), ' ', def ? def.label : String(loc.node.type)),
      def && def.help ? el(doc, 'p', { class: 'ocs__text' }, def.help) : null,
      toolbar(loc, def, state),
      ...(widgets.length ? widgets.map((item) => item.wrapper) : [el(doc, 'p', { class: 'ocs__text' }, say('no_fields'))]),
    ].filter(Boolean));
    return { widgets, settings };
  }

  function pageExtras(state) {
    const { capabilities = {}, meta = {} } = state;
    const parts = [];
    const canTeam = capabilities.teams && (meta.isOwner !== false || capabilities.teacher);
    if (capabilities.teams && state.ref) {
      const team = { id: 'team', type: 'group', label: say('team_group'), help: say('team_group_help') };
      const current = state.pendingTeam !== undefined ? state.pendingTeam : (meta.groupId ? { id: meta.groupId, name: meta.groupName || '' } : null);
      const widget = createFieldWidget(team, { ...baseCtx({ ...state, readOnly: state.readOnly || !canTeam }), value: current, onChange: (value) => actions.changeTeam(value) });
      parts.push(widget.element);
      if (canTeam && meta.groupId) parts.push(el(doc, 'div', { class: 'ocs__links' }, el(doc, 'button', { type: 'button', class: 'ocs__btn small', disabled: state.readOnly, onclick: () => actions.refreshEditors() }, say('team_refresh'))));
    }
    if (capabilities.visibility && meta.status === 'PUBLISHED') {
      const isPublic = meta.visibility === 'PUBLIC';
      const until = meta.publicUntil ? new Date(meta.publicUntil).toLocaleDateString() : '';
      const status = isPublic ? say(until ? 'visibility_public_until' : 'visibility_public', { date: until })
        : say(meta.publicRequested ? 'visibility_requested' : 'visibility_signed_in');
      const buttons = [];
      if (!isPublic && capabilities.teacher) buttons.push(el(doc, 'button', { type: 'button', class: 'ocs__btn small accent', onclick: () => actions.setVisibility('PUBLIC') }, text('teacher.approve_public')));
      else if (!isPublic && !meta.publicRequested) buttons.push(el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => actions.setVisibility('PUBLIC') }, say('visibility_request')));
      if (isPublic || meta.publicRequested) buttons.push(el(doc, 'button', { type: 'button', class: 'ocs__btn small', onclick: () => actions.setVisibility('SIGNED_IN') }, say('visibility_members')));
      parts.push(el(doc, 'div', { class: 'ocs__field' }, el(doc, 'span', { class: 'ocs__label' }, say('visibility')), el(doc, 'p', { class: 'ocs__text' }, status),
        el(doc, 'div', { class: 'ocs__links' }, buttons.map((button) => { button.disabled = state.readOnly; return button; }))));
    }
    if (capabilities.publish && meta.status === 'PUBLISHED') {
      parts.push(el(doc, 'div', { class: 'ocs__links' }, el(doc, 'button', { type: 'button', class: 'ocs__btn small', disabled: state.readOnly, onclick: () => actions.unpublish() }, say('unpublish'))));
    }
    // Apart from every other button, behind a type-the-title confirm.
    parts.push(el(doc, 'div', { class: 'ocs__uibuilder-danger' }, el(doc, 'button', { type: 'button', class: 'ocs__btn small', disabled: state.readOnly, onclick: () => actions.deletePage() }, icon(doc, 'fa-trash-can'), ` ${say('delete_page')}`)));
    return parts;
  }

  function buildPage(page, state) {
    const settings = isObject(page.page) ? page.page : {};
    const widgets = widgetsFor(registry.page_fields, settings, baseCtx(state), (field, value, meta) => {
      actions.changePage({ [field.id]: value }, { coalesceKey: meta && meta.coalesce ? `page:${field.id}` : null });
    });
    body.replaceChildren(
      el(doc, 'h3', { class: 'ocs__uibuilder-node-title' }, icon(doc, 'fa-sliders'), ' ', say('page_settings')),
      el(doc, 'p', { class: 'ocs__text' }, say('page_settings_help')),
      ...widgets.map((item) => item.wrapper),
      ...pageExtras(state));
    return { widgets, settings };
  }

  function patch(values, issues, nodeId) {
    for (const { field, widget, wrapper } of view.widgets) {
      widget.setValue(values[field.id]);
      if (typeof widget.setSettings === 'function') widget.setSettings(values);
      widget.setIssues(relativeIssues(listOf(issues).filter((issue) => issue.nodeId === nodeId), field.id));
      wrapper.hidden = !visibleIn(field, values);
    }
  }

  return {
    update(page, state) {
      const loc = state.selectedId ? findNode(page, state.selectedId) : null;
      const meta = state.meta || {};
      const extras = JSON.stringify([meta.status, meta.visibility, meta.publicRequested, meta.publicUntil, meta.groupId, state.pendingTeam, Boolean(state.ref), state.capabilities]);
      const signature = `${loc ? `${loc.kind}:${loc.node.id}:${loc.node.type}:${loc.node.hidden === true}` : `page:${extras}`}:${state.readOnly === true}`;
      const values = loc ? (isObject(loc.node.settings) ? loc.node.settings : {}) : (isObject(page.page) ? page.page : {});
      if (!view || view.signature !== signature) {
        if (view) view.widgets.forEach((item) => item.widget.destroy());
        pool.begin();
        view = { signature, ...(loc ? buildNode(loc, state) : buildPage(page, state)) };
        pool.end();
      }
      patch(values, state.issues, loc ? loc.node.id : null);
    },
    focusFirst() {
      const first = view && view.widgets.find((item) => !item.wrapper.hidden);
      if (first) first.widget.focus();
      else root.focus();
    },
    focusField(fieldId) {
      const found = view && view.widgets.find((item) => item.field.id === fieldId);
      if (found) found.widget.focus();
    },
    destroy() {
      if (view) view.widgets.forEach((item) => item.widget.destroy());
      pool.clear();
      view = null;
    },
  };
}
