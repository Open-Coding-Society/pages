import ProfileManager from '/assets/js/projects/cs-pathway-game/model/ProfileManager.js';
import Present from './Present.js';

/**
 * Shared identity behavior for CS Path levels.
 * Handles profile restore, avatar transfer, and themed background transfer.
 */
class GameLevelCsPathIdentity {
  static themeCatalogCache = new Map();
  static sharedProfileStateReady = null;
  static sharedProfileStateValue = null;
  static sharedProfileStateLoaded = false;

  constructor(gameEnv, { levelDisplayName, logPrefix }) {
    // Keep a single source of environment truth for subclasses.
    this.gameEnv = gameEnv;
    this.levelDisplayName = levelDisplayName;
    this.logPrefix = logPrefix || levelDisplayName || 'CS Path Level';

    // Shared persistence entry point for all inheriting levels.
    this.profileManager = new ProfileManager();
    this.profileReady = this.getSharedProfileState();

    // Silent background preloading for assets
    this._assetTracking = {
      playerSrc: null,
      backgroundSrc: null,
    };

    this._loadingState = {
      active: false,
      pending: 0,
      shownAt: 0,
      hideTimer: null,
      overlay: null,
    };

    this.present = new Present(this, {
      toastDuration: 2200,
      ignoreToasts: ['Press E to interact'],
      isActiveLevel: () => this.isActiveLevel(),
    });

    this.showToast = (message) => this.present.toast(message);
    this.setZoneAlert = (message) => this.present.alerts(message);
    this.clearZoneAlert = () => this.present.clearAlerts();
    this.panel = (message) => this.present.panel(message);
    this.score = (message) => this.present.score(message);
    this.clearPanel = () => this.present.clearPanel();
    this.clearScore = () => this.present.clearScore();
  }

  isActiveLevel() {
    const currentLevel = this.gameEnv?.currentLevel;
    const gameLevel = this.gameEnv?.gameLevel;
    return currentLevel === this || gameLevel === this;
  }

  getSharedProfileState(forceRefresh = false) {
    if (!forceRefresh) {
      if (GameLevelCsPathIdentity.sharedProfileStateLoaded) {
        return Promise.resolve(GameLevelCsPathIdentity.sharedProfileStateValue);
      }

      if (GameLevelCsPathIdentity.sharedProfileStateReady) {
        return GameLevelCsPathIdentity.sharedProfileStateReady;
      }
    }

    const readyPromise = this.profileManager.initialize().then((restored) => {
      GameLevelCsPathIdentity.sharedProfileStateValue = restored || null;
      GameLevelCsPathIdentity.sharedProfileStateLoaded = true;
      return GameLevelCsPathIdentity.sharedProfileStateValue;
    }).catch((error) => {
      GameLevelCsPathIdentity.sharedProfileStateReady = null;
      throw error;
    });

    GameLevelCsPathIdentity.sharedProfileStateReady = readyPromise;
    return readyPromise;
  }

