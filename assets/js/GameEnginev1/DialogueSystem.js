// DialogueSystem.js - Fixed version that addresses both issues
// 1. Unique instances for each NPC to prevent button conflicts
// 2. Works with Eye of Ender collection

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
    
    // Create the dialogue box
    this.createDialogueBox();
    
    // Keep track of whether the dialogue is currently open
    this.isOpen = false;
  }

  createDialogueBox() {
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
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.7)",
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
      lineHeight: "1.5"
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

  // Show a specific dialogue message
  showDialogue(message, speaker = "", avatarSrc = null) {
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
    
    // Set the dialogue text directly
    this.dialogueText.textContent = message;
    
    // Show the dialogue box
    this.dialogueBox.style.display = "block";
    
    // Play sound effect if enabled
    if (this.sound) {
      this.sound.currentTime = 0;
      this.sound.play().catch(e => console.log("Sound play error:", e));
    }
    
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