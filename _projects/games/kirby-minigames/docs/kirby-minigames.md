---
layout: post
title: Kirby Minigames Documentation
description: Documentation for the actual features implemented in the Kirby minigames project
category: Gamify
breadcrumb: true
permalink: /kirby-minigames
---

## Goal

Build a connected minigame experience that starts in an aquatic story level, transitions into a seek-and-collect game, and ends with a basketball survival challenge.

The project also adds extra replay value through challenge mode, leaderboard saving, sprite swapping, and optional two-player story play in the aquatic level.

## Files Changed

- `_projects/games/kirby-minigames/levels/GameLevelAquaticGameLevel.js`
- `_projects/games/kirby-minigames/levels/GameLevelSeek.js`
- `_projects/games/kirby-minigames/levels/GameLevelBasketball.js`
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

## What We Implemented

### Aquatic story level

- Created a quest-based underwater level with Mermaid, Slime, Kirby, Shark, and Shark wingman NPCs.
- Added Quest #1 where the player accepts Mermaid's mission and collects starfishes scattered around the reef.
- Added a quest HUD that updates based on story progress instead of showing static text.
- Added Quest #2 where the player transitions from the underwater scene to an above-water cleanup scene and removes floating trash.
- Added a return transition back underwater after all trash is collected.
- Made Kirby disappear after Quest #2 as part of the story progression.

### Aquatic combat and replay systems

- Added a Megalodon boss encounter with its own intro sequence, boss HUD, player HP, projectile behavior, and mouse-based trident combat.
- Added story dialogue sequences that teach the player how left click and right click attacks work during the boss fight.
- Added a separate challenge mode for the aquatic level with wave-based starfish collection and a local leaderboard saved in `localStorage`.
- Added a top menu bar that lets players switch between story mode and challenge mode, open the leaderboard, save scores, and access two-player mode.

### Two-player aquatic support

- Added optional two-player story support using a `room` URL parameter and multiplayer state syncing.
- Increased world width for co-op sessions so two players have more room to move.
- Synced quest progress and scene events for shared story actions such as starting quests, collecting objectives, and switching scenes.

### Seek minigame

- Built a seek-and-collect minigame with a playground background and six collectible coins.
- Added a custom pixel-style coin sprite generated in code instead of relying on a separate image file.
- Added a sprite selection menu that opens with `Q` so the player can switch between Boy, Scuba Diver, Astro, and Kirby.
- Added an automatic transition from Seek into the basketball minigame after all coins are collected.

### Basketball minigame

- Built a basketball survival level where the player controls Astro while Kirby chases them across the court.
- Added collectible coins, invisible barriers, a live timer HUD, a caught/reset loop, and best-score tracking.
- Added a projectile attack on `E` that lets the player shoot a basketball and temporarily stun the chaser.
- Added a leaderboard integration and score submission for basketball rounds.
- Added level completion when the player survives for `20` seconds.
- Added navigation buttons so players can jump back to the aquatic or seek experiences after the round.

## How We Tested

- Read the implemented level source files directly to document only features that are present in code.
- Verified the project structure and asset list under `_projects/games/kirby-minigames/`.
- Traced the transition flow from `GameLevelAquaticGameLevel.js` to `GameLevelSeek.js` to `GameLevelBasketball.js`.
- Confirmed that the quest HUD, challenge HUD, leaderboard saving, sprite menu, and transition overlays are implemented in JavaScript.
- Confirmed that the aquatic level includes story mode, challenge mode, boss encounter logic, and multiplayer-specific branches.
- Tried to run a JavaScript syntax check, but `node` is not installed in this environment, so no runtime parser check was available here.

## What We Learned

- This project grew beyond a single level, so documenting transitions between minigames is just as important as documenting each level on its own.
- UI systems such as HUDs, dialogue buttons, and overlays became a major part of gameplay, not just visual polish.
- Reusing one project structure for story mode, challenge mode, and co-op play kept the implementation in one place instead of splitting it into separate mini-projects.
- Writing down the exact controls and progression rules makes future testing and demos much easier.

## Controls and Gameplay Notes

- In the aquatic level, story progression is mainly driven by interacting with Mermaid and Slime.
- In the seek level, press `Q` to open the sprite menu.
- In the basketball level, press `E` to shoot and `R` to restart after getting caught.
- The basketball win condition is surviving for `20` seconds.
- The aquatic experience supports an optional co-op session when the game is launched with a `room` parameter.

## Next Step

- Add more features to our game based on other lessons
- If more minigames are added, extend this page with one subsection per level so the full sequence stays easy to follow.
