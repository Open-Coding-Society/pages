// A whitelisted virtual DOM for UI Builder pages. Renderers build trees with h(); toDOM turns a
// tree into nodes (createElement, setAttribute, createTextNode), toHTML into the HTML string of
// the page-file export and "Show HTML". Both apply the same tag and attribute allowlist, so a
// renderer bug or a hostile setting can never reach markup the allowlist doesn't name.
// strict (tests) throws on anything outside it; otherwise an element is unwrapped (its children
// stay) and an attribute dropped.
import { safeImage, safeLink } from './url-rules.js';

// Only objects made here are nodes. Specs are JSON from servers and other students, so a plain
// object shaped like a node (say {kind: 'liquid'}) must never be treated as one.
const NODES = new WeakSet();

export const TAGS = Object.freeze(new Set([
  'section', 'article', 'header', 'footer', 'nav', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4',
  'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'small', 'abbr', 'output', 'ul', 'ol', 'li', 'a',
  'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'pre',
  'code', 'hr', 'br', 'button', 'iframe', 'details', 'summary', 'blockquote', 'template', 'time',
]));
const VOID_TAGS = new Set(['img', 'hr', 'br']);
const BOOLEAN_ATTRS = new Set(['open', 'hidden']);
const FREE_ATTRS = new Set(['alt', 'title', 'datetime']);

export const SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-popups';
export const NEW_TAB_REL = 'noopener noreferrer nofollow';

const EXACT_VALUES = {
  target: ['_blank'],
  loading: ['lazy', 'eager'],
  referrerpolicy: ['no-referrer', 'strict-origin-when-cross-origin'],
  crossorigin: ['anonymous'],
  sandbox: [SANDBOX],
  allow: ['', 'fullscreen', 'fullscreen; picture-in-picture; encrypted-media'],
  scope: ['row', 'col', 'rowgroup', 'colgroup'],
  type: ['button'],
  tabindex: ['-1', '0'],
};
const VALUE_PATTERNS = {
  class: /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
  id: /^ui-[a-z0-9-]+$/,
  rel: /^[a-z]+(?: [a-z]+)*$/,
  role: /^[a-z]+$/,
  lang: /^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*$/,
  height: /^\d{1,5}$/,
  width: /^\d{1,5}$/,
  colspan: /^[1-9]\d{0,2}$/,
};
const ARIA_NAME = /^aria-[a-z]+$/;
const DATA_NAME = /^data-ui(?:-[a-z0-9]+)+$/;

// The only Liquid an export may carry: one include tag whose values can't open, close or quote
// anything. export.js builds these from validated settings; this is the backstop.
const INCLUDE_TAG = /^\{% include [a-z0-9_]+\.html(?: [a-z_]+="[A-Za-z0-9 _.:/?#=&-]*")* %\}$/;

// C0 controls other than tab, newline and carriage return, and DEL: never meaningful in a page.
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' };

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function brand(node) {
  NODES.add(node);
  return Object.freeze(node);
}

export function isVNode(value) {
  return value !== null && typeof value === 'object' && NODES.has(value);
}

function flatten(children, out = []) {
  for (const child of children) {
    if (Array.isArray(child)) flatten(child, out);
    else if (child !== null && child !== undefined && typeof child !== 'boolean') out.push(child);
  }
  return out;
}

// h('a', {class: 'ocs__btn', href}, 'Label'). Children are nodes, strings or numbers; arrays are
// flattened and null, undefined and booleans skipped, so `cond ? h(...) : null` just works.
export function h(tag, attrs, ...children) {
  if (attrs !== null && attrs !== undefined && (!isPlainObject(attrs) || isVNode(attrs))) {
    throw new TypeError(`vnode: attributes of <${String(tag)}> must be an object or null`);
  }
  const copy = Object.create(null);
  if (attrs) for (const name of Object.keys(attrs)) copy[name] = attrs[name];
  return brand({ kind: 'element', tag, attrs: Object.freeze(copy), children: Object.freeze(flatten(children)) });
}

// Rich text (the HTML subset of a `body` field). toDOM hands it to renderRich, toHTML to
// sanitizeRich; neither ever inserts the raw string.
export function rich(raw) {
  return brand({ kind: 'rich', raw: typeof raw === 'string' ? raw : '' });
}

// Raw Liquid for the page-file export only. toDOM refuses it, and only include tags pass.
export function liquid(text) {
  if (typeof text !== 'string' || !INCLUDE_TAG.test(text)) {
    throw new Error('vnode: liquid() takes one {% include file.html key="value" %} tag with plain values');
  }
  return brand({ kind: 'liquid', text });
}

