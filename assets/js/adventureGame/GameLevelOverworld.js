import Background from './GameEngine/Background.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import GameControl from './GameEngine/GameControl.js';
import Creeper from './GameEngine/Creeper.js';
import Game from './Game.js';
import GameLevelDesert from './GameLevelDesert.js';

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
        this.playerY = 600; 
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
        this.platformImages = [
          new Image(),
          new Image(),
          new Image()
        ];
        this.platformImages[0].src = `${path}/images/gamify/grassblock.jpg`;
        this.platformImages[1].src = `${path}/images/gamify/grassblock.jpg`;
        this.platformImages[2].src = `${path}/images/gamify/grassblock.jpg`;

        // Load all images with error handling
        this.loadImages();

        // Create canvas overlay for mini platformer
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'platformerMiniCanvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Object.assign(this.canvas.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '10000',
          backgroundColor: 'rgba(135, 206, 235, 1)'
        });
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);

        // Show instructions at the start of the platformer
        this.showDialogue(
          "Oh no! It seems that there is a chicken in danger!\n\nPress 'E' to talk\nPress 'C' to collect",
          "Instructions"
        );

        this.loop();
      }

      stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);

        if (this.canvas?.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
          this.canvas = null;
          this.ctx = null;
        }

        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }

        this.playerX = 50;
        this.playerY = this.groundY - 50;
        this.playerSpeedX = 0;
        this.playerSpeedY = 0;
        this.canJump = true;

        this.showDeathScreen();
      }

      showDeathScreen() {
        const deathScreen = document.createElement('div');
        deathScreen.id = 'deathScreen';
        Object.assign(deathScreen.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '10001',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        });

        // Add death message
        const message = document.createElement('h1');
        message.textContent = 'You have died!';
        message.style.marginBottom = '20px';
        deathScreen.appendChild(message);

        // Add button to close death screen and resume RPG
        const button = document.createElement('button');
        button.textContent = 'Return to RPG';
        Object.assign(button.style, {
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        });
        button.addEventListener('click', () => {
          document.body.removeChild(deathScreen);
          if (this.onExit) this.onExit(); // Fixed: Added missing opening parenthesis
        });
        deathScreen.appendChild(button);

        document.body.appendChild(deathScreen);
      }

      showDialogue(message, title, callback) {
        // Create dialogue overlay
        const dialogueOverlay = document.createElement('div');
        Object.assign(dialogueOverlay.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '10001',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        });

        // Add title
        const titleElement = document.createElement('h1');
        titleElement.textContent = title;
        titleElement.style.marginBottom = '20px';
        dialogueOverlay.appendChild(titleElement);

        // Add message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.marginBottom = '20px';
        dialogueOverlay.appendChild(messageElement);

        // Add button to execute callback
        const button = document.createElement('button');
        button.textContent = 'Continue.';
        Object.assign(button.style, {
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        });
        button.addEventListener('click', () => {
          document.body.removeChild(dialogueOverlay);
          if (callback) callback();
        });
        dialogueOverlay.appendChild(button);

        document.body.appendChild(dialogueOverlay);
      }

      returnToDesert() {
        if (!this.isRunning) return;
        this.isRunning = false;

        // Clean up event listeners and canvas
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyDownHandler);

        if (this.canvas?.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
          this.canvas = null;
          this.ctx = null;
        }

        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }

        const desertLevel = new GameLevelDesert(this.gameEnv);
        desertLevel.start();
      }

      keyDownHandler = (e) => {
        this.keysPressed[e.code] = true;

        // Handle interaction with NPC when 't' is pressed
        if (e.code === 'KeyE') {
          if (
            this.playerX + 50 > this.npcX && 
            this.playerX < this.npcX + this.npcWidth && 
            this.playerY + 50 > this.npcY && 
            this.playerY < this.npcY + this.npcHeight 
          ) {
            if (!this.enemyDefeated) {
              this.showDialogue(
                "BAWK! I'm too scared to move because of that monster over there! ( You have to defeat it first! )",
                "Scared NPC"
              );
            } else {
              this.showDialogue(
                "Hooray! You have slain the monster! Let's get out of here.. ( You will now be transported back to the Desert! )",
                "Grateful NPC",
                () => {
                  window.location.reload();
                }
              );
            }
          }
        }

        if (e.code === 'Escape') {
          this.stop();
        }
      }

      keyUpHandler = (e) => {
        this.keysPressed[e.code] = false;
      }

      loop = () => {
        this.update();
        this.draw();
        if (this.isRunning) {
          this.animationFrameId = requestAnimationFrame(this.loop);
        }
      }

      update() {
        // Handle player movement based on key presses
        if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) {
          this.playerSpeedX = -5;
          this.playerDirection = -1;
        } else if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) {
          this.playerSpeedX = 5;
          this.playerDirection = 1;
        } else {
          this.playerSpeedX = 0;
        }

        // Handle jumping
        if ((this.keysPressed['KeyW'] || this.keysPressed['ArrowUp'] || this.keysPressed['Space']) && this.canJump) {
          this.playerSpeedY = -15;
          this.canJump = false;
        }

        // Apply gravity
        this.playerSpeedY += this.gravity;

        // Update player position
        this.playerX += this.playerSpeedX;
        this.playerY += this.playerSpeedY;

        // Fixed platform collision detection with proper positioning
        const platforms = [
          { x: this.canvas.width / 4 - 50, y: this.groundY - 150, width: 60, height: 60 },
          { x: this.canvas.width / 4 + 50, y: this.groundY - 200, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 100, y: this.groundY - 300, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 40, y: this.groundY - 300, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 50, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 110, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 170, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 230, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 290, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 350, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 410, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 150, y: this.groundY - 70, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 90, y: this.groundY - 70, width: 60, height: 60 }
        ];

        // Better collision detection - check if player is standing on a platform
        let onPlatform = false;
        
        for (const platform of platforms) {
          // Check if player is overlapping with platform
          if (
            this.playerX < platform.x + platform.width &&
            this.playerX + this.playerWidth > platform.x &&
            this.playerY < platform.y + platform.height &&
            this.playerY + this.playerHeight > platform.y
          ) {
            // If player is falling (positive Y velocity) and hitting platform from above
            if (this.playerSpeedY >= 0 && this.playerY <= platform.y) {
              this.playerY = platform.y - this.playerHeight;
              this.playerSpeedY = 0;
              this.canJump = true;
              onPlatform = true;
              break;
            }
          }
        }

        // Check if player is on ground (left side ground area only)
        const groundArea = this.canvas.width / 6; // Left ground area width
        if (this.playerX + this.playerWidth > 0 && this.playerX < groundArea) {
          if (this.playerY >= this.groundY - this.playerHeight) {
            this.playerY = this.groundY - this.playerHeight;
            this.playerSpeedY = 0;
            this.canJump = true;
            onPlatform = true;
          }
        }

        // Check if player is on right side elevated ground
        const rightGroundX = this.canvas.width - 200;
        const rightGroundY = this.groundY - 400;
        if (this.playerX + this.playerWidth > rightGroundX && this.playerX < this.canvas.width) {
          if (this.playerY >= rightGroundY - this.playerHeight && this.playerY < rightGroundY + 50) {
            this.playerY = rightGroundY - this.playerHeight;
            this.playerSpeedY = 0;
            this.canJump = true;
            onPlatform = true;
          }
        }

        // Keep player within horizontal canvas bounds
        if (this.playerX < 0) {
          this.playerX = 0;
        }
        if (this.playerX > this.canvas.width - this.playerWidth) {
          this.playerX = this.canvas.width - this.playerWidth;
        }

        // Check if player falls to their death (below screen or not on any platform/ground)
        if (this.playerY > this.canvas.height || 
            (this.playerY > this.groundY + 100 && !onPlatform)) {
          console.log("Player fell to their death!");
          this.stop();
          return;
        }

        // Enemy movement (only if not defeated and not dying)
        if (!this.enemyDefeated && !this.enemyDying) {
          this.enemyX += this.enemySpeedX * this.enemyDirection;
          
          // Keep enemy on the upper platform
          const platformStartX = this.canvas.width / 2 + 50;
          const platformEndX = this.canvas.width / 2 + 410;
          
          if (this.enemyX <= platformStartX || this.enemyX >= platformEndX - this.enemyWidth) {
            this.enemyDirection *= -1;
          }
        }

        // Check enemy collision with player (only if enemy not defeated and not dying)
        if (!this.enemyDefeated && !this.enemyDying) {
          if (
            this.playerX < this.enemyX + this.enemyWidth &&
            this.playerX + this.playerWidth > this.enemyX &&
            this.playerY < this.enemyY + this.enemyHeight &&
            this.playerY + this.playerHeight > this.enemyY
          ) {
            if (this.itemCollected) {
              // Player has sword - start death animation with red phase
              console.log("Player defeated zombie with sword!");
              this.startZombieDeathAnimation(() => {
                this.enemyDefeated = true;
                this.enemyX = -1000;
              });
            } else {
              // Player dies
              this.stop();
              return;
            }
          }
        }

        // Check collectible collision
        if (!this.itemCollected) {
          const collectibleX = this.canvas.width / 2 - 120;
          const collectibleY = this.groundY - 110;
          
          if (
            this.playerX < collectibleX + 40 &&
            this.playerX + this.playerWidth > collectibleX &&
            this.playerY < collectibleY + 40 &&
            this.playerY + this.playerHeight > collectibleY
          ) {
            if (this.keysPressed['KeyC']) {
              this.itemCollected = true;
            }
          }
        }

        // Check if player falls off the world
        if (this.playerY > this.canvas.height) {
          this.stop();
        }
      }

      // Add zombie death animation method
      startZombieDeathAnimation(callback) {
        if (this.enemyDying) return; // Prevent multiple death animations
        this.enemyDying = true;

        console.log("Starting zombie death animation with red phase...");

        // Get zombie center position for particle spawn
        const zombieCenterX = this.enemyX + this.enemyWidth / 2;
        const zombieCenterY = this.enemyY + this.enemyHeight / 2;

        // Phase 1: Turn zombie RED (0.5s - longer for better visibility)
        const originalDrawEnemy = this.drawEnemy.bind(this);
        let redPhase = true;

        // Override enemy drawing to show strong red effect
        this.drawEnemy = () => {
          if (redPhase && this.enemyImage.complete && !this.enemyImage.loadFailed) {
            try {
              this.ctx.save();
              
              // Apply strong red filter effect - more intense
              this.ctx.filter = 'brightness(1.5) saturate(5) hue-rotate(-30deg) contrast(2)';
              this.ctx.globalAlpha = 1.0; // Full opacity for clear red effect
              
              if (this.enemyDirection === 1) {
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                  this.enemyImage,
                  -this.enemyX - this.enemyWidth,
                  this.enemyY,
                  this.enemyWidth,
                  this.enemyHeight
                );
              } else {
                this.ctx.drawImage(
                  this.enemyImage,
                  this.enemyX,
                  this.enemyY,
                  this.enemyWidth,
                  this.enemyHeight
                );
              }
              this.ctx.restore();
            } catch (error) {
              console.warn('Failed to draw dying enemy image:', error);
              // Strong red rectangle fallback
              this.ctx.fillStyle = '#FF0000'; 
              this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
            }
          }
          // If not in red phase, don't draw enemy (it's exploded)
        };

        // Wait longer for red phase to be clearly visible
        setTimeout(() => {
          console.log("Red phase complete, starting particle explosion...");
          redPhase = false;
          
          // Create grey particle explosion
          const particles = [];
          const particleCount = 25; 

          // Create grey particle elements
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            
            // Convert canvas coordinates to screen coordinates
            const canvasRect = this.canvas.getBoundingClientRect();
            const screenX = canvasRect.left + zombieCenterX;
            const screenY = canvasRect.top + zombieCenterY;
            
            particle.style.left = `${screenX}px`;
            particle.style.top = `${screenY}px`;
            particle.style.width = `${5 + Math.random() * 8}px`; 
            particle.style.height = particle.style.width;
            
            // Grey color variations
            const greyValue = Math.floor(70 + Math.random() * 130); 
            particle.style.backgroundColor = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
            particle.style.borderRadius = '50%';
            particle.style.zIndex = '10002';
            particle.style.pointerEvents = 'none';
            particle.style.transition = 'all 1.2s ease-out';
            particle.style.boxShadow = '0 0 4px rgba(100, 100, 100, 0.8)';
            
            document.body.appendChild(particle);
            particles.push(particle);
          }

          // Animate particles exploding outward
          setTimeout(() => {
            particles.forEach((particle, index) => {
              const angle = (index / particleCount) * Math.PI * 2;
              const distance = 70 + Math.random() * 120; 
              const offsetX = Math.cos(angle) * distance;
              const offsetY = Math.sin(angle) * distance + Math.random() * -50; 
              
              // Get current position and add offset
              const currentLeft = parseFloat(particle.style.left);
              const currentTop = parseFloat(particle.style.top);
              
              particle.style.left = `${currentLeft + offsetX}px`;
              particle.style.top = `${currentTop + offsetY}px`;
              particle.style.opacity = '0';
              particle.style.transform = 'scale(0.1)';
            });
          }, 100); // Small delay before particle animation

          // Clean up particles and complete animation
          setTimeout(() => {
            particles.forEach(particle => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            });
            
            // Restore original enemy drawing function
            this.drawEnemy = originalDrawEnemy;
            
            console.log("Zombie death animation complete");
            if (callback) callback();
          }, 1300);

        }, 500); 
      }

      // Add the missing drawEnemy method
      drawEnemy() {
        if (this.enemyImage.complete && !this.enemyImage.loadFailed) {
          try {
            this.ctx.save();
            if (this.enemyDirection === 1) {
              this.ctx.scale(-1, 1);
              this.ctx.drawImage(
                this.enemyImage,
                -this.enemyX - this.enemyWidth,
                this.enemyY,
                this.enemyWidth,
                this.enemyHeight
              );
            } else {
              this.ctx.drawImage(
                this.enemyImage,
                this.enemyX,
                this.enemyY,
                this.enemyWidth,
                this.enemyHeight
              );
            }
            this.ctx.restore();
          } catch (error) {
            console.warn('Failed to draw enemy image:', error);
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
          }
        } else {
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
        }
      }

      // Add the missing draw method
      draw() {
        if (!this.ctx) return;

        // Draw background
        if (this.backgroundImage.complete && !this.backgroundImage.loadFailed) {
          try {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
          } catch (error) {
            console.warn('Failed to draw background image:', error);
            this.ctx.fillStyle = 'rgba(135, 206, 235, 1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          }
        } else {
          this.ctx.fillStyle = 'rgba(135, 206, 235, 1)'; 
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw left ground area (starting platform)
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(0, this.groundY, this.canvas.width / 6, this.canvas.height - this.groundY);

        // Draw right elevated ground area 
        this.ctx.fillStyle = '#654321';
        const rightGroundX = this.canvas.width - 200;
        const rightGroundY = this.groundY - 400; 
        this.ctx.fillRect(rightGroundX, rightGroundY, 200, this.canvas.height - rightGroundY);

        // Draw player
        if (this.playerImage.complete && !this.playerImage.loadFailed) {
          try {
            if (this.playerDirection === 1) {
              this.ctx.save();
              this.ctx.translate(this.playerX + this.playerWidth, 0);
              this.ctx.scale(-1, 1);

              this.ctx.drawImage(
                this.playerImage,
                0,
                this.playerY,
                this.playerWidth,
                this.playerHeight
              );

              if (this.itemCollected && this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
                const swordOffsetY = 10;
                let swordOffsetX = 50;

                this.ctx.drawImage(
                  this.collectibleImage,
                  swordOffsetX,
                  this.playerY + swordOffsetY,
                  30,
                  30
                );
              }

              this.ctx.restore();
            } else {
              this.ctx.drawImage(
                this.playerImage,
                this.playerX,
                this.playerY,
                this.playerWidth,
                this.playerHeight
              );

              if (this.itemCollected && this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
                const swordOffsetX = -5;
                const swordOffsetY = 10;
                this.ctx.drawImage(
                  this.collectibleImage,
                  this.playerX + this.playerWidth + swordOffsetX - 30,
                  this.playerY + swordOffsetY,
                  30,
                  30
                );
              }
            }
          } catch (error) {
            console.warn('Failed to draw player image:', error);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
          }
        } else {
          this.ctx.fillStyle = 'red';
          this.ctx.fillRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
        }

        // Draw platforms with grass block style
        const platforms = [
          { x: this.canvas.width / 4 - 50, y: this.groundY - 150, width: 60, height: 60 },
          { x: this.canvas.width / 4 + 50, y: this.groundY - 200, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 100, y: this.groundY - 300, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 40, y: this.groundY - 300, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 50, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 110, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 170, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 230, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 290, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 350, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 + 410, y: this.groundY - 400, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 150, y: this.groundY - 70, width: 60, height: 60 },
          { x: this.canvas.width / 2 - 90, y: this.groundY - 70, width: 60, height: 60 }
        ];

        // Draw platforms
        for (let i = 0; i < platforms.length; i++) {
          const platform = platforms[i];
          const platformImage = this.platformImages[i % this.platformImages.length];
          
          if (platformImage && platformImage.complete && !platformImage.loadFailed) {
            try {
              this.ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
            } catch (error) {
              console.warn('Failed to draw platform image:', error);
              // Draw grass block fallback
              this.ctx.fillStyle = '#228B22'; // Green top
              this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
              this.ctx.fillStyle = '#8B4513'; // Brown bottom  
              this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
              // Add border
              this.ctx.strokeStyle = '#006400';
              this.ctx.lineWidth = 1;
              this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            }
          } else {
            // Draw grass block pattern
            this.ctx.fillStyle = '#228B22'; // Green top
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
            this.ctx.fillStyle = '#8B4513'; // Brown bottom  
            this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
            // Add border
            this.ctx.strokeStyle = '#006400';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
          }
        }

        // Draw enemy using the dedicated method (can be overridden during death animation)
        if (!this.enemyDefeated) {
          this.drawEnemy();
        }

        // Draw NPC on the right elevated platform
        if (this.npcImage.complete && !this.npcImage.loadFailed) {
          try {
            this.ctx.drawImage(
              this.npcImage,
              this.npcX,
              this.npcY,
              this.npcWidth,
              this.npcHeight
            );
          } catch (error) {
            console.warn('Failed to draw NPC image:', error);
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(this.npcX, this.npcY, this.npcWidth, this.npcHeight);
          }
        } else {
          this.ctx.fillStyle = 'green';
          this.ctx.fillRect(this.npcX, this.npcY, this.npcWidth, this.npcHeight);
        }

        // Draw collectible item if not collected
        if (!this.itemCollected) {
          if (this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
            try {
              this.ctx.drawImage(
                this.collectibleImage,
                this.canvas.width / 2 - 120,
                this.groundY - 110,
                40,
                40
              );
            } catch (error) {
              console.warn('Failed to draw collectible image:', error);
              this.ctx.fillStyle = 'gold';
              this.ctx.beginPath();
              this.ctx.arc(this.canvas.width / 2 - 120, this.groundY - 90, 20, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else {
            this.ctx.fillStyle = 'gold';
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2 - 120, this.groundY - 90, 20, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }

    }

    const platformerMini = new PlatformerMini(gameEnv);

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

    // Villager NPC sprite and interaction
    const sprite_src_villager = `${path}/images/gamify/villager.png`;
    const sprite_greet_villager = "Aur aur aur";
    const sprite_data_villager = {
      id: 'Villager',
      greeting: sprite_greet_villager,
      src: sprite_src_villager,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 100,
      pixels: { width: 700, height: 1400 },
      INIT_POSITION: { x: (width * 10) / 11, y: (height * 1) / 40 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },

      collisionEvents: [],
      
      resize() {
      },

      dialogues: [
        "Explore the new terrain?",
        "I love villager life!",
        "Roblox is not better than Minecraft!"
      ],

      reaction() {
      },

      interact() {
        if (this.dialogueSystem?.isDialogueOpen()) { // Fixed: Added missing opening parenthesis
          this.dialogueSystem.closeDialogue();
          return;
        }

        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }

        this.dialogueSystem.showDialogue(
          "Do you wish to explore the plains?",
          "Plains Biome?",
          this.src
        );

        this.dialogueSystem.addButtons([
          {
            text: "Yes!",
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();
              pauseRpg();
              platformerMini.onExit = () => {
                resumeRpg();
              };
              platformerMini.start();
            }
          },
          {
            text: "Not Ready",
            action: () => {
              this.dialogueSystem.closeDialogue();
            }
          }
        ]);
      }
    };

    this.classes = [
      { class: Background, data: image_data_main },
      { class: Player, data: sprite_data_player },
      { class: Npc, data: sprite_data_villager },
      { class: Creeper, data: sprite_data_creeper },
      { class: GameControl, data: {} }
    ];

    this.gameEnv = gameEnv;
  }

  update() {
    // Find player and creeper objects
    const player = this.gameEnv?.gameObjects?.find(obj => obj.spriteData?.id === 'Player');
    const creeper = this.gameEnv?.gameObjects?.find(obj => obj.spriteData?.id === 'Creeper');
    
    // Only check collision if both objects exist and creeper hasn't exploded
    if (player && creeper && !creeper.spriteData.hasExploded) {
      const playerData = {
        position: player.position || player.spriteData?.INIT_POSITION,
        pixels: player.spriteData?.pixels || { width: 600, height: 1500 },
        SCALE_FACTOR: player.spriteData?.SCALE_FACTOR || 5,
        INIT_POSITION: player.spriteData?.INIT_POSITION || { x: 0, y: 0 }
      };
      
      creeper.spriteData.checkPlayerCollision(playerData);
    }
  }

  returnToDesert() {
    if (!this.isRunning) return;
    this.isRunning = false;

    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyDownHandler);

    if (this.canvas?.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const desertLevel = new GameLevelDesert(this.gameEnv);
    desertLevel.start();
  }
}

export default GameLevelOverworld;