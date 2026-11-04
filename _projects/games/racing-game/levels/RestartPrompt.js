/**
 * RestartPrompt - asks "Are you sure you want to restart the race?" before reloading the level.
 *
 * Opened by pressing R or calling open() (the HUD's Restart button). While it is open the game is
 * paused; pressing R again or clicking Yes restarts, pressing N or clicking No carries on racing.
 * Styles live in sass/main.scss (.racing-restart-prompt).
 */
const RESTART_KEY = 'r';
const CANCEL_KEY = 'n';

export default class RestartPrompt {
  constructor({ container, gameControl }) {
    if (!container || !gameControl) {
      throw new TypeError('RestartPrompt needs the game container and gameControl');
    }
    this.container = container;
    this.gameControl = gameControl;
    this.element = this.createElement();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'racing-restart-prompt';
    element.hidden = true;
    element.innerHTML = `
      <p class="racing-restart-prompt__question">Are you sure you want to restart the race?</p>
      <div class="racing-restart-prompt__buttons">
        <button type="button" class="racing-restart-prompt__yes">Yes, restart (R)</button>
        <button type="button" class="racing-restart-prompt__no">No (N)</button>
      </div>
    `;
    element.querySelector('.racing-restart-prompt__yes').addEventListener('click', () => this.confirm());
    element.querySelector('.racing-restart-prompt__no').addEventListener('click', () => this.cancel());
    this.container.appendChild(element);
    return element;
  }

  isOpen() {
    return !this.element.hidden;
  }

  open() {
    // Don't stack on top of the pause menu or another paused state.
    if (this.isOpen() || this.gameControl.isPaused) return;
    this.gameControl.pause();
    this.element.hidden = false;
  }

  cancel() {
    if (!this.isOpen()) return;
    this.element.hidden = true;
    this.gameControl.resume();
  }

  confirm() {
    if (!this.isOpen()) return;
    this.element.hidden = true;
    this.gameControl.resume();
    // Reloading the level resets cars, laps and the timer, and destroys this prompt.
    this.gameControl.transitionToLevel();
  }

  handleKeyDown(event) {
    // Typing in a code editor or text box should never restart the race.
    const target = event.target;
    if (event.repeat || (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === RESTART_KEY) {
      if (this.isOpen()) {
        this.confirm();
      } else {
        this.open();
      }
    } else if (key === CANCEL_KEY && this.isOpen()) {
      this.cancel();
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.element.remove();
  }
}
