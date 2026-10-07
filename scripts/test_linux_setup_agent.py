import os
import platform
import re
import select
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

from linux_setup_agent import LiveFeedback, diagnose, feedback

SCRIPT = Path(__file__).with_name('linux_setup_agent.py')


class LinuxSetupTests(unittest.TestCase):
    def test_unknown_is_not_success(self):
        self.assertEqual(diagnose('an unfamiliar failure', True), [])

    def test_non_debian_never_gets_apt_venv_advice(self):
        advice = ' '.join(diagnose('ensurepip is not available', False))
        self.assertNotIn('sudo apt', advice)
        self.assertIn('exact Python version', advice)

    def test_debian_gets_venv_package(self):
        self.assertIn('python3-venv', ' '.join(diagnose('No module named venv', True)))

    def test_managed_python_uses_venv(self):
        self.assertIn('source venv/bin/activate', ' '.join(diagnose('externally-managed-environment', True)))

    def test_missing_activation_checks_directory(self):
        self.assertIn('pwd', ' '.join(diagnose('venv/bin/activate: No such file or directory', True)))

    def test_permission_is_not_blanket_sudo(self):
        self.assertIn('does not establish why', ' '.join(diagnose('Permission denied', True)))

    def test_lock_is_not_deleted(self):
        self.assertIn('Do not delete lock files', ' '.join(diagnose('Could not get lock', True)))

    def test_missing_tools_get_exact_package_advice(self):
        for error in ['bash: git: command not found', 'bash: line 1: git: command not found', 'sudo: git: command not found', 'command not found: git']:
            with self.subTest(error=error):
                advice = ' '.join(diagnose(error, True))
                self.assertIn('git is not available', advice)
                self.assertIn('sudo apt install git', advice)

    def test_non_debian_missing_tool_never_gets_apt(self):
        self.assertNotIn('sudo apt', ' '.join(diagnose('bash: ruby: command not found', False)))

    def test_python_and_pip_use_environment(self):
        self.assertIn('Use python3', ' '.join(diagnose('bash: python: command not found', True)))
        self.assertIn('python -m pip', ' '.join(diagnose('bash: pip: command not found', True)))

    def test_bad_cd_returns_to_actual_checkout_and_quotes_spaces(self):
        advice = ' '.join(diagnose('bash: cd: toolchian_trail: No such file or directory', True, Path('/tmp/student work/toolchain_trail')))
        self.assertIn("cd -- '/tmp/student work/toolchain_trail'", advice)

    def test_wrong_directory_for_dependency_install(self):
        for error in ['Could not locate Gemfile', "Could not open requirements file: No such file or directory: 'requirements.txt'", 'fatal: not a git repository']:
            with self.subTest(error=error):
                self.assertIn('cd -- /tmp/toolchain_trail', ' '.join(diagnose(error, True, Path('/tmp/toolchain_trail'))))

    def test_success_has_no_failure_message(self):
        self.assertEqual(feedback('git --version', 0, 'git version 2', True, Path('/tmp/project')), '')

    def test_yellow_feedback_includes_command_error_and_fix(self):
        result = feedback('git --version', 127, 'bash: git: command not found', True, Path('/tmp/project'), '/tmp/project', True)
        for expected in ['\033[33m', '\033[0m', 'Command: git --version', 'Error: bash: git: command not found', 'sudo apt install git', 'Folder: /tmp/project']:
            self.assertIn(expected, result)

    def test_unknown_error_is_visible_without_inventing_fix(self):
        result = feedback('thing', 3, 'unfamiliar failure', True, Path('/tmp/project'))
        self.assertIn('unfamiliar failure', result)
        self.assertIn('Unresolved:', result)
        self.assertNotIn('Change:', result)

    def test_diagnostic_does_not_replay_terminal_escapes(self):
        result = feedback('bad\033[2J', 1, '\033[31mPermission denied\033[0m', True, Path('/tmp/project'))
        self.assertNotIn('\033', result)
        self.assertIn('Permission denied', result)

    def test_frames_work_when_split_at_every_byte(self):
        monitor = LiveFeedback('test-token', True, Path('/tmp/project'), True)
        stream = b'bash: git: command not found\r\n\x1etest-token:127\0git --version\0/tmp/project\x1etest-token\x1f[linux-agent] $ '
        actual = b''.join(monitor.feed(bytes([byte])) for byte in stream)
        self.assertNotIn(b'test-token', actual)
        self.assertIn(b'\033[33m', actual)
        self.assertIn(b'Command: git --version', actual)
        self.assertTrue(actual.endswith(b'[linux-agent] $ '))

    def test_old_errors_do_not_leak_into_next_command(self):
        monitor = LiveFeedback('t', True, Path('/tmp/project'), False)
        monitor.feed(b'Permission denied\n\x1et:1\0first\0/tmp/project\x1et\x1f')
        result = monitor.feed(b'unknown failure\n\x1et:1\0second\0/tmp/project\x1et\x1f')
        self.assertNotIn(b'Access was denied', result)
        self.assertIn(b'Unresolved:', result)

    def test_output_buffer_is_bounded(self):
        monitor = LiveFeedback('t', True, Path('/tmp/project'), False)
        monitor.feed(b'x' * 100000)
        self.assertLessEqual(len(monitor.output), 65536)

    def test_saved_log_color_and_exit_code(self):
        with tempfile.TemporaryDirectory() as temporary:
            log = Path(temporary) / 'error.log'
            log.write_text('No module named venv')
            result = subprocess.run([sys.executable, str(SCRIPT), '--log', str(log), '--distro', 'debian', '--color', 'always'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn('\033[33m', result.stdout)
            self.assertIn('python3-venv', result.stdout)


@unittest.skipUnless(platform.system() == 'Linux', 'Live shell integration requires actual Linux')
class LinuxLiveTests(unittest.TestCase):
    """Exercise the real CLI, Bash, terminal output, and exit status without mocks."""

    def setUp(self):
        import pty
        self.temporary = tempfile.TemporaryDirectory(prefix='linux-agent-test-')
        self.project = Path(self.temporary.name) / 'student work' / 'toolchain_trail'
        (self.project / 'scripts').mkdir(parents=True)
        copied_script = self.project / 'scripts' / SCRIPT.name
        shutil.copyfile(SCRIPT, copied_script)
        self.reaped = False
        self.pid, self.master = pty.fork()
        if self.pid == 0:
            os.environ['TERM'] = 'xterm-256color'
            os.environ.pop('NO_COLOR', None)
            os.chdir('/')
            os.execv(sys.executable, [sys.executable, str(copied_script), '--watch'])
        self.read_prompt()

    def tearDown(self):
        if not self.reaped:
            os.write(self.master, b'exit\n')
            deadline = time.monotonic() + 2
            while time.monotonic() < deadline:
                child, _ = os.waitpid(self.pid, os.WNOHANG)
                if child:
                    self.reaped = True
                    break
                time.sleep(0.02)
            if not self.reaped:
                os.kill(self.pid, signal.SIGTERM)
                os.waitpid(self.pid, 0)
        os.close(self.master)
        self.temporary.cleanup()

    def read_prompt(self, timeout=15):
        output = b''
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            ready, _, _ = select.select([self.master], [], [], max(0, deadline - time.monotonic()))
            if ready:
                try:
                    data = os.read(self.master, 65536)
                except OSError:
                    break
                if not data:
                    break
                output += data
                if re.search(rb'\[linux-agent\] [^\r\n]*[#$] ', output):
                    return output.decode(errors='replace')
        self.fail(f'Shell prompt did not arrive. Output: {output!r}')

    def command(self, command):
        os.write(self.master, command.encode() + b'\n')
        return self.read_prompt()

    def test_project_cd_failure_and_recovery(self):
        result = self.command('pwd')
        self.assertIn(str(self.project), result)
        result = self.command('cd toolchian_trail')
        for expected in ['\033[33m', 'Command: cd toolchian_trail', 'No such file or directory', f"cd -- '{self.project}'"]:
            self.assertIn(expected, result)
        self.assertIn('STATUS=1', self.command('printf "STATUS=%s\\n" "$?"'))
        result = self.command('pwd')
        self.assertNotIn('Linux setup: command failed', result)
        self.assertNotIn('\033[33m', result)

    def test_real_activation_error_then_successful_venv(self):
        result = self.command('source venv/bin/activate')
        self.assertIn('Activation path was not found', result)
        self.assertIn('python3 -m venv venv', result)
        result = self.command('python3 -m venv --without-pip venv')
        self.assertNotIn('Linux setup: command failed', result)
        result = self.command('source venv/bin/activate')
        self.assertNotIn('Linux setup: command failed', result)
        result = self.command("python -c 'import sys; print(sys.prefix != sys.base_prefix)'")
        self.assertIn('True', result)

    def test_blank_line_does_not_repeat_failed_command(self):
        self.command('cd bluepritns_pages')
        self.assertNotIn('Linux setup: command failed', self.command(''))

    def test_multiline_command_is_identified(self):
        result = self.command("if true; then\ncd bluepritns_pages\nfi")
        self.assertIn('Command: if true;', result)
        self.assertIn('cd bluepritns_pages', result)
        self.assertIn('That folder does not exist', result)

    def test_path_breakage_does_not_break_agent(self):
        self.command('agent_saved_path=$PATH; PATH=/missing-linux-agent-bin')
        result = self.command('git --version')
        self.assertIn('Command: git --version', result)
        self.assertIn('sudo apt install git', result)
        self.assertIn('\033[33m', result)
        self.command('PATH=$agent_saved_path')
        self.assertNotIn('Linux setup: command failed', self.command('git --version'))

    def test_pipeline_and_unknown_error_and_no_execution_of_output(self):
        self.command('set -o pipefail')
        result = self.command('linux_agent_missing_tool | cat')
        self.assertIn('Command: linux_agent_missing_tool | cat', result)
        self.assertIn('linux_agent_missing_tool is not available', result)
        result = self.command("printf '%s\\n' 'unknown failure; touch DO_NOT_CREATE' >&2; false")
        self.assertIn('Unresolved:', result)
        self.assertFalse((self.project / 'DO_NOT_CREATE').exists())

    def test_interactive_input_and_interrupt_still_work(self):
        os.write(self.master, b'read -r -p "Type value: " agent_value; printf "VALUE=%s\\n" "$agent_value"\n')
        time.sleep(0.1)
        os.write(self.master, b'hello\n')
        self.assertIn('VALUE=hello', self.read_prompt())
        os.write(self.master, b'sleep 30\n')
        time.sleep(0.2)
        os.write(self.master, b'\x03')
        result = self.read_prompt()
        self.assertIn('exit 130', result)
        self.assertIn('still-here', self.command('echo still-here'))

    def test_shell_exit_status_is_propagated(self):
        os.write(self.master, b'exit 7\n')
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            child, status = os.waitpid(self.pid, os.WNOHANG)
            if child:
                self.reaped = True
                self.assertEqual(os.waitstatus_to_exitcode(status), 7)
                return
            time.sleep(0.05)
        self.fail('Agent did not exit with its Bash shell')

    def test_non_interactive_watch_fails_clearly(self):
        result = subprocess.run([sys.executable, str(SCRIPT), '--watch'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertIn('interactive terminal', result.stdout)


if __name__ == '__main__':
    unittest.main()
