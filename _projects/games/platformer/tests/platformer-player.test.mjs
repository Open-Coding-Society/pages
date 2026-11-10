import test from 'node:test';
import assert from 'node:assert/strict';
import PlatformerPlayer from '../levels/PlatformerPlayer.js';
import PlayerPlatformer from '@assets/js/GameEnginev1.1/essentials/PlayerPlatformer.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import Transform from '@assets/js/GameEnginev1.1/essentials/Transform.js';
import { createKeyboardPlayer, pressKey } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

function fixture() {
  const player = createKeyboardPlayer(PlatformerPlayer);
  const barrier = Object.create(Barrier.prototype);
  barrier.transform = new Transform(0, 100);
  Object.assign(barrier, { width: 100, height: 20, collisionShape: 'rectangle', canvas: { id: 'platform' } });
  Object.assign(player, {
    width: 20,
    height: 20,
    hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
    verticalVelocity: -1,
    jumpVelocity: 8,
    isGrounded: false,
    gameEnv: { gameObjects: [barrier] },
    collisionData: { touchPoints: { this: { top: true }, other: { id: 'platform' } } },
    setupCanvas() {},
  });
  return { player, barrier };
}

test('game subclass inherits engine collision detection and its hitbox reduction convention', () => {
  const { player } = fixture();
  assert.ok(player instanceof PlayerPlatformer);
  assert.equal(player.updateVelocity, PlayerPlatformer.prototype.updateVelocity);
  assert.equal(player.isCollision, GameObject.prototype.isCollision);
  player.position = { x: 30, y: 85 };
  player.handleCollisionState();
  assert.equal(player.position.y, 81);
  assert.equal(player.verticalVelocity, 0);
  assert.equal(player.isGrounded, true);
  assert.equal(player.hasSupport(), true);
});

test('overlapping sprite corners do not collide unless the player circle reaches the barrier', () => {
  const { player, barrier } = fixture();
  player.canvas = {
    id: 'player',
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 20, bottom: 20, width: 20, height: 20 }),
  };
  let offset = 17;
  barrier.canvas.getBoundingClientRect = () => ({
    left: offset, top: offset, right: offset + 20, bottom: offset + 20, width: 20, height: 20,
  });

  player.isCollision(barrier);
  assert.equal(player.collisionData.hit, false);
  offset = 10;
  player.isCollision(barrier);
  assert.equal(player.collisionData.hit, true);
});

function liveFixture() {
  const { player, barrier } = fixture();
  player.position = { x: 5, y: 0 };
  player.gravityAcceleration = 0.4;
  player.state = { collisionEvents: [] };
  player.clearPressedKeysOnCollision = false;
  player.gameEnv.gameControl = { isPaused: false };
  player.draw = () => {};
  player._updateDebugHitboxOverlay = () => {};
  player.move = () => {
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;
  };
  const rect = object => ({
    left: object.x, top: object.y, right: object.x + object.width,
    bottom: object.y + object.height, width: object.width, height: object.height,
  });
  player.canvas = { id: 'player', getBoundingClientRect: () => rect(player) };
  barrier.canvas.getBoundingClientRect = () => rect(barrier);
  player.gameEnv.gameObjects.push(player);
  return { player, barrier };
}

test('falling near the end of a wide platform lands on top and stays grounded for W', () => {
  const { player } = liveFixture();
  for (let frame = 0; frame < 60; frame += 1) player.update();
  assert.equal(player.position.y, 81);
  assert.equal(player.isGrounded, true);
  assert.equal(player.verticalVelocity, 0);
  pressKey(player, player.keypress.up);
  player.update();
  assert.ok(player.position.y < 81);
  assert.ok(player.verticalVelocity > 0);
  assert.equal(player.isGrounded, false);
});

test('walking across the platform retains support, and walking off its edge falls', () => {
  const { player } = liveFixture();
  player.position = { x: 5, y: 81 };
  player.land();
  pressKey(player, player.keypress.right);
  for (let frame = 0; frame < 12; frame += 1) {
    player.update();
    assert.equal(player.isGrounded, true);
    assert.equal(player.position.y, 81);
  }
  for (let frame = 0; frame < 15; frame += 1) player.update();
  assert.equal(player.isGrounded, false);
  assert.ok(player.position.y > 81);
});

test('a supported jump plays the game sound hook without landing canceling takeoff', () => {
  const { player } = fixture();
  player.position = { x: 30, y: 81 };
  player.isGrounded = true;
  let sounds = 0;
  player._playJumpSound = () => { sounds += 1; };
  pressKey(player, player.keypress.up);
  player.handleCollisionState();
  assert.equal(player.verticalVelocity, 8);
  assert.equal(player.isGrounded, false);
  assert.equal(sounds, 1);
});

test('the game positions the player below a ceiling and stops upward velocity', () => {
  const { player } = fixture();
  player.verticalVelocity = 5;
  player.collisionData.touchPoints.this = { bottom: true };
  player.handleCollisionState();
  assert.equal(player.position.y, 119);
  assert.equal(player.verticalVelocity, 0);
  assert.equal(player.isGrounded, false);
});

test('the game update uses engine gravity, resolves landing, and refreshes its overlay', () => {
  const { player } = fixture();
  player.position = { x: 30, y: 81 };
  player.gravityAcceleration = 0.4;
  player._skipGravityThisFrame = false;
  player.move = () => { player.position.y += player.velocity.y; };
  player.draw = () => {};
  player.collisionChecks = () => player.handleCollisionState();
  player.setupCanvas = () => {};
  let overlays = 0;
  player._updateDebugHitboxOverlay = () => { overlays += 1; };

  player.update();

  assert.equal(player.position.y, 81);
  assert.equal(player.isGrounded, true);
  assert.equal(player.verticalVelocity, 0);
  assert.equal(overlays, 1);
});
