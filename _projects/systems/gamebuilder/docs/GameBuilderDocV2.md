# GameBuilder v2 — implementation status and design

> Design and implementation notes retained with the GameBuilder system.
> Updated 2026-10-05.

## Purpose

Reshape GameBuilder into a composition workspace where the student configures a
game on the left and plays/runs it through the existing GAME_RUNNER on the
right. The builder should produce ordinary GameEngine level code that can be
inspected, edited, saved, and reused outside the builder.

The v1 builder remains available at `/gamebuilder/`. The v2 workbench is
available at `/gamebuilder/v2/`, with system source kept under
`_projects/systems/gamebuilder/`, following the
`_projects/systems/calendar/` project pattern.

## Current implementation snapshot

The current v2 page is a working, runner-backed builder for a game name,
background, player, zero or more NPCs, and multiple open spline barriers. It
generates a standard GameEngine level module and sends it to the existing
GAME_RUNNER editor. GAME_RUNNER remains the only code editor and execution
surface; GameBuilder does not create a second canvas, game loop, or executor.
Replacing runner code is explicit and prompts for confirmation when existing
code differs from the last generated version.

The system also owns the lesson notebooks under `notebooks/`. The characters
lesson at `/game/essentials/characters` connects generated data to object
literals, constructors, inheritance, spritesheet indexes, and animation. Its
two editable GAME_RUNNER examples progress from a Player to a Player with two
NPC instances. The backgrounds and characters lessons use system-owned assets
published under `/images/projects/gamebuilder/`, rather than another game's
distribution. GameBuilder is registered for `make dev`; its notebook watcher
copies and converts source lesson changes for the local preview.

### Current page composition

```text
GameBuilder v2 page
├── Shared OCS navigation and page links
├── Workbench heading with builder collapse/reopen control
├── Live status message
└── Responsive workbench
    ├── Left: Level setup (.ocs__card)
    │   ├── Generate / Sync Code
    │   ├── Game name
    │   ├── Environment fieldset: background selection
    │   ├── Player fieldset: name, sprite, normalized X/Y position
    │   ├── NPCs fieldset: Add NPC and repeatable NPC configuration cards
    │   │   └── Each NPC: name, sprite, normalized X/Y position, greeting
    │   └── Spline barriers: point placement, coordinate list, undo, edit,
    │       visibility, finish/cancel, and removal controls
    └── Right: shared GAME_RUNNER include
        ├── Existing runner controls and source editor
        └── Game output/canvas
```

On wide screens, the builder occupies the left quarter of a full-width
workspace and the runner uses the remaining width. The builder can collapse
to give the runner the full workspace. At mobile widths, the panels stack.
Controls use semantic fieldsets, labels, inputs, selects, and buttons, enhanced
with GameBuilder-scoped OCS classes and preference-aware theme tokens.

Generated code defines `backgroundData`, `playerData`, and one named
`npcDataN` or `barrierDataN` object per configured object separately, then
references those data objects in `this.classes`. Barrier points are stored in
normalized 0–1 coordinates and rendered/collided by the reusable
`assets/js/GameEnginev1.1/essentials/SplineBarrier.js` class. The asset
manifests and focused `.mjs` modules are authored under
`_projects/systems/gamebuilder/` and distributed by the registered project
build.

### Workspace persistence (implemented)

The workspace now automatically keeps a browser-local recovery draft, including
exact editor source, panel settings, unfinished barrier edits/cancel snapshots,
object counters, engine selection, and builder visibility. Draft writes are
debounced by 200 ms and flushed on page hide/navigation. Reload restores the
draft without regenerating code. Save Workspace keeps a separate explicit
return point; Load Saved Workspace restores it after confirmation.

