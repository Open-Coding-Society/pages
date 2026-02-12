import Enemy from '.Enemy.js';
import Projectile from '../GameEnginev1/Projectile.js';
import Player from './Player.js';

class Boss extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);

        this.fullHealth = data?.initialHealth || 1500;
        this.healthPoints = this.fullHealth;

        this.fireballs = [];
        this.lastAttackTime = Date.now();
        this.attackInterval = data?.attackInterval || 2000;

        this.stage = 1;
        this.damageModifier = 1;

        this._bossHealthFill = null;
    }

    update() {
        this.updateHealthBar();

        if (this.healthPoints <= 0) {
            this.handleDeath();
            return;
        }

        if (this.spriteData?.update) {
            this.spriteData.update.call(this);
        }
        this.draw();

        this.updateStage();
        this.updateProjectiles();
        this.handleAttacks();
    }

    updateHealthBar() {
        if (!this._bossHealthFill && typeof document !== 'undefined') {
            this._bossHealthFill = document.getElementById('boss-health-fill');
        }

        if (this._bossHealthFill) {
            const healthPercent = Math.max(0, Math.min(100, (this.healthPoints / this.fullHealth) * 100));
            this._bossHealthFill.style.width = `${healthPercent}%`;
            
            if (healthPercent < 33) {
                this._bossHealthFill.style.backgroundColor = '#A020F0';
            } else if (healthPercent < 66) {
                this._bossHealthFill.style.backgroundColor = '#800000';
            } else {
                this._bossHealthFill.style.backgroundColor = '#FF0000';
            }
        }
    }

    updateStage() {
        const healthRatio = this.healthPoints / this.fullHealth;
        
        if (healthRatio < 0.33) {
            this.stage = 3;
            this.attackInterval = 1000;
        } else if (healthRatio < 0.66) {
            this.stage = 2;
            this.attackInterval = 1500;
        } else {
            this.stage = 1;
            this.attackInterval = 2000;
        }

        this.damageModifier = healthRatio <= 0.5 ? 2 : 1;
    }

    updateProjectiles() {
        this.fireballs.forEach(fireball => {
            if (fireball.revComplete) {
                fireball.destroy();
            } else {
                fireball.update();
            }
        });
        
        this.fireballs = this.fireballs.filter(fireball => !fireball.revComplete);
    }

    handleAttacks() {
        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackInterval) {
            const target = this.findNearestPlayer();
            if (target) {
                this.fireballAttack(target);
            }
            this.lastAttackTime = now;
        }
    }

    findNearestPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj => obj instanceof Player);
        if (players.length === 0) return null;

        let nearest = players[0];
        let minDistance = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = player;
            }
        }

        return nearest;
    }

    fireballAttack(target) {
        const fireball = new Projectile(
            this.gameEnv,
            target.position.x,
            target.position.y,
            this.position.x,
            this.position.y,
            "FIREBALL"
        );
        this.fireballs.push(fireball);
    }

    handleDeath() {
        if (this._bossHealthFill) {
            try {
                const healthBar = document.getElementById('boss-health-bar');
                if (healthBar?.parentNode) {
                    healthBar.parentNode.removeChild(healthBar);
                }
            } catch (e) {
                console.warn('Failed to remove boss health bar:', e);
            }
            this._bossHealthFill = null;
        }

        console.log("Boss defeated!");
    }

    moveToward(target, speed) {
        const dx = target.position.x - this.position.x;
        const dy = target.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * speed;
        this.position.y += Math.sin(angle) * speed;
    }

    explode(x, y) {
        console.log("Boss doesn't explode - use death animation instead");
    }
}

export default Boss;