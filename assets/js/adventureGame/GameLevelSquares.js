// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEnvBackground.js';
import Background from './Background.js';
import BackgroundParallax from './BackgroundParallax.js';
import Player from './Player.js';

// Minimal Definition
class GameLevelSquares {
  constructor(gameEnv) {
    let path = gameEnv.path;
    let height = gameEnv.innerHeight;

    this.classes = [      
      { class: GameEnvBackground, data: {src:  path + "/images/platformer/backgrounds/mountains.jpg"} }, // zIndex default is 0
      { class: Background, data: {src:  path + "/images/platformer/backgrounds/hills.png", zIndex: 1 } },
      { class: BackgroundParallax, data: {src:  path + "/images/platformer/backgrounds/snowfall.png", zIndex: 2 } },
      { class: Player, data: {id: "player1", zIndex: 3} }, // wasd is default
      { class: Player, data: {
        id: "player2", 
        zIndex: 3,
        fillStyle: "blue", 
        INIT_POSITION: { x: 0, y: height/2 }, 
        keypress: {up: 73, left: 74, down: 75, right: 76 }} // Using IJKL
      }
    ];
  }
}

export default GameLevelSquares;