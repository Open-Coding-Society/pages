import GameObject from '@assets/js/GameEnginev1.1/essentials/GameObject.js';
import Player from '@assets/js/GameEnginev1.1/essentials/Player.js';
import RacingBot from './RacingBot.js';

const MOVEMENT_KEYS = new Set([37, 38, 39, 40, 65, 68, 83, 87]);

export default class RaceDifficultyPrompt extends GameObject {
  constructor(data = {}, gameEnv = null) {
    super(gameEnv);
    this.bot = this.gameEnv?.gameObjects?.find((object) => object instanceof RacingBot);
    this.cars = this.gameEnv?.gameObjects?.filter((object) => object instanceof Player) || [];
    if (!this.gameEnv?.container || !this.gameEnv?.gameControl || !this.bot || this.cars.length === 0) {
      throw new Error('RaceDifficultyPrompt requires the autumn cars and game environment');
    }

    this.gameControl = this.gameEnv.gameControl;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.element = this.createElement();
    this.gameEnv.container.appendChild(this.element);
    document.addEventListener('keydown', this.handleKeyDown, true);
    this.gameControl.pause();
    this.easyButton.focus();
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'racing-difficulty';
    Object.assign(element.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '30',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2, 6, 23, 0.68)',
      fontFamily: 'sans-serif',
    });
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-labelledby', 'racing-difficulty-title');

    const content = document.createElement('div');
    content.className = 'racing-difficulty__content';
    Object.assign(content.style, {
      width: 'min(100%, 420px)',
      boxSizing: 'border-box',
      padding: '24px',
      border: '2px solid #facc15',
      borderRadius: '12px',
      background: '#0f172a',
      color: '#f8fafc',
      textAlign: 'center',
    });

    const title = document.createElement('h2');
    title.id = 'racing-difficulty-title';
    title.textContent = 'Choose your opponent';
    Object.assign(title.style, {
      margin: '0 0 16px',
      color: '#facc15',
      fontSize: 'clamp(24px, 5vw, 40px)',
    });

    const description = document.createElement('p');
    description.textContent = 'Select the blue car difficulty before the race starts.';
    Object.assign(description.style, {
      margin: '0 0 20px',
      fontSize: '16px',
    });

    const buttons = document.createElement('div');
    buttons.className = 'racing-difficulty__buttons';
    Object.assign(buttons.style, {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px',
    });

    this.easyButton = document.createElement('button');
    this.easyButton.type = 'button';
    this.easyButton.className = 'racing-difficulty__button';
    this.easyButton.textContent = 'Easy';
    this.styleButton(this.easyButton, '#166534', '#86efac');
    this.easyButton.addEventListener('click', () => this.startRace('hardcoded'));

    this.hardButton = document.createElement('button');
    this.hardButton.type = 'button';
    this.hardButton.className = 'racing-difficulty__button';
    this.hardButton.textContent = 'Hard';
    this.styleButton(this.hardButton, '#1d4ed8', '#93c5fd');
    this.hardButton.addEventListener('click', () => this.startRace('ai'));

    buttons.append(this.easyButton, this.hardButton);
    content.append(title, description, buttons);
    element.appendChild(content);
    return element;
  }

  styleButton(button, backgroundColor, borderColor) {
    Object.assign(button.style, {
      minWidth: '120px',
      padding: '12px 20px',
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      backgroundColor,
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
    });
  }

  handleKeyDown(event) {
    if (!MOVEMENT_KEYS.has(event.keyCode)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  startRace(mode) {
    this.bot.setMode(mode);
    for (const car of this.cars) {
      car.pressedKeys = {};
      car.speed = 0;
      car.velocity.x = 0;
      car.velocity.y = 0;
    }
    this.destroy();
    this.gameControl.resume();
  }

  update() {}

  draw() {}

  resize() {}

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
    this.element.remove();
    const index = this.gameEnv?.gameObjects?.indexOf(this) ?? -1;
    if (index >= 0) this.gameEnv.gameObjects.splice(index, 1);
  }
}
