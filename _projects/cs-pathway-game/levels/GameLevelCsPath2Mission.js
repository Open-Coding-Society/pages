import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '@assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiChallengeNpc, { CHALLENGE_ERROR_TYPES, CHALLENGE_VERDICTS } from '@assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import StatusPanel from '@assets/js/GameEnginev1.1/essentials/StatusPanel.js';

// Prompt templates for AI question generation and grading.
const CHALLENGE_PROMPT_TEXT = {
  QUESTION_ROLE: 'You are {{deskName}} in a classroom coding game.',
  QUESTION_FOCUS: 'Generate exactly one challenge question focused on: {{expertise}}.',
  QUESTION_CONCISE: 'Use the provided desk context and keep the question concise (max 18 words).',
  QUESTION_SHORT_ANSWER: 'The challenge should require a short written answer from a student.',
  QUESTION_BEGINNER_LEVEL: 'Target absolute beginners. Ask only one simple idea per question.',
  QUESTION_PLAIN_WORDS: 'Use plain words a beginner would understand. Avoid jargon unless it is a basic class term.',
  QUESTION_NO_TRICKS: 'Do not ask trick, edge-case, multi-step, or comparison-heavy questions.',
  QUESTION_ALLOWED_SHAPES: 'Use one of these easy formats: "What command...", "What is...", "Which file...", or "Why do we...".',
  QUESTION_FORMAT: 'Do not include explanation, rubric, markdown, numbering, or extra text.',
  QUESTION_TOPIC_HEADER: 'Desk topic examples:\n{{sampleTopics}}',
  QUESTION_VARIETY_HEADER: 'Question style options:\n{{questionStyles}}',
  QUESTION_RECENT_HEADER: 'Recently used questions to avoid repeating:\n{{recentQuestions}}',
  QUESTION_ANTI_REPEAT: 'Do not repeat or closely paraphrase any recent question. Prefer a fresh angle each time.',
  QUESTION_UNIQUE_STYLE: 'Choose a different question style than the recent examples when possible.',
  QUESTION_ADVANCED_MODE: 'Mission scoreboard is 4/4. Switch to advanced mode and make the question noticeably harder.',
  QUESTION_ADVANCED_FOCUS: 'Ask for deeper understanding, not just a memorized fact.',
  QUESTION_ADVANCED_RULES: 'Use a question that may combine two related ideas, require a comparison, or ask for a troubleshooting choice.',
  QUESTION_ADVANCED_KEEP_SHORT: 'Keep the question concise, but more challenging than the earlier desk questions.',

  EVAL_ROLE: 'You are grading a student answer for {{deskName}}.',
  EVAL_EXPERTISE: 'Desk expertise: {{expertise}}.',
  EVAL_SCOPE: 'Assess whether the student answer is correct, mostly correct, or incorrect.',
  EVAL_QUESTION: 'Challenge question: {{question}}',
  EVAL_ANSWER: 'Student answer: {{answer}}',
  EVAL_FORMAT: 'Respond in exactly two lines and nothing else:',
  EVAL_VERDICT: 'VERDICT: RIGHT or WRONG',
  EVAL_FEEDBACK: 'FEEDBACK: one short sentence with actionable feedback.',
  EVAL_RIGHT_RULE: 'Mark RIGHT for correct or mostly correct answers.',
};

const CHALLENGE_ERROR_MESSAGES = {
  [CHALLENGE_ERROR_TYPES.HTTP_ERROR]: (status) => `Challenge request failed (${status}).`,
  [CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE]: () => 'Challenge response was empty.',
  [CHALLENGE_ERROR_TYPES.INVALID_RESPONSE]: () => 'Challenge response format was invalid.',
  [CHALLENGE_ERROR_TYPES.UNKNOWN]: () => 'Challenge generation failed.',
};

const CHALLENGE_QUESTION_STYLES = [
  'Ask for one basic command the student should memorize.',
  'Ask what a single beginner term means.',
  'Ask which file, tool, or button to use first.',
  'Ask for one simple reason we do a basic step.',
  'Ask for one short safety or setup check.',
  'Ask for one small action before running code.',
  'Ask for one clear yes/no understanding check with a short explanation.',
  'Ask for one beginner-friendly definition using simple words.',
];

const CHALLENGE_ADVANCED_QUESTION_STYLES = [
  'Ask for a two-step explanation that connects a command or concept to a result.',
  'Ask which option is better and why, using one concrete reason.',
  'Ask for a small troubleshooting decision with a likely fix.',
  'Ask for a more specific command, file, or setting and what it changes.',
  'Ask for a brief compare-and-contrast between two related terms.',
  'Ask for one practical workflow step plus a short reason it matters.',
  'Ask a scenario question that needs the student to choose the correct action.',
  'Ask for a short explanation that uses at least two key terms correctly.',
];

const CHALLENGE_RECENT_HISTORY_LIMIT = 12;

