import test from 'node:test';
import assert from 'node:assert/strict';
import RacingBot from '../levels/RacingBot.js';
import GameLevelAutumn from '../levels/autumn-level.js';
import { AUTUMN_BOT_GENOME } from '../levels/AutumnBotGenome.js';
import {
  AUTUMN_TRACK_CENTERLINE,
  createInitialGenome,
  createEasyRoute,
  createSuperEasyRoute,
  createRouteFromGenome,
  evolveAutumnBot,
  advanceRouteWaypoint,
  getBotControls,
  hasReachedRouteWaypoint,
  recoverRouteWaypoint,
  refineAutumnBotGenome,
  scoreGenome,
  simulateAutumnRace,
} from '../levels/AutumnBotGenetics.js';
import { createKeyboardPlayer, pressKey } from '@assets/js/GameEnginev1.1/test/keyboard-test-helper.mjs';
import { RACING_CAR_HITBOX, RACING_CAR_PHYSICS } from '../levels/RacingCarPhysics.js';
import PlayerCar from '../levels/PlayerCar.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import {
  AUTUMN_SPLINE_BARRIER_POINTS,
  AUTUMN_TRACK_OBSTACLES,
} from '../levels/AutumnTrackGeometry.js';
import RaceDifficultyPrompt from '../levels/RaceDifficultyPrompt.js';
import TimeLapScreen from '../levels/TimeLapScreen.js';

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
    route: mode === 'ai' ? createRouteFromGenome(AUTUMN_BOT_GENOME) : createEasyRoute(),
    position: { x: 0.4 * 643, y: 0.86 * 360 },
    width: 10,
    height: 10,
    getCenter() {
      return { x: this.position.x + this.width / 2, y: this.position.y + this.height / 2 };
    },
  });
  return bot;
}

