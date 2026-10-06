import test from 'node:test';
import assert from 'node:assert/strict';
import { createActionFeedback } from '../js/action-feedback.mjs';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const buttonFeedbackSource = readFileSync(new URL('../../../../assets/js/pages/runners/core/ButtonFeedback.js', import.meta.url), 'utf8');

test('runner success retains explicit SVG icon markup while legacy labels still flash', () => {
  let done;
  const context = { setTimeout(callback) { done = callback; } };
  vm.createContext(context);
  vm.runInContext(buttonFeedbackSource.replace('export class', 'class')
    .replace('export default ButtonFeedback;', 'globalThis.feedback = ButtonFeedback;'), context);
  const classes = new Set(['ocs__btn--icon']);
  const button = { innerHTML: '<span class="ocs__btn-icon"><svg></svg></span>',
    querySelector() { return {}; },
    classList: { contains: (value) => classes.has(value), add: (value) => classes.add(value),
      remove: (value) => classes.delete(value) } };
  const markup = button.innerHTML;
  context.feedback.flash(button, 'Saved');
  assert.equal(button.innerHTML, markup);
  assert.equal(classes.has('is-action-complete'), true);
  done();
  assert.equal(classes.has('is-action-complete'), false);
  classes.clear();
  context.feedback.flash(button, 'Saved');
  assert.equal(button.innerHTML, 'Saved');
  done();
  assert.equal(button.innerHTML, markup);
});

test('routine feedback fades while live text remains; errors stay visible', () => {
  let hide;
  const original = globalThis.window;
  globalThis.window = {
    clearTimeout() { hide = undefined; },
    setTimeout(callback, delay) { assert.equal(delay, 4000); hide = callback; return 1; }
  };
  try {
    const classes = new Set();
    const region = { dataset: {}, classList: {
      add(value) { classes.add(value); }, remove(value) { classes.delete(value); }
    } };
    const report = createActionFeedback(region);
    report('Saved', 'success');
    assert.equal(classes.has('is-visible'), true);
    hide();
    assert.equal(classes.has('is-visible'), false);
    assert.equal(region.textContent, 'Saved');
    report('Storage failed', 'error');
    assert.equal(hide, undefined);
    assert.equal(classes.has('is-visible'), true);
    assert.equal(region.dataset.state, 'error');
    report('Loaded', 'success');
    assert.equal(typeof hide, 'function');
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});