Export/import workspace JSON and exact JavaScript export are implemented.
Runner Save Code also saves this workspace through an awaited opt-in hook.
Storage failures/conflicts are visible and stop automatic writes; invalid
imports do not replace open work. These are single-level, one-return-point
saves local to the browser/origin/page, not named game libraries or account
backups. Export remains important: clearing browser data removes local saves,
and a crash before a pending draft write can lose the latest edit.

### Still not implemented

AST-based code-to-panel import, multi-module game loading/saving, named
workspace libraries, Gamify relocation, and direct writing into VS Code remain
future work. NPC, spline barriers, and single-level workspace persistence are
implemented.

## Current state and reuse opportunities

- The original v1 builder is retained in
  [`BuilderWorkbenchV1.md`](./BuilderWorkbenchV1.md) and published at
  `/gamebuilder/`. It has an Assets/configuration column and a main column with
  its own game preview, barrier-drawing overlay, and code editor. Its inline
  application code owns the asset controls, builder state, code generation,
  and execution path.
- `../index.md` is the v2 workbench entry point, published at
  `/gamebuilder/v2/`; it uses the shared GAME_RUNNER rather than the v1
  execution path.
- Code generation is already compositional: `gamelevel_code()` builds a
  `GameLevelCustom` class and exports `gameLevelClasses`, while
  `step_generate()` gathers configured background, player, NPC, and wall
  definitions. This is a useful starting point for a builder model and
  generator, rather than a reason to retain v1's custom runner.
- `_includes/runners/game.html` already provides the GAME_RUNNER editor,
  run/pause/stop/fullscreen and level controls, status, and game output. It
  uses `BaseRunner` and `GameExecutor`, and expects editable code to export
  `gameLevelClasses`.
- `BaseRunner.setValue()` updates the runner's editor model; callers should use
  that API instead of writing directly to a textarea or CodeMirror instance.
  The runner keeps code in local storage under its storage key, so code and
  builder configuration need distinct persistence keys and an explicit
  precedence rule.
- The generic OCS `.ocs__container` is capped at 900px, so the v2 page
  overrides its workbench to use the available width and defines its
  responsive columns in
  [`sass/main.scss`](../sass/main.scss). That stylesheet documents each visual
  section alongside its rules with SassDoc-style purpose, reuse, and usage
  notes; keep implementation-specific styling guidance there rather than
  duplicating it here.
- Asset documentation recommends JSON manifests because directory listings may
  not work on GitHub Pages. Background manifests list `name` and `src`;
  spritesheets add `rows` and `cols`. These should be the builder's reliable
  asset source.
- `_projects/systems/calendar/` is a working example of a distributable system
  with `index.md`, focused JS modules, Sass, documentation, and a project
  Makefile. Its build copies generated page/assets to their site destinations;
  developers continue to edit the sources in `_projects`.
- `_projects/games/gamify/` demonstrates the OCS game-project workflow:
  source-owned level files and images are built/copied to site runtime paths.
  Its levels also demonstrate object literals with callbacks and references to
  imports and local variables, which a code importer must handle conservatively.

## Target product boundaries and future workspace

### Next priority: saved games and the Gamify reference game

The next workspace priority is loading, editing, and saving complete games,
followed by bringing Gamify and its levels into this registered system.
See [GameBuilder and Gamify workspace roadmap](./GamifyWorkspaceRoadmap.md)
for the source findings, proposed ownership, ordered milestones, and
verification criteria. This is a plan, not an implemented migration.

The first save milestone will use browser-local persistence plus portable
JSON/source export. Existing Gamify behavior must be retained; unsupported
objects, callbacks, and custom minigames remain code-owned until panel support
can preserve them. Multi-module saves must retain actual level sources, not
just a runner entry module that imports the published originals. Game-in-Game
and the existing Player gravity flag follow the load/edit/save foundation.

At the planning baseline, GAME_RUNNER restored editor text while GameBuilder
reset its panel configuration on reload. The implemented workspace recovery
now restores both. Startup does not regenerate over saved manual source.

### Navigation and product boundaries

