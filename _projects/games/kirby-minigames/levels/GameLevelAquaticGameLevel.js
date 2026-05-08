// Adventure Game Custom Level
// Exported from GameBuilder on 2026-03-07T07:02:58.561Z
// How to use this file:
// 1) Save as assets/js/GameEnginev1/GameLevelAquaticGameLevel.js in your repo.
// 2) Reference it in your runner or level selector. Examples:
//    import GameLevelPlanets from '/Team-Portfolio/assets/js/GameEnginev1/GameLevelPlanets.js';
//    import GameLevelAquaticGameLevel from '/Team-Portfolio/assets/js/GameEnginev1/GameLevelAquaticGameLevel.js';
//    export const gameLevelClasses = [GameLevelPlanets, GameLevelAquaticGameLevel];
//    // or pass it directly to your GameControl as the only level.
// 3) Ensure images exist and paths resolve via 'path' provided by the engine.
// 4) You can add more objects to this.classes inside the constructor.

import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '@assets/js/GameEnginev1.1/essentials/Npc.js';
import Barrier from '@assets/js/GameEnginev1.1/essentials/Barrier.js';
import Collectible from '@assets/js/GameEnginev1.1/essentials/Collectible.js';
import AiNpc from '@assets/js/GameEnginev1.1/essentials/AiNpc.js';
import {
    getKirbyAudioUrl,
    getKirbyImageDirectoryUrl
} from './kirbyAssetPaths.js';

class GameLevelAquaticGameLevel {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        const levelContext = this;
        const assetPath = getKirbyImageDirectoryUrl();
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;

        const bgData = {
            name: "custom_bg",
            src: assetPath + "/Aquatic.png",
            pixels: { height: 1960, width: 2940 }
        };

