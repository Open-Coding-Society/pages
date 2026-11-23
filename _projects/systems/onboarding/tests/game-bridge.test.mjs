import test from 'node:test';
import assert from 'node:assert/strict';
import { connectGameControls } from '../js/game-bridge.js';

test('only the parent can pause and resume the active game', () => {
  const messages = [];
  const parent = { postMessage: (data, origin) => messages.push({ data, origin }) };
  const host = {
    parent,
    location: { origin: 'https://site.test' },
    addEventListener: (_, listener) => { host.receive = listener; },
  };
  const control = {
    isPaused: false,
    pause() { this.isPaused = true; },
    resume() { this.isPaused = false; },
  };
  connectGameControls({ gameControl: control }, { host });
  assert.equal(messages[0].data.type, 'ocs-onboarding-game-ready');
  const event = { origin: host.location.origin, source: parent, data: { type: 'ocs-onboarding-game-control', action: 'pause' } };
  host.receive({ ...event, source: {} });
  host.receive({ ...event, origin: 'https://other.test' });
  assert.equal(control.isPaused, false);
  host.receive(event);
  assert.equal(control.isPaused, true);
  assert.equal(messages.at(-1).data.paused, true);
  host.receive({ ...event, data: { ...event.data, action: 'resume' } });
  assert.equal(control.isPaused, false);
  assert.equal(messages.at(-1).data.paused, false);
  control.isPaused = true;
  host.receive(event);
  assert.equal(control.isPaused, true);
  assert.match(messages.at(-1).data.error, /dialog/);
});