- **Home** remains the student-built onboarding adventure. GameBuilder should
  link to it, not replace or take ownership of it.
- **Games** is the collection that GameBuilder should ultimately help create.
  Keep it distinct from the onboarding adventure and make the intended
  authoring path clear: configure/build in GameBuilder, then publish or add the
  resulting game to the Games collection.
- **GameBuilder** is the authoring system itself. Keep these destinations
  together in one compact title/navigation bar; the active navigation item
  identifies the page, so a second large GameBuilder title is redundant.
- Documentation and play/test shortcuts belong at the far end of that bar and
  should remain accessible by keyboard with descriptive labels.

```text
GameBuilder page
└── .ocs__container.ocs__gamebuilder
    ├── workspace header
    │   ├── project name and save/load controls
    │   ├── builder panel visibility control
    │   └── builder/code mode controls
    └── .ocs__gamebuilder-workspace
        ├── Builder panel (left)
        │   ├── Environment
        │   ├── Player
        │   ├── NPCs / objects
        │   └── Walls / barriers
        └── GAME_RUNNER panel (right)
            ├── standard GAME_RUNNER controls and code editor
            └── game output
```

The left side is the authoring surface: forms, asset selection, object
properties, and point placement. The right side is the canonical execution
surface: use GAME_RUNNER to edit and run the generated level code.
Do not maintain a second canvas lifecycle, run loop, or game editor in
GameBuilder.

The builder panel should be collapsible from a clearly labeled, keyboard
accessible control in the workspace header. Collapsing it gives the runner
more room without switching pages or discarding builder state. Expose the
control's state with `aria-expanded` and `aria-controls`; retain a visible way
to reopen the panel. On narrow screens, the same control can hide/show the
builder above the runner. Persisting the collapsed state is optional UI
preference, not part of the game document.

On wide screens, give the builder a narrower, independently scrollable column
and the runner the remaining width. When collapsed, the runner should take the
available workspace width. On tablet/mobile widths, stack the panels with the
builder first and the runner second. Keep controls keyboard accessible and
avoid fixed viewport heights that hide builder fields or runner controls. The
runner's canvas should size from its actual output container, as it already
does.

Use semantic OCS classes for the workspace and panels, and existing
`.ocs__btn` controls, inputs, tables, and callouts where applicable. The
workspace should use theme variables and existing OCS tokens; avoid hard-coded
colors and inline styles. Keep the scoped workspace styles and section-level
purpose/reuse/usage documentation in
[`sass/main.scss`](../sass/main.scss), rather than extending generic OCS layout
rules for this page.

## Data flow

Keep three representations distinct:

1. **Builder document** — versioned structured configuration; the source of
   truth for the left-side controls.
2. **Generated level code** — deterministic JavaScript generated from the
   builder document and inserted into the GAME_RUNNER editor.
3. **Runner execution state** — the code currently in GAME_RUNNER and the
   live game instance controlled by `GameExecutor`.

The flow is:

```text
asset manifests + builder document
                ↓
          validate/generate
                ↓
GAME_RUNNER BaseRunner.setValue(generated code)
                ↓
       GAME_RUNNER Run
                ↓
        GameExecutor
```

The intended local-development workflow is to run the site and GameBuilder on
localhost while editing source files in VS Code. VS Code/Git remain the source
of truth for project artifacts; the browser is the interactive authoring,
preview, and code-transfer surface. Build/watch distribution should make
changes from `_projects/systems/gamebuilder/` visible on the local site.
Browsers cannot write arbitrary files into a VS Code workspace directly, so
the first version should transfer code/configuration through explicit
download/upload or copy/paste. Do not imply that localhost grants workspace
file access. A local bridge/server that writes files would be a separate,
explicitly secured feature.

### Builder document shape

Start with a small, explicitly versioned JSON document. Exact field names are
implementation details, but its contents should cover:

