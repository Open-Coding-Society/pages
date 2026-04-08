// Imports: Level objects and UI helpers.
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import StatusPanel from './essentials/StatusPanel.js';
import FormPanel from './essentials/FormPanel.js';
import AvatarPicker from './essentials/AvatarPicker.js';
import DialogueSystem from './essentials/DialogueSystem.js';

// State: Track player progress and choices.
const identityState = {
  startGatekeeperDone: false,
  identityUnlocked: false,
  avatarForgeDone: false,
  identityFlowActive: false,
  avatarFlowActive: false,
};

/**
 * GameLevel CS Pathway - Identity Forge
 */
class GameLevelCssePath {
  static levelId = 'csse-path';
  static displayName = 'Identity Forge';

  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/gamify/pathway/csse/bg/identity-forge-1.png";
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


    /**
     * Section: Journey flow.
     */
    
    // Journey: Start gatekeeper intro.
    const npc_data_startGatekeeper = createGatekeeperData({
      id: 'StartGatekeeper',
      greeting: "Welcome to the Path of Code-Code-Coding...\nThis adventure begins with your identity.\nTravel to the Identity Terminal to define who you are.",
      position: startGatekeeperPos,
      reaction: () => {
        if (identityState.startGatekeeperDone) return;
        identityState.startGatekeeperDone = true;
        void level.showDialogue('Gatekeeper', [
          'Welcome to the Path of Code-Code-Coding...',
          'This adventure begins with your identity.',
          'Travel to the Identity Terminal to define who you are.',
          'Interact with the gatekeeper to obtain guidance.'
        ]);
      },
    });


    // Journey: Identity gatekeeper.
    const npc_data_identityGatekeeper = createGatekeeperData({
      id: 'IdentityGatekeeper',
      greeting: "This terminal is waiting for your identity. Press E to verify it!",
      position: identityGatekeeperPos,
      reaction: function() {
        void level.runIdentityTerminal(!identityState.identityUnlocked);
      },
      interact: async function() {
        await level.runIdentityTerminal(false);
        if (identityState.identityUnlocked) {
          this.spriteData.greeting = `Identity registered for ${level.profileData?.name || 'this player'}. Proceed to the Avatar Forge.`;
        }
      },
    });
    
    // Journey: Identity terminal flow.
    this.runIdentityTerminal = async function(showIntro = false) {
      if (identityState.identityFlowActive) return;
      identityState.identityFlowActive = true;

      try {
        if (identityState.identityUnlocked) {
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

        identityState.identityUnlocked = true;
        await this.showDialogue('Identity Gatekeeper', [
          `Identity registered for ${identityData.name}.`,
          `Email: ${identityData.email}`,
          `GitHub: ${identityData.github}`,
          'Identity Terminal unlocked.'
        ]);

        this.showToast('✦ Identity Terminal unlocked');
      } finally {
        identityState.identityFlowActive = false;
      }
    };

    // Form: Show identity panel.
    this.showIdentityForm = function() {
      return this.identityFormView.show(this.profileData || {}).then((profile) => {
        if (!profile) {
          return null;
        }

        this.profileData = {
          ...this.profileData,
          ...profile,
        };
        this.updateProfilePanel(this.profileData);
        return this.profileData;
      });
    };



    // Journey: Avatar gatekeeper.
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

    // Journey: Avatar forge flow.
    this.runAvatarForge = async function(showIntro = false, npc = null) {
      if (identityState.avatarFlowActive) return;
      identityState.avatarFlowActive = true;

      try {
        if (!identityState.identityUnlocked) {
          await this.showDialogue('Avatar Forge Gatekeeper', [
            'The Avatar Forge is locked.',
            'Complete the Identity Terminal first.'
          ]);
          return;
        }

        if (showIntro) {
          await this.showDialogue('Avatar Forge Gatekeeper', [
            identityState.avatarForgeDone
              ? 'Your forged avatar is ready. Opening the forge again.'
              : 'Welcome to the Avatar Forge.',
            'Choose your sprite and watch yourself transform!'
          ]);
        }

        const avatarChoices = await this.showAvatarCustomForm();
        if (!avatarChoices) return;

        identityState.avatarForgeDone = true;
        const spriteName = avatarChoices.spriteMeta?.name || avatarChoices.sprite || 'Minimalist';

        if (npc?.spriteData) {
          npc.spriteData.greeting = `Your forged avatar is ${spriteName}.`;
        }

        await this.showDialogue('Avatar Forge Gatekeeper', [
          `Your new form: ${spriteName}`,
          'You have been forged in the Avatar Forge!',
          'Your journey continues with your new appearance.'
        ]);
      } finally {
        identityState.avatarFlowActive = false;
      }
    };


    /**
     * Section: UI and dialogue.
     */

    // Dialogue: Sequential helper.
    this.levelDialogueSystem = new DialogueSystem({
      id: 'csse-path-dialogue',
      dialogues: [],
      gameControl: gameEnv.gameControl,
      enableVoice: true,
      enableTypewriter: true,
      typewriterSpeed: 24,
      voiceRate: 0.9,
    });

    // Dialogue: Show lines in sequence.
    this.showDialogue = function(speakerName, lines, options = {}) {
      const queue = Array.isArray(lines) ? lines.filter(Boolean) : [String(lines || '')];
      if (queue.length === 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        let index = 0;
        let finished = false;

        const finish = () => {
          if (finished) {
            return;
          }
          finished = true;
          this.levelDialogueSystem.closeDialogue();
          resolve();
        };

        const showStep = () => {
          if (finished) {
            return;
          }

          const message = queue[index];
          const isLast = index === queue.length - 1;

          this.levelDialogueSystem.closeDialogue();
          this.levelDialogueSystem.showDialogue(
            message,
            speakerName,
            options.avatarSrc || null,
            options.spriteData || null,
          );

          this.levelDialogueSystem.closeBtn.textContent = isLast ? 'Close' : 'Skip';
          this.levelDialogueSystem.closeBtn.onclick = () => finish();

          this.levelDialogueSystem.addButtons([
            {
              text: isLast ? 'Done' : 'Next',
              primary: true,
              action: () => {
                index += 1;
                if (index < queue.length) {
                  showStep();
                } else {
                  finish();
                }
              },
            },
          ]);
        };

        showStep();
      });
    };


