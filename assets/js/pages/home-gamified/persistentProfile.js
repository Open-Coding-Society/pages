/**
 * Persistent Profile - Authenticated User Storage
 * 
 * Backend-persisted profile storage for authenticated users.
 * Complements localProfile.js with same API interface.
 * 
 * Key Differences from Local Profile:
 * - Data stored in backend database via API
 * - Requires authentication (JWT cookies)
 * - clear() preserves identity (name, email, github)
 * - Identity changes require separate admin flow
 * - Supports GUEST and STUDENT roles
 * 
 * API Endpoints (Python backend):
 * - GET    /api/profile/game     - Load profile
 * - POST   /api/profile/game     - Create profile
 * - PUT    /api/profile/game     - Update profile
 * - DELETE /api/profile/game     - Clear preferences only
 * 
 * Storage Structure (same as localProfile):
 * {
 *   identity: { name, email, github },
 *   preferences: { sprite, spriteMeta, theme, themeMeta },
 *   progress: { identityUnlocked, worldThemeDone, avatarForgeDone, ... },
 *   metadata: { localId, createdAt, updatedAt, version }
 * }
 */

import { pythonURI, fetchOptions } from '/assets/js/api/config.js';

const API_BASE = pythonURI + '/api/profile/game';
const VERSION = '1.0';

class PersistentProfile {
  
  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  static async isAuthenticated() {
    try {
      const response = await fetch(pythonURI + '/api/id', fetchOptions);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data && data.uid; // User has valid JWT
    } catch (error) {
      console.error('PersistentProfile: auth check failed', error);
      return false;
    }
  }

  /**
   * Get current user info
   * @returns {Promise<Object|null>} { uid, name, email, roles }
   */
  static async getUserInfo() {
    try {
      const response = await fetch(pythonURI + '/api/id', fetchOptions);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('PersistentProfile: failed to get user info', error);
      return null;
    }
  }

  /**
   * Check if profile exists in backend
   * @returns {Promise<boolean>}
   */
  static async exists() {
    try {
      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('PersistentProfile: exists check failed', error);
      return false;
    }
  }

  /**
   * Load profile from backend
   * @returns {Promise<Object|null>} Profile data or null
   */
  static async load() {
    try {
      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('PersistentProfile: no profile found');
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('PersistentProfile: loaded profile', data);
      return data;
    } catch (error) {
      console.error('PersistentProfile: load failed', error);
      return null;
    }
  }

