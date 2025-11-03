// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from '/assets/js/adventureGame/GameEngine/GameEnvBackground.js';
import Player from '/assets/js/adventureGame/GameEngine/Player.js';
import Npc from '/assets/js/adventureGame/GameEngine/Npc.js';
import GameControl from '/assets/js/adventureGame/GameEngine/GameControl.js';
import DialogueSystem from '/assets/js/adventureGame/DialogueSystem.js';
import { initPlanetNavigation } from '/assets/js/digitalFamine/planetNavigation.js';

class GameLevelHomePage {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Clear any lingering dialogue elements immediately on page load
    const existingDialogues = document.querySelectorAll('[id*="dialogue"], [class*="dialogue"], .dialogue-overlay, #dialogue-overlay');
    existingDialogues.forEach(el => el.remove());

    this.dialogueSystem = new DialogueSystem();
    
    // Add flag to track if dialogue is open
    this.dialogueOpen = false;
    
    // Override dialogueSystem methods to track state
    const originalShowDialogue = this.dialogueSystem.showDialogue.bind(this.dialogueSystem);
    this.dialogueSystem.showDialogue = (...args) => {
      this.dialogueOpen = true;
      return originalShowDialogue(...args);
    };
    
    const originalCloseDialogue = this.dialogueSystem.closeDialogue.bind(this.dialogueSystem);
    this.dialogueSystem.closeDialogue = () => {
      this.dialogueOpen = false;
      this.removeExistingKeyListener();
      return originalCloseDialogue();
    };

    this.applyPlanetEffect = (ctx, sprite, planetName) => {
      const isCompleted = this.progression[planetName];
      const isLocked = sprite.isLocked;

      if (isLocked) {
        // Locked: Much darker and desaturated
        ctx.globalAlpha = 0.25;
        ctx.filter = 'grayscale(100%) brightness(0.3)';
      } else if (isCompleted) {
        // Completed: Strong green glow effect
        ctx.globalAlpha = 1;
        ctx.filter = 'brightness(1.0) saturate(1.5) hue-rotate(90deg)';
      } else {
        // Current: Bright white/yellow glow
        ctx.globalAlpha = 1;
        ctx.filter = 'brightness(1.4) saturate(1.4)';
      }
    };

    this.progression = {
      microblog: false,
      medialit: false,
      ai: false,
      cyber: false,
      current: 'microblog',
      getNextPlanet: function() {
        if (!this.microblog) return 'microblog';
        if (!this.medialit) return 'medialit';
        if (!this.ai) return 'ai';
        if (!this.cyber) return 'cyber';
        return 'end';
      }
    };
    
    this.debugProgress = () => {
      // Silent debug - only log when explicitly needed for debugging
      // console.log('Current Progress:', this.progression);
    };
    
    const savedProgress = localStorage.getItem('planetProgression');
    if (savedProgress) {
      const loaded = JSON.parse(savedProgress);
      this.progression = {
        ...this.progression,
        microblog: loaded.microblog || false,
        medialit: loaded.medialit && loaded.microblog ? loaded.medialit : false,
        ai: loaded.ai && loaded.medialit ? loaded.ai : false,
        cyber: loaded.cyber && loaded.ai ? loaded.cyber : false,
        current: loaded.current || this.progression.getNextPlanet()
      };
    }

