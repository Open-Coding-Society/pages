import Character from './Character.js';

/**
 * Wall is a simple rectangular collider drawn as a canvas element.
 * It uses the base collision handling in GameObject to block movement
 * when the player (or any moving Character) intersects it.
 */
class Wall extends Character {
  constructor(data = null, gameEnv = null) {
    // Expect data: { id, INIT_POSITION: {x,y}, pixels: {width,height}, hitbox?, fillStyle?, zIndex? }
    super(data, gameEnv);
    // Ensure no sprite sheet is used; drawDefaultSquare renders the rectangle
    this.spriteSheet = null;
    this.spriteReady = false;
    // Default visual style for walls if not provided
    this.data.fillStyle = this.data.fillStyle || 'rgba(255, 215, 0, 0.35)';
    // Full collision area by default
    this.hitbox = this.data.hitbox || { widthPercentage: 0.0, heightPercentage: 0.0 };

    // Ensure initial canvas and style reflect provided pixels
    const w = this.data?.pixels?.width;
    const h = this.data?.pixels?.height;
    if (w && h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.width = w;
      this.height = h;
    }

    // Register in a global registry for editor-side control (same-origin iframe)
    try {
      const id = this.canvas.id;
      const root = (typeof window !== 'undefined') ? window : null;
      if (root) {
        root.__adventureGameRegistry = root.__adventureGameRegistry || { walls: {} };
        root.__adventureGameRegistry.walls[id] = this;
      }
    } catch (e) {
      // Non-fatal if registry cannot be created
    }
  }

  setDimensions(width, height) {
    // Persist new dimensions to data
    this.data.pixels.width = width;
    this.data.pixels.height = height;

    // Update runtime dimensions so rendering reflects changes immediately
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }

  update() {
    // Update dimensions dynamically if needed
    this.draw();
    this.collisionChecks();
  }

  // Walls should size from explicit pixels, not Character's adaptive square
  resize() {
    // Calculate the new scale resulting from the window resize
    const newScale = { width: this.gameEnv.innerWidth, height: this.gameEnv.innerHeight };

    // Adjust the object's position proportionally
    this.position.x = (this.position.x / this.scale.width) * newScale.width;
    this.position.y = (this.position.y / this.scale.height) * newScale.height;

    // Update the object's scale to the new scale
    this.scale = newScale;

    // Maintain velocity scaling like Character
    this.size = this.scale.height / (this.data.SCALE_FACTOR || 25);
    this.xVelocity = (this.scale.width / (this.data.STEP_FACTOR || 100)) * 3;
    this.yVelocity = (this.scale.height / (this.data.STEP_FACTOR || 100)) * 3;

    // Critically: keep wall dimensions tied to explicit pixels
    const pixels = this.data?.pixels || { width: 16, height: 16 };
    this.width = pixels.width;
    this.height = pixels.height;
    this.canvas.width = pixels.width;
    this.canvas.height = pixels.height;
  }

  // Character.draw handles default square drawing and canvas placement

  // Ensure removal from registry on destroy
  destroy() {
    try {
      const id = this.canvas?.id;
      if (typeof window !== 'undefined' && id && window.__adventureGameRegistry?.walls) {
        delete window.__adventureGameRegistry.walls[id];
      }
    } catch (e) {}
    super.destroy?.();
  }
}

export default Wall;
