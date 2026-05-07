---
layout: post
title: Kirby Minigames Documentation
description: Documentation for the actual features implemented in the Kirby minigames project
category: Gamify
breadcrumb: true
permalink: /kirby-minigames
---

## Goal

Build a connected minigame experience that starts in an aquatic story level, transitions into a seek-and-collect game, and ends in a basketball survival challenge.

This project also adds replay systems and technical features beyond a basic level build, including game-in-game transitions, collision logic, enemy chasing behavior, optional multiplayer, and level-specific music.

## Files Changed

- `_projects/games/kirby-minigames/levels/GameLevelAquaticGameLevel.js`
- `_projects/games/kirby-minigames/levels/GameLevelSeek.js`
- `_projects/games/kirby-minigames/levels/GameLevelBasketball.js`
- `_projects/games/kirby-minigames/levels/KirbyLevelMusic.js`
- `_projects/games/kirby-minigames/images/Aquatic.png`
- `_projects/games/kirby-minigames/images/Above the water.png`
- `_projects/games/kirby-minigames/images/Mermaid Spritesheet.png`
- `_projects/games/kirby-minigames/images/scubadiver.png`
- `_projects/games/kirby-minigames/images/slime.png`
- `_projects/games/kirby-minigames/images/Shark.png`
- `_projects/games/kirby-minigames/images/megalodon.png`
- `_projects/games/kirby-minigames/images/megalodon attack.png`
- `_projects/games/kirby-minigames/images/trident.png`
- `_projects/games/kirby-minigames/images/tagplayground.png`
- `_projects/games/kirby-minigames/images/boysprite.png`
- `_projects/games/kirby-minigames/images/astro.png`
- `_projects/games/kirby-minigames/images/kirby.png`
- `_projects/games/kirby-minigames/images/BaskCourt.png`

## What We Built

### Aquatic level

- A story-based underwater level with Mermaid, Slime, Kirby, Shark, and Shark wingman NPCs
- Quest #1 where the player collects starfishes for Mermaid
- Quest #2 where the player goes above water and removes floating trash
- A quest HUD that updates as the player progresses through the story
- A boss fight against the Megalodon with separate combat rules and UI
- A challenge mode with its own score tracking and leaderboard

### Seek minigame

- A coin-collection minigame with a playground background
- A custom in-game sprite menu opened with `Q`
- Automatic transition to the next minigame after all coins are collected

### Basketball minigame

- A survival game where Astro is chased by Kirby across the court
- Coin collection, invisible court barriers, timer HUD, restart flow, and leaderboard logic
- A projectile basketball attack on `E` that can stun the chaser

### Shared technical features

- Game-in-game level transitions
- Collision and hitbox logic
- NPC chasing behavior
- Optional two-player aquatic multiplayer
- Level-specific music with a reusable controller

## Feature Breakdown

### Game-in-Game transitions

One of the biggest features we added was a real game-in-game transition flow instead of leaving each minigame isolated.

The sequence is:

1. `GameLevelAquaticGameLevel` launches `GameLevelSeek`
2. `GameLevelSeek` tears itself down and transitions into `GameLevelBasketball`
3. Fade overlays and cleanup logic prevent the canvases and UI from stacking on top of each other

The aquatic level uses `GameControl` to start Seek as a nested game:

```javascript
const gameInGame = new GameControl(this.gameEnv.game, [GameLevelSeek], {
  parentControl: primaryGame,
});
gameInGame.start();
```

This works because the aquatic level first pauses the parent game and hides the existing canvas state before starting the nested level. That lets us keep the larger story level alive while the player enters a smaller minigame inside it.

Seek then transitions forward by tearing down its current level and handing control back up the chain:

```javascript
const primaryGame = this.gameEnv?.gameControl;
const topGame = primaryGame?.parentControl || primaryGame;

if (primaryGame.currentLevel && typeof primaryGame.currentLevel.destroy === 'function') {
  primaryGame.currentLevel.destroy();
}

topGame.levelClasses = [GameLevelBasketball];
topGame.currentLevelIndex = 0;
topGame.transitionToLevel();
```

This matches the game-in-game lesson pattern because the project is not just changing scenes visually. It is actually creating, pausing, destroying, and replacing active game levels in a controlled sequence.

### Collision system

We used more than one kind of collision logic depending on the minigame.

In Basketball, the player and chaser use a rectangle-style hitbox collision:

```javascript
isHitboxCollision(a, b) {
  const ar = this.getHitboxRect(a);
  const br = this.getHitboxRect(b);
  return (
    ar.left   < br.right  &&
    ar.right  > br.left   &&
    ar.top    < br.bottom &&
    ar.bottom > br.top
  );
}
```

That is used to detect when Kirby catches the player.

Projectiles use circle-to-rectangle collision so a thrown basketball can stun the chaser:

```javascript
isCircleHittingObject(projectile, obj) {
  const rect = this.getHitboxRect(obj);
  const nearestX = Math.max(rect.left, Math.min(projectile.x, rect.right));
  const nearestY = Math.max(rect.top,  Math.min(projectile.y, rect.bottom));
  const dx = projectile.x - nearestX;
  const dy = projectile.y - nearestY;
  return (dx * dx + dy * dy) <= (projectile.radius * projectile.radius);
}
```

In Aquatic, the shark uses built-in collision checking against the player and triggers a game over when the hit lands:

```javascript
shark.isCollision(player);
if (shark.collisionData?.hit) {
  this.showSharkGameOver();
}
```

This gave us multiple collision styles in one project: collectibles, enemy contact, and projectile combat.

### NPC chasing behavior

