class HelpPanel2 {
  static toggle() {
    const existing = document.getElementById('help-panel');
    if (existing) {
      existing.remove();
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'help-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #001820;
      color: white;
      border: 2px solid #00ff80;
      border-radius: 10px;
      padding: 20px;
      width: 80%;
      max-width: 500px;
      z-index: 1001;
      font-family: Arial, sans-serif;
    `;
    panel.innerHTML = `
      <h2>🆘 Help & Instructions</h2>
      <ul style="line-height: 1.6;">
        <li><b>Objective:</b> Travel around and visit stocks, crypto, and more!</li
        <li><b>WASD</b> — Move around</li>
        <li><b>E</b> — Interact with characters</li>
        <li><b>H</b> — Toggle this help panel</li>
      </ul>
      <button id="close-help" style="margin-top: 15px;">Close</button>
    `;

    document.body.appendChild(panel);

    document.getElementById('close-help').addEventListener('click', () => {
      panel.remove();
    });
  }
}

export default HelpPanel2;
