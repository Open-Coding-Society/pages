# Onboarding

The home page redirects to `/onboarding/`, the card grid for individual
experiences, with a link to the unchanged `/cs-pathway`. Each gated experience
declares its own gate in `js/onboarding-data.js`: Identity Forge uses its
moving-cookie gate, and Toolchain Trail uses the separate five-cookie game.
Wayfinding World, AI Review Challenge and Assessment Observatory open directly
until they have their own gates. Game Workbench and UI Builder also open directly
in the same tab. Gates are navigation aids, not skill assessments or security
boundaries.

The viewer uses the shared GameRunner directly, without a notebook or iframe.
Each `<challenge>-game.js` combines that card's CS Pathway level with its
optional gate; `onboarding-game.js` supplies the shared runner integration.
Identity and Toolchain gates are defined separately in
`identity-forge-gate.js` (`IdentityForgeGate`) and `toolchain-trail-gate.js`
(`ToolchainTrailGate`). They
save through the engine's level-completion sequence before advancing to the
game. If saving fails, the viewer's retry button repeats the save without
restarting the gate. Click the cookies or press Space.

The viewer uses the runner's start, pause/resume, stop and fullscreen controls,
without a level selector. Stop destroys the game; start runs it again. A game dialog may already have paused the level, in
which case close the dialog before using the pause control. Clear Cookies & Replay
asks for confirmation and resets only a gated challenge's unlock on the current
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
