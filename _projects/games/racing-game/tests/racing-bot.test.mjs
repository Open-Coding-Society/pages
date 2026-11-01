import test from 'node:test';
import assert from 'node:assert/strict';
import RacingBot from '../levels/RacingBot.js';
import GameLevelAutumn from '../levels/autumn-level.js';
import { AUTUMN_BOT_GENOME } from '../levels/AutumnBotGenome.js';
import {
  AUTUMN_TRACK_CENTERLINE,
  createInitialGenome,
  createRouteFromGenome,
  evolveAutumnBot,
  getBotControls,
  hasReachedRouteWaypoint,
  scoreGenome,
  simulateAutumnRace,
} from '../levels/AutumnBotGenetics.js';
import { createKeyboardPlayer, pressKey } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';
import { RACING_CAR_HITBOX, RACING_CAR_PHYSICS } from '../levels/RacingCarPhysics.js';
import PlayerCar from '../levels/PlayerCar.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import { AUTUMN_SPLINE_BARRIER_POINTS } from '../levels/AutumnTrackGeometry.js';
import RaceDifficultyPrompt from '../levels/RaceDifficultyPrompt.js';

const keys = { up: 38, left: 37, down: 40, right: 39 };

function fixture(mode = 'hardcoded') {
  const bot = createKeyboardPlayer(RacingBot, {
    keypress: keys,
    gameEnv: { innerWidth: 643, innerHeight: 360, gameControl: { isPaused: false }, container: { isConnected: true } },
  });
  Object.assign(bot, {
    heading: 0,
    ...RACING_CAR_PHYSICS,
    speed: mode === 'hardcoded' ? 2 : 4,
    waypointIndex: 1,
    mode,
    route: mode === 'ai' ? createRouteFromGenome(AUTUMN_BOT_GENOME) : AUTUMN_TRACK_CENTERLINE,
    position: { x: 0.4 * 643, y: 0.86 * 360 },
    width: 10,
    height: 10,
    getCenter() {
      return { x: this.position.x + this.width / 2, y: this.position.y + this.height / 2 };
    },
  });
  return bot;
}

test('hardcoded mode follows the fixed racing line and accelerates', () => {
  const bot = fixture('hardcoded');
  bot.updateBotControls();

  assert.equal(bot.pressedKeys[keys.up], true);
  assert.equal(bot.pressedKeys[keys.down], undefined);
  assert.equal(bot.pressedKeys[keys.right], true);
});

test('both bot routes steer away from the autumn spline geometry', () => {
  const controls = [
    { mode: 'hardcoded', route: AUTUMN_TRACK_CENTERLINE },
    { mode: 'ai', route: createRouteFromGenome(AUTUMN_BOT_GENOME) },
  ].map(({ mode, route }) => getBotControls({
    position: { x: 70, y: 140 },
    heading: Math.PI / 2,
    speed: 2,
    waypointIndex: 1,
    route,
    width: 643,
    height: 360,
    mode,
  }));
  assert.ok(controls.every(({ steer }) => steer !== 0), 'both modes must steer away from a nearby barrier');
});

test('both bot difficulties complete three laps without spline barrier contacts', () => {
  for (const mode of ['hardcoded', 'ai']) {
    const result = simulateAutumnRace({ mode, genome: AUTUMN_BOT_GENOME });
    assert.equal(result.completed, true, `${mode} should complete three laps`);
    assert.equal(result.lapsCompleted, 3);
    assert.equal(result.barrierContacts, 0, `${mode} must avoid the spline barriers`);
    if (mode === 'ai') {
      assert.ok(result.seconds <= 16, `hard bot took ${result.seconds}s`);
    }
  }
});

test('waypoints advance when the bot passes them instead of orbiting behind', () => {
  const route = [{ x: 0.1, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.9, y: 0.5 }];

  assert.equal(hasReachedRouteWaypoint({ x: 510, y: 180 }, route, 1, 1000, 360, 20), true);
  assert.equal(hasReachedRouteWaypoint({ x: 300, y: 180 }, route, 1, 1000, 360, 20), false);
});

