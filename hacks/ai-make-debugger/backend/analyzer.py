import hashlib
import os

import openai

from backend.prompt import SYSTEM_PROMPT

KEYWORDS = [
    "error",
    "exception",
    "failed",
    "fatal",
    "traceback",
    "deprecation",
]

openai.api_key = os.getenv("OPENAI_API_KEY")


def extract_relevant_lines(log: str) -> str:
    lines = log.splitlines()
    filtered = [
        line for line in lines
        if any(keyword in line.lower() for keyword in KEYWORDS)
    ]
    if not filtered:
        filtered = lines
    return "\n".join(filtered[-50:])


def fingerprint(error_text: str) -> str:
    return hashlib.md5(error_text.strip().encode("utf-8")).hexdigest()


def analyze_log(log: str) -> str:
    if not openai.api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Export it before starting the backend."
        )

    cleaned_log = extract_relevant_lines(log)
    error_id = fingerprint(cleaned_log)

    prompt = (
        "Build failure log extracted from a student build. "
        "Return a concise diagnosis, root cause, and fix steps.\n\n"
        f"Error fingerprint: {error_id}\n\n"
        f"Relevant log:\n{cleaned_log}"
    )

    response = openai.ChatCompletion.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=700,
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()
