/**
 * @module generators/platform
 * @description Turns the Platform panel settings into a playable GameEngine
 * level: a background, a floor, the player's platforms, a jumping player, and
 * a PlatformChallenge with the coins and enemies.
 * @data Uses the Platform pictures from game-templates.json. Player pictures
 * bring their sprite sheet layout (orientation and down/left/right rows);
 * enemy and coin pictures bring their pixel size and, for sheets, one frame.
 * Platform X/Y is the top-left corner; enemy and coin X/Y is the centre. All
 * positions and sizes are 0–1 proportions of the canvas.
 * @usage `generatePlatformCode(options, images)` returns `{ code, errors }`;
 * errors are `{ field, message }` and leave `code` empty.
 */
import { code, imagePath, levelModule } from './source.mjs';

const WASD_JUMP_ON_W = { up: 87, left: 65, down: 83, right: 68 };
const FLOOR = { id: 'floor', x: 0, y: 0.92, width: 1, height: 0.08, visible: false };
const PLATFORM_COLOR = 'rgba(120, 72, 32, 0.9)';
const ENEMY_SIZE = 0.12;
const ENEMY_PATROL = 0.08;
const COIN_SIZE = 0.06;

function isBetween(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function isPlaced(item) {
  return isBetween(item.x, 0, 1) && isBetween(item.y, 0, 1);
}

function checkOptions(options, images) {
  const errors = [];
  if (typeof options.name !== 'string' || !options.name.trim()) errors.push({ field: 'name', message: 'Enter a game name.' });
  if (!images.get('backgrounds').has(options.backgroundKey)) errors.push({ field: 'backgroundKey', message: 'Choose a background.' });
  if (!isBetween(options.gravity, 0.1, 2)) errors.push({ field: 'gravity', message: 'Gravity must be from 0.1 to 2.' });
  if (!isBetween(options.jumpStrength, 2, 20)) errors.push({ field: 'jumpStrength', message: 'Jump strength must be from 2 to 20.' });
  if (!images.get('players').has(options.playerSpriteKey)) errors.push({ field: 'playerSpriteKey', message: 'Choose a player sprite.' });
  if (!isPlaced({ x: options.playerX, y: options.playerY })) {
    errors.push({ field: 'playerX', message: 'The player start X and Y must be from 0 to 1.' });
  }
  (options.platforms ?? []).forEach((platform, index) => {
    const isSized = isBetween(platform.width, 0.01, 1) && isBetween(platform.height, 0.01, 1);
    if (!isPlaced(platform) || !isSized) {
      errors.push({ field: `platforms.${index}`, message: `Platform ${index + 1} needs X/Y from 0 to 1 and a size from 0.01 to 1.` });
    }
  });
  for (const [list, group, label] of [['enemies', 'enemies', 'Enemy'], ['coins', 'coins', 'Coin']]) {
    (options[list] ?? []).forEach((item, index) => {
      if (!images.get(group).has(item.spriteKey) || !isPlaced(item)) {
        errors.push({ field: `${list}.${index}`, message: `${label} ${index + 1} needs a picture and X/Y from 0 to 1.` });
      }
    });
  }
  return errors;
}

function playerData(options, picture) {
  return {
    id: 'player',
    name: options.playerName?.trim() || 'Player',
    src: imagePath(picture.src),
    SCALE_FACTOR: 8,
    STEP_FACTOR: 1200,
    ANIMATION_RATE: 20,
    INIT_POSITION: { x: options.playerX, y: options.playerY },
    pixels: picture.pixels,
    orientation: picture.orientation,
    down: picture.down,
    left: picture.left,
    right: picture.right,
    hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
    keypress: WASD_JUMP_ON_W,
    gravityAcceleration: options.gravity,
    jumpVelocity: options.jumpStrength
  };
}

/** Coin or enemy data for PlatformChallenge: the picture plus where it sits. */
function challengeItem(picture, item, extra) {
  return { src: imagePath(picture.src), x: item.x, y: item.y, pixels: picture.pixels, frame: picture.frame, ...extra };
}

export function generatePlatformCode(options, images) {
  const errors = checkOptions(options, images);
  if (errors.length > 0) return { code: '', errors };

  const background = images.get('backgrounds').get(options.backgroundKey);
  const classes = [
    { class: code('GameEnvBackground'), data: { name: background.name, src: imagePath(background.src) } },
    { class: code('Barrier'), data: FLOOR }
  ];
  (options.platforms ?? []).forEach((platform, index) => {
    classes.push({
      class: code('Barrier'),
      data: {
        id: `platform-${index + 1}`,
        x: platform.x,
        y: platform.y,
        width: platform.width,
        height: platform.height,
        color: PLATFORM_COLOR,
        visible: platform.visible !== false
      }
    });
  });
  classes.push({ class: code('PlayerPlatformer'), data: playerData(options, images.get('players').get(options.playerSpriteKey)) });
  const coins = (options.coins ?? []).map((coin) => challengeItem(images.get('coins').get(coin.spriteKey), coin, { size: COIN_SIZE }));
  const enemies = (options.enemies ?? []).map((enemy) => challengeItem(
    images.get('enemies').get(enemy.spriteKey), enemy, { name: enemy.name, size: ENEMY_SIZE, patrol: ENEMY_PATROL }
  ));
  classes.push({ class: code('PlatformChallenge'), data: { coins, enemies } });

  const imports = {
    GameControl: 'GameControl.js',
    GameEnvBackground: 'GameEnvBackground.js',
    Barrier: 'Barrier.js',
    PlayerPlatformer: 'PlayerPlatformer.js',
    PlatformChallenge: 'PlatformChallenge.js'
  };
  return {
    code: levelModule({ imports, className: 'GameLevelPlatform', displayName: options.name.trim(), body: '', classes }),
    errors: []
  };
}
