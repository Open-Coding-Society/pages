/**
 * @module runner-bridge
 * @description
 * Provides a small readiness bridge from GameBuilder to the shared GAME_RUNNER
 * include without reaching into the runner's editor or executor internals.
 *
 * @data
 * The runner registers a controller in `window.OCSGameRunners`, keyed by its
 * `runnerId`, and dispatches `ocs:game-runner-ready` with `{ runnerId,
 * controller }` when initialization completes.
 *
 * @usage
 * Await `waitForGameRunner(runnerId)` before invoking the returned controller.
 * The GameBuilder page uses this to obtain code/change, save/snapshot,
 * engine-selection, run, and stop operations. `setSaveHandler` installs the
 * awaited workspace persistence hook. If readiness exceeds the timeout,
 * the promise rejects with an error.
 */
export function waitForGameRunner(runnerId, timeoutMs = 10000) {
  const existing = window.OCSGameRunners?.[runnerId];
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener('ocs:game-runner-ready', handleReady);
      reject(new Error(`GAME_RUNNER "${runnerId}" did not become ready`));
    }, timeoutMs);

    function handleReady(event) {
      if (event.detail?.runnerId !== runnerId) return;
      window.clearTimeout(timeout);
      window.removeEventListener('ocs:game-runner-ready', handleReady);
      resolve(event.detail.controller);
    }

    window.addEventListener('ocs:game-runner-ready', handleReady);
  });
}
