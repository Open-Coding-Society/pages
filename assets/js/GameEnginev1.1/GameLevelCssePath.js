// To build GameLevels, each contains GameObjects from below imports
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import StatusPanel from './essentials/StatusPanel.js';
import FormPanel from './essentials/FormPanel.js';


const csseState = {
  startGatekeeperDone: false,
  identityUnlocked: false,
  avatarForgeDone: false,
  identityFlowActive: false,
  avatarFlowActive: false,
};

class GameLevelCssePath {
  static levelId = 'csse-path';
  static displayName = 'Identity Forge';

  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/gamify/pathway/csse/bg/indentity-forge-1.png";
    const bg_data = {
        name: GameLevelCssePath.displayName,
        greeting: "Welcome to the CSSE pathway!  This quest will identify your profile and personna!",
        src: image_src,
    };

    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/gamify/pathway/csse/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CSSE pathway!",
      src: player_src,
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

        const speakLine = (line) => {
          if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
            return;
          }

          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(line).replace(/\n/g, ' '));
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const preferredVoice =
            voices.find(voice => voice.lang.includes('en-AU') && voice.name.toLowerCase().includes('male')) ||
            voices.find(voice => voice.lang.includes('en-AU')) ||
            voices.find(voice => voice.name.toLowerCase().includes('male')) ||
            voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          window.speechSynthesis.speak(utterance);
        };

        overlay.appendChild(speaker);
        overlay.appendChild(textEl);
        overlay.appendChild(hint);
        document.body.appendChild(overlay);

        let index = 0;

        const showLine = () => {
          textEl.textContent = lines[index];
          speakLine(lines[index]);
          if (index === lines.length - 1) {
            hint.textContent = 'Click to close.';
          }
        };

        const advance = () => {
          index++;
          if (index < lines.length) {
            showLine();
          } else {
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            overlay.remove();
            resolve();
          }
        };

        overlay.addEventListener('click', advance);
        showLine();
      });
    };

    // ── Gatekeepers ────────────────────────────────────────────
    const level = this;

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

    const gatekeeperBaseData = {
      src: path + "/images/gamify/pathway/csse/npc/gatekeeper2.png",
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up: { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const createGatekeeperData = ({ id, greeting, position, reaction, interact }) => ({
      ...gatekeeperBaseData,
      id,
      greeting,
      INIT_POSITION: { ...position },
      ...(reaction ? { reaction } : {}),
      ...(interact ? { interact } : {}),
    });

    const uiTheme = {
      background: 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
      borderColor: 'var(--ocs-game-accent, #4ecca3)',
      textColor: 'var(--ocs-game-text, #e0e0e0)',
      secondaryTextColor: 'var(--ocs-game-muted, #c7f2d4)',
      accentColor: 'var(--ocs-game-accent, #4ecca3)',
      inputBackground: 'var(--ocs-game-surface-alt, #1a1a2e)',
      buttonBackground: 'var(--ocs-game-accent, #4ecca3)',
      buttonTextColor: 'var(--ocs-game-surface-contrast, #0d0d1a)',
      secondaryButtonBackground: 'var(--ocs-game-surface-alt, #1a1a2e)',
      secondaryButtonTextColor: 'var(--ocs-game-text, #e0e0e0)',
      overlayBackground: 'var(--ocs-game-overlay, rgba(13,13,26,0.72))',
      boxShadow: '0 0 20px rgba(78,204,163,0.18)',
    };

    const profilePanelConfig = {
      id: 'csse-profile-panel',
      title: 'PLAYER PROFILE',
      fields: [
        { key: 'name', label: 'Name', emptyValue: '—' },
        { key: 'email', label: 'Email', emptyValue: '—' },
        { key: 'github', label: 'GitHub', emptyValue: '—' },
        { type: 'section', title: 'Avatar Sprite', marginTop: '8px' },
        { key: 'sprite', label: 'Sprite', emptyValue: '—' },
      ],
      theme: uiTheme,
    };

    const identityFormConfig = {
      id: 'csse-identity-terminal',
      title: '⚔ Identity Terminal Setup',
      description: "Make sure you're logged in.\nIf not, navigate to https://pages.opencodingsociety.com/login to create an account!",
      submitLabel: 'Unlock Identity Terminal',
      showCancel: true,
      cancelLabel: 'Cancel',
      fields: [
        { name: 'name', label: 'Name:', type: 'text', required: true, autocomplete: 'name' },
        { name: 'email', label: 'Email:', type: 'email', required: true, autocomplete: 'email' },
        { name: 'github', label: 'GitHub Username:', type: 'text', required: true, autocomplete: 'username' },
      ],
      theme: uiTheme,
    };

    this.profilePanelView = new StatusPanel(profilePanelConfig);
    this.identityFormView = new FormPanel(identityFormConfig);

    this.showToast = function(message) {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        background: #0d0d1a; border: 2px solid #4ecca3;
        color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
        padding: 12px 20px; border-radius: 6px; letter-spacing: 1px;
        box-shadow: 0 0 20px rgba(78,204,163,0.3);
      `;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    };

    this.runIdentityTerminal = async function(showIntro = false) {
      if (csseState.identityFlowActive) return;
      csseState.identityFlowActive = true;

      try {
        if (csseState.identityUnlocked) {
          await this.showDialogue('Identity Gatekeeper', [
            this.profileData?.name
              ? `Identity already registered for ${this.profileData.name}.`
              : 'Identity already registered.',
            this.profileData?.github
              ? `GitHub: ${this.profileData.github}`
              : 'Your profile is saved.'
          ]);
          return;
        }

        if (showIntro) {
          await this.showDialogue('Identity Gatekeeper', [
            'This terminal is waiting for your identity.',
            'Opening the Identity Terminal now.'
          ]);
        }

        const identityData = await this.showIdentityForm();
        if (!identityData) return;

        csseState.identityUnlocked = true;
        await this.showDialogue('Identity Gatekeeper', [
          `Identity registered for ${identityData.name}.`,
          `GitHub: ${identityData.github}`,
          'Identity Terminal unlocked.',
          'Complete the identity setup before you move on.'
        ]);

        this.showToast('✦ Identity Terminal unlocked');
      } finally {
        csseState.identityFlowActive = false;
      }
    };

    this.runAvatarForge = async function(showIntro = false, npc = null) {
      if (csseState.avatarFlowActive) return;
      csseState.avatarFlowActive = true;

      try {
        if (!csseState.identityUnlocked) {
          await this.showDialogue('Avatar Forge Gatekeeper', [
            'The Avatar Forge is locked.',
            'Complete the Identity Terminal first.'
          ]);
          return;
        }

        if (showIntro) {
          await this.showDialogue('Avatar Forge Gatekeeper', [
            csseState.avatarForgeDone
              ? 'Your forged avatar is ready. Opening the forge again.'
              : 'Welcome to the Avatar Forge.',
            'Choose your sprite and watch yourself transform live!'
          ]);
        }

        const avatarChoices = await this.showAvatarCustomForm();
        if (!avatarChoices) return;

        csseState.avatarForgeDone = true;
        const spriteName = avatarChoices.sprite.replace('.png', '');

        if (npc?.spriteData) {
          npc.spriteData.greeting = `Your forged avatar is ${spriteName}.`;
        }

        await this.showDialogue('Avatar Forge Gatekeeper', [
          `Your new form: ${spriteName}`,
          'You have been forged in the Avatar Forge!',
          'Your journey continues with your new appearance.'
        ]);
      } finally {
        csseState.avatarFlowActive = false;
      }
    };

    const npc_data_startGatekeeper = createGatekeeperData({
      id: 'StartGatekeeper',
      greeting: "Welcome to the Path of Code...\nThis adventure begins with your identity.\nTravel to the Identity Terminal to define who you are.",
      position: startGatekeeperPos,
      reaction: () => {
        if (csseState.startGatekeeperDone) return;
        csseState.startGatekeeperDone = true;
        void level.showDialogue('Gatekeeper', [
          'Welcome to the Path of Code...',
          'This adventure begins with your identity.',
          'Travel to the Identity Terminal to define who you are.',
          'Then press E at each station to interact.'
        ]);
      },
    });

    const npc_data_identityGatekeeper = createGatekeeperData({
      id: 'IdentityGatekeeper',
      greeting: "This terminal is waiting for your identity. Press E to verify it!",
      position: identityGatekeeperPos,
      reaction: function() {
        void level.runIdentityTerminal(!csseState.identityUnlocked);
      },
      interact: async function() {
        await level.runIdentityTerminal(false);
        if (csseState.identityUnlocked) {
          this.spriteData.greeting = `Identity registered for ${level.profileData?.name || 'this player'}. Proceed to the Avatar Forge.`;
        }
      },
    });

    const npc_data_avatarGatekeeper = createGatekeeperData({
      id: 'AvatarGatekeeper',
      greeting: "Welcome to the Avatar Forge...\nChoose your look and watch your character update live!",
      position: avatarGatekeeperPos,
      reaction: function() {
        void level.runAvatarForge(true, this);
      },
      interact: async function() {
        await level.runAvatarForge(false, this);
      },
    });

    this.createProfilePanel = function() {
      this.profilePanel = this.profilePanelView.ensureMounted();
      return this.profilePanel;
    };

    this.updateProfilePanel = function(profile = {}) {
      this.createProfilePanel();
      this.profilePanelView.update({
        name: profile.name || '—',
        email: profile.email || '—',
        github: profile.github || '—',
        sprite: profile.sprite || '—',
      });
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
      return this.identityFormView.show(this.profileData || {}).then((profile) => {
        if (!profile) {
          return null;
        }

        this.profileData = profile;
        this.updateProfilePanel(profile);
        return profile;
      });
    };


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