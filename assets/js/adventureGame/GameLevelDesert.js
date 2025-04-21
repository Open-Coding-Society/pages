// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import Quiz from './Quiz.js';
import GameControl from './GameEngine/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';
import GameLevelMeteorBlaster from './GameLevelMeteorBlaster.js';
import GameLevelMinesweeper from './GameLevelMinesweeper.js';
import GameLevelEnd from './GameLevelEnd.js';

class GameLevelDesert {
  constructor(gameEnv) {
    // Values dependent on this.gameEnv.create()
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
    const sprite_src_tux = path + "/images/gamify/tux.png"; // be sure to include the path
    const sprite_greet_tux = "Hi I am Tux, the Linux mascot.  I am very happy to spend some linux shell time with you!";
    const sprite_data_tux = {
        id: 'Tux',
        greeting: sprite_greet_tux,
        src: sprite_src_tux,
        SCALE_FACTOR: 8,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 50,
        pixels: {height: 256, width: 352},
        INIT_POSITION: { x: (width / 2), y: (height / 2)},
        orientation: {rows: 8, columns: 11 },
        down: {row: 5, start: 0, columns: 3 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        // Linux command quiz
        quiz: { 
          title: "Linux Command Quiz",
          questions: [
            "Which command is used to list files in a directory?\n1. ls\n2. dir\n3. list\n4. show",
            "Which command is used to change directories?\n1. cd\n2. chdir\n3. changedir\n4. changedirectory",
            "Which command is used to create a new directory?\n1. mkdir\n2. newdir\n3. createdir\n4. makedir",
            "Which command is used to remove a file?\n1. rm\n2. remove\n3. delete\n4. erase",
            "Which command is used to remove a directory?\n1. rmdir\n2. removedir\n3. deletedir\n4. erasedir",
            "Which command is used to copy files?\n1. cp\n2. copy\n3. duplicate\n4. xerox",
            "Which command is used to move files?\n1. mv\n2. move\n3. transfer\n4. relocate",
            "Which command is used to view a file?\n1. cat\n2. view\n3. show\n4. display",
            "Which command is used to search for text in a file?\n1. grep\n2. search\n3. find\n4. locate",
            "Which command is used to view the contents of a file?\n1. less\n2. more\n3. view\n4. cat" 
          ] 
        },
        reaction: function() {
          alert(sprite_greet_tux);
        },
        interact: function() {
          let quiz = new Quiz(); // Create a new Quiz instance
          quiz.initialize();
          quiz.openPanel(sprite_data_tux);
          }
    
      };



      // NPC data for Octocat
      const sprite_src_octocat = path + "/images/gamify/octocat.png"; // be sure to include the path
      const sprite_greet_octocat = "Hi I am Octocat! I am the GitHub code code code collaboration mascot";
      const sprite_data_octocat = {
        id: 'Octocat',
        greeting: sprite_greet_octocat,
        src: sprite_src_octocat,
        SCALE_FACTOR: 10,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 50,
        pixels: {height: 301, width: 801},
        INIT_POSITION: { x: (width / 4), y: (height / 4)},
        orientation: {rows: 1, columns: 4 },
        down: {row: 0, start: 0, columns: 3 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        // GitHub command quiz 
        quiz: { 
          title: "GitHub Command Quiz",
          questions: [
            "Which command is used to clone a repository?\n1. git clone\n2. git fork\n3. git copy\n4. git download",
            "Which command is used to add changes to the staging area?\n1. git add\n2. git stage\n3. git commit\n4. git push",
            "Which command is used to commit changes?\n1. git commit\n2. git add\n3. git save\n4. git push",
            "Which command is used to push changes to a remote repository?\n1. git push\n2. git upload\n3. git send\n4. git commit",
            "Which command is used to pull changes from a remote repository?\n1. git pull\n2. git fetch\n3. git receive\n4. git update",
            "Which command is used to check the status of the working directory and staging area?\n1. git status\n2. git check\n3. git info\n4. git log",
            "Which command is used to create a new branch?\n1. git branch\n2. git create-branch\n3. git new-branch\n4. git checkout",
            "Which command is used to switch to a different branch?\n1. git checkout\n2. git switch\n3. git change-branch\n4. git branch",
            "Which command is used to merge branches?\n1. git merge\n2. git combine\n3. git join\n4. git integrate",
            "Which command is used to view the commit history?\n1. git log\n2. git history\n3. git commits\n4. git show"
          ] 
        },
        reaction: function() {
          alert(sprite_greet_octocat);
        },
        interact: function() {
          let quiz = new Quiz(); // Create a new Quiz instance
          quiz.initialize();
          quiz.openPanel(sprite_data_octocat);
        }
    }
    
          // NPC Data for End Portal
          const sprite_src_endportal = path + "/images/gamify/exitportalfull.png"; // be sure to include the path
          const sprite_greet_endportal = "Teleport to the End? Press E";
          const sprite_data_endportal = {
            id: 'End Portal',
            greeting: sprite_greet_endportal,
            src: sprite_src_endportal,
            SCALE_FACTOR: 6,  // smaller = baller
            ANIMATION_RATE: 100,
            pixels: {width: 2029, height: 2025},
            INIT_POSITION: { x: (width * 2 / 5), y: (height * 1 / 10)}, // Adjusted position
            orientation: {rows: 1, columns: 1 },
            down: {row: 0, start: 0, columns: 1 },  // This is the stationary npc, down is default 
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            /* Reaction function
            *  This function is called when the player collides with the NPC
            *  It displays an alert with the greeting message
            */
            reaction: function() {
              alert(sprite_greet_endportal);
            },
            /* Interact function
            *  This function is called when the player interacts with the NPC
            *  It pauses the main game, creates a new GameControl instance with the End level,
            */
            interact: function() {
              // Set a primary game reference from the game environment
              let primaryGame = gameEnv.gameControl;
              // Define the game in game level
              let levelArray = [GameLevelEnd];
              // Define a new GameControl instance with the End level
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



    const sprite_src_stocks = path + "/images/gamify/stockguy.png"; // Path to the NPC sprite
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
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_stocks);
        },
        // Interact when player presses "E"
        interact: function() {
            const confirmTeleport = window.confirm("Teleport to the stock market?");
            if (confirmTeleport) {
                window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/stocks/home"; // Replace with your link
            }
        }
    };

    const sprite_src_crypto = path + "/images/gamify/bitcoin.png"; // Path to the NPC sprite
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
        // Reaction when player approaches NPC
        reaction: function() {
            alert(sprite_greet_crypto);
        },
        // Interact when player presses "E"
        interact: function() {
            const confirmTeleport = window.confirm("Teleport to gambling hub?");
            if (confirmTeleport) {
                window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/casinohomepage"; // Replace with your lin
            }
        }
    };
    
    const sprite_src_robot = path + "/images/gamify/robot.png"; // be sure to include the path
    const sprite_greet_robot = "Hi I am Robot, the Jupyter Notebook mascot.  I am very happy to spend some linux shell time with you!";
    const sprite_data_robot = {
      id: 'Robot',
      greeting: sprite_greet_robot,
      src: sprite_src_robot,
      SCALE_FACTOR: 10,  // Adjust this based on your scaling needs
      ANIMATION_RATE: 100,
      pixels: {height: 316, width: 627},
      INIT_POSITION: { x: (width * 3 / 4), y: (height * 1 / 4)},
      orientation: {rows: 3, columns: 6 },
      down: {row: 1, start: 0, columns: 6 },  // This is the stationary npc, down is default 
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      // Linux command quiz

      quiz: { 
        title: "Jupyter Notebook Command Quiz",
        questions: [
          "Which shortcut is used to run a cell in Jupyter Notebook?\n1. Shift + Enter\n2. Ctrl + Enter\n3. Alt + Enter\n4. Tab + Enter",
          "Which shortcut adds a new cell above the current cell?\n1. A\n2. B\n3. C\n4. D",
          "Which shortcut adds a new cell below the current cell?\n1. B\n2. A\n3. C\n4. D",
          "Which shortcut changes a cell to Markdown format?\n1. M\n2. Y\n3. R\n4. K",
          "Which shortcut changes a cell to Code format?\n1. Y\n2. M\n3. C\n4. D",
          "Which shortcut deletes the current cell?\n1. D, D\n2. X\n3. Del\n4. Ctrl + D",
          "Which shortcut saves the current notebook?\n1. Ctrl + S\n2. Alt + S\n3. Shift + S\n4. Tab + S",
          "Which shortcut restarts the kernel?\n1. 0, 0\n2. R, R\n3. K, K\n4. Shift + R",
          "Which shortcut interrupts the kernel?\n1. I, I\n2. Ctrl + C\n3. Shift + I\n4. Alt + I",
          "Which shortcut toggles line numbers in a cell?\n1. L\n2. N\n3. T\n4. G"
        ] 
      },
      reaction: function() {
        alert(sprite_greet_robot);
      },

      interact: function() {
        // Set a primary game reference from the game environment
        let primaryGame = gameEnv.gameControl;
        // Define the game in game level
        let levelArray = [GameLevelMeteorBlaster];
        // Define a new GameControl instance with the StarWars level
        let gameInGame = new GameControl(gameEnv.game, levelArray);
        // Pause the primary game 
        primaryGame.pause();
        // Start the game in game
        gameInGame.start();
        // Setup "callback" function to allow transition from game in gaame to the underlying game
        gameInGame.gameOver = function() {
          // Call .resume on primary game
          primaryGame.resume();
        }
      }
    }

    // NPC Data for R2D2
    const sprite_src_r2d2 = path + "/images/gamify/r2_idle.png"; // be sure to include the path
    const sprite_greet_r2d2 = "Hi I am R2D2.  Leave this planet and help defent the rebel base on Hoth!";
    const sprite_data_r2d2 = {
      id: 'StarWarsR2D2',
      greeting: sprite_greet_r2d2,
      src: sprite_src_r2d2,
      SCALE_FACTOR: 8,  // Adjust this based on your scaling needs
      ANIMATION_RATE: 100,
      pixels: {width: 505, height: 223},
      INIT_POSITION: { x: (width * 1 / 4), y: (height * 3 / 4)}, // Adjusted position
      orientation: {rows: 1, columns: 3 },
      down: {row: 0, start: 0, columns: 3 },  // This is the stationary npc, down is default 
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      /* Reaction function
      *  This function is called when the player collides with the NPC
      *  It displays an alert with the greeting message
      */
      reaction: function() {
        alert(sprite_greet_r2d2);
      },
      /* Interact function
      *  This function is called when the player interacts with the NPC
      *  It pauses the main game, creates a new GameControl instance with the StarWars level,
      */
      interact: function() {
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

    const sprite_src_minesweeper = path + "/images/gamify/robot.png"; // Using robot sprite for Minesweeper NPC
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
      reaction: function() {
        alert(sprite_greet_minesweeper);
      },
      interact: function() {
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