// ── Desk Knowledge Base ─────────────────────────────────────────────────────
// Keyed by desk id. Each entry provides an expertise string (AI topic focus)
// and sample Q&A pairs the AI uses for variety (not asked verbatim).
const DESK_AI_KNOWLEDGE_BASE = {
  'The Admin': {
    expertise: 'Linux terminal usage, WSL setup for Windows, installing and managing tool versions with Brew (macOS) and Apt (Ubuntu/Kali/Mint), VSCode setup with extensions like GitLens and Jupyter, and verifying correct installation of Python, pip, Ruby, Bundler, Gem, Jupyter, and Git config',
    questions: [
      { question: 'What command checks which version of Python is active in your terminal?', answer: 'python --version — if it shows 2.x you may need python3 --version; your venv should point to the correct version.' },
      { question: 'How do you verify pip is installed and see its version?', answer: 'pip --version — it also shows which Python it is linked to, so you can confirm it matches your active venv.' },
      { question: 'What command confirms Ruby is installed and shows its version?', answer: 'ruby -v — on macOS use Brew (brew install ruby); on Ubuntu/Kali/Mint use apt (sudo apt install ruby-full).' },
      { question: 'How do you check that Bundler and Gem are installed correctly?', answer: 'bundle -v and gem -v — Bundler manages Ruby gem dependencies per project the same way pip manages Python packages.' },
      { question: 'What command verifies Jupyter is installed and shows its version?', answer: 'jupyter --version — also run jupyter kernelspec list to confirm the correct Python kernel is registered.' },
      { question: 'How do you set your Git global username and email, and how do you verify them?', answer: 'git config --global user.name "Your Name" and git config --global user.email "you@example.com"; verify with git config --global user.name and git config --global user.email.' },
      { question: 'How do you install a tool with Brew on macOS and keep it updated?', answer: 'brew install <tool> to install; brew upgrade <tool> to update a specific tool; brew update first to refresh the formula list.' },
      { question: 'How do you install a tool with Apt on Ubuntu, Kali, or Mint?', answer: 'sudo apt update first to refresh the package list, then sudo apt install <package> — use apt list --installed | grep <name> to verify.' },
      { question: 'What is WSL and why do Windows developers use it for this course?', answer: 'WSL (Windows Subsystem for Linux) runs a real Linux kernel inside Windows, giving access to Bash, Apt, and Linux-native tools so the dev environment matches macOS and Linux classmates.' },
      { question: 'Which VSCode extensions should every student install for this course?', answer: 'GitLens (git history and blame), Python (ms-python.python), Jupyter (ms-toolsai.jupyter) — install via the VSCode Marketplace or code --install-extension <id> in the terminal.' },
    ],
  },
  'The Archivist': {
    expertise: 'file and folder creation, correct naming conventions, cloning teacher reference repos, managing individual and team repositories, creating and activating a venv per project, running make or local dev commands only within an active venv, and when to use a fork versus a template repository',
    questions: [
      { question: 'What naming convention should you use for files and folders in a project?', answer: 'Use lowercase letters, hyphens or underscores instead of spaces, and descriptive names that reflect content — e.g. game-engine.js, not myFile2.' },
      { question: 'What command clones a remote repository to your local machine?', answer: 'git clone <url> — creates a local copy of the repo including all history and branches.' },
      { question: 'How do you clone a teacher reference repo without mixing it with your own work?', answer: 'Clone it into a clearly named read-only folder (e.g. opencs/), never commit to it, and pull updates with git pull when the teacher publishes changes.' },
      { question: 'What is the purpose of a virtual environment (venv) in a OpenCS project?', answer: 'A venv isolates project dependencies so each project has its own package versions that do not conflict with other projects or the system Python.' },
      { question: 'What is the correct sequence to create and activate a venv for a new project?', answer: 'python3 -m venv venv, then source venv/bin/activate (macOS/Linux), use ./scripts/venv.sh to get Python and Ruby dependencies' },
      { question: 'Why should you only run make or local dev commands inside an active venv?', answer: 'Without an active venv the command will fail on missing packages, produce failures, or pollute the global environment.' },
      { question: 'How do you tell whether a venv is currently active in your terminal?', answer: 'The shell prompt shows the venv name in parentheses, e.g. (venv).' },
      { question: 'What is the difference between a personal repo and a team (fork/org) repo, and how do you manage both?', answer: 'Your personal repo is the origin you push to; the team repo is upstream. Add it as a remote (git remote add upstream <url>), sync with git fetch upstream, and merge selectively.' },
      { question: 'When should you fork a repo instead of using a template?', answer: 'Fork when you intend to contribute changes back to the original owner via a pull request — the fork keeps a live link to the upstream repo.' },
      { question: 'When should you use a template repo instead of forking?', answer: 'Use a template when you want a clean starting point that is isolated from the original — you can still pull upstream updates manually but there is no automatic PR link.' },
      { question: 'How do you pull upstream updates into a repo created from a template?', answer: 'Add the template as a remote (git remote add upstream <url>), fetch with git fetch upstream, then merge or cherry-pick the changes you want into your branch.' },
    ],
  },
  'The SDLC Master': {
    expertise: 'individual and team practices across the software development lifecycle: creating issues, writing code, building, testing, committing, and integrating — all in small increments using continuous integration and agile iteration',
    questions: [
      { question: 'Why should you create an issue before writing code?', answer: 'Issues document intent, allow team discussion, and link commits to requirements so changes are always traceable.' },
      { question: 'What makes a good commit message?', answer: 'A short imperative summary line, a blank line, then a body explaining why — not what — the change was made.' },
      { question: 'What is the purpose of a build step in the SDLC?', answer: 'It compiles or bundles code, catches compile-time errors early, and produces a reproducible artifact before testing.' },
      { question: 'How small should an increment be in agile development?', answer: 'Small enough to complete, test, and integrate within a single sprint — ideally hours to a day, not weeks.' },
      { question: 'What is continuous integration (CI) and why does it matter?', answer: 'CI automatically builds and tests every commit so integration bugs are caught immediately rather than at release time.' },
      { question: 'What should you do before committing code to the main branch?', answer: 'Run local tests, review the diff, write a meaningful commit message, and confirm the build build with Make and passes in CI after Sync.' },
      { question: 'What is the difference between unit testing and integration testing?', answer: 'Unit tests verify a single function or class in isolation; integration tests verify that multiple components work together correctly.' },
      { question: 'How does branching support small-increment development?', answer: 'Short-lived feature branches let each increment be developed independently, reviewed via pull request, and merged only when passing all checks.' },
    ],
  },
  'The Scrum Master': {
    expertise: 'agile manifesto, scrum board setup, issue tracking, sprint ceremonies such as standups retrospectives and planning, and team collaboration practices',
    questions: [
      { question: 'What are the four values of the Agile Manifesto?', answer: 'Individuals over processes, working software over documentation, customer collaboration over contracts, and responding to change over following a plan.' },
      { question: 'How do you set up a scrum board?', answer: 'Create columns for Backlog, In Progress, Review, and Done, then populate with user story cards prioritized by the product owner.' },
      { question: 'What is the purpose of a daily standup?', answer: 'A short sync (≤15 min) where each team member shares what they did yesterday, what they will do today, and any blockers.' },
      { question: 'How do you write a good user story?', answer: 'Use the format: As a [role], I want [feature], so that [benefit]. Include acceptance criteria.' },
      { question: 'What happens in a sprint retrospective?', answer: 'The team reflects on what went well, what to improve, and agrees on one or two actionable changes for the next sprint.' },
      { question: 'How do you track issues in a project?', answer: 'Create issues with a clear title, description, acceptance criteria, priority label, and assignee; link them to the relevant sprint or milestone.' },
      { question: 'What is the difference between a product backlog and a sprint backlog?', answer: 'The product backlog is the full prioritized wish list; the sprint backlog is the subset committed to for the current sprint.' },
      { question: 'What is the role of the scrum master?', answer: 'Facilitate ceremonies, remove blockers, protect the team from scope creep, and coach the team on agile practices.' },
    ],
  },
};

