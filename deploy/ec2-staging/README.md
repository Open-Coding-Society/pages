# EC2 Pages staging (isolated)

Staging copy of [Open-Coding-Society/pages](https://github.com/Open-Coding-Society/pages) for fast iteration and A/B testing. **Does not modify** existing nginx sites (spring, flask, etc.) or Docker backends on the host.

## How it is exposed (no new domain)

| Layer | Address |
|-------|---------|
| Public | `http://<EC2_PUBLIC_IP>:8450/` |
| Host nginx | Listens **only** on port **8450** → `127.0.0.1:4500` |
| Jekyll (Docker) | `127.0.0.1:4500` (not exposed publicly) |

Open **TCP 8450** in the AWS security group if the URL does not load from your browser.

Production remains GitHub Pages. A/B engine stays on Vercel (`sdk.js` in `head-custom.html`).

## Safety guarantees

- New directory only: `/home/ubuntu/pages-staging`
- New Docker Compose project: `pages-staging` (container `pages-staging-jekyll`)
- New nginx file: `/etc/nginx/sites-available/pages-staging` (port 8450)
- **Does not** edit `default`, `spring`, `flask`, Apache, or restart unrelated containers
- Aborts if ports **4500** or **8450** are already in use

## Install on EC2

After branch `deploy/ec2-staging` is on GitHub:

```bash
cd /home/ubuntu/pages-staging   # or let the script clone
bash deploy/ec2-staging/scripts/install-on-ec2.sh
```

Or sync from your laptop (before branch is pushed):

```bash
rsync -az --delete --exclude .git --exclude _site --exclude vendor/bundle \
  ./ ubuntu@3.233.212.71:/home/ubuntu/pages-staging/
ssh ubuntu@3.233.212.71 'SKIP_GIT_CLONE=1 bash /home/ubuntu/pages-staging/deploy/ec2-staging/scripts/install-on-ec2.sh'
```

## Operations

```bash
# Logs
docker logs -f pages-staging-jekyll

# Stop staging only
cd /home/ubuntu/pages-staging
docker compose -f deploy/ec2-staging/docker-compose.yml down

# Rebuild container after git pull
docker compose -f deploy/ec2-staging/docker-compose.yml up -d --build

# Remove nginx staging site
sudo rm -f /etc/nginx/sites-enabled/pages-staging
sudo systemctl reload nginx
```

## Full notebook pipeline (heavy)

Default `STAGING_SKIP_NOTEBOOK_CONVERT=1` skips mass notebook conversion to save RAM (~1 GB free on `ncs-com`). To enable:

```bash
STAGING_SKIP_NOTEBOOK_CONVERT=0 docker compose -f deploy/ec2-staging/docker-compose.yml up -d --build
```

## A/B testing

Use staging URL with `?ab_admin=true`. SDK loads from Vercel; `data-site-baseurl` is empty for this host (root on :8450).
