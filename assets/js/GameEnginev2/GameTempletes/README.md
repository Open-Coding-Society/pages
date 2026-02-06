# Game Templates Guide

This folder is a **reference guide** showing you what files you need to create a new game using Engine, with example code and explanations for each.

---

## Getting Started

**Don't copy these templates exactly**—instead, use them as guides to understand what your game needs. Each file explains:
- What it does
- What methods it should have
- How it connects to other files

Then create your own versions tailored to your game's specific needs.

---

## Game Structure Overview

Every game built with GameEngine needs:

```
Your Game
├── Game.js (entry point)
├── GameControl.js (game loop)
├── GameLevel.js classes (your levels)
├── Custom game objects (players, enemies, etc.)
└── HTML/Markdown file to run it
```

These templates show you how to structure each of these files.

---

## The Essential Files Explained

### 1. **Game.js** - Your Game's Entry Point
**What it does:**
- Initializes the game
- Sets up the game environment
- Loads game assets
- Handles overall game setup

**What you need to do:**
1. Create a `Game` class that extends the essentials `Game`
2. Define `main()` static method to start the game
3. Set up your game path and container
4. Load your GameControl and GameLevel classes

**Template structure:**
```javascript
import Game from './GameEngine/essentials/Game.js';

export default class MyGame extends Game {
  constructor() {
    super();
    this.path = '/assets/js/myGame/';
    this.gameContainer = document.getElementById('gameContainer');
  }
  
  static main() {
    const game = new MyGame();
    game.init();
  }
}
```

**In your HTML/Markdown:**
```javascript
import MyGame from './MyGame.js';
MyGame.main();
```

---

### 2. **GameControl.js** - The Game Loop Manager
**What it does:**
- Controls the main game loop (update, collision, render)
- Manages level transitions
- Handles keyboard/touch input
- Tracks game state (paused, current level, etc.)

**What you need to do:**
1. Create a `GameControl` class extending essentials `GameControl`
2. Define your GameLevel classes
3. Implement input handling (keyboard, touch)
4. Set pause menu options (if desired)

**Template structure:**
```javascript
import GameControl from './GameEngine/essentials/GameControl.js';
import GameLevelOne from './GameLevelOne.js';
import GameLevelTwo from './GameLevelTwo.js';

export default class MyGameControl extends GameControl {
  constructor(game, levelClasses) {
    super(game, levelClasses);
    
    // Pause menu options
    this.pauseMenuOptions = {
      counterVar: 'coinsCollected',
      counterLabel: 'Coins Collected',
      counterPerLevel: false
    };
  }
}

// In Game.js:
const levelClasses = [GameLevelOne, GameLevelTwo];
const gameControl = new MyGameControl(game, levelClasses);
```

---

### 3. **GameLevel.js** - Individual Level Templates
**What it does:**
- Defines the layout of each level
- Creates the player, enemies, platforms, obstacles
- Sets up the environment (background, size, etc.)
- Handles level-specific logic

**What you need to do:**
1. Create a `GameLevel` class extending essentials `GameLevel`
2. Use the constructor to set level properties
3. Create all game objects (player, enemies, collectibles, etc.)
4. Set up the visual environment

**Template structure:**
```javascript
import GameLevel from './GameEngine/essentials/GameLevel.js';
import Player from './GameEngine/gameObjects/Player.js';
import Enemy from './GameEngine/gameObjects/Enemy.js';
import Coin from './MyGame/Coin.js'; // Your custom collectible

export default class GameLevelOne extends GameLevel {
  constructor(gameEnv) {
    super(gameEnv);
    
    // Level properties
    this.name = 'Level 1: The Beginning';
    this.width = 800;
    this.height = 600;
    this.backgroundColor = '#87CEEB';
  }
  
  init() {
    // Create player
    const player = new Player(this.gameEnv, 100, 500, 'player.png');
    this.gameObjects.push(player);
    
    // Create enemies
    const enemy1 = new Enemy(this.gameEnv, 300, 400, 'enemy.png');
    this.gameObjects.push(enemy1);
    
    // Create collectibles
    const coin = new Coin(this.gameEnv, 250, 300);
    this.gameObjects.push(coin);
  }
}
```

---

### 4. **Custom Game Objects** - Players, Enemies, Collectibles
**What they do:**
- Define specific types of game entities
- Extend the base classes from gameObjects folder
- Implement custom behavior

**What you need to do:**
1. Extend `Player`, `Enemy`, `Npc`, or `Collectible` from gameObjects
2. Add game-specific properties and methods
3. Implement custom update logic

**Template structure:**
```javascript
import Collectible from './GameEngine/gameObjects/Collectible.js';

export default class Coin extends Collectible {
  constructor(gameEnv, x, y) {
    super(gameEnv, x, y, 'coin', 1);
    this.value = 10; // Points per coin
  }
  
  onCollect(player) {
    player.coins += 1;
    gameControl.stats.coinsCollected += 1;
  }
}
```

---

## Complete Example: Your First Game

Here's a minimal working game structure:

### Game.js
```javascript
import Game from './GameEngine/essentials/Game.js';
import GameControl from './GameEngine/essentials/GameControl.js';
import GameLevelOne from './GameLevelOne.js';

export default class MyFirstGame extends Game {
  constructor() {
    super();
    this.path = '/assets/js/myFirstGame/';
    this.gameContainer = document.getElementById('gameContainer');
  }
  
  async init() {
    await super.init();
    
    const levelClasses = [GameLevelOne];
    this.gameControl = new GameControl(this, levelClasses);
    this.gameControl.start();
  }
  
  static main() {
    const game = new MyFirstGame();
    game.init();
  }
}
```

