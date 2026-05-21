// level4.js - Red Riding Hood Level 4: Shooting Minigame
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import ShooterPlayer from './ShooterPlayer.js';
import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import HitMarker from './HitMarker.js';
import Explosion from './Explosion.js';

class GameLevelRedRidingHood4 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Clean up any leftover victory popup from level 3
        const existingPopup = document.getElementById('victory-popup');
        if (existingPopup && existingPopup.parentNode) {
            existingPopup.remove();
        }

        // Background data
        const image_src_forest = gameEnv.path + "/images/projects/red-riding/lrrh-lvl3-bg-clipped.png";
        const image_data_forest = {
            name: 'forest',
            greeting: "Level 4: Wolf Extermination! Press Q to shoot!",
            src: image_src_forest,
            pixels: { height: 580, width: 1038 }
        };

        // Create background
        this.background = new GameEnvBackground(image_data_forest, gameEnv);

        // Player data - using ShooterPlayer
        const sprite_src_red = gameEnv.path + "/images/projects/red-riding/Finalred.png";
        const sprite_data_red = {
            id: 'RedRidingHood',
            greeting: "Red Riding Hood - Press Q to shoot!",
            src: sprite_src_red,
            SCALE_FACTOR: 6,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: width / 2 - 50, y: height - 100 },
            pixels: { height: 144, width: 192 },
            orientation: { rows: 3, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 },
            shootCooldown: 500
        };

        // Create shooter player
        this.player = new ShooterPlayer(sprite_data_red, gameEnv);

        // Minigame state
        this.score = 0;
        this.timeLeft = 60; // 60 seconds
        this.gameOver = false;
        this.enemies = [];
        this.enemySpawnRate = 2000; // Spawn every 2 seconds
        this.enemyLifetime = 5000; // Stay for 5 seconds
        this.lastSpawnTime = Date.now();

        // Score display
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.style.position = 'absolute';
        this.scoreDisplay.style.bottom = '20px';
        this.scoreDisplay.style.right = '20px';
        this.scoreDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
        this.scoreDisplay.style.color = 'beige';
        this.scoreDisplay.style.padding = '10px';
        this.scoreDisplay.style.borderRadius = '5px';
        this.scoreDisplay.style.fontSize = '36px';
        this.scoreDisplay.style.fontWeight = 'bold';
        this.scoreDisplay.style.zIndex = '1000';
        this.scoreDisplay.textContent = 'Wolves Eliminated: 0';
        this.gameEnv.canvas.parentNode.appendChild(this.scoreDisplay);

        // Secret level banner
        this.secretBanner = document.createElement('div');
        this.secretBanner.id = 'secret-level-banner';
        this.secretBanner.style.position = 'absolute';
        this.secretBanner.style.top = '100px';
        this.secretBanner.style.left = '50%';
        this.secretBanner.style.transform = 'translateX(-50%)';
        this.secretBanner.style.background = 'rgba(0, 0, 0, 0.7)';
        this.secretBanner.style.color = 'red';
        this.secretBanner.style.padding = '10px 18px';
        this.secretBanner.style.borderRadius = '6px';
        this.secretBanner.style.fontSize = '32px';
        this.secretBanner.style.fontWeight = 'bold';
        this.secretBanner.style.zIndex = '1000';
        this.secretBanner.textContent = 'SECRET LEVEL 4: WOLF SHOOTING MINIGAME PRESS Q TO SHOOT';
        document.body.appendChild(this.secretBanner);
        setTimeout(() => {
            if (this.secretBanner && this.secretBanner.parentNode) {
                this.secretBanner.remove();
            }
        }, 10000);

        // Timer display
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.style.position = 'absolute';
        this.timerDisplay.style.bottom = '20px';
        this.timerDisplay.style.left = '20px';
        this.timerDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
        this.timerDisplay.style.color = 'beige';
        this.timerDisplay.style.padding = '10px';
        this.timerDisplay.style.borderRadius = '5px';
        this.timerDisplay.style.fontSize = '36px';
        this.timerDisplay.style.fontWeight = 'bold';
        this.timerDisplay.style.zIndex = '1000';
        this.timerDisplay.textContent = 'Time: 60';
        this.gameEnv.canvas.parentNode.appendChild(this.timerDisplay);


        // Set up classes array for GameLevel system
        this.classes = [
            { class: GameEnvBackground, data: image_data_forest },
            { class: ShooterPlayer, data: sprite_data_red }
        ];

        // Timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = `Time: ${this.timeLeft}`;
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        // Instructions
        this.showInstructions();
    }

    update() {
        if (this.gameOver) return;

        // Get player from game objects (created by GameLevel system)
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof ShooterPlayer);
        if (!player) return;

        if (player.bullets) {
            player.bullets.forEach(bullet => {
                bullet.update(); 
                bullet.draw();   
            });
        }

        // Spawn enemies every 3 seconds
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime > this.enemySpawnRate) {
            this.spawnEnemy();
            this.lastSpawnTime = currentTime;
        }

        // Update enemies and remove expired ones
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            // Remove enemy after 5 seconds if not shot
            if (currentTime - enemy.spawnTime > this.enemyLifetime) {
                enemy.destroy();
                this.enemies.splice(index, 1);
            }
        });

        // Check bullet collisions with enemies
        player.bullets.forEach(bullet => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (bullet.checkCollision(enemy)) {
                    // Create hit marker at enemy position
                    const hitMarker = new HitMarker(
                        enemy.x + enemy.width / 2, // Center of enemy
                        enemy.y, // Top of enemy
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(hitMarker);

                    // Create explosion at enemy position
                    const explosion = new Explosion(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2,
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(explosion);

                    // Enemy defeated!
                    bullet.destroy();
                    enemy.destroy();
                    this.enemies.splice(enemyIndex, 1);
                    this.score++;
                    this.scoreDisplay.textContent = `Wolves Eliminated: ${this.score}`;
                }
            });
        });
    }

    spawnEnemy() {
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        // Random position (avoid bottom area where player is)
        const x = Math.random() * (width - 100);
        const y = Math.random() * (height - 200); // Keep above player area

        const wolfScale = 3;
        const wolfPixels = { height: 395, width: 632 };

        const enemyData = {
            id: `Wolf-${Date.now()}`,
            greeting: "Wolf!",
            src: this.gameEnv.path + "/images/projects/red-riding/wolfff.png",
            SCALE_FACTOR: wolfScale,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: x, y: y },
            pixels: wolfPixels,
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            // Force the hitbox to match the actual pixel rectangle scaled
            collisionWidth: wolfPixels.width * wolfScale,
            collisionHeight: wolfPixels.height * wolfScale,
            hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
            hp: 1 // 1 HP, 1 bullet = 1 heart point
        };

        const enemy = new Enemy(enemyData, this.gameEnv);
        enemy.spawnTime = Date.now();
        this.enemies.push(enemy);
    }

    endGame() {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        
        // Show first message
        this.showFirstMessage();
    }
