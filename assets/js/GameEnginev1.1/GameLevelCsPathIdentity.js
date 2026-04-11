import ProfileManager from '../pages/home-gamified/ProfileManager.js';

/**
 * Shared identity behavior for CS Path levels.
 * Handles profile restore, avatar transfer, and themed background transfer.
 */
class GameLevelCsPathIdentity {
  constructor(gameEnv, { levelDisplayName, logPrefix }) {
    // Keep a single source of environment truth for subclasses.
    this.gameEnv = gameEnv;
    this.levelDisplayName = levelDisplayName;
    this.logPrefix = logPrefix || levelDisplayName || 'CS Path Level';

    // Shared persistence entry point for all inheriting levels.
    this.profileManager = new ProfileManager();
  }

  getLevelDimensions() {
    // Normalize common viewport/path values each level needs.
    return {
      width: this.gameEnv.innerWidth,
      height: this.gameEnv.innerHeight,
      path: this.gameEnv.path,
    };
  }

  getBackgroundObject() {
    // Backgrounds are identified by display name across CS Path levels.
    return this.gameEnv.gameObjects.find((obj) =>
      obj?.data?.name === this.levelDisplayName
    );
  }

  getPlayerObject() {
    // The shared player identity uses a stable ID across the pathway.
    return this.gameEnv.gameObjects.find((obj) =>
      obj?.data?.id === 'Minimalist_Identity' || obj?.id === 'Minimalist_Identity'
    );
  }

  getAvatarMovementConfig(spriteMeta = {}) {
    // Build animation frame mapping from saved sprite metadata.
    const rows = Math.max(1, Number(spriteMeta.rows || 1));
    const columns = Math.max(1, Number(spriteMeta.cols || 1));
    const preset = spriteMeta.movementPreset || (rows >= 4 ? 'four-row-8way' : 'single-row');

    if (preset === 'two-row-8way') {
      // Two-row packs fake 8-way movement using mirror + rotation.
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
      // One-row packs reuse the same strip in all directions.
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

  // Four-row style packs get directional rows with slight diagonal rotation.
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
  }

  applyAvatarOptions(options = {}) {
    // Only apply when the live player object is available in the scene.
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
      // Rehydrate movement + scale from saved avatar metadata.
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
        // Recompute canvas sizing after sprite-sheet swap.
        playerObj.resize();
      } catch (err) {
        console.warn(`${this.logPrefix}: error resizing transferred character sprite`, err);
      }
    };

    candidateSheet.onerror = (e) => {
      console.warn(`${this.logPrefix}: failed to load transferred character sprite, keeping default`, spriteSrc, e);
    };

    candidateSheet.src = spriteSrc;
  }

  async loadThemeCatalog(manifestUrl, assetPrefix) {
    // Fetch and normalize a level-specific theme manifest.
    try {
      const response = await fetch(manifestUrl, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const manifest = await response.json();
      if (!Array.isArray(manifest)) {
        return [];
      }

      // Convert manifest entries into full asset metadata for matching.
      return manifest.map((entry) => ({
        name: entry.name,
        src: `${assetPrefix}${entry.src}`,
        compatibleSprites: Array.isArray(entry.compatibleSprites) ? entry.compatibleSprites : [],
      }));
    } catch (error) {
      console.warn(`${this.logPrefix}: failed to load theme catalog`, error);
      return [];
    }
  }

  resolveThemeSelection(selectedTheme, catalog) {
    // Prefer a direct theme-name match from saved profile data.
    if (!selectedTheme || !Array.isArray(catalog) || catalog.length === 0) {
      return null;
    }

    const selectedName = String(selectedTheme.name || '').toLowerCase();
    const byName = catalog.find((theme) => String(theme.name || '').toLowerCase() === selectedName);
    if (byName) {
      return byName;
    }

    // Fallback: match by compatible sprite families across level manifests.
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
  }

  applyBackgroundTheme(themeMeta, bgData) {
    // Safe background swap: preload first, then mutate scene state.
    if (!themeMeta?.src) {
      return;
    }

    // Update config data immediately so late-mounted backgrounds still inherit
    // the restored theme source.
    bgData.src = themeMeta.src;

    const candidateImage = new Image();

    const applyToLiveBackground = (remainingAttempts = 20) => {
      const bgObj = this.getBackgroundObject();
      if (!bgObj) {
        if (remainingAttempts > 0) {
          setTimeout(() => applyToLiveBackground(remainingAttempts - 1), 100);
        }
        return;
      }

      if (bgObj?.data) {
        bgObj.data.src = themeMeta.src;
      }

      bgObj.image = candidateImage;
      bgObj.spriteReady = true;
      bgObj.resize?.();
    };

    candidateImage.onload = () => {
      // Keep source-of-truth bg data and live object in sync.
      applyToLiveBackground();
    };

    candidateImage.onerror = (e) => {
      console.warn(`${this.logPrefix}: failed to load themed background, keeping default`, themeMeta.src, e);
    };

    candidateImage.src = themeMeta.src;
  }

  restoreIdentitySelections({ bgData, themeManifestUrl, themeAssetPrefix, delayMs = 300 }) {
    // One shared restore pipeline for all inherited CS Path levels.
    this.profileManager.initialize().then(async (restored) => {
      // Persist profile on the instance for any level-specific consumers.
      this.profileData = { ...restored?.profileData };

      const selectedTheme = restored?.profileData?.themeMeta;
      if (selectedTheme) {
        const catalog = await this.loadThemeCatalog(themeManifestUrl, themeAssetPrefix);
        const mappedTheme = this.resolveThemeSelection(selectedTheme, catalog);
        const themeToApply = mappedTheme || (selectedTheme?.src ? selectedTheme : null);
        if (themeToApply) {
          // Delay application until scene objects are mounted and discoverable.
          setTimeout(() => this.applyBackgroundTheme(themeToApply, bgData), delayMs);
        }
      }

      const selectedSprite = restored?.profileData?.spriteMeta;
      if (selectedSprite) {
        // Mirror the same delayed mount strategy for player sprite restore.
        setTimeout(() => this.applyAvatarOptions({ sprite: selectedSprite }), delayMs);
      }
    }).catch((err) => {
      console.warn(`${this.logPrefix}: ProfileManager initialization failed`, err);
    });
  }
}

export default GameLevelCsPathIdentity;
