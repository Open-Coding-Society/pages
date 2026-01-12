// GameSetHills.js Key objective is to define objects for a GameLevel
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import PlayerQuidditch from './PlayerQuidditch.js';
import BlockPlatform from './BlockPlatform.js';
import SpawnPlatform from './PlatformSpawn.js';
import MovingPlatform from './PlatformMoving.js'
import MagicBeam from './MagicBeam.js';
import ChocoFrog from './ChocoFrog.js';
import Coin from './Coin.js';
import FinishLine from './FinishLine.js';
import Dementor from './FlyingDementor.js';
import Draco from './EnemyDraco.js';

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
    coin: { src: "/images/platformer/obstacles/coin.png" },
    snitch: { src: "/images/platformer/obstacles/snitch.png" },
    whompingwillow: {
      src: "/images/platformer/obstacles/whompingwillowtree.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
    },
  },
  platforms: {
    cobblestone: { src: "/images/platformer/platforms/cobblestone.png" },
    yellowpattern: { src: "/images/platformer/platforms/yellowtowerpattern.jpg" },
    yellowredpattern: { src: "/images/platformer/platforms/yellowredpattern.jpg" },
    lionpattern: { src: "/images/platformer/platforms/lionpattern.jpg" },
    turf: { src: "/images/platformer/platforms/turf.png" },
    
  },
  backgrounds: {
    quidditch: { src: "/images/platformer/backgrounds/quidditch2.jpg" },
  },
  transitions: {
    waterEnd: { src: "/images/platformer/transitions/waterEnd.png" },   
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
    dementor: {
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
  }
  };

  // Quidditch Game Level defintion...
  const objects = [
    // GameObject(s), the order is important to z-index...
    { name: 'quidditch', id: 'background', class: Background, data: assets.backgrounds.quidditch },
    { name: 'turf', id: 'platform', class: Platform, data: assets.platforms.turf },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.1, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.14, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.18, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.69 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.71 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.61 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.33 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.23 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.13 },
    { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: assets.platforms.cobblestone, xPercentage: 0.34, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: assets.platforms.cobblestone, xPercentage: 0.42, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.57 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.37 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.27 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.17 },

    { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: assets.platforms.cobblestone, xPercentage: 0.626, yPercentage: 0.92 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.663, yPercentage: 0.586 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.cobblestone, xPercentage: 0.700, yPercentage: 0.586 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 1.08 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 0.985 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.89 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.795 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.7 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 0.605 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.51 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.415 },

    { name: 'draco', id: 'draco', class: Draco, data: assets.enemies.draco, xPercentage: 0.3, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
    { name: 'draco', id: 'draco', class: Draco, data: assets.enemies.draco, xPercentage: 0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"] },
    /**{ name: 'draco', id: 'draco', class: Draco, data: assets.enemies.draco, xPercentage: 0.75, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event */
    { name: 'dementor', id: 'dementor', class: Dementor, data: assets.enemies.dementor, xPercentage: 0.5, minPosition: 0.05 },
    { name: 'dementor', id: 'dementor', class: Dementor, data: assets.enemies.dementor, xPercentage: 0.9, minPosition: 0.5 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.095, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.135, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.175, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.375, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.409, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.295, yPercentage: 0.46 },

    { name: 'chocoFrog', id: 'chocoFrog', class: ChocoFrog, data: assets.enemies.chocoFrog, xPercentage: 0.30, yPercentage: 0.45},

    { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: assets.enemies.magicBeam, xPercentage: 0.623, yPercentage: 0.72 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.656, yPercentage: 0.46 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.611, yPercentage: 0.46 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.700, yPercentage: 0.46 },

    { name: 'harry', id: 'player', class: PlayerQuidditch, data: assets.players.harry },
    { name: 'tube', id: 'finishline', class: FinishLine, data: assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.855 },
    { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.69, yPercentage: 0.9 },
    { name: 'waterEnd', id: 'background', class: BackgroundTransitions,  data: assets.transitions.waterEnd },
  ];

  const GameQuidditch = {
    tag: 'Quidditch',
    assets: assets,
    objects: objects
  };

export default GameQuidditch;