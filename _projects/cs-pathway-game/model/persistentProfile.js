/**
 * Persistent Profile - Authenticated User Storage
 * 
 * Backend-persisted profile storage via users table integration.
 * Complements localProfile.js with same API interface.
 * 
 * Key Differences from Local Profile:
 * - Data stored in users table via Python Flask API
 * - Requires authentication (JWT cookies)
 * - clear() preserves identity (_name, _email, _uid)
 * - Identity changes require separate admin flow
 * - Supports full user management
 * 
 * API Endpoints (Python Flask backend):
 * - GET    /api/profile/game     - Load game profile
 * - POST   /api/profile/game     - Create game profile
 * - PUT    /api/profile/game     - Update game profile
 * - DELETE /api/profile/game     - Clear game data only
 * 
 * Users Table Structure (SQLAlchemy):
 *   id, _name, _email, _uid (githubID), _sid, _password, _role,
 *   _pfp, _grade_data, _ap_exam, _class, _school, _game_profile
 * 
 * _game_profile JSON Structure:
 * {
 *   localId, createdAt, updatedAt, eventId,
 *   "identity-forge": { preferences, progress, completedAt },
 *   "wayfinding-world": { preferences, progress, completedAt },
 *   "mission-tooling": { progress, completedAt }
 * }
 */

