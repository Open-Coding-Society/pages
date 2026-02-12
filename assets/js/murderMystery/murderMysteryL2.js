import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';


class MurderMysteryL2 {
    static friendlyName = "Level 2: The Pirate's Cove";
    constructor(gameEnv) {
        const path = gameEnv.path;
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const bgData = {
            name: 'custom_bg',
            src: path + "/assets/images/background.png",
            pixels: { height: 600, width: 1000 }
        };
        const playerData = {
            id: 'McArchie',
            src: path + "/assets/images/mcarchie.png",
            SCALE_FACTOR: 8,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 6.5,
            INIT_POSITION: { x: 350, y: 400 },
            pixels: { height: 256, width: 256 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 4 },
            downRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            downLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            right: { row: Math.min(2, 4 - 1), start: 0, columns: 4 },
            left: { row: Math.min(1, 4 - 1), start: 0, columns: 4 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 4 },
            upRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
            upLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };
        const npcData1 = {
            id: 'Captain Blackbeard',
            greeting: 'Hoy matey, my name is Captain Blackbeard. I am the most feared pirate on the seven seas. I have a treasure map that leads to a hidden island, but I need someone to help me find it. Are you up for the adventure?',
            src: path + "/assets/images/Pirate.png",
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 457, y: 400 },
            pixels: { height: 223, width: 505 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ['Hoy matey, my name is Captain Blackbeard. I am the most feared pirate on the seven seas. I have a treasure map that leads to a hidden island, but I need someone to help me find it. Are you up for the adventure?'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };


        const npcData2 = {
            id: 'Treasure Chest',
            greeting: 'Hoy matey, my name is Captain Blackbeard. I am the most feared pirate on the seven seas. I have a treasure map that leads to a hidden island, but I need someone to help me find it. Are you up for the adventure?',
            src: path + "/assets/images/Chest.png",
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 157, y: 200 },
            pixels: { height: 223, width: 400 },
            orientation: { rows: 1, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.0001, heightPercentage: 0.0001},
            dialogues: ['I am a treasure chest!'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: npcData1 },
            { class: Npc, data: npcData2 }
        ];
    }
}


export default MurderMysteryL2;

