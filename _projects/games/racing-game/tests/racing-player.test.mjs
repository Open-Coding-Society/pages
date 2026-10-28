import test from 'node:test';
import assert from 'node:assert/strict';
import RacingPlayer from '../levels/RacingPlayer.js';
import AccelDecelRacingPlayer from '../levels/AccelDecelRacingPlayer.js';
import {
  createKeyboardPlayer,
  pressKey,
  releaseKey,
} from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

const arrows = { up: 38, left: 37, down: 40, right: 39 };
const wasd = { up: 87, left: 65, down: 83, right: 68 };

function fixture(keypress = arrows) {
  return createKeyboardPlayer(RacingPlayer, { keypress });
}

function accelerationFixture() {
  const player = createKeyboardPlayer(AccelDecelRacingPlayer, { keypress: wasd });
  Object.assign(player, {
    keysPressed: {},
    currentSpeed: 0,
    maxSpeed: 12,
    acceleration: 0.4,
    deceleration: 0.4,
    reverseSpeed: -4,
    scale: { width: 100, height: 100 },
    stepFactor: 100,
  });
  player.draw = () => {};
  player.collisionChecks = () => {};
  player.move = () => {};
  return player;
}

test('racing inherits arrow scroll prevention and real engine movement', () => {
  const player = fixture();
  assert.equal(pressKey(player, 38).defaultPrevented, true);
  assert.equal(player.velocity.y, -5);
  assert.equal(player.direction, 'up');
  releaseKey(player, 38);
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
  assert.equal(player.constructor.name, 'Player', 'HUD can still find the car');
});

test('WASD and unmapped arrows keep their browser defaults', () => {
  const player = fixture(wasd);
  assert.equal(pressKey(player, 38).defaultPrevented, false);
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
  assert.equal(pressKey(player, 87).defaultPrevented, false);
  assert.equal(player.velocity.y, -5);
});

test('typing fields and browser shortcuts do not move cars or block default behavior', () => {
  const player = fixture();
  for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
    assert.equal(pressKey(player, 38, { target: { tagName } }).defaultPrevented, false);
  }
  assert.equal(pressKey(player, 38, { target: { isContentEditable: true } }).defaultPrevented, false);
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey']) {
    assert.equal(pressKey(player, 37, { [modifier]: true }).defaultPrevented, false);
  }
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('paused and detached games do not capture keys', () => {
  const player = fixture();
  player.gameEnv.gameControl.isPaused = true;
  assert.equal(pressKey(player, 40).defaultPrevented, false);
  player.gameEnv.gameControl.isPaused = false;
  player.gameEnv.container.isConnected = false;
  assert.equal(pressKey(player, 40).defaultPrevented, false);
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('a key released while paused does not leave the car moving', () => {
  const player = fixture();
  pressKey(player, 40);
  player.gameEnv.gameControl.isPaused = true;
  releaseKey(player, 40);
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('holding accelerate gradually increases speed up to the maximum', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);

  player.update();
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(Math.abs(player.velocity.y) < 3);

  player.update();
  assert.equal(player.currentSpeed, 0.8);
  assert.ok(Math.abs(player.velocity.y) > 0.1);

  for (let frame = 0; frame < 40; frame += 1) {
    player.update();
  }
  assert.equal(player.currentSpeed, player.maxSpeed);
});

test('each WASD direction moves the car when pressed on its own', () => {
  const expectedVelocity = new Map([
    [wasd.up, { x: 0, y: -1 }],
    [wasd.down, { x: 0, y: 1 }],
    [wasd.left, { x: -1, y: 0 }],
    [wasd.right, { x: 1, y: 0 }],
  ]);

  for (const [key, direction] of expectedVelocity) {
    const player = accelerationFixture();
    pressKey(player, key);
    player.update();

    assert.notEqual(player.currentSpeed, 0, `key ${key} should start the car moving`);
    assert.ok(player.velocity.x * direction.x >= 0);
    assert.ok(player.velocity.y * direction.y >= 0);
    assert.ok(
      (direction.x !== 0 && Math.abs(player.velocity.x) > 0)
      || (direction.y !== 0 && Math.abs(player.velocity.y) > 0),
      `key ${key} should move along its direction`
    );
  }
});

test('releasing accelerate lets the car gradually coast to a stop', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);
  player.update();
  player.update();
  releaseKey(player, wasd.up);

  player.update();
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(Math.abs(player.velocity.y) > 0);

  player.update();
  assert.equal(player.currentSpeed, 0);
  assert.equal(player.velocity.y, 0);
});

test('movement continues if a collision clears the engine key state', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);
  player.pressedKeys = {};
  player.update();

  assert.deepEqual(player.pressedKeys, {});
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(player.velocity.y < 0);
});
