# Features

This folder contains **add-on features** that can be imported into any game built with BetterGameEngine. These features provide common functionality like pausing, scoring, leaderboards, and physics.

---

## Files Overview

### 1. **PauseMenu.js** - Complete Pause System
**Purpose:** Provides a full pause menu system with pause, resume, score saving, and level skipping functionality.

**Main Class:** `PauseMenu`

**Key Features:**
- Pause/resume game
- Display pause menu UI
- Save scores to backend
- Skip levels
- Track statistics (levels completed, points)

**How It Works:**
1. Creates a DOM container for the pause menu
2. Loads custom CSS styling
3. Integrates with game control system
4. Manages sub-features (PauseFeature, ScoreFeature, LevelSkipFeature)

**Import and Usage:**
```javascript
import PauseMenu from '../../BetterGameEngine/features/PauseMenu.js';

// In your GameControl or Game.js
const pauseMenu = new PauseMenu(gameControl, {
  parentId: 'gameContainer',
  playerName: 'player1',
  counterVar: 'levelsCompleted',
  counterLabel: 'Levels Completed',
  backendUrl: 'http://localhost:8585' // Optional backend URL
});

// Show/hide pause menu
pauseMenu.show();
pauseMenu.hide();
pauseMenu.resume();

// Save score
pauseMenu.saveScore(buttonElement);

// Skip current level
pauseMenu.skipLevel();
```

**Configuration Options:**
```javascript
const options = {
  parentId: 'gameContainer',        // HTML element to attach to
  cssPath: '/assets/css/pause-menu.css', // Custom CSS file
  backendUrl: null,                 // Backend server URL
  playerName: 'guest',              // Player name for tracking
  gameType: 'unknown',              // Game type identifier
  counterVar: 'levelsCompleted',    // Variable to track
  counterLabel: 'Levels Completed', // Display label
  scoreVar: 'score'                 // Score variable name
};
```

---

### 2. **PauseFeature.js** - Pause/Resume Logic
**Purpose:** Handles the core pause and resume functionality.

**Main Class:** `PauseFeature`

**Key Methods:**
- `show()` - Pause the game
- `hide()` - Resume the game
- `resume()` - Alias for hide()
- `toggle()` - Switch between paused/resumed

**When to Use:**
- This is used internally by PauseMenu
- Can be used standalone for simple pause/resume without UI

**How It Connects to PauseMenu:**
```
PauseMenu (main container)
  └─ PauseFeature (handles pause logic)
     └─ Calls gameControl.pause() and gameControl.resume()
```

**Example:**
```javascript
// In your GameControl.js
pause() {
  this.isPaused = true;
  this.cancelAnimationFrame(this.animationFrameId);
}

resume() {
  this.isPaused = false;
  this.gameLoop(); // Restart loop
}

// PauseFeature calls these methods
```

---

### 3. **ScoreFeature.js** - Score Saving and Backend Integration
**Purpose:** Handles saving player scores to a backend server and retrieving game statistics.

**Main Class:** `ScoreFeature`

**Key Methods:**
- `saveScore(buttonEl)` - Save current score to backend
- Automatically extracts game name from URL
- Handles backend communication and authentication

**How It Connects to Leaderboard:**
```
ScoreFeature (saves score)
     ↓
Backend Server (stores score data)
     ↓
Leaderboard (displays saved scores)
```

**Backend Integration:**
- Connects to Java backend for score persistence
- Sends score with player name, game name, and timestamp
- Supports multiple games and players
- Automatically detects game from URL pathname

**How to Use:**
```javascript
// Import ScoreFeature (usually done via PauseMenu)
import ScoreFeature from '../../BetterGameEngine/features/ScoreFeature.js';

// Create score feature
const scoreFeature = new ScoreFeature(pauseMenu);

// Save score when player completes level
const score = 1500;
scoreFeature.saveScore(buttonElement);

// Data sent to backend:
// {
//   playerName: 'player1',
//   gameName: 'AdventureGame',
//   score: 1500,
//   timestamp: '2024-01-28T...'
// }
```

**Backend Communication:**
- Sends POST request to backend API
- Backend stores in database
- Backend returns saved record
- Leaderboard queries backend to display top scores

---

### 4. **Leaderboard.js** - Score Display and Rankings
**Purpose:** Displays player scores and rankings, either from backend or locally.

**Main Class:** `Leaderboard`

**Key Features:**
- Shows top scores globally or per game
- Two modes: 'dynamic' (backend) and 'elementary' (local)
- Embedded in game or floating widget
- Colorful gradient styling
- Real-time updates