// An HTML comment in the page-file export (a note where a live block can't run). toDOM skips it.
export function comment(text) {
  return brand({ kind: 'comment', text: typeof text === 'string' ? text : '' });
}

// Renders child, or fallback when rendering child throws (a block's error boundary). onError
// hears about the failure. In strict mode the error is rethrown so tests see it.
export function boundary(child, { fallback = null, onError = null } = {}) {
  return brand({ kind: 'boundary', child, fallback, onError });
}

function reject(strict, message) {
  if (strict) throw new Error(`vnode: ${message}`);
}

function urlAllowed(tag, name, value) {
  if (name === 'href') return safeLink(value, {}) !== null;
  // A same-origin frame with allow-scripts + allow-same-origin could lift its own sandbox, so an
  // iframe only ever loads https.
  if (tag === 'iframe') return /^https:/i.test(value) && safeImage(value, {}) !== null;
  return safeImage(value, {}) !== null;
}

function valueAllowed(tag, name, value) {
  if (ARIA_NAME.test(name) || DATA_NAME.test(name) || FREE_ATTRS.has(name)) return true;
  if (BOOLEAN_ATTRS.has(name)) return value === '';
  if (name === 'href' || name === 'src') return urlAllowed(tag, name, value);
  if (hasOwn(EXACT_VALUES, name)) return EXACT_VALUES[name].includes(value);
  if (hasOwn(VALUE_PATTERNS, name)) return VALUE_PATTERNS[name].test(value);
  return false;
}

// undefined: leave the attribute off. null: not allowed. A string: the value to write.
function attributeValue(tag, name, raw) {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === 'boolean') {
    if (ARIA_NAME.test(name)) return String(raw);
    if (!raw) return undefined;
    return BOOLEAN_ATTRS.has(name) || DATA_NAME.test(name) ? '' : null;
  }
  let value;
  if (typeof raw === 'string') value = raw;
  else if (typeof raw === 'number' && Number.isFinite(raw)) value = String(raw);
  else return null;
  return valueAllowed(tag, name, value) ? value : null;
}

// The attributes to write, in order. A new-tab link always gets rel "noopener noreferrer nofollow".
function cleanAttributes(node, strict) {
  const out = [];
  for (const name of Object.keys(node.attrs)) {
    const value = attributeValue(node.tag, name, node.attrs[name]);
    if (value === null) reject(strict, `attribute ${name} on <${node.tag}> is not allowed`);
    else if (value !== undefined) out.push([name, value]);
  }
  if (!out.some(([name]) => name === 'target')) return out;
  const kept = out.filter(([name]) => name !== 'rel');
  kept.splice(kept.findIndex(([name]) => name === 'target') + 1, 0, ['rel', NEW_TAB_REL]);
  return kept;
}

function textOfChild(child) {
  if (typeof child === 'string') return child.replace(CONTROL_CHARS, '');
  if (typeof child === 'number') return Number.isFinite(child) ? String(child) : '';
  return null;
}

/* ---------- toDOM ---------- */

function appendElement(parent, node, opts) {
  if (typeof node.tag !== 'string' || !TAGS.has(node.tag)) {
    reject(opts.strict, `tag <${String(node.tag)}> is not allowed`);
    appendChildren(parent, node.children, opts);
    return;
  }
  const element = opts.doc.createElement(node.tag);
  for (const [name, value] of cleanAttributes(node, opts.strict)) element.setAttribute(name, value);
  if (VOID_TAGS.has(node.tag)) {
    if (node.children.length) reject(opts.strict, `<${node.tag}> can't have children`);
  } else {
    appendChildren(element, node.children, opts);
  }
  parent.appendChild(element);
}

function appendBoundary(parent, node, opts) {
  if (opts.strict) {
    appendNode(parent, node.child, opts);
    return;
  }
  // Build the child off to the side so a failure leaves nothing half-rendered behind.
  const holder = opts.doc.createDocumentFragment();
  try {
    appendNode(holder, node.child, opts);
  } catch (error) {
    if (typeof node.onError === 'function') node.onError(error);
    appendNode(parent, node.fallback, opts);
    return;
  }
  parent.appendChild(holder);
}

