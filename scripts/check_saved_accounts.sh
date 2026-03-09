#!/usr/bin/env bash
set -euo pipefail

DB_PATH="${1:-/home/whitelunarium/opencs/BB_flask2/instance/volumes/user_management.db}"

if [[ ! -f "$DB_PATH" ]]; then
  echo "DB not found: $DB_PATH"
  exit 1
fi

echo "DB: $DB_PATH"
echo "Tables:"
sqlite3 "$DB_PATH" ".tables"
echo

echo "User count:"
sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users;"
echo

echo "Latest 20 users (id | uid | name | email):"
sqlite3 "$DB_PATH" "SELECT id, _uid, _name, _email FROM users ORDER BY id DESC LIMIT 20;"
