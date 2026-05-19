# CS Pathway Storage

Architecture Achievement
✅ Opaque Backend Storage - Backend treats game data as a black box:

Frontend (ProfileManager) owns complete game structure
Backend just stores/retrieves JSON blob
No coupling between backend and game logic
ProfileManager can evolve structure without backend changes

✅ Data Integrity Fix

No data loss during guest ↔ authenticated transitions
User-namespaced keys prevent collisions
Backend opaque storage preserves complete structure

## Problem Fixed: Data Loss on Login/Logout

### Previous Bug (Critical Data Loss)

**Before this fix:**

1. User `jm1021` logs in → saves to `'ocs_local_profile'` → syncs to backend
2. User forgets to login → becomes **Guest** → overwrites `'ocs_local_profile'` ❌
3. User logs back in as `jm1021` → code sees localStorage data → **assumes it's jm1021's** → syncs Guest data to jm1021's backend ❌
4. **Result:** jm1021's data permanently destroyed in both localStorage AND backend

### Root Cause

- **Single localStorage key** for all users (`'ocs_local_profile'`)
- **No identity verification** before localStorage operations
- **localStorage-first strategy** blindly trusts whatever is in localStorage
- **Backend corruption** when guest data syncs to authenticated user's profile

---

## Solution: User-Namespaced Storage

### New Storage Architecture

```javascript
// Storage Keys:
'ocs_profile_guest'      // Unauthenticated users
'ocs_profile_jm1021'     // User jm1021 (keyed by GitHub ID)
'ocs_profile_alice'      // User alice
'ocs_profile_bob123'     // User bob123
```

### Key Changes

#### 1. **localProfile.js** — Dynamic Storage Keys

```javascript
// Old (BROKEN):
const STORAGE_KEY = 'ocs_local_profile'; // Single key for all

// New (FIXED):
const GUEST_STORAGE_KEY = 'ocs_profile_guest';
const USER_KEY_PREFIX = 'ocs_profile_';

function getStorageKey(uid = null) {
  return uid ? `${USER_KEY_PREFIX}${uid}` : GUEST_STORAGE_KEY;
}
```

#### 2. **ProfileManager.js** — User Context

```javascript
// Initialize with user identity FIRST
async initialize() {
  // 1. Check authentication → get user ID
  this.userInfo = await PersistentProfile.getUserInfo();
  const currentUid = this.userInfo?.uid || null;
  
  // 2. Set user context on LocalProfile
  LocalProfile.setUserContext(currentUid); // ← Namespace storage!
  
  // 3. Clean up guest data if user logged in
  if (this.isAuthenticated && LocalProfile.exists(null)) {
    await this._handleGuestMigration(currentUid);
  }
  
  // 4. Load from user-specific key
  const localData = LocalProfile.getFlatProfile();
}
```

#### 3. **Guest Cleanup (Not Migration)**

Guest profiles are ephemeral demo mode — they are NOT migrated to authenticated accounts:

```javascript
_handleGuestMigration(uid) {
  const guestData = LocalProfile.load(null);      // 'ocs_profile_guest'
  
  if (guestData) {
    // Guest is demo mode — discard when user logs in
    LocalProfile.clear(null);
    console.log('✓ Cleared guest demo data');
  }
  
  // User's real data comes from backend or starts fresh
}
```

**Design Rationale:**

- Guest mode is for exploring/testing before account creation
- Real user data lives in backend (cross-device sync)
- Prevents confusion between demo progress and real progress
- Simpler, cleaner architecture (no complex merge logic)

---

## API Changes

### localProfile.js

```javascript
// New Methods:
LocalProfile.setUserContext(uid)              // Set current user (null for guest)
LocalProfile.exists(uid)                      // Check specific user
LocalProfile.load(uid)                        // Load specific user
LocalProfile.clear(uid)                       // Clear specific user
LocalProfile.listProfiles()                   // List all profiles
LocalProfile.moveProfile(fromUid, toUid)      // Migration helper

// Existing methods work with current context:
LocalProfile.save(data)                       // Saves to current user's key
LocalProfile.update(data)                     // Updates current user's key
LocalProfile.getFlatProfile()                 // Gets current user's data
```

### ProfileManager.js

```javascript
// New Properties:
this.userInfo                                 // { uid, name, email, roles }

// New Private Methods:
_handleGuestMigration(uid)                    // Guest cleanup (not migration)
```

---

## Testing Checklist

### Manual Testing Steps

1. **Guest→Login (Demo Cleanup)**
   - [ ] Open browser (incognito)
   - [ ] Work as guest (create avatar, select theme)
   - [ ] Log in as user
   - [ ] Verify guest data was cleared
   - [ ] Verify user loads from backend or starts fresh

2. **User→Guest→User (Guest Discarded)**
   - [ ] Log in as user A
   - [ ] Make progress
   - [ ] Log out
   - [ ] Work as guest (different progress)
   - [ ] Log back in as user A
   - [ ] Verify user A's original data intact
   - [ ] Verify guest demo data was discarded

3. **Multiple Users on Same Device**
   - [ ] Log in as user A → make progress → log out
   - [ ] Log in as user B → make progress → log out
   - [ ] Log back in as user A → verify A's data intact
   - [ ] Log back in as user B → verify B's data intact

4. **Cross-Device Sync**
   - [ ] Device 1: Log in as user → make progress
   - [ ] Device 2: Log in as same user → verify data restored from backend

5. **Backend Recovery**
   - [ ] Log in as user → make progress → backend syncs
   - [ ] Clear localStorage manually (simulate new device)
   - [ ] Log in again → verify data recovered from backend

---

## Migration Path for Existing Users

For users with data in old `'ocs_local_profile'` key:

```javascript
// One-time migration (run in browser console if needed):
const oldData = localStorage.getItem('ocs_local_profile');
if (oldData) {
  // If user is logged in, migrate to user key
  const userInfo = await PersistentProfile.getUserInfo();
  if (userInfo?.uid) {
    const newKey = `ocs_profile_${userInfo.uid}`;
    localStorage.setItem(newKey, oldData);
    console.log(`Migrated old profile → ${newKey}`);
  } else {
    // Otherwise, migrate to guest key
    localStorage.setItem('ocs_profile_guest', oldData);
    console.log('Migrated old profile → guest');
  }
  localStorage.removeItem('ocs_local_profile'); // Clean up old key
}
```

**Note:** Guest cleanup is **automatic** on next login — the system will detect the guest profile and clear it.

---

## Future Enhancements

1. **Guest Data Prompt (Optional)**
   - On login, optionally ask: "Keep guest demo data?"
   - Most users will discard, but option exists for edge cases
   - Simple yes/no prompt, not complex merge UI

2. **Profile Switching UI**
   - "Switch Profile" button
   - List available profiles on device
   - Quick switch between accounts

3. **Profile Export/Import**
   - Export profile as JSON file
   - Import to another device
   - Backup before major changes

4. **Analytics Tracking**
   - Track guest→login transitions
   - Monitor guest demo completion rates
   - Identify conversion patterns (guest→account)

---

## Security Considerations

- **localStorage is not encrypted** — sensitive data should not be stored
- **User ID (uid) in key name** — visible in browser DevTools
- **Backend authentication** — localStorage is local cache only, backend is source of truth for identity
- **XSS protection** — standard web security practices apply
