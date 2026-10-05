import { createAssetCatalog } from './asset-catalog.mjs';
import { createDefaultBuilderState, createNpcState } from './builder-state.mjs';
import { generateLevelCode } from './code-generator.mjs?v=2';
import { waitForGameRunner } from './runner-bridge.mjs';

const root = document.querySelector('[data-gamebuilder-workbench]');
if (!root) {
  throw new Error('GameBuilder workbench root was not found');
}

const status = root.querySelector('[data-role="status"]');
const builderPanel = root.querySelector('[data-role="builder-panel"]');
const workspace = root.querySelector('[data-role="workspace"]');
const collapseButton = root.querySelector('[data-action="toggle-builder"]');
const form = root.querySelector('[data-role="builder-form"]');
const generateButton = root.querySelector('[data-action="generate"]');
const npcList = form.querySelector('[data-role="npc-list"]');
const npcEmptyMessage = form.querySelector('[data-role="npc-empty"]');

function setStatus(message, state = 'info') {
  status.textContent = message;
  status.dataset.state = state;
}

function siteUrl(path) {
  return `${root.dataset.baseUrl || ''}${path}`;
}

async function fetchManifest(url, label) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${label} manifest (${response.status})`);
  }
  const manifest = await response.json();
  if (!Array.isArray(manifest)) {
    throw new TypeError(`${label} manifest must contain a JSON array`);
  }
  return manifest;
}

function populateSelect(select, entries) {
  select.replaceChildren();
  for (const entry of entries.values()) {
    const option = document.createElement('option');
    option.value = entry.key;
    option.textContent = entry.name;
    select.append(option);
  }
}

function readForm(state) {
  const numberValue = (input) => input.value === '' ? Number.NaN : Number(input.value);
  return {
    ...state,
    name: form.elements.namedItem('game-name').value,
    backgroundKey: form.elements.namedItem('background').value,
    player: {
      ...state.player,
      name: form.elements.namedItem('player-name').value,
      spriteKey: form.elements.namedItem('player-sprite').value,
      position: {
        x: numberValue(form.elements.namedItem('player-x')),
        y: numberValue(form.elements.namedItem('player-y'))
      }
    },
    npcs: [...npcList.querySelectorAll('[data-npc-id]')].map((card) => ({
      id: card.dataset.npcId,
      name: card.querySelector('[data-npc-field="name"]').value,
      spriteKey: card.querySelector('[data-npc-field="spriteKey"]').value,
      greeting: card.querySelector('[data-npc-field="greeting"]').value,
      position: {
        x: numberValue(card.querySelector('[data-npc-field="x"]')),
        y: numberValue(card.querySelector('[data-npc-field="y"]'))
      }
    }))
  };
}

function fillForm(state) {
  form.elements.namedItem('game-name').value = state.name;
  form.elements.namedItem('background').value = state.backgroundKey;
  form.elements.namedItem('player-name').value = state.player.name;
  form.elements.namedItem('player-sprite').value = state.player.spriteKey;
  form.elements.namedItem('player-x').value = String(state.player.position.x);
  form.elements.namedItem('player-y').value = String(state.player.position.y);
}

function createNpcField(labelText, fieldName, type, value, entries = null) {
  const label = document.createElement('label');
  label.append(document.createTextNode(labelText));

  const control = type === 'select'
    ? document.createElement('select')
    : type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');
  control.className = 'ocs__input';
  control.dataset.npcField = fieldName;

  if (type === 'select') {
    populateSelect(control, entries);
    control.value = value;
    control.required = true;
  } else if (type === 'textarea') {
    control.rows = 2;
    control.value = value;
  } else {
    control.type = type;
    control.value = String(value);
    control.required = true;
    if (type === 'number') {
      control.min = '0';
      control.max = '1';
      control.step = '0.01';
    }
  }

  label.append(control);
  return label;
}

function renderNpcs(npcs, sprites) {
  npcList.replaceChildren();
  npcEmptyMessage.hidden = npcs.length > 0;
  for (const [index, npc] of npcs.entries()) {
    const card = document.createElement('article');
    card.className = 'ocs__gamebuilder-npc';
    card.dataset.npcId = npc.id;

    const header = document.createElement('header');
    header.className = 'ocs__gamebuilder-npc-header';
    const title = document.createElement('h3');
    title.textContent = npc.name.trim() || `NPC ${index + 1}`;
    const removeButton = document.createElement('button');
    removeButton.className = 'ocs__btn';
    removeButton.type = 'button';
    removeButton.dataset.action = 'remove-npc';
    removeButton.dataset.npcRemoveId = npc.id;
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${title.textContent}`);
    header.append(title, removeButton);

    const fields = document.createElement('div');
    fields.className = 'ocs__gamebuilder-npc-fields';
    fields.append(
      createNpcField('Name', 'name', 'text', npc.name),
      createNpcField('Sprite', 'spriteKey', 'select', npc.spriteKey, sprites),
      createNpcField('X position (0–1)', 'x', 'number', npc.position.x),
      createNpcField('Y position (0–1)', 'y', 'number', npc.position.y),
      createNpcField('Greeting', 'greeting', 'textarea', npc.greeting)
    );
    card.append(header, fields);
    npcList.append(card);
  }
}

