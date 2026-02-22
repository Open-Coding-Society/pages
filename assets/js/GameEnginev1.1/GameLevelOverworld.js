import Background from './GameEnvBackground.js';
import Player from './Player.js';
import Npc from './Npc.js';
import GameControl from './GameControl.js';
import GameLevelDesert from './GameLevelDesert.js';
import Creeper from './Creeper.js';

class GameLevelOverworld {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // Background image info
    const image_src_main = `${path}/images/gamify/maine_RPG.png`;
    const image_data_main = {
      name: 'main',
      greeting: "Welcome to the main hub of Overworld.",
      src: image_src_main,
      pixels: { height: 320, width: 480 }
    };

    // Player sprite info and configuration
    const sprite_src_player = `${path}/images/gamify/steve.png`;
    const PLAYER_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Player',
      greeting: "I am Steve.",
      src: sprite_src_player,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) - 40 }, 
      pixels: { height: 1500, width: 600 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },

      velocity: { x: 5, y: 5 },

      // Bounds checking function for player movement inside canvas
      canMoveTo(newX, newY, canvasWidth, canvasHeight) {
        const leftBound = 0;
        const rightBound = canvasWidth - (this.pixels.width / this.SCALE_FACTOR);
        const topBound = 0;
        const bottomBound = canvasHeight - (this.pixels.height / this.SCALE_FACTOR);
        if (newX < leftBound || newX > rightBound) return false;
        if (newY < topBound || newY > bottomBound) return false;
        return true;
      }
    };

    // Creeper sprite info with movement and animation logic
    const sprite_src_creeper = `${path}/images/gamify/creepa.png`;
    const sprite_greet_creeper = "KABOOM!!";
    const sprite_data_creeper = {
      id: 'Creeper',
      greeting: sprite_greet_creeper,
      src: sprite_src_creeper,
      SCALE_FACTOR: 4,
      ANIMATION_RATE: 25,
      pixels: { height: 1200, width: 1600 },
      INIT_POSITION: { x: 100, y: 100 },
      orientation: { rows: 1, columns: 2 },
      down: { row: 0, start: 0, columns: 2 },
      right: { row: 0, start: 0, columns: 2 },
      left: { row: 0, start: 0, columns: 2 },
      up: { row: 0, start: 0, columns: 2 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

      collisionEvents: [],
      hasExploded: false,
      isColliding: false,
      lastCollisionCheck: 0,
      
      resize() {
      },

      walkingArea: {
        xMin: width / 10,
        xMax: (width * 5) / 7,
        yMin: height / 4,
        yMax: (height * 8) / 15
      },
      speed: 10,
      direction: { x: 1, y: 1 },

      sound: new Audio(`${path}/assets/audio/creeper.mp3`),

      explode() {
        if (this.hasExploded) return;
        this.hasExploded = true;

        console.log("CREEPER EXPLODING - CALLING Creeper.js EXPLOSION!"); 

        this.speed = 0;

        const creeperObject = gameEnv?.gameObjects?.find(obj => obj.spriteData?.id === 'Creeper');
        if (creeperObject) {
          creeperObject.hasExploded = true;
          creeperObject.isExploding = true;
          
          creeperObject.velocity.x = 0;
          creeperObject.velocity.y = 0;
          
          creeperObject.startSequentialExplosion();
        } else {
          console.warn("Could not find Creeper object - falling back to local explosion");
          this.showExplosionMessageAndRestart();
        }
      },

      showExplosionMessageAndRestart() {
        console.log("Showing explosion message and preparing restart");
        
        const explosionMessage = document.createElement('div');
        explosionMessage.innerHTML = 'BOOM! Game Over!<br>Restarting...';
        explosionMessage.id = 'creeperExplosionMessage';
        Object.assign(explosionMessage.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '10px',
          zIndex: '10000',
          fontFamily: 'Arial, sans-serif',
          animation: 'fadeInExplosion 0.5s ease-in'
        });
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeInExplosion {
            from { 
              opacity: 0; 
              transform: translate(-50%, -50%) scale(0.5); 
            }
            to { 
              opacity: 1; 
              transform: translate(-50%, -50%) scale(1); 
            }
          }
        `;
        document.head.appendChild(style);
        
        const existingMessage = document.getElementById('creeperExplosionMessage');
        if (existingMessage) {
          existingMessage.remove();
        }
        
        document.body.appendChild(explosionMessage);
        
        setTimeout(() => {
          console.log("Restarting game...");
          window.location.reload();
        }, 2000);
      },

      checkPlayerCollision(player) {
        if (this.hasExploded) return false;

        const now = Date.now();
        if (now - this.lastCollisionCheck < 100) return false;
        this.lastCollisionCheck = now;

        let playerPos = null;
        let playerWidth = 0;
        let playerHeight = 0;
        
        const playerElement = document.getElementById('Player');
        if (playerElement) {
          const rect = playerElement.getBoundingClientRect();
          const gameCanvas = document.querySelector('canvas');
          const canvasRect = gameCanvas ? gameCanvas.getBoundingClientRect() : { left: 0, top: 0 };
          
          playerPos = {
            x: rect.left - canvasRect.left,
            y: rect.top - canvasRect.top
          };
          playerWidth = rect.width;
          playerHeight = rect.height;
        } else {
          playerPos = player.position || player.INIT_POSITION || { x: 0, y: 0 };
          const playerPixels = player.pixels || { width: 600, height: 1500 };
          const playerScale = player.SCALE_FACTOR || 5;
          playerWidth = playerPixels.width / playerScale;
          playerHeight = playerPixels.height / playerScale;
        }

        const creeperWidth = this.pixels.width / this.SCALE_FACTOR;
        const creeperHeight = this.pixels.height / this.SCALE_FACTOR;
        
        const collisionMargin = 40;
        const creeperLeft = this.INIT_POSITION.x + collisionMargin;
        const creeperRight = this.INIT_POSITION.x + creeperWidth - collisionMargin;
        const creeperTop = this.INIT_POSITION.y + collisionMargin;
        const creeperBottom = this.INIT_POSITION.y + creeperHeight - collisionMargin;
        
        const playerLeft = playerPos.x;
        const playerRight = playerPos.x + playerWidth;
        const playerTop = playerPos.y;
        const playerBottom = playerPos.y + playerHeight;
        
        const isOverlapping = (
          creeperLeft < playerRight && 
          creeperRight > playerLeft && 
          creeperTop < playerBottom && 
          creeperBottom > playerTop
        );
        
        if (isOverlapping && !this.isColliding) {
          console.log("NEW COLLISION DETECTED - STARTING SEQUENTIAL EXPLOSION!");
          
          this.isColliding = true;
          this.explode();
          return true;
        } 
        else if (!isOverlapping && this.isColliding) {
          console.log("Player moved away from creeper");
          this.isColliding = false;
        }
        
        return false;
      },

      updatePosition() {
        if (this.hasExploded) return;

        this.INIT_POSITION.x += this.direction.x * this.speed;
        this.INIT_POSITION.y += this.direction.y * this.speed;

        if (this.INIT_POSITION.x <= this.walkingArea.xMin) {
          this.INIT_POSITION.x = this.walkingArea.xMin;
          this.direction.x = 1;
        }
        if (this.INIT_POSITION.x >= this.walkingArea.xMax) {
          this.INIT_POSITION.x = this.walkingArea.xMax;
          this.direction.x = -1;
        }
        if (this.INIT_POSITION.y <= this.walkingArea.yMin) {
          this.INIT_POSITION.y = this.walkingArea.yMin;
          this.direction.y = 1;
        }
        if (this.INIT_POSITION.y >= this.walkingArea.yMax) {
          this.INIT_POSITION.y = this.walkingArea.yMax;
          this.direction.y = -1;
        }

        const spriteElement = document.getElementById(this.id);
        if (spriteElement) {
          spriteElement.style.transform = this.direction.x === -1 ? "scaleX(-1)" : "scaleX(1)";
          spriteElement.style.left = `${this.INIT_POSITION.x}px`;
          spriteElement.style.top = `${this.INIT_POSITION.y}px`;
        }
      },

      isAnimating: false,
      playAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const spriteElement = document.getElementById(this.id);
        if (!spriteElement) {
          this.isAnimating = false;
          return;
        }

        this.sound.play();

        spriteElement.style.transition = 'filter 1s ease-in-out';
        spriteElement.style.filter = 'brightness(3) saturate(0)';

        setTimeout(() => {
          spriteElement.style.filter = 'none';
          setTimeout(() => {
            spriteElement.style.transition = '';
            this.isAnimating = false;
          }, 1000);
        }, 1000);
      }
    };

    class PlatformerMini {
      constructor(gameEnv) {
        this.gameEnv = gameEnv; 
        this.isRunning = false;

        this.enemyDefeated = false;
        this.enemyDying = false; // Add flag to track if enemy is in dying animation

        // Create and initialize the canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth; 
        this.canvas.height = window.innerHeight; 
        this.ctx = this.canvas.getContext('2d'); 

        // Load background image
        this.backgroundImage = new Image();
        this.backgroundImage.src = `${gameEnv.path}/images/gamify/mcbg.jpg`; 

        
        // Load collectible item image
        this.collectibleImage = new Image();
        this.collectibleImage.src = `${gameEnv.path}/images/gamify/sword.png`; 

        // Load player image
        this.playerImage = new Image();
        this.playerImage.src = `${gameEnv.path}/images/gamify/stevelol.png`; 

        // Player properties
        this.playerX = 50; 
        this.playerY = this.groundY - 50; 
        this.playerWidth = 85; 
        this.playerHeight = 85; 
        this.playerSpeedX = 0;
        this.playerSpeedY = 0;
        this.gravity = 0.5;
        this.groundY = 700;
        this.keysPressed = {};
        this.animationFrameId = null;
        this.onExit = null;
        this.canJump = true;
        this.playerDirection = 1;

        this.enemyImage = new Image();
        this.enemyImage.src = `${gameEnv.path}/images/gamify/mzombie.png`;

        const platformStartX = this.canvas.width / 2 + 50;
        const platformEndX = this.canvas.width / 2 + 410;
        const platformMiddleX = (platformStartX + platformEndX) / 2;
        this.enemyX = platformMiddleX - 50;
        this.enemyY = this.groundY - 400 - 100;
        this.enemyWidth = 100;
        this.enemyHeight = 100;
        this.enemySpeedX = 1;
        this.enemyDirection = -1;

        this.npcImage = new Image();
        this.npcImage.src = `${gameEnv.path}/images/gamify/mchicken.png`;
        this.npcWidth = 50;
        this.npcHeight = 50;
        this.npcX = this.canvas.width - 150;
        this.npcY = this.canvas.height - 575;
      }

      loadImages() {
        // Set up error handlers and onload handlers for all images
        const images = [
          this.backgroundImage,
          this.collectibleImage, 
          this.playerImage,
          this.enemyImage,
          this.npcImage,
          ...this.platformImages
        ];

        images.forEach((img, index) => {
          if (img) {
            img.onerror = () => {
              console.warn(`Image failed to load: ${img.src}`);
              img.loadFailed = true;
            };
            
            img.onload = () => {
              console.log(`Image loaded successfully: ${img.src}`);
              img.loadFailed = false;
            };
          }
        });
      }

      start() {
        if (this.isRunning) return;
        this.isRunning = true;

        pauseRpg();

        // Reset player properties to ensure a clean start
        this.playerX = 50;
        this.playerY = this.groundY - 50;
        this.playerSpeedX = 0;
        this.playerSpeedY = 0;
        this.keysPressed = {};
        this.canJump = true;
        this.itemCollected = false;

        // Initialize platform images with error handling
        // (omitted for brevity in this shim)
      }

    }

    const platformerMini = new PlatformerMini(gameEnv);

    // If the page set the autoStartPlatformer flag, start the mini-game immediately
    try {
      const shouldAuto = (typeof localStorage !== 'undefined') ? localStorage.getItem('autoStartPlatformer') : null;
      if (shouldAuto === 'true') {
        setTimeout(() => {
          try {
            platformerMini.start();
            try { localStorage.removeItem('autoStartPlatformer'); } catch (e) { /* noop */ }
          } catch (err) {
            console.warn('autoStartPlatformer failed to start', err);
          }
        }, 300);
      }
    } catch (e) {
      // ignore storage errors
    }

    let isRpgPaused = false;
    let creeperMovementInterval, creeperAnimationInterval;

    const pauseRpg = () => {
      if (isRpgPaused) return;
      isRpgPaused = true;

      clearInterval(creeperMovementInterval);
      clearInterval(creeperAnimationInterval);
    };

    const resumeRpg = () => {
      if (!isRpgPaused) return;
      isRpgPaused = false;

      // Restart creeper intervals
      creeperMovementInterval = setInterval(() => {
        sprite_data_creeper.updatePosition();
      }, 100);

      creeperAnimationInterval = setInterval(() => {
        sprite_data_creeper.playAnimation();
      }, 5000);
    };

    creeperMovementInterval = setInterval(() => {
      sprite_data_creeper.updatePosition();
    }, 100);

    creeperAnimationInterval = setInterval(() => {
      sprite_data_creeper.playAnimation();
    }, 5000);

    // Minimal class list for Overworld: background and player.
    this.classes = [
      { class: Background, data: image_data_main },
      { class: Player, data: sprite_data_player }
    ];
  }
}

export default GameLevelOverworld;
