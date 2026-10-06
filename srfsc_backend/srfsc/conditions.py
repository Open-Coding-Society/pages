"""
Local fire-weather conditions for the SRFSC dashboard, from the National Weather Service API.

The rating is a rough, unofficial indicator built from humidity, wind, and active NWS alerts.
It exists to make wildfire risk visible on the page, not to replace CAL FIRE / SDFR guidance.
"""
import time

import requests

# MCAS Miramar (KNKX) is the closest NWS observation station to Scripps Ranch.
NWS_STATION_URL = "https://api.weather.gov/stations/KNKX/observations/latest"
NWS_ALERTS_URL = "https://api.weather.gov/alerts/active?point=32.9109,-117.1036"
# NWS rejects requests without an identifying User-Agent.
NWS_HEADERS = {"User-Agent": "srfsc-capstone (Open Coding Society student project)", "Accept": "application/geo+json"}
NWS_TIMEOUT_SECONDS = 6
CACHE_SECONDS = 600

KMH_TO_MPH = 0.621371
RED_FLAG_EVENTS = {"Red Flag Warning", "Fire Weather Watch", "Extreme Fire Danger"}


def rate_fire_weather(humidity_percent, wind_mph, alert_events):
    """
    Return (level, message) for the dashboard.
    Levels: 'Extreme' > 'High' > 'Elevated' > 'Normal' > 'Unknown'.
    """
    if RED_FLAG_EVENTS.intersection(alert_events):
        return "Extreme", "Red flag conditions. Avoid sparks, keep your go-bag ready, and follow evacuation orders."
    if humidity_percent is None and wind_mph is None:
        return "Unknown", "Live weather is unavailable. Check CAL FIRE and SDFR for current conditions."
    humidity = humidity_percent if humidity_percent is not None else 100
    wind = wind_mph if wind_mph is not None else 0
    if humidity <= 15 and wind >= 25:
        return "High", "Very dry and windy. Fire can spread fast; postpone mowing and outdoor equipment use."
    if humidity <= 25 or wind >= 15:
        return "Elevated", "Dry or breezy. Clear debris near your home and stay alert."
    return "Normal", "Conditions are calmer today. A good time to work on defensible space."


def _unit_value(observation, field):
    value = (observation.get(field) or {}).get("value")
    return round(value, 1) if isinstance(value, (int, float)) else None


def _fetch_json(url):
    response = requests.get(url, headers=NWS_HEADERS, timeout=NWS_TIMEOUT_SECONDS)
    response.raise_for_status()
    return response.json()


def fetch_conditions():
    """Call NWS and build the conditions payload. Raises requests.RequestException on failure."""
    observation = _fetch_json(NWS_STATION_URL).get("properties", {})
    alerts = [feature.get("properties", {}) for feature in _fetch_json(NWS_ALERTS_URL).get("features", [])]

    humidity = _unit_value(observation, "relativeHumidity")
    wind_kmh = _unit_value(observation, "windSpeed")
    wind_mph = round(wind_kmh * KMH_TO_MPH, 1) if wind_kmh is not None else None
    temp_c = _unit_value(observation, "temperature")
    alert_events = [alert.get("event") for alert in alerts if alert.get("event")]

    level, message = rate_fire_weather(humidity, wind_mph, alert_events)
    return {
        "level": level,
        "message": message,
        "humidity_percent": humidity,
        "wind_mph": wind_mph,
        "temperature_f": round(temp_c * 9 / 5 + 32) if temp_c is not None else None,
        "observed_at": observation.get("timestamp"),
        "alerts": [{"event": alert.get("event"), "headline": alert.get("headline")} for alert in alerts],
        "source": "National Weather Service (KNKX Miramar)",
    }


class ConditionsCache:
    """Caches the last good NWS payload so page loads don't hammer the NWS API."""

    def __init__(self, fetcher=fetch_conditions, clock=time.monotonic, ttl_seconds=CACHE_SECONDS):
        self._fetcher = fetcher
        self._clock = clock
        self._ttl = ttl_seconds
        self._payload = None
        self._fetched_at = None

    def get(self):
        now = self._clock()
        if self._payload is not None and now - self._fetched_at < self._ttl:
            return self._payload
        try:
            self._payload = self._fetcher()
            self._fetched_at = now
        except (requests.RequestException, ValueError) as error:
            print(f"SRFSC conditions: NWS request failed ({error}); serving fallback")
            if self._payload is not None:
                return {**self._payload, "stale": True}
            level, message = rate_fire_weather(None, None, [])
            return {"level": level, "message": message, "alerts": [], "source": "unavailable"}
        return self._payload
