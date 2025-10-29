import GameObject from './GameObject.js';

/** Background class for primary background
 * 
 */
export class GameEnvBackground extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.image = null;
        this.fillStyle = (data && data.fillStyle) ? data.fillStyle : '#063970';
        this.mode = (data && data.mode) ? data.mode : 'cover'; // cover | contain | repeat | stretch
        if (data && data.src) {
            this.image = new Image();
            this.image.src = data.src;
            // allow cross-origin images if provided
            if (data.crossOrigin) this.image.crossOrigin = data.crossOrigin;
        }
    }

    
    update() {
        this.draw();
    }

    
    draw() {
        const ctx = this.gameEnv.ctx;
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        if (this.image) {
            // Draw the background image according to mode
            if (this.mode === 'stretch') {
                ctx.drawImage(this.image, 0, 0, width, height);
            } else if (this.mode === 'repeat') {
                // create pattern and fill
                const pattern = ctx.createPattern(this.image, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, width, height);
            } else {
                // cover or contain behavior
                const imgW = this.image.width;
                const imgH = this.image.height;
                const scale = (this.mode === 'contain') ? Math.min(width / imgW, height / imgH) : Math.max(width / imgW, height / imgH);
                const drawW = imgW * scale;
                const drawH = imgH * scale;
                const dx = (width - drawW) / 2;
                const dy = (height - drawH) / 2;
                ctx.drawImage(this.image, dx, dy, drawW, drawH);
            }
        } else {
            // Fill the canvas with fillstyle color if no image is provided
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(0, 0, width, height);
        }
    }

    /** For primary background, resize is the same as draw
     *
     */
    resize() {
        this.draw();
    }

    /** Destroy Game Object
     * remove object from this.gameEnv.gameObjects array
     */
    destroy() {
        const index = this.gameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            this.gameEnv.gameObjects.splice(index, 1);
        }
    }
    
}

export default GameEnvBackground;