  /**
   * Save new profile to backend
   * @param {Object} profileData - Initial profile data
   * @returns {Promise<boolean>} Success status
   */
  static async save(profileData = {}) {
    try {
      const userInfo = await this.getUserInfo();
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      const profile = {
        identity: {
          name: profileData.name || userInfo.name || '',
          email: profileData.email || userInfo.email || '',
          github: profileData.github || '',
        },
        preferences: {
          sprite: profileData.sprite || '',
          spriteMeta: profileData.spriteMeta || null,
          theme: profileData.theme || '',
          themeMeta: profileData.themeMeta || null,
        },
        progress: {
          identityUnlocked: profileData.identityUnlocked || false,
          worldThemeDone: profileData.worldThemeDone || false,
          avatarForgeDone: profileData.avatarForgeDone || false,
        },
        metadata: {
          localId: profileData.localId || null, // Preserve local ID if migrating
          version: VERSION,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log('PersistentProfile: created profile');
      this._trackEvent('profile_created', { role: userInfo.roles?.[0]?.name });
      return true;
    } catch (error) {
      console.error('PersistentProfile: save failed', error);
      return false;
    }
  }

  /**
   * Update existing profile
   * @param {Object} updates - Partial profile data to merge
   * @returns {Promise<boolean>} Success status
   */
  static async update(updates = {}) {
    try {
      const existing = await this.load();
      if (!existing) {
        console.warn('PersistentProfile: no profile to update, creating new');
        return await this.save(updates);
      }

      // Merge updates preserving structure
      const updated = {
        identity: {
          ...existing.identity,
          ...(updates.name && { name: updates.name }),
          ...(updates.email && { email: updates.email }),
          ...(updates.github && { github: updates.github }),
        },
        preferences: {
          ...existing.preferences,
          ...(updates.sprite && { sprite: updates.sprite }),
          ...(updates.spriteMeta && { spriteMeta: updates.spriteMeta }),
          ...(updates.theme && { theme: updates.theme }),
          ...(updates.themeMeta && { themeMeta: updates.themeMeta }),
        },
        progress: {
          ...existing.progress,
          ...Object.keys(updates)
            .filter(key => !['name', 'email', 'github', 'sprite', 'spriteMeta', 'theme', 'themeMeta'].includes(key))
            .reduce((acc, key) => ({ ...acc, [key]: updates[key] }), {}),
        },
        metadata: {
          ...existing.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log('PersistentProfile: updated profile');
      return true;
    } catch (error) {
      console.error('PersistentProfile: update failed', error);
      return false;
    }
  }

  /**
   * Clear profile preferences (NOT identity)
   * Identity (name, email, github) is preserved
   * Use for "reset progress" without losing account
   * @returns {Promise<boolean>} Success status
   */
  static async clear() {
    try {
      const existing = await this.load();
      if (!existing) {
        console.warn('PersistentProfile: no profile to clear');
        return true;
      }

      // Preserve identity, clear everything else
      const cleared = {
        identity: existing.identity, // KEEP identity
        preferences: {
          sprite: '',
          spriteMeta: null,
          theme: '',
          themeMeta: null,
        },
        progress: {
          identityUnlocked: false,
          worldThemeDone: false,
          avatarForgeDone: false,
        },
        metadata: {
          ...existing.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(cleared),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log('PersistentProfile: cleared preferences (identity preserved)');
      this._trackEvent('profile_cleared');
      return true;
    } catch (error) {
      console.error('PersistentProfile: clear failed', error);
      return false;
    }
  }

  /**
   * Export profile as JSON string
   * @returns {Promise<string|null>}
   */
  static async export() {
    try {
      const profile = await this.load();
      if (!profile) {
        return null;
      }
      return JSON.stringify(profile, null, 2);
    } catch (error) {
      console.error('PersistentProfile: export failed', error);
      return null;
    }
  }

  /**
   * Import profile from JSON string
   * @param {string} jsonString
   * @returns {Promise<boolean>} Success status
   */
  static async import(jsonString) {
    try {
      const profile = JSON.parse(jsonString);
      
      // Validate version
      if (profile.metadata?.version !== VERSION) {
        console.warn('PersistentProfile: version mismatch', profile.metadata?.version, VERSION);
      }

      return await this.save(profile);
    } catch (error) {
      console.error('PersistentProfile: import failed', error);
      return false;
    }
  }

  /**
   * Get flat profile structure (for easy access)
   * @returns {Promise<Object|null>}
   */
  static async getFlatProfile() {
    try {
      const profile = await this.load();
      if (!profile) {
        return null;
      }

      return {
        // Identity
        name: profile.identity?.name || '',
        email: profile.identity?.email || '',
        github: profile.identity?.github || '',
        
        // Preferences
        sprite: profile.preferences?.sprite || '',
        spriteMeta: profile.preferences?.spriteMeta || null,
        spriteSrc: profile.preferences?.spriteMeta?.src || '',
        theme: profile.preferences?.theme || '',
        themeMeta: profile.preferences?.themeMeta || null,
        worldThemeSrc: profile.preferences?.themeMeta?.src || '',
        
        // Progress
        ...profile.progress,
        
        // Metadata
        localId: profile.metadata?.localId || null,
        createdAt: profile.metadata?.createdAt || '',
        updatedAt: profile.metadata?.updatedAt || '',
        version: profile.metadata?.version || VERSION,
      };
    } catch (error) {
      console.error('PersistentProfile: getFlatProfile failed', error);
      return null;
    }
  }

  /**
   * Migrate local profile to persistent profile
   * Preserves all local data including local ID
   * @param {Object} localData - Local profile data
   * @returns {Promise<boolean>} Success status
   */
  static async migrateFromLocal(localData) {
    try {
      if (!localData) {
        console.warn('PersistentProfile: no local data to migrate');
        return false;
      }

      const userInfo = await this.getUserInfo();
      if (!userInfo) {
        throw new Error('User not authenticated');
      }

      console.log('PersistentProfile: migrating local profile', localData.localId);

      const migrated = {
        ...localData,
        // Override with authenticated user info
        name: userInfo.name || localData.name,
        email: userInfo.email || localData.email,
        // Preserve local metadata
        localId: localData.localId,
      };

      const success = await this.save(migrated);
      if (success) {
        this._trackEvent('local_migrated', { 
          localId: localData.localId,
          role: userInfo.roles?.[0]?.name,
        });
      }

      return success;
    } catch (error) {
      console.error('PersistentProfile: migration failed', error);
      return false;
    }
  }

  /**
   * Analytics tracking stub
   * @private
   */
  static _trackEvent(eventName, properties = {}) {
    // TODO: Integrate with analytics service
    console.log('PersistentProfile: track event', eventName, properties);
  }
}

export default PersistentProfile;
