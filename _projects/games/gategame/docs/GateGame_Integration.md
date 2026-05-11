---
layout: opencs
title: Gate Game — Lesson Integrations
permalink: /gamify/gategame-integration
description: A breakdown of how localStorage, collision mechanics, and platformer gravity were integrated across all three Gate Game levels, plus the full ZoneCatch Platformer Edition revamp.
type: plans
---

<div id="gameContainer">
  <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
</div>

<script type="module">
  import Core        from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/Game.js";
  import GameControl from "{{site.baseurl}}/assets/js/GameEnginev1.1/essentials/GameControl.js";

  import GameLevelZonecatch  from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelZonecatch.js";
  import GameLevelEscaperoom from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelEscaperoom.js";
  import GameLevelCannonball from "{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelCannonball.js";

  import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const gameLevelClasses = [
    GameLevelZonecatch,
    GameLevelEscaperoom,
    GameLevelCannonball,
  ];

  const environment = {
    path:             "{{site.baseurl}}",
    pythonURI:        pythonURI,
    javaURI:          javaURI,
    fetchOptions:     fetchOptions,
    gameContainer:    document.getElementById("gameContainer"),
    gameLevelClasses: gameLevelClasses,
  };

  Core.main(environment, GameControl);
</script>

## Gate Game — Lesson Integration Blog

This post documents every feature added to the three Gate Game levels as part of the lesson integration sprint, along with a full breakdown of the ZoneCatch Platformer revamp.

<br>

### Overview

| Level | Lesson | Feature Added |
|---|---|---|
| ZoneCatch | plat-gravity | Full platformer physics — gravity, jumping, 14 platforms |
| Escape Room | localStorage | Personal-best coin score saved between sessions |
| Cannonball | collision_mechanics | Red screen flash and hit counter on every cannonball hit |

<br>

### Level 1 — ZoneCatch: Platformer Edition

**What changed**

The original ZoneCatch was a flat top-down arena where you walked WASD into a safe-colored zone. The revamp replaces the entire movement model with a side-scrolling platformer. Gravity pulls the player down every frame, W or Space jumps, and A/D move left and right. Fourteen platforms are laid out across four height rows inside the arena, and the two safe zones snap to platform surfaces each round so they are always reachable by jumping.

**How the physics loop works**

The engine's built-in `Player.update()` applies its own gravity and WASD movement. To override this without touching engine files, the overlay runs its own 60 fps physics loop via `setInterval(fn, 16)`. Each tick it kills the engine's gravity, applies custom gravity and jumping, resolves platform collision, then writes the new position directly back to `player.position` and zeroes `player.velocity` so the engine cannot override the result on its next frame.

```js
// Kill engine gravity every tick — belt-and-suspenders guarantee
player.gravity      = false;
player.time         = 0;
player.acceleration = 0;
player.moved        = true;

// Apply custom gravity
self._vy = Math.min(self._vy + GRAVITY, MAX_FALL);

// Platform landing check
if (self._vy >= 0 && withinX) {
  const feet = ny + ph;
  if (wasAbove && nowInside) {
    ny             = psy - ph;
    self._vy       = 0;
    self._onGround = true;
  }
}

// Write back and suppress engine movement
player.position.x = nx;
player.position.y = ny;
player.velocity.x = 0;
player.velocity.y = 0;
```

**Why `GRAVITY: false` in playerData is not enough**

`GRAVITY: false` in the player data prevents the engine from enabling gravity during construction. But the engine reads `player.gravity` (not the original data) on every frame, so the physics loop also forces `player.gravity = false` each tick. This prevents any edge case where the engine re-enables gravity internally.

**Platform layout**

Platforms are defined as arena-relative fractions so they scale correctly on window resize. Four rows exist at roughly 78%, 56%, 36%, and 16% of the arena height, creating a jump chain where reaching the highest zones requires multiple hops.

```js
const p = (fx, fy, fw, fh, color) => ({
  x: a.x + fx * a.w,
  y: a.y + fy * a.h,
  w: fw * a.w,
  h: fh * a.h,
  color,
});
```

**Zone spawning on platforms**

