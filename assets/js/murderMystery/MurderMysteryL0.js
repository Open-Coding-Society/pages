import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryL0 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_background = path + "/images/murderMystery/ship.png"; // be sure to include the path
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

    const sprite_data_ghost = {
        id: 'ghost',
        greeting: "Arrr… ye can see me, can ye? Good. Press E to hear me tale",
        src: path + "/images/murderMystery/ghost.png", // An invisible or small target sprite
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 1200, y: 300 },
        pixels: { height: 500, width: 120 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.3 },
        currentQuestionIndex: 0,
        dialogues: ["A blade took me in the dark, quiet as a whisper. No duel. No honor. Just a coward's strike while I dreamt",
            "But I can't stray far from where I died.",
            "If ye'd help a restless spirit, find the traitor who did this to me.",
            "The first suspect will be on an island. Sail east until ye find them",
            "Press esc to begin ye search, and talk to the suspect when ye find them."
        ],
        interact: function() {
        if (!this.dialogueSystem || !this.spriteData.dialogues) return;
        
        const dialogues = this.spriteData.dialogues;
        const npcName = this.spriteData?.id || "ghost";
        const npcAvatar = this.spriteData?.src || null;
        
        // Show current dialogue
        const currentDialogue = dialogues[this.currentQuestionIndex];
        this.dialogueSystem.showDialogue(currentDialogue, npcName, npcAvatar);
        this.currentQuestionIndex++;
        
        // Add custom handler for advancing dialogue
        if (!this._customHandler) {
            this._customHandler = (e) => {
                if ((e.key === 'e' || e.key === 'u') && this.dialogueSystem.isDialogueOpen()) {
                    e.stopPropagation(); // Prevent Npc.js from handling it
                    
                    // Check if we've reached the end
                    if (this.currentQuestionIndex >= dialogues.length) {
                        // Close dialogue and reset
                        this.dialogueSystem.closeDialogue();
                        this.currentQuestionIndex = 0;
                    } else {
                        // Show next line
                        const nextDialogue = dialogues[this.currentQuestionIndex];
                        this.dialogueSystem.showDialogue(nextDialogue, npcName, npcAvatar);
                        this.currentQuestionIndex++;
                    }
                }
            };
            document.addEventListener('keydown', this._customHandler, true); // Use capture phase
        }
    }
    };



    this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_archie }, // Archie sprite
            { class: Npc, data: sprite_data_ghost }    // The ghost npc
        ];
   
}
}

export default MurderMysteryL0;