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

*Created by Team RAM: Mateo, Rashi, and Anika.*
