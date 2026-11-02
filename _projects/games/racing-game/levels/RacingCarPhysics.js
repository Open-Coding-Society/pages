export const RACING_CAR_PHYSICS = Object.freeze({
  maxSpeed: 6,
  reverseSpeed: 2,
  acceleration: 0.2,
  braking: 0.2,
  coasting: 0.05,
  turnRate: 0.1,
});

export const RACING_CAR_HITBOX = Object.freeze({
  widthPercentage: 0.55,
  heightPercentage: 0.55,
});

export function getRacingTurnRate(speed) {
  if (speed === 0) return 0;
  const speedFraction = Math.min(Math.abs(speed) / RACING_CAR_PHYSICS.maxSpeed, 1);
  return RACING_CAR_PHYSICS.turnRate * (1 - 0.1 * speedFraction);
}
