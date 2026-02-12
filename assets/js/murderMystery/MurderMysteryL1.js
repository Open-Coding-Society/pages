import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';

class MurderMysteryL1 {
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
    

    const sprite_data_boat = {
        id: 'Boat',
        src: path + "/images/murderMystery/archie_boat.png", // A simple boat sprite
        SCALE_FACTOR: 5,
        STEP_FACTOR: 1000, // Same speed as Archie
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 250, y: 350 }, // Positioned slightly under Archie
        pixels: { height: 260, width: 100 }, // Adjust based on your boat image size
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
    id: 'Suspect',
    src: path + "/images/mansionGame/skeleton_key.png", // placeholder sprite
    SCALE_FACTOR: 20,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 0,
    // Position the suspect on the island, away from the boat 
    INIT_POSITION: { x: 800, y: 300 }, 
    pixels: { height: 200, width: 200 },
    orientation: { rows: 1, columns: 1 },
    down: { row: 0, start: 0, columns: 1 },
    dialogue: "Who goes there? I thought I was alone on this island",
    interact: function() {
        // Simple interaction logic for the suspect
        if (this.dialogueSystem) {
            this.dialogueSystem.startDialogue();
        } else {
            alert(this.dialogue);
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