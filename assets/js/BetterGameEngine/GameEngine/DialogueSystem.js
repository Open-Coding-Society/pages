// DialogueSystem.js - Enhanced with permanent default features
// All NPCs get: voice, typewriter, neon glow, animations by default

class DialogueSystem {
 constructor(options = {}) {
   // Default dialogue arrays
   this.dialogues = options.dialogues || [
     "You've come far, traveler. The skies whisper your name.",
     "The End holds secrets only the brave dare uncover.",
     "Retrieve the elytra and embrace your destiny!"
   ];
  
   this.id = options.id || "dialogue_" + Math.random().toString(36).substr(2, 9);
  
   this.lastShownIndex = -1;
  
   this.dialogueBox = null;
   this.dialogueText = null;
   this.closeBtn = null;
  
   // Sound effect option
   this.enableSound = options.enableSound !== undefined ? options.enableSound : false;
   this.soundUrl = options.soundUrl || "./sounds/dialogue.mp3";
   this.sound = this.enableSound ? new Audio(this.soundUrl) : null;
  
   // Typewriter effect options - DEFAULT ENABLED
   this.typewriterSpeed = options.typewriterSpeed !== undefined ? options.typewriterSpeed : 50;
   this.enableTypewriter = options.enableTypewriter !== undefined ? options.enableTypewriter : true;
   this.typewriterTimeoutId = null;
  
   // Voice synthesis options - DEFAULT ENABLED
   this.enableVoice = options.enableVoice !== undefined ? options.enableVoice : true;
   this.voiceRate = options.voiceRate !== undefined ? options.voiceRate : 0.9;
   this.voicePitch = options.voicePitch !== undefined ? options.voicePitch : 1.0;
   this.voiceVolume = options.voiceVolume !== undefined ? options.voiceVolume : 1.0;
  
   // Create the dialogue box
   this.createDialogueBox();
  
   // Keep track of whether the dialogue is currently open
   this.isOpen = false;
 }


 // Voice synthesis helper
 speakText(text) {
   // Cancel any ongoing speech
   if (window.speechSynthesis) {
     window.speechSynthesis.cancel();
   }
  
   if (!this.enableVoice || !window.speechSynthesis) {
     return; // Voice synthesis not available or disabled
   }
  
   const utterance = new SpeechSynthesisUtterance(text);
  
   // Set voice properties
   utterance.rate = this.voiceRate;
   utterance.pitch = this.voicePitch;
   utterance.volume = this.voiceVolume;
  
   // Try to set Australian male voice
   const voices = window.speechSynthesis.getVoices();
  
   // First, look for Australian English voices
   let australianVoice = voices.find(voice =>
     voice.lang.includes('en-AU') && voice.name.toLowerCase().includes('male')
   );
  
   // If no Australian male voice found, look for any Australian voice
   if (!australianVoice) {
     australianVoice = voices.find(voice => voice.lang.includes('en-AU'));
   }
  
   // If still no Australian voice, look for any male voice
   if (!australianVoice) {
     australianVoice = voices.find(voice => voice.name.toLowerCase().includes('male'));
   }
  
   // If no male voice found, just pick the first voice
   if (!australianVoice && voices.length > 0) {
     australianVoice = voices[0];
   }
  
   if (australianVoice) {
     utterance.voice = australianVoice;
   }
  
   // Speak the text
   window.speechSynthesis.speak(utterance);
 }


