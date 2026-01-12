import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Enemy extends Character {

    initEnvironmentState = {
        // Enemy
        animation: 'right',
        direction: 'right',
        isDying: false,
    };

    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);
        this.playerData = data;
        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        this.isIdle = false;
        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        this.state = {...this.initEnvironmentState}; // Enemy and environment states 

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]

        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMinFrame(animation.min ? animation.min : 0);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }

    enemySpeed(){ //if you want the enemy speed to change based on different 'difficulty', you can include this function to the update function
        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.speed = this.speed * 5
        }
    }

    checkBoundaries(){
        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            if (this.state.direction === "left") {
                this.state.animation = "right";
                this.state.direction = "right";
            }
            else if (this.state.direction === "right") {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        };
    }

    updateMovement(){
        if (this.state.animation === "right") {
            this.speed = Math.abs(this.speed)
        }
        else if (this.state.animation === "left") {
            this.speed = -Math.abs(this.speed);
        }
        else if (this.state.animation === "idle") {
            this.speed = 0
        }
        else if (this.state.animation === "death") {
            this.speed = 0
        }

        // Move the enemy\
        this.x += this.speed;

        this.playerBottomCollision = false;
    }

    update() {
        super.update();

        this.setAnimation(this.state.animation);
        
        this.checkBoundaries();

        this.updateMovement();

    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "finishline") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            }
            else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }

        }

        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Goomba with Bottom of Player
            //console.log(this.collisionData.touchPoints.other.bottom + 'bottom')
            //console.log(this.collisionData.touchPoints.other.top + "top")
            //console.log(this.collisionData.touchPoints.other.right + "right")
            //console.log(this.collisionData.touchPoints.other.left + "left")
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                this.canvas.style.transition = "transform 1.5s, opacity 1s";
                this.canvas.style.transition = "transform 2s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom"; // Set the transform origin to the bottom
                this.canvas.style.transform = "scaleY(0)"; // Make the Goomba flat
                this.speed = 0;
                GameEnv.playSound("goombaDeath");

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);

    
                // Set a timeout to make GameEnv.invincible false after 2000 milliseconds (2 seconds)
                setTimeout(function () {
                this.destroy();
                GameEnv.invincible = false;
                }, 2000);
            }
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            }
            else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }
    }
}

export default Enemy;