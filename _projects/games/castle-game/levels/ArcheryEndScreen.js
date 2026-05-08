
/**
 * Shows the end screen when the player wins the archery game
 * @param gameEnv - The game environment object
 * @param filepath - The path to the end screen image (default: '/images/sorcerers/archeryWinScreen.png')
 */

import GameLevelMaze from './GameLevelMaze.js';

export default function showEndScreen(gameEnv) {
    if (typeof document === 'undefined') return;

    if (typeof window !== 'undefined') {
        window.archeryVictory = true;
    }

    const timeTaken = window.timeStarted ? (Date.now() / 1000.0) - window.timeStarted : null;
    console.log(`Archery game won! Time taken: ${timeTaken !== null ? timeTaken + ' seconds' : 'Error calculating time'}`);
    const formattedTime = timeTaken !== null ? `${timeTaken.toFixed(2)} seconds` : 'N/A';


    // Prevent adding multiple overlays
    if (document.getElementById('archery-victory-overlay')) return;
    // Determine resource path
    const path = (gameEnv && gameEnv.path) ? gameEnv.path : '';

    // Clear any active arrows and HUD elements so the victory screen is clean
    if (gameEnv && Array.isArray(gameEnv.gameObjects)) {
        const arrows = gameEnv.gameObjects.filter(obj => obj && obj.constructor?.name === 'Projectile');
        arrows.forEach(arrow => {
            try {
                if (typeof arrow.destroy === 'function') {
                    arrow.destroy();
                }
            } catch (error) {
                console.warn('Failed to destroy arrow:', error);
            }
        });

        gameEnv.gameObjects.forEach(obj => {
            if (obj && Array.isArray(obj.projectiles)) {
                obj.projectiles.forEach(projectile => {
                    try {
                        if (projectile && typeof projectile.destroy === 'function') {
                            projectile.destroy();
                        }
                    } catch (error) {
                        console.warn('Failed to destroy projectile:', error);
                    }
                });
                obj.projectiles = [];
            }
            if (!obj || !obj.counterEl) return;
            try {
                if (obj.counterEl.parentNode) {
                    obj.counterEl.parentNode.removeChild(obj.counterEl);
                }
            } catch (error) {
                console.warn('Failed to remove hits counter:', error);
            }
            obj.counterEl = null;
        });
    }

    if (gameEnv && gameEnv.gameControl) {
        gameEnv.gameControl.isPaused = true;
    }

    if (typeof window !== 'undefined' && window.archeryHitsCounter) {
        try {
            if (window.archeryHitsCounter.parentNode) {
                window.archeryHitsCounter.parentNode.removeChild(window.archeryHitsCounter);
            }
        } catch (error) {
            console.warn('Failed to remove global hits counter:', error);
        }
        window.archeryHitsCounter = null;
    }

    document.querySelectorAll('#archery-hits-remaining').forEach((counterEl) => {
        if (counterEl && counterEl.parentNode) {
            counterEl.parentNode.removeChild(counterEl);
        }
    });

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
    img.src = path + '/images/projects/castle-game/archeryWinScreen.png';
    img.alt = 'Victory';
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)';
    overlay.appendChild(img);

    const timeLabel = document.createElement('div');
    timeLabel.textContent = `Time taken: ${formattedTime}`;
    timeLabel.style.position = 'absolute';
    timeLabel.style.left = '50%';
    timeLabel.style.bottom = '40%';
    timeLabel.style.transform = 'translateX(-50%)';
    timeLabel.style.color = '#ffffff';
    timeLabel.style.fontSize = '0.75rem';
    timeLabel.style.fontWeight = '700';
    timeLabel.style.fontFamily = "'Press Start 2P', monospace";
    timeLabel.style.letterSpacing = '0.08em';
    timeLabel.style.lineHeight = '1.4';
    timeLabel.style.textShadow = '0 2px 12px rgba(0,0,0,0.9)';
    timeLabel.style.pointerEvents = 'none';
    timeLabel.style.textAlign = 'center';
    overlay.appendChild(timeLabel);

    // commentary label

    var commentary;
    if (timeTaken < 10){
        commentary = "You're literally hacking lol";
    } else if (timeTaken < 20){
        commentary = "Good stuff, marksman...";
    } else if (timeTaken < 30){
        commentary = "Seems average, I guess...";
    } else if (timeTaken < 40){
        commentary = "Come on, you can do better than that...";
    } else if (timeTaken < 50){
        commentary = "Might want to practice just a liiiiiiiiiitle bit more";
    } else if (timeTaken < 60){
        commentary = "I've seen glaciers move with more urgency than this.";
    } else if (timeTaken < 70) {
        commentary = "Oof. Is your mouse made of lead, or are you just like this?";
    } else {
        commentary = "I could train my pet rock to do better than this.";
    }
    const commentaryLabel = document.createElement('div');
    commentaryLabel.textContent = commentary;
    commentaryLabel.style.position = 'absolute';
    commentaryLabel.style.left = '50%';
    commentaryLabel.style.bottom = '35%';
    commentaryLabel.style.transform = 'translateX(-50%)';
    commentaryLabel.style.color = '#ffe354';
    commentaryLabel.style.fontSize = '0.55rem';
    commentaryLabel.style.fontWeight = '700';
    commentaryLabel.style.fontFamily = "'Press Start 2P', monospace";
    commentaryLabel.style.letterSpacing = '0.08em';
    commentaryLabel.style.lineHeight = '1.4';
    commentaryLabel.style.textShadow = '0 2px 12px rgba(0,0,0,0.9)';
    commentaryLabel.style.pointerEvents = 'none';
    commentaryLabel.style.textAlign = 'center';
    overlay.appendChild(commentaryLabel);

    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.textContent = 'Enter the castle';
    actionButton.style.position = 'absolute';
    actionButton.style.left = '50%';
    actionButton.style.bottom = '15%';
    actionButton.style.transform = 'translateX(-50%)';
    actionButton.style.padding = '12px 22px';
    actionButton.style.border = '2px solid #ffffff';
    actionButton.style.borderRadius = '8px';
    actionButton.style.background = '#1f2738';
    actionButton.style.color = '#ffffff';
    actionButton.style.fontFamily = "'Press Start 2P', monospace";
    actionButton.style.fontSize = '0.75rem';
    actionButton.style.letterSpacing = '0.05em';
    actionButton.style.cursor = 'pointer';
    actionButton.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
    actionButton.style.zIndex = '10001';
    actionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!gameEnv || !gameEnv.gameControl) return;

        // Prevent double-click transitions.
        actionButton.disabled = true;
        actionButton.style.opacity = '0.65';
        actionButton.style.cursor = 'default';

        const gameControl = gameEnv.gameControl;
        const fadeOverlay = document.createElement('div');
        const fadeInMs = 700;
        const fadeOutMs = 700;

        Object.assign(fadeOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            opacity: '0',
            zIndex: '10002',
            pointerEvents: 'none',
            transition: `opacity ${fadeInMs}ms ease-in-out`
        });

        const gameContainer = gameEnv.canvasContainer || gameEnv.container || document.body;
try { gameContainer.appendChild(fadeOverlay); } catch (err) { console.warn('Could not append fade overlay:', err); }

        const switchToMazeLevel = () => {
            try {
                gameControl._originalLevelClasses = gameControl.levelClasses;
                gameControl.levelClasses = [GameLevelMaze];
                gameControl.currentLevelIndex = 0;
                gameControl.isPaused = false;
                gameControl.transitionToLevel();
            } catch (err) {
                console.warn('Failed to transition to maze level:', err);
            }
        };

        requestAnimationFrame(() => {
            fadeOverlay.style.opacity = '1';
        });

        setTimeout(() => {
            try { overlay.remove(); } catch (err) { /* ignore */ }

            switchToMazeLevel();

            setTimeout(() => {
                fadeOverlay.style.transition = `opacity ${fadeOutMs}ms ease-in-out`;
                fadeOverlay.style.opacity = '0';

                setTimeout(() => {
                    try { fadeOverlay.remove(); } catch (err) { /* ignore */ }
                }, fadeOutMs + 100);
            }, 220);
        }, fadeInMs + 30);
    });
    overlay.appendChild(actionButton);

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