```json
{
  "schemaVersion": 1,
  "name": "My Game",
  "backgroundKey": "alien_planet",
  "player": {
    "name": "Player",
    "spriteKey": "chillguy",
    "position": { "x": 0.5, "y": 0.8 }
  },
  "npcs": [],
  "barriers": [
    {
      "id": "barrier-1",
      "name": "Barrier 1",
      "points": [{ "x": 0.1, "y": 0.3 }, { "x": 0.5, "y": 0.25 }, { "x": 0.9, "y": 0.3 }]
    }
  ]
}
```

This is the current v2 document shape. The background is selected by its
manifest-derived key; player and NPC positions are normalized from 0 to 1.
Each barrier is an open spline with at least two normalized control points.
During authoring, click the GAME_RUNNER preview directly to add points.
There are no coordinate-editing inputs, Add point button, or separate placement
panel. **Undo point**, **Finish barrier**, and **Cancel** live inside the active
barrier card. Undo works as a stack: each press removes the most recently added
point. Finish requires at least two points. **Edit** reopens the same controls
for a completed barrier; Cancel restores its points from before editing.
Finish the active barrier before generating code. Each completed barrier can
be hidden, shown, or removed from its card. Hidden barriers are
not drawn in the editor or runtime, but remain collision obstacles. Editing a
hidden barrier temporarily displays its curve and markers without changing its
saved visibility. Curves are
smoothed with Catmull–Rom interpolation by the shared GameEngine class.
Control-point markers are shown while a barrier is being edited, and each card
lists every point's X/Y coordinates. The runtime renderer uses the OCS accent
color. During game updates, the runtime class resolves player overlap against
the spline. Barriers and NPCs resize with the logical canvas dimensions, not
the browser's incidental display pixels.

Store manifest keys (or another stable asset identifier), not display labels or
duplicated asset metadata. At generation time, resolve keys through the
manifest-derived asset catalog and report missing assets as visible validation
errors. Player/NPC positions and spline control points use normalized
coordinates from 0 through 1, mapped against the runner's logical game
dimensions at runtime rather than persisting incidental screen pixels.

Keep the schema extensible for future object types, but do not build a generic
plugin system until there is a real second use case. Treat each object as a
typed record with a stable ID and explicit type/properties.

### Code generation and runner integration

Extract the generator from the inline v1 page code into a focused module. It
should accept validated builder data and an asset catalog, and return either
complete level source code or structured validation errors. Keep output
compatible with the GAME_RUNNER contract (`gameLevelClasses` export and
GameEngine imports); reuse/adapt v1's existing level-template logic where
practical.

Reuse `_includes/runners/game.html` with a unique `runner_id` for the GameBuilder
instance. The include currently owns its `BaseRunner` and `GameExecutor` in a
module-local closure, so a small explicit integration hook is needed to let the
builder set code and invoke the runner without reaching into editor internals.
Expose only the minimum page-scoped controller operations needed, such as
`setCode`, `run`, and `stop`, or an equivalent runner-ready callback. `setCode`
must delegate to `BaseRunner.setValue()` so editor content and the code read by
`GameExecutor` stay synchronized.

Do not silently replace manually edited code when a builder field changes:

- Changes to builder settings mark generated code as out of date.
- An explicit **Generate / Sync Code** action validates the configuration and
  updates the GAME_RUNNER editor.
- If the editor contains unsaved manual edits, confirm before replacing them.
- Running the game always runs the current GAME_RUNNER editor contents. This
  preserves the runner's value as the executed source and keeps manual code
  exploration possible.
- After applying generated code, the user can switch to code mode and edit it.
  The builder document remains the last saved structured configuration; manual
  code edits do not implicitly rewrite it.

This explicit boundary avoids a confusing two-way sync between arbitrary
JavaScript and structured form fields.

### Object-literal-aware code import

