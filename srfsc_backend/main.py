"""Run the SRFSC backend: `python main.py` (dev) or `gunicorn -b 0.0.0.0:8599 main:app` (Docker)."""
import os

from srfsc.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('SRFSC_PORT', 8599)), debug=os.environ.get('FLASK_DEBUG') == '1')
