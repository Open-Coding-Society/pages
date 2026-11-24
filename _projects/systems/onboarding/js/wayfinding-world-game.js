import Level from '@assets/js/projects/cs-pathway/levels/GameLevelCsPath1Way.js';
import { createOnboardingGame } from './onboarding-game.js';

export function createGame() {
  return createOnboardingGame(Level);
}
