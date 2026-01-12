// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import BlockPlatform from './BlockPlatform.js';
import Cerberus from './EnemyCerberus.js';
import PlayerGreece from './PlayerGreece.js';
import FinishLine from './FinishLine.js';
import Lava from './Lava.js';
import Dragon from './FlyingDragon.js';
import FlyingIsland from './PlatformFlyingIsland.js';

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
    flag: {
      src: "/images/platformer/obstacles/flag.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 120,
    },
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/grass.png" },
    lava: { src: "/images/platformer/platforms/lava.jpg" },
    sandstone: { src: "/images/platformer/platforms/sandstone.png" },
    island: { src: "/images/platformer/platforms/island.png" },
  },
  backgrounds: {
    greece: { src: "/images/platformer/backgrounds/greek.png" },
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
    }, 
  },
  enemies: {
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
    },
  }
  };

  // Hills Game Level defintion...
  const objects = [
    // GameObject(s), the order is important to z-index...
    { name: 'greece', id: 'background', class: Background, data: assets.backgrounds.greece },
    { name: 'grass', id: 'platform', class: Platform, data: assets.platforms.grass },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.2, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.2368, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.2736, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.3104, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.3472, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.384, yPercentage: 0.76 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.4208, yPercentage: 0.70 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.5090, yPercentage: 0.64 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.5642, yPercentage: 0.34 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.5274, yPercentage: 0.34 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.4906, yPercentage: 0.34 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 1 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.94 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.88 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.76 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.70 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.64 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.58 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.52 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.46 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.40 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.34 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.28 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.22 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6368, yPercentage: 0.64 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.16 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.1 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.06 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 1 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.94 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.88 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.82 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.76 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.70 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.64 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.58 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.52 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.46 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.40 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.34 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.28 },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.22 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.16 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.1 },
    //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.06 },
    { name: 'cerberus', id: 'cerberus', class: Cerberus, data: assets.enemies.cerberus, xPercentage: 0.2, minPosition: 0.09, difficulties: ["normal", "hard", "impossible"] },
    { name: 'cerberus', id: 'cerberus', class: Cerberus, data: assets.enemies.cerberus, xPercentage: 0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"] },
    { name: 'cerberus', id: 'cerberus', class: Cerberus, data: assets.enemies.cerberus, xPercentage: 0.7, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },//this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
    { name: 'dragon', id: 'dragon', class: Dragon, data: assets.enemies.dragon, xPercentage: 0.5, minPosition: 0.05 },
    { name: 'knight', id: 'player', class: PlayerGreece, data: assets.players.knight },
    { name: 'flyingIsland', id: 'flyingIsland', class: FlyingIsland, data: assets.platforms.island, xPercentage: 0.82, yPercentage: 0.55 },
    { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.66, yPercentage: 0.9 },
    { name: 'flag', id: 'finishline', class: FinishLine, data: assets.obstacles.flag, xPercentage: 0.875, yPercentage: 0.275 },
    { name: 'hillsEnd', id: 'background', class: BackgroundTransitions, data: assets.transitions.hillsEnd },
    { name: 'lava', id: 'lava', class: Lava, data: assets.platforms.lava, xPercentage: 0, yPercentage: 1 },
  ];

  const GameSetterGreece = {
    tag: 'Greece',
    assets: assets,
    objects: objects
  };

export default GameSetterGreece;