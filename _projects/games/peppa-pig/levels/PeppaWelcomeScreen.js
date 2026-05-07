const CHARACTERS = [
    { id: 'ishan',   name: 'Ishan',       image: 'ishan-jha.png'    },
    { id: 'peppa',   name: 'Peppa Pig',   image: 'peppa-pig.png'    },
    { id: 'georgie', name: 'Georgie Pig', image: 'georgie-pig.png'  },
    { id: 'daddy',   name: 'Daddy Pig',   image: 'daddy-pig.png'    }
];

class PeppaWelcomeScreen {
    constructor(gameEnv) {
        this.gameEnv = gameEnv;
        this.selectedMode = null;
        this.p1Character = null;
        this.p2Character = null;
        this.classes = [];
    }

    initialize() {
        this.injectStyles();
        this.createWelcomeScreen();
    }

    getImagePath(imageFile) {
        const path = this.gameEnv.path || '';
        return `${path}/images/projects/peppa-pig/${imageFile}`;
    }

    injectStyles() {
        if (document.getElementById('peppa-welcome-styles')) return;
        const style = document.createElement('style');
        style.id = 'peppa-welcome-styles';
        style.textContent = `
            @keyframes peppa-bounce {
                0%, 100% { transform: translateY(0); }
                50%       { transform: translateY(-10px); }
            }
            @keyframes peppa-fadeIn {
                from { opacity: 0; transform: scale(0.96); }
                to   { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    getContainer() {
        return this.gameEnv.gameContainer ||
               this.gameEnv.container ||
               document.getElementById('gameContainer') ||
               document.body;
    }

    // ─── Welcome / Mode Selection ────────────────────────────────────────────

    createWelcomeScreen() {
        const wrapper = document.createElement('div');
        wrapper.id = 'peppa-welcome-wrapper';
        wrapper.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #ff69b4 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10000; font-family: Arial, sans-serif;
            animation: peppa-fadeIn 0.4s ease-out;
        `;

        const title = document.createElement('h1');
        title.textContent = 'PEPPA PIG BATTLE';
        title.style.cssText = `
            font-size: 56px; color: white; text-shadow: 3px 3px 8px rgba(0,0,0,0.4);
            margin: 0 0 20px 0; animation: peppa-bounce 1s ease-in-out infinite;
        `;

        const subtitle = document.createElement('p');
        subtitle.textContent = 'Choose Your Game Mode';
        subtitle.style.cssText = `font-size: 28px; color: rgba(255,255,255,0.9); margin: 0 0 40px 0;`;

        const buttonsRow = document.createElement('div');
        buttonsRow.style.cssText = `display: flex; gap: 30px; margin-bottom: 40px;`;

        const singleBtn = this.makeButton('👤 Single Player',   '#4CAF50', '#45a049');
        const twoBtn    = this.makeButton('👥 2 Players (Same PC)', '#2196F3', '#0b7dda');

        singleBtn.addEventListener('click', () => this.selectMode('singlePlayer'));
        twoBtn.addEventListener('click',    () => this.selectMode('twoPlayer'));

        buttonsRow.appendChild(singleBtn);
        buttonsRow.appendChild(twoBtn);

        const info = document.createElement('div');
        info.style.cssText = `
            text-align: center; color: rgba(255,255,255,0.85); font-size: 16px;
            max-width: 600px; line-height: 1.6;
        `;
        info.innerHTML = `
            <p><strong>Single Player:</strong> WASD to move, SPACE to attack.</p>
            <p><strong>2 Players:</strong> P1 uses WASD + SPACE &nbsp;|&nbsp; P2 uses Arrow Keys + Enter.</p>
            <p style="margin-top:16px; font-style:italic;">Collect coins and defeat the boss to win!</p>
        `;

        wrapper.appendChild(title);
        wrapper.appendChild(subtitle);
        wrapper.appendChild(buttonsRow);
        wrapper.appendChild(info);
        this.getContainer().appendChild(wrapper);
    }

