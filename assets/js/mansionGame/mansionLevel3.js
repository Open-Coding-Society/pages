import GameEnvBackground from "./GameEngine/GameEnvBackground.js";
import Player from "./GameEngine/Player.js";
import Npc from './GameEngine/Npc.js';

class MansionLevel3_Restructured {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data for the dungeon escape level
    const image_background = path + "/images/mansionGame/dungeon_lvl3.png"; // Update with actual dungeon background
    const image_data_background = {
        name: 'background',
        greeting: "This is the dark dungeon. Navigate through skeleton enemies to find the golden key and escape!",
        src: image_background,
        pixels: {height: 600, width: 800},
        mode: 'contain',
    };

    // Objective icon sprite data
    const objective_sprite_data = {
        id: 'ObjectiveIcon',
        greeting: "Objective: Find the Golden Skeleton Key at 20,000m!",
        src: path + "/images/gamify/Objective.png",
        SCALE_FACTOR: 2.5,
        STEP_FACTOR: 0,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 300, y: 50 },
        pixels: {height: 315, width: 363},
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 1.0, heightPercentage: 1.0},
        keypress: {}
    };

    // Main character (player) sprite data
    const sprite_src_mc = path + "/images/gamify/spookMcWalk.png";
    const MC_SCALE_FACTOR = 6;
    const sprite_data_mc = {
        id: 'DungeonPlayer',
        greeting: "Navigate carefully through the dungeon!",
        src: sprite_src_mc,
        SCALE_FACTOR: MC_SCALE_FACTOR,
        STEP_FACTOR: 800,
        ANIMATION_RATE: 10,
        INIT_POSITION: { x: 380, y: 520 },
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
        
        // Custom game state for dungeon mechanics
        customGameState: {
            lives: 3,
            score: 0,
            distance: 0,
            speed: 4,
            paused: false,
            hasKey: false,
            gameOver: false,
            deathAnimation: false,
            deathTimer: 0
        },
        
        // Custom update method for dungeon-specific mechanics
        customUpdate: function() {
            if (!this.customGameState.gameOver && !this.customGameState.paused) {
                // Update distance and score
                this.customGameState.distance += this.customGameState.speed;
                
                // Increase difficulty over time
                if (this.customGameState.distance % 2000 < this.customGameState.speed) {
                    this.customGameState.speed = Math.min(10, this.customGameState.speed + 0.03);
                }
                
                // Check win condition
                if (this.customGameState.distance > 20000 && !this.keySpawned) {
                    this.spawnKey();
                }
                
                // Update obstacles
                this.updateObstacles();
            }
        },
        
        spawnKey: function() {
            // Implementation for key spawning logic
            this.keySpawned = true;
        },
        
        updateObstacles: function() {
            // Implementation for obstacle/skeleton management
            // This would handle the skeleton spawning and movement logic
        }
    };

    // Game controller NPC - manages the dungeon game mechanics
    const sprite_data_gamecontroller = {
        id: 'DungeonGameController',
        greeting: "Game Controller: Managing dungeon mechanics",
        src: path + "/images/gamify/invisDoorCollisionSprite.png", // Invisible sprite
        SCALE_FACTOR: 1,
        ANIMATION_RATE: 0,
        pixels: {width: 1, height: 1},
        INIT_POSITION: { x: 0, y: 0 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0, heightPercentage: 0},
        
        // Game mechanics implementation
        gameState: {
            lives: 3,
            score: 0,
            distance: 0,
            speed: 4,
            paused: false,
            hasKey: false,
            gameOver: false,
            obstacles: [],
            spawnTimer: 0,
            spawnInterval: 100,
            keySpawned: false,
            maxSkeletonsPerWave: 1,
            lanes: [100, 200, 300, 400, 500, 600, 700]
        },
        
        update: function() {
            if (!this.gameState.gameOver && !this.gameState.paused) {
                this.updateGameLogic();
                this.spawnObstacles();
                this.updateObstacles();
                this.checkCollisions();
                this.updateUI();
            }
        },
        
        updateGameLogic: function() {
            // Core game progression logic
            this.gameState.distance += this.gameState.speed;
            
            // Increase difficulty
            this.gameState.maxSkeletonsPerWave = Math.min(5, Math.floor(this.gameState.distance / 2000) + 1);
            
            if (this.gameState.spawnInterval > 30) {
                this.gameState.spawnInterval -= 0.8;
            }
            if (this.gameState.speed < 10) {
                this.gameState.speed += 0.03;
            }
        },
        
        spawnObstacles: function() {
            this.gameState.spawnTimer++;
            if (this.gameState.spawnTimer > this.gameState.spawnInterval) {
                // Key spawning logic
                if (!this.gameState.keySpawned && this.gameState.distance > 20000) {
                    if (Math.random() < 0.015) {
                        const randomLane = this.gameState.lanes[Math.floor(Math.random() * this.gameState.lanes.length)];
                        const isFake = Math.random() < 0.3;
                        this.createObstacle(randomLane, -60, !isFake, isFake);
                        if (!isFake) this.gameState.keySpawned = true;
                        this.gameState.spawnTimer = 0;
                        return;
                    }
                }
                
                // Skeleton spawning logic
                const numToSpawn = Math.min(this.gameState.maxSkeletonsPerWave, 
                    Math.floor(Math.random() * this.gameState.maxSkeletonsPerWave) + 1);
                const usedLanes = [];
                
                for (let i = 0; i < numToSpawn; i++) {
                    let randomLane;
                    let attempts = 0;
                    
                    do {
                        randomLane = this.gameState.lanes[Math.floor(Math.random() * this.gameState.lanes.length)];
                        attempts++;
                    } while (usedLanes.includes(randomLane) && attempts < 10);
                    
                    if (!usedLanes.includes(randomLane)) {
                        usedLanes.push(randomLane);
                        this.createObstacle(randomLane, -60 - (i * 100), false, false);
                    }
                }
                
                this.gameState.spawnTimer = 0;
            }
        },
        
        createObstacle: function(x, y, isKey, isFake) {
            this.gameState.obstacles.push({
                x: x,
                y: y,
                width: 50,
                height: 50,
                isKey: isKey || false,
                isFake: isFake || false,
                fakeTimer: 0,
                revealed: false
            });
        },
        
        updateObstacles: function() {
            for (let i = this.gameState.obstacles.length - 1; i >= 0; i--) {
                const obs = this.gameState.obstacles[i];
                obs.y += this.gameState.speed;
                
                if (obs.isFake && !obs.revealed) {
                    obs.fakeTimer++;
                    if (obs.fakeTimer > 80) {
                        obs.revealed = true;
                    }
                }
                
                // Remove obstacles that are off-screen
                if (obs.y > height) {
                    this.gameState.obstacles.splice(i, 1);
                    this.gameState.score += 10;
                }
            }
        },
        
        checkCollisions: function() {
            // This would need to interface with the player sprite
            // Implementation depends on how the game engine handles collision detection
        },
        
        updateUI: function() {
            // Update UI elements - would need to interface with game engine UI system
        },
        
        handlePlayerHit: function() {
            this.gameState.lives--;
            if (this.gameState.lives <= 0) {
                this.gameState.gameOver = true;
                this.showGameOver();
            }
        },
        
        handleKeyCollection: function() {
            this.gameState.hasKey = true;
            this.gameState.score += 500;
            this.gameState.gameOver = true;
            this.showVictory();
        },
        
        showGameOver: function() {
            // Interface with game engine to show game over screen
        },
        
        showVictory: function() {
            // Interface with game engine to show victory screen
        },
        
        restartGame: function() {
            // Reset all game state
            this.gameState = {
                lives: 3,
                score: 0,
                distance: 0,
                speed: 4,
                paused: false,
                hasKey: false,
                gameOver: false,
                obstacles: [],
                spawnTimer: 0,
                spawnInterval: 100,
                keySpawned: false,
                maxSkeletonsPerWave: 1,
                lanes: [100, 200, 300, 400, 500, 600, 700]
            };
        }
    };

    // List of objects definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: Npc, data: objective_sprite_data },
      { class: Player, data: sprite_data_mc },
      { class: Npc, data: sprite_data_gamecontroller }
    ];
  }
}

export default MansionLevel3_Restructured;