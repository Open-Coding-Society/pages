// The page document (DESIGN §5): create, normalize, outline and edit pages. Pure and DOM-free.
// Every operation returns a new page and never changes its input; unchanged parts are shared
// with the input, so treat pages as read-only. New ids come from the injected ids(kind) ('s' or
// 'b'), so tests can predict them. Validation (page-rules.js) and the outline (page-outline.js)
// are re-exported from here.
import { cellCountOf, defOf, defaultValue, emptyApiSource, liveTypes, textOf } from './registry.js';
import { safeImage, safeLink } from './url-rules.js';
import {
  API_PATH_KEYS, ID_PATTERN, PAGE_KIND, SCHEMA_VERSION, SNAPSHOT_KEYS, clip, courseCodes, has, isObject, listOf,
  optionValues, own, validatePage,
} from './page-rules.js';

export {
  PAGE_KIND, SCHEMA_VERSION, plainText, tableRows, validatePage, validateSettings,
} from './page-rules.js';
export { outlineOf } from './page-outline.js';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sectionsOf = (page) => listOf(own(page, 'sections'));
const cellsOf = (section) => listOf(own(section, 'cells'));
const blocksOf = (cell) => listOf(own(cell, 'blocks'));

function requireIds(ids) {
  if (typeof ids !== 'function') throw new TypeError('UI Builder page model: pass ids(kind) to make node ids');
}

// ---- normalizing: right JS types, known keys only, defaults filled. Content problems (too long,
// bad links) are kept so validatePage can show them; choices and courses become valid options
// because renderers and includes rely on them.

function toText(value, fallback) {
  if (typeof value === 'string') return value;
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : fallback;
}

function normalizeNumber(value, fallback) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^-?\d{1,15}$/.test(value.trim())) return Number(value.trim());
  return fallback;
}

function normalizeGroup(value) {
  const id = own(value, 'id');
  const numeric = typeof id === 'string' && /^\d{1,15}$/.test(id) ? Number(id) : id;
  if (!Number.isSafeInteger(numeric) || numeric <= 0) return null;
  const name = own(value, 'name');
  return { id: numeric, name: typeof name === 'string' ? name : '' };
}

function normalizeSnapshotItem(item) {
  const out = {};
  for (const key of SNAPSHOT_KEYS) out[key] = toText(own(item, key), '');
  // A snapshot is a cache of mapped API data: unsafe links in it are blanked, as mapItems does.
  if (out.image && !safeImage(out.image)) out.image = '';
  if (out.link && !safeLink(out.link)) out.link = '';
  return out;
}

function normalizeApi(value) {
  const out = emptyApiSource();
  out.url = toText(own(value, 'url'), '');
  for (const key of API_PATH_KEYS) out[key] = toText(own(value, key), '');
  const snapshot = own(value, 'snapshot');
  const fetchedAt = own(snapshot, 'fetched_at');
  out.snapshot = {
    items: listOf(own(snapshot, 'items')).filter(isObject).map(normalizeSnapshotItem),
    fetched_at: Number.isSafeInteger(fetchedAt) && fetchedAt >= 0 ? fetchedAt : 0,
    from_loopback: own(snapshot, 'from_loopback') === true,
  };
  return out;
}

function normalizeValue(field, value, registry) {
  const fallback = defaultValue(field);
  switch (field.type) {
    case 'toggle': return typeof value === 'boolean' ? value : fallback;
    case 'number': return normalizeNumber(value, fallback);
    case 'choice': {
      const candidate = typeof value === 'number' || typeof value === 'boolean' ? String(value) : value;
      return optionValues(field).includes(candidate) ? candidate : fallback;
    }
    case 'course': return typeof value === 'string' && courseCodes(registry).includes(value) ? value : fallback;
    case 'links':
      if (!Array.isArray(value)) return fallback;
      return value.filter(isObject).map((link) => ({ label: toText(own(link, 'label'), ''), url: toText(own(link, 'url'), '') }));
    case 'items':
      if (!Array.isArray(value)) return fallback;
      return value.filter(isObject).map((item) => normalizeFields(field.item_fields || [], item, registry));
    case 'group': return normalizeGroup(value);
    case 'api': return normalizeApi(value);
    default: return toText(value, fallback);
  }
}

// Only the registry's field ids become keys, so __proto__ or constructor in the input are never
// copied or read.
function normalizeFields(fields, raw, registry) {
  const out = {};
  for (const field of fields) {
    const value = own(raw, field.id);
    out[field.id] = value === undefined ? defaultValue(field) : normalizeValue(field, value, registry);
  }
  return out;
}

