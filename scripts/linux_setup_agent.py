#!/usr/bin/env python3
"""Local Linux setup checks and an opt-in live Bash companion. Fixes are advice only.

With --check --report <upload-url> (the CS Pathway game shows the exact command), the
report is also saved to setup-report.md in the project and sent to that URL, so the
game can show it without copy and paste."""
import argparse
import time
import urllib.error
import urllib.request
import os
import platform
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
import uuid
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ANSI = re.compile(r'\x1b\][^\x07]*(?:\x07|\x1b\\)|\x1b\[[0-?]*[ -/]*[@-~]')
REPORT_VERSION = 1
REPORT_FILE_NAME = 'setup-report.md'
# Same rule as verifyToolsTerminal.sh: never send a report over plain HTTP to another host.
UPLOAD_URL = re.compile(r'^(?:https://|http://localhost:|http://127\.0\.0\.1:)\S+$')


def plain(text):
    """Do not replay terminal control sequences inside diagnostic messages."""
    return ''.join(char for char in ANSI.sub('', text) if char.isprintable() or char in '\n\t')


def highlighted(text, color):
    return '\033[33m' + text + '\033[0m' if color else text


def diagnose(log, debian, project=PROJECT_ROOT):
    """Return evidence-matched advice; absence of matches is not success."""
    log = plain(log)
    lower = log.lower()
    advice = []
    folder = shlex.quote(str(project))
    if re.search(r'\bcd:.*(?:no such file or directory|not a directory)', lower):
        advice.append(f'That folder does not exist at the typed path. Return to this checkout with: cd -- {folder}. The repository name is blueprints_pages, not bluepritns_pages. Use pwd to verify your location.')
    if "externally-managed-environment" in lower:
        advice.append("System Python rejected installation. From the project folder: python3 -m venv venv; source venv/bin/activate; python -m pip install -r requirements.txt. Do not use sudo pip or --break-system-packages.")
    if "ensurepip is not available" in lower or "no module named venv" in lower:
        advice.append("Python venv support is missing. " + (
            "Run sudo apt update then sudo apt install python3-venv for the distribution Python; custom Python versions need matching venv support. Retry python3 -m venv venv."
            if debian else "Install venv support for your exact Python version using your distribution documentation; then retry python3 -m venv venv."))
    if "activate" in lower and "no such file or directory" in lower:
        advice.append(f"Activation path was not found. Run cd -- {folder}, then check pwd and ls venv/bin/activate. If venv does not exist, run python3 -m venv venv. Bash/zsh: source venv/bin/activate. Fish: source venv/bin/activate.fish.")
    if "no module named pip" in lower:
        advice.append('This Python interpreter has no pip. Activate the project venv with source venv/bin/activate, then run python -m ensurepip --upgrade and python -m pip --version. If venv is missing, create it with python3 -m venv venv first.')
    if "permission denied" in lower:
        advice.append("Access was denied; the log alone does not establish why. Check ls -ld on the named path and confirm you own the project. Do not apply blanket sudo or chmod 777.")
    if "could not get lock" in lower or "unable to acquire the dpkg" in lower:
        advice.append("A package-manager lock could not be acquired. Check whether another updater is running and let it finish. Do not delete lock files.")
    if "temporary failure resolving" in lower or "could not resolve host" in lower:
        advice.append("Name resolution failed. Check network connectivity and DNS for the hostname in the error, then retry the original command.")
    missing = re.search(r'(?:^|\n)(?:[^\n]*?: )?([\w.+-]+): command not found\b|command not found: ([\w.+-]+)|sudo: ([\w.+-]+): command not found', log)
    if missing:
        name = next(group for group in missing.groups() if group)
        packages = {'python3': 'python3 python3-venv', 'git': 'git', 'ruby': 'ruby-full', 'gem': 'ruby-full', 'bundle': 'ruby-bundler', 'bundler': 'ruby-bundler', 'make': 'build-essential', 'gcc': 'build-essential', 'java': 'default-jdk', 'javac': 'default-jdk', 'curl': 'curl', 'wget': 'wget', 'unzip': 'unzip'}
        fix = f'Check command -v {name} and your PATH.'
        if name == 'python':
            fix = 'Use python3 before activation, or source venv/bin/activate to make python refer to the project environment.'
        elif name in {'pip', 'pip3'}:
            fix = 'Run source venv/bin/activate, then use python -m pip instead. If venv is missing, run python3 -m venv venv first.'
        elif name == 'code':
            fix += ' On Ubuntu install VS Code from its official .deb package; in WSL install VS Code on Windows with the WSL extension, then reopen the Ubuntu terminal.'
        elif debian and name in packages:
            fix += f' If it is not installed on Ubuntu/Debian, run sudo apt update && sudo apt install {packages[name]}.'
        advice.append(f'{name} is not available in this shell. {fix}')
    elif 'command not found' in lower:
        advice.append('A command is missing from PATH. Read its name in the error and run command -v with that name. Use python3 before activating the project venv.')
    if "could not find gem" in lower or "bundler::gemnotfound" in lower:
        advice.append("Bundler cannot find a required gem. From the folder containing Gemfile, run bundle install and then bundle check. Python venv does not install Ruby gems.")
    if 'could not locate gemfile' in lower or ('requirements.txt' in lower and 'no such file or directory' in lower) or 'not a git repository' in lower:
        advice.append(f'This command needs the project folder. Run cd -- {folder}, verify with pwd and ls, then retry the command.')
    if 'dpkg was interrupted' in lower:
        advice.append('A previous package configuration was interrupted. On Ubuntu/Debian run sudo dpkg --configure -a, then retry the package installation.' if debian else 'A previous dpkg configuration was interrupted. Check the package manager instructions for this distribution before retrying.')
    if 'unable to locate package' in lower:
        advice.append('APT cannot find the named package. On Ubuntu/Debian run sudo apt update, then check the package spelling and availability with apt search followed by that package name.' if debian else 'The package manager cannot find the named package. Check its name and enabled repositories for this distribution.')
    if 'please tell me who you are' in lower:
        advice.append('Git needs your author identity. Set git config user.name "Your Name" and git config user.email "your-email@example.com" in this repository, replacing both placeholders with your own details.')
    return advice


