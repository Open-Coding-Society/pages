import Coin from '@assets/js/GameEnginev1.1/Coin.js';

class Gem extends Coin {
  constructor(data = null, gameEnv = null) {
    const gemData = {
      id: 'gem',
      value: 5,
      SCALE_FACTOR: 10,
      hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
      ...data
    };

    super(gemData, gameEnv);

    this.permanentlyCollected = false;

    this.gemImage = new Image();
    this.gemImage.src = gameEnv.path + '/images/projects/heist-exe/gem.png';

    console.log('Gem created:', this.spriteData?.id, 'at position', this.position);
  }

  draw() {
    if (!this.ctx || this.permanentlyCollected) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gemImage.complete && this.gemImage.naturalWidth > 0) {
      this.ctx.drawImage(this.gemImage, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      // Fallback while image loads
      this.ctx.fillStyle = '#00FFFF';
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const r = Math.min(this.canvas.width, this.canvas.height) / 3;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.setupCanvas();
  }

  collect() {
    if (this.permanentlyCollected) return;
    this.permanentlyCollected = true;
    this.collected = true;

    if (this.gameEnv) {
      if (!this.gameEnv.stats) this.gameEnv.stats = { coinsCollected: 0 };
      this.gameEnv.stats.coinsCollected = (this.gameEnv.stats.coinsCollected || 0) + this.value;
    }

    console.log(`Gem collected! +${this.value} | Total: ${this.gameEnv?.stats?.coinsCollected}`);

    if (this.canvas) this.canvas.style.display = 'none';
  }

  update() {
    if (this.permanentlyCollected) return;
    super.update();
  }
}

export default Gem;