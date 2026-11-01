// Checks terminal output pasted by a student. This is local practice feedback,
// not proof that the command ran on the student's machine.
export const PASTE_PROMPTS = Object.freeze({
  'terminal-town-gate': 'Inside the pages repo you cloned into opencs, run pwd and paste its output.',
  'compiler-canyon-forge': 'Run python3 --version, python3 -m pip --version, ruby -v, bundle -v, and gem --version; paste the outputs. Prefer automation? Use "Check my Windows/WSL setup" on the Toolchain Trail to generate a report for you.',
  'editor-isle-tower': 'Run code --version and paste its output.',
  'git-village-hall': 'Run git --version, git config --global --get user.name, and git config --global --get user.email; paste the outputs (you may redact the email domain).',
  'github-gateway-arch': 'Run git remote -v and git ls-remote --heads origin; paste the outputs. This confirms reachability, not authentication.',
  'build-bridge': 'Run ./scripts/venv.sh and bundle check, then paste the final output. If your project uses make, paste its build result instead.',
  'integration-summit': 'Inside your pages repo, run pwd, python3 --version, python3 -m pip --version, ruby -v, bundle -v, gem --version, code --version and git --version; paste the outputs. Nothing is committed or pushed.',
});

const LINE = /\r?\n/;
const failure = /(?:command not found|not recognized|not found in path|fatal:|error:|permission denied|build failed|not a git repository|could not|unable to|traceback)/i;
const check = (label, passed, detail) => ({ label, passed: Boolean(passed), detail: passed ? '' : detail });
const version = (name, output, pattern) => check(name, pattern.test(output), `${name} output is missing or does not show a version.`);
const clonedPages = (text) => check('Cloned pages into opencs', /(?:^|\n)\S*\/opencs\/pages\/?(?:\n|$)/.test(text), 'Run pwd inside ~/opencs/pages and paste its output.');
const runtimes = (text) => [
  version('Python 3', text, /\bPython\s+3\.\d+(?:\.\d+)?\b/i),
  version('pip', text, /\bpip\s+\d+(?:\.\d+)+\b/i),
  version('Ruby', text, /\bruby\s+\d+(?:\.\d+)+\b/i),
  version('Bundler', text, /\b(?:Bundler version|bundler|bundle)\s+\d+(?:\.\d+)+\b/i),
  version('RubyGems', text, /(?:^|\n)(?:RubyGems\s+)?\d+\.\d+(?:\.\d+)?(?:\s|$)/i),
];
const editor = (text) => version('VS Code or Cursor', text, /(?:^|\n)(?:VS Code\s+)?\d+\.\d+(?:\.\d+)?(?:\s|$)/i);
const git = (text) => version('Git', text, /\bgit version\s+\d+(?:\.\d+)+\b/i);

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
        clonedPages(text),
      ];
      break;
    case 'compiler-canyon-forge':
      checks = runtimes(text);
      break;
    case 'editor-isle-tower':
      checks = [editor(text)];
      break;
    case 'git-village-hall': {
      const name = clean.find(line => !/^(?:git version|[\w.+-]+@|\$|>)/i.test(line) && /^[\p{L}][\p{L} .'-]{1,79}$/u.test(line));
      const email = clean.find(line => /^[^\s@]+@(?:[^\s@]+|\[redacted\])$/.test(line) && !/(?:example\.com|you@|your-email)/i.test(line));
      checks = [git(text),
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
      // The finish line re-checks the clone and every tool; it never asks for a commit or a push.
      checks = [clonedPages(text), ...runtimes(text), editor(text), git(text)];
      break;
    default:
      return { ok: false, checks: [], summary: 'Unknown station. No progress was recorded.' };
  }
  if (failure.test(output)) checks.push(check('No command errors', false, 'The pasted output contains a command or build error. Fix it and try again.'));
  return { ok: checks.every(item => item.passed), checks, summary: checks.every(item => item.passed) ? 'Output matched the practice checks.' : 'Some checks did not pass.' };
}
