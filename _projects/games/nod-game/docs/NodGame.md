---
layout: post
title: Nod Game - Project Documentation
description: Technical breakdown of the Head-Tracking Maze Game
category: Gamify
breadcrumb: true
permalink: /nod-game/overview
---

# Project: Nod Game

## Concept
**Nod Game** is an adaptive skill game designed to test fine motor control using **Mouse-to-Head Tracking**. By removing traditional WASD inputs, the game forces players to engage with the environment through fluid, intentional movement, simulating a high-stakes bypass of a digital security network.

---

## Technical Features

### 1. Motion Logic (The "Nod" System)
The player control isn't 1:1 teleportation. The spark follows a **Vector Pursuit** algorithm:
* **Smoothing**: The player calculates the angle to the cursor and moves at a set velocity of `2.5`.
* **Precision**: This prevents jittery movement and requires players to "lead" the spark through tight corners.

### 2. Level Architecture
The game scales difficulty through **Axis Variation**:
* **Tier 1 (Horizontal)**: Teaches basic left/right timing.
* **Tier 2 (Vertical)**: Tests up/down agility through narrow side-gaps.
* **Tier 3 (Composite)**: A complex layout featuring T-junctions and a "hook" corridor requiring 90-degree precision turns.

### 3. Systems & HUD
* **Dynamic Rendering**: The `MazeRenderer` clears and redraws specific wall arrays based on the `currentLevel` state.
* **Collision Matrix**: Utilizes AABB logic to detect overlaps with a 5-life "Health" system to allow for learning without immediate failure.
* **Minimalist UI**: A raw-text green HUD maintains the "terminal" aesthetic while providing real-time telemetry (Time, Level, Integrity).

---

## Project Structure

| Component | Responsibility |
| :--- | :--- |
| **MazePlayer** | Handles vector-based movement and cyan-glow rendering. |
| **MazeRenderer** | Manages level-specific wall geometry and collision detection. |
| **GameLevelNod** | The core engine; manages the 60fps loop and level transitions. |
| **GameHUD** | DOM-based status overlay with interactive session controls. |

*Developed as an exploration of non-traditional input mechanics.*

Made by Aadi Bhat