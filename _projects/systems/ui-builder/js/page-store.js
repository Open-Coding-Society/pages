// Where pages are kept (DESIGN §7.3). LocalPageStore keeps them in this browser's localStorage;
// spring-page-store.js extends it to save to Spring. Both have the same async interface, so the
// editor only reads store.capabilities and never asks which one it has. `base` is opaque to the
// editor: a local revision here, Spring's draft version there. The typed errors below are what
// both throw; every one has a .name, which survives being passed between windows.
import { PAGE_KIND, SCHEMA_VERSION } from './page-rules.js';
import { textOf } from './registry.js';

const PAGE_PREFIX = 'ocs:ui-builder:v1:page:';
export const LOCAL_ID = /^[a-z0-9]{6,32}$/;
const ID_LENGTH = 12;
// The page settings Spring also keeps as columns (DESIGN §9.6). They pass whole: a value too long
// for its column is refused with too_long (and marked on its field), never cut to fit.
const PAGE_FIELDS = ['title', 'description', 'byline', 'course', 'image'];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => (isObject(value) && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined);

/* ---------- errors ---------- */

export class ApiError extends Error {
  constructor({ status = 0, error = 'unknown', details = [], body = null, message = '' } = {}) {
    super(message || `UI Builder store: ${error}${status ? ` (HTTP ${status})` : ''}`);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.details = Array.isArray(details) ? details : [];
    this.body = body;
  }
}

// Someone (another tab, a teammate) saved since `base`. current = {base, savedByName, savedAt}:
// "Keep mine" saves again with current.base; "Reload theirs" opens the page again.
export class ConflictError extends ApiError {
  constructor({ ref = null, base = null, current = {}, body = null } = {}) {
    super({ status: 409, error: 'version_conflict', body, message: 'UI Builder store: the page was saved somewhere else' });
    this.name = 'ConflictError';
    this.ref = ref;
    this.base = base;
    this.current = {
      base: own(current, 'base') ?? null,
      savedByName: typeof own(current, 'savedByName') === 'string' ? current.savedByName : null,
      savedAt: Number.isFinite(own(current, 'savedAt')) ? current.savedAt : null,
    };
  }
}

// The address is taken (slug_taken) or can't change any more (slug_locked): shown on the slug
// field, never as a conflict dialog.
export class SlugTakenError extends ApiError {
  constructor({ status = 409, error = 'slug_taken', body = null } = {}) {
    super({ status, error, body, message: `UI Builder store: ${error}` });
    this.name = 'SlugTakenError';
  }
}

export class NotFoundError extends ApiError {
  constructor({ status = 404, error = 'not_found', body = null } = {}) {
    super({ status, error, body, message: 'UI Builder store: no such page, or no access to it' });
    this.name = 'NotFoundError';
  }
}

// No answer: the network failed or the server didn't reply in time (reason network | timeout).
export class OfflineError extends Error {
  constructor({ reason = 'network', cause = null } = {}) {
    super(`UI Builder store: ${reason === 'timeout' ? 'the server did not answer in time' : 'the server could not be reached'}`);
    this.name = 'OfflineError';
    this.reason = reason;
    this.cause = cause;
  }
}

// The registry text for a store error, as {key, vars}: textOf(registry, key, vars) words it.
// Spring's refusal codes that already have wording elsewhere in the registry reuse it; a code
// this page doesn't know (a proxy's or Spring Boot's own error body) is worded by its status.
// It never passes on the error's own message or code: those aren't written for students.
const SHARED_TEXT = {
  invalid_slug: 'errors.slug_invalid',
  slug_reserved: 'errors.slug_reserved',
  invalid_group: 'errors.group_not_allowed',
  loopback_source: 'errors.loopback_url',
};
// 'conflict' is not here: only a ConflictError has the name and time its wording needs.
const STORE_TEXT = new Set([
  'offline', 'timeout', 'not_found', 'slug_taken', 'slug_locked', 'slug_required', 'invalid_spec',
  'origin_rejected', 'unauthorized', 'forbidden', 'too_large', 'busy', 'not_published', 'own_page', 'bad_request',
  'server', 'bad_response', 'storage_full', 'storage_blocked', 'corrupt', 'unknown',
]);
const STATUS_TEXT = { 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 413: 'too_large' };

