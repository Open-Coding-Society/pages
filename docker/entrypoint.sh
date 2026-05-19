#!/bin/bash
set -euo pipefail

cd /app

if [ ! -x venv/bin/python3 ]; then
  python3 -m venv venv
  venv/bin/pip install --no-cache-dir -r requirements.txt
fi

export PYTHON="${PYTHON:-/app/venv/bin/python3}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-4500}"
LOG_FILE="/tmp/jekyll${PORT}.log"

bundle check >/dev/null 2>&1 || bundle install

make stop 2>/dev/null || true
touch "$LOG_FILE"

case "${MODE:-make}" in
  serve) make serve ;;
  dev)   make dev ;;
  make|*) make ;;
esac

echo "Pages server running on ${HOST}:${PORT} (MODE=${MODE:-make}). Tailing ${LOG_FILE}..."
for i in $(seq 1 120); do
  if grep -q "Server address:" "$LOG_FILE" 2>/dev/null; then
    grep "Server address:" "$LOG_FILE" | tail -1
    break
  fi
  sleep 2
done
exec tail -f "$LOG_FILE"
