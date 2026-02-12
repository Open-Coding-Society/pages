import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryL4 {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const bgData = {
            name: 'custom_bg',
            src: path + "/images/murderMystery/darkcave.png",
            pixels: { height: 600, width: 1000 }
        };
        const playerData = {
            id: 'Archie',
            src: path + "/images/murderMystery/archie_left.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 0, y: 503 },
            pixels: {height: 150, width: 100},
            orientation: {rows: 1, columns: 1},
            down: { row: 0, start: 0, columns: 1 },
            downRight: { row: 0, start: 0, columns: 1, rotate: Math.PI/16 },
            downLeft: { row: 0, start: 0, columns: 1, rotate: -Math.PI/16 },
            right: { row: 0, start: 0, columns: 1 },
            left: { row: 0, start: 0, columns: 1 },
            up: { row: 0, start: 0, columns: 1 },
            upRight: { row: 0, start: 0, columns: 1, rotate: -Math.PI/16 },
            upLeft: { row: 0, start: 0, columns: 1, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
        ];
    }
}

export default MurderMysteryL4;