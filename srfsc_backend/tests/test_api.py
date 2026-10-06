"""
Behavior tests for the standalone SRFSC backend.

Each test gets a fresh app and temporary SQLite file. Run from srfsc_backend/:
    python -m unittest discover -s tests -v
"""
import os
import sys
import tempfile
import unittest
from datetime import date, timedelta

import requests

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from srfsc.app import create_app  # noqa: E402
from srfsc.conditions import ConditionsCache, rate_fire_weather  # noqa: E402
from srfsc.extensions import db  # noqa: E402
from srfsc.models import SrfscEvent, SrfscUpdate, init_srfsc  # noqa: E402
from srfsc.validation import validate_event, validate_hazard_report, validate_volunteer  # noqa: E402

ADMIN_KEY = 'test-council-key'


class SrfscValidationTest(unittest.TestCase):

    def test_volunteer_requires_valid_email(self):
        _, error = validate_volunteer({"name": "Sam", "email": "nope", "interest": "Clearing Day"})
        self.assertIn("email", error)

    def test_volunteer_rejects_unknown_interest(self):
        _, error = validate_volunteer({"name": "Sam", "email": "s@x.org", "interest": "Arson"})
        self.assertIn("interest", error)

    def test_volunteer_trims_and_lowercases(self):
        clean, error = validate_volunteer({"name": "  Sam ", "email": "S@X.org", "interest": "Clearing Day"})
        self.assertIsNone(error)
        self.assertEqual(clean["name"], "Sam")
        self.assertEqual(clean["email"], "s@x.org")
        self.assertIsNone(clean["phone"])

    def test_report_requires_description(self):
        _, error = validate_hazard_report({"hazard_type": "Hazard Tree", "location": "Canyon"})
        self.assertIn("description", error)

    def test_event_date_must_be_iso(self):
        _, error = validate_event({"title": "T", "event_type": "Clearing Day",
                                   "event_date": "10/17/2026", "location": "Park"})
        self.assertIn("YYYY-MM-DD", error)

    def test_non_object_body_is_rejected(self):
        _, error = validate_volunteer(None)
        self.assertIn("JSON object", error)


