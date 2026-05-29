import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import Projectile from './Projectile.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import MansionLevelMain from './mansionLevelMain.js';
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

/**
 * WaveManager - Handles wave logic, enemy spawning, projectiles, and progression
 */
class WaveManager {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.waves = [
            { count: 5,  speed: 1.5  },  // Wave 1
            { count: 8,  speed: 2.0  },  // Wave 2
            { count: 12, speed: 2.7  },   // Wave 3
            { count: 16, speed: 3.0  }   // Wave 4
        ];

        this.currentWave = 0;
        this.waveEnemies = [];
        this.waveActive = false;
        this.waveStartTime = 0;
        this.npcSpawned = false;
        this._playerDead = false;
        this.player = null; // Cached player reference

        // Projectile system
        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 1000; // 1s between shots

        this.waveDisplay = null;
        this.lastDisplayedWave = -1;
        this.lastDisplayedEnemyCount = -1;
    }

    startFirstWave() {
        if (this.waveActive) return;
        this.currentWave = 0;
        this.startWave();
    }

    startWave() {
        if (this.currentWave >= this.waves.length) {
            this.spawnNPC();
            return;
        }

        this.waveActive = true;
        this.waveStartTime = Date.now();
        const wave = this.waves[this.currentWave];

        this.waveEnemies = [];
        this.spawnWaveEnemies(wave.count, wave.speed);
        this.updateWaveDisplay();

        console.log(`Wave ${this.currentWave + 1} started — ${wave.count} enemies at speed ${wave.speed}`);
    }

    spawnWaveEnemies(count, speed) {
        const width  = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const path   = this.gameEnv.path;
        const sprite_src = path + "/images/projects/mansionGame/ghost.png";

        // Player starts at width*0.1, height/2 — reject spawns closer than half the screen
        const playerStartX = width * 0.1;
        const playerStartY = height / 2;
        const minSpawnDist = Math.min(width, height) * 0.5;
        const minGhostSpacing = 150; // Minimum distance between ghosts

        const spawnedPositions = []; // Track all spawned ghost positions

        for (let i = 0; i < count; i++) {
            let xPos, yPos;
            let validSpawn = false;

            // Re-roll until spawn is far enough from the player start position and other ghosts
            while (!validSpawn) {
                const edge = Math.floor(Math.random() * 4);
                switch (edge) {
                    case 0: xPos = Math.random() * width;  yPos = -80;          break; // top
                    case 1: xPos = Math.random() * width;  yPos = height + 80;  break; // bottom
                    case 2: xPos = -80;                    yPos = Math.random() * height; break; // left
                    default: xPos = width + 80;            yPos = Math.random() * height; break; // right
                }
                
                // Check distance from player
                const dxPlayer = xPos - playerStartX;
                const dyPlayer = yPos - playerStartY;
                const distFromPlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);
                
                if (distFromPlayer < minSpawnDist) continue;

                // Check distance from all previously spawned ghosts
                let tooCloseToGhost = false;
                for (const pos of spawnedPositions) {
                    const dxGhost = xPos - pos.x;
                    const dyGhost = yPos - pos.y;
                    const distFromGhost = Math.sqrt(dxGhost * dxGhost + dyGhost * dyGhost);
                    if (distFromGhost < minGhostSpacing) {
                        tooCloseToGhost = true;
                        break;
                    }
                }

                if (!tooCloseToGhost) {
                    validSpawn = true;
                }
            }

            spawnedPositions.push({ x: xPos, y: yPos });

            const enemyData = {
                id: `waveEnemy_${this.currentWave}_${i}`,
                src: sprite_src,
                SCALE_FACTOR: 5,
                STEP_FACTOR: 0,
                ANIMATION_RATE: 8,
                INIT_POSITION: { x: xPos, y: yPos },
                pixels: { height: 1000, width: 3000 }, // full spritesheet dimensions
                orientation: { rows: 2, columns: 6 },
                left:  { row: 0, start: 0, columns: 6 }, // top row = ghost leaning left
                right: { row: 1, start: 0, columns: 6 }, // bottom row = ghost leaning right
                up:    { row: 0, start: 0, columns: 6 },
                down:  { row: 1, start: 0, columns: 6 },
                hitbox: { widthPercentage: 0.4, heightPercentage: 0.5 },
                healthPoints: 1,
                speed: speed
            };

            const enemy = new WaveEnemy(enemyData, this.gameEnv);
            this.waveEnemies.push(enemy);
            this.gameEnv.gameObjects.push(enemy);
        }
    }

    update() {
        // Cache player reference once per frame
        this.player = this.gameEnv.gameObjects.find(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        ) || null;

        // Always update projectiles and check collisions during waves
        if (this.waveActive) {
            // Update enemies with cached player reference
            this.waveEnemies.forEach(enemy => enemy.update(this.player));

            // Update and cull dead projectiles
            this.projectiles = this.projectiles.filter(p => !p.revComplete);
            this.projectiles.forEach(p => p.update());

            // Collision checks
            this.checkProjectileCollisions();
            this.checkPlayerCollisions();

            // Cull destroyed enemies
            this.waveEnemies = this.waveEnemies.filter(e => !e.isDestroyed());

            // Keep UI counter live
            this.updateWaveDisplay();

            // Check wave completion (1s grace period after wave starts)
            if (this.waveEnemies.length === 0 && this.waveStartTime > 0) {
                if (Date.now() - this.waveStartTime > 1000) {
                    this.completeWave();
                }
            }
        }

        // Update all NPCs that have been spawned (including victory pumpkin)
        const npcs = this.gameEnv.gameObjects.filter(obj => obj.constructor.name === 'Npc');
        npcs.forEach(npc => {
            if (npc && typeof npc.update === 'function') {
                npc.update();
            }
        });
    }

    checkProjectileCollisions() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            if (projectile.revComplete) continue;
            const projectileHitbox = this.getObjectHitbox(projectile, 1, 1);

            for (let j = this.waveEnemies.length - 1; j >= 0; j--) {
                const enemy = this.waveEnemies[j];
                if (enemy.isDestroyed()) continue;
                const enemyHitbox = this.getObjectHitbox(enemy);

                if (this.hitboxesOverlap(projectileHitbox, enemyHitbox)) {
                    enemy.takeDamage(1);
                    projectile.revComplete = true;
                    if (projectile.destroy) projectile.destroy();
                    break;
                }
            }
        }
    }

    getObjectHitbox(object, defaultWidthPercentage = 0.5, defaultHeightPercentage = 0.5) {
        const width = object.width || 50;
        const height = object.height || 50;
        const hitboxWidth = width * (object.hitbox?.widthPercentage ?? defaultWidthPercentage);
        const hitboxHeight = height * (object.hitbox?.heightPercentage ?? defaultHeightPercentage);

        return {
            left: object.position.x + (width - hitboxWidth) / 2,
            top: object.position.y + (height - hitboxHeight) / 2,
            right: object.position.x + (width + hitboxWidth) / 2,
            bottom: object.position.y + (height + hitboxHeight) / 2
        };
    }

    hitboxesOverlap(first, second) {
        return (
            first.left <= second.right &&
            first.right >= second.left &&
            first.top <= second.bottom &&
            first.bottom >= second.top
        );
    }

    checkPlayerCollisions() {
        if (this._playerDead || !this.player) return;

        const playerCX = this.player.position.x + (this.player.width  || 50) / 2;
        const playerCY = this.player.position.y + (this.player.height || 50) / 2;

        for (const enemy of this.waveEnemies) {
            if (enemy.isDestroyed()) continue;

            const dx = playerCX - (enemy.position.x + (enemy.width  || 50) / 2);
            const dy = playerCY - (enemy.position.y + (enemy.height || 50) / 2);

            if (Math.sqrt(dx * dx + dy * dy) <= 40) {
                this.killPlayer(this.player);
                return;
            }
        }
    }

    killPlayer(player) {
        if (this._playerDead) return;
        this._playerDead = true;

        const gameControl = player?.gameEnv?.gameControl;
        if (gameControl) gameControl.isPaused = true;

        // Particle burst at player position
        const playerCX = player.position.x + player.width  / 2;
        const playerCY = player.position.y + player.height / 2;
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            Object.assign(particle.style, {
                position: 'absolute',
                width: '5px', height: '5px',
                backgroundColor: 'red',
                left: `${playerCX}px`, top: `${playerCY}px`,
                zIndex: '9999'
            });
            document.body.appendChild(particle);

            const angle    = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            particle.animate(
                [{ transform: 'translate(0,0)', opacity: 1 },
                 { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }],
                { duration: 1000, easing: 'ease-out', fill: 'forwards' }
            );
            setTimeout(() => particle.remove(), 1000);
        }

        // Death dialog
        const deathMessage = document.createElement('div');
        Object.assign(deathMessage.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.8)', color: '#FF0000',
            padding: '30px', borderRadius: '10px',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '24px', textAlign: 'center',
            zIndex: '10000', border: '3px solid #FF0000',
            boxShadow: '0 0 20px rgba(255,0,0,0.5)', width: '400px'
        });
        deathMessage.innerHTML = `
            <div style="margin-bottom:20px">☠️ YOU DIED ☠️</div>
            <div style="font-size:16px;margin-bottom:20px">The ghosts got you!</div>
            <div style="font-size:14px">Respawning in 3 seconds...</div>
        `;
        document.body.appendChild(deathMessage);
        setTimeout(() => deathMessage.remove(), 2000);

        // Restart MansionLevel4
        setTimeout(() => {
            import('./mansionLevel4.js').then(({ default: MansionLevel4 }) => {
                if (gameControl && typeof gameControl.transitionToLevel === 'function') {
                    gameControl.levelClasses = [MansionLevel4];
                    gameControl.currentLevelIndex = 0;
                    gameControl.isPaused = false;
                    gameControl.transitionToLevel();
                } else {
                    location.reload();
                }
            }).catch(() => location.reload());
        }, 3000);
    }

    completeWave() {
        console.log(`Wave ${this.currentWave + 1} completed!`);
        this.waveActive = false;
        this.currentWave++;

        if (this.currentWave >= this.waves.length) {
            console.log("All waves done! Spawning NPC...");
            this.spawnNPC();
        } else {
            setTimeout(() => this.startWave(), 1500);
        }
    }

    spawnNPC() {
        if (this.npcSpawned) return;
        this.npcSpawned = true;

        const width  = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const path   = this.gameEnv.path;

        const npcData = {
            id: 'VictoryNPC',
            greeting: "You have defeated all the waves! Well done!",
            src: path + "/images/projects/mansionGame/pumpkin.png",
            SCALE_FACTOR: 4,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: 0.5, y: 0.5 },
            pixels: { height: 256, width: 256 },
            orientation: { rows: 1, columns: 1 },
            down:  { row: 0, start: 0, columns: 1 },
            left:  { row: 0, start: 0, columns: 1 },
            right: { row: 0, start: 0, columns: 1 },
            up:    { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            zIndex: 100,
            interact: function() {
                const gameControl = this.gameEnv?.gameControl;
                if (!gameControl) {
                    console.error("gameControl not found");
                    return;
                }

                // Transition back to lobby
                gameControl.levelClasses = [MansionLevelMain];
                gameControl.currentLevelIndex = 0;
                gameControl.isPaused = false;
                gameControl.transitionToLevel();

                localStorage.setItem('mansionGame_level5_unlocked', 'true');
            }
        };

        const npc = new Npc(npcData, this.gameEnv);
        this.gameEnv.gameObjects.push(npc);
        console.log("Victory NPC spawned");
    }

    playerShoot(direction = null) {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;
        if (!this.player) return;

        const sourceX = this.player.position.x + this.player.width  / 2;
        const sourceY = this.player.position.y + this.player.height / 2;

        let targetX, targetY;

        if (direction?.dx !== undefined) {
            // Shoot in the direction the player is moving
            const len = Math.sqrt(direction.dx ** 2 + direction.dy ** 2) || 1;
            targetX = sourceX + (direction.dx / len) * 1000;
            targetY = sourceY + (direction.dy / len) * 1000;
        } else {
            // Fallback: aim at nearest enemy, or shoot right
            const nearest = this.getNearestEnemy(this.player);
            targetX = nearest ? nearest.position.x + (nearest.width  || 50) / 2 : sourceX + 500;
            targetY = nearest ? nearest.position.y + (nearest.height || 50) / 2 : sourceY;
        }

        const projectile = new Projectile(
            this.gameEnv, targetX, targetY, sourceX, sourceY, "PLAYER", { owner: this }
        );
        this.projectiles.push(projectile);
        this.gameEnv.gameObjects.push(projectile);
        this.lastAttackTime = now;
    }

    getNearestEnemy(player) {
        if (this.waveEnemies.length === 0) return null;
        let nearest = this.waveEnemies[0];
        let minDist  = Infinity;

        for (const enemy of this.waveEnemies) {
            const dx   = enemy.position.x - player.position.x;
            const dy   = enemy.position.y - player.position.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) { minDist = dist; nearest = enemy; }
        }
        return nearest;
    }

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

        const waveIndex = Math.min(this.currentWave, this.waves.length - 1);
        const wave = this.waves[waveIndex];
        const currentEnemyCount = this.waveEnemies.length;
        const displayWave = Math.min(this.currentWave + 1, this.waves.length);

        // Only update DOM if values changed
        if (this.lastDisplayedWave !== displayWave || this.lastDisplayedEnemyCount !== currentEnemyCount) {
            this.waveDisplay.innerHTML = `
                <div>Wave ${displayWave}/${this.waves.length}</div>
                <div>Enemies remaining: ${currentEnemyCount}/${wave.count}</div>
            `;
            this.lastDisplayedWave = displayWave;
            this.lastDisplayedEnemyCount = currentEnemyCount;
        }
    }

    isComplete() {
        return this.npcSpawned;
    }

    destroy() {
        if (this.waveDisplay?.parentNode) {
            document.body.removeChild(this.waveDisplay);
        }
        for (const enemy      of this.waveEnemies) { if (!enemy.isDestroyed()) enemy.destroy(); }
        for (const projectile of this.projectiles) { if (projectile?.destroy) projectile.destroy(); }
    }
}

export { WaveManager, WaveEnemy };
