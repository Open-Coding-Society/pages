# Game Templates Guide

This folder contains template files to help you create new games using the **BetterGameEngine** framework. Each template file is a blank starting point with detailed comments explaining what should go in each file.

## How to Use These Templates

1. **Copy a template file** to your new game folder
2. **Rename it** to remove the `.template` extension (e.g., `Game.js.template` → `Game.js`)
3. **Follow the TODO comments** in the file to implement each section
4. **Reference the adventure game or mansion game** for working examples of how to structure your code

---

## Core Game Files

### 1. **Game.js** - Main game initialization
**Purpose:** Entry point for your game. Manages overall game state and level progression.

**Key Methods:**
- `static main()` - Initialize and start the game
- `loadNextLevel()` - Transition to the next level
- `returnHome()` - Return to main menu/home screen
- `initUser()` - Initialize player data

**When to Use:**
- One per game
- Import this in your HTML/markdown files to start the game

**Example Import:**
```javascript
import Game from './adventureGame/adventureLogic/Game.js';
Game.main();
```

---

### 2. **GameControl.js** - Game loop manager
**Purpose:** Controls the game loop, level management, and input handling.

**Key Methods:**
- `start()` - Begin the game loop
- `transitionToLevel()` - Load the next level
- `gameLoop()` - Main loop (update, collision, render)
- `pause()` / `resume()` - Pause/unpause the game
- `handleKeyPress()` - Handle keyboard input

**When to Use:**
- One per game
- Called from Game.js to manage core gameplay

---

### 3. **GameLevel.js** - Individual level template
**Purpose:** Base class for creating individual levels.

**Key Methods:**
- `init()` - Initialize the level (create objects, platforms, enemies)
- `createPlayer()` - Spawn the player
- `createEnvironment()` - Create platforms and scenery
- `createEnemies()` - Spawn all enemies
- `createCollectibles()` - Place items to collect
- `update()` - Update all objects each frame
- `render()` - Draw everything to canvas
- `checkCollisions()` - Detect collisions
- `checkLevelCompletion()` - Check if player won

**When to Use:**
- Inherit from this for each level (Level1, Level2, etc.)
- Each game can have multiple levels
- Define level-specific layout and mechanics

**Example:**
```javascript
class Level1 extends GameLevel {
  constructor(game) {
    super(game);
    this.levelName = 'Level 1: Introduction';
  }
  
  init() {
    super.init();
    this.createPlayer();
    this.createEnvironment();
    this.createEnemies();
  }
}
```

---

## Game Object Files

### 4. **Player.js** - The player character
**Purpose:** Represents the player controlled by the user.

**Key Methods:**
- `handleInput(direction)` - Respond to keyboard input
- `update()` - Update position and state
- `collideWithPlatform()` - Landing on platforms
- `collideWithItem()` - Picking up collectibles
- `collideWithEnemy()` - Getting hit by enemies
- `takeDamage()` - Lose health
- `render()` - Draw the player

**Key Properties:**
- `x`, `y` - Position
- `vx`, `vy` - Velocity (movement speed)
- `health` - Current health
- `isGrounded` - Is standing on a platform
- `isJumping` - Currently jumping
- `animationFrame` - Current animation frame

**When to Use:**
- One per game (or one per player if multiplayer)
- Create instance in `GameLevel.createPlayer()`

---

### 5. **Enemy.js** - Enemy characters
**Purpose:** Represents enemies and obstacles.

**Key Methods:**
- `update()` - Update enemy AI and movement
- `updatePatrol()` - Patrol behavior (walk back and forth)
- `updateFlying()` - Flying behavior (hunt player)
- `updateStationary()` - Stationary (spinning spikes, etc.)
- `chasePlayer()` - Hunt the player
- `takeDamage()` - Take damage from player
- `die()` - Death/removal from game
- `render()` - Draw the enemy

**Key Properties:**
- `type` - 'patrol', 'flying', 'stationary', 'boss'
- `health` - Current health
- `speed` - Movement speed
- `detectionRange` - How far can detect player

**When to Use:**
- Create one for each enemy type in your game
- Instantiate in `GameLevel.createEnemies()`
- Can have multiple instances of same enemy class

**Example Enemy Types:**
- **Patrol:** Walks back and forth on a platform
- **Flying:** Flies around and chases player
- **Stationary:** Doesn't move (spikes, saws)
- **Boss:** Larger, more powerful, multi-phase battles

---

### 6. **Collectible.js** - Items to collect
**Purpose:** Represents coins, gems, power-ups, and other collectible items.

**Key Methods:**
- `update()` - Animate bobbing/floating
- `collect()` - Handle being picked up
- `createParticleEffect()` - Burst effect when collected
- `render()` - Draw the item

**Key Properties:**
- `type` - 'coin', 'gem', 'star', 'power-up'
- `value` - Points awarded when collected
- `x`, `y` - Position

**When to Use:**
- Create for each item type
- Place many instances around levels
- Create in `GameLevel.createCollectibles()`

---

