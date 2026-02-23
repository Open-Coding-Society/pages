// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import Quiz from './Quiz.js';
// Using v1.5 DialogueSystem for improved ID sanitization
import DialogueSystem from '../GameEnginev1.1/DialogueSystem.js';
import GameControl from './essentials/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';
import GameLevelMeteorBlaster from './GameLevelMeteorBlaster.js';
import GameLevelMinesweeper from './GameLevelMinesweeper.js';
import GameLevelEnd from './GameLevelEnd.js';
import GameLevelOverworld from './GameLevelOverworld.js';
import AINpc from '../GameEnginev1.1/ai/AiNpc.js'
import Coin from '../GameEnginev1.1/Coin.js';

// Import Background for PlatformerMini
import Background from './essentials/Background.js';

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

   const sprite_data_coin = {
       id: 'coin',
       greeting: false,
       INIT_POSITION: { x: (width * 0.6), y: (height * 0.6) },
    width: 40,
    height: 70,
       color: '#FFD700',
       hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
       zIndex: 12,
       value: 1
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


     const sprite_src_chickenj = path + "/images/gamify/chickenj.png";
     const sprite_greet_chickenj = "FOLLOW THAT CHICKEN JOCKEY. ( Press E )";
     const sprite_data_chickenj = {
         id: 'Chicken Jockey',
         greeting: sprite_greet_chickenj,
         src: sprite_src_chickenj,
         SCALE_FACTOR: 9,
         ANIMATION_RATE: 100,
         pixels: {width: 150, height: 255},
         INIT_POSITION: { x: (width * 4 / 6), y: (height * 1 / 10)},
         orientation: {rows: 1, columns: 1 },
         down: {row: 0, start: 0, columns: 1 },
         hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
         dialogues: [
             "BAWK BAWK BAWK BAWK BAWK?!?!?!?",
             "GRRRRRRRR!!",
             "I'm placing blocks and stuff cuz im in freaking minceraftttt",
             "BAWAKKKKK!",
             "You want to fight the chicken?",
             "CHICKEN JOCKEEEYYYY"
         ],
         reaction: function() {
         },
         interact: function() {
             if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                 this.dialogueSystem.closeDialogue();
             }
            
             if (!this.dialogueSystem) {
                 this.dialogueSystem = new DialogueSystem();
             }
            
             this.dialogueSystem.showDialogue(
                 "Do you wish to explore the plains?",
                 "Plains Biome?",
                 this.spriteData.src
             );
            
             this.dialogueSystem.addButtons([
                 {
                     text: "Yes!",
                     primary: true,
                     action: () => {
                         this.dialogueSystem.closeDialogue();
                         pauseRpg();
                         platformerMini.onExit = () => {
                             resumeRpg();
                         };
                         platformerMini.start();
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
           let gameInGame = new GameControl(gameEnv.game, levelArray, { parentControl: primaryGame });
           // Pause the primary game
           if (typeof primaryGame.pause === 'function') {
               primaryGame.pause();
           } else if (typeof primaryGame.pauseGame === 'function') {
               primaryGame.pauseGame();
           }
             // Hide parent canvases so the nested mini-game renders cleanly
             try {
               if (typeof primaryGame.hideCanvasState === 'function') {
                 primaryGame.hideCanvasState();
               }
             } catch (e) {
               console.warn('Could not hide parent canvas state for nested MeteorBlaster', e);
             }
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
             // FIXED: Properly clean up the desert level before starting Star Wars game
             let primaryGame = gameEnv.gameControl;
            
             // Create and style the fade overlay
             const fadeOverlay = document.createElement('div');
             Object.assign(fadeOverlay.style, {
                 position: 'fixed',
                 top: '0px',
                 left: '0px',
                 width: '100%',
                 height: '100%',
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
                 // FIXED: Properly destroy the current level BEFORE creating the new game
                 console.log("Destroying current desert level...");
                 if (primaryGame.currentLevel && primaryGame.currentLevel.destroy) {
                     primaryGame.currentLevel.destroy();
                 }
                
                 // FIXED: Clear all canvas elements from the DOM
                 const gameContainer = document.getElementById('gameContainer');
                 if (gameContainer) {
                     // Remove all canvases except the main gameCanvas
                     const canvases = gameContainer.querySelectorAll('canvas');
                     canvases.forEach(canvas => {
                         if (canvas.id !== 'gameCanvas') {
                             console.log("Removing canvas:", canvas.id);
                             canvas.remove();
                         }
                     });
                 }
                
                 // Pause the primary game
                 primaryGame.pause();
                
                 // Now create and start the new game
                 let levelArray = [GameLevelStarWars];
                 let gameInGame = new GameControl(gameEnv.game, levelArray, { parentControl: primaryGame });
                // Hide parent canvases so the nested StarWars mini-game doesn't show underlying NPCs
                try {
                  if (typeof primaryGame.hideCanvasState === 'function') {
                    primaryGame.hideCanvasState();
                  }
                } catch (e) {
                  console.warn('Could not hide parent canvas state for nested StarWars', e);
                }
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
             let gameInGame = new GameControl(gameEnv.game, levelArray, { parentControl: primaryGame });
                     if (typeof primaryGame.pause === 'function') {
                       primaryGame.pause();
                     } else if (typeof primaryGame.pauseGame === 'function') {
                       primaryGame.pauseGame();
                     }
                    // Hide the parent canvases so the nested Minesweeper can draw
                    // cleanly on the main canvas without showing underlying NPCs.
                    try {
                      if (typeof primaryGame.hideCanvasState === 'function') {
                        primaryGame.hideCanvasState();
                      }
                    } catch (e) {
                      console.warn('Could not hide parent canvas state for nested Minesweeper', e);
                    }
           gameInGame.start();
           gameInGame.gameOver = function() {
               primaryGame.resume();
           }
       }
   };
    // ===== CUSTOM AI NPCs =====
   const historianNpc = new AINpc({
       id: "ProfessorHistory", 
       greeting: "Hello! I'm an expert in history!",
       expertise: "history",
       sprite: path + "/assets/js/GameEnginev1.1/ai/HistoryProf.png",
       spriteWidth: 559,
       spriteHeight: 263,
       scaleFactor: 0.5,
       animationRate: 10,
       randomPosition: false,  // ← Change this to false
       posX: width * 0.53,      // ← Add specific X position (center)
       posY: height * 0.28,
       gameEnv: gameEnv,


       // Sprite sheet layout
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


       knowledgeBase: {
           history: [
           {
               question: "What is ancient Egypt?",
               answer:
               "Ancient Egypt was one of the world's greatest civilizations, lasting over 3000 years! It had pyramids, pharaohs, and the mighty Nile River."
           },
           {
               question: "Tell me about the Renaissance",
               answer:
               "The Renaissance was a period of great cultural and artistic change in Europe, starting in Italy around the 14th century. Artists like Leonardo da Vinci and Michelangelo created amazing works!"
           },
           {
               question: "When was the Industrial Revolution?",
               answer:
               "The Industrial Revolution took place from the late 1700s to the 1800s. It changed how people worked, moving from farms to factories and inventing new machines!"
           },
           {
               question: "Who was Napoleon?",
               answer:
               "Napoleon Bonaparte was a French military leader who became Emperor. He conquered much of Europe but was eventually defeated and exiled."
           }
           ]
       }
       }).getData();


// List of objects defnitions for this level
   this.classes = [
     { class: GamEnvBackground, data: image_data_desert },
     { class: Player, data: sprite_data_chillguy },
         { class: Coin, data: sprite_data_coin },
     { class: Npc, data: sprite_data_tux },
     { class: Npc, data: sprite_data_octocat },
     { class: Npc, data: sprite_data_robot },
     { class: Npc, data: sprite_data_r2d2 },
     { class: Npc, data: sprite_data_stocks },
     { class: Npc, data: sprite_data_crypto },
     { class: Npc, data: sprite_data_minesweeper },
     { class: Npc, data: sprite_data_chickenj },
     { class: Npc, data: sprite_data_endportal },
     { class: Npc, data: historianNpc },
   ];

   // Platformer Mini Game Class
   class PlatformerMini {
    constructor(gameEnv) {
      this.gameEnv = gameEnv; 
      this.isRunning = false;

      this.enemyDefeated = false;
      this.enemyDying = false;

      this.canvas = document.createElement('canvas');
      this.canvas.width = window.innerWidth; 
      this.canvas.height = window.innerHeight; 
      this.ctx = this.canvas.getContext('2d'); 

      this.backgroundImage = new Image();
      this.backgroundImage.src = `${gameEnv.path}/images/gamify/mcbg.jpg`; 

      this.collectibleImage = new Image();
      this.collectibleImage.src = `${gameEnv.path}/images/gamify/sword.png`; 

      this.playerImage = new Image();
      this.playerImage.src = `${gameEnv.path}/images/gamify/stevelol.png`; 

      this.playerX = 50; 
      this.playerY = 600; 
      this.playerWidth = 85; 
      this.playerHeight = 85; 
      this.playerSpeedX = 0;
      this.playerSpeedY = 0;
      this.gravity = 0.5;
      this.groundY = 700;
      this.keysPressed = {};
      this.animationFrameId = null;
      this.onExit = null;
      this.canJump = true;
      this.playerDirection = 1;

      this.enemyImage = new Image();
      this.enemyImage.src = `${gameEnv.path}/images/gamify/mzombie.png`;

      const platformStartX = this.canvas.width / 2 + 50;
      const platformEndX = this.canvas.width / 2 + 410;
      const platformMiddleX = (platformStartX + platformEndX) / 2;
      this.enemyX = platformMiddleX - 50;
      this.enemyY = this.groundY - 400 - 100;
      this.enemyWidth = 100;
      this.enemyHeight = 100;
      this.enemySpeedX = 1;
      this.enemyDirection = -1;

      this.npcImage = new Image();
      this.npcImage.src = `${gameEnv.path}/images/gamify/mchicken.png`;
      this.npcWidth = 50;
      this.npcHeight = 50;
      this.npcX = this.canvas.width - 150;
      this.npcY = this.canvas.height - 575;
    }

    loadImages() {
      const images = [
        this.backgroundImage,
        this.collectibleImage, 
        this.playerImage,
        this.enemyImage,
        this.npcImage,
        ...this.platformImages
      ];

      images.forEach((img, index) => {
        if (img) {
          img.onerror = () => {
            console.warn(`Image failed to load: ${img.src}`);
            img.loadFailed = true;
          };
          
          img.onload = () => {
            console.log(`Image loaded successfully: ${img.src}`);
            img.loadFailed = false;
          };
        }
      });
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;

      pauseRpg();

      this.playerX = 50;
      this.playerY = this.groundY - 50;
      this.playerSpeedX = 0;
      this.playerSpeedY = 0;
      this.keysPressed = {};
      this.canJump = true;
      this.itemCollected = false;

      this.platformImages = [
        new Image(),
        new Image(),
        new Image()
      ];
      this.platformImages[0].src = `${path}/images/gamify/grassblock.jpg`;
      this.platformImages[1].src = `${path}/images/gamify/grassblock.jpg`;
      this.platformImages[2].src = `${path}/images/gamify/grassblock.jpg`;

      this.loadImages();

      this.canvas = document.createElement('canvas');
      this.canvas.id = 'platformerMiniCanvas';
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      Object.assign(this.canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '10000',
        backgroundColor: 'rgba(135, 206, 235, 1)'
      });
      document.body.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');

      window.addEventListener('keydown', this.keyDownHandler);
      window.addEventListener('keyup', this.keyUpHandler);

      this.showDialogue(
        "Oh no! It seems that there is a chicken in danger!\n\nPress 'E' to talk\nPress 'C' to collect",
        "Instructions"
      );

      this.loop();
    }

    stop() {
      if (!this.isRunning) return;
      this.isRunning = false;

      window.removeEventListener('keydown', this.keyDownHandler);
      window.removeEventListener('keyup', this.keyUpHandler);

      if (this.canvas?.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
        this.ctx = null;
      }

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.playerX = 50;
      this.playerY = this.groundY - 50;
      this.playerSpeedX = 0;
      this.playerSpeedY = 0;
      this.canJump = true;

      this.showDeathScreen();
    }

    showDeathScreen() {
      const deathScreen = document.createElement('div');
      deathScreen.id = 'deathScreen';
      Object.assign(deathScreen.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10001',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      });

      const message = document.createElement('h1');
      message.textContent = 'You have died!';
      message.style.marginBottom = '20px';
      deathScreen.appendChild(message);

      const button = document.createElement('button');
      button.textContent = 'Return to RPG';
      Object.assign(button.style, {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#ff0000',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      });
      button.addEventListener('click', () => {
        document.body.removeChild(deathScreen);
        if (this.onExit) this.onExit();
      });
      deathScreen.appendChild(button);

      document.body.appendChild(deathScreen);
    }

    showDialogue(message, title, callback) {
      const dialogueOverlay = document.createElement('div');
      Object.assign(dialogueOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10001',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      });

      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.marginBottom = '20px';
      dialogueOverlay.appendChild(titleElement);

      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageElement.style.marginBottom = '20px';
      dialogueOverlay.appendChild(messageElement);

      const button = document.createElement('button');
      button.textContent = 'Continue.';
      Object.assign(button.style, {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#ff0000',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      });
      button.addEventListener('click', () => {
        document.body.removeChild(dialogueOverlay);
        if (callback) callback();
      });
      dialogueOverlay.appendChild(button);

      document.body.appendChild(dialogueOverlay);
    }

    keyDownHandler = (e) => {
      this.keysPressed[e.code] = true;

      if (e.code === 'KeyE') {
        if (
          this.playerX + 50 > this.npcX && 
          this.playerX < this.npcX + this.npcWidth && 
          this.playerY + 50 > this.npcY && 
          this.playerY < this.npcY + this.npcHeight 
        ) {
          if (!this.enemyDefeated) {
            this.showDialogue(
              "BAWK! I'm too scared to move because of that monster over there! ( You have to defeat it first! )",
              "Scared NPC"
            );
          } else {
            this.showDialogue(
              "Hooray! You have slain the monster! Let's get out of here.. ( You will now be transported back to the Desert! )",
              "Grateful NPC",
              () => {
                window.location.reload();
              }
            );
          }
        }
      }

      if (e.code === 'Escape') {
        this.stop();
      }
    }

    keyUpHandler = (e) => {
      this.keysPressed[e.code] = false;
    }

    loop = () => {
      this.update();
      this.draw();
      if (this.isRunning) {
        this.animationFrameId = requestAnimationFrame(this.loop);
      }
    }

    update() {
      if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) {
        this.playerSpeedX = -5;
        this.playerDirection = -1;
      } else if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) {
        this.playerSpeedX = 5;
        this.playerDirection = 1;
      } else {
        this.playerSpeedX = 0;
      }

      if ((this.keysPressed['KeyW'] || this.keysPressed['ArrowUp'] || this.keysPressed['Space']) && this.canJump) {
        this.playerSpeedY = -15;
        this.canJump = false;
      }

      this.playerSpeedY += this.gravity;

      this.playerX += this.playerSpeedX;
      this.playerY += this.playerSpeedY;

      const platforms = [
        { x: this.canvas.width / 4 - 50, y: this.groundY - 150, width: 60, height: 60 },
        { x: this.canvas.width / 4 + 50, y: this.groundY - 200, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 100, y: this.groundY - 300, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 40, y: this.groundY - 300, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 50, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 110, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 170, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 230, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 290, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 350, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 410, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 150, y: this.groundY - 70, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 90, y: this.groundY - 70, width: 60, height: 60 }
      ];

      let onPlatform = false;
      
      for (const platform of platforms) {
        if (
          this.playerX < platform.x + platform.width &&
          this.playerX + this.playerWidth > platform.x &&
          this.playerY < platform.y + platform.height &&
          this.playerY + this.playerHeight > platform.y
        ) {
          if (this.playerSpeedY >= 0 && this.playerY <= platform.y) {
            this.playerY = platform.y - this.playerHeight;
            this.playerSpeedY = 0;
            this.canJump = true;
            onPlatform = true;
            break;
          }
        }
      }

      const groundArea = this.canvas.width / 6;
      if (this.playerX + this.playerWidth > 0 && this.playerX < groundArea) {
        if (this.playerY >= this.groundY - this.playerHeight) {
          this.playerY = this.groundY - this.playerHeight;
          this.playerSpeedY = 0;
          this.canJump = true;
          onPlatform = true;
        }
      }

      const rightGroundX = this.canvas.width - 200;
      const rightGroundY = this.groundY - 400;
      if (this.playerX + this.playerWidth > rightGroundX && this.playerX < this.canvas.width) {
        if (this.playerY >= rightGroundY - this.playerHeight && this.playerY < rightGroundY + 50) {
          this.playerY = rightGroundY - this.playerHeight;
          this.playerSpeedY = 0;
          this.canJump = true;
          onPlatform = true;
        }
      }

      if (this.playerX < 0) {
        this.playerX = 0;
      }
      if (this.playerX > this.canvas.width - this.playerWidth) {
        this.playerX = this.canvas.width - this.playerWidth;
      }

      if (this.playerY > this.canvas.height || 
          (this.playerY > this.groundY + 100 && !onPlatform)) {
        console.log("Player fell to their death!");
        this.stop();
        return;
      }

      if (!this.enemyDefeated && !this.enemyDying) {
        this.enemyX += this.enemySpeedX * this.enemyDirection;
        
        const platformStartX = this.canvas.width / 2 + 50;
        const platformEndX = this.canvas.width / 2 + 410;
        
        if (this.enemyX <= platformStartX || this.enemyX >= platformEndX - this.enemyWidth) {
          this.enemyDirection *= -1;
        }
      }

      if (!this.enemyDefeated && !this.enemyDying) {
        if (
          this.playerX < this.enemyX + this.enemyWidth &&
          this.playerX + this.playerWidth > this.enemyX &&
          this.playerY < this.enemyY + this.enemyHeight &&
          this.playerY + this.playerHeight > this.enemyY
        ) {
          if (this.itemCollected) {
            console.log("Player defeated zombie with sword!");
            this.startZombieDeathAnimation(() => {
              this.enemyDefeated = true;
              this.enemyX = -1000;
            });
          } else {
            this.stop();
            return;
          }
        }
      }

      if (!this.itemCollected) {
        const collectibleX = this.canvas.width / 2 - 120;
        const collectibleY = this.groundY - 110;
        
        if (
          this.playerX < collectibleX + 40 &&
          this.playerX + this.playerWidth > collectibleX &&
          this.playerY < collectibleY + 40 &&
          this.playerY + this.playerHeight > collectibleY
        ) {
          if (this.keysPressed['KeyC']) {
            this.itemCollected = true;
          }
        }
      }

      if (this.playerY > this.canvas.height) {
        this.stop();
      }
    }

    startZombieDeathAnimation(callback) {
      if (this.enemyDying) return;
      this.enemyDying = true;

      console.log("Starting zombie death animation with red phase...");

      const zombieCenterX = this.enemyX + this.enemyWidth / 2;
      const zombieCenterY = this.enemyY + this.enemyHeight / 2;

      const originalDrawEnemy = this.drawEnemy.bind(this);
      let redPhase = true;

      this.drawEnemy = () => {
        if (redPhase && this.enemyImage.complete && !this.enemyImage.loadFailed) {
          try {
            this.ctx.save();
            this.ctx.filter = 'brightness(1.5) saturate(5) hue-rotate(-30deg) contrast(2)';
            this.ctx.globalAlpha = 1.0;
            
            if (this.enemyDirection === 1) {
              this.ctx.scale(-1, 1);
              this.ctx.drawImage(
                this.enemyImage,
                -this.enemyX - this.enemyWidth,
                this.enemyY,
                this.enemyWidth,
                this.enemyHeight
              );
            } else {
              this.ctx.drawImage(
                this.enemyImage,
                this.enemyX,
                this.enemyY,
                this.enemyWidth,
                this.enemyHeight
              );
            }
            this.ctx.restore();
          } catch (error) {
            console.warn('Failed to draw dying enemy image:', error);
            this.ctx.fillStyle = '#FF0000'; 
            this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
          }
        }
      };

      setTimeout(() => {
        console.log("Red phase complete, starting particle explosion...");
        redPhase = false;
        
        const particles = [];
        const particleCount = 25; 

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.style.position = 'fixed';
          
          const canvasRect = this.canvas.getBoundingClientRect();
          const screenX = canvasRect.left + zombieCenterX;
          const screenY = canvasRect.top + zombieCenterY;
          
          particle.style.left = `${screenX}px`;
          particle.style.top = `${screenY}px`;
          particle.style.width = `${5 + Math.random() * 8}px`; 
          particle.style.height = particle.style.width;
          
          const greyValue = Math.floor(70 + Math.random() * 130); 
          particle.style.backgroundColor = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
          particle.style.borderRadius = '50%';
          particle.style.zIndex = '10002';
          particle.style.pointerEvents = 'none';
          particle.style.transition = 'all 1.2s ease-out';
          particle.style.boxShadow = '0 0 4px rgba(100, 100, 100, 0.8)';
          
          document.body.appendChild(particle);
          particles.push(particle);
        }

        setTimeout(() => {
          particles.forEach((particle, index) => {
            const angle = (index / particleCount) * Math.PI * 2;
            const distance = 70 + Math.random() * 120; 
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance + Math.random() * -50; 
            
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            particle.style.left = `${currentLeft + offsetX}px`;
            particle.style.top = `${currentTop + offsetY}px`;
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.1)';
          });
        }, 100);

        setTimeout(() => {
          particles.forEach(particle => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          });
          
          this.drawEnemy = originalDrawEnemy;
          
          console.log("Zombie death animation complete");
          if (callback) callback();
        }, 1300);

      }, 500); 
    }

    drawEnemy() {
      if (this.enemyImage.complete && !this.enemyImage.loadFailed) {
        try {
          this.ctx.save();
          if (this.enemyDirection === 1) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
              this.enemyImage,
              -this.enemyX - this.enemyWidth,
              this.enemyY,
              this.enemyWidth,
              this.enemyHeight
            );
          } else {
            this.ctx.drawImage(
              this.enemyImage,
              this.enemyX,
              this.enemyY,
              this.enemyWidth,
              this.enemyHeight
            );
          }
          this.ctx.restore();
        } catch (error) {
          console.warn('Failed to draw enemy image:', error);
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
        }
      } else {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.enemyX, this.enemyY, this.enemyWidth, this.enemyHeight);
      }
    }

    draw() {
      if (!this.ctx) return;

      if (this.backgroundImage.complete && !this.backgroundImage.loadFailed) {
        try {
          this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } catch (error) {
          console.warn('Failed to draw background image:', error);
          this.ctx.fillStyle = 'rgba(135, 206, 235, 1)';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
      } else {
        this.ctx.fillStyle = 'rgba(135, 206, 235, 1)'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      this.ctx.fillStyle = '#654321';
      this.ctx.fillRect(0, this.groundY, this.canvas.width / 6, this.canvas.height - this.groundY);

      this.ctx.fillStyle = '#654321';
      const rightGroundX = this.canvas.width - 200;
      const rightGroundY = this.groundY - 400; 
      this.ctx.fillRect(rightGroundX, rightGroundY, 200, this.canvas.height - rightGroundY);

      if (this.playerImage.complete && !this.playerImage.loadFailed) {
        try {
          if (this.playerDirection === 1) {
            this.ctx.save();
            this.ctx.translate(this.playerX + this.playerWidth, 0);
            this.ctx.scale(-1, 1);

            this.ctx.drawImage(
              this.playerImage,
              0,
              this.playerY,
              this.playerWidth,
              this.playerHeight
            );

            if (this.itemCollected && this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
              const swordOffsetY = 10;
              let swordOffsetX = 50;

              this.ctx.drawImage(
                this.collectibleImage,
                swordOffsetX,
                this.playerY + swordOffsetY,
                30,
                30
              );
            }

            this.ctx.restore();
          } else {
            this.ctx.drawImage(
              this.playerImage,
              this.playerX,
              this.playerY,
              this.playerWidth,
              this.playerHeight
            );

            if (this.itemCollected && this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
              const swordOffsetX = -5;
              const swordOffsetY = 10;
              this.ctx.drawImage(
                this.collectibleImage,
                this.playerX + this.playerWidth + swordOffsetX - 30,
                this.playerY + swordOffsetY,
                30,
                30
              );
            }
          }
        } catch (error) {
          console.warn('Failed to draw player image:', error);
          this.ctx.fillStyle = 'red';
          this.ctx.fillRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
        }
      } else {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);
      }

      const platforms = [
        { x: this.canvas.width / 4 - 50, y: this.groundY - 150, width: 60, height: 60 },
        { x: this.canvas.width / 4 + 50, y: this.groundY - 200, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 100, y: this.groundY - 300, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 40, y: this.groundY - 300, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 50, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 110, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 170, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 230, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 290, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 350, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 + 410, y: this.groundY - 400, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 150, y: this.groundY - 70, width: 60, height: 60 },
        { x: this.canvas.width / 2 - 90, y: this.groundY - 70, width: 60, height: 60 }
      ];

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        const platformImage = this.platformImages[i % this.platformImages.length];
        
        if (platformImage && platformImage.complete && !platformImage.loadFailed) {
          try {
            this.ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
          } catch (error) {
            console.warn('Failed to draw platform image:', error);
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
            this.ctx.strokeStyle = '#006400';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
          }
        } else {
          this.ctx.fillStyle = '#228B22';
          this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height * 0.3);
          this.ctx.fillStyle = '#8B4513';
          this.ctx.fillRect(platform.x, platform.y + (platform.height * 0.3), platform.width, platform.height * 0.7);
          this.ctx.strokeStyle = '#006400';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        }
      }

      if (!this.enemyDefeated) {
        this.drawEnemy();
      }

      if (this.npcImage.complete && !this.npcImage.loadFailed) {
        try {
          this.ctx.drawImage(
            this.npcImage,
            this.npcX,
            this.npcY,
            this.npcWidth,
            this.npcHeight
          );
        } catch (error) {
          console.warn('Failed to draw NPC image:', error);
          this.ctx.fillStyle = 'green';
          this.ctx.fillRect(this.npcX, this.npcY, this.npcWidth, this.npcHeight);
        }
      } else {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.npcX, this.npcY, this.npcWidth, this.npcHeight);
      }

      if (!this.itemCollected) {
        if (this.collectibleImage.complete && !this.collectibleImage.loadFailed) {
          try {
            this.ctx.drawImage(
              this.collectibleImage,
              this.canvas.width / 2 - 120,
              this.groundY - 110,
              40,
              40
            );
          } catch (error) {
            console.warn('Failed to draw collectible image:', error);
            this.ctx.fillStyle = 'gold';
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2 - 120, this.groundY - 90, 20, 0, Math.PI * 2);
            this.ctx.fill();
          }
        } else {
          this.ctx.fillStyle = 'gold';
          this.ctx.beginPath();
          this.ctx.arc(this.canvas.width / 2 - 120, this.groundY - 90, 20, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

   const platformerMini = new PlatformerMini(gameEnv);

   let isRpgPaused = false;
   let desertMovementInterval, desertAnimationInterval;

   const pauseRpg = () => {
     if (isRpgPaused) return;
     isRpgPaused = true;

     clearInterval(desertMovementInterval);
     clearInterval(desertAnimationInterval);
   };

   const resumeRpg = () => {
     if (!isRpgPaused) return;
     isRpgPaused = false;

     desertMovementInterval = setInterval(() => {
       // Resume any movement logic if needed
     }, 100);

     desertAnimationInterval = setInterval(() => {
       // Resume any animation logic if needed
     }, 5000);
   };

 }


}


export default GameLevelDesert;