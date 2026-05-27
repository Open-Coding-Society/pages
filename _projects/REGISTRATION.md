# Project Registration System

## Overview

The Makefile uses an **auto-registration system** to discover and include project build rules. This keeps the main Makefile clean and project-agnostic.

The system supports **both flat and nested** project structures for flexibility and organization.

## How It Works

### 1. Registry File: `.makeprojects`

A simple text file in the root listing enabled projects:

```text
# Project Auto-Registration
# Supports both flat and nested structures

# Nested projects (organized by category)
games/cs-pathway:dev
lessons/collision-mechanics
systems/student-management

# Flat projects (legacy or uncategorized)
another-project
third-project
```

**Rules:**

- One project per line
- Project path (flat: `name` or nested: `category/name`)
- Lines starting with `#` are comments
- Blank lines ignored
- Must have corresponding Makefile at path
- Optional `:dev` suffix for auto-build in dev mode

**Supported Structures:**

- **Flat**: `_projects/<project-name>/Makefile` → registered as `<project-name>`
- **Nested**: `_projects/<category>/<project-name>/Makefile` → registered as `<category>/<project-name>`

### 2. Auto-Include in Makefile

The Makefile reads `.makeprojects` and includes each project:

```makefile
###########################################
# Project Auto-Registration
###########################################

-include $(shell test -f .makeprojects && \
         grep -v '^\#' .makeprojects | \
         grep -v '^$$' | \
         sed 's|^|_projects/|' | \
         sed 's|$$|/Makefile|' || echo)
```

**What it does:**

