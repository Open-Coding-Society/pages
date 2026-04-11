# CS Pathway Game - Quick Start Guide

Welcome! This guide helps you get started with the organized CS Pathway Game project structure.

## What's Different?

**Before:** Files scattered everywhere (notebooks, JavaScript, images in different directories)  
**Now:** All project files in one place: `projects/cs-pathway-game/`

## Quick Start

### 1️⃣ First-Time Setup

Add one line to your Makefile (at the end):
```makefile
include projects/cs-pathway-game/Makefile.fragment
```

Install file watcher (macOS):
```bash
brew install fswatch
```

### 2️⃣ Start Development

```bash
cd ~/pages
make dev
# Server starts at http://localhost:4500
# Auto-watches both notebooks AND project files
```

That's it! The server is now running with automatic file watching.

### 3️⃣ Make Changes

Open your editor:
```bash
cd projects/cs-pathway-game
code .
```

Edit any file:
- `notebook.src.ipynb` - Notebook source (no date prefix needed!)
- `levels/GameLevelCSPath0Forge.js` - Game level code
- `model/ProfileManager.js` - Data persistence
- `images/sprites/knight.png` - Add images

**Save → Auto-copies → Jekyll regenerates → See changes!**

### 4️⃣ View Your Changes

Open browser: http://localhost:4500  
Navigate to your game page (converted from notebook)

### 5️⃣ Stop Server

```bash
make stop
```

## File Structure at a Glance

```
projects/cs-pathway-game/       ← YOUR workspace (edit here)
├── notebook.src.ipynb          ← Friendly name
├── levels/*.js                 ← Game code
├── model/*.js                  ← Data layer
├── images/*                    ← Assets
└── docs/*.md                   ← Documentation

_notebooks/home/                ← Auto-generated (don't edit)
├── 2026-04-02-cs-pathway-game.ipynb

assets/js/                      ← Auto-generated (don't edit)
├── GameEnginev1.1/*.js
└── pages/home-gamified/*.js

images/gamify/cs-pathway/       ← Auto-generated (don't edit)
```

**Golden Rule:** Edit in `projects/`, let build system handle the rest!

## Common Tasks

### Add a New Sprite
```bash
cd projects/cs-pathway-game/images/sprites/
cp ~/Downloads/wizard.png .
# Auto-copies to images/gamify/cs-pathway/sprites/wizard.png
# Use in code: gameEnv.path + '/images/gamify/cs-pathway/sprites/wizard.png'
```

### Update Game Level
```bash
cd projects/cs-pathway-game/levels/
code GameLevelCSPath0Forge.js
# Edit, save
# Auto-copies to assets/js/GameEnginev1.1/GameLevelCSPath0Forge.js
```

### Edit Notebook
```bash
cd projects/cs-pathway-game/
code notebook.src.ipynb
# Edit in Jupyter/VS Code, save
# Auto-copies to _notebooks/home/2026-04-02-cs-pathway-game.ipynb
# Auto-converts to _posts/home/2026-04-02-cs-pathway-game_IPYNB_2_.md
```

### Manual Build (Rarely Needed)
```bash
make cs-pathway-game-build  # Clean + copy all + show status
```

### Clean Everything
```bash
make clean  # Removes distributed files, keeps source
```

## Path References in Code

Always use **final deployed paths** (not relative):

```javascript
// ✅ CORRECT - Absolute deployed paths
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelCsPath0Forge from '/assets/js/GameEnginev1.1/GameLevelCsPath0Forge.js';

// Images via gameEnv.path (provided by Game.js)
const sprite = gameEnv.path + '/images/gamify/cs-pathway/sprites/knight.png';

// ❌ WRONG - Don't use relative paths
import GameControl from '../essentials/GameControl.js';  // NO
import GameControl from './levels/GameLevelCSPath0.js';  // NO
```

Why? Code uses final deployed locations. Build system handles distribution.

## Troubleshooting

### "Files not updating when I save?"
1. Check `make dev` is running: `ps aux | grep jekyll`
2. Check watcher is running: `ps aux | grep watch-cs-pathway-game`
3. View logs: `tail -f /tmp/jekyll4500.log`

### "Need to restart?"
```bash
make stop
make dev
```

### "Want to see what's happening?"
```bash
tail -f /tmp/jekyll4500.log
# Watch for:
# - "Regenerating:" events
# - "CS Pathway Game file changed, copying..."
```

### "fswatch not installed?"
```bash
brew install fswatch  # macOS
```

## Next Steps

1. Read [README.md](README.md) - Full project documentation
2. Read [BUILD_FLOW.md](BUILD_FLOW.md) - How the build system works
3. Read [INTEGRATION.md](INTEGRATION.md) - How to integrate into Makefile/CI
4. Read [docs/README_ARCHITECTURE.md](docs/README_ARCHITECTURE.md) - MVC architecture

## Questions?

- Check logs: `tail -f /tmp/jekyll4500.log`
- Manual build: `make cs-pathway-game-build`
- Clean slate: `make stop && make clean && make dev`

Happy coding! 🎮
