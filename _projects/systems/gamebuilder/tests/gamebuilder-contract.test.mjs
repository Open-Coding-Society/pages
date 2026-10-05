/**
 * @module gamebuilder-contract-tests
 * @description
 * Node.js contract tests for GameBuilder's manifest catalog, versioned state,
 * input validation, and generated GAME_RUNNER level source.
 *
 * @data
 * Uses small in-memory background and sprite manifests plus representative
 * builder documents. Fixtures cover empty object lists, invalid configuration,
 * and generation with multiple NPCs and spline barriers.
 *
 * @usage
 * Run from the repository root with
 * `node --test _projects/systems/gamebuilder/tests/gamebuilder-contract.test.mjs`.
 * These tests assert public module behavior and generated-code structure; they
 * do not require a browser or a running GAME_RUNNER.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssetCatalog } from '../js/asset-catalog.mjs';
import { normalizeCanvasPoint } from '../js/barrier-editor.mjs';
import { createDefaultBuilderState, createNpcState, validateBuilderState } from '../js/builder-state.mjs';
import { generateLevelCode } from '../js/code-generator.mjs';
import SplineBarrier from '../../../../assets/js/GameEnginev1.1/essentials/SplineBarrier.js';

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
  assert.deepEqual(state.barriers, []);
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

test('validates spline barriers and requires two normalized points', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.barriers = [{
    id: 'barrier-1',
    name: 'North wall',
    points: [{ x: 0.1, y: 0.25 }, { x: 0.9, y: 0.3 }]
  }];
  assert.deepEqual(validateBuilderState(state, catalog), []);

  state.barriers[0].points = [{ x: 1.1, y: 0.25 }];
  const fields = validateBuilderState(state, catalog).map((error) => error.field);
  assert.deepEqual(fields, ['barriers.0.points']);
  state.barriers[0].points.push({ x: 0.9, y: 0.3 });
  const pointFields = validateBuilderState(state, catalog).map((error) => error.field);
  assert.deepEqual(pointFields, ['barriers.0.points.0.x']);

  state.barriers[0].points[0].x = 0.1;
  state.barriers[0].visible = 'hidden';
  const visibilityFields = validateBuilderState(state, catalog).map((error) => error.field);
  assert.deepEqual(visibilityFields, ['barriers.0.visible']);
});

test('maps preview clicks to clamped normalized coordinates', () => {
  const rect = { left: 100, top: 50, width: 400, height: 200 };
  assert.deepEqual(normalizeCanvasPoint(200, 100, rect), { x: 0.25, y: 0.25 });
  assert.deepEqual(normalizeCanvasPoint(600, 250, rect), { x: 1, y: 1 });
  assert.throws(() => normalizeCanvasPoint(100, 50, { ...rect, width: 0 }), /non-zero size/);
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
  assert.doesNotMatch(result.code, /import SplineBarrier from/);
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

test('generates normalized spline barriers as separate engine object definitions', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.barriers = [
    {
      id: 'barrier-1',
      name: 'North wall',
      points: [{ x: 0.125, y: 0.25 }, { x: 0.5, y: 0.35 }, { x: 0.875, y: 0.25 }]
    },
    {
      id: 'barrier-2',
      name: 'South wall',
      points: [{ x: 0.1, y: 0.8 }, { x: 0.9, y: 0.8 }]
    }
  ];

  const result = generateLevelCode(state, catalog);
  assert.deepEqual(result.errors, []);
  assert.match(result.code, /import SplineBarrier from '\/assets\/js\/GameEnginev1\.1\/essentials\/SplineBarrier\.js';/);
  assert.match(result.code, /const barrierData1 = \{/);
  assert.match(result.code, /coordinateSpace: "normalized"/);
  assert.match(result.code, /splinePoints: \[\{"x":0\.125,"y":0\.25\},\{"x":0\.5,"y":0\.35\},\{"x":0\.875,"y":0\.25\}\]/);
  assert.match(result.code, /\{ class: SplineBarrier, data: barrierData1 \}/);
  assert.match(result.code, /\{ class: SplineBarrier, data: barrierData2 \}/);
  assert.doesNotMatch(result.code, /class: SplineBarrier,\s+data: \{/);

  state.barriers[0].visible = false;
  const hiddenResult = generateLevelCode(state, catalog);
  assert.deepEqual(hiddenResult.errors, []);
  assert.match(hiddenResult.code, /visible: false,\s+splinePoints:/);
});

test('smooth spline geometry includes both endpoints', () => {
  const points = SplineBarrier.getCurvePoints([{ x: 10, y: 20 }, { x: 90, y: 40 }], 4);
  assert.equal(points.length, 5);
  assert.deepEqual(points[0], { x: 10, y: 20 });
  assert.deepEqual(points.at(-1), { x: 90, y: 40 });
  assert.throws(() => SplineBarrier.getCurvePoints([{ x: 0, y: 0 }]), /at least two points/);

  const nearest = SplineBarrier.getNearestPoint({ x: 50, y: 25 }, points);
  assert.ok(Math.abs(nearest.distance - 5 / Math.sqrt(1.0625)) < 1e-10);

  const curved = SplineBarrier.getCurvePoints([
    { x: 0, y: 0 },
    { x: 0.5, y: 1 },
    { x: 1, y: 0 }
  ], 4);
  assert.deepEqual(curved[2], { x: 0.21875, y: 0.5625 });
});

test('rejects malformed sprite manifests instead of generating incomplete code', () => {
  assert.throws(() => createAssetCatalog(
    [{ name: 'Background', src: 'background.jpg' }],
    [{ name: 'Broken sprite', src: '../sprite.png', rows: 4, cols: 3, scaleFactor: 5, movementPreset: 'four-row-8way' }]
  ), /invalid name or source path/);
});