    makeButton(text, bg, hoverBg) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 18px 32px; font-size: 22px; font-weight: bold; color: white;
            background: ${bg}; border: none; border-radius: 12px; cursor: pointer;
            transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        `;
        btn.addEventListener('mouseover', () => { btn.style.background = hoverBg; btn.style.transform = 'scale(1.08)'; });
        btn.addEventListener('mouseout',  () => { btn.style.background = bg;      btn.style.transform = 'scale(1)';    });
        return btn;
    }

    selectMode(mode) {
        this.selectedMode = mode;
        localStorage.setItem('peppaGameMode', mode);

        if (mode === 'twoPlayer') {
            this.fadeOut('peppa-welcome-wrapper', () => this.createCharacterSelectScreen());
        } else {
            this.fadeOut('peppa-welcome-wrapper', () => this.startGame());
        }
    }

    fadeOut(id, callback) {
        const el = document.getElementById(id);
        if (!el) { callback(); return; }
        el.style.transition = 'opacity 0.35s ease-out';
        el.style.opacity = '0';
        setTimeout(() => { el.remove(); callback(); }, 360);
    }

    // ─── Character Selection ─────────────────────────────────────────────────

    createCharacterSelectScreen() {
        const wrapper = document.createElement('div');
        wrapper.id = 'peppa-char-select-wrapper';
        wrapper.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10000; font-family: Arial, sans-serif;
            animation: peppa-fadeIn 0.35s ease-out;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Choose Your Characters';
        title.style.cssText = `
            font-size: 38px; color: white; text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
            margin: 0 0 28px 0;
        `;

        const panels = document.createElement('div');
        panels.style.cssText = `display: flex; gap: 70px; margin-bottom: 30px; align-items: flex-start;`;
        panels.appendChild(this.createPlayerPanel(1));
        panels.appendChild(this.createPlayerPanel(2));

        const startBtn = document.createElement('button');
        startBtn.id = 'peppa-char-start-btn';
        startBtn.textContent = 'Start Game!';
        startBtn.disabled = true;
        startBtn.style.cssText = `
            padding: 16px 52px; font-size: 24px; font-weight: bold; color: white;
            background: #555; border: none; border-radius: 12px; cursor: not-allowed;
            transition: all 0.25s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.4); opacity: 0.55;
        `;
        startBtn.addEventListener('click', () => {
            if (this.p1Character && this.p2Character) this.confirmCharacters();
        });

        const backBtn = document.createElement('button');
        backBtn.textContent = '← Back';
        backBtn.style.cssText = `
            margin-top: 14px; padding: 10px 28px; font-size: 16px; color: rgba(255,255,255,0.75);
            background: transparent; border: 2px solid rgba(255,255,255,0.3); border-radius: 8px;
            cursor: pointer; transition: all 0.2s ease;
        `;
        backBtn.addEventListener('mouseover', () => { backBtn.style.borderColor = 'white'; backBtn.style.color = 'white'; });
        backBtn.addEventListener('mouseout',  () => { backBtn.style.borderColor = 'rgba(255,255,255,0.3)'; backBtn.style.color = 'rgba(255,255,255,0.75)'; });
        backBtn.addEventListener('click', () => {
            this.p1Character = null;
            this.p2Character = null;
            this.fadeOut('peppa-char-select-wrapper', () => this.createWelcomeScreen());
        });

        wrapper.appendChild(title);
        wrapper.appendChild(panels);
        wrapper.appendChild(startBtn);
        wrapper.appendChild(backBtn);
        this.getContainer().appendChild(wrapper);
    }

    createPlayerPanel(playerNum) {
        const color = playerNum === 1 ? '#4fc3f7' : '#ef9a9a';

        const panel = document.createElement('div');
        panel.style.cssText = `display: flex; flex-direction: column; align-items: center; gap: 14px;`;

        const label = document.createElement('div');
        label.textContent = `Player ${playerNum}`;
        label.style.cssText = `
            font-size: 24px; font-weight: bold; color: ${color};
            text-shadow: 1px 1px 4px rgba(0,0,0,0.6); margin-bottom: 6px;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `display: grid; grid-template-columns: 1fr 1fr; gap: 14px;`;

        for (const char of CHARACTERS) {
            grid.appendChild(this.createCharCard(char, playerNum, color));
        }

        panel.appendChild(label);
        panel.appendChild(grid);
        return panel;
    }

    createCharCard(char, playerNum, accentColor) {
        const card = document.createElement('div');
        card.id = `peppa-char-p${playerNum}-${char.id}`;
        card.style.cssText = `
            width: 114px; height: 136px; border-radius: 12px; cursor: pointer;
            background: rgba(255,255,255,0.07); border: 3px solid rgba(255,255,255,0.18);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: all 0.2s ease; padding: 8px; box-sizing: border-box;
        `;

        const img = document.createElement('img');
        img.src = this.getImagePath(char.image);
        img.alt = char.name;
        img.style.cssText = `width: 70px; height: 70px; object-fit: contain; image-rendering: pixelated;`;
        img.onerror = () => { img.style.display = 'none'; };

        const name = document.createElement('div');
        name.textContent = char.name;
        name.style.cssText = `
            font-size: 12px; color: white; text-align: center; margin-top: 8px;
            font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); line-height: 1.3;
        `;

        card.appendChild(img);
        card.appendChild(name);

        const isSelected = () => (playerNum === 1 ? this.p1Character : this.p2Character)?.id === char.id;

        card.addEventListener('mouseover', () => {
            if (!isSelected()) { card.style.background = 'rgba(255,255,255,0.16)'; card.style.transform = 'scale(1.06)'; }
        });
        card.addEventListener('mouseout', () => {
            if (!isSelected()) { card.style.background = 'rgba(255,255,255,0.07)'; card.style.transform = 'scale(1)'; }
        });
        card.addEventListener('click', () => this.selectCharacter(char, playerNum, accentColor));

        return card;
    }

    selectCharacter(char, playerNum, accentColor) {
        const prevChar = playerNum === 1 ? this.p1Character : this.p2Character;

        // Deselect previous card for this player
        if (prevChar) {
            const prev = document.getElementById(`peppa-char-p${playerNum}-${prevChar.id}`);
            if (prev) {
                prev.style.border = '3px solid rgba(255,255,255,0.18)';
                prev.style.background = 'rgba(255,255,255,0.07)';
                prev.style.transform = 'scale(1)';
                prev.style.boxShadow = 'none';
            }
        }

        if (playerNum === 1) this.p1Character = char;
        else                  this.p2Character = char;

        const card = document.getElementById(`peppa-char-p${playerNum}-${char.id}`);
        if (card) {
            card.style.border    = `3px solid ${accentColor}`;
            card.style.background = playerNum === 1 ? 'rgba(79,195,247,0.22)' : 'rgba(239,154,154,0.22)';
            card.style.transform  = 'scale(1.07)';
            card.style.boxShadow  = `0 0 16px ${accentColor}`;
        }

        this.refreshStartButton();
    }

    refreshStartButton() {
        const btn = document.getElementById('peppa-char-start-btn');
        if (!btn) return;

        if (this.p1Character && this.p2Character) {
            btn.disabled = false;
            btn.style.background    = '#4CAF50';
            btn.style.cursor        = 'pointer';
            btn.style.opacity       = '1';
            btn.onmouseover = () => { btn.style.background = '#45a049'; btn.style.transform = 'scale(1.05)'; };
            btn.onmouseout  = () => { btn.style.background = '#4CAF50'; btn.style.transform = 'scale(1)';    };
        }
    }

    confirmCharacters() {
        localStorage.setItem('peppaPlayer1CharImage', this.p1Character.image);
        localStorage.setItem('peppaPlayer1CharName',  this.p1Character.name);
        localStorage.setItem('peppaPlayer2CharImage', this.p2Character.image);
        localStorage.setItem('peppaPlayer2CharName',  this.p2Character.name);
        this.fadeOut('peppa-char-select-wrapper', () => this.startGame());
    }

    // ─── Game Transition ─────────────────────────────────────────────────────

    startGame() {
        const ctrl = this.gameEnv?.gameControl;
        if (ctrl && ctrl.currentLevel) {
            ctrl.currentLevel.continue = false;
        }
    }

    // ─── Level interface ──────────────────────────────────────────────────────

    update() {}
    draw()   {}

    destroy() {
        document.getElementById('peppa-welcome-wrapper')?.remove();
        document.getElementById('peppa-char-select-wrapper')?.remove();
        document.getElementById('peppa-welcome-styles')?.remove();
    }
}

export default PeppaWelcomeScreen;
