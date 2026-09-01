#!/usr/bin/env bash
# =============================================================================
# Build the OCS Design System stylesheet.
# =============================================================================
# WHY THIS EXISTS
#
# This repo pins `gem "jekyll", "~> 3.9.0"`, which resolves to
# `jekyll-sass-converter (~> 1.0)` -- Ruby Sass / LibSass. Ruby Sass was EOL in
# March 2019 and LibSass was deprecated in October 2020, and NEITHER ever
# implemented `@use` / `@forward`.
#
# The design system is written entirely in the module system, so Jekyll cannot
# compile it. Until the Sass toolchain is upgraded, the stylesheet is built
# ahead of time with Dart Sass and the output is committed.
#
# Verify the claim yourself:
#     gem dependency jekyll --version 3.9.5 --remote | grep sass
#
# REPRODUCIBILITY
#
# The generated CSS carries a header naming this script.
#
# Contrast this with `_sass/root-color-map.scss`, which says "run
# scripts/update_color_map.py". In THIS repo and in Open-Coding-Society/pages
# that script is absent -- the generator was renamed to
# scripts/create_local_color_map.py and the comment was never updated. (In
# Open-Coding-Society/portfolio the old name IS still present, so the claim is
# repo-specific; check before repeating it.)
#
# Either way the point stands: a generated artifact must ship with a generator
# you can actually run. This one does, and --check fails the build when the two
# drift apart.
#
# USAGE
#     bash _sass/ocs/tools/build.sh            # build + verify
#     bash _sass/ocs/tools/build.sh --check    # verify only, non-zero on drift
# =============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OUT="$REPO_ROOT/assets/css/ocs.css"
ENTRY="$(mktemp -t ocs-entry-XXXX).scss"
CHECK_ONLY="${1:-}"

# --- locate a Dart Sass ------------------------------------------------------
if command -v sass >/dev/null 2>&1 && sass --version 2>/dev/null | grep -qv "Ruby Sass"; then
  SASS="sass"
elif [ -x "$HOME/ocs-design-system/dart-sass/sass" ]; then
  SASS="$HOME/ocs-design-system/dart-sass/sass"
elif command -v npx >/dev/null 2>&1; then
  SASS="npx --yes sass"
else
  echo "ERROR: Dart Sass not found."
  echo "  Install one of:"
  echo "    npm install -g sass"
  echo "    brew install sass/sass/sass"
  echo "  Or download a release: https://github.com/sass/dart-sass/releases"
  exit 1
fi

echo "==> Dart Sass: $($SASS --version 2>/dev/null | head -1)"

# --- 1. contrast gate --------------------------------------------------------
# Runs FIRST so a bad colour never reaches a build artifact.
echo "==> Verifying contrast guarantees"
python3 "$REPO_ROOT/_sass/ocs/tools/contrast.py" --quiet

# --- 2. compile --------------------------------------------------------------
echo '@use "ocs";' > "$ENTRY"
TMP_OUT="$(mktemp -t ocs-css-XXXX).css"

$SASS --load-path="$REPO_ROOT/_sass" --no-source-map --style=expanded \
      "$ENTRY" "$TMP_OUT"

# Header so nobody hand-edits the output the way style.css was hand-edited
# in the spring repo.
HEADER="/*!
 * OCS Design System -- GENERATED FILE, DO NOT EDIT
 *
 * Source:    _sass/ocs/
 * Generator: _sass/ocs/tools/build.sh
 * Rebuild:   bash _sass/ocs/tools/build.sh
 *
 * Hand-edits here are destroyed on the next build. Change the SCSS instead.
 */
"
mkdir -p "$(dirname "$OUT")"

if [ "$CHECK_ONLY" = "--check" ]; then
  printf '%s' "$HEADER" | cat - "$TMP_OUT" > "$TMP_OUT.final"
  if ! diff -q "$OUT" "$TMP_OUT.final" >/dev/null 2>&1; then
    echo "FAIL: assets/css/ocs.css is out of date with _sass/ocs/."
    echo "      Run: bash _sass/ocs/tools/build.sh"
    exit 1
  fi
  echo "==> OK: committed CSS matches the source."
  exit 0
fi

printf '%s' "$HEADER" | cat - "$TMP_OUT" > "$OUT"
rm -f "$ENTRY" "$TMP_OUT"

# --- 3. report ---------------------------------------------------------------
BYTES=$(wc -c < "$OUT" | tr -d ' ')
LINES=$(wc -l < "$OUT" | tr -d ' ')
IMPORTS=$(grep -c "@import" "$OUT" || true)

echo "==> Wrote assets/css/ocs.css"
echo "      $BYTES bytes / $LINES lines"
echo "      @import in output: $IMPORTS"
echo "==> Done."
