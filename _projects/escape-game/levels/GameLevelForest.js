// Final Level — The Whispering Forest
// Save as: assets/js/GameEnginev1.1/GameLevelForest.js

import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelForestSub from '/assets/js/projects/escape-game/levels/GameLevelForestSub.js';
import AiNpc from '/assets/js/GameEnginev1.1/essentials/AiNpc.js';

class GameLevelForest {
  constructor(gameEnv) {
    console.log("Initializing GameLevelForest...");

    this.gameEnv = gameEnv;

    let width  = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Background ───────────────────────────────────────────────────────────
    const image_data_forest = {
      name: 'forest',
      greeting: "You step into the Whispering Forest. Something watches from the dark...",
      src: "/images/projects/escape-game/forest.png",
      pixels: { height: 597, width: 340 }
    };

    // ── Player (Octopus) ─────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
      id: 'Octopus',
      greeting: "I can feel eyes on me...",
      src: "/images/projects/escape-game/octopus.png",
      SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      GRAVITY: false,
      INIT_POSITION: { x: 0.05, y: 0.85 },
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

    // ── NPC: The Wraith ───────────────────────────────────────────────────────
    const sprite_greet_wraith = "...it took my family. Both paths lead somewhere.";
    const sprite_data_wraith = {
      id: 'The Wraith',
      greeting: sprite_greet_wraith,
      src: "/images/projects/escape-game/tux.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 256, width: 352 },
      INIT_POSITION: { x: 0.25, y: 0.8 },
      orientation: { rows: 8, columns: 11 },
      down: { row: 5, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "...it took my family. Both paths lead somewhere. Not all somewheres are safe.",
        "The trees shift when the fog comes in. I stopped trusting my eyes.",
        "I wandered left. I ended up here. I cannot leave.",
        "Follow the light... if you can find any."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_wraith);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }
        if (this.dialogueSystem) {
          this.showRandomDialogue();
        }
      }
    };

    // ── NPC: Dark Figure ──────────────────────────────────────────────────────
    const sprite_greet_figure = "I can't remember which way I came from.";
    const sprite_data_figure = {
      id: 'Dark Figure',
      greeting: sprite_greet_figure,
      src: "/images/projects/escape-game/octocat.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 301, width: 801 },
      INIT_POSITION: { x: 0.7, y: 0.8 },
      orientation: { rows: 1, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      dialogues: [
        "I chose. I ended up here. I can't leave.",
        "The forest shifts at night. Nothing is what it was.",
        "There were scratches on the trees to my left. I thought they were markers.",
        "Whatever you do — don't stand still. The dark ones notice."
      ],
      reaction: function() {
        if (this.dialogueSystem) this.showReactionDialogue();
        else console.log(sprite_greet_figure);
      },
      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
          return;
        }
        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }
        if (this.dialogueSystem) {
          this.showRandomDialogue();
        }
      }
    };

    // ── NPC: The Warden — launches GameLevelForestSub via GameControl ─────────
    const sprite_greet_warden = "You must choose now. The fork is ahead. I cannot tell you which way.";
    const sprite_data_warden = {
      id: 'The Warden',
      greeting: sprite_greet_warden,
      src: "/images/projects/escape-game/robot.png",
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 100,
      pixels: { height: 316, width: 627 },
      INIT_POSITION: { x: 0.5, y: 0.8 },
      orientation: { rows: 3, columns: 6 },
      down: { row: 1, start: 0, columns: 6 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [
        "The fork is ahead. I cannot tell you which way.",
        "I was told not to say. You must choose.",
        "The forest remembers those who linger too long.",
        "Step forward. The path reveals itself only to those who walk it."
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
        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }
        this.dialogueSystem.showDialogue(
          "The Warden steps aside to reveal a fork in the path. Two directions vanish into the dark. One leads out. One does not. You must choose — and there is no coming back.",
          "The Warden",
          this.spriteData.src
        );
        this.dialogueSystem.addButtons([
          {
            text: "Face the Fork",
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

                  const levelArray  = [GameLevelForestSub];
                  const gameInGame  = new GameControl(gameEnv.game, levelArray, {
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
    const sprite_src_historian = "/images/projects/escape-game/historyProf.png";
    const sprite_greet_historian = "Hello! I'm an expert in the forest!";
    const sprite_data_historian = {
      id: "Mr. Forest",
      greeting: sprite_greet_historian,
      src: sprite_src_historian,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 10,
      pixels: { height: 263, width: 559 },
      INIT_POSITION: { x: width * 0.53, y: height * 0.28 },
      orientation: { rows: 4, columns: 9 },
      down:      { row: 3, start: 0, columns: 9 },
      up:        { row: 3, start: 0, columns: 9 },
      left:      { row: 3, start: 0, columns: 9 },
      right:     { row: 3, start: 0, columns: 9 },
      downLeft:  { row: 3, start: 0, columns: 9 },
      downRight: { row: 3, start: 0, columns: 9 },
      upLeft:    { row: 3, start: 0, columns: 9 },
      upRight:   { row: 3, start: 0, columns: 9 },
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
      expertise: "The forest",
      chatHistory: [],
      dialogues: [
        "Ask me anything about the forest!",
        "I have a depth of knowledge in the forest...",
        "Do you want to learn about the forest?",
        "Try out my chat session feature on the forest!",
        "Are you curious about the forest? Talk to me!"
      ],
      knowledgeBase: {
        history: [
          {
            question: "What is the forest?",
            answer: "The Whispering Forest is an ancient and disorienting place. The trees shift positions in the fog, and those who wander too long often lose their sense of direction entirely."
          },
          {
            question: "Who are the lost souls here?",
            answer: "The Wraith and the Dark Figure were once travelers like you. They chose wrong at the fork and became trapped — unable to leave, slowly forgetting where they came from."
          },
          {
            question: "What is the fork in the path?",
            answer: "Deep in the forest lies a fork with two paths. One leads out to safety. The other leads deeper into the dark, where no one returns. The Warden guards the entrance to it."
          },
          {
            question: "How do I get through the forest?",
            answer: "Speak to The Warden when you are ready to face the fork. Listen carefully to the lost souls before you go — their regrets are clues. The right path is the one that feels less inviting."
          }
        ]
      },
      reaction: function() {
        if (this.dialogueSystem) {
          this.showReactionDialogue();
        } else {
          console.log(sprite_greet_historian);
        }
      },
      interact: function() {
        AiNpc.showInteraction(this);
      }
    };

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
      { class: GameEnvBackground, data: image_data_forest },
      { class: Player,            data: sprite_data_octopus },
      { class: Npc,               data: sprite_data_wraith  },
      { class: Npc,               data: sprite_data_figure  },
      { class: Npc,               data: sprite_data_warden  },
      { class: Npc,               data: sprite_data_historian  },
    ];
  }
}

export default GameLevelForest;