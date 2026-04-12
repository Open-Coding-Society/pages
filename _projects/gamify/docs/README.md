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
```

## Development Workflow

### Fast Development Mode (Pre-requisite)

**Use `make dev` Only test-loads _projects

Regeneration has dependncy now:

```bash
# macOS
brew install fswatch

# Ubuntu/Debian
sudo apt install fswatch

```

### Build Commands

```bash
# 1. Test make changes
make -C _project/cs-pathway-game
# Should see: ✅ CS Pathway Game built successfully

# 2. Start dev server with auto-watch
make dev
# Should see: 👀 Watching CS Pathway Game project (auto-copy on save)...

# 3. Edit a file in _projects/cs-pathway-game/
# Save changes → should see auto-copy message → Jekyll regenerates

# 4. Clean up
make stop
make clean
# Should clean distributed files but preserve source in _projects/
```

### Edit/Save workflow

1. Edit files in `_projects/gamify/`
   - `notebook.src.ipynb` - converted automatically when saved (via make dev)
   - `levels/*.js` - copied automatically when saved to js/projects
   - `images/*` - copied automatically when added/changed to images/projects

2. Save file → Auto-distribution happens → Jekyll regenerates → Refresh browser

3. See changes immediately at http://localhost:4500/gamify


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

1. **Project-friendly**: All related files in one place, easier to manage project and understand dependendencies
2. **Jekyll-compatible**: Build distributes to required locations
3. **No path complexity**: Code uses final deployed paths
4. **Version control**: Track source files here, generated files ignored
