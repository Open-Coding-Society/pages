import Character from "./essentials/Character.js";;
import ProjectileExplosion from './ProjectileExplosion.js';

function newProjectileExplosion(data, gameEnv) {
    return new ProjectileExplosion(data, gameEnv);
}

class Projectile extends Character {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.startTime = Date.now();
        this.duration = data.TRANSLATE_SIMULATION.miliseconds;
        this.calculateTranslatePositions();
        this.startScaleFactor = data.SCALE_FACTOR;
        this.endScaleFactor = data.TRANSLATE_SCALE_FACTOR;
        this.randomDelay = 0;
        this.delayStartTime = null;
        this._pausedAt = null;
        this._pausedAccum = 0;
    }

    /**
     * Calculate the start and end positions for the projectile's translation
     * 1. The start position is the initial position of the projectile
     * 2. The end position is the position the projectile will translate towards
     * By placing this into a method, restart and resize will reset or update the positions for the projectile
     */
    calculateTranslatePositions() {
        this.startPosition = {
            x: this.gameEnv.innerWidth * this.data.INIT_POSITION_RATIO.x,
            y: this.gameEnv.innerHeight * this.data.INIT_POSITION_RATIO.y
        };
        this.endPosition = {
            x: this.gameEnv.innerWidth * this.data.TRANSLATE_POSITION_RATIO.x,
            y: this.gameEnv.innerHeight * this.data.TRANSLATE_POSITION_RATIO.y
        };
    }

    /**
     * Update the projectile's position, size, and scale factor based on the translation animation
     * 1. Calculate the progress of the animation
     * 2. Calculate the intermediate position of the projectile
     * 3. Calculate the new scale factor as the projectile gets larger as it travels
     * Restart the projectile if the animation reaches the end
     */
    update() {
        // If the game is paused, track pause time and skip updating
        if (this.gameEnv && this.gameEnv.gameControl && this.gameEnv.gameControl.isPaused) {
            if (this._pausedAt === null) this._pausedAt = Date.now();
            return;
        }

        // If we were paused, accumulate the paused duration so animation doesn't jump
        if (this._pausedAt !== null) {
            this._pausedAccum += Date.now() - this._pausedAt;
            this._pausedAt = null;
        }

        // Calculate the progress of the animation
        const elapsedTime = Date.now() - this.startTime - this._pausedAccum;
        const progress = Math.min(elapsedTime / this.duration, 1);

        // If the animation reaches the end, trigger explosion and set delay
        if (progress >= 1) {
            if (this.delayStartTime === null) {
                this.triggerExplosion();
                this.randomDelay = Math.random() * this.data.TRANSLATE_SIMULATION.miliseconds * 5;
                this.delayStartTime = Date.now();
            } else {
                // If paused, don't advance the delay timer
                const now = Date.now();
                const effectiveDelayStart = this.delayStartTime + (this._pausedAccum || 0);
                if (now - effectiveDelayStart >= this.randomDelay) {
                    this.restart();
                }
            }
            return; // Exit the update method to prevent further updates until restart
        }

        // Calculate the intermediate position of the projectile
        this.position.x = this.startPosition.x + (this.endPosition.x - this.startPosition.x) * progress;
        this.position.y = this.startPosition.y + (this.endPosition.y - this.startPosition.y) * progress;

        // Calculate the new scale factor as the projectile gets larger as it travels
        this.scaleFactor = this.startScaleFactor + (this.endScaleFactor - this.startScaleFactor) * progress;

        // Update the size of the projectile based on the scale factor 
        this.size = this.gameEnv.innerHeight / this.scaleFactor;
        this.width = this.size;
        this.height = this.size;

        // Call the parent update method to handle other updates
        super.update();
    }

    /**
     * Trigger an explosion simulation when the projectile reaches the end
     */
    triggerExplosion() {
        const explosionData = {
            ...this.data,
            ie: "Explosion-" + this.data.id,
            down: {row: 0, start: 0, columns: 1, explode: true},
            SCALE_FACTOR: this.endScaleFactor,
            EXPLOSION_SCALE_FACTOR: this.endScaleFactor * 5, // Adjust as needed
            EXPLOSION_SIMULATION: { miliseconds: 1000 } // Adjust as needed
        };
        const explosion = newProjectileExplosion(explosionData, this.gameEnv);
        this.canvas.style.display = "none";
        this.gameEnv.gameObjects.push(explosion); 
    }

    /**
     * Restart simulates a new projectile being projected
     */
    restart() {
        this.startTime = Date.now();
        this.delayStartTime = null;
        this.calculateTranslatePositions();
        this.position = { ...this.startPosition };
        this.scaleFactor = this.startScaleFactor;
        this.canvas.style.display = "block";
        // reset pause tracking when restarting
        this._pausedAt = null;
        this._pausedAccum = 0;
    }

    /**
     * Resize updates the positions based on the new dimensions
     */
    resize() {
        this.calculateTranslatePositions();
        this.size = this.gameEnv.innerHeight / this.scaleFactor;
        this.width = this.size;
        this.height = this.size;
        super.resize();
    }
}

export default Projectile;