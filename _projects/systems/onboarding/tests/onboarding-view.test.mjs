import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

async function viewer(id, { offline = false, viewerMode = true } = {}) {
  const elements = new Map();
  const listeners = {};
  const observers = [];
  const runs = [];
  const timers = [];
  let session;
  let reads = 0;
  let unlocks = 0;
  let releaseReset;
  let resetWait;
  let releaseUnlock;
  let unlockWait;
  const progress = { user: null, unlocked: [], ...(offline ? { offline: true } : {}) };
  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        hidden: false, disabled: false, textContent: '', dataset: {}, children: [],
        clientWidth: 800, clientHeight: 450,
        classList: { add() {} }, style: { setProperty() {} },
        querySelector: element,
        append(...nodes) { this.children.push(...nodes); },
        addEventListener(type, handler) { this[type] = handler; },
      });
    }
    return elements.get(selector);
  }
  const controller = {
    setCode(code) { this.code = code; },
    async run() { runs.push({ code: this.code, session }); session.control = { retryLevelCompletion() { this.retried = true; } }; },
    stop() { if (session?.control) session.control = null; },
  };
  class Store {
    async read() { reads++; return { ...progress, unlocked: [...progress.unlocked] }; }
    async unlock() { unlocks++; if (unlockWait) await unlockWait; return { ...progress, unlocked: [id] }; }
    async reset() { if (resetWait) await resetWait; return { ...progress, unlocked: [] }; }
  }
  const root = { dataset: { baseurl: '/pages' }, querySelector: element };
  const host = {
    OCSGameRunners: { onboarding: controller },
    addEventListener(type, handler) { listeners[type] = handler; },
    setInterval() {}, confirm: () => true,
    setTimeout(handler) { timers.push(handler); return timers.length; },
    clearTimeout(id) { if (id) timers[id - 1] = null; },
  };
  const source = readFileSync(new URL('../js/onboarding-view.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '');
  runInNewContext(source, {
    document: { querySelector: () => root },
    location: { search: `?challenge=${id}${viewerMode ? '&onboarding_view=1' : ''}` },
    window: host, URLSearchParams, pythonURI: '', fetchOptions: {}, Backend: class {}, FlaskProfile: class {},
    OnboardingStore: Store, configureOnboardingGame: value => { session = value; },
    challengeById: () => ({
      id, title: 'Challenge', description: 'Description', url: '/challenge/',
      ...(id === 'identity-forge' ? { gate: 'identity-cookie' } : {}),
      ...(id === 'toolchain-trail' ? { gate: 'toolchain-snake' } : {}),
    }),
    ResizeObserver: class { observe() {} },
    MutationObserver: class {
      constructor(callback) { observers.push(callback); }
      observe() {}
    },
    console: { error() {} },
  });
  await new Promise(resolve => setImmediate(resolve));
  return {
    element, runs, controller, listeners,
    get session() { return session; },
    get reads() { return reads; },
    get unlocks() { return unlocks; },
    delayReset() { resetWait = new Promise(resolve => { releaseReset = resolve; }); },
    releaseReset() { releaseReset(); },
    delayUnlock() { unlockWait = new Promise(resolve => { releaseUnlock = resolve; }); },
    releaseUnlock() { releaseUnlock(); },
    notifyMutations() { observers.forEach(callback => callback()); },
    fireToastTimers() { timers.splice(0).forEach(handler => handler && handler()); },
    setUnlocked(value) { progress.unlocked = value ? [id] : []; },
  };
}

test('gated challenges start their own runner and report offline storage', async () => {
  const env = await viewer('identity-forge', { offline: true });
  assert.match(env.controller.code, /identity-forge-game\.js/);
  assert.equal(env.runs.length, 1);
  assert.equal(env.session.unlocked, false);
  assert.equal(env.element('[data-runner-shell]').hidden, false);
  assert.match(env.element('[data-challenge-status]').textContent, /Playing offline/);
  assert.equal(env.element('[data-game-reset]').disabled, true);
  const standalone = await viewer('identity-forge', { viewerMode: false });
  assert.equal(standalone.element('[data-standalone-back]').hidden, false);
});

test('ungated games do not read profile progress', async () => {
  const env = await viewer('wayfinding-world');
  assert.equal(env.reads, 0);
  assert.match(env.controller.code, /wayfinding-world-game\.js/);
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.equal(env.element('[data-game-reset]').hidden, true);
});

test('game messages overlay the game area, fade on their own and clear on restart', async () => {
  const env = await viewer('identity-forge');
  assert.ok(env.element('.game-output').children.includes(env.element('[data-game-overlay]')));
  const hud = env.session.pathwayHud;
  hud.setMessage('<b>Saved</b>');
  hud.setHint('Press E');
  assert.equal(env.element('[data-game-message]').textContent, '<b>Saved</b>');
  assert.equal(env.element('[data-game-message]').hidden, false);
  assert.equal(env.element('[data-game-hint]').textContent, 'Press E');
  env.fireToastTimers();
  assert.equal(env.element('[data-game-message]').hidden, true);
  assert.equal(env.element('[data-game-hint]').hidden, false);
  hud.setMessage('Another toast');
  hud.clear();
  assert.equal(env.element('[data-game-message]').hidden, true);
  env.fireToastTimers();
  assert.equal(env.element('[data-game-hint]').hidden, true);
  assert.equal(env.element('[data-game-details]').hidden, true);
});

test('scores replace only the running status while available', async () => {
  const env = await viewer('identity-forge');
  const status = env.element('.control-panel > .game-status');
  const statusText = env.element('.status-text');
  const scores = env.element('[data-game-scores]');
  statusText.textContent = 'Running';
  env.notifyMutations();
  assert.equal(status.hidden, false);
  assert.equal(scores.hidden, true);
  scores.children.push({});
  env.notifyMutations();
  assert.equal(status.hidden, true);
  assert.equal(scores.hidden, false);
  statusText.textContent = 'Paused';
  env.notifyMutations();
  assert.equal(status.hidden, false);
  assert.equal(scores.hidden, true);
  statusText.textContent = 'Running';
  scores.children.pop();
  env.notifyMutations();
  assert.equal(status.hidden, false);
  assert.equal(scores.hidden, true);
});

test('gate completion updates the viewer without restarting the runner', async () => {
  const env = await viewer('toolchain-trail');
  const event = { game: { challengeId: 'toolchain-trail' } };
  env.session.onProgress({ ...event, status: 'completing' });
  assert.equal(env.element('[data-game-reset]').disabled, true);
  env.session.onProgress({ ...event, status: 'failed', error: 'offline' });
  assert.equal(env.element('[data-unlock-retry]').hidden, false);
  env.element('[data-unlock-retry]').click();
  assert.equal(env.session.control.retried, true);
  env.session.onProgress({ ...event, status: 'completed', result: { user: null, unlocked: ['toolchain-trail'] } });
  assert.equal(env.element('[data-gate]').hidden, true);
  assert.equal(env.session.unlocked, true);
  assert.equal(env.runs.length, 1);
});

test('a save waits for replay and cannot unlock the replaced game', async () => {
  const env = await viewer('toolchain-trail');
  const old = env.session;
  env.delayReset();
  env.element('[data-game-reset]').click();
  const saving = old.save();
  assert.equal(env.unlocks, 0);
  env.releaseReset();
  await assert.rejects(saving, /restarted/);
  assert.equal(env.unlocks, 0);
  assert.equal(env.runs.length, 2);
  assert.notEqual(env.session, old);
});

test('a save that finishes after Stop still updates unlock and replay state', async () => {
  const env = await viewer('toolchain-trail');
  env.delayUnlock();
  env.session.onProgress({ game: { challengeId: 'toolchain-trail' }, status: 'completing' });
  const saving = env.session.save();
  env.controller.stop();
  env.releaseUnlock();
  await saving;
  assert.equal(env.session.unlocked, true);
  assert.equal(env.element('[data-game-reset]').disabled, false);
  assert.match(env.element('[data-challenge-status]').textContent, /Unlocked/);
});

test('a progress change in another tab restarts the running game with the right gate', async () => {
  const env = await viewer('identity-forge');
  env.setUnlocked(true);
  await env.listeners.focus();
  assert.equal(env.runs.length, 2);
  assert.equal(env.session.unlocked, true);
  assert.equal(env.element('[data-gate]').hidden, true);
});

test('viewer markup uses the shared runner without an iframe or level selector', () => {
  const page = readFileSync(new URL('../pages/onboarding-view.md', import.meta.url), 'utf8');
  assert.match(page, /include runners\/game\.html/);
  assert.match(page, /hide_level_select="true"/);
  assert.match(page, /extra_controls=onboarding_controls status_content=onboarding_scores/);
  assert.doesNotMatch(page, /<iframe/i);
  // The gate's counter and instructions sit beside the game controls.
  assert.match(page, /onboarding_controls %}<button[^]*data-game-reset[^]*data-gate[^]*data-gate-instructions[^]*endcapture/);
  // Toasts and hints overlay the game area, inside the runner shell.
  assert.match(page, /data-game-overlay[^]*data-game-message[^]*data-game-hint/);
  // The microblog panel opens per challenge.
  assert.match(page, /microblog: true/);
  assert.match(page, /microblog_topic_param: challenge/);
});
