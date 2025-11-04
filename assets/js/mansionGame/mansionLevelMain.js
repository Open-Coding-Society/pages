// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
// import GameControl from './GameEngine/GameControl.js';
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
    const image_src_mainworld = path + "/images/mansionGame/mansion_lobby.png"; // be sure to include the path
    const image_data_mainworld = {
        name: 'mainworld',
        greeting: "Welcome to the main lobby!",
        src: image_src_mainworld,
        pixels: {height: 550, width: 1038},
        mode: 'contain'
    };

    // Player data for MC
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

    const sprite_src_level1door = path + "/images/gamify/lineDoorCollisionSprite.png"; // replace with your door sprite if needed
      const sprite_greet_level1door = "Would you like to enter the first level? Press E";
      const sprite_data_level1door = {
        id: 'Level1Door',
        greeting: sprite_greet_level1door,
        src: sprite_src_level1door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.58), y: (height * 0.8) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: Math.PI / 3},
        hitbox: {widthPercentage: 0.1, heightPercentage: 0.1},
        dialogues: [
          "Level 1 awaits. Do you wish to enter?"
        ],
        reaction: function() {
          // no immediate reaction; interaction handled in interact()
        },
        interact: function() {
          // show a simple dialogue asking the player to enter the first level
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
            this.dialogueSystem.closeDialogue();
          }

          if (!this.dialogueSystem) {
            this.dialogueSystem = new DialogueSystem();
          }

          this.dialogueSystem.showDialogue(
            "Would you like to enter Level 1?",
            "Level 1",
            this.spriteData.src
          );

          this.dialogueSystem.addButtons([
            {
              text: "Enter",
              primary: true,
              action: () => {
                this.dialogueSystem.closeDialogue();

                // transition to new level — replace THIS_FILE_HERE with your level class
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;

                  // Store original classes so you can return later if desired
                  gameControl._originalLevelClasses = gameControl.levelClasses;

                  // TODO: Replace THIS_FILE_HERE with your pantry level import at top:
                  // import THIS_FILE_HERE from './path/to/yourPantryLevel.js'
                  // For now we set a placeholder so the developer will replace it.
                  gameControl.levelClasses = [GameLevel1];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
              }
            },
            {
              text: "Not Now",
              action: () => {
                this.dialogueSystem.closeDialogue();
              }
            }
          ]);
        }
      };
      
      // Level 3 door - duplicate of earlier doors
      const sprite_src_level3door = path + "/images/gamify/lineDoorCollisionSprite.png";
      const sprite_greet_level3door = "Would you like to enter the third level? Press E";
      const sprite_data_level3door = {
        id: 'Level3Door',
        greeting: sprite_greet_level3door,
        src: sprite_src_level3door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.61), y: (height * 0.41) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: -Math.PI / 3},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: [
          "Level 3 awaits. Do you wish to enter?"
        ],
        reaction: function() {},
        interact: function() {
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
          if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
          this.dialogueSystem.showDialogue("Would you like to enter Level 3?", "Level 3", this.spriteData.src);
          this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;
                  gameControl._originalLevelClasses = gameControl.levelClasses;
                  gameControl.levelClasses = [GameLevel3];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
          ]);
        }
      };

      // Level 4 door
      const sprite_src_level4door = path + "/images/gamify/lineDoorCollisionSprite.png";
      const sprite_greet_level4door = "Would you like to enter the fourth level? Press E";
      const sprite_data_level4door = {
        id: 'Level4Door',
        greeting: sprite_greet_level4door,
        src: sprite_src_level4door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.35), y: (height * 0.62) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: ["Level 4 awaits. Do you wish to enter?"],
        reaction: function() {},
        interact: function() {
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
          if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
          this.dialogueSystem.showDialogue("Would you like to enter Level 4?", "Level 4", this.spriteData.src);
          this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;
                  gameControl._originalLevelClasses = gameControl.levelClasses;
                  gameControl.levelClasses = [GameLevel4];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
          ]);
        }
      };

      // Level 5 door
      const sprite_src_level5door = path + "/images/gamify/lineDoorCollisionSprite.png";
      const sprite_greet_level5door = "Would you like to enter the fifth level? Press E";
      const sprite_data_level5door = {
        id: 'Level5Door',
        greeting: sprite_greet_level5door,
        src: sprite_src_level5door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,  
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.35), y: (height * 0.53) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: Math.PI / 3},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: ["Level 5 awaits. Do you wish to enter?"],
        reaction: function() {},
        interact: function() {
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
          if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
          this.dialogueSystem.showDialogue("Would you like to enter Level 5?", "Level 5", this.spriteData.src);
          this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;
                  gameControl._originalLevelClasses = gameControl.levelClasses;
                  gameControl.levelClasses = [GameLevel5];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
          ]);
        }
      };

      // Level 6 door
      const sprite_src_level6door = path + "/images/gamify/lineDoorCollisionSprite.png";
      const sprite_greet_level6door = "Would you like to enter the sixth level? Press E";
      const sprite_data_level6door = {
        id: 'Level6Door',
        greeting: sprite_greet_level6door,
        src: sprite_src_level6door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.46), y: (height * 0.42) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: Math.PI / 2},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: ["Level 6 awaits. Do you wish to enter?"],
        reaction: function() {},
        interact: function() {
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
          if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
          this.dialogueSystem.showDialogue("Would you like to enter Level 6?", "Level 6", this.spriteData.src);
          this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;
                  gameControl._originalLevelClasses = gameControl.levelClasses;
                  gameControl.levelClasses = [GameLevel6];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
          ]);
        }
      };

      // Level 2 door
      const sprite_src_level2door = path + "/images/gamify/lineDoorCollisionSprite.png";
      const sprite_greet_level2door = "Would you like to enter the second level? Press E";
      const sprite_data_level2door = {
        id: 'Level2Door',
        greeting: sprite_greet_level2door,
        src: sprite_src_level2door,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
        INIT_POSITION: { x: (width * 0.635), y: (height * 0.62) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: ["Level 2 awaits. Do you wish to enter?"],
        reaction: function() {},
        interact: function() {
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) this.dialogueSystem.closeDialogue();
          if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
          this.dialogueSystem.showDialogue("Would you like to enter Level 2?", "Level 2", this.spriteData.src);
          this.dialogueSystem.addButtons([
            { text: "Enter", primary: true, action: () => {
                this.dialogueSystem.closeDialogue();
                if (gameEnv && gameEnv.gameControl) {
                  const gameControl = gameEnv.gameControl;
                  gameControl._originalLevelClasses = gameControl.levelClasses;
                  gameControl.levelClasses = [GameLevel2];
                  gameControl.currentLevelIndex = 0;
                  gameControl.isPaused = false;
                  gameControl.transitionToLevel();
                }
            } },
            { text: "Not Now", action: () => { this.dialogueSystem.closeDialogue(); } }
          ]);
        }
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