The Basketball minigame includes active enemy pursuit instead of a static NPC.

Kirby chases the player by computing the direction vector from Kirby to the player, normalizing that vector, and moving a little each frame:

```javascript
const dx = player.position.x - lebron.position.x;
const dy = player.position.y - lebron.position.y;
const dist = Math.hypot(dx, dy);
if (dist < 1) return;

const speed = Math.min(2.1 + this.currentTime * 0.03, 2.8);
lebron.position.x += (dx / dist) * speed;
lebron.position.y += (dy / dist) * speed;
```

We also clamp Kirby back into the visible court so the chase stays fair and readable. On top of that, the speed increases slightly over time, which makes the survival challenge harder the longer the player lasts.

Aquatic also has shark movement and collision pressure, but Basketball is the clearest example of a direct chasing system.

### Multiplayer system

The aquatic level supports optional two-player story play by reading a `room` query parameter from the URL:

```javascript
const roomParam = new URLSearchParams(window.location.search).get("room");
applyWorldSize(roomParam ? 2 : 1);
```

When co-op is active, the level expands the world width and resizes the game container:

```javascript
const applyWorldSize = (playerCount = 1, options = {}) => {
  const nextDimensions = getWorldDimensionsForPlayerCount(playerCount);
  this.gameEnv.innerWidth = nextDimensions.width;
  this.gameEnv.innerHeight = nextDimensions.height;
  this.gameEnv.size?.();
};
```

The actual multiplayer loop starts in `startMultiplayer()` and uses `BroadcastChannel` when available, with `localStorage` events as a fallback:

```javascript
if (typeof BroadcastChannel !== "undefined") {
  const channel = new BroadcastChannel(this.multiplayer.channelName);
  channel.onmessage = (event) => handleMultiplayerMessage(event.data);
  this.multiplayer.channel = channel;
}
```

The level also sends regular player state updates so the remote player can be rendered and kept in sync:

```javascript
this.multiplayer.heartbeatTimer = setInterval(() => {
  const player = this.getLocalPlayer?.();
  if (!player) return;
  broadcastMultiplayerMessage({
    type: "state",
    x: player.position?.x || 0,
    y: player.position?.y || 0,
    direction: player.direction || "down",
  });
}, 120);
```

Beyond movement syncing, the aquatic level also broadcasts quest and scene events such as starting quests, collecting objectives, and switching between underwater and surface scenes.

### Music system

We added music only to the Kirby minigame levels by creating `KirbyLevelMusic.js`.

Instead of rewriting the whole audio system from scratch, the project extends `PeppaMusic` and adapts it for Kirby:

```javascript
import PeppaMusic from "../../peppa-pig/levels/PeppaMusic.js";

class KirbyLevelMusic extends PeppaMusic {
```

The Kirby wrapper adds level-safe behavior:

- removes duplicate music buttons
- stores player preference in `localStorage`
- pauses and destroys audio when a level ends
- keeps only one active music controller at a time

The button and playback lifecycle are handled in the controller itself:

```javascript
attach() {
  if (this.enabled) {
    this.addGestureListeners();
  }
  this.updateButton();
  return this;
}
```

Each level creates its own music controller during `initialize()` and removes it during `destroy()`, which keeps the music scoped to only these three levels:

```javascript
this.levelMusic = new KirbyLevelMusic({
  levelName: "Aquatic",
  buttonId: "kirby-aquatic-music-toggle",
}).attach();
```

This same pattern is also used in Seek and Basketball.

### Sprite swapping and UI systems

Seek includes a full sprite menu that lets the player swap characters while the game is running. That is more advanced than a single fixed player sprite because it updates the player's sprite sheet data, animation settings, and image source on the fly.

The project also adds several UI systems built directly in JavaScript:

- quest HUD in Aquatic
- challenge HUD and leaderboard UI in Aquatic
- top menu bar for mode switching and multiplayer access
- sprite menu and hint badge in Seek
- timer HUD and message HUD in Basketball
- fade overlays for transitions

These systems matter because they are part of the gameplay loop, not just decoration.

## How We Tested

- Read the implemented level source files directly and documented only features that are actually present in code
- Verified the transition chain from `GameLevelAquaticGameLevel.js` to `GameLevelSeek.js` to `GameLevelBasketball.js`
- Verified that collision helpers, chase logic, multiplayer setup, and level music hooks all exist in the project files
- Verified that `KirbyLevelMusic.js` is attached in Aquatic, Seek, and Basketball and destroyed when those levels are destroyed
- Confirmed that the aquatic level includes story mode, challenge mode, multiplayer state syncing, and boss encounter logic
- Tried to run a JavaScript syntax check earlier, but `node` is not installed in this environment, so I could not do a local parser or browser runtime check here

## What We Learned

- A multi-level game is easier to explain when the documentation includes both gameplay features and the code systems behind them
- Game-in-game transitions need cleanup logic, not just visual fades
- Collision is not one single feature; different gameplay systems needed different collision strategies
- Multiplayer required both rendering changes and state synchronization, not just a second player sprite
- Music systems also need lifecycle management so audio and buttons do not leak across levels

## Controls and Gameplay Notes

- In Aquatic, progression is mainly driven by interacting with Mermaid and Slime
- In Seek, press `Q` to open the sprite menu
- In Basketball, press `E` to shoot and `R` to restart after getting caught
- The Basketball win condition is surviving for `20` seconds
- Aquatic supports optional co-op play when the level is launched with a `room` parameter

## Next Step

- Add screenshots or short GIF evidence for each system so the documentation includes both code explanation and visual proof
- Expand this page again if more minigames or shared systems are added later
