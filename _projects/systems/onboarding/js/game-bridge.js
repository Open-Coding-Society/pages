export function connectGameControls(game, { host = window, onPauseChange = () => {} } = {}) {
  if (host.parent === host) return;
  const origin = host.location.origin;
  host.addEventListener('message', event => {
    if (event.origin !== origin || event.source !== host.parent || event.data?.type !== 'ocs-onboarding-game-control') return;
    const control = game.activeGameControl || game.gameControl;
    if (!control) return;
    if (event.data.action === 'pause' && control.isPaused) {
      host.parent.postMessage({
        type: 'ocs-onboarding-game-state',
        paused: false,
        error: 'The game is already paused by a dialog. Close it before pausing.',
      }, origin);
      return;
    }
    if (event.data.action === 'pause') control.pause();
    else if (event.data.action === 'resume') {
      if (control.isPaused) control.resume();
    } else return;
    onPauseChange(control.isPaused);
    host.parent.postMessage({ type: 'ocs-onboarding-game-state', paused: control.isPaused }, origin);
  });
  host.parent.postMessage({ type: 'ocs-onboarding-game-ready' }, origin);
}
