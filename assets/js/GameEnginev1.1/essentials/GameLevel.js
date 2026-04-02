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
  /**
   * Normalize a class entry into object descriptor format.
   * Supports object syntax and tuple syntax: [Class, data, spawn].
   * @param {*} entry class descriptor from level definition
   * @returns {{class: *, data: Object, spawn: Object|null}}
   */
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

  /**
   * Deep-clone data while preserving function references.
   * @param {*} data base object data for a game object
   * @returns {*} cloned data
   */
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

  /**
   * Generate a random number inside [min, max] from a range tuple.
   * Returns fallback if range is invalid.
   * @param {Array<number>} range [min, max]
   * @param {*} fallback value to use when range is invalid
   * @returns {*}
   */
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

  /**
   * Pick a random value from an array, or fallback when empty.
   * @param {Array<*>} values candidate values
   * @param {*} fallback value to use when array is empty
   * @returns {*}
   */
  pickOne(values, fallback) {
    if (!Array.isArray(values) || values.length === 0) {
      return fallback
    }
    const index = Math.floor(Math.random() * values.length)
    return values[index]
  }

  /**
   * Recursively apply numeric range overrides to matching keys.
   * A range tuple [min, max] becomes one randomized value.
   * @param {Object} target object to mutate
   * @param {Object} ranges range map
   */
  applyRanges(target, ranges) {
    if (!ranges || typeof ranges !== 'object' || Array.isArray(ranges)) {
      return
    }

    for (const [key, spec] of Object.entries(ranges)) {
      if (Array.isArray(spec)) {
        target[key] = this.randomInRange(spec, target[key])
        continue
      }

      if (spec && typeof spec === 'object') {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {}
        }
        this.applyRanges(target[key], spec)
      }
    }
  }

  /**
   * Recursively apply pick-one overrides to matching keys.
   * Any array value becomes one randomly selected value.
   * @param {Object} target object to mutate
   * @param {Object} picks pickOne map
   */
  applyPickOne(target, picks) {
    if (!picks || typeof picks !== 'object' || Array.isArray(picks)) {
      return
    }

    for (const [key, spec] of Object.entries(picks)) {
      if (Array.isArray(spec)) {
        target[key] = this.pickOne(spec, target[key])
        continue
      }

      if (spec && typeof spec === 'object') {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {}
        }
        this.applyPickOne(target[key], spec)
      }
    }
  }

  /**
   * Ensure spawned instances have distinct ids for collision/click routing.
   * Can be disabled with spawn.uniqueIds === false.
   * @param {Object} data spawned data object
   * @param {Object} spawn spawn settings
   * @param {number} index zero-based spawn index
   * @param {number} count total spawn count
   * @returns {Object}
   */
  ensureSpawnId(data, spawn, index, count) {
    if (!data || typeof data !== 'object') {
      return data
    }
    if (count <= 1 || spawn?.uniqueIds === false) {
      return data
    }

    const baseId = (typeof data.id === 'string' && data.id.trim()) ? data.id.trim() : null
    if (!baseId) {
      return data
    }

    // Default behavior: append ordinal suffix to keep ids unique and readable.
    data.id = `${baseId} #${index + 1}`
    return data
  }

  /**
   * Apply spawn configuration to a data object to produce one instance variant.
   * Supports numeric ranges and pickOne value lists.
   * @param {Object} data base game object data
   * @param {Object} spawn spawn settings
   * @returns {Object} spawned variant data
   */
  applySpawnConfig(data, spawn) {
    const out = this.cloneData(data || {})
    const ranges = (spawn && spawn.ranges) || {}
    const picks = (spawn && spawn.pickOne) || {}

    // Generic override model: apply ranges first, then pickOne choices.
    this.applyRanges(out, ranges)
    this.applyPickOne(out, picks)

    return out
  }

  /**
   * Expand one descriptor into one or many concrete descriptors.
   * When spawn.count > 1, each instance gets its own cloned/configured data.
   * @param {Object|Array} descriptor class descriptor
   * @returns {Array<Object>} concrete descriptor list
   */
  expandDescriptor(descriptor) {
    const normalized = this.normalizeClassDescriptor(descriptor)
    if (!normalized.data) normalized.data = {}

    const spawn = normalized.spawn || {}
    const rawCount = Number(spawn.count)
    const count = Number.isFinite(rawCount) ? Math.max(1, Math.floor(rawCount)) : 1

    // Fast path keeps legacy behavior unchanged for single-instance entries.
    if (count === 1) {
      return [normalized]
    }

    const expanded = []
    for (let i = 0; i < count; i++) {
      const spawnedData = this.applySpawnConfig(normalized.data, spawn)
      this.ensureSpawnId(spawnedData, spawn, i, count)
      expanded.push({
        class: normalized.class,
        data: spawnedData,
      })
    }
    return expanded
  }
  /** End Spawning */

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
