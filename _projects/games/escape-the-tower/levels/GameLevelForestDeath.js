// Forest Death Sublevel
// Save as: assets/js/GameEnginev1.1/GameLevelForestDeath.js

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameLevelForestSub from '/assets/js/projects/escape-the-tower/levels/GameLevelForestSub.js';

// ── Chase Controller ──────────────────────────────────────────────────────────
class BeckonerChaseController {
  constructor(data, gameEnv) {
    this.gameEnv    = gameEnv;
    this.chaseState = data.chaseState;
    this.onCaught   = data.onCaught;
    this.startTime  = Date.now();

    if (gameEnv.gameObjects) gameEnv.gameObjects.push(this);
  }

  update() {
    const { chaseState } = this;
    if (chaseState.caught || chaseState.escaped) return;

    const elapsed = (Date.now() - this.startTime) / 1000;
    if (elapsed < 3) return;

    const player   = this.gameEnv.gameObjects?.find(o => o?.spriteData?.id === 'Octopus');
    const beckoner = this.gameEnv.gameObjects?.find(o => o?.spriteData?.id === 'Strange Beckoner');
    if (!player || !beckoner) return;

    if (beckoner.dialogueSystem?.isDialogueOpen?.()) return;

    const speed = Math.min(1.2 + (elapsed - 3) * 0.025, 2.5);

    const px = (player.position?.x   ?? 0) + (player.width    ?? 0) / 2;
    const py = (player.position?.y   ?? 0) + (player.height   ?? 0) / 2;
    const bx = (beckoner.position?.x ?? 0) + (beckoner.width  ?? 0) / 2;
    const by = (beckoner.position?.y ?? 0) + (beckoner.height ?? 0) / 2;

    const dx   = px - bx;
    const dy   = py - by;
    const dist = Math.hypot(dx, dy) || 1;

    beckoner.position.x += (dx / dist) * speed;
    beckoner.position.y += (dy / dist) * speed;

    if (Math.abs(dx) > Math.abs(dy)) {
      beckoner.direction = dx >= 0 ? 'right' : 'left';
    } else {
      beckoner.direction = dy >= 0 ? 'down' : 'up';
    }

    if (dist < 50 && !chaseState.caught) {
      chaseState.caught = true;
      this.onCaught(beckoner, player);
    }
  }

