#!/usr/bin/env bash
# Idempotent EC2 install — ONLY adds pages-staging stack.
# Does NOT stop/restart existing Docker containers or edit other nginx sites.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/Open-Coding-Society/pages.git}"
BRANCH="${BRANCH:-deploy/ec2-staging}"
INSTALL_DIR="${INSTALL_DIR:-/home/ubuntu/pages-staging}"
NGINX_SITE="pages-staging"
NGINX_CONF_SRC="${INSTALL_DIR}/deploy/ec2-staging/nginx/pages-staging.conf"
NGINX_CONF_DST="/etc/nginx/sites-available/${NGINX_SITE}"

echo "=== pages-staging install (safe mode) ==="
echo "Install dir: ${INSTALL_DIR}"
echo "Branch: ${BRANCH}"

# --- Preflight: do not clobber occupied ports ---
for port in 4500 8450; do
  if ss -tlnp | grep -q ":${port} "; then
    echo "ERROR: port ${port} already in use. Aborting to avoid breaking existing services."
    ss -tlnp | grep ":${port} " || true
    exit 1
  fi
done

# --- Clone or update (isolated directory) ---
if [[ "${SKIP_GIT_CLONE:-0}" == "1" ]]; then
  echo "SKIP_GIT_CLONE=1 — using existing tree at ${INSTALL_DIR}"
  if [[ ! -f "${INSTALL_DIR}/deploy/ec2-staging/scripts/install-on-ec2.sh" ]]; then
    echo "ERROR: ${INSTALL_DIR} does not look like a pages repo checkout."
    exit 1
  fi
elif [[ -d "${INSTALL_DIR}/.git" ]]; then
  echo "Updating existing clone..."
  git -C "${INSTALL_DIR}" fetch origin
  git -C "${INSTALL_DIR}" checkout "${BRANCH}"
  git -C "${INSTALL_DIR}" pull --ff-only origin "${BRANCH}" || git -C "${INSTALL_DIR}" pull origin "${BRANCH}"
else
  echo "Cloning repository..."
  git clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${INSTALL_DIR}"
fi

# --- nginx: new site file only ---
if [[ ! -f "${NGINX_CONF_SRC}" ]]; then
  echo "ERROR: missing ${NGINX_CONF_SRC}"
  exit 1
fi

echo "Installing nginx site ${NGINX_SITE} (port 8450 only)..."
sudo cp "${NGINX_CONF_SRC}" "${NGINX_CONF_DST}"
sudo ln -sf "${NGINX_CONF_DST}" "/etc/nginx/sites-enabled/${NGINX_SITE}"

echo "Testing nginx configuration..."
sudo nginx -t

echo "Reloading nginx (not restarting other services)..."
sudo systemctl reload nginx

# --- Docker: isolated compose project ---
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found. Install docker before continuing."
  exit 1
fi

cd "${INSTALL_DIR}"
echo "Building and starting pages-staging container (project name: pages-staging)..."
docker compose -f deploy/ec2-staging/docker-compose.yml up -d --build

PUBLIC_IP="$(curl -s --max-time 3 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || hostname -I | awk '{print $1}')"

echo ""
echo "=== Install complete ==="
echo "Staging URL (after Jekyll finishes booting, 5–15+ min first time):"
echo "  http://${PUBLIC_IP}:8450/"
echo ""
echo "If the URL does not load externally, open TCP port 8450 in the EC2 security group."
echo "Logs: docker logs -f pages-staging-jekyll"
echo "Stop staging only: cd ${INSTALL_DIR} && docker compose -f deploy/ec2-staging/docker-compose.yml down"
echo "Remove nginx site: sudo rm -f /etc/nginx/sites-enabled/${NGINX_SITE} && sudo systemctl reload nginx"
