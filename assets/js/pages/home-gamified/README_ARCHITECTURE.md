# Profile System - MVC Architecture

## Overview

Clean MVC architecture with dual-backend support (local + persistent) and automatic authentication detection.

```text
╔════════════════════════════════════════════════════════════════════════════╗
║                   PROFILE SYSTEM - MVC ARCHITECTURE                        ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ MODEL LAYER (Data & Persistence)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │  ProfileManager.js                                              │       │
│  │  ──────────────────                                             │       │
│  │  Unified API with automatic backend routing                     │       │
│  │                                                                 │       │
│  │  ✓ async initialize()     - Auto-detect auth, load profile      │       │
│  │  ✓ async saveIdentity()   - Save name/email/github              │       │
│  │  ✓ async saveAvatar()     - Save sprite selection               │       │
│  │  ✓ async saveTheme()      - Save world theme                    │       │
│  │  ✓ async updateProgress() - Update game milestones              │       │
│  │  ✓ exists() / getProfile() - Check/retrieve data                │       │
│  │  ✓ async clear()          - Reset (behavior differs by backend) │       │
│  │                                                                 │       │
│  │  Properties:                                                    │       │
│  │  • isAuthenticated: boolean                                     │       │
│  │  • backend: LocalProfile | PersistentProfile                    │       │
│  │  • restoredState: Object | null                                 │       │
│  └───────────────────────┬──────────────────┬──────────────────────┘       │
│                          │                  │                                │
│                          │                  │                                │
│  ┌───────────────────────▼──────┐  ┌────────▼───────────────────────┐       │
│  │  localProfile.js             │  │  persistentProfile.js          │       │
│  │  ────────────────             │  │  ────────────────              │       │
│  │  localStorage backend         │  │  Backend API storage           │       │
│  │                               │  │                                │       │
│  │  Storage:                     │  │  Storage:                      │       │
│  │  • localStorage               │  │  • Python Flask API            │       │
│  │  • Key: ocs_local_profile     │  │  • Endpoints: /api/profile/game│       │
│  │                               │  │                                │       │
│  │  Auth: None required          │  │  Auth: JWT cookies required    │       │
│  │                               │  │                                │       │
│  │  Methods:                     │  │  Methods (async):              │       │
│  │  • save()                     │  │  • static async load()         │       │
│  │  • load()                     │  │  • static async save()         │       │
│  │  • update()                   │  │  • static async update()       │       │
│  │  • clear() - FULL WIPE        │  │  • static async clear()        │       │
│  │  • exists()                   │  │    └─> PRESERVES IDENTITY      │       │
│  │  • getFlatProfile()           │  │  • static async isAuthenticated()     │
│  │  • export()                   │  │  • static async migrateFromLocal()    │
│  │  • import()                   │  │  • static async getFlatProfile()      │
│  └───────────────────────────────┘  └────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ VIEW LAYER (UI Components)                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  local_profile.html                                              │       │
│  │  ──────────────────                                               │       │
│  │  Fixed-position widget in top-right corner                       │       │
│  │                                                                  │       │
│  │  ┌─────────────────────────────────────────────────────────┐    │       │
│  │  │  👤 Local User                               ▼         │    │       │
│  │  └──────────────────────────────────┬───────────────────────┘    │       │
│  │                                     │                             │       │
│  │  ┌──────────────────────────────────▼───────────────────────┐    │       │
│  │  │  Profile                                               │    │       │
│  │  │  Name: John Doe                                         │    │       │
│  │  │  Email: john@example.com                                │    │       │
│  │  │  GitHub: johndoe                                        │    │       │
│  │  │                                                          │    │       │
│  │  │  ID: local_1234567890_abcdef                            │    │       │
│  │  │  ─────────────────────────────────────────────           │    │       │
│  │  │  📥 Export Profile                                      │    │       │
│  │  │  🔄 Start New Journey                                   │    │       │
│  │  └──────────────────────────────────────────────────────────┘    │       │
│  │                                                                  │       │
│  │  Features:                                                       │       │
│  │  • Auto-updates when profile changes                            │       │
│  │  • Export to JSON                                                │       │
│  │  • Reset confirmation dialog                                     │       │
│  │  • Dropdown menu toggle                                          │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER LAYER (Game Logic)                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  GameLevelCssePath.js (or your game controller)                 │       │
│  │  ────────────────────────────────────────────                    │       │
│  │  Orchestrates game flow and user interactions                   │       │
│  │                                                                  │       │
│  │  Responsibilities:                                               │       │
│  │  • Initialize ProfileManager                                     │       │
│  │  • Handle form submissions                                       │       │
│  │  • Call ProfileManager methods                                   │       │
│  │  • Update game state based on profile                            │       │
│  │  • Trigger level unlocks                                         │       │
│  │                                                                  │       │
│  │  Example Flow:                                                   │       │
│  │  1. constructor() - Create ProfileManager instance              │       │
│  │  2. async init() - Call profileManager.initialize()             │       │
│  │  3. Restore state if profile exists                             │       │
│  │  4. Handle user actions → save via ProfileManager               │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Authentication Detection & Backend Routing

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ProfileManager.initialize() - Backend Selection Flow                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START                                                                       │
│    │                                                                          │
│    ├─> Call PersistentProfile.isAuthenticated()                             │
│         │                                                                     │
│         ├─> GET /api/id (check JWT cookie)                                  │
│         │                                                                     │
│         ├─────┬─> 200 OK: User authenticated                                │
│         │     │                                                               │
│         │     ├─> Set: isAuthenticated = true                               │
│         │     ├─> Set: backend = PersistentProfile                          │
│         │     │                                                               │
│         │     ├─> Try: PersistentProfile.load()                             │
│         │     │   └─> GET /api/profile/game                                 │
│         │     │                                                               │
│         │     ├─────┬─> Profile exists: Return data                         │
│         │     │     │                                                         │
│         │     │     └─> Profile NOT found:                                  │
│         │     │         │                                                     │
│         │     │         ├─> Check LocalProfile.exists()                     │
│         │     │         │                                                     │
│         │     │         ├─────┬─> Local profile exists:                     │
│         │     │         │     │   ├─> migrateFromLocal()                    │
│         │     │         │     │   │   └─> POST /api/profile/game            │
│         │     │         │     │   ├─> LocalProfile.clear()                  │
│         │     │         │     │   └─> Return migrated data                  │
│         │     │         │     │                                               │
│         │     │         │     └─> No local profile:                         │
│         │     │         │         └─> Return null (new user)                │
│         │                                                                     │
│         └─────┴─> 401 Unauthorized: Guest user                              │
│                   │                                                           │
│                   ├─> Set: isAuthenticated = false                          │
│                   ├─> Set: backend = LocalProfile                           │
│                   │                                                           │
│                   ├─> Try: LocalProfile.load()                              │
│                   │   └─> localStorage.getItem('ocs_local_profile')         │
│                   │                                                           │
│                   ├─────┬─> Profile exists: Return data                     │
│                   │     │                                                     │
│                   │     └─> Profile NOT found: Return null (new user)       │
│                                                                              │
│  END                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Migration Flow (Local → Persistent)

When a local user logs in, their profile automatically migrates:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Migration Flow: Local → Persistent                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BEFORE LOGIN:                                                               │
│  ┌────────────────────────────────────────────┐                             │
│  │ localStorage: ocs_local_profile            │                             │
│  │ {                                          │                             │
│  │   localId: "local_1234567890_abc",         │                             │
│  │   identity: {                              │                             │
│  │     name: "Player1",                       │                             │
│  │     email: "player1@example.com",          │                             │
│  │     github: "player1"                      │                             │
│  │   },                                       │                             │
│  │   preferences: {                           │                             │
│  │     sprite: "Knight",                      │                             │
│  │     theme: "Forest"                        │                             │
│  │   },                                       │                             │
│  │   progress: {                              │                             │
│  │     identityUnlocked: true,                │                             │
│  │     avatarForgeDone: true,                 │                             │
│  │     worldThemeDone: true                   │                             │
│  │   }                                        │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                                                                              │
│  USER LOGS IN → ProfileManager.initialize() runs                           │
│  │                                                                            │
│  ├─> Detects authentication: isAuthenticated = true                        │
│  ├─> No persistent profile found in database                               │
│  ├─> Finds local profile in localStorage                                   │
│  └─> Triggers migration:                                                   │
│                                                                              │
│      1. Read local profile data                                             │
│      2. Get authenticated user info from /api/id                            │
│      3. Merge data (user info + local preferences)                          │
│      4. POST to /api/profile/game with merged data                          │
│      5. Verify backend save successful                                      │
│      6. Clear localStorage (localStorage.removeItem('ocs_local_profile'))   │
│                                                                              │
│  AFTER LOGIN:                                                                │
│  ┌────────────────────────────────────────────┐                             │
│  │ Backend Database: game_profiles            │                             │
│  │ {                                          │                             │
│  │   user_id: 123,                            │                             │
│  │   identity: {                              │                             │
│  │     name: "John Doe",           ← From /api/id                           │
│  │     email: "john@example.com",  ← From /api/id                           │
│  │     github: "player1"           ← From local                             │
│  │   },                                       │                             │
│  │   preferences: {                ← From local                             │
│  │     sprite: "Knight",                      │                             │
│  │     theme: "Forest"                        │                             │
│  │   },                                       │                             │
│  │   progress: {                   ← From local                             │
│  │     identityUnlocked: true,                │                             │
│  │     avatarForgeDone: true,                 │                             │
│  │     worldThemeDone: true                   │                             │
│  │   },                                       │                             │
│  │   metadata: {                              │                             │
│  │     localId: "local_1234567890_abc"  ← PRESERVED!                        │
│  │   }                                        │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                                                                              │
│  ✓ All progress preserved                                                   │
│  ✓ Original local ID maintained for analytics                               │
│  ✓ localStorage cleaned up automatically                                    │
│  ✓ Seamless transition - user doesn't notice                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Architecture Principles

### 1. Separation of Concerns (MVC)

- **MODEL**: ProfileManager + backends (all persistence logic)
- **VIEW**: HTML widgets and UI components
- **CONTROLLER**: Game logic (GameLevelCssePath.js)

**Benefit**: Game controller stays simple (~40 lines of profile code), complexity hidden in MODEL layer.

### 2. Backend Abstraction

ProfileManager provides unified API regardless of storage mechanism:

```javascript
// Same code works for both local and persistent users
await profileManager.saveIdentity({ name, email, github });
await profileManager.saveAvatar(sprite, spriteMeta);
```

**Benefit**: Game code doesn't need to know about authentication or storage details.

### 3. Async/Await Throughout

All ProfileManager methods return Promises for consistency:

```javascript
// Works with both sync (localStorage) and async (API) backends
const success = await profileManager.saveIdentity(data);
```

**Benefit**: Supports both backend types with single interface.

### 4. Automatic Migration

No manual migration code needed - happens automatically on login:

```javascript
// User logs in → initialize() auto-detects and migrates
const state = await profileManager.initialize();
// Local profile now in backend, localStorage cleared
```

**Benefit**: Seamless UX, no user action required.

## Clear Behavior Differences

Critical security feature: clear() behavior differs by backend.

### Local Profile (localStorage)

```javascript
LocalProfile.clear();
// Result: FULL WIPE
// ✓ Identity deleted (name, email, github)
// ✓ Preferences deleted (sprite, theme)
// ✓ Progress deleted (all milestones)
// ✓ Metadata deleted (localId, timestamps)
// localStorage completely empty
```

**Use case**: User wants fresh start, no account recovery needed.

### Persistent Profile (backend)

```javascript
await PersistentProfile.clear();
// Result: PREFERENCES ONLY
// ✗ Identity PRESERVED (name, email, github)
// ✓ Preferences cleared (sprite, theme reset)
// ✓ Progress cleared (milestones reset)
// ✗ Metadata PRESERVED (localId, timestamps)
```

**Use case**: User wants to reset game progress but keep account identity.

**Why different?**

- Authenticated users have accounts - full deletion requires admin flow
- Prevents accidental account loss
- Preferences can be reset, identity is protected

## Data Flow: Save Operation

Example: User submits identity form

```
USER ACTION: Submit identity form
  │
  ├─> GameLevelCssePath.handleIdentitySubmit()
  │
  ├─────> profileManager.saveIdentity({ name, email, github })
          │
          ├─> ProfileManager checks: isAuthenticated?
          │
          ├─────┬─> TRUE (authenticated):
          │     │   └─> await PersistentProfile.save(data)
          │     │       └─> PUT /api/profile/game
          │     │           └─> Backend saves to database
          │     │               └─> Return: 200 OK
          │     │
          │     └─> FALSE (local):
          │         └─> LocalProfile.save(data)
          │             └─> localStorage.setItem('ocs_local_profile', JSON)
          │                 └─> Return: true
          │
          └─> profileManager._updateWidget()
              └─> window.updateLocalProfileWidget()
                  └─> Widget UI refreshes
