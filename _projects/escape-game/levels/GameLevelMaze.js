// Third Level — The Maze of Shadows (outer level)
// Save as: assets/js/GameEnginev1.1/GameLevelMaze.js
// This is the RPG layer. Talking to the Gate Keeper launches GameLevelMazeSub.

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelMazeSub from '/assets/js/projects/escape-game/levels/GameLevelMazeSub.js';

class GameLevelMaze {
  constructor(gameEnv) {
    console.log("Initializing GameLevelMaze...");

    this.gameEnv = gameEnv;

    let width  = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Background ───────────────────────────────────────────────────────────
    const image_data_cave = {
      name: 'cave',
      greeting: "A dark entrance looms before you. The maze lies within.",
      src: "/images/projects/escape-game/dungeon.png",
      pixels: { height: 597, width: 340 }
    };

    // ── Player ────────────────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
      id: 'Octopus',
      greeting: "Something about this place feels wrong...",
      src: "/images/projects/escape-game/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: true,
      INIT_POSITION: { x: 0.05, y: 0.8 },
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

    // ── NPC: Gate Keeper — sole NPC, launches the maze sublevel ──────────────
    const sprite_greet_gate = "None who enter return the same. Are you ready?";
    const sprite_data_gate = {
      id: 'Gate Keeper',
      greeting: sprite_greet_gate,
      src: "/images/projects/escape-game/robot.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 100,
      pixels: { height: 316, width: 627 },
      INIT_POSITION: { x: 0.5, y: 0.5 },
      orientation: { rows: 3, columns: 6 },
      down: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "None who enter return the same.",
        "The maze remembers every step. Every mistake.",
        "Find the exit. That is all I will say.",
        "You are not the first. You may not be the last."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_gate);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();

        this.dialogueSystem.showDialogue(
          "The Gate Keeper steps aside. A dark corridor stretches beyond. The maze awaits.",
          "Gate Keeper",
          this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Enter the Maze",
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
                  primaryGame.pause();
                  try {
                    if (typeof primaryGame.hideCanvasState === 'function') {
                      primaryGame.hideCanvasState();
                    }
                  } catch(e) {
                    console.warn('Could not hide parent canvas state', e);
                  }

                  const gameInGame = new GameControl(gameEnv.game, [GameLevelMazeSub], {
                    parentControl: primaryGame
                  });
                  gameInGame.start();

                  gameInGame.gameOver = function() {
                    primaryGame.resume();
                  };

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

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_cave    },
      { class: Player,            data: sprite_data_octopus },
      { class: Npc,               data: sprite_data_gate    },
    ];
  }
}

export default GameLevelMaze;