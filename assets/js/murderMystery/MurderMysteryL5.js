import GameEnvBackground from "../GameEnginev1/essentials/GameEnvBackground.js";
import Player from "../GameEnginev1/essentials/Player.js";
import Npc from "../GameEnginev1/essentials/Npc.js";


class MurderMysteryL5 {
  static friendlyName = "Level 5: The Duel"; 
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;


    // Background data
    let image_background = path + "/images/murderMystery/backgroundPrepLevel.png"; // be sure to include the path
    let image_data_background = {
        name: 'background',
        greeting: "This is the the study.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    const sprite_data_island = {
        id: 'Pirate Dude',
        greeting: "Yo, the murderer is in the next room. Prepare for battle! Pick up the sword to start the fight.",
        src: path + "/images/murderMystery/island_target.png", // An invisible or small target sprite
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width - 200, y: 100 }, // Placed at the right edge
        pixels: { height: 462, width: 540 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
    };

    // Sword sprite that triggers the teleport
    let sword_sprite_data = {
        id: 'Sword',
        greeting: "A magical sword...",
        src: path + "/images/murderMystery/swordprep.png", // Update this path to your sword image
        SCALE_FACTOR: 10,
        STEP_FACTOR: 0,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width * 0.25, y: height * 0.6 },
        pixels: { height: 500, width: 500 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.6, heightPercentage: 0.8 },
        keypress: {}
    };


    // Class for the sword that teleports you
    class SwordNpc extends Npc {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
        this.spriteData = data;
      }

      showSwordMessage() {
        alert("You found the magical sword!\n\nPress ESC to start the boss fight.");
      }
    }

    // Wire sword reaction
    sword_sprite_data.reaction = function() {
      try {
        let inst = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'Sword');
        if (inst && typeof inst.showSwordMessage === 'function') {
          inst.showSwordMessage();
        }
      } catch (e) { console.warn('sword reaction failed', e); }
    };

    const sprite_data_archie = {
        id: 'Archie',
        greeting: "Hi, I am Archie.",
        src: path + "/images/murderMystery/mcarchie.png",
        //src: path + "/images/gamebuilder/sprites/pew.png",
        SCALE_FACTOR: 6,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 250, y: 350 },
        pixels: {height: 256, width: 256},
        //pixels: {height: 320, width: 320},
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

    // List of objects definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: SwordNpc, data: sword_sprite_data },
      { class: Player, data: sprite_data_archie }
    ];
  }


}


export default MurderMysteryL5;

