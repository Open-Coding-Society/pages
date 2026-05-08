---
layout: post
title: Peppa Pig Game 
description: Example of how to document a level while building a team gamify project
category: Gamify
breadcrumb: true
permalink: /peppa-pig/doc
---

## Why Document Your Work

Teams often remember what they built, but forget the exact steps, files, tests, and decisions that got them there.
This page is a sample of the kind of project documentation your team should create while working.

Keep documentation lightweight and useful:

- What did we change?
- Why did we change it?
- What files did we touch?
- How did we test it?
- What should happen next?

# Peppa Pig Game Features

This document explains the key features implemented in the Peppa Pig game, focusing on multiplayer support, character customization, data persistence, and collision detection.

## Multiplayer (2-Player Mode)

The Peppa Pig game supports local multiplayer with two players using different control schemes.

### Game Mode Detection
```javascript
// Game mode: 'singlePlayer' or 'twoPlayer' (from welcome screen or config)
// First check config, then check localStorage (from welcome screen), default to singlePlayer
this.gameMode = config.gameMode ?? localStorage.getItem('peppaGameMode') ?? 'singlePlayer';
```

### Player 2 Setup
```javascript
// Player 2 for 2-player mode (different keybinds)
const sprite_data_player2 = {
    id: p2CharName,
    greeting: `${p2CharName} joins the battle!`,
    src: `${path}/images/projects/peppa-pig/${p2CharImage}`,
    SCALE_FACTOR: 4,
    STEP_FACTOR: 1100,
    ANIMATION_RATE: 12,
    INIT_POSITION: this.player2Spawn,
    keypress: { up: 38, left: 37, down: 40, right: 39 }, // Arrow keys
    hitbox: { widthPercentage: 0.4, heightPercentage: 0.6 },
    playerDamage: config.playerDamage ?? 1,
    playerSpeedMultiplier: config.playerSpeedMultiplier ?? 1,
    playerHealth: config.playerHealth ?? 4
};

// Add Player 2 if 2-player mode
if (this.gameMode === 'twoPlayer') {
    this.classes.push({ class: Player, data: sprite_data_player2 });
}
```

### Player 2 Attack Controls
```javascript
// Player 2 attack with Enter key (2-player mode only)
if (this.gameMode === 'twoPlayer' && event.code === 'Enter') {
    this.player2AttackRequested = true;
    event.preventDefault();
}
```

### HUD Controls Display
```javascript
// Add controls display for 2-player mode
if (this.gameMode === 'twoPlayer') {
    hudHtml += `
    <div style="margin-bottom:8px; font-size:12px; border-top:1px solid rgba(255,255,255,0.2); padding-top:6px;">
        <div style="font-weight:600; margin-bottom:4px;">Controls:</div>
        <div>P1: WASD + SPACE</div>
        <div>P2: Arrows + Enter</div>
    </div>`;
}
```

## Character Swap (Character Selection)

Players can choose from different Peppa Pig characters before starting the game.

### Character Data Loading
```javascript
// Read character selections saved by the welcome/character-select screen
const p1CharImage = localStorage.getItem('peppaPlayer1CharImage') || 'ishan-jha.png';
const p1CharName  = localStorage.getItem('peppaPlayer1CharName')  || 'Ishan';
const p2CharImage = localStorage.getItem('peppaPlayer2CharImage') || 'ishan-jha.png';
const p2CharName  = localStorage.getItem('peppaPlayer2CharName')  || 'Player 2';

const p1Image = this.gameMode === 'twoPlayer' ? p1CharImage : 'ishan-jha.png';
const p1Name  = this.gameMode === 'twoPlayer' ? p1CharName  : 'Ishan';
```

### Character Selection Screen
```javascript
selectMode(mode) {
    this.selectedMode = mode;
    localStorage.setItem('peppaGameMode', mode);

    if (mode === 'twoPlayer') {
        this.fadeOut('peppa-welcome-wrapper', () => this.createCharacterSelectScreen());
    } else {
        this.fadeOut('peppa-welcome-wrapper', () => this.startGame());
    }
}
```

### Character Saving
```javascript
selectCharacter(char, playerNum, accentColor) {
    const charData = {
        image: char.image,
        name: char.name,
        accentColor: accentColor
    };

    if (playerNum === 1) {
        this.p1Character = charData;
        localStorage.setItem('peppaPlayer1CharImage', char.image);
        localStorage.setItem('peppaPlayer1CharName', char.name);
    } else {
        this.p2Character = charData;
        localStorage.setItem('peppaPlayer2CharImage', char.image);
        localStorage.setItem('peppaPlayer2CharName', char.name);
    }

    this.updateStartButton();
}
```

## LocalStorage (Data Persistence)

The game uses localStorage to persist player preferences and game state.

### Game Mode Persistence
```javascript
this.gameMode = config.gameMode ?? localStorage.getItem('peppaGameMode') ?? 'singlePlayer';
```

### Player Name Storage
```javascript
ensurePlayerName() {
    if (this.playerName && this.playerName.trim()) return;

    const savedName = localStorage.getItem('peppaPlayerName');
    if (savedName && savedName.trim()) {
        this.playerName = savedName.trim();
        return;
    }

    let inputName = window.prompt('Enter your name for the leaderboard:', '');
    if (!inputName || !inputName.trim()) {
        inputName = 'Player';
    }

    this.playerName = inputName.trim().slice(0, 20);
    localStorage.setItem('peppaPlayerName', this.playerName);
}
```

