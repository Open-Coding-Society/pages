// Lays out the HTML the UI Builder writes as indented lines of tokens, for the editor's code view.
// It reads only toHTML's output (attributes in double quotes; < and > escaped in text and in
// attribute values), so it is a small tokenizer, not a general HTML parser. Pure: no DOM.
const VOID_TAGS = new Set(['img', 'hr', 'br']);
// Elements that sit inside a line of text. An element made only of these and text stays on one line.
const INLINE_TAGS = new Set(['a', 'span', 'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'small', 'abbr', 'code', 'br', 'time', 'output']);
const TOKEN = /<!--[\s\S]*?-->|\{%[\s\S]*?%\}|<\/([a-z][a-z0-9]*)\s*>|<([a-z][a-z0-9]*)((?:\s+[a-z][a-z0-9-]*(?:="[^"]*")?)*)\s*>/g;
const ATTRIBUTE = /\s+([a-z][a-z0-9-]*)(?:="([^"]*)")?/g;
export const LINE_WIDTH = 90;

// The builder's own bookkeeping (data-ui-node, data-ui-kind…): the canvas and the viewer find
// blocks by it, but it draws nothing.
export const isBuilderAttribute = (name) => /^data-ui(?:-|$)/.test(name);

// A tree of {type: 'root'|'element'|'text'|'comment'|'liquid'}. A closing tag pops back to the
// element it names; one that names no open element is dropped.
export function parseHTML(html) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  const source = String(html ?? '');
  const addText = (text) => { if (text) stack[stack.length - 1].children.push({ type: 'text', text }); };
  let at = 0;
  for (const match of source.matchAll(TOKEN)) {
    addText(source.slice(at, match.index));
    at = match.index + match[0].length;
    const [whole, closing, opening, attributes] = match;
    const parent = stack[stack.length - 1];
    if (whole.startsWith('<!--')) parent.children.push({ type: 'comment', text: whole });
    else if (whole.startsWith('{%')) parent.children.push({ type: 'liquid', text: whole });
    else if (closing) {
      const index = stack.map((node) => node.tag).lastIndexOf(closing);
      if (index > 0) stack.length = index;
    } else {
      const attrs = [...attributes.matchAll(ATTRIBUTE)].map(([, name, value]) => [name, value === undefined ? null : value]);
      const node = { type: 'element', tag: opening, attrs, children: [] };
      parent.children.push(node);
      if (!VOID_TAGS.has(opening)) stack.push(node);
    }
  }
  addText(source.slice(at));
  return root;
}

const isInline = (node) => node.type === 'text'
  || (node.type === 'element' && INLINE_TAGS.has(node.tag) && node.children.every(isInline));

function openTokens(node, hide) {
  const tokens = [{ kind: 'tag', text: `<${node.tag}` }];
  for (const [name, value] of node.attrs) {
    if (hide(name)) continue;
    if (value === null) tokens.push({ kind: 'attr', text: ` ${name}` });
    else tokens.push({ kind: 'attr', text: ` ${name}=` }, { kind: 'value', text: `"${value}"` });
  }
  tokens.push({ kind: 'tag', text: '>' });
  return tokens;
}

function inlineTokens(node, hide) {
  if (node.type === 'text') return [{ kind: 'text', text: node.text.replace(/\s+/g, ' ') }];
  if (node.type === 'comment' || node.type === 'liquid') return [{ kind: node.type, text: node.text }];
  const inner = node.children.flatMap((child) => inlineTokens(child, hide));
  return VOID_TAGS.has(node.tag) ? openTokens(node, hide) : [...openTokens(node, hide), ...inner, { kind: 'tag', text: `</${node.tag}>` }];
}

const widthOf = (tokens) => tokens.reduce((sum, token) => sum + token.text.length, 0);

// Trims the spaces at the ends of a line of inline tokens; null when nothing is left.
function trimmed(tokens) {
  const out = tokens.map((token) => ({ ...token }));
  if (out.length && out[0].kind === 'text') out[0].text = out[0].text.trimStart();
  const last = out[out.length - 1];
  if (last && last.kind === 'text') last.text = last.text.trimEnd();
  const kept = out.filter((token) => token.kind !== 'text' || token.text);
  return kept.length ? kept : null;
}

// An inline element too wide for one line opens, lists its children and closes on lines of their own.
function printInline(node, depth, out, hide) {
  const tokens = trimmed(inlineTokens(node, hide));
  if (!tokens) return;
  if (node.type !== 'element' || VOID_TAGS.has(node.tag) || widthOf(tokens) + depth * 2 <= LINE_WIDTH || !node.children.length) {
    out.push({ depth, tokens });
    return;
  }
  out.push({ depth, tokens: openTokens(node, hide) });
  for (const child of node.children) printInline(child, depth + 1, out, hide);
  out.push({ depth, tokens: [{ kind: 'tag', text: `</${node.tag}>` }] });
}

// Text and inline elements next to each other share a line, unless that line is too wide: then
// each one gets its own.
function printChildren(children, depth, out, hide) {
  let run = [];
  const flush = () => {
    const tokens = trimmed(run.flatMap((child) => inlineTokens(child, hide)));
    if (tokens && (run.length === 1 || widthOf(tokens) + depth * 2 <= LINE_WIDTH)) {
      if (run.length === 1) printInline(run[0], depth, out, hide);
      else out.push({ depth, tokens });
    } else if (tokens) {
      for (const child of run) printInline(child, depth, out, hide);
    }
    run = [];
  };
  for (const child of children) {
    if (isInline(child)) { run.push(child); continue; }
    flush();
    printNode(child, depth, out, hide);
  }
  flush();
}

function printNode(node, depth, out, hide) {
  if (node.type === 'comment' || node.type === 'liquid') {
    out.push({ depth, tokens: [{ kind: node.type, text: node.text }] });
    return;
  }
  if (node.type !== 'element') {
    printChildren([node], depth, out, hide);
    return;
  }
  const open = openTokens(node, hide);
  if (VOID_TAGS.has(node.tag)) {
    out.push({ depth, tokens: open });
    return;
  }
  const close = { kind: 'tag', text: `</${node.tag}>` };
  if (node.children.every(isInline)) {
    const line = [...open, ...(trimmed(node.children.flatMap((child) => inlineTokens(child, hide))) || []), close];
    if (widthOf(line) + depth * 2 <= LINE_WIDTH || node.children.length === 0) {
      out.push({ depth, tokens: line });
      return;
    }
  }
  out.push({ depth, tokens: open });
  printChildren(node.children, depth + 1, out, hide);
  out.push({ depth, tokens: [close] });
}

// The lines {depth, tokens: [{kind, text}]} for a tree or an HTML string. kind is tag, attr,
// value, text, comment or liquid. hide(name) leaves attributes out; unwrap prints the children of
// a lone root element (a block's data-ui wrapper) at depth 0.
export function codeLines(input, { hide = () => false, unwrap = false } = {}) {
  const root = typeof input === 'string' ? parseHTML(input) : input;
  const elements = root.children.filter((child) => child.type === 'element');
  const top = unwrap && elements.length === 1 && root.children.every((child) => child === elements[0] || (child.type === 'text' && !child.text.trim()))
    ? elements[0].children : root.children;
  const out = [];
  printChildren(top, 0, out, hide);
  return out;
}

// The ocs__ grammar classes a tree or HTML string uses, in the order they first appear.
export function ocsClasses(input) {
  const root = typeof input === 'string' ? parseHTML(input) : input;
  const found = [];
  const walk = (node) => {
    if (node.type === 'element') {
      for (const [name, value] of node.attrs) {
        if (name !== 'class' || !value) continue;
        for (const name of value.split(/\s+/)) if (/^ocs__[a-z0-9_-]+$/.test(name) && !found.includes(name)) found.push(name);
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  walk(root);
  return found;
}