 createDialogueBox() {
   // Create style element for animations if not already created
   if (!document.getElementById('dialogue-animations-' + this.id)) {
     const styleSheet = document.createElement('style');
     styleSheet.id = 'dialogue-animations-' + this.id;
     styleSheet.textContent = `
       @keyframes glow-pulse-${this.id} {
         0%, 100% {
           box-shadow: 0 0 20px rgba(0, 255, 255, 0.7), inset 0 0 20px rgba(0, 255, 255, 0.2);
         }
         50% {
           box-shadow: 0 0 30px rgba(0, 255, 255, 0.9), inset 0 0 30px rgba(0, 255, 255, 0.3);
         }
       }
      
       @keyframes text-glow-${this.id} {
         0%, 100% {
           text-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(74, 134, 232, 0.3);
         }
         50% {
           text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(74, 134, 232, 0.6);
         }
       }
      
       @keyframes char-pop-${this.id} {
         0% {
           opacity: 0;
           transform: scale(0.5) translateY(-10px);
         }
         50% {
           transform: scale(1.1) translateY(0);
         }
         100% {
           opacity: 1;
           transform: scale(1) translateY(0);
         }
       }
      
       .dialogue-text-animated-${this.id} {
         animation: text-glow-${this.id} 2s ease-in-out infinite;
       }
      
       .dialogue-char-${this.id} {
         display: inline-block;
         animation: char-pop-${this.id} 0.3s ease-out;
       }
     `;
     document.head.appendChild(styleSheet);
   }
  
   // Create the main dialogue container with unique ID
   this.dialogueBox = document.createElement("div");
   this.dialogueBox.id = "custom-dialogue-box-" + this.id;
  
   // Set styles for the dialogue box
   Object.assign(this.dialogueBox.style, {
     position: "fixed",
     bottom: "100px",
     left: "50%",
     transform: "translateX(-50%)",
     padding: "20px",
     maxWidth: "80%",
     background: "rgba(0, 0, 0, 0.85)",
     color: "#00FFFF",
     fontFamily: "'Press Start 2P', cursive, monospace",
     fontSize: "14px",
     textAlign: "center",
     border: "2px solid #4a86e8",
     borderRadius: "12px",
     zIndex: "9999",
     animation: `glow-pulse-${this.id} 2s ease-in-out infinite`,
     display: "none"
   });


   // Create the avatar container for character portraits
   const avatarContainer = document.createElement("div");
   avatarContainer.id = "dialogue-avatar-" + this.id;
   Object.assign(avatarContainer.style, {
     width: "50px",
     height: "50px",
     marginRight: "15px",
     backgroundSize: "contain",
     backgroundRepeat: "no-repeat",
     backgroundPosition: "center",
     display: "none" // Hidden by default
   });


   // Create the header with character name
   const speakerName = document.createElement("div");
   speakerName.id = "dialogue-speaker-" + this.id;
   Object.assign(speakerName.style, {
     fontWeight: "bold",
     color: "#4a86e8",
     marginBottom: "10px",
     fontSize: "16px"
   });


   // Create the text content area
   this.dialogueText = document.createElement("div");
   this.dialogueText.id = "dialogue-text-" + this.id;
   Object.assign(this.dialogueText.style, {
     marginBottom: "15px",
     lineHeight: "1.5",
     minHeight: "40px"
   });


   // Create close button
   this.closeBtn = document.createElement("button");
   this.closeBtn.innerText = "Close";
   Object.assign(this.closeBtn.style, {
     marginTop: "15px",
     padding: "10px 20px",
     background: "#4a86e8",
     color: "#fff",
     border: "none",
     borderRadius: "5px",
     cursor: "pointer",
     fontFamily: "'Press Start 2P', cursive, monospace",
     fontSize: "12px"
   });
  
   // Add click handler
   this.closeBtn.onclick = () => {
     this.closeDialogue();
   };


   // Create content container to hold text and avatar side by side
   const contentContainer = document.createElement("div");
   contentContainer.style.display = "flex";
   contentContainer.style.alignItems = "flex-start";
   contentContainer.style.marginBottom = "10px";
   contentContainer.appendChild(avatarContainer);
  
   // Create text container for speaker + dialogue
   const textContainer = document.createElement("div");
   textContainer.style.flexGrow = "1";
   textContainer.appendChild(speakerName);
   textContainer.appendChild(this.dialogueText);
   contentContainer.appendChild(textContainer);


   // Assemble the dialogue box
   this.dialogueBox.appendChild(contentContainer);
   this.dialogueBox.appendChild(this.closeBtn);
  
   // Add to the document
   document.body.appendChild(this.dialogueBox);
  
   // Also listen for Escape key to close dialogue
   document.addEventListener("keydown", (e) => {
     if (e.key === "Escape" && this.isOpen) {
       this.closeDialogue();
     }
   });
 }


 // Typewriter effect helper with character animations
 typewriteText(element, text, speed = this.typewriterSpeed) {
   element.innerHTML = ""; // Clear the element
   let charIndex = 0;
    const typeNextChar = () => {
     if (charIndex < text.length) {
       const char = text.charAt(charIndex);
    
       // If it's a space, just add it directly
       if (char === ' ') {
         element.appendChild(document.createTextNode(' '));
       } else {
         const charSpan = document.createElement('span');
         charSpan.className = `dialogue-char-${this.id}`;
         charSpan.textContent = char;
         element.appendChild(charSpan);
       }
    
       charIndex++;
       this.typewriterTimeoutId = setTimeout(typeNextChar, speed);
     } else {
       // Add glow animation to the complete text
       element.classList.add(`dialogue-text-animated-${this.id}`);
     }
   };
    typeNextChar();
 }


