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
                greeting: "Hi, I am Archie.",
                src: path + "/assets/images/mcarchie.png",
                SCALE_FACTOR: 6,
                STEP_FACTOR: 1000,
                ANIMATION_RATE: 50,
                INIT_POSITION: { x: 720, y: 800 },
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

     const sprite_data_boss = {
        id: 'Boss',
        src: path + "/assets/images/boss.png",
        archie_src: path + "/assets/images/archie_single.png",
        // Make boss exactly 2x Archie's scale
        SCALE_FACTOR:1.25,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 700, y: 60 }, 
        pixels: { height: 1024, width: 1024 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
    greeting: "Well played \"hero\". Press E to fight me if you dare!",
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
        const archieAvatar = this.spriteData?.archie_src || null;
        
        // Show current dialogue and choose avatar based on the speaker
        const currentDialogueObj = dialogues[this.currentQuestionIndex];
        const displayName = currentDialogueObj.speaker || npcName;
        // If the speaker is Archie, use Archie's sprite; otherwise use this NPC's sprite
        const speakerAvatar = (displayName === 'Archie') ? archieAvatar : npcAvatar;
        this.dialogueSystem.showDialogue(currentDialogueObj.text, displayName, speakerAvatar);
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
                        // Show next line and update avatar per speaker
                        const nextDialogueObj = dialogues[this.currentQuestionIndex];
                        const displayName = nextDialogueObj.speaker || npcName;
                        const nextAvatar = (displayName === 'Archie') ? archieAvatar : npcAvatar;
                        this.dialogueSystem.showDialogue(nextDialogueObj.text, displayName, nextAvatar);
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
