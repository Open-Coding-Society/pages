---
layout: post
title: Gate Game - Deep Dive into our 3 level Game
description: This blog will be a full deep explanation into the aspects, mechanics, logic, and much more regarding our 3 levels.
author: Kashyap Tubati
category: Gamify
breadcrumb: true
permalink: /gamify/gategamex
---

## Why Document Your Work

Teams often remember what they built, but forget the exact steps, files, tests, and decisions that got them there. This page serves as our official project documentation, detailing the transition from our initial concepts to a fully playable 3-level adventure.

### Project Overview
- **What did we change?** We built out three distinct, fully playable levels (Cannonball, Escape, and Zone Catch) replacing default placeholder levels with custom mechanics, obstacles, and backgrounds.
- **Why did we change it?** To bring our core storyline to life. We needed an engaging, progressive difficulty curve to tell the story of our protagonist trying to survive, while integrating core game loops like lives, collectibles, and level progression.
- **What files did we touch?** We created/modified `GameLevelCannonball_Refined.js`, `GameLevelEscaperoom_Refined.js`, and `GameLevelZonecatch_Refined.js`, alongside adding multiple new image assets to our `_projects/gamify/images/` directories.
- **How did we test it?** We ran the local development server (`make dev`), loaded the gamify project, verified the unique mechanics for each level (visibility radius, zone matching, etc.), and ensured the UI elements like lives and coins tracked correctly.
- **What should happen next?** We need to finalize the game-over states, add a victory screen for when the city is reached, and potentially integrate background audio to match the desert theme.

---

## The Storyline & Mechanics: A Race Against the Sun

Our game follows a brave little slime who suddenly finds himself stranded deep in a scorching desert. With the relentless sun beating down, time is running out. He must find his way back to the safety of the city before he ends up melting into a puddle. 

To do this, he has to navigate through three unique challenges, finding a magical **Gate** at the end of each stage to advance—hence the name, **Gate Game**. 

*(Note: In our current build, the slime character is mapped to the `chillguy.png` sprite asset).*

### Core Global Mechanics
Across all three levels, players must manage a few global systems:
- **3 Lives:** Make too many mistakes, and the slime melts for good.
- **Coin Collections:** Coins are scattered throughout the levels to encourage exploration and risk-taking.
- **Hidden Coin Clickers:** Secret interactive elements hidden in the environment that reward observant players with extra coins when clicked.

---

## Level 1 Focus: Cannonball

### Goal
Introduce the player to movement mechanics and basic survival. The slime must dodge incoming cannonballs, with each successful dodge allowing him to advance to the next section until he reaches the final escape Gate.

### Files Changed 
- `_projects/gamify/levels/GameLevelCannonball_Refined.js`
- `_projects/gamify/images/Cannonball/Desert1.jpeg`
- `_projects/gamify/images/chillguy.png`
- `_projects/gamify/images/Cannonball/Cannon.png`
- `_projects/gamify/images/Cannonball/Cannonball.png`
- `_projects/gamify/images/Gate.png`

### What We Implemented
- Added the introductory desert background (`Desert1.jpeg`).
- Built the section-advancement logic: dodging a wave of cannonballs clears the path to move forward.
- Placed standard collectible coins and hidden coin clickers in risky spots to tempt the player.
- Placed the `Gate.png` transition object at the very end to allow players to progress to Level 2.

### How We Tested
- Launched the game locally and loaded the Cannonball level.
- Intentionally took hits from the cannonballs to verify the "3 Lives" system deducted correctly and triggered a reset/game over.
- Checked that clicking the hidden coin spots correctly incremented the coin counter.

### What We Learned
- Pacing the cannonball fire rate is critical so the player has just enough time to react and advance without feeling overwhelmed early on.

### Next Step
Shift the gameplay style from reaction-based dodging to exploration and memory in Level 2.

---

## Level 2 Focus: Escape

### Goal
Change the pace and increase the tension. The slime finds himself in a dark sand maze. The player only has a limited circle of visibility around the slime and must navigate the labyrinth to find the next Gate.

### Files Changed 
- `_projects/gamify/levels/GameLevelEscaperoom_Refined.js`
- `_projects/gamify/images/Escaperoom/SandMaze_Bg.jpeg`
- `_projects/gamify/images/Escaperoom/MazeWall.png`
- `_projects/gamify/images/Gate.png`

### What We Implemented
- Created a maze layout using normal sand walls (`MazeWall.png`).
- Implemented a "darkness" overlay with a transparent cutout (mask) locked to the player's coordinates, creating the limited visibility circle.
- Scattered coins throughout dead ends to reward players who take the time to explore the dark maze.
- Positioned the `Gate.png` at the exit of the maze.

### How We Tested
- Ran the local site and transitioned from Level 1 to Level 2.
- Verified that the visibility mask smoothly followed the slime sprite as it moved.
- Tested wall collisions to ensure the player couldn't cheat by walking through the maze boundaries in the dark.

### What We Learned
- Masking and lighting effects in JavaScript/Canvas require careful performance optimization so the movement doesn't stutter.
- Dead ends in mazes are the perfect place to hide our interactive coin clickers.

### Next Step
Build the final, high-stakes reaction test for Level 3.

---

## Level 3 Focus: Zone Catch

### Goal
The final stretch. The slime is almost at the city gates but has to survive a fast-paced sorting game. The player must read a banner and rush to the matching colored circle. Choosing wrong, or being too slow, costs a life.

### Files Changed 
- `_projects/gamify/levels/GameLevelZonecatch_Refined.js`
- `_projects/gamify/images/Zonecatch/DesertCityOutskirts.jpeg`
- `_projects/gamify/images/Zonecatch/Banner.png`
- `_projects/gamify/images/Zonecatch/Circle_Red.png`
- `_projects/gamify/images/Zonecatch/Circle_Blue.png`
- `_projects/gamify/images/Gate.png`

### What We Implemented
- Updated the backdrop to `DesertCityOutskirts.jpeg`, indicating the slime is finally near the city.
- Built the logic for the `Banner` to randomly display a target color.
- Implemented the safe zones (e.g., `Circle_Red`, `Circle_Blue`).
- Created the core loop: if the timer runs out and the player isn't in a circle, or is in the *wrong* colored circle, they lose a life.
- Set up the final `Gate.png` to appear after surviving the required number of rounds, representing ultimate victory.

### How We Tested
- Booted up Level 3 independently to test the timer and randomized banner logic.
- Intentionally stood in the wrong circle when the timer hit zero to ensure the life deduction triggered properly.
- Verified that reaching the final Gate triggers the end-of-game victory state.

### What We Learned
- Tying logic to a countdown timer requires tight sync between the UI text and the collision detection functions.
- This minigame format is highly replayable and could easily be expanded with more colors or shorter timers in the future.

### Next Step
Review player feedback on the difficulty curve, polish up the UI for the coin counter and lives, and celebrate finishing the Gate Game!