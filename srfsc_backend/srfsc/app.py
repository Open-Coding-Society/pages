"""
App factory for the standalone SRFSC backend.

Configuration comes from environment variables so the same code runs locally, in Docker, and in tests:
  SRFSC_DATABASE_URI  SQLAlchemy URI (default: sqlite file in ./instance)
  SRFSC_ADMIN_KEY     shared council admin key; admin endpoints refuse all requests when unset
  SRFSC_ALLOWED_ORIGINS  extra comma-separated origins allowed to call the API with credentials
"""
import os

from flask import Flask
from flask_cors import CORS

from srfsc.extensions import db
from srfsc.models import init_srfsc
from srfsc.routes import srfsc_api

# Sites that serve the SRFSC pages: local Jekyll, the team's GitHub Pages, and the OCS deployment.
DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:4500',
    'http://127.0.0.1:4500',
    'https://jas-bop2.github.io',
    'https://pages.opencodingsociety.com',
    r'https://.*\.opencodingsociety\.com',
]


def _allowed_origins():
    extra = [origin.strip() for origin in os.environ.get('SRFSC_ALLOWED_ORIGINS', '').split(',') if origin.strip()]
    return DEFAULT_ALLOWED_ORIGINS + extra


def create_app(config=None):
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)
    app.config.update(
        SQLALCHEMY_DATABASE_URI=os.environ.get(
            'SRFSC_DATABASE_URI', 'sqlite:///' + os.path.join(app.instance_path, 'srfsc.db')),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SRFSC_ADMIN_KEY=os.environ.get('SRFSC_ADMIN_KEY', ''),
    )
    if config:
        app.config.update(config)

    db.init_app(app)
    # Credentialed CORS so pages on the allowed sites can call the API (see AGENTS.md cross-origin rule).
    CORS(app, supports_credentials=True, origins=_allowed_origins(),
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'X-Origin'])
    app.register_blueprint(srfsc_api)

    @app.get('/health')
    def health():
        return {"status": "ok"}

    with app.app_context():
        init_srfsc()
    if not app.config['SRFSC_ADMIN_KEY']:
        app.logger.warning('SRFSC_ADMIN_KEY is not set; admin endpoints will refuse every request.')
    return app
