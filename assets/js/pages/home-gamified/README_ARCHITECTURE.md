# Profile System - MVC Architecture

## Overview

Clean MVC architecture with **localStorage-first persistence** and **async backend analytics**. All user state lives in localStorage for instant performance. Backend provides instructor analytics and cross-device recovery.

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
│  │  localStorage-first with async backend analytics sync           │       │
│  │                                                                 │       │
│  │  ✓ async initialize()     - Load from localStorage, check auth  │       │
│  │  ✓ async saveIdentity()   - Write localStorage + async backend  │       │
│  │  ✓ async saveAvatar()     - Write localStorage + async backend  │       │
│  │  ✓ async saveTheme()      - Write localStorage + async backend  │       │
│  │  ✓ async updateProgress() - Write localStorage + async backend  │       │
│  │  ✓ exists() / getProfile() - Read from localStorage only        │       │
│  │  ✓ async clear()          - Clear localStorage, reset backend   │       │
│  │  ✓ getAuthStatus()        - Return auth state + sync health     │       │
│  │                                                                 │       │
│  │  Properties:                                                    │       │
│  │  • isAuthenticated: boolean   (/api/id status)                  │       │
│  │  • syncFailureCount: number   (analytics sync errors)           │       │
│  │  • lastSyncTime: timestamp    (last successful backend write)   │       │
│  └──────────────────────────┬───────────────────────────────────────┘       │
│                             │                                                │
│                             │  ALWAYS                                        │
│  ┌──────────────────────────▼───────────────┐                               │
│  │  localProfile.js                         │                               │
│  │  ────────────────                        │                               │
│  │  PRIMARY: Source of truth for ALL users  │                               │
│  │                                           │                               │
│  │  Storage:                                 │                               │
│  │  • localStorage (instant, reliable)       │                               │
│  │  • Key: ocs_local_profile                 │                               │
│  │  • Structure: flat top-level fields       │                               │
│  │    name, email, githubID + game_profile  │                               │
│  │  • game_profile: blob organized by level  │                               │
│  │    - identity-forge (includes avatar)    │                               │
│  │    - wayfinding-world                    │                               │
│  │    - mission-tooling                     │                               │
│  │  • Includes: lastModified timestamp       │                               │
│  │                                           │                               │
│  │  Methods:                                 │                               │
│  │  • save(data)         - Sync write        │                               │
│  │  • load()             - Sync read         │                               │
│  │  • update(partial)    - Merge and save    │                               │
│  │  • clear()            - FULL WIPE         │                               │
│  │  • exists()           - Check presence    │                               │
│  │  • getFlatProfile()   - Flatten structure │                               │
│  └───────────────────┬───────────────────────┘                               │
│                      │                                                       │
│                      │  IF AUTHENTICATED (async, non-blocking)               │
│                      │                                                       │
│  ┌───────────────────▼──────────────────────────────────┐                   │
│  │  persistentProfile.js                                │                   │
│  │  ─────────────────                                   │                   │
│  │  SECONDARY: Analytics copy for instructors           │                   │
│  │                                                      │                   │
│  │  Storage:                                            │                   │
│  │  • Python Flask API (SQLAlchemy)                     │                   │
│  │  • Endpoints: /api/profile/game, /api/id            │                   │
│  │  • Database: users table (existing)                  │                   │
│  │    - id (primary key, not in localStorage)           │                   │
│  │    - _name, _email (mapped from localStorage)        │                   │
│  │    - _uid (stores githubID from localStorage)        │                   │
│  │    - _sid, _password, _role, _pfp, _school          │                   │
│  │    - _grade_data, _ap_exam, _class (JSON)           │                   │
│  │    - _game_profile (NEW JSON column for game data)  │                   │
│  │  • _game_profile structure matches localStorage     │                   │
│  │                                                      │                   │
│  │  Auth: JWT cookies required                          │                   │
│  │                                                      │                   │
│  │  Methods (async, best-effort):                       │                   │
│  │  • static async load()         - Fetch from backend  │                   │
│  │  • static async save(data)     - Upload with CRC     │                   │
│  │  • static async update(data)   - Partial update      │                   │
│  │  • static async clear()        - Reset (keeps ID)    │                   │
│  │      └─> PRESERVES id, _name, _email, _uid          │                   │
│  │          only clears _game_profile (game data)      │                   │
│  │  • static async isAuthenticated() - Check JWT        │                   │
│  │  • static async getFlatProfile() - Backend read      │                   │
│  │                                                      │                   │
│  │  Purpose:                                            │                   │
│  │  ✓ Instructor dashboard analytics                    │                   │
│  │  ✓ Cross-device recovery                             │                   │
│  │  ✓ Progress tracking and reporting                   │                   │
│  │  ✗ NOT required for game to function                 │                   │
│  └──────────────────────────────────────────────────────┘                   │
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
│  │  (Game messages/toasts use separate UI panel)                    │       │
│  │                                                                  │       │
│  │  ┌─────────────────────────────────────────────────────────┐    │       │
│  │  │  👤 John Doe                               🟢 200  ▼   │    │       │
│  │  │     ────────                                ────────      │    │       │
│  │  │     Name from profile           Summative status code   │    │       │
│  │  └──────────────────────────────────┬───────────────────────┘    │       │
│  │                                     │                             │       │
│  │  ┌──────────────────────────────────▼───────────────────────┐    │       │
│  │  │  Profile Status                                        │    │       │
│  │  │  ──────────────                                        │    │       │
│  │  │  Name: John Doe                                         │    │       │
│  │  │  Email: john@example.com                                │    │       │
│  │  │  GitHub: jm1021                                         │    │       │
│  │  │                                                          │    │       │
│  │  │  Status Indicators:                                     │    │       │
│  │  │  🟢 200  Registered user                                │    │       │
│  │  │  🟢 200  Online (backend reachable)                     │    │       │
│  │  │  🟢 200  Last sync: 2 min ago (2026-04-09 14:50)        │    │       │
│  │  │                                                          │    │       │
│  │  │  Recent Activity:                                       │    │       │
│  │  │  • 200 Profile saved (14:50:41)                         │    │       │
│  │  │  • 200 Avatar updated (14:49:52)                        │    │       │
│  │  │                                                          │    │       │
│  │  │  ID: local_1775746188941_biguq1t                        │    │       │
│  │  │  ─────────────────────────────────────────────           │    │       │
│  │  │  🗑️  Clear Profile                                      │    │       │
│  │  └──────────────────────────────────────────────────────────┘    │       │
│  │                                                                  │       │
│  │  Status Code System (Engineering-Focused):                      │       │
│  │  ────────────────────────────────────────                       │       │
│  │  • 🟢 200: Success (Registered, Online, Synced)                  │       │
│  │  • ⚠️  401: Unregistered (not logged in, local-only)            │       │
│  │  • ⚠️  4xx: Client errors (offline, sync pending)               │       │
│  │  • 🔴 5xx: Server errors (backend down, sync failed)             │       │
│  │  • 🔴 ERR: Never synced (no backend connection established)      │       │
│  │                                                                  │       │
│  │  Summative Status (Header Badge):                               │       │
│  │  • 🟢 200: All systems operational                               │       │
│  │  • ⚠️  4xx: Warning state (show most relevant error)            │       │
│  │  • 🔴 5xx: Critical state (show most recent error)              │       │
│  │                                                                  │       │
│  │  Features:                                                       │       │
│  │  • Real-time status updates on dropdown open                    │       │
│  │  • Error log with timestamps (last 5-10 events)                 │       │
│  │  • Clear profile with confirmation                              │       │
│  │  • Dropdown menu toggle                                          │       │
│  │  • Color-coded indicators: Green, Yellow, Red                   │       │
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

