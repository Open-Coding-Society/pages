// The canvas (DESIGN §7.4): runs inside the editor's same-origin iframe at /ui-builder/canvas/ and
// draws the page the editor sends it. window.OCSUiCanvas = {nonce, render, select, scrollTo,
// onSelect, onHover, onAddRequest, onSectionAction, onAddSection, onKey}. Each section gets the
// Studio's hover toolbar (Edit, Move up, Move down, Duplicate, Remove) and an Add section pill
// above it, with one more after the last section. It keeps no state the editor can't resend: every
// render gets the whole page as a JSON string, parsed here in this window's own realm. Blocks
// whose JSON didn't change keep their DOM (no image flicker, scroll stays). Live blocks show
// design samples; only "Data from your API" reads anything, and only with "Real data while
// editing" on. Links and buttons in the page never act: a click selects what was clicked.
import { readRegistry, textOf } from './registry.js';
import { renderPage } from './render.js';
import { contentRenderers } from './blocks-content.js';
import { renderApiItems } from './blocks-project.js';
import { toDOM } from './vnode.js';
import { createRichHooks } from './rich-content.js';
import { doctor, fetchJson, listIn, mapItems } from './api-data.js';
import { isMacPlatform, isTypingTarget, keyEventOf, shortcutOf } from './editor-shortcuts.js';
import { READY_EVENT } from './canvas-bridge.js';

const NONCE = /^[a-z0-9]{16,64}$/;
const FETCH_DELAY_MS = 1000;
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => (isObject(value) && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined);
const listOf = (value) => (Array.isArray(value) ? value : []);

export function readNonce(search) {
  const nonce = new URLSearchParams(String(search || '')).get('nonce');
  return nonce && NONCE.test(nonce) ? nonce : null;
}

// Only under a parent window of this same origin: anywhere else the canvas would hand its API to
// a page it doesn't know. Reading a cross-origin parent's location throws.
export function canvasAllowed(win) {
  try {
    return Boolean(win) && win.parent !== win && win.parent.location.origin === win.location.origin;
  } catch (_) {
    return false;
  }
}

// What each node's DOM depends on. A section's own settings and the order of its blocks (not
// their content, so editing a block never rebuilds its neighbours); a block's whole JSON.
export function nodeHashes(page) {
  const out = new Map();
  for (const section of listOf(own(page, 'sections'))) {
    const id = own(section, 'id');
    if (typeof id !== 'string' || out.has(id)) continue;
    const cells = listOf(own(section, 'cells')).map((cell) => listOf(own(cell, 'blocks')).map((block) => own(block, 'id')));
    out.set(id, JSON.stringify([own(section, 'type'), own(section, 'settings'), own(section, 'hidden') === true, cells]));
    for (const cell of listOf(own(section, 'cells'))) {
      for (const block of listOf(own(cell, 'blocks'))) {
        const blockId = own(block, 'id');
        if (typeof blockId === 'string' && !out.has(blockId)) out.set(blockId, JSON.stringify(block));
      }
    }
  }
  return out;
}

// Everything every block depends on: the page's own settings (a calendar uses its course, the
// width sets the container) and the real-data switch. A change here redraws every block.
export function contextKey(page, realData) {
  return JSON.stringify([own(page, 'page'), realData === true]);
}

export function apiBlocksOf(page) {
  const out = [];
  for (const section of listOf(own(page, 'sections'))) {
    for (const cell of listOf(own(section, 'cells'))) {
      for (const block of listOf(own(cell, 'blocks'))) {
        if (own(block, 'type') === 'api_data' && typeof own(block, 'id') === 'string') out.push(block);
      }
    }
  }
  return out;
}

