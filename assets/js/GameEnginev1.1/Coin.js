import GameObject from './GameObject.js';
import Player from './essentials/Player.js';

class Coin extends GameObject {
	constructor(data = null, gameEnv = null) {
		super(gameEnv);
		this.data = data || {};
		this.value = Number(data?.value ?? 1);
		this.collectCount = 0;
		this.collected = false;
		this.collectCooldownUntil = 0;
		this.color = data?.color || '#FFD700';
		this.width = Number(data?.width ?? 60);
		this.height = Number(data?.height ?? 40);
		this.x = Number(data?.INIT_POSITION?.x ?? 0);
		this.y = Number(data?.INIT_POSITION?.y ?? 0);
		this.hitbox = data?.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };
		this.spriteData = { id: data?.id || 'coin', greeting: false, reaction: null };

		this.canvas = document.createElement('canvas');
		this.canvas.id = this.spriteData.id;
		this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
		document.getElementById('gameContainer').appendChild(this.canvas);

		this.resize();
		this.draw();
	}

	update() {
		if (this.collected) return;
		this.draw();
		this.checkPlayerCollision();
	}

	draw() {
		if (!this.ctx) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.color;
		// Draw a circle instead of a rectangle
		const radius = Math.min(this.canvas.width, this.canvas.height) / 2;
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, Math.PI * 2);
		this.ctx.fill();
	}

	resize() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = `${this.x}px`;
		this.canvas.style.top = `${(this.gameEnv?.top || 0) + this.y}px`;
		this.canvas.style.zIndex = '12';
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
		const gameControl = this.gameEnv?.gameControl;
		if (gameControl) {
			gameControl.coinsCollected = (gameControl.coinsCollected || 0) + this.value;
			if (!gameControl.stats) gameControl.stats = {};
			gameControl.stats.coinsCollected = (gameControl.stats.coinsCollected || 0) + this.value;
		}
		console.log(`Coin collected: ${this.collectCount}`);
		this.randomizePosition();
		this.collected = false;
	}

	randomizePosition() {
		const maxX = Math.max(0, this.gameEnv.innerWidth - this.width);
		const maxY = Math.max(0, this.gameEnv.innerHeight - this.height);
		this.x = Math.floor(Math.random() * (maxX + 1));
		this.y = Math.floor(Math.random() * (maxY + 1));
		this.resize();
	}

	destroy() {
		if (this.canvas && this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
		const index = this.gameEnv.gameObjects.indexOf(this);
		if (index !== -1) {
			this.gameEnv.gameObjects.splice(index, 1);
		}
	}
}

export default Coin;
export { Coin };
