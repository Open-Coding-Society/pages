import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import GameObject from './GameEngine/GameObject.js';
import DialogueSystem from './GameEngine/DialogueSystem.js';
import MansionLevel4 from './mansionLevel4.js';

console.log("🎮 mansionLevel3.js loaded!");

// Scrolling background class for stairs effect
class ScrollingBackground extends GameEnvBackground {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.scrollY = 0;
    this.scrollSpeed = 0;
  }

  draw() {
    const ctx = this.gameEnv.ctx;
    const width = this.gameEnv.innerWidth;
    const height = this.gameEnv.innerHeight;

    if (this.image && this.image.complete) {
      const imgW = this.image.width;
      const imgH = this.image.height;
      const scale = Math.max(width / imgW, height / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const dx = (width - drawW) / 2;
      
      // Calculate scrolling position with wrapping
      const wrappedY = this.scrollY % drawH;
      
      // Draw two copies of the image for seamless scrolling
      ctx.drawImage(this.image, dx, wrappedY, drawW, drawH);
      ctx.drawImage(this.image, dx, wrappedY - drawH, drawW, drawH);
    } else {
      // Fallback
      ctx.fillStyle = this.fillStyle || '#000000';
      ctx.fillRect(0, 0, width, height);
    }
  }

  setScrollSpeed(speed) {
    this.scrollSpeed = speed;
  }

  scroll(amount) {
    this.scrollY += amount;
  }
}

// Falling object class for skeletons and key
class Skeleton extends GameObject {
  constructor(data, gameEnv) {
    super(gameEnv);
    this.x = data.x || 0;
    this.y = data.y || -50;
    // Allow explicit width/height or a scale multiplier to control drawn size.
    // Backwards-compatible defaults: Key: 80x80, Skeleton: 134x166
    const defaultWidth = data.isKey ? 80 : 134;
    const defaultHeight = data.isKey ? 80 : 166;

    if (typeof data.width === 'number' && typeof data.height === 'number') {
      this.width = data.width;
      this.height = data.height;
    } else if (typeof data.scale === 'number') {
      // scale is a multiplier (e.g. 0.5 for half size)
      this.width = Math.round(defaultWidth * data.scale);
      this.height = Math.round(defaultHeight * data.scale);
    } else {
      this.width = defaultWidth;
      this.height = defaultHeight;
    }
    this.scrollSpeed = data.scrollSpeed || 3;
    this.level = data.level;
    this.isKey = data.isKey || false;
    this.ctx = gameEnv.ctx;
    this.gameEnv = gameEnv;
    this.hasCollided = false;
    
    // Load sprite
    this.sprite = new Image();
    this.sprite.src = data.imageSrc;
    
    console.log(`✨ Created ${this.isKey ? 'KEY' : 'SKELETON'} at (${this.x}, ${this.y})`);
  }

  update() {
    // Move down
    this.y += this.scrollSpeed;

    // Check collision with player
    if (!this.hasCollided) {
      const player = this.gameEnv.gameObjects.find(obj => obj.constructor.name === 'Player');
      if (player) {
        // Get player position from canvas
        if (player.canvas) {
          const playerRect = player.canvas.getBoundingClientRect();
          const canvasRect = this.gameEnv.canvas.getBoundingClientRect();
          
          const px = playerRect.left - canvasRect.left;
          const py = playerRect.top - canvasRect.top;
          const pw = playerRect.width;
          const ph = playerRect.height;
          
          if (this.x < px + pw && this.x + this.width > px &&
              this.y < py + ph && this.y + this.height > py) {
            console.log(`💥 COLLISION! ${this.isKey ? 'KEY' : 'SKELETON'}`);
            this.hasCollided = true;
            
            if (this.level) {
              if (this.isKey) {
                this.level.winGame();
              } else {
                this.level.hitSkeleton();
              }
            }
            
            this.destroy();
          }
        }
      }
    }

    // Remove if off screen
    if (this.y > this.gameEnv.canvas.height + 100) {
      this.destroy();
    }

    // Draw the object
    this.draw();
  }

