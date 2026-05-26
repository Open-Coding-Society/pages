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
    this.preloadTrackedAsset('npc_marker', 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%20fill%3D%22%233b82f6%22%2F%3E%3C%2Fsvg%3E');

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
    const buildStationData = (id, displayName, pos, dialogSystemIntro, quizTitle, correctText, distractors) => {
      const npcData = {
        id: id,
        src: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%20fill%3D%22%233b82f6%22%2F%3E%3C%2Fsvg%3E',
        SCALE_FACTOR: 16,
        ANIMATION_RATE: 50,
        pixels: { height: 100, width: 100 },
        INIT_POSITION: { x: pos.x, y: pos.y },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        interactDistance: 120,
        greeting: `Welcome to the ${displayName} station!`,
        interact: function () {
            this.dialogueSystem.dialogues = dialogSystemIntro;
            const ds = this.dialogueSystem;
            ds.lastShownIndex = -1;
            ds.showRandomDialogue(displayName);

            // Fisher-Yates shuffle the answers
            const answers = [
                { text: correctText, isCorrect: true, action: () => { ds.panel(`🎉 That's correct! ${correctText}`); ds.closeDialogue(); } },
                ...distractors.map(d => ({ text: d, isCorrect: false, action: () => { ds.panel(`Try again... ${d} might not be the most empathetic approach.`); ds.closeDialogue(); } }))
            ];
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }

            // Assign standard UI button fields mapping
            ds.addButtons(answers.map(ans => ({
                text: ans.text,
                primary: ans.isCorrect,
                action: ans.action
            })));
        }
      };
      return npcData;
    };

    // ── Define the 5 Stations ─────────────────────────────────────
    const activeListener = buildStationData(
      'ActiveListener', 'Active Listener', { x: width * 0.2, y: height * 0.2 },
      ['Listen closely and respond thoughtfully.', 'What is the best way to show you are actively listening?'],
      'Active Listening Quiz',
      'Make eye contact and summarize what you heard.',
      ['Interrupt with your own tangentially related story.', 'Nod while looking at your phone.', 'Wait in silence just so you can speak next.']
    );

    const perspectiveTaker = buildStationData(
        'PerspectiveTaker', 'Perspective Taker', { x: width * 0.8, y: height * 0.2 },
        ['Empathy requires seeing the world through their eyes.', 'How can you practice perspective taking?'],
        'Perspective Taking Quiz',
        'Ask questions to understand their feelings and experiences deeply.',
        ['Assume you know exactly how they feel.', 'Tell them what you would have done.', 'Dismiss their feelings since it has never happened to you.']
    );

    const supportiveCollaborator = buildStationData(
        'SupportiveCollaborator', 'Supportive Collaborator', { x: width * 0.2, y: height * 0.8 },
        ['Teams thrive when everyone supports each other.', 'How do you foster supportive collaboration?'],
        'Supportive Collaborator Quiz',
        'Offer your help and appreciate their unique contributions.',
        ['Take all the credit for group success.', 'Only do the bare minimum assigned to you.', 'Point out their mistakes in front of the group.']
    );

    const inclusiveThinker = buildStationData(
        'InclusiveThinker', 'Inclusive Thinker', { x: width * 0.8, y: height * 0.8 },
        [
            'A team member seems quiet and hasn’t contributed much.',
            'What is an empathetic way to address this?',
            'How can you be an inclusive thinker?'
        ],
        'Inclusive Thinker Quiz',
        'Ask, "We haven’t heard from you yet. What are your thoughts on this?"',
        [
            'Assume they have nothing useful to say.',
            'Call them out in front of the whole team: "Why are you being so quiet?"',
            'Take over their tasks so they don’t have to do anything.'
        ]
    );

    const respectfulCommunicator = buildStationData(
        'RespectfulCommunicator', 'Respectful Communicator', { x: width * 0.5, y: height * 0.5 },
        ['Communication should always remain respectful, even during disagreements.', 'What signifies respectful communication?'],
        'Respectful Communicator Quiz',
        'Use "I" statements to express your feelings without attacking the person.',
        ['Use "You always" or "You never" to list their flaws.', 'Raise your voice to ensure you are heard.', 'Ignore their emails until they apologize first.']
    );

    this.classes = [
      { class: GamEnvBackground, data: bg_data },
      { class: EmpathyEpicPlayer, data: player_data },
      { class: Npc, data: activeListener },
      { class: Npc, data: perspectiveTaker },
      { class: Npc, data: supportiveCollaborator },
      { class: Npc, data: inclusiveThinker },
      { class: Npc, data: respectfulCommunicator }
    ];
  }
}
