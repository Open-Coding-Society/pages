/**
 * PlatformerMini.js
 * Mini platformer game that runs as a "game-in-game" 
 * Launched by Chicken Jockey NPC in the Desert level
 */

class PlatformerMini {
    constructor(gameEnv) {
      this.gameEnv = gameEnv; 
      this.isRunning = false;

      this.enemyDefeated = false;
      this.enemyDying = false;

      this.canvas = document.createElement('canvas');
      this.canvas.width = window.innerWidth; 
      this.canvas.height = window.innerHeight; 
      this.ctx = this.canvas.getContext('2d'); 

      this.backgroundImage = new Image();
      this.backgroundImage.src = `${gameEnv.path}/images/gamify/mcbg.jpg`; 

      this.collectibleImage = new Image();
      this.collectibleImage.src = `${gameEnv.path}/images/gamify/sword.png`; 

      this.playerImage = new Image();
      this.playerImage.src = `${gameEnv.path}/images/gamify/stevelol.png`; 

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

      // Reset game state
      this.playerX = 50;
      this.playerY = this.groundY - 50;
      this.playerSpeedX = 0;
      this.playerSpeedY = 0;
      this.keysPressed = {};
      this.canJump = true;
      this.itemCollected = false;

      // Load platform images
      this.platformImages = [
        new Image(),
        new Image(),
        new Image()
      ];
      this.platformImages[0].src = `${this.gameEnv.path}/images/gamify/grassblock.jpg`;
      this.platformImages[1].src = `${this.gameEnv.path}/images/gamify/grassblock.jpg`;
      this.platformImages[2].src = `${this.gameEnv.path}/images/gamify/grassblock.jpg`;

      this.loadImages();

      // Create and setup canvas
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

      // Setup event listeners
      window.addEventListener('keydown', this.keyDownHandler);
      window.addEventListener('keyup', this.keyUpHandler);

      // Show instructions
      this.showDialogue(
        "Oh no! It seems that there is a chicken in danger!\n\nPress 'E' to talk\nPress 'C' to collect",
        "Instructions"
      );

      // Start game loop
      this.loop();
    }

