import GameEnvBackground from "./GameEngine/GameEnvBackground.js";
import FightingPlayer from "./CustomGameClasses/FightingPlayer.js";
import Boss from './CustomGameClasses/Boss.js';
import showDeathScreen from './CustomGameClasses/DeathScreen.js';
import { createBossHealthBar, createPlayerHealthBar, updatePlayerHealthBar } from './CustomGameClasses/HealthBars.js';

class MansionLevel6_BattleRoom {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/mansionGame/bossFloorPattern.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 341, width: 498}
        };

        // --- Player ---
        const sprite_src_mc = path + "/images/mansionGame/spookMcWalk.png";
        const MC_SCALE_FACTOR = 7;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1500,
            ANIMATION_RATE: 100,
            INIT_POSITION: { 
                x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), 
                y: height - (height / MC_SCALE_FACTOR)
            },
            pixels: {height: 2400, width: 3600},
            orientation: {rows: 2, columns: 3},
            down: {row: 1, start: 0, columns: 3},
            downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 0, start: 0, columns: 3},
            right: {row: 1, start: 0, columns: 3},
            up: {row: 1, start: 0, columns: 3},
            upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
            keypress: {up: 87, left: 65, down: 83, right: 68}, // W, A, S, D
            health: 100  // We define the health here
        };

        // Add the Reaper
        const sprite_src_enemy = path + "/images/mansionGame/Reaper.png";
        const sprite_data_enemy = {
            id: 'Reaper',
            greeting: "You feel a dark presence...",
            src: sprite_src_enemy,
            SCALE_FACTOR: 4,
            ANIMATION_RATE: 50,
            pixels: {height: 104, width: 132},
            INIT_POSITION: {x: width / 2, y: height / 2},
            orientation: {rows: 1, columns: 1},
            down: {row: 0, start: 0, columns: 1},
            hitbox: {widthPercentage: 0.4, heightPercentage: 0},
            zIndex: 10,
            isKilling: false, // Flag to prevent multiple kills
            
            // The update method with all functionality inline
            update: function() {
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
                    const dist = Math.sqrt(dx*dx + dy*dy);
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
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    // Hitbox collision - adjust values as needed
                    const collisionThreshold = (player.width * player.hitbox.widthPercentage + 
                                            this.width * this.hitbox.widthPercentage) / 2;
                    
                    if (distance < collisionThreshold) {
                        // Set killing flag to prevent repeated kills
                        this.isKilling = true;
                        // Disable player input/movement without modifying the engine:
                        try {
                            // 'player' is the local variable in this loop
                            if (!player._inputDisabled) {
                                player._inputDisabled = true;

                                // Clear any pressed keys and update velocity
                                try { player.pressedKeys = {}; } catch (e) {}
                                try { if (typeof player.updateVelocityAndDirection === 'function') player.updateVelocityAndDirection(); } catch (e) {}
                                try { if (player.velocity) { player.velocity.x = 0; player.velocity.y = 0; } } catch (e) {}

                                // Replace key handlers with no-ops so bound listeners do nothing
                                try {
                                    if (player.handleKeyDown && !player._origHandleKeyDown) {
                                        player._origHandleKeyDown = player.handleKeyDown;
                                        player.handleKeyDown = function(){};
                                    }
                                    if (player.handleKeyUp && !player._origHandleKeyUp) {
                                        player._origHandleKeyUp = player.handleKeyUp;
                                        player.handleKeyUp = function(){};
                                    }
                                } catch (e) {}

                                // Hide touch controls if present
                                try { if (player.touchControls && typeof player.touchControls.hide === 'function') player.touchControls.hide(); } catch (e) {}
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

        
        // --- Reaper Boss ---
        /*
        const BOSS_SCALE_FACTOR = 2;
        const sprite_src_body = path + "/images/mansionGame/ReaperMainBody.png";
        const sprite_boss_data = {
            id: 'reaper',
            src: sprite_src_body,
            SCALE_FACTOR: BOSS_SCALE_FACTOR,
            STEP_FACTOR: 400,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: Math.floor(width * 0.7), y: Math.floor(height * 0.6)},
            pixels: {height: 300, width: 300},
            orientation: {rows: 1, columns: 1},
            hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
            projectileSpeed: 5,
            attackInterval: 2000,
            projectileTypes: ['FIREBALL', 'ARROW'],
            initialHealth: 1500
        };

        // Reaper Enemy
        const REAPER_SCALE_FACTOR = 2;
        const sprite_reaper_src = path + "/images/mansionGame/ReaperMainBody.png";
        const sprite_reaper_data = {
            id: 'reaperboss',
            src: sprite_reaper_src,
            SCALE_FACTOR: REAPER_SCALE_FACTOR,
            STEP_FACTOR: 800,
            //ANIMATION_RATE: 30,
            INIT_POSITION: {x: width * 0.7, y: height * 0.8},
            pixels: {width: 300, height: 300},
            orientation: {rows: 1, columns: 1},
            hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
        }

        // --- Reaper Arms ---
        const ARM_SCALE_FACTOR = 2;
        const sprite_arm_left_empty = path + "/images/mansionGame/ReaperLeftHandEmpty.png";
        const sprite_arm_left_scythe = path + "/images/mansionGame/ReaperLeftHandScythe.png";
        const sprite_arm_right_empty = path + "/images/mansionGame/ReaperRightHandEmpty.png";
        const sprite_arm_right_scythe = path + "/images/mansionGame/ReaperRightHandScythe.png";

        const leftArmData = {
            id: 'leftArm',
            src: sprite_arm_left_scythe,
            SCALE_FACTOR: ARM_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: sprite_boss_data.INIT_POSITION.x - 50, y: sprite_boss_data.INIT_POSITION.y + 20},
            pixels: {height: 300, width: 300},
            orientation: {rows:1, columns:1},
            hitbox: {widthPercentage: 0.4, heightPercentage: 0.2},
            xOffset: -50,
            yOffset: 20,
            hasWeapon: true,
            emptySrc: sprite_arm_left_empty,
            weaponSrc: sprite_arm_left_scythe
        };

        const rightArmData = {
            id: 'rightArm',
            src: sprite_arm_right_empty,
            SCALE_FACTOR: ARM_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: sprite_boss_data.INIT_POSITION.x + 50, y: sprite_boss_data.INIT_POSITION.y + 20},
            pixels: {height: 300, width: 300},
            orientation: {rows:1, columns:1},
            hitbox: {widthPercentage: 0.4, heightPercentage: 0.2},
            xOffset: 50,
            yOffset: 20,
            hasWeapon: false,
            emptySrc: sprite_arm_right_empty,
            weaponSrc: sprite_arm_right_scythe
        };

        // Test -- add a projectile
        const SCYTHE_SCALE_FACTOR = 4;
        const sprite_scythe_src = path + "/images/mansionGame/fireball.png";
        const sprite_scythe_data = {
            id: 'Scythe',
            src: sprite_scythe_src,
            greeting: "I'm the weapon of the enemy...",
            SCALE_FACTOR: SCYTHE_SCALE_FACTOR,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: width / 2, y: height / 2},
            pixels: {height: 256, width: 256},
            orientation: {rows: 2, columns: 2},
            hitbox: {widthPercentage: 0, heightPercentage: 0},
            down: {row: 0, start: 0, columns: 1},
            // This method will update the scythe
            update: function() {
                // Leave it blank for now
            }
        };
        */

        this.classes = [
            {class: GameEnvBackground, data: image_data_floor},
            {class: FightingPlayer, data: sprite_data_mc},
            // {class: Boss, data: sprite_boss_data},
            // {class: Arm, data: leftArmData},
            // {class: Arm, data: rightArmData},
            //{class: Enemy, data: sprite_reaper_data},
            {class: Boss, data: sprite_data_enemy},
            //{class: Character, data: sprite_scythe_data},
        ];

        // Create health bar when battle room loads
        if (typeof window !== 'undefined' && !window.__mansionLevelEnded) {
            createBossHealthBar();
            createPlayerHealthBar();
        }
        
        // Create instructions (space to attack)
        const container = document.createElement('div');
        container.id = 'instructions-container';
        Object.assign(container.style, {
            position: 'absolute',
            bottom: '80px',  // Moved further down in the battle room
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            width: '60%',
            zIndex: '100'  // Lower z-index to keep it in the battle room
        });
        container.textContent = "WASD to move, SPACE to shoot";
        container.style.color = '#00ffffff';
        container.style.fontFamily = "'Press Start 2P', sans-serif";
        container.style.fontSize = '16px';
        container.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
        gameContainer.appendChild(container);
    }
}

export default MansionLevel6_BattleRoom;