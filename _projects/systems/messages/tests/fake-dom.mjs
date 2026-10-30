// A small stand-in for the browser DOM: enough for the Messages modules and the rich-text
// composer to build their elements and handle events under Node, which has no DOM (and
// this repo has no npm, so no jsdom). Every listener is kept in a list, so a test can
// check that destroy() takes back what it added. Events don't bubble: a test fires one
// on the element that listens for it. A selector the fake can't read throws, so a module
// that starts using one fails loudly here instead of matching nothing.

const kebab = key => key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
const captureOf = options => (typeof options === 'boolean' ? options : Boolean(options?.capture));

export class FakeEventTarget {
  constructor() {
    this.listeners = [];
  }

  addEventListener(type, handler, options) {
    const capture = captureOf(options);
    if (this.listeners.some(l => l.type === type && l.handler === handler && l.capture === capture)) return;
    this.listeners.push({ type, handler, capture, once: typeof options === 'object' && Boolean(options?.once) });
  }

  removeEventListener(type, handler, options) {
    const capture = captureOf(options);
    this.listeners = this.listeners.filter(l => !(l.type === type && l.handler === handler && l.capture === capture));
  }

  dispatchEvent(event) {
    this.listeners.filter(l => l.type === event.type).forEach(l => {
      if (l.once) this.removeEventListener(l.type, l.handler, l.capture);
      l.handler.call(this, event);
    });
    return !event.defaultPrevented;
  }

  listenerCount(type) {
    return this.listeners.filter(l => type === undefined || l.type === type).length;
  }
}

// An event a test fires by hand. Node's own Event works too where only `type` matters.
export function fakeEvent(type, props = {}) {
  return {
    type,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    ...props,
  };
}

class FakeNode extends FakeEventTarget {
  constructor(ownerDocument) {
    super();
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
  }

  get firstChild() { return this.childNodes[0] ?? null; }

  get lastChild() { return this.childNodes[this.childNodes.length - 1] ?? null; }

  get previousSibling() { return this.sibling(-1); }

  get nextSibling() { return this.sibling(1); }

  get parentElement() { return this.parentNode?.nodeType === 1 ? this.parentNode : null; }

  get children() { return this.childNodes.filter(node => node.nodeType === 1); }

  sibling(step) {
    if (!this.parentNode) return null;
    const list = this.parentNode.childNodes;
    return list[list.indexOf(this) + step] ?? null;
  }

  get textContent() { return this.childNodes.map(node => node.textContent).join(''); }

  set textContent(value) {
    this.replaceChildren();
    const text = String(value ?? '');
    if (text) this.appendChild(this.ownerDocument.createTextNode(text));
  }

  appendChild(node) { return this.insertBefore(node, null); }

  insertBefore(node, reference) {
    if (node.nodeType === 11) {
      [...node.childNodes].forEach(child => this.insertBefore(child, reference));
      return node;
    }
    if (reference && reference.parentNode !== this) throw new Error('fake DOM: insertBefore needs a child as reference');
    node.remove();
    node.parentNode = this;
    const at = reference ? this.childNodes.indexOf(reference) : this.childNodes.length;
    this.childNodes.splice(at, 0, node);
    return node;
  }

  removeChild(node) {
    if (node.parentNode !== this) throw new Error('fake DOM: removeChild needs a child');
    node.remove();
    return node;
  }

  remove() {
    if (!this.parentNode) return;
    const list = this.parentNode.childNodes;
    list.splice(list.indexOf(this), 1);
    this.parentNode = null;
  }

  append(...nodes) {
    nodes.forEach(node => this.appendChild(typeof node === 'string' ? this.ownerDocument.createTextNode(node) : node));
  }

  replaceChildren(...nodes) {
    [...this.childNodes].forEach(child => child.remove());
    this.append(...nodes);
  }

  contains(node) {
    for (let current = node; current; current = current.parentNode) {
      if (current === this) return true;
    }
    return false;
  }

  normalize() {}

  // A failing assertion prints this, not the whole document the node hangs from.
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.nodeType === 1 ? serialize(this).slice(0, 200) : `#${this.nodeName}`;
  }
}

