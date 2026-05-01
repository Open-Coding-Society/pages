// Third Level — The Maze of Shadows (sublevel)
// Save as: assets/js/GameEnginev1.1/GameLevelMazeSub.js
// Launched by the Gate Keeper NPC in GameLevelMaze.js via GameControl.

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelDoors from '/assets/js/projects/game-in-game-lesson/levels/GameLevelDoors.js';
import Coin from '/assets/js/GameEnginev1.1/Coin.js';
import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';

class GameLevelMazeSub {
  constructor(gameEnv) {
    console.log("Initializing GameLevelMazeSub...");

    this.gameEnv = gameEnv;

    let width  = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Background ────────────────────────────────────────────────────────────
    const image_data_cave = {
      name: 'maze',
      greeting: "The walls close in around you...",
      src: "/images/projects/game-in-game-lesson/dungeon.png",
      pixels: { height: 597, width: 340 }
    };

    // ── Player ────────────────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 9;
    const sprite_data_octopus = {
      id: 'Octopus',
      greeting: "I must find my way through...",
      src: "/images/projects/game-in-game-lesson/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: true,
      INIT_POSITION: { x: 0.05, y: 0.82 },
      pixels: { height: 250, width: 167 },
      orientation: { rows: 3, columns: 2 },
      down:      { row: 0, start: 0, columns: 2 },
      downLeft:  { row: 0, start: 0, columns: 2, mirror: true, rotate:  Math.PI / 16 },
      downRight: { row: 0, start: 0, columns: 2,               rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 2, mirror: true },
      right:     { row: 1, start: 0, columns: 2 },
      up:        { row: 0, start: 0, columns: 2 },
      upLeft:    { row: 1, start: 0, columns: 2, mirror: true, rotate: -Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 2,               rotate:  Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // ── Barrier helper ────────────────────────────────────────────────────────
    function b(id, rx, ry, rw, rh) {
      return {
        id,
        x:      Math.round(rx * width),
        y:      Math.round(ry * height),
        width:  Math.round(rw * width),
        height: Math.round(rh * height),
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        visible: true,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
        fromOverlay: true
      };
    }

    // ── Staircase platforms ───────────────────────────────────────────────────
    const floor = b('floor', 0.00, 0.90, 1.00, 0.10);
    const step1 = b('step1', 0.03, 0.72, 0.22, 0.03);
    const step2 = b('step2', 0.22, 0.55, 0.22, 0.03);
    const step3 = b('step3', 0.41, 0.40, 0.22, 0.03);
    const step4 = b('step4', 0.60, 0.25, 0.22, 0.03);
    const step5 = b('step5', 0.75, 0.12, 0.22, 0.03);

    // ── NPCs ──────────────────────────────────────────────────────────────────

    const sprite_greet_shadow = "Keep climbing. The exit is above you.";
    const sprite_data_shadow = {
      id: 'Whispering Shadow',
      greeting: sprite_greet_shadow,
      src: "/images/projects/game-in-game-lesson/tux.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 256, width: 352 },
      INIT_POSITION: { x: 0.26, y: 0.45 },
      orientation: { rows: 8, columns: 11 },
      down: { row: 5, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Keep climbing. The exit is above you.",
        "Each step brings you closer. Don't look down.",
        "I've been here a while. You're the first to make it this far.",
        "The top platform. That's where you need to go."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_shadow);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.showRandomDialogue();
      }
    };

    const sprite_greet_lantern = "Almost there. One more jump.";
    const sprite_data_lantern = {
      id: 'Lantern Keeper',
      greeting: sprite_greet_lantern,
      src: "/images/projects/game-in-game-lesson/octocat.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 301, width: 801 },
      INIT_POSITION: { x: 0.63, y: 0.15 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      dialogues: [
        "Almost there. One more jump.",
        "The warden is just above. Don't stop now.",
        "You've climbed further than most.",
        "I can see the exit from here. Keep going."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_lantern);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.showRandomDialogue();
      }
    };

    const sprite_greet_warden = "You made it through. The exit is right here.";
    const sprite_data_warden = {
      id: 'Exit Warden',
      greeting: sprite_greet_warden,
      src: "/images/projects/game-in-game-lesson/robot.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 100,
      pixels: { height: 316, width: 627 },
      INIT_POSITION: { x: 0.82, y: 0.03 },
      orientation: { rows: 3, columns: 6 },
      down: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "You made it. Not many do.",
        "The maze is behind you now. Step through.",
        "Quickly — something is still down there. Go."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_warden);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.dialogueSystem.showDialogue(
          "You climbed to the top. The gate ahead pulses with light. Are you ready to move on?",
          "Exit Warden",
          this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Step Through",
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();

              const primaryGame = gameEnv.gameControl;

              const fade = document.createElement('div');
              Object.assign(fade.style, {
                position: 'fixed',
                top: '0', left: '0',
                width: '100%', height: '100%',
                backgroundColor: '#000',
                opacity: '0',
                transition: 'opacity 0.8s ease-in-out',
                zIndex: '9999',
                pointerEvents: 'none'
              });
              document.body.appendChild(fade);

              requestAnimationFrame(() => {
                fade.style.opacity = '1';
                setTimeout(() => {
                  const gameContainer = document.getElementById('gameContainer');
                  if (gameContainer) {
                    Array.from(gameContainer.children).forEach(child => {
                      if (child.id !== 'promptDropDown') {
                        gameContainer.removeChild(child);
                      }
                    });
                  }

                  const topGame = primaryGame?.parentControl || primaryGame;
                  if (topGame) {
                    topGame.levelClasses = [GameLevelDoors];
                    topGame.currentLevelIndex = 0;
                    topGame.isPaused = false;
                    topGame.transitionToLevel();
                  }
                  setTimeout(() => {
                    fade.style.opacity = '0';
                    setTimeout(() => {
                      if (fade.parentNode) fade.parentNode.removeChild(fade);
                    }, 800);
                  }, 400);
                }, 800);
              });
            }
          },
          {
            text: "Not yet",
            action: () => this.dialogueSystem.closeDialogue()
          }
        ]);
      }
    };

    const sprite_data_coin = {
      id: 'coin',
      greeting: false,
      INIT_POSITION: { x: 0.3, y: 0.60 },
      width: 40,
      height: 70,
      color: '#FFD700',
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      zIndex: 12,
      value: 1
    };

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_cave },

      { class: Barrier, data: floor },
      { class: Barrier, data: step1 },
      { class: Barrier, data: step2 },
      { class: Barrier, data: step3 },
      { class: Barrier, data: step4 },
      { class: Barrier, data: step5 },

      { class: Coin, data: sprite_data_coin },

      { class: Npc,    data: sprite_data_shadow  },
      { class: Npc,    data: sprite_data_lantern },
      { class: Npc,    data: sprite_data_warden  },

      { class: Player, data: sprite_data_octopus },
    ];
  }
}

export default GameLevelMazeSub;