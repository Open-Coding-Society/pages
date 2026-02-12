import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Boss from '/assets/js/GameEnginev1/essentials/Boss.js';

class MurderMysteryBossFight {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_background = path + "/images/murderMystery/boss_map.png"; 
    const image_data_background = {
        name: 'background',
        greeting: "The story starts here, you will search for clues and solve the mystery.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };


    const sprite_data_archie = {
        id: 'Archie',
        greeting: "Hi, I am Archie.",
        src: path + "/images/murderMystery/archie_left.png",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 250, y: 350 },
        pixels: {height: 150, width: 100},
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        downRight: {row: 0, start: 0, columns: 1},
        downLeft: {row: 0, start: 0, columns: 1},
        left: {row: 0, start: 0, columns: 1},
        right: {row: 0, start: 0, columns: 1},
        up: {row: 0, start: 0, columns: 1},
        upLeft: {row: 0, start: 0, columns: 1},
        upRight: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.5, heightPercentage: 0.5},
        keypress: {left: 65, right:68, up: 87, down: 83} // A, D, W, S
    };


    const sprite_data_boss = {
        id: 'Boss',
        src: path + "/images/murderMystery/bossleft.png",
        SCALE_FACTOR: 2,
        STEP_FACTOR: 1000, // Same speed as Archie
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 850, y: 400 }, 
        pixels: { height: 200, width: 400 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        downRight: {row: 0, start: 0, columns: 1},
        downLeft: {row: 0, start: 0, columns: 1},
        left: { row: 0, start: 0, columns: 1 },
        right: { row: 0, start: 0, columns: 1 },
        up: { row: 0, start: 0, columns: 1 },
        upLeft: {row: 0, start: 0, columns: 1},
        upRight: {row: 0, start: 0, columns: 1},
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
   };


    this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Boss, data: sprite_data_boss },  
            { class: Player, data: sprite_data_archie }, 
        ];
   
}
}

export default MurderMysteryBossFight;