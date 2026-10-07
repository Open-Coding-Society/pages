/**
 * @module builder-state
 * @description
 * Creates and validates the structured document edited by the GameBuilder
 * panel. This module contains no DOM or runner logic.
 *
 * @data
 * Schema version 1 stores the game `name`, a manifest-backed `backgroundKey`,
 * one `player`, zero or more `npcs`, and zero or more open spline `barriers`.
 * Positions and barrier control points use normalized coordinates in the
 * inclusive range 0–1. NPCs and barriers have unique identifiers.
 *
 * @usage
 * Use `createDefaultBuilderState(backgroundKey, spriteKey)` to initialize the
 * workbench and `createNpcState(index, spriteKey)` when adding an NPC. Pass
 * the document and asset catalog to `validateBuilderState`; it returns an
 * array of `{ field, message }` errors and does not mutate the document.
 */
export function createDefaultBuilderState(backgroundKey, spriteKey) {
  if (!backgroundKey || !spriteKey) {
    throw new TypeError('A background and player sprite are required');
  }

  return {
    schemaVersion: 1,
    name: 'My Game',
    backgroundKey,
    player: {
      name: 'Player',
      spriteKey,
      position: { x: 0.5, y: 0.8 }
    },
    npcs: [],
    barriers: []
  };
}

export function createNpcState(index, spriteKey) {
  if (!Number.isInteger(index) || index < 0 || !spriteKey) {
    throw new TypeError('An NPC index and sprite are required');
  }

  return {
    id: `npc-${index + 1}`,
    name: `NPC ${index + 1}`,
    spriteKey,
    greeting: 'Hello, traveler!',
    position: {
      x: 0.15 + (index % 4) * 0.2,
      y: Math.min(0.65 + Math.floor(index / 4) * 0.15, 0.95)
    }
  };
}

export function validateBuilderState(state, catalog) {
  const errors = [];
  if (!state || state.schemaVersion !== 1) {
    errors.push({ field: 'document', message: 'Unsupported builder document version.' });
    return errors;
  }

  if (typeof state.name !== 'string' || !state.name.trim()) {
    errors.push({ field: 'name', message: 'Enter a game name.' });
  }
  if (!catalog.backgrounds.has(state.backgroundKey)) {
    errors.push({ field: 'backgroundKey', message: 'Choose an available background.' });
  }
  if (!state.player || typeof state.player.name !== 'string' || !state.player.name.trim()) {
    errors.push({ field: 'player.name', message: 'Enter a player name.' });
  }
  if (!catalog.sprites.has(state.player?.spriteKey)) {
    errors.push({ field: 'player.spriteKey', message: 'Choose an available player sprite.' });
  }

  for (const axis of ['x', 'y']) {
    const value = state.player?.position?.[axis];
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      errors.push({
        field: `player.position.${axis}`,
        message: `Player ${axis.toUpperCase()} position must be between 0 and 1.`
      });
    }
  }

  if (!Array.isArray(state.npcs)) {
    errors.push({ field: 'npcs', message: 'NPC settings must be a list.' });
    return errors;
  }

  const npcIds = new Set();
  state.npcs.forEach((npc, index) => {
    const field = `npcs.${index}`;
    if (!npc || typeof npc.id !== 'string' || !npc.id.trim() || npcIds.has(npc.id)) {
      errors.push({ field: `${field}.id`, message: `NPC ${index + 1} must have a unique identifier.` });
    } else {
      npcIds.add(npc.id);
    }
    if (typeof npc?.name !== 'string' || !npc.name.trim()) {
      errors.push({ field: `${field}.name`, message: `Enter a name for NPC ${index + 1}.` });
    }
    if (typeof npc?.greeting !== 'string') {
      errors.push({ field: `${field}.greeting`, message: `Enter a valid greeting for NPC ${index + 1}.` });
    }
    if (!catalog.sprites.has(npc?.spriteKey)) {
      errors.push({ field: `${field}.spriteKey`, message: `Choose an available sprite for NPC ${index + 1}.` });
    }

    for (const axis of ['x', 'y']) {
      const value = npc?.position?.[axis];
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        errors.push({
          field: `${field}.position.${axis}`,
          message: `NPC ${index + 1} ${axis.toUpperCase()} position must be between 0 and 1.`
        });
      }
    }
  });

  if (!Array.isArray(state.barriers)) {
    errors.push({ field: 'barriers', message: 'Barrier settings must be a list.' });
    return errors;
  }

  const barrierIds = new Set();
  state.barriers.forEach((barrier, index) => {
    const field = `barriers.${index}`;
    if (!barrier || typeof barrier.id !== 'string' || !barrier.id.trim() || barrierIds.has(barrier.id)) {
      errors.push({ field: `${field}.id`, message: `Barrier ${index + 1} must have a unique identifier.` });
    } else {
      barrierIds.add(barrier.id);
    }
    if (typeof barrier?.name !== 'string' || !barrier.name.trim()) {
      errors.push({ field: `${field}.name`, message: `Enter a name for barrier ${index + 1}.` });
    }
    if (barrier?.visible !== undefined && typeof barrier.visible !== 'boolean') {
      errors.push({ field: `${field}.visible`, message: `Barrier ${index + 1} visibility must be true or false.` });
    }
    if (!Array.isArray(barrier?.points) || barrier.points.length < 2) {
      errors.push({ field: `${field}.points`, message: `Barrier ${index + 1} needs at least two points.` });
      return;
    }
    barrier.points.forEach((point, pointIndex) => {
      for (const axis of ['x', 'y']) {
        const value = point?.[axis];
        if (!Number.isFinite(value) || value < 0 || value > 1) {
          errors.push({
            field: `${field}.points.${pointIndex}.${axis}`,
            message: `Barrier ${index + 1} point ${pointIndex + 1} ${axis.toUpperCase()} must be between 0 and 1.`
          });
        }
      }
    });
  });

  return errors;
}
