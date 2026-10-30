// Undo and redo for the editor (DESIGN §7.1). Every entry is {page, selectedId}: the page and
// the selection to show with it. Typing in one field merges into one step while pushes with the
// same coalesceKey keep coming within 800 ms of each other, so Undo takes back a word or a
// sentence, not a single letter. Pure: the clock is injected.

const COALESCE_MS = 800;

function entryOf(page, selectedId) {
  if (page === null || typeof page !== 'object') throw new TypeError('UI Builder history: a page must be an object');
  return { page, selectedId: typeof selectedId === 'string' && selectedId ? selectedId : null };
}

export function createHistory(initial, { limit = 100, now = Date.now, selectedId = null } = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new TypeError('UI Builder history: limit must be a whole number of at least 1');
  if (typeof now !== 'function') throw new TypeError('UI Builder history: now must be a function');
  let present = entryOf(initial, selectedId);
  let presentJson = JSON.stringify(initial);
  let past = [];
  let future = [];
  // The step the next push may merge into: set by pushes only, so an undo, redo or reset always
  // starts a new step.
  let lastKey = null;
  let lastPushAt = 0;

  const copy = (entry) => ({ page: entry.page, selectedId: entry.selectedId });

  function push(next, { coalesceKey = null, selectedId: nextSelected = null } = {}) {
    const entry = entryOf(next, nextSelected);
    const nextJson = JSON.stringify(next);
    if (nextJson === presentJson) return false;
    const time = now();
    const merge = typeof coalesceKey === 'string' && coalesceKey !== '' && coalesceKey === lastKey
      && past.length > 0 && time - lastPushAt <= COALESCE_MS;
    future = [];
    if (merge && nextJson === JSON.stringify(past[past.length - 1].page)) {
      // Typed and then deleted again: the merged step changes nothing, so it disappears.
      present = past.pop();
      presentJson = nextJson;
      lastKey = null;
      return true;
    }
    if (!merge) {
      past.push(present);
      if (past.length > limit) past.shift();
    }
    // A merged step keeps its original "before" (the entry under it) and takes the newest page.
    present = entry;
    presentJson = nextJson;
    lastKey = typeof coalesceKey === 'string' && coalesceKey !== '' ? coalesceKey : null;
    lastPushAt = time;
    return true;
  }

  function undo() {
    if (!past.length) return null;
    future.push(present);
    present = past.pop();
    presentJson = JSON.stringify(present.page);
    lastKey = null;
    return copy(present);
  }

  function redo() {
    if (!future.length) return null;
    past.push(present);
    present = future.pop();
    presentJson = JSON.stringify(present.page);
    lastKey = null;
    return copy(present);
  }

  // A page from somewhere else (opened, reloaded after a conflict, restored): no undo across it.
  function reset(page, { selectedId: resetSelected = null } = {}) {
    present = entryOf(page, resetSelected);
    presentJson = JSON.stringify(page);
    past = [];
    future = [];
    lastKey = null;
    return copy(present);
  }

  return {
    get present() { return copy(present); },
    push,
    undo,
    redo,
    reset,
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
  };
}
