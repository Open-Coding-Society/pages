#!/usr/bin/env python3
"""
Scan the repo for Markdown/HTML/notebook pages with YAML frontmatter containing
assignment: true and POST to the Spring `auto-create` API for each page.

Usage:
  Local review (default; nothing is sent to Spring):
    python3 scripts/create_assignments_from_frontmatter.py

  Production (CI) - supplying a password enables the live run:
    export PAGES_BOT_UID=pages-bot
    export PAGES_BOT_PASSWORD=...
    python3 scripts/create_assignments_from_frontmatter.py

The script is idempotent: the server will return 200 for existing contentUrl.
"""
import argparse
import json
import math
import os
import re
import sys
import time
from datetime import date
from collections import OrderedDict
from pathlib import Path
from urllib.parse import quote

import requests
import yaml

# Support frontmatter blocks with or without a trailing newline after closing ---.
FRONTMATTER_RE = re.compile(r"^\ufeff?\s*---\s*\n(.*?)\n---\s*(?:\n|$)", re.S)

DEFAULT_BASE_URL = os.getenv("BASE_URL", "https://spring.opencodingsociety.com")
DEFAULT_UID = os.getenv("PAGES_BOT_UID", "pages-bot")
DEFAULT_PASSWORD = os.getenv("PAGES_BOT_PASSWORD", "")
DEFAULT_REQUESTS_PER_MINUTE = int(os.getenv("ASSIGNMENT_SYNC_REQUESTS_PER_MINUTE", "80"))
GENERATED_PROJECT_ROOTS = {
    ("_notebooks", "projects"),
    ("_posts", "projects"),
    ("_sass", "projects"),
}
# Fallbacks for missing or invalid frontmatter; the frontend can treat these as "unset".
DEFAULT_POINTS = 1.0
DEFAULT_DESCRIPTION = ""
DEFAULT_DUE_DATE = None
DEFAULT_SUBMISSION_TYPE = None
# System test users own assignments whose frontmatter names no creators.
DEFAULT_CREATOR_UIDS = ("toby", "hop")
DEFAULT_COURSE_CODES = ()
# The title falls back to the file stem, since Spring requires a name.


class AssignmentFrontmatterError(ValueError):
    """Raised when assignment-specific frontmatter cannot be synchronized safely."""


def warn(message, path=None):
    """Report bad author metadata as a GitHub annotation without failing the job."""
    location = f" file={path}" if path is not None else ""
    print(f"::warning{location}::{message}", file=sys.stderr)




def scalar_text(value, field, path, default=None):
    """Return a stripped string for scalar YAML values, else the default."""
    if value is None or isinstance(value, bool):
        return default
    if isinstance(value, (str, int, float, date)):
        text = str(value).strip()
        return text or default
    warn(f"Ignoring non-scalar {field} {value!r}", path)
    return default


def sanitize_scalar_fields(fm: dict, path: Path):
    """Coerce free-form fields to safe values; bad or missing ones fall back to defaults."""
    name = scalar_text(fm.get("title") or fm.get("name"), "title", path, default=path.stem)
    description = scalar_text(
        fm.get("description"), "description", path, default=DEFAULT_DESCRIPTION
    )

    points = DEFAULT_POINTS
    raw_points = fm.get("points")
    if raw_points is not None:
        try:
            if isinstance(raw_points, bool):
                raise ValueError
            points = float(raw_points)
            if not math.isfinite(points) or points < 0:
                raise ValueError
        except (TypeError, ValueError):
            warn(f"Invalid points {raw_points!r}; using {DEFAULT_POINTS}", path)
            points = DEFAULT_POINTS

    due_date = scalar_text(
        fm.get("dueDate") or fm.get("due_date") or fm.get("due"),
        "dueDate", path, default=DEFAULT_DUE_DATE,
    )

    submission_type = fm.get("assignment_submission_type")
    if submission_type is not None and not isinstance(submission_type, str):
        warn(f"Ignoring non-string assignment_submission_type {submission_type!r}", path)
        submission_type = None
    submission_type = (submission_type or "").strip() or DEFAULT_SUBMISSION_TYPE

    return name, description, points, due_date, submission_type


class RequestPacer:
    """Keep repository-wide synchronization below Spring's per-client limit."""

    def __init__(self, requests_per_minute, clock=time.monotonic, sleeper=time.sleep):
        if requests_per_minute <= 0:
            raise ValueError("requests_per_minute must be greater than zero")
        self.interval = 60.0 / requests_per_minute
        self.clock = clock
        self.sleeper = sleeper
        self.next_request_at = None

    def wait(self):
        now = self.clock()
        if self.next_request_at is not None and now < self.next_request_at:
            delay = self.next_request_at - now
            self.sleeper(delay)
            now += delay
        self.next_request_at = now + self.interval


