import GameEnvBackground from '@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import DialogueSystem from '@assets/js/GameEnginev1.1/essentials/DialogueSystem.js';
import Barrier from './Barrier.js';
import BlackjackGameManager from './Blackjack.js';
import TriggerZone from './TriggerZone.js';
import MansionLevel4 from './mansionLevel4.js';
import MansionLevelMain from './mansionLevelMain.js';

console.log("🎮 mansionLevel3.js loaded!");

// Halloween palette
const HEX = {
    purple:    '#6b0ac9',
    blood:     '#8b0000',
    green:     '#00cc44',
    pumpkin:   '#cc6600',
    magenta:   '#cc00cc',
    ghostWhite:'#e0c0ff',
};

class MansionLevel3 {
    constructor(gameEnv) {
        console.log("🎮 MansionLevel3 constructor started");

        let width  = gameEnv.innerWidth;
        let height = gameEnv.innerHeight;
        let path   = gameEnv.path;

        this.gameEnv          = gameEnv;
        this.blackjackManager = new BlackjackGameManager(gameEnv);
        this.blackjackManager.onWin = () => this.winLevel();

        this.inMainZone          = false;
        this.mainPromptVisible   = false;
        this.lockedPromptVisible = false;
        this.mainPromptEl        = null;
        this.lockedPromptEl      = null;

        // Casino background (same sprite as level 4)
        const image_data_background = {
            name: 'background',
            greeting: "Welcome to the Haunted Casino! Win $10,000 to escape!",
            src: path + "/images/projects/mansionGame/image_lvl4.png",
            pixels: { height: 1280, width: 720 }
        };

        const MC_SCALE_FACTOR = 6;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "Hi, I am Spook.",
            src: path + "/images/projects/mansionGame/spookMcWalk.png",
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 800,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height - (height / MC_SCALE_FACTOR) },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down:      { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate:  Math.PI / 16 },
            downLeft:  { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left:      { row: 0, start: 0, columns: 3 },
            right:     { row: 1, start: 0, columns: 3 },
            up:        { row: 1, start: 0, columns: 3 },
            upLeft:    { row: 0, start: 0, columns: 3, rotate:  Math.PI / 16 },
            upRight:   { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            keypress: { up: 87, left: 65, down: 83, right: 68 }
        };

        // Main (center spotlight) table trigger zone
        const mainZoneData = {
            x: width * 0.35,
            y: height * 0.10,
            width:  width  * 0.30,
            height: height * 0.45,
            color: 'rgba(107, 10, 201, 0.12)',
            visible: false,
            onEnter: () => {
                this.inMainZone = true;
                this.showMainPrompt();
            },
            onExit: () => {
                this.inMainZone = false;
                this.hideMainPrompt();
            }
        };

        // Locked side tables (4 outer tables visible in the sprite)
        const lockedMessages = [
            "👻 The ghost dealer isn't at this table right now!",
            "🦇 The bats have claimed this table for the night!",
            "🕸️ This table is tangled in cobwebs — come back never!",
            "☠️ The skeleton croupier called in sick. Table closed!"
        ];

        // Positions estimated from image_lvl4.png layout:
        //  upper-left, upper-right, lower-left, lower-right
        const lockedZoneConfigs = [
            { x: width * 0.02, y: height * 0.04, w: width * 0.25, h: height * 0.42, msg: lockedMessages[0] },
            { x: width * 0.68, y: height * 0.04, w: width * 0.25, h: height * 0.42, msg: lockedMessages[1] },
            { x: width * 0.02, y: height * 0.53, w: width * 0.25, h: height * 0.42, msg: lockedMessages[2] },
            { x: width * 0.68, y: height * 0.53, w: width * 0.25, h: height * 0.42, msg: lockedMessages[3] },
        ];

        const lockedZones = lockedZoneConfigs.map(cfg => ({
            x: cfg.x, y: cfg.y,
            width: cfg.w, height: cfg.h,
            color: 'rgba(139, 0, 0, 0.08)',
            visible: false,
            onEnter: () => this.showLockedPrompt(cfg.msg),
            onExit:  () => this.hideLockedPrompt()
        }));

        const barrierData = [
            { x: 0,          y: 0,           width: width, height: 20,    visible: false },
            { x: 0,          y: height - 20, width: width, height: 20,    visible: false },
            { x: 0,          y: 0,           width: 20,    height: height, visible: false },
            { x: width - 20, y: 0,           width: 20,    height: height, visible: false }
        ];

        this.classes = [
            { class: GameEnvBackground, data: image_data_background },
            { class: Player,            data: sprite_data_mc },
            { class: TriggerZone,       data: mainZoneData },
            ...lockedZones.map(data => ({ class: TriggerZone, data })),
            ...barrierData.map(data  => ({ class: Barrier,    data }))
        ];

        // Spooky background music
        this.backgroundMusic = new Audio(path + '/assets/sounds/mansionGame/SpookieDookie.mp3');
        this.backgroundMusic.loop   = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play().catch(() => {});

        this.setupKeyListener();
        console.log("✅ MansionLevel3 (casino) constructor completed");
    }

