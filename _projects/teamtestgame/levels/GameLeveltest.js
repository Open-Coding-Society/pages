import GameEnvBackground from '/assets/js/GameEnginev1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1/essentials/Npc.js';
import Coin from '/assets/js/GameEnginev1.1/Coin.js';

class GameLeveltest {
  constructor(gameEnv) {
    const path = gameEnv.path;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    const backgroundData = {
      name: "custom_bg",
      src: "/images/projects/teamtestgame/space.jpeg",
      pixels: { height: 772, width: 1134 }
    };

    const spriteSrc = '/images/projects/teamtestgame/gamebuilder/sprites/pew.png';
    const alienSpriteSrc = '/images/projects/teamtestgame/gamebuilder/sprites/ufos.png';
    const meteorSpriteSrc = '/images/projects/teamtestgame/gamebuilder/sprites/meteorforgame.jpg';

    const _meteorImg = new Image();
    _meteorImg.src = meteorSpriteSrc;

    const spawnY = (avoidY = null, avoidRadius = 80) => {
      const paddingTop = 80;
      const paddingBottom = 150;
      const usableHeight = height - paddingTop - paddingBottom;
      let y, attempts = 0;
      do {
        y = Math.floor(Math.random() * usableHeight) + paddingTop;
        attempts++;
      } while (avoidY !== null && Math.abs(y - avoidY) < avoidRadius && attempts < 10);
      return y;
    };

    let _survivedMessageShown = false;
    let _survivalInterval = null;
    let _survivalRemaining = 0;
    let _survivalTimeout = null;
    let _respawnInProgress = false;

    const meteorPool = [];
    const POOL_SIZE = 5;

    // ── Timer UI ──────────────────────────────────────────────────────────────
    const ensureTimerUI = () => {
      let el = document.getElementById('meteor-timer');
      if (!el) {
        el = document.createElement('div');
        el.id = 'meteor-timer';
        document.body.appendChild(el);
        Object.assign(el.style, {
          position: 'fixed',
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontFamily: "'Press Start 2P', sans-serif",
          fontSize: '14px',
          border: '2px solid #00FF00',
          borderRadius: '6px',
          zIndex: 100000,
        });
        el.style.top = '160px';  // below the navbar
        el.style.right = '12px'; // flush with right edge of viewport
      }
      return el;
    };

    const removeTimerUI = () => {
      const el = document.getElementById('meteor-timer');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };

    const clearSurvivalTimer = () => {
      if (_survivalInterval) { clearInterval(_survivalInterval); _survivalInterval = null; }
      if (_survivalTimeout)  { clearTimeout(_survivalTimeout);  _survivalTimeout  = null; }
      _survivalRemaining = 0;
      _survivedMessageShown = false;
      removeTimerUI();
      const player = gameEnv.gameObjects.find(obj => obj instanceof Player);
      if (player) {
        player.invulnerable = false;
        if (player.spriteData) player.spriteData.invulnerable = false;
      }
    };

    const resetSurvivalTimer = (seconds = 60) => {
      if (_survivalInterval) { clearInterval(_survivalInterval); _survivalInterval = null; }
      _survivedMessageShown = false;
      _survivalRemaining = seconds;

      const player = gameEnv.gameObjects.find(obj => obj instanceof Player);
      if (player) {
        player.invulnerable = false;
        if (player.spriteData) player.spriteData.invulnerable = false;
      }

      const timerEl = ensureTimerUI();
      timerEl.textContent = `Survive: ${_survivalRemaining}s`;

      _survivalInterval = setInterval(() => {
        _survivalRemaining -= 1;
        if (_survivalRemaining <= 0) {
          clearInterval(_survivalInterval); _survivalInterval = null;
          timerEl.textContent = 'Passed';
          if (player) { player.invulnerable = true; if (player.spriteData) player.spriteData.invulnerable = true; }
          if (!_survivedMessageShown) {
            _survivedMessageShown = true;
            const msg = document.createElement('div');
            Object.assign(msg.style, {
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0,0,0,0.85)', color: '#00FF00',
              padding: '25px', borderRadius: '12px',
              fontFamily: "'Press Start 2P', sans-serif", fontSize: '18px',
              textAlign: 'center', zIndex: '99999',
              border: '3px solid #00FF00', boxShadow: '0 0 20px rgba(0,255,0,0.5)',
              width: '360px'
            });
            msg.innerHTML = `
              <div style="margin-bottom:15px;font-size:22px;">✅ You have done well</div>
              <div style="font-size:16px;">You may pass.</div>`;
            document.body.appendChild(msg);
            // Transition to next level after showing the message
            setTimeout(() => {
              if (msg.parentNode) msg.parentNode.removeChild(msg);
              if (gameEnv?.gameControl?.currentLevel) {
                gameEnv.gameControl.currentLevel.continue = false;
              }
            }, 3000);
          }
          setTimeout(removeTimerUI, 3000);
          return;
        }
        timerEl.textContent = `Survive: ${_survivalRemaining}s`;
      }, 1000);
    };

