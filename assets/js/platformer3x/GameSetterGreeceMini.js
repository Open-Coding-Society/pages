// GameSetHills.js Key objective is to define objects for a GameLevel
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundTransitions from './BackgroundTransitions.js';
import PlayerMini from './PlayerMini.js';
import BlockPlatform from './BlockPlatform.js';
import Platform from './Platform.js';
import Coin from './Coin.js';
import FinishLine from './FinishLine.js';
import Star from './Star.js';

// Define the GameSetup object literal
const assets = {  
  obstacles: {
    tubeU: { src: "/images/platformer/obstacles/blue-tube-up.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    tubeD: { src: "/images/platformer/obstacles/blue-tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    coin: { src: "/images/platformer/obstacles/coin.png" },
    star: { src: "/images/platformer/obstacles/star.png" },
    snitch: { src: "/images/platformer/obstacles/snitch.png" }
  },
  platforms: {
    lava: { src: "/images/platformer/platforms/lava.jpg" },
    rockslava: { src: "/images/platformer/platforms/rockslava.png" }
  },
  backgrounds: {
    mini: { src: "/images/platformer/backgrounds/mini.png" }
  },
  transitions: {
    miniEnd: { src: "/images/platformer/transitions/miniEnd.png" },
  },
  players: {
    knight: {
      src: "/images/platformer/sprites/knight.png",
      width: 128,
      height: 128,
      scaleSize: 120,
      speedRatio: 0.7,
      idle: {
        left: { row: 1, frames: 23 },
        right: { row: 0, frames: 23 },
      },
      walk: {
        left: { row: 7, frames: 20 },
        right: { row: 6, frames: 20 },
      },
      run: {
        left: { row: 5, frames: 23 },
        right: { row: 4, frames: 23 },
      },
      jump: {
        left: { row: 3, frames: 23 },
        right: { row: 2, frames: 23 },
      },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    }
  },
  };

  // Hills Game Level defintion...
  const objects = [
    { name: 'mini', id: 'background', class: Background, data: assets.backgrounds.mini },
    { name: 'rockslava', id: 'platform', class: Platform, data: assets.platforms.rockslava },
    // { name: 'rock', id: 'platform', class: Platform, data: assets.platforms.rock },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.59, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.6268, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.35 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.4684, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.6, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.6368, yPercentage: 0.85 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.4334 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.5167 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.4104, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.4472, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.484, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.5208, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.5167 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.4334 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.35 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.5167 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.4334 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.35 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.8208, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.784, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.7472, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.7104, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.6736, yPercentage: 0.6 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.4334 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.5167 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.6 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.28, yPercentage: 0.25 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.32, yPercentage: 0.25 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.29, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.33, yPercentage: 0.75 },
    { name: 'star', id: 'star', class: Star, data: assets.obstacles.star, xPercentage: 0.4584, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.40, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.42, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.44, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.46, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.48, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.5, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.59, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.63, yPercentage: 0.75 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.58, yPercentage: 0.25 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.62, yPercentage: 0.25 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.6475, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.6675, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.6875, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.7075, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.7275, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.7475, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.7675, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.7875, yPercentage: 0.5 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.coin, xPercentage: 0.8075, yPercentage: 0.5 },
    { name: 'knight', id: 'player', class: PlayerMini, data: assets.players.knight },
    { name: 'tubeD', id: 'finishline', class: FinishLine, data: assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.0685 },
    { name: 'tubeU', id: 'finishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.85 },
    { name: 'greeceEnd', id: 'background', class: BackgroundTransitions,  data: assets.transitions.greeceEnd },
  ];

  const GameSetterGreeceMini = {
    tag: 'Greece Lava',
    assets: assets,
    objects: objects
  };

export default GameSetterGreeceMini;