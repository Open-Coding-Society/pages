import { removePlayerHealthBar, removeBossHealthBar } from './HealthBars.js';

// Show a full-screen victory/end overlay for the MansionGame
export default function showEndScreen(gameEnv) {
    if (typeof document === 'undefined') return;

    // Prevent adding multiple overlays
    if (document.getElementById('mansion-victory-overlay')) return;

    window.__mansionLevelEnded = true;

    removePlayerHealthBar();
    removeBossHealthBar();

    const overlay = document.createElement('div');
    overlay.id = 'mansion-victory-overlay';
    overlay.style.position = 'fixed';
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
    const path = (gameEnv && gameEnv.path) ? gameEnv.path : '';
    img.src = path + '/images/mansionGame/MansionGameEndScreen.png';
    img.alt = 'Victory';
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)';
    overlay.appendChild(img);

    // Click to close overlay and stop the level
    overlay.addEventListener('click', () => {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        try {
            if (gameEnv && gameEnv.gameControl && gameEnv.gameControl.currentLevel) {
                gameEnv.gameControl.currentLevel.continue = false;
            }
        } catch (e) { /* ignore */ }
    });

    // Append to body
    try { document.body.appendChild(overlay); } catch (e) { console.warn('Failed to append victory overlay:', e); }

    // Fallback: stop the level after a short delay
    setTimeout(() => {
        try {
            if (gameEnv && gameEnv.gameControl && gameEnv.gameControl.currentLevel) {
                gameEnv.gameControl.currentLevel.continue = false;
            }
        } catch (e) { /* ignore */ }
    }, 500);
}
