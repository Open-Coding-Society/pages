import GameEnvBackground  from "./murdermysteryGameLogic/GameEnvBackground.js";
import Player from "./murdermysteryGameLogic/Player.js";
import Npc from "./murdermysteryGameLogic/Npc.js";
import DialogueSystem from "./murdermysteryGameLogic/DialogueSystem.js";


class MurderMysteryL5 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;



    // Background data
    const image_background = path + "/images/Room5assets/BaclgroundPrepLevel.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "This is the the study. Now that you've talked to all of the suspects, open the book and choose who you think the murderer is.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };


    // Book sprite that presents three options
    const book_sprite_data = {
        id: 'Book',
        greeting: "An ancient book...",
        src: path + "/images/Room5assets/Book.jpeg", // Update this path to your book image
        SCALE_FACTOR: 8,
        STEP_FACTOR: 0,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width / 2, y: height / 2 },
        pixels: { height: 256, width: 256 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
        keypress: {}
    };


    // Sword sprite that triggers the teleport
    const sword_sprite_data = {
        id: 'Sword',
        greeting: "A magical sword...",
        src: path + "/images/Room5assets/sword.webp", // Update this path to your sword image
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

  // Sword sprite that triggers the teleport
    const gunspritedata = {
        id: 'Hand Cannon',
        greeting: "A sturdy hand cannon...",
        src: path + "/images/Room5assets/pirate-removebg-preview.png", // Update this path to your sword image
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


    let bookAnswerSelected = false;


    // Class for the book interaction
    class BookNpc extends Npc {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
        this.spriteData = data;
      }


      showBookMessage() {
        const ds = new DialogueSystem({ id: 'book_choice_' + Math.random().toString(36).slice(2, 8) });
        ds.showDialogue('Who is the killer?', 'Notebook');
       
        ds.addButtons([
          { text: 'Bob', primary: false, action: () => {
            bookAnswerSelected = true;
            ds.closeDialogue();
          }},
          { text: 'Beidou', primary: false, action: () => {
            bookAnswerSelected = true;
            ds.closeDialogue();
          }},
          { text: 'Pirate Guy', primary: false, action: () => {
            bookAnswerSelected = true;
            ds.closeDialogue();
          }},
          { text: 'Pirate Dude', primary: false, action: () => {
            bookAnswerSelected = true;
            ds.closeDialogue();
          }},
          { text: 'Fargus', primary: false, action: () => {
            bookAnswerSelected = true;
            ds.closeDialogue();
          }} 
        ]);
      }
    }


    // Class for the sword that teleports you
    class SwordNpc extends Npc {
      constructor(data, gameEnvLocal) {
        super(data, gameEnvLocal);
        this.spriteData = data;
      }


      showSwordMessage() {
        if (!bookAnswerSelected) {
          const ds = new DialogueSystem({ id: 'sword_locked_' + Math.random().toString(36).slice(2, 8) });
          ds.showDialogue('The sword is locked. You must first read the book and choose a path.', 'Locked');
          return;
        }


        const ds = new DialogueSystem({ id: 'sword_teleport_' + Math.random().toString(36).slice(2, 8) });
        ds.showDialogue('Fight the murderer!', 'Teleporting');
        ds.addButtons([
          { text: 'Accept Fate', primary: true, action: () => {
            ds.closeDialogue();
          }}
        ]);
      }
    }


    // Wire book reaction
    book_sprite_data.reaction = function() {
      try {
        const inst = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'Book');
        if (inst && typeof inst.showBookMessage === 'function') {
          inst.showBookMessage();
        }
      } catch (e) { console.warn('book reaction failed', e); }
    };


    // Wire sword reaction
    sword_sprite_data.reaction = function() {
      try {
        const inst = gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'Sword');
        if (inst && typeof inst.showSwordMessage === 'function') {
          inst.showSwordMessage();
        }
      } catch (e) { console.warn('sword reaction failed', e); }
    };


    const sprite_src_mc = path + "/images/gamify/spookMcWalk.png"; // be sure to include the path
    const MC_SCALE_FACTOR = 6;
    const sprite_data_mc = {
        id: 'Spook',
        greeting: "Hi, I am Spook.",
        src: sprite_src_mc,
        SCALE_FACTOR: MC_SCALE_FACTOR,
        STEP_FACTOR: 800,
        ANIMATION_RATE: 10,
        INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR)},
        pixels: {height: 2400, width: 3600},
        orientation: {rows: 2, columns: 3},
        down: {row: 1, start: 0, columns: 3},
        downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
        downLeft: {row: 0, start: 0, columns: 3, rotate: -Math.PI/16},
        left: {row: 0, start: 0, columns: 3},
        right: {row: 1, start: 0, columns: 3},
        up: {row: 1, start: 0, columns: 3},
        upLeft: {row: 0, start: 0, columns: 3, rotate: Math.PI/16},
        upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
        hitbox: {widthPercentage: 0.45, heightPercentage: 0.2},
        keypress: {up: 87, left: 65, down: 83, right: 68} // W, A, S, D
    };


    // List of objects definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: BookNpc, data: book_sprite_data },
      { class: SwordNpc, data: sword_sprite_data },
      { class: Player, data: sprite_data_mc }
    ];
  }


}


export default MurderMysteryLevel5;

