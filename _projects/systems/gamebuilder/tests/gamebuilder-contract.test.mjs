import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssetCatalog } from '../js/asset-catalog.mjs';
import { createDefaultBuilderState, createNpcState, validateBuilderState } from '../js/builder-state.mjs';
import { generateLevelCode } from '../js/code-generator.mjs';

const catalog = createAssetCatalog(
  [{ name: 'Alien Planet', src: 'alien_planet.jpg' }],
  [{
    name: 'Chill Guy',
    src: 'chillguy.png',
    rows: 4,
    cols: 3,
    scaleFactor: 5,
    movementPreset: 'four-row-8way'
  }]
);

test('builds a versioned default document with the selected assets', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  assert.equal(state.schemaVersion, 1);
  assert.deepEqual(state.npcs, []);
  assert.deepEqual(validateBuilderState(state, catalog), []);
});

test('rejects unknown assets and out-of-range positions', () => {
  const state = createDefaultBuilderState('missing', 'chill_guy');
  state.player.position.x = 1.5;
  const fields = validateBuilderState(state, catalog).map((error) => error.field);
  assert.deepEqual(fields, ['backgroundKey', 'player.position.x']);
});

test('validates all NPC settings and rejects duplicate identifiers', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.npcs = [
    createNpcState(0, 'chill_guy'),
    { ...createNpcState(0, 'missing'), name: ' ' }
  ];
  const fields = validateBuilderState(state, catalog).map((error) => error.field);
  assert.deepEqual(fields, ['npcs.1.id', 'npcs.1.name', 'npcs.1.spriteKey']);
});

test('generates GAME_RUNNER-compatible source with safe string literals', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.name = "Ada's Adventure";
  state.player.name = 'Player One';
  const result = generateLevelCode(state, catalog);
  assert.deepEqual(result.errors, []);
  assert.match(result.code, /export const gameLevelClasses = \[GameLevelBuilder\]/);
  assert.match(result.code, /export \{ GameControl \}/);
  assert.match(result.code, /Ada's Adventure/);
  assert.doesNotMatch(result.code, /import Npc from/);
  assert.match(result.code, /STEP_FACTOR: 1000/);
  assert.match(result.code, /\/images\/projects\/gamebuilder\/bg\/alien_planet\.jpg/);
  assert.match(result.code, /\/images\/projects\/gamebuilder\/sprites\/chillguy\.png/);
});

test('generates any number of NPCs as GAME_RUNNER Npc objects', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.npcs = [
    { ...createNpcState(0, 'chill_guy'), name: 'Guide', greeting: "Welcome, hero's friend!" },
    { ...createNpcState(1, 'chill_guy'), name: 'Merchant', position: { x: 0.8, y: 0.6 } }
  ];
  const result = generateLevelCode(state, catalog);
  assert.deepEqual(result.errors, []);
  assert.equal((result.code.match(/class: Npc/g) || []).length, 2);
  assert.match(result.code, /import Npc from '\/assets\/js\/GameEnginev1\.1\/essentials\/Npc\.js';/);
  assert.match(result.code, /id: "npc-1_guide"/);
  assert.match(result.code, /greeting: "Welcome, hero's friend!"/);
  assert.match(result.code, /const npcData1 = \{/);
  assert.match(result.code, /const npcData2 = \{/);
  assert.match(result.code, /id: "npc-2_merchant"/);
  assert.match(result.code, /INIT_POSITION: \{ x: 0\.8, y: 0\.6 \}/);
  assert.match(result.code, /\{ class: Npc, data: npcData1 \}/);
  assert.match(result.code, /\{ class: Npc, data: npcData2 \}/);
  assert.doesNotMatch(result.code, /class: Npc,\s+data: \{/);
});

test('rejects malformed sprite manifests instead of generating incomplete code', () => {
  assert.throws(() => createAssetCatalog(
    [{ name: 'Background', src: 'background.jpg' }],
    [{ name: 'Broken sprite', src: '../sprite.png', rows: 4, cols: 3, scaleFactor: 5, movementPreset: 'four-row-8way' }]
  ), /invalid name or source path/);
});