def feedback(command, exit_code, log, debian, project, cwd='', color=False):
    """Display observed evidence separately from suggested changes."""
    if exit_code == 0 or not command.strip():
        return ''
    lines = [line.strip() for line in plain(log).splitlines() if line.strip() and '[linux-agent] ' not in line]
    errors = [line for line in lines if re.search(r'error|not found|no such|denied|unable|could not|failed|no module|not a directory', line, re.I)]
    detail = '\n       '.join((errors or lines)[-3:])[-1600:] or 'The command returned a failure status without terminal output.'
    advice = diagnose('\n'.join(lines), debian, project)
    message = f'Linux setup: command failed (exit {exit_code})\nCommand: {plain(command).strip()}\n'
    if cwd:
        message += f'Folder: {plain(cwd)}\n'
    message += f'Error: {detail}\n'
    message += '\n'.join('Change: ' + item for item in advice) if advice else 'Unresolved: no known fix matched. Check the error above and the command spelling; share the exact command and error for further help.'
    return highlighted(message, color) + '\n'


class LiveFeedback:
    """Separate shell prompt frames from output, keeping only a bounded memory buffer."""

    def __init__(self, token, debian, project, color):
        self.start = b'\x1e' + token.encode() + b':'
        self.end = b'\x1e' + token.encode() + b'\x1f'
        self.pending = b''
        self.output = b''
        self.debian, self.project, self.color = debian, project, color

    def remember(self, data):
        self.output = (self.output + data)[-65536:]
        return data

    def feed(self, data):
        self.pending += data
        visible = b''
        while self.pending:
            start = self.pending.find(self.start)
            if start < 0:
                # Retain only an actual partial marker, so prompts appear immediately.
                tail = self.pending.rfind(b'\x1e')
                keep = tail if tail >= 0 and self.start.startswith(self.pending[tail:]) else len(self.pending)
                visible += self.remember(self.pending[:keep])
                self.pending = self.pending[keep:]
                break
            visible += self.remember(self.pending[:start])
            self.pending = self.pending[start:]
            end = self.pending.find(self.end, len(self.start))
            if end < 0:
                break
            frame = self.pending[len(self.start):end].split(b'\0', 2)
            self.pending = self.pending[end + len(self.end):]
            if len(frame) == 3 and frame[0].isdigit():
                status, command, cwd = [item.decode(errors='replace').strip() for item in frame]
                note = feedback(command, int(status), self.output.decode(errors='replace'), self.debian, self.project, cwd, self.color)
                visible += note.replace('\n', '\r\n').encode()
                self.output = b''
        return visible


