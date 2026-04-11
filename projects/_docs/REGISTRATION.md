# Project Registration System

## Overview

The Makefile uses an **auto-registration system** to discover and include project build rules. This keeps the main Makefile clean and project-agnostic.

## How It Works

### 1. Registry File: `.makeprojects`

A simple text file in the root listing enabled projects:

```
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
- Must have corresponding `projects/<name>/Makefile.fragment`

### 2. Auto-Include in Makefile

The Makefile reads `.makeprojects` and includes each fragment:

```makefile
###########################################
# Project Auto-Registration
###########################################

-include $(shell test -f .makeprojects && \
         grep -v '^\#' .makeprojects | \
         grep -v '^$$' | \
         sed 's|^|projects/|' | \
         sed 's|$$|/Makefile.fragment|' || echo)
```

**What it does:**
1. Checks if `.makeprojects` exists
2. Filters out comments (#) and blank lines
3. Prepends `projects/` and appends `/Makefile.fragment`
4. Includes each fragment file
5. Uses `-include` (silent if file missing)

### 3. No Project-Specific Targets in Makefile

The main Makefile contains **zero** project-specific code. All project targets come from fragments.

## Project Structure Requirements

Each project must have:

```
projects/<project-name>/
├── Makefile.fragment          # REQUIRED - Build rules
├── README.md                   # Documentation
├── notebook.src.ipynb          # Source notebook (optional)
├── levels/                     # Project code
├── model/                      # Data layer
├── images/                     # Assets
└── docs/                       # Project docs
```

### Makefile.fragment Requirements

Must define these targets (or variants):

```makefile
# Distribution paths
<PROJECT>_SRC = projects/<project-name>
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
```
📦 Registered Projects:
  ✅ cs-pathway-game (active)
  ⚠️  broken-project (missing Makefile.fragment)

Available projects (in projects/ directory):
  • cs-pathway-game (registered)
  • new-project (not registered)
```

### Register a New Project

1. Create project directory:
   ```bash
   mkdir -p projects/new-game/{levels,model,images,docs}
   ```

2. Create `Makefile.fragment`:
   ```bash
   cp projects/cs-pathway-game/Makefile.fragment \
      projects/new-game/Makefile.fragment
   # Edit for your project
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
```
# Temporarily disabled
# old-project

cs-pathway-game
```

Or remove the line entirely.

### Re-enable a Project

Uncomment in `.makeprojects`:
```
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
		if [ -f "projects/$$proj/Makefile.fragment" ]; then \
			make watch-$$proj & \
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
- Copy entire `projects/example/` to start new project
- No scary main Makefile edits

## Example: Adding a Second Project

```bash
# 1. Create new project structure
mkdir -p projects/quiz-game/{levels,model,images/sprites,docs}

# 2. Copy template files
cp projects/cs-pathway-game/Makefile.fragment \
   projects/quiz-game/Makefile.fragment
cp projects/cs-pathway-game/README.md \
   projects/quiz-game/README.md

# 3. Edit Makefile.fragment
# - Change all "cs-pathway-game" to "quiz-game"
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
# - Has Makefile.fragment
# - Named correctly (no typos)
```

### "Targets not working"
```bash
# Check fragment defines targets
grep -A 5 "^quiz-game:" projects/quiz-game/Makefile.fragment

# Test include is working
make -p | grep quiz-game
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

Could extend `.makeprojects` to include metadata:

```
# Format: name:priority:watch
cs-pathway-game:1:yes
quiz-game:2:yes
docs-only-project:3:no
```

### Validation Target

```makefile
validate-projects:
	@echo "Validating registered projects..."
	@grep -v '^\#' .makeprojects | while read proj; do \
		test -f projects/$$proj/Makefile.fragment || echo "⚠️  $$proj missing fragment"; \
		test -f projects/$$proj/README.md || echo "⚠️  $$proj missing README"; \
	done
```

## Summary

**Old Way:**
```makefile
# In Makefile - hardcoded!
include projects/cs-pathway-game/Makefile.fragment
include projects/quiz-game/Makefile.fragment
include projects/another-game/Makefile.fragment

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
cs-pathway-game
quiz-game
another-game
```

Clean, scalable, maintainable! 🎉
