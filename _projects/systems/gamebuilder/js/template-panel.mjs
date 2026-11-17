/**
 * @module template-panel
 * @description
 * Draws and reads the option panel for a data-defined game template
 * (Racing, Platform, Clicker). The RPG template keeps its own form.
 *
 * @data
 * Field definitions come from `game-templates.json` (see game-templates.mjs).
 * Options are a flat object keyed by field id; list sections store an array
 * of items, each with an `id` and one value per item field. A missing value
 * shows the field's default, so templates can gain fields without breaking
 * saved workspaces.
 *
 * @usage
 * `renderTemplatePanel(form, template, options, images)` replaces the form's
 * contents; `images` comes from `createTemplateImages(template)`. `readTemplatePanel(form, template)` returns the options shown.
 * Add, remove and draw buttons carry `data-template-action` for the caller to handle.
 */
import { fieldDefault } from './game-templates.mjs';
import { populateSelect, selectAsset } from './form-controls.mjs';

function createControl(field, value, images) {
  if (field.type === 'image') {
    const select = document.createElement('select');
    populateSelect(select, images.get(field.assetGroup));
    selectAsset(select, value);
    return select;
  }
  if (field.type === 'choice') {
    const select = document.createElement('select');
    for (const choice of field.choices) {
      const option = document.createElement('option');
      option.value = choice.value;
      option.textContent = choice.label;
      select.append(option);
    }
    select.value = value;
    return select;
  }
  const input = document.createElement('input');
  if (field.type === 'checkbox') {
    input.type = 'checkbox';
    input.checked = value;
    return input;
  }
  input.type = field.type;
  input.value = String(value);
  if (field.type === 'number') {
    input.min = String(field.min);
    input.max = String(field.max);
    input.step = String(field.step);
  }
  return input;
}

function createField(field, values, images) {
  const value = values[field.id] ?? fieldDefault(field, images);
  const control = createControl(field, value, images);
  control.dataset.templateField = field.id;
  const label = document.createElement('label');
  if (field.type === 'checkbox') {
    label.className = 'ocs__gamebuilder-checkbox';
    label.append(control, document.createTextNode(field.label));
  } else {
    control.className = 'ocs__input';
    control.required = true;
    label.append(document.createTextNode(field.label), control);
  }
  return label;
}

function createActionButton(text, action, listId, itemId = '') {
  const button = document.createElement('button');
  button.className = 'ocs__btn';
  button.type = 'button';
  button.textContent = text;
  button.dataset.templateAction = action;
  button.dataset.listId = listId;
  if (itemId) button.dataset.itemId = itemId;
  return button;
}

function renderList(list, items, images) {
  const wrapper = document.createElement('div');
  wrapper.dataset.templateList = list.id;
  const addButton = createActionButton(`Add ${list.itemName.toLowerCase()}`, 'add-item', list.id);
  // Lists marked with `draw` can also be placed by drawing on the preview.
  const drawButton = list.draw
    ? createActionButton(`Draw ${list.itemName.toLowerCase()} on preview`, 'draw-item', list.id)
    : null;
  const empty = document.createElement('p');
  empty.className = 'ocs__gamebuilder-form-help';
  empty.textContent = `No ${list.itemName.toLowerCase()}s added yet.`;
  empty.hidden = items.length > 0;
  wrapper.append(...[addButton, drawButton, empty].filter(Boolean));

  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'ocs__gamebuilder-npc';
    card.dataset.itemId = item.id;
    const header = document.createElement('header');
    header.className = 'ocs__gamebuilder-npc-header';
    const title = document.createElement('h3');
    title.textContent = `${list.itemName} ${index + 1}`;
    const removeButton = createActionButton('Remove', 'remove-item', list.id, item.id);
    removeButton.setAttribute('aria-label', `Remove ${title.textContent}`);
    header.append(title, removeButton);
    const fields = document.createElement('div');
    fields.className = 'ocs__gamebuilder-npc-fields';
    fields.append(...list.fields.map((field) => createField(field, item, images)));
    card.append(header, fields);
    wrapper.append(card);
  });
  return wrapper;
}

export function renderTemplatePanel(form, template, options, images) {
  form.replaceChildren();
  for (const section of template.sections) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = section.legend;
    fieldset.append(legend);
    if (section.help) {
      const help = document.createElement('p');
      help.className = 'ocs__gamebuilder-form-help';
      help.textContent = section.help;
      fieldset.append(help);
    }
    if (section.list) {
      fieldset.append(renderList(section.list, options[section.list.id] ?? [], images));
    } else {
      fieldset.append(...section.fields.map((field) => createField(field, options, images)));
    }
    form.append(fieldset);
  }
}

function readControl(control, field) {
  if (field.type === 'checkbox') return control.checked;
  if (field.type === 'number') return control.value === '' ? '' : Number(control.value);
  return control.value;
}

function readFields(scope, fields) {
  const values = {};
  for (const field of fields) {
    values[field.id] = readControl(scope.querySelector(`[data-template-field="${field.id}"]`), field);
  }
  return values;
}

export function readTemplatePanel(form, template) {
  const options = {};
  for (const section of template.sections) {
    if (section.list) {
      const cards = form.querySelectorAll(`[data-template-list="${section.list.id}"] > [data-item-id]`);
      options[section.list.id] = [...cards].map((card) => ({
        id: card.dataset.itemId,
        ...readFields(card, section.list.fields)
      }));
    } else {
      Object.assign(options, readFields(form, section.fields));
    }
  }
  return options;
}
