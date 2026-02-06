import Character from './Character.js'

/**
 * AnimatedPlayer is a thin subclass of Character that expects spriteData in a
 * traditional sprite-sheet layout. This demo shows how to wire up a sprite and
 * where to replace with your own sprite sheet and animation data.
 *
 * Expected spriteData shape:
 * {
 *   src: '/path/to/spritesheet.png',
 *   pixels: { width: 96, height: 32 },
 *   orientation: { rows: 1, columns: 3 },
 *   right: { row:0, start:0, columns: 3 }
 * }
 */
class AnimatedPlayer extends Character {
  constructor(data = null, gameEnv = null) {
    super(data, gameEnv)

    // Fallback demo sprite (small colored quad frames) if no src provided.
    if (!this.spriteSheet) {
      // Create a placeholder sprite sheet canvas and use it as image source
      const canvas = document.createElement('canvas')
      canvas.width = 96
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      // Draw 3 colored frames for a simple demo animation
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, 32, 32)
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(32, 0, 32, 32)
      ctx.fillStyle = '#0000ff'
      ctx.fillRect(64, 0, 32, 32)
      this.spriteSheet = new Image()
      this.spriteSheet.src = canvas.toDataURL()
      this.spriteData = this.spriteData || {}
      this.spriteData.pixels = this.spriteData.pixels || { width: 96, height: 32 }
      this.spriteData.orientation = this.spriteData.orientation || { rows: 1, columns: 3 }
      // Setup a simple right-facing animation
      this.direction = 'right'
      this.spriteData.right = this.spriteData.right || { row: 0, start: 0, columns: 3 }
    }
  }

  // Optionally override drawSprite to ensure frames are taken from spriteData correctly
  drawSprite() {
    // reuse parent implementation which expects spriteData and spriteSheet
    super.drawSprite()
  }
}

export default AnimatedPlayer
