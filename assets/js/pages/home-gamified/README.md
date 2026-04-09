# Profile System - Local & Persistent Storage

## Overview

Dual-backend profile system for home-gamified experiences with automatic authentication detection and seamless local→persistent migration.

- **Local Profile**: localStorage-based (no auth required)
- **Persistent Profile**: Backend API storage (authenticated users)
- **Auto-Migration**: Preserves progress when users log in

## Quick Start

### 1. Include Widget (optional)

```html
{% include home-gamified/local_profile.html %}
```

### 2. Initialize ProfileManager

```javascript
import ProfileManager from '/assets/js/pages/home-gamified/ProfileManager.js';

class GameLevel {
  constructor() {
    this.profileManager = new ProfileManager();
    
    // Initialize async (auto-detects local vs persistent)
    this.profileManager.initialize().then(state => {
      if (state) {
        console.log('Restored:', state);
        // Use state.profileData and state.identityState
      }
    });
  }
  
  async saveIdentity(name, email, github) {
    const success = await this.profileManager.saveIdentity({ name, email, github });
    return success;
  }
  
  async saveAvatar(sprite, spriteMeta) {
    const success = await this.profileManager.saveAvatar(sprite, spriteMeta);
    return success;
  }
  
  async saveTheme(theme, themeMeta) {
    const success = await this.profileManager.saveTheme(theme, themeMeta);
    return success;
  }
}
```

## File Structure

```text
assets/js/pages/home-gamified/
  ├── localProfile.js          # localStorage backend (MODEL)
  ├── persistentProfile.js     # API backend (MODEL)
  ├── ProfileManager.js        # Unified manager (MODEL)
  ├── README.md                # This file
  └── MVC_ARCHITECTURE.md      # Architecture diagrams

_includes/home-gamified/
  └── local_profile.html       # Profile widget (VIEW)

_sass/open-coding/forms/
  └── home-gamified.scss       # Widget styles
```

## Features

### ✅ Dual Backend Support

- **Local**: localStorage (works offline, no auth)
- **Persistent**: Backend API (cross-device, requires login)
- **Auto-detect**: ProfileManager routes to correct backend

### ✅ Seamless Migration

- User plays as local user → makes progress
- User logs in → profile auto-migrates to backend
- Original local ID preserved for analytics
- localStorage cleared after migration

### ✅ Profile Management

- **Save**: Create new profile
- **Update**: Modify existing profile  
- **Clear**: Reset (local = full wipe, persistent = preferences only)
- **Export/Import**: JSON backup/restore

### ✅ Identity Protection

- Local users: Full reset deletes everything
- Authenticated users: Clear preserves identity (name/email/github)
- Accounts require admin flow for full deletion

## API Reference

### ProfileManager

#### `async initialize()`

Auto-detects authentication and loads profile.

**Returns**: `Promise<Object|null>`

```javascript
{
  profileData: { name, email, github, sprite, theme, ... },
  identityState: { hasIdentity: true, identityData: {...} }
}
```

#### `async saveIdentity({ name, email, github })`

Save user identity information.

**Returns**: `Promise<boolean>` - Success status

#### `async saveAvatar(sprite, spriteMeta)`

Save sprite selection and metadata.

**Parameters**:

- `sprite`: String - Sprite name
- `spriteMeta`: Object - `{ name, src, rows, cols, scaleFactor, movementPreset }`

**Returns**: `Promise<boolean>`

#### `async saveTheme(theme, themeMeta)`

Save world theme selection.

**Parameters**:

- `theme`: String - Theme name
- `themeMeta`: Object - `{ name, src, compatibleSprites[] }`

**Returns**: `Promise<boolean>`

#### `async updateIdentityProgress(field, value)`

Update identity milestones.

**Example**:

```javascript
await profileManager.updateIdentityProgress('identityUnlocked', true);
```

#### `async updateAvatarProgress(field, value)`

Update avatar/sprite milestones.

#### `async updateThemeProgress(field, value)`

Update theme milestones.

#### `exists()`

Check if profile exists.

**Returns**: `boolean`

#### `async getProfile()`

Get current profile data.

**Returns**: `Promise<Object|null>`

#### `async clear()`

Clear profile (behavior differs by backend).

**Returns**: `Promise<boolean>`

#### `async export()`

Export profile as JSON.

**Returns**: `Promise<string|null>`

#### `async import(jsonString)`

Import profile from JSON.

**Returns**: `Promise<boolean>`

## Profile Data Structure

```javascript
{
  // Identity
  identity: {
    name: string,
    email: string,
    github: string
  },
  
  // Preferences
  preferences: {
    sprite: string,
    spriteMeta: {
      name: string,
      src: string,
      rows: number,
      cols: number,
      scaleFactor: number,
      movementPreset: string
    },
    theme: string,
    themeMeta: {
      name: string,
      src: string,
      compatibleSprites: string[]
    }
  },
  
  // Progress
  progress: {
    identityUnlocked: boolean,
    worldThemeDone: boolean,
    avatarForgeDone: boolean,
    // Add custom fields as needed
  },
  
  // Metadata
  metadata: {
    localId: string,           // Preserved after migration
    version: string,
    createdAt: string,         // ISO timestamp
    updatedAt: string
  }
}
```

## Backend Requirements (Persistent Profile)

ProfileManager automatically uses the backend API when users are authenticated. Requires these Python Flask endpoints:

### Authentication Check

