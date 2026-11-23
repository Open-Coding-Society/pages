import test from 'node:test';
import assert from 'node:assert/strict';
import GameControl from '../essentials/GameControl.js';
import GameLevel from '../essentials/GameLevel.js';
import GameEnv from '../essentials/GameEnv.js';
import { GameCore } from '../essentials/Game.js';

function harness(t, levels, options = {}) {
  const frames = [];
  const previousFrame = globalThis.requestAnimationFrame;
  const previousDocument = globalThis.document;
  const create = GameLevel.prototype.create;
  const destroy = GameLevel.prototype.destroy;
  globalThis.requestAnimationFrame = callback => frames.push(callback);
  globalThis.document = { addEventListener() {}, removeEventListener() {} };
  GameLevel.prototype.create = function (Level) {
    this.continue = true;
    this.gameLevel = new Level(this.gameEnv);
  };
  GameLevel.prototype.destroy = function () {
    this.gameLevel.destroy?.();
  };
  t.after(() => {
    globalThis.requestAnimationFrame = previousFrame;
    globalThis.document = previousDocument;
    GameLevel.prototype.create = create;
    GameLevel.prototype.destroy = destroy;
  });
  const game = { path: '' };
  const control = new GameControl(game, levels, options);
  control.transitionToLevel();
  return { control, frame: () => frames.shift()() };
}

test('completion freezes updates, runs the exit sequence once, then advances', async t => {
  let release;
  let updates = 0;
  let exits = 0;
  let destroyed = 0;
  class First {
    update() { updates++; }
    isComplete() { return updates >= 2; }
    onComplete() {
      exits++;
      return new Promise(resolve => { release = resolve; });
    }
    destroy() { destroyed++; }
  }
  class Second {}
  const { control, frame } = harness(t, [First, Second]);
  frame();
  await Promise.resolve();
  assert.equal(exits, 1);
  frame();
  frame();
  assert.equal(updates, 2);
  assert.equal(control.currentLevelIndex, 0);
  release();
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.equal(destroyed, 1);
  assert.equal(control.currentLevelIndex, 1);
  assert.ok(control.currentLevel.gameLevel instanceof Second);
});

test('a failed exit can be retried without advancing or repeating gameplay', async t => {
  let attempts = 0;
  let updates = 0;
  let failure;
  class Level {
    update() { updates++; }
    isComplete() { return true; }
    onComplete() {
      if (++attempts === 1) throw new Error('save failed');
    }
    onCompletionError(error) { failure = error.message; }
  }
  const originalError = console.error;
  console.error = () => {};
  t.after(() => { console.error = originalError; });
  const { control, frame } = harness(t, [Level]);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(failure, 'save failed');
  frame();
  assert.equal(updates, 1);
  control.retryLevelCompletion();
  control.retryLevelCompletion();
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.equal(attempts, 2);
  assert.equal(control.currentLevel, null);
});

test('nested completion resumes the existing parent level', async t => {
  let resumed = 0;
  const parent = {
    levelClasses: ['parent'],
    currentLevelIndex: 0,
    resume() { resumed++; },
    showCanvasState() {},
  };
  class Level { isComplete() { return true; } }
  const { control, frame } = harness(t, [Level], { parentControl: parent });
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.equal(resumed, 1);
  assert.equal(control.currentLevel, null);
  assert.equal(control.game.activeGameControl, parent);
});

test('a replaced level cannot complete later from an old async exit', async t => {
  let release;
  class First {
    isComplete() { return true; }
    onComplete() { return new Promise(resolve => { release = resolve; }); }
  }
  class Second {}
  const { control, frame } = harness(t, [First, Second]);
  await Promise.resolve();
  control.currentLevelIndex = 1;
  control.transitionToLevel();
  release();
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.ok(control.currentLevel.gameLevel instanceof Second);
  assert.equal(control.currentLevel.continue, true);
});

