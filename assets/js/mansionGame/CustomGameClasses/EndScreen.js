// Show a full-screen victory/end overlay for the MansionGame
export default function showEndScreen(gameEnv) {
    if (typeof document === 'undefined') return;

    // Prevent adding multiple overlays
    if (document.getElementById('mansion-victory-overlay')) return;
    // Determine resource path
    const path = (gameEnv && gameEnv.path) ? gameEnv.path : '';

    // Pause DOM audio elements
    try {
        const audioElements = document.querySelectorAll('audio'); // Selects all <audio> elements
        audioElements.forEach(audio => {
            try { if (!audio.paused) audio.pause(); } catch (e) {}
        });
    } catch (e) { /* ignore */ }

    // Pause any globally exposed audio (battle / level music)
    try {
        if (typeof window !== 'undefined') {
            if (window._battleMusic && typeof window._battleMusic.pause === 'function') {
                try { window._battleMusic.pause(); window._battleMusic.currentTime = 0; } catch (e) {}
            }
            if (window._levelMusic && typeof window._levelMusic.pause === 'function') {
                try { window._levelMusic.pause(); window._levelMusic.currentTime = 0; } catch (e) {}
            }
            // Also stop any previously-started end music
            if (window._endMusic && typeof window._endMusic.pause === 'function') {
                try { window._endMusic.pause(); window._endMusic.currentTime = 0; } catch (e) {}
            }
        }
    } catch (e) {}

    // Play the victory theme and loop it
    const endAudio = new Audio(path + "/assets/sounds/mansionGame/zeldaVictory.mp3");
    endAudio.loop = true;
    endAudio.volume = 0.4;
    endAudio.play().catch(error => console.error('Failed to play audio:', error));
    try { if (typeof window !== 'undefined') window._endMusic = endAudio; } catch (e) {}

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
    // use previously computed `path` variable
    img.src = path + '/images/mansionGame/MansionGameEndScreen.png';
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
