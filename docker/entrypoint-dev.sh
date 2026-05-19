#!/bin/bash
set -euo pipefail

cd /app

if [ ! -x venv/bin/python3 ]; then
  python3 -m venv venv
  venv/bin/pip install --no-cache-dir -r requirements.txt
fi

export PYTHON="${PYTHON:-/app/venv/bin/python3}"

bundle check >/dev/null 2>&1 || bundle install

make stop 2>/dev/null || true

case "${MODE:-dev}" in
  serve) make serve ;;
  make)  make ;;
  dev|*) make dev ;;
esac

echo "Pages dev server started (MODE=${MODE:-dev}). Tailing logs..."
exec tail -f "/tmp/jekyll${PORT:-4500}.log"