    setupKeyListener() {
        this.keyHandler = (e) => {
            if (e.keyCode === 69 && this.inMainZone && !this.blackjackManager.gameActive) {
                this.blackjackManager.startGame();
                this.hideMainPrompt();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    // ─── Main table prompt ────────────────────────────────────────────────────

    showMainPrompt() {
        if (this.mainPromptVisible || this.blackjackManager.gameActive) return;
        this.mainPromptVisible = true;

        this.mainPromptEl = document.createElement('div');
        this.mainPromptEl.id = 'casino-prompt-l3';
        this.mainPromptEl.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(5, 0, 18, 0.95);
            border: 3px solid ${HEX.purple};
            border-radius: 15px;
            padding: 30px 50px;
            z-index: 9999;
            text-align: center;
            animation: l3BorderCycle 3s infinite;
        `;

        this.mainPromptEl.innerHTML = `
            <style>
                @keyframes l3BorderCycle {
                    0%   { box-shadow: 0 0 30px ${HEX.purple}, 0 0 60px rgba(107,10,201,0.35); border-color: ${HEX.purple}; }
                    33%  { box-shadow: 0 0 30px ${HEX.blood},  0 0 60px rgba(139,0,0,0.35);   border-color: ${HEX.blood};  }
                    66%  { box-shadow: 0 0 30px ${HEX.green},  0 0 60px rgba(0,204,68,0.35);  border-color: ${HEX.green};  }
                    100% { box-shadow: 0 0 30px ${HEX.purple}, 0 0 60px rgba(107,10,201,0.35); border-color: ${HEX.purple}; }
                }
            </style>
            <div style="font-size:52px; margin-bottom:12px;">🎰</div>
            <h2 style="color:${HEX.purple}; font-size:30px; margin:0 0 12px 0;
                       text-shadow:0 0 12px ${HEX.purple};">HAUNTED BLACKJACK</h2>
            <p style="color:${HEX.ghostWhite}; font-size:18px; margin:8px 0;">
                Win <strong style="color:${HEX.green};">$10,000</strong> to escape the cursed casino!
            </p>
            <p style="color:#aaa; font-size:14px; margin:4px 0;">
                Split • Double Down • Insurance • Natural BJ pays 3:2
            </p>
            <div style="margin-top:22px; padding:14px 20px;
                        background: linear-gradient(135deg, ${HEX.purple}, ${HEX.blood});
                        border-radius:10px;">
                <p style="color:white; font-size:22px; margin:0; font-weight:bold;">
                    Press <kbd style="background:#000;border:1px solid #fff;padding:2px 8px;border-radius:4px;">E</kbd> to Enter
                </p>
            </div>
        `;

        document.body.appendChild(this.mainPromptEl);
    }

    hideMainPrompt() {
        if (!this.mainPromptVisible) return;
        this.mainPromptVisible = false;
        if (this.mainPromptEl && this.mainPromptEl.parentNode) {
            this.mainPromptEl.parentNode.removeChild(this.mainPromptEl);
        }
        this.mainPromptEl = null;
    }

    // ─── Locked table prompt ──────────────────────────────────────────────────

    showLockedPrompt(message) {
        if (this.lockedPromptVisible) return;
        this.lockedPromptVisible = true;

        this.lockedPromptEl = document.createElement('div');
        this.lockedPromptEl.id = 'locked-table-prompt-l3';
        this.lockedPromptEl.style.cssText = `
            position: fixed;
            top: 38%; left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(5, 0, 18, 0.95);
            border: 3px solid ${HEX.blood};
            border-radius: 15px;
            padding: 25px 40px;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 0 30px ${HEX.blood}, 0 0 60px rgba(139,0,0,0.3);
            animation: l3LockedPulse 2s infinite;
        `;

        this.lockedPromptEl.innerHTML = `
            <style>
                @keyframes l3LockedPulse {
                    0%,100% { box-shadow: 0 0 25px ${HEX.blood};  }
                    50%     { box-shadow: 0 0 45px ${HEX.magenta}; }
                }
            </style>
            <div style="font-size:44px; margin-bottom:10px;">⛔</div>
            <h3 style="color:${HEX.blood}; font-size:24px; margin:0 0 10px 0;
                       text-shadow:0 0 8px ${HEX.blood};">TABLE CLOSED</h3>
            <p style="color:${HEX.ghostWhite}; font-size:17px; margin:0 0 10px 0;">${message}</p>
            <p style="color:#888; font-size:13px; margin:0;">Walk away to dismiss</p>
        `;

        document.body.appendChild(this.lockedPromptEl);
    }

    hideLockedPrompt() {
        if (!this.lockedPromptVisible) return;
        this.lockedPromptVisible = false;
        if (this.lockedPromptEl && this.lockedPromptEl.parentNode) {
            this.lockedPromptEl.parentNode.removeChild(this.lockedPromptEl);
        }
        this.lockedPromptEl = null;
    }

    // ─── Level lifecycle ──────────────────────────────────────────────────────

    update() {
        // Re-hide main prompt if blackjack became active
        if (this.blackjackManager.gameActive && this.mainPromptVisible) {
            this.hideMainPrompt();
        }
    }

    winLevel() {
        console.log("🎉 Level 3 Casino — Won!");

        // Unlock level 4 for the lobby
        localStorage.setItem('mansionGame_level4_unlocked', 'true');

        const dialogueSystem = new DialogueSystem();
        dialogueSystem.showDialogue(
            'You won $10,000 at the haunted casino! The spirits are impressed... deeper into the mansion you go!',
            'Victory!',
            this.gameEnv.path + '/images/projects/mansionGame/key_lvl3.png'
        );
        dialogueSystem.addButtons([
            {
                text: 'Continue to Level 4',
                primary: true,
                action: () => {
                    dialogueSystem.closeDialogue();
                    if (this.gameEnv && this.gameEnv.gameControl) {
                        const gc = this.gameEnv.gameControl;
                        gc.levelClasses = [MansionLevel4];
                        gc.currentLevelIndex = 0;
                        gc.isPaused = false;
                        gc.transitionToLevel();
                    }
                }
            },
            {
                text: 'Return to Lobby',
                primary: false,
                action: () => {
                    dialogueSystem.closeDialogue();
                    if (this.gameEnv && this.gameEnv.gameControl) {
                        const gc = this.gameEnv.gameControl;
                        gc.levelClasses = [MansionLevelMain];
                        gc.currentLevelIndex = 0;
                        gc.isPaused = false;
                        gc.transitionToLevel();
                    }
                }
            }
        ]);
    }

    destroy() {
        console.log("🧹 MansionLevel3 cleanup...");
        document.removeEventListener('keydown', this.keyHandler);
        this.hideMainPrompt();
        this.hideLockedPrompt();
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
}

export default MansionLevel3;
