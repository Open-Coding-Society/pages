#!/usr/bin/env python3
"""Render _layouts/submissions.html as a standalone page against mock data.

WHY THIS EXISTS

The submissions dashboard only draws anything once the Java API answers, and
that API is not reachable from a laptop. Without this you cannot see the page at
all -- you push, wait for the deploy, log in, and hope. This strips the Liquid,
stubs `fetch`, and feeds in a fixture covering every state the table can be in:
each score band, an ungraded row, a late row, an AI-checked row and one the AI
has not seen, a link submission and a file submission.

It is a VIEWER, not a test. It proves the markup and the stylesheet agree; it
proves nothing about the real endpoints.

    python3 _sass/ocs/tools/preview_submissions.py --admin
    python3 -m http.server -d .preview 4174
"""
import argparse
import json
import pathlib
import re
import shutil

REPO = pathlib.Path(__file__).resolve().parents[3]
OUT = REPO / ".preview"
# Where to look for a Jekyll build, for the generated stylesheet below.
SITE_DIRS = [REPO / "_site", pathlib.Path("/tmp/subs-site")]

# One row per state the table can render, so a glance at the preview covers the
# whole matrix rather than whichever case the fixture happened to include.
FIXTURE = [
    {"id": 101, "assignmentName": "Java Spring Hacks - Sprint 1 Final",
     "submitterName": "achen", "submitterId": 1,
     "content": {"type": "link", "url": "https://github.com/achen/spring-sprint1",
                 "unit": 4, "chapter": 5, "topic": "4.5", "topicTitle": "Implementing Array Algorithms",
                 "dueDate": "2026-01-16"},
     "grade": 95, "feedback": "Strong work. The API layer is clean and the POJO maps exactly to the table.",
     "comment": "Deployed to AWS, endpoint in the README.",
     "aiSummary": "Full CRUD controller with a matching JPA entity. Error handling covers the 404 path.",
     "qualityScore": 5, "isLate": False},
    {"id": 102, "assignmentName": "API Controller",
     "submitterName": "achen", "submitterId": 1,
     "content": {"type": "file", "filename": "ApiController.java",
                 "storagePath": "achen/ApiController.java", "contentType": "text/x-java", "size": 4120,
                 "unit": 3, "chapter": 3, "topic": "3.3", "topicTitle": "Anatomy of a Class",
                 "dueDate": "2026-01-09",
                 "notes": "Second attempt after the boundary fix."},
     "grade": 84, "feedback": "", "comment": "",
     "aiSummary": "Endpoints are correct. Two methods have no Javadoc and one returns a raw entity.",
     "qualityScore": 4, "isLate": False},
    {"id": 103, "assignmentName": "Java Persistence API (JPA)",
     "submitterName": "achen", "submitterId": 1,
     "content": {"type": "link", "url": "https://github.com/achen/jpa-lesson",
                 "unit": 4, "chapter": 6, "topic": "4.6", "topicTitle": "Using Text Files",
                 "dueDate": "2026-01-12"},
     "grade": 74, "feedback": "Bring this one to Thursday's check-in.",
     "comment": "Not sure the relationship mapping is right.",
     "aiSummary": "The entity persists, but the one-to-many is mapped on the wrong side, so the join table is unused.",
     "qualityScore": 3, "isLate": True},
    {"id": 104, "assignmentName": "Plain Old Java Objects (POJO)",
     "submitterName": "achen", "submitterId": 1,
     "content": {"type": "link", "url": "https://github.com/achen/pojo",
                 "unit": 3, "chapter": 4, "topic": "3.4", "topicTitle": "Constructors"},
     "grade": 55, "feedback": "This needs another attempt before it counts.",
     "comment": "",
     "aiSummary": "The class compiles but has no no-arg constructor, so JPA cannot instantiate it.",
     "qualityScore": 2, "isLate": False},
    {"id": 105, "assignmentName": "Frontend UI",
     "submitterName": "achen", "submitterId": 1,
     "content": {"type": "file", "filename": "ui-notes.pdf", "storagePath": "achen/ui-notes.pdf",
                 "contentType": "application/pdf", "size": 88210,
                 "unit": 1, "chapter": 12, "topic": "1.12", "topicTitle": "Objects: Instances of Classes"},
     "grade": None, "feedback": None, "comment": "Turned in right before the deadline.",
     "aiSummary": None, "qualityScore": None, "isLate": False},
    {"id": 106, "assignmentName": "Anatomy of a Spring Boot Project",
     "submitterName": "rbhatia", "submitterId": 2,
     "content": {"type": "link", "url": "https://github.com/rbhatia/anatomy"},
     "grade": 88, "feedback": "Good deployment notes.", "comment": "",
     "aiSummary": "Covers the build, the profile config and the deploy step.",
     "qualityScore": 4, "isLate": False},
    {"id": 107, "assignmentName": "Introduction Java Spring Framework",
     "submitterName": "mlopez", "submitterId": 3,
     # No unit or chapter: a submission made before the form asked for them.
     "content": {"type": "link", "url": "https://github.com/mlopez/spring-intro"},
     "grade": None, "feedback": None, "comment": "", "aiSummary": None,
     "qualityScore": None, "isLate": True},
]


def units():
    """The course units, straight from the file Jekyll reads."""
    import yaml
    doc = yaml.safe_load((REPO / "_data/csa_units.yml").read_text())
    return doc["units"]


