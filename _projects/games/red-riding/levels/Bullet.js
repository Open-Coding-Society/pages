class Bullet {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.velocity = data.velocity || { x: 0, y: 0 };
        this.gameEnv = data.gameEnv;
        this.shooter = data.shooter;
        this.direction = data.direction || 'down';
        this.width = 20; // Made slightly smaller for better "bullet" feel
        this.height = 20;
        this.lifetime = 3000; // Reduced to 3s (10s is too long for a small notebook screen)
        this.creationTime = Date.now();
        this.destroyed = false;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Auto-destroy if off-screen (Crucial for Notebooks)
        if (this.x < 0 || this.x > this.gameEnv.innerWidth || 
            this.y < 0 || this.y > this.gameEnv.innerHeight) {
            this.destroy();
        }

        if (Date.now() - this.creationTime > this.lifetime) {
            this.destroy();
        }
    }

    draw() {
    if (this.destroyed) return;
    
    const ctx = this.gameEnv.ctx;
    if (!ctx) return;

    // Use save/restore to ensure we don't mess up other drawings
    ctx.save(); 
    
    // Set styles
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;

    // Force a fresh path for this rectangle
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
    
    // Temporary: Add this to your console to confirm DRAW is actually happening
    // console.log("Bullet drawing at: ", this.x, this.y);
}

    checkCollision(target) {
        if (this.destroyed || !target) return false;
        // Basic AABB collision
        return this.x < target.x + target.width &&
               this.x + this.width > target.x &&
               this.y < target.y + target.height &&
               this.y + this.height > target.y;
    }

    destroy() {
        if (!this.destroyed) {
            this.destroyed = true;
            // Find ourselves in the game objects and remove ourselves!
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index !== -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }
}

export default Bullet;