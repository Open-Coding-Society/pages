class WheelOfFortuneGameManager {
    constructor(gameEnv, options = {}) {
        this.gameEnv = gameEnv;
        this.phraseBank = this.normalizePhraseBank(options.phraseBank);
        this.phrase = this.normalizePhrase(options.phrase || this.pickPhraseFromBank(this.phraseBank));
        this.category = options.category || "Mansion Mystery";
        this.onWin = options.onWin || (() => {});
        this.overlay = null;
        this.gameActive = false;
        this.coins = 500;
        this.vowelCost = 250;
        this.currentSpinValue = null;
        this.guessedLetters = new Set();
        this.solved = false;
        this.wheelSegments = [100, 150, 200, 250, 300, 400, 500, "Lose Turn", "Bankrupt"];
    }

    startGame() {
        if (this.gameActive || this.solved) return;

        this.gameActive = true;
        if (this.gameEnv?.gameControl) {
            this.gameEnv.gameControl.pause();
        }
        this.createOverlay();
        this.render();
    }

    createOverlay() {
        this.overlay = document.createElement("div");
        this.overlay.id = "wheel-of-fortune-overlay";
        this.overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            background: rgba(8, 6, 10, 0.94);
            color: white;
            font-family: Arial, sans-serif;
        `;

        this.overlay.innerHTML = `
            <div style="width: min(980px, 100%); max-height: 94vh; overflow: auto; background: #17131d; border: 3px solid #d6b35f; border-radius: 8px; box-shadow: 0 0 28px rgba(214, 179, 95, 0.45); padding: 22px;">
                <div style="display: flex; justify-content: space-between; gap: 16px; align-items: start; flex-wrap: wrap; margin-bottom: 18px;">
                    <div>
                        <p style="margin: 0 0 6px 0; color: #d6b35f; font-size: 14px; font-weight: 700; text-transform: uppercase;">Level 5 Challenge</p>
                        <h2 style="margin: 0; font-size: 30px;">Mansion Wheel</h2>
                    </div>
                    <button id="wheel-close-btn" style="padding: 10px 14px; border: 0; border-radius: 6px; background: #3c3448; color: white; cursor: pointer;">Exit</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: start;">
                    <div style="background: #211a29; border: 1px solid #6e5931; border-radius: 8px; padding: 18px; text-align: center;">
                        <div id="wheel-display" style="width: 210px; height: 210px; margin: 0 auto 14px auto; border-radius: 50%; border: 10px solid #d6b35f; background: conic-gradient(#7f1d1d 0 40deg, #234f36 40deg 80deg, #1d4f7f 80deg 120deg, #7f6b1d 120deg 160deg, #4b2b6f 160deg 200deg, #6b2b4c 200deg 240deg, #355f2a 240deg 280deg, #513131 280deg 320deg, #222 320deg 360deg); display: grid; place-items: center; transition: transform 0.7s ease-out;">
                            <span id="wheel-result" style="display: inline-block; max-width: 150px; padding: 10px; background: rgba(0,0,0,0.72); border-radius: 6px; font-size: 22px; font-weight: 800;">Spin</span>
                        </div>
                        <button id="wheel-spin-btn" style="width: 100%; padding: 13px; border: 0; border-radius: 6px; background: #d6b35f; color: #20160a; font-size: 18px; font-weight: 800; cursor: pointer;">Spin Wheel</button>
                    </div>

                    <div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px;">
                            <div style="background: #211a29; border-radius: 6px; padding: 10px 14px;">Category: <strong id="wheel-category"></strong></div>
                            <div style="background: #211a29; border-radius: 6px; padding: 10px 14px;">Coins: <strong id="wheel-coins"></strong></div>
                            <div style="background: #211a29; border-radius: 6px; padding: 10px 14px;">Vowels: <strong>$250</strong></div>
                        </div>

                        <div id="wheel-puzzle" style="display: flex; flex-direction: column; align-items: center; gap: 12px; min-height: 120px; padding: 16px; margin-bottom: 14px; background: #0f2f29; border: 3px solid #58a572; border-radius: 8px;"></div>

                        <div id="wheel-message" style="min-height: 44px; margin-bottom: 14px; color: #f2d98b; font-size: 16px; line-height: 1.4;"></div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                            <div style="background: #211a29; border-radius: 8px; padding: 14px;">
                                <label for="wheel-consonant-input" style="display: block; margin-bottom: 8px; font-weight: 700;">Guess a consonant after spinning</label>
                                <div style="display: flex; gap: 8px;">
                                    <input id="wheel-consonant-input" maxlength="1" style="width: 64px; padding: 12px; border-radius: 6px; border: 1px solid #5a5068; background: #110e16; color: white; font-size: 20px; text-align: center; text-transform: uppercase;">
                                    <button id="wheel-consonant-btn" style="flex: 1; padding: 12px; border: 0; border-radius: 6px; background: #5387d6; color: white; font-weight: 800; cursor: pointer;">Guess</button>
                                </div>
                            </div>

                            <div style="background: #211a29; border-radius: 8px; padding: 14px;">
                                <label for="wheel-vowel-input" style="display: block; margin-bottom: 8px; font-weight: 700;">Buy a vowel</label>
                                <div style="display: flex; gap: 8px;">
                                    <input id="wheel-vowel-input" maxlength="1" style="width: 64px; padding: 12px; border-radius: 6px; border: 1px solid #5a5068; background: #110e16; color: white; font-size: 20px; text-align: center; text-transform: uppercase;">
                                    <button id="wheel-vowel-btn" style="flex: 1; padding: 12px; border: 0; border-radius: 6px; background: #8c63c7; color: white; font-weight: 800; cursor: pointer;">Buy</button>
                                </div>
                            </div>
                        </div>

                        <div style="background: #211a29; border-radius: 8px; padding: 14px; margin-top: 12px;">
                            <label for="wheel-solve-input" style="display: block; margin-bottom: 8px; font-weight: 700;">Solve the phrase</label>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <input id="wheel-solve-input" style="flex: 1 1 260px; min-width: 0; padding: 12px; border-radius: 6px; border: 1px solid #5a5068; background: #110e16; color: white; font-size: 18px; text-transform: uppercase;">
                                <button id="wheel-solve-btn" style="padding: 12px 18px; border: 0; border-radius: 6px; background: #58a572; color: #06120b; font-weight: 900; cursor: pointer;">Solve</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        this.bindControls();
    }

    bindControls() {
        this.overlay.addEventListener("keydown", (event) => event.stopPropagation());
        this.overlay.querySelector("#wheel-close-btn").addEventListener("click", () => this.close());
        this.overlay.querySelector("#wheel-spin-btn").addEventListener("click", () => this.spinWheel());
        this.overlay.querySelector("#wheel-consonant-btn").addEventListener("click", () => this.guessConsonant());
        this.overlay.querySelector("#wheel-vowel-btn").addEventListener("click", () => this.buyVowel());
        this.overlay.querySelector("#wheel-solve-btn").addEventListener("click", () => this.solvePhrase());

        this.overlay.querySelector("#wheel-consonant-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.guessConsonant();
        });
        this.overlay.querySelector("#wheel-vowel-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.buyVowel();
        });
        this.overlay.querySelector("#wheel-solve-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.solvePhrase();
        });
    }

    spinWheel() {
        if (this.currentSpinValue !== null) {
            this.setMessage("Use your current spin before spinning again.");
            return;
        }

        const segment = this.wheelSegments[Math.floor(Math.random() * this.wheelSegments.length)];
        const wheel = this.overlay.querySelector("#wheel-display");
        wheel.style.transform = `rotate(${720 + Math.floor(Math.random() * 360)}deg)`;

        if (segment === "Bankrupt") {
            this.coins = 0;
            this.currentSpinValue = null;
            this.setMessage("Bankrupt. Your coins are gone, but you can keep playing.");
        } else if (segment === "Lose Turn") {
            this.currentSpinValue = null;
            this.setMessage("Lose Turn. Spin again and hope for a better result.");
        } else {
            this.currentSpinValue = segment;
            this.setMessage(`You spun $${segment}. Guess one consonant.`);
        }

        this.render();
    }

    guessConsonant() {
        const input = this.overlay.querySelector("#wheel-consonant-input");
        const letter = this.normalizeLetter(input.value);

        if (!this.currentSpinValue) {
            this.setMessage("Spin the wheel before guessing a consonant.");
            return;
        }

        if (!this.isConsonant(letter)) {
            this.setMessage("Enter one unused consonant.");
            return;
        }

        this.applyLetterGuess(letter, this.currentSpinValue);
        this.currentSpinValue = null;
        input.value = "";
        this.render();
    }

    buyVowel() {
        const input = this.overlay.querySelector("#wheel-vowel-input");
        const letter = this.normalizeLetter(input.value);

        if (!this.isVowel(letter)) {
            this.setMessage("Enter one unused vowel.");
            return;
        }

        if (this.coins < this.vowelCost) {
            this.setMessage("You need $250 to buy a vowel. Spin for consonants first.");
            return;
        }

        this.coins -= this.vowelCost;
        this.applyLetterGuess(letter, 0);
        input.value = "";
        this.render();
    }

    solvePhrase() {
        const input = this.overlay.querySelector("#wheel-solve-input");
        const guess = this.normalizePhrase(input.value);

        if (!guess) {
            this.setMessage("Type your solve guess first.");
            return;
        }

        if (guess !== this.normalizePhrase(this.phrase)) {
            this.coins = Math.max(0, this.coins - 100);
            this.setMessage("Not quite. Wrong solves cost $100, so use the board clues.");
            this.render();
            return;
        }

        this.solved = true;
        this.revealPhrase();
        this.setMessage(`Correct. ${this.phrase} is yours.`);
        setTimeout(() => {
            this.close();
            this.onWin();
        }, 900);
    }

    applyLetterGuess(letter, coinValue) {
        if (this.guessedLetters.has(letter)) {
            this.setMessage(`${letter} was already guessed.`);
            return;
        }

        this.guessedLetters.add(letter);
        const count = [...this.phrase].filter((character) => character === letter).length;

        if (count === 0) {
            this.setMessage(`No ${letter}.`);
            return;
        }

        if (coinValue > 0) {
            this.coins += count * coinValue;
            this.setMessage(`${letter} appears ${count} time(s). You earned $${count * coinValue}.`);
        } else {
            this.setMessage(`${letter} appears ${count} time(s).`);
        }
    }

    revealPhrase() {
        for (const character of this.phrase) {
            if (/[A-Z]/.test(character)) {
                this.guessedLetters.add(character);
            }
        }
        this.render();
    }

    render() {
        if (!this.overlay) return;

        this.overlay.querySelector("#wheel-category").textContent = this.category;
        this.overlay.querySelector("#wheel-coins").textContent = `$${this.coins}`;
        this.overlay.querySelector("#wheel-result").textContent = this.currentSpinValue ? `$${this.currentSpinValue}` : "Spin";

        const puzzle = this.overlay.querySelector("#wheel-puzzle");
        puzzle.innerHTML = "";

        for (const word of this.phrase.split(" ")) {
            const wordRow = document.createElement("div");
            wordRow.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
                width: 100%;
            `;

            for (const character of word) {
                const tile = document.createElement("span");
                tile.style.cssText = `
                    width: 38px;
                    height: 46px;
                    display: grid;
                    place-items: center;
                    border-radius: 4px;
                    background: #f4ead1;
                    color: #16120b;
                    font-size: 24px;
                    font-weight: 900;
                `;
                tile.textContent = this.guessedLetters.has(character) ? character : "";
                wordRow.appendChild(tile);
            }

            puzzle.appendChild(wordRow);
        }

        const consonantButton = this.overlay.querySelector("#wheel-consonant-btn");
        consonantButton.disabled = !this.currentSpinValue;
        consonantButton.style.opacity = this.currentSpinValue ? "1" : "0.55";
    }

    setMessage(message) {
        if (!this.overlay) return;
        this.overlay.querySelector("#wheel-message").textContent = message;
    }

    normalizeLetter(value) {
        return String(value || "").trim().toUpperCase().charAt(0);
    }

    normalizePhrase(value) {
        return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
    }

    normalizePhraseBank(phrases) {
        const fallbackPhrases = [
            "SECRET PASSAGE",
            "HIDDEN STAIRCASE",
            "MIRROR CHAMBER",
            "BENEATH THE STAIRS",
            "LOCKED PANEL",
            "DUSTY ARCHWAY"
        ];
        const source = Array.isArray(phrases) && phrases.length ? phrases : fallbackPhrases;

        return source.map((phrase) => this.normalizePhrase(phrase)).filter(Boolean);
    }

    pickPhraseFromBank(phrases) {
        if (!phrases.length) {
            return "SECRET PASSAGE";
        }

        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    isVowel(letter) {
        return /^[AEIOU]$/.test(letter) && !this.guessedLetters.has(letter);
    }

    isConsonant(letter) {
        return /^[A-Z]$/.test(letter) && !/[AEIOU]/.test(letter) && !this.guessedLetters.has(letter);
    }

    close() {
        if (this.overlay?.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.gameActive = false;
        if (this.gameEnv?.gameControl) {
            this.gameEnv.gameControl.resume();
        }
    }

    destroy() {
        this.close();
    }
}

export default WheelOfFortuneGameManager;
