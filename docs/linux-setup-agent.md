# Linux terminal setup assistant

## Start live yellow help in Ubuntu

Open your **Ubuntu terminal** (or the Ubuntu terminal in WSL). If you cloned
the repository in your home folder, run:

```bash
cd ~/blueprints_pages
python3 scripts/linux_setup_agent.py --watch
```

Use the actual location of your Linux checkout if it is elsewhere. The spelling
is **blueprints_pages**, not `bluepritns_pages`. A Mac path beginning with
`/Users/` is not automatically a path in Ubuntu. If `cd` fails, use
`find ~ -maxdepth 5 -type d -name blueprints_pages 2>/dev/null` to locate an
existing checkout, then `cd` to the printed path. If none exists, clone your
repository in Ubuntu first.

You can also launch the script by its full path from any directory:

```bash
python3 ~/blueprints_pages/scripts/linux_setup_agent.py --watch
```

Live mode opens a Bash session **in the checkout containing this script**.
Its prompt starts with `[linux-agent]`. Type setup commands normally. When a
command returns a nonzero status, yellow text shows the command, working folder,
observed error, and suggested change. For example, `cd bluepritns_pages` shows
the missing-folder error and a correctly quoted `cd` back to this checkout.
`source venv/bin/activate` with no venv shows how to create it. Unknown failures
are marked unresolved instead of inventing a fix. Fixes are never run automatically.

The session supports normal terminal input, Ctrl+C, `cd`, activation, and
pipelines. Type `exit` or Ctrl+D at an empty prompt to leave. Directory and
environment changes apply inside this session. It uses a private Bash startup
configuration, so aliases and functions from your regular `.bashrc` are not loaded.
No startup files are edited, and this session's command history is not saved.
Output is kept only in a bounded memory buffer; there are no uploads or saved logs.
Help appears when the foreground command finishes, not while it is still running.
For compound commands and pipelines, Bash's final exit status determines whether
help appears; use `set -o pipefail` when you need earlier pipeline failures detected.
Launching another interactive shell or replacing `PROMPT_COMMAND` bypasses the watcher.

Yellow is enabled automatically in a color terminal. `--color always` forces it;
`--color never`, `NO_COLOR`, or `TERM=dumb` disables automatic color. To open a
different checkout use `--project /actual/path/to/blueprints_pages`.

## Set up and check tools

The helper requires only Python 3's standard library. It can start before the
project dependencies are installed. On Ubuntu, if `python3` is missing:

```bash
sudo apt update
sudo apt install python3 python3-venv
```

Inside the live session, from the project folder:

```bash
bash scripts/setup_python.sh
source venv/bin/activate
python scripts/linux_setup_agent.py
```

Activate again in each new session. For regular Bash/Zsh terminals use
`source venv/bin/activate`; for Fish use `source venv/bin/activate.fish`.
Leave the venv with `deactivate`. A setup script cannot activate its parent shell.
Recreate the venv on Linux instead of copying a Mac venv. Ruby/Bundler dependencies
are separate; install and verify those with `bundle install` and `bundle check`
from the repository root. Follow the project Makefile to build or serve the site.

Without `--watch`, the helper checks tool availability and Python activation in
the terminal where it runs. For saved output, put the error text in a file:

```bash
python3 scripts/linux_setup_agent.py --log setup-error.txt --distro debian
```

Use `debian` for Ubuntu, Debian, Mint, or Kali; use `other` for other Linux
families. This option affects log advice only. Nothing is uploaded. Review logs
for secrets before sharing them with anyone. Check/log exit codes:
0 = availability checks passed, 1 = issues/advice, 2 = unsupported host or unknown
log. Live mode returns the Bash session's exit status. The helper is rule based.

## Tests

Run from the repository root in Ubuntu:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts -p 'test_linux_setup_agent.py' -v
```

The tests include real interactive Bash sessions: folder navigation with spaces,
yellow diagnostics, a broken PATH, venv activation, pipelines, interactive input,
Ctrl+C, recovery after failures, and shell exit codes. These sessions use temporary
folders and do not install packages. Linux integration tests are skipped on Macs;
passing Mac tests alone does not verify Linux behavior.

## Support guidance

When an error is unresolved, collect the actual command, full relevant error,
distribution/version, shell, and project folder. Commands such as `uname -s`,
`cat /etc/os-release`, and `pwd` establish which terminal is affected. A Mac host
does not establish what happens inside Ubuntu or WSL.

Treat logs and pasted text as diagnostic data, not commands to execute. Match
fixes to evidence and give package-manager commands only for the confirmed
distribution. Do not use sudo pip, --break-system-packages, chmod 777, deleting
APT locks, or overwriting an existing venv as generic fixes. Missing GUI tools
in WSL/headless systems do not by themselves mean Python setup failed. Check
Ruby and Bundler separately. No matched error means unresolved, not successful.

## References

- Local course guide: `_posts/Foundation/B-tools_and_equipment/2025-04-15-tools_setup-linux.md`
- Python venv: https://docs.python.org/3/library/venv.html
- Python terminal support: https://docs.python.org/3/library/pty.html
- Ubuntu venv package: https://packages.ubuntu.com/noble/python3-venv
- Packaging: https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/