### GameLevelOne.js
```javascript
import GameLevel from './GameEngine/essentials/GameLevel.js';
import Player from './GameEngine/gameObjects/Player.js';
import Enemy from './GameEngine/gameObjects/Enemy.js';

export default class GameLevelOne extends GameLevel {
  constructor(gameEnv) {
    super(gameEnv);
  }
  
  init() {
    // Create player
    const player = new Player(this.gameEnv, 100, 500, 'player.png');
    this.gameObjects.push(player);
    
    // Create enemy
    const enemy = new Enemy(this.gameEnv, 400, 400, 'enemy.png');
    this.gameObjects.push(enemy);
  }
}
```

### In your HTML/Markdown
```html
<div id="gameContainer" style="width: 800px; height: 600px; border: 1px solid black;"></div>

<script type="module">
  import MyFirstGame from '/assets/js/myFirstGame/Game.js';
  MyFirstGame.main();
</script>
```

---

## How It All Connects

```
HTML/Markdown loads...
     ↓
Game.main() creates Game instance
     ↓
Game.init() creates GameControl
     ↓
GameControl starts game loop
     ↓
Game loop updates GameLevel
     ↓
GameLevel.init() creates game objects (Player, Enemy, Coin)
     ↓
Game loop runs continuously:
  1. update() - Move objects, check input
  2. checkCollisions() - Detect impacts
  3. render() - Draw everything
```

---

## Adding Optional Features

Once your basic game works, add features from the features folder:

### Add Pause Menu
```javascript
import PauseMenu from './GameEngine/features/PauseMenu.js';

class MyGameControl extends GameControl {
  constructor(game, levelClasses) {
    super(game, levelClasses);
    this.pauseMenu = new PauseMenu(this, {
      playerName: 'player1',
      counterVar: 'coinsCollected'
    });
  }
}
```

### Add Physics
```javascript
import { RigidBody } from './GameEngine/features/RigidBody.js';

// In your level:
const player = new Player(...);
player.rigidBody = new RigidBody(player.transform, 1, false);
```

### Add Dialogue
```javascript
import DialogueSystem from './GameEngine/features/DialogueSystem.js';

const npc = new Npc(...);
const dialogue = new DialogueSystem(npc, player);
npc.dialogue = ['Hello!', 'Nice to meet you!'];
```

---

## Common Mistakes to Avoid

1. **Forgetting to add objects to gameObjects array**
   ```javascript
   // Wrong - object created but never added
   const enemy = new Enemy(this.gameEnv, 300, 400, 'enemy.png');
   
   // Right - object added to level
   const enemy = new Enemy(this.gameEnv, 300, 400, 'enemy.png');
   this.gameObjects.push(enemy);
   ```

2. **Importing from wrong paths**
   ```javascript
   // Wrong - essentials are in essentials folder, not gameObjects
   import Player from './GameEngine/essentials/Player.js';
   
   // Right - Player is in gameObjects
   import Player from './rGameEngine/gameObjects/Player.js';
   ```

3. **Forgetting super.init() or super.update()**
   ```javascript
   // Wrong - parent class logic not called
   init() {
     // Creates objects but parent setup is skipped
   }
   
   // Right - parent initialization is called
   init() {
     super.init();
     // Then add your custom objects
   }
   ```

4. **Not setting game path correctly**
   ```javascript
   // Wrong - path is inconsistent with actual file location
   this.path = '/assets/js/myGame/'; // But files are in /assets/js/adventure/
   
   // Right - path matches your actual file structure
   this.path = '/assets/js/adventure/';
   ```

---

## File Checklist for Your Game

- [ ] Game.js - Entry point that extends essentials Game
- [ ] GameControl.js - Game loop manager extending essentials GameControl
- [ ] At least one GameLevel class extending essentials GameLevel
- [ ] Custom game objects (at minimum: Player class)
- [ ] HTML or Markdown file with game runner code
- [ ] Asset folder with images (sprites, backgrounds, etc.)

---

## What's NOT in This Folder

This folder **doesn't contain**:
- Complete working games (see adventure game folder for real examples)
- Asset files (images, sounds, etc.)
- Game-specific logic (that's your job!)

---

## Real Working Examples

For complete working examples, check out:
- **Adventure Game** - `/assets/js/adventureGame/` - Full featured game with multiple levels
- **Mansion Game** - `/assets/js/mansionGame/` - Another complete game with different mechanics

Study these to see how everything connects in a real project!

---

## Next Steps

1. **Create your Game.js** - Copy the structure above, change class name and path
2. **Create your GameLevel.js** - Define your first level layout
3. **Create your game objects** - Custom Player, Enemy, or Collectible classes as needed
4. **Add to HTML** - Load your Game.js and call Game.main()
5. **Test** - Open in browser and play!
6. **Add features** - Use PauseMenu, Leaderboard, Physics, etc. as needed

---

## See Also

- [Essentials README](../essentials/README.md) - Core classes you extend
- [Game Objects README](../gameObjects/README.md) - Entity classes you use
- [Features README](../features/README.md) - Optional add-on features
