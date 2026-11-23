import Level from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath3Analytics.js';
import { createOnboardingGame } from './onboarding-game.js';

export function createGame() {
  return createOnboardingGame(Level);
}
