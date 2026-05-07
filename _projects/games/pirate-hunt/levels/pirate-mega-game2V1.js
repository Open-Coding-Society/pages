
import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Character from './essentials/Character.js';
import Npc from './essentials/Npc.js';
import AiNpc from './essentials/AiNpc.js';
import DialogueSystem from './essentials/DialogueSystem.js';

class PathBarrier {
    constructor(x, y, w, h, gameEnv) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.ctx = gameEnv.ctx;
    }

    draw(debug = false) {
        if (debug) {
            this.ctx.fillStyle = "rgba(0, 60, 255, 0.5)"; 
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Pirate extends Character {
  constructor(data, gameEnv) {
    super(data, gameEnv);
    this.velocity = { x: 0, y: 0 };
    this.speed = data.SPEED || 2;
    this.waypoints = null;
    this.waypointIndex = 0;
  }

  buildWaypoints() {
    const W = this.gameEnv.innerWidth;
    const H = this.gameEnv.innerHeight;
    return [
      { x: W * 0.10, y: H * 0.83 },
      { x: W * 0.16, y: H * 0.75 },
      { x: W * 0.21, y: H * 0.67 },
      { x: W * 0.27, y: H * 0.69 },
      { x: W * 0.33, y: H * 0.42 },
      { x: W * 0.36, y: H * 0.29 },
      { x: W * 0.45, y: H * 0.22 },
      { x: W * 0.51, y: H * 0.21 },
      { x: W * 0.57, y: H * 0.29 },
      { x: W * 0.59, y: H * 0.39 },
      { x: W * 0.56, y: H * 0.54 },
      { x: W * 0.59, y: H * 0.73 },
      { x: W * 0.62, y: H * 0.80 },
      { x: W * 0.69, y: H * 0.81 },
      { x: W * 0.73, y: H * 0.83 },
      { x: W * 0.77, y: H * 0.45 },
      { x: W * 0.81, y: H * 0.29 },
      { x: W * 0.84, y: H * 0.19 },
      { x: W * 0.93, y: H * 0.14 },
    ];
  }

  update() {
    if (!this.waypoints) {
      this.waypoints = this.buildWaypoints();
      this.position.x = this.waypoints[0].x;
      this.position.y = this.waypoints[0].y;
      this.waypointIndex = 1;
    }

    if (this.waypointIndex >= this.waypoints.length) {
      this.waypointIndex = 0;
      this.position.x = this.waypoints[0].x;
      this.position.y = this.waypoints[0].y;
      this.waypointIndex = 1;
    }

    const target = this.waypoints[this.waypointIndex];
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed + 1) {
      this.position.x = target.x;
      this.position.y = target.y;
      this.waypointIndex++;
    } else {
      this.velocity.x = (dx / dist) * this.speed;
      this.velocity.y = (dy / dist) * this.speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }

    this.draw();
  }
}

class GameLevelPirateMegaGame2 {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this.continue = true;
    this.debugMode = false;
    this.wonGame = false;

    this.titleElement = document.createElement('div');
    this.titleElement.style.position = 'absolute';
    this.titleElement.style.top = '60px';
    this.titleElement.style.width = '100%';
    this.titleElement.style.textAlign = 'center';
    this.titleElement.style.color = 'blue';
    this.titleElement.style.fontSize = '20px';
    this.titleElement.style.fontWeight = '900';
    this.titleElement.style.fontFamily = '"Fira Code", Courier, monospace';
    this.titleElement.style.textShadow = '2px 2px 4px black, 0 0 10px #0051ff';
    this.titleElement.style.zIndex = '9999';
    this.titleElement.innerHTML = "Quickly! before Blackbread catches you, find the Pot of Gold and outsmart him! But his invisible shields will try to stop you!";
    document.body.appendChild(this.titleElement);

    this.cottageZone = {
      x: width * 0.82,
      y: 0,
      width: width * 0.15,
      height: height * 0.25
    };

    this.winPopup = document.createElement('div');
    this.winPopup.style.display = 'none';
    this.winPopup.style.position = 'absolute';
    this.winPopup.style.top = '50%';
    this.winPopup.style.left = '50%';
    this.winPopup.style.transform = 'translate(-50%, -50%)';
    this.winPopup.style.background = 'linear-gradient(135deg, #0a0a2d, #1a326b)';
    this.winPopup.style.border = '4px solid #448fff';
    this.winPopup.style.borderRadius = '20px';
    this.winPopup.style.padding = '40px 50px';
    this.winPopup.style.textAlign = 'center';
    this.winPopup.style.zIndex = '99999';
    this.winPopup.style.boxShadow = '0 0 40px rgba(0, 98, 255, 0.6), 0 0 80px rgba(0, 89, 255, 0.3)';
    this.winPopup.style.maxWidth = '500px';
    this.winPopup.innerHTML = `
      <div style="font-size: 60px; margin-bottom: 10px;">☠️🦜</div>
      <div style="color: #3f9bf1; font-size: 32px; font-weight: 900; font-family: 'Courier New', monospace; text-shadow: 0 0 10px #ff0000; margin-bottom: 15px;">
        Bravo!.
      </div>
      <div style="color: #91cdf7; font-size: 17px; font-family: 'Courier New', monospace; line-height: 1.8; margin-bottom: 25px;">
        McArchie Escapes!<br>
        The Blackbread Fails.<br>
        <span style="color:#ff4444;">The tale of McArchie goes on!.</span>
      </div>
      <button id="winContinueBtn" style="
        background: #1273fc;
        color: white;
        border: none;
        padding: 12px 30px;
        font-size: 18px;
        font-weight: 900;
        font-family: 'Courier New', monospace;
        border-radius: 10px;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 0 15px rgba(2, 120, 254, 0.5);
      ">Close ✕</button>
    `;
    document.body.appendChild(this.winPopup);

    this.MAStartPosition = { x: 50, y: height * 0.75 };

    // A clear on-screen instruction to find and talk to the historian
    this.interactHint = document.createElement('div');
    this.interactHint.style.position = 'absolute';
    this.interactHint.style.bottom = '24px';
    this.interactHint.style.left = '50%';
    this.interactHint.style.transform = 'translateX(-50%)';
    this.interactHint.style.padding = '10px 16px';
    this.interactHint.style.background = 'rgba(0, 0, 0, 0.72)';
    this.interactHint.style.color = '#ffd';
    this.interactHint.style.fontFamily = 'Courier New, monospace';
    this.interactHint.style.fontSize = '14px';
    this.interactHint.style.border = '1px solid #4f82ff';
    this.interactHint.style.borderRadius = '6px';
    this.interactHint.style.zIndex = '99999';
    this.interactHint.style.display = 'none';
    this.interactHint.textContent = 'Get close to ProfessorHistory and press E to talk';
    document.body.appendChild(this.interactHint);

    this.barriers = [
      new PathBarrier(0, 0, width * 0.28, height * 0.70, gameEnv),
      new PathBarrier(width * 0.38, height * 0.27, width * 0.22, height * 0.37, gameEnv),
      new PathBarrier(width * 0.64, 0, width * 0.33, height * 0.22, gameEnv),
      new PathBarrier(width * 0.75, height * 0.55, width * 0.22, height * 0.37, gameEnv),
    ];

    const image_data_chase = {
      name: 'chase',
      src: path + "/images/gamebuilder/bg/PirateMap.jpg",
      pixels: { height: 580, width: 1038 }
    };

    const sprite_data_MA = {
      id: 'McArchie',
      src: path + "/images/gamebuilder/sprites/mcarchie.png",
  SCALE_FACTOR: 8,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 30,
      INIT_POSITION: { x: 150, y: 400 },
      pixels: { height: 256, width: 256 },
      orientation: { rows: 4, columns: 4 },

      down: { row: 0, start: 0, columns: 4 },
      downRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      downLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      right: { row: Math.min(2, 4 - 1), start: 0, columns: 4 },
      left: { row: Math.min(1, 4 - 1), start: 0, columns: 4 },
      up: { row: Math.min(3, 4 - 1), start: 0, columns: 4 },
      upRight: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      upLeft: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
   };

    const sprite_data_Pirate = {
      id: 'Pirate',
      src: path + "/images/gamebuilder/sprites/Pirate.png",
      SCALE_FACTOR: 1.0,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 8,
      INIT_POSITION: { x: width * 0.09, y: height * 0.82 },
      pixels: { height: 395, width: 632 },
      orientation: { rows: 1, columns: 1 },
      direction: 'right',
      SPEED: 1,
      zIndex: 20
    };

    const npcData1 = {
            id: 'Captain Blackbread',
            greeting: 'Hoy matey, my name is Captain Blackbeard. I am the most feared pirate on the seven seas. I have a treasure map that leads to a hidden island, but I need someone to help me find it. Are you up for the adventure?',
            src: path + "/images/gamebuilder/sprites/PotOfGold.png",
            SCALE_FACTOR: 5,
            ANIMATION_RATE: 1000000008,
            INIT_POSITION: { x: 1057, y: 100},
            // The key sprite is embedded in a larger 1024x1024 sheet with black padding.
            // Crop to the region containing the key so it renders without a black square.
            pixels: { width: 376, height: 699 },
            orientation: { rows: 1, columns: 1 },
            crop: { x: 324, y: 160, width: 376, height: 699 },
            transparentColor: { r: 0, g: 0, b: 0 },
            down: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.01 },
            dialogues: ['You found the Key! This key unlocks the gate to the hidden island. You can use it to escape Blackbread and win the game!'],
            reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
            interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
     
     };

       
  const sprite_src_historian = path + "/images/gamify/historyProf.png";
  const sprite_greet_historian = "Hello youngling, I am The Guardian of the Map!!";
  const sprite_data_historian = {
      id: "ProfessorHistory",
      greeting: sprite_greet_historian,
      src: sprite_src_historian,
      SCALE_FACTOR: 3,
      ANIMATION_RATE: 10,
      zIndex: 99999,
      visible: true,
      pixels: { height: 263, width: 559 },
      INIT_POSITION: { x: width * 0.04, y: height * 0.40 },
      orientation: { rows: 4, columns: 9 },
      
      // LOCK: use ONLY the 4th row (index 3) for every direction/state
      down:      { row: 3, start: 0, columns: 9 },
      up:        { row: 3, start: 0, columns: 9 },
      left:      { row: 3, start: 0, columns: 9 },
      right:     { row: 3, start: 0, columns: 9 },
      downLeft:  { row: 3, start: 0, columns: 9 },
      downRight: { row: 3, start: 0, columns: 9 },
      upLeft:    { row: 3, start: 0, columns: 9 },
      upRight:   { row: 3, start: 0, columns: 9 },
      
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.3 },
      
      // AI-specific properties (required for AiNpc utility)
      expertise: "history",              // Topic area for backend
      chatHistory: [],                   // Conversation memory
      dialogues: [                       // Random greetings
          "Another seeker approaches. I sense questions in your heart… and shadows at your back. Come forward.",
          "By oath and by steel, I guard these sacred routes. Speak your purpose, wanderer, and I shall judge its truth.",
          "I have watched kingdoms rise and crumble into dust. Tell me, traveler… what brings you to the crossroads of ages?",
          "You stand before the Map Eternal. Few are permitted to gaze upon its paths. Fewer still return unchanged.",
          "Paths converge, stars align, and shadows whisper your name. Welcome to the threshold of forgotten roads."
      ],
      knowledgeBase: {                   // Context hints for AI
          history: [
              {
                  question: "I seek shelter from the cruel Pirate Blackbread.",
                  answer: "Blackbread is a fearsome pirate who plagues these seas. Seek the hidden pot of gold my child, it shall bring you refuge. Godspeed on your quest, and may the winds of fortune fill your sails."
              },
              {
                  question: "What is the weakness of fearsome Blackbread?",
                  answer: "Blackbread's greed is his greatest weakness. He cannot resist the lure of treasure. He will go to great lengths to steal this map, Quickly child! Escape and save us all!"
              },
              {
                  question: "Can’t you stop him? You’re stronger than I am!",
                  answer: "Strength is not my burden. I am bound to guide, not to strike. The choice—and its cost—belongs to you alone."
              },
              {
                  question: "Can this map really help me defeat him?",
                  answer: "The map does not grant victory. It grants revelation. What you do with it… becomes your legend. Go on my child, claim your Tale!"
              }
          ]
      },
      
      // Orchestrator: Handle collision/proximity reactions
      reaction: function() {
          if (this.dialogueSystem) {
              this.showReactionDialogue();
          } else {
              console.log(sprite_greet_historian);
          }
      },
      
      // Orchestrator: Handle player interaction (E key press)
      interact: function() {
          // Delegate to AiNpc utility for full AI conversation interface
          AiNpc.showInteraction(this);
      }
  };


    this.classes = [
      { class: GameEnvBackground, data: image_data_chase },
      { class: Player, data: sprite_data_MA },
      { class: Pirate, data: sprite_data_Pirate },
      { class: Npc, data: npcData1 },
      { class: Npc, data: sprite_data_historian },

    ];
  }
  showWinPopup() {
    this.winPopup.style.display = 'block';
    const btn = document.getElementById('winContinueBtn');
    if (btn) {
      btn.onclick = () => {
        this.winPopup.style.display = 'none';
        // End level and transition to the next level (PirateBoss)
        if (this.gameEnv && this.gameEnv.gameControl && typeof this.gameEnv.gameControl.endLevel === 'function') {
          this.gameEnv.gameControl.endLevel();
        } else {
          this.continue = false;
        }
      };
    }
  }

  checkInZone(player, zone) {
    if (!player?.position) return false;
    return (
      player.position.x + player.width > zone.x &&
      player.position.x < zone.x + zone.width &&
      player.position.y + player.height > zone.y &&
      player.position.y < zone.y + zone.height
    );
  }

  checkCollision(rect1, rect2) {
    if (!rect1 || !rect1.position) return false;
    return (
      rect1.position.x < rect2.x + rect2.width &&
      rect1.position.x + (rect1.width / 2) > rect2.x &&
      rect1.position.y < rect2.y + rect2.height &&
      rect1.position.y + (rect1.height / 2) > rect2.y
    );
  }

  checkPlayerPirateCollision(player, pirate) {
    if (!player?.position || !pirate?.position) return false;
    return (
      player.position.x < pirate.position.x + pirate.width &&
      player.position.x + player.width > pirate.position.x &&
      player.position.y < pirate.position.y + pirate.height &&
      player.position.y + player.height > pirate.position.y
    );
  }

  update() {
    if (!this.gameEnv || !this.gameEnv.gameObjects) return;

    if (!this._professorHistoryLogged) {
      const historian = this.gameEnv.gameObjects.find(o => o?.spriteData?.id === 'ProfessorHistory');
      if (!historian) {
        console.warn('ProfessorHistory NPC object is missing from gameObjects.');
      } else {
        console.log('ProfessorHistory NPC object visible at', historian.position);
      }
      this._professorHistoryLogged = true;
    }

    let player = null;
    let pirate = null;
    let historian = null;

    this.gameEnv.gameObjects.forEach(obj => {
      if (obj instanceof Player) player = obj;
      if (obj instanceof Pirate) pirate = obj;
      if (obj?.spriteData?.id === 'ProfessorHistory') historian = obj;
    });

    if (this.interactHint && player && historian) {
      const dx = (player.position.x + player.width / 2) - (historian.position.x + historian.width / 2);
      const dy = (player.position.y + player.height / 2) - (historian.position.y + historian.height / 2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        this.interactHint.style.display = 'block';
      } else {
        this.interactHint.style.display = 'none';
      }
    } else if (this.interactHint) {
      this.interactHint.style.display = 'none';
    }

    if (player && !this.wonGame && this.checkInZone(player, this.cottageZone)) {
      this.wonGame = true;
      this.showWinPopup();
    }

    if (player && pirate && this.checkPlayerPirateCollision(player, pirate)) {
      player.position.x = this.MAStartPosition.x;
      player.position.y = this.MAStartPosition.y;
      player.velocity.x = 0;
      player.velocity.y = 0;
    }

    this.barriers.forEach(barrier => {
      this.gameEnv.gameObjects.forEach(obj => {
        if (obj instanceof Player && this.checkCollision(obj, barrier)) {
          obj.position.x -= obj.velocity.x;
          obj.position.y -= obj.velocity.y;
        }
      });
    });
  }

  draw() {
    this.barriers.forEach(barrier => barrier.draw(this.debugMode));
  }

  resize() {}

  destroy() {
    if (this.titleElement && this.titleElement.parentNode) this.titleElement.remove();
    if (this.winPopup && this.winPopup.parentNode) this.winPopup.remove();
    if (this.interactHint && this.interactHint.parentNode) this.interactHint.remove();
  }
}

export default GameLevelPirateMegaGame2;