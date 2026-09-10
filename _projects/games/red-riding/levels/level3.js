// level3.js - Red Riding Hood Level 3: The Confrontation
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import ShooterPlayer from './ShooterPlayer.js';
import Enemy from '@assets/js/GameEnginev1.1/essentials/Enemy.js';
import HitMarker from './HitMarker.js';
import Explosion from './Explosion.js';
import Npc from './enpeecee.js';

class GameLevelRedRidingHood3 {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        // Background data
        const image_src_forest = gameEnv.path + "/images/projects/red-riding/lrrh-lvl3-bg-clipped.png"; // Using clipped background
        const image_data_forest = {
            name: 'forest',
            greeting: "Level 3: Dominate him Baka! Press Q to shoot your heavy metal!",
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
            src: gameEnv.path + "/images/projects/red-riding/Finalred.png",
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

          // Updated Wolf Enemy Data with wolffff.png
       const wolfScale = 3;
        const wolfPixels = { height: 395, width: 632 };
        
        const enemyData = {
            id: 'Wolf',
            greeting: "The Wolf!",
            src: gameEnv.path + "/images/projects/red-riding/wolfff.png",
            SCALE_FACTOR: wolfScale,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            // Positioned in the bottom-left corner
            INIT_POSITION: { x: 150, y: 400 }, 
            pixels: wolfPixels,
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            // Smaller hitbox than the sprite (85% of actual size)
            collisionWidth: wolfPixels.width * wolfScale * 0.85,
            collisionHeight: wolfPixels.height * wolfScale * 0.85,
            hitbox: { widthPercentage: 0.85, heightPercentage: 0.85 },
            hp: 5 // Give the wolf some health points to make the fight last a bit longer
        };

        this.enemy = new Enemy(enemyData, gameEnv);

        this.enemy.hp = enemyData.hp || 5; // Set initial health
        this.enemy.takeDamage = function(amount) {
            this.hp -= amount;
            console.log("Wolf hit! Remaining HP:", this.hp);
        };

        this.enemyDefeated = false;

        // Create Grandma NPC with dynamic dialogue based on wolf status
        const grandmaData = {
            id: 'Grandma',
            src: gameEnv.path + "/images/projects/red-riding/lrrh-lvl3-grandma.png",
            SCALE_FACTOR: 6, // Shrink canvas (ie grandma and interaction physical box)
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 50, y: 150 },
            pixels: { height: 480, width: 480 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            interactionRadius: 400, // Interaction area (now half the previous size)
            dialogues: ["WHAT ARE YOU STANDING AROUND FOR? GO KILL that WOLF that barged into MY HOUSE! WITH THE RIFLE I so courageusly gave to you dear-y <3"],
            // Use reaction property to trigger dialogue on collision
            reaction: function() {
                if (!this.grandma) this.grandma = grandmaRef;
                if (this.grandma && this.grandma.showReactionDialogue) {
                    // Update dialogue based on wolf defeat status
                    if (this.enemyDefeated) {
                        this.grandma.dialogueSystem.dialogues = ["Now, that's the girl I partially raised!!!"];
                    } else {
                        this.grandma.dialogueSystem.dialogues = ["WHAT ARE YOU STANDING AROUND FOR? GO KILL that WOLF that barged into MY HOUSE! WITH THE RIFLE I so courageusly gave to you dear-y <3"];
                    }
                    this.grandma.showReactionDialogue();
                }
            }.bind(this)
        };

        this.grandma = new Npc(grandmaData, gameEnv);
        const grandmaRef = this.grandma;

        // Set up classes array for GameLevel system
        this.classes = [
            { class: GameEnvBackground, data: image_data_forest },
            { class: ShooterPlayer, data: sprite_data_red },
            { class: Enemy, data: enemyData },
            { class: Npc, data: grandmaData }
        ];

        // Instructions
        this.showInstructions();
    }

    update() {
        if (this.enemyDefeated) return;

        // Get player and enemy from game objects (created by GameLevel system)
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof ShooterPlayer);
        const enemy = this.gameEnv.gameObjects.find(obj => obj instanceof Enemy);

        if (!player || !enemy) return;

        // This ensures that even if the engine created a new enemy, it knows how to take damage
        if (typeof enemy.takeDamage !== 'function') {
            enemy.hp = 5;
            enemy.takeDamage = function(amount) {
                this.hp -= amount;
                console.log("Wolf hit! Remaining HP:", this.hp);
            };
        }
        // -------------------------------------

        // 2. Manual Bullet Fix
        if (player.bullets) {
            player.bullets.forEach(bullet => {
                bullet.update();
                bullet.draw();
            });
        }