test('hardcoded mode accelerates and chooses a safe turn', () => {
  const bot = fixture('hardcoded');
  bot.updateBotControls();

  assert.equal(bot.pressedKeys[keys.up], true);
  assert.equal(bot.pressedKeys[keys.down], undefined);
  assert.equal(bot.pressedKeys[keys.left], true);
  assert.equal(bot.pressedKeys[keys.right], undefined);
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

test('both bot difficulties complete three laps without track or scenery contacts', () => {
  for (const mode of ['hardcoded', 'ai']) {
    const result = simulateAutumnRace({ mode, genome: AUTUMN_BOT_GENOME });
    assert.equal(result.completed, true, `${mode} should complete three laps`);
    assert.equal(result.lapsCompleted, 3);
    assert.equal(result.barrierContacts, 0, `${mode} must avoid the spline barriers`);
    assert.equal(result.obstacleContacts, 0, `${mode} must avoid the box and cone`);
    if (mode === 'ai') {
      assert.ok(result.seconds <= 17, `hard bot took ${result.seconds}s`);
      assert.equal(result.lapFrames.length, 3);
      assert.ok(
        result.lapFrames.every((frame, index) => index === 0 || frame - result.lapFrames[index - 1] < 345),
        `hard bot should not circle before the finish: ${result.lapFrames.join(', ')}`,
      );
    }
  }
});

test('super easy bot takes a slow detour and completes cleanly', () => {
  const easyResult = simulateAutumnRace({ mode: 'hardcoded' });
  for (let seed = 0; seed < 4; seed += 1) {
    const result = simulateAutumnRace({ mode: 'superEasy', maxFrames: 7000, seed });
    const route = createSuperEasyRoute(seed);
    const loopSection = route.slice(2, 18);

    assert.ok(route.length > createEasyRoute().length);
    assert.equal(result.completed, true, `seed ${seed} should finish three laps`);
    assert.equal(result.lapsCompleted, 3);
    assert.equal(result.barrierContacts, 0);
    assert.equal(result.obstacleContacts, 0);
    assert.ok(result.seconds > easyResult.seconds * 1.8);
    assert.ok(
      route[1].y > createEasyRoute()[1].y,
      'super easy should stay toward the outside edge of the opening straight',
    );
    assert.ok(
      Math.hypot(loopSection[0].x - loopSection.at(-1).x, loopSection[0].y - loopSection.at(-1).y) < 0.001,
      'super easy should include a novice-style loop',
    );
    assert.deepEqual(createSuperEasyRoute(seed), route, 'the same route seed should produce the same loop');
  }
  assert.notDeepEqual(createSuperEasyRoute(0), createSuperEasyRoute(1), 'different seeds should vary loop positions');
});

test('only easy modes wait for the player before starting', () => {
  for (const mode of ['superEasy', 'hardcoded', 'ai']) {
    const gameEnv = {
      innerWidth: 643,
      innerHeight: 360,
      gameControl: { isPaused: false },
      container: { isConnected: true },
      gameObjects: [],
    };
    const bot = createKeyboardPlayer(RacingBot, { keypress: keys, gameEnv });
    const player = createKeyboardPlayer(PlayerCar, { gameEnv });
    Object.assign(bot, RACING_CAR_PHYSICS);
    player.speed = 0;
    bot.setMode(mode);
    bot.speed = 0;
    bot.heading = Math.PI / 2;
    bot.getCenter = () => ({ x: 0.4 * 643 + 18, y: 0.82 * 360 + 18 });
    gameEnv.gameObjects = [player, bot];
    bot.pressedKeys = { [keys.up]: true };
    bot.speed = 0;
    bot.draw = () => {};
    bot.collisionChecks = () => {};
    bot.move = () => {};
    let drawCount = 0;
    bot.draw = () => { drawCount += 1; };

    bot.update();
    assert.equal(drawCount, 1, `${mode} should render while waiting`);
    if (mode === 'ai') {
      assert.equal(bot.raceStarted, true, 'hard should start when the setup screen releases the race');
      assert.ok(bot.speed > 0, 'hard should not wait for the player to move');
      assert.equal(bot.pressedKeys[keys.up], true);
    } else {
      assert.deepEqual(bot.pressedKeys, {}, `${mode} should wait for player movement`);
      assert.equal(bot.speed, 0, `${mode} should stay stopped before the player`);
      assert.equal(bot.raceStarted, false);
    }

    player.speed = 0.2;
    bot.update();
    assert.ok(bot.speed > 0, `${mode} should start moving when the player starts`);
    assert.equal(bot.raceStarted, true);

    player.speed = 0;
    bot.pressedKeys = {};
    bot.updateBotControls = () => { bot.pressedKeys = { [keys.up]: true }; };
    bot.update();
    assert.ok(bot.speed > 0, `${mode} should keep moving after the player stops`);
    assert.equal(bot.pressedKeys[keys.up], true);
  }
});

test('an obstacle collision does not trigger scripted reverse and normal routing continues', () => {
  const bot = fixture('hardcoded');
  bot.raceStarted = true;
  bot.speed = 2;
  bot.state = { collisionEvents: ['cone-1'] };
  bot.draw = () => {};
  bot.collisionChecks = () => {};
  bot.move = () => {};
  let routeWasUsed = false;
  bot.updateBotControls = () => {
    routeWasUsed = true;
    bot.pressedKeys = { [keys.up]: true };
  };

  bot.update();
  assert.equal(routeWasUsed, true);
  assert.equal(bot.pressedKeys[keys.up], true);
  assert.equal(bot.pressedKeys[keys.down], undefined);
  assert.equal(bot.speed, 2.2, 'the bot continues forward under shared player physics');
});

test('a stalled bot continues applying its route controller instead of scripted reverse', () => {
  const bot = fixture('hardcoded');
  bot.raceStarted = true;
  bot.speed = 2;
  bot.state = { collisionEvents: [] };
  bot.draw = () => {};
  bot.collisionChecks = () => {};
  bot.move = () => {};
  bot.updateBotControls = () => {
    bot.pressedKeys = { [keys.up]: true };
  };

  bot.update();

  assert.equal(bot.pressedKeys[keys.up], true);
  assert.equal(bot.pressedKeys[keys.down], undefined);
  assert.equal(bot.speed, 2.2);
});

test('easy bot performs a full forward 360 spin after cone collision, then resumes its route', () => {
  const bot = fixture('superEasy');
  bot.raceStarted = true;
  bot.state = { collisionEvents: ['cone-1'] };
  bot.draw = () => {};
  bot.collisionChecks = () => {};
  bot.move = function move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };
  let totalTurn = 0;
  let normalRouteResumed = false;
  const updateRouteControls = bot.updateBotControls.bind(bot);
  bot.updateBotControls = () => {
    normalRouteResumed = true;
    updateRouteControls();
  };

  for (let frame = 0; frame < 180 && !normalRouteResumed; frame += 1) {
    bot.state.collisionEvents = frame === 0 ? ['cone-1'] : [];
    const previousHeading = bot.heading;
    bot.update();
    const headingChange = ((bot.heading - previousHeading + Math.PI) % (2 * Math.PI) + 2 * Math.PI)
      % (2 * Math.PI) - Math.PI;
    totalTurn += Math.max(0, headingChange);
  }

  assert.ok(totalTurn >= Math.PI * 2, 'the bot should complete a full 360-degree turn');
  assert.equal(normalRouteResumed, true);
  assert.equal(bot.spinRecovery, null);
});

test('waypoints advance when the bot passes them instead of orbiting behind', () => {
  const route = [{ x: 0.1, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.9, y: 0.5 }];

  assert.equal(hasReachedRouteWaypoint({ x: 510, y: 180 }, route, 1, 1000, 360, 20), true);
  assert.equal(hasReachedRouteWaypoint({ x: 300, y: 180 }, route, 1, 1000, 360, 20), false);
  assert.equal(advanceRouteWaypoint({ x: 950, y: 180 }, route, 1, 1000, 360, 20), 0);
});

test('AI route progress re-localizes after a small off-course push', () => {
  const route = [
    { x: 0.1, y: 0.1 }, { x: 0.4, y: 0.1 }, { x: 0.7, y: 0.1 },
    { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.5 }, { x: 0.9, y: 0.9 },
  ];

  assert.equal(recoverRouteWaypoint({ x: 900, y: 100 }, route, 1, 1000, 1000, 20), 3);
});

test('AI controller re-localizes route progress after a racing collision', () => {
  const bot = fixture('ai');
  bot.route = [
    { x: 0.1, y: 0.1 }, { x: 0.4, y: 0.1 }, { x: 0.7, y: 0.1 },
    { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.5 }, { x: 0.9, y: 0.9 },
  ];
  bot.position = { x: 0.9 * 643 - bot.width / 2, y: 0.1 * 360 - bot.height / 2 };
  bot.waypointIndex = 1;
  bot.state = { collisionEvents: ['red-car'] };

  bot.updateBotControls();

  assert.equal(bot.waypointIndex, 4);
});

test('race winner stops both cars from continuing around the track', () => {
  const winner = fixture('ai');
  const opponent = fixture('hardcoded');
  const screen = Object.create(TimeLapScreen.prototype);
  Object.assign(screen, {
    gameEnv: { gameObjects: [winner, opponent], innerWidth: 643, innerHeight: 360 },
    lapTracker: { update: () => true },
    winnerLabel: null,
    showLosingScreen: false,
    getPlayerLabel: () => 'Hard bot',
  });
  winner.getCenter = () => ({ x: 300, y: 300 });
  opponent.getCenter = () => ({ x: 250, y: 300 });
  winner.speed = 4;
  opponent.speed = 5;

  screen.trackLaps();

  assert.equal(screen.winnerLabel, 'Hard bot');
  assert.equal(winner.raceFinished, true);
  assert.equal(opponent.raceFinished, true);

  winner.pressedKeys = { [keys.up]: true };
  winner.velocity = { x: 2, y: 0 };
  winner.draw = () => {};
  winner.collisionChecks = () => {};
  winner.move = () => {};
  let botControllerCalls = 0;
  winner.updateBotControls = () => { botControllerCalls += 1; };
  winner.update();

  assert.equal(winner.speed, 0);
  assert.deepEqual(winner.pressedKeys, {});
  assert.deepEqual(winner.velocity, { x: 0, y: 0 });
  assert.equal(botControllerCalls, 0);
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

test('race setup pauses until a difficulty is chosen, then starts with that mode', () => {
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
    assert.equal(prompt.mediumButton.textContent, 'Medium');
    assert.equal(prompt.hardButton.textContent, 'Hard');
    assert.match(prompt.easyButton.className, /--easy/);
    assert.match(prompt.mediumButton.className, /--medium/);
    assert.match(prompt.hardButton.className, /--hard/);
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

    const easyPrompt = new RaceDifficultyPrompt({}, gameEnv);
    easyPrompt.easyButton.listeners.click();
    assert.equal(bot.mode, 'superEasy');

    const mediumPrompt = new RaceDifficultyPrompt({}, gameEnv);
    mediumPrompt.mediumButton.listeners.click();
    assert.equal(bot.mode, 'hardcoded');
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
  const obstacles = level.classes
    .filter(({ data }) => data.id === 'box-1' || data.id === 'cone-1');
  assert.deepEqual(obstacles.map(({ data }) => data.INIT_POSITION), [
    AUTUMN_TRACK_OBSTACLES.box.position,
    AUTUMN_TRACK_OBSTACLES.cone.position,
  ]);
  assert.deepEqual(obstacles.map(({ data }) => data.hitbox), [
    AUTUMN_TRACK_OBSTACLES.box.hitbox,
    AUTUMN_TRACK_OBSTACLES.cone.hitbox,
  ]);
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
  const first = evolveAutumnBot({ generations: 3, populationSize: 4, seed: 42, refine: false });
  const second = evolveAutumnBot({ generations: 3, populationSize: 4, seed: 42, refine: false });

  assert.deepEqual(first, second);
  assert.equal(first.result.completed, true);
  assert.equal(first.result.lapsCompleted, 3);
});

test('genome refinement never worsens clean race-time fitness', () => {
  const originalScore = scoreGenome(AUTUMN_BOT_GENOME);
  const refined = refineAutumnBotGenome(AUTUMN_BOT_GENOME, {
    offsetSteps: [],
    speedSteps: [0.12],
  });

  assert.ok(refined.score >= originalScore);
  assert.ok(scoreGenome(refined.genome) >= originalScore);
  assert.throws(() => refineAutumnBotGenome(AUTUMN_BOT_GENOME, { offsetSteps: [0] }), /positive finite steps/);
});

test('saved offline genome beats the untrained centerline baseline', () => {
  assert.ok(scoreGenome(AUTUMN_BOT_GENOME) > scoreGenome(createInitialGenome()));
});

test('saved offline genome avoids both scenery obstacles in three laps', () => {
  const result = simulateAutumnRace({ mode: 'ai', genome: AUTUMN_BOT_GENOME });

  assert.equal(result.completed, true);
  assert.equal(result.obstacleContacts, 0);
});

test('AI recovers and completes when deterministic pushes nudge it off its route', () => {
  const result = simulateAutumnRace({
    mode: 'ai',
    genome: AUTUMN_BOT_GENOME,
    maxFrames: 1800,
    disturbances: [
      { frame: 250, dx: 10, dy: -8 },
      { frame: 620, dx: -9, dy: 10 },
    ],
  });

  assert.equal(result.completed, true);
  assert.equal(result.lapsCompleted, 3);
  assert.ok(result.barrierContacts >= 0);
  assert.ok(result.obstacleContacts >= 0);
  assert.throws(() => simulateAutumnRace({
    mode: 'ai',
    genome: AUTUMN_BOT_GENOME,
    disturbances: [{ frame: 1, dx: NaN, dy: 0 }],
  }), /finite dx\/dy/);
});

test('AI fitness rewards faster clean races over slower finishes with contacts', () => {
  const slowerGenome = {
    ...AUTUMN_BOT_GENOME,
    speedFractions: AUTUMN_BOT_GENOME.speedFractions.map((value) => Math.max(0.35, value * 0.75)),
  };
  const fastResult = simulateAutumnRace({ mode: 'ai', genome: AUTUMN_BOT_GENOME });
  const slowResult = simulateAutumnRace({ mode: 'ai', genome: slowerGenome });

  assert.equal(fastResult.completed, true);
  assert.equal(fastResult.barrierContacts + fastResult.obstacleContacts, 0);
  assert.equal(slowResult.completed, true);
  assert.ok(slowResult.seconds > fastResult.seconds);
  assert.ok(scoreGenome(AUTUMN_BOT_GENOME) > scoreGenome(slowerGenome));
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
