const BOOST_DURATION_MS = 3000;
const COOLDOWN_DURATION_MS = 5000;

export default class SpeedBoost {
  constructor() {
    this.boostRemainingMs = 0;
    this.cooldownRemainingMs = 0;
  }

  activate() {
    if (this.isActive || this.cooldownRemainingMs > 0) {
      return false;
    }

    this.boostRemainingMs = BOOST_DURATION_MS;
    return true;
  }

  update(elapsedMs) {
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
      throw new RangeError('SpeedBoost elapsedMs must be a non-negative finite number');
    }

    if (this.isActive) {
      const cooldownElapsedMs = Math.max(0, elapsedMs - this.boostRemainingMs);
      this.boostRemainingMs = Math.max(0, this.boostRemainingMs - elapsedMs);
      if (!this.isActive) {
        this.cooldownRemainingMs = Math.max(0, COOLDOWN_DURATION_MS - cooldownElapsedMs);
      }
      return;
    }

    this.cooldownRemainingMs = Math.max(0, this.cooldownRemainingMs - elapsedMs);
  }

  get isActive() {
    return this.boostRemainingMs > 0;
  }

  get chargeFraction() {
    if (this.isActive) {
      return 0;
    }
    return 1 - this.cooldownRemainingMs / COOLDOWN_DURATION_MS;
  }
}
