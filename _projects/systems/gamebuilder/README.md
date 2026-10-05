# GameBuilder System

The source of the GameBuilder pages and their supporting files lives in this
registered project. The project build distributes `index.md` as the v2
`/gamebuilder/v2/` workbench and publishes `docs/BuilderWorkbenchV1.md` as the
original `/gamebuilder/` page. Other documentation is published from `docs/`.

## Source layout

- `index.md` is the runner-backed v2 workbench entry point.
- `docs/BuilderWorkbenchV1.md` retains the original v1 builder page.
- `notebooks/` owns the variables homework, backgrounds lesson, and characters
  lesson. The characters lesson teaches Player and NPC data, instantiation,
  inheritance, and animation through two editable GAME_RUNNER examples.
- `js/` contains scripts owned and distributed by this system.
- `sass/main.scss` is the system's page-scoped stylesheet entry point.
- `images/bg/` and `images/sprites/` contain the starter assets and manifests
  used by the workbench.
- The workbench supports zero or more NPCs, each with its own sprite, greeting,
  and canvas-relative position; generated levels create one `Npc` object per
  configured NPC.
- The workbench supports multiple open spline barriers. Click the shared runner
  preview to add normalized control points; no coordinate inputs are needed.
  Undo point removes the last point added, and Finish barrier completes the
  curve once it has at least two points.
  These controls stay inside the active barrier card; Edit reopens them.
  Each barrier card lists the full control-point sequence,
  which also remains visible in the preview. Cards can hide or show a barrier;
  hidden barriers are invisible but retain their player collision behavior.
  Generated levels create independent `SplineBarrier` objects from the shared
  GameEngine.
- `docs/` retains the existing asset guidance, workbench page, and GameBuilder
  v2 proposal.
- `images/` is reserved for GameBuilder system-owned images. Game/project art
  remains with its owning project.
- Lesson image references use `/images/projects/gamebuilder/`: `bg/` contains
  their backgrounds, `sprites/` their character and projectile images, and
  `lessons/` their instructional illustrations. Copies used by other games are
  retained. Supporting lesson images are not automatically added to the
  workbench sprite manifest; their individual animation settings remain in the
  lesson examples.

Edit these sources under `_projects/systems/gamebuilder/`. The page, JavaScript,
Sass, and images copied into the site directories are generated output.

## Protecting workspace work

The v2 workspace now keeps an automatic browser-local recovery draft of the
panel settings and exact editor code, including unfinished barrier edits and
blank form fields. Reload restores that draft without generating over manual
code. A 200 ms debounce limits writes; page-hide/navigation also flush pending
changes. Browser crashes before a pending write can still lose the latest edit.

- **Save Workspace** keeps one explicit return point, separate from the draft.
- **Load Saved Workspace** returns to that save after replacement confirmation.
- The runner's **Save Code** button also saves the workspace on this page.
  Other runner pages retain their normal source-only save behavior.
- **Export Workspace JSON / Import Workspace JSON** transfer the complete
  single-level workspace. Import validates shape/version and confirms replacement.
- **Export Code** downloads the exact current JavaScript independently.
- **New Workspace** replaces the open workspace/draft after confirmation, but
  keeps the last explicit save.

Saves are local to this browser, origin, and page path: they are not account
backups, runtime progress saves, multiple named projects, or multi-module game
packages yet. Export JSON regularly, particularly before clearing browser data
or changing devices. Missing assets are preserved as unavailable selections;
choose replacements before generation. Invalid files do not replace open work.
Storage failures and cross-tab conflicts stop recovery writes, show an error,
and retain the last valid stored draft. Export open work before resolving them.

`js/workspace-store.mjs` owns versioned validation and storage.
`js/workspace-persistence.mjs` owns controls and recovery wiring. The shared
runner controller emits `ocs:runner-saved` after a successful source write,
exposes its saved snapshot, and awaits GameBuilder's workspace-save hook before
the Save button shows success.

## Build and development

Run the focused checks first when changing GameBuilder logic:

```sh
node --test _projects/systems/gamebuilder/tests/gamebuilder-contract.test.mjs
node --test _projects/systems/gamebuilder/tests/lesson-contract.test.mjs
node --test _projects/systems/gamebuilder/tests/workspace-contract.test.mjs
for file in _projects/systems/gamebuilder/js/*.mjs; do node --check "$file"; done
```

Build only this system's page, JavaScript, Sass, and images with:

```sh
make -C _projects/systems/gamebuilder build
make -C _projects/systems/gamebuilder docs
```

This focused build copies the system's generated files, but does not regenerate
the repository-wide dynamic Sass imports or compile the Jekyll site. For a
one-time, full Jekyll build without starting the server, use:

```sh
make build-current
```

`build-current` performs the full ordered site build: clean, registered project
builds (including dynamic Sass import generation), conversions, course
splitting, documentation publishing, and Jekyll compilation.

For the normal local workflow, use the root Makefile targets:

```sh
make dev
# GameBuilder is registered with :dev; lesson notebooks are copied and converted.
# For a full clean site rebuild instead:
make refresh
# or, to start without first cleaning the generated site:
make
```

`make refresh` stops the current local processes, cleans generated site output,
then invokes the normal `make` workflow. `make` builds registered projects,
converts and splits content, publishes project docs, starts the local site, and
starts the configured watchers. Prefer these project workflow targets over
invoking Jekyll or `bundle exec` directly; the Makefile handles the repository's
environment, build order, server settings, and watchers. Do not run
`make build-current` immediately before `make` or `make refresh` unless you
intentionally want a separate one-time build as well.

### Fast GameBuilder edit-preview loop

Start the reduced development site with `make dev`. GameBuilder's project
watcher copies and converts changed source notebooks as well as updating its
assets. After changing GameBuilder source, you can also rebuild only the system:

```sh
make -C _projects/systems/gamebuilder build
```

The project build copies the page and assets and signals the root
`watch-rebuild` process. That watcher runs Jekyll with incremental mode, so
there is no need to restart the server for each change. Running
`bundle exec jekyll serve` after every focused project build is not the fast
path: it starts a new Jekyll server and performs its initial site build again,
outside the repository's watcher workflow. For changes to documentation under
`docs/`, publish it with `make -C _projects/systems/gamebuilder docs`; use
`make refresh` if the running page does not reflect a change that the watcher
did not pick up.

Use the `Server address` printed by `make` (the default is
`http://localhost:4500/`) and request the workbench page and key published
assets, including any configured base URL:

```sh
curl --fail --silent --show-error --output /dev/null \
  http://localhost:4500/gamebuilder/v2/
curl --fail --silent --show-error --output /dev/null \
  http://localhost:4500/assets/js/projects/gamebuilder/app.mjs
curl --fail --silent --show-error --output /dev/null \
  http://localhost:4500/images/projects/gamebuilder/bg/index.json
```

If all three commands exit successfully, the local site served the workbench,
its application module, and the background manifest. Replace the example
origin or add the configured base URL if the server reports a different
address. Stop the local services with `make stop` when finished. For the
reduced active-project development workflow, use the root `make dev` target.
