import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';

class GameLevelWallstreet {
  /**
   * Properties and methods to define a game level
   * @param {*} gameEnv - The active game environment
   */
  constructor(gameEnv) {
    // Dependencies to support game level creation
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_city = path + "/images/gamify/city.png"; // be sure to include the path
    const image_data_city = {
        name: 'city',
        greeting: "Welcome to the city!  It is like paradise, bustling and vast so enjoy your stay!",
        src: image_src_city,
        pixels: {height: 966, width: 654}
    };
    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: height - (height / CHILLGUY_SCALE_FACTOR) },
        pixels: { height: 384, width: 512 },
        orientation: { rows: 3, columns: 4 },
        down: { row: 0, start: 0, columns: 3 },
        downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
        downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
        left: { row: 2, start: 0, columns: 3 },
        right: { row: 1, start: 0, columns: 3 },
        up: { row: 3, start: 0, columns: 3 },
        upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
        upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };
    
    const sprite_src_casino = path + "/images/gamify/casino.png"; // Path to the NPC sprite
    const sprite_greet_casino = "Teleport to the casino?";
    
    const sprite_data_casino = {
        id: 'Casino-NPC',
        greeting: sprite_greet_casino,
        src: sprite_src_casino,
        SCALE_FACTOR: 10, //scale factor for size
        ANIMATION_RATE: 50,
        pixels: {height: 1920, width: 1861},
        INIT_POSITION: { x: width * 0.55, y: height * 0.6 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_casino);
        },
        // Interact when player presses "E"
        interact: function() {
            const confirmTeleport = window.confirm("Teleport to the casino?");
            if (confirmTeleport) {
                window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/casinohomepage"; // Replace with your link
            }
        }
    };

    const sprite_src_stocks = path + "/images/gamify/stockguy.png"; // Path to the NPC sprite
    const sprite_greet_stocks = "Teleport to the stock market?";
    
    const sprite_data_stocks = {
        id: 'Stock-NPC',
        greeting: sprite_greet_stocks,
        src: sprite_src_stocks,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 50,
        pixels: {height: 441, width: 339},
        INIT_POSITION: { x: width * 0.75, y: height * 0.6 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_stocks);
        },
        // Interact when player presses "E"
        interact: function () {
            // Check if the modal already exists
            if (document.getElementById('stockModal')) {
                document.getElementById('stockModal').style.display = 'block';
                // Reset iframe to reload the stocks viewer
                const iframe = document.querySelector('#stockModal iframe');
                iframe.src = '';  // Clear the source
                iframe.src = 'https://nighthawkcoders.github.io/portfolio_2025/stocks/viewer'; // Set it again to force reload
                return;
            }
            
            // Create modal container
            const modal = document.createElement('div');
            modal.id = 'stockModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '2px solid #444';
            modal.style.padding = '0';
            modal.style.zIndex = '1000';
            modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            modal.style.borderRadius = '12px';
            modal.style.width = '90%';
            modal.style.maxWidth = '1000px';
            modal.style.height = '80vh';
            
            // Responsive iframe wrapper
            modal.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    <iframe 
                        src="http://127.0.0.1:4100/portfolio_2025/stocks/viewer"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px;"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                    <button id="closeStockModal" 
                        style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff5252; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        ✖
                    </button>
                </div>
            `;
            
            // Append modal to body
            document.body.appendChild(modal);
            
            // Close button functionality
            document.getElementById('closeStockModal').onclick = () => {
                modal.style.display = 'none';
            };
        }        
    };
    
    const sprite_src_cryptoMining = path + "/images/gamify/mining.png"; // Path to the NPC sprite
    const sprite_greet_cryptoMining = "Teleport to the cryptocurrency mining hub?";
    
    const sprite_data_cryptoMining = {
        id: 'CryptoMining-NPC',
        greeting: sprite_greet_cryptoMining,
        src: sprite_src_cryptoMining,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 50,
        pixels: {height: 600, width: 600},
        INIT_POSITION: { x: width / 3, y: height / 3 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_cryptoMining);
        },
        // Interact when player presses "E"
        interact: function () {
            // Check if the modal already exists
            if (document.getElementById('stockModal')) {
                document.getElementById('stockModal').style.display = 'block';
                // Reset iframe to reload the stocks viewer
                const iframe = document.querySelector('#stockModal iframe');
                iframe.src = '';  // Clear the source
                iframe.src = 'https://nighthawkcoders.github.io/portfolio_2025/crypto/mining'; // Set it again to force reload
                return;
            }
            
            // Create modal container
            const modal = document.createElement('div');
            modal.id = 'stockModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '2px solid #444';
            modal.style.padding = '0';
            modal.style.zIndex = '1000';
            modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            modal.style.borderRadius = '12px';
            modal.style.width = '90%';
            modal.style.maxWidth = '1000px';
            modal.style.height = '80vh';
            
            // Responsive iframe wrapper
            modal.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    <iframe 
                        src="https://nighthawkcoders.github.io/portfolio_2025/crypto/mining"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px;"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                    <button id="closeStockModal" 
                        style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff5252; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        ✖
                    </button>
                </div>
            `;
            
            // Append modal to body
            document.body.appendChild(modal);
            
            // Close button functionality
            document.getElementById('closeStockModal').onclick = () => {
                modal.style.display = 'none';
            };
        }      
    };

    const sprite_src_crypto = path + "/images/gamify/bitcoin.png"; // Path to the NPC sprite
    const sprite_greet_crypto = "Teleport to the crypto hub?";
    
    const sprite_data_crypto = {
        id: 'Crypto-NPC',
        greeting: sprite_greet_crypto,
        src: sprite_src_crypto,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 50,
        pixels: {height: 600, width: 600},
        INIT_POSITION: { x: width / 3, y: height / 3 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_crypto);
        },
        // Interact when player presses "E"
        interact: function () {
            // Check if the modal already exists
            if (document.getElementById('cryptoModal')) {
                document.getElementById('cryptoModal').style.display = 'block';
                // Reset iframe to reload the stocks viewer
                const iframe = document.querySelector('#cryptoModal iframe');
                iframe.src = '';  // Clear the source
                iframe.src = 'https://nighthawkcoders.github.io/portfolio_2025/crypto/portfolio'; // Set it again to force reload
                return;
            }
            
            // Create modal container
            const modal = document.createElement('div');
            modal.id = 'cryptoModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '2px solid #444';
            modal.style.padding = '0';
            modal.style.zIndex = '1000';
            modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            modal.style.borderRadius = '12px';
            modal.style.width = '90%';
            modal.style.maxWidth = '1000px';
            modal.style.height = '80vh';
            
            // Responsive iframe wrapper
            modal.innerHTML = `
                <div style="position: relative; width: 100%; height: 100%;">
                    <iframe 
                        src="https://nighthawkcoders.github.io/portfolio_2025/crypto/portfolio"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px;"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                    <button id="closeCryptoModal" 
                        style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff5252; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        ✖
                    </button>
                </div>
            `;
            
            // Append modal to body
            document.body.appendChild(modal);
            
            // Close button functionality
            document.getElementById('closeCryptoModal').onclick = () => {
                modal.style.display = 'none';
            };
        }      
    };

   
    // List of classes and supporting definitions to create the game level
    this.classes = [
      { class: GameEnvBackground, data: image_data_city },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_cryptoMining },
      { class: Npc, data: sprite_data_crypto }, 
      { class: Npc, data: sprite_data_stocks },
      { class: Npc, data: sprite_data_casino },
    ];
  }
}

export default GameLevelWallstreet;