// Extra cells (a smaller layout, or a hand-edited file) hand their blocks to the last cell kept.
function fitCells(cells, count) {
  const out = cells.slice(0, count).map((cell) => ({ blocks: blocksOf(cell).slice() }));
  while (out.length < count) out.push({ blocks: [] });
  const extra = cells.slice(count).flatMap(blocksOf);
  if (extra.length) out[count - 1] = { blocks: [...out[count - 1].blocks, ...extra] };
  return out;
}

function buildBlock(raw, registry) {
  const type = own(raw, 'type');
  const def = defOf(registry, 'block', type);
  if (!def) return null;
  return { id: own(raw, 'id'), type, settings: normalizeFields(def.fields || [], own(raw, 'settings'), registry), hidden: own(raw, 'hidden') === true };
}

function buildSection(raw, registry) {
  const type = own(raw, 'type');
  const def = defOf(registry, 'frame', type);
  if (!def) return null;
  const section = { id: own(raw, 'id'), type, settings: normalizeFields(def.fields || [], own(raw, 'settings'), registry), hidden: own(raw, 'hidden') === true, cells: [] };
  const cells = cellsOf(raw).map((cell) => ({ blocks: blocksOf(cell).map((block) => buildBlock(block, registry)).filter(Boolean) }));
  section.cells = fitCells(cells, cellCountOf(registry, section));
  return section;
}

function buildPage(raw, registry) {
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: PAGE_KIND,
    page: normalizeFields(registry.page_fields || [], own(raw, 'page'), registry),
    sections: sectionsOf(raw).map((section) => buildSection(section, registry)).filter(Boolean),
  };
}

function eachNode(page, visit) {
  for (const section of sectionsOf(page)) {
    visit('s', section);
    for (const cell of cellsOf(section)) for (const block of blocksOf(cell)) visit('b', block);
  }
}

function collectIds(page) {
  const used = new Set();
  eachNode(page, (kind, node) => { if (typeof own(node, 'id') === 'string') used.add(node.id); });
  return used;
}

function freshId(kind, ids, used) {
  // Generous bound: counter ids in tests can collide with ids already in a file many times.
  for (let attempt = 0; attempt <= used.size + 100; attempt += 1) {
    const id = ids(kind);
    if (typeof id === 'string' && ID_PATTERN[kind].test(id) && !used.has(id)) {
      used.add(id);
      return id;
    }
  }
  throw new Error(`UI Builder page model: ids('${kind}') keeps returning invalid or used ids`);
}

// Keeps the first valid use of every id; bad, wrong-kind and repeated ids get fresh ones that
// can't collide with any id kept. Only touches the freshly built tree, never the caller's input.
function assignIds(page, ids, { fresh = false } = {}) {
  const used = new Set();
  const replace = [];
  eachNode(page, (kind, node) => {
    if (!fresh && typeof node.id === 'string' && ID_PATTERN[kind].test(node.id) && !used.has(node.id)) used.add(node.id);
    else replace.push([kind, node]);
  });
  for (const [kind, node] of replace) node.id = freshId(kind, ids, used);
  return page;
}

function templateOf(registry, template) {
  const templates = listOf(registry.templates);
  if (template === undefined || template === null) return templates.find((t) => t && t.key === 'blank') || null;
  if (typeof template === 'string') {
    const found = templates.find((t) => t && t.key === template);
    if (!found) throw new Error(`UI Builder page model: unknown template ${template}`);
    return found;
  }
  if (isObject(template) && isObject(template.page)) return template;
  throw new TypeError('UI Builder page model: template must be a template key or a template');
}

// A new page from a registry template (default "blank"), every node with a fresh id.
export function createPage(registry, { template, ids } = {}) {
  requireIds(ids);
  const chosen = templateOf(registry, template);
  const raw = chosen ? chosen.page : { page: { title: textOf(registry, 'blocks.untitled') } };
  return assignIds(buildPage(raw, registry), ids, { fresh: true });
}

// Any input → a page this module can edit: unknown keys, frames and blocks dropped, defaults
// filled, cells fitted to the layout, bad or repeated ids replaced. Never throws on bad data.
export function normalizePage(raw, registry, { ids } = {}) {
  requireIds(ids);
  return assignIds(buildPage(raw, registry), ids);
}

// ---- reading

