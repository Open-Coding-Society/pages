# Essentials

This folder contains **core utility classes** that provide the foundational building blocks for all games built with BetterGameEngine. These are low-level tools for math operations, positioning, and collision detection that other game components depend on.

---

## What's Inside

The essentials folder has three main files:

- **Vectors.js** - 2D vector math (positions, velocities, directions)
- **Transform.js** - Position and size management for game objects
- **Collision.js** - Collision detection between objects

These three utilities work together to handle the fundamental operations that games need: tracking where things are, moving them around, and detecting when they touch.

---

## What Do They Do?

**Vectors** provide math operations on 2D coordinates. Any game needs to do math with positions and movement, and Vec2 handles that.

**Transform** stores the essential data about each game object: where it is, how fast it's moving, and how big it is. Every game object (player, enemy, platform, collectible) needs a Transform.

**Collision** checks if objects are touching. When you need to know if the player hit an enemy, stepped on a platform, or picked up a coin, you use the collision detection tools.

---

## How They Work Together

```
Vec2 (math)
  ↓ used by
Transform (position + size + velocity)
  ↓ used by  
Collision (detect overlaps)
```

All three are used by the higher-level game objects and features. You'll import them into your Player, Enemy, Platform, and other game classes to give them the ability to exist in the game world and interact.

---

## Why Separate These Out?

These essentials are separated into their own folder because:

1. **Reusable** - Any game engine needs these foundational tools
2. **Focused** - Each file does one thing well
3. **Independent** - They don't depend on game-specific logic
4. **Testable** - Easy to verify they work correctly
5. **Clean** - Your game code stays focused on game logic, not low-level math

---

## Quick Overview

| File | What It Does |
|------|--------------|
| **Vectors.js** | Add, subtract, multiply vectors; calculate distances and lengths |
| **Transform.js** | Store position, velocity, and size for game objects |
| **Collision.js** | Check if rectangular or circular objects are touching |

---

## See Also

- [Features README](../features/README.md) - Optional add-on features built on top of essentials
- [Game Templates](../GameTempletes/README.md) - How to structure your game code
