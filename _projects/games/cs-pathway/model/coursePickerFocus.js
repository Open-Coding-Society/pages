// coursePickerFocus.js
// The /cs-pathway page runs two games at once: the course picker at the top
// (Course Brief Explorer) and a course game further down (for example the
// CSSE game with Toolchain Trail). Both listen to WASD and E on the whole
// page, so while a student plays Toolchain Trail the picker's player walks
// too, and an E press next to a course NPC switches the page to that course
// and hides the game the student was playing.
//
// keepPickerToItsOwnRunner pauses the picker while the student plays another
// game on the page, and resumes it when they click back on the picker.

// Each GAME_RUNNER on a page is wrapped in this element (_includes/runners/game.html).
export const GAME_RUNNER_SELECTOR = '.game-runner-container';

/**
 * @param {object} gameEnv - the picker level's gameEnv
 * @param {Document} [doc] - where to listen for clicks (a fake one in tests)
 * @returns {Function} stops listening; call it from the level's destroy()
 */
export function keepPickerToItsOwnRunner(gameEnv, doc = document) {
  const pickerControl = gameEnv.gameControl;
  const pickerRunner = gameEnv.gameContainer?.closest?.(GAME_RUNNER_SELECTOR) || null;

  const onPointerDown = (event) => {
    const clickedRunner = event.target?.closest?.(GAME_RUNNER_SELECTOR) || null;
    const gateIsOpen = gameEnv.game?.activeGameControl !== pickerControl;
    // Clicks outside every game (dialogues, station panels) leave the picker as
    // it is, and the cookie gate pauses and resumes the picker itself.
    if (clickedRunner === null || gateIsOpen) return;

    const pickerClicked = clickedRunner === pickerRunner;
    const otherGameClicked = clickedRunner !== pickerRunner;
    const pickerPaused = pickerControl.isPaused;
    const pickerRunning = !pickerControl.isPaused;
    if (pickerClicked && pickerPaused) pickerControl.resume(); // back to picking a course
    if (otherGameClicked && pickerRunning) pickerControl.pause(); // playing another game
  };

  doc.addEventListener('pointerdown', onPointerDown, { capture: true });
  return () => doc.removeEventListener('pointerdown', onPointerDown, { capture: true });
}
