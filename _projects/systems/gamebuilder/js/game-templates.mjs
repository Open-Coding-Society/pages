/**
 * @module game-templates
 * @description
 * Validates the game type list in `game-templates.json` and builds the
 * starter settings for each type. This module contains no DOM logic.
 *
 * @data
 * Each template has an `id`, a display `name`, a `description`, and
 * `codeReady` (whether Push can generate its code yet). The RPG template
 * uses the existing builder form (`panel: "rpg"`). Other templates list
 * `sections`; a section has either `fields` or one repeatable `list` whose
 * items have their own `fields`. Field types are text, number, checkbox,
 * choice and image. Each template lists its own pictures in `assets`, as
 * named groups of `{ name, src }` (for example Racing's `tracks` and `cars`);
 * `src` is a site path to an image the base game already publishes. An image
 * field names the group it chooses from with `assetGroup`. A template with
 * `barriers: true` also uses the shared spline barrier panel; its options then
 * hold a `barriers` list like the RPG builder's. A list may set `draw` to
 * "box" (needs x, y, width, height number fields) or "point" (needs x, y) so
 * its items can be drawn on the preview.
 *
 * @usage
 * Call `validateGameTemplates(data)` once after loading the JSON, then
 * `createTemplateImages(template)` for each template's picture choices. Use
 * `fieldDefault`, `createTemplateOptions` and `createListItem` with those
 * images to fill a panel when a template is chosen or a list item is added.
 */
import { toKey } from './asset-catalog.mjs';

const ID_PATTERN = /^[a-z][A-Za-z0-9-]*$/;
const FIELD_TYPES = ['text', 'number', 'checkbox', 'choice', 'image'];
// A list item that can be drawn on the preview needs number fields for what the drawing sets.
const DRAW_FIELDS = { box: ['x', 'y', 'width', 'height'], point: ['x', 'y'] };

function fail(message) {
  throw new TypeError(`Invalid game templates: ${message}`);
}

// A site path such as /images/platformer/sprites/knight.png that stays on the site.
function isSitePath(src) {
  return typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')
    && !src.includes('\\') && !src.split('/').includes('..');
}

function checkAssets(template) {
  const groups = template.assets;
  if (!groups || typeof groups !== 'object' || Array.isArray(groups)) fail(`${template.id} needs an assets object`);
  for (const [groupId, items] of Object.entries(groups)) {
    if (!Array.isArray(items) || items.length === 0) fail(`${template.id}.${groupId} needs at least one image`);
    const keys = new Set();
    for (const item of items) {
      const key = typeof item?.name === 'string' ? toKey(item.name) : '';
      if (!key || keys.has(key) || !isSitePath(item.src)) fail(`${template.id}.${groupId} has an invalid or duplicate image`);
      keys.add(key);
    }
  }
}

function checkField(field, seenIds, templateId, assets) {
  const label = `${templateId}.${field?.id}`;
  if (!field || !ID_PATTERN.test(field.id) || seenIds.has(field.id)) fail(`${label} needs a unique id`);
  seenIds.add(field.id);
  if (typeof field.label !== 'string' || !field.label.trim()) fail(`${label} needs a label`);
  if (!FIELD_TYPES.includes(field.type)) fail(`${label} has an unknown type`);

  if (field.type === 'number') {
    const bounds = [field.min, field.max, field.step, field.default];
    // A number field is usable only when its default sits inside its range.
    const inRange = bounds.every(Number.isFinite) && field.min <= field.default && field.default <= field.max;
    if (!inRange) fail(`${label} needs min <= default <= max and a step`);
  }
  if (field.type === 'choice') {
    const values = Array.isArray(field.choices) ? field.choices.map((choice) => choice?.value) : [];
    if (values.length === 0 || !values.includes(field.default)) fail(`${label} default must be one of its choices`);
  }
  if (field.type === 'image' && !Object.hasOwn(assets, field.assetGroup)) fail(`${label} names an unknown assetGroup`);
  if (field.type === 'text' && typeof field.default !== 'string') fail(`${label} needs a text default`);
  if (field.type === 'checkbox' && typeof field.default !== 'boolean') fail(`${label} needs a true/false default`);
}

