import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class BackgroundTransitions extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);
        GameEnv.transitionHide = false
    }

    
    update() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        super.update();
        if (GameEnv.transitionHide === true) {
            //this.ctx.globalAlpha = 0;
            this.destroy();
        }
    }
}

export default BackgroundTransitions;