# GameBuilder v2 proposal

> Design source retained with the GameBuilder system at
> `_projects/systems/gamebuilder/docs/GameBuilderv2.md`.

## Purpose

Reshape GameBuilder into a composition workspace where the student configures a
game on the left and plays/runs it through the existing GAME_RUNNER on the
right. The builder should produce ordinary GameEngine level code that can be
inspected, edited, saved, and reused outside the builder.

The current v1 builder remains available at `/gamebuilder/`. The Stage 1 v2
workbench is available at `/gamebuilder/v2/`, with system source kept under
`_projects/systems/gamebuilder/`, following the
`_projects/systems/calendar/` project pattern.

### Stage 1 implementation boundary

The first workbench increment is intentionally narrow: a versioned builder
document selects one bundled background and one player sprite, sets the player
name and normalized position, and generates a single level. Generation targets
the existing GAME_RUNNER contract; the workbench does not own another canvas,
game loop, or executor. The builder panel can collapse, and generated code
replaces runner edits only after an explicit confirmation.

The first increment does not yet include NPCs, barriers, persistence,
object-literal import, or writing files into the VS Code workspace. Its
starter manifests/assets live in the registered system package and build to
`/images/projects/gamebuilder/`.

## Current state and reuse opportunities

- The current v1 entry point (`../index.md`) has an Assets/configuration
  column and a main
  column that contains its own game preview, barrier-drawing overlay, and code
  editor. Its inline application code owns the asset controls, builder state,
  code generation, and execution path.
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
- The current OCS `.ocs__container` is a document-width container capped at
  900px, not a full-width workspace layout. `.ocs__split` is an available
  responsive two-column primitive, but it is currently defined with
  capstone-oriented styles. Use OCS container and component conventions, and
  add a narrowly scoped GameBuilder workspace layout in SCSS instead of
  stretching unrelated page styles.
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

## Proposed workspace

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
properties, and eventually placement tools. The right side is the canonical
execution surface: use GAME_RUNNER to edit and run the generated level code.
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
colors and inline styles. A small, purpose-specific SCSS layout is appropriate
because the current `.ocs__container` is capped at 900px and does not itself
provide an editor workspace layout.

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
asset manifests + builder document or imported supported code
                ↓
     parse/import or generate
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
  "environment": {
    "assetKey": "alien_planet"
  },
  "player": {
    "name": "Player",
    "spriteKey": "chillguy",
    "position": { "x": 100, "y": 300 },
    "movementKeys": {}
  },
  "objects": [],
  "barriers": []
}
```

Store manifest keys (or another stable asset identifier), not display labels or
duplicated asset metadata. At generation time, resolve keys through the
manifest-derived asset catalog and report missing assets as visible validation
errors. Use one documented coordinate space for positions and barriers; map
from the builder preview's displayed dimensions to the runner's logical game
dimensions during generation or runtime, rather than persisting incidental
screen pixels.

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

Create the v2 source package at `_projects/systems/gamebuilder/`. Use its
`index.md` as the GameBuilder system entry point/page and keep authored
implementation files, documentation, and images inside the project so a
developer can work on the whole system from one VS Code folder:

```text
_projects/systems/gamebuilder/
├── index.md                 # Entry point; mounts the builder and GAME_RUNNER
├── Makefile                 # Registered project build/watch/clean targets
├── js/
│   ├── app.js               # Page wiring and UI lifecycle
│   ├── builder-state.js     # Versioned document and validation
│   ├── asset-catalog.js     # Manifest loading and asset resolution
│   ├── code-generator.js    # Builder document → GameEngine module
│   ├── code-importer.js     # Supported AST/code → builder document
│   └── runner-bridge.js     # Minimal integration with GAME_RUNNER
├── sass/
│   └── main.scss            # Workspace/panel layout using OCS tokens
├── images/                  # System-owned UI/art assets, if needed
├── docs/
│   ├── ARCHITECTURE.md
│   └── CODE-IMPORT.md
└── tests/                   # Focused generator/importer fixtures and tests
```

This is a proposed responsibility breakdown, not a requirement to create empty
modules up front; keep each module focused and only introduce the files needed
by the implementation. The normal registered-project build should distribute
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

Use separate persistence for structured configuration and runner source code.

- **Save/Load Builder** serializes the versioned builder document. Initially,
  use an explicit downloadable/uploadable JSON file and optionally a
  browser-local draft keyed to this GameBuilder workspace.
- **Runner code** remains managed by GAME_RUNNER and its normal runner storage
  key. Do not store JSON in the code editor's storage slot.
- On load, validate `schemaVersion`, migrate known older schema versions, and
  report unsupported or invalid documents. Never silently drop unknown data.
- **Export code** downloads the current runner source as a `.js` level module.
  **Export configuration** downloads the structured JSON separately.
- Do not imply that browser-local saves synchronize between devices or users.
  Account/server persistence can be a later, separate decision.

When a builder document is loaded, regenerate its source and offer to apply it
to the runner editor. If the runner has existing saved/manual code, preserve it
until the user accepts replacement.

## Implementation sequence

### Stage 1 — runner-backed vertical slice

1. Define the initial versioned builder data shape for background, player,
   NPCs, and barriers based on the v1 controls and generated object definitions.
2. Create `_projects/systems/gamebuilder/` as a registered system package with
   `index.md` entry point, project Makefile, JS/Sass/docs, and an `images/`
   directory; keep the existing v1 page operational during this work.
3. Extract asset manifest loading and code generation from the inline v1
   application into focused system modules.
4. Add the OCS-styled two-panel workspace, accessible collapse/reopen behavior,
   and mount one GAME_RUNNER include on the right with a unique runner ID.
5. Add the minimal runner-ready integration hook and prove the basic lifecycle:
   generate code → update runner editor → run → stop → generate/run again.
6. Verify registered build/watch distribution, generated exports, engine
   imports, asset paths, responsive/collapsed layout, editor persistence key,
   and preservation of manual code edits.

### Stage 2 — complete builder behaviors

1. Port the asset, player, NPC, and wall/barrier controls incrementally into
   structured state and validate each section before code generation.
2. Make the runner the only game preview and execution path; remove v1-only
   game execution and duplicate editor behavior from the v2 page.
3. Add AST-based import for the supported object-literal subset, with a
   non-destructive preview and a canonical simple-game fixture.
4. Add JSON save/load, migration/error feedback, and separate code/config
   exports.
5. Add regression coverage for manifest resolution, generation from
   representative configurations, missing assets, schema validation, code
   import/round-trip preservation, and the runner integration hook.

### Stage 3 — advanced authoring

1. Improve object placement and editing against the runner's documented
   logical coordinate space.
2. Add richer typed objects and per-spritesheet animation/direction settings.
3. Consider server/account persistence only after the desired ownership,
   sharing, and collaboration behavior is specified.

## Decisions to confirm before implementation

1. **Draft persistence:** should the first version save configuration only as
   downloaded/uploaded JSON, or also keep a browser-local draft?
2. **Editor visibility:** should the GAME_RUNNER editor always be shown, or
   should Builder/Code modes be used to show the editor only when requested?
3. **Runner layout:** should the runner editor and game output remain stacked
   as in the existing include, or should the runner itself become a nested
   code/game split on wide screens?
4. **Import scope:** which object-literal patterns in the simple game should
   be panel-editable in the first importer? The proposal recommends a safe
   static-literal subset with unsupported code preserved.
5. **Local artifact workflow:** are download/upload and VS Code-managed source
   files sufficient initially, or is a secured local workspace bridge a
   required feature?
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
