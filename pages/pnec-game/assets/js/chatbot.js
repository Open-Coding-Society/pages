/**
 * chatbot.js — Anthropic API integration and chat UI for the PNEC Preparedness Explorer
 *
 * ─── SETUP GUIDE ────────────────────────────────────────────────────────────
 *
 * Option A — Direct API key (development / demo only):
 *   Set CONFIG.API_KEY below, OR pass via URL: /pnec-game/?key=sk-ant-...
 *   ⚠️  NEVER commit a real API key to git. Use this only for local testing.
 *
 * Option B — Server-side proxy (RECOMMENDED for production):
 *   1. Build a small endpoint (Flask/Express/etc.) at CONFIG.PROXY_URL
 *   2. Your server holds the key and forwards requests to Anthropic
 *   3. Example BB_Flask route:  POST /api/pnec-chat
 *      Body: { stationId, messages }  → returns { content: "..." }
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

const CONFIG = {
    // Your Anthropic API key — leave blank and use PROXY_URL instead for prod
    API_KEY: '',

    // Server-side proxy URL (set this for production to keep your key safe)
    // Example: '/api/pnec-chat'
    PROXY_URL: '',

    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 1024,
};

// Allow passing API key via URL parameter for quick local testing
// Usage: /pnec-game/?key=sk-ant-...
const _urlKey = new URLSearchParams(window.location.search).get('key');
if (_urlKey) CONFIG.API_KEY = _urlKey;

// ─────────────────────────────────────────────────────────────────────────────

class ChatBot {
    /**
     * @param {Object} station   - Station config object from stations.js
     * @param {Function} onClose - Callback fired when the panel is dismissed
     */
    constructor(station, onClose) {
        this.station = station;
        this.onClose = onClose;

        // Conversation history sent to the API with every request
        this.messages = [];

        this.isTyping = false;
        this.panel = null;
        this.messagesEl = null;
        this.inputEl = null;
        this.sendBtn = null;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    open() {
        this._buildPanel();
        this._addWelcomeMessage();

        // Slide in after the next paint so the transition fires
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.panel?.classList.add('chat-panel--visible');
            });
        });

        // Focus the textarea once the transition settles
        setTimeout(() => this.inputEl?.focus(), 350);
    }

    close() {
        if (!this.panel) return;

        this.panel.classList.remove('chat-panel--visible');
        this.panel.addEventListener('transitionend', () => {
            this.panel?.remove();
            this.panel = null;
        }, { once: true });

        this.onClose?.();
    }

    // ── Panel Construction ────────────────────────────────────────────────────

    _buildPanel() {
        // Remove any stale panel from a previous interaction
        document.getElementById('pnec-chat-panel')?.remove();

        this.panel = document.createElement('div');
        this.panel.id = 'pnec-chat-panel';
        this.panel.className = 'chat-panel';
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-label', `${this.station.name} — PNEC Expert Chat`);

        this.panel.innerHTML = `
            <div class="chat-header">
                <div class="chat-header__left">
                    <span class="chat-header__icon" style="color:${this.station.color}">${this.station.icon}</span>
                    <div class="chat-header__meta">
                        <div class="chat-header__title">${this.station.name}</div>
                        <div class="chat-header__sub">PNEC Preparedness Expert · AI-powered</div>
                    </div>
                </div>
                <button class="chat-close-btn" id="chat-close-btn" title="Close (Esc)" aria-label="Close chat">✕</button>
            </div>

            <div class="chat-messages" id="chat-messages" aria-live="polite" aria-atomic="false"></div>

            <div class="chat-typing" id="chat-typing">
                <div class="chat-typing__dots"><span></span><span></span><span></span></div>
                <span>Expert is thinking…</span>
            </div>

            <div class="chat-input-area">
                <textarea
                    class="chat-input"
                    id="chat-input"
                    placeholder="Ask about ${this.station.name.toLowerCase()}…"
                    rows="2"
                    aria-label="Your question"
                    maxlength="500"
                ></textarea>
                <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message" title="Send (Enter)">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>

            <div class="chat-disclaimer">
                🚨 For real emergencies always call <strong>911</strong> first.
                AI responses are educational only.
            </div>
        `;

        // Attach to game container so it overlays the canvas
        document.getElementById('pnec-game-container').appendChild(this.panel);

        // Cache DOM references
        this.messagesEl = this.panel.querySelector('#chat-messages');
        this.inputEl    = this.panel.querySelector('#chat-input');
        this.sendBtn    = this.panel.querySelector('#chat-send-btn');

        // Wire events
        this.panel.querySelector('#chat-close-btn')
            .addEventListener('click', () => this.close());

        this.sendBtn.addEventListener('click', () => this._handleSend());

        this.inputEl.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSend();
            }
        });
    }

    _addWelcomeMessage() {
        const welcomes = {
            'emergency-kit':
                `Hi! I'm Alex, your Emergency Kit Specialist 🎒\n\nAsk me anything about building your 72-hour go-bag — what to pack, how to store it, and how to prepare every member of your household (including pets!).`,
            'earthquake':
                `Hello! I'm Jordan, your Earthquake Preparedness guide 🌍\n\nGot questions about Drop, Cover, and Hold On? Want to know how to strap down your water heater or use ShakeAlert? I'm here to help Poway stay safe!`,
            'wildfire':
                `Hey there! I'm Sam, your Wildfire Safety expert 🔥\n\nPoway is in a Very High Fire Hazard Zone — this is critical knowledge. Ask me about evacuation zones, defensible space, AlertSanDiego sign-up, or how to harden your home against embers.`,
            'first-aid':
                `Hi! I'm Casey, your First Aid guide 🏥\n\nI can walk you through CPR basics, bleeding control, choking response, and knowing when to call 911. Remember: for any real emergency, **call 911 first**, then provide aid.`,
            'communication':
                `Hello! I'm Morgan, your Emergency Communications expert 📡\n\nI can help you set up AlertSanDiego, build a family communication plan, understand PNEC's neighborhood check-in system, and more. Let's make sure your family can connect when it matters most.`,
        };

        const text = welcomes[this.station.id]
            ?? `Welcome to the ${this.station.name}! Ask me anything about emergency preparedness.`;

        this._addBubble('assistant', text, /* animate */ false);
    }

    // ── Send / Receive ────────────────────────────────────────────────────────

    async _handleSend() {
        const text = this.inputEl?.value.trim();
        if (!text || this.isTyping) return;

        this.inputEl.value = '';
        this._addBubble('user', text);
        this.messages.push({ role: 'user', content: text });

        await this._fetchReply();
    }

    async _fetchReply() {
        this._setTyping(true);

        try {
            const reply = await this._callAPI();
            this.messages.push({ role: 'assistant', content: reply });
            this._addBubble('assistant', reply);
        } catch (err) {
            console.error('[PNEC ChatBot]', err);
            this._addBubble('assistant', this._errorMessage(err), false, /* isError */ true);
        } finally {
            this._setTyping(false);
        }
    }

    async _callAPI() {
        // ── Option B: server-side proxy ────────────────────────────────────
        if (CONFIG.PROXY_URL) {
            const res = await fetch(CONFIG.PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stationId:    this.station.id,
                    systemPrompt: this.station.systemPrompt,
                    messages:     this.messages,
                }),
            });
            if (!res.ok) throw new Error(`proxy_${res.status}`);
            const data = await res.json();
            return data.content;
        }

        // ── Option A: direct Anthropic API ────────────────────────────────
        if (!CONFIG.API_KEY) throw new Error('no_key');

        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type':                          'application/json',
                'x-api-key':                             CONFIG.API_KEY,
                'anthropic-version':                     '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model:      CONFIG.MODEL,
                max_tokens: CONFIG.MAX_TOKENS,
                system:     this.station.systemPrompt,
                messages:   this.messages,
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message ?? `api_${res.status}`);
        }

        const data = await res.json();
        return data.content[0].text;
    }

    _errorMessage(err) {
        if (err.message === 'no_key') {
            return `⚠️ **No API key configured.**\n\nTo enable AI responses, add your Anthropic API key to the URL:\n\`/pnec-game/?key=sk-ant-...\`\n\nOr ask a developer to configure the server-side proxy in chatbot.js.\n\nFor official preparedness resources, visit **poway.org** or contact PNEC directly.`;
        }
        return `Sorry — I had trouble connecting right now. Please try again in a moment.\n\nFor official resources visit **poway.org**, or call PNEC. For real emergencies, **always call 911**.`;
    }

    // ── DOM Helpers ───────────────────────────────────────────────────────────

    /**
     * Append a chat bubble to the message list.
     * Supports **bold** markdown and newlines.
     */
    _addBubble(role, text, animate = true, isError = false) {
        if (!this.messagesEl) return;

        const bubble = document.createElement('div');
        bubble.className = [
            'chat-bubble',
            `chat-bubble--${role}`,
            isError  ? 'chat-bubble--error'   : '',
            animate  ? 'chat-bubble--animate'  : '',
        ].filter(Boolean).join(' ');

        // Minimal markdown: **bold**, newlines → <br>
        const html = text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        bubble.innerHTML = `
            ${role === 'assistant'
                ? `<span class="chat-bubble__avatar" aria-hidden="true">${this.station.icon}</span>`
                : ''}
            <div class="chat-bubble__text">${html}</div>
        `;

        this.messagesEl.appendChild(bubble);

        // Keep scroll pinned to bottom
        requestAnimationFrame(() => {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        });
    }

    _setTyping(active) {
        this.isTyping = active;

        const el = this.panel?.querySelector('#chat-typing');
        if (el) el.classList.toggle('chat-typing--visible', active);

        if (this.sendBtn) this.sendBtn.disabled = active;
        if (this.inputEl) this.inputEl.disabled = active;

        if (active && this.messagesEl) {
            requestAnimationFrame(() => {
                this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
            });
        }
    }
}

export { ChatBot, CONFIG };
