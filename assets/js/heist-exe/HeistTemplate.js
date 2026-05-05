import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';

class HeistTemplate {
  constructor(gameEnv) {    
    // Store the game environment reference
    this.gameEnv = gameEnv;

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_bg = path + "/assets/js/heist-exe/heist-bg.png";
    const image_data_bg = {
        id: 'bg',
        src: image_src_bg,
        pixels: {height: 597, width: 340}
    };

    // Player Data for player
    const sprite_src_mc = path + "/assets/js/heist-exe/heist-mc.png"; // be sure to include the path
    const MC_SCALE_FACTOR = 5;
    const sprite_data_mc = {
        id: 'MC',
        name: 'mainplayer',
        src: sprite_src_mc,
        SCALE_FACTOR: MC_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        GRAVITY: true,
        INIT_POSITION: { x: 0, y: height - (height/MC_SCALE_FACTOR) }, 
        pixels: {height: 250, width: 167},
        orientation: {rows: 0, columns: 4 },
        down: {row: 0, start: 0, columns: 4 },
        downLeft: {row: 0, start: 0, columns: 4, mirror: true, rotate: Math.PI/16 }, // mirror is used to flip the sprite
        downRight: {row: 0, start: 0, columns: 4, rotate: -Math.PI/16 },
        left: {row: 1, start: 0, columns: 4, mirror: true }, // mirror is used to flip the sprite
        right: {row: 1, start: 0, columns: 4 },
        up: {row: 0, start: 0, columns: 4},
        upLeft: {row: 1, start: 0, columns: 4, mirror: true, rotate: -Math.PI/16 }, // mirror is used to flip the sprite
        upRight: {row: 1, start: 0, columns: 4, rotate: Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    this.classes = [      
      { class: GameEnvBackground, data: image_data_bg },
      { class: Player, data: sprite_data_mc }
    ];
  }
}

export default HeistTemplate;