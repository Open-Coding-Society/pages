import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryL1 {
  static friendlyName = "Level 1: The Docks";
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_background = path + "/images/murderMystery/murderMysteryLevel1.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "You know understand the situation you are in. Navigate to the island for your first task.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    const musicPath = path + "/images/murderMystery/level1_music.wav";
    this.levelMusic = new Audio(musicPath);
    this.levelMusic.loop = true;
    this.levelMusic.volume = 0.4;

    // 2. Debugging logs to see if the file is actually found
    this.levelMusic.oncanplaythrough = () => console.log("🎵 Music file loaded successfully!");
    this.levelMusic.onerror = () => console.error("❌ Audio Error! Check if file exists at:", musicPath);

    // 3. Robust Interaction Handler
    const startAudio = () => {
        this.levelMusic.play()
            .then(() => {
                console.log("▶️ Music started!");
                // Remove listeners only after music actually starts
                window.removeEventListener('keydown', startAudio);
                window.removeEventListener('mousedown', startAudio);
                window.removeEventListener('touchstart', startAudio);
            })
            .catch(err => {
                // This catches the "Blocked" error and lets us try again on the next click/key
                console.warn("User must interact with the game (click or move) to start music.");
            });
    };

    // Listen for anything the user does
    window.addEventListener('keydown', startAudio);
    window.addEventListener('mousedown', startAudio);
    window.addEventListener('touchstart', startAudio);


    const sprite_data_boat = {
        id: 'Boat',
        src: path + "/images/murderMystery/archie_boat.png", // A simple boat sprite
        SCALE_FACTOR: 5,
        STEP_FACTOR: 1000, // Same speed as Archie
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 128, y: 128 }, // Positioned slightly under Archie
        pixels: { height: 200, width: 150}, // Adjust based on your boat image size
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        downRight: {row: 0, start: 0, columns: 1},
        downLeft: {row: 0, start: 0, columns: 1},
        left: { row: 0, start: 0, columns: 1 },
        right: { row: 0, start: 0, columns: 1 },
        up: { row: 0, start: 0, columns: 1 },
        upLeft: {row: 0, start: 0, columns: 1},
        upRight: {row: 0, start: 0, columns: 1},
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.3},
        keypress: { left: 65, right: 68, up: 87, down: 83 } // Same keys as Archie
   };

   // Suspect sprite should be visible on island
   // Make it so that the suspect sprite is shown on the island, and when the boat reached the island coordinate of the background
   // the suspect sprite will show up and have a dialogue interaction with the player
   // The suspect will say "Who goes there? I thought I was alone on this island". 
   // The suspect should be positioned away from the boat's initial position, so that the player has to navigate around the island to find them.

   const sprite_data_suspect = {
    id: 'Suspect 1',
    src: path + "/images/mansionGame/skeleton_key.png", // placeholder sprite
    SCALE_FACTOR: 15,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 0,
    // Position the suspect on the island, away from the boat 
    INIT_POSITION: { x: 1300, y: 300 }, 
    pixels: { height: 200, width: 200 },
    orientation: { rows: 1, columns: 1 },
    down: { row: 0, start: 0, columns: 1 },
    greeting: "Hey! Who are you? Press E to interact with me. ",
    dialogues: ["Who goes there? I thought I was alone on this island...",
        "Where was I? I've been stranded here for days after the storm hit.",
        "My crew left me behind when I fell overboard. I barely made it to shore.",
        "I've been trying to survive on fish and coconuts ever since.",
        "If something happened on the ship, I wouldn't know. I've been here the whole time."
    ],
    
        interact: function() {
        if (!this.dialogueSystem || !this.spriteData.dialogues) return;
        
        const dialogues = this.spriteData.dialogues;
        const npcName = this.spriteData?.id || "Suspect";
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
            { class: Player, data: sprite_data_boat },   // Boat spawns first
            { class: Npc, data: sprite_data_suspect }
    ];
}
}

export default MurderMysteryL1;