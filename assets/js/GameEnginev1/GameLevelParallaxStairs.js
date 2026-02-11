// To build GameLevels, each contains GameObjects from below imports
import BackgroundParallax from './essentials/BackgroundParallax.js';
import GamEnvBackground from './essentials/GameEnvBackground.js';

class GameLevelParallaxStairs {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_stairs = path + "/images/mansionGame/stairs_lvl3.png";
    const image_data_stairs = {
        name: 'stairs',
        greeting: "Never ending stairs, leading to unknown depths.",
        src: image_src_stairs,
        velocity: { x: 0, y: 0.5 },  // Move right (positive = left to right), no vertical movement
        tiles: { x: 1, y: 1 },  // 2 schools visible (buffer tile added automatically for scrolling)
    }; 

    // List of objects defnitions for this level
    this.classes = [
      { class: GamEnvBackground, data: {} },
      { class: BackgroundParallax, data: image_data_stairs },
    ];
  }

}

export default GameLevelParallaxStairs;