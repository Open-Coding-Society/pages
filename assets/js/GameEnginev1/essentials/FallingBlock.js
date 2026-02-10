import Npc from './Npc.js';

class FallingBlock extends Npc {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.fallSpeed = data?.fallSpeed || 2;
        this.maxY = data?.maxY || gameEnv.innerHeight;
        this.height = this.spriteData.pixels.height * this.spriteData.SCALE_FACTOR;
    }

    update() {
        if (this.position.y + this.height < this.maxY) {
            this.position.y += this.fallSpeed;
        } else {
            this.position.y = this.maxY - this.height;
        }

        this.draw();
    }
}

export default FallingBlock;
