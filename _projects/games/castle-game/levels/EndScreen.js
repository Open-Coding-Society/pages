
/**
 * Shows the end screen when the player wins the archery game
 * @param gameEnv - The game environment object
 * @param filepath - The path to the end screen image (default: '/images/sorcerers/archeryWinScreen.png')
 */
export default function showEndScreen(gameEnv, filepath='/images/sorcerers/archeryWinScreen.png') {
    if (typeof document === 'undefined') return;

    // Prevent adding multiple overlays
    if (document.getElementById('archery-victory-overlay')) return;
    // Determine resource path
    const path = (gameEnv && gameEnv.path) ? gameEnv.path : '';

    const overlay = document.createElement('div');
    overlay.id = 'archery-victory-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '10000';

    const img = document.createElement('img');
    // use previously computed `path` variable
    img.src = path + filepath;
    img.alt = 'Victory';
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)';
    overlay.appendChild(img);

    // Disable click-to-close: keep overlay visible until game control/timeout handles the transition.
    // This prevents accidental dismissal when the player clicks the screen.
    overlay.addEventListener('click', (e) => {
        // swallow clicks so they don't remove the overlay or interact with underlying elements
        e.stopPropagation();
        e.preventDefault();
    });

    // Append to game container
    const gameContainer = gameEnv.canvasContainer || gameEnv.container || document.body;
    try { gameContainer.appendChild(overlay); } catch (e) { console.warn('Failed to append victory overlay:', e); }

    // Fallback: stop the level after a short delay
    setTimeout(() => {
        try {
            if (gameEnv && gameEnv.gameControl && gameEnv.gameControl.currentLevel) {
                gameEnv.gameControl.currentLevel.continue = false;
            }
        } catch (e) { /* ignore */ }
    }, 500);
}
