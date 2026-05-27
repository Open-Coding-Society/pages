import GameEnvBackground from "@assets/js/GameEnginev1.1/essentials/GameEnvBackground.js";
import Player from "@assets/js/GameEnginev1.1/essentials/Player.js";

class CutscenePlayer extends Player {
    bindMovementKeyListners() {
        // Disable manual controls during the cutscene.
    }

    handleKeyDown() {
        // No-op for cutscene.
    }

    handleKeyUp() {
        // No-op for cutscene.
    }

    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.onExitScreen = data?.onExitScreen;
        this._timelineStart = Date.now();
        this._spawned = false;
        this._exitTriggered = false;

        if (this.touchControls) {
            this.touchControls.hide();
        }
    }

    update() {
        const elapsed = Date.now() - this._timelineStart;
        const spawnDelayMs = 2000;
        const pauseAfterSpawnMs = 2500;
        const walkStartMs = spawnDelayMs + pauseAfterSpawnMs;

        if (elapsed < spawnDelayMs) {
            this.visible = false;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.moved = false;
            return;
        }

        if (!this._spawned) {
            this.visible = true;
            this.position.x = (this.gameEnv.innerWidth - this.width) / 2;
            this.position.y = (this.gameEnv.innerHeight * 0.75) - (this.height / 2);
            this.direction = 'down';
            this._spawned = true;
        }

        if (elapsed < walkStartMs) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.moved = false;
            this.direction = 'down';
            this.draw();
            return;
        }

        this.visible = true;
        this.moved = true;
        this.direction = 'down';
        this.position.y += this.yVelocity;
        this.draw();

        if (!this._exitTriggered && this.position.y > this.gameEnv.innerHeight + this.height) {
            this._exitTriggered = true;
            if (typeof this.onExitScreen === 'function') {
                this.onExitScreen();
            }
        }
    }
}

class MansionLevel6_EndingCutscene {
    constructor(gameEnv) {
        const width = gameEnv.innerWidth;
        const height = gameEnv.innerHeight;
        const path = gameEnv.path;

        const image_src_outside = path + "/images/projects/mansiongame-old/mansion_outside_image.png";
        const image_data_outside = {
            name: 'outside',
            src: image_src_outside,
            pixels: { height: 1080, width: 1920 },
            mode: 'stretch'
        };

        const sprite_src_mc = path + "/images/projects/mansiongame-old/spookMcWalk.png";
        const MC_SCALE_FACTOR = 6;
        const sprite_data_mc = {
            id: 'Spook',
            greeting: "",
            src: sprite_src_mc,
            SCALE_FACTOR: MC_SCALE_FACTOR,
            STEP_FACTOR: 500,
            ANIMATION_RATE: 10,
            INIT_POSITION: { x: (width / 2 - width / (5 * MC_SCALE_FACTOR)), y: height / 2 },
            pixels: { height: 2400, width: 3600 },
            orientation: { rows: 2, columns: 3 },
            down: { row: 1, start: 0, columns: 3 },
            downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
            downLeft: { row: 0, start: 0, columns: 3, rotate: -Math.PI / 16 },
            left: { row: 0, start: 0, columns: 3 },
            right: { row: 1, start: 0, columns: 3 },
            up: { row: 1, start: 0, columns: 3 },
            upLeft: { row: 0, start: 0, columns: 3, rotate: Math.PI / 16 },
            upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
            hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
            onExitScreen: () => this.startCredits()
        };

        this.gameEnv = gameEnv;
        this._creditsStarted = false;

        this.classes = [
            { class: GameEnvBackground, data: image_data_outside },
            { class: CutscenePlayer, data: sprite_data_mc }
        ];
    }

    startCredits() {
        if (this._creditsStarted || typeof document === 'undefined') return;
        this._creditsStarted = true;

        const assetBase = this.gameEnv?.path || '';
        if (!this._creditsMusic) {
            this._creditsMusic = new Audio(assetBase + '/images/projects/mansiongame-old/mario-spooky.mp3');
            this._creditsMusic.loop = true;
            this._creditsMusic.volume = 0.7;
        }

        if (!this._lightningSfx) {
            this._lightningSfx = new Audio(assetBase + '/images/projects/mansiongame-old/lightning.mp3');
            this._lightningSfx.volume = 1;
        }

        const fadeAudio = (audioElement, targetVolume, durationMs) => {
            if (!audioElement) return;
            const startVolume = audioElement.volume;
            const delta = targetVolume - startVolume;
            const startTime = Date.now();

            const step = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                audioElement.volume = startVolume + (delta * progress);
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const overlay = document.createElement('div');
        overlay.id = 'mansion-credits-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: '0',
            transition: 'opacity 1500ms ease',
            zIndex: '10000',
            pointerEvents: 'none'
        });

