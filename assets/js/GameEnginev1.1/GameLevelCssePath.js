// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import GameControl from './essentials/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';


const csseState = {
  interactCooldown: 0,
  startGatekeeperDone: false,
  identityUnlocked: false,
};

class GameLevelCssePath {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // ── Background ──────────────────────────────────────────────
    const bg_data = {
      name: 'Identity Forge',
      greeting: "Welcome to the CSSE pathway!",
      src: path + "/images/gamify/pathway/csse/bg/indentity-forge-1.png",
    };

    // ── Player ───────────────────────────────────────────────────
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CSSE pathway!",
      src: path + "/images/gamify/pathway/csse/player/minimalist.png",
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    // ── Dialogue overlay helper ──────────────────────────────────
    // Shows lines one at a time; resolves when player clicks through all of them.
    this.showDialogue = function(speakerName, lines) {
      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
          width: 90%; max-width: 700px; z-index: 9999;
          background: #0d0d1a; border: 2px solid #4ecca3;
          border-radius: 10px; padding: 24px 28px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 0 30px rgba(78,204,163,0.25);
          color: #e0e0e0;
        `;

        const speaker = document.createElement('div');
        speaker.style.cssText = `
          color: #4ecca3; font-size: 12px; font-weight: bold;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;
        `;
        speaker.textContent = `⚔ ${speakerName}`;

        const textEl = document.createElement('div');
        textEl.style.cssText = `font-size: 15px; line-height: 1.8; min-height: 48px;`;

        const hint = document.createElement('div');
        hint.style.cssText = `
          margin-top: 16px; text-align: right;
          color: #4ecca3; font-size: 11px; letter-spacing: 1px;
        `;
        hint.textContent = 'Click anywhere to continue...';

        overlay.appendChild(speaker);
        overlay.appendChild(textEl);
        overlay.appendChild(hint);
        document.body.appendChild(overlay);

        let index = 0;

        const showLine = () => {
          textEl.textContent = lines[index];
          // Update hint on last line
          if (index === lines.length - 1) {
            hint.textContent = 'Click to close.';
          }
        };

        const advance = () => {
          index++;
          if (index < lines.length) {
            showLine();
          } else {
            overlay.remove();
            resolve();
          }
        };

        overlay.addEventListener('click', advance);
        showLine();
      });
    };

    // ── Gatekeepers ────────────────────────────────────────────
    const startGatekeeperPos = {
      x: width * 0.14,
      y: height * 0.78,
    };

    const identityGatekeeperPos = {
      x: width * 0.60,
      y: height * 0.72,
    };

    const npc_data_startGatekeeper = {
      id: 'StartGatekeeper',
      greeting: "Welcome to the Path of Code...",
      src: path + "/images/gamify/pathway/csse/npc/gatekeeper2.png",
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      INIT_POSITION: { x: startGatekeeperPos.x, y: startGatekeeperPos.y },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up:   { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const npc_data_identityGatekeeper = {
      id: 'IdentityGatekeeper',
      greeting: "This terminal is waiting for your identity...",
      src: path + "/images/gamify/pathway/csse/npc/gatekeeper2.png",
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      INIT_POSITION: { x: identityGatekeeperPos.x, y: identityGatekeeperPos.y },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up:   { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    this.showIdentityForm = function() {
      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 90%; max-width: 500px; z-index: 10000;
          background: #0d0d1a; border: 2px solid #4ecca3;
          border-radius: 10px; padding: 24px 28px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 0 30px rgba(78,204,163,0.25);
          color: #e0e0e0;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
          color: #4ecca3; font-size: 14px; font-weight: bold;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;
          text-align: center;
        `;
        title.textContent = '⚔ Identity Terminal Setup';

        const form = document.createElement('form');
        form.style.cssText = `display: flex; flex-direction: column; gap: 12px;`;

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameLabel.style.cssText = `color: #4ecca3; font-size: 12px;`;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.required = true;
        nameInput.style.cssText = `
          background: #1a1a2e; border: 1px solid #4ecca3; border-radius: 4px;
          padding: 8px; color: #e0e0e0; font-family: 'Courier New', monospace;
        `;

        const emailLabel = document.createElement('label');
        emailLabel.textContent = 'Email:';
        emailLabel.style.cssText = `color: #4ecca3; font-size: 12px;`;
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.required = true;
        emailInput.style.cssText = `
          background: #1a1a2e; border: 1px solid #4ecca3; border-radius: 4px;
          padding: 8px; color: #e0e0e0; font-family: 'Courier New', monospace;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Unlock Identity Terminal';
        submitBtn.style.cssText = `
          background: #4ecca3; color: #0d0d1a; border: none; border-radius: 4px;
          padding: 10px; font-family: 'Courier New', monospace; font-weight: bold;
          cursor: pointer; margin-top: 8px;
        `;

        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(submitBtn);

        overlay.appendChild(title);
        overlay.appendChild(form);
        document.body.appendChild(overlay);

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = nameInput.value.trim();
          const email = emailInput.value.trim();
          if (name && email) {
            overlay.remove();
            resolve({ name, email });
          }
        });
      });
    };


    // ── Collision loop ───────────────────────────────────────────
    const checkCollisions = async () => {
      if (csseState.interactCooldown > 0) {
        csseState.interactCooldown--;
        return;
      }

      // Find the player element by its id (matches player_data.id)
      const playerEl = document.getElementById('Minimalist_Identity')
                    || document.querySelector('[id$="_id"]'); // fallback

      if (!playerEl) return;

      const playerX = parseFloat(playerEl.style.left || 0) + 50;
      const playerY = parseFloat(playerEl.style.top  || 0) + 50;

      const distToStartGatekeeper = Math.hypot(
        playerX - startGatekeeperPos.x,
        playerY - startGatekeeperPos.y
      );
      const distToIdentityGatekeeper = Math.hypot(
        playerX - identityGatekeeperPos.x,
        playerY - identityGatekeeperPos.y
      );

      const triggerDist = width * 0.12;

      // ── Start gatekeeper interaction ─────────────────────────
      if (distToStartGatekeeper < triggerDist && !csseState.startGatekeeperDone) {
        csseState.interactCooldown = 180;
        await this.showDialogue('Gatekeeper', [
            "Welcome to the Path of Code...\nThis adventure begins with your identity.\nTravel to the Identity Terminal to define who you are."
        ]);
        csseState.startGatekeeperDone = true;
      }

      // ── Identity terminal gatekeeper interaction ──────────────
      if (distToIdentityGatekeeper < triggerDist && !csseState.identityUnlocked) {
        csseState.interactCooldown = 180;
        await this.showDialogue('Identity Gatekeeper', [
            "This terminal is the key to your persona.\nPlease provide your identity to unlock access."
        ]);

        const identityData = await this.showIdentityForm();
        if (identityData) {
          csseState.identityUnlocked = true;

          await this.showDialogue('Identity Gatekeeper', [
              `Identity registered for ${identityData.name}.`,
              'Identity Terminal unlocked.',
              'Complete the identity setup before you can move on to the next module.'
          ]);

          const toast = document.createElement('div');
          toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            background: #0d0d1a; border: 2px solid #4ecca3;
            color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
            padding: 12px 20px; border-radius: 6px; letter-spacing: 1px;
            box-shadow: 0 0 20px rgba(78,204,163,0.3);
          `;
          toast.textContent = '✦ Identity Terminal unlocked';
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3000);
        }
      }
    };

    // Start the collision interval
    setInterval(() => checkCollisions.call(this), 200);

    // ── Class list ───────────────────────────────────────────────
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player,           data: player_data },
      { class: Npc,              data: npc_data_startGatekeeper },
      { class: Npc,              data: npc_data_identityGatekeeper },
    ];
  }
}

export default GameLevelCssePath;