**How It Works:**
1. Queries backend for scores
2. Formats and displays rankings
3. Shows player stats and progress
4. Updates when new scores are saved

**Import and Usage:**
```javascript
import Leaderboard from '../../BetterGameEngine/features/Leaderboard.js';

// Create leaderboard
const leaderboard = new Leaderboard(gameControl, {
  gameName: 'AdventureGame',
  parentId: 'gameContainer',
  mode: 'dynamic' // or 'elementary'
});

// Open/close leaderboard
leaderboard.open();
leaderboard.close();
leaderboard.toggle();
```

**Configuration Options:**
```javascript
const options = {
  gameName: 'AdventureGame',  // Game to show scores for
  parentId: 'gameContainer',  // Container element
  mode: 'dynamic'             // 'dynamic' = backend, 'elementary' = local
};
```

**Leaderboard Modes:**

| Mode | Source | Best For |
|------|--------|----------|
| **dynamic** | Backend server | Multi-player, persistent scores |
| **elementary** | Local storage | Solo play, testing, offline |

**How ScoreFeature and Leaderboard Work Together:**
```
Player completes level with score: 1500
           ↓
  pauseMenu.saveScore()
           ↓
  ScoreFeature.saveScore()
           ↓
  Sends POST to backend
           ↓
  Backend stores in database
           ↓
  User opens leaderboard
           ↓
  Leaderboard.queryScores()
           ↓
  Leaderboard displays top 10 scores
```

---

### 5. **LevelSkipFeature.js** - Skip Level Functionality
**Purpose:** Allows players to skip the current level and move to the next one.

**Main Class:** `LevelSkipFeature`

**Key Methods:**
- `skipLevel()` - Skip to next level

**When to Use:**
- Add a "Skip Level" button in pause menu
- Provide difficulty options
- Let players bypass difficult levels

**How It Works:**
```javascript
// Called when player clicks "Skip Level" button
skipLevel() {
  // Hide pause menu
  // Call gameControl.endLevel()
  // Game transitions to next level
}
```

**Usage in PauseMenu:**
```javascript
// PauseMenu has built-in skip level button
pauseMenu.skipLevel(); // Skips current level

// In your HTML/UI
<button onclick="gameControl.pauseMenu.skipLevel()">
  Skip Level
</button>
```

---

### 6. **RigidBody.js** - Physics Simulation
**Purpose:** Provides physics simulation including gravity, velocity, forces, and collisions.

**Main Class:** `RigidBody`

**Key Features:**
- Gravity simulation
- Mass-based movement
- Friction (static and kinetic)
- Force calculations
- Impulse-based collisions
- Weight calculations

**Key Methods:**
- `LinearForce(force, dir)` - Apply force in a direction
- `applyImpulse(J)` - Apply sudden velocity change
- `LinearImpulse(rv, normal, sum, body)` - Handle collision response

**Physics Constants:**
- Gravitational constant (G)
- Speed of light (c)
- Static friction = 0.75
- Kinetic friction = 0.6

**When to Use:**
- Games with gravity (platformers, physics puzzles)
- Realistic movement physics
- Collision response (bouncing, sliding)
- Force-based gameplay (pushing, pulling)

**Import and Usage:**
```javascript
import { RigidBody } from '../../BetterGameEngine/features/RigidBody.js';

// Create rigid body for object
const player = new Transform(100, 200, 30);
const rigidBody = new RigidBody(player, mass = 1, fixed = false);

// Apply force (push player)
rigidBody.LinearForce(force = 50, direction = 45); // 50N at 45 degrees

// Apply gravity each frame
player.velocity = player.velocity.add(new Vec2(0, gravity));
```

---

## Feature Integration Diagram

```
┌─────────────────────────────────────────────────┐
│         Your Game (GameControl)                 │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────────────────┐
       │   PauseMenu       │ (Main container)
       ├───────────────────┤
       │  ├─ PauseFeature     (Pause/Resume)
       │  ├─ ScoreFeature     (Save scores)
       │  └─ LevelSkipFeature (Skip level)
       └───────┬───────────┘
               │
       ┌───────┴────────────┐
       ▼                    ▼
  ┌─────────────┐    ┌──────────────┐
  │  Backend    │    │  Leaderboard │
  │  Server     │    │  (Display)   │
  └─────────────┘    └──────────────┘
```

---

## How to Import Features Into Your Game

