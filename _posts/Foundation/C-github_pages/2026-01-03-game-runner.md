---
layout: post
courses: { csse: {week: 8}, csp: {week: 17}, csa: {week: 20 } }
codemirror: true
title: Game Runner Examples
description: Learn game development using the GameEngine framework in a contained educational environment. Build game levels, add characters, and create interactive experiences with live code editing and debugging controls.
permalink: /rpg/game

---

## Define Game Runner in a Lesson

Game Runner integrates your GameEngine framework for teaching game development. Define **challenge** and **code** variables, then pass them to the include with a unique **runner_id**.

```liquid
{% raw %}{% capture challenge1 %}
Create a basic game level with a player character. Use the GameEngine to set up the desert background and Chill Guy player!
{% endcapture %}

{% capture code1 %}
import GameEnvBackground from '/assets/js/GameEngine/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEngine/gameObjects/Player.js';
import Npc from '/assets/js/GameEngine/gameObjects/Npc.js';
import Barrier from '/assets/js/adventureGame/Barrier.js';

class CustomLevel {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const bgData = {
      name: 'custom_bg',
      src: path + "/images/gamebuilder/alien_planet.jpg",
      pixels: { height: 600, width: 1000 }
    };
    const playerData = {
      id: 'Hero',
      src: path + "/images/gamify/chillguy.png",
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 100, y: 300 },
      pixels: { height: 512, width: 384 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      downLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
      left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
      up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
      upRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };
    const npcData1 = {
      id: 'NPC',
      greeting: '',
      src: path + "/images/gamify/r2_idle.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 500, y: 300 },
      pixels: { height: 223, width: 505 },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [''],
      reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
      interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
    };

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 }
    ];
  }
}
export const gameLevelClasses = [CustomLevel];
// Export for game runner
export { GameControl };
{% endcapture %}

{% include game-runner.html 
   runner_id="game1"
   challenge=challenge1
   code=code1
   height="200px"
%}{% endraw %}
```

### Parameters

- **runner_id** (required): Unique ID for each runner on the page (e.g., "game1", "game2")
- **challenge**: Variable containing the challenge/instruction text
- **code**: Variable containing the game setup JavaScript code
- **height** (optional): Editor height (defaults to "300px")

### Game Runner Architecture

#### HTML Component

- File: `_includes/game-runner.html`
- Reusable component for GameEngine integration
- Automatically creates gameContainer and gameCanvas
- Provides game controls: Start, Pause/Resume, Stop, Reset
- Level selector dropdown for switching between game levels

#### SCSS Styling

- Main file: `_sass/open-coding/forms/game-runner.scss`
- Uses runner-base mixin for consistency
- Game output constrained to 400-600px height for education
- Canvas automatically sized and centered
- Color-coded buttons: Green (Start), Yellow (Pause), Red (Stop)

#### Game Output Area

The game renders in a constrained canvas for educational purposes:
- Min height: 400px
- Max height: 600px
- Canvas max height: 580px
- Black background with accent-colored border
- Automatically centers the canvas
- Scrollable if content exceeds container

#### Controls

- **▶ Start**: Runs the game code and starts the game engine
- **⏸ Pause / ▶ Resume**: Pauses and resumes game execution
- **■ Stop**: Stops the game and clears the canvas
- **↻ Reset**: Resets code to original and stops the game
- **Level Selector**: Dropdown to switch between game levels
- **📋 Copy**: Copy code to clipboard
- **🗑️ Clear**: Clear the editor

#### Code Structure

Your game code must export two things:
1. **GameControl**: Your GameControl class (usually imported)
2. **gameLevelClasses**: Array of game level classes

```javascript
import GameControl from '/assets/js/GameEngine/essentials/GameControl.js';
import GameLevelBasic from '/assets/js/adventureGame/GameLevelBasic.js';

export const GameControl = GameControl;
export const gameLevelClasses = [GameLevelBasic];
```

---

## Basic Game: Copied from GameBuilder 

{% capture challenge1 %}
Run the basic game. Use WASD or arrow keys to move Chill Guy around the desert. Walk up to R2D2 to trigger an interaction!
{% endcapture %}

