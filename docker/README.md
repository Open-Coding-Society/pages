# Docker — server-side build only

Everything runs on your **Linux server** in Docker. Build, convert, serve, and auto-update all happen inside the container — not on a developer laptop.

- **Port 8450** only — does not bind host 80/443 or install Ruby/Python on the host
- **Project name `opencs-pages`** — isolated from other Docker stacks
- **`make` inside the container** — converts notebooks, builds projects, serves Jekyll, auto-updates on file changes

## One-time server setup

```bash
# Docker only (if not installed)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
newgrp docker

mkdir -p ~/opencs-pages-docker && cd ~/opencs-pages-docker
git clone -b test_engine https://github.com/Open-Coding-Society/pages.git pages
cd pages/docker
cp .env.example .env
```

## Start (build + serve + auto-update on the server)

```bash
cd ~/opencs-pages-docker/pages/docker
docker compose up -d --build
docker compose logs -f pages
```

First start can take several minutes (bundle install, conversions, Jekyll). Watch logs until you see `Server address:`.

```bash
curl -sI http://127.0.0.1:8450/ | head -5
```

## View from your browser

**SSH tunnel** (recommended — no changes to host nginx):

```bash
ssh -L 8450:127.0.0.1:8450 YOUR_USER@YOUR_LINUX_SERVER
```

Then open **http://127.0.0.1:8450/**

**Or** expose on the server IP (edit `docker/.env`):

```bash
echo 'PAGES_BIND=0.0.0.0' >> .env
docker compose up -d
```

Visit **http://YOUR_SERVER_IP:8450/**

## Edit content on the server

Repo is bind-mounted into the container. After you change files on the server (git pull, vim, etc.), the container’s `make` watchers rebuild automatically. Refresh the browser after logs show a rebuild.

```bash
cd ~/opencs-pages-docker/pages
git pull
# watchers pick up changes; or restart:
cd docker && docker compose restart pages
```

## Useful commands

```bash
cd ~/opencs-pages-docker/pages/docker

docker compose ps
docker compose logs -f pages
docker compose restart pages
docker compose down

# Faster dev mode (only :dev projects)
echo 'MODE=dev' >> .env && docker compose up -d

# Full reset rebuild
docker compose down
docker compose up -d --build
```

## DNS (optional)

`x.opencodingsociety.com` → A record to server IP, `PAGES_BIND=0.0.0.0` → **http://x.opencodingsociety.com:8450/**

No host Apache/nginx changes required.

## Troubleshooting

```bash
docker compose logs --tail=100 pages
docker exec -it opencs-pages bash -c 'tail -50 /tmp/jekyll4500.log'
curl -v http://127.0.0.1:8450/
```
