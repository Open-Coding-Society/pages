---
layout: post
title: Documentation
search_exclude: true
menu: nav/bitshift-nav/doc.html
---

# BitShift Documentation

## Overview

**BitShift** is a 3D educational game developed to teach binary concepts through direct interaction with a simulated environment. The project emphasizes hands-on learning, allowing users to explore the structure and function of binary systems by engaging with digital logic in an intuitive and visual format.

This documentation outlines the core functionality, system architecture, gameplay mechanics, and educational objectives of BitShift.

---

## Features

- **3D Binary Simulation**: Real-time manipulation of binary values in a 3D environment.
- **Modular Puzzle System**: Levels are constructed as discrete modules, each targeting a specific binary or logic concept.
- **Scalable Difficulty**: Puzzle complexity increases gradually to accommodate different learning curves.
- **Engine-Agnostic Design**: Game logic is structured to be portable across engines that support 3D rendering and physics (e.g., Unity, Godot).
- **Extensible Framework**: Easy to add new logic components, puzzles, or teaching modules via configuration files or scripts.

---


## Frontend Layout
![image](https://github.com/user-attachments/assets/12d11622-28c3-499c-b66e-0c1ea7825344)


## Technical Architecture

### Engine

- Scripting Language: `JavaScript`
- 3D Rendering: Native engine renderer with support for camera movement, polygons, and texturing.

### Core Systems

- **Binary Block System**: Objects represent binary digits (`0` or `1`). Each block holds state and triggers logic updates upon interaction.
- **Bit Manipulation Handlers**: Implements shift operations, toggling, and binary logic (AND, OR, XOR) with real-time binary-decimal conversions.
- **Puzzle Validation Layer**: Verifies player input against predefined solutions.
- **UI & Feedback Layer**: Provides binary readouts, success/failure indicators, and state information.

---

## Gameplay Mechanics

### User Interaction

- Click or keybind-based manipulation of bit blocks.
- Shift operations (left/right) using keyboard or interface controls.
- Logic gates dynamically respond to user changes, showing live output.

### Progression

- **Level 1**: Single-bit interaction
- **Level 2**: 4-bit binary representation and conversion
- **Level 3**: Bit shifting (logical and arithmetic)
- **Level 4**: Introduction to logic gates (AND, OR, XOR)
- **Level 5+**: Multi-step logic systems and compound puzzles

---

## File Structure

```text
/BitShift
├── /Assets
│   ├── /Scripts
│   │   ├── BinaryBlock.cs
│   │   ├── PuzzleManager.cs
│   │   └── LogicGate.cs
│   ├── /Prefabs
│   └── /Scenes
├── /Documentation
│   └── README.md
├── /Builds
└── LICENSE
````

---

## Educational Objectives

* Teach binary representation and logic operations through visual, interactive examples.
* Support learning through feedback-driven gameplay.
* Build foundational knowledge applicable to digital electronics and programming.

---

## Requirements

* **Platform**: Windows, macOS, or WebGL-enabled browser
* **Memory**: ~4GB RAM or higher
* **Graphics**: OpenGL 3.3+ or equivalent
* **Input**: Mouse and keyboard

---

## Setup and Deployment

### Web Version

1. Upload WebGL build to a supported web host.
2. Access via modern browser (Chrome/Firefox).

### Local Version

1. Clone the repository.
2. Open the project in VSCode.
3. Build and run using your target platform settings.

---

## Contact

For inquiries, suggestions, or contributions, contact:

* Repository: [https://github.com/Frogpants/Project-Bitshift](https://github.com/Frogpants/Project-Bitshift)

---
