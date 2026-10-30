// A tiny DOM for Node tests: only what vnode.js toDOM and rich-content.js use. The document records
// every call, so a test can show toDOM builds nodes with createElement, setAttribute and
// createTextNode only; setting innerHTML (HTML parsing) throws.
const VOID = new Set(['img', 'hr', 'br']);

const escapeText = (text) => String(text).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const escapeAttr = (text) => String(text).replace(/[&"]/g, (c) => ({ '&': '&amp;', '"': '&quot;' })[c]);

class FakeNode {
  constructor(doc, nodeType) {
    this.ownerDocument = doc;
    this.nodeType = nodeType;
    this.parentNode = null;
    this.childNodes = [];
  }

  get firstChild() { return this.childNodes[0] || null; }

  get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; }

  get textContent() { return this.childNodes.map((child) => child.textContent).join(''); }

  appendChild(child) {
    return this.insertBefore(child, null);
  }

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

  querySelectorAll(selector) {
    if (selector !== '*') throw new Error(`fake DOM: only querySelectorAll('*') is supported, got ${selector}`);
    const out = [];
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === 1) {
          out.push(child);
          walk(child);
        }
      }
    };
    walk(this);
    return out;
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
  }

  setAttribute(name, value) {
    this.ownerDocument.calls.push(['setAttribute', name]);
    this.attributes.set(String(name), String(value));
  }

  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }

  hasAttribute(name) { return this.attributes.has(name); }

  removeAttribute(name) { this.attributes.delete(name); }

  getAttributeNames() { return [...this.attributes.keys()]; }

  get outerHTML() { return serialize(this); }
}

function serialize(node) {
  if (node.nodeType === 3) return escapeText(node.nodeValue);
  if (node.nodeType !== 1) return node.innerHTML;
  const attrs = [...node.attributes].map(([name, value]) => ` ${name}="${escapeAttr(value)}"`).join('');
  if (VOID.has(node.localName)) return `<${node.localName}${attrs}>`;
  return `<${node.localName}${attrs}>${node.childNodes.map(serialize).join('')}</${node.localName}>`;
}

export function createFakeDocument() {
  const doc = {
    calls: [],
    createElement(tag) {
      doc.calls.push(['createElement', tag]);
      return new FakeElement(doc, tag);
    },
    createTextNode(text) {
      doc.calls.push(['createTextNode']);
      return new FakeText(doc, text);
    },
    createDocumentFragment() {
      doc.calls.push(['createDocumentFragment']);
      return new FakeNode(doc, 11);
    },
  };
  return doc;
}

// Every element under (and including) root, for structural assertions.
export function elementsOf(root) {
  const all = root.nodeType === 1 ? [root] : [];
  return all.concat(root.querySelectorAll('*'));
}

// Builds a fake subtree from [tag, attrs, ...children] arrays (strings are text), the way a test
// stands in for what rich-text.js would produce.
export function build(doc, spec) {
  if (typeof spec === 'string') return doc.createTextNode(spec);
  const [tag, attrs = {}, ...children] = spec;
  const element = doc.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) element.attributes.set(name, String(value));
  for (const child of children) element.appendChild(build(doc, child));
  return element;
}