  draw()            {}
  collisionChecks() {}
  destroy() {
    const idx = this.gameEnv?.gameObjects?.indexOf?.(this) ?? -1;
    if (idx > -1) this.gameEnv.gameObjects.splice(idx, 1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

class GameLevelForestDeath {
  constructor(gameEnv) {
    console.log("Initializing GameLevelForestDeath...");

    this.gameEnv = gameEnv;

    let path = gameEnv.path;

    // ── Shared chase state ────────────────────────────────────────────────────
    const chaseState = {
      caught:     false,
      escaped:    false,
      tauntIndex: 0
    };

    // ── Player freeze / unfreeze helpers ──────────────────────────────────────
    // Saves the player's keypress map and replaces it with an empty object,
    // making WASD do nothing. Also zeroes velocity so they slide to a stop.
    function freezePlayer(player) {
      if (!player) return;
      player._savedKeypress    = player.spriteData?.keypress ?? {};
      player._savedVelocity    = { ...(player.velocity ?? {}) };
      if (player.spriteData)   player.spriteData.keypress = {};
      if (player.velocity)     { player.velocity.x = 0; player.velocity.y = 0; }
      // Belt-and-suspenders: also clear any keys the engine thinks are held down
      if (player.keys)         player.keys = {};
    }

    function unfreezePlayer(player) {
      if (!player) return;
      if (player.spriteData && player._savedKeypress !== undefined) {
        player.spriteData.keypress = player._savedKeypress;
      }
      // Don't restore old velocity — let the player start fresh
      player._savedKeypress = undefined;
    }

    // ── Transition back to fork ───────────────────────────────────────────────
    function returnToFork() {
      if (chaseState.escaped) return;
      chaseState.escaped = true;

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

    // ── Background ────────────────────────────────────────────────────────────
    const image_data_bg = {
      name: 'death_room',
      greeting: "The warmth you followed was never welcoming.",
      src: path + "/images/projects/escape-the-tower/cave.png",
      pixels: { height: 597, width: 340 }
    };

    // ── Player ────────────────────────────────────────────────────────────────
    const sprite_data_player = {
      id: 'Octopus',
      greeting: "What have I done...",
      src: path + "/images/projects/escape-the-tower/octopus.png",
      SCALE_FACTOR: 5,
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
      src: path + "/images/projects/escape-the-tower/chickenj.png",
      SCALE_FACTOR: 7,
      ANIMATION_RATE: 80,
      pixels: { height: 255, width: 150 },
      INIT_POSITION: { x: 0.5, y: 0.45 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_beckoner);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        const taunts = [
          "Oh, you came to ME? Bold. Baffling, but bold.",
          "Still here? I'd have thought the shame would have driven you off by now.",
          "BAWK BAWK. Classic. An absolute classic.",
          "The portal is on the right. Not that I'm helping you."
        ];
        this.dialogueSystem.showDialogue(
          taunts[chaseState.tauntIndex % taunts.length],
          "Strange Beckoner", this.spriteData.src
        );
        chaseState.tauntIndex++;
        this.dialogueSystem.addButtons([
          { text: "...", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── Chase controller data ─────────────────────────────────────────────────
    // onCaught now receives both beckoner and player so we can freeze/unfreeze.
    const chase_data = {
      chaseState,
      onCaught: (beckoner, player) => {
        // Freeze player immediately — no sneaking away while reading the taunt
        freezePlayer(player);

        const taunts = [
          "BAWK! Got you! I genuinely cannot believe you fell for that.",
          "Every. Single. Time. Every traveller. Every one.",
          "You really thought a chicken was going to give you good advice?",
          "The portal is on the right. Not that it saves your dignity.",
          "You can still escape. But I'll be right behind you. BAWK."
        ];
        const msg = taunts[chaseState.tauntIndex % taunts.length];
        chaseState.tauntIndex++;

        if (!beckoner.dialogueSystem) beckoner.dialogueSystem = new DialogueSystem();
        beckoner.dialogueSystem.showDialogue(msg, "Strange Beckoner", beckoner.spriteData.src);
        beckoner.dialogueSystem.addButtons([
          {
            text: "Run!",
            action: () => {
              beckoner.dialogueSystem.closeDialogue();
              // Unfreeze player only when they dismiss the dialogue
              unfreezePlayer(player);
              chaseState.caught = false;   // resume chase
            }
          }
        ]);
      }
    };

    // ── NPC: Another Victim ───────────────────────────────────────────────────
    const sprite_greet_victim = "Run. Don't stop to talk to me. Run.";
    const sprite_data_victim = {
      id: 'Another Victim',
      greeting: sprite_greet_victim,
      src: path + "/images/projects/escape-the-tower/stockguy.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: 0.25, y: 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "Run. Don't stop to talk to me. Run.",
        "The portal — right side of the room. That's how you get back.",
        "The chicken got me six months ago. Still can't leave.",
        "Don't let it catch you. It gets faster the longer you stay."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_victim);
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

    // ── NPC: Escape Portal ────────────────────────────────────────────────────
    const sprite_greet_portal = "This way. Quickly.";
    const sprite_data_portal = {
      id: 'Escape Portal',
      greeting: sprite_greet_portal,
      src: path + "/images/projects/escape-the-tower/octocat.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 60,
      pixels: { height: 301, width: 801 },
      INIT_POSITION: { x: 0.88, y: 0.55 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      reaction: function() {
        if (!chaseState.escaped) returnToFork();
      },
      interact: function() {
        if (chaseState.escaped) return;
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          returnToFork();
          return;
        }
        if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
        this.dialogueSystem.showDialogue(
          "A shimmering tear in the air pulses with cool light. The fork is on the other side.",
          "Escape Portal", this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Step through",
            primary: true,
            action: () => { this.dialogueSystem.closeDialogue(); returnToFork(); }
          },
          { text: "Wait", action: () => this.dialogueSystem.closeDialogue() }
        ]);
      }
    };

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground,       data: image_data_bg       },
      { class: Player,                  data: sprite_data_player   },
      { class: Npc,                     data: sprite_data_beckoner },
      { class: Npc,                     data: sprite_data_victim   },
      { class: Npc,                     data: sprite_data_portal   },
      { class: BeckonerChaseController, data: chase_data           },
    ];
  }
}

export default GameLevelForestDeath;