        const credits = document.createElement('div');
        credits.id = 'mansion-credits-roll';
        Object.assign(credits.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%, 120%)',
            bottom: '0',
            color: '#ffffff',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '20px',
            lineHeight: '2.2',
            textAlign: 'center',
            zIndex: '10001',
            whiteSpace: 'pre-line'
        });

        const lines = [
            'YOU HAVE ESCAPED THE MANSION!',
            '',
            '',
            '',
            'THANKS FOR PLAYING',
            '',
            'CREDITS',
            'PERIODS 1 & 5',
            'CSSE TRI 3 2026',
            '',
            'ORIGINAL GAME: CSSE P1 TRI 1 2026',
            '',
            'THE END',
        ];
        credits.textContent = lines.join('\n');

        const reaperImage = document.createElement('img');
        reaperImage.id = 'mansion-reaper-shadow';
        reaperImage.src = assetBase + '/images/projects/mansiongame-old/reaperShadow.png';
        Object.assign(reaperImage.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '70vw',
            maxHeight: '80vh',
            opacity: '0',
            transition: 'opacity 120ms ease',
            zIndex: '10002',
            pointerEvents: 'none'
        });

        const playAgainButton = document.createElement('button');
        playAgainButton.id = 'mansion-play-again';
        playAgainButton.type = 'button';
        playAgainButton.textContent = 'PLAY AGAIN?';
        Object.assign(playAgainButton.style, {
            position: 'fixed',
            left: '50%',
            bottom: '10%',
            transform: 'translateX(-50%)',
            padding: '14px 26px',
            fontFamily: "'Press Start 2P', sans-serif",
            fontSize: '18px',
            letterSpacing: '1px',
            color: '#ffffff',
            backgroundColor: '#111111',
            border: '2px solid #ffffff',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: '0',
            transition: 'opacity 2000ms ease',
            zIndex: '10003'
        });

        playAgainButton.addEventListener('click', () => {
            for (let i = 1; i <= 6; i += 1) {
                localStorage.setItem(`mansionGame_level${i}_unlocked`, 'false');
            }
            window.location.reload();
        });

        if (!document.getElementById('mansion-credits-style')) {
            const style = document.createElement('style');
            style.id = 'mansion-credits-style';
            style.textContent = `
                @keyframes mansion-credits-roll {
                    from { transform: translate(-50%, 120%); }
                    to { transform: translate(-50%, -220%); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);
        document.body.appendChild(credits);
        document.body.appendChild(reaperImage);
        document.body.appendChild(playAgainButton);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            credits.style.animation = 'mansion-credits-roll 24s linear forwards';
            this._creditsMusic.play().catch(() => {});
        });

        const creditsDurationMs = 24000;
        setTimeout(() => {
            fadeAudio(this._creditsMusic, 0, 2000);
        }, Math.max(0, creditsDurationMs - 2000));

        const startLightningSequence = () => {
            if (credits.parentNode) {
                credits.parentNode.removeChild(credits);
            }

            this._lightningSfx.currentTime = 0;
            this._lightningSfx.play().catch(() => {});

            const reaperDelayMs = 200;
            const flashDurationMs = 200;

            setTimeout(() => {
                overlay.style.backgroundColor = '#ffffff';
                reaperImage.style.opacity = '1';
            }, reaperDelayMs);

            setTimeout(() => {
                reaperImage.style.opacity = '0';
                overlay.style.backgroundColor = '#000';
                overlay.style.pointerEvents = 'auto';
                fadeAudio(this._creditsMusic, 0.7, 2000);
                setTimeout(() => {
                    playAgainButton.style.opacity = '1';
                }, 2000);
            }, reaperDelayMs + flashDurationMs);
        };

        const lightningLeadMs = 10000;
        setTimeout(startLightningSequence, Math.max(0, creditsDurationMs - lightningLeadMs));
    }
}

export default MansionLevel6_EndingCutscene;
