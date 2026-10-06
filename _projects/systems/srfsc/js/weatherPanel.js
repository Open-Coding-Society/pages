// ============================================
// weatherPanel.js
// RESPONSIBILITY: Render the live fire-weather card (backend /conditions, else NWS directly).
// ============================================
import { fetchConditions } from './srfscApi.js';
import { fetchNwsConditions } from './nwsClient.js';
import { createElement } from './srfscDom.js';

const formatReading = (value, unit) => (value === null || value === undefined ? '–' : `${value}${unit}`);

function renderConditions(conditions) {
  const card = document.getElementById('srfsc-weather');
  // data-level drives the card color in SCSS (Normal / Elevated / High / Extreme / Unknown)
  card.dataset.level = conditions.level;
  document.getElementById('srfsc-weather-level').textContent = conditions.level;
  document.getElementById('srfsc-weather-humidity').textContent = formatReading(conditions.humidity_percent, '%');
  document.getElementById('srfsc-weather-wind').textContent = formatReading(conditions.wind_mph, ' mph');
  document.getElementById('srfsc-weather-temp').textContent = formatReading(conditions.temperature_f, '°F');
  document.getElementById('srfsc-weather-message').textContent = conditions.message;

  const alertList = document.getElementById('srfsc-weather-alerts');
  alertList.replaceChildren(...(conditions.alerts || []).map((alert) =>
    createElement('li', 'srfsc-weather__alert', alert.event)));

  if (conditions.source && conditions.source !== 'unavailable') {
    const staleNote = conditions.stale ? ' (last known reading)' : '';
    document.getElementById('srfsc-weather-source').textContent =
      `Source: ${conditions.source}${staleNote}. Unofficial indicator. Follow CAL FIRE and SDFR guidance.`;
  }
}

// Prefer the backend's cached reading; fall back to NWS directly so the risk tile works without it.
export async function loadWeatherPanel() {
  try {
    renderConditions(await fetchConditions());
    return;
  } catch (backendError) {
    console.info('SRFSC conditions: backend unavailable, reading NWS directly.', backendError.message);
  }
  try {
    renderConditions(await fetchNwsConditions());
  } catch (nwsError) {
    renderConditions({
      level: 'Unknown',
      message: 'Live weather is unavailable. Check CAL FIRE and SDFR for current conditions.',
      alerts: [],
    });
  }
}
