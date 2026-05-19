# Docker (isolated Pages stack)

Runs on **ports 8450/8451 only** — does not install packages on the host or bind to 80/443.

| Service | Port (host) | Purpose |
|---------|-------------|---------|
| `static` | 8450 | Serves `./site/` (sync `_site/` from your Mac) |
| `dev` | 8451 | Full `make dev` inside container (optional) |

Project name `opencs-pages` keeps containers/volumes separate from other Docker projects.

## Quick start — static (build on Mac, serve in Docker)

### Mac (branch `test_engine`)

```bash
cd /path/to/pages
git checkout test_engine
# one-time setup if needed: scripts/activate_macos.sh, python3 -m venv venv, bundle install, pip install -r requirements.txt

make build
./docker/sync-from-mac.sh YOUR_USER@YOUR_LINUX_SERVER
```

Re-run `make build` + `sync-from-mac.sh` after changes (or automate with `fswatch`).

### Linux server (nothing installed except Docker)

```bash
mkdir -p ~/opencs-pages-docker && cd ~/opencs-pages-docker
git clone -b test_engine https://github.com/open-coding-society/pages.git pages
cd pages/docker
cp .env.example .env
# optional: echo 'PAGES_BIND=0.0.0.0' >> .env   # allow http://SERVER_IP:8450/

docker compose up -d static
docker compose ps
curl -sI http://127.0.0.1:8450/ | head -5
```

Access without touching host nginx:

```bash
# From your laptop (tunnel — recommended)
ssh -L 8450:127.0.0.1:8450 YOUR_USER@YOUR_LINUX_SERVER
# Browser: http://127.0.0.1:8450/
```

Or if `PAGES_BIND=0.0.0.0`: `http://YOUR_SERVER_IP:8450/`

## Quick start — dev in Docker (auto-update on server)

```bash
cd ~/opencs-pages-docker/pages/docker
cp .env.example .env
docker compose --profile dev up -d --build dev
docker compose logs -f dev
```

Site: `http://127.0.0.1:8451/` (or tunnel `ssh -L 8451:127.0.0.1:8451 ...`).

## Commands reference

```bash
cd ~/opencs-pages-docker/pages/docker

# Static
docker compose up -d static
docker compose restart static
docker compose logs -f static

# Dev (profile)
docker compose --profile dev up -d --build dev
docker compose --profile dev logs -f dev
docker compose --profile dev stop dev

# Stop everything for this project
docker compose --profile dev down

# Update repo + rebuild dev image
cd ~/opencs-pages-docker/pages && git pull && cd docker
docker compose --profile dev up -d --build dev
```

## DNS (optional) — `x.opencodingsociety.com`

Does **not** require changing the host’s main web server if you use a high port:

1. DNS: `x` A record → server public IP  
2. `PAGES_BIND=0.0.0.0` in `docker/.env`  
3. Visit `http://x.opencodingsociety.com:8450/`

For HTTPS on 443 without conflicting with an existing vhost, ask infra for a **separate** reverse-proxy route, or use a second IP. This stack intentionally avoids binding 80/443.

## Troubleshooting

```bash
docker compose ps
docker compose logs static
ls -la site/ | head    # static: should contain index.html
curl -v http://127.0.0.1:8450/
```
