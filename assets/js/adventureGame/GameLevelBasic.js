// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import GameControl from './GameEngine/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';

class GameLevelBasic {
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
        
            // Start the new game
            gameInGame.start();

            // Setup return to main game after mini-game ends
            gameInGame.gameOver = function() {
                primaryGame.resume();
            };
        }
    };

    // List of objects defnitions for this level
    this.classes = [
      { class: GamEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_r2d2 },
    ];
  }

}

export default GameLevelBasic;