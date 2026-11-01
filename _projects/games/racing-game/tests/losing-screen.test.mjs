import test from 'node:test';
import assert from 'node:assert/strict';
import LosingScreen from '../levels/Losing-Screen.js';

class TestElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.textContent = '';
    this.className = '';
    this.attributes = {};
    this.style = {};
    this.removed = false;
    this.listeners = {};
  }

  append(...children) {
    this.children.push(...children);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener(name, listener) {
    this.listeners[name] = listener;
  }

  click() {
    this.listeners.click?.();
  }

  focus() {
    this.focused = true;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  remove() {
    this.removed = true;
  }
}

function findByClass(element, className) {
  if (element.className === className) return element;
  return element.children.map((child) => findByClass(child, className)).find(Boolean);
}

test('shows continue and mutual-restart choices and advances when the winner continues', (t) => {
  const originalDocument = globalThis.document;
  t.after(() => {
    if (typeof originalDocument === 'undefined') delete globalThis.document;
    else globalThis.document = originalDocument;
  });
  globalThis.document = { createElement: (tagName) => new TestElement(tagName) };

  const container = new TestElement('container');
  const calls = [];
  const gameControl = {
    currentLevelIndex: 1,
    levelClasses: ['tutorial', 'winter', 'spring'],
    pause: () => calls.push('pause'),
    resume: () => calls.push('resume'),
    transitionToLevel: () => calls.push('restart')
  };
  const screen = new LosingScreen({
    container,
    gameControl,
    loserName: 'Blue Car',
    onContinue: () => {
      gameControl.currentLevelIndex += 1;
      gameControl.transitionToLevel();
    }
  });
  const element = container.children[0];
  const buttons = findByClass(element, 'racing-losing-screen__buttons');
  const continueButton = findByClass(element, 'racing-losing-screen__continue');
  const restartButton = findByClass(element, 'racing-losing-screen__restart');

  assert.equal(element.children[0].textContent, 'Race over');
  assert.equal(element.children[1].textContent, 'Blue Car lost');
  assert.equal(buttons.children.length, 2);
  assert.equal(continueButton.textContent, 'Winner: Continue to next level');
  assert.equal(restartButton.textContent, 'Restart level (mutual agreement)');
  assert.equal(continueButton.focused, true);
  assert.deepEqual(calls, ['pause']);

  continueButton.click();

  assert.equal(gameControl.currentLevelIndex, 2);
  assert.deepEqual(calls, ['pause', 'resume', 'restart']);
  assert.equal(element.removed, true);
  screen.destroy();
});

test('restarts on one click and explains that restarting requires mutual agreement', (t) => {
  const originalDocument = globalThis.document;
  t.after(() => {
    if (typeof originalDocument === 'undefined') delete globalThis.document;
    else globalThis.document = originalDocument;
  });
  globalThis.document = { createElement: (tagName) => new TestElement(tagName) };

  const container = new TestElement('container');
  const calls = [];
  const gameControl = {
    pause: () => calls.push('pause'),
    resume: () => calls.push('resume'),
    transitionToLevel: () => calls.push('restart')
  };
  const screen = new LosingScreen({ container, gameControl, loserName: 'Blue Car' });
  const element = container.children[0];
  const restartButton = findByClass(element, 'racing-losing-screen__restart');
  const status = findByClass(element, 'racing-losing-screen__status');

  assert.equal(status.textContent, 'Restart only if both players agree.');
  restartButton.click();
  assert.deepEqual(calls, ['pause', 'resume', 'restart']);
  assert.equal(element.removed, true);
  screen.destroy();
});

test('supports the secret-level success message and return action', (t) => {
  const originalDocument = globalThis.document;
  t.after(() => {
    if (typeof originalDocument === 'undefined') delete globalThis.document;
    else globalThis.document = originalDocument;
  });
  globalThis.document = { createElement: (tagName) => new TestElement(tagName) };

  const container = new TestElement('container');
  let returnedToSpring = false;
  const screen = new LosingScreen({
    container,
    gameControl: { pause() {}, resume() {} },
    title: 'Test passed',
    message: 'Congratulations! You passed this test!',
    continueLabel: 'Winner: Return to Spring',
    onContinue: () => { returnedToSpring = true; }
  });
  const element = container.children[0];

  assert.equal(element.children[0].textContent, 'Test passed');
  assert.equal(element.children[1].textContent, 'Congratulations! You passed this test!');
  findByClass(element, 'racing-losing-screen__continue').click();
  assert.equal(returnedToSpring, true);
});
