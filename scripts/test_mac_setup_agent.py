"""Tests for mac_setup_agent.py --check and mac_setup_checks.py.

Run from the repository root:
    python3 -m unittest discover -s scripts -p 'test_mac_setup_agent.py' -v
"""
import io
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))

import mac_setup_agent  # noqa: E402
import mac_setup_checks  # noqa: E402

HEALTHY_OUTPUT = {
    "xcode-select": (0, "/Library/Developer/CommandLineTools\n"),
    "brew": (0, "Homebrew 4.4.0\n"),
    "git --version": (0, "git version 2.46.0\n"),
    "git config --global user.name": (0, "Ada Lovelace\n"),
    "git config --global user.email": (0, "ada@example.org\n"),
    "python3 --version": (0, "Python 3.12.4\n"),
    "python3 -m pip --version": (0, "pip 24.2 from /opt/homebrew/lib (python 3.12)\n"),
    "python3 -c import venv": (0, ""),
    "ruby": (0, "ruby 3.3.4 (2024-07-09 revision be1089c8ec) [arm64-darwin23]\n"),
    "bundle": (0, "4.0.7\n"),
    "java": (0, 'openjdk version "21.0.4" 2024-07-16\n'),
    "code": (0, "1.92.0\nabc123\narm64\n"),
}


def fake_runner(overrides=None):
    outputs = {**HEALTHY_OUTPUT, **(overrides or {})}

    def run(command):
        joined = " ".join(command)
        for key in sorted(outputs, key=len, reverse=True):
            if joined == key or joined.startswith(key + " ") or command[0] == key:
                return outputs[key]
        raise AssertionError(f"unexpected command: {joined}")

    return run


def make_project(with_repo=True, with_venv=True):
    root = Path(tempfile.mkdtemp())
    if with_repo:
        (root / ".git").mkdir()
        (root / "_config.yml").write_text("title: test\n")
    if with_venv:
        (root / "venv" / "bin").mkdir(parents=True)
        (root / "venv" / "bin" / "python3").write_text("")
    return root


class MacSetupChecksTest(unittest.TestCase):
    def test_healthy_mac_passes_every_check(self):
        results = mac_setup_checks.run_checks(make_project(), runner=fake_runner())
        self.assertTrue(all(result.passed for result in results), [r for r in results if not r.passed])
        self.assertEqual(len(results), len(mac_setup_checks.COMMAND_CHECKS) + 2)

    def test_missing_tool_fails_with_its_fix(self):
        results = mac_setup_checks.run_checks(
            make_project(), runner=fake_runner({"brew": (127, "command not found: brew")}))
        homebrew = next(result for result in results if result.check_id == "homebrew")
        self.assertFalse(homebrew.passed)
        self.assertIn("brew.sh", homebrew.fix)

    def test_macos_java_stub_without_a_runtime_fails(self):
        results = mac_setup_checks.run_checks(
            make_project(), runner=fake_runner({"java": (1, "The operation couldn't be completed. Unable to locate a Java Runtime.")}))
        self.assertFalse(next(r for r in results if r.check_id == "java").passed)

    def test_unset_git_identity_fails(self):
        results = mac_setup_checks.run_checks(
            make_project(), runner=fake_runner({"git config --global user.email": (1, "")}))
        self.assertFalse(next(r for r in results if r.check_id == "git-email").passed)

    def test_old_bundler_version_format_passes(self):
        results = mac_setup_checks.run_checks(
            make_project(), runner=fake_runner({"bundle": (0, "Bundler version 2.5.16\n")}))
        self.assertTrue(next(r for r in results if r.check_id == "bundler").passed)

    def test_project_checks_need_repo_and_venv(self):
        results = mac_setup_checks.run_checks(make_project(with_repo=False, with_venv=False), runner=fake_runner())
        failed = {result.check_id for result in results if not result.passed}
        self.assertEqual(failed, {"pages-repo", "project-venv"})

    def test_missing_command_is_a_failed_check_not_a_crash(self):
        code, output = mac_setup_checks.run_command(["definitely-not-a-real-command-xyz"])
        self.assertEqual(code, 127)
        self.assertIn("command not found", output)

    def test_report_has_markers_summary_and_fix_for_failures(self):
        results = mac_setup_checks.run_checks(
            make_project(), runner=fake_runner({"code": (127, "command not found: code")}))
        report = mac_setup_checks.format_report(results).splitlines()
        self.assertEqual(report[0], mac_setup_checks.REPORT_START)
        self.assertEqual(report[-1], mac_setup_checks.REPORT_END)
        self.assertIn("PASS homebrew | Homebrew", report)
        self.assertTrue(any(line.startswith("FAIL vscode | VS Code code command | In VS Code") for line in report))
        self.assertIn("SUMMARY 13/14 passed", report)

    def test_fix_hints_never_contain_the_field_separator(self):
        for check in mac_setup_checks.COMMAND_CHECKS:
            self.assertNotIn("|", check.fix, check.check_id)


class MacSetupAgentCheckModeTest(unittest.TestCase):
    def run_check_mode(self, system, runner):
        output = io.StringIO()
        with mock.patch.object(mac_setup_agent.platform, "system", return_value=system), \
                mock.patch.object(mac_setup_agent, "run_checks",
                                  side_effect=lambda project: mac_setup_checks.run_checks(project, runner=runner)), \
                redirect_stdout(output):
            code = mac_setup_agent.run_setup_check(make_project())
        return code, output.getvalue()

    def test_exit_code_zero_when_everything_passes(self):
        code, output = self.run_check_mode("Darwin", fake_runner())
        self.assertEqual(code, 0)
        self.assertIn(mac_setup_checks.REPORT_START, output)

    def test_exit_code_one_when_a_check_fails(self):
        code, _ = self.run_check_mode("Darwin", fake_runner({"brew": (127, "")}))
        self.assertEqual(code, 1)

    def test_refuses_to_run_off_macos(self):
        code, output = self.run_check_mode("Linux", fake_runner())
        self.assertEqual(code, 2)
        self.assertIn("linux_setup_agent.py", output)
        self.assertNotIn(mac_setup_checks.REPORT_START, output)


class MacSetupAgentDiagnosisTest(unittest.TestCase):
    """Rules must match both zsh errors (typed commands) and bash errors (setup scripts)."""

    def assert_fix(self, output, expected_fix_text, command="bash scripts/activate_macos.sh"):
        result = mac_setup_agent.diagnose(command, 1, output)
        self.assertIsNotNone(result, output)
        self.assertIn(expected_fix_text, result)

    def test_missing_homebrew_in_zsh_and_inside_a_bash_script(self):
        self.assert_fix("zsh: command not found: brew", "brew.sh", command="brew update")
        self.assert_fix("scripts/activate_macos.sh: line 20: brew: command not found", "brew.sh")
        self.assert_fix("Homebrew isn't installed. Install it from https://brew.sh, open a new Terminal, then run this script again.", "brew.sh")

    def test_script_without_execute_permission_suggests_bash(self):
        self.assert_fix("zsh: permission denied: ./scripts/activate_macos.sh", "bash scripts/",
                        command="./scripts/activate_macos.sh")

    def test_gem_install_into_system_ruby_suggests_reloading_shell(self):
        self.assert_fix("You don't have write permissions for the /Library/Ruby/Gems/2.6.0 directory.",
                        "source ~/.zshrc")

    def test_unknown_error_is_not_diagnosed(self):
        self.assertIsNone(mac_setup_agent.diagnose("bash scripts/activate_macos.sh", 1, "something unexpected"))


if __name__ == "__main__":
    unittest.main()
