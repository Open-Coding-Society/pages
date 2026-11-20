/**
 * @module workspace-store
 * @description Validates and persists complete single-level workspaces without
 * regenerating source. Drafts intentionally retain unfinished form/barrier data.
 * @data Version 2 records contain builder state, exact code, generation baseline,
 * engine selection, barrier edit/cancel state, and the chosen game template with
 * each template's panel options. Version 1 records (saved before templates) load
 * as the RPG template. A game type that uses spline barriers (Racing) keeps them
 * in its options as `barriers`, and the barrier being edited belongs to the open
 * game type. Saved and recovery slots are separate; revisions prevent
 * another tab's work being silently overwritten.
 * @usage Create a store with browser Storage and a page-specific key. Read before
 * writing; import/export use parseWorkspace/serializeWorkspace, never execution.
 */
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const fail = (message) => { throw new TypeError(`Invalid workspace: ${message}`); };

function checkKeys(value, keys, label) {
  if (!isRecord(value) || Object.keys(value).some((key) => !keys.includes(key))) {
    fail(`${label} has an unsupported shape or field`);
  }
}

function checkPosition(position, draft = false) {
  checkKeys(position, ['x', 'y'], 'position');
  for (const axis of ['x', 'y']) {
    if (!Number.isFinite(position[axis]) && !(draft && position[axis] === '')) fail(`invalid ${axis} position`);
  }
}

function checkPoints(points) {
  if (!Array.isArray(points)) fail('barrier points must be a list');
  points.forEach((point) => {
    checkPosition(point);
    if ([point.x, point.y].some((value) => value < 0 || value > 1)) fail('barrier point outside canvas');
  });
}

const ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const isOptionValue = (value) => typeof value === 'string' || typeof value === 'boolean' || Number.isFinite(value);

/** Spline barriers, as the RPG builder and barrier-using game types store them; returns their ids. */
function checkBarriers(barriers) {
  if (!Array.isArray(barriers)) fail('barriers must be a list');
  const barrierIds = new Set();
  for (const barrier of barriers) {
    checkKeys(barrier, ['id', 'name', 'visible', 'points'], 'barrier');
    if (typeof barrier.id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(barrier.id) || barrierIds.has(barrier.id)
      || typeof barrier.name !== 'string'
      || (barrier.visible !== undefined && typeof barrier.visible !== 'boolean')) fail('invalid barrier');
    barrierIds.add(barrier.id);
    checkPoints(barrier.points);
  }
  return barrierIds;
}

// Template options are checked for shape only; game-templates.json defines their meaning.
function checkTemplate(template) {
  checkKeys(template, ['id', 'options'], 'template');
  if (typeof template.id !== 'string' || !ID_PATTERN.test(template.id)) fail('invalid template id');
  if (!isRecord(template.options)) fail('template options must be an object');
  for (const [templateId, options] of Object.entries(template.options)) {
    if (!ID_PATTERN.test(templateId) || !isRecord(options)) fail('invalid template options');
    for (const [key, value] of Object.entries(options)) {
      if (key === 'barriers') {
        checkBarriers(value);
        continue;
      }
      if (isOptionValue(value)) continue;
      if (!Array.isArray(value)) fail('template option has an unsupported value');
      const itemIds = new Set();
      for (const item of value) {
        const validItem = isRecord(item) && typeof item.id === 'string' && ID_PATTERN.test(item.id)
          && !itemIds.has(item.id) && Object.values(item).every(isOptionValue);
        if (!validItem) fail('invalid or duplicate template list item');
        itemIds.add(item.id);
      }
    }
  }
}

/** Workspaces saved before game templates existed open as the RPG template. */
export function migrateWorkspace(document) {
  const isVersion1 = isRecord(document) && document.schemaVersion === 1 && !('template' in document);
  if (!isVersion1) return document;
  return { ...document, schemaVersion: 2, template: { id: 'rpg', options: {} } };
}

