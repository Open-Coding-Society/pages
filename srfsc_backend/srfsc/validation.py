"""
Pure input validation for the SRFSC API.

Kept free of Flask/DB imports so the rules can be unit tested in isolation.
Each validator returns (clean_data, error_message); exactly one of them is None.
"""
import re
from datetime import date

from srfsc.models import EVENT_TYPES, VOLUNTEER_INTERESTS, HAZARD_TYPES, REPORT_STATUSES, UPDATE_CATEGORIES

EMAIL_PATTERN = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
MAX_SHORT_TEXT = 255
MAX_LONG_TEXT = 2000


def _clean_text(data, field, required=True, max_length=MAX_SHORT_TEXT):
    """Strip a string field; return (value, error)."""
    value = data.get(field)
    if value is None or (isinstance(value, str) and not value.strip()):
        return (None, f"'{field}' is required.") if required else (None, None)
    if not isinstance(value, str):
        return None, f"'{field}' must be text."
    value = value.strip()
    if len(value) > max_length:
        return None, f"'{field}' must be at most {max_length} characters."
    return value, None


def _clean_choice(data, field, choices):
    value, error = _clean_text(data, field)
    if error:
        return None, error
    if value not in choices:
        return None, f"'{field}' must be one of: {', '.join(choices)}."
    return value, None


def _clean_email(data, field, required=True):
    value, error = _clean_text(data, field, required=required)
    if error or value is None:
        return value, error
    if not EMAIL_PATTERN.match(value):
        return None, f"'{field}' must be a valid email address."
    return value.lower(), None


def _collect(rules):
    """Run (name, (value, error)) pairs; stop at the first error so the user fixes one thing at a time."""
    clean = {}
    for name, (value, error) in rules:
        if error:
            return None, error
        clean[name] = value
    return clean, None


def validate_volunteer(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    return _collect([
        ("name", _clean_text(data, "name", max_length=128)),
        ("email", _clean_email(data, "email")),
        ("interest", _clean_choice(data, "interest", VOLUNTEER_INTERESTS)),
        ("phone", _clean_text(data, "phone", required=False, max_length=32)),
        ("street", _clean_text(data, "street", required=False)),
        ("message", _clean_text(data, "message", required=False, max_length=MAX_LONG_TEXT)),
    ])


def validate_hazard_report(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    return _collect([
        ("hazard_type", _clean_choice(data, "hazard_type", HAZARD_TYPES)),
        ("location", _clean_text(data, "location")),
        ("description", _clean_text(data, "description", max_length=MAX_LONG_TEXT)),
        ("reporter_email", _clean_email(data, "reporter_email", required=False)),
    ])


def validate_event(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    clean, error = _collect([
        ("title", _clean_text(data, "title")),
        ("event_type", _clean_choice(data, "event_type", EVENT_TYPES)),
        ("event_date", _clean_text(data, "event_date", max_length=10)),
        ("location", _clean_text(data, "location")),
        ("description", _clean_text(data, "description", required=False, max_length=MAX_LONG_TEXT)),
    ])
    if error:
        return None, error
    try:
        clean["event_date"] = date.fromisoformat(clean["event_date"])
    except ValueError:
        return None, "'event_date' must be in YYYY-MM-DD format."
    return clean, None


def validate_report_status(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    return _collect([("status", _clean_choice(data, "status", REPORT_STATUSES))])


def validate_rsvp(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    return _collect([
        ("name", _clean_text(data, "name", max_length=128)),
        ("email", _clean_email(data, "email")),
    ])


def validate_update(data):
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    return _collect([
        ("title", _clean_text(data, "title")),
        ("body", _clean_text(data, "body", max_length=MAX_LONG_TEXT)),
        ("category", _clean_choice(data, "category", UPDATE_CATEGORIES)),
    ])
