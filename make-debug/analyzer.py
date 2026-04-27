import requests

BACKEND_URL = "http://localhost:8585/api/make/analyze"

def analyze_log(log: str) -> str:
    log = log[-8000:]  # prevent huge inputs

    try:
        response = requests.post(
            BACKEND_URL,
            data=log,
            headers={"Content-Type": "text/plain"}
        )
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        return f"Backend request failed: {str(e)}"