// What "Real data while editing" shows for one Data from your API block, from its fetchJson
// result: the published page's own list rule (api-data.js listIn) and markup (blocks-project.js
// renderApiItems), so the preview is what visitors will see. A failed read shows the saved copy,
// if there is one, and the doctor's advice. ctx is the canvas render context.
// → {view: vnode or null, status: text}
export function realDataView(result, block, ctx) {
  const { registry } = ctx;
  const settings = isObject(own(block, 'settings')) ? block.settings : {};
  const source = isObject(own(settings, 'source')) ? settings.source : {};
  const limit = Number.isInteger(settings.limit) ? Math.min(Math.max(settings.limit, 1), 50) : 12;
  if (result.ok) {
    const cookieDomain = own(registry.security, 'cookie_domain');
    const items = mapItems(listIn(result.json, source.list_path), source, {
      limit, itemChars: (registry.limits || {}).api_item_chars || 500, baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin,
      cookieDomain: typeof cookieDomain === 'string' ? cookieDomain : '', sourceUrl: result.url,
    });
    const view = renderApiItems(items, settings, ctx);
    return { view, status: view ? '' : textOf(registry, 'blocks.api_empty') };
  }
  const problem = doctor(result, { url: source.url, pageOrigin: ctx.pageOrigin }).find((line) => line.level === 'error');
  return {
    view: renderApiItems(listOf(own(source.snapshot, 'items')).slice(0, limit), settings, ctx),
    status: problem ? textOf(registry, `doctor.${problem.key}`, problem.vars) : '',
  };
}

function closestNode(target) {
  for (let node = target; node && node.nodeType === 1; node = node.parentElement) {
    const id = node.getAttribute('data-ui-node');
    if (id) return node;
  }
  return null;
}

// The part of the page a key was pressed in, sent with the key so Delete or a move acts on what
// has focus: the id of the block or section around the focused element, '' on an add button or
// an Add section pill
// (no part to act on) and null when nothing in the page has focus (the editor's selection then).
export function keyPartOf(target) {
  if (!target || target.nodeType !== 1) return null;
  if (target.closest('[data-ui-add], [data-ui-add-section-at]')) return '';
  const node = target.closest('[data-ui-node]');
  return node ? node.getAttribute('data-ui-node') : null;
}

function notice(doc, root, text) {
  const box = doc.createElement('div');
  box.className = 'ocs__container ocs__stack';
  const callout = doc.createElement('div');
  callout.className = 'ocs__callout';
  callout.textContent = text;
  box.appendChild(callout);
  root.replaceChildren(box);
}

