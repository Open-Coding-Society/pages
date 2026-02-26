import GameObject from './GameObject.js';

class Barrier extends GameObject {
    constructor(data, gameEnv) {
        super(gameEnv);
        // Position and size in game coordinates
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.color = data.color || 'rgba(255, 0, 0, 0.3)';
        this.visible = data.visible !== undefined ? data.visible : true;
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };

        // Create a dedicated canvas for collision (like Character/Npc)
        this.canvas = document.createElement('canvas');
        this.canvas.id = data.id || `barrier_${Math.random().toString(36).slice(2, 7)}`;
        this.canvas.width = Math.max(1, this.width);
        this.canvas.height = Math.max(1, this.height);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        const container = document.getElementById('gameContainer') || this.gameEnv?.gameContainer;
        if (container) container.appendChild(this.canvas);
        this.canvas.style.imageRendering = 'pixelated';
        this.canvas.style.zIndex = (data.zIndex !== undefined) ? String(data.zIndex) : '11';
        this.canvas.style.position = 'absolute';

        // Initial draw and position
        this.update();
    }

    update() {
        this.draw();
        this.setupCanvas();
    }

    draw() {
        // Clear then draw rectangle on its own canvas (for collision)
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.visible) return;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(225, 0, 0, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupCanvas() {
        // Position barrier canvas in game space; y offset includes gameEnv.top
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.style.left = `${this.x}px`;
        const topOffset = (this.gameEnv?.top || 0);
        this.canvas.style.top = `${topOffset + this.y}px`;
    }

    resize() {
        // Reposition relative to new game size proportionally
        if (!this.gameEnv) return;
        const newW = this.gameEnv.innerWidth;
        const newH = this.gameEnv.innerHeight;
        // Simple proportional scaling to keep placement relative; safe if env changes
        if (this.canvas && this.canvas.width && this.canvas.height) {
            const prevW = parseFloat(this.canvas.style.width) || this.canvas.width;
            const prevH = parseFloat(this.canvas.style.height) || this.canvas.height;
            const scaleX = newW / (this.gameEnv.canvas?.width || newW);
            const scaleY = newH / (this.gameEnv.canvas?.height || newH);
            this.x = Math.round(this.x * scaleX);
            this.y = Math.round(this.y * scaleY);
            this.width = Math.round(this.width * scaleX);
            this.height = Math.round(this.height * scaleY);
            this.canvas.width = Math.max(1, this.width);
            this.canvas.height = Math.max(1, this.height);
        }
        this.update();
    }

    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        const idx = this.gameEnv?.gameObjects?.indexOf?.(this) ?? -1;
        if (idx > -1) this.gameEnv.gameObjects.splice(idx, 1);
    }
}

export default Barrier;