class SrfscApiTest(unittest.TestCase):

    def setUp(self):
        self.tmp_dir = tempfile.TemporaryDirectory()
        self.app = create_app({
            'TESTING': True,
            'SQLALCHEMY_DATABASE_URI': 'sqlite:///' + os.path.join(self.tmp_dir.name, 'srfsc_test.db'),
            'SRFSC_ADMIN_KEY': ADMIN_KEY,
        })
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        # create_app seeds starter content; start each test from empty tables for exact counts
        db.drop_all()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        db.engine.dispose()
        self.ctx.pop()
        self.tmp_dir.cleanup()

    def admin_headers(self):
        return {"Authorization": f"Bearer {ADMIN_KEY}"}

    def test_wrong_admin_key_is_rejected(self):
        response = self.client.get('/api/srfsc/volunteers', headers={"Authorization": "Bearer nope"})
        self.assertEqual(response.status_code, 401)

    def test_admin_endpoints_fail_closed_without_configured_key(self):
        self.app.config['SRFSC_ADMIN_KEY'] = ''
        response = self.client.get('/api/srfsc/volunteers', headers={"Authorization": "Bearer "})
        self.assertEqual(response.status_code, 401)

    def test_team_site_gets_credentialed_cors(self):
        response = self.client.get('/api/srfsc/stats', headers={"Origin": "https://jas-bop2.github.io"})
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), 'https://jas-bop2.github.io')
        self.assertEqual(response.headers.get('Access-Control-Allow-Credentials'), 'true')

    def test_unknown_origin_gets_no_cors(self):
        response = self.client.get('/api/srfsc/stats', headers={"Origin": "https://evil.example"})
        self.assertIsNone(response.headers.get('Access-Control-Allow-Origin'))

    def test_public_volunteer_signup_hides_contact_info(self):
        response = self.client.post('/api/srfsc/volunteers', json={
            "name": "Sam", "email": "sam@example.org", "interest": "Clearing Day"})
        self.assertEqual(response.status_code, 201)
        self.assertNotIn("email", response.get_json())

    def test_invalid_volunteer_signup_returns_400(self):
        response = self.client.post('/api/srfsc/volunteers', json={"name": "Sam"})
        self.assertEqual(response.status_code, 400)

    def test_volunteer_list_requires_auth(self):
        self.assertEqual(self.client.get('/api/srfsc/volunteers').status_code, 401)

    def test_admin_can_list_volunteers(self):
        self.client.post('/api/srfsc/volunteers', json={
            "name": "Sam", "email": "sam@example.org", "interest": "Board Leadership"})
        response = self.client.get('/api/srfsc/volunteers', headers=self.admin_headers())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()[0]["email"], "sam@example.org")

    def test_hazard_report_lifecycle(self):
        created = self.client.post('/api/srfsc/reports', json={
            "hazard_type": "Hazard Tree", "location": "Aviary Dr canyon",
            "description": "Dead eucalyptus leaning over trail", "reporter_email": "r@example.org"})
        self.assertEqual(created.status_code, 201)
        body = created.get_json()
        self.assertEqual(body["status"], "New")
        self.assertNotIn("reporter_email", body)

        updated = self.client.put(f'/api/srfsc/reports/{body["id"]}', json={"status": "Resolved"},
                                  headers=self.admin_headers())
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.get_json()["status"], "Resolved")

        stats = self.client.get('/api/srfsc/stats').get_json()
        self.assertEqual(stats["hazard_reports"], 1)
        self.assertEqual(stats["resolved_reports"], 1)

    def test_events_hide_past_by_default(self):
        SrfscEvent("Past", "Clearing Day", date.today() - timedelta(days=1), "Park").create()
        SrfscEvent("Next", "Clearing Day", date.today() + timedelta(days=1), "Park").create()
        titles = [e["title"] for e in self.client.get('/api/srfsc/events').get_json()]
        self.assertEqual(titles, ["Next"])
        all_titles = [e["title"] for e in self.client.get('/api/srfsc/events?all=true').get_json()]
        self.assertEqual(len(all_titles), 2)

    def test_event_create_requires_admin(self):
        payload = {"title": "Expo", "event_type": "Fire Safety Expo",
                   "event_date": "2030-01-01", "location": "Park"}
        self.assertEqual(self.client.post('/api/srfsc/events', json=payload).status_code, 401)
        created = self.client.post('/api/srfsc/events', json=payload, headers=self.admin_headers())
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.get_json()["event_date"], "2030-01-01")

    def test_seed_is_idempotent(self):
        init_srfsc()
        first_count = SrfscEvent.query.count()
        init_srfsc()
        self.assertEqual(SrfscEvent.query.count(), first_count)
        self.assertGreater(first_count, 0)

    def test_rsvp_counts_once_per_email(self):
        event = SrfscEvent("Clearing Day", "Clearing Day", date.today() + timedelta(days=3), "Canyon").create()
        rsvp = {"name": "Sam", "email": "sam@example.org"}
        first = self.client.post(f'/api/srfsc/events/{event.id}/rsvp', json=rsvp)
        self.assertEqual(first.status_code, 201)
        self.assertEqual(first.get_json()["rsvp_count"], 1)
        duplicate = self.client.post(f'/api/srfsc/events/{event.id}/rsvp', json={**rsvp, "email": "SAM@example.org"})
        self.assertEqual(duplicate.status_code, 409)
        self.assertEqual(self.client.get('/api/srfsc/events').get_json()[0]["rsvp_count"], 1)

    def test_rsvp_rejects_past_and_missing_events(self):
        past = SrfscEvent("Old", "Clearing Day", date.today() - timedelta(days=3), "Canyon").create()
        rsvp = {"name": "Sam", "email": "sam@example.org"}
        self.assertEqual(self.client.post(f'/api/srfsc/events/{past.id}/rsvp', json=rsvp).status_code, 400)
        self.assertEqual(self.client.post('/api/srfsc/events/999/rsvp', json=rsvp).status_code, 404)

    def test_updates_are_public_but_posting_requires_admin(self):
        payload = {"title": "Chipper day recap", "body": "40 bags of brush removed.", "category": "News"}
        self.assertEqual(self.client.post('/api/srfsc/updates', json=payload).status_code, 401)
        created = self.client.post('/api/srfsc/updates', json=payload, headers=self.admin_headers())
        self.assertEqual(created.status_code, 201)
        feed = self.client.get('/api/srfsc/updates?limit=1').get_json()
        self.assertEqual([item["title"] for item in feed], ["Chipper day recap"])

    def test_stats_include_next_event_and_open_reports(self):
        SrfscEvent("Later", "Clearing Day", date.today() + timedelta(days=9), "Park").create()
        SrfscEvent("Sooner", "Block Meeting", date.today() + timedelta(days=2), "Library").create()
        self.client.post('/api/srfsc/reports', json={
            "hazard_type": "Other", "location": "Trail", "description": "Brush pile"})
        stats = self.client.get('/api/srfsc/stats').get_json()
        self.assertEqual(stats["next_event"]["title"], "Sooner")
        self.assertEqual(stats["open_reports"], 1)
        self.assertEqual(stats["upcoming_events"], 2)

    def test_seed_creates_updates_even_when_events_exist(self):
        SrfscEvent("Existing", "Clearing Day", date.today(), "Park").create()
        init_srfsc()
        self.assertGreater(SrfscUpdate.query.count(), 0)


