# Project Registration System

## Overview

The Makefile uses an **auto-registration system** to discover and include project build rules. This keeps the main Makefile clean and project-agnostic.

Projects use a nested category structure such as `_projects/games/<project-name>/` or `_projects/lessons/<project-name>/`.

## How It Works

### 1. Registry File: `.makeprojects`

A simple text file in the root listing enabled projects:

```text
# Project Auto-Registration
# Projects are organized by category
games/cs-pathway:dev
lessons/collision-mechanics
systems/student-management
```

**Rules:**

- One project per line
- Project path in `category/name` format
- Lines starting with `#` are comments
- Blank lines ignored
- Must have corresponding Makefile at path
- Optional `:dev` suffix for auto-build in dev mode

**Supported Structure:**

- `_projects/<category>/<project-name>/Makefile` → registered as `<category>/<project-name>`

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
4. Resolves `category/project` to `_projects/category/project/Makefile`
5. Uses `-include` (silent if file missing)

### 3. No Project-Specific Targets in Makefile

The main Makefile contains **zero** named project-specific code. It applies the same build rules to registered projects and shared category includes.

## Project Structure Requirements

Registered projects use a nested category and project name. Their Makefile is generated from the shared template when needed.

**Nested Structure:**

```text
_projects/<category>/
├── _includes/                  # Optional includes shared by the category
│   └── shared-view.html
└── <project-name>/
   ├── index.md                # Optional project index; use this or index.ipynb
   ├── index.ipynb             # Optional notebook index; never use with index.md
   ├── notebooks/              # Optional lesson notebooks; converted directly
   │   └── lesson.ipynb
   ├── navigation/             # Optional navigation pages and includes
   │   ├── page.md
   │   ├── include.html
   │   └── page.ipynb
   ├── js/                     # JavaScript source code
   ├── sass/                   # SCSS definitions; main.scss is the entry point
   ├── levels/                 # Optional OCS game engine code
   ├── model/                  # Optional model code
   ├── services/               # Optional service code
   ├── data/                   # Optional project data
   ├── images/                 # Assets
   ├── favicon.png             # Optional catalog image
   ├── docs/                   # Optional project documentation
   └── Makefile                # Generated from _projects/_template/Makefile
```

Files under `notebooks/` are converted directly into posts under
`_posts/projects/<project-name>/`; there is no intermediate notebook copy.
`index.ipynb` retains the dated `<date>-<project-name>_IPYNB_2_.md` output in that
directory. The `index.md` and `index.ipynb` files represent the project index,
so a project may provide at most one of them.

One Python invocation handles a project's index, lesson, and navigation
notebooks, with at most four conversion workers by default. A content-based
cache in `.notebook-conversion-cache/` skips unchanged sources, invalidates when
the converter changes or output is missing/modified, and avoids rewriting
identical Markdown. Set `CONVERT_JOBS=1` for sequential conversion or
`CONVERT_FLAGS=--force` to bypass the cache. Batch failures stop Make with the
source filename and error; they do not report success.

Old `_notebooks/projects/` copies are obsolete generated artifacts, not inputs
to global conversion or notebook splitting. Project multi-course posts are
still split from `_posts` by `make split-courses`. Do not hand-edit copied
notebooks, generated posts, or course-split files.

### CSA Curriculum Source Ownership

CSA sources are registered lesson projects under `lessons/cs112`, `lessons/cs113`,
`lessons/csa1`, `lessons/csa2`, and `lessons/ds2`, in that ownership priority order.
Keep one authoritative source even when its topic supports multiple stages.
Notebook lessons belong directly in `notebooks/` (the template does not recurse);
authored Markdown pages belong directly in `docs/`. Include the original year or
variant in a filename when flattening would create a collision. Historical
full-stack Markdown exports without notebook originals are retained as references.

`lesson_group` identifies ownership for the collection indexes. Existing
`courses.csa.week` values still drive the shared CSA timeline, regardless of folder.
CS112/CS113 sources also carry `articulation: {institution: MiraCosta College,
course: CS112}` (or `CS113`), separate from `courses` and without outcome IDs.
This records curriculum alignment, not mastery or awarded credit. Preserve
explicit permalinks, existing course assignments, and lesson bodies when moving
sources; never move or edit generated notebook posts as authoritative lessons.
Project publication regenerates those posts from the new notebook sources.

