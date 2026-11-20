/**
 * @module app
 * @description
 * Browser entry point for the GameBuilder v2 workbench. Connects the semantic
 * builder form to asset manifests, builder state, generated GameEngine code,
 * and the shared GAME_RUNNER controller.
 *
 * @data
 * Reads background and sprite manifest JSON from the published
 * `/images/projects/gamebuilder/` paths, and the game type list from
 * `game-templates.json` next to this module. The RPG type uses the builder
 * form below; other types show a data-defined option panel. The RPG form
 * edits a versioned builder document containing `name`, `backgroundKey`,
 * `player`, `npcs`, and open spline barriers. Positions and barrier points use normalized `x`/`y` values
 * from 0 to 1.
 *
 * @usage
 * Load this module from the GameBuilder v2 page after its workbench markup and
 * GAME_RUNNER include. The page root must expose `data-gamebuilder-workbench`;
 * its descendants provide the `data-role` and `data-action` hooks queried
 * below. Generate / Sync Code validates the current form and sends generated
 * source through the runner controller's `setCode` method. Persistence captures
 * both form and exact source; restoring a workspace never regenerates code.
 */
import { createAssetCatalog } from './asset-catalog.mjs';
import { createBarrierPlacementEditor } from './barrier-editor.mjs';
import { createPlacementEditor } from './placement-editor.mjs';
import { createDefaultBuilderState, createNpcState } from './builder-state.mjs';
import { populateSelect, selectAsset } from './form-controls.mjs';
import { createListItem, createTemplateImages, createTemplateOptions, validateGameTemplates } from './game-templates.mjs';
import { readTemplatePanel, renderTemplatePanel } from './template-panel.mjs';
import { generateLevelCode } from './code-generator.mjs?v=2';
import { generateClickerCode } from './generators/clicker.mjs';
import { generatePlatformCode } from './generators/platform.mjs';
import { generateRacingCode } from './generators/racing.mjs';
import { waitForGameRunner } from './runner-bridge.mjs';
import { createWorkspacePersistence } from './workspace-persistence.mjs';
import { createActionFeedback } from './action-feedback.mjs';
import { importLevelCode } from './code-importer.mjs';
import { styleRunnerIcons } from './runner-icons.mjs';

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
const barrierForm = root.querySelector('[data-role="barrier-form"]');
const barrierList = barrierForm.querySelector('[data-role="barrier-list"]');
const barrierEmptyMessage = barrierForm.querySelector('[data-role="barrier-empty"]');
const addBarrierButton = barrierForm.querySelector('[data-action="add-barrier"]');
const templateChoices = root.querySelector('[data-role="template-choices"]');
const templateDescription = root.querySelector('[data-role="template-description"]');
const templateForm = root.querySelector('[data-role="template-form"]');

const setStatus = createActionFeedback(status);

// Code generators for the data-defined game types, by template id.
const templateGenerators = {
  racing: generateRacingCode,
  platform: generatePlatformCode,
  clicker: generateClickerCode
};

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

