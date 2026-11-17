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

// Records the drawing calls a sprite canvas receives.
function recordingCanvas() {
  const calls = [];
  const ctx = new Proxy({}, { get: (target, name) => (...args) => calls.push([name, ...args]) });
  return { canvas: { width: 0, height: 0 }, ctx, calls };
}

test('a car with rotateWithHeading draws its up frame turned to its heading', () => {
  const player = fixture();
  const { canvas, ctx, calls } = recordingCanvas();
  Object.assign(player, {
    canvas, ctx, heading: Math.PI / 2, rotateWithHeading: true, spriteReady: true,
    spriteSheet: { naturalWidth: 400, naturalHeight: 200 },
    spriteData: { pixels: { width: 400, height: 200 }, orientation: { rows: 2, columns: 4 }, up: { row: 1, start: 2 } },
  });

  player.drawSprite();

  assert.deepEqual(calls.find(([name]) => name === 'rotate'), ['rotate', Math.PI / 2]);
  const [, , sourceX, sourceY, frameWidth, frameHeight] = calls.find(([name]) => name === 'drawImage');
  assert.deepEqual([sourceX, sourceY, frameWidth, frameHeight], [200, 100, 100, 100]);
  assert.equal(canvas.width, 100);
});

test('a car without rotateWithHeading keeps the normal sprite drawing', () => {
  const player = fixture();
  const { ctx, calls } = recordingCanvas();
  Object.assign(player, { ctx, rotateWithHeading: false, spriteReady: false, spriteData: {} });
  player.drawSprite();
  assert.equal(calls.some(([name]) => name === 'rotate'), false);
});
