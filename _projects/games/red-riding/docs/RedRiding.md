---
layout: post
title: Red Riding Hood - Overview
description: README starting documentation for the game 
category: Gamify
breadcrumb: true
permalink: /red-riding/overview
---

# CS Pathway Game: The Revelation of Little Red Riding Hood

## Overview

**The Revelation of Little Red Riding Hood** is a multi-level interactive game following the classic fairytale through modern game design and The Software Development Life Cycle (SDLC) Developed by **Team Red** (Anika, Rashi, and Mateo), the game serves as both a narrative journey and a technical showcase of Object-Oriented Programming (OOP) and physics-based mechanics.

## Design Philosophy: Narrative & Mechanics

### Storyline & Plot
The game follows Red on a journey through the digital woods. She must navigate complex environments (woods), manage resources (cookies), and eventually confront the Wolf in level 3 along with his friends in level 4.

- **Level 1: The Gathering (Gravity & State)**
  - **Educational Focus**: Understanding **Gravity** 
  - **Story**: Red must gather cookies for her grandma as gravity keeps her grounded.
  - **Mechanic**: Implementing a gravity constant in the `update()` loop to manage jumping and falling physics.

- **Level 2: The Haunted Woods (Sound & Ambiance)**
  - **Educational Focus**: **Audio Integration** and event-triggered music.
  - **Story**: As Red moves deeper into the forest, the atmosphere shifts.
  - **Mechanic**: Utilizing the `Music` class to loop ambient tracks and trigger specific sound bites when Red interacts with "Story Nodes."

- **Level 3: The Final Stand (Enemy Death & AI Logic)** - **Educational Focus**: **Graded Component**—Complex State Management and Collision Cleanup.
  - **Story**: The confrontation with the Wolf.
  - **Mechanic**: Red must use logic to defeat the Wolf. This involves detecting a specific collision state that triggers the `Enemy Death` sequence, ultimately killing the Wolf.

- **Level 4: The Hunter's Challenge (Collision Mathematics)**
 **Collision Mechanics** and Hitbox Precision.
  - **Story**: A post-story where the player tests their skills in a high-intensity environment.
  - **Mechanic**: Moving beyond simple bounding boxes to refined collision detection, ensuring projectiles and targets interact with pixel-perfect accuracy.

---

Game Objects & Entities

Background: Forest scene using GameEnvBackground with a clipped image
Player: ShooterPlayer (Red Riding Hood) with WASD movement and Q-key shooting
Enemy: Wolf with 5 HP, positioned in upper-middle area
NPC: Grandma with interactive dialogue and mouse click responses
Core Mechanics
Combat System:

Player shoots bullets with Q key (500ms cooldown)
Bullets damage wolf on collision
Wolf has reduced collision box (70% of sprite size) for precise hit detection
Hit markers appear on successful hits
Wolf defeat triggers explosion effect and victory sequence
Collision & Movement:

Player movement blocked when overlapping wolf's collision area
Pushback mechanics prevent player from getting stuck in wolf
Grandma has zero collision dimensions (non-blocking)
Interactive Features:

Grandma Dialogue: Changes based on wolf defeat status
Before defeat: Urges player to kill the wolf
After defeat: Congratulatory message

Mouse Click Interactions:
Click on grandma sprite: "this level doesn't use a mouse deary, my life is currently in danger due to that cloud with bones"
Click within interaction radius: "Deary. HURRY! Q to shoot WASD to move top down esq, figure out the rest #combos"

Visual Effects & UI

Explosion sprite displays for 1 second after wolf defeat
Victory popup with styled message and replay button
Hit markers for visual feedback on successful shots
Console instructions for controls
Technical Architecture
Class Structure:
Event Handling:

Window mousedown listener for grandma interactions
Proper cleanup in destroy method
Coordinate conversion for accurate click detection
Game Flow:

Level initializes with all game objects
Player moves and shoots to defeat wolf
Wolf takes damage, shows hit markers
On wolf defeat: explosion → grandma transformation → victory popup
Grandma provides contextual dialogue throughout
Key Features:

Dynamic dialogue system that responds to game state
Multiple interaction methods (collision, mouse clicks)
Visual feedback for all actions
Proper game object lifecycle management
Responsive design with resize handling
The level successfully combines action gameplay with narrative elements, creating an engaging confrontation scene with interactive NPC elements.

class GameLevelRedRidingHood3
    constructor(gameEnv)     // Initialize level objects
    update()                 // Main game loop logic
    showInstructions()       // Console logging
    handleGrandmaClick()     // Mouse interaction handler
    showGrandmaVictory()     // Victory screen
    resize()                 // Handle window resizing
    destroy()                // Cleanup event listeners


*Created by Team RAM: Mateo, Rashi, and Anika.*
