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
