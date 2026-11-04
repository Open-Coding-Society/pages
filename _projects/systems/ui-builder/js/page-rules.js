// The page document's rules (DESIGN §5, §6): its constants, safe readers for untrusted page
// data, and validation that mirrors Spring's UiBuilderSpecRules plus the registry's field rules.
// Pure and DOM-free; page-model.js re-exports validatePage and validateSettings.
import { cellCountOf, defOf, defaultValue, liveTypes, textOf } from './registry.js';
import { apiUrlPolicy, embedPolicy, isLoopbackAddress, safeImage, safeLink, videoEmbedOf } from './url-rules.js';
// Rich text is checked as browsers and Spring's jsoup read it (rich-html.js).
import { linksToComputer, unsafeRichText } from './rich-html.js';

export const PAGE_KIND = 'ocs-ui-page';
export const SCHEMA_VERSION = 1;

export const ID_PATTERN = { s: /^s-[a-z0-9]{6,12}$/, b: /^b-[a-z0-9]{6,12}$/ };
const ANY_ID = /^[sb]-[a-z0-9]{6,12}$/;
const API_PATH = /^[A-Za-z0-9_.[\]-]{0,120}$/;
export const API_PATH_KEYS = ['list_path', 'title_path', 'text_path', 'image_path', 'link_path', 'value_path', 'label_path'];
export const SNAPSHOT_KEYS = ['title', 'text', 'image', 'link', 'value', 'label'];
// Spring rejects keys that start with "on" or are named html or script; the last three would let
// a careless merge somewhere else change Object.prototype.
const FORBIDDEN_KEY = /^(?:on|(?:html|script|__proto__|constructor|prototype)$)/i;
const LINE_BREAK = new RegExp(`[\\n\\r\\v\\f${String.fromCharCode(0x85, 0x2028, 0x2029)}]`);
const ELLIPSIS = String.fromCharCode(0x2026);
const MAX_ISSUES = 1000;
// Spring's UiBuilderSpecRules caps every string at 20 000 characters; DESIGN §6 caps link labels
// at 60. Both are read from registry limits (string_max, link_label_max) when present.
const STRING_MAX = 20000;
const LINK_LABEL_MAX = 60;

export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
export const has = (value, key) => isObject(value) && Object.prototype.hasOwnProperty.call(value, key);
export const own = (value, key) => (has(value, key) ? value[key] : undefined);
export const listOf = (value) => (Array.isArray(value) ? value : []);
export const optionValues = (field) => listOf(field.options).map((option) => option && option.value);

