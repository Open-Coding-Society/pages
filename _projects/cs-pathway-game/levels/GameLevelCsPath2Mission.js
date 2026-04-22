import GamEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import FriendlyNpc from '/assets/js/GameEnginev1.1/essentials/FriendlyNpc.js';
import AiChallengeNpc, { CHALLENGE_ERROR_TYPES, CHALLENGE_VERDICTS } from '/assets/js/GameEnginev1.1/essentials/AiChallengeNpc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';

// Prompt templates for AI question generation and grading.
const CHALLENGE_PROMPT_TEXT = {
  QUESTION_ROLE: 'You are {{deskName}} in a classroom coding game.',
  QUESTION_FOCUS: 'Generate exactly one challenge question focused on: {{expertise}}.',
  QUESTION_CONCISE: 'Use the provided desk context and keep the question concise (max 30 words).',
  QUESTION_SHORT_ANSWER: 'The challenge should require a short written answer from a student.',
  QUESTION_FORMAT: 'Do not include explanation, rubric, markdown, numbering, or extra text.',
  QUESTION_TOPIC_HEADER: 'Desk topic examples:\n{{sampleTopics}}',
  QUESTION_VARIETY_HEADER: 'Question style options:\n{{questionStyles}}',
  QUESTION_RECENT_HEADER: 'Recently used questions to avoid repeating:\n{{recentQuestions}}',
  QUESTION_ANTI_REPEAT: 'Do not repeat or closely paraphrase any recent question. Prefer a fresh angle each time.',
  QUESTION_UNIQUE_STYLE: 'Choose a different question style than the recent examples when possible.',

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


const CHALLENGE_QUESTION_STYLES = [
  'Ask for a definition in the desk topic area.',
  'Ask for the best next step in a scenario.',
  'Ask the student to compare two options.',
  'Ask which tool, command, or process fits best.',
  'Ask for a debugging or troubleshooting step.',
  'Ask for a short explanation of why something works.',
  'Ask the student to order steps in the correct sequence.',
  'Ask what would happen if one part changed.',
  'Ask for a practical example from the topic.',
  'Ask the student to identify the most important concept.',
  'Ask how to avoid a common mistake in the topic.',
  'Ask for a simple decision between two approaches.',
  'Ask for a real-world use case.',
  'Ask for a short scenario response that needs a concise answer.',
  'Ask for a best-practice recommendation.',
  'Ask for a quick cause-and-effect explanation.',
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
 * GameLevelCsPath2Mission - Mission Tools Level
 *
 * Classroom game level where students visit four AI-powered desk stations.
 * Each desk challenges the student with a generated question drawn from a
 * topic defined in DESK_AI_KNOWLEDGE_BASE, grades their answer, and awards
 * progress toward the mission scoreboard.
 *
 * Follows the same VIEW / CONTROLLER pattern as other CsPath levels.
 * Data (knowledge base, prompt templates) lives in module-scope constants.
 * Async challenge orchestration is delegated to AiChallengeNpc.
 *
 * @class GameLevelCsPath2Mission
 * @extends GameLevelCsPathIdentity
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
            level.showToast('Click desk or press E to start challenge.');
        }
      },
      ...(interact ? { interact } : {}),
    });

    // Desk knowledge base and expertise are defined at the top of the file in DESK_AI_KNOWLEDGE_BASE.

    const createHiddenMissionDesk = ({ id, position, zonePrompt }) => ({
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
      expertise: DESK_AI_KNOWLEDGE_BASE[id]?.expertise || '',
      chatHistory: [],
      knowledgeBase: DESK_AI_KNOWLEDGE_BASE,
      zoneUnlocked: true,
    });

    const missionDeskZones = [
      createHiddenMissionDesk({
        id: 'The Admin',
        position: { x: width * 0.20, y: height * 0.17 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Archivist',
        position: { x: width * 0.67, y: height * 0.17 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The SDLC Master',
        position: { x: width * 0.18, y: height * 0.60 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
      createHiddenMissionDesk({
        id: 'The Scrum Master',
        position: { x: width * 0.62, y: height * 0.58 },
        zonePrompt: 'Move to desk and click or press E to start challenge.',
      }),
    ];

    // ── Level objects ─────────────────────────────────────────────
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
    this._missionQuestionHistory = new Map();
    this._missionCompletedStations = new Set();
    this._missionProgressCount = 0;
    this._handleMissionDeskKeyDownBound = this._handleMissionDeskKeyDown.bind(this);
    this._aiLoadingPending = 0;
    this._aiLoadingToastTimer = null;
    this._aiLoadingFrame = 0;
  }

  /**
   * Initialize level. Binds desk reactions, wires proximity click gates,
   * and renders the initial mission scoreboard.
   */
  initialize() {
    this.activateProfilePanel();
    const objects = this.gameEnv?.gameObjects || [];
    const desks = objects.filter((obj) => this._missionDeskIds?.includes(obj?.spriteData?.id));
    this._rebindMissingDeskReactions(desks);
    this._wireDeskClickDistanceGate(desks);
    document.addEventListener('keydown', this._handleMissionDeskKeyDownBound);
    this._syncMissionProgressBoard();

    console.log('[MissionTools] desk reactions rebound:', desks.map((d) => ({
      id: d?.spriteData?.id,
      hasReaction: typeof d?.reaction === 'function',
      hasSpriteReaction: typeof d?.spriteData?.reaction === 'function',
    })));

    this._missionDeskObjects = desks;
    this._activeZoneDeskId = null;
  }

  /**
   * Start challenge. Opens the desk UI, generates one AI question,
   * and arms the answer submission handler.
   *
   * @param {Object} desk - The desk game object.
   * @param {string} deskId - The desk NPC id.
   * @param {Object} [npcRef] - Optional explicit NPC reference.
   */
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
          AiChallengeNpc.showInteraction(npc);
          const challengeQuestion = await this._runWithLoading(() => this._loadDeskChallengeQuestion(npc.spriteData, npc?.aiSession || null));
          this._appendDeskChatMessage(npc, 'ai', `Challenge Question: ${challengeQuestion}`);
          AiChallengeNpc.deliverQuestion(npc, challengeQuestion);
          AiChallengeNpc.armSubmission(
            npc, deskId, challengeQuestion, this._activeDeskChallenges,
            (answer, active, ui) => this._submitChallengeAnswer(npc, npcId, answer, active, ui),
            this.showToast?.bind(this),
          );
          this._logChallengeEvent({
            deskId,
            expertise: npc?.spriteData?.expertise || '',
            question: challengeQuestion,
            createdAt: Date.now(),
          });
        } catch (error) {
          this._appendDeskChatMessage(
            npc,
            'ai',
            'Challenge Question: Challenge unavailable right now. Ask this: What is one practical step you would take for this desk topic?'
          );
          AiChallengeNpc.handleFailure(npc, deskId, error, this.showToast?.bind(this));
        }
      },
    });
  }

  /**
   * Run busy-guard. Delegates concurrency control to AiChallengeNpc.
   * @private
   */
  async _runBusyTask(opts) {
    return AiChallengeNpc.runBusyTask({ ...opts, showToast: this.showToast?.bind(this) });
  }

  /**
   * Wrap with loading. Uses in-world toast animation instead of full-screen overlay
   * while AI question/evaluation requests are in flight.
   * @private
   */
  async _runWithLoading(task) {
    this._startAiLoadingToast();
    try {
      return await task();
    } finally {
      this._stopAiLoadingToast();
    }
  }

  _startAiLoadingToast() {
    this._aiLoadingPending += 1;
    if (this._aiLoadingToastTimer) {
      return;
    }

    const frames = ['◴', '◷', '◶', '◵'];
    const renderFrame = () => {
      const glyph = frames[this._aiLoadingFrame % frames.length];
      this.showToast?.(`${glyph} Desk AI is thinking...`);
      this._aiLoadingFrame += 1;
    };

    renderFrame();
    this._aiLoadingToastTimer = setInterval(renderFrame, 420);
  }

  _stopAiLoadingToast() {
    this._aiLoadingPending = Math.max(0, this._aiLoadingPending - 1);
    if (this._aiLoadingPending > 0) {
      return;
    }

    if (this._aiLoadingToastTimer) {
      clearInterval(this._aiLoadingToastTimer);
      this._aiLoadingToastTimer = null;
    }

    this._aiLoadingFrame = 0;
    this.present?.clearToast?.();
  }

  /**
   * Load question. Requests a unique AI question, retrying up to three times
   * to avoid repeating a question already seen this session.
   * @private
   */
  async _loadDeskChallengeQuestion(spriteData, session = null) {
    let lastQuestion = '';

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const prompt = this._buildChallengePrompt(spriteData);
      const raw = await this._requestChallengeAiText(spriteData, prompt, session);
      const question = AiChallengeNpc.extractFirstLine(raw);
      lastQuestion = question;

      if (!this._isRepeatedMissionQuestion(spriteData, question)) {
        this._recordMissionQuestion(spriteData, question);
        return question;
      }
    }

    this._recordMissionQuestion(spriteData, lastQuestion);
    return lastQuestion;
  }

  /**
   * Load evaluation. Sends the question and student answer to AI,
   * then parses the graded verdict and feedback.
   * @private
   */
  async _loadChallengeEvaluation(spriteData, question, answer, session = null) {
    const prompt = this._buildChallengeEvaluationPrompt(spriteData, question, answer);
    const raw = await this._requestChallengeAiText(spriteData, prompt, session);
    return this._parseChallengeEvaluation(raw);
  }

  /**
   * Request AI text. Routes the prompt through AiChallengeNpc.
   * @private
   */
  async _requestChallengeAiText(spriteData, prompt, session = null) {
    return AiChallengeNpc.requestAiText(spriteData, prompt, 'mission-challenge', 'Mission Tools challenge generation', session);
  }

  /**
   * Build eval prompt. Assembles the grading prompt that requires a strict
   * two-line VERDICT / FEEDBACK response from the AI.
   * @private
   */
  _buildChallengeEvaluationPrompt(spriteData, question, answer) {
    const expertise = spriteData?.expertise || 'general problem solving';
    const deskName = spriteData?.id || 'Desk Guide';

    return [
      CHALLENGE_PROMPT_TEXT.EVAL_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.EVAL_EXPERTISE.replace('{{expertise}}', expertise),
      CHALLENGE_PROMPT_TEXT.EVAL_SCOPE,
      CHALLENGE_PROMPT_TEXT.EVAL_QUESTION.replace('{{question}}', question),
      CHALLENGE_PROMPT_TEXT.EVAL_ANSWER.replace('{{answer}}', answer),
      CHALLENGE_PROMPT_TEXT.EVAL_FORMAT,
      CHALLENGE_PROMPT_TEXT.EVAL_VERDICT,
      CHALLENGE_PROMPT_TEXT.EVAL_FEEDBACK,
      CHALLENGE_PROMPT_TEXT.EVAL_RIGHT_RULE,
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
    const sampleTopics = (spriteData?.knowledgeBase?.[deskName]?.questions || [])
      .slice(0, 8)
      .map((topic) => `- ${topic.question}`)
      .join('\n');
    const recentQuestions = this._getRecentMissionQuestions(spriteData)
      .slice(-CHALLENGE_RECENT_HISTORY_LIMIT)
      .map((question) => `- ${question}`)
      .join('\n');
    const questionStyles = CHALLENGE_QUESTION_STYLES
      .map((style, index) => `${index + 1}. ${style}`)
      .join('\n');

    return [
      CHALLENGE_PROMPT_TEXT.QUESTION_ROLE.replace('{{deskName}}', deskName),
      CHALLENGE_PROMPT_TEXT.QUESTION_FOCUS.replace('{{expertise}}', expertise),
      CHALLENGE_PROMPT_TEXT.QUESTION_CONCISE,
      CHALLENGE_PROMPT_TEXT.QUESTION_SHORT_ANSWER,
      CHALLENGE_PROMPT_TEXT.QUESTION_FORMAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_ANTI_REPEAT,
      CHALLENGE_PROMPT_TEXT.QUESTION_UNIQUE_STYLE,
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
    return AiChallengeNpc.parseEvaluation(raw);
  }

  /**
   * Append transcript message. Stores a single chat item on the NPC sprite data
   * so the built-in history modal can render mission conversation context.
   * @private
   */
  _appendDeskChatMessage(npc, role, message) {
    if (!npc?.spriteData || !message) return;
    if (!Array.isArray(npc.spriteData.chatHistory)) {
      npc.spriteData.chatHistory = [];
    }

    npc.spriteData.chatHistory.push({
      role: role === 'user' ? 'user' : 'ai',
      message: String(message),
      createdAt: Date.now(),
    });

    if (npc.spriteData.chatHistory.length > 200) {
      npc.spriteData.chatHistory = npc.spriteData.chatHistory.slice(-200);
    }
  }

  /**
   * Submit answer. Evaluates the student answer, renders feedback, speaks
   * the result, and awards progress if correct. Called via onSubmit callback.
   * @private
   */
  async _submitChallengeAnswer(npc, npcId, answer, active, ui) {
    if (!active?.question) return;
    this._appendDeskChatMessage(npc, 'user', answer);

    await this._runBusyTask({
      busySet: this._deskChallengeEvalBusy,
      key: npcId,
      busyMessage: `${active.deskId}: still evaluating your previous answer.`,
      task: async () => {
        try {
          ui.input.value = '';
          const evaluation = await this._runWithLoading(() =>
            this._loadChallengeEvaluation(npc?.spriteData, active.question, answer, npc?.aiSession || null)
          );
          AiChallengeNpc.renderEvaluation(ui.responseArea, active.question, answer, evaluation);
          AiChallengeNpc.speakEvaluation(npc, evaluation);
          active.lastAnswer = answer;
          active.lastEvaluation = evaluation || {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'No feedback provided.',
          };
          this._appendDeskChatMessage(
            npc,
            'ai',
            `Result: ${evaluation?.verdict || CHALLENGE_VERDICTS.WRONG}. ${evaluation?.feedback || 'No feedback provided.'}`
          );
          if (evaluation?.verdict === CHALLENGE_VERDICTS.RIGHT) {
            this._awardMissionProgress(active?.deskId || '');
          }
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
          active.lastAnswer = answer;
          active.lastEvaluation = {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'Could not evaluate right now. Please try submitting again.',
          };
          this._appendDeskChatMessage(
            npc,
            'ai',
            'Result: WRONG. Could not evaluate right now. Please try submitting again.'
          );
          AiChallengeNpc.renderEvaluation(ui.responseArea, active.question, answer, {
            verdict: CHALLENGE_VERDICTS.WRONG,
            feedback: 'Could not evaluate right now. Please try submitting again.',
          });
          this.showToast?.(`${active.deskId}: evaluation unavailable, please retry.`);
        }
      },
    });
  }

  /**
   * Log event. Appends an entry to the bounded in-memory challenge log.
   * @private
   */
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

      this.updateProfilePanel({
        workbench1: this._missionCompletedStations.has('The Admin')       ? 'The Admin ✓'       : '—',
        workbench2: this._missionCompletedStations.has('The Archivist')   ? 'The Archivist ✓'   : '—',
        workbench3: this._missionCompletedStations.has('The SDLC Master') ? 'The SDLC Master ✓' : '—',
        workbench4: this._missionCompletedStations.has('The Scrum Master') ? 'The Scrum Master ✓' : '—',
      });
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
   * Sync scoreboard. Creates or updates the fixed score display
   * in the bottom-right corner of the screen.
   * @private
   */
  _syncMissionProgressBoard() {
    const score = this._getMissionProgressScore(this._missionProgressCount);
    const scoreText = score.toFixed(2).replace(/^0/, '');
    const completedText = `${this._missionProgressCount}/4`;
    const progressRatio = Math.max(0, Math.min(1, (score - 0.55) / (0.92 - 0.55)));

    this.score(`
      <div class="present-score-title">Mission Scoreboard</div>
      <div class="present-score-main mission-progress-score">${scoreText}</div>
      <div class="present-score-sub mission-progress-count">${completedText}</div>
      <div class="present-progress-track">
        <div class="present-progress-bar mission-progress-bar" style="width: ${progressRatio * 100}%;"></div>
      </div>
    `);
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

  /**
   * Collision check. Returns true when the engine reports the player
   * overlapping a desk's collision boundary.
   * @private
   */
  _deskIsColliding(player, desk) {
    return !!player?.state?.collisionEvents?.includes(desk?.spriteData?.id);
  }

  /**
   * Wire click gate. Patches each desk's click handler to enforce
   * proximity before the challenge can be activated.
   * @private
   */
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

  /**
   * Handle keydown. Fires the nearest in-zone desk challenge when E is pressed,
   * skipping the event when focus is inside a text input.
   * @private
   */
  _handleMissionDeskKeyDown(event) {
    if (event?.key !== 'e' && event?.key !== 'E' && event?.code !== 'KeyE') return;
    if (event?.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;

    const player = this._findPlayer();
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._missionDeskObjects);
    if (!nearestDesk) return;

    event.preventDefault();
    event.stopPropagation();

    const deskId = nearestDesk?.spriteData?.id;
    if (!deskId) return;

    this.startDeskChallenge(nearestDesk, deskId, nearestDesk);
  }

  /**
   * Rebind reactions. Patches desks whose reaction function was not
   * automatically assigned by the engine from spriteData.
   * @private
   */
  _rebindMissingDeskReactions(desks) {
    // Engine quirk: FriendlyNpc does not copy spriteData.reaction to this.reaction.
    desks.forEach((desk) => {
      if (typeof desk?.reaction !== 'function' && typeof desk?.spriteData?.reaction === 'function') {
        desk.reaction = desk.spriteData.reaction;
      }
    });
  }

  /**
   * Object center. Returns the center pixel coordinate of a game object.
   * @private
   */
  _getObjectCenter(object) {
    return {
      x: (object?.position?.x || 0) + (object?.width || 0) / 2,
      y: (object?.position?.y || 0) + (object?.height || 0) / 2,
    };
  }

  /**
   * Alert distance. Returns the zone-alert radius in pixels for a desk,
   * falling back to interactDistance when the sprite has not yet rendered.
   * @private
   */
  _getDeskAlertDistancePx(desk) {
    const alertMultiplier = desk?._alertDistanceMultiplier ?? desk?.spriteData?.alertDistance ?? 1.25;
    if ((desk?.width || 0) > 0) {
      return desk.width * alertMultiplier;
    }
    return (desk?.interactDistance || 120) * 1.5;
  }

  /**
   * Click distance. Returns the click-activation radius, at least as large
   * as the alert distance so clicks never require closer approach than alerts.
   * @private
   */
  _getDeskClickDistancePx(desk) {
    const alertDistance = this._getDeskAlertDistancePx(desk);
    const interactDistance = desk?.interactDistance || 120;
    return Math.max(alertDistance, interactDistance * 1.5);
  }

  /**
   * Nearest desk. Returns the closest desk currently within alert range
   * of the player, or null if none qualify.
   * @private
   */
  _findNearestDeskInZone(player, desks) {
    const playerCenter = this._getObjectCenter(player);

    let nearestDesk = null;
    let nearestDistance = Infinity;

    for (const desk of desks) {
      const deskCenter = this._getObjectCenter(desk);
      const distance = Math.hypot(playerCenter.x - deskCenter.x, playerCenter.y - deskCenter.y);
      const inCollision = this._deskIsColliding(player, desk);
      const inZone = inCollision || distance < this._getDeskAlertDistancePx(desk);

      if (inZone && distance < nearestDistance) {
        nearestDesk = desk;
        nearestDistance = distance;
      }
    }

    return nearestDesk;
  }

  /**
   * Sync zone alert. Shows or clears the right-side proximity hint banner
   * based on the current nearest desk.
   * @private
   */
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

  /**
   * Per-frame update. Recomputes the nearest desk and refreshes the zone
   * alert hint on every game tick.
   */
  update() {
    const player = this.gameEnv?.gameObjects?.find((obj) => obj?.constructor?.name === 'Player');
    if (!player || !Array.isArray(this._missionDeskObjects)) return;

    const nearestDesk = this._findNearestDeskInZone(player, this._missionDeskObjects);
    this._syncDeskZoneAlert(nearestDesk);
  }

  /**
   * Cleanup level. Removes all transient UI elements (toast, zone alert,
   * scoreboard) and detaches the keydown listener.
   */
  destroy() {
    document.removeEventListener('keydown', this._handleMissionDeskKeyDownBound);
    if (this._aiLoadingToastTimer) {
      clearInterval(this._aiLoadingToastTimer);
      this._aiLoadingToastTimer = null;
    }
    super.destroy();
  }

}

export default GameLevelCsPath2Mission;