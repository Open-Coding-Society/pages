import GameControl from './GameControl.js';
import GameEnv from './GameEnv.js';
import JumpPlatform from './PlatformJump.js';

export class BossItem extends JumpPlatform {
    constructor(canvas, image, data, xPercentage, yPercentage, name) {
        super(canvas, image, data, xPercentage, yPercentage, name);
    }

    // Required, but no update action
    update() {
        super.update();
    }

    collisionAction() {
        //collision only detects mario and it only applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock") {
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent("zombie");
                    //console.log("randomEventtriggered", GameControl.randomEventId);
                };
                this.relativeX = -1 * this.canvas.width;
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
        }        
    }

    // Set platform position
    size() {
        super.size();

    }

    // Draw position is always 0,0
    draw() {
        if(!GameEnv.playerChange){
            this.ctx.drawImage(this.image, this.relativeX, 0, this.canvas.width / this.data.widthRatio, this.canvas.height / this.data.heightRatio);
        }
        else{
            this.destroy();
        }
    }
}

export default BossItem;