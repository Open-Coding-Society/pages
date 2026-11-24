# Onboarding

The home page redirects to `/onboarding/`, the card grid for individual
experiences, with a link to the unchanged `/cs-pathway`. Each gated experience
declares its own gate in `js/onboarding-data.js`: Identity Forge uses its
moving-cookie gate, and Toolchain Trail uses a Snake gate.
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
restarting the gate. For Identity Forge, click cookies or press Space. In
Toolchain Trail, steer the constantly moving snake with WASD, arrow keys or
the touch controls to collect five apples. Each apple adds a segment; hitting
a wall or the snake's body resets its score.

The viewer uses the runner's start, pause/resume, stop, reset and fullscreen controls,
without a level selector. The layout is dense by design, with one place per kind
of information: the persistence bar at the top pairs the expandable Game profile
(the level's account data and actions) with the unlock status, the title and
description share one line, and the gate's counter and instructions sit beside
the runner controls. Game toasts and nearby interaction prompts overlay the top
of the game area where the action is; toasts fade on their own after a few
seconds, while proximity hints stay until the level clears them. Level scores
replace the running status when available;
paused, stopped and error states remain visible. The viewer replaces the game's Next Level
link. Standalone CS Pathway pages retain their own overlays and navigation.
Stop destroys the game; start runs it again. A game dialog may already have paused the level, in
which case close the dialog before using the pause control. Reset & Replay
asks for confirmation and resets only a gated challenge's unlock on the current
account or browser; it does not clear login cookies, avatar, theme or other unlocks.

Identity Forge is the reference implementation of this presentation standard.
Its level routes every message through CS Pathway's `Present`
(`_projects/games/cs-pathway/levels/Present.js`), which writes to the viewer's
presentation host when embedded and uses floating overlays only standalone —
levels must not keep hand-rolled toast or zone-alert copies alongside it.
Persistent station-result panels (Present's `panel` surface, such as Course
Enlistment's recommendation) carry a × so a student can dismiss one that a
station flow forgot to clear. Help
is the Station Helper (`levels/ChatHelper.js`), the 💬 button in the lower right
of the game box: Spring's level-aware chat endpoint (`/api/cs-pathway/chat`)
already accepts every level key, and `model/forgeChatContext.js` tells it which
Identity Forge station the student is at and which tasks are done, so answers
are specific to this level without a separate "?" help control. Each challenge
also has its own microblog topic (`/onboarding/view/<challenge>/`) through the
shared panel's `microblog_topic_param`; the viewer toolbar hosts the microblog
button at its far right.

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