class FakeText extends FakeNode {
  constructor(ownerDocument, value) {
    super(ownerDocument);
    this.nodeType = 3;
    this.nodeName = '#text';
    this.nodeValue = String(value);
  }

  get textContent() { return this.nodeValue; }

  set textContent(value) { this.nodeValue = String(value); }
}

class FakeFragment extends FakeNode {
  constructor(ownerDocument) {
    super(ownerDocument);
    this.nodeType = 11;
    this.nodeName = '#document-fragment';
  }
}

// Commas split a selector list only outside [...] and quotes.
function splitSelectorList(selector) {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = null;
  for (let i = 0; i < selector.length; i += 1) {
    const ch = selector[i];
    if (ch === '\\') {
      current += ch + (selector[i + 1] ?? '');
      i += 1;
    } else if (quote) {
      if (ch === quote) quote = null;
      current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      if (ch === '[') depth += 1;
      if (ch === ']') depth -= 1;
      current += ch;
    }
  }
  parts.push(current.trim());
  return parts;
}

// One compound selector: tag, .classes and [attr], [attr="v"], [attr*="v"], [attr^="v"].
function parseCompound(text) {
  let rest = text;
  const tag = /^[a-zA-Z][\w-]*/.exec(rest)?.[0] ?? null;
  if (tag) rest = rest.slice(tag.length);
  const classes = [];
  const attributes = [];
  while (rest) {
    const cls = /^\.([\w-]+)/.exec(rest);
    const attr = /^\[([\w-]+)(?:([*^$]?=)"((?:[^"\\]|\\.)*)")?\]/.exec(rest);
    if (!cls && !attr) throw new Error(`fake DOM: unsupported selector "${text}"`);
    if (cls) {
      classes.push(cls[1]);
    } else {
      attributes.push({ name: attr[1].toLowerCase(), operator: attr[2] ?? null, value: attr[3]?.replace(/\\(.)/g, '$1') ?? null });
    }
    rest = rest.slice((cls || attr)[0].length);
  }
  return { tag: tag ? tag.toUpperCase() : null, classes, attributes };
}

const parseSelector = selector => splitSelectorList(selector).map(parseCompound);

function matchesCompound(element, { tag, classes, attributes }) {
  if (tag && element.tagName !== tag) return false;
  if (!classes.every(name => element.classList.contains(name))) return false;
  return attributes.every(({ name, operator, value }) => {
    const actual = element.getAttribute(name);
    if (actual === null) return false;
    if (operator === null) return true;
    if (operator === '=') return actual === value;
    if (operator === '*=') return actual.includes(value);
    if (operator === '^=') return actual.startsWith(value);
    return actual.endsWith(value);
  });
}

function walk(node, visit) {
  node.childNodes.forEach(child => {
    if (child.nodeType !== 1) return;
    visit(child);
    walk(child, visit);
  });
}

function serialize(node) {
  if (node.nodeType === 3) return node.nodeValue;
  if (node.nodeType !== 1) return '';
  const tag = node.tagName.toLowerCase();
  const attributes = [...node.attributes].map(([name, value]) => ` ${name}="${value}"`).join('');
  return `<${tag}${attributes}>${node.childNodes.map(serialize).join('')}</${tag}>`;
}

class FakeElement extends FakeNode {
  constructor(ownerDocument, tagName) {
    super(ownerDocument);
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.nodeName = this.tagName;
    this.attributes = new Map();
    this.style = {};
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this.clientHeight = 0;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
    this.disabled = false;
    this.value = '';
    this.options = [];
  }

  setAttribute(name, value) { this.attributes.set(String(name).toLowerCase(), String(value)); }

  getAttribute(name) { return this.attributes.get(String(name).toLowerCase()) ?? null; }

  hasAttribute(name) { return this.attributes.has(String(name).toLowerCase()); }

  removeAttribute(name) { this.attributes.delete(String(name).toLowerCase()); }

  get id() { return this.getAttribute('id') ?? ''; }

  set id(value) { this.setAttribute('id', value); }

  get className() { return this.getAttribute('class') ?? ''; }

  set className(value) { this.setAttribute('class', value); }

  get hidden() { return this.hasAttribute('hidden'); }

  set hidden(value) {
    if (value) this.setAttribute('hidden', '');
    else this.removeAttribute('hidden');
  }

