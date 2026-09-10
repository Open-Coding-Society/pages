---
toc: True
layout: post
title: Mansion Wheel | Bug Fixes and Known Issues
description: A breakdown of bugs found and fixed in the Mansion Level 5 Wheel of Fortune minigame, plus two issues still open.
menu: nav/game_intro.html
permalink: /game/intro/mansion-wheel-bugfixes
author: Aryan Malik
---

## Overview

This post covers the bugs I found and fixed while building the Wheel of Fortune minigame for Level 5 of the Mansion Game, plus two bugs that are still open.

---

## Fixed Bugs

### Bug 1: Wheel Reopened After Already Winning

Once you solved the phrase, you could walk back to the Wheel Table and press E again. The overlay reopened with everything still working, and hitting Solve a second time duplicated the "Level 5 Complete" dialogue on screen.

The issue was that `close()` reset the `gameActive` flag to false, so the guard in `startGame()` thought the game had never been played. Adding a check for `this.solved` fixed it since that flag never resets.

```js
startGame() {
  if (this.gameActive || this.solved) return;
}
```

---

### Bug 2: Double-Clicking Continue Spawned Multiple Doors

Clicking Continue more than once in the win dialogue spawned multiple Level 6 door NPCs stacked in the same spot. Each door registered its own keypress listener, so pressing E fired the level transition multiple times and crashed the game.

`spawnFinishDoor()` had no guard, it just created a new NPC every single call. A simple check at the top stopped that.

```js
spawnFinishDoor() {
  if (this.finishDoor) return;
  this.finishDoor = new Npc(this.createFinishDoorData(), this.gameEnv);
  this.gameEnv.gameObjects.push(this.finishDoor);
}
```

---

### Bug 3: Coins Went Negative

A wrong solve attempt cost $100. If you only had $50, your coins dropped to -$50. The display showed negative numbers and Bankrupt on top of that produced values like "-$150."

The deduction had no floor. Wrapping it in `Math.max` fixed it.

```js
this.coins = Math.max(0, this.coins - 100);
```

---

### Bug 4: Background Music Crashed the Level on Safari

On Safari and some Chrome settings, the browser blocks audio autoplay. Without a `.catch()`, that rejection bubbled up and caused the entire level to fail, leaving the player on a black screen.

```js
this.backgroundMusic.play().catch((error) =>
  console.warn('Level 5 music failed to play:', error)
);
```

---

### Bug 5: Win Dialogue Appeared Twice From Rapid Clicking

Solving the phrase queued `onWin` inside a 900ms timeout. If you pressed Solve twice before the timeout fired, two calls to `winLevel()` went through and stacked the win dialogue.

Adding a guard at the top of `winLevel()` made it so only the first call ever runs.

```js
winLevel() {
  if (this.puzzleSolved) return;
  this.puzzleSolved = true;
  ...
}
```

---

## Known Issues (Not Yet Fixed)

### Bug 6: Game Can Become Unwinnable

If all consonants are revealed and you land on Bankrupt, you are stuck. Spinning does nothing since no consonants remain, and vowels cost $250 you no longer have. There is no way out.

**To reproduce:** guess every consonant, land on Bankrupt, then try to buy a vowel or spin. Neither works.

**Planned fix:** In `buyVowel()`, check if any consonants are left. If there are none and you cannot afford a vowel, give it for free.

```js
const consonantsLeft = [...this.phrase].some(
  (c) => /[A-Z]/.test(c) && !/[AEIOU]/.test(c) && !this.guessedLetters.has(c)
);
if (this.coins < this.vowelCost) {
  if (!consonantsLeft) {
    this.applyLetterGuess(letter, 0);
    input.value = "";
    this.render();
    return;
  }
  this.setMessage(`Need $${this.vowelCost} to buy a vowel. Current: $${this.coins}.`);
  return;
}
```

---

### Bug 7: Guess Button Briefly Accepts Input After Bankrupt

When Bankrupt lands, there is a short window before the UI updates where the Guess button still looks active. A fast click during that window lets a consonant guess go through with no spin on record.

**To reproduce:** land on Bankrupt and click the Guess button as fast as possible before the message renders.

**Planned fix:** The render logic should also check `this.solved` before enabling the button, not just the spin value.

```js
const canGuess = !!this.currentSpinValue && !this.solved;
consonantButton.disabled = !canGuess;
consonantButton.style.opacity = canGuess ? "1" : "0.55";
```