### Option 1: Use Full PauseMenu (Recommended)
```javascript
import PauseMenu from '../../BetterGameEngine/features/PauseMenu.js';

// In your Game.js or GameControl.js
const pauseMenu = new PauseMenu(gameControl, {
  playerName: 'player1',
  counterVar: 'levelsCompleted'
});

// All features are included and ready to use
```

### Option 2: Import Individual Features
```javascript
// Just score saving
import ScoreFeature from '../../BetterGameEngine/features/ScoreFeature.js';
const scoreFeature = new ScoreFeature(pauseMenu);

// Just leaderboard
import Leaderboard from '../../BetterGameEngine/features/Leaderboard.js';
const leaderboard = new Leaderboard(gameControl, { gameName: 'MyGame' });

// Just physics
import { RigidBody } from '../../BetterGameEngine/features/RigidBody.js';
const rb = new RigidBody(player, 1, false);
```

### Option 3: Custom Feature Setup
```javascript
// Build exactly what you need
import PauseFeature from '../../BetterGameEngine/features/PauseFeature.js';
import ScoreFeature from '../../BetterGameEngine/features/ScoreFeature.js';

// Create custom pause menu container
class MyCustomPauseMenu {
  constructor(gameControl) {
    this.gameControl = gameControl;
    this.pauseFeature = new PauseFeature(this);
    this.scoreFeature = new ScoreFeature(this);
  }
  
  show() { this.pauseFeature.show(); }
  saveScore() { return this.scoreFeature.saveScore(); }
}
```

---

## Feature Dependencies

```
PauseMenu
  ├─ requires: gameControl
  ├─ uses: PauseFeature
  ├─ uses: ScoreFeature
  │  ├─ requires: backend URL
  │  └─ calls: Backend API
  └─ uses: LevelSkipFeature
     └─ requires: gameControl.endLevel()

Leaderboard
  ├─ requires: gameControl (optional)
  ├─ uses: ScoreFeature data
  └─ queries: Backend API

RigidBody
  ├─ requires: Transform object
  └─ uses: Vec2 for calculations
```

---

## Quick Reference

| Feature | Purpose | Imports From | Used By |
|---------|---------|--------------|---------|
| **PauseMenu** | Complete pause system | Features | Games |
| **PauseFeature** | Pause/resume only | Features | PauseMenu |
| **ScoreFeature** | Score saving | Features | PauseMenu |
| **Leaderboard** | Score display | Features | Games |
| **LevelSkipFeature** | Skip level | Features | PauseMenu |
| **RigidBody** | Physics | Features | Games |

---

## Common Patterns

### Pattern 1: Basic Game with Pause Menu
```javascript
import PauseMenu from '../../BetterGameEngine/features/PauseMenu.js';

class Game {
  constructor() {
    this.pauseMenu = new PauseMenu(this.gameControl);
  }
  
  onKeyPress(key) {
    if (key === 'Escape') {
      this.pauseMenu.toggle();
    }
  }
}
```

### Pattern 2: Save Score and Show Leaderboard
```javascript
import Leaderboard from '../../BetterGameEngine/features/Leaderboard.js';

onLevelComplete() {
  // Save score
  this.pauseMenu.saveScore();
  
  // Show leaderboard
  this.leaderboard.open();
  this.leaderboard.display();
}
```

### Pattern 3: Physics-Based Game
```javascript
import { RigidBody } from '../../BetterGameEngine/features/RigidBody.js';

class Player {
  constructor() {
    this.transform = new Transform(100, 200, 30);
    this.rigidBody = new RigidBody(this.transform, 1);
  }
  
  update() {
    // Apply gravity
    this.transform.velocity.y += 0.6;
    
    // Update position
    this.transform.position = 
      this.transform.position.add(this.transform.velocity);
  }
}
```

---

## Backend Integration

### For ScoreFeature to Work:

1. **Backend must support:**
   - POST endpoint at `/api/scores`
   - Accepts: `{ playerName, gameName, score }`
   - Returns: saved score record

2. **Default endpoints:**
   - `http://localhost:8585` (local development)
   - Production: Set in options

3. **Database schema (example):**
   ```sql
   CREATE TABLE scores (
     id INT PRIMARY KEY,
     playerName VARCHAR(255),
     gameName VARCHAR(255),
     score INT,
     timestamp DATETIME,
     FOREIGN KEY (gameName) REFERENCES games(name)
   );
   ```

---

## See Also

- [Essentials README](../essentials/README.md) - Core math and collision utilities
- [Game Templates](../GameTempletes/README.md) - How to structure your game
- [Adventure Game](../../adventureGame/) - Real working example using features
