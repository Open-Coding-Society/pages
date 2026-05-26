import GameEnvBackground from "@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js";
import FightingPlayer from "./FightingPlayer.js";
import Boss from './Boss.js';
import showDeathScreen from './DeathScreen.js';
import { createBossHealthBar, createPlayerHealthBar, updatePlayerHealthBar } from './HealthBars.js';
import PowerUp from './PowerUp.js';
import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';

class PowerUpSpawner extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.spawnIntervalMs = data?.spawnIntervalMs ?? 9000;
        this.spawnDelayMs = data?.spawnDelayMs ?? 2500;
        this.powerUpSize = data?.powerUpSize ?? 25;
        this.spawnPadding = data?.spawnPadding ?? 40;
        this.topPadding = data?.topPadding ?? 150;
        this.powerTypes = data?.powerTypes || ['shield', 'charge', 'damageBoost', 'scythes', 'heal'];
        this.nextSpawnAt = Date.now() + this.spawnDelayMs;
        this.wasActive = false;
    }

    update() {
        if (!this.gameEnv || !this.gameEnv.gameObjects) return;
        if (this.gameEnv.gameControl?.isPaused) return;
        if (typeof window !== 'undefined' && window.__battleRoomFadeComplete === false) return;

        const hasActive = this.gameEnv.gameObjects.some(obj => obj?.constructor?.name === 'PowerUp');
        if (hasActive) {
            this.wasActive = true;
            return;
        }

        if (this.wasActive) {
            this.wasActive = false;
            this.nextSpawnAt = Date.now() + this.spawnIntervalMs;
        }

        const now = Date.now();
        if (now < this.nextSpawnAt) return;

        const powerType = this.powerTypes[Math.floor(Math.random() * this.powerTypes.length)];
        const powerUp = new PowerUp({
            id: `PowerUp-${powerType}-${now}`,
            powerType,
            INIT_POSITION: this.getRandomPowerUpPosition(),
            targetSize: this.powerUpSize
        }, this.gameEnv);

        this.gameEnv.gameObjects.push(powerUp);
        this.nextSpawnAt = now + this.spawnIntervalMs;
    }

    getRandomPowerUpPosition() {
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;
        const maxX = Math.max(this.spawnPadding, width - this.spawnPadding - this.powerUpSize);
        const maxY = Math.max(this.topPadding, height - this.spawnPadding - this.powerUpSize);
        return {
            x: this.spawnPadding + Math.random() * (maxX - this.spawnPadding),
            y: this.topPadding + Math.random() * (maxY - this.topPadding)
        };
    }

    draw() {}

    resize() {}

    destroy() {}
}

