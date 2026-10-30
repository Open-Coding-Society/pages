import test from 'node:test';
import assert from 'node:assert/strict';
import RacingPlayer from '../levels/RacingPlayer.js';
import AccelDecelRacingPlayer from '../levels/AccelDecelRacingPlayer.js';
import GameLevelWinter from '../levels/winter-level.js';
import { getRandomTrackPoint } from '../levels/WinterIcicle.js';
import {
  createKeyboardPlayer,
  pressKey,
  releaseKey,
} from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';

const arrows = { up: 38, left: 37, down: 40, right: 39 };
const wasd = { up: 87, left: 65, down: 83, right: 68 };

function fixture(keypress = arrows) {
  return createKeyboardPlayer(RacingPlayer, { keypress });
}

function accelerationFixture() {
  const player = createKeyboardPlayer(AccelDecelRacingPlayer, { keypress: wasd });
  Object.assign(player, {
    keysPressed: {},
    currentSpeed: 0,
    maxSpeed: 12,
    acceleration: 0.4,
    deceleration: 0.4,
    reverseSpeed: -4,
    temporarySpeedMultiplier: 1,
    slowdownUntil: 0,
    boostUntil: 0,
    boostCooldownUntil: 0,
    scale: { width: 100, height: 100 },
    stepFactor: 100,
  });
  player.draw = () => {};
  player.collisionChecks = () => {};
  player.move = () => {};
  return player;
}

test('racing inherits arrow scroll prevention and real engine movement', () => {
  const player = fixture();
  assert.equal(pressKey(player, 38).defaultPrevented, true);
  assert.equal(player.velocity.y, -5);
  assert.equal(player.direction, 'up');
  releaseKey(player, 38);
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
  assert.equal(player.constructor.name, 'Player', 'HUD can still find the car');
});

test('WASD and unmapped arrows keep their browser defaults', () => {
  const player = fixture(wasd);
  assert.equal(pressKey(player, 38).defaultPrevented, false);
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
  assert.equal(pressKey(player, 87).defaultPrevented, false);
  assert.equal(player.velocity.y, -5);
});

test('typing fields and browser shortcuts do not move cars or block default behavior', () => {
  const player = fixture();
  for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) {
    assert.equal(pressKey(player, 38, { target: { tagName } }).defaultPrevented, false);
  }
  assert.equal(pressKey(player, 38, { target: { isContentEditable: true } }).defaultPrevented, false);
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey']) {
    assert.equal(pressKey(player, 37, { [modifier]: true }).defaultPrevented, false);
  }
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('paused and detached games do not capture keys', () => {
  const player = fixture();
  player.gameEnv.gameControl.isPaused = true;
  assert.equal(pressKey(player, 40).defaultPrevented, false);
  player.gameEnv.gameControl.isPaused = false;
  player.gameEnv.container.isConnected = false;
  assert.equal(pressKey(player, 40).defaultPrevented, false);
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('a key released while paused does not leave the car moving', () => {
  const player = fixture();
  pressKey(player, 40);
  player.gameEnv.gameControl.isPaused = true;
  releaseKey(player, 40);
  assert.deepEqual(player.pressedKeys, {});
  assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('holding accelerate gradually increases speed up to the maximum', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);

  player.update();
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(Math.abs(player.velocity.y) < 3);

  player.update();
  assert.equal(player.currentSpeed, 0.8);
  assert.ok(Math.abs(player.velocity.y) > 0.1);

  for (let frame = 0; frame < 40; frame += 1) {
    player.update();
  }
  assert.equal(player.currentSpeed, player.maxSpeed);
});

test('each WASD direction moves the car when pressed on its own', () => {
  const expectedVelocity = new Map([
    [wasd.up, { x: 0, y: -1 }],
    [wasd.down, { x: 0, y: 1 }],
    [wasd.left, { x: -1, y: 0 }],
    [wasd.right, { x: 1, y: 0 }],
  ]);

  for (const [key, direction] of expectedVelocity) {
    const player = accelerationFixture();
    pressKey(player, key);
    player.update();

    assert.notEqual(player.currentSpeed, 0, `key ${key} should start the car moving`);
    assert.ok(player.velocity.x * direction.x >= 0);
    assert.ok(player.velocity.y * direction.y >= 0);
    assert.ok(
      (direction.x !== 0 && Math.abs(player.velocity.x) > 0)
      || (direction.y !== 0 && Math.abs(player.velocity.y) > 0),
      `key ${key} should move along its direction`
    );
  }
});

test('releasing accelerate lets the car gradually coast to a stop', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);
  player.update();
  player.update();
  releaseKey(player, wasd.up);

  player.update();
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(Math.abs(player.velocity.y) > 0);

  player.update();
  assert.equal(player.currentSpeed, 0);
  assert.equal(player.velocity.y, 0);
});

test('movement continues if a collision clears the engine key state', () => {
  const player = accelerationFixture();
  pressKey(player, wasd.up);
  player.pressedKeys = {};
  player.update();

  assert.deepEqual(player.pressedKeys, {});
  assert.equal(player.currentSpeed, 0.4);
  assert.ok(player.velocity.y < 0);
});

