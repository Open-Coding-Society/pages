import GameEnvBackground from "../GameEnginev1/essentials/GameEnvBackground.js";
import Player from "../GameEnginev1/essentials/Player.js";
import Npc from "../GameEnginev1/essentials/Npc.js";
import DialogueSystem from "../GameEnginev1/DialogueSystem.js";


class MurderMysteryL5 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    let image_background = path + "/images/room5images/backgroundpreplevel.png"; 
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
        src: path + "/images/murderMystery/preppirate.png", 
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width - 200, y: 100 }, 
        pixels: { height: 462, width: 540 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
    };

    
    let sword_sprite_data = {
        id: 'Sword',
        greeting: "A magical sword...",
        src: path + "/images/room5images/prepsword.png", 
        SCALE_FACTOR: 6,
        STEP_FACTOR: 0,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width * 0.25, y: height * 0.6 },
        pixels: { height: 256, width: 256 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.6, heightPercentage: 0.8 },
        keypress: {}
    };

    class SwordNpc extends Npc {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
        this.spriteData = data;
      }

      showSwordMessage() {
        alert("You found the magical sword!\n\nPress ESC to start the boss fight.");
      }
    }

    sword_sprite_data.reaction = function() {
      try {
        let inst = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'Sword');
        if (inst && typeof inst.showSwordMessage === 'function') {
          inst.showSwordMessage();
        }
      } catch (e) { console.warn('sword reaction failed', e); }
    };

    let sprite_data_mc = {
    src: path + "/images/gamebuilder/mcarchie.png",
    SCALE_FACTOR: 8,
    STEP_FACTOR: 1000,
    ANIMATION_RATE: 6.5,
    INIT_POSITION: { x: 350, y: 400 },
    pixels: { height: 256, width: 256 },
    orientation: { rows: 4, columns: 4 },
    down: { row: 0, start: 0, columns: 4 },
    right: { row: Math.min(2, 4 - 1), start: 0, columns: 4 },
    left: { row: Math.min(1, 4 - 1), start: 0, columns: 4 },
    up: { row: Math.min(3, 4 - 1), start: 0, columns: 4 },
    downRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
    downLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
    upRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
    upLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
    hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
    keypress: { up: 87, left: 65, down: 83, right: 68 }
};

    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: SwordNpc, data: sword_sprite_data },
      { class: Player, data: sprite_data_mc }
    ];
  }


}


export default MurderMysteryL5;

