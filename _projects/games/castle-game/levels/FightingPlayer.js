import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Projectile from './Projectile.js';

/**
 * A version of the Player class with added functionality for shooting projectiles (arrows).
 * @param data - Initial data for the player character.
 * @param gameEnv - The game environment object, providing access to game state and resources.
 * 
 * This class extends the basic Player class to allow for SPACE to create arrows
 */
class FightingPlayer extends Player {
    // Construct the class, with a list of stored projectiles
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 500; // 500ms between shots
        this.currentDirection = 'right'; // track facing direction
        this.requireRunnerFocus = false;
        this.isRunnerFocused = true;
        this.focusContainer = null;

        // Bind attack to spacebar
        if (typeof window !== 'undefined') {
            this.setupRunnerFocusMode();

            this._attackHandler = (event) => {
                if (event.code === 'Space' || event.key === ' ') {
                    // In GameRunner/embed contexts, only accept space when game area is focused.
                    if (this.requireRunnerFocus && !this.isRunnerFocused) {
                        return;
                    }

                    // Prevent the browser from scrolling while playing in GameRunner.
                    if (this.requireRunnerFocus) {
                        event.preventDefault();
                    }

                    this.attack();
                }
            };
            window.addEventListener('keydown', this._attackHandler);
        }
    }

    // Update spook and the projectiles
    update(...args) {
        super.update(...args);  // Do normal player updating
        
        // Track facing direction based on movement
        if (this.velocity.x > 0) this.currentDirection = 'right';
        else if (this.velocity.x < 0) this.currentDirection = 'left';
        
        // Update and clean up projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());
    }

    // Execute an attack
    attack() {
        // Don't allow shooting until the game has started
        if (typeof window !== 'undefined' && !window.archeryGameStarted) {
            return;
        }
        
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;
        
        // Calculate target point in direction player is facing
        const facingRight = this.currentDirection === 'right';
        // Shoot arrow 500 pixels in facing direction
        const targetX = this.position.x + (facingRight ? 500 : -500);
        const targetY = this.position.y;
        
        // Create arrow projectile
        this.projectiles.push(
            new Projectile(
                this.gameEnv,
                targetX, 
                targetY,
                // Offset source position to start at player center
                this.position.x + this.width/2,
                this.position.y + this.height/2,
                "PLAYER"  // Special type for player projectiles
            )
        );
        
        this.lastAttackTime = now;
    }

    resolveInteractionContainer() {
        return this.gameEnv?.container || this.gameEnv?.gameContainer || this.canvas?.parentElement || null;
    }

    isInRunnerContext(container) {
        if (!container || typeof container.closest !== 'function') {
            return false;
        }

        return Boolean(
            container.closest('[data-code-runner], .code-runner, .code-editor, .CodeMirror-container')
        );
    }

    setupRunnerFocusMode() {
        this.focusContainer = this.resolveInteractionContainer();
        this.requireRunnerFocus = this.isInRunnerContext(this.focusContainer);

        if (!this.requireRunnerFocus) {
            this.isRunnerFocused = true;
            return;
        }

        this.isRunnerFocused = false;

        this._focusPointerHandler = (event) => {
            if (!this.focusContainer) {
                return;
            }
            this.isRunnerFocused = this.focusContainer.contains(event.target);
        };

        this._windowBlurHandler = () => {
            this.isRunnerFocused = false;
        };

        // Capture phase ensures focus state updates before keydown handling.
        document.addEventListener('pointerdown', this._focusPointerHandler, true);
        window.addEventListener('blur', this._windowBlurHandler);
    }

    // Clean up event listeners when destroyed
    destroy() {
        if (typeof window !== 'undefined' && this._attackHandler) {
            window.removeEventListener('keydown', this._attackHandler);
        }
        if (typeof document !== 'undefined' && this._focusPointerHandler) {
            document.removeEventListener('pointerdown', this._focusPointerHandler, true);
        }
        if (typeof window !== 'undefined' && this._windowBlurHandler) {
            window.removeEventListener('blur', this._windowBlurHandler);
        }
        super.destroy();
    }
}

export default FightingPlayer;