// loves and kisses
    showFirstMessage() {
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'linear-gradient(135deg, #2d0a0a, #6b1a1a)';
        message.style.border = '4px solid #ff4444';
        message.style.borderRadius = '20px';
        message.style.padding = '40px 50px';
        message.style.textAlign = 'center';
        message.style.zIndex = '99999';
        message.style.boxShadow = '0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,0,0,0.3)';
        message.style.maxWidth = '600px';
        
        message.innerHTML = `
            <div style="color: #ffcccc; font-size: 32px; font-weight: normal; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                WOLF EXTERMINATION COMPLETE
            </div>
            <div style="color: #ffcccc; font-size: 24px; font-family: 'Courier New', monospace; line-height: 1.8; margin-bottom: 25px;">
                YOU ELIMINATED ${this.score} WOLVES! CONGRATULATIONS
            </div>
            <button id="firstContinueBtn" style="
                background: #ff2222;
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 18px;
                font-weight: 900;
                font-family: 'Courier New', monospace;
                border-radius: 10px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 2px;
                box-shadow: 0 0 15px rgba(255,0,0,0.5);
            ">Continue →</button>
        `;
        
        document.body.appendChild(message);
        
        const btn = document.getElementById('firstContinueBtn');
        if (btn) {
            btn.onclick = () => {
                message.remove();
                this.showSecondMessage();
            };
        }
    }

    showSecondMessage() {
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'linear-gradient(135deg, #2d0a0a, #6b1a1a)';
        message.style.border = '4px solid #ff4444';
        message.style.borderRadius = '20px';
        message.style.padding = '40px 50px';
        message.style.textAlign = 'center';
        message.style.zIndex = '99999';
        message.style.boxShadow = '0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,0,0,0.3)';
        message.style.maxWidth = '700px';
        
        message.innerHTML = `
            <div style="color: #ffcccc; font-size: 28px; font-weight: normal; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                Now then,
            </div>
            <div style="color: #ffcccc; font-size: 18px; font-family: 'Courier New', monospace; line-height: 1.8; margin-bottom: 25px;">
                wow incredible, even after that first wolf encounter, you were still able to take down the rest of the raid! Now you'll really be able to enjoy those cookies!!! 
            </div>
            <button id="secondContinueBtn" style="
                background: #ff2222;
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 18px;
                font-weight: 900;
                font-family: 'Courier New', monospace;
                border-radius: 10px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 2px;
                box-shadow: 0 0 15px rgba(255,0,0,0.5);
            ">End Game ✕</button>
        `;
        
        document.body.appendChild(message);
        
        const btn = document.getElementById('secondContinueBtn');
        if (btn) {
            btn.onclick = () => {
                message.remove();
                this.finishGame();
            };
        }
    }

    finishGame() {
        // Game ends here - could show credits or return to menu
        console.log(`🎯 GAME COMPLETE! Final Score: ${this.score} wolves eliminated!`);
        // For now, just reload to restart
        location.reload();
    }

    showInstructions() {
        console.log("=== LEVEL 4: WOLF EXTERMINATION ===");
        console.log("WASD - Move Red Riding Hood");
        console.log("Q - Shoot bullets (1 bullet = 1 HP)");
        console.log("Wolves spawn every 2 seconds and stay for 5 seconds");
        console.log("Each wolf has 1 HP - eliminate as many as possible!");
        console.log("Time: 60 seconds");
        console.log("Score counter in bottom right shows eliminated wolves");
        console.log("Timer in bottom left shows remaining time");
        console.log("================================");
    }

    resize() {
        // GameLevel system handles resizing of background and player
    }

    destroy() {
        clearInterval(this.timerInterval);
        this.enemies.forEach(enemy => enemy.destroy());
        // Remove score display
        if (this.scoreDisplay && this.scoreDisplay.parentNode) {
            this.scoreDisplay.remove();
        }
        // Remove secret banner when level is destroyed
        if (this.secretBanner && this.secretBanner.parentNode) {
            this.secretBanner.remove();
        }
        // Remove timer display
        if (this.timerDisplay && this.timerDisplay.parentNode) {
            this.timerDisplay.remove();
        }
        // GameLevel system handles destroying background and player
    }
}

export default GameLevelRedRidingHood4;