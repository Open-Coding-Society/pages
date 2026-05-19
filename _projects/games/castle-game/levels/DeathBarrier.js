import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import showDeathScreen from './DeathScreen.js';

class DeathBarrier extends Barrier {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this._hasTriggeredDeath = false;
        // Store the level start time - all barriers share this for grace period
        if (!DeathBarrier.levelStartTime) {
            DeathBarrier.levelStartTime = new Date();
        }
    }

    update() { // Checks for collisions, if triggered then uses the belo code
        super.update();

        if (this._hasTriggeredDeath) return; // if the death is already triggered no need to trigger it again

        const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
        if (!player || !player.canvas || !this.canvas) return;

        this.isCollision(player);

        if (this.collisionData?.hit) {
            // Check grace period from level start time
            const timeSinceLevelStart = new Date() - DeathBarrier.levelStartTime;
            if (timeSinceLevelStart < 500) {
                console.log('[MazeDebug] Grace period active:', timeSinceLevelStart, 'ms');
                return; // we added a grace period because there was an error where the barrier would kill the player before they could even play
            }

            this._hasTriggeredDeath = true;
            player.isDead = true;

            console.log('[MazeDebug] DeathBarrier hit player:', this.canvas?.id || this.id || 'unknown');
            console.log('[MazeDebug] Player Position:', player.x, player.y);

            try {
                showDeathScreen(player, 'You got lost in the maze.');
            } catch (error) {
                console.error('DeathBarrier failed to show death screen:', error);
                this._hasTriggeredDeath = false;
                player.isDead = false;
            }
        }
    }

    // Reset level start time when level restarts
    static resetLevelStartTime() {
        DeathBarrier.levelStartTime = new Date();
    }
}

export default DeathBarrier;
