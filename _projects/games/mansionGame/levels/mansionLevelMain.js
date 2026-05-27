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
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import Character from '@assets/js/GameEnginev1.1/essentials/Character.js';

class ArrowIndicator extends Character {
  update() {
    this.draw();
  }
}

class MansionLevelMain {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_mainworld = path + "/images/projects/mansionGame/newMansionInterior.png"; // be sure to include the path
    const image_data_mainworld = {
      name: 'mainworld',
      greeting: "Welcome to the main world!",
      src: image_src_mainworld,
      pixels: { height: 1000, width: 1831 },
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
      hitbox: { widthPercentage: 0.65, heightPercentage: 0.1 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    const shared_barrier_data = {
      visible: false,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      fromOverlay: true
    }

    /*
    1113x906 image

    barrier data (x, y, width, height):
    152, 484 - 147x125
    149, 660 - 147x125
    0,0 - 60x906
    362, 164 - 119x155
    625, 166 - 126x137
    955, 170 - 126x138
    54, 602 - 30x168
    420, 455 - 61x161
    635, 465 - 61x161
    0, 828 - 1113x79
    1050, 0 - 66x906
    */

    const barrier_1 = {
      id: 'dbarrier_1', 
      x: 152 / 1113 * width, 
      y: 484 / 906 * height, 
      width: 147 / 1113 * width, 
      height: 125 / 906 * height, 
      ...shared_barrier_data
    };

    const barrier_2 = {
      id: 'dbarrier_2', 
      x: 149 / 1113 * width,
      y: 660 / 906 * height,
      width: 147 / 1113 * width,
      height: 125 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_3 = {
      id: 'dbarrier_3', 
      x: 0,
      y: 0,
      width: 60 / 1113 * width,
      height: height,
      ...shared_barrier_data
    };

    const barrier_4 = {
      id: 'dbarrier_4', 
      x: 362 / 1113 * width,
      y: 164 / 906 * height,
      width: 119 / 1113 * width,
      height: 155 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_5 = {
      id: 'dbarrier_5', 
      x: 625 / 1113 * width,
      y: 166 / 906 * height,
      width: 126 / 1113 * width,
      height: 137 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_6 = {
      id: 'dbarrier_6', 
      x: 955 / 1113 * width,
      y: 170 / 906 * height,
      width: 126 / 1113 * width,
      height: 138 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_7 = {
      id: 'dbarrier_7', 
      x: 54 / 1113 * width,
      y: 602 / 906 * height,
      width: 30 / 1113 * width,
      height: 168 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_8 = {
      id: 'dbarrier_8', 
      x: 420 / 1113 * width,
      y: 455 / 906 * height,
      width: 61 / 1113 * width,
      height: 161 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_9 = {
      id: 'dbarrier_9', 
      x: 635 / 1113 * width,
      y: 465 / 906 * height,
      width: 61 / 1113 * width,
      height: 161 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_10 = {
      id: 'dbarrier_10', 
      x: 0,
      y: 828 / 906 * height,
      width: width,
      height: 79 / 906 * height,
      ...shared_barrier_data
    };

    const barrier_11 = {
      id: 'dbarrier_11', 
      x: 1050 / 1113 * width,
      y: 0,
      width: 66 / 1113 * width,
      height: height,
      ...shared_barrier_data
    };

    const barrier_12 = {
      id: 'dbarrier_12', 
      x: 869 / 1113 * width,
      y: 489 / 906 * height,
      width: 109 / 1113 * width,
      height: 245 / 906 * height,
      ...shared_barrier_data
    };


    function getDoorData(levelNum, levelClass, x, y, localStorageLocked = false) {
      const sprite_src_level_door = path + "/images/projects/mansionGame/invisDoorCollisionSprite.png";
      const sprite_data_leveldoor = {
            id: `Level${levelNum}Door`,
            SCALE_FACTOR: 10,
            INIT_POSITION: { x: x, y: y },
            ANIMATION_RATE: 100,
            src: sprite_src_level_door,
            greeting: `Level ${levelNum} awaits. Do you wish to enter?`,
            pixels: { width: 70, height: 90 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1},
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
            dialogues: [
              `Level ${levelNum} awaits. Do you wish to enter?`,
              `This is the door to level ${levelNum}. Do you want to enter?`,
              `In front of you stands the door to level ${levelNum}. Do you choose to enter?`
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

              var isUnlocked;
              if (localStorageLocked) {
                const localStorageKey = `mansionGame_level${levelNum}_unlocked`;
                isUnlocked = localStorage.getItem(localStorageKey) === 'true';
              } else {
                isUnlocked = true;
              }

              if (!isUnlocked) {
                this.dialogueSystem.showDialogue(`Level ${levelNum} is locked. Please complete the previous levels to unlock it.`, 
                  `Level ${levelNum} Locked`, this.spriteData.src);
                this.dialogueSystem.addButtons([
                  { text: "OK", primary: true, action: () => { this.dialogueSystem.closeDialogue(); } }
                ]);
                return;
              }

              this.dialogueSystem.showDialogue(this.spriteData.dialogues[Math.floor(Math.random() * this.spriteData.dialogues.length)], 
                  `Level ${levelNum}`, this.spriteData.src);
              this.dialogueSystem.addButtons([
                {
                  text: "Enter", primary: true, action: () => {
                    this.dialogueSystem.closeDialogue();
                    if (gameEnv && gameEnv.gameControl) {
                      const gameControl = gameEnv.gameControl;
                      gameControl._originalLevelClasses = gameControl.levelClasses;
                      gameControl.levelClasses = [levelClass];
                      gameControl.currentLevelIndex = 0;
                      gameControl.isPaused = false;
                      gameControl.transitionToLevel();
                    }
                  }
                }
              ]);
            }
          };
      return sprite_data_leveldoor;
      }

    if (localStorage.getItem('mansionGame_level1_unlocked') === null) {
        // Key does not exist
        for (let i = 1; i <= 6; i++) {
          localStorage.setItem(`mansionGame_level${i}_unlocked`, 'false');
        }
    }

    const doorPositions = {
      1: { x: 74 / 1113 * width, y: 204 / 906 * height, locked: false },
      2: { x: 170 / 1113 * width, y: 204 / 906 * height, locked: true },
      3: { x: 270 / 1113 * width, y: 204 / 906 * height, locked: true },
      4: { x: 755 / 1113 * width, y: 204 / 906 * height, locked: true },
      5: { x: 875 / 1113 * width, y: 204 / 906 * height, locked: true },
      6: { x: 520 / 1113 * width, y: 204 / 906 * height, locked: true }
    };

    const isLevelUnlocked = (levelNum) => {
      const localStorageKey = `mansionGame_level${levelNum}_unlocked`;
      return localStorage.getItem(localStorageKey) === 'true';
    };

    let latestUnlockedLevel = 1;
    for (let i = 1; i <= 6; i++) {
      const door = doorPositions[i];
      if (!door.locked || isLevelUnlocked(i)) {
        latestUnlockedLevel = i;
      }
    }

    const arrowSize = 50;
    const arrowScaleFactor = Math.max(1, height / arrowSize);
    const doorSize = height / 10;
    const latestDoor = doorPositions[latestUnlockedLevel];
    const arrowData = {
      id: 'LatestUnlockedArrow',
      src: path + "/images/projects/mansionGame/redArrowDown.png",
      SCALE_FACTOR: arrowScaleFactor,
      ANIMATION_RATE: 100,
      INIT_POSITION: {
        x: latestDoor.x + doorSize / 2 - arrowSize / 2,
        y: latestDoor.y - arrowSize
      },
      pixels: { width: 1200, height: 1200 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      zIndex: 20
    };


    // List of objects definitions for this level (doors for levels 1..6)
    this.classes = [
      { class: GamEnvBackground, data: image_data_mainworld },
      { class: Player, data: sprite_data_mc },
      { class: Barrier, data: barrier_1 },
      { class: Barrier, data: barrier_2 },
      { class: Barrier, data: barrier_3 },
      { class: Barrier, data: barrier_4 },
      { class: Barrier, data: barrier_5 },
      { class: Barrier, data: barrier_6 },
      { class: Barrier, data: barrier_7 },
      { class: Barrier, data: barrier_8 },
      { class: Barrier, data: barrier_9 },
      { class: Barrier, data: barrier_10 },
      { class: Barrier, data: barrier_11 },
      { class: Barrier, data: barrier_12 },
      { class: Npc, data: getDoorData(1, GameLevel1, doorPositions[1].x, doorPositions[1].y, doorPositions[1].locked) },
      { class: Npc, data: getDoorData(2, GameLevel2, doorPositions[2].x, doorPositions[2].y, doorPositions[2].locked) },
      { class: Npc, data: getDoorData(3, GameLevel3, doorPositions[3].x, doorPositions[3].y, doorPositions[3].locked) },
      { class: Npc, data: getDoorData(4, GameLevel4, doorPositions[4].x, doorPositions[4].y, doorPositions[4].locked) },
      { class: Npc, data: getDoorData(5, GameLevel5, doorPositions[5].x, doorPositions[5].y, doorPositions[5].locked) },
      { class: Npc, data: getDoorData(6, GameLevel6, doorPositions[6].x, doorPositions[6].y, doorPositions[6].locked) },
      { class: ArrowIndicator, data: arrowData },
    ];
  }

}

export default MansionLevelMain;
