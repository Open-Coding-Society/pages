#!/usr/bin/env python3

from pathlib import Path

from create_assignments_from_frontmatter import (
    find_files,
    read_frontmatter,
    read_creator_uids,
    read_course_codes,
    AssignmentFrontmatterError,
)


root = Path(".").resolve()

checked = 0
errors = []

for path in find_files(root):
    fm = read_frontmatter(path)

    if not fm or fm.get("assignment") is not True:
        continue

    checked += 1

    try:
        read_creator_uids(fm, path)
        read_course_codes(fm, path)

    except AssignmentFrontmatterError as e:
        print(f"ERROR: {e}")
        errors.append(path)


print(f"\nChecked {checked} assignment files")
print(f"Errors: {len(errors)}")

raise SystemExit(2 if errors else 0)