1. Checks if `.makeprojects` exists
2. Filters out comments (#) and blank lines
3. Prepends `_projects/` and appends `/Makefile`
4. Supports both `project` → `_projects/project/Makefile` and `category/project` → `_projects/category/project/Makefile`
5. Uses `-include` (silent if file missing)

### 3. No Project-Specific Targets in Makefile

The main Makefile contains **zero** project-specific code. All project targets come from individual Makefiles.

## Project Structure Requirements

Each project must have a Makefile, regardless of structure:

**Flat Structure:**

```text
_projects/<project-name>/
├── README.md                   # Documentation
├── notebook.src.ipynb          # Source notebook (optional)
├── js/                         # JavaScript source code
├── sass/                       # SCSS definitions (must include a main.scss)
├── levels/                     # Legacy project code
├── model/                      # Legacy data layer
├── images/                     # Assets
└── docs/                       # Project docs
```

**Nested Structure:**

```text
_projects/games/<project-name>/
├── README.md                   # Documentation
├── notebook.src.ipynb          # Source notebook (optional)
├── js/                         # JavaScript source code
├── sass/                       # SCSS definitions
├── images/                     # Assets
└── docs/                       # Project docs
```

**Recommended Categories:**

- `games/` - Interactive game projects and mechanics
- `lessons/` - Educational lessons and tutorials  
- `systems/` - Tools, utilities, and infrastructure projects

### Auto-Generated Makefiles (No Manual Creation Required!)

**The build system automatically generates Makefiles** for all registered projects:

- **Single Source of Truth**: Only `_projects/_template/Makefile` is version-controlled
- **Auto-Copy on Build**: When you run any make target, the template is copied to projects missing a Makefile
- **Always Up-to-Date**: Template improvements instantly benefit all projects
- **Clean Repository**: No duplicate build configuration in git

**What this means for you:**
1. ✅ Create new projects without copying/editing Makefiles
2. ✅ Bug fixes in template propagate automatically
3. ✅ Consistent build behavior across all projects
4. ✅ Simpler git diffs (only source code changes)

### JS and SASS Deployment (Native Pipeline)

Projects can seamlessly deploy standard styles and scripts to the global `assets/` and `_sass` directories:

- **JS**: Any files inside `js/` will be copied to `assets/js/projects/<project-name>/`.
- **SASS**: Any `.scss` files inside `sass/` will be copied to `_sass/projects/<project-name>/`. If a `main.scss` exists inside the `sass/` directory, it configures Jekyll to natively compile the SCSS into `assets/css/projects/<project-name>/main.css`.

### Template Makefile Details

The `_projects/_template/Makefile` is the single source that powers all projects. It includes:

**Smart Depth Detection:**
- Automatically detects if project is flat (`_projects/project/`) or nested (`_projects/games/project/`)
- Sets `WORKSPACE_ROOT` correctly for both structures

**Standard Build Targets:**
- `build` - Copy assets and notebooks to distribution directories
- `assets` - Copy JS, SASS, images to assets directories
- `clean` - Remove distributed files (preserves source)
- `watch` - Auto-rebuild on file changes (for dev mode)
- `docs` - Copy documentation to _posts
- `docs-clean` - Remove documentation posts

**Watch System (Timestamp-Based, No External Dependencies):**
- Uses POSIX `find -newer` with timestamp markers
- No fswatch or inotify required
- Individual markers per project: `/tmp/.project_<name>_marker`
- Checks for changes every 2 seconds
- Automatically rebuilds assets when JS, SASS, images, or notebooks change
- Filters out Makefile changes to avoid regeneration loops

**Auto-Detection Features:**
- Detects project name from directory
- Handles both flat and nested directory structures
- Silently skips missing source directories (js/, sass/, images/)

### Creating a New Project

Creating a new project is simple - **no Makefile needed!**

**For a flat project:**
```bash
# 1. Create project directory
mkdir -p _projects/my-new-game

# 2. Add your source files
mkdir -p _projects/my-new-game/js
echo 'console.log("Hello");' > _projects/my-new-game/js/game.js

# 3. Register in .makeprojects
echo "my-new-game" >> _projects/.makeprojects

# 4. Build it (Makefile auto-generated!)
make -C _projects/my-new-game build
```

**For a nested project:**
```bash
# 1. Create in category subdirectory
mkdir -p _projects/games/my-new-game
mkdir -p _projects/games/my-new-game/js

# 2. Add source files
echo 'console.log("Hello");' > _projects/games/my-new-game/js/game.js

# 3. Register with category path
echo "games/my-new-game" >> _projects/.makeprojects

# 4. Build it (Makefile auto-generated!)
make -C _projects/games/my-new-game build
```

The template Makefile will be automatically copied on first build!

## Managing Projects

### List Registered Projects

```bash
make list-projects
```

Output:

```text
📦 Registered Projects:
  ✅ cs-pathway (active)
  ⚠️  broken-project (missing Makefile.fragment)

Available projects (in _projects/ directory):
  • cs-pathway (registered)
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

cs-pathway
```

Or remove the line entirely.

### Re-enable a Project

Uncomment in `.makeprojects`:

```text
old-project    # Re-enabled!
cs-pathway
```

## Integration with Main Makefile Targets

### `make dev`

Projects can integrate with dev workflow:

```makefile
# In Makefile
dev: ...existing targets...
 @make watch-cs-pathway &
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
cs-pathway:yes
quiz-game
docs-only-project
```

- **name**: Project name (matches directory in `_projects/`)
- **:yes** (optional): If present, project is included in `make dev` (regeneration/watch). If absent, project is not included in `make dev` by default.

**Example:**

```text
# Only cs-pathway is included in make dev by default
cs-pathway:yes
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

**Note:** The `make dev` target should be minimal by default. Only essential projects (e.g., `cs-pathway`) are included unless explicitly enabled.

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
include _projects/cs-pathway/Makefile
include _projects/quiz-game/Makefile
include _projects/another-game/Makefile

dev:
 @make watch-cs-pathway &
 @make watch-quiz-game &
 @make watch-another-game &

clean:
 @make cs-pathway-clean
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
cs-pathway:dev
quiz-game
docs-only-project
```

- **name**: Project name (matches directory in `_projects/`)
- **:dev** (optional): If present, project is included in `make dev` (regeneration/watch). If absent, project is not included in `make dev` by default.

**Example:**

```text
# Only cs-pathway is included in make dev by default
cs-pathway:dev
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

**Note:** The `make dev` target should be minimal by default. Only essential projects (e.g., `cs-pathway`) are included unless explicitly enabled.
