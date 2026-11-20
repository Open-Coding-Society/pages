// Run with the engine tests (see test/README.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import PlatformChallenge from '../essentials/PlatformChallenge.js';
import PlayerPlatformer from '../essentials/PlayerPlatformer.js';
import Transform from '../essentials/Transform.js';

// A 100x100 canvas, so 0-1 positions are percentages of 100 pixels.
function player(at) {
  const jumper = Object.create(PlayerPlatformer.prototype);
  Object.assign(jumper, { transform: new Transform(at.x, at.y), verticalVelocity: 0, pressedKeys: {} });
  jumper.getWorldCollisionBounds = () => ({
    left: jumper.position.x, right: jumper.position.x + 10, top: jumper.position.y, bottom: jumper.position.y + 10
  });
  return jumper;
}

function challenge(data, jumper) {
  const gameEnv = { innerWidth: 100, innerHeight: 100, gameObjects: [jumper], gameControl: { isPaused: false } };
  const level = new PlatformChallenge(data, gameEnv);
  gameEnv.gameObjects.push(level);
  return level;
}

test('touching every coin collects them and wins', () => {
  const jumper = player({ x: 0, y: 80 });
  const level = challenge({ coins: [{ x: 0.3, y: 0.85, size: 0.1 }, { x: 0.6, y: 0.85, size: 0.1 }] }, jumper);
  level.checkPlayers();
  assert.equal(level.coinsCollected, 0);

  jumper.position.x = 26;
  level.checkPlayers();
  assert.equal(level.coinsCollected, 1);
  assert.equal(level.hasWon, false);

  jumper.position.x = 56;
  jumper.pressedKeys = { 68: true };
  level.checkPlayers();
  assert.equal(level.hasWon, true);
  assert.deepEqual(jumper.pressedKeys, {}, 'the player stops once they win');
});

test('touching an enemy sends the player back to where they started', () => {
  const jumper = player({ x: 0, y: 80 });
  const level = challenge({ enemies: [{ x: 0.5, y: 0.85, size: 0.1 }] }, jumper);
  level.checkPlayers();

  jumper.position.x = 46;
  jumper.verticalVelocity = 3;
  level.checkPlayers();
  assert.deepEqual([jumper.position.x, jumper.position.y], [0, 80]);
  assert.equal(jumper.verticalVelocity, 0);
  assert.equal(level.hits, 1);
});

test('enemies patrol left and right of their X position', () => {
  const level = challenge({ enemies: [{ x: 0.5, y: 0.5, patrol: 0.1 }] }, player({ x: 0, y: 0 }));
  const [enemy] = level.enemies;
  assert.equal(level.enemyX(enemy), 0.5);
  level.patrolPhase = Math.PI / 2;
  assert.ok(Math.abs(level.enemyX(enemy) - 0.6) < 1e-9);
});

test('a level with no coins never declares a win', () => {
  const jumper = player({ x: 0, y: 0 });
  const level = challenge({}, jumper);
  level.checkPlayers();
  assert.equal(level.hasWon, false);
});
