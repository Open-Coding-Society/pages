import GameEnv from './GameEnv.js';

export class Background {
    constructor(imageSrc = null) {
        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc.src;
        } else {
            this.image = null;
        }
    }

    /* To draws are used to capture primary frame and wrap around to next frame
     * x to y is primary draw
     * x + width to y is wrap around draw
    */
    draw() {
        const ctx = GameEnv.ctx;
        const width = GameEnv.innerWidth-300;
        const height = GameEnv.innerHeight;

        if (this.image) {
            // Draw the background image scaled to the canvas size
            ctx.drawImage(this.image, 0, 0, width, height);
        } else {
            // Fill the canvas with white if no background image is provided
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, width, height);
        }
    }
}

export default Background;