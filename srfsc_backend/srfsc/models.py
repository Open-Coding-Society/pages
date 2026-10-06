"""
Scripps Ranch Fire Safe Council (SRFSC) models.

Backs the SRFSC site (pages: /capstone/srfsc/app/):
  - SrfscEvent:        clearing days, block meetings, expos shown to the public
  - SrfscVolunteer:    neighbors who sign up to help
  - SrfscHazardReport: resident reports of dead vegetation / hazard trees / blocked firebreaks
  - SrfscRsvp:         a neighbor joining a specific event (one RSVP per email per event)
  - SrfscUpdate:       community news, impact stories, and partner notes (the "trust" feed)
"""
from datetime import datetime, date
from sqlalchemy.exc import IntegrityError

from srfsc.extensions import db


# Allowed values are shared with api/srfsc_api.py validation so the two cannot drift.
EVENT_TYPES = ['Clearing Day', 'Block Meeting', 'Fire Safety Expo', 'Board Meeting']
VOLUNTEER_INTERESTS = ['Clearing Day', 'Block Meeting Host', 'Board Leadership', 'Events & Outreach']
HAZARD_TYPES = ['Dead Vegetation', 'Hazard Tree', 'Blocked Firebreak', 'Other']
REPORT_STATUSES = ['New', 'Reviewed', 'Scheduled', 'Resolved']
UPDATE_CATEGORIES = ['News', 'Impact Story', 'Partner']


class SrfscModelMixin:
    """Shared create/delete helpers that roll back on failure instead of leaving a dirty session."""

    def create(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError:
            db.session.rollback()
            return None

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class SrfscEvent(SrfscModelMixin, db.Model):
    __tablename__ = 'srfsc_events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    event_type = db.Column(db.String(64), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, title, event_type, event_date, location, description=None):
        self.title = title
        self.event_type = event_type
        self.event_date = event_date
        self.location = location
        self.description = description

    rsvps = db.relationship('SrfscRsvp', backref='event', cascade='all, delete-orphan', lazy='dynamic')

    def read(self):
        return {
            "id": self.id,
            "title": self.title,
            "event_type": self.event_type,
            "rsvp_count": self.rsvps.count(),
            "event_date": self.event_date.isoformat(),
            "location": self.location,
            "description": self.description,
        }


class SrfscVolunteer(SrfscModelMixin, db.Model):
    __tablename__ = 'srfsc_volunteers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(32), nullable=True)
    interest = db.Column(db.String(64), nullable=False)
    street = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, email, interest, phone=None, street=None, message=None):
        self.name = name
        self.email = email
        self.interest = interest
        self.phone = phone
        self.street = street
        self.message = message

    def read(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "interest": self.interest,
            "street": self.street,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class SrfscHazardReport(SrfscModelMixin, db.Model):
    __tablename__ = 'srfsc_hazard_reports'

    id = db.Column(db.Integer, primary_key=True)
    hazard_type = db.Column(db.String(64), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    reporter_email = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(32), nullable=False, default='New')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, hazard_type, location, description, reporter_email=None):
        self.hazard_type = hazard_type
        self.location = location
        self.description = description
        self.reporter_email = reporter_email
        self.status = 'New'

    def update_status(self, status):
        self.status = status
        db.session.commit()
        return self

    def read(self, include_contact=False):
        data = {
            "id": self.id,
            "hazard_type": self.hazard_type,
            "location": self.location,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        # Reporter email is only exposed to admins
        if include_contact:
            data["reporter_email"] = self.reporter_email
        return data


class SrfscRsvp(SrfscModelMixin, db.Model):
    __tablename__ = 'srfsc_rsvps'
    # Same email cannot RSVP twice for one event; create() returns None on that violation
    __table_args__ = (db.UniqueConstraint('event_id', 'email', name='uq_srfsc_rsvp_event_email'),)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('srfsc_events.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, event_id, name, email):
        self.event_id = event_id
        self.name = name
        self.email = email


class SrfscUpdate(SrfscModelMixin, db.Model):
    __tablename__ = 'srfsc_updates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, title, body, category):
        self.title = title
        self.body = body
        self.category = category

    def read(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


def init_srfsc():
    """Create SRFSC tables and seed starter content so the dashboard is not empty on a fresh database."""
    db.create_all()
    _seed_events()
    _seed_updates()


def _seed_events():
    with db.session.no_autoflush:
        if SrfscEvent.query.first():
            return
        seed_events = [
            SrfscEvent("Monthly Clearing Day", "Clearing Day", date(2026, 10, 17),
                       "Canyon edge behind Ellingham Elementary",
                       "Help clear dead brush and maintain firebreaks. Gloves and tools provided."),
            SrfscEvent("Block Meeting: Defensible Space 101", "Block Meeting", date(2026, 10, 24),
                       "Scripps Ranch Library Community Room",
                       "Learn the 0-5 ft, 5-30 ft, and 30-100 ft defensible space zones."),
            SrfscEvent("Fire Safety Expo", "Fire Safety Expo", date(2026, 11, 7),
                       "Scripps Ranch Community Park",
                       "Meet San Diego Fire-Rescue and CAL FIRE, see home hardening demos."),
            SrfscEvent("November Clearing Day", "Clearing Day", date(2026, 11, 21),
                       "Lake Miramar trailhead firebreak",
                       "Hazard tree follow-up and firebreak maintenance."),
        ]
        for event in seed_events:
            event.create()


def _seed_updates():
    with db.session.no_autoflush:
        if SrfscUpdate.query.first():
            return
        # Facts below come from srfiresafe.org; they seed the trust feed until admins post real news.
        seed_updates = [
            SrfscUpdate("Why we exist",
                        "The 2003 Cedar Fire destroyed 312 homes in Scripps Ranch. Neighbors founded the council "
                        "in 2004 so the next fire meets cleared canyons and prepared households.",
                        "Impact Story"),
            SrfscUpdate("650+ residential firebreaks",
                        "Volunteers and contractors have established more than 650 residential firebreaks and "
                        "removed 340 dangerous trees along canyon edges.",
                        "Impact Story"),
            SrfscUpdate("Working with the agencies",
                        "SRFSC coordinates with CAL FIRE, San Diego Fire-Rescue, and the California Conservation "
                        "Corps on fuel reduction and community education.",
                        "Partner"),
        ]
        for update in seed_updates:
            update.create()
