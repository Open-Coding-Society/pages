/**
 * Local-only star progression persistence.
 * Uses localStorage so progress survives page reloads on this machine only.
 */

const STORAGE_KEY = 'rlg-progress-v1';

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {
    /* storage blocked — silently ignore */
  }
}

export function getLevelStars(levelId) {
  const data = read();
  return data[levelId] || 0;
}

export function saveLevelStars(levelId, stars) {
  const data = read();
  const prev = data[levelId] || 0;
  if (stars > prev) {
    data[levelId] = stars;
    write(data);
  }
  return Math.max(stars, prev);
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}