def post_with_rate_limit_retry(session, url, *, max_attempts=3, sleeper=time.sleep, **kwargs):
    """Retry a throttled request when shared infrastructure still returns HTTP 429."""
    response = None
    for attempt in range(max_attempts):
        response = session.post(url, **kwargs)
        if getattr(response, "status_code", None) != 429 or attempt == max_attempts - 1:
            return response

        retry_after = response.headers.get("Retry-After") if hasattr(response, "headers") else None
        try:
            delay = max(1, int(retry_after)) if retry_after else 60
        except ValueError:
            delay = 60
        print(f"Rate limited by Spring; retrying in {delay} seconds", file=sys.stderr)
        sleeper(delay)
    return response


def find_files(root: Path):
    """Yield editable assignment sources, excluding registered-project build outputs."""
    exts = {".md", ".markdown", ".html", ".htm", ".ipynb"}
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in exts:
            continue
        relative_parts = path.relative_to(root).parts
        if len(relative_parts) >= 2 and relative_parts[:2] in GENERATED_PROJECT_ROOTS:
            continue
        yield path


def parse_frontmatter_text(text: str):
    # Notebook sources are inconsistent about newline preservation; normalize
    # line endings before attempting regex extraction.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        data = yaml.safe_load(m.group(1))
        return data or {}
    except Exception:
        return None


def read_frontmatter(path: Path):
    if path.suffix.lower() == ".ipynb":
        try:
            notebook = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None

        for cell in notebook.get("cells", []):
            source = cell.get("source")
            if isinstance(source, list):
                # Each array entry is a logical line in many notebooks.
                # Join with newlines so YAML frontmatter stays parseable even
                # when individual items do not include trailing "\n".
                text = "\n".join([str(s).rstrip("\n") for s in source])
            elif isinstance(source, str):
                text = source
            else:
                continue

            data = parse_frontmatter_text(text)
            if data is not None:
                return data

        return None

    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None
    return parse_frontmatter_text(text)


def canonicalize_content_url(content_url):
    """Collapse a URL to the form Spring stores: no repeated, leading or trailing slashes.

    Mirrors AssignmentContentUrls.canonicalize on the Spring side exactly. The file
    extension and letter case are left alone on purpose, so the stored key stays identical
    to the URL Jekyll actually serves. Keep the two implementations in step.
    """
    if not isinstance(content_url, str):
        return None
    collapsed = re.sub(r"/{2,}", "/", content_url.strip()).strip("/")
    return collapsed or None


def post_categories(rel: str, fm: dict):
    """Categories Jekyll prefixes onto a post's default permalink.

    Verified against a Jekyll build rather than assumed, because the rule is asymmetric:
    only directories *above* `_posts` become categories. `CatAbove/_posts/x.md` is in
    category `CatAbove`, while `_posts/CSH/x.md` has no category at all and resolves to
    /2026/07/27/x.html. Frontmatter `categories`/`category` overrides the directory, and a
    string form is split on whitespace the way Jekyll splits it.

    Jekyll lowercases each category and URL-encodes it, leaving `-` and `_` intact
    (`B-tools_and_equipment` -> `b-tools_and_equipment`, `Foo Bar` -> `foo%20bar`).
    """
    declared = None
    if fm is not None:
        declared = fm.get("categories")
        if declared is None:
            declared = fm.get("category")

    if isinstance(declared, str):
        categories = [c for c in declared.replace(",", " ").split() if c]
    elif isinstance(declared, list):
        categories = [str(c).strip() for c in declared if str(c).strip()]
    else:
        # Directories above _posts only; anything nested under _posts is not a category.
        categories = [s for s in rel.partition("_posts/")[0].split("/") if s]

    return [quote(c.lower(), safe="") for c in categories]


