/**
 * AiNpc-frq.js - FRQ-specific AI-powered NPC conversation system
 *
 * Separate from AiNpc.js so existing NPC flows do not break.
 * Designed for AP CSA FRQ practice hubs.
 */

import DialogueSystem from './DialogueSystem.js';
import { pythonURI, fetchOptions } from '../../api/config.js';

class AiNpcFrq {
    /**
     * Main entry point - Shows full AI interaction dialog for an NPC
     * @param {Object} npcInstance - The NPC instance (with this.spriteData, this.gameControl)
     */
    static showInteraction(npcInstance) {
        const npc = npcInstance;
        const data = npc.spriteData;

        // Close any existing dialogue
        if (npc.dialogueSystem?.isDialogueOpen()) {
            npc.dialogueSystem.closeDialogue();
        }

        // Initialize DialogueSystem if needed
        if (!npc.dialogueSystem) {
            npc.dialogueSystem = new DialogueSystem({
                dialogues: data.dialogues || [data.greeting || "Hello!"],
                gameControl: npc.gameControl
            });
        }

        npc.dialogueSystem.showRandomDialogue(data.id, data.src, data);

        // Create and attach AI chat UI
        const ui = AiNpcFrq.createChatUI(data);
        AiNpcFrq.attachEventHandlers(npc, data, ui);
        AiNpcFrq.attachToDialogue(npc.dialogueSystem, ui.container);

        // Show starter prompt immediately
        const openingPrompt =
            data.lessonData?.starterPrompt ||
            `Write one line of Java code for ${data.lessonData?.title || data.expertise || 'this topic'}.`;

        ui.responseArea.style.display = 'block';
        AiNpcFrq.showResponse(openingPrompt, ui.responseArea, 20);
    }

    /**
     * Create the AI chat UI
     * @param {Object} spriteData - The NPC sprite data
     * @returns {Object} UI elements
     */
    static createChatUI(spriteData) {
        const container = document.createElement('div');
        container.className = 'ai-npc-container';

        const inputField = document.createElement('textarea');
        inputField.className = 'ai-npc-input';

        const lessonData = spriteData.lessonData || {};
        const placeholder =
            lessonData.starterPrompt ||
            `Write one line of Java code for ${lessonData.title || spriteData.expertise || 'this topic'}...`;

        inputField.placeholder = placeholder;
        inputField.rows = 3;

        const buttonRow = document.createElement('div');
        buttonRow.className = 'ai-npc-button-row';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 Chat History';
        historyBtn.className = 'ai-npc-history-btn';

        const responseArea = document.createElement('div');
        responseArea.className = 'ai-npc-response-area';
        responseArea.style.display = 'none';

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
     * @param {Object} ui - UI elements
     */
    static attachEventHandlers(npcInstance, spriteData, ui) {
        const { inputField, historyBtn, responseArea } = ui;

        historyBtn.onclick = () => AiNpcFrq.showChatHistory(spriteData);

        const sendMessage = async () => {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;
            inputField.value = '';
            await AiNpcFrq.sendPromptToBackend(spriteData, userMessage, responseArea);
        };

        AiNpcFrq.preventGameInput(inputField);

        inputField.onkeypress = e => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };

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
            const existingContainers = dialogueBox.querySelectorAll('.ai-npc-container');
            existingContainers.forEach(existing => existing.remove());

            const closeBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);
            if (closeBtn && closeBtn.parentNode === dialogueBox) {
                dialogueBox.insertBefore(container, closeBtn);
            } else {
                dialogueBox.appendChild(container);
            }
        }
    }

    /**
     * Send user prompt to backend API and display response
     * @param {Object} spriteData - The NPC sprite data
     * @param {string} userMessage - User's message
     * @param {HTMLElement} responseArea - Response display element
     */
    static async sendPromptToBackend(spriteData, userMessage, responseArea) {
        spriteData.chatHistory = spriteData.chatHistory || [];
        spriteData.chatHistory.push({ role: 'user', message: userMessage });

        responseArea.textContent = 'Thinking...';
        responseArea.style.display = 'block';

        try {
            const lessonData = spriteData.lessonData || {};
            const lessonTitle = lessonData.title || spriteData.expertise || 'AP CSA FRQ';
            const examples = lessonData.examples || [];

            let knowledgeContext = `
Topic: ${lessonTitle}
Tutor instructions:
${lessonData.systemPrompt || 'You are an AP CSA tutor.'}

Current student task:
${lessonData.starterPrompt || 'Write one line of Java code.'}

Evaluate the student's Java answer for AP CSA correctness.
`;

            if (examples.length > 0) {
                knowledgeContext += '\nReference examples:\n';
                examples.forEach(ex => {
                    knowledgeContext += `Q: ${ex.question}\nA: ${ex.answer}\n`;
                });
            }

            const sessionId = `player-${spriteData.id}-${spriteData.lessonKey || 'frq'}`;
            const pythonURL = pythonURI + '/api/ainpc/prompt';

            const response = await fetch(pythonURL, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({
                    prompt: userMessage,
                    session_id: sessionId,
                    npc_type: 'csa-frq-tutor',
                    expertise: lessonTitle,
                    lessonKey: spriteData.lessonKey,
                    knowledgeContext: knowledgeContext
                })
            });

            const data = await response.json();

            if (data.status === 'error') {
                AiNpcFrq.showResponse(
                    data.message || "I'm having trouble thinking right now.",
                    responseArea
                );
                return;
            }

            const aiResponse = data?.response || "I'm not sure how to answer that yet.";
            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });
            AiNpcFrq.showResponse(aiResponse, responseArea);

        } catch (err) {
            console.error('Frontend error:', err);
            AiNpcFrq.showResponse(
                "I'm having trouble reaching my brain right now.",
                responseArea
            );
        }
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

        (spriteData.chatHistory || []).forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.role === 'user' ? 'user-message' : 'ai-message';
            div.textContent = msg.message;
            modal.appendChild(div);
        });

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
}

export default AiNpcFrq;