## Profile Data Structure

### localStorage Structure (ocs_local_profile)

```javascript
{
  // Top-level identity fields (flattened for easy access)
  "name": "John M",
  "email": "jmort1021@gmail.com",
  "githubID": "jm1021",  // Note: githubID not github
  
  // Metadata
  "version": "1.0",
  "localId": "local_1775746188941_biguq1t",
  "createdAt": "2026-04-09T14:49:48.941Z",
  "updatedAt": "2026-04-09T14:50:41.786Z",
  
  // Game data organized by level
  "game_profile": {
    "identity-forge": {
      "preferences": {
        "sprite": "Miku",
        "spriteMeta": {
          "src": "/images/platformer/sprites/miku.png",
          "width": 46,
          "height": 52.5
        }
      },
      "progress": {
        "identityUnlocked": true,
        "avatarSelected": true
      },
      "completedAt": "2026-04-09T14:49:52.000Z"
    },
    "wayfinding-world": {
      "preferences": {
        "theme": "Forest"
      },
      "progress": {
        "worldThemeSelected": true,
        "navigationComplete": false
      },
      "completedAt": null
    },
    "mission-tooling": {
      "progress": {
        "toolsUnlocked": false
      },
      "completedAt": null
    }
  }
}
```

### Backend Database Structure (users table - SQLAlchemy)

```python
# Existing users table with new _game_profile column
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    _name = db.Column(db.String(255), unique=False, nullable=False)
    _uid = db.Column(db.String(255), unique=True, nullable=False)  # stores githubID
    _email = db.Column(db.String(255), unique=False, nullable=False)
    _sid = db.Column(db.String(255), unique=False, nullable=True)  # student ID
    _password = db.Column(db.String(255), unique=False, nullable=False)
    _role = db.Column(db.String(20), default="User", nullable=False)
    _pfp = db.Column(db.String(255), unique=False, nullable=True)  # profile pic
    _grade_data = db.Column(db.JSON, unique=False, nullable=True)
    _ap_exam = db.Column(db.JSON, unique=False, nullable=True)
    _class = db.Column(db.JSON, unique=False, nullable=True)
    _school = db.Column(db.String(255), default="Unknown", nullable=True)
    
    # NEW: Gamified home interface data
    _game_profile = db.Column(db.JSON, unique=False, nullable=True)
```

**_game_profile JSON structure** (stored in users table):
```javascript
{
  "version": "1.0",
  "localId": "local_1775746188941_biguq1t",  // Preserved from localStorage
  "createdAt": "2026-04-09T14:49:48.941Z",
  "updatedAt": "2026-04-09T14:50:41.786Z",
  "lastModified": 1680000000000,  // Timestamp for sync conflict resolution
  
  // Game levels (matches localStorage structure)
  "identity-forge": {
    "preferences": { "sprite": "Miku", "spriteMeta": {...} },
    "progress": { "identityUnlocked": true, "avatarSelected": true },
    "completedAt": "2026-04-09T14:49:52.000Z"
  },
  "wayfinding-world": {
    "preferences": { "theme": "Forest" },
    "progress": { "worldThemeSelected": true, "navigationComplete": false },
    "completedAt": null
  },
  "mission-tooling": {
    "progress": { "toolsUnlocked": false },
    "completedAt": null
  }
}
```

