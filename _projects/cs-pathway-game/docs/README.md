---
layout: post
title: CS Pathway Game - Overview
description: Complete documentation for the CS Pathway Game project with unified source-of-truth structure
categories: [Gamify]
permalink: /cs-pathway-game/overview
---

## Directory Structure

**Student-friendly project organization for the CS Pathway gamified learning experience.**

```type
projects/cs-pathway-game/
├── README.md                        [This file - project overview]
├── notebook.src.ipynb               [Source notebook - edit here]
├── levels/
│   ├── GameLevelCSPath0Forge.js    [Level 0: Identity Forge]
│   ├── GameLevelCSPath1Way.js      [Level 1: Wayfinding World]
│   ├── GameLevelCSPath2Mission.js  [Level 2: Mission Tools]
│   └── GameLevelCSPathIdentity.js  [Shared base class]
├── model/
│   ├── ProfileManager.js           [Profile orchestrator]
│   ├── localProfile.js             [Primary localStorage]
│   └── persistentProfile.js        [Backend sync]
├── images/                          [Project-specific images]
│   ├── backgrounds/
│   ├── sprites/
│   └── ui/
└── docs/
    └── README_ARCHITECTURE.md      [Architecture documentation]
```

## Development Workflow

### Fast Development Mode (Recommended)

**Use `make dev` for rapid iteration** - doesn't preload all _notebooks

Regeneration has dependncy now:

```bash
# macOS
brew install fswatch

# Ubuntu/Debian
sudo apt install fswatch

**Edit/Save workflow example:**
1. Edit files in `_projects/cs-pathway-game/`
   - `notebook.src.ipynb` - converted automatically when saved (via make dev)
   - `levels/*.js` - copied automatically when saved (via watch-cs-pathway-game)
   - `model/*.js` - copied automatically when saved
   - `images/*` - copied automatically when added/changed

2. Save file → Auto-distribution happens → Jekyll regenerates → Refresh browser

3. See changes immediately at http://localhost:4500

**BIG TIME SAVINGS**: `make dev` doesn't pre-convert notebooks, only converts on save!

### Complete Build (When Needed)

For explicit full rebuild (rarely needed):
```bash
make                   # Full conversion + serve, alternat is make serve
```

This copies files to Jekyll-required locations:

- `notebook.src.ipynb` → `_notebooks/home/2026-04-02-cs-pathway-game.ipynb`
- `levels/*.js` → `assets/js/GameEnginev1.1/`
- `model/*.js` → `assets/js/pages/home-gamified/`
- `images/*` → `images/gamify/cs-pathway/`

### Path Management

**All paths in code use absolute runtime paths** (no config.js needed):

- JavaScript imports: `/assets/js/GameEnginev1.1/GameLevelCSPath0Forge.js`
- Images via gameEnv: `gameEnv.path + '/images/gamify/cs-pathway/sprite.png'`
- Game engine essentials: `/assets/js/GameEnginev1.1/essentials/Game.js` (external reference)

The build system handles distribution - you just edit here!

## File References

### In notebook.src.ipynb

```javascript
// Imports use final deployed paths (do not use ./relative-paths)
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelCsPath0Forge from '/assets/js/GameEnginev1.1/GameLevelCsPath0Forge.js';

// Images use gameEnv.path (provided by Game.js environment)
const sprite = gameEnv.path + '/images/gamify/cs-pathway/sprites/knight.png';
```

### In level files (GameLevelCSPath*.js)

```javascript
// Import shared model
import { ProfileManager } from '/assets/js/pages/home-gamified/ProfileManager.js';

// Load images via gameEnv (passed from Game.js)
const bg = this.gameEnv.path + '/images/gamify/cs-pathway/backgrounds/forest.png';
```

## Why This Structure?

1. **Student-friendly**: All related files in one place
2. **Jekyll-compatible**: Build distributes to required locations
3. **No path complexity**: Code uses final deployed paths
4. **Version control**: Track source files here, generated files ignored
5. **Migration support**: Can build v1.1 and v1 simultaneously

## Build Details

See Makefile target `cs-pathway-game` for distribution rules.
