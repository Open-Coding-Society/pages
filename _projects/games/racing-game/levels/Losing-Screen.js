export default class LosingScreen {
  constructor({
    container,
    gameControl,
    loserName,
    title = 'Race over',
    message = `${loserName || 'Car'} lost`,
    continueLabel = 'Winner: Continue to next level',
    onContinue
  }) {
    if (!container || !gameControl) {
      throw new TypeError('LosingScreen needs the game container and gameControl');
    }

    this.gameControl = gameControl;
    this.onContinue = onContinue;
    this.isDestroyed = false;
    this.element = this.createElement({ title, message, continueLabel });
    container.appendChild(this.element);

    this.gameControl.pause();
    this.continueButton.focus();
  }

  createElement({ title: screenTitle, message: messageText, continueLabel }) {
    const element = document.createElement('div');
    element.className = 'racing-losing-screen';
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    Object.assign(element.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '40',
      display: 'grid',
      alignContent: 'center',
      justifyItems: 'center',
      padding: '24px',
      backgroundColor: 'rgba(15, 23, 42, 0.88)',
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    });

    const title = document.createElement('h2');
    title.className = 'racing-losing-screen__title';
    title.textContent = screenTitle;
    Object.assign(title.style, {
      margin: '0 0 16px',
      color: '#facc15',
      fontSize: 'clamp(24px, 5vw, 40px)'
    });

    const message = document.createElement('p');
    message.className = 'racing-losing-screen__message';
    message.textContent = messageText;
    Object.assign(message.style, {
      margin: '0 0 12px',
      color: '#f87171',
      fontSize: 'clamp(20px, 4vw, 32px)',
      fontWeight: 'bold'
    });

    this.status = document.createElement('p');
    this.status.className = 'racing-losing-screen__status';
    this.status.textContent = 'Restart only if both players agree.';
    Object.assign(this.status.style, { margin: '0 0 16px', fontSize: '16px' });

    const buttons = document.createElement('div');
    buttons.className = 'racing-losing-screen__buttons';
    Object.assign(buttons.style, {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px'
    });

    this.continueButton = document.createElement('button');
    this.continueButton.type = 'button';
    this.continueButton.className = 'racing-losing-screen__continue';
    this.continueButton.textContent = continueLabel;
    Object.assign(this.continueButton.style, {
      padding: '8px 14px',
      border: '1px solid #86efac',
      borderRadius: '4px',
      backgroundColor: '#166534',
      color: '#f8fafc',
      font: 'bold 14px sans-serif',
      cursor: 'pointer'
    });
    this.continueButton.addEventListener('click', () => this.continue());

    this.restartButton = document.createElement('button');
    this.restartButton.type = 'button';
    this.restartButton.className = 'racing-losing-screen__restart';
    this.restartButton.textContent = 'Restart level (mutual agreement)';
    Object.assign(this.restartButton.style, {
      padding: '8px 14px',
      border: '1px solid #f87171',
      borderRadius: '4px',
      backgroundColor: '#b91c1c',
      color: '#f8fafc',
      font: 'bold 14px sans-serif',
      cursor: 'pointer'
    });
    this.restartButton.addEventListener('click', () => this.restart());

    buttons.append(this.continueButton, this.restartButton);
    element.append(title, message, this.status, buttons);
    return element;
  }

  continue() {
    if (this.isDestroyed) return;
    this.destroy();
    this.gameControl.resume();
    this.onContinue?.();
  }

  restart() {
    if (this.isDestroyed) return;
    this.destroy();
    this.gameControl.resume();
    this.gameControl.transitionToLevel();
  }

  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.element.remove();
  }
}
