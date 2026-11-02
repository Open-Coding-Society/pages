import test from 'node:test';
import assert from 'node:assert/strict';
import GameLevelSpring from '../levels/spring-level.js';
import { createKeyboardPlayer } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

test('spring level includes happy and grumpy flowers beside the track', () => {
  const level = new GameLevelSpring({
    path: '',
    innerWidth: 740,
    innerHeight: 585,
  });
  assert.equal(level.classes.filter(({ class: ObjectType }) => ObjectType.name === 'Player').length, 2);

  const flowers = level.classes.filter(({ class: ObjectType }) => ObjectType.name === 'FlowerNpc');
  const roadsideHappyFlower = flowers.find(({ data }) => data.id === 'flower-happy-roadside');
  const grumpyFlower = flowers.find(({ data }) => data.id === 'flower-grumpy');

  assert.equal(flowers.length, 3);
  assert.ok(roadsideHappyFlower);
  assert.equal(roadsideHappyFlower.data.greeting, 'Hi! I am a happy flower! Enjoying the ride?');
  assert.deepEqual(roadsideHappyFlower.data.INIT_POSITION, { x: 0.18, y: 0.70 });
  assert.deepEqual(roadsideHappyFlower.data.walkingArea, {
    xMin: 740 * 0.05,
    xMax: 740 * 0.32,
    yMin: 585 * 0.68,
    yMax: 585 * 0.82,
  });
  assert.ok(grumpyFlower);
  assert.match(grumpyFlower.data.src, /\/Flower-grumpy\.png$/);
  assert.deepEqual(grumpyFlower.data.INIT_POSITION, { x: 0.5, y: 0.70 });
  assert.equal(grumpyFlower.data.greeting, 'Hey! Watch it!');
  assert.deepEqual(grumpyFlower.data.walkingArea, {
    xMin: 740 * 0.12,
    xMax: 740 * 0.88,
    yMin: 585 * 0.68,
    yMax: 585 * 0.82,
  });
});

test('both bottom flowers patrol horizontally', () => {
  const level = new GameLevelSpring({ path: '', innerWidth: 740, innerHeight: 585 });
  const bottomFlowers = level.classes.filter(({ data }) =>
    ['flower-happy-roadside', 'flower-grumpy'].includes(data.id)
  );

  for (const { class: Flower, data } of bottomFlowers) {
    const width = 73;
    const patrolEndX = data.walkingArea.xMax - width;
    const centerX = (data.walkingArea.xMin + patrolEndX) / 2;
    const flower = Object.create(Flower.prototype);
    Object.assign(flower, {
      position: { x: centerX, y: 0 },
      width,
      patrolCenterX: centerX,
      patrolAmplitude: (patrolEndX - data.walkingArea.xMin) / 2,
      patrolPhase: 0,
      lastPatrolTime: performance.now() - 50,
      data,
      gameEnv: { gameControl: { isPaused: false } },
    });

    flower.patrol();

    assert.notEqual(flower.position.x, centerX, `${data.id} should move along the track`);
  }
});

test('a grumpy flower touching a car schedules its explosion without a click', (t) => {
  const level = new GameLevelSpring({ path: '', innerWidth: 740, innerHeight: 585 });
  const GrumpyFlower = level.classes.find(({ data }) => data.id === 'flower-grumpy').class;
  const flower = Object.create(GrumpyFlower.prototype);
  const player = {
    state: { collisionEvents: ['flower-grumpy'] },
    applyTemporarySlowdown() {},
  };
  let warningShown = false;
  Object.assign(flower, {
    spriteData: { id: 'flower-grumpy' },
    gameEnv: { gameObjects: [player], gameControl: { isPaused: false } },
    walkingArea: null,
    draw() {},
    showWarningMessage() { warningShown = true; },
    explode() {},
  });

  flower.update();
  t.after(() => clearTimeout(flower.explosionTimeout));

  assert.equal(warningShown, true);
  assert.equal(flower.hasExploded, true);
  assert.ok(flower.explosionTimeout);
});

test('touching the grumpy flower slows the spring car for five seconds', () => {
  const level = new GameLevelSpring({ path: '', innerWidth: 740, innerHeight: 585 });
  const SpringPlayer = level.classes.find(({ class: ObjectType }) => ObjectType.name === 'Player').class;
  const player = createKeyboardPlayer(SpringPlayer);
  player.gameEnv.gameObjects = [];
  player.collisionData = { touchPoints: { this: {} } };
  player.handleCollisionReaction({ id: 'flower-grumpy' });

  assert.equal(player.getSlowdownMultiplier(player.slowdownUntil - 1), 0.65);
  assert.equal(player.getSlowdownMultiplier(player.slowdownUntil), 1);
});

test('touching a happy flower does not slow the spring car', () => {
  const level = new GameLevelSpring({ path: '', innerWidth: 740, innerHeight: 585 });
  const SpringPlayer = level.classes.find(({ class: ObjectType }) => ObjectType.name === 'Player').class;
  const player = createKeyboardPlayer(SpringPlayer);
  player.gameEnv.gameObjects = [];
  player.collisionData = { touchPoints: { this: {} } };

  player.handleCollisionReaction({ id: 'flower-happy-roadside' });

  assert.equal(player.slowdownUntil, undefined);
});

test('the spring-only slowdown scales movement without changing car velocity', () => {
  const level = new GameLevelSpring({ path: '', innerWidth: 740, innerHeight: 585 });
  const SpringPlayer = level.classes.find(({ class: ObjectType }) => ObjectType.name === 'Player').class;
  const player = createKeyboardPlayer(SpringPlayer);
  Object.assign(player.gameEnv, { innerWidth: 100, innerHeight: 100 });
  player.position = { x: 10, y: 10 };
  player.velocity = { x: 4, y: 0 };
  player.gameEnv.gameObjects = [];
  player.collisionData = { touchPoints: { this: {} } };
  player.handleCollisionReaction({ id: 'flower-grumpy' });

  player.move();

  assert.ok(Math.abs(player.position.x - 12.6) < 1e-9);
  assert.equal(player.velocity.x, 4);
});