function appendNode(parent, node, opts) {
  if (node === null || node === undefined || typeof node === 'boolean') return;
  if (Array.isArray(node)) {
    appendChildren(parent, node, opts);
    return;
  }
  const text = textOfChild(node);
  if (text !== null) {
    if (text) parent.appendChild(opts.doc.createTextNode(text));
    return;
  }
  if (!isVNode(node)) {
    reject(opts.strict, 'a child is not a node or a string');
    return;
  }
  switch (node.kind) {
    case 'element': appendElement(parent, node, opts); return;
    case 'rich':
      if (typeof opts.renderRich !== 'function') throw new Error('vnode: rich text needs a renderRich hook');
      opts.renderRich(parent, node.raw);
      return;
    case 'liquid': throw new Error('vnode: liquid() is only for the page-file export');
    case 'comment': reject(opts.strict, 'comment() is only for the page-file export'); return;
    case 'boundary': appendBoundary(parent, node, opts); return;
    default: reject(opts.strict, `unknown node kind ${String(node.kind)}`);
  }
}

function appendChildren(parent, children, opts) {
  for (const child of children) appendNode(parent, child, opts);
}

// Returns the single node the tree renders to, or a DocumentFragment when it renders to several
// (or none). doc defaults to the page's document; the canvas passes its own.
export function toDOM(vnode, { doc = globalThis.document, renderRich, strict = false } = {}) {
  if (!doc || typeof doc.createElement !== 'function') throw new Error('vnode: toDOM needs a document');
  const opts = { doc, renderRich, strict };
  const fragment = doc.createDocumentFragment();
  appendNode(fragment, vnode, opts);
  if (fragment.childNodes.length !== 1) return fragment;
  const only = fragment.firstChild;
  fragment.removeChild(only);
  return only;
}

/* ---------- toHTML ---------- */

export function escapeHTML(value) {
  return String(value).replace(CONTROL_CHARS, '').replace(/[&<>"'{}]/g, (c) => HTML_ESCAPES[c]);
}

// Braces become entities so Liquid never sees {{ or {% in author text; the browser shows the
// same characters.
function braceSafe(html) {
  return String(html).replace(CONTROL_CHARS, '').replace(/[{}]/g, (c) => HTML_ESCAPES[c]);
}

function writeElement(out, node, opts) {
  if (typeof node.tag !== 'string' || !TAGS.has(node.tag)) {
    reject(opts.strict, `tag <${String(node.tag)}> is not allowed`);
    writeChildren(out, node.children, opts);
    return;
  }
  let open = `<${node.tag}`;
  for (const [name, value] of cleanAttributes(node, opts.strict)) {
    open += value === '' && (BOOLEAN_ATTRS.has(name) || DATA_NAME.test(name)) ? ` ${name}` : ` ${name}="${escapeHTML(value)}"`;
  }
  out.push(`${open}>`);
  if (VOID_TAGS.has(node.tag)) {
    if (node.children.length) reject(opts.strict, `<${node.tag}> can't have children`);
    return;
  }
  writeChildren(out, node.children, opts);
  out.push(`</${node.tag}>`);
}

function writeBoundary(out, node, opts) {
  if (opts.strict) {
    writeNode(out, node.child, opts);
    return;
  }
  const part = [];
  try {
    writeNode(part, node.child, opts);
  } catch (error) {
    if (typeof node.onError === 'function') node.onError(error);
    writeNode(out, node.fallback, opts);
    return;
  }
  out.push(part.join(''));
}

function writeNode(out, node, opts) {
  if (node === null || node === undefined || typeof node === 'boolean') return;
  if (Array.isArray(node)) {
    writeChildren(out, node, opts);
    return;
  }
  const text = textOfChild(node);
  if (text !== null) {
    out.push(escapeHTML(text));
    return;
  }
  if (!isVNode(node)) {
    reject(opts.strict, 'a child is not a node or a string');
    return;
  }
  switch (node.kind) {
    case 'element': writeElement(out, node, opts); return;
    case 'rich':
      if (typeof opts.sanitizeRich !== 'function') throw new Error('vnode: rich text needs a sanitizeRich hook');
      out.push(braceSafe(opts.sanitizeRich(node.raw) ?? ''));
      return;
    case 'liquid': out.push(node.text); return;
    // With < and > escaped the text can't end the comment early.
    case 'comment': out.push(`<!-- ${escapeHTML(node.text)} -->`); return;
    case 'boundary': writeBoundary(out, node, opts); return;
    default: reject(opts.strict, `unknown node kind ${String(node.kind)}`);
  }
}

function writeChildren(out, children, opts) {
  for (const child of children) writeNode(out, child, opts);
}

// Escapes & < > " ' in text and attribute values, and { } everywhere except inside liquid().
export function toHTML(vnode, { sanitizeRich, strict = false } = {}) {
  const out = [];
  writeNode(out, vnode, { sanitizeRich, strict });
  return out.join('');
}