{% capture code1 %}
// Import for GameRunner
import GameControl from '/assets/js/GameEngine/essentials/GameControl.js';
// Import GameEngine modules
import GameEnvBackground from '/assets/js/GameEngine/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEngine/gameObjects/Player.js';
import Npc from '/assets/js/GameEngine/gameObjects/Npc.js';
import Barrier from '/assets/js/adventureGame/Barrier.js';

class CustomLevel {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const bgData = {
      name: 'custom_bg',
      src: path + "/images/gamebuilder/alien_planet.jpg",
      pixels: { height: 600, width: 1000 }
    };
    const playerData = {
      id: 'Hero',
      src: path + "/images/gamify/chillguy.png",
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 100, y: 300 },
      pixels: { height: 512, width: 384 },
      orientation: { rows: 4, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      downLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
      left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
      up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
      upRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3, rotate: -Math.PI/16 },
      upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3, rotate: Math.PI/16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };
    const npcData1 = {
      id: 'NPC',
      greeting: '',
      src: path + "/images/gamify/r2_idle.png",
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 500, y: 300 },
      pixels: { height: 223, width: 505 },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: [''],
      reaction: function() { if (this.dialogueSystem) { this.showReactionDialogue(); } else { console.log(this.greeting); } },
      interact: function() { if (this.dialogueSystem) { this.showRandomDialogue(); } }
    };

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: playerData },
      { class: Npc, data: npcData1 }
    ];
  }
}
export const gameLevelClasses = [CustomLevel];
// Export for game runner
export { GameControl };
{% endcapture %}

{% include game-runner.html
   runner_id="game1"
   challenge=challenge1
   code=code1
   height="150px"
%}

## Best Practices

### Import Structure

Always import necessary GameEngine modules:
```javascript
import GameControl from '/assets/js/GameEngine/essentials/GameControl.js';
import GameLevelBasic from '/assets/js/adventureGame/GameLevelBasic.js';
```

### Export Requirements

Your code must export:
```javascript
export { GameControl };
export const gameLevelClasses = [GameLevelBasic, GameLevelWater];
```

### Level Class Structure

Each level class needs a constructor that defines:
- Background data
- Player/character data
- NPC data
- Collectible items
- The `this.classes` array with all game objects

### Game Controls

- **WASD or Arrow Keys**: Move the player
- **Space**: Jump (if implemented in level)
- **E or Enter**: Interact with NPCs
- **Esc**: Pause menu (if implemented)

### Debugging

Use the game controls to debug:
- **Pause**: Stop to examine game state
- **Stop**: Clear and restart fresh
- **Reset**: Restore original code
- **Console**: Check browser console (F12) for errors

---

## Teaching Tips

### Progressive Learning Path

1. **Run Existing Levels**: Start with GameLevelBasic
2. **Multi-Level Games**: Add multiple levels with selector
3. **Modify Levels**: Change player position, speed, sprites
4. **Custom Levels**: Create entirely new levels
5. **Add Interactions**: Add NPCs with dialogue
6. **Game Mechanics**: Implement collectibles, enemies, physics

### Common Modifications

**Change Player Start Position:**
```javascript
INIT_POSITION: { x: 200, y: 300 }
```

**Adjust Player Speed:**
```javascript
STEP_FACTOR: 500  // Faster movement
```

**Different Background:**
```javascript
src: path + "/images/gamify/water.png"
```

### Game Development Concepts

The GameEngine teaches:
- **Object-Oriented Programming**: Classes, inheritance, composition
- **Game Loop**: Update and render cycles
- **Sprite Animation**: Frame-based animation
- **Collision Detection**: Hitboxes and interaction
- **Event Handling**: Keyboard input, user interactions
- **State Management**: Game state, level transitions

### Troubleshooting

**Game won't start:**
- Check console for import errors
- Verify all import paths start with `/assets/`
- Ensure exports are correct

**Player not moving:**
- Check keypress configuration
- Verify STEP_FACTOR is set
- Check hitbox doesn't block movement

**Canvas is blank:**
- Verify background image path
- Check canvas dimensions
- Look for JavaScript errors in console