export function validateWorkspace(document) {
  checkKeys(document, ['schemaVersion', 'kind', 'builderState', 'editorCode', 'lastGeneratedCode',
    'engineVersion', 'editing', 'collapsed', 'template'], 'document');
  if (document.schemaVersion !== 2 || document.kind !== 'ocs-gamebuilder-workspace') {
    fail('unsupported document version or kind');
  }
  checkTemplate(document.template);
  if (typeof document.editorCode !== 'string' || typeof document.lastGeneratedCode !== 'string'
    || typeof document.collapsed !== 'boolean'
    || !['GameEnginev1', 'GameEnginev1.1'].includes(document.engineVersion)) fail('invalid editor settings');
  const state = document.builderState;
  checkKeys(state, ['schemaVersion', 'name', 'backgroundKey', 'player', 'npcs', 'barriers'], 'builder');
  if (state.schemaVersion !== 1 || typeof state.name !== 'string' || typeof state.backgroundKey !== 'string') {
    fail('invalid builder settings');
  }
  checkKeys(state.player, ['name', 'spriteKey', 'position'], 'player');
  if (typeof state.player.name !== 'string' || typeof state.player.spriteKey !== 'string') fail('invalid player');
  checkPosition(state.player.position, true);
  if (!Array.isArray(state.npcs) || !Array.isArray(state.barriers)) fail('objects must be lists');
  const ids = new Set();
  for (const npc of state.npcs) {
    checkKeys(npc, ['id', 'name', 'spriteKey', 'greeting', 'position'], 'NPC');
    if (['id', 'name', 'spriteKey', 'greeting'].some((key) => typeof npc[key] !== 'string')
      || !/^[A-Za-z0-9_-]+$/.test(npc.id) || ids.has(npc.id)) fail('invalid or duplicate NPC');
    ids.add(npc.id);
    checkPosition(npc.position, true);
  }
  // The barrier being edited belongs to the open game type: RPG state or that type's options.
  const openTemplateBarriers = document.template.options[document.template.id]?.barriers;
  const rpgBarrierIds = checkBarriers(state.barriers);
  const barrierIds = Array.isArray(openTemplateBarriers) ? checkBarriers(openTemplateBarriers) : rpgBarrierIds;
  const editing = document.editing;
  checkKeys(editing, ['activeBarrierId', 'barrierEditSnapshot', 'nextNpcIndex', 'nextBarrierIndex'], 'editing');
  for (const key of ['nextNpcIndex', 'nextBarrierIndex']) {
    if (!Number.isSafeInteger(editing[key]) || editing[key] < 0) fail('invalid object counter');
  }
  if (editing.activeBarrierId !== null && !barrierIds.has(editing.activeBarrierId)) fail('active barrier missing');
  if (editing.barrierEditSnapshot !== null) checkPoints(editing.barrierEditSnapshot);
  if ((editing.activeBarrierId === null) !== (editing.barrierEditSnapshot === null)) fail('invalid barrier edit state');
  return document;
}

export function serializeWorkspace(document) {
  return JSON.stringify(validateWorkspace(document));
}

export function parseWorkspace(text) {
  return validateWorkspace(migrateWorkspace(JSON.parse(text)));
}

export function createWorkspaceStore(storage, key) {
  const observed = new Map();
  function slotKey(slot) {
    if (!['draft', 'saved'].includes(slot)) throw new TypeError('Unknown workspace storage slot');
    return `${key}:${slot}`;
  }
  return {
    read(slot) {
      const raw = storage.getItem(slotKey(slot));
      observed.set(slot, raw);
      if (raw === null) return null;
      const record = JSON.parse(raw);
      checkKeys(record, ['revision', 'savedAt', 'document'], 'storage record');
      if (typeof record.revision !== 'string' || typeof record.savedAt !== 'string') fail('invalid save metadata');
      return { ...record, document: validateWorkspace(migrateWorkspace(record.document)) };
    },
    write(slot, document) {
      const target = slotKey(slot);
      if (!observed.has(slot)) throw new Error('Read the workspace slot before saving');
      if (storage.getItem(target) !== observed.get(slot)) {
        throw new Error('Another tab changed this workspace. Export your work before reloading.');
      }
      const record = {
        revision: crypto.randomUUID(), savedAt: new Date().toISOString(),
        document: JSON.parse(serializeWorkspace(document))
      };
      const raw = JSON.stringify(record);
      storage.setItem(target, raw);
      observed.set(slot, raw);
      return record;
    }
  };
}
