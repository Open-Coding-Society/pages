import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import SpeedBoost from './SpeedBoost.js';

const BOOST_SPEED_MULTIPLIER = 1.3;
const SPRITE_DIRECTION_KEYS = ['up', 'upRight', 'right', 'downRight', 'down', 'downLeft', 'left', 'upLeft'];
const NITRO_SPRITE = {
  pixels: { width: 512, height: 247 },
  orientation: { rows: 3, columns: 4 },
  up: { row: 0, start: 0, columns: 2 },
  upRight: { row: 0, start: 2, columns: 2 },
  right: { row: 1, start: 0, columns: 4 },
  downRight: { row: 2, start: 2, columns: 2 },
  down: { row: 2, start: 0, columns: 2 },
  downLeft: { row: 2, start: 2, columns: 2, mirror: true },
  left: { row: 1, start: 0, columns: 4, mirror: true },
  upLeft: { row: 0, start: 2, columns: 2, mirror: true }
};

class TutorialPlayer extends Player {
  constructor(data = {}, gameEnv = null) {
    super(data, gameEnv);
    this.boostKey = data.boostKey.toLowerCase();
    this.boostLabel = data.boostLabel;
    this.controlLabel = data.controlLabel;
    this.speedBoost = new SpeedBoost();
    this.lastBoostUpdateAt = null;
    this.normalSpriteProfile = this.captureSpriteProfile();
    this.normalSpriteSheet = this.spriteSheet;
    this.nitroSpriteReady = false;
    this.nitroSpriteSheet = new Image();
    this.nitroSpriteSheet.onload = () => {
      this.nitroSpriteReady = true;
      if (this.speedBoost.isActive) {
        this.useNitroSprite();
      }
    };
    this.nitroSpriteSheet.onerror = (error) => {
      console.error(`Failed to load ${this.spriteData.name} nitro sprite sheet: ${data.nitroSpriteSrc}`, error);
    };
    this.nitroSpriteSheet.src = data.nitroSpriteSrc;
  }

  captureSpriteProfile() {
    const profile = {
      src: this.spriteData.src,
      pixels: this.spriteData.pixels,
      orientation: this.spriteData.orientation
    };
    SPRITE_DIRECTION_KEYS.forEach((key) => {
      profile[key] = this.spriteData[key];
    });
    return profile;
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (
      key === this.boostKey
      && !event.repeat
      && !this.gameEnv?.gameControl?.isPaused
      && this.speedBoost.activate()
    ) {
      this.lastBoostUpdateAt = performance.now();
      this.useNitroSprite();
      this.updateVelocity();
    }

    super.handleKeyDown(event);
  }

  updateVelocity() {
    super.updateVelocity();
    if (this.speedBoost?.isActive) {
      this.velocity.x *= BOOST_SPEED_MULTIPLIER;
      this.velocity.y *= BOOST_SPEED_MULTIPLIER;
    }
  }

  update() {
    const now = performance.now();
    const wasBoosting = this.speedBoost.isActive;
    if (this.lastBoostUpdateAt !== null && !this.gameEnv?.gameControl?.isPaused) {
      this.speedBoost.update(Math.max(0, now - this.lastBoostUpdateAt));
    }
    this.lastBoostUpdateAt = now;

    if (wasBoosting !== this.speedBoost.isActive) {
      if (this.speedBoost.isActive) {
        this.useNitroSprite();
      } else {
        this.useNormalSprite();
      }
      this.updateVelocity();
    }

    super.update();
  }

  applySpriteProfile(profile, spriteSheet, spriteReady) {
    Object.assign(this.spriteData, profile);
    this.spriteSheet = spriteSheet;
    this.spriteReady = spriteReady;
    this.frameIndex = 0;
    this.animationElapsed = 0;
    this.lastAnimationTime = null;
  }

  useNitroSprite() {
    if (!this.nitroSpriteReady) {
      return;
    }

    const profile = { src: this.nitroSpriteSheet.src, ...NITRO_SPRITE };
    this.applySpriteProfile(profile, this.nitroSpriteSheet, true);
  }

  useNormalSprite() {
    const normalSpriteReady = this.normalSpriteSheet.complete && this.normalSpriteSheet.naturalWidth > 0;
    this.applySpriteProfile(
      this.normalSpriteProfile,
      this.normalSpriteSheet,
      normalSpriteReady
    );
  }

  getBoostCharge() {
    return this.speedBoost.chargeFraction;
  }
}

export default TutorialPlayer;