collapseButton.addEventListener('click', () => {
  const expanded = collapseButton.getAttribute('aria-expanded') === 'true';
  collapseButton.setAttribute('aria-expanded', String(!expanded));
  collapseButton.textContent = expanded ? 'Show builder' : 'Hide builder';
  builderPanel.hidden = expanded;
  workspace.classList.toggle('is-builder-collapsed', expanded);
});

try {
  const [backgroundManifest, spriteManifest, runner] = await Promise.all([
    fetchManifest(siteUrl('/images/projects/gamebuilder/bg/index.json'), 'Background'),
    fetchManifest(siteUrl('/images/projects/gamebuilder/sprites/index.json'), 'Sprite'),
    waitForGameRunner('gamebuilder-v2')
  ]);
  const catalog = createAssetCatalog(backgroundManifest, spriteManifest);
  populateSelect(form.elements.namedItem('background'), catalog.backgrounds);
  populateSelect(form.elements.namedItem('player-sprite'), catalog.sprites);

  const firstBackground = catalog.backgrounds.keys().next().value;
  const defaultSprite = catalog.sprites.has('chill_guy')
    ? 'chill_guy'
    : catalog.sprites.keys().next().value;
  let state = createDefaultBuilderState(firstBackground, defaultSprite);
  let nextNpcIndex = 0;
  let lastGeneratedCode = '';
  fillForm(state);
  renderNpcs(state.npcs, catalog.sprites);

  form.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'add-npc') {
      state = readForm(state);
      const npc = createNpcState(nextNpcIndex++, defaultSprite);
      state.npcs.push(npc);
      renderNpcs(state.npcs, catalog.sprites);
      state = readForm(state);
      npcList.querySelector(`[data-npc-id="${npc.id}"] [data-npc-field="name"]`).focus();
      setStatus('NPC added. Configure it and generate code to sync it to GAME_RUNNER.');
    } else if (button.dataset.action === 'remove-npc') {
      const npcId = button.dataset.npcRemoveId;
      state = readForm(state);
      state.npcs = state.npcs.filter((npc) => npc.id !== npcId);
      renderNpcs(state.npcs, catalog.sprites);
      setStatus('NPC removed. Generate code to sync the change to GAME_RUNNER.');
    }
  });

  form.addEventListener('input', () => {
    state = readForm(state);
    for (const card of npcList.querySelectorAll('[data-npc-id]')) {
      const title = card.querySelector('h3');
      title.textContent = card.querySelector('[data-npc-field="name"]').value.trim() || `NPC ${[...npcList.children].indexOf(card) + 1}`;
      card.querySelector('[data-action="remove-npc"]').setAttribute('aria-label', `Remove ${title.textContent}`);
    }
    setStatus('Builder settings changed. Generate code to sync them to GAME_RUNNER.');
  });
  form.addEventListener('change', () => {
    state = readForm(state);
    setStatus('Builder settings changed. Generate code to sync them to GAME_RUNNER.');
  });

  generateButton.addEventListener('click', () => {
    state = readForm(state);
    const result = generateLevelCode(state, catalog);
    if (result.errors.length > 0) {
      setStatus(result.errors.map((error) => error.message).join(' '), 'error');
      return;
    }

    const currentCode = runner.getCode();
    if (currentCode.trim() && currentCode !== lastGeneratedCode) {
      const confirmed = window.confirm('Replace the code currently in GAME_RUNNER with generated code?');
      if (!confirmed) return;
    }
    runner.setCode(result.code);
    lastGeneratedCode = result.code;
    setStatus('Generated code is synced to GAME_RUNNER. Use its Run button to play.');
  });

  if (runner.getCode().trim()) {
    setStatus('Existing GAME_RUNNER code was preserved. Choose Generate / Sync Code when ready to replace it.');
  } else {
    generateButton.click();
  }
} catch (error) {
  console.error('GameBuilder workbench initialization failed:', error);
  setStatus(error.message || 'GameBuilder could not initialize.', 'error');
}
