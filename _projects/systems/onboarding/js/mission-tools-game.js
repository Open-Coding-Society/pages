import Level from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath2Mission.js';
import { createOnboardingGame } from './onboarding-game.js';

export function createGame() {
  return createOnboardingGame(Level);
}
