# GameBuilder and Gamify workspace roadmap

> Discovery and proposed implementation sequence, 2026-10-05.
> No game files have been moved and none of the features below are implemented
> by this document.

## Goal and confirmed scope

Bring Gamify into the GameBuilder system as a reference game students can
load, play, inspect, modify, save, and eventually author through the panels.
Keep ordinary GameEngine JavaScript visible: the workspace is a teaching tool,
not a replacement for learning code.

Confirmed decisions:

- The first persistence milestone is **browser-local save plus portable JSON/source export**, not direct writes into VS Code.
- Preserve existing Gamify behavior. Unsupported components and callbacks stay code-owned while panel support grows; do not simplify or discard them.
- Load/edit/save has priority over new gameplay controls.
- Game-in-Game and gravity are the next workspace feature targets.
- Successful runner source saves must emit an explicit save-state notification that GameBuilder can observe without reaching into editor/storage internals.

This is a discovery roadmap, not a gated, executable migration plan. A formal
feature specification and reviewed design artifacts have not been supplied.
Freeze the document, persistence, and module-loading contracts before turning
these milestones into a final implementation task set.

## What the current code tells us

### Save is incomplete at the workspace boundary

[`BaseRunner`](../../../../assets/js/pages/runners/core/BaseRunner.js) restores
stored editor text and its Save button writes that text through
[`StorageManager`](../../../../assets/js/pages/runners/core/StorageManager.js).
The key comes from the page permalink and runner ID in
[`game.html`](../../../../_includes/runners/game.html).

[`app.mjs`](../js/app.mjs) independently creates a default builder document on
every load. It preserves existing runner code at initialization and asks
before replacing differing code through Generate / Sync Code.

Therefore the current source does **not** establish an unconditional startup
overwrite bug. It does establish a mismatch: saved code returns, but the
matching panel settings do not. Generating from the reset panel can then
replace that saved code after confirmation. Browser reproduction should verify
the reported symptom before changing the shared runner.

Saving only a runner entry module also does not save changes to imported level
files. A complete game save must include the editable module sources.

### Runner save-state contract

Proposed event: `ocs:runner-saved`, dispatched from the runner container and
bubbling within the page. Keep the event generic so other CodeRunner consumers
can reuse it, while GameBuilder filters by its own runner identity.

Proposed versioned detail:

```js
{
  schemaVersion: 1,
  runnerId: "gamebuilder-v2",
  storageKey: "_gamebuilder_v2__gamebuilder-v2",
  source: "<exact source successfully persisted>",
  revision: "<unique save revision>"
}
```

The storage key above is illustrative; use the actual runner key, not a
hardcoded value. The event describes a source save. Game identity, selected
module, and builder configuration belong to the workspace, not the generic
runner. Capture the game/module association at save initiation, especially
if workspace persistence later becomes asynchronous.

- Emit only after storage reports success, for both button and programmatic
  saves through the same save operation. A runner with no persistence key must
  not claim a durable save.
- Expose the saved snapshot/state through the controller for late subscribers.
  Distinguish restored source from a newly completed save; initialization does
  not emit a misleading new-save event.
- Track source dirtiness by comparing current text with the saved snapshot.
  Separately track whether it matches the last generated source and whether
  the panel configuration has changed.
- GameBuilder consumes the notification through `runner-bridge.mjs` and
  captures the matching source/configuration, without automatic generation.
  A failed workspace save leaves the workspace dirty even if source storage
  succeeded.
- For an integrated Save action, provide an explicit awaited workspace-save
  hook. Event dispatch does not await subscribers; do not flash complete-save
  success before workspace persistence completes.
- Save can later offer a bounded AST import preview for panel editing. It is
  not proof that arbitrary JavaScript is builder-compatible. Preserve
  code-owned fields and never trigger a destructive conversion merely because
  source was saved.

Acceptance criteria: one successful save produces one event containing the
exact persisted source; a failed storage write produces no saved event and
visible failure feedback. Another runner's save is ignored by GameBuilder.
Editing after a save marks source dirty; returning to saved text clears that
source flag without falsely clearing pending panel changes. Reload restores
the saved snapshot without regeneration, and a late subscriber can query it.
An integrated workspace-save failure never shows complete-workspace success.

### Gamify is a useful compatibility target, not just a simple fixture

The current source has four entry levels, another nested level, a standalone
minigame, and 41 image files:

