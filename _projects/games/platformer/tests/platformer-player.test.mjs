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
  Object.assign(barrier, { width: 100, height: 20, canvas: { id: 'platform' } });
  Object.assign(player, {
    width: 20,
    height: 20,
    hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
    verticalVelocity: -1,
    jumpVelocity: 8,
    isGrounded: false,
    gameEnv: { gameObjects: [barrier] },
    collisionData: { touchPoints: { this: { top: true }, other: { id: 'platform' } } },
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

test('overlapping sprite corners do not collide unless the engine circles overlap', () => {
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
