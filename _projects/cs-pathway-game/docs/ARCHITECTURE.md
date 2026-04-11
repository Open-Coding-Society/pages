---
layout: post
title: CS Pathway Game - MVC Architecture
description: MVC architecture and file organization for the CS Pathway Game project
categories: [CS Pathway Game]
permalink: /projects/cs-pathway-game/architecture
---

## Overview

```text
╔════════════════════════════════════════════════════════════════════════════╗
║                   PROFILE SYSTEM - MVC ARCHITECTURE                        ║
╚════════════════════════════════════════════════════════════════════════════╝

## File Organization

The CS Pathway game implements MVC architecture across the following file structure:

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CS PATHWAY GAME ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📂 /_notebooks/home/                                   [ENTRY POINT]        │
│     └─ 2026-04-02-home2-gamified-mvp.ipynb                                  │
│        • Launches the CS Pathway Game                                       │
│        • Provides journey from landing page to gamified course intro        │
│        • Integrates all GameLevelCSPath*.js files                           │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  📂 /assets/js/GameEnginev1.1/               [CONTROLLER + VIEW]  │    │
│  │                                                                    │    │
│  │  Game Level Controllers:                                           │    │
│  │  ├─ GameLevelCSPath0Forge.js       Level 0: Identity Forge        │    │
│  │  │  • Course entry and PII lesson                                 │    │
│  │  │  • Establishes OCS account (Flask + MySQL integration)         │    │
│  │  │  • Enables PII viewing and theming customization               │    │
│  │  │                                                                 │    │
│  │  ├─ GameLevelCSPath1Way.js         Level 1: Wayfinding World      │    │
│  │  │  • Social classroom connection and registration                │    │
│  │  │  • Introduces blogging and "about me" coding foundations       │    │
│  │  │  • Self-evaluation checkpoint (passport to next level)         │    │
│  │  │                                                                 │    │
│  │  ├─ GameLevelCSPath2Mission.js     Level 2: Mission Tools         │    │
│  │  │  • Personal computer setup and local SDLC workflow             │    │
│  │  │  • Transition from online-only to local development            │    │
│  │  │  • Tools: GitHub, VSCode, Browser, Terminal, Make              │    │
│  │  │  • Prepares student for PBL-based CompSci learning             │    │
│  │  │                                                                 │    │
│  │  └─ GameLevelCSPathIdentity.js     Shared Base Class              │    │
│  │     • Shares Identity Forge data across all levels                │    │
│  │     • Helper class extended by Wayfinding and Mission             │    │
│  │     • Simplifies profile management across game progression       │    │
│  │                                                                    │    │
│  │  Game Engine Essentials (View Components):                         │    │
│  │  └─ essentials/*                                                   │    │
│  │     • StatusPanel.js  - Player profile display                    │    │
│  │     • FormPanel.js    - Identity Terminal input forms             │    │
│  │     • Picker.js       - Avatar and theme selectors                │    │
│  │     • DialogueSystem  - NPC interactions                          │    │
│  │     • Core rendering and UI abstraction                           │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  📂 /assets/js/pages/home-gamified/                   [MODEL]     │    │
│  │                                                                    │    │
│  │  Data Persistence Bridge:                                          │    │
│  │  ├─ ProfileManager.js           Profile Orchestrator              │    │
│  │  │  • Unified persistence manager (abstraction layer)             │    │
│  │  │  • JSON in / JSON out interface for View and Controller        │    │
│  │  │  • Coordinates localStorage speed + backend reliability        │    │
│  │  │  • Maps data to OCS User table columns efficiently             │    │
│  │  │                                                                 │    │
│  │  ├─ localProfile.js              Primary Storage                  │    │
│  │  │  • localStorage management (instant, client-side)              │    │
│  │  │  • Source of truth for all users                               │    │
│  │  │                                                                 │    │
│  │  └─ persistentProfile.js         Secondary Storage                │    │
│  │     • Flask API fetch request/response layer                      │    │
│  │     • Backend analytics and cross-device recovery                 │    │
│  │     • Instructor dashboard data                                   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Design Philosophy:                                                      │
│     • Immersive experience minimizing text/walls of instructions            │
│     • Exploratory, game-based onboarding to course concepts                 │
│     • Project-Based Learning (PBL) preparation through gaming               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


### Architecture Summary

**Clean MVC architecture** with **localStorage-first persistence** and **async backend analytics**. 

- **Model**: All user state lives in localStorage for instant performance
- **View**: GameEngine essentials provide reusable UI components  
- **Controller**: Game level classes orchestrate progression and business logic
- **Backend**: Flask API provides instructor analytics and cross-device recovery

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
│ VIEW LAYER (GameEngine UI Components)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  StatusPanel (GameEngine Component)                              │       │
│  │  ───────────────────────────────────                             │       │
│  │  Used for: PLAYER PROFILE display                                │       │
│  │  Location: GameLevelCSPath*.js                                   │       │
│  │                                                                  │       │
│  │  Current Configuration:                                          │       │
│  │  ┌────────────────────────────────────────────────────────┐     │       │
│  │  │  PLAYER PROFILE                                        │     │       │
│  │  │  ──────────────                                        │     │       │
│  │  │  Name:     John M                                      │     │       │
│  │  │  Email:    jmort1021@gmail.com                         │     │       │
│  │  │  GitHub:   jm1021                                      │     │       │
│  │  │                                                        │     │       │
│  │  │  Avatar Sprite                                         │     │       │
│  │  │  ──────────────                                        │     │       │
│  │  │  Sprite:   Miku                                        │     │       │
│  │  │                                                        │     │       │
│  │  │  World Theme                                           │     │       │
│  │  │  ────────────                                          │     │       │
│  │  │  Theme:    Forest                                      │     │       │
│  │  │                                                        │     │       │
│  │  │  ─────────────────────────────────────────────         │     │       │
│  │  │  🔄 Reset Profile                                      │     │       │
│  │  └────────────────────────────────────────────────────────┘     │       │
│  │                                                                  │       │
│  │  Component: this.profilePanelView = new StatusPanel({...})      │       │
│  │  Updates via: this.updateProfilePanel(profileData)              │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  FormPanel (GameEngine Component)                                │       │
│  │  ─────────────────────────────────                               │       │
│  │  Used for: Identity Terminal input                               │       │
│  │  Location: GameLevelCSPath*.js                                   │       │
│  │                                                                  │       │
│  │  Configuration:                                                  │       │
│  │  ┌────────────────────────────────────────────────────────┐     │       │
│  │  │  ⚔ Identity Terminal Setup                            │     │       │
│  │  │  ──────────────────────────                            │     │       │
│  │  │  Make sure you're logged in.                          │     │       │
│  │  │                                                        │     │       │
│  │  │  Name: [________________]                             │     │       │
│  │  │  Email: [________________]                            │     │       │
│  │  │  GitHub Username: [______]                            │     │       │
│  │  │                                                        │     │       │
│  │  │  [Unlock Identity Terminal]  [Cancel]                 │     │       │
│  │  └────────────────────────────────────────────────────────┘     │       │
│  │                                                                  │       │
│  │  Component: this.identityFormView = new FormPanel({...})        │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  Picker (GameEngine Component)                                   │       │
│  │  ──────────────────────────────                                  │       │
│  │  Used for: Avatar selection & World Theme selection              │       │
│  │  Location: GameLevelCSPath*.js                                   │       │
│  │                                                                  │       │
│  │  Avatar Picker Configuration:                                    │       │
│  │  • Title: ⚔ Avatar Forge Sprite Selector                        │       │
│  │  • Grid of sprite previews with live preview on tap             │       │
│  │  • Component: this.avatarPickerView = new Picker({...})          │       │
│  │                                                                  │       │
│  │  World Theme Picker Configuration:                               │       │
│  │  • Title: 🌐 World Theme Portal                                  │       │
│  │  • Grid of background previews                                   │       │
│  │  • Component: this.worldThemePickerView = new Picker({...})      │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  DialogueSystem (GameEngine Component)                           │       │
│  │  ──────────────────────────────────────                          │       │
│  │  Used for: NPC interactions and level guidance                   │       │
│  │  Location: GameLevelCSPath*.js                                   │       │
│  │                                                                  │       │
│  │  Features:                                                        │       │
│  │  • Typewriter effect for text display                            │       │
│  │  • Optional voice synthesis                                       │       │
│  │  • Sequential dialogue queuing                                    │       │
│  │  • Component: this.levelDialogueSystem = new DialogueSystem()    │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  Toast Messages (Custom Implementation)                          │       │
│  │  ───────────────────────────────────────                         │       │
│  │  Used for: Status updates and notifications                      │       │
│  │  Location: GameLevelCSPath*.js                                   │       │
│  │                                                                  │       │
│  │  Example:                                                         │       │
│  │  ┌────────────────────────────────────────────────────────┐     │       │
│  │  │  ✦ Profile saved successfully                          │     │       │
│  │  └────────────────────────────────────────────────────────┘     │       │
│  │                                                                  │       │
│  │  Usage: this.showToast('✦ Profile saved')                       │       │
│  │  Auto-dismisses after 3 seconds                                  │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│  Status & Error Indicators (FUTURE - After Backend API):                    │
│  ───────────────────────────────────────────────────────                    │
│  Option 1: Extend StatusPanel with additional status fields                 │
│  • Add fields for: Registration, Online, Last Sync, Activity Log            │
│  • Use HTTP status codes: 🟢 200, ⚠️ 401/4xx, 🔴 5xx/ERR                    │
│  • Update via: profileManager.getStatus() → updateProfilePanel()            │
│                                                                              │
│  Option 2: Add toast messages for sync events                               │
│  • Show: "✦ Profile synced (200)" on successful backend sync                │
│  • Show: "⚠️ Offline - local only (401)" when not authenticated            │
│  • Show: "🔴 Sync failed (500)" on backend errors                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER LAYER (Game Logic)                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │  GameLevelCSPath*.js (Game Level Controllers)                    │       │
│  │  ──────────────────────────────────────────────                  │       │
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

