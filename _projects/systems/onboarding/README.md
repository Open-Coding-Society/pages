# Onboarding

The Onboarding system provides `/onboarding/`, a card-based prototype alongside
the unchanged `/cs-pathway`. A five-cookie GameEngine game unlocks each existing
challenge; UI Builder opens in a new tab because it blocks embedding. The gate
is a navigation aid, not a skill assessment or security boundary.

Guest unlocks stay in this browser and transfer to the next signed-in account.
Account unlocks are separate top-level fields in the Flask game profile, leaving
the existing Pathway avatar and theme intact. The optional Profile evidence card
shows saved Identity Forge and Toolchain completion separately from self-ratings.

See [architecture](docs/ARCHITECTURE.md). Register `systems/onboarding:dev` in
`_projects/.makeprojects`; the shared project template publishes `pages/`, `js/`,
`sass/`, and `_includes/` under the `projects/onboarding` namespaces.

Build via `make generate-makefiles` and `make -C _projects/systems/onboarding build`;
regenerate Sass imports as part of the root Makefile's project build. Run
`node --test _projects/systems/onboarding/tests/*.test.mjs` and
`node --test tests/profile_backend.test.mjs tests/profile_page.test.mjs tests/profile_starter.test.mjs`.
