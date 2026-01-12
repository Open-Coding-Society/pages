// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js';
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import BlockPlatform from './BlockPlatform.js';
import JumpPlatform from './PlatformJump.js';
import PlayerHills from './PlayerHills.js';
import Goomba from './EnemyGoomba.js';
import FlyingGoomba from './FlyingGoomba.js';
import Mushroom from './Mushroom.js';
import Coin from './Coin.js';
import FinishLine from './FinishLine.js';

// Define the GameSetup object literal
const assets = {  
    obstacles: {
      chest: {
        src: "/images/platformer/obstacles/Chest.png",
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
        width: 300,
        height: 300,
        scaleSize: 150,
      },
      coin: { src: "/images/platformer/obstacles/coin.png" },
      dimonds: { src: "/images/platformer/obstacles/dimonds.png" },
    },
    platforms: {
      sand: { src: "/images/platformer/platforms/sand.png" },
      sandblock: {src:"/images/platformer/platforms/sandblock.png"},
      block: { src: "/images/platformer/platforms/brick_block.png" }, 
      itemBlock: {
        src: "/images/platformer/platforms/mario_block_spritesheet_v2.png",
        sizeRatio: 83.2,
        widthRatio: 0.5,
        heightRatio: 1.0,
        width: 204,
        height: 204,
        scaleSize: 80,
        speedRatio: 0.7,
        hitbox: { widthPercentage: 0.4, heightPercentage: -0.2 }
      }
    },
    backgrounds: {
      water: { src: "/images/platformer/backgrounds/water.png" },
      fish: { src: "/images/platformer/backgrounds/school-fish.png", parallaxSpeed: -0.5 },
      reef: { src: "/images/platformer/backgrounds/reef.png" },
    },
    transitions: {
      loading: { src: "/images/platformer/transitions/greenscreen.png" },
      waterEnd: { src: "/images/platformer/transitions/waterEnd.png" },
      miniEnd: { src: "/images/platformer/transitions/miniEnd.png" },
    },
    players: {
      mario: {
        src: "/images/platformer/sprites/mario.png",
        width: 256,
        height: 256,
        scaleSize: 80,
        speedRatio: 0.7,
        idle: {
          left: { row: 1, frames: 15 },
          right: { row: 0, frames: 15 },
        },
        walk: {
          left: { row: 3, frames: 7 },
          right: { row: 2, frames: 7 },
        },
        run: {
          left: { row: 5, frames: 15 },
          right: { row: 4, frames: 15 },
        },
        jump: {
          left: { row: 11, frames: 15 },
          right: { row: 10, frames: 15 },
        },
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
      },
    },
    enemies: {
      goomba: {
        src: "/images/platformer/sprites/goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
        xPercentage: 0.6,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
      },
      flyingGoomba: {
        src: "/images/platformer/sprites/flying-goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
      },
      mushroom: {
        src: "/images/platformer/platforms/mushroom.png",
        width: 200,
        height: 180,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
      },
      bubbles: {
        src: "/images/platformer/platforms/bubbles.png",
        width: 200,
        height: 180,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
      },
    }
  };

  const objects = [
    { name: 'water', id: 'background', class: Background, data: assets.backgrounds.water },
    { name: 'fish', id: 'background', class: BackgroundParallax, data: assets.backgrounds.fish },
    { name: 'reef', id: 'background', class: Background, data: assets.backgrounds.reef },
    { name: 'sand', id: 'floor', class: Platform, data: assets.platforms.sand },
    { name: 'sandblock', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandblock, xPercentage: 0.2, yPercentage: 0.85 },
    { name: 'sandblock', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandblock, xPercentage: 0.2368, yPercentage: 0.85 },
    { name: 'sandblock', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandblock, xPercentage: 0.2736, yPercentage: 0.85 },
    { name: 'sandblock', id: 'wall', class: BlockPlatform, data: assets.platforms.sandblock, xPercentage: 0.6, yPercentage: 1 },
    { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
    { name: 'goomba', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
    { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
    { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: assets.enemies.goomba, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
    { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
    { name: 'bubbles', id: 'mushroom', class: Mushroom, data: assets.enemies.bubbles, xPercentage: 0.49 },
    { name: 'dimonds', id: 'coin', class: Coin, data: assets.obstacles.dimonds, xPercentage: 0.1908, yPercentage: 0.75 },
    { name: 'dimonds', id: 'coin', class: Coin, data: assets.obstacles.dimonds, xPercentage: 0.2242, yPercentage: 0.75 },
    { name: 'dimonds', id: 'coin', class: Coin, data: assets.obstacles.dimonds, xPercentage: 0.2575, yPercentage: 0.75 },
    { name: 'dimonds', id: 'coin', class: Coin, data: assets.obstacles.dimonds, xPercentage: 0.5898, yPercentage: 0.900 },
    { name: 'mario', id: 'player', class: PlayerHills, data: assets.players.mario },
    { name: 'Chest', id: 'finishline', class: FinishLine, data: assets.obstacles.chest, xPercentage: 0.85, yPercentage: 0.82 },
    { name: 'miniEnd', id: 'background', class: BackgroundTransitions, data: assets.transitions.miniEnd },
  ];

  const GameSetterWater = {
    tag: 'Water',
    assets: assets,
    objects: objects
  };

export default GameSetterWater;