import Player from '../essentials/Player.js';
import Transform from '../essentials/Transform.js';

/**
 * Create keyboard-only state on the real Player (or subclass) prototype.
 * Skipping constructors avoids canvas/touch setup, not the movement methods.
 * Subclasses needing additional state must supply it in their own tests.
 */
export function createKeyboardPlayer(PlayerType = Player, {
    keypress = { up: 87, left: 65, down: 83, right: 68 },
    gameEnv = { gameControl: { isPaused: false }, container: { isConnected: true } },
    xVelocity = 5,
    yVelocity = 5,
} = {}) {
    const player = Object.create(PlayerType.prototype);
    player.transform = new Transform(0, 0);
    player.keypress = { ...keypress };
    player.gameEnv = gameEnv;
    player.pressedKeys = {};
    player.xVelocity = xVelocity;
    player.yVelocity = yVelocity;
    player.moved = false;
    return player;
}

function keyboardEvent(keyCode, options) {
    return {
        ...options,
        keyCode,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
    };
}

// Call the real handlers with synthetic events; no physical key press is needed.
export function pressKey(player, keyCode, options = {}) {
    const event = keyboardEvent(keyCode, options);
    player.handleKeyDown(event);
    return event;
}

export function releaseKey(player, keyCode, options = {}) {
    const event = keyboardEvent(keyCode, options);
    player.handleKeyUp(event);
    return event;
}
