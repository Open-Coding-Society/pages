// Define the Player class
class Player {
    constructor(canvas2D) {
        // Initial position and velocity of the player
        this.position = {
            x: 100,
            y: 200
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        // Dimensions of the player
        this.width = 30;
        this.height = 30;

        this.c = canvas2D;
    }
    // Method to draw the player on the canvas
    draw() {
        this.c.fillStyle = 'red';
        this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    // Method to update the players position and velocity
    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        /* FILL IN HERE
        this update method is called in the animate function, so this would be a good place to add some code to handle gravity (play around with the constant you use for gravity until you think the motion looks good) */
       /* FILL IN HERE
         when adding gravity, make sure to add some handling so it doesn't go through the bottom of the screen */
    }
}
