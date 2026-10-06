/**
 * @module workspace-store
 * @description Validates and persists complete single-level workspaces without
 * regenerating source. Drafts intentionally retain unfinished form/barrier data.
 * @data Version 1 records contain builder state, exact code, generation baseline,
 * engine selection, and barrier edit/cancel state. Saved and recovery slots are
 * separate; revisions prevent another tab's work being silently overwritten.
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

export function validateWorkspace(document) {
  checkKeys(document, ['schemaVersion', 'kind', 'builderState', 'editorCode', 'lastGeneratedCode',
    'engineVersion', 'editing', 'collapsed'], 'document');
  if (document.schemaVersion !== 1 || document.kind !== 'ocs-gamebuilder-workspace') {
    fail('unsupported document version or kind');
  }
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
  const barrierIds = new Set();
  for (const barrier of state.barriers) {
    checkKeys(barrier, ['id', 'name', 'visible', 'points'], 'barrier');
    if (typeof barrier.id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(barrier.id) || barrierIds.has(barrier.id)
      || typeof barrier.name !== 'string'
      || (barrier.visible !== undefined && typeof barrier.visible !== 'boolean')) fail('invalid barrier');
    barrierIds.add(barrier.id);
    checkPoints(barrier.points);
  }
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
  return validateWorkspace(JSON.parse(text));
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
      validateWorkspace(record.document);
      return record;
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
