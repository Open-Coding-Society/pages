// The "Notify my phone" button (js/notify-button.js) against a stand-in push module: what it
// shows for each state push-notifications.js reports, and what a click does.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { initNotifyButton } from '../js/notify-button.js';

const STATES = {
  unsupported: 'cannot',
  install: 'Add to Home Screen',
  unavailable: 'not set up',
  blocked: 'blocked',
  off: 'off',
  on: 'on',
};

function fakeButton() {
  const classes = new Set(['hidden']);
  const attributes = {};
  let onClick = null;
  return {
    textContent: '',
    title: '',
    disabled: false,
    classList: {
      toggle: (name, force) => (force ? classes.add(name) : classes.delete(name)),
      contains: name => classes.has(name),
    },
    setAttribute: (name, value) => { attributes[name] = value; },
    attributes,
    addEventListener: (type, handler) => { if (type === 'click') onClick = handler; },
    click: () => onClick(),
  };
}

function fakePush(initial) {
  const calls = [];
  let state = initial;
  return {
    STATES,
    calls,
    pushState: async () => state,
    enablePush: async () => { calls.push('enable'); state = 'on'; return { ok: true, state, message: STATES.on }; },
    disablePush: async () => { calls.push('disable'); state = 'off'; return { ok: true, state, message: STATES.off }; },
    sendTestPush: async () => { calls.push('test'); },
  };
}

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

test('hidden when this browser or the server cannot do push', async () => {
  for (const state of ['unsupported', 'unavailable']) {
    const button = fakeButton();
    initNotifyButton({ push: fakePush(state), button, notice: {} });
    await settle();
    assert.equal(button.classList.contains('hidden'), true, state);
  }
});

test('an iPhone outside the Home Screen app is told how to install, without asking permission', async () => {
  const button = fakeButton();
  const notice = { textContent: '' };
  const push = fakePush('install');
  initNotifyButton({ push, button, notice });
  await settle();
  assert.equal(button.classList.contains('hidden'), false);

  await button.click();
  assert.match(notice.textContent, /Add to Home Screen/);
  assert.deepEqual(push.calls, []);
});

test('turning it on subscribes and sends a test push; turning it off unsubscribes', async () => {
  const button = fakeButton();
  const notice = { textContent: '' };
  const push = fakePush('off');
  initNotifyButton({ push, button, notice });
  await settle();
  assert.equal(button.textContent, 'Notify my phone');

  await button.click();
  await settle();
  assert.deepEqual(push.calls, ['enable', 'test']);
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(notice.textContent, STATES.on);

  await button.click();
  await settle();
  assert.deepEqual(push.calls, ['enable', 'test', 'disable']);
  assert.equal(button.attributes['aria-pressed'], 'false');
});

test('blocked notifications disable the button', async () => {
  const button = fakeButton();
  initNotifyButton({ push: fakePush('blocked'), button, notice: {} });
  await settle();
  assert.equal(button.disabled, true);
});
