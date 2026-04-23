import GameEnvBackground from '/Team-Pranigas/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/Team-Pranigas/assets/js/GameEnginev1.1/essentials/Player.js';
import PeppaBossEnemy from './PeppaBossEnemy.js';

class PeppaBattleLevelBase {
    constructor(gameEnv, config) {
        this.gameEnv = gameEnv;
        this.config = config;

        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        this.playerMaxHealth = config.playerHealth ?? 5;
        this.playerHealth = this.playerMaxHealth;
        this.playerDamageCooldownMs = config.playerDamageCooldownMs ?? 650;
        this.attackCooldownMs = config.attackCooldownMs ?? 450;
        this.laserSpeed = config.laserSpeed ?? 14;
        this.lastPlayerHitAt = 0;
        this.lastAttackAt = 0;
        this.lastEnemyLaserAt = 0;
        this.enemyLaserIntervalMs = config.enemyLaserIntervalMs ?? 1100;
        this.attackRequested = false;
        this.battleEnded = false;
        this.messageTimeout = null;
        this.restartTimeout = null;
        this.lasers = [];
        this.playerDamage = config.playerDamage ?? 1;

        // API / leaderboard settings
        this.apiBase = config.apiBase || null;
        this.playerName = config.playerName || '';
        this.levelScore = 0;
        this.leaderboard = [];

        // Coins
        this.coins = [];
        this.coinCount = 0;
        this.coinValue = config.coinValue ?? 25;
        this.coinRadius = config.coinRadius ?? 14;
        this.coinTotal = config.coinTotal ?? 8;

        // Floor barrier: characters stay in lower portion (ground), cannot float in air
        this.floorY = height * 0.48;
        this.ceilingY = 0;
        this.playerSpawn = { x: width * 0.12, y: height * 0.72 };
        this.enemySpawn = { x: width * 0.72, y: height * 0.66 };
        this.initialPositionsSet = false;
        this.messageClearTimeout = null;

        const image_data_background = {
            name: `peppa-${config.levelId}-arena`,
            greeting: config.levelIntro,
            src: `${path}/images/projects/PeppaPigGame/PeppaPigBackground.jpg`,
            pixels: { height: 1229, width: 1920 }
        };

        const sprite_data_ishan = {
            id: 'IshanJha',
            greeting: 'Ishan Jha enters the ring. Press SPACE to attack.',
            src: `${path}/images/projects/PeppaPigGame/IshanJha.png`,
            SCALE_FACTOR: 4,
            STEP_FACTOR: 1100,
            ANIMATION_RATE: 12,
            INIT_POSITION: this.playerSpawn,
            keypress: { up: 87, left: 65, down: 83, right: 68 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
            playerDamage: config.playerDamage ?? 1,
            playerSpeedMultiplier: config.playerSpeedMultiplier ?? 1,
            playerHealth: config.playerHealth ?? 4
        };

        const sprite_data_enemy = {
            id: config.enemyName,
            greeting: config.enemyGreeting,
            src: `${path}/images/projects/PeppaPigGame/${config.enemyImage}`,
            SCALE_FACTOR: config.enemyScale ?? 4,
            ANIMATION_RATE: 18,
            INIT_POSITION: this.enemySpawn,
            health: config.enemyHealth,
            moveSpeed: config.enemySpeed,
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.6 }
        };

        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_ishan },
            { class: PeppaBossEnemy, data: sprite_data_enemy }
        ];

        this.boundKeyDown = this.handleKeyDown.bind(this);
    }

    initialize() {
        if (window.speechSynthesis) {
            window.speechSynthesis.speak = () => {};
            window.speechSynthesis.cancel();
        }

        this.ensurePlayerName();
        this.generateCoins();
        this.createHud();
        this.updateHud('Fight! Use WASD to move, SPACE to fire lasers, and collect coins.');
        document.addEventListener('keydown', this.boundKeyDown);
        this.createLaserLayer();

        this.loadLeaderboard().then(() => {
            this.renderLeaderboard();
        });
    }

    ensurePlayerName() {
        if (this.playerName && this.playerName.trim()) return;

        const savedName = localStorage.getItem('peppaPlayerName');
        if (savedName && savedName.trim()) {
            this.playerName = savedName.trim();
            return;
        }

        let inputName = window.prompt('Enter your name for the leaderboard:', '');
        if (!inputName || !inputName.trim()) {
            inputName = 'Player';
        }

        this.playerName = inputName.trim().slice(0, 20);
        localStorage.setItem('peppaPlayerName', this.playerName);
    }

    generateCoins() {
        this.coins = [];

        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const minX = width * 0.10;
        const maxX = width * 0.90;
        const minY = this.floorY + 30;
        const maxY = height - 40;

        const isTooCloseToSpawn = (x, y) => {
            const distPlayer = Math.hypot(x - this.playerSpawn.x, y - this.playerSpawn.y);
            const distEnemy = Math.hypot(x - this.enemySpawn.x, y - this.enemySpawn.y);
            return distPlayer < 90 || distEnemy < 90;
        };

        for (let i = 0; i < this.coinTotal; i++) {
            let tries = 0;
            let x = minX;
            let y = minY;

            do {
                x = minX + Math.random() * (maxX - minX);
                y = minY + Math.random() * (maxY - minY);
                tries += 1;
            } while (isTooCloseToSpawn(x, y) && tries < 30);

            this.coins.push({
                x,
                y,
                radius: this.coinRadius,
                collected: false,
                spin: Math.random() * Math.PI * 2
            });
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.boundKeyDown);
        if (this.messageClearTimeout) clearTimeout(this.messageClearTimeout);
        if (this.messageTimeout) clearTimeout(this.messageTimeout);
        if (this.restartTimeout) clearTimeout(this.restartTimeout);
        if (this.hud) this.hud.remove();
        if (this.laserLayer && this.laserLayer.parentNode) this.laserLayer.remove();

        const loseOverlay = document.getElementById(`peppa-lose-overlay-${this.config.levelId}`);
        if (loseOverlay) loseOverlay.remove();

        const winOverlay = document.getElementById('peppa-win-overlay');
        if (winOverlay) winOverlay.remove();
    }

    async saveScore(score) {
        if (!this.apiBase) {
            // Use localStorage for leaderboard if no API
            this.saveScoreLocal(score);
            return { success: true };
        }

        try {
            const response = await fetch(`${this.apiBase}/leaderboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.playerName || 'Player',
                    score: score,
                    levelId: this.config.levelId,
                    levelTitle: this.config.levelTitle
                })
            });

            if (!response.ok) {
                throw new Error(`POST failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('Score saved:', data);
            return data;
        } catch (error) {
            console.error('Error saving score:', error);
            this.updateHud('Could not save score.');
            return null;
        }
    }

    async loadLeaderboard() {
        if (!this.apiBase) {
            // Use localStorage for leaderboard if no API
            this.leaderboard = this.loadLeaderboardLocal();
            return this.leaderboard;
        }

        try {
            const response = await fetch(`${this.apiBase}/leaderboard`);

            if (!response.ok) {
                throw new Error(`GET failed: ${response.status}`);
            }

            const data = await response.json();
            this.leaderboard = Array.isArray(data) ? data : [];
            return this.leaderboard;
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.leaderboard = [];
            return [];
        }
    }

    loadLeaderboardLocal() {
        try {
            const leaderboardKey = `peppa-leaderboard-${this.config.levelId}`;
            const data = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading leaderboard locally:', error);
            return [];
        }
    }

    renderLeaderboard() {
        const leaderboardEl = document.getElementById(`peppa-leaderboard-${this.config.levelId}`);
        if (!leaderboardEl) return;

        if (!this.leaderboard || this.leaderboard.length === 0) {
            leaderboardEl.innerHTML = `
                <div style="font-weight:700; margin-bottom:6px;">Leaderboard</div>
                <div style="opacity:0.8;">No scores yet.</div>
            `;
            return;
        }

        const sorted = [...this.leaderboard]
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .slice(0, 8);

        leaderboardEl.innerHTML = `
            <div style="font-weight:700; margin-bottom:8px; font-size:16px;">Leaderboard</div>
            ${sorted.map((entry, index) => {
                const name = entry.name ?? 'Player';
                const score = entry.score ?? 0;
                return `
                    <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
                        <span>${index + 1}. ${name}</span>
                        <span>${score}</span>
                    </div>
                `;
            }).join('')}
        `;
    }

    showLoseScreenAndRestart() {
        const existing = document.getElementById(`peppa-lose-overlay-${this.config.levelId}`);
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = `peppa-lose-overlay-${this.config.levelId}`;
        overlay.style.cssText = `
            position: absolute; inset: 0; z-index: 99999; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: rgba(0,0,0,0.88);
            color: #fff; font-family: Arial, sans-serif; text-align: center;
        `;
        overlay.innerHTML = `
            <div style="font-size:44px; font-weight:bold; margin-bottom:12px; color:#ff5b5b;">YOU LOST</div>
            <div style="font-size:22px; margin-bottom:8px;">Try again.</div>
            <div style="font-size:14px; opacity:0.8;">Restarting level...</div>
        `;
        document.body.appendChild(overlay);

        const ctrl = this.gameEnv?.gameControl;
        this.restartTimeout = setTimeout(() => {
            overlay.remove();
            if (ctrl && ctrl.currentLevel && ctrl.currentLevel.gameLevel === this) {
                ctrl.transitionToLevel();
            }
        }, 1500);
    }

    createLaserLayer() {
        this.laserLayer = document.createElement('canvas');
        this.laserLayer.id = `peppa-laser-layer-${this.config.levelId}`;
        this.laserLayer.style.cssText = 'position:absolute; left:0; top:0; pointer-events:none; z-index:15;';

        const container = this.gameEnv.gameContainer || this.gameEnv.container || document.getElementById('gameContainer') || document.body;
        container.style.position = 'relative';
        container.appendChild(this.laserLayer);

        this.laserLayer.width = this.gameEnv.innerWidth;
        this.laserLayer.height = this.gameEnv.innerHeight;
        this.laserLayer.style.width = `${this.gameEnv.innerWidth}px`;
        this.laserLayer.style.height = `${this.gameEnv.innerHeight}px`;
    }

    directionToVelocity(dir) {
        const s = this.laserSpeed;
        const map = {
            right: [s, 0],
            left: [-s, 0],
            up: [0, -s],
            down: [0, s],
            upRight: [s * 0.707, -s * 0.707],
            upLeft: [-s * 0.707, -s * 0.707],
            downRight: [s * 0.707, s * 0.707],
            downLeft: [-s * 0.707, s * 0.707]
        };
        return map[dir] || [s, 0];
    }

    spawnLaser(fromX, fromY, targetX, targetY, isPlayerLaser) {
        const dx = targetX - fromX;
        const dy = targetY - fromY;
        const len = Math.hypot(dx, dy) || 1;
        this.lasers.push({
            x: fromX,
            y: fromY,
            vx: (dx / len) * this.laserSpeed,
            vy: (dy / len) * this.laserSpeed,
            isPlayerLaser,
            life: 60,
            maxLife: 60
        });
    }

    spawnLaserStraight(fromX, fromY, direction, isPlayerLaser) {
        const [vx, vy] = this.directionToVelocity(direction);
        this.lasers.push({
            x: fromX,
            y: fromY,
            vx,
            vy,
            isPlayerLaser,
            life: 60,
            maxLife: 60
        });
    }

    drawCoin(ctx, coin) {
        const pulse = 0.85 + 0.15 * Math.sin(coin.spin);
        const radiusX = coin.radius * pulse;
        const radiusY = coin.radius;

        ctx.save();
        ctx.translate(coin.x, coin.y);

        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#f7c948';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#d89b00';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX * 0.65, radiusY * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff2a8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff7cc';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);

        ctx.restore();
    }

    updateCoins(ctx, player) {
        if (!ctx) return;

        for (const coin of this.coins) {
            if (coin.collected) continue;

            coin.spin += 0.12;
            this.drawCoin(ctx, coin);

            if (!player) continue;

            const playerCenterX = player.position.x + player.width / 2;
            const playerCenterY = player.position.y + player.height / 2;
            const distance = Math.hypot(playerCenterX - coin.x, playerCenterY - coin.y);

            const collectRadius = Math.max(player.width, player.height) * 0.28 + coin.radius;

            if (distance <= collectRadius) {
                coin.collected = true;
                this.coinCount += 1;
                this.updateHud(`Coin collected! +${this.coinValue} score`);
            }
        }
    }

    updateLasers() {
        const ctx = this.laserLayer?.getContext('2d');
        if (!ctx) return;

        this.laserLayer.width = this.gameEnv.innerWidth;
        this.laserLayer.height = this.gameEnv.innerHeight;
        this.laserLayer.style.width = `${this.gameEnv.innerWidth}px`;
        this.laserLayer.style.height = `${this.gameEnv.innerHeight}px`;

        const player = this.getPlayer();
        const boss = this.getBoss();

        // Draw and update coins first
        this.updateCoins(ctx, player);

        let playerLaserDamage = this.playerDamage;
        if (player && typeof player.playerDamage === 'number') {
            playerLaserDamage = player.playerDamage;
        }

        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const L = this.lasers[i];
            L.x += L.vx;
            L.y += L.vy;
            L.life -= 1;

            if (L.life <= 0) {
                this.lasers.splice(i, 1);
                continue;
            }

            const alpha = L.life / L.maxLife;
            ctx.save();
            ctx.translate(L.x, L.y);
            ctx.rotate(Math.atan2(L.vy, L.vx));
            const grad = ctx.createLinearGradient(-25, 0, 25, 0);
            const color = L.isPlayerLaser ? 'rgba(0,255,255,0.9)' : 'rgba(255,50,50,0.9)';
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.3, color);
            grad.addColorStop(0.7, color);
            grad.addColorStop(1, 'transparent');
            ctx.globalAlpha = alpha;
            ctx.fillStyle = grad;
            ctx.fillRect(-25, -3, 50, 6);
            ctx.shadowColor = L.isPlayerLaser ? 'cyan' : 'red';
            ctx.shadowBlur = 8;
            ctx.fillRect(-25, -2, 50, 4);
            ctx.restore();

            const hitW = 20;
            const hitH = 20;
            const hitLeft = L.x - hitW / 2;
            const hitTop = L.y - hitH / 2;

            if (L.isPlayerLaser && boss && !boss.isDefeated) {
                if (
                    hitLeft < boss.position.x + boss.width &&
                    hitLeft + hitW > boss.position.x &&
                    hitTop < boss.position.y + boss.height &&
                    hitTop + hitH > boss.position.y
                ) {
                    boss.takeDamage(playerLaserDamage);
                    this.lasers.splice(i, 1);
                }
            } else if (!L.isPlayerLaser && player) {
                if (
                    hitLeft < player.position.x + player.width &&
                    hitLeft + hitW > player.position.x &&
                    hitTop < player.position.y + player.height &&
                    hitTop + hitH > player.position.y
                ) {
                    if (Date.now() - this.lastPlayerHitAt >= this.playerDamageCooldownMs) {
                        this.lastPlayerHitAt = Date.now();
                        this.playerHealth = Math.max(0, this.playerHealth - 1);
                    }
                    this.lasers.splice(i, 1);
                }
            }
        }
    }

    showWinScreen() {
        const existing = document.getElementById('peppa-win-overlay');
        if (existing) existing.remove();

        const coinBonus = this.coinCount * this.coinValue;

        const overlay = document.createElement('div');
        overlay.id = 'peppa-win-overlay';
        overlay.style.cssText = `
            position: absolute; inset: 0; z-index: 99999; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: rgba(0,0,0,0.85);
            color: #fff; font-family: Arial, sans-serif; text-align: center;
        `;
        overlay.innerHTML = `
            <div style="font-size:48px; font-weight:bold; margin-bottom:16px; text-shadow:0 0 20px gold;">VICTORY!</div>
            <div style="font-size:22px; margin-bottom:8px;">You defeated all challengers!</div>
            <div style="font-size:18px; margin-bottom:8px;">Coins Collected: ${this.coinCount}</div>
            <div style="font-size:18px; margin-bottom:8px;">Coin Bonus: ${coinBonus}</div>
            <div style="font-size:18px; margin-bottom:8px;">Final Score: ${this.levelScore}</div>
            <div style="font-size:16px; opacity:0.9;">The Peppa Pig Ring Champion</div>
            <div style="margin-top:32px; font-size:14px; opacity:0.7;">Press any key or click to continue</div>
        `;
        const finish = () => {
            overlay.remove();
            if (this.gameEnv?.gameControl?.currentLevel) {
                this.gameEnv.gameControl.currentLevel.continue = false;
            }
        };
        overlay.addEventListener('click', finish);
        document.addEventListener('keydown', finish, { once: true });
        document.body.appendChild(overlay);
    }

    enforceFloorBarriers() {
        const player = this.getPlayer();
        const boss = this.getBoss();
        const floorY = this.floorY;
        const height = this.gameEnv.innerHeight;

        if (player) {
            if (player.position.y < floorY) {
                player.position.y = floorY;
                player.velocity.y = 0;
            }
            if (player.position.y + player.height > height) {
                player.position.y = height - player.height;
                player.velocity.y = 0;
            }
        }
        if (boss) {
            if (boss.position.y < floorY) {
                boss.position.y = floorY;
                boss.velocity.y = 0;
            }
            if (boss.position.y + boss.height > height) {
                boss.position.y = height - boss.height;
                boss.velocity.y = 0;
            }
        }
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            this.attackRequested = true;
            event.preventDefault();
        }
    }

    createHud() {
        this.hud = document.createElement('div');
        this.hud.id = `peppa-battle-hud-${this.config.levelId}`;

        Object.assign(this.hud.style, {
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: '9999',
            width: '240px',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.72)',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'auto',
            lineHeight: '1.35',
            boxShadow: '0 0 10px rgba(0,0,0,0.35)'
        });

        this.hud.innerHTML = `
            <div style="font-weight:700; margin-bottom:8px; font-size:16px;">${this.config.levelTitle}</div>
            <div id="peppa-player-name-${this.config.levelId}" style="margin-bottom:6px; font-size:13px;"></div>
            <div id="peppa-player-hp-${this.config.levelId}" style="margin-bottom:4px;"></div>
            <div id="peppa-coin-count-${this.config.levelId}" style="margin-bottom:4px;"></div>
            <div id="peppa-enemy-hp-${this.config.levelId}" style="margin-bottom:6px;"></div>
            <button id="peppa-change-name-${this.config.levelId}" style="margin-bottom:8px; padding:6px 10px; border:none; border-radius:6px; cursor:pointer;">Change Name</button>
            <div id="peppa-message-${this.config.levelId}" style="margin-top:6px; margin-bottom:10px; font-size:13px; min-height:18px;"></div>
            <div id="peppa-leaderboard-${this.config.levelId}" style="margin-top:8px; font-size:12px;"></div>
        `;

        const container = this.gameEnv.gameContainer || this.gameEnv.container || document.getElementById('gameContainer') || document.body;
        container.style.position = 'relative';
        container.appendChild(this.hud);

        const changeNameBtn = document.getElementById(`peppa-change-name-${this.config.levelId}`);
        if (changeNameBtn) {
            changeNameBtn.addEventListener('click', () => {
                const newName = window.prompt('Enter a new leaderboard name:', this.playerName || 'Player');
                if (newName && newName.trim()) {
                    this.playerName = newName.trim().slice(0, 20);
                    localStorage.setItem('peppaPlayerName', this.playerName);
                    this.updateHud('Name updated.');
                }
            });
        }
    }

    updateHud(message = null) {
        const playerNameEl = document.getElementById(`peppa-player-name-${this.config.levelId}`);
        const playerHpEl = document.getElementById(`peppa-player-hp-${this.config.levelId}`);
        const coinCountEl = document.getElementById(`peppa-coin-count-${this.config.levelId}`);
        const enemyHpEl = document.getElementById(`peppa-enemy-hp-${this.config.levelId}`);
        const messageEl = document.getElementById(`peppa-message-${this.config.levelId}`);

        const boss = this.getBoss();

        if (playerNameEl) {
            playerNameEl.textContent = `Player: ${this.playerName || 'Player'}`;
        }
        if (playerHpEl) {
            playerHpEl.textContent = `HP: ${this.playerHealth}/${this.playerMaxHealth}`;
        }
        if (coinCountEl) {
            coinCountEl.textContent = `Coins: ${this.coinCount} (${this.coinCount * this.coinValue} bonus)`;
        }
        if (enemyHpEl && boss) {
            enemyHpEl.textContent = `${this.config.enemyName} HP: ${boss.health}/${boss.maxHealth}`;
        }

        if (messageEl && message !== null) {
            messageEl.textContent = message;

            if (this.messageClearTimeout) {
                clearTimeout(this.messageClearTimeout);
            }

            const persistent =
                message.includes('Moving to next level') ||
                message.includes('Restarting level') ||
                message.includes('VICTORY') ||
                message.includes('You lost');

            if (!persistent) {
                this.messageClearTimeout = setTimeout(() => {
                    const liveMessageEl = document.getElementById(`peppa-message-${this.config.levelId}`);
                    if (liveMessageEl) {
                        liveMessageEl.textContent = '';
                    }
                }, 1500);
            }
        }
    }

    enforceInitialSpawnPositions(player, boss) {
        if (this.initialPositionsSet) return;
        if (!player || !boss) return;

        const floorY = this.floorY;
        const height = this.gameEnv.innerHeight;

        player.position.x = this.playerSpawn.x;
        player.position.y = Math.min(height - player.height, Math.max(floorY, this.playerSpawn.y));
        player.velocity.x = 0;
        player.velocity.y = 0;

        boss.position.x = this.enemySpawn.x;
        boss.position.y = Math.min(height - boss.height, Math.max(floorY, this.enemySpawn.y));
        boss.velocity.x = 0;
        boss.velocity.y = 0;

        this.initialPositionsSet = true;
    }

    getPlayer() {
        return this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'Player');
    }

    getBoss() {
        return this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'PeppaBossEnemy');
    }

    areColliding(a, b) {
        if (!a || !b) return false;
        return (
            a.position.x < b.position.x + b.width &&
            a.position.x + a.width > b.position.x &&
            a.position.y < b.position.y + b.height &&
            a.position.y + a.height > b.position.y
        );
    }

    centerDistance(a, b) {
        const ax = a.position.x + a.width / 2;
        const ay = a.position.y + a.height / 2;
        const bx = b.position.x + b.width / 2;
        const by = b.position.y + b.height / 2;
        return Math.hypot(ax - bx, ay - by);
    }

    update() {
        if (this.battleEnded) return;

        const player = this.getPlayer();
        const boss = this.getBoss();
        if (!player || !boss) return;

        this.enforceInitialSpawnPositions(player, boss);

        const now = Date.now();

        if (this.attackRequested) {
            this.attackRequested = false;
            if (now - this.lastAttackAt >= this.attackCooldownMs && !boss.isDefeated) {
                this.lastAttackAt = now;
                const px = player.position.x + player.width / 2;
                const py = player.position.y + player.height / 2;
                const dir = player.direction || 'right';
                this.spawnLaserStraight(px, py, dir, true);
            }
        }

        if (!boss.isDefeated && now - this.lastEnemyLaserAt >= this.enemyLaserIntervalMs) {
            this.lastEnemyLaserAt = now;
            const bx = boss.position.x + boss.width / 2;
            const by = boss.position.y + boss.height / 2;
            const px = player.position.x + player.width / 2;
            const py = player.position.y + player.height / 2;
            this.spawnLaser(bx, by, px, py, false);
        }

        this.updateLasers();
        this.enforceFloorBarriers();

        if (!boss.isDefeated && this.areColliding(player, boss) && (now - this.lastPlayerHitAt >= this.playerDamageCooldownMs)) {
            this.lastPlayerHitAt = now;
            this.playerHealth = Math.max(0, this.playerHealth - 1);
        }

        if (this.playerHealth <= 0 && !this.battleEnded) {
            this.battleEnded = true;
            this.updateHud('You lost. Restarting level...');
            this.showLoseScreenAndRestart();
            return;
        }

        if (boss.isDefeated && !this.battleEnded) {
            this.battleEnded = true;
            const score = (this.playerHealth * 100) + (this.coinCount * this.coinValue);
            this.levelScore = score;

            this.saveScore(score)
                .then(() => this.loadLeaderboard())
                .then(() => this.renderLeaderboard());

            const ctrl = this.gameEnv?.gameControl;
            const isFinalLevel = ctrl && ctrl.currentLevelIndex === ctrl.levelClasses?.length - 1;

            if (isFinalLevel) {
                this.showWinScreen();
            } else {
                this.updateHud(`${this.config.enemyName} defeated! Score: ${score}. Moving to next level...`);
                this.messageTimeout = setTimeout(() => {
                    if (ctrl?.currentLevel) ctrl.currentLevel.continue = false;
                }, 1100);
            }
            return;
        }

        this.updateHud();
    }
}

export default PeppaBattleLevelBase;