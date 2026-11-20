/**
 * @module racing-generator-tests
 * @description Contracts for turning Racing panel settings into game code.
 * @data Uses the real Racing pictures from `game-templates.json`.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTemplateImages, createTemplateOptions } from '../js/game-templates.mjs';
import { generateRacingCode } from '../js/generators/racing.mjs';

const templates = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const racing = templates.find((template) => template.id === 'racing');
const images = createTemplateImages(racing);
const starter = () => createTemplateOptions(racing, images);

// Runs the module body with stand-in engine classes and returns the level's classes.
function levelClasses(source) {
  const body = source
    .replace(/^import (\w+) from .*$/gm, 'const $1 = engine.$1;')
    .replace(/^export const gameLevelClasses = \[(\w+)\];$/m, 'return new $1({ path: "/site" }).classes;')
    .replace(/^export \{ GameControl \};$/m, '');
  const engine = new Proxy({}, { get: (target, name) => name });
  return new Function('engine', body)(engine);
}

test('every Racing track carries a finish line, a checkpoint and a start', () => {
  for (const track of images.get('tracks').values()) {
    assert.ok(track.finishLine && track.checkpoint && track.start, `${track.name} is missing race data`);
  }
});

test('starter Racing settings make a level with the track, a rotating car and a lap race', () => {
  const { code, errors } = generateRacingCode(starter(), images);
  assert.deepEqual(errors, []);
  assert.match(code, /^export const gameLevelClasses/m);
  assert.match(code, /^export \{ GameControl \};$/m);

  const classes = levelClasses(code);
  assert.deepEqual(classes.map((entry) => entry.class), ['GameEnvBackground', 'PlayerDriver', 'LapRace']);
  assert.equal(classes[0].data.src, `/site${images.get('tracks').get('tutorial_mud_track').src}`, 'pictures load from the game path');
  const car = classes[1].data;
  assert.equal(car.rotateWithHeading, true);
  assert.equal(car.heading, Math.PI / 2);
  assert.deepEqual(car.driverPhysics, { maxSpeed: 6, acceleration: 0.2 });
  assert.equal(classes[2].data.totalLaps, 3);
});

test('a second player and obstacles add their own objects', () => {
  const options = { ...starter(), secondPlayer: true, obstacles: [{ id: 'obstacles-1', spriteKey: 'cone', x: 0.3, y: 0.4 }] };
  const { code, errors } = generateRacingCode(options, images);
  assert.deepEqual(errors, []);
  const classes = levelClasses(code);
  assert.deepEqual(classes.map((entry) => entry.class), ['GameEnvBackground', 'PlayerDriver', 'PlayerDriver', 'Character', 'LapRace']);
  assert.notEqual(classes[1].data.src, classes[2].data.src, 'the second player drives the other car');
  assert.deepEqual(classes[2].data.keypress, { up: 38, left: 37, down: 40, right: 39 });
  assert.deepEqual(classes[3].data.INIT_POSITION, { x: 0.3, y: 0.4 });
});

test('spline barriers become walls the cars cannot cross', () => {
  const barriers = [
    { id: 'barrier-1', name: 'Barrier 1', visible: true, points: [{ x: 0.1, y: 0.2 }, { x: 0.5, y: 0.25 }, { x: 0.9, y: 0.2 }] },
    { id: 'barrier-2', name: 'Barrier 2', visible: false, points: [{ x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }] }
  ];
  const { code, errors } = generateRacingCode({ ...starter(), barriers }, images);
  assert.deepEqual(errors, []);
  assert.match(code, /^import SplineBarrier from '\/assets\/js\/GameEnginev1\.1\/essentials\/SplineBarrier\.js';$/m);
  const walls = levelClasses(code).filter((entry) => entry.class === 'SplineBarrier').map((entry) => entry.data);
  assert.deepEqual(walls, [
    { id: 'barrier-1', coordinateSpace: 'normalized', visible: true, splinePoints: barriers[0].points },
    { id: 'barrier-2', coordinateSpace: 'normalized', visible: false, splinePoints: barriers[1].points }
  ]);
  assert.equal(levelClasses(code).at(-1).class, 'LapRace', 'the lap race still draws last');
});

test('a barrier with fewer than two points cannot be pushed', () => {
  const barriers = [{ id: 'barrier-1', name: 'Barrier 1', visible: true, points: [{ x: 0.1, y: 0.2 }] }];
  const { code, errors } = generateRacingCode({ ...starter(), barriers }, images);
  assert.equal(code, '');
  assert.deepEqual(errors.map((error) => error.field), ['barriers.0']);
});

test('bad Racing settings return errors and no code', () => {
  const options = { ...starter(), name: ' ', laps: 2.5, backgroundKey: 'moon', obstacles: [{ spriteKey: 'cone', x: 4, y: 0 }] };
  const { code, errors } = generateRacingCode(options, images);
  assert.equal(code, '');
  assert.deepEqual(errors.map((error) => error.field), ['name', 'backgroundKey', 'laps', 'obstacles.0']);
});
