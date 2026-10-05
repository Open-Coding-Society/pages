// ============================================
// kpiPanel.js
// RESPONSIBILITY: Fill [data-live-stat] tiles and the "Join the next event" call to action from /stats.
// ============================================
import { fetchStats } from './srfscApi.js';
import { formatDate } from './srfscDom.js';

function renderNextEventCta(nextEvent) {
  const cta = document.getElementById('srfsc-next-event-cta');
  if (!cta || !nextEvent) return;
  cta.textContent = `Join ${nextEvent.title} · ${formatDate(nextEvent.event_date)}`;
  cta.href = `#srfsc-event-${nextEvent.id}`;
}

export async function loadKpiPanel() {
  try {
    const stats = await fetchStats();
    document.querySelectorAll('[data-live-stat]').forEach((element) => {
      const value = stats[element.dataset.liveStat];
      if (value === undefined) return;
      element.textContent = element.dataset.liveStat === 'upcoming_events' ? `${value} scheduled` : value;
    });
    renderNextEventCta(stats.next_event);
  } catch (error) {
    // Live counts are a bonus; the static impact numbers still render without the backend.
    console.warn('SRFSC stats unavailable:', error.message);
  }
}