  draw() {
    if (!this.ctx) return;

    this.ctx.save();
    
    // Draw shadow/glow effect
    if (this.isKey) {
      this.ctx.shadowColor = '#ffd700';
      this.ctx.shadowBlur = 20;
    }
    
    // Draw the sprite if loaded
    if (this.sprite.complete) {
      this.ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Draw fallback rectangle if image not loaded
      this.ctx.fillStyle = this.isKey ? '#ffd700' : '#e8e8e8';
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.ctx.restore();
  }

  handleCollisionEvent(player) {
    console.log("handleCollisionEvent called!", this.isKey ? "KEY" : "SKELETON", "Level:", this.level);
    if (this.level) {
      if (this.isKey) {
        console.log("Calling winGame()");
        this.level.winGame();
      } else {
        console.log("Calling hitSkeleton()");
        this.level.hitSkeleton();
      }
      // Remove this object after collision
      const index = this.gameEnv.gameObjects.indexOf(this);
      if (index > -1) {
        this.gameEnv.gameObjects.splice(index, 1);
      }
    }
  }

  resize() {
    // No resize needed for simple objects
  }

  destroy() {
    // Cleanup when destroyed
    const index = this.gameEnv.gameObjects.indexOf(this);
    if (index > -1) {
      this.gameEnv.gameObjects.splice(index, 1);
    }
  }
}

class MansionLevel3 {
  constructor(gameEnv) {
    console.log("🎮 MansionLevel3 constructor started");
    console.log("gameEnv:", gameEnv);
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    let gameControl = gameEnv.gameControl;

    console.log("✅ Game environment:", { width, height, path });

    // Game state - REMOVED LIVES, ONLY SCORE + TIMER
    this.score = 0;
  this.applesCollected = 0;
    this.scrollSpeed = 10;
    this.difficulty = 1;
    this.gameEnv = gameEnv;
    this.dialogueSystem = new DialogueSystem();
    this.spawnTimer = 0;
    this.keySpawned = false;
    this.gameEnded = false;
    this.gameWon = false;
    
    // TIMER: 60 seconds (60 * 60 frames at 60fps)
    this.timeRemaining = 60;
    this.frameCounter = 0;
    this.startTime = Date.now();

    // Background - scrolling staircase
    this.backgroundY = 0;
    const image_background = path + "/images/mansionGame/Bucketbckgrnd.png";
    const image_data_background = {
        name: 'background',
        greeting: `Score: ${this.score} | Distance: ${this.score} | Hit skeletons for points!`,
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'cover',
    };

    // Player setup
    const sprite_src_mc = path + "/images/gamify/spookMcWalk.png";
    const MC_SCALE_FACTOR = 6;
    const playerData = {
      id: 'Spook',
      greeting: "Hi, I am Spook.",
      src: sprite_src_mc,
      SCALE_FACTOR: MC_SCALE_FACTOR,
      STEP_FACTOR: 120,
      ANIMATION_RATE: 10,
      INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)}, 
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
      keypress: {left: 65, right: 68}
    };

    this.classes = [
      { class: ScrollingBackground, data: image_data_background },
      { class: Player, data: playerData }
    ];

    this.createHUD();