function readForm(state) {
  const numberValue = (input) => input.value === '' ? '' : Number(input.value);
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
  selectAsset(form.elements.namedItem('background'), state.backgroundKey);
  form.elements.namedItem('player-name').value = state.player.name;
  selectAsset(form.elements.namedItem('player-sprite'), state.player.spriteKey);
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
    selectAsset(control, value);
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

function renderBarriers(barriers, activeId) {
  barrierList.replaceChildren();
  barrierEmptyMessage.hidden = barriers.length > 0;
  for (const [index, barrier] of barriers.entries()) {
    const card = document.createElement('article');
    card.className = 'ocs__gamebuilder-barrier';
    card.dataset.barrierId = barrier.id;

    const title = document.createElement('h3');
    title.textContent = barrier.name;
    const pointCount = document.createElement('p');
    pointCount.textContent = `${barrier.points.length} ${barrier.points.length === 1 ? 'point' : 'points'}`;
    const pointList = document.createElement('ol');
    pointList.className = 'ocs__gamebuilder-barrier-points';
    pointList.setAttribute('aria-label', `${barrier.name} control points`);
    if (barrier.points.length === 0) {
      const emptyPoint = document.createElement('li');
      emptyPoint.textContent = 'No points added yet.';
      pointList.append(emptyPoint);
    } else {
      barrier.points.forEach((point, pointIndex) => {
        const pointItem = document.createElement('li');
        pointItem.textContent = `Point ${pointIndex + 1}: X ${point.x}, Y ${point.y}`;
        pointList.append(pointItem);
      });
    }

    const actions = document.createElement('div');
    actions.className = 'ocs__gamebuilder-barrier-card-actions';
    const editButton = document.createElement('button');
    editButton.className = 'ocs__btn';
    editButton.type = 'button';
    editButton.dataset.action = 'edit-barrier';
    editButton.dataset.barrierId = barrier.id;
    editButton.textContent = activeId === barrier.id ? 'Editing' : `Edit Barrier ${index + 1}`;
    editButton.disabled = Boolean(activeId);
    editButton.setAttribute('aria-label', `Edit ${barrier.name}`);
    const visibilityButton = document.createElement('button');
    visibilityButton.className = 'ocs__btn';
    visibilityButton.type = 'button';
    visibilityButton.dataset.action = 'toggle-barrier-visibility';
    visibilityButton.dataset.barrierId = barrier.id;
    visibilityButton.textContent = barrier.visible === false ? 'Show' : 'Hide';
    visibilityButton.setAttribute(
      'aria-label',
      `${barrier.visible === false ? 'Show' : 'Hide'} ${barrier.name}`
    );
    visibilityButton.setAttribute('aria-pressed', String(barrier.visible !== false));
    visibilityButton.disabled = activeId === barrier.id;
    const removeButton = document.createElement('button');
    removeButton.className = 'ocs__btn';
    removeButton.type = 'button';
    removeButton.dataset.action = 'remove-barrier';
    removeButton.dataset.barrierId = barrier.id;
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${barrier.name}`);
    if (activeId === barrier.id) {
      for (const [action, label, disabled] of [
        ['undo-barrier-point', 'Undo point', barrier.points.length === 0],
        ['finish-barrier', 'Finish barrier', barrier.points.length < 2],
        ['cancel-barrier', 'Cancel', false]
      ]) {
        const button = document.createElement('button');
        button.className = action === 'finish-barrier' ? 'ocs__btn primary' : 'ocs__btn';
        button.type = 'button';
        button.dataset.action = action;
        button.dataset.barrierId = barrier.id;
        button.textContent = label;
        button.disabled = disabled;
        actions.append(button);
      }
    } else {
      actions.append(editButton, visibilityButton, removeButton);
    }

    card.append(title, pointCount, pointList, actions);
    barrierList.append(card);
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
  const [backgroundManifest, spriteManifest, templateList, runner] = await Promise.all([
    fetchManifest(siteUrl('/images/projects/gamebuilder/bg/index.json'), 'Background'),
    fetchManifest(siteUrl('/images/projects/gamebuilder/sprites/index.json'), 'Sprite'),
    fetchManifest(new URL('./game-templates.json', import.meta.url), 'Game template'),
    waitForGameRunner('gamebuilder-v2')
  ]);
  const catalog = createAssetCatalog(backgroundManifest, spriteManifest);
  const templates = new Map(validateGameTemplates(templateList).map((template) => [template.id, template]));
  const rpgTemplateId = templateList.find((template) => template.panel === 'rpg').id;
  // Each game type offers only the pictures its base game uses.
  const templateImages = new Map(templateList.map((template) => [template.id, createTemplateImages(template)]));
  styleRunnerIcons(root);
  populateSelect(form.elements.namedItem('background'), catalog.backgrounds);
  populateSelect(form.elements.namedItem('player-sprite'), catalog.sprites);

  const firstBackground = catalog.backgrounds.keys().next().value;
  const defaultSprite = catalog.sprites.has('chill_guy')
    ? 'chill_guy'
    : catalog.sprites.keys().next().value;
  let state = createDefaultBuilderState(firstBackground, defaultSprite);
  let nextNpcIndex = 0;
  let nextBarrierIndex = 0;
  let activeBarrierId = null;
  let barrierEditSnapshot = null;
  let lastGeneratedCode = '';
  let persistence = null;
  let templateId = rpgTemplateId;
  let templateOptions = {};
  const barrierEditor = createBarrierPlacementEditor(
    root.querySelector('.ocs__gamebuilder-runner .gameContainer'),
    (barrierId, point) => {
      const barrier = barrierOwner().barriers.find((entry) => entry.id === barrierId);
      if (!barrier) {
        throw new Error(`Barrier "${barrierId}" is no longer available`);
      }
      barrier.points.push(point);
      updateBarrierEditor();
      persistence?.changed();
      setStatus(`${barrier.name}: point ${barrier.points.length} added.`);
    }
  );
  // The list whose next item is being drawn on the preview, if any.
  let drawingListId = null;
  const placementEditor = createPlacementEditor(
    root.querySelector('.ocs__gamebuilder-runner .gameContainer'),
    (placed) => addDrawnItem(placed),
    () => {
      drawingListId = null;
      setStatus('Drawing canceled.');
    }
  );
  fillForm(state);
  renderNpcs(state.npcs, catalog.sprites);
  renderTemplateChoices();
  showTemplate(templateId);

  function renderTemplateChoices() {
    templateChoices.replaceChildren();
    for (const template of templates.values()) {
      const label = document.createElement('label');
      label.className = 'ocs__gamebuilder-template-choice';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'game-template';
      radio.value = template.id;
      label.append(radio, document.createTextNode(template.name));
      templateChoices.append(label);
    }
  }

  function isRpgTemplate() {
    return templateId === rpgTemplateId;
  }

  /** Whether the open game type uses the spline barrier panel (RPG always does). */
  function hasBarriers() {
    return isRpgTemplate() || templates.get(templateId).barriers === true;
  }

  /** The settings that hold the open game type's barriers: RPG state or that type's options. */
  function barrierOwner() {
    return isRpgTemplate() ? state : templateOptions[templateId];
  }

  /** Keeps the open panel's values before switching away or saving. */
  function storeOpenTemplateOptions() {
    if (isRpgTemplate()) return;
    const options = readTemplatePanel(templateForm, templates.get(templateId));
    // Barriers are drawn on the preview, not read from the panel, so keep them.
    if (hasBarriers()) options.barriers = templateOptions[templateId]?.barriers ?? [];
    templateOptions[templateId] = options;
  }

  function listFor(id) {
    return templates.get(templateId).sections.find((section) => section.list?.id === id).list;
  }

  /** Adds an item to the list being drawn, at the box or point drawn on the preview. */
  function addDrawnItem(placed) {
    const list = listFor(drawingListId);
    drawingListId = null;
    storeOpenTemplateOptions();
    const items = templateOptions[templateId][list.id];
    const item = createListItem(list, items, templateImages.get(templateId));
    for (const [key, value] of Object.entries(placed)) {
      const field = list.fields.find((entry) => entry.id === key);
      item[key] = Math.min(field.max, Math.max(field.min, value));
    }
    items.push(item);
    renderTemplatePanel(templateForm, templates.get(templateId), templateOptions[templateId], templateImages.get(templateId));
    persistence.changed();
    setStatus(`${list.itemName} ${items.length} drawn. Draw another, adjust its numbers, or Push to see it.`);
  }

  function showTemplate(id) {
    placementEditor.cancel();
    templateId = id;
    const template = templates.get(id);
    templateChoices.querySelector(`input[value="${id}"]`).checked = true;
    templateDescription.textContent = template.codeReady
      ? template.description
      : `${template.description} Code generation for this game type is coming soon; your settings are saved.`;
    form.hidden = !isRpgTemplate();
    templateForm.hidden = isRpgTemplate();
    if (isRpgTemplate()) {
      templateForm.replaceChildren();
    } else {
      templateOptions[id] ??= createTemplateOptions(template, templateImages.get(id));
      // Settings saved before this type had barriers start with none.
      if (hasBarriers()) templateOptions[id].barriers ??= [];
      renderTemplatePanel(templateForm, template, templateOptions[id], templateImages.get(id));
    }
    barrierForm.hidden = !hasBarriers();
    updateBarrierEditor();
  }

  function updateBarrierEditor() {
    const barriers = hasBarriers() ? barrierOwner().barriers : [];
    addBarrierButton.disabled = Boolean(activeBarrierId);
    renderBarriers(barriers, activeBarrierId);
    barrierEditor.setBarriers(barriers, activeBarrierId);
  }

  function beginBarrierEdit(barrierId) {
    const barrier = barrierOwner().barriers.find((entry) => entry.id === barrierId);
    if (!barrier) {
      throw new Error(`Barrier "${barrierId}" is no longer available`);
    }
    activeBarrierId = barrierId;
    barrierEditSnapshot = barrier.points.map((point) => ({ ...point }));
    updateBarrierEditor();
    setStatus(`Editing ${barrier.name}. Click the preview to add points.`);
  }

  function captureWorkspace() {
    storeOpenTemplateOptions();
    return {
      schemaVersion: 2,
      template: { id: templateId, options: structuredClone(templateOptions) },
      kind: 'ocs-gamebuilder-workspace',
      builderState: readForm(state),
      editorCode: runner.getCode(),
      lastGeneratedCode,
      engineVersion: runner.getEngineVersion(),
      collapsed: builderPanel.hidden,
      editing: { activeBarrierId, barrierEditSnapshot, nextNpcIndex, nextBarrierIndex }
    };
  }

  function restoreWorkspace(document) {
    runner.stop();
    state = structuredClone(document.builderState);
    ({ activeBarrierId, barrierEditSnapshot, nextNpcIndex, nextBarrierIndex } = structuredClone(document.editing));
    lastGeneratedCode = document.lastGeneratedCode;
    templateOptions = structuredClone(document.template.options);
    const knownTemplate = templates.has(document.template.id);
    showTemplate(knownTemplate ? document.template.id : rpgTemplateId);
    fillForm(state);
    renderNpcs(state.npcs, catalog.sprites);
    updateBarrierEditor();
    builderPanel.hidden = document.collapsed;
    workspace.classList.toggle('is-builder-collapsed', document.collapsed);
    collapseButton.setAttribute('aria-expanded', String(!document.collapsed));
    collapseButton.textContent = document.collapsed ? 'Show builder' : 'Hide builder';
    runner.setEngineVersion(document.engineVersion);
    runner.setCode(document.editorCode);
    const missing = [state.backgroundKey, state.player.spriteKey, ...state.npcs.map((npc) => npc.spriteKey)]
      .filter((key, index) => !(index === 0 ? catalog.backgrounds : catalog.sprites).has(key));
    if (!knownTemplate) {
      setStatus(`Game type "${document.template.id}" is no longer available, so the RPG builder is shown. Its saved settings are kept.`, 'error');
      return;
    }
    setStatus(missing.length ? `Workspace restored with unavailable assets: ${missing.join(', ')}. Choose replacements before generating.`
      : 'Workspace restored without regenerating code.', missing.length ? 'error' : 'info');
  }

  persistence = createWorkspacePersistence({
    root, runner, capture: captureWorkspace, restore: restoreWorkspace
  });
  collapseButton.addEventListener('click', persistence.changed);

  function replacePanel(nextState) {
    state = nextState;
    activeBarrierId = null;
    barrierEditSnapshot = null;
    nextNpcIndex = 0;
    nextBarrierIndex = 0;
    fillForm(state);
    renderNpcs(state.npcs, catalog.sprites);
    updateBarrierEditor();
    persistence.changed();
  }

  root.querySelector('[data-action="clear-builder"]').addEventListener('click', () => {
    if (!window.confirm('Reset builder panels to starter settings? Runner code and the saved workspace are kept.')) return;
    if (!isRpgTemplate()) {
      templateOptions[templateId] = createTemplateOptions(templates.get(templateId), templateImages.get(templateId));
      showTemplate(templateId);
      persistence.changed();
      setStatus(`${templates.get(templateId).name} settings reset. Runner code is unchanged.`);
      return;
    }
    replacePanel(createDefaultBuilderState(firstBackground, defaultSprite));
    setStatus('Builder cleared. Runner code is unchanged.');
  });

  root.querySelector('[data-action="pull"]').addEventListener('click', () => {
    if (!isRpgTemplate()) {
      setStatus(`Pull reads RPG code only for now. Choose the ${templates.get(rpgTemplateId).name} game type to pull.`, 'error');
      return;
    }
    try {
      const source = runner.getCode();
      const result = importLevelCode(source, catalog);
      if (!window.confirm(`Replace panel settings from the current code?${result.canRegenerate ? '' : ' Custom code is preserved; Push will be blocked to avoid losing it.'}`)) return;
      replacePanel(result.state);
      lastGeneratedCode = generateLevelCode(result.state, catalog).code;
      setStatus(result.canRegenerate ? 'Settings pulled from code. Runner source is unchanged.'
        : 'Supported settings pulled. Custom code is preserved; edit it in the runner, not with Push.');
    } catch (error) {
      console.error('GameBuilder code pull failed:', error);
      setStatus(`${error.message}. Panels and source are unchanged.`, 'error');
    }
  });

  form.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'add-npc') {
      state = readForm(state);
      while (state.npcs.some((npc) => npc.id === `npc-${nextNpcIndex + 1}`)) nextNpcIndex++;
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
    persistence.changed();
  });

  barrierForm.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    // Keep the open panel's values current before its barrier list changes.
    if (isRpgTemplate()) state = readForm(state);
    else storeOpenTemplateOptions();

    placementEditor.cancel();
    if (button.dataset.action === 'add-barrier') {
      if (activeBarrierId) return;
      while (barrierOwner().barriers.some((barrier) => barrier.id === `barrier-${nextBarrierIndex + 1}`)) nextBarrierIndex++;
      const index = nextBarrierIndex++;
      const barrier = {
        id: `barrier-${index + 1}`,
        name: `Barrier ${index + 1}`,
        visible: true,
        points: []
      };
      barrierOwner().barriers.push(barrier);
      beginBarrierEdit(barrier.id);
    } else if (button.dataset.action === 'edit-barrier') {
      if (activeBarrierId) return;
      beginBarrierEdit(button.dataset.barrierId);
    } else if (button.dataset.action === 'remove-barrier') {
      const barrierId = button.dataset.barrierId;
      barrierOwner().barriers = barrierOwner().barriers.filter((barrier) => barrier.id !== barrierId);
      if (activeBarrierId === barrierId) {
        activeBarrierId = null;
        barrierEditSnapshot = null;
      }
      updateBarrierEditor();
      setStatus('Barrier removed. Generate code to sync the change to GAME_RUNNER.');
    } else if (button.dataset.action === 'toggle-barrier-visibility') {
      const barrier = barrierOwner().barriers.find((entry) => entry.id === button.dataset.barrierId);
      if (!barrier || barrier.id === activeBarrierId) return;
      barrier.visible = barrier.visible === false;
      updateBarrierEditor();
      setStatus(
        `${barrier.name} ${barrier.visible ? 'shown' : 'hidden'}. Hidden barriers still block player movement.`
      );
    } else if (button.dataset.action === 'undo-barrier-point') {
      const barrier = barrierOwner().barriers.find((entry) => entry.id === activeBarrierId);
      if (!barrier?.points.length) return;
      barrier.points.pop();
      updateBarrierEditor();
      const nextAction = barrier.points.length > 0 ? 'undo-barrier-point' : 'cancel-barrier';
      barrierList.querySelector(`[data-action="${nextAction}"]`).focus({ preventScroll: true });
      setStatus(`${barrier.name}: last point removed.`);
    } else if (button.dataset.action === 'finish-barrier') {
      const barrier = barrierOwner().barriers.find((entry) => entry.id === activeBarrierId);
      if (!barrier || barrier.points.length < 2) {
        setStatus('Add at least two points before finishing a barrier.', 'error');
        return;
      }
      activeBarrierId = null;
      barrierEditSnapshot = null;
      updateBarrierEditor();
      barrierList.querySelector(
        `[data-action="edit-barrier"][data-barrier-id="${barrier.id}"]`
      ).focus({ preventScroll: true });
      setStatus(`${barrier.name} finished. Add another barrier or generate code.`);
    } else if (button.dataset.action === 'cancel-barrier') {
      const barrierId = activeBarrierId;
      const barrier = barrierOwner().barriers.find((entry) => entry.id === barrierId);
      if (barrierEditSnapshot?.length) {
        barrier.points = barrierEditSnapshot;
      } else {
        barrierOwner().barriers = barrierOwner().barriers.filter((entry) => entry.id !== barrierId);
      }
      activeBarrierId = null;
      barrierEditSnapshot = null;
      updateBarrierEditor();
      addBarrierButton.focus();
      setStatus('Barrier editing canceled.');
    }
    persistence.changed();
  });

  form.addEventListener('input', () => {
    state = readForm(state);
    for (const card of npcList.querySelectorAll('[data-npc-id]')) {
      const title = card.querySelector('h3');
      title.textContent = card.querySelector('[data-npc-field="name"]').value.trim() || `NPC ${[...npcList.children].indexOf(card) + 1}`;
      card.querySelector('[data-action="remove-npc"]').setAttribute('aria-label', `Remove ${title.textContent}`);
    }
    persistence.changed();
  });
  form.addEventListener('change', () => {
    state = readForm(state);
    persistence.changed();
  });

  function generateCode() {
    if (isRpgTemplate()) {
      state = readForm(state);
      return generateLevelCode(state, catalog);
    }
    storeOpenTemplateOptions();
    return templateGenerators[templateId](templateOptions[templateId], templateImages.get(templateId));
  }

  /** Code that GameBuilder did not just generate is replaced only if the panels could rebuild it. */
  function isSafeToReplace(currentCode) {
    const isGeneratedOrEmpty = !currentCode.trim() || currentCode === lastGeneratedCode;
    if (isGeneratedOrEmpty) return true;
    try {
      if (importLevelCode(currentCode, catalog).canRegenerate) return true;
      setStatus('Push blocked: current source contains code the panels cannot preserve. Export it first; Clear the runner only when you intend to replace it.', 'error');
    } catch (error) {
      setStatus(`Push blocked: ${error.message}. Export the code before explicitly clearing it.`, 'error');
    }
    return false;
  }

  generateButton.addEventListener('click', () => {
    const template = templates.get(templateId);
    if (!template.codeReady) {
      setStatus(`${template.name} code generation is coming soon. Your settings are saved in this workspace.`, 'error');
      return;
    }
    if (activeBarrierId) {
      setStatus('Finish or cancel the active barrier before generating code.', 'error');
      return;
    }
    const result = generateCode();
    if (result.errors.length > 0) {
      setStatus(result.errors.map((error) => error.message).join(' '), 'error');
      return;
    }

    const currentCode = runner.getCode();
    if (!isSafeToReplace(currentCode)) return;
    const needsConfirmation = currentCode.trim() && currentCode !== lastGeneratedCode;
    if (needsConfirmation && !window.confirm('Replace the code currently in GAME_RUNNER with generated code?')) return;
    runner.setCode(result.code);
    lastGeneratedCode = result.code;
    persistence.changed();
    setStatus('Generated code is synced to GAME_RUNNER. Use its Run button to play.');
  });

  templateChoices.addEventListener('change', (event) => {
    const nextId = event.target.value;
    // Barrier points are placed by clicking the preview, so finish that first.
    if (activeBarrierId) {
      templateChoices.querySelector(`input[value="${templateId}"]`).checked = true;
      setStatus('Finish or cancel the active barrier before changing the game type.', 'error');
      return;
    }
    storeOpenTemplateOptions();
    showTemplate(nextId);
    persistence.changed();
    setStatus(`${templates.get(nextId).name} selected. Each game type keeps its own settings.`);
  });

  templateForm.addEventListener('click', (event) => {
    const button = event.target.closest('[data-template-action]');
    if (!button) return;
    const template = templates.get(templateId);
    const list = listFor(button.dataset.listId);
    storeOpenTemplateOptions();
    const items = templateOptions[templateId][list.id];
    if (button.dataset.templateAction === 'draw-item') {
      if (activeBarrierId) {
        setStatus('Finish or cancel the active barrier before drawing.', 'error');
        return;
      }
      drawingListId = list.id;
      placementEditor.start(list.draw, items);
      const how = list.draw === 'box' ? 'Drag a box on the preview' : 'Click the preview';
      setStatus(`${how} to place a ${list.itemName.toLowerCase()}. Press Escape to cancel.`);
      return;
    }
    if (button.dataset.templateAction === 'add-item') {
      items.push(createListItem(list, items, templateImages.get(templateId)));
      setStatus(`${list.itemName} added.`);
    } else {
      templateOptions[templateId][list.id] = items.filter((item) => item.id !== button.dataset.itemId);
      setStatus(`${list.itemName} removed.`);
    }
    renderTemplatePanel(templateForm, template, templateOptions[templateId], templateImages.get(templateId));
    persistence.changed();
  });

  for (const type of ['input', 'change']) {
    templateForm.addEventListener(type, () => {
      storeOpenTemplateOptions();
      persistence.changed();
    });
  }

  if (!persistence.recovered) {
    if (runner.getCode().trim()) {
      setStatus('Existing runner code was preserved. Pull settings from it, or export it before replacing it.');
    } else {
      setStatus('Configure the builder, then choose Push to send it to GAME_RUNNER.');
    }
  }
} catch (error) {
  console.error('GameBuilder workbench initialization failed:', error);
  setStatus(error.message || 'GameBuilder could not initialize.', 'error');
}