### 7. **Platform.js** - Terrain/platforms
**Purpose:** Static and dynamic platforms the player stands on.

**Key Methods:**
- `render()` - Draw the platform
- `getBounds()` - Return hitbox for collision
- `containsPoint()` - Check if point is on platform
- `onPlayerStep()` - Called when player lands on it

**Key Properties:**
- `x`, `y`, `width`, `height` - Position and size
- `type` - 'static', 'moving', 'falling', 'rotating'
- `color` - Appearance

**Platform Types:**
- **Static:** Normal platform
- **Moving:** Slides left/right or up/down
- **Falling:** Falls when player steps on it
- **Rotating:** Spins around
- **Sinking:** Sinks into ground

**When to Use:**
- Create instances in `GameLevel.createEnvironment()`
- Add to `this.staticObjects` array
- Most levels have many platforms

---

## Shared Features from BetterGameEngine

Your game can use these pre-made features without needing to create them:

### **PauseMenu.js**
- Pause/resume game
- Show/hide pause menu UI
- Usage: `import PauseFeature from '../../BetterGameEngine/features/PauseFeature.js'`

### **Leaderboard.js**
- Track high scores
- Display leaderboard
- Usage: `import ScoreFeature from '../../BetterGameEngine/features/ScoreFeature.js'`

### **Collision.js**
- Rectangle and circle collision detection
- Usage: `import Collision from '../../BetterGameEngine/essentials/Collision.js'`
- Methods: `new Collision().boxCollide(obj1, obj2)` and `new Collision().ballCollide(obj1, obj2)`

### **Transform.js**
- Position and rotation utilities
- Usage: `import Transform from '../../BetterGameEngine/essentials/Transform.js'`

### **Vectors.js**
- Vector math utilities
- Usage: `import Vector from '../../BetterGameEngine/essentials/Vectors.js'`

### **RigidBody.js**
- Physics simulation (gravity, velocity)
- Usage: `import RigidBody from '../../BetterGameEngine/features/RigidBody.js'`

---

## Quick Start Steps

1. **Create your game folder:**
   ```
   assets/js/myGame/
   ├── myGameLogic/
   │   ├── Game.js (copy from Game.js.template)
   │   ├── GameControl.js (copy from GameControl.js.template)
   │   ├── Level1.js (extends GameLevel)
   │   ├── Level2.js (extends GameLevel)
   │   ├── Player.js (copy from Player.js.template)
   │   ├── Enemy.js (copy from Enemy.js.template)
   │   ├── Collectible.js (copy from Collectible.js.template)
   │   ├── Platform.js (copy from Platform.js.template)
   │   ├── PauseMenu.js (copy from BetterGameEngine/features)
   │   └── Leaderboard.js (copy from BetterGameEngine/features)
   └── GameControl.js (in root folder)
   ```

2. **Copy the template files** to your myGameLogic folder

3. **Update Game.js:**
   - Change `gameName` to your game name
   - Import your GameControl and custom classes

4. **Create your first level:**
   - Extend GameLevel
   - Implement createPlayer(), createEnvironment(), createEnemies(), etc.

5. **Create your game objects:**
   - Extend Player class
   - Create Enemy subclasses for each enemy type
   - Create Collectible instances

6. **Add keyboard input handling:**
   - Update GameControl.handleKeyPress()
   - Map keys to game actions

7. **Test in browser:**
   - Create HTML/markdown file that imports Game.js
   - Call Game.main() to start

---

## Architecture Pattern

Your game should follow this structure:

```
Game.js (entry point)
  ↓
Game.main() (static method)
  ↓
GameControl (game loop manager)
  ├ start()
  ├ gameLoop()
  │   ├ currentLevel.update()
  │   ├ currentLevel.checkCollisions()
  │   └ currentLevel.render()
  └ transitionToLevel()
      └ currentLevel = new Level1(this)
          ├ Player
          ├ Enemies[]
          ├ Collectibles[]
          └ Platforms[]
```

---

## Tips for Development

### Collision Detection
Use the Collision class from BetterGameEngine:
```javascript
import Collision from '../../BetterGameEngine/essentials/Collision.js';

const collision = new Collision();
// Check if two objects collide (box/rectangle collision)
if (collision.boxCollide(player, platform)) {
  player.collideWithPlatform(platform);
}
```

### Animation
Store animation state in objects:
```javascript
this.currentAnimation = 'run'; // 'idle', 'run', 'jump'
this.animationFrame = 0;
this.animationSpeed = 5; // frames per sprite
```

### Particle Effects
For visual polish (pickups, explosions):
```javascript
createParticleEffect() {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    this.particles.push({
      x: this.x, y: this.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0
    });
  }
}
```

### Sound Effects
```javascript
playSound(filename) {
  const audio = new Audio(`/sounds/${filename}`);
  audio.play();
}
```

---

## Looking for Working Examples?

Check out these actual game implementations:
- **Adventure Game:** `/assets/js/adventureGame/adventureLogic/`
- **Mansion Game:** `/assets/js/mansionGame/MansionLogic/`

Both follow this template structure and show real working code!
