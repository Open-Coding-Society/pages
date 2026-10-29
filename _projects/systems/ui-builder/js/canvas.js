// The canvas (DESIGN §7.4): runs inside the editor's same-origin iframe at /ui-builder/canvas/ and
// draws the page the editor sends it. window.OCSUiCanvas = {nonce, render, select, scrollTo,
// onSelect, onHover, onAddRequest, onKey}. It keeps no state the editor can't resend: every
// render gets the whole page as a JSON string, parsed here in this window's own realm. Blocks
// whose JSON didn't change keep their DOM (no image flicker, scroll stays). Live blocks show
// design samples; only "Data from your API" reads anything, and only with "Real data while
// editing" on. Links and buttons in the page never act: a click selects what was clicked.
import { readRegistry, textOf } from './registry.js';
import { renderPage } from './render.js';
import { contentRenderers } from './blocks-content.js';
import { h, toDOM } from './vnode.js';
import { createRichHooks } from './rich-content.js';
import { doctor, fetchJson, findListPath, getPath, mapItems } from './api-data.js';
import { safeImage, safeLink } from './url-rules.js';
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

// The list in an API reply: the mapped list_path when it points at a list, else the best guess.
export function listIn(json, listPath) {
  const mapped = getPath(json, typeof listPath === 'string' ? listPath : '');
  if (Array.isArray(mapped)) return mapped;
  const found = findListPath(json);
  const guess = found === null ? undefined : getPath(json, found);
  return Array.isArray(guess) ? guess : [];
}

// Mapped API items as the page's own grammar, text only. The live viewer draws the published
// page; this is the editing preview of the same four views.
export function apiItemsView(items, view, { cookieDomain = '', source = {} } = {}) {
  const rows = listOf(items).filter(isObject);
  const link = (item, label) => {
    // Items were mapped through safeLink already; a hand-edited snapshot is checked again.
    const target = item.link ? safeLink(item.link, {}) : null;
    return target ? h('a', { class: 'ocs__btn', href: target.href, target: '_blank' }, label) : null;
  };
  const picture = (item) => {
    const image = safeImage(item.image, { cookieDomain });
    if (!image) return null;
    return h('img', { class: 'ocs__image-frame', src: image.src, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer', crossorigin: image.ocsHost ? 'anonymous' : null });
  };
  if (view === 'stats') {
    return h('div', { class: 'ocs__stats' }, rows.map((item) => h('div', { class: 'ocs__stat' },
      h('strong', { class: 'ocs__stat-value' }, item.value), h('span', { class: 'ocs__stat-label' }, item.label || item.title))));
  }
  if (view === 'table') {
    const slots = ['title', 'text', 'value', 'label'].filter((slot) => typeof own(source, `${slot}_path`) === 'string' && source[`${slot}_path`]);
    const columns = slots.length ? slots : ['title'];
    return h('div', { class: 'ocs__table-wrap' }, h('table', { class: 'ocs__table' },
      h('thead', null, h('tr', null, columns.map((slot) => h('th', { scope: 'col' }, own(source, `${slot}_path`) || slot)))),
      h('tbody', null, rows.map((item) => h('tr', null, columns.map((slot) => h('td', null, item[slot])))))));
  }
  if (view === 'list') {
    return h('ul', { class: 'ocs__entity-list' }, rows.map((item) => h('li', null,
      h('strong', null, item.title || item.value), item.text ? [h('br'), item.text] : null)));
  }
  return h('div', { class: 'ocs__grid ocs__grid--card' }, rows.map((item) => h('div', { class: 'ocs__grid-cell' },
    picture(item), item.title ? h('h3', null, item.title) : null, item.text ? h('p', { class: 'ocs__text' }, item.text) : null,
    link(item, item.title || item.link))));
}

function closestNode(target) {
  for (let node = target; node && node.nodeType === 1; node = node.parentElement) {
    const id = node.getAttribute('data-ui-node');
    if (id) return node;
  }
  return null;
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
  const cookieDomain = (registry.security && registry.security.cookie_domain) || '';
  const hooks = createRichHooks({ richText, baseurl, pageOrigin, doc });
  const ctx = { registry, mode: 'canvas', baseurl, pageOrigin, renderers: contentRenderers };
  const handlers = { select: null, hover: null, add: null, key: null };
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
    button.className = 'ocs__btn small';
    button.setAttribute('data-ui-add', '');
    button.setAttribute('data-ui-add-section', sectionId);
    button.setAttribute('data-ui-add-cell', String(cellIndex));
    const icon = doc.createElement('i');
    icon.className = 'fa-solid fa-plus';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, doc.createTextNode(` ${say('canvas_add')}`));
    return button;
  }

  // Canvas chrome around the page: add buttons in empty cells and a label on hidden parts.
  function decorate() {
    for (const section of root.querySelectorAll('[data-ui-kind="section"]')) {
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
    const view = typeof settings.view === 'string' ? settings.view : 'cards';
    const limit = Number.isInteger(settings.limit) ? Math.min(Math.max(settings.limit, 1), 50) : 12;
    const show = (items) => mount.replaceChildren(toDOM(apiItemsView(items, view, { cookieDomain, source }), { doc }));
    const { result } = entry;
    if (result.ok) {
      const items = mapItems(listIn(result.json, source.list_path), source, {
        limit, itemChars: limits.api_item_chars || 500, baseurl, pageOrigin, cookieDomain, sourceUrl: result.url,
      });
      show(items);
      status.textContent = items.length ? '' : textOf(registry, 'blocks.api_empty');
      return;
    }
    const problem = doctor(result, { url: source.url, pageOrigin }).find((line) => line.level === 'error');
    const message = problem ? textOf(registry, `doctor.${problem.key}`, problem.vars) : '';
    const saved = listOf(own(source.snapshot, 'items')).slice(0, limit);
    if (saved.length) show(saved);
    status.textContent = message;
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
    decorate();
    if (realData) paintRealData();
    return Promise.resolve();
  }

  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target && event.target.nodeType === 1 ? event.target : event.target && event.target.parentElement;
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
    emit('key', keyEventOf(event));
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
    onKey(fn) { handlers.key = fn; },
  });
  win.OCSUiCanvas = api;
  const parent = win.parent;
  parent.dispatchEvent(new parent.CustomEvent(READY_EVENT, { detail: { nonce, canvas: api } }));
  return api;
}
