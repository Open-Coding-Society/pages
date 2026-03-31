// persistence.js
// RESPONSIBILITY: Save and restore resume lesson state to/from localStorage.
// Registers onto window.Resume — no ES module exports needed.

window.Resume = window.Resume || {};

const STORAGE_KEY = 'resume_combined_v1';

// ── RESPONSIBILITY: Write full state to localStorage ─────────────────────────
Resume.persist = function(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step:        state.step,
      personal:    state.personal,
      hard:        Array.from(state.hardSkills),
      soft:        Array.from(state.softSkills),
      education:   state.education,
      experiences: state.experiences,
      about:       state.about,
    }));
  } catch (e) {}
};

// ── RESPONSIBILITY: Read saved state from localStorage ────────────────────────
Resume.restore = function() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};