Because zones now sit at different heights, spawn logic was updated to bias zone centers toward platform surfaces rather than random arena positions. The two zones are also forced to land on different vertical regions (at least 60px apart in Y) so the player always has to travel to reach the safe one.

**Fall death**

If the player falls past the arena bottom they are respawned at the ground-level start position with physics reset — no life is lost, just a reposition.

<br>

### Level 2 — Escape Room: localStorage

**What was added**

A personal-best coin badge that persists across browser sessions. On load, `localStorage.getItem` reads the previous best. Every 250ms the interval compares the current coin count to that stored value and calls `localStorage.setItem` when a new high is reached.

```js
const LS_KEY_BEST_COINS = 'escaperoom_best_coins';

// Load on level start
this._personalBest = parseInt(localStorage.getItem(LS_KEY_BEST_COINS) || '0');

// Save when beaten
if (current > this._personalBest) {
  this._personalBest = current;
  localStorage.setItem(LS_KEY_BEST_COINS, String(current));
  this._updatePersonalBestHud();
}
```

`localStorage.setItem` always stores strings. `parseInt` converts the value back to a number when reading it so the greater-than comparison works correctly.

**Persistence between sessions**

Because `localStorage` is tied to the browser origin rather than the session, the personal best survives page refreshes, tab closes, and browser restarts. When the level loads again, `getItem` immediately returns the stored value and the badge renders with the previous record already shown.

**Visual badge**

A fixed `<div>` is injected at load time below the GameStats HUD showing `PB: X 🪙`. When a new record is beaten the badge updates to show a sparkle emoji. The element is removed in `destroy()` when the level unloads so it does not carry over to other levels.

**Glowing Orb Clicker**

A Clicker NPC named the Glowing Orb was added near the player spawn at canvas coordinate (150, 300). Every 3 clicks awards plus one coin via `GameStats.addCoin()`. Coin positions were also converted from 0–1 viewport fractions to absolute canvas pixels in the 1134 by 772 coordinate space because `gameEnv.innerWidth` equals the full browser viewport width, which caused the original fractional positions to scatter coins far outside the visible game container.

<br>

### Level 3 — Cannonball: Collision Mechanics

**What was added**

Two pieces of visual feedback fire every time `collisionHappened` is true inside `_endRound`.

The first is a red screen flash — a full-viewport `<div>` overlay that transitions to opacity 1 and fades back in 200ms. It uses `pointer-events: none` so it never blocks mouse or keyboard input, and sits at `z-index: 9998` so it stays below existing game modals.

```js
_triggerCollisionFlash() {
  this._flashEl.style.opacity = '1';
  setTimeout(() => {
    if (this._flashEl) this._flashEl.style.opacity = '0';
  }, 200);
}
```

The second is a persistent Hits: N badge in the top-left corner that increments on every collision.

```js
if (this.collisionHappened) {
  this._totalHits++;
  this._triggerCollisionFlash();
  this._updateHitCounter();
}
```

**Connection to the lesson**

The collision_mechanics lesson covers how `handleCollisionEvent` works in the Enemy and Guard pattern — detecting AABB overlap and responding with game-state changes. The flash and counter are the game-state response side of that pattern: detection stays in the existing AABB check inside `_updateCannonball`, while response is handled by the two new methods. Both the flash overlay and the counter element are created in `_boot()` and removed in `destroy()`, keeping them scoped to the level's lifetime.

<br>

### Other Fixes Made During This Sprint

| File | Fix |
|---|---|
| GameLevelEscaperoom.js | Import paths changed from @assets/js/GameEnginev1.1 alias to ./essentials relative paths |
| GameLevelEscaperoom.js | Added import Clicker from ./essentials/Clicker.js |
| GameLevelEscaperoom.js | All 17 barriers changed from visible true to visible false to remove red debug rectangles |
| GameLevelEscaperoom.js | Coin positions converted from 0–1 viewport fractions to absolute 1134 by 772 canvas pixels |
| GameLevelEscaperoom.js | Fog canvas detection updated with four fallbacks: gameEnv.canvas, ctx.canvas, #gameContainer canvas selector, then DOM scan |
| GameLevelZonecatch.js | Full revamp from top-down arena to platformer — see Level 1 section above |
