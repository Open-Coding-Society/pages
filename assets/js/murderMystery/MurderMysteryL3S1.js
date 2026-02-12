import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import BackgroundParallax from '/assets/js/GameEnginev1/essentials/BackgroundParallax.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';

console.log("🎮 mansionLevel3.js loaded!");

class MurderMysteryL3 {
  constructor(gameEnv) {
    console.log("🎮 MurderMysteryL3 constructor started");
    console.log("gameEnv:", gameEnv);
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    let gameControl = gameEnv.gameControl;

    console.log("✅ Game environment:", { width, height, path });

    const image_src_stairs = path + "/images/mansionGame/stairs_lvl3.png";
    const image_data_stairs = {
        name: 'stairs',
        greeting: "Never ending stairs, leading to unknown depths.",
        src: image_src_stairs,
        velocity: { x: 0, y: 0.4 },  // Vertical scrolling downward
        opacity: "0.3",  // Increated opacity for better visibility of stairs 
        scaleToFit: 'width',  // Scale image to fit screen width, tile vertically for scrolling
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

    const spike_data_top_1 = {
        id: 'spike_top_1',
        src: path + "",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 150, y: -200 },
        pixels: { height: 80, width: 100 },
        velocity: { x: 0, y: 0.4 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 }
    };

    const spike_data_bottom_1 = {
        id: 'spike_bottom_1',
        src: path + "",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 600, y: -350 },
        pixels: { height: 80, width: 100 },
        velocity: { x: 0, y: 0.4 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 }
    };

    const spike_data_top_2 = {
        id: 'spike_top_2',
        src: path + "",
        SCALE_FACTOR: 4,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 0,
        INIT_POSITION: { x: 300, y: -600 },
        pixels: { height: 80, width: 100 },
        velocity: { x: 0, y: 0.4 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 }
    };

    // Classes array - use ScrollingBackground instead of GameEnvBackground
    this.classes = [
      { class: GameEnvBackground, data: {} },
      { class: BackgroundParallax, data: image_data_stairs },
      { class: Player, data: sprite_data_archie },
      { class: Player, data: spike_data_top_1 },
      { class: Player, data: spike_data_bottom_1 },
      { class: Player, data: spike_data_top_2 }
    ];
  }
}

export default MurderMysteryL3;