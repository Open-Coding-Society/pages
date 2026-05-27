import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import Projectile from './Projectile.js';

class WaveEnemy extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.healthPoints = data?.healthPoints || 1;
        this.speed = data?.speed || 3;
        this.maxHealth = data?.healthPoints || 1;
        this._isDestroyed = false;
    }

    update() {
        if (this._isDestroyed) return;

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
        if (this.healthPoints <= 0 && !this._isDestroyed) {
            this.destroy();
        }
    }

    destroy() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        // Required: Character.destroy() removes the canvas from the DOM
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

class WaveManager {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.waves = [
            { count: 5,  speed: 3 },
            { count: 10, speed: 5 },
            { count: 15, speed: 7 }
        ];

        this.currentWave = 0;
        this.waveEnemies = [];
        this.waveActive = false;
        this.waveStartTime = 0;
        this.npcSpawned = false;
        this._playerDead = false;

        this.projectiles = [];
        this.lastAttackTime = Date.now();
        this.attackCooldown = 400;

        this.waveDisplay = null;
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
    const sprite_src = path + "/_projects/games/mansionGame/images/ghost.png"; // ← updated

    for (let i = 0; i < count; i++) {
        // Spawn from all 4 edges
        const edge = Math.floor(Math.random() * 4);
        let xPos, yPos;
        switch (edge) {
            case 0: xPos = Math.random() * width;  yPos = -60;          break; // top
            case 1: xPos = Math.random() * width;  yPos = height + 60;  break; // bottom
            case 2: xPos = -60;                    yPos = Math.random() * height; break; // left
            default: xPos = width + 60;            yPos = Math.random() * height; break; // right
        }

        const enemyData = {
            id: `waveEnemy_${this.currentWave}_${i}`,
            src: sprite_src,
            SCALE_FACTOR: 3,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 8,
            INIT_POSITION: { x: xPos, y: yPos },
            pixels: { height: 1000, width: 3000 }, // full spritesheet: 6 cols × 2 rows × 500px each
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
        if (!this.waveActive) return;

        this.projectiles = this.projectiles.filter(p => !p.revComplete);
        this.projectiles.forEach(p => p.update());

        this.checkProjectileCollisions();
        this.checkPlayerCollisions();

        this.waveEnemies = this.waveEnemies.filter(e => !e.isDestroyed());
        this.updateWaveDisplay();

        if (this.waveEnemies.length === 0 && this.waveStartTime > 0) {
            if (Date.now() - this.waveStartTime > 1000) {
                this.completeWave();
            }
        }
    }

    checkProjectileCollisions() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            if (projectile.revComplete) continue;

            for (let j = this.waveEnemies.length - 1; j >= 0; j--) {
                const enemy = this.waveEnemies[j];
                if (enemy.isDestroyed()) continue;

                const dx = (enemy.position.x + (enemy.width  || 50) / 2) - projectile.position.x;
                const dy = (enemy.position.y + (enemy.height || 50) / 2) - projectile.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= 45) {
                    enemy.takeDamage(1);
                    projectile.revComplete = true;
                    if (projectile.destroy) projectile.destroy();
                    break;
                }
            }
        }
    }

    checkPlayerCollisions() {
        if (this._playerDead) return;

        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return;

        const player = players[0];
        const playerCX = player.position.x + (player.width  || 50) / 2;
        const playerCY = player.position.y + (player.height || 50) / 2;

        for (const enemy of this.waveEnemies) {
            if (enemy.isDestroyed()) continue;

            const enemyCX = enemy.position.x + (enemy.width  || 50) / 2;
            const enemyCY = enemy.position.y + (enemy.height || 50) / 2;
            const dx = playerCX - enemyCX;
            const dy = playerCY - enemyCY;

            if (Math.sqrt(dx * dx + dy * dy) <= 40) {
                this.killPlayer(player);
                return;
            }
        }
    }

    killPlayer(player) {
        if (this._playerDead) return;
        this._playerDead = true;

        // Use the existing death screen system from Projectile/DeathScreen.js
        import('./DeathScreen.js').then(({ default: showDeathScreen }) => {
            showDeathScreen(player);
        }).catch(() => {
            // Fallback if import fails
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed;inset:0;background:rgba(0,0,0,0.85);
                display:flex;flex-direction:column;align-items:center;
                justify-content:center;z-index:99999;
            `;
            overlay.innerHTML = `
                <h1 style="color:#ff4444;font-size:64px;margin:0 0 20px">GAME OVER</h1>
                <p style="color:white;font-size:24px;margin:0 0 40px">An enemy reached you on Wave ${this.currentWave + 1}</p>
                <button onclick="location.reload()" style="
                    padding:15px 40px;font-size:22px;background:#4CAF50;
                    color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;
                ">Try Again</button>
            `;
            document.body.appendChild(overlay);
        });
    }

    completeWave() {
        console.log(`Wave ${this.currentWave + 1} completed!`);
        this.waveActive = false;
        this.currentWave++;

        if (this.currentWave >= this.waves.length) {
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
            src: path + "/images/projects/mansionGame/spookMcWalk.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 0,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: width / 2, y: height / 2 },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down:  { row: 1, start: 0, columns: 3 },
            left:  { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up:    { row: 1, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 }
        };

        const Npc = this.getNpcClass();
        if (Npc) {
            this.gameEnv.gameObjects.push(new Npc(npcData, this.gameEnv));
        }
    }

    getNpcClass() {
        return null;
    }

    playerShoot(targetPosition = null) {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
        );
        if (players.length === 0) return;

        const player  = players[0];
        const sourceX = player.position.x + player.width  / 2;
        const sourceY = player.position.y + player.height / 2;

        let targetX, targetY;
        if (targetPosition) {
            targetX = targetPosition.x;
            targetY = targetPosition.y;
        } else {
            const nearest = this.getNearestEnemy(player);
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
                position:fixed;top:20px;left:20px;background:rgba(0,0,0,0.7);
                color:white;padding:15px 25px;border:2px solid #ff6b6b;
                border-radius:8px;font-size:20px;font-weight:bold;z-index:1000;
            `;
            document.body.appendChild(this.waveDisplay);
        }

        const waveIndex = Math.min(this.currentWave, this.waves.length - 1);
        const wave      = this.waves[waveIndex];
        this.waveDisplay.innerHTML = `
            <div>Wave ${Math.min(this.currentWave + 1, this.waves.length)}/${this.waves.length}</div>
            <div>Enemies remaining: ${this.waveEnemies.length}/${wave.count}</div>
        `;
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