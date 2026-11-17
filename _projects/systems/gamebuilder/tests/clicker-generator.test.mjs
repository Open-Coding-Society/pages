/**
 * @module clicker-generator-tests
 * @description Contracts for turning Clicker panel settings into game code.
 * @data Uses the real Clicker pictures from `game-templates.json`.
 * @usage Run with Node's test runner alongside the other GameBuilder contracts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createListItem, createTemplateImages, createTemplateOptions } from '../js/game-templates.mjs';
import { generateClickerCode } from '../js/generators/clicker.mjs';

const templates = JSON.parse(readFileSync(new URL('../js/game-templates.json', import.meta.url), 'utf8'));
const clicker = templates.find((template) => template.id === 'clicker');
const images = createTemplateImages(clicker);
const powerUpList = clicker.sections.find((section) => section.list?.id === 'powerUps').list;
const starter = () => createTemplateOptions(clicker, images);

// Runs the module body with stand-in engine classes and returns the level's classes.
function levelClasses(source) {
  const body = source
    .replace(/^import (\w+) from .*$/gm, 'const $1 = engine.$1;')
    .replace(/^export const gameLevelClasses = \[(\w+)\];$/m, 'return new $1({ path: "/site" }).classes;')
    .replace(/^export \{ GameControl \};$/m, '');
  return new Function('engine', body)(new Proxy({}, { get: (target, name) => name }));
}

test('starter Clicker settings make a coloured background and a clicker game', () => {
  const { code, errors } = generateClickerCode(starter(), images);
  assert.deepEqual(errors, []);
  const [background, game] = levelClasses(code);
  assert.equal(background.class, 'GameEnvBackground');
  assert.equal(background.data.color, '#fef3c7');
  assert.equal(background.data.src, undefined, 'a colour background has no picture');
  assert.equal(game.class, 'ClickerGame');
  assert.equal(game.data.target.src, `/site${images.get('targets').get('cookie').src}`);
  assert.deepEqual([game.data.targetCount, game.data.targetSpeed, game.data.goalScore], [1, 0, 100]);
  assert.equal(game.data.winMessage, 'You did it!');
  assert.deepEqual(game.data.powerUps, []);
});

test('power-ups reach the game with their picture, cost and effect', () => {
  const powerUp = { ...createListItem(powerUpList, [], images), spriteKey: 'grandma', effect: 'auto-click', cost: 25, amount: 3 };
  const { code, errors } = generateClickerCode({ ...starter(), powerUps: [powerUp] }, images);
  assert.deepEqual(errors, []);
  const [, game] = levelClasses(code);
  assert.deepEqual(game.data.powerUps, [{
    name: 'Power-up', src: `/site${images.get('targets').get('grandma').src}`, cost: 25, effect: 'auto-click', amount: 3
  }]);
});

test('bad Clicker settings return errors and no code', () => {
  const options = {
    ...starter(),
    backgroundColor: 'red; }',
    targetCount: 0,
    powerUps: [{ spriteKey: 'cookie', effect: 'explode', cost: 5, amount: 1 }]
  };
  const { code, errors } = generateClickerCode(options, images);
  assert.equal(code, '');
  assert.deepEqual(errors.map((error) => error.field), ['backgroundColor', 'targetCount', 'powerUps.0']);
});