def watch(project, debian, color):
    """Run typed commands in a real PTY; never evaluate output or suggested fixes."""
    import errno
    import fcntl
    import pty
    import select
    import signal
    import termios
    import tty

    bash = shutil.which('bash')
    if not bash or not sys.stdin.isatty() or not sys.stdout.isatty():
        print(highlighted('CHECK: --watch needs Bash and an interactive terminal. Open Ubuntu/WSL Terminal and rerun this command.', color))
        return 2
    token = uuid.uuid4().hex
    monitor = LiveFeedback(token, debian, project, color)
    # A private Bash avoids modifying startup files or saving captured commands.
    # History supplies the whole entered command, including pipelines and multiline input.
    rc = r'''
HISTFILE=/dev/null
HISTSIZE=1000
HISTCONTROL=
HISTIGNORE=
set -o history
PS1='[linux-agent] \w\$ '
_linux_agent_prompt() {
    local agent_status=$? agent_command='' HISTTIMEFORMAT=''
    if [[ ${_linux_agent_history-} != "$HISTCMD" ]]; then
        if [[ -n ${_linux_agent_history-} ]]; then
            agent_command=$(builtin history 1)
            if [[ $agent_command =~ ^[[:space:]]*[0-9]+[[:space:]]+(.*)$ ]]; then
                agent_command=${BASH_REMATCH[1]}
            fi
        fi
        _linux_agent_history=$HISTCMD
    fi
    builtin printf '\036TOKEN:%s\0%s\0%s\036TOKEN\037' "$agent_status" "$agent_command" "$PWD"
    return "$agent_status"
}
PROMPT_COMMAND=_linux_agent_prompt
'''.replace('TOKEN', token)
    print(f'Live Linux setup help is on. Project: {project}\nType your setup commands here. Yellow text explains failures. Type exit to leave.', flush=True)
    with tempfile.TemporaryDirectory(prefix='linux-setup-agent-') as temporary:
        rcfile = Path(temporary) / 'bashrc'
        rcfile.write_text(rc)
        saved_terminal = termios.tcgetattr(0)
        pid, master = pty.fork()
        if pid == 0:
            try:
                os.chdir(project)
                os.execv(bash, [bash, '--noprofile', '--rcfile', str(rcfile), '-i'])
            except OSError as exc:
                print(f'Could not start Bash in {project}: {exc}', file=sys.stderr, flush=True)
                os._exit(2)

        def resize(*_):
            fcntl.ioctl(master, termios.TIOCSWINSZ, fcntl.ioctl(0, termios.TIOCGWINSZ, b'\0' * 8))

        previous_resize = signal.signal(signal.SIGWINCH, resize)
        try:
            resize()
            tty.setraw(0)
            while True:
                ready, _, _ = select.select([0, master], [], [])
                if master in ready:
                    try:
                        data = os.read(master, 4096)
                    except OSError as exc:
                        if exc.errno != errno.EIO:
                            raise
                        break
                    if not data:
                        break
                    sys.stdout.buffer.write(monitor.feed(data))
                    sys.stdout.buffer.flush()
                if 0 in ready:
                    data = os.read(0, 4096)
                    if not data:
                        break
                    os.write(master, data)
        finally:
            termios.tcsetattr(0, termios.TCSADRAIN, saved_terminal)
            signal.signal(signal.SIGWINCH, previous_resize)
            os.close(master)
        _, status = os.waitpid(pid, 0)
    return os.waitstatus_to_exitcode(status)


def probe(command):
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=10)
        output = (result.stdout or result.stderr).strip().splitlines()
        return result.returncode == 0, output[0][:240] if output else "No version output"
    except (OSError, subprocess.TimeoutExpired) as exc:
        return False, str(exc)


def is_wsl():
    """Return True when the Linux agent is running inside Windows Subsystem for Linux."""
    if os.environ.get('WSL_DISTRO_NAME') or os.environ.get('WSL_INTEROP'):
        return True
    try:
        return 'microsoft' in Path('/proc/version').read_text(errors='replace').lower()
    except OSError:
        return False


def _report_check(check_id, label, ok, fix):
    return {'id': check_id, 'label': label, 'passed': bool(ok), 'fix': fix}


