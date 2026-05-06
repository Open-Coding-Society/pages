import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Gem from '@assets/js/heist-exe/Gem.js';
class HeistTemplate {
  constructor(gameEnv) {    
    this.gameEnv = gameEnv;

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_data_bg = {
        id: 'bg',
        src: path + "/assets/js/heist-exe/images/heist-bg.png",
        pixels: {height: 597, width: 340}
    };

    const MC_SCALE_FACTOR = 5;
    const sprite_data_mc = {
        id: 'MC',
        name: 'mainplayer',
        src: path + "/assets/js/heist-exe/images/heist-mc.png",
        SCALE_FACTOR: MC_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        GRAVITY: true,
        INIT_POSITION: { x: 0, y: height - (height/MC_SCALE_FACTOR) }, 
        pixels: {height: 250, width: 167},
        orientation: {rows: 2, columns: 4},
        down:      {row: 0, start: 0, columns: 4},
        downLeft:  {row: 0, start: 0, columns: 4, mirror: true, rotate: Math.PI/16},
        downRight: {row: 0, start: 0, columns: 4, rotate: -Math.PI/16},
        left:      {row: 1, start: 0, columns: 4, mirror: true},
        right:     {row: 1, start: 0, columns: 4},
        up:        {row: 0, start: 0, columns: 4},
        upLeft:    {row: 1, start: 0, columns: 4, mirror: true, rotate: -Math.PI/16},
        upRight:   {row: 1, start: 0, columns: 4, rotate: Math.PI/16},
        hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
        keypress: {up: 87, left: 65, down: 83, right: 68}
    };

    const gem_data_1 = {
        id: 'gem1',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 0.05, y: height * 0.05 }
    };

    const gem_data_2 = {
        id: 'gem2',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 0.5, y: height * 0.5 }
    };

    this.classes = [      
      { class: GameEnvBackground, data: image_data_bg },
      { class: Player, data: sprite_data_mc },
      { class: Gem, data: gem_data_1 },
      { class: Gem, data: gem_data_2 }
    ];
  }
}

export default HeistTemplate;