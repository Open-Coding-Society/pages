import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FIELD_TYPES, cellCountOf, defOf, defaultSettings, layoutOf, liveTypes, mergeRegistry, normalizeRegistry,
  paletteOf, textOf,
} from '../js/registry.js';
import { loadRegistry, needsRuby, readYaml } from './helpers.mjs';

const LIVE = ['announcements', 'api_data', 'calendar', 'chat', 'feedback', 'kanban', 'members', 'message_me'];

function allFields(registry) {
  const out = [];
  const walk = (fields, where) => {
    for (const field of fields || []) {
      out.push({ where: `${where}.${field.id}`, field });
      if (field.type === 'items') walk(field.item_fields, `${where}.${field.id}`);
    }
  };
  for (const [type, def] of Object.entries(registry.blocks)) walk(def.fields, `blocks.${type}`);
  for (const [type, def] of Object.entries(registry.frames)) walk(def.fields, `frames.${type}`);
  walk(registry.page_fields, 'page');
  return out;
}

test('the generic registry and the school pack load, merge and pass the shape checks', needsRuby, () => {
  const registry = loadRegistry();
  assert.ok(Object.keys(registry.blocks).length >= 20);
  assert.ok(defOf(registry, 'block', 'announcements'), 'school blocks are merged in');
  assert.ok(defOf(registry, 'block', 'hero'), 'generic blocks stay');
  assert.ok(registry.templates.some((t) => t.key === 'natm_booth'), 'school templates are appended');
  assert.ok(registry.templates.some((t) => t.key === 'blank'));
  assert.deepEqual(registry.courses.find((c) => c.value === 'csp'), { value: 'csp', label: 'Computer Science Principles' });
  assert.deepEqual(registry.courses.find((c) => c.value === 'csa'), { value: 'csa', label: 'CSA' });
});

test('Spring can validate by key name: URLs only under url/src/image, rich text only under body', needsRuby, () => {
  for (const { where, field } of allFields(loadRegistry())) {
    if (field.type === 'url') assert.equal(field.id, 'url', `${where} is a url field`);
    if (field.type === 'image') assert.ok(['src', 'image'].includes(field.id), `${where} is an image field`);
    if (field.type === 'richtext') assert.equal(field.id, 'body', `${where} is a rich text field`);
    if (field.id === 'body') assert.equal(field.type, 'richtext', `${where} is named body`);
    if (['url', 'src', 'image', 'link'].includes(field.id)) assert.ok(['url', 'image'].includes(field.type), `${where} is named like a URL`);
    if (field.id.endsWith('_path')) assert.fail(`${where}: _path names are reserved for API mappings`);
  }
});

test('the live blocks are exactly the ones the design lists', needsRuby, () => {
  assert.deepEqual([...liveTypes(loadRegistry())].sort(), LIVE);
});

test('every block has a label, help, icon and a known category', needsRuby, () => {
  const registry = loadRegistry();
  const categories = new Set(registry.categories.map((c) => c.key));
  for (const [type, def] of Object.entries(registry.blocks)) {
    for (const key of ['label', 'help', 'icon']) assert.equal(typeof def[key], 'string', `${type}.${key}`);
    assert.ok(categories.has(def.category), `${type}.category`);
    assert.match(def.icon, /^fa-[a-z0-9-]+$/, `${type}.icon`);
  }
});

test('every columns layout option has grammar classes and a cell count', needsRuby, () => {
  const registry = loadRegistry();
  const options = registry.frames.columns.fields.find((f) => f.id === 'layout').options;
  for (const { value } of options) {
    const layout = layoutOf(registry, value);
    assert.match(layout.className, /^ocs__/, value);
    assert.ok(layout.cells === 2 || layout.cells === 3, value);
  }
  assert.equal(cellCountOf(registry, { type: 'stack', settings: {} }), 1);
  assert.equal(cellCountOf(registry, { type: 'columns', settings: { layout: 'thirds' } }), 3);
  assert.equal(cellCountOf(registry, { type: 'columns', settings: { layout: 'nope' } }), 2, 'unknown layouts fall back to halves');
});

test('defaults have the stored type of each field', needsRuby, () => {
  const registry = loadRegistry();
  const settings = defaultSettings(defOf(registry, 'block', 'api_data'));
  assert.equal(settings.view, 'cards');
  assert.equal(settings.limit, 12);
  assert.equal(settings.source.snapshot.items.length, 0);
  assert.equal(settings.title, '');
  const buttons = defaultSettings(defOf(registry, 'block', 'buttons'));
  assert.deepEqual(buttons, { links: [], emphasize_first: true });
  assert.deepEqual(defaultSettings(defOf(registry, 'block', 'chat')), { group: null, title: '' });
  assert.deepEqual(defaultSettings(defOf(registry, 'block', 'heading')), { text: '', level: '2', subtitle: '' });
  // Defaults are copies: changing one page's list never changes another's.
  const a = defaultSettings(defOf(registry, 'block', 'team'));
  a.items.push({ name: 'x' });
  assert.equal(defaultSettings(defOf(registry, 'block', 'team')).items.length, 0);
});