GameBuilder should be able to import supported level code from the GAME_RUNNER
editor and populate the left-side panels. In particular, it should recognize
the object-literal configuration patterns used by GameEngine levels: background
data, player/NPC data, typed objects, and the `this.classes` entries that pair
a GameEngine class with its `data`.

This is a structured source-code import, not reverse execution and not a
promise to round-trip arbitrary JavaScript. Implement it with a JavaScript
parser/AST (select the dependency after checking repository tooling), never
regular-expression scraping or `eval`. Identify bindings and references so a
literal such as `data: sprite_data_tux` can be associated with its declaration.
Resolve supported asset path expressions such as `path + "/images/..."` into
project-relative asset references where the manifest/catalog can identify
them.

Recommended interaction:

1. The user selects **Import from Code** while the runner editor contains the
   source to inspect.
2. The importer parses the module and reports syntax errors without changing
   the current builder document.
3. It shows a preview of recognized levels and objects, with a mapping from
   each source binding to the builder section it will populate.
4. The user accepts the import. The importer updates builder state as one
   operation and marks generated code as synchronized to that imported
   document.
5. The user can then change supported fields in the panels and explicitly
   regenerate code.

Support a deliberately bounded subset first: static object literals; nested
plain object/array values; supported identifiers that refer to other
object-literal declarations; known GameEngine class references; and documented
asset path expressions. Preserve source spans and unrecognized properties or
expressions as opaque source when practical. If a value depends on arbitrary
runtime logic (for example a function, computed property, conditional
expression, or unsupported constructor), keep it in the code and mark it as
code-owned/read-only rather than inventing a panel value or dropping it.
Callback fields such as `interact` and `reaction` are executable code, not
ordinary form data; preserve them unchanged unless a future dedicated code
editor for callbacks is added.

Import must be non-destructive. Show unsupported constructs and fields in the
preview, distinguish fully editable fields from preserved code-owned fields,
and leave the runner source untouched until the user explicitly accepts a
conversion or requests regenerated code. If a panel edit would overwrite
opaque source that cannot safely be preserved, block that generation and
explain which field requires code-mode editing. Add round-trip fixtures based
on a small canonical game supplied for v2, plus representative object literals
from `_projects/games/gamify/levels/`; verify import → no-op generate does not
silently lose supported configuration or preserved custom code.

## Asset handling

- Keep GameBuilder's bundled sample backgrounds and spritesheets with the
  system source, for example
  `_projects/systems/gamebuilder/images/bg/index.json` and
  `_projects/systems/gamebuilder/images/sprites/index.json`. The registered
  project build distributes these to
  `images/projects/gamebuilder/bg/` and `images/projects/gamebuilder/sprites/`.
- Use the existing manifest entry format. Resolve relative `src` values
  against the manifest's directory and honor the site's base URL. Validate
  required fields and sprite `rows`/`cols`; display a useful error when a
  selected asset has been removed or its manifest entry is invalid.
- Keep user-created game assets in the user's game/project source (for example
  a registered project with its own `images/` directory), not in the
  GameBuilder system package. Imported source paths should resolve to those
  project assets where possible. During migration, support the current
  `/images/gamebuilder/` paths as legacy inputs, but generate canonical URLs
  for the new registered-project distribution.
- Preserve the existing optional image-dimension discovery only where needed
  for previews. Do not depend on parsing a directory listing as the normal
  discovery path.
- A **Refresh Assets** action should reload manifests and preserve selections
  that still resolve. If a selected asset disappeared, flag the affected
  builder field instead of substituting another asset silently.
- Keep sprite direction/animation mappings explicit per spritesheet. The
  current documentation notes that row order varies by sheet, so do not infer
  a universal direction mapping from `rows` and `cols`.

## System project structure and distribution

The v2 source package lives at `_projects/systems/gamebuilder/`. Its
`index.md` is the workbench page and authored implementation files,
documentation, and images stay inside the registered project:

