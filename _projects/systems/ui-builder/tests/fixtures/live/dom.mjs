// A small browser DOM for the runtime tests (blocks-live, blocks-project, viewer, gallery): nodes,
// attributes, simple CSS selectors (tags, #ids, .classes, [attr], [attr="value"], descendant
// spaces and comma lists), bubbling events, focus, and the properties the modules set (hidden,
// disabled, value, textContent). No layout and no HTML parsing: innerHTML can't be set.
const VOID = new Set(['img', 'hr', 'br', 'input']);
const escapeText = (text) => String(text).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const escapeAttr = (text) => String(text).replace(/[&"]/g, (c) => ({ '&': '&amp;', '"': '&quot;' })[c]);

/* ---------- selectors ---------- */

function parseCompound(text) {
  const parts = { tag: null, id: null, classes: [], attrs: [] };
  const token = /([a-z][a-z0-9-]*|\*)|#([A-Za-z0-9_-]+)|\.([A-Za-z0-9_-]+)|\[([a-z0-9-]+)(?:="([^"]*)")?\]/y;
  let index = 0;
  while (index < text.length) {
    token.lastIndex = index;
    const match = token.exec(text);
    if (!match || (match[1] !== undefined && index !== 0)) throw new Error(`fake DOM: unsupported selector ${text}`);
    if (match[1] !== undefined) parts.tag = match[1] === '*' ? null : match[1];
    else if (match[2]) parts.id = match[2];
    else if (match[3]) parts.classes.push(match[3]);
    else parts.attrs.push([match[4], match[5]]);
    index = token.lastIndex;
  }
  return parts;
}

function parseSelector(selector) {
  return String(selector).split(',').map((one) => one.trim().split(/\s+/).map(parseCompound));
}

function matchesCompound(element, parts) {
  if (element.nodeType !== 1) return false;
  if (parts.tag && element.localName !== parts.tag) return false;
  if (parts.id && element.getAttribute('id') !== parts.id) return false;
  const classes = String(element.getAttribute('class') || '').split(/\s+/);
  if (parts.classes.some((name) => !classes.includes(name))) return false;
  return parts.attrs.every(([name, value]) => element.hasAttribute(name) && (value === undefined || element.getAttribute(name) === value));
}

function matchesChain(element, chain) {
  if (!matchesCompound(element, chain[chain.length - 1])) return false;
  let ancestor = element.parentNode;
  for (let index = chain.length - 2; index >= 0; index -= 1) {
    while (ancestor && !matchesCompound(ancestor, chain[index])) ancestor = ancestor.parentNode;
    if (!ancestor) return false;
    ancestor = ancestor.parentNode;
  }
  return true;
}

const matches = (element, selector) => parseSelector(selector).some((chain) => matchesChain(element, chain));

/* ---------- nodes ---------- */

class FakeNode {
  constructor(doc, nodeType) {
    this.ownerDocument = doc;
    this.nodeType = nodeType;
    this.parentNode = null;
    this.childNodes = [];
    this.listeners = new Map();
  }

  get firstChild() { return this.childNodes[0] || null; }

  get children() { return this.childNodes.filter((node) => node.nodeType === 1); }

  get textContent() { return this.childNodes.map((child) => child.textContent).join(''); }

  set textContent(text) {
    this.replaceChildren();
    if (text !== '' && text !== null && text !== undefined) this.appendChild(this.ownerDocument.createTextNode(String(text)));
  }

  appendChild(child) { return this.insertBefore(child, null); }

  insertBefore(child, reference) {
    if (child.nodeType === 11) {
      for (const inner of [...child.childNodes]) this.insertBefore(inner, reference);
      return child;
    }
    if (child.parentNode) child.parentNode.removeChild(child);
    const index = reference ? this.childNodes.indexOf(reference) : -1;
    if (index === -1) this.childNodes.push(child);
    else this.childNodes.splice(index, 0, child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index === -1) throw new Error('fake DOM: not a child');
    this.childNodes.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  #nodes(items) {
    return items.map((item) => (typeof item === 'string' ? this.ownerDocument.createTextNode(item) : item));
  }

  append(...items) { for (const node of this.#nodes(items)) this.appendChild(node); }

  replaceChildren(...items) {
    for (const child of [...this.childNodes]) this.removeChild(child);
    this.append(...items);
  }

  remove() { if (this.parentNode) this.parentNode.removeChild(this); }

  replaceWith(...items) {
    const parent = this.parentNode;
    if (!parent) return;
    for (const node of this.#nodes(items)) parent.insertBefore(node, this);
    parent.removeChild(this);
  }

  after(...items) {
    const parent = this.parentNode;
    const next = parent.childNodes[parent.childNodes.indexOf(this) + 1] || null;
    for (const node of this.#nodes(items)) parent.insertBefore(node, next);
  }

  contains(node) {
    for (let at = node; at; at = at.parentNode) if (at === this) return true;
    return false;
  }

  #walk(out) {
    for (const child of this.childNodes) {
      if (child.nodeType === 1) {
        out.push(child);
        child.#walk(out);
      }
    }
    return out;
  }

  querySelectorAll(selector) {
    const all = this.#walk([]);
    return selector === '*' ? all : all.filter((element) => matches(element, selector));
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    if (this.listeners.has(type)) this.listeners.get(type).delete(listener);
  }

  listenerCount(type) { return this.listeners.has(type) ? this.listeners.get(type).size : 0; }

  dispatchEvent(event) {
    if (!event.target) event.target = this;
    for (let at = this; at; at = event.bubbles === false ? null : at.parentNode) {
      for (const listener of [...(at.listeners.get(event.type) || [])]) listener.call(at, event);
    }
    return !event.defaultPrevented;
  }

  get innerHTML() { return this.childNodes.map(serialize).join(''); }

  set innerHTML(_) { throw new Error('fake DOM: innerHTML must not be set'); }
}

class FakeText extends FakeNode {
  constructor(doc, text) {
    super(doc, 3);
    this.nodeValue = String(text);
  }

  get textContent() { return this.nodeValue; }
}

class FakeElement extends FakeNode {
  constructor(doc, tag) {
    super(doc, 1);
    this.localName = String(tag).toLowerCase();
    this.tagName = this.localName.toUpperCase();
    this.attributes = new Map();
    this.valueText = '';
    // A <template>'s content, for createKanbanSection-style fakes.
    if (this.localName === 'template') this.content = doc.createDocumentFragment();
  }

  setAttribute(name, value) { this.attributes.set(String(name), String(value)); }

  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }

  hasAttribute(name) { return this.attributes.has(name); }

  removeAttribute(name) { this.attributes.delete(name); }

  getAttributeNames() { return [...this.attributes.keys()]; }

  get id() { return this.getAttribute('id') || ''; }

  set id(value) { this.setAttribute('id', value); }

  get className() { return this.getAttribute('class') || ''; }

  set className(value) { this.setAttribute('class', value); }

  get hidden() { return this.hasAttribute('hidden'); }

  set hidden(on) { if (on) this.setAttribute('hidden', ''); else this.removeAttribute('hidden'); }

  get disabled() { return this.hasAttribute('disabled'); }

  set disabled(on) { if (on) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

  get value() {
    if (this.localName === 'select') {
      const options = this.querySelectorAll('option');
      const chosen = options.find((option) => option.hasAttribute('selected')) || options[0];
      return chosen ? chosen.getAttribute('value') || '' : '';
    }
    return this.valueText;
  }

  set value(text) {
    if (this.localName === 'select') {
      for (const option of this.querySelectorAll('option')) option.removeAttribute('selected');
      const match = this.querySelectorAll('option').find((option) => option.getAttribute('value') === String(text));
      if (match) match.setAttribute('selected', '');
      return;
    }
    this.valueText = String(text);
  }

  closest(selector) {
    for (let at = this; at && at.nodeType === 1; at = at.parentNode) if (matches(at, selector)) return at;
    return null;
  }

  matches(selector) { return matches(this, selector); }

  focus() { this.ownerDocument.activeElement = this; }

  click() { this.dispatchEvent(createEvent('click')); }

  get outerHTML() { return serialize(this); }
}

function serialize(node) {
  if (node.nodeType === 3) return escapeText(node.nodeValue);
  if (node.nodeType !== 1) return node.childNodes.map(serialize).join('');
  const attrs = [...node.attributes].map(([name, value]) => ` ${name}="${escapeAttr(value)}"`).join('');
  if (VOID.has(node.localName)) return `<${node.localName}${attrs}>`;
  return `<${node.localName}${attrs}>${node.childNodes.map(serialize).join('')}</${node.localName}>`;
}

export function createEvent(type, extra = {}) {
  return {
    type, bubbles: true, defaultPrevented: false, target: null,
    preventDefault() { this.defaultPrevented = true; },
    ...extra,
  };
}

export function createDocument() {
  const doc = new FakeNode(null, 9);
  doc.ownerDocument = doc;
  doc.title = '';
  doc.activeElement = null;
  doc.createElement = (tag) => new FakeElement(doc, tag);
  doc.createTextNode = (text) => new FakeText(doc, text);
  doc.createDocumentFragment = () => new FakeNode(doc, 11);
  doc.getElementById = (id) => doc.querySelector(`#${id}`);
  doc.importNode = (node, deep) => cloneNode(doc, node, deep);
  doc.body = doc.createElement('body');
  doc.appendChild(doc.body);
  return doc;
}

function cloneNode(doc, node, deep) {
  if (node.nodeType === 3) return doc.createTextNode(node.nodeValue);
  const copy = doc.createElement(node.localName);
  for (const [name, value] of node.attributes) copy.setAttribute(name, value);
  if (deep) for (const child of node.childNodes) copy.appendChild(cloneNode(doc, child, true));
  return copy;
}

// A window whose top is itself unless framed; records history.replaceState and listeners.
export function createWindow(doc, { href = 'https://pages.opencodingsociety.com/ui-builder/view/', framed = false } = {}) {
  const url = new URL(href);
  const win = new FakeNode(doc, 0);
  const replaced = [];
  win.self = win;
  win.top = framed ? {} : win;
  win.location = {
    get href() { return url.href; },
    get origin() { return url.origin; },
    get protocol() { return url.protocol; },
    get pathname() { return url.pathname; },
    get search() { return url.search; },
    get hash() { return url.hash; },
    assigned: [],
    assign(next) { this.assigned.push(next); },
  };
  win.history = {
    state: null,
    replaced,
    replaceState(state, title, next) {
      replaced.push(next);
      const moved = new URL(next, url);
      url.search = moved.search;
      url.hash = moved.hash;
    },
  };
  doc.defaultView = win;
  return win;
}

export function text(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

// Lets every queued promise callback run (several rounds: mounts await one another).
export async function settle(rounds = 20) {
  for (let index = 0; index < rounds; index += 1) await new Promise((resolve) => setImmediate(resolve));
}

// A Storage with a size cap (in characters) that throws QuotaExceededError past it.
export function createStorage({ cap = Infinity, broken = false } = {}) {
  const items = new Map();
  const fail = () => { throw Object.assign(new Error('blocked'), { name: 'SecurityError' }); };
  return {
    items,
    get length() { if (broken) fail(); return items.size; },
    key(index) { if (broken) fail(); return [...items.keys()][index] ?? null; },
    getItem(key) { if (broken) fail(); return items.has(key) ? items.get(key) : null; },
    setItem(key, value) {
      if (broken) fail();
      const size = [...items].reduce((sum, [name, stored]) => sum + (name === key ? 0 : name.length + stored.length), 0) + key.length + String(value).length;
      if (size > cap) throw Object.assign(new Error('full'), { name: 'QuotaExceededError', code: 22 });
      items.set(key, String(value));
    },
    removeItem(key) { if (broken) fail(); items.delete(key); },
  };
}
