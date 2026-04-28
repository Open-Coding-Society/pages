# make-debug/log_checker.py

import re
from pathlib import Path
from collections import Counter

LOG_PATH = "/tmp/jekyll4500.log"


def read_log(path: str = LOG_PATH) -> str:
    log_path = Path(path)
    if not log_path.exists():
        raise FileNotFoundError(f"{path} does not exist")
    return log_path.read_text(errors="ignore")


def detect_post_url_issues(log_text: str):
    """
    Detects Jekyll post_url deprecation mismatches and extracts broken references.
    """
    pattern = r"\{\%\s*post_url\s+([^\s\%]+)\s*\%\}"
    matches = re.findall(pattern, log_text)

    if not matches:
        return None

    counts = Counter(matches)

    issues = []
    for post, count in counts.items():
        issues.append({
            "post": post,
            "count": count
        })

    return issues


def detect_general_issues(log_text: str):
    """
    Detects other common issues.
    """
    issues = []

    if re.search(r"Permission denied", log_text, re.IGNORECASE):
        issues.append(("permission_denied", "Fix file permissions or use sudo"))

    if re.search(r"Address already in use", log_text, re.IGNORECASE):
        issues.append(("port_in_use", "Kill process or change port"))

    if re.search(r"Could not find gem", log_text, re.IGNORECASE):
        issues.append(("missing_gem", "Run: bundle install"))

    return issues


def clean_output(post_url_issues, general_issues):
    output = []

    if not post_url_issues and not general_issues:
        return "✅ No major issues detected."

    output.append("⚠️ Issues Detected:\n")

    # --- POST_URL ISSUES ---
    if post_url_issues:
        output.append("🔗 Broken post_url references:\n")

        for issue in post_url_issues:
            output.append(
                f"- `{issue['post']}` (appears {issue['count']} times)"
            )

        output.append("\n📌 EXACT FIX:\n")
        output.append(
            "Your `{% post_url %}` tags do NOT match actual post filenames.\n"
        )

        output.append("Do this:\n")
        output.append("1. Go to your `_posts/` folder")
        output.append("2. Find the exact filename (example):")
        output.append("   2026-02-06-hawkhub.md")
        output.append("3. Make sure your tag matches EXACTLY:\n")
        output.append("   {% post_url 2026-02-06-hawkhub %}\n")
        output.append(
            "⚠️ If the filename is different (even slightly), Jekyll will fail."
        )

    # --- GENERAL ISSUES ---
    if general_issues:
        output.append("\n🛠 Other Issues:\n")
        for name, fix in general_issues:
            output.append(f"- {name}")
            output.append(f"  → Fix: {fix}")

    return "\n".join(output)


def main():
    try:
        log = read_log()

        post_url_issues = detect_post_url_issues(log)
        general_issues = detect_general_issues(log)

        report = clean_output(post_url_issues, general_issues)
        print(report)

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
