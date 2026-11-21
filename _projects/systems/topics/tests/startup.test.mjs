import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

function startBootstrap() {
  const html = readFileSync(new URL('../_includes/topics-browser.html', import.meta.url), 'utf8');
  const script = html.match(/<script data-topics-bootstrap>([\s\S]*?)<\/script>/)[1];
  const classes = new Set();
  const listeners = new Map();
  const status = { textContent: '' };
  const controls = [{ disabled: false }, { disabled: false }];
  const errors = [];
  const root = {
    classList: { add: (value) => classes.add(value), remove: (value) => classes.delete(value) },
    addEventListener: (type, handler) => listeners.set(type, handler),
    querySelector: () => status,
    querySelectorAll: () => controls,
  };
  runInNewContext(script, { document: { currentScript: { parentElement: root } }, console: { error: (message) => errors.push(message) } });
  return { classes, listeners, status, controls, errors };
}

test('startup hides fallback cards until the browser is ready', () => {
  const { classes, listeners } = startBootstrap();
  assert.equal(classes.has('topics-browser--loading'), true);
  listeners.get('error')({ target: { hasAttribute: () => false } });
  assert.equal(classes.has('topics-browser--loading'), true);
});

test('a failed Topics script reveals the fallback and reports the error', () => {
  const { classes, listeners, status, controls, errors } = startBootstrap();
  listeners.get('error')({ target: { hasAttribute: (name) => name === 'data-topics-script' } });
  assert.equal(classes.has('topics-browser--loading'), false);
  assert.match(status.textContent, /unavailable.*document links remain available/i);
  assert.ok(controls.every((control) => control.disabled));
  assert.equal(errors.length, 1);
});

test('a browser without module support reveals the fallback', () => {
  const { classes, listeners, status } = startBootstrap();
  listeners.get('topics-load-error')();
  assert.equal(classes.has('topics-browser--loading'), false);
  assert.match(status.textContent, /unavailable/i);
});
