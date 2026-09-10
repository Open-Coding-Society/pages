import Npc from './essentials/Npc.js';
import Player from './essentials/Player.js';

class Coin extends Npc {
	constructor(data = null, gameEnv = null) {
		// Prepare sprite-like data for Npc/Character to handle canvas creation
		const coinData = {
			id: data?.id || 'coin',
			greeting: false,
			INIT_POSITION: data?.INIT_POSITION || { x: 0.5, y: 0.5 },
			SCALE_FACTOR: data?.SCALE_FACTOR || 20, // Controls size
			pixels: { width: 100, height: 100 }, // Dummy size for canvas
			orientation: { rows: 1, columns: 1 },
			down: { row: 0, start: 0, columns: 1 },
			hitbox: data?.hitbox || { widthPercentage: 0.8, heightPercentage: 0.8 },
			...data
		};
		
		super(coinData, gameEnv);
		
		this.value = Number(data?.value ?? 1);
		this.collectCount = 0;
		this.collected = false;
		this.collectCooldownUntil = 0;
		this.color = data?.color || '#FFD700';
		
		// Set zIndex if provided
		if (data?.zIndex) {
			this.canvas.style.zIndex = String(data.zIndex);
		}
		
		console.log('Coin created:', this.spriteData.id, 'at position', this.position);
	}

	update() {
		if (this.collected) return;
		this.draw();
		this.checkPlayerCollision();
	}

	draw() {
		if (!this.ctx) return;
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		if (this.collected) return;
		
		// Draw a gold circle for the coin
		this.ctx.fillStyle = this.color;
		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;
		const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
		
		this.ctx.beginPath();
		this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		this.ctx.fill();
		
		// Add a border to make it more visible
		this.ctx.strokeStyle = '#B8860B'; // Dark gold
		this.ctx.lineWidth = 2;
		this.ctx.stroke();
		
		// Call setupCanvas to position the canvas (normally done in Character.draw())
		this.setupCanvas();
	}

	checkPlayerCollision() {
		if (performance.now() < this.collectCooldownUntil) return;
		for (const gameObj of this.gameEnv.gameObjects) {
			const id = String(gameObj?.id ?? gameObj?.spriteData?.id ?? '').toLowerCase();
			const isPlayer = gameObj instanceof Player || id.includes('player') || id.includes('chill guy');
			if (!isPlayer) continue;
			this.isCollision(gameObj);
			if (this.collisionData.hit) {
				this.collect();
				return;
			}
		}
	}

	collect() {
		this.collected = true;
		this.collectCooldownUntil = performance.now() + 200;
		this.collectCount += 1;
		
		// Update GameEnv stats (proper OOP - write to environment, not control)
		if (this.gameEnv) {
			// Ensure stats object exists
			if (!this.gameEnv.stats) {
				this.gameEnv.stats = { coinsCollected: 0 };
			}
			this.gameEnv.stats.coinsCollected = (this.gameEnv.stats.coinsCollected || 0) + this.value;
		}
		
		console.log(`Coin collected! Total: ${this.collectCount}`);
		
		// Move to new random position
		this.randomizePosition();
		this.collected = false;
	}

	randomizePosition() {
		// Randomize position as percentage (0-1) of screen size
		const newX = Math.random() * 0.8 + 0.1; // 10% to 90% of width
		const newY = Math.random() * 0.8 + 0.1; // 10% to 90% of height
		
		// Update position (Character uses this.position)
		this.position.x = newX * this.gameEnv.innerWidth;
		this.position.y = newY * this.gameEnv.innerHeight;
		
		// Update canvas position (Character's resize method will handle this properly)
		this.resize();
	}

	// Override destroy to clean up
	destroy() {
		// Call parent destroy which handles canvas removal
		if (super.destroy) {
			super.destroy();
		} else {
			// Fallback if parent doesn't have destroy
			if (this.canvas && this.canvas.parentNode) {
				this.canvas.parentNode.removeChild(this.canvas);
			}
			const index = this.gameEnv?.gameObjects?.indexOf(this);
			if (index > -1) {
				this.gameEnv.gameObjects.splice(index, 1);
			}
		}
	}
}

export default Coin;
export { Coin };