test('level-defined progress is reported as snapshots through completion', async t => {
  let destroyed = false;
  class Level {
    constructor() { this.progress = { id: 'quest', title: 'Quest', current: 0, goal: 2 }; }
    update() { this.progress.current++; }
    getProgress() { return this.progress; }
    isComplete() { return this.progress.current === this.progress.goal; }
    onComplete() { return 'saved'; }
    destroy() { destroyed = true; }
  }
  const { control, frame } = harness(t, [Level]);
  const events = [];
  control.onProgress = event => {
    if (event.status === 'completed') assert.equal(destroyed, true);
    events.push(event);
  };
  control.reportProgress();
  frame();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(events[0].game.current, 1);
  assert.equal(events[1].status, 'completing');
  assert.equal(events[1].game.current, 2);
  frame();
  assert.equal(events[2].status, 'completed');
  assert.equal(events[2].game.id, 'quest');
  assert.equal(events[2].result, 'saved');
});

test('a progress listener configured at start sees immediate completion', async t => {
  const statuses = [];
  class Level {
    getProgress() { return { id: 'instant', current: 1, goal: 1 }; }
    isComplete() { return true; }
  }
  const { frame } = harness(t, [Level], { onProgress: event => statuses.push(event.status) });
  assert.deepEqual(statuses, ['completing']);
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.deepEqual(statuses, ['completing', 'completed']);
});

test('destroy cancels a pending completion and prevents further updates', async t => {
  let release;
  let updates = 0;
  let destroyed = 0;
  class First {
    update() { updates++; }
    isComplete() { return true; }
    onComplete() { return new Promise(resolve => { release = resolve; }); }
    destroy() { destroyed++; }
  }
  class Second {}
  const { control, frame } = harness(t, [First, Second]);
  await Promise.resolve();
  control.destroy();
  release();
  await new Promise(resolve => setImmediate(resolve));
  frame();
  assert.equal(updates, 1);
  assert.equal(destroyed, 1);
  assert.equal(control.currentLevel, null);
  assert.equal(control.currentLevelIndex, 0);
});

test('embedded Escape toggles pause without opening the skip menu', t => {
  let listener;
  const previousDocument = globalThis.document;
  globalThis.document = {
    addEventListener(_type, handler) { listener = handler; },
    removeEventListener() {},
  };
  t.after(() => { globalThis.document = previousDocument; });
  const control = {
    isPaused: false,
    pause() { this.isPaused = true; },
    resume() { this.isPaused = false; },
  };
  const game = Object.assign(Object.create(GameCore.prototype), {
    environment: { disablePauseMenu: true },
    gameControl: control,
    showPauseModal() { assert.fail('Embedded games must not open the skip menu'); },
  });
  game._setupEscapeKey();
  listener({ key: 'Escape', preventDefault() {} });
  assert.equal(control.isPaused, true);
  listener({ key: 'Escape', preventDefault() {} });
  assert.equal(control.isPaused, false);
});

test('level resize listener is removed with the same callback', t => {
  const previousWindow = globalThis.window;
  let added;
  let removed;
  globalThis.window = {
    addEventListener(_type, handler) { added = handler; },
    removeEventListener(_type, handler) { removed = handler; },
  };
  t.after(() => { globalThis.window = previousWindow; });
  const level = new GameLevel({ game: {}, path: '' });
  level.gameEnv.create = () => {};
  level.gameEnv.destroy = () => {};
  level.create(class { constructor() { this.classes = []; } });
  level.destroy();
  assert.equal(removed, added);
});

test('resizing reuses the level canvas and teardown removes it', t => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  const children = [];
  const container = {
    appendChild(canvas) { children.push(canvas); canvas.parentNode = this; },
    removeChild(canvas) { children.splice(children.indexOf(canvas), 1); canvas.parentNode = null; },
  };
  globalThis.document = {
    createElement() { return { style: {}, getContext() { return {}; } }; },
    querySelector() { return null; },
  };
  globalThis.window = { innerWidth: 800, innerHeight: 600 };
  t.after(() => { globalThis.document = previousDocument; globalThis.window = previousWindow; });
  const env = new GameEnv();
  env.gameContainer = container;
  env.game = { environment: { innerWidth: 800, innerHeight: 600 } };
  env.create();
  const canvas = env.canvas;
  env.resize();
  env.resize();
  assert.equal(env.canvas, canvas);
  assert.equal(children.length, 1);
  env.destroy();
  assert.equal(children.length, 0);
});

test('a game that fails during startup destroys its control', () => {
  let destroyed = 0;
  class Control {
    start() { throw new Error('level failed'); }
    destroy() { destroyed++; }
  }
  assert.throws(() => GameCore.main({ gameLevelClasses: [] }, Control), /level failed/);
  assert.equal(destroyed, 1);
});
