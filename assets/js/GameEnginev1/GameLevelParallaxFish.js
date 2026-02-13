// To build GameLevels, each contains GameObjects from below imports
import BackgroundParallax from './essentials/BackgroundParallax.js';
import GamEnvBackground from './essentials/GameEnvBackground.js';

class GameLevelParallaxFish {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_reef = path + "/images/platformer/backgrounds/reef.png"; // be sure to include the path
    const image_data_reef = {
        name: 'reef',
        greeting: "Welcome to the reef!  It is vibrant and full of life, but there are many adventures to be had!",
        src: image_src_reef,
        pixels: {height: 360, width: 643}
    };

    const image_src_school_fish = path + "/images/platformer/backgrounds/school-fish.png";
    const image_data_school_fish = {
        name: 'school-fish',
        greeting: "A school of fish swims by, adding to the lively atmosphere of the reef.",
        src: image_src_school_fish,
        pixels: {height: 472, width: 529},
        velocity: { x: 0.5, y: 0 },  // Move right (positive = left to right), no vertical movement
        opacity: "0.8",  // More visible
        tiles: { y: 1 },  // Control rows only; horizontal auto-calculates for smooth scrolling
    }; 

    // List of objects defnitions for this level
    this.classes = [
      { class: GamEnvBackground, data: image_data_reef },
      { class: BackgroundParallax, data: image_data_school_fish },
    ];
  }

}

export default GameLevelParallaxFish;