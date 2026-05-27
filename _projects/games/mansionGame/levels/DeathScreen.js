// THIS IS FOR THE FINAL BOSS LEVEL.
// Please do not use this for any other levels, it respawns the player to MansionLevel6 which is the level right before the boss fight.

import MansionLevel6 from './mansionLevel6.js';

let respawnScheduled = false;

// Define the death screen
function showDeathScreen(player) {
    if (respawnScheduled) return;
    respawnScheduled = true;

    const gameControl = player?.gameEnv?.gameControl;
    const gameEnv = player?.gameEnv;
    if (gameControl) {
        gameControl.isPaused = true;
    }

    cleanupBattleRoomUi(gameEnv);

    // === PLAYER DEATH: ALL FUNCTIONALITY INLINE ===

    // 1. Play death animation - particle effect
    const playerX = player.position.x;
    const playerY = player.position.y;

    // Create explosion effect
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = 'red';
        particle.style.left = `${playerX + player.width / 2}px`;
        particle.style.top = `${playerY + player.height / 2}px`;
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        // Animate particles outward
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const distance = Math.random() * 100 + 50;

        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;

        particle.animate(
            [
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px)`, opacity: 0 }
            ],
            {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    // 2. Show death message dialog
    const deathMessage = document.createElement('div');
    deathMessage.style.position = 'fixed';
    deathMessage.style.top = '50%';
    deathMessage.style.left = '50%';
    deathMessage.style.transform = 'translate(-50%, -50%)';
    deathMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    deathMessage.style.color = '#FF0000';
    deathMessage.style.padding = '30px';
    deathMessage.style.borderRadius = '10px';
    deathMessage.style.fontFamily = "'Press Start 2P', sans-serif";
    deathMessage.style.fontSize = '24px';
    deathMessage.style.textAlign = 'center';
    deathMessage.style.zIndex = '10000';
    deathMessage.style.border = '3px solid #FF0000';
    deathMessage.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
    deathMessage.style.width = '400px';
    deathMessage.innerHTML = `
        <div style="margin-bottom: 20px;">☠️ YOU DIED ☠️</div>
        <div style="font-size: 16px; margin-bottom: 20px;">The Reaper has taken another victim!</div>
        <div style="font-size: 14px;">Respawning in 3 seconds...</div>
    `;

    document.body.appendChild(deathMessage);

    // Remove message after delay
    setTimeout(() => {
        if (deathMessage.parentNode) {
            deathMessage.parentNode.removeChild(deathMessage);
        }
    }, 2000);

    // 3. Reset to MansionLevel6 (outside the battle room)
    setTimeout(() => {
        try {
            if (self && self.timerInterval) {
                clearInterval(self.timerInterval);
            }
        } catch (e) {
            console.warn('DeathScreen cleanup failed:', e);
        }

        if (gameControl && typeof gameControl.transitionToLevel === 'function') {
            try {
                gameControl.levelClasses = [MansionLevel6];
                gameControl.currentLevelIndex = 0;
                gameControl.isPaused = false;
                gameControl.transitionToLevel();
            } catch (e) {
                console.warn('Failed to respawn to MansionLevel6:', e);
            }
        }

        respawnScheduled = false;
    }, 3000); // 3 second delay before reset
}

function cleanupBattleRoomUi(gameEnv) {
    if (typeof document === 'undefined') return;

    try {
        if (typeof window !== 'undefined') {
            if (window._battleMusic && typeof window._battleMusic.pause === 'function') {
                window._battleMusic.pause();
                window._battleMusic.currentTime = 0;
            }
            if (window._levelMusic && typeof window._levelMusic.pause === 'function') {
                window._levelMusic.pause();
                window._levelMusic.currentTime = 0;
            }
            if (window._endMusic && typeof window._endMusic.pause === 'function') {
                window._endMusic.pause();
                window._endMusic.currentTime = 0;
            }
        }
    } catch (e) {
        console.warn('DeathScreen music cleanup failed:', e);
    }

    const selectors = [
        '#boss-health-container',
        '#player-health-container',
        '#shockwave-container',
        '#instructions-container',
        '#power-up-message',
        '#low-health-overlay',
        '#damage-flash-overlay',
        '.shockwave-overlay'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
    });

    const cleanupStyles = ['low-health-style', 'shockwave-style'];
    cleanupStyles.forEach(id => {
        const styleEl = document.getElementById(id);
        if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    });

    if (gameEnv && Array.isArray(gameEnv.gameObjects)) {
        gameEnv.gameObjects.forEach(obj => {
            if (!obj) return;
            const name = obj.constructor?.name;
            if (name === 'FightingPlayer') {
                if (Array.isArray(obj.projectiles)) {
                    obj.projectiles.forEach(projectile => {
                        if (projectile && typeof projectile.destroy === 'function') projectile.destroy();
                    });
                    obj.projectiles = [];
                }
                if (Array.isArray(obj.orbitingScythes)) {
                    obj.orbitingScythes.forEach(scythe => {
                        if (scythe && typeof scythe.destroy === 'function') scythe.destroy();
                    });
                    obj.orbitingScythes = [];
                }
            }

            const spriteId = obj?.spriteData?.id?.toLowerCase?.() || '';
            const spriteSrc = obj?.spriteData?.src?.toLowerCase?.() || '';
            const isZombieLike = name === 'Zombie'
                || name === 'Npc'
                && spriteId.includes('zombie')
                || spriteSrc.includes('zombienpc');

            if (
                name === 'Projectile' ||
                name === 'Boomerang' ||
                name === 'PlayerScythe' ||
                name === 'PowerUp' ||
                name === 'PowerUpSpawner' ||
                isZombieLike
            ) {
                if (typeof obj.destroy === 'function') {
                    obj.destroy();
                }
            }
        });

        gameEnv.gameObjects = gameEnv.gameObjects.filter(obj => {
            const name = obj?.constructor?.name;
            const spriteId = obj?.spriteData?.id?.toLowerCase?.() || '';
            const spriteSrc = obj?.spriteData?.src?.toLowerCase?.() || '';
            const isZombieLike = name === 'Zombie'
                || name === 'Npc'
                && spriteId.includes('zombie')
                || spriteSrc.includes('zombienpc');
            return name !== 'Projectile'
                && name !== 'Boomerang'
                && name !== 'PlayerScythe'
                && name !== 'PowerUp'
                && name !== 'PowerUpSpawner'
                && !isZombieLike;
        });
    }
}

export default showDeathScreen;
