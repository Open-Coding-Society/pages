// GameLevelEmpathyEpic.js

import GamEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import GameLevelCsPathIdentity from './GameLevelCsPathIdentity.js';
import EmpathyEpicPlayer from './EmpathyEpicPlayer.js';

export default class GameLevelEmpathyEpic extends GameLevelCsPathIdentity {
  static levelId = 'empathy-epic';
  static displayName = 'Empathy Epic';

  constructor(gameEnv) {
    super(gameEnv, {
      levelDisplayName: GameLevelEmpathyEpic.displayName,
      logPrefix: 'Empathy Epic',
    });

    let { width, height, path } = this.getLevelDimensions();

    const PLAYER_SCALE_FACTOR = 5;
    const player_src = path + "/images/projects/cs-pathway/player/minimalist.png";

    // ── Preload Assets ───────────────────────────────────────────
    const bg_src = path + "/images/projects/cs-pathway/bg4/empathy-epic.png";

    this.primeAssetGate({
      playerSrc: player_src,
      backgroundSrc: bg_src,
    });

    const createStationMarkerSrc = (fillColor, strokeColor = '#e2e8f0') => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="${fillColor}" stroke="${strokeColor}" stroke-width="10"/>
          <circle cx="64" cy="64" r="24" fill="rgba(255,255,255,0.16)"/>
        </svg>
      `;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const stationMarkerColors = {
      blue: createStationMarkerSrc('#3b82f6'),
      green: createStationMarkerSrc('#22c55e'),
      red: createStationMarkerSrc('#ef4444'),
    };

    // ── Setup Background ─────────────────────────────────────────
    const bg_data = {
      id: 'Empathy Epic Background',
      src: bg_src,
      pixels: { height: 1080, width: 1920 },
      INIT_POSITION: { x: 0, y: 0 },
      width: width,
      height: height,
    };

    // ── Setup Player ─────────────────────────────────────────────
    const player_data = {
      id: 'Empathy_Player',
      greeting: "I am ready to learn Empathy head-on!",
      src: player_src,
      SCALE_FACTOR: 5,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width / 2, y: height / 2 },
      pixels: { height: 1024, width: 1024 },
      orientation: { rows: 2, columns: 2 },
      down: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1 },
      up: { row: 0, start: 0, columns: 1 },
      left: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.8 }
    };

    // ── Helper to build Quiz Interaction ─────────────────────────
    const levelInstance = this;
    const buildStationData = (id, displayName, pos, dialogSystemIntro, quizTitle, correctText, distractors) => {
      const stationSize = height / 18;
      const setStationColor = (npcSelf, colorName) => {
        const src = stationMarkerColors[colorName] || stationMarkerColors.blue;
        npcSelf.spriteReady = false;
        if (npcSelf.spriteSheet) npcSelf.spriteSheet.src = src;
        if (npcSelf.spriteData) npcSelf.spriteData.src = src;
        if (npcSelf.data) npcSelf.data.src = src;
        npcSelf.frameIndex = 0;
        npcSelf.frameCounter = 0;
      };

      const npcData = {
        id: id,
        src: stationMarkerColors.blue,
        SCALE_FACTOR: 18,
        ANIMATION_RATE: 50,
        pixels: { height: 100, width: 100 },
        INIT_POSITION: { x: pos.x - (stationSize / 2), y: pos.y - (stationSize / 2) },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { radiusPercentage: 0.45 },
        greeting: `Welcome to the ${displayName} station!`,
        interact: function () {
          this._quizRetryPending = false;
          setStationColor(this, 'blue');
          this.dialogueSystem.dialogues = dialogSystemIntro;
          const ds = this.dialogueSystem;
          ds.lastShownIndex = -1;
          ds.showRandomDialogue(displayName);

          // Capture NPC reference so closures work after a small timeout
          const npcSelf = this;

          const completeStation = () => {
            setStationColor(npcSelf, 'green');
            npcSelf._quizCompleted = true;
            npcSelf._quizRetryPending = false;
            ds.closeDialogue();
            npcSelf.isInteracting = false;
            levelInstance.showToast(`Correct! ${displayName} station completed.`);
          };

          const failStation = (distractorText) => {
            setStationColor(npcSelf, 'red');
            npcSelf._quizRetryPending = true;
            ds.closeDialogue();
            npcSelf.isInteracting = false;
            levelInstance.showToast(`Not quite! Take a moment to reflect on empathetic choices.`);
          };

          // Fisher-Yates shuffle the answers
          const answers = [
            { text: correctText, isCorrect: true, action: completeStation },
            ...distractors.map(d => ({ text: d, isCorrect: false, action: () => failStation(d) }))
          ];
          for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
          }

          // Delay adding buttons slightly to ensure the dialogue is rendered and open
          setTimeout(() => {
            if (!ds || !ds.isOpen) return;
            ds.addButtons(answers.map(ans => ({
              text: ans.text,
              primary: true,
              action: ans.action
            })));
          }, 60);
        }
      };
      return npcData;
    };

    // ── Define the 5 Stations ─────────────────────────────────────
    
    // 1. Top left
    const activeListener = buildStationData(
      'ActiveListener', 'Active Listener', { x: width * 0.2, y: height * 0.2 },
      [
          'You are pair programming and your partner suggests a different approach.', 
          'What is the best way to respond as an Active Listener?'
      ],
      'Active Listening Quiz',
      'Listen to their explanation fully and discuss the pros and cons of both methods.',
      [
          'Quickly interrupt them to explain why your code is already perfect.', 
          'Nod but just keep typing your own code anyway.', 
          'Tell them you will do it their way but complain to others later.'
      ]
    );

    // 2. Top right
    const perspectiveTaker = buildStationData(
        'PerspectiveTaker', 'Perspective Taker', { x: width * 0.8, y: height * 0.2 },
        [
            'A user reports your UI is confusing, but you think it is perfectly clear.', 
            'How do you show you are a Perspective Taker?'
        ],
        'Perspective Taking Quiz',
        'Ask the user to walk you through their experience to understand where they get stuck.',
        [
            'Close the ticket because "works on my machine".', 
            'Tell them to read the documentation more carefully.', 
            'Redesign the whole app without asking for any more feedback.'
        ]
    );

    // 3. Bottom left
    const supportiveCollaborator = buildStationData(
        'SupportiveCollaborator', 'Supportive Collaborator', { x: width * 0.2, y: height * 0.8 },
        [
            'Your teammate is struggling to debug a persistent error and feels discouraged.', 
            'How can you be a Supportive Collaborator?'
        ],
        'Supportive Collaborator Quiz',
        'Offer to pair program and help them step through the logic together.',
        [
            'Fix the bug for them quickly so you do not slow down the project.', 
            'Tell them that bugs are easy if they just studied more.', 
            'Assign the task to someone else.'
        ]
    );

    // 4. Bottom right
    const respectfulCommunicator = buildStationData(
        'RespectfulCommunicator', 'Respectful Communicator', { x: width * 0.8, y: height * 0.8 },
        [
            'You find a serious security flaw in a fellow developers pull request.', 
            'What is the best way to be a Respectful Communicator?'
        ],
        'Respectful Communicator Quiz',
        'Leave a constructive comment explaining the vulnerability and suggest a secure alternative.',
        [
            'Publicly mock their code in the team chat.', 
            'Merge it anyway, it is their problem if it gets hacked.', 
            'Rewrite their whole PR without telling them why.'
        ]
    );

    // 5. Middle bottom (lowered)
    const inclusiveThinker = buildStationData(
        'InclusiveThinker', 'Inclusive Thinker', { x: width * 0.5, y: height * 0.85 },
        [
            'A user of your web app has accessibility needs.', 
            'What feature would best make your app accessible to more people?'
        ],
        'Inclusive Thinker Quiz',
        'A cursor controlled with head tracking.',
        [
            'A fancy color scheme with low contrast text.', 
            'Removing all keyboard shortcuts so they have to use a mouse.', 
            'Adding more text and removing all visual diagrams.'
        ]
    );

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: EmpathyEpicPlayer, data: player_data },
      { class: Npc, data: activeListener },
      { class: Npc, data: perspectiveTaker },
      { class: Npc, data: supportiveCollaborator },
      { class: Npc, data: respectfulCommunicator },
      { class: Npc, data: inclusiveThinker }
    ];
  }
}
