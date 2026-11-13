import test from 'node:test';
import assert from 'node:assert/strict';
import PlayerPlatformer from '../essentials/PlayerPlatformer.js';
import { createKeyboardPlayer, pressKey, releaseKey } from './keyboard-test-helper.mjs';

function platformerFixture() {
  const player = createKeyboardPlayer(PlayerPlatformer);
  Object.assign(player, {
    verticalVelocity: 0,
    gravityAcceleration: 0.4,
    jumpVelocity: 8,
    isGrounded: false,
    _groundedThisFrame: false,
    _skipGravityThisFrame: false,
    _jumpPressedLatch: false,
    direction: 'right',
    move() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    },
    draw() {},
    collisionChecks() {},
    setupCanvas() {},
  });
  return player;
}

test('horizontal movement and gravity work together without directional flying', () => {
  const player = platformerFixture();
  pressKey(player, player.keypress.left);
  pressKey(player, player.keypress.down);
  player.update();

  assert.equal(player.velocity.x, -5);
  assert.equal(player.velocity.y, 0.4);
  assert.equal(player.position.y, 0.4);
  assert.equal(player.direction, 'left');

  releaseKey(player, player.keypress.left);
  player.update();
  assert.equal(player.velocity.x, 0);
  assert.equal(player.velocity.y, 0.8);
  assert.equal(player.direction, 'left');
});

test('jump requires support and release before another jump after landing', () => {
  const player = platformerFixture();
  let jumps = 0;
  player.onJump = () => { jumps += 1; };
  pressKey(player, player.keypress.up);
  assert.equal(jumps, 0, 'no airborne jump');

  player.land();
  player.update();
  assert.equal(jumps, 1);
  assert.equal(player.verticalVelocity, 7.6);
  assert.equal(player.isGrounded, false);

  player.land();
  player.update();
  assert.equal(jumps, 1, 'held jump does not auto-repeat on landing');

  releaseKey(player, player.keypress.up);
  player.land();
  pressKey(player, player.keypress.up);
  assert.equal(jumps, 2);
  assert.equal(player.verticalVelocity, 8);
});

test('walking off a platform resumes falling when contacts no longer report a landing', () => {
  const player = platformerFixture();
  player.collisionChecks = () => player.land();
  player.update();
  assert.equal(player.isGrounded, true);
  assert.equal(player.verticalVelocity, 0);

  player.collisionChecks = () => {};
  player.update();
  assert.equal(player.isGrounded, false);
  player.update();
  assert.equal(player.verticalVelocity, -0.4);
});

test('ceiling contact stops upward motion and gravity resumes on the next update', () => {
  const player = platformerFixture();
  player.verticalVelocity = 5;
  player.collisionChecks = () => player.hitCeiling();
  player.update();
  assert.equal(player.verticalVelocity, 0);
  assert.equal(player.isGrounded, false);
  player.collisionChecks = () => {};
  player.update();
  assert.equal(player.velocity.y, 0.4);
});

test('pausing preserves position, jump velocity, and grounded state', () => {
  const player = platformerFixture();
  player.verticalVelocity = 5;
  player.isGrounded = true;
  player.gameEnv.gameControl.isPaused = true;
  player.update();
  assert.deepEqual(player.position, { x: 0, y: 0 });
  assert.equal(player.verticalVelocity, 5);
  assert.equal(player.isGrounded, true);
});
