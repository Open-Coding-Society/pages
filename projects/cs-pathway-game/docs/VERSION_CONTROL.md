# CS Pathway Game - Version Control Strategy

## Overview
The project uses a **source-distribution** pattern where:
- **Source files** (in `projects/cs-pathway-game/`) are tracked in git
- **Distributed files** (auto-copied by Makefile) are ignored by git

## Directory Structure

### Source (Tracked in Git)
```
projects/cs-pathway-game/
├── notebook.src.ipynb          # Source notebook (friendly name, no date prefix)
├── levels/                     # Game level controllers
│   ├── GameLevelCsPath0Forge.js
│   ├── GameLevelCsPath1Way.js
│   ├── GameLevelCsPath2Mission.js
│   └── GameLevelCsPathIdentity.js
├── model/                      # Profile/persistence models
│   ├── ProfileManager.js
│   ├── localProfile.js
│   └── persistentProfile.js
├── images/                     # Source images (friendly names)
│   ├── backgrounds/
│   │   ├── identity-forge/     # → distributed as bg/
│   │   ├── wayfinding-world/   # → distributed as bg1/
│   │   └── mission-tools/      # → distributed as bg2/
│   ├── npc/
│   ├── player/
│   ├── sprites/
│   └── ui/
├── docs/                       # Documentation (NOT distributed)
│   ├── README_ARCHITECTURE.md
│   ├── BUILD_FLOW.md
│   ├── INTEGRATION.md
│   ├── QUICKSTART.md
│   ├── MIGRATION_COMPLETE.md
│   └── VERSION_CONTROL.md (this file)
├── Makefile.fragment          # Build rules
└── README.md                  # Project overview
```

### Distributed (Ignored by Git)
```
_notebooks/projects/cs-pathway-game/
└── 2026-04-02-cs-pathway-game.ipynb    # Copied from notebook.src.ipynb with date prefix

assets/js/projects/cs-pathway-game/
├── imports.js                          # Auto-generated GameEngine imports
├── levels/                             # Copied from source levels/
└── model/                              # Copied from source model/

images/projects/cs-pathway-game/
├── bg/                                 # Copied from backgrounds/identity-forge/
├── bg1/                                # Copied from backgrounds/wayfinding-world/
├── bg2/                                # Copied from backgrounds/mission-tools/
├── npc/                                # Copied from source npc/
├── player/                             # Copied from source player/
├── sprites/                            # Copied from source sprites/
└── ui/                                 # Copied from source ui/
```

## .gitignore Entries
```
# Project distributions (auto-generated from projects/ source)
_notebooks/projects/
assets/js/projects/
images/projects/
```

## Why This Structure?

### 1. **Version Control Benefits**
- ✅ Only track source files once (no duplicates)
- ✅ No merge conflicts on generated files
- ✅ Cleaner git history and diffs
- ✅ Smaller repository size

### 2. **Student-Friendly Source**
- ✅ Friendly names: `backgrounds/identity-forge/` instead of `bg/`
- ✅ No date prefixes: `notebook.src.ipynb` instead of `2026-04-02-...`
- ✅ Organized by purpose: `levels/`, `model/`, `images/backgrounds/`

### 3. **Production-Friendly Distribution**
- ✅ Preserves established path conventions (`bg/`, `bg1/`, `bg2/`)
- ✅ Date-prefixed notebooks for Jekyll compatibility
- ✅ Relative imports work from distributed locations
- ✅ Images organized for web server caching

## Build Commands

### Development Workflow
```bash
make dev                          # Start dev server + auto-watch (recommended)
# Edit files in projects/cs-pathway-game/
# Save → fswatch auto-copies → Jekyll regenerates
```

### Manual Build
```bash
make cs-pathway-game-build        # Clean + copy + status (verbose)
make cs-pathway-game              # Silent copy only (for auto-watch)
```

### Cleanup
```bash
make clean                        # Clean all distributed files (preserves source)
make cs-pathway-game-clean        # Clean only CS Pathway Game distribution
```

## Generated Files

