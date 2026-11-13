// Autosave to the page store (DESIGN §7.1, §10): idle → dirty → saving → idle | conflict | error.
// change() marks the page dirty and saves delayMs after the last change; one request at most is
// in flight, and changes made meanwhile are sent when it returns, with the base it returned.
// A conflict pauses saving until resume() ("Keep mine") or reset() ("Reload theirs"). Pure: the
// clock and timers are injected, and save({base}) → Promise<{base}> reads the newest page itself.

export const AUTOSAVE_STATES = Object.freeze(['idle', 'dirty', 'saving', 'conflict', 'error']);

const noop = () => {};
const defaultIsConflict = (error) => Boolean(error) && error.name === 'ConflictError';

function stopped(code, message) {
  return Object.assign(new Error(`UI Builder autosave: ${message}`), { code });
}

export function createAutosave({
  save, now = () => Date.now(), setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = (handle) => clearTimeout(handle),
  delayMs = 2000, base = null, isConflict = defaultIsConflict,
  onState = noop, onSaved = noop, onConflict = noop, onError = noop,
} = {}) {
  for (const [name, fn] of Object.entries({ save, now, setTimer, clearTimer, isConflict, onState, onSaved, onConflict, onError })) {
    if (typeof fn !== 'function') throw new TypeError(`UI Builder autosave: ${name} must be a function`);
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new TypeError('UI Builder autosave: delayMs must be a number of at least 0');

  let currentBase = base;
  let pending = false; // changes not yet in any request
  let saving = false;
  let paused = false;
  let conflict = false;
  let lastError = null;
  let lastChangeAt = 0;
  let savedAt = null;
  let timer = null;
  let generation = 0; // reset() and dispose() make the outcome of a request in flight stale
  let disposed = false;
  let waiters = [];
  let reported = '';

  function stateOf() {
    if (saving) return 'saving';
    if (conflict) return 'conflict';
    if (lastError) return 'error';
    return pending ? 'dirty' : 'idle';
  }

  function status() {
    return { state: stateOf(), pending, saving, paused, base: currentBase, savedAt, error: lastError };
  }

  // Callbacks run after the machine is consistent, so a throwing callback can't corrupt it.
  function announce() {
    const next = status();
    const signature = `${next.state}:${next.paused}:${next.pending}`;
    if (signature === reported) return;
    reported = signature;
    onState(next);
  }

  function cancelTimer() {
    if (timer !== null) clearTimer(timer);
    timer = null;
  }

  function settleWaiters(error) {
    const list = waiters;
    waiters = [];
    for (const waiter of list) {
      if (error) waiter.reject(error);
      else waiter.resolve(status());
    }
  }

  function schedule(ms) {
    cancelTimer();
    timer = setTimer(() => {
      timer = null;
      if (pending && !saving && !paused && !disposed) send();
    }, Math.max(0, ms));
  }

  function afterRequest() {
    if (pending && !paused) {
      // A waiting flush() sends now; otherwise keep the debounce from the last change.
      if (waiters.length) send();
      else schedule(lastChangeAt + delayMs - now());
    } else if (pending && paused) {
      settleWaiters(lastError && conflict ? lastError : stopped('autosave_paused', 'saving is paused'));
    } else {
      settleWaiters(null);
    }
    announce();
  }

  function finish(myGeneration, error, result) {
    saving = false;
    if (disposed) return;
    if (myGeneration !== generation) {
      afterRequest();
      return;
    }
    if (error) {
      pending = true; // nothing in that request was saved
      lastError = error;
      conflict = isConflict(error);
      if (conflict) paused = true;
      cancelTimer();
      settleWaiters(error);
      announce();
      if (conflict) onConflict(error);
      else onError(error);
      return;
    }
    if (result && result.base !== undefined) currentBase = result.base;
    savedAt = now();
    afterRequest();
    onSaved({ base: currentBase, savedAt, result });
  }

  function send() {
    cancelTimer();
    pending = false;
    saving = true;
    lastError = null;
    const myGeneration = generation;
    let request;
    try {
      request = Promise.resolve(save({ base: currentBase }));
    } catch (error) {
      request = Promise.reject(error);
    }
    request.then(
      (result) => finish(myGeneration, null, result),
      (error) => finish(myGeneration, error || stopped('autosave_failed', 'save failed without an error'), null),
    );
    announce();
  }

  function change() {
    if (disposed) return;
    pending = true;
    lastChangeAt = now();
    if (lastError && !conflict) lastError = null; // a new change retries after an error
    if (!saving && !paused) schedule(delayMs);
    announce();
  }

  // Resolves with the status once everything is saved (publish waits on it); rejects on a
  // conflict, an error, or while paused with changes waiting.
  function flush() {
    if (disposed) return Promise.reject(stopped('autosave_disposed', 'autosave was disposed'));
    if (!pending && !saving) return Promise.resolve(status());
    if (paused && !saving) return Promise.reject(conflict && lastError ? lastError : stopped('autosave_paused', 'saving is paused'));
    const promise = new Promise((resolve, reject) => waiters.push({ resolve, reject }));
    if (!saving) send();
    return promise;
  }

  function pause() {
    if (disposed || paused) return;
    paused = true;
    cancelTimer();
    if (!saving && pending) settleWaiters(stopped('autosave_paused', 'saving is paused'));
    announce();
  }

  // Continue after pause() or a conflict; "Keep mine" passes the conflict's current version as base.
  function resume(options = {}) {
    if (disposed) return;
    if (Object.prototype.hasOwnProperty.call(options, 'base')) currentBase = options.base;
    paused = false;
    conflict = false;
    lastError = null;
    if (pending && !saving) send();
    else announce();
  }

  // Forget unsaved changes ("Reload theirs", a restored revision): the next save starts from base.
  function reset(options = {}) {
    if (disposed) return;
    generation += 1;
    cancelTimer();
    if (Object.prototype.hasOwnProperty.call(options, 'base')) currentBase = options.base;
    pending = false;
    paused = false;
    conflict = false;
    lastError = null;
    settleWaiters(stopped('autosave_reset', 'unsaved changes were discarded'));
    announce();
  }

  // Every PageDetail from another call (publish, restore) replaces the base.
  function setBase(next) {
    currentBase = next;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    generation += 1;
    cancelTimer();
    settleWaiters(stopped('autosave_disposed', 'autosave was disposed'));
  }

  return {
    change, flush, pause, resume, reset, setBase, dispose, status,
    get state() { return stateOf(); },
    get base() { return currentBase; },
  };
}