        const playerData = {
            id: 'playerData',
            src: assetPath + "/scubadiver.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 1000,
            ANIMATION_RATE: 50,
            // Start near the mermaid with no walls between
            INIT_POSITION: { x: 180, y: 300 },
            pixels: { height: 948, width: 632 },
            orientation: { rows: 4, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 2, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 3, start: 0, columns: 3 },
            upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 3, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0, heightPercentage: 0 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        const slimeNpc = {
            id: 'Random Slime',
            greeting: "I've been living under the sea for thousands of years, do you wonder why?",
            src: assetPath + "/slime.png",
            SCALE_FACTOR: 8,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 800, y: 128 },
            pixels: { height: 225, width: 225 },
            orientation: { rows: 4, columns: 4 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            left: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            up: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            upRight: { row: Math.min(3, 4 - 1), start: 0, columns: 3 },
            downRight: { row: Math.min(1, 4 - 1), start: 0, columns: 3 },
            upLeft: { row: Math.min(2, 4 - 1), start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
            dialogues: ["I've been living under the sea for thousands of years, do you wonder why?"],
            reaction: function() {},
            interact: function() {
                if (!this.dialogueSystem) return;
                const q1 = questState.firstQuest;
                const q2 = questState.secondQuest;

                if (q2.pendingSlimeCompletion) {
                    this.dialogueSystem.showDialogue(
                        "You've saved the ocean, you may go onto the lands now! seems like kirby is missing.",
                        'Slime',
                        null
                    );
                    clearDialogueActionButtons(this.dialogueSystem);
                    this.dialogueSystem.addButtons([
                        {
                            text: 'Continue Story',
                            primary: true,
                            action: async () => {
                                q2.pendingSlimeCompletion = false;
                                updateQuestHud();
                                this.dialogueSystem.closeDialogue();
                                await levelContext.startMegalodonEncounter?.();
                            }
                        },
                        {
                            text: 'Close',
                            action: () => this.dialogueSystem.closeDialogue()
                        }
                    ]);
                    return;
                }

                if (q1.completed && !q2.accepted) {
                    this.dialogueSystem.showDialogue(
                        'The upper sea is full of plastics and drifting garbage. Will you take Aquatic Quest #2 and clean it?',
                        'Slime',
                        null
                    );
                    clearDialogueActionButtons(this.dialogueSystem);
                    this.dialogueSystem.addButtons([
                        {
                            text: 'Accept Quest #2',
                            primary: true,
                            action: async () => {
                                q2.offered = true;
                                q2.accepted = true;
                                q2.collected = 0;
                                this.dialogueSystem.closeDialogue();
                                updateQuestHud();
                                await transitionToSurface();
                            }
                        },
                        {
                            text: 'Later',
                            action: () => this.dialogueSystem.closeDialogue()
                        }
                    ]);
                    return;
                }

                if (q2.accepted && q2.inSurface) {
                    this.dialogueSystem.showDialogue(
                        'Keep collecting every piece of floating trash above the water!',
                        'Slime',
                        null
                    );
                    return;
                }

                if (q2.accepted && !q2.completed) {
                    this.dialogueSystem.showDialogue(
                        'The surface still needs cleaning. Finish removing every trash item.',
                        'Slime',
                        null
                    );
                    return;
                }

                const showStoryStep = (step) => {
                    if (step === 0) {
                        this.dialogueSystem.showDialogue(
                            'Before the modern human society, the ocean remained peace and clean, but then, everything has shifted.',
                            'Slime',
                            null
                        );
                        clearDialogueActionButtons(this.dialogueSystem);
                        this.dialogueSystem.addButtons([
                            {
                                text: 'Continue',
                                primary: true,
                                action: () => showStoryStep(1)
                            }
                        ]);
                        return;
                    }

                    if (step === 1) {
                        this.dialogueSystem.showDialogue(
                            "countless plastics, useless metals, were thrown into the ocean. I've been consuming them to protect this part of the ocean.",
                            'Slime',
                            null
                        );
                        clearDialogueActionButtons(this.dialogueSystem);
                        this.dialogueSystem.addButtons([
                            {
                                text: 'Continue',
                                primary: true,
                                action: () => showStoryStep(2)
                            }
                        ]);
                        return;
                    }

                    this.dialogueSystem.showDialogue(
                        'Please protect the ocean :(',
                        'Slime',
                        null
                    );
                    clearDialogueActionButtons(this.dialogueSystem);
                    this.dialogueSystem.addButtons([
                        {
                            text: 'Close',
                            primary: true,
                            action: () => this.dialogueSystem.closeDialogue()
                        }
                    ]);
                };

                this.dialogueSystem.showDialogue(
                    "I've been living under the sea for thousands of years, do you wonder why?",
                    'Slime',
                    null
                );
                clearDialogueActionButtons(this.dialogueSystem);

                this.dialogueSystem.addButtons([
                    {
                        text: 'Yes',
                        primary: true,
                        action: () => showStoryStep(0)
                    },
                    {
                        text: 'No',
                        action: () => this.dialogueSystem.closeDialogue()
                    }
                ]);
            }
        };

        const kirbyNpc = {
            id: 'Kirby',
            greeting: 'Poyo! Ask me anything about ocean cleanup and sea life.',
            src: assetPath + '/kirby.png',
            SCALE_FACTOR: 10,
            ANIMATION_RATE: 6,
            INIT_POSITION: { x: 180, y: 140 },
            pixels: { height: 36, width: 569 },
            orientation: { rows: 1, columns: 13 },
            down: { row: 0, start: 0, columns: 13 },
            right: { row: 0, start: 0, columns: 13 },
            left: { row: 0, start: 0, columns: 13 },
            up: { row: 0, start: 0, columns: 13 },
            upRight: { row: 0, start: 0, columns: 13 },
            downRight: { row: 0, start: 0, columns: 13 },
            upLeft: { row: 0, start: 0, columns: 13 },
            downLeft: { row: 0, start: 0, columns: 13 },
            hitbox: { widthPercentage: 0.34, heightPercentage: 0.42 },
            expertise: 'ocean',
            chatHistory: [],
            dialogues: [
                'Poyo! Need a hint for your aquatic mission?',
                'I can answer questions about sea life and pollution.',
                'Ask me how to protect the ocean!'
            ],
            knowledgeBase: {
                ocean: [
                    {
                        question: 'Why are plastics dangerous for marine life?',
                        answer: 'Plastics can entangle animals or be mistaken for food, which can cause injury, starvation, and toxic exposure.'
                    },
                    {
                        question: 'What can people do to reduce ocean trash?',
                        answer: 'Use reusables, sort waste correctly, avoid littering, and join local beach or river cleanups.'
                    },
                    {
                        question: 'Why are coral reefs important?',
                        answer: 'Coral reefs support biodiversity, protect coastlines from waves, and provide habitat for many fish species.'
                    },
                    {
                        question: 'What are microplastics?',
                        answer: 'Microplastics are tiny plastic fragments that enter water and food chains, affecting wildlife and ecosystems.'
                    }
                ]
            },
            reaction: function() {},
            interact: function() {
                if (levelContext.gameMode === 'challenge') return;
                if (levelContext.playerLock) return;
                const q2 = levelContext.questState?.secondQuest;
                if (q2?.inSurface || q2?.returning) return;

                try {
                    AiNpc.showInteraction(this);
                } catch (err) {
                    console.error('Kirby AI interaction failed:', err);
                    if (this.dialogueSystem?.showDialogue) {
                        this.dialogueSystem.showDialogue(
                            'Kirby is having trouble answering right now. Please try again.',
                            'Kirby',
                            null
                        );
                    }
                }
            }
        };

        // Story mode quest state machine used by Mermaid and Slime dialogue gates.
        const questState = {
            firstQuest: {
                accepted: false,
                started: false,
                completed: false,
                starfishTotal: 8,
                collected: 0
            },
            secondQuest: {
                offered: false,
                accepted: false,
                started: false,
                inSurface: false,
                returning: false,
                completed: false,
                pendingSlimeCompletion: false,
                trashTotal: 12,
                collected: 0
            }
        };

        // Mode is selected through URL query string: ?mode=challenge.
        const modeParam = new URLSearchParams(window.location.search).get('mode');
        this.gameMode = modeParam === 'challenge' ? 'challenge' : 'story';

        // Challenge mode session + persistent leaderboard state.
        const challengeState = {
            wave: 1,
            waveTarget: 14,
            collectedThisWave: 0,
            score: 0,
            lastSavedScore: 0,
            leaderboardKey: 'aquatic_challenge_leaderboard_v1'
        };

        const createBossOrbBuffState = () => ({
            criticalOrbReady: false,
            bloodThirstUntil: 0,
            mirrorReady: false,
            shieldUntil: 0,
            sonicUntil: 0
        });

        this.questState = questState;
        this.challengeState = challengeState;
        this.levelCompleted = false;
        this.playerLock = false;
        this.surfaceTrashIds = [];
        this.challengeStarfishIds = [];
        this.underwaterMusicSrc = getKirbyAudioUrl('Underwater Soundtrack.mp3');
        this.bossMusicSrc = getKirbyAudioUrl('Megalodon Boss Fight.mp3');
        this.bossMusicPhaseTwoSrc = getKirbyAudioUrl('Megalodon Boss Fight #2.mp3');
        this.storyUiState = {
            hiddenElements: []
        };
        this.pauseSyncState = {
            wasPaused: false,
            pausedAt: 0,
            resumeUnderwaterTheme: false,
            resumeBossTheme: false,
            underwaterThemeAudio: null
        };
        this.bossState = {
            active: false,
            introPlayed: false,
            combatReady: false,
            megalodon: null,
            hiddenNpcs: [],
            hp: 2100,
            maxHp: 2100,
            playerHp: 165,
            playerMaxHp: 165,
            summonThresholdsTriggered: [],
            weakenedMegalodonSpawned: false,
            summons: [],
            projectiles: [],
            enemyProjectiles: [],
            laserBeam: null,
            critChance: 0.15,
            mouseX: width * 0.5,
            mouseY: height * 0.5,
            listenersBound: false,
            lastShotAt: 0,
            shotCooldownMs: 420,
            meleeCooldownMs: 380,
            lastMeleeAt: 0,
            hud: null,
            megalodonMoveSheet: assetPath + '/megalodon.png',
            megalodonMovePixels: { width: 513, height: 772 },
            megalodonAttackSheet: assetPath + '/megalodon attack.png',
            megalodonAttackPixels: { width: 456, height: 688 },
            rocketSprite: assetPath + '/Rocket.png',
            nextAbilityAt: 0,
            abilityGlobalCooldownMs: 1900,
            cooldowns: {
                laser: 3400,
                rockets: 5200,
                bodySwing: 4300
            },
            lastAbilityAt: {
                laser: 0,
                rockets: 0,
                bodySwing: 0
            },
            activeAbility: null,
            abilityEndsAt: 0,
            abilityCommitted: false,
            swingHitsLeft: 0,
            themeAudio: null,
            themeAudioPhaseTwo: null,
            activeThemeAudio: null,
            lowHealthSummonStartedAt: 0,
            nextOrbSpawnAt: 0,
            orbs: [],
            orbAuras: {},
            orbAnnouncementTimeout: null,
            buffs: createBossOrbBuffState()
        };

        const multiplayerRoom = new URLSearchParams(window.location.search).get('room') || sessionStorage.getItem('aquatic_multiplayer_room') || '';
        const multiplayerClientId = sessionStorage.getItem('aquatic_multiplayer_client_id')
            || `aq_client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem('aquatic_multiplayer_client_id', multiplayerClientId);
        this.multiplayer = {
            enabled: Boolean(multiplayerRoom),
            room: multiplayerRoom,
            playerId: `aq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
            clientId: multiplayerClientId,
            channelName: `aquatic_multiplayer_${multiplayerRoom}`,
            channel: null,
            heartbeatTimer: null,
            pruneTimer: null,
            remotePlayers: new Map(),
            uiPanel: null,
            lobbyButton: null,
            displayName: (localStorage.getItem('aquatic_multiplayer_name') || 'Diver').slice(0, 16)
        };

        const getPlayer = () => this.gameEnv?.gameObjects?.find(
            obj => obj?.spriteData?.id === 'playerData'
        );
        this.getLocalPlayer = getPlayer;

        const getRemotePlayerVisualMetrics = () => {
            const orientation = playerData.orientation || { rows: 1, columns: 1 };
            const size = Math.round((this.gameEnv?.innerHeight || height) / playerData.SCALE_FACTOR);

            return {
                size,
                orientation
            };
        };

        const applyRemotePlayerSpriteFrame = (remote) => {
            if (!remote?.spriteElement) return;

            const { size, orientation } = getRemotePlayerVisualMetrics();
            const directionData = playerData[remote.direction] || playerData.down || { row: 0, start: 0 };
            const frameColumn = directionData.start || 0;
            const frameRow = directionData.row || 0;

            Object.assign(remote.element.style, {
                width: `${size}px`,
                height: `${size}px`
            });

            Object.assign(remote.spriteElement.style, {
                width: `${size}px`,
                height: `${size}px`,
                backgroundImage: `url('${playerData.src}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${size * orientation.columns}px ${size * orientation.rows}px`,
                backgroundPosition: `-${frameColumn * size}px -${frameRow * size}px`,
                border: `2px solid ${remote.color || '#80f4ff'}`,
                boxShadow: `0 0 14px ${remote.color || '#80f4ff'}55`,
                borderRadius: '10px'
            });

            if (remote.nameElement) {
                remote.nameElement.style.bottom = `${size + 6}px`;
                remote.nameElement.style.color = remote.color || '#ddf9ff';
            }
        };

        const getRemotePlayerKey = (state) => state?.clientId || state?.playerId;

        const updateMultiplayerButtonState = () => {
            if (!this.multiplayer?.lobbyButton) return;
            this.multiplayer.lobbyButton.textContent = this.multiplayer.enabled && this.multiplayer.room
                ? `Leave Lobby: ${this.multiplayer.room}`
                : 'Join Lobby';
            this.multiplayer.lobbyButton.style.opacity = this.multiplayer.enabled ? '1' : '0.92';
        };

        const upsertRemotePlayer = (state) => {
            const remoteKey = getRemotePlayerKey(state);
            if (!state || !remoteKey) return;
            if (state.clientId && state.clientId === this.multiplayer.clientId) return;
            if (!state.clientId && state.playerId === this.multiplayer.playerId) return;

            const existing = this.multiplayer.remotePlayers.get(remoteKey) || {
                id: remoteKey,
                x: state.x,
                y: state.y,
                direction: state.direction || 'down',
                name: state.name || `Diver-${String(remoteKey).slice(-4)}`,
                color: state.color || '#80f4ff',
                lastSeen: Date.now(),
                element: null,
                spriteElement: null,
                nameElement: null
            };

            existing.x = typeof state.x === 'number' ? state.x : existing.x;
            existing.y = typeof state.y === 'number' ? state.y : existing.y;
            existing.direction = state.direction || existing.direction;
            existing.lastSeen = Date.now();
            if (state.name) existing.name = state.name;
            if (state.color) existing.color = state.color;

            if (!existing.element) {
                const el = document.createElement('div');
                Object.assign(el.style, {
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    zIndex: '10019',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 90ms linear, top 90ms linear'
                });

                const spriteEl = document.createElement('div');
                Object.assign(spriteEl.style, {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    imageRendering: 'pixelated',
                    backgroundColor: 'rgba(6, 24, 38, 0.2)'
                });

                const nameEl = document.createElement('div');
                nameEl.textContent = existing.name;
                Object.assign(nameEl.style, {
                    position: 'absolute',
                    left: '50%',
                    bottom: '46px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: "'Press Start 2P', cursive, monospace",
                    fontSize: '8px',
                    textShadow: '0 0 8px rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                });

                el.appendChild(spriteEl);
                el.appendChild(nameEl);
                document.body.appendChild(el);
                existing.element = el;
                existing.spriteElement = spriteEl;
                existing.nameElement = nameEl;
            }

            applyRemotePlayerSpriteFrame(existing);

            this.multiplayer.remotePlayers.set(remoteKey, existing);
        };

        const removeRemotePlayer = (playerId) => {
            const remote = this.multiplayer.remotePlayers.get(playerId);
            if (!remote) return;
            if (remote.element) remote.element.remove();
            this.multiplayer.remotePlayers.delete(playerId);
        };

        const broadcastMultiplayerMessage = (message) => {
            const payload = {
                ...message,
                room: this.multiplayer.room,
                playerId: this.multiplayer.playerId,
                clientId: this.multiplayer.clientId,
                timestamp: Date.now()
            };

            try {
                if (this.multiplayer.channel) {
                    this.multiplayer.channel.postMessage(payload);
                    return;
                }

                const key = `${this.multiplayer.channelName}_signal`;
                localStorage.setItem(key, JSON.stringify(payload));
                localStorage.removeItem(key);
            } catch (err) {
                // Multiplayer transport is best-effort and should not break gameplay.
            }
        };

        const handleMultiplayerMessage = (payload) => {
            if (!this.multiplayer.enabled || !this.multiplayer.room) return;
            if (!payload || payload.room !== this.multiplayer.room) return;
            if (payload.clientId && payload.clientId === this.multiplayer.clientId) return;
            if (!payload.clientId && payload.playerId === this.multiplayer.playerId) return;

            if (payload.type === 'join') {
                upsertRemotePlayer(payload);
                const localPlayer = this.getLocalPlayer?.();
                if (localPlayer) {
                    broadcastMultiplayerMessage({
                        type: 'state',
                        x: localPlayer.position?.x || 0,
                        y: localPlayer.position?.y || 0,
                        direction: localPlayer.direction || 'down',
                        name: this.multiplayer.displayName,
                        color: this.multiplayer.playerColor
                    });
                }
                return;
            }

            if (payload.type === 'leave') {
                removeRemotePlayer(getRemotePlayerKey(payload));
                return;
            }

            if (payload.type === 'state') {
                upsertRemotePlayer(payload);
            }
        };

        const updateRemotePlayerRender = () => {
            const top = this.gameEnv?.top || 0;
            this.multiplayer.remotePlayers.forEach((remote) => {
                if (!remote.element) return;
                remote.element.style.left = `${remote.x}px`;
                remote.element.style.top = `${top + remote.y}px`;
                applyRemotePlayerSpriteFrame(remote);
                if (remote.nameElement) remote.nameElement.textContent = remote.name;
            });
        };

        const getGameUiRoot = () => {
            const root = this.gameEnv?.container || document.body;
            if (root !== document.body) {
                const computedPosition = window.getComputedStyle(root).position;
                if (!computedPosition || computedPosition === 'static') {
                    root.style.position = 'relative';
                }
            }
            return root;
        };

        const appendGameUi = (element) => {
            getGameUiRoot().appendChild(element);
            return element;
        };

        const startMultiplayer = () => {
            if (!this.multiplayer.enabled || !this.multiplayer.room) return;
            if (this.multiplayer.heartbeatTimer) return;

            const colorPalette = ['#7de2ff', '#ffd36e', '#ff9fba', '#9affb8', '#d6adff'];
            this.multiplayer.playerColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            this.multiplayer.displayName = (localStorage.getItem('aquatic_multiplayer_name') || this.multiplayer.displayName || 'Diver').slice(0, 16);
            this.multiplayer.channelName = `aquatic_multiplayer_${this.multiplayer.room}`;
            updateMultiplayerButtonState();

            const panel = document.createElement('div');
            panel.id = 'aquatic-multiplayer-status';
            Object.assign(panel.style, {
                position: 'absolute',
                right: '14px',
                bottom: '14px',
                zIndex: '10051',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(138, 214, 249, 0.8)',
                background: 'rgba(2, 24, 45, 0.9)',
                color: '#d7f5ff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '9px',
                lineHeight: '1.6',
                minWidth: '240px',
                maxWidth: 'min(90vw, 360px)'
            });
            panel.textContent = `Lobby: ${this.multiplayer.room} | Players: 1`;
            appendGameUi(panel);
            this.multiplayer.uiPanel = panel;

            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel(this.multiplayer.channelName);
                channel.onmessage = (event) => handleMultiplayerMessage(event.data);
                this.multiplayer.channel = channel;
            } else {
                this.multiplayer.storageHandler = (event) => {
                    if (!event || event.key !== `${this.multiplayer.channelName}_signal` || !event.newValue) return;
                    try {
                        const payload = JSON.parse(event.newValue);
                        handleMultiplayerMessage(payload);
                    } catch (err) {
                        return;
                    }
                };
                window.addEventListener('storage', this.multiplayer.storageHandler);
            }

            this.multiplayer.heartbeatTimer = setInterval(() => {
                const player = this.getLocalPlayer?.();
                if (!player) return;
                broadcastMultiplayerMessage({
                    type: 'state',
                    x: player.position?.x || 0,
                    y: player.position?.y || 0,
                    direction: player.direction || 'down',
                    name: this.multiplayer.displayName,
                    color: this.multiplayer.playerColor
                });
                updateRemotePlayerRender();
            }, 120);

            this.multiplayer.pruneTimer = setInterval(() => {
                const now = Date.now();
                this.multiplayer.remotePlayers.forEach((remote, id) => {
                    if (now - remote.lastSeen > 3500) {
                        removeRemotePlayer(id);
                    }
                });

                if (this.multiplayer.uiPanel) {
                    this.multiplayer.uiPanel.textContent = `Lobby: ${this.multiplayer.room} | Players: ${this.multiplayer.remotePlayers.size + 1}`;
                }
            }, 700);

            broadcastMultiplayerMessage({
                type: 'join',
                name: this.multiplayer.displayName,
                color: this.multiplayer.playerColor
            });
        };

        const stopMultiplayer = () => {
            if (this.multiplayer.enabled && this.multiplayer.room) {
                broadcastMultiplayerMessage({ type: 'leave' });
            }

            if (this.multiplayer.heartbeatTimer) {
                clearInterval(this.multiplayer.heartbeatTimer);
                this.multiplayer.heartbeatTimer = null;
            }
            if (this.multiplayer.pruneTimer) {
                clearInterval(this.multiplayer.pruneTimer);
                this.multiplayer.pruneTimer = null;
            }

            if (this.multiplayer.channel) {
                this.multiplayer.channel.close();
                this.multiplayer.channel = null;
            }
            if (this.multiplayer.storageHandler) {
                window.removeEventListener('storage', this.multiplayer.storageHandler);
                this.multiplayer.storageHandler = null;
            }

            this.multiplayer.remotePlayers.forEach((remote) => {
                if (remote.element) remote.element.remove();
            });
            this.multiplayer.remotePlayers.clear();

            if (this.multiplayer.uiPanel) {
                this.multiplayer.uiPanel.remove();
                this.multiplayer.uiPanel = null;
            }

            this.multiplayer.enabled = false;
            this.multiplayer.room = '';
            this.multiplayer.channelName = '';
            sessionStorage.removeItem('aquatic_multiplayer_room');
            updateMultiplayerButtonState();
        };

        const openMultiplayerLobbyPrompt = () => {
            const defaultName = (localStorage.getItem('aquatic_multiplayer_name') || this.multiplayer.displayName || 'Diver').slice(0, 16);
            const nextName = window.prompt('Enter your diver name:', defaultName);
            if (nextName === null) return;

            const normalizedName = (nextName.trim() || defaultName || 'Diver').slice(0, 16);
            const suggestedRoom = this.multiplayer.room || `aquatic-${Math.random().toString(36).slice(2, 7)}`;
            const nextRoom = window.prompt('Enter a lobby code. Share the same code with another real player to join together.', suggestedRoom);
            if (nextRoom === null) return;

            const normalizedRoom = nextRoom.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 24);
            if (!normalizedRoom) {
                showTopMenuNotice('Lobby join cancelled: invalid room code.');
                return;
            }

            localStorage.setItem('aquatic_multiplayer_name', normalizedName);
            sessionStorage.setItem('aquatic_multiplayer_room', normalizedRoom);

            this.multiplayer.displayName = normalizedName;
            this.multiplayer.enabled = true;
            this.multiplayer.room = normalizedRoom;
            this.multiplayer.playerId = `aq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

            stopMultiplayer();

            this.multiplayer.displayName = normalizedName;
            this.multiplayer.enabled = true;
            this.multiplayer.room = normalizedRoom;
            this.multiplayer.playerId = `aq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            sessionStorage.setItem('aquatic_multiplayer_room', normalizedRoom);

            startMultiplayer();
            showTopMenuNotice(`Joined lobby ${normalizedRoom}. Waiting for another real player with the same code.`);
        };

        this.openMultiplayerLobbyPrompt = openMultiplayerLobbyPrompt;

        this.startMultiplayer = startMultiplayer;
        this.stopMultiplayer = stopMultiplayer;

        const lockPageScroll = () => {
            if (this._pageScrollLock) return;

            const docEl = document.documentElement;
            const body = document.body;
            const previous = {
                htmlOverflow: docEl.style.overflow,
                bodyOverflow: body.style.overflow,
                bodyOverscroll: body.style.overscrollBehavior,
            };

            const preventScroll = (event) => {
                const targetTag = event.target?.tagName;
                if (targetTag && /INPUT|TEXTAREA|SELECT/.test(targetTag)) return;
                event.preventDefault();
            };

            const preventScrollKeys = (event) => {
                const targetTag = event.target?.tagName;
                if (targetTag && /INPUT|TEXTAREA|SELECT/.test(targetTag)) return;
                if (["Space", "PageUp", "PageDown", "End", "Home", "ArrowUp", "ArrowDown"].includes(event.code)) {
                    event.preventDefault();
                }
            };

            docEl.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
            body.style.overscrollBehavior = 'none';
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', preventScrollKeys, { passive: false });

            this._pageScrollLock = {
                previous,
                preventScroll,
                preventScrollKeys,
            };
        };

        const unlockPageScroll = () => {
            if (!this._pageScrollLock) return;

            const docEl = document.documentElement;
            const body = document.body;
            docEl.style.overflow = this._pageScrollLock.previous.htmlOverflow;
            body.style.overflow = this._pageScrollLock.previous.bodyOverflow;
            body.style.overscrollBehavior = this._pageScrollLock.previous.bodyOverscroll;
            window.removeEventListener('wheel', this._pageScrollLock.preventScroll);
            window.removeEventListener('touchmove', this._pageScrollLock.preventScroll);
            window.removeEventListener('keydown', this._pageScrollLock.preventScrollKeys);
            this._pageScrollLock = null;
        };

        this.lockPageScroll = lockPageScroll;
        this.unlockPageScroll = unlockPageScroll;

        const requestRunnerFullscreen = () => {};

        this.requestRunnerFullscreen = requestRunnerFullscreen;

        const isRunnerFullscreenActive = () => !!document.querySelector('.game-fullscreen-overlay');

        const syncRunnerFullscreenState = () => {
            const isFullscreen = isRunnerFullscreenActive();
            if (this._runnerFullscreenActive === isFullscreen) return;

            this._runnerFullscreenActive = isFullscreen;
            if (isFullscreen) {
                lockPageScroll();
            } else {
                unlockPageScroll();
            }
        };

        const exitRunnerFullscreen = () => {
            const fullscreenButton = Array.from(document.querySelectorAll('button')).find((button) => {
                const label = `${button.textContent || ''} ${button.title || ''}`.toLowerCase();
                return label.includes('minimize') || label.includes('exit fullscreen');
            });

            fullscreenButton?.click();
        };

        const restartCurrentLevel = () => {
            const gameControl = this.gameEnv?.gameControl;
            if (!gameControl?.transitionToLevel) return;

            gameControl.isPaused = false;
            gameControl.transitionToLevel();
        };

        const handleRunnerFullscreenKeydown = (event) => {
            if (!isRunnerFullscreenActive()) return;

            const targetTag = event.target?.tagName;
            const isTextInput = (!!targetTag && /INPUT|TEXTAREA|SELECT/.test(targetTag)) || event.target?.isContentEditable;

            if (["Space", "PageUp", "PageDown", "End", "Home", "ArrowUp", "ArrowDown"].includes(event.code) && !isTextInput) {
                event.preventDefault();
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopImmediatePropagation();
                exitRunnerFullscreen();
                return;
            }

            if (!isTextInput && event.code === 'KeyR') {
                event.preventDefault();
                event.stopImmediatePropagation();
                restartCurrentLevel();
            }
        };

        this.syncRunnerFullscreenState = syncRunnerFullscreenState;
        this.handleRunnerFullscreenKeydown = handleRunnerFullscreenKeydown;

        // DialogueSystem owns a persistent controls row; only clear the button group.
        const clearDialogueActionButtons = (dialogueSystem) => {
            if (!dialogueSystem?.actionButtonGroup) return;
            dialogueSystem.actionButtonGroup.innerHTML = '';
        };

        const updateQuestHud = () => {
            if (this.gameMode === 'challenge') return;

            const hud = document.getElementById('aquatic-quest-hud');
            if (!hud) return;

            const title = document.getElementById('aquatic-quest-hud-title');
            const progress = document.getElementById('aquatic-quest-hud-progress');
            const status = document.getElementById('aquatic-quest-hud-status');

            const q1 = questState.firstQuest;
            const q2 = questState.secondQuest;

            if (!q1.accepted) {
                title.textContent = 'Quest Progress';
                progress.textContent = 'Starfish: 0 / ' + q1.starfishTotal;
                status.textContent = 'Talk to Mermaid to begin.';
                return;
            }

            if (!q1.completed) {
                title.textContent = 'Quest Progress';
                progress.textContent = 'Starfish: ' + q1.collected + ' / ' + q1.starfishTotal;
                status.textContent = q1.collected >= q1.starfishTotal
                    ? 'Return to Mermaid for turn-in.'
                    : 'Quest #1: Collect all starfishes.';
                return;
            }

            if (!q2.accepted) {
                title.textContent = 'Quest Progress';
                progress.textContent = 'Starfish: ' + q1.collected + ' / ' + q1.starfishTotal;
                status.textContent = 'Quest #1 complete. Talk to Slime for quest #2.';
                return;
            }

            title.textContent = 'Ocean Recovery Tracker';
            progress.textContent = 'Trash Removed: ' + q2.collected + ' / ' + q2.trashTotal;
            status.textContent = q2.pendingSlimeCompletion
                ? 'Return to Slime to finish level.'
                : (q2.inSurface ? 'Quest #2 active above water.' : 'Quest #2 in progress.');
        };

        const ensureQuestHud = () => {
            if (this.gameMode === 'challenge') return;

            const compactUi = isCompactGameUi();

            const existing = document.getElementById('aquatic-quest-hud');
            if (existing) {
                updateQuestHud();
                return;
            }

            const hud = document.createElement('div');
            hud.id = 'aquatic-quest-hud';
            Object.assign(hud.style, {
                position: 'absolute',
                top: compactUi ? '10px' : '14px',
                left: compactUi ? '10px' : '14px',
                zIndex: '10020',
                minWidth: compactUi ? '190px' : '290px',
                maxWidth: compactUi ? 'min(54vw, 250px)' : 'min(92vw, 420px)',
                padding: compactUi ? '9px 10px' : '14px 16px',
                borderRadius: compactUi ? '10px' : '14px',
                color: '#e9fbff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                background: 'linear-gradient(160deg, rgba(8, 45, 72, 0.92), rgba(3, 16, 34, 0.92))',
                border: '2px solid rgba(126, 219, 255, 0.72)',
                boxShadow: '0 8px 24px rgba(16, 132, 181, 0.38)'
            });

            const title = document.createElement('div');
            title.id = 'aquatic-quest-hud-title';
            Object.assign(title.style, {
                fontSize: compactUi ? '8px' : '11px',
                color: '#86e6ff',
                marginBottom: compactUi ? '6px' : '8px'
            });

            const progress = document.createElement('div');
            progress.id = 'aquatic-quest-hud-progress';
            Object.assign(progress.style, {
                fontSize: compactUi ? '8px' : '12px',
                marginBottom: compactUi ? '6px' : '8px',
                lineHeight: '1.4'
            });

            const status = document.createElement('div');
            status.id = 'aquatic-quest-hud-status';
            Object.assign(status.style, {
                fontSize: compactUi ? '7px' : '10px',
                color: '#b8f2ff',
                lineHeight: '1.5'
            });

            hud.appendChild(title);
            hud.appendChild(progress);
            hud.appendChild(status);
            appendGameUi(hud);

            updateQuestHud();
        };

        const loadChallengeLeaderboard = () => {
            try {
                const raw = localStorage.getItem(challengeState.leaderboardKey);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (err) {
                return [];
            }
        };

        const saveChallengeLeaderboard = (scores) => {
            try {
                localStorage.setItem(challengeState.leaderboardKey, JSON.stringify(scores));
            } catch (err) {
                return;
            }
        };

        const renderChallengeLeaderboard = () => {
            const list = document.getElementById('aquatic-challenge-list');
            if (!list) return;

            const scores = loadChallengeLeaderboard();
            list.innerHTML = '';

            if (!scores.length) {
                const li = document.createElement('li');
                li.textContent = 'No saved scores yet.';
                li.style.opacity = '0.85';
                list.appendChild(li);
                return;
            }

            scores.slice(0, 8).forEach((entry) => {
                const li = document.createElement('li');
                const dateText = entry.date ? new Date(entry.date).toLocaleDateString() : 'today';
                li.textContent = `${entry.name}: ${entry.score} (${dateText})`;
                li.style.marginBottom = '6px';
                list.appendChild(li);
            });
        };

        const updateChallengeHud = () => {
            if (this.gameMode !== 'challenge') return;
            const score = document.getElementById('aquatic-challenge-score');
            const wave = document.getElementById('aquatic-challenge-wave');
            const progress = document.getElementById('aquatic-challenge-progress');
            if (!score || !wave || !progress) return;

            score.textContent = `Score: ${challengeState.score}`;
            wave.textContent = `Wave: ${challengeState.wave}`;
            progress.textContent = `Collected: ${challengeState.collectedThisWave} / ${challengeState.waveTarget}`;
        };

        const isCompactGameUi = () => {
            const containerWidth = this.gameEnv?.container?.clientWidth || 0;
            const viewportWidth = window.innerWidth || 0;
            const effectiveWidth = containerWidth || viewportWidth;
            return effectiveWidth > 0 && effectiveWidth <= 980;
        };

        const showTopMenuNotice = (message) => {
            const existing = document.getElementById('aquatic-top-menu-notice');
            if (existing) existing.remove();

            const compactUi = isCompactGameUi();

            const note = document.createElement('div');
            note.id = 'aquatic-top-menu-notice';
            note.textContent = message;
            Object.assign(note.style, {
                position: 'absolute',
                top: compactUi ? '54px' : '64px',
                right: compactUi ? '10px' : '14px',
                zIndex: '10051',
                maxWidth: compactUi ? 'min(92vw, 280px)' : 'min(88vw, 360px)',
                padding: compactUi ? '7px 9px' : '10px 12px',
                borderRadius: compactUi ? '8px' : '10px',
                border: '1px solid rgba(138, 214, 249, 0.8)',
                background: 'rgba(2, 24, 45, 0.92)',
                color: '#d7f5ff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: compactUi ? '8px' : '10px',
                lineHeight: '1.5',
                boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)',
                opacity: '0',
                transition: 'opacity 180ms ease'
            });

            appendGameUi(note);
            requestAnimationFrame(() => {
                note.style.opacity = '1';
            });

            setTimeout(() => {
                note.style.opacity = '0';
                setTimeout(() => note.remove(), 200);
            }, 1700);
        };

        const saveCurrentChallengeScore = () => {
            if (challengeState.score <= challengeState.lastSavedScore) return;

            const input = document.getElementById('aquatic-challenge-name');
            const playerName = (input?.value || '').trim() || 'Diver';
            const scores = loadChallengeLeaderboard();
            scores.push({
                name: playerName.slice(0, 16),
                score: challengeState.score,
                date: new Date().toISOString()
            });
            scores.sort((a, b) => b.score - a.score);
            saveChallengeLeaderboard(scores.slice(0, 20));
            challengeState.lastSavedScore = challengeState.score;
            renderChallengeLeaderboard();
        };

        const toggleChallengeLeaderboard = () => {
            if (this.gameMode !== 'challenge') {
                showTopMenuNotice('Leaderboard is available in Challenge mode.');
                return;
            }

            const hud = document.getElementById('aquatic-challenge-hud');
            if (!hud) {
                ensureChallengeHud();
                showTopMenuNotice('Leaderboard opened.');
                return;
            }

            const isHidden = hud.style.display === 'none';
            hud.style.display = isHidden ? 'block' : 'none';
            showTopMenuNotice(isHidden ? 'Leaderboard opened.' : 'Leaderboard hidden.');
        };

        const switchToChallengeMode = () => {
            if (this.gameMode === 'challenge') {
                showTopMenuNotice('Already in Challenge mode.');
                return;
            }

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('mode', 'challenge');
            window.location.href = nextUrl.toString();
        };

        const switchToStoryMode = () => {
            if (this.gameMode === 'story') {
                showTopMenuNotice('Already in Story mode.');
                return;
            }

            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set('mode', 'story');
            window.location.href = nextUrl.toString();
        };

        const clearChallengeStarfish = () => {
            this.challengeStarfishIds.forEach((id) => {
                const obj = this.gameEnv?.gameObjects?.find((item) => item?.spriteData?.id === id);
                if (obj?.destroy) obj.destroy();
            });
            this.challengeStarfishIds = [];
        };

        const showChallengeWaveComplete = () => {
            const existing = document.getElementById('aquatic-challenge-wave-complete');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'aquatic-challenge-wave-complete';
            Object.assign(overlay.style, {
                position: 'fixed',
                inset: '0',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10021'
            });

            const panel = document.createElement('div');
            Object.assign(panel.style, {
                width: 'min(500px, 92vw)',
                padding: '22px',
                borderRadius: '16px',
                border: '2px solid rgba(130, 220, 255, 0.85)',
                background: 'linear-gradient(180deg, rgba(9,50,80,0.95), rgba(4,20,40,0.95))',
                color: '#e6fbff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                textAlign: 'center'
            });

            const title = document.createElement('div');
            title.textContent = 'Wave Cleared';
            title.style.fontSize = '16px';
            title.style.marginBottom = '12px';

            const body = document.createElement('div');
            body.textContent = `Current score: ${challengeState.score}`;
            body.style.fontSize = '11px';
            body.style.marginBottom = '16px';

            const next = document.createElement('button');
            next.textContent = 'Next Wave';
            Object.assign(next.style, {
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                marginBottom: '10px',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '11px',
                background: 'linear-gradient(90deg, #35b9ff, #5cf0ff)',
                color: '#032030',
                cursor: 'pointer'
            });

            const save = document.createElement('button');
            save.textContent = 'Save Score';
            Object.assign(save.style, {
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(156, 220, 255, 0.8)',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '11px',
                background: 'rgba(6, 40, 67, 0.8)',
                color: '#c6f3ff',
                cursor: 'pointer'
            });

            next.onclick = () => {
                overlay.remove();
                challengeState.wave += 1;
                challengeState.waveTarget += 2;
                challengeState.collectedThisWave = 0;
                startChallengeWave();
                updateChallengeHud();
            };

            save.onclick = () => {
                saveCurrentChallengeScore();
            };

            panel.appendChild(title);
            panel.appendChild(body);
            panel.appendChild(next);
            panel.appendChild(save);
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
        };

        const ensureChallengeHud = () => {
            if (this.gameMode !== 'challenge') return;

            const existing = document.getElementById('aquatic-challenge-hud');
            if (existing) {
                updateChallengeHud();
                renderChallengeLeaderboard();
                return;
            }

            const hud = document.createElement('div');
            hud.id = 'aquatic-challenge-hud';
            Object.assign(hud.style, {
                position: 'absolute',
                top: '14px',
                left: '14px',
                zIndex: '10020',
                minWidth: '320px',
                maxWidth: 'min(92vw, 420px)',
                padding: '14px 16px',
                borderRadius: '14px',
                color: '#e9fbff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                background: 'linear-gradient(160deg, rgba(8, 45, 72, 0.94), rgba(3, 16, 34, 0.94))',
                border: '2px solid rgba(126, 219, 255, 0.75)',
                boxShadow: '0 8px 24px rgba(16, 132, 181, 0.38)'
            });

            const title = document.createElement('div');
            title.textContent = 'Challenge Leaderboard';
            title.style.fontSize = '11px';
            title.style.color = '#86e6ff';
            title.style.marginBottom = '8px';

            const score = document.createElement('div');
            score.id = 'aquatic-challenge-score';
            score.style.fontSize = '12px';
            score.style.marginBottom = '6px';

            const wave = document.createElement('div');
            wave.id = 'aquatic-challenge-wave';
            wave.style.fontSize = '10px';
            wave.style.marginBottom = '6px';

            const progress = document.createElement('div');
            progress.id = 'aquatic-challenge-progress';
            progress.style.fontSize = '10px';
            progress.style.marginBottom = '10px';

            const name = document.createElement('input');
            name.id = 'aquatic-challenge-name';
            name.placeholder = 'Player name';
            Object.assign(name.style, {
                width: '100%',
                marginBottom: '8px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(138, 214, 249, 0.8)',
                background: 'rgba(1, 24, 44, 0.7)',
                color: '#d8f7ff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '10px'
            });

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save Score';
            Object.assign(saveBtn.style, {
                width: '100%',
                marginBottom: '8px',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '10px',
                background: 'linear-gradient(90deg, #35b9ff, #5cf0ff)',
                color: '#032030',
                cursor: 'pointer'
            });
            saveBtn.onclick = () => saveCurrentChallengeScore();

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear Leaderboard';
            Object.assign(clearBtn.style, {
                width: '100%',
                marginBottom: '10px',
                padding: '8px',
                borderRadius: '10px',
                border: '1px solid rgba(138, 214, 249, 0.8)',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '10px',
                background: 'rgba(2, 27, 50, 0.7)',
                color: '#c6f3ff',
                cursor: 'pointer'
            });
            clearBtn.onclick = () => {
                saveChallengeLeaderboard([]);
                renderChallengeLeaderboard();
            };

            const list = document.createElement('ol');
            list.id = 'aquatic-challenge-list';
            Object.assign(list.style, {
                margin: '0',
                paddingLeft: '18px',
                fontSize: '10px',
                lineHeight: '1.6',
                maxHeight: '170px',
                overflowY: 'auto'
            });

            hud.appendChild(title);
            hud.appendChild(score);
            hud.appendChild(wave);
            hud.appendChild(progress);
            hud.appendChild(name);
            hud.appendChild(saveBtn);
            hud.appendChild(clearBtn);
            hud.appendChild(list);
            appendGameUi(hud);

            updateChallengeHud();
            renderChallengeLeaderboard();
        };

        const ensureTopMenuBar = () => {
            const existing = document.getElementById('aquatic-top-menubar');
            if (existing) return;

            const compactUi = isCompactGameUi();

            const bar = document.createElement('div');
            bar.id = 'aquatic-top-menubar';
            Object.assign(bar.style, {
                position: 'absolute',
                top: compactUi ? '8px' : '12px',
                right: compactUi ? '10px' : '14px',
                zIndex: '10050',
                display: 'flex',
                gap: compactUi ? '6px' : '8px',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                maxWidth: compactUi ? 'min(62vw, 420px)' : 'min(95vw, 560px)',
                padding: compactUi ? '6px' : '8px',
                borderRadius: compactUi ? '10px' : '12px',
                border: '1px solid rgba(130, 220, 255, 0.6)',
                background: 'rgba(1, 20, 40, 0.82)',
                backdropFilter: 'blur(4px)'
            });

            const createButton = (label, isPrimary = false) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                Object.assign(btn.style, {
                    padding: compactUi ? '6px 8px' : '8px 10px',
                    borderRadius: compactUi ? '7px' : '9px',
                    border: isPrimary ? 'none' : '1px solid rgba(138, 214, 249, 0.75)',
                    background: isPrimary
                        ? 'linear-gradient(90deg, #35b9ff, #5cf0ff)'
                        : 'rgba(6, 40, 67, 0.82)',
                    color: isPrimary ? '#032030' : '#c7f3ff',
                    fontFamily: "'Press Start 2P', cursive, monospace",
                    fontSize: compactUi ? '8px' : '9px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                });
                return btn;
            };

            const toggleLeaderboardBtn = createButton('Toggle Leaderboard');
            toggleLeaderboardBtn.onclick = () => toggleChallengeLeaderboard();

            const saveScoreBtn = createButton('Save Score');
            saveScoreBtn.onclick = () => {
                if (this.gameMode !== 'challenge') {
                    showTopMenuNotice('Score saving is available in Challenge mode.');
                    return;
                }
                const before = challengeState.lastSavedScore;
                saveCurrentChallengeScore();
                showTopMenuNotice(
                    challengeState.lastSavedScore > before
                        ? 'Score saved to leaderboard.'
                        : 'No new score to save yet.'
                );
            };

            const switchStoryBtn = createButton('Story Mode');
            switchStoryBtn.onclick = () => switchToStoryMode();

            const switchChallengeBtn = createButton('Challenge Mode', true);
            switchChallengeBtn.onclick = () => switchToChallengeMode();

            const lobbyBtn = createButton('Join Lobby');
            lobbyBtn.onclick = () => {
                if (this.multiplayer.enabled && this.multiplayer.room) {
                    const roomName = this.multiplayer.room;
                    stopMultiplayer();
                    showTopMenuNotice(`Left lobby ${roomName}.`);
                    return;
                }

                openMultiplayerLobbyPrompt();
            };
            this.multiplayer.lobbyButton = lobbyBtn;
            updateMultiplayerButtonState();

            if (this.gameMode === 'challenge') {
                switchChallengeBtn.textContent = 'Challenge Active';
                switchChallengeBtn.style.opacity = '0.78';
                switchStoryBtn.style.opacity = '1';
            } else {
                switchStoryBtn.textContent = 'Story Active';
                switchStoryBtn.style.opacity = '0.78';
            }

            bar.appendChild(toggleLeaderboardBtn);
            bar.appendChild(saveScoreBtn);
            bar.appendChild(lobbyBtn);
            bar.appendChild(switchStoryBtn);
            bar.appendChild(switchChallengeBtn);
            appendGameUi(bar);
        };

        // Start the next challenge wave by respawning a full starfish set.
        const startChallengeWave = () => {
            if (this.gameMode !== 'challenge') return;
            clearChallengeStarfish();
            spawnStarfish(challengeState.waveTarget, true);
            updateChallengeHud();
        };

        const setBackground = (src) => {
            const backgroundObject = this.gameEnv?.gameObjects?.find(
                obj => obj?.constructor?.name === 'GameEnvBackground'
            );
            if (!backgroundObject) return;

            const nextImage = new Image();
            nextImage.onload = () => {
                backgroundObject.image = nextImage;
                if (backgroundObject.spriteData) {
                    backgroundObject.spriteData.src = src;
                }
            };
            nextImage.onerror = () => {
                console.warn('Aquatic background asset failed to load:', src);
            };
            nextImage.src = src;
        };

        // Shared cinematic overlay for scene changes.
        const transitionOverlay = (label) => {
            showTopMenuNotice?.(label);
            return null;
        };

        // Locks input while moving the player vertically for transition scenes.
        const animatePlayerSwim = (targetY) => {
            const player = getPlayer();
            if (!player) return Promise.resolve();

            this.playerLock = true;
            player.velocity.x = 0;
            player.velocity.y = 0;
            player.pressedKeys = {};
            player.direction = targetY < player.position.y ? 'up' : 'down';

            return new Promise((resolve) => {
                let frameCount = 0;
                const step = () => {
                    frameCount += 1;
                    if (!player || !player.position || frameCount > 420) {
                        resolve();
                        return;
                    }
                    const current = player.position.y;
                    const delta = targetY - current;
                    if (Math.abs(delta) <= 2) {
                        player.position.y = targetY;
                        resolve();
                        return;
                    }

                    player.position.y += Math.sign(delta) * 5;
                    requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            });
        };

        const createTridentFallbackSprite = () => {
            const c = document.createElement('canvas');
            c.width = 72;
            c.height = 168;
            const ctx = c.getContext('2d');
            if (!ctx) return '';

            ctx.clearRect(0, 0, c.width, c.height);
            ctx.imageSmoothingEnabled = false;

            ctx.fillStyle = '#6e5843';
            ctx.fillRect(32, 28, 8, 118);
            ctx.fillStyle = '#8bdfff';
            ctx.strokeStyle = '#d9f8ff';
            ctx.lineWidth = 2;

            // Trident head (three prongs) drawn upright so the tip points toward -Y.
            const drawProng = (offsetX, tipX, tipY) => {
                ctx.beginPath();
                ctx.moveTo(36 + offsetX, 34);
                ctx.lineTo(tipX, tipY);
                ctx.lineTo(36 + offsetX, 18);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };

            drawProng(-10, 18, 2);
            drawProng(0, 36, 0);
            drawProng(10, 54, 2);

            ctx.fillStyle = '#8bdfff';
            ctx.fillRect(24, 26, 24, 6);

            ctx.fillStyle = 'rgba(215, 248, 255, 0.65)';
            ctx.fillRect(35, 42, 2, 84);
            return c.toDataURL();
        };

        let tridentSpriteSrc = createTridentFallbackSprite();
        const tridentAssetPath = `${assetPath}/trident.png`;
        const tridentAsset = new Image();
        tridentAsset.onload = () => {
            tridentSpriteSrc = tridentAssetPath;
        };
        tridentAsset.onerror = () => {};
        tridentAsset.src = tridentAssetPath;
        const tridentAimOffset = Math.PI / 2;

        const createDetailedTrashSprites = () => {
            const makeCanvas = () => {
                const c = document.createElement('canvas');
                c.width = 72;
                c.height = 72;
                return c;
            };

            const toDataUrl = (drawFn) => {
                const c = makeCanvas();
                const ctx = c.getContext('2d');
                drawFn(ctx, c.width, c.height);
                return c.toDataURL();
            };

            const bottle = toDataUrl((ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = 'rgba(207, 240, 252, 0.88)';
                ctx.strokeStyle = 'rgba(120, 189, 216, 0.95)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(24, 14, 22, 10, 3);
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.roundRect(20, 22, 30, 34, 7);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = 'rgba(56, 150, 210, 0.85)';
                ctx.fillRect(23, 35, 24, 8);
                ctx.fillStyle = 'rgba(235, 249, 255, 0.4)';
                ctx.fillRect(24, 25, 5, 24);
            });

            const can = toDataUrl((ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                const grd = ctx.createLinearGradient(0, 20, 0, 58);
                grd.addColorStop(0, '#cfd7de');
                grd.addColorStop(0.5, '#9ca8b1');
                grd.addColorStop(1, '#7d8a95');
                ctx.fillStyle = grd;
                ctx.strokeStyle = '#5c6872';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(18, 18, 36, 38, 8);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#dce3e8';
                ctx.beginPath();
                ctx.ellipse(36, 18, 18, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#f15b5b';
                ctx.fillRect(22, 30, 28, 10);
                ctx.fillStyle = '#fff';
                ctx.fillRect(24, 33, 24, 2);
            });

            const bag = toDataUrl((ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = 'rgba(245, 245, 245, 0.85)';
                ctx.strokeStyle = 'rgba(146, 164, 176, 0.95)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(18, 22);
                ctx.quadraticCurveTo(16, 9, 28, 11);
                ctx.quadraticCurveTo(36, 15, 44, 11);
                ctx.quadraticCurveTo(56, 9, 54, 22);
                ctx.lineTo(50, 54);
                ctx.quadraticCurveTo(36, 62, 22, 54);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = 'rgba(99, 124, 142, 0.35)';
                ctx.fillRect(24, 32, 24, 12);
            });

            const sixPackRing = toDataUrl((ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(245, 240, 225, 0.95)';
                ctx.lineWidth = 4;
                const centers = [
                    [24, 25], [36, 25], [48, 25],
                    [24, 39], [36, 39], [48, 39]
                ];
                centers.forEach(([x, y]) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, Math.PI * 2);
                    ctx.stroke();
                });
            });

            const carton = toDataUrl((ctx, w, h) => {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#d6a066';
                ctx.strokeStyle = '#8e6338';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(19, 18, 34, 36, 4);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#be7f41';
                ctx.fillRect(19, 32, 34, 8);
                ctx.fillStyle = '#f4d7b6';
                ctx.fillRect(23, 23, 12, 6);
                ctx.fillRect(37, 23, 12, 6);
            });

            return [bottle, can, bag, sixPackRing, carton];
        };

        const trashSprites = createDetailedTrashSprites();

        // Hide NPC layer during surface quest scene and restore afterward.
        const setWorldNpcVisibility = (visible) => {
            const ids = ['Mermaid', 'Random Slime', 'Shark'];
            if (!questState.secondQuest.completed) {
                ids.push('Kirby');
            }
            (this.gameEnv?.gameObjects || []).forEach((obj) => {
                if (!obj?.spriteData?.id || !ids.includes(obj.spriteData.id) || !obj.canvas) return;
                obj.canvas.style.display = visible ? 'block' : 'none';
                obj.canvas.style.opacity = '1';
                obj.canvas.style.filter = '';
            });
        };

        // Narrative beat: Kirby disappears permanently after quest #2 completion.
        const hideKirbyAfterQuestTwo = () => {
            const kirby = this.gameEnv?.gameObjects?.find(
                (obj) => obj?.spriteData?.id === 'Kirby'
            );
            if (!kirby) return;

            if (kirby.canvas) kirby.canvas.style.display = 'none';
            kirby.position.x = -10000;
            kirby.position.y = -10000;
            kirby.interact = function() {};
            kirby.reaction = function() {};
        };

        // Build quest #2 cleanup targets with lightweight floating animation.
        const spawnSurfaceTrash = () => {
            if (questState.secondQuest.inSurface === false) return;

            const padding = 80;
            const positions = [];
            const count = questState.secondQuest.trashTotal;
            const maxX = Math.max(padding + 1, width - padding);
            const maxY = Math.max(100, height - 90);
            let attempts = 0;

            while (positions.length < count && attempts < 600) {
                attempts += 1;
                const x = Math.floor(Math.random() * (maxX - padding) + padding);
                const y = Math.floor(Math.random() * (maxY - 90) + 90);
                const tooClose = positions.some((p) => Math.hypot(p.x - x, p.y - y) < 64);
                if (!tooClose) positions.push({ x, y });
            }

            positions.forEach((pos, i) => {
                const trashData = {
                    id: `surface_trash_${i}`,
                    src: trashSprites[i % trashSprites.length],
                    SCALE_FACTOR: 18,
                    STEP_FACTOR: 0,
                    ANIMATION_RATE: 1,
                    INIT_POSITION: { x: pos.x, y: pos.y },
                    pixels: { height: 72, width: 72 },
                    orientation: { rows: 1, columns: 1 },
                    hitbox: { widthPercentage: 0.38, heightPercentage: 0.38 },
                    greeting: 'Trash removed from the ocean surface!',
                    dialogues: ['Trash removed from the ocean surface!'],
                    reaction: function() {},
                    showReactionDialogue: function() {
                        if (typeof this.showItemMessage === 'function') {
                            this.showItemMessage();
                        }
                    },
                    interact: function() {
                        if (questState.secondQuest.completed) {
                            this.destroy();
                            return;
                        }
                        questState.secondQuest.collected += 1;
                        updateQuestHud();
                        if (questState.secondQuest.collected >= questState.secondQuest.trashTotal) {
                            transitionBackUnderwater();
                        }
                        this.destroy();
                    }
                };

                const trash = new Collectible(trashData, gameEnv);
                const baseX = pos.x;
                const baseY = pos.y;
                const phase = Math.random() * Math.PI * 2;
                const driftDir = Math.random() > 0.5 ? 1 : -1;
                const driftSpeed = 0.18 + Math.random() * 0.26;
                const bobAmplitude = 4 + Math.random() * 4;
                const rotateAmplitude = 6 + Math.random() * 8;
                const originalUpdate = trash.update.bind(trash);

                trash.update = function() {
                    originalUpdate();

                    const t = performance.now() * 0.0018 + phase;
                    const bob = Math.sin(t * 2.1) * bobAmplitude;
                    const drift = Math.sin(t * 0.55) * 26 * driftDir;
                    const rotation = Math.sin(t * 1.7) * rotateAmplitude;

                    this.position.x = baseX + drift * driftSpeed;
                    this.position.y = baseY + bob;

                    if (this.canvas) {
                        this.canvas.style.transformOrigin = 'center center';
                        this.canvas.style.transform = `rotate(${rotation}deg)`;
                        this.canvas.style.filter = 'drop-shadow(0 6px 4px rgba(0,0,0,0.25))';
                    }
                };

                this.surfaceTrashIds.push(trashData.id);
                gameEnv.gameObjects.push(trash);
            });
        };

        const clearSurfaceTrash = () => {
            this.surfaceTrashIds.forEach((id) => {
                const obj = this.gameEnv?.gameObjects?.find((item) => item?.spriteData?.id === id);
                if (obj?.destroy) obj.destroy();
            });
            this.surfaceTrashIds = [];
        };

        // Story transition: underwater world -> surface cleanup scene.
        const transitionToSurface = async () => {
            const q2 = questState.secondQuest;
            if (q2.inSurface || q2.returning || q2.completed) return;

            q2.started = true;
            q2.inSurface = true;
            updateQuestHud();

            const overlay = transitionOverlay('Swimming to the surface...');
            try {
                await animatePlayerSwim(14);
                stopUnderwaterTheme();
                setBackground(assetPath + '/Above the water.png');
                setWorldNpcVisibility(false);

                const player = getPlayer();
                if (player) {
                    player.position.x = Math.min(this.gameEnv.innerWidth - player.width - 20, Math.max(20, player.position.x));
                    player.position.y = Math.max(80, this.gameEnv.innerHeight * 0.32);
                }

                spawnSurfaceTrash();
                updateQuestHud();
            } catch (err) {
                console.error('Surface transition failed:', err);
            } finally {
                if (overlay) {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 350);
                }
                this.playerLock = false;
            }
        };

        // Story transition: return underwater and unlock Slime final turn-in.
        const transitionBackUnderwater = async () => {
            const q2 = questState.secondQuest;
            if (!q2.inSurface || q2.returning || q2.completed) return;

            q2.returning = true;
            updateQuestHud();

            const overlay = transitionOverlay('Diving back underwater...');
            try {
                const playerBeforeSwitch = getPlayer();
                if (playerBeforeSwitch) {
                    const diveTargetY = Math.min(
                        this.gameEnv.innerHeight - 40,
                        playerBeforeSwitch.position.y + 220
                    );
                    await animatePlayerSwim(diveTargetY);
                }

                setBackground(assetPath + '/Aquatic.png');
                setWorldNpcVisibility(true);
                clearSurfaceTrash();
                playUnderwaterTheme(true);

                const player = getPlayer();
                if (player) {
                    player.position.x = 240;
                    player.position.y = 60;
                }

                await animatePlayerSwim(300);

                q2.inSurface = false;
                q2.completed = true;
                q2.pendingSlimeCompletion = true;
                hideKirbyAfterQuestTwo();
                updateQuestHud();
            } catch (err) {
                console.error('Underwater return transition failed:', err);
            } finally {
                q2.returning = false;
                this.playerLock = false;
                if (overlay) {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 350);
                }
            }
        };