test('winter cars use acceleration, reverse-speed, and individual boost keys', () => {
  const winterLevel = new GameLevelWinter({ path: '' });
  const winterCars = winterLevel.classes.slice(1, 3);

  assert.equal(winterLevel.iciclePath, '/images/projects/racing-game/Icicle.png');
  assert.equal(winterCars.length, 2);
  for (const [index, car] of winterCars.entries()) {
    assert.equal(car.class, AccelDecelRacingPlayer);
    assert.equal(car.data.SCALE_FACTOR, 20);
    assert.equal(car.data.direction.default, 'right');
    assert.ok(car.data.INIT_POSITION.x < 0.5, 'both cars should start before the finish line');
    assert.equal(car.data.INIT_POSITION.y, 0.79);
    assert.equal(car.data.currentSpeed, 0);
    assert.equal(car.data.maxSpeed, 12);
    assert.equal(car.data.acceleration, 0.4);
    assert.equal(car.data.deceleration, 0.4);
    assert.equal(car.data.reverseSpeed, -4);
    assert.equal(car.data.STEP_FACTOR, 1100);
    assert.equal(car.data.boostKey, [70, 75][index]);
  }
});

test('winter level shows and removes the boost instructions', () => {
  const originalDocument = globalThis.document;
  const container = {
    children: [],
    appendChild(element) {
      element.parentNode = this;
      this.children.push(element);
    },
    removeChild(element) {
      this.children = this.children.filter((child) => child !== element);
    },
  };
  globalThis.document = {
    createElement() {
      return {
        style: {},
        children: [],
        setAttribute(name, value) {
          this[name] = value;
        },
        append(...elements) {
          this.children.push(...elements);
        },
        remove() {
          this.parentNode?.removeChild(this);
        },
      };
    },
  };

  try {
    const winterLevel = new GameLevelWinter({ path: '', container });
    const [redInstruction, blueInstruction] = winterLevel.boostInstructions.children;

    assert.equal(redInstruction.textContent, 'Press F for Red Car Boost.');
    assert.equal(blueInstruction.textContent, 'Press K for Blue Car Boost.');
    assert.equal(container.children.includes(winterLevel.boostInstructions), true);

    winterLevel.destroy();
    assert.equal(container.children.length, 0);
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});

test('a single boost press doubles forward movement for one second after release', () => {
  const player = accelerationFixture();
  player.boostKey = 70;
  player.currentSpeed = 6;
  player.keysPressed[wasd.up] = true;
  player.updateMovementSpeed(1000);
  const normalForwardVelocity = Math.abs(player.velocity.y);
  player.startBoost(1000);
  releaseKey(player, 70);
  player.updateMovementSpeed(1000);

  assert.equal(Math.abs(player.velocity.y), normalForwardVelocity * 2);

  player.updateMovementSpeed(1999);
  assert.equal(Math.abs(player.velocity.y), normalForwardVelocity * 2);

  player.updateMovementSpeed(2000);
  assert.equal(Math.abs(player.velocity.y), normalForwardVelocity);
});

test('pressing the assigned boost key starts the boost timer', () => {
  const player = accelerationFixture();
  player.boostKey = 70;
  player.currentSpeed = 6;
  player.keysPressed[wasd.up] = true;
  player.updateMovementSpeed();
  const normalForwardVelocity = Math.abs(player.velocity.y);
  pressKey(player, 70);

  assert.ok(player.boostUntil > Date.now());
  assert.equal(Math.abs(player.velocity.y), normalForwardVelocity * 2);
});

test('boost cannot be activated again until its three-second cooldown expires', () => {
  const player = accelerationFixture();

  assert.equal(player.startBoost(1000), true);
  assert.equal(player.startBoost(3999), false);
  assert.equal(player.startBoost(4000), true);
  assert.equal(player.boostUntil, 5000);
  assert.equal(player.boostCooldownUntil, 7000);
});

test('boosted movement checks spline barriers between short movement steps', () => {
  const player = accelerationFixture();
  const checkedPositions = [];
  player.width = 20;
  player.height = 20;
  player.gameEnv.innerWidth = 1000;
  player.gameEnv.innerHeight = 1000;
  player.position = { x: 100, y: 100 };
  player.velocity = { x: 10, y: 0 };
  player.currentSpeed = 6;
  player.boostUntil = 2000;
  delete player.move;
  player.gameEnv.gameObjects = [{
    resolvePlayerCollision() {
      checkedPositions.push(player.position.x);
    },
  }];

  player.move(1000);

  assert.ok(checkedPositions.length > 1);
  assert.equal(player.position.x, 110);
  assert.equal(player.velocity.x, 10);
});

test('icicle hit halves movement speed for two seconds, then restores it', () => {
  const player = accelerationFixture();
  player.currentSpeed = 6;

  player.applyIcicleSlowdown(1000);
  player.updateMovementSpeed(1000);
  assert.equal(player.xVelocity, 0.75);
  assert.equal(player.yVelocity, 0.75);

  player.updateMovementSpeed(2999);
  assert.equal(player.xVelocity, 0.75);

  player.updateMovementSpeed(3000);
  assert.equal(player.xVelocity, 1.5);
  assert.equal(player.yVelocity, 1.5);
});

test('colliding with a winter icicle applies the slowdown and consumes the icicle', () => {
  const player = accelerationFixture();
  let consumed = false;
  player.gameEnv.gameObjects = [{
    spriteData: { id: 'winter-icicle-1' },
    consume() {
      consumed = true;
    },
  }];

  player.handleCollisionReaction({ id: 'winter-icicle-1' });

  assert.equal(player.temporarySpeedMultiplier, 0.5);
  assert.equal(consumed, true);
});

test('random icicle track points remain within the game area', () => {
  const point = getRandomTrackPoint(() => 0.5);
  assert.ok(point.x >= 0 && point.x <= 1);
  assert.ok(point.y >= 0 && point.y <= 1);
});
