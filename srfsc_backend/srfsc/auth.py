"""
Council admin authentication.

The standalone backend has no user database, so admins present a shared council key:
    Authorization: Bearer <SRFSC_ADMIN_KEY>
If SRFSC_ADMIN_KEY is not configured, every admin request is refused (fail closed).
"""
import hmac
from functools import wraps

from flask import current_app, request


def _presented_key():
    header = request.headers.get('Authorization', '')
    return header[len('Bearer '):].strip() if header.startswith('Bearer ') else ''


def admin_required(handler):
    @wraps(handler)
    def guarded(*args, **kwargs):
        expected = current_app.config.get('SRFSC_ADMIN_KEY') or ''
        if not expected:
            return {"message": "Admin access is not configured on this server."}, 401
        # Constant-time compare so response timing does not leak how much of the key matched
        if not hmac.compare_digest(_presented_key().encode(), expected.encode()):
            return {"message": "Admin key missing or incorrect."}, 401
        return handler(*args, **kwargs)
    return guarded
