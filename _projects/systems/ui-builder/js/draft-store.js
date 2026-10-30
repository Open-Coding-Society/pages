// Crash recovery for the editor (DESIGN §7.2, §10): the page being edited, written to this
// browser on every change so a closed tab or a lost connection loses nothing. One draft per
// page: 'spring-<id>', 'local-<id>', or the new-page draft for a page not saved anywhere yet.
// That new-page draft is 'new:<personId>' once a signed-in person is known (setPerson), so a
// shared school computer never offers one student's unsaved page to the next; a Flask-only or
// signed-out editor keeps the plain 'new' key. Every storage failure (private mode, a full quota,
// blocked site data) is caught: write() and clear() say whether they worked, read() returns null,
// and nothing here ever throws on storage.
import { LOCAL_ID, browserStorage, isPageDocument } from './page-store.js';

const PREFIX = 'ocs:ui-builder:v1:draft:';
const KEY = /^(?:spring-[1-9]\d{0,15}|local-[a-z0-9]{6,32}|new(?::[1-9]\d{0,15})?)$/;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isBase = (value) => value === null || Number.isSafeInteger(value);

export class DraftStore {
  #storage;
  #now;
  #personId = null;

  constructor({ storage, now = Date.now } = {}) {
    if (typeof now !== 'function') throw new TypeError('DraftStore: now must be a function');
    this.#storage = storage === undefined ? browserStorage() : storage;
    this.#now = now;
  }

  // The signed-in person whose new-page draft to keep apart, or null for signed-out / Flask-only.
  setPerson(personId) {
    this.#personId = Number.isSafeInteger(personId) && personId > 0 ? personId : null;
  }

  // The new-page draft key: scoped to the person when one is known, else the shared 'new'.
  #newKey() {
    return this.#personId ? `new:${this.#personId}` : 'new';
  }

  // The draft key for a page ref, or the new-page key for null. A ref this editor could never have
  // made is a bug in the caller, so it throws rather than sharing a key with another page.
  keyFor(ref) {
    if (ref === null || ref === undefined) return this.#newKey();
    if (isObject(ref) && ref.kind === 'spring') {
      const id = typeof ref.id === 'string' && /^\d{1,16}$/.test(ref.id) ? Number(ref.id) : ref.id;
      if (Number.isSafeInteger(id) && id > 0) return `spring-${id}`;
    }
    if (isObject(ref) && ref.kind === 'local' && typeof ref.id === 'string' && LOCAL_ID.test(ref.id)) return `local-${ref.id}`;
    throw new TypeError('DraftStore.keyFor: ref must be null, {kind: "spring", id} or {kind: "local", id}');
  }

  // {baseVersion, dirty, savedAt, page}, or null when there is no usable draft.
  read(key) {
    if (!this.#storage || typeof key !== 'string' || !KEY.test(key)) return null;
    try {
      const raw = this.#storage.getItem(`${PREFIX}${key}`);
      if (typeof raw !== 'string') return null;
      const record = JSON.parse(raw);
      if (!isObject(record) || !isBase(record.baseVersion) || typeof record.dirty !== 'boolean'
        || !Number.isFinite(record.savedAt) || !isPageDocument(record.page)) return null;
      return { baseVersion: record.baseVersion, dirty: record.dirty, savedAt: record.savedAt, page: record.page };
    } catch (_) {
      return null; // unreadable storage or a damaged record: no draft to offer
    }
  }

  // true when the draft is in storage. A full quota first makes room by dropping drafts that are
  // already saved elsewhere (dirty: false), oldest first, then tries once more.
  write(key, { baseVersion = null, dirty = true, page } = {}) {
    if (!this.#storage || typeof key !== 'string' || !KEY.test(key) || !isPageDocument(page)) return false;
    let text;
    try {
      text = JSON.stringify({ v: 1, baseVersion: isBase(baseVersion) ? baseVersion : null, dirty: dirty === true, savedAt: this.#now(), page });
    } catch (_) {
      return false; // a page that can't be serialized can't be kept either
    }
    if (this.#put(`${PREFIX}${key}`, text)) return true;
    return this.#evictSaved(key) && this.#put(`${PREFIX}${key}`, text);
  }

  clear(key) {
    if (!this.#storage || typeof key !== 'string' || !KEY.test(key)) return false;
    try {
      this.#storage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch (_) {
      return false;
    }
  }

  #put(name, text) {
    try {
      this.#storage.setItem(name, text);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Unsaved work (dirty drafts) is never dropped to make room.
  #evictSaved(keep) {
    const saved = [];
    try {
      for (let index = 0; index < this.#storage.length; index += 1) {
        const name = this.#storage.key(index);
        const key = typeof name === 'string' && name.startsWith(PREFIX) ? name.slice(PREFIX.length) : null;
        if (key && key !== keep && KEY.test(key)) {
          const draft = this.read(key);
          if (draft && !draft.dirty) saved.push({ name, savedAt: draft.savedAt });
        }
      }
      saved.sort((a, b) => a.savedAt - b.savedAt);
      for (const { name } of saved) this.#storage.removeItem(name);
    } catch (_) {
      return false;
    }
    return saved.length > 0;
  }
}
