/**
 * Exact fix steps for Toolchain Trail, shown when a student is stuck.
 *
 * FIXES is keyed by the check ids the backend returns (ToolchainStations.java in
 * blueprint-spring). Each entry has steps per OS; an OS without its own steps uses
 * OS_FALLBACK (WSL and Kasm are Ubuntu), then `all`. A step is plain text or
 * { text, commands }, and every command gets a Copy button.
 *
 * {project} is replaced with the student's project folder for their OS and
 * {agent} with the command that starts the agent.
 */

export const PROJECT_FOLDER = Object.freeze({
  windows: '~/opencs/portfolio',
  macos: '~/opencs/portfolio',
  linux: '~/opencs/portfolio',
  kasm: '~/opencs/student',
});

const OS_FALLBACK = Object.freeze({ windows: 'linux', kasm: 'linux', wsl: 'linux' });

const UBUNTU_TOOLS = [
  { text: 'Install Python, Ruby and the class gems from your project folder (enter your password when asked):', commands: ['cd {project}', './scripts/activate_ubuntu.sh'] },
  'Then click Check again.',
];
const MAC_TOOLS = [
  { text: 'Install Python, Ruby and the class gems from your project folder. If it says Homebrew is missing, install it from brew.sh first.', commands: ['cd {project}', './scripts/activate_macos.sh'] },
  'Then click Check again.',
];

export const FIXES = Object.freeze({
  'working-folder': {
    all: [{ text: 'Start the agent from a terminal inside your project folder, then use Pair a new agent:', commands: ['cd {project}', '{agent}'] }],
  },
  'trail-folder': {
    all: [{ text: 'Create the folder in your home folder, then click Check again:', commands: ['mkdir -p ~/toolchain-trail'] }],
  },
  python: {
    macos: [{ text: 'Install Python with Homebrew (get Homebrew from brew.sh first if brew is missing):', commands: ['brew install python'] }],
    linux: [{ text: 'Install Python (enter your password when asked):', commands: ['sudo apt update', 'sudo apt install -y python3 python3-pip python3-venv'] }],
  },
  pip: {
    macos: [{ text: 'Install pip for your Python:', commands: ['python3 -m ensurepip --upgrade'] }],
    linux: [{ text: 'Install pip (enter your password when asked):', commands: ['sudo apt install -y python3-pip'] }],
  },
  ruby: { macos: MAC_TOOLS, linux: UBUNTU_TOOLS },
  bundler: { macos: MAC_TOOLS, linux: UBUNTU_TOOLS },
  rubygems: { macos: MAC_TOOLS, linux: UBUNTU_TOOLS },
  editor: {
    macos: [
      'Install VS Code from code.visualstudio.com and open it.',
      "Press Cmd+Shift+P, type Shell Command, and choose Install 'code' command in PATH.",
      { text: 'Check it works, then click Check again:', commands: ['code --version'] },
    ],
    windows: [
      'Install VS Code for Windows from code.visualstudio.com and keep "Add to PATH" checked.',
      { text: 'Close and reopen your Ubuntu (WSL) terminal, check it works, then click Check again:', commands: ['code --version'] },
    ],
    kasm: [{ text: 'VS Code comes with Kasm. Check it works, then click Check again:', commands: ['code --version'] }],
    linux: [
      { text: 'Install VS Code (enter your password when asked):', commands: ['sudo snap install code --classic'] },
      { text: 'Check it works, then click Check again:', commands: ['code --version'] },
    ],
  },
  git: {
    macos: [{ text: 'Install Git with Homebrew (get Homebrew from brew.sh first if brew is missing):', commands: ['brew install git'] }],
    linux: [{ text: 'Install Git (enter your password when asked):', commands: ['sudo apt update', 'sudo apt install -y git'] }],
  },
  'git-name': {
    all: [{ text: 'Set your name. Put your own name inside the quotes:', commands: ['git config --global user.name "Your Name"'] }],
  },
  'git-email': {
    all: [{ text: 'Set your real email. Replace the address inside the quotes with yours (example addresses are not accepted):', commands: ['git config --global user.email "your-email@example.com"'] }],
  },
  'github-remote': {
    all: [
      { text: 'The agent checks the folder it was started in. Make sure your cloned project points at GitHub:', commands: ['cd {project}', 'git remote -v'] },
      { text: 'If you started the agent in a different folder, start it again from your project and use Pair a new agent:', commands: ['{agent}'] },
    ],
  },
  'remote-branch': {
    all: [
      { text: 'Check that GitHub answers from your project folder. If it asks you to sign in, sign in to GitHub:', commands: ['cd {project}', 'git ls-remote --heads origin'] },
      'If it says it could not resolve the host, check your internet connection, then click Check again.',
    ],
  },
  'bundle-check': {
    all: [{ text: "Install the project's gems and Python packages, then click Check again:", commands: ['cd {project}', './scripts/venv.sh'] }],
  },
  'recent-commit': {
    all: [{ text: 'Make a commit in your project (change the message if you like):', commands: ['cd {project}', 'git add -A && git commit -m "My first trail commit"'] }],
  },
  'push-dry-run': {
    all: [
      { text: 'See what blocks your push:', commands: ['cd {project}', 'git push --dry-run'] },
      { text: 'If it says there is no upstream branch, push once with:', commands: ['git push -u origin HEAD'] },
      'If it asks you to sign in or says permission denied, sign in to GitHub (Windows: Git Credential Manager), then click Check again.',
    ],
  },
});

/** Help for getting stuck before any check runs. */
export const STUCK_HELP = Object.freeze({
  notSignedIn: ['You are not signed in, so no pairing code was made.', 'Sign in from the Login page, come back to this station, and click Get pairing code.'],
  serverUnreachable: ["The game can't reach the Toolchain server, so no pairing code was made.", 'Check your internet connection, reload the page, and click Get pairing code again.'],
  localBackendDown: [
    "The game can't reach your local backend.",
    { text: 'Start it in your blueprint-spring folder and wait for "Started Main". On a new computer, run the first command once to set up the database:', commands: ['python3 scripts/db_init.py', './mvnw spring-boot:run'] },
    'Then click Get pairing code again.',
  ],
});

/** The fix steps for one failed check on one OS, with {project} and {agent} filled in. */
export function fixStepsFor(checkId, os, agentCommand) {
  const entry = FIXES[checkId];
  if (!entry) return [];
  const steps = entry[os] || entry[OS_FALLBACK[os]] || entry.all || [];
  const fill = (value) => value
    .replaceAll('{project}', PROJECT_FOLDER[os] || PROJECT_FOLDER.linux)
    .replaceAll('{agent}', agentCommand);
  return steps.map((step) => (typeof step === 'string'
    ? fill(step)
    : { text: fill(step.text), commands: step.commands.map(fill) }));
}
