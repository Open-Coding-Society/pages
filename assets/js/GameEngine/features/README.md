# Features Folder

This folder contains **optional add-on features** that enhance your game with pause menus, scoring, leaderboards, physics, dialogue, and more. Unlike essentials (which every game needs), features are optional—use only what your game requires.

---

## Main Features

### 1. **PauseFeature.js** - Pause/Resume Logic
**Purpose:** Handles the core pause and resume functionality without UI.

**Main Class:** `PauseFeature`

**Key Features:**
- Pause/resume game functionality
- Works with GameControl pause/resume methods
- Can be used standalone or integrated with other UI

**Key Methods:**
- `show()` - Pause the game
- `hide()` - Resume the game
- `toggle()` - Switch between paused/resumed

**Usage:**
```javascript
import PauseFeature from '../../GameEngine/features/PauseFeature.js';

// Create pause feature
const pauseFeature = new PauseFeature(gameControl);

// Control pause state
pauseFeature.show();   // Pause
pauseFeature.hide();   // Resume
pauseFeature.toggle(); // Toggle
```

---

// Create score feature (pass a minimal config object)
const scoreConfig = {
  gameControl: gameControl,
  options: { parentId: 'gameContainer' },
  counterVar: 'coinsCollected',
  counterLabelText: 'Coins Collected'
};

const scoreFeature = new ScoreFeature(scoreConfig);
scoreFeature.saveScore(buttonElement);
// Shows "Saving..." then success/failure alert
```

---

### 3omatic game name detection from URL
- Backend communication and error handling
- Score display counter

**Usage:**
```javascript
import ScoreFeature from '../../GameEngine/features/ScoreFeature.js';

const scoreFeature = new ScoreFeature(pauseMenu);
scoreFeature.saveScore(buttonElement);
// Shows "Saving..." then success/failure alert
```

---

### 4. **Leaderboard.js** - Score Display and Rankings
**Purpose:** Displays player scores and rankings from backend.

**Main Class:** `Leaderboard`

**Features:**
- Shows top scores globally or per game
- Two modes: 'dynamic' (backend) and 'elementary' (local)
- Real-time updates
- Colorful gradient styling

**Usage:**
```javascript
import Leaderboard from '../../GameEngine/features/Leaderboard.js';

const leaderboard = new Leaderboard(gameControl, {
  gameName: 'AdventureGame',
  parentId: 'gameContainer',
  mode: 'dynamic' // or 'elementary'
});
4. **LevelSkipFeature.js** - Skip Level Functionality
**Purpose:** Allows players to skip the current level and move to the next one.

**Main Class:** `LevelSkipFeature`

**Usage:**
```javascript
import LevelSkipFeature from '../../GameEngine/features/LevelSkipFeature.js';

// Create level skip feature
const skipFeature = new LevelSkipFeature(gameControl);

// Skip to next level
skipFeature.skipLevel();
```

---

### 5ge:**
```javascript
// Usually built into PauseMenu, but can be used standalone
pauseMenu.skipLevel();
```

---

### 6. **TouchControls.js** - Mobile Touch Input
**Purpose:** Provides touch input handling for mobile devices.

**Features:**
- Touch movement controls
- Ta6-to-jump
- Mobile-optimized input

---

### 7. **DialogueSystem.js** - NPC Dialogue and Story
**Purpose:** Manages NPC dialogue, story progression, and conversation trees.

**Features:**
- Display dialogue boxes
- Multiple dialogue options
- Story progression tracking
- Character interactions

**Usage:**
```javascript
import DialogueSystem from '../../GameEngine/features/DialogueSystem.js';

const dialogue = new DialogueSystem(npc, player);
dialogue.startConversation();
```

---

### 7. **RigidBody.js** - Physics Simulation
**Purpose:** Provides physics simulation including gravity, velocity, and collision response.

**Main Class:** `RigidBody`

