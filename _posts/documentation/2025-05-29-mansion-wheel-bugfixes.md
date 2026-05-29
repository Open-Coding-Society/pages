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

Working on Level 5 of the Mansion Game meant building a fully playable Wheel of Fortune minigame from scratch inside a game engine. Once the core gameplay was in, a round of playtesting and QA surfaced a bunch of bugs, some of which were embarrassing and some of which were genuinely tricky. Here is a rundown of everything that got fixed, plus two bugs that are still sitting in the backlog.

---

## Fixed Bugs

### Bug 1: Solving the Wheel Opened It Again After Winning

**What was happening:**

After you solved the phrase and got the win message, you could walk back up to the Wheel Table and press E again. The overlay would reopen with the board fully revealed but all the buttons still working. If you hit Solve a second time, it triggered the "Level 5 Complete" dialogue all over again, duplicating it on screen.

**Why it happened:**

The `startGame()` function had a check that said "don't open if the game is already active." But once you won, the game was no longer "active" because the `close()` function had reset that flag. So the guard passed and the game opened like nothing had happened.

**The fix:**

Added a second condition to that early check. Now it also looks at `this.solved`, which stays `true` permanently after a win. If you've already solved it, `startGame()` just exits immediately.

```js
startGame() {
  if (this.gameActive || this.solved) return;
  ...
}
```

---

### Bug 2: Clicking Continue More Than Once Spawned Multiple Doors

**What was happening:**

The "Level 5 Complete" dialogue had a Continue button. If you clicked it more than once (double-click, impatient clicking, whatever), the game spawned multiple Level 6 door NPCs stacked on top of each other in the exact same spot. Each one registered its own keypress listener, so pressing E near the door fired the level transition multiple times and crashed the game.

**Why it happened:**

The `spawnFinishDoor()` function had no protection against being called twice. Every time it ran, it created a brand new NPC and shoved it into the game objects list, no questions asked.

**The fix:**

Added a guard at the top of `spawnFinishDoor()` that checks if a door already exists. If it does, the function returns immediately and nothing gets spawned.

```js
spawnFinishDoor() {
  if (this.finishDoor) return;
  this.finishDoor = new Npc(this.createFinishDoorData(), this.gameEnv);
  this.gameEnv.gameObjects.push(this.finishDoor);
}
```

---

### Bug 3: Coins Could Go Negative

**What was happening:**

Every wrong solve attempt cost $100. If you had, say, $50 left and guessed wrong, your coin total dropped to -$50. The display showed a negative number, and when Bankrupt hit on top of that you would see nonsense like "-$150."

**Why it happened:**

The deduction was just a plain subtraction with no floor. If the result went below zero, the code did not care.

**The fix:**

Wrapped the subtraction in `Math.max(0, ...)` so the result can never go below zero.

```js
this.coins = Math.max(0, this.coins - 100);
```

---

### Bug 4: Background Music Crashed the Level on Some Browsers

**What was happening:**

On Safari, and occasionally Chrome with strict autoplay settings, the call to play the background music threw an error. Without any error handling on that promise, the whole level load was treated as failed and the player got a black screen with no message.

**Why it happened:**

Browsers block audio autoplay unless the user has interacted with the page first. The music was set up to play immediately on level load with no fallback if the browser rejected it.

**The fix:**

Chained a `.catch()` onto the play call so that if the browser blocks it, the error gets logged as a warning and the game keeps going normally.

```js
this.backgroundMusic.play().catch((error) =>
  console.warn('Level 5 music failed to play:', error)
);
```

---

### Bug 5: Winning the Level Could Trigger Twice From a Double-Click

**What was happening:**

When you solved the phrase, `onWin` was queued inside a 900ms `setTimeout`. If you somehow triggered the solve function twice before that timeout fired (like pressing Solve twice very fast), two separate calls to `winLevel()` went through. The result was two "Level 5 Complete" dialogues stacking on screen, and `spawnFinishDoor()` getting called before its own guard existed.

**Why it happened:**

`winLevel()` had no protection against being called more than once. The first call ran through the whole win sequence, but if a second call came in during that same window, it ran the same thing all over again.

**The fix:**

Added an idempotency guard at the very top of `winLevel()`. The first call sets `puzzleSolved` to `true`. Any call after that returns immediately.

```js
winLevel() {
  if (this.puzzleSolved) return;
  this.puzzleSolved = true;
  ...
}
```

---

## Known Issues (Not Yet Fixed)

### Bug 6: The Game Can Reach an Unwinnable State

**What is happening:**

If you reveal all the consonants in the phrase and then land on Bankrupt, you end up with $0 and no way forward. Spinning does nothing because there are no consonants left to guess. Buying a vowel requires $250. You are completely stuck with no escape.

**Steps to reproduce:**

1. Guess every consonant until none are left
2. Land on Bankrupt (coins drop to $0)
3. Try to buy a vowel, blocked, need $250
4. Try to spin, every spin is useless since all consonants are already revealed
5. The game is stuck with no way out

**The planned fix:**

In `buyVowel()`, check if any consonants are still left in the phrase. If there are none and the player cannot afford a vowel, skip the coin check and give the vowel for free as a soft-lock fallback.

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

### Bug 7: The Guess Button Has a Brief Window Where It Accepts Free Guesses After Bankrupt

**What is happening:**

When you land on Bankrupt, `currentSpinValue` gets set to `null` and then `render()` is called to update the UI. On a slow frame or a very fast click, there is a tiny window between those two things where the Guess button still appears enabled. If you click it during that window, a consonant guess goes through with no spin on record.

**Steps to reproduce:**

1. Spin and land on Bankrupt
2. Click the Guess consonant button as fast as possible before the UI updates
3. A consonant guess registers even though you have no active spin

**The planned fix:**

Update the render logic so the Guess button is disabled any time `currentSpinValue` is null OR the puzzle is already solved. Right now it only checks for the spin value.

```js
// before
consonantButton.disabled = !this.currentSpinValue;
consonantButton.style.opacity = this.currentSpinValue ? "1" : "0.55";

// after
const canGuess = !!this.currentSpinValue && !this.solved;
consonantButton.disabled = !canGuess;
consonantButton.style.opacity = canGuess ? "1" : "0.55";
```

---

## Wrap Up

Most of these bugs came down to the same root cause: functions that could be called more than once without any protection. Adding simple guard conditions at the top of the relevant methods fixed most of them. The two remaining bugs are understood and have clear solutions written out, they just have not been merged into the codebase yet.
