// Define the death screen
function showDeathScreen(player) {

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
        particle.style.left = `${playerX + player.width/2}px`;
        particle.style.top = `${playerY + player.height/2}px`;
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
    
    // 3. Reset the level after a short delay using page reload for reliability
    setTimeout(() => {
        // Clean up any lingering resources before reload
        if (self && self.timerInterval) {
            clearInterval(self.timerInterval);
        }
        
        // Force a complete page reload - most reliable way to reset
        location.reload();
    }, 3000); // 3 second delay before reset
}

export default showDeathScreen;
