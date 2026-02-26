import GameObject from './GameObject.js';

/** Background class for primary background
 * 
 */
export class GameEnvBackground extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        if (data.src) {
            this.image = new Image();
            this.image.src = data.src;
        } else {
            this.image = null;
        }
    }

    
    update() {
        this.draw();
    }

    
    draw() {
        const ctx = this.gameEnv.ctx;
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        if (this.image) {
            // Draw the background image scaled to the canvas size
            ctx.drawImage(this.image, 0, 0, width, height);
        } else {
            // Fill the canvas with fillstyle color if no image is provided
            ctx.fillStyle = '#063970';
            ctx.fillRect(0, 0, width, height);
        }
    }

    /** For primary background, resize is the same as draw
     *
     */
    resize() {
        this.draw();
    }

    /** Destroy Game Object
     * remove object from this.gameEnv.gameObjects array
     */
    destroy() {
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
    
}

export default GameEnvBackground;