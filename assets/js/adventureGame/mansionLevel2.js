import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import GameControl from './GameEngine/GameControl.js';

class MansionLevel2 {
  /**
   * Properties and methods to define a game level
   * @param {*} gameEnv - The active game environment
   */
  constructor(gameEnv) {
    // Dependencies to support game level creation
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data - Using the graveyard mansion image
    // TODO: Replace with mansion_graveyard.png once the image is saved
    const image_src_mansion = path + "/images/gamify/Untitled12_20251022192158.jpeg";
    const image_data_mansion = {
        name: 'Mansion Graveyard',
        greeting: "Welcome to the Haunted Mansion Graveyard! Beware of the spirits...",
        src: image_src_mansion,
        pixels: {height: 600, width: 1000}
    };

    // Player data - Using Chill Guy sprite which has proper animation frames
    const sprite_src_player = path + "/images/gamify/chillguy.png";
    const PLAYER_SCALE_FACTOR = 5;
    const sprite_data_player = {
        id: 'Player',
        greeting: "Welcome to the Haunted Mansion!",
        src: sprite_src_player,
        SCALE_FACTOR: PLAYER_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: height - (height/PLAYER_SCALE_FACTOR) }, 
        pixels: {height: 384, width: 512},
        orientation: {rows: 3, columns: 4 },
        down: {row: 0, start: 0, columns: 3 },
        downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
        downLeft: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
        left: {row: 2, start: 0, columns: 3 },
        right: {row: 1, start: 0, columns: 3 },
        up: {row: 0, start: 0, columns: 3 },
        upLeft: {row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
        upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // List of objects definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_mansion },
      { class: Player, data: sprite_data_player }
    ];
  }
}

export default MansionLevel2;