        // Block player movement if overlapping wolf's sprite area
        const playerBox = {
            x: player.position.x,
            y: player.position.y,
            width: player.width,
            height: player.height
        };
        const wolfBox = {
            x: enemy.x + enemy.width * 0.15,  // Offset by 15% on each side (shrink by 30% total)
            y: enemy.y + enemy.height * 0.15, // Offset by 15% on top and bottom (shrink by 30% total)
            width: enemy.width * 0.7,          // Use only 70% of width
            height: enemy.height * 0.7         // Use only 70% of height
        };

        // Check bullet collisions with enemy
        player.bullets.forEach(bullet => {
            if (bullet.checkCollision(enemy)) {
                // Damage the enemy
                enemy.takeDamage(1);
                bullet.destroy(); // Bullet vanishes on hit

                // Show hit marker for 0.5s after every hit
                const hitMarker = new HitMarker(
                    enemy.x + enemy.width / 2, // Center of enemy
                    enemy.y, // Top of enemy
                    this.gameEnv
                );
                this.gameEnv.gameObjects.push(hitMarker);

                // Check if enemy is defeated
                if (enemy.hp <= 0) {
                    this.enemyDefeated = true;
                    // Store enemy position before destroying
                    const enemyX = enemy.x;
                    const enemyY = enemy.y;
                    const enemyWidth = enemy.width;
                    const enemyHeight = enemy.height;
                    
                    // Show explosion for 1s
                    const explosion = new Explosion(
                        enemyX + enemyWidth / 2,
                        enemyY + enemyHeight / 2,
                        this.gameEnv
                    );
                    this.gameEnv.gameObjects.push(explosion);

                    // After 1s, transform wolf into grandma and show message
                    setTimeout(() => {
                        // Add grandma sprite at stored wolf's position
                        const grandma = new Image();
                        grandma.src = this.gameEnv.path + '/images/projects/red-riding/lrrh-lvl3-grandma.png';
                        const ctx = this.gameEnv.ctx;
                        ctx.drawImage(
                            grandma,
                            enemyX,
                            enemyY,
                            enemyWidth,
                            enemyHeight
                        );
                        // Show message and link
                        this.showGrandmaVictory();
                    }, 1000);

                    enemy.destroy(); // Remove wolf sprite
                }
            }
        });
        
        // Check if player is within wolf's collision box for pushback
        if (
            playerBox.x < wolfBox.x + wolfBox.width &&
            playerBox.x + playerBox.width > wolfBox.x &&
            playerBox.y < wolfBox.y + wolfBox.height &&
            playerBox.y + playerBox.height > wolfBox.y
        ) {
            // Push player back out of wolf's smaller collision area
            if (player.velocity.x > 0) player.position.x = wolfBox.x - playerBox.width;
            else if (player.velocity.x < 0) player.position.x = wolfBox.x + wolfBox.width;
            if (player.velocity.y > 0) player.position.y = wolfBox.y - playerBox.height;
            else if (player.velocity.y < 0) player.position.y = wolfBox.y + wolfBox.height;
        }
    }

    showInstructions() {
        console.log("=== LEVEL 3: FACE THE WOLF ===");
        console.log("WASD - Move Red Riding Hood");
        console.log("Q - Shoot bullets");
        console.log("Defeat the wolf in the upper middle!");
        console.log("============================");
    }


   showGrandmaVictory() {
        const message = document.createElement('div');
        message.id = 'victory-popup';
        message.style.position = 'absolute';
        message.style.top = '40%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'rgba(255, 225, 159, 0.95)';
        message.style.border = '4px solid #b00';
        message.style.padding = '32px';
        message.style.borderRadius = '16px';
        message.style.fontSize = '1.5em';
        message.style.textAlign = 'center';
        message.style.zIndex = 1000;
        message.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        
        message.innerHTML = `
            <h2 style="color:white; margin-top:0;">Victory!</h2>
            <p style="color:#b00 !important;">Good job my girl! These old wolfies have gone rampant this season. Now you said you have some cookies?<br><br></p>
            <button onclick="location.reload()" style="padding:12px 24px; font-size:18px; cursor:pointer; background:#b00; color:white; border:none; border-radius:8px; font-weight:bold;">Play Again</button>
        `;
        document.body.appendChild(message);
    }

    resize() {
        // GameLevel system handles resizing of background, player, and enemy
    }

    destroy() {
        // GameLevel system handles destroying background, player, and enemy
    }
}

export default GameLevelRedRidingHood3;