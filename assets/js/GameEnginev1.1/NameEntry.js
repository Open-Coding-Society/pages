/**
 * NameEntry.js - Pre-game name entry modal
 *
 * Shows a modal prompting the user for their display name. Validates:
 *  - Length 2-20 characters
 *  - Only letters, numbers, spaces, underscores, hyphens
 *
 * The allowed-character regex naturally blocks the most problematic input
 * (symbols, HTML markup, URLs, etc.) without maintaining any word list.
 *
 * USAGE:
 *   NameEntry.show(name => { ... save name ... });
 */

const STORAGE_KEY = 'gategame_player_name';

class NameEntry {
    /**
     * Show the name entry modal.
     * @param {Function} onSubmit - called with the validated name string
     */
    static show(onSubmit) {
        console.log('[NameEntry] show() called');
        NameEntry._injectStyles();

        // Remove any existing modal (in case show() is called twice)
        document.getElementById('nameentry-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'nameentry-overlay';
        overlay.innerHTML = `
            <div class="ne-modal">
                <div class="ne-title">🎮 Welcome, Traveler</div>
                <div class="ne-subtitle">What should we call you on the leaderboard?</div>
                <input type="text" id="ne-input" class="ne-input" placeholder="Your name..." maxlength="20" autocomplete="off" />
                <div id="ne-error" class="ne-error"></div>
                <button type="button" id="ne-submit" class="ne-submit">Enter the Gate</button>
                <div class="ne-hint">2-20 characters · letters, numbers, spaces, _ and - only</div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input    = document.getElementById('ne-input');
        const errorEl  = document.getElementById('ne-error');
        const submitBt = document.getElementById('ne-submit');

        if (!input || !errorEl || !submitBt) {
            console.error('[NameEntry] CRITICAL: one or more DOM elements missing. Aborting.');
            return;
        }

        // Stop keyboard events from reaching the game engine
        ['keydown', 'keyup', 'keypress'].forEach(evt => {
            input.addEventListener(evt, e => e.stopPropagation());
        });

        // Auto-focus the input
        setTimeout(() => {
            try { input.focus(); } catch (_) {}
        }, 100);

        const trySubmit = () => {
            const raw = input.value.trim();

            let result;
            try {
                result = NameEntry.validate(raw);
            } catch (err) {
                console.error('[NameEntry] validate() threw:', err);
                result = { ok: false, error: 'Validation error. Check console.' };
            }

            if (!result.ok) {
                errorEl.textContent = result.error;
                errorEl.style.display = 'block';
                input.classList.add('ne-invalid');
                setTimeout(() => input.classList.remove('ne-invalid'), 400);
                return;
            }

            try {
                localStorage.setItem(STORAGE_KEY, result.name);
            } catch (err) {
                console.warn('[NameEntry] localStorage.setItem failed:', err);
            }

            try {
                overlay.remove();
            } catch (err) {
                console.error('[NameEntry] overlay.remove() failed:', err);
            }

            if (typeof onSubmit === 'function') {
                try {
                    onSubmit(result.name);
                } catch (err) {
                    console.error('[NameEntry] onSubmit callback threw:', err);
                }
            }
        };

        // Attach click handler via addEventListener (more robust than onclick)
        submitBt.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            trySubmit();
        });

        // Enter key submits too
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                trySubmit();
            }
        });
    }

    /**
     * Validate a name. Returns { ok: true, name } or { ok: false, error }.
     *
     * Validation is purely structural — length and allowed characters.
     * The allowed-character regex filters HTML markup, URLs, and most
     * problematic input automatically.
     */
    static validate(raw) {
        if (!raw || raw.length === 0) {
            return { ok: false, error: 'Please enter a name.' };
        }
        if (raw.length < 2) {
            return { ok: false, error: 'Name must be at least 2 characters.' };
        }
        if (raw.length > 20) {
            return { ok: false, error: 'Name must be 20 characters or fewer.' };
        }
        if (!/^[A-Za-z0-9 _-]+$/.test(raw)) {
            return { ok: false, error: 'Only letters, numbers, spaces, _ and - are allowed.' };
        }
        return { ok: true, name: raw };
    }

    static getSavedName() {
        try {
            return localStorage.getItem(STORAGE_KEY) || null;
        } catch (_) {
            return null;
        }
    }

    static clearSavedName() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    static _injectStyles() {
        if (document.getElementById('nameentry-styles')) return;
        const style = document.createElement('style');
        style.id = 'nameentry-styles';
        style.textContent = `
            #nameentry-overlay {
                position: fixed !important;
                inset: 0 !important;
                background: rgba(5, 10, 25, 0.85);
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 12000 !important;
                font-family: 'Press Start 2P', cursive, monospace;
                backdrop-filter: blur(4px);
                pointer-events: auto !important;
            }
            #nameentry-overlay * { box-sizing: border-box; }
            #nameentry-overlay .ne-modal {
                width: min(92%, 460px);
                padding: 28px 32px;
                background: linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%);
                border: 2px solid #6cc6ff;
                border-radius: 12px;
                box-shadow: 0 0 40px rgba(108, 198, 255, 0.5),
                            inset 0 0 15px rgba(108, 198, 255, 0.2);
                color: #e8f4ff;
                text-align: center;
                pointer-events: auto !important;
            }
            #nameentry-overlay .ne-title {
                font-size: 20px;
                color: #ffe066;
                margin-bottom: 10px;
            }
            #nameentry-overlay .ne-subtitle {
                font-size: 11px;
                color: rgba(200, 220, 255, 0.8);
                line-height: 1.7;
                margin-bottom: 18px;
            }
            #nameentry-overlay .ne-input {
                width: 100%;
                padding: 12px 14px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 13px;
                color: #ffffff;
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid #6cc6ff;
                border-radius: 6px;
                outline: none;
                text-align: center;
                pointer-events: auto !important;
            }
            #nameentry-overlay .ne-input::placeholder {
                color: rgba(200, 220, 255, 0.45);
            }
            #nameentry-overlay .ne-input:focus {
                border-color: #ffe066;
                box-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
            }
            #nameentry-overlay .ne-input.ne-invalid {
                border-color: #e63946 !important;
                animation: ne-shake 0.4s;
            }
            @keyframes ne-shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
            }
            #nameentry-overlay .ne-error {
                display: none;
                margin-top: 10px;
                font-size: 10px;
                color: #ff9e9e;
            }
            #nameentry-overlay .ne-submit {
                display: block !important;
                width: 100% !important;
                margin-top: 18px !important;
                padding: 12px !important;
                font-family: 'Press Start 2P', cursive, monospace !important;
                font-size: 13px !important;
                color: #ffffff !important;
                background: #4CAF50 !important;
                border: 2px solid #7fe38a !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                box-shadow: 0 0 12px rgba(127, 227, 138, 0.5) !important;
                transition: transform 0.15s !important;
                pointer-events: auto !important;
                opacity: 1 !important;
            }
            #nameentry-overlay .ne-submit:hover {
                background: #5cc060 !important;
                transform: scale(1.02) !important;
            }
            #nameentry-overlay .ne-submit:active {
                transform: scale(0.98) !important;
                background: #3d9e42 !important;
            }
            #nameentry-overlay .ne-hint {
                margin-top: 12px;
                font-size: 9px;
                color: rgba(200, 220, 255, 0.5);
                line-height: 1.6;
            }
        `;
        document.head.appendChild(style);
    }
}

export default NameEntry;
