// PopupMenu: the arrow keys step over a disabled item, and destroy() lets go of its button.
import assert from 'node:assert/strict';
import test from 'node:test';

import { fakeEvent, installFakeDom } from './fake-dom.mjs';

const { document } = installFakeDom();
const { PopupMenu } = await import('../js/popup-menu.js');

function makeMenu(items) {
  const button = document.createElement('button');
  const container = document.createElement('div');
  document.body.append(button, container);
  const menu = new PopupMenu({ button, container, label: 'Attach', items });
  return { button, container, menu };
}

const focused = () => document.activeElement?.querySelector('.ocs__menu-name')?.textContent;

test('the arrow keys step through the enabled items, past a disabled one', () => {
  const { button, menu } = makeMenu([
    { icon: 'fa-image', label: 'Off', disabled: true, onPick: () => {} },
    { icon: 'fa-file', label: 'A', onPick: () => {} },
    { icon: 'fa-folder', label: 'B', onPick: () => {} },
  ]);
  button.dispatchEvent(fakeEvent('click'));
  assert.equal(focused(), 'A');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(focused(), 'B');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(focused(), 'A', 'it wraps round to the first enabled item');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'ArrowUp' }));
  assert.equal(focused(), 'B');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'Home' }));
  assert.equal(focused(), 'A');
});

test('destroy() lets go of the button: a click no longer opens anything', () => {
  const { button, container, menu } = makeMenu([{ icon: 'fa-file', label: 'A', onPick: () => {} }]);
  menu.destroy();
  button.dispatchEvent(fakeEvent('click'));
  button.dispatchEvent(fakeEvent('keydown', { key: 'ArrowDown' }));
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(button.listenerCount('click'), 0);
  assert.equal(button.listenerCount('keydown'), 0);
  assert.equal(container.querySelector('.ocs__menu'), null);
});
