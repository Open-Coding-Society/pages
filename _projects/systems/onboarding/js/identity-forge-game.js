import Level from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath0Forge.js';
import IdentityForgeGate from './identity-forge-gate.js';
import { createOnboardingGame } from './onboarding-game.js';

export function createGame() {
  return createOnboardingGame(Level, IdentityForgeGate);
}
