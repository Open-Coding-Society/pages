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
    this.gameEnv.create()
    this.gameLevel = new GameLevelClass(this.gameEnv)
    this.gameObjectClasses = this.gameLevel.classes

    for (let gameObjectClass of this.gameObjectClasses) {
      if (!gameObjectClass.data) gameObjectClass.data = {}
      let gameObject = new gameObjectClass.class(gameObjectClass.data, this.gameEnv)
      this.gameEnv.gameObjects.push(gameObject)
    }

    if (typeof this.gameLevel.initialize === "function") {
      console.log('Calling initialize on game level...');
      this.gameLevel.initialize();
      console.log('Game level initialization complete');
    }

    window.addEventListener("resize", this.resize.bind(this))
  }

  destroy() {
    if (typeof this.gameLevel.destroy === "function") {
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

    if (typeof this.gameLevel.update === "function") {
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

