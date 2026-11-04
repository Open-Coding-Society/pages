// fullPageLevel.js
// Boots a single CS Pathway level that fills the whole browser window.
// Used by the standalone level pages in navigation/ (styles: sass/full-page-level.scss).
import Game from '@assets/js/GameEnginev1.1/essentials/Game.js';
import GameControl from '@assets/js/GameEnginev1.1/essentials/GameControl.js';

// Set on the container when the level runs on a fixed-size stage.
const FITTED_CLASS = 'cs-pathway-fullpage--fitted';

/**
 * @param {object} options
 * @param {{width: number, height: number}} [options.stage] - Optional fixed
 *   game size in pixels. When given, the level is laid out once at this size
 *   and scaled to fit the window (letterboxed, aspect ratio kept), so the
 *   whole map stays visible in a half-screen window. Without it, the level
 *   is laid out at the window size it starts in.
 */
export function startFullPageLevel({ containerId, levelClass, path, stage }) {
  const gameContainer = document.getElementById(containerId);
  if (!gameContainer) {
    throw new Error(`startFullPageLevel: container #${containerId} not found`);
  }

  if (stage) {
    gameContainer.classList.add(FITTED_CLASS);
    gameContainer.style.width = `${stage.width}px`;
    gameContainer.style.height = `${stage.height}px`;
    fitStageToWindow(gameContainer, stage);
    window.addEventListener('resize', () => fitStageToWindow(gameContainer, stage));
  }

  // Same options the game runner passes, but sized to the stage or the whole window.
  return Game.main({
    path,
    gameContainer,
    gameLevelClasses: [levelClass],
    innerWidth: gameContainer.clientWidth,
    innerHeight: gameContainer.clientHeight,
    disablePauseMenu: true,
    disableContainerAdjustment: true,
  }, GameControl);
}

// Scales the stage to the largest size that fits the window and centres it.
function fitStageToWindow(stageElement, stage) {
  const scale = Math.min(window.innerWidth / stage.width, window.innerHeight / stage.height);
  const left = (window.innerWidth - stage.width * scale) / 2;
  const top = (window.innerHeight - stage.height * scale) / 2;
  stageElement.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}
