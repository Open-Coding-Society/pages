# CS Pathway Game - Build System Flow

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

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BUILD SYSTEM FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STUDENT WORKSPACE (Edit Here)                                              │
│  ───────────────────────────                                                │
│  📁 projects/cs-pathway-game/           ← Single directory for everything   │
│     ├── README.md                                                            │
│     ├── notebook.src.ipynb              ← Friendly name (no date prefix)    │
│     ├── levels/                                                              │
│     │   ├── GameLevelCSPath0Forge.js                                        │
│     │   ├── GameLevelCSPath1Way.js                                          │
│     │   ├── GameLevelCSPath2Mission.js                                      │
│     │   └── GameLevelCSPathIdentity.js                                      │
│     ├── model/                                                               │
│     │   ├── ProfileManager.js                                               │
│     │   ├── localProfile.js                                                 │
│     │   └── persistentProfile.js                                            │
│     ├── images/                         ← Images co-located with code       │
│     │   ├── backgrounds/                                                     │
│     │   ├── sprites/                                                         │
│     │   └── ui/                                                              │
│     └── docs/                                                                │
│         └── README_ARCHITECTURE.md                                          │
│                                                                              │
│                     │                                                         │
│                     │ make cs-pathway-game                                   │
│                     ▼                                                         │
│                                                                              │
│  BUILD DISTRIBUTION (Automatic)                                              │
│  ───────────────────────────────────                                        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ NOTEBOOK: Copy with date prefix                              │           │
│  │                                                              │           │
│  │ projects/cs-pathway-game/notebook.src.ipynb                  │           │
│  │                    ↓ (copy + rename)                         │           │
│  │ _notebooks/home/2026-04-02-cs-pathway-game.ipynb            │           │
│  │                    ↓ (convert_notebooks.py)                  │           │
│  │ _posts/home/2026-04-02-cs-pathway-game_IPYNB_2_.md          │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ GAME LEVELS: Copy to GameEngine directory                   │           │
│  │                                                              │           │
│  │ projects/cs-pathway-game/levels/*.js                         │           │
│  │                    ↓ (copy)                                  │           │
│  │ assets/js/GameEnginev1.1/GameLevelCSPath*.js                │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ MODEL: Copy to home-gamified directory                       │           │
│  │                                                              │           │
│  │ projects/cs-pathway-game/model/*.js                          │           │
│  │                    ↓ (copy)                                  │           │
│  │ assets/js/pages/home-gamified/*.js                           │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ IMAGES: Copy to web-optimized location                       │           │
│  │                                                              │           │
│  │ projects/cs-pathway-game/images/*                            │           │
│  │                    ↓ (recursive copy)                        │           │
│  │ images/gamify/cs-pathway/*                                   │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                              │
│                     │                                                         │
│                     │ bundle exec jekyll build                               │
│                     ▼                                                         │
│                                                                              │
│  DEPLOYED SITE (_site/)                                                      │
│  ───────────────────────                                                    │
│  • All paths work: /assets/js/GameEnginev1.1/...                            │
│  • Images cached: /images/gamify/cs-pathway/...                             │
│  • Notebook rendered as blog post                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Path Strategy: No Config.js Needed!

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

## Workflow Comparison

### BEFORE (Current - Confusing)
```bash
$ cd ~/pages
$ code _notebooks/home/2026-04-02-name.ipynb        # Edit notebook
$ code assets/js/GameEnginev1.1/GameLevelCSPath0.js  # Edit level (far away!)
$ code images/gamify/cs-pathway/sprite.png           # Add image (even farther!)
$ make serve                                          # Full conversion (SLOW)
# Student: "Where did I put that file again?" 🤔
```

### AFTER (Proposed - Simple & Fast)
```bash
# One-time setup: Start dev environment
$ cd ~/pages
$ make dev &                        # Fast dev server (no preload)
$ make watch-cs-pathway-game &      # Auto-copy project files

# Daily workflow: Edit in one place
$ cd projects/cs-pathway-game       # Everything in one place!
$ code notebook.src.ipynb           # Edit → auto-converts on save
$ code levels/GameLevelCSPath0.js   # Edit → auto-copies on save
$ cp ~/Downloads/sprite.png images/sprites/  # Add → auto-copies
# Browser auto-refreshes via Jekyll (LiveReload)
# Student: "Everything's right here and instant!" ✅
```

### Development Mode Details

**make dev workflow:**
1. `make dev` starts Jekyll server WITHOUT pre-converting notebooks (BIG TIME SAVINGS)
2. Jekyll log watcher monitors `_notebooks/*.ipynb` saves → triggers conversion
3. `watch-cs-pathway-game` monitors `projects/cs-pathway-game/**` saves → copies to Jekyll
4. Jekyll detects copied files → regenerates affected pages
5. Browser sees updates

**Key benefits:**
- **Fast startup**: No waiting for full notebook conversion
- **Incremental**: Only converts/copies what you actually edit
- **Automatic**: Save file → see changes (no manual commands)
- **Multi-project ready**: Can watch multiple project directories simultaneously

## Supporting Two GameEngines During Migration

### GameEngine Essentials (Shared - Not Copied)
```
assets/js/GameEnginev1.1/essentials/    ← External reference (singleton)
├── Game.js
├── GameControl.js
├── GameObject.js
├── Player.js
├── StatusPanel.js
├── FormPanel.js
└── ...
```

### GameEngine v1 Projects (if needed)
```
projects/mario-platformer/              ← Another project
├── notebook.src.ipynb
├── levels/
└── ...
```

**Both engines use the same essentials** - they're referenced, not copied:
```javascript
// Both v1 and v1.1 projects import from same location
import Game from '/assets/js/GameEnginev1.1/essentials/Game.js';
```

## Version Control Strategy

### Track Source Files (.gitignore additions)
```gitignore
# Track source (projects/)
!projects/cs-pathway-game/**

# Ignore distributed files (generated by build)
_notebooks/home/2026-04-02-cs-pathway-game.ipynb
assets/js/GameEnginev1.1/GameLevelCSPath*.js
assets/js/pages/home-gamified/ProfileManager.js
assets/js/pages/home-gamified/localProfile.js
assets/js/pages/home-gamified/persistentProfile.js
images/gamify/cs-pathway/
```

Or track everything (simpler for students):
```bash
# Just commit everything - build is idempotent
git add projects/cs-pathway-game/
git add _notebooks/home/2026-04-02-cs-pathway-game.ipynb
git commit -m "Update CS Pathway Game"
```

## Benefits Summary

1. ✅ **Student-friendly**: One directory, obvious organization
2. ✅ **No path magic**: Code uses final deployed paths (simple)
3. ✅ **Jekyll-compatible**: Build distributes to required locations
4. ✅ **Image optimization**: Still in /images for caching
5. ✅ **Date prefix handled**: Makefile adds it automatically
6. ✅ **Migration support**: Multiple projects, shared essentials
7. ✅ **No config.js**: Uses existing gameEnv.path pattern