        this.updateQuestHud = updateQuestHud;
        this.ensureQuestHud = ensureQuestHud;
        this.ensureChallengeHud = ensureChallengeHud;
        this.startChallengeWave = startChallengeWave;
        this.saveCurrentChallengeScore = saveCurrentChallengeScore;
        this.ensureTopMenuBar = ensureTopMenuBar;
        this.toggleChallengeLeaderboard = toggleChallengeLeaderboard;
        this.switchToChallengeMode = switchToChallengeMode;
        this.clearSurfaceTrash = clearSurfaceTrash;
        this.clearChallengeStarfish = clearChallengeStarfish;

        this.sharkGameOverShown = false;

        this.showSharkGameOver = () => {
            if (this.sharkGameOverShown) return;
            this.sharkGameOverShown = true;
            const canRetryBossFight = !!(
                this.bossState?.active ||
                this.bossState?.combatReady ||
                this.bossState?.introPlayed
            );

            // Freeze boss encounter immediately so no abilities continue after death.
            if (this.bossState) {
                this.bossState.combatReady = false;
                this.bossState.activeAbility = null;
                this.bossState.abilityCommitted = false;
                if (this.bossState.laserBeam?.element) {
                    this.bossState.laserBeam.element.remove();
                }
                this.bossState.laserBeam = null;
                this.bossState.enemyProjectiles?.forEach((p) => p?.element?.remove());
                this.bossState.enemyProjectiles = [];
            }
            this.playerLock = true;

            const existing = document.getElementById('aquatic-shark-gameover');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'aquatic-shark-gameover';
            Object.assign(overlay.style, {
                position: 'fixed',
                inset: '0',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10001'
            });

            const panel = document.createElement('div');
            Object.assign(panel.style, {
                width: 'min(520px, 92vw)',
                borderRadius: '16px',
                padding: '24px',
                background: 'linear-gradient(180deg, rgba(8, 46, 74, 0.95), rgba(4, 18, 36, 0.95))',
                border: '2px solid rgba(110, 206, 255, 0.8)',
                boxShadow: '0 0 30px rgba(56, 183, 255, 0.35)',
                color: '#e6fbff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                textAlign: 'center'
            });

            const title = document.createElement('div');
            title.textContent = 'Game Over';
            Object.assign(title.style, {
                fontSize: '18px',
                marginBottom: '14px',
                color: '#7de2ff',
                textShadow: '0 0 12px rgba(125, 226, 255, 0.7)'
            });

            const body = document.createElement('div');
            body.textContent = this.gameMode === 'challenge'
                ? `You've been eaten by shark. Final score: ${challengeState.score}.`
                : (canRetryBossFight
                    ? "You've been eaten by shark. You can retry the boss fight."
                    : "You've been eaten by shark. You can replay.");
            Object.assign(body.style, {
                fontSize: '12px',
                lineHeight: '1.6',
                marginBottom: '20px'
            });

            const save = document.createElement('button');
            save.textContent = 'Save Score';
            Object.assign(save.style, {
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(156, 220, 255, 0.8)',
                marginBottom: '10px',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '12px',
                background: 'rgba(6, 40, 67, 0.8)',
                color: '#c6f3ff',
                cursor: 'pointer',
                display: this.gameMode === 'challenge' ? 'block' : 'none'
            });

            const restart = document.createElement('button');
            restart.textContent = this.gameMode === 'challenge'
                ? 'Replay Challenge'
                : (canRetryBossFight ? 'Retry Boss Fight' : 'Replay');
            Object.assign(restart.style, {
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '12px',
                background: 'linear-gradient(90deg, #35b9ff, #5cf0ff)',
                color: '#032030',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(53, 185, 255, 0.4)'
            });

            restart.onclick = () => {
                if (this.gameMode === 'challenge') {
                    window.location.reload();
                    return;
                }

                overlay.remove();
                if (canRetryBossFight) {
                    this.retryBossEncounter?.();
                } else {
                    window.location.reload();
                }
            };

            save.onclick = () => {
                saveCurrentChallengeScore();
            };

            panel.appendChild(title);
            panel.appendChild(body);
            if (this.gameMode === 'challenge') panel.appendChild(save);
            panel.appendChild(restart);
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
        };

