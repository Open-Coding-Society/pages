// ============================================
// fireWeather.js
// RESPONSIBILITY: Pure fire-weather rating, mirroring rate_fire_weather() in the Flask
// api/srfsc_conditions.py so the browser fallback and the backend agree. Keep the two in sync.
// ============================================

const RED_FLAG_EVENTS = new Set(['Red Flag Warning', 'Fire Weather Watch', 'Extreme Fire Danger']);

/**
 * @param {number|null} humidityPercent
 * @param {number|null} windMph
 * @param {string[]} alertEvents NWS alert event names
 * @returns {{ level: string, message: string }}
 */
export function rateFireWeather(humidityPercent, windMph, alertEvents) {
  if (alertEvents.some((event) => RED_FLAG_EVENTS.has(event))) {
    return { level: 'Extreme', message: 'Red flag conditions. Avoid sparks, keep your go-bag ready, and follow evacuation orders.' };
  }
  if (humidityPercent == null && windMph == null) {
    return { level: 'Unknown', message: 'Live weather is unavailable. Check CAL FIRE and SDFR for current conditions.' };
  }
  const humidity = humidityPercent ?? 100;
  const wind = windMph ?? 0;
  if (humidity <= 15 && wind >= 25) {
    return { level: 'High', message: 'Very dry and windy. Fire can spread fast; postpone mowing and outdoor equipment use.' };
  }
  if (humidity <= 25 || wind >= 15) {
    return { level: 'Elevated', message: 'Dry or breezy. Clear debris near your home and stay alert.' };
  }
  return { level: 'Normal', message: 'Conditions are calmer today. A good time to work on defensible space.' };
}
