import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import { updatePlayerHealthBar } from './HealthBars.js';
import showDeathScreen from './DeathScreen.js';
import { spawnPlayerDamageEffect } from './DamageEffects.js';

class Zombie extends Character {
    constructor(data = null, gameEnv = null) {
        const path = gameEnv?.path || '';
        const spriteData = {
            id: data?.id || 'Zombie',
            src: data?.src || (path + '/images/projects/mansionGame/zombieNpc.png'),
            SCALE_FACTOR: data?.SCALE_FACTOR || 4,
            ANIMATION_RATE: data?.ANIMATION_RATE || 30,
            INIT_POSITION: data?.INIT_POSITION || { x: 0, y: 0 },
            pixels: data?.pixels || { width: 3600, height: 1200 },
            orientation: data?.orientation || { rows: 1, columns: 3 },
            down: data?.down || { row: 0, start: 0, columns: 3 },
            hitbox: data?.hitbox || { widthPercentage: 0.4, heightPercentage: 0.2 }
        };

        super(spriteData, gameEnv);

        this.healthPoints = data?.healthPoints || 1;
        this.damage = data?.damage || 6;
        this.speed = data?.speed || 0.45;
        this.hitCooldownMs = data?.hitCooldownMs || 800;
        this._lastHitTime = 0;
        this._tick = 0;
    }

    update() {
        if (typeof window !== 'undefined' && window.__battleRoomFadeComplete === false) {
            this.draw();
            return;
        }
        this._tick = (this._tick + 1) % 3;

        if (this._tick !== 1) {
            this.draw();
        }
        if (this._tick === 0) {
            this.moveTowardPlayer();
            this.tryDamagePlayer();
            this.stayWithinCanvas();
        }
    }

    moveTowardPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return;

        let nearest = players[0];
        let minDist = Infinity;
        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
    }

    tryDamagePlayer() {
        const now = Date.now();
        if (now - this._lastHitTime < this.hitCooldownMs) return;

        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return;

        let nearest = players[0];
        let minDist = Infinity;
        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        const HIT_DISTANCE = 45;
        if (minDist <= HIT_DISTANCE * HIT_DISTANCE) {
            this._lastHitTime = now;
            if (!nearest.data) nearest.data = { health: 100, maxHealth: 100 };
            nearest.data.health -= this.damage;
            spawnPlayerDamageEffect(this.gameEnv, nearest);
            if (nearest.data.health <= 0) {
                showDeathScreen(nearest);
            }

            try {
                const maxHealth = nearest.data.maxHealth || 100;
                const pct = Math.max(0, Math.min(100, (nearest.data.health / maxHealth) * 100));
                updatePlayerHealthBar(pct);
            } catch (e) {
                console.warn('Failed to update player health bar:', e);
            }
        }
    }

    stayWithinCanvas() {
        if (this.position.y + this.height > this.gameEnv.innerHeight) {
            this.position.y = this.gameEnv.innerHeight - this.height;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.x + this.width > this.gameEnv.innerWidth) {
            this.position.x = this.gameEnv.innerWidth - this.width;
        }
        if (this.position.x < 0) {
            this.position.x = 0;
        }
    }

    takeDamage(amount) {
        this.healthPoints -= amount;
        if (this.healthPoints <= 0) {
            this.destroy();
        }
    }
}

export default Zombie;