export function clip(text, max) {
  const flat = String(text).slice(0, max * 4).replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}${ELLIPSIS}` : flat;
}

// Rich text as the reader sees it: tags dropped, the common entities decoded.
export function plainText(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/&amp;/gi, '&');
}

// The table rule shared with the renderer: one row per non-blank line, cells split on "|".
export function tableRows(text) {
  return String(text).split(/\r\n|\r|\n/).filter((line) => line.trim())
    .map((line) => line.split('|').map((cell) => cell.trim()));
}


export function courseCodes(registry) {
  if (Array.isArray(registry.courses)) return registry.courses.map((course) => course && course.value);
  return listOf(registry.course_codes);
}

// ---- validation → [{nodeId, field, key, message}]. field is a dotted path inside the node's
// settings ("links.0.url"); nodeId is null for the page itself. Raw files may be passed in, so
// every read is defensive and nothing here throws on bad data.

function limitsOf(registry) {
  const limits = (registry && registry.limits) || {};
  const read = (name, fallback) => {
    if (Number.isFinite(limits[name])) return limits[name];
    if (fallback !== undefined) return fallback;
    throw new Error(`UI Builder registry: limits.${name} is missing`);
  };
  const names = ['sections', 'blocks_per_section', 'live_blocks', 'spec_chars', 'depth', 'text_max', 'textarea_max',
    'richtext_max', 'list_max', 'table_rows', 'table_cols', 'api_item_chars', 'api_snapshot_items', 'api_snapshot_chars'];
  const out = Object.fromEntries(names.map((name) => [name, read(name)]));
  out.string_max = read('string_max', STRING_MAX);
  out.link_label_max = read('link_label_max', LINK_LABEL_MAX);
  return out;
}

// publish: check as Spring does before publishing, where an API on the student's own computer
// (http://localhost) is no longer allowed, nor any link or picture there; drafts may use them
// while editing.
function contextOf(registry, { validators, baseurl = '', pageOrigin, publish = false } = {}) {
  let origin = null;
  try {
    origin = typeof pageOrigin === 'string' ? new URL(pageOrigin) : null;
  } catch (_) {
    origin = null; // no usable origin: API checks then assume an https page on an unknown host
  }
  return {
    registry,
    limits: limitsOf(registry),
    validators: isObject(validators) ? validators : {},
    links: { baseurl, pageOrigin },
    publish: publish === true,
    // Edit mode for drafts. Published pages are read by visitors, so the page's own host must not
    // unlock loopback APIs either (apiUrlPolicy allows them when the site runs on localhost).
    api: publish
      ? { pageHost: '', pageProtocol: origin ? origin.protocol : 'https:', mode: 'view' }
      : { pageHost: origin ? origin.hostname : '', pageProtocol: origin ? origin.protocol : 'https:', mode: 'edit' },
    issues: [],
    found: 0,
    tooDeep: false,
  };
}

function report(ctx, nodeId, field, key, vars = {}, textPath = `errors.${key}`) {
  ctx.found += 1;
  if (ctx.issues.length < MAX_ISSUES) ctx.issues.push({ nodeId, field, key, message: textOf(ctx.registry, textPath, vars) });
}

function failer(ctx, nodeId, path, label) {
  return (key, vars = {}, textPath = undefined) => {
    report(ctx, nodeId, path, key, { field: label, ...vars }, textPath);
    return true;
  };
}

const shownType = (type) => {
  if (typeof type === 'string') return clip(type, 32);
  return typeof type === 'number' || typeof type === 'boolean' ? String(type) : '';
};

// Spring checks page fields after Java's strip(), which also counts U+001C-U+001F as space while
// JavaScript's trim keeps them, so those count as blank here too.
const JAVA_ONLY_SPACE = /[\x1c-\x1f]/g;

function checkString(value, field, max, oneLine, fail, visible = (text) => text) {
  if (typeof value !== 'string') return fail('bad_value');
  if (field.required && !visible(value).replace(JAVA_ONLY_SPACE, ' ').trim()) return fail('required');
  const limit = Number.isInteger(field.max) ? field.max : max;
  if (value.length > limit) return fail('too_long', { max: limit });
  if (oneLine && LINE_BREAK.test(value)) return fail('one_line');
  return false;
}

// A field's own max wins over Spring's cap on every string (the gallery picture's column holds 500).
function checkLocation(value, field, ctx, fail, problemOf) {
  if (typeof value !== 'string') return fail('bad_value');
  // Length before blankness, in Spring's order: 501 spaces in the gallery picture are too_long there.
  const limit = Number.isInteger(field.max) ? field.max : ctx.limits.string_max;
  if (value.length > limit) return fail('too_long', { max: limit });
  if (!value.trim()) return field.required ? fail('required') : false;
  const problem = problemOf(value);
  return problem ? fail(problem) : false;
}

// A published page can't point at the student's own computer, which no visitor can reach: Spring
// refuses every such url, src, image or link on publish (loopback_url there).
const onComputer = (raw, ctx) => (ctx.publish && isLoopbackAddress(raw) ? 'loopback_link' : null);

// mailto: is only for buttons (links lists), the same rule Spring applies.
const urlProblem = (ctx) => (raw) => {
  const link = safeLink(raw, ctx.links);
  return link && !/^mailto:/i.test(link.href) ? onComputer(raw, ctx) : 'bad_url';
};

function checkLinks(value, field, ctx, nodeId, path, fail) {
  if (!Array.isArray(value)) return fail('bad_list');
  if (field.required && !value.length) return fail('required');
  const max = Number.isInteger(field.max_items) ? field.max_items : ctx.limits.list_max;
  if (value.length > max) fail('too_many', { max });
  const label = field.label || field.id;
  for (let index = 0; index < value.length && ctx.found < MAX_ISSUES; index += 1) {
    const link = value[index];
    const at = `${path}.${index}`;
    if (!isObject(link)) {
      report(ctx, nodeId, at, 'bad_list', { field: label });
      continue;
    }
    checkString(own(link, 'label') ?? '', { required: true, max: ctx.limits.link_label_max }, 0, true, failer(ctx, nodeId, `${at}.label`, label));
    checkLocation(own(link, 'url') ?? '', { required: true }, ctx, failer(ctx, nodeId, `${at}.url`, label), (raw) => (safeLink(raw, ctx.links) ? onComputer(raw, ctx) : 'bad_url'));
  }
  return false;
}

function checkItems(value, field, ctx, nodeId, path, fail) {
  if (!Array.isArray(value)) return fail('bad_list');
  if (field.required && !value.length) return fail('required');
  const max = Number.isInteger(field.max_items) ? field.max_items : ctx.limits.list_max;
  if (value.length > max) fail('too_many', { max });
  for (let index = 0; index < value.length && ctx.found < MAX_ISSUES; index += 1) {
    const item = value[index];
    if (isObject(item)) checkFields(listOf(field.item_fields), item, ctx, nodeId, `${path}.${index}.`, null);
    else report(ctx, nodeId, `${path}.${index}`, 'bad_list', { field: field.label || field.id });
  }
  return false;
}

function checkGroup(value, field, ctx, fail) {
  if (value === null || value === undefined) return field.required ? fail('required') : false;
  const id = own(value, 'id');
  const name = own(value, 'name');
  const ok = Number.isSafeInteger(id) && id > 0 && typeof name === 'string'
    && name.length <= ctx.limits.string_max && !LINE_BREAK.test(name);
  return ok ? false : fail('bad_group');
}

// Mapped items only (DESIGN §6): known keys, short strings, safe links, a bounded size.
function snapshotOk(snapshot, ctx) {
  if (snapshot === undefined) return true;
  if (!isObject(snapshot)) return false;
  const items = own(snapshot, 'items');
  const fetchedAt = own(snapshot, 'fetched_at');
  const fromLoopback = own(snapshot, 'from_loopback');
  if ((items !== undefined && !Array.isArray(items))
    || (fetchedAt !== undefined && !(Number.isFinite(fetchedAt) && fetchedAt >= 0))
    || (fromLoopback !== undefined && typeof fromLoopback !== 'boolean')) return false;
  const { api_snapshot_items: maxItems, api_item_chars: maxChars, api_snapshot_chars: maxTotal } = ctx.limits;
  if (listOf(items).length > maxItems) return false;
  for (const item of listOf(items)) {
    if (!isObject(item)) return false;
    for (const key of Object.keys(item)) {
      if (!SNAPSHOT_KEYS.includes(key) || typeof item[key] !== 'string' || item[key].length > maxChars) return false;
    }
    if (own(item, 'image') && !safeImage(item.image, ctx.links)) return false;
    if (own(item, 'link') && !safeLink(item.link, ctx.links)) return false;
  }
  // Measured on the known parts only: items are flat strings by now, so this always serializes.
  return JSON.stringify({ items: listOf(items), fetched_at: fetchedAt, from_loopback: fromLoopback }).length <= maxTotal;
}

function checkApi(value, field, ctx, nodeId, path, fail) {
  if (!isObject(value)) return fail('bad_api');
  const url = own(value, 'url');
  if (url !== undefined && typeof url !== 'string') return fail('bad_api');
  const label = field.label || field.id;
  if (!url || !url.trim()) {
    if (field.required) fail('bad_api');
  } else if (url.length > ctx.limits.string_max) {
    fail('too_long', { max: ctx.limits.string_max });
  } else {
    // The doctor's wording explains each policy (https only, no private hosts, mixed content).
    const policy = apiUrlPolicy(url, ctx.api);
    if (!policy.ok) fail(policy.reason, {}, `doctor.${policy.reason}`);
  }
  for (const key of API_PATH_KEYS) {
    const mapped = own(value, key);
    if (mapped !== undefined && (typeof mapped !== 'string' || !API_PATH.test(mapped))) {
      report(ctx, nodeId, `${path}.${key}`, 'bad_api_path', { field: label });
    }
  }
  const snapshot = own(value, 'snapshot');
  if (!snapshotOk(snapshot, ctx)) {
    report(ctx, nodeId, `${path}.snapshot`, 'bad_snapshot', { field: label });
  } else if (ctx.publish && listOf(own(snapshot, 'items')).some((item) => isLoopbackAddress(own(item, 'image')) || isLoopbackAddress(own(item, 'link')))) {
    // Spring checks a saved copy's image and link like any other address (loopback_url).
    report(ctx, nodeId, `${path}.snapshot`, 'loopback_snapshot', { field: label });
  }
  return false;
}

function checkField(field, value, ctx, nodeId, path) {
  const before = ctx.found;
  const fail = failer(ctx, nodeId, path, field.label || field.id);
  const { limits } = ctx;
  switch (field.type) {
    case 'text': checkString(value, field, limits.text_max, true, fail); break;
    case 'textarea': checkString(value, field, limits.textarea_max, false, fail); break;
    case 'richtext':
      // Unsafe markup is reported first, even in a body with no visible text. A link to the
      // student's own computer is refused only on publish, as in link fields, in words that say
      // the link is somewhere in the text.
      if (typeof value === 'string' && unsafeRichText(value)) fail('bad_body');
      else if (!checkString(value, field, limits.richtext_max, false, fail, plainText) && ctx.publish && linksToComputer(value)) {
        fail('loopback_link', {}, 'errors.loopback_rich_text');
      }
      break;
    case 'table':
      if (!checkString(value, field, limits.string_max, false, fail)) {
        const rows = tableRows(value);
        if (rows.length > limits.table_rows || rows.some((row) => row.length > limits.table_cols)) {
          fail('table_too_big', { rows: limits.table_rows, cols: limits.table_cols });
        }
      }
      break;
    case 'url': checkLocation(value, field, ctx, fail, urlProblem(ctx)); break;
    case 'image': checkLocation(value, field, ctx, fail, (raw) => (safeImage(raw, ctx.links) ? onComputer(raw, ctx) : 'bad_image')); break;
    case 'choice': if (!optionValues(field).includes(value)) fail('bad_choice'); break;
    case 'course':
      if (typeof value !== 'string' || (value && !courseCodes(ctx.registry).includes(value))) fail('bad_choice');
      else if (!value && field.required) fail('required');
      break;
    case 'toggle': if (typeof value !== 'boolean') fail('bad_toggle'); break;
    case 'number': {
      const min = Number.isFinite(field.min) ? field.min : Number.MIN_SAFE_INTEGER;
      const max = Number.isFinite(field.max) ? field.max : Number.MAX_SAFE_INTEGER;
      if (!Number.isInteger(value) || value < min || value > max) fail('bad_number', { min, max });
      break;
    }
    case 'links': checkLinks(value, field, ctx, nodeId, path, fail); break;
    case 'items': checkItems(value, field, ctx, nodeId, path, fail); break;
    case 'group': checkGroup(value, field, ctx, fail); break;
    case 'api': checkApi(value, field, ctx, nodeId, path, fail); break;
    default: break; // normalizeRegistry rejects unknown field types at startup
  }
  return ctx.found > before;
}

// Rules beyond the field type, by block type ("page" for the page settings). The editor adds its
// own through `validators` (kanban's parseBoardUrl); they run after these, only on non-empty
// values that passed the type check.
const BUILT_IN_RULES = {
  // Spring checks the gallery picture as if the page were published on every save, drafts too
  // (pageFieldIssues → imageAllowed): the gallery shows it to every visitor.
  page: { image: (value) => (isLoopbackAddress(value) ? { key: 'loopback_link' } : null) },
  video: { url: (value) => (videoEmbedOf(value) ? null : { key: 'video_bad_url' }) },
  embed: { url: (value) => (embedPolicy(value).reason === 'embed_https' ? { key: 'embed_https' } : null) },
};

const isBlank = (value) => value === null || value === undefined
  || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length);

function runRules(ctx, type, field, value, values, nodeId, path) {
  for (const rule of [own(own(BUILT_IN_RULES, type), field.id), own(own(ctx.validators, type), field.id)]) {
    if (typeof rule !== 'function') continue;
    const found = rule(value, values);
    if (!found) continue;
    if (typeof found.key !== 'string') throw new TypeError(`UI Builder page model: validator ${type}.${field.id} must return null or {key, vars}`);
    report(ctx, nodeId, path, found.key, { ...(isObject(found.vars) ? found.vars : {}), field: field.label || field.id });
    return;
  }
}

function checkFields(fields, values, ctx, nodeId, prefix, type) {
  for (const field of fields) {
    if (ctx.found >= MAX_ISSUES) return;
    const path = `${prefix}${field.id}`;
    const value = has(values, field.id) ? values[field.id] : defaultValue(field);
    if (!checkField(field, value, ctx, nodeId, path) && type && !isBlank(value)) runRules(ctx, type, field, value, values, nodeId, path);
  }
}

// One node's settings against its frame or block definition. `type` picks the block rules and
// validators[type]; baseurl and pageOrigin feed the link checks.
export function validateSettings(def, settings, registry, { nodeId = null, type = null, validators, baseurl, pageOrigin, publish } = {}) {
  const ctx = contextOf(registry, { validators, baseurl, pageOrigin, publish });
  checkFields(listOf(def && def.fields), isObject(settings) ? settings : {}, ctx, nodeId, '', type);
  return ctx.issues;
}

// Depth (every object and array is a level, the page itself is 1) and key names everywhere, the
// way Spring checks them. It stops at the depth limit, so even a cyclic object ends.
function scanKeys(value, depth, nodeId, ctx, holdsNodes = false) {
  if (value === null || typeof value !== 'object' || ctx.tooDeep || ctx.found >= MAX_ISSUES) return;
  if (depth > ctx.limits.depth) {
    ctx.tooDeep = true;
    report(ctx, nodeId, null, 'too_deep');
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const id = holdsNodes ? own(item, 'id') : undefined;
      scanKeys(item, depth + 1, typeof id === 'string' && ANY_ID.test(id) ? id : nodeId, ctx);
    }
    return;
  }
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEY.test(key)) report(ctx, nodeId, clip(key, 40), 'bad_key');
    scanKeys(value[key], depth + 1, nodeId, ctx, key === 'sections' || key === 'blocks');
  }
}

function checkId(node, kind, seen, ctx) {
  const id = own(node, 'id');
  if (typeof id !== 'string' || !ID_PATTERN[kind].test(id)) {
    report(ctx, null, 'id', 'bad_id');
    return null;
  }
  if (seen.has(id)) report(ctx, id, 'id', 'duplicate_id');
  seen.add(id);
  return id;
}

function checkShape(node, nodeId, ctx) {
  if (has(node, 'hidden') && typeof node.hidden !== 'boolean') report(ctx, nodeId, 'hidden', 'bad_page');
  if (has(node, 'settings') && !isObject(node.settings)) report(ctx, nodeId, 'settings', 'bad_page');
  return isObject(own(node, 'settings')) ? node.settings : {};
}

// Raw layouts are matched against the options first: registry.layoutOf reads layouts[key]
// without an own-property check, so "__proto__" would give no cell count at all.
function cellsNeeded(registry, def, type, settings) {
  const field = listOf(def.fields).find((candidate) => candidate.id === 'layout');
  if (!field) return cellCountOf(registry, { type, settings: {} });
  const layout = own(settings, 'layout');
  return cellCountOf(registry, { type, settings: { layout: optionValues(field).includes(layout) ? layout : defaultValue(field) } });
}

function checkBlock(block, seen, live, ctx) {
  if (!isObject(block)) {
    report(ctx, null, 'blocks', 'bad_page');
    return false;
  }
  const nodeId = checkId(block, 'b', seen, ctx);
  const type = own(block, 'type');
  const def = defOf(ctx.registry, 'block', type);
  if (!def) {
    report(ctx, nodeId, 'type', 'unknown_type', { type: shownType(type) });
    return false;
  }
  checkFields(listOf(def.fields), checkShape(block, nodeId, ctx), ctx, nodeId, '', type);
  return live.has(type);
}

// Returns how many live blocks the section holds.
function checkSection(section, seen, live, ctx) {
  if (!isObject(section)) {
    report(ctx, null, 'sections', 'bad_page');
    return 0;
  }
  const { registry, limits } = ctx;
  const nodeId = checkId(section, 's', seen, ctx);
  const type = own(section, 'type');
  const def = defOf(registry, 'frame', type);
  const settings = checkShape(section, nodeId, ctx);
  if (def) checkFields(listOf(def.fields), settings, ctx, nodeId, '', null);
  else report(ctx, nodeId, 'type', 'unknown_type', { type: shownType(type) });
  const cells = own(section, 'cells');
  if (!Array.isArray(cells)) {
    report(ctx, nodeId, 'cells', 'bad_page');
    return 0;
  }
  if (def && cells.length !== cellsNeeded(registry, def, type, settings)) report(ctx, nodeId, 'cells', 'bad_cells');
  let blockCount = 0;
  let liveCount = 0;
  for (const cell of cells) {
    const blocks = own(cell, 'blocks');
    if (!Array.isArray(blocks)) {
      report(ctx, nodeId, 'cells', 'bad_page');
      continue;
    }
    blockCount += blocks.length;
    for (const block of blocks) {
      if (ctx.found >= MAX_ISSUES) break;
      if (checkBlock(block, seen, live, ctx)) liveCount += 1;
    }
  }
  if (blockCount > limits.blocks_per_section) report(ctx, nodeId, null, 'too_many_blocks', { max: limits.blocks_per_section });
  return liveCount;
}

function checkSize(page, ctx) {
  let size;
  try {
    size = JSON.stringify(page).length;
  } catch (_) {
    // Only objects built in code (cycles, BigInt) end up here; parsed JSON always serializes.
    report(ctx, null, null, 'bad_page');
    return;
  }
  if (size > ctx.limits.spec_chars) report(ctx, null, null, 'too_big', { size, max: ctx.limits.spec_chars });
}

// Everything that stops a page from saving: envelope, page fields, sections, cells, blocks, every
// field, ids, key names, depth, live blocks and size. Hidden nodes count: drafts save them too.
// options: {validators, baseurl, pageOrigin, publish}.
export function validatePage(page, registry, options = {}) {
  const ctx = contextOf(registry, options);
  if (!isObject(page) || own(page, 'schemaVersion') !== SCHEMA_VERSION || own(page, 'kind') !== PAGE_KIND) {
    report(ctx, null, null, 'bad_page');
    return ctx.issues;
  }
  scanKeys(page, 1, null, ctx);
  const fields = own(page, 'page');
  if (isObject(fields)) checkFields(listOf(registry.page_fields), fields, ctx, null, '', 'page');
  else report(ctx, null, 'page', 'bad_page');
  const sections = own(page, 'sections');
  if (Array.isArray(sections)) {
    const { limits } = ctx;
    if (sections.length > limits.sections) report(ctx, null, null, 'too_many_sections', { max: limits.sections });
    const seen = new Set();
    const live = liveTypes(registry);
    let liveCount = 0;
    for (const section of sections) {
      if (ctx.found >= MAX_ISSUES) break;
      liveCount += checkSection(section, seen, live, ctx);
    }
    if (liveCount > limits.live_blocks) report(ctx, null, null, 'too_many_live', { max: limits.live_blocks });
  } else {
    report(ctx, null, 'sections', 'bad_page');
  }
  if (!ctx.tooDeep) checkSize(page, ctx);
  return ctx.issues;
}
