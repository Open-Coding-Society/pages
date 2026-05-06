---
layout: post
title: CS Pathway Game - Build Integration
description: Guide for integrating CS Pathway Game into Makefile and CI/CD workflows
category: Gamify
breadcrumb: true
permalink: /cs-pathway-game/build-integration
---

## Adding CS Pathway Game to Build System

This project now uses the shared auto-registration build system. You do not need a Makefile fragment or project-specific targets in the root Makefile.

## Current Architecture

The root Makefile provides generic targets that run for every registered project:

- `build-registered-projects`
- `build-registered-docs`
- `watch-registered-projects`
- `clean-registered-projects`

Projects are discovered from `_projects/.makeprojects` and executed with:

```bash
make -C _projects/<project-name> <target>
```

Each project Makefile must expose these generic targets:

- `build`
- `clean`
- `docs`
- `docs-clean`
- `watch`

## Step 1: Register Project

Add one line to `_projects/.makeprojects`:

```text
cs-pathway-game
```

No include lines are required in the root Makefile.

## Step 2: Use the Standard Project Makefile Template

Project Makefiles are template-friendly and infer project name from folder name.
In most cases, the only value you change per project is `DATE_OF_CREATION`.

```makefile
# _projects/<project-name>/Makefile
DATE_OF_CREATION = 2026-04-02
PROJECT_SRC = $(CURDIR)
PROJECT_NAME = $(notdir $(PROJECT_SRC))
NOTEBOOK_FILENAME = $(DATE_OF_CREATION)-$(PROJECT_NAME).ipynb

WORKSPACE_ROOT = ../..
JS_DEST = $(WORKSPACE_ROOT)/assets/js/projects/$(PROJECT_NAME)
IMAGES_DEST = $(WORKSPACE_ROOT)/images/projects/$(PROJECT_NAME)
NOTEBOOK_DEST = $(WORKSPACE_ROOT)/_notebooks/projects/$(PROJECT_NAME)
DOCS_DEST = $(WORKSPACE_ROOT)/_posts/projects/$(PROJECT_NAME)
```

## Step 3: Local Build + Dev Behavior

Local top-level commands already include registered projects:

- `make refresh` runs root `make` flow, which uses `serve-current`
- `serve-current` includes `build-registered-projects` and `build-registered-docs`
- `make dev` starts `watch-registered-projects`

No project-specific watcher wiring is needed in the root Makefile.

## Step 4: CI/CD Behavior

GitHub Actions should call generic registered targets:

```yaml
- name: Build registered projects
  run: |
    make build-registered-projects
    make build-registered-docs
```

This is now the canonical CI integration point (not `make <project>-build`).

## Step 5: Verification

Validate one project directly:

```bash
make -C _projects/cs-pathway-game build
make -C _projects/cs-pathway-game docs
```

Validate all registered projects:

```bash
make build-registered-projects
make build-registered-docs
```

Expected outputs:

- Notebook: `_notebooks/projects/cs-pathway-game/<date>-cs-pathway-game.ipynb`
- Assets: `assets/js/projects/cs-pathway-game/` and `images/projects/cs-pathway-game/`
- Docs: `_posts/projects/cs-pathway-game/<date>-cs-pathway-game-*.md`

## Troubleshooting

### fswatch Not Found
If you see: `⚠️ fswatch not installed`

```bash
# macOS:
brew install fswatch

# Linux:
sudo apt-get install fswatch  # Debian/Ubuntu
sudo yum install fswatch       # RedHat/CentOS
```

### Auto-copy Not Working
1. Check that the project watcher is running via the registered watcher target:

   ```bash
  ps aux | grep "make -C _projects"
   ```

2. Manually trigger copy to test:

   ```bash
  make -C _projects/cs-pathway-game build
   ```

3. Check file permissions:

   ```bash
   ls -la _projects/cs-pathway-game/
   ```

### Jekyll Not Regenerating After Copy
1. Check Jekyll is watching:

   ```bash
   tail -f /tmp/jekyll4500.log
   ```

2. Look for file change events in log when you save

3. Restart dev server:

   ```bash
   make stop
   make dev
   ```

## Summary

After integration, your workflow becomes:
1. **Register once**: add project name to `_projects/.makeprojects`.
2. **Template reuse**: keep generic targets in project Makefile and update `DATE_OF_CREATION`.
3. **Use shared commands**: root Makefile and CI run all registered projects automatically.

No manual build steps needed during development!
