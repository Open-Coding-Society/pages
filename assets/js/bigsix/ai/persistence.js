// persistence.js
// RESPONSIBILITY: Save and restore AI lesson state to/from localStorage.
// No DOM side-effects — just reads and writes the storage key.

const STORAGE_KEY = 'ai_combined_v1';

// ── RESPONSIBILITY: Write current step + textarea values to localStorage ──────
export function persistState(step) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step,
      weakBullet:      document.getElementById('weak-bullet')?.value || '',
      interviewAnswer: document.getElementById('interview-answer')?.value || '',
    }));
  } catch (e) {}
}

// ── RESPONSIBILITY: Read saved state from localStorage ────────────────────────
export function restoreState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// ── RESPONSIBILITY: Mark the Big Six lesson as completed ──────────────────────
export function markLessonComplete() {
  const key = 'bigsix:ai_lesson:lesson:5';
  if (localStorage.getItem(key) !== 'done') {
    localStorage.setItem(key, 'done');
    console.log(`✅ Big Six completed: ${key}`);
  }
}