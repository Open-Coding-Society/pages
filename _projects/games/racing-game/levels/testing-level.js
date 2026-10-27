import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from './AccelDecelRacingPlayer.js';
import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';
import SplineBarrier from '@assets/js/GameEnginev1.1/essentials/SplineBarrier.js';
import TimeLapScreen from './TimeLapScreen.js';

class GameLevelTesting {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const background_data = {
name: "Autumn Course",
      greeting: "Welcome to the Autumn Level!",
      src: path + '/images/projects/racing-game/Autumn_Track.jpeg',
      pixels: { height: 360, width: 643 }
    };
    const player_data = {
        name: "Red Car",
        greeting: "I'm the red car!",
        src: path + '/images/projects/racing-game/Directions_red_car.png',
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
         // Replacing step factor with a more realistic acceleration and decelation piece of code.

        currentSpeed: 0,
        maxSpeed: 12,
        acceleration: 0.4,
        deceleration: 0.4,
        reverseSpeed: -4,

        INIT_POSITION: {x: 340 / 740, y: 500 / 585},
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 1, start: 0, columns: 1 },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    }
    const other_data = {
        name: "Blue Car",
        greeting: "I'm the blue car!",
        src: path + '/images/projects/racing-game/Directions_blue_car.png',
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1100,
        INIT_POSITION: {x: 340 / 740 - 0.08, y: 500 / 585}, // start behind the red car so they don't overlap
        pixels: { height: 1024, width: 1536 },
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 1 },
        upRight:   { row: 0, start: 2, columns: 1, rotate: Math.PI },
        right:     { row: 3, start: 2, columns: 1, rotate: Math.PI },
        downRight: { row: 2, start: 0, columns: 1 },
        down:      { row: 0, start: 0, columns: 1 },
        downLeft:  { row: 0, start: 2, columns: 1 },
        left:      { row: 3, start: 2, columns: 1 },
        upLeft:    { row: 2, start: 0, columns: 1, rotate: Math.PI },
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        keypress: { up: 38, left: 37, down: 40, right: 39 } // Arrow keys
    }
    const barrierData1 = {
      id: "barrier-1",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.1219,"y":0.8023},{"x":0.1093,"y":0.7819},{"x":0.1075,"y":0.7462},{"x":0.1047,"y":0.4477},{"x":0.1147,"y":0.4222},{"x":0.216,"y":0.4196},{"x":0.2775,"y":0.5191},{"x":0.3064,"y":0.5293},{"x":0.3309,"y":0.5293},{"x":0.3553,"y":0.5217},{"x":0.3752,"y":0.5089},{"x":0.491,"y":0.2921},{"x":0.5099,"y":0.2844},{"x":0.7533,"y":0.2819},{"x":0.7632,"y":0.3054},{"x":0.9052,"y":0.563},{"x":0.8962,"y":0.7798},{"x":0.8102,"y":0.8003},{"x":0.1319,"y":0.8079}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const barrierData2 = {
      id: "barrier-2",
      coordinateSpace: "normalized",
      splinePoints: [{"x":0.0939,"y":0.9212},{"x":0.1156,"y":0.9314},{"x":0.6908,"y":0.9314},{"x":0.9097,"y":0.9309},{"x":0.9351,"y":0.9156},{"x":0.9477,"y":0.9028},{"x":0.964,"y":0.8671},{"x":0.9758,"y":0.8059},{"x":0.973,"y":0.5452},{"x":0.9631,"y":0.4865},{"x":0.8021,"y":0.1829},{"x":0.7885,"y":0.1599},{"x":0.7686,"y":0.1599},{"x":0.4991,"y":0.1574},{"x":0.4656,"y":0.1676},{"x":0.4439,"y":0.1982},{"x":0.4195,"y":0.2339},{"x":0.3969,"y":0.2824},{"x":0.3327,"y":0.3946},{"x":0.3092,"y":0.3946},{"x":0.263,"y":0.3105},{"x":0.235,"y":0.2875},{"x":0.1789,"y":0.2824},{"x":0.093,"y":0.3054},{"x":0.064,"y":0.3232},{"x":0.0423,"y":0.3793},{"x":0.0342,"y":0.4431},{"x":0.0414,"y":0.813},{"x":0.0505,"y":0.8793},{"x":0.0785,"y":0.9125}],
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true,
    };
    const BoxData = {
      id: "box-1",
      src: path + '/images/projects/racing-game/BoxObstacle.png',
      coordinateSpace: "normalized",
      SCALE_FACTOR: 10,
      INIT_POSITION: { x: 0.47, y: 0.25 },
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      pixels: { height: 369, width: 676 },
      orientation: { rows: 1, columns: 1 },
    };

    // Creeper sprite info with movement, animation logic, and scaled down size
    const sprite_src_creeper = `${path}/images/projects/gamify/creepa.png`;
    const sprite_greet_creeper = "KABOOM!!";
    const sprite_data_creeper = {
      id: 'Creeper',
      greeting: sprite_greet_creeper,
      src: sprite_src_creeper,
      SCALE_FACTOR: 16, // Increased scale factor to make the Creeper much smaller
      ANIMATION_RATE: 25,
      pixels: { height: 1200, width: 1600 },
      INIT_POSITION: { x: 60, y: 100 }, // Positioning the creeper in the middle of the track
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
      
      resize() {},

      walkingArea: {
        xMin: 50,
        xMax: 500,
        yMin: 50,
        yMax: 300
      },
      speed: 1,
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
      }
    };

    // Finish line on the painted start/finish line; HUD in the trees above the top-left corner.
    const lap_data = {
      totalLaps: 3,
      finishLine: { x: 0.453, top: 0.794, bottom: 0.941 },
      hudPosition: { x: 0.01, y: 0.02 }
    };

    this.classes = [
      { class: GameEnvBackground, data: background_data },
      { class: Player, data: player_data },
      { class: Player, data: other_data },
      { class: SplineBarrier, data: barrierData1 },
      { class: SplineBarrier, data: barrierData2 },
      { class: Character, data: BoxData },
      { class: Character, data: sprite_data_creeper }, // Added Creeper into the level game objects
      { class: TimeLapScreen, data: lap_data }
    ];
  }
}

export default GameLevelTesting;