export function storeErrorText(error) {
  const name = error && error.name;
  if (name === 'OfflineError') return { key: error.reason === 'timeout' ? 'store.timeout' : 'store.offline', vars: {} };
  if (name === 'ConflictError') {
    const when = error.current && Number.isFinite(error.current.savedAt) ? new Date(error.current.savedAt) : null;
    const who = error.current && error.current.savedByName;
    // A local conflict has no name: the other copy is this browser's, open in another tab.
    return { key: who ? 'store.conflict' : 'store.conflict_unknown', vars: { name: who || '', time: when ? when.toLocaleString() : '' } };
  }
  const code = error && typeof error.error === 'string' ? error.error : '';
  // Spring's create refuses a page over the per-person limit with 409 {error, max}.
  if (code === 'too_many_pages') {
    const max = error && error.body && Number.isFinite(error.body.max) ? error.body.max : '';
    return { key: 'store.too_many_pages', vars: { max } };
  }
  if (Object.prototype.hasOwnProperty.call(SHARED_TEXT, code)) return { key: SHARED_TEXT[code], vars: {} };
  if (STORE_TEXT.has(code)) return { key: `store.${code}`, vars: { status: error.status || '' } };
  const status = error && Number.isInteger(error.status) ? error.status : 0;
  if (Object.prototype.hasOwnProperty.call(STATUS_TEXT, status)) return { key: `store.${STATUS_TEXT[status]}`, vars: {} };
  if (status >= 500) return { key: 'store.server', vars: { status } };
  if (status >= 400) return { key: 'store.bad_request', vars: { status } };
  return { key: 'store.unknown', vars: {} };
}

/* ---------- browser storage ---------- */

// localStorage itself throws in some blocked-storage modes, so even reading it is guarded.
export function browserStorage(name = 'localStorage') {
  try {
    const storage = globalThis[name];
    return storage && typeof storage.getItem === 'function' ? storage : null;
  } catch (_) {
    return null;
  }
}

function isQuotaError(error) {
  const name = error && error.name;
  return name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED' || (error && (error.code === 22 || error.code === 1014));
}

export function storageError(error) {
  return new ApiError({ error: isQuotaError(error) ? 'storage_full' : 'storage_blocked', body: null });
}

function randomId() {
  const bytes = new Uint8Array(ID_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => (byte % 36).toString(36)).join('');
}

// The page settings a summary shows, with explicit `fields` (the editor's) winning.
export function pageFields(page, fields = {}) {
  const settings = isObject(own(page, 'page')) ? page.page : {};
  const out = {};
  for (const key of PAGE_FIELDS) {
    const value = own(fields, key) !== undefined ? own(fields, key) : own(settings, key);
    out[key] = typeof value === 'string' ? value : '';
  }
  return out;
}

export function isPageDocument(page) {
  return isObject(page) && own(page, 'schemaVersion') === SCHEMA_VERSION && own(page, 'kind') === PAGE_KIND
    && Array.isArray(own(page, 'sections'));
}

/* ---------- LocalPageStore ---------- */

// One localStorage record per page: {v, id, revision, createdAt, updatedAt, title, description,
// byline, course, image, page}. revision is the page's base: it goes up by one on every save,
// so a save from a tab holding an older revision is a ConflictError.
export class LocalPageStore {
  #storage;
  #now;
  #makeId;

  constructor({ storage, now = Date.now, registry = null, makeId = randomId } = {}) {
    if (typeof now !== 'function') throw new TypeError('LocalPageStore: now must be a function');
    if (typeof makeId !== 'function') throw new TypeError('LocalPageStore: makeId must be a function');
    this.#storage = storage === undefined ? browserStorage() : storage;
    this.#now = now;
    this.#makeId = makeId;
    this.registry = registry;
  }

  get capabilities() {
    return { cloud: false, publish: false, visibility: false, revisions: false, leases: false, teams: false, gallery: false, teacher: false };
  }

  #store() {
    if (!this.#storage) throw new ApiError({ error: 'storage_blocked' });
    return this.#storage;
  }

