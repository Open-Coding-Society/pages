// Level objects and UI helpers.
import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import StatusPanel from '@assets/js/GameEnginev1.1/essentials/StatusPanel.js';
import FormPanel from '@assets/js/GameEnginev1.1/essentials/FormPanel.js';
import Picker from '@assets/js/GameEnginev1.1/essentials/Picker.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import FriendlyNpc from '@assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import ProfileManager from '@assets/js/projects/cs-pathway/model/ProfileManager.js';
import LocalProfile from '@assets/js/projects/cs-pathway/model/localProfile.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import Present from './Present.js';
import LoginManager from '@assets/js/projects/cs-pathway/model/LoginManager.js';
import CourseEnlistmentTrial from './CourseEnlistmentTrial.js';
import PersonaHallTrial from './PersonaHallTrial.js';
import { pythonURI, javaURI, fetchOptions } from '@assets/js/api/config.js';
import { refreshCourseNavigation } from '@assets/js/projects/cs-pathway/model/courseNavigation.js';
const PROFILE_PANEL_ID = 'csse-profile-panel';
import GameLevelCsPath1Way from './GameLevelCsPath1Way.js';

// Track player progress and choices per session.
const identityState = {
  startGatekeeperDone: false,
  identityUnlocked: false,
  avatarForgeDone: false,
  worldThemeDone: false,
  identityFlowActive: false,
  avatarFlowActive: false,
  worldThemeFlowActive: false,
};

/**
 * GameLevelCsPath0Forge - Identity Forge Level
 *
 * Opening level on the CS Pathway. Guides the player through three
 * identity stations: Identity Terminal, World Theme Portal, and Avatar Forge.
 * Profile data persisted via ProfileManager and module-level identityState.
 * @class
 */
class GameLevelCsPath0Forge {
  static levelId = 'csse-path';
  static displayName = 'Identity Forge';

  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.levelDisplayName = GameLevelCsPath0Forge.displayName;
    this.logPrefix = GameLevelCsPath0Forge.displayName;

    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    this._loadingState = {
      active: false,
      pending: 0,
      shownAt: 0,
      hideTimer: null,
      overlay: null,
    };

    this._assetTracking = {
      playerSrc: null,
      backgroundSrc: null,
    };

    this.getLoadingHostElement = GameLevelCsPathIdentity.prototype.getLoadingHostElement.bind(this);
    this.beginLoadingScreen = GameLevelCsPathIdentity.prototype.beginLoadingScreen.bind(this);
    this.queueLoadingWork = GameLevelCsPathIdentity.prototype.queueLoadingWork.bind(this);
    this.finishLoadingWork = GameLevelCsPathIdentity.prototype.finishLoadingWork.bind(this);
    this.primeAssetGate = GameLevelCsPathIdentity.prototype.primeAssetGate.bind(this);
    this.preloadTrackedAsset = GameLevelCsPathIdentity.prototype.preloadTrackedAsset.bind(this);
    this._getCompletion = GameLevelCsPathIdentity.prototype._getCompletion.bind(this);
    this._saveCompletion = GameLevelCsPathIdentity.prototype._saveCompletion.bind(this);
    this._getOverallScore = GameLevelCsPathIdentity.prototype._getOverallScore.bind(this);
    this._getCompletionPanelValues = GameLevelCsPathIdentity.prototype._getCompletionPanelValues.bind(this);
    this._syncCompletionPanel = GameLevelCsPathIdentity.prototype._syncCompletionPanel.bind(this);
    this.markLevelComplete = GameLevelCsPathIdentity.prototype.markLevelComplete.bind(this);

    // Ensure Identity Forge uses the shared completion storage key so reads
    // and writes are consistent with other levels.
    this._completionStorageKey = 'cs_pathway_completion';

    this.present = new Present(this, {
      toastDuration: 2200,
      ignoreToasts: ['Press E to interact'],
      isActiveLevel: () => this.gameEnv?.currentLevel === this || this.gameEnv?.gameLevel === this,
    });
    this.showToast = (message) => this.present.toast(message);
    this.setZoneAlert = (message) => this.present.alerts(message);
    this.clearZoneAlert = () => this.present.clearAlerts();
    this.panel = (message) => this.present.panel(message);
    this.score = (message) => this.present.score(message);
    this.clearPanel = () => this.present.clearPanel();
    this.clearScore = () => this.present.clearScore();

    /**
     * Section: Profile persistence.
     */

