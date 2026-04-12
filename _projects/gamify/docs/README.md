---
layout: post
title: Adventure Game - Overview
description: README starting documentation for the adventure game 
categories: [Gamify]
breadcrumb: true
permalink: /gamify/overview
---

## Directory Structure

**Student-friendly project organization for the CS Pathway gamified learning experience.**

```type
projects/cs-pathway-game/
├── notebook.src.ipynb               [Source notebook - edit here]
├── levels/
│   ├── GameLevelWater.js           [Underwater with Gravity]
│   ├── GameLevelDesert.js          [GameObject Samples]
│   ├── GameLevelEnd.js             [Spider Attach Game]
│   └── GameLevelOverworld.js  [Creeper Attack Game]
├── model/                         [Not used]
├── images/                        [40+ Samples] 
└── docs/
    └── README.md                   [This file - project overview]

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

3. See changes immediately at http://localhost:4500/gamify

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

- Images via gameEnv: `gameEnv.path + '/images/gamify/gamify/odtocat.png'`
- Game engine: `/assets/js/GameEnginev1.1/Coin.js`
- Game engine essentials: `/assets/js/GameEnginev1.1/essentials/Player.js`
- Local imports (levels): `./GameLevelDesert.js`

The build system handles distribution - you just edit here!

## File References

### In notebook.src.ipynb

```javascript
// Images use gameEnv.path
const sprite = gameEnv.path + '/images/projects/gamify/knight.png';
// Sample GameEngine import 
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';

```

## Why This Structure?

1. **Student-friendly**: All related files in one place
2. **Jekyll-compatible**: Build distributes to required locations
3. **No path complexity**: Code uses final deployed paths
4. **Version control**: Track source files here, generated files ignored