### Leaderboard Local Storage
```javascript
saveScoreLocal(score) {
    try {
        const leaderboardKey = `peppa-leaderboard-${this.config.levelId}`;
        const existing = this.loadLeaderboardLocal();
        existing.push({
            name: this.playerName || 'Player',
            score: score,
            timestamp: Date.now()
        });

        // Sort by score descending and keep top scores
        existing.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        const topScores = existing.slice(0, 10);

        localStorage.setItem(leaderboardKey, JSON.stringify(topScores));
    } catch (error) {
        console.error('Error saving score locally:', error);
    }
}
```

## Collisions

The game implements collision detection for gameplay interactions.

### Player vs Player Collision (2-Player Mode)
```javascript
// Two-player collision: P1 hits P2 or P2 hits P1
if (this.gameMode === 'twoPlayer' && player && player2) {
    if (player.isCollision(player2)) {
        // Player 1 takes damage from Player 2 collision
        if (!this.lastPlayerHitAt || Date.now() - this.lastPlayerHitAt > this.playerDamageCooldownMs) {
            this.playerHealth = Math.max(0, this.playerHealth - player2.playerDamage);
            this.lastPlayerHitAt = Date.now();
            this.updateHud(`P1 hit by P2! Health: ${this.playerHealth}/${this.playerMaxHealth}`);
        }
    }
    if (player2.isCollision(player)) {
        // Player 2 takes damage from Player 1 collision
        if (!this.lastPlayer2HitAt || Date.now() - this.lastPlayer2HitAt > this.playerDamageCooldownMs) {
            this.player2Health = Math.max(0, this.player2Health - player.playerDamage);
            this.lastPlayer2HitAt = Date.now();
            this.updateHud(`P2 hit by P1! Health: ${this.player2Health}/${this.player2MaxHealth}`);
        }
    }
}
```

### Laser Collision Detection
```javascript
// Check laser collisions with players and enemies
this.lasers.forEach((laser, index) => {
    // Move laser
    laser.x += laser.dx;
    laser.y += laser.dy;

    // Remove laser if off-screen
    if (laser.x < 0 || laser.x > this.gameEnv.innerWidth ||
        laser.y < 0 || laser.y > this.gameEnv.innerHeight) {
        this.lasers.splice(index, 1);
        return;
    }

    // Check collision with player 1
    if (!laser.isPlayerLaser && player && player.isCollisionWithPoint(laser.x, laser.y)) {
        this.playerHealth = Math.max(0, this.playerHealth - laser.damage);
        this.lasers.splice(index, 1);
        this.updateHud(`P1 hit! Health: ${this.playerHealth}/${this.playerMaxHealth}`);
        return;
    }

    // Check collision with player 2 (2-player mode)
    if (!laser.isPlayerLaser && this.gameMode === 'twoPlayer' && player2 &&
        player2.isCollisionWithPoint(laser.x, laser.y)) {
        this.player2Health = Math.max(0, this.player2Health - laser.damage);
        this.lasers.splice(index, 1);
        this.updateHud(`P2 hit! Health: ${this.player2Health}/${this.player2MaxHealth}`);
        return;
    }

    // Check collision with boss
    if (laser.isPlayerLaser && boss && boss.isCollisionWithPoint(laser.x, laser.y)) {
        boss.takeDamage(laser.damage);
        this.lasers.splice(index, 1);
        this.updateHud(`${this.config.enemyName} hit! Health: ${boss.health}/${boss.maxHealth}`);
        return;
    }
});
```

### Floor Barriers
```javascript
enforceFloorBarriers() {
    const player = this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'Player');
    const player2 = this.gameEnv.gameObjects.find(obj => obj?.constructor?.name === 'Player' && obj !== player);
    const boss = this.getBoss();

    // Keep players above floor
    if (player && player.height) {
        if (player.position.y < this.floorY) {
            player.position.y = this.floorY;
            player.velocity.y = 0;
        }
        if (player.position.y + player.height > this.gameEnv.innerHeight) {
            player.position.y = this.gameEnv.innerHeight - player.height;
            player.velocity.y = 0;
        }
    }

    // Same for player 2
    if (player2 && player2.height) {
        if (player2.position.y < this.floorY) {
            player2.position.y = this.floorY;
            player2.velocity.y = 0;
        }
        if (player2.position.y + player2.height > this.gameEnv.innerHeight) {
            player2.position.y = this.gameEnv.innerHeight - player2.height;
            player2.velocity.y = 0;
        }
    }

    // Keep boss within bounds
    if (boss && boss.height) {
        if (boss.position.y < this.floorY) {
            boss.position.y = this.floorY;
            boss.velocity.y = 0;
        }
        if (boss.position.y + boss.height > this.gameEnv.innerHeight) {
            boss.position.y = this.gameEnv.innerHeight - boss.height;
            boss.velocity.y = 0;
        }
    }
}
```

## Summary

The Peppa Pig game implements several key features:

- **Multiplayer**: Local 2-player support with separate controls and collision detection
- **Character Selection**: Players can choose characters with visual customization
- **Data Persistence**: Uses localStorage to save preferences, names, and leaderboards
- **Collision System**: Handles player-vs-player, laser-vs-target, and boundary collisions

These features work together to create an engaging battle arena experience where players can compete locally, customize their characters, and have their progress tracked across sessions.</content>
<parameter name="filePath">/home/ashup/AadiS12/Team-Pranigas/_projects/games/peppa-pig/Peppa.md
