// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevel1 from './mansionLevel1.js';
import GameLevel2 from './mansionLevel2.js';
import GameLevel3 from './mansionLevel3.js';
import GameLevel4 from './mansionLevel4.js';
import GameLevel5 from './mansionLevel5.js';
import GameLevel6 from './mansionLevel6.js';

class MansionLevelMain {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_mainworld = path + "/images/projects/mansionGame/background.jpg"; // be sure to include the path
    const image_data_mainworld = {
      name: 'mainworld',
      greeting: "Welcome to the main world!",
      src: image_src_mainworld,
      pixels: { height: 1024, width: 559 },
      mode: 'contain'
    };

    // Player data for MC
    const sprite_src_mc = path + "/images/projects/mansionGame/spookMcWalk.png"; // be sure to include the path
    const MC_SCALE_FACTOR = 6;
    const sprite_data_mc = {
      id: 'Spook',
      greeting: "Hi, I am Spook.",
      src: sprite_src_mc,
      SCALE_FACTOR: MC_SCALE_FACTOR,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 10,
      INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR) },
      pixels: { height: 2400, width: 3600 },
      orientation: { rows: 2, columns: 3 },
      down: { row: 1, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 0, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 1, start: 0, columns: 3 },
      upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // Template object for door data
    const sprite_src_level_door = path + "/images/projects/mansionGame/lineDoorCollisionSprite.png";
    const sprite_data_leveldoor = {
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 100,
      src: sprite_src_level_door,
      greeting: "Would you like to enter through this door? Press E to enter.",
      pixels: { width: 256, height: 256 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, rotate: Math.PI / 3 },
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
      dialogues: [
        "I am a door. Press E to enter."
      ],
      reaction: function () { },
      interact: function () {
        // Show a simple dialogue asking whether the player wants to enter the level
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
        }

        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }

        this.dialogueSystem.showDialogue(this.spriteData.dialogues[0], "Level", this.spriteData.src);
        this.dialogueSystem.addButtons([
          {
            text: "Enter", primary: true, action: () => {
              this.dialogueSystem.closeDialogue();
              if (gameEnv && gameEnv.gameControl) {
                const gameControl = gameEnv.gameControl;
                gameControl._originalLevelClasses = gameControl.levelClasses;
                gameControl.levelClasses = [this.data.level];
                gameControl.currentLevelIndex = 0;
                gameControl.isPaused = false;
                gameControl.transitionToLevel();
              }
            }
          },
          { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
        ]);
      }
    };

    // Level 1 door
    const sprite_greet_level1door = "Would you like to enter the first level? Press E";
    const sprite_data_level1door = {
      ...sprite_data_leveldoor,  // copy the base door data
      id: 'Level1Door',
      greeting: sprite_greet_level1door,
      level: GameLevel1,
      INIT_POSITION: { x: (width * 0.58), y: (height * 0.8) },
      dialogues: [
        "Level 1 awaits. Do you wish to enter?"
      ]
    };

    // Level 2 door
    const sprite_greet_level2door = "Would you like to enter the second level? Press E";
    const sprite_data_level2door = {
      ...sprite_data_leveldoor,
      id: 'Level2Door',
      greeting: sprite_greet_level2door,
      level: GameLevel2,
      INIT_POSITION: { x: (width * 0.635), y: (height * 0.62) },
      dialogues: [
        "Level 2 awaits. Do you wish to enter?"
      ]
    };

    // Level 3 door
    const sprite_greet_level3door = "Would you like to enter the third level? Press E";
    const sprite_data_level3door = {
      ...sprite_data_leveldoor,
      id: 'Level3Door',
      greeting: sprite_greet_level3door,
      level: GameLevel3,
      INIT_POSITION: { x: (width * 0.61), y: (height * 0.41) },
      down: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 3 },
      dialogues: [
        "Level 3 awaits. Do you wish to enter?"
      ]
    };

    // Level 4 door
    const sprite_greet_level4door = "Would you like to enter the fourth level? Press E";
    const sprite_data_level4door = {
      ...sprite_data_leveldoor,
      id: 'Level4Door',
      greeting: sprite_greet_level4door,
      level: GameLevel4,
      INIT_POSITION: { x: (width * 0.35), y: (height * 0.62) },
      down: { row: 0, start: 0, columns: 1 },
      dialogues: [
        "Level 4 awaits. Do you wish to enter?"
      ]
    };

    // Level 5 door
    const sprite_greet_level5door = "Would you like to enter the fifth level? Press E";
    const sprite_data_level5door = {
      ...sprite_data_leveldoor,
      id: 'Level5Door',
      greeting: sprite_greet_level5door,
      level: GameLevel5,
      INIT_POSITION: { x: (width * 0.35), y: (height * 0.53) },
      down: { row: 0, start: 0, columns: 1, rotate: Math.PI / 3 },
      dialogues: [
        "Level 5 awaits. Do you wish to enter?"
      ]
    };

    // Level 6 door
    const sprite_greet_level6door = "Would you like to enter the sixth level? Press E";
    const sprite_data_level6door = {
      ...sprite_data_leveldoor,
      id: 'Level6Door',
      greeting: sprite_greet_level6door,
      level: GameLevel6,
      INIT_POSITION: { x: (width * 0.46), y: (height * 0.42) },
      down: { row: 0, start: 0, columns: 1, rotate: Math.PI / 2 },
      dialogues: [
        "Level 6 awaits. Do you wish to enter?"
      ]
    };


    // List of objects definitions for this level (doors for levels 1..6)
    this.classes = [
      { class: GamEnvBackground, data: image_data_mainworld },
      { class: Player, data: sprite_data_mc },
      { class: Npc, data: sprite_data_level1door },
      { class: Npc, data: sprite_data_level2door },
      { class: Npc, data: sprite_data_level3door },
      { class: Npc, data: sprite_data_level4door },
      { class: Npc, data: sprite_data_level5door },
      { class: Npc, data: sprite_data_level6door },
    ];
  }

}

export default MansionLevelMain;
