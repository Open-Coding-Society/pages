// ============================================
// srfscDashboard.js
// RESPONSIBILITY: Start every SRFSC dashboard panel and decide which panels refresh after an action.
// ============================================
import { loadWeatherPanel } from './weatherPanel.js';
import { loadKpiPanel } from './kpiPanel.js';
import { loadEventsPanel } from './eventsPanel.js';
import { initUpdatesPanel, loadUpdatesPanel } from './updatesPanel.js';
import { initActionPanel } from './actionPanel.js';
import { initChecklistPanel } from './checklistPanel.js';
import { initSrfscAdmin } from './srfscAdmin.js';

export function initSrfscDashboard() {
  const refreshEvents = () => loadEventsPanel(loadKpiPanel);

  initChecklistPanel();
  initActionPanel(loadKpiPanel);
  loadWeatherPanel();
  loadKpiPanel();
  refreshEvents();
  initUpdatesPanel();
  initSrfscAdmin({
    onUpdatePublished: loadUpdatesPanel,
    onEventCreated: () => { refreshEvents(); loadKpiPanel(); },
  });
}
