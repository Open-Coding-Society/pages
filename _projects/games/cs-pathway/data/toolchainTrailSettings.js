/**
 * Toolchain Trail station verification timings.
 * Change these here; the level reads them and holds no timing values of its own.
 */

export const TOOLCHAIN_TRAIL_SETTINGS = Object.freeze({
  // How often the game asks the backend whether the agent has reported.
  pollIntervalMs: 3000,
  // After this long with no results, tell the student their agent window may be closed.
  silentAgentHintMs: 20000,
});
