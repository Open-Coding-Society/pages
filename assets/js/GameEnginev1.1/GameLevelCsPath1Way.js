// Imports: Level objects and UI helpers.
import GamEnvBackground from './essentials/GameEnvBackground.js';
import Player from './essentials/Player.js';
import Npc from './essentials/Npc.js';
import ProfileManager from '../pages/home-gamified/ProfileManager.js';
import GameLevelCsPath0Forge from './GameLevelCsPath0Forge.js';

/**
 * GameLevel CS Pathway - Wayfinding World
 */
class GameLevelCsPath1Way {
  static levelId = 'wayfinding-world';
  static displayName = 'Wayfinding World';

  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/gamify/pathway/csse/bg1/wayfinding-world.png";
    const bg_data = {
        name: GameLevelCsPath1Way.displayName,
        greeting: "Welcome to the CSSE pathway! This quest will establish your bearings in the Wayfinding World, where you'll discover your course, uncover your strengths, and enrich your persona!",
        src: image_src,
    };

    // Theme transfer:
    // Read the saved world theme from CS Forge, then translate it to the
    // matching Wayfinding World background so the player's choice carries over
    // without forcing the exact same image.
    this.profileManager = new ProfileManager();
    this.getBackgroundObject = () => gameEnv.gameObjects.find((obj) =>
      obj?.data?.name === GameLevelCsPath1Way.displayName
    );

    // Character transfer:
    // Reuse the exact same selected sprite in Wayfinding World so the player's
    // character stays consistent across both levels without any remapping.
    this.getPlayerObject = () => gameEnv.gameObjects.find((obj) =>
      obj?.data?.id === 'Minimalist_Identity' || obj?.id === 'Minimalist_Identity'
    );

    // Rebuild the directional frame map from the saved sprite metadata so the
    // restored character keeps its original animation layout.
    this.getAvatarMovementConfig = (spriteMeta = {}) => {
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

    // Load the exact saved character sprite after the player object mounts.
    // The image is preloaded first so we only swap the sprite once the file is
    // confirmed valid, which avoids replacing the player with a broken asset.
    this.applyAvatarOptions = (options = {}) => {
      const playerObj = this.getPlayerObject();
      if (!playerObj) {
        return;
      }

      const spriteMeta = typeof options.sprite === 'object'
        ? options.sprite
        : options.spriteMeta || null;

      const spriteSrc = spriteMeta?.src || spriteMeta?.rawSrc;
      if (!spriteSrc) {
        return;
      }

      const normalizedSpriteMeta = {
        ...spriteMeta,
        src: spriteSrc,
      };

      const candidateSheet = new Image();
      candidateSheet.onload = () => {
        const movementConfig = this.getAvatarMovementConfig(normalizedSpriteMeta);
        const scaleFactor = Number(normalizedSpriteMeta.scaleFactor || 5);

        playerObj.data.src = spriteSrc;
        playerObj.data.SCALE_FACTOR = scaleFactor;
        playerObj.scaleFactor = scaleFactor;

        Object.assign(playerObj.spriteData, movementConfig, {
          src: spriteSrc,
          SCALE_FACTOR: scaleFactor,
          pixels: {
            width: candidateSheet.naturalWidth,
            height: candidateSheet.naturalHeight,
          },
        });

        playerObj.spriteSheet = candidateSheet;
        playerObj.spriteReady = true;

        try {
          playerObj.resize();
        } catch (err) {
          console.warn('Wayfinding World: error resizing transferred character sprite', err);
        }
      };

      candidateSheet.onerror = (e) => {
        console.warn('Wayfinding World: failed to load transferred character sprite, keeping default', spriteSrc, e);
      };

      candidateSheet.src = spriteSrc;
    };

    // Load the Wayfinding World theme catalog so we can match the saved theme
    // name to the correct bg1 asset.
    this.getWayfindingThemeCatalog = async () => {
      if (this.wayfindingThemeCatalog) {
        return this.wayfindingThemeCatalog;
      }

      try {
        const response = await fetch(`${path}/images/gamify/pathway/csse/bg1/index.json`, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const manifest = await response.json();
        this.wayfindingThemeCatalog = Array.isArray(manifest)
          ? manifest.map((entry) => ({
              name: entry.name,
              src: `${path}/images/gamify/pathway/csse/bg1/${entry.src}`,
              compatibleSprites: Array.isArray(entry.compatibleSprites) ? entry.compatibleSprites : [],
            }))
          : [];
      } catch (error) {
        console.warn('Wayfinding World: failed to load bg1 theme catalog', error);
        this.wayfindingThemeCatalog = [];
      }

      return this.wayfindingThemeCatalog;
    };

    // Prefer an exact theme-name match, then fall back to any shared sprite
    // compatibility so theme families stay consistent across levels.
    this.resolveWayfindingTheme = (selectedTheme, catalog) => {
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
    this.applyWayfindingTheme = (themeMeta) => {
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
        console.warn('Wayfinding World: failed to load themed background, keeping default', themeMeta.src, e);
      };

      candidateImage.src = themeMeta.src;
    };

    this.profileManager.initialize().then(async (restored) => {
      // Keep a local copy of the restored profile so both transfer flows can
      // read from the same saved state in this level.
      this.profileData = { ...restored?.profileData };

      const selectedTheme = restored?.profileData?.themeMeta;
      if (selectedTheme) {
        const catalog = await this.getWayfindingThemeCatalog();
        const mappedTheme = this.resolveWayfindingTheme(selectedTheme, catalog);
        if (mappedTheme) {
          // Delay the swap until the level objects exist, otherwise the background
          // object lookup can run before the scene is mounted.
          setTimeout(() => this.applyWayfindingTheme(mappedTheme), 300);
        }
      }

      const selectedSprite = restored?.profileData?.spriteMeta;
      if (selectedSprite) {
        // Keep the exact same character selection across both CSSE levels.
        // The saved sprite metadata already contains everything needed to
        // reconstruct the player's appearance here.
        setTimeout(() => this.applyAvatarOptions({ sprite: selectedSprite }), 300);
      }
    }).catch((err) => {
      console.warn('Wayfinding World: ProfileManager initialization failed', err);
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