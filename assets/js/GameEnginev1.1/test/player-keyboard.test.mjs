import test from 'node:test';
import assert from 'node:assert/strict';
import { createKeyboardPlayer, pressKey, releaseKey } from './keyboard-test-helper.mjs';

const arrows = { up: 38, left: 37, down: 40, right: 39 };

test('all assigned arrows prevent scrolling and set movement and direction', () => {
    for (const [keyCode, x, y, direction] of [
        [37, -5, 0, 'left'],
        [38, 0, -5, 'up'],
        [39, 5, 0, 'right'],
        [40, 0, 5, 'down'],
    ]) {
        const player = createKeyboardPlayer(undefined, { keypress: arrows });
        assert.equal(pressKey(player, keyCode).defaultPrevented, true);
        assert.deepEqual(player.velocity, { x, y });
        assert.equal(player.direction, direction);
        releaseKey(player, keyCode);
        assert.deepEqual(player.velocity, { x: 0, y: 0 });
        assert.equal(player.moved, false);
    }
});

test('default WASD mapping moves without canceling browser defaults', () => {
    const player = createKeyboardPlayer();
    assert.equal(pressKey(player, 38).defaultPrevented, false);
    assert.deepEqual(player.velocity, { x: 0, y: 0 });
    assert.equal(pressKey(player, 87).defaultPrevented, false);
    assert.deepEqual(player.velocity, { x: 0, y: -5 });
    releaseKey(player, 87);
    assert.deepEqual(player.velocity, { x: 0, y: 0 });
});

test('partial arrow mappings cancel only the assigned arrows', () => {
    const player = createKeyboardPlayer(undefined, { keypress: { up: 38 } });
    assert.equal(pressKey(player, 40).defaultPrevented, false);
    assert.equal(pressKey(player, 38).defaultPrevented, true);
});

test('diagonal movement continues along the remaining key after release', () => {
    const player = createKeyboardPlayer(undefined, { keypress: arrows });
    pressKey(player, 38);
    pressKey(player, 39);
    assert.deepEqual(player.velocity, { x: 5, y: -5 });
    assert.equal(player.direction, 'upRight');
    releaseKey(player, 38);
    assert.deepEqual(player.velocity, { x: 5, y: 0 });
    assert.equal(player.direction, 'right');
    releaseKey(player, 39);
    assert.deepEqual(player.pressedKeys, {});
});

test('two players have independent mappings and pressed keys', () => {
    const first = createKeyboardPlayer();
    const second = createKeyboardPlayer(undefined, { keypress: arrows });
    for (const player of [first, second]) pressKey(player, 38);
    assert.deepEqual(first.velocity, { x: 0, y: 0 });
    assert.deepEqual(second.velocity, { x: 0, y: -5 });
    releaseKey(second, 38);
    assert.equal(first.pressedKeys[38], true);
    assert.deepEqual(second.pressedKeys, {});
});

test('editing and browser shortcuts retain their browser defaults', () => {
    for (const options of [
        ...['INPUT', 'TEXTAREA', 'SELECT'].map(tagName => ({ target: { tagName } })),
        { target: { isContentEditable: true } },
        { altKey: true }, { ctrlKey: true }, { metaKey: true },
    ]) {
        const player = createKeyboardPlayer(undefined, { keypress: arrows });
        assert.equal(pressKey(player, 38, options).defaultPrevented, false);
        // Engine movement behavior is unchanged; games may add input guards.
        assert.equal(player.velocity.y, -5);
    }
});

test('paused or detached games do not cancel browser defaults', () => {
    for (const gameEnv of [
        { gameControl: { isPaused: true }, container: { isConnected: true } },
        { gameControl: { isPaused: false }, container: { isConnected: false } },
    ]) {
        const player = createKeyboardPlayer(undefined, { keypress: arrows, gameEnv });
        assert.equal(pressKey(player, 40).defaultPrevented, false);
    }
});
