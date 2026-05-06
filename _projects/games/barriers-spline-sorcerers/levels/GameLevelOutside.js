
import GameEnvBackground  from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import SpriteSheetCoin from '@assets/js/projects/barriers-spline-sorcerers/levels/SpriteSheetCoin.js';
import SplineBarrier from '@assets/js/projects/barriers-spline-sorcerers/levels/SplineBarrier.js';

/**
 * GameLevelOutside
 * 
 * Defines the configuration for the Outside mini-game level.
 * This class constructs the objects that will exist in the level,
 * including the background, player, NPC, barrier, and moving target.
 * 
 * Each object is described with a configuration object that determines
 * sprite properties, positioning, animations, and gameplay behavior.
 */
class GameLevelOutside {


    /**
     * Friendly name of the game level
     * @static
     * @type {string}
     */
    static friendlyName = "Level 1: Castle Grounds";

    /**
     * Creates a new Outside level configuration.
     *
     * @param {GameEnvironment} gameEnv - The main game env object
     */
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        // --- Floor ---
        const image_src_floor = path + "/images/projects/barriers-spline-sorcerers/castleOutside.png";
        const image_data_floor = {
            name: 'floor',
            src: image_src_floor,
            pixels: {height: 755, width: 1206}
        };

        /**
         * Player character sprite configuration.
         *
         * Represents the main controllable character (knight)
         * The player can move around the map and interact with NPCs. It can also shoot arrows.
         */
        const sprite_src_mc = path + "/images/projects/barriers-spline-sorcerers/playerSpritesheet.png";
        const MC_SCALE_FACTOR = 15;
        const sprite_data_mc = {
            id: 'Knight',
            greeting: "Hi, I am a Knight.",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 1500,
            ANIMATION_RATE: 40,
            INIT_POSITION: { 
                x: 0.5 * width, 
                y: 0.75 * height
            },
            pixels: {height: 432, width: 234},
            orientation: {rows: 4, columns: 3},
            down: {row: 0, start: 0, columns: 3},
            downRight: {row: 2, start: 0, columns: 3, rotate: Math.PI/16},
            downLeft: {row: 1, start: 0, columns: 3, rotate: -Math.PI/16},
            left: {row: 1, start: 0, columns: 3},
            right: {row: 2, start: 0, columns: 3},
            up: {row: 3, start: 0, columns: 3},
            upLeft: {row: 1, start: 0, columns: 3, rotate: Math.PI/16},
            upRight: {row: 2, start: 0, columns: 3, rotate: -Math.PI/16},
            hitbox: {widthPercentage: 0.15, heightPercentage: 0.2},
            keypress: {up: 87, left: 65, down: 83, right: 68}, // W, A, S, D
        };
    

