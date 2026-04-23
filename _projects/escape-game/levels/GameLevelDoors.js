// Second Level — The Doors of Destiny
// Save as: assets/js/GameEnginev1.1/GameLevelDoors.js
import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Npc from '/assets/js/GameEnginev1.1/essentials/Npc.js';
import DialogueSystem from '/assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import GameControl from '/assets/js/GameEnginev1.1/essentials/GameControl.js';
import GameLevelForest from '/assets/js/projects/escape-game/levels/GameLevelForest.js';
import Coin from '/assets/js/GameEnginev1.1/Coin.js';

class GameLevelDoors {
  constructor(gameEnv) {
    console.log("Initializing GameLevelDoors...");

    this.gameEnv = gameEnv;

    let height = gameEnv.innerHeight;
    let path   = gameEnv.path;

    // ── Pick which door is correct this run ───────────────────────────────────
    // Any of the 5 doors can be the correct one — chosen randomly at load time.
    // The correct door gets the transition interact; the others get dead-end messages.
    const doorConfigs = [
        {
            id: 'Blue Door',
            src: path + "/images/gamify/bluedoor.png",
            greeting: "A calm blue door hums with a gentle, inviting light...",
            deadEnd: "The blue light flickers and fades. Nothing lies beyond."
        },
        {
            id: 'Brown Door',
            src: path + "/images/gamify/browndoor.png",
            greeting: "A plain brown door, worn and splintered with age...",
            deadEnd: "Splinters and cobwebs. Nothing lies beyond this door."
        },
        {
            id: 'Green Door',
            src: path + "/images/gamify/greendoor.png",
            greeting: "A mossy green door covered in vines...",
            deadEnd: "Roots and earth block the way. Something ancient refuses you."
        },
        {
            id: 'Orange Door',
            src: path + "/images/gamify/orangedoor.png",
            greeting: "A blazing orange door radiates heat...",
            deadEnd: "A wall of scorching heat forces you back. Not this one."
        },
        {
            id: 'Red Door',
            src: path + "/images/gamify/reddoor.png",
            greeting: "An ominous red door pulses with a dark energy...",
            deadEnd: "A cold dread seizes your hand. Every instinct screams: not this one."
        },
    ];

    // Fixed x positions — shuffle so doors appear in different spots each run
    const xPositions = [0.2, 0.35, 0.5, 0.65, 0.8];
    for (let i = xPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [xPositions[i], xPositions[j]] = [xPositions[j], xPositions[i]];
    }

    // Pick a random door index to be correct this run
    const correctIndex = Math.floor(Math.random() * doorConfigs.length);
    console.log('Correct door this run:', doorConfigs[correctIndex].id);

    // ── Shared cleanup helper ─────────────────────────────────────────────────
    function cleanAndTransition(targetLevelClass, primaryGame) {
        const fade = document.createElement('div');
        Object.assign(fade.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100%', height: '100%',
            backgroundColor: '#000', opacity: '0',
            transition: 'opacity 0.8s ease-in-out',
            zIndex: '9999', pointerEvents: 'none'
        });
        document.body.appendChild(fade);

        requestAnimationFrame(() => {
            fade.style.opacity = '1';
            setTimeout(() => {
                const gameContainer = document.getElementById('gameContainer');
                if (gameContainer) {
                    Array.from(gameContainer.children).forEach(child => {
                        if (child.id !== 'promptDropDown') gameContainer.removeChild(child);
                    });
                }
                if (primaryGame) {
                    primaryGame.levelClasses = [targetLevelClass];
                    primaryGame.currentLevelIndex = 0;
                    primaryGame.isPaused = false;
                    primaryGame.transitionToLevel();
                }
                setTimeout(() => {
                    fade.style.opacity = '0';
                    setTimeout(() => {
                        if (fade.parentNode) fade.parentNode.removeChild(fade);
                    }, 800);
                }, 400);
            }, 800);
        });
    }

