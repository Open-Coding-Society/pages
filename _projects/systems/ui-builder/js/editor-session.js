// Saving one open page (DESIGN §10): every change goes to the DraftStore (crash copy, 400 ms
// after the last change, at once on pagehide) and, through autosave.js, to the page store (2 s
// for Spring, 400 ms for this browser's store). Each response replaces the base version; a
// conflict pauses saving until the editor picks Reload theirs or Keep mine. With Spring the
// session also holds the edit lease: taken on open, renewed every 30 s and after saves, released
// on pagehide. Offline saves retry with a growing delay and when the browser is back online.
import { createAutosave } from './autosave.js';

const DRAFT_DELAY_MS = 400;
const LEASE_EVERY_MS = 30000;
const LEASE_AFTER_SAVE_MS = 10000;
const RETRY_MS = [5000, 10000, 20000, 40000, 60000];

// The page settings Spring keeps as columns too (titles in lists, the gallery card).
export function fieldsOf(page) {
  const settings = page && page.page && typeof page.page === 'object' ? page.page : {};
  const text = (key) => (typeof settings[key] === 'string' ? settings[key] : '');
  return { title: text('title'), description: text('description'), byline: text('byline'), course: text('course'), image: text('image') };
}

// What the save indicator says: {key, vars} for textOf(registry, 'editor.' + key).
export function saveStateOf(status, { cloud = false, readOnly = false, created = true, formatTime = String } = {}) {
  if (readOnly) return { key: 'save_readonly', vars: {} };
  const state = status && status.state;
  if (state === 'saving') return { key: 'save_saving', vars: {} };
  if (state === 'conflict') return { key: 'save_conflict', vars: {} };
  if (state === 'error') return { key: status.error && status.error.name === 'OfflineError' ? 'save_offline' : 'save_error', vars: {} };
  if (!created) return { key: 'save_new', vars: {} };
  if (state === 'dirty') return { key: 'save_dirty', vars: {} };
  if (!cloud) return { key: 'save_local', vars: {} };
  return status && status.savedAt ? { key: 'save_saved', vars: { time: formatTime(status.savedAt) } } : { key: 'save_saved', vars: { time: '' } };
}

// What the publish indicator says, or null where nothing publishes (this browser's store).
export function publishStateOf(meta, { publish = false, dirty = false } = {}) {
  if (!publish) return null;
  if (!meta || meta.status !== 'PUBLISHED') return 'pub_none';
  return meta.hasUnpublishedChanges || dirty ? 'pub_changes' : 'pub_live';
}

// Publish is offered for a page never published, or one with changes the live page lacks.
export function canPublish(meta, { publish = false, dirty = false, readOnly = false } = {}) {
  if (!publish || readOnly) return false;
  return !meta || meta.status !== 'PUBLISHED' || meta.hasUnpublishedChanges === true || dirty;
}

// A store error → {key, vars} for the feedback line.
export function errorKeyOf(error) {
  const name = error && error.name;
  const status = error && error.status;
  const code = error && error.error;
  if (name === 'OfflineError') return { key: 'err_offline', vars: {} };
  // This browser's store: storage that is full, blocked, or a damaged record.
  if (code === 'storage_full') return { key: 'err_storage_full', vars: {} };
  if (code === 'storage_blocked') return { key: 'err_storage_blocked', vars: {} };
  if (code === 'corrupt') return { key: 'err_corrupt', vars: {} };
  if (name === 'NotFoundError' || status === 404) return { key: 'not_found', vars: {} };
  if (status === 401) return { key: 'err_signed_out', vars: {} };
  if (code === 'origin_rejected') return { key: 'err_origin', vars: {} };
  if (status === 403) return { key: 'err_forbidden', vars: {} };
  if (status === 413 || code === 'too_large') return { key: 'err_too_large', vars: {} };
  if (code === 'busy') return { key: 'err_busy', vars: {} };
  if (status === 400) return { key: 'err_invalid', vars: { message: code || '' } };
  return { key: 'err_generic', vars: { message: (error && (error.message || code)) || String(error) } };
}

