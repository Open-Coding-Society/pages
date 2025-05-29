export default class WaypointArrow {
  constructor(gameCanvas, gamePath) {
    this.gameCanvas = gameCanvas;
    this.gamePath = gamePath;
    // Start at J.P. Morgan and follow the correct order as seen in GameLevelAirport.js
    this.waypointIds = [
      'Stock- NPC',        // J.P. Morgan
      'Casino-NPC',        // Frank Sinatra
      'Fidelity',          // Fidelity
      'Schwab',            // Schwab
      'Crypto-NPC',        // Satoshi Nakamoto
      'Bank-NPC',          // Janet Yellen
      'Market Computer'    // Computer
    ];
    // Start at the first step (J.P. Morgan)
    this.currentStep = this.loadStep();
    if (this.currentStep < 0 || this.currentStep >= this.waypointIds.length) {
      this.currentStep = 0;
    }
    this.arrowImg = this.createArrowElement();
    this.setupEventListeners();
    this.moveArrowToCurrentWaypoint();
  }

  loadStep() {
    const savedStep = this.getCookie('waypointStep');
    return savedStep !== null ? parseInt(savedStep) : 0;
  }

  setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  createArrowElement() {
    let arrowImg = document.createElement('img');
    arrowImg.src = this.gamePath + "/images/gamify/redarrow1.png";
    arrowImg.id = 'waypointArrow';
    arrowImg.style.position = 'absolute';
    arrowImg.style.zIndex = 2000;
    arrowImg.style.width = '48px';
    arrowImg.style.height = '48px';
    arrowImg.style.pointerEvents = 'none';
    arrowImg.style.transition = 'top 0.3s, left 0.3s';
    document.body.appendChild(arrowImg);
    return arrowImg;
  }

  getWaypointPosition(npcId) {
    // Use the same positions as INIT_POSITION in GameLevelAirport.js, with a slight upward offset for accuracy
    const width = this.gameCanvas ? this.gameCanvas.width : window.innerWidth;
    const height = this.gameCanvas ? this.gameCanvas.height : window.innerHeight;

    // These offsets (dx, dy) move the arrow just above the NPC's head
    const offsets = {
      'Stock- NPC':        { dx: 0, dy: -60 },   // J.P. Morgan
      'Casino-NPC':        { dx: 0, dy: -60 },   // Frank Sinatra
      'Fidelity':          { dx: 0, dy: 20},   // Lowered from -70 to -40
      'Schwab':            { dx: 0, dy: 20 },   // Lowered from -70 to -40
      'Crypto-NPC':        { dx: 0, dy: -60 },   // Satoshi Nakamoto
      'Bank-NPC':          { dx: 0, dy: -60 },   // Janet Yellen
      'Market Computer':   { dx: 0, dy: -60 }
    };

    const positions = {
      'Stock- NPC':        { x: width * 0.17, y: height * 0.8 },
      'Casino-NPC':        { x: width * 0.15, y: height * 0.25 },
      'Fidelity':          { x: width * 0.34, y: height * 0.05 },
      'Schwab':            { x: width * 0.48, y: height * 0.05 },
      'Crypto-NPC':        { x: width * 0.69, y: height * 0.24 },
      'Bank-NPC':          { x: width * 0.7, y: height * 0.75 },
      'Market Computer':   { x: width * 0.9, y: height * 0.65 }
    };

    const pos = positions[npcId] || { x: width / 2, y: height / 2 };
    const offset = offsets[npcId] || { dx: 0, dy: -60 };
    return { x: pos.x + offset.dx, y: pos.y + offset.dy };
  }

  moveArrowToCurrentWaypoint() {
    const npcId = this.waypointIds[this.currentStep] || this.waypointIds[0];
    const pos = this.getWaypointPosition(npcId);
    this.arrowImg.style.left = (pos.x - 24) + 'px';
    this.arrowImg.style.top = (pos.y - 24) + 'px';
  }

  advanceStep() {
    if (this.currentStep < this.waypointIds.length - 1) {
      this.currentStep++;
      this.setCookie('waypointStep', this.currentStep, 30);
      this.moveArrowToCurrentWaypoint();
    }
  }

  resetStep() {
    this.currentStep = 0;
    this.setCookie('waypointStep', 0, 30);
    this.moveArrowToCurrentWaypoint();
  }

  setupEventListeners() {
    // Right-click to reset
    this.arrowImg.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.resetStep();
    });

    // Resize handler
    window.addEventListener('resize', () => this.moveArrowToCurrentWaypoint());

    // 'E' key handler
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() !== 'e') return;
      
      try {
        const npcId = this.waypointIds[this.currentStep] || this.waypointIds[0];
        const pos = this.getWaypointPosition(npcId);
        
        let playerObj = null;
        if (window.gameEnv && window.gameEnv.gameObjects) {
          playerObj = window.gameEnv.gameObjects.find(obj => 
            obj.constructor && obj.constructor.name === 'Player'
          );
        }
        
        if (!playerObj) {
          const playerCanvas = document.querySelector('canvas[id*="player" i]');
          if (playerCanvas && playerCanvas.getBoundingClientRect) {
            const rect = playerCanvas.getBoundingClientRect();
            playerObj = {
              position: { x: rect.left + rect.width/2, y: rect.top + rect.height/2 }
            };
          }
        }

        if (playerObj && playerObj.position) {
          const px = playerObj.position.x;
          const py = playerObj.position.y;
          const dx = px - pos.x;
          const dy = py - pos.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 80) {
            this.advanceStep();
          }
        } else {
          this.advanceStep();
        }
      } catch (err) {
        this.advanceStep();
      }
    });
  }
}