import GamEnvBackground from './GameEnvBackground.js';
import BackgroundParallax from './BackgroundParallax.js';
import Player from './Player.js';
import Npc from './Npc.js';  // Direct import for portal creation
import Collectible from './Collectible.js';
import Quiz from './Quiz.js';
import Game from './Game.js';
import Enemy from './Enemy.js';
import DialogueSystem from './DialogueSystem.js';

class GameLevelEnd {
  constructor(gameEnv) {
    console.log("Initializing GameLevelEnd...");
    
    // Store the game environment reference
    this.gameEnv = gameEnv;
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;
    
    this.eyesCollected = 0;
    this.endTime = null;
    this.startTime = Date.now();
    this.gameCompleted = false;
    
    // Initialize the dialogue system
    this.dialogueSystem = new DialogueSystem();
    
    // Parallax background configuration
    const image_src_parallax = path + "/images/gamify/parallaxbg.png";
    const image_data_parallax = {
        name: 'parallax_background',
        id: 'parallax-background',
        greeting: "A mysterious parallax effect in the background.",
        src: image_src_parallax,
        pixels: {height: 1140, width: 2460},
        position: { x: 0, y: 0 },
        velocity: 0.2,
        layer: 0,
        zIndex: 1
    };
    
    const image_src_end = path + "/images/gamify/TransparentEnd.png";
    const image_data_end = {
        name: 'end',
        id: 'end-background',
        greeting: "The End opens before you, a vast black void in the distance. The stone beneath your feet is yellowish and hard, and the air tingles.",
        src: image_src_end,
        pixels: {height: 1140, width: 2460},
        layer: 1,
        zIndex: 5
    };
    
    const sprite_src_steve = path + "/images/gamify/end_steve.png";
    const CHILLGUY_SCALE_FACTOR = 7;
    const sprite_data_steve = {
        id: 'Steve',
        greeting: "Hi, I am Steve.",
        src: sprite_src_steve,
        SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 25,
        
        INIT_POSITION: { x: width/16, y: height/2 },
        pixels: {height: 256, width: 128},
        orientation: {rows: 8, columns: 4 },
        down: {row: 1, start: 0, columns: 4 },
        downRight: {row: 7, start: 0, columns: 4, rotate: Math.PI/8 },
        downLeft: {row: 5, start: 0, columns: 4, rotate: -Math.PI/8 },
        left: {row: 5, start: 0, columns: 4 },
        right: {row: 7, start: 0, columns: 4 },
        up: {row: 3, start: 0, columns: 4 },
        upLeft: {row: 5, start: 0, columns: 4, rotate: Math.PI/8 },
        upRight: {row: 7, start: 0, columns: 4, rotate: -Math.PI/8 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
    };
    
    const sprite_src_alex = path + "/images/gamify/Alex.png";
    const alex_SCALE_FACTOR = 7;
    const sprite_data_alex = {
        id: 'Alex',
        greeting: "Hi, I am Alex",
        src: sprite_src_alex,
        SCALE_FACTOR: alex_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 25,
        
        INIT_POSITION: { x: 0, y: height/2 },
        pixels: {height: 256, width: 128},
        orientation: {rows: 8, columns: 4 },
        down: {row: 1, start: 0, columns: 4 },
        downRight: {row: 7, start: 0, columns: 4, rotate: Math.PI/8 },
        downLeft: {row: 5, start: 0, columns: 4, rotate: -Math.PI/8 },
        left: {row: 5, start: 0, columns: 4 },
        right: {row: 7, start: 0, columns: 4 },
        up: {row: 3, start: 0, columns: 4 },
        upLeft: {row: 5, start: 0, columns: 4, rotate: Math.PI/8 },
        upRight: {row: 7, start: 0, columns: 4, rotate: -Math.PI/8 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 73, left: 74, down: 75, right: 76, interact: 85 },
        touchOptions: {
          interactLabel: "u",
          position: "right"
        }
    };

    const self = this;

    const sprite_src_enemy = path + "/images/gamify/enderman.png";
    const sprite_data_enemy = {
        id: 'Enderman',
        greeting: "You feel a dark presence...",
        src: sprite_src_enemy,
        SCALE_FACTOR: 10,
        ANIMATION_RATE: 50,
        pixels: {height: 1504, width: 574},
        INIT_POSITION: { x: width / 2, y: height / 4 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1},
        hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
        zIndex: 10,
        isKilling: false,
        update: function() {
            if (this.isKilling) {
                return;
            }
            const players = this.gameEnv.gameObjects.filter(obj => 
                obj.constructor.name === 'Player'
            );
            if (players.length === 0) return;
            let nearest = players[0];
            let minDist = Infinity;

            for (const player of players) {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = player;
                }
            }

            const speed = 1.5;
            const dx = nearest.position.x - this.position.x;
            const dy = nearest.position.y - this.position.y;
            const angle = Math.atan2(dy, dx);
            this.position.x += Math.cos(angle) * speed;
            this.position.y += Math.sin(angle) * speed;
            for (const player of players) {
                const playerX = player.position.x + player.width / 2;
                const playerY = player.position.y + player.height / 2;
                const enemyX = this.position.x + this.width / 2;
                const enemyY = this.position.y + this.height / 2;
                const dx = playerX - enemyX;
                const dy = playerY - enemyY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                const collisionThreshold = (player.width * player.hitbox.widthPercentage + 
                                        this.width * this.hitbox.widthPercentage) / 2;
                if (distance < collisionThreshold) {
                    this.isKilling = true;
                    const playerX = player.position.x;
                    const playerY = player.position.y;
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
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.parentNode.removeChild(particle);
                            }
                        }, 1000);
                    }
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
                        <div style="font-size: 16px; margin-bottom: 20px;">The Enderman got you!</div>
                        <div style="font-size: 14px;">Respawning in 2 seconds...</div>
                    `;
                    document.body.appendChild(deathMessage);
                    setTimeout(() => {
                        if (deathMessage.parentNode) {
                            deathMessage.parentNode.removeChild(deathMessage);
                        }
                    }, 2000);
                    setTimeout(() => {
                        if (self && self.timerInterval) {
                            clearInterval(self.timerInterval);
                        }
                        location.reload();
                    }, 2000);
                    break;
                }
            }
        }
    };
        
    const sprite_src_endship = path + "/images/gamify/endship.png";
    const sprite_greet_endship = "Find the elytra";

    const dialogueSystem = this.dialogueSystem;

    const sprite_data_endship = {
        id: 'Endship',
        greeting: sprite_greet_endship,
        src: sprite_src_endship,
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 1000000,
        pixels: {height: 982, width: 900},
        INIT_POSITION: { x: (width / 2), y: (height / 2) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        dialogues: [
          "The end ship looms before you...",
          "The end ship seems to beckon you to loot the treasure within...",
          "funny purple spaceship heheheheheh",
          "Press 'M' to enter the ship's adventure...",
        ],
        reaction: function() {
        },
        interact: function() {
          dialogueSystem.showRandomDialogue();
          const handleKeyPress = (event) => {
            if (event.key.toLowerCase() === 'e') {
              document.removeEventListener('keydown', handleKeyPress);
              window.location.href = '/assets/js/adventureGame/adPlatEngine/endplatformer.html';
            }
          };
          document.addEventListener('keydown', handleKeyPress);
          setTimeout(() => {
            document.removeEventListener('keydown', handleKeyPress);
          }, 10000);
        }
    };

    const sprite_src_eye = path + "/images/gamify/eyeOfEnder.png";
    const sprite_data_eye = {
        id: 'Eye of Ender',
        greeting: `Press E to claim this Eye of Ender.`,
        src: sprite_src_eye,
        SCALE_FACTOR: 20,
        ANIMATION_RATE: 9007199254740991,
        pixels: {height: 16, width: 16},
        INIT_POSITION: { x: (Math.random()*width/2.6)+width/19, y: (Math.random()*height/3.5)+height/2.7 },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 0 },
        hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
        zIndex: 10,
        dialogues: [
            "You found an Eye of Ender! These are crucial for activating the End Portal.",
            "The Eye of Ender pulses with mysterious energy.",
            "This Eye of Ender seems to be drawn toward something distant.",
            "The Eye feels cold to the touch, yet somehow alive.",
            "Ancient magic flows through this Eye of Ender.",
            "This Eye of Ender whispers secrets of distant realms."
        ],
        reaction: function() {
        },
        interact: function() {
            const players = this.gameEnv.gameObjects.filter(obj => 
                obj.constructor.name === 'Player'
            );
            let isPlayerNearby = false;
            for (const player of players) {
                const playerX = player.position.x + player.width / 2;
                const playerY = player.position.y + player.height / 2;
                const eyeX = this.position.x + this.width / 2;
                const eyeY = this.position.y + this.height / 2;
                const dx = playerX - eyeX;
                const dy = playerY - eyeY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                const collisionThreshold = (player.width * player.hitbox.widthPercentage + 
                                          this.width * this.hitbox.widthPercentage) * 1.5;
                if (distance < collisionThreshold) {
                    isPlayerNearby = true;
                    break;
                }
            }
            if (!isPlayerNearby) {
                console.log("Eye is too far away to collect");
                return;
            }
            self.eyesCollected++;
            self.updateEyeCounter();
            self.updatePlayerBalance(100);
            this.move(
                (Math.random() * width/2.6) + width/19, 
                (Math.random() * height/3.5) + height/2.7
            );
            if (this.dialogueSystem) {
                this.dialogueSystem.closeDialogue();
                let message = "Eye of Ender collected!";
                if (this.dialogues && this.dialogues.length > 0) {
                    const randomIndex = Math.floor(Math.random() * this.dialogues.length);
                    message = this.dialogues[randomIndex];
                }
                this.dialogueSystem.showDialogue(message, "Eye of Ender", this.spriteData.src);
                setTimeout(() => {
                    if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
                        this.dialogueSystem.closeDialogue();
                    }
                }, 800);
            }
            if (self.eyesCollected >= 12) {
                self.gameCompleted = true;
                if (self.timerInterval) {
                    clearInterval(self.timerInterval);
                    const finalTime = self.currentTime;
                    const formattedTime = self.formatTime(finalTime);
                    const timerDisplay = document.getElementById('game-timer');
                    if (timerDisplay) {
                        timerDisplay.innerHTML = `<span style="color: #00FFFF">COMPLETED: ${formattedTime}</span>`;
                    }
                    const bestTime = localStorage.getItem('bestTime');
                    let isNewRecord = false;
                    if (!bestTime || finalTime < parseFloat(bestTime)) {
                        localStorage.setItem('bestTime', finalTime.toString());
                        isNewRecord = true;
                        if (timerDisplay) {
                            timerDisplay.innerHTML = `<span style="color: gold">NEW RECORD! ${formattedTime}</span>`;
                            setTimeout(() => {
                                timerDisplay.innerHTML = `<span style="color: #00FFFF">COMPLETED: ${formattedTime}</span>`;
                            }, 3000);
                        }
                    }
                    self.showCompletionMessage(isNewRecord);
                    setTimeout(() => {
                        self.createDOMPortal();
                    }, 1000);
                }
            }
        }
    };
    
    this.classes = [
      { class: BackgroundParallax, data: image_data_parallax },
      { class: GamEnvBackground, data: image_data_end },
      { class: Player, data: sprite_data_steve },
      { class: Npc, data: sprite_data_endship },
      { class: Collectible, data: sprite_data_eye },
      { class: Player, data: sprite_data_alex },
      { class: Enemy, data: sprite_data_enemy }
    ];
    
    if (this.gameEnv) {
    console.log("Setting up gameEnv references in GameLevelEnd");
    this.gameEnv.gameControl = gameEnv.gameControl;
    this.gameEnv.game = gameEnv.game;
    }
    this.createEyeCounter();
    setTimeout(() => this.createStandaloneStopwatch(), 100);
    if (this.gameEnv) {
        this.gameEnv.gameControl = gameEnv.gameControl;
        this.gameEnv.game = gameEnv.game;
    }
  }
  
  createDOMPortal() {
        console.log("Creating DOM portal element");
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const portalX = screenWidth * 0.85;
        const portalY = screenHeight * 0.45;
        const portal = document.createElement('div');
        portal.id = 'dom-portal';
        portal.spriteData = {
            id: 'End Portal',
            greeting: "Return to Desert?",
            src: "./images/gamify/exitportalfull.png"
        };
        portal.style.position = 'fixed';
        portal.style.top = `${portalY}px`;
        portal.style.left = `${portalX}px`;
        portal.style.transform = 'translate(-50%, -50%)';
        portal.style.width = '50px';
        portal.style.height = '50px';
        if (this.gameEnv && this.gameEnv.path) {
            portal.style.backgroundImage = `url('${this.gameEnv.path}/images/gamify/exitportalfull.png')`;
        } else {
            portal.style.backgroundImage = "url('./images/gamify/exitportalfull.png')";
            console.warn("Warning: gameEnv.path is not available, using relative path");
        }
        portal.style.backgroundSize = 'contain';
        portal.style.backgroundRepeat = 'no-repeat';
        portal.style.backgroundPosition = 'center';
        portal.style.zIndex = '999';
        portal.style.cursor = 'pointer';
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.bottom = '-40px';
        instructions.style.left = '0';
        instructions.style.width = '100%';
        instructions.style.textAlign = 'center';
        instructions.style.color = 'white';
        instructions.style.fontSize = '14px';
        instructions.style.padding = '5px';
        instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        instructions.style.borderRadius = '5px';
        instructions.textContent = 'Return to Desert';
        portal.appendChild(instructions);
        portal.addEventListener('click', () => {
            if (this.gameEnv) {
                this.gameEnv.destroy();
            }
            if (this.gameEnv && this.gameEnv.gameControl) {
                this.gameEnv.gameControl.currentLevelIndex = 0;
                if (this.gameEnv.gameControl.gameLoop) {
                    cancelAnimationFrame(this.gameEnv.gameControl.gameLoop);
                }
                this.gameEnv.gameControl.transitionToLevel();
            } else {
                location.reload();
            }
        });
        portal.style.opacity = '0';
        portal.style.transform = 'translate(-50%, -50%) scale(0.1)';
        portal.style.transition = 'all 1s ease-out';
        document.body.appendChild(portal);
        setTimeout(() => {
            portal.style.opacity = '1';
            portal.style.transform = 'translate(-50%, -50%) scale(1)';
            const glowAnimation = document.createElement('style');
            glowAnimation.innerHTML = `
                @keyframes portalPulse {
                    0% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.7); }
                    50% { box-shadow: 0 0 50px rgba(138, 43, 226, 0.9); }
                    100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.7); }
                }
            `;
            document.head.appendChild(glowAnimation);
            portal.style.animation = 'portalPulse 2s infinite';
        }, 100);

        // Add keyboard interaction: press 'E' when player overlaps portal to activate it
        const handlePortalKey = (event) => {
          if (!event || typeof event.key !== 'string') return;
          if (event.key.toLowerCase() !== 'e') return;

          try {
            const portalRect = portal.getBoundingClientRect();
            // Find any player that overlaps the portal on screen
            const players = (this.gameEnv && this.gameEnv.gameObjects) ? this.gameEnv.gameObjects.filter(o => o.constructor && o.constructor.name === 'Player') : [];
            let triggered = false;
            for (const player of players) {
              if (!player) continue;

              // Preferred check: player's canvas rect overlap
              if (player.canvas && typeof player.canvas.getBoundingClientRect === 'function') {
                const pRect = player.canvas.getBoundingClientRect();
                const overlap = !(pRect.right < portalRect.left || pRect.left > portalRect.right || pRect.bottom < portalRect.top || pRect.top > portalRect.bottom);
                if (overlap) {
                  portal.click();
                  triggered = true;
                  break;
                }
              }

              // Fallback: use player's logical position -> convert to screen coords
              try {
                const offsetLeft = (this.gameEnv && this.gameEnv.canvasOffsetLeft) ? this.gameEnv.canvasOffsetLeft : 0;
                const offsetTop = (this.gameEnv && this.gameEnv.canvasOffsetTop) ? this.gameEnv.canvasOffsetTop : 0;
                const scaleX = (this.gameEnv && this.gameEnv.canvasScaleX) ? this.gameEnv.canvasScaleX : 1;
                const scaleY = (this.gameEnv && this.gameEnv.canvasScaleY) ? this.gameEnv.canvasScaleY : 1;
                const px = offsetLeft + (player.position?.x || 0) * scaleX + (player.width || 0) * 0.5;
                const py = offsetTop + (player.position?.y || 0) * scaleY + (player.height || 0) * 0.5;
                const portalCx = portalRect.left + portalRect.width / 2;
                const portalCy = portalRect.top + portalRect.height / 2;
                const dx = px - portalCx;
                const dy = py - portalCy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                // If within 100px, consider it touching (matches earlier behavior)
                if (dist < 100) {
                  portal.click();
                  triggered = true;
                  break;
                }
              } catch (e) {
                // ignore conversion errors and continue
              }
            }

            if (triggered) {
              document.removeEventListener('keydown', handlePortalKey);
            }
          } catch (err) {
            console.warn('Portal key handler error', err);
          }
        };

        document.addEventListener('keydown', handlePortalKey);
    }
  
  showCompletionMessage(isNewRecord) {
    const counterContainer = document.getElementById('eye-counter-container');
    const counterText = document.getElementById('eye-counter');
    if (counterContainer && counterText) {
      counterText.textContent = `12/12 - ALL COLLECTED!`;
      counterText.style.color = '#00FFFF';
      if (isNewRecord) {
        const recordMsg = document.createElement('div');
        recordMsg.textContent = "NEW RECORD!";
        recordMsg.style.color = 'gold';
        recordMsg.style.fontWeight = 'bold';
        recordMsg.style.fontSize = '14px';
        recordMsg.style.marginTop = '5px';
        recordMsg.style.textAlign = 'center';
        counterContainer.appendChild(recordMsg);
        recordMsg.style.animation = 'blink 1s infinite';
        const style = document.createElement('style');
        if (!document.getElementById('blink-animation')) {
          style.id = 'blink-animation';
          style.innerHTML = `
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `;
          document.head.appendChild(style);
        }
      }
      const portalMsg = document.createElement('div');
      portalMsg.textContent = "Click portal to return";
      portalMsg.style.color = 'white';
      portalMsg.style.fontSize = '12px';
      portalMsg.style.marginTop = '5px';
      portalMsg.style.textAlign = 'center';
      counterContainer.appendChild(portalMsg);
    }
  }
  
  createStandaloneStopwatch() {
    console.log("Creating stopwatch");
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) {
      console.error("Stats container not found, delaying timer creation");
      setTimeout(() => this.createStandaloneStopwatch(), 200);
      return;
    }
    const statsRect = statsContainer.getBoundingClientRect();
    const timer = document.createElement('div');
    timer.id = 'game-timer';
    timer.style.position = 'fixed';
    timer.style.top = `${statsRect.top}px`;
    timer.style.right = `${window.innerWidth - statsRect.left + 10}px`;
    timer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timer.style.color = 'white';
    timer.style.padding = '10px 20px';
    timer.style.borderRadius = '10px';
    timer.style.zIndex = '1000';
    timer.style.fontSize = '20px';
    timer.style.fontWeight = 'bold';
    timer.style.border = '2px solid #4a86e8';
    timer.style.boxShadow = '0 0 10px rgba(74, 134, 232, 0.7)';
    const timerLabel = document.createElement('div');
    timerLabel.textContent = 'TIME';
    timerLabel.style.fontSize = '12px';
    timerLabel.style.fontWeight = 'bold';
    timerLabel.style.color = 'white';
    timerLabel.style.marginBottom = '5px';
    timerLabel.style.textAlign = 'center';
    const timerDisplay = document.createElement('div');
    timerDisplay.textContent = '00:00.0';
    timerDisplay.style.color = '#4a86e8';
    timerDisplay.style.textAlign = 'center';
    timer.appendChild(timerLabel);
    timer.appendChild(timerDisplay);
    document.body.appendChild(timer);
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
        if (this.gameCompleted) return;
        const elapsed = (Date.now() - this.startTime) / 1000;
        timerDisplay.textContent = this.formatTime(elapsed);
        this.currentTime = elapsed;
    }, 100);
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds * 10) % 10);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  }
  createEyeCounter() {
    const counterContainer = document.createElement('div');
    counterContainer.id = 'eye-counter-container';
    counterContainer.style.position = 'fixed';
    counterContainer.style.top = '180px';
    counterContainer.style.right = '10px';
    counterContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    counterContainer.style.color = 'white';
    counterContainer.style.padding = '10px';
    counterContainer.style.borderRadius = '10px';
    counterContainer.style.display = 'flex';
    counterContainer.style.flexDirection = 'column';
    counterContainer.style.alignItems = 'center';
    counterContainer.style.fontFamily = "'Minecraft', sans-serif";
    counterContainer.style.zIndex = '1000';
    counterContainer.style.border = '2px solid #4a86e8';
    counterContainer.style.boxShadow = '0 0 10px rgba(74, 134, 232, 0.7)';
    counterContainer.style.minWidth = '150px';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    const counterRow = document.createElement('div');
    counterRow.style.display = 'flex';
    counterRow.style.alignItems = 'center';
    counterRow.style.width = '100%';
    const eyeIcon = document.createElement('div');
    eyeIcon.style.width = '25px';
    eyeIcon.style.height = '25px';
    if (this.gameEnv && this.gameEnv.path) {
        eyeIcon.style.backgroundImage = `url('${this.gameEnv.path}/images/gamify/eyeOfEnder.png')`;
    } else {
        eyeIcon.style.backgroundImage = "url('./images/gamify/eyeOfEnder.png')";
        console.warn("Warning: gameEnv.path is not available, using relative path");
    }
    eyeIcon.style.backgroundSize = 'contain';
    eyeIcon.style.backgroundRepeat = 'no-repeat';
    eyeIcon.style.marginRight = '10px';
    const counterText = document.createElement('div');
    counterText.id = 'eye-counter';
    counterText.textContent = `0/12`;
    counterText.style.fontSize = '18px';
    counterText.style.color = '#4a86e8';
    counterText.style.textShadow = '0 0 5px rgba(74, 134, 232, 0.7)';
    counterRow.appendChild(eyeIcon);
    counterRow.appendChild(counterText);
    counterContainer.appendChild(counterRow);
    document.body.appendChild(counterContainer);
  }
  
  updateEyeCounter() {
    const counterText = document.getElementById('eye-counter');
    if (counterText) {
      counterText.textContent = `${this.eyesCollected}/12`;
      counterText.style.transform = 'scale(1.5)';
      counterText.style.color = '#00FFFF';
      setTimeout(() => {
        counterText.style.transform = 'scale(1)';
        counterText.style.color = '#4a86e8';
      }, 300);
    }
  }
  
  updatePlayerBalance(amount) {
    const balanceElement = document.getElementById('balance');
    if (!balanceElement) {
      console.error("Balance element not found");
      return;
    }
    let currentBalance = parseInt(balanceElement.innerHTML) || 0;
    const newBalance = currentBalance + amount;
    balanceElement.innerHTML = newBalance;
    localStorage.setItem('balance', newBalance);
    balanceElement.style.transform = 'scale(1.5)';
    balanceElement.style.color = '#00FFFF';
    setTimeout(() => {
      balanceElement.style.transform = 'scale(1)';
      balanceElement.style.color = '#4a86e8';
    }, 300);
    if (Game.id && Game.javaURI) {
      this.updateServerBalance(Game.id, amount);
    }
    this.showFloatingPoints(amount);
  }
  
  updateServerBalance(personId, amount) {
    if (!Game.javaURI || !Game.fetchOptions) {
      console.error("Cannot update server balance - missing Game.javaURI or Game.fetchOptions");
      return;
    }
    const endpoint = `${Game.javaURI}/rpg_answer/updateBalance/${personId}/${amount}`;
    fetch(endpoint, Game.fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update balance: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Balance updated on server:", data);
      })
      .catch(error => {
        console.error("Error updating balance on server:", error);
      });
  }
  
  showFloatingPoints(amount) {
    const floatingPoints = document.createElement('div');
    floatingPoints.textContent = `+${amount}`;
    floatingPoints.style.position = 'fixed';
    floatingPoints.style.color = '#4a86e8';
    floatingPoints.style.fontSize = '24px';
    floatingPoints.style.fontWeight = 'bold';
    floatingPoints.style.textShadow = '0 0 10px rgba(74, 134, 232, 0.7)';
    floatingPoints.style.zIndex = '9999';
    const eyeCounter = document.getElementById('eye-counter-container');
    if (eyeCounter) {
      const rect = eyeCounter.getBoundingClientRect();
      floatingPoints.style.top = `${rect.top - 30}px`;
      floatingPoints.style.left = `${rect.left + 20}px`;
    } else {
      floatingPoints.style.top = '100px';
      floatingPoints.style.right = '30px';
    }
    floatingPoints.style.animation = 'float-up 1.5s ease-out forwards';
    const style = document.createElement('style');
    if (!document.getElementById('float-animation')) {
      style.id = 'float-animation';
      style.innerHTML = `
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-50px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(floatingPoints);
    setTimeout(() => {
      floatingPoints.remove();
    }, 1500);
  }
}

export default GameLevelEnd;
