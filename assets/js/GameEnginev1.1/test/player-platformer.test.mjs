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

// Platform contacts live in the engine, so a plain PlayerPlatformer can stand on a Barrier.
async function barrierFixture(touch) {
  const { default: Barrier } = await import('../essentials/Barrier.js');
  const { default: Transform } = await import('../essentials/Transform.js');
  const player = platformerFixture();
  const platform = Object.create(Barrier.prototype);
  platform.transform = new Transform(0, 100);
  Object.assign(platform, { width: 100, height: 20, collisionShape: 'rectangle', canvas: { id: 'platform' } });
  Object.assign(player, {
    width: 20,
    height: 20,
    hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
    position: { x: 30, y: 85 },
    gameEnv: { gameObjects: [platform] },
    collisionData: { touchPoints: { this: touch, other: { id: 'platform' } } },
  });
  return player;
}

test('a falling PlayerPlatformer lands on top of a Barrier and is supported', async () => {
  const player = await barrierFixture({ top: true });
  player.verticalVelocity = -1;
  player.handleCollisionState();
  assert.equal(player.position.y, 81);
  assert.equal(player.verticalVelocity, 0);
  assert.equal(player.hasSupport(), true);
});

test('a rising PlayerPlatformer stops under a Barrier ceiling', async () => {
  const player = await barrierFixture({ bottom: true });
  player.verticalVelocity = 5;
  player.handleCollisionState();
  assert.equal(player.position.y, 119);
  assert.equal(player.verticalVelocity, 0);
  assert.equal(player.hasSupport(), false);
});

test('a PlayerPlatformer is stopped by the side of a Barrier', async () => {
  const player = await barrierFixture({ left: true });
  player.velocity.x = 5;
  player.handleCollisionState();
  assert.equal(player.velocity.x, 0);
  assert.equal(player.position.x, -19);
});
