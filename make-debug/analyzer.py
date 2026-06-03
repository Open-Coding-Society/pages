import requests

BACKEND_URL = "http://localhost:8587/api/gemini/analyze-log"


def analyze_log(log: str) -> str:
    log = log[-8000:]
    payload = {"log": log}

    try:
        response = requests.post(
            BACKEND_URL,
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        return f"Backend request failed: {str(e)}"
