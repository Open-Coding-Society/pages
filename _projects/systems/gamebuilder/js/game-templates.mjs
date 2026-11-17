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
 * choice, background and sprite.
 *
 * @usage
 * Call `validateGameTemplates(data)` once after loading the JSON. Use
 * `fieldDefault`, `createTemplateOptions` and `createListItem` to fill a
 * panel when a template is chosen or a list item is added.
 */
const ID_PATTERN = /^[a-z][A-Za-z0-9-]*$/;
const FIELD_TYPES = ['text', 'number', 'checkbox', 'choice', 'background', 'sprite'];

function fail(message) {
  throw new TypeError(`Invalid game templates: ${message}`);
}

function checkField(field, seenIds, templateId) {
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
    if (template.panel === 'rpg') continue;
    if (!Array.isArray(template.sections) || template.sections.length === 0) fail(`${template.id} needs sections`);

    const seenIds = new Set();
    for (const section of template.sections) {
      if (typeof section?.legend !== 'string') fail(`${template.id} section needs a legend`);
      const hasFields = Array.isArray(section.fields);
      const hasList = Boolean(section.list);
      // Each section is either plain fields or a single repeatable list.
      if (hasFields === hasList) fail(`${template.id} section "${section.legend}" needs fields or a list`);
      if (hasFields) {
        section.fields.forEach((field) => checkField(field, seenIds, template.id));
        continue;
      }
      const list = section.list;
      if (!ID_PATTERN.test(list.id) || seenIds.has(list.id)) fail(`${template.id} list needs a unique id`);
      seenIds.add(list.id);
      if (typeof list.itemName !== 'string' || !Array.isArray(list.fields)) fail(`${list.id} needs itemName and fields`);
      const itemIds = new Set(['id']);
      list.fields.forEach((field) => checkField(field, itemIds, `${template.id}.${list.id}`));
    }
  }
  if (!data.some((template) => template.panel === 'rpg')) fail('the RPG template is required');
  return data;
}

/** Starter value for one field; asset fields use their default asset when the catalog has it. */
export function fieldDefault(field, catalog) {
  if (field.type === 'background' || field.type === 'sprite') {
    const assets = field.type === 'background' ? catalog.backgrounds : catalog.sprites;
    return assets.has(field.default) ? field.default : assets.keys().next().value;
  }
  return field.default;
}

export function createListItem(list, existingItems, catalog) {
  const used = new Set(existingItems.map((item) => item.id));
  let number = existingItems.length + 1;
  while (used.has(`${list.id}-${number}`)) number++;
  const item = { id: `${list.id}-${number}` };
  for (const field of list.fields) item[field.id] = fieldDefault(field, catalog);
  return item;
}

export function createTemplateOptions(template, catalog) {
  const options = {};
  for (const section of template.sections ?? []) {
    if (section.list) {
      options[section.list.id] = [];
    } else {
      for (const field of section.fields) options[field.id] = fieldDefault(field, catalog);
    }
  }
  return options;
}
