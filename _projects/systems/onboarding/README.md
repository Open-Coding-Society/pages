# Onboarding

The home page redirects to `/onboarding/`, a card-based adventure with a link to
the unchanged `/cs-pathway`. A five-cookie GameEngine game unlocks each Pathway
challenge. Identity Forge launches moving cookies as a nested GameEngine level;
click each sprite (or press Space) and, once the unlock is saved, the same Forge
session resumes. If saving fails, use the game's retry button. The other
Pathway challenges use the separate cookie gate. Game Workbench and UI Builder open directly in the same tab, using the
full page; neither has a cookie gate. The gate is a navigation aid, not a skill
assessment or security boundary.

The separate gate declares its goal and progress in its level and saves through
the engine's level completion sequence. It sends generic game progress events
to the viewer; the account and browser storage keys remain Onboarding-specific.
If saving fails, the viewer's retry button repeats the save without restarting
the game.

The viewer has start, pause/resume, stop and fullscreen controls. Stop unloads the
game; start runs it again. A game dialog may already have paused the level, in
which case close the dialog before using the pause control. Clear Cookies & Replay
asks for confirmation and resets only that challenge's unlock on the current
account or browser; it does not clear login cookies, avatar, theme or other unlocks.

Guest unlocks stay in this browser and transfer to the next signed-in account.
When the account service cannot be reached, games can still be played offline;
unlocks remain in the browser and transfer to the next signed-in account after
the service returns. Guest game profile changes may not transfer. Replay requires
the service so it can also reset account progress.
Account unlocks are separate top-level fields in the Flask game profile, leaving
the existing Pathway avatar and theme intact. The optional Profile evidence card
shows saved Identity Forge and Toolchain completion separately from self-ratings.
Onboarding reads and updates account game progress through Profile's backend.

See [architecture](docs/ARCHITECTURE.md). Register `systems/onboarding:dev` in
`_projects/.makeprojects`; the shared project template publishes `index.md` as
`navigation/projects/onboarding/index.md` and `pages/`, `js/`, `sass/`, and
`_includes/` under the `projects/onboarding` namespaces.

Build via `make generate-makefiles` and `make -C _projects/systems/onboarding build`;
regenerate Sass imports as part of the root Makefile's project build. Run
`node --test _projects/systems/onboarding/tests/*.test.mjs` and
`node --test tests/profile_backend.test.mjs tests/profile_page.test.mjs tests/profile_starter.test.mjs`.
