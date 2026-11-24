import test from 'node:test';
import assert from 'node:assert/strict';
import { GameExecutor } from '../assets/js/pages/runners/executors/GameExecutor.js';

function button() {
  const classes = new Set();
  return {
    disabled: false, title: '', classList: {
      toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
      contains: name => classes.has(name),
    },
    setAttribute(name, value) { this[name] = value; },
  };
}

test('runner pause controls the active nested game and reflects its state', () => {
  const pauseButton = button();
  const executor = new GameExecutor({ pauseButton });
  const parent = { isPaused: true };
  const nested = {
    isPaused: false,
    pause() { this.isPaused = true; },
    resume() { this.isPaused = false; },
  };
  executor.gameControl = parent;
  executor.gameCore = { activeGameControl: nested };
  executor.togglePause();
  assert.equal(nested.isPaused, true);
  assert.equal(pauseButton['aria-label'], 'Resume Game');
  assert.equal(pauseButton.classList.contains('run'), true);
  executor.togglePause();
  assert.equal(nested.isPaused, false);
  assert.equal(pauseButton['aria-label'], 'Pause Game');
});

test('stopping a runner destroys the game and resets its controls', () => {
  let destroyed = 0;
  const pauseButton = button();
  const runButton = button();
  const stopButton = button();
  const executor = new GameExecutor({ pauseButton, runButton, stopButton });
  executor.gameCore = { destroy() { destroyed++; } };
  executor.gameControl = { isPaused: true };
  executor.stop();
  assert.equal(destroyed, 1);
  assert.equal(executor.gameControl, null);
  assert.equal(runButton.disabled, false);
  assert.equal(pauseButton.disabled, true);
  assert.equal(stopButton.disabled, true);
});
