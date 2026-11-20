/**
 * @module platform-generator-tests
 * @description Contracts for turning Platform panel settings into game code.
 * @data Uses the real Platform pictures from `game-templates.json`.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createListItem, createTemplateImages, createTemplateOptions } from '../js/game-templates.mjs';
import { generatePlatformCode } from '../js/generators/platform.mjs';

const templates = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const platform = templates.find((template) => template.id === 'platform');
const images = createTemplateImages(platform);
const listFor = (id) => platform.sections.find((section) => section.list?.id === id).list;
const starter = () => createTemplateOptions(platform, images);

// Runs the module body with stand-in engine classes and returns the level's classes.
function levelClasses(source) {
  const body = source
    .replace(/^import (\w+) from .*$/gm, 'const $1 = engine.$1;')
    .replace(/^export const gameLevelClasses = \[(\w+)\];$/m, 'return new $1({ path: "/site" }).classes;')
    .replace(/^export \{ GameControl \};$/m, '');
  return new Function('engine', body)(new Proxy({}, { get: (target, name) => name }));
}

test('every Platform player picture carries its sprite sheet layout', () => {
  for (const player of images.get('players').values()) {
    for (const key of ['pixels', 'orientation', 'down', 'left', 'right']) assert.ok(player[key], `${player.name} needs ${key}`);
  }
  for (const group of ['enemies', 'coins']) {
    for (const picture of images.get(group).values()) assert.ok(picture.pixels, `${picture.name} needs pixels`);
  }
});

test('starter Platform settings make a level with a floor, a jumping player and a challenge', () => {
  const { code, errors } = generatePlatformCode(starter(), images);
  assert.deepEqual(errors, []);
  const classes = levelClasses(code);
  assert.deepEqual(classes.map((entry) => entry.class), ['GameEnvBackground', 'Barrier', 'PlayerPlatformer', 'PlatformChallenge']);
  assert.equal(classes[1].data.id, 'floor');
  const player = classes[2].data;
  assert.equal(player.gravityAcceleration, 0.4);
  assert.equal(player.jumpVelocity, 8);
  assert.deepEqual(player.INIT_POSITION, { x: 0.1, y: 0.5 });
  assert.equal(player.src, `/site${images.get('players').get('astronaut').src}`);
});

test('platforms, enemies and coins from the lists all reach the level', () => {
  const options = {
    ...starter(),
    platforms: [{ ...createListItem(listFor('platforms'), [], images), visible: false }],
    enemies: [createListItem(listFor('enemies'), [], images)],
    coins: [createListItem(listFor('coins'), [], images), { ...createListItem(listFor('coins'), [], images), x: 0.9 }]
  };
  const { code, errors } = generatePlatformCode(options, images);
  assert.deepEqual(errors, []);
  const classes = levelClasses(code);
  const platformData = classes.find((entry) => entry.data.id === 'platform-1').data;
  assert.deepEqual([platformData.x, platformData.y, platformData.width, platformData.visible], [0.3, 0.7, 0.2, false]);
  const challenge = classes.at(-1).data;
  assert.equal(challenge.coins.length, 2);
  assert.equal(challenge.coins[1].x, 0.9);
  assert.equal(challenge.enemies[0].src, `/site${images.get('enemies').get('alien').src}`);
  assert.ok(challenge.enemies[0].patrol > 0);
});

test('bad Platform settings return errors and no code', () => {
  const options = {
    ...starter(),
    gravity: 0,
    playerSpriteKey: 'red_car',
    platforms: [{ x: 0.2, y: 0.5, width: 0, height: 0.1 }],
    coins: [{ spriteKey: 'coin', x: 2, y: 0.5 }]
  };
  const { code, errors } = generatePlatformCode(options, images);
  assert.equal(code, '');
  assert.deepEqual(errors.map((error) => error.field), ['gravity', 'playerSpriteKey', 'platforms.0', 'coins.0']);
});
