#!/usr/bin/env bash
set -euo pipefail

cd /site

echo "[pages-staging] bundle install..."
bundle config set --local path vendor/bundle
bundle install --jobs 4

echo "[pages-staging] python venv..."
python3 -m venv venv
./venv/bin/pip install -q -r requirements.txt

echo "[pages-staging] distribute registered projects (no notebook mass-convert)..."
make build-registered-projects
make build-registered-docs

if [[ "${STAGING_SKIP_NOTEBOOK_CONVERT:-1}" != "1" ]]; then
  echo "[pages-staging] converting notebooks (heavy)..."
  ./venv/bin/python scripts/convert_notebooks.py
  ./venv/bin/python scripts/split_multi_course_files.py
else
  echo "[pages-staging] skipping notebook convert (set STAGING_SKIP_NOTEBOOK_CONVERT=0 to enable)"
fi

CONFIG="_config.yml,deploy/ec2-staging/_config.staging.yml"
echo "[pages-staging] starting Jekyll on 0.0.0.0:${PORT} ..."
exec bundle exec jekyll serve \
  --config "${CONFIG}" \
  -H 0.0.0.0 \
  -P "${PORT}" \
  --livereload false \
  --watch
