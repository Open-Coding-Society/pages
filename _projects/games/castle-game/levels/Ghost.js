import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import showDeathScreen from './DeathScreen.js';

class Ghost extends Enemy {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.followSpeedFactor = data?.followSpeedFactor ?? 0.4;
        this.followStopDistance = data?.followStopDistance ?? 8;
        this._hasTriggeredDeath = false;
    }

    getPlayer() {
        return this.gameEnv?.gameObjects?.find(obj => obj instanceof Player) || null;
    }

    followPlayer(player) {
        if (!player) return;

        const ghostCenter = this.getCenter();
        const playerCenter = typeof player.getCenter === 'function'
            ? player.getCenter()
            : { x: player.x || 0, y: player.y || 0 };

        const dx = playerCenter.x - ghostCenter.x;
        const dy = playerCenter.y - ghostCenter.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= this.followStopDistance) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }

        const baseSpeed = player?.xVelocity || (this.gameEnv?.innerWidth || 800) / 2000;
        const speed = Math.max(0.3, baseSpeed * this.followSpeedFactor);
        const nx = dx / distance;
        const ny = dy / distance;

        this.position.x += nx * speed;
        this.position.y += ny * speed;

        if (Math.abs(dx) >= Math.abs(dy)) {
            this.direction = dx >= 0 ? 'right' : 'left';
        } else {
            this.direction = dy >= 0 ? 'down' : 'up';
        }
    }

    update() {
        const player = this.getPlayer();
        if (player && !player.isDead) {
            this.followPlayer(player);
        }
        super.update();
    }

    handleCollisionEvent() {
        if (this._hasTriggeredDeath || this.playerDestroyed) return;

        const player = this.getPlayer();
        if (!player || player.isDead) return;

        this._hasTriggeredDeath = true;
        this.playerDestroyed = true;
        player.isDead = true;

        showDeathScreen(player, 'The ghost caught you.');
    }
}

export default Ghost;