 // Show a specific dialogue message
 showDialogue(message, speaker = "", avatarSrc = null) {
   // Clear any existing typewriter timeout
   if (this.typewriterTimeoutId) {
     clearTimeout(this.typewriterTimeoutId);
   }
  
   // Set the content (with unique element IDs)
   const speakerElement = document.getElementById("dialogue-speaker-" + this.id);
   if (speakerElement) {
     speakerElement.textContent = speaker;
     speakerElement.style.display = speaker ? "block" : "none";
   }
  
   // Set avatar if provided
   const avatarElement = document.getElementById("dialogue-avatar-" + this.id);
   if (avatarElement) {
     if (avatarSrc) {
       avatarElement.style.backgroundImage = `url('${avatarSrc}')`;
       avatarElement.style.display = "block";
     } else {
       avatarElement.style.display = "none";
     }
   }
  
   // Apply typewriter effect or set text directly
   if (this.enableTypewriter) {
     this.dialogueText.classList.remove(`dialogue-text-animated-${this.id}`);
     this.typewriteText(this.dialogueText, message, this.typewriterSpeed);
   } else {
     this.dialogueText.textContent = message;
     this.dialogueText.classList.add(`dialogue-text-animated-${this.id}`);
   }
  
   // Show the dialogue box
   this.dialogueBox.style.display = "block";
  
   // Play sound effect if enabled
   if (this.sound) {
     this.sound.currentTime = 0;
     this.sound.play().catch(e => console.log("Sound play error:", e));
   }
  
   // Speak the dialogue text
   this.speakText(message);
  
   this.isOpen = true;
  
   // Return the dialogue box element for custom button addition
   return this.dialogueBox;
 }


 // Show a random dialogue from the dialogues array
 showRandomDialogue(speaker = "", avatarSrc = null) {
   if (this.dialogues.length === 0) return;
  
   // Pick a random index that's different from the last one
   let randomIndex;
   if (this.dialogues.length > 1) {
     do {
       randomIndex = Math.floor(Math.random() * this.dialogues.length);
     } while (randomIndex === this.lastShownIndex);
   } else {
     randomIndex = 0; // Only one dialogue available
   }
  
   // Store the current index to avoid repetition next time
   this.lastShownIndex = randomIndex;
  
   // Show the dialogue
   const randomDialogue = this.dialogues[randomIndex];
   return this.showDialogue(randomDialogue, speaker, avatarSrc);
 }


 // Close the dialogue box
 closeDialogue() {
   if (!this.isOpen) return;
  
   // Clear typewriter timeout
   if (this.typewriterTimeoutId) {
     clearTimeout(this.typewriterTimeoutId);
   }
  
   // Cancel speech synthesis
   if (window.speechSynthesis) {
     window.speechSynthesis.cancel();
   }
  
   // Hide the dialogue box
   this.dialogueBox.style.display = "none";
   this.isOpen = false;
  
   // Remove any custom buttons
   const buttonContainers = this.dialogueBox.querySelectorAll('div[style*="display: flex"]');
   buttonContainers.forEach(container => {
     // Skip the main content container
     if (container.contains(document.getElementById("dialogue-avatar-" + this.id))) {
       return;
     }
     container.remove();
   });
 }


 // Check if dialogue is currently open
 isDialogueOpen() {
   return this.isOpen;
 }


 // Add buttons to the dialogue
 addButtons(buttons) {
     if (!this.isOpen || !buttons || !Array.isArray(buttons) || buttons.length === 0) return;
    
     const buttonContainer = document.createElement('div');
     buttonContainer.style.display = 'flex';
     buttonContainer.style.justifyContent = 'space-between';
     buttonContainer.style.marginTop = '10px';
    
     // Add each button
     buttons.forEach(button => {
         if (!button || !button.text) return;
        
         const btn = document.createElement('button');
         btn.textContent = button.text;
         btn.style.padding = '8px 15px';
         btn.style.background = button.primary ? '#4a86e8' : '#666';
         btn.style.color = 'white';
         btn.style.border = 'none';
         btn.style.borderRadius = '5px';
         btn.style.cursor = 'pointer';
         btn.style.marginRight = '10px';
        
         // Add click handler
         btn.onclick = () => {
             if (button.action && typeof button.action === 'function') {
                 button.action();
             }
         };
        
         buttonContainer.appendChild(btn);
     });
    
     // Insert before the close button
     if (buttonContainer.children.length > 0) {
         this.dialogueBox.insertBefore(buttonContainer, this.closeBtn);
     }
 }
}


export default DialogueSystem;