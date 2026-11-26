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

test('an item with a glyph shows it as text in the icon slot', () => {
  const { button, menu } = makeMenu([{ glyph: '👍', label: 'Like', onPick: () => {} }]);
  button.dispatchEvent(fakeEvent('click'));

  const icon = menu.element.querySelector('.ocs__menu-icon');
  assert.equal(icon.tagName, 'I');
  assert.equal(icon.textContent, '👍');
  assert.equal(icon.classList.contains('fas'), false);
  assert.equal(icon.getAttribute('aria-hidden'), 'true');
  assert.equal(menu.element.querySelector('.ocs__menu-name').textContent, 'Like');
});

test('a click elsewhere closes the menu without taking focus back to its button', () => {
  const { button, menu } = makeMenu([{ icon: 'fa-file', label: 'A', onPick: () => {} }]);
  const elsewhere = document.createElement('button');
  document.body.appendChild(elsewhere);
  button.dispatchEvent(fakeEvent('click'));
  elsewhere.focus();

  document.dispatchEvent(fakeEvent('click', { target: elsewhere }));

  assert.equal(menu.isOpen(), false);
  assert.equal(document.activeElement, elsewhere, 'focus stays where the click went');
});

test('a horizontal menu says so and steps with Left and Right', () => {
  const button = document.createElement('button');
  const container = document.createElement('div');
  document.body.append(button, container);
  const menu = new PopupMenu({
    button, container, label: 'React', orientation: 'horizontal',
    items: [{ glyph: '👍', label: 'Like', onPick: () => {} }, { glyph: '❤️', label: 'Love', onPick: () => {} }],
  });
  assert.equal(menu.element.getAttribute('aria-orientation'), 'horizontal');
  button.dispatchEvent(fakeEvent('click'));
  assert.equal(focused(), 'Like');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'ArrowRight' }));
  assert.equal(focused(), 'Love');
  menu.element.dispatchEvent(fakeEvent('keydown', { key: 'ArrowLeft' }));
  assert.equal(focused(), 'Like');
});

test('an item that says checked is a checkbox item', () => {
  const { button, menu } = makeMenu([
    { glyph: '👍', label: 'Like', checked: true, onPick: () => {} },
    { glyph: '❤️', label: 'Love', checked: false, onPick: () => {} },
    { icon: 'fa-file', label: 'Plain', onPick: () => {} },
  ]);
  button.dispatchEvent(fakeEvent('click'));
  const [likeItem, loveItem, plainItem] = menu.element.querySelectorAll('.ocs__menu-item');
  assert.equal(likeItem.getAttribute('role'), 'menuitemcheckbox');
  assert.equal(likeItem.getAttribute('aria-checked'), 'true');
  assert.equal(loveItem.getAttribute('aria-checked'), 'false');
  assert.equal(plainItem.getAttribute('role'), 'menuitem');
  assert.equal(plainItem.getAttribute('aria-checked'), null);
});
