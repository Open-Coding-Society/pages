import GameEnvBackground  from "./GameEngine/GameEnvBackground.js";
import Player from "./GameEngine/Player.js";
import Enemy from './GameEngine/Enemy.js';

class MansionLevel6_BattleRoom {
    constructor(gameEnv) {
        let width = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path = gameEnv.path;

        const image_src_floor = path + "/images/gamify/tiledFloor.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 341, width: 498}
        };

        const sprite_src_mc = path + "/images/gamify/playerMove.png";
        const MC_SCALE_FACTOR = 1;
        const sprite_data_mc = {
            id: 'mc',
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: (width / 3), y: (1.1*height - (height/MC_SCALE_FACTOR))},
            pixels: {height: 3600, width: 1200},
            orientation: {rows: 1, columns: 3},
            // for now I'm just making the animation for all directions the same.
            down: {row: 0, start: 0, columns: 3},
            downRight: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 0, start: 0, columns: 3},
            right: {row: 0, start: 0, columns: 3},
            up: {row: 0, start: 0, columns: 3},
            upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},  
            hitbox: {widthPercentage: 0.5, heightPercentage: 0.4},
            keypress: {up: 87, left: 65, down: 83, right: 68} // W, A, S, D
        };

        const sprite_src_enemy = path + "/images/gamify/enemyBody.png";
        const ENEMY_SCALE_FACTOR = 1;
        const sprite_enemy_data = {
            id: 'eb',
            src: sprite_src_enemy,
            SCALE_FACTOR: ENEMY_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 30,
            INIT_POSITION: {x: (2 * width / 3), y: (1.1*height - (height/ENEMY_SCALE_FACTOR))},
            pixels: {height: 10800, width: 3600},
            orientation: {rows: 1, columns: 3}  
        }

        this.classes = [
            {class: GameEnvBackground, data: image_data_floor},
            {class: Player, data: sprite_data_mc},
            {class: Enemy, data: sprite_enemy_data}
        ];

    };

}

export default MansionLevel6_BattleRoom;