export class StorageManager {
  constructor(storageKey = '') {
    this.storageKey = storageKey;
  }

  get(fallback = '') {
    if (!this.storageKey) return fallback;
    const storedValue = localStorage.getItem(this.storageKey);
    return storedValue !== null ? storedValue : fallback;
  }

  save(value = '') {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, value);
    }
    return value;
  }

  clear() {
    if (this.storageKey) {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export default StorageManager;
