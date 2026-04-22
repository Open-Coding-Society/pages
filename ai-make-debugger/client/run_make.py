import subprocess
import requests

LOG_FILE = "/tmp/build.log"
BACKEND_URL = "http://127.0.0.1:8000/debug"


def run_make() -> str:
    with open(LOG_FILE, "w") as f:
        process = subprocess.Popen(
            ["make", "build"],
            stdout=f,
            stderr=subprocess.STDOUT,
            text=True,
        )
        process.communicate()

    return LOG_FILE


def send_log(path: str) -> None:
    with open(path) as f:
        log = f.read()

    res = requests.post(BACKEND_URL, json={"log": log})
    res.raise_for_status()

    print("\n=== AI DEBUG RESULT ===\n")
    print(res.json()["result"])


if __name__ == "__main__":
    log_path = run_make()
    send_log(log_path)