    // Toast: Show status message.
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


    // Theme: Shared panel colors.
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




    /**
     * Section: Avatar data.
     */

    // Picker: Avatar config.
    this.avatarPickerView = new AvatarPicker({
      id: 'csse-avatar-picker',
      title: '⚔ Avatar Forge Sprite Selector',
      description: 'Tap any sprite to preview it. Use Done to keep your choice.',
      confirmLabel: 'Done',
      cancelLabel: 'Cancel',
      showCancel: true,
      theme: uiTheme,
    });


    // Data: Load avatar catalog.
    this.getAvatarCatalog = async function() {
      if (this.avatarCatalog) {
        return this.avatarCatalog;
      }

      const fallbackCatalog = [
        {
          name: 'Minimalist',
          src: `${path}/images/gamify/pathway/csse/player/minimalist.png`,
          rows: 2,
          cols: 2,
          scaleFactor: PLAYER_SCALE_FACTOR,
          movementPreset: 'two-row-8way',
          previewText: '2×2 starter sprite',
        },
      ];

      try {
        const response = await fetch(`${path}/images/gamebuilder/sprites/index.json`, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const manifest = await response.json();
        const manifestSprites = Array.isArray(manifest)
          ? manifest.map((entry) => ({
              name: entry.name,
              src: `${path}/images/gamebuilder/sprites/${entry.src}`,
              rows: entry.rows || 1,
              cols: entry.cols || 1,
              scaleFactor: entry.scaleFactor || PLAYER_SCALE_FACTOR,
              movementPreset: entry.movementPreset || (entry.rows >= 4 ? 'four-row-8way' : 'single-row'),
              previewText: `${entry.rows || 1}×${entry.cols || 1} spritesheet`,
            }))
          : [];

        const seen = new Set();
        this.avatarCatalog = [...fallbackCatalog, ...manifestSprites].filter((sprite) => {
          if (!sprite?.src || seen.has(sprite.src)) {
            return false;
          }
          seen.add(sprite.src);
          return true;
        });
      } catch (error) {
        console.warn('Avatar Forge: failed to load sprite catalog', error);
        this.avatarCatalog = fallbackCatalog;
      }

      return this.avatarCatalog;
    };

    // Data: Map avatar movement.
    this.getAvatarMovementConfig = function(spriteMeta = {}) {
      const rows = Math.max(1, Number(spriteMeta.rows || 1));
      const columns = Math.max(1, Number(spriteMeta.cols || 1));
      const preset = spriteMeta.movementPreset || (rows >= 4 ? 'four-row-8way' : 'single-row');

      if (preset === 'two-row-8way') {
        return {
          orientation: { rows, columns },
          down: { row: 0, start: 0, columns: 1 },
          downRight: { row: 0, start: 0, columns: 1, rotate: Math.PI / 16 },
          downLeft: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
          left: { row: Math.min(1, rows - 1), start: 0, columns: 1, mirror: true },
          right: { row: Math.min(1, rows - 1), start: 0, columns: 1 },
          up: { row: 0, start: Math.min(1, columns - 1), columns: 1 },
          upLeft: { row: Math.min(1, rows - 1), start: 0, columns: 1, mirror: true, rotate: Math.PI / 16 },
          upRight: { row: Math.min(1, rows - 1), start: 0, columns: 1, rotate: -Math.PI / 16 },
        };
      }

      if (preset === 'single-row') {
        return {
          orientation: { rows, columns },
          down: { row: 0, start: 0, columns },
          downRight: { row: 0, start: 0, columns, rotate: Math.PI / 16 },
          downLeft: { row: 0, start: 0, columns, rotate: -Math.PI / 16 },
          left: { row: 0, start: 0, columns, mirror: true },
          right: { row: 0, start: 0, columns },
          up: { row: 0, start: 0, columns },
          upLeft: { row: 0, start: 0, columns, mirror: true, rotate: Math.PI / 16 },
          upRight: { row: 0, start: 0, columns, rotate: -Math.PI / 16 },
        };
      }

      return {
        orientation: { rows, columns },
        down: { row: 0, start: 0, columns },
        downRight: { row: Math.min(1, rows - 1), start: 0, columns, rotate: Math.PI / 16 },
        downLeft: { row: Math.min(2, rows - 1), start: 0, columns, rotate: -Math.PI / 16 },
        left: { row: Math.min(2, rows - 1), start: 0, columns },
        right: { row: Math.min(1, rows - 1), start: 0, columns },
        up: { row: Math.min(3, rows - 1), start: 0, columns },
        upLeft: { row: Math.min(2, rows - 1), start: 0, columns, rotate: Math.PI / 16 },
        upRight: { row: Math.min(1, rows - 1), start: 0, columns, rotate: -Math.PI / 16 },
      };
    };


    // Player: Find avatar target.
    this.getPlayerObject = function() {
      return gameEnv.gameObjects.find(obj => (obj.data && obj.data.id === 'Minimalist_Identity') || obj.id === 'Minimalist_Identity');
    };

    // Player: Apply avatar selection.
    this.applyAvatarOptions = function(options = {}) {
      const playerObj = this.getPlayerObject();
      if (!playerObj) {
        console.warn('Avatar Forge: player object not found');
        return;
      }

      const spriteMeta = typeof options.sprite === 'object'
        ? options.sprite
        : options.spriteMeta || {
            name: 'Minimalist',
            src: `${path}/images/gamify/pathway/csse/player/minimalist.png`,
            rows: 2,
            cols: 2,
            scaleFactor: PLAYER_SCALE_FACTOR,
            movementPreset: 'two-row-8way',
          };

      const newSpritePath = spriteMeta.src;
      const movementConfig = this.getAvatarMovementConfig(spriteMeta);
      const scaleFactor = Number(spriteMeta.scaleFactor || PLAYER_SCALE_FACTOR);

      playerObj.data.src = newSpritePath;
      playerObj.data.SCALE_FACTOR = scaleFactor;
      playerObj.scaleFactor = scaleFactor;

      Object.assign(playerObj.spriteData, movementConfig, {
        src: newSpritePath,
        SCALE_FACTOR: scaleFactor,
      });

      playerObj.spriteSheet = new Image();
      playerObj.spriteReady = false;

      playerObj.spriteSheet.onload = () => {
        playerObj.spriteReady = true;
        try {
          playerObj.spriteData.pixels = {
            width: playerObj.spriteSheet.naturalWidth,
            height: playerObj.spriteSheet.naturalHeight,
          };
          playerObj.resize();
        } catch (err) {
          console.warn('Error updating sprite dimensions', err);
        }
      };

      playerObj.spriteSheet.onerror = (e) => {
        console.warn('Failed to load sprite:', newSpritePath, e);
      };

      playerObj.spriteSheet.src = newSpritePath;

      this.profileData = {
        ...this.profileData,
        sprite: spriteMeta.name || 'Minimalist',
        spriteSrc: newSpritePath,
        spriteMeta,
      };

      this.updateProfilePanel(this.profileData);
    };

    // Picker: Show avatar form.
    this.showAvatarCustomForm = async function() {
      const sprites = await this.getAvatarCatalog();
      const originalSprite = this.profileData?.spriteMeta || sprites[0];

      const selectedSprite = await this.avatarPickerView.show({
        sprites,
        initialSelection: this.profileData?.spriteSrc || originalSprite?.src,
        onPreview: (sprite) => {
          this.applyAvatarOptions({ sprite });
        },
      });

      if (!selectedSprite) {
        if (originalSprite) {
          this.applyAvatarOptions({ sprite: originalSprite });
        }
        return null;
      }

      return {
        sprite: selectedSprite.name,
        spriteMeta: selectedSprite,
      };
    };

    /**
     * Section: UI config.
     */

    // Panel: Profile config.
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
    this.profilePanelView = new StatusPanel(profilePanelConfig);

    // Form: Identity config.
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
    this.identityFormView = new FormPanel(identityFormConfig);


    // Panel: Update profile display.
    this.updateProfilePanel = function(profile = {}) {
      this.createProfilePanel();
      this.profilePanelView.update({
        name: profile.name || '—',
        email: profile.email || '—',
        github: profile.github || '—',
        sprite: profile.sprite || '—',
      });
    };

    // Panel: Mount profile view.
    this.createProfilePanel = function() {
      if (!this.profilePanelView) {
        return null;
      }
      this.profilePanel = this.profilePanelView.ensureMounted();
      return this.profilePanel;
    };
    this.createProfilePanel(); // safe at the end to ensure it runs after dependencies set

    /**
     * Section: Level objects and classes.
     */

    // Objects: Build level class list.
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