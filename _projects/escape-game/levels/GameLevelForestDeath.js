// Forest Death Sublevel
// Save as: assets/js/GameEnginev1.1/GameLevelForestDeath.js

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelForestSub from '/assets/js/projects/escape-game/levels/GameLevelForestSub.js';

class GameLevelForestDeath {
  constructor(gameEnv) {
    console.log("Initializing GameLevelForestDeath...");

    this.gameEnv = gameEnv;

    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Background ────────────────────────────────────────────────────────────
    const image_data_bg = {
      name: 'death_room',
      greeting: "The warmth you followed was never welcoming.",
      src: "/images/projects/escape-game/cave.png",
      pixels: { height: 597, width: 340 }
    };

    // ── Player (Octopus) ──────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_player = {
      id: 'Octopus',
      greeting: "What have I done...",
      src: "/images/projects/escape-game/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: false,
      INIT_POSITION: { x: 0.1, y: 0.75 },
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

    // ── NPC: Strange Beckoner ─────────────────────────────────────────────────
    const sprite_greet_beckoner = "BAWK BAWK BAWK! You actually came! Ha!";
    const sprite_data_beckoner = {
      id: 'Strange Beckoner',
      greeting: sprite_greet_beckoner,
      src: "/images/projects/escape-game/chickenj.png",
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 80,
      pixels: { height: 255, width: 150 },
      INIT_POSITION: { x: 0.5, y: 0.45 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "I genuinely cannot believe you fell for that.",
        "BAWK! Do you know how many people I've sent down this path? All of them. Every single one.",
        "You really thought a chicken was going to give you good advice? Really?",
        "The look on your face right now. Priceless. Absolutely priceless.",
        "I told you to go left and you WENT left. Outstanding."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_beckoner);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();

        this._tauntIndex = (this._tauntIndex || 0);
        const taunts = [
          "Oh, you came back to talk to me? Interesting. That's really something.",
          "Still here? I'd have thought the shame would have driven you off by now.",
          "You know the right path is still there. I mean, you won't take it, but it's there.",
          "BAWK BAWK. Classic. An absolute classic.",
          "Fine, fine. You can leave if you want. The fork is back that way. Not that it'll help you."
        ];
        const msg = taunts[this._tauntIndex % taunts.length];
        this._tauntIndex++;

        this.dialogueSystem.showDialogue(msg, "Strange Beckoner", this.spriteData.src);
        this.dialogueSystem.addButtons([
          {
            text: "Go back to the fork",
            action: () => {
              this.dialogueSystem.closeDialogue();
              const primaryGame = gameEnv.gameControl;

              const fade = document.createElement('div');
              Object.assign(fade.style, {
                position: 'fixed', top: '0', left: '0',
                width: '100%', height: '100%',
                backgroundColor: '#000', opacity: '0',
                transition: 'opacity 0.6s ease-in-out',
                zIndex: '9999', pointerEvents: 'none'
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
                  if (primaryGame) {
                    primaryGame.levelClasses = [GameLevelForestSub];
                    primaryGame.currentLevelIndex = 0;
                    primaryGame.isPaused = false;
                    primaryGame.transitionToLevel();
                  }
                  setTimeout(() => {
                    fade.style.opacity = '0';
                    setTimeout(() => { if (fade.parentNode) fade.parentNode.removeChild(fade); }, 600);
                  }, 300);
                }, 600);
              });
            }
          },
          { text: "...", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── NPC: Another Victim ───────────────────────────────────────────────────
    const sprite_greet_victim = "Yeah. Me too.";
    const sprite_data_victim = {
      id: 'Another Victim',
      greeting: sprite_greet_victim,
      src: "/images/projects/escape-game/stockguy.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: 0.8, y: 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Yeah. Me too.",
        "The chicken got me six months ago. Still can't leave.",
        "I should have known. A chicken jockey. I should have known.",
        "At least you can still go back. I... couldn't figure out how.",
        "Don't let it gloat too long. It feeds on that."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_victim);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.showRandomDialogue();
      }
    };

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_bg       },
      { class: Player,            data: sprite_data_player   },
      { class: Npc,               data: sprite_data_beckoner },
      { class: Npc,               data: sprite_data_victim   },
    ];
  }
}

export default GameLevelForestDeath;