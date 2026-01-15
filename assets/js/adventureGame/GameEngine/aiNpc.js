/**
 * AINpc.js - BASE CLASS (DO NOT MODIFY)
 * 
 * This file creates AI NPCs that use Google Gemini API for intelligent conversations
 * Students should NOT modify this file - just import it and use it!
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://ai.google.dev/
 * 2. Click "Get API Key" and create your free key
 * 3. Add this to your .env file:
 *    VITE_GEMINI_API_KEY=your_api_key_here
 * 
 * IMPORT IN YOUR GAME LEVEL:
 * import AINpc from './AINpc.js';
 * 
 * THEN USE IT LIKE THIS:
 * const myNpc = new AINpc({
 *   id: "Character Name",
 *   greeting: "Hello!",
 *   expertise: "history",
 *   sprite: path + "/images/gamify/yoursprite.png",
 *   spriteWidth: 512,
 *   spriteHeight: 384,
 *   scaleFactoR: 5,
 *   randomPosition: true,
 *   gameEnv: gameEnv,
 *   knowledgeBase: {
 *     "history": [
 *       { question: "What is Egypt?", answer: "A great civilization" }
 *     ]
 *   }
 * }).getData();
 */

import DialogueSystem from './DialogueSystem.js';

class AINpc {
  constructor(config) {
    this.config = config;
    this.spriteData = this.createSpriteData();
  }

  createSpriteData() {
    const config = this.config;
    const gameEnv = config.gameEnv;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    // Determine spawn position
    let posX, posY;
    if (config.randomPosition) {
      posX = Math.random() * (width * 0.8) + (width * 0.1);
      posY = Math.random() * (height * 0.7) + (height * 0.2);
    } else {
      posX = config.posX || width / 2;
      posY = config.posY || height / 2;
    }

    // Default random dialogues
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
      
      // Animation frames
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

      reaction: function() {
        if (this.dialogueSystem) {
          this.showReactionDialogue();
        } else {
          console.log(config.greeting);
        }
      },

      interact: function() {
        if (this.dialogueSystem && this.dialogueSystem.isDialogueOpen()) {
          this.dialogueSystem.closeDialogue();
        }

        if (!this.dialogueSystem) {
          this.dialogueSystem = new DialogueSystem();
        }

        // Get random greeting
        let message = config.greeting;
        if (this.spriteData.dialogues && this.spriteData.dialogues.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.spriteData.dialogues.length);
          message = this.spriteData.dialogues[randomIndex];
        }

        this.dialogueSystem.showDialogue(
          message,
          config.id,
          this.spriteData.src
        );

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.gap = '10px';

        const chatButton = document.createElement('button');
        chatButton.textContent = "💬 Chat";
        chatButton.style.padding = '8px 15px';
        chatButton.style.background = '#4a86e8';
        chatButton.style.color = 'white';
        chatButton.style.border = 'none';
        chatButton.style.borderRadius = '5px';
        chatButton.style.cursor = 'pointer';
        chatButton.style.flex = '1';

        const closeButton = document.createElement('button');
        closeButton.textContent = "Close";
        closeButton.style.padding = '8px 15px';
        closeButton.style.background = '#666';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.flex = '1';

        chatButton.onclick = () => {
          this.openAIChat();
        };

        closeButton.onclick = () => {
          if (this.dialogueSystem) {
            this.dialogueSystem.closeDialogue();
          }
        };

        buttonContainer.appendChild(chatButton);
        buttonContainer.appendChild(closeButton);

        const dialogueBox = document.getElementById('custom-dialogue-box-' + this.dialogueSystem.id);
        if (dialogueBox) {
          const closeBtn = dialogueBox.querySelector('button');
          if (closeBtn) {
            dialogueBox.insertBefore(buttonContainer, closeBtn);
          } else {
            dialogueBox.appendChild(buttonContainer);
          }
        }
      },