```text
_projects/systems/gamebuilder/
├── index.md                 # Entry point; mounts the builder and GAME_RUNNER
├── js/
│   ├── app.mjs              # Page wiring and UI lifecycle
│   ├── builder-state.mjs    # Versioned document and validation
│   ├── asset-catalog.mjs    # Manifest loading and asset resolution
│   ├── code-generator.mjs   # Builder document → GameEngine module
│   └── runner-bridge.mjs    # Minimal integration with GAME_RUNNER
├── sass/
│   └── main.scss            # OCS-token styling with SassDoc-style section docs
├── images/                  # Starter backgrounds and spritesheet manifests
├── docs/
│   └── GameBuilderDocV2.md  # Current status and forward-looking design
└── tests/
    └── gamebuilder-contract.test.mjs
```

The structure above reflects the current implementation; add focused modules
only as future features require them. The normal registered-project build distributes
the page to `_posts/projects/`, JavaScript to `assets/js/projects/gamebuilder/`,
Sass to `_sass/projects/gamebuilder/` (and its CSS entry point), and project
images to `images/projects/gamebuilder/`. Register the system through the
existing project registry and use the standard `make dev`/build workflow,
including the repository's SASS import-generation/build requirements.

Keep source and distribution boundaries clear:

- Edit files under `_projects/systems/gamebuilder/`; treat copied site files as
  generated output.
- Use the project's `images/` for GameBuilder-owned UI/art assets. User game
  assets remain part of the game/project being authored, not silently copied
  into the system's own assets.
- Resolve runtime paths from the site's base URL and the actual distribution
  destination; do not assume the source directory is directly served by
  Jekyll.
- Reuse the shared `_includes/runners/game.html` as a platform interface.
  Keep GameBuilder-specific orchestration in the system project rather than
  copying or forking GAME_RUNNER.

## Save, load, and export

Keep the workspace document separate from the runner's legacy source slot.
The implemented workspace document contains matching configuration and exact
source together; source-only runner saves outside GameBuilder remain unchanged.

- **Save/Load Workspace** serializes the versioned workspace document. It keeps
  a browser-local explicit save and automatic recovery draft, with JSON
  export/import for portable copies.
- **Runner code** remains managed by GAME_RUNNER and its normal runner storage
  key. Do not store JSON in the code editor's storage slot.
- On load, validate `schemaVersion`, migrate known older schema versions, and
  report unsupported or invalid documents. Never silently drop unknown data.
- **Export code** downloads the current runner source as a `.js` level module.
  **Export Workspace JSON** downloads configuration, source, and authoring
  state together.
- Do not imply that browser-local saves synchronize between devices or users.
  Account/server persistence can be a later, separate decision.

When a saved workspace is loaded, restore its exact editor source and matching
panel configuration without regeneration. For a configuration-only import,
offer generation explicitly. Preserve existing saved/manual code until the
user accepts replacement.

### Runner save-state notification (implemented)

After successfully persisting editor source, the runner emits a
bubbling `ocs:runner-saved` notification with a versioned payload identifying
the runner, its storage key, the exact saved source, and a save revision.
GameBuilder uses the controller's awaited workspace-save hook to associate that
snapshot with matching panel configuration. The event remains available for
other consumers; workspace persistence does not depend on event timing. Other
runner pages keep their current Save Code behavior without a workspace
subscriber.

This event means **source saved**, not **complete workspace saved**, **code
valid**, or **safe to regenerate**. GameBuilder must report its own persistence
success or failure separately. When complete-workspace saving is wired into
the runner's Save action, use an explicit awaited save hook rather than relying
on asynchronous event listeners to delay success feedback.

Track saved/dirty source separately from builder/code synchronization: saved
manual edits may still differ from generated code. A save notification can
offer later AST-based panel import, but must never automatically parse, execute,
convert, or overwrite code. Storage failure must produce visible error feedback
and no saved event. `getSaveState()` makes saved source queryable through the
runner controller so a late subscriber can initialize correctly.

