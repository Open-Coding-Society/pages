# SRFSC backend

The `/api/srfsc` service behind the Scripps Ranch Fire Safe Council site (`/capstone/srfsc/app/`).
It is separate from the Jekyll build (excluded in `_config.yml`), like `node_backend/`.

## Run locally

```bash
cd srfsc_backend
SRFSC_ADMIN_KEY=pick-a-long-secret make run   # http://localhost:8599
make test
```

With `make serve-current` running the site on `localhost:4500`, the SRFSC pages call `http://localhost:8599` automatically.
The SQLite database lives in `srfsc_backend/instance/` and is seeded with starter events and updates on first run.

## Configuration

| Variable | Purpose |
| --- | --- |
| `SRFSC_ADMIN_KEY` | Council admin key for the Admin page. Admin endpoints refuse every request when unset. |
| `SRFSC_DATABASE_URI` | SQLAlchemy URI. Default: `sqlite:///instance/srfsc.db`. |
| `SRFSC_ALLOWED_ORIGINS` | Extra comma-separated origins allowed to call the API with credentials. |
| `SRFSC_PORT` | Dev server port (default `8599`). |

## Deploy

```bash
echo "SRFSC_ADMIN_KEY=pick-a-long-secret" > .env   # .env is git-ignored
docker compose up --build -d
```

Put it behind HTTPS (for example an nginx `proxy_pass http://localhost:8599;` server block), then set
`SRFSC_PRODUCTION_API` in `_projects/systems/srfsc/js/srfscConfig.js` to that URL and rebuild the site.
Until that is set, the deployed pages run in offline mode: live fire weather comes straight from the
National Weather Service and the rest of the site shows contact info instead of live data.

## API

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/srfsc/events` (`?all=true` for past) | public |
| POST | `/api/srfsc/events/<id>/rsvp` | public |
| GET | `/api/srfsc/updates` (`?limit=N`) | public |
| GET | `/api/srfsc/stats`, `/api/srfsc/conditions` | public |
| POST | `/api/srfsc/volunteers`, `/api/srfsc/reports` | public |
| GET | `/api/srfsc/volunteers`, `/api/srfsc/reports` | admin |
| PUT | `/api/srfsc/reports/<id>` | admin |
| POST/DELETE | `/api/srfsc/events`, `/api/srfsc/updates` | admin |

Admin requests send `Authorization: Bearer <SRFSC_ADMIN_KEY>`.
