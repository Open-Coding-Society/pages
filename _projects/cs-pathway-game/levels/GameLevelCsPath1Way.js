// GameLevelCsPath1Way.js

// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import PersonaTrial from './PersonaTrial.js';
import CourseEnlistmentTrial from './CourseEnlistmentTrial.js';
import GameLevelCsPath1CodeHub from './GameLevelCsPath1CodeHub.js';
import SkillPassport from './SkillPassport.js';
import { pythonURI, fetchOptions } from '/assets/js/api/config.js';
import StatusPanel from '/assets/js/GameEnginev1.1/essentials/StatusPanel.js';

/**
 * GameLevel CS Pathway - Wayfinding World
 */
class GameLevelCsPath1Way extends GameLevelCsPathIdentity {
  static levelId = 'wayfinding-world';
  static displayName = 'Wayfinding World';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath1Way.displayName,
      logPrefix: 'Wayfinding World',
    });

    let { width, height, path } = this.getLevelDimensions();
    this.profilePanelView = new StatusPanel({
      id: 'csse-wayfinding-panel',
      title: 'WAYFINDING WORLD',
      fields: [
        { key: 'course', label: 'Course', emptyValue: '—' },
        { key: 'persona', label: 'Persona', emptyValue: '—' },
        { key: 'skill', label: 'Skill', emptyValue: '—' },
      ],
      theme: {
        background: 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
        borderColor: 'var(--ocs-game-accent, #4ecca3)',
        textColor: 'var(--ocs-game-text, #e0e0e0)',
        accentColor: 'var(--ocs-game-accent, #4ecca3)',
        secondaryButtonBackground: 'var(--ocs-game-surface-alt, #1a1a2e)',
        secondaryButtonTextColor: 'var(--ocs-game-text, #e0e0e0)',
      },
      position: { top: '16px', left: '16px' },
      width: '260px',
      padding: '12px 14px',
      zIndex: '10000',
      fontFamily: '"Courier New", monospace',
    });
    this.profilePanelView.render();
    this.profilePanelView.update({
      course: '—',
      persona: '—',
      skill: '—',
    });
    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg1/wayfinding-world-fantasy.png";
    const bg_data = {
      name: GameLevelCsPath1Way.displayName,
      greeting:
        "Welcome to the CSSE pathway! This quest will establish your bearings in the Wayfinding World, where you'll discover your course, uncover your strengths, and enrich your persona!",
      src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg1/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg1/`,
    });

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
      down: { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate: Math.PI / 16 },
      downLeft: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 1, mirror: true },
      right: { row: 1, start: 0, columns: 1 },
      up: { row: 0, start: 1, columns: 1 },
      upLeft: { row: 1, start: 0, columns: 1, mirror: true, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.primeAssetGate({
      playerSrc: player_data.src,
      backgroundSrc: bg_data.src,
    });

    // ── Gatekeepers ────────────────────────────────────────────
    const codeHubGatekeeperPos = {
      x: width * 0.76,
      y: height * 0.26,
    };

    const personalEnrichmentGatekeeperPos = {
      x: width * 0.23,
      y: height * 0.23,
    };

    const skillPassportGatekeeperPos = {
      x: width * 0.77,
      y: height * 0.49,
    };

    const courseEnlistGatekeeperPos = {
      x: width * 0.24,
      y: height * 0.46,
    };

    const createDiscMarkerSrc = (fillColor, borderColor = '#f8fafc') => {
      const frameOpacity = [0.7, 0.78, 0.86, 0.94, 1, 0.94, 0.86, 0.78];
      const discFrames = frameOpacity
        .map((opacity, index) => {
          const cx = 128 + (index * 256);
          const ringAngle = index * 45;
          const angleRad = (ringAngle * Math.PI) / 180;
          const oppositeAngleRad = angleRad + Math.PI;
          const orbitRadius = 112;
          const markerX = cx + (Math.cos(angleRad) * orbitRadius);
          const markerY = 128 + (Math.sin(angleRad) * orbitRadius);
          const marker2X = cx + (Math.cos(oppositeAngleRad) * orbitRadius);
          const marker2Y = 128 + (Math.sin(oppositeAngleRad) * orbitRadius);
          const markerShadowX = cx + (Math.cos(angleRad) * (orbitRadius + 4));
          const markerShadowY = 128 + (Math.sin(angleRad) * (orbitRadius + 4));
          const marker2ShadowX = cx + (Math.cos(oppositeAngleRad) * (orbitRadius + 4));
          const marker2ShadowY = 128 + (Math.sin(oppositeAngleRad) * (orbitRadius + 4));
          return `
        <g opacity='${opacity}'>
          <circle cx='${cx}' cy='128' r='114' fill='none' stroke='rgba(0,0,0,0.5)' stroke-width='20'/>
          <circle cx='${cx}' cy='128' r='106' fill='${fillColor}' stroke='${borderColor}' stroke-width='18'/>
          <circle cx='${cx}' cy='128' r='98' fill='none' stroke='rgba(255,255,255,0.34)' stroke-width='6'/>
          <circle cx='${cx}' cy='128' r='104' fill='url(#shine)' />
          <circle cx='${cx}' cy='128' r='112' fill='none' stroke='rgba(255,255,255,0.92)' stroke-width='11' stroke-linecap='round' stroke-dasharray='190 500' transform='rotate(${ringAngle} ${cx} 128)'/>
          <circle cx='${markerShadowX}' cy='${markerShadowY}' r='12' fill='rgba(0,0,0,0.45)' />
          <circle cx='${markerX}' cy='${markerY}' r='10' fill='#ffffff' />
          <circle cx='${marker2ShadowX}' cy='${marker2ShadowY}' r='10' fill='rgba(0,0,0,0.35)' />
          <circle cx='${marker2X}' cy='${marker2Y}' r='8' fill='#fde047' />
        </g>`;
        })
        .join('');

      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='2048' height='256' viewBox='0 0 2048 256'>
        <defs>
          <radialGradient id='shine' cx='35%' cy='30%' r='70%'>
            <stop offset='0%' stop-color='#ffffff' stop-opacity='0.45' />
            <stop offset='45%' stop-color='#ffffff' stop-opacity='0.14' />
            <stop offset='100%' stop-color='#000000' stop-opacity='0.22' />
          </radialGradient>
        </defs>
        ${discFrames}
      </svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const gatekeeperBaseData = {
      SCALE_FACTOR: 12,
      ANIMATION_RATE: 6,
      pixels: { width: 2048, height: 256 },
      orientation: { rows: 1, columns: 8 },
      down: { row: 0, start: 0, columns: 8, wiggle: { angle: Math.PI / 60, speed: 0.08 } },
      up: { row: 0, start: 0, columns: 8 },
      left: { row: 0, start: 0, columns: 8 },
      right: { row: 0, start: 0, columns: 8 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const createGatekeeperData = ({
      id,
      greeting,
      position,
      markerColor,
      reaction,
      interact,
      interactDistance,
    }) => ({
      ...gatekeeperBaseData,
      src: createDiscMarkerSrc(markerColor),
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      ...(reaction ? { reaction } : {}),
      ...(interact ? { interact } : {}),
    });

    const npc_data_codeHubGatekeeper = createGatekeeperData({
      id: 'CodeHubGatekeeper',
      greeting: 'Welcome to the Code Hub! Choose what you want to explore first!',
      position: codeHubGatekeeperPos,
      interact: function () {
        this.dialogueSystem.dialogues = [
          'Welcome to the Code Hub!',
          'Here you can explore Frontend, Backend, and Data Viz.',
          'Walk up to each terminal and press E to start coding.',
        ];
        this.dialogueSystem.lastShownIndex = -1;
        this.dialogueSystem.showRandomDialogue('Code Hub Gatekeeper');
        this.dialogueSystem.addButtons([
          {
            text: '▶ Enter Code Hub',
            primary: true,
            action: () => {
              this.dialogueSystem.closeDialogue();
              const gc = this.gameEnv.gameControl;
              gc.levelClasses.splice(gc.currentLevelIndex + 1, 0, GameLevelCsPath1CodeHub);
              gc.currentLevelIndex++;
              gc.transitionToLevel();
            },
          },
        ]);
      },
      markerColor: '#22c55e',
    });

    const npc_data_personalEnrichmentGatekeeper = createGatekeeperData({
      id: 'PersonalEnrichmentGatekeeper',
      greeting: 'Welcome to Personal Enrichment! Build habits, curiosity, and real-world growth.',
      position: personalEnrichmentGatekeeperPos,
      markerColor: '#3b82f6',
      interact: () => {
        this.openPersonaTrial();
      },
    });

    const npc_data_skillPassportGatekeeper = createGatekeeperData({
      id: 'SkillPassportGatekeeper',
      greeting: 'Welcome to Skill Passport! Track your progress and collect your coding milestones.',
      position: skillPassportGatekeeperPos,
      markerColor: '#f59e0b',
      interact: () => {
        this.openSkillPassport();
      },
    });

    const npc_data_courseEnlistGatekeeper = createGatekeeperData({
      id: 'CourseEnlistGatekeeper',
      greeting: 'Welcome to Course Enlist! Choose your next class and map your pathway.',
      position: courseEnlistGatekeeperPos,
      markerColor: '#ef4444',
      interact: () => {
        this.openCourseEnlistment();
      },
    });

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      { class: Npc, data: npc_data_codeHubGatekeeper },
      { class: Npc, data: npc_data_personalEnrichmentGatekeeper },
      { class: Npc, data: npc_data_skillPassportGatekeeper },
      { class: Npc, data: npc_data_courseEnlistGatekeeper },
    ];
  }

  // ── Skill Passport ───────────────────────────────────────────
  openSkillPassport() {
    if (this._skillPassportOpen) return;
    this._skillPassportOpen = true;

    const passport = new SkillPassport({
      pythonURI,
      fetchOptions,
      onClose: () => {
        this._skillPassportOpen = false;
      },
    });

    passport.start();
  }

  // ── Persona Trial ────────────────────────────────────────────
  openPersonaTrial() {
    if (this._personaTrialOpen) return;
    this._personaTrialOpen = true;

    const trial = new PersonaTrial({
      onComplete: async (result) => {
        try {
          await this.savePersonaResult(result);

          this.showToast?.(`Persona updated: ${result.title}`);
          this.panel?.(
            `${result.title}\n\n${result.summary}\n\nTechnologist ${result.percentages.technologist}% | Scrummer ${result.percentages.scrummer}% | Planner ${result.percentages.planner}% | Finisher ${result.percentages.finisher}%`
          );
        } catch (error) {
          console.error('Failed to save persona result:', error);
          this.showToast?.('Persona trial completed, but saving failed.');
        } finally {
          this._personaTrialOpen = false;
        }
      },
      onClose: () => {
        this._personaTrialOpen = false;
      },
    });

    trial.start();
  }

  // ── Course Enlistment Trial ──────────────────────────────────
  openCourseEnlistment() {
    if (this._courseEnlistmentOpen) return;
    this._courseEnlistmentOpen = true;

    const trial = new CourseEnlistmentTrial({
      profileData: this.profileData || {},
      onComplete: async (result) => {
        try {
          await this.saveCoursePlanResult(result);

          this.showToast?.(`Path unlocked: ${result.title}`);

          const classesText = Array.isArray(result.recommendedClasses)
            ? result.recommendedClasses.map((item) => item.name).join(' → ')
            : '';

          const planText = Array.isArray(result.gamePlan)
            ? result.gamePlan.map((step, index) => `${index + 1}. ${step.title}`).join('\n')
            : '';

          this.panel?.(
            `${result.title}\n\n${result.summary}\n\nRecommended Classes: ${classesText}\n\nGame Plan:\n${planText}\n\nRedeemed Token: ${result.redeemToken?.label || result.redeemToken?.code || 'Unlocked'}`
          );
        } catch (error) {
          console.error('Failed to save course enlistment result:', error);
          this.showToast?.('Course plan completed, but saving failed.');
        } finally {
          this._courseEnlistmentOpen = false;
        }
      },
      onClose: () => {
        this._courseEnlistmentOpen = false;
      },
    });

    trial.start();
  }

  async savePersonaResult(result) {
    const currentProfile = { ...(this.profileData || {}) };

    const updatedProfile = {
      ...currentProfile,
      personaMeta: {
        primaryPersona: result.primaryPersona,
        title: result.title,
        summary: result.summary,
        growth: result.growth,
        percentages: result.percentages,
        scores: result.scores,
        completedAt: result.completedAt,
      },
    };

    this.profileData = updatedProfile;

    if (typeof this.profileManager?.updateProfileData === 'function') {
      await this.profileManager.updateProfileData(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.saveProfileData === 'function') {
      await this.profileManager.saveProfileData(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.saveProfile === 'function') {
      await this.profileManager.saveProfile(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.setProfileData === 'function') {
      await this.profileManager.setProfileData(updatedProfile);
      return;
    }

    console.warn(
      'No known ProfileManager save method found. Persona result stored in this.profileData only.'
    );
  }

  async saveCoursePlanResult(result) {
    const currentProfile = { ...(this.profileData || {}) };

    const updatedProfile = {
      ...currentProfile,
      coursePlanMeta: {
        title: result.title,
        summary: result.summary,
        primaryPath: result.primaryPath,
        secondaryPath: result.secondaryPath,
        learningStyle: result.learningStyle,
        percentages: result.percentages,
        scores: result.scores,
        recommendedClasses: result.recommendedClasses,
        gamePlan: result.gamePlan,
        redeemToken: result.redeemToken,
        completedAt: result.completedAt,
      },
    };

    this.profileData = updatedProfile;

    if (typeof this.profileManager?.updateProfileData === 'function') {
      await this.profileManager.updateProfileData(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.saveProfileData === 'function') {
      await this.profileManager.saveProfileData(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.saveProfile === 'function') {
      await this.profileManager.saveProfile(updatedProfile);
      return;
    }

    if (typeof this.profileManager?.setProfileData === 'function') {
      await this.profileManager.setProfileData(updatedProfile);
      return;
    }

    console.warn(
      'No known ProfileManager save method found. Course plan result stored in this.profileData only.'
    );
  }
}

export default GameLevelCsPath1Way;