import { pythonURI, fetchOptions } from '@assets/js/api/config.js';

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
        console.warn(`PersistentProfile: load failed with HTTP ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log('PersistentProfile: loaded profile', data);
      return data;
    } catch (error) {
      console.warn('PersistentProfile: load failed (network error) - continuing with local storage', error.message);
      return null;
    }
  }

  /**
   * Save new profile to backend
   * Maps to users table structure
   * @param {Object} profileData - Initial profile data
   * @returns {Promise<boolean>} Success status
   */
  static async save(profileData = {}) {
    try {
      const userInfo = await this.getUserInfo();
      if (!userInfo) {
        console.warn('PersistentProfile: user not authenticated - continuing with local storage');
        return false;
      }

      const payload = {
        _name: profileData.name || userInfo.name || '',
        _email: profileData.email || userInfo.email || '',
        _uid: profileData.githubID || userInfo.uid || '',  // githubID maps to _uid
        _game_profile: {
          version: VERSION,
          localId: profileData.localId || null,  // Preserve if migrating
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          eventId: profileData.eventId || 0,
          'identity-forge': {
            preferences: {
              sprite: profileData.sprite || null,
              spriteMeta: profileData.spriteMeta || null,
            },
            progress: {
              identityUnlocked: profileData.identityUnlocked || false,
              avatarSelected: profileData.avatarSelected || false,
            },
            completedAt: null,
          },
          'wayfinding-world': {
            preferences: {
              theme: profileData.theme || null,
              themeMeta: profileData.themeMeta || null,
            },
            progress: {
              worldThemeSelected: profileData.worldThemeSelected || false,
              navigationComplete: profileData.navigationComplete || false,
            },
            completedAt: null,
          },
          'mission-tooling': {
            progress: {
              toolsUnlocked: profileData.toolsUnlocked || false,
            },
            completedAt: null,
          },
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('PersistentProfile: save endpoint not available (404) - continuing with local storage');
          return false;
        }
        console.warn(`PersistentProfile: save failed with HTTP ${response.status} - continuing with local storage`);
        return false;
      }

      console.log('PersistentProfile: created profile');
      this._trackEvent('profile_created', { role: userInfo.roles?.[0]?.name });
      return true;
    } catch (error) {
      console.warn('PersistentProfile: save failed (network or auth error) - continuing with local storage', error.message);
      return false;
    }
  }

  /**
   * Update existing profile
   * Merges updates into _game_profile JSON column
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

      // Merge updates into existing _game_profile structure
      const gameProfile = existing._game_profile || {};
      const identityForge = gameProfile['identity-forge'] || { preferences: {}, progress: {} };
      const wayfindingWorld = gameProfile['wayfinding-world'] || { preferences: {}, progress: {} };
      const missionTooling = gameProfile['mission-tooling'] || { progress: {} };

      const payload = {
        _name: updates.name || existing._name,
        _email: updates.email || existing._email,
        _uid: updates.githubID || existing._uid,
        _game_profile: {
          ...gameProfile,
          eventId: updates.eventId !== undefined ? updates.eventId : (gameProfile.eventId || 0),
          updatedAt: new Date().toISOString(),
          'identity-forge': {
            preferences: {
              ...identityForge.preferences,
              ...(updates.sprite !== undefined && { sprite: updates.sprite }),
              ...(updates.spriteMeta !== undefined && { spriteMeta: updates.spriteMeta }),
            },
            progress: {
              ...identityForge.progress,
              ...(updates.identityUnlocked !== undefined && { identityUnlocked: updates.identityUnlocked }),
              ...(updates.avatarSelected !== undefined && { avatarSelected: updates.avatarSelected }),
            },
            completedAt: updates.identityForgeCompleted || identityForge.completedAt,
          },
          'wayfinding-world': {
            preferences: {
              ...wayfindingWorld.preferences,
              ...(updates.theme !== undefined && { theme: updates.theme }),
              ...(updates.themeMeta !== undefined && { themeMeta: updates.themeMeta }),
            },
            progress: {
              ...wayfindingWorld.progress,
              ...(updates.worldThemeSelected !== undefined && { worldThemeSelected: updates.worldThemeSelected }),
              ...(updates.navigationComplete !== undefined && { navigationComplete: updates.navigationComplete }),
            },
            completedAt: updates.wayfindingCompleted || wayfindingWorld.completedAt,
          },
          'mission-tooling': {
            progress: {
              ...missionTooling.progress,
              ...(updates.toolsUnlocked !== undefined && { toolsUnlocked: updates.toolsUnlocked }),
            },
            completedAt: updates.missionToolingCompleted || missionTooling.completedAt,
          },
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('PersistentProfile: update endpoint not available (404) - continuing with local storage');
          return false;
        }
        console.warn(`PersistentProfile: update failed with HTTP ${response.status} - continuing with local storage`);
        return false;
      }

      console.log('PersistentProfile: updated profile');
      return true;
    } catch (error) {
      console.warn('PersistentProfile: update failed (network or auth error) - continuing with local storage', error.message);
      return false;
    }
  }

  /**
   * Clear game profile data (NOT identity)
   * Preserves _name, _email, _uid (identity columns)
   * Only clears _game_profile JSON column
   * @returns {Promise<boolean>} Success status
   */
  static async clear() {
    try {
      const existing = await this.load();
      if (!existing) {
        console.warn('PersistentProfile: no profile to clear');
        return true;
      }

      // Preserve identity columns, reset game_profile only
      const payload = {
        _name: existing._name,
        _email: existing._email,
        _uid: existing._uid,
        _game_profile: {
          version: VERSION,
          localId: existing._game_profile?.localId || null,  // Preserve for analytics
          createdAt: existing._game_profile?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          eventId: 0,
          'identity-forge': {
            preferences: {},
            progress: {
              identityUnlocked: false,
              avatarSelected: false,
            },
            completedAt: null,
          },
          'wayfinding-world': {
            preferences: {},
            progress: {
              worldThemeSelected: false,
              navigationComplete: false,
            },
            completedAt: null,
          },
          'mission-tooling': {
            progress: {
              toolsUnlocked: false,
            },
            completedAt: null,
          },
        },
      };

      const response = await fetch(API_BASE, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('PersistentProfile: clear endpoint not available (404) - continuing with local storage');
          return false;
        }
        console.warn(`PersistentProfile: clear failed with HTTP ${response.status} - continuing with local storage`);
        return false;
      }

      console.log('PersistentProfile: cleared preferences (identity preserved)');
      this._trackEvent('profile_cleared');
      return true;
    } catch (error) {
      console.warn('PersistentProfile: clear failed (network or auth error) - continuing with local storage', error.message);
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
   * Maps users table back to flat structure
   * @returns {Promise<Object|null>}
   */
  static async getFlatProfile() {
    try {
      const data = await this.load();
      if (!data) {
        return null;
      }

      const gameProfile = data._game_profile || {};
      const identityForge = gameProfile['identity-forge'] || { preferences: {}, progress: {} };
      const wayfindingWorld = gameProfile['wayfinding-world'] || { preferences: {}, progress: {} };
      const missionTooling = gameProfile['mission-tooling'] || { progress: {} };

      return {
        // Identity (from users table columns)
        name: data._name || '',
        email: data._email || '',
        githubID: data._uid || '',  // _uid maps back to githubID
        
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
        
        // Metadata
        localId: gameProfile.localId || null,
        createdAt: gameProfile.createdAt || '',
        updatedAt: gameProfile.updatedAt || '',
        eventId: gameProfile.eventId || 0,
        version: gameProfile.version || VERSION,
      };
    } catch (error) {
      console.error('PersistentProfile: getFlatProfile failed', error);
      return null;
    }
  }

  /**
   * Migrate local profile to persistent profile
   * Preserves all local data including local ID
   * Maps to users table structure
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
        console.warn('PersistentProfile: user not authenticated - cannot migrate to server');
        return false;
      }

      console.log('PersistentProfile: migrating local profile', localData.localId);

      const migrated = {
        ...localData,
        // Override with authenticated user info
        name: userInfo.name || localData.name,
        email: userInfo.email || localData.email,
        githubID: userInfo.uid || localData.githubID,
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
