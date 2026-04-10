// Imports: Level objects and UI helpers.
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import ProfileManager from '../pages/home-gamified/ProfileManager.js';
import GameLevelCsPath0Forge from './GameLevelCsPath0Forge.js';

/**
 * GameLevel CS Pathway - Mission Tools
 */
class GameLevelCsPath3Mission {
  static levelId = 'mission-tools';
  static displayName = 'Mission Tools';

  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/gamify/pathway/csse/bg2/mission-tools.png";
    const bg_data = {
        name: GameLevelCsPath3Mission.displayName,
        greeting: "Welcome to the CS pathway! This quest will prepare you for your mission ahead by introducing your essential tools and resources!",
        src: image_src,
    };

    // Theme transfer:
    // Read the saved world theme from CS Forge, then translate it to the
    // matching Mission Tools background so the player's choice carries over
    // without forcing the exact same image.
    this.profileManager = new ProfileManager();
    this.getBackgroundObject = () => gameEnv.gameObjects.find((obj) =>
      obj?.data?.name === GameLevelCsPath0Forge.displayName
    );

    // Load the Mission Tools theme catalog so we can match the saved theme
    // name to the correct bg2 asset.
    this.getMissionToolsThemeCatalog = async () => {
      if (this.missionToolsThemeCatalog) {
        return this.missionToolsThemeCatalog;
      }

      try {
        const response = await fetch(`${path}/images/gamify/pathway/csse/bg2/index.json`, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const manifest = await response.json();
        this.missionToolsThemeCatalog = Array.isArray(manifest)
          ? manifest.map((entry) => ({
              name: entry.name,
              src: `${path}/images/gamify/pathway/csse/bg2/${entry.src}`,
              compatibleSprites: Array.isArray(entry.compatibleSprites) ? entry.compatibleSprites : [],
            }))
          : [];
      } catch (error) {
        console.warn('Mission Tools: failed to load bg2 theme catalog', error);
        this.missionToolsThemeCatalog = [];
      }

      return this.missionToolsThemeCatalog;
    };

    // Prefer an exact theme-name match, then fall back to any shared sprite
    // compatibility so theme families stay consistent across levels.
    this.resolveMissionToolsTheme = (selectedTheme, catalog) => {
      if (!selectedTheme || !Array.isArray(catalog) || catalog.length === 0) {
        return null;
      }

      const selectedName = String(selectedTheme.name || '').toLowerCase();
      const byName = catalog.find((theme) => String(theme.name || '').toLowerCase() === selectedName);
      if (byName) {
        return byName;
      }

      const selectedSprites = Array.isArray(selectedTheme.compatibleSprites)
        ? selectedTheme.compatibleSprites
        : [];
      if (selectedSprites.length > 0) {
        const bySprites = catalog.find((theme) =>
          Array.isArray(theme.compatibleSprites)
          && theme.compatibleSprites.some((sprite) => selectedSprites.includes(sprite))
        );
        if (bySprites) {
          return bySprites;
        }
      }

      return null;
    };

    // Only swap the live background after the image finishes loading.
    // This keeps the level on the default background if the themed asset is
    // missing or broken.
    this.applyMissionToolsTheme = (themeMeta) => {
      if (!themeMeta?.src) {
        return;
      }

      const bgObj = this.getBackgroundObject();
      const candidateImage = new Image();

      candidateImage.onload = () => {
        bg_data.src = themeMeta.src;

        if (bgObj?.data) {
          bgObj.data.src = themeMeta.src;
        }

        if (bgObj) {
          bgObj.image = candidateImage;
          bgObj.spriteReady = true;
          bgObj.resize?.();
        }
      };

      candidateImage.onerror = (e) => {
        console.warn('Mission Tools: failed to load themed background, keeping default', themeMeta.src, e);
      };

      candidateImage.src = themeMeta.src;
    };

    this.profileManager.initialize().then(async (restored) => {
      const selectedTheme = restored?.profileData?.themeMeta;
      if (!selectedTheme) {
        return;
      }

      const catalog = await this.getMissionToolsThemeCatalog();
      const mappedTheme = this.resolveMissionToolsTheme(selectedTheme, catalog);
      if (!mappedTheme) {
        return;
      }

      // Delay the swap until the level objects exist, otherwise the background
      // object lookup can run before the scene is mounted.
      setTimeout(() => this.applyMissionToolsTheme(mappedTheme), 300);
    }).catch((err) => {
      console.warn('Mission Tools: ProfileManager initialization failed', err);
    });
    
    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/gamify/pathway/csse/player/minimalist.png";
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
      src: path + '/images/gamify/pathway/csse/npc/gatekeeper2.png',
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

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
    ];
  }

}

export default GameLevelCsPath3Mission;