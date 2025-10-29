import GameEnvBackground from './GameEngine/GameEnvBackground.js'
import Player from './GameEngine/Player.js'


class MansionLevel3 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // 🏰 Background data
    const image_background = path + "/images/mansionGame/library_lvl3.png"; // Replace with your actual background file
    const image_data_background = {
        name: 'background',
        greeting: "Welcome to the Library — find the hidden key to unlock the mansion’s secret chamber.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    // 🧍 Player data (using same movement system as Level 5)
    const sprite_player = path + "/images/gamify/spookMcWalk.png"; // be sure to include the path
  const player_scale_factor = 7; // Bigger player
  const sprite_data_player = {
    id: 'Player',
    greeting: "I'm ready to explore the library and find the hidden key!",
    src: sprite_player,
    SCALE_FACTOR: player_scale_factor,
    STEP_FACTOR: 800,
    ANIMATION_RATE: 10,
    INIT_POSITION: { x: 0, y: 0 }, 
    pixels: {height: 2400, width: 3600},
    orientation: {rows: 2, columns: 3},
    down: {row: 1, start: 0, columns: 3},
    downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
    downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
    left: {row: 0, start: 0, columns: 3},
    right: {row: 1, start: 0, columns: 3},
    up: {row: 1, start: 0, columns: 3},
    upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
    upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
    hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
    // Support both WASD and Arrow keys
    keypress: {
      up: [87, 38],    // W, ArrowUp
      left: [65, 37],  // A, ArrowLeft
      down: [83, 40],  // S, ArrowDown
      right: [68, 39]  // D, ArrowRight
    }
  };

    //  List of game object definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: Player, data: sprite_data_player },
    ];
  }
}

export default MansionLevel3;
