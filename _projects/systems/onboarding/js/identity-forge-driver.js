import { pythonURI, fetchOptions } from '@assets/js/api/config.js';
import { Backend } from '@assets/js/login/backend.js';
import { FlaskProfile } from '@assets/js/projects/profile/profile-backend.js';
import { OnboardingStore } from './onboarding-store.js';
import { startFullPageLevel } from '@assets/js/projects/cs-pathway/fullPageLevel.js';
import GameLevelCsPath0Forge from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath0Forge.js';
import { startIdentityCookieGate } from './identity-cookie-gate-runner.js';

const root = document.getElementById('onboarding-identity-game');
if (!root) throw new Error('Identity Forge page container was not found.');

const game = startFullPageLevel({
  containerId: root.id,
  levelClass: GameLevelCsPath0Forge,
  path: root.dataset.baseurl,
});

if (new URLSearchParams(location.search).get('onboarding_gate') === '1' && window.parent !== window) {
  const profile = new FlaskProfile({ flask: new Backend(pythonURI, fetchOptions) });
  startIdentityCookieGate(game, {
    store: new OnboardingStore({ profile }),
    status: document.querySelector('[data-identity-gate-status]'),
  });
}