test('AI controller uses the saved route and target speed genes', () => {
  const bot = fixture('ai');
  bot.heading = -Math.PI / 2;
  bot.speed = 4;
  bot.updateBotControls();
  const control = getBotControls({
    position: bot.getCenter(),
    heading: bot.heading,
    speed: bot.speed,
    waypointIndex: bot.waypointIndex,
    route: bot.route,
    width: bot.gameEnv.innerWidth,
    height: bot.gameEnv.innerHeight,
    mode: 'ai',
  });
  assert.equal(bot.pressedKeys[keys.right], control.steer > 0 || undefined);
  assert.equal(bot.pressedKeys[keys.left], control.steer < 0 || undefined);
  assert.equal(bot.pressedKeys[keys.up], control.throttle > 0 || undefined);
  assert.equal(bot.pressedKeys[keys.down], control.throttle < 0 || undefined);
});

test('bot ignores player keyboard input', () => {
  const bot = fixture();
  pressKey(bot, keys.left);
  assert.deepEqual(bot.pressedKeys, {});
});

test('unknown bot modes fail explicitly', () => {
  const bot = fixture();
  assert.throws(() => bot.setMode('expert'), /Unknown racing bot mode/);
});

test('race setup pauses until Easy or Hard is chosen, then starts with that mode', () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const events = new Map();
  class Element {
    constructor(tagName) {
      this.tagName = tagName;
      this.children = [];
      this.listeners = {};
      this.attributes = {};
      this.className = '';
      this.style = {};
      this.velocity = { x: 0, y: 0 };
    }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.children.push(child); return child; }
    addEventListener(type, handler) { this.listeners[type] = handler; }
    setAttribute(name, value) { this.attributes[name] = value; }
    focus() { this.focused = true; }
    remove() { this.removed = true; }
  }
  globalThis.document = {
    createElement: (tagName) => new Element(tagName),
    addEventListener: (type, handler, capture) => events.set(`${type}:${capture}`, handler),
    removeEventListener: (type, handler, capture) => {
      if (events.get(`${type}:${capture}`) === handler) events.delete(`${type}:${capture}`);
    },
  };
  globalThis.window = {};
  try {
    const container = new Element('container');
    const bot = fixture();
    bot.setMode = (mode) => { bot.mode = mode; };
    bot.pressedKeys = { 87: true };
    bot.speed = 2;
    bot.velocity.x = 1;
    bot.velocity.y = 1;
    const gameControl = {
      isPaused: false,
      pause() { this.isPaused = true; },
      resume() { this.isPaused = false; this.resumed = true; },
    };
    const gameEnv = {
      innerWidth: 640,
      innerHeight: 360,
      container,
      gameObjects: [bot],
      gameControl,
    };
    const prompt = new RaceDifficultyPrompt({}, gameEnv);

    assert.equal(gameControl.isPaused, true);
    assert.equal(prompt.element.style.position, 'absolute');
    assert.equal(prompt.element.style.inset, '0');
    assert.equal(prompt.element.style.display, 'flex');
    assert.equal(prompt.element.style.zIndex, '30');
    assert.ok(container.children.includes(prompt.element));
    assert.equal(prompt.easyButton.textContent, 'Easy');
    assert.equal(prompt.hardButton.textContent, 'Hard');
    let movementWasBlocked = false;
    events.get('keydown:true')({
      keyCode: 87,
      preventDefault() { movementWasBlocked = true; },
      stopImmediatePropagation() { movementWasBlocked = true; },
    });
    assert.equal(movementWasBlocked, true, 'cars cannot move before difficulty is selected');
    prompt.hardButton.listeners.click();
    assert.equal(bot.mode, 'ai');
    assert.equal(gameControl.isPaused, false);
    assert.equal(gameControl.resumed, true);
    assert.deepEqual(bot.pressedKeys, {});
    assert.deepEqual(bot.velocity, { x: 0, y: 0 });
    assert.equal(prompt.element.removed, true);
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('only the blue car on the autumn level is controlled by the bot', () => {
  const level = new GameLevelAutumn({ path: '/assets' });
  const cars = level.classes.filter(({ data }) => data.name === 'Red Car' || data.name === 'Blue Car');

  assert.equal(level.classes.at(-1).class, RaceDifficultyPrompt);
  assert.equal(typeof level.initialize, 'undefined');
  assert.equal(cars.find(({ data }) => data.name === 'Red Car').class.name, 'Player');
  assert.equal(cars.find(({ data }) => data.name === 'Blue Car').class, RacingBot);
  const [redCar, blueCar] = cars.map(({ data }) => data.INIT_POSITION);
  assert.equal(redCar.x, blueCar.x);
  assert.ok(redCar.y < blueCar.y, 'red car starts above blue car');
  assert.ok(redCar.x + 18 / 643 < 0.453, 'both cars start behind the finish line');
  assert.equal(cars[0].data.heading, Math.PI / 2);
  assert.equal(cars[1].data.heading, Math.PI / 2);
  assert.deepEqual(cars[0].data.hitbox, RACING_CAR_HITBOX);
  assert.deepEqual(cars[1].data.hitbox, RACING_CAR_HITBOX);
  const barriers = level.classes.filter(({ class: ObjectClass }) => ObjectClass === SplineBarrier);
  assert.deepEqual(barriers.map(({ data }) => data.splinePoints), AUTUMN_SPLINE_BARRIER_POINTS);
});

test('restarting Autumn destroys every old game object and removes stale car canvases', () => {
  const destroyed = [];
  const canvases = [
    { removed: false, remove() { this.removed = true; } },
    { removed: false, remove() { this.removed = true; } },
  ];
  const gameEnv = {
    path: '/assets',
    gameObjects: [],
    container: { querySelectorAll: () => canvases },
  };
  gameEnv.gameObjects = ['player', 'bot', 'hud'].map((name) => ({
    destroy() {
      destroyed.push(name);
      gameEnv.gameObjects.splice(gameEnv.gameObjects.indexOf(this), 1);
    },
  }));
  const level = new GameLevelAutumn(gameEnv);

  level.destroy();

  assert.deepEqual(destroyed, ['hud', 'bot', 'player']);
  assert.deepEqual(gameEnv.gameObjects, []);
  assert.ok(canvases.every(({ removed }) => removed));
});

test('bot is recognized as a player by spline barriers', () => {
  assert.equal(Object.create(RacingBot.prototype).isPlayer, true);
});

test('spline barrier pushes the bot away from its curve', () => {
  const bot = fixture();
  bot.position = { x: 45, y: 46 };
  bot.width = 10;
  bot.height = 10;
  const originalY = bot.position.y;
  const barrier = Object.create(SplineBarrier.prototype);
  barrier.gameEnv = { gameObjects: [bot] };
  barrier.collisionWidth = 5;
  barrier.getCanvasPoints = () => [{ x: 0, y: 50 }, { x: 100, y: 50 }];

  barrier.resolvePlayerCollision();

  assert.notEqual(bot.position.y, originalY);
});

test('player and bot use the same car physics in both bot modes', () => {
  const player = createKeyboardPlayer(PlayerCar);
  Object.assign(player, RACING_CAR_PHYSICS);
  const bot = fixture();

  for (const mode of ['hardcoded', 'ai']) {
    bot.setMode(mode);
    for (const [property, value] of Object.entries(RACING_CAR_PHYSICS)) {
      assert.equal(bot[property], value, `${mode} mode preserves ${property}`);
      assert.equal(player[property], value, `player uses ${property}`);
    }
  }
});

test('genetic training is repeatable for the same seed and completes a simulated three-lap race', () => {
  const first = evolveAutumnBot({ generations: 3, populationSize: 4, seed: 42 });
  const second = evolveAutumnBot({ generations: 3, populationSize: 4, seed: 42 });

  assert.deepEqual(first, second);
  assert.equal(first.result.completed, true);
  assert.equal(first.result.lapsCompleted, 3);
});

test('saved offline genome beats the untrained centerline baseline', () => {
  assert.ok(scoreGenome(AUTUMN_BOT_GENOME) > scoreGenome(createInitialGenome()));
});

test('genome route and steering controls reject invalid training data', () => {
  assert.throws(() => createRouteFromGenome({ offsets: [], speedFractions: [] }), /invalid shape/);
  assert.throws(() => createRouteFromGenome({
    offsets: AUTUMN_TRACK_CENTERLINE.map(() => 0),
    speedFractions: AUTUMN_TRACK_CENTERLINE.map(() => 2),
  }), /invalid shape/);
  const route = createRouteFromGenome({
    offsets: AUTUMN_TRACK_CENTERLINE.map((_, index) => index === 0 ? 1 : 0),
    speedFractions: AUTUMN_TRACK_CENTERLINE.map(() => 0.8),
  });
  assert.ok(Math.hypot(
    (route[0].x - AUTUMN_TRACK_CENTERLINE[0].x) * 643,
    (route[0].y - AUTUMN_TRACK_CENTERLINE[0].y) * 360,
  ) > 9);
  assert.throws(() => getBotControls({
    position: { x: 0, y: 0 },
    heading: 0,
    speed: 0,
    waypointIndex: 99,
    route: [],
    width: 643,
    height: 360,
    mode: 'ai',
  }), TypeError);
});
