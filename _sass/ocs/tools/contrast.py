#!/usr/bin/env python3
"""Verify every OCS colour token against WCAG 2.1.

Parses ../core/_tokens.scss directly, so it can never drift from the values the
stylesheet actually ships. Exits non-zero if any guarantee is violated, which
makes it usable as a pre-commit hook or CI step.

    python3 _sass/ocs/tools/contrast.py
    python3 _sass/ocs/tools/contrast.py --quiet   # only failures
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

TOKENS = pathlib.Path(__file__).resolve().parent.parent / "core" / "_tokens.scss"

# --- WCAG 2.1 relative luminance -------------------------------------------

def _linear(channel: int) -> float:
    c = channel / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_colour: str) -> float:
    h = hex_colour.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def contrast(fg: str, bg: str) -> float:
    a, b = luminance(fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


# --- parse the SCSS ---------------------------------------------------------

def _block(name: str, src: str) -> str:
    m = re.search(rf"\${name}:\s*\((.*?)\n\);", src, re.S)
    if not m:
        sys.exit(f"contrast.py: could not find ${name} in {TOKENS}")
    return m.group(1)


def parse() -> tuple[dict, dict, dict, dict]:
    src = TOKENS.read_text()
    hexes = lambda blk: dict(re.findall(r"([\w-]+):\s*(#[0-9A-Fa-f]{6})", blk))

    surface = hexes(_block("surface", src))
    text = hexes(_block("text", src))
    neutral = hexes(_block("neutral", src))

    semantic: dict[str, dict[str, str]] = {}
    for role, body in re.findall(r"(\w+):\s*\(\s*(fg:.*?)\),", _block("semantic", src), re.S):
        semantic[role] = hexes(body)

    return surface, text, semantic, neutral


# --- checks -----------------------------------------------------------------

AA_TEXT, AA_UI = 4.5, 3.0
TINT_MIN = 1.18


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--quiet", action="store_true", help="print failures only")
    args = ap.parse_args()

    surface, text, semantic, _neutral = parse()
    dark = [(k, surface[k]) for k in ("base", "raised", "elevated") if k in surface]
    hardest = surface["elevated"]
    failures: list[str] = []

    def check(label: str, ratio: float, threshold: float) -> None:
        ok = ratio >= threshold
        if not ok:
            failures.append(f"{label}: {ratio:.2f}:1 (needs {threshold}:1)")
        if not args.quiet:
            print(f"  {'PASS' if ok else 'FAIL'}  {label:<44} {ratio:>6.2f}:1")

    if not args.quiet:
        print("\nTEXT TOKENS on every dark surface")
    for tname, tval in text.items():
        if tname == "inverse":
            continue
        for sname, sval in dark:
            check(f"text.{tname} on surface.{sname}", contrast(tval, sval), AA_TEXT)

    if not args.quiet:
        print("\nSEMANTIC FOREGROUNDS on every dark surface")
    for role, parts in semantic.items():
        for sname, sval in dark:
            check(f"{role}.fg on surface.{sname}", contrast(parts["fg"], sval), AA_TEXT)

    if not args.quiet:
        print("\nSEMANTIC BORDERS on the raised surface (UI component threshold)")
    for role, parts in semantic.items():
        check(f"{role}.border on surface.raised",
              contrast(parts["border"], surface["raised"]), AA_UI)

    if not args.quiet:
        print("\nSEMANTIC FOREGROUND on its own tint")
    for role, parts in semantic.items():
        check(f"{role}.fg on {role}.bg", contrast(parts["fg"], parts["bg"]), AA_TEXT)

    if not args.quiet:
        print("\nTINT VISIBILITY against the raised surface")
    for role, parts in semantic.items():
        check(f"{role}.bg vs surface.raised",
              contrast(parts["bg"], surface["raised"]), TINT_MIN)

    if not args.quiet:
        print(f"\nHardest surface used for the AA solve: {hardest}")

    print()
    if failures:
        print(f"FAILED — {len(failures)} contrast guarantee(s) violated:")
        for f in failures:
            print(f"  - {f}")
        return 1

    print("All contrast guarantees hold.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
