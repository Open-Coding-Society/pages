import GameEnv from './GameEnv.js';
import PlayerBaseOneD from './PlayerBaseOneD.js';
import GameControl from './GameControl.js';
/**
 * @class PlayerHills class
 * @description PlayerHills.js key objective is to eent the user-controlled character in the game.
 *
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.
 *
 * @extends PlayerBase
 */
export class PlayerZombie extends PlayerBaseOneD {
    /** GameObject instantiation: constructor for PlayerHills object
     * @extends Character
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);
        this.invisible = true;
        // Goomba variables, deprecate?
        this.timer = false;
        GameEnv.invincible = false; // Player is not invincible
    }
    /**
     * @override
     * gameLoop helper: Update Player jump height, replaces PlayerBase updateJump using settings from GameEnv
     */
    updateJump() {
        let jumpHeightFactor;
        if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.50;
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.40;
        }
        if (GameEnv.currentLevel.tag == "boss") {
            jumpHeightFactor = 0.50;
        }
        this.setY(this.y - (this.bottom * jumpHeightFactor));
    }
    /**
     * @override
     * gameLoop: Watch for Player collision events
     */
    handleCollisionStart() {
        super.handleCollisionStart(); // calls the super class method
        // adds additional collision events
        this.handleCollisionEvent("finishline");
        this.handleCollisionEvent("boss");
    }
    /**
 * @override
 * gameLoop: Watch for Player collision events
 */
    update() {
        GameEnv.x = this.x;
        GameEnv.y = this.y;
        GameEnv.canvasWidth = this.canvasWidth;

        // Update the y position of the character based on gravity
        this.updateY();
        // Update animation frameX of the object
        this.updateFrameX();
        // Check for collisions, defined in GameObject which calls the collisionAction method
        this.collisionChecks();
        
        // player methods
        this.updateMovement();
        if (GameEnv.playerChange) {
            this.invisible = false;
        }
        if (!this.invisible) {
            this.updateAnimation();
        }
    }
    /**
 * @override
 * gameLoop: Watch for Player collision events
 */
    draw() {
        // Set fixed dimensions and position for the Character
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.x}px`; // Set character horizontal position based on its x-coordinate
        this.canvas.style.top = `${this.y}px`; // Set character up and down position based on its y-coordinate
        this.ctx.fillStyle = "black";
        this.ctx.font = "10px Arial";
        if (!this.invisible) {
            this.ctx.fillText(this.name, 0, this.canvas.height / 4);
            this.ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,
                this.spriteWidth,
                this.spriteHeight,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        }
    }
    /**
     * @override
     */
    updateAnimation() {
        switch (this.state.animation) {
            case 'idle':
                if (this.state.direction == "left") {
                    this.canvas.style.transform = 'scaleX(-1)';
                }
                else {
                    this.canvas.style.transform = 'scaleX(1)';
                }
                this.setSpriteAnimation(this.playerData.idle);
                break;
            case 'walk':
                if (this.state.direction == "left") {
                    this.canvas.style.transform = 'scaleX(-1)';
                }
                else {
                    this.canvas.style.transform = 'scaleX(1)';
                }
                this.setSpriteAnimation(this.playerData.walk);
                break;
            case 'run':
                if (this.state.direction == "left") {
                    this.canvas.style.transform = 'scaleX(-1)';
                }
                else {
                    this.canvas.style.transform = 'scaleX(1)';
                }
                this.setSpriteAnimation(this.playerData.run);
                break;
            case 'jump':
                if (this.state.direction == "left") {
                    this.canvas.style.transform = 'scaleX(-1)';
                }
                else {
                    this.canvas.style.transform = 'scaleX(1)';
                }
                this.setSpriteAnimation(this.playerData.jump);
                break;
            case 'attack':
                if (this.state.direction == "left") {
                    this.canvas.style.transform = 'scaleX(-1)';
                }
                else {
                    this.canvas.style.transform = 'scaleX(1)';
                }
                this.setSpriteAnimation(this.playerData.attack);
                break;
            default:
                console.error(`Invalid state: ${this.state.animation}`);
        }
    }
    /**
     * @override
     */
    handleKeyUp(event) {
        const key = event.key;
        if (key in this.pressedKeys) {
            delete this.pressedKeys[key];
            if (Object.keys(this.pressedKeys).length > 0) {
                // If there are still keys in pressedKeys, update the state to the last one
                const lastKey = Object.keys(this.pressedKeys)[Object.keys(this.pressedKeys).length - 1];
                this.updateAnimationState(lastKey);
                GameEnv.updateParallaxDirection(lastKey)
            } else {
                // If there are no more keys in pressedKeys, update the state to null
                GameEnv.playerAttack = false;
                this.updateAnimationState(null);
                GameEnv.updateParallaxDirection(null)
            }
        }
    }
    /**
     * @override
     */
    updateAnimationState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.animation = 'walk';
                GameEnv.playerAttack = false;
                break;
            case 'w':
                if (this.state.movement.up == false) {
                    this.state.movement.up = true;
                    this.state.animation = 'jump';
                }
                GameEnv.playerAttack = false;
                break;
            case 's':
                if ("a" in this.pressedKeys || "d" in this.pressedKeys) {
                    this.state.animation = 'run';
                }
                GameEnv.playerAttack = false;
                break;
            case 'Shift':
                this.state.animation = 'attack';  // Example action for Space key
                if(GameEnv.playerChange){
                    GameEnv.playerAttack = true;
                }
                break;
            default:
                this.state.animation = 'idle';
                GameEnv.playerAttack = false;
                break;
        }
    }
    /**
     * @override
     * gameloop: Handles additional Player reaction / state updates to the collision for game level
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); // calls the super class method
        // handles additional player reactions
        switch (this.state.collision) {
            case "finishline":
                // 1. Caught in finishline
                if (this.collisionData.touchPoints.this.onTopofOther  || this.state.isFinishing ) {
                    // Position player in the center of the finishline 
                    this.x = this.collisionData.newX;
                    this.state.movement = { up: false, down: false, left: false, right: false, falling: false};
                    this.state.isFinishing = true;
                    this.gravityEnabled = true;
                    // Using natural gravity wait for player to reach floor
                    if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                        // Force end of level condition
                        this.x = GameEnv.innerWidth + 1;
                    }
                // 2. Collision between player right and finishline   
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                // 3. Collision between player left and finishline
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
                break;
            case "boss": // Note: Goomba.js and Player.js could be refactored
                // 1. Player jumps on goomba, interaction with Goomba.js
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom && this.state.isDying == false) {
                    // GoombaBounce deals with player.js and goomba.js
                    if (GameEnv.goombaBounce === true) {
                        GameEnv.goombaBounce = false;
                        this.y = this.y - 100;
                    }
                    if (GameEnv.goombaBounce1 === true) {
                        GameEnv.goombaBounce1 = false;
                        this.y = this.y - 250
                    }
                    // 2. Player touches goomba sides of goomba
                } else if (this.collisionData.touchPoints.this.right || this.collisionData.touchPoints.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(async () => {
                                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                            }, 900);
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                        this.x += 10;
                    }
                }
                break;
        }
    }
}
export default PlayerZombie;