export function validateGameTemplates(data) {
  if (!Array.isArray(data) || data.length === 0) fail('expected a non-empty list');
  const templateIds = new Set();
  for (const template of data) {
    if (!template || !ID_PATTERN.test(template.id) || templateIds.has(template.id)) fail('each template needs a unique id');
    templateIds.add(template.id);
    if (typeof template.name !== 'string' || typeof template.description !== 'string'
      || typeof template.codeReady !== 'boolean') fail(`${template.id} needs a name, description and codeReady`);
    if (template.barriers !== undefined && typeof template.barriers !== 'boolean') fail(`${template.id} barriers must be true or false`);
    if (template.panel === 'rpg') continue;
    if (!Array.isArray(template.sections) || template.sections.length === 0) fail(`${template.id} needs sections`);
    checkAssets(template);

    const seenIds = new Set();
    for (const section of template.sections) {
      if (typeof section?.legend !== 'string') fail(`${template.id} section needs a legend`);
      const hasFields = Array.isArray(section.fields);
      const hasList = Boolean(section.list);
      // Each section is either plain fields or a single repeatable list.
      if (hasFields === hasList) fail(`${template.id} section "${section.legend}" needs fields or a list`);
      if (hasFields) {
        section.fields.forEach((field) => checkField(field, seenIds, template.id, template.assets));
        continue;
      }
      const list = section.list;
      if (!ID_PATTERN.test(list.id) || seenIds.has(list.id)) fail(`${template.id} list needs a unique id`);
      seenIds.add(list.id);
      if (typeof list.itemName !== 'string' || !Array.isArray(list.fields)) fail(`${list.id} needs itemName and fields`);
      const itemIds = new Set(['id']);
      list.fields.forEach((field) => checkField(field, itemIds, `${template.id}.${list.id}`, template.assets));
      if (list.draw !== undefined) {
        const needed = DRAW_FIELDS[list.draw];
        const numberIds = list.fields.filter((field) => field.type === 'number').map((field) => field.id);
        if (!needed || !needed.every((id) => numberIds.includes(id))) fail(`${list.id} draw needs "box" or "point" and its number fields`);
      }
    }
  }
  if (!data.some((template) => template.panel === 'rpg')) fail('the RPG template is required');
  return data;
}

/**
 * Picture choices for one template: a Map of group id to a Map of key → the
 * picture's data (`name`, `src`, any extra details such as a track's finish
 * line) plus its `key`.
 */
export function createTemplateImages(template) {
  const groups = new Map();
  for (const [groupId, items] of Object.entries(template.assets ?? {})) {
    const entries = items.map((item) => [toKey(item.name), { ...item, key: toKey(item.name) }]);
    groups.set(groupId, new Map(entries));
  }
  return groups;
}

/** Starter value for one field; an image field starts on the first picture in its group. */
export function fieldDefault(field, images) {
  if (field.type === 'image') return images.get(field.assetGroup).keys().next().value;
  return field.default;
}

export function createListItem(list, existingItems, images) {
  const used = new Set(existingItems.map((item) => item.id));
  let number = existingItems.length + 1;
  while (used.has(`${list.id}-${number}`)) number++;
  const item = { id: `${list.id}-${number}` };
  for (const field of list.fields) item[field.id] = fieldDefault(field, images);
  return item;
}

export function createTemplateOptions(template, images) {
  const options = {};
  for (const section of template.sections ?? []) {
    if (section.list) {
      options[section.list.id] = [];
    } else {
      for (const field of section.fields) options[field.id] = fieldDefault(field, images);
    }
  }
  // Spline barriers are drawn on the preview, so they start empty.
  if (template.barriers) options.barriers = [];
  return options;
}