    document.addEventListener('keydown', (e) => {
      const planetOrder = ['microblog', 'medialit', 'ai', 'cyber', 'end'];
      const currentIndex = planetOrder.indexOf(this.progression.current);

      if (e.key.toLowerCase() === 'b') {
        if (currentIndex > 0) {
          const prevPlanet = planetOrder[currentIndex - 1];
          this.progression.current = prevPlanet;
          localStorage.setItem('planetProgression', JSON.stringify(this.progression));
          this.debugProgress();
          location.reload();
        }
      }
      
      if (e.key.toLowerCase() === 'n') {
        if (currentIndex < planetOrder.length - 1) {
          const nextPlanet = planetOrder[currentIndex + 1];
          if (this.progression[this.progression.current]) {
            this.progression.current = nextPlanet;
            localStorage.setItem('planetProgression', JSON.stringify(this.progression));
            this.debugProgress();
            location.reload();
          } else {
            this.dialogueSystem.showDialogue("Complete the current planet first!");
          }
        }
      }
      
      if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        localStorage.removeItem('planetProgression');
        localStorage.removeItem('playerPosition'); // Also clear player position
        location.reload();
      }
    });
    
    this.activeKeyListener = null;
    
    this.removeExistingKeyListener = () => {
      if (this.activeKeyListener) {
        document.removeEventListener('keydown', this.activeKeyListener);
        this.activeKeyListener = null;
      }
    };
    
    const image_src_desert = path + "/images/digital-famine/galaxy.jpg";
    const image_data_desert = {
      name: 'galaxy',
      greeting: "Welcome to the Galaxy!  This will be the start of your adventure in saving the Earth",
      src: image_src_desert,
      pixels: { height: 580, width: 1038 }
    };

    // Load saved player position or use default
    const savedPosition = localStorage.getItem('playerPosition');
    let playerInitPosition = { x: (width * 0.01), y: (height * 0.75) - 100 };
    
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        // Validate that position is within bounds
        if (parsed.x >= 0 && parsed.x <= width - 100 && 
            parsed.y >= 0 && parsed.y <= height - 100) {
          playerInitPosition = parsed;
          console.log('✅ Restored player position:', playerInitPosition);
        }
      } catch (e) {
        console.warn('Failed to parse saved player position');
      }
    }

    const sprite_src_chillguy = path + "/images/digital-famine/Rocket.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: 9,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 10,
        INIT_POSITION: { x: 0, y: 275 - (275/CHILLGUY_SCALE_FACTOR) }, 
        pixels: {height: 512, width: 256},
        orientation: {rows: 4, columns: 2},
        right: {row: 3, start: 0, columns: 2},
        down: {row: 2, start: 0, columns: 2},
        left: {row: 1, start: 0, columns: 2},
        up: {row: 0, start: 0, columns: 2},
        upRight: {row: 3, start: 0, columns: 2, rotate: -Math.PI/16},
        upLeft: {row: 1, start: 0, columns: 2, rotate: Math.PI/16},
        downRight: {row: 3, start: 0, columns: 2, rotate: Math.PI/16},
        downLeft: {row: 1, start: 0, columns: 2, rotate: -Math.PI/16},
        hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_satellite = path + "/images/digital-famine/Satellite.png";
    const sprite_data_satellite = {
        id: 'Satellite',
        greeting: false,
        src: sprite_src_satellite,
        SCALE_FACTOR: 18,
        ANIMATION_RATE: 1,
        pixels: {height: 1920, width: 1902},
        INIT_POSITION: { x: 100, y: height - (height/CHILLGUY_SCALE_FACTOR) - 50 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: 0},
        hitbox: { widthPercentage: 0.01, heightPercentage: 0.01 },
        zIndex: 15
    };

    const sprite_src_ancientBook = path + "/images/digital-famine/ancientBook.png";
    const sprite_data_ancientBook = {
        id: 'AncientBook',
        greeting: "This is the amount of pages you collected. Collect 4 ancient pages to save humanity!",
        src: sprite_src_ancientBook,
        SCALE_FACTOR: 8,
        ANIMATION_RATE: 1,
        pixels: {height: 1080, width: 1688},
        INIT_POSITION: { x: width - 200, y: height - 150 },
        orientation: {rows: 1, columns: 1},
        down: {row: 0, start: 0, columns: 1, rotate: 0},
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        zIndex: 20
    };

    const dialogueSystem = this.dialogueSystem;
    this.planetData = [];

    const sprite_src_cyberplanet = path + "/images/digital-famine/planet-3.png";
    const sprite_data_cyberplanet = {
        id: 'CyberPlanet',
        greeting: false,
        src: sprite_src_cyberplanet,
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.30), y: (height * 0.70) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.ai;
          this.applyPlanetEffect(ctx, this, 'cyber');
          
          if (!this.isLocked) {
            const glowColor = this.progression.cyber ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.5)';
            const glowSize = this.progression.cyber ? 40 : 50;
            
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowSize;
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(this.position.x + this.size.width/2, this.position.y + this.size.height/2, this.size.width/2 + 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }.bind(this),
        dialogues: ["Would you like to travel to the Cyber Planet?"],
        reaction: function() { },
        interact: function() {
          // Check if dialogue is already open
          if (this.dialogueOpen) {
            console.log('⚠️ Dialogue already open, ignoring interaction');
            return;
          }
          
          this.removeExistingKeyListener();
          this.debugProgress();
          
          if (!this.progression.ai) {
            dialogueSystem.showDialogue("Complete AI Planet first!", "", sprite_src_cyberplanet);
            return;
          }

          dialogueSystem.showDialogue("Do you want to travel to Cybersecurity Planet?", "", sprite_src_cyberplanet);
          dialogueSystem.addButtons([{
              text: "Travel",
              action: () => {
                this.progression.cyber = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                this.debugProgress();
                dialogueSystem.closeDialogue();
                window.location.href = '/digital-famine/cybersecurity-game/';
              },
              primary: true
            }]);
        }.bind(this)
    };
    this.planetData.push({ name: 'cyber', pos: sprite_data_cyberplanet.INIT_POSITION, scale: sprite_data_cyberplanet.SCALE_FACTOR });

    const sprite_src_medialit = path + "/images/digital-famine/planet-1.png";
    const sprite_data_medialit = {
        id: 'MediaLitPlanet',
        greeting: false,
        src: sprite_src_medialit,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.65), y: (height * 0.20) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.microblog;
          this.applyPlanetEffect(ctx, this, 'medialit');
          
          if (!this.isLocked) {
            const glowColor = this.progression.medialit ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.5)';
            const glowSize = this.progression.medialit ? 40 : 50;
            
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowSize;
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(this.position.x + this.size.width/2, this.position.y + this.size.height/2, this.size.width/2 + 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }.bind(this),
        interact: function() {
          // Check if dialogue is already open
          if (this.dialogueOpen) {
            console.log('⚠️ Dialogue already open, ignoring interaction');
            return;
          }
          
          this.removeExistingKeyListener();
          if (!this.progression.microblog) {
            dialogueSystem.showDialogue("Complete Microblogging Planet first!", "", sprite_src_medialit);
            return;
          }
          dialogueSystem.showDialogue("Do you want to travel to Media Literacy Planet?", "", sprite_src_medialit);
          dialogueSystem.addButtons([{
              text: "Travel",
              action: () => {
                this.progression.medialit = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                dialogueSystem.closeDialogue();
                window.location.href = '/digital-famine/media-lit/';
              },
              primary: true
            }]);
        }.bind(this)
    };
    this.planetData.push({ name: 'medialit', pos: sprite_data_medialit.INIT_POSITION, scale: sprite_data_medialit.SCALE_FACTOR });

    const sprite_src_ai = path + "/images/digital-famine/planet-2.png";
    const sprite_data_ai = {
        id: 'AIPlanet',
        greeting: false,
        src: sprite_src_ai,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.75), y: (height * 0.75) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.medialit;
          this.applyPlanetEffect(ctx, this, 'ai');
          
          if (!this.isLocked) {
            const glowColor = this.progression.ai ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.5)';
            const glowSize = this.progression.ai ? 40 : 50;
            
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = glowSize;
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(this.position.x + this.size.width/2, this.position.y + this.size.height/2, this.size.width/2 + 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }.bind(this),
        interact: function() {
          // Check if dialogue is already open
          if (this.dialogueOpen) {
            console.log('⚠️ Dialogue already open, ignoring interaction');
            return;
          }
          
          this.removeExistingKeyListener();
          if (!this.progression.medialit) {
            dialogueSystem.showDialogue("Complete Media Literacy Planet first!", "", sprite_src_ai);
            return;
          }
          dialogueSystem.showDialogue("Do you want to travel to AI Planet?", "", sprite_src_ai);
          dialogueSystem.addButtons([{
              text: "Travel",
              action: () => {
                this.progression.ai = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                dialogueSystem.closeDialogue();
                window.location.href = '/digital-famine/ai/';
              },
              primary: true
            }]);
        }.bind(this)
    };
    this.planetData.push({ name: 'ai', pos: sprite_data_ai.INIT_POSITION, scale: sprite_data_ai.SCALE_FACTOR });

    const sprite_src_microblog = path + "/images/digital-famine/planet-4.png";
    const sprite_data_microblog = {
        id: 'MicroblogPlanet',
        greeting: false,
        src: sprite_src_microblog,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.15), y: (height * 0.25) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = false;
          this.applyPlanetEffect(ctx, this, 'microblog');
        }.bind(this),
        interact: function() {
          // Check if dialogue is already open
          if (this.dialogueOpen) {
            console.log('⚠️ Dialogue already open, ignoring interaction');
            return;
          }
          
          this.removeExistingKeyListener();
          dialogueSystem.showDialogue("Do you want to travel to Microblogging Planet?", "", sprite_src_microblog);
          dialogueSystem.addButtons([{
              text: "Travel",
              action: () => {
                this.progression.microblog = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                dialogueSystem.closeDialogue();
                window.location.href = '/digital-famine/microblog/';
              },
              primary: true
            }]);
        }.bind(this)
    };
    this.planetData.push({ name: 'microblog', pos: sprite_data_microblog.INIT_POSITION, scale: sprite_data_microblog.SCALE_FACTOR });

    const sprite_src_home = path + "/images/digital-famine/home-planet.png";
    const sprite_data_home = {
        id: 'HomePlanet',
        greeting: false,
        src: sprite_src_home,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.01), y: (height * 0.75) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          const allComplete = this.progression.microblog && 
                             this.progression.medialit && 
                             this.progression.ai && 
                             this.progression.cyber;
          this.isLocked = !allComplete;
          
          if (this.isLocked) {
            ctx.globalAlpha = 0.3;
            ctx.filter = 'grayscale(100%) brightness(0.4)';
          } else {
            ctx.globalAlpha = 1;
            ctx.filter = 'brightness(1.3) saturate(1.5)';
          }
        }.bind(this),
        interact: function() {
          // Check if dialogue is already open
          if (this.dialogueOpen) {
            console.log('⚠️ Dialogue already open, ignoring interaction');
            return;
          }
          
          this.removeExistingKeyListener();
          if (!this.progression.cyber) {
            dialogueSystem.showDialogue("Complete all planets first!", "", sprite_src_home);
            return;
          }
          dialogueSystem.showDialogue("Do you want to return to Earth?", "", sprite_src_home);
          dialogueSystem.addButtons([{
              text: "Travel",
              action: () => window.location.href = '/digital-famine/end/',
              primary: true
            }]);
        }.bind(this)
    };
    this.planetData.push({ name: 'end', pos: sprite_data_home.INIT_POSITION, scale: sprite_data_home.SCALE_FACTOR });

    this.classes = [
      { class: GameEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_cyberplanet },
      { class: Npc, data: sprite_data_medialit },
      { class: Npc, data: sprite_data_ai },
      { class: Npc, data: sprite_data_microblog },
      { class: Npc, data: sprite_data_home },
      { class: Npc, data: sprite_data_satellite },
      { class: Npc, data: sprite_data_ancientBook },
    ];

    this.satelliteData = sprite_data_satellite;
    this.playerData = sprite_data_chillguy;
    this.satelliteObject = null;
    this.playerObject = null;
    
    // Save position interval handle
    this.savePositionInterval = null;
    
    this.createPageCounter();
  }
  
  createPageCounter() {
    const container = document.getElementById('gameContainer');
    
    const counterDiv = document.createElement('div');
    counterDiv.id = 'page-counter';
    counterDiv.style.position = 'absolute';
    counterDiv.style.right = '60px';
    counterDiv.style.bottom = '120px';
    counterDiv.style.color = '#FFD700';
    counterDiv.style.fontSize = '28px';
    counterDiv.style.fontWeight = 'bold';
    counterDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.9)';
    counterDiv.style.zIndex = '25';
    counterDiv.style.fontFamily = 'Georgia, serif';
    
    const pagesCollected = (this.progression.microblog ? 1 : 0) +
                           (this.progression.medialit ? 1 : 0) +
                           (this.progression.ai ? 1 : 0) +
                           (this.progression.cyber ? 1 : 0);
    
    counterDiv.textContent = `${pagesCollected}/4`;
    container.appendChild(counterDiv);
    this.pageCounter = counterDiv;
  }
  
  createPlanetStatusBadges() {
    const container = document.getElementById('gameContainer');
    
    if (!container) {
      console.error('❌ gameContainer not found!');
      return;
    }
    
    const badgeContainer = document.createElement('div');
    badgeContainer.id = 'planet-badges-container';
    badgeContainer.style.position = 'absolute';
    badgeContainer.style.top = '0';
    badgeContainer.style.left = '0';
    badgeContainer.style.width = '100%';
    badgeContainer.style.height = '100%';
    badgeContainer.style.pointerEvents = 'none';
    badgeContainer.style.zIndex = '9998';
    
    container.appendChild(badgeContainer);
    this.badgeContainer = badgeContainer;
    
    this.planetBadges = {};
    this.planetData.forEach((planet, index) => {
      const badge = document.createElement('div');
      badge.id = `badge-${planet.name}`;
      badge.style.position = 'absolute';
      badge.style.padding = '5px 10px';
      badge.style.borderRadius = '10px';
      badge.style.fontSize = '10px';
      badge.style.fontWeight = 'bold';
      badge.style.textShadow = '1px 1px 2px rgba(0,0,0,0.9)';
      badge.style.fontFamily = 'Arial, sans-serif';
      badge.style.textAlign = 'center';
      badge.style.minWidth = '65px';
      
      const planetSize = 512 / planet.scale;
      const badgeX = planet.pos.x + planetSize/2 - 32;
      const badgeY = planet.pos.y - 22;
      
      badge.style.left = `${badgeX}px`;
      badge.style.top = `${badgeY}px`;
      
      badgeContainer.appendChild(badge);
      this.planetBadges[planet.name] = badge;
    });
    
    this.updatePlanetStatusBadges();
  }
  
  updatePlanetStatusBadges() {
    if (!this.planetBadges) return;
    
    this.planetData.forEach(planet => {
      const badge = this.planetBadges[planet.name];
      if (!badge) return;
      
      let status, bgColor, textColor, icon;
      
      if (planet.name === 'end') {
        const allComplete = this.progression.microblog && 
                           this.progression.medialit && 
                           this.progression.ai && 
                           this.progression.cyber;
        if (!allComplete) {
          status = 'LOCKED';
          bgColor = 'rgba(100, 100, 100, 0.9)';
          textColor = '#ccc';
          icon = '🔒';
        } else {
          status = 'READY';
          bgColor = 'rgba(59, 130, 246, 0.9)';
          textColor = '#fff';
          icon = '🌍';
        }
      } else {
        const isCompleted = this.progression[planet.name];
        const isLocked = (planet.name === 'medialit' && !this.progression.microblog) ||
                         (planet.name === 'ai' && !this.progression.medialit) ||
                         (planet.name === 'cyber' && !this.progression.ai);
        
        if (isCompleted) {
          status = 'DONE';
          bgColor = 'rgba(34, 197, 94, 0.95)';
          textColor = '#fff';
          icon = '✅';
        } else if (isLocked) {
          status = 'LOCKED';
          bgColor = 'rgba(100, 100, 100, 0.9)';
          textColor = '#ccc';
          icon = '🔒';
        } else {
          status = 'NEXT';
          bgColor = 'rgba(255, 193, 7, 0.95)';
          textColor = '#000';
          icon = '⭐';
        }
      }
      
      badge.style.background = bgColor;
      badge.style.color = textColor;
      badge.style.border = `2px solid ${textColor}`;
      badge.textContent = `${icon} ${status}`;
    });
  }
  
  updatePageCounter() {
    if (this.pageCounter) {
      const pagesCollected = (this.progression.microblog ? 1 : 0) +
                             (this.progression.medialit ? 1 : 0) +
                             (this.progression.ai ? 1 : 0) +
                             (this.progression.cyber ? 1 : 0);
      this.pageCounter.textContent = `${pagesCollected}/4`;
    }
  }
  
  savePlayerPosition() {
    if (this.playerObject && this.playerObject.position) {
      const position = {
        x: this.playerObject.position.x,
        y: this.playerObject.position.y
      };
      localStorage.setItem('playerPosition', JSON.stringify(position));
      // Silent save - no console log to avoid spam
    }
  }

  createSplashScreen() {
    // Check if splashscreen element already exists
    let existingSplash = document.getElementById('splashscreen');
    if (!existingSplash) {
      existingSplash = document.createElement('div');
      existingSplash.id = 'splashscreen';
      document.body.appendChild(existingSplash);
    }

    // Scene data
    const scenes = [
      {
        title: "Welcome to Digital Famine",
        subtitle: "Save Earth from the Information Crisis",
        content: `
          <div class="scene-content">
            <p><strong>The year is 2157.</strong> Earth faces its greatest threat yet - not from war or climate change, but from a catastrophic information collapse known as the Digital Famine.</p>
            
            <p>Misinformation, cyber attacks, and AI manipulation have fractured society. Knowledge itself has become corrupted, and humanity teeters on the brink of a new dark age.</p>
            
            <p>You are Earth's last hope - a pilot sent to recover the four Ancient Pages of Digital Wisdom scattered across the galaxy.</p>
          </div>
        `,
        image: "🌌"
      },
      {
        title: "The Ancient Pages",
        subtitle: "Collect the Four Pages of Digital Wisdom",
        content: `
          <div class="scene-content">
            <p>Each page contains essential knowledge to restore truth and security to our world:</p>
            
            <div class="pages-grid">
              <div class="page-card">
                <div class="page-icon">📱</div>
                <h4>Microblog Page</h4>
                <p>Master the art of digital communication and identify misinformation patterns</p>
              </div>
              
              <div class="page-card">
                <div class="page-icon">📰</div>
                <h4>Media Literacy Page</h4>
                <p>Learn to discern truth from deception in modern media</p>
              </div>
              
              <div class="page-card">
                <div class="page-icon">🤖</div>
                <h4>AI Page</h4>
                <p>Understand and control artificial intelligence systems</p>
              </div>
              
              <div class="page-card">
                <div class="page-icon">🔒</div>
                <h4>Cybersecurity Page</h4>
                <p>Protect against digital threats and cyber attacks</p>
              </div>
            </div>
          </div>
        `,
        image: "📚"
      },
      {
        title: "Your Mission",
        subtitle: "Navigate the Galaxy and Complete Challenges",
        content: `
          <div class="scene-content">
            <p>Navigate your rocket through the galaxy, visit each planet, and complete their challenges to earn the Ancient Pages.</p>
            
            <div class="mission-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Travel to Each Planet</h4>
                  <p>Fly your rocket to different planets in the correct sequence</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Complete Challenges</h4>
                  <p>Master digital literacy skills through interactive missions</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Collect Ancient Pages</h4>
                  <p>Earn pages by successfully completing planet challenges</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Save Humanity</h4>
                  <p>Return to Earth with all four pages to restore knowledge</p>
                </div>
              </div>
            </div>
            
            <p class="warning-text">⚠️ Only when all four pages are collected can Earth be saved!</p>
          </div>
        `,
        image: "🚀"
      },
      {
        title: "Game Controls",
        subtitle: "Master Your Rocket Ship",
        content: `
          <div class="scene-content">
            <div class="controls-grid">
              <div class="control-item">
                <div class="key-display">W</div>
                <p>Move Up</p>
              </div>
              
              <div class="control-item">
                <div class="key-display">A</div>
                <p>Move Left</p>
              </div>
              
              <div class="control-item">
                <div class="key-display">S</div>
                <p>Move Down</p>
              </div>
              
              <div class="control-item">
                <div class="key-display">D</div>
                <p>Move Right</p>
              </div>
              
              <div class="control-item">
                <div class="key-display">E</div>
                <p>Interact with Planets</p>
              </div>
              
              <div class="control-item">
                <div class="key-display">T</div>
                <p>Toggle Satellite Companion</p>
              </div>
            </div>
            
            <div class="tips-section">
              <h4>💡 Pro Tips</h4>
              <ul>
                <li>Planets must be completed in order: Microblog → Media Literacy → AI → Cybersecurity</li>
                <li>Your satellite companion follows you around for moral support!</li>
                <li>Look for glowing planets - they're ready for interaction</li>
                <li>Check the page counter in the bottom-right to track your progress</li>
                <li>Your rocket position is automatically saved!</li>
              </ul>
            </div>
            
            <div class="mobile-controls-info">
              <h4>📱 Mobile/Touch Controls</h4>
              <p>On mobile devices, use the on-screen joystick to move your rocket and tap the interact button when near planets.</p>
            </div>
            
            <p class="ready-text">Are you ready to save humanity?</p>
          </div>
        `,
        image: "🎮"
      }
    ];

    let currentScene = 0;

    // Create overlay backdrop
    const overlay = document.createElement('div');
    overlay.id = 'splash-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99998;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.5s ease-in;
    `;

    // Style the splashscreen as a modal
    existingSplash.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 800px;
      height: 85vh;
      max-height: 650px;
      background: linear-gradient(135deg, #0f1729 0%, #1a1f3a 100%);
      color: #ffffff;
      padding: 0;
      border-radius: 24px;
      box-shadow: 0 0 60px rgba(100, 200, 255, 0.6);
      z-index: 99999;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border: 3px solid #00d4ff;
      animation: slideIn 0.6s ease-out;
      display: flex;
      flex-direction: column;
    `;

    // Create header with close button
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 25px 30px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 2px solid rgba(0, 212, 255, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const sceneIndicator = document.createElement('div');
    sceneIndicator.id = 'scene-indicator';
    sceneIndicator.style.cssText = `
      color: #00d4ff;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
    `;
    sceneIndicator.textContent = `SCENE 1 / ${scenes.length}`;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #00d4ff;
      color: #00d4ff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    closeButton.onmouseover = () => {
      closeButton.style.background = '#00d4ff';
      closeButton.style.color = '#0f1729';
      closeButton.style.transform = 'rotate(90deg)';
    };

    closeButton.onmouseout = () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
      closeButton.style.color = '#00d4ff';
      closeButton.style.transform = 'rotate(0deg)';
    };

    header.appendChild(sceneIndicator);
    header.appendChild(closeButton);

    // Create content area
    const contentArea = document.createElement('div');
    contentArea.id = 'splash-content-area';
    contentArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 40px;
      position: relative;
    `;

    // Create scene container
    const sceneContainer = document.createElement('div');
    sceneContainer.id = 'scene-container';
    sceneContainer.style.cssText = `
      min-height: 100%;
      display: flex;
      flex-direction: column;
    `;

    contentArea.appendChild(sceneContainer);

    // Create footer with navigation
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px 30px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 2px solid rgba(0, 212, 255, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
    `;

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '← Previous';
    prevButton.style.cssText = `
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #00d4ff;
      color: #00d4ff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0.5;
      pointer-events: none;
    `;

    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

    for (let i = 0; i < scenes.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'scene-dot';
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${i === 0 ? '#00d4ff' : 'rgba(255, 255, 255, 0.3)'};
        transition: all 0.3s ease;
        cursor: pointer;
      `;
      dot.onclick = () => goToScene(i);
      dotsContainer.appendChild(dot);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next →';
    nextButton.style.cssText = `
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      border: none;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
    `;

    nextButton.onmouseover = () => {
      nextButton.style.transform = 'scale(1.05)';
      nextButton.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.6)';
    };

    nextButton.onmouseout = () => {
      nextButton.style.transform = 'scale(1)';
      nextButton.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)';
    };

    footer.appendChild(prevButton);
    footer.appendChild(dotsContainer);
    footer.appendChild(nextButton);

    // Assemble splash screen
    existingSplash.innerHTML = '';
    existingSplash.appendChild(header);
    existingSplash.appendChild(contentArea);
    existingSplash.appendChild(footer);

    // Function to render current scene
    const renderScene = () => {
      const scene = scenes[currentScene];
      
      sceneContainer.style.opacity = '0';
      sceneContainer.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        sceneContainer.innerHTML = `
          <div class="scene-icon" style="font-size: 64px; text-align: center; margin-bottom: 20px;">
            ${scene.image}
          </div>
          <h1 style="font-size: 32px; text-align: center; margin-bottom: 10px; background: linear-gradient(135deg, #00d4ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${scene.title}
          </h1>
          <h2 style="font-size: 18px; text-align: center; color: #00d4ff; margin-bottom: 30px; font-weight: 300;">
            ${scene.subtitle}
          </h2>
          ${scene.content}
        `;
        
        sceneContainer.style.transition = 'all 0.4s ease';
        sceneContainer.style.opacity = '1';
        sceneContainer.style.transform = 'translateY(0)';
        
        // Scroll to top
        contentArea.scrollTop = 0;
      }, 150);
      
      // Update scene indicator
      sceneIndicator.textContent = `SCENE ${currentScene + 1} / ${scenes.length}`;
      
      // Update dots
      const dots = dotsContainer.querySelectorAll('.scene-dot');
      dots.forEach((dot, i) => {
        dot.style.background = i === currentScene ? '#00d4ff' : 'rgba(255, 255, 255, 0.3)';
        dot.style.width = i === currentScene ? '12px' : '10px';
        dot.style.height = i === currentScene ? '12px' : '10px';
      });
      
      // Update buttons
      if (currentScene === 0) {
        prevButton.style.opacity = '0.5';
        prevButton.style.pointerEvents = 'none';
      } else {
        prevButton.style.opacity = '1';
        prevButton.style.pointerEvents = 'auto';
        prevButton.onmouseover = () => {
          prevButton.style.background = 'rgba(0, 212, 255, 0.2)';
        };
        prevButton.onmouseout = () => {
          prevButton.style.background = 'rgba(255, 255, 255, 0.1)';
        };
      }
      
      if (currentScene === scenes.length - 1) {
        nextButton.innerHTML = 'Begin Mission 🚀';
        nextButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      } else {
        nextButton.innerHTML = 'Next →';
        nextButton.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
      }
    };

    // Navigation functions
    const goToScene = (index) => {
      if (index >= 0 && index < scenes.length) {
        currentScene = index;
        renderScene();
      }
    };

    const nextScene = () => {
      if (currentScene < scenes.length - 1) {
        currentScene++;
        renderScene();
      } else {
        closeSplash();
      }
    };

    const prevScene = () => {
      if (currentScene > 0) {
        currentScene--;
        renderScene();
      }
    };

    // Close function
    const closeSplash = () => {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      existingSplash.style.animation = 'slideOut 0.3s ease-out';
      
      setTimeout(() => {
        overlay.remove();
        existingSplash.style.display = 'none';
        sessionStorage.setItem('splashShown', 'true');
      }, 300);
    };

    // Event listeners
    closeButton.onclick = closeSplash;
    nextButton.onclick = nextScene;
    prevButton.onclick = prevScene;

    // Keyboard navigation
    const handleKeyboard = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextScene();
      } else if (e.key === 'ArrowLeft') {
        prevScene();
      } else if (e.key === 'Escape') {
        closeSplash();
        document.removeEventListener('keydown', handleKeyboard);
      }
    };
    document.addEventListener('keydown', handleKeyboard);

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translate(-50%, -45%);
        }
        to { 
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes slideOut {
        from { 
          opacity: 1;
          transform: translate(-50%, -50%);
        }
        to { 
          opacity: 0;
          transform: translate(-50%, -55%);
        }
      }
      
      .scene-content {
        line-height: 1.8;
      }
      
      .scene-content p {
        margin-bottom: 20px;
        color: #e0e0e0;
        font-size: 16px;
      }
      
      .scene-content strong {
        color: #ffffff;
        font-weight: 600;
      }
      
      .pages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }
      
      .page-card {
        background: rgba(0, 212, 255, 0.1);
        border: 2px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }
      
      .page-card:hover {
        transform: translateY(-5px);
        border-color: #00d4ff;
        box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
      }
      
      .page-icon {
        font-size: 36px;
        margin-bottom: 10px;
      }
      
      .page-card h4 {
        color: #00d4ff;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .page-card p {
        font-size: 14px;
        margin: 0;
        color: #b0b0b0;
      }
      
      .mission-steps {
        margin: 25px 0;
      }
      
      .step {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
        align-items: start;
      }
      
      .step-number {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #00d4ff, #0099cc);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        color: white;
      }
      
      .step-content h4 {
        color: #00d4ff;
        margin-bottom: 8px;
        font-size: 18px;
      }
      
      .step-content p {
        margin: 0;
        color: #e0e0e0;
        font-size: 15px;
      }
      
      .warning-text {
        text-align: center;
        font-size: 18px;
        color: #fbbf24;
        margin-top: 30px;
        font-weight: bold;
        padding: 15px;
        background: rgba(251, 191, 36, 0.1);
        border-radius: 8px;
        border: 2px solid rgba(251, 191, 36, 0.3);
      }
      
      .controls-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }
      
      .control-item {
        text-align: center;
      }
      
      .key-display {
        background: rgba(0, 212, 255, 0.2);
        border: 3px solid #00d4ff;
        border-radius: 12px;
        padding: 15px 20px;
        font-size: 20px;
        font-weight: bold;
        color: #00d4ff;
        margin-bottom: 10px;
        display: inline-block;
        min-width: 80px;
        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
      }
      
      .control-item p {
        margin: 0;
        color: #e0e0e0;
        font-size: 14px;
      }
      
      .tips-section {
        background: rgba(139, 92, 246, 0.1);
        border: 2px solid rgba(139, 92, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 25px 0;
      }
      
      .tips-section h4 {
        color: #a78bfa;
        margin-bottom: 15px;
        font-size: 18px;
      }
      
      .tips-section ul {
        margin: 0;
        padding-left: 20px;
      }
      
      .tips-section li {
        margin-bottom: 10px;
        color: #e0e0e0;
        font-size: 15px;
      }
      
      .mobile-controls-info {
        background: rgba(59, 130, 246, 0.1);
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 25px 0;
      }
      
      .mobile-controls-info h4 {
        color: #60a5fa;
        margin-bottom: 15px;
        font-size: 18px;
      }
      
      .mobile-controls-info p {
        margin: 0;
        color: #e0e0e0;
        font-size: 15px;
      }
      
      .ready-text {
        text-align: center;
        font-size: 22px;
        color: #00d4ff;
        margin-top: 30px;
        font-weight: bold;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      #splash-content-area::-webkit-scrollbar {
        width: 10px;
      }
      
      #splash-content-area::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      
      #splash-content-area::-webkit-scrollbar-thumb {
        background: #00d4ff;
        border-radius: 10px;
      }
      
      #splash-content-area::-webkit-scrollbar-thumb:hover {
        background: #0099cc;
      }
    `;
    document.head.appendChild(style);

    // Add elements to DOM
    document.body.appendChild(overlay);

    // Render initial scene
    renderScene();
  }

  initialize() {
    // Clear any lingering dialogues from previous page loads
    this.dialogueSystem.closeDialogue();

    // Add global function to reopen splash screen BEFORE anything else (for planetNavigation to use)
    window.reopenSplashScreen = () => {
      // Remove the flag so it shows again
      sessionStorage.removeItem('splashShown');
      this.createSplashScreen();
    };

    // Show splash screen only once per session
    if (!sessionStorage.getItem('splashShown')) {
      this.createSplashScreen();
    }

    // Create badges
    this.createPlanetStatusBadges();
    
    /*
     * All planet navigation logic is now controlled in the planetNavigation.js file
     * The initPlanetNavigation function creates all footer buttons and handles:
     * - Previous/Next planet navigation
     * - Cheat menu modal
     * - Reset progress functionality
     */
    initPlanetNavigation(this);
    
    for (let gameObject of this.gameEnv.gameObjects) {
      const objectId = gameObject.id || gameObject.canvas?.id;
      if (objectId === 'Chill Guy' || objectId === 'chill guy') {
        this.playerObject = gameObject;
        
        // Start saving position periodically
        this.savePositionInterval = setInterval(() => {
          this.savePlayerPosition();
        }, 2000); // Save every 2 seconds
        
        // Also save on any movement
        const originalUpdate = gameObject.update?.bind(gameObject);
        if (originalUpdate) {
          gameObject.update = (...args) => {
            originalUpdate(...args);
            this.savePlayerPosition();
          };
        }
      } else if (objectId === 'Satellite' || objectId === 'satellite') {
        this.satelliteObject = gameObject;
        gameObject.canvas.style.display = 'none';
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && this.satelliteObject) {
        const isVisible = this.satelliteObject.canvas.style.display !== 'none';
        this.satelliteObject.canvas.style.display = isVisible ? 'none' : 'block';
      }
    });
    
    // Save position when the page is unloaded
    window.addEventListener('beforeunload', () => {
      this.savePlayerPosition();
    });
  }
  
  cleanup() {
    // Clear save position interval when cleaning up
    if (this.savePositionInterval) {
      clearInterval(this.savePositionInterval);
      this.savePositionInterval = null;
    }
  }

  update() {
    this.updatePageCounter();
    this.updatePlanetStatusBadges();
    
    const isVisible = this.satelliteObject && this.satelliteObject.canvas.style.display !== 'none';
    if (isVisible && this.playerObject && this.satelliteObject) {
      const targetOffsetX = -60;
      const targetOffsetY = -40;
      const followSpeed = 0.08;

      const playerX = this.playerObject.position.x;
      const playerY = this.playerObject.position.y;

      const targetX = playerX + targetOffsetX;
      const targetY = playerY + targetOffsetY;

      this.satelliteObject.position.x += (targetX - this.satelliteObject.position.x) * followSpeed;
      this.satelliteObject.position.y += (targetY - this.satelliteObject.position.y) * followSpeed;
    }
  }
}

export default GameLevelHomePage;