def determine_content_url(root: Path, path: Path, fm: dict):
    """The URL Jekyll will serve this page at, in Spring's canonical form.

    This has to agree byte for byte with what the browser posts from _layouts/post.html
    (`{{ page.url }}`), because Spring dedups assignments on that string. Deriving it
    differently here is what previously produced two assignment rows per page: one holding
    the submissions, the other holding the frontmatter-declared creators.
    """
    # An explicit permalink is used by Jekyll verbatim as page.url.
    if fm is not None and isinstance(fm.get("permalink"), str) and fm.get("permalink").strip():
        return canonicalize_content_url(fm.get("permalink"))

    rel = path.relative_to(root).as_posix()

    # Posts without a permalink use Jekyll's default style,
    # /:categories/:year/:month/:day/:title.html, built from the filename's date and slug.
    # _config.yml sets no `permalink` and no `defaults`, so that default is in force.
    if "_posts/" in rel or rel.startswith("_posts/"):
        stem = re.sub(r"\.(md|markdown|html|htm|ipynb)$", "", Path(rel).name, flags=re.I)
        dated = re.match(r"^(\d{4})-(\d{2})-(\d{2})-(.+)$", stem)
        if dated:
            year, month, day, slug = dated.groups()
            parts = post_categories(rel, fm) + [year, month, day, slug]
            return canonicalize_content_url("/".join(parts) + ".html")

    # Ordinary pages keep their source path with an .html extension; index.* becomes its
    # own directory. Note that Jekyll excludes _notebooks, so an .ipynb marked
    # `assignment: true` would yield a URL the site never serves - none exist today.
    rel = re.sub(r"(^|/)index\.(md|markdown|html|htm)$", r"\1", rel, flags=re.I)
    if re.search(r"\.(md|markdown|html|htm|ipynb)$", rel, flags=re.I):
        rel = re.sub(r"\.(md|markdown|html|htm|ipynb)$", ".html", rel, flags=re.I)
    return canonicalize_content_url(rel)


def read_creator_uids(fm: dict, path: Path | None = None):
    """Return a normalized creator list while keeping legacy assignments valid."""
    creator_uids = fm.get("assignment_creator_uids")
    if creator_uids is None:
        return []

    location = f" in {path}" if path is not None else ""
    if not isinstance(creator_uids, list) or not creator_uids:
        raise AssignmentFrontmatterError(
            f"assignment_creator_uids must be a non-empty YAML list{location}"
        )

    normalized = []
    for creator_uid in creator_uids:
        if not isinstance(creator_uid, str) or not creator_uid.strip():
            raise AssignmentFrontmatterError(
                f"assignment_creator_uids must contain only non-empty strings{location}"
            )
        uid = creator_uid.strip()
        if uid not in normalized:
            normalized.append(uid)

    return normalized


def read_course_codes(fm: dict, path: Path | None = None):
    """Read course names without changing the established nested course metadata.

    Existing pages use ``courses`` as a mapping whose values contain routing data such
    as ``week``. Assignment synchronization only needs the mapping keys, so this leaves
    those values entirely under the existing course-build system's control.

    ``None`` means the field was absent and Spring must preserve any stored courses.
    """
    if "courses" not in fm:
        return None

    courses = fm.get("courses")
    location = f" in {path}" if path is not None else ""
    if not isinstance(courses, dict) or not courses:
        raise AssignmentFrontmatterError(
            f"courses must be a non-empty YAML mapping{location}"
        )

    normalized = []
    for course in courses:
        if not isinstance(course, str) or not course.strip():
            raise AssignmentFrontmatterError(
                f"courses must contain only non-empty course names{location}"
            )
        course_code = course.strip().upper()
        if course_code not in normalized:
            normalized.append(course_code)
    return normalized


def deduplicate_candidates(candidates):
    """Collapse source/generated copies that resolve to the same served assignment.

    Notebook conversion keeps frontmatter in a generated post, so scanning the repository
    can encounter the same assignment twice. Submission type, creator, and course metadata must agree; generated
    display text may differ from the source, which remains authoritative on first creation.
    """
    unique = OrderedDict()
    for candidate in candidates:
        path, content_url, *_ = candidate
        if content_url not in unique:
            unique[content_url] = candidate
            continue

        existing = unique[content_url]

        # Conversion may temporarily leave a generated copy without newer optional
        # synchronization fields. Merge complementary metadata without relying on path
        # conventions; two different populated values remain a real conflict.
        merged_sync_metadata = []
        for existing_value, candidate_value in zip(existing[6:9], candidate[6:9]):
            existing_is_populated = existing_value is not None and existing_value != []
            candidate_is_populated = candidate_value is not None and candidate_value != []
            if existing_is_populated and candidate_is_populated and existing_value != candidate_value:
                raise AssignmentFrontmatterError(
                    "Conflicting assignment metadata for contentUrl "
                    f"'{content_url}' in {existing[0]} and {path}"
                )
            merged_sync_metadata.append(
                existing_value if existing_is_populated else candidate_value
            )

        # Prefer the editable notebook's display metadata when a converted copy is also
        # present, then apply the safely merged synchronization fields to that candidate.
        preferred = candidate if path.suffix.lower() == ".ipynb" else existing
        merged = list(preferred)
        merged[6:9] = merged_sync_metadata
        unique[content_url] = tuple(merged)

    return list(unique.values())


