import Wolf from './wolf.js'; 
// FIXED: Added /pages/ to these imports so your local server can find them
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import { Coin } from '@assets/js/GameEnginev1.1/Coin.js';
import Leaderboard from '@assets/js/GameEnginev1.1/essentials/Leaderboard.js';

class GameLevelRedRidingHood1 {
  constructor(gameEnv, game) {
    this.gameEnv = gameEnv;
    this.gameControl = game;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Physics variables
    this.vy = 0;
    this.gravity = 0.5;
    this.isGrounded = false;

    this.leaderboard = new Leaderboard(this.gameControl, {
        gameName: 'RedRidingHood',
        initiallyHidden: false
    });

    this.continue = true;
    this.scoreSubmitted = false;
    this.startTime = Date.now(); 
    this.saveAttempted = false; 
    this.gameEnv.stats = { coinsCollected: 0 };

    this.titleElement = document.createElement('div');
    this.titleElement.style = "position:absolute; top:60px; width:100%; text-align:center; color:red; font-size:40px; font-weight:900; font-family:monospace; z-index:9999; text-shadow: 2px 2px black;";
    this.titleElement.innerHTML = "The Revelation of Little Red Riding Hood";
    document.body.appendChild(this.titleElement);

    this.scoreElement = document.createElement('div');
    this.scoreElement.style = "position:absolute; bottom:20px; left:20px; color:red; font-size:28px; font-weight:bold; font-family:monospace; z-index:9999; text-shadow: 1px 1px black;";
    this.scoreElement.innerHTML = "Cookies Collected: 0";
    document.body.appendChild(this.scoreElement);

    this.successElement = document.createElement('div');
    this.successElement.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.95); padding:50px; border:4px solid red; border-radius:15px; text-align:center; display:none; z-index:999999;";
    document.body.appendChild(this.successElement);

    const image_data_wood = { name: 'woods', src: gameEnv.path + "/images/projects/red-riding/woods.png", pixels: { height: 580, width: 1038 } };
   
    const sprite_data_red = {
      id: 'player', src: gameEnv.path + "/images/projects/red-riding/red.png",
      SCALE_FACTOR: 5, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / 5) },
      pixels: { height: 192, width: 144 }, orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 }, left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 }, up: { row: 3, start: 0, columns: 3 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_data_wolf = {
        name: 'wolf', id: 'The Big Bad Wolf',
        src: gameEnv.path + "/images/projects/red-riding/wolfff.png",
        SCALE_FACTOR: 5, 
        INIT_POSITION: { x: 0.05, y: 0.55 }, 
        pixels: { width: 632, height: 395 },
        // ADD THESE TWO LINES BELOW:
        greeting: "Where are you going with those unencrypted cookies, Little Red?",
        expertise: "the Big Bad Wolf who is also a Senior Security Engineer. Use wolf metaphors and computer science jargon."
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_wood },
      { class: Player, data: sprite_data_red },
      { class: Wolf, data: sprite_data_wolf }
    ];

    this.cookies = [];
    const cookiePositions = [{ x: 0.1, y: 0.8 }, { x: 0.3, y: 0.75 }, { x: 0.5, y: 0.8 }, { x: 0.7, y: 0.75 }, { x: 0.9, y: 0.8 }];
    cookiePositions.forEach((pos, index) => {
        const cookie = new Coin({ id: `cookie-${index}`, INIT_POSITION: pos, SCALE_FACTOR: 12, value: 1, zIndex: 10 }, this.gameEnv);
        this.cookies.push(cookie);
        this.gameEnv.gameObjects.push(cookie);
    });
  }
 
  update() {
    // Gravity and Physics Logic
    const player = this.gameEnv.gameObjects.find(obj => obj.id === 'player');
    if (player) {
        this.vy += this.gravity;
        player.position.y += this.vy;

        const floor = this.gameEnv.innerHeight - player.height;
        if (player.position.y >= floor) {
            player.position.y = floor;
            this.vy = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        if (player.pressedKeys?.[87] && this.isGrounded) {
            this.vy = -10;
            this.isGrounded = false;
        }
    }

    const currentScore = this.gameEnv.stats?.coinsCollected || 0;
    if (this.scoreElement) this.scoreElement.innerHTML = "Cookies Collected: " + currentScore;

    if (currentScore >= 5 && !this.scoreSubmitted) {
        this.scoreSubmitted = true; 
        const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(2);
        this.successElement.innerHTML = `
            <h1 style="color: red; font-size: 40px; margin-bottom: 10px;">VICTORY!</h1>
            <p style="color: white; font-size: 22px; margin-bottom: 20px;">Time: ${timeTaken}s</p>
            <div id="inputArea">
                <input type="text" id="playerName" placeholder="Enter Name" style="padding: 10px; width: 200px; text-align: center; border-radius: 5px;"><br><br>
            </div>
            <button id="finalBtn" style="padding: 15px 30px; font-size: 20px; cursor: pointer; background: red; color: white; border: none; font-weight: bold; border-radius: 8px;">SUBMIT SCORE</button>
        `;
        this.successElement.style.display = 'block';
        const finalBtn = this.successElement.querySelector('#finalBtn');
        finalBtn.addEventListener('click', () => {
            if (this.saveAttempted) {
                const engine = this.gameEnv.gameControl || this.gameEnv.game?.gameControl || this.gameControl;
                engine.currentLevelIndex = 1; engine.transitionToLevel();
                return; 
            }
            const name = document.getElementById('playerName').value.trim() || "Anonymous";
            finalBtn.disabled = true; finalBtn.innerHTML = "SAVING...";
            this.saveAttempted = true; 
            if (this.leaderboard) {
                this.leaderboard.submitScore(name, parseFloat(timeTaken), "RedRidingHood")
                    .then(() => {
                        this.successElement.querySelector('#inputArea').style.display = 'none';
                        finalBtn.disabled = false; finalBtn.style.background = "#28a745"; 
                        finalBtn.innerHTML = "GO TO LEVEL 2 →";
                    })
                    .catch(() => {
                        this.successElement.querySelector('#inputArea').style.display = 'none';
                        finalBtn.disabled = false; finalBtn.style.background = "#ffc107"; 
                        finalBtn.innerHTML = "CONTINUE →";
                    });
            }
        });
    }
  }

  draw() {}
  resize() {}

  destroy() {
    this.saveAttempted = false;
    if (this.titleElement?.parentNode) this.titleElement.remove();
    if (this.scoreElement?.parentNode) this.scoreElement.remove();
    if (this.successElement?.parentNode) this.successElement.remove();
    if (this.leaderboard?.destroy) this.leaderboard.destroy();
  }
}

export default GameLevelRedRidingHood1;