import Level from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath4Toolchain.js';
import ToolchainTrailGate from './toolchain-trail-gate.js';
import { createOnboardingGame } from './onboarding-game.js';

export function createGame() {
  return createOnboardingGame(Level, ToolchainTrailGate);
}
