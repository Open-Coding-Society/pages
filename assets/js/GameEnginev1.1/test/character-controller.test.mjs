import test from 'node:test';
import assert from 'node:assert/strict';
import Character from '../essentials/Character.js';
import Player from '../essentials/Player.js';
import PlayerDriver from '../essentials/PlayerDriver.js';
import PlayerPlatformer from '../essentials/PlayerPlatformer.js';
import { createKeyboardPlayer, pressKey, releaseKey } from './keyboard-test-helper.mjs';

function fixture(Type) {
  const player = createKeyboardPlayer(Type);
  Object.assign(player, {
    speed: 0, heading: 0, acceleration: 0.2, maxSpeed: 6,
    reverseSpeed: 2, braking: 0.2, coasting: 0.05, turnRate: 0.1,
    verticalVelocity: 0, gravityAcceleration: 0.4, jumpVelocity: 8,
    isGrounded: true,
    draw() {}, collisionChecks() {}, move() {}, setupCanvas() {},
  });
  return player;
}

for (const Type of [Player, PlayerDriver, PlayerPlatformer]) {
  test(`${Type.name} runs its controller once before movement and skips it when paused`, () => {
    const player = fixture(Type);
    let updates = 0;
    player.setController({
      update(character) {
        updates += 1;
        character.applyControlActions({ up: true, right: true });
      },
    });
    player.update();
    assert.equal(updates, 1);
    if (Type === Player) assert.deepEqual(player.velocity, { x: 5, y: -5 });
    if (Type === PlayerDriver) {
      assert.equal(player.speed, 0.2);
      assert.ok(player.heading > 0);
    }
    if (Type === PlayerPlatformer) {
      assert.equal(player.velocity.x, 5);
      assert.equal(player.verticalVelocity, 7.6);
    }
    player.gameEnv.gameControl.isPaused = true;
    player.update();
    assert.equal(updates, 1);
  });
}

test('controller ownership blocks keyboard input and detaching restores human controls', () => {
  const player = fixture(Player);
  player.setController({ update(character) { character.applyControlActions({ right: true }); } });
  pressKey(player, player.keypress.left);
  assert.deepEqual(player.pressedKeys, {});
  player.update();
  assert.equal(player.velocity.x, 5);
  releaseKey(player, player.keypress.right);
  assert.equal(player.pressedKeys[player.keypress.right], true);
  player.setController(null);
  assert.equal(player.velocity.x, 0);
  assert.deepEqual(player.pressedKeys, {});
  pressKey(player, player.keypress.left);
  assert.equal(player.velocity.x, -5);
});

test('empty actions release held controls and invalid controllers or missing mappings fail explicitly', () => {
  const player = fixture(Player);
  player.applyControlActions({ right: true });
  player.applyControlActions({});
  assert.deepEqual(player.pressedKeys, {});
  assert.equal(player.velocity.x, 0);
  assert.throws(() => player.setController({}), /update/);
  delete player.keypress.up;
  assert.throws(() => player.applyControlActions({ up: true }), /mapping/);
});

test('Character runs a behavior before moving without requiring player key bindings', () => {
  const character = Object.create(Character.prototype);
  const steps = [];
  character.gameEnv = { gameControl: { isPaused: false } };
  character.draw = () => steps.push('draw');
  character.collisionChecks = () => steps.push('collision');
  character.move = () => steps.push('move');
  character.setController({ update() { steps.push('controller'); } });
  character.update();
  assert.deepEqual(steps, ['controller', 'draw', 'collision', 'move']);
  steps.length = 0;
  character.gameEnv.gameControl.isPaused = true;
  character.update();
  assert.deepEqual(steps, ['draw']);
});

test('controller action snapshots respect remapped keys and release previous actions', () => {
  const player = fixture(Player);
  player.keypress = { up: 38, down: 40, left: 37, right: 39 };
  let actions = { right: true };
  player.setController({ update(character) { character.applyControlActions(actions); } });
  player.update();
  assert.deepEqual(player.pressedKeys, { 39: true });
  actions = { left: true };
  player.update();
  assert.deepEqual(player.pressedKeys, { 37: true });
  assert.equal(player.velocity.x, -5);
  actions = {};
  player.update();
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});
