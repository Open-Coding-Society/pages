import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Projectile from './Projectile.js';
import PlayerScythe from './PlayerScythe.js';
import { updatePlayerHealthBar } from './HealthBars.js';

const POWER_UP_DURATION_MS = {
    shield: 8000,
    damageBoost: 10000,
    scythes: 12000
};

const POWER_UP_LABELS = {
    shield: 'Shield',
    charge: 'Shockwave charged',
    damageBoost: 'Damage boost',
    scythes: 'Scythes',
    heal: 'Healed +10%'
};

class FightingPlayer extends Player {
    // Construct the class, with a list of stored projectiles
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 500; // 500ms between shots
        this.lastPumpkinTime = Date.now();
        this.pumpkinCooldown = 900; // 900ms between pumpkin throws
        this.shockwaveCooldown = 30000; // 30 seconds
        this.lastShockwaveTime = Date.now();
        this.shockwaveBossDamage = 20;
        this.currentDirection = 'right'; // track facing direction
        this.shieldUntil = 0;
        this.damageBoostUntil = 0;
        this.orbitingScythes = [];
        this.baseDamageMultiplier = 1;

        // Bind attacks to keyboard controls
        if (typeof window !== 'undefined') {
            this._attackHandler = (event) => {
                if (this.isArrowKey(event)) {
                    event.preventDefault();
                    this.attackArrow();
                } else if (this.isPumpkinKey(event)) {
                    event.preventDefault();
                    this.attackPumpkin();
                } else if (this.isShockwaveKey(event)) {
                    event.preventDefault();
                    this.triggerShockwave();
                }
            };
            window.addEventListener('keydown', this._attackHandler);
        }

