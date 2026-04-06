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
  avatarForgeDone: false,
};

class GameLevelCssePath {
  static levelId = 'csse-path';
  static displayName = 'Identity Forge';

  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // ── Background ──────────────────────────────────────────────
    const bg_data = {
        name: GameLevelCssePath.displayName,
        greeting: "Welcome to the CSSE pathway!  This quest will identify your profile and personna!",
        src: image_src,
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
      x: width * 0.48,
      y: height * 0.74,
    };

    const avatarGatekeeperPos = {
      x: width * 0.50,
      y: height * 0.23,
    };

    const npc_data_startGatekeeper = {
      id: 'StartGatekeeper',
      greeting: "Welcome to the Path of Code...\nThis adventure begins with your identity.\nTravel to the Identity Terminal to define who you are.",
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
      greeting: "This terminal is waiting for your identity. Please wait for the pop-up to verify your identity!",
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

    const npc_data_avatarGatekeeper = {
      id: 'AvatarGatekeeper',
      greeting: "Welcome to the Avatar Forge...\nChoose your look and watch your character update live!",
      src: path + "/images/gamify/pathway/csse/npc/gatekeeper2.png",
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      INIT_POSITION: { x: avatarGatekeeperPos.x, y: avatarGatekeeperPos.y },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up:   { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    this.createProfilePanel = function() {
      this.profilePanel = document.createElement('div');
      this.profilePanel.style.cssText = `
        position: fixed; top: 16px; left: 16px; z-index: 10000;
        background: rgba(13,13,26,0.92); border: 1px solid #4ecca3;
        border-radius: 10px; padding: 12px 14px;
        width: 260px; font-family: 'Courier New', monospace;
        color: #e0e0e0; box-shadow: 0 0 20px rgba(78,204,163,0.18);
      `;
      this.profilePanel.innerHTML = `
        <div style="color: #4ecca3; font-size: 12px; letter-spacing: 1px; margin-bottom: 8px;">PLAYER PROFILE</div>
        <div id="profile-name">Name: —</div>
        <div id="profile-email">Email: —</div>
        <div id="profile-github">GitHub: —</div>
        <div style="margin-top: 8px; color: #4ecca3; font-size: 11px; letter-spacing: 1px;">Avatar Sprite</div>
        <div id="profile-sprite">Sprite: —</div>
      `;
      document.body.appendChild(this.profilePanel);
    };

    this.updateProfilePanel = function(profile = {}) {
      if (!this.profilePanel) {
        this.createProfilePanel();
      }
      const name = profile.name || '—';
      const email = profile.email || '—';
      const github = profile.github || '—';
      const sprite = profile.sprite || '—';
      this.profilePanel.querySelector('#profile-name').textContent = `Name: ${name}`;
      this.profilePanel.querySelector('#profile-email').textContent = `Email: ${email}`;
      this.profilePanel.querySelector('#profile-github').textContent = `GitHub: ${github}`;
      this.profilePanel.querySelector('#profile-sprite').textContent = `Sprite: ${sprite}`;
    };

    this.createProfilePanel();

    this.getPlayerObject = function() {
      return gameEnv.gameObjects.find(obj => (obj.data && obj.data.id === 'Minimalist_Identity') || obj.id === 'Minimalist_Identity');
    };

    this.applyAvatarOptions = function(options = {}) {
      const playerObj = this.getPlayerObject();
      if (!playerObj) {
        console.warn('Avatar Forge: player object not found');
        return;
      }

      const chosenSprite = options.sprite || 'minimalist.png';
      const newSpritePath = path + "/images/gamify/pathway/csse/player/" + chosenSprite;
      
      // Update the sprite source
      playerObj.data.src = newSpritePath;
      
      // Create a new Image and load the sprite
      playerObj.spriteSheet = new Image();
      playerObj.spriteReady = false;
      
      playerObj.spriteSheet.onload = () => {
        playerObj.spriteReady = true;
        // Update canvas dimensions if needed
        try {
          if (!playerObj.spriteData.pixels || playerObj.spriteData.pixels.width === undefined) {
            playerObj.spriteData.pixels = { 
              width: playerObj.spriteSheet.naturalWidth, 
              height: playerObj.spriteSheet.naturalHeight 
            };
          }
          if (!playerObj.spriteData.orientation) {
            playerObj.spriteData.orientation = { rows: 1, columns: 1 };
          }
          playerObj.resize();
        } catch (err) {
          console.warn('Error updating sprite dimensions', err);
        }
      };
      
      playerObj.spriteSheet.onerror = (e) => {
        console.warn('Failed to load sprite:', newSpritePath, e);
      };
      
      playerObj.spriteSheet.src = newSpritePath;

      this.updateProfilePanel({
        name: this.profileData?.name,
        email: this.profileData?.email,
        github: this.profileData?.github,
        sprite: chosenSprite,
      });
    };

    this.showAvatarCustomForm = function() {
      return new Promise((resolve) => {
        const spriteOptions = [
          'minimalist.png',
          'ufo.png',
          'zombieNpc.png',
          'worker.png',
          'wizard.png',
          'villager.png',
          'tree.png',
          'stockguy.png',
          'spookMcWalk.png',
          'shark.png',
          'schwabbman.png',
          'r2_idle.png',
          'pilot.png',
          'octopus.png',
          'octocat.png',
          'npc1.png',
          'npc2.png',
          'npc3.png',
          'npc4.png',
          'npc5.png'
        ];

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 94%; max-width: 700px; max-height: 90vh; z-index: 10001;
          background: #0d0d1a; border: 2px solid #4ecca3;
          border-radius: 12px; padding: 24px 28px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 0 30px rgba(78,204,163,0.25);
          color: #e0e0e0;
          overflow-y: auto;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
          color: #4ecca3; font-size: 16px; font-weight: bold;
          text-transform: uppercase; margin-bottom: 14px;
          text-align: center; position: sticky; top: 0; background: #0d0d1a; z-index: 1;
        `;
        title.textContent = '⚔ Avatar Forge Sprite Selector';

        const description = document.createElement('div');
        description.style.cssText = `
          color: #c7f2d4; font-size: 13px; margin-bottom: 18px; line-height: 1.6;
          white-space: pre-wrap; position: sticky; top: 35px; background: #0d0d1a; z-index: 1;
        `;
        description.textContent = 'Click any sprite to preview and select it.';

        const spriteGrid = document.createElement('div');
        spriteGrid.style.cssText = `
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); 
          gap: 12px; margin-bottom: 18px;
        `;

        let selectedSprite = 'minimalist.png';

        spriteOptions.forEach(sprite => {
          const spriteContainer = document.createElement('div');
          spriteContainer.style.cssText = `
            background: #1a1a2e; border: 2px solid #4ecca3;
            border-radius: 6px; padding: 8px; text-align: center;
            cursor: pointer; transition: all 0.2s;
            opacity: 0.7;
          `;

          const spriteImg = document.createElement('img');
          spriteImg.src = path + "/images/gamify/pathway/csse/player/" + sprite;
          spriteImg.style.cssText = `
            max-width: 80px; max-height: 80px; 
            image-rendering: pixelated; margin-bottom: 4px;
          `;

          const spriteLabel = document.createElement('div');
          spriteLabel.textContent = sprite.replace('.png', '');
          spriteLabel.style.cssText = `
            font-size: 10px; color: #4ecca3; word-break: break-word;
          `;

          spriteContainer.appendChild(spriteImg);
          spriteContainer.appendChild(spriteLabel);

          spriteContainer.addEventListener('mouseenter', () => {
            spriteContainer.style.cssText = `
              background: #1a1a2e; border: 2px solid #4ecca3;
              border-radius: 6px; padding: 8px; text-align: center;
              cursor: pointer; transition: all 0.2s;
              opacity: 1; box-shadow: 0 0 15px rgba(78,204,163,0.5);
              transform: scale(1.05);
            `;
          });

          spriteContainer.addEventListener('mouseleave', () => {
            const isSelected = selectedSprite === sprite;
            spriteContainer.style.cssText = `
              background: ${isSelected ? '#2a2a4a' : '#1a1a2e'}; border: 2px solid ${isSelected ? '#7effff' : '#4ecca3'};
              border-radius: 6px; padding: 8px; text-align: center;
              cursor: pointer; transition: all 0.2s;
              opacity: ${isSelected ? 1 : 0.7};
            `;
          });

          spriteContainer.addEventListener('click', () => {
            selectedSprite = sprite;
            
            // Update all sprites to show selection state
            Array.from(spriteGrid.children).forEach(child => {
              const childSprite = child.querySelector('div:last-child').textContent + '.png';
              if (childSprite === sprite) {
                child.style.cssText = `
                  background: #2a2a4a; border: 2px solid #7effff;
                  border-radius: 6px; padding: 8px; text-align: center;
                  cursor: pointer; transition: all 0.2s;
                  opacity: 1; box-shadow: 0 0 20px rgba(126,255,255,0.6);
                `;
              } else {
                child.style.cssText = `
                  background: #1a1a2e; border: 2px solid #4ecca3;
                  border-radius: 6px; padding: 8px; text-align: center;
                  cursor: pointer; transition: all 0.2s;
                  opacity: 0.7;
                `;
              }
            });

            // Apply sprite change in real-time
            this.applyAvatarOptions({ sprite });
          });

          spriteGrid.appendChild(spriteContainer);

          // Highlight first sprite as default
          if (sprite === 'minimalist.png') {
            spriteContainer.style.cssText = `
              background: #2a2a4a; border: 2px solid #7effff;
              border-radius: 6px; padding: 8px; text-align: center;
              cursor: pointer; transition: all 0.2s;
              opacity: 1; box-shadow: 0 0 20px rgba(126,255,255,0.6);
            `;
          }
        });

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = 'Done';
        closeBtn.style.cssText = `
          background: #4ecca3; color: #0d0d1a; border: none; border-radius: 4px;
          padding: 12px 24px; font-family: 'Courier New', monospace; font-weight: bold;
          cursor: pointer; margin-top: 10px; width: 100%;
          transition: all 0.2s;
        `;

        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.background = '#7effff';
        });

        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.background = '#4ecca3';
        });

        overlay.appendChild(title);
        overlay.appendChild(description);
        overlay.appendChild(spriteGrid);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        // Apply default sprite
        this.applyAvatarOptions({ sprite: 'minimalist.png' });

        closeBtn.addEventListener('click', () => {
          overlay.remove();
          resolve({
            sprite: selectedSprite,
          });
        });
      });
    };

    this.showIdentityForm = function() {
      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 90%; max-width: 520px; z-index: 10000;
          background: #0d0d1a; border: 2px solid #4ecca3;
          border-radius: 10px; padding: 24px 28px;
          font-family: 'Courier New', monospace;
          box-shadow: 0 0 30px rgba(78,204,163,0.25);
          color: #e0e0e0;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
          color: #4ecca3; font-size: 16px; font-weight: bold;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;
          text-align: center;
        `;
        title.textContent = '⚔ Identity Terminal Setup';

        const message = document.createElement('div');
        message.style.cssText = `
          color: #c7f2d4; font-size: 12px; line-height: 1.6;
          margin-bottom: 16px; white-space: pre-wrap;
        `;
        message.textContent = "Make sure you're logged in.\nIf not, navigate to https://pages.opencodingsociety.com/login to create an account!";

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

        const githubLabel = document.createElement('label');
        githubLabel.textContent = 'GitHub Username:';
        githubLabel.style.cssText = `color: #4ecca3; font-size: 12px;`;
        const githubInput = document.createElement('input');
        githubInput.type = 'text';
        githubInput.required = true;
        githubInput.style.cssText = `
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
        form.appendChild(githubLabel);
        form.appendChild(githubInput);
        form.appendChild(submitBtn);

        overlay.appendChild(title);
        overlay.appendChild(message);
        overlay.appendChild(form);
        document.body.appendChild(overlay);

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = nameInput.value.trim();
          const email = emailInput.value.trim();
          const github = githubInput.value.trim();
          if (name && email && github) {
            overlay.remove();
            const profile = { name, email, github };
            this.profileData = profile;
            this.updateProfilePanel(profile);
            resolve(profile);
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
      const distToAvatarGatekeeper = Math.hypot(
        playerX - avatarGatekeeperPos.x,
        playerY - avatarGatekeeperPos.y
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
        const identityData = await this.showIdentityForm();
        if (identityData) {
          csseState.identityUnlocked = true;

          await this.showDialogue('Identity Gatekeeper', [
              `Identity registered for ${identityData.name}.`,
              `GitHub: ${identityData.github}`,
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

      // ── Avatar Forge gatekeeper interaction ───────────────────
      if (distToAvatarGatekeeper < triggerDist && !csseState.avatarForgeDone) {
        csseState.interactCooldown = 180;
        await this.showDialogue('Avatar Forge Gatekeeper', [
            'Welcome to the Avatar Forge. Choose your sprite and watch yourself transform live!' 
        ]);

        const avatarChoices = await this.showAvatarCustomForm();
        if (avatarChoices) {
          csseState.avatarForgeDone = true;
          const spriteName = avatarChoices.sprite.replace('.png', '');
          await this.showDialogue('Avatar Forge Gatekeeper', [
              `Your new form: ${spriteName}`,
              'You have been forged in the Avatar Forge!',
              'Your journey continues with your new appearance.'
          ]);
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
      { class: Npc,              data: npc_data_avatarGatekeeper },
    ];
  }
}

export default GameLevelCssePath;