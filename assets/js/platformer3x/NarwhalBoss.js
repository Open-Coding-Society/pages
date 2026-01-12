import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
import Enemy from './Enemy.js';


export class NarwhalBoss extends Enemy {
    // instantiation: constructor sets up player object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);

        this.storeSpeed = this.speed;

        this.animationSpeed = data?.animationSpeed || 1; //higher "animationSpeed" means slower animation
        this.counter = data?.animationSpeed; 

        this.enemySpeed();
    }
    //overwrite the method
    updateFrameX() {
        // Update animation frameX of the object
        if(!this.state.isDying || this.state.animation != "death"){
            if (this.frameX < this.maxFrame) {
                if(this.counter > 0){
                    this.frameX = this.frameX; 
                    this.counter--;
                }
                else{
                    this.frameX++
                    this.counter = this.animationSpeed;
                }
            } else {
                this.frameX = this.minFrame;
            }
        }
        else if(this.state.isDying && this.state.animation == "death"){
            this.animationSpeed = 20;
            if (this.frameX < this.maxFrame) {
                if(this.counter > 0){
                    this.frameX = this.frameX; 
                    this.counter--;
                }
                else{
                    this.frameX++
                    this.counter = this.animationSpeed;
                }
            } else {
                this.destroy();
            }
        }

    }

    //overwrite the method
    updateMovement(){
        if (this.state.animation === "right") {
            this.speed = Math.abs(this.storeSpeed)
        }
        else if (this.state.animation === "left") {
            this.speed = -Math.abs(this.storeSpeed);
        }
        else if (this.state.animation === "death") {
            this.speed = 0
        }
        else if (this.state.animation === "idleL") {
            this.speed = 0
        }
        else if (this.state.animation === "idleR") {
            this.speed = 0
        }

        // Move the enemy\
        this.x += this.speed;

        this.playerBottomCollision = false;
    }

    randomEvent(){
        if (GameControl.randomEventId === 1 && GameControl.randomEventState === 2){ //event: stop the zombie
            this.state.direction = "left";
            this.state.animation = "idleL"; 
            GameControl.endRandomEvent();
        }
        else if (GameControl.randomEventId === 2 && GameControl.randomEventState === 2){ //event: stop the zombie
            this.state.direction = "right";
            this.state.animation = "idleR"; 
            GameControl.endRandomEvent();
        }
        else if (GameControl.randomEventId === 3 && GameControl.randomEventState === 2){ //event: stop the zombie
            this.state.direction = "left";
            this.state.animation = "left"; 
            GameControl.endRandomEvent();
        }
        else if (GameControl.randomEventId === 4 && GameControl.randomEventState === 2){ //event: stop the zombie
            this.state.direction = "right";
            this.state.animation = "right"; 
            GameControl.endRandomEvent();
        }
    }

    update() {
        super.update();

        this.randomEvent();


    }

    //overwrite the method
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
            if (this.collisionData.touchPoints.other.right && !this.collisionData.touchPoints.other.bottom) {
                this.x--
                this.state.direction = "left";
                this.state.animation = "attackL"; 
                this.speed = 0;
            }
            else if(this.collisionData.touchPoints.other.left && !this.collisionData.touchPoints.other.bottom){
                this.x++
                this.state.direction = "right";
                this.state.animation = "attackR"; 
                this.speed = 0;
            }
            else if(this.collisionData.touchPoints.other.bottom && this.immune == 0){
                this.state.animation = "death";
                if(!this.state.isDying && this.state.animation == "death"){
                    this.frameX = 0;
                }
                this.state.isDying = true;
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                GameEnv.playSound("goombaDeath");
            }
            
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.state.direction === "left" && this.collisionData.touchPoints.other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            }
            else if (this.state.direction === "right" && this.collisionData.touchPoints.other.left) {
                this.state.direction = "left";
                this.state.animation = "left";
            }
        }
    }

}

export default NarwhalBoss;