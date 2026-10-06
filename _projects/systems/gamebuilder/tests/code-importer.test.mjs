/**
 * @module code-importer-tests
 * @description Verifies AST-only panel Pull and non-destructive Push gating.
 * @usage Run with node --test; the shared parser is checked in, not built.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssetCatalog } from '../js/asset-catalog.mjs';
import { createDefaultBuilderState, createNpcState } from '../js/builder-state.mjs';
import { generateLevelCode } from '../js/code-generator.mjs';
import { importLevelCode } from '../js/code-importer.mjs';
import { readFileSync } from 'node:fs';

const catalog = createAssetCatalog([{ name: 'Alien Planet', src: 'alien_planet.jpg' }],
  [{ name: 'Chill Guy', src: 'chillguy.png', rows: 4, cols: 3, scaleFactor: 5, movementPreset: 'four-row-8way' }]);

test('shared parser import resolves from source and published paths including a site base URL', () => {
  const source = readFileSync(new URL('../js/code-importer.mjs', import.meta.url), 'utf8');
  const path = source.match(/import \{ parse \} from '([^']+)'/)[1];
  assert.equal(new URL(path, import.meta.url.replace('/tests/code-importer.test.mjs', '/js/code-importer.mjs')).pathname,
    new URL('../../../../assets/js/vendor/acorn.mjs', import.meta.url).pathname);
  for (const base of ['', '/pages']) {
    assert.equal(new URL(path, `https://example.org${base}/assets/js/projects/gamebuilder/code-importer.mjs`).pathname,
      `${base}/assets/js/vendor/acorn.mjs`);
  }
});

test('Pull recovers supported fields from generated code and permits regeneration', () => {
  const state = createDefaultBuilderState('alien_planet', 'chill_guy');
  state.name = 'My lesson game';
  state.player.position = { x: 0.1, y: 0.2 };
  state.npcs = [createNpcState(0, 'chill_guy'), createNpcState(1, 'chill_guy')];
  state.barriers = [{ id: 'barrier-1', name: 'Barrier 1', visible: false,
    points: [{ x: 0.1, y: 0.3 }, { x: 0.9, y: 0.5 }] }];
  const code = generateLevelCode(state, catalog).code;
  const pulled = importLevelCode(code, catalog);
  assert.equal(pulled.canRegenerate, true);
  assert.equal(pulled.state.name, state.name);
  assert.deepEqual(pulled.state.player.position, state.player.position);
  assert.equal(pulled.state.npcs.length, 2);
  assert.equal(pulled.state.barriers[0].visible, false);
  assert.deepEqual(pulled.state.barriers[0].points, state.barriers[0].points);
  assert.equal(importLevelCode(`// Student comment\n${code}`, catalog).canRegenerate, true);
});

test('Pull reads manual literal changes without running callbacks or custom code', () => {
  const code = generateLevelCode(createDefaultBuilderState('alien_planet', 'chill_guy'), catalog).code;
  const custom = code.replace('STEP_FACTOR: 1000,', 'STEP_FACTOR: 250,\n      reaction() { throw new Error("Never execute me"); },')
    .replace('x: 0.5, y: 0.8', 'x: 0.2, y: 0.4');
  const pulled = importLevelCode(custom, catalog);
  assert.deepEqual(pulled.state.player.position, { x: 0.2, y: 0.4 });
  assert.equal(pulled.canRegenerate, false);
});

test('custom methods, imports, extra fields and wrong bindings prevent destructive regeneration', () => {
  const code = generateLevelCode(createDefaultBuilderState('alien_planet', 'chill_guy'), catalog).code;
  for (const custom of [
    code.replace('constructor(gameEnv)', 'update() { console.log("keep"); }\n  constructor(gameEnv)'),
    `import Other from '/other.js';\n${code}`,
    code.replace('STEP_FACTOR: 1000,', 'GRAVITY: true,\n      STEP_FACTOR: 1000,'),
    code.replace("import Player from '/assets/js/GameEnginev1.1/essentials/Player.js'",
      "import Player from '/other.js'")
  ]) {
    assert.equal(importLevelCode(custom, catalog).canRegenerate, false);
  }
});

test('unsupported and invalid code fails before changing panel state', () => {
  const code = generateLevelCode(createDefaultBuilderState('alien_planet', 'chill_guy'), catalog).code;
  assert.throws(() => importLevelCode('', catalog), /one locally defined/);
  assert.throws(() => importLevelCode('class {', catalog), SyntaxError);
  assert.throws(() => importLevelCode(code.replace('class: Player', 'class: Enemy'), catalog), /one Player/);
  assert.throws(() => importLevelCode(code.replace('x: 0.5, y: 0.8', 'x: 9, y: 0.8'), catalog), /between 0 and 1/);
  assert.throws(() => importLevelCode(code.replace('alien_planet.jpg', 'missing.jpg'), catalog), /not in the builder catalog/);
});
