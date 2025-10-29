import GameEnvBackground from './GameEngine/GameEnvBackground.js'
import AnimatedPlayer from './GameEngine/AnimatedPlayer.js'


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

    // 🧍 Player (optional)
    // const sprite_src_explorer = path + "/images/gamify/explorer.png";
    // const EXPLORER_SCALE = 5;
    // const sprite_data_explorer = {
    //   id: 'Explorer',
    //   greeting: "I’m ready to uncover the mansion’s secrets!",
    //   src: sprite_src_explorer,
    //   SCALE_FACTOR: EXPLORER_SCALE,
    //   STEP_FACTOR: 1000,
    //   ANIMATION_RATE: 50,
    //   INIT_POSITION: { x: 0, y: height - (height / EXPLORER_SCALE) },
    //   pixels: { height: 384, width: 512 },
    //   orientation: { rows: 3, columns: 4 },
    //   down: { row: 0, start: 0, columns: 3 },
    //   left: { row: 2, start: 0, columns: 3 },
    //   right: { row: 1, start: 0, columns: 3 },
    //   up: { row: 3, start: 0, columns: 3 },
    //   hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
    //   keypress: { up: 87, left: 65, down: 83, right: 68 }, // W, A, S, D
    // };

    //  List of game object definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      // { class: Player, data: sprite_data_explorer },
    ];
  }
}

export default MansionLevel3;
