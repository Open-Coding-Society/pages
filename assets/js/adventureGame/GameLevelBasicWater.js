import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';

class GameLevelBasicWater {
  constructor(gameEnv) {
    console.log("Initializing GameLevelWater...");
    
    // Store the game environment reference
    this.gameEnv = gameEnv;

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_water = path + "/images/gamify/deepseadungeon.jpeg";
    const image_data_water = {
        id: 'Water',
        src: image_src_water,
        pixels: {height: 597, width: 340}
    };

    // Player Data for Octopus
    const sprite_src_octopus = path + "/images/gamify/octopus.png"; // be sure to include the path
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
        id: 'Octopus',
        greeting: "Hi I am Octopus, the water wanderer. I am looking for wisdome and adventure!",
        src: sprite_src_octopus,
        SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        GRAVITY: true,
        INIT_POSITION: { x: 0, y: height - (height/OCTOPUS_SCALE_FACTOR) }, 
        pixels: {height: 250, width: 167},
        orientation: {rows: 3, columns: 2 },
        down: {row: 0, start: 0, columns: 2 },
        downLeft: {row: 0, start: 0, columns: 2, mirror: true, rotate: Math.PI/16 }, // mirror is used to flip the sprite
        downRight: {row: 0, start: 0, columns: 2, rotate: -Math.PI/16 },
        left: {row: 1, start: 0, columns: 2, mirror: true }, // mirror is used to flip the sprite
        right: {row: 1, start: 0, columns: 2 },
        up: {row: 0, start: 0, columns: 2},
        upLeft: {row: 1, start: 0, columns: 2, mirror: true, rotate: -Math.Pi/16 }, // mirror is used to flip the sprite
        upRight: {row: 1, start: 0, columns: 2, rotate: Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    this.classes = [      
      { class: GameEnvBackground, data: image_data_water },
      { class: Player, data: sprite_data_octopus },
    ];
  }
}

export default GameLevelBasicWater;