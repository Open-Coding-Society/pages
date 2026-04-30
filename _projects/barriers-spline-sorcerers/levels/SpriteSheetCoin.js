import Coin from '@assets/js/GameEnginev1.1/Coin.js';

/**
 * SpriteSheetCoin extends the basic Coin class to support image/spritesheet rendering.
 * Instead of a colored circle, you can now display any image asset (gem, star, etc).
 * 
 * @example
 * const gemCoin = new SpriteSheetCoin({
 *   id: 'gem-coin',
 *   INIT_POSITION: { x: 0.5, y: 0.5 },
 *   SCALE_FACTOR: 30,
 *   value: 5,
 *   spriteImagePath: '/images/gem.png',
 *   // Optional: if using a spritesheet with multiple frames
 *   spriteFrames: { rows: 2, columns: 2, frameIndex: 0 }
 * }, gameEnv);
 */
class SpriteSheetCoin extends Coin {
	constructor(data = null, gameEnv = null) {
		super(data, gameEnv);
		
		this.spriteImagePath = data?.spriteImagePath || null;
		this.spriteImage = null;
		this.isImageLoaded = false;
		this.spriteFrames = data?.spriteFrames || { rows: 1, columns: 1, frameIndex: 0 };
		this.fallbackToCircle = data?.fallbackToCircle !== false; // Default true
		
		// Load the image if provided
		if (this.spriteImagePath) {
			this.loadImage();
		}
	}

	/**
	 * Load the sprite image asynchronously
	 */
	loadImage() {
		const img = new Image();
		img.onload = () => {
			this.spriteImage = img;
			this.isImageLoaded = true;
			console.log(`SpriteSheetCoin image loaded: ${this.spriteImagePath}`);
		};
		img.onerror = () => {
			console.warn(`Failed to load SpriteSheetCoin image: ${this.spriteImagePath}`);
			this.isImageLoaded = false;
		};
		img.src = this.spriteImagePath;
	}

	/**
	 * Draw the coin using spritesheet if available, otherwise fall back to colored circle
	 */
	draw() {
		if (!this.ctx) return;
		
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		if (this.collected) return;
		
		// Draw sprite image if loaded
		if (this.isImageLoaded && this.spriteImage) {
			this.drawSpriteImage();
		} else if (this.fallbackToCircle) {
			// Fall back to the original colored circle
			this.drawCircle();
		}
		
		// Call setupCanvas to position the canvas (normally done in Character.draw())
		this.setupCanvas();
	}

	/**
	 * Draw the sprite image on the canvas
	 */
	drawSpriteImage() {
		const { rows, columns, frameIndex } = this.spriteFrames;
		
		// Calculate frame dimensions
		const frameWidth = this.spriteImage.width / columns;
		const frameHeight = this.spriteImage.height / rows;
		
		// Calculate which frame to display based on frameIndex
		const currentFrameIndex = frameIndex % (rows * columns);
		const row = Math.floor(currentFrameIndex / columns);
		const col = currentFrameIndex % columns;
		
		const sourceX = col * frameWidth;
		const sourceY = row * frameHeight;
		
		// Draw the sprite frame centered on the canvas
		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;
		const drawWidth = this.canvas.width;
		const drawHeight = this.canvas.height;
		
		this.ctx.drawImage(
			this.spriteImage,
			sourceX, sourceY,           // Source position
			frameWidth, frameHeight,    // Source size
			centerX - drawWidth / 2, centerY - drawHeight / 2, // Destination position (centered)
			drawWidth, drawHeight       // Destination size
		);
	}

	/**
	 * Draw the fallback colored circle (original Coin behavior)
	 */
	drawCircle() {
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
	}

	/**
	 * Update the frame index if using animation frames
	 * Call this to animate through spritesheet frames
	 * @param {number} frameIndex - The frame index to display
	 */
	setFrameIndex(frameIndex) {
		this.spriteFrames.frameIndex = frameIndex;
	}

	/**
	 * Change the sprite image
	 * @param {string} imagePath - Path to the new image
	 */
	setSprite(imagePath) {
		this.spriteImagePath = imagePath;
		this.isImageLoaded = false;
		this.loadImage();
	}

	/**
	 * Get whether the sprite image is ready to render
	 */
	isSpriteReady() {
		return this.isImageLoaded && this.spriteImage !== null;
	}
}

export default SpriteSheetCoin;