      openAIChat: function() {
        const chatContainer = document.createElement('div');
        Object.assign(chatContainer.style, {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: '#1a1a2e',
          border: '2px solid #4a86e8',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: '10000',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontFamily: 'Arial, sans-serif',
          color: '#fff'
        });

        // Header
        const header = document.createElement('div');
        Object.assign(header.style, {
          backgroundColor: '#4a86e8',
          padding: '15px',
          borderRadius: '8px 8px 0 0',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        });
        header.textContent = config.id;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => chatContainer.remove();
        header.appendChild(closeBtn);

        // Messages area
        const messagesArea = document.createElement('div');
        Object.assign(messagesArea.style, {
          flex: '1',
          overflowY: 'auto',
          padding: '15px',
          borderBottom: '1px solid #4a86e8'
        });

        // Input area
        const inputArea = document.createElement('div');
        Object.assign(inputArea.style, {
          padding: '10px',
          display: 'flex',
          gap: '5px'
        });

        const input = document.createElement('input');
        Object.assign(input.style, {
          flex: '1',
          padding: '8px',
          border: '1px solid #4a86e8',
          borderRadius: '5px',
          backgroundColor: '#16213e',
          color: '#fff'
        });
        input.placeholder = `Ask about ${config.expertise}...`;
        input.type = 'text';

        const sendBtn = document.createElement('button');
        sendBtn.textContent = '📤';
        Object.assign(sendBtn.style, {
          padding: '8px 12px',
          backgroundColor: '#4a86e8',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        });

        // Add message to chat
        const addMessage = (text, sender) => {
          const messageDiv = document.createElement('div');
          messageDiv.style.marginBottom = '10px';
          messageDiv.style.padding = '8px';
          messageDiv.style.borderRadius = '5px';
          messageDiv.style.wordWrap = 'break-word';

          if (sender === 'user') {
            messageDiv.style.backgroundColor = '#4a86e8';
            messageDiv.style.marginLeft = '20px';
            messageDiv.style.textAlign = 'right';
          } else {
            messageDiv.style.backgroundColor = '#16213e';
            messageDiv.style.marginRight = '20px';
            messageDiv.style.borderLeft = '3px solid #4a86e8';
          }

          messageDiv.textContent = text;
          messagesArea.appendChild(messageDiv);
          messagesArea.scrollTop = messagesArea.scrollHeight;
        };

        // Send message function
        const sendMessage = async () => {
          const userMessage = input.value.trim();
          if (userMessage === '') return;

          addMessage(userMessage, 'user');
          input.value = '';
          
          // Show loading indicator
          addMessage("Thinking...", 'ai');

          const response = await this.generateResponse(userMessage, config.knowledgeBase, config.expertise);
          
          // Remove the "Thinking..." message and add the real response
          const lastMessage = messagesArea.lastChild;
          if (lastMessage && lastMessage.textContent === "Thinking...") {
            messagesArea.removeChild(lastMessage);
          }
          addMessage(response, 'ai');
        };

        sendBtn.onclick = sendMessage;
        input.onkeypress = (e) => {
          if (e.key === 'Enter') sendMessage();
        };

        inputArea.appendChild(input);
        inputArea.appendChild(sendBtn);

        chatContainer.appendChild(header);
        chatContainer.appendChild(messagesArea);
        chatContainer.appendChild(inputArea);

        document.body.appendChild(chatContainer);

        addMessage(`Hi! I'm ${config.id}. Ask me anything about ${config.expertise}!`, 'ai');
      },

      generateResponse: async function(userMessage, knowledgeBase, expertise) {
        try {
          // Get API key from environment variable
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          
          if (!apiKey) {
            console.error("Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file");
            return "AI is not configured. Please add your Gemini API key!";
          }

          // Build knowledge base context from the provided data
          let knowledgeContext = "";
          const topicsArray = knowledgeBase[expertise] || [];
          if (topicsArray.length > 0) {
            knowledgeContext = "Here are some example topics I can help with:\n";
            topicsArray.slice(0, 3).forEach(topic => {
              knowledgeContext += `- ${topic.question}\n`;
            });
            knowledgeContext += "\n";
          }

          // Call Google Gemini API
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are an expert in ${expertise}. ${knowledgeContext}Answer the following question in a friendly, educational way suitable for students. Keep your answer concise and engaging:\n\n${userMessage}`
                      }
                    ]
                  }
                ],
                generationConfig: {
                  maxOutputTokens: 300,
                  temperature: 0.7
                }
              })
            }
          );

          const data = await response.json();
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0].text;
          } else {
            return "I'm thinking about that... Let me get back to you!";
          }
        } catch (error) {
          console.error("API Error:", error);
          return "I'm having trouble thinking right now. Try asking again!";
        }
      }
    };

    return spriteData;
  }

  getData() {
    return this.spriteData;
  }
}

export default AINpc;