| Source | Existing behavior to retain | Initial workspace treatment |
|---|---|---|
| `GameLevelWater.js` | Gravity Player, custom sprite directions, NPC portal, Shark, audio | Source-editable; gravity and portal panels later |
| `GameLevelDesert.js` | Many NPCs, Coin, Clicker, dialogue, AI interactions, nested games and links | Source-editable; preserve callbacks and dependencies |
| `GameLevelEnd.js` | Two Players, parallax and regular backgrounds, Enemy, Collectible, counters and timer | Source-editable; do not force into one Player/background |
| `GameLevelOverworld.js` | Background, Player, Villager, Creeper, custom update behavior and embedded platformer | Source-editable; preserve custom lifecycle code |
| `GameLevelStarWars.js` | Player, turret NPC, two Projectiles, rotations and translation settings | Small source-editing pilot, but not fully panel-supported |
| `PlatformerMini.js` | Custom canvas, gravity, platforms, input, dialogue and exit lifecycle | Preserve as a custom module, not a generated GameEngine level |

The sources are currently under [`gamify/`](../../../games/gamify/).
Imports also reach shared GameEngine modules such as MeteorBlaster, Coin,
Shark, Creeper, Projectile, and AI/dialogue helpers. Shared audio and referenced
external pages must be inventoried as dependencies, not assumed to be owned
Gamify images.

The builder currently supports one background, one Player, NPC greetings, and
spline barriers. Its catalog has only two movement presets; its generator
chooses frame ranges and default timing. That cannot faithfully regenerate all
these levels. In particular, a 3-row mirrored sprite is not equivalent to a
4-row movement preset.

## Proposed ownership and layout

Use GameBuilder as the registered system and Gamify as a bundled example game:

```text
_projects/systems/gamebuilder/
├── index.md                       # Workbench, existing entry point
├── notebooks/
│   └── gamify.ipynb                # Moved play/teaching page; keep /gamify
├── games/
│   └── gamify/
│       ├── game.json              # Identity, entry, ordered levels, dependencies
│       ├── assets.json            # Asset metadata and stable IDs
│       └── levels/                # Preserved ordinary JavaScript sources
├── images/
│   ├── bg/gamify/                 # Background images
│   ├── sprites/gamify/            # Characters and spritesheets
│   └── objects/gamify/            # Items, projectiles, UI art, platform textures
├── js/                            # Existing modules plus focused workspace modules
├── scripts/
│   └── build-game-catalog.mjs      # Proposed deterministic build-time catalog
├── docs/
│   └── gamify/                    # Moved reference-game documentation
└── tests/
```

This layout is proposed, not created. Keep nested games as content of the
registered GameBuilder project, not as deeper independently registered
projects: the current template assumes flat or category/project depth.

Before moving:

- Map every source image and every runtime reference to its new destination.
  Retain unused art as available assets; do not infer its deletion from
  `this.classes`.
- Compare duplicate images against existing GameBuilder lesson assets before
  sharing a single file. Preserve intentional different versions.
- Preserve `/gamify` and its documentation permalinks. Update imports,
  notebook references, registry entries, navigation, and teaching references.
- Maintain generated compatibility copies at old runtime paths when other
  lessons still import them; remove these only after a reference audit.
- Keep generic GameEngine code shared. Moving Gamify does not mean moving or
  duplicating the engine into GameBuilder.

## Workspace document and source ownership

Design a versioned **game document** above the current single-level builder
state. The reviewed contract should cover:

- Stable game ID, name, engine version, ordered level IDs, and starting level.
- Each level's source module path and authoring mode.
- Builder-owned levels: validated panel configuration and the current editor
  source, including whether it differs from the last generated source.
- Code-owned levels: complete original module source, imports, callbacks, and
  custom methods. Supporting modules are saved too.
- Asset IDs, dependencies, and the metadata needed to resolve them.
- Generator/catalog versions or revisions needed to detect stale references.

Do not treat a saved document as a running-game checkpoint: runtime scores,
positions, timers, and progress are a separate feature.

Two deliberate authoring modes prevent destructive conversion:

1. **Builder-owned:** panels generate ordinary JavaScript. Manual edits remain
   saved and runnable; generating again requires explicit replacement consent.
2. **Code-owned:** edit and save source through the existing runner editor.
   The panel can show metadata and unsupported-feature notices, but must not
   generate a simplified replacement.

