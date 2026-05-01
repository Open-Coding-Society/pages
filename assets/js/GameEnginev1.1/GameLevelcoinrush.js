// GameLevelCoinRush.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE:
//   First stage of the Gate Game. The player collects coins scattered across
//   a desert arena while making their way toward the gate on the right side.
//
//   • Coin.js handles spawning, collision, and respawning after each collect.
//   • An AI NPC ("Coin Sage") near the start offers hints via your backend
//     AI endpoint and has a "Proceed to Next Level" button.
//   • The "Proceed" button submits the player's coin total to the leaderboard
//     (via the game's existing leaderboard instance) then calls endLevel().
//   • The level's update() hook keeps the leaderboard widget's score display
//     synced in real time as coins are collected.
//
// REQUIRES in GameEnginev1.1/:
//   Coin.js, AiNpc.js, DialogueSystem.js
//
// ADD TO RUNNER (01-v1-Gategame.md):
//   import GameLevelCoinRush from ".../GameLevelCoinRush.js";
//   const gameLevelClasses = [GameLevelCoinRush, GameLevelCannonball, ...];
// ─────────────────────────────────────────────────────────────────────────────

import GameEnvBackground from './essentials/GameEnvBackground.js';
import Player           from './essentials/Player.js';
import Npc              from './essentials/Npc.js';
import Coin             from './Coin.js';
import AiNpc            from './AiNpc.js';

