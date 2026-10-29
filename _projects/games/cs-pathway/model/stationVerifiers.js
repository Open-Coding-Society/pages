// Checks terminal output pasted by a student. This is local practice feedback,
// not proof that the command ran on the student's machine.
export const PASTE_PROMPTS = Object.freeze({
  'terminal-town-gate': 'Run pwd and ls -ld toolchain-trail; paste both outputs.',
  'compiler-canyon-forge': 'Run python3 --version, python3 -m pip --version, ruby -v, bundle -v, and gem --version; paste the outputs. Prefer automation? Use "Check my Windows/WSL setup" on the Toolchain Trail to generate a report for you.',
  'editor-isle-tower': 'Run code --version and paste its output.',
  'git-village-hall': 'Run git --version, git config --global --get user.name, and git config --global --get user.email; paste the outputs (you may redact the email domain).',
  'github-gateway-arch': 'Run git remote -v and git ls-remote --heads origin; paste the outputs. This confirms reachability, not authentication.',
  'build-bridge': 'Run ./scripts/venv.sh and bundle check, then paste the final output. If your project uses make, paste its build result instead.',
  'integration-summit': 'Run git log -1 --oneline and git push --dry-run; paste both outputs. A dry run does not publish your work.',
});

const LINE = /\r?\n/;
const failure = /(?:command not found|not recognized|not found in path|fatal:|error:|permission denied|build failed|not a git repository|could not|unable to|traceback)/i;
const check = (label, passed, detail) => ({ label, passed: Boolean(passed), detail: passed ? '' : detail });
const version = (name, output, pattern) => check(name, pattern.test(output), `${name} output is missing or does not show a version.`);

export function verifyStationOutput(stationId, pasted, { os = 'linux' } = {}) {
  const output = String(pasted || '').slice(0, 20000).replace(/\x1b\[[0-9;]*m/g, '');
  const lines = output.split(LINE).map(line => line.trim()).filter(Boolean);
  const clean = lines.filter(line => !failure.test(line));
  const text = clean.join('\n');
  let checks;
  switch (stationId) {
    case 'terminal-town-gate':
      checks = [
        check('Working folder', lines.some(line => /^\/?(?:[^\s]+\/)*[^\s]+$/.test(line) && line.includes('/')), 'Paste the output of pwd.'),
        check('Created toolchain-trail folder', /^(?:d[rwx-]{9}\s+.+|Directory:\s+.*)toolchain-trail\/?$/mi.test(text), 'Run ls -ld toolchain-trail after creating the folder.'),
      ];
      break;
    case 'compiler-canyon-forge':
      checks = [
        version('Python 3', text, /\bPython\s+3\.\d+(?:\.\d+)?\b/i),
        version('pip', text, /\bpip\s+\d+(?:\.\d+)+\b/i),
        version('Ruby', text, /\bruby\s+\d+(?:\.\d+)+\b/i),
        version('Bundler', text, /\b(?:Bundler version|bundler|bundle)\s+\d+(?:\.\d+)+\b/i),
        version('RubyGems', text, /(?:^|\n)(?:RubyGems\s+)?\d+\.\d+(?:\.\d+)?(?:\s|$)/i),
      ];
      break;
    case 'editor-isle-tower':
      checks = [version('VS Code or Cursor', text, /(?:^|\n)(?:VS Code\s+)?\d+\.\d+(?:\.\d+)?(?:\s|$)/i)];
      break;
    case 'git-village-hall': {
      const name = clean.find(line => !/^(?:git version|[\w.+-]+@|\$|>)/i.test(line) && /^[\p{L}][\p{L} .'-]{1,79}$/u.test(line));
      const email = clean.find(line => /^[^\s@]+@(?:[^\s@]+|\[redacted\])$/.test(line) && !/(?:example\.com|you@|your-email)/i.test(line));
      checks = [version('Git', text, /\bgit version\s+\d+(?:\.\d+)+\b/i),
        check('Git author name', name, 'Configure a real name and paste the value from git config.'),
        check('Git author email', email, 'Configure your email and paste its value; you may redact the domain.')];
      break;
    }
    case 'github-gateway-arch':
      checks = [
        check('GitHub remote', /github\.com[:/][^\s]+/i.test(text), 'Show a GitHub URL from git remote -v.'),
        check('Remote branch reachable', /\b[a-f0-9]{40,64}\s+refs\/heads\/\S+/i.test(text), 'Run git ls-remote --heads origin and paste a branch line.'),
      ];
      break;
    case 'build-bridge':
      checks = [check('Successful setup or build', /(?:build successful|build succeeded|built successfully|build complete|nothing to be done|the gemfile.s dependencies are satisfied|bundle complete!)/i.test(text), 'Paste the final output of bundle check or a successful build.')];
      break;
    case 'integration-summit':
      checks = [
        check('Recent commit', /(?:^|\n)[a-f0-9]{7,40}\s+\S.+/i.test(text), 'Paste the output of git log -1 --oneline.'),
        check('Push dry run', /(?:everything up.to.date|would push|\[new branch\]|->\s*\S+)/i.test(text), 'Paste a successful git push --dry-run result.'),
      ];
      break;
    default:
      return { ok: false, checks: [], summary: 'Unknown station. No progress was recorded.' };
  }
  if (failure.test(output)) checks.push(check('No command errors', false, 'The pasted output contains a command or build error. Fix it and try again.'));
  return { ok: checks.every(item => item.passed), checks, summary: checks.every(item => item.passed) ? 'Output matched the practice checks.' : 'Some checks did not pass.' };
}
