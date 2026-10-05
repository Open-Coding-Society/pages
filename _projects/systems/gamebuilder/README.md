# GameBuilder System

The source of the GameBuilder page and its supporting files lives in this
registered project. The project build distributes `index.md` as the
`/gamebuilder` page and publishes documentation from `docs/`.

## Source layout

- `index.md` is the current GameBuilder entry point. It retains the existing v1
  builder while the initial runner-backed workbench is available at
  `/gamebuilder/v2/`.
- `js/` contains scripts owned and distributed by this system.
- `sass/main.scss` is the system's page-scoped stylesheet entry point.
- `images/bg/` and `images/sprites/` contain the starter assets and manifests
  used by the workbench.
- The workbench supports zero or more NPCs, each with its own sprite, greeting,
  and canvas-relative position; generated levels create one `Npc` object per
  configured NPC.
- `docs/` retains the existing asset guidance, workbench page, and GameBuilder
  v2 proposal.
- `images/` is reserved for GameBuilder system-owned images. Game/project art
  remains with its owning project.

Edit these sources under `_projects/systems/gamebuilder/`. The page, JavaScript,
Sass, and images copied into the site directories are generated output.

## Build and development

Use the repository's registered project workflow:

```sh
make generate-makefiles
make build-registered-projects
make build-registered-docs
```

The registered-project build refreshes generated SASS imports after building.
For local site development, use the root `make dev` workflow.
