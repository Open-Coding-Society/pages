// GameLevel.js
import GameEnv from "./GameEnv.js"

class GameLevel {

  constructor(gameControl) {
    this.gameEnv = new GameEnv()
    this.gameEnv.game = gameControl.game
    this.gameEnv.path = gameControl.path
    this.gameEnv.gameContainer = gameControl.gameContainer
    this.gameEnv.gameCanvas = gameControl.gameCanvas
    this.gameEnv.gameControl = gameControl
  }

  create(GameLevelClass) {
    this.continue = true
    this.restart = false
    this.gameEnv.create()
    
    // Check if GameLevelClass is a valid constructor
    if (typeof GameLevelClass !== 'function') {
      console.error('GameLevelClass is not a constructor', GameLevelClass);
      throw new Error('GameLevelClass is not a constructor');
    }
    
    try {
      this.gameLevel = new GameLevelClass(this.gameEnv)
      
      // Check if classes property exists
      if (!this.gameLevel.classes || !Array.isArray(this.gameLevel.classes)) {
        console.error('GameLevel classes array is invalid', this.gameLevel);
        throw new Error('GameLevel classes array is invalid');
      }
      
      this.gameObjectClasses = this.gameLevel.classes

      for (let gameObjectClass of this.gameObjectClasses) {
        if (!gameObjectClass.data) gameObjectClass.data = {}
        
        // Check if class property is a constructor
        if (typeof gameObjectClass.class !== 'function') {
          console.error('GameObject class is not a constructor', gameObjectClass);
          continue; // Skip this object but don't crash the level
        }
        
        let gameObject = new gameObjectClass.class(gameObjectClass.data, this.gameEnv)
        this.gameEnv.gameObjects.push(gameObject)
      }

    if (typeof this.gameLevel.initialize === "function") {
      this.gameLevel.initialize()

    }

      window.addEventListener("resize", this.resize.bind(this))
      
    } catch (error) {
      console.error('Error creating game level:', error);
      this.continue = false;
    }
  }

  destroy() {
    if (typeof this.gameLevel?.destroy === "function") {
      this.gameLevel.destroy()
    }

    for (let index = this.gameEnv.gameObjects.length - 1; index >= 0; index--) {
      this.gameEnv.gameObjects[index].destroy()
    }
    window.removeEventListener("resize", this.resize.bind(this))
  }

  update() {
    this.gameEnv.clear()

    for (let gameObject of this.gameEnv.gameObjects) {
      gameObject.update()
    }

    if (typeof this.gameLevel?.update === "function") {
      this.gameLevel.update()
    }
  }

  resize() {
    this.gameEnv.resize()
    for (let gameObject of this.gameEnv.gameObjects) {
      gameObject.resize()
    }
  }
}

export default GameLevel