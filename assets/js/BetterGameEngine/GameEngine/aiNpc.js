/**
 * AINpc.js - BASE CLASS (DO NOT MODIFY)
 * Modified to integrate chat into dialogue box
 * DEBUG VERSION - WITH EXTENSIVE CONSOLE LOGGING
 */

import DialogueSystem from './DialogueSystem.js';

class AINpc {
  constructor(config) {
    this.config = config;
    this.spriteData = this.createSpriteData();
    this.chatHistory = []; // Store chat history
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

        let message = config.greeting;
        if (this.dialogues && this.dialogues.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.dialogues.length);
          message = this.dialogues[randomIndex];
        }

        this.dialogueSystem.showDialogue(
          message,
          config.id,
          this.src
        );

        // Create chat interface in dialogue box
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '15px';

        // Input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = `Ask about ${config.expertise}...`;
        inputField.style.padding = '8px 12px';
        inputField.style.borderRadius = '5px';
        inputField.style.border = '2px solid #4a86e8';
        inputField.style.backgroundColor = '#16213e';
        inputField.style.color = '#fff';
        inputField.style.fontFamily = 'Arial, sans-serif';
        inputField.style.fontSize = '14px';

        // Button container for send and history
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
        historyBtn.style.fontFamily = 'Arial, sans-serif';

        // AI Response area (typewriter effect)
        const responseArea = document.createElement('div');
        responseArea.style.minHeight = '40px';
        responseArea.style.padding = '10px';
        responseArea.style.backgroundColor = '#16213e';
        responseArea.style.borderRadius = '5px';
        responseArea.style.borderLeft = '3px solid #4a86e8';
        responseArea.style.color = '#4a86e8';
        responseArea.style.fontStyle = 'italic';
        responseArea.style.display = 'none';
        responseArea.textContent = '';

        const typewriterEffect = (text, element, speed = 30) => {
          element.textContent = '';
          element.style.display = 'block';
          let index = 0;
          
          const type = () => {
            if (index < text.length) {
              element.textContent += text.charAt(index);
              index++;
              setTimeout(type, speed);
            }
          };
          type();
        };

