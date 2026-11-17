/**
 * @module generators/clicker
 * @description Turns the Clicker panel settings into a playable GameEngine
 * level: a plain background colour and the engine's ClickerGame, which draws
 * the targets, the score, and a shop of power-ups.
 * @data Uses the Clicker pictures from game-templates.json for the target and
 * for each power-up's icon.
 * @usage `generateClickerCode(options, images)` returns `{ code, errors }`;
 * errors are `{ field, message }` and leave `code` empty.
 */
import { code, imagePath, levelModule } from './source.mjs';

const EFFECTS = ['per-click', 'auto-click'];
const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function isBetween(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function checkOptions(options, images) {
  const errors = [];
  if (typeof options.name !== 'string' || !options.name.trim()) errors.push({ field: 'name', message: 'Enter a game name.' });
  if (!COLOR_PATTERN.test(options.backgroundColor ?? '')) errors.push({ field: 'backgroundColor', message: 'Choose a background colour.' });
  if (!images.get('targets').has(options.targetSpriteKey)) errors.push({ field: 'targetSpriteKey', message: 'Choose a target image.' });
  if (!Number.isInteger(options.targetCount) || !isBetween(options.targetCount, 1, 20)) {
    errors.push({ field: 'targetCount', message: 'Targets on screen must be a whole number from 1 to 20.' });
  }
  if (!isBetween(options.targetSpeed, 0, 5)) errors.push({ field: 'targetSpeed', message: 'Bounce speed must be from 0 to 5.' });
  if (!isBetween(options.goalScore, 1, 100000)) errors.push({ field: 'goalScore', message: 'Score to win must be from 1 to 100000.' });
  (options.powerUps ?? []).forEach((powerUp, index) => {
    const isValid = images.get('targets').has(powerUp.spriteKey) && EFFECTS.includes(powerUp.effect)
      && isBetween(powerUp.cost, 1, 100000) && isBetween(powerUp.amount, 1, 1000);
    if (!isValid) {
      errors.push({ field: `powerUps.${index}`, message: `Power-up ${index + 1} needs an image, an effect, a cost from 1 to 100000 and points from 1 to 1000.` });
    }
  });
  return errors;
}

export function generateClickerCode(options, images) {
  const errors = checkOptions(options, images);
  if (errors.length > 0) return { code: '', errors };

  const targets = images.get('targets');
  const target = targets.get(options.targetSpriteKey);
  const powerUps = (options.powerUps ?? []).map((powerUp, index) => ({
    name: powerUp.name?.trim() || `Power-up ${index + 1}`,
    src: imagePath(targets.get(powerUp.spriteKey).src),
    cost: powerUp.cost,
    effect: powerUp.effect,
    amount: powerUp.amount
  }));
  const classes = [
    { class: code('GameEnvBackground'), data: { name: 'Background', color: options.backgroundColor } },
    {
      class: code('ClickerGame'),
      data: {
        target: { name: target.name, src: imagePath(target.src) },
        targetCount: options.targetCount,
        targetSpeed: options.targetSpeed,
        goalScore: options.goalScore,
        winMessage: options.winMessage?.trim() || 'You win!',
        powerUps
      }
    }
  ];
  const imports = { GameControl: 'GameControl.js', GameEnvBackground: 'GameEnvBackground.js', ClickerGame: 'ClickerGame.js' };
  return {
    code: levelModule({ imports, className: 'GameLevelClicker', displayName: options.name.trim(), body: '', classes }),
    errors: []
  };
}
