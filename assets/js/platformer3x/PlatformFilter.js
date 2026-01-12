
import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
//import PlatformBase from '.PlatformBase.js'

export class PlatformFilter extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage, name) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.data = data;
        this.name = name;
        this.relativeX = ""; //used for the item block's spritesheet.
        this.canvas.style.filter = 'blur(5px)'; //blur
        this.canvas.style.filter = 'hue-rotate(90deg)'; //change colour
        this.canvas.style.filter = 'sepia(0.9)'; //old
        this.canvas.style.filter = 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5))'; //adds shadow
    }

    update() {
        this.changeAppearance();
    }

    changeAppearance() {
       
        const element = document.getElementById('yourElementId');
    
    // Apply CSS filter
    //this.canvas.style.filter = 'blur(5px)';
    this.canvas.style.filter = 'hue-rotate(90deg)';
    //this.canvas.style.filter = 'sepia(0.9)';
    //this.canvas.style.filter = 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5))';

    }
    //set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
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
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }
}

export default PlatformFilter;

