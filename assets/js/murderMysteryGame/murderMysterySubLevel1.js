import GameEnvBackground  from "./murderMysteryGameLogic/GameEnvBackground.js";
import Player from "./murderMysteryGameLogic/Player.js";
import Npc from "./murderMysteryGameLogic/Npc.js";

class GameLevel1 {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_background = path + "/images/murderMystery/murderMysteryLevel1.png"; // be sure to include the path
    const image_data_background = {
        name: 'background',
        greeting: "The story starts here, you will search for clues and solve the mystery.",
        src: image_background,
        pixels: {height: 580, width: 1038},
        mode: 'contain',
    };


    const sprite_data_archie = {
        id: 'Archie',
        greeting: "Hi, I am Archie.",
        src: path + "/images/murderMystery/archie_left.png",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 250, y: 350 },
        pixels: {height: 150, width: 100},
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        downRight: {row: 0, start: 0, columns: 1},
        downLeft: {row: 0, start: 0, columns: 1},
        left: {row: 0, start: 0, columns: 1},
        right: {row: 0, start: 0, columns: 1},
        up: {row: 0, start: 0, columns: 1},
        upLeft: {row: 0, start: 0, columns: 1},
        upRight: {row: 0, start: 0, columns: 1},
        hitbox: {widthPercentage: 0.5, heightPercentage: 0.5},
        keypress: {left: 65, right:68, up: 87, down: 83} // A, D, W, S
    };


    const sprite_data_boat = {
        id: 'Boat',
        src: path + "/images/murderMystery/boat.png",
        SCALE_FACTOR: 2,
        STEP_FACTOR: 1000, // Same speed as Archie
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 250, y: 400 }, // Positioned slightly under Archie
        pixels: { height: 200, width: 400 }, // Adjust based on your boat image size
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        downRight: {row: 0, start: 0, columns: 1},
        downLeft: {row: 0, start: 0, columns: 1},
        left: { row: 0, start: 0, columns: 1 },
        right: { row: 0, start: 0, columns: 1 },
        up: { row: 0, start: 0, columns: 1 },
        upLeft: {row: 0, start: 0, columns: 1},
        upRight: {row: 0, start: 0, columns: 1},
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
        keypress: { left: 65, right: 68, up: 87, down: 83 } // Same keys as Archie
   };


    const sprite_data_island = {
        id: 'Island',
        greeting: "You've reached the island! Press E to disembark.",
        src: path + "/images/murderMystery/island_target.png", // An invisible or small target sprite
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: width - 200, y: 100 }, // Placed at the right edge
        pixels: { height: 100, width: 100 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 1.0, heightPercentage: 1.0 },
        interact: function() {
            alert("Level 1 Complete! You are stepping onto the island.");
            // Transition logic would go here
        }
    };


    this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player, data: sprite_data_boat },   // Boat spawns first
            { class: Player, data: sprite_data_archie }, // Archie spawns on top
            { class: Npc, data: sprite_data_island }    // The goal
        ];
   
}
}

export default GameLevel1;