Panel import comes later. Parse supported syntax with an AST, never execute
constructors or callbacks to discover data. Preview recognized fields and
unsupported expressions. Preserve original source; block conversion if it
would lose behavior. Do not promise arbitrary JavaScript round trips.

## Prioritized milestones and work breakdown

### P1. Complete save/load for the current builder

- Add a focused workspace document/store module under `js/`; keep DOM wiring
  in `app.mjs` and validation separate.
- Add New, Open, Save, Save As, and JSON/source export controls using existing
  OCS styling. Distinguish bundled examples from personal browser drafts.
- Save panel configuration **and current runner text** in one versioned
  workspace record, with stable game identity and selected level.
- Restore a saved record before default initialization. Do not regenerate on
  load or before save; edited source may intentionally differ from panels.
- Retain the existing runner's Save Code behavior for ordinary lesson pages.
  Add an explicit opt-in save integration for GameBuilder so its Save action
  also saves the workspace, with truthful success/error feedback.
- Implement the runner save-state contract above and consume it through
  `runner-bridge.mjs`; keep source saved/dirty, workspace saved/dirty, and
  generated-code synchronization as distinct states.
- Offer recovery of legacy saved runner text as a code-owned draft. Do not
  claim to reconstruct panel state from it.
- Define dirty/conflict prompts for New/Open, level switching, generation,
  clearing storage, and selecting a bundled example. Detect newer stored
  revisions before overwriting another tab's save.
- Treat blocked storage, quota failures, malformed JSON, missing assets, and
  unsupported schema versions as visible errors; retain the last valid save.

**Done when:** create a game with two NPCs and a hidden spline barrier, manually
edit its source, save, reload, and recover both the exact source and all panel
settings. Export/import restores the same document. Failed saves do not show
success. Ordinary lesson Save Code still works.

### P2. Load, edit, and save multi-module games

- Extend the document to ordered levels and editable supporting modules.
- Add game/level selection distinct from GAME_RUNNER's runtime level selector.
  The latter chooses where to play; the former chooses which source to edit.
- Commit the active editor buffer to its module record before switching.
- Keep one GAME_RUNNER editor. Selecting a source module should not create
  another executor or confuse a default-export level with a runnable entry.
- Add bounded module-package execution support around the shared
  `GameExecutor`: run the entry source using saved module text rather than
  accidentally re-importing unchanged published levels.
- Resolve relative imports within the package, allow explicit shared-engine
  dependencies, and diagnose missing modules. Review parser/tooling needs,
  circular imports, module caching, and temporary-URL cleanup before choosing
  the implementation; preserve normal runner execution for other pages.
- Export complete module sources and their relative layout, not only an entry
  wrapper. Document the dependency on the shared GameEngine and asset files.

**Done when:** change a greeting inside one imported level, save/reload, and
play the saved change. A second level and a supporting module retain their
independent edits. Export/import preserves all module source text.

### P3. Build the catalog and move Gamify without rewriting behavior

- Create explicit game and asset metadata alongside preserved source.
- Add the catalog generator and persistent build integration. Use a tracked
  project Makefile override supported by registration, reusing the shared
  template targets; do not rely on editing an ignored generated Makefile.
- Make catalog generation/validation a prerequisite of asset/page publication.
  Extend distribution to nested game source, JSON, and nested docs.
- Generate game listings, asset catalogs, module source URLs, and capability
  notices from metadata. Sort output deterministically.
- Validate unique IDs, files, paths, entry/level/module dependencies, sprite
  grids, direction ranges, and declared shared dependencies. Catalog generation
  must not execute game code.
- Move the notebook, six modules, images, and documentation only after the
  multi-module save milestone works. Remove separate Gamify registration after
  compatibility distribution is covered by GameBuilder.
- Watch game metadata/source and asset changes in `make dev`, including
  deletions/renames. A failed catalog build must not publish a stale catalog
  as if it were fresh.

**Done when:** identical inputs produce identical JSON; an invalid dependency
fails the build visibly. All original entry levels and nested games remain
accessible. Existing `/gamify` links and needed legacy imports still resolve.

### P4. Add assets and selectively enable panel editing

- Start with a repository asset workflow: place the file in the owned image
  folder, add explicit metadata, save, and let `make dev` rebuild the catalog.
- Require stable IDs independent of display names. Image dimensions can be
  detected, but sprite rows/columns, directions, rotations, mirroring, hitboxes,
  and intended roles require authored metadata.
