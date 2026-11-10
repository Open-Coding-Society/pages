import test from 'node:test';
import assert from 'node:assert/strict';
import Player from '../essentials/Player.js';
import Barrier from '../essentials/Barrier.js';

function object(Type, x, y, width, height) {
  const result = Object.create(Type.prototype);
  result.hitbox = {};
  result.canvas = {
    id: Type.name,
    getBoundingClientRect: () => ({
      left: x, top: y, right: x + width, bottom: y + height, width, height,
    }),
  };
  if (Type === Barrier) result.collisionShape = 'rectangle';
  return result;
}

test('the full width of a Barrier supports a circular player, including tangent contact', () => {
  for (const x of [0, 100, 480]) {
    const player = object(Player, x, 80, 20, 20);
    player.isCollision(object(Barrier, 0, 100, 500, 20));
    assert.equal(player.collisionData.hit, true);
    assert.equal(player.collisionData.touchPoints.this.top, true);
    assert.equal(player.collisionData.touchPoints.this.left, false);
  }
});

test('circle-to-Barrier contact distinguishes sides, ceilings, and embedded centers', () => {
  const barrier = object(Barrier, 100, 100, 100, 20);
  for (const [x, y, face] of [[81, 100, 'left'], [199, 100, 'right'], [140, 119, 'bottom'], [140, 91, 'top']]) {
    const player = object(Player, x, y, 20, 20);
    player.isCollision(barrier);
    assert.equal(player.collisionData.hit, true);
    assert.equal(player.collisionData.touchPoints.this[face], true);
    barrier.isCollision(player);
    assert.equal(barrier.collisionData.hit, true);
  }
});

test('player circles still reject rectangle-only corner overlap and separated platforms', () => {
  const player = object(Player, 0, 0, 20, 20);
  player.isCollision(object(Barrier, 18, 18, 100, 20));
  assert.equal(player.collisionData.hit, false);
  player.isCollision(object(Barrier, 0, 21, 100, 20));
  assert.equal(player.collisionData.hit, false);
  player.isCollision(object(Player, 18, 18, 20, 20));
  assert.equal(player.collisionData.hit, false);
});
