import GameObject from './GameObject.js';

class Barrier extends GameObject {
    constructor(data = {}, gameEnv = null) {
        super(gameEnv);

        // Base data
        this.data = data || {};
        this.spriteData = { id: data.id || 'barrier', reaction: null };

        // Position and size
        this.x = Math.max(0, data.x | 0);
        this.y = Math.max(0, data.y | 0);
        this.width = Math.max(1, data.width | 0);
        this.height = Math.max(1, data.height | 0);
        this.visible = data.visible !== undefined ? !!data.visible : true;
        this.color = data.color || 'rgba(255, 0, 0, 0.15)';
        this.stroke = data.stroke || 'rgba(225, 0, 0, 0.85)';

        // Hitbox
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };

        // Create an individual canvas to participate in GameObject collision system
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.spriteData.id;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        document.getElementById('gameContainer').appendChild(this.canvas);

        // Initial sizing and styling
        this.resize();
        this.draw();
    }

    update() {
        // Barriers are static; we still redraw to keep visibility accurate
        this.draw();
    }

    draw() {
        if (!this.ctx) return;

        // Clear barrier canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Only draw visual if visible; canvas remains for collision either way
        if (this.visible) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeStyle = this.stroke;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    resize() {
        // Canvas internal size
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // CSS size and position relative to game area
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.x}px`;
        this.canvas.style.top = `${(this.gameEnv?.top || 0) + this.y}px`;
        this.canvas.style.zIndex = '8';
    }

    destroy() {
        // Remove canvas from DOM
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        // Remove from game objects
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
}

export default Barrier;
