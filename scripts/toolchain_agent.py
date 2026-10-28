#!/usr/bin/env python3
"""
toolchain_agent
---------------
Local agent for Toolchain Trail. Works on macOS, Windows, Linux and WSL, using
only the Python standard library (nothing to pip install).

How it fits together (one-time device pairing, once for the whole trail):
  1. At the first station, the signed-in game gets a pairing code from the
     Spring backend. The code works once and expires in 5 minutes.
  2. The student runs this agent and pastes the code. The code is read
     without echoing, like a password.
  3. The agent exchanges the code for an agent token that only works for that
     student's trail session. The token is kept in memory, never written to disk.
  4. The agent then keeps running in the background, so the student can keep
     using the same terminal to install tools. Each time the game asks for a
     station to be checked, the agent runs that station's real commands and
     sends the results with "Authorization: Bearer <agent-token>". The backend
     decides pass/fail.
  5. Before each check the agent re-reads the PATH a new terminal would get, so
     tools installed after it started are found without restarting it.
  6. The game polls the backend and updates the quest when the station is verified.

Usage (run it from inside your cloned pages repository):
    macOS / Linux / WSL:  python3 scripts/toolchain_agent.py
    Windows (PowerShell): py scripts\\toolchain_agent.py
    Local backend:        python3 scripts/toolchain_agent.py --server http://localhost:8585
    Stop the agent:       python3 scripts/toolchain_agent.py --stop
    Keep it in this window instead of the background: add --foreground

The check ids below must match ToolchainStations.java in blueprint-spring.
"""

import argparse
import getpass
import json
import os
import platform
import secrets
import shutil
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple
from urllib.parse import urlparse

DEFAULT_SERVER = "https://spring.opencodingsociety.com"
COMMAND_TIMEOUT_SECONDS = 30
MAX_OUTPUT_LENGTH = 4000  # the backend keeps at most this much per check
REQUEST_TIMEOUT_SECONDS = 20
DEFAULT_POLL_SECONDS = 2.0  # how often the agent asks which station the game wants checked; --poll-seconds overrides
LOGIN_SHELL_TIMEOUT_SECONDS = 15
# Holds the id of the one background agent that should be running. Starting a new
# agent rewrites it and --stop deletes it; an agent that finds a different id exits.
# Nothing is killed by process id, so a stale file can never stop an unrelated program.
RUN_FILE = Path.home() / ".toolchain-agent-run"
LOG_FILE = Path.home() / ".toolchain-agent.log"
PATH_MARKER = "__TOOLCHAIN_TRAIL_PATH__"

# (exit code, combined stdout + stderr)
CommandResult = Tuple[int, str]


def detect_os() -> str:
    """macos, windows, linux, or wsl (Linux running inside Windows)."""
    system = platform.system()
    if system == "Darwin":
        return "macos"
    if system == "Windows":
        return "windows"
    if os.environ.get("WSL_DISTRO_NAME") or os.environ.get("WSL_INTEROP"):
        return "wsl"
    try:
        if "microsoft" in Path("/proc/version").read_text(errors="replace").lower():
            return "wsl"
    except OSError:
        pass
    return "linux"


def run_command(command: List[str], cwd: Optional[Path] = None) -> CommandResult:
    """Run one read-only command; a missing tool or a hang is a failed check, not a crash."""
    # shutil.which finds code.cmd, gem.bat, etc. on Windows (it applies PATHEXT).
    executable = shutil.which(command[0])
    if executable is None:
        return 127, f"command not found: {command[0]}"
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0")  # never hang on a git password prompt
    try:
        completed = subprocess.run(
            [executable] + command[1:],
            cwd=str(cwd) if cwd else None,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=COMMAND_TIMEOUT_SECONDS,
            env=env,
            stdin=subprocess.DEVNULL,
        )
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {COMMAND_TIMEOUT_SECONDS}s"
    except OSError as error:
        return 126, f"could not run {command[0]}: {error}"
    return completed.returncode, (completed.stdout or "") + (completed.stderr or "")


def first_success(*results: CommandResult) -> CommandResult:
    for result in results:
        if result[0] == 0:
            return result
    return results[0]


def redact_email(output: str) -> str:
    """Send only enough to show an email is set: 'ada@example.org' -> 'a***@example.org'."""
    value = output.strip()
    if "@" not in value:
        return value
    local, _, domain = value.partition("@")
    return f"{local[:1]}***@{domain}"


def find_trail_folder(cwd: Path, home: Path) -> Optional[Path]:
    for base in (cwd, home, cwd.parent):
        candidate = base / "toolchain-trail"
        if candidate.is_dir():
            return candidate
    return None


