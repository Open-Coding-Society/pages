import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryBossFight {
  static friendlyName = "Level 6: Boss Fight";
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_background = path + "/assets/images/bossMap.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "Your fate has been sealed. Go avenge your fallen comrades.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

      const sprite_data_archie = {
        id: 'Archie',
        src: path + "/assets/images/mcarchie.png",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 0,
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
    src: path + "/assets/images/Bossright.png",
    SCALE_FACTOR: 15,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 0,
    INIT_POSITION: { x: 1300, y: 300 }, 
    pixels: { height: 200, width: 200 },
    orientation: { rows: 1, columns: 1 },
    down: { row: 0, start: 0, columns: 1 },
    greeting: "Well, well well. Press E to interact with me. ",
    dialogues: [
        { speaker: 'Archie', text: "I have received this sword. It is the only thing capable of slaying you." },
        { speaker: 'Boss', text: "From the shadows, I emerge. Your fate has been sealed." },
        { speaker: 'Archie', text: "I won't stand for this injustice! You will pay for your crimes!" },
        { speaker: 'Boss', text: "Foolish hero... You think that blade can stop me? I will crush you and everything you protect!" },
        { speaker: 'Archie', text: "*With a swift motion, you raise the sword and strike. The blade cuts through darkness itself.*" },
        { speaker: 'Boss', text: "No... this cannot be... I am eternal..." },
        { speaker: 'Archie', text: "You will harm us no more, you monster." }
    ],
    
        interact: function() {
        if (!this.dialogueSystem || !this.spriteData.dialogues) return;
        
        const dialogues = this.spriteData.dialogues;
        const npcName = this.spriteData?.id || "Boss";
        const npcAvatar = this.spriteData?.src || null;
        
        // Show current dialogue
        const currentDialogueObj = dialogues[this.currentQuestionIndex];
        const displayName = currentDialogueObj.speaker || npcName;
        this.dialogueSystem.showDialogue(currentDialogueObj.text, displayName, npcAvatar);
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
                        const nextDialogueObj = dialogues[this.currentQuestionIndex];
                        const displayName = nextDialogueObj.speaker || npcName;
                        this.dialogueSystem.showDialogue(nextDialogueObj.text, displayName, npcAvatar);
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
            { class: Player, data: sprite_data_archie },
            { class: Npc, data: sprite_data_boss }
    ];

  }
}

export default MurderMysteryBossFight;