  #read(key) {
    let raw;
    try {
      raw = this.#store().getItem(key);
    } catch (error) {
      throw storageError(error);
    }
    if (raw === null || raw === undefined) return null;
    try {
      const record = JSON.parse(raw);
      return isObject(record) && own(record, 'v') === 1 && Number.isSafeInteger(own(record, 'revision')) && isPageDocument(own(record, 'page'))
        ? record : 'corrupt';
    } catch (_) {
      return 'corrupt';
    }
  }

  #write(key, record) {
    const text = JSON.stringify(record);
    try {
      this.#store().setItem(key, text);
    } catch (error) {
      throw storageError(error);
    }
  }

  #keyOf(ref) {
    if (!isObject(ref) || ref.kind !== 'local') throw new TypeError('LocalPageStore: ref must be {kind: "local", id}');
    // A hand-typed ?local= address can name anything; only well-formed ids are looked up.
    if (typeof ref.id !== 'string' || !LOCAL_ID.test(ref.id)) throw new NotFoundError({ status: 0 });
    return `${PAGE_PREFIX}${ref.id}`;
  }

  #summary(record) {
    const ref = { kind: 'local', id: record.id };
    const fields = pageFields(record.page, record);
    if (!fields.title.trim() && this.registry) fields.title = textOf(this.registry, 'blocks.untitled');
    return {
      ref, ...fields, status: 'LOCAL', createdAt: Number(record.createdAt) || 0, updatedAt: Number(record.updatedAt) || 0,
      publishedAt: null, hasUnpublishedChanges: false, base: record.revision,
    };
  }

  // Newest first. Damaged records are skipped here and reported by open().
  async list({ scope = 'mine' } = {}) {
    if (scope !== 'mine') return [];
    const storage = this.#store();
    const keys = [];
    try {
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (typeof key === 'string' && key.startsWith(PAGE_PREFIX) && LOCAL_ID.test(key.slice(PAGE_PREFIX.length))) keys.push(key);
      }
    } catch (error) {
      throw storageError(error);
    }
    const out = [];
    for (const key of keys) {
      const record = this.#read(key);
      if (isObject(record)) out.push(this.#summary({ ...record, id: key.slice(PAGE_PREFIX.length) }));
    }
    return out.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async create(page, { fields } = {}) {
    if (!isPageDocument(page)) throw new TypeError('LocalPageStore.create: page must be a UI Builder page document');
    const storage = this.#store();
    let id = null;
    for (let attempt = 0; attempt < 20 && id === null; attempt += 1) {
      const candidate = this.#makeId();
      let taken = true;
      try {
        taken = typeof candidate !== 'string' || !LOCAL_ID.test(candidate) || storage.getItem(`${PAGE_PREFIX}${candidate}`) !== null;
      } catch (error) {
        throw storageError(error);
      }
      if (!taken) id = candidate;
    }
    if (id === null) throw new Error('LocalPageStore.create: makeId keeps returning invalid or used ids');
    const time = this.#now();
    const record = { v: 1, id, revision: 1, createdAt: time, updatedAt: time, ...pageFields(page, fields), page };
    this.#write(`${PAGE_PREFIX}${id}`, record);
    const meta = this.#summary(record);
    return { ref: meta.ref, base: record.revision, meta };
  }

  async open(ref) {
    const record = this.#read(this.#keyOf(ref));
    if (record === null) throw new NotFoundError({ status: 0 });
    if (record === 'corrupt') throw new ApiError({ error: 'corrupt' });
    const meta = this.#summary({ ...record, id: ref.id });
    return { page: record.page, base: record.revision, meta };
  }

  async save(ref, page, { base, fields } = {}) {
    if (!isPageDocument(page)) throw new TypeError('LocalPageStore.save: page must be a UI Builder page document');
    const key = this.#keyOf(ref);
    const current = this.#read(key);
    if (current === null) throw new NotFoundError({ status: 0 });
    // A damaged record can still be overwritten: the page in hand is the good copy.
    const revision = current === 'corrupt' ? 0 : current.revision;
    if (current !== 'corrupt' && base !== undefined && base !== null && base !== revision) {
      throw new ConflictError({ ref, base, current: { base: revision, savedByName: null, savedAt: current.updatedAt } });
    }
    const createdAt = current === 'corrupt' ? this.#now() : current.createdAt;
    const record = { v: 1, id: ref.id, revision: revision + 1, createdAt, updatedAt: this.#now(), ...pageFields(page, fields), page };
    this.#write(key, record);
    return { base: record.revision, meta: this.#summary(record) };
  }

  async remove(ref) {
    const key = this.#keyOf(ref);
    if (this.#read(key) === null) throw new NotFoundError({ status: 0 });
    try {
      this.#store().removeItem(key);
    } catch (error) {
      throw storageError(error);
    }
  }
}
