import GameObject from './GameObject.js';

/** Background class for primary background
 * 
 */
export class GameEnvBackground extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.data = data; // Store the data for identification

        this.image = null;
        this.imageReady = false;

        const primarySrc = data?.src;
        const fallbackSrc = data?.fallbackSrc;
        if (!primarySrc) return;

        const loadImage = (src, { onFail } = {}) => {
            const img = new Image();
            // Attach handlers BEFORE setting src (avoid races).
            img.onload = () => {
                this.image = img;
                this.imageReady = true;
            };
            img.onerror = () => {
                if (typeof onFail === 'function') onFail();
                else {
                    this.image = null;
                    this.imageReady = false;
                }
            };
            img.src = src;
        };

        loadImage(primarySrc, {
            onFail: () => {
                if (fallbackSrc && typeof fallbackSrc === 'string') {
                    loadImage(fallbackSrc);
                } else {
                    this.image = null;
                    this.imageReady = false;
                }
            }
        });
    }

    
    update() {
        this.draw();
    }

    
    draw() {
        const ctx = this.gameEnv.ctx;
        const width = this.gameEnv.innerWidth;
        const height = this.gameEnv.innerHeight;

        if (this.image && this.imageReady && this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(this.image, 0, 0, width, height);
        } else {
            // Fill the canvas with fillstyle color if no image is provided
            ctx.fillStyle = '#063970';
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