The curated weeks 13-37 follow `_data/csa.yml`, with at most three primary topic
documents per instructional week across the curriculum and `lessons/java`.
Runner-backed AP FRQs already aligned to CS112 may exceed that limit as
supplemental practice in the matching instructional week. Tag these with
`lesson_type: ap-practice`; they are not new primary topics. Use topic-first
titles such as `FRQ 3 - Array or ArrayList Manipulation - 2017 Exam Q1 - CS112`
and filenames `<date>-frq3-arrays-arraylists-2017-exam-q1-cs112.ipynb`,
preserving the permalink. `ap_frq_category` records the four-question AP
category (1 methods/control, 2 class writing/design, 3 arrays/ArrayLists,
4 2D arrays); `ap_exam_year` and `ap_exam_question` record historical exam
identity separately. Audit the exercise, not its old title or question number.
Use plain-text descriptions, not `{{ page.year }}` or other Liquid expressions
inside frontmatter: cards do not recursively render metadata, and the notebook
converter's unquoted output treats `#` as a YAML comment.
Older exams mixed skills and used different ordering. The leading FRQ number
is a practice classification, not a claim that the historical question was
renumbered or had today's scoring format. Overview pages omit exam identity.
The CS112 and CS113 reports follow MiraCosta's original five-section outlines
and lab outlines, using `_data/cs112_topics.json` and `_data/cs113_topics.json`.
They share `curriculum-outline-report.html` for topic rendering, with separate
course introductions. Map stable source permalinks, not
filenames, titles, or AP question numbers; renamed lessons retain their topic
placement. The report reads current titles, weeks, and supplemental status from
published lesson metadata. A lesson can support multiple subtopics without
changing its schedule. FRQs are taught in CSA2 and beyond; CS112 topic placement
does not move FRQ instruction into CSA1. POJO, JPA, and APIs are introduced in
CSA1 week 4 as an entry point for students with prior APCSP Python Web/API
experience. Later CSA2 and DS2 work deepens these CS112-aligned foundations;
articulation alignment does not impose a minimum teaching week.
Each subtopic shows available material, strengthening
needs, and a PBL observation/extension. Draft links are explicitly unfinished,
and persistence references do not claim file-I/O coverage. Deleted lessons are
not rendered; new unmapped lessons appear in an awaiting-mapping section.
Update the mapping and coverage notes when adding or removing sources. Validate
with `bundle exec ruby scripts/test_cs112_report.rb`.
Validate CS113 with `bundle exec ruby scripts/test_cs113_report.rb`; both use
the shared test support in `scripts/test_support/curriculum_report.rb`.
The CS113 report retains early CSA2 search/sort foundations for AP preparation
and Web projects, with later differentiated DS2 implementation layers.
Library collection use and supplied examples do not establish from-scratch
implementation mastery. Keep missing tree variants, collision resolution,
dynamic programming, and advanced sorting layers explicit rather than treating
unfinished drafts as completed coverage. DS2 ML/AI remains an alternative path.
The exact supplemental selection is recorded in
`tests/fixtures/csa_frq_practice.json`. CSA week cards and sidebar lessons share
title ordering so topic groups also stay together in the lesson player.
Non-runner examples and other unselected
FRQs remain accessible references without a CSA week; do not refill a week
with every alternate example. The expected primary-source
selection is recorded in `tests/fixtures/csa_week_schedule.json` for regression
checks; frontmatter remains the publishing source of truth. Java references
stay in their existing project and do not acquire articulation ownership.

Summative, presentation, AP-review, and finals weeks use one checklist document
with links to previously introduced work, not newly assigned FRQs. The shared
`csa-checkpoint.html` reads the existing week goals. Do not enable challenge
submission on these checkpoints. `lesson_notes` in the course outline identifies
remaining authoring gaps; a library example is not a completed custom
implementation lesson. Keep gaps visible rather than scheduling unfinished drafts.

Unfinished notebook skeletons use `lesson_status: draft`, `hide: true`,
`search_exclude: true`, and `planned_week`, with no `courses` assignment.
The timeline does not use `hide` to exclude lessons, so omitting `courses` is
essential until a draft is ready. Finish the exercise and assessment before
assigning its week and enabling challenge submissions. Advanced CS113 layers
remain differentiated; the DS2 ML/AI collection is a separate project pathway.

Files under `_projects/<category>/_includes/` are copied to `_includes/projects/<category>/`. Project pages reference them with `{% raw %}{% include projects/<category>/shared-view.html %}{% endraw %}`. The generated `_includes/projects/` tree is ignored by Git and removed by `make clean`; edit only the local source under `_projects/`.

**Recommended Categories:**

- `games/` - Interactive game projects and mechanics
- `lessons/` - Educational lessons and tutorials  
- `systems/` - Tools, utilities, and infrastructure projects

### Auto-Generated Makefiles (No Manual Creation Required!)

**The build system automatically generates Makefiles** for all registered projects:

- **Shared Default**: `_projects/_template/Makefile` defines the standard project behavior
- **Auto-Copy on Build**: Registered-project builds and `make generate-makefiles` create or refresh untracked generated Makefiles when the template changes
- **Always Up-to-Date**: Template improvements instantly benefit all projects
- **Versioned Overrides**: Intentional tracked Makefiles are preserved by cleanup without path-specific exceptions

**What this means for you:**

1. ✅ Create new projects without copying/editing Makefiles
2. ✅ Bug fixes in template propagate automatically
3. ✅ Consistent build behavior across all projects
4. ✅ Simpler git diffs (only source code changes)

**First-Time Setup:**
Before building individual projects directly, generate their Makefiles:

```bash
make generate-makefiles
```

This creates Makefiles for all registered projects listed in `_projects/.makeprojects`.

