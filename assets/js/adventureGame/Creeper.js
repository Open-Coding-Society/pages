import Enemy from './GameEngine/Enemy.js';
import Player from './GameEngine/Player.js';

class Creeper extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.hasExploded = false;
        this.isExploding = false;
    }
   
    checkProximityToPlayer() {
        if (this.hasExploded || this.isExploding) return;

        var players = this.gameEnv.gameObjects.filter(obj => obj instanceof Player);
        var creeper = this;

        if (players.length > 0 && creeper) {
            players.forEach(player => {
                if (player.spriteData && player.spriteData.name == 'mainplayer') {
                    var deltax = player.position.x - this.position.x;
                    var deltay = player.position.y - this.position.y;

                    var distance = Math.sqrt(
                        Math.pow(player.position.x - this.position.x, 2) + 
                        Math.pow(player.position.y - this.position.y, 2)
                    );

                    if (distance > 10) {
                        if (deltax > 0) {
                            this.velocity.x = this.gameEnv.innerWidth * 0.0005;
                        } else {
                            this.velocity.x = this.gameEnv.innerWidth * -0.0005;
                        }
                        if (deltay > 0) {
                            this.velocity.y = this.gameEnv.innerHeight * 0.0005;
                        } else {
                            this.velocity.y = this.gameEnv.innerHeight * -0.0005;
                        }
                    }
                }
            });
        }
    }

    jump() {
        // console.log("creeper is jumping!");
    }

    handleCollisionEvent() {
        if (this.hasExploded || this.isExploding) return;

        var player = this.gameEnv.gameObjects.find(obj => obj instanceof Player); 
        
        if (player && player.id === this.collisionData.touchPoints.other.id) {
            console.log("Creeper collided with player - starting sequential explosion!");

            this.isExploding = true;
            this.hasExploded = true;

            this.velocity.x = 0;
            this.velocity.y = 0;

            this.startSequentialExplosion();
        }
    }

    startSequentialExplosion() {
        console.log("Starting sequential explosion - CREEPER FIRST, then PLAYER");

        // Get the creeper and player elements
        const creeperElement = document.getElementById('Creeper');
        const playerElement = document.getElementById('Player');

        this.startCreeperExplosionAnimation(creeperElement, () => {
            console.log("Creeper explosion complete - now starting player red particle explosion");
            this.startPlayerRedParticleExplosion(playerElement, () => {
                console.log("Both explosions complete - showing message");
                this.showExplosionMessageAndRestart();
            });
        });
    }

    startCreeperExplosionAnimation(spriteElement, onComplete) {
        if (!spriteElement) {
            console.warn("Creeper element not found");
            if (onComplete) onComplete();
            return;
        }

        console.log("Starting creeper explosion animation...");

        spriteElement.style.transition = 'all 0.5s ease-out';
        spriteElement.style.filter = 'brightness(5) saturate(0) contrast(3)';
        spriteElement.style.transform = 'scale(1.5) rotate(10deg)';

        setTimeout(() => {
            spriteElement.style.filter = 'brightness(8) saturate(0) blur(3px)';
            spriteElement.style.transform = 'scale(2) rotate(-5deg)';
            
            setTimeout(() => {
                spriteElement.style.filter = 'brightness(10) saturate(0) blur(8px)';
                spriteElement.style.transform = 'scale(3) rotate(0deg)';
                spriteElement.style.opacity = '0.8';
                
                setTimeout(() => {
                    spriteElement.style.filter = 'brightness(0) saturate(0) blur(15px)';
                    spriteElement.style.transform = 'scale(0.1) rotate(180deg)';
                    spriteElement.style.opacity = '0';
                    
                    setTimeout(() => {
                        console.log("Creeper explosion animation fully complete");
                        if (onComplete) onComplete();
                    }, 500);
                    
                }, 500);
            }, 500);
        }, 500);
    }

    startPlayerRedParticleExplosion(playerElement, onComplete) {
        if (!playerElement) {
            console.warn("Player element not found");
            if (onComplete) onComplete();
            return;
        }

        console.log("Starting player red particle explosion...");

        // Get player position for particle spawn point
        const playerRect = playerElement.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        playerElement.style.transition = 'filter 0.5s ease-out';
        playerElement.style.filter = 'brightness(1.2) saturate(3) hue-rotate(-20deg) contrast(1.5)';
        playerElement.style.boxShadow = 'none';
        playerElement.style.backgroundColor = 'transparent';
        playerElement.style.border = 'none';
        playerElement.style.outline = 'none';

        setTimeout(() => {
            playerElement.style.transition = 'opacity 0.1s ease-out';
            playerElement.style.opacity = '0';

            const particles = [];
            const particleCount = 25;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = `${playerCenterX}px`;
                particle.style.top = `${playerCenterY}px`;
                particle.style.width = `${6 + Math.random() * 4}px`;
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = `rgb(${255 - Math.random() * 80}, ${Math.random() * 60}, 0)`;
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '9999';
                particle.style.pointerEvents = 'none';
                particle.style.transition = 'all 1.2s ease-out';
                particle.style.boxShadow = '0 0 4px rgba(255, 0, 0, 0.6)';
                
                document.body.appendChild(particle);
                particles.push(particle);
            }

            setTimeout(() => {
                particles.forEach((particle, index) => {
                    const angle = (index / particleCount) * Math.PI * 2;
                    const distance = 80 + Math.random() * 120;
                    const offsetX = Math.cos(angle) * distance;
                    const offsetY = Math.sin(angle) * distance + Math.random() * -60;
                    
                    particle.style.left = `${playerCenterX + offsetX}px`;
                    particle.style.top = `${playerCenterY + offsetY}px`;
                    particle.style.opacity = '0';
                    particle.style.transform = 'scale(0.2)';
                });
            }, 50);

            setTimeout(() => {
                particles.forEach(particle => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                });
                
                console.log("Player red particle explosion complete");
                if (onComplete) onComplete();
            }, 1300);

        }, 500);
    }

    showExplosionMessageAndRestart() {
        console.log("Showing explosion message and preparing restart");
        
        // Show explosion message ONLY after BOTH animations complete sequentially
        const explosionMessage = document.createElement('div');
        explosionMessage.innerHTML = 'BOOM! You got too close to the Creeper and blew up!<br>Restarting...';
        explosionMessage.id = 'creeperExplosionMessage';
        Object.assign(explosionMessage.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '10px',
            zIndex: '10000',
            fontFamily: 'Arial, sans-serif',
            animation: 'fadeInExplosion 0.5s ease-in'
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInExplosion {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.5); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1); 
                }
            }
        `;
        document.head.appendChild(style);
        
        const existingMessage = document.getElementById('creeperExplosionMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        document.body.appendChild(explosionMessage);
        
        setTimeout(() => {
            console.log("Restarting game...");
            window.location.reload();
        }, 2000);
    }

    destroy() {
        if (this.isExploding) {
            return;
        }
        super.destroy();
    }
}

export default Creeper;