    // ── Helpers to show/hide meteor canvas ────────────────────────────────────
    const hideMeteor = (m) => {
      if (m.canvas) m.canvas.style.display = 'none';
      m.ignoreCollision = true;
      if (m.spriteData) {
        m.spriteData.meteorActive = false;
        m.spriteData.ignoreCollision = true;
      }
    };

    const showMeteor = (m, x, y) => {
      m.position.x = x;
      m.position.y = y;
      m.collisionDelay = 30;
      m.ignoreCollision = true;
      if (m.spriteData) {
        m.spriteData.meteorActive = true;
        m.spriteData.ignoreCollision = true;
        m.spriteData.direction = -1;
      }
      if (m.canvas) m.canvas.style.display = 'block';
    };

    // ── Meteor update logic ───────────────────────────────────────────────────
    const meteorUpdate = function() {
      if (!this.spriteData?.meteorActive) return;

      if (this.collisionDelay > 0) {
        this.collisionDelay -= 1;
        if (this.collisionDelay === 0) {
          this.ignoreCollision = false;
          if (this.spriteData) this.spriteData.ignoreCollision = false;
        }
      }

      const dir = this.spriteData?.direction ?? -1;
      const spd = this.spriteData?.speed ?? 2;
      const meteorWidth = this.width ?? 0;

      this.position.x += dir * spd;

      if (this.position.x + meteorWidth < 0) {
        this.position.x = this.gameEnv.innerWidth;
        this.position.y = spawnY();
        if (this.spriteData) this.spriteData.direction = -1;
      }
    };

    // ── Reaction ──────────────────────────────────────────────────────────────
    const meteorReaction = () => {
      if (_respawnInProgress) return;
      const player = gameEnv.gameObjects.find(obj => obj instanceof Player);
      if (!player) return;

      _respawnInProgress = true;
      meteorPool.forEach(m => hideMeteor(m));
      clearSurvivalTimer();

      const deathMsg = document.createElement('div');
      Object.assign(deathMsg.style, {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0,0,0,0.8)', color: '#FF0000',
        padding: '25px', borderRadius: '12px',
        fontFamily: "'Press Start 2P', sans-serif", fontSize: '18px',
        textAlign: 'center', zIndex: '99999',
        border: '3px solid #FF0000', boxShadow: '0 0 20px rgba(255,0,0,0.5)',
        width: '340px'
      });
      deathMsg.innerHTML = `
        <div style="margin-bottom:15px;font-size:24px;">☠️ YOU DIED ☠️</div>
        <div style="margin-bottom:10px;">The meteor hit you!</div>
        <div style="font-size:14px;">Respawning in 2 seconds...</div>`;
      document.body.appendChild(deathMsg);

