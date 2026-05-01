/**
 * AiNpc.js - Reusable AI-powered NPC conversation system
 *
 * Provides common behaviors for conversational NPCs powered by backend Gemini API.
 * Works with DialogueSystem.js for UI display.
 *
 * USAGE (standard NPC):
 * - Call AiNpc.showInteraction(npcInstance) in your NPC's interact() method
 * - Requires spriteData properties: expertise, chatHistory, dialogues, knowledgeBase
 * - DialogueSystem cycles through dialogues array sequentially on each interaction
 *
 * USAGE (pre-level briefing):
 * - Call AiNpc.showLevelBriefing({ spriteData, gameControl, onStart })
 * - Shows the NPC's intro dialogue with chat UI and a "Start Level" button
 * - onStart callback fires when the player clicks "Start Level"
 *
 * BACKEND API:
 * - POST /api/ainpc/prompt   - Send message to NPC, get response
 * - POST /api/ainpc/greeting - Get NPC greeting and reset conversation
 * - POST /api/ainpc/reset    - Clear conversation history
 * - GET  /api/ainpc/test     - Test API availability
 */

import DialogueSystem from './DialogueSystem.js';
import { pythonURI, fetchOptions } from '../../api/config.js';

class AiNpc {
    /**
     * Main entry point - Shows full AI interaction dialog for an NPC
     * Creates DialogueSystem with NPC's dialogues and uses cycling behavior
     * @param {Object} npcInstance - The NPC instance (with this.spriteData, this.gameControl)
     */
    static showInteraction(npcInstance) {
        AiNpc._injectStyles();
        const npc = npcInstance;
        const data = npc.spriteData;

        // Close any existing dialogue
        if (npc.dialogueSystem?.isDialogueOpen()) {
            npc.dialogueSystem.closeDialogue();
        }

        // Initialize DialogueSystem if needed with NPC's dialogues
        if (!npc.dialogueSystem) {
            npc.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues || [data.greeting || "Hello!"],
                gameControl: npc.gameControl
            });
        }

        // Use DialogueSystem's cycling showRandomDialogue method
        npc.dialogueSystem.showRandomDialogue(data.id, data.src, data);

        // Create and attach AI chat UI
        const ui = AiNpc.createChatUI(data);
        AiNpc.attachEventHandlers(npc, data, ui);
        AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);
    }

    /**
     * Show a pre-level briefing with AI chat + a "Start Level" button.
     * Convenience wrapper around showInteraction() for use BEFORE gameplay begins.
     *
     * @param {Object} config
     * @param {Object} config.spriteData - { id, src, expertise, chatHistory, dialogues, knowledgeBase, ... }
     * @param {Object} [config.gameControl] - GameControl reference (for pause/resume)
     * @param {Function} [config.onStart] - Called when player clicks "Start Level"
     * @param {string}  [config.startButtonText] - Label for the start button (default: "▶  Start Level")
     * @returns {Object} The virtual NPC instance (has .dialogueSystem you can inspect)
     */
    static showLevelBriefing(config) {
        AiNpc._injectStyles();

        const {
            spriteData,
            gameControl = null,
            onStart = () => {},
            startButtonText = '▶  Start Level'
        } = config;

        // Ensure required fields exist
        spriteData.chatHistory = spriteData.chatHistory || [];
        spriteData.knowledgeBase = spriteData.knowledgeBase || {};
        spriteData.dialogues = spriteData.dialogues || [spriteData.greeting || "Hello!"];

        // Build a virtual NPC instance and show the standard AI interaction
        const virtualNpc = { spriteData, gameControl };
        AiNpc.showInteraction(virtualNpc);

        // Inject a "Start Level" button into the dialogue box, just above the close button
        const dialogueSystem = virtualNpc.dialogueSystem;
        const dialogueBox = document.getElementById('custom-dialogue-box-' + dialogueSystem.safeId);
        const closeBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);

        if (dialogueBox) {
            // Remove any previous start button
            dialogueBox.querySelectorAll('.ai-npc-start-btn').forEach(b => b.remove());

            const startBtn = document.createElement('button');
            startBtn.textContent = startButtonText;
            startBtn.className = 'ai-npc-start-btn';

            startBtn.onclick = () => {
                // Close the dialogue (resumes game if it was paused)
                if (dialogueSystem.isDialogueOpen()) {
                    dialogueSystem.closeDialogue();
                }
                // Fire the user's start callback
                try { onStart(); } catch (e) { console.error('Level briefing onStart error:', e); }
            };

            if (closeBtn && closeBtn.parentNode === dialogueBox) {
                dialogueBox.insertBefore(startBtn, closeBtn);
            } else {
                dialogueBox.appendChild(startBtn);
            }

            // Hide the default "Close" button — Start Level is the only way forward for briefings
            if (closeBtn) closeBtn.style.display = 'none';
        }

        return virtualNpc;
    }

    /**
     * Create the AI chat UI (input field, buttons, response area)
     * @param {Object} spriteData - The NPC sprite data
     * @returns {Object} UI elements { container, inputField, historyBtn, responseArea }
     */
    static createChatUI(spriteData) {
        const container = document.createElement('div');
        container.className = 'ai-npc-container';

        const inputField = document.createElement('textarea');
        inputField.className = 'ai-npc-input';

        // Use a random question from knowledgeBase as placeholder hint, or fall back to generic
        let placeholder = `Ask about ${spriteData.expertise}...`;
        const topics = spriteData.knowledgeBase?.[spriteData.expertise] || [];
        if (topics.length > 0) {
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            placeholder = randomTopic.question;
        }
        inputField.placeholder = placeholder;
        inputField.rows = 2;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'ai-npc-button-row';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 Chat History';
        historyBtn.className = 'ai-npc-history-btn';

        const responseArea = document.createElement('div');
        responseArea.className = 'ai-npc-response-area';
        responseArea.style.display = 'none'; // Keep this one for show/hide logic

        buttonRow.appendChild(historyBtn);
        container.appendChild(inputField);
        container.appendChild(buttonRow);
        container.appendChild(responseArea);

        return { container, inputField, historyBtn, responseArea };
    }

    /**
     * Attach event handlers to UI elements
     * @param {Object} npcInstance - The NPC instance
     * @param {Object} spriteData - The NPC sprite data
     * @param {Object} ui - UI elements from createChatUI
     */
    static attachEventHandlers(npcInstance, spriteData, ui) {
        const { inputField, historyBtn, responseArea } = ui;

        // History button
        historyBtn.onclick = () => AiNpc.showChatHistory(spriteData);

        // Send message function
        const sendMessage = async () => {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;
            inputField.value = '';
            await AiNpc.sendPromptToBackend(spriteData, userMessage, responseArea);
        };

        // Prevent game input while typing
        AiNpc.preventGameInput(inputField);

        // Handle Enter key (Shift+Enter for new line, Enter to send)
        inputField.onkeypress = e => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };

        // Auto-focus input field
        setTimeout(() => inputField.focus(), 100);
    }

    /**
     * Attach UI container to DialogueSystem dialogue box
     * @param {DialogueSystem} dialogueSystem - The dialogue system instance
     * @param {HTMLElement} container - The UI container to attach
     */
    static attachToDialogue(dialogueSystem, container) {
        const dialogueBox = document.getElementById('custom-dialogue-box-' + dialogueSystem.safeId);
        if (dialogueBox) {
            // Remove any existing AI NPC containers first
            const existingContainers = dialogueBox.querySelectorAll('.ai-npc-container');
            existingContainers.forEach(existing => existing.remove());

            // Find the close button using its specific ID
            const closeBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);
            if (closeBtn && closeBtn.parentNode === dialogueBox) {
                dialogueBox.insertBefore(container, closeBtn);
            } else {
                dialogueBox.appendChild(container);
            }
        }
    }

    /**
     * Send user prompt to backend API and display response.
     * If the backend fails (network error, 4xx, 5xx, or empty response),
     * falls back to a local keyword-matched answer from the knowledgeBase.
     * @param {Object} spriteData - The NPC sprite data
     * @param {string} userMessage - User's message
     * @param {HTMLElement} responseArea - Response display element
     */
    static async sendPromptToBackend(spriteData, userMessage, responseArea) {
        spriteData.chatHistory.push({ role: 'user', message: userMessage });

        responseArea.textContent = 'Thinking...';
        responseArea.style.display = 'block';

        // Try backend first
        const backendResult = await AiNpc._tryBackend(spriteData, userMessage);

        if (backendResult.ok) {
            spriteData.chatHistory.push({ role: 'ai', message: backendResult.answer });
            AiNpc.showResponse(backendResult.answer, responseArea);
            return;
        }

        // Backend failed — log why, then try local fallback
        console.warn(
            `[AiNpc] Backend unavailable (${backendResult.reason}). ` +
            `Falling back to local knowledgeBase. Details:`, backendResult.detail
        );

        const localAnswer = AiNpc._findLocalAnswer(userMessage, spriteData);
        if (localAnswer) {
            const prefixed = `💡 (offline) ${localAnswer}`;
            spriteData.chatHistory.push({ role: 'ai', message: prefixed });
            AiNpc.showResponse(prefixed, responseArea);
            return;
        }

        // No backend, no local match — last-resort message
        const fallback = "Hmm, I can't reach my knowledge base right now and I don't have an offline answer for that question. Try asking about how to move, how to beat the level, or how to collect coins!";
        spriteData.chatHistory.push({ role: 'ai', message: fallback });
        AiNpc.showResponse(fallback, responseArea);
    }

    /**
     * Try the Python backend. Returns { ok, answer } on success,
     * { ok: false, reason, detail } on failure. Never throws.
     */
    static async _tryBackend(spriteData, userMessage) {
        try {
            let knowledgeContext = '';
            const topics = spriteData.knowledgeBase?.[spriteData.expertise] || [];
            if (topics.length > 0) {
                knowledgeContext = 'Here are some example topics I can help with:\n';
                topics.slice(0, 3).forEach(t => {
                    knowledgeContext += `- ${t.question}\n`;
                });
                knowledgeContext += '\n';
            }

            const sessionId = `player-${spriteData.id}`;
            const pythonURL = pythonURI + '/api/ainpc/prompt';

            const response = await fetch(pythonURL, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({
                    prompt:           userMessage,
                    session_id:       sessionId,
                    npc_type:         spriteData.expertise,
                    expertise:        spriteData.expertise,
                    knowledgeContext: knowledgeContext
                })
            });

            if (!response.ok) {
                return {
                    ok: false,
                    reason: `HTTP ${response.status}`,
                    detail: { url: pythonURL, status: response.status, statusText: response.statusText }
                };
            }

            let data;
            try {
                data = await response.json();
            } catch (parseErr) {
                return { ok: false, reason: 'invalid JSON from backend', detail: parseErr };
            }

            if (data?.status === 'error') {
                return { ok: false, reason: 'backend returned error status', detail: data };
            }

            const aiResponse = data?.response;
            if (!aiResponse || typeof aiResponse !== 'string') {
                return { ok: false, reason: 'empty/invalid response field', detail: data };
            }

            return { ok: true, answer: aiResponse };

        } catch (err) {
            return {
                ok: false,
                reason: 'network/fetch error (CORS? endpoint down? wrong URL?)',
                detail: err
            };
        }
    }

    /**
     * Look up a canned answer from the NPC's knowledgeBase using simple
     * keyword overlap. Expects knowledgeBase entries shaped like
     *   { question: "How do I move?", answer: "Use W to go up..." }
     * Returns the best-matching answer string, or null if no good match.
     */
    static _findLocalAnswer(userMessage, spriteData) {
        const topics = spriteData.knowledgeBase?.[spriteData.expertise] || [];
        if (topics.length === 0) return null;

        const userWords = AiNpc._extractWords(userMessage);
        if (userWords.length === 0) return null;

        let bestScore = 0;
        let bestAnswer = null;

        for (const topic of topics) {
            if (!topic.question || !topic.answer) continue;
            const topicWords = AiNpc._extractWords(topic.question);
            if (topicWords.length === 0) continue;

            // Count shared meaningful words
            let shared = 0;
            for (const w of userWords) {
                if (topicWords.includes(w)) shared++;
            }

            // Score normalized by the shorter set's length — prevents
            // long user messages from dominating short topic questions
            const score = shared / Math.min(userWords.length, topicWords.length);

            if (score > bestScore) {
                bestScore  = score;
                bestAnswer = topic.answer;
            }
        }

        // Require at least 30% word overlap for a confident local answer
        return bestScore >= 0.3 ? bestAnswer : null;
    }

    /**
     * Tokenize a string into meaningful lowercase words for keyword matching.
     * Strips stopwords that carry no signal ("how", "do", "i", etc.)
     */
    static _extractWords(str) {
        const STOP = new Set([
            'how','do','i','is','the','a','an','to','and','or','of','in','on',
            'at','for','with','what','where','when','why','can','does','this',
            'that','it','you','me','my','we','are','was','be','been','being',
            'if','else','then','as','by','from','into','so','but','not','no',
            'have','has','had','will','would','should','could','there','these',
            'those','which','who','whom','whose'
        ]);
        return String(str).toLowerCase()
            .replace(/[^a-z0-9 ]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 1 && !STOP.has(w));
    }

    /**
     * Display response with typewriter effect
     * @param {string} text - Text to display
     * @param {HTMLElement} element - Element to display in
     * @param {number} speed - Typing speed in ms
     */
    static showResponse(text, element, speed = 30) {
        element.textContent = '';
        element.style.display = 'block';
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index++);
                setTimeout(type, speed);
            }
        };
        type();
    }

    /**
     * Prevent keyboard events from propagating to game
     * @param {HTMLElement} element - Input element to protect
     */
    static preventGameInput(element) {
        ['keydown', 'keyup', 'keypress'].forEach(eventType => {
            element.addEventListener(eventType, e => e.stopPropagation());
        });
    }

    /**
     * Show chat history in modal dialog
     * @param {Object} spriteData - The NPC sprite data
     */
    static showChatHistory(spriteData) {
        const modal = document.createElement('div');
        modal.className = 'ai-npc-modal';

        const title = document.createElement('h3');
        title.textContent = 'Chat History';
        title.className = 'ai-npc-modal-title';
        modal.appendChild(title);

        if (!spriteData.chatHistory || spriteData.chatHistory.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'ai-message';
            empty.textContent = 'No messages yet. Ask me a question!';
            modal.appendChild(empty);
        } else {
            spriteData.chatHistory.forEach(msg => {
                const div = document.createElement('div');
                div.className = msg.role === 'user' ? 'user-message' : 'ai-message';
                div.textContent = msg.message;
                modal.appendChild(div);
            });
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'ai-npc-close-btn';
        closeBtn.onclick = () => modal.remove();

        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }

    /**
     * Test backend API availability
     * @returns {Promise<boolean>} True if API is available
     */
    static async testAPI() {
        try {
            const response = await fetch(pythonURI + '/api/ainpc/test', {
                ...fetchOptions,
                method: 'GET'
            });
            const data = await response.json();
            return data.status === 'ok';
        } catch (err) {
            console.error('AI NPC API test failed:', err);
            return false;
        }
    }

    /**
     * Reset conversation history for a session
     * @param {string} sessionId - Session ID to reset
     */
    static async resetConversation(sessionId) {
        try {
            await fetch(pythonURI + '/api/ainpc/reset', {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ session_id: sessionId })
            });
        } catch (err) {
            console.error('Failed to reset conversation:', err);
        }
    }

    /**
     * Inject default CSS for AI NPC UI. Safe to call multiple times.
     * @private
     */
    static _injectStyles() {
        if (document.getElementById('ai-npc-styles')) return;

        const style = document.createElement('style');
        style.id = 'ai-npc-styles';
        style.textContent = `
            .ai-npc-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 10px;
                width: 100%;
                box-sizing: border-box;
            }
            .ai-npc-input {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 10px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 11px;
                line-height: 1.6;
                color: #ffffff;
                background: rgba(0, 0, 0, 0.55);
                border: 2px solid #6cc6ff;
                border-radius: 6px;
                outline: none;
                resize: vertical;
            }
            .ai-npc-input::placeholder {
                color: rgba(200, 220, 255, 0.55);
            }
            .ai-npc-input:focus {
                border-color: #ffe066;
                box-shadow: 0 0 8px rgba(255, 224, 102, 0.6);
            }
            .ai-npc-button-row {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }
            .ai-npc-history-btn {
                padding: 6px 12px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 10px;
                color: #ffffff;
                background: #2a6fb0;
                border: 2px solid #6cc6ff;
                border-radius: 5px;
                cursor: pointer;
            }
            .ai-npc-history-btn:hover {
                background: #3784cc;
            }
            .ai-npc-response-area {
                margin-top: 6px;
                padding: 10px 12px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 11px;
                line-height: 1.7;
                color: #e8f4ff;
                background: rgba(10, 25, 45, 0.85);
                border: 2px solid #6cc6ff;
                border-radius: 6px;
                max-height: 180px;
                overflow-y: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
                text-align: left;
            }
            .ai-npc-start-btn {
                margin-top: 10px;
                margin-right: 8px;
                padding: 10px 22px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 12px;
                color: #ffffff;
                background: #4CAF50;
                border: 2px solid #7fe38a;
                border-radius: 6px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(127, 227, 138, 0.5);
            }
            .ai-npc-start-btn:hover {
                background: #5cc060;
                transform: scale(1.03);
            }
            /* Chat history modal */
            .ai-npc-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: min(90%, 520px);
                max-height: 70vh;
                overflow-y: auto;
                padding: 20px 22px;
                background: #0d1b2a;
                border: 2px solid #6cc6ff;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                z-index: 10001;
                font-family: 'Press Start 2P', cursive, monospace;
                color: #e8f4ff;
            }
            .ai-npc-modal-title {
                margin: 0 0 14px 0;
                font-size: 16px;
                color: #ffe066;
                text-align: center;
            }
            .ai-npc-modal .user-message,
            .ai-npc-modal .ai-message {
                padding: 8px 12px;
                margin-bottom: 8px;
                border-radius: 6px;
                font-size: 11px;
                line-height: 1.7;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .ai-npc-modal .user-message {
                background: rgba(76, 175, 80, 0.18);
                border-left: 3px solid #7fe38a;
                text-align: right;
            }
            .ai-npc-modal .ai-message {
                background: rgba(108, 198, 255, 0.15);
                border-left: 3px solid #6cc6ff;
                text-align: left;
            }
            .ai-npc-close-btn {
                display: block;
                margin: 14px auto 0 auto;
                padding: 8px 20px;
                font-family: 'Press Start 2P', cursive, monospace;
                font-size: 11px;
                color: #ffffff;
                background: #c0392b;
                border: 2px solid #e67260;
                border-radius: 5px;
                cursor: pointer;
            }
            .ai-npc-close-btn:hover {
                background: #e34a3a;
            }
            /* Make the DialogueSystem box look consistent with the chat UI and
               float above all level overlays (Zone Catch canvas, fog, etc.) */
            [id^="custom-dialogue-box-"] {
                background: linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%) !important;
                border: 2px solid #6cc6ff !important;
                box-shadow: 0 0 20px rgba(108, 198, 255, 0.4), inset 0 0 10px rgba(108, 198, 255, 0.15) !important;
                color: #e8f4ff !important;
                min-width: 420px;
                max-width: min(90vw, 640px) !important;
                z-index: 10500 !important;
            }
            [id^="dialogue-speaker-"] {
                color: #ffe066 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

export default AiNpc;
