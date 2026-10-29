// The "Your project" blocks on a published page (DESIGN §7.2, §12): Data from your API, and the
// click-to-load Video and Embed your app cards. blocks-content.js renders their markup; this
// module brings it to life in the viewer, never in the canvas. API data is read with
// api-data.js fetchJson (no cookies, no referrer, no redirects, capped and timed out), mapped to
// plain strings and drawn with the same vnode markup family as the content blocks, so nothing
// from a student's API is ever parsed as HTML. The live-card helpers at the end are shared with
// blocks-live.js.
import { apiUrlPolicy, hostOf, safeImage } from './url-rules.js';
import { fetchJson, listIn, mapItems } from './api-data.js';
import { embedFrame, linkTo, lineOf, ownValue, textValue } from './blocks-content.js';
import { browserStorage } from './page-store.js';
import { textOf } from './registry.js';
import { h, toDOM } from './vnode.js';

const CACHE_PREFIX = 'ocs:ui-builder:v1:api:';
const CACHE_MS = 5 * 60 * 1000;
const REQUEST_MS = 15000;
const SLOTS = ['title', 'text', 'image', 'link', 'value', 'label'];
const TABLE_SLOTS = ['title', 'text', 'value', 'label', 'link'];
const VIEWS = new Set(['cards', 'list', 'table', 'stats']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/* ---------- live-card helpers (shared with blocks-live.js) ---------- */

// The parts of a live card (blocks-content.js liveCard): its status line and the element live
// content mounts into.
export function liveParts(card) {
  return { status: card.querySelector('[data-ui-live-status]'), mount: card.querySelector('[data-ui-live-mount]') };
}

export function element(doc, tag, { className = '', text = '', attrs = {} } = {}) {
  const node = doc.createElement(tag);
  if (className) node.setAttribute('class', className);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  if (text) node.appendChild(doc.createTextNode(text));
  return node;
}

// The card's status line: a sentence, optionally followed by a link ({text, href}) or a
// button ({text, onClick}). An empty status is hidden; the line has no ocs__ class, so the
// hidden attribute works on it.
export function showStatus(status, text = '', { link = null, button = null } = {}) {
  if (!status) return null;
  const doc = status.ownerDocument;
  const parts = text ? [doc.createTextNode(text)] : [];
  let control = null;
  if (link && link.href) {
    control = element(doc, 'a', { text: link.text, attrs: { href: link.href } });
  } else if (button) {
    // Button text sits directly in ocs__btn: preset themes recolor a <span> inside it.
    control = element(doc, 'button', { className: 'ocs__btn small', text: button.text, attrs: { type: 'button' } });
    control.addEventListener('click', button.onClick);
  }
  if (control) parts.push(...(text ? [doc.createTextNode(' ')] : []), control);
  writeStatus(status, parts);
  return control;
}

// The status line is a live region (role=status), and one that is shown with its words already
// in it is often not read out (NVDA and JAWS in Chrome). So a hidden line is shown first with its
// words in a hidden holder, and they move in a moment later, once the line is on the page.
const REVEAL_MS = 100;
const revealing = new WeakMap(); // status line → {holder, timer} while its words wait

function writeStatus(status, parts) {
  const waiting = revealing.get(status);
  if (!parts.length) {
    if (waiting) clearTimeout(waiting.timer);
    revealing.delete(status);
    status.replaceChildren();
    status.hidden = true;
  } else if (waiting) {
    waiting.holder.replaceChildren(...parts);
  } else if (!status.hidden) {
    status.replaceChildren(...parts);
  } else {
    const holder = element(status.ownerDocument, 'span', { attrs: { hidden: '' } });
    holder.append(...parts);
    status.replaceChildren(holder);
    status.hidden = false;
    const timer = setTimeout(() => {
      revealing.delete(status);
      status.replaceChildren(...holder.childNodes);
    }, REVEAL_MS);
    revealing.set(status, { holder, timer });
  }
}

// Only the browser knows it has no network. A request that fails while it's online usually
// means the server is down, which "needs a connection" would misdescribe.
export function browserOffline() {
  return Boolean(globalThis.navigator) && globalThis.navigator.onLine === false;
}

// One GET to the site's own backends with config.js fetchOptions (their cookies and headers)
// and a timeout → {ok, status, json, offline}. Never throws: a live card reports what it got.
export async function getJson({ fetchImpl, config }, url, { timeoutMs = REQUEST_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const send = typeof fetchImpl === 'function' ? fetchImpl : (...args) => globalThis.fetch(...args);
  const options = isObject(config) && isObject(config.fetchOptions) ? config.fetchOptions : {};
  try {
    const response = await send(url, { ...options, method: 'GET', signal: controller.signal });
    const status = Number(response && response.status) || 0;
    let json = null;
    try {
      json = await response.json();
    } catch (_) {
      json = null; // an empty or non-JSON reply
    }
    return { ok: status >= 200 && status < 300, status, json, offline: false };
  } catch (_) {
    return { ok: false, status: 0, json: null, offline: browserOffline() };
  } finally {
    clearTimeout(timer);
  }
}

export function formatDay(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '';
  try {
    return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (_) {
    return '';
  }
}

/* ---------- Video and Embed your app ---------- */

// Turns a pressed click-to-load card's button row into its iframe; the card's title, host and
// caption stay above it. embedFrame checks the address again, so a card whose data-ui-embed-*
// attributes were edited in devtools frames nothing new.
export function wireEmbeds(root, ctx) {
  if (!root || typeof root.addEventListener !== 'function') throw new TypeError('UI Builder wireEmbeds: root must be an element');
  const doc = root.ownerDocument;
  const onClick = (event) => {
    const target = event.target;
    const button = target && typeof target.closest === 'function' ? target.closest('button[data-ui-embed-kind]') : null;
    const card = button ? button.closest('[data-ui-embed]') : null;
    if (!card || !root.contains(card)) return;
    event.preventDefault();
    let frame = null;
    try {
      const read = (name) => button.getAttribute(name) || '';
      frame = embedFrame({
        kind: read('data-ui-embed-kind'), src: read('data-ui-embed-src'),
        title: read('data-ui-embed-title'), height: read('data-ui-embed-height'),
      }, ctx);
    } catch (error) {
      console.warn('UI Builder: could not open the embed', error);
    }
    if (!frame) return;
    const iframe = toDOM(frame, { doc });
    const row = button.closest('.ocs__links');
    (row && card.contains(row) ? row : card).replaceWith(iframe);
    if (typeof iframe.focus === 'function') iframe.focus();
  };
  root.addEventListener('click', onClick);
  return { destroy() { root.removeEventListener('click', onClick); } };
}

/* ---------- Data from your API ---------- */

function cookieDomainOf(ctx) {
  const domain = ownValue(ctx.registry.security, 'cookie_domain');
  return typeof domain === 'string' ? domain : '';
}

// Items as they reach the page: six plain strings each. Snapshots come from the spec and the
// cache from storage, so both are cut down to that shape again here.
function cleanItems(items, limit) {
  if (!Array.isArray(items)) return [];
  return items.filter(isObject).slice(0, limit).map((item) => Object.fromEntries(SLOTS.map((slot) => [slot, lineOf(item, slot)])));
}

function imageOf(item, ctx) {
  const picture = safeImage(item.image, { baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin, cookieDomain: cookieDomainOf(ctx) });
  if (!picture) return null;
  // As the Image block: no referrer, and no cookies to the site's own hosts.
  const attrs = { class: 'ocs__image-frame ocs__image-frame--cover', src: picture.src, alt: '', loading: 'lazy' };
  if (/^https:/i.test(picture.src)) attrs.referrerpolicy = 'no-referrer';
  if (picture.ocsHost) attrs.crossorigin = 'anonymous';
  return h('img', attrs);
}

const para = (text) => (text ? h('p', { class: 'ocs__text' }, text) : null);

// The cards of ocs__grid--card (the grid composition in _sass/open-coding/README.md): picture,
// title, text and a button to the item's link.
function cardsView(items, ctx) {
  return h('div', { class: 'ocs__grid ocs__grid--card' }, items.map((item) => {
    const target = linkTo(item.link, ctx);
    return h('div', { class: 'ocs__grid-cell' },
      imageOf(item, ctx),
      item.title ? h('h4', null, item.title) : null,
      para(item.text),
      target ? h('div', { class: 'ocs__links' }, h('a', { class: 'ocs__btn', ...target.attrs }, item.label || textOf(ctx.registry, 'live.api_open'))) : null);
  }));
}

// An ocs__entity-list like the Team block's: the title (linked when the item has a link), then its text.
function listView(items, ctx) {
  return h('ul', { class: 'ocs__entity-list' }, items.map((item) => {
    const target = linkTo(item.link, ctx);
    const title = item.title ? h('strong', null, target ? h('a', target.attrs, item.title) : item.title) : null;
    return h('li', null, title, title && item.text ? h('br') : null, item.text ? h('span', null, item.text) : null);
  }));
}

// The Numbers block's markup: a big value over its label.
function statsView(items) {
  return h('div', { class: 'ocs__stats' }, items.map((item) => h('div', { class: 'ocs__stat' },
    h('strong', { class: 'ocs__stat-value' }, item.value), h('span', { class: 'ocs__stat-label' }, item.label || item.title))));
}

// The Table block's markup, one column per mapped field, headed by the field's name in the API.
function tableView(items, source, ctx) {
  const columns = TABLE_SLOTS.filter((slot) => lineOf(source, `${slot}_path`));
  if (!columns.length) return null;
  const cell = (item, slot) => {
    if (slot !== 'link') return item[slot];
    const target = linkTo(item.link, ctx);
    return target ? h('a', target.attrs, target.fallback) : '';
  };
  return h('div', { class: 'ocs__table-wrap' }, h('table', { class: 'ocs__table' },
    h('thead', null, h('tr', null, columns.map((slot) => h('th', { scope: 'col' }, lineOf(source, `${slot}_path`))))),
    h('tbody', null, items.map((item) => h('tr', null, columns.map((slot) => h('td', null, cell(item, slot))))))));
}

const hasContent = (item, view) => {
  if (view === 'stats') return Boolean(item.value || item.label || item.title);
  if (view === 'table') return SLOTS.some((slot) => item[slot]);
  return Boolean(item.title || item.text || item.image);
};

// API items → one vnode in the block's view (cards, list, table or stats), or null when there
// is nothing to show. Pure: the canvas draws "Real data while editing" with it too.
export function renderApiItems(items, settings, ctx) {
  if (!ctx || !isObject(ctx.registry)) throw new Error('UI Builder renderApiItems: ctx.registry is required');
  const view = VIEWS.has(ownValue(settings, 'view')) ? settings.view : 'cards';
  const source = isObject(ownValue(settings, 'source')) ? settings.source : {};
  const shown = cleanItems(items, 50).filter((item) => hasContent(item, view));
  if (!shown.length) return null;
  if (view === 'list') return listView(shown, ctx);
  if (view === 'stats') return statsView(shown);
  if (view === 'table') return tableView(shown, source, ctx);
  return cardsView(shown, ctx);
}

function limitOf(settings) {
  const limit = ownValue(settings, 'limit');
  return Number.isInteger(limit) && limit >= 1 ? Math.min(limit, 50) : 12;
}

function snapshotOf(source) {
  const snapshot = isObject(ownValue(source, 'snapshot')) ? source.snapshot : {};
  const fetchedAt = ownValue(snapshot, 'fetched_at');
  return {
    items: Array.isArray(ownValue(snapshot, 'items')) ? snapshot.items : [],
    fetchedAt: Number.isFinite(fetchedAt) ? fetchedAt : 0,
    fromLoopback: ownValue(snapshot, 'from_loopback') === true,
  };
}

function hashOf(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 0x01000193) >>> 0;
  return hash.toString(36);
}

function cacheKeyOf(block, source, ctx) {
  const paths = SLOTS.map((slot) => lineOf(source, `${slot}_path`));
  return `${CACHE_PREFIX}${hashOf(JSON.stringify([ctx.pageKey || '', block.id, lineOf(source, 'url'), lineOf(source, 'list_path'), paths, limitOf(block.settings)]))}`;
}

function readCache(storage, key, now) {
  if (!storage) return null;
  try {
    const entry = JSON.parse(storage.getItem(key) || 'null');
    if (!isObject(entry) || !Number.isFinite(entry.at) || !Array.isArray(entry.items)) return null;
    return now - entry.at >= 0 && now - entry.at < CACHE_MS ? entry.items : null;
  } catch (_) {
    return null; // blocked storage or a damaged entry: fetch again
  }
}

function writeCache(storage, key, items, now) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify({ at: now, items }));
  } catch (_) {
    // A full or blocked sessionStorage only costs a fetch on the next view.
  }
}

