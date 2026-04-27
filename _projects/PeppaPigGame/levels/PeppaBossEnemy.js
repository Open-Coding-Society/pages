import Enemy from '/Team-Pranigas/assets/js/GameEnginev1.1/essentials/Enemy.js';

class PeppaBossEnemy extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.health = data?.health ?? 3;
        this.maxHealth = this.health;
        this.moveSpeed = data?.moveSpeed ?? 0.8;
        this.isDefeated = false;
    }

    update() {
        this.draw();

        if (this.isDefeated) {
            return;
        }

        const player = this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'Player');
        if (!player) {
            return;
        }

        const myCenterX = this.position.x + this.width / 2;
        const myCenterY = this.position.y + this.height / 2;
        const playerCenterX = player.position.x + player.width / 2;
        const playerCenterY = player.position.y + player.height / 2;

        const dx = playerCenterX - myCenterX;
        const dy = playerCenterY - myCenterY;
        const distance = Math.hypot(dx, dy);

        if (distance > 1) {
            this.position.x += (dx / distance) * this.moveSpeed;
            this.position.y += (dy / distance) * this.moveSpeed;
        }

        this.stayWithinCanvas();
    }

    handleCollisionEvent() {
        // Collision handling is managed by the level logic.
    }

    takeDamage(amount = 1) {
        if (this.isDefeated) {
            return true;
        }

        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) {
            this.isDefeated = true;
            this.canvas.style.filter = 'grayscale(1) brightness(0.8)';
            this.canvas.style.opacity = '0.6';
        }

        return this.isDefeated;
    }
}

export default PeppaBossEnemy;