**Features:**
- Gravity simulation
- Mass-based movement
- Friction (static and kinetic)
- Force calculations
- Impulse-based collisions

**Usage:**
```javascript
import { RigidBody } from '../../GameEngine/features/RigidBody.js';

const rigidBody = new RigidBody(transform, mass = 1, fixed = false);
rigidBody.LinearForce(force = 50, direction = 45);
```

---

## Subfolders

### **rendering/**
Visual effects and rendering features

- **BackgroundParallax.js** - Parallax scrolling backgrounds for depth effect

**Usage:**
```javascript
import BackgroundParallax from '../../GameEngine/features/rendering/BackgroundParallax.js';

const parallax = new BackgroundParallax(gameEnv, [
  { image: 'bg-far.png', speed: 0.3 },
  { image: 'bg-mid.png', speed: 0.6 },
  { image: 'bg-near.png', speed: 0.9 }
]);
```

---

### **systems/**
Game system utilities

- **InteractionManager.js** - Manages interactions between game objects (talking, picking up items, etc.)

**Usage:**
```javascript
import InteractionManager from '../../GameEngine/features/systems/InteractionManager.js';

const interactions = new InteractionManager(player, gameObjects);
interactions.checkInteractions(); // Each frame
```

---

## How to Use Features in Your Game

### Option 1: Import Individual Features
```javascript
// Just what you need
import ScoreFeature from '../../GameEngine/features/ScoreFeature.js';
import Leaderboard from '../../GameEngine/features/Leaderboard.js';
import { RigidBody } from '../../GameEngine/features/RigidBody.js';
```

### Option 3: Mix and Match
```javascript
// Use some features, skip others
import PauseMenu from '../../GameEngine/features/PauseMenu.js';
import DialogueSystem from '../../GameEngine/features/DialogueSystem.js';
import { BackgroundParallax } from '../../GameEngine/features/rendering/BackgroundParallax.js';
```

---Import just what you need
import PauseFeature from '../../GameEngine/features/PauseFeature.js';
import ScoreFeature from '../../GameEngine/features/ScoreFeature.js';
import Leaderboard from '../../GameEngine/features/Leaderboard.js';
import { RigidBody } from '../../GameEngine/features/RigidBody.js';

// Set up in your game
const pauseFeature = new PauseFeature(gameControl);
const scoreFeature = new ScoreFeature(scoreConfig);
```

### Option 2: Mix and Match
```javascript
// Use some features, skip others
import DialogueSystem from '../../GameEngine/features/DialogueSystem.js';
import { BackgroundParallax } from '../../GameEngine/features/rendering/BackgroundParallax.js';
import LevelSkipFeature from '../../GameEngine/features/LevelSkipFeature

RigidBody (standalone)
  └─ Feature (standalone)
  └─ Works with GameControl

ScoreFeature (standalone)
  └─ Saves scores to backend

LevelSkipFeature (standalone)
  └─ Works with GameControl

Leaderboard (standalone)
  └─ Uses scores from ScoreFeature/backend

BackgroundParallax (standalone)
  └─ Renders visual layers

TouchControls (standalone)
  └─ Handles mobile input
```

---

## Quick Reference

| Feature | Purpose | Optional |
|---------|---------|----------|
| **PauseMenu** | Complete pause system | Yes |
| **PauseFeature** | Pause/resume | Yes |
| **ScoreFeature** | Score saving | Yes |
| **Leaderboard** | Score display | Yes |
| **LevelSkipFeature** | Skip level | Yes |
| **DialoBody** | Physics | Yes |
| **TouchControls** | Mobile input | Yes |
| **BackgroundParallax** | Parallax scrolling | Yes |
| **InteractionManager** | Object interactions | Yes |

---

## See Also

- [Essentials README](../essentials/README.md) - Required core files
- [Game Objects README](../gameObjects/README.md) - Reusable entity classes
- [Game Templates](../GameTempletes/README.md) - How to structure your game