def collect_setup_checks(project, debian):
    """Run the read-only checks used by the Toolchain Trail setup panel."""
    package_prefix = 'sudo apt update && sudo apt install' if debian else 'your distribution package manager to install'
    command_checks = [
        ('git', 'Git', ['git', '--version'], r'git version \d', f'Run: {package_prefix} git'),
        ('git-name', 'Git user.name set', ['git', 'config', '--global', 'user.name'], r'\S', 'Run: git config --global user.name "Your Name"'),
        ('git-email', 'Git user.email set', ['git', 'config', '--global', 'user.email'], r'^[^\s@]+@[^\s@]+$', 'Run: git config --global user.email "you@example.com"'),
        ('python3', 'Python 3', ['python3', '--version'], r'Python 3\.\d+', f'Run: {package_prefix} python3'),
        ('pip', 'pip', ['python3', '-m', 'pip', '--version'], r'pip \d', f'Run: {package_prefix} python3-pip'),
        ('ruby', 'Ruby', ['ruby', '--version'], r'ruby \d', f'Run: {package_prefix} ruby-full'),
        ('rubygems', 'RubyGems', ['gem', '--version'], r'^\d+\.\d+', f'Run: {package_prefix} ruby-full'),
        ('bundler', 'Bundler', ['bundle', '--version'], r'(?:Bundler version )?\d+\.\d+', 'Run: gem install bundler'),
        ('java', 'Java', ['java', '-version'], r'version "?\d', f'Run: {package_prefix} default-jdk'),
        ('vscode', 'VS Code code command', ['code', '--version'], r'^\d+\.\d+', 'Install VS Code and its command-line launcher. In WSL, install VS Code on Windows with the WSL extension.'),
    ]
    results = []
    for check_id, label, command, pattern, fix in command_checks:
        executable = shutil.which(command[0])
        ok, detail = probe([executable, *command[1:]]) if executable else (False, 'Not found in PATH')
        passed = ok and bool(re.search(pattern, detail, re.IGNORECASE | re.MULTILINE))
        results.append(_report_check(check_id, label, passed, fix))

    venv_ok = (project / 'venv' / 'bin' / 'python3').exists()
    results.extend([
        _report_check(
            'pages-repo',
            'Pages repository cloned',
            (project / '.git').is_dir() and (project / '_config.yml').is_file(),
            'Clone your pages repository and run this command from inside it.',
        ),
        _report_check(
            'project-venv',
            'Project venv created',
            venv_ok,
            'From the project folder run: ./scripts/venv.sh',
        ),
    ])
    return results


def format_setup_report(results, system, started_at='', duration_seconds=None):
    """Format a stable report that the Toolchain Trail can parse after pasting.

    The Summary:/Overall: lines match verifyToolsTerminal.sh, because Spring reads
    them when the report is uploaded. This agent has no warnings, so warned is 0."""
    system = system.upper()
    lines = [f'=== {system} SETUP CHECK v{REPORT_VERSION} ===']
    if started_at:
        lines.append(f'Started: {started_at}')
    for result in results:
        if result['passed']:
            lines.append(f"PASS {result['id']} | {result['label']}")
        else:
            lines.append(f"FAIL {result['id']} | {result['label']} | {result['fix']}")
    passed = sum(1 for result in results if result['passed'])
    failed = len(results) - passed
    if duration_seconds is not None:
        lines.append(f"Duration: {duration_seconds} second{'' if duration_seconds == 1 else 's'}")
    lines.append(f'Summary: {passed} passed, 0 warned, {failed} failed')
    lines.append(f"Overall: {'FAIL' if failed else 'PASS'}")
    lines.append(f'=== END {system} SETUP CHECK ===')
    return '\n'.join(lines)


def run_setup_check(project, debian, system):
    """Time the checks and return the formatted report plus whether every check passed."""
    started_at = datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %Z')
    start = time.monotonic()
    results = collect_setup_checks(project, debian)
    duration_seconds = round(time.monotonic() - start)
    report = format_setup_report(results, system, started_at, duration_seconds)
    return report, all(result['passed'] for result in results)


def write_report_file(report, project):
    report_file = project / REPORT_FILE_NAME
    created = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        report_file.write_text(f'# Setup report\n\nCreated {created} by scripts/linux_setup_agent.py\n\n```text\n{report}\n```\n')
    except OSError as exc:
        print(f'Could not write {report_file}: {exc}', file=sys.stderr)
        return
    print(f'Saved these results to {report_file}')


