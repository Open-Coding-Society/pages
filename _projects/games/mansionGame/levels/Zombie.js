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
            SCALE_FACTOR: data?.SCALE_FACTOR || 5,
            ANIMATION_RATE: data?.ANIMATION_RATE || 30,
            INIT_POSITION: data?.INIT_POSITION || { x: 0, y: 0 },
            pixels: data?.pixels || { width: 3600, height: 1200 },
            orientation: data?.orientation || { rows: 1, columns: 3 },
            down: data?.down || { row: 0, start: 0, columns: 3 },
            hitbox: data?.hitbox || { widthPercentage: 0.35, heightPercentage: 0.5 }
        };

        super(spriteData, gameEnv);

        this.healthPoints = data?.healthPoints || 1;
        this.damage = data?.damage || 6;
        this.speed = data?.speed || 0.45;
        this.hitCooldownMs = data?.hitCooldownMs || 800;
        this._lastHitTime = 0;
        this._tick = 0;
        this._recoilUntil = 0;
    }

    update() {
        if (typeof window !== 'undefined' && window.__battleRoomFadeComplete === false) {
            this.draw();
            return;
        }

        if (Date.now() < this._recoilUntil) {
            this.draw();
            this.stayWithinCanvas();
            return;
        }
        this._tick = (this._tick + 1) % 3;

        if (this._tick !== 1) {
            this.draw();
        }
        if (this._tick === 0) {
            const target = this.getNearestPlayer();
            if (!target) return;

            this.moveTowardPlayer(target.player);
            this.tryDamagePlayer(target.player, target.distanceSquared);
            this.stayWithinCanvas();
        }
    }

    getNearestPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return null;

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

        return { player: nearest, distanceSquared: minDist };
    }

    moveTowardPlayer(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
    }

    tryDamagePlayer(player, distanceSquared) {
        const now = Date.now();
        if (now - this._lastHitTime < this.hitCooldownMs) return;

        const HIT_DISTANCE = 45;
        if (distanceSquared <= HIT_DISTANCE * HIT_DISTANCE) {
            this._lastHitTime = now;
            if (player && typeof player.isShieldActive === 'function' && player.isShieldActive()) {
                this.applyRecoil(player);
                return;
            }
            if (!player.data) player.data = { health: 100, maxHealth: 100 };
            player.data.health -= this.damage;
            spawnPlayerDamageEffect(this.gameEnv, player);
            if (player.data.health <= 0) {
                showDeathScreen(player);
            }

            this.applyRecoil(player);

            try {
                const maxHealth = player.data.maxHealth || 100;
                const pct = Math.max(0, Math.min(100, (player.data.health / maxHealth) * 100));
                updatePlayerHealthBar(pct);
            } catch (e) {
                console.warn('Failed to update player health bar:', e);
            }
        }
    }

    applyRecoil(player) {
        const dx = this.position.x - player.position.x;
        const dy = this.position.y - player.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const recoilDistance = 18;

        this.position.x += (dx / dist) * recoilDistance;
        this.position.y += (dy / dist) * recoilDistance;
        this._recoilUntil = Date.now() + 200;
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