        const sir_morty = path + "/images/projects/barriers-spline-sorcerers/mortyKnight.png";
        const sir_morty_greeting = "Hello! I'm Sir Morty!";
        const sir_morty_data = {
        id: "Sir Morty",
        greeting: sir_morty_greeting,
        src: sir_morty,
        SCALE_FACTOR: 7,
        ANIMATION_RATE: 40,
        interactDistance: 50, // Reduce interaction distance
        pixels: { height: 864, width: 468 },
        INIT_POSITION: { x: width * 0.57, y: height * 0.5 },
        orientation: { rows: 4, columns: 3 },
        // LOCK: use ONLY the 4th row (index 3) for every direction/state
        down:      { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
        // AI-specific properties (required for AiNpc utility)
        expertise: "default",              // Topic area for backend
        chatHistory: [],                   // Conversation memory
        dialogues: [                       // Random greetings
            "Enter the castle if you dare!",
            "The Dark Knight awaits inside.",
            "I heard there's a treasure in the castle.",
            "Beware of the traps in the castle!",
            "The castle has stood for centuries."
        ],
        knowledgeBase: {                   // Context hints for AI
            default: [
                {
                    question: "What is inside the castle?",
                    answer: "Inside the castle lays a prisoner who has been locked away for years. The Dark Knight guards the castle and challenges anyone who dares to enter with an archery test, a maze, and a showdown inside the fortress."
                },
                {
                    question: "Who are you?",
                    answer: "I am Sir Morty, a brave knight of the castle. Enter or recieve a .55! Code code code!"
                },
                {
                    question: "How do I win the game?",
                    answer: "To win the game, you need to successfully navigate through the castle grounds, complete the archery challenge, solve the maze, and defeat the Dark Knight in the fortress. Only then will you be able to free the prisoner and claim victory!"
                },
                {
                    question: "Any tips for the archery challenge?",
                    answer: "In the archery challenge, timing and precision are key. Pay attention to the movement patterns of the targets and try to anticipate their next move. Practice your aim and don't be afraid to take a few shots to get a feel for the mechanics. Good luck!"
                },
                {
                    question: "What can you tell me about the Dark Knight?",
                    answer: "The Dark Knight is a formidable opponent who guards the castle's inner sanctum. He is known for his archery skills and strategic mind. To defeat him, you'll need to be quick on your feet and have a solid strategy. Study his movements and look for openings to strike. Stay determined and you might just come out victorious!"
                },
                {
                    question: "Can you give me a hint for the maze?",
                    answer: "The maze can be tricky, but keep an eye out for subtle visual cues that might indicate the correct path. Sometimes the walls themselves can give you hints, like cracks or moss. Take your time and don't rush through it. If you get lost, try retracing your steps and look for patterns in the layout. You can do it!"
                },
                {
                    question: "Is there anything else I should know about the castle?",
                    answer: "The castle is full of secrets and hidden passages. Explore every nook and cranny, and you might find something that gives you an edge in your quest. Also, remember that the castle has a rich history, and learning about it might provide insights into how to navigate its challenges. Stay curious and keep exploring!"
                }
            ]
        },
        // Orchestrator: Handle collision/proximity reactions
        reaction: function() {
            if (this.dialogueSystem) {
                this.showReactionDialogue();
            } else {
                console.log(sir_morty_greeting);
            }
        },
        // Orchestrator: Handle player interaction (E key press)
        interact: function() {
            // Check distance to player before allowing interaction
            const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
            if (player) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 50) { // Max interaction distance
                    console.log('Too far to interact:', distance);
                    return;
                }
            }
            // Delegate to AiNpc utility for full AI conversation interface
            AiNpc.showInteraction(this);
        }
        };


        /**
         * DarkKnight NPC configuration:
         *
         * Acts as the  trigger to start the archery mini-game.
         * When the player interacts (presses E), a dialogue appears allowing the player to start or cancel the game.
         */
        const sprite_src_darkKnight = path + "/images/projects/barriers-spline-sorcerers/darkKnight.png";
        const sprite_greet_darkKnight = "Start the game? Press E";
        const sprite_data_darkKnight = {
            id: 'DarkKnight',
            greeting: sprite_greet_darkKnight,
            src: sprite_src_darkKnight,
            SCALE_FACTOR: 12,
            ANIMATION_RATE: 40,
            interactDistance: 50, // Reduce interaction distance
            pixels: {width: 242, height: 432},
            INIT_POSITION: {x: 0.49 * width, y: 0.33 * height},
            orientation: {rows: 4, columns: 3},
            down: {row: 0, start: 0, columns: 3},
            left: {row: 1, start: 0, columns: 3},
            right: {row: 2, start: 0, columns: 3},
            up: {row: 3, start: 0, columns: 3},
            hitbox: {widthPercentage: 0.1, heightPercentage: 0.2},
            dialogues: [
                "Are you ready to play some archery?"
            ],
            reaction: function() {
                // Don't show any reaction dialogue - this prevents the first alert
                // The interact function will handle all dialogue instead
            },
            
            // This is where the interactions for starting the game are handled
            interact: function() {
                // Check distance to player before allowing interaction
                const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
                if (player) {
                    const dx = player.x - this.x;
                    const dy = player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 50) { // Max interaction distance
                        console.log('Too far to interact:', distance);
                        return;
                    }
                }
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
                    "Are you ready to enter the castle?",
                    "DarkKnight",
                    this.spriteData.src
                );
                

                // this is taken from the castle game our team made, and USUALLY we would transition to the next
                // levels here. however this project is literally just curved barriers and so we deleted all that
                // so interactions with the dark knight don't actually do anything :)))

            }
        };

        // Randomly select a gem from the 2x4 spritesheet (8 gems total: 0-7)
        const gem_data = {
            id: 'gem',
            INIT_POSITION: { x: 0.5, y: 0.5 },
            SCALE_FACTOR: 30,
            value: 5,
            spriteImagePath: path + '/images/projects/barriers-spline-sorcerers/gems.png',
            spriteFrames: { rows: 2, columns: 4, frameIndex: Math.floor(Math.random() * 8) }     
        }

        /**
         * Example Spline Barrier Configuration
         * 
         * Creates a curved barrier that blocks player movement
         * The spline points define a smooth S-curve across the level
         */
        const spline_barrier_data_1 = {
            id: 'curved-wall-1',
            greeting: "This is a curved barrier, you cannot pass through it!",
            splinePoints: [
                { x: 427/1114*width, y: 749/760*height },
                { x: 539/1114*width, y: 627/760*height },
                { x: 445/1114*width, y: 504/760*height },
                { x: 550/1114*width, y: 380/760*height },
                // { x: 520/1114*width, y: 295/760*height }
            ],
            // Optional: Add visual properties if you want to render the barrier
            visible: false,
            color: '#8B4513',  // Brown color for wooden barrier
            lineWidth: 5        // Line thickness for visual representation
        };

        const spline_barrier_data_2 = {
            id: 'curved-wall-2',
            greeting: "This is a curved barrier, you cannot pass through it!",
            splinePoints: [
                { x: 604/1114*width, y: 749/760*height },
                { x: 675/1114*width, y: 666/760*height },
                { x: 575/1114*width, y: 494/760*height },
                { x: 635/1114*width, y: 384/760*height },
                // { x: 590/1114*width, y: 305/760*height }
            ],
            // Optional: Add visual properties if you want to render the barrier
            visible: false,
            color: '#8B4513',  // Brown color for wooden barrier
            lineWidth: 5        // Line thickness for visual representation
        };


        this.classes = [
            {class: GameEnvBackground, data: image_data_floor},
            {class: Player, data: sprite_data_mc},
            {class: Npc, data: sprite_data_darkKnight},
            // {class: Npc, data: sir_morty_data},
            {class: SplineBarrier, data: spline_barrier_data_1},
            {class: SplineBarrier, data: spline_barrier_data_2},
            {class: SpriteSheetCoin, data: gem_data}
        ];
    }
}

export default GameLevelOutside;
