/**
 * stationStatus
 * -------------
 * Shared status constants + glyphs for any level that shows per-station
 * progress in the PLAYER PROFILE sidebar (StatusPanel).
 *
 * Per the Level 2 "Toolchain Trail" design doc, section 3:
 *   ✓ complete
 *   ⏳ currently active / in-progress
 *   —  locked, not yet reachable
 *   🔒 explicitly gated (boss level)
 *   ⚠  stuck (no progress signal for N minutes)
 *
 * These glyphs are intentionally centralized here (rather than hard-coded
 * per level) so the teacher dashboard can import/mirror the same mapping
 * later, per the design doc's note that the dashboard should reuse
 * whatever icon/color choice is made on the frontend.
 *
 * @module stationStatus
 */

export const STATION_STATUS = Object.freeze({
  LOCKED: 'locked',
  ACTIVE: 'active',
  STUCK: 'stuck',
  COMPLETE: 'complete',
});

export const STATUS_GLYPHS = Object.freeze({
  [STATION_STATUS.COMPLETE]: '✓',
  [STATION_STATUS.ACTIVE]: '⏳',
  [STATION_STATUS.LOCKED]: '—',
  [STATION_STATUS.STUCK]: '⚠',
});

// Distinct glyph for a station that is locked *because* it's gated behind
// finishing every other station (boss level), vs. a station that's simply
// "not reached yet" in the normal linear order.
export const BOSS_LOCK_GLYPH = '🔒';

/**
 * Format a station's status into the glyph shown next to its label in
 * the sidebar (e.g. "Git Village: ✓").
 *
 * @param {string} status one of STATION_STATUS
 * @param {boolean} isBossGate true if this station is only reachable after
 *   every other station is complete (Integration Summit / boss level)
 * @returns {string}
 */
export function formatStationGlyph(status, isBossGate = false) {
  if (isBossGate && status === STATION_STATUS.LOCKED) {
    return BOSS_LOCK_GLYPH;
  }
  return STATUS_GLYPHS[status] || STATUS_GLYPHS[STATION_STATUS.LOCKED];
}

/**
 * How long (ms) a station can sit "active" with no verification signal
 * before the frontend flags it "stuck" as a client-side fallback.
 * The backend's authoritative stuck flag (per the progression plan) should
 * always take priority over this when both are available — this constant
 * only covers the case where the frontend has to guess locally (e.g. demo
 * mode with no backend agent wired up yet).
 */
export const STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/**
 * CSS filter applied to a station gatekeeper's canvas to represent each
 * visual state, reusing the existing Character canvas `style.filter` hook
 * (see Character.js applyFilters / setupCanvas) rather than introducing a
 * new rendering path.
 */
export const STATION_VISUAL_FILTERS = Object.freeze({
  [STATION_STATUS.LOCKED]: 'grayscale(100%) brightness(0.45) contrast(0.9)',
  [STATION_STATUS.ACTIVE]: 'drop-shadow(0 0 10px #38bdf8) drop-shadow(0 0 18px #38bdf8) saturate(1.15)',
  [STATION_STATUS.STUCK]: 'drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 16px #f97316) saturate(1.1)',
  [STATION_STATUS.COMPLETE]: 'drop-shadow(0 0 8px #4ade80) saturate(1.05)',
});
