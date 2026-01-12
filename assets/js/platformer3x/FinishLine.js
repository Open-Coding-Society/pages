import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class FinishLine extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.aspect_ratio = image.width / image.height;
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.bottom;
        this.scaleSize = data?.scaleSize || 80;
    }

    update() {
        // No update actions needed
    }

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        const scaledHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const finishlineX = this.x;
        const finishlineY = this.y;

        this.bottom = finishlineY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${finishlineX}px`;
        this.canvas.style.top = `${finishlineY}px`; 
    }
}

export default FinishLine;