// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiNpcFrq from '/assets/js/GameEnginev1.1/essentials/AiNpc-frq.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

/**
 * GameLevel CS Pathway - CSA FRQ Study
 */
class GameLevelCsPath4Frq extends GameLevelCsPathIdentity {
  static levelId = 'csa-frq';
  static displayName = 'CSA FRQ Study';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath4Frq.displayName,
      logPrefix: 'CSA FRQ Study',
    });
    const level = this;

    let { width, height, path } = this.getLevelDimensions();

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg4/csa-frq-fantasy.png";
    const bg_data = {
      name: GameLevelCsPath4Frq.displayName,
      greeting: "Welcome to the CS pathway! This quest will prepare you for your FRQ by allowing you to practice your skills!",
      src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg4/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg4/`,
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

      const host = document.body;
      if (!host) return;

      if (this._toastEl?.parentNode) {
        this._toastEl.parentNode.removeChild(this._toastEl);
      }
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        z-index: 1200; pointer-events: none;
        background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
        color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
        padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
        box-shadow: 0 0 20px rgba(78,204,163,0.25);
        width: min(360px, 32vw); text-align: left;
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
      const host = document.body;
      if (!host) return;

      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = `
          position: fixed; top: 84px; right: 20px;
          z-index: 1201; pointer-events: none;
          background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
          color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
          padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
          box-shadow: 0 0 20px rgba(78,204,163,0.25);
          width: min(360px, 32vw); text-align: left;
        `;
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }

      this._zoneAlertEl.textContent = message;
    };

    this.clearZoneAlert = function() {
      if (this._zoneAlertEl?.parentNode) {
        this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      }
      this._zoneAlertEl = null;
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

    // FRQ-specific lesson content
    const frqLessonContent = {
      'methods-control': {
        title: 'Methods and Control',
        starterPrompt: 'Write one Java line that starts an if statement checking whether score is greater than 10.',
        systemPrompt: `
You are a CSA FRQ tutor for Methods and Control.
Ask the student for one short line of Java code.
After the student answers:
1. say whether it is correct, partially correct, or incorrect,
2. explain why in 1-2 sentences,
3. give a corrected version if needed,
4. then ask a short follow-up prompt.
Keep responses concise and student-friendly.
`,
        examples: [
          {
            question: 'Write one Java line that starts an if statement checking whether score is greater than 10.',
            answer: 'if (score > 10) {'
          },
          {
            question: 'Write one Java method header for a method named doubleNum returning an int and taking one int parameter x.',
            answer: 'public int doubleNum(int x)'
          }
        ]
      },

      'class-design': {
        title: 'Class Design',
        starterPrompt: 'Write one Java constructor header for a class named Book that takes a String title.',
        systemPrompt: `
You are a CSA FRQ tutor for Class Design.
Ask the student for one short line of Java code related to constructors, fields, or methods in a class.
After the student answers:
1. judge correctness,
2. explain briefly,
3. show a corrected answer if needed,
4. ask one short follow-up.
Keep the conversation focused on AP CSA FRQ style.
`,
        examples: [
          {
            question: 'Write one Java constructor header for a class named Book that takes a String title.',
            answer: 'public Book(String title)'
          },
          {
            question: 'Write one private field declaration for an int named pages.',
            answer: 'private int pages;'
          }
        ]
      },

      'arrays': {
        title: 'Arrays',
        starterPrompt: 'Write one Java line that creates an int array nums of length 5.',
        systemPrompt: `
You are a CSA FRQ tutor for Arrays.
Ask for one short Java line about indexing, traversal, creation, or updating array values.
After the student answers:
1. evaluate it,
2. explain briefly,
3. fix it if needed,
4. ask a new short prompt.
Keep it concise.
`,
        examples: [
          {
            question: 'Write one Java line that creates an int array nums of length 5.',
            answer: 'int[] nums = new int[5];'
          },
          {
            question: 'Write one Java line that sets the first element of nums to 7.',
            answer: 'nums[0] = 7;'
          }
        ]
      },

      '2d-arrays': {
        title: '2D Arrays',
        starterPrompt: 'Write one Java line that gets the value at row 1, column 2 from grid.',
        systemPrompt: `
You are a CSA FRQ tutor for 2D Arrays.
Ask for one short Java line about indexing, nested traversal, or updating entries in a 2D array.
After the student answers:
1. evaluate it,
2. explain briefly,
3. fix it if needed,
4. ask a short follow-up.
Keep it concise and AP CSA aligned.
`,
        examples: [
          {
            question: 'Write one Java line that gets the value at row 1, column 2 from grid.',
            answer: 'grid[1][2]'
          },
          {
            question: 'Write one Java line that sets row 0, column 0 of grid to 9.',
            answer: 'grid[0][0] = 9;'
          }
        ]
      }
    };

    const createHiddenLessonZone = ({ id, label, lessonKey, position, zonePrompt }) => ({
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
          AiNpcFrq.showInteraction(this);
        },
      }),
      visible: false,
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },
      alertDistance: 0.18,

      // New FRQ-specific wiring
      lessonKey,
      expertise: lessonKey,
      lessonData: frqLessonContent[lessonKey],
      chatHistory: [],
      knowledgeBase: frqLessonContent,

      dialogues: [
        `${label} channel online.`,
        frqLessonContent[lessonKey]?.starterPrompt || 'Write one line of Java code.'
      ],

      zoneUnlocked: true,
    });

    const frqLessonZones = [
      createHiddenLessonZone({
        id: 'FrqMethodsControl',
        label: 'Methods and Control',
        lessonKey: 'methods-control',
        position: { x: width * 0.22, y: height * 0.20 },
        zonePrompt: 'Press E to start the lesson.',
      }),
      createHiddenLessonZone({
        id: 'FrqClassDesign',
        label: 'Class Design',
        lessonKey: 'class-design',
        position: { x: width * 0.68, y: height * 0.20 },
        zonePrompt: 'Press E to start the lesson.',
      }),
      createHiddenLessonZone({
        id: 'FrqArrays',
        label: 'Arrays',
        lessonKey: 'arrays',
        position: { x: width * 0.22, y: height * 0.62 },
        zonePrompt: 'Press E to start the lesson.',
      }),
      createHiddenLessonZone({
        id: 'Frq2DArrays',
        label: '2D Arrays',
        lessonKey: '2d-arrays',
        position: { x: width * 0.68, y: height * 0.62 },
        zonePrompt: 'Press E to start the lesson.',
      }),
    ];

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      ...frqLessonZones.map((zone) => ({ class: FriendlyNpc, data: zone })),
    ];

    this._frqZoneIds = frqLessonZones.map((zone) => zone.id);
  }

  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._frqZoneIds?.includes(obj?.spriteData?.id));
    this._rebindMissingDeskReactions(desks);

    console.log('[CSAFRQ] zone reactions rebound:', desks.map((d) => ({
      id: d?.spriteData?.id,
      hasReaction: typeof d?.reaction === 'function',
      hasSpriteReaction: typeof d?.spriteData?.reaction === 'function',
      lessonKey: d?.spriteData?.lessonKey,
    })));

    this._frqZoneObjects = desks;
    this._activeZoneDeskId = null;
  }

  _rebindMissingDeskReactions(desks) {
    // Runtime patch: Npc currently doesn't assign this.reaction from data.
    desks.forEach((desk) => {
      if (typeof desk?.reaction !== 'function' && typeof desk?.spriteData?.reaction === 'function') {
        desk.reaction = desk.spriteData.reaction;
      }
    });
  }

  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  _getDeskAlertDistancePx(desk) {
    const alertMultiplier = desk?._alertDistanceMultiplier ?? desk?.spriteData?.alertDistance ?? 1.25;
    if ((desk?.width || 0) > 0) {
      return desk.width * alertMultiplier;
    }
    return (desk?.interactDistance || 120) * 1.5;
  }

  _findNearestDeskInZone(player, desks) {
    const playerCenter = this._getObjectCenter(player);
    const collisionIds = player?.state?.collisionEvents || [];

    let nearestDesk = null;
    let nearestDistance = Infinity;

    for (const desk of desks) {
      const deskCenter = this._getObjectCenter(desk);
      const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
      const inCollision = collisionIds.includes(desk?.spriteData?.id);
      const inZone = inCollision || distance < this._getDeskAlertDistancePx(desk);

      if (inZone && distance < nearestDistance) {
        nearestDesk = desk;
        nearestDistance = distance;
      }
    }

    return nearestDesk;
  }

  _syncDeskZoneAlert(nearestDesk) {
    if (nearestDesk) {
      const zoneMessage = nearestDesk.spriteData?.zoneMessage || 'Press E to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneDeskId = nearestDesk.spriteData?.id || null;
      return;
    }

    if (this._activeZoneDeskId) {
      this.clearZoneAlert();
      this._activeZoneDeskId = null;
    }
  }

  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._frqZoneObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._frqZoneObjects);
    this._syncDeskZoneAlert(nearestDesk);
  }

  destroy() {
    this.clearZoneAlert();
  }
}

export default GameLevelCsPath4Frq;