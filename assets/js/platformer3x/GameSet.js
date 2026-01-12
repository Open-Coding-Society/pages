import GameEnv from './GameEnv.js';

class GameSet {
    constructor(assets, gameObjects, path) {
      // Add File location in assets relative to the root of the site
      Object.keys(assets).forEach(category => {
        Object.keys(assets[category]).forEach(item => {
          assets[category][item]['file'] = path + assets[category][item].src;
        });
      });
      this.assets = assets;
     
      // Filter gameObjects based on difficulty
      this.difficulty = localStorage.getItem("difficulty") || "normal";
      this.gameObjects = gameObjects.filter(obj => !obj.difficulties || obj.difficulties.includes(this.difficulty));
    }

    getAssets() {
      return this.assets;
    }

    getGameObjects() {
      return this.gameObjects;
    }

  }
  
  export default GameSet;
