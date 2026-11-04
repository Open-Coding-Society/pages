// The UI Builder registry: frames, blocks, fields, limits and every visible string, read from
// _data/ui_builder.yml (generic) merged with _data/ui_builder_school.yml (school pack).
// Pure: the page passes the parsed JSON in; nothing here touches the DOM except readRegistry.

export const FIELD_TYPES = Object.freeze([
  'text', 'textarea', 'richtext', 'url', 'image', 'choice', 'course', 'toggle', 'number',
  'links', 'items', 'table', 'group', 'api',
]);

const KINDS = { frame: 'frames', block: 'blocks' };

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function fail(message) {
  throw new Error(`UI Builder registry: ${message}`);
}

function checkFields(fields, where) {
  if (!Array.isArray(fields)) fail(`${where}.fields must be a list`);
  const seen = new Set();
  for (const field of fields) {
    if (!isObject(field) || typeof field.id !== 'string' || !field.id) fail(`${where} has a field without an id`);
    if (seen.has(field.id)) fail(`${where} repeats field ${field.id}`);
    seen.add(field.id);
    if (!FIELD_TYPES.includes(field.type)) fail(`${where}.${field.id} has unknown type ${field.type}`);
    if ((field.type === 'choice') && (!Array.isArray(field.options) || !field.options.length)) {
      fail(`${where}.${field.id} needs options`);
    }
    if (field.type === 'items') checkFields(field.item_fields || [], `${where}.${field.id}`);
  }
}

function deepMerge(base, extra) {
  if (!isObject(base) || !isObject(extra)) return extra === undefined ? base : extra;
  const out = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    out[key] = isObject(value) && isObject(base[key]) ? deepMerge(base[key], value) : value;
  }
  return out;
}

// Blocks and text deep-merge (the school pack wins); templates and page fields are appended.
export function mergeRegistry(generic, school) {
  if (!isObject(school)) return generic;
  return {
    ...generic,
    blocks: deepMerge(generic.blocks || {}, school.blocks || {}),
    text: deepMerge(generic.text || {}, school.text || {}),
    templates: [...(generic.templates || []), ...(school.templates || [])],
    page_fields: [...(generic.page_fields || []), ...(school.page_fields || [])],
    course_codes: [...(generic.course_codes || []), ...(school.course_codes || [])],
  };
}

// Checks the registry's shape once, at startup, so a broken data file fails loudly instead of
// rendering half a page. Returns a copy with the defaults filled in.
export function normalizeRegistry(raw, { courseTitles = {} } = {}) {
  if (!isObject(raw)) fail('expected an object');
  for (const key of ['limits', 'frames', 'blocks', 'layouts', 'text']) {
    if (!isObject(raw[key])) fail(`missing ${key}`);
  }
  const categories = Array.isArray(raw.categories) ? raw.categories : [];
  const categoryKeys = new Set(categories.map((c) => c.key));
  for (const [type, def] of Object.entries(raw.frames)) checkFields(def.fields || [], `frames.${type}`);
  for (const [type, def] of Object.entries(raw.blocks)) {
    if (!categoryKeys.has(def.category)) fail(`blocks.${type} has unknown category ${def.category}`);
    checkFields(def.fields || [], `blocks.${type}`);
  }
  checkFields(raw.page_fields || [], 'page_fields');
  const codes = Array.isArray(raw.course_codes) ? raw.course_codes : [];
  return {
    ...raw,
    categories,
    devices: Array.isArray(raw.devices) ? raw.devices : [],
    templates: Array.isArray(raw.templates) ? raw.templates : [],
    page_fields: raw.page_fields || [],
    security: raw.security || {},
    courses: codes.map((code) => ({ value: code, label: courseTitles[code] || code.toUpperCase() })),
  };
}

function readJson(doc, id) {
  const el = doc.getElementById(id);
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch (error) {
    fail(`#${id} is not valid JSON (${error.message})`);
  }
  return null;
}