### Data Flow: localStorage ↔ Backend

```javascript
// Save to localStorage (immediate)
const profile = {
  name: "John M",
  email: "jmort1021@gmail.com",
  githubID: "jm1021",
  version: "1.0",
  localId: "local_1775746188941_biguq1t",
  createdAt: "2026-04-09T14:49:48.941Z",
  updatedAt: Date.now(),
  game_profile: {
    "identity-forge": { /* preferences + progress */ },
    "wayfinding-world": { /* preferences + progress */ },
    "mission-tooling": { /* progress */ }
  }
};
localStorage.setItem('ocs_local_profile', JSON.stringify(profile));

// Sync to backend (async, if authenticated)
if (isAuthenticated) {
  // Map to users table structure
  await fetch('/api/profile/game', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _name: profile.name,
      _email: profile.email,
      _uid: profile.githubID,  // githubID maps to _uid column
      _game_profile: {
        version: profile.version,
        localId: profile.localId,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        lastModified: Date.now(),
        ...profile.game_profile  // Spread game-level data
      }
    })
  });
}
```

### Key Design Decisions

1. **Integrated with existing users table**:
   - Game data is another view of student (user-friendly interface)
   - Leverages existing authentication and user management
   - _name, _email, _uid already exist for identity
   - _game_profile added as new JSON column

2. **_uid stores githubID**:
   - localStorage uses githubID, maps to _uid in backend
   - Unique constraint on _uid for user lookups
   - Consistent with existing user table structure

3. **_game_profile for game data**:
   - Flexible schema - add new game levels without DB migrations
   - Three levels: identity-forge, wayfinding-world, mission-tooling
   - Avatar selection is part of identity-forge (not separate level)
   - JSON structure mirrors localStorage for easy sync

4. **id vs localId**:
   - Backend uses id as primary key (existing users table)
   - localStorage uses localId for tracking (anonymous/guest users)
   - localId preserved in _game_profile for analytics

5. **Other user columns remain untouched**:
   - _grade_data, _ap_exam, _class continue to function
   - Game interface is additive, doesn't replace existing data
   - Instructor can see both traditional gradebook and game progress

## Initialization Flow (localStorage-First)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ProfileManager.initialize() - localStorage-First Load                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START                                                                       │
│    │                                                                          │
│    ├─> STEP 1: ALWAYS try localStorage first (instant)                      │
│    │   │                                                                      │
│    │   ├─> LocalProfile.load()                                              │
│    │   │   └─> localStorage.getItem('ocs_local_profile')                    │
│    │   │                                                                      │
│    │   ├─────┬─> Profile exists in localStorage                             │
│    │   │     │   │                                                            │
│    │   │     │   ├─> Parse and validate data                                │
│    │   │     │   ├─> Store: this.profile = data                             │
│    │   │     │   └─> GO TO STEP 2 (check auth for sync)                     │
│    │   │     │                                                                │
│    │   │     └─> localStorage empty (new device or cleared)                 │
│    │   │         └─> GO TO STEP 2 (may restore from backend)                │
│    │   │                                                                      │
│    │   │                                                                      │
│    ├─> STEP 2: Check authentication status (for analytics)                  │
│    │   │                                                                      │
│    │   ├─> await PersistentProfile.isAuthenticated()                        │
│    │   │   └─> GET /api/id (check JWT cookie)                               │
│    │   │                                                                      │
│    │   ├─────┬─> 200 OK: User authenticated                                 │
│    │   │     │   │                                                            │
│    │   │     │   ├─> Set: isAuthenticated = true                            │
│    │   │     │   ├─> Update widget: 🟢 Analytics ON                         │
│    │   │     │   │                                                            │
│    │   │     │   └─> If localStorage was empty:                             │
│    │   │     │       │                                                        │
│    │   │     │       ├─> Try: await PersistentProfile.load()                │
│    │   │     │       │   └─> GET /api/profile/game                          │
│    │   │     │       │                                                        │
│    │   │     │       ├─────┬─> Backend has profile (recovery scenario)      │
│    │   │     │       │     │   │                                              │
│    │   │     │       │     │   ├─> Restore to localStorage                  │
│    │   │     │       │     │   │   └─> LocalProfile.save(backendData)       │
│    │   │     │       │     │   │                                              │
│    │   │     │       │     │   ├─> Store: this.profile = backendData        │
│    │   │     │       │     │   └─> Return: backendData (device recovery!)   │
│    │   │     │       │     │                                                  │
│    │   │     │       │     └─> Backend empty (new authenticated user)       │
│    │   │     │       │         └─> Return: null (start fresh)               │
│    │   │     │       │                                                        │
│    │   │     │       └─> localStorage already had data:                     │
│    │   │     │           │                                                    │
│    │   │     │           ├─> Compare timestamps                             │
│    │   │     │           ├─> Use NEWER data (localStorage usually wins)     │
│    │   │     │           └─> Sync newer data to backend (best-effort)       │
│    │   │     │                                                                │
│    │   │     └─> 401 Unauthorized: Guest user                               │
│    │   │         │                                                            │
│    │   │         ├─> Set: isAuthenticated = false                           │
│    │   │         ├─> Update widget: ⚠️ 401 (Unregistered)                   │
│    │   │         └─> Continue with localStorage data (if any)               │
│    │   │                                                                      │
│    │   │                                                                      │
│    └─> RETURN: this.profile (from localStorage or recovered from backend)   │
│                                                                              │
│  KEY PRINCIPLE: localStorage is always authoritative.                       │
│                 Backend is for analytics & recovery only.                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## New Device Recovery Scenario