// Where a node is: {kind, node, section, sectionIndex, cellIndex, index}, or null. index is the
// section's place in the page or the block's place in its cell.
export function findNode(page, id) {
  if (typeof id !== 'string' || !id) return null;
  const sections = sectionsOf(page);
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
    const section = sections[sectionIndex];
    if (!isObject(section)) continue;
    if (own(section, 'id') === id) return { kind: 'section', node: section, section, sectionIndex, cellIndex: null, index: sectionIndex };
    const cells = cellsOf(section);
    for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
      const blocks = blocksOf(cells[cellIndex]);
      const index = blocks.findIndex((block) => own(block, 'id') === id);
      if (index !== -1) return { kind: 'block', node: blocks[index], section, sectionIndex, cellIndex, index };
    }
  }
  return null;
}

// Live blocks (chat, boards, API data…) on the page, hidden ones too: drafts still save them.
export function countLive(page, registry) {
  const live = liveTypes(registry);
  let count = 0;
  for (const section of sectionsOf(page)) {
    for (const cell of cellsOf(section)) for (const block of blocksOf(cell)) if (live.has(own(block, 'type'))) count += 1;
  }
  return count;
}

// The copy that is published or exported: hidden sections and blocks left out.
export function stripHidden(page) {
  return {
    ...(isObject(page) ? page : {}),
    sections: sectionsOf(page).filter((section) => isObject(section) && section.hidden !== true).map((section) => ({
      ...section,
      cells: cellsOf(section).map((cell) => ({
        ...(isObject(cell) ? cell : {}),
        blocks: blocksOf(cell).filter((block) => isObject(block) && block.hidden !== true),
      })),
    })),
  };
}

// ---- editing. Unknown ids and impossible moves return the same page object, so callers (and
// the history) can tell that nothing changed.

const replaceAt = (list, index, value) => list.map((item, at) => (at === index ? value : item));
const insertAt = (list, index, value) => [...list.slice(0, index), value, ...list.slice(index)];
const clampIndex = (index, length) => (Number.isInteger(index) ? Math.min(Math.max(index, 0), length) : length);

