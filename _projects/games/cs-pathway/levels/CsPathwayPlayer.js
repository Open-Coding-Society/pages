import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';

/**
 * CsPathwayPlayer tightens the movement + physics "feel" for the CS Pathway
 * levels without changing the shared GameEnginev1.1 Player (used by ~15 other
 * games). It follows the same subclass pattern as PlatformerPlayer /
 * EmpathyEpicPlayer.
 *
 * Fixes (CAT-3: Movement & Physics):
 *  1. Input is re-evaluated every frame, not only on key events, so a keypress
 *     moves the character on the very next frame and velocity never gets stuck
 *     when `pressedKeys` is mutated outside a key event (collision handling,
 *     window blur).
 *  2. Held keys survive contact with NPCs / barriers, so walking past an object
 *     no longer wipes input and stalls the player.
 *  3. Releasing a key decays that axis to rest in ~3 frames instead of an
 *     instant hard stop.
 *  4. Collision movement restrictions are released once the player is clear of
 *     the obstacle, so a wall contact doesn't permanently block a direction and
 *     the player doesn't oscillate against the wall.
 *  5. GRAVITY levels use a constant downward acceleration with a terminal
 *     velocity cap, so every fall follows the same arc (the base engine's
 *     `0.5 + acceleration * time` term grows without bound the longer you fall).
 */

// Per-frame multiplier applied to an axis with no active input.
// 0.4 brings a full-speed axis to rest in ~3 frames without an abrupt halt.
const DECELERATION = 0.4;
// Speeds (px/frame) below this snap to zero — removes sub-pixel drift/slide.
const MIN_VELOCITY = 0.25;
// Constant downward acceleration (px/frame^2) for GRAVITY-enabled levels.
const GRAVITY_ACCELERATION = 0.6;
// Maximum downward speed (px/frame); caps long drops so the arc stays predictable.
const TERMINAL_VELOCITY = 12;

class CsPathwayPlayer extends Player {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);

        // This class owns vertical physics; bypass the base-class gravity block
        // (which reads `this.gravity`) so gravity is never applied twice.
        this.gravityEnabled = Boolean(data && data.GRAVITY);
        this.gravity = false;

        // Keep held inputs through collisions — losing them mid-walk is the main
        // source of the "delayed input" complaint near NPCs.
        this.clearPressedKeysOnCollision = false;
    }

    /**
     * Decay one velocity axis toward rest, snapping to zero once it is slow
     * enough that further sliding would not be visible.
     */
    decayAxis(value) {
        const decayed = value * DECELERATION;
        return Math.abs(decayed) < MIN_VELOCITY ? 0 : decayed;
    }

    /**
     * Rebuild velocity from the current key state. Called every frame (see
     * update()) as well as on key events, so movement is always frame-accurate.
     */
    updateVelocity() {
        // Once clear of any collision, restore full freedom of movement so a
        // restriction set during a previous frame's wall contact doesn't stick.
        if (!this.state.collisionEvents || this.state.collisionEvents.length === 0) {
            this.state.movement = { up: true, down: true, left: true, right: true };
        }
        const allow = this.state.movement;

        const right = !!this.pressedKeys[this.keypress.right] && allow.right !== false;
        const left = !!this.pressedKeys[this.keypress.left] && allow.left !== false;
        const up = !!this.pressedKeys[this.keypress.up] && allow.up !== false;
        const down = !!this.pressedKeys[this.keypress.down] && allow.down !== false;

        // Horizontal: full speed immediately on press, quick decay on release.
        if (right && !left) {
            this.velocity.x = this.xVelocity;
        } else if (left && !right) {
            this.velocity.x = -this.xVelocity;
        } else {
            this.velocity.x = this.decayAxis(this.velocity.x);
        }

        // Vertical: on GRAVITY levels the gravity integrator owns downward motion,
        // so only an explicit "up" press overrides it here.
        if (up && !down) {
            this.velocity.y = -this.yVelocity;
        } else if (down && !up && !this.gravityEnabled) {
            this.velocity.y = this.yVelocity;
        } else if (!this.gravityEnabled) {
            this.velocity.y = this.decayAxis(this.velocity.y);
        }

        this.moved = right || left || up || down;
    }

    update() {
        // While paused, defer entirely to the base draw-only path.
        if (this.gameEnv && this.gameEnv.gameControl && this.gameEnv.gameControl.isPaused) {
            super.update();
            return;
        }

        // Re-evaluate input first so this frame's movement reflects the latest
        // key state rather than whatever velocity was left over.
        this.updateVelocity();
        this.updateDirection();

        // draw -> collisionChecks -> move (Character.update, via Player.update
        // whose gravity block is inert because this.gravity is false).
        super.update();

        // Frame-consistent gravity for GRAVITY levels: constant acceleration plus
        // a terminal-velocity clamp keeps every fall arc identical.
        if (this.gravityEnabled && !this.moved) {
            this.velocity.y += GRAVITY_ACCELERATION;
            if (this.velocity.y > TERMINAL_VELOCITY) {
                this.velocity.y = TERMINAL_VELOCITY;
            }
        }
    }
}

// Shared engine code (FriendlyNpc, Coin, Enemy, fish, …) locates the player with
// `obj.constructor.name === "Player"`. Present this subclass under that name so it
// stays a transparent drop-in without editing the shared GameEnginev1.1 files.
// `instanceof Player` checks continue to work regardless.
Object.defineProperty(CsPathwayPlayer, 'name', { value: 'Player' });

export default CsPathwayPlayer;
