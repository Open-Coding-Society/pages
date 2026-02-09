# Essentials Folder

This folder contains **core engine files** that are **required to run any game** built with GameEngine. Every game needs these foundational classes to function.

---

## What's Inside

### Core Classes
- **GameObject.js** - Base class for all game objects (players, enemies, platforms, collectibles)
- **Character.js** - Extended GameObject for characters (players, NPCs, enemies) with animation support
- **Game.js** - Main entry point and initialization for the game
- **GameControl.js** - Game loop manager, level transitions, and input handling
- **GameLevel.js** - Base class for creating individual levels
- **GameEnv.js** - Game environment settings and canvas management
- **GameEnvBackground.js** - Background and environment visuals
- **Background.js** - Reusable background/scenery component

### Utilities
- **Vectors.js** - 2D vector math for positions, velocities, and directions
- **Transform.js** - Position, size, and velocity data for objects
- **Collision.js** - Collision detection between game objects

---

## How They Work Together

```
Game.js (entry point)
  ↓ creates
GameControl.js (game loop)
  ↓ manages
GameLevel.js (per-level logic)
  ↓ contains
GameObject.js / Character.js (game objects)
  ↓ use
Transform.js, Vectors.js, Collision.js (utilities)
```

**Every game you build needs all of these files.** They're the minimum required to:
- Initialize and run the game
- Create and manage game objects
- Handle collisions
- Control the game loop
- Manage level progression

---

## Why These Are Essential

1. **Required** - Every game built with this engine uses all of these
2. **Foundational** - They provide the core game engine functionality
3. **Reusable** - They work with any game you build on top of them
4. **Stable** - These shouldn't change when building different games

---

## Getting Started

All games import from essentials like this:

```javascript
import Game from './GameEngine/essentials/Game.js';
import GameControl from './GameEngine/essentials/GameControl.js';
import GameLevel from './GameEngine/essentials/GameLevel.js';
```

Then build your game-specific classes on top of these essentials.
