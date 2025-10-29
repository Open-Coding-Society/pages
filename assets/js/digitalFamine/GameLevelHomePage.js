// To build GameLevels, each contains GameObjects from below imports
import GameEnvBackground from '/assets/js/adventureGame/GameEngine/GameEnvBackground.js';
import Player from '/assets/js/adventureGame/GameEngine/Player.js';
import Npc from '/assets/js/adventureGame/GameEngine/Npc.js';
import GameControl from '/assets/js/adventureGame/GameEngine/GameControl.js';
import DialogueSystem from '/assets/js/adventureGame/DialogueSystem.js';

class GameLevelHomePage {
  constructor(gameEnv) {
    // Store gameEnv reference for use in methods
    this.gameEnv = gameEnv;
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Initialize dialogue system FIRST before it's used anywhere
    this.dialogueSystem = new DialogueSystem();

    // Helper function for locked planet effect
    this.applyLockedEffect = (ctx, sprite) => {
      if (sprite.isLocked) {
        ctx.globalAlpha = 0.5;
        ctx.filter = 'grayscale(100%)';
      } else {
        ctx.globalAlpha = 1;
        ctx.filter = 'none';
      }
    };

    // Game progression state with enforced order
    this.progression = {
      microblog: false,
      medialit: false,
      ai: false,
      cyber: false,
      current: 'microblog',  // Start with microblog planet
      // Helper function to get the next planet in sequence
      getNextPlanet: function() {
        if (!this.microblog) return 'microblog';
        if (!this.medialit) return 'medialit';
        if (!this.ai) return 'ai';
        if (!this.cyber) return 'cyber';
        return 'end';
      }
    };
    
    // REMOVED: The line that was clearing progress
    // localStorage.removeItem('planetProgression');
    
    // Debug helper
    this.debugProgress = () => {
      console.log('Current Progress:', {
        microblog: this.progression.microblog,
        medialit: this.progression.medialit,
        ai: this.progression.ai,
        cyber: this.progression.cyber,
        current: this.progression.current
      });
    };
    
    // Load progression from localStorage if available
    const savedProgress = localStorage.getItem('planetProgression');
    if (savedProgress) {
      const loaded = JSON.parse(savedProgress);
      // Ensure proper progression state
      this.progression = {
        ...this.progression,
        microblog: loaded.microblog || false,
        medialit: loaded.medialit && loaded.microblog ? loaded.medialit : false,
        ai: loaded.ai && loaded.medialit ? loaded.ai : false,
        cyber: loaded.cyber && loaded.ai ? loaded.cyber : false,
        current: loaded.current || this.progression.getNextPlanet()
      };
      console.log('Loaded saved progress:', this.progression);
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      const planetOrder = ['microblog', 'medialit', 'ai', 'cyber', 'end'];
      const currentIndex = planetOrder.indexOf(this.progression.current);

      // 'B' key for previous planet
      if (e.key.toLowerCase() === 'b') {
        if (currentIndex > 0) {
          const prevPlanet = planetOrder[currentIndex - 1];
          this.progression.current = prevPlanet;
          localStorage.setItem('planetProgression', JSON.stringify(this.progression));
          console.log('Navigating to previous planet:', prevPlanet);
          this.debugProgress();
          location.reload();
        }
      }
      
      // 'N' key for next planet
      if (e.key.toLowerCase() === 'n') {
        if (currentIndex < planetOrder.length - 1) {
          const nextPlanet = planetOrder[currentIndex + 1];
          if (this.progression[this.progression.current]) {
            this.progression.current = nextPlanet;
            localStorage.setItem('planetProgression', JSON.stringify(this.progression));
            console.log('Navigating to next planet:', nextPlanet);
            this.debugProgress();
            location.reload();
          } else {
            console.log('Complete current planet first!');
            this.dialogueSystem.showDialogue("Complete the current planet first!");
          }
        }
      }
      
      // 'R' key to reset progress (for debugging/testing)
      if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        localStorage.removeItem('planetProgression');
        console.log('Progress reset! Reloading...');
        location.reload();
      }
    });
    
    // Keep track of active key listener
    this.activeKeyListener = null;
    
    // Function to remove any existing key listener
    this.removeExistingKeyListener = () => {
      if (this.activeKeyListener) {
        document.removeEventListener('keydown', this.activeKeyListener);
        this.activeKeyListener = null;
      }
    };
    
    // Watch for dialogue close and clean up listener
    const originalCloseDialogue = this.dialogueSystem.closeDialogue.bind(this.dialogueSystem);
    this.dialogueSystem.closeDialogue = () => {
      this.removeExistingKeyListener();
      originalCloseDialogue();
    };
    
    // Background data
    const image_src_desert = path + "/images/digital-famine/galaxy.jpg";
    const image_data_desert = {
      name: 'galaxy',
      greeting: "Welcome to the Galaxy!  This will be the start of your adventure in saving the Earth",
      src: image_src_desert,
      pixels: { height: 580, width: 1038 }
    };

    // Player data for Chillguy
    const sprite_src_chillguy = path + "/images/digital-famine/Rocket.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
        id: 'Chill Guy',
        greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
        src: sprite_src_chillguy,
        SCALE_FACTOR: 9,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 10,
        INIT_POSITION: { x: 0, y: height - (height/CHILLGUY_SCALE_FACTOR) }, 
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

    // Satellite companion data
    const sprite_src_satellite = path + "/images/digital-famine/Satellite.png";
    const sprite_data_satellite = {
        id: 'Satellite',
        greeting: "",
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

    // Ancient Book sprite data
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

    // Store a reference to the dialogueSystem for use in sprite data
    const dialogueSystem = this.dialogueSystem;

    // Cyber Planet
    const sprite_src_cyberplanet = path + "/images/digital-famine/planet-3.png";
    const sprite_data_cyberplanet = {
        id: 'CyberPlanet',
        greeting: "Cyber Planet - Final Destination",
        src: sprite_src_cyberplanet,
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.15), y: (height * 0.15) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.ai;
          this.applyLockedEffect(ctx, this);
        }.bind(this),
        dialogues: ["Would you like to travel to the Cyber Planet?"],
        reaction: function() { },
        interact: function() {
          this.removeExistingKeyListener();
          this.debugProgress();
          
          if (!this.progression.ai) {
            dialogueSystem.showDialogue("Complete AI Planet first!");
            console.log('Attempted to access Cyber without completing AI');
            return;
          }

          dialogueSystem.showDialogue("Do you want to travel to Cybersecurity Planet?");
          dialogueSystem.addButtons([
            {
              text: "Travel",
              action: () => {
                // Mark as completed but DON'T change current
                this.progression.cyber = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                console.log('Traveling to Cyber Planet...');
                this.debugProgress();
                window.location.href = '/digital-famine/cyber/';
              },
              primary: true
            }
          ]);
        }.bind(this)
    };

    // Media Lit Planet
    const sprite_src_medialit = path + "/images/digital-famine/planet-1.png";
    const sprite_data_medialit = {
        id: 'MediaLitPlanet',
        greeting: "Media Literacy Planet - Essential Knowledge",
        src: sprite_src_medialit,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.25), y: (height * 0.75) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.microblog;
          this.applyLockedEffect(ctx, this);
        }.bind(this),
        dialogues: ["Would you like to travel to the Media Literacy Planet?"],
        reaction: function() { },
        interact: function() {
          this.removeExistingKeyListener();
          this.debugProgress();
          
          if (!this.progression.microblog) {
            dialogueSystem.showDialogue("Complete Microblogging Planet first!");
            return;
          }

          dialogueSystem.showDialogue("Do you want to travel to Media Literacy Planet?");
          dialogueSystem.addButtons([
            {
              text: "Travel",
              action: () => {
                this.progression.medialit = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                console.log('Traveling to Media Literacy Planet...');
                this.debugProgress();
                window.location.href = '/digital-famine/media/';
              },
              primary: true
            }
          ]);
        }.bind(this)
    };

    // AI Planet
    const sprite_src_ai = path + "/images/digital-famine/planet-2.png";
    const sprite_data_ai = {
        id: 'AIPlanet',
        greeting: "AI Planet - Future Technology",
        src: sprite_src_ai,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.55), y: (height * 0.25) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !this.progression.medialit;
          this.applyLockedEffect(ctx, this);
        }.bind(this),
        dialogues: ["Would you like to travel to the AI Planet?"],
        reaction: function() { },
        interact: function() {
          this.removeExistingKeyListener();
          this.debugProgress();
          
          if (!this.progression.medialit) {
            dialogueSystem.showDialogue("Complete Media Literacy Planet first!");
            console.log('Attempted to access AI without completing Media Lit');
            return;
          }

          dialogueSystem.showDialogue("Do you want to travel to AI Planet?");
          dialogueSystem.addButtons([
            {
              text: "Travel",
              action: () => {
                this.progression.ai = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                console.log('Traveling to AI Planet...');
                this.debugProgress();
                window.location.href = '/digital-famine/ai/';
              },
              primary: true
            }
          ]);
        }.bind(this)
    };

    // Microblogging Planet
    const sprite_src_microblog = path + "/images/digital-famine/planet-4.png";
    const sprite_data_microblog = {
        id: 'MicroblogPlanet',
        greeting: "Microblogging Planet - First Stop!",
        src: sprite_src_microblog,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.55), y: (height * 0.75) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = false; // First planet is never locked
          this.applyLockedEffect(ctx, this);
        }.bind(this),
        dialogues: ["Would you like to travel to the Microblogging Planet?"],
        reaction: function() { },
        interact: function() {
          this.removeExistingKeyListener();
          this.debugProgress();

          dialogueSystem.showDialogue("Do you want to travel to Microblogging Planet?");
          dialogueSystem.addButtons([
            {
              text: "Travel",
              action: () => {
                this.progression.microblog = true;
                localStorage.setItem('planetProgression', JSON.stringify(this.progression));
                console.log('Traveling to Microblog Planet...');
                this.debugProgress();
                window.location.href = '/digital-famine/microblog/';
              },
              primary: true
            }
          ]);
        }.bind(this)
    };

    // Home Planet (Earth)
    const sprite_src_home = path + "/images/digital-famine/home-planet.png";
    const sprite_data_home = {
        id: 'HomePlanet',
        greeting: "Return to Home Planet (Earth)",
        src: sprite_src_home,
        SCALE_FACTOR: 4,
        ANIMATION_RATE: 1,
        pixels: {height: 512, width: 512},
        INIT_POSITION: { x: (width * 0.82), y: (height * 0.5) },
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        zIndex: 10,
        render: function(ctx) {
          this.isLocked = !(this.progression.microblog && 
                           this.progression.medialit && 
                           this.progression.ai && 
                           this.progression.cyber);
          this.applyLockedEffect(ctx, this);
        }.bind(this),
        dialogues: ["Return to Home Planet"],
        reaction: function() { },
        interact: function() {
          this.removeExistingKeyListener();
          
          if (!this.progression.cyber) {
            dialogueSystem.showDialogue("Complete all planets first!");
            return;
          }
          
          dialogueSystem.showDialogue("Do you want to return to Earth?");
          dialogueSystem.addButtons([
            {
              text: "Travel",
              action: () => window.location.href = '/digital-famine/end/',
              primary: true
            }
          ]);
        }.bind(this)
    };

    // Objects on this level
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
    
    this.createPageCounter();
  }
  
  createPageCounter() {
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
    document.getElementById('gameContainer').appendChild(counterDiv);
    
    this.pageCounter = counterDiv;
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

  initialize() {
    console.log('Initializing GameLevelHomePage...');
    console.log('Number of game objects:', this.gameEnv.gameObjects.length);
    
    for (let gameObject of this.gameEnv.gameObjects) {
      const objectId = gameObject.id || gameObject.canvas?.id;
      if (objectId === 'Chill Guy' || objectId === 'chill guy') {
        this.playerObject = gameObject;
        console.log('Player found:', gameObject);
      } else if (objectId === 'Satellite' || objectId === 'satellite') {
        this.satelliteObject = gameObject;
        console.log('Satellite found!', gameObject);
        gameObject.canvas.style.display = 'none';
        console.log('Satellite hidden. Press T to toggle visibility.');
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && this.satelliteObject) {
        const isVisible = this.satelliteObject.canvas.style.display !== 'none';
        this.satelliteObject.canvas.style.display = isVisible ? 'none' : 'block';
        console.log('Satellite toggled:', !isVisible ? 'visible' : 'hidden');
      }
    });
  }

  update() {
    this.updatePageCounter();
    
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