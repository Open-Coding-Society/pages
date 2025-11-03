import GameEnvBackground  from "./GameEngine/GameEnvBackground.js";
import MansionLevel1 from './mansionLevel1.js';
import Npc from './GameEngine/Npc.js';

/**
 * Cemetery Memory Game Level
 * 
 * Game Rules:
 * - Gravestones glow in a random sequence
 * - Player must click them in the same order
 * - Each round adds one more gravestone to the sequence
 * - Player has 3 lives (wrong answer = lose 1 life)
 * - After 3 mistakes, game resets
 */
class MansionLevel2_Cemetery {
  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;

    // === MEMORY GAME STATE ===
    this.memoryGame = {
      sequence: [],           // Correct order of gravestones to click
      playerInput: [],        // Player's clicks so far
      lives: 3,              // Remaining lives
      round: 1,              // Current round number
      maxRounds: 7,          // Maximum rounds to win the game
      isPlaying: false,      // Is game currently active?
      isPlayerTurn: false,   // Can player click gravestones now?
      gravestones: [],       // Array of gravestone NPCs
      startDelay: 2000       // Wait 2 seconds before starting first round
    };

    // === BACKGROUND SETUP ===
    const backgroundImage = path + "/images/mansionGame/CemeteryMainBackground.png";
    const backgroundData = {
        name: 'background',
        greeting: "This is the cemetery, explore the spooky graveyard.",
        src: backgroundImage,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };

    // === GRAVESTONE SETUP ===
    // Get paths to all 6 gravestone images
    const gravestoneImagePaths = [1, 2, 3, 4, 5, 6].map(num => 
      path + `/images/mansionGame/gravestone_${num}.png`
    );

    /**
     * Creates configuration data for a single gravestone sprite
     * @param {number} index - Gravestone number (1-6)
     * @param {string} imagePath - Path to gravestone image
     * @param {number} xPosition - Horizontal position on screen
     * @param {number} yPosition - Vertical position on screen
     * @param {number} zIndex - Layer depth (higher = in front)
     */
    const createGravestoneConfig = (index, imagePath, xPosition, yPosition, zIndex = 12) => ({
        id: `Gravestone_${index}`,
        greeting: "",
        src: imagePath,
        
        // Visual settings
        SCALE_FACTOR: 8,        // Divides screen height to get sprite size (larger number = smaller sprite)
        STEP_FACTOR: 0,         // No movement for static gravestones
        ANIMATION_RATE: 0,      // No animation frames
        pixels: { height: 513, width: 486 },  // Actual image dimensions
        
        // Sprite sheet info (single frame for static image)
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        
        // Position and collision
        INIT_POSITION: { x: Math.round(xPosition), y: Math.round(yPosition) },
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
        zIndex: zIndex,
        
        // Custom property for game logic
        gravestoneIndex: index,
        keypress: {},
        
        // Click handler - called when player presses 'E' near gravestone
        interact: function() {
          // Only allow clicks during player's turn
          if (this.parentLevel && this.parentLevel.memoryGame.isPlayerTurn) {
            this.parentLevel.handlePlayerClickOnGravestone(this.spriteData.gravestoneIndex);
          }
        }
    });

    // Position gravestones across the lower portion of the screen
    const gravestoneSprites = [];
    const totalGravestones = gravestoneImagePaths.length;
    
    for (let i = 0; i < totalGravestones; i++) {
      // Calculate position: spread evenly across screen with padding on sides
      const xPosition = width * (0.12 + (i / (totalGravestones - 1)) * 0.76);
      
      // Randomize vertical position slightly for natural look
      const yPosition = height * (0.62 + (Math.random() * 0.18));
      
      // Vary z-index slightly for depth
      const depth = 12 + (i % 3);
      
      const gravestoneConfig = createGravestoneConfig(
        i + 1,                        // Index (1-6)
        gravestoneImagePaths[i],      // Image path
        xPosition,                    // X position
        yPosition,                    // Y position
        depth                         // Z-index
      );
      
      gravestoneSprites.push({ class: Npc, data: gravestoneConfig });
    }