**Scenario**: Student logs in from school computer after working at home.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Device Recovery Flow: Backend → localStorage                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DEVICE A (Home Computer):                                                   │
│  ┌────────────────────────────────────────────┐                             │
│  │ localStorage: ocs_local_profile            │                             │
│  │ {                                          │                             │
│  │   name: "Alice",                           │                             │
│  │   email: "alice@example.com",              │                             │
│  │   githubID: "alice2024",                   │                             │
│  │   localId: "local_1234567890_abc",         │                             │
│  │   createdAt: "2026-04-09T10:00:00Z",       │                             │
│  │   updatedAt: "2026-04-09T14:30:00Z",       │                             │
│  │   game_profile: {                          │                             │
│  │     "identity-forge": {                    │                             │
│  │       preferences: { sprite: "Knight", spriteMeta: {...} },              │
│  │       progress: {                          │                             │
│  │         identityUnlocked: true,            │                             │
│  │         avatarSelected: true               │                             │
│  │       }                                    │                             │
│  │     },                                     │                             │
│  │     "wayfinding-world": {                  │                             │
│  │       preferences: { theme: "Forest" },    │                             │
│  │       progress: { worldThemeSelected: true }│                            │
│  │     },                                     │                             │
│  │     "mission-tooling": {                   │                             │
│  │       progress: { toolsUnlocked: false }   │                             │
│  │     }                                      │                             │
│  │   }                                        │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                     │                                                         │
│                     │ (User was logged in, async sync succeeded)             │
│                     ▼                                                         │
│  ┌────────────────────────────────────────────┐                             │
│  │ Backend Database: users table              │                             │
│  │ {                                          │                             │
│  │   id: 42,                                  │                             │
│  │   _name: "Alice",                          │                             │
│  │   _email: "alice@example.com",             │                             │
│  │   _uid: "alice2024",  // githubID          │                             │
│  │   _sid: "12345",                           │                             │
│  │   _role: "Student",                        │                             │
│  │   _school: "Del Norte High School",        │                             │
│  │   _game_profile: {  // JSON column         │                             │
│  │     localId: "local_1234567890_abc",       │                             │
│  │     createdAt: "2026-04-09T10:00:00Z",     │                             │
│  │     updatedAt: "2026-04-09T14:30:00Z",     │                             │
│  │     lastModified: 1680000000000,           │                             │
│  │     "identity-forge": {                    │                             │
│  │       preferences: { sprite: "Knight", ... },                            │
│  │       progress: {                          │                             │
│  │         identityUnlocked: true,            │                             │
│  │         avatarSelected: true               │                             │
│  │       }                                    │                             │
│  │     },                                     │                             │
│  │     "wayfinding-world": {                  │                             │
│  │       progress: { worldThemeSelected: true }│                            │
│  │     },                                     │                             │
│  │     "mission-tooling": {                   │                             │
│  │       progress: { toolsUnlocked: false }   │                             │
│  │     }                                      │                             │
│  │   },                                       │                             │
│  │   _grade_data: {...},  // existing columns │                             │
│  │   _ap_exam: {...},                         │                             │
│  │   _class: {...}                            │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                     │                                                         │
│                     │                                                         │
│  ═══════════════════════════════════════════════════════════════            │
│                     │                                                         │
│  DEVICE B (School Computer):                                                 │
│  Student logs in → ProfileManager.initialize() runs                         │
│                     │                                                         │
│                     ├─> STEP 1: Check localStorage                          │
│                     │   └─> EMPTY (new device, never used)                  │
│                     │                                                         │
│                     ├─> STEP 2: Check authentication                        │
│                     │   ├─> GET /api/id → 200 OK (user logged in)          │
│                     │   └─> isAuthenticated = true                          │
│                     │                                                         │
│                     ├─> STEP 3: Recovery - Load from backend                │
│                     │   │                                                     │
│                     │   ├─> GET /api/profile/game                           │
│                     │   │   └─> Returns profile from Device A               │
│                     │   │                                                     │
│                     │   ├─> Restore to Device B localStorage                │
│                     │   │   └─> LocalProfile.save(backendData)              │
│                     │   │                                                     │
│                     │   └─> User sees their progress! (seamless)            │
│                     ▼                                                         │
│  ┌────────────────────────────────────────────┐                             │
│  │ Device B localStorage: ocs_local_profile   │                             │
│  │ {                                          │                             │
│  │   name: "Alice",                     ← From Device A (backend)           │
│  │   email: "alice@example.com",        ← From Device A (backend)           │
│  │   githubID: "alice2024",             ← From Device A (backend)           │
│  │   localId: "local_1234567890_abc",   ← Preserved from original!          │
│  │   createdAt: "2026-04-09T10:00:00Z", ← Original timestamp                │
│  │   updatedAt: "2026-04-09T14:30:00Z", ← Last update timestamp             │
│  │   game_profile: {                    ← From Device A                     │
│  │     "identity-forge": {                    │                             │
│  │       preferences: { sprite: "Knight", ... },                            │
│  │       progress: {                          │                             │
│  │         identityUnlocked: true,            │                             │
│  │         avatarSelected: true               │                             │
│  │       }                                    │                             │
│  │     },                                     │                             │
│  │     "wayfinding-world": {                  │                             │
│  │       progress: { worldThemeSelected: true }│                            │
│  │     },                                     │                             │
│  │     "mission-tooling": {                   │                             │
│  │       progress: { toolsUnlocked: false }   │                             │
│  │     }                                      │                             │
│  │   }                                        │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                     │                                                         │
│  ✓ All progress restored instantly                                          │
│  ✓ Original localId preserved for analytics                                 │
│  ✓ Student continues from where they left off                               │
│  ✓ Device B now syncs changes back to backend                               │
│                                                                              │
│  CRITICAL USE CASE (Home ↔ School):                                         │
│  • Student works at home → logs in → progress synced to backend             │
│  • Next day at school → logs in different computer → progress restored      │
│  • Completes assignments at school → synced to backend                      │
│  • Takes work home again → already has latest from school session           │
│  • Seamless cross-device experience without manual exports/imports          │
│  • Instructor sees consolidated activity across all devices                 │
│                                                                              │
│  SUBSEQUENT SAVES on Device B:                                               │
│                     │                                                         │
│                     ├─> localStorage.save() (instant)                       │
│                     └─> Backend.save() (async analytics)                    │
│                         └─> Instructor sees latest from either device       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Points:**

1. **Backend as Recovery Layer**: The backend stores the last known state for device recovery
2. **localStorage Always Wins**: Once recovered, Device B's localStorage becomes authoritative
3. **Transparent to Student**: They just log in and continue - no manual import needed
4. **Instructor Benefits**: Backend aggregates activity across all devices
5. **Cookie Loss Recovery**: If user clears cookies but localStorage intact, they can re-authenticate and sync resumes


## Backend Analytics Sync (Continuous)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Ongoing Analytics Sync - How Instructor Gets Data                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STUDENT ACTIVITY (Any Device):                                             │
│                                                                              │
│    User Action → localStorage (instant) ────┐                               │
│                                              │                               │
│                                              ├─> GUI updates                 │
│                                              │   Game continues immediately  │
│                                              │                               │
│    IF authenticated: ───────────────────────┘                               │
│       │                                                                       │
│       ├─> async PUT /api/profile/game                                       │
│       │   ├─> Payload: { data, lastModified: timestamp }                    │
│       │   │                                                                   │
│       │   ├─> Backend validates                                             │
│       │   │   ├─> Check JWT (user_id)                                       │
│       │   │   ├─> Verify data structure                                     │
│       │   │   └─> Compare timestamps (only save if newer)                   │
│       │   │                                                                   │
│       │   ├─> Save to database:                                             │
│       │   │   UPDATE game_profiles SET                                      │
│       │   │     preferences = ?,                                            │
│       │   │     progress = ?,                                               │
│       │   │     last_modified = ?                                           │
│       │   │   WHERE user_id = ?                                             │
│       │   │                                                                   │
│       │   └─> Response: { success: true, saved: data }                      │
│       │       └─> Frontend verifies (CRC-style check)                       │
│       │                                                                       │
│       └─> On failure:                                                       │
│           ├─> Increment syncFailureCount                                    │
│           ├─> Log for debugging                                             │
│           └─> NO user impact (localStorage still has data)                  │
│                                                                              │
│                                                                              │
│  INSTRUCTOR DASHBOARD:                                                       │
│                                                                              │
│    GET /api/instructor/class/progress                                       │
│      │                                                                        │
│      ├─> SELECT * FROM game_profiles                                        │
│      │     WHERE user_id IN (class_roster)                                  │
│      │                                                                        │
│      └─> Returns aggregated data:                                           │
│          ┌─────────────────────────────────────────┐                        │
│          │ Student    | Progress      | Last Active│                        │
│          ├─────────────────────────────────────────┤                        │
│          │ Alice      | 75% complete  | 5 min ago  │                        │
│          │ Bob        | 50% complete  | 1 hour ago │                        │
│          │ Charlie    | 90% complete  | Just now   │                        │
│          └─────────────────────────────────────────┘                        │
│                                                                              │
│  ✓ Backend has near-real-time student activity                              │
│  ✓ Instructor sees who's stuck, who's progressing                           │
│  ✓ Analytics continue even if occasional sync fails                         │
│  ✓ Student experience never affected by backend issues                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Migration Flow (First Login)

When a local-only user logs in for the first time:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Migration Flow: Local-Only → Authenticated                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BEFORE LOGIN (Guest Student):                                               │
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
│  │   },                                       │                             │
│  │   lastModified: 1680000000000              │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                                                                              │
│  STUDENT LOGS IN → ProfileManager.initialize() runs                        │
│  │                                                                            │
│  ├─> STEP 1: Load from localStorage (instant)                              │
│  │   └─> Profile found with all progress                                   │
│  │                                                                            │
│  ├─> STEP 2: Check authentication                                          │
│  │   ├─> GET /api/id → 200 OK (now authenticated)                          │
│  │   ├─> isAuthenticated = true                                            │
│  │   └─> Widget shows: 🟢 Analytics ON                                     │
│  │                                                                            │
│  ├─> STEP 3: Check backend for existing profile                            │
│  │   ├─> GET /api/profile/game → 404 (new authenticated user)             │
│  │   └─> Backend has no profile yet                                        │
│  │                                                                            │
│  └─> STEP 4: Sync localStorage to backend (analytics starts)               │
│      │                                                                        │
│      ├─> Read current localStorage data                                    │
│      ├─> Add authenticated user info from /api/id                          │
│      ├─> POST to /api/profile/game with merged data                        │
│      │   └─> Includes: lastModified timestamp                              │
│      │                                                                        │
│      └─> Backend save succeeds                                             │
│          └─> localStorage REMAINS UNTOUCHED (still source of truth)        │
│                                                                              │
│  AFTER LOGIN:                                                                │
│                                                                              │
│  ┌────────────────────────────────────────────┐                             │
│  │ localStorage: UNCHANGED (still primary)    │                             │
│  │ {                                          │                             │
│  │   localId: "local_1234567890_abc",         │                             │
│  │   identity: { name: "Player1", ... },      │                             │
│  │   preferences: { sprite: "Knight", ... },  │                             │
│  │   progress: { ... },                       │                             │
│  │   lastModified: 1680000000000              │                             │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│              │                                                                │
│              │ (Async sync established)                                      │
│              ▼                                                                │
│  ┌────────────────────────────────────────────┐                             │
│  │ Backend Database: game_profiles (NEW)     │                             │
│  │ {                                          │                             │
│  │   user_id: 123,                  ← From /api/id JWT                      │
│  │   identity: {                              │                             │
│  │     name: "John Doe",            ← From /api/id                          │
│  │     email: "john@example.com",   ← From /api/id                          │
│  │     github: "player1"            ← From localStorage                     │
│  │   },                                       │                             │
│  │   preferences: {                 ← From localStorage                     │
│  │     sprite: "Knight",                      │                             │
│  │     theme: "Forest"                        │                             │
│  │   },                                       │                             │
│  │   progress: {                    ← From localStorage                     │
│  │     identityUnlocked: true,                │                             │
│  │     avatarForgeDone: true,                 │                             │
│  │     worldThemeDone: true                   │                             │
│  │   },                                       │                             │
│  │   metadata: {                              │                             │
│  │     localId: "local_1234567890_abc",  ← PRESERVED for tracking!         │
│  │     firstSync: 1680000100000          ← When they logged in             │
│  │   },                                       │                             │
│  │   lastModified: 1680000000000    ← Matches localStorage                 │
│  │ }                                          │                             │
│  └────────────────────────────────────────────┘                             │
│                                                                              │
│  ✓ All progress preserved in localStorage (untouched)                       │
│  ✓ Backend now has analytics copy                                           │
│  ✓ Original local ID maintained for tracking guest → auth transition       │
│  ✓ Seamless - user sees 🟢 indicator, game continues normally              │
│  ✓ Future writes go to BOTH: localStorage (instant) + backend (async)      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Architecture Principles

### 1. Separation of Concerns (MVC)

- **MODEL**: ProfileManager + LocalProfile + PersistentProfile (all persistence logic)
- **VIEW**: HTML widgets with auth indicators and UI components
- **CONTROLLER**: Game logic (GameLevelCssePath.js)

**Benefit**: Game controller stays simple (~40 lines of profile code), complexity hidden in MODEL layer.

### 2. localStorage as Source of Truth

All user state lives in localStorage for instant performance:

```javascript
// ALWAYS writes to localStorage first (instant)
await profileManager.saveIdentity({ name, email, github });
// → localStorage updated in ~1-5ms
// → UI refreshes immediately
// → Backend sync happens async (if authenticated)
```

**Benefit**: Zero network latency for user actions. Game feels instant regardless of connection.

### 3. Backend as Analytics Layer

PersistentProfile exists solely for instructor visibility and device recovery:

```javascript
// Backend sync is best-effort, non-blocking
if (isAuthenticated) {
  _syncToBackend(data).catch(err => {
    // Log warning, but don't block user
    console.warn('Analytics sync failed:', err);
  });
}
```

**Benefit**: Backend failures never impact student experience. Instructor gets 95%+ analytics coverage.

### 4. Timestamp-Based Consistency

lastModified timestamps prevent stale writes:

```javascript
// localStorage always includes write timestamp
LocalProfile.save({ ...data, lastModified: Date.now() });

// Backend only saves if timestamp is newer
if (incomingData.lastModified > storedData.lastModified) {
  saveToDatabase(incomingData);
}
```

**Benefit**: Power loss, network failures, race conditions all handled safely. Newest data always wins.

### 5. Automatic Device Recovery

No manual export/import needed:

```javascript
// New device: localStorage empty → restore from backend
const state = await profileManager.initialize();
// → Checks localStorage first
// → If empty AND authenticated, pulls from backend
// → Restores to localStorage (becomes source of truth again)
```

**Benefit**: Students log in from any device and continue seamlessly. Cross-device "just works."

### 6. Auth Status Transparency

Users always know their sync state:

```javascript
// Widget displays real-time status
getAuthStatus() {
  return {
    isAuthenticated: boolean,      // 🟢 or 🔴
    lastSyncTime: timestamp,        // "2 minutes ago"
    syncFailureCount: number        // ⚠️ if > 3
  };
}
```

**Benefit**: Students know if instructor can see their progress. Clear feedback on sync health.

## Clear/Reset Behavior

**Important**: Reset behavior in localStorage-first architecture:

### ProfileManager.clear() - The Standard Way

```javascript
await profileManager.clear();
// Result: ALWAYS clears localStorage (instant UX reset)
//         IF authenticated: also clears backend (async)
//
// ✓ localStorage wiped immediately
// ✓ User sees fresh start instantly
// ✓ If logged in: backend cleared too (preserves identity for account safety)
// ✓ If guest: localStorage only (no backend to clear)
```

**Use case**: Student wants to start over with the game.

### Authentication-Aware Clearing

```javascript
// Authenticated User Reset:
await profileManager.clear();
// 1. localStorage.removeItem('ocs_local_profile') → INSTANT
// 2. Widget shows empty state immediately
// 3. async PUT /api/profile/game (reset to defaults, preserve identity)
// 4. User can start fresh, instructor still sees student exists

// Guest User Reset:
await profileManager.clear();
// 1. localStorage.removeItem('ocs_local_profile') → INSTANT
// 2. Widget shows empty state
// 3. No backend call (not authenticated)
// 4. Truly anonymous fresh start
```

### Safety Features

**Why preserve identity in backend for authenticated users?**

- Prevents accidental account deletion
- Instructor dashboard shows "Student reset game" event
- Account recovery possible if student regrets reset
- Compliance: student accounts tracked through academic year

**Why different?**

- Authenticated users have accounts - full deletion requires admin flow
- Prevents accidental account loss
- Preferences can be reset, identity is protected

## Data Flow: Save Operation (localStorage-First)

Example: User submits identity form

```
USER ACTION: Submit identity form
  │
  ├─> GameLevelCssePath.handleIdentitySubmit()
  │
  ├─────> profileManager.saveIdentity({ name, email, github })
          │
          ├─> STEP 1: ALWAYS write to localStorage (INSTANT)
          │   │
          │   ├─> Add timestamp: lastModified = Date.now()
          │   ├─> LocalProfile.save({ ...data, lastModified })
          │   │   └─> localStorage.setItem('ocs_local_profile', JSON)
          │   │       └─> Returns immediately (synchronous)
          │   │
          │   └─> profileManager._updateWidget()
          │       └─> window.updateLocalProfileWidget()
          │           └─> Widget UI refreshes with new data
          │               └─> USER SEES UPDATE (0-5ms latency)
          │
          ├─> STEP 2: IF authenticated, sync to backend (ASYNC, NON-BLOCKING)
          │   │
          │   ├─> Check: isAuthenticated?
          │   │
          │   └─────┬─> TRUE: Fire and forget backend sync
          │         │
          │         ├─> _syncToBackend(data, timestamp).catch(err => ...)
          │         │   │
          │         │   ├─> PUT /api/profile/game
          │         │   │   └─> Includes: lastModified timestamp
          │         │   │       └─> Body: { ...data, lastModified }
          │         │   │
          │         │   ├─────┬─> 200 OK: Success
          │         │   │     │   ├─> Verify response matches sent data (CRC)
          │         │   │     │   ├─> Update: lastSyncTime = Date.now()
          │         │   │     │   ├─> Reset: syncFailureCount = 0
          │         │   │     │   └─> Update widget: 🟢 Last sync: just now
          │         │   │     │
          │         │   │     ├─> 400/500: Backend error
          │         │   │     │   ├─> Increment: syncFailureCount++
          │         │   │     │   ├─> Log warning (non-critical)
          │         │   │     │   ├─> If count > 3: Show ⚠️ in widget
          │         │   │     │   └─> localStorage STILL HAS DATA (safe)
          │         │   │     │
          │         │   │     └─> Network timeout/offline
          │         │   │         ├─> Log: "Analytics offline, will retry"
          │         │   │         └─> NO user impact (game continues)
          │         │   │
          │         │   └─> Backend Response Verification (CRC-style):
          │         │       ├─> Response includes: { saved: data, timestamp }
          │         │       └─> Compare: saved.lastModified === sent.lastModified
          │         │           └─> If mismatch: Log warning, retry
          │         │
          │         └─────┴─> FALSE: User not logged in
          │                   └─> Skip backend sync (expected behavior)
          │                       └─> Widget shows: ⚠️ 401
          │
          └─> Return: true (success based on localStorage write)
                      ↑
                      └─ Function returns BEFORE backend finishes
                         User never waits for network
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

## Performance Characteristics

### User-Facing Performance (localStorage)

- **Reads**: ~1-2ms (synchronous localStorage.getItem)
- **Writes**: ~1-5ms (synchronous localStorage.setItem)
- **UI Updates**: Immediate (5-10ms total including DOM manipulation)
- **Quota**: 5-10MB per origin (plenty for profile data ~5-10KB)

**Result**: Instant feedback for all user actions regardless of network.

### Analytics Sync Performance (Backend)

- **Auth Check**: ~50-150ms (GET /api/id, cached by browser)
- **Profile Save**: ~100-300ms (PUT /api/profile/game)
- **Profile Load**: ~100-300ms (GET /api/profile/game)
- **Impact on User**: **ZERO** - happens asynchronously in background

**Result**: Instructor gets near-real-time data without slowing students.

### Edge Case Performance

| Scenario | User Impact | Backend Impact |
|----------|-------------|----------------|
| Network offline | None - localStorage works | Sync queued, retries later |
| Backend server down | None - localStorage works | Logged warning, continues |
| Slow connection (3G) | None - localStorage works | Sync takes 1-2s, non-blocking |
| Power loss mid-save | Safe - localStorage persists | Request lost, localStorage wins |
| localStorage quota full | Alert shown, export option | Backend has backup if authenticated |

### Scalability

- **Concurrent Users**: Backend handles N authenticated users, localStorage always instant
- **Network Bandwidth**: Minimal - only small JSON payloads (~5KB per sync)
- **Backend Load**: Reduced by localStorage - reads almost never hit backend
- **Database Writes**: Only on user actions (not polling), optimistic updates

## Security Architecture

### Client-Side Security (localStorage)

- **Vulnerability**: Anyone with browser access can edit localStorage
- **Mitigation**: Game data is non-sensitive (sprite choice, progress)
- **Acceptable Risk**: Educational game, not financial/medical data
- **Benefit**: Offline-first architecture, instant performance

**Why it's safe:**
```javascript
// Worst case: Student gives themself full progress
LocalProfile.save({ progress: { all: true } });
// Impact: They skip educational content (hurts them, not others)
// Instructor sees: Suspiciously fast progress in backend analytics
```

### Server-Side Security (Backend)

- **Authentication**: JWT cookies (httpOnly, secure, sameSite)
- **Authorization**: User can only access their own profile
- **Validation**: Backend validates all incoming data structure
- **Timestamps**: Prevents replay attacks, stale data overwrites

```javascript
// Backend validation
app.put('/api/profile/game', requireAuth, (req, res) => {
  const userId = req.user.id; // From JWT
  const profile = req.body;
  
  // Can only save to own profile
  if (profile.user_id && profile.user_id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Validate data structure
  if (!isValidProfileStructure(profile)) {
    return res.status(400).json({ error: 'Invalid profile data' });
  }
  
  // Timestamp check
  const existing = await getProfile(userId);
  if (existing && profile.lastModified <= existing.lastModified) {
    return res.status(409).json({ error: 'Stale data' });
  }
  
  await saveProfile(userId, profile);
  res.json({ success: true, saved: profile });
});
```

### Privacy Considerations

- **localStorage**: Device-local only, cleared when browser cache cleared
- **Backend**: Encrypted in transit (HTTPS), at rest (database encryption)
- **Instructor Access**: Limited to enrolled students, audit logged
- **Data Retention**: Configurable per institution (typically academic year)

### Clear/Reset Security

- **Authenticated Users**: Reset clears localStorage (instant), backend preserves identity
  - Prevents accidental account deletion
  - Instructor can see "reset event" for academic tracking
  - Account recovery possible if student regrets reset

- **Guest Users**: Full localStorage wipe, no backend record
  - True anonymity preserved
  - Fresh start possible anytime

### Audit Trail

Backend maintains metadata for instructor analytics:

```json
{
  "user_id": 42,
  "metadata": {
    "localId": "local_original_id",
    "firstSync": "2024-01-15T10:30:00Z",
    "lastSync": "2024-01-15T14:45:00Z",
    "deviceCount": 2,
    "resetCount": 0
  }
}
```

## Summary: Why localStorage-First + Analytics Backend?

### For Students (User Experience)

✅ **Instant Performance**
- All interactions feel native/offline-first
- No waiting for network on every save
- Game continues even when WiFi drops

✅ **Reliable Progress**
- localStorage persists through browser crashes, power loss
- Never lose progress due to backend downtime
- Clear visual indicator (🟢/🔴) of analytics sync status

✅ **Cross-Device Seamless**
- Log in from any device → progress restored automatically
- No manual export/import needed
- Works at home, school, library

✅ **Privacy Control**
- Guest mode: truly local, no tracking
- Authenticated mode: clear indication when instructor can see progress

### For Instructors (Analytics & Monitoring)

✅ **Real-Time Insights**
- Near-real-time student progress tracking
- See who's stuck, who's progressing
- Identify students who need help

✅ **95%+ Data Coverage**
- Occasional sync failures don't create data gaps
- Retry mechanisms and error logging
- Offline work syncs when connectivity restored

✅ **Audit Trail**
- Track guest → authenticated transitions
- See device usage patterns
- Monitor reset events (someone struggling?)

✅ **Low Maintenance**
- Backend failures don't trigger support requests
- Students never blocked by analytics issues
- Graceful degradation to local-only mode

### For Developers (Architecture Benefits)

✅ **Simple Mental Model**
```
Read:  localStorage (always)
Write: localStorage (always) → Backend (when authenticated, async)
```

✅ **Minimal API Surface**
```javascript
// Only 3 backend endpoints needed:
GET  /api/id                  // Auth check
GET  /api/profile/game        // Recovery only
PUT  /api/profile/game        // Analytics sync
```

✅ **Testable in Isolation**
- localStorage backend: unit testable, no network
- Backend sync: can be mocked/stubbed
- Clear separation of concerns

✅ **Future-Proof**
- Easy to add retry queues, conflict resolution
- Foundation for offline PWA features
- Can add Firebase/Supabase as third backend option

### Design Trade-Offs Made

| Decision | Why | Trade-Off Accepted |
|----------|-----|-------------------|
| localStorage as source of truth | Instant UX, offline-first | Students can tamper (low-risk game data) |
| Async backend sync | Non-blocking writes | Eventual consistency (acceptable for analytics) |
| Timestamps for consistency | Newest data wins | Clock skew possible (mitigated by NTP sync) |
| Preserve identity on backend reset | Prevent account loss | Can't fully delete authenticated accounts via UI |

### Key Metrics This Enables

**Student-facing:**
- Write latency: <5ms (localStorage)
- Read latency: <2ms (localStorage)
- Offline capability: 100%
- Cross-device recovery: Automatic on login

**Instructor-facing:**
- Analytics coverage: ~95-98% (with retry logic)
- Data freshness: <5 seconds (on authenticated saves)
- Backend uptime requirement: Relaxed (95% acceptable)
- Query latency: ~100-300ms (standard API response time)

---

This architecture prioritizes **student experience** (instant, reliable) while providing **instructor value** (analytics, monitoring) without requiring perfect backend uptime. It's optimized for the educational use case where engagement and progress tracking matter more than millisecond-perfect consistency.
