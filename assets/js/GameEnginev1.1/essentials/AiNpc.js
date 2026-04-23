/**
 * AiNpc.js - Reusable AI-powered NPC conversation system
 * 
 * Provides common behaviors for conversational NPCs powered by backend Gemini API.
 * Works with DialogueSystem.js for UI display.
 * 
 * USAGE:
 * - Call AiNpc.showInteraction(npcInstance) in your NPC's interact() method
 * - Requires spriteData properties: expertise, chatHistory, dialogues, knowledgeBase
 * - DialogueSystem cycles through dialogues array sequentially on each interaction
 * 
 * BACKEND API:
 * - POST /api/ainpc/prompt   - Send message to NPC, get response
 * - POST /api/ainpc/greeting - Get NPC greeting and reset conversation
 * - POST /api/ainpc/reset    - Clear conversation history
 * - GET  /api/ainpc/test     - Test API availability
 */

import DialogueSystem from './DialogueSystem.js';
import AiNpcSession from './AiNpcSession.js';
import { pythonURI, fetchOptions } from '../../api/config.js';

class AiNpc {
    static cleanupDialogueArtifacts(dialogueSystem) {
        if (!dialogueSystem?.safeId) return;

        const dialogueBox = document.getElementById('custom-dialogue-box-' + dialogueSystem.safeId);
        if (!dialogueBox) return;

        const aiContainers = dialogueBox.querySelectorAll('.ai-npc-container');
        aiContainers.forEach((node) => node.remove());

        const topLeftClose = dialogueBox.querySelector('.ai-npc-close-top-left');
        if (topLeftClose) topLeftClose.remove();

        const defaultCloseBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);
        if (defaultCloseBtn) {
            defaultCloseBtn.style.display = '';
        }
    }

    static cleanupInteraction(npcInstance) {
        if (!npcInstance) return;

        const dialogueSystem = npcInstance.dialogueSystem;

        if (dialogueSystem?.isDialogueOpen?.()) {
            dialogueSystem.closeDialogue();
        } else {
            if (npcInstance.aiSession) {
                npcInstance.aiSession.cancel();
                npcInstance.aiSession = null;
            }
            if (dialogueSystem?.setLifecycleSession) {
                dialogueSystem.setLifecycleSession(null);
            }
        }

        AiNpc.cleanupDialogueArtifacts(dialogueSystem);
    }

    static ensureDialogueCleanupHook(dialogueSystem) {
        if (!dialogueSystem || dialogueSystem.__aiNpcCleanupWrapped) return;

        const originalCloseDialogue = typeof dialogueSystem.closeDialogue === 'function'
            ? dialogueSystem.closeDialogue.bind(dialogueSystem)
            : null;
        if (!originalCloseDialogue) return;

        dialogueSystem.closeDialogue = (...args) => {
            const result = originalCloseDialogue(...args);
            AiNpc.cleanupDialogueArtifacts(dialogueSystem);
            return result;
        };

        dialogueSystem.__aiNpcCleanupWrapped = true;
    }

    static ensureDestroyHook(npcInstance) {
        if (!npcInstance || npcInstance.__aiNpcDestroyWrapped) return;

        const originalDestroy = typeof npcInstance.destroy === 'function'
            ? npcInstance.destroy.bind(npcInstance)
            : null;

        npcInstance.destroy = (...args) => {
            AiNpc.cleanupInteraction(npcInstance);
            if (originalDestroy) {
                return originalDestroy(...args);
            }
            return undefined;
        };

        npcInstance.__aiNpcDestroyWrapped = true;
    }

    static beginSession(npcInstance) {
        if (!npcInstance) return null;

        AiNpc.ensureDestroyHook(npcInstance);
        AiNpc.ensureDialogueCleanupHook(npcInstance.dialogueSystem);

        if (npcInstance.aiSession) {
            npcInstance.aiSession.cancel();
        }

        npcInstance.aiSession = new AiNpcSession(npcInstance?.spriteData?.id || 'npc');

        if (npcInstance.dialogueSystem?.setLifecycleSession) {
            npcInstance.dialogueSystem.setLifecycleSession(npcInstance.aiSession);
        }

        return npcInstance.aiSession;
    }

    static isSessionActive(session) {
        return !!session && typeof session.isActive === 'function' && session.isActive();
    }

    static canUseElement(element, session) {
        if (!element || !element.isConnected) return false;
        if (!session) return true;
        return AiNpc.isSessionActive(session);
    }

    /**
     * Main entry point - Shows full AI interaction dialog for an NPC
     * Creates DialogueSystem with NPC's dialogues and uses cycling behavior
     * @param {Object} npcInstance - The NPC instance (with this.spriteData, this.gameControl)
     */
    static showInteraction(npcInstance) {
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

        AiNpc.ensureDialogueCleanupHook(npc.dialogueSystem);

        const session = AiNpc.beginSession(npc);
        if (npc.dialogueSystem?.setLifecycleSession) {
            npc.dialogueSystem.setLifecycleSession(session);
        }

        // Use DialogueSystem's cycling showRandomDialogue method
        npc.dialogueSystem.showRandomDialogue(data.id, null, data);

        // Create and attach AI chat UI
        const ui = AiNpc.createChatUI(data);
        AiNpc.attachEventHandlers(npc, data, ui);
        AiNpc.attachToDialogue(npc.dialogueSystem, ui.container);
    }

    /**
     * Create the AI chat UI (input field, buttons, response area)
     * @param {Object} spriteData - The NPC sprite data
     * @returns {Object} UI elements { container, inputField, historyBtn, responseArea }
     */
    static createChatUI(spriteData) {
        const container = document.createElement('div');
        container.className = 'ai-npc-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

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

        const entryArea = document.createElement('div');
        entryArea.className = 'ai-npc-entry-area';
        entryArea.style.display = 'flex';
        entryArea.style.flexDirection = 'column';
        entryArea.style.gap = '8px';
        entryArea.style.marginTop = 'auto';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 Chat History';
        historyBtn.className = 'ai-npc-history-btn';

        const responseArea = document.createElement('div');
        responseArea.className = 'ai-npc-response-area';
        responseArea.style.display = 'none'; // Keep this one for show/hide logic

        buttonRow.appendChild(historyBtn);
        entryArea.appendChild(inputField);
        entryArea.appendChild(buttonRow);
        container.appendChild(responseArea);
        container.appendChild(entryArea);

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
        const session = npcInstance?.aiSession || null;

        // History button
        historyBtn.onclick = () => AiNpc.showChatHistory(spriteData);

        // Send message function
        const sendMessage = async () => {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;
            inputField.value = '';
            await AiNpc.sendPromptToBackend(npcInstance, userMessage, responseArea);
        };

        // Prevent game input while typing
        AiNpc.preventGameInput(inputField, session);

        // Handle Enter key (Shift+Enter for new line, Enter to send)
        inputField.onkeypress = e => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };

        // Auto-focus input field
        if (session) {
            session.setTimeout(() => {
                if (AiNpc.canUseElement(inputField, session)) inputField.focus();
            }, 100);
        } else {
            setTimeout(() => inputField.focus(), 100);
        }
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

            // Remove any previously injected top-left close control for AI panels.
            const existingCloseTopLeft = dialogueBox.querySelector('.ai-npc-close-top-left');
            if (existingCloseTopLeft) {
                existingCloseTopLeft.remove();
            }

            // Ensure a top-left close control exists for AI interactions.
            const closeTopLeftBtn = document.createElement('button');
            closeTopLeftBtn.type = 'button';
            closeTopLeftBtn.className = 'ai-npc-close-top-left';
            closeTopLeftBtn.setAttribute('aria-label', 'Close AI panel');
            closeTopLeftBtn.title = 'Close';
            closeTopLeftBtn.textContent = '×';
            closeTopLeftBtn.style.position = 'absolute';
            closeTopLeftBtn.style.top = '10px';
            closeTopLeftBtn.style.left = '10px';
            closeTopLeftBtn.style.width = '30px';
            closeTopLeftBtn.style.height = '30px';
            closeTopLeftBtn.style.borderRadius = '999px';
            closeTopLeftBtn.style.border = '1px solid rgba(255,255,255,0.28)';
            closeTopLeftBtn.style.background = 'rgba(12,16,24,0.68)';
            closeTopLeftBtn.style.backdropFilter = 'blur(2px)';
            closeTopLeftBtn.style.color = 'rgba(255,255,255,0.92)';
            closeTopLeftBtn.style.cursor = 'pointer';
            closeTopLeftBtn.style.fontSize = '20px';
            closeTopLeftBtn.style.fontWeight = '600';
            closeTopLeftBtn.style.lineHeight = '1';
            closeTopLeftBtn.style.display = 'flex';
            closeTopLeftBtn.style.alignItems = 'center';
            closeTopLeftBtn.style.justifyContent = 'center';
            closeTopLeftBtn.style.padding = '0';
            closeTopLeftBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.22)';
            closeTopLeftBtn.style.transition = 'transform 120ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease';
            closeTopLeftBtn.style.zIndex = '10001';
            closeTopLeftBtn.onmouseenter = () => {
                closeTopLeftBtn.style.background = 'rgba(30,36,50,0.86)';
                closeTopLeftBtn.style.borderColor = 'rgba(255,255,255,0.5)';
                closeTopLeftBtn.style.transform = 'translateY(-1px)';
                closeTopLeftBtn.style.boxShadow = '0 6px 14px rgba(0,0,0,0.3)';
            };
            closeTopLeftBtn.onmouseleave = () => {
                closeTopLeftBtn.style.background = 'rgba(12,16,24,0.68)';
                closeTopLeftBtn.style.borderColor = 'rgba(255,255,255,0.28)';
                closeTopLeftBtn.style.transform = 'translateY(0)';
                closeTopLeftBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.22)';
            };
            closeTopLeftBtn.onmousedown = () => {
                closeTopLeftBtn.style.transform = 'translateY(1px) scale(0.97)';
            };
            closeTopLeftBtn.onmouseup = () => {
                closeTopLeftBtn.style.transform = 'translateY(-1px)';
            };
            closeTopLeftBtn.onfocus = () => {
                closeTopLeftBtn.style.borderColor = 'rgba(120,180,255,0.9)';
                closeTopLeftBtn.style.boxShadow = '0 0 0 2px rgba(120,180,255,0.25), 0 6px 14px rgba(0,0,0,0.3)';
            };
            closeTopLeftBtn.onblur = () => {
                closeTopLeftBtn.style.borderColor = 'rgba(255,255,255,0.28)';
                closeTopLeftBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.22)';
            };
            closeTopLeftBtn.onclick = (event) => {
                event.stopPropagation();
                dialogueSystem.closeDialogue();
            };
            dialogueBox.appendChild(closeTopLeftBtn);

            // Keep AI interaction area above the dialogue controls row.
            const controlsRow = document.getElementById('dialogue-controls-' + dialogueSystem.safeId);
            const defaultCloseBtn = document.getElementById('dialogue-close-btn-' + dialogueSystem.safeId);
            if (defaultCloseBtn) {
                defaultCloseBtn.style.display = 'none';
            }
            if (controlsRow && controlsRow.parentNode === dialogueBox) {
                dialogueBox.insertBefore(container, controlsRow);
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
    static async sendPromptToBackend(npcInstance, userMessage, responseArea) {
        const spriteData = npcInstance?.spriteData || npcInstance;
        const session = npcInstance?.aiSession || null;

        if (!spriteData || !Array.isArray(spriteData.chatHistory)) {
            return;
        }

        spriteData.chatHistory.push({ role: 'user', message: userMessage });

        if (AiNpc.canUseElement(responseArea, session)) {
            responseArea.textContent = 'Thinking...';
            responseArea.style.display = 'block';
        }

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
                signal: session?.signal,
                body: JSON.stringify({
                    prompt: userMessage,
                    session_id: sessionId,
                    npc_type: spriteData.expertise,
                    expertise: spriteData.expertise,
                    knowledgeContext: knowledgeContext
                })
            });

            const data = await response.json();

            if (!AiNpc.canUseElement(responseArea, session)) {
                return;
            }

            if (data.status === 'error') {
                AiNpc.showResponse(
                    data.message || "I'm having trouble thinking right now.",
                    responseArea,
                    30,
                    session,
                );
                return;
            }

            const aiResponse = data?.response || "I'm not sure how to answer that yet.";
            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });
            AiNpc.showResponse(aiResponse, responseArea, 30, session);

        } catch (err) {
            if (err?.name === 'AbortError' || session?.signal?.aborted) {
                return;
            }
            console.error('Frontend error:', err);
            if (AiNpc.canUseElement(responseArea, session)) {
                AiNpc.showResponse(
                    "I'm having trouble reaching my brain right now.",
                    responseArea,
                    30,
                    session,
                );
            }
        }
    }

    /**
     * Display response with typewriter effect
     * @param {string} text - Text to display
     * @param {HTMLElement} element - Element to display in
     * @param {number} speed - Typing speed in ms
     */
    static showResponse(text, element, speed = 30, session = null) {
        if (!AiNpc.canUseElement(element, session)) return;

        element.textContent = '';
        element.style.display = 'block';
        let index = 0;

        const scheduleNext = (fn) => {
            if (session) {
                session.setTimeout(fn, speed);
                return;
            }
            setTimeout(fn, speed);
        };

        const type = () => {
            if (!AiNpc.canUseElement(element, session)) return;
            if (index < text.length) {
                element.textContent += text.charAt(index++);
                scheduleNext(type);
            }
        };
        type();
    }

    /**
     * Prevent keyboard events from propagating to game
     * @param {HTMLElement} element - Input element to protect
     */
    static preventGameInput(element, session = null) {
        ['keydown', 'keyup', 'keypress'].forEach(eventType => {
            const handler = (e) => e.stopPropagation();
            if (session) {
                session.addListener(element, eventType, handler);
            } else {
                element.addEventListener(eventType, handler);
            }
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

        spriteData.chatHistory.forEach(msg => {
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

export default AiNpc;
