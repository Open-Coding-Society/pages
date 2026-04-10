# Profile System - Implementation Guide

This document contains the implementation details, architecture principles, testing strategies, and performance characteristics for the Profile System.

**For visual architecture diagrams and data flows**, see [README_ARCHITECTURE.md](README_ARCHITECTURE.md).

---

## Key Architecture Principles

### 1. Separation of Concerns (MVC)

- **MODEL**: ProfileManager + LocalProfile + PersistentProfile (all persistence logic)
- **VIEW**: GameEngine StatusPanel, FormPanel, Picker, DialogueSystem, Toast (UI components)
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

GameLevelCssePath.js
  └─> uses GameEngine components:
      • StatusPanel (profile display)
      • FormPanel (identity input)
      • Picker (avatar/theme selection)
      • DialogueSystem (NPC interactions)
      • Toast (accomplishment notifications)

home-gamified.scss
  └─> styles for GameEngine panels
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