See the [save-state contract in the workspace roadmap](./GamifyWorkspaceRoadmap.md#runner-save-state-contract)
for the proposed payload and acceptance criteria.

## Implementation sequence

### Stage 1 — runner-backed vertical slice (implemented)

- Registered the GameBuilder system package while keeping the v1 page available.
- Added focused `.mjs` modules for state/validation, asset catalogs, code
  generation, and the runner-ready bridge.
- Built the OCS-styled responsive two-panel workbench, semantic Environment,
  Player, and NPC controls, and accessible builder collapse/reopen behavior.
- Integrated the existing GAME_RUNNER and added explicit generate/sync behavior
  with confirmation before replacing differing runner code.
- Added generation of zero or more separately defined `Npc` data objects and
  contract tests for generated source and validation.
- Built and distributed the registered project assets. The lifecycle has been
  exercised through generation and runner-editor synchronization; running the
  game remains available through the runner's own Run control.

### Stage 2 — complete builder behaviors

1. Spline barriers and single-level workspace save/load/recovery are implemented,
   retaining panel state and exact runner source together, with visible storage
   errors and portable JSON/source exports.
2. Add multi-level, multi-module loading and source editing before relocating
   Gamify; run saved module edits rather than unchanged published imports.
3. Move Gamify into the registered system with explicit metadata and
   make-generated catalogs, preserving existing behavior and URLs. Then add
   bounded AST-based panel import with a non-destructive preview.
4. Add regression coverage for manifest resolution, generation from
   representative configurations, missing assets, schema validation, code
   import/round-trip preservation, and the runner integration hook.

### Stage 3 — advanced authoring

1. Add richer asset metadata and per-object animation/direction overrides,
   followed by Game-in-Game authoring using the existing nested-game lifecycle.
2. Expose existing Player gravity without confusing it with custom platformer
   physics; expand typed objects and placement as compatibility requires.
3. Consider server/account persistence only after the desired ownership,
   sharing, and collaboration behavior is specified.

## Decisions to confirm before implementation

1. **Draft persistence (confirmed):** browser-local complete-game saves plus
   portable JSON/source exports are the first milestone.
2. **Editor visibility:** should the GAME_RUNNER editor always be shown, or
   should Builder/Code modes be used to show the editor only when requested?
3. **Runner layout:** should the runner editor and game output remain stacked
   as in the existing include, or should the runner itself become a nested
   code/game split on wide screens?
4. **Import scope:** which object-literal patterns in the simple game should
   be panel-editable in the first importer? The proposal recommends a safe
   static-literal subset with unsupported code preserved.
5. **Local artifact workflow (confirmed):** download/upload and VS Code-managed
   source files are sufficient initially; direct workspace writes are deferred.
6. **Migration scope:** should v2 initially support the current background,
   player, NPC, and barriers feature set, or may some v1 controls be deferred?

## Risks and safeguards

- **Two sources of truth:** explicit Generate/Sync and confirmation before
  replacing runner edits prevent builder changes from unexpectedly destroying
  hand-edited code.
- **Saved code versus saved configuration:** distinct storage keys and clear
  load behavior prevent the runner's stored code from being mistaken for the
  builder document.
- **Asset drift:** stable manifest keys and visible missing-asset errors avoid
  generated levels that silently refer to deleted or renamed files.
- **Viewport-dependent geometry:** one logical coordinate system avoids
  barriers/objects moving when the browser or responsive panel changes size.
- **Runner lifecycle duplication:** GAME_RUNNER remains the sole runtime and
  owns stop/re-run cleanup; GameBuilder should not retain a parallel executor.
- **Code trust boundary:** GAME_RUNNER imports and executes level code in the
  page's JavaScript context. The two-panel layout is not a sandbox. If the
  builder later accepts untrusted shared code, isolation must be designed as a
  separate security requirement rather than assumed from using the runner.
