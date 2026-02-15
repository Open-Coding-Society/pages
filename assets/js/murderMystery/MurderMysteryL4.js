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



        const npcData1 = {
            id: 'Key',
            greeting: 'Hello traveler! Your journey has been long, but the end is near.',
            src: path + "/images/murderMystery/key.png",
            SCALE_FACTOR: 10,
            ANIMATION_RATE: 1000,
            INIT_POSITION: { x: 457, y: 400 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Good job! You found the key.'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };
        

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            // draw tiled piskel overlay on top of background
            // { class: GameEnvBackground, data: tileOverlayData },
            { class: Player, data: sprite_data_archie },
            { class: Npc, data: npcData1 }
        ];
    }
}

export default MurderMysteryL4;