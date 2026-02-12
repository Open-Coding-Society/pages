/**
 * AINpc.js - BASE CLASS 
 */

import DialogueSystem from '../DialogueSystem.js';
import { pythonURI, javaURI, fetchOptions } from '../../api/config.js';

class AINpc {
  constructor(config) {
    this.config = config;
    this.spriteData = this.createSpriteData();
    this.chatHistory = [];
  }

  createSpriteData() {
    const config = this.config;
    const gameEnv = config.gameEnv;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    let posX, posY;
    if (config.randomPosition) {
      posX = Math.random() * (width * 0.8) + (width * 0.1);
      posY = Math.random() * (height * 0.7) + (height * 0.2);
    } else {
      posX = config.posX || width / 2;
      posY = config.posY || height / 2;
    }

    const defaultDialogues = [
      `Ask me anything about ${config.expertise}!`,
      `I have knowledge about ${config.expertise}...`,
      `Want to learn about ${config.expertise}?`,
      `I'm an expert in ${config.expertise}!`,
      `Curious about ${config.expertise}? Talk to me!`
    ];

    const spriteData = {
      id: config.id,
      greeting: config.greeting,
      src: config.sprite,
      SCALE_FACTOR: config.scaleFactoR || 5,
      ANIMATION_RATE: config.animationRate || 50,
      pixels: { height: config.spriteHeight || 384, width: config.spriteWidth || 512 },
      INIT_POSITION: { x: posX, y: posY },
      orientation: config.orientation || { rows: 3, columns: 4 },

      down: config.down || { row: 0, start: 0, columns: 3 },
      downRight: config.downRight || { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: config.downLeft || { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: config.left || { row: 2, start: 0, columns: 3 },
      right: config.right || { row: 1, start: 0, columns: 3 },
      up: config.up || { row: 3, start: 0, columns: 3 },
      upLeft: config.upLeft || { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: config.upRight || { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },

      hitbox: config.hitbox || { widthPercentage: 0.1, heightPercentage: 0.2 },
      dialogues: config.dialogues || defaultDialogues,
      knowledgeBase: config.knowledgeBase || {},
      expertise: config.expertise,
      chatHistory: [],

      reaction: function () {
        if (this.dialogueSystem) {
          this.showReactionDialogue();
        } else {
          console.log(config.greeting);
        }
      },

      interact: function () {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
        }

        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }

        let message = config.greeting;
        if (this.dialogues && this.dialogues.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.dialogues.length);
          message = this.dialogues[randomIndex];
        }

        this.dialogueSystem.showDialogue(message, config.id, this.src);

        // UI Elements
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '15px';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = `Ask about ${config.expertise}...`;
        inputField.style.padding = '8px 12px';
        inputField.style.borderRadius = '5px';
        inputField.style.border = '2px solid #4a86e8';
        inputField.style.backgroundColor = '#16213e';
        inputField.style.color = '#fff';

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.gap = '10px';

        const historyBtn = document.createElement('button');
        historyBtn.textContent = '📋 History';
        historyBtn.style.padding = '8px 15px';
        historyBtn.style.background = '#666';
        historyBtn.style.color = 'white';
        historyBtn.style.border = 'none';
        historyBtn.style.borderRadius = '5px';
        historyBtn.style.cursor = 'pointer';
        historyBtn.style.flex = '1';

        const responseArea = document.createElement('div');
        responseArea.style.minHeight = '40px';
        responseArea.style.padding = '10px';
        responseArea.style.backgroundColor = '#16213e';
        responseArea.style.borderRadius = '5px';
        responseArea.style.borderLeft = '3px solid #4a86e8';
        responseArea.style.color = '#4a86e8';
        responseArea.style.fontStyle = 'italic';
        responseArea.style.display = 'none';

        const typewriterEffect = (text, element, speed = 30) => {
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
        };

        // ✅ BACKEND CALL to Flask /api/ainpc/prompt with proper session management
        const sendMessage = async () => {
          const userMessage = inputField.value.trim();
          if (!userMessage) return;

          spriteData.chatHistory.push({ role: 'user', message: userMessage });
          inputField.value = '';
          responseArea.textContent = 'Thinking...';
          responseArea.style.display = 'block';

          try {
            let knowledgeContext = '';
            const topics = config.knowledgeBase?.[config.expertise] || [];

            if (topics.length > 0) {
              knowledgeContext = 'Here are some example topics I can help with:\n';
              topics.slice(0, 3).forEach(t => {
                knowledgeContext += `- ${t.question}\n`;
              });
              knowledgeContext += '\n';
            }

            // Create a unique session ID for this NPC conversation
            const sessionId = `player-${config.id}`;

            const response = await fetch(`${pythonURI}/api/ainpc/prompt`, {
              ...fetchOptions,
              method: 'POST',
              body: JSON.stringify({
                prompt: userMessage,
                session_id: sessionId,
                npc_type: config.expertise,
                expertise: config.expertise,
                knowledgeContext: knowledgeContext
              })
            });

            const data = await response.json();

            if (data.status === 'error') {
              typewriterEffect(
                data.message || "I'm having trouble thinking right now.",
                responseArea
              );
              return;
            }

            const aiResponse = data?.response || "I'm not sure how to answer that yet.";

            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });

            typewriterEffect(aiResponse, responseArea);
          } catch (err) {
            console.error('Frontend error:', err);
            typewriterEffect(
              "I'm having trouble reaching my brain right now.",
              responseArea
            );
          }
        };

        historyBtn.onclick = () => spriteData.showChatHistory();

        inputField.onkeypress = e => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        };

        buttonRow.appendChild(historyBtn);
        buttonContainer.appendChild(inputField);
        buttonContainer.appendChild(buttonRow);
        buttonContainer.appendChild(responseArea);

        const dialogueBox =
          document.getElementById('custom-dialogue-box-' + this.dialogueSystem.id);

        if (dialogueBox) {
          const closeBtn = dialogueBox.querySelector('button');
          closeBtn
            ? dialogueBox.insertBefore(buttonContainer, closeBtn)
            : dialogueBox.appendChild(buttonContainer);
        }
      },

      showChatHistory: function () {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = '#1a1a2e';
        modal.style.border = '2px solid #4a86e8';
        modal.style.borderRadius = '10px';
        modal.style.padding = '20px';
        modal.style.maxWidth = '500px';
        modal.style.maxHeight = '600px';
        modal.style.overflowY = 'auto';
        modal.style.zIndex = '10001';
        modal.style.color = '#fff';

        const title = document.createElement('h3');
        title.textContent = 'Chat History';
        title.style.color = '#4a86e8';

        modal.appendChild(title);

        spriteData.chatHistory.forEach(msg => {
          const div = document.createElement('div');
          div.style.marginBottom = '8px';
          div.style.padding = '8px';
          div.style.borderRadius = '5px';
          div.style.background =
            msg.role === 'user' ? '#4a86e8' : '#16213e';
          div.textContent = msg.message;
          modal.appendChild(div);
        });

        const close = document.createElement('button');
        close.textContent = 'Close';
        close.style.width = '100%';
        close.style.marginTop = '10px';
        close.onclick = () => modal.remove();

        modal.appendChild(close);
        document.body.appendChild(modal);
      }
    };

    return spriteData;
  }

  getData() {
    return this.spriteData;
  }
}

export default AINpc;