  beginLoadingScreen() {
    if (this._loadingState.active) {
      return;
    }

    this._loadingState.active = true;
    this._loadingState.shownAt = Date.now();

    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const host = this.getLoadingHostElement();
    const isBodyHost = host === document.body;

    if (!isBodyHost) {
      const hostPosition = window.getComputedStyle(host).position;
      if (hostPosition === 'static') {
        host.style.position = 'relative';
      }
    }

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-live', 'polite');
    overlay.style.cssText = [
      `position:${isBodyHost ? 'fixed' : 'absolute'}`,
      'inset:0',
      'z-index:999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'background:#070b16',
      'color:#fff',
      'font-family:system-ui, sans-serif',
      'pointer-events:auto',
    ].join(';');

    overlay.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:14px; padding:24px 28px; border:1px solid rgba(255,255,255,0.15); border-radius:18px; background:rgba(12, 18, 35, 0.86); box-shadow:0 20px 60px rgba(0,0,0,0.35); min-width:220px;">
        <div style="width:44px; height:44px; border-radius:50%; border:4px solid rgba(255,255,255,0.18); border-top-color:#7dd3fc; animation:cs-path-spin 0.8s linear infinite;"></div>
        <div style="font-size:16px; font-weight:700; letter-spacing:0.02em;">Loading level</div>
        <div style="font-size:13px; opacity:0.8; text-align:center; max-width:180px; line-height:1.35;">Preparing your path and restoring your character</div>
      </div>
    `;

    if (!document.getElementById('cs-path-loading-spin-style')) {
      const style = document.createElement('style');
      style.id = 'cs-path-loading-spin-style';
      style.textContent = '@keyframes cs-path-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head?.appendChild(style);
    }

    host.appendChild(overlay);
    this._loadingState.overlay = overlay;
  }

  getLoadingHostElement() {
    if (typeof document === 'undefined') {
      return null;
    }

    const canvas = this.gameEnv?.canvas || this.gameEnv?.gameCanvas;
    if (canvas?.parentElement) {
      return canvas.parentElement;
    }

    return document.body;
  }

  queueLoadingWork() {
    this.beginLoadingScreen();
    this._loadingState.pending += 1;
  }

  finishLoadingWork() {
    if (this._loadingState.pending > 0) {
      this._loadingState.pending -= 1;
    }

    if (this._loadingState.pending > 0) {
      return;
    }

    const hideOverlay = () => {
      if (this._loadingState.overlay?.parentNode) {
        this._loadingState.overlay.parentNode.removeChild(this._loadingState.overlay);
      }

      this._loadingState.overlay = null;
      this._loadingState.active = false;
      this._loadingState.hideTimer = null;
    };

    if (this._loadingState.hideTimer) {
      clearTimeout(this._loadingState.hideTimer);
    }

    hideOverlay();
  }

  primeAssetGate({ playerSrc, backgroundSrc }) {
    this._assetTracking.playerSrc = playerSrc || null;
    this._assetTracking.backgroundSrc = backgroundSrc || null;

    if (playerSrc || backgroundSrc) {
      this.beginLoadingScreen();
    }

    // Silently preload images in the background
    if (playerSrc) {
      this.preloadTrackedAsset('player', playerSrc);
    }
    if (backgroundSrc) {
      this.preloadTrackedAsset('background', backgroundSrc);
    }
  }

  preloadTrackedAsset(kind, src) {
    if (!src) return;

    this.queueLoadingWork();

    const img = new Image();
    img.onload = () => {
      // Silent success - image is cached for faster rendering
      this.finishLoadingWork();
    };
    img.onerror = () => {
      console.warn(`${this.logPrefix}: failed to preload ${kind} asset`, src);
      this.finishLoadingWork();
    };
    img.src = src;
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

  applyAvatarOptions(options = {}, remainingAttempts = 20) {
    return new Promise((resolve) => {
      const attemptApply = (attemptNumber) => {
        // Only apply when the live player object is available in the scene.
        const playerObj = this.getPlayerObject();
        if (!playerObj) {
          if (attemptNumber > 0) {
            setTimeout(() => attemptApply(attemptNumber - 1), 50);
          } else {
            resolve(false);
          }
          return;
        }

        const spriteMeta = typeof options.sprite === 'object'
          ? options.sprite
          : options.spriteMeta || null;

        const spriteSrc = spriteMeta?.src || spriteMeta?.rawSrc;
        if (!spriteSrc) {
          resolve(false);
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

          resolve(true);
        };

        candidateSheet.onerror = (e) => {
          console.warn(`${this.logPrefix}: failed to load transferred character sprite, keeping default`, spriteSrc, e);
          resolve(false);
        };

        candidateSheet.src = spriteSrc;
      };

      attemptApply(remainingAttempts);
    });
  }

  async loadThemeCatalog(manifestUrl, assetPrefix) {
    // Fetch and normalize a level-specific theme manifest.
    const cacheKey = `${manifestUrl}|${assetPrefix}`;
    const cachedCatalog = GameLevelCsPathIdentity.themeCatalogCache.get(cacheKey);
    if (cachedCatalog) {
      return cachedCatalog;
    }

    try {
      const response = await fetch(manifestUrl, { cache: 'force-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const manifest = await response.json();
      if (!Array.isArray(manifest)) {
        return [];
      }

      // Convert manifest entries into full asset metadata for matching.
      const catalog = manifest.map((entry) => ({
        name: entry.name,
        src: `${assetPrefix}${entry.src}`,
        compatibleSprites: Array.isArray(entry.compatibleSprites) ? entry.compatibleSprites : [],
      }));

      GameLevelCsPathIdentity.themeCatalogCache.set(cacheKey, catalog);
      return catalog;
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

  destroy() {
    this.present?.destroy();
  }

  applyBackgroundTheme(themeMeta, bgData) {
    return new Promise((resolve) => {
      // Safe background swap: preload first, then mutate scene state.
      if (!themeMeta?.src) {
        resolve(false);
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
          } else {
            resolve(false);
          }
          return;
        }

        if (bgObj?.data) {
          bgObj.data.src = themeMeta.src;
        }

        bgObj.image = candidateImage;
        bgObj.spriteReady = true;
        bgObj.resize?.();
        resolve(true);
      };

      candidateImage.onload = () => {
        // Keep source-of-truth bg data and live object in sync.
        applyToLiveBackground();
      };

      candidateImage.onerror = (e) => {
        console.warn(`${this.logPrefix}: failed to load themed background, keeping default`, themeMeta.src, e);
        resolve(false);
      };

      candidateImage.src = themeMeta.src;
    });
  }

  restoreIdentitySelections({ bgData, themeManifestUrl, themeAssetPrefix, delayMs = 0 }) {
    // One shared restore pipeline for all inherited CS Path levels.
    this.queueLoadingWork();

    this.profileReady.then(async (restored) => {
      // Persist profile on the instance for any level-specific consumers.
      this.profileData = { ...restored?.profileData };

      const restoreTasks = [];
      const themeCatalogPromise = this.loadThemeCatalog(themeManifestUrl, themeAssetPrefix);

      const selectedTheme = restored?.profileData?.themeMeta;
      if (selectedTheme) {
        const catalog = await themeCatalogPromise;
        const mappedTheme = this.resolveThemeSelection(selectedTheme, catalog);
        const themeToApply = mappedTheme || (selectedTheme?.src ? selectedTheme : null);
        if (themeToApply) {
          if (delayMs > 0) {
            restoreTasks.push(new Promise((resolve) => {
              setTimeout(() => {
                this.applyBackgroundTheme(themeToApply, bgData).then(resolve);
              }, delayMs);
            }));
          } else {
            restoreTasks.push(this.applyBackgroundTheme(themeToApply, bgData));
          }
        }
      }

      const selectedSprite = restored?.profileData?.spriteMeta;
      if (selectedSprite) {
        if (delayMs > 0) {
          restoreTasks.push(new Promise((resolve) => {
            setTimeout(() => {
              this.applyAvatarOptions({ sprite: selectedSprite }).then(resolve);
            }, delayMs);
          }));
        } else {
          restoreTasks.push(this.applyAvatarOptions({ sprite: selectedSprite }));
        }
      }

      await Promise.all(restoreTasks);
      this.finishLoadingWork();
    }).catch((err) => {
      console.warn(`${this.logPrefix}: ProfileManager initialization failed`, err);
      this.finishLoadingWork();
    });
  }

}

export default GameLevelCsPathIdentity;