/**
 * GameLevel CS Pathway - Mission Tools
 */
class GameLevelCsPath2Mission extends GameLevelCsPathIdentity {
  static levelId = 'mission-tools';
  static displayName = 'Mission Tools';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelCsPath2Mission.displayName,
      logPrefix: 'Mission Tools',
    });
    const level = this;

    let { width, height, path } = this.getLevelDimensions();

    this.profilePanelView = new StatusPanel({
      id: 'csse-mission-panel',
      title: 'MISSION TOOLS',
      fields: [
        { key: 'desk1', label: 'Workbench 1', emptyValue: '—' },
        { key: 'desk2', label: 'Workbench 2', emptyValue: '—' },
        { key: 'desk3', label: 'Workbench 3', emptyValue: '—' },
        { key: 'desk4', label: 'Workbench 4', emptyValue: '—' },
        { type: 'section', title: 'MISSION SCOREBOARD', marginTop: '10px' },
        { key: 'missionScore', label: 'Score', emptyValue: '.55' },
        { key: 'missionCleared', label: 'Cleared', emptyValue: '0/4' },
      ],
      theme: {
        background: 'var(--ocs-game-panel-bg, rgba(13,13,26,0.92))',
        borderColor: 'var(--ocs-game-accent, #4ecca3)',
        textColor: 'var(--ocs-game-text, #e0e0e0)',
        accentColor: 'var(--ocs-game-accent, #4ecca3)',
        secondaryButtonBackground: 'var(--ocs-game-surface-alt, #1a1a2e)',
        secondaryButtonTextColor: 'var(--ocs-game-text, #e0e0e0)',
      },
      position: { top: '16px', left: '16px' },
      width: '260px',
      padding: '12px 14px',
      zIndex: '10000',
      fontFamily: '"Courier New", monospace',
    });
    this.profilePanelView.render();
    this.profilePanelView.update({
      desk1: '—',
      desk2: '—',
      desk3: '—',
      desk4: '—',
      missionScore: '.55',
      missionCleared: '0/4',
    });

    /**
     * Section: Level objects.
     */

    // ── Background ──────────────────────────────────────────────
    const image_src = path + "/images/projects/cs-pathway-game/bg2/mission-tools-fantasy.png";
    const bg_data = {
        name: GameLevelCsPath2Mission.displayName,
        greeting: "Welcome to the CS pathway! This quest will prepare you for your mission ahead by introducing your essential tools and resources!",
        src: image_src,
    };

    this.restoreIdentitySelections({
      bgData: bg_data,
      themeManifestUrl: `${path}/images/projects/cs-pathway-game/bg2/index.json`,
      themeAssetPrefix: `${path}/images/projects/cs-pathway-game/bg2/`,
    });

    // FriendlyNpc looks up toast via gameEnv.currentLevel/gameLevel in this engine build.
    this.gameEnv.currentLevel = this;
    this.gameEnv.gameLevel = this;
    
    // ── Player ───────────────────────────────────────────────────
    const player_src = path + "/images/projects/cs-pathway-game/player/minimalist.png";
    const PLAYER_SCALE_FACTOR = 5;
    const player_data = {
      id: 'Minimalist_Identity',
      greeting: "Hi I am a new adventurer on the CS pathway!",
      src: player_src,
      SCALE_FACTOR: PLAYER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / PLAYER_SCALE_FACTOR) },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down:      { row: 0, start: 0, columns: 1 },
      downRight: { row: 0, start: 0, columns: 1, rotate:  Math.PI / 16 },
      downLeft:  { row: 0, start: 0, columns: 1, rotate: -Math.PI / 16 },
      left:      { row: 1, start: 0, columns: 1, mirror: true },
      right:     { row: 1, start: 0, columns: 1 },
      up:        { row: 0, start: 1, columns: 1 },
      upLeft:    { row: 1, start: 0, columns: 1, mirror: true, rotate:  Math.PI / 16 },
      upRight:   { row: 1, start: 0, columns: 1, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    this.primeAssetGate({
      playerSrc: player_data.src,
      backgroundSrc: bg_data.src,
    });

    // Toast helper for zone prompts.
    this.showToast = function(message) {
      if (message === 'Press E to interact') {
        return;
      }

      const host = document.body;
      if (!host) return;

      if (this._toastEl?.parentNode) {
        this._toastEl.parentNode.removeChild(this._toastEl);
      }
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        z-index: 1200; pointer-events: none;
        background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
        color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
        padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
        box-shadow: 0 0 20px rgba(78,204,163,0.25);
        width: min(360px, 32vw); text-align: left;
      `;
      toast.textContent = message;
      host.appendChild(toast);

      this._toastEl = toast;
      this._toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (this._toastEl === toast) this._toastEl = null;
        this._toastTimer = null;
      }, 2200);
    };

    this.setZoneAlert = function(message) {
      const host = document.body;
      if (!host) return;

      if (!this._zoneAlertEl) {
        const zoneAlert = document.createElement('div');
        zoneAlert.style.cssText = `
          position: fixed; top: 84px; right: 20px;
          z-index: 1201; pointer-events: none;
          background: rgba(13,13,26,0.95); border: 2px solid #4ecca3;
          color: #4ecca3; font-family: 'Courier New', monospace; font-size: 13px;
          padding: 10px 16px; border-radius: 8px; letter-spacing: 0.6px;
          box-shadow: 0 0 20px rgba(78,204,163,0.25);
          width: min(360px, 32vw); text-align: left;
        `;
        document.body.appendChild(zoneAlert);
        this._zoneAlertEl = zoneAlert;
      }

      this._zoneAlertEl.textContent = message;
    };

    this.clearZoneAlert = function() {
      if (this._zoneAlertEl?.parentNode) {
        this._zoneAlertEl.parentNode.removeChild(this._zoneAlertEl);
      }
      this._zoneAlertEl = null;
    };


    const gatekeeperBaseData = {
      src: path + '/images/projects/cs-pathway-game/npc/gatekeeper2.png',
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

    const createGatekeeperData = ({ id, greeting, position, reaction, interact, interactDistance }) => ({
      ...gatekeeperBaseData,
      id,
      greeting,
      INIT_POSITION: { ...position },
      interactDistance: interactDistance || 120,
      reaction: function () {
        if (reaction) reaction.call(this);
        if (level?.showToast) {
          level.showToast('Click desk to start challenge.');
        }
      },
      ...(interact ? { interact } : {}),
    });

    const deskAiKnowledgeBase = {
      'debug-assistant': [
        { question: 'How do I isolate a bug quickly?', answer: 'Reproduce, narrow the scope, inspect state changes, then retest.' },
      ],
      'design-assistant': [
        { question: 'How can I improve the user flow?', answer: 'Remove friction points and make the next action obvious.' },
      ],
      'data-assistant': [
        { question: 'How should I store this data?', answer: 'Pick structures based on retrieval and update patterns.' },
      ],
      'planning-assistant': [
        { question: 'How do I break down a feature?', answer: 'Split into milestones with clear outcomes and tests.' },
      ],
    };

    const createHiddenMissionDesk = ({ id, expertise, position, zonePrompt }) => ({
      zoneMessage: `${id}: ${zonePrompt}`,
      ...createGatekeeperData({
        id,
        greeting: `${id} ready. ${zonePrompt}`,
        position,
        interactDistance: 40,
        interact: function (_clicks, _objectId, npc) {
          level.startDeskChallenge(this, id, npc);
        },
      }),
      visible: false,
      clickOnly: true,
      hitbox: { widthPercentage: 0.35, heightPercentage: 0.35 },
      alertDistance: 0.30,
      dialogues: [
        `${id} channel online.`,
        'Ask your mission question and I will guide you.',
      ],
      expertise,
      chatHistory: [],
      knowledgeBase: deskAiKnowledgeBase,
      zoneUnlocked: true,
    });

    const missionDeskZones = [
      createHiddenMissionDesk({
        id: 'The Admin',
        expertise: 'how to work different operating systems',
        position: { x: width * 0.20, y: height * 0.17 },
        zonePrompt: 'Move to desk and click to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Archivist',
        expertise: 'how to manage files and folders',
        position: { x: width * 0.67, y: height * 0.17 },
        zonePrompt: 'Move to desk and click to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The SDLC Master',
        expertise: 'what SDLC is',
        position: { x: width * 0.18, y: height * 0.60 },
        zonePrompt: 'Move to desk and click to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Scrum Master',
        expertise: 'how to set up a scrum board',
        position: { x: width * 0.62, y: height * 0.58 },
        zonePrompt: 'Move to desk and click to start challenge.',
      }),
    ];

    // List of objects definitions for this level
    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: Player, data: player_data },
      ...missionDeskZones.map((zone) => ({ class: FriendlyNpc, data: zone })),
    ];

    this._missionDeskIds = missionDeskZones.map((zone) => zone.id);
    this._challengeLog = [];
    this._deskChallengeBusy = new Set();
    this._deskChallengeEvalBusy = new Set();
    this._activeDeskChallenges = new Map();
  }

  // Find desk objects after engine instantiates them and apply runtime behavior patches.
  initialize() {
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._missionDeskIds?.includes(obj?.spriteData?.id));
    this._rebindMissingDeskReactions(desks);
    this._wireDeskClickDistanceGate(desks);

    console.log('[MissionTools] desk reactions rebound:', desks.map((d) => ({
      id: d?.spriteData?.id,
      hasReaction: typeof d?.reaction === 'function',
      hasSpriteReaction: typeof d?.spriteData?.reaction === 'function',
    })));

    this._missionDeskObjects = desks;
    this._activeZoneDeskId = null;
  }

  // Entry point when a desk is clicked in-range: generate one question and arm submission.
  async startDeskChallenge(desk, deskId, npcRef = null) {
    const npc = npcRef || desk;
    if (!npc?.spriteData?.id) return;

    const npcId = npc.spriteData.id;
    // Orchestrator: open UI, generate one question, then arm answer submission.
    await this._runBusyTask({
      busySet: this._deskChallengeBusy,
      key: npcId,
      busyMessage: `${deskId}: challenge is already loading.`,
      task: async () => {
        try {
          this.showToast?.(`${deskId}: challenge channel opened.`);
          AiNpc.showInteraction(npc);
          const challengeQuestion = await this._runWithLoading(() => this._loadDeskChallengeQuestion(npc.spriteData));
          this._deliverChallengeToNpc(npc, challengeQuestion);
          this._armChallengeSubmission(npc, deskId, challengeQuestion);
          this._logChallengeEvent({
            deskId,
            expertise: npc?.spriteData?.expertise || '',
            question: challengeQuestion,
            createdAt: Date.now(),
          });
        } catch (error) {
          this._handleChallengeFailure(npc, deskId, error);
        }
      },
    });
  }

  // Generic concurrency guard keyed per desk so duplicate async actions do not overlap.
  async _runBusyTask({ busySet, key, busyMessage, task }) {
    // Shared guard so generation/evaluation cannot overlap per desk instance.
    if (busySet.has(key)) {
      if (busyMessage) this.showToast?.(busyMessage);
      return;
    }

    busySet.add(key);
    try {
      await task();
    } finally {
      busySet.delete(key);
    }
  }

  // Wrap async work with level spinner lifecycle so loading UX stays consistent.
  async _runWithLoading(task) {
    // Keeps spinner lifecycle consistent for any async challenge operation.
    this.queueLoadingWork();
    try {
      return await task();
    } finally {
      this.finishLoadingWork();
    }
  }

  // Build and execute question-generation request, then normalize to one display line.
  async _loadDeskChallengeQuestion(spriteData) {
    const prompt = this._buildChallengePrompt(spriteData);
    const raw = await this._requestChallengeAiText(spriteData, prompt);
    return this._extractFirstChallengeLine(raw);
  }

  // Build and execute answer-evaluation request, then parse verdict + feedback.
  async _loadChallengeEvaluation(spriteData, question, answer) {
    const prompt = this._buildChallengeEvaluationPrompt(spriteData, question, answer);
    const raw = await this._requestChallengeAiText(spriteData, prompt);
    return this._parseChallengeEvaluation(raw);
  }

  // Shared request chain used by both question generation and answer evaluation.
  async _requestChallengeAiText(spriteData, prompt) {
    // Unified request pipeline used by both question generation and answer grading.
    const payload = this._buildChallengeRequestPayload(spriteData, prompt);
    const response = await this._postChallengeRequest(payload);
    const data = await this._parseChallengeResponseData(response);
    return this._extractAiResponseText(data);
  }

  // Create backend payload shape for this level's AI challenge requests.
  _buildChallengeRequestPayload(spriteData, prompt) {
    return {
      prompt,
      session_id: `mission-challenge-${spriteData?.id || 'desk'}`,
      npc_type: spriteData?.expertise || 'challenge',
      expertise: spriteData?.expertise || 'challenge',
      knowledgeContext: 'Mission Tools challenge generation',
    };
  }

  // Send request to AI backend and convert non-2xx status into typed error codes.
  async _postChallengeRequest(payload) {
    const pythonURL = `${pythonURI}/api/ainpc/prompt`;
    const response = await fetch(pythonURL, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_${response.status}`);
    }

    return response;
  }

  // Parse JSON safely so malformed body maps to a known error category.
  async _parseChallengeResponseData(response) {
    try {
      return await response.json();
    } catch (_error) {
      throw new Error(CHALLENGE_ERROR_TYPES.INVALID_RESPONSE);
    }
  }

  // Keep generated question concise by taking first non-empty line only.
  _extractFirstChallengeLine(raw) {
    const firstLine = raw.split(/\r?\n/).find((line) => line.trim().length > 0) || raw;
    return firstLine.trim();
  }

  // Standard extractor for model text response with empty-response validation.
  _extractAiResponseText(data) {
    const raw = (data?.response || '').toString().trim();
    if (!raw) {
      throw new Error(CHALLENGE_ERROR_TYPES.EMPTY_RESPONSE);
    }
    return raw;
  }

  // Prompt template that forces a strict 2-line grading format for easy parsing.
  _buildChallengeEvaluationPrompt(spriteData, question, answer) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';

    return [
      `You are grading a student answer for ${deskName}.`,
      `Desk expertise: ${expertise}.`,
      'Assess whether the student answer is correct, mostly correct, or incorrect.',
      `Challenge question: ${question}`,
      `Student answer: ${answer}`,
      'Respond in exactly two lines and nothing else:',
      'VERDICT: RIGHT or WRONG',
      'FEEDBACK: one short sentence with actionable feedback.',
      'Mark RIGHT for correct or mostly correct answers.',
    ].join('\n\n');
  }

  /**
   * History key. Returns a stable per-desk key so question history
   * stays isolated between stations.
   * @private
   */
  _getMissionQuestionHistoryKey(spriteData) {
    return spriteData?.id || 'desk';
  }

  /**
   * Normalize question. Strips punctuation and folds case so repeat
   * comparisons are not sensitive to surface differences.
   * @private
   */
  _normalizeMissionQuestion(question) {
    return (question || '')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();
  }

  /**
   * Record question. Appends the question to the rolling per-desk history,
   * capped at CHALLENGE_RECENT_HISTORY_LIMIT entries.
   * @private
   */
  _recordMissionQuestion(spriteData, question) {
    const key = this._getMissionQuestionHistoryKey(spriteData);
    const normalized = this._normalizeMissionQuestion(question);
    if (!normalized) return;

    const existing = this._missionQuestionHistory.get(key) || [];
    const nextHistory = [...existing, question].slice(-CHALLENGE_RECENT_HISTORY_LIMIT);
    this._missionQuestionHistory.set(key, nextHistory);
  }

  /**
   * Get history. Returns the recent question list for the given desk.
   * @private
   */
  _getRecentMissionQuestions(spriteData) {
    const key = this._getMissionQuestionHistoryKey(spriteData);
    return this._missionQuestionHistory.get(key) || [];
  }

  /**
   * Detect repeat. Returns true if the question matches any recent question
   * at this station after normalization.
   * @private
   */
  _isRepeatedMissionQuestion(spriteData, question) {
    const normalizedQuestion = this._normalizeMissionQuestion(question);
    if (!normalizedQuestion) return false;

    return this._getRecentMissionQuestions(spriteData).some((recentQuestion) => {
      return this._normalizeMissionQuestion(recentQuestion) === normalizedQuestion;
    });
  }

  /**
   * Build prompt. Assembles the question-generation prompt injecting
   * expertise, style options, and recent questions to maximize variety.
   * @private
   */
  _buildChallengePrompt(spriteData) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';
    const advancedMode = (this._missionProgressCount || 0) >= 4;
    const sampleTopics = (spriteData?.knowledgeBase?.[deskName]?.questions || [])
      .slice(0, 8)
      .map((topic) => `- ${topic.question}`)
      .join('\n');
    const recentQuestions = this._getRecentMissionQuestions(spriteData)
      .slice(-CHALLENGE_RECENT_HISTORY_LIMIT)
      .map((question) => `- ${question}`)
      .join('\n');
    const questionStyles = (advancedMode ? CHALLENGE_ADVANCED_QUESTION_STYLES : CHALLENGE_QUESTION_STYLES)
      .map((style, index) => `${index + 1}. ${style}`)
      .join('\n');

    return [
      CHALLENGE_PROMPT_TEXT.QUESTION_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.QUESTION_FOCUS.replace('{{expertise}}', expertise),
      advancedMode ? CHALLENGE_PROMPT_TEXT.QUESTION_ADVANCED_MODE : CHALLENGE_PROMPT_TEXT.QUESTION_BEGINNER_LEVEL,
      CHALLENGE_PROMPT_TEXT.QUESTION_CONCISE,
      CHALLENGE_PROMPT_TEXT.QUESTION_SHORT_ANSWER,
      advancedMode ? CHALLENGE_PROMPT_TEXT.QUESTION_ADVANCED_FOCUS : CHALLENGE_PROMPT_TEXT.QUESTION_PLAIN_WORDS,
      advancedMode ? CHALLENGE_PROMPT_TEXT.QUESTION_ADVANCED_RULES : CHALLENGE_PROMPT_TEXT.QUESTION_NO_TRICKS,
      CHALLENGE_PROMPT_TEXT.QUESTION_ALLOWED_SHAPES,
      CHALLENGE_PROMPT_TEXT.QUESTION_FORMAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_ANTI_REPEAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_UNIQUE_STYLE,
      advancedMode ? CHALLENGE_PROMPT_TEXT.QUESTION_ADVANCED_KEEP_SHORT : '',
      CHALLENGE_PROMPT_TEXT.QUESTION_VARIETY_HEADER.replace('{{questionStyles}}', questionStyles),
      recentQuestions ? CHALLENGE_PROMPT_TEXT.QUESTION_RECENT_HEADER.replace('{{recentQuestions}}', recentQuestions) : '',
      sampleTopics ? CHALLENGE_PROMPT_TEXT.QUESTION_TOPIC_HEADER.replace('{{sampleTopics}}', sampleTopics) : '',
    ].filter(Boolean).join('\n\n');
  }

  /**
   * Parse evaluation. Delegates verdict and feedback parsing to AiChallengeNpc.
   * @private
   */
  _parseChallengeEvaluation(raw) {
    // Accept strict format first, then gracefully fall back to first two lines.
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let verdictLine = lines.find((line) => /^VERDICT\s*:/i.test(line)) || lines[0] || '';
    let feedbackLine = lines.find((line) => /^FEEDBACK\s*:/i.test(line)) || lines[1] || '';

    const verdictText = verdictLine.replace(/^VERDICT\s*:/i, '').trim().toUpperCase();
    const feedbackText = feedbackLine.replace(/^FEEDBACK\s*:/i, '').trim();

    const verdict = verdictText.includes(CHALLENGE_VERDICTS.RIGHT)
      ? CHALLENGE_VERDICTS.RIGHT
      : CHALLENGE_VERDICTS.WRONG;

    return {
      verdict,
      feedback: feedbackText || 'Review the desk topic and try again with a more specific answer.',
    };
  }

  // Configure input box for mission mode: Enter submits answer for grading.
  _armChallengeSubmission(npc, deskId, challengeQuestion) {
    const ui = this._getChallengeUiElements(npc);
    if (!ui?.input || !ui?.responseArea) return;

    const npcId = npc?.spriteData?.id || deskId;
    this._activeDeskChallenges.set(npcId, {
      deskId,
      question: challengeQuestion,
      startedAt: Date.now(),
    });

    ui.input.value = '';
    ui.input.placeholder = 'Type your answer, then press Enter to submit...';
    // Mission mode: Enter submits to evaluator, Shift+Enter remains newline.
    ui.input.onkeypress = (event) => {
      event.stopPropagation();
      if (event.key !== 'Enter' || event.shiftKey) return;

      event.preventDefault();
      const answer = ui.input.value.trim();
      if (!answer) {
        this.showToast?.(`${deskId}: please type an answer first.`);
        return;
      }

      this._submitChallengeAnswer(npc, npcId, answer, ui);
    };
  }

  // Resolve current NPC dialogue DOM nodes needed for question/answer rendering.
  _getChallengeUiElements(npc) {
    const safeId = npc?.dialogueSystem?.safeId;
    if (!safeId) return null;

    const dialogueRoot = document.getElementById(`custom-dialogue-box-${safeId}`);
    if (!dialogueRoot) return null;

    return {
      dialogueRoot,
      input: dialogueRoot.querySelector('.ai-npc-input'),
      responseArea: dialogueRoot.querySelector('.ai-npc-response-area'),
    };
  }

  // Evaluate one submitted answer and update UI/TTS/log in a guarded async flow.
  async _submitChallengeAnswer(npc, npcId, answer, ui) {
    const active = this._activeDeskChallenges.get(npcId);
    if (!active?.question) return;

    // Orchestrator: evaluate, render, speak, and log in one guarded flow.
    await this._runBusyTask({
      busySet: this._deskChallengeEvalBusy,
      key: npcId,
      busyMessage: `${active.deskId}: still evaluating your previous answer.`,
      task: async () => {
        try {
          ui.input.value = '';
          const evaluation = await this._runWithLoading(() =>
            this._loadChallengeEvaluation(npc?.spriteData, active.question, answer)
          );
          this._renderChallengeEvaluation(ui.responseArea, active.question, answer, evaluation);
          this._speakChallengeEvaluation(npc, evaluation);
          this._logChallengeEvent({
            deskId: active?.deskId || '',
            question: active?.question || '',
            answer,
            verdict: evaluation?.verdict || CHALLENGE_VERDICTS.WRONG,
            feedback: evaluation?.feedback || '',
            createdAt: Date.now(),
          });
        } catch (error) {
          console.warn('[MissionTools] challenge answer evaluation failed:', error);
          this._renderChallengeEvaluation(ui.responseArea, active.question, answer, {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'Could not evaluate right now. Please try submitting again.',
          });
          this.showToast?.(`${active.deskId}: evaluation unavailable, please retry.`);
        }
      },
    });
  }

  // Render full grading summary so learner sees question, answer, verdict, feedback.
  _renderChallengeEvaluation(responseArea, question, answer, evaluation) {
    if (!responseArea) return;

    const verdictLabel = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT ? 'RIGHT' : 'WRONG';
    const icon = verdictLabel === 'RIGHT' ? '✅' : '❌';

    responseArea.style.display = 'block';
    responseArea.textContent = [
      `Challenge Question: ${question}`,
      `Your Answer: ${answer}`,
      `${icon} Result: ${verdictLabel}`,
      `Feedback: ${evaluation?.feedback || 'No feedback provided.'}`,
    ].join('\n\n');
  }

  // Read verdict and feedback aloud for accessibility and reinforcement.
  _speakChallengeEvaluation(npc, evaluation) {
    if (!npc?.dialogueSystem?.speakText) return;

    const verdict = evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT ? 'Right' : 'Wrong';
    const feedback = evaluation?.feedback || 'Please try again.';
    npc.dialogueSystem.speakText(`${verdict}. ${feedback}`);
  }

  // Display and speak generated question when challenge starts.
  _deliverChallengeToNpc(npc, challengeQuestion) {
    this._renderChallengeQuestion(npc, challengeQuestion);
    if (npc?.dialogueSystem?.speakText) {
      npc.dialogueSystem.speakText(challengeQuestion);
    }
  }

  // Fallback path when question generation fails: show safe default and keep flow usable.
  _handleChallengeFailure(npc, deskId, error) {
    const mappedMessage = this._getChallengeErrorMessage(error);
    console.warn('[MissionTools] challenge generation failed:', mappedMessage, error);

    const fallback = 'Challenge unavailable right now. Ask this: What is one practical step you would take for this desk topic?';
    this._renderChallengeQuestion(npc, fallback);
    this.showToast?.(`${deskId}: using fallback challenge.`);
    if (npc?.dialogueSystem?.speakText) {
      npc.dialogueSystem.speakText(fallback);
    }
  }

  // Map internal error codes to user-readable messages for logs and diagnostics.
  _getChallengeErrorMessage(error) {
    const code = (error?.message || '').toString();

    if (code.startsWith(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`)) {
      const status = code.replace(`${CHALLENGE_ERROR_TYPES.HTTP_ERROR}_`, '');
      return CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.HTTP_ERROR](status);
    }

    const formatter = CHALLENGE_ERROR_MESSAGES[code] || CHALLENGE_ERROR_MESSAGES[CHALLENGE_ERROR_TYPES.UNKNOWN];
    return formatter();
  }

  // Prompt template for producing a single desk-specific challenge question.
  _buildChallengePrompt(spriteData) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';
    const sampleTopics = (spriteData?.knowledgeBase?.[expertise] || [])
      .slice(0, 4)
      .map((topic) => `- ${topic.question}`)
      .join('\n');

    return [
      `You are ${deskName} in a classroom coding game.`,
      `Generate exactly one challenge question focused on: ${expertise}.`,
      'Use the provided desk context and keep the question concise (max 30 words).',
      'The challenge should require a short written answer from a student.',
      'Do not include explanation, rubric, markdown, numbering, or extra text.',
      sampleTopics ? `Desk topic examples:\n${sampleTopics}` : '',
    ].filter(Boolean).join('\n\n');
  }

  // Inject generated question into the AI response area and prepare answer input.
  _renderChallengeQuestion(npc, questionText) {
    const safeId = npc?.dialogueSystem?.safeId;
    if (!safeId) return;

    const dialogueRoot = document.getElementById(`custom-dialogue-box-${safeId}`);
    if (!dialogueRoot) return;

    const responseArea = dialogueRoot.querySelector('.ai-npc-response-area');
    if (responseArea) {
      responseArea.style.display = 'block';
      responseArea.textContent = `Challenge Question: ${questionText}`;
    }

    const input = dialogueRoot.querySelector('.ai-npc-input');
    if (input) {
      input.placeholder = 'Type your answer to the challenge question...';
    }
  }

  // Keep a bounded in-memory challenge log for debugging and future persistence hooks.
  _logChallengeEvent(entry) {
    this._challengeLog.push(entry);
    if (this._challengeLog.length > 100) {
      this._challengeLog.shift();
    }
    console.log('[MissionTools] challenge created:', entry);
  }

  /**
   * Award progress. Increments the score counter. Repeat solves are locked
   * until every station has been cleared at least once.
   * @private
   */
  _awardMissionProgress(deskId) {
    if (!deskId) return;

    const stationTargetCount = this._missionDeskIds?.length || 4;
    const alreadyCompleted = this._missionCompletedStations.has(deskId);
    const allStationsCompleted = this._missionCompletedStations.size >= stationTargetCount;

    if (!alreadyCompleted) {
      this._missionCompletedStations.add(deskId);
      this._missionProgressCount += 1;
      this._syncMissionProgressBoard();

      if (this._missionCompletedStations.size >= stationTargetCount) {
        this.showToast?.('All stations cleared once. Repeat solves now count toward bonus progress.');
      }
      return;
    }

    if (!allStationsCompleted) {
      this.showToast?.('Progress lock: clear each station once before repeats count.');
      return;
    }

    this._missionProgressCount += 1;
    this._syncMissionProgressBoard();
  }

  /**
   * Sync scoreboard. Updates the mission scoreboard rows inside
   * the top-left Mission Tools panel.
   * @private
   */
  _syncMissionProgressBoard() {
    const score = this._getMissionProgressScore(this._missionProgressCount);
    const scoreText = score.toFixed(2).replace(/^0/, '');
    const completedText = `${this._missionProgressCount}/4`;

    // Keep scoreboard integrated with the mission tools panel and remove legacy detached HUD.
    this.clearScore?.();
    this.profilePanelView?.update({
      desk1: '—',
      desk2: '—',
      desk3: '—',
      desk4: '—',
      missionScore: scoreText,
      missionCleared: completedText,
    });
  }

  /**
   * Score ramp. Maps the completed station count to the assignment
   * grade range (0.55 baseline → 0.89 at four stations, then bonus steps).
   * @private
   */
  _getMissionProgressScore(completedCount) {
    if (completedCount <= 0) return 0.55;
    if (completedCount === 1) return 0.66;
    if (completedCount === 2) return 0.77;
    if (completedCount === 3) return 0.88;
    if (completedCount === 4) return 0.89;

    const bonusSteps = Math.min(completedCount - 4, 12);
    return 0.89 + (bonusSteps * 0.0025);
  }

  /**
   * Find player. Locates the Player instance in active game objects.
   * @private
   */
  _findPlayer() {
    return this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
  }

  // True when engine collision state reports player overlapping a desk.
  _deskIsColliding(player, desk) {
    return !!player?.state?.collisionEvents?.includes(desk?.spriteData?.id);
  }

  // Enforce mission rule: desk clicks only work while player is near that desk.
  _wireDeskClickDistanceGate(desks) {
    desks.forEach((desk) => {
      if (!desk || typeof desk.handleClick !== 'function') return;

      const originalHandleClick = desk.handleClick.bind(desk);
      desk.handleClick = (event) => {
        const player = this._findPlayer();
        if (!player) return;

        const playerCenter = this._getObjectCenter(player);
        const deskCenter = this._getObjectCenter(desk);
        const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
        const inCollision = this._deskIsColliding(player, desk);
        const clickDistance = this._getDeskClickDistancePx(desk);
        const inZone = inCollision || distance < clickDistance;

        if (!inZone) return;

        originalHandleClick(event);
      };
    });
  }

  // Runtime patch for engine quirk where reaction function may not bind automatically.
  _rebindMissingDeskReactions(desks) {
    // Runtime patch: Npc currently doesn't assign this.reaction from data.
    desks.forEach((desk) => {
      if (typeof desk?.reaction !== 'function' && typeof desk?.spriteData?.reaction === 'function') {
        desk.reaction = desk.spriteData.reaction;
      }
    });
  }

  // Compute center point for distance checks using current object position/size.
  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  // Alert radius in pixels used for zone prompts and nearest-desk detection.
  _getDeskAlertDistancePx(desk) {
    const alertMultiplier = desk?._alertDistanceMultiplier ?? desk?.spriteData?.alertDistance ?? 1.25;
    if ((desk?.width || 0) > 0) {
      return desk.width * alertMultiplier;
    }
    return (desk?.interactDistance || 120) * 1.5;
  }

  // Click radius in pixels; at least alert distance, with interact-distance fallback.
  _getDeskClickDistancePx(desk) {
    const alertDistance = this._getDeskAlertDistancePx(desk);
    const interactDistance = desk?.interactDistance || 120;
    return Math.max(alertDistance, interactDistance * 1.5);
  }

  // Return nearest desk currently within alert radius of player.
  _findNearestDeskInZone(player, desks) {
    const playerCenter = this._getObjectCenter(player);

    let nearestDesk = null;
    let nearestDistance = Infinity;

    for (const desk of desks) {
      const deskCenter = this._getObjectCenter(desk);
      const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
      const inZone = distance < this._getDeskAlertDistancePx(desk);

      if (inZone && distance < nearestDistance) {
        nearestDesk = desk;
        nearestDistance = distance;
      }
    }

    return nearestDesk;
  }

  // Keep right-side zone alert banner in sync with current nearest desk.
  _syncDeskZoneAlert(nearestDesk) {
    if (nearestDesk) {
      const zoneMessage = nearestDesk.spriteData?.zoneMessage || 'Click to interact';
      this.setZoneAlert(zoneMessage);
      this._activeZoneDeskId = nearestDesk.spriteData?.id || null;
      return;
    }

    if (this._activeZoneDeskId) {
      this.clearZoneAlert();
      this._activeZoneDeskId = null;
    }
  }

  // Per-frame update: recompute nearest desk and refresh zone hint text.
  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._missionDeskObjects);
    this._syncDeskZoneAlert(nearestDesk);
  }

  // Cleanup transient UI owned by this level.
  destroy() {
    this.clearZoneAlert();
  }

}

export default GameLevelCsPath2Mission;