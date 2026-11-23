import EngineControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';

let session;

export function configureOnboardingGame(options) {
  session = options;
}

export function createOnboardingGame(level, gate) {
  if (!session) throw new Error('Onboarding game has not been configured.');
  const activeSession = session;
  const gameLevelClasses = activeSession.unlocked || !gate ? [level] : [gate, level];

  class GameControl extends EngineControl {
    constructor(game, levels) {
      super(game, levels, { onProgress: event => activeSession.onProgress(event) });
      activeSession.control = this;
      if (activeSession.challenge.id === 'toolchain-trail') {
        game.environment.fixedStage = { width: 1600, height: 900 };
        game.environment.innerWidth = 1600;
        game.environment.innerHeight = 900;
      }
      if (activeSession.challenge.gate === 'identity-cookie') {
        const progress = { id: 'identity-cookie-gate', challengeId: activeSession.challenge.id, current: 0, goal: 5 };
        game.environment.identityCookieGate = {
          width: game.environment.innerWidth,
          height: game.environment.innerHeight,
          progress,
          isPaused: () => this.isPaused,
          onCollect: () => {
            if (progress.current >= progress.goal) return;
            progress.current++;
            activeSession.counter.textContent = `Collect five moving cookies. Click them or press Space. ${progress.current} / ${progress.goal}`;
            this.reportProgress();
          },
          save: () => activeSession.save(),
        };
        activeSession.counter.textContent = 'Collect five moving cookies. Click them or press Space. 0 / 5';
      } else if (activeSession.challenge.gate === 'toolchain-cookie') {
        activeSession.cookieButton.disabled = false;
        game.environment.toolchainCookieGate = {
          challenge: activeSession.challenge,
          store: { unlock: () => activeSession.save() },
          counter: activeSession.counter,
          button: activeSession.cookieButton,
          errorMessage: activeSession.error,
        };
      }
      activeSession.onStart?.();
    }

    destroy() {
      super.destroy();
      if (activeSession.control === this) activeSession.control = null;
    }
  }

  return { gameLevelClasses, GameControl };
}