        this.ensureShockwaveUI();
    }

    // Update spook and the projectiles
    update(...args) {
        super.update(...args);  // Do normal player updating
        
        this.updateCurrentDirection();
        this.updateShockwaveUI();
        this.updatePowerUpEffects();
        
        // Update and clean up projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());
        this.orbitingScythes = this.orbitingScythes.filter(s => !s.revComplete);
    }

    // Execute an arrow attack
    attackArrow() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;
        
        const sourceX = this.position.x + this.width / 2;
        const sourceY = this.position.y + this.height / 2;
        const target = this.getNearestEnemyTarget();
        let targetX;
        let targetY;

        if (target) {
            targetX = target.x;
            targetY = target.y;
        } else {
            const attackVector = this.getAttackVector();
            const attackDistance = 500;
            targetX = sourceX + attackVector.x * attackDistance;
            targetY = sourceY + attackVector.y * attackDistance;
        }
        
        // Create arrow projectile
        this.projectiles.push(
            new Projectile(
                this.gameEnv,
                targetX, 
                targetY,
                // Offset source position to start at player center
                sourceX,
                sourceY,
                "PLAYER",  // Special type for player projectiles
                { owner: this }
            )
        );
        
        this.lastAttackTime = now;
    }

    // Execute a pumpkin splash attack
    attackPumpkin() {
        const now = Date.now();
        if (now - this.lastPumpkinTime < this.pumpkinCooldown) return;

        const sourceX = this.position.x + this.width / 2;
        const sourceY = this.position.y + this.height / 2;
        const target = this.getNearestEnemyTarget();
        let targetX;
        let targetY;

        if (target) {
            targetX = target.x;
            targetY = target.y;
        } else {
            const attackVector = this.getAttackVector();
            const attackDistance = 420;
            targetX = sourceX + attackVector.x * attackDistance;
            targetY = sourceY + attackVector.y * attackDistance;
        }

        this.projectiles.push(
            new Projectile(
                this.gameEnv,
                targetX,
                targetY,
                sourceX,
                sourceY,
                "PUMPKIN",
                { owner: this }
            )
        );

        this.lastPumpkinTime = now;
    }

    isArrowKey(event) {
        return event.code === 'KeyJ' || event.key?.toLowerCase() === 'j';
    }

    isPumpkinKey(event) {
        return event.code === 'KeyK' || event.key?.toLowerCase() === 'k';
    }

    isShockwaveKey(event) {
        return event.code === 'KeyL' || event.key?.toLowerCase() === 'l';
    }

    updateCurrentDirection() {
        if (this.velocity.x === 0 && this.velocity.y === 0) return;

        const absX = Math.abs(this.velocity.x);
        const absY = Math.abs(this.velocity.y);

        if (absX >= absY) {
            this.currentDirection = this.velocity.x >= 0 ? 'right' : 'left';
        } else {
            this.currentDirection = this.velocity.y >= 0 ? 'down' : 'up';
        }
    }

    getAttackVector() {
        const directionVectors = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const directionVector = directionVectors[this.currentDirection] || directionVectors.right;
        return directionVector;
    }

    getNearestEnemyTarget() {
        const enemies = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Boss' || obj.constructor.name === 'Zombie'
        );
        if (enemies.length === 0) return null;

        const sourceX = this.position.x + this.width / 2;
        const sourceY = this.position.y + this.height / 2;
        let nearestBoss = null;
        let nearestZombie = null;
        let bossDist = Infinity;
        let zombieDist = Infinity;

        for (const enemy of enemies) {
            const enemyX = enemy.position.x + enemy.width / 2;
            const enemyY = enemy.position.y + enemy.height / 2;
            const dx = enemyX - sourceX;
            const dy = enemyY - sourceY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (enemy.constructor.name === 'Boss') {
                if (dist < bossDist) {
                    bossDist = dist;
                    nearestBoss = enemy;
                }
            } else if (enemy.constructor.name === 'Zombie') {
                if (dist < zombieDist) {
                    zombieDist = dist;
                    nearestZombie = enemy;
                }
            }
        }

        if (nearestBoss && nearestZombie) {
            const bossDistanceWeight = 0.7;
            const weightedBossDist = bossDist * bossDistanceWeight;
            const favored = weightedBossDist <= zombieDist ? nearestBoss : nearestZombie;
            return {
                x: favored.position.x + favored.width / 2,
                y: favored.position.y + favored.height / 2
            };
        }

        const chosen = nearestBoss || nearestZombie;
        return {
            x: chosen.position.x + chosen.width / 2,
            y: chosen.position.y + chosen.height / 2
        };
    }

    triggerShockwave() {
        if (!this.isShockwaveReady()) return;

        const enemies = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Boss' || obj.constructor.name === 'Zombie'
        );

        enemies.forEach(enemy => {
            if (enemy.constructor.name === 'Zombie') {
                if (typeof enemy.takeDamage === 'function') {
                    enemy.takeDamage(9999);
                } else if (enemy.destroy) {
                    enemy.destroy();
                }
            }
        });

        const boss = enemies.find(enemy => enemy.constructor.name === 'Boss');
        if (boss) {
            boss.healthPoints -= Math.round(this.shockwaveBossDamage * this.getDamageMultiplier());
        }

        this.clearActiveProjectiles();

        this.spawnShockwaveEffect();

        this.lastShockwaveTime = Date.now();
        this.updateShockwaveUI(true);
    }

    applyPowerUp(type) {
        const now = Date.now();

        if (type === 'shield') {
            this.shieldUntil = Math.max(this.shieldUntil, now) + POWER_UP_DURATION_MS.shield;
            this.showPowerUpMessage(type);
            return;
        }

        if (type === 'charge') {
            this.chargeShockwave();
            this.showPowerUpMessage(type);
            return;
        }

        if (type === 'damageBoost') {
            this.damageBoostUntil = Math.max(this.damageBoostUntil, now) + POWER_UP_DURATION_MS.damageBoost;
            this.showPowerUpMessage(type);
            return;
        }

        if (type === 'scythes') {
            this.activateScythes();
            this.showPowerUpMessage(type);
            return;
        }

        if (type === 'heal') {
            const maxHealth = this.data?.maxHealth ?? 100;
            const currentHealth = this.data?.health ?? maxHealth;
            const healedHealth = Math.min(maxHealth, currentHealth + maxHealth * 0.1);
            this.data.health = healedHealth;
            if (typeof updatePlayerHealthBar === 'function') {
                const percent = Math.max(0, Math.min(100, (healedHealth / maxHealth) * 100));
                updatePlayerHealthBar(percent);
            }
            this.showPowerUpMessage(type);
        }
    }

    isShieldActive() {
        return Date.now() < this.shieldUntil;
    }

    getDamageMultiplier() {
        return Date.now() < this.damageBoostUntil ? 2 : this.baseDamageMultiplier;
    }

    chargeShockwave() {
        this.lastShockwaveTime = Date.now() - this.shockwaveCooldown;
        this.updateShockwaveUI(true);
    }

    activateScythes() {
        this.orbitingScythes.forEach(scythe => {
            scythe.revComplete = true;
            if (typeof scythe.destroy === 'function') scythe.destroy();
        });
        this.orbitingScythes = [];

        const scytheCount = 2;
        for (let i = 0; i < scytheCount; i += 1) {
            const scythe = new PlayerScythe(this.gameEnv, this, {
                angle: (Math.PI * 2 / scytheCount) * i,
                durationMs: POWER_UP_DURATION_MS.scythes
            });
            this.orbitingScythes.push(scythe);
            this.gameEnv.gameObjects.push(scythe);
        }
    }

    updatePowerUpEffects() {
        const shieldActive = this.isShieldActive();
        const damageBoostActive = Date.now() < this.damageBoostUntil;
        this.data.canvasFilter = shieldActive ? 'drop-shadow(0 0 12px #4CC9F0)' :
            damageBoostActive ? 'drop-shadow(0 0 12px #EF476F)' : 'none';
    }

    showPowerUpMessage(type) {
        if (typeof document === 'undefined' || !this.gameEnv?.container) return;

        let message = document.getElementById('power-up-message');
        if (!message) {
            message = document.createElement('div');
            message.id = 'power-up-message';
            Object.assign(message.style, {
                position: 'absolute',
                left: '50%',
                bottom: '112px',
                transform: 'translateX(-50%)',
                color: '#FFFFFF',
                fontFamily: "'Press Start 2P', sans-serif",
                fontSize: '14px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.75)',
                pointerEvents: 'none',
                zIndex: '250',
                transition: 'opacity 0.25s ease'
            });
            this.gameEnv.container.appendChild(message);
        }

        message.textContent = POWER_UP_LABELS[type] || 'Power up';
        message.style.opacity = '1';
        clearTimeout(this._powerUpMessageTimer);
        this._powerUpMessageTimer = setTimeout(() => {
            message.style.opacity = '0';
        }, 1400);
    }

    clearActiveProjectiles() {
        const bosses = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Boss');
        bosses.forEach(boss => {
            if (Array.isArray(boss.fireballs)) {
                boss.fireballs.forEach(p => {
                    p.revComplete = true;
                    if (typeof p.destroy === 'function') p.destroy();
                });
                boss.fireballs = [];
            }
            if (Array.isArray(boss.arrows)) {
                boss.arrows.forEach(p => {
                    p.revComplete = true;
                    if (typeof p.destroy === 'function') p.destroy();
                });
                boss.arrows = [];
            }
            if (Array.isArray(boss.scythes)) {
                boss.scythes.forEach(p => {
                    p.revComplete = true;
                    if (typeof p.destroy === 'function') p.destroy();
                });
                boss.scythes = [];
            }
        });

        this.gameEnv.gameObjects = this.gameEnv.gameObjects.filter(obj => {
            const name = obj?.constructor?.name;
            const type = obj?.type;
            const isPlayerShot = type === 'PLAYER' || type === 'PUMPKIN';
            if ((name === 'Projectile' || name === 'Boomerang') && !isPlayerShot) {
                if (typeof obj.destroy === 'function') obj.destroy();
                return false;
            }
            return true;
        });
    }

    isShockwaveReady() {
        return Date.now() - this.lastShockwaveTime >= this.shockwaveCooldown;
    }

    ensureShockwaveUI() {
        if (typeof document === 'undefined') return;
        if (document.getElementById('shockwave-container')) return;

        const container = document.createElement('div');
        container.id = 'shockwave-container';
        Object.assign(container.style, {
            position: 'absolute',
            bottom: '32px',
            right: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '50%',
            padding: '0 24px',
            boxSizing: 'border-box',
            zIndex: '100'
        });

        const label = document.createElement('div');
        label.id = 'shockwave-label';
        label.textContent = 'SHOCKWAVE';
        Object.assign(label.style, {
            color: '#FFD066',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '16px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
        });

        const bar = document.createElement('div');
        bar.id = 'shockwave-bar';
        Object.assign(bar.style, {
            width: '100%',
            height: '25px',
            backgroundColor: '#222',
            border: '2px solid #FFD066',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(255, 208, 102, 0.5)'
        });

        const fill = document.createElement('div');
        fill.id = 'shockwave-fill';
        Object.assign(fill.style, {
            height: '100%',
            width: '0%',
            backgroundColor: '#FF9A00',
            borderRadius: '6px',
            transition: 'width 0.2s ease'
        });

        bar.appendChild(fill);
        container.appendChild(label);
        container.appendChild(bar);

        const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
        gameContainer.appendChild(container);

        if (!document.getElementById('shockwave-style')) {
            const style = document.createElement('style');
            style.id = 'shockwave-style';
            style.textContent = `
                @keyframes shockwave-ready-pulse {
                    0% { filter: brightness(1); box-shadow: 0 0 6px rgba(255, 190, 80, 0.4); }
                    50% { filter: brightness(1.4); box-shadow: 0 0 16px rgba(255, 230, 140, 0.9); }
                    100% { filter: brightness(1); box-shadow: 0 0 6px rgba(255, 190, 80, 0.4); }
                }
                #shockwave-container.shockwave-ready #shockwave-bar {
                    border-color: #FFE3A3;
                }
                #shockwave-container.shockwave-ready #shockwave-fill {
                    animation: shockwave-ready-pulse 0.6s ease-in-out infinite;
                    background-color: #FFE07A;
                }
            `;
            document.head.appendChild(style);
        }
    }

    updateShockwaveUI(forceRefresh = false) {
        if (typeof document === 'undefined') return;
        const container = document.getElementById('shockwave-container');
        const fill = document.getElementById('shockwave-fill');
        const label = document.getElementById('shockwave-label');
        if (!container || !fill) return;

        const elapsed = Date.now() - this.lastShockwaveTime;
        const pct = Math.max(0, Math.min(1, elapsed / this.shockwaveCooldown));
        if (forceRefresh || pct < 1) {
            fill.style.width = `${Math.floor(pct * 100)}%`;
        }

        if (pct >= 1) {
            container.classList.add('shockwave-ready');
            if (label) label.textContent = 'SHOCKWAVE - READY';
        } else {
            container.classList.remove('shockwave-ready');
            if (label) label.textContent = 'SHOCKWAVE';
        }
    }

    spawnShockwaveEffect() {
        if (!this.gameEnv || !this.gameEnv.container) return;

        const shockwave = document.createElement('div');
        shockwave.className = 'shockwave-overlay';
        Object.assign(shockwave.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 245, 220, 0.95) 0%, rgba(255, 190, 80, 0.9) 45%, rgba(255, 120, 30, 0.6) 70%, rgba(0, 0, 0, 0) 100%)',
            boxShadow: '0 0 120px 60px rgba(255, 200, 120, 0.9) inset',
            pointerEvents: 'none',
            zIndex: '200'
        });

        this.gameEnv.container.appendChild(shockwave);
        shockwave.animate(
            [
                { opacity: 1 },
                { opacity: 0 }
            ],
            { duration: 520, easing: 'ease-out', fill: 'forwards' }
        );

        setTimeout(() => shockwave.remove(), 560);

        this.shakeScreen();
    }

    shakeScreen() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const originalTransform = canvas.style.transform;
        canvas.style.transition = 'transform 0.05s ease-in-out';

        let shakes = 0;
        const maxShakes = 6;
        const shakeInterval = setInterval(() => {
            const offsetX = (Math.random() * 2 - 1) * 6;
            const offsetY = (Math.random() * 2 - 1) * 6;
            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            shakes += 1;
            if (shakes >= maxShakes) {
                clearInterval(shakeInterval);
                canvas.style.transform = originalTransform || '';
            }
        }, 50);
    }

    // Clean up event listeners when destroyed
    destroy() {
        if (typeof window !== 'undefined' && this._attackHandler) {
            window.removeEventListener('keydown', this._attackHandler);
        }
        clearTimeout(this._powerUpMessageTimer);
        this.orbitingScythes.forEach(scythe => {
            scythe.revComplete = true;
            if (typeof scythe.destroy === 'function') scythe.destroy();
        });
        super.destroy();
    }
}

export default FightingPlayer;
