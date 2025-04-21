import Character from "./GameEngine/Character.js";

class ProjectileExplosion extends Character {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.startTime = Date.now();
        this.duration = data.EXPLOSION_SIMULATION.miliseconds;
        this.position = {
            x: this.gameEnv.innerWidth * data.TRANSLATE_POSITION_RATIO.x,
            y: this.gameEnv.innerHeight * data.TRANSLATE_POSITION_RATIO.y
        };
        this.drop = this.position.y;
        this.startScaleFactor = data.SCALE_FACTOR;
        this.endScaleFactor = data.EXPLOSION_SCALE_FACTOR;
    }

    /**
     * Update the explosion's position and size based on the animation progress
     */
    update() {
        // Calculate the progress of the animation
        const elapsedTime = Date.now() - this.startTime;
        const progress = Math.min(elapsedTime / this.duration, 1);

        // Apply a non-linear drop speed (ease-in effect)
        const easedProgress = Math.pow(progress, 2);

        // Drop the projectile to the ground
        this.position.y = this.drop + easedProgress * (this.gameEnv.innerHeight - this.drop);

        // Ensure the projectile does not go beyond the bottom boundary
        if (this.position.y > this.gameEnv.innerHeight) {
            this.position.y = this.gameEnv.innerHeight;
        }

        // Shrink the projectile as it drops
        this.scaleFactor = this.startScaleFactor - (this.startScaleFactor - this.endScaleFactor) * progress;
        this.size = this.gameEnv.innerHeight / this.scaleFactor;
        this.width = this.size;
        this.height = this.size;

        // Call the parent update method to handle other updates
        super.update();

        // If the animation reaches the end, stop the explosion
        if (progress >= 1) {
            this.destroy();
        }
    }
}

export default ProjectileExplosion;