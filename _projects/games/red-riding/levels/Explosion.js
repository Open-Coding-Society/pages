class Explosion {
    constructor(x, y, gameEnv) {
        this.x = x;
        this.y = y;
        this.gameEnv = gameEnv;
        this.sprite = new Image();
        this.sprite.src = gameEnv.path + "/images/projects/red-riding/lrrh-lvl3-kaboom.png";
        this.width = 128;
        this.height = 128;
        this.creationTime = Date.now();
        this.duration = 1000; // 1 second
        this.destroyed = false;
    }

    update() {
        if (Date.now() - this.creationTime > this.duration) {
            this.destroy();
        }
    }

    draw() {
        if (!this.destroyed && this.sprite.complete) {
            this.gameEnv.ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index !== -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }
}

export default Explosion;