    stop() {
      if (!this.isRunning) return;
      this.isRunning = false;

      // Remove event listeners
      window.removeEventListener('keydown', this.keyDownHandler);
      window.removeEventListener('keyup', this.keyUpHandler);

      // Remove canvas
      if (this.canvas?.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
        this.ctx = null;
      }

      // Cancel animation frame
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Reset player state
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

      const message = document.createElement('h1');
      message.textContent = 'You have died!';
      message.style.marginBottom = '20px';
      deathScreen.appendChild(message);

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
        if (this.onExit) this.onExit();
      });
      deathScreen.appendChild(button);

      document.body.appendChild(deathScreen);
    }

    showDialogue(message, title, callback) {
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

      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.marginBottom = '20px';
      dialogueOverlay.appendChild(titleElement);

      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageElement.style.marginBottom = '20px';
      dialogueOverlay.appendChild(messageElement);

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

    keyDownHandler = (e) => {
      this.keysPressed[e.code] = true;

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
      // Player movement
      if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) {
        this.playerSpeedX = -5;
        this.playerDirection = -1;
      } else if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) {
        this.playerSpeedX = 5;
        this.playerDirection = 1;
      } else {
        this.playerSpeedX = 0;
      }

      // Jump
      if ((this.keysPressed['KeyW'] || this.keysPressed['ArrowUp'] || this.keysPressed['Space']) && this.canJump) {
        this.playerSpeedY = -15;
        this.canJump = false;
      }

      // Apply gravity
      this.playerSpeedY += this.gravity;

      // Update position
      this.playerX += this.playerSpeedX;
      this.playerY += this.playerSpeedY;

      // Platform collision detection
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

      let onPlatform = false;
      
      for (const platform of platforms) {
        if (
          this.playerX < platform.x + platform.width &&
          this.playerX + this.playerWidth > platform.x &&
          this.playerY < platform.y + platform.height &&
          this.playerY + this.playerHeight > platform.y
        ) {
          if (this.playerSpeedY >= 0 && this.playerY <= platform.y) {
            this.playerY = platform.y - this.playerHeight;
            this.playerSpeedY = 0;
            this.canJump = true;
            onPlatform = true;
            break;
          }
        }
      }

      // Ground collision (left side)
      const groundArea = this.canvas.width / 6;
      if (this.playerX + this.playerWidth > 0 && this.playerX < groundArea) {
        if (this.playerY >= this.groundY - this.playerHeight) {
          this.playerY = this.groundY - this.playerHeight;
          this.playerSpeedY = 0;
          this.canJump = true;
          onPlatform = true;
        }
      }

      // Ground collision (right side)
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

      // Keep player within bounds
      if (this.playerX < 0) {
        this.playerX = 0;
      }
      if (this.playerX > this.canvas.width - this.playerWidth) {
        this.playerX = this.canvas.width - this.playerWidth;
      }

      // Check for death (fall off screen)
      if (this.playerY > this.canvas.height || 
          (this.playerY > this.groundY + 100 && !onPlatform)) {
        console.log("Player fell to their death!");
        this.stop();
        return;
      }

      // Enemy movement
      if (!this.enemyDefeated && !this.enemyDying) {
        this.enemyX += this.enemySpeedX * this.enemyDirection;
        
        const platformStartX = this.canvas.width / 2 + 50;
        const platformEndX = this.canvas.width / 2 + 410;
        
        if (this.enemyX <= platformStartX || this.enemyX >= platformEndX - this.enemyWidth) {
          this.enemyDirection *= -1;
        }
      }

      // Enemy collision
      if (!this.enemyDefeated && !this.enemyDying) {
        if (
          this.playerX < this.enemyX + this.enemyWidth &&
          this.playerX + this.playerWidth > this.enemyX &&
          this.playerY < this.enemyY + this.enemyHeight &&
          this.playerY + this.playerHeight > this.enemyY
        ) {
          if (this.itemCollected) {
            console.log("Player defeated zombie with sword!");
            this.startZombieDeathAnimation(() => {
              this.enemyDefeated = true;
              this.enemyX = -1000;
            });
          } else {
            this.stop();
            return;
          }
        }
      }

      // Collectible item
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

      // Additional death check
      if (this.playerY > this.canvas.height) {
        this.stop();
      }
    }

    startZombieDeathAnimation(callback) {
      if (this.enemyDying) return;
      this.enemyDying = true;

      console.log("Starting zombie death animation with red phase...");

      const zombieCenterX = this.enemyX + this.enemyWidth / 2;
      const zombieCenterY = this.enemyY + this.enemyHeight / 2;

      const originalDrawEnemy = this.drawEnemy.bind(this);
      let redPhase = true;

      // Override drawEnemy for red flash effect
      this.drawEnemy = () => {
        if (redPhase && this.enemyImage.complete && !this.enemyImage.loadFailed) {
          try {
            this.ctx.save();
            this.ctx.filter = 'brightness(1.5) saturate(5) hue-rotate(-30deg) contrast(2)';
            this.ctx.globalAlpha = 1.0;
            
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
            this.ctx.fillStyle = '#FF0000'; 
            this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
          }
        }
      };

      setTimeout(() => {
        console.log("Red phase complete, starting particle explosion...");
        redPhase = false;
        
        const particles = [];
        const particleCount = 25; 

        // Create particles
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.style.position = 'fixed';
          
          const canvasRect = this.canvas.getBoundingClientRect();
          const screenX = canvasRect.left + zombieCenterX;
          const screenY = canvasRect.top + zombieCenterY;
          
          particle.style.left = `${screenX}px`;
          particle.style.top = `${screenY}px`;
          particle.style.width = `${5 + Math.random() * 8}px`; 
          particle.style.height = particle.style.width;
          
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

        // Animate particles outward
        setTimeout(() => {
          particles.forEach((particle, index) => {
            const angle = (index / particleCount) * Math.PI * 2;
            const distance = 70 + Math.random() * 120; 
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance + Math.random() * -50; 
            
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            particle.style.left = `${currentLeft + offsetX}px`;
            particle.style.top = `${currentTop + offsetY}px`;
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.1)';
          });
        }, 100);

        // Clean up particles
        setTimeout(() => {
          particles.forEach(particle => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          });
          
          this.drawEnemy = originalDrawEnemy;
          
          console.log("Zombie death animation complete");
          if (callback) callback();
        }, 1300);

      }, 500); 
    }

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

      // Draw ground (left side)
      this.ctx.fillStyle = '#654321';
      this.ctx.fillRect(0, this.groundY, this.canvas.width / 6, this.canvas.height - this.groundY);

      // Draw ground (right side)
      this.ctx.fillStyle = '#654321';
      const rightGroundX = this.canvas.width - 200;
      const rightGroundY = this.groundY - 400; 
      this.ctx.fillRect(rightGroundX, rightGroundY, 200, this.canvas.height - rightGroundY);

      // Draw player
      if (this.playerImage.complete && !this.playerImage.loadFailed) {
        try {
          if (this.playerDirection === 1) {
            // Facing right - flip horizontally
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

            // Draw sword if collected
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
            // Facing left
            this.ctx.drawImage(
              this.playerImage,
              this.playerX,
              this.playerY,
              this.playerWidth,
              this.playerHeight
            );

            // Draw sword if collected
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

      // Draw platforms
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

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        const platformImage = this.platformImages[i % this.platformImages.length];
        
        if (platformImage && platformImage.complete && !platformImage.loadFailed) {
          try {
            this.ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
          } catch (error) {
            console.warn('Failed to draw platform image:', error);
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
            this.ctx.strokeStyle = '#006400';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
          }
        } else {
          // Fallback drawing
          this.ctx.fillStyle = '#228B22';
          this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
          this.ctx.strokeStyle = '#006400';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
      }

      // Draw enemy
      if (!this.enemyDefeated) {
        this.drawEnemy();
      }

      // Draw NPC
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

      // Draw collectible item
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

export default PlatformerMini;