def strip_liquid(html, baseurl=""):
    """Turn the layout into a plain page: drop frontmatter and comments, expand
    the one data loop, and resolve the Liquid expressions that produce URLs.

    This is a stand-in for Liquid, not an implementation of it. It handles
    exactly what this layout uses; anything else would pass through as literal
    text, which is loud enough to notice.
    """
    html = re.sub(r"\A---\n.*?\n---\n", "", html, flags=re.S)
    html = re.sub(r"\{%\s*comment\s*%\}.*?\{%\s*endcomment\s*%\}", "", html, flags=re.S)

    # {% for unit in site.data.csa_units.units %} ... {% endfor %}
    def expand(match):
        body = match.group(1)
        out = []
        for unit in units():
            piece = body
            piece = piece.replace("{{ unit.number }}", str(unit["number"]))
            piece = piece.replace("{{ unit.title }}", unit["title"])
            out.append(piece)
        return "".join(out)

    html = re.sub(
        r"\{%\s*for\s+unit\s+in\s+site\.data\.csa_units\.units\s*%\}(.*?)\{%\s*endfor\s*%\}",
        expand, html, flags=re.S)

    html = re.sub(r"\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}", rf"{baseurl}\1", html)
    html = re.sub(r"\{\{\s*site\.baseurl\s*\}\}", baseurl, html)

    leftover = re.findall(r"\{%.*?%\}|\{\{.*?\}\}", html, flags=re.S)
    if leftover:
        print(f"  warning: {len(leftover)} Liquid tag(s) not handled: {leftover[:3]}")
    return html


def build(is_admin):
    layout = (REPO / "_layouts/submissions.html").read_text()
    body = strip_liquid(layout)

    # The real module import cannot resolve without a server, and even then it
    # would point at production. Swap it for the stub written alongside.
    body = body.replace(
        "import { javaURI, pythonURI, fetchOptions } from '/assets/js/api/config.js';",
        "import { javaURI, pythonURI, fetchOptions } from './mock-config.js';")

    OUT.mkdir(exist_ok=True)
    (OUT / "assets/css").mkdir(parents=True, exist_ok=True)
    (OUT / "assets/js").mkdir(parents=True, exist_ok=True)
    for name in ("ocs.css", "ocs-submissions.css"):
        shutil.copy(REPO / "assets/css" / name, OUT / "assets/css" / name)

    # style.css is pulled in on purpose, from a Jekyll build rather than the
    # source tree -- it is generated, not committed. It carries
    # `p { color: ... !important }`, and a preview without it shows a text
    # hierarchy the real page does not have. That is not hypothetical: it is how
    # a flattened-help-text bug reached a screenshot once already.
    built = next((d / "assets/css/style.css" for d in SITE_DIRS
                  if (d / "assets/css/style.css").exists()), None)
    if built:
        shutil.copy(built, OUT / "assets/css/style.css")
    else:
        print("  warning: no built style.css found in " +
              ", ".join(str(d) for d in SITE_DIRS) +
              " -- run `bundle exec jekyll build` first, or this preview will "
              "overstate the text hierarchy")
    shutil.copy(REPO / "assets/js/ocs.js", OUT / "assets/js/ocs.js")

    (OUT / "mock-config.js").write_text(
        "export const javaURI = 'https://mock.invalid';\n"
        "export const pythonURI = 'https://mock.invalid';\n"
        "export const fetchOptions = { credentials: 'include' };\n")

    # The shell the layout normally renders inside: dark ground, a little
    # padding. Not aesthetihawk itself -- this is about the page, not the chrome.
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Submissions preview</title>
<link rel="stylesheet" href="assets/css/style.css">
<style>
  body {{ margin: 0; padding: 2rem; background: #121212; color: #fff;
          font-family: Inter, system-ui, sans-serif; }}
  .preview-note {{ margin: 0 0 1.5rem; padding: .6rem .9rem; border-radius: 8px;
     background: #272B3F; color: #9db4e6; font-size: .85rem; }}
</style>
</head><body>
<p class="preview-note">Local preview against fixture data &mdash; no API is running.
   Admin: <strong>{str(is_admin).lower()}</strong></p>
<script>
// Intercept before the module runs. Every endpoint the page touches answers
// from the fixture; anything else fails loudly rather than silently hanging.
const SUBMISSIONS = {json.dumps(FIXTURE)};
const IS_ADMIN = {str(is_admin).lower()};
window.fetch = async (url, options) => {{
  const u = String(url);
  const ok = (body) => new Response(JSON.stringify(body),
      {{ status: 200, headers: {{ 'Content-Type': 'application/json' }} }});
  if (u.includes('/user-info')) return ok({{ isAdmin: IS_ADMIN, username: 'achen' }});
  if (u.includes('/api/person/uid/')) return ok({{ id: 1 }});
  if (u.includes('/assignment-submission-view/list')) return ok(SUBMISSIONS);
  console.warn('[preview] unstubbed request:', u, options && options.method);
  return new Response('{{}}', {{ status: 501 }});
}};
</script>
{body}
</body></html>"""

    (OUT / "index.html").write_text(page)
    print(f"wrote {OUT / 'index.html'}  (admin={is_admin}, {len(FIXTURE)} fixture rows)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--admin", action="store_true", help="render with the teacher tab")
    build(parser.parse_args().admin)
