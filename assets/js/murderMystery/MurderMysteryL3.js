import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';

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

class MurderMysteryL3 {
  constructor(gameEnv) {
    console.log("🎮 MurderMysteryL3 constructor started");
    console.log("gameEnv:", gameEnv);
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    let gameControl = gameEnv.gameControl;

    console.log("✅ Game environment:", { width, height, path });

    // Game state
    this.lives = 3;
    this.score = 0;
    this.scrollSpeed = 10; // Much faster scrolling
    this.difficulty = 1;
    this.gameEnv = gameEnv;
    this.spawnTimer = 0;
    this.keySpawned = false;
    this.gameEnded = false;
    this.gameWon = false;

    // Background - scrolling staircase
    this.backgroundY = 0;
    const image_background = path + "/images/mansionGame/stairs_lvl3.png";
    const image_data_background = {
        name: 'background',
        greeting: `LIVES: ${'❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives)} | Distance: ${this.score} | Dodge skeletons, get the key!`,
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'cover', // Fill the entire screen
    };

    // Player setup - MUST match exact format from mansionLevel1
    const sprite_src_mc = path + "/images/gamify/spookMcWalk.png";
    const MC_SCALE_FACTOR = 6;
    const playerData = {
      id: 'Spook',
      greeting: "Hi, I am Spook.",
      src: sprite_src_mc,
      SCALE_FACTOR: MC_SCALE_FACTOR,
      STEP_FACTOR: 120, // Slower movement (increased from 80)
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
      keypress: {left: 65, right: 68} // Only A (left) and D (right) - removed W and S
    };

    // Classes array - use ScrollingBackground instead of GameEnvBackground
    this.classes = [
      { class: ScrollingBackground, data: image_data_background },
      { class: Player, data: playerData }
    ];
    }
}

export default MurderMysteryL3;