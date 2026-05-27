import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import Projectile from './Projectile.js';

/**
 * WaveEnemy - Enemy that moves towards the player from the right
 * Placeholder sprite used (a simple rectangle or placeholder image)
 */
class WaveEnemy extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.healthPoints = data?.healthPoints || 1;
        this.speed = data?.speed || 2;
        this.maxHealth = data?.healthPoints || 1;
        this._isDestroyed = false;
    }

    update() {
        if (this._isDestroyed) return;

        // Move towards the player (left side)
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );

        if (players.length > 0) {
            const player = players[0];
            const dx = player.position.x - this.position.x;
            const dy = player.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.position.x += (dx / distance) * this.speed;
                this.position.y += (dy / distance) * this.speed;
            }
        }

        this.draw();
    }

    takeDamage(amount) {
        this.healthPoints -= amount;
        if (this.healthPoints <= 0) {
            this.destroy();
            this._isDestroyed = true;
        }
    }

    destroy() {
        this._isDestroyed = true;
        // Mark for removal from gameObjects
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

/**
 * WaveManager - Handles all wave logic, enemy spawning, and progression
 */
class WaveManager {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.waves = [
            { count: 5, speed: 2, multiplier: 1.0 },
            { count: 10, speed: 2.5, multiplier: 1.15 },
            { count: 15, speed: 3.0, multiplier: 1.3 }
        ];
        
        this.currentWave = 0;
        this.waveEnemies = [];
        this.waveActive = false;
        this.waveStartTime = 0;
        this.npcSpawned = false;
        
        // Player projectile system
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 400; // ms between shots
        
        // UI
        this.waveDisplay = null;
    }

    /**
     * Start the first wave
     */
    startFirstWave() {
        if (this.waveActive) return;
        this.currentWave = 0;
        this.startWave();
    }

    /**
     * Start the current wave based on currentWave index
     */
    startWave() {
        if (this.currentWave >= this.waves.length) {
            console.log("All waves completed!");
            this.spawnNPC();
            return;
        }

        this.waveActive = true;
        this.waveStartTime = Date.now();
        const wave = this.waves[this.currentWave];
        
        // Clear previous enemies
        this.waveEnemies = [];
        
        // Spawn enemies in this wave
        this.spawnWaveEnemies(wave.count, wave.speed);
        
        // Update UI
        this.updateWaveDisplay();
        
        console.log(`Wave ${this.currentWave + 1} started with ${wave.count} enemies at speed ${wave.speed}`);
    }

    /**
     * Spawn all enemies for a wave
     */
    spawnWaveEnemies(count, speed) {
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const path = this.gameEnv.path;

        // Placeholder sprite - using a simple reaper sprite
        const sprite_src = path + "/images/projects/mansionGame/ReaperMainBody.png";
        const SCALE_FACTOR = 4;

        for (let i = 0; i < count; i++) {
            // Spawn enemies from the right side, spread vertically
            const xPos = width * 0.85 + Math.random() * (width * 0.1);
            const yPos = (height / (count + 1)) * (i + 1) + (Math.random() * height * 0.1 - height * 0.05);

            const enemyData = {
                id: `waveEnemy_${this.currentWave}_${i}`,
                src: sprite_src,
                SCALE_FACTOR: SCALE_FACTOR,
                STEP_FACTOR: 0,
                ANIMATION_RATE: 5,
                INIT_POSITION: { x: xPos, y: yPos },
                pixels: { height: 1024, width: 1024 },
                orientation: { rows: 1, columns: 1 },
                down: { row: 0, start: 0, columns: 1 },
                left: { row: 0, start: 0, columns: 1 },
                right: { row: 0, start: 0, columns: 1 },
                up: { row: 0, start: 0, columns: 1 },
                hitbox: { widthPercentage: 0.6, heightPercentage: 0.6 },
                healthPoints: 1,
                speed: speed
            };

            const enemy = new WaveEnemy(enemyData, this.gameEnv);
            this.waveEnemies.push(enemy);
            this.gameEnv.gameObjects.push(enemy);
        }
    }

    /**
     * Update wave logic - check if wave is complete, spawn next wave
     */
    update() {
        if (!this.waveActive) return;

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());

        // Check projectile-to-enemy collisions
        this.checkProjectileCollisions();

        // Remove destroyed enemies from tracking
        this.waveEnemies = this.waveEnemies.filter(e => !e.isDestroyed());

        // Check if wave is complete
        if (this.waveEnemies.length === 0 && this.waveStartTime > 0) {
            const timeSinceWaveStart = Date.now() - this.waveStartTime;
            // Give a small delay before starting next wave
            if (timeSinceWaveStart > 1000) {
                this.completeWave();
            }
        }
    }

    /**
     * Check for collisions between projectiles and enemies
     */
    checkProjectileCollisions() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            if (projectile.revComplete) continue;

            for (let j = this.waveEnemies.length - 1; j >= 0; j--) {
                const enemy = this.waveEnemies[j];
                if (enemy.isDestroyed()) continue;

                // Calculate distance between projectile and enemy
                const dx = (enemy.position.x + enemy.width / 2) - projectile.position.x;
                const dy = (enemy.position.y + enemy.height / 2) - projectile.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Hit detection (adjust threshold as needed)
                const hitThreshold = 45;
                if (distance <= hitThreshold) {
                    // Damage enemy
                    const damage = 1; // One hit kills
                    enemy.takeDamage(damage);

                    // Destroy projectile
                    projectile.revComplete = true;
                    if (projectile.destroy) {
                        projectile.destroy();
                    }

                    break; // Move to next projectile
                }
            }
        }
    }

    /**
     * Handle wave completion and transition to next wave
     */
    completeWave() {
        console.log(`Wave ${this.currentWave + 1} completed!`);
        this.waveActive = false;
        this.currentWave++;

        if (this.currentWave >= this.waves.length) {
            console.log("All waves completed! NPC spawning...");
            this.waveActive = false;
            this.spawnNPC();
        } else {
            // Small delay before next wave
            setTimeout(() => {
                if (this.currentWave < this.waves.length) {
                    this.startWave();
                }
            }, 1500);
        }
    }

    /**
     * Spawn NPC after all waves are defeated
     */
    spawnNPC() {
        if (this.npcSpawned) return;
        this.npcSpawned = true;

        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const path = this.gameEnv.path;

        // Create NPC data - placeholder sprite
        const npcData = {
            id: 'VictoryNPC',
            greeting: "You have defeated all the waves! Well done!",
            src: path + "/images/projects/mansionGame/spookMcWalk.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: width / 2, y: height / 2 },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down: { row: 1, start: 0, columns: 3 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 1, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
        };

        // Import Npc class
        const Npc = this.getNpcClass();
        if (Npc) {
            const npc = new Npc(npcData, this.gameEnv);
            this.gameEnv.gameObjects.push(npc);
            console.log("NPC spawned at center of screen");
        }
    }

    /**
     * Get NPC class - this will be called dynamically
     */
    getNpcClass() {
        // This will be handled by the importing module
        return null;
    }

    /**
     * Handle player shooting at enemies
     */
    playerShoot(targetPosition = null) {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );

        if (players.length === 0) return;

        const player = players[0];
        const sourceX = player.position.x + player.width / 2;
        const sourceY = player.position.y + player.height / 2;

        let targetX, targetY;

        if (targetPosition) {
            targetX = targetPosition.x;
            targetY = targetPosition.y;
        } else if (this.waveEnemies.length > 0) {
            // Target nearest enemy
            const nearest = this.getNearestEnemy(player);
            if (nearest) {
                targetX = nearest.position.x + nearest.width / 2;
                targetY = nearest.position.y + nearest.height / 2;
            } else {
                // Shoot to the right if no target
                targetX = sourceX + 500;
                targetY = sourceY;
            }
        } else {
            // Shoot to the right
            targetX = sourceX + 500;
            targetY = sourceY;
        }

        // Create arrow projectile
        const projectile = new Projectile(
            this.gameEnv,
            targetX,
            targetY,
            sourceX,
            sourceY,
            "PLAYER",
            { owner: this }
        );

        this.projectiles.push(projectile);
        this.gameEnv.gameObjects.push(projectile);
        this.lastAttackTime = now;
    }

    /**
     * Get nearest enemy to player
     */
    getNearestEnemy(player) {
        if (this.waveEnemies.length === 0) return null;

        let nearest = this.waveEnemies[0];
        let minDist = Infinity;

        for (const enemy of this.waveEnemies) {
            const dx = enemy.position.x - player.position.x;
            const dy = enemy.position.y - player.position.y;
            const dist = dx * dx + dy * dy;

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }

        return nearest;
    }

    /**
     * Update wave display UI
     */
    updateWaveDisplay() {
        if (!this.waveDisplay) {
            this.waveDisplay = document.createElement('div');
            this.waveDisplay.id = 'wave-display';
            this.waveDisplay.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 25px;
                border: 2px solid #ff6b6b;
                border-radius: 8px;
                font-size: 20px;
                font-weight: bold;
                z-index: 1000;
            `;
            document.body.appendChild(this.waveDisplay);
        }

        const wave = this.waves[this.currentWave];
        const remaining = this.waveEnemies.length;
        this.waveDisplay.innerHTML = `
            <div>Wave ${this.currentWave + 1}/${this.waves.length}</div>
            <div>Enemies: ${remaining}/${wave.count}</div>
        `;
    }

    /**
     * Check if all waves are complete
     */
    isComplete() {
        return this.npcSpawned;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.waveDisplay && this.waveDisplay.parentNode) {
            document.body.removeChild(this.waveDisplay);
        }
        
        // Clean up enemies
        for (const enemy of this.waveEnemies) {
            if (!enemy.isDestroyed()) {
                enemy.destroy();
            }
        }
        
        // Clean up projectiles
        for (const projectile of this.projectiles) {
            if (projectile && projectile.destroy) {
                projectile.destroy();
            }
        }
    }
}

export { WaveManager, WaveEnemy };
