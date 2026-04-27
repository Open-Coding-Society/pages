# Project Registration System

## Overview

The Makefile uses an **auto-registration system** to discover and include project build rules. This keeps the main Makefile clean and project-agnostic.

## How It Works

### 1. Registry File: `.makeprojects`

A simple text file in the root listing enabled projects:

```text
# Project Auto-Registration
# List enabled projects (one per line, no paths needed)

cs-pathway-game
another-project
third-project
```

**Rules:**

- One project per line
- Project name only (no paths)
- Lines starting with `#` are comments
- Blank lines ignored
- Must have corresponding `_projects/<name>/Makefile`

### 2. Auto-Include in Makefile

The Makefile reads `.makeprojects` and includes each fragment:

```makefile
###########################################
# Project Auto-Registration
###########################################

-include $(shell test -f .makeprojects && \
         grep -v '^\#' .makeprojects | \
         grep -v '^$$' | \
         sed 's|^|_projects/|' | \
         sed 's|$$|/Makefile.fragment|' || echo)
```

**What it does:**

1. Checks if `.makeprojects` exists
2. Filters out comments (#) and blank lines
3. Prepends `_projects/` and appends `/Makefile`
4. Includes each file
5. Uses `-include` (silent if file missing)

### 3. No Project-Specific Targets in Makefile

The main Makefile contains **zero** project-specific code. All project targets come from fragments.

## Project Structure Requirements

Each project must have:

```text
_projects/<project-name>/
├── Makefile                    # REQUIRED - Build rules (usually copied from _template/Makefile)
├── README.md                   # Documentation
├── notebook.src.ipynb          # Source notebook (optional)
├── js/                         # JavaScript source code
├── sass/                       # SCSS definitions (must include a main.scss)
├── levels/                     # Legacy project code
├── model/                      # Legacy data layer
├── images/                     # Assets
└── docs/                       # Project docs
```

### JS and SASS Deployment (Native Pipeline)

Projects can seamlessly deploy standard styles and scripts to the global `assets/` and `_sass` directories:

- **JS**: Any files inside `js/` will be copied to `assets/js/projects/<project-name>/`.
- **SASS**: Any `.scss` files inside `sass/` will be copied to `_sass/projects/<project-name>/`. If a `main.scss` exists inside the `sass/` directory, it configures Jekyll to natively compile the SCSS into `assets/css/projects/<project-name>/main.css`.

### Makefile Requirements

Must define these targets (or variants):

```makefile
# Distribution paths
<PROJECT>_SRC = _projects/<project-name>
<PROJECT>_NOTEBOOK_DEST = _notebooks/projects/<project-name>
<PROJECT>_JS_DEST = assets/js/projects/<project-name>
<PROJECT>_IMAGES_DEST = images/projects/<project-name>

# Build target (silent, for auto-watch)
<project-name>:
 @cp source files to destinations

# Full build (verbose, for manual use)
<project-name>-build: <project-name>-clean
 @echo "Building <project-name>..."
 @make <project-name>

# Clean target
<project-name>-clean:
 @rm -rf distributed files

# Watch target (for make dev integration)
watch-<project-name>:
 @fswatch and auto-copy on changes

.PHONY: <project-name> <project-name>-build <project-name>-clean watch-<project-name>
```

**Naming Convention:**

- Project name: `cs-pathway-game`
- Target prefix: `cs-pathway-game-`
- Main targets: `cs-pathway-game`, `cs-pathway-game-build`, `cs-pathway-game-clean`

## Managing Projects

### List Registered Projects

```bash
make list-projects
```

Output:

```text
📦 Registered Projects:
  ✅ cs-pathway-game (active)
  ⚠️  broken-project (missing Makefile.fragment)

Available projects (in _projects/ directory):
  • cs-pathway-game (registered)
  • new-project (not registered)
```

### Register a New Project

1. Create project directory:

   ```bash
   mkdir -p _projects/new-game/{levels,model,images,docs}
   ```

2. Create `Makefile`:

   ```bash
   cp _projects/_template/Makefile \
      _projects/new-game/Makefile
   # Or copy from an existing project
   ```

3. Add to `.makeprojects`:

   ```bash
   echo "new-game" >> .makeprojects
   ```

4. Test:

   ```bash
   make list-projects        # Verify registration
   make new-game-build       # Test build
   ```

### Disable a Project

Comment out in `.makeprojects`:

```text

# Temporarily disabled
# old-project

cs-pathway-game
```

Or remove the line entirely.

### Re-enable a Project

Uncomment in `.makeprojects`:

```text
old-project    # Re-enabled!
cs-pathway-game
```

## Integration with Main Makefile Targets

### `make dev`

Projects can integrate with dev workflow:

```makefile
# In Makefile
dev: ...existing targets...
 @make watch-cs-pathway-game &
 @make watch-other-project &
```

**Problem:** Hardcoded project names!

**Solution:** Use a pattern or convention:

```makefile
# In main Makefile (future enhancement)
dev: bundle-install jekyll-serve watch-notebooks watch-files watch-all-projects

watch-all-projects:
 @grep -v '^\#' .makeprojects | grep -v '^$$' | while read proj; do \
  if [ -f "_projects/$$proj/Makefile" ]; then \
   make -C _projects/$$proj watch & \
  fi; \
 done
```

### `make clean`

Similar pattern:

```makefile
clean: stop
 @echo "Cleaning converted files..."
 # ...existing clean tasks...
 @echo "Cleaning project distributions..."
 @grep -v '^\#' .makeprojects | grep -v '^$$' | while read proj; do \
  make $$proj-clean 2>/dev/null || true; \
 done
```

### `make stop`

Projects should clean up watchers:

```makefile
stop:
 # ...existing stop tasks...
 @echo "Stopping project watchers..."
 @grep -v '^\#' .makeprojects | grep -v '^$$' | while read proj; do \
  ps aux | grep "watch-$$proj" | grep -v grep | awk '{print $$2}' | xargs kill 2>/dev/null || true; \
 done
```

## Benefits

### ✅ Scalability

- Add 100 projects without touching main Makefile
- Each project self-contained

### ✅ Maintainability

- Project-specific code lives with project
- Main Makefile stays clean and focused
- Easy to understand what's active (one file)

### ✅ Flexibility

- Enable/disable projects easily
- No recompilation or complex logic
- Simple text file configuration

### ✅ Discoverability

- `make list-projects` shows what's available
- Clear separation: registry vs implementation

### ✅ Teaching-Friendly

- Students see their project as a unit
- Copy entire `_projects/example/` to start new project
- No scary main Makefile edits

## Example: Adding a Second Project

```bash
# 1. Create new project structure
mkdir -p _projects/quiz-game/{levels,model,images/sprites,docs}

# 2. Copy template files
cp _projects/_template/Makefile \
   _projects/quiz-game/Makefile
cp _projects/_template/README.md \
   _projects/quiz-game/README.md 2>/dev/null || true

# 3. Edit Makefile
# - Depending on the template used, you may need to update targets.
# - Update paths and targets

# 4. Register the project
echo "quiz-game" >> .makeprojects

# 5. Verify
make list-projects

# 6. Test build
make quiz-game-build

# 7. Integrate with dev (if needed)
# Edit main Makefile dev target:
#   @make watch-quiz-game &
```

## Troubleshooting

### "Project not found"

```bash
make list-projects
# Check if project is:
# - Listed in .makeprojects
# - Has Makefile
# - Named correctly (no typos)
```

### "Targets not working"

```bash
# Check if targets are defined (e.g. build, clean, watch)
grep -A 5 "^build:" _projects/quiz-game/Makefile

# Test make is working
make -C _projects/quiz-game build
```

### "Changes not reflected"

```bash
# Makefile caches includes - restart
make stop
make dev
```

## Future Enhancements

### Auto-Integration with make dev/clean/stop

Could enhance main Makefile to auto-discover watch/clean targets:

```makefile
# Pseudo-code for future
auto-watch-projects:
 @for proj in $(REGISTERED_PROJECTS); do \
  make watch-$$proj & \
 done

REGISTERED_PROJECTS := $(shell grep -v '^\#' .makeprojects | grep -v '^$$')
```

### Project Metadata


### Required Metadata in `.makeprojects`

The `.makeprojects` file now supports a minimal metadata format for each project:

```text
# Format: name[:yes]
cs-pathway-game:yes
quiz-game
docs-only-project
```

- **name**: Project name (matches directory in `_projects/`)
- **:yes** (optional): If present, project is included in `make dev` (regeneration/watch). If absent, project is not included in `make dev` by default.

**Example:**

```text
# Only cs-pathway-game is included in make dev by default
cs-pathway-game:yes
quiz-game
docs-only-project
```

**Rules:**

- All projects must use this metadata format: `name` or `name:yes`
- Only projects with `:yes` are included in the default `make dev` target
- To add a project to `make dev`, append `:yes` to its line in `.makeprojects`
- To remove a project from `make dev`, remove `:yes` from its line

**Managing Inclusion in make dev:**

- Edit `.makeprojects` and add or remove `:yes` for any project you want to auto-watch in `make dev`
- Example command to enable dev/watch for a project:

   ```bash
   # Enable quiz-game for make dev
   sed -i '' 's/^quiz-game$/quiz-game:yes/' .makeprojects
   ```

- Example command to disable:

   ```bash
   # Disable quiz-game from make dev
   sed -i '' 's/^quiz-game:yes$/quiz-game/' .makeprojects
   ```

**Note:** The `make dev` target should be minimal by default. Only essential projects (e.g., `cs-pathway-game`) are included unless explicitly enabled.

### Validation Target

```makefile
validate-projects:
 @echo "Validating registered projects..."
 @grep -v '^\#' .makeprojects | while read proj; do \
  test -f _projects/$$proj/Makefile || echo "⚠️  $$proj missing Makefile"; \
  test -f _projects/$$proj/README.md || echo "⚠️  $$proj missing README"; \
 done
```

## Summary

**Old Way:**

```makefile
# In Makefile - hardcoded!
include _projects/cs-pathway-game/Makefile
include _projects/quiz-game/Makefile
include _projects/another-game/Makefile

dev:
 @make watch-cs-pathway-game &
 @make watch-quiz-game &
 @make watch-another-game &

clean:
 @make cs-pathway-game-clean
 @make quiz-game-clean
 @make another-game-clean
```

**New Way:**

```makefile
# In Makefile - project-agnostic!
-include $(shell grep -v '^\#' .makeprojects | ...)

# In .makeprojects
```text
# Format: name[:dev]
cs-pathway-game:dev
quiz-game
docs-only-project
```

- **name**: Project name (matches directory in `_projects/`)
- **:dev** (optional): If present, project is included in `make dev` (regeneration/watch). If absent, project is not included in `make dev` by default.

**Example:**

```text
# Only cs-pathway-game is included in make dev by default
cs-pathway-game:dev
quiz-game
docs-only-project
```

**Rules:**
- All projects must use this metadata format: `name` or `name:dev`
- Only projects with `:dev` are included in the default `make dev` target
- To add a project to `make dev`, append `:dev` to its line in `.makeprojects`
- To remove a project from `make dev`, remove `:dev` from its line

**Managing Inclusion in make dev:**
- Edit `.makeprojects` and add or remove `:dev` for any project you want to auto-watch in `make dev`
- Example command to enable dev/watch for a project:

   ```bash
   # Enable quiz-game for make dev
   sed -i '' 's/^quiz-game$/quiz-game:dev/' .makeprojects
   ```

- Example command to disable:

   ```bash
   # Disable quiz-game from make dev
   sed -i '' 's/^quiz-game:dev$/quiz-game/' .makeprojects
   ```

**Note:** The `make dev` target should be minimal by default. Only essential projects (e.g., `cs-pathway-game`) are included unless explicitly enabled.