// Mounts one Data from your API card: the saved copy for an API on the team's own computer
// (visitors can never reach it), else one fetch per block per view (reused from sessionStorage
// for five minutes), falling back to the saved copy when the API doesn't answer. The block's
// address decides, not where its copy was saved: a team that moved to its deployed API is read live.
// ctx: {registry, baseurl, pageOrigin, pageProtocol, pageKey, fetchImpl, storage, now}.
export async function mountApiData(card, block, ctx) {
  const { status, mount } = liveParts(card);
  const doc = card.ownerDocument;
  const say = (key, vars) => textOf(ctx.registry, key, vars);
  const settings = isObject(ownValue(block, 'settings')) ? block.settings : {};
  const source = isObject(ownValue(settings, 'source')) ? settings.source : {};
  const limits = ctx.registry.limits || {};
  const now = typeof ctx.now === 'function' ? ctx.now : Date.now;
  const limit = limitOf(settings);
  let destroyed = false;
  const handle = { destroy() { destroyed = true; mount.replaceChildren(); } };

  const draw = (items) => {
    const view = renderApiItems(cleanItems(items, limit), settings, ctx);
    mount.replaceChildren(...(view ? [toDOM(view, { doc })] : []));
    return Boolean(view);
  };
  const snapshot = snapshotOf(source);
  const showSnapshot = (key) => {
    if (!draw(snapshot.items)) return false;
    const date = formatDay(snapshot.fetchedAt);
    showStatus(status, date ? say(key, { date }) : say('live.api_saved_copy'));
    return true;
  };

  const url = textValue(ownValue(source, 'url')).trim();
  if (!url) {
    showStatus(status, say('blocks.sample_no_source'));
    return handle;
  }
  // View mode never reaches an API on the student's own computer, even on a localhost site.
  const policy = apiUrlPolicy(url, { pageHost: '', pageProtocol: ctx.pageProtocol || 'https:', mode: 'view' });
  if (policy.loopback) {
    if (!showSnapshot('blocks.api_saved_from_computer')) showStatus(status, say('live.api_unreachable'));
    return handle;
  }
  const host = policy.host || hostOf(url) || url;
  const failed = () => {
    const label = snapshot.fromLoopback ? 'blocks.api_saved_from_computer' : 'blocks.api_offline_copy';
    if (!showSnapshot(label)) showStatus(status, say('live.api_failed', { host }));
  };
  if (!policy.ok) {
    failed();
    return handle;
  }

  const storage = ctx.storage === undefined ? browserStorage('sessionStorage') : ctx.storage;
  const key = cacheKeyOf(block, source, ctx);
  const cached = readCache(storage, key, now());
  if (cached) {
    if (!draw(cached)) showStatus(status, say('blocks.api_empty'));
    else showStatus(status, '');
    return handle;
  }

  const result = await fetchJson(policy.url, {
    fetchImpl: ctx.fetchImpl, timeoutMs: limits.api_timeout_ms || 8000, maxChars: limits.api_max_chars || 512000,
    mode: 'view', pageHost: '', pageProtocol: ctx.pageProtocol || 'https:', now,
  });
  if (destroyed) return handle;
  if (!result.ok) {
    failed();
    return handle;
  }
  const items = mapItems(listIn(result.json, ownValue(source, 'list_path')), source, {
    limit, itemChars: limits.api_item_chars || 500, baseurl: ctx.baseurl, pageOrigin: ctx.pageOrigin,
    cookieDomain: cookieDomainOf(ctx), sourceUrl: policy.url,
  });
  writeCache(storage, key, items, now());
  if (draw(items)) showStatus(status, '');
  else showStatus(status, say('blocks.api_empty'));
  return handle;
}