    // Initialize ProfileManager for save/load.
    this.profileManager = new ProfileManager();
    this.queueLoadingWork();
    this.profileManagerReady = this.profileManager.initialize().then(async (restored) => {
      if (restored) {
        console.log('GameLevel: restoring saved profile', restored);
        
        // Restore profile data
        if (restored.profileData) {
          this.profileData = { ...restored.profileData };
          console.log('GameLevel: profileData set to:', this.profileData);
        }
        
        // Restore progress state
        if (restored.identityState) {
          Object.assign(identityState, restored.identityState);
        }

        identityState.identityUnlocked = Boolean(identityState.identityUnlocked);
        identityState.worldThemeDone = Boolean(
          identityState.worldThemeDone ||
          identityState.worldThemeSelected ||
          this.profileData?.themeMeta ||
          this.profileData?.theme
        );
        identityState.avatarForgeDone = Boolean(
          identityState.avatarForgeDone ||
          identityState.avatarSelected ||
          this.profileData?.spriteMeta ||
          this.profileData?.sprite
        );
        
        console.log('GameLevel: profile restored', {
          name: this.profileData?.name,
          identityUnlocked: identityState.identityUnlocked,
          worldThemeDone: identityState.worldThemeDone,
          avatarForgeDone: identityState.avatarForgeDone,
        });
        
        // Update the profile panel with restored data (UI refresh only, no merge needed)
        await this.updateProfilePanel({});

        const restoreTasks = [];
        
        // Restore avatar sprite if saved
        if (this.profileData?.spriteMeta) {
          restoreTasks.push(this.applyAvatarOptions({ sprite: this.profileData.spriteMeta }));
        }
        
        // Restore world theme if saved
        if (this.profileData?.themeMeta) {
          restoreTasks.push(this.applyWorldTheme(this.profileData.themeMeta));
        }

        if (restoreTasks.length > 0) {
          await Promise.allSettled(restoreTasks);
        }
      }
    }).catch((err) => {
      console.warn('GameLevel: ProfileManager initialization failed', err);
    }).finally(() => {
      this.finishLoadingWork();
    });

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway/bg/identity-forge-default.png";    const bg_data = {
        name: GameLevelCsPath0Forge.displayName,
        greeting: "Welcome to the CSSE pathway!  This quest will identify your profile and personna!",
        src: image_src,
    };

    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CSSE pathway!",
      src: player_src,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { 
        x: width * 0.18,  
        y: height - (height / PLAYER_SCALE_FACTOR) 
      },      pixels: { height: 1024, width: 1024 },
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

    // FriendlyNpc expects these level references for toast routing in this engine build
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;

    // ── Gatekeepers ────────────────────────────────────────────
    const level = this;

    const startGatekeeperPos = {
      x: width * 0.10,
      y: height * 0.90,
    };

    const identityGatekeeperPos = {
      x: width * 0.22,   
      y: height * 0.68,  
    };
        
    const avatarGatekeeperPos = {
      x: width * 0.45,   
      y: height * 0.20,  
    };

    const worldThemeGatekeeperPos = {
      x: width * 0.12,   
      y: height * 0.30,  
    };    
    const courseEnlistmentGatekeeperPos = {
      x: width * 0.70,   
      y: height * 0.73,  
    };

    const personaHallGatekeeperPos = {
      x: width * 0.80,   // move RIGHT
      y: height * 0.20,  // move UP
    };
    
    const gatekeeperBaseData = {
      src: path + "/images/projects/cs-pathway/npc/gatekeeper2.png",
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

    const createGatekeeperData = ({ id, greeting, position, reaction, interact, interactDistance, zoneMessage, alertDistance }) => ({
      ...gatekeeperBaseData,
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      ...(zoneMessage ? { zoneMessage } : {}),
      ...(typeof alertDistance === 'number' ? { alertDistance } : {}),
      reaction: function () {
        if (reaction) reaction.call(this);
        if (level?.showToast) {
          level.showToast("Press E to interact");
        }
      },

      ...(interact ? { interact } : {}),
    });


    /**
     * Section: Journey flow.
     */
    
    /**
     * Start gatekeeper NPC. Opening guide who introduces the identity journey.
     */
    const npc_data_startGatekeeper = createGatekeeperData({
      id: 'StartGatekeeper',
      greeting: "Welcome to the Path of Code-Code-Coding...\nThis adventure begins with your identity.\nTravel to the Identity Terminal to define who you are.",
      position: startGatekeeperPos,
      zoneMessage: 'Gatekeeper: Press E to begin your identity journey.',
      alertDistance: 0.2,
      reaction: () => {
        if (identityState.startGatekeeperDone) return;
        identityState.startGatekeeperDone = true;
        void level.showDialogue('Gatekeeper', [
          'Welcome to the Path of Code-Code-Coding...',
          'This adventure begins with your identity.',
          'Travel to the Identity Terminal to define who you are.',
          'Interact with the gatekeeper for guidance by pressing E at each station to interact.',
        ]);
      },
    });


    /**
     * Identity gatekeeper NPC. Guards the Identity Terminal station.
     */
    const npc_data_identityGatekeeper = createGatekeeperData({
      id: 'IdentityGatekeeper',
      greeting: "This terminal is waiting for your identity. Press E to verify it!",
      position: identityGatekeeperPos,
      zoneMessage: 'Identity Terminal: Press E to verify your identity.',
      alertDistance: 0.2,
      reaction: function() {
        void level.runIdentityTerminal(!identityState.identityUnlocked);
      },
      interact: async function() {
        await level.showDialogue('Identity Gatekeeper', [
          'Welcome to the Identity Terminal.',
          'Enter your name to begin your journey!'
        ]);
        await level.runIdentityTerminal(false);
        if (identityState.identityUnlocked) {
          this.spriteData.greeting = `Identity registered for ${level.profileData?.name || 'this player'}. Proceed to the World Theme Portal.`;
        }
      },
    });

    /**
     * Enlistment gatekeeper NPC. Guards the Course Enlistment station.
     */
    const npc_data_courseEnlistmentGatekeeper = createGatekeeperData({
      id: 'CourseEnlistmentGatekeeper',
      greeting: "Welcome to Course Enlistment.\nChoose your pathway and plan your journey.",
      position: courseEnlistmentGatekeeperPos,
      zoneMessage: 'Course Enlistment: Press E to plan your courses.',
      alertDistance: 0.2,
    
      reaction: function () {
        void level.runCourseEnlistment(true, this);
      },
    
      interact: async function () {
        await level.showDialogue('Course Enlistment Gatekeeper', [
          'Welcome to Course Enlistment.',
          'Let’s map your pathway and future classes.',
        ]);
        await level.runCourseEnlistment(false, this);
      },
    });

    /**
     * Persona Hall gatekeeper NPC.
     */
    const npc_data_personaHallGatekeeper = createGatekeeperData({
      id: 'PersonaHallGatekeeper',
      greeting: "Welcome to Persona Hall.\nChoose the CS persona that best matches you.",
      position: personaHallGatekeeperPos,
      zoneMessage: 'Persona Hall: Press E to choose your persona.',
      alertDistance: 0.2,
    
      reaction: function () {
        void level.runPersonaHall(true, this);
        
      },
    
      interact: async function () {
        await level.showDialogue('Persona Hall Guide', [
          'Welcome to Persona Hall.',
          'Choose the CS persona that best matches how you work.'
        ]);
        await level.runPersonaHall(false, this);
      },
    });

    /**
     * Course Enlistment flow. Run the course enlistment wizard and persist the result.
     */ 
    this.runCourseEnlistment = async function(showIntro = false, npc = null) {
      if (this._courseEnlistmentOpen) return;
      this._courseEnlistmentOpen = true;
    
      try {
        if (showIntro) {
          await this.showDialogue('Course Enlistment Gatekeeper', [
            'This station helps you plan your learning journey.',
            'Opening Course Enlistment...'
          ]);
        }
    
        const trial = new CourseEnlistmentTrial({
          profileData: this.profileData || {},
          onComplete: async (result) => {
            try {
              await this.saveCoursePlanResult(result);
    
              this.showToast(`Path unlocked: ${result.title}`);
    
              const classesText = Array.isArray(result.recommendedClasses)
                ? result.recommendedClasses.map((c) => c.name || c).join(' → ')
                : (result.recommendedClass?.name || result.recommendedClass || '');
    
              this.panel?.(
                `${result.title}\n\n${result.summary}\n\nRecommended Classes: ${classesText}`
              );
    
            } catch (err) {
              console.error(err);
            } finally {
              this._courseEnlistmentOpen = false;
            }
          },
          onClose: () => {
            this._courseEnlistmentOpen = false;
          },
        });
    
        trial.start();
    
      } catch (err) {
        console.error(err);
        this._courseEnlistmentOpen = false;
      }
    };

    /**
     * Persona Hall flow. Run the persona selection wizard and persist the result.
     */
    this.runPersonaHall = async function(showIntro = false, npc = null) {
      if (this._personaHallOpen) return;
      this._personaHallOpen = true;

      try {
        if (showIntro) {
          await this.showDialogue('Persona Hall Guide', [
            'Welcome to Persona Hall.',
            'Choose the CS persona that best matches how you work.'
          ]);
        }

        const trial = new PersonaHallTrial({
          profileData: this.profileData || {},

          onComplete: async (result) => {
            await this.updateProfilePanel({
              persona: result.title,
              personaId: result.persona,
            });
            this.showToast(`Persona selected: ${result.title}`);
            this.panel?.(`${result.title}\n\n${result.summary}`);
            this._personaHallOpen = false;
          },

          onTeleport: () => {
            const gc = this.gameEnv?.gameControl;
            if (!gc) {
              console.error('[Teleport] gameControl not found');
              return;
            }

            const wayfindingIndex = gc.levelClasses?.findIndex(
              (lc) => lc.levelId === 'wayfinding-world'
            );

            if (wayfindingIndex !== -1 && wayfindingIndex !== undefined) {
              gc.currentLevelIndex = wayfindingIndex;
            } else {
              gc.levelClasses.splice(gc.currentLevelIndex + 1, 0, GameLevelCsPath1Way);
              gc.currentLevelIndex++;
            }

            gc.transitionToLevel();
          },

          onClose: () => {
            this._personaHallOpen = false;
          },
        });

        trial.start();

      } catch (err) {
        console.error(err);
        this._personaHallOpen = false;
      }
    };

    /**
     * Identity terminal flow. Run the authentication and identity registration wizard.
     * @private
     */
    this.runIdentityTerminal = async function(showIntro = false) {
      if (identityState.identityFlowActive) return;
      identityState.identityFlowActive = true;

      try {
        if (identityState.identityUnlocked) {
          await this.showDialogue('Identity Gatekeeper', [
            this.profileData?.name
              ? `Identity already registered for ${this.profileData.name}.`
              : 'Identity already registered.',
            this.profileData?.githubID
              ? `GitHub ID: ${this.profileData.githubID}`
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

        // Resolve auth: student JWT → guest session → show panel.
        let authBody = null;
        const authStatus = await LoginManager.isAuthenticated();
        if (authStatus.success) {
          // Authenticated student/teacher
          authBody = authStatus.body;
        } else {
          // Check for an existing guest session before prompting
          const guestSession = LoginManager.getGuestSession();
          if (guestSession) {
            authBody = guestSession;
          } else {
            const authResult = await LoginManager.showPanel(uiTheme);
            if (!authResult.success) return;
            authBody = authResult.body;
          }
        }

        // Switch ProfileManager to authenticated user context if not guest
        if (authBody && authBody.role !== 'guest') {
          console.log('Switch ProfileManager to authenticated user:', authBody.uid);
          await this.profileManager.switchToAuthenticatedUser(authBody);
        }

        // Prefill identity form with auth data.
        // For students, also update the OCS nav menu.
        if (authBody) {
          this.profileData = {
            ...this.profileData,
            name:     authBody.name  || this.profileData?.name     || '',
            email:    authBody.email || this.profileData?.email    || '',
            githubID: authBody.uid   || this.profileData?.githubID || '',
          };
          if (authBody.role !== 'guest') {
            LoginManager.updateNavMenu(authBody);
          }
        }

        const identityData = await this.showIdentityForm();
        if (!identityData) return;

        identityState.identityUnlocked = true;
        await this.showDialogue('Identity Gatekeeper', [
          `Identity registered for ${identityData.name}.`,
          `Email: ${identityData.email}`,
          `GitHub ID: ${identityData.githubID}`,
          'Identity Terminal unlocked.'
        ]);

        this.showToast('✦ Identity Terminal unlocked');
      } finally {
        identityState.identityFlowActive = false;
      }
    };

    /**
     * Show identity form. Present the identity FormPanel and save profile on submit.
     * @private
     */
    this.showIdentityForm = async function() {
      // Wait for ProfileManager to be ready
      await this.profileManagerReady;

      const profile = await this.identityFormView.show(this.profileData || {});
      if (!profile) {
        return null;
      }

      await this.updateProfilePanel(profile, { updateIdentityProgress: true });
      return this.profileData;
    };

    /**
     * Persist course-plan results and sync the shared Courses navigation.
     */
    this.saveCoursePlanResult = async function(result) {
      const recommendedClasses = Array.isArray(result?.recommendedClasses)
        ? result.recommendedClasses
        : result?.recommendedClass
          ? [result.recommendedClass]
          : [];

      const normalizedClassNames = [...new Set(
        recommendedClasses
          .map((entry) => entry?.name || entry)
          .filter(Boolean)
      )];
      const selectedClass = normalizedClassNames[0] || null;

      const currentProfile = { ...(this.profileData || {}) };
      const updatedProfile = {
        ...currentProfile,
        coursePlanMeta: {
          title: result?.title || '',
          summary: result?.summary || '',
          primaryPath: result?.primaryPath || '',
          secondaryPath: result?.secondaryPath || '',
          learningStyle: result?.learningStyle || '',
          percentages: result?.percentages || {},
          scores: result?.scores || {},
          recommendedClass: result?.recommendedClass || recommendedClasses[0] || null,
          recommendedClasses,
          selectedClass,
          gamePlan: result?.gamePlan || result?.successPlan || [],
          redeemToken: result?.redeemToken || null,
          completedAt: result?.completedAt || new Date().toISOString(),
        },
      };

      this.profileData = updatedProfile;

      if (typeof this.profileManager?.updateProgress === 'function') {
        await this.profileManager.updateProgress('coursePlanMeta', updatedProfile.coursePlanMeta);
      }

      if (selectedClass) {
        try {
          const currentResponse = await fetch(`${pythonURI}/api/user/class`, fetchOptions);
          if (currentResponse.ok) {
            const currentData = await currentResponse.json();
            const currentClasses = Array.isArray(currentData?.class) ? currentData.class : [];

            if (!currentClasses.includes(selectedClass)) {
              const method = currentClasses.length > 0 ? 'PUT' : 'POST';
              const body = method === 'PUT'
                ? { class: [...currentClasses, selectedClass] }
                : { class: selectedClass };

              const saveResponse = await fetch(`${pythonURI}/api/user/class`, {
                ...fetchOptions,
                method,
                body: JSON.stringify(body),
              });

              if (!saveResponse.ok) {
                throw new Error(`Failed to save class selection (${saveResponse.status})`);
              }
            }

            await refreshCourseNavigation(true);
          }
        } catch (error) {
          console.warn('Course Enlistment: failed to sync class selection', error);
        }
      }
    };

    /**
     * Avatar gatekeeper NPC. Guards the Avatar Forge station.
     */
    const npc_data_avatarGatekeeper = createGatekeeperData({
      id: 'AvatarGatekeeper',
      greeting: "Welcome to the Avatar Forge...\nChoose your look and watch your character update live!",
      position: avatarGatekeeperPos,
      zoneMessage: 'Avatar Forge: Press E to customize your avatar.',
      alertDistance: 0.2,
      reaction: function() {
        void level.runAvatarForge(true, this);
      },
      interact: async function() {
        await level.showDialogue('Avatar Forge Gatekeeper', [
          'Welcome to the Avatar Forge.',
          'Choose your look and watch your character update live!'
        ]);
        await level.runAvatarForge(false, this);
      },
    });

    /**
     * Avatar forge flow. Run the avatar sprite selection wizard and persist the result.
     * @private
     */
    this.runAvatarForge = async function(showIntro = false, npc = null) {
      if (identityState.avatarFlowActive) return;
      identityState.avatarFlowActive = true;

      try {
        const hasSavedAvatar = Boolean(
          identityState.avatarForgeDone ||
          identityState.avatarSelected ||
          this.profileData?.spriteMeta ||
          this.profileData?.sprite
        );

        if (!identityState.worldThemeDone && !hasSavedAvatar) {
          await this.showDialogue('Avatar Forge Gatekeeper', [
            'The Avatar Forge is locked.',
            'Complete the World Theme Portal first.'
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
        
        await this.profileManager.saveAvatar(avatarChoices.spriteMeta);
        await this.profileManager.updateAvatarProgress(true);

        if (npc?.spriteData) {
          npc.spriteData.greeting = `Your forged avatar is ${spriteName}.`;
        }

        await this.showDialogue('Avatar Forge Gatekeeper', [
          `Your new form: ${spriteName}`,
          'You have been forged in the Avatar Forge!',
          'Your journey is now complete with your new appearance.',
          'Feel free to revisit the forge to change your look anytime.'
        ]);

        this.showToast('✦ Avatar Forge completed');
        this.markLevelComplete('identityForge');
      } finally {
        identityState.avatarFlowActive = false;
      }
    };

    /**
     * World Theme gatekeeper NPC. Guards the World Theme Portal station.
     */
    const npc_data_worldThemeGatekeeper = createGatekeeperData({
      id: 'WorldThemeGatekeeper',
      greeting: "Welcome to the World Theme Portal...\nChoose a background and watch your world transform live!",
      position: worldThemeGatekeeperPos,
      zoneMessage: 'World Theme Portal: Press E to reshape your world.',
      alertDistance: 0.2,
      reaction: function() {
        void level.runWorldThemePortal(true, this);
      },
      interact: async function() {
        await level.showDialogue('World Theme Gatekeeper', [
          'Welcome to the World Theme Portal.',
          'Choose a background and watch your world transform live!'
        ]);
        await level.runWorldThemePortal(false, this);
      },

    });
 
    /**
     * World theme flow. Run the background theme selection wizard and persist the result.
     * @private
     */
    this.runWorldThemePortal = async function(showIntro = false, npc = null) {
      if (identityState.worldThemeFlowActive) return;
      identityState.worldThemeFlowActive = true;
 
      try {
        if (!identityState.identityUnlocked) {
          await this.showDialogue('World Theme Gatekeeper', [
            'The World Theme Portal is locked.',
            'Complete the Identity Terminal first.'
          ]);
          return;
        }
 
        if (showIntro) {
          await this.showDialogue('World Theme Gatekeeper', [
            identityState.worldThemeDone
              ? 'Your world theme is set. Opening the portal again.'
              : 'Welcome to the World Theme Portal.',
            'Choose a background and watch your world transform live!'
          ]);
        }
 
        const themeChoice = await this.showWorldThemeForm();
        if (!themeChoice) return;
 
        identityState.worldThemeDone = true;
        const themeName = themeChoice.themeMeta?.name || themeChoice.theme || 'Default';
        
        await this.profileManager.saveTheme(themeChoice.themeMeta);
        await this.profileManager.updateThemeProgress(true);
 
        if (npc?.spriteData) {
          npc.spriteData.greeting = `Your world is set to ${themeName}.`;
        }
 
        await this.showDialogue('World Theme Gatekeeper', [
          `World theme applied: ${themeName}`,
          'Your world has been reshaped!',
          'Your journey continues in a new environment.',
          'The Avatar Forge is now unlocked with theme-compatible sprites!',
          'Visit the forge to choose your character that matches this world.'
        ]);

        this.showToast('✦ Avatar Forge unlocked');
      } finally {
        identityState.worldThemeFlowActive = false;
      }
    };    


    /**
     * Section: UI and dialogue.
     */

    /**
     * Level dialogue system. DialogueSystem instance shared by all NPC conversations.
     */
    this.levelDialogueSystem = new DialogueSystem({
      id: 'csse-path-dialogue',
      dialogues: [],
      gameControl: gameEnv.gameControl,
      enableVoice: true,
      enableTypewriter: true,
      typewriterSpeed: 24,
      voiceRate: 0.9,
    });

    /**
     * Show dialogue. Present an array of lines sequentially in the level dialogue system.
     */
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


    /**
     * Create notification style. Shared styling for toast and zone alert overlays.
     * @private
     */
    const createNotificationStyle = (top, zIndex) => `
      position: fixed; top: ${top}; right: 20px;
      z-index: ${zIndex}; pointer-events: none;
      background: ${uiTheme.background}; 
      border: 2px solid ${uiTheme.borderColor};
      color: ${uiTheme.accentColor}; 
      font-family: ${uiTheme.fontFamily || "'Courier New', monospace"}; 
      font-size: 13px;
      padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
      box-shadow: ${uiTheme.boxShadow};
      width: min(360px, 32vw); text-align: left;
    `;

    /**
     * Show toast. Display a timed status overlay at the top-right of the screen.
     */
    this.showToast = function(message) {
      if (message === 'Press E to interact') {
        return;
      }

      const isActiveLevel = this.gameEnv?.currentLevel === this || this.gameEnv?.gameLevel === this;
      if (!isActiveLevel) return;

      const host = document.body;
      if (!host) return;

      if (this._toastEl?.parentNode) {
        this._toastEl.parentNode.removeChild(this._toastEl);
      }
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = createNotificationStyle('20px', 100020);
      toast.textContent = message;
      host.appendChild(toast);

      this._toastEl = toast;
      this._toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (this._toastEl === toast) this._toastEl = null;
        this._toastTimer = null;
      }, 2200);
    };

    /**
     * Set zone alert. Display a persistent proximity message below the toast area.
     */
    this.setZoneAlert = function(message) {
      const isActiveLevel = this.gameEnv?.currentLevel === this || this.gameEnv?.gameLevel === this;
      if (!isActiveLevel) return;

      const host = document.body;
      if (!host) return;

      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = createNotificationStyle('84px', 100010);
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }

      this._zoneAlertEl.textContent = message;
    };

    /**
     * Clear zone alert. Remove the zone alert element from the DOM.
     */
    this.clearZoneAlert = function() {
      if (this._zoneAlertEl?.parentNode) {
        this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      }
      this._zoneAlertEl = null;
    };


    /**
     * Shared UI theme. Color and style tokens applied to all panels in this level.
     */
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

    /**
     * Avatar picker view. Picker for sprite selection with normalizer and grid config.
     */
    this.avatarPickerView = new Picker({
      id: 'csse-avatar-picker',
      title: '⚔ Avatar Forge Sprite Selector',
      description: 'Tap any sprite to preview it. Use Done to keep your choice.',
      confirmLabel: 'Done',
      cancelLabel: 'Cancel',
      showCancel: true,
      theme: uiTheme,
      normalizer: (sprite = {}) => {
        const rows = Number(sprite.rows || sprite.orientation?.rows || 1);
        const cols = Number(sprite.cols || sprite.orientation?.columns || 1);
        const name = sprite.name || sprite.label || String(sprite.src || 'sprite').replace(/\.[^.]+$/, '');

        return {
          id: sprite.id || String(sprite.src || name),
          name,
          label: sprite.label || name,
          src: sprite.src || '',
          rawSrc: sprite.src || '',
          rows,
          cols,
          scaleFactor: Number(sprite.scaleFactor || sprite.scale || 5),
          movementPreset: sprite.movementPreset || (rows >= 4 ? 'four-row-8way' : 'single-row'),
          directions: sprite.directions || null,
          previewText: sprite.previewText || `${rows}×${cols} spritesheet`,
        };
      },
      gridStyle: {
        columns: 'repeat(auto-fill, minmax(110px, 1fr))',
      },
      imageStyle: {
        maxWidth: '80px',
        maxHeight: '80px',
        imageRendering: 'pixelated',
        marginBottom: '4px',
      },
    });


    /**
     * Load avatar catalog. Fetch sprite manifest, filter by world theme, and cache.
     * @private
     */
    this.getAvatarCatalog = async function() {
      if (this.avatarCatalog) {
        return this.avatarCatalog;
      }

      const fallbackCatalog = [
        {
          name: 'Minimalist',
          src: `${path}/images/projects/cs-pathway/player/minimalist.png`,
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
        let manifestSprites = Array.isArray(manifest)
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

        // Filter sprites based on selected world theme
        const selectedTheme = this.profileData?.themeMeta;
        let catalogSprites = manifestSprites;

        if (selectedTheme && Array.isArray(selectedTheme.compatibleSprites) && selectedTheme.compatibleSprites.length > 0) {
          console.log('Avatar Forge: filtering sprites for theme', selectedTheme.name, 'compatible:', selectedTheme.compatibleSprites);
          const filteredSprites = manifestSprites.filter((sprite) =>
            selectedTheme.compatibleSprites.includes(sprite.name)
          );

          if (filteredSprites.length > 0) {
            catalogSprites = filteredSprites;
          } else {
            console.warn('Avatar Forge: no compatible sprites found for theme', selectedTheme.name, selectedTheme.compatibleSprites);
          }
        } else {
          console.log('Avatar Forge: no world theme selected, showing all sprites');
        }

        const seen = new Set();
        this.avatarCatalog = [
          ...(catalogSprites === manifestSprites ? fallbackCatalog : []),
          ...catalogSprites,
        ].filter((sprite) => {
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

    /**
     * Map avatar movement. Return direction-to-row/column config for a given sprite preset.
     * @private
     */
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


    /**
     * Find player object. Return the Player game object from the current game environment.
     * @private
     */
    this.getPlayerObject = function() {
      return gameEnv.gameObjects.find(obj => (obj.data && obj.data.id === 'Minimalist_Identity') || obj.id === 'Minimalist_Identity');
    };

    /**
     * Apply avatar options. Swap the player's sprite sheet and movement config live.
     * @private
     */
    this.applyAvatarOptions = function(options = {}, remainingAttempts = 20) {
      return new Promise((resolve) => {
        const attemptApply = (attemptNumber) => {
          const playerObj = this.getPlayerObject();
          if (!playerObj) {
            if (attemptNumber > 0) {
              setTimeout(() => attemptApply(attemptNumber - 1), 50);
            } else {
              console.warn('Avatar Forge: player object not found');
              resolve(false);
            }
            return;
          }

      const spriteMeta = typeof options.sprite === 'object'
        ? options.sprite
        : options.spriteMeta || {
            name: 'Minimalist',
            src: `${path}/images/projects/cs-pathway/player/minimalist.png`,
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

            resolve(true);
          };

          playerObj.spriteSheet.onerror = (e) => {
            console.warn('Failed to load sprite:', newSpritePath, e);
            resolve(false);
          };

          playerObj.spriteSheet.src = newSpritePath;

          // Update profile asynchronously (no await needed in Promise callback)
          this.updateProfilePanel({
            sprite: spriteMeta.name || 'Minimalist',
            spriteSrc: newSpritePath,
            spriteMeta,
          });
        };

        attemptApply(remainingAttempts);
      });
    };

    /**
     * Show avatar form. Open the avatar Picker, preview live, and return the confirmed sprite.
     * @private
     */
    this.showAvatarCustomForm = async function() {
      const sprites = await this.getAvatarCatalog();
      const originalSprite = this.profileData?.spriteMeta || sprites[0];

      const selectedSprite = await this.avatarPickerView.show(
        sprites,
        originalSprite,
        (sprite) => {
          this.applyAvatarOptions({ sprite });
        }
      );

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
     * Section: World Theme data.
     */
 
    /**
     * World theme picker. Picker for background theme selection with grid config.
     */
    this.worldThemePickerView = new Picker({
      id: 'csse-world-theme-picker',
      title: '🌐 World Theme Portal',
      description: 'Tap any background to preview it. Use Done to lock in your world.',
      confirmLabel: 'Done',
      cancelLabel: 'Cancel',
      showCancel: true,
      theme: uiTheme,
      normalizer: (theme = {}) => {
        const name = theme.name || theme.label || String(theme.src || 'theme').replace(/\.[^.]+$/, '');

        return {
          ...theme,
          id: theme.id || String(theme.src || name),
          name,
          label: theme.label || name,
          src: theme.src || '',
          rawSrc: theme.src || '',
          rows: 1,  // Themes are single images, not sprite sheets
          cols: 1,
          previewText: theme.previewText || theme.description || '',
          compatibleSprites: Array.isArray(theme.compatibleSprites) ? theme.compatibleSprites : [],
        };
      },
      gridStyle: {
        columns: 'repeat(auto-fill, minmax(140px, 1fr))',
      },
      imageStyle: {
        width: '120px',
        height: '70px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '6px',
        display: 'block',
      },
    });
 
    /**
     * Load background catalog. Fetch background manifest from JSON and cache results.
     * @private
     */
    this.getBackgroundCatalog = async function() {
      if (this.backgroundCatalog) {
        return this.backgroundCatalog;
      }
 
      const fallbackCatalog = [
        {
          name: 'Default',
          src: `${path}/images/projects/cs-pathway/bg/identity-forge-default.png`,
          previewText: 'Unactivated world',
        },
      ];

      try {
        const response = await fetch(`${path}/images/projects/cs-pathway/bg/index.json`, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
 
        const manifest = await response.json();
        const manifestThemes = Array.isArray(manifest)
          ? manifest.map((entry) => ({
              name: entry.name,
              src: `${path}/images/projects/cs-pathway/bg/${entry.src}`,
              previewText: entry.previewText || entry.description || '',
            }))
          : [];
 
        const seen = new Set();
        this.backgroundCatalog = [...fallbackCatalog, ...manifestThemes].filter((theme) => {
          if (!theme?.src || seen.has(theme.src)) {
            return false;
          }
          seen.add(theme.src);
          return true;
        });
      } catch (error) {
        console.warn('World Theme Portal: failed to load background catalog', error);
        this.backgroundCatalog = fallbackCatalog;
      }
 
      return this.backgroundCatalog;
    };
 
    /**
     * Find background object. Return the level background game object by display name.
     * @private
     */
    this.getBackgroundObject = function() {
      const bgObj = gameEnv.gameObjects.find(obj =>
        (obj.data && obj.data.name === GameLevelCsPath0Forge.displayName)
      );
      if (!bgObj) {
        console.warn('World Theme Portal: background object not found');
        console.log('Looking for name:', GameLevelCsPath0Forge.displayName);
        console.log('Available objects:', gameEnv.gameObjects.map(obj => ({
          hasData: !!obj.data,
          dataName: obj.data?.name,
          className: obj.constructor.name,
          id: obj.id
        })));
      }
      return bgObj;
    };
 
    /**
     * Apply world theme. Swap background image live and update profile with the new theme.
     * @private
     */
    this.applyWorldTheme = function(themeMeta = {}, remainingAttempts = 20) {
      return new Promise((resolve) => {
        const attemptApply = (attemptNumber) => {
          const bgObj = this.getBackgroundObject();
          if (!bgObj) {
            if (attemptNumber > 0) {
              setTimeout(() => attemptApply(attemptNumber - 1), 100);
            } else {
              console.warn('World Theme Portal: background object not found');
              console.log('Available objects:', gameEnv.gameObjects.map(obj => ({ data: obj.data, id: obj.id })));
              resolve(false);
            }
            return;
          }

          const newSrc = themeMeta.src;
          if (!newSrc) {
            console.warn('World Theme Portal: no src provided in themeMeta', themeMeta);
            resolve(false);
            return;
          }

          console.log('World Theme Portal: applying theme', themeMeta.name, 'with src:', newSrc);

          if (bgObj.data) {
            bgObj.data.src = newSrc;
          }

          bgObj.image = new Image();
          bgObj.spriteReady = false;

          bgObj.image.onload = () => {
            bgObj.spriteReady = true;
            console.log('World Theme Portal: background image loaded successfully for', themeMeta.name);
            try {
              bgObj.resize?.();
            } catch (err) {
              console.warn('Error updating background dimensions', err);
            }

            resolve(true);
          };

          bgObj.image.onerror = (e) => {
            console.warn('Failed to load background:', newSrc, 'for theme:', themeMeta.name, e);
            resolve(false);
          };

          console.log('World Theme Portal: setting background src to:', newSrc);
          bgObj.image.src = newSrc;

          // Update profile asynchronously (no await needed in Promise callback)
          this.updateProfilePanel({
            worldTheme: themeMeta.name || 'Default',
            worldThemeSrc: newSrc,
            themeMeta,
          });

          // Clear avatar catalog cache so it reloads with theme-compatible sprites
          this.avatarCatalog = null;
        };

        attemptApply(remainingAttempts);
      });
    };
 
    /**
     * Show world theme form. Open the World Theme Picker and apply the confirmed theme.
     * @private
     */
    this.showWorldThemeForm = async function() {
      const themes = await this.getBackgroundCatalog();
      const originalTheme = this.profileData?.themeMeta || themes[0];
 
      // Don't define onPreview (as in AvatarPicker) - it breaks player movement on exit
      const selectedTheme = await this.worldThemePickerView.show(
        themes,
        originalTheme,
        null  // no onPreview callback
      );
 
      if (!selectedTheme) {
        // User cancelled - nothing to do, keep current background, we should allow existing theme as OK to advance? 
        return null;
      }
 
      // Only apply the theme after user confirms selection.
      await this.applyWorldTheme(selectedTheme);
 
      return {
        theme: selectedTheme.name,
        themeMeta: selectedTheme,
      };
    };


    /**
     * Section: UI config.
     */

    /**
     * Profile panel config. StatusPanel config showing player identity, avatar, and theme.
     */
    const profilePanelConfig = {
      id: PROFILE_PANEL_ID,
      title: 'PLAYER PROFILE',
      fields: [
        { key: 'name', label: 'Name', emptyValue: '—' },
        { key: 'email', label: 'Email', emptyValue: '—' },
        { key: 'githubID', label: 'GitHub ID', emptyValue: '—' },
        { type: 'section', title: 'Persona Hall', marginTop: '8px' },
        { key: 'persona', label: 'Persona', emptyValue: '—' },
        { type: 'section', title: 'Course Enlistment', marginTop: '8px' },
        { key: 'courseClass', label: 'Class', emptyValue: '—' },
        { type: 'section', title: 'Avatar Sprite', marginTop: '8px' },
        { key: 'sprite', label: 'Sprite', emptyValue: '—' },
        { type: 'section', title: 'World Theme', marginTop: '8px' },
        { key: 'worldTheme', label: 'Theme', emptyValue: '—' },
        { type: 'section', title: 'Completion Status', marginTop: '10px' },
        { key: 'completionIdentityForge',   label: 'Identity Forge',   emptyValue: '—' },
        { key: 'completionWayfindingWorld', label: 'Wayfinding World', emptyValue: '—' },
        { key: 'completionMissionTools',    label: 'Mission Tools',    emptyValue: '—' },
        { key: 'completionOverallScore',    label: 'Overall Score',    emptyValue: '0.55' },
      ],
      actions: [
        // Snapshot & Recover buttons (authenticated users only)
        ...(level.profileManager.isAuthenticated ? [
          {
            label: 'Snapshot Progress',
            title: 'Save current progress to server',
            onClick: async () => {
              try {
                await level.profileManager.save();
                level.showToast('✦ Progress saved to server!');
              } catch (error) {
                console.error('Failed to snapshot profile:', error);
                alert('Failed to save snapshot. Check console for details.');
              }
            }
          },
          {
            label: '🔄 Recover from Server',
            title: 'Restore progress from last server snapshot',
            onClick: async () => {
              const confirmed = confirm(
                'Recover from Server?\n\n' +
                'This will replace your current progress with\n' +
                'the last snapshot saved to the server.\n\n' +
                'Current unsaved changes will be lost.\n\n' +
                'Continue with recovery?'
              );

              if (confirmed) {
                try {
                  const result = await level.profileManager.recoverFromBackend();
                  if (result.success) {
                    console.log('Profile recovered from backend');
                    level.showToast('✦ Progress recovered - reloading...');
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    alert(result.body?.error || 'Failed to recover from server.');
                  }
                } catch (error) {
                  console.error('Failed to recover profile:', error);
                  alert('Failed to recover from server. Check console for details.');
                }
              }
            }
          }
        ] : []),
        // Reset button (always visible)
        {
          label: '🔄 Reset Profile',
          title: 'Clear profile data and start fresh',
          danger: true,
          onClick: () => level._showResetModal(),
        }
      ],
      theme: uiTheme,
    };
    this.profilePanelView = new StatusPanel(profilePanelConfig);
    // Render and seed the panel immediately (mirror other levels).
    this.profilePanelView.render();
    this.profilePanelView.update({
      name: this.profileData?.name || '—',
      email: this.profileData?.email || '—',
      githubID: this.profileData?.githubID || '—',
      persona: this.profileData?.persona || '—',
      sprite: this.profileData?.sprite || '—',
      worldTheme: this.profileData?.theme || this.profileData?.worldTheme || '—',
      courseName: this.profileData?.courseName || '—',
      ...this._getCompletionPanelValues(),
    });

    /**
     * Identity form config. FormPanel config for the Identity Terminal input fields.
     */
    const identityFormConfig = {
      id: 'csse-identity-terminal',
      title: '⚔ Identity Terminal Setup',
      description: "Enter your Student ID (barcode) or GitHub ID. If not logged in, you can fast-track register your face below.",
      submitLabel: 'Unlock Identity Terminal',
      showCancel: true,
      cancelLabel: 'Cancel',
      fields: [
        { name: 'studentID', label: 'Student ID (Barcode):', type: 'text', placeholder: 'Enter 7-digit ID (autofills Name)', required: false, autocomplete: 'off' },
        { name: 'name', label: 'Name:', type: 'text', required: true, autocomplete: 'name' },
        { name: 'email', label: 'Email:', type: 'email', required: true, autocomplete: 'email' },
        { name: 'githubID', label: 'GitHub ID:', type: 'text', required: true, autocomplete: 'username' },
        {
          name: 'suggestions',
          type: 'custom',
          render: (form, inputs, initialValues, formPanel) => {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.width = '100%';

            const suggestionsList = document.createElement('div');
            Object.assign(suggestionsList.style, {
              position: 'absolute',
              top: '-8px',
              left: '0',
              right: '0',
              zIndex: '10002',
              background: 'rgba(13, 13, 26, 0.96)',
              border: '1px solid #4ecca3',
              borderRadius: '4px',
              maxHeight: '150px',
              overflowY: 'auto',
              display: 'none',
              boxShadow: '0 4px 12px rgba(78, 204, 163, 0.25)',
            });
            container.appendChild(suggestionsList);

            // Function to fetch and display autocomplete suggestions
            let debounceTimer = null;
            const handleSearch = (term) => {
              clearTimeout(debounceTimer);
              if (!term || term.trim().length < 2) {
                suggestionsList.style.display = 'none';
                return;
              }
              debounceTimer = setTimeout(async () => {
                try {
                  const res = await fetch(`${javaURI}/api/people/search?query=${encodeURIComponent(term)}`, fetchOptions);
                  if (res.ok) {
                    const people = await res.json();
                    if (people && people.length > 0) {
                      suggestionsList.innerHTML = '';
                      people.slice(0, 5).forEach(person => {
                        const item = document.createElement('div');
                        item.textContent = `${person.name} (${person.uid})`;
                        Object.assign(item.style, {
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(78, 204, 163, 0.15)',
                          color: '#e0e0e0',
                          fontSize: '11px',
                          fontFamily: '"Courier New", monospace',
                        });
                        item.addEventListener('mouseenter', () => {
                          item.style.background = 'rgba(78, 204, 163, 0.15)';
                          item.style.color = '#4ecca3';
                        });
                        item.addEventListener('mouseleave', () => {
                          item.style.background = 'none';
                          item.style.color = '#e0e0e0';
                        });
                        item.addEventListener('click', () => {
                          if (inputs['name']) inputs['name'].value = person.name || '';
                          if (inputs['githubID']) inputs['githubID'].value = person.uid || '';
                          if (inputs['email']) inputs['email'].value = person.email || '';
                          if (inputs['studentID'] && person.sid) inputs['studentID'].value = person.sid || '';
                          suggestionsList.style.display = 'none';
                        });
                        suggestionsList.appendChild(item);
                      });
                      suggestionsList.style.display = 'block';
                    } else {
                      suggestionsList.style.display = 'none';
                    }
                  }
                } catch (err) {
                  console.error('Suggestions lookup failed:', err);
                }
              }, 200);
            };

            // Attach listeners to githubID and name fields
            if (inputs['githubID']) {
              inputs['githubID'].addEventListener('input', (e) => handleSearch(e.target.value));
            }
            if (inputs['name']) {
              inputs['name'].addEventListener('input', (e) => handleSearch(e.target.value));
            }

            // Attach Student ID change keyup/change auto-fill listener
            if (inputs['studentID']) {
              inputs['studentID'].addEventListener('input', async (e) => {
                const sid = e.target.value.trim();
                if (sid.length === 7) {
                  inputs['studentID'].style.borderColor = '#e67e22'; // loading color
                  try {
                    const res = await fetch(`${javaURI}/api/${sid}`);
                    if (res.ok) {
                      const name = await res.text();
                      if (name && name !== 'Not a valid barcode') {
                        inputs['name'].value = name;
                        inputs['studentID'].style.borderColor = '#4ecca3'; // success
                        inputs['name'].style.boxShadow = '0 0 8px rgba(78, 204, 163, 0.4)';
                        setTimeout(() => {
                          inputs['name'].style.boxShadow = 'none';
                        }, 1500);
                      } else {
                        inputs['studentID'].style.borderColor = '#ff6b6b'; // invalid
                      }
                    } else {
                      inputs['studentID'].style.borderColor = '#ff6b6b';
                    }
                  } catch (err) {
                    console.error('SID lookup failed:', err);
                    inputs['studentID'].style.borderColor = '#ff6b6b';
                  }
                } else {
                  inputs['studentID'].style.borderColor = '';
                }
              });
            }

            // Hide suggestions if clicking outside
            document.addEventListener('pointerdown', (e) => {
              if (!container.contains(e.target) && (!inputs['githubID'] || !inputs['githubID'].contains(e.target)) && (!inputs['name'] || !inputs['name'].contains(e.target))) {
                suggestionsList.style.display = 'none';
              }
            });

            return container;
          }
        },
        {
          name: 'faceScanner',
          type: 'custom',
          render: (form, inputs, initialValues, formPanel) => {
            // Style setup
            const style = document.createElement('style');
            style.textContent = `
              .scanner-widget {
                border: 1px dashed rgba(78, 204, 163, 0.4);
                border-radius: 8px;
                padding: 16px;
                margin-top: 8px;
                background: rgba(26, 26, 46, 0.4);
                font-family: "Courier New", monospace;
              }
              .webcam-box {
                position: relative;
                width: 100%;
                max-width: 240px;
                height: 180px;
                margin: 12px auto;
                border: 2px solid #4ecca3;
                border-radius: 6px;
                overflow: hidden;
                background: #080811;
                display: none;
                box-shadow: 0 0 15px rgba(78, 204, 163, 0.35);
              }
              .webcam-video-feed {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .scanner-laser-line {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(78, 204, 163, 0.85);
                box-shadow: 0 0 8px #4ecca3, 0 0 12px #4ecca3;
                animation: scanLaserAnim 2s linear infinite;
                pointer-events: none;
              }
              @keyframes scanLaserAnim {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
              .scanner-corner {
                position: absolute;
                width: 10px;
                height: 10px;
                border: 2px solid #4ecca3;
                pointer-events: none;
              }
              .c-tl { top: 4px; left: 4px; border-right: none; border-bottom: none; }
              .c-tr { top: 4px; right: 4px; border-left: none; border-bottom: none; }
              .c-bl { bottom: 4px; left: 4px; border-right: none; border-top: none; }
              .c-br { bottom: 4px; right: 4px; border-left: none; border-top: none; }
              
              .scanner-btn {
                background: rgba(78, 204, 163, 0.1);
                color: #4ecca3;
                border: 1px solid #4ecca3;
                padding: 6px 12px;
                font-size: 11px;
                font-family: "Courier New", monospace;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: block;
                width: 100%;
                margin-top: 8px;
                text-align: center;
              }
              .scanner-btn:hover {
                background: #4ecca3;
                color: #0d0d1a;
                box-shadow: 0 0 10px rgba(78, 204, 163, 0.4);
              }
              .scanner-btn:disabled {
                border-color: #555;
                color: #555;
                background: none;
                cursor: not-allowed;
                box-shadow: none;
              }
              .scanner-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 6px;
                background: #888;
              }
            `;
            document.head.appendChild(style);

            const widget = document.createElement('div');
            widget.className = 'scanner-widget';

            // Top Status Panel
            const statusRow = document.createElement('div');
            statusRow.style.display = 'flex';
            statusRow.style.alignItems = 'center';
            statusRow.style.fontSize = '11px';
            statusRow.style.color = '#c7f2d4';
            statusRow.style.marginBottom = '8px';

            const dot = document.createElement('span');
            dot.className = 'scanner-status-dot';
            statusRow.appendChild(dot);

            const statusText = document.createElement('span');
            statusText.textContent = 'Biometric Scan: Ready';
            statusRow.appendChild(statusText);
            widget.appendChild(statusRow);

            // Webcam Box
            const webcamBox = document.createElement('div');
            webcamBox.className = 'webcam-box';

            const video = document.createElement('video');
            video.className = 'webcam-video-feed';
            video.autoplay = true;
            video.playsInline = true;
            webcamBox.appendChild(video);

            const laser = document.createElement('div');
            laser.className = 'scanner-laser-line';
            webcamBox.appendChild(laser);

            const tl = document.createElement('div'); tl.className = 'scanner-corner c-tl'; webcamBox.appendChild(tl);
            const tr = document.createElement('div'); tr.className = 'scanner-corner c-tr'; webcamBox.appendChild(tr);
            const bl = document.createElement('div'); bl.className = 'scanner-corner c-bl'; webcamBox.appendChild(bl);
            const br = document.createElement('div'); br.className = 'scanner-corner c-br'; webcamBox.appendChild(br);
            
            widget.appendChild(webcamBox);

            // Hidden Canvas
            const canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            widget.appendChild(canvas);

            // Action Buttons
            const startBtn = document.createElement('button');
            startBtn.type = 'button';
            startBtn.className = 'scanner-btn';
            startBtn.textContent = '⚙ START FACE SCANNER';
            widget.appendChild(startBtn);

            const captureBtn = document.createElement('button');
            captureBtn.type = 'button';
            captureBtn.className = 'scanner-btn';
            captureBtn.textContent = '📸 CAPTURE & REGISTER FACE';
            captureBtn.disabled = true;
            captureBtn.style.display = 'none';
            widget.appendChild(captureBtn);

            // Webcam state tracking
            let stream = null;

            const stopWebcam = () => {
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
              }
              video.srcObject = null;
              webcamBox.style.display = 'none';
              startBtn.style.display = 'block';
              captureBtn.style.display = 'none';
              captureBtn.disabled = true;
            };

            const startWebcam = async () => {
              statusText.textContent = 'Requesting camera permissions...';
              dot.style.background = '#e67e22';
              try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
                video.srcObject = stream;
                webcamBox.style.display = 'block';
                startBtn.style.display = 'none';
                captureBtn.style.display = 'block';
                captureBtn.disabled = false;
                statusText.textContent = 'Camera Active. Position your face in frame.';
                dot.style.background = '#4ecca3';
              } catch (err) {
                console.error('Camera access failed:', err);
                statusText.textContent = 'Camera access denied. Please try again.';
                dot.style.background = '#ff6b6b';
              }
            };

            startBtn.addEventListener('click', startWebcam);

            captureBtn.addEventListener('click', async () => {
              const sid = inputs['studentID'] ? inputs['studentID'].value.trim() : '';
              const githubID = inputs['githubID'] ? inputs['githubID'].value.trim() : '';
              
              if (!sid && !githubID) {
                statusText.textContent = 'Error: Student ID or GitHub ID is required to register.';
                dot.style.background = '#ff6b6b';
                return;
              }

              statusText.textContent = 'Capturing frame...';
              dot.style.background = '#e67e22';
              captureBtn.disabled = true;

              try {
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 240;
                canvas.getContext('2d').drawImage(video, 0, 0);

                const dataUrl = canvas.toDataURL('image/jpeg');
                const base64Image = dataUrl.split(',')[1];

                statusText.textContent = 'Sending biometric payload to core...';
                
                const guest = LoginManager.getGuestSession();
                const ocs_session = window.user;
                const isAuthenticated = ocs_session && ocs_session.role !== 'guest';

                let response;
                if (isAuthenticated) {
                  response = await fetch(`${javaURI}/api/face/register`, {
                    ...fetchOptions,
                    method: 'POST',
                    body: JSON.stringify({ faceData: base64Image })
                  });
                } else {
                  response = await fetch(`${javaURI}/api/face/register/public`, {
                    ...fetchOptions,
                    method: 'POST',
                    body: JSON.stringify({
                      sid: sid,
                      uid: githubID,
                      faceData: base64Image
                    })
                  });
                }

                if (response.ok) {
                  statusText.textContent = 'Registration Complete! Face Synced.';
                  dot.style.background = '#4ecca3';
                  
                  webcamBox.style.borderColor = '#2ecc71';
                  laser.style.background = '#2ecc71';
                  laser.style.boxShadow = '0 0 10px #2ecc71';
                  
                  setTimeout(() => {
                    stopWebcam();
                  }, 1800);
                } else {
                  const errText = await response.text();
                  statusText.textContent = `Sync Error: ${errText || 'Update failed'}`;
                  dot.style.background = '#ff6b6b';
                  captureBtn.disabled = false;
                }
              } catch (err) {
                console.error('Registration failed:', err);
                statusText.textContent = 'Sync Error: Core rejected registration.';
                dot.style.background = '#ff6b6b';
                captureBtn.disabled = false;
              }
            });

            const cleanupInterval = setInterval(() => {
              if (!widget.isConnected) {
                clearInterval(cleanupInterval);
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
              }
            }, 500);

            return widget;
          }
        }
      ],
      theme: uiTheme,
    };
    this.identityFormView = new FormPanel(identityFormConfig);


    /**
     * Update profile panel. Re-render profile panel fields with current profile data.
     */
    /**
     * Update profile panel. Centralized profile update handler.
     * Merges updates into profileData, handles persistence, and refreshes UI.
     * @param {Object} updates - Fields to update (merged into existing profileData)
     * @param {Object} options - Optional persistence hints
     */
    this.updateProfilePanel = async function(updates = {}, options = {}) {
      console.log('updateProfilePanel called with updates:', updates);
      console.log('Current this.profileData before merge:', this.profileData);
      
      // Merge updates into profile data (single source of truth)
      this.profileData = {
        ...this.profileData,
        ...updates,
      };
      
      console.log('this.profileData after merge:', this.profileData);
      
      // Handle persistence based on what fields were updated
      if (updates.name || updates.email || updates.githubID) {
        await this.profileManager.saveIdentity(this.profileData);
        if (options.updateIdentityProgress) {
          await this.profileManager.updateIdentityProgress(true);
        }
      }
      
      
      // Update UI panel with complete profile data
      this.createProfilePanel();
      window._forgePanelCleanup = () => {
        if (this.profilePanelView) {
          this.profilePanelView.destroy();
        }
      };
      
      const panelData = {
        name: this.profileData.name || '—',
        email: this.profileData.email || '—',
        githubID: this.profileData.githubID || '—',
        persona: this.profileData.persona || '—',
        sprite: this.profileData.sprite || '—',
        worldTheme: this.profileData.theme || this.profileData.worldTheme || '—',
        courseName: this.profileData.courseName || '—',
        courseClass: this.profileData.courseClass || '—',
        ...this._getCompletionPanelValues()
      };
      
      console.log('panelData being sent to panel.update:', panelData);
      this.profilePanelView.update(panelData);
    };

    /**
     * Save Course Plan Result
     * Mirrors how persona/profile data is persisted.
     * @param {Object} result
     */
    this.saveCoursePlanResult = async function(result = {}) {
      console.log('saveCoursePlanResult called with:', result);

      const courseClass =
        result.class ||
        result.courseClass ||
        result.selectedClass ||
        result.recommendedClass ||
        result.recommendedClasses?.[0]?.name ||
        result.recommendedClasses?.[0]?.title ||
        result.recommendedClasses?.[0] ||
        '—';

      await this.updateProfilePanel({
        courseClass,
      });
    };

    /**
     * Create profile panel. Ensure the profile StatusPanel is mounted in the DOM.
     */
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

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player,           data: player_data },
      { class: FriendlyNpc,      data: npc_data_startGatekeeper },
      { class: FriendlyNpc,      data: npc_data_identityGatekeeper },
      { class: FriendlyNpc,      data: npc_data_avatarGatekeeper },
      { class: FriendlyNpc,      data: npc_data_worldThemeGatekeeper },
      { class: FriendlyNpc, data: npc_data_courseEnlistmentGatekeeper },
      { class: FriendlyNpc, data: npc_data_personaHallGatekeeper },
    ];

    this._forgeGatekeeperIds = [
      'StartGatekeeper',
      'IdentityGatekeeper',
      'AvatarGatekeeper',
      'WorldThemeGatekeeper',
      'CourseEnlistmentGatekeeper', 
      'PersonaHallGatekeeper',

    ];
  }

  /**
   * Level initialization. Binds gatekeeper reactions and stores live NPC references.
   */
  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const gatekeepers = objects.filter((obj) => this._forgeGatekeeperIds?.includes(obj?.spriteData?.id));
    this._rebindMissingGatekeeperReactions(gatekeepers);

    console.log('[Forge] gatekeeper reactions rebound:', gatekeepers.map((g) => ({
      id: g?.spriteData?.id,
      hasReaction: typeof g?.reaction === 'function',
      hasSpriteReaction: typeof g?.spriteData?.reaction === 'function',
    })));

    this._forgeGatekeeperObjects = gatekeepers;
    this._activeZoneGatekeeperId = null;
  }

  /**
   * Rebind reactions. Copy spriteData.reaction onto gatekeeper if the engine dropped the binding.
   * @private
   */
  _rebindMissingGatekeeperReactions(gatekeepers) {
    gatekeepers.forEach((gatekeeper) => {
      if (typeof gatekeeper?.reaction !== 'function' && typeof gatekeeper?.spriteData?.reaction === 'function') {
        gatekeeper.reaction = gatekeeper.spriteData.reaction;
      }
    });
  }

  /**
   * Get object center. Return the {x, y} mid-point of a game object's bounding box.
   * @private
   */
  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  /**
   * Alert distance px. Compute the pixel alert radius for a gatekeeper.
   * @private
   */
  _getGatekeeperAlertDistancePx(gatekeeper) {
    const alertMultiplier = gatekeeper?._alertDistanceMultiplier ?? gatekeeper?.spriteData?.alertDistance ?? 1.25;
    if ((gatekeeper?.width || 0) > 0) {
      return gatekeeper.width * alertMultiplier;
    }
    return (gatekeeper?.interactDistance || 120) * 1.5;
  }

  /**
   * Find nearest gatekeeper. Return the closest in-zone gatekeeper relative to the player.
   * @private
   */
  _findNearestGatekeeperInZone(player, gatekeepers) {
    const playerCenter = this._getObjectCenter(player);
    const collisionIds = player?.state?.collisionEvents || [];

    let nearestGatekeeper = null;
    let nearestDistance = Infinity;

    for (const gatekeeper of gatekeepers) {
      // Skip until sprite is loaded — width===0 means the fallback alert
      // distance (180 px) is active and can catch the player at spawn.
      if ((gatekeeper?.width || 0) === 0) continue;

      const gatekeeperCenter = this._getObjectCenter(gatekeeper);
      const distance = Math.hypot(playerCenter.x - gatekeeperCenter.x, playerCenter.y - gatekeeperCenter.y);
      const inCollision = collisionIds.includes(gatekeeper?.spriteData?.id);
      const inZone = inCollision || distance < this._getGatekeeperAlertDistancePx(gatekeeper);

      if (inZone && distance < nearestDistance) {
        nearestGatekeeper = gatekeeper;
        nearestDistance = distance;
      }
    }

    return nearestGatekeeper;
  }

  /**
   * Sync zone alert. Show or clear the zone alert banner based on nearest gatekeeper.
   * @private
   */
  _syncGatekeeperZoneAlert(nearestGatekeeper) {
    if (nearestGatekeeper) {
      const zoneMessage = nearestGatekeeper.spriteData?.zoneMessage || 'Press E to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneGatekeeperId = nearestGatekeeper.spriteData?.id || null;
      return;
    }

    if (this._activeZoneGatekeeperId) {
      this.clearZoneAlert();
      this._activeZoneGatekeeperId = null;
    }
  }

  /**
   * Per-frame update. Detect player proximity to gatekeepers and sync zone alerts.
   */
  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._forgeGatekeeperObjects)) return;

    const nearestGatekeeper = this._findNearestGatekeeperInZone(player, this._forgeGatekeeperObjects);
    this._syncGatekeeperZoneAlert(nearestGatekeeper);
  }

  /**
   * Show the reset profile modal with three choices:
   *   • Clear Local Only  — wipes localStorage, preserves server data
   *   • Clear All         — wipes localStorage + server game profile
   *   • Cancel            — dismisses with no action
   */
  _showResetModal() {
    const level = this;

    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'background:rgba(0,0,0,0.72)',
      'display:flex', 'align-items:center', 'justify-content:center',
    ].join(';');

    const btnBase = [
      'display:block', 'width:100%', 'padding:10px 0',
      'border-radius:6px', 'border:1px solid var(--ocs-game-accent,#4ecca3)',
      'font-family:"Courier New",monospace', 'font-size:0.92em',
      'cursor:pointer', 'transition:opacity 0.15s',
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
      'background:var(--ocs-game-panel-bg,#0d0d1a)',
      'border:1.5px solid var(--ocs-game-accent,#4ecca3)',
      'padding:28px 32px', 'border-radius:10px',
      'font-family:"Courier New",monospace',
      'color:var(--ocs-game-text,#e0e0e0)',
      'max-width:380px', 'width:90%', 'box-sizing:border-box',
    ].join(';');

    box.innerHTML = `
      <div style="font-size:1.1em;font-weight:bold;margin-bottom:12px;">🔄 Reset Profile</div>
      <div style="font-size:0.88em;line-height:1.6;margin-bottom:20px;">
        <b>Clear Local Only</b> — removes data on this device.<br>
        Server backup is preserved for recovery on next login.<br><br>
        <b>Clear All</b> — removes local data <em>and</em> server data.<br>
        This cannot be undone.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="ocs-reset-local"
          style="${btnBase}background:var(--ocs-game-surface-alt,#1a1a2e);color:var(--ocs-game-text,#e0e0e0);">
          Clear Local Only
        </button>
        <button id="ocs-reset-all"
          style="${btnBase}background:#3d0000;color:#ff6b6b;border-color:#ff6b6b;">
          Clear All (Local + Server)
        </button>
        <button id="ocs-reset-cancel"
          style="${btnBase}background:transparent;color:var(--ocs-game-text,#aaa);border-color:#444;">
          Cancel
        </button>
      </div>`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector('#ocs-reset-local').onclick = () => {
      overlay.remove();
      LocalProfile.clearAll();
      GameLevelCsPathIdentity.clearSharedState();
      level.showToast('✦ Local profile cleared — reloading...');
      setTimeout(() => window.location.reload(), 1000);
    };

    box.querySelector('#ocs-reset-all').onclick = async () => {
      overlay.remove();
      try {
        await level.profileManager.clear(); // clears local + backend + dispatches ocs:profile-cleared
        level.showToast('✦ Full profile reset — reloading...');
      } catch (err) {
        console.error('ProfileManager: full clear failed', err);
        level.showToast('Reset failed — check console.');
        return;
      }
      setTimeout(() => window.location.reload(), 1000);
    };

    box.querySelector('#ocs-reset-cancel').onclick = () => overlay.remove();
  }

  /**
   * Level teardown. Remove toast and zone alert DOM elements on level exit.
   */
  destroy() {
    this.clearZoneAlert();
    this.present?.destroy();
    if (this.profilePanelView) {
      this.profilePanelView.destroy();
    }
  }
}

export default GameLevelCsPath0Forge;