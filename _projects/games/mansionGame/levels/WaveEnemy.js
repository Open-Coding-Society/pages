import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

class WaveEnemy extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.healthPoints = data?.healthPoints || 1;
        this.speed = data?.speed || 2;
        this.maxHealth = data?.healthPoints || 1;
        this._isDestroyed = false;
        this._facingRight = true;
    }

    update(player = null) {
        if (this._isDestroyed) return;

        if (player) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.position.x += (dx / distance) * this.speed;
                this.position.y += (dy / distance) * this.speed;

                // Flip animation row based on horizontal movement direction
                if (dx > 0 && !this._facingRight) {
                    this._facingRight = true;
                    if (this.spriteData?.right) this.currentAnimation = this.spriteData.right;
                } else if (dx < 0 && this._facingRight) {
                    this._facingRight = false;
                    if (this.spriteData?.left) this.currentAnimation = this.spriteData.left;
                }
            }
        }

        this.draw();
    }

    takeDamage(amount) {
        this.healthPoints -= amount;
        if (this.healthPoints <= 0 && !this._isDestroyed) {
            this.destroy();
        }
    }

    destroy() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        // Critical: Character.destroy() removes the canvas element from the DOM
        super.destroy();

        if (this.gameEnv && this.gameEnv.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index > -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }

    isDestroyed() {
        return this._isDestroyed;
    }
}

export default WaveEnemy;