    console.log("✅ MansionLevel3 classes created:", this.classes.length);
    console.log("✅ MansionLevel3 constructor completed");
  }

  createHUD() {
    const existingHUD = document.getElementById('mansion3-hud');
    if (existingHUD) {
      existingHUD.remove();
    }

    const hud = document.createElement('div');
    hud.id = 'mansion3-hud';
    hud.style.position = 'fixed';
    hud.style.top = '80px';
    hud.style.left = '20px';
    hud.style.zIndex = '99999';
    hud.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    hud.style.color = 'white';
    hud.style.padding = '20px 30px';
    hud.style.borderRadius = '15px';
    hud.style.fontFamily = 'Arial, sans-serif';
    hud.style.fontSize = '24px';
    hud.style.fontWeight = 'bold';
    hud.style.border = '3px solid white';
    hud.style.minWidth = '200px';
    
    document.body.appendChild(hud);
    console.log("HUD created!", hud);
    this.updateHUD();
    
    const instructionText = document.createElement('div');
    instructionText.id = 'mansion3-instruction';
    instructionText.style.position = 'fixed';
    instructionText.style.top = '60px';
    instructionText.style.left = '50%';
    instructionText.style.transform = 'translateX(-50%)';
    instructionText.style.zIndex = '99999';
    instructionText.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    instructionText.style.color = '#ffd700';
    instructionText.style.padding = '10px 20px';
    instructionText.style.borderRadius = '10px';
    instructionText.style.fontFamily = 'Arial, sans-serif';
    instructionText.style.fontSize = '18px';
    instructionText.style.fontWeight = 'bold';
  instructionText.textContent = 'Hit skeletons for +25 points! Collect apples shown in the HUD';
    
    document.body.appendChild(instructionText);
    
    this.createMobileControls();
  }

  createMobileControls() {
    const leftArrow = document.createElement('div');
    leftArrow.id = 'mansion3-left-arrow';
    leftArrow.innerHTML = '◀';
    leftArrow.style.position = 'fixed';
    leftArrow.style.bottom = '100px';
    leftArrow.style.left = '30px';
    leftArrow.style.width = '80px';
    leftArrow.style.height = '80px';
    leftArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    leftArrow.style.color = 'white';
    leftArrow.style.fontSize = '48px';
    leftArrow.style.display = 'flex';
    leftArrow.style.alignItems = 'center';
    leftArrow.style.justifyContent = 'center';
    leftArrow.style.borderRadius = '50%';
    leftArrow.style.border = '3px solid white';
    leftArrow.style.cursor = 'pointer';
    leftArrow.style.zIndex = '99999';
    leftArrow.style.userSelect = 'none';
    
    const rightArrow = document.createElement('div');
    rightArrow.id = 'mansion3-right-arrow';
    rightArrow.innerHTML = '▶';
    rightArrow.style.position = 'fixed';
    rightArrow.style.bottom = '100px';
    rightArrow.style.right = '30px';
    rightArrow.style.width = '80px';
    rightArrow.style.height = '80px';
    rightArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    rightArrow.style.color = 'white';
    rightArrow.style.fontSize = '48px';
    rightArrow.style.display = 'flex';
    rightArrow.style.alignItems = 'center';
    rightArrow.style.justifyContent = 'center';
    rightArrow.style.borderRadius = '50%';
    rightArrow.style.border = '3px solid white';
    rightArrow.style.cursor = 'pointer';
    rightArrow.style.zIndex = '99999';
    rightArrow.style.userSelect = 'none';
    
    document.body.appendChild(leftArrow);
    document.body.appendChild(rightArrow);
    
    const dispatchKeyEvent = (type, keyCode) => {
      const event = new KeyboardEvent(type, {
        keyCode: keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    };
    
    const handleLeftPress = () => {
      dispatchKeyEvent('keydown', 65);
    };
    
    const handleLeftRelease = () => {
      dispatchKeyEvent('keyup', 65);
    };
    
    const handleRightPress = () => {
      dispatchKeyEvent('keydown', 68);
    };
    
    const handleRightRelease = () => {
      dispatchKeyEvent('keyup', 68);
    };
    
    leftArrow.addEventListener('touchstart', (e) => {
      e.preventDefault();
      leftArrow.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      handleLeftPress();
    });
    
    leftArrow.addEventListener('touchend', (e) => {
      e.preventDefault();
      leftArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleLeftRelease();
    });
    
    leftArrow.addEventListener('mousedown', (e) => {
      e.preventDefault();
      leftArrow.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      handleLeftPress();
    });
    
    leftArrow.addEventListener('mouseup', (e) => {
      e.preventDefault();
      leftArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleLeftRelease();
    });
    
    leftArrow.addEventListener('mouseleave', (e) => {
      leftArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleLeftRelease();
    });
    
    rightArrow.addEventListener('touchstart', (e) => {
      e.preventDefault();
      rightArrow.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      handleRightPress();
    });
    
    rightArrow.addEventListener('touchend', (e) => {
      e.preventDefault();
      rightArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleRightRelease();
    });
    
    rightArrow.addEventListener('mousedown', (e) => {
      e.preventDefault();
      rightArrow.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      handleRightPress();
    });
    
    rightArrow.addEventListener('mouseup', (e) => {
      e.preventDefault();
      rightArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleRightRelease();
    });
    
    rightArrow.addEventListener('mouseleave', (e) => {
      rightArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      handleRightRelease();
    });
  }

  updateHUD() {
    const hud = document.getElementById('mansion3-hud');
    if (hud) {
      hud.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 28px; color: #00ff00; font-weight: bold;">SCORE: ${this.score}</div>
        <div style="margin-bottom: 8px; font-size: 24px; color: #ff0000; font-weight: bold;">TIME: ${this.timeRemaining}s</div>
        <div style="font-size: 22px; color: #ffd700; font-weight: bold;">Apples: ${this.applesCollected}</div>
      `;
    } else {
      console.log("HUD not found!");
    }
  }

  update() {
    if (this.gameEnded || this.gameWon) {
      return;
    }

    // UPDATE TIMER
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    this.timeRemaining = Math.max(0, 60 - elapsedSeconds);
    
    // END GAME WHEN TIMER REACHES 0
    if (this.timeRemaining <= 0) {
      this.timeUp();
      return;
    }

    const background = this.gameEnv.gameObjects.find(obj => obj instanceof ScrollingBackground);
    if (background) {
      background.scroll(this.scrollSpeed);
    }

    if (this.score % 30 === 0) {
      this.updateHUD();
      this.updateScoreDisplay();
    }

    this.spawnTimer++;
    if (this.spawnTimer > 40) {
      this.spawnTimer = 0;
      this.spawnSkeleton();
    }

    // Keep existing key spawn logic tied to score-derived distance for now
    const distance = Math.floor(this.score / 10);
    if (distance >= 300 && !this.keySpawned) {
      console.log("🔑 SPAWNING KEY at distance:", distance);
      this.spawnKey();
      this.keySpawned = true;
      
      const instructionText = document.getElementById('mansion3-instruction');
      if (instructionText) {
        instructionText.textContent = 'Golden Key spawned! Collect it to win!';
        instructionText.style.color = '#ffd700';
      }
    }

    if (this.score % 500 === 0) {
      this.scrollSpeed = Math.min(this.scrollSpeed + 0.3, 6);
    }
    
    // Update HUD every frame to keep timer accurate
    this.updateHUD();
  }

  spawnSkeleton() {
    const skeletonData = {
      x: Math.random() * (this.gameEnv.canvas.width - 60),
      y: -80,
      scrollSpeed: this.scrollSpeed,
      level: this,
      isKey: false,
      imageSrc: this.gameEnv.path + "/images/mansionGame/Apple.png",
      // Make the apple smaller on spawn. Adjust this value to taste: 0.5 = half size, 0.7 = 70%.
      scale: 0.6
    };

    const skeleton = new Skeleton(skeletonData, this.gameEnv);
    this.gameEnv.gameObjects.push(skeleton);
  }

  spawnKey() {
    const keyData = {
      x: this.gameEnv.canvas.width / 2 - 20,
      y: -40,
      scrollSpeed: this.scrollSpeed,
      level: this,
      isKey: true,
      imageSrc: this.gameEnv.path + "/images/mansionGame/key_lvl3.png"
    };

    const key = new Skeleton(keyData, this.gameEnv);
    this.gameEnv.gameObjects.push(key);
    console.log("✅ Key added! Total objects:", this.gameEnv.gameObjects.length);
  }

  hitSkeleton() {
    console.log("💀 HIT SKELETON! Score before:", this.score);
    this.score += 25;
    this.applesCollected += 1;
    console.log("Score after:", this.score);
    this.updateHUD();
    this.updateScoreDisplay();
  }

  timeUp() {
    console.log("⏰ TIME'S UP!");
    
    this.gameEnded = true;
    
    this.gameEnv.gameObjects = this.gameEnv.gameObjects.filter(
      obj => !(obj instanceof Skeleton)
    );
    
    const dialogueSystem = new DialogueSystem();
    dialogueSystem.showDialogue(
      `Time's up! Final Score: ${this.score}`,
      'Game Over',
      this.gameEnv.path + '/images/mansionGame/skeleton_lvl3.png'
    );
    
    dialogueSystem.addButtons([
      {
        text: 'Restart',
        primary: true,
        action: () => {
          dialogueSystem.closeDialogue();
          this.gameEnded = false;
          this.gameWon = false;
          this.restart();
        }
      }
    ]);
  }

  winGame() {
    console.log("🎉 YOU WIN!");
    
    this.keySpawned = true;
    this.gameWon = true;
    
    this.gameEnv.gameObjects = this.gameEnv.gameObjects.filter(
      obj => !(obj instanceof Skeleton)
    );
    
    const dialogueSystem = new DialogueSystem();
    dialogueSystem.showDialogue(
      `You collected the golden key! Final Score: ${this.score}`,
      'Victory!',
      this.gameEnv.path + '/images/mansionGame/key_lvl3.png'
    );
    
    dialogueSystem.addButtons([
      {
        text: 'Continue',
        primary: true,
        action: () => {
          dialogueSystem.closeDialogue();
          const hud = document.getElementById('mansion3-hud');
          if (hud) hud.remove();
          
          if (this.gameEnv && this.gameEnv.gameControl) {
            const gameControl = this.gameEnv.gameControl;
            gameControl.levelClasses = [MansionLevel4];
            gameControl.currentLevelIndex = 0;
            gameControl.transitionToLevel();
          }
        }
      }
    ]);
  }

  restart() {
    this.score = 0;
    this.scrollSpeed = 10;
    this.keySpawned = false;
    this.spawnTimer = 0;
    this.timeRemaining = 60;
    this.startTime = Date.now();
    this.updateHUD();
    this.updateScoreDisplay();
    
    this.gameEnv.gameObjects = this.gameEnv.gameObjects.filter(
      obj => !(obj instanceof Skeleton)
    );
  }

  updateScoreDisplay() {
    const displayText = `Score: ${this.score} | Time: ${this.timeRemaining}s | Apples: ${this.applesCollected} | Hit skeletons for +25 points!`;
    
    const background = this.classes.find(c => c.data.name === 'background');
    if (background) {
      background.data.greeting = displayText;
    }
  }

  destroy() {
    console.log("🧹 Cleaning up MansionLevel3...");
    
    const hud = document.getElementById('mansion3-hud');
    if (hud) {
      hud.remove();
      console.log("✅ HUD removed");
    }
    
    const instructionText = document.getElementById('mansion3-instruction');
    if (instructionText) {
      instructionText.remove();
    }
    
    const leftArrow = document.getElementById('mansion3-left-arrow');
    if (leftArrow) {
      leftArrow.remove();
    }
    
    const rightArrow = document.getElementById('mansion3-right-arrow');
    if (rightArrow) {
      rightArrow.remove();
    }
    
    if (this.gameEnv && this.gameEnv.gameObjects) {
      this.gameEnv.gameObjects = this.gameEnv.gameObjects.filter(
        obj => !(obj instanceof Skeleton)
      );
    }
    
    console.log("✅ MansionLevel3 cleanup complete");
  }
}

export default MansionLevel3;