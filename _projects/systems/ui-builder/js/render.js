// Turns a page document into one vnode tree: the page root, its sections and their cells, and a
// wrapper per block that the canvas finds by data-ui-node. Block markup comes from ctx.renderers
// ({type: (settings, ctx, node) => vnode}); each block renders inside its own error boundary, so
// one broken or hostile block never blanks the page.
//
// ctx: {registry, mode: 'view'|'canvas'|'export', baseurl, pageOrigin, renderers, viewer,
//       pageSettings?, blockedHosts?, onError?(error, node)}. renderPage fills pageSettings with the
// page's own settings (the calendar uses its course). Hidden nodes render only in the canvas.
import { defOf, layoutOf, textOf } from './registry.js';
import { boundary, h } from './vnode.js';

const MODES = new Set(['view', 'canvas', 'export']);
const NODE_ID = /^[sb]-[a-z0-9]{6,12}$/;
const TYPE_NAME = /^[a-z][a-z0-9_]{1,31}$/;
const READY = new WeakSet();

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (object, key) => (isObject(object) && Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined);

function limitOf(registry, key, fallback) {
  const value = own(registry.limits, key);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function contextOf(ctx) {
  if (READY.has(ctx)) return ctx;
  if (!isObject(ctx) || !isObject(ctx.registry)) throw new Error('UI Builder render: ctx.registry is required');
  const out = {
    ...ctx,
    mode: MODES.has(ctx.mode) ? ctx.mode : 'view',
    baseurl: typeof ctx.baseurl === 'string' ? ctx.baseurl : '',
    renderers: isObject(ctx.renderers) ? ctx.renderers : {},
  };
  READY.add(out);
  return out;
}

// data-ui-node is always present (the canvas selects by it); its value only when the id is valid.
function nodeAttrs(node, kind, type, mode) {
  const id = own(node, 'id');
  const attrs = { 'data-ui-node': typeof id === 'string' && NODE_ID.test(id) ? id : '', 'data-ui-kind': kind };
  if (typeof type === 'string' && TYPE_NAME.test(type)) attrs['data-ui-type'] = type;
  if (mode === 'canvas' && own(node, 'hidden') === true) attrs['data-ui-hidden'] = '';
  return attrs;
}

function notice(text) {
  return h('div', { class: 'ocs__callout' }, text);
}

function typeLabel(type) {
  return typeof type === 'string' ? type.slice(0, 40) : '';
}

function isEmpty(value) {
  if (value === null || value === undefined || value === false || value === '') return true;
  return Array.isArray(value) && value.every(isEmpty);
}

function rendererOf(renderers, type) {
  if (typeof type !== 'string' || !Object.prototype.hasOwnProperty.call(renderers, type)) return null;
  return typeof renderers[type] === 'function' ? renderers[type] : null;
}

// What goes inside a block's wrapper, or null when there is nothing to show outside the canvas.
// The canvas keeps every block visible and selectable: unknown types and empty blocks get a note.
function blockBody(block, type, ctx) {
  const canvas = ctx.mode === 'canvas';
  const def = defOf(ctx.registry, 'block', type);
  const renderer = def ? rendererOf(ctx.renderers, type) : null;
  if (!renderer) {
    return canvas ? { flag: 'data-ui-error', content: notice(textOf(ctx.registry, 'blocks.unknown_block', { type: typeLabel(type) })) } : null;
  }
  const settings = isObject(own(block, 'settings')) ? block.settings : {};
  const content = renderer(settings, ctx, block);
  if (!isEmpty(content)) return { content };
  return canvas ? { flag: 'data-ui-empty', content: h('p', { class: 'ocs__text' }, def.label) } : null;
}

function blockNode(block, ctx) {
  if (!isObject(block)) return null;
  if (own(block, 'hidden') === true && ctx.mode !== 'canvas') return null;
  const type = own(block, 'type');
  const attrs = nodeAttrs(block, 'block', type, ctx.mode);
  // A failure shows as a notice in the canvas, so the author can fix it, and drops the block
  // from published and exported pages.
  const fallback = ctx.mode === 'canvas'
    ? h('div', { ...attrs, 'data-ui-error': '' }, notice(textOf(ctx.registry, 'blocks.block_error')))
    : null;
  const report = (error) => {
    if (typeof ctx.onError === 'function') ctx.onError(error, block);
  };
  let body;
  try {
    body = blockBody(block, type, ctx);
  } catch (error) {
    report(error);
    return fallback;
  }
  if (!body) return null;
  const wrapper = h('div', body.flag ? { ...attrs, [body.flag]: '' } : attrs, body.content);
  // Rendering to DOM or HTML can still fail (a rich-text hook, say); the boundary catches that too.
  return boundary(wrapper, { fallback, onError: report });
}

function blocksOf(cell) {
  const blocks = own(cell, 'blocks');
  return Array.isArray(blocks) ? blocks : [];
}

// Takes blocks in page order until a section's limit, so an oversized spec can't flood the page.
function blockTaker(limit) {
  let room = limit;
  return (blocks) => {
    const kept = blocks.slice(0, Math.max(room, 0));
    room -= kept.length;
    return kept;
  };
}

// One list of blocks per column. Cells past the layout's count (a page that skipped
// normalizePage) join the last column, the way page-model moves them when a layout shrinks.
function columnsOf(cells, count, perSection) {
  const take = blockTaker(perSection);
  const columns = Array.from({ length: count }, (_, index) => take(blocksOf(cells[index])));
  for (let index = count; index < cells.length; index += 1) {
    columns[count - 1] = columns[count - 1].concat(take(blocksOf(cells[index])));
  }
  return columns;
}

// layoutOf reads registry.layouts[key] directly, so only own keys reach it ("__proto__" or
// "constructor" would otherwise return Object.prototype members).
function layoutFor(registry, key) {
  const known = typeof key === 'string' && Object.prototype.hasOwnProperty.call(registry.layouts || {}, key) ? key : 'halves';
  const layout = layoutOf(registry, known);
  return {
    className: typeof layout.className === 'string' ? layout.className : 'ocs__split',
    cells: Number.isInteger(layout.cells) && layout.cells >= 1 && layout.cells <= 3 ? layout.cells : 2,
  };
}

function sectionNode(section, ctx) {
  if (!isObject(section)) return null;
  if (own(section, 'hidden') === true && ctx.mode !== 'canvas') return null;
  const type = own(section, 'type');
  const attrs = nodeAttrs(section, 'section', type, ctx.mode);
  const cells = Array.isArray(own(section, 'cells')) ? section.cells : [];
  const perSection = limitOf(ctx.registry, 'blocks_per_section', 50);
  if (type === 'stack') {
    // One column: its blocks sit directly in the section (every cell's, should there be more).
    const take = blockTaker(perSection);
    const blocks = cells.flatMap((cell) => take(blocksOf(cell)));
    return h('section', { class: 'ocs__stack', ...attrs }, blocks.map((block) => blockNode(block, ctx)));
  }
  if (type === 'columns') {
    const layout = layoutFor(ctx.registry, own(own(section, 'settings'), 'layout'));
    return h('section', { class: layout.className, ...attrs },
      columnsOf(cells, layout.cells, perSection).map((blocks, index) => h('div', { class: 'ocs__stack', 'data-ui-cell': String(index) },
        blocks.map((block) => blockNode(block, ctx)))));
  }
  if (ctx.mode !== 'canvas') return null;
  return h('section', { class: 'ocs__stack', ...attrs, 'data-ui-error': '' },
    notice(textOf(ctx.registry, 'blocks.unknown_block', { type: typeLabel(type) })));
}

export function renderBlock(block, ctx) {
  return blockNode(block, contextOf(ctx));
}

export function renderSection(section, ctx) {
  return sectionNode(section, contextOf(ctx));
}

// <article class="ocs__container ocs__stack" data-ui-page>; a wide page drops the container's
// width cap with ocs__container--fill.
export function renderPage(page, ctx) {
  const pageSettings = isObject(own(page, 'page')) ? page.page : {};
  const c = contextOf({ ...ctx, pageSettings });
  const sections = Array.isArray(own(page, 'sections')) ? page.sections.slice(0, limitOf(c.registry, 'sections', 25)) : [];
  const className = own(pageSettings, 'width') === 'wide' ? 'ocs__container ocs__container--fill ocs__stack' : 'ocs__container ocs__stack';
  return h('article', { class: className, 'data-ui-page': '' }, sections.map((section) => sectionNode(section, c)));
}