  get classList() {
    const read = () => this.className.split(/\s+/).filter(Boolean);
    const write = names => { this.className = [...new Set(names)].join(' '); };
    return {
      add: (...names) => write([...read(), ...names]),
      remove: (...names) => write(read().filter(name => !names.includes(name))),
      toggle: (name, force) => {
        const on = force === undefined ? !read().includes(name) : Boolean(force);
        write(on ? [...read(), name] : read().filter(other => other !== name));
        return on;
      },
      contains: name => read().includes(name),
      [Symbol.iterator]: () => read()[Symbol.iterator](),
    };
  }

  get dataset() {
    const attribute = key => `data-${kebab(String(key))}`;
    return new Proxy({}, {
      get: (_, key) => (typeof key === 'string' ? this.getAttribute(attribute(key)) ?? undefined : undefined),
      set: (_, key, value) => {
        this.setAttribute(attribute(key), value);
        return true;
      },
      has: (_, key) => this.hasAttribute(attribute(key)),
      deleteProperty: (_, key) => {
        this.removeAttribute(attribute(key));
        return true;
      },
    });
  }

  // Kept as text: the modules under test only set it to fixed labels or clear it.
  get innerHTML() { return this.childNodes.map(serialize).join(''); }

  set innerHTML(value) {
    this.replaceChildren();
    const html = String(value ?? '');
    if (html) this.appendChild(this.ownerDocument.createTextNode(html));
  }

  add(option) { this.options.push(option); } // a <select>'s add()

  focus() { this.ownerDocument.activeElement = this; }

  getBoundingClientRect() {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }

  querySelectorAll(selector) {
    const compounds = parseSelector(selector);
    const found = [];
    walk(this, element => {
      if (compounds.some(compound => matchesCompound(element, compound))) found.push(element);
    });
    return found;
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }

  matches(selector) { return parseSelector(selector).some(compound => matchesCompound(this, compound)); }

  closest(selector) {
    for (let element = this; element?.nodeType === 1; element = element.parentNode) {
      if (element.matches(selector)) return element;
    }
    return null;
  }
}

class FakeDocument extends FakeNode {
  constructor() {
    super(null);
    this.ownerDocument = this;
    this.nodeType = 9;
    this.visibilityState = 'visible';
    this.activeElement = null;
    this.commands = []; // every execCommand call, by name
    this.commandResult = () => true; // what execCommand answers; a test can say false
    this.scriptsLoad = true; // whether a <script> added to <head> loads
    this.documentElement = this.createElement('html');
    this.documentElement.clientWidth = 1024;
    this.documentElement.clientHeight = 768;
    this.head = this.createElement('head');
    this.body = this.createElement('body');
    this.documentElement.append(this.head, this.body);
    this.appendChild(this.documentElement);
    // The browser loads a script added to <head>; here it "loads" on the next microtask.
    const appendToHead = this.head.appendChild.bind(this.head);
    this.head.appendChild = node => {
      appendToHead(node);
      if (node.tagName === 'SCRIPT') queueMicrotask(() => (this.scriptsLoad ? node.onload?.() : node.onerror?.()));
      return node;
    };
  }

  createElement(tag) { return new FakeElement(this, tag); }

  createTextNode(text) { return new FakeText(this, text); }

  createDocumentFragment() { return new FakeFragment(this); }

  getSelection() {
    return { rangeCount: 0, anchorNode: null, removeAllRanges() {}, addRange() {} };
  }

  execCommand(command) {
    this.commands.push(command);
    return this.commandResult(command);
  }

  queryCommandState() { return false; }
}

// Puts a fresh fake document and window on globalThis, with the few other browser globals
// the modules use. Returns both so a test can count listeners and fire events.
export function installFakeDom() {
  const document = new FakeDocument();
  const window = new FakeEventTarget();
  globalThis.document = document;
  globalThis.window = window;
  globalThis.CSS = { escape: value => String(value).replace(/["\\]/g, '\\$&') };
  globalThis.Option = class {
    constructor(text = '', value = text) {
      this.text = text;
      this.value = value;
    }
  };
  return { document, window };
}

// Lets every pending promise and queued microtask run.
export const settle = () => new Promise(resolve => { setTimeout(resolve, 0); });
