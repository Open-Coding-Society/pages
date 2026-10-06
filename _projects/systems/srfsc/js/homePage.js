// ============================================
// homePage.js
// RESPONSIBILITY: Start the dashboard hub: weather, KPIs, hub card statuses, and the two preview lists.
// ============================================
import { fetchUpcomingEvents, fetchUpdates } from './srfscApi.js';
import { createElement, formatDate } from './srfscDom.js';
import { loadWeatherPanel } from './weatherPanel.js';
import { loadKpiPanel } from './kpiPanel.js';
import { FALLBACK_UPDATES, OFFLINE_EVENTS_MESSAGE } from './srfscFallback.js';

const PREVIEW_COUNT = 3;

function renderNextEvent(nextEvent, siteRoot) {
  const status = document.getElementById('srfsc-hub-next-event');
  const cta = document.getElementById('srfsc-next-event-cta');
  if (!nextEvent) {
    status.textContent = 'New dates coming soon';
    return;
  }
  const label = `${nextEvent.title} · ${formatDate(nextEvent.event_date)}`;
  status.textContent = `Next: ${label}`;
  cta.textContent = `Join ${label}`;
  cta.href = `${siteRoot}events/#srfsc-event-${nextEvent.id}`;
}

function renderPreviewList(listId, items, buildItem, emptyText) {
  const list = document.getElementById(listId);
  if (items.length === 0) {
    list.replaceChildren(createElement('li', 'srfsc-empty', emptyText));
    return;
  }
  list.replaceChildren(...items.slice(0, PREVIEW_COUNT).map(buildItem));
}

function buildEventPreview(event, siteRoot) {
  const item = createElement('li', 'srfsc-mini-list__item');
  const link = createElement('a', 'srfsc-mini-list__link');
  link.href = `${siteRoot}events/#srfsc-event-${event.id}`;
  link.append(
    createElement('span', 'srfsc-mini-list__date', formatDate(event.event_date)),
    createElement('span', 'srfsc-mini-list__title', event.title),
    createElement('span', 'srfsc-mini-list__meta', `${event.event_type} · ${event.rsvp_count} going`),
  );
  item.append(link);
  return item;
}

function buildUpdatePreview(update, siteRoot) {
  const item = createElement('li', 'srfsc-mini-list__item');
  const link = createElement('a', 'srfsc-mini-list__link');
  link.href = `${siteRoot}community/`;
  link.append(
    createElement('span', 'srfsc-mini-list__date', update.category),
    createElement('span', 'srfsc-mini-list__title', update.title),
  );
  item.append(link);
  return item;
}

async function loadPreviews(siteRoot) {
  const latestStatus = document.getElementById('srfsc-hub-latest-update');
  try {
    const events = await fetchUpcomingEvents();
    renderPreviewList('srfsc-home-events', events, (event) => buildEventPreview(event, siteRoot), 'No upcoming events yet.');
  } catch (error) {
    const message = error.offline ? OFFLINE_EVENTS_MESSAGE : error.message;
    document.getElementById('srfsc-home-events').replaceChildren(createElement('li', 'srfsc-empty', message));
  }

  let updates = [];
  try {
    updates = await fetchUpdates(PREVIEW_COUNT);
  } catch (error) {
    if (!error.offline) {
      document.getElementById('srfsc-home-updates').replaceChildren(createElement('li', 'srfsc-empty', error.message));
      latestStatus.textContent = 'Read the latest news →';
      return;
    }
    updates = [...FALLBACK_UPDATES];
  }
  renderPreviewList('srfsc-home-updates', updates, (update) => buildUpdatePreview(update, siteRoot), 'No updates yet.');
  latestStatus.textContent = updates.length ? `Latest: ${updates[0].title}` : 'No updates yet';
}

/** @param {string} siteRoot the SRFSC site root URL (baseurl-aware), ending in "/" */
export async function initHomePage(siteRoot) {
  loadWeatherPanel();
  loadPreviews(siteRoot);
  const stats = await loadKpiPanel();
  if (stats) {
    renderNextEvent(stats.next_event, siteRoot);
  } else {
    document.getElementById('srfsc-hub-next-event').textContent = 'Monthly clearing days →';
  }
}
