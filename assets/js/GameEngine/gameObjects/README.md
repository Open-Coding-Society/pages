# Game Objects Folder

This folder contains **reusable entity classes** for common game characters and collectibles. These classes extend the core `Character` and `GameObject` classes from essentials with game-specific behavior.

Unlike essentials (required) or features (optional), game objects are **building blocks you extend**—copy these and modify them for your own game objects, or use them as-is in your games.

---

## What's Inside

### Player Classes
- **Player.js** - The playable character controlled by keyboard/touch input

**Features:**
- Keyboard movement (WASD, Arrow keys)
- Jump mechanics
- Collision handling
- Animation support

**Usage:**
```javascript
import Player from '../../GameEngine/gameObjects/Player.js';

const player = new Player(gameEnv, x, y, 'assets/sprites/player.png');
player.setSpeed(5);
```

---

### Enemy Classes
- **Enemy.js** - Basic enemy with AI movement and collision

**Features:**
- Autonomous movement
- Player collision detection
- Damage on contact
- Respawn mechanics

**Usage:**
```javascript
import Enemy from '../../GameEngine/gameObjects/Enemy.js';

const enemy = new Enemy(gameEnv, x, y, 'assets/sprites/enemy.png');
enemy.setMovementPattern('patrol', [x1, x2]); // Patrol between points
```

---

### NPC Classes
- **Npc.js** - Non-playable characters for dialogue and interaction

**Features:**
- Dialogue system integration
- Player interaction detection
- Stationary or patrol movement
- Quest/story integration

**Usage:**
```javascript
import Npc from '../../GameEngine/gameObjects/Npc.js';

const npc = new Npc(gameEnv, x, y, 'assets/sprites/npc.png');
npc.setDialogue([
  'Hello traveler!',
  'Want to hear a story?'
]);
```

---

### Collectible Classes
- **Collectible.js** - Pickup items (coins, power-ups, keys, etc.)

**Features:**
- Auto-collection on player touch
- Score/stat updates
- Visual effects
- Respawn timers

**Usage:**
```javascript
import Collectible from '../../GameEngine/gameObjects/Collectible.js';

const coin = new Collectible(gameEnv, x, y, 'coin', 10);
coin.onCollect = (player) => {
  player.coins += 10;
};
```

---

### AI Subfolder
- **ai/AiNpc.js** - Intelligent NPCs with advanced pathfinding and behavior

**Features:**
- Pathfinding algorithms
- Complex behavior trees
- State machine patterns
- Evasion and pursuit logic

**Usage:**
```javascript
import AiNpc from '../../GameEngine/gameObjects/ai/AiNpc.js';

const aiNpc = new AiNpc(gameEnv, x, y, 'assets/sprites/npc-smart.png');
aiNpc.setBehavior('chase_player'); // Or 'patrol', 'flee', 'idle'
```

---

## How They're Built

All game objects follow this inheritance pattern:

```
GameObject (base class from essentials)
    ↓
Character (extends GameObject with animation)
    ↓
┌───────┬───────┬──────────┬────────────┐
Player  Enemy   Npc    Collectible   AiNpc
```

Each class:
1. **Extends Character** (or GameObject for simple objects)
2. **Uses Transform** for position and physics
3. **Uses Collision** for interactions
4. **Uses Animation** for visual feedback
5. **Integrates with GameControl** for game events

---

## Creating Your Own Game Objects

### Simple Object (copy and modify):
```javascript
import Character from '../../GameEngine/essentials/Character.js';

export default class MyCustomEnemy extends Character {
  constructor(gameEnv, x, y, imagePath) {
    super(gameEnv, x, y, imagePath);
    this.health = 100;
    this.speed = 3;
  }
  
  update() {
    // Custom update logic
    super.update();
  }
  
  onCollisionWith(other) {
    if (other.constructor.name === 'Player') {
      other.takeDamage(10);
    }
  }
}
```

### Using Your Custom Object:
```javascript
import MyCustomEnemy from './MyCustomEnemy.js';

class MyGameLevel {
  init() {
    const enemy = new MyCustomEnemy(this.gameEnv, 100, 200, 'enemy.png');
    this.gameObjects.push(enemy);
  }
}
```

