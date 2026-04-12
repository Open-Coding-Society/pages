// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiNpc from '/assets/js/GameEnginev1.1/essentials/AiNpc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

/**
 * GameLevel CS Pathway - Mission Tools
 */
class GameLevelCsPath2Mission extends GameLevelCsPathIdentity {
  static levelId = 'mission-tools';
  static displayName = 'Mission Tools';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath2Mission.displayName,
      logPrefix: 'Mission Tools',
    });
    const level = this;

    let { width, height, path } = this.getLevelDimensions();

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg2/mission-tools-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath2Mission.displayName,
        greeting: "Welcome to the CS pathway! This quest will prepare you for your mission ahead by introducing your essential tools and resources!",
        src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg2/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg2/`,
    });

    // FriendlyNpc looks up toast via gameEnv.currentLevel/gameLevel in this engine build.
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;
    
    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CS pathway!",
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

    this.primeAssetGate({
      playerSrc: player_data.src,
      backgroundSrc: bg_data.src,
    });

    // Toast helper for zone prompts.
    this.showToast = function(message) {
      if (message === 'Press E to interact') {
        return;
      }

      const host = this.gameEnv?.container || this.gameEnv?.gameContainer || document.body;
      if (!host) return;

      const hostPosition = window.getComputedStyle(host).position;
      if (hostPosition === 'static') {
        host.style.position = 'relative';
      }

      if (this._toastEl?.parentNode) {
        this._toastEl.parentNode.removeChild(this._toastEl);
      }
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%);
        z-index: 1200; pointer-events: none;
        background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
        color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
        padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
        box-shadow: 0 0 20px rgba(78,204,163,0.25);
        max-width: min(92%, 760px); text-align: center;
      `;
      toast.textContent = message;
      host.appendChild(toast);

      this._toastEl = toast;
      this._toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (this._toastEl === toast) this._toastEl = null;
        this._toastTimer = null;
      }, 2200);
    };

    this.setZoneAlert = function(message) {
      const host = this.gameEnv?.container || this.gameEnv?.gameContainer || document.body;
      if (!host) return;

      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = `
          position: fixed; left: 12px; top: 50%; transform: translateY(-50%);
          z-index: 1201; pointer-events: none;
          background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
          color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
          padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
          box-shadow: 0 0 20px rgba(78,204,163,0.25);
          width: min(320px, 28vw); text-align: left;
        `;
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }

      this._zoneAlertEl.textContent = message;

      const hostRect = host.getBoundingClientRect();
      const desiredLeft = hostRect.left - this._zoneAlertEl.offsetWidth - 16;
      const clampedLeft = Math.max(12, desiredLeft);
      const desiredTop = hostRect.top + (hostRect.height * 0.5);
      this._zoneAlertEl.style.left = `${clampedLeft}px`;
      this._zoneAlertEl.style.top = `${desiredTop}px`;
    };

    this.clearZoneAlert = function() {
      if (this._zoneAlertEl?.parentNode) {
        this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      }
      this._zoneAlertEl = null;
    };

    // ── Gatekeepers ────────────────────────────────────────────
    const codeHubGatekeeperPos = {
      x: width * 0.73,
      y: height * 0.26,
    };

    const personalEnrichmentGatekeeperPos = {
      x: width * 0.20,
      y: height * 0.23,
    };

    const skillPassportGatekeeperPos = {
      x: width * 0.74,
      y: height * 0.49  ,
    };

    const courseEnlistGatekeeperPos = {
      x: width * 0.20,
      y: height * 0.46,
    };

    const gatekeeperBaseData = {
      src: path + '/images/projects/cs-pathway-game/npc/gatekeeper2.png',
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

    const createGatekeeperData = ({ id, greeting, position, reaction, interact, interactDistance }) => ({
      ...gatekeeperBaseData,
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      reaction: function () {
        if (reaction) reaction.call(this);
        if (level?.showToast) {
          level.showToast('Press E to interact');
        }
      },
      ...(interact ? { interact } : {}),
    });

    const deskAiKnowledgeBase = {
      'debug-assistant': [
        { question: 'How do I isolate a bug quickly?', answer: 'Reproduce, narrow the scope, inspect state changes, then retest.' },
      ],
      'design-assistant': [
        { question: 'How can I improve the user flow?', answer: 'Remove friction points and make the next action obvious.' },
      ],
      'data-assistant': [
        { question: 'How should I store this data?', answer: 'Pick structures based on retrieval and update patterns.' },
      ],
      'planning-assistant': [
        { question: 'How do I break down a feature?', answer: 'Split into milestones with clear outcomes and tests.' },
      ],
    };

    const createHiddenMissionDesk = ({ id, label, expertise, position, zonePrompt }) => ({
      zoneMessage: `${label}: ${zonePrompt}`,
      ...createGatekeeperData({
        id,
        greeting: `${label} ready. ${zonePrompt}`,
        position,
        interactDistance: 90,
        reaction: function () {
          if (level?.showToast) {
            level.showToast(`${label}: ${zonePrompt}`);
          }
        },
        interact: function () {
          AiNpc.showInteraction(this);
        },
      }),
      visible: true,
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },
      alertDistance: 0.18,
      dialogues: [
        `${label} channel online.`,
        'Ask your mission question and I will guide you.',
      ],
      expertise,
      chatHistory: [],
      knowledgeBase: deskAiKnowledgeBase,
      zoneUnlocked: true,
    });

    const missionDeskZones = [
      createHiddenMissionDesk({
        id: 'MissionDeskAiAdmin',
        label: 'The Admin',
        expertise: 'how to work different operating systems',
        position: { x: width * 0.20, y: height * 0.25 },
        zonePrompt: 'Collision zone active. Press E to interact.',
      }),
      createHiddenMissionDesk({
        id: 'MissionDeskAiArchivist',
        label: 'The Archivist',
        expertise: 'how to manage files and folders',
        position: { x: width * 0.65, y: height * 0.25 },
        zonePrompt: 'Collision zone active. Press E to interact.',
      }),
      createHiddenMissionDesk({
        id: 'MissionDeskAiSDLC',
        label: 'The SDLC Master',
        expertise: 'what SDLC is',
        position: { x: width * 0.20, y: height * 0.75 },
        zonePrompt: 'Collision zone active. Press E to interact.',
      }),
      createHiddenMissionDesk({
        id: 'MissionDeskAiScrum',
        label: 'The Scrum Master',
        expertise: 'how to set up a scrum board',
        position: { x: width * 0.65, y: height * 0.75 },
        zonePrompt: 'Collision zone active. Press E to interact.',
      }),
    ];

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      ...missionDeskZones.map((zone) => ({ class: FriendlyNpc, data: zone })),
    ];

    this._missionDeskIds = missionDeskZones.map((zone) => zone.id);
  }

  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._missionDeskIds?.includes(obj?.spriteData?.id));

    // Runtime patch: Npc currently doesn't assign this.reaction from data.
    desks.forEach((desk) => {
      if (typeof desk?.reaction !== 'function' && typeof desk?.spriteData?.reaction === 'function') {
        desk.reaction = desk.spriteData.reaction;
      }
    });

    console.log('[MissionTools] desk reactions rebound:', desks.map((d) => ({
      id: d?.spriteData?.id,
      hasReaction: typeof d?.reaction === 'function',
      hasSpriteReaction: typeof d?.spriteData?.reaction === 'function',
    })));

    this._missionDeskObjects = desks;
    this._activeZoneDeskId = null;
  }

  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const playerCenterX = (player.position?.x || 0) + (player.width || 0) / 2;
    const playerCenterY = (player.position?.y || 0) + (player.height || 0) / 2;

    let nearestDesk = null;
    let nearestDistance = Infinity;
    const collisionIds = player?.state?.collisionEvents || [];

    for (const desk of this._missionDeskObjects) {
      const deskCenterX = (desk.position?.x || 0) + (desk.width || 0) / 2;
      const deskCenterY = (desk.position?.y || 0) + (desk.height || 0) / 2;
      const distance = Math.hypot(playerCenterX - deskCenterX, playerCenterY - deskCenterY);

      const alertMultiplier = desk._alertDistanceMultiplier ?? desk.spriteData?.alertDistance ?? 1.25;
      const baseAlertDistancePx = (desk.width > 0)
        ? desk.width * alertMultiplier
        : (desk.interactDistance || 120) * 1.5;
      const alertDistancePx = baseAlertDistancePx;
      const inCollision = collisionIds.includes(desk.spriteData?.id);
      const inZone = inCollision || distance < alertDistancePx;

      if (inZone && distance < nearestDistance) {
        nearestDesk = desk;
        nearestDistance = distance;
      }
    }

    if (nearestDesk) {
      const zoneMessage = nearestDesk.spriteData?.zoneMessage || 'Press E to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneDeskId = nearestDesk.spriteData?.id || null;
    } else if (this._activeZoneDeskId) {
      this.clearZoneAlert();
      this._activeZoneDeskId = null;
    }
  }

  destroy() {
    this.clearZoneAlert();
  }

}

export default GameLevelCsPath2Mission;