// Reads the JSON the page's ui_builder_data.html include wrote: the generic registry, the
// school pack, course titles from each course's data file, and (editor only) editor strings.
export function readRegistry(doc = document) {
  const generic = readJson(doc, 'ui-builder-registry');
  if (!generic) fail('#ui-builder-registry is missing from the page');
  const merged = mergeRegistry(generic, readJson(doc, 'ui-builder-school'));
  const editorText = readJson(doc, 'ui-builder-editor-text');
  if (editorText) merged.text = { ...merged.text, editor: deepMerge(merged.text.editor || {}, editorText) };
  const titles = {};
  for (const course of readJson(doc, 'ui-builder-courses') || []) {
    if (course && typeof course.code === 'string') titles[course.code] = course.title;
  }
  return normalizeRegistry(merged, { courseTitles: titles });
}

export function defOf(registry, kind, type) {
  const table = registry[KINDS[kind]];
  if (!table || typeof type !== 'string') return null;
  return Object.prototype.hasOwnProperty.call(table, type) ? table[type] : null;
}

export function emptyApiSource() {
  return {
    url: '', list_path: '', title_path: '', text_path: '', image_path: '', link_path: '',
    value_path: '', label_path: '', snapshot: { items: [], fetched_at: 0, from_loopback: false },
  };
}

export function defaultValue(field) {
  if (field.default !== undefined) {
    return Array.isArray(field.default) || isObject(field.default)
      ? JSON.parse(JSON.stringify(field.default))
      : field.default;
  }
  switch (field.type) {
    case 'toggle': return false;
    case 'number': return Number.isInteger(field.min) ? field.min : 0;
    case 'links':
    case 'items': return [];
    case 'group': return null;
    case 'api': return emptyApiSource();
    case 'choice': return field.options[0].value;
    default: return '';
  }
}

export function defaultSettings(def) {
  const settings = {};
  for (const field of (def && def.fields) || []) settings[field.id] = defaultValue(field);
  return settings;
}

// "editor.save" → registry.text.editor.save with {name} placeholders filled. A missing string
// returns its own key, so a gap shows up on screen instead of breaking the page.
export function textOf(registry, path, vars = {}) {
  let node = registry && registry.text;
  for (const part of String(path).split('.')) {
    node = isObject(node) ? node[part] : undefined;
  }
  if (typeof node !== 'string') return String(path);
  return node.replace(/\{(\w+)\}/g, (match, name) => (vars[name] === undefined ? match : String(vars[name])));
}

export function layoutOf(registry, key) {
  const layouts = registry.layouts || {};
  // Own keys only: a spec saying "__proto__" or "toString" must not reach Object.prototype.
  const own = (name) => (typeof name === 'string' && Object.prototype.hasOwnProperty.call(layouts, name) ? layouts[name] : null);
  const layout = own(key) || own('halves') || { class: 'ocs__split', cells: 2 };
  return { className: layout.class, cells: layout.cells };
}

export function cellCountOf(registry, section) {
  if (!section || section.type !== 'columns') return 1;
  return layoutOf(registry, section.settings && section.settings.layout).cells;
}

export function liveTypes(registry) {
  return new Set(Object.entries(registry.blocks).filter(([, def]) => def.live === true).map(([type]) => type));
}

export function courseOptions(registry) {
  return registry.courses || [];
}

// The insert menu: categories in registry order, each block disabled with a reason when this
// site can't run it (no Spring or Flask) or the page already has its share of live blocks.
export function paletteOf(registry, { capabilities = {}, liveCount = 0 } = {}) {
  const liveLeft = (registry.limits.live_blocks || 0) - liveCount;
  return registry.categories
    .filter((category) => category.key !== 'layout')
    .map((category) => ({
      category: category.key,
      label: category.label,
      items: Object.entries(registry.blocks)
        .filter(([, def]) => def.category === category.key)
        .map(([type, def]) => {
          let reasonKey = null;
          if (def.needs === 'spring' && !capabilities.spring) reasonKey = 'blocks.live_needs_spring';
          else if (def.needs === 'flask' && !capabilities.flask) reasonKey = 'blocks.live_needs_flask';
          else if (def.live === true && liveLeft <= 0) reasonKey = 'errors.too_many_live';
          return { type, label: def.label, help: def.help, icon: def.icon, disabled: reasonKey !== null, reasonKey };
        }),
    }))
    .filter((group) => group.items.length);
}

export function framesOf(registry) {
  return Object.entries(registry.frames).map(([type, def]) => ({ type, label: def.label, help: def.help, icon: def.icon }));
}
