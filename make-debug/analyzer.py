import requests
from prompt import SYSTEM_PROMPT

BACKEND_URL = "http://localhost:8587/api/gemini/analyze-log"


def analyze_log(log: str) -> str:
    log = log[-8000:]  # prevent huge inputs

    try:
        response = requests.post(
            BACKEND_URL,
            json={"log": log},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        data = response.json()
        if data.get("success"):
            return data["analysis"]
        else:
            return f"Analysis failed: {data.get('message', 'Unknown error')}"
    except requests.RequestException as e:
        return f"Backend request failed: {str(e)}"
