/**
 * Local Profile Manager
 * Manages localStorage-based local profiles for home-gamified experiences.
 * Provides persistence without requiring full authentication.
 * 
 * @module localProfile
 * @author OpenCS Team
 */

const STORAGE_KEY = 'ocs_local_profile';
const STORAGE_VERSION = '1.0';

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
   * Check if a local profile exists
   * @returns {boolean}
   */
  exists() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data !== null;
    } catch (error) {
      console.warn('LocalProfile: localStorage access failed', error);
      return false;
    }
  },

  /**
   * Load the local profile from localStorage
   * @returns {Object|null} Profile data or null if none exists
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const profile = JSON.parse(data);
      
      // Validate version
      if (profile.version !== STORAGE_VERSION) {
        console.warn('LocalProfile: version mismatch, clearing old profile');
        this.clear();
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
            },
            progress: {
              identityUnlocked: data.identityUnlocked || false,
              avatarSelected: data.avatarSelected || false,
            },
            completedAt: null,
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
            },
            completedAt: null,
          },
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      console.log('LocalProfile: saved profile for', profile.identity.name);
      
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
            },
            progress: {
              ...existing.game_profile?.['identity-forge']?.progress,
              ...(updates.identityUnlocked !== undefined && { identityUnlocked: updates.identityUnlocked }),
              ...(updates.avatarSelected !== undefined && { avatarSelected: updates.avatarSelected }),
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
            },
            completedAt: updates.missionToolingCompleted || existing.game_profile?.['mission-tooling']?.completedAt,
          },
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      console.log('LocalProfile: updated profile');
      
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
   * @returns {boolean} Success status
   */
  clear() {
    try {
      const existing = this.load();
      localStorage.removeItem(STORAGE_KEY);
      console.log('LocalProfile: cleared profile');
      
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
      // Top-level identity
      name: profile.name,
      email: profile.email,
      githubID: profile.githubID,
      // Identity Forge (includes avatar)
      sprite: identityForge.preferences?.sprite || null,
      spriteMeta: identityForge.preferences?.spriteMeta || null,
      spriteSrc: identityForge.preferences?.spriteMeta?.src || null,
      identityUnlocked: identityForge.progress?.identityUnlocked || false,
      avatarSelected: identityForge.progress?.avatarSelected || false,
      // Wayfinding World
      theme: wayfindingWorld.preferences?.theme || null,
      themeMeta: wayfindingWorld.preferences?.themeMeta || null,
      worldThemeSrc: wayfindingWorld.preferences?.themeMeta?.src || null,
      worldThemeSelected: wayfindingWorld.progress?.worldThemeSelected || false,
      navigationComplete: wayfindingWorld.progress?.navigationComplete || false,
      // Mission Tooling
      toolsUnlocked: missionTooling.progress?.toolsUnlocked || false,
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
      localStorage.setItem(STORAGE_KEY, jsonString);
      console.log('LocalProfile: imported profile');
      return true;
    } catch (error) {
      console.error('LocalProfile: failed to import profile', error);
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
