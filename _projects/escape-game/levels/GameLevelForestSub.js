// Forest Sublevel — The Fork
// Save as: assets/js/GameEnginev1.1/GameLevelForestSub.js

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelForestDeath from '/assets/js/projects/gamify/levels/GameLevelForestDeath.js';
import GameLevelForestWin from '/assets/js/projects/gamify/levels/GameLevelForestWin.js';

class GameLevelForestSub {
  constructor(gameEnv) {
    console.log("Initializing GameLevelForestSub...");

    this.gameEnv = gameEnv;

    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Shared transition helper ──────────────────────────────────────────────
    function launchSublevel(levelClass) {
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
              if (child.id !== 'promptDropDown') gameContainer.removeChild(child);
            });
          }

          primaryGame.pause();
          try {
            if (typeof primaryGame.hideCanvasState === 'function') primaryGame.hideCanvasState();
          } catch(e) { console.warn('Could not hide parent canvas state', e); }

          const gameInGame = new GameControl(gameEnv.game, [levelClass], { parentControl: primaryGame });
          gameInGame.start();
          gameInGame.gameOver = function() { primaryGame.resume(); };

          setTimeout(() => {
            fade.style.opacity = '0';
            setTimeout(() => { if (fade.parentNode) fade.parentNode.removeChild(fade); }, 800);
          }, 400);
        }, 800);
      });
    }

    // ── Background ────────────────────────────────────────────────────────────
    const image_data_bg = {
      name: 'fork',
      greeting: "Two paths stretch into the distance. The air is still. Which way?",
      src: "/projects/escape-game/images/desert.png",
      pixels: { height: 580, width: 1038 }
    };

    // ── Player (Octopus) ──────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Octopus',
      greeting: "Two roads. One chance.",
      src: "/projects/escape-game/images/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: false,
      INIT_POSITION: { x: 0.47, y: 0.75 },
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

    // ── NPC: The Guide ────────────────────────────────────────────────────────
    const sprite_greet_guide = "I have stood here longer than I can remember.";
    const sprite_data_guide = {
      id: 'The Guide',
      greeting: sprite_greet_guide,
      src: "/projects/escape-game/images/tux.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      pixels: { height: 256, width: 352 },
      INIT_POSITION: { x: 0.5, y: 0.45 },
      orientation: { rows: 8, columns: 11 },
      down: { row: 5, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "The sun rises in the east. It always has.",
        "One road is warm. One road is cold. Cold things preserve. Warm things consume.",
        "I watched the last traveller choose. I will not tell you what happened.",
        "The right path feels heavier. Worthy things usually do."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_guide);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.showRandomDialogue();
      }
    };

    // ── NPC: Lost Wanderer ────────────────────────────────────────────────────
    const sprite_greet_lost = "I came from the left. I don't know how I got back here.";
    const sprite_data_lost = {
      id: 'Lost Wanderer',
      greeting: sprite_greet_lost,
      src: "/projects/escape-game/images/stockguy.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: 0.33, y: 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "I came from the left. I don't know how I got back here.",
        "Don't trust anything that seems eager. Eagerness is a trap.",
        "The right path looked harder. That's why I didn't take it.",
        "I've been standing at this fork for what feels like years."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_lost);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.showRandomDialogue();
      }
    };

    // ── NPC: Strange Beckoner (left — death) ──────────────────────────────────
    const sprite_greet_left = "BAWK. This way. Definitely this way. Trust me.";
    const sprite_data_left = {
      id: 'Strange Beckoner',
      greeting: sprite_greet_left,
      src: "/projects/escape-game/images/chickenj.png",
      SCALE_FACTOR: 9,
      ANIMATION_RATE: 100,
      pixels: { height: 255, width: 150 },
      INIT_POSITION: { x: 0.18, y: 0.35 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Left! Always left! The best things are on the left!",
        "Don't listen to the others. Come this way.",
        "BAWK BAWK. Nothing bad down here. Nothing at all.",
        "The right path is a trap. Everyone who went right... well. Come left."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_left);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.dialogueSystem.showDialogue(
          "The Strange Beckoner flaps urgently toward the left path. The air there smells of smoke and something older. Do you follow?",
          "Strange Beckoner", this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          { text: "Go left",   action: () => { this.dialogueSystem.closeDialogue(); launchSublevel(GameLevelForestDeath); } },
          { text: "Step back", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── NPC: R2D2 (right — life) ──────────────────────────────────────────────
    const sprite_greet_right = "I have been waiting for someone to choose correctly.";
    const sprite_data_right = {
      id: 'R2D2',
      greeting: sprite_greet_right,
      src: "/projects/escape-game/images/r2_idle.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 100,
      pixels: { height: 223, width: 505 },
      INIT_POSITION: { x: 0.82, y: 0.35 },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Bweep. The right path. Always the right path.",
        "I have calculated the odds. They favour this direction.",
        "I cannot say more. But I am standing here for a reason.",
        "Beep boop. You are making the correct choice."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_right);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.dialogueSystem.showDialogue(
          "R2D2 beeps softly and gestures right. The path ahead is quiet — not ominous quiet, but the quiet of open space and cool air. Something about it feels like an answer. Do you follow?",
          "R2D2", this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          { text: "Go right",  primary: true, action: () => { this.dialogueSystem.closeDialogue(); launchSublevel(GameLevelForestWin); } },
          { text: "Step back", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_bg     },
      { class: Player,            data: sprite_data_player },
      { class: Npc,               data: sprite_data_guide  },
      { class: Npc,               data: sprite_data_lost   },
      { class: Npc,               data: sprite_data_left   },
      { class: Npc,               data: sprite_data_right  },
    ];
  }
}

export default GameLevelForestSub;