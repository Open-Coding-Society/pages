import GameEnv from "./GameEnv.js"

class GameLevel {

  constructor(gameControl) {
    this.gameEnv = new GameEnv()
    this.gameEnv.game = gameControl.game
    this.gameEnv.path = gameControl.path
    this.gameEnv.gameContainer = gameControl.gameContainer
    this.gameEnv.gameControl = gameControl
  }

  /** Spawning Object Literals to Class */
  normalizeClassDescriptor(entry) {
    // Backward compatible: support both object descriptors and tuple style [Class, data, spawn].
    if (Array.isArray(entry)) {
      return {
        class: entry[0],
        data: entry[1] || {},
        spawn: entry[2] || null,
      }
    }
    return entry || {}
  }

  cloneData(data) {
    const cloneValue = (value, seen = new WeakMap()) => {
      if (value === null || typeof value !== 'object') {
        // Keep function references intact (interact callbacks, hooks, etc.).
        return value
      }

      if (typeof value === 'function') {
        return value
      }

      if (seen.has(value)) {
        return seen.get(value)
      }

      if (Array.isArray(value)) {
        const arr = []
        seen.set(value, arr)
        for (const item of value) {
          arr.push(cloneValue(item, seen))
        }
        return arr
      }

      const out = {}
      seen.set(value, out)
      for (const [key, nested] of Object.entries(value)) {
        out[key] = cloneValue(nested, seen)
      }
      return out
    }

    return cloneValue(data || {})
  }

  randomInRange(range, fallback) {
    if (!Array.isArray(range) || range.length !== 2) {
      return fallback
    }
    const min = Number(range[0])
    const max = Number(range[1])
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return fallback
    }
    const low = Math.min(min, max)
    const high = Math.max(min, max)
    return low + Math.random() * (high - low)
  }

  pickOne(values, fallback) {
    if (!Array.isArray(values) || values.length === 0) {
      return fallback
    }
    const index = Math.floor(Math.random() * values.length)
    return values[index]
  }

  applySpawnConfig(data, spawn) {
    const out = this.cloneData(data || {})
    const ranges = (spawn && spawn.ranges) || {}
    const picks = (spawn && spawn.pickOne) || {}

    // Phase 2 range support: INIT_POSITION, speed, SCALE_FACTOR
    if (ranges.INIT_POSITION && typeof ranges.INIT_POSITION === 'object') {
      const init = out.INIT_POSITION || { x: 0, y: 0 }
      init.x = this.randomInRange(ranges.INIT_POSITION.x, init.x)
      init.y = this.randomInRange(ranges.INIT_POSITION.y, init.y)
      out.INIT_POSITION = init
    }
    out.speed = this.randomInRange(ranges.speed, out.speed)
    out.SCALE_FACTOR = this.randomInRange(ranges.SCALE_FACTOR, out.SCALE_FACTOR)

    // Optional pickOne support for variant assets/values.
    if (Object.prototype.hasOwnProperty.call(picks, 'src')) {
      out.src = this.pickOne(picks.src, out.src)
    }

    return out
  }

  expandDescriptor(descriptor) {
    const normalized = this.normalizeClassDescriptor(descriptor)
    if (!normalized.data) normalized.data = {}

    const spawn = normalized.spawn || {}
    const rawCount = Number(spawn.count)
    const count = Number.isFinite(rawCount) ? Math.max(1, Math.floor(rawCount)) : 1

    if (count === 1) {
      return [normalized]
    }

    const expanded = []
    for (let i = 0; i < count; i++) {
      expanded.push({
        class: normalized.class,
        data: this.applySpawnConfig(normalized.data, spawn),
      })
    }
    return expanded
  }

  /* End Spawning */

  create(GameLevelClass) {
    this.continue = true
    this.gameEnv.create()
    this.gameLevel = new GameLevelClass(this.gameEnv)
    this.gameObjectClasses = this.gameLevel.classes

    // Set current level instance in Game
    if (typeof Game !== 'undefined' && Game.setCurrentLevelInstance) {
        Game.setCurrentLevelInstance(this.gameLevel);
    }

    for (let descriptor of this.gameObjectClasses) {
      const expandedDescriptors = this.expandDescriptor(descriptor)
      for (let gameObjectClass of expandedDescriptors) {
        if (!gameObjectClass.data) gameObjectClass.data = {}
        let gameObject = new gameObjectClass.class(gameObjectClass.data, this.gameEnv)
        this.gameEnv.gameObjects.push(gameObject)
      }
    }

    if (typeof this.gameLevel.initialize === "function") {
        this.gameLevel.initialize()
    }

    window.addEventListener("resize", this.resize.bind(this))
  }

  destroy() {
    if (typeof this.gameLevel.destroy === "function") {
      this.gameLevel.destroy()
    }

    // Properly clean up all game objects
    for (let index = this.gameEnv.gameObjects.length - 1; index >= 0; index--) {
      // Make sure each object's destroy method is called to clean up event listeners
      this.gameEnv.gameObjects[index].destroy()
    }

    // Clear out the game objects array
    this.gameEnv.gameObjects = [];
    
    // Clean up GameEnv (including canvas)
    if (this.gameEnv && typeof this.gameEnv.destroy === "function") {
      this.gameEnv.destroy();
    }
    
    window.removeEventListener("resize", this.resize.bind(this))
  }

  update() {
    this.gameEnv.clear()

    for (let gameObject of this.gameEnv.gameObjects) {
      // Check if gameObject has an update method before calling it
      if (gameObject && typeof gameObject.update === 'function') {
        gameObject.update()
      }
    }

    if (typeof this.gameLevel.update === "function") {
      this.gameLevel.update()
    }
  }

  resize() {
    this.gameEnv.resize()
    for (let gameObject of this.gameEnv.gameObjects) {
      // Check if gameObject has a resize method before calling it
      if (gameObject && typeof gameObject.resize === 'function') {
        gameObject.resize()
      }
    }
  }
}

export default GameLevel