Runner = Callable[[List[str], Optional[Path]], CommandResult]


def collect_evidence(station_id: str, repo: Path, runner: Optional[Runner] = None) -> List[Dict]:
    """Run the commands for one station and return [{id, exitCode, output}]."""
    runner = runner or run_command
    python = [sys.executable]  # the Python 3 running this agent; python3 is not on PATH on Windows
    checks: List[Tuple[str, CommandResult]] = []

    if station_id == "terminal-town-gate":
        cwd = Path.cwd()
        folder = find_trail_folder(cwd, Path.home())
        checks = [
            ("working-folder", (0, str(cwd))),
            ("trail-folder", (0, str(folder)) if folder else (1, "toolchain-trail folder not found")),
        ]
    elif station_id == "compiler-canyon-forge":
        checks = [
            ("python", runner(python + ["--version"], None)),
            ("pip", runner(python + ["-m", "pip", "--version"], None)),
            ("ruby", runner(["ruby", "-v"], None)),
            ("bundler", runner(["bundle", "-v"], None)),
            ("rubygems", runner(["gem", "--version"], None)),
        ]
    elif station_id == "editor-isle-tower":
        checks = [("editor", first_success(runner(["code", "--version"], None), runner(["cursor", "--version"], None)))]
    elif station_id == "git-village-hall":
        code, email = runner(["git", "config", "--global", "user.email"], None)
        checks = [
            ("git", runner(["git", "--version"], None)),
            ("git-name", runner(["git", "config", "--global", "user.name"], None)),
            ("git-email", (code, redact_email(email))),
        ]
    elif station_id == "github-gateway-arch":
        checks = [
            ("github-remote", runner(["git", "remote", "-v"], repo)),
            ("remote-branch", runner(["git", "ls-remote", "--heads", "origin"], repo)),
        ]
    elif station_id == "build-bridge":
        checks = [("bundle-check", runner(["bundle", "check"], repo))]
    elif station_id == "integration-summit":
        checks = [
            ("recent-commit", runner(["git", "log", "-1", "--oneline"], repo)),
            ("push-dry-run", runner(["git", "push", "--dry-run"], repo)),
        ]
    else:
        raise ValueError(f"This agent does not know the station '{station_id}'. Update your pages repository.")

    return [{"id": check_id, "exitCode": code, "output": output[:MAX_OUTPUT_LENGTH]}
            for check_id, (code, output) in checks]


class AgentError(Exception):
    """A problem to show the student in one line, without a traceback."""

    def __init__(self, message: str, status: Optional[int] = None):
        super().__init__(message)
        self.status = status  # HTTP status when the server refused the request


def require_safe_server(server: str) -> str:
    """Evidence goes over HTTPS; plain http is only allowed to a backend on this computer."""
    parsed = urlparse(server)
    local = parsed.hostname in ("localhost", "127.0.0.1", "::1")
    if parsed.scheme == "https" or (parsed.scheme == "http" and local):
        return server.rstrip("/")
    raise AgentError("The server must use https:// (http:// is only allowed for localhost).")


def post_json(url: str, body: Dict, token: Optional[str] = None) -> Dict:
    return request_json("POST", url, body, token)


def get_json(url: str, token: Optional[str] = None) -> Dict:
    return request_json("GET", url, None, token)


def request_json(method: str, url: str, body: Optional[Dict], token: Optional[str]) -> Dict:
    headers = {"Accept": "application/json", "User-Agent": "toolchain-trail-agent/2"}
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        try:
            message = json.loads(error.read().decode("utf-8")).get("error")
        except (ValueError, AttributeError):
            message = None
        raise AgentError(message or f"The server answered HTTP {error.code}.", error.code) from None
    except urllib.error.URLError as error:
        if isinstance(error.reason, ssl.SSLCertVerificationError):
            hint = ""
            if detect_os() == "macos":
                hint = " On macOS with Python from python.org, run 'Install Certificates.command' in your Python folder."
            raise AgentError("Python could not verify the server's HTTPS certificate." + hint) from None
        raise AgentError(f"Could not reach {url}: {error.reason}") from None


