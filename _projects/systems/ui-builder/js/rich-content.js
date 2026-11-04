// Rich text for UI Builder pages: assets/js/chat/rich-text.js sanitizes a `body` field to its small
// HTML subset, then every element is checked again here. The page passes the rich-text module in
// (it is never imported, so this file stays loadable in Node and the canvas uses its own copy).
// secureRichTree works on any DOM-like tree, so Node tests cover it with a small fake.
import { isLoopbackHost, safeLink } from './url-rules.js';
import { NEW_TAB_REL } from './vnode.js';

// What rich-text.js emits: inline formatting, lists, line breaks, its font/size spans and links.
const RICH_TAGS = new Set(['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'ul', 'ol', 'li', 'br', 'span', 'a']);
const SPAN_CLASS = /^rt-(?:font-(?:serif|mono)|size-(?:sm|lg|xl))$/;
const LINK_ATTRS = new Set(['href', 'target', 'rel']);
const SPAN_ATTRS = new Set(['class']);
const NO_ATTRS = new Set();

function unwrap(element) {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  parent.removeChild(element);
}

function keepOnly(element, allowed) {
  const names = typeof element.getAttributeNames === 'function' ? element.getAttributeNames() : [];
  for (const name of names) if (!allowed.has(name)) element.removeAttribute(name);
}

function secureSpan(element) {
  keepOnly(element, SPAN_ATTRS);
  const classes = String(element.getAttribute('class') || '').split(/\s+/).filter((c) => SPAN_CLASS.test(c));
  if (classes.length) element.setAttribute('class', classes.join(' '));
  else unwrap(element);
}

// Links must be https or mailto (rich-text.js also lets http through); the rest become their text.
// So does a link to the reader's own computer (localhost, 127.x, [::1], [::] or 127.x mapped into
// IPv6, in any spelling the URL parser turns into one, such as [::ffff:7f00:1]): it can only reach
// the visitor's machine. Publish refuses such links, but rich-text.js also turns addresses typed as
// plain text into links when it draws the page.
function secureLink(element, { baseurl, pageOrigin }) {
  keepOnly(element, LINK_ATTRS);
  const link = safeLink(element.getAttribute('href'), { baseurl, pageOrigin });
  if (!link || !/^(?:https:|mailto:)/i.test(link.href) || (link.host && isLoopbackHost(link.host))) {
    unwrap(element);
    return;
  }
  element.setAttribute('href', link.href);
  element.setAttribute('target', '_blank');
  element.setAttribute('rel', NEW_TAB_REL);
}

// Unwraps every element outside the rich subset, strips attributes the subset doesn't use, and
// re-checks links. Needs only querySelectorAll, tagName, attribute methods and child moves.
export function secureRichTree(root, { baseurl = '', pageOrigin } = {}) {
  // A static list: unwrapping moves children up, and they are still visited later in the list.
  const elements = Array.from(root.querySelectorAll('*'));
  for (const element of elements) {
    const tag = String(element.tagName || '').toLowerCase();
    if (!RICH_TAGS.has(tag)) unwrap(element);
    else if (tag === 'a') secureLink(element, { baseurl, pageOrigin });
    else if (tag === 'span') secureSpan(element);
    else keepOnly(element, NO_ATTRS);
  }
  return root;
}

// Hooks for vnode.js: renderRich(container, raw) for toDOM (canvas, viewer) and sanitizeRich(raw)
// for toHTML (page-file export, Show HTML), returning the cleaned HTML string.
export function createRichHooks({ richText, baseurl = '', pageOrigin, doc = globalThis.document } = {}) {
  if (!richText || typeof richText.renderRichMessage !== 'function') {
    throw new Error('UI Builder rich text: pass the rich-text.js module (renderRichMessage) in');
  }
  const options = { baseurl, pageOrigin };
  // Sanitize into a detached holder so only the rich nodes get the link pass, never the
  // renderer's own links around them.
  const fill = (owner, raw) => {
    const holder = owner.createElement('div');
    richText.renderRichMessage(holder, typeof raw === 'string' ? raw : '');
    return secureRichTree(holder, options);
  };
  return {
    renderRich(container, raw) {
      const holder = fill(container.ownerDocument || doc, raw);
      while (holder.firstChild) container.appendChild(holder.firstChild);
    },
    sanitizeRich(raw) {
      if (!doc) throw new Error('UI Builder rich text: sanitizeRich needs a document');
      return fill(doc, raw).innerHTML;
    },
  };
}
