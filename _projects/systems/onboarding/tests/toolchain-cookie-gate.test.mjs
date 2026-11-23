import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import GameControl from '../../../../assets/js/GameEnginev1.1/essentials/GameControl.js';

test('Toolchain cookie completion saves once, retries failures, then exits to the viewer', async t => {
  const frames = [];
  const previousFrame = globalThis.requestAnimationFrame;
  const previousDocument = globalThis.document;
  const previousError = console.error;
  globalThis.requestAnimationFrame = callback => frames.push(callback);
  globalThis.document = { removeEventListener() {} };
  console.error = () => {};
  t.after(() => {
    globalThis.requestAnimationFrame = previousFrame;
    globalThis.document = previousDocument;
    console.error = previousError;
  });

  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      textContent: '', disabled: false,
      addEventListener(type, handler) { this[type] = handler; },
    });
    return elements.get(selector);
  }
  const root = { dataset: { baseurl: '' }, querySelector: element };
  const stage = { clientWidth: 400, clientHeight: 300 };
  const messages = [];
  const listeners = {};
  const parent = { postMessage: message => messages.push(message) };
  const host = { parent, addEventListener: (type, handler) => { listeners[type] = handler; } };
  let attempts = 0;
  const progress = { user: null, unlocked: ['toolchain-trail'] };
  class Store {
    async unlock(id) {
      assert.equal(id, 'toolchain-trail');
      if (++attempts === 1) throw new Error('offline');
      return progress;
    }
  }
  class Clicker {
    constructor(data) { this.spriteData = data; }
    handleClick() { this.spriteData.interact(); }
  }
  const Game = {
    main(options) {
      const game = { path: '', environment: options };
      const control = game.gameControl = new GameControl(game, [options.gameLevelClasses[0]]);
      const gameLevel = new options.gameLevelClasses[0]({
        game, path: '', innerWidth: 400, innerHeight: 300, gameControl: control,
      });
      const cookie = new Clicker(gameLevel.classes[0].data);
      control.currentLevel = {
        gameLevel, continue: true, gameEnv: { gameObjects: [cookie] },
        update() {}, destroy() {},
      };
      control.gameLoop();
      return game;
    },
  };
  const context = {
    Game, GameControl, Clicker, pythonURI: '', fetchOptions: {}, Backend: class {}, FlaskProfile: class {},
    OnboardingStore: Store, challengeById: id => id === 'toolchain-trail' ? { id, gate: 'toolchain-cookie' } : null,
    connectGameControls() {}, URLSearchParams, console,
    location: { origin: 'https://site.test', search: '?challenge=toolchain-trail' },
    document: { querySelector: () => root, getElementById: () => stage },
    window: host,
  };
  const levelSource = readFileSync(new URL('../js/toolchain-cookie-gate-level.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace('export default class ToolchainCookieGate', 'class ToolchainCookieGate')
    .concat('\nglobalThis.ToolchainCookieGate = ToolchainCookieGate;');
  runInNewContext(levelSource, context);
  const runnerSource = readFileSync(new URL('../js/toolchain-cookie-gate-runner.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '');
  runInNewContext(runnerSource, context);

  assert.equal(messages[0].type, 'ocs-game-progress');
  assert.equal(messages[0].game.id, 'toolchain-cookie-gate');
  assert.equal(messages[0].game.goal, 5);
  assert.equal(messages[0].game.current, 0);
  for (let i = 0; i < 6; i++) element('[data-gate-click]').click();
  assert.equal(element('[data-gate-count]').textContent, 'Cookies: 5 / 5');
  assert.equal(messages[0].game.current, 0, 'previous progress is a snapshot');
  assert.equal(messages.at(-1).game.current, 5);
  frames.shift()();
  await Promise.resolve();
  assert.equal(messages.at(-1).status, 'completing');
  const control = action => ({ type: 'ocs-game-completion-control', gameId: 'toolchain-cookie-gate', action });
  listeners.message({ origin: 'https://other.test', source: parent, data: control('allow') });
  assert.equal(attempts, 0);
  listeners.message({ origin: 'https://site.test', source: parent, data: { ...control('allow'), gameId: 'other' } });
  assert.equal(attempts, 0);
  listeners.message({ origin: 'https://site.test', source: parent, data: control('allow') });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(attempts, 1);
  assert.equal(messages.at(-1).status, 'failed');
  assert.match(element('[data-gate-error]').textContent, /offline/);

  listeners.message({ origin: 'https://other.test', source: parent, data: control('retry') });
  assert.equal(attempts, 1);
  listeners.message({ origin: 'https://site.test', source: parent, data: control('retry') });
  await Promise.resolve();
  listeners.message({ origin: 'https://site.test', source: parent, data: control('allow') });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(attempts, 2);
  assert.notEqual(messages.at(-1).status, 'completed');
  frames.shift()();
  assert.equal(messages.at(-1).status, 'completed');
  assert.equal(messages.at(-1).result, progress);
});