```

## Testing Architecture

### Unit Tests (Backend isolation)

```javascript
// Mock LocalProfile
class MockLocalProfile {
  static save(data) { return true; }
  static load() { return mockData; }
}

// Test ProfileManager with mock
const pm = new ProfileManager();
pm.backend = MockLocalProfile;
await pm.saveIdentity({ name: 'Test' });
```

### Integration Tests (Full flow)

```javascript
// Test migration flow
1. Create local profile
2. Log in (mock authentication)
3. Verify migration triggered
4. Verify localStorage cleared
5. Verify backend has data
```

## File Dependencies

```
ProfileManager.js
  ├─> imports localProfile.js
  └─> imports persistentProfile.js
      └─> imports /assets/js/api/config.js
          └─> exports fetchOptions, pythonURI

local_profile.html
  └─> imports localProfile.js

home-gamified.scss
  └─> styles for #home-local-profile-widget
```

## Future Extensions

### Easy to add:

- Third backend (e.g., Firebase, Supabase)
- Custom progress fields
- Profile versioning/history
- Multi-profile support
- Profile templates

### Pattern:

```javascript
// Add new backend
import NewBackend from './newBackend.js';

class ProfileManager {
  async initialize() {
    if (await NewBackend.isAvailable()) {
      this.backend = NewBackend;
    } else if (await PersistentProfile.isAuthenticated()) {
      this.backend = PersistentProfile;
    } else {
      this.backend = LocalProfile;
    }
  }
}
```

## Performance Considerations

- **Local**: Instant (localStorage is synchronous)
- **Persistent**: Network latency (~100-500ms per API call)
- **Migration**: Single POST request, happens once per user
- **Widget**: Updates on-demand, minimal DOM manipulation

## Security

- **Local**: No auth, anyone can edit localStorage (acceptable for non-sensitive game data)
- **Persistent**: JWT authentication, backend validates all requests
- **Clear protection**: Authenticated users can't accidentally delete identity
- **Migration**: Preserves original local ID for audit trail
