import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class BackgroundParallax extends Background  {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = data.parallaxSpeed || 1; 
        this.moveOnKeyAction = data.moveOnKeyAction || false;
    }

    // speed is used to background parallax behavior
    update() {
        this.speed = this.moveOnKeyAction ? this.parallaxSpeed * GameEnv.backgroundDirection : this.parallaxSpeed;
        super.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        super.draw();
    }

}

export default BackgroundParallax;