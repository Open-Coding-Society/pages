// Import your game engine essentials (using your class paths)
import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import { Coin } from '@assets/js/GameEnginev1.1/Coin.js';
import Leaderboard from '@assets/js/GameEnginev1.1/essentials/Leaderboard.js';

class GameLevelMummy1 {
  constructor(gameEnv, game) {
    this.gameEnv = gameEnv;
    this.gameControl = game;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Initialize the Leaderboard under your team's game context
    this.leaderboard = new Leaderboard(this.gameControl, {
        gameName: 'MummyCrypt',
        initiallyHidden: false
    });

    this.continue = true;
    this.scoreSubmitted = false;
    this.startTime = Date.now(); 
    this.saveAttempted = false; 
    
    // Track the 3 golden scarabs collected
    this.gameEnv.stats = { coinsCollected: 0 };

    // UI Title Layout
    this.titleElement = document.createElement('div');
    this.titleElement.style = "position:absolute; top:60px; width:100%; text-align:center; color:#e0a96d; font-size:40px; font-weight:900; font-family:monospace; z-index:9999; text-shadow: 2px 2px black;";
    this.titleElement.innerHTML = "The Mummy's Crypt: Breaking the First Seal";
    document.body.appendChild(this.titleElement);

    // UI Tracker Layout
    this.scoreElement = document.createElement('div');
    this.scoreElement.style = "position:absolute; bottom:20px; left:20px; color:#e0a96d; font-size:28px; font-weight:bold; font-family:monospace; z-index:9999; text-shadow: 1px 1px black;";
    this.scoreElement.innerHTML = "Scarabs Restored: 0 / 3";
    document.body.appendChild(this.scoreElement);

    // End-level Success Overlay
    this.successElement = document.createElement('div');
    this.successElement.style = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(20,15,10,0.95); padding:50px; border:4px solid #e0a96d; border-radius:15px; text-align:center; display:none; z-index:999999;";
    document.body.appendChild(this.successElement);

    // Setup the custom background image generated for your level
    const image_data_tomb = { 
      name: 'tomb', 
      src: gameEnv.path + "/images/projects/mummy/mummy1.png", 
      pixels: { height: 580, width: 1038 } 
    };
   
    // Player configuration data (Mort or default explorer sprite)
    const sprite_data_player = {
      id: 'player', 
      src: gameEnv.path + "/images/projects/mummy/explorer.png", // Replace with your main player character path
      SCALE_FACTOR: 5, STEP_FACTOR: 1000, ANIMATION_RATE: 50,
      INIT_POSITION: { x: 50, y: height - 150 },
      pixels: { height: 192, width: 144 }, orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 }, left: { row: 1, start: 0, columns: 3 },
      right: { row: 2, start: 0, columns: 3 }, up: { row: 3, start: 0, columns: 3 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D setup
    };

    // Load initial asset classes into the scene
    this.classes = [
      { class: GameEnvBackground, data: image_data_tomb },
      { class: Player, data: sprite_data_player }
    ];

    // Generate exactly 3 collectable Scarab items placed across the tomb map
    this.scarabs = [];
    const scarabPositions = [{ x: 0.15, y: 0.5 }, { x: 0.45, y: 0.75 }, { x: 0.8, y: 0.45 }];
    
    scarabPositions.forEach((pos, index) => {
        const scarab = new Coin({ 
            id: `scarab-${index}`, 
            INIT_POSITION: pos, 
            SCALE_FACTOR: 10, 
            value: 1, 
            zIndex: 10 
        }, this.gameEnv);
        this.scarabs.push(scarab);
        this.gameEnv.gameObjects.push(scarab);
    });
  }
 
  update() {
    // Top-down Directional Engine Control Logic (No side-view gravity required)
    const player = this.gameEnv.gameObjects.find(obj => obj.id === 'player');
    if (player && player.pressedKeys) {
        const speed = 4;
        // W key - Move Up
        if (player.pressedKeys[87]) {
            player.position.y -= speed;
        }
        // S key - Move Down
        if (player.pressedKeys[83]) {
            player.position.y += speed;
        }
        // Screen boundary constraint safety buffers
        if (player.position.y < 100) player.position.y = 100;
        if (player.position.y > this.gameEnv.innerHeight - player.height) {
            player.position.y = this.gameEnv.innerHeight - player.height;
        }
    }

    // Refresh UI display parameters
    const currentScore = this.gameEnv.stats?.coinsCollected || 0;
    if (this.scoreElement) this.scoreElement.innerHTML = `Scarabs Restored: ${currentScore} / 3`;

    // Trigger completion sequence once all 3 item structures have been cleared
    if (currentScore >= 3 && !this.scoreSubmitted) {
        this.scoreSubmitted = true; 
        const timeTaken = ((Date.now() - this.startTime) / 1000).toFixed(2);
        
        this.successElement.innerHTML = `
            <h1 style="color: #e0a96d; font-size: 40px; margin-bottom: 10px;">SEAL BROKEN!</h1>
            <p style="color: white; font-size: 18px; margin-bottom: 10px;">The Sarcophagus opens...</p>
            <p style="color: #5cb85c; font-size: 22px; font-weight: bold; margin-bottom: 20px;">KEY 1 OBTAINED 🔑</p>
            <p style="color: #ccc; font-size: 16px; margin-bottom: 20px;">Time: ${timeTaken}s</p>
            <div id="inputArea">
                <input type="text" id="playerName" placeholder="Enter Explorer Name" style="padding: 10px; width: 200px; text-align: center; border-radius: 5px; border: 1px solid #e0a96d; background: #222; color: white;"><br><br>
            </div>
            <button id="finalBtn" style="padding: 15px 30px; font-size: 20px; cursor: pointer; background: #e0a96d; color: black; border: none; font-weight: bold; border-radius: 8px;">RECORD SCORE</button>
        `;
        this.successElement.style.display = 'block';
        
        const finalBtn = this.successElement.querySelector('#finalBtn');
        finalBtn.addEventListener('click', () => {
            // Level index handoff structure to transition directly to Team Caramel's Level 2
            if (this.saveAttempted) {
                const engine = this.gameEnv.gameControl || this.gameEnv.game?.gameControl || this.gameControl;
                engine.currentLevelIndex = 1; // Transitions to Index 1 (Level 2)
                engine.transitionToLevel();
                return; 
            }
            
            const name = document.getElementById('playerName').value.trim() || "Anonymous Explorer";
            finalBtn.disabled = true; finalBtn.innerHTML = "SEALING SCORE...";
            this.saveAttempted = true; 
            
            if (this.leaderboard) {
                this.leaderboard.submitScore(name, parseFloat(timeTaken), "MummyCrypt")
                    .then(() => {
                        this.successElement.querySelector('#inputArea').style.display = 'none';
                        finalBtn.disabled = false; 
                        finalBtn.style.background = "#28a745"; 
                        finalBtn.style.color = "white";
                        finalBtn.innerHTML = "ENTER GHOST CHAMBER (LVL 2) →";
                    })
                    .catch(() => {
                        this.successElement.querySelector('#inputArea').style.display = 'none';
                        finalBtn.disabled = false; 
                        finalBtn.style.background = "#ffc107"; 
                        finalBtn.innerHTML = "CONTINUE TO LEVEL 2 →";
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

export default GameLevelMummy1;