### imports.js
Auto-generated at `assets/js/projects/cs-pathway-game/imports.js` with centralized GameEngine imports:
```javascript
const GAME_ENGINE_PATH = '/assets/js/GameEnginev1.1';

export { default as GameControl } from `${GAME_ENGINE_PATH}/GameControl.js`;
export { default as GameEnvBackground } from `${GAME_ENGINE_PATH}/GameEnvBackground.js`;
export { default as Player } from `${GAME_ENGINE_PATH}/Player.js`;
// ... etc
```

**Purpose**: Centralize GameEngine version paths in one place. If GameEngine version changes, only update `Makefile.fragment`.

## Path Conventions

### In Source Code
Use **absolute paths** for consistency:
```javascript
// Images (using gameEnv.path)
const bgPath = path + "/images/projects/cs-pathway-game/bg/identity-forge-fantasy.png";

// Levels (imported from distributed location)
import GameLevelCsPath0Forge from '/assets/js/projects/cs-pathway-game/levels/GameLevelCsPath0Forge.js';

// Model (relative from distributed location)
import ProfileManager from '../model/ProfileManager.js';  // From levels/ to model/

// GameEngine (relative from distributed location)
import GameEnvBackground from './essentials/GameEnvBackground.js';  // When at GameEngine path
```

### Directory Name Mapping
| Friendly Source Name      | Production Distribution | Reason                          |
|--------------------------|------------------------|----------------------------------|
| `backgrounds/identity-forge/` | `bg/`               | Established convention (1+ year)|
| `backgrounds/wayfinding-world/` | `bg1/`            | Established convention          |
| `backgrounds/mission-tools/` | `bg2/`              | Established convention          |
| `notebook.src.ipynb`     | `2026-04-02-cs-pathway-game.ipynb` | Jekyll requirement |

## CI/CD Integration

### GitHub Actions Workflow
`.github/workflows/jekyll-gh-pages.yml` includes:
```yaml
- name: Build CS Pathway Game project
  run: make cs-pathway-game-build
```

**Placement**: After Python dependencies, before notebook conversion

**Purpose**: Ensure distributed files exist before Jekyll build in production

## Best Practices

### ✅ DO
- Edit files in `projects/cs-pathway-game/` (source)
- Use `make dev` for development (auto-watch enabled)
- Commit only source files
- Run `make cs-pathway-game-build` before testing major changes

### ❌ DON'T  
- Edit files in `_notebooks/projects/`, `assets/js/projects/`, `images/projects/` (distributed)
- Commit distributed files
- Modify generated `imports.js` manually
- Remove `.gitignore` entries for distribution directories

## Troubleshooting

### Auto-watch not working?
```bash
# Check if fswatch is installed
command -v fswatch  # Should show path

# If not installed:
brew install fswatch

# Restart dev server
make stop
make dev
```

### Files not updating?
```bash
# Manual rebuild
make cs-pathway-game-build

# Check distributed files
ls _notebooks/projects/cs-pathway-game/
ls assets/js/projects/cs-pathway-game/
ls images/projects/cs-pathway-game/
```

### Git showing distributed files?
```bash
# Check .gitignore is correct
grep "projects/" .gitignore

# Should show:
# _notebooks/projects/
# assets/js/projects/
# images/projects/

# Remove from git cache if needed
git rm --cached -r _notebooks/projects/ assets/js/projects/ images/projects/
```

## Future Projects

This pattern can be extended:
```
projects/
├── cs-pathway-game/          # This project
├── another-game/             # Future: Same pattern
│   ├── notebook.src.ipynb
│   ├── levels/
│   ├── model/
│   ├── images/
│   ├── Makefile.fragment
│   └── README.md
└── ...

# Each project gets:
# - Source directory: projects/project-name/
# - Distributed to: _notebooks/projects/project-name/
#                  assets/js/projects/project-name/
#                  images/projects/project-name/
# - .gitignore: All distribution directories ignored
```

##Summary
- **Source**: `projects/cs-pathway-game/` (tracked, student-friendly)
- **Distributed**: `_notebooks/projects/`, `assets/js/projects/`, `images/projects/` (ignored, production-ready)
- **Build**: `make dev` (auto-watch) or `make cs-pathway-game-build` (manual)
- **Version Control**: Only source files tracked, distributed files ignored
- **Path Mapping**: Friendly source names → established production conventions