test('textOf fills placeholders and shows the key for missing strings', needsRuby, () => {
  const registry = loadRegistry();
  assert.equal(textOf(registry, 'errors.too_long', { field: 'Title', max: 120 }), 'Title can be at most 120 characters.');
  assert.equal(textOf(registry, 'errors.too_long', { field: 'Title' }), 'Title can be at most {max} characters.');
  assert.equal(textOf(registry, 'nope.missing'), 'nope.missing');
  assert.equal(textOf(null, 'a.b'), 'a.b');
});

test('the palette disables blocks this site cannot run and enforces the live limit', needsRuby, () => {
  const registry = loadRegistry();
  const find = (palette, type) => palette.flatMap((g) => g.items).find((i) => i.type === type);
  const flaskOnly = paletteOf(registry, { capabilities: { spring: false, flask: true } });
  assert.equal(find(flaskOnly, 'chat').disabled, true);
  assert.equal(find(flaskOnly, 'chat').reasonKey, 'blocks.live_needs_spring');
  // Feedback is filed under the published address, and a Flask-only site never publishes.
  assert.deepEqual([find(flaskOnly, 'feedback').disabled, find(flaskOnly, 'feedback').reasonKey], [true, 'blocks.live_needs_spring']);
  assert.equal(find(flaskOnly, 'hero').disabled, false);
  const full = paletteOf(registry, { capabilities: { spring: true, flask: true }, liveCount: registry.limits.live_blocks });
  assert.equal(find(full, 'kanban').reasonKey, 'errors.too_many_live');
  assert.equal(find(full, 'text').disabled, false);
  assert.ok(!full.some((g) => g.category === 'layout'), 'frames are added from the section menu, not the block palette');
});

test('templates are complete pages that only use registered frames and blocks', needsRuby, () => {
  const registry = loadRegistry();
  const keys = new Set();
  for (const template of registry.templates) {
    assert.ok(template.key && !keys.has(template.key), `unique template key ${template.key}`);
    keys.add(template.key);
    assert.equal(template.page.schemaVersion, 1);
    assert.equal(template.page.kind, 'ocs-ui-page');
    for (const section of template.page.sections) {
      assert.ok(defOf(registry, 'frame', section.type), `${template.key}: frame ${section.type}`);
      for (const cell of section.cells) {
        for (const block of cell.blocks) assert.ok(defOf(registry, 'block', block.type), `${template.key}: block ${block.type}`);
      }
    }
  }
});

test('a broken registry fails loudly at startup', () => {
  const base = { limits: {}, frames: {}, blocks: {}, layouts: {}, text: {}, categories: [{ key: 'content' }] };
  assert.throws(() => normalizeRegistry(null), /expected an object/);
  assert.throws(() => normalizeRegistry({ ...base, text: undefined }), /missing text/);
  assert.throws(() => normalizeRegistry({ ...base, blocks: { x: { category: 'nope', fields: [] } } }), /unknown category/);
  assert.throws(() => normalizeRegistry({ ...base, blocks: { x: { category: 'content', fields: [{ id: 'a', type: 'wat' }] } } }), /unknown type wat/);
  assert.throws(() => normalizeRegistry({ ...base, blocks: { x: { category: 'content', fields: [{ id: 'a', type: 'choice' }] } } }), /needs options/);
  assert.throws(() => normalizeRegistry({ ...base, blocks: { x: { category: 'content', fields: [{ id: 'a', type: 'text' }, { id: 'a', type: 'text' }] } } }), /repeats field a/);
  assert.ok(FIELD_TYPES.includes('api'));
});

test('merging keeps generic blocks and lets the school pack override strings', () => {
  const merged = mergeRegistry(
    { blocks: { a: { label: 'A' } }, text: { view: { x: '1', y: '2' } }, templates: [{ key: 'g' }], page_fields: [{ id: 'title' }] },
    { blocks: { b: { label: 'B' } }, text: { view: { y: 'school' } }, templates: [{ key: 's' }], page_fields: [{ id: 'course' }], course_codes: ['csp'] },
  );
  assert.deepEqual(Object.keys(merged.blocks), ['a', 'b']);
  assert.deepEqual(merged.text.view, { x: '1', y: 'school' });
  assert.deepEqual(merged.templates.map((t) => t.key), ['g', 's']);
  assert.deepEqual(merged.page_fields.map((f) => f.id), ['title', 'course']);
  assert.deepEqual(merged.course_codes, ['csp']);
  assert.equal(mergeRegistry({ a: 1 }, null).a, 1);
});

test('the YAML files parse with Ruby, the parser Jekyll uses', needsRuby, () => {
  assert.equal(readYaml('ui_builder.yml').schema_version, 1);
  assert.ok(Array.isArray(readYaml('ui_builder_school.yml').course_codes));
});
