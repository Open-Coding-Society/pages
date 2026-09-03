#!/usr/bin/env python3
"""Count bare global class selectors across the SCSS, excluding _sass/ocs.

Shipped because the figure "15 unprefixed globals" was quoted in three places
with three different numbers and no reproducible definition behind any of them.
This states its definition and prints the list, so the number can be checked.

DEFINITION: a class selector appearing ALONE at brace-depth 0 -- i.e. `.foo {`,
not `.a .foo {` and not `.a.foo {`. Those are the ones that match any element
anywhere and therefore collide with a CSS framework loaded alongside.

    python3 _sass/ocs/tools/scan-globals.py
    python3 _sass/ocs/tools/scan-globals.py --all   # include multi-word names
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
SASS = ROOT / "_sass"
ALL = "--all" in sys.argv


def bare_globals(path):
    src = path.read_text(encoding="utf-8", errors="ignore")
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"//.*", "", src)
    found, depth, buf = set(), 0, ""
    for ch in src:
        if ch == "{":
            if depth == 0:
                for sel in buf.split(","):
                    m = re.fullmatch(r"\.([A-Za-z][\w-]*)", sel.strip())
                    if m:
                        found.add(m.group(1))
            depth += 1
            buf = ""
        elif ch == "}":
            depth = max(0, depth - 1)
            buf = ""
        else:
            buf += ch
            if len(buf) > 600:
                buf = buf[-600:]
    return found


owners = {}
for f in sorted(SASS.rglob("*.scss")):
    if "/ocs/" in str(f):
        continue
    for name in bare_globals(f):
        owners.setdefault(name, []).append(str(f.relative_to(ROOT)))

single = {k: v for k, v in owners.items() if re.fullmatch(r"[A-Za-z]+", k)}
show = owners if ALL else single

print(f"scanned {len(list(SASS.rglob('*.scss'))) } .scss files (excluding _sass/ocs)")
print(f"bare global class selectors : {len(owners)}")
print(f"  ...of which single-word    : {len(single)}")
print()
for name in sorted(show):
    files = show[name]
    where = files[0] + (f"  (+{len(files)-1} more)" if len(files) > 1 else "")
    print(f"  .{name:<22} {where}")
print()
print("A single-word bare global is what collides with Bootstrap: .row and")
print(".column are grid primitives there, and the Spring app loads Bootstrap 5.0.2.")