      setTimeout(() => {
        if (deathMsg.parentNode) deathMsg.parentNode.removeChild(deathMsg);
        if (player.position) { player.position.x = _respawnPosition.x; player.position.y = _respawnPosition.y; }
        if (player.velocity) { player.velocity.x = 0; player.velocity.y = 0; }
        if (player.pressedKeys) player.pressedKeys = {};
        _respawnInProgress = false;
      }, 2000);
    };

    // ── Meteor data factory ───────────────────────────────────────────────────
    const makeMeteorData = (index) => ({
      id: `meteor-${index}`,
      name: `meteor-${index}`,
      greeting: 'I am a meteor.',
      src: meteorSpriteSrc,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 1,
      INIT_POSITION: { x: 0, y: 0 },
      orientation: { rows: 1, columns: 1 },
      down:  { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      left:  { row: 0, start: 0, columns: 1 },
      up:    { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      isMeteor: true,
      meteorActive: false,
      ignoreCollision: true,
      collisionDelay: 30,
      speed: 10,
      direction: -2.5,
      dialogues: ['I am a test meteor.'],
      reaction: meteorReaction,
      interact: function() { if (this.dialogueSystem) this.showRandomDialogue(); },
      update: meteorUpdate
    });

    // ── Activate meteors ──────────────────────────────────────────────────────
    const activateMeteors = (count) => {
      const player = gameEnv.gameObjects.find(obj => obj instanceof Player);
      const avoidY = player ? player.position.y : null;
      const avoidRadius = player ? Math.max(player.height, player.width) * 1.5 : 80;

      meteorPool.forEach(m => hideMeteor(m));

      const toActivate = Math.min(count, POOL_SIZE);
      for (let i = 0; i < toActivate; i++) {
        const startX = gameEnv.innerWidth + 200 + i * 120;
        const startY = spawnY(avoidY, avoidRadius);
        showMeteor(meteorPool[i], startX, startY);
      }
    };

    // ── Player ────────────────────────────────────────────────────────────────
    const playerData = {
      id: 'player-test',
      greeting: 'Use WASD to move',
      src: spriteSrc,
      SCALE_FACTOR: 8,
      STEP_FACTOR: 600,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 50, y: height - height / 8 },
      pixels: { height: 320, width: 320 },
      orientation: { rows: 4, columns: 4 },
      down:  { row: 0, start: 0, columns: 3 },
      right: { row: Math.min(1, 3), start: 0, columns: 3 },
      left:  { row: Math.min(2, 3), start: 0, columns: 3 },
      up:    { row: Math.min(3, 3), start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const _respawnPosition = { ...playerData.INIT_POSITION };

    // ── Alien ─────────────────────────────────────────────────────────────────
    const alienData = {
      id: 'alien',
      greeting: 'Talk to me and I will call the meteors.',
      src: alienSpriteSrc,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0.9, y: 0.5 },
      orientation: { rows: 4, columns: 3 },
      down:  { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      left:  { row: 0, start: 0, columns: 1 },
      up:    { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.25, heightPercentage: 0.25 },
      dialogues: ['I can call more meteors if you like.', 'Ready for some falling rocks?'],
      interact: function() {
        if (this.dialogueSystem) this.showRandomDialogue();
        activateMeteors(4); // spawn exactly 4 meteors each time
        resetSurvivalTimer();
      }
    };

    const coinData = {
      id: 'coin-test',
      greeting: false,
      INIT_POSITION: { x: 0.45, y: 0.2 },
      width: 40,
      height: 70,
      color: '#FFD700',
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
      zIndex: 20,
      value: 1
    };

    // ── Classes list ──────────────────────────────────────────────────────────
    const meteorClasses = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      meteorClasses.push({ class: Npc, data: makeMeteorData(i) });
    }

    this.classes = [
      { class: GameEnvBackground, data: backgroundData },
      { class: Player, data: playerData },
      { class: Coin, data: coinData },
      ...meteorClasses,
      { class: Npc, data: alienData }
    ];

    // ── initialize() — called by GameLevel after all objects are created ──────
    this.initialize = () => {
      const found = gameEnv.gameObjects.filter(obj => obj?.spriteData?.isMeteor);
      meteorPool.push(...found);
      meteorPool.forEach(m => hideMeteor(m));
    };
  }
}
//hi
export default GameLeveltest;
