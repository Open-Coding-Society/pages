"""
SRFSC (Scripps Ranch Fire Safe Council) API.

Public:  events (+ RSVP), community updates, live fire-weather conditions, dashboard stats,
         volunteer signup, hazard reports.
Admin:   create/delete events and updates, view volunteers, triage hazard reports.
"""
from datetime import date

from flask import Blueprint, request
from flask_restful import Api, Resource

from srfsc.extensions import db
from srfsc.auth import admin_required
from srfsc.conditions import ConditionsCache
from srfsc.validation import (
    validate_event, validate_hazard_report, validate_report_status, validate_rsvp,
    validate_update, validate_volunteer,
)
from srfsc.models import SrfscEvent, SrfscHazardReport, SrfscRsvp, SrfscUpdate, SrfscVolunteer

srfsc_api = Blueprint('srfsc_api', __name__, url_prefix='/api/srfsc')
api = Api(srfsc_api)

# One shared cache per process so every dashboard load reuses the same NWS response.
conditions_cache = ConditionsCache()


def _upcoming_events_query():
    return SrfscEvent.query.filter(SrfscEvent.event_date >= date.today())


class SrfscAPI:

    class _Events(Resource):
        def get(self):
            """Upcoming events, soonest first. ?all=true includes past events."""
            query = SrfscEvent.query if request.args.get('all') == 'true' else _upcoming_events_query()
            events = query.order_by(SrfscEvent.event_date.asc()).all()
            return [event.read() for event in events], 200

        @admin_required
        def post(self):
            clean, error = validate_event(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            event = SrfscEvent(**clean).create()
            if event is None:
                return {"message": "Could not save event."}, 500
            return event.read(), 201

    class _Event(Resource):
        @admin_required
        def delete(self, event_id):
            event = db.session.get(SrfscEvent, event_id)
            if event is None:
                return {"message": f"Event {event_id} not found."}, 404
            event.delete()
            return {"message": f"Event {event_id} deleted."}, 200

    class _EventRsvp(Resource):
        def post(self, event_id):
            event = db.session.get(SrfscEvent, event_id)
            if event is None:
                return {"message": f"Event {event_id} not found."}, 404
            if event.event_date < date.today():
                return {"message": "This event has already happened."}, 400
            clean, error = validate_rsvp(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            if SrfscRsvp(event_id=event.id, **clean).create() is None:
                return {"message": "You're already signed up for this event."}, 409
            return {"message": f"See you at {event.title}!", "rsvp_count": event.rsvps.count()}, 201

    class _Updates(Resource):
        def get(self):
            """Newest community updates first. ?limit=N caps the list (default 10)."""
            limit = request.args.get('limit', default=10, type=int)
            limit = min(max(limit, 1), 50)
            updates = SrfscUpdate.query.order_by(SrfscUpdate.created_at.desc()).limit(limit).all()
            return [update.read() for update in updates], 200

        @admin_required
        def post(self):
            clean, error = validate_update(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            update = SrfscUpdate(**clean).create()
            if update is None:
                return {"message": "Could not save update."}, 500
            return update.read(), 201

    class _Update(Resource):
        @admin_required
        def delete(self, update_id):
            update = db.session.get(SrfscUpdate, update_id)
            if update is None:
                return {"message": f"Update {update_id} not found."}, 404
            update.delete()
            return {"message": f"Update {update_id} deleted."}, 200

    class _Volunteers(Resource):
        def post(self):
            clean, error = validate_volunteer(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            volunteer = SrfscVolunteer(**clean).create()
            if volunteer is None:
                return {"message": "Could not save volunteer signup."}, 500
            # Only echo back non-sensitive fields to the public caller
            return {"message": f"Thanks {volunteer.name}! We'll reach out about {volunteer.interest}.",
                    "id": volunteer.id}, 201

        @admin_required
        def get(self):
            volunteers = SrfscVolunteer.query.order_by(SrfscVolunteer.created_at.desc()).all()
            return [volunteer.read() for volunteer in volunteers], 200

    class _Reports(Resource):
        def post(self):
            clean, error = validate_hazard_report(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            report = SrfscHazardReport(**clean).create()
            if report is None:
                return {"message": "Could not save hazard report."}, 500
            return report.read(), 201

        @admin_required
        def get(self):
            reports = SrfscHazardReport.query.order_by(SrfscHazardReport.created_at.desc()).all()
            return [report.read(include_contact=True) for report in reports], 200

    class _Report(Resource):
        @admin_required
        def put(self, report_id):
            report = db.session.get(SrfscHazardReport, report_id)
            if report is None:
                return {"message": f"Report {report_id} not found."}, 404
            clean, error = validate_report_status(request.get_json(silent=True))
            if error:
                return {"message": error}, 400
            return report.update_status(clean["status"]).read(include_contact=True), 200

    class _Stats(Resource):
        def get(self):
            """Live community counts for the dashboard KPI tiles."""
            resolved = SrfscHazardReport.query.filter_by(status='Resolved').count()
            total_reports = SrfscHazardReport.query.count()
            next_event = _upcoming_events_query().order_by(SrfscEvent.event_date.asc()).first()
            return {
                "volunteers": SrfscVolunteer.query.count(),
                "hazard_reports": total_reports,
                "resolved_reports": resolved,
                "open_reports": total_reports - resolved,
                "upcoming_events": _upcoming_events_query().count(),
                "event_rsvps": SrfscRsvp.query.count(),
                "next_event": next_event.read() if next_event else None,
            }, 200

    class _Conditions(Resource):
        def get(self):
            return conditions_cache.get(), 200


api.add_resource(SrfscAPI._Events, '/events')
api.add_resource(SrfscAPI._Event, '/events/<int:event_id>')
api.add_resource(SrfscAPI._EventRsvp, '/events/<int:event_id>/rsvp')
api.add_resource(SrfscAPI._Updates, '/updates')
api.add_resource(SrfscAPI._Update, '/updates/<int:update_id>')
api.add_resource(SrfscAPI._Volunteers, '/volunteers')
api.add_resource(SrfscAPI._Reports, '/reports')
api.add_resource(SrfscAPI._Report, '/reports/<int:report_id>')
api.add_resource(SrfscAPI._Stats, '/stats')
api.add_resource(SrfscAPI._Conditions, '/conditions')
