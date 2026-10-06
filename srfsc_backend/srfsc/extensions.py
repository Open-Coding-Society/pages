"""Flask extensions, created unbound so the app factory (and tests) can attach them to any app."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
