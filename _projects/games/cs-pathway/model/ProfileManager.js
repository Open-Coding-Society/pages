/**
 * ProfileManager - MODEL Layer
 * 
 * Unified profile persistence manager for game levels.
 * Follows MVC architecture by separating data persistence from view/controller.
 * 
 * Supports multiple profile backends:
 * - localProfile.js: localStorage with user-namespaced keys (guest vs authenticated)
 * - persistentProfile.js: Teacher, Student, or Follower users (API backend, protected identity)
 * 
 * Storage Architecture:
 *   Guest:         'ocs_profile_guest'      (ephemeral demo mode)
 *   Authenticated: 'ocs_profile_{uid}'      (e.g., 'ocs_profile_jm1021')
 * 
 * Profile Lookup Strategy:
 * 1. Check if user is authenticated → get user ID (uid)
 * 2. Set user context on LocalProfile (namespaces storage key)
 * 3. Clean up guest data if user logs in (guest is demo mode, not migrated)
 * 4. Load from user-specific localStorage key (or recover from backend)
 * 5. Sync to backend if authenticated (analytics + cross-device recovery)
 * 
 * Guest Mode Behavior:
 * - Guest profiles are EPHEMERAL and used for demos/exploration
 * - When user logs in, guest data is DISCARDED (not merged)
 * - Real user data comes from backend or starts fresh
 * - Prevents confusion between demo progress and real account progress
 * 
 * See PROFILE_MIGRATION_GUIDE.md for detailed architecture documentation.
 * 
 * Usage in GameLevelCssePath (View/Controller):
 *   import ProfileManager from '@assets/js/projects/cs-pathway/model/ProfileManager.js';
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

import LocalProfile from '@assets/js/projects/cs-pathway/model/localProfile.js';
import PersistentProfile from '@assets/js/projects/cs-pathway/model/persistentProfile.js';

class ProfileManager {
  constructor() {
    this.initialized = false;
    this.isAuthenticated = false;
    this.userInfo = null; // Current user info { uid, name, email, roles }
    this.backend = null; // Will be LocalProfile or PersistentProfile
    this.restoredState = null;
  }

  /**
   * Initialize profile system with user-namespaced localStorage.
   *
   * Key Changes:
   *   1. Check authentication FIRST to get user ID
   *   2. Set user context on LocalProfile (namespaced storage key)
   *   3. Clean up guest data if user logs in (guest is demo mode)
   *   4. Load from correct user-specific localStorage key
   *
   * Storage Keys:
   *   - Guest: 'ocs_profile_guest' (ephemeral, wiped on login)
   *   - Authenticated: 'ocs_profile_{uid}' (e.g., 'ocs_profile_jm1021')
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
    this.backend = LocalProfile;

    // ── STEP 1: Check authentication and get user ID ──────────────────────
    this.isAuthenticated = await PersistentProfile.isAuthenticated();
    
    if (this.isAuthenticated) {
      this.userInfo = await PersistentProfile.getUserInfo();
      if (!this.userInfo || !this.userInfo.uid) {
        console.error('ProfileManager: authenticated but no user info - falling back to guest');
        this.isAuthenticated = false;
        this.userInfo = null;
      }
    }

    const currentUid = this.isAuthenticated ? this.userInfo.uid : null;
    
    // ── STEP 2: Set user context on LocalProfile (namespace storage) ──────
    LocalProfile.setUserContext(currentUid);
    console.log(`ProfileManager: user context set to ${currentUid || 'guest'}`);

    // ── STEP 3: Clean up guest data if user logged in ─────────────────────
    if (this.isAuthenticated && LocalProfile.exists(null)) {
      // Guest data exists + user just logged in → clean up demo data
      await this._handleGuestMigration(currentUid);
    }

    // ── STEP 4: Load from user-specific localStorage ──────────────────────
    const localData = LocalProfile.getFlatProfile();

    if (this.isAuthenticated) {
      console.log(`ProfileManager: authenticated as ${currentUid}, analytics sync enabled`);
      this.syncFailureCount = 0;

      if (localData) {
        // User's localStorage has data — it's authoritative, sync to backend async
        console.log(`ProfileManager: loaded profile for ${currentUid} from localStorage`);
        this.restoredState = this._buildState(localData);
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.save(completeProfile).catch(() => {
            this.syncFailureCount++;
            console.warn('ProfileManager: background sync failed (non-blocking)');
          });
        }
        return this.restoredState;

      } else {
        // User's localStorage empty — try to recover from backend (new device scenario)
        console.log(`ProfileManager: no local profile for ${currentUid}, attempting backend recovery`);
        const backendData = await PersistentProfile.getFlatProfile();

        if (backendData) {
          // Restore backend data to this user's localStorage
          console.log(`ProfileManager: recovered profile from backend for ${currentUid}`);
          LocalProfile.save(backendData);
          this.restoredState = this._buildState(backendData);
          return this.restoredState;
        }

        console.log(`ProfileManager: no profile found for ${currentUid} (new authenticated user)`);
        return null;
      }

    } else {
      // Unauthenticated — localStorage only (guest key)
      console.log('ProfileManager: unauthenticated mode, using guest storage');

      if (localData) {
        console.log('ProfileManager: loaded guest profile from localStorage');
        this.restoredState = this._buildState(localData);
        return this.restoredState;
      }

      console.log('ProfileManager: new guest user');
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
   * Switch user context after authentication (guest → authenticated transition)
   * 
   * Call this after user logs in to switch from guest storage to user-specific storage.
   * This method:
   * 1. Updates userInfo with authenticated credentials
   * 2. Switches LocalProfile to user-specific storage key
   * 3. Clears guest demo data
   * 4. Loads user's profile from backend or creates fresh
   * 
   * @param {Object} authBody - Authentication data { uid, name, email, role }
   * @returns {Promise<Object|null>} Restored user profile or null
   */
  async switchToAuthenticatedUser(authBody) {
    if (!authBody || !authBody.uid) {
      console.error('ProfileManager: switchToAuthenticatedUser requires valid authBody with uid');
      return null;
    }

    console.log(`ProfileManager: switching from guest to authenticated user ${authBody.uid}`);
    
    // Update authentication state
    this.isAuthenticated = true;
    
    // Update userInfo
    this.userInfo = {
      uid: authBody.uid,
      name: authBody.name,
      email: authBody.email,
      roles: authBody.roles || []
    };

    // Switch LocalProfile to user-specific key
    const currentUid = this.userInfo.uid;
    LocalProfile.setUserContext(currentUid);
    console.log(`ProfileManager: storage context switched to ocs_profile_${currentUid}`);

    // Clean up guest data
    await this._handleGuestMigration(currentUid);

    // Load user's profile (from localStorage or backend)
    const localData = LocalProfile.getFlatProfile();
    
    if (localData) {
      console.log(`ProfileManager: loaded existing profile for ${currentUid}`);
      this.restoredState = this._buildState(localData);
      return this.restoredState;
    } else {
      // Try backend recovery
      console.log(`ProfileManager: no local profile for ${currentUid}, attempting backend recovery`);
      const backendData = await PersistentProfile.getFlatProfile();

      if (backendData) {
        console.log(`ProfileManager: recovered profile from backend for ${currentUid}`);
        LocalProfile.save(backendData);
        this.restoredState = this._buildState(backendData);
        return this.restoredState;
      }

      console.log(`ProfileManager: no profile found for ${currentUid} (new authenticated user)`);
      return null;
    }
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
        persona: profile.persona,
        personaId: profile.personaId,
        sprite: profile.sprite,
        spriteMeta: profile.spriteMeta,
        spriteSrc: profile.spriteSrc,
        theme: profile.theme,
        worldTheme: profile.theme,  // Alias for UI compatibility
        themeMeta: profile.themeMeta,
        worldThemeSrc: profile.worldThemeSrc,
      },
      identityState: {
        // Identity Forge (includes avatar)
        identityUnlocked: profile.identityUnlocked || false,
        avatarForgeDone: profile.avatarSelected || Boolean(profile.spriteMeta || profile.sprite),
        avatarSelected: profile.avatarSelected || false,
        identityForgeCompleted: profile.identityForgeCompleted || false,
        // Wayfinding World
        worldThemeDone: profile.worldThemeSelected || Boolean(profile.themeMeta || profile.theme),
        worldThemeSelected: profile.worldThemeSelected || false,
        navigationComplete: profile.navigationComplete || false,
        // Mission Tooling
        toolsUnlocked: profile.toolsUnlocked || false,
      },
    };
  }

  /**
   * Handle guest→authenticated user transition
   * 
   * Design Decision: Guest profiles are EPHEMERAL demo mode.
   * When user logs in, guest data is discarded (not merged).
   * 
   * Rationale:
   * - Guest is for exploring/testing before committing to an account
   * - Real user data comes from backend (cross-device sync)
   * - Prevents confusion between demo progress and real progress
   * 
   * @private
   * @param {string} uid - Authenticated user ID
   */
  async _handleGuestMigration(uid) {
    try {
      const guestData = LocalProfile.load(null); // Check guest profile
      if (!guestData) {
        console.log('ProfileManager: no guest data to clean up');
        return;
      }

      // Guest data exists — clean it up (user is now authenticated)
      console.log(`ProfileManager: user ${uid} logged in, clearing demo guest data`);
      LocalProfile.clear(null); // Remove guest profile
      console.log('✓ ProfileManager: guest demo data cleared');
      
      // Note: User's real data will be loaded from backend or created fresh
      // This happens in the main initialize() flow after this cleanup
    } catch (error) {
      console.error('ProfileManager: guest cleanup failed', error);
    }
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
        const currentData = LocalProfile.load();
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

      // Async-sync complete profile to backend if authenticated (best-effort, non-blocking)
      if (this.isAuthenticated) {
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => {
            this.syncFailureCount = (this.syncFailureCount || 0) + 1;
          });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
        const completeProfile = LocalProfile.load();
        if (completeProfile) {
          PersistentProfile.update(completeProfile).catch(() => { this.syncFailureCount = (this.syncFailureCount || 0) + 1; });
        }
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
   * Recover profile from backend server (authenticated users only)
   * 
   * This fetches the last saved snapshot from the server and overwrites
   * the local localStorage data. Used when user wants to restore from
   * a previous server backup.
   * 
   * @returns {Promise<{ success: boolean, code: number, body: Object|null }>}
   */
  async recoverFromBackend() {
    if (!this.isAuthenticated) {
      console.error('ProfileManager: recoverFromBackend requires authentication');
      return { success: false, code: 401, body: { error: 'Authentication required' } };
    }

    try {
      console.log('ProfileManager: recovering profile from backend...');
      
      // Fetch from backend
      const backendData = await PersistentProfile.getFlatProfile();
      
      if (!backendData || Object.keys(backendData).length === 0) {
        console.warn('ProfileManager: no backup found on server');
        return { success: false, code: 404, body: { error: 'No backup found on server' } };
      }

      // Overwrite localStorage with server data
      LocalProfile.save(this.userInfo.uid, backendData);
      
      console.log('✓ ProfileManager: profile recovered from backend', backendData);
      return { success: true, code: 200, body: backendData };
    } catch (error) {
      console.error('ProfileManager: recoverFromBackend failed', error);
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
