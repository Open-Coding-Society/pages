import GameObject from './GameObject.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import BlockPlatform from './BlockPlatform.js';

export class FlyingIsland extends BlockPlatform {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data, xPercentage, yPercentage);
    }

    update() {
        super.update();
    }

    draw() {
        super.draw();
    }

    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledWidth = this.canvas.width*0.75;
        const scaledHeight = this.canvas.height*0.75;
        
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;                    
    }

}


export default FlyingIsland;