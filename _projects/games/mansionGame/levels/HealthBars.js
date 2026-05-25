// ~~~~~~~~~~~~~ BOSS HEALTH BAR ~~~~~~~~~~~~~
export function createBossHealthBar() {
    // Create the main container that will hold both label and health bar
    const container = document.createElement('div');
    container.id = 'boss-health-container';
    Object.assign(container.style, {
        position: 'absolute',
        top: '80px',  // Moved further down in the battle room
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        width: '60%',
        zIndex: '100'  // Lower z-index to keep it in the battle room
    });

    // Create the label
    const label = document.createElement('div');
    label.textContent = "Reaper's HP";
    Object.assign(label.style, {
        color: '#FF0000',
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        marginBottom: '5px'
    });

    // Create the health bar container
    const barContainer = document.createElement('div');
    barContainer.id = 'boss-health-bar';
    Object.assign(barContainer.style, {
        width: '100%',
        height: '25px',
        backgroundColor: '#222',
        border: '2px solid #FF0000',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
    });

    // Create the health fill
    const fill = document.createElement('div');
    fill.id = 'boss-health-fill';
    Object.assign(fill.style, {
        height: '100%',
        width: '100%',
        backgroundColor: '#FF0000',
        borderRadius: '6px',
        transition: 'width 0.3s ease'
    });

    // Assemble the components
    barContainer.appendChild(fill);
    container.appendChild(label);
    container.appendChild(barContainer);

    // Find the game canvas/container and append our health bar to it
    const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
    gameContainer.appendChild(container);
}

// Remove the boss health bar
export function removeBossHealthBar() {
    const container = document.getElementById('boss-health-container');
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }
}

// Update the boss health bar based on a percentage (0 to 100)
export function updateBossHealthBar(percentage, stage) {
    const fill = document.getElementById('boss-health-fill');
    if (fill) {
        // Ensure the percentage stays within the 0-100 range
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
        // Set the width of the health bar fill element
        fill.style.width = `${clampedPercentage}%`;
        fill.style.backgroundColor = stage == 1 ? '#FF0000' : stage == 2 ? '#800000' : '#A020F0';
    }
}


// ~~~~~~~~~~~~ PLAYER HEALTH BAR ~~~~~~~~~~~~
export function createPlayerHealthBar() {
    // Create the main container that will hold both label and health bar
    const container = document.createElement('div');
    container.id = 'player-health-container';
    Object.assign(container.style, {
        position: 'absolute',
        bottom: '32px',
        left: '0',
        transform: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        width: '50%',
        padding: '0 24px',
        boxSizing: 'border-box',
        zIndex: '100'
    });

    // Create the label
    const label = document.createElement('div');
    label.textContent = "Your HP";
    Object.assign(label.style, {
        color: '#FF0000',
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: '16px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        marginBottom: '5px'
    });

    // Create the health bar container
    const barContainer = document.createElement('div');
    barContainer.id = 'player-health-bar';
    Object.assign(barContainer.style, {
        width: '100%',
        height: '25px',
        backgroundColor: '#222',
        border: '2px solid #FF0000',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
    });

    // Create the health fill
    const fill = document.createElement('div');
    fill.id = 'player-health-fill';
    Object.assign(fill.style, {
        height: '100%',
        width: '100%',
        backgroundColor: '#FF0000',
        borderRadius: '6px',
        transition: 'width 0.3s ease'
    });

    // Assemble the components
    barContainer.appendChild(fill);
    container.appendChild(label);
    container.appendChild(barContainer);

    // Find the game canvas/container and append our health bar to it
    const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
    gameContainer.appendChild(container);
}

// Remove the player health bar
export function removePlayerHealthBar() {
    const container = document.getElementById('player-health-container');
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }
}

// Update the boss health bar based on a percentage (0 to 100)
export function updatePlayerHealthBar(percentage) {
    const fill = document.getElementById('player-health-fill');
    const container = document.getElementById('player-health-container');
    if (fill) {
        // Ensure the percentage stays within the 0-100 range
        const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
        // Set the width of the health bar fill element
        fill.style.width = `${clampedPercentage}%`;
        fill.style.backgroundColor = clampedPercentage > 60 ? '#00FF00' : clampedPercentage > 30 ? '#FFFF00' : '#FF0000';

        ensureLowHealthEffects();
        const isLow = clampedPercentage <= 25;
        const isWarning = clampedPercentage <= 50;
        const overlay = document.getElementById('low-health-overlay');

        if (overlay) {
            if (!isWarning) {
                overlay.style.opacity = '0';
                overlay.style.setProperty('--pulse-min', '0');
                overlay.style.setProperty('--pulse-max', '0');
            } else {
                const intensity = Math.min(1, Math.max(0, (50 - clampedPercentage) / 50));
                const minOpacity = 0.05 + intensity * 0.15;
                const maxOpacity = 0.18 + intensity * 0.35;
                overlay.style.opacity = '1';
                overlay.style.setProperty('--pulse-min', minOpacity.toFixed(2));
                overlay.style.setProperty('--pulse-max', maxOpacity.toFixed(2));
            }
        }

        if (fill) {
            if (isWarning) {
                fill.classList.add('player-health-pulse');
            } else {
                fill.classList.remove('player-health-pulse');
            }
        }

        if (container) {
            if (isLow) {
                container.classList.add('player-health-shake');
            } else {
                container.classList.remove('player-health-shake');
            }
        }
    }
}

function ensureLowHealthEffects() {
    if (typeof document === 'undefined') return;

    if (!document.getElementById('low-health-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'low-health-overlay';
        Object.assign(overlay.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(255, 0, 0, 0.2)',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '180'
        });

        const gameContainer = document.querySelector('canvas')?.parentElement || document.body;
        gameContainer.appendChild(overlay);
    }

    if (!document.getElementById('low-health-style')) {
        const style = document.createElement('style');
        style.id = 'low-health-style';
        style.textContent = `
            @keyframes low-health-pulse {
                0% { opacity: var(--pulse-min, 0.08); }
                50% { opacity: var(--pulse-max, 0.22); }
                100% { opacity: var(--pulse-min, 0.08); }
            }
            #low-health-overlay {
                animation: low-health-pulse 0.9s ease-in-out infinite;
            }
            @keyframes player-health-pulse {
                0% { filter: brightness(1); }
                50% { filter: brightness(1.35); }
                100% { filter: brightness(1); }
            }
            #player-health-fill.player-health-pulse {
                animation: player-health-pulse 0.8s ease-in-out infinite;
            }
            @keyframes player-health-shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                50% { transform: translateX(2px); }
                75% { transform: translateX(-1px); }
                100% { transform: translateX(0); }
            }
            #player-health-container.player-health-shake {
                animation: player-health-shake 0.3s infinite;
            }
        `;
        document.head.appendChild(style);
    }
}
