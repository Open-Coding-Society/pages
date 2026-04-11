---
layout: post
title: CS Pathway Game - Build Flow
description: Understanding the source-to-distribution build flow for CS Pathway Game
categories: [CS Pathway Game]
permalink: /projects/cs-pathway-game/build-flow
---

## Problem Statement

**Student Confusion**: Files scattered across distant directories

- Notebook in `_notebooks/home/YYYY-MM-DD-name.ipynb` (needs date prefix)
- JavaScript in `assets/js/GameEnginev1.1/` (far from notebook)
- Images in `images/gamify/cs-pathway/` (caching optimization)
- Model in `assets/js/pages/home-gamified/` (another location)

**Path Management Complexity**: 

- Jekyll requires specific locations
- Web server caching rules need `/images`
- Students struggle with relative vs absolute paths

## Solution: Source-of-Truth Project Directory + Build Distribution

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BUILD SYSTEM FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STUDENT WORKSPACE (Edit Here)                                              │
│  ───────────────────────────                                                │
│  📁 _projects/cs-pathway-game/          ← Single directory for everything   │
│     ├── README.md                                                           │
│     ├── notebook.src.ipynb              ← Friendly name (no date prefix)    │
│     ├── levels/                                                             │
│     │   ├── GameLevelCSPath0Forge.js                                        │
│     │   ├── GameLevelCSPath1Way.js                                          │
│     │   ├── GameLevelCSPath2Mission.js                                      │
│     │   └── GameLevelCSPathIdentity.js                                      │
│     ├── model/                                                              │
│     │   ├── ProfileManager.js                                               │
│     │   ├── localProfile.js                                                 │
│     │   └── persistentProfile.js                                            │
│     ├── images/                         ← Images co-located with code       │
│     │   ├── backgrounds/                                                    │
│     │   ├── sprites/                                                        │
│     │   └── ui/                                                             │
│     └── docs/                                                               │
│         └── ARCHITECTURE.md                                                 │
│                                                                             │
│                     │                                                       │
│                     │ make cs-pathway-game                                  │
│                     ▼                                                       │
│                                                                             │
│  BUILD DISTRIBUTION (Automatic)                                             │
│  ───────────────────────────────────                                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ NOTEBOOK: Copy with date prefix                              │           │
│  │                                                              │           │
│  │ _projects/cs-pathway-game/notebook.src.ipynb                 │           │
│  │                    ↓ (copy + rename)                         │           │
│  │ _notebooks/home/2026-04-02-cs-pathway-game.ipynb             │           │
│  │                    ↓ (convert_notebooks.py)                  │           │
│  │ _posts/home/2026-04-02-cs-pathway-game_IPYNB_2_.md           │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ GAME LEVELS: Copy to assets/js                               │           │
│  │                                                              │           │
│  │ _projects/cs-pathway-game/levels/*.js                        │           │
│  │                    ↓ (copy)                                  │           │
│  │ assets/js/projects/cs-pathway-game/levels/*.js               │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ MODEL: to assets/js                                          │           │
│  │                                                              │           │
│  │ _projects/cs-pathway-game/model/*.js                         │           │
│  │                    ↓ (copy)                                  │           │
│  │ assets/js/projects/cs-pathway-game/model/*.js                │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ IMAGES: Copy to web-optimized location                       │           │
│  │                                                              │           │
│  │ _projects/cs-pathway-game/images/*                           │           │
│  │                    ↓ (recursive copy)                        │           │
│  │ images/gamify/cs-pathway/*                                   │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
│                     │                                                       │
│                     │ bundle exec jekyll build                              │
│                     ▼                                                       │
│                                                                             │
│  DEPLOYED SITE (_site/)                                                     │
│  ───────────────────────                                                    │
│  • All paths work: /assets/js/projects/...                                  │
│  • Images cached: /images/gamify/cs-pathway/...                             │
│  • Notebook rendered as blog post                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Path Strategy

**In Code (notebook.src.ipynb and level files):**

```javascript
// Imports use DEPLOYED paths (not ./relative)
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelCsPath0Forge from '/assets/js/GameEnginev1.1/GameLevelCsPath0Forge.js';

// Images use gameEnv.path (already provided by Game.js environment)
const sprite = this.gameEnv.path + '/images/gamify/cs-pathway/sprites/knight.png';

// External reference (shared essentials - not copied)
import Game from '/assets/js/GameEnginev1.1/essentials/Game.js';
```

**Why this works:**

1. Code references final deployed locations (absolute paths)
2. `gameEnv.path` comes from Jekyll's `{{site.baseurl}}` (via notebook)
3. No environment detection logic needed
4. Works locally (localhost:4500) and deployed (GitHub Pages)

### Development Mode Details

**make dev workflow:**

1. `make dev` starts Jekyll server WITHOUT pre-converting notebooks (BIG TIME SAVINGS)
2. Jekyll log watcher monitors `_notebooks/*.ipynb` saves → triggers conversion
3. `watch-cs-pathway-game` monitors `_projects/cs-pathway-game/**` saves → copies to Jekyll
4. Jekyll detects copied files → regenerates affected pages
5. Browser sees updates

**Key benefits:**

- **Fast startup**: No waiting for full notebook conversion
- **Incremental**: Only converts/copies what you actually edit
- **Automatic**: Save file → see changes (no manual commands)
- **Multi-project ready**: Can watch multiple project directories simultaneously

```

## Version Control Strategy

### Track Source Files (.gitignore additions)

```gitignore
# Track source (_projects/)
!_projects/cs-pathway-game/**

# Ignore distributed files (generated by build)
_notebooks/home/2026-04-02-cs-pathway-game.ipynb
assets/js/GameEnginev1.1/GameLevelCSPath*.js
assets/js/pages/home-gamified/ProfileManager.js
assets/js/pages/home-gamified/localProfile.js
assets/js/pages/home-gamified/persistentProfile.js
images/gamify/cs-pathway/
```


## Benefits Summary

1. ✅ **Student-friendly**: One directory, obvious organization
2. ✅ **No path magic**: Code uses final deployed paths (simple)
3. ✅ **Jekyll-compatible**: Build distributes to required locations
4. ✅ **Image optimization**: Still in /images for caching
5. ✅ **Date prefix handled**: Makefile adds it automatically
6. ✅ **Migration support**: Multiple projects, shared essentials
