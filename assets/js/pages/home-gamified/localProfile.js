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
   * @param {string} data.github - User's GitHub username
   * @returns {Object} The saved profile with metadata
   */
  save(data) {
    try {
      const profile = {
        version: STORAGE_VERSION,
        localId: generateLocalId(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
        identity: {
          name: data.name || '',
          email: data.email || '',
          github: data.github || '',
        },
        preferences: {
          sprite: data.sprite || null,
          spriteMeta: data.spriteMeta || null,
          theme: data.theme || null,
          themeMeta: data.themeMeta || null,
        },
        progress: {
          identityUnlocked: data.identityUnlocked || false,
          worldThemeDone: data.worldThemeDone || false,
          avatarForgeDone: data.avatarForgeDone || false,
        }
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
        identity: {
          ...existing.identity,
          ...(updates.name !== undefined ? { name: updates.name } : {}),
          ...(updates.email !== undefined ? { email: updates.email } : {}),
          ...(updates.github !== undefined ? { github: updates.github } : {}),
        },
        preferences: {
          ...existing.preferences,
          ...(updates.sprite !== undefined ? { sprite: updates.sprite } : {}),
          ...(updates.spriteMeta !== undefined ? { spriteMeta: updates.spriteMeta } : {}),
          ...(updates.theme !== undefined ? { theme: updates.theme } : {}),
          ...(updates.themeMeta !== undefined ? { themeMeta: updates.themeMeta } : {}),
        },
        progress: {
          ...existing.progress,
          ...(updates.identityUnlocked !== undefined ? { identityUnlocked: updates.identityUnlocked } : {}),
          ...(updates.worldThemeDone !== undefined ? { worldThemeDone: updates.worldThemeDone } : {}),
          ...(updates.avatarForgeDone !== undefined ? { avatarForgeDone: updates.avatarForgeDone } : {}),
        }
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

    return {
      localId: profile.localId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      name: profile.identity.name,
      email: profile.identity.email,
      github: profile.identity.github,
      sprite: profile.preferences.sprite,
      spriteMeta: profile.preferences.spriteMeta,
      spriteSrc: profile.preferences.spriteMeta?.src || null,
      theme: profile.preferences.theme,
      themeMeta: profile.preferences.themeMeta,
      worldThemeSrc: profile.preferences.themeMeta?.src || null,
      identityUnlocked: profile.progress.identityUnlocked,
      worldThemeDone: profile.progress.worldThemeDone,
      avatarForgeDone: profile.progress.avatarForgeDone,
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
