import GameEnvBackground  from "./GameEngine/GameEnvBackground.js";
import Player from "./GameEngine/Player.js";
import Npc from './GameEngine/Npc.js';
import DialogueSystem from "./GameEngine/DialogueSystem.js";
import MansionLevel1_Pantry from "./mansionLevel1_Pantry.js";


class MansionLevel1 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Level music: play shadow theme when entering this level
    // Will be stopped when transitioning to the pantry below
    // Ensure a single, persistent level music instance on the game controller
  if (gameEnv && gameEnv.gameControl) {
    const gc = gameEnv.gameControl;
    if (!gc.levelMusic) {
      gc.levelMusic = new Audio(path + "/assets/sounds/mansionGame/shadow_music_level1.mp3");
      gc.levelMusic.loop = false;
      gc.levelMusic.volume = 0.2;
      // Play and ignore promise rejection (browser may block autoplay until user gesture)
      gc.levelMusic.play().catch(err => console.warn('Level music play blocked or failed:', err));
    } else {
      // if previously created, ensure volume/loop are set
      gc.levelMusic.loop = false;
      gc.levelMusic.volume = gc.levelMusic.volume || 0.3;
      if (gc.levelMusic.paused) {
        gc.levelMusic.play().catch(err => console.warn('Resuming music failed:', err));
      }
    }
  }

    // Background data
    const image_background = path + "/images/mansionGame/kitchen_lvl1.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "This is the kitchen, you will search for ingredients and create a potion.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    //////////new code start
    // Update your objective_sprite_data to be more compatible with a Sprite/Npc class:
    const objective_sprite_data = {
        id: 'ObjectiveIcon',
        greeting: "Objective Icon: Find ingredients!",
        src: path + "/images/gamify/objective.png",
        
        // Npc/Sprite required properties
        SCALE_FACTOR: 2, 
        STEP_FACTOR: 0, 
        ANIMATION_RATE: 0, 
    
        // Positioning
        INIT_POSITION: { x: 300, y: 50 }, 
    
        // Image info
        pixels: {height: 606, width: 671}, 
        orientation: {rows: 1, columns: 1}, 
        down: {row: 0, start: 0, columns: 1}, // Required for Npc/Sprite animation initialization
        hitbox: {widthPercentage: 1.0, heightPercentage: 1.0}, // Basic hitbox

        // keypress (optional, but good to set if the Npc class expects it)
        keypress: {} 
    };

    ////////// new code end
    
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

      // Pantry door (collision object) placed on the left side of the screen.
      // Position: 1/4 from left, slightly below the middle vertically
      const sprite_src_pantrydoor = path + "/images/gamify/invisDoorCollisionSprite.png"; // replace with your door sprite if needed
      const sprite_greet_pantrydoor = "Would you like to enter the pantry? Press E";
      const sprite_data_pantrydoor = {
        id: 'PantryDoor',
        greeting: sprite_greet_pantrydoor,
        src: sprite_src_pantrydoor,
        SCALE_FACTOR: 6,
        ANIMATION_RATE: 100,
        pixels: {width: 256, height: 256},
  // Move the door slightly higher (approx. half an inch ~48px)
        INIT_POSITION: { x: (width * 1 / 4), y: (height / 2 + height * 0.1 - 48) },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.2, heightPercentage: 0.3},
        dialogues: [
          "The pantry awaits. Do you wish to enter?"
        ],
        reaction: function() {
          // no immediate reaction; interaction handled in interact()
        },
        interact: function() {
          // show a simple dialogue asking the player to enter the pantry
          if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
            this.dialogueSystem.closeDialogue();
          }

          if (!this.dialogueSystem) {
            this.dialogueSystem = new DialogueSystem();
          }

          this.dialogueSystem.showDialogue(
            "Would you like to enter the pantry?",
            "Pantry",
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
                  gameControl.levelClasses = [MansionLevel1_Pantry];
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

    // List of objects definitions for this level
    this.classes = [
      { class: GameEnvBackground, data: image_data_background },
      { class: Npc, data: objective_sprite_data },
      { class: Player, data: sprite_data_mc },
      { class: Npc, data: sprite_data_pantrydoor }
    ];

    // Show a simple kitchen intro using the game's DialogueSystem 5s after the MC spawns.
    // This polls for the player object (id 'Spook') then waits 5s and shows the dialog.
    (function showKitchenIntro() {
      const findSpook = () => (gameEnv && gameEnv.gameObjects) ? gameEnv.gameObjects.find(o => o && o.spriteData && o.spriteData.id === 'Spook') : null;

      const startWhenReady = () => {
        const player = findSpook();
        if (player) {
          setTimeout(() => {
            try {
              const ds = new DialogueSystem({ id: 'kitchen_intro_' + Date.now() });
              ds.showDialogue('Go to the pantry and collect the required ingredients to beat this level!', 'Spook', sprite_data_mc.src);
              ds.addButtons([{ text: 'Got it', primary: true, action: () => ds.closeDialogue() }]);
            } catch (e) { console.warn('kitchen intro dialog failed', e); }
          }, 1000);
        } else {
          // poll until player exists
          const poll = setInterval(() => {
            if (findSpook()) {
              clearInterval(poll);
              startWhenReady();
            }
          }, 200);
        }
      };

      startWhenReady();
    })();
  }
}

export default MansionLevel1;