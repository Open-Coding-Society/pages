class HitMarker {
    constructor(x, y, gameEnv) {
        this.x = x;
        this.y = y;
        this.gameEnv = gameEnv;
        this.sprite = new Image();
        this.sprite.src = gameEnv.path + "/images/projects/red-riding/lrrh-lvl3-hit-marker.png";
        this.width = 32;
        this.height = 32;
        this.creationTime = Date.now();
        this.duration = 500; // 0.5 second
        this.destroyed = false;
    }

    update() {
        // Check if duration has passed
        if (Date.now() - this.creationTime > this.duration) {
            this.destroy();
        }
    }

    draw() {
        if (!this.destroyed && this.sprite.complete) {
            this.gameEnv.ctx.drawImage(
                this.sprite,
                this.x - this.width / 2, // Center horizontally
                this.y - this.height,    // Above the enemy
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

export default HitMarker;