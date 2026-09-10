// Add pixel font import
const pixelFontStyle = document.createElement('link');
pixelFontStyle.rel = 'stylesheet';
pixelFontStyle.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
document.head.appendChild(pixelFontStyle);

// Create audio elements for sound effects
const createAudio = (src) => {
  const audio = new Audio();
  audio.src = src;
  audio.volume = 0.3;
  return audio;
};

const sounds = {
  typewriter: createAudio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='),
  select: createAudio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'),
  click: createAudio('data:audio/wav;base64,UklGRXEAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUQAAAB/f39/gICAgICAgH9/f39/f39/f39/f4CAgICAgIB/f39/f39/f39/f3+AgICAgICAgICAgH9/f39/f39/f39/f39/f39/f39/fw==')
};

const dialogStyle = document.createElement('style');
dialogStyle.textContent = `
  @keyframes dialogAppear {
    0% { transform: translate(-50%, -40%) scale(0.9); opacity: 0; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  @keyframes textType {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes buttonPulse {
    0% { transform: scale(1) translateX(0); }
    100% { transform: scale(1.03) translateX(3px); }
  }
  @keyframes glowBorder {
    0% { box-shadow: 0 0 5px #fff, inset 0 0 5px #fff; }
    100% { box-shadow: 0 0 15px #fff, inset 0 0 8px #fff; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .dialog-text {
    overflow: hidden;
    white-space: pre-wrap;
    position: relative;
    text-shadow: 2px 2px #000;
  }
  .dialog-text.typing {
    border-right: 4px solid #fff;
    animation: textBlink 0.7s infinite;
  }
  @keyframes textBlink {
    0%, 100% { border-color: transparent; }
    50% { border-color: #fff; }
  }
  .dialog-button {
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .dialog-button:hover {
    animation: buttonPulse 1s infinite;
    text-shadow: 0 0 5px #fff;
  }
  .dialog-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.5);
    animation: scanline 2s linear infinite;
  }
  .pixel-corners {
    clip-path: polygon(
      0 4px, 4px 4px, 4px 0,
      calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
      100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
      4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
    );
  }
`;
document.head.appendChild(dialogStyle);

// Utility function for a retro-style dialog box 
function showDialogBox(title, message, options = []) {
  // Remove any existing dialog
  const oldDialog = document.getElementById('custom-dialog-box');
  if (oldDialog) oldDialog.remove();

  const dialogContainer = document.createElement('div');
  dialogContainer.id = 'custom-dialog-box';
  dialogContainer.style.position = 'fixed';
  dialogContainer.style.top = '50%';
  dialogContainer.style.left = '50%';
  dialogContainer.style.transform = 'translate(-50%, -50%)';
  dialogContainer.style.backgroundColor = '#000';
  dialogContainer.style.padding = '4px';
  dialogContainer.style.border = '4px solid #fff';
  dialogContainer.style.outline = '4px solid #000';
  dialogContainer.style.boxShadow = '0 0 0 8px #fff, inset 0 0 0 2px #000';
  dialogContainer.style.zIndex = '1000';
  dialogContainer.style.textAlign = 'left';
  dialogContainer.style.width = '500px';
  dialogContainer.style.maxWidth = '90vw';
  dialogContainer.style.fontFamily = '"Press Start 2P", cursive';
  dialogContainer.style.color = '#fff';
  dialogContainer.style.animation = 'dialogAppear 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
  dialogContainer.style.imageRendering = 'pixelated';
  dialogContainer.classList.add('pixel-corners');

  const innerContainer = document.createElement('div');
  innerContainer.style.backgroundColor = '#000';
  innerContainer.style.padding = '20px';
  innerContainer.style.border = '2px solid #fff';
  innerContainer.style.animation = 'glowBorder 1s infinite alternate';
  innerContainer.classList.add('pixel-corners');

  // Add scanline effect
  const scanline = document.createElement('div');
  scanline.style.position = 'absolute';
  scanline.style.top = '0';
  scanline.style.left = '0';
  scanline.style.width = '100%';
  scanline.style.height = '100%';
  scanline.style.background = 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)';
  scanline.style.backgroundSize = '100% 4px';
  scanline.style.pointerEvents = 'none';
  scanline.style.zIndex = '1';
  innerContainer.appendChild(scanline);

  const titleElement = document.createElement('h2');
  titleElement.innerText = '★ ' + title + ' ★';
  titleElement.style.marginBottom = '20px';
  titleElement.style.color = '#ffeb3b';
  titleElement.style.fontSize = '16px';
  titleElement.style.textTransform = 'uppercase';
  titleElement.style.textShadow = '2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000';
  titleElement.style.textAlign = 'center';
  innerContainer.appendChild(titleElement);

  const messageElement = document.createElement('div');
  messageElement.className = 'dialog-text typing';
  messageElement.style.marginBottom = '24px';
  messageElement.style.fontSize = '14px';
  messageElement.style.lineHeight = '1.5';
  messageElement.style.letterSpacing = '1px';
  innerContainer.appendChild(messageElement);

  // Typewriter effect with sound
  let charIndex = 0;
  const typeWriter = () => {
    if (charIndex < message.length) {
      messageElement.textContent = message.substring(0, charIndex + 1);
      charIndex++;
      // Only play sound for non-space characters and every other character to reduce sound frequency
      if (message[charIndex - 1] !== ' ' && charIndex % 2 === 0) {
        sounds.typewriter.currentTime = 0;
        sounds.typewriter.play();
      }
      // Speed up typing even more (from 25ms to 15ms)
      setTimeout(typeWriter, 15);
    } else {
      messageElement.classList.remove('typing');
    }
  };
  // Reduce initial delay before typing starts
  setTimeout(typeWriter, 300);

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'column';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.alignItems = 'flex-start';
  buttonContainer.style.marginTop = '20px';

  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'dialog-button pixel-corners';
    button.innerText = '► ' + option.label;
    button.style.margin = '0';
    button.style.padding = '12px';
    button.style.border = '2px solid #fff';
    button.style.backgroundColor = '#000';
    button.style.color = '#fff';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.fontFamily = '"Press Start 2P", cursive';
    button.style.minWidth = '200px';
    button.style.textAlign = 'left';
    button.style.position = 'relative';
    button.style.opacity = '0';
    button.style.transform = 'translateX(-20px)';
    button.style.animation = `buttonAppear 0.2s ${0.5 + index * 0.08}s forwards`;

    // Add button appear animation
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
      @keyframes buttonAppear {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(buttonStyle);

    button.onmouseover = () => {
      button.style.backgroundColor = '#fff';
      button.style.color = '#000';
      sounds.select.currentTime = 0;
      sounds.select.play();
    };
    button.onmouseout = () => {
      button.style.backgroundColor = '#000';
      button.style.color = '#fff';
    };
    button.onclick = () => {
      // Play click sound
      sounds.click.currentTime = 0;
      sounds.click.play();
      
      // Short delay to let the sound play before action
      setTimeout(() => {
      option.action();
      if (!option.keepOpen) document.body.removeChild(dialogContainer);
      }, 50);
    };
    buttonContainer.appendChild(button);
  });

  innerContainer.appendChild(buttonContainer);
  dialogContainer.appendChild(innerContainer);
  document.body.appendChild(dialogContainer);
}

