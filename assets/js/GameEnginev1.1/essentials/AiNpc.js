/**
 * AiNpc.js - Reusable AI-powered NPC conversation system
 * 
 * Provides common behaviors for conversational NPCs powered by backend Gemini API.
 * Works with DialogueSystem.js for UI display.
 * 
 * USAGE:
 * - Call AiNpc.showInteraction(npcInstance) in your NPC's interact() method
 * - Requires spriteData properties: expertise, chatHistory, dialogues, knowledgeBase
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
     * @param {Object} npcInstance - The NPC instance (with this.spriteData, this.dialogueSystem)
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
            npc.dialogueSystem = new DialogueSystem();
        }

        // Show random greeting
        const message = AiNpc.getRandomGreeting(data);
        npc.dialogueSystem.showDialogue(message, data.id, data.src);

        // Create and attach AI chat UI
        const ui = AiNpc.createChatUI(data);
        AiNpc.attachEventHandlers(npc, data, ui);
        AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);
    }

    /**
     * Get a random greeting from dialogues array
     * @param {Object} spriteData - The NPC sprite data
     * @returns {string} Random greeting message
     */
    static getRandomGreeting(spriteData) {
        if (!spriteData.dialogues || spriteData.dialogues.length === 0) {
            return spriteData.greeting || "Hello!";
        }
        const randomIndex = Math.floor(Math.random() * spriteData.dialogues.length);
        return spriteData.dialogues[randomIndex];
    }

    /**
     * Create the AI chat UI (input field, buttons, response area)
     * @param {Object} spriteData - The NPC sprite data
     * @returns {Object} UI elements { container, inputField, historyBtn, responseArea }
     */
    static createChatUI(spriteData) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.marginTop = '15px';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = `Ask about ${spriteData.expertise}...`;
        Object.assign(inputField.style, {
            padding: '8px 12px',
            borderRadius: '5px',
            border: '2px solid #4a86e8',
            backgroundColor: '#16213e',
            color: '#fff'
        });

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.gap = '10px';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 History';
        Object.assign(historyBtn.style, {
            padding: '8px 15px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            flex: '1'
        });

        const responseArea = document.createElement('div');
        Object.assign(responseArea.style, {
            minHeight: '40px',
            padding: '10px',
            backgroundColor: '#16213e',
            borderRadius: '5px',
            borderLeft: '3px solid #4a86e8',
            color: '#4a86e8',
            fontStyle: 'italic',
            display: 'none'
        });

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

        // Handle Enter key
        inputField.onkeypress = e => {
            e.stopPropagation();
            if (e.key === 'Enter') {
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
            const closeBtn = dialogueBox.querySelector('button');
            closeBtn
                ? dialogueBox.insertBefore(container, closeBtn)
                : dialogueBox.appendChild(container);
        }
    }

    /**
     * Send user prompt to backend API and display response
     * @param {Object} spriteData - The NPC sprite data
     * @param {string} userMessage - User's message
     * @param {HTMLElement} responseArea - Response display element
     */
    static async sendPromptToBackend(spriteData, userMessage, responseArea) {
        spriteData.chatHistory.push({ role: 'user', message: userMessage });

        responseArea.textContent = 'Thinking...';
        responseArea.style.display = 'block';

        try {
            // Build knowledge context
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
                    prompt: userMessage,
                    session_id: sessionId,
                    npc_type: spriteData.expertise,
                    expertise: spriteData.expertise,
                    knowledgeContext: knowledgeContext
                })
            });

            const data = await response.json();

            if (data.status === 'error') {
                AiNpc.showResponse(
                    data.message || "I'm having trouble thinking right now.",
                    responseArea
                );
                return;
            }

            const aiResponse = data?.response || "I'm not sure how to answer that yet.";
            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });
            AiNpc.showResponse(aiResponse, responseArea);

        } catch (err) {
            console.error('Frontend error:', err);
            AiNpc.showResponse(
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
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1a1a2e',
            border: '2px solid #4a86e8',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '500px',
            maxHeight: '600px',
            overflowY: 'auto',
            zIndex: '10001',
            color: '#fff'
        });

        const title = document.createElement('h3');
        title.textContent = 'Chat History';
        title.style.color = '#4a86e8';
        modal.appendChild(title);

        spriteData.chatHistory.forEach(msg => {
            const div = document.createElement('div');
            Object.assign(div.style, {
                marginBottom: '8px',
                padding: '8px',
                borderRadius: '5px',
                background: msg.role === 'user' ? '#4a86e8' : '#16213e'
            });
            div.textContent = msg.message;
            modal.appendChild(div);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        Object.assign(closeBtn.style, {
            width: '100%',
            marginTop: '10px',
            padding: '8px',
            background: '#4a86e8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
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

export default AiNpc;
