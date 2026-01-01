---
layout: post
title: "3.1 Variables & Assignments: Python vs JavaScript"
categories: [Programming Fundamentals, Tutorial]
tags: [python, javascript, variables, assignment, beginner]
description: Learn variables and assignments through the Peppa Pig Maze game
permalink: /peppa-maze/variables
---

# 3.1 Variables & Data Types: Peppa's Maze Adventure

## What Are Variables?

Variables are **named storage locations** that hold data your program needs. Think of them as labeled boxes where you can store information and retrieve it later.

In the Peppa Pig Maze game, variables remember important information:
- Where Peppa is standing in the maze
- How many moves she has left
- Whether it's Peppa's turn or George's turn
- What score each player has

**Why we need variables:**
Without variables, the game would forget Peppa's position every time she moves! Variables let programs remember and update information as the game runs.

## Creating Variables

### Python - Simple Assignment

Python creates variables by just assigning a value:

```python
# No special keyword needed
peppa_x = 0
peppa_y = 0
player_name = "Peppa"
is_moving = False
dice_roll = 4
```

**Variable anatomy:**
- `peppa_x` = variable name
- `=` = assignment operator (means "store this value")
- `0` = the value to store

### JavaScript - Use let or const

JavaScript requires a keyword when creating variables:

```javascript
// Use let for values that change
let peppaX = 0;
let movesLeft = 5;
let animating = false;

// Use const for values that stay the same
const CELL_SIZE = 60;
const peppaName = "Peppa";
const MAZE_WIDTH = 10;
```

**When to use each:**
- `let` - the variable's value will change during the game
- `const` - the variable's value stays constant throughout

---

## Naming Conventions

Different languages have different naming styles. The Peppa Maze uses both!

### Python: snake_case

Python variables use **lowercase with underscores**:

```python
peppa_position = 0
current_player = 1
moves_remaining = 5
waiting_for_answer = False
cell_size = 60
```

**Rules:**
- All lowercase letters
- Use underscores between words
- Descriptive names (not just `x` or `p`)

### JavaScript: camelCase

JavaScript variables use **no spaces with capital letters for new words**:

```javascript
let peppaPosition = 0;
let currentPlayer = 1;
let movesRemaining = 5;
let waitingForAnswer = false;
const cellSize = 60;
```

**Rules:**
- First word lowercase
- Capitalize the first letter of each new word
- No underscores between words
- Descriptive names

### Side-by-Side Comparison

| Python | JavaScript | What it stores |
|--------|------------|----------------|
| `peppa_x` | `peppaX` | Peppa's X position |
| `moves_left` | `movesLeft` | Remaining moves |
| `current_player` | `currentPlayer` | Whose turn it is |
| `waiting_for_answer` | `waitingForAnswer` | Quiz state |

### Why naming matters

Good names make code readable:

```javascript
// Bad - unclear
let x = 5;
let p = 1;
let m = "Hi";

// Good - clear meaning
let movesLeft = 5;
let currentPlayer = 1;
let message = "Hi";
```

---

## Updating Variables

Variables are called "variable" because their values can **vary** - they can change!

### Changing Number Values

The maze constantly updates variables as the game runs:

```python
# Python - Peppa moves right
peppa_x = 2          # Peppa starts at x = 2
peppa_x = peppa_x + 1  # Add 1 to current value
# Now peppa_x = 3
```

```javascript
// JavaScript - same logic
let peppaX = 2;
peppaX = peppaX + 1;  // Take old value, add 1, store result
// Now peppaX = 3
```

**How it works:**
1. Read current value from the variable (2)
2. Calculate new value (2 + 1 = 3)
3. Store new value back in the variable

### Updating After Dice Roll

```javascript
let moves = 0;           // Start with no moves
const diceRoll = 4;      // Roll the dice
moves = diceRoll;        // Store the roll
// Now moves = 4
```

Each time Peppa moves:

```javascript
moves = moves - 1;  // Subtract 1
// If moves was 4, now it's 3
```

### Updating Booleans

Booleans flip between true and false:

```javascript
let animating = false;   // Not moving

// Player presses a key
animating = true;        // Start moving

// Movement finishes
animating = false;       // Done moving
```

### Updating Strings

You can change strings too:

```javascript
let currentMessage = "Roll the dice";
currentMessage = "Peppa's turn!";  // Changed the message
currentMessage = "George's turn!"; // Changed again
```

---

## Variables Working Together

The maze uses multiple variables to track complete game state:

```javascript
// Position variables
let peppaX = 0;
let peppaY = 0;

// Game state variables
let movesLeft = 0;
let currentPlayer = 1;
let animating = false;

// Display variables
let turnMessage = "Peppa's Turn!";
const playerName = "Peppa";
```

**During a turn, these update:**

1. Dice roll: `movesLeft = 4`
2. Player moves: `peppaX = peppaX + 1`, `movesLeft = movesLeft - 1`
3. Animation starts: `animating = true`
4. Animation ends: `animating = false`
5. Turn switches: `currentPlayer = 2`, `turnMessage = "George's Turn!"`

All these variables update to reflect what's happening in the game.

---

## Common Mistakes

### Wrong naming convention

```python
# Bad in Python (JavaScript style)
peppaPosition = 0
movesLeft = 5

# Good in Python
peppa_position = 0
moves_left = 5
```

```javascript
// Bad in JavaScript (Python style)
let peppa_position = 0;
let moves_left = 5;

// Good in JavaScript
let peppaPosition = 0;
let movesLeft = 5;
```

### Using variable before creating it

```javascript
// Bad - trying to use before creating
movesLeft = movesLeft + 5;  // ERROR! movesLeft doesn't exist yet

// Good - create it first
let movesLeft = 0;
movesLeft = movesLeft + 5;  // Now it works, movesLeft = 5
```

### Forgetting quotes for strings

```javascript
// Bad - no quotes
let name = Peppa;  // ERROR! Thinks Peppa is a variable

// Good - use quotes
let name = "Peppa";  // Correctly stores text
```

---

## Key Takeaways

**What are variables?**
- Named storage locations for data
- Remember information while program runs
- Can be read and updated as needed

**Creating variables:**
- **Python**: Just assign: `name = "Peppa"`
- **JavaScript**: Use `let` or `const`: `let name = "Peppa";`

**Naming:**
- **Python**: `snake_case` (underscores)
- **JavaScript**: `camelCase` (capital letters for new words)
- Always use descriptive names

**Updating:**
- Variables can change: `x = x + 1`
- Strings, numbers, and booleans can all be updated
- Updates happen constantly as the game runs

Now you understand how variables store and track information in the Peppa Maze game!
