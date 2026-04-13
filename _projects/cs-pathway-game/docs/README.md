---
layout: post
title: CS Pathway Game - Overview
description: Complete documentation for the CS Pathway Game project with unified source-of-truth structure
category: Gamify
breadcrumb: true
permalink: /cs-pathway-game/overview
---

## Directory Structure

Project-facing source lives in one project directory.

```text
_projects/cs-pathway-game/
├── notebook.src.ipynb
├── levels/
├── model/
├── images/
├── docs/
└── Makefile
```

Runtime/distributed outputs are generated into GitHub Pages folder by Makefile:

- _notebooks/projects/cs-pathway-game/
- _posts/projects/cs-pathway-game/
- assets/js/projects/cs-pathway-game/
- images/projects/cs-pathway-game/

## Build + Dev Workflow

Primary SDLC workflow:

```bash
make dev
```

This is the main build-and-test loop for development. It starts Jekyll and the registered project watchers so edits are copied, converted, and regenerated automatically.

Before using live regeneration with `make dev`, install `fswatch`:

```bash
# macOS
brew install fswatch

# Ubuntu/Debian
sudo apt install fswatch
```

Without `fswatch`, the project watcher falls back to manual rebuild instructions instead of auto-regeneration.

Validation this project. These are useful for confirming project copy behavior or isolating a single project's distribution step. Use these in conjunct with 'make dev' to refresh directory and force a full directory regenteration, perhaps after a rename.

```bash
make -C _projects/cs-pathway-game build
make -C _projects/cs-pathway-game docs # docs are not in make dev
```

Validate all project.  These are repo-level validation commands for checking distribution across all registered projects. Use case are similar to make dev.

```bash
make build-registered-projects
make build-registered-docs # docs are not in make dev
```

## Path Guidance

Use runtime absolute paths in code.

```javascript
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import { ProfileManager } from '/assets/js/projects/cs-pathway-game/model/ProfileManager.js';

const bg = this.gameEnv.path + '/images/projects/cs-pathway-game/backgrounds/forest.png';
```

## Registration Model

Project integration into Makefile is registration-based.

1. Add project name to _projects/.makeprojects.
2. Use the project Makefile as a template as it has necessary targets: build, clean, watch, docs, docs-clean.
3. Use the same template pattern as other projects, typically changing only DATE_OF_CREATION.

No Makefile fragments or project-specific root targets are required.

## Notes

For detailed flow and troubleshooting, see the companion build flow doc.
