import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryL4 {
    static friendlyName = "Level 4: The Cave";
    
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const bgData = {
            name: 'custom_bg',
            src: path + "/images/murderMystery/darkcave.png",
            pixels: { height: 600, width: 1000 }
        };

        const sprite_data_archie = {
            id: 'Archie',
            greeting: "Hi, I am Archie.",
            src: path + "/images/murderMystery/mcarchie.png",
            SCALE_FACTOR: 6,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 250, y: 350 },
            pixels: {height: 256, width: 256},
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI/16 },
            left: { row: 1, start: 0, columns: 3 },
            right: { row: 2, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI/16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: sprite_data_archie },
        ];
    }
}

export default MurderMysteryL4;