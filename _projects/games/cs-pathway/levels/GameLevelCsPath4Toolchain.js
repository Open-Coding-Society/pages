// Level 2: "Toolchain Trail" — Tools Setup World (SPACE THEME)
//
// Implements game-progression-plan.md's 7-zone onboarding map (Terminal →
// Compiler → Editor → Git → GitHub → Build → Integration Summit boss level)
// as a hub-and-spoke space-station map, reusing the same engine shell as
// Level 1 (Identity Forge / Wayfinding World / Mission Tooling):
//   - Same top engine bar / Game Status banner (untouched, lives outside this file)
//   - Same PLAYER PROFILE sidebar pattern (StatusPanel), extended with a
//     "Toolchain Trail" section per the design doc
//   - Same FriendlyNpc "gatekeeper" + DialogueSystem pattern for stations
//   - Same ProfileManager / LocalProfile persistence pattern (see the
//     'toolchain-trail' bucket added to localProfile.js / persistentProfile.js)
//
// WHAT'S NEW (see StationVerificationTrial.js for full notes):
//   - A mock "terminal verification" modal stands in for the real
//     terminal-watching agent described in the progression plan, so the
//     full station flow (briefing → verify → fun fact → unlock next) is
//     demoable today without a backend agent.
//   - Station visual states (locked / active / stuck / complete) are drawn
//     using CSS filters on each gatekeeper's existing canvas element —
//     no new rendering system required.
//   - FAILURE LOCK: if terminal output shows a failed command (pasted into
//     any text box in the game, or a setup report uploaded from the
//     student's Terminal with overall FAIL), every other station is locked
//     with a red padlock and a pulsing red banner warns that they will get
//     a 0.55 and fail unless they fix it. The lock survives refreshes and
//     clears when the failing station is verified with clean output, a new
//     setup report passes, or the level is reset.
//
// ASSET TODO (see design doc section 6 "Assets Needed" — not blocking):
//   - Six stations now use real building art from images/gamify/toolchain/
//     (gate, forge, tower, townhall, archway, bridge); Integration Summit
//     still uses the `npc/gatekeeper2.png` placeholder until real art lands.
//   - Swap the background image below for a real space-station backdrop
//   - Add real per-zone NPC portraits for the fun-fact popup
//
// File location: @assets/js/projects/cs-pathway/GameLevelCsPath4Toolchain.js

import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import CsPathwayPlayer from './CsPathwayPlayer.js';
import StatusPanel from '@assets/js/GameEnginev1.1/essentials/StatusPanel.js';
import FriendlyNpc from '@assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import ProfileManager from '@assets/js/projects/cs-pathway/model/ProfileManager.js';
import LocalProfile from '@assets/js/projects/cs-pathway/model/localProfile.js';
import StationVerificationTrial from './StationVerificationTrial.js';
import { javaURI, fetchOptions } from '@assets/js/api/config.js';
import TrailPath from './TrailPath.js';
import PathwayScoreboard from './PathwayScoreboard.js';
import MacSetupCheck from './MacSetupCheck.js';
import SystemSetupCheck from './SystemSetupCheck.js';
import HelpFlag from './HelpFlag.js';
import { buildHelpRequestMessage } from '../model/helpRequestMessage.js';
import { sampleSpline, resolveCircle, clampToCorridor, roundedLoop } from '../model/splineBarriers.js';
import { recordLevelRatio } from '../model/pathwayScores.js';
import {
  STATION_STATUS,
  formatStationGlyph,
  STATION_VISUAL_FILTERS,
  STUCK_THRESHOLD_MS,
} from '@assets/js/projects/cs-pathway/model/stationStatus.js';

const PROFILE_PANEL_ID = 'toolchain-trail-profile-panel';
// Flip to false to compare the level with and without the road.
const ROAD_ENABLED = true;
// Stations sit on a ring, clockwise in progression order (fractions of the map;
// x/y are the sprite's top-left, like the original positions).
const RING_LAYOUT = Object.freeze({
  'terminal-town-gate': { x: 0.16, y: 0.14 },
  'compiler-canyon-forge': { x: 0.45, y: 0.14 },
  'editor-isle-tower': { x: 0.76, y: 0.14 },
  'git-village-hall': { x: 0.90, y: 0.44 },
  'github-gateway-arch': { x: 0.76, y: 0.70 },
  'build-bridge': { x: 0.45, y: 0.70 },
  'integration-summit': { x: 0.16, y: 0.70 },
});
// Road corner roundness, as a fraction of the shorter map side.
const ROAD_CORNER = 0.08;
// Which side of each building the road passes on (so buildings never block it).
const ROAD_SIDES = Object.freeze({
  'terminal-town-gate': 'right',
  'compiler-canyon-forge': 'below',
  'editor-isle-tower': 'below',
  'git-village-hall': 'right',
  'github-gateway-arch': 'above',
  'build-bridge': 'above',
  'integration-summit': 'left',
});
// Extra clearance between a building's solid box and the road centerline.
// Raise it if buildings still block the road; lower it if you can't reach "Press E".
const ROAD_PAD = 25;
const OS_STORAGE_KEY = 'ocs-toolchain-trail-os';

/**
 * Failure lock: persisted so a refresh doesn't clear it.
 */
const FAILURE_STORAGE_KEY = 'ocs-toolchain-trail-failure';
const FAILURE_GRADE = 0.55;
// The setup check runs in the student's Terminal and uploads its report to the
// backend (CsPathwaySetupReportApiController), so the game never sees it as
// pasted text. Poll the backend for new reports and lock on overall FAIL.
const SETUP_REPORT_POLL_MS = 5000;
const LAST_REPORT_STORAGE_KEY = 'ocs-toolchain-trail-last-report-at';

/**
 * Signs that a pasted terminal output shows a failed command. Kept fairly
 * specific so harmless text like "0 errors" doesn't trip it.
 */