export function startCanvas({ root, richText, baseurl = '', win = globalThis.window, doc = globalThis.document } = {}) {
  if (!root) throw new Error('UI Builder canvas: root is required');
  const registry = readRegistry(doc);
  const say = (key, vars) => textOf(registry, `editor.${key}`, vars);
  const nonce = readNonce(win.location.search);
  if (!nonce || !canvasAllowed(win)) {
    notice(doc, root, say('canvas_only'));
    return null;
  }
  const pageOrigin = win.location.origin;
  const limits = registry.limits || {};
  const hooks = createRichHooks({ richText, baseurl, pageOrigin, doc });
  const ctx = { registry, mode: 'canvas', baseurl, pageOrigin, renderers: contentRenderers };
  const handlers = { select: null, hover: null, add: null, key: null, sectionAction: null, addSection: null };
  const emit = (name, value) => {
    const fn = handlers[name];
    if (typeof fn !== 'function') return;
    try {
      fn(value);
    } catch (error) {
      console.error('UI Builder canvas: the editor callback failed', error);
    }
  };
  let state = { key: null, hashes: new Map(), blocks: new Map(), page: null, realData: false };
  let selectedId = null;
  let hoverId = null;
  const real = { results: new Map(), timers: new Map(), wanted: new Map() };

  function mark(attribute, id) {
    for (const element of root.querySelectorAll(`[${attribute}]`)) element.removeAttribute(attribute);
    if (!id) return null;
    const element = [...root.querySelectorAll('[data-ui-node]')].find((node) => node.getAttribute('data-ui-node') === id);
    if (element) element.setAttribute(attribute, '');
    return element || null;
  }

  function addButton(sectionId, cellIndex) {
    const button = doc.createElement('button');
    button.type = 'button';
    // ocs__btn--icon spaces the icon from the words (a flex button drops a leading space).
    button.className = 'ocs__btn ocs__btn--icon small';
    button.setAttribute('data-ui-add', '');
    button.setAttribute('data-ui-add-section', sectionId);
    button.setAttribute('data-ui-add-cell', String(cellIndex));
    const icon = doc.createElement('i');
    icon.className = 'fa-solid fa-plus';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, doc.createTextNode(say('canvas_add')));
    return button;
  }

  function chromeButton({ iconName, label, attrs, words = false, className = 'ocs__btn ocs__btn--icon small' }) {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = className;
    for (const [name, value] of Object.entries(attrs)) button.setAttribute(name, value);
    const glyph = doc.createElement('i');
    glyph.className = `fa-solid ${iconName}`;
    glyph.setAttribute('aria-hidden', 'true');
    button.append(glyph);
    if (words) button.append(doc.createTextNode(label));
    else {
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    return button;
  }

  // An Add section pill: above a section (index = its place), or after the last one.
  function addSectionPill(index, { end = false } = {}) {
    const holder = doc.createElement('div');
    holder.className = end ? 'ui-builder-canvas-add ui-builder-canvas-add--end' : 'ui-builder-canvas-add';
    holder.setAttribute('data-ui-chrome', '');
    holder.append(chromeButton({ iconName: 'fa-plus', label: say('canvas_add_section'), words: true, className: 'ocs__btn ocs__btn--icon small accent fill', attrs: { 'data-ui-add-section-at': String(index) } }));
    return holder;
  }

  // The section's hover toolbar. Its buttons only report; the editor runs the action.
  function sectionTools(sectionId, index, count) {
    const bar = doc.createElement('div');
    bar.className = 'ocs__links ui-builder-canvas-tools';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', say('canvas_section_tools', { n: index + 1 }));
    bar.setAttribute('data-ui-chrome', '');
    const tool = (action, iconName, label, extra = {}) => chromeButton({ iconName, label, attrs: { 'data-ui-section-act': action, 'data-ui-section': sectionId, ...extra } });
    const edit = chromeButton({ iconName: 'fa-pen', label: say('canvas_edit_section'), words: true, className: 'ocs__btn ocs__btn--icon small accent fill', attrs: { 'data-ui-section-act': 'edit', 'data-ui-section': sectionId } });
    const up = tool('move_up', 'fa-arrow-up', say('move_up'));
    const down = tool('move_down', 'fa-arrow-down', say('move_down'));
    up.disabled = index === 0;
    down.disabled = index === count - 1;
    bar.append(edit, up, down, tool('duplicate', 'fa-clone', say('duplicate')), tool('remove', 'fa-trash-can', say('remove')));
    return bar;
  }

  // Canvas chrome around the page: the Studio's section toolbars and Add section pills, add
  // buttons in empty cells (only while the page can be edited) and a label on hidden parts.
  function decorate({ editable = true } = {}) {
    const sections = [...root.querySelectorAll('[data-ui-kind="section"]')];
    if (editable) sections.forEach((section, index) => {
      const sectionId = section.getAttribute('data-ui-node');
      if (!sectionId) return;
      section.prepend(addSectionPill(index), sectionTools(sectionId, index, sections.length));
    });
    const article = root.querySelector('[data-ui-page]');
    if (article && editable) article.append(addSectionPill(sections.length, { end: true }));
    for (const section of editable ? sections : []) {
      const sectionId = section.getAttribute('data-ui-node');
      if (!sectionId || section.hasAttribute('data-ui-error')) continue;
      const cells = [...section.children].filter((child) => child.hasAttribute('data-ui-cell'));
      const holders = cells.length ? cells : [section];
      holders.forEach((holder, index) => {
        if (!holder.querySelector('[data-ui-kind="block"]')) holder.appendChild(addButton(sectionId, index));
      });
    }
    for (const hidden of root.querySelectorAll('[data-ui-hidden]')) hidden.setAttribute('data-ui-hidden-label', say('canvas_hidden'));
    mark('data-ui-selected', selectedId);
    mark('data-ui-hover', hoverId);
  }

  function paintApi(element, block) {
    const settings = isObject(block.settings) ? block.settings : {};
    const source = isObject(settings.source) ? settings.source : {};
    const mount = element.querySelector('[data-ui-live-mount]');
    const status = element.querySelector('[data-ui-live-status]');
    const entry = real.results.get(String(source.url || '').trim());
    if (!mount || !status || !entry) return;
    if (entry.loading) {
      status.textContent = say('canvas_real_loading');
      return;
    }
    // Once the API has answered, the sample gives way to what visitors would see, even nothing.
    const { view, status: line } = realDataView(entry.result, block, ctx);
    mount.replaceChildren(...(view ? [toDOM(view, { doc })] : []));
    status.textContent = line;
  }

  function fetchSource(url) {
    if (real.results.has(url)) return;
    real.results.set(url, { loading: true });
    fetchJson(url, {
      mode: 'canvas', pageHost: win.location.hostname, pageProtocol: win.location.protocol,
      timeoutMs: limits.api_timeout_ms || 8000, maxChars: limits.api_max_chars || 512000,
    }).then((result) => {
      real.results.set(url, { result });
      if (state.realData) paintRealData();
    });
  }

  // One fetch per change of a block's source, a second after the last change to it.
  function paintRealData() {
    for (const block of apiBlocksOf(state.page)) {
      const element = state.blocks.get(block.id);
      const url = String(own(own(own(block, 'settings'), 'source'), 'url') || '').trim();
      if (!element || !url) continue;
      if (real.results.has(url)) {
        paintApi(element, block);
        continue;
      }
      if (real.wanted.get(block.id) === url && real.timers.has(block.id)) continue;
      clearTimeout(real.timers.get(block.id));
      real.wanted.set(block.id, url);
      real.timers.set(block.id, setTimeout(() => {
        real.timers.delete(block.id);
        fetchSource(url);
        if (state.realData) paintRealData();
      }, FETCH_DELAY_MS));
    }
  }

  function render(specJson, options = {}) {
    let page;
    try {
      page = typeof specJson === 'string' ? JSON.parse(specJson) : null;
    } catch (error) {
      page = null;
    }
    if (!isObject(page)) {
      notice(doc, root, say('canvas_bad_page', { message: 'JSON' }));
      state = { ...state, key: null, blocks: new Map(), page: null };
      return Promise.resolve();
    }
    const realData = own(options, 'realData') === true;
    if (realData && !state.realData) real.results.clear(); // switching on reads the APIs again
    selectedId = typeof own(options, 'selectedId') === 'string' ? options.selectedId : null;
    const key = contextKey(page, realData);
    const hashes = nodeHashes(page);
    let fresh;
    try {
      fresh = toDOM(renderPage(page, ctx), { doc, renderRich: hooks.renderRich });
    } catch (error) {
      // Blocks have their own error boundaries; this is a page the renderer can't read at all.
      console.error('UI Builder canvas: the page could not be drawn', error);
      notice(doc, root, say('canvas_bad_page', { message: error && error.message ? error.message : '' }));
      state = { ...state, key: null, blocks: new Map(), page: null };
      return Promise.resolve();
    }
    if (key === state.key && fresh.querySelectorAll) {
      const used = new Set();
      for (const element of fresh.querySelectorAll('[data-ui-kind="block"][data-ui-node]')) {
        const id = element.getAttribute('data-ui-node');
        const old = state.blocks.get(id);
        if (old && !used.has(old) && state.hashes.get(id) === hashes.get(id)) {
          element.replaceWith(old);
          used.add(old);
        }
      }
    }
    const scroller = doc.scrollingElement || doc.documentElement;
    const top = scroller.scrollTop;
    root.replaceChildren(fresh);
    scroller.scrollTop = top;
    const blocks = new Map();
    for (const element of root.querySelectorAll('[data-ui-kind="block"][data-ui-node]')) {
      const id = element.getAttribute('data-ui-node');
      if (id && !blocks.has(id)) blocks.set(id, element);
    }
    state = { key, hashes, blocks, page, realData };
    // Read only (someone else holds the page): no toolbars or add buttons that would do nothing.
    decorate({ editable: own(options, 'editable') !== false });
    if (realData) paintRealData();
    return Promise.resolve();
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target && event.target.nodeType === 1 ? event.target : event.target && event.target.parentElement;
    const sectionAct = target && target.closest('[data-ui-section-act]');
    if (sectionAct) {
      if (!sectionAct.disabled) emit('sectionAction', { sectionId: sectionAct.getAttribute('data-ui-section'), action: sectionAct.getAttribute('data-ui-section-act') });
      return;
    }
    const addAt = target && target.closest('[data-ui-add-section-at]');
    if (addAt) {
      emit('addSection', { index: Number(addAt.getAttribute('data-ui-add-section-at')) });
      return;
    }
    const add = target && target.closest('[data-ui-add]');
    if (add) {
      emit('add', { sectionId: add.getAttribute('data-ui-add-section'), cellIndex: Number(add.getAttribute('data-ui-add-cell')) || 0 });
      return;
    }
    const node = closestNode(target);
    emit('select', node ? node.getAttribute('data-ui-node') : null);
  }

  function onOver(event) {
    const node = closestNode(event.target);
    const id = node ? node.getAttribute('data-ui-node') : null;
    if (id === hoverId) return;
    hoverId = id;
    mark('data-ui-hover', hoverId);
    emit('hover', hoverId);
  }

  const mac = isMacPlatform(win.navigator);
  function onKey(event) {
    if (isTypingTarget(event.target)) return;
    if (!shortcutOf(event, { mac })) return;
    // The editor runs the shortcut; nothing in the canvas (or a site script) may act on it too.
    event.preventDefault();
    event.stopPropagation();
    emit('key', { ...keyEventOf(event), nodeId: keyPartOf(event.target) });
  }

  const stop = (event) => event.preventDefault();
  doc.addEventListener('click', onClick, true);
  doc.addEventListener('auxclick', stop, true);
  doc.addEventListener('dragstart', stop, true);
  doc.addEventListener('submit', stop, true);
  doc.addEventListener('mouseover', onOver, true);
  doc.documentElement.addEventListener('mouseleave', () => onOver({ target: null }));
  win.addEventListener('keydown', onKey, true);

  const reduceMotion = () => Boolean(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const api = Object.freeze({
    nonce,
    render,
    select(id) {
      selectedId = typeof id === 'string' && id ? id : null;
      mark('data-ui-selected', selectedId);
    },
    scrollTo(id) {
      const element = typeof id === 'string' ? [...root.querySelectorAll('[data-ui-node]')].find((node) => node.getAttribute('data-ui-node') === id) : null;
      if (element) element.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
    },
    onSelect(fn) { handlers.select = fn; },
    onHover(fn) { handlers.hover = fn; },
    onAddRequest(fn) { handlers.add = fn; },
    onSectionAction(fn) { handlers.sectionAction = fn; },
    onAddSection(fn) { handlers.addSection = fn; },
    onKey(fn) { handlers.key = fn; },
  });
  win.OCSUiCanvas = api;
  const parent = win.parent;
  parent.dispatchEvent(new parent.CustomEvent(READY_EVENT, { detail: { nonce, canvas: api } }));
  return api;
}