```text
GET /api/id
Cookie: jwt=<token>

Response (authenticated):
{
  "uid": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "roles": [{ "name": "STUDENT" }]
}

Response (not authenticated):
401 Unauthorized
```

### Profile CRUD

```text
GET    /api/profile/game     - Load profile
POST   /api/profile/game     - Create profile (migration or new)
PUT    /api/profile/game     - Update profile
DELETE /api/profile/game     - Clear preferences only (identity preserved)
```

**Full API spec**: See backend implementation guide

### Database Schema (Recommendation)

```sql
CREATE TABLE game_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  identity TEXT NOT NULL,       -- JSON
  preferences TEXT NOT NULL,    -- JSON
  progress TEXT NOT NULL,       -- JSON
  metadata TEXT NOT NULL,       -- JSON (includes localId)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Integration Example

```javascript
import ProfileManager from '/assets/js/pages/home-gamified/ProfileManager.js';

export default class GameLevelCssePath {
  constructor() {
    this.profileManager = new ProfileManager();
    
    // Track if we've restored state
    this.profileRestored = false;
    
    // Initialize profile system
    this.profileManager.initialize().then(state => {
      if (state) {
        this.restoreFromProfile(state);
        this.profileRestored = true;
      }
    });
  }
  
  restoreFromProfile(state) {
    const { profileData } = state;
    
    // Restore identity terminal
    if (profileData.name) {
      this.identityTerminal.restore({
        name: profileData.name,
        email: profileData.email,
        github: profileData.github
      });
    }
    
    // Restore avatar selection
    if (profileData.sprite) {
      this.avatarTerminal.restore({
        sprite: profileData.sprite,
        spriteMeta: profileData.spriteMeta
      });
    }
    
    // Restore theme selection
    if (profileData.theme) {
      this.themeTerminal.restore({
        theme: profileData.theme,
        themeMeta: profileData.themeMeta
      });
    }
  }
  
  async handleIdentitySubmit() {
    const identityData = this.identityTerminal.getData();
    
    const success = await this.profileManager.saveIdentity({
      name: identityData.name,
      email: identityData.email,
      github: identityData.github
    });
    
    if (success) {
      await this.profileManager.updateIdentityProgress('identityUnlocked', true);
      this.unlockNextLevel();
    }
  }
  
  async handleAvatarSelect(sprite, spriteMeta) {
    const success = await this.profileManager.saveAvatar(sprite, spriteMeta);
    
    if (success) {
      await this.profileManager.updateAvatarProgress('avatarForgeDone', true);
      this.updateGameSprite(sprite, spriteMeta);
    }
  }
  
  async handleThemeSelect(theme, themeMeta) {
    const success = await this.profileManager.saveTheme(theme, themeMeta);
    
    if (success) {
      await this.profileManager.updateThemeProgress('worldThemeDone', true);
      this.updateGameTheme(theme, themeMeta);
    }
  }
}
```

## Local vs Persistent Behavior

| Feature | Local Profile | Persistent Profile |
|---------|---------------|-------------------|
| **Storage** | localStorage | Backend database |
| **Auth Required** | ❌ No | ✅ Yes (JWT) |
| **Cross-Device** | ❌ No | ✅ Yes |
| **Survives Browser Clear** | ❌ No | ✅ Yes |
| **clear() Behavior** | Full wipe | Preferences only |
| **Identity Protected** | ❌ No | ✅ Yes |
| **Migration Source** | ✅ Yes | N/A |
| **Async/Await** | Optional | Required |

## Troubleshooting

### Profile not loading

- **Local**: Check browser console for localStorage errors
- **Persistent**: Verify JWT cookie exists, check `/api/id` endpoint
- **Both**: Check `ProfileManager.initialize()` is awaited

### Migration not working

- Ensure user is authenticated before migration
- Check `/api/profile/game` POST endpoint is working
- Verify localStorage contains `ocs_local_profile` key before login

### Clear behavior unexpected

- **Local users**: `clear()` deletes everything (expected)
- **Authenticated users**: `clear()` keeps identity (expected behavior for safety)
- For full account deletion, use backend admin flow

### Widget not appearing

- Check include: `{% include home-gamified/local_profile.html %}`
- Verify profile exists: `LocalProfile.exists()` should return true
- Check SCSS imported: `@import 'open-coding/forms/home-gamified'`

### Import/Export failing

- Ensure exported JSON has correct structure
- Check version compatibility (`version: "1.0"`)
- Verify JSON is valid (use JSON validator)

## Advanced Usage

### Custom Progress Fields

Add custom tracking to the progress object:

```javascript
await profileManager.updateIdentityProgress('customMilestone', true);
await profileManager.updateAvatarProgress('spritePowerLevel', 42);
```

### Direct Backend Access (Advanced)

```javascript
import LocalProfile from '/assets/js/pages/home-gamified/localProfile.js';
import PersistentProfile from '/assets/js/pages/home-gamified/persistentProfile.js';

// Direct localStorage access
const localData = LocalProfile.getFlatProfile();

// Direct API access (only if authenticated)
const isAuth = await PersistentProfile.isAuthenticated();
if (isAuth) {
  const persistentData = await PersistentProfile.load();
}
```

### Manual Migration (Edge Cases)

```javascript
const localData = LocalProfile.getFlatProfile();
if (localData) {
  const success = await PersistentProfile.migrateFromLocal(localData);
  if (success) {
    LocalProfile.clear();
  }
}
```

## Architecture

See [MVC_ARCHITECTURE.md](MVC_ARCHITECTURE.md) for detailed architecture diagrams and data flow.
