// ============================================
// defensibleSpace.js
// RESPONSIBILITY: Defensible-space checklist data and pure scoring.
// No DOM access, so the scoring rules are easy to test and reuse.
// ============================================

// Zones follow CAL FIRE's defensible space guidance (Zone 0 / 1 / 2).
export const CHECKLIST_ZONES = Object.freeze([
  {
    id: 'zone0',
    title: 'Zone 0 · 0–5 ft (Ember-Resistant)',
    items: [
      { id: 'z0-mulch', text: 'No bark mulch, dead plants, or firewood against the house' },
      { id: 'z0-gutters', text: 'Roof and gutters cleared of leaves and needles' },
      { id: 'z0-vents', text: '1/8" metal mesh screens on attic and crawlspace vents' },
    ],
  },
  {
    id: 'zone1',
    title: 'Zone 1 · 5–30 ft (Lean, Clean & Green)',
    items: [
      { id: 'z1-dead', text: 'Dead vegetation and dry grass removed' },
      { id: 'z1-branches', text: 'Tree branches trimmed 10 ft from chimney and roof' },
      { id: 'z1-spacing', text: 'Shrubs spaced so fire cannot jump plant to plant' },
    ],
  },
  {
    id: 'zone2',
    title: 'Zone 2 · 30–100 ft (Reduce Fuel)',
    items: [
      { id: 'z2-grass', text: 'Annual grass mowed to 4" or less' },
      { id: 'z2-ladder', text: 'Ladder fuels removed under trees (6 ft clearance)' },
      { id: 'z2-canyon', text: 'Canyon edge / firebreak behind home maintained' },
    ],
  },
]);

const TOTAL_ITEMS = CHECKLIST_ZONES.reduce((sum, zone) => sum + zone.items.length, 0);

/**
 * Score a set of checked item ids.
 * @param {Set<string>} checkedIds
 * @returns {{ percent: number, level: 'low'|'medium'|'high', label: string }}
 */
export function scoreChecklist(checkedIds) {
  const percent = Math.round((checkedIds.size / TOTAL_ITEMS) * 100);
  if (percent >= 80) return { percent, level: 'high', label: 'Well prepared — keep it maintained' };
  if (percent >= 50) return { percent, level: 'medium', label: 'Getting there — focus on Zone 0 first' };
  return { percent, level: 'low', label: 'High risk — join a Clearing Day or ask for help' };
}
