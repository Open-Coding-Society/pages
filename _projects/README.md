---
layout: post
title: CS Pathway Game - Overview
description: Complete documentation for the CS Pathway Game project with unified source-of-truth structure
category: Gamify
breadcrumb: true
permalink: /cs-pathway/overview
---

## Directory Structure

Project-facing source lives in one project directory.

```text
_projects/cs-pathway/
├── notebook.src.ipynb
├── levels/
├── model/
├── images/
├── docs/
└── Makefile
```

Runtime/distributed outputs are generated into GitHub Pages folder by Makefile:

- _notebooks/projects/cs-pathway/
- _posts/projects/cs-pathway/
- assets/js/projects/cs-pathway/
- images/projects/cs-pathway/

## Build + Dev Workflow

Primary SDLC workflow:

```bash
make dev
```

This is the main build-and-test loop for development. It starts Jekyll and the registered project watchers so edits are copied, converted, and regenerated automatically using POSIX timestamp-based file monitoring.

Validate this project after `make dev` when you want to force a full re-copy of distributed files.

Use this when:

- You renamed files or folders.
- You want to confirm files were copied to expected runtime directories.
- You want to isolate one project's distribution behavior while debugging.

```bash
make -C _projects/cs-pathway build
make -C _projects/cs-pathway docs # docs are not in make dev
```

Validate all registered projects when you need a repo-wide distribution refresh or consistency check.

Use this when:

- Multiple projects were renamed or restructured.
- You want to verify all registered project outputs in one run.
- You want a quick pre-commit sanity check for project distribution.

```bash
make build-registered-projects
make build-registered-docs # docs are not in make dev
```

## CI/CD Targets and Action Logs

GitHub Actions uses the same registered targets:

```yaml
- name: Build registered projects
	run: |
		make build-registered-projects
		make build-registered-docs
```

Expected Actions log lines for project-level visibility:

- `📦 Building project: cs-pathway`
- `📚 Building docs for: cs-pathway`

If docs verification is enabled in workflow, expect summary lines similar to:

- `Registered project docs found: <count>`
- `Sample generated docs:`

These logs are the quickest way to confirm `_projects` registration and distribution are running in CI.

## Path Guidance

Use runtime absolute paths in code.

```javascript
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';
import { ProfileManager } from '@assets/js/projects/cs-pathway/model/ProfileManager.js';

const bg = this.gameEnv.path + '/images/projects/cs-pathway/backgrounds/forest.png';
```

## Registration Model

Project integration into Makefile is registration-based.

1. Add project name to _projects/.makeprojects.
2. Use the project Makefile as a template as it has necessary targets: build, clean, watch, docs, docs-clean.
3. Use the same template pattern as other projects, typically changing only DATE_OF_CREATION.

No Makefile fragments or project-specific root targets are required.

## Version Control Strategy

Track source files in _projects. Treat distributed files as generated artifacts.

```gitignore
# Track source
!_projects/cs-pathway/**

# Ignore generated distribution
_notebooks/projects/cs-pathway/
assets/js/projects/cs-pathway/
images/projects/cs-pathway/
_posts/projects/cs-pathway/
```

## Notes

This README is the primary reference for local dev, validation, and CI behavior.
