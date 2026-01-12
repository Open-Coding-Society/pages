import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class FlyingEnemyOneD extends Character {
  
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be defined
        this.name = name;
        this.yPercentage = yPercentage;

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = 0.4 * GameEnv.innerHeight;
        
        //Access in which a Goomba can travel
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

    }

    //Define Speed of Enemy, if you need it to your flying enemy, call this function under your enemy class constructor
    //See example on Boss.js
    enemySpeed(){
        if (GameEnv.difficulty === "normal") {
            this.speed = this.speed;
        } else {
            this.speed = this.speed * 2;
        }
    }

    // Check for boundaries
    checkBoundaries(){
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition) || this.x > (GameEnv.innerWidth - 100) ) {
            this.speed = -this.speed;
        }
    }

    dropEnemy() {
      let playerX = GameEnv.PlayerPosition.playerX;
      let playerY = GameEnv.PlayerPosition.playerY;

      // Drop the Goomba on the Player when relatively close
      if (Math.abs(this.x - playerX) < 150 && this.y !== playerY) {
        //Move Goomba towards Player
        this.y = followPlayer(this.y, playerY, 0.03);
      } else {
        //Move Goomba towards Sky
        this.y = followPlayer(this.y, 0.1 * GameEnv.innerHeight, 0.02);
      }
    }

    randomEvent(){
        // Event 1: Every so often change direction
        if (Math.random() < 0.005) {
            this.speed = Math.random() < 0.5 ? -this.speed : this.speed;
        }

        // Event 2: Chance for Goomba to turn Gold
        if (["normal","hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }
        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
                this.canvas.style.filter = 'brightness(1000%)';
                this.canvas.style.transform = "rotate(180deg)"
                this.immune = 1;
        }

    }

    updateMovement(){
        //flip the Enemy
        if (this.speed < 0) {
            this.canvas.style.transform = 'scaleX(1)';
        } else {
            this.canvas.style.transform = 'scaleX(-1)';
        }

        // Move the enemy
        this.x -= this.speed;
    }

    update() {
        super.update();

        this.checkBoundaries();
        this.dropEnemy();
        this.randomEvent();
        this.updateMovement();
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "finishline") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
        if (this.collisionData.touchPoints.other.id === "player") {
            this.speed = 0;
            // Collision: Top of Goomba with Bottom of Player
            console.log(this.collisionData.touchPoints.other.bottom + 'bottom')
            console.log(this.collisionData.touchPoints.other.top + "top")
            console.log(this.collisionData.touchPoints.other.right + "right")
            console.log(this.collisionData.touchPoints.other.left + "left")
            
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                this.speed = 0;
                GameEnv.playSound("goombaDeath");
                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);

            }
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
}


/**
 * followPlayer Purpose:
 * Allows for smooth movement &
 * Dynamically changes based off player Y
 * 
 * @param {number} min Start Point
 * @param {number} max Destination
 * @param {number} t Rate of Change
 * @returns 
 * 
 */
function followPlayer(min, max, t) {
  return (max - min) * t + min;
}

export default FlyingEnemyOneD;