        const sendMessage = async () => {
          const userMessage = inputField.value.trim();
          if (userMessage === '') return;

          // Store in history
          spriteData.chatHistory.push({ role: 'user', message: userMessage });

          inputField.value = '';
          responseArea.textContent = 'Thinking...';
          responseArea.style.display = 'block';

          try {
            // DEBUG 1: Check if API key exists
            const apiKey = window.GEMINI_API_KEY;
            console.log("🔍 DEBUG 1 - API Key Check:");
            console.log("  - API Key exists:", !!apiKey);
            console.log("  - API Key value:", apiKey ? `${apiKey.substring(0, 10)}...` : "UNDEFINED");
            console.log("  - API Key type:", typeof apiKey);
            console.log("  - window.GEMINI_API_KEY exists:", 'GEMINI_API_KEY' in window);

            if (!apiKey) {
              console.error("❌ FAIL: API Key is missing or undefined");
              typewriterEffect('AI is not configured. Please add your Gemini API key!', responseArea);
              return;
            }

            // DEBUG 2: Check message and expertise
            console.log("🔍 DEBUG 2 - Message & Expertise:");
            console.log("  - User message:", userMessage);
            console.log("  - Expertise:", config.expertise);

            let knowledgeContext = "";
            const topicsArray = config.knowledgeBase[config.expertise] || [];
            console.log("🔍 DEBUG 2b - Knowledge Base:");
            console.log("  - Topics array length:", topicsArray.length);
            
            if (topicsArray.length > 0) {
              knowledgeContext = "Here are some example topics I can help with:\n";
              topicsArray.slice(0, 3).forEach(topic => {
                knowledgeContext += `- ${topic.question}\n`;
              });
              knowledgeContext += "\n";
            }

            // DEBUG 3: Build the API URL
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            console.log("🔍 DEBUG 3 - API URL:");
            console.log("  - Full URL:", apiUrl);
            console.log("  - Host:", new URL(apiUrl).host);

            // DEBUG 4: Build request body
            const fullPrompt = `You are an expert in ${config.expertise}. ${knowledgeContext}Answer the following question in a friendly, educational way suitable for students. Keep your answer concise and engaging:\n\n${userMessage}`;
            const requestBody = {
              contents: [
                {
                  parts: [
                    {
                      text: fullPrompt
                    }
                  ]
                }
              ],
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7
              }
            };
            console.log("🔍 DEBUG 4 - Request Body:");
            console.log("  - Contents length:", requestBody.contents.length);
            console.log("  - First part text length:", requestBody.contents[0].parts[0].text.length);
            console.log("  - Full prompt:", fullPrompt);

            // DEBUG 5: Make the fetch request
            console.log("🔍 DEBUG 5 - Making Fetch Request...");
            console.log("  - Method: POST");
            console.log("  - URL:", apiUrl);
            
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody)
            });

            // DEBUG 6: Check response status
            console.log("🔍 DEBUG 6 - Response Status:");
            console.log("  - Status code:", response.status);
            console.log("  - Status text:", response.statusText);
            console.log("  - Is OK:", response.ok);
            console.log("  - Headers:", {
              contentType: response.headers.get('content-type'),
              date: response.headers.get('date')
            });

            // DEBUG 7: Parse response
            const data = await response.json();
            console.log("🔍 DEBUG 7 - Response Data:");
            console.log("  - Full response:", JSON.stringify(data, null, 2));
            console.log("  - Has candidates:", !!data.candidates);
            console.log("  - Has error:", !!data.error);
            
            if (data.error) {
              console.error("❌ ERROR RESPONSE:");
              console.error("  - Error code:", data.error.code);
              console.error("  - Error message:", data.error.message);
              console.error("  - Error status:", data.error.status);
              console.error("  - Full error:", JSON.stringify(data.error, null, 2));
            }

            let aiResponse = "I'm thinking about that... Let me get back to you!";
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
              aiResponse = data.candidates[0].content.parts[0].text;
              console.log("✅ DEBUG 8 - Successfully got AI response:", aiResponse.substring(0, 50) + "...");
            } else {
              console.warn("⚠️ DEBUG 8 - Unexpected response structure");
            }

            // Store in history
            spriteData.chatHistory.push({ role: 'ai', message: aiResponse });

            // Typewriter effect
            typewriterEffect(aiResponse, responseArea);
          } catch (error) {
            console.error("❌ CRITICAL ERROR in sendMessage:");
            console.error("  - Error name:", error.name);
            console.error("  - Error message:", error.message);
            console.error("  - Error stack:", error.stack);
            console.error("  - Full error object:", error);
            typewriterEffect("I'm having trouble thinking right now. Try asking again!", responseArea);
          }
        };

        historyBtn.onclick = () => {
          spriteData.showChatHistory();
        };

        buttonRow.appendChild(historyBtn);

        inputField.onkeypress = (e) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        };
        inputField.onkeydown = (e) => {
          e.stopPropagation();
        };

        buttonContainer.appendChild(inputField);
        buttonContainer.appendChild(buttonRow);
        buttonContainer.appendChild(responseArea);

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

      showChatHistory: function() {
        const historyModal = document.createElement('div');
        Object.assign(historyModal.style, {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1a1a2e',
          border: '2px solid #4a86e8',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '500px',
          maxHeight: '600px',
          overflowY: 'auto',
          zIndex: '10001',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          fontFamily: 'Arial, sans-serif',
          color: '#fff'
        });

        const header = document.createElement('h3');
        header.textContent = 'Chat History';
        header.style.color = '#4a86e8';
        header.style.marginTop = '0';

        const content = document.createElement('div');
        content.style.marginBottom = '15px';

        if (spriteData.chatHistory.length === 0) {
          content.textContent = 'No messages yet.';
          content.style.color = '#999';
        } else {
          spriteData.chatHistory.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.style.marginBottom = '10px';
            msgDiv.style.padding = '10px';
            msgDiv.style.borderRadius = '5px';

            if (msg.role === 'user') {
              msgDiv.style.backgroundColor = '#4a86e8';
              msgDiv.style.textAlign = 'right';
            } else {
              msgDiv.style.backgroundColor = '#16213e';
              msgDiv.style.borderLeft = '3px solid #4a86e8';
            }

            msgDiv.textContent = msg.message;
            content.appendChild(msgDiv);
          });
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.backgroundColor = '#4a86e8';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.width = '100%';
        closeBtn.style.fontSize = '14px';
        closeBtn.onclick = () => historyModal.remove();

        historyModal.appendChild(header);
        historyModal.appendChild(content);
        historyModal.appendChild(closeBtn);

        document.body.appendChild(historyModal);
      }
    };

    return spriteData;
  }

  getData() {
    return this.spriteData;
  }
}

export default AINpc;