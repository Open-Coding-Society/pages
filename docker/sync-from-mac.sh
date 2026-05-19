#!/usr/bin/env bash
# Sync locally built _site/ to the server's Docker static volume directory.
# Usage (on your Mac, from repo root):
#   ./docker/sync-from-mac.sh user@your-linux-server
#
# Prerequisite on Mac: make build  (or make && wait for _site to exist)

set -euo pipefail

REMOTE="${1:?Usage: $0 user@host}"
REMOTE_DIR="${2:-~/opencs-pages-docker/pages/docker/site}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${ROOT}/_site"

if [ ! -d "$SITE" ]; then
  echo "Missing _site/. Run: cd $ROOT && make build"
  exit 1
fi

echo "Syncing $SITE -> ${REMOTE}:${REMOTE_DIR}/"
rsync -avz --delete "${SITE}/" "${REMOTE}:${REMOTE_DIR}/"
echo "Done. On the server: cd ~/opencs-pages-docker/pages/docker && docker compose up -d static"
