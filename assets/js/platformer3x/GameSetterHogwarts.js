// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import BackgroundParallax from './BackgroundParallax.js';
import PlayerMiniHogwarts from './PlayerMiniHogwarts.js'; 
import BlockPlatform from './BlockPlatform.js';
import MovingPlatform from './PlatformMoving.js'
import MagicBeam from './MagicBeam.js';
import Coin from './Coin.js';
import FinishLine from './FinishLine.js';
import PlatformFilter from './PlatformFilter.js';
// Define the GameSetup object literal
const assets = {  
  obstacles: {
    tube: { src: "/images/platformer/obstacles/tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
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
    snitch: { src: "/images/platformer/obstacles/snitch.png" },
  },
  platforms: {
    stone: { src: "/images/platformer/platforms/stone.jpg"}, 
  },
  backgrounds: {
    quidditch: { src: "/images/platformer/backgrounds/quidditch2.jpg" },
    miniHogwarts: { src: "/images/platformer/backgrounds/miniHogwarts.png", parallaxSpeed: 0.5, moveOnKeyAction: true }, 
    bat: {src: "/images/platformer/backgrounds/bat.png", parallaxSpeed: -0.5 },
  },
  transitions: {
    loading: { src: "/images/platformer/transitions/greenscreen.png" },
    hillsEnd: { src: "/images/platformer/transitions/hillsEnd.png" },
    winterEnd: { src: "/images/platformer/transitions/winterEnd.png" },
    greeceEnd: { src: "/images/platformer/transitions/greeceEnd.png" },
    waterEnd: { src: "/images/platformer/transitions/waterEnd.png" },
    quidditchEnd: { src: "/images/platformer/transitions/quidditchEnd.png" },
    miniEnd: { src: "/images/platformer/transitions/miniEnd.png" },
    iceminiEnd: { src: "/images/platformer/transitions/IceMinigameEnd.png"},
  },
  players: {
    harry: {
      src: "/images/platformer/sprites/harryanimation3.png",
      width: 32,
      height: 32,
      scaleSize: 60,
      speedRatio: 0.7,
      idle: {
        left: { row: 1, frames: 0 },
        right: { row: 2, frames: 0 },
      },
      walk: {
        left: { row: 1, frames: 5 },
        right: { row: 2, frames: 5 },
      },
      run: {
        left: { row: 1, frames: 5 },
        right: { row: 2, frames: 5 },
      },
      jump: {
        left: { row: 1, frames: 0 },
        right: { row: 2, frames: 0 },
      },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    magicBeam: {
      src: "/images/platformer/platforms/magic_beam.png",
      width: 450,
      height: 400,
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
    },
    chocoFrog: {
      src: "/images/platformer/platforms/Chocolatefrog.jpg",
      width: 200,
      height: 200,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    },
  }
  };

  //  Game Level defintion...
  const objects = [
    { name: 'miniHogwarts', id: 'background', class: BackgroundParallax, data: assets.backgrounds.miniHogwarts },
    { name: 'bat', id: 'background', class: BackgroundParallax, data: assets.backgrounds.bat },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.009, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.058, yPercentage: 0.66 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.1, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.47 },
    
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.81 },

    { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: assets.platforms.stone, xPercentage: 0.44, yPercentage: 0.92 },
    { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: assets.enemies.magicBeam, xPercentage: 0.37, yPercentage: 0.61 },

    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.64 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.54 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.44 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.34 },
    
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.6, yPercentage: 0.66 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.56, yPercentage: 0.5 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.64, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.68, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.72, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: PlatformFilter, data: assets.platforms.stone, xPercentage: 0.76, yPercentage: 0.47 },
    
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.55, yPercentage: 0.38 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.636, yPercentage: 0.699 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.672, yPercentage: 0.368 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.71, yPercentage: 0.368 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.75, yPercentage: 0.368 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.056, yPercentage: 0.56 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.15, yPercentage: 0.24 },
    
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.14, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.18, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.22, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.26, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.43, yPercentage: 0.82 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.47, yPercentage: 0.24 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.85, yPercentage: 0.81 },
    

    { name: 'harry', id: 'player', class: PlayerMiniHogwarts, data: assets.players.harry },
    { name: 'tubeD', id: 'finishline', class: FinishLine, data: assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.0685 },
    { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.85 },
  ];

  const GameHogwarts = {
    tag: 'Hogwarts',
    assets: assets,
    objects: objects
  };

export default GameHogwarts;