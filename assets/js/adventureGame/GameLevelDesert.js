// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import Quiz from './Quiz.js';
import DialogueSystem from './DialogueSystem.js';
import GameControl from './GameEngine/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';
import GameLevelMeteorBlaster from './GameLevelMeteorBlaster.js';
import GameLevelMinesweeper from './GameLevelMinesweeper.js';
import GameLevelEnd from './GameLevelEnd.js';

class GameLevelDesert {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_desert = path + "/images/gamify/desert.png"; // be sure to include the path
    const image_data_desert = {
        name: 'desert',
        greeting: "Welcome to the desert!  It is hot and dry here, but there are many adventures to be had!",
        src: image_src_desert,
        pixels: {height: 580, width: 1038}
    };


    // Player data for Chillguy
    const sprite_src_chillguy = path + "/images/gamify/chillguy.png"; // be sure to include the path
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: height - (height/CHILLGUY_SCALE_FACTOR) }, 
        pixels: {height: 384, width: 512},
        orientation: {rows: 3, columns: 4 },
        down: {row: 0, start: 0, columns: 3 },
        downRight: {row: 1, start: 0, columns: 3, rotate: Math.PI/16 },
        downLeft: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16 },
        left: {row: 2, start: 0, columns: 3 },
        right: {row: 1, start: 0, columns: 3 },
        up: {row: 3, start: 0, columns: 3 },
        upLeft: {row: 2, start: 0, columns: 3, rotate: Math.PI/16 },
        upRight: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    


    // NPC data for Tux 
    const sprite_src_tux = path + "/images/gamify/tux.png";
    const sprite_greet_tux = "Hi I am Tux, the Linux mascot. I am very happy to spend some linux shell time with you!";
    const sprite_data_tux = {
        id: 'Tux',
        greeting: sprite_greet_tux,
        src: sprite_src_tux,
        SCALE_FACTOR: 8,
        ANIMATION_RATE: 50,
        pixels: {height: 256, width: 352},
        INIT_POSITION: { x: (width / 2), y: (height / 2)},
        orientation: {rows: 8, columns: 11 },
        down: {row: 5, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        dialogues: [
            "The terminal is a powerful tool. It's like having superpowers!",
            "Did you know Linux powers most web servers and supercomputers?",
            "ls, cd, mkdir, rm - these commands will become your best friends.",
            "I love open source software! Freedom to study, modify, and share.",
            "Have you tried using pipes to connect commands? It's magical!",
            "Vim or Emacs? That's the eternal question among Linux users.",
            "The penguin mascot represents the cold conditions of Finland where Linux was developed.",
            "Linux was created by Linus Torvalds in 1991 while he was a student."
        ],
        reaction: function() {
            // Use dialogue system instead of alert
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(sprite_greet_tux);
            }
        },
        interact: function() {
            // Show random dialogue message
            if (this.dialogueSystem) {
                this.showRandomDialogue();
            }
        }
    };



      const sprite_src_octocat = path + "/images/gamify/octocat.png";
      const sprite_greet_octocat = "Hi I am Octocat! I am the GitHub code code code collaboration mascot";
      const sprite_data_octocat = {
          id: 'Octocat',
          greeting: sprite_greet_octocat,
          src: sprite_src_octocat,
          SCALE_FACTOR: 10,
          ANIMATION_RATE: 50,
          pixels: {height: 301, width: 801},
          INIT_POSITION: { x: (width / 4), y: (height / 4)},
          orientation: {rows: 1, columns: 4 },
          down: {row: 0, start: 0, columns: 3 },
          hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
          // Add dialogues array for random messages
          dialogues: [
              "GitHub helps millions of developers collaborate on code.",
              "Pull requests are how we suggest changes to repositories.",
              "Repositories are like folders that store your project files.",
              "GitHub uses Git, a version control system created by Linus Torvalds.",
              "Branches let you work on features without affecting the main codebase.",
              "I'm not just a cat! I'm part octopus too - perfect for multitasking.",
              "GitHub Actions helps automate your workflows.",
              "Collaboration is at the heart of open source development."
          ],
          reaction: function() {
              // Use dialogue system instead of alert
              if (this.dialogueSystem) {
                  this.showReactionDialogue();
              } else {
                  console.log(sprite_greet_octocat);
              }
          },
          interact: function() {
              // Show random dialogue message
              if (this.dialogueSystem) {
                  this.showRandomDialogue();
              }
          }
      };
    
      const sprite_src_endportal = path + "/images/gamify/exitportalfull.png";
      const sprite_greet_endportal = "Teleport to the End? Press E";
      const sprite_data_endportal = {
          id: 'End Portal',
          greeting: sprite_greet_endportal,
          src: sprite_src_endportal,
          SCALE_FACTOR: 6,
          ANIMATION_RATE: 100,
          pixels: {width: 2029, height: 2025},
          INIT_POSITION: { x: (width * 2 / 5), y: (height * 1 / 10)},
          orientation: {rows: 1, columns: 1 },
          down: {row: 0, start: 0, columns: 1 },
          hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
          // Add dialogues array for random messages
          dialogues: [
              "The End dimension awaits brave explorers.",
              "Through this portal lies a realm of floating islands and strange creatures.",
              "The Enderman guards ancient treasures. Who knows what else lurks beyond this portal?",
              "Many have entered. Few have returned.",
              "The void calls to you. Will you answer?",
              "The End is not truly the end, but a new beginning.",
              "Strange things await you beyond this portal..",
              "Prepare yourself. The journey beyond won't be easy."
          ],
          reaction: function() {
              // Don't show any reaction dialogue - this prevents the first alert
              // The interact function will handle all dialogue instead
          },
          interact: function() {
              // Clear any existing dialogue first to prevent duplicates
              if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                  this.dialogueSystem.closeDialogue();
              }
              
              // Create a new dialogue system if needed
              if (!this.dialogueSystem) {
                  this.dialogueSystem = new DialogueSystem();
              }
              
              // Show portal dialogue with buttons
              this.dialogueSystem.showDialogue(
                  "Do you wish to enter The End dimension?",
                  "End Portal",
                  this.spriteData.src
              );
              
              // Add buttons directly to the dialogue
              this.dialogueSystem.addButtons([
                  {
                      text: "Enter Portal",
                      primary: true,
                      action: () => {
                          this.dialogueSystem.closeDialogue();
                          
                          // Clean up the current game state
                          if (gameEnv && gameEnv.gameControl) {
                              // Store reference to the current game control
                              const gameControl = gameEnv.gameControl;
                              
                              // Create fade overlay for transition
                              const fadeOverlay = document.createElement('div');
                              Object.assign(fadeOverlay.style, {
                                  position: 'fixed',
                                  top: '0',
                                  left: '0',
                                  width: '100%',
                                  height: '100%',
                                  backgroundColor: '#000',
                                  opacity: '0',
                                  transition: 'opacity 1s ease-in-out',
                                  zIndex: '9999'
                              });
                              document.body.appendChild(fadeOverlay);
                              
                              console.log("Starting End level transition...");
                              
                              // Fade in
                              requestAnimationFrame(() => {
                                  fadeOverlay.style.opacity = '1';
                                  
                                  // After fade in, transition to End level
                                  setTimeout(() => {
                                      // Clean up current level properly
                                      if (gameControl.currentLevel) {
                                          // Properly destroy the current level
                                          console.log("Destroying current level...");
                                          gameControl.currentLevel.destroy();
                                          
                                          // Force cleanup of any remaining canvases
                                          const gameContainer = document.getElementById('gameContainer');
                                          const oldCanvases = gameContainer.querySelectorAll('canvas:not(#gameCanvas)');
                                          oldCanvases.forEach(canvas => {
                                              console.log("Removing old canvas:", canvas.id);
                                              canvas.parentNode.removeChild(canvas);
                                          });
                                      }
                                      
                                      console.log("Setting up End level...");
                                      
                                      // IMPORTANT: Store the original level classes for return journey
                                      gameControl._originalLevelClasses = gameControl.levelClasses;
                                      
                                      // Change the level classes to GameLevelEnd
                                      gameControl.levelClasses = [GameLevelEnd];
                                      gameControl.currentLevelIndex = 0;
                                      
                                      // Make sure game is not paused
                                      gameControl.isPaused = false;
                                      
                                      // Start the End level with the same control
                                      console.log("Transitioning to End level...");
                                      gameControl.transitionToLevel();
                                      
                                      // Fade out overlay
                                      setTimeout(() => {
                                          fadeOverlay.style.opacity = '0';
                                          setTimeout(() => {
                                              document.body.removeChild(fadeOverlay);
                                          }, 1000);
                                      }, 500);
                                  }, 1000);
                              });
                          }
                      }
                  },
                  {
                      text: "Not Ready",
                      action: () => {
                          this.dialogueSystem.closeDialogue();
                      }
                  }
              ]);
          }
      }
          
      const sprite_src_stocks = path + "/images/gamify/stockguy.png";
      const sprite_greet_stocks = "Darn it, I lost some money on the stock market.. come with me to help me out?";
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
          // Add dialogues array for random messages
          dialogues: [
              "The stock market is full of opportunities and risks.",
              "Buy low, sell high! That's the golden rule of investing.",
              "I've been tracking this tech stock that looks promising.",
              "Diversification is key to a balanced portfolio.",
              "The bulls and bears are always fighting in the market.",
              "Have you checked your retirement account lately?",
              "I need to update my trading strategy. The market's volatile today.",
              "Long-term investing beats day trading for most people."
          ],
          reaction: function() {
              // Use dialogue system instead of alert
              if (this.dialogueSystem) {
                  this.showReactionDialogue();
              } else {
                  console.log(sprite_greet_stocks);
              }
          },
          interact: function() {
              // Clear any existing dialogue first
              if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                  this.dialogueSystem.closeDialogue();
              }
              
              // Show a dialogue with buttons immediately
              if (this.dialogueSystem) {
                  // Get a random dialogue message if available
                  let message = "I need help analyzing some stocks. Want to check out the market with me?";
                  if (this.spriteData.dialogues && this.spriteData.dialogues.length > 0) {
                      const randomIndex = Math.floor(Math.random() * this.spriteData.dialogues.length);
                      message = this.spriteData.dialogues[randomIndex];
                  }
                  
                  this.dialogueSystem.showDialogue(
                      message,
                      "Stock Trader",
                      this.spriteData.src
                  );
                  
                  // Create the buttons container
                  const buttonContainer = document.createElement('div');
                  buttonContainer.style.display = 'flex';
                  buttonContainer.style.justifyContent = 'space-between';
                  buttonContainer.style.marginTop = '10px';
                  
                  // Create the Yes button
                  const yesButton = document.createElement('button');
                  yesButton.textContent = "Stocks";
                  yesButton.style.padding = '8px 15px';
                  yesButton.style.background = '#4a86e8';
                  yesButton.style.color = 'white';
                  yesButton.style.border = 'none';
                  yesButton.style.borderRadius = '5px';
                  yesButton.style.cursor = 'pointer';
                  yesButton.style.marginRight = '10px';
                  
                  // Create the No button
                  const noButton = document.createElement('button');
                  noButton.textContent = "Not now";
                  noButton.style.padding = '8px 15px';
                  noButton.style.background = '#666';
                  noButton.style.color = 'white';
                  noButton.style.border = 'none';
                  noButton.style.borderRadius = '5px';
                  noButton.style.cursor = 'pointer';
                  
                  // Add button functionality
                  yesButton.onclick = () => {
                      window.location.href = "https://pages.opencodingsociety.com/stocks/home";
                  };
                  
                  noButton.onclick = () => {
                      if (this.dialogueSystem) {
                          this.dialogueSystem.closeDialogue();
                      }
                  };
                  
                  // Add buttons to container
                  buttonContainer.appendChild(yesButton);
                  buttonContainer.appendChild(noButton);
                  
                  // Add buttons to dialogue box RIGHT AWAY (no setTimeout)
                  const dialogueBox = document.getElementById('custom-dialogue-box-' + this.dialogueSystem.id);
                  if (dialogueBox) {
                      // Find the close button to insert before it
                      const closeBtn = dialogueBox.querySelector('button');
                      if (closeBtn) {
                          dialogueBox.insertBefore(buttonContainer, closeBtn);
                      } else {
                          dialogueBox.appendChild(buttonContainer);
                      }
                  }
              } else {
                  // Original functionality as fallback
                  const confirmTeleport = window.confirm("Teleport to the stock market?");
                  if (confirmTeleport) {
                      window.location.href = "https://pages.opencodingsociety.com/stocks/home";
                  }
              }
          }
      };

    const sprite_src_crypto = path + "/images/gamify/bitcoin.png";
    const sprite_greet_crypto = "*cha-ching*";
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
        // Add dialogues array for random messages
        dialogues: [
            "To the moon! 🚀 Crypto prices are always on a wild ride.",
            "Have you heard of blockchain? It's the technology behind cryptocurrencies.",
            "Bitcoin was created by someone called Satoshi Nakamoto.",
            "Mining crypto uses a lot of computing power.",
            "HODL! That's crypto-speak for holding onto your assets long-term.",
            "NFTs are another blockchain application. Digital art on the blockchain!",
            "Decentralized finance is changing how we think about money.",
            "Always do your own research before investing in crypto."
        ],
        reaction: function() {
            // Use dialogue system instead of alert
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(sprite_greet_crypto);
            }
        },
        interact: function() {
            // Clear any existing dialogue first
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                this.dialogueSystem.closeDialogue();
            }
            
            // Show a dialogue with buttons immediately
            if (this.dialogueSystem) {
                // Get a random dialogue message if available
                let message = "Feeling lucky? The casino awaits with games of chance and fortune!";
                if (this.spriteData.dialogues && this.spriteData.dialogues.length > 0) {
                    const randomIndex = Math.floor(Math.random() * this.spriteData.dialogues.length);
                    message = this.spriteData.dialogues[randomIndex];
                }
                
                this.dialogueSystem.showDialogue(
                    message,
                    "Bitcoin",
                    this.spriteData.src
                );
                
                // Create the buttons container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'space-between';
                buttonContainer.style.marginTop = '10px';
                
                // Create the Yes button
                const yesButton = document.createElement('button');
                yesButton.textContent = "GAMBA !";
                yesButton.style.padding = '8px 15px';
                yesButton.style.background = '#4a86e8';
                yesButton.style.color = 'white';
                yesButton.style.border = 'none';
                yesButton.style.borderRadius = '5px';
                yesButton.style.cursor = 'pointer';
                yesButton.style.marginRight = '10px';
                
                // Create the No button
                const noButton = document.createElement('button');
                noButton.textContent = "Not today";
                noButton.style.padding = '8px 15px';
                noButton.style.background = '#666';
                noButton.style.color = 'white';
                noButton.style.border = 'none';
                noButton.style.borderRadius = '5px';
                noButton.style.cursor = 'pointer';
                
                // Add button functionality
                yesButton.onclick = () => {
                    window.location.href = "https://pages.opencodingsociety.com/gamify/casinohomepage";
                };
                
                noButton.onclick = () => {
                    if (this.dialogueSystem) {
                        this.dialogueSystem.closeDialogue();
                    }
                };
                
                // Add buttons to container
                buttonContainer.appendChild(yesButton);
                buttonContainer.appendChild(noButton);
                
                // Add buttons to dialogue box RIGHT AWAY (no setTimeout)
                const dialogueBox = document.getElementById('custom-dialogue-box-' + this.dialogueSystem.id);
                if (dialogueBox) {
                    // Find the close button to insert before it
                    const closeBtn = dialogueBox.querySelector('button');
                    if (closeBtn) {
                        dialogueBox.insertBefore(buttonContainer, closeBtn);
                    } else {
                        dialogueBox.appendChild(buttonContainer);
                    }
                }
            } else {
                // Original functionality as fallback
                const confirmTeleport = window.confirm("Teleport to gambling hub?");
                if (confirmTeleport) {
                    window.location.href = "https://pages.opencodingsociety.com/gamify/casinohomepage";
                }
            }
        }

    };

    const sprite_src_robot = path + "/images/gamify/robot.png";
    const sprite_greet_robot = "Hi I am Robot, the Jupyter Notebook mascot. I am very happy to spend some linux shell time with you!";
    const sprite_data_robot = {
        id: 'Robot',
        greeting: sprite_greet_robot,
        src: sprite_src_robot,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 100,
        pixels: {height: 316, width: 627},
        INIT_POSITION: { x: (width * 3 / 4), y: (height * 1 / 4)},
        orientation: {rows: 3, columns: 6 },
        down: {row: 1, start: 0, columns: 6 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Add dialogues array for random messages
        dialogues: [
            "Jupyter Notebooks let you mix code, text, and visualizations.",
            "The name Jupyter comes from Julia, Python, and R - popular data science languages.",
            "Interactive computing makes data exploration so much more fun!",
            "I can help you analyze and visualize your data.",
            "Notebooks are perfect for data storytelling and sharing insights.",
            "Many scientists use me for reproducible research.",
            "Press Shift+Enter to run a cell in Jupyter Notebook.",
            "You can export notebooks to many formats, like HTML and PDF."
        ],
        reaction: function() {
            // Use dialogue system instead of alert
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(sprite_greet_robot);
            }
        },
        interact: function() {
            // KEEP ORIGINAL GAME-IN-GAME FUNCTIONALITY
            // Set a primary game reference from the game environment
            let primaryGame = gameEnv.gameControl;
            // Define the game in game level
            let levelArray = [GameLevelMeteorBlaster];
            // Define a new GameControl instance with the MeteorBlaster level
            let gameInGame = new GameControl(gameEnv.game, levelArray);
            // Pause the primary game 
            primaryGame.pause();
            // Start the game in game
            gameInGame.start();
            // Setup "callback" function to allow transition from game in game to the underlying game
            gameInGame.gameOver = function() {
                // Call .resume on primary game
                primaryGame.resume();
            }
        }
    };

      const sprite_src_r2d2 = path + "/images/gamify/r2_idle.png";
      const sprite_greet_r2d2 = "Hi I am R2D2. Leave this planet and help defend the rebel base on Hoth!";
      const sprite_data_r2d2 = {
          id: 'StarWarsR2D2',
          greeting: sprite_greet_r2d2,
          src: sprite_src_r2d2,
          SCALE_FACTOR: 8,
          ANIMATION_RATE: 100,
          pixels: {width: 505, height: 223},
          INIT_POSITION: { x: (width * 1 / 4), y: (height * 3 / 4)},
          orientation: {rows: 1, columns: 3 },
          down: {row: 0, start: 0, columns: 3 },
          hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
          // Add dialogues array for random messages
          dialogues: [
              "Beep boop! I have important data about the Death Star plans.",
              "The rebels need your help on Hoth. The Empire is approaching!",
              "I've served with Jedi Knights and rebel heroes across the galaxy.",
              "Whrrrr... bleep! Translation: Want to fly an X-Wing fighter?",
              "My counterpart C-3PO always worries too much.",
              "I've calculated the odds of success at approximately 647 to 1.",
              "The Force is strong with this one... I can sense it.",
              "Imperial forces are on high alert. We must be cautious."
          ],
          reaction: function() {
              // Use dialogue system instead of alert
              if (this.dialogueSystem) {
                  this.showReactionDialogue();
              } else {
                  console.log(sprite_greet_r2d2);
              }
          },
          interact: function() {
              // KEEP ORIGINAL GAME-IN-GAME FUNCTIONALITY
              // Set a primary game reference from the game environment
              let primaryGame = gameEnv.gameControl;
              let levelArray = [GameLevelStarWars];
              let gameInGame = new GameControl(gameEnv.game, levelArray);
              primaryGame.pause();
          
              // Create and style the fade overlay
              const fadeOverlay = document.createElement('div');
              Object.assign(fadeOverlay.style, {
                  position: 'absolute',
                  top: '0px',
                  left: '0px',
                  width: width + 'px',
                  height: height + 'px',
                  backgroundColor: '#0a0a1a',
                  opacity: '0',
                  transition: 'opacity 1s ease-in-out',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  fontFamily: "'Orbitron', sans-serif",
                  color: 'white',
                  fontSize: '18px',
                  zIndex: '9999'
              });
          
              const loadingText = document.createElement('div');
              loadingText.textContent = 'Loading...';
              fadeOverlay.appendChild(loadingText);
          
              const loadingBar = document.createElement('div');
              loadingBar.style.marginTop = '10px';
              loadingBar.style.fontFamily = 'monospace';
              loadingBar.textContent = '';
              fadeOverlay.appendChild(loadingBar);
          
              document.body.appendChild(fadeOverlay);
          
              // Fade in
              requestAnimationFrame(() => {
                  fadeOverlay.style.opacity = '1';
              });
          
              // Simulate loading bar
              const totalDuration = 1000; // 1 second
              const interval = 100;
              const totalSteps = totalDuration / interval;
              let currentStep = 0;
          
              const loadingInterval = setInterval(() => {
                  currentStep++;
                  loadingBar.textContent += '|';
                  if (currentStep >= totalSteps) {
                      clearInterval(loadingInterval);
                  }
              }, interval);
          
              // After loading and fade-in, start the mini-game
              setTimeout(() => {
                  // Start the new game
                  gameInGame.start();
          
                  // Setup return to main game after mini-game ends
                  gameInGame.gameOver = function() {
                      primaryGame.resume();
                  };
          
                  // Fade out
                  fadeOverlay.style.opacity = '0';
                  setTimeout(() => {
                      document.body.removeChild(fadeOverlay);
                  }, 1000); // Wait for fade-out to finish
          
              }, totalDuration + 200); // Delay a bit after loading bar finishes
          }
      };

    const sprite_src_minesweeper = path + "/images/gamify/robot.png";
    const sprite_greet_minesweeper = "Want to play a game of Minesweeper? Right-click to flag mines!";
    const sprite_data_minesweeper = {
        id: 'Minesweeper',
        greeting: sprite_greet_minesweeper,
        src: sprite_src_minesweeper,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 100,
        pixels: {height: 316, width: 627},
        INIT_POSITION: { x: (width * 2 / 3), y: (height * 2 / 3)},
        orientation: {rows: 3, columns: 6},
        down: {row: 1, start: 0, columns: 6},
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Add dialogues array for random messages
        dialogues: [
            "Minesweeper is all about logic and probability.",
            "The numbers tell you how many mines are adjacent to that square.",
            "Use right-click to flag squares you think contain mines.",
            "The first click is always safe in modern Minesweeper.",
            "Minesweeper was first included with Windows 3.1 in 1992.",
            "The world record for expert Minesweeper is under 40 seconds!",
            "Looking for patterns is key to solving Minesweeper efficiently.",
            "Sometimes you have to make an educated guess - that's part of the game."
        ],
        reaction: function() {
            // Use dialogue system instead of alert
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(sprite_greet_minesweeper);
            }
        },
        interact: function() {
            // KEEP ORIGINAL GAME-IN-GAME FUNCTIONALITY
            let primaryGame = gameEnv.gameControl;
            let levelArray = [GameLevelMinesweeper];
            let gameInGame = new GameControl(gameEnv.game, levelArray);
            primaryGame.pause();
            gameInGame.start();
            gameInGame.gameOver = function() {
                primaryGame.resume();
            }
        }
    };

    // List of objects defnitions for this level
    this.classes = [
      { class: GamEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_tux },
      { class: Npc, data: sprite_data_octocat },
      { class: Npc, data: sprite_data_robot },
      { class: Npc, data: sprite_data_r2d2 },
      { class: Npc, data: sprite_data_stocks },
      { class: Npc, data: sprite_data_crypto },
      { class: Npc, data: sprite_data_minesweeper },
      { class: Npc, data: sprite_data_endportal }  // Added End Portal NPC
    ];
  }

}

export default GameLevelDesert;