    // === REGISTER GAME OBJECTS ===
    // Game engine will create these objects in order: background first, then gravestones
    this.classes = [
        { class: GameEnvBackground, data: backgroundData },
        ...gravestoneSprites
    ];

    // Store game environment reference for later use
    this.gameEnv = gameEnv;
  }

  /**
   * Called by game engine after all objects are created
   * Sets up the memory game and starts the first round
   */
  initialize() {
    console.log("Cemetery Memory Game - Initializing...");
    
    // Find all gravestone objects that were created by the game engine
    this.memoryGame.gravestones = this.gameEnv.gameObjects.filter(
      obj => obj.spriteData && 
             obj.spriteData.id && 
             obj.spriteData.id.startsWith('Gravestone_')
    );

    // Give each gravestone a reference back to this level (needed for click handling)
    this.memoryGame.gravestones.forEach(gravestone => {
      gravestone.parentLevel = this;
      
      // Add direct mouse click handler to each gravestone's canvas
      if (gravestone.canvas) {
        gravestone.canvas.style.cursor = 'pointer';
        gravestone.canvas.addEventListener('click', () => {
          if (this.memoryGame.isPlayerTurn) {
            this.handlePlayerClickOnGravestone(gravestone.spriteData.gravestoneIndex);
          }
        });
      }
    });

    // Create the UI (lives, round, status message)
    this.createUserInterface();

    // Wait 2 seconds, then start the first round
    setTimeout(() => {
      this.beginNewRound();
    }, this.memoryGame.startDelay);
  }

  /**
   * Creates the UI overlay at the top of the screen
   * Shows: Lives (hearts), Round number, Status message
   */
  createUserInterface() {
    // Main container box
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'memoryGameUI';
    Object.assign(this.uiContainer.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1000',
      background: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent black
      color: 'white',
      padding: '15px 30px',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      textAlign: 'center',
      minWidth: '300px'
    });

    // Lives counter (shows hearts)
    this.livesDisplay = document.createElement('div');
    this.livesDisplay.innerHTML = `Lives: ${'❤️'.repeat(this.memoryGame.lives)}`;
    
    // Round number
    this.roundDisplay = document.createElement('div');
    this.roundDisplay.innerHTML = `Round: ${this.memoryGame.round}`;
    this.roundDisplay.style.marginTop = '5px';

    // Status message (e.g., "Watch the sequence...", "Your turn!")
    this.statusDisplay = document.createElement('div');
    this.statusDisplay.innerHTML = 'Watch the sequence...';
    this.statusDisplay.style.marginTop = '5px';
    this.statusDisplay.style.fontSize = '16px';
    this.statusDisplay.style.fontStyle = 'italic';

    // Add all displays to container
    this.uiContainer.appendChild(this.livesDisplay);
    this.uiContainer.appendChild(this.roundDisplay);
    this.uiContainer.appendChild(this.statusDisplay);
    
    // Add container to page
    document.body.appendChild(this.uiContainer);
  }

  /**
   * Updates the UI to reflect current game state
   */
  refreshUserInterface() {
    // Update lives display
    if (this.livesDisplay) {
      const hearts = '❤️'.repeat(this.memoryGame.lives);
      this.livesDisplay.innerHTML = `Lives: ${hearts || '💀'}`;
    }
    
    // Update round display
    if (this.roundDisplay) {
      this.roundDisplay.innerHTML = `Round: ${this.memoryGame.round}`;
    }
  }

  /**
   * Starts a new round of the memory game
   * Each round adds one more gravestone to the sequence
   */
  beginNewRound() {
    console.log(`Starting round ${this.memoryGame.round}`);
    
    // Reset round state
    this.memoryGame.isPlaying = true;
    this.memoryGame.isPlayerTurn = false;
    this.memoryGame.playerInput = [];

    // Add a new random gravestone to the sequence
    const randomGravestoneNumber = Math.floor(Math.random() * this.memoryGame.gravestones.length) + 1;
    this.memoryGame.sequence.push(randomGravestoneNumber);

    // Update UI
    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = 'Watch the sequence...';
    }

    // Show the sequence to the player
    this.showSequenceToPlayer();
  }

  /**
   * Plays back the current sequence by making gravestones glow in order
   */
  async showSequenceToPlayer() {
    const GLOW_TIME = 600;   // How long each gravestone glows (milliseconds)
    const PAUSE_TIME = 300;  // Pause between each glow (milliseconds)

    // Play each gravestone in the sequence
    for (let i = 0; i < this.memoryGame.sequence.length; i++) {
      const gravestoneNumber = this.memoryGame.sequence[i];
      
      await this.delayFor(PAUSE_TIME);              // Short pause
      await this.makeGravestoneGlow(gravestoneNumber, GLOW_TIME);  // Glow
    }

    // Sequence complete - now it's the player's turn!
    this.memoryGame.isPlayerTurn = true;
    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = 'Your turn! Click the gravestones in order.';
    }
  }

  /**
   * Makes a specific gravestone glow for a duration
   * @param {number} gravestoneNumber - Which gravestone to glow (1-6)
   * @param {number} durationMs - How long to glow in milliseconds
   */
  async makeGravestoneGlow(gravestoneNumber, durationMs) {
    // Find the gravestone with this number
    const gravestone = this.memoryGame.gravestones.find(
      gs => gs.spriteData.gravestoneIndex === gravestoneNumber
    );

    // If gravestone not found, do nothing
    if (!gravestone || !gravestone.canvas) return;

    // Save original appearance
    const originalFilter = gravestone.canvas.style.filter;
    
    // Apply glow effect (bright + yellow shadow)
    gravestone.canvas.style.filter = 'brightness(2) drop-shadow(0 0 20px yellow)';
    gravestone.canvas.style.transition = 'filter 0.2s';

    // Wait for the glow duration
    await this.delayFor(durationMs);

    // Remove glow, back to original
    gravestone.canvas.style.filter = originalFilter;
  }

  /**
   * Called when player clicks on a gravestone
   * Checks if it's the correct one in the sequence
   * @param {number} gravestoneNumber - Which gravestone was clicked (1-6)
   */
  handlePlayerClickOnGravestone(gravestoneNumber) {
    // Ignore clicks if it's not the player's turn
    if (!this.memoryGame.isPlayerTurn) return;

    console.log(`Player clicked gravestone ${gravestoneNumber}`);

    // Give visual feedback (brief glow)
    this.makeGravestoneGlow(gravestoneNumber, 300);

    // Add this click to the player's input
    this.memoryGame.playerInput.push(gravestoneNumber);

    // Check if this click was correct
    const clickNumber = this.memoryGame.playerInput.length - 1;
    const expectedGravestoneNumber = this.memoryGame.sequence[clickNumber];

    if (gravestoneNumber !== expectedGravestoneNumber) {
      // WRONG! Player clicked the wrong gravestone
      console.log('Wrong choice!');
      this.handleIncorrectClick();
    } 
    else if (this.memoryGame.playerInput.length === this.memoryGame.sequence.length) {
      // SUCCESS! Player completed the entire sequence correctly
      console.log('Correct sequence!');
      this.handleCompletedSequence();
    }
    // If correct but sequence not complete yet, do nothing (wait for next click)
  }

  /**
   * Handles when player clicks the wrong gravestone
   * Loses 1 life and either retries or ends game
   */
  handleIncorrectClick() {
    this.memoryGame.isPlayerTurn = false;
    this.memoryGame.lives--;
    this.refreshUserInterface();

    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = '❌ Wrong! Try again...';
    }

    if (this.memoryGame.lives <= 0) {
      // Out of lives - game over
      setTimeout(() => {
        this.endGameAndRestart();
      }, 1500);
    } else {
      // Still have lives - retry the same round
      setTimeout(() => {
        this.memoryGame.playerInput = [];
        this.showSequenceToPlayer();
      }, 1500);
    }
  }

  /**
   * Handles when player successfully completes the sequence
   * Advances to the next round or wins the game
   */
  handleCompletedSequence() {
    this.memoryGame.isPlayerTurn = false;

    // Check if player has completed all rounds
    if (this.memoryGame.round >= this.memoryGame.maxRounds) {
      // Player wins!
      if (this.statusDisplay) {
        this.statusDisplay.innerHTML = '🎉 YOU WIN! You beat the game!';
      }
      
      setTimeout(() => {
        this.endGameWithVictory();
      }, 3000);
      return;
    }

    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = '✅ Correct! Next round...';
    }

    // Advance to next round
    this.memoryGame.round++;
    this.refreshUserInterface();

    // Start next round after short delay
    setTimeout(() => {
      this.beginNewRound();
    }, 1500);
  }

  /**
   * Game over - resets everything and starts from round 1
   */
  endGameAndRestart() {
    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = '💀 Game Over! Restarting...';
    }

    setTimeout(() => {
      // Reset all game state
      this.memoryGame.lives = 3;
      this.memoryGame.round = 1;
      this.memoryGame.sequence = [];
      this.memoryGame.playerInput = [];
      
      // Update UI and start fresh
      this.refreshUserInterface();
      this.beginNewRound();
    }, 3000);
  }

  /**
   * Player has won the game by completing all rounds!
   * Shows victory message and offers to restart
   */
  endGameWithVictory() {
    if (this.statusDisplay) {
      this.statusDisplay.innerHTML = '🏆 VICTORY! You completed all 7 rounds!';
    }

    // Show the key earned popup
    this.showKeyEarnedPopup();

    setTimeout(() => {
      // Reset all game state to allow replay
      this.memoryGame.lives = 3;
      this.memoryGame.round = 1;
      this.memoryGame.sequence = [];
      this.memoryGame.playerInput = [];
      
      // Update UI and start fresh
      this.refreshUserInterface();
      this.beginNewRound();
    }, 5000);
  }

  /**
   * Displays a popup showing the player has earned a key
   */
  showKeyEarnedPopup() {
    // Create popup overlay
    const popup = document.createElement('div');
    popup.id = 'keyEarnedPopup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: '2000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'fadeIn 0.5s ease-in'
    });

    // Create key image
    const keyImage = document.createElement('img');
    const path = this.gameEnv.path || '';
    keyImage.src = path + '/images/mansionGame/key_lvl3.png';
    Object.assign(keyImage.style, {
      width: '300px',
      height: 'auto',
      marginBottom: '20px',
      animation: 'bounce 1s ease-in-out infinite',
      imageRendering: 'pixelated'  // Keep the pixel art style crisp
    });

    // Create congratulations text
    const congratsText = document.createElement('div');
    congratsText.innerHTML = '🎉 YOU EARNED A KEY! 🎉';
    Object.assign(congratsText.style, {
      color: 'gold',
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
      marginBottom: '10px'
    });

    // Create description text
    const descText = document.createElement('div');
    descText.innerHTML = 'You have successfully completed the Cemetery Memory Game!';
    Object.assign(descText.style, {
      color: 'white',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      maxWidth: '500px',
      padding: '0 20px'
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);

    // Assemble popup
    popup.appendChild(keyImage);
    popup.appendChild(congratsText);
    popup.appendChild(descText);
    document.body.appendChild(popup);

    // Auto-remove popup after 4 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
          if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
          }
        }, 500);
      }
    }, 4000);

    // Store reference for cleanup
    this.keyPopup = popup;
  }

  /**
   * Helper function to pause execution for a specified time
   * @param {number} milliseconds - How long to wait
   * @returns {Promise} A promise that resolves after the delay
   */
  delayFor(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Called when leaving this level
   * Cleans up the UI elements we created
   */
  destroy() {
    // Remove the UI overlay from the page
    if (this.uiContainer && this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }
    
    // Remove key popup if it exists
    if (this.keyPopup && this.keyPopup.parentNode) {
      this.keyPopup.parentNode.removeChild(this.keyPopup);
    }
    
    console.log("Cemetery Memory Game - Cleaned up and destroyed");
  }
}

export default MansionLevel2_Cemetery;