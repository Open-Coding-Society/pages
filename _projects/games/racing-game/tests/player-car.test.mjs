import test from 'node:test';
import assert from 'node:assert/strict';
import PlayerCar from '../levels/PlayerCar.js';
import {
  createKeyboardPlayer,
  pressKey,
  releaseKey,
} from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

function fixture() {
  const player = createKeyboardPlayer(PlayerCar);
  Object.assign(player, {
    speed: 0,
    maxSpeed: 6,
    reverseSpeed: 2,
    acceleration: 0.2,
    braking: 0.2,
    coasting: 0.05,
    turnRate: 0.04,
    heading: 0,
    gravity: false,
    direction: 'up',
  });
  player.draw = () => {};
  player.collisionChecks = () => {};
  player.move = () => {};
  return player;
}

test('the car continues coasting after the up key is released until speed reaches zero', () => {
  const player = fixture();

  pressKey(player, 87);
  player.update();
  assert.equal(player.speed, 0.2);
  assert.equal(player.velocity.y, -0.2);

  releaseKey(player, 87);
  player.update();
  assert.equal(player.speed, 0.15);
  assert.equal(player.velocity.y, -0.15);
  assert.equal(player.moved, true);

  while (player.speed > 0) {
    player.update();
  }

  assert.equal(player.speed, 0);
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
  assert.equal(player.moved, false);
});

test('the sprite renders its upward-facing frame rotated by the car heading', () => {
  const player = fixture();
  const calls = [];
  player.heading = Math.PI / 4;
  player.spriteReady = true;
  player.spriteData = {
    pixels: { width: 160, height: 80 },
    orientation: { rows: 4, columns: 4 },
    up: { row: 3, start: 0 },
  };
  player.spriteSheet = {};
  player.canvas = {};
  player.ctx = {
    save: () => calls.push(['save']),
    translate: (...args) => calls.push(['translate', ...args]),
    rotate: (angle) => calls.push(['rotate', angle]),
    drawImage: (...args) => calls.push(['drawImage', ...args]),
    restore: () => calls.push(['restore']),
  };

  player.drawSprite();

  assert.equal(player.direction, 'up');
  assert.equal(player.canvas.width, 40);
  assert.equal(player.canvas.height, 40);
  assert.deepEqual(calls.find(([name]) => name === 'rotate'), ['rotate', Math.PI / 4]);
  assert.deepEqual(calls.find(([name]) => name === 'drawImage').slice(1, 6), [
    player.spriteSheet, 0, 60, 40, 20,
  ]);
});
