import Background from './Background.js';

export class BackgroundSnow extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = 0.3; // Speed for vertical parallax scrolling
    }

    // Update method to handle vertical scrolling
    update() {
        this.y += this.parallaxSpeed; // Move vertically based on parallax speed
        super.update();

        // Reset the position once the entire image has scrolled through the canvas
        if (this.y >= this.image.height) {
            this.y -= this.image.height; // Reset to the top of the image
        }
    }

    // Draw method to render the background image vertically
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate the vertical positions for drawing
        const firstImageY = this.y % this.image.height;
        const secondImageY = firstImageY - this.image.height;

        // Draw the first image
        this.ctx.drawImage(this.image, 0, firstImageY, this.canvas.width, this.image.height);

        // Draw the second image above the first one for seamless scrolling
        this.ctx.drawImage(this.image, 0, secondImageY, this.canvas.width, this.image.height);

        super.draw();
    }
}

export default BackgroundSnow;