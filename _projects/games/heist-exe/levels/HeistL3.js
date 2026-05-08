import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import Gem from '@assets/js/projects/heist-exe/levels/Gem.js';
//import heistMusic from '@assets/js/heist-exe/heistMusic';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
class HeistL3 {
  constructor(gameEnv) {    
    this.gameEnv = gameEnv;

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_data_bg = {
        id: 'bg',
        src: path + "/images/projects/heist-exe/heist-bg2.png",
        pixels: {height: 597, width: 340}
    };

    const sprite_data_mc = {
        id: 'MC',
        name: 'mainplayer',
        src: path + "/images/projects/heist-exe/heist-mc.png",
        GRAVITY: true,
        SCALE_FACTOR: 10,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 50, y: 200 }, 
        pixels: { height: 532, width: 400 },        // total spritesheet size, not per-frame
        orientation: { rows: 4, columns: 4 },
        up:        { row: 3, start: 0, columns: 4 },
        upLeft:    { row: 1, start: 0, columns: 4, mirror: true, rotate: -Math.PI/16 },
        upRight:   { row: 0, start: 0, columns: 4, rotate: Math.PI/16 },
        left:      { row: 1, start: 0, columns: 4 },
        right:     { row: 0, start: 0, columns: 4 },
        down:      { row: 2, start: 0, columns: 4 },
        downLeft:  { row: 1, start: 0, columns: 4, mirror: true, rotate: Math.PI/16 },
        downRight: { row: 0, start: 0, columns: 4, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const border_top = {
        id: 'border_top',
        x: width * -0.0029, y: height * 0.0, width: width * 1.0029, height: height * 0.0587,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    } 

    const border_bottom = {
        id: 'border_bottom',
        x: width * 0.0, y: height * 0.9484, width: width * 1.0, height: height * 0.0516,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const border_left = {
        id: 'border_left',
        x: width * 0.0, y: height * 0.0, width: width * 0.04, height: height * 1.0,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const border_right = {
        id: 'border_right',
        x: width * 0.96, y: height * 0.0, width: width * 0.04, height: height * 1.0,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const green_zone = {
        id: 'green_zone',
        x: width * 0.8559, y: height * 0.3570, width: width * 0.1041, height: height * 0.2859,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_top_left = {
        id: 'wall_top_left',
        x: width * 0.0386, y: height * 0.3150, width: width * 0.1780, height: height * 0.0617,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_top_right = {
        id: 'wall_top_right',
        x: width * 0.7842, y: height * 0.3119, width: width * 0.1783, height: height * 0.0541,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_mid_lower_center = {
        id: 'wall_mid_lower_center',
        x: width * 0.4107, y: height * 0.7167, width: width * 0.3139, height: height * 0.2163,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_mid_upper_center = {
        id: 'wall_mid_upper_center',
        x: width * 0.4107, y: height * 0.1790, width: width * 0.1797, height: height * 0.0520,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_mid_upper_right = {
        id: 'wall_mid_upper_right',
        x: width * 0.3071, y: height * 0.4033, width: width * 0.3881, height: height * 0.0975,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_bot_left = {
        id: 'wall_bot_left',
        x: width * 0.0371, y: height * 0.6321, width: width * 0.1780, height: height * 0.0585,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }

    const wall_bot_right = {
        id: 'wall_bot_right',
        x: width * 0.7867, y: height * 0.6336, width: width * 0.1755, height: height * 0.0515,
        color: 'rgba(0, 255, 136, 0.5)',
        visible: true,
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 }
    }



    const gem_data_1 = {
        id: 'gem1',
        spriteImagePath: '/images/projects/heist-exe/gem.png',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 0.15, y: height * 0.45 }
    };

    const gem_data_2 = {
        id: 'gem2',
        spriteImagePath: '/images/projects/heist-exe/gem.png',
        value: 5,
        SCALE_FACTOR: 10,
        INIT_POSITION: { x: width * 8.5, y: height * 1.5 }
    };

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
        { class: Barrier, data: wall_mid_lower_center },
        { class: Barrier, data: wall_mid_upper_center },
        { class: Barrier, data: wall_mid_upper_right },
        { class: Barrier, data: wall_bot_left },
        { class: Barrier, data: wall_bot_right }
    ];
  }
}

export default HeistL3;