def deduplicate_candidates_resilient(candidates):
    """Resolve each assignment URL independently.

    A malformed duplicate must be reported, but it must not prevent unrelated valid
    assignments from reaching Spring. The workflow still exits unsuccessfully after the
    valid assignments are synchronized so maintainers cannot miss the bad metadata.
    """
    candidates_by_url = OrderedDict()
    for candidate in candidates:
        candidates_by_url.setdefault(candidate[1], []).append(candidate)

    resolved = []
    errors = []
    for url_candidates in candidates_by_url.values():
        try:
            resolved.extend(deduplicate_candidates(url_candidates))
        except AssignmentFrontmatterError as error:
            errors.append(str(error))
    return resolved, errors


def authenticate(session: requests.Session, base_url: str, uid: str, password: str):
    resp = session.post(f"{base_url}/authenticate", json={"uid": uid, "password": password}, timeout=20)
    if resp.status_code != 200:
        raise RuntimeError(f"Authentication failed: {resp.status_code} {resp.text}")
    if "jwt_java_spring" not in session.cookies:
        # try to extract from header
        if "Set-Cookie" in resp.headers and "jwt_java_spring=" in resp.headers.get("Set-Cookie", ""):
            return
        raise RuntimeError("Authentication succeeded but jwt cookie not present")


def create_assignment(
    session: requests.Session,
    base_url: str,
    name: str,
    content_url: str,
    description: str = "auto-created on deploy",
    points=None,
    due_date=None,
    assignment_submission_type=None,
    creator_uids=None,
    course_codes=None,
):
    payload = {"name": name, "contentUrl": content_url, "description": description}
    if assignment_submission_type:
        payload["assignmentType"] = assignment_submission_type
    if points is not None:
        payload["points"] = points
    if due_date:
        payload["dueDate"] = due_date
    if creator_uids:
        # Requests encodes a list value as repeated creatorUids form fields,
        # which Spring can bind directly to List<String>.
        payload["creatorUids"] = creator_uids
    if course_codes is not None:
        # As with creatorUids, Requests emits one form field per list entry.
        payload["courseCodes"] = course_codes
    # Use form-encoded to match frontend
    resp = post_with_rate_limit_retry(
        session,
        f"{base_url}/api/assignments/auto-create",
        data=payload,
        timeout=30,
    )
    return resp