- Separate reusable visual defaults from per-object overrides. One image can
  appear at different sizes or with different animations in different levels.
- Support object art and backgrounds without forcing them into character
  movement presets; migrate current manifests without breaking saved IDs.
- Pilot panel import on supported fields in Star Wars, retaining Projectiles,
  callbacks, and nonrepresentable positions in code mode until preservation
  is demonstrated. Do not label the entire level fully panel-editable.
- Use saved-source notifications to offer import of that exact snapshot, not
  to infer compatibility or automatically rewrite the panel configuration.
- Consider browser asset upload as a distinct follow-up: use persistent binary
  storage, not temporary object URLs or unbounded localStorage strings, and
  export the actual files. Do not advertise upload as saving to the repository.

**Done when:** adding an asset through metadata makes it selectable after a
development rebuild; renaming its display label does not break a save. A
panel edit cannot remove a code-owned component.

### P5. Game-in-Game controls

- Represent an NPC's supported interaction as a declarative action referencing
  a stable child game/level ID. Preserve custom interactions as code-owned.
- Generate the existing `GameControl` nested-game pattern with explicit
  `parentControl`; do not create another general game runtime.
- Validate child targets and cycles; define whether deeper nesting is supported.
- Verify pause, parent canvas visibility, child exit, parent resume, input,
  dialogue, Stop/re-run, and listener/timer cleanup.
- Retain `PlatformerMini` and the embedded Overworld platformer as custom
  integrations until their different canvas/exit lifecycle is supported.

**Done when:** enter and exit a child repeatedly without duplicated controls
or losing the parent level; Stop while nested cleans up both games.

### P6. Gravity controls

- Expose the engine's current Player `GRAVITY` flag first, with clear teaching
  text about its actual falling/movement behavior.
- Preserve gravity through generation, save/load, and supported import.
- Do not conflate this flag with `PlatformerMini`'s independent acceleration,
  jumping, ground, and platform collision implementation.
- Defer configurable platformer physics until a reviewed engine contract exists.

**Done when:** enabled and disabled gravity produce the existing documented
Player behavior, survive save/load, and do not alter ordinary movement.

## Build and verification approach

Use the repository Makefile workflow, not an alternate publishing pipeline:

- `make dev` for the GameBuilder edit/watch loop.
- `make -C _projects/systems/gamebuilder build` for a focused distribution
  check after Makefile generation.
- Registered-project builds for migration/reference compatibility checks;
  retain the existing SASS import-generation ordering.
- Existing Node contract tests plus focused persistence/package fixtures.
- HTTP checks for catalog JSON, modules, images, and retained permalinks.
- Browser checks for exact save/reload recovery, two independently edited
  levels, module execution, dirty-state prompts, nested-game return, and gravity.

Migration comparisons must distinguish pre-existing level defects from
regressions. For example, Water currently uses an older nested-game construction
pattern, while Desert uses `parentControl`. Do not silently modernize both as
part of a directory move. Record failures and handle tightly related fixes in
the feature milestone with explicit behavior checks.

## Requirement coverage

| Requirement | Milestones | Completion evidence |
|---|---|---|
| Load, edit, save complete games | P1, P2 | Exact panel/source restoration and multi-module saves |
| Emit and expose successful runner save state | P1, P4 | Exact saved-source event, queryable snapshot, failure and import safeguards |
| Preserve handwritten code and existing behavior | P1-P5 | Code-owned mode, source preservation, migration comparisons |
| Bring Gamify and GameBuilder together | P3 | One registered system, bundled reference game, retained links |
| Move assets into builder-compatible ownership | P3, P4 | Audited path map, stable metadata, resolving asset references |
| Generate needed JSON through make | P3 | Deterministic catalog and visible build failures |
| Load and modify individual levels | P2, P4 | Independent buffers, saved-source execution, bounded panel import |
| Add assets | P4 | Documented metadata workflow and watch rebuild |
| Support Game-in-Game authoring | P5 | Generated actions and parent/child lifecycle checks |
| Support gravity authoring | P6 | Existing engine flag preserved and verified |

## First implementation slice

Implement **P1 only** first: save/reopen the current builder game, including
manual source edits, without moving Gamify yet. Then add **P2** so moving
Gamify produces genuinely editable saved games rather than a catalog of
imports into read-only published modules.
