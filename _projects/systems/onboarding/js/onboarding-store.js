import { CHALLENGES, challengeById } from './onboarding-data.js';

const GUEST_KEY = 'ocs-onboarding-guest-unlocks';
const PREFIX = 'onboarding_unlock_';

export class OnboardingStore {
  constructor({ pythonURI, fetchOptions, storage = window.localStorage, fetcher = (...args) => fetch(...args) }) {
    this.base = pythonURI;
    this.options = fetchOptions;
    this.storage = storage;
    this.fetcher = fetcher;
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

  async request(path, options = {}) {
    return this.fetcher(`${this.base}${path}`, { ...this.options, ...options });
  }

  async account() {
    const response = await this.request('/api/id');
    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) throw new Error(`Could not check sign-in (HTTP ${response.status}).`);
    const user = await response.json();
    if (!user || typeof user.uid !== 'string' || !user.uid) throw new Error('The account response has no user ID.');
    return user;
  }

  async profile() {
    const response = await this.request('/api/profile/game', { cache: 'no-store' });
    if (response.status === 404) return {};
    if (!response.ok) throw new Error(`Could not load game progress (HTTP ${response.status}).`);
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('The game profile response is invalid.');
    return data;
  }

  async saveAccountUnlock(id) {
    const key = `${PREFIX}${id}`;
    const response = await this.request('/api/profile/game', {
      method: 'PUT',
      body: JSON.stringify({ _game_profile: { [key]: true } }),
    });
    if (!response.ok) throw new Error(`Could not save unlock (HTTP ${response.status}).`);
    const saved = await response.json();
    if (saved[key] !== true) throw new Error('The server did not confirm the unlock.');
  }

  async read() {
    const user = await this.account();
    const guest = this.guestUnlocks();
    if (!user) return { user: null, unlocked: guest };
    const profile = await this.profile();
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
    }
    return this.read();
  }
}
