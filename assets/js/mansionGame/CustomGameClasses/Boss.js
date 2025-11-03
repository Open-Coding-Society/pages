import Enemy from '../GameEngine/Enemy.js';
import Boomerang from './Boomerang.js';
import Projectile from './Projectile.js';
import Arm from './Arm.js';
import showEndScreen from './EndScreen.js';
import Player from '../GameEngine/Player.js';
import { updateBossHealthBar } from './HealthBars.js';

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
        this.fullHealth = data?.initialHealth || 1500;
        this.healthPoints = this.fullHealth;

        this.arrows = [];
        this.fireballs = [];
        this.scythes = [];
        this.lastAttackTime = Date.now();
        this.attackInterval = data?.attackInterval || 2000;
        this.angerModifier = 1;
        this.attackProbShift = 0.05;

        // Debug/cheat key code - uncomment to enable
        // Add a debug/cheat key ('p') that instantly defeats this boss
        this._killKeyHandler = (event) => {
            try {
                if (!event || !event.key) return;
                if (event.key === 'p' || event.key === 'P') {
                    console.log("[Boss] Kill key pressed: forcing boss death.");
                    this.healthPoints = 0;
                     window.__mansionLevelEnded = true;
                    // Show victory screen immediately
                    try { showEndScreen(this.gameEnv); } catch (e) { console.warn('Error showing victory screen:', e); }
                    // Remove the boss graphic and objects from the game
                    try { this.destroy(); } catch (e) { console.warn('Error destroying boss:', e); }
                    // End the current level so game control can transition
                    try {
                        if (this.gameEnv && this.gameEnv.gameControl && this.gameEnv.gameControl.currentLevel) {
                            this.gameEnv.gameControl.currentLevel.continue = false;
                        }
                    } catch (e) { console.warn('Error ending level after boss kill:', e); }
                }
            } catch (e) { console.error('Kill key handler error:', e); }
        };

        // Attach the listener to window so it's active while the boss exists
        if (typeof window !== 'undefined') window.addEventListener('keydown', this._killKeyHandler);
        

        this.projectileTypes = data?.projectileTypes || ['FIREBALL', 'ARROW'];

        // Initialize arms
        
        this.leftArm = new Arm({
            xOffset: -60,
            yOffset: 20,
            weaponSrc: "../../images/mansionGame/ReaperLeftHandScythe.png",
            emptySrc: "../../images/mansionGame/ReaperLeftHandEmpty.png",
            hasWeapon: true
        }, gameEnv);

        this.rightArm = new Arm({
            xOffset: 60,
            yOffset: 20,
            weaponSrc: "../../images/mansionGame/ReaperRightHandScythe.png",
            emptySrc: "../../images/mansionGame/ReaperRightHandEmpty.png",
            hasWeapon: true
        }, gameEnv);
        

        //this.arms = [this.leftArm, this.rightArm];

        this.isThrowingScythe = false;
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
                    showEndScreen(this.gameEnv);
                } catch (e) { console.error('Error showing end screen:', e); }
            }
            return;
        }
        // Update the position and draw the boss
        this.spriteData.update.call(this);
        this.draw();

        // Update stage & attack speed
        const healthRatio = this.healthPoints / this.fullHealth;
        this.stage = healthRatio < 0.33 ? 3 : (healthRatio < 0.66 ? 2 : 1);
        this.attackInterval = this.stage === 3 ? 1000 : this.stage === 2 ? 1500 : 2000;
        this.angerModifier = this.stage === 3 ? 2 : 1;

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

    /*
    addArm(arm) {
        this.arms.push(arm);
    }
    */

    /* Debug/cheat destroy override - uncomment with key handler above
    // Ensure we clean up the key listener when the boss is destroyed
    destroy() {
        try {
            if (typeof window !== 'undefined' && this._killKeyHandler) {
                window.removeEventListener('keydown', this._killKeyHandler);
            }
        } catch (e) { console.warn('Failed to remove boss key listener:', e); }

        // Call parent destroy if available (Character -> GameObject)
        if (super.destroy) super.destroy();
    }
    */
}

export default Boss;