**Build Workflows:**

- **Coordinated builds** (e.g., `make build-registered-projects`, `make dev`) auto-generate Makefiles as needed
- **Direct project builds** (e.g., `make -C _projects/systems/calendar build`) require Makefiles to exist first
- **Incremental builds**: Project pages deploy to `_posts/projects/` which Jekyll watches for automatic incremental rebuilds

**Build Timing & Order:**
The template Makefile copies assets in a specific order to prevent timing issues:

1. **JavaScript files** → `assets/js/projects/<name>/`
2. **SASS files** → `_sass/projects/<name>/`
3. **CSS entry point** → `assets/css/projects/<name>/`
4. **Images** → `images/projects/<name>/`
5. **Page files (LAST)** → `_posts/projects/<name>.md`

**Why LAST?** The page is copied LAST to ensure all dependencies (JS, CSS, images) are in place before Jekyll detects the new page and triggers a rebuild. This prevents "404" or broken styling issues during incremental builds.

### JS and SASS Deployment (Native Pipeline)

Projects can seamlessly deploy standard styles and scripts to the global `assets/` and `_sass` directories:

- **JS**: Any files inside `js/` will be copied to `assets/js/projects/<project-name>/`.
- **SASS**: Any `.scss` files inside `sass/` will be copied to `_sass/projects/<project-name>/`. If a `main.scss` exists inside the `sass/` directory, it configures Jekyll to natively compile the SCSS into `assets/css/projects/<project-name>/main.css`.

### Template Makefile Details

The `_projects/_template/Makefile` is the single source that powers all projects. It includes:

**Smart Depth Detection:**

- Resolves the workspace root from `_projects/<category>/<project-name>/`

**Standard Build Targets:**

- `build` - Copy assets and incrementally publish source notebooks
- `assets` - Copy JS, SASS, images to assets directories
- `notebooks` - Compatibility alias for `convert`
- `convert` - Batch-convert changed index, lesson, and navigation notebooks directly into Jekyll posts
- `convert-single NOTEBOOK_FILE=notebooks/<filename>.ipynb` - Convert only one project source
- `clean` - Remove distributed files (preserves source)
- `watch` - Auto-rebuild on file changes (for dev mode)
- `docs` - Copy documentation to _posts
- `docs-clean` - Remove documentation posts

**Watch System (Timestamp-Based, No External Dependencies):**

- Uses POSIX `find -newer` with timestamp markers
- No fswatch or inotify required
- Individual markers per project: `/tmp/.project_<name>_marker`
- Checks for changes every 2 seconds
- Converts only the edited notebook; rebuilds assets when JS, SASS, or images change
- Filters out Makefile changes to avoid regeneration loops

**Auto-Detection Features:**

- Detects project name from directory
- Handles nested category/project directories
- Silently skips missing source directories (js/, sass/, images/)

### Creating a New Project

Creating a new project is simple - **no Makefile needed!**

**For a nested project:**

```bash
# 1. Create in category subdirectory
mkdir -p _projects/games/my-new-game
mkdir -p _projects/games/my-new-game/js

# 2. Add source files
echo 'console.log("Hello");' > _projects/games/my-new-game/js/game.js

# 3. Register with category path
echo "games/my-new-game" >> _projects/.makeprojects

# 4. Generate its Makefile from the shared template
make generate-makefiles

# 5. Build it
make -C _projects/games/my-new-game build
```

The template Makefile will be automatically copied on first build!

The games catalog is placed by the page author. For a notebook page, add this
Liquid include inside an HTML/UI runner cell where the catalog should appear:

```liquid
{% include games-directory.html %}
```

The catalog heading and description are configured in `_config.yml` under
`games_directory`; game visibility is controlled by each converted page's
`game_directory: true` frontmatter.

Project files placed in a project's `navigation/` directory are published by
the standard project Makefile:

- `.md` files go to `_posts/projects/<project-name>/` with the navigation date prefix.
- `.html` files go to `_includes/projects/<project-name>/`.
- `.ipynb` files convert directly to `_posts/projects/<project-name>/` with the
  navigation date prefix and `_IPYNB_2_.md` suffix.

### Game Catalog Images

For a game with `game_directory: true`, add a project-root `favicon.png`:

```text
_projects/games/<project-name>/favicon.png
```

The project Makefile publishes it to:

```text
images/projects/<project-name>/favicon.png
```

The games catalog uses that file automatically unless the page frontmatter
provides an explicit `image:` value.

### Games Directory Metadata

Converted game pages can opt into the shared Jekyll games directory through
frontmatter in the source notebook or Markdown page:

```yaml
game_directory: true
game_order: 10
game_category: "Game"
image: "/images/projects/my-new-game/thumbnail.png"
```

Use `exclude_from_games: true` when a registered project should not appear in
the directory. The reusable include is `_includes/games-directory.html`; add it
to the HTML content of a page such as CS Pathway after the project page has
been converted. The include reads `site.posts`, so it requires no generated
game list or manual link maintenance.

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
