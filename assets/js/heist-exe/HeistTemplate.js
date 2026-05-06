import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Gem from '@assets/js/heist-exe/Gem.js';
//import heistMusic from '@assets/js/heist-exe/heistMusic';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
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
        SCALE_FACTOR: 1000,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        //GRAVITY: true,
        INIT_POSITION: { x: 0, y: 200 }, 
        pixels: {height: 100, width: 133},
        orientation: {rows: 4, columns: 4},
        down:      {row: 2, start: 0, columns: 4},
        //downLeft:  {row: 0, start: 0, columns: 4, mirror: true, rotate: Math.PI/16},
        //downRight: {row: 0, start: 0, columns: 4, rotate: -Math.PI/16},
        left:      {row: 1, start: 0, columns: 4},
        right:     {row: 0, start: 0, columns: 4},
        up:        {row: 3, start: 0, columns: 4},
        //upLeft:    {row: 1, start: 0, columns: 4, mirror: true, rotate: -Math.PI/16},
        //upRight:   {row: 1, start: 0, columns: 4, rotate: Math.PI/16},
        hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
        keypress: {up: 87, left: 65, down: 83, right: 68}
    };

    const border_top = {
        id: 'border_top',
        x: 0.0, y: 0.0, width: 1.0, height: 0.09,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    } 

    const border_bottom = {
        id: 'border_bottom',
        x: 0.0, y: 0.91, width: 1.0, height: 0.09,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const border_left = {
        id: 'border_left',
        x: 0.0, y: 0.0, width: 0.04, height: 1.0,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const border_right = {
        id: 'border_right',
        x: 0.96, y: 0.0, width: 0.04, height: 1.0,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const green_zone = {
        id: 'green_zone',
        x: 0.82, y: 0.09, width: 0.14, height: 0.82,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_top_left = {
        id: 'wall_top_left',
        x: 0.04, y: 0.10, width: 0.27, height: 0.20,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_top_right = {
        id: 'wall_top_right',
        x: 0.55, y: 0.10, width: 0.22, height: 0.16,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_mid_left = {
        id: 'wall_mid_left',
        x: 0.04, y: 0.43, width: 0.13, height: 0.20,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_mid_center = {
        id: 'wall_mid_center',
        x: 0.28, y: 0.43, width: 0.22, height: 0.16,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_mid_right = {
        id: 'wall_mid_right',
        x: 0.55, y: 0.43, width: 0.22, height: 0.16,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }


    const gem_data_1 = {
        id: 'gem1',
        spriteImagePath: '@assets/js/heist-exe/gem.png',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 0.05, y: height * 0.05 }
    };

    const gem_data_2 = {
        id: 'gem2',
        spriteImagePath: '@assets/js/heist-exe/gem.png',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 0.5, y: height * 0.5 }
    };

    const wall_bot_left = {
        id: 'wall_bot_left',
        x: 0.04, y: 0.67, width: 0.27, height: 0.20,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

    const wall_bot_right = {
        id: 'wall_bot_right',
        x: 0.37, y: 0.67, width: 0.22, height: 0.16,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    }

this.classes = [      
      { class: GameEnvBackground, data: image_data_bg },
      { class: Player, data: sprite_data_mc },
      { class: Gem, data: gem_data_1 },
      { class: Gem, data: gem_data_2 },
      { class: Barrier, data: border_top },
      { class: Barrier, data: border_bottom },
      { class: Barrier, data: border_left },
      { class: Barrier, data: border_right },
      { class: Barrier, data: green_zone },
      { class: Barrier, data: wall_top_left },
      { class: Barrier, data: wall_top_right },
      { class: Barrier, data: wall_mid_left },
      { class: Barrier, data: wall_mid_center },
      { class: Barrier, data: wall_mid_right },
      { class: Barrier, data: wall_bot_left },
      { class: Barrier, data: wall_bot_right },
    ];
  }
}

export default HeistTemplate;