class MansionLevel6_BattleRoom {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/projects/mansionGame/bossFloorPattern.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: { height: 341, width: 498 }
        };

        // --- Player ---
        const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 100,
            INIT_POSITION: {
                x: (width / 2 - width / (5 * MC_SCALE_FACTOR)),
                y: height - (height / MC_SCALE_FACTOR)
            },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }, // W, A, S, D
            health: 300,  // We define the health here
            maxHealth: 300
        };

        // Add the Reaper
        const sprite_src_enemy = path + "/images/projects/mansionGame/Reaper.png";
        const sprite_data_enemy = {
            id: 'Reaper',
            greeting: "You feel a dark presence...",
            src: sprite_src_enemy,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            pixels: { height: 104, width: 132 },
            INIT_POSITION: { x: width / 2, y: height / 2 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.4, heightPercentage: 0 },
            zIndex: 10,
            isKilling: false, // Flag to prevent multiple kills

            // The update method with all functionality inline
            update: function () {
                // Skip update if already in killing process
                if (this.isKilling) {
                    return;
                }

                // Don't move until battle room fade is complete
                if (!window.__battleRoomFadeComplete) {
                    return;
                }

                // Find all player objects
                const players = this.gameEnv.gameObjects.filter(obj =>
                    obj.constructor.name === 'Player' || obj.constructor.name === 'FightingPlayer'
                );

                if (players.length === 0) return;

                // Find nearest player
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

                // Move towards nearest player
                const speed = 0.3; // Adjust speed as needed
                const dx = nearest.position.x - this.position.x;
                const dy = nearest.position.y - this.position.y;
                const angle = Math.atan2(dy, dx);

                // Update position
                this.position.x += Math.cos(angle) * speed;
                this.position.y += Math.sin(angle) * speed;

                // Check for collision with any player
                for (const player of players) {
                    // Calculate distance for hitbox collision
                    const playerX = player.position.x + player.width / 2;
                    const playerY = player.position.y + player.height / 2;
                    const enemyX = this.position.x + this.width / 2;
                    const enemyY = this.position.y + this.height / 2;

                    const dx = playerX - enemyX;
                    const dy = playerY - enemyY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Hitbox collision - adjust values as needed
                    const collisionThreshold = (player.width * player.hitbox.widthPercentage +
                        this.width * this.hitbox.widthPercentage) / 2;

                    if (distance < collisionThreshold) {
                        if (player && typeof player.isShieldActive === 'function' && player.isShieldActive()) {
                            const pushX = playerX - enemyX;
                            const pushY = playerY - enemyY;
                            const pushDistance = Math.sqrt(pushX * pushX + pushY * pushY) || 1;
                            this.position.x -= (pushX / pushDistance) * 28;
                            this.position.y -= (pushY / pushDistance) * 28;
                            continue;
                        }

                        // Set killing flag to prevent repeated kills
                        this.isKilling = true;
                        // Disable player input/movement without modifying the engine:
                        try {
                            // 'player' is the local variable in this loop
                            if (!player._inputDisabled) {
                                player._inputDisabled = true;

                                // Clear any pressed keys and update velocity
                                try { player.pressedKeys = {}; } catch (e) { }
                                try { if (typeof player.updateVelocityAndDirection === 'function') player.updateVelocityAndDirection(); } catch (e) { }
                                try { if (player.velocity) { player.velocity.x = 0; player.velocity.y = 0; } } catch (e) { }

                                // Replace key handlers with no-ops so bound listeners do nothing
                                try {
                                    if (player.handleKeyDown && !player._origHandleKeyDown) {
                                        player._origHandleKeyDown = player.handleKeyDown;
                                        player.handleKeyDown = function () { };
                                    }
                                    if (player.handleKeyUp && !player._origHandleKeyUp) {
                                        player._origHandleKeyUp = player.handleKeyUp;
                                        player.handleKeyUp = function () { };
                                    }
                                } catch (e) { }

                                // Hide touch controls if present
                                try { if (player.touchControls && typeof player.touchControls.hide === 'function') player.touchControls.hide(); } catch (e) { }
                            }
                        } catch (e) { /* ignore */ }

                        // Execute the death
                        nearest.data.health = 0;
                        const pct = Math.max(0, Math.min(100, nearest.data.health || 0));
                        updatePlayerHealthBar(pct);
                        showDeathScreen(nearest);
                        break;
                    }
                }
            }
        };

        const powerUpSize = 25;
        const spawnPadding = 40;
        const topPadding = 150;

        this.classes = [
            { class: GameEnvBackground, data: image_data_floor },
            { class: FightingPlayer, data: sprite_data_mc },
            { class: Boss, data: sprite_data_enemy },
            { class: PowerUpSpawner, data: { powerUpSize, spawnPadding, topPadding } }
        ];

        // Create health bar when battle room loads
        if (typeof window !== 'undefined' && !window.__mansionLevelEnded) {
            createBossHealthBar();
            createPlayerHealthBar();
            updatePlayerHealthBar(100);
        }

        // Create instructions under the boss bar (fade after 15 seconds)
        const instruction = document.createElement('div');
        instruction.id = 'instructions-container';
        instruction.textContent = 'WASD to move, J to shoot, K to throw pumpkin, L for shockwave, touch power ups to collect';
        Object.assign(instruction.style, {
            color: '#00ffffff',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '16px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            opacity: '1',
            transition: 'opacity 1.2s ease',
            marginTop: '6px',
            whiteSpace: 'nowrap'
        });

        const bossContainer = document.getElementById('boss-health-container');
        if (bossContainer) {
            bossContainer.appendChild(instruction);
        } else {
            const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
            gameContainer.appendChild(instruction);
        }

        setTimeout(() => {
            instruction.style.opacity = '0';
            setTimeout(() => instruction.remove(), 1400);
        }, 15000);
    }
}

export default MansionLevel6_BattleRoom;
