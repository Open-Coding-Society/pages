/**
 * ProfileManager - MODEL Layer
 * 
 * Unified profile persistence manager for game levels.
 * Follows MVC architecture by separating data persistence from view/controller.
 * 
 * Supports multiple profile backends:
 * - localProfile.js: temporary users (localStorage, no auth, full CRUD)
 * - persistentProfile.js: Teacher, Student, or Follower users (API backend, protected identity)
 * 
 * Profile Lookup Strategy:
 * 1. Check if user is authenticated
 * 2. If authenticated: Use persistentProfile (backend API)
 * 3. If temporary: Use localProfile (localStorage)
 * 4. Support migration: temporary → persistent when user logs in
 * 
 * Usage in GameLevelCssePath (View/Controller):
 *   import ProfileManager from '/assets/js/projects/cs-pathway-game/model/ProfileManager.js';
 *   
 *   constructor(gameEnv) {
 *     this.profileManager = new ProfileManager();
 *     await this.profileManager.initialize(); // Note: now async!
 *     const state = this.profileManager.getRestoredState();
 *     // Apply state to your game...
 *   }
 * 
 * @class ProfileManager
 */

import LocalProfile from '/assets/js/projects/cs-pathway-game/model/localProfile.js';
import PersistentProfile from '/assets/js/projects/cs-pathway-game/model/persistentProfile.js';

class ProfileManager {
  constructor() {
    this.initialized = false;
    this.isAuthenticated = false;
    this.backend = null; // Will be LocalProfile or PersistentProfile
    this.restoredState = null;
  }

  /**
   * Initialize profile system using localStorage-first strategy.
   *
   * Priority:
   *   1. Always load from localStorage immediately (instant, source of truth)
   *   2. Check authentication (async)
   *   3. If authenticated + localStorage empty → recover from backend
   *   4. If authenticated + localStorage has data → async-sync to backend (best-effort)
   *
   * localStorage is ALWAYS the authoritative source after initialization.
   * Backend is analytics copy + cross-device recovery only.
   *
   * @returns {Promise<Object|null>} Restored state { profileData, identityState } or null
   */
  async initialize() {
    if (this.initialized) {
      console.warn('ProfileManager: already initialized');
      return this.restoredState;
    }

    this.initialized = true;
    // localStorage is always the primary backend for reads/writes
    this.backend = LocalProfile;

    // ── STEP 1: Load from localStorage (instant) ──────────────────────────
    const localData = LocalProfile.getFlatProfile();

    // ── STEP 2: Check authentication status (async) ───────────────────────
    this.isAuthenticated = await PersistentProfile.isAuthenticated();

    if (this.isAuthenticated) {
      console.log('ProfileManager: user authenticated, analytics sync enabled');
      this.syncFailureCount = 0;

      if (localData) {
        // localStorage has data — it's authoritative, sync to backend async
        console.log('ProfileManager: localStorage profile found, syncing to backend');
        this.restoredState = this._buildState(localData);
        PersistentProfile.save(localData).catch(() => {
          this.syncFailureCount++;
          console.warn('ProfileManager: background sync failed (non-blocking)');
        });
        return this.restoredState;

      } else {
        // localStorage empty — try to recover from backend (new device scenario)
        console.log('ProfileManager: localStorage empty, attempting backend recovery');
        const backendData = await PersistentProfile.getFlatProfile();

        if (backendData) {
          // Restore backend data to localStorage for this device
          console.log('ProfileManager: recovered profile from backend for', backendData.name);
          LocalProfile.save(backendData);
          this.restoredState = this._buildState(backendData);
          return this.restoredState;
        }

        console.log('ProfileManager: no profile found (authenticated, new user)');
        return null;
      }

    } else {
      // Unauthenticated — localStorage only
      console.log('ProfileManager: unauthenticated, localStorage only');

      if (localData) {
        console.log('ProfileManager: loaded local profile for', localData.name);
        this.restoredState = this._buildState(localData);
        return this.restoredState;
      }

      console.log('ProfileManager: new user');
      return null;
    }
  }

  /**
   * Get the restored state from last initialization
   * Useful for components that need state after async init
   * 
   * @returns {Object|null}
   */
  getRestoredState() {
    return this.restoredState;
  }