const TERMINAL_FAILURE_PATTERNS = [
  /command not found/i,
  /is not recognized as (an internal or external command|the name of a cmdlet)/i,
  /no such file or directory/i,
  /permission denied/i,
  /^\s*fatal:/im,
  /^\s*error:/im,
  /^\s*E: /m, // apt errors
  /npm ERR!/i,
  /traceback \(most recent call last\)/i,
  /\bsyntax error\b/i,
  /\bsegmentation fault\b/i,
  /could not resolve host/i,
  /authentication failed/i,
  /repository not found/i,
  /\bbuild failed\b/i,
  /\bfailed to\b/i,
  /exit (?:code|status):? ?[1-9]\d*/i,
  // macOS / Java / Maven
  /unable to locate/i, // "Unable to locate a Java Runtime", apt "Unable to locate package"
  /operation couldn[’']t be completed/i,
  /no java runtime present/i,
  /JAVA_HOME is not (?:set|defined)/i,
  /^\s*\[ERROR\]/m,
  /\bBUILD FAILURE\b/,
];

/**
 * Returns { line } for the first failing line found, or null if the output looks clean.
 */
function detectTerminalFailure(output) {
  if (!output || typeof output !== 'string') return null;
  const lines = output.split(/\r?\n/);
  const clip = (l) => {
    const line = l.trim();
    return { line: line.length > 160 ? `${line.slice(0, 157)}...` : line };
  };

  // Setup-check reports (verifyToolsTerminal.sh / mac_setup_agent.py) mark
  // each check PASS, WARN, or FAIL. For those, only FAIL counts: WARN lines
  // for optional tools can say "not found" and must not lock the trail.
  // Summary counts like "0 FAIL" or "FAIL: 0" are ignored.
  const statusLines = lines.filter((l) => /\b(PASS|WARN|FAIL)\b/.test(l));
  if (statusLines.length >= 2) {
    const failLine = statusLines.find((l) => /\bFAIL\b/.test(l)
      && !/\b0\s*FAIL/.test(l)
      && !/FAIL\w*\s*[:=]?\s*0\b/.test(l));
    return failLine ? clip(failLine) : null;
  }

  for (const re of TERMINAL_FAILURE_PATTERNS) {
    if (!re.test(output)) continue;
    return clip(lines.find((l) => re.test(l)) || output);
  }
  return null;
}

/**
 * Operating systems students can pick from before starting the trail.
 * Selection drives which per-station instructions/example commands show.
 */
const OS_OPTIONS = Object.freeze([
  { id: 'windows', label: 'Windows' },
  { id: 'kasm', label: 'Kasm (Cloud Linux Desktop)' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
]);

/**
 * Real per-station building art (images/gamify/toolchain). Integration
 * Summit has no dedicated asset yet, so it falls back to the tinted
 * placeholder sprite via STATION_HUE_ROTATE below.
 */
const STATION_BUILDING_SPRITES = Object.freeze({
  'terminal-town-gate': { file: 'gate.png', pixels: { width: 315, height: 250 } },
  'compiler-canyon-forge': { file: 'forge.png', pixels: { width: 500, height: 500 } },
  'editor-isle-tower': { file: 'tower.png', pixels: { width: 500, height: 500 } },
  'git-village-hall': { file: 'townhall.png', pixels: { width: 500, height: 500 } },
  'github-gateway-arch': { file: 'archway.png', pixels: { width: 64, height: 64 } },
  'build-bridge': { file: 'bridge.png', pixels: { width: 500, height: 500 } },
});

/**
 * Hue-rotate fallback for stations without real art yet (currently just
 * Integration Summit, which still uses the shared gatekeeper2.png sprite).
 */
const STATION_HUE_ROTATE = Object.freeze({
  'integration-summit': 'hue-rotate(40deg)',
});

/**
 * GameLevelCsPath4Toolchain - "Toolchain Trail" (Level 2, Tools Setup World)
 *
 * Hub-and-spoke space station map. The player walks between six station
 * modules arranged around a central hub ("The Setup Grounds"), each gating
 * a real dev-environment milestone, plus a final gate ("Integration
 * Summit") that only unfogs once the first six are complete.
 *
 * @class
 */
class GameLevelCsPath4Toolchain {
  static levelId = 'toolchain-trail';
  static displayName = 'Toolchain Trail';

  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.levelDisplayName = GameLevelCsPath4Toolchain.displayName;
    this.logPrefix = GameLevelCsPath4Toolchain.displayName;

    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;
    const path = gameEnv.path;
    this._path = path;

    // FriendlyNpc / proximity helpers expect these level references.
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;

    /**
     * Section: OS selection (drives per-station instructions/example commands).
     * Persisted so returning students aren't re-prompted every visit.
     */
    this.selectedOS = null;
    try {
      this.selectedOS = localStorage.getItem(OS_STORAGE_KEY) || null;
    } catch (err) {
      this.selectedOS = null;
    }

    /**
     * Section: failure lock (persisted so a refresh doesn't clear it).
     * Shape: { stationId, line, source, at } or null.
     */
    // localStorage: the lock survives refreshes AND closing the browser, so a
    // student can't escape it by leaving. It clears when the failing station
    // is verified with clean output, or with the Reset Toolchain Trail button.
    this.failureState = null;
    try {
      const raw = localStorage.getItem(FAILURE_STORAGE_KEY);
      this.failureState = raw ? JSON.parse(raw) : null;
    } catch (err) {
      this.failureState = null;
    }
    this._failureBannerEl = null;
    this._lockOverlays = {};
    this._openTrialStationId = null;
    this._lastPastedOutput = '';

    /**
     * Section: shared UI theme (space palette, same shell/typography as Level 1).
     */
    this.uiTheme = {
      background: 'var(--ocs-game-panel-bg, rgba(6,8,22,0.94))',
      borderColor: 'var(--ocs-game-accent, #38bdf8)',
      textColor: 'var(--ocs-game-text, #dbeafe)',
      secondaryTextColor: 'var(--ocs-game-muted, #a5b4fc)',
      accentColor: 'var(--ocs-game-accent, #38bdf8)',
      inputBackground: 'var(--ocs-game-surface-alt, #0b1026)',
      buttonBackground: 'var(--ocs-game-accent, #38bdf8)',
      buttonTextColor: 'var(--ocs-game-surface-contrast, #04060f)',
      secondaryButtonBackground: 'var(--ocs-game-surface-alt, #0b1026)',
      secondaryButtonTextColor: 'var(--ocs-game-text, #dbeafe)',
      overlayBackground: 'var(--ocs-game-overlay, rgba(4,6,15,0.75))',
      boxShadow: '0 0 20px rgba(56,189,248,0.18)',
    };
    const uiTheme = this.uiTheme;

    /**
     * Section: station definitions (the 7 zones from game-progression-plan.md,
     * reskinned as space-station modules).
     */
    this.STATIONS = [
      {
        id: 'terminal-town-gate',
        name: 'Terminal Town Gate',
        icon: '🖥️',
        accentColor: '#38bdf8',
        skill: 'Shell fundamentals and package management',
        zone: 1,
        position: { x: width * 0.16, y: height * 0.28 },
        narrativeHook: "The gate won't open until you prove you can pilot the shell.",
        instructions: [
          'Open your terminal application.',
          { text: "See where you currently are:", commands: ["pwd"] },
          { text: "List the files here:", commands: ["ls"] },
          { text: "Create the trail folder:", commands: ["mkdir toolchain-trail"] },
        ],
        instructionsByOS: {
          windows: [
            'Open Windows Terminal (pin it to your taskbar).',
            { text: "Install WSL with Ubuntu, then set a username and password when prompted:", commands: ["wsl --install -d Ubuntu-24.04"] },
            { text: "Set it as your default:", commands: ["wsl --set-default Ubuntu-24.04"] },
            { text: "Launch your Ubuntu shell, then create the trail folder:", commands: ["wsl", "mkdir toolchain-trail"] },
          ],
          kasm: [
            'Open a Terminal in your Kasm Workspace.',
            { text: "See where you currently are:", commands: ["pwd"] },
            { text: "List the files here (cat shows a file's contents):", commands: ["ls"] },
            { text: "Create the trail folder:", commands: ["mkdir toolchain-trail"] },
          ],
          macos: [
            'Open Terminal (keep it in the Dock for easy access).',
            { text: "See where you currently are:", commands: ["pwd"] },
            { text: "List the files here (cat shows a file's contents):", commands: ["ls"] },
            { text: "Create the trail folder:", commands: ["mkdir toolchain-trail"] },
          ],
          linux: [
            'Open a Terminal.',
            { text: "See where you currently are:", commands: ["pwd"] },
            { text: "List the files here (cat shows a file's contents):", commands: ["ls"] },
            { text: "Create the trail folder:", commands: ["mkdir toolchain-trail"] },
          ],
        },
        expectedCommandPattern: /^(mkdir\s+\S+|ls|dir|pwd|cd)/i,
        expectedCommandPatternByOS: {
          windows: /^(wsl(\s+.*)?|mkdir\s+\S+|ls|pwd|cd)/i,
        },
        exampleCommand: 'mkdir toolchain-trail',
        exampleCommandByOS: {
          windows: 'wsl --install -d Ubuntu-24.04',
        },
        funFact: "Fun fact: 'ls' has been a Unix command since 1971 — older than most operating systems still in use today.",
      },
      {
        id: 'compiler-canyon-forge',
        name: 'Compiler Canyon Forge',
        icon: '☕',
        accentColor: '#f97316',
        skill: 'Java or Python runtime',
        zone: 2,
        position: { x: width * 0.45, y: height * 0.18 },
        narrativeHook: 'The forge only ignites for a verified runtime.',
        instructions: [
          { text: "Confirm a runtime is installed:", commands: ["python3 --version", "java -version"] },
          { text: "If missing, install one:", commands: ["sudo apt install python3", "sudo apt install default-jdk"] },
          'Write a one-line Hello.java or hello.py file.',
          { text: "Compile it, if using Java:", commands: ["javac Hello.java"] },
          { text: "Run it:", commands: ["python3 hello.py", "java Hello"] },
        ],
        instructionsByOS: {
          windows: [
            'Open your WSL Ubuntu terminal.',
            { text: "Confirm Python is installed:", commands: ["python --version", "pip --version"] },
            { text: "Confirm the Ruby tools too (the class stack uses them):", commands: ["ruby -v", "bundle -v", "gem --version"] },
            { text: "If anything is missing, install it from your project folder:", commands: ["./scripts/activate.sh"] },
          ],
          macos: [
            'Open Terminal.',
            { text: "Confirm Python is installed:", commands: ["python --version", "pip --version"] },
            { text: "Confirm the Ruby tools too (the class stack uses them):", commands: ["ruby -v", "bundle -v", "gem --version"] },
            { text: "If anything is missing, install Homebrew from brew.sh, then run this from your project folder:", commands: ["./scripts/activate.sh"] },
          ],
          kasm: [
            'Open a Terminal in your Kasm Workspace.',
            { text: "Confirm Python is installed:", commands: ["python --version", "pip --version"] },
            { text: "Confirm the Ruby tools too (the class stack uses them):", commands: ["ruby -v", "bundle -v", "gem --version"] },
            { text: "If anything is missing, install it from your project folder:", commands: ["./scripts/activate.sh"] },
          ],
          linux: [
            'Open a Terminal.',
            { text: "Confirm Python is installed:", commands: ["python --version", "pip --version"] },
            { text: "Confirm the Ruby tools too (the class stack uses them):", commands: ["ruby -v", "bundle -v", "gem --version"] },
            { text: "If anything is missing, install it with sudo apt install <package>, then run this from your project folder:", commands: ["./scripts/activate.sh"] },
          ],
        },
        expectedCommandPattern: /^(javac?\s+.*|java\s+-version|python3?\s+.*)/i,
        expectedCommandPatternByOS: {
          windows: /^(python3?\s+.*|pip\s+.*|ruby\s+.*|bundle\s+.*|gem\s+.*)/i,
          macos: /^(python3?\s+.*|pip\s+.*|ruby\s+.*|bundle\s+.*|gem\s+.*)/i,
          kasm: /^(python3?\s+.*|pip\s+.*|ruby\s+.*|bundle\s+.*|gem\s+.*)/i,
          linux: /^(python3?\s+.*|pip\s+.*|ruby\s+.*|bundle\s+.*|gem\s+.*)/i,
        },
        exampleCommand: 'java -version',
        exampleCommandByOS: {
          windows: 'python --version',
          macos: 'python --version',
          kasm: 'python --version',
          linux: 'python --version',
        },
        funFact: "Fun fact: Java was originally called 'Oak', named after a tree outside its creator's office.",
      },
      {
        id: 'editor-isle-tower',
        name: 'Editor Isle Tower',
        icon: '🧭',
        accentColor: '#8b5cf6',
        skill: 'VS Code/Cursor and WSL configuration',
        zone: 3,
        position: { x: width * 0.76, y: height * 0.24 },
        narrativeHook: 'The tower needs a properly configured editor before it will respond.',
        instructions: [
          'Install VS Code or Cursor for your Linux distro (package manager or .deb/.rpm download).',
          "Open this project's folder in it.",
          'Install one recommended extension.',
        ],
        instructionsByOS: {
          windows: [
            'Install VS Code for Windows from code.visualstudio.com, keeping the default options.',
            { text: "From your WSL Ubuntu terminal, cd into your project folder and open it (VS Code installs the WSL extension automatically):", commands: ["code ."] },
            'Install one recommended extension.',
          ],
          macos: [
            'Download and install VS Code for Mac from code.visualstudio.com.',
            { text: "Open a new Terminal, cd into your project folder, and open it:", commands: ["code ."] },
            'Install one recommended extension.',
          ],
          kasm: [
            'Open a new Terminal in your Kasm Workspace.',
            { text: "Go into your project folder:", commands: ["cd opencs/student"] },
            { text: "Activate your environment:", commands: ["source venv/bin/activate"] },
            { text: "Open it in VS Code:", commands: ["code ."] },
          ],
          linux: [
            'Install VS Code from code.visualstudio.com (choose the Debian/Ubuntu package and default options).',
            'Install Chrome from google.com/chrome/browser-tools (choose the Debian package).',
            { text: "Open a Terminal, cd into your project folder, and open it:", commands: ["code ."] },
          ],
        },
        expectedCommandPattern: /^code\s+\.?/i,
        exampleCommand: 'code .',
        funFact: 'Fun fact: VS Code is built on Electron — the same framework behind Slack and Discord.',
      },
      {
        id: 'git-village-hall',
        name: 'Git Village Hall',
        icon: '🌿',
        accentColor: '#22c55e',
        skill: 'Git installation and configuration',
        zone: 4,
        position: { x: width * 0.16, y: height * 0.72 },
        narrativeHook: "The hall won't record your work until it knows who you are.",
        instructions: [
          { text: "Confirm git is installed (if it's missing, run the second command):", commands: ["git --version", "sudo apt install git"] },
          { text: "Set your name (put your own name in the quotes):", commands: ["git config --global user.name \"Your Name\""] },
          { text: "Set your email (use your real email):", commands: ["git config --global user.email you@example.com"] },
          { text: "Start a repository in a folder:", commands: ["git init"] },
        ],
        instructionsByOS: {
          windows: [
            'Install Git Credential Manager (GCM) from git-scm.com/downloads/win, keeping the default options.',
            { text: "In your WSL Ubuntu terminal, wire it up:", commands: ["git config --global credential.helper \"/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe\""] },
            { text: "Set your name (put your own name in the quotes):", commands: ["git config --global user.name \"Your Name\""] },
            { text: "Set your email (use your real email):", commands: ["git config --global user.email you@example.com"] },
          ],
          macos: [
            { text: "Confirm git is installed (if it's missing, install Homebrew from brew.sh, then run the second command):", commands: ["git --version", "brew install git"] },
            { text: "Set your Git UID and personal email (it asks for them):", commands: ["./scripts/activate.sh"] },
            { text: "Confirm it worked:", commands: ["git config --global --list"] },
          ],
          kasm: [
            'Open a Terminal in your Kasm Workspace.',
            { text: "Confirm git is installed (Kasm images ship with it):", commands: ["git --version"] },
            { text: "Set your Git UID and personal email (it asks for them):", commands: ["./scripts/activate.sh"] },
            { text: "Confirm it worked:", commands: ["git config --global --list"] },
          ],
          linux: [
            { text: "Install git:", commands: ["sudo apt update", "sudo apt install git"] },
            { text: "Set your Git UID and personal email (it asks for them):", commands: ["./scripts/activate.sh"] },
            { text: "Confirm it worked:", commands: ["git config --global --list"] },
          ],
        },
        expectedCommandPattern: /^git\s+(config|init|--version)/i,
        exampleCommand: 'git init',
        exampleCommandByOS: {
          windows: 'git config --global credential.helper "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe"',
          macos: 'git config --global --list',
          kasm: 'git config --global --list',
          linux: 'git config --global --list',
        },
        funFact: 'Fun fact: Linus Torvalds wrote Git in 2005 — in about a weekend — to manage Linux kernel development.',
      },
      {
        id: 'github-gateway-arch',
        name: 'GitHub Gateway Arch',
        icon: '🐙',
        accentColor: '#ec4899',
        skill: 'GitHub authentication and repository connectivity',
        zone: 5,
        position: { x: width * 0.45, y: height * 0.82 },
        narrativeHook: 'No signal passes the arch without an authenticated connection.',
        instructions: [
          'Confirm you have a GitHub account.',
          { text: "Set up SSH key or token auth:", commands: ["ssh-keygen -t ed25519"] },
          'Clone the class starter repo with git clone.',
        ],
        instructionsByOS: {
          windows: [
            'Confirm you have a GitHub account.',
            { text: "In your WSL Ubuntu terminal, make a workspace:", commands: ["mkdir opencs && cd opencs"] },
            { text: "Clone the class repo:", commands: ["git clone https://github.com/Open-Coding-Society/portfolio.git"] },
          ],
          kasm: [
            'Confirm you have a GitHub account.',
            { text: "In your Kasm Terminal, make a workspace:", commands: ["mkdir opencs && cd opencs"] },
            { text: "Clone the class repo:", commands: ["git clone https://github.com/Open-Coding-Society/student.git"] },
          ],
          macos: [
            'Confirm you have a GitHub account.',
            { text: "In Terminal, make a workspace:", commands: ["mkdir opencs && cd opencs"] },
            { text: "Clone the class repo:", commands: ["git clone https://github.com/Open-Coding-Society/portfolio.git"] },
          ],
          linux: [
            'Confirm you have a GitHub account.',
            { text: "In Terminal, make a workspace:", commands: ["mkdir opencs && cd opencs"] },
            { text: "Clone the class repo:", commands: ["git clone https://github.com/Open-Coding-Society/portfolio.git"] },
          ],
        },
        expectedCommandPattern: /^git\s+clone\s+\S+/i,
        exampleCommand: 'git clone <starter-repo-url>',
        exampleCommandByOS: {
          windows: 'git clone https://github.com/Open-Coding-Society/portfolio.git',
          kasm: 'git clone https://github.com/Open-Coding-Society/student.git',
          macos: 'git clone https://github.com/Open-Coding-Society/portfolio.git',
          linux: 'git clone https://github.com/Open-Coding-Society/portfolio.git',
        },
        funFact: 'Fun fact: GitHub hosts over 100 million repositories — more code than any library in human history.',
      },
      {
        id: 'build-bridge',
        name: 'Build Bridge',
        icon: '🔧',
        accentColor: '#eab308',
        skill: 'Project build and runtime verification',
        zone: 6,
        position: { x: width * 0.76, y: height * 0.72 },
        narrativeHook: 'Nothing crosses this bridge until the project actually builds and runs.',
        instructions: [
          { text: "Run the class's build command (for this project it's make):", commands: ["make"] },
          'Confirm it completes successfully.',
        ],
        instructionsByOS: {
          windows: [
            { text: "In your WSL Ubuntu terminal, go into the cloned folder:", commands: ["cd portfolio"] },
            { text: "Install the Ubuntu tools (enter your WSL Ubuntu password when asked):", commands: ["./scripts/activate_ubuntu.sh"] },
            { text: "Set up Git (enter your Git username and email when asked):", commands: ["./scripts/activate.sh"] },
            { text: "Build the Python virtual environment:", commands: ["./scripts/venv.sh"] },
          ],
          kasm: [
            { text: "In your Kasm Terminal, go into the cloned folder:", commands: ["cd student"] },
            { text: "Set up Git (enter your Git UID and personal email when asked):", commands: ["./scripts/activate.sh"] },
            { text: "Build the Python virtual environment:", commands: ["./scripts/venv.sh"] },
            { text: "Open the project in VS Code:", commands: ["code ."] },
          ],
          macos: [
            { text: "In Terminal, go into the cloned folder:", commands: ["cd portfolio"] },
            { text: "Install the macOS tools:", commands: ["./scripts/activate_macos.sh"] },
            { text: "Set up Git (enter your Git UID and personal email when asked):", commands: ["./scripts/activate.sh"] },
            { text: "Build the Python virtual environment:", commands: ["./scripts/venv.sh"] },
          ],
          linux: [
            { text: "In Terminal, go into the cloned folder:", commands: ["cd portfolio"] },
            { text: "Install the Linux tools (every Linux can use the Ubuntu script):", commands: ["./scripts/activate_ubuntu.sh"] },
            { text: "Set up Git (enter your Git UID and personal email when asked):", commands: ["./scripts/activate.sh"] },
            { text: "Configure tools for the project:", commands: ["./scripts/venv.sh"] },
          ],
        },
        expectedCommandPattern: /^(mvn|gradle|\.\/gradlew|make)\s+\S+/i,
        expectedCommandPatternByOS: {
          windows: /^\.\/scripts\/\S+/i,
          kasm: /^\.\/scripts\/\S+/i,
          macos: /^\.\/scripts\/\S+/i,
          linux: /^\.\/scripts\/\S+/i,
        },
        exampleCommandByOS: {
          windows: './scripts/venv.sh',
          kasm: './scripts/venv.sh',
          macos: './scripts/venv.sh',
          linux: './scripts/venv.sh',
        },
        exampleCommand: 'make',
        funFact: "Fun fact: Maven's name comes from a word for 'accumulator of knowledge' — fitting for a build tool.",
      },
      {
        id: 'integration-summit',
        name: 'Integration Summit',
        icon: '⭐',
        accentColor: '#fbbf24',
        skill: 'Final end-to-end verification',
        zone: 7,
        isBoss: true,
        position: { x: width * 0.93, y: height * 0.48 },
        narrativeHook: 'Only a fully verified toolchain can reach the summit.',
        instructions: [
          'Clone the starter project.',
          'Build it successfully.',
          'Run the provided test suite.',
          'Make one commit.',
          'Push it.',
        ],
        instructionsByOS: {
          windows: [
            { text: "From your WSL Ubuntu terminal, go back into your project:", commands: ["cd opencs/portfolio"] },
            { text: "Activate your environment:", commands: ["source venv/bin/activate"] },
            { text: "Open it in your editor:", commands: ["code ."] },
            { text: "Make one commit and push it (change the message if you like):", commands: ["git add -A && git commit -m \"My first trail commit\"", "git push"] },
          ],
          kasm: [
            { text: "From your Kasm Terminal, go back into your project:", commands: ["cd opencs/student"] },
            { text: "Activate your environment:", commands: ["source venv/bin/activate"] },
            { text: "Open it in your editor:", commands: ["code ."] },
            { text: "Make one commit and push it (change the message if you like):", commands: ["git add -A && git commit -m \"My first trail commit\"", "git push"] },
          ],
          macos: [
            { text: "From Terminal, go back into your project:", commands: ["cd opencs/portfolio"] },
            { text: "Activate your environment:", commands: ["source venv/bin/activate"] },
            { text: "Open it in your editor:", commands: ["code ."] },
            { text: "Make one commit and push it (change the message if you like):", commands: ["git add -A && git commit -m \"My first trail commit\"", "git push"] },
          ],
          linux: [
            { text: "Open a new Terminal (close the old one) and go back into your project:", commands: ["cd opencs/portfolio"] },
            { text: "Activate your environment:", commands: ["source venv/bin/activate"] },
            { text: "Open it in your editor:", commands: ["code ."] },
            { text: "Make one commit and push it (change the message if you like):", commands: ["git add -A && git commit -m \"My first trail commit\"", "git push"] },
          ],
        },
        expectedCommandPattern: /^git\s+push/i,
        exampleCommand: 'git push',
        funFact: 'Every station verified end-to-end — your development environment is complete.',
      },
    ];
    if (ROAD_ENABLED) {
      this.STATIONS.forEach((st) => {
        const p = RING_LAYOUT[st.id];
        if (p) st.position = { x: width * p.x, y: height * p.y };
      });
    }
    this._stationById = Object.fromEntries(this.STATIONS.map((s) => [s.id, s]));
    this._nonBossOrder = this.STATIONS.filter((s) => !s.isBoss).map((s) => s.id);

    // In-memory only: when each active station was first shown, used for the
    // client-side "stuck" fallback heuristic (see stationStatus.js).
    this._stationActivatedAt = {};
    this._stuckCheckInterval = null;

    /**
     * Section: loading overlay (self-contained — this level does not depend
     * on GameLevelCsPathIdentity's shared loading-screen helpers).
     */
    this._loadingOverlay = null;
    this._showLoading('Charting the Toolchain Trail...');

    /**
     * Section: profile persistence (same ProfileManager pattern as Level 1).
     */
    this.profileManager = new ProfileManager();
    this.profileData = {};
    this.completedStations = new Set();
    this.profileManagerReady = this.profileManager.initialize().then(async (restored) => {
      if (restored?.profileData) {
        this.profileData = { ...restored.profileData };
        const savedStations = restored.profileData.toolchainMeta?.stations || {};
        Object.entries(savedStations).forEach(([id, status]) => {
          if (status === STATION_STATUS.COMPLETE) this.completedStations.add(id);
        });
      }
    }).catch((err) => {
      console.warn(`${this.logPrefix}: ProfileManager initialization failed`, err);
    }).finally(() => {
      this._recomputeStationStates(false);
      this._hideLoading();
    });

    /**
     * Section: background (space station backdrop).
     */
    const bg_data = {
      name: GameLevelCsPath4Toolchain.displayName,
      greeting: 'Docking sequence complete. Welcome to the Toolchain Trail.',
      src: path + '/images/projects/cs-pathway/bg/toolchain-trail-space.png',
    };

    /**
     * Section: player (avatar carries over unchanged from Level 1).
     */
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Toolchain',
      greeting: 'Systems nominal. Ready to explore the Toolchain Trail!',
      src: path + '/images/projects/cs-pathway/player/minimalist.png',
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_FPS: 8,
      INIT_POSITION: ROAD_ENABLED ? (() => { const l = this._roadLoop(); return l.points[l.mids[0]]; })() : { x: width * 0.5, y: height * 0.52 },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down: { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate: Math.PI / 16 },
      downLeft: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left: { row: 1, start: 0, columns: 1, mirror: true },
      right: { row: 1, start: 0, columns: 1 },
      up: { row: 0, start: 1, columns: 1 },
      upLeft: { row: 1, start: 0, columns: 1, mirror: true, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    /**
     * Section: station gatekeeper NPC factory (mirrors Forge's createGatekeeperData).
     */
    const level = this;
    const gatekeeperBaseData = {
      // TODO(art): swap for a robot/alien station-guardian sprite once available.
      src: path + '/images/projects/cs-pathway/npc/gatekeeper2.png',
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      ANIMATION_RATE: 50,
      pixels: { width: 1024, height: 1024 },
      orientation: { rows: 2, columns: 2 },
      down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
      up: { row: 0, start: 1, columns: 1 },
      left: { row: 1, start: 0, columns: 1 },
      right: { row: 1, start: 1, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
    };

    const createStationGatekeeperData = (station) => {
      const building = STATION_BUILDING_SPRITES[station.id];
      const buildingOverrides = building ? {
        src: path + '/images/gamify/toolchain/' + building.file,
        pixels: building.pixels,
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1, wiggle: 0.005 },
        up: { row: 0, start: 0, columns: 1 },
        left: { row: 0, start: 0, columns: 1 },
        right: { row: 0, start: 0, columns: 1 },
      } : {};

      return {
        ...gatekeeperBaseData,
        ...buildingOverrides,
        id: station.id,
        greeting: station.name,
        INIT_POSITION: { ...station.position },
        interactDistance: 120,
        alertDistance: 0.22,
        zoneMessage: `${station.name}: Press E to interact.`,
        // No approach reaction: walking up only shows the "Press E" zone alert
        // (see update()). Auto-running the station here opened a dialogue that
        // paused the game, so the E key was ignored.
        interact: async function () {
          await level.runStation(station.id, false);
        },
      };
    };

    // Spike: test spline barrier left of the spawn point (remove or replace later).
    const test_barrier = {
      id: 'toolchain-test-barrier',
      splinePoints: [
        { x: 0.30 * width, y: 0.38 * height },
        { x: 0.34 * width, y: 0.52 * height },
        { x: 0.30 * width, y: 0.66 * height },
      ],
      visible: true,
      color: '#ff3b6b',
      lineWidth: 5,
    };
    const SHOW_BARRIER_DEBUG = false;
    this._barrierPolylines = [];
    if (SHOW_BARRIER_DEBUG) this._drawBarrierDebug(gameEnv, this._barrierPolylines);

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      {
        class: TrailPath,
        data: {
          stations: this.STATIONS,
          getStatus: (stationId) => level.getStationStatus(stationId),
          getLaneWidth: () => (level._laneHalf || 0) * 2,
          getLanePoints: () => (ROAD_ENABLED ? level._roadLoop().points : []),
          getRoadPath: (a, b) => (ROAD_ENABLED ? level._roadPath(a, b) : null),
        },
      },
      { class: CsPathwayPlayer, data: player_data },
      ...this.STATIONS.map((station) => ({
        class: FriendlyNpc,
        data: createStationGatekeeperData(station),
      })),
    ];

    /**
     * Section: dialogue system (same Promise-queue helper pattern as Level 1).
     */
    this.levelDialogueSystem = new DialogueSystem({
      id: 'toolchain-trail-dialogue',
      dialogues: [],
      gameControl: gameEnv.gameControl,
      enableVoice: true,
      enableTypewriter: true,
      typewriterSpeed: 24,
      voiceRate: 0.9,
    });

    this.showDialogue = function (speakerName, lines, options = {}) {
      const queue = Array.isArray(lines) ? lines.filter(Boolean) : [String(lines || '')];
      if (queue.length === 0) return Promise.resolve();

      return new Promise((resolve) => {
        let index = 0;
        let finished = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          this.levelDialogueSystem.closeDialogue();
          resolve();
        };

        const showStep = () => {
          if (finished) return;
          const message = queue[index];
          const isLast = index === queue.length - 1;

          this.levelDialogueSystem.closeDialogue();
          this.levelDialogueSystem.showDialogue(
            message,
            speakerName,
            options.avatarSrc || null,
            options.spriteData || null,
          );

          this.levelDialogueSystem.closeBtn.textContent = isLast ? 'Close' : 'Skip';
          this.levelDialogueSystem.closeBtn.onclick = () => finish();

          this.levelDialogueSystem.addButtons([
            {
              text: isLast ? 'Done' : 'Next',
              primary: true,
              action: () => {
                index += 1;
                if (index < queue.length) {
                  showStep();
                } else {
                  finish();
                }
              },
            },
          ]);
        };

        showStep();
      });
    };

    /**
     * Section: toast + zone alert (self-contained, same visual language as Level 1).
     */
    const createNotificationStyle = (top, zIndex) => `
      position: fixed; top: ${top}; right: 20px;
      z-index: ${zIndex}; pointer-events: none;
      background: ${uiTheme.background};
      border: 2px solid ${uiTheme.borderColor};
      color: ${uiTheme.accentColor};
      font-family: "Courier New", monospace;
      font-size: 13px;
      padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
      box-shadow: ${uiTheme.boxShadow};
      width: min(360px, 32vw); text-align: left;
    `;

    this.showToast = function (message) {
      if (message === 'Press E to interact') return;
      const isActiveLevel = this.gameEnv?.currentLevel === this || this.gameEnv?.gameLevel === this;
      if (!isActiveLevel) return;

      if (this._toastEl?.parentNode) this._toastEl.parentNode.removeChild(this._toastEl);
      if (this._toastTimer) clearTimeout(this._toastTimer);

      const toast = document.createElement('div');
      toast.style.cssText = createNotificationStyle('20px', 100020);
      toast.textContent = message;
      document.body.appendChild(toast);

      this._toastEl = toast;
      this._toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (this._toastEl === toast) this._toastEl = null;
      }, 2200);
    };

    this.setZoneAlert = function (message) {
      const isActiveLevel = this.gameEnv?.currentLevel === this || this.gameEnv?.gameLevel === this;
      if (!isActiveLevel) return;
      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = createNotificationStyle('auto', 100010);
        // Keep the interaction prompt completely away from the top-right scoreboard.
        zoneAlert.style.bottom = '16px';
        zoneAlert.style.right = 'auto';
        zoneAlert.style.left = '20px';
        zoneAlert.style.width = 'min(360px, calc(100vw - 40px))';
        zoneAlert.style.textAlign = 'center';
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }
      this._zoneAlertEl.textContent = message;
    };

    this.clearZoneAlert = function () {
      if (this._zoneAlertEl?.parentNode) this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      this._zoneAlertEl = null;
    };

    /**
     * Section: sidebar (PLAYER PROFILE carried over + new Toolchain Trail block).
     */
    const panelFields = [
      { key: 'name', label: 'Name', emptyValue: '—' },
      { key: 'email', label: 'Email', emptyValue: '—' },
      { key: 'githubID', label: 'GitHub ID', emptyValue: '—' },
      { key: 'persona', label: 'Persona', emptyValue: '—' },
      { key: 'selectedOS', label: 'Operating System', emptyValue: 'Not selected' },
      { type: 'section', title: 'Completion Status', marginTop: '10px' },
      { key: 'completionIdentityForge', label: 'Identity Forge', emptyValue: '—' },
      { key: 'completionWayfindingWorld', label: 'Wayfinding World', emptyValue: '—' },
      { key: 'completionMissionTools', label: 'Mission Tools', emptyValue: '—' },
      { type: 'section', title: 'Toolchain Trail', marginTop: '10px' },
      ...this.STATIONS.map((station) => ({
        key: `station_${station.id}`,
        label: `${station.icon} ${station.name}`,
        emptyValue: '—',
      })),
      { key: 'toolchainScore', label: 'Level 2 Score', emptyValue: '0.000' },
    ];

    // The HUD lives in the game container so it scales with the map when the
    // full-page stage is fitted to a small window (js/fullPageLevel.js).
    const hudMount = this.gameEnv.container || document.body;
    const panelConfig = {
      id: PROFILE_PANEL_ID,
      mountTo: hudMount,
      title: 'PLAYER PROFILE',
      fields: panelFields,
      actions: [
        ...(this.profileManager.isAuthenticated ? [
          {
            label: 'Snapshot Progress',
            title: 'Save current progress to server',
            onClick: async () => {
              try {
                const complete = LocalProfile.load();
                if (complete) await (await import('@assets/js/projects/cs-pathway/model/persistentProfile.js')).default.save(complete);
                level.showToast('✦ Progress saved to server!');
              } catch (error) {
                console.error(`${level.logPrefix}: snapshot failed`, error);
              }
            },
          },
        ] : []),
        {
          label: 'Change Operating System',
          title: 'Switch the OS used for station instructions/commands',
          onClick: () => level._promptOSSelection(true),
        },
        {
          label: '🔄 Reset Toolchain Trail',
          title: 'Clear only this level\'s station progress',
          danger: true,
          onClick: () => level._showResetModal(),
        },
      ],
      theme: uiTheme,
    };

    this.profilePanelView = new StatusPanel(panelConfig);
    this.profilePanelView.render();
    this.scoreboard = new PathwayScoreboard({ currentLevelKey: 'toolchain-trail', basePath: this.gameEnv.path, mountTo: hudMount });
    this.scoreboard.show();
    // Mac setup agent trigger: only offered when macOS is the selected OS.
    this.macSetupCheck = new MacSetupCheck();
    this.macSetupCheck.setVisible(this.selectedOS === 'macos');
    // Linux, Kasm, and Windows/WSL use their own setup-agent panel. The
    // existing macOS component above remains separate and unchanged.
    this.systemSetupCheck = new SystemSetupCheck();
    this.systemSetupCheck.setOS(this.selectedOS);
    // Red flag: the message names the station the student is working on right now.
    this.helpFlag = new HelpFlag({
      getRequest: () => {
        const stationId = this._getActiveStationId();
        const station = stationId ? this._stationById[stationId] : null;
        return {
          levelKey: 'toolchain-trail',
          station: station?.name || null,
          message: buildHelpRequestMessage({
            levelName: 'Toolchain Trail',
            stationName: station?.name,
            osLabel: OS_OPTIONS.find((option) => option.id === this.selectedOS)?.label,
            stuck: stationId ? this.getStationStatus(stationId) === STATION_STATUS.STUCK : false,
          }),
        };
      },
    });

    /**
     * Section: station status derivation + persistence.
     */

    // status per station id, recomputed whenever completedStations changes.
    // this.stationStatus is what's displayed (includes the failure lock);
    // this._baseStationStatus is the real progress that gets saved.
    this.stationStatus = {};
    this._baseStationStatus = {};

    this.getStationStatus = function (stationId) {
      return this.stationStatus[stationId] || STATION_STATUS.LOCKED;
    };

    this._recomputeStationStates = function (persist = true) {
      const nowLocked = {};
      let firstIncompleteIndex = this._nonBossOrder.findIndex((id) => !this.completedStations.has(id));
      if (firstIncompleteIndex === -1) firstIncompleteIndex = this._nonBossOrder.length; // all 6 done

      this._nonBossOrder.forEach((id, index) => {
        if (this.completedStations.has(id)) {
          nowLocked[id] = STATION_STATUS.COMPLETE;
        } else if (index === firstIncompleteIndex) {
          const activatedAt = this._stationActivatedAt[id] || (this._stationActivatedAt[id] = Date.now());
          const stuck = Date.now() - activatedAt > STUCK_THRESHOLD_MS;
          nowLocked[id] = stuck ? STATION_STATUS.STUCK : STATION_STATUS.ACTIVE;
        } else {
          nowLocked[id] = STATION_STATUS.LOCKED;
        }
      });

      const bossId = this.STATIONS.find((s) => s.isBoss)?.id;
      if (bossId) {
        if (this.completedStations.has(bossId)) {
          nowLocked[bossId] = STATION_STATUS.COMPLETE;
        } else if (firstIncompleteIndex >= this._nonBossOrder.length) {
          const activatedAt = this._stationActivatedAt[bossId] || (this._stationActivatedAt[bossId] = Date.now());
          const stuck = Date.now() - activatedAt > STUCK_THRESHOLD_MS;
          nowLocked[bossId] = stuck ? STATION_STATUS.STUCK : STATION_STATUS.ACTIVE;
        } else {
          nowLocked[bossId] = STATION_STATUS.LOCKED;
        }
      }

      // Real progress is saved; the failure lock only changes what's displayed,
      // so it never overwrites completed stations in the student's profile.
      this._baseStationStatus = nowLocked;
      this.stationStatus = this._applyFailureLock(nowLocked);
      this._applyStationVisuals();
      this._updatePanel();

      if (persist) {
        const score = this.completedStations.size / this.STATIONS.length;
        const allDone = this.completedStations.size === this.STATIONS.length;
        void this.profileManager.saveToolchainProgress(
          this._baseStationStatus,
          this._getActiveStationId(),
          score,
          allDone ? new Date().toISOString() : null,
        );
        recordLevelRatio('toolchain-trail', this.completedStations.size, this.STATIONS.length);
      }
    };

    this._getActiveStationId = function () {
      const statuses = this._baseStationStatus || this.stationStatus;
      const activeId = Object.entries(statuses).find(
        ([, status]) => status === STATION_STATUS.ACTIVE || status === STATION_STATUS.STUCK,
      );
      return activeId ? activeId[0] : null;
    };

    this._applyStationVisuals = function () {
      const objects = this.gameEnv?.gameObjects || [];
      this.STATIONS.forEach((station) => {
        const obj = objects.find((o) => o?.spriteData?.id === station.id || o?.data?.id === station.id);
        if (!obj?.canvas) return;
        const status = this.getStationStatus(station.id);
        const hueRotate = STATION_HUE_ROTATE[station.id] || '';
        obj.canvas.style.filter = `${hueRotate} ${STATION_VISUAL_FILTERS[status] || 'none'}`.trim();
      });
      this._syncLockOverlays();
    };

    this._updatePanel = function () {
      const values = {
        name: this.profileData?.name || '—',
        email: this.profileData?.email || '—',
        githubID: this.profileData?.githubID || '—',
        persona: this.profileData?.persona || '—',
        completionIdentityForge: '✓',
        completionWayfindingWorld: '✓',
        completionMissionTools: '✓',
        selectedOS: (() => {
          const opt = OS_OPTIONS.find((o) => o.id === this.selectedOS);
          return opt ? opt.label : 'Not selected';
        })(),
        toolchainScore: (this.completedStations.size / this.STATIONS.length).toFixed(3),
      };
      this.STATIONS.forEach((station) => {
        values[`station_${station.id}`] = formatStationGlyph(this.getStationStatus(station.id), station.isBoss);
      });
      this.profilePanelView.update(values);
    };

    /**
     * Section: station interaction flow.
     */
    this.runStation = async function (stationId, showIntro = false) {
      const station = this._stationById[stationId];
      if (!station) return;
      if (this._stationTrialOpen) return;

      // Failure lock: only the station with the failed command can be opened.
      const failedId = this.failureState?.stationId;
      if (failedId && failedId !== stationId) {
        const failed = this._stationById[failedId];
        await this.showDialogue(`${station.icon} ${station.name}`, [
          `🔒 Locked. A command failed at ${failed.icon} ${failed.name}.`,
          `Go back and fix it. If you don't, you will get a ${FAILURE_GRADE} and FAIL this level.`,
        ]);
        return;
      }

      const status = this.getStationStatus(stationId);

      if (status === STATION_STATUS.LOCKED) {
        await this.showDialogue(`${station.icon} ${station.name}`, [
          station.isBoss
            ? 'Integration Summit is sealed until every other station is verified.'
            : 'This station is still sealed. Complete the earlier stations first.',
        ]);
        return;
      }

      if (status === STATION_STATUS.COMPLETE) {
        await this.showDialogue(`${station.icon} ${station.name}`, [
          `${station.name} is already verified.`,
          station.funFact,
        ]);
        return;
      }

      if (showIntro) {
        await this.showDialogue(`${station.icon} ${station.name}`, [station.narrativeHook]);
      }

      this._stationTrialOpen = true;
      this._openTrialStationId = station.id;
      this._lastPastedOutput = '';
      const trial = new StationVerificationTrial({
        station: this._localizeStation(station),
        os: this.selectedOS || 'linux',
        // If StationVerificationTrial supports it, it can call this with the
        // pasted output before onComplete and skip completion when it returns true.
        onOutputSubmitted: (output) => this._handleTerminalOutput(station.id, output),
        onComplete: async ({ stationId: completedId, output }) => {
          this._stationTrialOpen = false;
          this._openTrialStationId = null;
          // Never verify a station whose pasted output shows an error. Falls
          // back to the text captured from the trial's input box, so this
          // works even if StationVerificationTrial doesn't pass `output`.
          const pasted = output ?? this._lastPastedOutput;
          if (pasted && this._handleTerminalOutput(completedId, pasted)) return;
          if (this.failureState?.stationId === completedId) this._clearFailure();

          this.completedStations.add(completedId);
          this._recomputeStationStates(true);

          this.showToast(`✦ ${station.name} verified`);
          await this.showDialogue(`${station.icon} ${station.name}`, [
            `${station.name} verified!`,
            station.funFact,
          ]);

          if (this.completedStations.size === this.STATIONS.length) {
            this.showToast('★ Toolchain Trail complete!');
            this.markLevelComplete?.();
          }
        },
        onClose: () => {
          this._stationTrialOpen = false;
          this._openTrialStationId = null;
        },
      });
      trial.start();
    };

    /**
     * Section: OS-specific instruction lookup, used to localize a station
     * before it's shown/verified. Falls back to the station's base fields
     * (written Linux-first) when no OS-specific override exists.
     */
    this._localizeStation = function (station) {
      const os = this.selectedOS || 'linux';
      return {
        ...station,
        instructions: station.instructionsByOS?.[os] || station.instructions,
        exampleCommand: station.exampleCommandByOS?.[os] || station.exampleCommand,
        expectedCommandPattern: station.expectedCommandPatternByOS?.[os] || station.expectedCommandPattern,
      };
    };

    /**
     * Section: OS picker modal — shown the first time a student enters the
     * trail (see initialize()) and re-openable via the sidebar action.
     */
    this._promptOSSelection = function (forceShow = false) {
      if (!forceShow && this.selectedOS) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:100060',
        'background:rgba(0,0,0,0.78)',
        'display:flex', 'align-items:center', 'justify-content:center',
      ].join(';');

      const optionBtnStyle = [
        'display:block', 'width:100%', 'padding:10px 0',
        'border-radius:6px', 'border:1px solid #38bdf8',
        'background:#0b1026', 'color:#dbeafe',
        'font-family:"Courier New",monospace', 'font-size:0.92em',
        'cursor:pointer',
      ].join(';');

      const box = document.createElement('div');
      box.style.cssText = [
        'background:#04060f', 'border:1.5px solid #38bdf8', 'padding:26px 30px',
        'border-radius:10px', 'font-family:"Courier New",monospace', 'color:#dbeafe',
        'max-width:380px', 'width:90%', 'box-sizing:border-box',
      ].join(';');

      const optionButtonsHtml = OS_OPTIONS.map((opt) => `
        <button class="tt-os-option" data-os="${opt.id}" style="${optionBtnStyle}">${opt.label}</button>
      `).join('');

      box.innerHTML = `
        <div style="font-size:1.05em;font-weight:bold;margin-bottom:10px;">Choose Your Operating System</div>
        <div style="font-size:0.86em;line-height:1.6;margin-bottom:18px;">
          The Toolchain Trail has you run real terminal commands. Pick the
          system you're working on so each station shows the right steps.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${optionButtonsHtml}
        </div>`;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      box.querySelectorAll('.tt-os-option').forEach((btn) => {
        btn.onclick = () => {
          const osId = btn.getAttribute('data-os');
          this.selectedOS = osId;
          try { localStorage.setItem(OS_STORAGE_KEY, osId); } catch (err) { /* storage unavailable */ }
          overlay.remove();
          this._updatePanel();
          this.macSetupCheck?.setVisible(osId === 'macos');
          this.systemSetupCheck?.setOS(osId);
          const label = OS_OPTIONS.find((o) => o.id === osId)?.label || osId;
          this.showToast(`✦ Toolchain Trail set for ${label}`);
        };
      });
    };

    /**
     * Section: reset (level-scoped — does not touch other levels' progress).
     */
    this._showResetModal = function () {
      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'background:rgba(0,0,0,0.72)',
        'display:flex', 'align-items:center', 'justify-content:center',
      ].join(';');

      const btnBase = [
        'display:block', 'width:100%', 'padding:10px 0',
        'border-radius:6px', 'border:1px solid #38bdf8',
        'font-family:"Courier New",monospace', 'font-size:0.92em',
        'cursor:pointer',
      ].join(';');

      const box = document.createElement('div');
      box.style.cssText = [
        'background:#04060f', 'border:1.5px solid #38bdf8', 'padding:26px 30px',
        'border-radius:10px', 'font-family:"Courier New",monospace', 'color:#dbeafe',
        'max-width:380px', 'width:90%', 'box-sizing:border-box',
      ].join(';');

      box.innerHTML = `
        <div style="font-size:1.05em;font-weight:bold;margin-bottom:10px;">🔄 Reset Toolchain Trail</div>
        <div style="font-size:0.86em;line-height:1.6;margin-bottom:18px;">
          This clears your progress on this level's 7 stations only.
          Identity Forge, Wayfinding World, and Mission Tools are untouched.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button id="tt-reset-confirm" style="${btnBase}background:#3d0000;color:#fca5a5;border-color:#fca5a5;">
            Reset This Level
          </button>
          <button id="tt-reset-cancel" style="${btnBase}background:transparent;color:#94a3b8;border-color:#334155;">
            Cancel
          </button>
        </div>`;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      box.querySelector('#tt-reset-confirm').onclick = async () => {
        overlay.remove();
        this.completedStations.clear();
        this._stationActivatedAt = {};
        this._clearFailure();
        this._recomputeStationStates(true);
        this.showToast('✦ Toolchain Trail progress reset');
      };
      box.querySelector('#tt-reset-cancel').onclick = () => overlay.remove();
    };

    this._stationGatekeeperIds = this.STATIONS.map((s) => s.id);
  }

  /**
   * Section: loading overlay helpers (self-contained for this level).
   */
  _showLoading(message) {
    if (this._loadingOverlay) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 100050;
      background: radial-gradient(circle at 50% 40%, rgba(20,10,50,0.96), rgba(2,2,10,0.98));
      display: flex; align-items: center; justify-content: center;
      color: #93c5fd; font-family: "Courier New", monospace; font-size: 14px;
      letter-spacing: 1px;
    `;
    overlay.textContent = message;
    document.body.appendChild(overlay);
    this._loadingOverlay = overlay;
  }

  _hideLoading() {
    if (this._loadingOverlay?.parentNode) this._loadingOverlay.parentNode.removeChild(this._loadingOverlay);
    this._loadingOverlay = null;
  }

  /**
   * Level initialization: bind gatekeeper reactions, seed sidebar, start stuck-check loop.
   */
  initialize() {
    // First thing the student sees on the trail: pick an OS (skipped if
    // already saved from a previous visit). Shown in the PLAYER PROFILE
    // sidebar afterwards, not a floating corner indicator.
    this._promptOSSelection(true);

    const objects = this.gameEnv?.gameObjects || [];
    const gatekeepers = objects.filter((obj) => this._stationGatekeeperIds?.includes(obj?.spriteData?.id));
    gatekeepers.forEach((gk) => {
      if (typeof gk?.reaction !== 'function' && typeof gk?.spriteData?.reaction === 'function') {
        gk.reaction = gk.spriteData.reaction;
      }
    });
    this._gatekeeperObjects = gatekeepers;
    this._activeZoneStationId = null;

    this.profilePanelView.ensureMounted();
    this._recomputeStationStates(false);

    // Restore the failure warning if the student refreshed while locked.
    if (this.failureState) this._showFailureBanner();

    // Watch any text box the student pastes terminal output into (the station
    // panel, the setup-check panels, etc.). Capture phase, so it still fires
    // even if a panel stops the event from bubbling. The failure is charged
    // to the open station, or the current active station if none is open.
    const checkText = (text, path) => {
      if (!text) return;
      if (path.some((n) => n?.id === PROFILE_PANEL_ID)) return;
      if (this._stationTrialOpen) this._lastPastedOutput = text;
      if (this.failureState) return; // already locked; clears on a clean verify
      const stationId = this._openTrialStationId || this._getActiveStationId();
      if (stationId) this._handleTerminalOutput(stationId, text);
    };

    // Typing/pasting into a textarea, text input, or contenteditable editor.
    // composedPath()[0] reaches the real element even inside a shadow DOM.
    this._onTerminalTextInput = (event) => {
      const path = event.composedPath?.() || [event.target];
      const el = path[0];
      let text = '';
      if (el instanceof HTMLTextAreaElement
        || (el instanceof HTMLInputElement && (el.type === 'text' || el.type === ''))) {
        text = el.value || '';
      } else if (el?.isContentEditable) {
        text = el.innerText || '';
      } else {
        return;
      }
      checkText(text, path);
    };
    document.addEventListener('input', this._onTerminalTextInput, true);

    // Paste: read the clipboard text directly, so it works no matter what
    // kind of box the Practice Check (offline) panel uses.
    this._onTerminalPaste = (event) => {
      const text = event.clipboardData?.getData('text') || '';
      checkText(text, event.composedPath?.() || [event.target]);
    };
    document.addEventListener('paste', this._onTerminalPaste, true);

    // Client-side stuck fallback: re-check every 30s (see stationStatus.js note
    // that the backend's authoritative flag should win once it exists).
    this._stuckCheckInterval = setInterval(() => this._recomputeStationStates(false), 30000);

    // Watch for setup reports uploaded from the student's Terminal.
    void this._checkSetupReport();
    this._setupReportInterval = setInterval(() => this._checkSetupReport(), SETUP_REPORT_POLL_MS);
  }

  /**
   * Per-frame proximity detection for zone alerts (same pattern as Level 1).
   */
  update() {
    // Keep the padlocks glued to the stations and hide the banner while a
    // station panel is open (so it doesn't cover the panel's controls).
    if (this.failureState) {
      this._syncLockOverlays();
      this._positionFailureBanner();
    }

    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player' || obj?.constructor?.name === 'CsPathwayPlayer');
    if (player && this._barrierPolylines) this._applyBarriers(player);
    if (!player || !Array.isArray(this._gatekeeperObjects)) return;

    // Don't draw the "Press E" alert over an open station panel (it covered its Close button).
    if (this._stationTrialOpen) {
      if (this._activeZoneStationId) {
        this.clearZoneAlert();
        this._activeZoneStationId = null;
      }
      return;
    }

    const nearest = this._findNearestGatekeeperInZone(player, this._gatekeeperObjects);
    if (nearest) {
      const zoneMessage = nearest.spriteData?.zoneMessage || 'Press E to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneStationId = nearest.spriteData?.id || null;
    } else if (this._activeZoneStationId) {
      this.clearZoneAlert();
      this._activeZoneStationId = null;
    }
  }

  _applyBarriers(player) {
    try {
      const w = player.width || 0, h = player.height || 0;
      const radius = Math.max(6, Math.min(w, h) * 0.2);
      const c = { x: player.position.x + w / 2, y: player.position.y + h / 2 };
      this._laneHalf = ROAD_ENABLED ? Math.max(60, radius + 38) : 0;
      const road = this._roadSegments();
      const walls = [...this._barrierPolylines, ...this._hudPolylines()];
      let p = c;
      for (let pass = 0; pass < 2; pass++) {
        p = clampToCorridor(p, radius, road, this._laneHalf);
        p = resolveCircle(p, radius, walls);
      }
      player.position.x += p.x - c.x;
      player.position.y += p.y - c.y;
    } catch (e) {
      if (!this._barrierWarned) { console.warn('Barrier update failed:', e); this._barrierWarned = true; }
    }
  }

  // Perimeter road: a rounded rectangle just inside the ring of stations.
  // The center stays empty, and the player is kept on the road.
  _roadLoop() {
    const now = performance.now();
    if (this._loopCache && now - this._loopCacheAt < 50) return this._loopCache;
    const W = this.gameEnv.innerWidth, H = this.gameEnv.innerHeight;
    const est = H / 5;
    const info = {};
    this.STATIONS.forEach((st) => {
      const gk = (this._gatekeeperObjects || []).find((o) => o?.spriteData?.id === st.id);
      const live = (gk?.width || 0) > 0;
      const c = live ? this._getObjectCenter(gk) : { x: st.position.x, y: st.position.y };
      const w = live ? gk.width : est;
      const h = live ? (gk.height || gk.width) : est;
      info[st.id] = { c, dx: 0.2 * w + 0.2 * est + ROAD_PAD, dy: 0.2 * h + 0.2 * est + ROAD_PAD };
    });
    const g = info['terminal-town-gate'], f = info['compiler-canyon-forge'], t = info['editor-isle-tower'];
    const gh = info['git-village-hall'], a = info['github-gateway-arch'];
    const b = info['build-bridge'], s = info['integration-summit'];
    const topY = Math.max(g.c.y + g.dy, f.c.y + f.dy, t.c.y + t.dy);
    const bottomY = Math.min(a.c.y - a.dy, b.c.y - b.dy, s.c.y - s.dy);
    const rightX = gh.c.x - gh.dx;
    const leftX = Math.min(g.c.x, s.c.x);
    // Vertices clockwise from the Gate; indexes 0,1,2,4,6,7,8 are stations 1..7.
    const verts = [
      { x: leftX, y: topY }, { x: f.c.x, y: topY }, { x: t.c.x, y: topY },
      { x: rightX, y: topY }, { x: rightX, y: gh.c.y }, { x: rightX, y: bottomY },
      { x: a.c.x, y: bottomY }, { x: b.c.x, y: bottomY }, { x: leftX, y: bottomY },
    ];
    const loop = roundedLoop(verts, Math.min(W, H) * ROAD_CORNER);
    loop.vertexOf = {
      'terminal-town-gate': 0, 'compiler-canyon-forge': 1, 'editor-isle-tower': 2,
      'git-village-hall': 4, 'github-gateway-arch': 6, 'build-bridge': 7, 'integration-summit': 8,
    };
    this._loopCache = loop;
    this._loopCacheAt = now;
    return loop;
  }

  // The stretch of road between two stations (used to draw the status line).
  _roadPath(fromId, toId) {
    const loop = this._roadLoop();
    const i = loop.vertexOf[fromId], j = loop.vertexOf[toId];
    if (i === undefined || j === undefined || i >= j) return null;
    return loop.points.slice(loop.mids[i], loop.mids[j] + 1);
  }

  // (old) Road waypoints: one per station, offset to the side so the building's solid
  // box is clear of the centerline, plus a hub point between Tower and Git Hall.
  _roadWaypoints() {
    const width = this.gameEnv.innerWidth;
    const height = this.gameEnv.innerHeight;
    const est = height / 5; // sprite size guess until the live objects exist
    const pts = [];
    this.STATIONS.forEach((st) => {
      const gk = (this._gatekeeperObjects || []).find((o) => o?.spriteData?.id === st.id);
      const live = (gk?.width || 0) > 0;
      const c = live ? this._getObjectCenter(gk) : { x: st.position.x, y: st.position.y };
      const w = live ? gk.width : est;
      const h = live ? (gk.height || gk.width) : est;
      const p = { x: c.x, y: c.y };
      const side = ROAD_SIDES[st.id] || 'below';
      // hitbox is ~40% of the sprite; add the player's half-size and a pad
      const dx = 0.2 * w + 0.2 * est + ROAD_PAD;
      const dy = 0.2 * h + 0.2 * est + ROAD_PAD;
      if (side === 'below') p.y += dy;
      else if (side === 'above') p.y -= dy;
      else if (side === 'right') p.x += dx;
      else p.x -= dx;
      pts.push(p);
      if (st.id === 'editor-isle-tower') pts.push({ x: width * 0.5, y: height * 0.5 });
    });
    return pts;
  }

  // Station-to-station road segments, built from the same centers TrailPath draws.
  _roadSegments() {
    if (!ROAD_ENABLED) return [];
    const centers = this._roadLoop().points;
    const segs = [];
    for (let i = 0; i < centers.length - 1; i++) segs.push([centers[i], centers[i + 1]]);
    return segs;
  }

  // Turns HUD DOM elements into closed barrier outlines in game coordinates.
  _hudPolylines() {
    const ids = [PROFILE_PANEL_ID, 'cs-pathway-scoreboard'];
    const container = this.gameEnv?.container || document.body;
    const origin = container.getBoundingClientRect();
    // Screen pixels per game pixel: 1 unless the stage is scaled to fit the window.
    const screenScale = container.offsetWidth ? origin.width / container.offsetWidth : 1;
    const pad = 4;
    const out = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const l = (r.left - origin.left) / screenScale - pad, t = (r.top - origin.top) / screenScale - pad;
      const rt = (r.right - origin.left) / screenScale + pad, b = (r.bottom - origin.top) / screenScale + pad;
      out.push([{ x: l, y: t }, { x: rt, y: t }, { x: rt, y: b }, { x: l, y: b }, { x: l, y: t }]);
    });
    return out;
  }

  _drawBarrierDebug(gameEnv, polylines) {
    const canvas = document.createElement('canvas');
    canvas.width = gameEnv.innerWidth;
    canvas.height = gameEnv.innerHeight;
    canvas.style.cssText = `position:absolute;left:0;top:${gameEnv.top || 0}px;pointer-events:none;z-index:15;`;
    (gameEnv.container || document.body).appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ff3b6b'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    polylines.forEach((pts) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    });
    this._barrierCanvas = canvas;
  }

  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  _getGatekeeperAlertDistancePx(gatekeeper) {
    const alertMultiplier = gatekeeper?.spriteData?.alertDistance ?? 1.25;
    if ((gatekeeper?.width || 0) > 0) return gatekeeper.width * alertMultiplier;
    return (gatekeeper?.interactDistance || 120) * 1.5;
  }

  _findNearestGatekeeperInZone(player, gatekeepers) {
    const playerCenter = this._getObjectCenter(player);
    const collisionIds = player?.state?.collisionEvents || [];

    let nearest = null;
    let nearestDistance = Infinity;

    for (const gatekeeper of gatekeepers) {
      if ((gatekeeper?.width || 0) === 0) continue;
      const gkCenter = this._getObjectCenter(gatekeeper);
      const distance = Math.hypot(playerCenter.x - gkCenter.x, playerCenter.y - gkCenter.y);
      const inCollision = collisionIds.includes(gatekeeper?.spriteData?.id);
      const inZone = inCollision || distance < this._getGatekeeperAlertDistancePx(gatekeeper);
      if (inZone && distance < nearestDistance) {
        nearest = gatekeeper;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  /**
   * Section: failure lock.
   * If terminal output shows a failed command, every station except the
   * failing one is locked, a red padlock is drawn over each, and a pulsing
   * red banner warns the student they'll get a 0.55 and fail.
   */
  _applyFailureLock(statuses) {
    const failedId = this.failureState?.stationId;
    if (!failedId || !this._stationById?.[failedId]) return statuses;
    const locked = {};
    Object.keys(statuses).forEach((id) => {
      locked[id] = id === failedId ? statuses[id] : STATION_STATUS.LOCKED;
    });
    return locked;
  }

  /** Returns true if the output shows a failure (and locks the trail). */
  _handleTerminalOutput(stationId, output) {
    const failure = detectTerminalFailure(output);
    if (!failure) return false;
    this._setFailure(stationId, failure.line, 'paste');
    return true;
  }

  _setFailure(stationId, line, source) {
    console.warn(`[Toolchain Trail] failure detected at ${stationId} (${source}): ${line}`);
    this.failureState = { stationId, line, source, at: new Date().toISOString() };
    try { localStorage.setItem(FAILURE_STORAGE_KEY, JSON.stringify(this.failureState)); } catch (err) { /* storage unavailable */ }
    this._recomputeStationStates(false);
    this._showFailureBanner();
  }

  _clearFailure() {
    if (!this.failureState) return;
    this.failureState = null;
    try { localStorage.removeItem(FAILURE_STORAGE_KEY); } catch (err) { /* storage unavailable */ }
    this._hideFailureBanner();
    this._removeLockOverlays();
    this._recomputeStationStates(false);
  }

  /**
   * Reads the student's latest Terminal setup report from the backend
   * (GET /api/cs-pathway/setup-report). Each new report is handled once:
   * overall FAIL locks the trail; a clean report clears a lock that an
   * earlier report caused. Silently does nothing if the backend is down or
   * the student isn't signed in.
   */
  async _checkSetupReport() {
    if (this._reportCheckBusy) return;
    this._reportCheckBusy = true;
    try {
      const res = await fetch(`${javaURI}/api/cs-pathway/setup-report`, { ...fetchOptions, method: 'GET' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.reportedAt) return;

      let lastSeen = null;
      try { lastSeen = localStorage.getItem(LAST_REPORT_STORAGE_KEY); } catch (err) { /* storage unavailable */ }
      if (String(data.reportedAt) === lastSeen) return;
      try { localStorage.setItem(LAST_REPORT_STORAGE_KEY, String(data.reportedAt)); } catch (err) { /* storage unavailable */ }

      if (String(data.overall).toUpperCase() === 'FAIL') {
        const lines = String(data.report || '').split(/\r?\n/);
        const failLine = (lines.find((l) => /\bFAIL\b/.test(l)) || 'Setup check reported FAIL').trim();
        const stationId = this._openTrialStationId || this._getActiveStationId() || this._nonBossOrder[0];
        this._setFailure(stationId, failLine.length > 160 ? `${failLine.slice(0, 157)}...` : failLine, 'setup-report');
      } else if (this.failureState?.source === 'setup-report') {
        this._clearFailure();
        this.showToast('✦ Setup check passed. Trail unlocked.');
      }
    } catch (err) {
      // Network/CORS failure: the backend isn't reachable from this site, so
      // stop polling instead of logging an error every 5 seconds. Pasted-output
      // detection keeps working without the backend.
      if (this._setupReportInterval) {
        clearInterval(this._setupReportInterval);
        this._setupReportInterval = null;
      }
      console.warn(`${this.logPrefix}: setup report check unavailable (backend unreachable or CORS); polling stopped.`, err);
    } finally {
      this._reportCheckBusy = false;
    }
  }

  _ensureFailureStyles() {
    if (document.getElementById('tt-failure-style')) return;
    const style = document.createElement('style');
    style.id = 'tt-failure-style';
    style.textContent = `
      @keyframes tt-fail-pulse {
        0%, 100% { box-shadow: 0 0 18px 4px rgba(255,23,68,0.7); }
        50% { box-shadow: 0 0 46px 14px rgba(255,23,68,1); }
      }
      @keyframes tt-lock-throb {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.12); }
      }
      .tt-fail-banner { animation: tt-fail-pulse 1.1s ease-in-out infinite; }
      .tt-lock-overlay { animation: tt-lock-throb 1.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .tt-fail-banner, .tt-lock-overlay { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  _showFailureBanner() {
    const station = this._stationById?.[this.failureState?.stationId];
    if (!station) return;
    this._ensureFailureStyles();

    if (!this._failureBannerEl) {
      const el = document.createElement('div');
      el.className = 'tt-fail-banner';
      el.setAttribute('role', 'alert');
      el.style.cssText = `
        position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
        z-index: 100030; pointer-events: none;
        width: 320px; box-sizing: border-box;
        background: linear-gradient(180deg, #ff1744 0%, #b00020 100%);
        border: 2px solid #ffcdd2; border-radius: 8px;
        color: #ffffff; font-family: "Courier New", monospace;
        font-size: 11px; padding: 8px 12px; text-align: center; line-height: 1.35;
      `;
      document.body.appendChild(el);
      this._failureBannerEl = el;
    }

    const el = this._failureBannerEl;
    el.replaceChildren();

    const title = document.createElement('div');
    title.textContent = '⚠ TERMINAL ERROR DETECTED ⚠';
    title.style.cssText = 'font-size:1.25em;font-weight:900;letter-spacing:0.5px;margin-bottom:3px;';

    const where = document.createElement('div');
    where.textContent = this.failureState.source === 'setup-report'
      ? `Your Terminal setup check FAILED (charged to ${station.icon} ${station.name}):`
      : `Your pasted output at ${station.icon} ${station.name} shows a command failed:`;
    where.style.cssText = 'font-size:0.95em;';

    // textContent (not innerHTML) because this is student-pasted text.
    const errLine = document.createElement('code');
    errLine.textContent = this.failureState.line || '(error output)';
    errLine.style.cssText = `
      display:block;margin:5px auto;padding:3px 6px;max-width:100%;
      background:rgba(0,0,0,0.45);border-radius:4px;color:#ffeb3b;
      font-size:0.9em;overflow-wrap:anywhere;
    `;

    const grade = document.createElement('div');
    grade.textContent = `ALL OTHER STATIONS ARE LOCKED. If you don't fix this, you will get a ${FAILURE_GRADE} and FAIL.`;
    grade.style.cssText = 'font-size:1.05em;font-weight:900;margin-top:2px;';

    const fix = document.createElement('div');
    fix.textContent = `Reopen ${station.name}, fix the error, and paste a clean output to unlock the trail.`;
    fix.style.cssText = 'font-size:0.9em;margin-top:3px;opacity:0.95;';

    el.append(title, where, errLine, grade, fix);
    this._positionFailureBanner();
  }

  // Hidden while a station panel is open; shown as soon as it closes, and it
  // stays up until the failing station is verified with clean output.
  _positionFailureBanner() {
    const el = this._failureBannerEl;
    if (!el) return;
    el.style.display = this._stationTrialOpen ? 'none' : 'block';
    if (this._stationTrialOpen) return;

    // Center it inside the road loop (the empty middle of the station ring),
    // converted from game coordinates to screen coordinates.
    const container = this.gameEnv?.container || document.body;
    const rect = container.getBoundingClientRect();
    const scale = container.offsetWidth ? rect.width / container.offsetWidth : 1;
    let cx = this.gameEnv.innerWidth / 2;
    let cy = this.gameEnv.innerHeight / 2;
    let innerW = this.gameEnv.innerWidth * 0.5;
    try {
      const pts = this._roadLoop().points;
      const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      cx = (minX + maxX) / 2;
      cy = (minY + maxY) / 2;
      innerW = (maxX - minX) * 0.7;
    } catch (err) { /* fall back to the map center */ }

    el.style.left = `${rect.left + cx * scale}px`;
    el.style.top = `${rect.top + cy * scale}px`;
    el.style.width = `${Math.max(220, Math.min(320, innerW * scale))}px`;
  }

  _hideFailureBanner() {
    this._failureBannerEl?.remove();
    this._failureBannerEl = null;
  }

  // Big red padlock drawn over every station except the one that failed.
  _syncLockOverlays() {
    const failedId = this.failureState?.stationId;
    if (!failedId) { this._removeLockOverlays(); return; }
    this._ensureFailureStyles();
    this._lockOverlays = this._lockOverlays || {};
    const objects = this.gameEnv?.gameObjects || [];

    this.STATIONS.forEach((station) => {
      let el = this._lockOverlays[station.id];
      if (station.id === failedId) {
        el?.remove();
        delete this._lockOverlays[station.id];
        return;
      }
      const obj = objects.find((o) => o?.spriteData?.id === station.id || o?.data?.id === station.id);
      const rect = obj?.canvas?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      if (!el) {
        el = document.createElement('div');
        el.className = 'tt-lock-overlay';
        el.textContent = '🔒';
        el.style.cssText = `
          position: fixed; z-index: 100005; pointer-events: none;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; line-height: 1;
          background: rgba(213,0,0,0.45); border: 4px solid #ff1744;
          box-shadow: 0 0 24px 6px rgba(255,23,68,0.8);
          transform: translate(-50%, -50%);
        `;
        document.body.appendChild(el);
        this._lockOverlays[station.id] = el;
      }
      const size = Math.max(48, Math.min(rect.width, rect.height) * 0.6);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.fontSize = `${size * 0.55}px`;
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top = `${rect.top + rect.height / 2}px`;
      el.style.display = this._stationTrialOpen ? 'none' : 'flex';
    });
  }

  _removeLockOverlays() {
    Object.values(this._lockOverlays || {}).forEach((el) => el.remove());
    this._lockOverlays = {};
  }

  markLevelComplete() {
    // Hook for whatever cross-level "completion" bookkeeping Level 1 uses
    // elsewhere in the codebase (e.g. cs_pathway_completion key). Left as a
    // simple no-op placeholder here so teammates can wire it to the shared
    // completion tracker without this file needing to know its internals.
    console.log(`${this.logPrefix}: level complete`);
  }

  destroy() {
    console.log(`[${this.logPrefix}] tearing down level...`);
    this.scoreboard?.destroy();
    this._barrierCanvas?.remove();
    this.macSetupCheck?.destroy();
    this.systemSetupCheck?.destroy();
    this.helpFlag?.destroy();
    if (this._stuckCheckInterval) clearInterval(this._stuckCheckInterval);
    if (this._setupReportInterval) clearInterval(this._setupReportInterval);
    this._hideLoading();
    this._hideFailureBanner();
    this._removeLockOverlays();
    if (this._onTerminalTextInput) document.removeEventListener('input', this._onTerminalTextInput, true);
    if (this._onTerminalPaste) document.removeEventListener('paste', this._onTerminalPaste, true);
    this.clearZoneAlert?.();
    if (this._toastEl?.parentNode) this._toastEl.parentNode.removeChild(this._toastEl);
    if (this.levelDialogueSystem) {
      if (typeof this.levelDialogueSystem.destroy === 'function') {
        this.levelDialogueSystem.destroy();
      } else {
        this.levelDialogueSystem.closeDialogue?.();
      }
    }
    if (this.profilePanelView) this.profilePanelView.destroy();
  }
}

export default GameLevelCsPath4Toolchain;