export function createSession({
  store, draftStore, ref = null, base = null, meta = null, getPage, getFields = () => fieldsOf(getPage()),
  win = globalThis.window, now = () => Date.now(), delayMs, draftDelayMs = DRAFT_DELAY_MS,
  onStatus = () => {}, onSaved = () => {}, onConflict = () => {}, onError = () => {}, onLease = () => {}, onCreated = () => {},
}) {
  const caps = store.capabilities || {};
  let currentRef = ref;
  let currentMeta = meta;
  let draftTimer = null;
  let leaseTimer = null;
  let retryTimer = null;
  let retries = 0;
  let holding = false;
  let lastLeaseAt = 0;
  let disposed = false;
  const keyOf = () => draftStore.keyFor(currentRef);

  function writeDraft() {
    clearTimeout(draftTimer);
    draftTimer = null;
    if (disposed) return;
    draftStore.write(keyOf(), { baseVersion: autosave.base, dirty: true, page: getPage() });
  }

  const autosave = createAutosave({
    base,
    delayMs: Number.isFinite(delayMs) ? delayMs : (caps.cloud ? 2000 : 400),
    now,
    async save({ base: sendBase }) {
      const page = getPage();
      const fields = getFields();
      if (!currentRef) {
        const created = await store.create(page, { fields });
        draftStore.clear('new');
        currentRef = created.ref;
        currentMeta = created.meta || null;
        onCreated(created);
        return { base: created.base, meta: currentMeta, fields };
      }
      const result = await store.save(currentRef, page, { base: sendBase, fields });
      currentMeta = result.meta || currentMeta;
      return { base: result.base, meta: currentMeta, fields };
    },
    onState: (status) => onStatus(status),
    onSaved: ({ base: savedBase, savedAt, result }) => {
      retries = 0;
      if (!autosave.status().pending) {
        clearTimeout(draftTimer);
        draftTimer = null;
        draftStore.clear(keyOf());
      }
      onSaved({ base: savedBase, savedAt, meta: currentMeta, fields: result && result.fields });
      if (holding && now() - lastLeaseAt > LEASE_AFTER_SAVE_MS) renewLease();
    },
    onConflict: (error) => onConflict(error),
    onError: (error) => {
      onError(error);
      // Flaky networks: try again later on our own; a 4xx needs the student to act first.
      if (error && error.name === 'OfflineError') {
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => autosave.change(), RETRY_MS[Math.min(retries, RETRY_MS.length - 1)]);
        retries += 1;
      }
    },
  });

  function applyLease(lease) {
    if (!lease || typeof lease !== 'object') return;
    holding = lease.mine === true;
    lastLeaseAt = now();
    onLease({ holderName: typeof lease.holderName === 'string' ? lease.holderName : '', mine: holding, expiresAt: lease.expiresAt });
  }

  function renewLease() {
    if (!caps.leases || !currentRef || disposed) return Promise.resolve();
    return store.lease(currentRef).then(applyLease, () => {}); // a missed renewal is retried in 30 s
  }

  const online = () => { if (autosave.status().state === 'error') autosave.change(); };
  const pagehide = () => {
    const status = autosave.status();
    if (status.pending || status.saving || status.state === 'conflict' || status.state === 'error') writeDraft();
    if (holding && caps.leases && currentRef) store.releaseLease(currentRef, { keepalive: true }).catch(() => {});
  };
  win.addEventListener('online', online);
  win.addEventListener('pagehide', pagehide);

  return {
    get ref() { return currentRef; },
    get base() { return autosave.base; },
    get meta() { return currentMeta; },
    get holding() { return holding; },
    status: () => autosave.status(),
    change() {
      if (disposed) return;
      clearTimeout(draftTimer);
      draftTimer = setTimeout(writeDraft, draftDelayMs);
      autosave.change();
    },
    flush: () => autosave.flush(),
    pause: () => autosave.pause(),
    resume: () => autosave.resume(),
    // Keep mine: save over theirs with the version the conflict reported.
    keepMine(currentBase) { autosave.resume({ base: currentBase }); },
    // Reload theirs (or a restored revision): forget unsaved work and continue from base.
    reset({ base: nextBase, meta: nextMeta } = {}) {
      clearTimeout(draftTimer);
      draftTimer = null;
      draftStore.clear(keyOf());
      if (nextMeta) currentMeta = nextMeta;
      autosave.reset({ base: nextBase });
    },
    setBase(nextBase) { autosave.setBase(nextBase); },
    setMeta(nextMeta) { if (nextMeta) currentMeta = nextMeta; },
    startLease() {
      if (!caps.leases || !currentRef) return Promise.resolve(null);
      clearInterval(leaseTimer);
      leaseTimer = setInterval(renewLease, LEASE_EVERY_MS);
      return store.lease(currentRef).then((lease) => { applyLease(lease); return lease; });
    },
    takeLease() {
      return store.takeLease(currentRef).then((lease) => { applyLease(lease); return lease; });
    },
    writeDraft,
    dispose({ release = true } = {}) {
      if (disposed) return;
      disposed = true;
      clearTimeout(draftTimer);
      clearTimeout(retryTimer);
      clearInterval(leaseTimer);
      win.removeEventListener('online', online);
      win.removeEventListener('pagehide', pagehide);
      if (release && holding && caps.leases && currentRef) store.releaseLease(currentRef, { keepalive: false }).catch(() => {});
      autosave.dispose();
    },
  };
}
