import { Transform } from "../GameEngine/essentials/Transform.js";
import GameObject from '../GameEngine/essentials/GameObject.js';

// Low-level utility Coin class (kept for compatibility)
export class Coin {
    constructor(x, y, points, size) {
        this.transform = new Transform(x, y);
        this.points = points;
        this.size = size;
    }

    collide(target) {
        const dist = this.transform.distanceTo(target);
        if (dist < this.size) {
            return true;
        }
        return false;
    }

    draw(ctx, canvas) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.transform.x + canvas.width/2, this.transform.y + canvas.height/2, this.size, this.size);
    }
};

// GameObject-compatible wrapper so coins can be used in GameLevel classes
export default class CoinObject extends GameObject {
    constructor(data = {}, gameEnv = null) {
        super(gameEnv);
        this.spriteData = data;
        // Position on canvas (defaults near top-left)
        this.x = (data.INIT_POSITION && data.INIT_POSITION.x) || (data.x || 50);
        this.y = (data.INIT_POSITION && data.INIT_POSITION.y) || (data.y || 50);
        this.xRatio = data.xRatio;
        this.yRatio = data.yRatio;
        this.points = data.points || 1;
        this.size = data.size || 16;
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };
        
        // Create a canvas element for collision detection
        this.canvas = document.createElement('div');
        this.canvas.id = `coin-${Math.random().toString(36).substr(2, 9)}`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.pointerEvents = 'none';
        this.score = 0;
        const container = this.gameEnv?.container || document.body;
        container.appendChild(this.canvas);
        this.updatePositionRatios();
        this.updateCollisionElement();
    }

    update() {
        // Check for proximity with player and move if touched
        this.checkPlayerProximity();
        this.draw();
    }

    draw() {
        const ctx = this.gameEnv && this.gameEnv.ctx;
        if (!ctx) return;
        ctx.fillStyle = this.spriteData.color || 'yellow';
        // draw a simple square coin; position is absolute canvas coords
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    resize() {
        this.applyPositionRatios();
        this.clampToCanvas();
        this.updatePositionRatios();
        this.updateCollisionElement();
        this.draw();
    }

    updatePositionRatios() {
        const width = this.gameEnv?.innerWidth || window.innerWidth;
        const height = this.gameEnv?.innerHeight || window.innerHeight;
        if (width > 0) this.xRatio = this.x / width;
        if (height > 0) this.yRatio = this.y / height;
    }

    applyPositionRatios() {
        const width = this.gameEnv?.innerWidth || window.innerWidth;
        const height = this.gameEnv?.innerHeight || window.innerHeight;
        if (this.xRatio !== undefined && width > 0) this.x = this.xRatio * width;
        if (this.yRatio !== undefined && height > 0) this.y = this.yRatio * height;
    }

    clampToCanvas() {
        const width = this.gameEnv?.innerWidth || window.innerWidth;
        const height = this.gameEnv?.innerHeight || window.innerHeight;
        const maxX = Math.max(0, width - this.size);
        const maxY = Math.max(0, height - this.size);

        this.x = Math.min(Math.max(0, this.x), maxX);
        this.y = Math.min(Math.max(0, this.y), maxY);
    }

    updateCollisionElement() {
        const scaleX = this.gameEnv?.canvasScaleX || 1;
        const scaleY = this.gameEnv?.canvasScaleY || 1;
        const offsetLeft = this.gameEnv?.canvasOffsetLeft || 0;
        const offsetTop = this.gameEnv?.canvasOffsetTop || 0;

        this.canvas.style.left = `${offsetLeft + (this.x * scaleX)}px`;
        this.canvas.style.top = `${offsetTop + (this.y * scaleY)}px`;
        this.canvas.style.width = `${this.size * scaleX}px`;
        this.canvas.style.height = `${this.size * scaleY}px`;
    }

    /**
     * Check if player is close enough to coin and replace with new one if touched
     */
    checkPlayerProximity() {
        if (!this.gameEnv || !this.gameEnv.gameObjects) return;
        
        // Find player in game objects - look for player by id or class name
        const player = this.gameEnv.gameObjects.find(obj => 
            obj.id?.toLowerCase().includes('player') || 
            obj.constructor.name === 'Player'
        );
        
        if (!player) return;
        
        // Get player position from transform (adventure game uses transform for position)
        const playerX = player.transform?.x ?? 0;
        const playerY = player.transform?.y ?? 0;
        
        // Get player dimensions
        const playerWidth = player.width || player.size || 30;
        const playerHeight = player.height || player.size || 30;
        
        // Calculate centers for distance calculation
        const playerCenterX = playerX + playerWidth / 2;
        const playerCenterY = playerY + playerHeight / 2;
        
        const coinCenterX = this.x + this.size / 2;
        const coinCenterY = this.y + this.size / 2;
        
        // Calculate distance between player center and coin center
        const dx = playerCenterX - coinCenterX;
        const dy = playerCenterY - coinCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // If close enough (within 50 pixels), collect the coin
        if (dist < 50) {
            this.score += 1;
            console.log("Coin collected! Score:", this.score);
            
            // Update the game control's coin counter
            if (this.gameEnv && this.gameEnv.gameControl && typeof this.gameEnv.gameControl.collectCoin === 'function') {
                this.gameEnv.gameControl.collectCoin(1);
            }
            
            // Remove this coin and create a new one at random position
            this.destroy();
            this.createNewCoinAtRandomPosition();
        }
    }

    /**
     * Create a new coin at a random position and add it to gameObjects
     */
    createNewCoinAtRandomPosition() {
        const width = this.gameEnv?.innerWidth || window.innerWidth;
        const height = this.gameEnv?.innerHeight || window.innerHeight;
        
        // Generate random position with padding to keep coin visible
        const padding = 50;
        const safeWidth = Math.max(0, width - padding * 2);
        const safeHeight = Math.max(0, height - padding * 2);
        const newX = Math.floor(Math.random() * safeWidth + padding);
        const newY = Math.floor(Math.random() * safeHeight + padding);
        
        // Create new coin with random position
        const newCoinData = {
            INIT_POSITION: { x: newX, y: newY },
            size: this.size,
            points: this.points,
            color: this.spriteData.color || 'yellow',
            xRatio: width > 0 ? newX / width : undefined,
            yRatio: height > 0 ? newY / height : undefined
        };
        
        const newCoin = new CoinObject(newCoinData, this.gameEnv);
        this.gameEnv.gameObjects.push(newCoin);
    }

    destroy() {
        // Remove canvas element
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
}
