// Clicker.js - A Clicker GameObject for GameEnginev1.1
import Npc from "./Npc.js";

class Clicker extends Npc {
    constructor(data = {}, gameEnv = null) {
        super(data, gameEnv);
        this.clcks = 0;
    }

    handleClick(event) {
        if (this.interact) {
            this.clcks++;
            // Backward compatible: callbacks that only use the first arg still work.
            this.interact(this.clcks, this.spriteData?.id || this.uniqueId || 'unknown', this);
        }
    }

    draw() {
        // Draw the NPC sprite as usual
        super.draw();
        // Draw the click counter on top of the box
        if (this.ctx && this.canvas) {
            this.ctx.save();
            this.ctx.font = 'bold 32px Arial';
            this.ctx.fillStyle = 'yellow';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Center of the box
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(this.clcks.toString(), centerX, centerY);
            this.ctx.fillText(this.clcks.toString(), centerX, centerY);
            this.ctx.restore();
        }
    }

}

export default Clicker;