class GameLevelCoinRush {
    constructor(gameEnv) {
        const path        = gameEnv.path;
        const width       = gameEnv.innerWidth;
        const height      = gameEnv.innerHeight;
        const gameControl = gameEnv.gameControl;

        // ── Stats ───────────────────────────────────────────────────────────
        // Reset coin counter each time this level loads so scores are per-run.
        if (!gameEnv.stats) gameEnv.stats = {};
        gameEnv.stats.coinsCollected = 0;

        // Keep a reference so update() can read the live coin total.
        this.gameEnv = gameEnv;

        // ── Background ──────────────────────────────────────────────────────
        // Reuses the Cannonball desert background for visual continuity.
        // Swap src for any 1134×772 image you prefer.
        const bgData = {
            name:   'coin_rush_bg',
            src:    path + '/images/gamebuilder/bg/CannonDesert.png',
            pixels: { height: 772, width: 1134 }
        };

        // ── Player ──────────────────────────────────────────────────────────
        const playerData = {
            id:             'playerData',
            src:            path + '/images/gamebuilder/sprites/slime.png',
            SCALE_FACTOR:   8,
            STEP_FACTOR:    1000,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: 80, y: height / 2 },
            pixels:         { height: 225, width: 225 },
            orientation:    { rows: 4, columns: 4 },
            down:           { row: 0, start: 0, columns: 3 },
            downRight:      { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:       { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:           { row: 2, start: 0, columns: 3 },
            right:          { row: 1, start: 0, columns: 3 },
            up:             { row: 3, start: 0, columns: 3 },
            upLeft:         { row: 2, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:        { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox:         { widthPercentage: 0.4, heightPercentage: 0.4 },
            keypress:       { up: 87, left: 65, down: 83, right: 68 }
        };

        // ── AI NPC — Coin Sage ───────────────────────────────────────────────
        // Positioned near the player's starting area.
        // expertise / chatHistory / knowledgeBase / dialogues are all required
        // by AiNpc.js — expertise drives the AI system prompt, knowledgeBase
        // provides placeholder hints in the chat input, dialogues cycle on
        // each press of E before the player types anything.
        //
        // The interact() function:
        //   1. Calls AiNpc.showInteraction() to open the AI chat UI.
        //   2. Immediately adds a "Proceed" button via DialogueSystem.addButtons().
        //   3. Proceed → submits coin score → calls gameControl.endLevel().
        const npcGuideData = {
            id:             'Coin Sage',
            greeting:       "Greetings, traveler! Collect every coin you can — each one adds to your score!",
            src:            path + '/images/gamebuilder/sprites/mastergate.png',
            SCALE_FACTOR:   10,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: width * 0.12, y: height * 0.25 },
            pixels:         { height: 512, width: 512 },
            orientation:    { rows: 1, columns: 1 },
            down:           { row: 0, start: 0, columns: 1 },
            right:          { row: 0, start: 0, columns: 1 },
            left:           { row: 0, start: 0, columns: 1 },
            up:             { row: 0, start: 0, columns: 1 },
            upRight:        { row: 0, start: 0, columns: 1 },
            downRight:      { row: 0, start: 0, columns: 1 },
            upLeft:         { row: 0, start: 0, columns: 1 },
            downLeft:       { row: 0, start: 0, columns: 1 },
            hitbox:         { widthPercentage: 0.1, heightPercentage: 0.2 },

            // AiNpc fields
            expertise:    'coin collecting strategy',
            chatHistory:  [],
            knowledgeBase: {
                'coin collecting strategy': [
                    { question: 'How many coins can I collect?' },
                    { question: 'Do coins respawn after I grab them?' },
                    { question: 'How is my final score calculated?' },
                    { question: 'What is the best path to collect all coins?' }
                ]
            },
            dialogues: [
                "Each gold coin is worth one point. Grab as many as you can before you proceed!",
                "Coins respawn somewhere new each time you collect one — keep moving!",
                "Your coin total is submitted to the leaderboard the moment you proceed.",
                "Need a strategy? Ask me anything — I know the art of coin collection."
            ],

            interact: function () {
                // Open AI chat UI (cycles dialogues, attaches textarea + history button)
                AiNpc.showInteraction(this);

                // addButtons() requires isDialogueOpen() — true immediately after
                // showInteraction() since it calls showRandomDialogue() internally.
                if (this.dialogueSystem?.isDialogueOpen()) {
                    this.dialogueSystem.addButtons([{
                        text:    '🚪  Proceed to Next Level',
                        primary: true,
                        action:  () => {
                            this.dialogueSystem.closeDialogue();

                            // Submit coin total to the leaderboard.
                            // Uses the game's shared leaderboardInstance so
                            // scores appear in the same widget already on screen.
                            const coins    = gameEnv.stats?.coinsCollected || 0;
                            const username = String(gameControl?.game?.uid || 'Player');
                            const lb       = gameControl?.game?.leaderboardInstance;

                            if (lb && typeof lb.submitScore === 'function') {
                                lb.submitScore(username, coins, 'GateGame')
                                  .catch(err =>
                                      console.warn('Score submit failed (non-critical):', err)
                                  );
                            }

                            // End this level → engine transitions to the next one.
                            gameControl.endLevel();
                        }
                    }]);
                }
            }
        };

        // ── Gate NPC ─────────────────────────────────────────────────────────
        // A stationary gate on the right side for visual context.
        // The player proceeds via the Coin Sage NPC button, not by reaching
        // the gate — but having it visible gives a clear navigation target.
        const gateNpcData = {
            id:             'Gate',
            greeting:       false,           // no greeting popup on collision
            src:            path + '/images/gamebuilder/sprites/mastergate.png',
            SCALE_FACTOR:   8,
            ANIMATION_RATE: 50,
            INIT_POSITION:  { x: width * 0.85, y: height * 0.35 },
            pixels:         { height: 512, width: 512 },
            orientation:    { rows: 1, columns: 1 },
            down:           { row: 0, start: 0, columns: 1 },
            right:          { row: 0, start: 0, columns: 1 },
            left:           { row: 0, start: 0, columns: 1 },
            up:             { row: 0, start: 0, columns: 1 },
            upRight:        { row: 0, start: 0, columns: 1 },
            downRight:      { row: 0, start: 0, columns: 1 },
            upLeft:         { row: 0, start: 0, columns: 1 },
            downLeft:       { row: 0, start: 0, columns: 1 },
            hitbox:         { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues:      ["Talk to the Coin Sage to proceed!"],
            interact: function () {
                // Remind the player to use the NPC instead.
                if (this.dialogueSystem?.isDialogueOpen()) {
                    this.dialogueSystem.closeDialogue();
                } else {
                    this.showRandomDialogue();
                }
            }
        };

        // ── Coins ────────────────────────────────────────────────────────────
        // Five coins at spread-out starting positions.
        // After each collection, Coin.js randomizes the position automatically,
        // so coins effectively respawn — the player can keep collecting the
        // same five coins indefinitely for a higher score.
        const coinStartPositions = [
            { x: 0.30, y: 0.20 },
            { x: 0.50, y: 0.65 },
            { x: 0.65, y: 0.28 },
            { x: 0.42, y: 0.50 },
            { x: 0.75, y: 0.72 }
        ];

        const coinObjects = coinStartPositions.map((pos, i) => ({
            id:            `coin_${i}`,
            INIT_POSITION: pos,
            SCALE_FACTOR:  20,   // larger = smaller coin (1/nth of canvas height)
            value:         1,
            color:         '#FFD700',
            hitbox:        { widthPercentage: 0.8, heightPercentage: 0.8 },
            zIndex:        10
        }));

        // ── Class list ───────────────────────────────────────────────────────
        this.classes = [
            { class: GameEnvBackground, data: bgData         },
            { class: Player,            data: playerData      },
            { class: Npc,               data: npcGuideData    },
            { class: Npc,               data: gateNpcData     },
            ...coinObjects.map(data => ({ class: Coin, data }))
        ];
    }

    // ── update() ─────────────────────────────────────────────────────────────
    // Called every frame by the V1.1 engine (confirmed via GameLevelOverworld).
    // Keeps the leaderboard widget's score text live so the player can see
    // their coin count grow in real time without opening the leaderboard panel.
    update() {
        const coins = this.gameEnv?.stats?.coinsCollected || 0;

        const scoreEl = document.getElementById('leaderboard-current-score');
        if (scoreEl) scoreEl.textContent = `Score: ${coins} coin${coins !== 1 ? 's' : ''}`;

        const coinsEl = document.getElementById('leaderboard-coins-preview');
        if (coinsEl) coinsEl.textContent = `Coins Collected: ${coins}`;
    }
}

export default GameLevelCoinRush;