  /**
   * Build unified state structure from flat profile data
   * @private
   */
  _buildState(profile) {
    return {
      profileData: {
        name: profile.name,
        email: profile.email,
        githubID: profile.githubID,
        sprite: profile.sprite,
        spriteMeta: profile.spriteMeta,
        spriteSrc: profile.spriteSrc,
        theme: profile.theme,
        themeMeta: profile.themeMeta,
        worldThemeSrc: profile.worldThemeSrc,
      },
      identityState: {
        // Identity Forge (includes avatar)
        identityUnlocked: profile.identityUnlocked || false,
        avatarSelected: profile.avatarSelected || false,
        // Wayfinding World
        worldThemeSelected: profile.worldThemeSelected || false,
        navigationComplete: profile.navigationComplete || false,
        // Mission Tooling
        toolsUnlocked: profile.toolsUnlocked || false,
      },
    };
  }

  /**
   * Stop the game and clean up localStorage keys.
   *
   * Call this when the game session fully ends (not on level transitions).
   * If a backend sync is available and confirmed, localStorage is cleared
   * so stale keys don't persist across browser sessions in production.
   * In development (no auth), keys are intentionally preserved so the
   * next launch can resume without a database.
   *
   * Level transitions should NOT call this — only full game stop/exit.
   *
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async stopGame() {
    try {
      if (this.isAuthenticated) {
        // Flush any pending progress to backend before clearing localStorage
        const currentData = LocalProfile.getFlatProfile();
        if (currentData) {
          await PersistentProfile.update(currentData).catch(() => {});
        }
        // Backend has the data — safe to remove localStorage keys
        LocalProfile.clear();
        console.log('ProfileManager: game stopped, localStorage cleared (backed up to server)');
      } else {
        // No backend — keep localStorage so the next launch can resume
        console.log('ProfileManager: game stopped, localStorage preserved (no auth/backend)');
      }

      this.initialized = false;
      this.restoredState = null;
      return { success: true, code: 200, body: null };
    } catch (error) {
      console.error('ProfileManager: stopGame failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Save identity information (name, email, githubID)
   * Creates new profile if none exists, updates if it does
   * Part of Identity Forge level
   *
   * @param {Object} identityData - { name, email, githubID }
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async saveIdentity(identityData) {
    if (!identityData || !identityData.name) {
      console.warn('ProfileManager: saveIdentity called with invalid data', identityData);
      return { success: false, code: 400, body: { error: 'Invalid identity data' } };
    }

    const payload = {
      name: identityData.name,
      email: identityData.email || '',
      githubID: identityData.githubID || '',
    };

    try {
      // Always write to localStorage first (source of truth)
      if (LocalProfile.exists()) {
        LocalProfile.update(payload);
      } else {
        LocalProfile.save(payload);
      }

      // Async-sync to backend if authenticated (best-effort, non-blocking)
      if (this.isAuthenticated) {
        PersistentProfile.update(payload).catch(() => {
          this.syncFailureCount = (this.syncFailureCount || 0) + 1;
        });
      }

      this._updateWidget();
      console.log('ProfileManager: identity saved', payload.name);
      return { success: true, code: 200, body: payload };
    } catch (error) {
      console.error('ProfileManager: saveIdentity failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Update identity unlock progress
   * Part of Identity Forge level
   *
   * @param {boolean} unlocked - Whether identity terminal is unlocked
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async updateIdentityProgress(unlocked = true) {
    try {
      const update = { identityUnlocked: unlocked };
      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }
      console.log('ProfileManager: identity progress updated', unlocked);
      return { success: true, code: 200, body: update };
    } catch (error) {
      console.error('ProfileManager: updateIdentityProgress failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Save avatar/sprite selection
   * Part of Identity Forge level (avatar included in identity)
   * 
   * @param {Object} spriteMeta - { name, src, rows, cols, scaleFactor, movementPreset, ... }
   * @returns {Promise<boolean>} Success status
   */
  async saveAvatar(spriteMeta) {
    if (!spriteMeta || !spriteMeta.name) {
      console.warn('ProfileManager: saveAvatar called with invalid data', spriteMeta);
      return { success: false, code: 400, body: { error: 'Invalid avatar data' } };
    }

    try {
      const update = {
        sprite: spriteMeta.name,
        spriteMeta: spriteMeta,
        spriteSrc: spriteMeta.src,
        avatarSelected: true,  // Mark avatar as selected
      };

      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }

      this._updateWidget();
      console.log('ProfileManager: avatar saved', spriteMeta.name);
      return { success: true, code: 200, body: { sprite: spriteMeta.name } };
    } catch (error) {
      console.error('ProfileManager: saveAvatar failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Update avatar selection completion (part of Identity Forge)
   * Identity Forge includes both identity and avatar
   *
   * @param {boolean} selected - Whether avatar has been selected
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async updateAvatarProgress(selected = true) {
    try {
      const update = { avatarSelected: selected };
      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }
      console.log('ProfileManager: avatar progress updated', selected);
      return { success: true, code: 200, body: update };
    } catch (error) {
      console.error('ProfileManager: updateAvatarProgress failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Save world theme selection
   * Part of Wayfinding World level
   * 
   * @param {Object} themeMeta - { name, src, compatibleSprites?, ... }
   * @returns {Promise<boolean>} Success status
   */
  async saveTheme(themeMeta) {
    if (!themeMeta || !themeMeta.name) {
      console.warn('ProfileManager: saveTheme called with invalid data', themeMeta);
      return { success: false, code: 400, body: { error: 'Invalid theme data' } };
    }

    try {
      const update = {
        theme: themeMeta.name,
        themeMeta: themeMeta,
        worldThemeSrc: themeMeta.src,
        worldThemeSelected: true,  // Mark theme as selected
      };

      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }

      this._updateWidget();
      console.log('ProfileManager: theme saved', themeMeta.name);
      return { success: true, code: 200, body: { theme: themeMeta.name } };
    } catch (error) {
      console.error('ProfileManager: saveTheme failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Update world theme navigation completion
   * Part of Wayfinding World level
   *
   * @param {boolean} complete - Whether navigation is complete
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async updateThemeProgress(complete = true) {
    try {
      const update = { navigationComplete: complete };
      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }
      console.log('ProfileManager: theme progress updated', complete);
      return { success: true, code: 200, body: update };
    } catch (error) {
      console.error('ProfileManager: updateThemeProgress failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Generic progress update for custom game milestones
   * 
   * @param {string} key - Progress key (e.g., 'questCompleted', 'level2Unlocked')
   * @param {any} value - Progress value
   * @returns {Promise<boolean>} Success status
   */
  async updateProgress(key, value) {
    if (!key) {
      console.warn('ProfileManager: updateProgress called without key');
      return { success: false, code: 400, body: { error: 'Missing key' } };
    }

    try {
      const update = { [key]: value };
      LocalProfile.update(update);
      if (this.isAuthenticated) {
        PersistentProfile.update(update).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
      }
      console.log('ProfileManager: progress updated', key, value);
      return { success: true, code: 200, body: { [key]: value } };
    } catch (error) {
      console.error('ProfileManager: updateProgress failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Check if profile exists
   * 
   * @returns {Promise<boolean>}
   */
  async exists() {
    try {
      return LocalProfile.exists();
    } catch (error) {
      console.error('ProfileManager: exists check failed', error);
      return false;
    }
  }

  /**
   * Get current profile data from localStorage (flat structure)
   *
   * @returns {Promise<Object|null>}
   */
  async getProfile() {
    try {
      return LocalProfile.getFlatProfile();
    } catch (error) {
      console.error('ProfileManager: getProfile failed', error);
      return null;
    }
  }

  /**
   * Clear all profile data and reset
   * For local users: Full wipe (localStorage cleared)
   * For authenticated: Preferences only (identity preserved, requires account deactivation for full delete)
   * 
   * @returns {Promise<boolean>} Success status
   */
  async clear() {
    try {
      // Always clear localStorage (full wipe for local reset)
      LocalProfile.clear();
      // Also clear backend game data (preserves identity columns server-side)
      if (this.isAuthenticated) {
        PersistentProfile.clear().catch(() => {});
      }

      this.initialized = false;
      this._updateWidget();
      console.log('ProfileManager: profile cleared');
      return { success: true, code: 200, body: null };
    } catch (error) {
      console.error('ProfileManager: clear failed', error);
      return { success: false, code: 500, body: { error: error.message } };
    }
  }

  /**
   * Export profile as JSON string
   * 
   * @returns {Promise<string|null>}
   */
  async export() {
    try {
      if (this.isAuthenticated) {
        return await this.backend.export();
      } else {
        return this.backend.export();
      }
    } catch (error) {
      console.error('ProfileManager: export failed', error);
      return null;
    }
  }

  /**
   * Import profile from JSON string
   * 
   * @param {string} jsonString
   * @returns {Promise<boolean>} Success status
   */
  async import(jsonString) {
    try {
      let success;
      if (this.isAuthenticated) {
        success = await this.backend.import(jsonString);
      } else {
        success = this.backend.import(jsonString);
      }
      
      if (success) {
        this._updateWidget();
      }
      return success;
    } catch (error) {
      console.error('ProfileManager: import failed', error);
      return false;
    }
  }

  /**
   * Update the local profile widget UI
   * @private
   */
  _updateWidget() {
    if (typeof window.updateLocalProfileWidget === 'function') {
      window.updateLocalProfileWidget();
    }
  }
}

export default ProfileManager;
