// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import GameControl from './essentials/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js'; // change this to your mini-game level

class GameLevelCssePath {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src = path + "/images/gamify/pathway/csse/bg/indentity-forge-1.png"; 
    const bg_data = {
        name: 'Identity Forge',
        greeting: "Welcome to the CSSE pathway!  This quest will identify your profile and personna!",
        src: image_src,
    };

    // Player data for Chillguy
    const player_src = path + "/images/gamify/pathway/csse/player/minimalist.png"; // be sure to include the path
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
        id: 'Minimalist Identity',
        greeting: "Hi I am a new adventurer on the CSSE pathway, I am here to discover my identity and personna!",
        src: player_src,
        SCALE_FACTOR: PLAYER_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: height - (height/PLAYER_SCALE_FACTOR) }, 
        pixels: {height: 1024, width: 1024},
        orientation: {rows: 2, columns: 2 },
        down: {row: 0, start: 0, columns: 1 },
        downRight: {row: 0, start: 0, columns: 1, rotate: Math.PI/16 },
        downLeft: {row: 0, start: 0, columns: 1, rotate: -Math.PI/16 },
        left: {row: 1, start: 0, columns: 1, mirror: true },
        right: {row: 1, start: 0, columns: 1 },
        up: {row: 0, start: 1, columns: 1 },
        upLeft: {row: 1, start: 0, columns: 1, mirror: true, rotate: Math.PI/16 },
        upRight: {row: 1, start: 0, columns: 1, rotate: -Math.PI/16 },
        hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    const npc_src_1 = path + "/images/gamify/pathway/csse/npc/gatekeeper2.png"; 
    const npc_greet_1 = "Hi I am gatekeeper, finish your tassks to unlock the secrets of the CSSE pathway!";
    const npc_data_1 = {
        id: 'Gatekeeper',
        greeting: npc_greet_1,
        src: npc_src_1,
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 50,
        pixels: {width: 1024, height: 1024},
        orientation: {rows: 2, columns: 2 },
        INIT_POSITION: { x: (width * .25), y: (height * .65)},
        down: {row: 0, start: 0, columns: 1, wiggle: 0.005 },
        up: {row: 0, start: 1, columns: 1 },
        hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
        // Add dialogues array for random messages
        dialogues: [
            "Welcome, traveler. Are you ready to embark on the CSSE pathway?",
            "The CSSE pathway is filled with challenges and rewards. Prepare yourself!",
            "To unlock the secrets of the CSSE pathway, you must complete your tasks and prove your worth.",
            "The CSSE pathway will test your skills and knowledge. Are you up for the challenge?",
            "Remember, the CSSE pathway is not just about reaching the destination, but also about the journey. Enjoy it!"
        ],
        reaction: function() {
            // Use dialogue system instead of alert
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(npc_greet_1);
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
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: Npc, data: npc_data_1 },
    ];
  }

}

export default GameLevelCssePath;