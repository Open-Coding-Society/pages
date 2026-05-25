export function spawnPlayerDamageEffect(gameEnv, player) {
    if (!gameEnv || !gameEnv.container || !player || !player.position) return;

    const existing = document.getElementById('damage-flash-overlay');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }

    const flash = document.createElement('div');
    flash.id = 'damage-flash-overlay';
    Object.assign(flash.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(255, 0, 0, 0.45)',
        pointerEvents: 'none',
        zIndex: '220'
    });

    gameEnv.container.appendChild(flash);
    flash.animate(
        [
            { opacity: 0.7 },
            { opacity: 0 }
        ],
        { duration: 420, easing: 'ease-out', fill: 'forwards' }
    );

    setTimeout(() => flash.remove(), 460);
}