def upload_report(report, upload_url):
    request = urllib.request.Request(
        upload_url,
        data=report.encode(),
        method='POST',
        headers={'Content-Type': 'text/plain'},
    )
    try:
        with urllib.request.urlopen(request, timeout=20):
            pass
    except (urllib.error.URLError, OSError) as exc:
        print(f'Could not send the results ({exc}). If the code expired, copy the check command from the game again, or paste the results into the game.', file=sys.stderr)
        return False
    print('Sent these results to the game. Look at the setup panel in your browser.')
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--log', type=Path, help='Analyze a saved terminal error locally')
    mode.add_argument('--watch', action='store_true', help='Open live Bash help in this project (Linux/WSL only)')
    mode.add_argument('--check', action='store_true', help='Print a setup report for the Toolchain Trail game')
    parser.add_argument('--report', metavar='UPLOAD_URL', help='With --check: save the report to setup-report.md and send it to the game')
    parser.add_argument('--project', type=Path, default=PROJECT_ROOT, help='Project folder; defaults to the checkout containing this script')
    parser.add_argument('--color', choices=['auto', 'always', 'never'], default='auto', help='Yellow diagnostic text (default: auto)')
    parser.add_argument('--distro', choices=['debian', 'other'], help='Target Linux family for saved logs; useful when analyzing on a Mac')
    args = parser.parse_args()
    project = args.project.expanduser().resolve()
    color = args.color == 'always' or (args.color == 'auto' and sys.stdout.isatty() and 'NO_COLOR' not in os.environ and os.environ.get('TERM') != 'dumb')
    if args.report and not args.check:
        parser.error('--report is only used with --check')
    if args.report and not UPLOAD_URL.match(args.report):
        parser.error(f"'{args.report}' is not an upload URL; copy the full command from the game")
    if args.distro and not args.log:
        parser.error('--distro is for saved --log output; live checks detect the Linux distribution')
    is_linux = platform.system() == 'Linux'
    try:
        info = platform.freedesktop_os_release() if is_linux else {}
    except (OSError, AttributeError):
        info = {}
    family = (info.get('ID', '') + ' ' + info.get('ID_LIKE', '')).split()
    debian = args.distro == 'debian' or (args.distro is None and bool(set(family) & {'debian', 'ubuntu', 'linuxmint', 'kali'}))
    print('Linux setup helper — local, rule-based feedback; no AI service. Results are only uploaded with --report.')
    print('Host:', info.get('PRETTY_NAME', platform.system()))
    if args.log:
        try:
            log = args.log.read_text(errors='replace')
        except OSError as exc:
            parser.error(str(exc))
        advice = diagnose(log, debian, project)
        for item in advice:
            print(highlighted('Possible cause / next check: ' + item, color))
        if not advice:
            print(highlighted('Unresolved: no known error pattern matched. Supply the exact command, full error, Linux distribution, and shell to your assistant. This does not establish success.', color))
        return 1 if advice else 2
    if not is_linux:
        print(highlighted('Linux system checks skipped. Open Ubuntu or WSL, cd to your Linux blueprints_pages checkout, and run python3 scripts/linux_setup_agent.py --watch. Use --log with --distro to analyze saved Linux output here.', color))
        return 2
    if not project.is_dir():
        print(highlighted(f'CHECK: Project folder does not exist: {project}. Check the spelling (blueprints_pages) and pass --project /actual/path/to/blueprints_pages.', color))
        return 2
    if args.watch:
        return watch(project, debian, color)
    if args.check:
        system = 'WINDOWS' if is_wsl() else 'LINUX'
        report, all_passed = run_setup_check(project, debian, system)
        print(report)
        if args.report:
            print()
            write_report_file(report, project)
            upload_report(report, args.report)
        return 0 if all_passed else 1
    print(f'Project: {project}\nEnter it with: cd -- {shlex.quote(str(project))}')
    print('For help after each failed command: python3 scripts/linux_setup_agent.py --watch')
    failed = False
    for name, flag in [('python3', '--version'), ('git', '--version'), ('ruby', '--version'), ('gem', '--version'), ('bundle', '--version'), ('make', '--version')]:
        executable = shutil.which(name)
        ok, detail = probe([executable, flag]) if executable else (False, 'Not found in PATH')
        print(highlighted(('OK' if ok else 'CHECK') + ': ' + name + ': ' + detail, color and not ok))
        if not executable:
            for item in diagnose(f'{name}: command not found', debian, project):
                print(highlighted('Change: ' + item, color))
        failed |= not ok
    print('Python interpreter:', sys.executable)
    active = sys.prefix != sys.base_prefix
    print('OK: running inside a venv' if active else highlighted('CHECK: not running inside a venv. In the project folder, create it once with python3 -m venv venv, then source venv/bin/activate and rerun with python.', color))
    failed |= not active
    ok, detail = probe([sys.executable, '-m', 'pip', '--version'])
    print(highlighted(('OK' if ok else 'CHECK') + ': pip: ' + detail, color and not ok))
    failed |= not ok
    print('These checks cover tool availability, not a complete site build. Verify dependencies with python -m pip check and bundle check, then follow the project Makefile.')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
