import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import Laser from './Laser.js';
var debounce = 0;

export class skibidiTitan extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;


    }
    
    killBeam(target) {
        if (target.timer === false) {
            target.timer = true;
            if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                target.canvas.style.transition = "transform 0.5s";
                target.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                GameEnv.playSound("PlayerDeath");

                if (target.state.isDying == false) {
                    target.state.isDying = true;
                    setTimeout(async() => {
                        await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                        console.log("level restart")
                        target.state.isDying = false;
                    }, 900); 
                }
            } else if (GameEnv.difficulty === "easy") {
                this.x += 10;
            }
        }
    }

    update() {
        super.update();
        this.immune = 1;
        var laser = document.getElementById("Laser")
        if(debounce < 240 && debounce > -1){
            laser.style.left = `-2000px`;
            this.x = GameEnv.PlayerPosition.playerX - 0.14*GameEnv.innerWidth;
            debounce += 1;
        }
        if(debounce < -120){
            debounce += 1;
            if(debounce == -235){GameEnv.playSound("laserCharge");}
            this.canvas.style.filter = `invert(${debounce+240}%)`
        }else if(debounce < 0 && debounce >= -120){
            debounce += 1;
            this.canvas.style.filter = `invert(0%)`
            laser.style.left = `${this.x + 0.14*GameEnv.innerWidth}px`;
            if(debounce == -115){GameEnv.playSound("laserSound");}

            var plrPos = GameEnv.PlayerPosition.playerX
           
            
            if (this.x >= plrPos - 250 && this.x <= plrPos - 150) {
                //setTimeout(Plr.goombaCollision.bind(this), 50);
                this.killBeam(GameEnv.player);
                debounce = 0;
                laser.style.left = `${this.x+0.14*GameEnv.innerWidth}px`;
            }
        }

        if(debounce == 240){
            debounce = -240;
        }
        //console.log((GameEnv.PlayerPosition.playerX - 200) + " " + this.x);
        
        
        
        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.immune = 1;
        }

        // Move the enemy
        //this.x -= this.speed;
        this.y = 0.25*GameEnv.innerHeight;
        this.playerBottomCollision = false;


        
    }
    
    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
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
    }
}

export default skibidiTitan;