---

## Common Patterns

### Pattern 1: Patrolling Enemy
```javascript
class PatrolEnemy extends Enemy {
  constructor(gameEnv, x, y, imagePath) {
    super(gameEnv, x, y, imagePath);
    this.waypoints = [x, x + 200]; // Patrol between two points
    this.currentWaypoint = 0;
  }
  
  update() {
    const target = this.waypoints[this.currentWaypoint];
    if (this.transform.position.x < target) {
      this.transform.velocity.x = this.speed;
    } else {
      this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
    }
    super.update();
  }
}
```

### Pattern 2: Collectible with Effect
```javascript
class PowerUpCoin extends Collectible {
  constructor(gameEnv, x, y) {
    super(gameEnv, x, y, 'power-up', 50);
    this.effectType = 'speed-boost';
  }
  
  onCollect(player) {
    super.onCollect(player);
    player.speed *= 1.5;
    setTimeout(() => { player.speed /= 1.5; }, 5000);
  }
}
```

### Pattern 3: Boss Enemy
```javascript
class BossEnemy extends Enemy {
  constructor(gameEnv, x, y) {
    super(gameEnv, x, y, 'boss.png');
    this.health = 200;
    this.phase = 1;
    this.attackCooldown = 0;
  }
  
  update() {
    super.update();
    
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
    
    if (this.health < 100) {
      this.phase = 2;
      this.speed *= 1.2;
    }
  }
  
  attack() {
    if (this.attackCooldown === 0) {
      // Create projectile
      this.attackCooldown = 60;
    }
  }
}
```

---

## Integration with Features

### With DialogueSystem:
```javascript
import Npc from '../../GameEngine/gameObjects/Npc.js';
import DialogueSystem from '../../GameEngine/features/DialogueSystem.js';

const merchant = new Npc(gameEnv, 300, 200, 'merchant.png');
const dialogue = new DialogueSystem(merchant, player);
merchant.dialogue = ['Welcome!', 'Buy something?'];
```

### With Collectible Scoring:
```javascript
const coin = new Collectible(gameEnv, 100, 100, 'coin', 1);
coin.onCollect = (player) => {
  gameControl.stats.coinsCollected += 1;
  gameControl.stats.score += 10;
};
```

### With Physics (RigidBody):
```javascript
import { RigidBody } from '../../GameEngine/features/RigidBody.js';

const rigidEnemy = new Enemy(gameEnv, x, y, 'enemy.png');
rigidEnemy.rigidBody = new RigidBody(rigidEnemy.transform, 2, false);
```

---

## Structure Overview

```
gameObjects/
  ├── Player.js          - Playable character
  ├── Enemy.js           - Basic enemy
  ├── Npc.js             - Non-player character
  ├── Collectible.js     - Pickup items
  ├── ai/
  │   └── AiNpc.js       - Smart AI characters
  └── README.md          - This file
```

---

## Quick Reference

| Class | Extends | Purpose | Autonomous |
|-------|---------|---------|-----------|
| **Player** | Character | Playable character | No (player-controlled) |
| **Enemy** | Character | AI enemy | Yes |
| **Npc** | Character | NPC for dialogue | Optional |
| **Collectible** | GameObject | Pickable items | No |
| **AiNpc** | Character | Advanced AI | Yes |

---

## Best Practices

1. **Extend, Don't Modify** - Copy these classes and extend them instead of modifying originals
2. **Keep It Focused** - Each class should do one thing well
3. **Use Inheritance** - Build complex objects from simpler ones
4. **Separate Logic** - Keep update logic separate from rendering
5. **Test Collisions** - Always test collision behavior in your games

---

## See Also

- [Essentials README](../essentials/README.md) - Core classes to extend from
- [Features README](../features/README.md) - Add features to your objects
- [Game Templates](../GameTempletes/README.md) - How to structure your game
- [Adventure Game](../../adventureGame/) - Real examples using these objects
