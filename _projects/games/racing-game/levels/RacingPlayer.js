import EnginePlayer from '@assets/js/GameEnginev1.1/essentials/Player.js';

// Keep the class name Player: the racing HUD uses it to find both cars.
export default class Player extends EnginePlayer {
  isOnMud() {
    if (!this.data?.mudSlowdown) return false;

    const context = this.gameEnv?.ctx;
    if (typeof context?.getImageData !== 'function' || !this.width || !this.height) return false;

    const insetX = this.width * 0.2;
    const insetY = this.height * 0.2;
    const samplePoints = [
      { x: this.position.x + this.width / 2, y: this.position.y + this.height / 2 },
      { x: this.position.x + insetX, y: this.position.y + insetY },
      { x: this.position.x + this.width - insetX, y: this.position.y + insetY },
      { x: this.position.x + insetX, y: this.position.y + this.height - insetY },
      { x: this.position.x + this.width - insetX, y: this.position.y + this.height - insetY },
    ].map(({ x, y }) => ({ x: Math.floor(x), y: Math.floor(y) }));
    const left = Math.min(...samplePoints.map(({ x }) => x));
    const top = Math.min(...samplePoints.map(({ y }) => y));
    const right = Math.max(...samplePoints.map(({ x }) => x));
    const bottom = Math.max(...samplePoints.map(({ y }) => y));
    const pixels = context.getImageData(left, top, right - left + 1, bottom - top + 1).data;
    const sampleWidth = right - left + 1;

    return samplePoints.some(({ x, y }) => {
      const offset = ((y - top) * sampleWidth + x - left) * 4;
      const [red, green, blue] = pixels.slice(offset, offset + 3);
      return red < 190 && green < 145 && red > green * 1.15 && green > blue * 1.08;
    });
  }

  move() {
    if (!this.velocity.x && !this.velocity.y) return super.move();

    const velocityX = this.velocity.x;
    const velocityY = this.velocity.y;
    const speedMultiplier = this.isOnMud() ? 0.5 : 1;
    this.velocity.x *= speedMultiplier;
    this.velocity.y *= speedMultiplier;
    const slowedVelocityX = this.velocity.x;
    const slowedVelocityY = this.velocity.y;

    super.move();

    // Preserve collision and boundary stops while restoring the input speed for the next frame.
    if (this.velocity.x === slowedVelocityX) this.velocity.x = velocityX;
    if (this.velocity.y === slowedVelocityY) this.velocity.y = velocityY;
  }

  handleKeyDown(event) {
    const target = event.target;
    const editing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName || '');
    const control = this.gameEnv?.gameControl;
    if (editing || event.altKey || event.ctrlKey || event.metaKey || !control || control.isPaused) return;
    if (this.gameEnv.container?.isConnected === false) return;

    // The engine owns key mapping, movement, and arrow-key scroll prevention.
    super.handleKeyDown(event);
  }
}
