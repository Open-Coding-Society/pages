import GameEnvBackground from '../essentials/GameEnvBackground.js';
import Player from '../essentials/Player.js';
import Npc from '../essentials/Npc.js';
import Barrier from '../essentials/Barrier.js';
import Enemy from '../essentials/Enemy.js';


class HeistL2 {
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;


        const bgData = {
            name: 'heist_bg',
            src: path + "/assets/js/GameEnginev1.1/heist-exe/black_bg.png",
            pixels: { height: 600, width: 1000 }
        };


        const sprite_src_ghost = path + "/assets/js/GameEnginev1.1/heist-exe/heist_mc.png";
        const sprite_data_ghost = {
            id: 'ghost',
            greeting: 'You are GHOST, the elite infiltrator.',
            src: sprite_src_ghost,
            SCALE_FACTOR: 4,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            pixels: { height: 256, width: 256 },
            INIT_POSITION: { x: 100, y: 300 },
            /*
            orientation: { rows: 3, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            */
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
        };


        const sprite_src_guard = path + "/assets/js/GameEnginev1.1/heist-exe/heist_guard.png";
       
        const sprite_data_guard = {
            id: 'guard0',
            greeting: 'You should not be here, intruder!',
            src: sprite_src_guard,
            SCALE_FACTOR: 4,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 0,
            pixels: { height: 256, width: 256 },
            INIT_POSITION: { x: 500, y: 300 },
            orientation: { rows: 1, columns: 1 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            /*
            update: function() {
                if (!this.speed){
                        this.speed = 3;
                    }


                    if (!this.velocity) {
                        this.velocity = { x: this.speed, y: 0 }; // Start moving right
                    }


                    this.position.x += this.velocity.x;
                   
                    // Bounce off edges - check position boundaries
                    // console.log(`Position: ${this.position.x}, Velocity: ${this.velocity.x}, Canvas width: ${this.gameEnv.innerWidth}, Target width: ${this.width}`);
                   
                    if (this.position.x <= 0){
                        this.velocity.x = this.speed;
                        this.speed += 0.5;
                    } else if (this.position.x + this.width >= this.gameEnv.innerWidth) {
                        this.velocity.x = -this.speed;
                        this.speed += 0.5;
                    }


                    if (this.speed > 10){
                        this.speed = 10; // cap the speed
                    }
                }
                    */
                   
        };


        this.classes = [      
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: sprite_data_ghost },
            { class: Enemy, data: sprite_data_guard },
        ];
    }
}


export default HeistL2;