def login_shell_path() -> Optional[str]:
    """The PATH a brand-new terminal would get, or None if it can't be read."""
    if platform.system() == "Windows":
        return windows_registry_path()
    shell = os.environ.get("SHELL") or "/bin/sh"
    # Load the startup files a new terminal window does: macOS Terminal opens login
    # shells (.zprofile and .zshrc), Linux terminals open interactive ones (.bashrc).
    flags = "-ilc" if platform.system() == "Darwin" else "-ic"
    try:
        completed = subprocess.run([shell, flags, f'printf "%s%s" "{PATH_MARKER}" "$PATH"'],
                                   capture_output=True, text=True, errors="replace",
                                   stdin=subprocess.DEVNULL, timeout=LOGIN_SHELL_TIMEOUT_SECONDS)
    except (OSError, subprocess.SubprocessError):
        return None
    _, marker, path = completed.stdout.rpartition(PATH_MARKER)
    return path.strip() if marker and path.strip() else None


def windows_registry_path() -> Optional[str]:
    """System PATH plus user PATH, as Windows hands them to a new terminal."""
    import winreg  # Windows only
    keys = [(winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment"),
            (winreg.HKEY_CURRENT_USER, "Environment")]
    parts = []
    for root, name in keys:
        try:
            with winreg.OpenKey(root, name) as key:
                parts.append(os.path.expandvars(winreg.QueryValueEx(key, "Path")[0]))
        except OSError:
            continue
    return os.pathsep.join(parts) or None


def merge_path(fresh: str, current: str) -> str:
    """Fresh entries first, then any current ones they don't already include."""
    merged: List[str] = []
    for entry in fresh.split(os.pathsep) + current.split(os.pathsep):
        if entry and entry not in merged:
            merged.append(entry)
    return os.pathsep.join(merged)


def refresh_path() -> None:
    """Pick up tools installed since the agent started, without restarting it."""
    fresh = login_shell_path()
    if fresh:
        os.environ["PATH"] = merge_path(fresh, os.environ.get("PATH", ""))


def print_results(view: Dict) -> None:
    for check in view.get("checks") or []:
        mark = "PASS" if check.get("passed") else "FAIL"
        print(f"  {mark}  {check.get('label')}")
        if not check.get("passed") and check.get("detail"):
            print(f"        {check.get('detail')}")


def check_station(server: str, session_id: str, token: str, station_id: str, os_name: str, repo: Path) -> None:
    """Run one station's commands, send them, and print what the server decided."""
    print(f"\nChecking {station_id}...")
    refresh_path()
    evidence = collect_evidence(station_id, repo)
    try:
        view = post_json(f"{server}/api/toolchain/sessions/{session_id}/results",
                         {"os": os_name, "stationId": station_id, "checks": evidence}, token=token)
    except AgentError as error:
        if error.status == 409:  # the student moved to another station while this ran
            print("  The game moved on to another station; skipping these results.")
            return
        raise
    print_results(view)
    if view.get("status") == "VERIFIED":
        print("  Station verified! Go back to the game.")
    else:
        print("  Fix the FAIL items, then click Check again in the game.")
        if any(item["exitCode"] == 127 for item in evidence):
            print("  (A command was not found. Install it, then click Check again;"
                  " the agent finds newly installed tools on its own.)")


def serve(server: str, session_id: str, token: str, os_name: str, repo: Path,
          poll_seconds: float = DEFAULT_POLL_SECONDS, sleep: Callable[[float], None] = time.sleep,
          still_wanted: Callable[[], bool] = lambda: True) -> int:
    """Wait for check requests from the game until the token expires or the agent is stopped."""
    last_request = None
    offline = False
    while True:
        if not still_wanted():  # --stop was run, or a newer agent took over
            print("Agent stopped.")
            return 0
        try:
            view = get_json(f"{server}/api/toolchain/sessions/{session_id}/next", token=token)
            if offline:
                print("Connected to the server again.")
                offline = False
        except AgentError as error:
            if error.status == 401:
                print("This pairing has ended. Run the agent again and use Pair a new agent in the game.")
                return 1
            if not offline:  # Wi-Fi blip or server restart: keep trying quietly
                print(f"Lost contact with the server ({error}). Retrying...")
                offline = True
            sleep(poll_seconds)
            continue

        request_id = (view.get("stationId"), view.get("requestedAt"))
        if view.get("status") == "CHECKING" and request_id != last_request:
            last_request = request_id
            try:
                check_station(server, session_id, token, view["stationId"], os_name, repo)
            except AgentError as error:
                if error.status == 401:
                    print("This pairing has ended. Run the agent again and use Pair a new agent in the game.")
                    return 1
                print(f"Could not send results: {error}. Click Check again in the game to retry.")
            print("\nWaiting for the next station...")
        sleep(poll_seconds)


def stop_command() -> str:
    python = "py" if platform.system() == "Windows" else "python3"
    return f"{python} scripts/toolchain_agent.py --stop"


def is_current_run(run_id: str) -> bool:
    try:
        return RUN_FILE.read_text().strip() == run_id
    except OSError:
        return False


def stop_background_agent() -> bool:
    """Tell a background agent to exit. True if one was registered."""
    try:
        RUN_FILE.unlink()
        return True
    except FileNotFoundError:
        return False


def start_in_background(server: str, paired: Dict, repo: Path, poll_seconds: float) -> None:
    """Hand the pairing to a detached copy of this agent so the terminal is free again."""
    run_id = secrets.token_hex(16)
    RUN_FILE.write_text(run_id)  # any older background agent sees this and exits
    detach: Dict = {"start_new_session": True}  # survives closing the terminal window
    if platform.system() == "Windows":
        detach = {"creationflags": subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP}
    with open(LOG_FILE, "a", encoding="utf-8") as log:
        child = subprocess.Popen(
            [sys.executable, str(Path(__file__).resolve()), "--serve-paired",
             "--server", server, "--repo", str(repo), "--poll-seconds", str(poll_seconds)],
            stdin=subprocess.PIPE, stdout=log, stderr=subprocess.STDOUT, **detach)
    # The token travels over a pipe, never on the command line or on disk.
    child.stdin.write(json.dumps({"runId": run_id, "sessionId": paired["sessionId"],
                                  "agentToken": paired["agentToken"]}).encode("utf-8"))
    child.stdin.close()


def serve_paired(server: str, repo: Path, poll_seconds: float) -> int:
    """The background agent: read the pairing from the parent, then serve until stopped."""
    sys.stdout.reconfigure(line_buffering=True)  # so the log file updates as it goes
    handoff = json.loads(sys.stdin.read())
    run_id = handoff["runId"]
    print(f"\n--- Toolchain Trail agent started {time.strftime('%Y-%m-%d %H:%M:%S')} ---")
    try:
        return serve(server, handoff["sessionId"], handoff["agentToken"], detect_os(), repo,
                     poll_seconds=poll_seconds, still_wanted=lambda: is_current_run(run_id))
    finally:
        if is_current_run(run_id):
            stop_background_agent()


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Pair with Toolchain Trail and verify stations as you play.")
    parser.add_argument("--server", default=os.environ.get("TOOLCHAIN_SERVER", DEFAULT_SERVER),
                        help=f"backend URL (default {DEFAULT_SERVER})")
    parser.add_argument("--repo", default=".", help="repository the git and build checks run in (default: current folder)")
    parser.add_argument("--poll-seconds", type=float,
                        default=float(os.environ.get("TOOLCHAIN_POLL_SECONDS", DEFAULT_POLL_SECONDS)),
                        help=f"how often to ask the server for the next station (default {DEFAULT_POLL_SECONDS:g})")
    parser.add_argument("--foreground", action="store_true",
                        help="keep the agent in this window (Ctrl+C stops it) instead of the background")
    parser.add_argument("--stop", action="store_true", help="stop the background agent")
    parser.add_argument("--serve-paired", action="store_true", help=argparse.SUPPRESS)  # used by the background copy
    args = parser.parse_args(argv)
    repo = Path(args.repo).resolve()

    if args.stop:
        print("Stopping the background agent." if stop_background_agent() else "No background agent is running.")
        return 0

    os_name = detect_os()
    try:
        server = require_safe_server(args.server)
        if args.serve_paired:
            return serve_paired(server, repo, args.poll_seconds)
        print(f"Toolchain Trail agent ({os_name}). Paste the pairing code from the game.")
        code = getpass.getpass("Pairing code (hidden): ").strip()
        if not code:
            raise AgentError("No pairing code entered.")

        paired = post_json(f"{server}/api/toolchain/pair", {"pairingCode": code})
        if args.foreground:
            stop_background_agent()  # one agent at a time
            print("Paired! Leave this window open while you play. Press Ctrl+C to stop the agent.")
            return serve(server, paired["sessionId"], paired["agentToken"], os_name, repo,
                         poll_seconds=args.poll_seconds)
        start_in_background(server, paired, repo, args.poll_seconds)
        print("Paired! The agent is now running in the background for the rest of Toolchain Trail.")
        print("Keep using this terminal: run your install commands here, then click Check again in the game.")
        print(f"The agent's messages go to {LOG_FILE}. To stop it: {stop_command()}")
        return 0
    except AgentError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2
    except (KeyboardInterrupt, EOFError):
        print("\nAgent stopped.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
