import { CHALLENGES, challengeById } from './onboarding-data.js';

const GUEST_KEY = 'ocs-onboarding-guest-unlocks';
const PREFIX = 'onboarding_unlock_';

export class OnboardingStore {
  constructor({ profile, storage = window.localStorage }) {
    this.profile = profile;
    this.storage = storage;
  }

  guestUnlocks() {
    const raw = this.storage.getItem(GUEST_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids) || !ids.every(id => typeof id === 'string')) {
      throw new Error('Saved guest unlocks are invalid.');
    }
    return ids.filter(id => challengeById(id));
  }

  async loadProgress() {
    const data = await this.profile.gameProfile();
    if (data === null) return {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('The game profile response is invalid.');
    return data;
  }

  async saveAccountUnlock(id, value = true) {
    const key = `${PREFIX}${id}`;
    const saved = await this.profile.updateGameProfile({ [key]: value });
    if (!saved || saved[key] !== value) throw new Error('The server did not confirm the unlock change.');
  }

  async account() {
    try {
      return await this.profile.signedInAccount();
    } catch (error) {
      if (error?.status === 0 || error?.cause?.status === 0) return undefined;
      throw error;
    }
  }

  async read() {
    const user = await this.account();
    const guest = this.guestUnlocks();
    if (user === undefined) return { user: null, unlocked: guest, offline: true };
    if (!user) return { user: null, unlocked: guest };
    const profile = await this.loadProgress();
    const unlocked = new Set(CHALLENGES.filter(item => profile[`${PREFIX}${item.id}`] === true).map(item => item.id));
    for (const id of guest) {
      if (!unlocked.has(id)) await this.saveAccountUnlock(id);
      unlocked.add(id);
    }
    if (guest.length) this.storage.removeItem(GUEST_KEY);
    return { user, unlocked: [...unlocked] };
  }

  async unlock(id) {
    if (!challengeById(id)) throw new Error(`Unknown challenge: ${id}`);
    const user = await this.account();
    if (user) {
      await this.saveAccountUnlock(id);
    } else {
      const unlocked = new Set(this.guestUnlocks());
      unlocked.add(id);
      this.storage.setItem(GUEST_KEY, JSON.stringify([...unlocked]));
      if (user === undefined) return { user: null, unlocked: [...unlocked], offline: true };
    }
    return this.read();
  }

  async reset(id) {
    if (!challengeById(id) || challengeById(id).direct) throw new Error(`Unknown gated challenge: ${id}`);
    const guest = this.guestUnlocks();
    const user = await this.account();
    if (user === undefined) throw new Error('Reconnect to reset account progress.');
    if (user) await this.saveAccountUnlock(id, false);
    const remaining = guest.filter(item => item !== id);
    if (remaining.length) this.storage.setItem(GUEST_KEY, JSON.stringify(remaining));
    else this.storage.removeItem(GUEST_KEY);
    return this.read();
  }
}
