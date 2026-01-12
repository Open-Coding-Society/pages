// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';

// Minimal Definition
class GameLevelSquares {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;

    this.classes = [      
      { class: GameEnvBackground, data: {} },
      { class: Player, data: {} },
      { class: Player, data: {
        INIT_POSITION: { x: width, y: height },
        keypress: { up: 73, left: 74, down: 75, right: 76 },
        fillStyle: 'green' 
      }},
    ];
    
    console.log("GameLevelSquares constructor finished");
  }
}

export default GameLevelSquares;