import test from 'node:test';
import assert from 'node:assert/strict';
import PlayerDriver, { getDriverTurnRate } from '../essentials/PlayerDriver.js';
import { createKeyboardPlayer, pressKey } from './keyboard-test-helper.mjs';

const keys = { up: 38, left: 37, down: 40, right: 39 };

function fixture() {
  const player = createKeyboardPlayer(PlayerDriver, { keypress: keys });
  Object.assign(player, {
    acceleration: 0.2,
    braking: 0.2,
    coasting: 0.05,
    heading: 0,
    maxSpeed: 6,
    reverseSpeed: 2,
    speed: 0,
    turnRate: 0.1,
    draw() {},
    collisionChecks() {},
    move() {},
  });
  return player;
}

test('driver controls use the configured keys to accelerate and steer', () => {
  const player = fixture();

  pressKey(player, keys.up);
  pressKey(player, keys.right);
  player.update();

  assert.equal(player.speed, 0.2);
  assert.equal(player.heading, getDriverTurnRate(player.speed, player));
  assert.ok(player.velocity.x > 0);
  assert.ok(player.velocity.y < 0);
  assert.equal(player.direction, 'up');
});

test('driver brakes before reversing and coasts when no throttle is pressed', () => {
  const player = fixture();
  player.speed = 0.2;
  pressKey(player, keys.down);

  player.update();
  assert.equal(player.speed, 0);

  player.update();
  assert.equal(player.speed, -0.2);
  assert.ok(player.velocity.y > 0);

  player.pressedKeys = {};
  player.update();
  assert.ok(Math.abs(player.speed + 0.15) < Number.EPSILON);
});
