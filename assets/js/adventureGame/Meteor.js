import Character from "./GameEngine/Character.js";

class Meteor extends Character {
  constructor(data, gameEnv) {
    console.log("Creating meteor with data:", data)

    if (!data.src) {
      console.error("Meteor data missing src property")
      throw new Error("Meteor data missing src property")
    }

    super(data, gameEnv)

    this.position = data.INIT_POSITION || {
      x: Math.random() * (gameEnv.innerWidth - this.width),
      y: -this.height,
    }

    this.velocity = {
      x: 0,
      y: 1.5 + Math.random() * 1,
    }

    this.isHit = false

    console.log(`Created meteor at position (${this.position.x}, ${this.position.y})`)

    if (this.spriteSheet) {
      this.spriteSheet.onload = () => {
        console.log("Meteor sprite loaded successfully")
      }

      this.spriteSheet.onerror = (error) => {
        console.error("Error loading meteor sprite:", error)
      }
    } else {
      console.error("Meteor sprite sheet not created")
    }
  }

  // Override the Character's move method to allow meteors to move freely
  // without being constrained by canvas boundaries
  move() {
    // Update position according to velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // No boundary checks - we want meteors to be able to move from off-screen
  }

  update() {
    this.draw();
    this.collisionChecks();
    this.move();

    // Check if meteor has reached the bottom of the screen
    if (this.position.y > this.gameEnv.innerHeight) {
      this.destroy();
    }
  }
}

export default Meteor

