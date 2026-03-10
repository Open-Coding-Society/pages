import GameObject from './GameObject.js';

class Barrier extends GameObject {
    constructor(data, gameEnv) {
        super(gameEnv);
        
        // Handle position with relative (0-1) or absolute pixel values
        const xVal = data.x !== undefined ? data.x : 0;
        const yVal = data.y !== undefined ? data.y : 0;
        const wVal = data.width !== undefined ? data.width : 0;
        const hVal = data.height !== undefined ? data.height : 0;
        
        // If values are between 0-1, treat as percentages; otherwise use as pixels
        if (xVal >= 0 && xVal <= 1 && yVal >= 0 && yVal <= 1) {
            // Convert decimal percentages to pixel positions
            this.x = xVal * this.gameEnv.innerWidth;
            this.y = yVal * this.gameEnv.innerHeight;
            this.isRelativePosition = true;
        } else {
            // Use as pixel values (backward compatibility)
            this.x = xVal;
            this.y = yVal;
            this.isRelativePosition = false;
        }
        
        // Handle size with relative (0-1) or absolute pixel values
        if (wVal >= 0 && wVal <= 1 && hVal >= 0 && hVal <= 1) {
            // Convert decimal percentages to pixel dimensions
            this.width = wVal * this.gameEnv.innerWidth;
            this.height = hVal * this.gameEnv.innerHeight;
            this.isRelativeSize = true;
        } else {
            // Use as pixel values (backward compatibility)
            this.width = wVal;
            this.height = hVal;
            this.isRelativeSize = false;
        }
        
        // Store original relative/percentage values for resize
        this.relativeX = xVal;
        this.relativeY = yVal;
        this.relativeWidth = wVal;
        this.relativeHeight = hVal;
        
        this.color = data.color || 'rgba(255, 0, 0, 0.3)';
        this.visible = data.visible !== undefined ? data.visible : true;
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };

        // Create a dedicated canvas for collision (like Character/Npc)
        this.canvas = document.createElement('canvas');
        this.canvas.id = data.id || `barrier_${Math.random().toString(36).slice(2, 7)}`;
        this.canvas.width = Math.max(1, this.width);
        this.canvas.height = Math.max(1, this.height);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        const container = this.gameEnv?.container;
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
        // Reposition relative to new game size
        if (!this.gameEnv) return;
        
        // If using relative positioning (0-1), recalculate from original percentages
        if (this.isRelativePosition) {
            this.x = this.relativeX * this.gameEnv.innerWidth;
            this.y = this.relativeY * this.gameEnv.innerHeight;
        } else {
            // For absolute positioning, scale proportionally (backward compatibility)
            const newW = this.gameEnv.innerWidth;
            const newH = this.gameEnv.innerHeight;
            if (this.canvas && this.canvas.width && this.canvas.height) {
                const scaleX = newW / (this.gameEnv.canvas?.width || newW);
                const scaleY = newH / (this.gameEnv.canvas?.height || newH);
                this.x = Math.round(this.x * scaleX);
                this.y = Math.round(this.y * scaleY);
            }
        }
        
        // If using relative size (0-1), recalculate from original percentages
        if (this.isRelativeSize) {
            this.width = this.relativeWidth * this.gameEnv.innerWidth;
            this.height = this.relativeHeight * this.gameEnv.innerHeight;
        } else {
            // For absolute size, scale proportionally (backward compatibility)
            const newW = this.gameEnv.innerWidth;
            const newH = this.gameEnv.innerHeight;
            if (this.canvas && this.canvas.width && this.canvas.height) {
                const scaleX = newW / (this.gameEnv.canvas?.width || newW);
                const scaleY = newH / (this.gameEnv.canvas?.height || newH);
                this.width = Math.round(this.width * scaleX);
                this.height = Math.round(this.height * scaleY);
            }
        }
        
        // Update canvas dimensions
        this.canvas.width = Math.max(1, this.width);
        this.canvas.height = Math.max(1, this.height);
        
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