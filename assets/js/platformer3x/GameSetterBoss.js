import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import FinishLine from './FinishLine.js';
import Boss from './Boss.js';
import PlayerZombie from './PlayerZombie.js';
import BossItem from './BossItem.js';
import PlayerBoss from './PlayerBoss.js';

// Define the GameSetup object literal
const assets = {  
  obstacles: {
    tube: { src: "/images/platformer/obstacles/tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    }
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/grass.png" }, //MAY need 3 new variables: sizeRatio, widthRatio, and heightRatio
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
    boss: { src: "/images/platformer/backgrounds/BossBackground.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    devil: {src: "/images/platformer/backgrounds/devil.png", parallaxSpeed: 2 },
  },
  transitions: {
    iceminiEnd: { src: "/images/platformer/transitions/IceMinigameEnd.png"},
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
    zombie: { //one direction player
      src: "/images/platformer/sprites/zombie.png",
      width: 130,
      height: 70,
      scaleSize: 60,
      speedRatio: 0.7,
      idle: { row: 2, frames: 11, idleFrame: { column: 1, frames: 0 } },
      walk: { row: 3, frames: 11 }, // default - right Movement
      run: { row: 3, frames: 11 }, // default - right Movement
      jump: { row: 3, frames: 11 }, // default - right Movement
      attack: { row: 4, min: 6,frames: 11 }, 
      jumpAttack : { row: 6, frames: 11 }, 
      death : { row: 11, frames: 11 }, 
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
    zombie: { //one direction player
      src: "/images/platformer/sprites/zombie.png",
      width: 130,
      height: 70,
      scaleSize: 60,
      speedRatio: 0.7,
      idle: { row: 2, frames: 11, idleFrame: { column: 1, frames: 0 } },
      walk: { row: 3, frames: 11 }, // default - right Movement
      run: { row: 3, frames: 11 }, // default - right Movement
      jump: { row: 3, frames: 11 }, // default - right Movement
      attack: { row: 4, min: 6,frames: 11 }, 
      jumpAttack : { row: 6, frames: 11 }, 
      death : { row: 11, frames: 11 }, 
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    boss: {
      src: "/images/platformer/sprites/boss.png",
      width: 64,
      height: 64,
      scaleSize: 320,
      speedRatio: 0.6,
      animationSpeed: 6,
      idleL: { row: 9, frames: 0, idleFrame: { column: 1, frames: 0 } },
      idleR: { row: 11, frames: 0, idleFrame: { column: 1, frames: 0 } },
      left: { row: 9, frames: 8, idleFrame: { column: 7, frames: 0 } },
      right: { row: 11, frames: 8, idleFrame: { column: 7, frames: 0 } },
      attackL: { row: 13, frames: 5 },
      attackR: { row: 15, frames: 5 },
      death: { row: 20, frames: 5 },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  }
  };

  // Hills Game Level defintion...
  const objects = [
    // GameObject(s), the order is important to z-index...
    { name: 'bossbackground', id: 'background', class: BackgroundParallax, data: assets.backgrounds.boss },
    { name: 'devil', id: 'devil', class:BackgroundParallax, data: assets.backgrounds.devil},
    { name: 'boss', id: 'boss', class: Boss, data: assets.enemies.boss, xPercentage: 0.5, minPosition: 0.3 },
    { name: 'boss1', id: 'boss', class: Boss, data: assets.enemies.boss, xPercentage: 0.3, minPosition: 0.07 },
    { name: 'itemBlock', id: 'jumpPlatform', class: BossItem, data: assets.platforms.itemBlock, xPercentage: 0.2, yPercentage: 0.65 }, //item block is a platform
    { name: 'mario', id: 'player', class: PlayerBoss, data: assets.players.mario },
    { name: 'zombie', id: 'player', class: PlayerZombie, data: assets.players.zombie },
    { name: 'grass', id: 'platform', class: Platform, data: assets.platforms.grass },
    { name: 'tube', id: 'finishline', class: FinishLine, data: assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.855 },
    { name: 'iceminiEnd', id: 'background', class: BackgroundTransitions, data: assets.transitions.iceminiEnd },
  ];

  const GameSetterBoss = {
    tag: 'Boss',
    assets: assets,
    objects: objects
  };

export default GameSetterBoss;