// Janet Yellen Modal/Iframe Utility
export function showYellenModal(url) {
  let modal = document.getElementById('yellenModal');
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "yellenModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.display = "none";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    document.body.appendChild(modal);

    // Iframe wrapper
    const iframeWrapper = document.createElement("div");
    iframeWrapper.id = "yellenFrameWrapper";
    iframeWrapper.style.position = "relative";
    iframeWrapper.style.overflow = "hidden";
    iframeWrapper.style.width = "90%";
    iframeWrapper.style.maxWidth = "1000px";
    iframeWrapper.style.height = "80%";
    iframeWrapper.style.border = "2px solid #ccc";
    iframeWrapper.style.borderRadius = "8px";
    iframeWrapper.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
    modal.appendChild(iframeWrapper);

    // Iframe
    const yellenFrame = document.createElement("iframe");
    yellenFrame.id = "yellenFrame";
    yellenFrame.style.width = "100%";
    yellenFrame.style.height = "110%";
    yellenFrame.style.position = "absolute";
    yellenFrame.style.top = "-10%";
    yellenFrame.style.left = "0";
    yellenFrame.style.border = "none";
    iframeWrapper.appendChild(yellenFrame);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "#00ff80";
    closeBtn.style.color = "#000";
    closeBtn.style.border = "none";
    closeBtn.style.padding = "10px 15px";
    closeBtn.style.borderRadius = "5px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.boxShadow = "0 0 15px rgba(0,255,128,0.5)";
    closeBtn.style.zIndex = "1100";
    closeBtn.style.transition = "all 0.3s ease";
    closeBtn.onmouseover = () => {
      closeBtn.style.background = "#00cc66";
      closeBtn.style.transform = "scale(1.1)";
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = "#00ff80";
      closeBtn.style.transform = "scale(1)";
    };
    closeBtn.onclick = () => {
      modal.style.display = "none";
      yellenFrame.src = "";
    };
    iframeWrapper.appendChild(closeBtn);
  }
  const yellenFrame = document.getElementById('yellenFrame');
  yellenFrame.src = url;
  modal.style.display = "flex";
}

// --- ENHANCED DIALOGUE HELPERS FOR OTHER NPCS ---

// Add a bonus tip for Frank Sinatra
export function getFrankAdviceList() {
  return [
    "The house always has an edge, so play smart and know when to walk away.",
    "Set a budget before you play, and never chase your losses.",
    "Luck be a lady tonight, but skill keeps you in the game.",
    "Sometimes the best bet is the one you don't make.",
    "Enjoy the thrill, but remember: it's just a game.",
    "Frank's Bonus: Sometimes, the best win is knowing when to call it a night!"
  ];
}

// Add a bonus fact for J.P. Morgan
export function getMorganFacts() {
  return [
    "Stocks represent ownership in a company. When you buy a stock, you become a partial owner and can benefit from its success.",
    "Did you know? J.P. Morgan once bailed out the U.S. government during a financial crisis.",
    "Long-term investing often beats short-term speculation.",
    "Bonus: Diversification is a key to reducing risk in your portfolio."
  ];
}

// Add a bonus question for Satoshi Nakamoto
export function getSatoshiQuestions() {
  return [
    "Bitcoin is a decentralized digital currency, born from a desire for freedom and transparency. It operates without banks or governments.",
    "Did you know? The identity of Satoshi Nakamoto is still a mystery.",
    "Would you rather mine Bitcoin or buy it on an exchange?",
    "Bonus: What do you think the future of money looks like?"
  ];
}

export default showDialogBox;