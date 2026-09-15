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
# PAGE STYLESHEETS
#
# `_sass/ocs/pages/_<name>.scss` is a stylesheet for ONE page. Each compiles to
# its own `assets/css/ocs-<name>.css` and the layout links the one it needs.
# They are deliberately outside `@use "ocs"`: putting the submissions table in
# the global bundle would ship it to every lesson on the site.
#
# USAGE
#     bash _sass/ocs/tools/build.sh            # build + verify
#     bash _sass/ocs/tools/build.sh --check    # verify only, non-zero on drift
# =============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
OUT="$REPO_ROOT/assets/css/ocs.css"
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
# build <scss-to-@use> <output-path> <source-label>
#
# Writes the file, or under --check compares and exits non-zero on drift. Both
# paths go through the same compile so --check can never pass on a stale file
# that a different code path happened to produce.
FAILED=0

build() {
  local use="$1" out="$2" source_label="$3"
  local entry tmp header
  entry="$(mktemp -t ocs-entry-XXXX).scss"
  tmp="$(mktemp -t ocs-css-XXXX).css"

  echo "@use \"$use\";" > "$entry"
  $SASS --load-path="$REPO_ROOT/_sass" --no-source-map --style=expanded \
        "$entry" "$tmp"

  # Header so nobody hand-edits the output the way style.css was hand-edited
  # in the spring repo.
  header="/*!
 * OCS Design System -- GENERATED FILE, DO NOT EDIT
 *
 * Source:    $source_label
 * Generator: _sass/ocs/tools/build.sh
 * Rebuild:   bash _sass/ocs/tools/build.sh
 *
 * Hand-edits here are destroyed on the next build. Change the SCSS instead.
 */
"
  mkdir -p "$(dirname "$out")"
  printf '%s' "$header" | cat - "$tmp" > "$tmp.final"

  if [ "$CHECK_ONLY" = "--check" ]; then
    if ! diff -q "$out" "$tmp.final" >/dev/null 2>&1; then
      echo "FAIL: ${out#$REPO_ROOT/} is out of date with $source_label."
      FAILED=1
    else
      echo "==> OK: ${out#$REPO_ROOT/} matches its source."
    fi
  else
    cp "$tmp.final" "$out"
    local bytes lines
    bytes=$(wc -c < "$out" | tr -d ' ')
    lines=$(wc -l < "$out" | tr -d ' ')
    echo "==> Wrote ${out#$REPO_ROOT/}  ($bytes bytes / $lines lines)"
  fi

  rm -f "$entry" "$tmp" "$tmp.final"
}

build "ocs" "$OUT" "_sass/ocs/"

# --- 3. page stylesheets -----------------------------------------------------
# One file per page. The glob is nullglob-guarded so an empty pages/ directory
# does not compile a file literally named "_*.scss".
shopt -s nullglob
for page in "$REPO_ROOT"/_sass/ocs/pages/_*.scss; do
  name="$(basename "$page" .scss)"      # _submissions
  name="${name#_}"                      # submissions
  build "ocs/pages/$name" "$REPO_ROOT/assets/css/ocs-$name.css" \
        "_sass/ocs/pages/_$name.scss"
done
shopt -u nullglob

if [ "$CHECK_ONLY" = "--check" ]; then
  if [ "$FAILED" -ne 0 ]; then
    echo "      Run: bash _sass/ocs/tools/build.sh"
    exit 1
  fi
  exit 0
fi

echo "==> Done."
