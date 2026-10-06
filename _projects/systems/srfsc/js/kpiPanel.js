// ============================================
// kpiPanel.js
// RESPONSIBILITY: Fill every [data-live-stat] element on the page from /api/srfsc/stats.
// When the backend is unavailable, live-only tiles are hidden and [data-offline-text] elements
// show their fallback wording instead of empty dashes.
// ============================================
import { fetchStats } from './srfscApi.js';

/** @returns {Promise<object|null>} the stats payload, or null when the backend is unreachable */
export async function loadKpiPanel() {
  try {
    const stats = await fetchStats();
    document.querySelectorAll('[data-live-stat]').forEach((element) => {
      const value = stats[element.dataset.liveStat];
      if (value === undefined) return;
      element.textContent = element.dataset.liveStat === 'upcoming_events' ? `${value} scheduled` : value;
    });
    return stats;
  } catch (error) {
    // Live counts are a bonus; static impact numbers still render without the backend.
    console.warn('SRFSC stats unavailable:', error.message);
    document.querySelectorAll('.srfsc-kpi--live').forEach((tile) => { tile.hidden = true; });
    document.querySelectorAll('[data-offline-text]').forEach((element) => {
      element.textContent = element.dataset.offlineText;
    });
    return null;
  }
}
