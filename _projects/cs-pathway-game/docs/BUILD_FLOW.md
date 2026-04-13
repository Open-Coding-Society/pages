---
layout: post
title: CS Pathway Game - Build Flow
description: Understanding the source-to-distribution build flow for CS Pathway Game
category: Gamify
breadcrumb: true
permalink: /cs-pathway-game/build-flow
---

## Problem Statement

Students edit source files in one place, but Jekyll serves content from runtime paths in other places.

- Source notebook: _projects/cs-pathway-game/notebook.src.ipynb
- Runtime notebook: _notebooks/projects/cs-pathway-game/
- Runtime JS: assets/js/projects/cs-pathway-game/
- Runtime images: images/projects/cs-pathway-game/
- Runtime docs: _posts/projects/cs-pathway-game/

Without a build flow, path assumptions drift and CI/local behavior can diverge.

## Solution: Source-of-Truth Project Directory + Distribution

The source of truth remains in _projects/cs-pathway-game/. Project Makefile targets distribute files to Jekyll/runtime locations.

Build one project:

```bash
make -C _projects/cs-pathway-game build
make -C _projects/cs-pathway-game docs
```

Build all registered projects from repo root:

```bash
make build-registered-projects
make build-registered-docs
```

## End-to-End Flow

1. Edit files in _projects/cs-pathway-game/.
2. Project Makefile build target copies notebook/assets/images to runtime locations.
3. Notebook conversion turns copied .ipynb into _posts markdown.
4. Jekyll builds the site from those runtime paths.

Resulting paths:

- Notebook copy: _notebooks/projects/cs-pathway-game/2026-04-02-cs-pathway-game.ipynb
- Notebook post: _posts/projects/cs-pathway-game/2026-04-02-cs-pathway-game_IPYNB_2_.md
- JS levels/model: assets/js/projects/cs-pathway-game/
- Images: images/projects/cs-pathway-game/
- Project docs posts: _posts/projects/cs-pathway-game/

## Path Strategy

Use deployed/runtime paths in code (not source-relative paths).

```javascript
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import Game from '/assets/js/GameEnginev1.1/essentials/Game.js';
import GameLevelCsPath0Forge from '/assets/js/projects/cs-pathway-game/levels/GameLevelCSPath0Forge.js';

const sprite = this.gameEnv.path + '/images/projects/cs-pathway-game/sprites/knight.png';
```

Why this works:

1. Code references final runtime locations.
2. gameEnv.path carries baseurl context for local and deployed environments.
3. No environment-specific path switching is needed in game files.

## Development Mode (make dev)

Current behavior:

1. make dev starts Jekyll and file/notebook watchers.
2. watch-registered-projects starts each project watcher listed in _projects/.makeprojects.
3. Project watch targets sync changed files from _projects/<name>/ to runtime paths.
4. Jekyll regenerates affected pages.

Benefits:

- Fast startup and incremental regeneration.
- Multi-project support without custom root Makefile wiring.

## CI/CD Integration

GitHub Actions should use registered targets:

```yaml
- name: Build registered projects
  run: |
    make build-registered-projects
    make build-registered-docs
```

This is the canonical CI path for project assets and docs.

## Version Control Strategy

Track source files in _projects. Treat distributed files as generated artifacts.

```gitignore
# Track source
!_projects/cs-pathway-game/**

# Ignore generated distribution
_notebooks/projects/cs-pathway-game/
assets/js/projects/cs-pathway-game/
images/projects/cs-pathway-game/
_posts/projects/cs-pathway-game/
```

## Benefits Summary

1. Project-friendly source layout.
2. Consistent local and CI behavior.
3. Reusable project template with minimal per-project changes.
4. Scale to multiple projects through registration.