class SrfscConditionsTest(unittest.TestCase):

    def test_red_flag_alert_is_extreme_regardless_of_weather(self):
        level, _ = rate_fire_weather(80, 0, ["Red Flag Warning"])
        self.assertEqual(level, "Extreme")

    def test_dry_and_windy_is_high(self):
        self.assertEqual(rate_fire_weather(10, 30, [])[0], "High")

    def test_dry_or_breezy_is_elevated(self):
        self.assertEqual(rate_fire_weather(24, 5, [])[0], "Elevated")
        self.assertEqual(rate_fire_weather(60, 18, [])[0], "Elevated")

    def test_calm_and_humid_is_normal(self):
        self.assertEqual(rate_fire_weather(60, 5, ["Extreme Heat Warning"])[0], "Normal")

    def test_missing_weather_is_unknown(self):
        self.assertEqual(rate_fire_weather(None, None, [])[0], "Unknown")

    def test_cache_reuses_payload_within_ttl(self):
        calls = []
        now = [0]
        cache = ConditionsCache(fetcher=lambda: calls.append(1) or {"level": "Normal"},
                                clock=lambda: now[0], ttl_seconds=600)
        cache.get()
        now[0] = 599
        cache.get()
        self.assertEqual(len(calls), 1)
        now[0] = 601
        cache.get()
        self.assertEqual(len(calls), 2)

    def test_cache_serves_stale_payload_when_nws_fails(self):
        responses = [{"level": "Elevated"}]

        def flaky_fetch():
            if responses:
                return responses.pop()
            raise requests.ConnectionError("NWS down")

        now = [0]
        cache = ConditionsCache(fetcher=flaky_fetch, clock=lambda: now[0], ttl_seconds=10)
        cache.get()
        now[0] = 20
        stale = cache.get()
        self.assertEqual(stale["level"], "Elevated")
        self.assertTrue(stale["stale"])

    def test_cache_reports_unknown_when_nws_never_answers(self):
        def failing_fetch():
            raise requests.Timeout("slow")
        self.assertEqual(ConditionsCache(fetcher=failing_fetch).get()["level"], "Unknown")


if __name__ == '__main__':
    unittest.main()