def create_assignment_full(session: requests.Session, base_url: str, name: str, atype: str, description: str, points: float, dueDate: str, assignmentType: str):
    # This calls the admin/teacher create endpoint which requires role privileges
    payload = {
        "name": name,
        "type": atype,
        "description": description,
        "points": str(points),
        "dueDate": dueDate,
        "assignmentType": assignmentType,
    }
    resp = post_with_rate_limit_retry(
        session,
        f"{base_url}/api/assignments/create",
        data=payload,
        timeout=30,
    )
    return resp


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--uid", default=DEFAULT_UID)
    parser.add_argument("--password", default=DEFAULT_PASSWORD)
    parser.add_argument("--dry-run", action="store_true", help="Force a dry run even when a password is set")
    parser.add_argument(
        "--requests-per-minute",
        type=int,
        default=DEFAULT_REQUESTS_PER_MINUTE,
        help="Maximum synchronization requests per minute (default: 80)",
    )
    parser.add_argument("--create", action="store_true", help="Use POST /api/assignments/create with full params from frontmatter (requires teacher/admin)")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if args.requests_per_minute <= 0:
        print("requests-per-minute must be greater than zero", file=sys.stderr)
        return 2
    if not root.exists():
        print("Root not found", file=sys.stderr)
        return 2

    session = requests.Session()
    # Credentials opt in to a production run; without them nothing is sent to Spring.
    dry_run = args.dry_run or not args.password
    if dry_run:
        print("DRY RUN: no password provided or --dry-run set; Spring will not be contacted.")
    else:
        authenticate(session, args.base_url, args.uid, args.password)
        print(f"Authenticated OK as {args.uid}; changes will be written to {args.base_url}")

    pacer = RequestPacer(args.requests_per_minute)
    candidates = []
    # Infrastructure failures only; author metadata problems are warnings.
    errors = []
    skipped = 0
    for f in find_files(root):
        fm = read_frontmatter(f)
        if not isinstance(fm, dict) or fm.get("assignment") is not True:
            continue
        try:
            content_url = determine_content_url(root, f, fm)
            if not content_url:
                raise AssignmentFrontmatterError("could not determine contentUrl")
            name, description, points, due_date, assignment_submission_type = (
                sanitize_scalar_fields(fm, f)
            )
        except Exception as error:
            warn(f"Skipping assignment, bad frontmatter: {error}", f)
            skipped += 1
            continue
        # Invalid lists stay unpopulated here; defaults are applied after dedup so a
        # generated copy cannot conflict with its source's real creators.
        try:
            creator_uids = read_creator_uids(fm, f)
        except AssignmentFrontmatterError as error:
            warn(f"{error}; using default creators", f)
            creator_uids = []
        try:
            course_codes = read_course_codes(fm, f)
        except AssignmentFrontmatterError as error:
            warn(f"{error}; using default courses", f)
            course_codes = None
        candidates.append(
            (f, content_url, name, description, points, due_date,
             assignment_submission_type, creator_uids, course_codes)
        )

    candidates, duplicate_errors = deduplicate_candidates_resilient(candidates)
    for error in duplicate_errors:
        warn(f"Skipping assignment: {error}")
        skipped += 1

    if not candidates:
        print(f"No valid pages with assignment: true found ({skipped} skipped).")
        return 0

    print(f"Found {len(candidates)} pages with assignment: true")
    for path, content_url, name, description, points, due_date, assignment_submission_type, creator_uids, course_codes in candidates:
        creator_uids = creator_uids or list(DEFAULT_CREATOR_UIDS)
        course_codes = course_codes if course_codes is not None else list(DEFAULT_COURSE_CODES)
        print(f"Processing assignment for path: {path}, contentUrl={content_url}, name={name}")
        creator_summary = ",".join(creator_uids) if creator_uids else "legacy/unassigned"
        course_summary = ",".join(course_codes) if course_codes else "legacy/unassigned"
        print(
            f"-> {path} -> contentUrl={content_url} name={name} "
            f"assignmentType={assignment_submission_type or 'unchanged/default file'} "
            f"creatorUids={creator_summary} courseCodes={course_summary}"
        )
        if dry_run:
            continue

        if args.create:
            # For full create, require frontmatter to contain full params
            fm = read_frontmatter(path)
            missing = []
            # name already present
            atype = None
            if fm is not None:
                atype = fm.get("type") or fm.get("assignment_submission_type")
            if not atype:
                missing.append("type")
            points = None
            if fm is not None and fm.get("points") is not None:
                try:
                    points = float(fm.get("points"))
                except Exception:
                    missing.append("points (invalid number)")
            else:
                missing.append("points")
            dueDate = None
            if fm is not None:
                dueDate = fm.get("dueDate") or fm.get("due_date") or fm.get("due")
            if not dueDate:
                missing.append("dueDate")

            if missing:
                print(f"  SKIP: missing frontmatter fields for full create: {', '.join(missing)}")
                continue

            try:
                pacer.wait()
                resp = create_assignment_full(session, args.base_url, name, atype, description, points, str(dueDate), assignment_submission_type or "file")
                print(f"  {resp.status_code} {resp.text[:200]}")
                if not resp.ok:
                    errors.append(
                        f"Spring rejected '{content_url}': {resp.status_code} {resp.text[:200]}"
                    )
            except Exception as e:
                print(f"  ERROR: {e}")
                errors.append(f"Could not synchronize '{content_url}': {e}")
        else:
            try:
                pacer.wait()
                resp = create_assignment(
                    session,
                    args.base_url,
                    name,
                    content_url,
                    description,
                    points,
                    due_date,
                    assignment_submission_type,
                    creator_uids,
                    course_codes,
                )
                print(f"  {resp.status_code} {resp.text[:200]}")
                if 400 <= resp.status_code < 500 and resp.status_code not in (401, 403, 429):
                    # Spring rejected this page's data; other assignments are unaffected.
                    warn(f"Spring rejected '{content_url}': {resp.status_code} {resp.text[:200]}", path)
                    skipped += 1
                elif not resp.ok:
                    errors.append(
                        f"Spring rejected '{content_url}': {resp.status_code} {resp.text[:200]}"
                    )
            except Exception as e:
                print(f"  ERROR: {e}")
                errors.append(f"Could not synchronize '{content_url}': {e}")

    print(f"Done: {len(candidates)} processed, {skipped} skipped for bad metadata.")
    for error in errors:
        print(f"Assignment synchronization error: {error}", file=sys.stderr)
    return 2 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