function moveWithin(list, from, to) {
  const copy = list.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

const withSection = (page, sectionIndex, section) => ({ ...page, sections: replaceAt(page.sections, sectionIndex, section) });

function withBlocks(page, sectionIndex, cellIndex, change) {
  const section = page.sections[sectionIndex];
  const cell = section.cells[cellIndex];
  return withSection(page, sectionIndex, { ...section, cells: replaceAt(section.cells, cellIndex, { ...cell, blocks: change(cell.blocks) }) });
}

function replaceNode(page, loc, node) {
  if (loc.kind === 'section') return withSection(page, loc.sectionIndex, node);
  return withBlocks(page, loc.sectionIndex, loc.cellIndex, (blocks) => replaceAt(blocks, loc.index, node));
}

// Ids for new nodes: `newId` (checked) for the first one when given, then ids(kind); never one
// that is already on the page.
function idSource(page, { ids, newId } = {}) {
  const used = collectIds(page);
  let first = newId;
  return (kind) => {
    if (first !== undefined && first !== null) {
      const id = first;
      first = undefined;
      if (typeof id !== 'string' || !ID_PATTERN[kind].test(id) || used.has(id)) {
        throw new Error(`UI Builder page model: ${String(id)} is not a free ${kind}- id`);
      }
      used.add(id);
      return id;
    }
    requireIds(ids);
    return freshId(kind, ids, used);
  };
}

export function addSection(page, registry, { type = 'stack', index, layout, ids, newId } = {}) {
  const def = defOf(registry, 'frame', type);
  if (!def) throw new Error(`UI Builder page model: unknown section type ${String(type)}`);
  const settings = normalizeFields(listOf(def.fields), layout === undefined ? {} : { layout }, registry);
  const section = { id: idSource(page, { ids, newId })('s'), type, settings, hidden: false, cells: [] };
  section.cells = fitCells([], cellCountOf(registry, section));
  const sections = sectionsOf(page);
  return { ...page, sections: insertAt(sections, clampIndex(index, sections.length), section) };
}

// A block with its defaults (and any `settings` given) at `index` (default: the end) of a cell.
export function addBlock(page, registry, { type, sectionId, cellIndex = 0, index, settings, ids, newId } = {}) {
  const def = defOf(registry, 'block', type);
  if (!def) throw new Error(`UI Builder page model: unknown block type ${String(type)}`);
  const loc = findNode(page, sectionId);
  if (!loc || loc.kind !== 'section' || !Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= cellsOf(loc.node).length) return page;
  const block = { id: idSource(page, { ids, newId })('b'), type, settings: normalizeFields(listOf(def.fields), settings, registry), hidden: false };
  return withBlocks(page, loc.sectionIndex, cellIndex, (blocks) => insertAt(blocks, clampIndex(index, blocks.length), block));
}

// Takes the block out first, so `index` is its place after the move (clamped to the cell).
function moveBlock(page, from, to) {
  const removed = withBlocks(page, from.sectionIndex, from.cellIndex, (blocks) => blocks.filter((_, at) => at !== from.index));
  return withBlocks(removed, to.sectionIndex, to.cellIndex, (blocks) => insertAt(blocks, Math.min(to.index, blocks.length), from.node));
}

function neighbourCell(page, loc, step) {
  if (step < 0) {
    if (loc.cellIndex > 0) return { sectionIndex: loc.sectionIndex, cellIndex: loc.cellIndex - 1, index: Infinity };
    const previous = page.sections[loc.sectionIndex - 1];
    const count = cellsOf(previous).length;
    return count ? { sectionIndex: loc.sectionIndex - 1, cellIndex: count - 1, index: Infinity } : null;
  }
  if (loc.cellIndex < loc.section.cells.length - 1) return { sectionIndex: loc.sectionIndex, cellIndex: loc.cellIndex + 1, index: 0 };
  return cellsOf(page.sections[loc.sectionIndex + 1]).length ? { sectionIndex: loc.sectionIndex + 1, cellIndex: 0, index: 0 } : null;
}

function moveOnce(page, id, step) {
  const loc = findNode(page, id);
  if (!loc) return page;
  if (loc.kind === 'section') {
    const to = loc.sectionIndex + step;
    return to < 0 || to >= page.sections.length ? page : { ...page, sections: moveWithin(page.sections, loc.sectionIndex, to) };
  }
  const to = loc.index + step;
  if (to >= 0 && to < loc.section.cells[loc.cellIndex].blocks.length) {
    return withBlocks(page, loc.sectionIndex, loc.cellIndex, (blocks) => moveWithin(blocks, loc.index, to));
  }
  const target = neighbourCell(page, loc, step);
  return target ? moveBlock(page, loc, target) : page;
}

// Up (delta < 0) or down, one step per unit. A block at the edge of its cell moves into the
// neighbouring cell, then into the neighbouring section; sections move within the page.
export function moveNode(page, id, delta) {
  if (!Number.isInteger(delta) || delta === 0) return page;
  let current = page;
  for (let step = 0; step < Math.abs(delta); step += 1) {
    const next = moveOnce(current, id, Math.sign(delta));
    if (next === current) break;
    current = next;
  }
  return current;
}

// Drag and drop: a section to {index}; a block to {sectionId, cellIndex, index}, index being its
// place after the move (default: the end of the cell). Stale targets leave the page as it is.
export function moveNodeTo(page, id, target) {
  const loc = findNode(page, id);
  if (!loc || !isObject(target)) return page;
  if (loc.kind === 'section') {
    const index = own(target, 'index');
    if (!Number.isInteger(index)) return page;
    const to = Math.min(Math.max(index, 0), page.sections.length - 1);
    return to === loc.sectionIndex ? page : { ...page, sections: moveWithin(page.sections, loc.sectionIndex, to) };
  }
  const dest = findNode(page, own(target, 'sectionId'));
  const cellIndex = own(target, 'cellIndex') ?? 0;
  if (!dest || dest.kind !== 'section' || !Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= cellsOf(dest.node).length) return page;
  const sameCell = dest.sectionIndex === loc.sectionIndex && cellIndex === loc.cellIndex;
  const room = dest.node.cells[cellIndex].blocks.length - (sameCell ? 1 : 0);
  const index = own(target, 'index');
  const to = Number.isInteger(index) ? Math.min(Math.max(index, 0), room) : room;
  if (sameCell && to === loc.index) return page;
  return moveBlock(page, loc, { sectionIndex: dest.sectionIndex, cellIndex, index: to });
}

export function removeNode(page, id) {
  const loc = findNode(page, id);
  if (!loc) return page;
  if (loc.kind === 'section') return { ...page, sections: page.sections.filter((_, at) => at !== loc.sectionIndex) };
  return withBlocks(page, loc.sectionIndex, loc.cellIndex, (blocks) => blocks.filter((_, at) => at !== loc.index));
}

// A copy right after the original with fresh ids (a section's blocks too); `newId` names the copy.
export function duplicateNode(page, id, { ids, newId } = {}) {
  const loc = findNode(page, id);
  if (!loc) return page;
  const next = idSource(page, { ids, newId });
  const copy = JSON.parse(JSON.stringify(loc.node));
  if (loc.kind === 'block') {
    copy.id = next('b');
    return withBlocks(page, loc.sectionIndex, loc.cellIndex, (blocks) => insertAt(blocks, loc.index + 1, copy));
  }
  copy.id = next('s');
  copy.cells = cellsOf(copy).map((cell) => ({ ...cell, blocks: blocksOf(cell).map((block) => ({ ...block, id: next('b') })) }));
  return { ...page, sections: insertAt(page.sections, loc.sectionIndex + 1, copy) };
}

// Patched values go through the same normalizing as a loaded page, and only the definition's
// field ids are read from the patch. Returns `current` itself when nothing changes.
function mergeFields(fields, current, patch, registry) {
  let out = null;
  for (const field of fields) {
    if (!has(patch, field.id)) continue;
    const value = normalizeValue(field, patch[field.id], registry);
    if (same(value, own(current, field.id))) continue;
    out = out || { ...current };
    out[field.id] = value;
  }
  return out || current;
}

// A new Columns layout refits the cells: blocks of removed cells join the last cell kept.
export function updateSettings(page, registry, id, patch) {
  const loc = findNode(page, id);
  if (!loc || !isObject(patch)) return page;
  const def = defOf(registry, loc.kind === 'section' ? 'frame' : 'block', loc.node.type);
  const current = isObject(loc.node.settings) ? loc.node.settings : {};
  const settings = def ? mergeFields(listOf(def.fields), current, patch, registry) : current;
  if (settings === current) return page;
  const node = { ...loc.node, settings };
  if (loc.kind === 'section') node.cells = fitCells(cellsOf(node), cellCountOf(registry, node));
  return replaceNode(page, loc, node);
}

export function updatePageSettings(page, registry, patch) {
  const current = isObject(own(page, 'page')) ? page.page : {};
  const next = isObject(patch) ? mergeFields(listOf(registry.page_fields), current, patch, registry) : current;
  return next === current ? page : { ...page, page: next };
}

export function setHidden(page, id, hidden) {
  const loc = findNode(page, id);
  const value = hidden === true;
  if (!loc || loc.node.hidden === value) return page;
  return replaceNode(page, loc, { ...loc.node, hidden: value });
}

// ---- import

// Types a file uses that this site doesn't know: normalizing drops them, so they are reported.
function unknownTypes(raw, registry) {
  const found = [];
  for (const section of sectionsOf(raw)) {
    if (!defOf(registry, 'frame', own(section, 'type'))) found.push(own(section, 'type'));
    for (const cell of cellsOf(section)) {
      for (const block of blocksOf(cell)) if (!defOf(registry, 'block', own(block, 'type'))) found.push(own(block, 'type'));
    }
  }
  return [...new Set(found.map((type) => clip(typeof type === 'string' ? type : '', 32)))];
}

// An imported .json file → {page, errors}. page is null when the file can't be a page at all
// (too big, not JSON, not the page envelope); otherwise it is normalized and errors lists what
// still needs fixing, including blocks that were dropped because this site doesn't have them.
export function importPageJSON(text, registry, { ids, validators, baseurl, pageOrigin } = {}) {
  requireIds(ids);
  const max = registry.limits && registry.limits.import_max_chars;
  if (!Number.isFinite(max)) throw new Error('UI Builder registry: limits.import_max_chars is missing');
  const issue = (key, vars = {}) => ({ nodeId: null, field: key === 'unknown_type' ? 'type' : null, key, message: textOf(registry, `errors.${key}`, vars) });
  const refuse = (key) => ({ page: null, errors: [issue(key)] });
  if (typeof text !== 'string') return refuse('bad_json');
  if (text.length > max) return refuse('import_too_big');
  let raw;
  try {
    // Editors on Windows may save a byte order mark, which JSON.parse refuses.
    raw = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
  } catch (_) {
    return refuse('bad_json'); // also nesting too deep for the parser
  }
  if (!isObject(raw) || own(raw, 'schemaVersion') !== SCHEMA_VERSION || own(raw, 'kind') !== PAGE_KIND
    || !isObject(own(raw, 'page')) || !Array.isArray(own(raw, 'sections'))) return refuse('bad_page');
  const page = normalizePage(raw, registry, { ids });
  const dropped = unknownTypes(raw, registry).map((type) => issue('unknown_type', { type }));
  return { page, errors: [...dropped, ...validatePage(page, registry, { validators, baseurl, pageOrigin })] };
}