        const getDirectionToward = (fromX, fromY, toX, toY) => {
            const dx = toX - fromX;
            const dy = toY - fromY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            if (absX < 3 && absY < 3) return 'down';
            if (absX > absY * 1.6) return dx >= 0 ? 'right' : 'left';
            if (absY > absX * 1.6) return dy >= 0 ? 'down' : 'up';
            if (dx >= 0 && dy >= 0) return 'downRight';
            if (dx >= 0 && dy < 0) return 'upRight';
            if (dx < 0 && dy >= 0) return 'downLeft';
            return 'upLeft';
        };

        const ensureBossHud = () => {
            if (!this.bossState.active || this.bossState.hud) return;

            const hud = document.createElement('div');
            hud.id = 'aquatic-boss-hud';
            Object.assign(hud.style, {
                position: 'absolute',
                right: '14px',
                top: '14px',
                zIndex: '10060',
                width: 'min(360px, 72vw)',
                border: '2px solid rgba(255, 140, 140, 0.9)',
                borderRadius: '12px',
                background: 'rgba(33, 7, 13, 0.92)',
                padding: '8px 10px',
                fontFamily: "'Press Start 2P', cursive, monospace",
                color: '#ffe8e8',
                fontSize: '10px'
            });

            const title = document.createElement('div');
            title.textContent = 'MEGALODON';
            title.style.marginBottom = '6px';

            const barWrap = document.createElement('div');
            Object.assign(barWrap.style, {
                width: '100%',
                height: '14px',
                borderRadius: '7px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.12)'
            });

            const bar = document.createElement('div');
            bar.id = 'aquatic-boss-hp-fill';
            Object.assign(bar.style, {
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #ff6161, #ffb347)',
                transition: 'width 120ms linear'
            });
            barWrap.appendChild(bar);

            const help = document.createElement('div');
            help.textContent = 'Aim with mouse, Left Click: Shoot, Right Click: Trident Slash';
            help.style.marginTop = '7px';
            help.style.opacity = '0.92';
            help.style.fontSize = '8px';

            hud.appendChild(title);
            hud.appendChild(barWrap);
            hud.appendChild(help);
            appendGameUi(hud);
            this.bossState.hud = hud;

            const playerHud = document.createElement('div');
            playerHud.id = 'aquatic-player-hp-hud';
            Object.assign(playerHud.style, {
                position: 'absolute',
                left: '14px',
                bottom: '14px',
                zIndex: '10060',
                width: 'min(270px, 64vw)',
                border: '2px solid rgba(102, 222, 255, 0.85)',
                borderRadius: '12px',
                background: 'rgba(3, 20, 38, 0.92)',
                padding: '8px 10px',
                fontFamily: "'Press Start 2P', cursive, monospace",
                color: '#d9f7ff',
                fontSize: '10px'
            });

            const pTitle = document.createElement('div');
            pTitle.textContent = 'DIVER';
            pTitle.style.marginBottom = '6px';

            const pWrap = document.createElement('div');
            Object.assign(pWrap.style, {
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.12)'
            });

            const pFill = document.createElement('div');
            pFill.id = 'aquatic-player-hp-fill';
            Object.assign(pFill.style, {
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #66ffcc, #58bcff)',
                transition: 'width 120ms linear'
            });
            pWrap.appendChild(pFill);

