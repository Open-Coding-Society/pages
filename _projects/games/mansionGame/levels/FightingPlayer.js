import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Projectile from './Projectile.js';

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
        
        // Update and clean up projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());
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
                "PLAYER"  // Special type for player projectiles
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
                "PUMPKIN"
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
            const bossBias = 15;
            const favored = bossDist <= zombieDist + bossBias ? nearestBoss : nearestZombie;
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
            boss.healthPoints -= this.shockwaveBossDamage;
        }

        this.spawnShockwaveEffect();

        this.lastShockwaveTime = Date.now();
        this.updateShockwaveUI(true);
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
        super.destroy();
    }
}

export default FightingPlayer;
