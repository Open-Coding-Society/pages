import { Transform } from "./Transform.js";
import GameObject from './GameObject.js';

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
        this.points = data.points || 1;
        this.size = data.size || 16;
        this.hitbox = data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };
        
        // Create a canvas element for collision detection
        this.canvas = document.createElement('div');
        this.canvas.id = `coin-${Math.random().toString(36).substr(2, 9)}`;
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = this.x + 'px';
        this.canvas.style.top = this.y + 'px';
        this.canvas.style.width = this.size + 'px';
        this.canvas.style.height = this.size + 'px';
        this.canvas.style.pointerEvents = 'none';
        this.score = 0;
        document.body.appendChild(this.canvas);
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
        // Nothing special to do on resize for the coin
        this.draw();
    }

    /**
     * Check if player is close enough to coin and replace with new one if touched
     */
    checkPlayerProximity() {
        // Find all players in game objects
        const players = this.gameEnv.gameObjects.filter(obj => obj.canvas && obj.id);
        
        for (let player of players) {
            const playerRect = player.canvas.getBoundingClientRect();
            const playerX = playerRect.left + playerRect.width / 2;
            const playerY = playerRect.top + playerRect.height / 2;
            
            const coinCenterX = this.x + this.size / 2;
            const coinCenterY = this.y + this.size / 2;
            
            // Calculate distance between player and coin
            const dist = Math.sqrt(Math.pow(playerX - coinCenterX, 2) + Math.pow(playerY - coinCenterY, 2));
            
            // If close enough, destroy this coin and create a new one at random position
            if (dist < 50) {
                this.score += 1;
                // Update the game control's coin counter
                if (this.gameEnv && this.gameEnv.gameControl && typeof this.gameEnv.gameControl.collectCoin === 'function') {
                    this.gameEnv.gameControl.collectCoin(1);
                }
                this.createNewCoinAtRandomPosition();
                console.log("Coin collected! Score:", this.score);
                this.destroy();
            }
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
        const newX = Math.floor(Math.random() * (width - padding * 2) + padding);
        const newY = Math.floor(Math.random() * (height - padding * 2) + padding);
        
        // Create new coin with random position
        const newCoinData = {
            INIT_POSITION: { x: newX, y: newY },
            size: this.size,
            points: this.points,
            color: this.spriteData.color || 'yellow'
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