            playerHud.appendChild(pTitle);
            playerHud.appendChild(pWrap);
            appendGameUi(playerHud);
        };

        const updateBossHud = () => {
            if (!this.bossState.hud) return;
            const fill = document.getElementById('aquatic-boss-hp-fill');
            if (!fill) return;
            const ratio = Math.max(0, Math.min(1, this.bossState.hp / this.bossState.maxHp));
            fill.style.width = `${Math.round(ratio * 100)}%`;

            const playerFill = document.getElementById('aquatic-player-hp-fill');
            if (playerFill) {
                const pRatio = Math.max(0, Math.min(1, this.bossState.playerHp / this.bossState.playerMaxHp));
                playerFill.style.width = `${Math.round(pRatio * 100)}%`;
            }
        };

        const showBottomStoryDialogue = async (speaker, text) => {
            const existing = document.getElementById('aquatic-boss-dialogue');
            if (existing) existing.remove();

            const box = document.createElement('div');
            box.id = 'aquatic-boss-dialogue';
            Object.assign(box.style, {
                position: 'fixed',
                left: '50%',
                bottom: '20px',
                transform: 'translateX(-50%)',
                zIndex: '10061',
                width: 'min(860px, 92vw)',
                background: 'linear-gradient(180deg, rgba(8, 56, 96, 0.88), rgba(5, 29, 58, 0.78))',
                border: '2px solid rgba(136, 225, 255, 0.85)',
                borderRadius: '12px',
                padding: '12px',
                fontFamily: "'Press Start 2P', cursive, monospace",
                color: '#dff8ff',
                fontSize: '13px',
                lineHeight: '1.6',
                boxShadow: '0 10px 22px rgba(0, 26, 51, 0.28)',
                backdropFilter: 'blur(1.5px)'
            });

            const speakerEl = document.createElement('div');
            speakerEl.textContent = speaker;
            speakerEl.style.color = '#88e1ff';
            speakerEl.style.marginBottom = '8px';
            const textEl = document.createElement('div');
            textEl.textContent = text;

            box.appendChild(speakerEl);
            box.appendChild(textEl);
            document.body.appendChild(box);

            const durationMs = Number.isFinite(arguments[2]) ? arguments[2] : 2600;
            await new Promise((resolve) => setTimeout(resolve, durationMs));
            box.remove();
        };

        const getBossOverlayRoot = () => this.gameEnv?.container || document.body;
        const getBossOverlayTopOffset = () => (getBossOverlayRoot() === document.body ? (this.gameEnv.top || 0) : 0);
        const appendBossOverlay = (element) => {
            getBossOverlayRoot().appendChild(element);
            return element;
        };

        const shakeWorld = async (ms = 900) => {
            const bg = this.gameEnv?.gameObjects?.find(obj => obj?.constructor?.name === 'GameEnvBackground');
            const target = this.gameEnv?.container || bg?.canvas || document.body;
            if (!target) return;

            const animationName = 'aquatic-world-shake';
            if (!document.getElementById('aquatic-shake-style')) {
                const style = document.createElement('style');
                style.id = 'aquatic-shake-style';
                style.textContent = `
                    @keyframes ${animationName} {
                        0% { transform: translate(0,0); }
                        20% { transform: translate(-6px, 4px) scale(1.04); }
                        40% { transform: translate(7px, -4px) scale(1.04); }
                        60% { transform: translate(-5px, -3px) scale(1.04); }
                        80% { transform: translate(5px, 3px) scale(1.04); }
                        100% { transform: translate(0,0); }
                    }
                `;
                document.head.appendChild(style);
            }

            const previousOverflow = target.style.overflow;
            const previousTransformOrigin = target.style.transformOrigin;
            target.style.animation = `${animationName} 120ms linear infinite`;
            target.style.overflow = 'hidden';
            target.style.transformOrigin = 'center center';
            await new Promise((resolve) => setTimeout(resolve, ms));
            target.style.animation = '';
            target.style.overflow = previousOverflow;
            target.style.transformOrigin = previousTransformOrigin;
        };

        const spawnHitEffect = (x, y, color = '#9ef8ff') => {
            const fx = document.createElement('div');
            Object.assign(fx.style, {
                position: 'absolute',
                left: `${x}px`,
                top: `${getBossOverlayTopOffset() + y}px`,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${color}`,
                boxShadow: `0 0 16px ${color}`,
                transform: 'translate(-50%, -50%) scale(0.4)',
                opacity: '1',
                transition: 'transform 240ms ease, opacity 240ms ease',
                pointerEvents: 'none',
                zIndex: '10062'
            });
            appendBossOverlay(fx);
            requestAnimationFrame(() => {
                fx.style.transform = 'translate(-50%, -50%) scale(2.2)';
                fx.style.opacity = '0';
            });
            setTimeout(() => fx.remove(), 260);
        };

        const getBossThemeAudio = () => {
            if (this.bossState.themeAudio) return this.bossState.themeAudio;

            const audio = new Audio(this.bossMusicSrc);
            audio.loop = false;
            audio.preload = 'auto';
            audio.volume = 0.55;
            this.bossState.themeAudio = audio;
            return audio;
        };

        const getBossThemeAudioPhaseTwo = () => {
            if (this.bossState.themeAudioPhaseTwo) return this.bossState.themeAudioPhaseTwo;

            const audio = new Audio(this.bossMusicPhaseTwoSrc);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.55;
            this.bossState.themeAudioPhaseTwo = audio;
            return audio;
        };

        const playBossTheme = async () => {
            const audio = getBossThemeAudio();
            const phaseTwoAudio = getBossThemeAudioPhaseTwo();

            audio.onended = null;
            phaseTwoAudio.onended = null;
            audio.pause();
            phaseTwoAudio.pause();
            audio.currentTime = 0;
            phaseTwoAudio.currentTime = 0;
            this.bossState.activeThemeAudio = audio;

            audio.onended = async () => {
                if (!this.bossState.active || !this.bossState.combatReady) return;

                this.bossState.activeThemeAudio = phaseTwoAudio;
                phaseTwoAudio.currentTime = 0;
                try {
                    await phaseTwoAudio.play();
                } catch (err) {
                    console.warn('Unable to play aquatic boss phase-two theme', err);
                }
            };

            try {
                await audio.play();
            } catch (err) {
                console.warn('Unable to play aquatic boss theme', err);
            }
        };

        const resumeBossTheme = async () => {
            const audio = this.bossState.activeThemeAudio || getBossThemeAudio();
            if (!audio.paused) return;
            try {
                await audio.play();
            } catch (err) {
                console.warn('Unable to resume aquatic boss theme', err);
            }
        };

        const stopBossTheme = (resetPlayback = true) => {
            [this.bossState.themeAudio, this.bossState.themeAudioPhaseTwo].forEach((audio) => {
                if (!audio) return;
                audio.onended = null;
                audio.pause();
                if (resetPlayback) {
                    audio.currentTime = 0;
                }
            });
            this.bossState.activeThemeAudio = null;
        };

        const getUnderwaterThemeAudio = () => {
            if (this.pauseSyncState.underwaterThemeAudio) return this.pauseSyncState.underwaterThemeAudio;

            const audio = new Audio(this.underwaterMusicSrc);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.48;
            this.pauseSyncState.underwaterThemeAudio = audio;
            return audio;
        };

        const shouldPlayUnderwaterTheme = () => {
            const q2 = questState.secondQuest;
            return !this.bossState.active && !q2?.inSurface && !q2?.returning;
        };

        const playUnderwaterTheme = async (restartPlayback = false) => {
            if (!shouldPlayUnderwaterTheme()) return;

            stopBossTheme(false);
            const audio = getUnderwaterThemeAudio();
            if (restartPlayback) {
                audio.pause();
                audio.currentTime = 0;
            } else if (!audio.paused) {
                return;
            }

            try {
                await audio.play();
            } catch (err) {
                console.warn('Unable to play aquatic underwater theme', err);
            }
        };

        const stopUnderwaterTheme = (resetPlayback = true) => {
            const audio = this.pauseSyncState.underwaterThemeAudio;
            if (!audio) return;
            audio.pause();
            if (resetPlayback) {
                audio.currentTime = 0;
            }
        };

        const setStorySceneUiVisibility = (visible) => {
            const ids = ['aquatic-top-menubar', 'aquatic-top-menu-notice', 'aquatic-quest-hud'];

            if (!visible) {
                this.storyUiState.hiddenElements = ids.map((id) => {
                    const element = document.getElementById(id);
                    if (!element) return null;

                    const previousDisplay = element.style.display;
                    element.style.display = 'none';
                    return { id, previousDisplay };
                }).filter(Boolean);
                return;
            }

            (this.storyUiState.hiddenElements || []).forEach((entry) => {
                const element = document.getElementById(entry.id);
                if (!element) return;
                element.style.display = entry.previousDisplay ?? '';
            });
            this.storyUiState.hiddenElements = [];
        };

        const shiftBossPauseTimers = (elapsedMs) => {
            if (!elapsedMs) return;

            const shiftTimestamp = (value) => (typeof value === 'number' && value > 0 ? value + elapsedMs : value);
            this.bossState.nextAbilityAt = shiftTimestamp(this.bossState.nextAbilityAt);
            this.bossState.abilityEndsAt = shiftTimestamp(this.bossState.abilityEndsAt);
            this.bossState.lastShotAt = shiftTimestamp(this.bossState.lastShotAt);
            this.bossState.lastMeleeAt = shiftTimestamp(this.bossState.lastMeleeAt);

            Object.keys(this.bossState.lastAbilityAt || {}).forEach((key) => {
                this.bossState.lastAbilityAt[key] = shiftTimestamp(this.bossState.lastAbilityAt[key]);
            });

            if (this.bossState.laserBeam) {
                this.bossState.laserBeam.until = shiftTimestamp(this.bossState.laserBeam.until);
                this.bossState.laserBeam.hitStartsAt = shiftTimestamp(this.bossState.laserBeam.hitStartsAt);
                this.bossState.laserBeam.hitWindowUntil = shiftTimestamp(this.bossState.laserBeam.hitWindowUntil);
            }

            if (this.bossState.megalodon?._bossAnim?.attackUntil) {
                this.bossState.megalodon._bossAnim.attackUntil = shiftTimestamp(this.bossState.megalodon._bossAnim.attackUntil);
            }

            this.bossState.lowHealthSummonStartedAt = shiftTimestamp(this.bossState.lowHealthSummonStartedAt);
            this.bossState.nextOrbSpawnAt = shiftTimestamp(this.bossState.nextOrbSpawnAt);

            Object.keys(this.bossState.buffs || {}).forEach((key) => {
                if (key.endsWith('Until')) {
                    this.bossState.buffs[key] = shiftTimestamp(this.bossState.buffs[key]);
                }
            });

            this.bossState.summons.forEach((minion) => {
                minion.lastHitAt = shiftTimestamp(minion.lastHitAt);
            });
        };

        const syncAquaticPauseState = () => {
            const isPaused = !!this.gameEnv?.gameControl?.isPaused;
            if (isPaused === this.pauseSyncState.wasPaused) return isPaused;

            this.pauseSyncState.wasPaused = isPaused;
            if (isPaused) {
                this.pauseSyncState.pausedAt = Date.now();
                this.pauseSyncState.resumeBossTheme = !!this.bossState.themeAudio && !this.bossState.themeAudio.paused;
                this.pauseSyncState.resumeUnderwaterTheme = !!this.pauseSyncState.underwaterThemeAudio && !this.pauseSyncState.underwaterThemeAudio.paused;
                stopBossTheme(false);
                stopUnderwaterTheme(false);
                return true;
            }

            const elapsedMs = this.pauseSyncState.pausedAt ? Math.max(0, Date.now() - this.pauseSyncState.pausedAt) : 0;
            this.pauseSyncState.pausedAt = 0;
            shiftBossPauseTimers(elapsedMs);

            if (this.pauseSyncState.resumeBossTheme && this.bossState.active) {
                resumeBossTheme();
            } else if (this.pauseSyncState.resumeUnderwaterTheme && shouldPlayUnderwaterTheme()) {
                playUnderwaterTheme(false);
            }

            this.pauseSyncState.resumeBossTheme = false;
            this.pauseSyncState.resumeUnderwaterTheme = false;
            return false;
        };

        this.playUnderwaterTheme = playUnderwaterTheme;
        this.stopUnderwaterTheme = stopUnderwaterTheme;
        this.syncAquaticPauseState = syncAquaticPauseState;
        this.setStorySceneUiVisibility = setStorySceneUiVisibility;

        const orbDefinitions = {
            critical: {
                key: 'critical',
                label: 'Critical Orb',
                color: '#ff9738',
                border: '#ffbe6d',
                shadow: 'rgba(255, 151, 56, 0.6)',
                message: 'You have obtained the Critical Orb, your next attack deals 500% more damage!',
                auraType: 'critical'
            },
            blood: {
                key: 'blood',
                label: 'Blood Thirst Orb',
                color: '#8b0b16',
                border: '#d12e3a',
                shadow: 'rgba(139, 11, 22, 0.7)',
                message: 'You have obtained the Blood Thirst Orb, 50% life steal!',
                auraType: 'blood'
            },
            mirror: {
                key: 'mirror',
                color: '#4ba8ff',
                label: 'Mirror Orb',
                border: '#a0dbff',
                shadow: 'rgba(75, 168, 255, 0.7)',
                message: 'You have obtained the Mirror Orb, the next laser will be reflected!',
                auraType: 'mirror'
            },
            shield: {
                key: 'shield',
                label: 'Shield Orb',
                color: '#ffd34d',
                border: '#fff1a1',
                shadow: 'rgba(255, 211, 77, 0.62)',
                message: 'You have obtained the Shield Orb, shark bites are blocked and explosives are softened!',
                auraType: 'shield'
            },
            sonic: {
                key: 'sonic',
                label: 'Sonic Orb',
                color: '#4fefff',
                border: '#a7fbff',
                shadow: 'rgba(79, 239, 255, 0.66)',
                message: 'You have obtained the Sonic Orb, 20% speed and 10% evasion!',
                auraType: 'sonic'
            }
        };

        const createOrbSprite = (primary, secondary, core) => {
            const size = 16;
            const scale = 4;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            const pixel = (x, y, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            };

            const glow = [
                [7, 1], [6, 2], [7, 2], [8, 2], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
                [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
                [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5],
                [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6],
                [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7],
                [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 8],
                [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9],
                [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10],
                [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [6, 12], [7, 12], [8, 12], [7, 13]
            ];
            glow.forEach(([x, y]) => pixel(x, y, secondary));

            const body = [
                [7, 3], [6, 4], [7, 4], [8, 4], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
                [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7],
                [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9],
                [6, 10], [7, 10], [8, 10], [7, 11]
            ];
            body.forEach(([x, y]) => pixel(x, y, primary));
            [[7, 5], [6, 6], [8, 6], [7, 7], [7, 8]].forEach(([x, y]) => pixel(x, y, core));

            const scaled = document.createElement('canvas');
            scaled.width = size * scale;
            scaled.height = size * scale;
            const sctx = scaled.getContext('2d');
            sctx.imageSmoothingEnabled = false;
            sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
            return scaled.toDataURL();
        };

        orbDefinitions.critical.sprite = createOrbSprite('#ff9738', '#783500', '#ffe0a6');
        orbDefinitions.blood.sprite = createOrbSprite('#bf1f28', '#4b0208', '#ff9a9a');
        orbDefinitions.mirror.sprite = createOrbSprite('#4ba8ff', '#0f3270', '#d4f4ff');
        orbDefinitions.shield.sprite = createOrbSprite('#ffd34d', '#6d5600', '#fff8c7');
        orbDefinitions.sonic.sprite = createOrbSprite('#4fefff', '#0d4a63', '#e0fdff');

        const getOrbWeightedSelection = () => {
            const roll = Math.random();
            if (roll < 0.15) return orbDefinitions.critical;
            if (roll < 0.45) return orbDefinitions.blood;
            if (roll < 0.65) return orbDefinitions.mirror;
            if (roll < 0.8) return orbDefinitions.shield;
            return orbDefinitions.sonic;
        };

        const isBuffActive = (key) => {
            const value = this.bossState.buffs?.[key];
            return typeof value === 'number' ? value > Date.now() : !!value;
        };

        this.isBossBuffActive = isBuffActive;

        const clearOrbAnnouncement = () => {
            const existing = document.getElementById('aquatic-orb-announcement');
            if (existing) existing.remove();
            if (this.bossState.orbAnnouncementTimeout) {
                clearTimeout(this.bossState.orbAnnouncementTimeout);
                this.bossState.orbAnnouncementTimeout = null;
            }
        };

        const showOrbAnnouncement = (definition, message = definition.message) => {
            clearOrbAnnouncement();

            const banner = document.createElement('div');
            banner.id = 'aquatic-orb-announcement';
            Object.assign(banner.style, {
                position: 'fixed',
                left: '50%',
                top: '24%',
                transform: 'translate(-50%, -50%)',
                zIndex: '10090',
                minWidth: 'min(620px, 90vw)',
                maxWidth: '90vw',
                padding: '16px 20px',
                borderRadius: '14px',
                border: `2px solid ${definition.border}`,
                background: 'rgba(8, 16, 28, 0.9)',
                color: definition.color,
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '12px',
                lineHeight: '1.7',
                textAlign: 'center',
                boxShadow: `0 0 26px ${definition.shadow}`,
                textShadow: `0 0 12px ${definition.shadow}`
            });
            banner.textContent = message;
            document.body.appendChild(banner);
            this.bossState.orbAnnouncementTimeout = setTimeout(() => {
                banner.remove();
                this.bossState.orbAnnouncementTimeout = null;
            }, 2600);
        };

        const healPlayer = (amount, color = '#77ffbf') => {
            if (!amount) return;
            this.bossState.playerHp = Math.min(this.bossState.playerMaxHp, this.bossState.playerHp + amount);
            updateBossHud();

            const player = getPlayer();
            if (!player) return;
            const px = player.position.x + player.width * 0.5;
            const py = player.position.y + player.height * 0.5;
            spawnHitEffect(px, py, color);
        };

        const consumePlayerAttackDamage = (baseDamage, options = {}) => {
            let damage = baseDamage;
            let accentColor = '#86f8ff';
            let isCritical = false;

            if (this.bossState.buffs.criticalOrbReady) {
                this.bossState.buffs.criticalOrbReady = false;
                damage = Math.round(baseDamage * 6);
                accentColor = orbDefinitions.critical.color;
                isCritical = true;
                showOrbAnnouncement(orbDefinitions.critical, 'Critical Orb unleashed! The next attack hits for 500% more damage!');
            } else if (options.allowCrit && Math.random() < this.bossState.critChance) {
                damage = Math.round(baseDamage * 2);
                accentColor = orbDefinitions.critical.color;
                isCritical = true;
            }

            return { damage, accentColor, isCritical };
        };

        const applyLifestealFromDamage = (damageDealt) => {
            if (!isBuffActive('bloodThirstUntil')) return;
            healPlayer(Math.max(1, Math.round(damageDealt * 0.5)), '#c62630');
        };

        const clearCombatOrbs = () => {
            (this.bossState.orbs || []).forEach((entry) => {
                if (entry?.obj?.destroy) entry.obj.destroy();
            });
            this.bossState.orbs = [];
        };

        const clearOrbAuras = () => {
            Object.values(this.bossState.orbAuras || {}).forEach((element) => element?.remove?.());
            this.bossState.orbAuras = {};
            clearOrbAnnouncement();
        };

        const getActiveAuraKeys = () => {
            const keys = [];
            if (this.bossState.buffs.criticalOrbReady) keys.push('critical');
            if (isBuffActive('bloodThirstUntil')) keys.push('blood');
            if (this.bossState.buffs.mirrorReady) keys.push('mirror');
            if (isBuffActive('shieldUntil')) keys.push('shield');
            if (isBuffActive('sonicUntil')) keys.push('sonic');
            return keys;
        };

        const ensureAuraElement = (type, color, border) => {
            if (this.bossState.orbAuras[type]) return this.bossState.orbAuras[type];

            const aura = document.createElement('div');
            aura.id = `aquatic-orb-aura-${type}`;
            Object.assign(aura.style, {
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: '10067',
                imageRendering: 'pixelated',
                border: `2px solid ${border}`,
                background: color,
                opacity: '0.7',
                transformOrigin: 'center center',
                mixBlendMode: 'screen'
            });
            appendBossOverlay(aura);
            this.bossState.orbAuras[type] = aura;
            return aura;
        };

        const syncOrbAuras = () => {
            const player = getPlayer();
            if (!player) {
                clearOrbAuras();
                return;
            }

            const activeKeys = new Set(getActiveAuraKeys());
            Object.entries(this.bossState.orbAuras || {}).forEach(([key, element]) => {
                if (!activeKeys.has(key)) {
                    element.remove();
                    delete this.bossState.orbAuras[key];
                }
            });

            const centerX = player.position.x + player.width * 0.5;
            const centerY = getBossOverlayTopOffset() + player.position.y + player.height * 0.5;
            const baseSize = Math.max(player.width, player.height) * 1.28;
            const time = performance.now() * 0.0022;

            const configs = {
                critical: {
                    color: 'repeating-linear-gradient(90deg, rgba(255,151,56,0.18) 0 6px, rgba(255,198,100,0.48) 6px 12px)',
                    border: '#ffbe6d',
                    shadow: '0 0 18px rgba(255,151,56,0.75), inset 0 0 18px rgba(255,198,100,0.32)',
                    size: 1.18,
                    radius: '12px',
                    rotation: 14
                },
                blood: {
                    color: 'repeating-linear-gradient(90deg, rgba(84,0,8,0.12) 0 5px, rgba(139,11,22,0.5) 5px 10px)',
                    border: '#d12e3a',
                    shadow: '0 0 22px rgba(139,11,22,0.88), inset 0 0 24px rgba(209,46,58,0.28)',
                    size: 1.24,
                    radius: '10px',
                    rotation: -18
                },
                mirror: {
                    color: 'repeating-linear-gradient(135deg, rgba(28,87,182,0.1) 0 7px, rgba(75,168,255,0.42) 7px 14px)',
                    border: '#9edcff',
                    shadow: '0 0 20px rgba(75,168,255,0.76), inset 0 0 18px rgba(212,244,255,0.26)',
                    size: 1.2,
                    radius: '14px',
                    rotation: 22
                },
                shield: {
                    color: 'repeating-linear-gradient(0deg, rgba(255,211,77,0.08) 0 4px, rgba(255,241,161,0.4) 4px 8px)',
                    border: '#fff1a1',
                    shadow: '0 0 18px rgba(255,211,77,0.75), inset 0 0 16px rgba(255,241,161,0.26)',
                    size: 1.32,
                    radius: '18px',
                    rotation: 0
                },
                sonic: {
                    color: 'repeating-linear-gradient(90deg, rgba(0,83,95,0.08) 0 4px, rgba(79,239,255,0.42) 4px 10px)',
                    border: '#a7fbff',
                    shadow: '0 0 22px rgba(79,239,255,0.82), inset 0 0 18px rgba(167,251,255,0.26)',
                    size: 1.16,
                    radius: '16px',
                    rotation: -28
                }
            };

            activeKeys.forEach((key) => {
                const config = configs[key];
                const element = ensureAuraElement(key, config.color, config.border);
                const pulse = 1 + Math.sin(time * 3.2 + key.length) * 0.06;
                const rotate = config.rotation * Math.sin(time * 1.5 + key.length);
                const size = baseSize * config.size * pulse;
                Object.assign(element.style, {
                    left: `${centerX}px`,
                    top: `${centerY}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: config.radius,
                    boxShadow: config.shadow,
                    transform: `translate(-50%, -50%) rotate(${rotate}deg)`
                });
            });
        };

        const activateOrb = (definition) => {
            const now = Date.now();
            if (definition.key === 'critical') {
                this.bossState.buffs.criticalOrbReady = true;
            } else if (definition.key === 'blood') {
                this.bossState.buffs.bloodThirstUntil = now + 30000;
            } else if (definition.key === 'mirror') {
                this.bossState.buffs.mirrorReady = true;
            } else if (definition.key === 'shield') {
                this.bossState.buffs.shieldUntil = now + 10000;
            } else if (definition.key === 'sonic') {
                this.bossState.buffs.sonicUntil = now + 15000;
            }

            showOrbAnnouncement(definition);
            syncOrbAuras();
        };

        const getSafeSpawnPoint = (minDistanceFromPlayer = 220, minDistanceFromBoss = 190, minDistanceFromOrbs = 120) => {
            const player = getPlayer();
            const boss = this.bossState.megalodon;
            const corners = [
                { xMin: 34, xMax: 180, yMin: 34, yMax: 180 },
                { xMin: Math.max(34, this.gameEnv.innerWidth - 180), xMax: Math.max(50, this.gameEnv.innerWidth - 34), yMin: 34, yMax: 180 },
                { xMin: 34, xMax: 180, yMin: Math.max(40, this.gameEnv.innerHeight - 180), yMax: Math.max(70, this.gameEnv.innerHeight - 34) },
                { xMin: Math.max(34, this.gameEnv.innerWidth - 180), xMax: Math.max(50, this.gameEnv.innerWidth - 34), yMin: Math.max(40, this.gameEnv.innerHeight - 180), yMax: Math.max(70, this.gameEnv.innerHeight - 34) }
            ];

            const playerCenter = player ? {
                x: player.position.x + player.width * 0.5,
                y: player.position.y + player.height * 0.5
            } : null;
            const bossCenter = boss ? {
                x: boss.position.x + boss.width * 0.5,
                y: boss.position.y + boss.height * 0.5
            } : null;

            for (let attempt = 0; attempt < 30; attempt += 1) {
                const zone = corners[Math.floor(Math.random() * corners.length)];
                const x = zone.xMin + Math.random() * Math.max(1, zone.xMax - zone.xMin);
                const y = zone.yMin + Math.random() * Math.max(1, zone.yMax - zone.yMin);

                const farEnoughFromPlayer = !playerCenter || Math.hypot(playerCenter.x - x, playerCenter.y - y) >= minDistanceFromPlayer;
                const farEnoughFromBoss = !bossCenter || Math.hypot(bossCenter.x - x, bossCenter.y - y) >= minDistanceFromBoss;
                const farEnoughFromOrbs = (this.bossState.orbs || []).every((entry) => {
                    const orb = entry?.obj;
                    if (!orb?.position) return true;
                    return Math.hypot((orb.position.x + orb.width * 0.5) - x, (orb.position.y + orb.height * 0.5) - y) >= minDistanceFromOrbs;
                });

                if (farEnoughFromPlayer && farEnoughFromBoss && farEnoughFromOrbs) {
                    return { x, y };
                }
            }

            return { x: this.gameEnv.innerWidth * 0.12, y: this.gameEnv.innerHeight * 0.18 };
        };

        const spawnCombatOrb = () => {
            if (!this.bossState.active || !this.bossState.combatReady) return;

            const definition = getOrbWeightedSelection();
            const spawn = getSafeSpawnPoint();
            const orbId = `aquatic_orb_${definition.key}_${Date.now()}`;
            const orbData = {
                id: orbId,
                src: definition.sprite,
                SCALE_FACTOR: 18,
                STEP_FACTOR: 0,
                ANIMATION_RATE: 1,
                INIT_POSITION: spawn,
                pixels: { height: 64, width: 64 },
                orientation: { rows: 1, columns: 1 },
                hitbox: { widthPercentage: 0.42, heightPercentage: 0.42 },
                greeting: definition.message,
                dialogues: [definition.message],
                reaction: function() {},
                interact: function() {
                    activateOrb(definition);
                    levelContext.bossState.orbs = (levelContext.bossState.orbs || []).filter((entry) => entry.obj !== this);
                    this.destroy();
                }
            };

            const orb = new Collectible(orbData, gameEnv);
            orb.removeInteractKeyListeners?.();
            const baseX = spawn.x;
            const baseY = spawn.y;
            const phase = Math.random() * Math.PI * 2;
            const originalUpdate = orb.update.bind(orb);
            orb.update = function() {
                originalUpdate();
                if (this.gameEnv?.gameControl?.isPaused) return;

                const t = performance.now() * 0.0026 + phase;
                this.position.y = baseY + Math.sin(t * 1.8) * 8;
                if (this.canvas) {
                    this.canvas.style.transformOrigin = 'center center';
                    this.canvas.style.transform = `rotate(${Math.sin(t) * 14}deg) scale(${1 + Math.sin(t * 2.6) * 0.06})`;
                    this.canvas.style.filter = `drop-shadow(0 0 14px ${definition.shadow})`;
                }

                const player = getPlayer();
                if (!player) return;
                this.isCollision?.(player);
                if (this.collisionData?.hit) {
                    this.interact?.();
                }
            };

            this.gameEnv.gameObjects.push(orb);
            this.bossState.orbs.push({ obj: orb, definition });
        };

        const applyBossDamage = (damage, hitX, hitY) => {
            if (!this.bossState.active) return;
            this.bossState.hp = Math.max(0, this.bossState.hp - damage);
            updateBossHud();
            spawnHitEffect(hitX, hitY, '#86f8ff');

            if (this.bossState.megalodon?.canvas) {
                this.bossState.megalodon.canvas.style.filter = 'brightness(1.55) saturate(1.2)';
                setTimeout(() => {
                    if (this.bossState.megalodon?.canvas) {
                        this.bossState.megalodon.canvas.style.filter = '';
                    }
                }, 120);
            }

            const showBossVictoryWindow = () => {
                const existing = document.getElementById('aquatic-boss-victory');
                if (existing) existing.remove();

                const overlay = document.createElement('div');
                overlay.id = 'aquatic-boss-victory';
                Object.assign(overlay.style, {
                    position: 'fixed',
                    inset: '0',
                    zIndex: '10080',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });

                const panel = document.createElement('div');
                Object.assign(panel.style, {
                    width: 'min(520px, 92vw)',
                    borderRadius: '16px',
                    padding: '22px',
                    background: 'linear-gradient(180deg, rgba(8, 46, 74, 0.95), rgba(4, 18, 36, 0.95))',
                    border: '2px solid rgba(110, 206, 255, 0.8)',
                    boxShadow: '0 0 30px rgba(56, 183, 255, 0.35)',
                    color: '#e6fbff',
                    fontFamily: "'Press Start 2P', cursive, monospace",
                    textAlign: 'center'
                });

                const title = document.createElement('div');
                title.textContent = 'MEGALODON DEFEATED';
                Object.assign(title.style, {
                    fontSize: '16px',
                    marginBottom: '14px',
                    color: '#7de2ff',
                    textShadow: '0 0 12px rgba(125, 226, 255, 0.7)'
                });

                const body = document.createElement('div');
                body.textContent = 'The ocean is safe again. Continue to the next level.';
                Object.assign(body.style, {
                    fontSize: '11px',
                    lineHeight: '1.7',
                    marginBottom: '18px'
                });

                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next Level';
                Object.assign(nextButton.style, {
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontFamily: "'Press Start 2P', cursive, monospace",
                    fontSize: '12px',
                    background: 'linear-gradient(90deg, #35b9ff, #5cf0ff)',
                    color: '#032030',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(53, 185, 255, 0.4)'
                });

                nextButton.onclick = () => {
                    const gameControl = this.gameEnv?.gameControl;
                    const game = this.gameEnv?.game;
                    if (gameControl?.currentLevel) {
                        gameControl.currentLevel.levelCompleted = true;
                        gameControl.currentLevel.continue = false;
                    }

                    if (typeof gameControl?.nextLevel === 'function') {
                        gameControl.nextLevel();
                    } else if (typeof game?.loadNextLevel === 'function') {
                        game.loadNextLevel();
                    } else if (typeof gameControl?.goToNextLevel === 'function') {
                        gameControl.goToNextLevel();
                    }

                    overlay.remove();
                };

                panel.appendChild(title);
                panel.appendChild(body);
                panel.appendChild(nextButton);
                overlay.appendChild(panel);
                document.body.appendChild(overlay);
            };

            if (this.bossState.hp <= 0) {
                this.bossState.combatReady = false;
                stopBossTheme();
                stopUnderwaterTheme();
                if (this.bossState.megalodon?.destroy) {
                    this.bossState.megalodon.destroy();
                }
                this.bossState.megalodon = null;
                this.bossState.active = false;
                showBossVictoryWindow();
            }
        };

        const applyPlayerDamage = (damage, hitX, hitY, sourceType = 'generic') => {
            if (!this.bossState.active || !this.bossState.combatReady) return;

            if (sourceType === 'laser' && this.bossState.buffs.mirrorReady) {
                this.bossState.buffs.mirrorReady = false;
                showOrbAnnouncement(orbDefinitions.mirror, 'Mirror Orb reflected the laser!');
                syncOrbAuras();
                if (this.bossState.laserBeam?.element) {
                    this.bossState.laserBeam.element.style.filter = 'drop-shadow(0 0 18px rgba(120, 208, 255, 0.95))';
                    this.bossState.laserBeam.element.remove();
                }
                this.bossState.laserBeam = null;
                if (this.bossState.megalodon) {
                    const bossX = this.bossState.megalodon.position.x + this.bossState.megalodon.width * 0.5;
                    const bossY = this.bossState.megalodon.position.y + this.bossState.megalodon.height * 0.5;
                    applyBossDamage(72, bossX, bossY);
                }
                return;
            }

            if (isBuffActive('sonicUntil') && Math.random() < 0.1) {
                if (typeof hitX === 'number' && typeof hitY === 'number') {
                    spawnHitEffect(hitX, hitY, '#5ef9ff');
                }
                return;
            }

            let finalDamage = damage;
            if (isBuffActive('shieldUntil')) {
                if (sourceType === 'sharkBite') {
                    if (typeof hitX === 'number' && typeof hitY === 'number') {
                        spawnHitEffect(hitX, hitY, '#ffe46f');
                    }
                    return;
                }
                if (sourceType === 'rocket' || sourceType === 'laser') {
                    finalDamage *= 0.5;
                }
            }

            this.bossState.playerHp = Math.max(0, this.bossState.playerHp - finalDamage);
            if (typeof hitX === 'number' && typeof hitY === 'number') {
                spawnHitEffect(hitX, hitY, '#ff9aa6');
            }
            updateBossHud();
            if (this.bossState.playerHp <= 0) {
                stopBossTheme();
                stopUnderwaterTheme();
                this.showSharkGameOver();
            }
        };

        const fireTridentShot = () => {
            if (!this.bossState.combatReady) return;
            const player = getPlayer();
            if (!player) return;

            const now = Date.now();
            if (now - this.bossState.lastShotAt < this.bossState.shotCooldownMs) return;
            this.bossState.lastShotAt = now;

            const px = player.position.x + player.width * 0.5;
            const py = player.position.y + player.height * 0.5;
            const dx = this.bossState.mouseX - px;
            const dy = this.bossState.mouseY - py;
            const mag = Math.max(1, Math.hypot(dx, dy));
            const vx = (dx / mag) * 9.2;
            const vy = (dy / mag) * 9.2;
            const shotCritical = Math.random() < this.bossState.critChance;

            const bolt = document.createElement('div');
            Object.assign(bolt.style, {
                position: 'absolute',
                width: '52px',
                height: '122px',
                borderRadius: '0',
                background: 'transparent',
                pointerEvents: 'none',
                zIndex: '10062',
                transformOrigin: 'center center'
            });
            bolt.style.backgroundImage = `url(${tridentSpriteSrc})`;
            bolt.style.backgroundSize = 'contain';
            bolt.style.backgroundRepeat = 'no-repeat';
            bolt.style.backgroundPosition = 'center';
            bolt.style.filter = shotCritical ? 'brightness(1.12) drop-shadow(0 0 10px rgba(255,151,56,0.92))' : 'none';
            appendBossOverlay(bolt);

            this.bossState.projectiles.push({
                x: px,
                y: py,
                vx,
                vy,
                baseDamage: 9,
                shotCritical,
                angleOffset: tridentAimOffset,
                life: 0,
                element: bolt
            });
        };

        const swingTrident = () => {
            if (!this.bossState.combatReady) return;
            const player = getPlayer();
            const boss = this.bossState.megalodon;
            if (!player || !boss) return;

            const now = Date.now();
            if (now - this.bossState.lastMeleeAt < this.bossState.meleeCooldownMs) return;
            this.bossState.lastMeleeAt = now;

            const px = player.position.x + player.width * 0.5;
            const py = player.position.y + player.height * 0.5;
            const angle = Math.atan2(this.bossState.mouseY - py, this.bossState.mouseX - px);

            const arc = document.createElement('div');
            Object.assign(arc.style, {
                position: 'absolute',
                left: `${px}px`,
                top: `${getBossOverlayTopOffset() + py}px`,
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#b0fbff',
                borderRightColor: '#b0fbff',
                transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                boxShadow: '0 0 20px rgba(176,251,255,0.85)',
                opacity: '0.95',
                zIndex: '10063',
                pointerEvents: 'none',
                transition: 'transform 150ms ease, opacity 150ms ease'
            });
            appendBossOverlay(arc);

            const tridentSwing = document.createElement('div');
            Object.assign(tridentSwing.style, {
                position: 'absolute',
                left: `${px}px`,
                top: `${getBossOverlayTopOffset() + py}px`,
                width: '58px',
                height: '152px',
                transform: `translate(-50%, -66%) rotate(${angle + tridentAimOffset}rad)`,
                transformOrigin: '50% 78%',
                pointerEvents: 'none',
                zIndex: '10064',
                backgroundImage: `url(${tridentSpriteSrc})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'none',
                opacity: '0.95',
                transition: 'transform 150ms ease, opacity 150ms ease'
            });
            appendBossOverlay(tridentSwing);
            requestAnimationFrame(() => {
                arc.style.transform = `translate(-50%, -50%) rotate(${angle + 1.4}rad)`;
                arc.style.opacity = '0';
                tridentSwing.style.transform = `translate(-50%, -66%) rotate(${angle + tridentAimOffset + 1.35}rad)`;
                tridentSwing.style.opacity = '0';
            });
            setTimeout(() => arc.remove(), 170);
            setTimeout(() => tridentSwing.remove(), 170);

            const bx = boss.position.x + boss.width * 0.5;
            const by = boss.position.y + boss.height * 0.5;
            const dist = Math.hypot(bx - px, by - py);
            if (dist < 150) {
                const attack = consumePlayerAttackDamage(18);
                applyBossDamage(attack.damage, bx, by);
                applyLifestealFromDamage(attack.damage);
            }

            // Summoned sharks are intentionally fragile and die in one melee hit.
            this.bossState.summons = this.bossState.summons.filter((minion) => {
                const mx = (minion.obj?.position?.x || 0) + (minion.obj?.width || 0) * 0.5;
                const my = (minion.obj?.position?.y || 0) + (minion.obj?.height || 0) * 0.5;
                const mDist = Math.hypot(mx - px, my - py);
                if (mDist < 140) {
                    spawnHitEffect(mx, my, '#ffd18a');
                    applyLifestealFromDamage(18);
                    if (minion.obj?.destroy) minion.obj.destroy();
                    return false;
                }
                return true;
            });

            const swingForwardX = Math.cos(angle);
            const swingForwardY = Math.sin(angle);
            this.bossState.enemyProjectiles = this.bossState.enemyProjectiles.filter((projectile) => {
                if (projectile?.type !== 'rocket') return true;

                const rocketDx = projectile.x - px;
                const rocketDy = projectile.y - py;
                const rocketDist = Math.hypot(rocketDx, rocketDy);
                if (rocketDist > 148) return true;

                const alignment = rocketDist > 0
                    ? ((rocketDx / rocketDist) * swingForwardX + (rocketDy / rocketDist) * swingForwardY)
                    : 1;
                if (alignment < 0.12) return true;

                const bossDx = bx - projectile.x;
                const bossDy = by - projectile.y;
                const bossMag = Math.max(1, Math.hypot(bossDx, bossDy));
                const reflectedSpeed = Math.max(7.1, (projectile.speed || 5) + 1.9);
                projectile.vx = (bossDx / bossMag) * reflectedSpeed;
                projectile.vy = (bossDy / bossMag) * reflectedSpeed;
                projectile.speed = reflectedSpeed;
                projectile.homing = 0;
                projectile.damage = 24;
                projectile.life = 0;
                projectile.angleOffset = projectile.angleOffset || 0;
                if (projectile.element) {
                    projectile.element.style.filter = 'brightness(1.08) hue-rotate(165deg)';
                }
                if (projectile.flameElement) {
                    projectile.flameElement.style.background = 'linear-gradient(90deg, rgba(212,255,255,0.98) 0%, rgba(118,242,255,0.94) 38%, rgba(58,180,255,0.9) 72%, rgba(58,180,255,0) 100%)';
                }
                spawnHitEffect(projectile.x, projectile.y, '#8ff9ff');
                this.bossState.projectiles.push(projectile);
                return false;
            });
        };

        const summonRushingSharks = (summonCount = 4) => {
            if (!this.bossState.active) return;

            for (let i = 0; i < summonCount; i += 1) {
                const spawnFromCorner = getSafeSpawnPoint(320, 260, 140);

                const minionData = {
                    id: `MegalodonSummon_${Date.now()}_${i}`,
                    greeting: false,
                    src: assetPath + '/Shark.png',
                    SCALE_FACTOR: 6.4,
                    STEP_FACTOR: 0,
                    ANIMATION_RATE: 8,
                    INIT_POSITION: spawnFromCorner,
                    orientation: { rows: 1, columns: 1 },
                    down: { row: 0, start: 0, columns: 1 },
                    right: { row: 0, start: 0, columns: 1, mirror: true },
                    left: { row: 0, start: 0, columns: 1 },
                    up: { row: 0, start: 0, columns: 1 },
                    upRight: { row: 0, start: 0, columns: 1, mirror: true },
                    downRight: { row: 0, start: 0, columns: 1, mirror: true },
                    upLeft: { row: 0, start: 0, columns: 1 },
                    downLeft: { row: 0, start: 0, columns: 1 },
                    hitbox: { widthPercentage: 0.22, heightPercentage: 0.24 },
                    reaction: function() {}
                };

                const sharkMinion = new Npc(minionData, this.gameEnv);
                this.gameEnv.gameObjects.push(sharkMinion);
                this.bossState.summons.push({
                    obj: sharkMinion,
                    kind: 'shark',
                    hp: 9,
                    speed: 2.4 + Math.random() * 0.9,
                    wobblePhase: Math.random() * Math.PI * 2,
                    damage: 18,
                    contactRange: 55,
                    contactCooldownMs: 760,
                    lastHitAt: 0
                });
            }
        };

        const summonWeakenedMegalodon = () => {
            if (!this.bossState.active || this.bossState.weakenedMegalodonSpawned) return;

            this.bossState.weakenedMegalodonSpawned = true;

            const minionData = {
                id: `WeakenedMegalodon_${Date.now()}`,
                greeting: false,
                src: this.bossState.megalodonMoveSheet,
                SCALE_FACTOR: 4.4,
                STEP_FACTOR: 0,
                ANIMATION_RATE: 8,
                INIT_POSITION: {
                    x: this.gameEnv.innerWidth - 260,
                    y: Math.max(90, this.gameEnv.innerHeight * 0.18)
                },
                pixels: this.bossState.megalodonMovePixels,
                orientation: { rows: 4, columns: 3 },
                down: { row: 0, start: 0, columns: 3 },
                right: { row: 1, start: 0, columns: 3, mirror: true },
                left: { row: 2, start: 0, columns: 3 },
                up: { row: 2, start: 0, columns: 3 },
                upRight: { row: 2, start: 0, columns: 3, mirror: true },
                downRight: { row: 0, start: 0, columns: 3, mirror: true },
                upLeft: { row: 2, start: 0, columns: 3 },
                downLeft: { row: 0, start: 0, columns: 3 },
                hitbox: { widthPercentage: 0.38, heightPercentage: 0.32 },
                reaction: function() {}
            };

            const weakenedMegalodon = new Npc(minionData, this.gameEnv);
            this.gameEnv.gameObjects.push(weakenedMegalodon);
            this.bossState.summons.push({
                obj: weakenedMegalodon,
                kind: 'miniMegalodon',
                hp: 150,
                speed: 1.55,
                wobblePhase: Math.random() * Math.PI * 2,
                damage: 14,
                contactRange: 78,
                contactCooldownMs: 900,
                lastHitAt: 0
            });
        };

        const handleBossHealthPhases = () => {
            if (!this.bossState.active) return;

            if (!this.bossState.nextOrbSpawnAt) {
                this.bossState.nextOrbSpawnAt = Date.now() + 10000;
            }

            const thresholds = [0.75, 0.5, 0.25];
            thresholds.forEach((threshold) => {
                if (
                    this.bossState.hp <= this.bossState.maxHp * threshold &&
                    !this.bossState.summonThresholdsTriggered.includes(threshold)
                ) {
                    this.bossState.summonThresholdsTriggered.push(threshold);
                    summonRushingSharks(threshold > 0.5 ? 2 : 4);
                }
            });

            if (this.bossState.hp <= this.bossState.maxHp * 0.25) {
                summonWeakenedMegalodon();
            }

            if (this.bossState.hp <= this.bossState.maxHp * 0.1) {
                const now = Date.now();
                if (!this.bossState.lowHealthSummonStartedAt) {
                    this.bossState.lowHealthSummonStartedAt = now;
                } else if (now - this.bossState.lowHealthSummonStartedAt >= 1000) {
                    summonRushingSharks(1);
                    this.bossState.lowHealthSummonStartedAt = now;
                }
            }

            if (Date.now() >= this.bossState.nextOrbSpawnAt) {
                spawnCombatOrb();
                this.bossState.nextOrbSpawnAt = Date.now() + 10000;
            }
        };

        const updateBossCombat = () => {
            if (!this.bossState.active || !this.bossState.combatReady) return;
            const boss = this.bossState.megalodon;
            const player = getPlayer();
            if (!boss || !player) return;

            const abilityDurations = {
                laser: 1480,
                rockets: 980,
                bodySwing: 900
            };

            const top = getBossOverlayTopOffset();
            const bx = boss.position.x + boss.width * 0.5;
            const by = boss.position.y + boss.height * 0.5;

            const dxPlayer = (player.position.x + player.width * 0.5) - bx;
            const dyPlayer = (player.position.y + player.height * 0.5) - by;
            const distanceToPlayer = Math.hypot(dxPlayer, dyPlayer);

            if (!boss._bossAnim) {
                boss._bossAnim = { attacking: false, attackUntil: 0 };
            }

            const state = this.bossState;

            handleBossHealthPhases();

            const setBossSpriteSheet = (src, pixels) => {
                if (!boss?.spriteSheet) return;

                const sameSource = boss.spriteData?.src === src;
                const samePixels =
                    boss.spriteData?.pixels?.width === pixels.width &&
                    boss.spriteData?.pixels?.height === pixels.height;

                if (!samePixels) {
                    boss.spriteData.pixels = { ...pixels };
                    boss.resize();
                }

                if (!sameSource) {
                    boss.spriteData.src = src;
                    boss.frameIndex = 0;
                    boss.frameCounter = 0;
                    boss.spriteSheet.src = src;
                }
            };

            const startAbility = (name, durationMs) => {
                state.activeAbility = name;
                state.abilityEndsAt = Date.now() + durationMs;
                state.abilityCommitted = false;
                state.lastAbilityAt[name] = Date.now();
                state.nextAbilityAt = Date.now() + state.abilityGlobalCooldownMs;
                setBossSpriteSheet(state.megalodonAttackSheet, state.megalodonAttackPixels);

                if (name === 'laser') {
                    boss.direction = 'laserAttack';
                } else if (name === 'rockets') {
                    boss.direction = 'rocketAttack';
                } else {
                    state.swingHitsLeft = 2;
                    boss.direction = 'swingAttackA';
                }
                boss.frameIndex = 0;
                boss.frameCounter = 0;
            };

            const distancePointToSegment = (px, py, x1, y1, x2, y2) => {
                const vx = x2 - x1;
                const vy = y2 - y1;
                const wx = px - x1;
                const wy = py - y1;
                const vv = vx * vx + vy * vy;
                const t = vv > 0 ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / vv)) : 0;
                const cx = x1 + t * vx;
                const cy = y1 + t * vy;
                return Math.hypot(px - cx, py - cy);
            };

            const commitLaser = () => {
                const px = player.position.x + player.width * 0.5;
                const py = player.position.y + player.height * 0.5;
                const shouldMiss = Math.random() < 0.5;
                let targetX = px;
                let targetY = py;

                if (shouldMiss) {
                    const toPlayerMag = Math.max(1, Math.hypot(px - bx, py - by));
                    const missDirection = Math.random() < 0.5 ? -1 : 1;
                    const missOffset = 56 + Math.random() * 40;
                    const perpendicularX = -((py - by) / toPlayerMag) * missDirection;
                    const perpendicularY = ((px - bx) / toPlayerMag) * missDirection;
                    targetX += perpendicularX * missOffset;
                    targetY += perpendicularY * missOffset;
                }

                const ang = Math.atan2(targetY - by, targetX - bx);
                const length = Math.min(this.gameEnv.innerWidth, 580);

                if (state.laserBeam?.element) state.laserBeam.element.remove();
                const beam = document.createElement('div');
                Object.assign(beam.style, {
                    position: 'absolute',
                    width: `${length}px`,
                    height: '12px',
                    borderRadius: '9px',
                    background: 'linear-gradient(90deg, rgba(124,221,255,0.2), #33c8ff 35%, #7cf6ff 70%, rgba(164,245,255,0.32))',
                    boxShadow: '0 0 20px rgba(51,200,255,0.95), 0 0 34px rgba(124,246,255,0.82)',
                    pointerEvents: 'none',
                    zIndex: '10062',
                    transformOrigin: 'left center',
                    opacity: '0.38'
                });
                appendBossOverlay(beam);

                const endX = bx + Math.cos(ang) * length;
                const endY = by + Math.sin(ang) * length;
                state.laserBeam = {
                    x1: bx,
                    y1: by,
                    x2: endX,
                    y2: endY,
                    angle: ang,
                    until: Date.now() + 560,
                    hitStartsAt: Date.now() + 180,
                    hitWindowUntil: Date.now() + 280,
                    element: beam
                };
            };

            const commitRockets = () => {
                const playerX = player.position.x + player.width * 0.5;
                const playerY = player.position.y + player.height * 0.5;
                const targetAngle = Math.atan2(playerY - by, playerX - bx);
                const rocketArtAngleOffset = 0.58;
                const spawnRocketBurst = (x, y) => {
                    const burst = document.createElement('div');
                    Object.assign(burst.style, {
                        position: 'absolute',
                        left: `${x}px`,
                        top: `${top + y}px`,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,243,168,0.98) 0%, rgba(255,156,74,0.95) 45%, rgba(255,110,43,0.28) 78%, rgba(255,110,43,0) 100%)',
                        boxShadow: '0 0 14px rgba(255,170,84,0.85)',
                        transform: 'translate(-50%, -50%) scale(0.45)',
                        opacity: '0.96',
                        pointerEvents: 'none',
                        zIndex: '10063',
                        transition: 'transform 180ms ease-out, opacity 180ms ease-out'
                    });
                    appendBossOverlay(burst);
                    requestAnimationFrame(() => {
                        burst.style.transform = 'translate(-50%, -50%) scale(2.2)';
                        burst.style.opacity = '0';
                    });
                    setTimeout(() => burst.remove(), 200);
                };

                const rocketLaunches = [
                    { angle: targetAngle - 0.54, spawnOffsetY: -22, homing: 0, speed: 5.1 },
                    { angle: targetAngle - 0.18, spawnOffsetY: -8, homing: 0, speed: 5.5 },
                    { angle: targetAngle + 0.16, spawnOffsetY: 10, homing: 0.09, speed: 5.2 },
                    { angle: targetAngle + 0.48, spawnOffsetY: 24, homing: 0, speed: 4.9 }
                ];

                for (const launch of rocketLaunches) {
                    const rocket = document.createElement('div');
                    Object.assign(rocket.style, {
                        position: 'absolute',
                        width: '72px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'transparent',
                        pointerEvents: 'none',
                        zIndex: '10062',
                        transformOrigin: 'left center'
                    });
                    rocket.style.backgroundImage = `url(${state.rocketSprite})`;
                    rocket.style.backgroundSize = 'contain';
                    rocket.style.backgroundRepeat = 'no-repeat';
                    rocket.style.backgroundPosition = 'center';
                    rocket.style.filter = 'none';

                    const flame = document.createElement('div');
                    Object.assign(flame.style, {
                        position: 'absolute',
                        left: '-16px',
                        top: '50%',
                        width: '24px',
                        height: '13px',
                        borderRadius: '10px 0 0 10px',
                        background: 'linear-gradient(90deg, rgba(255,244,184,0.98) 0%, rgba(255,194,92,0.95) 38%, rgba(255,125,44,0.92) 72%, rgba(255,84,28,0) 100%)',
                        transform: 'translate(-10%, -50%) skewX(-12deg)',
                        transformOrigin: 'right center',
                        filter: 'drop-shadow(0 0 8px rgba(255,172,72,0.85))',
                        pointerEvents: 'none',
                        opacity: '0.95'
                    });
                    rocket.appendChild(flame);

                    appendBossOverlay(rocket);

                    const spawnX = bx - Math.cos(launch.angle) * 12;
                    const spawnY = by + launch.spawnOffsetY - Math.sin(launch.angle) * 12;
                    spawnRocketBurst(spawnX, spawnY);

                    state.enemyProjectiles.push({
                        type: 'rocket',
                        x: bx,
                        y: by + launch.spawnOffsetY,
                        vx: Math.cos(launch.angle) * launch.speed,
                        vy: Math.sin(launch.angle) * launch.speed,
                        speed: launch.speed,
                        homing: launch.homing,
                        angleOffset: rocketArtAngleOffset,
                        life: 0,
                        damageRange: 26,
                        element: rocket,
                        flameElement: flame,
                        flamePhase: Math.random() * Math.PI * 2
                    });
                }
            };

            const commitBodySwing = () => {
                const px = player.position.x + player.width * 0.5;
                const py = player.position.y + player.height * 0.5;
                const dist = Math.hypot(px - bx, py - by);

                const shock = document.createElement('div');
                Object.assign(shock.style, {
                    position: 'absolute',
                    left: `${bx}px`,
                    top: `${top + by}px`,
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255,176,99,0.9)',
                    transform: 'translate(-50%, -50%) scale(0.5)',
                    opacity: '0.9',
                    boxShadow: '0 0 22px rgba(255,176,99,0.85)',
                    zIndex: '10063',
                    pointerEvents: 'none',
                    transition: 'transform 220ms ease, opacity 220ms ease'
                });
                appendBossOverlay(shock);
                requestAnimationFrame(() => {
                    shock.style.transform = 'translate(-50%, -50%) scale(2.6)';
                    shock.style.opacity = '0';
                });
                setTimeout(() => shock.remove(), 230);

                if (dist < 130) {
                    applyPlayerDamage(48, px, py);
                }
            };

            const chaseDistance = state.activeAbility === 'bodySwing' ? 118 : (state.activeAbility === 'rockets' ? 205 : 162);
            const playerX = player.position.x + player.width * 0.5;
            const playerY = player.position.y + player.height * 0.5;
            const toPlayerX = playerX - bx;
            const toPlayerY = playerY - by;
            const toPlayerMag = Math.max(1, Math.hypot(toPlayerX, toPlayerY));
            const normalizedX = toPlayerX / toPlayerMag;
            const normalizedY = toPlayerY / toPlayerMag;
            const orbitX = -normalizedY;
            const orbitY = normalizedX;
            const swimBob = Math.sin(performance.now() * 0.0032) * 24;
            const desiredCenterX = playerX - normalizedX * chaseDistance + orbitX * 22;
            const desiredCenterY = playerY - normalizedY * chaseDistance + orbitY * swimBob * 0.28;
            const clampedCenterX = Math.max(boss.width * 0.55, Math.min(this.gameEnv.innerWidth - boss.width * 0.55, desiredCenterX));
            const clampedCenterY = Math.max(boss.height * 0.55, Math.min(this.gameEnv.innerHeight - boss.height * 0.55, desiredCenterY));
            const isLaserCharging = state.activeAbility === 'laser' && !state.abilityCommitted;
            const moveLerp = state.activeAbility === 'bodySwing' ? 0.026 : 0.014;

            if (!isLaserCharging) {
                boss.position.x += (clampedCenterX - bx) * moveLerp;
                boss.position.y += (clampedCenterY - by) * moveLerp;
            }

            if (!state.activeAbility) {
                boss.direction = getDirectionToward(bx, by, playerX, playerY);
            }

            const now = Date.now();
            const laserReady = now - state.lastAbilityAt.laser >= state.cooldowns.laser;
            const rocketsReady = now - state.lastAbilityAt.rockets >= state.cooldowns.rockets;
            const swingReady = now - state.lastAbilityAt.bodySwing >= state.cooldowns.bodySwing;

            if (!state.activeAbility && now >= state.nextAbilityAt) {
                if (distanceToPlayer < 170 && swingReady) {
                    startAbility('bodySwing', abilityDurations.bodySwing);
                } else if (distanceToPlayer >= 170 && rocketsReady) {
                    startAbility('rockets', abilityDurations.rockets);
                } else if (laserReady) {
                    startAbility('laser', abilityDurations.laser);
                }
            }

            if (state.activeAbility) {
                const currentAbilityDuration = abilityDurations[state.activeAbility] || abilityDurations.laser;
                const progress = 1 - Math.max(0, (state.abilityEndsAt - now) / Math.max(1, currentAbilityDuration));
                const commitThreshold = state.activeAbility === 'laser' ? 0.78 : 0.56;

                if (state.activeAbility === 'laser') {
                    boss.direction = 'laserAttack';
                } else if (state.activeAbility === 'rockets') {
                    boss.direction = 'rocketAttack';
                }

                if (!state.abilityCommitted && progress > commitThreshold) {
                    if (state.activeAbility === 'laser') {
                        commitLaser();
                    } else if (state.activeAbility === 'rockets') {
                        commitRockets();
                    } else if (state.activeAbility === 'bodySwing') {
                        commitBodySwing();
                    }
                    state.abilityCommitted = true;
                }

                if (state.activeAbility === 'bodySwing' && progress > 0.46 && progress < 0.88) {
                    boss.direction = progress < 0.67 ? 'swingAttackA' : 'swingAttackB';
                }

                if (now >= state.abilityEndsAt) {
                    state.activeAbility = null;
                    state.abilityCommitted = false;
                    setBossSpriteSheet(state.megalodonMoveSheet, state.megalodonMovePixels);
                }
            }

            state.projectiles = state.projectiles.filter((p) => {
                p.life += 1;
                p.x += p.vx;
                p.y += p.vy;

                if (p.element) {
                    p.element.style.left = `${p.x}px`;
                    p.element.style.top = `${top + p.y}px`;
                    p.element.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(p.vy, p.vx) + (p.angleOffset || 0)}rad)`;
                }

                if (p.flameElement) {
                    const flicker = 0.84 + Math.sin(p.life * 0.55 + (p.flamePhase || 0)) * 0.16;
                    p.flameElement.style.width = `${24 * flicker}px`;
                    p.flameElement.style.opacity = `${0.68 + flicker * 0.26}`;
                    p.flameElement.style.filter = `drop-shadow(0 0 ${7 + flicker * 5}px rgba(255,172,72,0.9))`;
                }

                const hit = (
                    p.x > boss.position.x &&
                    p.x < boss.position.x + boss.width &&
                    p.y > boss.position.y &&
                    p.y < boss.position.y + boss.height
                );

                const hitSummon = state.summons.findIndex((minion) => {
                    const obj = minion.obj;
                    if (!obj || !obj.position) return false;
                    return (
                        p.x > obj.position.x &&
                        p.x < obj.position.x + obj.width &&
                        p.y > obj.position.y &&
                        p.y < obj.position.y + obj.height
                    );
                });

                if (hitSummon >= 0) {
                    const minion = state.summons[hitSummon];
                    const mx = (minion.obj?.position?.x || p.x) + (minion.obj?.width || 0) * 0.5;
                    const my = (minion.obj?.position?.y || p.y) + (minion.obj?.height || 0) * 0.5;
                    const attack = consumePlayerAttackDamage(p.baseDamage || p.damage || 9, { allowCrit: !!p.shotCritical });
                    spawnHitEffect(mx, my, '#ffd18a');
                    minion.hp = Math.max(0, (minion.hp ?? 1) - attack.damage);
                    if (minion.obj?.canvas) {
                        minion.obj.canvas.style.filter = attack.isCritical
                            ? 'brightness(1.45) saturate(1.18) hue-rotate(-12deg)'
                            : 'brightness(1.35) saturate(1.1)';
                        setTimeout(() => {
                            if (minion.obj?.canvas) {
                                minion.obj.canvas.style.filter = minion.kind === 'miniMegalodon'
                                    ? 'brightness(0.92) saturate(0.95) hue-rotate(-12deg)'
                                    : 'brightness(1.18) saturate(1.1)';
                            }
                        }, 120);
                    }
                    if (minion.hp <= 0) {
                        if (minion.obj?.destroy) minion.obj.destroy();
                        state.summons.splice(hitSummon, 1);
                    }
                    applyLifestealFromDamage(attack.damage);
                    if (p.element) p.element.remove();
                    return false;
                }

                if (hit) {
                    if (p.element) p.element.remove();
                    const attack = consumePlayerAttackDamage(p.baseDamage || p.damage || 9, { allowCrit: !!p.shotCritical });
                    applyBossDamage(attack.damage, p.x, p.y);
                    applyLifestealFromDamage(attack.damage);
                    return false;
                }

                if (
                    p.life > 120 ||
                    p.x < -20 || p.x > this.gameEnv.innerWidth + 20 ||
                    p.y < -20 || p.y > this.gameEnv.innerHeight + 20
                ) {
                    if (p.element) p.element.remove();
                    return false;
                }

                return true;
            });

            state.summons = state.summons.filter((minion) => {
                const obj = minion.obj;
                if (!obj || !obj.canvas || !obj.position) return false;
                if ((minion.hp ?? 1) <= 0) {
                    if (obj.destroy) obj.destroy();
                    return false;
                }

                const playerX = player.position.x + player.width * 0.5;
                const playerY = player.position.y + player.height * 0.5;
                const mx = obj.position.x + obj.width * 0.5;
                const my = obj.position.y + obj.height * 0.5;

                const dx = playerX - mx;
                const dy = playerY - my;
                const mag = Math.max(1, Math.hypot(dx, dy));
                const wobble = Math.sin(performance.now() * 0.006 + minion.wobblePhase) * 0.75;

                if (minion.kind === 'miniMegalodon') {
                    const orbitX = -(dy / mag);
                    const orbitY = dx / mag;
                    obj.position.x += (dx / mag) * minion.speed + orbitX * 0.55;
                    obj.position.y += (dy / mag) * minion.speed + orbitY * 0.35 + wobble * 0.35;
                    obj.canvas.style.filter = 'brightness(0.92) saturate(0.95) hue-rotate(-12deg)';
                } else {
                    obj.position.x += (dx / mag) * minion.speed;
                    obj.position.y += (dy / mag) * minion.speed + wobble;
                    obj.canvas.style.filter = 'brightness(1.18) saturate(1.1)';
                }

                obj.direction = getDirectionToward(mx, my, playerX, playerY);

                const playerDistance = Math.hypot(playerX - (obj.position.x + obj.width * 0.5), playerY - (obj.position.y + obj.height * 0.5));
                const nowMs = Date.now();
                if (
                    playerDistance < (minion.contactRange || 55) &&
                    nowMs - (minion.lastHitAt || 0) >= (minion.contactCooldownMs || 800)
                ) {
                    minion.lastHitAt = nowMs;
                    applyPlayerDamage(minion.damage || 20, playerX, playerY, minion.kind === 'shark' ? 'sharkBite' : 'miniMegalodon');
                }

                return true;
            });

            state.enemyProjectiles = state.enemyProjectiles.filter((p) => {
                p.life += 1;

                const playerX = player.position.x + player.width * 0.5;
                const playerY = player.position.y + player.height * 0.5;

                if (p.type === 'rocket' && p.homing > 0) {
                    const tx = playerX - p.x;
                    const ty = playerY - p.y;
                    const tMag = Math.max(1, Math.hypot(tx, ty));
                    const desiredVX = (tx / tMag) * p.speed;
                    const desiredVY = (ty / tMag) * p.speed;
                    p.vx += (desiredVX - p.vx) * p.homing;
                    p.vy += (desiredVY - p.vy) * p.homing;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.element) {
                    p.element.style.left = `${p.x}px`;
                    p.element.style.top = `${top + p.y}px`;
                    p.element.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(p.vy, p.vx) + (p.angleOffset || 0)}rad)`;
                }

                if (p.flameElement) {
                    const flicker = 0.86 + Math.sin(p.life * 0.72 + (p.flamePhase || 0)) * 0.18;
                    p.flameElement.style.width = `${24 * flicker}px`;
                    p.flameElement.style.opacity = `${0.7 + flicker * 0.22}`;
                    p.flameElement.style.filter = `drop-shadow(0 0 ${8 + flicker * 6}px rgba(255,172,72,0.92))`;
                }

                const dToPlayer = Math.hypot(playerX - p.x, playerY - p.y);
                if (dToPlayer < p.damageRange) {
                    if (p.element) p.element.remove();
                    applyPlayerDamage(p.type === 'rocket' ? 34 : 28, playerX, playerY, p.type === 'rocket' ? 'rocket' : 'projectile');
                    return false;
                }

                if (
                    p.life > 200 ||
                    p.x < -40 || p.x > this.gameEnv.innerWidth + 40 ||
                    p.y < -40 || p.y > this.gameEnv.innerHeight + 40
                ) {
                    if (p.element) p.element.remove();
                    return false;
                }

                return true;
            });

            if (state.laserBeam) {
                const beam = state.laserBeam;
                if (beam.element) {
                    beam.element.style.left = `${beam.x1}px`;
                    beam.element.style.top = `${top + beam.y1}px`;
                    beam.element.style.transform = `translate(0, -50%) rotate(${beam.angle}rad)`;
                    const now = Date.now();
                    if (now < beam.hitStartsAt) {
                        beam.element.style.opacity = '0.38';
                        beam.element.style.filter = 'drop-shadow(0 0 8px rgba(124,246,255,0.65))';
                    } else if (now <= beam.hitWindowUntil) {
                        beam.element.style.opacity = '0.96';
                        beam.element.style.filter = 'drop-shadow(0 0 18px rgba(51,200,255,0.92))';
                    } else {
                        beam.element.style.opacity = '0.72';
                    }
                }

                const playerX = player.position.x + player.width * 0.5;
                const playerY = player.position.y + player.height * 0.5;
                const now = Date.now();
                if (now >= beam.hitStartsAt && now <= beam.hitWindowUntil) {
                    const dLine = distancePointToSegment(playerX, playerY, beam.x1, beam.y1, beam.x2, beam.y2);
                    if (dLine < 20) {
                        applyPlayerDamage(42, playerX, playerY, 'laser');
                    }
                }

                if (Date.now() > beam.until) {
                    if (beam.element) beam.element.remove();
                    state.laserBeam = null;
                }
            }

            const px = player.position.x + player.width * 0.5;
            const py = player.position.y + player.height * 0.5;
            player.direction = getDirectionToward(px, py, bx, by);
            syncOrbAuras();

            if (!state.activeAbility) {
                setBossSpriteSheet(state.megalodonMoveSheet, state.megalodonMovePixels);
            }
        };

        const bindBossInput = () => {
            if (this.bossState.listenersBound) return;
            this.bossState.listenersBound = true;

            this.bossState._onMouseMove = (event) => {
                const rect = this.gameEnv?.container?.getBoundingClientRect?.();
                if (rect) {
                    this.bossState.mouseX = event.clientX - rect.left;
                    this.bossState.mouseY = event.clientY - rect.top;
                    return;
                }

                this.bossState.mouseX = event.clientX;
                this.bossState.mouseY = event.clientY - (this.gameEnv.top || 0);
            };

            this.bossState._onMouseDown = (event) => {
                if (!this.bossState.combatReady) return;
                if (event.button === 0) {
                    fireTridentShot();
                } else if (event.button === 2) {
                    event.preventDefault();
                    swingTrident();
                }
            };

            this.bossState._onContext = (event) => {
                if (this.bossState.combatReady) event.preventDefault();
            };

            window.addEventListener('mousemove', this.bossState._onMouseMove);
            window.addEventListener('mousedown', this.bossState._onMouseDown);
            window.addEventListener('contextmenu', this.bossState._onContext);
        };

        const unbindBossInput = () => {
            if (!this.bossState.listenersBound) return;
            window.removeEventListener('mousemove', this.bossState._onMouseMove);
            window.removeEventListener('mousedown', this.bossState._onMouseDown);
            window.removeEventListener('contextmenu', this.bossState._onContext);
            this.bossState._onMouseMove = null;
            this.bossState._onMouseDown = null;
            this.bossState._onContext = null;
            this.bossState.listenersBound = false;
        };

        this.startMegalodonEncounter = async () => {
            if (this.bossState.active || this.bossState.introPlayed) return;
            this.bossState.introPlayed = true;
            this.bossState.active = true;
            this.bossState.hp = this.bossState.maxHp;
            this.bossState.playerHp = this.bossState.playerMaxHp;
            this.bossState.summonThresholdsTriggered = [];
            this.bossState.weakenedMegalodonSpawned = false;
            this.bossState.lowHealthSummonStartedAt = 0;
            this.bossState.nextOrbSpawnAt = 0;
            this.bossState.buffs = createBossOrbBuffState();
            clearCombatOrbs();
            clearOrbAuras();
            this.playerLock = true;

            await shakeWorld(1050);

            const bossData = {
                id: 'MegalodonBoss',
                greeting: false,
                src: this.bossState.megalodonMoveSheet,
                SCALE_FACTOR: 2.8,
                STEP_FACTOR: 0,
                ANIMATION_RATE: 10,
                INIT_POSITION: { x: 120, y: this.gameEnv.innerHeight - 150 },
                pixels: this.bossState.megalodonMovePixels,
                orientation: { rows: 4, columns: 3 },
                down: { row: 0, start: 0, columns: 3 },
                right: { row: 1, start: 0, columns: 3, mirror: true },
                left: { row: 2, start: 0, columns: 3 },
                up: { row: 2, start: 0, columns: 3 },
                upRight: { row: 2, start: 0, columns: 3, mirror: true },
                downRight: { row: 0, start: 0, columns: 3, mirror: true },
                upLeft: { row: 2, start: 0, columns: 3 },
                downLeft: { row: 0, start: 0, columns: 3 },
                laserAttack: { row: 0, start: 0, columns: 3 },
                rocketAttack: { row: 1, start: 0, columns: 3 },
                swingAttackA: { row: 2, start: 0, columns: 3 },
                swingAttackB: { row: 3, start: 0, columns: 3 },
                hitbox: { widthPercentage: 0.46, heightPercentage: 0.37 },
                reaction: function() {}
            };

            const boss = new Npc(bossData, this.gameEnv);
            this.bossState.megalodon = boss;
            this.gameEnv.gameObjects.push(boss);
            stopUnderwaterTheme();
            playBossTheme();
            setStorySceneUiVisibility(false);

            // Hide all non-boss NPCs during the megalodon encounter.
            this.bossState.hiddenNpcs = [];
            (this.gameEnv?.gameObjects || []).forEach((obj) => {
                if (!obj || obj === boss) return;
                if (obj?.constructor?.name !== 'Npc') return;
                const id = obj?.spriteData?.id;
                if (id === 'MegalodonBoss') return;

                this.bossState.hiddenNpcs.push({
                    obj,
                    x: obj.position?.x,
                    y: obj.position?.y,
                    display: obj.canvas?.style?.display ?? ''
                });

                if (obj.canvas) obj.canvas.style.display = 'none';
                if (obj.position) {
                    obj.position.x = -10000;
                    obj.position.y = -10000;
                }
            });

            const player = getPlayer();
            if (player) {
                const bx = boss.position.x + boss.width * 0.5;
                const by = boss.position.y + boss.height * 0.5;
                const px = player.position.x + player.width * 0.5;
                const py = player.position.y + player.height * 0.5;
                player.direction = getDirectionToward(px, py, bx, by);
            }

            await showBottomStoryDialogue('Slime', 'Shoot, why is he here?', 3400);
            await showBottomStoryDialogue('Slime', 'I got you the strongest power of the ocean so you can beat that stupid megalodon!', 3800);
            await showBottomStoryDialogue('Slime', 'Listen carefully. Move your mouse to aim your trident.', 4000);
            await showBottomStoryDialogue('Slime', 'Left Click throws a trident shot. Keep your distance and keep firing.', 4200);
            await showBottomStoryDialogue('Slime', 'Right Click performs a close-range trident slash. Use it when the megalodon rushes you!', 4400);

            ensureBossHud();
            updateBossHud();
            bindBossInput();
            this.bossState.combatReady = true;
            this.playerLock = false;
        };

        this.retryBossEncounter = async () => {
            this.cleanupBossEncounter?.();

            this.sharkGameOverShown = false;
            this.playerLock = true;
            this.bossState.introPlayed = false;
            this.bossState.active = false;
            this.bossState.combatReady = false;
            this.bossState.hp = this.bossState.maxHp;
            this.bossState.playerHp = this.bossState.playerMaxHp;
            this.bossState.lastShotAt = 0;
            this.bossState.lastMeleeAt = 0;
            this.bossState.nextAbilityAt = 0;
            this.bossState.lastAbilityAt = {
                laser: 0,
                rockets: 0,
                bodySwing: 0
            };
            this.bossState.summonThresholdsTriggered = [];
            this.bossState.weakenedMegalodonSpawned = false;
            this.bossState.lowHealthSummonStartedAt = 0;
            this.bossState.nextOrbSpawnAt = 0;
            this.bossState.buffs = createBossOrbBuffState();
            clearCombatOrbs();
            clearOrbAuras();

            const overlay = document.getElementById('aquatic-shark-gameover');
            if (overlay) overlay.remove();

            const player = getPlayer();
            if (player) {
                const retryX = Math.max(28, Math.min(this.gameEnv.innerWidth * 0.28, this.gameEnv.innerWidth - player.width - 28));
                const retryY = Math.max(52, Math.min(this.gameEnv.innerHeight * 0.3, this.gameEnv.innerHeight - player.height - 52));
                player.position.x = retryX;
                player.position.y = retryY;
                player.velocity.x = 0;
                player.velocity.y = 0;
                if (player.pressedKeys) player.pressedKeys = {};
                player.direction = 'right';
            }

            await this.startMegalodonEncounter?.();
        };

        this.cleanupBossEncounter = () => {
            unbindBossInput();
            stopBossTheme();
            setStorySceneUiVisibility(true);
            if (this.bossState.megalodon?.destroy) this.bossState.megalodon.destroy();
            this.bossState.megalodon = null;

            if (Array.isArray(this.bossState.hiddenNpcs)) {
                this.bossState.hiddenNpcs.forEach((entry) => {
                    const obj = entry?.obj;
                    if (!obj) return;
                    if (obj.canvas) obj.canvas.style.display = entry.display ?? '';
                    if (obj.position) {
                        if (typeof entry.x === 'number') obj.position.x = entry.x;
                        if (typeof entry.y === 'number') obj.position.y = entry.y;
                    }
                });
            }
            this.bossState.hiddenNpcs = [];

            this.bossState.projectiles.forEach((p) => p?.element?.remove());
            this.bossState.projectiles = [];
            this.bossState.enemyProjectiles.forEach((p) => p?.element?.remove());
            this.bossState.enemyProjectiles = [];
            if (this.bossState.laserBeam?.element) this.bossState.laserBeam.element.remove();
            this.bossState.laserBeam = null;
            this.bossState.summons.forEach((minion) => {
                if (minion?.obj?.destroy) minion.obj.destroy();
            });
            this.bossState.summons = [];
            this.bossState.summonThresholdsTriggered = [];
            this.bossState.weakenedMegalodonSpawned = false;
            this.bossState.lowHealthSummonStartedAt = 0;
            this.bossState.nextOrbSpawnAt = 0;
            this.bossState.buffs = createBossOrbBuffState();
            this.bossState.activeAbility = null;
            this.bossState.abilityCommitted = false;
            clearCombatOrbs();
            clearOrbAuras();
            if (this.bossState.hud) {
                this.bossState.hud.remove();
                this.bossState.hud = null;
            }
            const playerHud = document.getElementById('aquatic-player-hp-hud');
            if (playerHud) playerHud.remove();
            const d = document.getElementById('aquatic-boss-dialogue');
            if (d) d.remove();
            const w = document.getElementById('aquatic-boss-win');
            if (w) w.remove();
            const v = document.getElementById('aquatic-boss-victory');
            if (v) v.remove();
            this.bossState.active = false;
            this.bossState.combatReady = false;
        };
        this.updateBossCombat = updateBossCombat;

        const createPixelStarfish = (primary, shadow) => {
            const size = 11;
            const scale = 3;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            const p = (x, y, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            };

            // Simple pixel starfish pattern
            const pattern = [
                [5,0],
                [4,1],[5,1],[6,1],
                [4,2],[5,2],[6,2],
                [3,3],[4,3],[5,3],[6,3],[7,3],
                [2,4],[3,4],[4,4],[6,4],[7,4],[8,4],
                [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
                [2,6],[3,6],[4,6],[6,6],[7,6],[8,6],
                [3,7],[4,7],[5,7],[6,7],[7,7],
                [4,8],[5,8],[6,8],
                [5,9],
                [5,10]
            ];

            pattern.forEach(([x, y]) => p(x, y, primary));
            // Add shadow pixels for texture
            [[5,4],[4,5],[6,5],[5,6],[5,7]].forEach(([x, y]) => p(x, y, shadow));

            const scaled = document.createElement('canvas');
            scaled.width = size * scale;
            scaled.height = size * scale;
            const sctx = scaled.getContext('2d');
            sctx.imageSmoothingEnabled = false;
            sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
            return scaled.toDataURL();
        };

        const starfishSprites = [
            createPixelStarfish('#ffb347', '#e07b39'),
            createPixelStarfish('#ff7aa2', '#d85b7e'),
            createPixelStarfish('#ffd56a', '#d6a64f'),
            createPixelStarfish('#7bdff2', '#4fb6cc')
        ];

        const spawnStarfish = (countOverride, forceRespawn = false) => {
            const q1 = questState.firstQuest;
            const isChallengeMode = this.gameMode === 'challenge';

            if (!isChallengeMode) {
                if (q1.started && !forceRespawn) return;
                q1.started = true;
                updateQuestHud();
            }

            if (isChallengeMode) {
                clearChallengeStarfish();
            }

            const positions = [];
            const count = countOverride || (isChallengeMode ? challengeState.waveTarget : q1.starfishTotal);
            const padding = 90;
            const minDist = 80;
            const minNpcDist = 140;
            const npcPositions = [
                mermaidNpc.INIT_POSITION,
                slimeNpc.INIT_POSITION,
                kirbyNpc.INIT_POSITION
            ];

            const maxX = Math.max(padding + 1, width - padding);
            const maxY = Math.max(padding + 1, height - padding);

            let attempts = 0;
            while (positions.length < count && attempts < 500) {
                attempts += 1;
                const x = Math.floor(Math.random() * (maxX - padding) + padding);
                const y = Math.floor(Math.random() * (maxY - padding) + padding);

                const tooClose = positions.some(p => Math.hypot(p.x - x, p.y - y) < minDist);
                const tooCloseToNpc = !isChallengeMode && npcPositions.some(npc => Math.hypot(npc.x - x, npc.y - y) < minNpcDist);

                if (!tooClose && !tooCloseToNpc) positions.push({ x, y });
            }

            positions.forEach((pos, i) => {
                const itemId = isChallengeMode ? `challenge_starfish_${challengeState.wave}_${i}` : `starfish_${i}`;
                const starfishData = {
                    id: itemId,
                    src: starfishSprites[i % starfishSprites.length],
                    SCALE_FACTOR: 20,
                    STEP_FACTOR: 0,
                    ANIMATION_RATE: 1,
                    INIT_POSITION: { x: pos.x, y: pos.y },
                    pixels: { height: 33, width: 33 },
                    orientation: { rows: 1, columns: 1 },
                    hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
                    greeting: 'Starfish collected!',
                    dialogues: ['Starfish collected!'],
                    // prevent automatic collision reaction popups
                    reaction: function() {},
                    showReactionDialogue: function() {
                        if (typeof this.showItemMessage === 'function') {
                            this.showItemMessage();
                        }
                    },
                    interact: function() {
                        if (isChallengeMode) {
                            challengeState.score += 1;
                            challengeState.collectedThisWave += 1;
                            updateChallengeHud();
                            if (challengeState.collectedThisWave >= challengeState.waveTarget) {
                                showChallengeWaveComplete();
                            }
                        } else {
                            const q1State = questState.firstQuest;
                            q1State.collected += 1;
                            updateQuestHud();
                        }
                        this.destroy();
                    }
                };

                const starfish = new Collectible(starfishData, gameEnv);
                // Ensure collision reaction won't throw even if GameObject.js is cached
                starfish.showReactionDialogue = function() {
                    if (typeof this.showItemMessage === 'function') {
                        this.showItemMessage();
                    }
                };

                // Give each starfish a subtle unique wiggle animation
                const baseX = starfishData.INIT_POSITION.x;
                const baseY = starfishData.INIT_POSITION.y;
                const phase = Math.random() * Math.PI * 2;
                const wiggleSpeed = 0.004 + Math.random() * 0.003;
                const bobAmplitude = 5 + Math.random() * 2;
                const rotateAmplitude = 10 + Math.random() * 4;
                const originalUpdate = starfish.update.bind(starfish);

                starfish.update = function() {
                    originalUpdate();

                    const t = performance.now() * wiggleSpeed + phase;
                    const bobOffset = Math.sin(t) * bobAmplitude;
                    const rotation = Math.sin(t * 1.25) * rotateAmplitude;

                    this.position.y = baseY + bobOffset;
                    if (this.canvas) {
                        this.canvas.style.transformOrigin = 'center center';
                        this.canvas.style.transform = `rotate(${rotation}deg)`;
                    }
                };

                if (isChallengeMode) this.challengeStarfishIds.push(itemId);
                gameEnv.gameObjects.push(starfish);
            });
        };

        const showQuestWindow = () => {
            const existing = document.getElementById('aquatic-quest-window');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'aquatic-quest-window';
            Object.assign(overlay.style, {
                position: 'fixed',
                inset: '0',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999'
            });

            const panel = document.createElement('div');
            Object.assign(panel.style, {
                width: 'min(520px, 90vw)',
                background: 'linear-gradient(180deg, rgba(9,50,80,0.95), rgba(4,20,40,0.95))',
                border: '2px solid rgba(130, 220, 255, 0.8)',
                borderRadius: '18px',
                padding: '24px',
                color: '#e6fbff',
                fontFamily: "'Press Start 2P', cursive, monospace",
                boxShadow: '0 0 30px rgba(80, 200, 255, 0.35)'
            });

            const title = document.createElement('div');
            title.textContent = 'Aquatic Quest';
            Object.assign(title.style, {
                fontSize: '18px',
                marginBottom: '12px',
                color: '#7de2ff',
                textShadow: '0 0 12px rgba(125, 226, 255, 0.7)'
            });

            const body = document.createElement('div');
            body.textContent = 'Collect all the lost starfishes scattered across the sea floor.';
            Object.assign(body.style, {
                fontSize: '12px',
                lineHeight: '1.6',
                marginBottom: '18px'
            });

            const detail = document.createElement('div');
            detail.textContent = `Starfishes to collect: ${questState.firstQuest.starfishTotal}`;
            Object.assign(detail.style, {
                fontSize: '11px',
                color: '#b9f0ff',
                marginBottom: '20px'
            });

            const confirm = document.createElement('button');
            confirm.textContent = 'Confirm';
            Object.assign(confirm.style, {
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontFamily: "'Press Start 2P', cursive, monospace",
                fontSize: '12px',
                background: 'linear-gradient(90deg, #35b9ff, #5cf0ff)',
                color: '#032030',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(53, 185, 255, 0.4)'
            });

            confirm.onclick = () => {
                overlay.remove();
                spawnStarfish();
                updateQuestHud();
            };

            panel.appendChild(title);
            panel.appendChild(body);
            panel.appendChild(detail);
            panel.appendChild(confirm);
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
        };

        const mermaidNpc = {
            id: 'Mermaid',
            greeting: "I've lost all my starfishes. Will you collect them? Be careful, a shark is patrolling these waters!",
            // Mermaid spritesheet
            src: assetPath + "/Mermaid Spritesheet.png",
            SCALE_FACTOR: 6,
            ANIMATION_RATE: 50,
            INIT_POSITION: { x: 520, y: 320 },
            pixels: { height: 948, width: 632 },
            orientation: { rows: 3, columns: 3 },
            down: { row: 0, start: 0, columns: 3 },
            right: { row: 0, start: 0, columns: 3 },
            left: { row: 0, start: 0, columns: 3 },
            up: { row: 0, start: 0, columns: 3 },
            upRight: { row: 0, start: 0, columns: 3 },
            downRight: { row: 0, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3 },
            downLeft: { row: 0, start: 0, columns: 3 },
            // Play row 2 on interaction, lock to a stable frame
            interactAnim: { row: 1, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.12, heightPercentage: 0.2 },
            dialogues: ["I've lost all my starfishes. Will you collect them? Be careful, a shark is patrolling these waters!"],
            // prevent automatic collision reaction; only interact with E
            reaction: function() {},
            interact: function() {
                if (!this.dialogueSystem) return;
                const q1 = questState.firstQuest;
                const q2 = questState.secondQuest;

                // Trigger second-row animation whenever interaction starts
                this.direction = 'interactAnim';
                this.frameIndex = 0;
                this.frameCounter = 0;
                if (this._interactAnimResetTimeout) {
                    clearTimeout(this._interactAnimResetTimeout);
                }
                this._interactAnimResetTimeout = setTimeout(() => {
                    this.direction = 'down';
                }, 1200);

                if (q1.accepted) {
                    if (q1.collected >= q1.starfishTotal && !q1.completed) {
                        q1.completed = true;
                        updateQuestHud();
                        this.dialogueSystem.showDialogue(
                            "Thank you for finding them all! The lower reef is recovering. Go tell Slime and ask about the next mission.",
                            'Mermaid',
                            null
                        );
                        return;
                    }

                    if (q1.completed && !q2.accepted) {
                        this.dialogueSystem.showDialogue(
                            'I can already feel the water clearing. Slime knows where the next danger is - talk to Slime for Aquatic Quest #2.',
                            'Mermaid',
                            null
                        );
                        return;
                    }

                    if (q2.accepted && !q2.completed) {
                        this.dialogueSystem.showDialogue(
                            'You are doing great. Clear the floating trash on the surface, then return to Slime.',
                            'Mermaid',
                            null
                        );
                        return;
                    }

                    this.dialogueSystem.showDialogue('Please collect the starfishes scattered around the reef, and keep away from the shark.', 'Mermaid', null);
                    return;
                }

                this.dialogueSystem.showDialogue(
                    "I've lost all my starfishes. Will you collect them? Be careful, a shark is patrolling these waters!",
                    'Mermaid',
                    null
                );
                clearDialogueActionButtons(this.dialogueSystem);

                this.dialogueSystem.addButtons([
                    {
                        text: 'Accept',
                        primary: true,
                        action: () => {
                            q1.accepted = true;
                            this.dialogueSystem.closeDialogue();
                            showQuestWindow();
                            updateQuestHud();
                        }
                    },
                    {
                        text: 'Decline',
                        action: () => {
                            this.dialogueSystem.closeDialogue();
                        }
                    }
                ]);
            }
        };

        const sharkNpc = {
            id: 'Shark',
            greeting: false,
            src: assetPath + "/Shark.png",
            SCALE_FACTOR: 5,
            STEP_FACTOR: 200,
            ANIMATION_RATE: 8,
            INIT_POSITION: { x: 700, y: 180 },
            orientation: { rows: 1, columns: 1 },
            down: { row: 0, start: 0, columns: 1 },
            right: { row: 0, start: 0, columns: 1, mirror: true },
            left: { row: 0, start: 0, columns: 1 },
            up: { row: 0, start: 0, columns: 1 },
            upRight: { row: 0, start: 0, columns: 1, mirror: true },
            downRight: { row: 0, start: 0, columns: 1, mirror: true },
            upLeft: { row: 0, start: 0, columns: 1 },
            downLeft: { row: 0, start: 0, columns: 1 },
            hitbox: { widthPercentage: 0.2, heightPercentage: 0.28 },
            reaction: function() {}
        };

        // Collision walls adjusted so all starfish are reachable
        const dbarrier_1 = {
            id: 'dbarrier_1', x: 0, y: 0, width: 0, height: 0, visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_2 = {
            id: 'dbarrier_2', x: 0, y: 0, width: 0, height: 0, visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        const dbarrier_3 = {
            id: 'dbarrier_3', x: 0, y: 0, width: 0, height: 0, visible: false,
            hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
            fromOverlay: true
        };

        this.classes = [
            { class: GameEnvBackground, data: bgData },
            { class: Player, data: playerData },
            { class: Npc, data: mermaidNpc },
            { class: Npc, data: slimeNpc },
            { class: Npc, data: kirbyNpc },
            { class: Npc, data: sharkNpc },
            { class: Barrier, data: dbarrier_1 },
            { class: Barrier, data: dbarrier_2 },
            { class: Barrier, data: dbarrier_3 }
        ];
    }

    initialize() {
        // Runtime wiring: mount HUD/menu, gate NPCs, and attach shark AI.
        this.syncRunnerFullscreenState?.();
        if (!this._runnerFullscreenObserver && document.body) {
            this._runnerFullscreenObserver = new MutationObserver(() => {
                this.syncRunnerFullscreenState?.();
            });
            this._runnerFullscreenObserver.observe(document.body, { childList: true });
        }
        if (!this._runnerFullscreenKeyListenerAttached) {
            document.addEventListener('keydown', this.handleRunnerFullscreenKeydown, true);
            this._runnerFullscreenKeyListenerAttached = true;
        }
        this.ensureTopMenuBar?.();
        if (this.multiplayer.enabled && this.multiplayer.room) {
            this.startMultiplayer?.();
        }

        if (this.gameMode === 'challenge') {
            this.ensureChallengeHud?.();
        } else {
            this.ensureQuestHud?.();
            this.playUnderwaterTheme?.(true);
        }

        const player = this.gameEnv?.gameObjects?.find(
            obj => obj?.spriteData?.id === 'playerData'
        );
        if (player && !player._aquaticLockWrapped) {
            const originalUpdate = player.update.bind(player);
            const applyAquaticVerticalBoost = () => {
                const sonicBoost = this.isBossBuffActive?.('sonicUntil') ? 1.2 : 1;
                player.xVelocity = (player._aquaticBaseXVelocity || player.xVelocity || 0) * sonicBoost;
                player.yVelocity = (player._aquaticBaseYVelocity || player.yVelocity || 0) * 1.35 * sonicBoost;
            };

            player._aquaticBaseXVelocity = player.xVelocity;
            player._aquaticBaseYVelocity = player.yVelocity;
            applyAquaticVerticalBoost();
            if (!player._aquaticVerticalResizeWrapped) {
                const originalResize = player.resize.bind(player);
                player.resize = () => {
                    originalResize();
                    player._aquaticBaseXVelocity = player.xVelocity;
                    player._aquaticBaseYVelocity = player.yVelocity;
                    applyAquaticVerticalBoost();
                };
                player._aquaticVerticalResizeWrapped = true;
            }

            player.update = () => {
                if (this.playerLock) {
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                    player.pressedKeys = {};
                    player.draw();
                    return;
                }
                applyAquaticVerticalBoost();
                if (typeof player.updateVelocity === 'function') {
                    player.updateVelocity();
                }
                originalUpdate();
            };
            player._aquaticLockWrapped = true;
        }

        const mermaid = this.gameEnv?.gameObjects?.find(
            obj => obj?.spriteData?.id === 'Mermaid'
        );
        if (mermaid) {
            mermaid.setupCanvas = function() {
                const pixels = this.spriteData?.pixels || { width: this.canvas.width, height: this.canvas.height };
                const orientation = this.spriteData?.orientation || { rows: 1, columns: 1 };
                const frameW = Math.max(1, Math.round(pixels.width / orientation.columns));
                const frameH = Math.max(1, Math.round(pixels.height / orientation.rows));
                const aspect = frameW / frameH;

                // Preserve sprite aspect ratio instead of forcing a square
                const baseSize = this.size;
                const width = baseSize * aspect;
                const height = baseSize;

                this.canvas.style.width = `${width}px`;
                this.canvas.style.height = `${height}px`;
                this.canvas.style.position = 'absolute';
                this.canvas.style.left = `${this.position.x}px`;
                this.canvas.style.top = `${this.gameEnv.top + this.position.y}px`;
                this.canvas.style.zIndex = (this.data && this.data.zIndex !== undefined) ? this.data.zIndex : "10";
            };
        }

        if (this.gameMode === 'challenge') {
            const mermaidNpc = this.gameEnv?.gameObjects?.find(
                obj => obj?.spriteData?.id === 'Mermaid'
            );
            const slimeNpc = this.gameEnv?.gameObjects?.find(
                obj => obj?.spriteData?.id === 'Random Slime'
            );
            const kirbyNpc = this.gameEnv?.gameObjects?.find(
                obj => obj?.spriteData?.id === 'Kirby'
            );

            [mermaidNpc, slimeNpc, kirbyNpc].forEach((npc) => {
                if (!npc) return;
                if (npc.canvas) npc.canvas.style.display = 'none';
                npc.position.x = -10000;
                npc.position.y = -10000;
                npc.interact = function() {};
                npc.reaction = function() {};
            });

            this.startChallengeWave?.();
        }

        const shark = this.gameEnv?.gameObjects?.find(
            obj => obj?.spriteData?.id === 'Shark'
        );

        if (shark) {
            const randomDirection = () => {
                const angle = Math.random() * Math.PI * 2;
                return { x: Math.cos(angle), y: Math.sin(angle) };
            };

            const directionFromVector = (vx, vy) => {
                const absX = Math.abs(vx);
                const absY = Math.abs(vy);
                if (absX < 0.05 && absY < 0.05) return 'right';
                if (absX > absY * 1.5) return vx >= 0 ? 'right' : 'left';
                if (absY > absX * 1.5) return vy >= 0 ? 'down' : 'up';
                if (vx >= 0 && vy >= 0) return 'downRight';
                if (vx >= 0 && vy < 0) return 'upRight';
                if (vx < 0 && vy >= 0) return 'downLeft';
                return 'upLeft';
            };

            const baseSpeed = Math.max(1.2, Math.min(this.gameEnv.innerWidth, this.gameEnv.innerHeight) * 0.0035);
            const initialVector = randomDirection();

            shark._motion = {
                vector: initialVector,
                speed: baseSpeed,
                nextTurnAt: performance.now() + 1200 + Math.random() * 1200
            };

            const getRect = (obj) => {
                const x = obj?.position?.x ?? obj?.x ?? 0;
                const y = obj?.position?.y ?? obj?.y ?? 0;
                const w = obj?.width ?? 0;
                const h = obj?.height ?? 0;
                return { x, y, w, h };
            };

            const intersects = (a, b) => {
                return (
                    a.x < b.x + b.w &&
                    a.x + a.w > b.x &&
                    a.y < b.y + b.h &&
                    a.y + a.h > b.y
                );
            };

            const resolveSharkCollisions = () => {
                const sharkRect = getRect(shark);
                const blockers = (this.gameEnv?.gameObjects || []).filter(obj => {
                    if (!obj || obj === shark || !obj.canvas) return false;
                    if (obj?.spriteData?.id === 'Shark') return false;
                    if (obj?.spriteData?.id === 'playerData') return false;
                    if (obj?.spriteData?.id?.startsWith('starfish_')) return false;
                    const type = obj?.constructor?.name;
                    return type === 'Npc' || type === 'Barrier';
                });

                blockers.forEach(blocker => {
                    const otherRect = getRect(blocker);
                    if (!intersects(sharkRect, otherRect)) return;

                    const overlapX = Math.min(
                        sharkRect.x + sharkRect.w - otherRect.x,
                        otherRect.x + otherRect.w - sharkRect.x
                    );
                    const overlapY = Math.min(
                        sharkRect.y + sharkRect.h - otherRect.y,
                        otherRect.y + otherRect.h - sharkRect.y
                    );

                    if (overlapX < overlapY) {
                        if (sharkRect.x < otherRect.x) {
                            shark.position.x -= overlapX;
                        } else {
                            shark.position.x += overlapX;
                        }
                        shark._motion.vector.x *= -1;
                    } else {
                        if (sharkRect.y < otherRect.y) {
                            shark.position.y -= overlapY;
                        } else {
                            shark.position.y += overlapY;
                        }
                        shark._motion.vector.y *= -1;
                    }

                    sharkRect.x = shark.position.x;
                    sharkRect.y = shark.position.y;
                });
            };

            shark.update = () => {
                const q2 = this.questState?.secondQuest;
                if (this.levelCompleted || q2?.inSurface || q2?.returning || q2?.completed) {
                    if (shark.canvas) shark.canvas.style.display = 'none';
                    return;
                }

                if (shark.canvas) shark.canvas.style.display = 'block';

                const now = performance.now();
                if (now >= shark._motion.nextTurnAt) {
                    shark._motion.vector = randomDirection();
                    shark._motion.nextTurnAt = now + 1200 + Math.random() * 1200;
                }

                shark.position.x += shark._motion.vector.x * shark._motion.speed;
                shark.position.y += shark._motion.vector.y * shark._motion.speed;

                // Bounce at bounds while keeping straight-line motion between turns.
                if (shark.position.x < 0) {
                    shark.position.x = 0;
                    shark._motion.vector.x = Math.abs(shark._motion.vector.x);
                } else if (shark.position.x + shark.width > this.gameEnv.innerWidth) {
                    shark.position.x = this.gameEnv.innerWidth - shark.width;
                    shark._motion.vector.x = -Math.abs(shark._motion.vector.x);
                }

                if (shark.position.y < 0) {
                    shark.position.y = 0;
                    shark._motion.vector.y = Math.abs(shark._motion.vector.y);
                } else if (shark.position.y + shark.height > this.gameEnv.innerHeight) {
                    shark.position.y = this.gameEnv.innerHeight - shark.height;
                    shark._motion.vector.y = -Math.abs(shark._motion.vector.y);
                }

                resolveSharkCollisions();

                shark.direction = directionFromVector(shark._motion.vector.x, shark._motion.vector.y);
                shark.draw();

                const player = this.gameEnv?.gameObjects?.find(
                    obj => obj?.spriteData?.id === 'playerData'
                );

                if (!player || !player.canvas || !shark.canvas) return;

                shark.isCollision(player);
                if (shark.collisionData?.hit) {
                    this.showSharkGameOver();
                }
            };
        }

        if (!this._bossUpdateTimer) {
            this._bossUpdateTimer = setInterval(() => {
                if (this.syncAquaticPauseState?.()) return;
                this.updateBossCombat?.();
            }, 16);
        }
    }

    destroy() {
        // Remove level-owned overlays and temporary spawned objects.
        this.stopMultiplayer?.();
        if (this._runnerFullscreenObserver) {
            this._runnerFullscreenObserver.disconnect();
            this._runnerFullscreenObserver = null;
        }
        if (this._runnerFullscreenKeyListenerAttached) {
            document.removeEventListener('keydown', this.handleRunnerFullscreenKeydown, true);
            this._runnerFullscreenKeyListenerAttached = false;
        }
        this._runnerFullscreenActive = false;
        this.unlockPageScroll?.();
        const topMenu = document.getElementById('aquatic-top-menubar');
        if (topMenu) topMenu.remove();
        const topMenuNotice = document.getElementById('aquatic-top-menu-notice');
        if (topMenuNotice) topMenuNotice.remove();
        const gameOver = document.getElementById('aquatic-shark-gameover');
        if (gameOver) gameOver.remove();
        const quest = document.getElementById('aquatic-quest-window');
        if (quest) quest.remove();
        const hud = document.getElementById('aquatic-quest-hud');
        if (hud) hud.remove();
        const challengeHud = document.getElementById('aquatic-challenge-hud');
        if (challengeHud) challengeHud.remove();
        const waveComplete = document.getElementById('aquatic-challenge-wave-complete');
        if (waveComplete) waveComplete.remove();
        const transition = document.getElementById('aquatic-transition-overlay');
        if (transition) transition.remove();
        const bossHud = document.getElementById('aquatic-boss-hud');
        if (bossHud) bossHud.remove();
        const playerBossHud = document.getElementById('aquatic-player-hp-hud');
        if (playerBossHud) playerBossHud.remove();
        const bossDialogue = document.getElementById('aquatic-boss-dialogue');
        if (bossDialogue) bossDialogue.remove();
        const bossWin = document.getElementById('aquatic-boss-win');
        if (bossWin) bossWin.remove();
        const bossVictory = document.getElementById('aquatic-boss-victory');
        if (bossVictory) bossVictory.remove();
        if (this._bossUpdateTimer) {
            clearInterval(this._bossUpdateTimer);
            this._bossUpdateTimer = null;
        }
        this.stopUnderwaterTheme?.();
        this.cleanupBossEncounter?.();
        document.querySelectorAll('.ai-npc-modal').forEach((modal) => modal.remove());
        document.querySelectorAll('.ai-npc-container').forEach((container) => container.remove());
        this.clearSurfaceTrash?.();
        this.clearChallengeStarfish?.();
    }

}

export default GameLevelAquaticGameLevel;
//
