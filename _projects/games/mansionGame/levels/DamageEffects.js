export function spawnPlayerDamageEffect(gameEnv, player) {
    if (!gameEnv || !gameEnv.container || !player || !player.position) return;

    const centerX = player.position.x + player.width / 2;
    const centerY = player.position.y + player.height / 2;
    const particleCount = 14;

    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        const size = 4 + Math.random() * 6;
        const offsetX = (Math.random() * 2 - 1) * 12;
        const offsetY = (Math.random() * 2 - 1) * 12;
        const travelX = (Math.random() * 2 - 1) * 40;
        const travelY = (Math.random() * 2 - 1) * 40;

        Object.assign(particle.style, {
            position: 'absolute',
            left: `${centerX + offsetX}px`,
            top: `${centerY + offsetY}px`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'rgba(255, 60, 60, 0.9)',
            boxShadow: '0 0 8px rgba(255, 0, 0, 0.7)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: '210'
        });

        gameEnv.container.appendChild(particle);
        particle.animate(
            [
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${travelX}px), calc(-50% + ${travelY}px)) scale(0.2)`, opacity: 0 }
            ],
            { duration: 1000, easing: 'ease-out', fill: 'forwards' }
        );

        setTimeout(() => particle.remove(), 1050);
    }
}