    // ── Cryptic hints ─────────────────────────────────────────────────────────
    const crypticHints = [
        "The ocean does not burn, nor does it decay. It does not rage — it simply endures. What colour is patience?",
        "Fire consumes. Roots entangle. Darkness devours. Only one of these is none of those things.",
        "I have crossed this room a hundred times. Each time I followed warmth, I found ash. Each time I followed rot, I found roots. The one that called to me like deep water... that was the one.",
        "Three of these doors want something from you. One simply waits. Can you feel the difference?",
        "The wrong doors speak loudly — heat, shadow, earth. The right door does not need to threaten. Listen for the quiet one.",
    ];
    const todaysHint = crypticHints[Math.floor(Math.random() * crypticHints.length)];

    // ── Background ───────────────────────────────────────────────────────────
    const image_data_water = {
        id: 'Water',
        src: path + "/images/gamify/windows.png",
        pixels: { height: 597, width: 340 }
    };

    // ── Player ────────────────────────────────────────────────────────────────
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
        id: 'Octopus',
        greeting: "Hi I am Octopus, the water wanderer. I am looking for wisdom and adventure!",
        src: path + "/images/gamify/octopus.png",
        SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        GRAVITY: false,
        INIT_POSITION: { x: 0, y: height - (height / OCTOPUS_SCALE_FACTOR) },
        pixels: { height: 250, width: 167 },
        orientation: { rows: 3, columns: 2 },
        down:      { row: 0, start: 0, columns: 2 },
        downLeft:  { row: 0, start: 0, columns: 2, mirror: true,  rotate:  Math.PI / 16 },
        downRight: { row: 0, start: 0, columns: 2,                rotate: -Math.PI / 16 },
        left:      { row: 1, start: 0, columns: 2, mirror: true },
        right:     { row: 1, start: 0, columns: 2 },
        up:        { row: 0, start: 0, columns: 2 },
        upLeft:    { row: 1, start: 0, columns: 2, mirror: true,  rotate: -Math.PI / 16 },
        upRight:   { row: 1, start: 0, columns: 2,                rotate:  Math.PI / 16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    // ── Shared door defaults ──────────────────────────────────────────────────
    const doorDefaults = {
        SCALE_FACTOR: 8, ANIMATION_RATE: 50,
        pixels: { height: 414, width: 252 },
        orientation: { rows: 1, columns: 1 },
        down: { row: 0, start: 0, columns: 1 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
    };

    // ── Hooded Wanderer ───────────────────────────────────────────────────────
    const sprite_greet_wanderer = "I have stood before these doors before. Let me share what I know...";
    const sprite_data_wanderer = {
        id: 'Hooded Wanderer', greeting: sprite_greet_wanderer,
        src: path + "/images/gamify/tux.png", SCALE_FACTOR: 8, ANIMATION_RATE: 50,
        pixels: { height: 256, width: 352 }, INIT_POSITION: { x: 0.08, y: 0.4 },
        orientation: { rows: 8, columns: 11 }, down: { row: 5, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        dialogues: [todaysHint],
        reaction: function() {
            if (this.dialogueSystem) this.showReactionDialogue();
            else console.log(sprite_greet_wanderer);
        },
        interact: function() {
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
            if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
            this.dialogueSystem.showDialogue(todaysHint, "The Hooded Wanderer", this.spriteData.src);
            this.dialogueSystem.addButtons([{ text: "I understand", action: () => this.dialogueSystem.closeDialogue() }]);
        }
    };

    // ── Lost Soul ─────────────────────────────────────────────────────────────
    const sprite_greet_soul1 = "I chose wrong. Now I wander.";
    const sprite_data_soul1 = {
        id: 'Lost Soul', greeting: sprite_greet_soul1,
        src: path + "/images/gamify/robot.png", SCALE_FACTOR: 12, ANIMATION_RATE: 100,
        pixels: { height: 316, width: 627 }, INIT_POSITION: { x: 0.88, y: 0.25 },
        orientation: { rows: 3, columns: 6 }, down: { row: 1, start: 0, columns: 6 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        dialogues: ["I chose wrong. Now I wander.", "Do not trust the heat. Do not trust the dark.", "I tried them all. One by one. I never learned.", "The right door felt different. I was too afraid to try it."],
        reaction: function() { if (this.dialogueSystem) this.showReactionDialogue(); },
        interact: function() {
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
            if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
            const msg = this.spriteData.dialogues[Math.floor(Math.random() * this.spriteData.dialogues.length)];
            this.dialogueSystem.showDialogue(msg, "Lost Soul", this.spriteData.src);
            this.dialogueSystem.addButtons([{ text: "...", action: () => this.dialogueSystem.closeDialogue() }]);
        }
    };

    // ── Forgotten One ─────────────────────────────────────────────────────────
    const sprite_greet_soul2 = "Don't end up like me.";
    const sprite_data_soul2 = {
        id: 'Forgotten One', greeting: sprite_greet_soul2,
        src: path + "/images/gamify/octocat.png", SCALE_FACTOR: 12, ANIMATION_RATE: 50,
        pixels: { height: 301, width: 801 }, INIT_POSITION: { x: 0.88, y: 0.7 },
        orientation: { rows: 1, columns: 4 }, down: { row: 0, start: 0, columns: 3 },
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
        dialogues: ["Don't end up like me.", "They all looked the same at first. Then I got close.", "I used to know which one was right. Now I've forgotten everything.", "The chamber remembers every wrong choice. Every. Single. One."],
        reaction: function() { if (this.dialogueSystem) this.showReactionDialogue(); },
        interact: function() {
            if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
            if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
            const msg = this.spriteData.dialogues[Math.floor(Math.random() * this.spriteData.dialogues.length)];
            this.dialogueSystem.showDialogue(msg, "Forgotten One", this.spriteData.src);
            this.dialogueSystem.addButtons([{ text: "...", action: () => this.dialogueSystem.closeDialogue() }]);
        }
    };

    // ── Build all 5 doors dynamically ─────────────────────────────────────────
    // Each door gets its own sprite data. The correct one gets the transition
    // interact; the rest get a dead-end message.
    const doorSprites = doorConfigs.map((cfg, i) => {
        const isCorrect = (i === correctIndex);

        return {
            ...doorDefaults,
            id: cfg.id,
            greeting: cfg.greeting,
            src: cfg.src,
            INIT_POSITION: { x: xPositions[i], y: 0.5 },
            dialogues: isCorrect
                ? ["Something stirs behind this door...", "This is the one. Can you feel it?"]
                : [cfg.deadEnd],
            reaction: function() {
                if (this.dialogueSystem) this.showReactionDialogue();
                else console.log(cfg.greeting);
            },
            interact: isCorrect
                ? function() {
                    if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
                    if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
                    this.dialogueSystem.showDialogue(
                        "Something on the other side already knows you are here. The light dims as the door groans open — whatever waits beyond does not feel like salvation. You cannot unsee what comes next.",
                        "You Should Not Have Come Here...",
                        this.spriteData.src
                    );
                    this.dialogueSystem.addButtons([
                        {
                            text: "Enter",
                            primary: true,
                            action: () => {
                                this.dialogueSystem.closeDialogue();
                                cleanAndTransition(GameLevelForest, gameEnv.gameControl);
                            }
                        },
                        {
                            text: "Not yet",
                            action: () => this.dialogueSystem.closeDialogue()
                        }
                    ]);
                }
                : function() {
                    if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) { this.dialogueSystem.closeDialogue(); return; }
                    if (!this.dialogueSystem) this.dialogueSystem = new DialogueSystem();
                    this.dialogueSystem.showDialogue(cfg.deadEnd, "Dead End!", this.spriteData.src);
                    this.dialogueSystem.addButtons([{
                        text: "Go back",
                        action: () => this.dialogueSystem.closeDialogue()
                    }]);
                }
        };
    });
    const sprite_data_coin = {
        id: 'coin',
        greeting: false,
        INIT_POSITION: { x: 0.5, y: 0.8 },
        color: '#FFD700',
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
        zIndex: 12,
        value: 1
};

    // ── Level class list ──────────────────────────────────────────────────────
    this.classes = [
        { class: GameEnvBackground, data: image_data_water },
        { class: Player,            data: sprite_data_octopus },
        { class: Npc,               data: sprite_data_wanderer },
        { class: Npc,               data: sprite_data_soul1 },
        { class: Npc,               data: sprite_data_soul2 },
        { class: Coin,              data: sprite_data_coin },
        ...doorSprites.map(data => ({ class: Npc, data }))
    ];
  }
}

export default GameLevelDoors;