// Imports: Level objects and UI helpers.
import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

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

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg1/wayfinding-world-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath1Way.displayName,
        greeting: "Welcome to the CSSE pathway! This quest will establish your bearings in the Wayfinding World, where you'll discover your course, uncover your strengths, and enrich your persona!",
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
      ...(reaction ? { reaction } : {}),
      ...(interact ? { interact } : {}),
    });

    const npc_data_codeHubGatekeeper = createGatekeeperData({
      id: 'CodeHubGatekeeper',
      greeting: 'Welcome to the Code Hub! Choose what you want to explore first!',
      position: codeHubGatekeeperPos,
    });

    const npc_data_personalEnrichmentGatekeeper = createGatekeeperData({
      id: 'PersonalEnrichmentGatekeeper',
      greeting: 'Welcome to Personal Enrichment! Build habits, curiosity, and real-world growth.',
      position: personalEnrichmentGatekeeperPos,
    });

    const npc_data_skillPassportGatekeeper = createGatekeeperData({
      id: 'SkillPassportGatekeeper',
      greeting: 'Welcome to Skill Passport! Track your progress and collect your coding milestones.',
      position: skillPassportGatekeeperPos,
    });

    const npc_data_courseEnlistGatekeeper = createGatekeeperData({
      id: 'CourseEnlistGatekeeper',
      greeting: 'Welcome to Course Enlist! Choose your next class and map your pathway.',
      position: courseEnlistGatekeeperPos,
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

}

export default GameLevelCsPath1Way;