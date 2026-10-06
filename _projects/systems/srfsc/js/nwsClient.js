// ============================================
// nwsClient.js
// RESPONSIBILITY: Read Scripps Ranch conditions straight from the National Weather Service.
// Used when the SRFSC backend is unreachable; NWS allows cross-origin browser requests.
// ============================================
import { rateFireWeather } from './fireWeather.js';

// MCAS Miramar (KNKX) is the closest NWS observation station to Scripps Ranch.
const STATION_URL = 'https://api.weather.gov/stations/KNKX/observations/latest';
const ALERTS_URL = 'https://api.weather.gov/alerts/active?point=32.9109,-117.1036';
const KMH_TO_MPH = 0.621371;

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/geo+json' } });
  if (!response.ok) throw new Error(`NWS request failed (HTTP ${response.status})`);
  return response.json();
}

const readingValue = (observation, field) => {
  const value = observation?.[field]?.value;
  return typeof value === 'number' ? Math.round(value * 10) / 10 : null;
};

/** Same shape as GET /api/srfsc/conditions. */
export async function fetchNwsConditions() {
  const [station, alerts] = await Promise.all([getJson(STATION_URL), getJson(ALERTS_URL)]);
  const observation = station.properties || {};
  const alertList = (alerts.features || []).map((feature) => feature.properties || {});

  const humidity = readingValue(observation, 'relativeHumidity');
  const windKmh = readingValue(observation, 'windSpeed');
  const windMph = windKmh == null ? null : Math.round(windKmh * KMH_TO_MPH * 10) / 10;
  const tempC = readingValue(observation, 'temperature');
  const alertEvents = alertList.map((alert) => alert.event).filter(Boolean);

  return {
    ...rateFireWeather(humidity, windMph, alertEvents),
    humidity_percent: humidity,
    wind_mph: windMph,
    temperature_f: tempC == null ? null : Math.round((tempC * 9) / 5 + 32),
    observed_at: observation.timestamp,
    alerts: alertList.map((alert) => ({ event: alert.event, headline: alert.headline })),
    source: 'National Weather Service (KNKX Miramar)',
  };
}
