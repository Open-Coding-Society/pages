/**
 * Local Profile Manager
 * Manages localStorage-based local profiles for home-gamified experiences.
 * Provides persistence without requiring full authentication.
 * 
 * Supports user-namespaced storage to prevent data collision:
 * - Guest: 'ocs_profile_guest'
 * - Authenticated: 'ocs_profile_{uid}' (e.g., 'ocs_profile_jm1021')
 * 
 * @module localProfile
 * @author OpenCS Team
 */

const GUEST_STORAGE_KEY = 'ocs_profile_guest';
const USER_KEY_PREFIX = 'ocs_profile_';
const STORAGE_VERSION = '1.0';

/**
 * Get storage key for a specific user context
 * @param {string|null} uid - User ID (null for guest)
 * @returns {string} localStorage key
 */
function getStorageKey(uid = null) {
  if (uid) {
    return `${USER_KEY_PREFIX}${uid}`;
  }
  return GUEST_STORAGE_KEY;
}

/**
 * Generate a unique local ID for analytics tracking
 */
function generateLocalId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `local_${timestamp}_${random}`;
}

/**
 * Get the current timestamp in ISO format
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Local Profile API
 */
const LocalProfile = {
  /**
   * Set current user context for subsequent operations
   * @param {string|null} uid - User ID (null for guest)
   */
  setUserContext(uid = null) {
    this._currentUid = uid;
  },

  /**
   * Get current storage key based on user context
   * @private
   */
  _getKey() {
    return getStorageKey(this._currentUid);
  },

  /**
   * Check if a local profile exists
   * @param {string|null} uid - Optional: check specific user (defaults to current context)
   * @returns {boolean}
   */
  exists(uid = undefined) {
    try {
      const key = uid !== undefined ? getStorageKey(uid) : this._getKey();
      const data = localStorage.getItem(key);
      return data !== null;
    } catch (error) {
      console.warn('LocalProfile: localStorage access failed', error);
      return false;
    }
  },

  /**
   * List all profile keys in localStorage
   * @returns {Array<{uid: string|null, key: string}>} Array of profile identifiers
   */
  listProfiles() {
    try {
      const profiles = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === GUEST_STORAGE_KEY) {
          profiles.push({ uid: null, key, label: 'Guest' });
        } else if (key?.startsWith(USER_KEY_PREFIX)) {
          const uid = key.substring(USER_KEY_PREFIX.length);
          profiles.push({ uid, key, label: uid });
        }
      }
      return profiles;
    } catch (error) {
      console.warn('LocalProfile: failed to list profiles', error);
      return [];
    }
  },

  /**
   * Load the local profile from localStorage
   * @param {string|null} uid - Optional: load specific user (defaults to current context)
   * @returns {Object|null} Profile data or null if none exists
   */
  load(uid = undefined) {
    try {
      const key = uid !== undefined ? getStorageKey(uid) : this._getKey();
      const data = localStorage.getItem(key);
      if (!data) return null;

      const profile = JSON.parse(data);
      
      // Validate version
      if (profile.version !== STORAGE_VERSION) {
        console.warn('LocalProfile: version mismatch, clearing old profile');
        this.clear(uid);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('LocalProfile: failed to load profile', error);
      return null;
    }
  },

  /**
   * Save a new local profile
   * @param {Object} data - Profile data
   * @param {string} data.name - User's name
   * @param {string} data.email - User's email
   * @param {string} data.githubID - User's GitHub username
   * @returns {Object} The saved profile with metadata
   */
  save(data) {
    try {
      const profile = {
        version: STORAGE_VERSION,
        localId: generateLocalId(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
        eventId: 0,
        // Top-level identity fields
        name: data.name || '',
        email: data.email || '',
        githubID: data.githubID || '',
        // Game data organized by level
        game_profile: {
          'identity-forge': {
            preferences: {
              sprite: data.sprite || null,
              spriteMeta: data.spriteMeta || null,
              persona: data.persona || null,
              personaId: data.personaId || null,
            },            progress: {
              identityUnlocked: data.identityUnlocked || false,
              avatarSelected: data.avatarSelected || false,
              identityForgeCompleted: data.identityForgeCompleted || false,
            },
            completedAt: data.identityForgeCompletedAt || null,
          },
          'wayfinding-world': {
            preferences: {
              theme: data.theme || null,
              themeMeta: data.themeMeta || null,
            },
            progress: {
              worldThemeSelected: data.worldThemeSelected || false,
              navigationComplete: data.navigationComplete || false,
            },
            completedAt: null,
          },
          'mission-tooling': {
            progress: {
              toolsUnlocked: data.toolsUnlocked || false,
              missionProgressCount: data.missionProgressCount || 0,
              missionScore: data.missionScore || 0.55,
              missionCompletedStations: data.missionCompletedStations || [],
            },
            completedAt: null,
          },
        },
      };

      const key = this._getKey();
      localStorage.setItem(key, JSON.stringify(profile));
      console.log(`LocalProfile: saved profile for ${data.name} (key: ${key})`);
      
      // Trigger analytics event if available
      this._trackEvent('profile_created', profile.localId);
      
      return profile;
    } catch (error) {
      console.error('LocalProfile: failed to save profile', error);
      throw error;
    }
  },

  /**
   * Update an existing local profile
   * @param {Object} updates - Partial profile data to update
   * @returns {Object|null} Updated profile or null if save failed
   */
  update(updates) {
    try {
      const existing = this.load();
      if (!existing) {
        console.warn('LocalProfile: no existing profile to update, creating new one');
        return this.save(updates);
      }

      // Merge updates
      const profile = {
        ...existing,
        updatedAt: getTimestamp(),
        // Ever-increasing event counter for ordering (avoids clock-skew issues)
        eventId: (existing.eventId || 0) + 1,
        // Top-level identity updates
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.email !== undefined && { email: updates.email }),
        ...(updates.githubID !== undefined && { githubID: updates.githubID }),
        // Game profile updates
        game_profile: {
          'identity-forge': {
            preferences: {
              ...existing.game_profile?.['identity-forge']?.preferences,
              ...(updates.sprite !== undefined && { sprite: updates.sprite }),
              ...(updates.spriteMeta !== undefined && { spriteMeta: updates.spriteMeta }),
              ...(updates.persona !== undefined && { persona: updates.persona }),
              ...(updates.personaId !== undefined && { personaId: updates.personaId }),
            },            progress: {
              ...existing.game_profile?.['identity-forge']?.progress,
              ...(updates.identityUnlocked !== undefined && { identityUnlocked: updates.identityUnlocked }),
              ...(updates.avatarSelected !== undefined && { avatarSelected: updates.avatarSelected }),
              ...(updates.identityForgeCompleted !== undefined && { identityForgeCompleted: updates.identityForgeCompleted }),
            },
            completedAt: updates.identityForgeCompleted || existing.game_profile?.['identity-forge']?.completedAt,
          },
          'wayfinding-world': {
            preferences: {
              ...existing.game_profile?.['wayfinding-world']?.preferences,
              ...(updates.theme !== undefined && { theme: updates.theme }),
              ...(updates.themeMeta !== undefined && { themeMeta: updates.themeMeta }),
            },
            progress: {
              ...existing.game_profile?.['wayfinding-world']?.progress,
              ...(updates.worldThemeSelected !== undefined && { worldThemeSelected: updates.worldThemeSelected }),
              ...(updates.navigationComplete !== undefined && { navigationComplete: updates.navigationComplete }),
            },
            completedAt: updates.wayfindingCompleted || existing.game_profile?.['wayfinding-world']?.completedAt,
          },
          'mission-tooling': {
            progress: {
              ...existing.game_profile?.['mission-tooling']?.progress,
              ...(updates.toolsUnlocked !== undefined && { toolsUnlocked: updates.toolsUnlocked }),
              ...(updates.missionProgressCount !== undefined && { missionProgressCount: updates.missionProgressCount }),
              ...(updates.missionScore !== undefined && { missionScore: updates.missionScore }),
              ...(updates.missionCompletedStations !== undefined && { missionCompletedStations: updates.missionCompletedStations }),
            },
            completedAt: updates.missionToolingCompleted || existing.game_profile?.['mission-tooling']?.completedAt,
          },
        },
      };

      const key = this._getKey();
      localStorage.setItem(key, JSON.stringify(profile));
      console.log(`LocalProfile: updated profile (key: ${key})`);
      
      // Trigger analytics event if available
      this._trackEvent('profile_updated', profile.localId);
      
      return profile;
    } catch (error) {
      console.error('LocalProfile: failed to update profile', error);
      return null;
    }
  },

  /**
   * Clear the local profile (start fresh)
   * @param {string|null} uid - Optional: clear specific user (defaults to current context)
   * @returns {boolean} Success status
   */
  clear(uid = undefined) {
    try {
      const existing = this.load(uid);
      const key = uid !== undefined ? getStorageKey(uid) : this._getKey();
      localStorage.removeItem(key);
      console.log(`LocalProfile: cleared profile (key: ${key})`);
      
      // Trigger analytics event if available
      if (existing) {
        this._trackEvent('profile_cleared', existing.localId);
      }
      
      return true;
    } catch (error) {
      console.error('LocalProfile: failed to clear profile', error);
      return false;
    }
  },

  /**
   * Get a flattened version of the profile for easy consumption
   * @returns {Object|null} Flattened profile data
   */
  getFlatProfile() {
    const profile = this.load();
    if (!profile) return null;

    const identityForge = profile.game_profile?.['identity-forge'] || {};
    const wayfindingWorld = profile.game_profile?.['wayfinding-world'] || {};
    const missionTooling = profile.game_profile?.['mission-tooling'] || {};

    return {
      // Metadata
      localId: profile.localId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      eventId: profile.eventId || 0,
      // Top-level identity
      name: profile.name,
      email: profile.email,
      githubID: profile.githubID,
      // Identity Forge (includes avatar)
      sprite: identityForge.preferences?.sprite || null,
      spriteMeta: identityForge.preferences?.spriteMeta || null,
      spriteSrc: identityForge.preferences?.spriteMeta?.src || null,
      persona: identityForge.preferences?.persona || null,
      personaId: identityForge.preferences?.personaId || null,
      identityUnlocked: identityForge.progress?.identityUnlocked || false,
      avatarSelected: identityForge.progress?.avatarSelected || false,
      identityForgeCompleted: identityForge.progress?.identityForgeCompleted || false,
      // Wayfinding World
      theme: wayfindingWorld.preferences?.theme || null,
      themeMeta: wayfindingWorld.preferences?.themeMeta || null,
      worldThemeSrc: wayfindingWorld.preferences?.themeMeta?.src || null,
      worldThemeSelected: wayfindingWorld.progress?.worldThemeSelected || false,
      navigationComplete: wayfindingWorld.progress?.navigationComplete || false,
      // Mission Tooling
      toolsUnlocked: missionTooling.progress?.toolsUnlocked || false,
      missionProgressCount: missionTooling.progress?.missionProgressCount || 0,
      missionScore: missionTooling.progress?.missionScore || 0.55,
      missionCompletedStations: missionTooling.progress?.missionCompletedStations || [],
    };
  },

  /**
   * Export profile as JSON (for backup/transfer)
   * @returns {string|null} JSON string of profile
   */
  export() {
    const profile = this.load();
    if (!profile) return null;
    return JSON.stringify(profile, null, 2);
  },

  /**
   * Import profile from JSON (for restore)
   * @param {string} jsonString - JSON string of profile
   * @returns {boolean} Success status
   */
  import(jsonString) {
    try {
      const profile = JSON.parse(jsonString);
      if (profile.version !== STORAGE_VERSION) {
        console.warn('LocalProfile: import version mismatch');
        return false;
      }
      const key = this._getKey();
      localStorage.setItem(key, jsonString);
      console.log(`LocalProfile: imported profile (key: ${key})`);
      return true;
    } catch (error) {
      console.error('LocalProfile: failed to import profile', error);
      return false;
    }
  },

  /**
   * Move profile from one key to another (for migration)
   * @param {string|null} fromUid - Source user ID (null for guest)
   * @param {string|null} toUid - Target user ID (null for guest)
   * @returns {boolean} Success status
   */
  moveProfile(fromUid, toUid) {
    try {
      const fromKey = getStorageKey(fromUid);
      const toKey = getStorageKey(toUid);
      
      const data = localStorage.getItem(fromKey);
      if (!data) {
        console.warn(`LocalProfile: no profile to move from ${fromKey}`);
        return false;
      }
      
      localStorage.setItem(toKey, data);
      localStorage.removeItem(fromKey);
      console.log(`LocalProfile: moved profile ${fromKey} → ${toKey}`);
      return true;
    } catch (error) {
      console.error('LocalProfile: failed to move profile', error);
      return false;
    }
  },

  /**
   * Internal: Track analytics event
   * This is a stub - integrate with your analytics system
   * @private
   */
  _trackEvent(eventName, localId) {
    // TODO: Integrate with your analytics system
    // Example: window.gtag?.('event', eventName, { local_id: localId });
    console.log(`LocalProfile: Analytics event - ${eventName}`, localId);
  }
};

export default LocalProfile;
