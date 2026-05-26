import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import Boomerang from './Boomerang.js';
import Projectile from './Projectile.js';
import Arm from './Arm.js';
import MansionLevel6_EndingCutscene from './mansionLevel6_EndingCutscene.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import { updateBossHealthBar } from './HealthBars.js';
import Zombie from './Zombie.js';

/*
    Boss class to define the Reaper
    - Uses various attacks at an attack interval to damage the player
    - Has heath (see HealthBars.js for health bars)
    - Slowly moves towards the player
*/

class Boss extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);

        // Lazy cache for the boss health fill DOM element (populated when available)
        this._bossHealthFill = null;

        this.stage = 1;
        this.fullHealth = data?.initialHealth || 10000;
        this.healthPoints = this.fullHealth;

        this.arrows = [];
        this.fireballs = [];
        this.scythes = [];
        this.lastAttackTime = Date.now();
        this.attackInterval = data?.attackInterval || 2000;
        this.angerModifier = 1;
        this.attackProbShift = 0.05;

        this.lastZombieWaveTime = 0;
        this.zombieWaveSize = data?.zombieWaveSize || 3;
        this.maxZombiesAlive = data?.maxZombiesAlive || 8;

        this.projectileTypes = data?.projectileTypes || ['FIREBALL', 'ARROW'];

        // Initialize arms
        
        this.leftArm = new Arm({
            xOffset: -60,
            yOffset: 20,
            weaponSrc: "../../images/projects/mansionGame/ReaperLeftHandScythe.png",
            emptySrc: "../../images/projects/mansionGame/ReaperLeftHandEmpty.png",
            hasWeapon: true
        }, gameEnv);

        this.rightArm = new Arm({
            xOffset: 60,
            yOffset: 20,
            weaponSrc: "../../images/projects/mansionGame/ReaperRightHandScythe.png",
            emptySrc: "../../images/projects/mansionGame/ReaperRightHandEmpty.png",
            hasWeapon: true
        }, gameEnv);
        

        //this.arms = [this.leftArm, this.rightArm];

        this.isThrowingScythe = false;

        if (typeof window !== 'undefined') {
            this._oneHpKeyHandler = (event) => {
                if (event.key !== '1') return;
                this.healthPoints = 1;
                const full = this.fullHealth || 1;
                const percent = Math.max(0, Math.min(100, (this.healthPoints / full) * 100));
                updateBossHealthBar(percent, this.stage);
            };
            window.addEventListener('keydown', this._oneHpKeyHandler);
        }
    }

    // Update function for the Boss
    update() {
        // === [ADDED] Update boss health bar ===
        // Lazily grab the fill element (the battle room creates it when the level loads)
        if (!this._bossHealthFill && typeof document !== 'undefined') {
            this._bossHealthFill = document.getElementById('boss-health-fill');
        }

        if (this._bossHealthFill) {
            // Guard against division by zero if fullHealth is ever 0
            const full = this.fullHealth || 1;
            const percent = Math.max(0, Math.min(100, (this.healthPoints / full) * 100));
            this._bossHealthFill.style.width = `${percent}%`;
            this._bossHealthFill.style.backgroundColor = percent < 33 ? '#A020F0' : percent < 66 ? '#800000' : '#FF0000';

            // If boss is dead, remove the health bar from the DOM (cleanup)
            if (this.healthPoints <= 0) {
                try {
                    const bar = document.getElementById('boss-health-bar');
                    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
                } catch (e) { console.warn('Failed to remove boss health bar:', e); }
                this._bossHealthFill = null;
            }
        }

        // If boss health is 0 or less, do nothing for now.
        // If boss is dead, show end screen once (delegated to EndScreen module)
        if (this.healthPoints <= 0) {
            if (!this._victoryShown) {
                this._victoryShown = true;
                try {
                    this.triggerVictoryCutscene();
                } catch (e) { console.error('Error starting ending cutscene:', e); }
            }
            return;
        }
        // Update the position and draw the boss
        this.spriteData.update.call(this);
        this.draw();

        // Update stage & attack speed
        const healthRatio = this.healthPoints / this.fullHealth;
        this.stage = healthRatio < 0.33 ? 3 : (healthRatio < 0.66 ? 2 : 1);
        this.attackInterval = this.stage === 3 ? 750 : this.stage === 2 ? 1000 : 1000;
        this.angerModifier = this.stage === 3 ? 2 : 1;

        if (this.stage >= 2) {
            this.spawnZombieWaveIfReady();
        }

        // Update projectiles
        [...this.fireballs, ...this.arrows].forEach(p => {
            if (p.revComplete) {
                p.destroy();
            } else {
                p.update();
            }
        });
        this.fireballs = this.fireballs.filter(p => !p.revComplete);
        this.arrows = this.arrows.filter(p => !p.revComplete);

        // Update scythes
        this.scythes.forEach(s => s.update());
        this.scythes = this.scythes.filter(s => !s.revComplete);
        if (this.scythes.length === 0) {
            this.isThrowingScythe = false;
            this.leftArm.restoreWeapon(); // return scythe to left arm
        }

        // Update arms to follow the boss
        //this.arms.forEach(arm => arm.update(this.position.x, this.position.y));

        // Attack logic
        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackInterval) {
            const target = this.findNearestPlayer();
            if (target) this.performAttack(target);
            this.lastAttackTime = now;
        }

        // Movement toward nearest player if not throwing scythe
        /*
        if (!this.isThrowingScythe) {
            const target = this.findNearestPlayer();
            if (target) this.moveToward(target, 0.25);
        }
        */
    }

    // Locate the nearest player
    findNearestPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj => obj instanceof Player);
        if (players.length === 0) return null;

        let nearest = players[0];
        let minDist = Infinity;

        for (const player of players) {
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = player;
            }
        }

        return nearest;
    }

    // Randomize attack chances
    performAttack(target) {
        const rand = Math.random();
        const attackProbModifier = this.attackProbShift * (this.stage - 1);
        
        if (this.stage >= 2 && rand < 0.3 + attackProbModifier) {
            this.scytheAttack(target);
        } else if (rand < 0.6 + attackProbModifier) {
            this.fireballAttack(target);
        } else {
            this.arrowAttack(target);
        }
        

        // shoots only scythes for debugging
        // this.scytheAttack(target);
    }

    // Move towards a certian location
    moveToward(target, speed) {
        const dx = target.position.x - this.position.x;
        const dy = target.position.y - this.position.y;
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * speed;
        this.position.y += Math.sin(angle) * speed;
    }

    // Disable the explode method
    explode(x, y) {
        throw new Error("Reapers cannot explode! (yet :})");
    }

    scytheAttack(target) {
        // Use left arm to throw scythe
        //this.leftArm.removeWeapon();
        this.scythes.push(new Boomerang(this.gameEnv, target.position.x, target.position.y, this.position.x, this.position.y));
        this.isThrowingScythe = true;
    }

    fireballAttack(target) {
        //this.rightArm.shoot();
        this.fireballs.push(new Projectile(this.gameEnv, target.position.x, target.position.y, this.position.x, this.position.y, "FIREBALL"));
    }

    arrowAttack(target) {
        //this.rightArm.shoot();
        this.arrows.push(new Projectile(this.gameEnv, target.position.x, target.position.y, this.position.x, this.position.y, "ARROW"));
    }

    spawnZombieWaveIfReady() {
        const now = Date.now();
        const cooldownMs = this.stage === 3 ? 3500 : 5000;
        if (now - this.lastZombieWaveTime < cooldownMs) return;

        const zombiesAlive = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Zombie').length;
        if (zombiesAlive >= this.maxZombiesAlive) return;

        const spawnCount = Math.min(this.zombieWaveSize, this.maxZombiesAlive - zombiesAlive);
        for (let i = 0; i < spawnCount; i += 1) {
            const spawn = this.getZombieSpawnPoint();
            const zombieData = {
                id: `Zombie-${now}-${i}`,
                INIT_POSITION: spawn,
                healthPoints: 1,
                damage: 6,
                speed: 0.5
            };
            this.gameEnv.gameObjects.push(new Zombie(zombieData, this.gameEnv));
        }

        this.lastZombieWaveTime = now;
    }

    getZombieSpawnPoint() {
        const w = this.gameEnv.innerWidth;
        const h = this.gameEnv.innerHeight;
        const edge = Math.floor(Math.random() * 4);
        const margin = 20;

        if (edge === 0) return { x: Math.random() * w, y: margin };
        if (edge === 1) return { x: Math.random() * w, y: h - margin };
        if (edge === 2) return { x: margin, y: Math.random() * h };
        return { x: w - margin, y: Math.random() * h };
    }

    triggerVictoryCutscene() {
        const gameEnv = this.gameEnv;
        const gameControl = gameEnv?.gameControl;

        this.clearBossProjectiles();
        this.cleanupBattleRoomUi(gameEnv);

        try {
            if (typeof window !== 'undefined') {
                if (window._battleMusic && typeof window._battleMusic.pause === 'function') {
                    window._battleMusic.pause();
                    window._battleMusic.currentTime = 0;
                }
                if (window._levelMusic && typeof window._levelMusic.pause === 'function') {
                    window._levelMusic.pause();
                    window._levelMusic.currentTime = 0;
                }
                if (window._endMusic && typeof window._endMusic.pause === 'function') {
                    window._endMusic.pause();
                    window._endMusic.currentTime = 0;
                }
            }
        } catch (e) { /* ignore */ }

        if (typeof document === 'undefined' || !gameControl) return;

        const existingOverlay = document.getElementById('mansion-victory-fade');
        if (existingOverlay && existingOverlay.parentNode) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }

        const fadeOverlay = document.createElement('div');
        fadeOverlay.id = 'mansion-victory-fade';
        const fadeInMs = 1200;
        const fadeOutMs = 1200;
        Object.assign(fadeOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            opacity: '0',
            transition: `opacity ${fadeInMs}ms ease-in-out`,
            zIndex: '10000'
        });

        document.body.appendChild(fadeOverlay);

        requestAnimationFrame(() => {
            fadeOverlay.style.opacity = '1';

            setTimeout(() => {
                try {
                    gameControl.levelClasses = [MansionLevel6_EndingCutscene];
                    gameControl.currentLevelIndex = 0;
                    gameControl.isPaused = false;
                    gameControl.transitionToLevel();
                } catch (e) {
                    console.warn('Failed to transition to ending cutscene:', e);
                }

                setTimeout(() => {
                    fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                    fadeOverlay.style.opacity = '0';
                    setTimeout(() => {
                        if (fadeOverlay.parentNode) fadeOverlay.parentNode.removeChild(fadeOverlay);
                    }, fadeOutMs + 100);
                }, 1500);
            }, fadeInMs + 100);
        });
    }

    cleanupBattleRoomUi(gameEnv) {
        if (typeof document === 'undefined') return;

        const selectors = [
            '#boss-health-container',
            '#player-health-container',
            '#shockwave-container',
            '#instructions-container',
            '#power-up-message',
            '#low-health-overlay',
            '#damage-flash-overlay',
            '.shockwave-overlay'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
        });

        const cleanupStyles = ['low-health-style', 'shockwave-style'];
        cleanupStyles.forEach(id => {
            const styleEl = document.getElementById(id);
            if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        });

        if (gameEnv && Array.isArray(gameEnv.gameObjects)) {
            gameEnv.gameObjects.forEach(obj => {
                if (!obj) return;
                const name = obj.constructor?.name;
                if (name === 'FightingPlayer') {
                    if (Array.isArray(obj.projectiles)) {
                        obj.projectiles.forEach(projectile => {
                            if (projectile && typeof projectile.destroy === 'function') projectile.destroy();
                        });
                        obj.projectiles = [];
                    }
                    if (Array.isArray(obj.orbitingScythes)) {
                        obj.orbitingScythes.forEach(scythe => {
                            if (scythe && typeof scythe.destroy === 'function') scythe.destroy();
                        });
                        obj.orbitingScythes = [];
                    }
                }

                if (
                    name === 'Projectile' ||
                    name === 'Boomerang' ||
                    name === 'PlayerScythe' ||
                    name === 'PowerUp' ||
                    name === 'PowerUpSpawner' ||
                    name === 'Zombie'
                ) {
                    if (typeof obj.destroy === 'function') {
                        obj.destroy();
                    }
                }
            });

            gameEnv.gameObjects = gameEnv.gameObjects.filter(obj => {
                const name = obj?.constructor?.name;
                return name !== 'Projectile'
                    && name !== 'Boomerang'
                    && name !== 'PlayerScythe'
                    && name !== 'PowerUp'
                    && name !== 'PowerUpSpawner'
                    && name !== 'Zombie';
            });
        }
    }

    clearBossProjectiles() {
        const destroyProjectile = (projectile) => {
            if (!projectile) return;
            projectile.revComplete = true;
            if (typeof projectile.destroy === 'function') {
                projectile.destroy();
            }
        };

        this.fireballs.forEach(destroyProjectile);
        this.arrows.forEach(destroyProjectile);
        this.scythes.forEach(destroyProjectile);

        this.fireballs = [];
        this.arrows = [];
        this.scythes = [];
        this.isThrowingScythe = false;
    }

    /*
    addArm(arm) {
        this.arms.push(arm);
    }
    */

    destroy() {
        try {
            if (typeof window !== 'undefined' && this._oneHpKeyHandler) {
                window.removeEventListener('keydown', this._oneHpKeyHandler);
            }
        } catch (e) { console.warn('Failed to remove boss key listener:', e); }

        // Call parent destroy if available (Character -> GameObject)
        if (super.destroy) super.destroy();
    }
}

export default Boss;
