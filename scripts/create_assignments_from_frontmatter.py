#!/usr/bin/env python3
"""
Scan the repo for Markdown/HTML pages with YAML frontmatter containing
assignment: true and POST to the Spring `auto-create` API for each page.

Usage (CI / local):
  export BASE_URL=https://spring.opencodingsociety.com
  export PAGES_BOT_UID=pages-bot
  export PAGES_BOT_PASSWORD=...
  python3 scripts/create_assignments_from_frontmatter.py --root .

The script is idempotent: the server will return 200 for existing contentUrl.
"""
import argparse
import os
import re
import sys
from pathlib import Path

import requests
import yaml

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)

DEFAULT_BASE_URL = os.getenv("BASE_URL", "https://spring.opencodingsociety.com")
DEFAULT_UID = os.getenv("PAGES_BOT_UID", "pages-bot")
DEFAULT_PASSWORD = os.getenv("PAGES_BOT_PASSWORD", "")


def find_files(root: Path):
    exts = {".md", ".markdown", ".html", ".htm"}
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() in exts:
            yield p


def read_frontmatter(path: Path):
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        data = yaml.safe_load(m.group(1))
        return data or {}
    except Exception:
        return None


def determine_content_url(root: Path, path: Path, fm: dict):
    # Prefer explicit permalink if present
    if fm is not None and isinstance(fm.get("permalink"), str) and fm.get("permalink").strip():
        perm = fm.get("permalink").strip()
        return perm.lstrip("/")
    # Otherwise compute a path relative to root
    rel = path.relative_to(root).as_posix()
    # Remove leading index filenames and extensions
    rel = re.sub(r"(^|/)index\.(md|markdown|html)$", r"\1", rel, flags=re.I)
    rel = re.sub(r"\.(md|markdown|html)$", "", rel, flags=re.I)
    # Prefix with pages/ if the file is under pages/ or _posts
    if rel.startswith("pages/"):
        return rel
    if rel.startswith("_posts/"):
        # Map _posts/YYYY-MM-DD-title.md -> posts/title
        parts = Path(rel).name
        name = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", parts)
        return "posts/" + name
    return rel


def authenticate(session: requests.Session, base_url: str, uid: str, password: str):
    resp = session.post(f"{base_url}/authenticate", json={"uid": uid, "password": password}, timeout=20)
    if resp.status_code != 200:
        raise RuntimeError(f"Authentication failed: {resp.status_code} {resp.text}")
    if "jwt_java_spring" not in session.cookies:
        # try to extract from header
        if "Set-Cookie" in resp.headers and "jwt_java_spring=" in resp.headers.get("Set-Cookie", ""):
            return
        raise RuntimeError("Authentication succeeded but jwt cookie not present")


def create_assignment(session: requests.Session, base_url: str, name: str, content_url: str, description: str = "auto-created on deploy"):
    payload = {"name": name, "contentUrl": content_url, "description": description}
    # Use form-encoded to match frontend
    resp = session.post(f"{base_url}/api/assignments/auto-create", data=payload, timeout=30)
    return resp


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--uid", default=DEFAULT_UID)
    parser.add_argument("--password", default=DEFAULT_PASSWORD)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print("Root not found", file=sys.stderr)
        return 2

    session = requests.Session()
    if not args.dry_run:
        if not args.password:
            print("PAGES_BOT_PASSWORD is required (pass --password or set env PAGES_BOT_PASSWORD)", file=sys.stderr)
            return 2
        authenticate(session, args.base_url, args.uid, args.password)
        print("Authenticated OK")

    candidates = []
    for f in find_files(root):
        fm = read_frontmatter(f)
        if not fm:
            continue
        if fm.get("assignment") is True:
            content_url = determine_content_url(root, f, fm)
            name = fm.get("title") or fm.get("name") or f.stem
            description = fm.get("description") or "auto-created from frontmatter"
            candidates.append((f, content_url, name, description))

    if not candidates:
        print("No pages with assignment: true found.")
        return 0

    print(f"Found {len(candidates)} pages with assignment: true")
    for path, content_url, name, description in candidates:
        print(f"-> {path} -> contentUrl={content_url} name={name}")
        if args.dry_run:
            continue
        try:
            resp = create_assignment(session, args.base_url, name, content_url, description)
            print(f"  {resp.status_code} {resp.text[:200]}")
        except Exception as e:
            print(f"  ERROR: {e}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
