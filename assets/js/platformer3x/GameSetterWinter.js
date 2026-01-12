// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import BackgroundSnow from './BackgroundSnow.js';
import Platform from './Platform.js';
import PlayerWinter from './PlayerWinter.js';
import PlayerMini from './PlayerMini.js';
import PlayerMiniHogwarts from './PlayerMiniHogwarts.js';
import PlayerQuidditch from './PlayerQuidditch.js';
import BlockPlatform from './BlockPlatform.js';
import SpawnPlatform from './PlatformSpawn.js';
import MovingPlatform from './PlatformMoving.js'
import MagicBeam from './MagicBeam.js';
import ChocoFrog from './ChocoFrog.js';
import Coin from './Coin.js';
import GameControl from './GameControl.js';
import Owl from './FlyingOwl.js';
import Snowman from './EnemySnowman.js';
import Cerberus from './EnemyCerberus.js';
import PlayerGreece from './PlayerGreece.js';
import FinishLine from './FinishLine.js';
import Lava from './Lava.js';
import Dragon from './FlyingDragon.js';
import Star from './Star.js';
import Dementor from './FlyingDementor.js';
import Draco from './EnemyDraco.js';
import Boss from './Boss.js';
import Jellyfish from './FlyingJellyfish.js';
import Penguin from './EnemyPenguin.js';
import PlayerIce from './PlayerIce.js';
import FlyingIsland from './PlatformFlyingIsland.js';
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
    cabin: {
      src: "/images/platformer/obstacles/cabin.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 150,
    },
    iceberg: {
      src: "/images/platformer/obstacles/iceberg.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 120,
    },
    chest: {
      src: "/images/platformer/obstacles/Chest.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 150,
    },
    flag: {
      src: "/images/platformer/obstacles/flag.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 120,
    },
    coin: { src: "/images/platformer/obstacles/coin.png" },
    snowflake: { src: "/images/platformer/obstacles/snowflake.png" },
    star: { src: "/images/platformer/obstacles/star.png" },
    snitch: { src: "/images/platformer/obstacles/snitch.png" },
    whompingwillow: {
      src: "/images/platformer/obstacles/whompingwillowtree.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
    },
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/grass.png" },
    narwhalfloor: { src: "/images/platformer/platforms/narwhalfloor.png" },
    sand: { src: "/images/platformer/platforms/sand.png" },
    sandblock: {src:"/images/platformer/platforms/sandblock.png"},
    snowyfloor: { src: "/images/platformer/platforms/snowyfloor.png" },
    snowywood: { src: "/images/platformer/platforms/snowywood.png" },
    alien: { src: "/images/platformer/platforms/alien.png" },
    bricks: { src: "/images/platformer/platforms/brick_wall.png" },
    lava: { src: "/images/platformer/platforms/lava.jpg" },
    sandstone: { src: "/images/platformer/platforms/sandstone.png" },
    cobblestone: { src: "/images/platformer/platforms/cobblestone.png" },
    yellowpattern: { src: "/images/platformer/platforms/yellowtowerpattern.jpg" },
    yellowredpattern: { src: "/images/platformer/platforms/yellowredpattern.jpg" },
    lionpattern: { src: "/images/platformer/platforms/lionpattern.jpg" },
    stone: { src: "/images/platformer/platforms/stone.jpg"}, 
    turf: { src: "/images/platformer/platforms/turf.png" },
    island: { src: "/images/platformer/platforms/island.png" },
    island: { src: "/images/platformer/platforms/island.png" },
    block: { src: "/images/platformer/platforms/brick_block.png" }, //MAY need 3 new variables: sizeRatio, widthRatio, and heightRatio
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
    start: { src: "/images/platformer/backgrounds/home.png" },
    hills: { src: "/images/platformer/backgrounds/hills.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    greece: { src: "/images/platformer/backgrounds/greek.png" },
    mountains: { src: "/images/platformer/backgrounds/mountains.jpg", parallaxSpeed: 0.1, moveOnKeyAction: true },
    clouds: { src: "/images/platformer/backgrounds/clouds.png", parallaxSpeed: 0.5 },
    water: { src: "/images/platformer/backgrounds/water.png" },
    fish: { src: "/images/platformer/backgrounds/school-fish.png", parallaxSpeed: -0.5 },
    reef: { src: "/images/platformer/backgrounds/reef.png" },
    quidditch: { src: "/images/platformer/backgrounds/quidditch2.jpg" },
    miniHogwarts: { src: "/images/platformer/backgrounds/miniHogwarts.png"}, 
    space: { src: "/images/platformer/backgrounds/planet.jpg" },
    castles: { src: "/images/platformer/backgrounds/castles.png" },
    winter: { src: "/images/platformer/backgrounds/winter.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    snow: { src: "/images/platformer/backgrounds/snowfall.png" },
    icewater: { src: "/images/platformer/backgrounds/icewater.png", parallaxSpeed: 0.4, moveOnKeyAction: true},
    narwhal: { src: "/images/platformer/backgrounds/narwhal.png", parallaxSpeed: 2 },
    mini: { src: "/images/platformer/backgrounds/mini.png" },
    devil: {src: "/images/platformer/backgrounds/devil.png", parallaxSpeed: 2 },
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
    whitemario: {
      src: "/images/platformer/sprites/white_mario.png",
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
    monkey: {
      src: "/images/platformer/sprites/monkey.png",
      width: 40,
      height: 40,
      scaleSize: 80,
      speedRatio: 0.7,
      wa: { row: 9, min: 8, frames: 15 },
      wd: { row: 9, min: 0, frames: 7 },
      a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
      s: { row: 12, frames: 15 },
      d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
    },
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
    }, harry: {
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
    lopez: {
      src: "/images/platformer/sprites/lopezanimation.png",
      width: 46,
      height: 52.5,
      scaleSize: 60,
      speedRatio: 0.7,
      wa: { row: 1, frames: 3 }, // Up-Left Movement 
      wd: { row: 2, frames: 3 }, // Up-Right Movement
      idle: { row: 6, frames: 1, idleFrame: { column: 1, frames: 0 } },
      a: { row: 1, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Left Movement
      s: { row: 1, frames: 3 }, // Stop the movement 
      d: { row: 2, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Right Movement 
      runningLeft: { row: 5, frames: 3, idleFrame: { column: 1, frames: 0 } },
      runningRight: { row: 4, frames: 3, idleFrame: { column: 1, frames: 0 } },
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
    goomba: {
      src: "/images/platformer/sprites/goomba.png",
      width: 448,
      height: 452,
      scaleSize: 60,
      speedRatio: 0.7,
      xPercentage: 0.6,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
    },
    Snowman: {
      src: "/images/platformer/sprites/snowman.png",
      width: 308,
      height: 327,
      scaleSize: 60,
      speedRatio: 0.7,
      xPercentage: 0.6,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 },
      left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
      idle: { row: 0, frames: 0 }, // Stop the movement 
      right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
    },
    Penguin: {
      src: "/images/platformer/sprites/penguin.png",
      width: 240,
      height: 290,
      scaleSize: 80,
      speedRatio: 0.6,
      xPercentage: 0.6,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 },
      left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
      idle: { row: 0, frames: 0 }, // Stop the movement 
      right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
    },
    Owl: {
      src: "/images/platformer/sprites/owl.png",
      width: 499,
      height: 500,
      scaleSize: 60,
      speedRatio: 0.8,
    },
    Jellyfish: {
      src: "/images/platformer/sprites/jellyfish.png",
      width: 499, 
      height: 500,
      scaleSize: 90,
      speedRatio: 0.8,
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
    alien: {
      src: "/images/platformer/sprites/alien.png",
      width: 444,
      height: 640,
      scaleSize: 60,
      speedRatio: 0.85,
    },
    flyingUFO: {
      src: "/images/platformer/sprites/flying-ufo.png",
      width: 1920,
      height: 1166,
      scaleSize: 150,
      speedRatio: 0.9,
    },
    cerberus: {
      src: "/images/platformer/sprites/cerberus.png",
      width: 103,
      height: 103,
      scaleSize: 80,
      speedRatio: 0.85,
      left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
      idle: { row: 0, frames: 0 }, // Stop the movement 
      right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
    },
    dragon: {
      src: "/images/platformer/sprites/dragon.png",
      width: 152,
      height: 119,
      scaleSize: 60,
      speedRatio: 0.7,
    }, dementor: {
      src: "/images/platformer/sprites/dementor2.png",
      width: 400,
      height: 400,
      scaleSize: 80,
      speedRatio: 0.7,
    },
    draco: {
      src: "/images/platformer/sprites/dracomalfoy.png",
      width: 301,
      height: 261,
      scaleSize: 80,
      speedRatio: 0.7,
      xPercentage: 0.6,
      left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
      idle: { row: 0, frames: 0 }, // Stop the movement 
      right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
    },
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
    },
    narwhalboss: {
      src: "/images/platformer/sprites/narwhal_boss.png",
      width: 64,
      height: 64,
      scaleSize: 320,
      speedRatio: 0.6,
      animationSpeed: 6,
      idleL: { row: 0, frames: 4, idleFrame: { column: 1, frames: 0 } },
      idleR: { row: 1, frames: 4, idleFrame: { column: 1, frames: 0 } },
      left: { row: 2, frames: 4, idleFrame: { column: 1, frames: 0 } },
      right: { row: 3, frames: 4, idleFrame: { column: 1, frames: 0 } },
      attackL: { row: 4, frames: 4 },
      attackR: { row: 5, frames: 4 },
      death: { row: 6, frames: 4 },
    },
  }
  };

  // Hills Game Level defintion...
  const objects = [
    // GameObject(s), the order is important to z-index...
    { name: 'winter', id: 'background', class: BackgroundParallax, data: assets.backgrounds.winter },
    { name: 'snow', id: 'background', class: BackgroundSnow, data: assets.backgrounds.snow },
    { name: 'snowyfloor', id: 'platform', class: Platform, data: assets.platforms.snowyfloor },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.2736, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.384, yPercentage: 0.74 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.4208, yPercentage: 0.66 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.56 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.48 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.40 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.32 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.69, yPercentage: 0.76 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.655, yPercentage: 0.68 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.62, yPercentage: 0.68 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.72, yPercentage: 0.76 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 1 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.92 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.84 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 0.92 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 1 },
    { name: 'snowflake', id: 'coin', class: Coin, data: assets.obstacles.snowflake, xPercentage: 0.2100, yPercentage: 0.72 },
    { name: 'snowflake', id: 'coin', class: Coin, data: assets.obstacles.snowflake, xPercentage: 0.2619, yPercentage: 0.72 },
    { name: 'snowflake', id: 'coin', class: Coin, data: assets.obstacles.snowflake, xPercentage: 0.3136, yPercentage: 0.72 },
    { name: 'owl', id: 'owl', class: Owl, data: assets.enemies.Owl, xPercentage: 0.3, minPosition: 0.05 },
    { name: 'owl', id: 'owl', class: Owl, data: assets.enemies.Owl, xPercentage: 0.8, minPosition: 0.05 },
    { name: 'snowman', id: 'snowman', class: Snowman, data: assets.enemies.Snowman, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'snowman', id: 'snowman', class: Snowman, data: assets.enemies.Snowman, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'snowman', id: 'snowman', class: Snowman, data: assets.enemies.Snowman, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'mario', id: 'player', class: PlayerWinter, data: assets.players.whitemario },
    { name: 'cabin', id: 'finishline', class: FinishLine, data: assets.obstacles.cabin, xPercentage: 0.85, yPercentage: 0.795 },
    { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.675, yPercentage: 0.9 },
    { name: 'quidditchEnd', id: 'background', class: BackgroundTransitions, data: assets.transitions.quidditchEnd },
  ];

  const GameSetterWinter = {
    tag: 'Winter',
    assets: assets,
    objects: objects
  };

export default GameSetterWinter;